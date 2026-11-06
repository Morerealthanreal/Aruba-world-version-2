#!/bin/sh
# Rebuild the hero manifest and the add-ons, then serve at http://127.0.0.1:8777/
cd "$(dirname "$0")"
python3 tools/build_hero_manifest.py
cd addons && npm run build >/dev/null && cd ../game && exec python3 -m http.server 8777 --bind 127.0.0.1
