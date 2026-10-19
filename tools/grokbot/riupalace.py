#!/usr/bin/env python3
"""Hotel Riu Palace Aruba.

Same hero id and origin. The 2015 street photo
(refs/places/palm-eagle-beach/riu/riu_palace_2015.jpg) shows a white slab
with a deep balcony grid, red RIU letters on the roof corner, and a lower
white podium. A small red CASINO sign sits on that podium. The street in
front is asphalt, with parked cars, a bus shelter, and a row of palms.
The letters are drawn. Nothing is a pasted photograph. Cars are boxes,
not people.
"""
import json
import math
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, fold_body, write_glb  # noqa: E402
from hotelkit import (  # noqa: E402
    FONT_SANS, Frame, balcony_wing, obox, png_bytes, tri_out, vquad,
)

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-8451.5, -5174.09)

WHITE = (0.94, 0.94, 0.93)
RECESS = (0.78, 0.80, 0.82)
GLASS = (0.22, 0.30, 0.38)
RED = (0.78, 0.10, 0.12)
HEDGE = (0.16, 0.42, 0.18)
LAWN = (0.32, 0.58, 0.24)
PAVER = (0.72, 0.70, 0.66)
ASPHALT = (0.22, 0.23, 0.24)
TRUNK = (0.40, 0.26, 0.14)
FROND = (0.12, 0.38, 0.16)
BUS = (0.12, 0.32, 0.62)
CAR_RED = (0.55, 0.10, 0.10)
CAR_BLK = (0.08, 0.08, 0.09)
CAR_WHT = (0.90, 0.90, 0.88)
CAR_SIL = (0.62, 0.64, 0.66)

GF = 0.4
FH = 3.05


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def hquad(mesh, F, u0, u1, v0, v1, y):
    A, B = F.p(u0, v0, y), F.p(u1, v0, y)
    C, D = F.p(u1, v1, y), F.p(u0, v1, y)
    cen = F.p((u0 + u1) / 2, (v0 + v1) / 2, y - 1)
    tri_out(mesh, A, B, C, cen)
    tri_out(mesh, A, C, D, cen)


def palm(M, F, u, v, h=11.0, spin=0.0):
    obox(M.mesh(0, "trunk"), F, u - 0.18, u + 0.18, v - 0.18, v + 0.18, 0.1, h * 0.6)
    obox(M.mesh(0, "trunk"), F, u - 0.1, u + 0.1, v - 0.1, v + 0.1, h * 0.5, h)
    crown, cen = F.p(u, v, h + 0.15), F.p(u, v, h - 3)
    mesh = M.mesh(0, "frond")
    for i in range(6):
        a = i * math.tau / 6 + spin
        reach = 2.6 + (i % 2) * 0.6
        tri_out(mesh, crown,
                F.p(u + math.cos(a) * reach * 0.35, v + math.sin(a) * reach * 0.35, h),
                F.p(u + math.cos(a) * reach, v + math.sin(a) * reach, h - 1.3),
                cen)


