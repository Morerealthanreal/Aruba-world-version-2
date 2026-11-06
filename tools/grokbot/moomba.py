#!/usr/bin/env python3
"""Moomba Beach Bar.

Same hero id and origin. moombabeach.com and the Aruba.com gallery show a
giant thatch palapa, a wooden bar, string lights, and blue umbrellas on the
sand between the Marriott and the Holiday Inn. The wordmark is drawn.
Nothing is a pasted photograph.
"""
import json
import math
import re
import struct
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, fold_body, write_glb  # noqa: E402
from hotelkit import FONT_SANS, Frame, obox, png_bytes, tri_out, vquad  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-8122.03, -6342.63)
NAME = "moomba"

THATCH = (0.78, 0.62, 0.32)
THATCH2 = (0.55, 0.38, 0.16)
FRINGE = (0.46, 0.30, 0.12)
WOOD = (0.62, 0.40, 0.16)
DECK = (0.72, 0.62, 0.46)
SAND = (0.86, 0.78, 0.58)
BLUE = (0.12, 0.38, 0.78)
WHITE = (0.94, 0.94, 0.92)
BAR = (0.16, 0.18, 0.22)
GREEN = (0.16, 0.46, 0.18)
TRUNK = (0.38, 0.24, 0.12)
BULB = (1.0, 0.62, 0.16)


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def hquad(mesh, F, u0, u1, v0, v1, y):
    A, B = F.p(u0, v0, y), F.p(u1, v0, y)
    C, D = F.p(u1, v1, y), F.p(u0, v1, y)
    cen = F.p((u0 + u1) / 2, (v0 + v1) / 2, y - 1)
    tri_out(mesh, A, B, C, cen)
    tri_out(mesh, A, C, D, cen)


def thatch_shag(mesh_a, mesh_b, F, u0, u1, v_edge, y0, rise, n=7, tile=2.15):
    """Short staggered straw courses. One long band reads as a plank."""
    s = 1 if v_edge >= 0 else -1
    V = abs(v_edge)
    u, k = u0, 0
    while u < u1 - 0.3:
        ub = min(u1, u + tile)
        cen = F.p((u + ub) / 2, 0, y0 - 6)
        jitter = 0.12 * (k % 3)
        for i in range(n):
            f_hi, f_lo = (i + 1) / n, i / n
            sag = 0.08 + 0.07 * ((i + k) % 3)
            v_in = s * V * (1 - f_hi * 0.86)
            v_out = s * (V * (1 - f_lo) + 0.28 + jitter)
            y_in = y0 + rise * f_hi + 0.06
            y_out = y0 + rise * f_lo - 0.22 - sag
            A, B = F.p(u, v_out, y_out), F.p(ub, v_out, y_out - 0.05)
            C, D = F.p(ub, v_in, y_in), F.p(u, v_in, y_in + 0.04)
            m = mesh_a if (i + k) % 2 == 0 else mesh_b
            tri_out(m, A, B, C, cen)
            tri_out(m, A, C, D, cen)
            lip = 0.16
            A2, B2 = F.p(u, v_out, y_out - lip), F.p(ub, v_out, y_out - lip)
            tri_out(mesh_b, A, B, B2, cen)
            tri_out(mesh_b, A, B2, A2, cen)
        u += tile * 0.8
        k += 1


def fringe(mesh, F, u0, u1, v_edge, y, drop=0.85, out=0.55, step=0.9):
    s = 1 if v_edge >= 0 else -1
    u, k = u0, 0
    while u < u1 - 0.1:
        w = min(step, u1 - u)
        d0 = drop * (0.6 + 0.4 * ((k * 3) % 5) / 4)
        d1 = drop * (0.55 + 0.45 * ((k * 2) % 4) / 3)
        A = F.p(u, v_edge, y + 0.04)
        B = F.p(u + w, v_edge, y + 0.04)
        C = F.p(u + w * 0.85, v_edge + s * out, y - d1)
        D = F.p(u + w * 0.12, v_edge + s * out * 0.8, y - d0)
        cen = F.p(u + w / 2, v_edge - s, y)
        tri_out(mesh, A, B, C, cen)
        tri_out(mesh, A, C, D, cen)
        u += step * 0.92
        k += 1


