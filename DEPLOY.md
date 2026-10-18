> **ship.sh / redeploy.sh are retired.** Production deploys run from GitHub Actions on push to main. See README.md.

# Publish the merged preview as a SEPARATE GitHub Pages site

Target: new repo **Morerealthanreal/aruba-world-preview** → https://morerealthanreal.github.io/aruba-world-preview/
Do **not** touch the live repo `Morerealthanreal/aruba-world` (no pushes, no settings, no Pages changes there).

Folder to publish: `/workspace/aruba-world-merged/deploy/` (static files, ~205 MB, ~1,260 files, largest file < 50 MB,
all paths relative so the `/aruba-world-preview/` sub-path works). Regenerate it any time with `./make-deploy.sh`.

## Steps (gh CLI logged in as Morerealthanreal)
```bash
cd /workspace/aruba-world-merged && ./make-deploy.sh           # fresh build into ./deploy
gh auth status                                                  # must show Morerealthanreal
gh repo view Morerealthanreal/aruba-world-preview >/dev/null 2>&1 && echo "EXISTS - stop and ask" && exit 1

cd deploy
git init -b main
git add -A
git -c user.name="Morerealthanreal" -c user.email="Morerealthanreal@users.noreply.github.com" commit -m "Aruba World preview build"
gh repo create Morerealthanreal/aruba-world-preview --public --source=. --remote=origin --push \
  --description "Aruba World merged preview (day/night + night lights + auto FPS)"

# enable Pages from main / root
gh api -X POST repos/Morerealthanreal/aruba-world-preview/pages \
  -f "source[branch]=main" -f "source[path]=/"
# wait for the first build (1-3 min)
gh api repos/Morerealthanreal/aruba-world-preview/pages/builds/latest --jq .status   # -> built
```

## Verify
```bash
U=https://morerealthanreal.github.io/aruba-world-preview
for f in "" "addons/aw-addons.js" "assets/index-D_YJh5Nn.js" "data/aruba.json" "data/real/r_0_0.json" "models/car.glb"; do
  curl -s -o /dev/null -w "%{http_code} $f\n" "$U/$f"; done            # all 200
```
Phone link: `https://morerealthanreal.github.io/aruba-world-preview/?q=low`

## Notes
- Push is ~205 MB; if HTTPS push times out, retry with `git config http.postBuffer 524288000`.
  Pages limits: site <= 1 GB, files < 100 MB — this build is within both.
- Pages caches for ~10 min (`max-age=600`); after an update, bump `?v=` on the add-on script tag in `index.html` (`make-deploy.sh` copies it as-is).
- Updating later: `./make-deploy.sh`, then copy `deploy/` over the clone of aruba-world-preview, commit, push.
- `?addons=0` on the URL shows the untouched live build for side-by-side comparison.
- Do not add a custom domain/CNAME; that could collide with the live site's settings.
