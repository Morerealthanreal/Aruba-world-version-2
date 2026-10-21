#!/usr/bin/env python3
"""Bucuti & Tara Beach Resort.

Same hero id. The resort gallery entrance shows a dark wavy wall with the
name in white letters, a beige tower and brown hip behind it, a stone column
and a black canopy, hedges, lawn and an agave. The aerial shows the white
wing, a rectangular pool and a red hip pavilion. The letters are drawn.
Nothing is pasted.
"""
import json
import math
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, fold_body, write_glb  # noqa: E402
from hotelkit import FONT_SANS, Frame, hip_roof, obox, png_bytes, text_png, tri_out, vquad  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-9955.21, -2438.73)
NAME = "m_bucutiandtararesort"

WAVE = (0.34, 0.33, 0.32)
BEIGE = (0.90, 0.82, 0.68)
WHITE = (0.96, 0.95, 0.92)
TILE = (0.55, 0.28, 0.18)
RED = (0.62, 0.22, 0.16)
STONE = (0.82, 0.80, 0.76)
BLACK = (0.10, 0.10, 0.11)
GLASS = (0.45, 0.62, 0.74)
HEDGE = (0.16, 0.40, 0.18)
LAWN = (0.28, 0.55, 0.24)
PATH = (0.78, 0.76, 0.70)
GRAVEL = (0.70, 0.68, 0.62)
AGAVE = (0.35, 0.55, 0.48)
POOL = (0.30, 0.78, 0.88)
COPING = (0.90, 0.88, 0.84)
TRUNK = (0.40, 0.26, 0.14)
FROND = (0.14, 0.42, 0.18)
UMBR = (0.94, 0.94, 0.92)


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def palm(M, F, u, v, h=10.0):
    obox(M.mesh(0, "trunk"), F, u - 0.28, u + 0.28, v - 0.28, v + 0.28, 0.2, h)
    mesh = M.mesh(0, "frond")
    crown, cen = F.p(u, v, h), F.p(u, v, h - 1.5)
    for i in range(6):
        a = i * math.tau / 6
        tri_out(
            mesh, crown,
            F.p(u + math.cos(a) * 0.4, v + math.sin(a) * 0.4, h - 0.1),
            F.p(u + math.cos(a) * 3.6, v + math.sin(a) * 3.6, h - 1.4),
            cen,
        )


def agave(M, F, u, v):
    mesh = M.mesh(0, "agave")
    base = F.p(u, v, 0.45)
    cen = F.p(u, v, 0.2)
    for i in range(8):
        a = i * math.tau / 8
        tri_out(
            mesh, base,
            F.p(u + math.cos(a) * 0.15, v + math.sin(a) * 0.15, 0.7),
            F.p(u + math.cos(a) * 1.85, v + math.sin(a) * 1.85, 0.28),
            cen,
        )


