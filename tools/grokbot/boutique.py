#!/usr/bin/env python3
"""Aruba Boutique & Art Hotel.

Same hero id and origin. The Aruba Papers visit photo shows the pool court:
white low blocks, a beige stone pier, a turquoise opening, a white pergola,
a tall hedge, and a pale deck of loungers around blue water. The sign is
drawn. Nothing is a pasted photograph.
"""
import json
import math
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, fold_body, write_glb  # noqa: E402
from hotelkit import FONT_SANS, Frame, balcony_wing, obox, png_bytes, vquad  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-7714.93, -5207.72)
NAME = "boutiqueart"
A = (-7746.5, -5212.7)
B = (-7691.9, -5193.6)

WHITE = (0.94, 0.93, 0.90)
WARM = (0.86, 0.82, 0.74)
STONE = (0.76, 0.62, 0.42)
TURQ = (0.15, 0.72, 0.78)
GLASS = (0.55, 0.68, 0.78)
DECK = (0.62, 0.48, 0.36)
POOL = (0.35, 0.78, 0.86)
COPING = (0.90, 0.86, 0.78)
HEDGE = (0.12, 0.42, 0.16)
LOUNGE = (0.90, 0.88, 0.84)
CUSH = (0.20, 0.45, 0.78)
LAWN = (0.34, 0.60, 0.28)

FLOORS = 3
FH = 3.35
Y0 = 0.4


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def sign_png():
    im = Image.new("RGBA", (1024, 256), (20, 24, 28, 255))
    dr = ImageDraw.Draw(im)
    dr.rectangle((12, 12, 1011, 243), outline=(232, 196, 120, 255), width=8)
    font = ImageFont.truetype(FONT_SANS, 92)
    dr.text((512, 128), "BOUTIQUE & ART", font=font, fill=(248, 246, 240, 255), anchor="mm")
    return im


def build():
    F = Frame(A, B, O)
    L = F.L
    M = Model(NAME)
    for name, rgb, rough in (
        ("white", WHITE, 0.7), ("warm", WARM, 0.78), ("stone", STONE, 0.72),
        ("turq", TURQ, 0.4), ("glass", GLASS, 0.08), ("deck", DECK, 0.8),
        ("pool", POOL, 0.15), ("coping", COPING, 0.55), ("hedge", HEDGE, 0.86),
        ("lounge", LOUNGE, 0.6), ("cush", CUSH, 0.7), ("lawn", LAWN, 0.9),
        ("sign", (1, 1, 1), 0.5),
    ):
        M.material(name, lin(rgb), rough=rough, double=(name in ("glass", "sign")), textured=(name == "sign"))
    mats = {
        "wall": "white", "recess": "warm", "slab": "white",
        "rail": "white", "glass": "glass", "fin": "white",
    }
    top = balcony_wing(M, F, 1, L - 1, 7.5, Y0, FLOORS, FH, 5.5, mats, depth=1.4, faces=(1, -1))
    # Beige stone pier and the turquoise opening from the pool-court photo.
    vquad(M.mesh(0, "stone"), F, L * 0.62, L * 0.70, 7.7, Y0, top - 0.4, 1)
    obox(M.mesh(0, "turq"), F, L * 0.78, L * 0.96, 6.6, 8.4, Y0, Y0 + FH)
    obox(M.mesh(0, "white"), F, L * 0.80, L * 0.94, 6.8, 8.2, Y0 + 0.2, Y0 + FH - 0.3)
    # Pool court on +v. Thick pads sit above the sand.
    for lod in (0, 1):
        obox(M.mesh(lod, "deck"), F, 2, L - 2, 9, 28, 0.0, 0.22)
        obox(M.mesh(lod, "lawn"), F, -4, L + 6, -16, 32, 0.0, 0.12)
        obox(M.mesh(lod, "pool"), F, 8, L * 0.62, 14, 24, 0.16, 0.42)
        obox(M.mesh(lod, "coping"), F, 7.2, L * 0.62 + 0.8, 13.2, 24.8, 0.28, 0.48)
        obox(M.mesh(lod, "hedge"), F, 1.2, 3.2, 10, 27, 0.22, 3.4)
    # White pergola over the near edge of the deck.
    obox(M.mesh(0, "white"), F, 6, L * 0.55, 10.2, 13.6, 2.7, 3.05)
    for u in (7, 16, 25, L * 0.5):
        obox(M.mesh(0, "white"), F, u, u + 0.28, 10.4, 10.9, 0.22, 2.8)
        obox(M.mesh(0, "white"), F, u, u + 0.28, 12.9, 13.4, 0.22, 2.8)
    # Loungers. Furniture only; people belong to the NPC agent.
    for i, u in enumerate((10, 14, 18, 22, 26, 30)):
        obox(M.mesh(0, "lounge"), F, u, u + 1.8, 15.2, 16.6, 0.48, 0.72)
        obox(M.mesh(0, "cush"), F, u + 0.15, u + 1.65, 15.35, 16.45, 0.72, 0.86)
    # Drawn wordmark on the street face.
    vquad(
        M.mesh(0, "sign"), F, L * 0.28, L * 0.58, -8.1, Y0 + FH + 0.4, Y0 + 2 * FH - 0.2, -1,
        uvs=((1, 1), (0, 1), (0, 0), (1, 0)),
    )
    fold_body(M, keep={"sign", "glass"})
    info = write_glb(M, HERO / f"{NAME}.glb", images=[png_bytes(sign_png())])
    check_glb(HERO / f"{NAME}.glb")
    print(NAME, info, "L", round(L, 1), "top", round(top, 1))
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    patch(info)
    look = F.p(L * 0.45, 16, 4)
    cam = F.p(L * 0.2, 42, 3)
    print("look", round(O[0] + look[0], 1), round(O[1] + look[2], 1))
    print("cam", round(O[0] + cam[0], 1), round(O[1] + cam[2], 1))
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find(f'"id": "{NAME}"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = block.replace(
        '"status": "v3-procedural (OSM footprint, photo/brand refs)"',
        '"status": "v4-grokbot (white court, turquoise opening, pool)"',
        1,
    )
    block = re.sub(rf'"{NAME}_lod0": \d+', f'"{NAME}_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(rf'"{NAME}_lod1": \d+', f'"{NAME}_lod1": {info["lod1"]}', block, count=1)
    block = block.replace('"textures": 2', '"textures": 1', 1)
    new = (
        '"ref_sources": "Aruba Papers visit, March 2024 (white pool court, beige stone '
        'pier, turquoise opening, white pergola, hedge, loungers). OSM footprint. '
        'Sign is drawn. Built by tools/grokbot/boutique.py"'
    )
    block2, n = re.subn(r'"ref_sources": "(?:[^"\\]|\\.)*"', new, block, count=1)
    if n != 1:
        raise SystemExit("boutique ref anchor missing")
    block = block2.replace(
        "generated by /workspace/landmarks/gen.mjs",
        "generated by tools/grokbot/boutique.py",
        1,
    )
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == NAME)
    assert hit["tris"][f"{NAME}_lod0"] == info["lod0"]
    assert hit["textures"] == 1


if __name__ == "__main__":
    build()
