#!/usr/bin/env python3
"""Boardwalk Boutique Hotel.

Same hero id. The boardwalkaruba.com garden photo (Giovanni Polizzi) shows
pink and pastel two-storey casitas, white porches with X-railings, a yellow
exterior stair, dark gable roofs, turquoise pergolas, a wooden boardwalk and
dense palms. No facade wordmark, so this hero has no image. Nothing is pasted.
"""
import json
import math
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, fold_body, write_glb  # noqa: E402
from hotelkit import Frame, _quad_out, obox, tri_out, vquad  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-7782.94, -6945.92)
NAME = "boardwalk"

PINK = (1.0, 0.60, 0.72)
AQUA = (0.68, 0.88, 0.96)
WHITE = (0.98, 0.97, 0.95)
CREAM = (0.96, 0.93, 0.86)
YELLOW = (1.0, 0.90, 0.16)
TURQ = (0.08, 0.82, 0.94)
TILE = (0.24, 0.13, 0.10)
GLASS = (0.45, 0.62, 0.74)
LAWN = (0.24, 0.52, 0.22)
LAWN2 = (0.18, 0.42, 0.16)
WOOD = (0.62, 0.46, 0.28)
WOOD2 = (0.48, 0.34, 0.20)
STONE = (0.82, 0.78, 0.70)
TRUNK = (0.40, 0.26, 0.14)
FROND = (0.12, 0.40, 0.16)
HEDGE = (0.14, 0.38, 0.16)
SHRUB = (0.20, 0.48, 0.18)

