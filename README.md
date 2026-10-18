# Aruba World

Three.js open-world Aruba. Live: https://aruba-world-justin.surge.sh

## Deploying
**Deploys are automatic.** Every push to `main` runs `.github/workflows/deploy.yml`, which:
1. builds `deploy/` with `make-deploy.sh`,
2. runs `tools/check_manifest.py` against the previous `main` manifest **and** the live manifest. If any model id would be dropped, the deploy is blocked,
3. deploys to surge, then re-checks the live manifest.

Preview: push any commit to the `deploy/preview` branch to deploy to https://aruba-world-justin-preview.surge.sh.
Runs are serialized per domain (no overlapping deploys).

### `ship.sh` / `redeploy.sh` are RETIRED
Do not deploy by hand. Merge to `main` (with `tools/manifest_union.py` when combining hero manifests) and let CI ship it.
`redeploy.sh` now refuses to run unless `ALLOW_MANUAL_DEPLOY=1` (emergency only), so an old `ship.sh` can't double-deploy;
its remaining steps (checks + push to main) just hand off to CI.
