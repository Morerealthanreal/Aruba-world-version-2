#!/usr/bin/env python3
"""Fail if any mural uv[2] (u1) or uv[3] (v1) exceeds 1."""
import json
import sys
from pathlib import Path


def audit(path: Path) -> list[str]:
    d = json.loads(path.read_text())
    bad: list[str] = []
    for m in d.get("murals", []):
        uv = m.get("uv")
        if not uv or len(uv) < 4:
            continue
        if uv[0] < -0.001 or uv[2] > 1.001 or uv[1] < -0.001 or uv[3] > 1.001:
            bad.append(f"{path.name}:{m.get('id')} uv={uv}")
    return bad


def main() -> None:
    root = Path(__file__).resolve().parents[1] / "game" / "data"
    paths = sorted(root.glob("*_murals.json"))
    all_bad: list[str] = []
    for p in paths:
        all_bad.extend(audit(p))
    if all_bad:
        print("\n".join(all_bad))
        sys.exit(1)
    print(f"ok {len(paths)} atlas json files")


if __name__ == "__main__":
    main()
