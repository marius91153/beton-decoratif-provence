#!/usr/bin/env python3
"""Build locally, upload a Netlify preview, then publish the ready deployment."""

import argparse
import getpass
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import time
import tomllib
import urllib.error
import urllib.parse
import urllib.request
import warnings

ROOT = Path(__file__).resolve().parent.parent
SITE_ID = "4b02d3ed-107d-4b3f-be86-c9e9c4846444"
SITE_NAME = "beton-decoratif-provence"
CONTACT = "contact@betondecoratifprovence.fr"
API = "https://api.netlify.com/api/v1"


class SafeRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, message, headers, new_url):
        if urllib.parse.urlsplit(new_url).hostname != "api.netlify.com":
            raise RuntimeError("Refusing to forward API authorization to another host")
        return super().redirect_request(request, fp, code, message, headers, new_url)


class Netlify:
    def __init__(self, token):
        self.token = token
        self.opener = urllib.request.build_opener(SafeRedirect())

    def request(self, path, method="GET", data=None):
        headers = {"Authorization": "Bearer " + self.token, "Accept": "application/json"}
        if data is not None:
            headers["Content-Type"] = "application/octet-stream" if isinstance(data, bytes) else "application/json"
            if not isinstance(data, bytes):
                data = json.dumps(data).encode()
        request = urllib.request.Request(API + path, method=method, headers=headers, data=data)
        try:
            with self.opener.open(request, timeout=35) as response:
                body = response.read()
                return json.loads(body) if body else None
        except urllib.error.HTTPError as error:
            try:
                payload = json.loads(error.read())
                message = payload.get("message") or payload.get("error") or payload.get("msg") or "Request rejected"
            except (ValueError, AttributeError):
                message = "Request rejected"
            raise RuntimeError(f"Netlify HTTP {error.code}: {str(message).replace(self.token, '[redacted]')[:500]}") from None

    def wait(self, deploy, states):
        deadline = time.monotonic() + 120
        previous = None
        while True:
            if deploy.get("site_id") != SITE_ID:
                raise RuntimeError("Deployment does not belong to the expected site")
            state = deploy.get("state")
            if state != previous:
                print("Netlify deployment:", state, flush=True)
                previous = state
            if state in states:
                return deploy
            if state == "error":
                raise RuntimeError("Deployment failed: " + str(deploy.get("error_message") or "unknown error").replace(self.token, "[redacted]"))
            if time.monotonic() >= deadline:
                raise RuntimeError("Deployment timed out; inspect " + deploy["id"] + " before retrying")
            time.sleep(2)
            deploy = self.request("/deploys/" + deploy["id"])


def build_files(skip_build=False):
    if not skip_build:
        subprocess.run(["npm", "run", "build"], cwd=ROOT, check=True)
    files = {p.relative_to(ROOT / "dist").as_posix(): p.read_bytes() for p in (ROOT / "dist").rglob("*") if p.is_file()}
    html = files["index.html"].decode()
    if "Le béton imprimé." not in html or CONTACT not in html or 'data-contact-mode="email"' in html or "merci/index.html" not in files:
        raise RuntimeError("The output is not the expected Netlify build")
    release = json.loads(files["release.json"])
    source_commit = subprocess.check_output(["git", "rev-parse", "--verify", "HEAD"], cwd=ROOT, text=True).strip()
    if release.get("commit") != source_commit or (os.environ.get("CI") and release.get("dirty") is not False):
        raise RuntimeError("The build is stale or does not represent the clean source commit; rebuild before publishing")
    settings = tomllib.loads((ROOT / "netlify.toml").read_text())
    headers = []
    for rule in settings.get("headers", []):
        headers.append(rule["for"])
        headers.extend(f"  {key}: {value}" for key, value in rule.get("values", {}).items())
    if headers:
        files["_headers"] = ("\n".join(headers) + "\n").encode()
    return files


def configure_notifications(client):
    forms = client.request(f"/sites/{SITE_ID}/forms")
    matches = [form for form in forms if form.get("name") == "devis"]
    if len(matches) != 1:
        raise RuntimeError("Site published, but Netlify did not detect the devis form uniquely")
    form_id = matches[0]["id"]
    hooks = client.request("/hooks?site_id=" + SITE_ID)
    if not any(hook.get("type") == "email" and hook.get("event") == "submission_created" and hook.get("form_id") == form_id and (hook.get("data") or {}).get("email") == CONTACT for hook in hooks):
        client.request("/hooks", "POST", {"site_id": SITE_ID, "form_id": form_id, "type": "email", "event": "submission_created", "data": {"email": CONTACT}})
    print("Quote form detected; email notification configured for", CONTACT, flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--preview-only", action="store_true", help="Upload a preview without changing the published deployment")
    parser.add_argument("--skip-build", action="store_true", help="Publish the already built and tested Netlify output")
    options = parser.parse_args()
    if os.environ.get("CI") and not os.environ.get("BDP_NETLIFY_TOKEN"):
        raise RuntimeError("Add the BDP_NETLIFY_TOKEN repository secret in GitHub Actions before publishing")
    files = build_files(options.skip_build)
    warnings.simplefilter("error", getpass.GetPassWarning)
    token = os.environ.get("BDP_NETLIFY_TOKEN") or getpass.getpass("Netlify token (hidden): ")
    client = Netlify(token)
    site = client.request("/sites/" + SITE_ID)
    if site.get("name") != SITE_NAME or (site.get("build_settings") or {}).get("repo_path") != "marius91153/beton-decoratif-provence":
        raise RuntimeError("The Netlify project does not match the expected repository")
    processing = dict(site.get("processing_settings") or {})
    if processing.get("ignore_html_forms") is not False:
        processing["ignore_html_forms"] = False
        client.request("/sites/" + SITE_ID, "PATCH", {"processing_settings": processing})
        print("Enabled Netlify form detection", flush=True)
    manifest = {name: hashlib.sha1(content).hexdigest() for name, content in files.items()}
    source_commit = json.loads(files["release.json"])["commit"]
    query = urllib.parse.urlencode({"title": "Publish source " + source_commit})
    deploy = client.request(f"/sites/{SITE_ID}/deploys?{query}", "POST", {"files": manifest, "draft": True, "async": True})
    print("Created preview:", deploy["id"], flush=True)
    deploy = client.wait(deploy, {"prepared", "ready"})
    if deploy.get("context") != "deploy-preview" or deploy.get("published_at"):
        raise RuntimeError("Expected an unpublished preview deployment")
    uploads = {digest: (name, files[name]) for name, digest in manifest.items()}
    required = set(deploy.get("required") or [])
    if not required <= uploads.keys():
        raise RuntimeError("Netlify requested files outside the local build")
    for digest in sorted(required):
        name, content = uploads[digest]
        client.request("/deploys/" + deploy["id"] + "/files/" + urllib.parse.quote(name, safe="/"), "PUT", content)
    deploy = client.wait(client.request("/deploys/" + deploy["id"]), {"ready"})
    print("Preview ready:", deploy.get("deploy_ssl_url"), flush=True)
    if options.preview_only:
        return
    client.request(f"/sites/{SITE_ID}/deploys/{deploy['id']}/restore", "POST")
    published = client.request("/sites/" + SITE_ID)
    if (published.get("published_deploy") or {}).get("id") != deploy["id"]:
        raise RuntimeError("Netlify has not confirmed the preview as the published deployment")
    print("Published:", "https://beton-decoratif-provence.netlify.app/", flush=True)
    configure_notifications(client)


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
