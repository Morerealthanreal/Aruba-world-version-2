# Mural workflow

1. **Reference photos** — Download real wall photos (Street Art Cities, artist sites, news, Street View). Store under `refs/murals/<mural_id>/` with `SOURCES.md` listing URLs. Never ship these files as in-game textures.
2. **Paint** — Rebuild each panel with `tools/mural_recreate_from_ref.py` (or hand-painted logic in `tools/paint_sn_*.py`). Match composition, color, figures, and text; no crude placeholder shapes.
3. **Proof** — Each PR adds `docs/mural-proofs/<batch>/` side-by-sides: reference vs in-game (`tools/mural_proof_composite.py`, `tools/capture_*_proofs.mjs`).
4. **Skip** — If no verifiable photo of the actual wall exists, omit the mural.

Atlas packing: use `tools/mural_pack.py` so tile UVs stay within `[0, 1]`.

## Live batch commands

```bash
python3 tools/fetch_mural_refs.py      # refs/murals/<id>/reference.jpg + SOURCES.md
PYTHONPATH=tools python3 tools/gen_murals_from_refs.py
python3 tools/paint_sn_murals.py && python3 tools/paint_sn_famous.py && python3 tools/paint_sn_sac_recent.py
```

Placeholder PRs **#107**, **#108**, **#125–#128** are closed; work lands on `main` via photo-faithful batches like PR #131+.
