#!/usr/bin/env python3
"""Marriott's Aruba Surf Club (Palm Beach): a long sand-coloured balcony slab
broken by salmon stair towers, under red-tile hip roofs.

Same hero id, origin and OSM footprint (way 40082945: levels "13;2",
heights "43.5;38"). The ring is one long slab running from the beach (west)
to the street with a step about two-thirds along; the beach part is the
tall one (13 floors, 43.5 m) and the street part lower (38 m). Look from the
resort videos (-Z3xBQbZpGg hotel tour, EVzxoJGTfs0 4K walk): pale sand walls,
white slab edges and white railings across every bay on both long faces,
salmon-terracotta stair/lift towers standing proud of the face and rising a
storey above the roof, and red-tile hip roofs with a tile skirt.
"""
import math
import re
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, fold_body, wall_ring, write_glb  # noqa: E402
from hotelkit import Frame, balcony_wing, ccw, ear_fan, hip_roof, mansard, obox, tri_out  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-7936.09, -6440.78)
RING = [(-8046.6, -6441.2), (-8044, -6441.1), (-8044.1, -6439.3), (-8034.3, -6438.8), (-8034.2, -6441),
        (-7960.4, -6435.5), (-7961.8, -6421.7), (-7952.3, -6421), (-7951.2, -6430.2), (-7956.9, -6430.6),
        (-7956.6, -6435.2), (-7952.4, -6434.9), (-7917, -6429.5), (-7917.3, -6426.8), (-7909.5, -6426),
        (-7909.6, -6424.2), (-7896.8, -6423.2), (-7897, -6421.3), (-7887.6, -6420.2), (-7887.6, -6416),
        (-7867.5, -6415.2), (-7867.4, -6418.2), (-7864.7, -6423.2), (-7863.4, -6433.5), (-7861.3, -6436.4),
        (-7861.5, -6443.3), (-7860.9, -6452.1), (-7863.7, -6452.6), (-7863.6, -6456.3), (-7878.6, -6457.5),
        (-7878.5, -6455.7), (-7890.8, -6457.1), (-7891.2, -6454.8), (-7903, -6456), (-7903.4, -6454.1),
        (-7915.2, -6455.4), (-7915.6, -6453.4), (-8031.6, -6465), (-8031.4, -6468.1), (-8041.1, -6469.1),
        (-8041.3, -6467.3), (-8044.6, -6467.6)]

SAND = (0.94, 0.78, 0.58)
SAND_SH = (0.86, 0.71, 0.54)
SALMON = (0.82, 0.54, 0.42)
WHITE = (0.96, 0.95, 0.92)
RAIL = (0.93, 0.93, 0.91)
GLASS = (0.34, 0.36, 0.38)
TILE = (0.74, 0.22, 0.14)
ROOF = (0.82, 0.80, 0.76)
GROUND = (0.20, 0.22, 0.24)
POOL = (0.10, 0.55, 0.92)
DECK = (0.90, 0.86, 0.78)
BLUEU = (0.12, 0.38, 0.78)
GREENU = (0.18, 0.62, 0.32)
TRUNK = (0.40, 0.26, 0.14)
FROND = (0.12, 0.40, 0.16)
LAWN = (0.28, 0.55, 0.24)
BULB = (1.0, 0.86, 0.45)
SKIN = (0.62, 0.44, 0.32)
SHIRT = (0.85, 0.28, 0.28)

FH = 3.1
GF = 4.4


def hquad(mesh, F, u0, u1, v0, v1, y, up=1):
    A, B = F.p(u0, v0, y), F.p(u1, v0, y)
    C, D = F.p(u1, v1, y), F.p(u0, v1, y)
    cen = F.p((u0 + u1) / 2, (v0 + v1) / 2, y - up)
    tri_out(mesh, A, B, C, cen)
    tri_out(mesh, A, C, D, cen)


def palm(M, F, u, v, h=16.0, spin=0.0):
    """Tapered trunk with fronds only at the crown, so the trunk stays visible."""
    obox(M.mesh(0, "trunk"), F, u - 0.24, u + 0.24, v - 0.24, v + 0.24, 0.15, h * 0.5)
    obox(M.mesh(0, "trunk"), F, u - 0.16, u + 0.16, v - 0.16, v + 0.16, h * 0.46, h)
    crown = F.p(u, v, h + 0.25)
    cen = F.p(u, v, h - 5)
    mesh = M.mesh(0, "frond")
    for i in range(7):
        a = i * math.tau / 7 + spin
        reach = 3.4 + (i % 3) * 0.85
        droop = 1.8 + (i % 2) * 1.1
        p1 = F.p(u + math.cos(a) * reach * 0.3, v + math.sin(a) * reach * 0.3, h + 0.1)
        p2 = F.p(u + math.cos(a) * reach, v + math.sin(a) * reach, h - droop)
        tri_out(mesh, crown, p1, p2, cen)


