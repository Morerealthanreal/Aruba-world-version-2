#!/bin/sh
# Builds the add-ons and writes a static, deploy-ready copy of the merged game to ./deploy
set -e
cd "$(dirname "$0")"
python3 tools/build_hero_manifest.py
(cd addons && npm run build >/dev/null)
rm -rf deploy && mkdir deploy
(cd game && tar -cf - .) | tar -xf - -C deploy
touch deploy/.nojekyll            # Pages: serve files as-is (no Jekyll processing)
cp DEPLOY.md deploy/DEPLOY.md
printf '# Aruba World (preview)\n\nMerged preview build: live Aruba World + day/night, night lighting and auto-FPS add-ons.\nPlay: https://morerealthanreal.github.io/aruba-world-preview/?q=low (phones)\n\nMap data (c) OpenStreetMap contributors (ODbL).\n' > deploy/README.md
echo "deploy/ ready: $(du -sh deploy | cut -f1), $(find deploy -type f | wc -l) files"
