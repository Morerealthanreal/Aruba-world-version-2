#!/usr/bin/env python3
"""Divi Aruba Phoenix Beach Resort: long red-roofed wing and the tall tower.

Same hero id and origin. The resort aerial looks in from the beach: a long
light-grey wing of about six storeys under red-tile hips, and a tall slim
peach tower at the south end of that wing. The Esri ring is the red-roof
chain; the tower stands just south of it, where that photo puts it.
"""
import json
import math
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, fold_body, write_glb  # noqa: E402
from hotelkit import Frame, balcony_wing, hip_roof, obox, tri_out, vquad  # noqa: E402

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
# The resort aerial tower is light peach, not a brown slab.
PEACH = (0.96, 0.78, 0.62)
PEACH_SH = (0.86, 0.64, 0.48)
TEAL = (0.15, 0.62, 0.72)
SAND = (0.90, 0.84, 0.68)
POOL = (0.22, 0.58, 0.78)
BLUEU = (0.15, 0.40, 0.75)
THATCH = (0.55, 0.36, 0.16)
TRUNK = (0.38, 0.24, 0.12)
FROND = (0.14, 0.40, 0.16)
BULB = (1.0, 0.86, 0.45)

FH = 3.15


def lin(c):
    return tuple(round(v ** 2.2, 4) for v in c)


def hquad(mesh, F, u0, u1, v0, v1, y):
    A, B = F.p(u0, v0, y), F.p(u1, v0, y)
    C, D = F.p(u1, v1, y), F.p(u0, v1, y)
    cen = F.p((u0 + u1) / 2, (v0 + v1) / 2, y - 1)
    tri_out(mesh, A, B, C, cen)
    tri_out(mesh, A, C, D, cen)


def palm(M, F, u, v, h=7.0):
    obox(M.mesh(0, "trunk"), F, u - 0.16, u + 0.16, v - 0.16, v + 0.16, 0.4, h)
    crown, cen = F.p(u, v, h), F.p(u, v, h - 2)
    mesh = M.mesh(0, "frond")
    for i in range(4):
        a = i * math.tau / 4 + 0.4
        du, dv = math.cos(a) * 2.3, math.sin(a) * 2.3
        tri_out(mesh, crown, F.p(u + du * 0.3, v + dv * 0.3, h - 0.15), F.p(u + du, v + dv, h - 1.4), cen)
    top = F.p(u, v, h - 0.1)
    for i in range(6):
        a0, a1 = i * math.tau / 6, (i + 1) * math.tau / 6
        tri_out(mesh, top,
                F.p(u + math.cos(a0) * 3.4, v + math.sin(a0) * 3.4, h - 0.9),
                F.p(u + math.cos(a1) * 3.4, v + math.sin(a1) * 3.4, h - 0.9), cen)


def umbrella(M, F, u, v, color, y0=1.3):
    obox(M.mesh(0, "trunk"), F, u - 0.05, u + 0.05, v - 0.05, v + 0.05, y0, y0 + 1.8)
    top, cen = F.p(u, v, y0 + 2.05), F.p(u, v, y0)
    mesh = M.mesh(0, color)
    for i in range(4):
        a0, a1 = i * math.tau / 4, (i + 1) * math.tau / 4
        tri_out(mesh, top,
                F.p(u + math.cos(a0) * 1.3, v + math.sin(a0) * 1.3, y0 + 1.6),
                F.p(u + math.cos(a1) * 1.3, v + math.sin(a1) * 1.3, y0 + 1.6), cen)


