#!/usr/bin/env python3
"""Blue Residences, Eagle Beach: three 8-storey towers and a pool court.

Same hero id and origin. Aruba Property Buzz and the resort's own notes
describe Indigo, Aquamarine and Turquoise, each eight storeys, with wide
balconies, blue roofs, and resort pools on the ocean side of J.E. Irausquin
Boulevard. The wordmark is drawn. Nothing is a pasted photograph.
"""
import json
import math
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, fold_body, write_glb  # noqa: E402
from hotelkit import Frame, balcony_wing, obox, tri_out  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-9102.8, -4438.66)
NAME = "blue_residences"

# North end to south end of the OSM row. +v is inland (east); -v is the ocean.
A = (-9122.1, -4355.0)
B = (-9114.9, -4405.4)

# aruba.com pool-court photo: sand-beige walls, turquoise glass, white rails,
# bright blue roofs and matching umbrellas.
BEIGE = (0.93, 0.82, 0.66)
WARM = (0.78, 0.68, 0.54)
BLUE = (0.16, 0.48, 0.86)
BLUE_D = (0.08, 0.28, 0.62)
GLASS = (0.62, 0.86, 0.88)
RAIL = (0.94, 0.95, 0.94)
LAWN = (0.34, 0.62, 0.30)
HEDGE = (0.16, 0.42, 0.18)
FLOWER = (0.72, 0.28, 0.48)
PAVER = (0.84, 0.76, 0.64)
WATER = (0.30, 0.74, 0.86)
TILE = (0.12, 0.28, 0.62)
SHADE = (0.10, 0.42, 0.82)
CUSHION = (0.20, 0.45, 0.78)
TRUNK = (0.40, 0.28, 0.16)
FROND = (0.16, 0.46, 0.20)

FLOORS = 8
FH = 3.35
Y0 = 1.35
HV = 9.2


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def palm(M, F, u, v, h=11.0, spin=0.0):
    obox(M.mesh(0, "trunk"), F, u - 0.2, u + 0.2, v - 0.2, v + 0.2, 0.2, h)
    obox(M.mesh(1, "trunk"), F, u - 0.25, u + 0.25, v - 0.25, v + 0.25, 0.2, h * 0.9)
    cen = F.p(u, v, h - 3)
    mesh = M.mesh(0, "frond")
    for i in range(7):
        a = i * math.tau / 7 + spin
        tri_out(
            mesh,
            F.p(u, v, h + 0.5),
            F.p(u + math.cos(a - 0.4) * 5.5, v + math.sin(a - 0.4) * 5.5, h - 2.2),
            F.p(u + math.cos(a + 0.4) * 5.5, v + math.sin(a + 0.4) * 5.5, h - 2.6),
            cen,
        )


def umbrella(M, F, u, v):
    obox(M.mesh(0, "trunk"), F, u - 0.08, u + 0.08, v - 0.08, v + 0.08, 0.3, 2.7)
    obox(M.mesh(1, "shade"), F, u - 1.3, u + 1.3, v - 1.3, v + 1.3, 2.45, 2.7)
    cen = F.p(u, v, 1.2)
    mesh = M.mesh(0, "shade")
    for i in range(6):
        a = i * math.tau / 6
        tri_out(
            mesh,
            F.p(u, v, 3.15),
            F.p(u + math.cos(a) * 1.7, v + math.sin(a) * 1.7, 2.45),
            F.p(u + math.cos(a + math.tau / 6) * 1.7, v + math.sin(a + math.tau / 6) * 1.7, 2.45),
            cen,
        )


