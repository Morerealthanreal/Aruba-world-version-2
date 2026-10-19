#!/usr/bin/env python3
"""Costa Linda Beach Resort.

Same hero id. The Aruba.com pool photo shows a yellow-and-white wing with
arched windows and orange roof accents, a free-form turquoise pool, thatched
palapas, a yellow restaurant, dense palms and white loungers. Nothing is pasted.
"""
import json
import math
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, fold_body, write_glb  # noqa: E402
from hotelkit import Frame, hip_roof, obox, tri_out, vquad  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-9903.58, -2591.96)
NAME = "costalinda"

YELLOW = (0.98, 0.82, 0.22)
WHITE = (0.96, 0.95, 0.92)
ORANGE = (0.90, 0.40, 0.10)
GLASS = (0.40, 0.58, 0.72)
POOL = (0.22, 0.78, 0.90)
COPING = (0.78, 0.74, 0.68)
DECK = (0.62, 0.58, 0.52)
THATCH = (0.52, 0.38, 0.20)
LOUNGE = (0.93, 0.93, 0.90)
CUSH = (0.25, 0.55, 0.82)
TRUNK = (0.40, 0.26, 0.14)
FROND = (0.12, 0.42, 0.16)
HEDGE = (0.14, 0.40, 0.16)
ROCK = (0.55, 0.52, 0.48)


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def palm(M, F, u, v, h=11.0):
    obox(M.mesh(0, "trunk"), F, u - 0.16, u + 0.16, v - 0.16, v + 0.16, 0.15, h)
    mesh = M.mesh(0, "frond")
    for ring, drop, reach in ((0.0, 1.2, 2.8), (1.1, 1.5, 2.2)):
        crown, cen = F.p(u, v, h - ring), F.p(u, v, h - ring - 1.4)
        for i in range(6):
            a = i * math.tau / 6 + ring
            tri_out(
                mesh, crown,
                F.p(u + math.cos(a) * 0.4, v + math.sin(a) * 0.4, h - ring - 0.05),
                F.p(u + math.cos(a) * reach, v + math.sin(a) * reach, h - ring - drop),
                cen,
            )


def palapa(M, F, u, v, r=2.4):
    obox(M.mesh(0, "trunk"), F, u - 0.12, u + 0.12, v - 0.12, v + 0.12, 0.2, 2.3)
    top = F.p(u, v, 3.5)
    cen = F.p(u, v, 1.5)
    mesh = M.mesh(0, "thatch")
    for i in range(8):
        a0 = i * math.tau / 8
        a1 = (i + 1) * math.tau / 8
        tri_out(
            mesh, top,
            F.p(u + math.cos(a0) * r, v + math.sin(a0) * r, 1.7),
            F.p(u + math.cos(a1) * r, v + math.sin(a1) * r, 1.7),
            cen,
        )
    obox(M.mesh(1, "thatch"), F, u - r * 0.6, u + r * 0.6, v - r * 0.6, v + r * 0.6, 2.2, 3.3)


def arch_row(M, F, u0, u1, v, y0, y1, n):
    span = (u1 - u0) / n
    for i in range(n):
        a = u0 + i * span + span * 0.18
        b = u0 + (i + 1) * span - span * 0.18
        vquad(M.mesh(0, "orange"), F, a - 0.12, b + 0.12, v, y0 - 0.1, y1 + 0.55, -1)
        vquad(M.mesh(0, "glass"), F, a, b, v - 0.06, y0, y1, -1)
        # Cap the opening so the row reads as arches rather than plain slots.
        obox(M.mesh(0, "orange"), F, a, b, v - 0.2, v + 0.05, y1, y1 + 0.42)


