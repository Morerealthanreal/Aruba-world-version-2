#!/usr/bin/env python3
"""Embassy Suites by Hilton Aruba Resort.

Same hero id and origin. The Hilton opening photos show white balcony wings
on either side of brown picture-frame wings that step forward of the white
line. Each brown wing is a full frame (jambs, head, sill) with a balcony
slab, rail and glass on every floor it covers. One wing rises from the
terrace; the next starts higher and sits slightly back. The beach camera
sits far out on +v, so the terrace, pool and lawn cover that ground, with
palms between the camera and the facade. Nothing is a pasted photograph.
The wordmark is not on this face, so no sign atlas is added.
"""
import json
import math
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, fold_body, write_glb  # noqa: E402
from hotelkit import Frame, obox, tri_out, vquad  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-8992.2, -4493.98)
NAME = "embassysuites"

# Longest OSM edge, west end to northeast end. +v is the beach camera.
A = (-9039.0, -4505.5)
B = (-8977.3, -4451.0)

WHITE = (0.93, 0.91, 0.87)
WARM = (0.86, 0.82, 0.76)
BROWN = (0.66, 0.48, 0.36)
TAN = (0.90, 0.82, 0.72)
GLASS = (0.62, 0.74, 0.82)
RAIL = (0.93, 0.95, 0.96)
LAWN = (0.36, 0.62, 0.30)
HEDGE = (0.18, 0.42, 0.18)
PAVER = (0.78, 0.76, 0.70)
WATER = (0.42, 0.74, 0.84)
TRUNK = (0.38, 0.26, 0.14)
FROND = (0.14, 0.42, 0.18)

FLOORS = 8
FH = 4.15
Y0 = 0.45
# White balcony nose. Brown wings step past this toward the camera.
HV = 10.0
# Face of the white structural wall the balconies hang from.
WALL = 8.15


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def white_wing(M, F, u0, u1, y0, floors, hv=HV, cap=True):
    """Beach-face balconies. The white mass stops at this span; it does not
    run through behind a brown wing."""
    bay = 4.4
    nb = max(1, int(round((u1 - u0) / bay)))
    b = (u1 - u0) / nb
    top = y0 + floors * FH
    slab_top = top if cap else top - 0.08
    for lod in (0, 1):
        if lod == 1:
            for f in range(floors):
                yy = y0 + f * FH
                vquad(M.mesh(1, "rail"), F, u0 + 0.2, u1 - 0.2, hv + 0.04, yy + 0.35, yy + 1.05, 1)
            continue
        for uu in (u0, u1):
            obox(M.mesh(0, "white"), F, uu - 0.22, uu + 0.22, WALL, hv, y0, slab_top)
        nslab = floors + (1 if cap else 0)
        for f in range(nslab):
            yy = y0 + f * FH
            obox(M.mesh(0, "white"), F, u0, u1, WALL + 0.05, hv, yy - 0.1, yy + 0.16, bottom=True)
        for f in range(floors):
            yy = y0 + f * FH
            vquad(M.mesh(0, "rail"), F, u0 + 0.15, u1 - 0.15, hv - 0.08, yy + 0.2, yy + 1.12, 1)
            for k in range(nb):
                a = u0 + k * b + 0.45
                vquad(M.mesh(0, "glass"), F, a, a + b - 0.9, WALL + 0.08, yy + 0.25, yy + 2.45, 1)
        for k in range(1, nb):
            uu = u0 + k * b
            obox(M.mesh(0, "white"), F, uu - 0.1, uu + 0.1, WALL, hv - 0.05, y0, slab_top, top=False)


