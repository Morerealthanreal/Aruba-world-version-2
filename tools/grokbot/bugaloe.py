#!/usr/bin/env python3
"""Bugaloe at De Palm Pier: the long thatched bar standing on the pier.

Same hero id and origin. The OSM footprint is the shore end. The pier itself
runs west into the water, which is where the Esri aerial and the night drone
still (YouTube zEBaFtoL3_o) put it: a long low dark-thatch roof, open sides,
a deck with the bar under it. Geometry only, plus the name on the shore gable.
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, write_glb  # noqa: E402
from hotelkit import (FONT_SANS, Frame, hip_roof, obox, png_bytes, text_png,  # noqa: E402
                      uquad, vquad)

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-8523.4, -5313.88)

THATCH = (0.45, 0.28, 0.12)
THATCH_D = (0.32, 0.18, 0.08)
WOOD = (0.42, 0.26, 0.14)
DECK = (0.55, 0.40, 0.24)
RAIL = (0.72, 0.68, 0.60)
BULB = (1.0, 0.86, 0.45)


def lin(c):
    return tuple(round(min(1, v) ** 2.2, 4) for v in c)


def build():
    M = Model("bugaloe")
    for n, c, r in (
        ("thatch", THATCH, .95), ("thatchd", THATCH_D, .95), ("wood", WOOD, .8),
        ("deck", DECK, .7), ("rail", RAIL, .5), ("post", WOOD, .75),
    ):
        M.material(n, lin(c), rough=r)
    M.material("bulb", lin(BULB), rough=.4, emissive=.8)
    M.material("sign", (0.96, 0.93, 0.84), rough=.5, textured=True, emissive=.2)

    # shore (east) to sea (west). The aerial pier leaves the beach going west.
    F = Frame((-8516.0, -5310.5), (-8586.0, -5322.0), O)
    L, hv = F.L, 5.2
    deck_y = 1.15
    eave = 3.35
    for lod in (0, 1):
        obox(M.mesh(lod, "deck"), F, -1.5, L + 1.2, -hv - 0.4, hv + 0.4, deck_y - 0.28, deck_y + 0.16)
        # two thatch layers so the roof reads thick, not a single plane
        hip_roof(M.mesh(lod, "thatch"), F, 1.0, L - 2.5, -hv - 0.8, hv + 0.8, eave, 2.3)
        hip_roof(M.mesh(lod, "thatchd"), F, 2.2, L - 4.0, -hv + 0.4, hv - 0.4, eave + 0.15, 1.7)
        # shore gable wall, where the name sits
        obox(M.mesh(lod, "wood"), F, -0.3, 0.35, -hv, hv, deck_y, eave)
    # pilings under the seaward half
    for lod in (0, 1):
        step = 8.0 if lod == 0 else 16.0
        u = 8.0
        while u < L - 2:
            for s in (-1, 1):
                obox(M.mesh(lod, "post"), F, u - 0.22, u + 0.22, s * (hv - 0.5), s * (hv + 0.15),
                     -1.4, deck_y)
            u += step
    # posts, rails, a bar counter, bulbs: close up only
    posts = []
    u = 3.0
    while u < L - 3:
        posts.append(u)
        u += 4.2
    for u in posts:
        for s in (-1, 1):
            obox(M.mesh(0, "post"), F, u - 0.16, u + 0.16, s * (hv - 0.55), s * (hv - 0.15), deck_y, eave)
        vquad(M.mesh(0, "rail"), F, u - 2.0, u + 2.0, hv - 0.2, deck_y + 0.15, deck_y + 1.0, 1)
        vquad(M.mesh(0, "rail"), F, u - 2.0, u + 2.0, -(hv - 0.2), deck_y + 0.15, deck_y + 1.0, -1)
        obox(M.mesh(0, "bulb"), F, u - 0.12, u + 0.12, hv - 0.15, hv + 0.05, eave - 0.35, eave - 0.05)
    # bar counter down the middle of the shore half, with a back shelf and stools
    obox(M.mesh(0, "wood"), F, 6.0, L * 0.55, -1.3, 1.3, deck_y, deck_y + 1.15)
    obox(M.mesh(0, "wood"), F, 6.4, L * 0.55 - 0.4, -0.35, 0.35, deck_y + 1.15, deck_y + 1.85)
    u = 8.0
    while u < L * 0.52:
        for s in (-1, 1):
            obox(M.mesh(0, "wood"), F, u - 0.22, u + 0.22, s * 1.55, s * 2.15, deck_y, deck_y + 0.12)
            obox(M.mesh(0, "post"), F, u - 0.06, u + 0.06, s * 1.7, s * 2.0, deck_y - 0.35, deck_y)
        u += 3.4
    # deck planks and thatch fringe so the pier reads up close
    u = 0.4
    while u < L - 0.4:
        obox(M.mesh(0, "deck"), F, u, u + 0.42, -hv + 0.3, hv - 0.3, deck_y + 0.12, deck_y + 0.2)
        u += 0.78
    u = 2.0
    while u < L - 3:
        for s in (-1, 1):
            obox(M.mesh(0, "thatchd"), F, u - 0.35, u + 0.35, s * (hv - 0.2), s * (hv + 0.9), eave - 0.15, eave + 0.35)
        u += 1.35
    # lod1 rails as one band
    for s in (-1, 1):
        vquad(M.mesh(1, "rail"), F, 1.0, L - 2.0, s * (hv - 0.2), deck_y + 0.2, deck_y + 0.9, s)

    png = text_png(["BUGALOE"], 512, 128, (92, 52, 24, 255), (255, 236, 190, 255), FONT_SANS)
    uquad(M.mesh(0, "sign"), F, -0.4, -3.2, 3.2, eave - 1.5, eave - 0.15, -1,
          uvs=((0, 1), (1, 1), (1, 0), (0, 0)))
    uquad(M.mesh(1, "sign"), F, -0.4, -3.2, 3.2, eave - 1.5, eave - 0.15, -1,
          uvs=((0, 1), (1, 1), (1, 0), (0, 0)))

    info = write_glb(M, HERO / "bugaloe.glb", images=[png_bytes(png)])
    check_glb(HERO / "bugaloe.glb")
    if not (2500 <= info["lod0"] <= 4500):
        print("WARN lod0", info["lod0"])
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    patch(info)
    print("bugaloe", info, "pier", round(L, 1))
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "bugaloe"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = block.replace('"status": "v3-procedural"',
                           '"status": "v4-grokbot (pier from the aerial, thatch from the drone still)"', 1)
    block = re.sub(r'"bugaloe_lod0": \d+', f'"bugaloe_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"bugaloe_lod1": \d+', f'"bugaloe_lod1": {info["lod1"]}', block, count=1)
    old = '"ref_sources": "De Palm Pier / Bugaloe (Palm Beach thatched pier bar); pier position from Esri World Imagery (reference only)"'
    new = ('"ref_sources": "Night drone still (YouTube zEBaFtoL3_o): long low thatch roof on the pier, '
           'open sides, deck out over the water. Esri aerial: the pier leaves the beach going west '
           'from this footprint. Built by tools/grokbot/bugaloe.py"')
    if old in block:
        block = block.replace(old, new, 1)
    elif "tools/grokbot/bugaloe.py" not in block:
        raise SystemExit("bugaloe ref anchor missing")
    block = block.replace("generated by /workspace/landmarks/gen.mjs",
                           "generated by tools/grokbot/bugaloe.py", 1)
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == "bugaloe")
    assert hit["tris"]["bugaloe_lod0"] == info["lod0"]


if __name__ == "__main__":
    build()
