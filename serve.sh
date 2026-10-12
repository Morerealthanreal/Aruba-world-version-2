#!/bin/sh
# Rebuild the add-ons and serve the merged game at http://127.0.0.1:8777/
cd "$(dirname "$0")/addons" && npm run build >/dev/null && cd ../game && exec python3 -m http.server 8777 --bind 127.0.0.1