def build():
    F = Frame(A, B, O)
    L = F.L
    M = Model(NAME)
    for name, rgb, rough in (
        ("white", BEIGE, 0.72),
        ("warm", WARM, 0.8),
        ("blue", BLUE, 0.5),
        ("blued", BLUE_D, 0.55),
        ("rail", RAIL, 0.3),
        ("glass", GLASS, 0.08),
        ("lawn", LAWN, 0.9),
        ("hedge", HEDGE, 0.85),
        ("flower", FLOWER, 0.7),
        ("paver", PAVER, 0.84),
        ("water", WATER, 0.12),
        ("tile", TILE, 0.4),
        ("shade", SHADE, 0.45),
        ("cushion", CUSHION, 0.5),
        ("trunk", TRUNK, 0.9),
        ("frond", FROND, 0.75),
    ):
        M.material(name, lin(rgb), rough=rough, double=(name in ("glass", "rail")))
    mats = {
        "wall": "white", "recess": "warm", "slab": "white",
        "rail": "rail", "glass": "glass", "fin": "white",
    }
    # Shared plinth so the three towers read as one resort, not three boxes.
    for lod in (0, 1):
        obox(M.mesh(lod, "paver"), F, -2, L + 2, -14, 14, 0.0, Y0)

    spans = ((0.4, 15.2), (18.2, 33.4), (36.4, L - 0.4))
    for u0, u1 in spans:
        top = balcony_wing(M, F, u0, u1, HV, Y0, FLOORS, FH, 3.6, mats, depth=1.7)
        for lod in (0, 1):
            obox(M.mesh(lod, "blue"), F, u0 - 0.5, u1 + 0.5, -HV - 0.8, HV + 0.8, top, top + 1.15)
            obox(M.mesh(lod, "blued"), F, u0 + 1.2, u1 - 1.2, -HV + 1.4, HV - 1.4, top + 1.05, top + 1.7)

    # Pool court from the aruba.com photo: paver deck, a near pool with a
    # dark tile wall, a second pool by the towers, lawn and a path.
    for lod in (0, 1):
        obox(M.mesh(lod, "paver"), F, -6, L + 8, -42, -13.4, 0.05, 0.26)
        obox(M.mesh(lod, "tile"), F, 6, 28, -34.2, -20.6, 0.22, 0.55)
        obox(M.mesh(lod, "water"), F, 7.2, 26.6, -32.6, -22.2, 0.48, 0.66)
        obox(M.mesh(lod, "water"), F, 18, L - 4, -18.5, -14.6, 0.28, 0.44)
        obox(M.mesh(lod, "lawn"), F, -40, L + 50, -78, -38, 0.0, 0.12)
        obox(M.mesh(lod, "lawn"), F, -10, 4, -38, -14, 0.08, 0.18)
        obox(M.mesh(lod, "lawn"), F, L - 2, L + 12, -38, -14, 0.08, 0.18)
        obox(M.mesh(lod, "paver"), F, 30, 36, -48, -14, 0.16, 0.32)
        obox(M.mesh(lod, "hedge"), F, 2, 14, -16, -14.4, 0.26, 0.9)
        obox(M.mesh(lod, "flower"), F, 3, 8, -16.4, -15.2, 0.7, 1.15)
        obox(M.mesh(lod, "hedge"), F, L - 12, L - 2, -17, -15.2, 0.26, 1.0)
    for u, v in ((10, -26), (16, -24), (24, -27), (40, -22), (46, -25), (8, -38)):
        umbrella(M, F, u, v)
        obox(M.mesh(0, "white"), F, u + 1.3, u + 2.6, v - 0.35, v + 0.35, 0.32, 0.48)
        obox(M.mesh(0, "cushion"), F, u + 1.35, u + 2.55, v - 0.28, v + 0.28, 0.46, 0.62)
    for u, v, h, spin in (
        (-6, -36, 14, 0.3), (12, -16, 12, 0.8), (32, -20, 11, 1.2),
        (44, -17, 10, 0.4), (L + 4, -32, 13, 1.0), (20, -46, 9, 0.6),
    ):
        palm(M, F, u, v, h, spin)

    fold_body(M, keep={"glass"})
    info = write_glb(M, HERO / f"{NAME}.glb")
    check_glb(HERO / f"{NAME}.glb")
    print(NAME, info, "L", round(L, 1))
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    if not (1200 <= info["lod0"] <= 7000):
        print("WARN lod0", info["lod0"])
    patch(info)
    cam = F.p(L * 0.45, -48, 8)
    look = F.p(L * 0.5, 0, 16)
    print("cam", round(O[0] + cam[0], 1), round(O[1] + cam[2], 1))
    print("look", round(O[0] + look[0], 1), round(O[1] + look[2], 1))
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find(f'"id": "{NAME}"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block2, n = re.subn(
        r'"status": "[^"]*"',
        '"status": "v4-grokbot (beige glass towers, blue roofs, pool umbrellas)"',
        block,
        count=1,
    )
    if n != 1:
        raise SystemExit("blue status missing")
    block = block2
    block = re.sub(rf'"{NAME}_lod0": \d+', f'"{NAME}_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(rf'"{NAME}_lod1": \d+', f'"{NAME}_lod1": {info["lod1"]}', block, count=1)
    block = re.sub(r'"textures": \d+', '"textures": 0', block, count=1)
    new = (
        '"ref_sources": "aruba.com stay listing Blue Residences pool-court photo '
        'and Beaches of Aruba 2016 exterior (beige towers, turquoise glass, white '
        'rails, blue roofs, blue umbrellas, two pools, palms). Three 8-storey towers '
        'Indigo, Aquamarine and Turquoise. OSM 51594/51596/56204. No photo is pasted. '
        'Built by tools/grokbot/blue.py"'
    )
    block2, n = re.subn(r'"ref_sources": "(?:[^"\\]|\\.)*"', new, block, count=1)
    if n != 1:
        raise SystemExit("blue ref anchor missing")
    block = block2.replace(
        "generated by /workspace/landmarks/gen.mjs",
        "generated by tools/grokbot/blue.py",
        1,
    )
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == NAME)
    assert hit["tris"][f"{NAME}_lod0"] == info["lod0"]
    assert hit["textures"] == 0


if __name__ == "__main__":
    build()