def logo_png():
    """Left: red RIU with a small crown. Right: the small red CASINO on the podium."""
    im = Image.new("RGBA", (1024, 256), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    dr.rectangle((0, 0, 512, 256), fill=(244, 244, 242, 255))
    cx = 256
    dr.polygon(
        [(cx - 34, 46), (cx - 22, 16), (cx - 10, 40), (cx, 12),
         (cx + 10, 40), (cx + 22, 16), (cx + 34, 46)],
        fill=(190, 24, 28, 255),
    )
    font = ImageFont.truetype(FONT_SANS, 150)
    tw = font.getlength("RIU")
    dr.text(((512 - tw) / 2, 52), "RIU", font=font, fill=(198, 22, 28, 255))
    dr.rectangle((512, 0, 1024, 256), fill=(244, 244, 242, 255))
    casino = ImageFont.truetype(FONT_SANS, 92)
    cw = casino.getlength("CASINO")
    dr.text((512 + (512 - cw) / 2, 78), "CASINO", font=casino, fill=(176, 22, 28, 255))
    return im


def build():
    M = Model("riupalace")
    for n, c, r in (
        ("wall", WHITE, .65), ("recess", RECESS, .7), ("slab", WHITE, .55),
        ("rail", WHITE, .45), ("glass", GLASS, .18), ("fin", WHITE, .6),
        ("red", RED, .5), ("hedge", HEDGE, .88), ("lawn", LAWN, .9),
        ("paver", PAVER, .85), ("asphalt", ASPHALT, .92),
        ("trunk", TRUNK, .85), ("frond", FROND, .8),
        ("bus", BUS, .45), ("carred", CAR_RED, .4), ("carblk", CAR_BLK, .35),
        ("carwht", CAR_WHT, .4), ("carsil", CAR_SIL, .35),
    ):
        M.material(n, lin(c), rough=r)
    M.material("sign", (1, 1, 1), rough=.45, textured=True, emissive=.08)

    # North to south along the beach. +v is west (ocean). The 2015 photo looks from the street, -v.
    BF = Frame((-8508.0, -5236.0), (-8488.0, -5136.0), O)
    L = BF.L
    hv = 12.0
    floors = 10
    top = balcony_wing(
        M, BF, 0, L, hv, GF + 6.2, floors, FH, 3.6,
        {"wall": "wall", "recess": "recess", "slab": "slab", "rail": "rail", "glass": "glass", "fin": "fin"},
        depth=1.7, faces=(-1, 1),
    )
    # solid white base under the grid. The photo has no red stripe across it.
    for lod in (0, 1):
        obox(M.mesh(lod, "wall"), BF, -2, L + 2, -hv - 4, hv, GF, GF + 6.2)
    vquad(M.mesh(0, "glass"), BF, L * 0.15, L * 0.42, -hv - 4.2, GF + 0.6, GF + 3.2, -1)
    png = logo_png()
    # 2015 street view looks west: north is on the right, and RIU sits on that corner
    vquad(M.mesh(0, "sign"), BF, 16, 28, -hv - 0.25, top + 0.8, top + 4.6, -1,
          uvs=((0.5, 1), (0, 1), (0, 0), (0.5, 0)))
    vquad(M.mesh(1, "sign"), BF, 15.6, 28.4, -hv - 0.15, top + 0.6, top + 4.8, -1,
          uvs=((0.5, 1), (0, 1), (0, 0), (0.5, 0)))
    obox(M.mesh(0, "wall"), BF, -0.4, L + 0.4, -hv + 0.2, hv - 0.2, top, top + 0.8)
    obox(M.mesh(1, "wall"), BF, 0, L, -hv + 0.4, hv - 0.4, top, top + 0.7)

    # lower white block on the south end, the piece beside the tower in the photo
    for lod in (0, 1):
        obox(M.mesh(lod, "wall"), BF, L - 2, L + 28, -hv - 2, hv - 2, GF, GF + 8.5)
    for f in range(2):
        y0 = GF + 1.2 + f * 3.2
        vquad(M.mesh(0, "glass"), BF, L + 2, L + 24, -hv - 2.15, y0, y0 + 1.5, -1)
    # Small red CASINO on the podium, the size of the sign in the street photo.
    vquad(M.mesh(0, "sign"), BF, L + 3, L + 11, -hv - 2.2, GF + 4.4, GF + 6.2, -1,
          uvs=((1, 1), (0.5, 1), (0.5, 0), (1, 0)))
    vquad(M.mesh(1, "sign"), BF, L + 2.6, L + 11.4, -hv - 2.1, GF + 4.2, GF + 6.4, -1,
          uvs=((1, 1), (0.5, 1), (0.5, 0), (1, 0)))

    # Thick pads. The street photo's foreground is asphalt, then a planted
    # verge. A thin quad, or a pad shorter than the slope, still reads as sand.
    road_y0, road_y1 = 0.2, 1.15
    for lod in (0, 1):
        obox(M.mesh(lod, "lawn"), BF, -12, L + 38, -hv - 40, hv + 6, 0.4, 2.6)
        obox(M.mesh(lod, "paver"), BF, -8, L + 34, -hv - 34, -hv - 20, 1.55, 2.05)
        obox(M.mesh(lod, "asphalt"), BF, -16, L + 44, -hv - 62, -hv - 28, road_y0, road_y1)
    for u in (2, 18, 34, 50, L * 0.7, L + 4, L + 16):
        obox(M.mesh(0, "hedge"), BF, u, u + 7, -hv - 30, -hv - 26, 2.6, 4.0)
    obox(M.mesh(0, "hedge"), BF, 4, L + 8, -hv - 33, -hv - 30.2, 2.6, 3.7)
    palms = (
        (-2, -hv - 12, 14, 0.2), (8, -hv - 18, 13, 0.8), (18, -hv - 11, 15, 1.2),
        (30, -hv - 19, 12, 0.4), (42, -hv - 13, 14, 1.5), (54, -hv - 20, 13, 0.6),
        (L * 0.35, -hv - 16, 15, 1.1), (L * 0.7, -hv - 12, 13, 0.3),
        (L + 2, -hv - 18, 14, 0.9), (L + 12, -hv - 11, 12, 1.4),
        (L + 22, -hv - 17, 15, 0.5), (-6, -hv - 22, 13, 1.7),
    )
    for u, v, h, spin in palms:
        palm(M, BF, u, v, h, spin)

    def car(u, v, body):
        y = road_y1
        obox(M.mesh(0, body), BF, u, u + 4.4, v, v + 1.75, y, y + 1.15)
        obox(M.mesh(0, "glass"), BF, u + 1.3, u + 3.3, v + 0.18, v + 1.57, y + 1.05, y + 1.65)

    for u, body in (
        (4, "carred"), (12, "carblk"), (22, "carsil"), (34, "carwht"),
        (48, "carblk"), (L + 6, "carwht"), (L + 16, "carred"),
    ):
        car(u, -hv - 40, body)
        car(u + 1.5, -hv - 48, "carsil" if body != "carsil" else "carblk")

    # Bus shelter on the street, in the same view as the tower and the cars.
    bu, bv = L * 0.5, -hv - 34
    obox(M.mesh(0, "bus"), BF, bu, bu + 6.5, bv, bv + 2.4, road_y1 + 2.3, road_y1 + 2.7)
    for du in (0.2, 6.0):
        for dv in (0.15, 2.1):
            obox(M.mesh(0, "paver"), BF, bu + du, bu + du + 0.18, bv + dv, bv + dv + 0.18,
                 road_y1, road_y1 + 2.35)
    vquad(M.mesh(0, "bus"), BF, bu + 0.4, bu + 6.1, bv + 2.35, road_y1 + 0.9, road_y1 + 2.25, 1)

    fold_body(M, keep={"sign", "glass"})
    info = write_glb(M, HERO / "riupalace.glb", images=[png_bytes(png)])
    check_glb(HERO / "riupalace.glb")
    look = BF.p(L * 0.62, -hv, 16)
    cam = BF.p(L * 0.45, -hv - 48, 3)
    print("riupalace", info, "top", round(top, 1), "L", round(L, 1))
    print("look", round(O[0] + look[0], 1), round(O[1] + look[2], 1))
    print("cam", round(O[0] + cam[0], 1), round(O[1] + cam[2], 1))
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    if not (1200 <= info["lod0"] <= 7000):
        print("WARN lod0", info["lod0"])
    patch(info)
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "riupalace"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = block.replace(
        '"status": "v3-procedural (OSM footprint, photo/brand refs)"',
        '"status": "v4-grokbot (white balcony grid, red RIU, street and palms)"',
        1,
    )
    block = block.replace(
        '"status": "v4-grokbot (white balcony grid, red RIU, podium)"',
        '"status": "v4-grokbot (white balcony grid, red RIU, street and palms)"',
        1,
    )
    block = re.sub(r'"riupalace_lod0": \d+', f'"riupalace_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"riupalace_lod1": \d+', f'"riupalace_lod1": {info["lod1"]}', block, count=1)
    block = block.replace('"textures": 2', '"textures": 1', 1)
    new = (
        '"ref_sources": "refs/places/palm-eagle-beach/riu/riu_palace_2015.jpg '
        '(white balcony grid, red RIU on the roof corner, small red CASINO, asphalt, cars, bus shelter, palms). '
        'OSM footprint. Signs are drawn. Built by tools/grokbot/riupalace.py"'
    )
    block2, n = re.subn(r'"ref_sources": "[^"]*"', new, block, count=1)
    if n != 1:
        raise SystemExit("riupalace ref anchor missing")
    block = block2.replace(
        "generated by /workspace/landmarks/gen.mjs",
        "generated by tools/grokbot/riupalace.py",
        1,
    )
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == "riupalace")
    assert hit["tris"]["riupalace_lod0"] == info["lod0"]
    assert hit["tris"]["riupalace_lod1"] == info["lod1"]


if __name__ == "__main__":
    build()
