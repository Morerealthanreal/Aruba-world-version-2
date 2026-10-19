#!/usr/bin/env python3
"""Aruba Boutique & Art Hotel.

Same hero id and origin. The Aruba Papers pool-court photo is the subject:
a turquoise pool with a stone edge, white loungers, a tall green hedge,
a white pergola, a wood-plank deck, a wood-slat column and a turquoise
accent wall. The camera sits on the deck. No sign image. Nothing is pasted.
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
O = (-7714.93, -5207.72)
NAME = "boutiqueart"
A = (-7746.5, -5212.7)
B = (-7691.9, -5193.6)

WHITE = (0.95, 0.94, 0.92)
WARM = (0.90, 0.86, 0.80)
STONE = (0.86, 0.80, 0.70)
TURQ = (0.05, 0.74, 0.82)
GLASS = (0.55, 0.70, 0.80)
DECK = (0.48, 0.30, 0.18)
DECK2 = (0.38, 0.23, 0.13)
POOL = (0.25, 0.82, 0.90)
TILE = (0.12, 0.28, 0.36)
HEDGE = (0.08, 0.38, 0.12)
HEDGE2 = (0.14, 0.46, 0.16)
LOUNGE = (0.93, 0.92, 0.90)
CUSH = (0.22, 0.48, 0.82)
SLAT = (0.74, 0.60, 0.42)
TRUNK = (0.40, 0.26, 0.14)
FROND = (0.12, 0.40, 0.16)
METAL = (0.55, 0.58, 0.60)

# Standing on the side deck, hedge immediately to the left, looking across the
# pool at the lounger row. (u, v, y). High u is screen-left in this framing.
CAM = (20.8, 5.2, 2.35)
LOOK = (13.0, 13.2, 2.85)


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def palm(M, F, u, v, h=9.0):
    obox(M.mesh(0, "trunk"), F, u - 0.16, u + 0.16, v - 0.16, v + 0.16, 1.2, h)
    crown, cen = F.p(u, v, h + 0.1), F.p(u, v, h - 1.5)
    mesh = M.mesh(0, "frond")
    for i in range(6):
        a = i * math.tau / 6
        reach = 2.4 + (i % 2) * 0.4
        tri_out(
            mesh, crown,
            F.p(u + math.cos(a) * 0.5, v + math.sin(a) * 0.5, h),
            F.p(u + math.cos(a) * reach, v + math.sin(a) * reach, h - 1.1),
            cen,
        )


def planks(M, F, u0, u1, v0, v1, y0=0.72, y1=1.05):
    obox(M.mesh(0, "deck2"), F, u0, u1, v0, v1, y0 - 0.12, y0 + 0.02)
    u = u0
    i = 0
    while u < u1 - 0.05:
        w = 0.42
        mat = "deck" if i % 2 == 0 else "deck2"
        obox(M.mesh(0, mat), F, u, min(u1, u + w), v0, v1, y0, y1)
        u += w + 0.05
        i += 1


def lounger(M, F, u, v, lod=0):
    # Chunky white chaise along +v, blue towel, so the row reads from the deck.
    name = "lounge"
    obox(M.mesh(lod, name), F, u, u + 0.1, v, v + 2.05, 1.12, 1.55)
    obox(M.mesh(lod, name), F, u + 0.78, u + 0.88, v, v + 2.05, 1.12, 1.55)
    obox(M.mesh(lod, name), F, u, u + 0.88, v, v + 1.85, 1.48, 1.62)
    obox(M.mesh(lod, "cush"), F, u + 0.08, u + 0.8, v + 0.1, v + 1.72, 1.6, 1.74)
    obox(M.mesh(lod, name), F, u, u + 0.88, v + 1.7, v + 2.05, 1.55, 2.15)
    obox(M.mesh(lod, "cush"), F, u + 0.1, u + 0.78, v + 1.78, v + 1.98, 1.85, 2.08)


def cypress(M, F, u, v):
    # Tall white planter and a smooth dark-green cone.
    obox(M.mesh(0, "white"), F, u, u + 0.78, v, v + 0.78, 1.08, 2.55)
    obox(M.mesh(0, "hedge"), F, u + 0.1, u + 0.68, v + 0.1, v + 0.68, 2.45, 2.65)
    cx, cz = u + 0.39, v + 0.39
    top = F.p(cx, cz, 5.35)
    cen = F.p(cx, cz, 3.4)
    mesh = M.mesh(0, "hedge2")
    r = 0.48
    for i in range(8):
        a = i * math.tau / 8
        b = a + math.tau / 8
        tri_out(
            mesh, top,
            F.p(cx + math.cos(a) * r, cz + math.sin(a) * r, 2.55),
            F.p(cx + math.cos(b) * r, cz + math.sin(b) * r, 2.55),
            cen,
        )
    obox(M.mesh(1, "hedge2"), F, u + 0.16, u + 0.62, v + 0.16, v + 0.62, 2.5, 5.1)


def build():
    F = Frame(A, B, O)
    L = F.L
    M = Model(NAME)
    for name, rgb, rough in (
        ("white", WHITE, 0.62), ("warm", WARM, 0.75), ("stone", STONE, 0.6),
        ("turq", TURQ, 0.4), ("glass", GLASS, 0.1), ("deck", DECK, 0.78),
        ("deck2", DECK2, 0.8), ("pool", POOL, 0.12), ("tile", TILE, 0.45),
        ("hedge", HEDGE, 0.9), ("hedge2", HEDGE2, 0.88), ("lounge", LOUNGE, 0.55),
        ("cush", CUSH, 0.7), ("slat", SLAT, 0.7), ("trunk", TRUNK, 0.85),
        ("frond", FROND, 0.8), ("metal", METAL, 0.4),
    ):
        M.material(name, lin(rgb), rough=rough)

    # Wood deck under the camera, around the pool, and along the court.
    planks(M, F, 2.0, 46.0, -2.2, 3.15)
    planks(M, F, 2.0, 18.8, 3.0, 16.4)
    planks(M, F, 18.8, 26.5, 3.0, 16.4)
    planks(M, F, 33.4, 46.0, 3.0, 16.4)
    planks(M, F, 8.2, 33.6, 12.15, 16.5)
    obox(M.mesh(1, "deck"), F, 2, 46, -2, 16.5, 0.7, 1.02)

    # Turquoise pool and the light stone coping around it.
    obox(M.mesh(0, "stone"), F, 4.2, 18.6, 3.15, 12.25, 1.02, 1.42)
    obox(M.mesh(0, "tile"), F, 4.85, 17.9, 3.75, 11.65, 1.28, 1.4)
    obox(M.mesh(0, "pool"), F, 5.15, 17.6, 4.05, 11.35, 1.18, 1.48)
    obox(M.mesh(1, "stone"), F, 4.2, 18.6, 3.15, 12.25, 1.0, 1.38)
    obox(M.mesh(1, "pool"), F, 5.2, 17.5, 4.1, 11.3, 1.2, 1.46)

    # Tall hedge filling the left of the pool-court view, close to the camera.
    obox(M.mesh(0, "hedge"), F, 22.2, 25.4, -1.2, 18.6, 1.0, 8.6)
    obox(M.mesh(0, "hedge2"), F, 22.45, 25.15, -0.6, 5.2, 4.2, 9.2)
    obox(M.mesh(0, "hedge2"), F, 22.4, 25.2, 6.0, 12.6, 4.6, 9.6)
    obox(M.mesh(0, "hedge2"), F, 22.5, 25.1, 13.0, 18.2, 4.0, 9.0)
    obox(M.mesh(1, "hedge"), F, 22.3, 25.3, -0.8, 18.2, 1.0, 7.6)

    # Court wall. The span behind the pergola stays low so the beams read on the sky.
    obox(M.mesh(0, "white"), F, 4.5, 9.2, 16.35, 21.4, 1.0, 5.15)
    obox(M.mesh(0, "white"), F, 9.2, 18.2, 16.35, 21.4, 1.0, 3.05)
    obox(M.mesh(0, "white"), F, 18.2, 46.5, 16.35, 21.4, 1.0, 5.15)
    obox(M.mesh(0, "white"), F, 10.7, 13.1, 16.2, 21.5, 2.9, 6.15)
    obox(M.mesh(1, "white"), F, 4.5, 46.5, 16.3, 21.2, 1.0, 4.4)
    # Rooms set just behind the wall, still one storey, so the court stays the subject.
    obox(M.mesh(0, "warm"), F, 6, 44, 21.2, 27.5, 1.0, 4.4)
    obox(M.mesh(1, "warm"), F, 6, 44, 21.2, 27, 1.0, 4.2)
    for u in (10, 16, 30, 40):
        vquad(M.mesh(0, "glass"), F, u, u + 1.3, 16.28, 1.7, 3.5, -1)

    # Wood-slat accent column, proud of the court wall, near the middle of the view.
    for i in range(8):
        u = 11.15 + i * 0.18
        obox(M.mesh(0, "slat"), F, u, u + 0.1, 15.72, 16.22, 1.25, 5.7)
    obox(M.mesh(1, "slat"), F, 11.1, 12.55, 15.75, 16.2, 1.3, 5.5)

    # Turquoise accent wall on the right of the court view (low u).
    obox(M.mesh(0, "white"), F, 3.6, 9.4, 15.55, 16.55, 1.15, 5.15)
    obox(M.mesh(0, "turq"), F, 4.05, 8.9, 15.35, 16.15, 1.7, 4.85)
    obox(M.mesh(1, "turq"), F, 4.1, 8.8, 15.4, 16.15, 1.7, 4.7)

    # White pergola over the middle of the lounger row, in front of the low wall.
    y = 3.35
    for u, v in ((9.8, 12.5), (9.8, 15.05), (13.2, 12.5), (13.2, 15.05), (16.6, 12.5), (16.6, 15.05)):
        obox(M.mesh(0, "white"), F, u, u + 0.22, v, v + 0.22, 1.08, y + 0.18)
    obox(M.mesh(0, "white"), F, 9.6, 17.1, 12.45, 12.85, y, y + 0.26)
    obox(M.mesh(0, "white"), F, 9.6, 17.1, 15.0, 15.4, y, y + 0.26)
    for i in range(6):
        u = 9.9 + i * 1.2
        obox(M.mesh(0, "white"), F, u, u + 0.14, 12.5, 15.35, y + 0.2, y + 0.42)
    obox(M.mesh(1, "white"), F, 9.6, 17.0, 12.5, 15.3, y, y + 0.2)

    # White loungers in a row along the far edge of the pool.
    for i, u in enumerate((7.4, 9.5, 11.6, 13.7, 15.8, 17.9)):
        lounger(M, F, u, 12.45, 0 if i % 2 == 0 else 0)
        if i % 2 == 0:
            obox(M.mesh(0, "metal"), F, u + 1.05, u + 1.7, 13.15, 13.8, 1.2, 1.85)
    for u in (8.0, 13.0, 18.0):
        obox(M.mesh(1, "lounge"), F, u, u + 1.5, 12.5, 14.4, 1.15, 1.6)

    # Shrubs behind the loungers, then potted cypress against the white wall.
    obox(M.mesh(0, "hedge"), F, 18.4, 22.0, 14.7, 15.45, 1.1, 2.25)
    obox(M.mesh(0, "hedge2"), F, 18.55, 21.85, 14.85, 15.3, 2.15, 2.55)
    for u in (8.2, 11.2, 14.4, 17.6):
        cypress(M, F, u, 14.55)

    # Palms behind the pergola, crowns above the wall.
    palm(M, F, 17.2, 17.6, 9.4)
    palm(M, F, 20.4, 18.2, 10.6)

    fold_body(M)
    info = write_glb(M, HERO / f"{NAME}.glb")
    check_glb(HERO / f"{NAME}.glb")
    print(NAME, info, "L", round(L, 1))
    if not 1200 <= info["lod0"] <= 7000:
        raise SystemExit(f"lod0 {info['lod0']}")
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    for label, uv in (("cam", CAM), ("look", LOOK), ("away", (20.0, 30.0, 1.0))):
        p = F.p(*uv)
        print(label, round(O[0] + p[0], 2), round(p[1], 2), round(O[1] + p[2], 2))
    patch(info)
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find(f'"id": "{NAME}"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = re.sub(
        r'"status": "[^"]*"',
        '"status": "v4-grokbot (loungers, pergola, cypress, slat column, turquoise wall)"',
        block,
        count=1,
    )
    block = re.sub(rf'"{NAME}_lod0": \d+', f'"{NAME}_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(rf'"{NAME}_lod1": \d+', f'"{NAME}_lod1": {info["lod1"]}', block, count=1)
    block = re.sub(r'"textures": \d+', '"textures": 0', block, count=1)
    new = (
        '"ref_sources": "Aruba Papers visit, March 2024 (turquoise pool, stone edge, '
        'white loungers, tall hedge, white pergola, wood deck, wood-slat column, '
        'turquoise accent wall). OSM footprint. No pasted photo. Built by tools/grokbot/boutique.py"'
    )
    block2, n = re.subn(r'"ref_sources": "(?:[^"\\]|\\.)*"', new, block, count=1)
    if n != 1:
        raise SystemExit("boutique ref anchor missing")
    block2 = block2.replace(
        "generated by /workspace/landmarks/gen.mjs",
        "generated by tools/grokbot/boutique.py",
        1,
    )
    MANIFEST.write_text(text[:i] + block2 + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == NAME)
    assert hit["tris"][f"{NAME}_lod0"] == info["lod0"]
    assert hit["textures"] == 0


if __name__ == "__main__":
    build()