def brown_wing(M, F, u0, u1, y0, floors, project):
    """Picture-frame balcony stack, stepped forward of the white line.

    Jambs, head and sill are solid brown. Every floor has a slab, a rail
    and glass, so the wing reads as balconies inside a frame rather than a
    panel stuck on the white slab.
    """
    outer = HV + project
    y1 = y0 + floors * FH
    jamb = 1.45
    span = (u1 - jamb) - (u0 + jamb)
    nb = max(2, int(round(span / 4.6)))
    bw = span / nb
    for lod in (0, 1):
        br = M.mesh(lod, "brown")
        obox(br, F, u0, u0 + jamb, WALL, outer, y0, y1)
        obox(br, F, u1 - jamb, u1, WALL, outer, y0, y1)
        obox(br, F, u0, u1, WALL, outer + 0.18, y1 - 0.7, y1 + 0.55)
        obox(br, F, u0, u1, WALL, outer, y0, y0 + 0.5)
        obox(M.mesh(lod, "tan"), F, u0 + jamb, u1 - jamb, WALL - 0.2, WALL + 0.2, y0, y1)
        if lod == 1:
            for f in range(floors):
                yy = y0 + f * FH
                vquad(
                    M.mesh(1, "glass"), F, u0 + jamb, u1 - jamb, outer + 0.02,
                    yy + 0.85, yy + 2.4, 1,
                )
            continue
        for f in range(floors):
            yy = y0 + f * FH
            obox(M.mesh(0, "white"), F, u0 + 0.2, u1 - 0.2, WALL + 0.15, outer - 0.35, yy + FH - 0.18, yy + FH + 0.1, bottom=True)
            obox(br, F, u0, u1, outer - 0.7, outer + 0.06, yy + FH - 0.28, yy + FH + 0.2)
            vquad(M.mesh(0, "rail"), F, u0 + jamb, u1 - jamb, outer - 0.42, yy + 0.28, yy + 1.15, 1)
            for k in range(nb):
                a = u0 + jamb + k * bw + 0.4
                vquad(M.mesh(0, "glass"), F, a, a + bw - 0.8, WALL + 0.28, yy + 0.35, yy + 2.5, 1)
        for k in range(1, nb):
            uu = u0 + jamb + k * bw
            obox(M.mesh(0, "tan"), F, uu - 0.1, uu + 0.1, WALL + 0.2, outer - 0.5, y0 + 0.5, y1 - 0.7, top=False)


