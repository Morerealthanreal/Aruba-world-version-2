#!/usr/bin/env python3
"""Hilton Aruba Caribbean Resort & Casino.

Same hero id and origin. The street face is the dusk photo on hiltonaruba.com
(20161214_hilton_1097): a pale beige slab, a white Hilton wordmark with
ARUBA CARIBBEAN / RESORT & CASINO under it, a narrow window slit on the south
side of that face, and a purple pyramid porte-cochere. The ocean balconies
(hiltonaruba.com balcony photos) are white slabs with deep-blue rails. The
beach restaurant is the olive pavilion over green water, with yellow chairs
and globe lights.

The Commons Palm Beach panorama does not label this tower. The wordmark photo
does. The mark is drawn. Nothing is a pasted photograph.
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
O = (-8295.39, -5327.6)

BEIGE = (0.90, 0.88, 0.83)
BEIGE_SH = (0.78, 0.76, 0.71)
WHITE = (0.95, 0.94, 0.92)
RAIL = (0.08, 0.24, 0.52)
GLASS = (0.16, 0.22, 0.28)
PURPLE = (0.55, 0.28, 0.78)
WOOD = (0.52, 0.36, 0.22)
OLIVE = (0.40, 0.44, 0.20)
OLIVE_D = (0.28, 0.32, 0.14)
YELLOW = (0.93, 0.78, 0.16)
WATER = (0.12, 0.42, 0.36)
LAWN = (0.22, 0.48, 0.18)
ASPHALT = (0.10, 0.11, 0.12)
CURB = (0.82, 0.82, 0.80)
SAND = (0.86, 0.78, 0.58)
TRUNK = (0.40, 0.26, 0.14)
FROND = (0.12, 0.38, 0.16)
HEDGE = (0.14, 0.36, 0.16)
WARM = (1.0, 0.78, 0.42)
COOL = (0.85, 0.90, 1.0)

FH = 3.15
GF = 0.45


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def hquad(mesh, F, u0, u1, v0, v1, y):
    A, B = F.p(u0, v0, y), F.p(u1, v0, y)
    C, D = F.p(u1, v1, y), F.p(u0, v1, y)
    cen = F.p((u0 + u1) / 2, (v0 + v1) / 2, y - 1)
    tri_out(mesh, A, B, C, cen)
    tri_out(mesh, A, C, D, cen)


def pyramid(mesh, F, u0, u1, v0, v1, y, rise):
    um, vm = (u0 + u1) / 2, (v0 + v1) / 2
    apex = F.p(um, vm, y + rise)
    base = [F.p(u0, v0, y), F.p(u1, v0, y), F.p(u1, v1, y), F.p(u0, v1, y)]
    cen = F.p(um, vm, y - 4)
    for i in range(4):
        tri_out(mesh, base[i], base[(i + 1) % 4], apex, cen)


def palm(M, F, u, v, h=12.0, spin=0.0, y0=0.2):
    obox(M.mesh(0, "trunk"), F, u - 0.22, u + 0.22, v - 0.22, v + 0.22, y0, y0 + h * 0.55)
    obox(M.mesh(0, "trunk"), F, u - 0.14, u + 0.14, v - 0.14, v + 0.14, y0 + h * 0.48, y0 + h)
    crown, cen = F.p(u, v, y0 + h + 0.2), F.p(u, v, y0 + h - 3)
    mesh = M.mesh(0, "frond")
    for i in range(8):
        a = i * math.tau / 8 + spin
        reach = 3.4 + (i % 3) * 0.85
        tri_out(mesh, crown,
                F.p(u + math.cos(a) * reach * 0.35, v + math.sin(a) * reach * 0.35, y0 + h + 0.1),
                F.p(u + math.cos(a) * reach, v + math.sin(a) * reach, y0 + h - 1.6 - (i % 2) * 0.6),
                cen)


def logo_png():
    """Drawn Hilton wordmark. Not a photograph of the sign."""
    w, h = 960, 520
    im = Image.new("RGBA", (w, h), (206, 202, 192, 255))
    dr = ImageDraw.Draw(im)
    f1 = ImageFont.truetype(FONT_SERIF, 188)
    f2 = ImageFont.truetype(FONT_SANS, 42)
    f3 = ImageFont.truetype(FONT_SANS, 38)
    lines = (("Hilton", f1, 48), ("ARUBA CARIBBEAN", f2, 290), ("RESORT & CASINO", f3, 360))
    for text, font, y in lines:
        tw = font.getlength(text)
        dr.text(((w - tw) / 2, y), text, font=font, fill=(255, 255, 255, 255))
    return im


def build():
    M = Model("hilton")
    for n, c, r in (
        ("wall", BEIGE, .84), ("recess", BEIGE_SH, .9), ("slab", WHITE, .7),
        ("rail", RAIL, .4), ("glass", GLASS, .2), ("white", WHITE, .55),
        ("purple", PURPLE, .25), ("wood", WOOD, .75),
        ("olive", OLIVE, .7), ("olived", OLIVE_D, .8), ("yellow", YELLOW, .55),
        ("water", WATER, .25), ("lawn", LAWN, .9), ("sand", SAND, .92), ("asphalt", ASPHALT, .92),
        ("curb", CURB, .7), ("trunk", TRUNK, .85), ("frond", FROND, .8),
        ("hedge", HEDGE, .85), ("dark", (0.14, 0.14, 0.15), .6),
    ):
        M.material(n, lin(c), rough=r)
    # "sign" ramps more gently than signglow, so the white letters stay readable at noon.
    M.material("sign", (1, 1, 1), rough=.4, textured=True, emissive=.22)
    M.material("bulb", lin(WARM), rough=.3, emissive=.9)
    M.material("bulbcan", lin(COOL), rough=.3, emissive=.7)
    mats = {
        "wall": "wall", "recess": "recess", "slab": "slab",
        "rail": "rail", "glass": "glass", "fin": "rail",
    }

    # Beach wing, north to south. +v is west, the ocean. Balconies only there:
    # the street face of this bar is a plain wall, matching the blank slab
    # you see from the boulevard beside the wordmark.
    BF = Frame((-8322.0, -5386.0), (-8306.0, -5276.0), O)
    hv = 8.2
    top = balcony_wing(M, BF, 0, BF.L, hv, GF, 8, FH, 4.2, mats, depth=1.55, faces=(1,))
    for lod in (0, 1):
        obox(M.mesh(lod, "wall"), BF, -0.4, BF.L + 0.4, -hv - 0.3, hv + 0.5, top - 0.05, top + 1.1)

    # Street sign tower. a is north, b is south, so -v is east (the boulevard).
    SF = Frame((-8276.0, -5326.0), (-8260.0, -5302.0), O)
    sh, sL = 7.2, SF.L
    tower_top = 26.4
    for lod in (0, 1):
        obox(M.mesh(lod, "wall"), SF, 0, sL, -sh, sh, GF, tower_top)
        obox(M.mesh(lod, "slab"), SF, -0.3, sL + 0.3, -sh - 0.25, sh + 0.25, tower_top - 0.1, tower_top + 0.7)
    # narrow window slit on the south of the east face (left of the wordmark
    # when you look west from the drive)
    vquad(M.mesh(0, "glass"), SF, sL * 0.78, sL * 0.86, -sh - 0.08, 6.5, 23.5, -1)
    vquad(M.mesh(1, "glass"), SF, sL * 0.76, sL * 0.88, -sh - 0.06, 6.2, 23.8, -1)
    png = logo_png()
    # u increases south. From the east, south is on the left, so the texture's
    # left edge has to land on the south end of the quad.
    vquad(M.mesh(0, "sign"), SF, sL * 0.10, sL * 0.72, -sh - 0.16, 14.6, 23.4, -1,
          uvs=((1, 1), (0, 1), (0, 0), (1, 0)))
    vquad(M.mesh(1, "sign"), SF, sL * 0.08, sL * 0.74, -sh - 0.12, 14.4, 23.6, -1,
          uvs=((1, 1), (0, 1), (0, 0), (1, 0)))

    # lower white wing north of the sign slab, the mass beside the tower
    for lod in (0, 1):
        obox(M.mesh(lod, "wall"), SF, -16.0, 0.4, -sh + 0.4, sh - 0.4, GF, 9.2)
        obox(M.mesh(lod, "slab"), SF, -16.4, 0.6, -sh + 0.1, sh - 0.1, 9.05, 9.7)

    # purple pyramid porte-cochere, east of the wordmark. Columns, not walls,
    # so the drive sees through to the lit ceiling the way the dusk photo does.
    cu0, cu1 = sL * 0.16, sL * 0.84
    cv0, cv1 = -sh - 15.5, -sh - 1.0
    wall_top = 5.6
    col = 0.85
    for lod in (0, 1):
        for u0, v0 in ((cu0, cv0), (cu1 - col, cv0), (cu0, cv1 - col), (cu1 - col, cv1 - col)):
            obox(M.mesh(lod, "white"), SF, u0, u0 + col, v0, v0 + col, GF + 1.05, wall_top)
            obox(M.mesh(lod, "wood"), SF, u0 - 0.06, u0 + col + 0.06, v0 - 0.06, v0 + col + 0.06, GF, GF + 1.15)
        obox(M.mesh(lod, "white"), SF, cu0, cu1, cv0, cv0 + 0.55, wall_top - 0.7, wall_top)
        obox(M.mesh(lod, "white"), SF, cu0, cu1, cv1 - 0.55, cv1, wall_top - 0.7, wall_top)
        obox(M.mesh(lod, "white"), SF, cu0, cu0 + 0.55, cv0, cv1, wall_top - 0.7, wall_top)
        obox(M.mesh(lod, "white"), SF, cu1 - 0.55, cu1, cv0, cv1, wall_top - 0.7, wall_top)
        obox(M.mesh(lod, "slab"), SF, cu0 - 0.5, cu1 + 0.5, cv0 - 0.6, cv1 + 0.35, wall_top - 0.2, wall_top + 0.2)
    for k in range(7):
        u = cu0 + 1.1 + k * (cu1 - cu0 - 2.2) / 6
        obox(M.mesh(0, "white"), SF, u - 0.07, u + 0.07, cv0 + 0.7, cv1 - 0.7, wall_top - 0.7, wall_top - 0.42)
    obox(M.mesh(0, "bulbcan"), SF, cu0 + 1.4, cu1 - 1.4, cv0 + 1.6, cv1 - 1.4, wall_top - 0.28, wall_top - 0.1)
    # solid purple, not a night-ramped bulb: the day shot was washing it out pink
    pyramid(M.mesh(0, "purple"), SF, cu0 - 0.15, cu1 + 0.15, cv0 - 0.35, cv1 + 0.25, wall_top + 0.15, 7.2)
    pyramid(M.mesh(1, "purple"), SF, cu0, cu1, cv0 - 0.2, cv1 + 0.15, wall_top + 0.1, 6.8)

    # low link so the beach wing and the sign tower read as one resort
    for lod in (0, 1):
        obox(M.mesh(lod, "wall"), SF, sL * 0.15, sL * 0.85, sh - 1.0, 34.0, GF, 7.4)
        obox(M.mesh(lod, "slab"), SF, sL * 0.1, sL * 0.9, sh - 1.2, 34.2, 7.25, 7.9)

    # arrival court: asphalt, curb, lawn, hedges, palms
    hquad(M.mesh(0, "asphalt"), SF, -8, sL + 10, -sh - 28, -sh - 13.5, 0.12)
    hquad(M.mesh(1, "asphalt"), SF, -8, sL + 10, -sh - 28, -sh - 13.5, 0.12)
    hquad(M.mesh(0, "curb"), SF, -8, sL + 10, -sh - 13.6, -sh - 12.8, 0.22)
    hquad(M.mesh(0, "lawn"), SF, -22, -6, -sh - 30, -sh - 14, 0.16)
    hquad(M.mesh(0, "lawn"), SF, sL + 4, sL + 22, -sh - 32, -sh - 12, 0.16)
    hquad(M.mesh(1, "lawn"), SF, -18, sL + 16, -sh - 30, -sh - 14, 0.14)
    for u, v, w, d in (
        (-12, -sh - 16, 6.5, 1.4), (-4, -sh - 12.2, 4.0, 1.2),
        (sL + 6, -sh - 15, 7.0, 1.5), (sL * 0.4, -sh - 11.5, 3.2, 1.1),
    ):
        obox(M.mesh(0, "hedge"), SF, u, u + w, v, v + d, 0.2, 1.35)
    for u, v, h, spin in (
        (-16, -sh - 17, 15.5, 0.2), (-10, -sh - 23, 13.5, 1.1),
        (-6, -sh - 14, 12.0, 0.5), (-1, -sh - 20, 14.0, 1.6),
        (sL + 2, -sh - 18, 13.0, 0.4), (sL + 7, -sh - 24, 16.0, 0.9),
        (sL + 12, -sh - 15, 14.5, 1.4), (sL + 16, -sh - 21, 12.5, 0.7),
        (sL * 0.15, -sh - 22, 12.5, 0.3), (-20, -sh - 28, 13.0, 1.8),
        (4, -sh - 27, 12.0, 0.6), (sL + 20, -sh - 28, 11.5, 1.2),
    ):
        palm(M, SF, u, v, h, spin)

    # olive lagoon restaurant on the beach side of the south half of the wing
    # +v is west. The pavilion sits just off the balcony face.
    lu0, lu1 = BF.L * 0.55, BF.L * 0.92
    lv0, lv1 = hv + 3.5, hv + 18.0
    deck_y, roof_y = 0.85, 4.15
    for lod in (0, 1):
        hquad(M.mesh(lod, "water"), BF, lu0 - 2, lu1 + 3, hv + 1.5, lv1 + 4, 0.08)
        obox(M.mesh(lod, "wood"), BF, lu0, lu1, lv0, lv1, 0.35, deck_y)
        obox(M.mesh(lod, "olive"), BF, lu0 - 0.4, lu1 + 0.4, lv0 - 0.3, lv1 + 0.6, roof_y, roof_y + 0.35)
    # posts, yellow chairs, globe lights: lod0
    for u in (lu0 + 0.4, lu0 + (lu1 - lu0) * 0.33, lu0 + (lu1 - lu0) * 0.66, lu1 - 0.4):
        for v in (lv0 + 0.4, lv1 - 0.4):
            obox(M.mesh(0, "olived"), BF, u - 0.14, u + 0.14, v - 0.14, v + 0.14, deck_y, roof_y)
    for i in range(10):
        u = lu0 + 1.2 + i * (lu1 - lu0 - 2.4) / 9
        obox(M.mesh(0, "yellow"), BF, u - 0.35, u + 0.35, lv0 + 1.3, lv0 + 2.3, deck_y, deck_y + 0.85)
        obox(M.mesh(0, "yellow"), BF, u - 0.35, u + 0.35, lv1 - 2.5, lv1 - 1.5, deck_y, deck_y + 0.85)
    for i in range(4):
        u = lu0 + 2 + i * (lu1 - lu0 - 4) / 3
        obox(M.mesh(0, "white"), BF, u - 0.7, u + 0.7, (lv0 + lv1) / 2 - 0.7, (lv0 + lv1) / 2 + 0.7,
             deck_y, deck_y + 0.55)
    for i in range(6):
        u = lu0 + 1.5 + i * (lu1 - lu0 - 3) / 5
        obox(M.mesh(0, "bulb"), BF, u - 0.28, u + 0.28, lv0 + 2.8, lv0 + 3.4, roof_y - 0.85, roof_y - 0.25)
    # glass front of the restaurant, toward the wing
    vquad(M.mesh(0, "glass"), BF, lu0 + 0.4, lu1 - 0.4, lv0 + 0.3, deck_y, roof_y - 0.1, -1)

    # sand in front of the lagoon, where the beach photo looks across the water
    hquad(M.mesh(0, "sand"), BF, lu0 - 6, lu1 + 8, lv1 + 3.5, lv1 + 18, 0.1)
    hquad(M.mesh(1, "sand"), BF, lu0 - 4, lu1 + 6, lv1 + 3.5, lv1 + 16, 0.1)
    # a strip of lawn between the wing and the lagoon
    hquad(M.mesh(0, "lawn"), BF, BF.L * 0.15, BF.L * 0.52, hv + 0.4, hv + 8, 0.18)
    hquad(M.mesh(1, "lawn"), BF, 4, BF.L - 4, hv + 0.4, hv + 6, 0.16)
    for u, spin in ((18, 0.4), (36, 1.2), (52, 0.7), (BF.L * 0.48, 1.5)):
        palm(M, BF, u, hv + 5.5, 11.5, spin, 0.2)

    fold_body(M, keep={"sign", "glass", "bulb", "bulbcan"})
    info = write_glb(M, HERO / "hilton.glb", images=[png_bytes(png)])
    check_glb(HERO / "hilton.glb")
    paint_emissive(HERO / "hilton.glb", {
        "bulb": [1.0, 0.62, 0.22],
        "bulbcan": [0.75, 0.84, 1.0],
        "sign": [0.85, 0.85, 0.82],
    })
    print("hilton", info)
    face = SF.p(sL * 0.4, -sh - 0.2, 18)
    canopy = SF.p((cu0 + cu1) / 2, (cv0 + cv1) / 2, 3)
    beach = BF.p(BF.L * 0.7, hv + 10, 6)
    print("sign world", round(O[0] + face[0], 1), round(O[1] + face[2], 1))
    print("canopy world", round(O[0] + canopy[0], 1), round(O[1] + canopy[2], 1))
    print("beach world", round(O[0] + beach[0], 1), round(O[1] + beach[2], 1))
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    if not (1600 <= info["lod0"] <= 7000):
        print("WARN lod0", info["lod0"])
    patch(info)
    return info


def paint_emissive(path, colors):
    import struct
    data = Path(path).read_bytes()
    o = 12
    js = None
    chunks = []
    while o < len(data) - 8:
        ln, ct = struct.unpack_from("<II", data, o)
        o += 8
        raw = data[o:o + ln]
        o += ln
        chunks.append((ct, raw))
        if ct == 0x4E4F534A:
            js = json.loads(raw)
    hit = set()
    for mat in js["materials"]:
        if mat.get("name") in colors:
            mat["emissiveFactor"] = colors[mat["name"]]
            hit.add(mat["name"])
    missing = set(colors) - hit
    if missing:
        raise SystemExit(f"emissive materials missing: {missing}")
    js_bytes = json.dumps(js, separators=(",", ":")).encode()
    js_bytes += b" " * ((4 - len(js_bytes) % 4) % 4)
    body = b""
    for ct, raw in chunks:
        raw = js_bytes if ct == 0x4E4F534A else raw
        body += struct.pack("<II", len(raw), ct) + raw
    Path(path).write_bytes(b"glTF" + struct.pack("<II", 2, 12 + len(body)) + body)


def patch(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "hilton"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = block.replace(
        '"status": "v3-procedural (OSM footprint, photo/brand refs)"',
        '"status": "v4-grokbot (beige sign tower, purple pyramid, blue beach rails)"',
        1,
    )
    block = re.sub(r'"hilton_lod0": \d+', f'"hilton_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"hilton_lod1": \d+', f'"hilton_lod1": {info["lod1"]}', block, count=1)
    block = block.replace('"textures": 2', '"textures": 1', 1)
    new = (
        '"ref_sources": "hiltonaruba.com gallery 20161214_hilton_1097 (beige street slab, '
        'white Hilton wordmark, window slit, purple pyramid porte-cochere) and balcony / lagoon '
        'photos (blue rails, olive pavilion, yellow chairs, globe lights). OSM footprint and '
        'height 22.9-27 m. Sign is drawn. Built by tools/grokbot/hilton.py"'
    )
    block2, n = re.subn(r'"ref_sources": "[^"]*"', new, block, count=1)
    if n != 1:
        raise SystemExit("hilton ref anchor missing")
    block = block2.replace(
        "generated by /workspace/landmarks/gen.mjs",
        "generated by tools/grokbot/hilton.py",
        1,
    )
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == "hilton")
    assert hit["tris"]["hilton_lod0"] == info["lod0"]
    assert hit["tris"]["hilton_lod1"] == info["lod1"]


if __name__ == "__main__":
    build()