def palapa(M, F, u, v, radius, eave, rise, lod=0):
    """Round layered thatch hut, the shape behind the dining table."""
    rings, steps = 5, 8
    for i in range(rings):
        f0, f1 = i / rings, (i + 1) / rings
        y0 = eave + rise * f0 - 0.2
        y1 = eave + rise * f1
        r0 = radius * (1 - f0 * 0.82) + 0.4
        r1 = radius * (1 - f1 * 0.92)
        mesh = M.mesh(lod, "thatch" if i % 2 == 0 else "thatch2")
        cen = F.p(u, v, eave - 1)
        for k in range(steps):
            a0, a1 = k * math.tau / steps, (k + 1) * math.tau / steps
            A = F.p(u + math.cos(a0) * r0, v + math.sin(a0) * r0, y0)
            B = F.p(u + math.cos(a1) * r0, v + math.sin(a1) * r0, y0)
            C = F.p(u + math.cos(a1) * r1, v + math.sin(a1) * r1, y1)
            D = F.p(u + math.cos(a0) * r1, v + math.sin(a0) * r1, y1)
            tri_out(mesh, A, B, C, cen)
            tri_out(mesh, A, C, D, cen)
    obox(M.mesh(lod, "wood"), F, u - 0.1, u + 0.1, v - 0.1, v + 0.1, 0.1, eave)


def palm(M, F, u, v, h=7.2):
    obox(M.mesh(0, "trunk"), F, u - 0.14, u + 0.14, v - 0.14, v + 0.14, 0.05, h)
    crown = F.p(u, v, h + 0.2)
    cen = F.p(u, v, h - 1.5)
    mesh = M.mesh(0, "green")
    for i in range(7):
        a = i * math.tau / 7
        p1 = F.p(u + math.cos(a) * 1.1, v + math.sin(a) * 1.1, h - 0.2)
        p2 = F.p(u + math.cos(a) * 3.1, v + math.sin(a) * 3.1, h - 1.7)
        tri_out(mesh, crown, p1, p2, cen)
    obox(M.mesh(1, "green"), F, u - 1.2, u + 1.2, v - 1.2, v + 1.2, h - 0.4, h + 0.5)


def dining_table(M, F, u, v):
    """Plank-top wooden table. The dining photo is this surface in the foreground."""
    obox(M.mesh(0, "wood"), F, u - 0.15, u + 0.15, v - 0.15, v + 0.15, 0.15, 0.72)
    for i, du in enumerate((-0.7, -0.28, 0.14, 0.56)):
        obox(M.mesh(0, "wood"), F, u + du, u + du + 0.34, v - 0.55, v + 0.55, 0.72, 0.84)


def logo_png():
    im = Image.new("RGBA", (1024, 256), (0, 0, 0, 0))
    dr = ImageDraw.Draw(im)
    dr.rounded_rectangle((8, 16, 1016, 240), radius=48, fill=(14, 92, 196, 255))
    font = ImageFont.truetype(FONT_SANS, 118)
    tw = font.getlength("MOOMBA")
    x = (1024 - tw) / 2
    for dx, dy in ((-3, 0), (3, 0), (0, -3), (0, 3)):
        dr.text((x + dx, 28 + dy), "MOOMBA", font=font, fill=(245, 196, 28, 255))
    dr.text((x, 28), "MOOMBA", font=font, fill=(198, 28, 32, 255))
    small = ImageFont.truetype(FONT_SANS, 36)
    sw = small.getlength("BEACH")
    dr.text(((1024 - sw) / 2, 168), "BEACH", font=small, fill=(245, 210, 64, 255))
    return im


