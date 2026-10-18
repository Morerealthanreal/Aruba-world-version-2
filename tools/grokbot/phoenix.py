#!/usr/bin/env python3
"""Divi Aruba Phoenix Beach Resort: the red-tile village on the Palm Beach bend.

Same hero id, origin and OSM footprint. The Esri aerial puts a chain of
red hip roofs on this ring, running from the beach (northwest) to the street,
with the pool on the ocean side. The neighbouring white high-rise is a
different building and stays outside this footprint. Walls are cream, roofs
are terracotta hips, balconies face the pool. Two and three storeys, which
is what the roofs show; the OSM height tag on this way is not the roof.
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, write_glb  # noqa: E402
from hotelkit import Frame, balcony_wing, hip_roof, obox, vquad  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-8836.18, -4878.89)

# the long wing in the resort aerial is light grey with glass balconies, not a cream cottage
CREAM = (0.86, 0.87, 0.88)
CREAM_SH = (0.72, 0.74, 0.76)
WHITE = (0.95, 0.93, 0.88)
RAIL = (0.90, 0.88, 0.84)
GLASS = (0.22, 0.30, 0.36)
TILE = (0.64, 0.26, 0.16)
ROOF = (0.78, 0.62, 0.48)

FH = 3.15


def lin(c):
    return tuple(round(v ** 2.2, 4) for v in c)


def build():
    M = Model("divephoenix")
    for n, c, r in (
        ("wall", CREAM, .85), ("recess", CREAM_SH, .9), ("slab", WHITE, .75),
        ("rail", RAIL, .5), ("glass", GLASS, .25), ("tile", TILE, .75), ("roof", ROOF, .85),
    ):
        M.material(n, lin(c), rough=r)
    mats = {"wall": "wall", "recess": "recess", "slab": "slab", "rail": "rail", "glass": "glass", "fin": "wall"}

    # Resort aerial (diviresorts.com): the long wing is about six storeys,
    # light grey, glass balconies, red-tile hips. It runs north-south on the
    # street side of this ring. Lower red-roof blocks sit on the pool side.
    # a->b runs north to south, so +v is west, toward the pool and the beach.
    # The tall peach tower in that photo stands outside this footprint.
    wings = [
        ((-8826.0, -4938.0), (-8812.0, -4884.0), 9.0, 6),
        ((-8830.0, -4880.0), (-8816.0, -4828.0), 9.0, 6),
        ((-8854.0, -4864.0), (-8838.0, -4836.0), 7.5, 3),
        ((-8852.0, -4926.0), (-8836.0, -4898.0), 7.0, 3),
    ]
    for a, b, hv, floors in wings:
        F = Frame(a, b, O)
        top = balcony_wing(M, F, 0, F.L, hv, 0.3, floors, FH, 3.15, mats, depth=1.35)
        for lod in (0, 1):
            obox(M.mesh(lod, "slab"), F, -0.3, F.L + 0.3, -hv - 0.3, hv + 0.3, top, top + 0.4)
            hip_roof(M.mesh(lod, "tile"), F, -0.7, F.L + 0.7, -hv - 0.7, hv + 0.7, top + 0.35, 3.0)
        # pool-side colonnade, the ground floor under the balconies
        vquad(M.mesh(0, "glass"), F, 1.0, F.L - 1.0, hv + 0.08, 0.45, 2.7, 1)
        u = 1.4
        while u < F.L - 0.8:
            obox(M.mesh(0, "slab"), F, u - 0.16, u + 0.16, hv - 0.1, hv + 0.55, 0.3, top - 0.4)
            u += 3.3
    # pool pavilion, west of the middle of the row
    FL = Frame((-8862.0, -4888.0), (-8848.0, -4866.0), O)
    for lod in (0, 1):
        obox(M.mesh(lod, "wall"), FL, 0, FL.L, -6.2, 6.2, 0.2, 4.0)
        hip_roof(M.mesh(lod, "tile"), FL, -0.5, FL.L + 0.5, -6.8, 6.8, 4.0, 2.3)
        if lod == 0:
            for u in (2.0, FL.L / 2, FL.L - 2.0):
                obox(M.mesh(0, "slab"), FL, u - 0.22, u + 0.22, -6.5, -5.9, 0.3, 3.9)
    # the low block this hero already hides, just west of the ring (named Dive Phoenix)
    FHIDE = Frame((-8894.0, -4836.0), (-8870.0, -4816.0), O)
    top = balcony_wing(M, FHIDE, 0, FHIDE.L, 8.0, 0.3, 2, FH, 4.0, mats, depth=1.2, faces=(1,))
    for lod in (0, 1):
        hip_roof(M.mesh(lod, "tile"), FHIDE, -0.6, FHIDE.L + 0.6, -8.6, 8.6, top, 2.6)

    info = write_glb(M, HERO / "divephoenix.glb")
    check_glb(HERO / "divephoenix.glb")
    if not (2800 <= info["lod0"] <= 4500):
        print("WARN lod0", info["lod0"])
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    patch(info)
    print("phoenix", info)
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "divephoenix"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = block.replace('"status": "v3-procedural (OSM footprint, photo/brand refs)"',
                           '"status": "v4-grokbot (OSM footprint, photo-matched)"', 1)
    block = re.sub(r'"divephoenix_lod0": \d+', f'"divephoenix_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"divephoenix_lod1": \d+', f'"divephoenix_lod1": {info["lod1"]}', block, count=1)
    block = block.replace('"textures": 2', '"textures": 0', 1)
    old = '"ref_sources": "diviresorts.com Divi Aruba Phoenix (white tower, Palm Beach)"'
    new = ('"ref_sources": "diviresorts.com resort aerial: long light-grey wing, about six '
           'storeys, glass balconies, red-tile hips; the tall peach tower stands outside '
           'this footprint. Esri aerial: the red roofs run north-south on the street side '
           'of the ring, pool to the west. Built by tools/grokbot/phoenix.py"')
    prev = ('"ref_sources": "Esri aerial over OSM: chain of red hip roofs from the beach '
            '(northwest) to the street, pool on the ocean side; cream walls. The white '
            'high-rise northeast of the ring is a different building. Built by tools/grokbot/phoenix.py"')
    if old in block:
        block = block.replace(old, new, 1)
    elif prev in block:
        block = block.replace(prev, new, 1)
    elif "diviresorts.com resort aerial" not in block:
        raise SystemExit("phoenix ref anchor missing")
    block = block.replace(
        "generated by /workspace/landmarks/gen.mjs",
        "generated by tools/grokbot/phoenix.py", 1)
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == "divephoenix")
    assert hit["tris"]["divephoenix_lod0"] == info["lod0"]


if __name__ == "__main__":
    build()
