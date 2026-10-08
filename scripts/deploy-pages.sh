#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
gh workflow run deploy.yml --ref main
