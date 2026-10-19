#!/usr/bin/env python3
"""Hyatt Regency Aruba Resort Spa and Casino.

Same hero id and origin. Mapillary views of the resort entrance
(refs/places/palm-eagle-beach/hyatt): a beige wing under a red tile roof,
a casino pavilion with a hip roof and vertical CASINO letters, a taller
beige tower with white-framed window strips, and a clipped hedge garden
with palms and a brown entrance sign. The letters are drawn. Nothing is
a pasted photograph. The scooter in the foreground is not part of the building.
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
    FONT_SANS, Frame, hip_roof, obox, png_bytes, tri_out, vquad,
)

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-8208.36, -5722.87)

BEIGE = (0.86, 0.78, 0.64)
BEIGE_SH = (0.72, 0.64, 0.52)
TILE = (0.64, 0.24, 0.16)
WHITE = (0.94, 0.93, 0.90)
GLASS = (0.18, 0.24, 0.30)
HEDGE = (0.12, 0.38, 0.16)
LAWN = (0.28, 0.55, 0.22)
PURPLE = (0.38, 0.16, 0.32)
YELLOW = (0.86, 0.72, 0.18)
PAVER = (0.72, 0.70, 0.66)
ROAD = (0.45, 0.44, 0.42)
BROWN = (0.36, 0.22, 0.14)
TRUNK = (0.42, 0.28, 0.16)
FROND = (0.10, 0.36, 0.14)
DARK = (0.16, 0.16, 0.18)

GF = 0.4


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def hquad(mesh, F, u0, u1, v0, v1, y):
    A, B = F.p(u0, v0, y), F.p(u1, v0, y)
    C, D = F.p(u1, v1, y), F.p(u0, v1, y)
    cen = F.p((u0 + u1) / 2, (v0 + v1) / 2, y - 1)
    tri_out(mesh, A, B, C, cen)
    tri_out(mesh, A, C, D, cen)


def palm(M, F, u, v, h=14.0, spin=0.0):
    obox(M.mesh(0, "trunk"), F, u - 0.22, u + 0.22, v - 0.22, v + 0.22, 0.1, h * 0.55)
    obox(M.mesh(0, "trunk"), F, u - 0.14, u + 0.14, v - 0.14, v + 0.14, h * 0.48, h)
    crown, cen = F.p(u, v, h + 0.2), F.p(u, v, h - 4)
    mesh = M.mesh(0, "frond")
    for i in range(7):
        a = i * math.tau / 7 + spin
        reach = 3.2 + (i % 3) * 0.8
        tri_out(mesh, crown,
                F.p(u + math.cos(a) * reach * 0.3, v + math.sin(a) * reach * 0.3, h + 0.05),
                F.p(u + math.cos(a) * reach, v + math.sin(a) * reach, h - 1.7 - (i % 2) * 0.6),
                cen)


# 1024² sheet. Left half is vertical CASINO. Right half, top band is the
# screen; the lower band is the brown entrance board. v=0 is the top.
CAS0, CAS1 = 0.0, 0.5
BILL = (0.5, 1.0, 0.0, 280 / 1024)
SIGN = (0.5, 1.0, 420 / 1024, 1.0)


def face_uvs(u_left, u_right, v_top=0.0, v_bottom=1.0):
    """East face: the left edge of this texture span lands on the south end."""
    return ((u_right, v_bottom), (u_left, v_bottom), (u_left, v_top), (u_right, v_top))


def logo_png():
    """Drawn CASINO piers, the dark screen under the arch, and the brown board."""
    w = h = 1024
    im = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    dr.rectangle((0, 0, 512, h), fill=(214, 196, 164, 255))
    font = ImageFont.truetype(FONT_SANS, 108)
    for i, ch in enumerate("CASINO"):
        tw = font.getlength(ch)
        dr.text(((512 - tw) / 2, 70 + i * 145), ch, font=font, fill=(42, 36, 30, 255))
    dr.rectangle((512, 0, w, 280), fill=(28, 22, 18, 255))
    gold = ImageFont.truetype(FONT_SANS, 72)
    small = ImageFont.truetype(FONT_SANS, 48)
    for text, y, f, col in (
        ("Players!", 48, gold, (255, 214, 70)),
        ("Never Feel Lost", 150, small, (245, 238, 226)),
    ):
        tw = f.getlength(text)
        dr.text((512 + (512 - tw) / 2, y), text, font=f, fill=col)
    dr.rectangle((512, 420, w, h), fill=(96, 58, 36, 255))
    board = ImageFont.truetype(FONT_SANS, 64)
    sub = ImageFont.truetype(FONT_SANS, 46)
    for text, y, f in (
        ("RESORT &", 470, board),
        ("CASINO", 560, board),
        ("ENTRANCE", 650, board),
        ("HYATT", 780, sub),
        ("REGENCY ARUBA", 860, sub),
    ):
        tw = f.getlength(text)
        dr.text((512 + (512 - tw) / 2, y), text, font=f, fill=(248, 242, 230, 255))
    return im


def build():
    M = Model("hyatt")
    for n, c, r in (
        ("wall", BEIGE, .84), ("recess", BEIGE_SH, .9), ("tile", TILE, .78),
        ("white", WHITE, .6), ("glass", GLASS, .22), ("hedge", HEDGE, .88),
        ("lawn", LAWN, .9), ("purple", PURPLE, .85), ("yellow", YELLOW, .7),
        ("paver", PAVER, .85), ("road", ROAD, .9), ("brown", BROWN, .7),
        ("trunk", TRUNK, .85), ("frond", FROND, .8), ("dark", DARK, .6),
    ):
        M.material(n, lin(c), rough=r)
    M.material("sign", (1, 1, 1), rough=.45, textured=True, emissive=.12)

    # North to south. +v is west (ocean). The entrance photos look at -v, the street.
    BF = Frame((-8242.0, -5774.0), (-8226.0, -5676.0), O)
    L = BF.L
    hv = 9.0
    floors, fh = 4, 3.3
    top = GF + floors * fh
    for lod in (0, 1):
        obox(M.mesh(lod, "wall"), BF, 0, L, -hv, hv, GF, top)
        hip_roof(M.mesh(lod, "tile"), BF, -1.2, L + 1.2, -hv - 1.4, hv + 1.4, top - 0.1, 3.4)
    # arched window rhythm on the street face, lod0
    bays = 22
    bay = L / bays
    for i in range(bays):
        if i in (3, 4, 10):
            continue
        u0 = i * bay + bay * 0.22
        u1 = (i + 1) * bay - bay * 0.22
        for f in range(floors):
            y0 = GF + f * fh + 0.7
            vquad(M.mesh(0, "glass"), BF, u0, u1, -hv - 0.08, y0, y0 + 1.7, -1)
            vquad(M.mesh(0, "white"), BF, u0 - 0.12, u0, -hv - 0.1, y0 - 0.1, y0 + 1.85, -1)
    # a stair and a larger arch, the entry in the hedge photos
    vquad(M.mesh(0, "glass"), BF, L * 0.22, L * 0.34, -hv - 0.2, GF + 0.4, GF + 4.2, -1)
    obox(M.mesh(0, "white"), BF, L * 0.20, L * 0.36, -hv - 3.2, -hv - 0.2, GF, GF + 0.35)
    for step in range(4):
        obox(M.mesh(0, "white"), BF, L * 0.21, L * 0.35, -hv - 6.5 + step * 0.8, -hv - 5.6 + step * 0.8,
             GF + step * 0.28, GF + 0.35 + step * 0.28)

    # taller tower at the north end (right side when you look west from the drive)
    th = 8 * 3.15
    for lod in (0, 1):
        obox(M.mesh(lod, "wall"), BF, -16, 6, -hv - 2, hv - 1, GF, GF + th)
        hip_roof(M.mesh(lod, "tile"), BF, -17, 7, -hv - 3, hv, GF + th - 0.2, 2.6)
    for col, u in enumerate((-12, -6, 0)):
        vquad(M.mesh(0, "glass"), BF, u, u + 3.2, -hv - 2.15, GF + 1.2, GF + th - 1.4, -1)
        vquad(M.mesh(0, "white"), BF, u - 0.25, u, -hv - 2.2, GF + 1.0, GF + th - 1.2, -1)

    # casino pavilion, closer to the street than the wing. Two storeys, a red
    # hip, an arched window, vertical CASINO on both piers, and a stair.
    cu0, cu1 = L * 0.42, L * 0.42 + 24
    cv0, cv1 = -hv - 24, -hv - 8
    ctop = 11.4
    mid = (cu0 + cu1) / 2
    for lod in (0, 1):
        obox(M.mesh(lod, "wall"), BF, cu0, cu1, cv0, cv1, GF, ctop)
        hip_roof(M.mesh(lod, "tile"), BF, cu0 - 1.0, cu1 + 1.0, cv0 - 1.2, cv1 + 0.8, ctop - 0.15, 3.6)
        obox(M.mesh(lod, "white"), BF, cu0 - 0.2, cu1 + 0.2, cv0 - 0.35, cv1 + 0.2, ctop - 0.55, ctop - 0.15)
    au0, au1 = mid - 3.6, mid + 3.6
    vquad(M.mesh(0, "glass"), BF, au0, au1, cv0 - 0.06, GF + 3.6, ctop - 1.5, -1)
    vquad(M.mesh(0, "glass"), BF, mid - 2.4, mid + 2.4, cv0 - 0.08, GF + 0.25, GF + 2.35, -1)
    for side in (au0 - 0.45, au1):
        obox(M.mesh(0, "white"), BF, side, side + 0.42, cv0 - 0.28, cv0 + 0.08, GF + 2.5, ctop - 2.0)
    for i in range(7):
        t = i / 6
        arch_y = (ctop - 2.7) + math.sin(t * math.pi) * 1.35
        u = au0 + t * (au1 - au0)
        obox(M.mesh(0, "white"), BF, u - 0.55, u + 0.55, cv0 - 0.32, cv0 + 0.06, arch_y, arch_y + 0.42)
    png = logo_png()
    pier = (GF + 1.6, ctop - 0.7)
    for u0, u1 in ((cu0 + 0.35, cu0 + 2.5), (cu1 - 2.5, cu1 - 0.35)):
        vquad(M.mesh(0, "sign"), BF, u0, u1, cv0 - 0.18, pier[0], pier[1], -1, uvs=face_uvs(CAS0, CAS1))
        vquad(M.mesh(1, "sign"), BF, u0 - 0.05, u1 + 0.05, cv0 - 0.12, pier[0] - 0.1, pier[1] + 0.1, -1,
              uvs=face_uvs(CAS0, CAS1))
    vquad(M.mesh(0, "sign"), BF, mid - 3.1, mid + 3.1, cv0 - 0.22, GF + 2.45, GF + 4.55, -1,
          uvs=face_uvs(*BILL))
    for step in range(6):
        obox(M.mesh(0, "white"), BF, mid - 3.2, mid + 3.2,
             cv0 - 9.2 + step * 1.15, cv0 - 7.7 + step * 1.15,
             GF + step * 0.22, GF + 0.28 + step * 0.22)
        for side in (mid - 3.45, mid + 3.15):
            obox(M.mesh(0, "white"), BF, side, side + 0.22,
                 cv0 - 8.6 + step * 1.15, cv0 - 8.15 + step * 1.15,
                 GF + 0.2 + step * 0.22, GF + 1.15 + step * 0.22)

    # brown board on the right of the garden (north), the way the street photos read
    su0, su1 = mid - 18, mid - 14.6
    sv = cv0 - 20
    for lod in (0, 1):
        obox(M.mesh(lod, "brown"), BF, su0, su1, sv - 0.18, sv + 0.28, 0.2, 2.55)
    vquad(M.mesh(0, "sign"), BF, su0 + 0.12, su1 - 0.12, sv - 0.26, 0.45, 2.55, -1, uvs=face_uvs(*SIGN))
    vquad(M.mesh(1, "sign"), BF, su0, su1, sv - 0.2, 0.35, 2.65, -1, uvs=face_uvs(*SIGN))

    # garden: lawn, brick street, an oval of clipped hedges, flower beds, palms
    hquad(M.mesh(0, "lawn"), BF, -20, L + 16, -hv - 52, -hv + 2, 0.08)
    hquad(M.mesh(1, "lawn"), BF, -12, L + 8, -hv - 46, -hv + 1, 0.08)
    hquad(M.mesh(0, "paver"), BF, -18, L + 14, -hv - 50, -hv - 42, 0.12)
    hquad(M.mesh(1, "road"), BF, -14, L + 10, -hv - 48, -hv - 42, 0.1)
    hquad(M.mesh(0, "paver"), BF, mid - 2.2, mid + 2.2, cv0 - 16, cv0 - 1, 0.14)
    uc, vc, rx, ry = mid, cv0 - 16, 18.0, 7.5
    hquad(M.mesh(0, "lawn"), BF, uc - 7, uc + 7, vc - 3.2, vc + 3.2, 0.14)
    for i in range(20):
        t = (i + 0.5) * math.tau / 20
        u = uc + math.cos(t) * rx
        v = vc + math.sin(t) * ry
        obox(M.mesh(0, "hedge"), BF, u - 1.5, u + 1.5, v - 0.7, v + 0.7, 0.16, 1.2)
        if i % 4 == 0:
            obox(M.mesh(0, "yellow"), BF, u - 0.8, u + 0.8, v - 1.5, v - 0.5, 0.16, 0.55)
    for i in range(10):
        t = math.pi * 0.15 + i * math.pi * 0.7 / 10
        u = uc + math.cos(t) * (rx * 0.55)
        v = vc + math.sin(t) * (ry * 0.45)
        obox(M.mesh(0, "hedge"), BF, u - 1.1, u + 1.1, v - 0.55, v + 0.55, 0.16, 0.95)
    obox(M.mesh(0, "purple"), BF, su0 - 1, su1 + 1, sv + 1.2, sv + 3.4, 0.16, 0.7)
    obox(M.mesh(0, "purple"), BF, cu1 + 1, cu1 + 6, cv0 - 4, cv0 - 1.5, 0.16, 0.85)
    for u, v, h, spin in (
        (-8, -hv - 6, 18, 0.2), (6, -hv - 4, 20, 1.1), (16, -hv - 12, 17, 0.4),
        (28, -hv - 7, 19, 0.8), (40, -hv - 14, 16, 1.4), (52, -hv - 5, 18, 0.6),
        (64, -hv - 11, 17, 1.0), (78, -hv - 6, 19, 0.3), (90, -hv - 13, 16, 1.6),
        (uc - 20, vc + 2, 18, 0.9), (uc - 12, vc + 6, 15, 0.5), (uc + 14, vc + 6, 16, 1.2),
        (uc + 22, vc + 1, 14, 0.7), (cu0 - 4, cv1 + 3, 13, 1.3), (cu1 + 6, cv1 + 2, 12, 0.2),
        (uc - 22, vc - 6, 17, 0.4), (uc + 20, vc - 6, 15, 1.5), (L - 4, -hv - 20, 18, 0.8),
        (-4, cv0 - 2, 16, 1.1), (L * 0.15, -hv - 28, 19, 0.6),
    ):
        palm(M, BF, u, v, h, spin)

    fold_body(M, keep={"sign", "glass"})
    info = write_glb(M, HERO / "hyatt.glb", images=[png_bytes(png)])
    check_glb(HERO / "hyatt.glb")
    face = BF.p(mid, cv0 - 28, 5)
    look = BF.p(mid, cv0, 7)
    print("hyatt", info)
    print("cam", round(O[0] + face[0], 1), round(O[1] + face[2], 1))
    print("look", round(O[0] + look[0], 1), round(O[1] + look[2], 1))
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    if not (1200 <= info["lod0"] <= 7000):
        print("WARN lod0", info["lod0"])
    patch(info)
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "hyatt"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = block.replace(
        '"status": "v3-procedural (OSM footprint, photo/brand refs)"',
        '"status": "v4-grokbot (red roofs, casino pavilion, hedge garden)"',
        1,
    )
    block = re.sub(r'"hyatt_lod0": \d+', f'"hyatt_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"hyatt_lod1": \d+', f'"hyatt_lod1": {info["lod1"]}', block, count=1)
    block = block.replace('"textures": 2', '"textures": 1', 1)
    new = (
        '"ref_sources": "Mapillary entrance views in refs/places/palm-eagle-beach/hyatt '
        '(beige wing, red tile roofs, casino pavilion with vertical CASINO letters, '
        'taller window-strip tower, clipped hedges, palms, brown Hyatt entrance board). '
        'OSM footprint. Signs are drawn. Built by tools/grokbot/hyatt.py"'
    )
    block2, n = re.subn(r'"ref_sources": "[^"]*"', new, block, count=1)
    if n != 1:
        raise SystemExit("hyatt ref anchor missing")
    block = block2.replace(
        "generated by /workspace/landmarks/gen.mjs",
        "generated by tools/grokbot/hyatt.py",
        1,
    )
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == "hyatt")
    assert hit["tris"]["hyatt_lod0"] == info["lod0"]
    assert hit["tris"]["hyatt_lod1"] == info["lod1"]


if __name__ == "__main__":
    build()
