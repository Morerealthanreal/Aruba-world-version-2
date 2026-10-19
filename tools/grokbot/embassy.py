#!/usr/bin/env python3
"""Embassy Suites by Hilton Aruba Resort.

Same hero id and origin. The Hilton opening photos show a long white slab
of glass balconies with brown picture-frame stacks set into the facade.
Nothing is a pasted photograph. The wordmark is not on this face, so no
sign atlas is added.
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
O = (-8992.2, -4493.98)
NAME = "embassysuites"

# Longest OSM edge, west end to northeast end.
A = (-9039.0, -4505.5)
B = (-8977.3, -4451.0)

WHITE = (0.93, 0.91, 0.87)
WARM = (0.86, 0.82, 0.76)
BROWN = (0.46, 0.33, 0.24)
GLASS = (0.62, 0.74, 0.82)
RAIL = (0.93, 0.95, 0.96)
LAWN = (0.36, 0.62, 0.30)
HEDGE = (0.18, 0.42, 0.18)
PAVER = (0.78, 0.76, 0.70)
TRUNK = (0.38, 0.26, 0.14)
FROND = (0.14, 0.42, 0.18)

FLOORS = 8
FH = 4.15
Y0 = 0.45


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def picture(M, F, u0, u1, side, y0, floors):
    """Brown frame sitting just outside the balcony line."""
    hv = 10.0
    outer = side * (hv + 0.95)
    inner = side * (hv + 0.28)
    v0, v1 = sorted((inner, outer))
    y1 = y0 + floors * FH
    t = 0.85
    for lod in (0, 1):
        m = M.mesh(lod, "brown")
        obox(m, F, u0, u0 + t, v0, v1, y0, y1)
        obox(m, F, u1 - t, u1, v0, v1, y0, y1)
        obox(m, F, u0, u1, v0, v1, y1 - 0.7, y1)
        obox(m, F, u0, u1, v0, v1, y0, y0 + 0.45)
        for f in range(1, floors):
            yy = y0 + f * FH
            obox(m, F, u0 + t, u1 - t, v0, v1, yy - 0.28, yy + 0.22)


def palm(M, F, u, v, h=11.0, spin=0.0):
    obox(M.mesh(0, "trunk"), F, u - 0.16, u + 0.16, v - 0.16, v + 0.16, 0.2, h)
    crown, cen = F.p(u, v, h + 0.2), F.p(u, v, h - 3)
    mesh = M.mesh(0, "frond")
    for i in range(6):
        a = i * math.tau / 6 + spin
        reach = 2.4 + (i % 2) * 0.4
        tri_out(
            mesh, crown,
            F.p(u + math.cos(a) * 0.7, v + math.sin(a) * 0.7, h),
            F.p(u + math.cos(a) * reach, v + math.sin(a) * reach, h - 1.1),
            cen,
        )


def build():
    F = Frame(A, B, O)
    L = F.L
    M = Model(NAME)
    for name, rgb, rough in (
        ("white", WHITE, 0.72),
        ("warm", WARM, 0.78),
        ("brown", BROWN, 0.7),
        ("rail", RAIL, 0.35),
        ("glass", GLASS, 0.08),
        ("lawn", LAWN, 0.9),
        ("hedge", HEDGE, 0.85),
        ("paver", PAVER, 0.84),
        ("trunk", TRUNK, 0.9),
        ("frond", FROND, 0.75),
    ):
        M.material(name, lin(rgb), rough=rough, double=(name == "glass"))

    mats = {
        "wall": "white", "recess": "warm", "slab": "white",
        "rail": "rail", "glass": "glass", "fin": "white",
    }
    top = balcony_wing(M, F, 2, L - 2, 10, Y0, FLOORS, FH, 6.8, mats, depth=1.7)
    # Two brown stacks on the beach face, one on the street face, stepped
    # the way the opening photos stack them.
    picture(M, F, L * 0.18, L * 0.42, 1, Y0 + FH, 5)
    picture(M, F, L * 0.48, L * 0.70, 1, Y0 + 2 * FH, 4)
    picture(M, F, L * 0.30, L * 0.58, -1, Y0 + FH * 0.5, 5)
    for lod in (0, 1):
        obox(M.mesh(lod, "white"), F, 0, L, -11.2, 11.2, top, top + 1.3)
        obox(M.mesh(lod, "lawn"), F, -8, L + 10, -28, 22, 0.0, 0.18)
        obox(M.mesh(lod, "paver"), F, -2, L + 4, -22, -11.4, 0.16, 0.32)
        obox(M.mesh(lod, "hedge"), F, 4, L - 4, 12.2, 14.0, 0.2, 1.15)
    # Street canopy, thick enough to read above the pavers.
    obox(M.mesh(0, "white"), F, L * 0.40, L * 0.62, -18.5, -11.2, 3.3, 3.7)
    for u in (L * 0.42, L * 0.60):
        obox(M.mesh(0, "white"), F, u, u + 0.45, -18.2, -17.4, 0.32, 3.4)
    for i, (u, v, h, spin) in enumerate((
        (6, 16, 12, 0.2), (22, 18, 10, 1.1), (40, 17, 13, 0.6),
        (58, 16.5, 11, 1.7), (74, 18, 12, 0.4), (12, -20, 9, 0.9),
        (48, -24, 11, 1.4), (70, -21, 10, 0.3),
    )):
        palm(M, F, u, v, h, spin)

    fold_body(M, keep={"glass"})
    info = write_glb(M, HERO / f"{NAME}.glb")
    check_glb(HERO / f"{NAME}.glb")
    print(NAME, info, "L", round(L, 1), "top", round(top, 1))
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    if not (1200 <= info["lod0"] <= 7000):
        print("WARN lod0", info["lod0"])
    patch(info)
    mid = F.p(L * 0.5, 0, 8)
    cam = F.p(L * 0.42, 28, 4)
    print("look", round(O[0] + mid[0], 1), round(O[1] + mid[2], 1))
    print("cam", round(O[0] + cam[0], 1), round(O[1] + cam[2], 1))
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find(f'"id": "{NAME}"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = block.replace(
        '"status": "v3-procedural"',
        '"status": "v4-grokbot (white balcony slab, brown picture frames)"',
        1,
    )
    block = re.sub(rf'"{NAME}_lod0": \d+', f'"{NAME}_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(rf'"{NAME}_lod1": \d+', f'"{NAME}_lod1": {info["lod1"]}', block, count=1)
    block = block.replace('"textures": 2', '"textures": 0', 1)
    new = (
        '"ref_sources": "Hilton Stories Embassy Suites Aruba opening photos '
        'Exterior-1 and Exterior-2 (white glass-balcony slab, brown picture-frame '
        'stacks, 8 floors). OSM footprint and height 38.9 m. No photo is pasted. '
        'Built by tools/grokbot/embassy.py"'
    )
    block2, n = re.subn(r'"ref_sources": "(?:[^"\\]|\\.)*"', new, block, count=1)
    if n != 1:
        raise SystemExit("embassy ref anchor missing")
    block = block2.replace(
        "generated by /workspace/landmarks/gen.mjs",
        "generated by tools/grokbot/embassy.py",
        1,
    )
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == NAME)
    assert hit["tris"][f"{NAME}_lod0"] == info["lod0"]
    assert hit["textures"] == 0


if __name__ == "__main__":
    build()
