#!/usr/bin/env python3
"""Hotel Riu Palace Aruba.

Same hero id and origin. The 2015 street photo
(refs/places/palm-eagle-beach/riu/riu_palace_2015.jpg) shows a white slab
with a deep balcony grid, red RIU letters on the roof corner, and a lower
white podium with a red band. The letters are drawn. Nothing is a pasted
photograph. Cars in the foreground are not part of the building.
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
PAVER = (0.62, 0.60, 0.56)
TRUNK = (0.40, 0.26, 0.14)
FROND = (0.12, 0.38, 0.16)

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
    """Left: red RIU with a small crown. Right: CASINO on the podium."""
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
    casino = ImageFont.truetype(FONT_SANS, 148)
    cw = casino.getlength("CASINO")
    dr.text((512 + (512 - cw) / 2, 48), "CASINO", font=casino, fill=(12, 12, 14, 255))
    return im


def build():
    M = Model("riupalace")
    for n, c, r in (
        ("wall", WHITE, .65), ("recess", RECESS, .7), ("slab", WHITE, .55),
        ("rail", WHITE, .45), ("glass", GLASS, .18), ("fin", WHITE, .6),
        ("red", RED, .5), ("hedge", HEDGE, .88), ("lawn", LAWN, .9),
        ("paver", PAVER, .85), ("trunk", TRUNK, .85), ("frond", FROND, .8),
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
    # solid base under the grid, the white podium the photo shows in front
    for lod in (0, 1):
        obox(M.mesh(lod, "wall"), BF, -2, L + 2, -hv - 4, hv, GF, GF + 6.2)
        obox(M.mesh(lod, "red"), BF, -2.1, L + 2.1, -hv - 4.15, -hv - 3.7, GF + 5.55, GF + 6.15)
    vquad(M.mesh(0, "glass"), BF, L * 0.15, L * 0.42, -hv - 4.2, GF + 0.6, GF + 3.2, -1)
    png = logo_png()
    # right half of the sheet is 2:1; a wide short quad crushed the word
    cu = L * 0.55
    vquad(M.mesh(0, "sign"), BF, cu - 4, cu + 4, -hv - 4.25, GF + 1.4, GF + 5.4, -1,
          uvs=((1, 1), (0.5, 1), (0.5, 0), (1, 0)))
    vquad(M.mesh(1, "sign"), BF, cu - 4.2, cu + 4.2, -hv - 4.15, GF + 1.3, GF + 5.5, -1,
          uvs=((1, 1), (0.5, 1), (0.5, 0), (1, 0)))
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
        obox(M.mesh(lod, "red"), BF, L - 2, L + 28, -hv - 2.1, -hv - 1.6, GF + 7.6, GF + 8.2)
    for f in range(2):
        y0 = GF + 1.2 + f * 3.2
        vquad(M.mesh(0, "glass"), BF, L + 2, L + 24, -hv - 2.15, y0, y0 + 1.5, -1)

    hquad(M.mesh(0, "lawn"), BF, -8, L + 34, -hv - 28, hv + 2, 0.08)
    hquad(M.mesh(1, "lawn"), BF, -4, L + 28, -hv - 22, hv, 0.08)
    hquad(M.mesh(0, "paver"), BF, -6, L + 32, -hv - 36, -hv - 26, 0.1)
    for u in (4, 22, 40, L * 0.7, L + 8):
        obox(M.mesh(0, "hedge"), BF, u, u + 8, -hv - 18, -hv - 16.4, 0.12, 1.0)
    for u, v, h, spin in (
        (2, -hv - 10, 12, 0.3), (16, -hv - 22, 13, 1.1), (28, -hv - 16, 11, 0.6),
        (L * 0.55, -hv - 20, 12, 1.4), (L + 6, -hv - 14, 10, 0.2), (L + 18, -hv - 8, 11, 0.9),
        (-4, -hv - 6, 13, 1.6), (L - 8, -hv - 24, 12, 0.4),
    ):
        palm(M, BF, u, v, h, spin)

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
        '"status": "v4-grokbot (white balcony grid, red RIU, podium)"',
        1,
    )
    block = re.sub(r'"riupalace_lod0": \d+', f'"riupalace_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"riupalace_lod1": \d+', f'"riupalace_lod1": {info["lod1"]}', block, count=1)
    block = block.replace('"textures": 2', '"textures": 1', 1)
    new = (
        '"ref_sources": "refs/places/palm-eagle-beach/riu/riu_palace_2015.jpg '
        '(white balcony grid, red RIU on the roof corner, lower white podium with a red band). '
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
