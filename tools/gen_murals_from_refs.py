#!/usr/bin/env python3
"""Build mural tile JPEGs from refs/murals/<id>/reference.jpg using mural_recreate_from_ref."""
from __future__ import annotations

import importlib.util
import json
from pathlib import Path

from mural_recreate_from_ref import save_recreation

ROOT = Path(__file__).resolve().parents[1]
REFS = ROOT / "refs" / "murals"
MANIFEST = Path(__file__).resolve().parent / "mural_ref_manifest.json"
MURAL_OUT = Path(__file__).resolve().parent / "sn_paintings" / "murals"
FAMOUS_OUT = Path(__file__).resolve().parent / "sn_paintings" / "famous"

# Per-mural crop tweaks (fractions of reference image) for tighter mural band.
CROPS: dict[str, tuple[float, float, float, float]] = {
    "mo": (0.05, 0.12, 0.95, 0.88),
    "melting_pot": (0.15, 0.2, 0.85, 0.75),
}


def load_specs(module_path: Path, var: str) -> list[dict]:
    spec = importlib.util.spec_from_file_location("paint_mod", module_path)
    mod = importlib.util.module_from_spec(spec)
    assert spec.loader
    spec.loader.exec_module(mod)
    return getattr(mod, var)


def main() -> None:
    manifest = json.loads(MANIFEST.read_text())
    sn_specs = {s["id"]: s for s in load_specs(ROOT / "tools" / "paint_sn_murals.py", "SPECS")}
    famous_specs = {s["id"]: s for s in load_specs(ROOT / "tools" / "paint_sn_famous.py", "SPECS")}

    for mid, entry in manifest.items():
        if entry.get("skip"):
            continue
        ref = REFS / mid / "reference.jpg"
        if not ref.exists():
            print("skip no ref", mid)
            continue
        if mid in sn_specs:
            s = sn_specs[mid]
            tw, th = int(s["pw"]), int(s["ph"])
            out = MURAL_OUT / f"{mid}.jpg"
            save_recreation(ref, out, tw, th, crop=CROPS.get(mid), colors=42, seed=hash(mid) % 1000)
            print("sn_murals", mid, "->", out)
        elif mid in famous_specs:
            s = famous_specs[mid]
            tw = int(s["ph"] * 1.6)  # approximate aspect before fit() in paint
            th = int(s["ph"])
            out = FAMOUS_OUT / s["src"]
            save_recreation(ref, out, tw, th, crop=CROPS.get(mid), colors=40, seed=hash(mid) % 1000)
            print("famous", mid, "->", out)


if __name__ == "__main__":
    MURAL_OUT.mkdir(parents=True, exist_ok=True)
    main()