def build():
    M = Model(NAME)
    for n, c, r in (
        ("yellow", YELLOW, 0.65), ("white", WHITE, 0.6), ("orange", ORANGE, 0.55),
        ("glass", GLASS, 0.12), ("pool", POOL, 0.12), ("coping", COPING, 0.6),
        ("deck", DECK, 0.82), ("thatch", THATCH, 0.85), ("lounge", LOUNGE, 0.55),
        ("cush", CUSH, 0.7), ("trunk", TRUNK, 0.85), ("frond", FROND, 0.8),
        ("hedge", HEDGE, 0.9), ("rock", ROCK, 0.8),
    ):
        M.material(n, lin(c), rough=r)

    # +u north, +v west toward the ocean. The photo looks across the pool at the sea.
    F = Frame((-9945.0, -2648.0), (-9945.0, -2528.0), O)
    L = F.L
    # Yellow-and-white wing with arched windows and orange roof accents.
    obox(M.mesh(0, "yellow"), F, 4.0, 28.0, 6.0, 18.0, 0.4, 14.5)
    obox(M.mesh(0, "white"), F, 4.2, 27.8, 5.7, 8.5, 0.45, 14.2)
    obox(M.mesh(1, "yellow"), F, 4.0, 28.0, 6.0, 18.0, 0.4, 14.2)
    for f, y in enumerate((1.2, 4.6, 8.0, 11.4)):
        arch_row(M, F, 5.0, 27.0, 5.65, y, y + 2.3, 6)
        obox(M.mesh(0, "white"), F, 4.0, 28.0, 4.8, 6.1, y + 2.35, y + 2.7)
    hip_roof(M.mesh(0, "orange"), F, 3.2, 16.5, 5.2, 18.8, 14.3, 2.4)
    hip_roof(M.mesh(0, "orange"), F, 16.0, 29.0, 5.2, 18.8, 14.3, 2.2)
    hip_roof(M.mesh(1, "orange"), F, 4.0, 28.0, 6.0, 18.0, 14.2, 1.8)

    # Yellow restaurant with a thatched skirt, beside the pool.
    obox(M.mesh(0, "yellow"), F, 36.0, 54.0, 10.0, 20.0, 0.4, 5.2)
    obox(M.mesh(1, "yellow"), F, 36.0, 54.0, 10.0, 20.0, 0.4, 5.0)
    hip_roof(M.mesh(0, "thatch"), F, 34.5, 55.5, 8.8, 21.2, 5.05, 2.2)
    vquad(M.mesh(0, "glass"), F, 38, 50, 9.95, 1.2, 3.6, -1)

    # Stone deck and a free-form pool: two lobes, a swim-up island, a fountain.
    for lod in (0, 1):
        obox(M.mesh(lod, "deck"), F, -8, 86, -24, 34, 0.05, 0.28)
    obox(M.mesh(0, "coping"), F, 16.0, 46.0, 0.5, 16.5, 0.3, 0.62)
    obox(M.mesh(0, "coping"), F, 30.0, 58.0, 4.0, 18.5, 0.3, 0.62)
    obox(M.mesh(0, "pool"), F, 17.2, 44.8, 1.5, 15.4, 0.4, 0.72)
    obox(M.mesh(0, "pool"), F, 31.2, 56.8, 5.0, 17.4, 0.4, 0.72)
    obox(M.mesh(1, "pool"), F, 18, 56, 2, 16, 0.35, 0.7)
    obox(M.mesh(0, "rock"), F, 33.5, 38.5, 8.2, 12.4, 0.55, 1.15)
    obox(M.mesh(0, "white"), F, 35.2, 35.45, 9.6, 9.85, 1.1, 3.2)
    obox(M.mesh(0, "white"), F, 48.5, 48.8, 12.2, 12.5, 0.7, 2.6)

    for u, v in ((20, 3.2), (26, 6), (42, 3.5), (50, 8), (14, 12), (58, 14), (8, 8), (62, 6)):
        palapa(M, F, u, v, 2.3 if u % 2 == 0 else 1.8)
    for u in (18, 22, 27, 32, 40, 45, 51, 56, 14, 36):
        obox(M.mesh(0, "lounge"), F, u, u + 1.6, -1.2, 0.2, 0.28, 0.55)
        obox(M.mesh(0, "cush"), F, u + 0.1, u + 1.5, -1.05, 0.05, 0.52, 0.66)
        obox(M.mesh(0, "lounge"), F, u, u + 0.12, -1.2, 0.2, 0.28, 0.85)
    for u, v, h in (
        (10, 4, 12), (15, 14, 13), (24, 18, 11), (32, 2, 14), (40, 20, 12),
        (48, 1, 13), (55, 16, 11), (64, 10, 12), (6, 20, 10), (30, 22, 9),
        (18, -6, 11), (28, -8, 13), (38, -4, 10), (50, -8, 12), (12, 8, 9),
        (44, 8, 11), (60, -2, 10),
    ):
        palm(M, F, u, v, h)
    obox(M.mesh(1, "frond"), F, 8, 60, 0, 22, 6, 6.4)
    for u, v in ((12, 10), (28, 16), (44, 12), (60, 8), (4, 2), (22, -2), (38, 22), (52, 18), (66, 4), (18, 20)):
        obox(M.mesh(0, "hedge"), F, u, u + 2.2, v, v + 1.4, 0.25, 1.1)
        obox(M.mesh(0, "frond"), F, u + 0.3, u + 1.8, v + 0.2, v + 1.1, 0.9, 1.5)

    fold_body(M)
    info = write_glb(M, HERO / f"{NAME}.glb")
    check_glb(HERO / f"{NAME}.glb")
    print(NAME, info, "L", round(L, 1))
    if not 1200 <= info["lod0"] <= 7000:
        raise SystemExit(f"lod0 {info['lod0']}")
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    cam = F.p(48.0, -16.0, 11.0)
    look = F.p(24.0, 10.0, 3.0)
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
        '"status": "v4-grokbot (yellow arches, free-form pool, palapas)"',
        block, count=1,
    )
    block = re.sub(rf'"{NAME}_lod0": \d+', f'"{NAME}_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(rf'"{NAME}_lod1": \d+', f'"{NAME}_lod1": {info["lod1"]}', block, count=1)
    block = re.sub(r'"textures": \d+', '"textures": 0', block, count=1)
    new = (
        '"ref_sources": "aruba.com Costa Linda pool photo (yellow-and-white arched wing, '
        'orange roofs, free-form turquoise pool, thatched palapas, yellow restaurant, '
        'palms, loungers). OSM footprint. No pasted photo. Built by tools/grokbot/costa.py"'
    )
    block2, n = re.subn(r'"ref_sources": "(?:[^"\\]|\\.)*"', new, block, count=1)
    if n != 1:
        raise SystemExit("costa ref anchor missing")
    MANIFEST.write_text(text[:i] + block2 + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == NAME)
    assert hit["tris"][f"{NAME}_lod0"] == info["lod0"]
    assert hit["textures"] == 0


if __name__ == "__main__":
    build()