def palm(M, F, u, v, h=11.0, spin=0.0, reach=6.5):
    obox(M.mesh(0, "trunk"), F, u - 0.22, u + 0.22, v - 0.22, v + 0.22, 0.15, h)
    obox(M.mesh(1, "trunk"), F, u - 0.28, u + 0.28, v - 0.28, v + 0.28, 0.15, h * 0.9)
    cen = F.p(u, v, h - 4)
    mesh = M.mesh(0, "frond")
    for i in range(8):
        a = i * math.tau / 8 + spin
        tip = h - 2.4 - (i % 2) * 0.8
        tri_out(
            mesh,
            F.p(u + math.cos(a) * 0.3, v + math.sin(a) * 0.3, h + 0.6),
            F.p(u + math.cos(a - 0.42) * reach, v + math.sin(a - 0.42) * reach, tip),
            F.p(u + math.cos(a + 0.42) * reach, v + math.sin(a + 0.42) * reach, tip - 0.5),
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
        ("tan", TAN, 0.74),
        ("rail", RAIL, 0.35),
        ("glass", GLASS, 0.08),
        ("lawn", LAWN, 0.9),
        ("hedge", HEDGE, 0.85),
        ("paver", PAVER, 0.84),
        ("water", WATER, 0.15),
        ("trunk", TRUNK, 0.9),
        ("frond", FROND, 0.75),
    ):
        M.material(name, lin(rgb), rough=rough, double=(name in ("glass", "rail")))

    top = Y0 + FLOORS * FH
    # Structural slab. Beach balconies are attached in spans, not one wing
    # running the full length behind the brown frames.
    for lod in (0, 1):
        obox(M.mesh(lod, "white"), F, 0, L, -11.2, WALL, Y0, top)
        if lod == 0:
            for f in range(FLOORS):
                yy = Y0 + f * FH + 0.7
                vquad(M.mesh(0, "glass"), F, 1.5, L - 1.5, -11.28, yy, yy + 1.9, -1)
        else:
            vquad(M.mesh(1, "glass"), F, 2, L - 2, -11.28, Y0 + 4, top - 3, -1)
        obox(M.mesh(lod, "white"), F, -0.6, L + 0.6, -12.0, HV + 0.4, top + 0.2, top + 1.45)

    # Left brown wing, full height, modest projection. White gap. Higher
    # brown wing set back. Lower brown wing projects farthest. White wing
    # on the right, and white balconies under the higher brown wing.
    brown_wing(M, F, 1.2, 15.5, Y0, FLOORS, 2.15)
    white_wing(M, F, 15.5, 25.0, Y0, FLOORS)
    brown_wing(M, F, 25.0, 45.5, Y0 + 2 * FH, FLOORS - 2, 2.7)
    white_wing(M, F, 25.0, 45.5, Y0, 2, cap=False)
    brown_wing(M, F, 47.0, 66.0, Y0, FLOORS - 2, 4.35)
    white_wing(M, F, 47.0, 66.0, Y0 + (FLOORS - 2) * FH, 2)
    white_wing(M, F, 66.0, L - 1.0, Y0, FLOORS)
    white_wing(M, F, 45.5, 47.0, Y0, FLOORS, hv=HV + 0.3)

    # Ground the beach camera actually sees (it sits near v=78).
    for lod in (0, 1):
        obox(M.mesh(lod, "lawn"), F, -70, L + 70, -10, 120, 0.0, 0.14)
        obox(M.mesh(lod, "paver"), F, -8, L + 12, 12.2, 42, 0.12, 0.30)
        obox(M.mesh(lod, "paver"), F, -2, L + 6, 42, 78, 0.12, 0.28)
        obox(M.mesh(lod, "water"), F, L * 0.22, L * 0.72, 48, 66, 0.26, 0.42)
        obox(M.mesh(lod, "hedge"), F, 2, L - 2, 14.6, 16.2, 0.28, 1.2)
        obox(M.mesh(lod, "hedge"), F, L * 0.22, L * 0.74, 42.5, 44.2, 0.28, 0.9)
    # Street canopy and arrival pavers, off the beach camera.
    obox(M.mesh(0, "white"), F, L * 0.40, L * 0.62, -18.5, -11.2, 3.3, 3.7)
    for u in (L * 0.42, L * 0.60):
        obox(M.mesh(0, "white"), F, u, u + 0.45, -18.2, -17.4, 0.32, 3.4)
    obox(M.mesh(0, "paver"), F, -2, L + 4, -26, -11.4, 0.14, 0.30)
    # Lounge slabs on the terrace so the pool deck is not an empty pad.
    for u in (L * 0.32, L * 0.40, L * 0.56, L * 0.64):
        obox(M.mesh(0, "white"), F, u, u + 1.6, 36.5, 38.4, 0.30, 0.48)
    for u, v, h, spin, reach in (
        (-14, 62, 18, 0.2, 8.0), (-4, 48, 14, 1.0, 6.5),
        (8, 22, 11, 0.4, 5.5), (22, 18, 10, 1.3, 5.0),
        (36, 21, 12, 0.7, 5.5), (54, 19, 11, 0.2, 5.2),
        (70, 23, 12, 1.5, 5.8), (L - 4, 20, 10, 0.9, 5.0),
        (L + 10, 58, 17, 0.5, 8.0), (L + 2, 44, 13, 1.2, 6.2),
        (16, 40, 9, 0.6, 4.8), (60, 42, 9, 1.1, 4.8),
        (40, 72, 8, 0.3, 4.2), (6, -22, 11, 0.8, 5.0),
    ):
        palm(M, F, u, v, h, spin, reach)

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
    cam = F.p(L * 0.35, 78, 6)
    print("look", round(O[0] + mid[0], 1), round(O[1] + mid[2], 1))
    print("cam", round(O[0] + cam[0], 1), round(O[1] + cam[2], 1))
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find(f'"id": "{NAME}"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block2, n = re.subn(
        r'"status": "[^"]*"',
        '"status": "v4-grokbot (stepped brown balcony wings, white side wings, terrace pool)"',
        block,
        count=1,
    )
    if n != 1:
        raise SystemExit("embassy status missing")
    block = block2
    block = re.sub(rf'"{NAME}_lod0": \d+', f'"{NAME}_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(rf'"{NAME}_lod1": \d+', f'"{NAME}_lod1": {info["lod1"]}', block, count=1)
    block = block.replace('"textures": 2', '"textures": 0', 1)
    new = (
        '"ref_sources": "Hilton Stories Embassy Suites Aruba opening photos '
        'Exterior-1 and Exterior-2 (white balcony wings, full-height brown '
        'picture-frame wings stepped forward, terrace and pool, palms). OSM '
        'footprint and height 38.9 m. No photo is pasted. '
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
