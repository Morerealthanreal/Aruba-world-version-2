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

    # Tan villa the street photo is of: red tile hip, a balcony, a dark arched entry.
    # The casino billboard is not on this face.
    cu0, cu1 = L * 0.38, L * 0.38 + 22
    cv0, cv1 = -hv - 22, -hv - 8
    ctop = 8.4
    mid = (cu0 + cu1) / 2
    for lod in (0, 1):
        obox(M.mesh(lod, "wall"), BF, cu0, cu1, cv0, cv1, GF, ctop)
        hip_roof(M.mesh(lod, "tile"), BF, cu0 - 1.1, cu1 + 1.1, cv0 - 1.4, cv1 + 0.6, ctop - 0.1, 2.8)
        obox(M.mesh(lod, "white"), BF, cu0 - 0.15, cu1 + 0.15, cv0 - 0.3, cv1 + 0.15, ctop - 0.4, ctop - 0.08)
    # balcony across the street face
    obox(M.mesh(0, "white"), BF, cu0 + 1.2, cu1 - 1.2, cv0 - 1.7, cv0 + 0.15, ctop - 3.55, ctop - 3.28)
    vquad(M.mesh(0, "white"), BF, cu0 + 1.4, cu1 - 1.4, cv0 - 1.55, ctop - 3.28, ctop - 2.35, -1)
    # dark arched entry, with a white arch of short blocks
    au0, au1 = mid - 2.6, mid + 2.6
    vquad(M.mesh(0, "dark"), BF, au0, au1, cv0 - 0.08, GF + 0.15, GF + 3.55, -1)
    vquad(M.mesh(0, "glass"), BF, mid - 1.6, mid + 1.6, cv0 - 1.85, ctop - 3.15, ctop - 1.15, -1)
    for i in range(9):
        t = i / 8
        arch_y = (GF + 2.55) + math.sin(t * math.pi) * 1.25
        u = au0 + t * (au1 - au0)
        obox(M.mesh(0, "white"), BF, u - 0.38, u + 0.38, cv0 - 0.28, cv0 + 0.08, arch_y, arch_y + 0.32)
    for side in (au0 - 0.28, au1 - 0.08):
        obox(M.mesh(0, "white"), BF, side, side + 0.32, cv0 - 0.22, cv0 + 0.06, GF + 0.2, GF + 2.7)
    png = logo_png()
    for step in range(5):
        obox(M.mesh(0, "white"), BF, mid - 2.4, mid + 2.4,
             cv0 - 6.4 + step * 0.95, cv0 - 5.2 + step * 0.95,
             GF + step * 0.18, GF + 0.26 + step * 0.18)

    # brown board on the right of the garden (north), the way the street photos read
    su0, su1 = mid - 18, mid - 14.6
    sv = cv0 - 20
    for lod in (0, 1):
        obox(M.mesh(lod, "brown"), BF, su0, su1, sv - 0.18, sv + 0.28, 0.2, 2.55)
    vquad(M.mesh(0, "sign"), BF, su0 + 0.12, su1 - 0.12, sv - 0.26, 0.45, 2.55, -1, uvs=face_uvs(*SIGN))
    vquad(M.mesh(1, "sign"), BF, su0, su1, sv - 0.2, 0.35, 2.65, -1, uvs=face_uvs(*SIGN))

    # Lawn under the whole garden, then a curved white path, low swirled hedges
    # and a yellow flower band. Hedges are a ribbon, not scattered cubes.
    for lod in (0, 1):
        obox(M.mesh(lod, "lawn"), BF, -30, L + 24, -hv - 80, -hv + 1, 0.0, 0.2)
    def ribbon(mat, pts, half_w, y0, y1):
        """A low strip that follows the curve, instead of a row of cubes."""
        mesh = M.mesh(0, mat)
        for i in range(len(pts) - 1):
            u0, v0 = pts[i]
            u1, v1 = pts[i + 1]
            du, dv = u1 - u0, v1 - v0
            length = math.hypot(du, dv) or 1
            pu, pv = -dv / length * half_w, du / length * half_w
            top = y1
            bot = y0
            ring = (
                (u0 + pu, v0 + pv), (u1 + pu, v1 + pv),
                (u1 - pu, v1 - pv), (u0 - pu, v0 - pv),
            )
            cen = BF.p((u0 + u1) / 2, (v0 + v1) / 2, bot - 1)
            a, b, c, d = (BF.p(u, v, top) for u, v in ring)
            tri_out(mesh, a, b, c, cen)
            tri_out(mesh, a, c, d, cen)
            for k in range(4):
                ua, va = ring[k]
                ub, vb = ring[(k + 1) % 4]
                A, B = BF.p(ua, va, bot), BF.p(ub, vb, bot)
                C, D = BF.p(ub, vb, top), BF.p(ua, va, top)
                tri_out(mesh, A, B, C, cen)
                tri_out(mesh, A, C, D, cen)
    # The street photo's path leaves the foreground and bends toward the
    # stairs. A fixed north-south wave reads as stripes from the drive.
    def beside(pts, dist):
        out = []
        for i, (u, v) in enumerate(pts):
            if i == 0:
                du, dv = pts[1][0] - u, pts[1][1] - v
            elif i == len(pts) - 1:
                du, dv = u - pts[i - 1][0], v - pts[i - 1][1]
            else:
                du = pts[i + 1][0] - pts[i - 1][0]
                dv = pts[i + 1][1] - pts[i - 1][1]
            length = math.hypot(du, dv) or 1.0
            out.append((u - dv / length * dist, v + du / length * dist))
        return out

    path = []
    for i in range(48):
        t = i / 47
        u = mid + math.sin(t * math.tau) * 11
        v = (cv0 - 46) + t * 38
        path.append((u, v))
    inner = []
    for i in range(32):
        ang = i / 31 * math.tau
        inner.append((mid - 6 + math.cos(ang) * 8.2, cv0 - 18 + math.sin(ang) * 4.6))
    ribbon("white", path, 1.7, 0.2, 0.36)
    ribbon("hedge", beside(path, 2.7), 0.62, 0.26, 0.7)
    ribbon("yellow", beside(path, 3.5), 0.28, 0.28, 0.48)
    ribbon("hedge", beside(path, -2.7), 0.55, 0.26, 0.66)
    ribbon("hedge", inner, 0.48, 0.26, 0.68)
    ribbon("yellow", beside(inner, 1.05), 0.24, 0.28, 0.46)
    obox(M.mesh(0, "purple"), BF, su0 - 1, su1 + 1, sv + 1.2, sv + 3.4, 0.2, 0.55)
    for u, v, h, spin in (
        (-8, -hv - 6, 18, 0.2), (6, -hv - 4, 20, 1.1), (16, -hv - 12, 17, 0.4),
        (28, -hv - 7, 19, 0.8), (40, -hv - 14, 16, 1.4), (52, -hv - 5, 18, 0.6),
        (64, -hv - 11, 17, 1.0), (78, -hv - 6, 19, 0.3), (90, -hv - 13, 16, 1.6),
        (mid - 20, cv0 - 12, 18, 0.9), (mid - 12, cv0 - 8, 15, 0.5), (mid + 14, cv0 - 8, 16, 1.2),
        (mid + 18, cv0 - 14, 14, 0.7), (cu0 - 4, cv1 + 3, 13, 1.3), (cu1 + 6, cv1 + 2, 12, 0.2),
        (mid - 22, cv0 - 18, 17, 0.4), (mid + 16, cv0 - 20, 15, 1.5), (L - 4, -hv - 20, 18, 0.8),
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
    block = re.sub(
        r'"status": "[^"]*"',
        '"status": "v5-grokbot (tan villa, red roof, curved hedges, white path)"',
        block,
        count=1,
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
