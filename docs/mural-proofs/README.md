# Mural proof images

## Pilot workflow (Justin accuracy path)

1. Verify SAC photo → `refs/murals/<id>/street-photo.jpg` + `SOURCES.md`
2. Define homography + masks → `refs/murals/<id>/rectify.json`
3. Build flat tile: `python3 tools/mural_rectify.py`
4. Pack atlas: `python3 tools/paint_sn_murals.py` (rectified IDs auto-used)
5. Proofs: `python3 tools/build_pilot_mural_proofs.py` → `*_pilot.jpg`

Rules: 4-point homography, mask sky/fixtures/people, inpaint or flat-fill obstructions, **light colour balance only** (no blur/posterize/grain).

SAC recent: **off by default** (`?snsacrecent=1`).

Perf estimate: `python3 tools/mural_atlas_perf.py`
