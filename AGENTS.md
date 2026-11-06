# Aruba World agent notes

## Hero places

Each hero is one file: `refs/places/_registry/<id>.json`.

`python3 tools/build_hero_manifest.py` writes `game/data/hero/manifest.json` from those files. The manifest is generated. Do not edit it and do not commit it. `serve.sh`, `make-deploy.sh`, and the browser tests build it.

`_ord` is the load order and is stripped from the generated manifest. A new place uses the next `_ord`. Set `rev` on that file only when its GLB bytes change. The loader requests `models/hero/<id>.glb?v=<rev>`, and places without `rev` keep the fallback stamp already in the bundle.

Do not bump `tools/patch_herover.py`, `game/index.html`, or `game/assets/index-D_YJh5Nn.js` to publish a landmark. `patch_herover.py` only installs the per-place loader, and it is already installed.

To adopt a monolith after an old tool rewrites `game/data/hero/manifest.json`:

```bash
python3 tools/build_hero_manifest.py --adopt
```

## Beach outfits

Each outfit is one file: `addons/src/outfits/<order>-<name>.ts`. `npm run build` in `addons/` generates `addons/src/outfits/index.ts`. Do not edit the generated index. A new body is a new numbered file. Keep the six current bodies distinct. The casual woman keeps the white tank and denim.

## Checks

Low and High both have to pass. Do not raise a soak gate and do not commit a baseline for a pull request to clear. The browser workflow rebuilds the hero manifest and checks it still contains every place on `main`.

Reference photos stay in `refs/places/<area>/<place>/`. They are not the hero registry. Boards are JPEG, longest side at most 1280, at most 300 KB, labeled "photo" and "in game". Do not put people in hotel scenes. Do not paste a photo onto geometry except the mural.
