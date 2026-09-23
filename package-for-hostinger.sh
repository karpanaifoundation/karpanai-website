#!/usr/bin/env bash
# Packages the site into a zip ready to upload via Hostinger's File Manager.
# Extract it straight into public_html (or a subfolder) - index.html lands at
# the top level, and every internal link is a relative path, so it works the
# same whether it's the root site or a subfolder.
set -euo pipefail

cd "$(dirname "$0")"

OUT_NAME="karpanai-website-$(date +%Y%m%d-%H%M%S).zip"
OUT_PATH="../$OUT_NAME"

rm -f "$OUT_PATH"

zip -r "$OUT_PATH" . \
  -x ".git/*" \
  -x ".gitignore" \
  -x ".nojekyll" \
  -x ".DS_Store" \
  -x "*/.DS_Store" \
  -x ".claude/*" \
  -x "README.md" \
  -x "package-for-hostinger.sh" \
  > /dev/null

echo "Packaged: $(cd .. && pwd)/$OUT_NAME"
