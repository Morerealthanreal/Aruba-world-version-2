#!/usr/bin/env python3
"""Fail when a hero place points at a GLB that is not in the game tree."""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"


def main():
    places = json.loads(MANIFEST.read_text())
    missing = []
    for place in places:
        rel = str(place.get("glb", "")).lstrip("./")
        if not rel or not (ROOT / "game" / rel).is_file():
            missing.append(f"{place.get('id')} {rel}")
    if missing:
        print(f"missing hero glbs: {len(missing)}")
        print("\n".join(missing[:20]))
        sys.exit(1)
    print(f"hero glbs ok: {len(places)}")


if __name__ == "__main__":
    main()