def build():
    M = Model("divephoenix")
    for n, c, r in (
        ("wall", CREAM, .85), ("recess", CREAM_SH, .9), ("slab", WHITE, .75),
        ("rail", RAIL, .5), ("glass", GLASS, .25), ("tile", TILE, .75), ("roof", ROOF, .85),
        ("peach", PEACH, .82), ("peachsh", PEACH_SH, .88), ("teal", TEAL, .6),
        ("pool", POOL, .3), ("blueu", BLUEU, .55), ("thatch", THATCH, .9),
        ("sand", SAND, .9),
        ("trunk", TRUNK, .85), ("frond", FROND, .8),
    ):
        M.material(n, lin(c), rough=r)
    M.material("bulb", lin(BULB), rough=.4, emissive=.85)
    mats = {"wall": "wall", "recess": "recess", "slab": "slab", "rail": "rail", "glass": "glass", "fin": "wall"}

    # Resort aerial (diviresorts.com): the long wing is about six storeys,
    # light grey, glass balconies, red-tile hips. It runs north-south on the
    # street side of this ring. Lower red-roof blocks sit on the pool side.
    # a->b runs north to south, so +v is west, toward the pool and the beach.
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
    # Tall slim peach tower at the south end of the long wing. The resort
    # aerial, shot from the beach, puts it on the right of that wing.
    tower_mats = dict(mats)
    tower_mats["wall"] = "peach"
    tower_mats["recess"] = "peachsh"
    tower_mats["fin"] = "peach"
    FT = Frame((-8846.0, -4822.0), (-8830.0, -4806.0), O)
    ttop = balcony_wing(M, FT, 0, FT.L, 7.4, 0.4, 14, FH, 4.2, tower_mats, depth=1.2)
    for lod in (0, 1):
        obox(M.mesh(lod, "peach"), FT, -0.4, FT.L + 0.4, -7.8, 7.8, ttop, ttop + 1.6)
        # Wave crest on both roof faces, tall enough to read from the beach.
        for side in (1, -1):
            obox(M.mesh(lod, "teal"), FT, FT.L * 0.12, FT.L * 0.88, side * 6.0, side * 8.4, ttop + 1.4, ttop + 8.6)
            obox(M.mesh(lod, "slab"), FT, FT.L * 0.28, FT.L * 0.72, side * 6.5, side * 7.8, ttop + 3.4, ttop + 6.6)
        obox(M.mesh(lod, "slab"), FT, -0.2, FT.L + 0.2, -7.6, 7.6, ttop + 8.6, ttop + 9.0)

    # the low block this hero already hides, just west of the ring (named Dive Phoenix)
    FHIDE = Frame((-8894.0, -4836.0), (-8870.0, -4816.0), O)
    top = balcony_wing(M, FHIDE, 0, FHIDE.L, 8.0, 0.3, 2, FH, 4.0, mats, depth=1.2, faces=(1,))
    for lod in (0, 1):
        hip_roof(M.mesh(lod, "tile"), FHIDE, -0.6, FHIDE.L + 0.6, -8.6, 8.6, top, 2.6)

    # Pool court and beach, west of the long wing (+v). The aerial has the pool
    # in the court, palms, and thatched umbrellas on the sand in the foreground.
    FC = Frame((-8824.0, -4936.0), (-8814.0, -4830.0), O)
    water = 1.45
    hquad(M.mesh(0, "pool"), FC, 28, 78, 16, 34, water)
    hquad(M.mesh(1, "pool"), FC, 28, 78, 16, 34, water)
    obox(M.mesh(0, "slab"), FC, 26, 80, 14, 36, water - 0.22, water - 0.04)
    # White sand and a row of thatched umbrellas, the beach in the resort aerial.
    hquad(M.mesh(0, "sand"), FC, -16, 110, 28, 120, 1.8)
    for i, u in enumerate(range(8, 90, 7)):
        palm(M, FC, u, 22 + (i % 3) * 4, h=6.2 + (i % 4) * 0.8)
        palm(M, FC, u + 3, 48 + (i % 2) * 6, h=7.0 + (i % 3) * 0.7)
        umbrella(M, FC, u + 1.5, 58 + (i % 3) * 3.2, "thatch", y0=1.2)
    for u, v in ((24, 20), (40, 38), (58, 18), (72, 40)):
        palm(M, FC, u, v)
    for u, v, col in ((32, 40, "thatch"), (48, 44, "thatch"), (64, 42, "thatch"),
                      (36, 14.5, "blueu"), (55, 14.5, "blueu")):
        umbrella(M, FC, u, v, col, y0=water)
    uu = 30
    while uu < 76:
        hquad(M.mesh(0, "bulb"), FC, uu - 0.2, uu + 0.2, 14.2, 14.7, water + 0.35)
        uu += 9
    # One opaque mesh per LOD. Glass and bulbs stay named so the night pass lights them.
    fold_body(M, keep={"glass", "bulb"})
    info = write_glb(M, HERO / "divephoenix.glb")
    check_glb(HERO / "divephoenix.glb")
    if not (2800 <= info["lod0"] <= 6400):
        print("WARN lod0", info["lod0"])
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    patch(info)
    def world(u, v, y):
        x, yy, z = FC.p(u, v, y)
        return (round(x + O[0], 1), round(z + O[1], 1), round(yy, 2))
    print("phoenix", info)
    print("beach", world(50, 70, 12), "court", world(52, 25, 1.4), "wing", world(40, -6, 16))
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "divephoenix"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = re.sub(r'"status": "[^"]*"',
                    '"status": "v5-grokbot (peach tower, crest, red roofs, beach)"', block, count=1)
    block = re.sub(r'"divephoenix_lod0": \d+', f'"divephoenix_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"divephoenix_lod1": \d+', f'"divephoenix_lod1": {info["lod1"]}', block, count=1)
    block = block.replace('"textures": 2', '"textures": 0', 1)
    old = '"ref_sources": "diviresorts.com Divi Aruba Phoenix (white tower, Palm Beach)"'
    new = ('"ref_sources": "diviresorts.com resort aerial: long light-grey wing, about six '
           'storeys, glass balconies, red-tile hips, and the tall slim peach tower at the '
           'south end of that wing, pool court with palms and beach umbrellas to the west. '
           'Esri aerial: the red roofs run north-south on the street side of the ring. '
           'Built by tools/grokbot/phoenix.py"')
    block = block.replace(
        "the tall peach tower stands outside this footprint.",
        "the tall slim peach tower stands at the south end of that wing.",
        1)
    prev = ('"ref_sources": "Esri aerial over OSM: chain of red hip roofs from the beach '
            '(northwest) to the street, pool on the ocean side; cream walls. The white '
            'high-rise northeast of the ring is a different building. Built by tools/grokbot/phoenix.py"')
    current = ('"ref_sources": "diviresorts.com resort aerial: long light-grey wing, about six '
                'storeys, glass balconies, red-tile hips; the tall slim peach tower stands at the '
                'south end of that wing. Esri aerial: the red roofs run north-south on the street '
                'side of the ring, pool to the west. Built by tools/grokbot/phoenix.py"')
    if old in block:
        block = block.replace(old, new, 1)
    elif prev in block:
        block = block.replace(prev, new, 1)
    elif current in block:
        block = block.replace(current, new, 1)
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
