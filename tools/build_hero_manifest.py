#!/usr/bin/env python3
"""Build game/data/hero/manifest.json from one file per place.

Source of truth: refs/places/_registry/<id>.json
Each file is one hero entry plus a private "_ord" used only for load order.
An optional "rev" is kept in the manifest so the hero loader can cache-bust
that GLB alone. Do not edit the generated manifest; edit the place file.
"""
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "refs" / "places" / "_registry"
OUT = ROOT / "game" / "data" / "hero" / "manifest.json"


def public_fields(entry):
    return {k: v for k, v in entry.items() if not str(k).startswith("_")}


def load_places(src=SRC):
    files = sorted(Path(src).glob("*.json"))
    if not files:
        sys.exit(f"no place files in {src}")
    places = []
    seen = set()
    for path in files:
        entry = json.loads(path.read_text())
        ident = entry.get("id")
        if path.stem != ident:
            sys.exit(f"{path.name} does not match id {ident}")
        if ident in seen:
            sys.exit(f"duplicate place id {ident}")
        seen.add(ident)
        if "_ord" not in entry:
            sys.exit(f"{path.name} is missing _ord")
        places.append(entry)
    places.sort(key=lambda entry: (entry["_ord"], entry["id"]))
    return places


def build(src=SRC, out=OUT):
    places = load_places(src)
    manifest = [public_fields(entry) for entry in places]
    out = Path(out)
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(manifest, indent=1) + "\n")
    print(f"hero manifest {len(manifest)} places -> {out}")
    return manifest


def split(manifest_path=OUT, src=SRC):
    """One-time migration: write a place file for every monolith entry."""
    data = json.loads(Path(manifest_path).read_text())
    src = Path(src)
    src.mkdir(parents=True, exist_ok=True)
    for order, entry in enumerate(data):
        ident = entry["id"]
        payload = {"_ord": order}
        payload.update(entry)
        (src / f"{ident}.json").write_text(json.dumps(payload, indent=1) + "\n")
    print(f"split {len(data)} places -> {src}")


def adopt(manifest_path=OUT, src=SRC):
    """Upsert place files from a monolith, then rebuild.

    Existing _ord values stay put. A changed place keeps its rev unless the
    caller already set one on the monolith entry. New places append in order.
    """
    data = json.loads(Path(manifest_path).read_text())
    src = Path(src)
    src.mkdir(parents=True, exist_ok=True)
    existing = {}
    max_ord = -1
    for path in src.glob("*.json"):
        entry = json.loads(path.read_text())
        existing[entry["id"]] = entry
        max_ord = max(max_ord, entry.get("_ord", -1))
    written = 0
    for entry in data:
        ident = entry["id"]
        prev = existing.get(ident)
        if prev and public_fields(prev) == entry:
            continue
        payload = {"_ord": prev["_ord"] if prev else max_ord + 1}
        if prev is None:
            max_ord += 1
        elif "rev" in prev and "rev" not in entry:
            payload["rev"] = prev["rev"]
        payload.update({k: v for k, v in entry.items() if k != "_ord"})
        ordered = {"_ord": payload.pop("_ord")}
        if "rev" in payload:
            ordered["rev"] = payload.pop("rev")
        ordered.update(payload)
        (src / f"{ident}.json").write_text(json.dumps(ordered, indent=1) + "\n")
        written += 1
    print(f"adopted {written} places")
    build(src, manifest_path)


def main(argv):
    if "--split" in argv:
        split()
        return
    if "--adopt" in argv:
        adopt()
        return
    build()


if __name__ == "__main__":
    main(sys.argv[1:])
