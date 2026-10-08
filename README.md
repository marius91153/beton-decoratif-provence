# Béton Décoratif Provence

French-language website for stamped concrete (béton imprimé): outdoor terraces, access paths and pool surrounds, a gallery of the business's actual projects, an indicative color palette, the project process, frequently asked questions and a quote request form. Built with Vite and plain HTML, CSS and JavaScript. Six locally hosted photographs come from the owner's public TikTok posts; provenance and the limits of social-profile access are recorded in [docs/social-media-sources.md](docs/social-media-sources.md).

Facebook, Instagram, TikTok and WhatsApp buttons use the owner's supplied accounts. WhatsApp also appears in the fixed mobile contact bar and quotation section. The telephone link uses the number published in the TikTok biography, `07 54 25 36 93`. The site offers the free, personalized, no-obligation quote stated in that biography. Exposed-aggregate concrete (béton désactivé) is presented separately from stamped concrete.

The visual direction follows the owner's other site, `urbiscor.ro`: a dark header and full-width hero, golden calls to action, Manrope headings, Inter body text and fixed quotation actions on mobile. `src/theme.css` defines this visual layer; `src/styles.css` provides the base layout and controls. Fontsource packages supply the locally hosted fonts under the SIL Open Font License, included in `public/fonts`.

## Develop

Use Node.js 24 LTS and npm. The cloud checkout is `/workspace/beton-decoratif-provence`; use the existing checkout, since each cloud task is already isolated.

```sh
npm ci
npm run dev
```

Build and check the production output:

```sh
npm run build
npm test
```

The tests run on Chromium at desktop and mobile sizes. They exercise navigation, finish filters and dialogs, quote request validation, successful submission, failed submission and narrow-screen layout. They mock Netlify's form endpoint; they do not establish live delivery. The test runner uses `/usr/bin/chromium` when available. Elsewhere, install a browser with `npx playwright install chromium`, or set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to a compatible Chromium executable.

## Netlify

`netlify.toml` uses `npm run build`, publishes `dist` and selects Node.js 24. Connect this repository to the existing Netlify project and use the intended production branch. No Netlify credentials are required for local development.

The configured Netlify address is `https://beton-decoratif-provence.netlify.app/`, connected to the production branch `main`.

### Manual publication when production uploads are blocked

The tested alternative is a local build, a draft deployment using a file manifest, upload of the requested files, then publication of the ready deployment through Netlify's `restore` API. A direct production ZIP upload returned HTTP 403 for exhausted account credits; the preview-and-restore workflow was accepted on this account. It uses supported API operations and does not change the billing plan. Availability still depends on Netlify's current account rules.

```sh
npm run deploy:netlify
```

This command requires Python 3.11+ and a Netlify personal access token with access to the existing project. Provide it through the secure `BDP_NETLIFY_TOKEN` environment binding, or enter it at the hidden interactive prompt. Never place a token in a command argument or commit it. The script rebuilds for Netlify, includes the headers from `netlify.toml`, enables form detection and configures the quote notification for `contact@betondecoratifprovence.fr`. It only targets this project's verified site and repository. For a preview without publishing, use `npm run deploy:netlify -- --preview-only`.

Enable form detection in the Netlify project before deployment. The static `devis` form includes `data-netlify`, its form name and a honeypot. On Netlify, successful requests go to `/merci/`. Without JavaScript, the HTML form also submits natively. Configure submission notifications in Netlify, then verify a real submission after deployment. The local Vite server does not process form submissions.

## Before the first public release

- Approve the final brand details and design. The public Urbiscor site has now been inspected and its visual direction adapted to this project's French-language content.
- Confirm service descriptions, available finishes, coverage area and branding with the business owner.
- Add the business's legal identification, privacy contact, retention policy and any required legal notices. The current short data-use explanation is not a complete privacy policy.
- The gallery now uses the owner's social project photographs. Original high-resolution photographs can replace video covers when available; each selected image links to its public source.
- Commit and push the reviewed source to GitHub, deploy on Netlify and verify the live form. Creating files locally does not publish the site.

No analytics, remote fonts or third-party image requests are included.

## Automatic publication after a commit

Push commits to `main`. `.github/workflows/deploy.yml` builds and tests both site variants in GitHub Actions, then publishes GitHub Pages with the official Pages actions and Netlify through the tested preview-and-restore API workflow. Netlify does not build this release on its own infrastructure. Releases run in sequence so an older build cannot overwrite a newer release. `workflow_dispatch` allows retrying the latest `main` release from the Actions page. Both hosting jobs reject other source branches, including manual dispatches. Pages uses the `github-pages-actions` environment for this main-branch workflow; the legacy `github-pages` environment retains its existing `gh-pages` branch restriction.

GitHub Actions needs a repository secret named `BDP_NETLIFY_TOKEN`, containing a Netlify personal access token that can access this project. Configure it at **GitHub → repository Settings → Secrets and variables → Actions**. The same-named Codex secret belongs to a separate system and is not automatically available to GitHub Actions. Credentials are supplied only to the deployment steps, never committed or included in the site's client variables.

Also select **GitHub → repository Settings → Pages → Build and deployment → Source → GitHub Actions**. GitHub's workflow token can deploy Pages artifacts but cannot change this repository setting; the workflow checks it and reports a precise setup error. The available Codex GitHub integration also returned HTTP 403 when changing Pages settings or saving the Actions secret. Once these two repository settings are configured, subsequent pushes and workflow retries require no manual upload.

Both required GitHub settings are now configured, and the automatic release workflow successfully published both hosting variants on 2026-10-08. Netlify's own Git-triggered builds are stopped (`stop_builds: true`), while its GitHub repository connection remains intact. GitHub Actions builds the website and publishes through the supported API route, avoiding redundant builds on Netlify.

Each build includes `release.json` with its source commit and working-tree status. Compare that commit on both public hosts with the completed Actions run to confirm that the actual latest release is live. Local commits need to be pushed before the remote workflow runs. GitHub Actions results are visible at `https://github.com/marius91153/beton-decoratif-provence/actions/workflows/deploy.yml`.

## GitHub Pages alternative

The business contact address is `contact@betondecoratifprovence.fr`. `npm run build:pages` builds the site for `/beton-decoratif-provence/` and changes the quote form into an email preparation flow. The visitor fills in the project, prepares the email, opens their mail app and sends it. Preparing the draft does not deliver a message. There is also a direct email link and a native mail form fallback. The Netlify build keeps its original form handler.

Validate this version with `npm run build:pages` followed by `PAGES_TEST=1 npm test`. `npm run deploy:pages` requests the automatic release workflow for the pushed `main` branch; it requires GitHub Actions workflow-dispatch access through `gh`. The workflow runs both hosting jobs. Local, unpushed changes are not part of that release.

The workflow publishes GitHub Pages in Actions mode at `https://marius91153.github.io/beton-decoratif-provence/`. The previous `gh-pages` branch remains as release history. Check the workflow result and public `release.json` after GitHub finishes publishing.
