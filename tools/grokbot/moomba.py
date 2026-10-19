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

THATCH = (0.62, 0.42, 0.18)
THATCH2 = (0.48, 0.30, 0.12)
WOOD = (0.42, 0.24, 0.12)
DECK = (0.72, 0.62, 0.46)
SAND = (0.86, 0.78, 0.58)
BLUE = (0.12, 0.38, 0.78)
WHITE = (0.94, 0.94, 0.92)
BAR = (0.16, 0.18, 0.22)
BULB = (1.0, 0.82, 0.35)


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def hquad(mesh, F, u0, u1, v0, v1, y):
    A, B = F.p(u0, v0, y), F.p(u1, v0, y)
    C, D = F.p(u1, v1, y), F.p(u0, v1, y)
    cen = F.p((u0 + u1) / 2, (v0 + v1) / 2, y - 1)
    tri_out(mesh, A, B, C, cen)
    tri_out(mesh, A, C, D, cen)


def gable(mesh, F, u0, u1, v0, v1, eave, ridge, n=8):
    """Long thatch roof. Ridge runs along u at the v midpoint."""
    vm = (v0 + v1) / 2
    cen = F.p((u0 + u1) / 2, vm, eave)
    for i in range(n):
        a, b = u0 + (u1 - u0) * i / n, u0 + (u1 - u0) * (i + 1) / n
        r0, r1 = F.p(a, vm, ridge), F.p(b, vm, ridge)
        for vv in (v0, v1):
            e0, e1 = F.p(a, vv, eave), F.p(b, vv, eave)
            if vv == v0:
                tri_out(mesh, e0, e1, r1, cen)
                tri_out(mesh, e0, r1, r0, cen)
            else:
                tri_out(mesh, e0, r0, r1, cen)
                tri_out(mesh, e0, r1, e1, cen)
    # gable ends
    for uu in (u0, u1):
        peak = F.p(uu, vm, ridge)
        w0, w1 = F.p(uu, v0, eave), F.p(uu, v1, eave)
        tri_out(mesh, w0, peak, w1, cen)


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
        ("thatch", THATCH, .92), ("thatch2", THATCH2, .92),
        ("wood", WOOD, .75), ("deck", DECK, .85), ("sand", SAND, .95),
        ("blue", BLUE, .6), ("white", WHITE, .5), ("bar", BAR, .4),
    ):
        M.material(n, lin(c), rough=r)
    M.material("sign", (1, 1, 1), rough=.45, textured=True, emissive=.12)
    M.material("bulb", lin(BULB), rough=.3, emissive=.7)

    # North to south. +v is west, the beach. The road is -v.
    BF = Frame((-8124.0, -6355.0), (-8120.0, -6331.0), O)
    L = BF.L
    half = 8.5
    eave, ridge = 2.7, 8.6
    gable(M.mesh(0, "thatch"), BF, -1, L + 1, -half, half, eave, ridge, 8)
    gable(M.mesh(1, "thatch2"), BF, 0, L, -half + 0.4, half - 0.4, eave + 0.2, ridge - 0.6, 4)
    hquad(M.mesh(0, "deck"), BF, -0.5, L + 0.5, -half + 0.4, half - 0.4, 0.16)
    hquad(M.mesh(1, "deck"), BF, 0, L, -half + 1, half - 1, 0.14)
    hquad(M.mesh(0, "sand"), BF, -6, L + 6, -half - 6, half + 16, 0.05)
    hquad(M.mesh(1, "sand"), BF, -2, L + 2, -half - 2, half + 8, 0.05)

    for u in range(0, int(L) + 1, 4):
        for v in (-half + 0.4, half - 0.4):
            obox(M.mesh(0, "wood"), BF, u - 0.16, u + 0.16, v - 0.16, v + 0.16, 0.12, eave)
        obox(M.mesh(1, "wood"), BF, u - 0.2, u + 0.2, -half, -half + 0.5, 0.1, eave * 0.7)
        # string lights under the street eave
        obox(M.mesh(0, "bulb"), BF, u + 1.2, u + 1.45, -half + 0.7, -half + 0.95, eave - 0.55, eave - 0.3)
        obox(M.mesh(0, "bulb"), BF, u + 1.2, u + 1.45, half - 0.95, half - 0.7, eave - 0.55, eave - 0.3)

    # bar along the street side, the counter the night photos show
    obox(M.mesh(0, "wood"), BF, 2, L - 2, -half + 1.2, -half + 2.6, 0.2, 1.15)
    obox(M.mesh(0, "bar"), BF, 2.2, L - 2.2, -half + 1.35, -half + 2.45, 1.15, 1.28)
    obox(M.mesh(1, "wood"), BF, 4, L - 4, -half + 1.3, -half + 2.4, 0.2, 1.05)
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