def build():
    M = Model(NAME)
    for n, c, r in (
        ("wave", WAVE, 0.72), ("beige", BEIGE, 0.75), ("white", WHITE, 0.6),
        ("tile", TILE, 0.78), ("red", RED, 0.7), ("stone", STONE, 0.7),
        ("black", BLACK, 0.45), ("glass", GLASS, 0.12), ("hedge", HEDGE, 0.9),
        ("lawn", LAWN, 0.92), ("path", PATH, 0.8), ("gravel", GRAVEL, 0.9),
        ("agave", AGAVE, 0.7), ("pool", POOL, 0.15), ("coping", COPING, 0.55),
        ("trunk", TRUNK, 0.85), ("frond", FROND, 0.8), ("umbr", UMBR, 0.6),
    ):
        M.material(n, lin(c), rough=r)
    M.material("sign", (1, 1, 1), rough=0.45, textured=True)

    # +u runs north. -v is the street the entrance photo faces. Looking
    # west from that street puts north on screen left, so the column,
    # canopy and agave sit at the south end and read on the right.
    F = Frame((-9968.0, -2476.0), (-9968.0, -2404.0), O)
    L = F.L
    wave = M.mesh(0, "wave")
    for i in range(16):
        y0 = 0.25 + i * 0.34
        for k in range(8):
            u0 = 16.0 + k * 3.05
            shift = 0.95 * math.sin(k * 0.9 + i * 0.55)
            obox(wave, F, u0, u0 + 2.85, -0.15 + shift, 0.85 + shift, y0, y0 + 0.32)
    obox(M.mesh(1, "wave"), F, 16.0, 40.5, 0.0, 1.15, 0.25, 5.7)
    # Beige tower and brown hip behind the middle of the wall.
    obox(M.mesh(0, "beige"), F, 24.0, 34.5, 1.4, 9.0, 0.4, 8.8)
    obox(M.mesh(1, "beige"), F, 24.2, 34.2, 1.5, 8.8, 0.4, 8.5)
    hip_roof(M.mesh(0, "tile"), F, 23.2, 35.2, 0.8, 9.6, 8.6, 2.4)
    hip_roof(M.mesh(1, "tile"), F, 23.6, 34.8, 1.2, 9.2, 8.5, 1.8)
    vquad(M.mesh(0, "glass"), F, 26.2, 28.4, 1.35, 5.6, 7.8, -1)
    # Drawn name on the street face, with the white rule under the letters.
    vquad(
        M.mesh(0, "sign"), F, 18.5, 36.5, -0.58, 2.35, 4.55, -1,
        uvs=((1, 1), (0, 1), (0, 0), (1, 0)),
    )
    vquad(
        M.mesh(1, "sign"), F, 20, 35, -0.5, 2.6, 4.3, -1,
        uvs=((1, 1), (0, 1), (0, 0), (1, 0)),
    )
    obox(M.mesh(0, "white"), F, 18.8, 35.8, -0.7, -0.52, 2.05, 2.22)
    # Stone column and black glass canopy on the south end, in the right of the frame.
    obox(M.mesh(0, "stone"), F, 13.0, 15.2, -1.5, 0.6, 0.2, 4.5)
    obox(M.mesh(0, "black"), F, 12.2, 16.4, -6.2, 0.4, 3.45, 3.75)
    obox(M.mesh(0, "glass"), F, 12.5, 16.1, -5.9, 0.2, 3.15, 3.45)
    obox(M.mesh(1, "black"), F, 12.4, 16.2, -5.6, 0.2, 3.35, 3.7)
    # Arrival garden in front of the wall: path, hedge, lawn, gravel, agave.
    obox(M.mesh(0, "path"), F, 4.0, 42.0, -7.2, -4.4, 0.08, 0.26)
    obox(M.mesh(0, "hedge"), F, 16.2, 41.0, -5.3, -3.7, 0.2, 1.35)
    obox(M.mesh(0, "hedge"), F, 16.4, 40.6, -5.15, -3.85, 0.9, 1.85)
    obox(M.mesh(0, "hedge"), F, 2.2, 14.8, -4.4, -2.8, 0.2, 1.15)
    for lod in (0, 1):
        obox(M.mesh(lod, "lawn"), F, -2.0, 48.0, -26.0, -3.0, 0.02, 0.16)
        obox(M.mesh(lod, "lawn"), F, 0.0, L, 10.0, 34.0, 0.02, 0.16)
    obox(M.mesh(0, "coping"), F, 6.0, 13.0, -11.6, -7.2, 0.12, 0.28)
    obox(M.mesh(0, "gravel"), F, 6.4, 12.6, -11.2, -7.6, 0.26, 0.42)
    agave(M, F, 14.5, -8.6)
    agave(M, F, 20.5, -9.4)
    agave(M, F, 10.2, -12.5)
    obox(M.mesh(0, "tile"), F, 15.6, 17.4, -0.35, 0.55, 0.3, 3.15)
    for u, v, h in ((0.5, -7, 12), (44, -8, 11), (50, 6, 10), (20, 16, 9)):
        palm(M, F, u, v, h)
    obox(M.mesh(1, "trunk"), F, 33, 33.4, -9.2, -8.8, 0.2, 8)

    # White ocean wing, red hip pavilion, and the rectangular pool from the aerial.
    # Kept north of the entrance so this camera does not show it as the subject.
    obox(M.mesh(0, "white"), F, 58.0, 72.0, 8.0, 20.0, 0.4, 13.2)
    obox(M.mesh(1, "white"), F, 58.0, 72.0, 8.0, 20.0, 0.4, 12.8)
    for f in range(4):
        y = 1.3 + f * 3.0
        vquad(M.mesh(0, "glass"), F, 59.0, 71.0, 7.9, y, y + 1.5, -1)
        obox(M.mesh(0, "white"), F, 58.4, 71.6, 6.6, 8.05, y + 1.7, y + 1.95)
        for k in range(4):
            u = 60.0 + k * 2.8
            obox(M.mesh(0, "white"), F, u, u + 0.22, 6.7, 8.1, y - 0.2, y + 2.5)
    # Pool deck, loungers and a second row of planting so the court is not bare.
    obox(M.mesh(0, "path"), F, 16.0, 44.0, 16.2, 32.5, 0.12, 0.32)
    for u in (20, 24, 29, 33, 37, 22, 31, 39):
        obox(M.mesh(0, "white"), F, u, u + 1.7, 16.6, 18.0, 0.32, 0.7)
        obox(M.mesh(0, "pool"), F, u + 0.1, u + 1.55, 16.75, 17.85, 0.68, 0.82)
        obox(M.mesh(0, "white"), F, u, u + 1.7, 31.2, 32.4, 0.32, 0.7)
    for u, v, s in (
        (50, 8, 1.2), (10, 14, 1.0), (42, 12, 1.2), (55, 10, 1.0),
        (6, 18, 1.2), (28, 14, 1.1), (46, 22, 1.3), (60, 16, 1.0),
        (52, -6, 1.1), (58, -4, 1.0),
    ):
        obox(M.mesh(0, "hedge"), F, u, u + s, v, v + s * 0.8, 0.2, 1.0)
        obox(M.mesh(0, "frond"), F, u + 0.15, u + s * 0.7, v + 0.1, v + s * 0.5, 0.7, 1.35)
    hip_roof(M.mesh(0, "red"), F, 48.5, 60.5, 12.5, 22.5, 4.2, 3.4)
    hip_roof(M.mesh(1, "red"), F, 49, 60, 13, 22, 4.2, 2.6)
    obox(M.mesh(0, "coping"), F, 18.0, 40.0, 18.5, 30.5, 0.35, 0.7)
    obox(M.mesh(0, "pool"), F, 19.0, 39.0, 19.5, 29.5, 0.45, 0.78)
    obox(M.mesh(1, "pool"), F, 19.2, 38.8, 19.6, 29.4, 0.4, 0.75)
    for u, v in ((22, 21), (28, 24), (34, 22), (24, 27)):
        obox(M.mesh(0, "white"), F, u, u + 0.12, v, v + 0.12, 0.7, 2.5)
        obox(M.mesh(0, "umbr"), F, u - 1.1, u + 1.3, v - 1.1, v + 1.3, 2.45, 2.62)

    fold_body(M, keep={"sign"})
    png = text_png(["BUCUTI & TARA"], 1024, 256, (0, 0, 0, 0), (248, 248, 246, 255), font=FONT_SANS)
    info = write_glb(M, HERO / f"{NAME}.glb", images=[png_bytes(png)])
    check_glb(HERO / f"{NAME}.glb")
    print(NAME, info, "L", round(L, 1))
    if not 1200 <= info["lod0"] <= 7000:
        raise SystemExit(f"lod0 {info['lod0']}")
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    cam = F.p(8.0, -11.0, 1.7)
    look = F.p(26.0, 0.3, 3.3)
    print("cam", round(O[0] + cam[0], 2), round(cam[1], 2), round(O[1] + cam[2], 2))
    print("look", round(O[0] + look[0], 2), round(look[1], 2), round(O[1] + look[2], 2))
    patch(info)
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find(f'"id": "{NAME}"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = re.sub(
        r'"status": "[^"]*"',
        '"status": "v4-grokbot (wavy arrival wall, white wing, pool)"',
        block, count=1,
    )
    block = re.sub(rf'"{NAME}_lod0": \d+', f'"{NAME}_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(rf'"{NAME}_lod1": \d+', f'"{NAME}_lod1": {info["lod1"]}', block, count=1)
    block = re.sub(r'"textures": \d+', '"textures": 1', block, count=1)
    new = (
        '"ref_sources": "bucuti.com gallery (dark wavy arrival wall, BUCUTI & TARA letters, '
        'beige tower, brown hip, stone column, black canopy, hedges, agave; aerial white wing, '
        'rectangular pool, red hip). OSM footprint. Letters are drawn. Built by tools/grokbot/bucuti.py"'
    )
    block2, n = re.subn(r'"ref_sources": "(?:[^"\\]|\\.)*"', new, block, count=1)
    if n != 1:
        raise SystemExit("bucuti ref anchor missing")
    MANIFEST.write_text(text[:i] + block2 + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == NAME)
    assert hit["tris"][f"{NAME}_lod0"] == info["lod0"]
    assert hit["textures"] == 1


if __name__ == "__main__":
    build()
