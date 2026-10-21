#!/usr/bin/env python3
"""Azure Beach Residences: two 8-storey glass towers and a turquoise pool.

Same hero id and origin. The aruba.com listing photo shows a pale tower of
dark floor-to-ceiling glass and glass rails, a turquoise pool with a blue
tile edge, a light-blue pergola, white umbrellas and palms. The two towers
sit on the OSM footprints and open toward the ocean. Nothing is pasted.
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
O = (-9134.68, -4281.12)
NAME = "azure_residences"

WALL = (0.90, 0.90, 0.88)
WARM = (0.72, 0.74, 0.76)
GLASS = (0.28, 0.38, 0.46)
RAIL = (0.82, 0.90, 0.93)
WATER = (0.18, 0.78, 0.86)
TILE = (0.12, 0.38, 0.78)
PERGOLA = (0.62, 0.80, 0.86)
SHADE = (0.94, 0.92, 0.86)
PAVER = (0.80, 0.72, 0.58)
LAWN = (0.32, 0.60, 0.28)
HEDGE = (0.16, 0.42, 0.18)
TRUNK = (0.40, 0.28, 0.16)
FROND = (0.14, 0.44, 0.20)

FLOORS = 8
FH = 3.25
Y0 = 0.5


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def palm(M, F, u, v, h=11.0, spin=0.0):
    obox(M.mesh(0, "trunk"), F, u - 0.18, u + 0.18, v - 0.18, v + 0.18, 0.15, h)
    obox(M.mesh(1, "trunk"), F, u - 0.22, u + 0.22, v - 0.22, v + 0.22, 0.15, h * 0.9)
    cen = F.p(u, v, h - 3)
    mesh = M.mesh(0, "frond")
    for i in range(7):
        a = i * math.tau / 7 + spin
        tri_out(
            mesh,
            F.p(u, v, h + 0.4),
            F.p(u + math.cos(a - 0.35) * 4.8, v + math.sin(a - 0.35) * 4.8, h - 1.8),
            F.p(u + math.cos(a + 0.35) * 4.8, v + math.sin(a + 0.35) * 4.8, h - 2.2),
            cen,
        )


def umbrella(M, F, u, v):
    obox(M.mesh(0, "warm"), F, u - 0.08, u + 0.08, v - 0.08, v + 0.08, 0.3, 2.6)
    cen = F.p(u, v, 1.4)
    mesh = M.mesh(0, "shade")
    for i in range(6):
        a = i * math.tau / 6
        tri_out(
            mesh,
            F.p(u, v, 3.05),
            F.p(u + math.cos(a) * 1.8, v + math.sin(a) * 1.8, 2.45),
            F.p(u + math.cos(a + math.tau / 6) * 1.8, v + math.sin(a + math.tau / 6) * 1.8, 2.45),
            cen,
        )


def pergola(M, F, u0, u1, v0, v1):
    """Light-blue posts and a slatted roof, as in the pool photo."""
    for lod in (0, 1):
        for u in (u0, u1):
            for v in (v0, v1):
                obox(M.mesh(lod, "pergola"), F, u - 0.18, u + 0.18, v - 0.18, v + 0.18, 0.3, 3.3)
        obox(M.mesh(lod, "pergola"), F, u0 - 0.2, u1 + 0.2, v0 - 0.25, v0 + 0.25, 3.15, 3.45)
        obox(M.mesh(lod, "pergola"), F, u0 - 0.2, u1 + 0.2, v1 - 0.25, v1 + 0.25, 3.15, 3.45)
    for i in range(6):
        v = v0 + (v1 - v0) * i / 5
        obox(M.mesh(0, "pergola"), F, u0, u1, v - 0.08, v + 0.08, 3.35, 3.55)


def build():
    M = Model(NAME)
    for name, rgb, rough in (
        ("white", WALL, 0.7),
        ("warm", WARM, 0.75),
        ("rail", RAIL, 0.25),
        ("glass", GLASS, 0.08),
        ("water", WATER, 0.08),
        ("tile", TILE, 0.35),
        ("pergola", PERGOLA, 0.5),
        ("shade", SHADE, 0.55),
        ("paver", PAVER, 0.86),
        ("lawn", LAWN, 0.9),
        ("hedge", HEDGE, 0.85),
        ("trunk", TRUNK, 0.9),
        ("frond", FROND, 0.75),
    ):
        M.material(name, lin(rgb), rough=rough, double=(name in ("glass", "rail")))
    mats = {
        "wall": "white", "recess": "warm", "slab": "white",
        "rail": "rail", "glass": "glass", "fin": "white",
    }
    # South tower runs toward the beach; north tower crosses it, the V in the listing notes.
    south = Frame((-9138.2, -4269.4), (-9128.4, -4243.6), O)
    north = Frame((-9159.6, -4232.4), (-9131.2, -4236.2), O)
    for F, hv in ((south, 8.4), (north, 7.6)):
        top = balcony_wing(M, F, 0.4, F.L - 0.4, hv, Y0, FLOORS, FH, 3.5, mats, depth=1.65)
        for lod in (0, 1):
            obox(M.mesh(lod, "white"), F, -0.3, F.L + 0.3, -hv - 0.3, hv + 0.3, top, top + 0.7)

    # Pool court on the ocean side of the south tower. +v of that frame is east
    # (inland) because the frame runs north; -v is west.
    F = south
    L = F.L
    for lod in (0, 1):
        obox(M.mesh(lod, "paver"), F, -8, L + 16, -36, -8.6, 0.0, 0.22)
        obox(M.mesh(lod, "tile"), F, -2, L + 6, -30, -12, 0.18, 0.42)
        obox(M.mesh(lod, "water"), F, -0.6, L + 4.6, -28.4, -13.6, 0.38, 0.55)
        obox(M.mesh(lod, "lawn"), F, -30, L + 28, -70, -32, 0.0, 0.12)
        obox(M.mesh(lod, "hedge"), F, -4, L + 2, -11.2, -9.6, 0.22, 0.9)
    pergola(M, F, 4, 12, -22, -16)
    for u, v in ((2, -20), (16, -18), (-4, -24), (20, -26)):
        umbrella(M, F, u, v)
        obox(M.mesh(0, "white"), F, u + 1.4, u + 2.8, v - 0.4, v + 0.4, 0.28, 0.46)
    for u, v, h, spin in (
        (-6, -28, 12, 0.2), (8, -11, 10, 1.1), (18, -14, 11, 0.6),
        (L + 8, -24, 13, 1.4), (-2, -42, 14, 0.4), (14, -40, 12, 0.9),
    ):
        palm(M, F, u, v, h, spin)

    fold_body(M, keep={"glass"})
    info = write_glb(M, HERO / f"{NAME}.glb")
    check_glb(HERO / f"{NAME}.glb")
    print(NAME, info, "southL", round(L, 1), "northL", round(north.L, 1))
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    if not (1200 <= info["lod0"] <= 7000):
        print("WARN lod0", info["lod0"])
    patch(info)
    cam = F.p(L * 0.35, -42, 4)
    look = F.p(L * 0.45, -4, 12)
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
        '"status": "v4-grokbot (two glass towers, turquoise pool, blue pergola)"',
        block,
        count=1,
    )
    if n != 1:
        raise SystemExit("azure status missing")
    block = block2
    block = re.sub(rf'"{NAME}_lod0": \d+', f'"{NAME}_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(rf'"{NAME}_lod1": \d+', f'"{NAME}_lod1": {info["lod1"]}', block, count=1)
    block = re.sub(r'"textures": \d+', '"textures": 0', block, count=1)
    new = (
        '"ref_sources": "aruba.com Azure Beach Residences listing photo '
        '(pale tower, dark floor-to-ceiling glass, glass rails, turquoise pool '
        'with a blue tile edge, light-blue pergola, white umbrellas, palms). '
        'Two 8-storey towers on the OSM footprints, opening toward the ocean. '
        'No photo is pasted. Built by tools/grokbot/azure.py"'
    )
    block2, n = re.subn(r'"ref_sources": "(?:[^"\\]|\\.)*"', new, block, count=1)
    if n != 1:
        raise SystemExit("azure ref anchor missing")
    block = block2.replace(
        "generated by /workspace/landmarks/gen.mjs",
        "generated by tools/grokbot/azure.py",
        1,
    )
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == NAME)
    assert hit["tris"][f"{NAME}_lod0"] == info["lod0"]
    assert hit["textures"] == 0


if __name__ == "__main__":
    build()
