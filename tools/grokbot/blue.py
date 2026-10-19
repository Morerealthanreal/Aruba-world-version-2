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
from hotelkit import (  # noqa: E402
    FONT_SANS, Frame, balcony_wing, obox, png_bytes, text_png, tri_out, vquad,
)

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-9102.8, -4438.66)
NAME = "blue_residences"

# North end to south end of the OSM row. +v is inland (east); -v is the ocean.
A = (-9122.1, -4355.0)
B = (-9114.9, -4405.4)

WHITE = (0.94, 0.93, 0.90)
WARM = (0.82, 0.84, 0.88)
BLUE = (0.18, 0.42, 0.78)
BLUE_D = (0.10, 0.28, 0.58)
GLASS = (0.55, 0.72, 0.86)
RAIL = (0.90, 0.94, 0.96)
LAWN = (0.34, 0.62, 0.30)
HEDGE = (0.16, 0.40, 0.20)
PAVER = (0.82, 0.80, 0.74)
WATER = (0.28, 0.68, 0.86)
TRUNK = (0.38, 0.26, 0.14)
FROND = (0.12, 0.42, 0.22)

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


def build():
    F = Frame(A, B, O)
    L = F.L
    M = Model(NAME)
    for name, rgb, rough in (
        ("white", WHITE, 0.72),
        ("warm", WARM, 0.8),
        ("blue", BLUE, 0.55),
        ("blued", BLUE_D, 0.6),
        ("rail", RAIL, 0.35),
        ("glass", GLASS, 0.08),
        ("lawn", LAWN, 0.9),
        ("hedge", HEDGE, 0.85),
        ("paver", PAVER, 0.84),
        ("water", WATER, 0.12),
        ("trunk", TRUNK, 0.9),
        ("frond", FROND, 0.75),
    ):
        M.material(name, lin(rgb), rough=rough, double=(name in ("glass", "rail")))
    M.material("sign", (1, 1, 1), rough=0.45, textured=True, emissive=0.12)
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

    # Ocean-side court: deck, infinity pool, two smaller pools, lawn past the camera.
    for lod in (0, 1):
        obox(M.mesh(lod, "paver"), F, -4, L + 6, -36, -13.6, 0.05, 0.28)
        obox(M.mesh(lod, "water"), F, 2, L - 2, -30, -18, 0.26, 0.42)
        obox(M.mesh(lod, "water"), F, 4, 16, -16.5, -14.2, 0.3, 0.48)
        obox(M.mesh(lod, "water"), F, L - 16, L - 4, -16.5, -14.2, 0.3, 0.48)
        obox(M.mesh(lod, "lawn"), F, -50, L + 70, -90, -26, 0.0, 0.12)
        obox(M.mesh(lod, "lawn"), F, -30, L + 40, 14, 48, 0.0, 0.12)
        obox(M.mesh(lod, "hedge"), F, 1, L - 1, -15.2, -13.8, 0.28, 1.05)
    png = text_png(["BLUE"], 1024, 256, (12, 58, 130, 255), (255, 255, 255, 255), font=FONT_SANS, pad=28)
    # Ocean face of the middle tower. -v looks west.
    mid0, mid1 = spans[1]
    vquad(
        M.mesh(0, "sign"), F, mid0 + 1.5, mid1 - 1.5, -(HV + 0.15), Y0 + 0.4, Y0 + 2.5, -1,
        uvs=((0, 1), (1, 1), (1, 0), (0, 0)),
    )
    vquad(
        M.mesh(1, "sign"), F, mid0 + 1.2, mid1 - 1.2, -(HV + 0.12), Y0 + 0.35, Y0 + 2.6, -1,
        uvs=((0, 1), (1, 1), (1, 0), (0, 0)),
    )
    for u, v, h, spin in (
        (-8, -38, 13, 0.2), (4, -30, 11, 1.1), (14, -36, 12, 0.5),
        (38, -32, 11, 1.4), (46, -40, 13, 0.7), (L + 8, -34, 12, 0.3),
        (6, -20, 8, 0.8), (30, -18, 9, 1.2), (44, -21, 8, 0.4),
    ):
        palm(M, F, u, v, h, spin)

    fold_body(M, keep={"glass", "sign"})
    info = write_glb(M, HERO / f"{NAME}.glb", images=[png_bytes(png)])
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
        '"status": "v4-grokbot (three blue-roof towers, ocean pool court)"',
        block,
        count=1,
    )
    if n != 1:
        raise SystemExit("blue status missing")
    block = block2
    block = re.sub(rf'"{NAME}_lod0": \d+', f'"{NAME}_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(rf'"{NAME}_lod1": \d+', f'"{NAME}_lod1": {info["lod1"]}', block, count=1)
    block = block.replace('"textures": 2', '"textures": 1', 1)
    new = (
        '"ref_sources": "Aruba Property Buzz Blue Residences and aruba.com '
        '(three 8-storey towers Indigo, Aquamarine and Turquoise, blue roofs, '
        'wide balconies, resort pools on the ocean side of J.E. Irausquin Boulevard). '
        'OSM footprints 51594/51596/56204. The BLUE panel is drawn. No photo is pasted. '
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
    assert hit["textures"] == 1


if __name__ == "__main__":
    build()
