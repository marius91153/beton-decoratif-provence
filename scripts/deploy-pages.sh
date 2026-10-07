#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build:pages
touch dist/.nojekyll
pages_origin=$(git remote get-url origin)
pages_directory=$(mktemp -d /tmp/beton-pages.XXXXXX)
trap 'rm -rf "$pages_directory"' EXIT
if git ls-remote --exit-code --heads "$pages_origin" refs/heads/gh-pages >/dev/null 2>&1; then
  git clone --quiet --depth 1 --single-branch --branch gh-pages "$pages_origin" "$pages_directory"
  git -C "$pages_directory" rm -r --ignore-unmatch --quiet .
else
  git -C "$pages_directory" init --quiet --initial-branch=gh-pages
  git -C "$pages_directory" remote add origin "$pages_origin"
fi
git -C "$pages_directory" config user.name "$(git config user.name)"
git -C "$pages_directory" config user.email "$(git config user.email)"
cp -R dist/. "$pages_directory/"
git -C "$pages_directory" add --all
if ! git -C "$pages_directory" diff --cached --quiet; then
  pages_source=$(git rev-parse --short HEAD)
  git -C "$pages_directory" commit --quiet -m "Publish website from $pages_source"
fi
GIT_TERMINAL_PROMPT=0 git -C "$pages_directory" push origin gh-pages
