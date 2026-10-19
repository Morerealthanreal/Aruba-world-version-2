#!/usr/bin/env python3
"""Boardwalk Boutique Hotel.

Same hero id. boardwalkaruba.com shows two-storey pastel casitas: a pink
house with a yellow stair, white neighbours, turquoise pergolas, brown tile,
and a wooden boardwalk through the garden. The name is drawn. Nothing is a
pasted photograph.
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
from hotelkit import FONT_SANS, Frame, hip_roof, obox, png_bytes, tri_out, vquad  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-7782.94, -6945.92)
NAME = "boardwalk"

PINK = (0.94, 0.70, 0.74)
YELLOW = (0.95, 0.80, 0.16)
WHITE = (0.96, 0.95, 0.93)
TURQ = (0.20, 0.74, 0.84)
TILE = (0.42, 0.26, 0.18)
GLASS = (0.35, 0.48, 0.58)
LAWN = (0.30, 0.58, 0.26)
WOOD = (0.58, 0.44, 0.28)
STONE = (0.78, 0.74, 0.66)
TRUNK = (0.38, 0.24, 0.14)
FROND = (0.14, 0.40, 0.16)
HEDGE = (0.16, 0.40, 0.18)

GF = 0.3
FH = 3.1


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def hquad(mesh, F, u0, u1, v0, v1, y):
    A, B = F.p(u0, v0, y), F.p(u1, v0, y)
    C, D = F.p(u1, v1, y), F.p(u0, v1, y)
    cen = F.p((u0 + u1) / 2, (v0 + v1) / 2, y - 1)
    tri_out(mesh, A, B, C, cen)
    tri_out(mesh, A, C, D, cen)


def palm(M, F, u, v, h=11.0, spin=0.0):
    obox(M.mesh(0, "trunk"), F, u - 0.16, u + 0.16, v - 0.16, v + 0.16, 0.1, h)
    crown, cen = F.p(u, v, h + 0.2), F.p(u, v, h - 2)
    mesh = M.mesh(0, "frond")
    for i in range(6):
        a = i * math.tau / 6 + spin
        reach = 2.4 + (i % 2) * 0.4
        tri_out(mesh, crown,
                F.p(u + math.cos(a) * 0.7, v + math.sin(a) * 0.7, h),
                F.p(u + math.cos(a) * reach, v + math.sin(a) * reach, h - 1.1),
                cen)


def casita(M, F, u0, u1, wall, depth=5.2, floors=2):
    top = GF + floors * FH
    for lod in (0, 1):
        obox(M.mesh(lod, wall), F, u0, u1, 0, depth, GF, top)
        hip_roof(M.mesh(lod, "tile"), F, u0 - 0.4, u1 + 0.4, -0.4, depth + 0.4, top - 0.05, 1.6)
    # white balcony and rail on the garden face
    obox(M.mesh(0, "white"), F, u0 + 0.3, u1 - 0.3, -1.15, 0.05, GF + FH, GF + FH + 0.12)
    obox(M.mesh(0, "white"), F, u0 + 0.4, u1 - 0.4, -1.25, -1.05, GF + FH, GF + FH + 0.95)
    vquad(M.mesh(0, "glass"), F, u0 + 0.8, u1 - 0.8, -0.05, GF + FH + 0.5, GF + FH + 2.2, -1)
    vquad(M.mesh(0, "glass"), F, u0 + 0.8, u1 - 0.8, -0.05, GF + 0.5, GF + 2.3, -1)
    return top


def stair(M, F, u0, color):
    for i in range(8):
        obox(M.mesh(0, color), F, u0, u0 + 1.3, -1.2 - i * 0.55, -0.7 - i * 0.55,
             GF + i * 0.36, GF + i * 0.36 + 0.16)
    obox(M.mesh(0, "white"), F, u0 - 0.08, u0 + 0.08, -5.4, -1.0, GF + 0.4, GF + FH + 0.9)


def logo_png():
    im = Image.new("RGBA", (1024, 256), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    dr.rectangle((0, 40, 1024, 216), fill=(250, 248, 244, 255))
    font = ImageFont.truetype(FONT_SANS, 92)
    tw = font.getlength("BOARDWALK")
    dr.text(((1024 - tw) / 2, 70), "BOARDWALK", font=font, fill=(30, 110, 140, 255))
    return im


def build():
    M = Model(NAME)
    for n, c, r in (
        ("pink", PINK, .7), ("yellow", YELLOW, .6), ("white", WHITE, .55),
        ("turq", TURQ, .55), ("tile", TILE, .75), ("glass", GLASS, .18),
        ("lawn", LAWN, .9), ("wood", WOOD, .8), ("stone", STONE, .85),
        ("trunk", TRUNK, .85), ("frond", FROND, .8), ("hedge", HEDGE, .88),
    ):
        M.material(n, lin(c), rough=r)
    M.material("sign", (1, 1, 1), rough=.5, textured=True, emissive=.05)

    # Along the OSM footprint, west to east. +v is south. The garden face is -v.
    BF = Frame((-7848.0, -6978.0), (-7822.0, -6974.5), O)
    L = BF.L
    casita(M, BF, 0.4, 8.2, "white")
    casita(M, BF, 9.2, 17.6, "pink")
    casita(M, BF, 18.4, L - 0.3, "white")
    stair(M, BF, 10.2, "yellow")
    stair(M, BF, 19.6, "white")
    # round window on the pink house
    vquad(M.mesh(0, "glass"), BF, 15.6, 16.8, -0.08, GF + FH + 1.5, GF + FH + 2.7, -1)
    # yellow window frames on the right casita
    vquad(M.mesh(0, "yellow"), BF, 19.2, 24.6, -0.12, GF + FH + 0.35, GF + FH + 2.35, -1)

    # turquoise pergola in the garden
    for u in (1.2, 3.4, 5.6):
        obox(M.mesh(0, "turq"), BF, u, u + 0.18, -8.5, -8.3, GF, GF + 2.6)
        obox(M.mesh(0, "turq"), BF, u, u + 0.18, -4.6, -4.4, GF, GF + 2.6)
    for i in range(6):
        obox(M.mesh(0, "turq"), BF, 1.0, 5.9, -8.4 + i * 0.7, -8.2 + i * 0.7, GF + 2.55, GF + 2.75)

    # Thick pads. A flat quad at y=0.06 sinks into the sand and the garden reads as dirt.
    for lod in (0, 1):
        obox(M.mesh(lod, "lawn"), BF, -2, L + 2, -18, 8, 0.0, 0.2)
    obox(M.mesh(0, "wood"), BF, -1, L + 1, -12.2, -9.4, 0.16, 0.32)
    obox(M.mesh(0, "wood"), BF, 5.6, 8.6, -16, -3.5, 0.16, 0.32)
    obox(M.mesh(1, "wood"), BF, 0, L, -11.4, -9.8, 0.14, 0.28)
    for u in (2, 8, 14, 22):
        obox(M.mesh(0, "hedge"), BF, u, u + 3.2, -3.2, -2.2, 0.1, 0.8)

    png = logo_png()
    vquad(M.mesh(0, "sign"), BF, 10.4, 16.4, -0.2, GF + 0.8, GF + 2.3, -1,
          uvs=((1, 1), (0, 1), (0, 0), (1, 0)))
    vquad(M.mesh(1, "sign"), BF, 11, 16, -0.1, GF + 1.0, GF + 2.2, -1,
          uvs=((1, 1), (0, 1), (0, 0), (1, 0)))

    for u, v, h, spin in (
        (-1.5, -6, 12, 0.2), (4, -13, 13, 0.8), (12, -7, 11, 1.1),
        (20, -12, 12, 0.4), (L + 1, -5, 10, 1.4), (7, 6, 11, 0.6),
    ):
        palm(M, BF, u, v, h, spin)

    fold_body(M, keep={"sign", "glass"})
    info = write_glb(M, HERO / "boardwalk.glb", images=[png_bytes(png)])
    check_glb(HERO / "boardwalk.glb")
    look = BF.p(L * 0.5, 0, 4)
    cam = BF.p(L * 0.45, -18, 2.4)
    print(NAME, info, "L", round(L, 1))
    print("look", round(O[0] + look[0], 1), round(O[1] + look[2], 1))
    print("cam", round(O[0] + cam[0], 1), round(O[1] + cam[2], 1))
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    patch(info)
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "boardwalk"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = block.replace(
        '"status": "v3-procedural"',
        '"status": "v4-grokbot (pastel casitas, yellow stair, turquoise pergola)"',
        1,
    )
    block = re.sub(r'"boardwalk_lod0": \d+', f'"boardwalk_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"boardwalk_lod1": \d+', f'"boardwalk_lod1": {info["lod1"]}', block, count=1)
    new = (
        '"ref_sources": "boardwalkaruba.com gallery (pink and yellow two-storey casitas, '
        'white rails, turquoise pergola, brown tile, wooden boardwalk). OSM footprint. '
        'The name is drawn. Built by tools/grokbot/boardwalk.py"'
    )
    block2, n = re.subn(r'"ref_sources": "(?:[^"\\]|\\.)*"', new, block, count=1)
    if n != 1:
        raise SystemExit("boardwalk ref anchor missing")
    block = block2
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == "boardwalk")
    assert hit["tris"]["boardwalk_lod0"] == info["lod0"]


if __name__ == "__main__":
    build()
