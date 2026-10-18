#!/usr/bin/env python3
"""Estimate GPU memory for mural atlases (RGBA + mipmap chain)."""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TEXTURES = ROOT / "game" / "textures"


def mip_bytes(w: int, h: int) -> int:
    total = 0
    while w >= 1 and h >= 1:
        total += w * h * 4
        w = max(1, w // 2)
        h = max(1, h // 2)
    return total


def main() -> None:
    atlases = [
        "sn_mural_atlas.jpg",
        "sn_famous_atlas.jpg",
        "sn_fair_atlas.jpg",
        "sn_later_atlas.jpg",
        "sn_sac_recent_atlas.jpg",
    ]
    from PIL import Image

    rows = []
    total = 0
    for name in atlases:
        path = TEXTURES / name
        if not path.is_file():
            continue
        im = Image.open(path)
        w, h = im.size
        gpu = mip_bytes(w, h)
        disk = path.stat().st_size
        total += gpu
        rows.append((name, w, h, disk, gpu))
    print("Mural atlas GPU estimate (RGBA mips, all loaded):")
    for name, w, h, disk, gpu in rows:
        print(f"  {name}: {w}x{h}  disk={disk//1024}KiB  gpu≈{gpu//1024}KiB")
    print(f"  TOTAL gpu≈{total//1024}KiB ({total/1024/1024:.2f} MiB)")
    sn = ROOT / "game" / "data" / "sn_murals.json"
    if sn.is_file():
        doc = json.loads(sn.read_text())
        aw, ah = doc.get("atlas_px", [0, 0])
        print(f"sn_murals atlas_px={aw}x{ah}")


if __name__ == "__main__":
    main()