def umbrella(M, F, u, v, color, y0=0.45):
    obox(M.mesh(0, "deck"), F, u - 0.05, u + 0.05, v - 0.05, v + 0.05, y0, y0 + 1.9)
    top = F.p(u, v, y0 + 2.15)
    cen = F.p(u, v, y0)
    mesh = M.mesh(0, color)
    for i in range(5):
        a0 = i * math.tau / 5
        a1 = (i + 1) * math.tau / 5
        r0 = F.p(u + math.cos(a0) * 2.3, v + math.sin(a0) * 2.3, y0 + 1.85)
        r1 = F.p(u + math.cos(a1) * 2.3, v + math.sin(a1) * 2.3, y0 + 1.85)
        tri_out(mesh, top, r0, r1, cen)


def build():
    M = Model("marriott_surfclub")
    for n, c, r in (("wall", SAND, .85), ("recess", SAND_SH, .9), ("salmon", SALMON, .85), ("slab", WHITE, .8),
                    ("rail", RAIL, .5), ("glass", GLASS, .2), ("tile", TILE, .8), ("roof", ROOF, .9),
                    ("ground", GROUND, .3), ("pool", POOL, .25), ("deck", DECK, .7),
                    ("blueu", BLUEU, .6), ("greenu", GREENU, .6), ("lawn", LAWN, .85),
                    ("trunk", TRUNK, .85), ("frond", FROND, .8),
                    ("skin", SKIN, .7), ("shirt", SHIRT, .55)):
        M.material(n, tuple(round(v ** 2.2, 4) for v in c), rough=r)
    M.material("bulb", tuple(round(v ** 2.2, 4) for v in BULB), rough=.4, emissive=.85)
    mats = {"wall": "wall", "recess": "recess", "slab": "slab", "rail": "rail", "glass": "glass", "fin": "wall"}
    ring = ccw([(x - O[0], z - O[1]) for x, z in RING])
    for lod in (0, 1):
        wall_ring(M.mesh(lod, "ground"), ring, -2.0, 0.6)
        wall_ring(M.mesh(lod, "wall"), ring, 0.6, GF)
        ear_fan(M.mesh(lod, "roof"), ring, GF)

    def slab(a, b, hv, floors, towers):
        F = Frame(a, b, O)
        top = balcony_wing(M, F, 0, F.L, hv, GF, floors, FH, 3.7, mats, depth=1.8)
        for lod in (0, 1):
            obox(M.mesh(lod, "slab"), F, -0.2, F.L + 0.2, -hv - 0.2, hv + 0.2, top, top + 0.8)
            mansard(M.mesh(lod, "tile"), F, -0.2, F.L + 0.2, -hv - 0.2, hv + 0.2, top + 0.8, 2.0, 2.0)
            obox(M.mesh(lod, "roof"), F, 1.8, F.L - 1.8, -hv + 1.8, hv - 1.8, top + 0.8, top + 2.6)
            # salmon stair/lift towers: proud of both faces, a storey above the roof, red hip caps
            for u in towers:
                obox(M.mesh(lod, "salmon"), F, u - 3.6, u + 3.6, -hv - 1.2, hv + 1.2, 0.6, top + FH + 0.8)
                hip_roof(M.mesh(lod, "tile"), F, u - 4.2, u + 4.2, -hv - 1.8, hv + 1.8, top + FH + 0.8, 3.2)
        # beach and street end walls: salmon full-height panels
        for lod in (0, 1):
            for uu in (-0.3, F.L + 0.3):
                obox(M.mesh(lod, "salmon"), F, uu - 0.3, uu + 0.3, -3.2, 3.2, GF, top + 0.8)
        return F, top

    # tall beach slab (13 floors incl. ground, 43.5 m) and lower street slab (38 m)
    FW, topw = slab((-8045.5, -6454.0), (-7957.0, -6446.0), 13.5, 12, towers=(30.0, 62.0))
    FE, tope = slab((-7957.0, -6446.0), (-7862.0, -6438.0), 15.0, 10, towers=(34.0, 70.0))
    # South of the beach slab: the pool court in the hotel-tour still.
    # Palms stand around the water. Their crowns are fronds, not discs, so the
    # pool and the green and blue umbrellas stay visible.
    hv = 13.5
    deck_y = 1.55
    hquad(M.mesh(0, "lawn"), FW, 8, 80, hv + 0.8, hv + 38, deck_y - 0.08)
    hquad(M.mesh(0, "pool"), FW, 18, 68, hv + 8.0, hv + 26.0, deck_y + 0.55)
    hquad(M.mesh(1, "pool"), FW, 18, 68, hv + 8.0, hv + 26.0, deck_y + 0.55)
    obox(M.mesh(0, "slab"), FW, 16.5, 69.5, hv + 6.6, hv + 27.4, deck_y + 0.15, deck_y + 0.42)
    obox(M.mesh(0, "deck"), FW, 12, 76, hv + 2.0, hv + 32, deck_y - 0.28, deck_y)
    for i, u in enumerate(range(15, 74, 4)):
        umbrella(M, FW, u, hv + 3.4, "greenu" if i % 2 == 0 else "blueu", y0=deck_y)
        umbrella(M, FW, u + 1.7, hv + 7.4, "blueu" if i % 2 == 0 else "greenu", y0=deck_y)
        umbrella(M, FW, u + 0.6, hv + 22.6, "greenu" if i % 3 else "blueu", y0=deck_y)
        umbrella(M, FW, u + 2.1, hv + 26.8, "blueu" if i % 3 else "greenu", y0=deck_y)
    n = 0
    for u in range(13, 78, 4):
        for v, hh in ((hv + 1.2, 16.0), (hv + 9.2, 18.5), (hv + 21.0, 17.0), (hv + 31.5, 19.0)):
            palm(M, FW, u + (n % 3) * 0.35, v + (n % 2) * 0.4, h=hh + (n % 4) * 0.8, spin=n * 0.55)
            n += 1
    uu = 18
    while uu < 70:
        hquad(M.mesh(0, "bulb"), FW, uu - 0.15, uu + 0.15, hv + 4.3, hv + 4.7, deck_y + 0.45)
        uu += 6.5
    # a few clothed guests on the deck, the scale of the people in the stills
    for u, v in ((30, hv + 4.2), (50, hv + 23.2)):
        obox(M.mesh(0, "shirt"), FW, u - 0.2, u + 0.2, v - 0.14, v + 0.14, deck_y, deck_y + 0.75)
        obox(M.mesh(0, "skin"), FW, u - 0.1, u + 0.1, v - 0.1, v + 0.1, deck_y + 0.75, deck_y + 1.02)
    # One opaque mesh per LOD. Glass and bulbs stay named so the night pass lights them.
    fold_body(M, keep={"glass", "bulb"})
    info = write_glb(M, HERO / "marriott_surfclub.glb")
    check_glb(HERO / "marriott_surfclub.glb")
    if info["lod0"] > 14000 or info["lod1"] >= 600:
        raise SystemExit(f"budget {info}")
    patch(info)
    def world(F, u, v, y):
        x, yy, z = F.p(u, v, y)
        return (round(x + O[0], 1), round(z + O[1], 1), round(yy, 2))
    print("surfclub", info, "tops", round(topw, 1), round(tope, 1))
    print("pool", world(FW, 42, hv + 14, 0.4), "south", world(FW, 40, hv + 40, 8),
          "balcony", world(FW, 12, 8, 18), "far", world(FW, 62, hv + 6, 22))
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "marriott_surfclub"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = re.sub(r'"status": "[^"]*"',
                    '"status": "v6-grokbot (tall palm trunks, pool, green and blue umbrellas)"', block, count=1)
    block = re.sub(r'"marriott_surfclub_lod0": \d+', f'"marriott_surfclub_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"marriott_surfclub_lod1": \d+', f'"marriott_surfclub_lod1": {info["lod1"]}', block, count=1)
    block = re.sub(
        r'"ref_sources": "[^"]*"',
        '"ref_sources": "Resort videos (-Z3xBQbZpGg hotel tour, EVzxoJGTfs0 4K walk): sand balcony slab, salmon stair towers, red hips, a tall palm court with visible trunks, the pool, and rows of green and blue umbrellas. OSM way 40082945. Built by tools/grokbot/surfclub.py"',
        block, count=1)
    if "surfclub.py" not in block:
        raise SystemExit("surfclub ref anchor missing")
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == "marriott_surfclub")
    assert hit["tris"]["marriott_surfclub_lod0"] == info["lod0"]
    assert hit["textures"] == 0


if __name__ == "__main__":
    build()
