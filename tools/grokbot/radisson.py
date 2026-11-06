#!/usr/bin/env python3
"""Radisson Blu Aruba.

Same hero id and origin. The hotel's own gallery (bluaruba.com) shows a
white balcony tower with blue glass and a roof sign, a three-storey entrance
with a flat canopy and roof planters, a glass-sphere fountain, and a curved
pool with palms. The wordmark is drawn. Nothing is a pasted photograph.
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
    FONT_SERIF, Frame, balcony_wing, obox, png_bytes, tri_out, vquad,
)

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-7830.95, -6156.4)

WHITE = (0.93, 0.93, 0.92)
CREAM = (0.90, 0.86, 0.78)
TAN = (0.78, 0.64, 0.46)
GLASS = (0.55, 0.78, 0.90)
PANE = (0.22, 0.28, 0.34)
MULLION = (0.12, 0.13, 0.15)
PAVER = (0.84, 0.82, 0.76)
RAIL = (0.96, 0.97, 0.98)
POOL = (0.20, 0.62, 0.82)
DECK = (0.78, 0.74, 0.68)
LAWN = (0.30, 0.58, 0.26)
HEDGE = (0.14, 0.40, 0.18)
FLOWER = (0.82, 0.28, 0.22)
BLOOM = (0.95, 0.72, 0.18)
PINK = (0.86, 0.42, 0.55)
RED = (0.78, 0.16, 0.12)
TRUNK = (0.40, 0.26, 0.14)
FROND = (0.12, 0.40, 0.16)
BLUE = (0.10, 0.28, 0.62)
SAND = (0.82, 0.78, 0.70)

GF = 0.35
FH = 3.15


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def hquad(mesh, F, u0, u1, v0, v1, y):
    A, B = F.p(u0, v0, y), F.p(u1, v0, y)
    C, D = F.p(u1, v1, y), F.p(u0, v1, y)
    cen = F.p((u0 + u1) / 2, (v0 + v1) / 2, y - 1)
    tri_out(mesh, A, B, C, cen)
    tri_out(mesh, A, C, D, cen)


def palm(M, F, u, v, h=12.0, spin=0.0):
    obox(M.mesh(0, "trunk"), F, u - 0.2, u + 0.2, v - 0.2, v + 0.2, 0.1, h * 0.55)
    obox(M.mesh(0, "trunk"), F, u - 0.12, u + 0.12, v - 0.12, v + 0.12, h * 0.48, h)
    crown, cen = F.p(u, v, h + 0.2), F.p(u, v, h - 4)
    mesh = M.mesh(0, "frond")
    for i in range(6):
        a = i * math.tau / 6 + spin
        reach = 2.8 + (i % 2) * 0.7
        tri_out(mesh, crown,
                F.p(u + math.cos(a) * reach * 0.3, v + math.sin(a) * reach * 0.3, h),
                F.p(u + math.cos(a) * reach, v + math.sin(a) * reach, h - 1.4),
                cen)


def logo_png():
    im = Image.new("RGBA", (1024, 256), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    font = ImageFont.truetype(FONT_SERIF, 150)
    text = "Radisson"
    tw = font.getlength(text)
    dr.text(((780 - tw) / 2, 40), text, font=font, fill=(18, 42, 110, 255))
    dr.rectangle((860, 48, 980, 200), fill=(20, 78, 190, 255))
    return im


def build():
    M = Model("radisson")
    for n, c, r in (
        ("wall", WHITE, .7), ("recess", (0.82, 0.86, 0.90), .5),
        ("slab", WHITE, .6), ("rail", RAIL, .4), ("glass", GLASS, .15),
        ("fin", WHITE, .6), ("cream", CREAM, .75), ("pool", POOL, .2),
        ("deck", DECK, .85), ("lawn", LAWN, .9), ("hedge", HEDGE, .88),
        ("flower", FLOWER, .8), ("bloom", BLOOM, .7), ("pink", PINK, .7),
        ("red", RED, .6), ("trunk", TRUNK, .85),
        ("frond", FROND, .8), ("blue", BLUE, .4), ("sand", SAND, .9),
        ("tan", TAN, .72), ("pane", PANE, .25), ("mullion", MULLION, .5),
        ("paver", PAVER, .9),
    ):
        M.material(n, lin(c), rough=r)
    M.material("sign", (1, 1, 1), rough=.4, textured=True, emissive=.18)

    # Footprint long axis, north to south. +v is west (ocean). Street is -v.
    BF = Frame((-7827.8, -6194.1), (-7834.1, -6118.7), O)
    L = BF.L
    hv = 13.0
    floors = 13
    top = balcony_wing(
        M, BF, 2, L - 2, hv, GF, floors, FH, 4.6,
        {"wall": "wall", "recess": "recess", "slab": "slab", "rail": "rail", "glass": "glass", "fin": "fin"},
        depth=1.35, faces=(-1, 1),
    )
    obox(M.mesh(0, "wall"), BF, 1.2, L - 1.2, -hv + 0.4, hv - 0.4, top, top + 1.3)
    obox(M.mesh(1, "wall"), BF, 1.2, L - 1.2, -hv + 0.4, hv - 0.4, top, top + 1.1)
    png = logo_png()
    # Roof wordmark on the street face. Left edge of the texture lands south.
    vquad(M.mesh(0, "sign"), BF, L * 0.34, L * 0.66, -hv - 0.2, top + 1.5, top + 4.2, -1,
          uvs=((1, 1), (0, 1), (0, 0), (1, 0)))
    vquad(M.mesh(1, "sign"), BF, L * 0.36, L * 0.64, -hv - 0.12, top + 1.7, top + 4.0, -1,
          uvs=((1, 1), (0, 1), (0, 0), (1, 0)))

    # Two-storey glass entrance. Dark mullions, a deep tan canopy on columns,
    # roof planters. Not the white slabs with blue bands.
    eu0, eu1 = L * 0.18, L * 0.82
    ev0, ev1 = -hv - 26, -hv - 12
    etop = GF + 2 * 3.6
    for lod in (0, 1):
        obox(M.mesh(lod, "tan"), BF, eu0, eu1, ev0, ev1, GF, etop)
        # deep canopy, tan, projecting toward the drive. Thick enough that the
        # fascia and the soffit read, the way the entrance photo does.
        obox(M.mesh(lod, "tan"), BF, eu0 + 2, eu1 - 2, ev0 - 9.5, ev0 + 0.4, etop - 2.15, etop - 0.28)
        obox(M.mesh(lod, "cream"), BF, eu0 - 0.4, eu1 + 0.4, ev0 - 0.3, ev1 + 0.3, etop - 0.15, etop + 0.45)
    # window grid: dark panes with mullions, two floors, both sides of the canopy
    for f in range(2):
        y0 = GF + 0.7 + f * 3.5
        for u0, u1 in ((eu0 + 0.8, (eu0 + eu1) / 2 - 4.2), ((eu0 + eu1) / 2 + 4.2, eu1 - 0.8)):
            vquad(M.mesh(0, "pane"), BF, u0, u1, ev0 - 0.06, y0, y0 + 1.85, -1)
            vquad(M.mesh(0, "mullion"), BF, u0 - 0.12, u0, ev0 - 0.1, y0 - 0.08, y0 + 1.95, -1)
            vquad(M.mesh(0, "mullion"), BF, u1, u1 + 0.12, ev0 - 0.1, y0 - 0.08, y0 + 1.95, -1)
            vquad(M.mesh(0, "mullion"), BF, u0, u1, ev0 - 0.1, y0 - 0.1, y0 + 0.06, -1)
            vquad(M.mesh(0, "mullion"), BF, u0, u1, ev0 - 0.1, y0 + 1.78, y0 + 1.95, -1)
            cols = 4
            for k in range(1, cols):
                uu = u0 + (u1 - u0) * k / cols
                vquad(M.mesh(0, "mullion"), BF, uu - 0.05, uu + 0.05, ev0 - 0.12, y0, y0 + 1.85, -1)
            vquad(M.mesh(0, "mullion"), BF, u0, u1, ev0 - 0.12, y0 + 0.88, y0 + 0.98, -1)
    for i, u in enumerate((
        (eu0 + eu1) / 2 - 3.4, (eu0 + eu1) / 2 - 1.1, (eu0 + eu1) / 2 + 1.1, (eu0 + eu1) / 2 + 3.4,
    )):
        obox(M.mesh(0, "slab"), BF, u - 0.42, u + 0.42, ev0 - 9.4, ev0 - 8.2, GF, etop - 2.15)
        obox(M.mesh(0, "tan"), BF, u - 0.42, u + 0.42, ev0 - 9.4, ev0 - 8.3, GF, GF + 0.7)
    # roof garden: planters and red umbrellas
    for u, side in ((eu0 + 0.6, 1), (eu1 - 8.5, 1)):
        obox(M.mesh(0, "hedge"), BF, u, u + 7.2, ev1 - 1.6, ev1 + 0.3, etop + 0.4, etop + 1.15)
        obox(M.mesh(0, "flower"), BF, u + 0.4, u + 6.6, ev1 - 1.3, ev1 - 0.2, etop + 1.05, etop + 1.4)
        obox(M.mesh(0, "red"), BF, u + 2.2, u + 4.6, ev1 - 2.4, ev1 - 0.4, etop + 1.35, etop + 1.55)
        obox(M.mesh(0, "red"), BF, u + 2.6, u + 4.2, ev1 - 2.2, ev1 - 0.6, etop + 1.55, etop + 2.5)
    # low planter wall across the front, full of flowers
    wall_v0, wall_v1 = ev0 - 14.5, ev0 - 13.1
    obox(M.mesh(0, "cream"), BF, eu0 - 1, eu1 + 1, wall_v0, wall_v1, 0.2, 0.85)
    blooms = ("flower", "bloom", "pink", "red", "bloom", "flower")
    span = (eu1 - eu0) / len(blooms)
    for i, name in enumerate(blooms):
        obox(M.mesh(0, name), BF, eu0 + i * span, eu0 + (i + 1) * span - 0.15, wall_v0 - 0.15, wall_v1 + 0.15, 0.8, 1.25)

    # Glass sphere on a round fountain, in the drive.
    fu, fv = (eu0 + eu1) / 2, ev0 - 22
    obox(M.mesh(0, "cream"), BF, fu - 4.5, fu + 4.5, fv - 1.6, fv + 1.6, 0.15, 0.7)
    obox(M.mesh(0, "pool"), BF, fu - 3.2, fu + 3.2, fv - 1.1, fv + 1.1, 0.7, 0.95)
    sphere = M.mesh(0, "glass")
    c = BF.p(fu, fv, 2.3)
    r = 1.15
    bands = 5
    for i in range(bands):
        a0 = -math.pi / 2 + math.pi * i / bands
        a1 = -math.pi / 2 + math.pi * (i + 1) / bands
        y0, y1 = c[1] + math.sin(a0) * r, c[1] + math.sin(a1) * r
        rad0, rad1 = math.cos(a0) * r, math.cos(a1) * r
        for k in range(8):
            t0, t1 = k * math.tau / 8, (k + 1) * math.tau / 8
            p00 = (c[0] + math.cos(t0) * rad0, y0, c[2] + math.sin(t0) * rad0)
            p01 = (c[0] + math.cos(t1) * rad0, y0, c[2] + math.sin(t1) * rad0)
            p11 = (c[0] + math.cos(t1) * rad1, y1, c[2] + math.sin(t1) * rad1)
            p10 = (c[0] + math.cos(t0) * rad1, y1, c[2] + math.sin(t0) * rad1)
            tri_out(sphere, p00, p01, p11, c)
            tri_out(sphere, p00, p11, p10, c)
    for lod in (0, 1):
        obox(M.mesh(lod, "paver"), BF, eu0 - 22, eu1 + 22, ev0 - 78, ev0 - 1.2, 0.0, 0.28)

    # Curved pool on the garden side of the tower.
    hquad(M.mesh(0, "deck"), BF, 6, L - 6, -hv - 16, -hv - 1, 0.12)
    hquad(M.mesh(1, "deck"), BF, 8, L - 8, -hv - 14, -hv - 2, 0.12)
    hquad(M.mesh(0, "pool"), BF, 14, L * 0.72, -hv - 12, -hv - 4, 0.2)
    hquad(M.mesh(0, "pool"), BF, L * 0.4, L - 10, -hv - 9, -hv - 3, 0.2)
    hquad(M.mesh(1, "pool"), BF, 16, L - 12, -hv - 11, -hv - 4, 0.18)
    for u in (18, L * 0.55, L - 16):
        obox(M.mesh(0, "wall"), BF, u, u + 2.2, -hv - 7, -hv - 5.2, 0.2, 0.55)
        obox(M.mesh(0, "wall"), BF, u + 0.3, u + 1.6, -hv - 14.5, -hv - 13, 0.15, 2.4)
        obox(M.mesh(0, "wall"), BF, u - 0.6, u + 2.6, -hv - 14.2, -hv - 12.6, 2.35, 2.55)
    obox(M.mesh(0, "red"), BF, L * 0.7, L * 0.7 + 3.2, -hv - 8, -hv - 5, 2.2, 2.45)
    hquad(M.mesh(0, "lawn"), BF, -4, L + 6, -hv - 34, hv + 4, 0.06)
    for i in range(8):
        u = 8 + i * (L - 16) / 7
        obox(M.mesh(0, "hedge"), BF, u, u + 4, -hv - 15.5, -hv - 14.2, 0.15, 0.9)
        if i % 2 == 0:
            obox(M.mesh(0, "flower"), BF, u + 0.4, u + 3.2, -hv - 16.6, -hv - 15.6, 0.15, 0.5)
    for u, v, h, spin in (
        (4, -hv - 6, 11, 0.2), (L * 0.3, -hv - 18, 13, 0.8), (L * 0.62, -hv - 17, 12, 1.2),
        (L - 6, -hv - 8, 14, 0.4), (eu0 + 2, ev0 - 4, 8, 1.0), (eu1 - 2, ev0 - 3, 9, 0.5),
        (fu - 8, fv, 10, 0.7), (fu + 8, fv + 1, 11, 1.4),
    ):
        palm(M, BF, u, v, h, spin)

    fold_body(M, keep={"sign", "glass"})
    info = write_glb(M, HERO / "radisson.glb", images=[png_bytes(png)])
    check_glb(HERO / "radisson.glb")
    look = BF.p(L * 0.5, -hv - 6, 18)
    cam = BF.p(L * 0.45, -hv - 42, 4)
    door = BF.p((eu0 + eu1) / 2, ev0 - 10, 4)
    print("radisson", info, "top", round(top, 1))
    print("tower", round(O[0] + look[0], 1), round(O[1] + look[2], 1))
    print("cam", round(O[0] + cam[0], 1), round(O[1] + cam[2], 1))
    print("door", round(O[0] + door[0], 1), round(O[1] + door[2], 1))
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    if not (1200 <= info["lod0"] <= 7000):
        print("WARN lod0", info["lod0"])
    patch(info)
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "radisson"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = re.sub(
        r'"status": "[^"]*"',
        '"status": "v5-grokbot (dark-mullion entrance, tan canopy, pale pavers)"',
        block,
        count=1,
    )
    block = re.sub(r'"radisson_lod0": \d+', f'"radisson_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"radisson_lod1": \d+', f'"radisson_lod1": {info["lod1"]}', block, count=1)
    block = block.replace('"textures": 2', '"textures": 1', 1)
    new = (
        '"ref_sources": "bluaruba.com gallery (white balcony tower, Radisson roof sign, '
        'three-storey canopy entrance, glass-sphere fountain, curved pool, palms). '
        'OSM footprint. Signs are drawn. Built by tools/grokbot/radisson.py"'
    )
    block2, n = re.subn(r'"ref_sources": "[^"]*"', new, block, count=1)
    if n != 1:
        raise SystemExit("radisson ref anchor missing")
    block = block2.replace(
        "generated by /workspace/landmarks/gen.mjs",
        "generated by tools/grokbot/radisson.py",
        1,
    )
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == "radisson")
    assert hit["tris"]["radisson_lod0"] == info["lod0"]
    assert hit["tris"]["radisson_lod1"] == info["lod1"]


if __name__ == "__main__":
    build()