def umbrella(M, F, u, v):
    obox(M.mesh(0, "wood"), F, u - 0.06, u + 0.06, v - 0.06, v + 0.06, 0.15, 2.3)
    apex = F.p(u, v, 3.15)
    mesh = M.mesh(0, "blue")
    cen = F.p(u, v, 2.2)
    r = 1.7
    for i in range(6):
        a0, a1 = i * math.tau / 6, (i + 1) * math.tau / 6
        p0 = F.p(u + math.cos(a0) * r, v + math.sin(a0) * r, 2.35)
        p1 = F.p(u + math.cos(a1) * r, v + math.sin(a1) * r, 2.35)
        tri_out(mesh, p0, p1, apex, cen)
    vquad(M.mesh(0, "white"), F, u - 0.28, u + 0.28, v - 0.02, 2.7, 3.05, 1)


def build():
    M = Model(NAME)
    for n, c, r in (
        ("thatch", THATCH, .92), ("thatch2", THATCH2, .92), ("fringe", FRINGE, 1),
        ("wood", WOOD, .75), ("deck", DECK, .85), ("sand", SAND, .95),
        ("blue", BLUE, .6), ("white", WHITE, .5), ("bar", BAR, .4),
        ("green", GREEN, .8), ("trunk", TRUNK, .85),
    ):
        M.material(n, lin(c), rough=r)
    M.material("sign", (1, 1, 1), rough=.45, textured=True, emissive=.12)
    M.material("bulb", (0.22, 0.1, 0.02), rough=.35, emissive=.9)

    # North to south. +v is west, the beach. The road is -v.
    BF = Frame((-8124.0, -6355.0), (-8120.0, -6331.0), O)
    L = BF.L
    half = 6.2
    eave, rise = 2.55, 2.35
    thatch_shag(M.mesh(0, "thatch"), M.mesh(0, "thatch2"), BF, 0.2, L - 0.2, -half, eave, rise)
    thatch_shag(M.mesh(0, "thatch"), M.mesh(0, "thatch2"), BF, 0.2, L - 0.2, half, eave, rise)
    fringe(M.mesh(0, "fringe"), BF, 0.4, L - 0.4, -half, eave)
    fringe(M.mesh(0, "fringe"), BF, 0.4, L - 0.4, half, eave)
    obox(M.mesh(0, "thatch2"), BF, 1.5, L - 1.5, -0.28, 0.28, eave + rise - 0.05, eave + rise + 0.28)
    # far LOD stays one simple hip so the phone does not pay for every course
    thatch_shag(M.mesh(1, "thatch2"), M.mesh(1, "thatch2"), BF, 0.4, L - 0.4, -half, eave, rise, n=3, tile=40)
    thatch_shag(M.mesh(1, "thatch2"), M.mesh(1, "thatch2"), BF, 0.4, L - 0.4, half, eave, rise, n=3, tile=40)
    hquad(M.mesh(0, "deck"), BF, -0.4, L + 0.4, -half + 0.3, half + 8, 0.12)
    hquad(M.mesh(1, "deck"), BF, 0, L, -half + 0.6, half + 4, 0.1)
    hquad(M.mesh(0, "sand"), BF, -8, L + 8, -half - 4, half + 18, 0.04)

    u = 1.2
    while u < L - 1:
        for v in (-half + 0.35, half - 0.35):
            obox(M.mesh(0, "wood"), BF, u - 0.12, u + 0.12, v - 0.12, v + 0.12, 0.12, eave)
        # warm string under both eaves, and a lantern dropped into the opening
        for v in (-half + 0.85, half - 0.85):
            obox(M.mesh(0, "bulb"), BF, u - 0.16, u + 0.16, v - 0.16, v + 0.16, eave - 0.55, eave - 0.22)
        obox(M.mesh(0, "bulb"), BF, u - 0.22, u + 0.22, -1.3, -0.7, eave + 0.15, eave + 0.7)
        u += 2.4
    obox(M.mesh(1, "wood"), BF, 2, L - 2, -half + 0.2, -half + 0.7, 0.15, eave * 0.85)

    # bar counter on the street side
    obox(M.mesh(0, "wood"), BF, 2, L - 2, -half + 1.1, -half + 2.5, 0.2, 1.05)
    obox(M.mesh(0, "bar"), BF, 2.2, L - 2.2, -half + 1.25, -half + 2.35, 1.05, 1.18)

    # round palapas and wooden tables on the beach, palms behind them
    for i, u in enumerate((3.2, 9.0, 15.0, 20.5)):
        palapa(M, BF, u, half + 3.2, 3.1, 2.15, 2.4)
        dining_table(M, BF, u, half + 7.4)
        palm(M, BF, u - 1.2, half + 11.5, h=6.4 + (i % 3) * 0.8)
        palm(M, BF, u + 1.6, half + 13.2, h=7.1)
    for u, v in ((-2.5, half + 6), (L + 2.2, half + 5), (-1.5, half + 12), (L + 1.5, half + 14), (L * 0.5, half + 16)):
        palm(M, BF, u, v, h=8.0)
    png = logo_png()
    # full sheet is 4:1, so the board is 8 m by 2 m
    vquad(M.mesh(0, "sign"), BF, L * 0.5 - 4, L * 0.5 + 4, -half - 0.15, 3.2, 5.2, -1,
          uvs=((1, 1), (0, 1), (0, 0), (1, 0)))
    vquad(M.mesh(1, "sign"), BF, L * 0.5 - 3.6, L * 0.5 + 3.6, -half - 0.05, 3.4, 5.0, -1,
          uvs=((1, 1), (0, 1), (0, 0), (1, 0)))

    for u in (3, 9, 15, 21):
        umbrella(M, BF, u, half + 4.5)
        obox(M.mesh(0, "wood"), BF, u - 0.7, u + 0.7, half + 2.2, half + 3.4, 0.2, 0.75)

    fold_body(M, keep={"sign", "bulb"})
    info = write_glb(M, HERO / "moomba.glb", images=[png_bytes(png)])
    paint_emissive(HERO / "moomba.glb", {"bulb": [1.0, 0.72, 0.22]})
    check_glb(HERO / "moomba.glb")
    look = BF.p(L * 0.5, -half, 4)
    cam = BF.p(L * 0.5, -half - 22, 2.2)
    print(NAME, info, "L", round(L, 1))
    print("look", round(O[0] + look[0], 1), round(O[1] + look[2], 1))
    print("cam", round(O[0] + cam[0], 1), round(O[1] + cam[2], 1))
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    if not (400 <= info["lod0"] <= 7000):
        print("WARN lod0", info["lod0"])
    patch(info)
    return info


