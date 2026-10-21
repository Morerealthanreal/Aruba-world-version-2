#!/usr/bin/env python3
"""Aruba Marriott Resort & Stellaris Casino.

Same hero id and origin. The entrance photo (refs/places/palm-eagle-beach/marriott)
shows a long white mid-rise with dark horizontal balcony bands, a Marriott
wordmark over the centre doors, and two white monument signs with a red M
flanking a paver drive. Palms and hedges fill the court. The M and the
wordmark are drawn. Nothing is a pasted photograph.
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
from hotelkit import (  # noqa: E402
    FONT_SANS, FONT_SERIF, Frame, balcony_wing, obox, png_bytes, tri_out, vquad,
)

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-8000.03, -6711.14)

WHITE = (0.94, 0.94, 0.93)
DARK = (0.20, 0.22, 0.24)
GLASS = (0.14, 0.18, 0.22)
RAIL = (0.55, 0.57, 0.58)
HEDGE = (0.16, 0.40, 0.18)
LAWN = (0.28, 0.52, 0.22)
BRICK = (0.62, 0.40, 0.32)
ASPHALT = (0.16, 0.17, 0.18)
TRUNK = (0.38, 0.24, 0.12)
FROND = (0.10, 0.36, 0.16)
RED = (0.72, 0.08, 0.16)

FH = 3.05
GF = 0.4


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def hquad(mesh, F, u0, u1, v0, v1, y):
    A, B = F.p(u0, v0, y), F.p(u1, v0, y)
    C, D = F.p(u1, v1, y), F.p(u0, v1, y)
    cen = F.p((u0 + u1) / 2, (v0 + v1) / 2, y - 1)
    tri_out(mesh, A, B, C, cen)
    tri_out(mesh, A, C, D, cen)


def palm(M, F, u, v, h=13.0, spin=0.0, reach=3.6):
    obox(M.mesh(0, "trunk"), F, u - 0.2, u + 0.2, v - 0.2, v + 0.2, 0.15, h * 0.55)
    obox(M.mesh(0, "trunk"), F, u - 0.12, u + 0.12, v - 0.12, v + 0.12, h * 0.48, h)
    crown, cen = F.p(u, v, h + 0.15), F.p(u, v, h - 3)
    mesh = M.mesh(0, "frond")
    for i in range(8):
        a = i * math.tau / 8 + spin
        r = reach + (i % 3) * 0.7
        tri_out(mesh, crown,
                F.p(u + math.cos(a) * r * 0.35, v + math.sin(a) * r * 0.35, h + 0.05),
                F.p(u + math.cos(a) * r, v + math.sin(a) * r, h - 1.5 - (i % 2) * 0.5),
                cen)


def logo_png():
    """Left half: monument (red M). Right half: dark entrance wordmark."""
    w, h = 1024, 512
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    dr.rectangle((0, 0, 511, h), fill=(244, 244, 242, 255))
    fm = ImageFont.truetype(FONT_SERIF, 280)
    bb = fm.getbbox("M")
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    dr.text(((512 - tw) / 2 - bb[0], 70 - bb[1]), "M", font=fm, fill=(176, 18, 36, 255))
    fs = ImageFont.truetype(FONT_SANS, 36)
    for text, y in (("MARRIOTT", 360), ("ARUBA RESORT & STELLARIS CASINO", 420)):
        t = fs.getlength(text)
        dr.text(((512 - t) / 2, y), text, font=fs, fill=(40, 40, 42, 255))
    dr.rectangle((512, 0, w, h), fill=(28, 28, 32, 255))
    fw = ImageFont.truetype(FONT_SERIF, 150)
    word = "Marriott"
    t = fw.getlength(word)
    dr.text((512 + (512 - t) / 2, 170), word, font=fw, fill=(245, 245, 242, 255))
    return im


def build():
    M = Model("marriott")
    for n, c, r in (
        ("wall", WHITE, .82), ("recess", DARK, .9), ("slab", WHITE, .7),
        ("rail", RAIL, .45), ("glass", GLASS, .2), ("white", WHITE, .55),
        ("hedge", HEDGE, .85), ("lawn", LAWN, .9), ("brick", BRICK, .8),
        ("asphalt", ASPHALT, .92), ("trunk", TRUNK, .85), ("frond", FROND, .8),
        ("dark", DARK, .7),
    ):
        M.material(n, lin(c), rough=r)
    M.material("sign", (1, 1, 1), rough=.4, textured=True, emissive=.16)
    mats = {
        "wall": "wall", "recess": "recess", "slab": "slab",
        "rail": "rail", "glass": "glass", "fin": "wall",
    }

    # North to south. +v is west (ocean). The entrance photo looks at the east face.
    BF = Frame((-8032.0, -6758.0), (-8014.0, -6666.0), O)
    hv = 11.0
    L = BF.L
    top = balcony_wing(M, BF, 0, L, hv, GF, 7, FH, 4.6, mats, depth=1.7, faces=(-1, 1))
    for lod in (0, 1):
        obox(M.mesh(lod, "wall"), BF, -0.3, L + 0.3, -hv - 0.2, hv + 0.2, top - 0.05, top + 1.3)
        # lower white wings at each end, the masses beside the banded bar
        obox(M.mesh(lod, "white"), BF, -14, 2, -hv - 6, -hv + 2, GF, GF + 7.2)
        obox(M.mesh(lod, "white"), BF, L - 2, L + 16, -hv - 6, -hv + 2, GF, GF + 7.2)

    # centre entrance on the east face, and the wordmark above the doors
    png = logo_png()
    door_u0, door_u1 = L * 0.42, L * 0.58
    vquad(M.mesh(0, "dark"), BF, door_u0, door_u1, -hv - 0.15, GF, GF + 3.4, -1)
    vquad(M.mesh(1, "dark"), BF, door_u0, door_u1, -hv - 0.1, GF, GF + 3.2, -1)
    # right half of the texture is the wordmark. From the east, south is on the left.
    # right half of the texture. From the east, south is on the left, so u=0.5
    # (the left edge of that half) lands on the south end of the quad.
    vquad(M.mesh(0, "sign"), BF, L * 0.44, L * 0.56, -hv - 0.28, GF + 3.6, GF + 5.3, -1,
          uvs=((1, 1), (0.5, 1), (0.5, 0), (1, 0)))
    vquad(M.mesh(1, "sign"), BF, L * 0.43, L * 0.57, -hv - 0.22, GF + 3.5, GF + 5.4, -1,
          uvs=((1, 1), (0.5, 1), (0.5, 0), (1, 0)))

    # two monument signs flanking the drive. Left half of the texture is the M.
    face = -hv - 22.0
    for u0, lods in ((L * 0.08, (0, 1)), (L * 0.72, (0, 1))):
        u1 = u0 + L * 0.16
        for lod in lods:
            obox(M.mesh(lod, "white"), BF, u0, u1, face - 0.45, face + 0.45, 0.15, 2.7)
        vquad(M.mesh(0, "sign"), BF, u0 + 0.3, u1 - 0.3, face - 0.55, 0.35, 2.5, -1,
              uvs=((0.5, 1), (0, 1), (0, 0), (0.5, 0)))
        vquad(M.mesh(1, "sign"), BF, u0 + 0.2, u1 - 0.2, face - 0.5, 0.3, 2.55, -1,
              uvs=((0.5, 1), (0, 1), (0, 0), (0.5, 0)))
        obox(M.mesh(0, "hedge"), BF, u0 - 0.4, u1 + 0.4, face + 0.6, face + 2.2, 0.15, 0.9)

    hquad(M.mesh(0, "brick"), BF, L * 0.28, L * 0.72, face + 1.0, -hv - 1.5, 0.12)
    hquad(M.mesh(1, "brick"), BF, L * 0.3, L * 0.7, face + 1.2, -hv - 2, 0.1)
    hquad(M.mesh(0, "asphalt"), BF, -6, L + 8, face - 14, face - 1.2, 0.08)
    hquad(M.mesh(1, "asphalt"), BF, -4, L + 6, face - 12, face - 1.5, 0.08)
    hquad(M.mesh(0, "lawn"), BF, -8, L * 0.22, -hv - 4, face + 1, 0.14)
    hquad(M.mesh(0, "lawn"), BF, L * 0.78, L + 10, -hv - 4, face + 1, 0.14)

    for u, v, h, spin, reach in (
        (6, -hv - 8, 14, 0.2, 3.4), (14, -hv - 14, 16, 1.0, 4.2),
        (22, -hv - 6, 12, 0.6, 3.2), (L * 0.3, -hv - 16, 15, 1.3, 4.6),
        (L * 0.38, face - 4, 13, 0.4, 3.8), (L * 0.62, face - 5, 14, 1.1, 4.0),
        (L * 0.7, -hv - 15, 16, 0.8, 4.4), (L - 18, -hv - 7, 13, 0.5, 3.3),
        (L - 8, -hv - 13, 15, 1.5, 4.1), (L + 4, face - 3, 12, 0.9, 3.6),
        (-6, face - 2, 14, 0.3, 3.8), (L * 0.5, face - 8, 11, 1.2, 3.0),
        (L * 0.18, face + 3, 10, 0.7, 4.8), (L * 0.84, face + 4, 11, 1.6, 5.0),
    ):
        palm(M, BF, u, v, h, spin, reach)

    fold_body(M, keep={"sign", "glass"})
    info = write_glb(M, HERO / "marriott.glb", images=[png_bytes(png)])
    check_glb(HERO / "marriott.glb")
    mid = BF.p(L * 0.5, -hv - 1, 8)
    mon = BF.p(L * 0.16, face, 1.5)
    print("marriott", info)
    print("entrance world", round(O[0] + mid[0], 1), round(O[1] + mid[2], 1))
    print("monument world", round(O[0] + mon[0], 1), round(O[1] + mon[2], 1))
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    if not (1800 <= info["lod0"] <= 7000):
        print("WARN lod0", info["lod0"])
    patch(info)
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "marriott"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = block.replace(
        '"status": "v3-procedural (OSM footprint, photo/brand refs)"',
        '"status": "v4-grokbot (white banded wing, red M monuments)"',
        1,
    )
    block = re.sub(r'"marriott_lod0": \d+', f'"marriott_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"marriott_lod1": \d+', f'"marriott_lod1": {info["lod1"]}', block, count=1)
    block = block.replace('"textures": 2', '"textures": 1', 1)
    new = (
        '"ref_sources": "Entrance photo in refs/places/palm-eagle-beach/marriott '
        '(white mid-rise, dark balcony bands, Marriott wordmark, two monument signs '
        'with a red M, paver drive, palms and hedges). OSM footprint. Sign is drawn. '
        'Built by tools/grokbot/marriott.py"'
    )
    block2, n = re.subn(r'"ref_sources": "[^"]*"', new, block, count=1)
    if n != 1:
        raise SystemExit("marriott ref anchor missing")
    block = block2.replace(
        "generated by /workspace/landmarks/gen.mjs",
        "generated by tools/grokbot/marriott.py",
        1,
    )
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == "marriott")
    assert hit["tris"]["marriott_lod0"] == info["lod0"]
    assert hit["tris"]["marriott_lod1"] == info["lod1"]


if __name__ == "__main__":
    build()