GF = 0.42
FH = 3.15


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def bar(mesh, a, b, t=0.05):
    dx, dy, dz = b[0] - a[0], b[1] - a[1], b[2] - a[2]
    L = math.hypot(dx, dy, dz) or 1.0
    d = (dx / L, dy / L, dz / L)
    helper = (0.0, 1.0, 0.0) if abs(d[1]) < 0.85 else (1.0, 0.0, 0.0)
    sx = d[1] * helper[2] - d[2] * helper[1]
    sy = d[2] * helper[0] - d[0] * helper[2]
    sz = d[0] * helper[1] - d[1] * helper[0]
    sl = math.hypot(sx, sy, sz) or 1.0
    s = (sx / sl * t, sy / sl * t, sz / sl * t)
    ux = d[1] * s[2] - d[2] * s[1]
    uy = d[2] * s[0] - d[0] * s[2]
    uz = d[0] * s[1] - d[1] * s[0]
    ul = math.hypot(ux, uy, uz) or 1.0
    u = (ux / ul * t, uy / ul * t, uz / ul * t)

    def corner(p, su, uu):
        return (
            p[0] + su * s[0] + uu * u[0],
            p[1] + su * s[1] + uu * u[1],
            p[2] + su * s[2] + uu * u[2],
        )

    ring0 = [corner(a, i, j) for i, j in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
    ring1 = [corner(b, i, j) for i, j in ((-1, -1), (1, -1), (1, 1), (-1, 1))]
    cen = tuple((a[k] + b[k]) / 2 for k in range(3))
    for i in range(4):
        _quad_out(mesh, ring0[i], ring0[(i + 1) % 4], ring1[(i + 1) % 4], ring1[i], cen)


def gable(mesh, F, u0, u1, v0, v1, y0, rise):
    """Garden-facing gable: the peak is centered on the front (constant v)."""
    um = (u0 + u1) / 2
    yt = y0 + rise
    cen = F.p(um, (v0 + v1) / 2, y0 - 6)
    _quad_out(mesh, F.p(u0, v0, y0), F.p(u0, v1, y0), F.p(um, v1, yt), F.p(um, v0, yt), cen)
    _quad_out(mesh, F.p(u1, v1, y0), F.p(u1, v0, y0), F.p(um, v0, yt), F.p(um, v1, yt), cen)


def gable_face(mesh, F, u0, u1, v, y0, rise, out):
    um = (u0 + u1) / 2
    cen = F.p(um, v - out, y0)
    tri_out(mesh, F.p(u0, v, y0), F.p(um, v, y0 + rise), F.p(u1, v, y0), cen)


def xrail(mesh, F, u0, u1, v, y0, y1):
    bar(mesh, F.p(u0, v, y0), F.p(u1, v, y1), 0.045)
    bar(mesh, F.p(u0, v + 0.04, y1), F.p(u1, v + 0.04, y0), 0.045)


def palm(M, F, u, v, h=11.0, spin=0.0, lod1=False):
    obox(M.mesh(0, "trunk"), F, u - 0.18, u + 0.18, v - 0.18, v + 0.18, 0.15, h)
    if lod1:
        obox(M.mesh(1, "trunk"), F, u - 0.2, u + 0.2, v - 0.2, v + 0.2, 0.15, h * 0.8)
        obox(M.mesh(1, "frond"), F, u - 1.1, u + 1.1, v - 1.1, v + 1.1, h * 0.75, h * 0.75 + 0.35)
    mesh = M.mesh(0, "frond")
    for ring, drop, reach in ((0.0, 0.15, 2.3), (0.35, 1.05, 2.8)):
        crown = F.p(u, v, h - drop)
        cen = F.p(u, v, h - drop - 1.6)
        for i in range(6):
            a = i * math.tau / 6 + spin + ring
            tri_out(
                mesh, crown,
                F.p(u + math.cos(a) * 0.45, v + math.sin(a) * 0.45, h - drop - 0.05),
                F.p(u + math.cos(a) * reach, v + math.sin(a) * reach, h - drop - 1.15),
                cen,
            )


def window(M, F, u0, u1, v, y0, y1, frame):
    vquad(M.mesh(0, frame), F, u0 - 0.08, u1 + 0.08, v, y0 - 0.08, y1 + 0.08, -1)
    vquad(M.mesh(0, "glass"), F, u0, u1, v - 0.04, y0, y1, -1)


def porch(M, F, u0, u1, front, deck_y, rail):
    """White balcony: slab, posts, top and bottom rails, and an X in each bay."""
    obox(M.mesh(0, "white"), F, u0, u1, front - 1.65, front + 0.08, deck_y - 0.1, deck_y + 0.1)
    span = u1 - u0
    n = max(2, int(round(span / 1.85)))
    for i in range(n + 1):
        u = u0 + span * i / n
        obox(M.mesh(0, "white"), F, u - 0.07, u + 0.07, front - 1.58, front - 1.4, deck_y, deck_y + 1.02)
    obox(M.mesh(0, rail), F, u0, u1, front - 1.64, front - 1.46, deck_y + 0.9, deck_y + 1.05)
    obox(M.mesh(0, rail), F, u0, u1, front - 1.64, front - 1.46, deck_y + 0.12, deck_y + 0.26)
    for i in range(n):
        a = u0 + span * i / n + 0.12
        b = u0 + span * (i + 1) / n - 0.12
        xrail(M.mesh(0, rail), F, a, b, front - 1.55, deck_y + 0.26, deck_y + 0.9)


def cottage(M, F, u0, u1, wall, rail="white", win="white"):
    depth = 5.5
    eave = GF + 2 * FH
    # Upper storey is solid pastel. Ground floor is an open porch on columns.
    obox(M.mesh(0, wall), F, u0, u1, 0.15, depth, GF + FH - 0.05, eave)
    obox(M.mesh(0, wall), F, u0, u1, depth - 0.4, depth, GF, GF + FH)
    obox(M.mesh(0, wall), F, u0, u0 + 0.32, 0.1, depth, GF, GF + FH)
    obox(M.mesh(0, wall), F, u1 - 0.32, u1, 0.1, depth, GF, GF + FH)
    obox(M.mesh(1, wall), F, u0, u1, 0.0, depth, GF, eave)
    # Two-storey white columns on the garden face.
    span = u1 - u0
    n = max(2, int(round(span / 1.85)))
    for i in range(n + 1):
        u = u0 + span * i / n
        obox(M.mesh(0, "white"), F, u - 0.1, u + 0.1, -1.62, -1.38, GF, GF + FH)
    obox(M.mesh(0, "white"), F, u0 - 0.15, u1 + 0.15, -1.7, 0.25, GF - 0.02, GF + 0.16)
    # Upper balcony only. A second rail cage at ground level read as scaffolding.
    porch(M, F, u0 + 0.15, u1 - 0.15, 0.15, GF + FH, rail)
    obox(M.mesh(0, rail), F, u0 + 0.2, u1 - 0.2, -1.62, -1.42, GF + 0.85, GF + 1.02)
    gable(M.mesh(0, "tile"), F, u0 - 0.45, u1 + 0.45, -0.55, depth + 0.35, eave - 0.08, 1.85)
    gable(M.mesh(1, "tile"), F, u0 - 0.3, u1 + 0.3, -0.3, depth + 0.2, eave - 0.05, 1.55)
    gable_face(M.mesh(0, wall), F, u0, u1, 0.08, eave - 0.02, 1.62, 1)
    # Barge boards along the front slopes.
    um = (u0 + u1) / 2
    bar(M.mesh(0, "white"), F.p(u0 - 0.2, -0.5, eave), F.p(um, -0.5, eave + 1.75), 0.07)
    bar(M.mesh(0, "white"), F.p(u1 + 0.2, -0.5, eave), F.p(um, -0.5, eave + 1.75), 0.07)
    # Upper windows on the garden face.
    slots = n
    for i in range(slots):
        a = u0 + span * (i + 0.22) / slots
        b = u0 + span * (i + 0.78) / slots
        window(M, F, a, b, 0.1, GF + FH + 0.7, GF + FH + 2.15, win)
    return eave


def flight(M, F, u0, u1, v0, v1, y0, y1, n=6):
    """Yellow stair from (v0, y0) to (v1, y1). v0 is the lower end."""
    for i in range(n):
        t0, t1 = i / n, (i + 1) / n
        va = v0 + (v1 - v0) * t0
        vb = v0 + (v1 - v0) * t1
        ya = y0 + (y1 - y0) * t0
        yb = y0 + (y1 - y0) * t1
        lo, hi = (va, vb) if va < vb else (vb, va)
        obox(M.mesh(0, "yellow"), F, u0, u1, lo, hi, ya, max(yb, ya + 0.14))
    bar(M.mesh(0, "white"), F.p(u0, v0, y0 + 0.45), F.p(u0, v1, y1 + 0.95), 0.06)
    bar(M.mesh(0, "yellow"), F.p(u1, v0, y0 + 0.35), F.p(u1, v1, y1 + 0.85), 0.055)
    # posts
    obox(M.mesh(0, "yellow"), F, u0 - 0.08, u0 + 0.08, v0 - 0.08, v0 + 0.08, y0, y0 + 1.15)
    obox(M.mesh(0, "yellow"), F, u1 - 0.08, u1 + 0.08, v1 - 0.08, v1 + 0.08, y1, y1 + 1.05)


def pergola(M, F, u0, u1, v0, v1, posts=4):
    y = GF + 2.55
    for i in range(posts):
        u = u0 + (u1 - u0) * i / (posts - 1)
        obox(M.mesh(0, "turq"), F, u - 0.09, u + 0.09, v0, v0 + 0.18, GF, y)
        obox(M.mesh(0, "turq"), F, u - 0.09, u + 0.09, v1 - 0.18, v1, GF, y)
    obox(M.mesh(0, "turq"), F, u0, u1, v0, v0 + 0.2, y, y + 0.16)
    obox(M.mesh(0, "turq"), F, u0, u1, v1 - 0.2, v1, y, y + 0.16)
    for i in range(7):
        u = u0 + (u1 - u0) * i / 6
        obox(M.mesh(0, "turq"), F, u - 0.1, u + 0.1, v0, v1, y + 0.14, y + 0.38)
    obox(M.mesh(1, "turq"), F, u0, u1, v0, v1, y, y + 0.2)


def boardwalk(M, F, u0, u1, v0, v1):
    lo_u, hi_u = (u0, u1) if u0 < u1 else (u1, u0)
    lo_v, hi_v = (v0, v1) if v0 < v1 else (v1, v0)
    obox(M.mesh(0, "wood"), F, lo_u, hi_u, lo_v, hi_v, 0.2, 0.38)
    # Plank seams across the path so it reads as boards, not a brown slab.
    across_u = (hi_u - lo_u) >= (hi_v - lo_v)
    if across_u:
        step = 0.55
        x = lo_u
        while x < hi_u:
            obox(M.mesh(0, "wood2"), F, x, min(hi_u, x + 0.08), lo_v + 0.08, hi_v - 0.08, 0.36, 0.42)
            x += step
    else:
        step = 0.55
        z = lo_v
        while z < hi_v:
            obox(M.mesh(0, "wood2"), F, lo_u + 0.08, hi_u - 0.08, z, min(hi_v, z + 0.08), 0.36, 0.42)
            z += step


def shrub(M, F, u, v, s=0.85, h=0.85):
    obox(M.mesh(0, "hedge"), F, u, u + s, v, v + s * 0.75, 0.2, 0.2 + h)
    obox(M.mesh(0, "shrub"), F, u + 0.15, u + s * 0.75, v + 0.1, v + s * 0.55, 0.35 + h * 0.35, 0.35 + h)


def build():
    M = Model(NAME)
    for n, c, r in (
        ("pink", PINK, 0.72), ("aqua", AQUA, 0.7), ("white", WHITE, 0.55),
        ("cream", CREAM, 0.7), ("yellow", YELLOW, 0.5), ("turq", TURQ, 0.45),
        ("tile", TILE, 0.8), ("glass", GLASS, 0.15), ("lawn", LAWN, 0.92),
        ("lawn2", LAWN2, 0.92), ("wood", WOOD, 0.78), ("wood2", WOOD2, 0.8),
        ("stone", STONE, 0.85), ("trunk", TRUNK, 0.88), ("frond", FROND, 0.8),
        ("hedge", HEDGE, 0.9), ("shrub", SHRUB, 0.88),
    ):
        M.material(n, lin(c), rough=r)

    BF = Frame((-7848.0, -6978.0), (-7822.0, -6974.5), O)
    L = BF.L
    cottage(M, BF, 0.2, 8.0, "aqua", rail="turq", win="turq")
    cottage(M, BF, 8.7, 17.5, "pink", rail="white", win="white")
    cottage(M, BF, 18.2, L - 0.2, "cream", rail="white", win="yellow")
    # Yellow base under the pink stair, the way the garden photo shows it.
    obox(M.mesh(0, "yellow"), BF, 14.4, 17.45, -0.05, 0.22, GF, GF + FH - 0.1)
    # Switchback yellow stair up to the pink porch.
    deck = GF + FH
    flight(M, BF, 15.15, 17.15, -7.3, -4.15, GF, GF + 1.7, n=6)
    obox(M.mesh(0, "yellow"), BF, 13.3, 17.35, -4.35, -2.85, GF + 1.55, GF + 1.85)
    flight(M, BF, 13.45, 15.35, -4.15, -1.55, GF + 1.7, deck, n=6)
    obox(M.mesh(0, "white"), BF, 13.35, 13.5, -4.3, -2.9, GF + 1.7, deck + 0.9)

    pergola(M, BF, 0.3, 6.6, -9.3, -5.6, posts=4)
    pergola(M, BF, -1.2, 4.8, -14.6, -11.2, posts=4)
    pergola(M, BF, 19.0, 24.6, -8.4, -5.5, posts=3)

    # Grass in pieces, with the boardwalk laid over it. Not one empty pad.
    for lod, mat in ((0, "lawn"), (1, "lawn")):
        obox(M.mesh(lod, mat), BF, -4, 12, -20, -6, 0.02, 0.2)
        obox(M.mesh(lod, "lawn2"), BF, 8, L + 2, -19.5, -5.5, 0.02, 0.2)
        obox(M.mesh(lod, mat), BF, -3, L + 1.5, -6.2, 7.4, 0.02, 0.18)
    # Curving wooden boardwalk through the garden, plus paths up to the porches.
    boardwalk(M, BF, -2.2, 10.5, -19.2, -12.6)
    boardwalk(M, BF, 5.5, 15.5, -14.0, -10.6)
    boardwalk(M, BF, 12.0, 23.5, -11.6, -8.4)
    boardwalk(M, BF, 18.5, L + 0.4, -9.6, -6.6)
    boardwalk(M, BF, 11.6, 14.4, -10.8, -1.5)
    boardwalk(M, BF, 20.2, 23.0, -8.6, -1.5)
    obox(M.mesh(1, "wood"), BF, 0, L, -15.5, -8.5, 0.16, 0.32)

    for u, v, s, h in (
        (-1.2, -11.5, 1.3, 1.1), (2.4, -9.2, 1.0, 0.8), (6.8, -12.4, 1.4, 1.15),
        (9.2, -7.6, 1.1, 0.9), (12.8, -13.2, 1.2, 1.0), (16.4, -8.8, 1.5, 1.2),
        (17.2, -6.2, 0.9, 0.7), (21.5, -12.6, 1.3, 1.05), (24.8, -7.4, 1.1, 0.85),
        (4.2, -4.6, 1.2, 0.95), (10.0, -3.8, 1.0, 0.8), (19.4, -3.6, 1.15, 0.9),
        (7.5, -15.2, 1.3, 1.0), (26.2, -5.2, 1.0, 0.75), (1.0, -5.5, 0.9, 0.7),
    ):
        shrub(M, BF, u, v, s, h)
    obox(M.mesh(1, "hedge"), BF, 0, 8, -12, -9, 0.2, 1.1)
    obox(M.mesh(1, "hedge"), BF, 16, 24, -11, -8, 0.2, 1.0)

    for u, v, h, spin, far in (
        (-1.8, -7.2, 8.4, 0.2, True), (2.4, -5.4, 7.6, 0.8, False),
        (6.4, -4.6, 8.0, 1.1, False), (16.6, -5.2, 8.2, 0.4, False),
        (21.8, -6.8, 8.8, 1.3, True), (25.8, -4.8, 7.8, 0.6, False),
        (11.2, 6.4, 9.0, 0.3, False), (19.4, 6.6, 8.4, 1.0, False),
    ):
        palm(M, BF, u, v, h, spin, lod1=far)

    fold_body(M)
    info = write_glb(M, HERO / "boardwalk.glb")
    check_glb(HERO / "boardwalk.glb")
    print(NAME, info, "L", round(L, 1))
    if not 1200 <= info["lod0"] <= 7000:
        raise SystemExit(f"lod0 {info['lod0']}")
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    # Garden camera, slightly above the boardwalk, aimed at the pink casita.
    cam = BF.p(11.2, -16.4, 5.6)
    look = BF.p(13.4, 1.4, 4.3)
    print("cam", round(O[0] + cam[0], 2), round(cam[1], 2), round(O[1] + cam[2], 2))
    print("look", round(O[0] + look[0], 2), round(look[1], 2), round(O[1] + look[2], 2))
    patch(info)
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "boardwalk"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = re.sub(
        r'"status": "[^"]*"',
        '"status": "v4-grokbot (pink casitas, white porches, yellow stair, gables, pergolas, boardwalk)"',
        block,
        count=1,
    )
    block = re.sub(r'"boardwalk_lod0": \d+', f'"boardwalk_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"boardwalk_lod1": \d+', f'"boardwalk_lod1": {info["lod1"]}', block, count=1)
    block = re.sub(r'"textures": \d+', '"textures": 0', block, count=1)
    new = (
        '"ref_sources": "boardwalkaruba.com garden photo, Giovanni Polizzi '
        '(pink and pastel casitas, white two-storey porches with railings, yellow exterior stair, '
        'dark gable roofs, turquoise pergolas, wooden boardwalk, dense palms). OSM footprint. '
        'No pasted photo. Built by tools/grokbot/boardwalk.py"'
    )
    block2, n = re.subn(r'"ref_sources": "(?:[^"\\]|\\.)*"', new, block, count=1)
    if n != 1:
        raise SystemExit("boardwalk ref anchor missing")
    MANIFEST.write_text(text[:i] + block2 + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == "boardwalk")
    assert hit["tris"]["boardwalk_lod0"] == info["lod0"]
    assert hit["textures"] == 0


if __name__ == "__main__":
    build()
