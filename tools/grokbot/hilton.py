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
    im = Image.new("RGBA", (w, h), (198, 194, 184, 255))
    dr = ImageDraw.Draw(im)
    f1 = ImageFont.truetype(FONT_SERIF, 220)
    f2 = ImageFont.truetype(FONT_SANS, 48)
    f3 = ImageFont.truetype(FONT_SANS, 42)
    lines = (("Hilton", f1, 36), ("ARUBA CARIBBEAN", f2, 300), ("RESORT & CASINO", f3, 378))
    for text, font, y in lines:
        tw = font.getlength(text)
        x = (w - tw) / 2
        dr.text((x + 3, y + 3), text, font=font, fill=(70, 68, 62, 255))
        dr.text((x, y), text, font=font, fill=(255, 255, 255, 255))
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
    # Most of the east face, so the wordmark reads from the arrival drive.
    vquad(M.mesh(0, "sign"), SF, sL * 0.06, sL * 0.70, -sh - 0.22, 12.2, 24.6, -1,
          uvs=((1, 1), (0, 1), (0, 0), (1, 0)))
    vquad(M.mesh(1, "sign"), SF, sL * 0.04, sL * 0.72, -sh - 0.16, 12.0, 24.8, -1,
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

    # Arrival court. Thick pads sit above the sand so the drive is asphalt, not dirt.
    # The drive bows, the way the dusk photo curves in front of the pyramid.
    for lod in (0, 1):
        obox(M.mesh(lod, "asphalt"), SF, -28, sL + 36, -sh - 62, -sh - 10, 0.0, 0.22)
        obox(M.mesh(lod, "lawn"), SF, -36, -6, -sh - 58, -sh - 8, 0.02, 0.26)
        obox(M.mesh(lod, "lawn"), SF, sL + 8, sL + 42, -sh - 60, -sh - 8, 0.02, 0.26)
    # curved lip of the drive: a fan of curb segments
    for i in range(14):
        t = i / 13
        u = -6 + t * (sL + 18)
        bow = 4.2 * math.sin(t * math.pi)
        obox(M.mesh(0, "curb"), SF, u, u + (sL + 24) / 13, -sh - 16.5 - bow, -sh - 14.6 - bow, 0.18, 0.36)
        obox(M.mesh(0, "asphalt"), SF, u - 1, u + (sL + 24) / 13, -sh - 28, -sh - 15.2 - bow, 0.16, 0.28)
    for u, v, w, d in (
        (-18, -sh - 20, 8.0, 2.2), (-8, -sh - 14, 5.5, 1.6),
        (sL + 4, -sh - 18, 9.0, 2.0), (sL * 0.35, -sh - 12.4, 4.2, 1.4),
        (sL + 16, -sh - 28, 7.0, 1.8), (-24, -sh - 32, 6.0, 1.6),
    ):
        obox(M.mesh(0, "hedge"), SF, u, u + w, v, v + d, 0.26, 1.15)
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
    lu0, lu1 = BF.L * 0.42, BF.L * 0.96
    lv0, lv1 = hv + 2.2, hv + 22.0
    deck_y, roof_y = 0.9, 4.35
    for lod in (0, 1):
        obox(M.mesh(lod, "water"), BF, lu0 - 8, lu1 + 10, hv + 0.4, lv1 + 16, -0.05, 0.16)
        obox(M.mesh(lod, "wood"), BF, lu0, lu1, lv0, lv1, 0.2, deck_y)
        obox(M.mesh(lod, "olive"), BF, lu0 - 1.2, lu1 + 1.2, lv0 - 0.6, lv1 + 1.4, roof_y, roof_y + 0.42)
        obox(M.mesh(lod, "olived"), BF, lu0 - 0.2, lu1 + 0.2, lv0, lv1 + 0.4, roof_y - 0.55, roof_y - 0.28)
    # posts, yellow chairs, truss, globe lights
    for u in (lu0 + 0.5, lu0 + (lu1 - lu0) * 0.33, lu0 + (lu1 - lu0) * 0.66, lu1 - 0.5):
        for v in (lv0 + 0.5, (lv0 + lv1) / 2, lv1 - 0.5):
            obox(M.mesh(0, "olived"), BF, u - 0.16, u + 0.16, v - 0.16, v + 0.16, deck_y, roof_y)
    span = lu1 - lu0
    for i in range(9):
        u = lu0 + 1.5 + i * (span - 3) / 8
        obox(M.mesh(0, "olived"), BF, u - 0.07, u + 0.07, lv0 + 0.8, lv1 - 0.4, roof_y - 0.5, roof_y - 0.22)
        # diagonal brace in the frame
        A = BF.p(u, lv0 + 1.2, roof_y - 0.45)
        B = BF.p(u + span / 10, lv0 + 6.5, roof_y - 0.45)
        C = BF.p(u + span / 10, lv0 + 6.5, roof_y - 0.22)
        D = BF.p(u, lv0 + 1.2, roof_y - 0.22)
        tri_out(M.mesh(0, "olived"), A, B, C, BF.p(u, lv0, roof_y - 2))
        tri_out(M.mesh(0, "olived"), A, C, D, BF.p(u, lv0, roof_y - 2))
    for i in range(16):
        u = lu0 + 1.0 + i * (span - 2) / 15
        obox(M.mesh(0, "yellow"), BF, u - 0.32, u + 0.32, lv1 - 2.6, lv1 - 1.55, deck_y, deck_y + 0.9)
        if i % 2 == 0:
            obox(M.mesh(0, "yellow"), BF, u - 0.32, u + 0.32, lv0 + 1.2, lv0 + 2.25, deck_y, deck_y + 0.9)
            obox(M.mesh(0, "white"), BF, u - 0.55, u + 0.55, (lv0 + lv1) / 2 - 0.55, (lv0 + lv1) / 2 + 0.55,
                 deck_y, deck_y + 0.5)
    for i in range(14):
        u = lu0 + 1.2 + i * (span - 2.4) / 13
        obox(M.mesh(0, "bulb"), BF, u - 0.22, u + 0.22, lv1 - 1.15, lv1 - 0.55, roof_y - 1.25, roof_y - 0.62)
    vquad(M.mesh(0, "glass"), BF, lu0 + 0.6, lu1 - 0.6, lv0 + 0.35, deck_y + 0.15, roof_y - 0.2, -1)

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
    block = re.sub(
        r'"status": "[^"]*"',
        '"status": "v5-grokbot (Hilton wordmark, curved asphalt drive, lagoon pavilion)"',
        block,
        count=1,
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
