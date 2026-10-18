#!/usr/bin/env python3
"""Holiday Inn Resort Aruba: three white balcony towers, a lime pavilion, the green sign.

Same hero id and origin. The main OSM ring holds the south tower and the long
central tower, plus the entrance pavilion. The third tower is the 26 m hotel
just north of the ring: this hero already hides that footprint, so the tower
is built here instead of leaving a hole.

holidayarubaresort.com (hotel-exterior, resort-exterior, exterior-night):
white walls, lime-green balcony bands, terracotta hip roofs, and a lime
checkerboard pavilion with a green gable and the Holiday Inn mark. The mark
is drawn (green H, purple wordmark). Nothing is a pasted photograph.
"""
import json
import re
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, write_glb  # noqa: E402
from hotelkit import (  # noqa: E402
    FONT_SANS, FONT_SERIF, Frame, balcony_wing, hip_roof, obox, png_bytes, tri_out, vquad,
)

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-8125.57, -6228.73)

WHITE = (0.95, 0.94, 0.91)
SH = (0.84, 0.82, 0.78)
RAIL = (0.93, 0.94, 0.93)
GLASS = (0.16, 0.22, 0.28)
TILE = (0.62, 0.26, 0.18)
LIME = (0.70, 0.86, 0.28)
LIME_P = (0.86, 0.92, 0.58)
LIME_D = (0.28, 0.48, 0.16)
DARK = (0.22, 0.24, 0.26)

GF = 4.0
FH = 3.12


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def tower(M, mats, a, b, hv, floors, bay=3.7):
    F = Frame(a, b, O)
    top = balcony_wing(M, F, 0, F.L, hv, GF, floors, FH, bay, mats, depth=1.45)
    for lod in (0, 1):
        # terracotta hip, the roof in the hotel's own aerial
        hip_roof(M.mesh(lod, "tile"), F, -1.1, F.L + 1.1, -hv - 1.3, hv + 1.3, top - 0.05, 3.6)
    return F, top


def gable(mesh, F, u0, u1, v0, v1, y, rise):
    """Ridge runs east-west so the street (the v0 end) sees a triangle."""
    um = (u0 + u1) / 2
    ne, se = F.p(u0, v0, y), F.p(u1, v0, y)
    sw, nw = F.p(u1, v1, y), F.p(u0, v1, y)
    re_, rw = F.p(um, v0, y + rise), F.p(um, v1, y + rise)
    cen = F.p(um, (v0 + v1) / 2, y - 6)
    tri_out(mesh, ne, se, re_, cen)
    tri_out(mesh, sw, nw, rw, cen)
    tri_out(mesh, nw, ne, re_, cen)
    tri_out(mesh, nw, re_, rw, cen)
    tri_out(mesh, se, sw, rw, cen)
    tri_out(mesh, se, rw, re_, cen)


def logo_png():
    """Drawn Holiday Inn mark: green H block and a purple wordmark. Not a photo."""
    w, h = 720, 220
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    dr.rectangle((0, 0, 220, h), fill=(0, 132, 61, 255))
    fh = ImageFont.truetype(FONT_SERIF, 168)
    bb = fh.getbbox("H")
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    dr.text(((220 - tw) / 2 - bb[0], (h - th) / 2 - bb[1] - 8), "H", font=fh, fill=(255, 255, 255, 255))
    dr.rectangle((220, 0, w, h), fill=(92, 42, 140, 255))
    f1 = ImageFont.truetype(FONT_SANS, 64)
    f2 = ImageFont.truetype(FONT_SANS, 40)
    dr.text((248, 42), "Holiday Inn", font=f1, fill=(255, 255, 255, 255))
    dr.text((248, 124), "Resort", font=f2, fill=(255, 255, 255, 255))
    return im


