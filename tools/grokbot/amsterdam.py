#!/usr/bin/env python3
"""Amsterdam Manor: yellow Dutch wings, orange tile, white gables.

The resort's own aerials show two-storey sunflower-yellow wings, orange
clay roofs, white dormers and curved gable shoulders, a stair to a central
door, a courtyard fountain, a pool with yellow umbrellas and palms. Same
hero id and origin. Nothing is pasted.
"""
import json
import math
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, fold_body, write_glb  # noqa: E402
from hotelkit import Frame, hip_roof, obox, tri_out  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
NAME = "amsterdam"
O = (-9180.2, -3847.9)

YELLOW = (1.0, 0.90, 0.28)
WHITE = (0.96, 0.95, 0.93)
ORANGE = (0.86, 0.28, 0.08)
GLASS = (0.62, 0.80, 0.88)
WATER = (0.22, 0.68, 0.86)
PAVER = (0.78, 0.72, 0.62)
LAWN = (0.32, 0.58, 0.26)
HEDGE = (0.18, 0.42, 0.16)
FLOWER = (0.85, 0.45, 0.15)
TRUNK = (0.40, 0.28, 0.16)
FROND = (0.14, 0.42, 0.18)
SHADE = (0.95, 0.78, 0.12)


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def palm(M, F, u, v, h=9.0):
    obox(M.mesh(0, "trunk"), F, u - 0.16, u + 0.16, v - 0.16, v + 0.16, 0.1, h)
    cen = F.p(u, v, h - 2)
    mesh = M.mesh(0, "frond")
    for i in range(6):
        a = i * math.tau / 6
        tri_out(
            mesh,
            F.p(u, v, h + 0.3),
            F.p(u + math.cos(a) * 3.2, v + math.sin(a) * 3.2, h - 1.4),
            F.p(u + math.cos(a + 0.4) * 3.2, v + math.sin(a + 0.4) * 3.2, h - 1.6),
            cen,
        )


def umbrella(M, F, u, v):
    obox(M.mesh(0, "white"), F, u - 0.06, u + 0.06, v - 0.06, v + 0.06, 0.2, 2.4)
    cen = F.p(u, v, 1.2)
    mesh = M.mesh(0, "shade")
    for i in range(6):
        a = i * math.tau / 6
        tri_out(
            mesh,
            F.p(u, v, 2.7),
            F.p(u + math.cos(a) * 1.5, v + math.sin(a) * 1.5, 2.25),
            F.p(u + math.cos(a + math.tau / 6) * 1.5, v + math.sin(a + math.tau / 6) * 1.5, 2.25),
            cen,
        )


def wing(M, F, u0, u1, v0, v1, floors=2):
    """Yellow block, white band, orange hip, dormers on both long sides."""
    fh = 3.1
    y1 = floors * fh
    for lod in (0, 1):
        obox(M.mesh(lod, "yellow"), F, u0, u1, v0, v1, 0.15, y1)
        obox(M.mesh(lod, "white"), F, u0 - 0.15, u1 + 0.15, v0 - 0.15, v1 + 0.15, y1 - 0.28, y1 + 0.08)
        hip_roof(M.mesh(lod, "orange"), F, u0 - 0.4, u1 + 0.4, v0 - 0.5, v1 + 0.5, y1, 2.4)
    if floors < 2:
        return
    # white-framed windows and dormers on the street (+v) and ocean (-v) faces
    span = u1 - u0
    n = max(3, int(span / 4.8))
    for side, v, out in ((1, v1, 1), (-1, v0, -1)):
        for k in range(n):
            u = u0 + (k + 0.5) * span / n
            obox(M.mesh(0, "white"), F, u - 0.55, u + 0.55, v - 0.08 * out, v + 0.12 * out, 1.15, 2.7)
            # dormer sitting on the roof
            obox(M.mesh(0, "white"), F, u - 0.7, u + 0.7, v - 0.15, v + 0.15, y1 + 0.15, y1 + 1.7)
            obox(M.mesh(0, "glass"), F, u - 0.38, u + 0.38, v + 0.16 * out, v + 0.28 * out, y1 + 0.4, y1 + 1.35)
    # gable shoulders at the two ends
    for u, out in ((u0, -1), (u1, 1)):
        obox(M.mesh(0, "white"), F, u - 0.25, u + 0.25, v0 - 0.2, v1 + 0.2, y1, y1 + 2.6)


