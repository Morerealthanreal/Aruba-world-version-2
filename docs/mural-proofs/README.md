# Mural proof images

Hand-painted mural pilot (PR workflow after #132 rejection):

1. Download and verify the real wall photo → `refs/murals/<id>/street-photo.jpg` + `SOURCES.md`.
2. Rebuild the artwork as a **flat hand-painted texture** in `tools/paint_sn_murals.py` (no crop/blur/posterize of the photo).
3. Regenerate atlas: `python tools/paint_sn_murals.py`
4. Build side-by-sides: `python tools/build_pilot_mural_proofs.py` → `docs/mural-proofs/<id>_pilot.jpg`

SAC recent murals stay **off by default** (`?snsacrecent=1` to preview).