def paint_emissive(path, colors):
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
    for mat in js["materials"]:
        if mat.get("name") in colors:
            mat["emissiveFactor"] = colors[mat["name"]]
    js_bytes = json.dumps(js, separators=(",", ":")).encode()
    js_bytes += b" " * ((4 - len(js_bytes) % 4) % 4)
    body = b""
    for ct, raw in chunks:
        raw = js_bytes if ct == 0x4E4F534A else raw
        body += struct.pack("<II", len(raw), ct) + raw
    out = struct.pack("<4sII", b"glTF", 2, 12 + len(body)) + body
    Path(path).write_bytes(out)


def patch(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "moomba"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = block.replace(
        '"status": "v3-procedural (OSM footprint, photo/brand refs)"',
        '"status": "v4-grokbot (thatch palapa, blue umbrellas, drawn wordmark)"',
        1,
    )
    block = re.sub(r'"moomba_lod0": \d+', f'"moomba_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"moomba_lod1": \d+', f'"moomba_lod1": {info["lod1"]}', block, count=1)
    new = (
        '"ref_sources": "moombabeach.com and aruba.com MooMba page (giant thatch palapa, '
        'wooden bar, string lights, blue umbrellas on the sand). OSM footprint. '
        'The wordmark is drawn. Built by tools/grokbot/moomba.py"'
    )
    block2, n = re.subn(r'"ref_sources": "(?:[^"\\]|\\.)*"', new, block, count=1)
    if n != 1:
        raise SystemExit("moomba ref anchor missing")
    block = block2.replace(
        "generated by /workspace/landmarks/gen.mjs",
        "generated by tools/grokbot/moomba.py",
        1,
    )
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == "moomba")
    assert hit["tris"]["moomba_lod0"] == info["lod0"]
    assert hit["tris"]["moomba_lod1"] == info["lod1"]


if __name__ == "__main__":
    build()