def build():
    M = Model(NAME)
    for name, rgb, rough in (
        ("yellow", YELLOW, 0.65), ("white", WHITE, 0.5), ("orange", ORANGE, 0.75),
        ("glass", GLASS, 0.08), ("water", WATER, 0.1), ("paver", PAVER, 0.85),
        ("lawn", LAWN, 0.9), ("hedge", HEDGE, 0.85), ("flower", FLOWER, 0.7),
        ("trunk", TRUNK, 0.9), ("frond", FROND, 0.75), ("shade", SHADE, 0.45),
    ):
        M.material(name, lin(rgb), rough=rough, double=(name in ("glass", "frond", "shade")))
    # Long wing runs north from the origin. +v is east, toward the road.
    F = Frame((-9186.5, -3844.0), (-9186.5, -3768.0), O)
    L = F.L
    wing(M, F, 2, L - 2, -6.2, 6.2)
    # a shorter street-side wing, east of the main block
    wing(M, F, 8, L - 18, -22, -14, floors=2)
    # +v is west, the ocean. The street court and the stair face east (-v).
    mid = L * 0.5
    for i, y in enumerate((0.15, 0.45, 0.75, 1.05)):
        obox(M.mesh(0, "white"), F, mid - 2.2, mid + 2.2, -7.4 - i * 0.45, -6.2 - i * 0.45, y, y + 0.32)
    obox(M.mesh(0, "glass"), F, mid - 0.7, mid + 0.7, -6.3, -6.05, 1.1, 2.8)
    for lod in (0, 1):
        obox(M.mesh(lod, "paver"), F, -2, L + 4, -28, -8, 0.02, 0.16)
        obox(M.mesh(lod, "paver"), F, -4, L + 2, 6.4, 22, 0.02, 0.16)
        obox(M.mesh(lod, "water"), F, 10, L - 16, 10, 18, 0.18, 0.36)
        obox(M.mesh(lod, "white"), F, 1.5, 6.5, -13.2, -9.2, 0.16, 0.55)
        obox(M.mesh(lod, "water"), F, 2.2, 5.8, -12.5, -9.8, 0.5, 0.7)
        obox(M.mesh(lod, "lawn"), F, -8, L + 8, 20, 36, 0.0, 0.1)
        obox(M.mesh(lod, "hedge"), F, 4, L - 4, -27.6, -26.5, 0.16, 0.7)
        obox(M.mesh(lod, "flower"), F, 6, 12, -27.2, -26.2, 0.55, 0.95)
    for u in range(0, int(L), 6):
        obox(M.mesh(0, "white"), F, u, u + 0.28, -27.7, -27.2, 0.16, 1.15)
        obox(M.mesh(0, "white"), F, u + 0.28, u + 5.4, -27.55, -27.35, 0.16, 0.7)
    for u, v in ((14, 14), (28, 15), (L - 20, 13), (6, -18), (L - 10, -20)):
        umbrella(M, F, u, v)
    for u, v, h in ((-2, 8, 11), (L + 2, 10, 12), (4, -24, 8), (L - 4, -12, 10), (mid, -22, 7)):
        palm(M, F, u, v, h)
    fold_body(M, keep={"glass"})
    info = write_glb(M, HERO / f"{NAME}.glb")
    check_glb(HERO / f"{NAME}.glb")
    print(NAME, info, "L", round(L, 1))
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    patch(info)
    cam = F.p(L * 0.45, -36, 10)
    look = F.p(L * 0.42, -4, 5)
    print("cam", round(O[0] + cam[0], 1), round(O[1] + cam[2], 1))
    print("look", round(O[0] + look[0], 1), round(O[1] + look[2], 1))


def patch(info):
    text = MANIFEST.read_text()
    i = text.find(f'"id": "{NAME}"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block, n = re.subn(
        r'"status": "[^"]*"',
        '"status": "v4-grokbot (yellow Dutch wings, orange tile, white dormers)"',
        block, count=1,
    )
    if n != 1:
        raise SystemExit("status")
    block = re.sub(rf'"{NAME}_lod0": \d+', f'"{NAME}_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(rf'"{NAME}_lod1": \d+', f'"{NAME}_lod1": {info["lod1"]}', block, count=1)
    block = re.sub(r'"textures": \d+', '"textures": 0', block, count=1)
    new = (
        '"ref_sources": "amsterdammanor.com exterior and aerial '
        '(sunflower-yellow wings, orange clay roofs, white dormers and gable shoulders, '
        'central stair, courtyard fountain, pool, yellow umbrellas, palms). '
        'No photo is pasted. Built by tools/grokbot/amsterdam.py"'
    )
    block, n = re.subn(r'"ref_sources": "(?:[^"\\]|\\.)*"', new, block, count=1)
    if n != 1:
        raise SystemExit("refs")
    MANIFEST.write_text(text[:i] + block + text[k:])


if __name__ == "__main__":
    build()