def build():
    M = Model("holidayinn")
    for n, c, r in (
        ("wall", WHITE, .82), ("recess", SH, .9), ("slab", WHITE, .7),
        ("rail", RAIL, .45), ("glass", GLASS, .2), ("tile", TILE, .8),
        ("lime", LIME, .65), ("limep", LIME_P, .6), ("limed", LIME_D, .75),
        ("dark", DARK, .9),
    ):
        M.material(n, lin(c), rough=r)
    M.material("sign", (1, 1, 1), rough=.4, textured=True, emissive=.18)
    # lime slabs are the balcony bands in the hotel photos; rails stay white
    mats = {"wall": "wall", "recess": "recess", "slab": "lime", "rail": "rail", "glass": "glass", "fin": "wall"}

    # central tower, north to south. +v is west (the beach).
    tower(M, mats, (-8166.0, -6224.0), (-8152.0, -6146.0), 11.0, 6, bay=3.5)
    # south tower, east-west along the beach end of the ring
    tower(M, mats, (-8184.0, -6136.0), (-8124.0, -6118.0), 9.0, 6, bay=3.6)
    # north tower, the hidden 26 m footprint just above the ring
    tower(M, mats, (-8148.8, -6304.4), (-8079.0, -6279.3), 11.5, 6, bay=4.0)

    # lime entrance pavilion between the central and north towers, street side.
    # a is north, b is south, so +u is south and -v is east (the drive).
    FP = Frame((-8128.0, -6258.0), (-8120.0, -6232.0), O)
    hv = 8.0
    L = FP.L
    wall_top = 5.35
    for lod in (0, 1):
        obox(M.mesh(lod, "limep"), FP, 0, L, -hv, hv, 0.15, wall_top)
        gable(M.mesh(lod, "limed"), FP, -0.6, L + 0.6, -hv - 1.6, hv + 0.6, wall_top - 0.15, 2.8)
        obox(M.mesh(lod, "slab"), FP, -0.15, L + 0.15, -hv - 0.2, hv + 0.15, wall_top - 0.45, wall_top - 0.05)
    # dark porte-cochere, columns, and the checkerboard on the street face
    obox(M.mesh(0, "dark"), FP, L * 0.30, L * 0.70, -hv + 0.4, hv - 1.5, 0.2, 3.25)
    for u in (L * 0.34, L * 0.46, L * 0.54, L * 0.66):
        obox(M.mesh(0, "slab"), FP, u - 0.22, u + 0.22, -hv - 0.15, -hv + 1.6, 0.15, 3.2)
    face = -hv - 0.12
    def band(u0, u1, y0, y1, cols, rows):
        du, dy = (u1 - u0) / cols, (y1 - y0) / rows
        for r in range(rows):
            for c in range(cols):
                mat = "lime" if (r + c) % 2 == 0 else "limep"
                vquad(M.mesh(0, mat), FP, u0 + c * du, u0 + (c + 1) * du, face, y0 + r * dy, y0 + (r + 1) * dy, -1)
    band(L * 0.04, L * 0.30, 0.35, 3.2, 3, 3)
    band(L * 0.70, L * 0.96, 0.35, 3.2, 3, 3)
    band(L * 0.04, L * 0.96, 3.25, wall_top - 0.15, 8, 2)
    # street sign. u increases south; from the east, south is on the left, so the
    # texture's left edge (the H) has to land on the south end of the quad.
    png = logo_png()
    vquad(M.mesh(0, "sign"), FP, L * 0.52, L * 0.94, face - 0.08, 3.45, 4.95, -1,
          uvs=((1, 1), (0, 1), (0, 0), (1, 0)))
    vquad(M.mesh(1, "sign"), FP, L * 0.50, L * 0.94, face - 0.06, 3.4, 5.0, -1,
          uvs=((1, 1), (0, 1), (0, 0), (1, 0)))

    info = write_glb(M, HERO / "holidayinn.glb", images=[png_bytes(png)])
    check_glb(HERO / "holidayinn.glb")
    print("holidayinn", info)
    if not (2800 <= info["lod0"] <= 4500):
        print("WARN lod0", info["lod0"])
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    patch(info)
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "holidayinn"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = block.replace('"status": "v3-procedural (OSM footprint, photo/brand refs)"',
                           '"status": "v4-grokbot (three white towers, lime pavilion)"', 1)
    block = re.sub(r'"holidayinn_lod0": \d+', f'"holidayinn_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"holidayinn_lod1": \d+', f'"holidayinn_lod1": {info["lod1"]}', block, count=1)
    block = block.replace('"textures": 2', '"textures": 1', 1)
    new = ('"ref_sources": "holidayarubaresort.com hotel-exterior, resort-exterior and exterior-night '
           '(white towers, lime balcony bands, red hip roofs, lime checkerboard pavilion, green gable, '
           'Holiday Inn mark). Esri aerial for the footprint, including the 26 m tower this hero hides '
           'just north of the ring. Sign and tiles are drawn. Built by tools/grokbot/holidayinn.py"')
    block2, n = re.subn(r'"ref_sources": "[^"]*"', new, block, count=1)
    if n != 1:
        raise SystemExit("holidayinn ref anchor missing")
    block = block2
    block = block.replace("generated by /workspace/landmarks/gen.mjs",
                           "generated by tools/grokbot/holidayinn.py", 1)
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == "holidayinn")
    assert hit["tris"]["holidayinn_lod0"] == info["lod0"]
    assert hit["tris"]["holidayinn_lod1"] == info["lod1"]


if __name__ == "__main__":
    build()
