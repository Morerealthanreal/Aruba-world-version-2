#!/usr/bin/env python3
"""Playa Linda Beach Resort.

Same hero id and origin. playalinda.com shows peach stepped wings under
orange tile, white balcony rails, an arched porte-cochere, and a palapa
pool court. The shop names are drawn. Nothing is a pasted photograph.
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
    FONT_SANS, Frame, balcony_wing, hip_roof, obox, png_bytes, tri_out, vquad,
)

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-8200.66, -5907.65)
NAME = "m_playalindabeachresort"

PEACH = (0.90, 0.66, 0.55)
TILE = (0.78, 0.32, 0.14)
WHITE = (0.95, 0.94, 0.92)
GLASS = (0.25, 0.38, 0.48)
STONE = (0.62, 0.56, 0.48)
WOOD = (0.42, 0.24, 0.14)
POOL = (0.15, 0.62, 0.78)
DECK = (0.78, 0.74, 0.68)
THATCH = (0.72, 0.58, 0.32)
LAWN = (0.34, 0.62, 0.28)
HEDGE = (0.16, 0.42, 0.16)
CROTON = (0.72, 0.28, 0.16)
TRUNK = (0.40, 0.26, 0.14)
FROND = (0.12, 0.40, 0.16)
ROAD = (0.55, 0.54, 0.52)

GF = 0.35
FH = 3.05


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def hquad(mesh, F, u0, u1, v0, v1, y):
    A, B = F.p(u0, v0, y), F.p(u1, v0, y)
    C, D = F.p(u1, v1, y), F.p(u0, v1, y)
    cen = F.p((u0 + u1) / 2, (v0 + v1) / 2, y - 1)
    tri_out(mesh, A, B, C, cen)
    tri_out(mesh, A, C, D, cen)


def palm(M, F, u, v, h=12.0, spin=0.0):
    obox(M.mesh(0, "trunk"), F, u - 0.18, u + 0.18, v - 0.18, v + 0.18, 0.1, h)
    crown, cen = F.p(u, v, h + 0.2), F.p(u, v, h - 3)
    mesh = M.mesh(0, "frond")
    for i in range(6):
        a = i * math.tau / 6 + spin
        reach = 2.6 + (i % 2) * 0.5
        tri_out(mesh, crown,
                F.p(u + math.cos(a) * 0.8, v + math.sin(a) * 0.8, h),
                F.p(u + math.cos(a) * reach, v + math.sin(a) * reach, h - 1.2),
                cen)


def palapa(M, F, u, v, r=2.4):
    obox(M.mesh(0, "trunk"), F, u - 0.1, u + 0.1, v - 0.1, v + 0.1, 0.15, 2.5)
    apex = F.p(u, v, 4.3)
    mesh = M.mesh(0, "thatch")
    cen = F.p(u, v, 1.5)
    for i in range(7):
        a0, a1 = i * math.tau / 7, (i + 1) * math.tau / 7
        p0 = F.p(u + math.cos(a0) * r, v + math.sin(a0) * r, 2.55)
        p1 = F.p(u + math.cos(a1) * r, v + math.sin(a1) * r, 2.55)
        tri_out(mesh, p0, p1, apex, cen)


def logo_png():
    im = Image.new("RGBA", (1024, 256), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    dr.rectangle((0, 0, 512, 256), fill=(236, 232, 226, 255))
    dr.rectangle((512, 0, 1024, 256), fill=(236, 232, 226, 255))
    f = ImageFont.truetype(FONT_SANS, 78)
    for text, x0, w in (("MINI MARKET", 0, 512), ("CASTAWAYS", 512, 512)):
        tw = f.getlength(text)
        dr.text((x0 + (w - tw) / 2, 78), text, font=f, fill=(28, 36, 58, 255))
    return im


def build():
    M = Model(NAME)
    for n, c, r in (
        ("wall", PEACH, .75), ("recess", (0.78, 0.62, 0.52), .8),
        ("slab", WHITE, .55), ("rail", WHITE, .4), ("glass", GLASS, .18),
        ("fin", PEACH, .7), ("tile", TILE, .7), ("stone", STONE, .85),
        ("wood", WOOD, .7), ("pool", POOL, .15), ("deck", DECK, .85),
        ("thatch", THATCH, .9), ("lawn", LAWN, .9), ("hedge", HEDGE, .88),
        ("croton", CROTON, .8), ("trunk", TRUNK, .85), ("frond", FROND, .8),
        ("road", ROAD, .9), ("white", WHITE, .6),
    ):
        M.material(n, lin(c), rough=r)
    M.material("sign", (1, 1, 1), rough=.5, textured=True, emissive=.06)

    # North to south. +v is west, the pool and the beach. The gallery street looks at -v.
    BF = Frame((-8224.0, -5960.0), (-8204.0, -5868.0), O)
    L = BF.L
    hv = 9.0
    floors = 6
    top = balcony_wing(
        M, BF, 0, L * 0.62, hv, GF, floors, FH, 4.2,
        {"wall": "wall", "recess": "recess", "slab": "slab", "rail": "rail", "glass": "glass", "fin": "fin"},
        depth=1.25, faces=(-1, 1),
    )
    hip_roof(M.mesh(0, "tile"), BF, -1, L * 0.62 + 1, -hv - 1.2, hv + 1.2, top - 0.1, 2.8)
    hip_roof(M.mesh(1, "tile"), BF, 0, L * 0.62, -hv - 0.6, hv + 0.6, top - 0.1, 2.2)
    # stepped terraces, the white stairs that climb the peach wings
    for i, floors_here in enumerate((5, 4, 3)):
        u0 = L * 0.08 + i * 7
        yy = GF + floors_here * FH
        obox(M.mesh(0, "white"), BF, u0, u0 + 1.1, -hv - 1.6, -hv + 0.2, GF, yy)
        for s in range(floors_here):
            obox(M.mesh(0, "white"), BF, u0 - 1.4, u0 + 2.4, -hv - 2.4, -hv - 1.4,
                 GF + s * FH, GF + s * FH + 0.18)

    # shorter wing on the south, same peach and orange roof
    top2 = balcony_wing(
        M, BF, L * 0.68, L, hv - 1, GF, 4, FH, 4.4,
        {"wall": "wall", "recess": "recess", "slab": "slab", "rail": "rail", "glass": "glass", "fin": "fin"},
        depth=1.2, faces=(-1,),
    )
    hip_roof(M.mesh(0, "tile"), BF, L * 0.66, L + 1, -hv - 0.4, hv, top2 - 0.1, 2.4)
    hip_roof(M.mesh(1, "tile"), BF, L * 0.68, L, -hv, hv - 1, top2 - 0.1, 1.8)

    # arched porte-cochere. Keep the tile close to the facade. A deep hip
    # filled the street view and hid the shops.
    au0, au1 = L * 0.48, L * 0.72
    for lod in (0, 1):
        for side in (au0, au1 - 1.4):
            obox(M.mesh(lod, "stone"), BF, side, side + 1.4, -hv - 2.2, -hv - 0.3, GF, GF + 4.2)
        hip_roof(M.mesh(lod, "tile"), BF, au0 - 0.3, au1 + 0.1, -hv - 2.4, -hv + 0.3, GF + 4.0, 1.3)
    vquad(M.mesh(0, "wood"), BF, au0 + 1.6, au0 + 3.4, -hv - 2.3, GF + 0.4, GF + 3.8, -1)
    vquad(M.mesh(0, "wood"), BF, au1 - 3.6, au1 - 1.8, -hv - 2.3, GF + 0.4, GF + 3.8, -1)
    obox(M.mesh(0, "hedge"), BF, au0 + 1.6, au1 - 1.6, -hv - 2.8, -hv - 2.2, 0.1, 0.7)

    png = logo_png()
    # shops stand on the street side of the arch, in front of the eave.
    # each half of the sheet is 2:1, so the boards are 6 m by 3 m
    # Looking west, the south board is image-left (Mini Market in the street photo).
    vquad(M.mesh(0, "sign"), BF, au0 - 8.4, au0 - 0.6, -hv - 2.7, GF + 0.8, GF + 3.8, -1,
          uvs=((1, 1), (0.5, 1), (0.5, 0), (1, 0)))
    vquad(M.mesh(0, "sign"), BF, au1 - 0.2, au1 + 7.6, -hv - 2.7, GF + 0.8, GF + 3.8, -1,
          uvs=((0.5, 1), (0, 1), (0, 0), (0.5, 0)))
    vquad(M.mesh(1, "sign"), BF, au1 - 0.1, au1 + 7.2, -hv - 2.5, GF + 0.9, GF + 3.6, -1,
          uvs=((0.5, 1), (0, 1), (0, 0), (0.5, 0)))

    # pool court on the beach side
    hquad(M.mesh(0, "deck"), BF, 4, L - 4, hv + 2, hv + 28, 0.12)
    hquad(M.mesh(0, "pool"), BF, 10, L * 0.55, hv + 6, hv + 20, 0.22)
    hquad(M.mesh(1, "pool"), BF, 12, L * 0.5, hv + 8, hv + 18, 0.2)
    hquad(M.mesh(0, "lawn"), BF, -6, L + 8, -hv - 22, hv + 2, 0.08)
    hquad(M.mesh(1, "lawn"), BF, -2, L + 4, -hv - 16, hv, 0.08)
    hquad(M.mesh(0, "road"), BF, -8, L + 10, -hv - 30, -hv - 20, 0.06)
    for u in (6, 20, L * 0.45, L * 0.7):
        obox(M.mesh(0, "hedge"), BF, u, u + 6, -hv - 14, -hv - 12.6, 0.12, 0.85)
        obox(M.mesh(0, "croton"), BF, u + 0.4, u + 3, -hv - 16, -hv - 14.2, 0.12, 0.7)
    for u, v in ((14, hv + 8), (28, hv + 16), (L * 0.5, hv + 10), (L * 0.72, hv + 18)):
        palapa(M, BF, u, v)
    for u, v, h, spin in (
        (-2, -hv - 8, 13, 0.2), (L * 0.3, -hv - 6, 11, 0.8), (L - 4, -hv - 10, 12, 1.2),
        (8, hv + 4, 14, 0.4), (L * 0.4, hv + 22, 13, 1.0), (L - 8, hv + 6, 12, 0.6),
    ):
        palm(M, BF, u, v, h, spin)

    fold_body(M, keep={"sign", "glass"})
    info = write_glb(M, HERO / f"{NAME}.glb", images=[png_bytes(png)])
    check_glb(HERO / f"{NAME}.glb")
    look = BF.p(L * 0.5, -hv, 8)
    cam = BF.p(L * 0.45, -hv - 36, 3)
    print(NAME, info, "L", round(L, 1))
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
    i = text.find(f'"id": "{NAME}"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = block.replace(
        '"status": "v3-procedural (OSM footprint, photo/brand refs)"',
        '"status": "v4-grokbot (peach wings, orange roofs, porte-cochere)"',
        1,
    )
    block = re.sub(rf'"{NAME}_lod0": \d+', f'"{NAME}_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(rf'"{NAME}_lod1": \d+', f'"{NAME}_lod1": {info["lod1"]}', block, count=1)
    block = block.replace('"textures": 2', '"textures": 1', 1)
    new = (
        '"ref_sources": "playalinda.com gallery (peach stepped wings, orange tile, '
        'white rails, arched porte-cochere, Mini Market and Castaways, palapa pool). '
        'OSM footprint. Signs are drawn. Built by tools/grokbot/playalinda.py"'
    )
    block2, n = re.subn(r'"ref_sources": "(?:[^"\\]|\\.)*"', new, block, count=1)
    if n != 1:
        raise SystemExit("playa linda ref anchor missing")
    block = block2.replace(
        "generated by /workspace/landmarks/gen.mjs",
        "generated by tools/grokbot/playalinda.py",
        1,
    )
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == NAME)
    assert hit["tris"][f"{NAME}_lod0"] == info["lod0"]


if __name__ == "__main__":
    build()
