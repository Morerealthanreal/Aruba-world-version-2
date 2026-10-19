#!/usr/bin/env python3
"""Divi Aruba Phoenix Beach Resort: long red-roofed wing and the tall tower.

Same hero id and origin. The resort aerial looks in from the beach: a long
light-grey wing of about six storeys under red-tile hips, and a tall slim
peach tower at the south end of that wing. The Esri ring is the red-roof
chain; the tower stands just south of it, where that photo puts it.
"""
import json
import math
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, fold_body, write_glb  # noqa: E402
from hotelkit import Frame, balcony_wing, hip_roof, obox, tri_out, uquad, vquad  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-8836.18, -4878.89)

# the long wing in the resort aerial is light grey with glass balconies, not a cream cottage
CREAM = (0.86, 0.87, 0.88)
CREAM_SH = (0.72, 0.74, 0.76)
RAIL = (0.90, 0.88, 0.84)
GLASS = (0.22, 0.30, 0.36)
TILE = (0.64, 0.26, 0.16)
ROOF = (0.78, 0.62, 0.48)
# The resort aerial tower is light peach, not a brown slab.
PEACH = (0.96, 0.78, 0.62)
PEACH_SH = (0.86, 0.64, 0.48)
TEAL = (0.15, 0.62, 0.72)
SAND = (0.90, 0.84, 0.68)
LAWN = (0.24, 0.52, 0.22)
POOL = (0.15, 0.62, 0.88)
BLUEU = (0.15, 0.40, 0.75)
THATCH = (0.62, 0.44, 0.20)
THATCH_D = (0.40, 0.26, 0.12)
TRUNK = (0.38, 0.24, 0.12)
FROND = (0.14, 0.40, 0.16)
ROCK = (0.32, 0.32, 0.30)
WHITE = (0.94, 0.94, 0.92)
BULB = (1.0, 0.72, 0.28)
CREST = (0.45, 0.95, 1.0)
POOLG = (0.20, 0.70, 1.0)

FH = 3.15


def lin(c):
    return tuple(round(v ** 2.2, 4) for v in c)


def hquad(mesh, F, u0, u1, v0, v1, y):
    A, B = F.p(u0, v0, y), F.p(u1, v0, y)
    C, D = F.p(u1, v1, y), F.p(u0, v1, y)
    cen = F.p((u0 + u1) / 2, (v0 + v1) / 2, y - 1)
    tri_out(mesh, A, B, C, cen)
    tri_out(mesh, A, C, D, cen)


def palm(M, F, u, v, h=11.0, spin=0.0, y0=0.0):
    """Trunk first, fronds only at the top, so a row reads as palms."""
    obox(M.mesh(0, "trunk"), F, u - 0.18, u + 0.18, v - 0.18, v + 0.18, y0, y0 + h * 0.55)
    obox(M.mesh(0, "trunk"), F, u - 0.12, u + 0.12, v - 0.12, v + 0.12, y0 + h * 0.48, y0 + h)
    crown, cen = F.p(u, v, y0 + h + 0.15), F.p(u, v, y0 + h - 3.5)
    mesh = M.mesh(0, "frond")
    for i in range(6):
        a = i * math.tau / 6 + spin
        reach = 2.6 + (i % 3) * 0.55
        tri_out(mesh, crown,
                F.p(u + math.cos(a) * reach * 0.3, v + math.sin(a) * reach * 0.3, y0 + h + 0.05),
                F.p(u + math.cos(a) * reach, v + math.sin(a) * reach, y0 + h - 1.5 - (i % 2) * 0.7), cen)


# Terrain under this hero, world metres, sampled with the hero hidden.
# The south court is a plateau about 3 m above the origin snap, so a flat
# sheet either floats or leaves that plateau as bare dirt.
_US = (-40, -10, 20, 50, 80, 110, 140, 170)
_VS = (-40, -15, 10, 35, 60, 85, 110, 135)
_HZ = (
    (2.27, 1.54, 0.41, -0.41, -0.91, -0.94, -1.31, -1.76),
    (3.45, 2.85, 2.28, 1.35, 0.20, 0.21, -0.52, -1.15),
    (7.24, 6.16, 5.46, 4.54, 3.14, 1.85, 0.67, -0.22),
    (7.08, 7.39, 7.95, 8.29, 8.49, 5.50, 3.05, 1.10),
    (8.02, 9.77, 11.60, 12.14, 12.12, 10.51, 6.88, 3.02),
    (9.13, 10.35, 11.69, 12.18, 12.18, 11.20, 8.81, 5.27),
    (9.30, 10.04, 11.04, 12.08, 12.08, 11.08, 8.93, 5.67),
    (7.36, 7.17, 7.17, 9.45, 9.92, 9.07, 7.38, 5.66),
)
HERO_Y = 8.81


def world_h(u, v):
    def seg(xs, x):
        if x <= xs[0]:
            return 0, 0.0
        if x >= xs[-1]:
            return len(xs) - 2, 1.0
        for i in range(len(xs) - 1):
            if xs[i] <= x <= xs[i + 1]:
                t = (x - xs[i]) / (xs[i + 1] - xs[i])
                return i, t
        return len(xs) - 2, 1.0
    iu, fu = seg(_US, u)
    iv, fv = seg(_VS, v)
    y00, y10 = _HZ[iu][iv], _HZ[iu + 1][iv]
    y01, y11 = _HZ[iu][iv + 1], _HZ[iu + 1][iv + 1]
    return y00 * (1 - fu) * (1 - fv) + y10 * fu * (1 - fv) + y01 * (1 - fu) * fv + y11 * fu * fv


def ground_y(u, v, lift=0.35):
    """Model y that sits just above the terrain."""
    return world_h(u, v) - HERO_Y + lift


def drape(mesh, F, u0, u1, v0, v1, stepu, stepv, lift, wet=0.25):
    u = u0
    while u < u1 - 0.1:
        v = v0
        u2 = min(u1, u + stepu)
        while v < v1 - 0.1:
            v2 = min(v1, v + stepv)
            hs = [world_h(a, b) for a, b in ((u, v), (u2, v), (u2, v2), (u, v2))]
            if sum(hs) / 4 > wet:
                ys = [h - HERO_Y + lift for h in hs]
                A, B = F.p(u, v, ys[0]), F.p(u2, v, ys[1])
                C, D = F.p(u2, v2, ys[2]), F.p(u, v2, ys[3])
                cen = F.p((u + u2) / 2, (v + v2) / 2, sum(ys) / 4 - 1)
                tri_out(mesh, A, B, C, cen)
                tri_out(mesh, A, C, D, cen)
            v = v2
        u = u2


def palapa(M, F, u, v, y0=2.0):
    """Pointed thatch hut. The peak keeps a row from reading as flat discs."""
    obox(M.mesh(0, "trunk"), F, u - 0.08, u + 0.08, v - 0.08, v + 0.08, y0, y0 + 2.35)
    top, cen = F.p(u, v, y0 + 3.55), F.p(u, v, y0 + 1.2)
    cap, hem = M.mesh(0, "thatch"), M.mesh(0, "thatchd")
    for i in range(7):
        a0, a1 = i * math.tau / 7, (i + 1) * math.tau / 7
        r = 2.15 + (i % 2) * 0.15
        r0 = F.p(u + math.cos(a0) * r, v + math.sin(a0) * r, y0 + 2.15)
        r1 = F.p(u + math.cos(a1) * r, v + math.sin(a1) * r, y0 + 2.05)
        tri_out(cap, top, r0, r1, cen)
        d0 = F.p(u + math.cos(a0) * (r + 0.55), v + math.sin(a0) * (r + 0.55), y0 + 1.15)
        d1 = F.p(u + math.cos(a1) * (r + 0.7), v + math.sin(a1) * (r + 0.7), y0 + 0.85)
        tri_out(hem, r0, r1, d1, cen)
        tri_out(hem, r0, d1, d0, cen)


def paint_emissive(path, colors):
    """Night lights keep a material whose name starts with bulb. Set its colour."""
    import json as _json
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
            js = _json.loads(raw)
    hit = set()
    for mat in js["materials"]:
        if mat.get("name") in colors:
            mat["emissiveFactor"] = colors[mat["name"]]
            hit.add(mat["name"])
    missing = set(colors) - hit
    if missing:
        raise SystemExit(f"emissive materials missing: {missing}")
    js_bytes = _json.dumps(js, separators=(",", ":")).encode()
    js_bytes += b" " * ((4 - len(js_bytes) % 4) % 4)
    body = b""
    for ct, raw in chunks:
        raw = js_bytes if ct == 0x4E4F534A else raw
        body += struct.pack("<II", len(raw), ct) + raw
    Path(path).write_bytes(b"glTF" + struct.pack("<II", 2, 12 + len(body)) + body)


def build():
    M = Model("divephoenix")
    for n, c, r in (
        ("wall", CREAM, .85), ("recess", CREAM_SH, .9), ("slab", WHITE, .75),
        ("rail", RAIL, .5), ("glass", GLASS, .25), ("tile", TILE, .75), ("roof", ROOF, .85),
        ("peach", PEACH, .82), ("peachsh", PEACH_SH, .88), ("teal", TEAL, .6),
        ("pool", POOL, .3), ("blueu", BLUEU, .55), ("thatch", THATCH, .9), ("thatchd", THATCH_D, .95),
        ("sand", SAND, .9), ("lawn", LAWN, .9), ("rock", ROCK, .95), ("white", WHITE, .55),
        ("trunk", TRUNK, .85), ("frond", FROND, .8),
    ):
        M.material(n, lin(c), rough=r)
    M.material("bulb", lin(BULB), rough=.4, emissive=.9)
    M.material("bulbpool", lin(POOLG), rough=.25, emissive=.8)
    M.material("bulbcrest", lin(CREST), rough=.35, emissive=.95)
    mats = {"wall": "wall", "recess": "recess", "slab": "slab", "rail": "rail", "glass": "glass", "fin": "wall"}

    # Resort aerial (diviresorts.com): the long wing is about six storeys,
    # light grey, glass balconies, red-tile hips. It runs north-south on the
    # street side of this ring. Lower red-roof blocks sit on the pool side.
    # a->b runs north to south, so +v is west, toward the pool and the beach.
    wings = [
        ((-8826.0, -4938.0), (-8812.0, -4884.0), 9.0, 6),
        ((-8830.0, -4880.0), (-8816.0, -4828.0), 9.0, 6),
        ((-8854.0, -4864.0), (-8838.0, -4836.0), 7.5, 3),
        ((-8852.0, -4926.0), (-8836.0, -4898.0), 7.0, 3),
    ]
    for a, b, hv, floors in wings:
        F = Frame(a, b, O)
        top = balcony_wing(M, F, 0, F.L, hv, 0.3, floors, FH, 3.15, mats, depth=1.35)
        for lod in (0, 1):
            obox(M.mesh(lod, "slab"), F, -0.3, F.L + 0.3, -hv - 0.3, hv + 0.3, top, top + 0.4)
            hip_roof(M.mesh(lod, "tile"), F, -0.7, F.L + 0.7, -hv - 0.7, hv + 0.7, top + 0.35, 3.0)
        # pool-side colonnade, the ground floor under the balconies
        vquad(M.mesh(0, "glass"), F, 1.0, F.L - 1.0, hv + 0.08, 0.45, 2.7, 1)
        u = 1.4
        while u < F.L - 0.8:
            obox(M.mesh(0, "slab"), F, u - 0.16, u + 0.16, hv - 0.1, hv + 0.55, 0.3, top - 0.4)
            u += 3.3
    # Tall slim peach tower at the south end of the long wing. The resort
    # aerial, shot from the beach, puts it on the right of that wing.
    tower_mats = dict(mats)
    tower_mats["wall"] = "peach"
    tower_mats["recess"] = "peachsh"
    tower_mats["fin"] = "peach"
    FT = Frame((-8846.0, -4822.0), (-8830.0, -4806.0), O)
    ttop = balcony_wing(M, FT, 0, FT.L, 7.4, 0.4, 14, FH, 4.2, tower_mats, depth=1.2)
    for lod in (0, 1):
        obox(M.mesh(lod, "peach"), FT, -0.4, FT.L + 0.4, -7.8, 7.8, ttop, ttop + 1.6)
        # Lit crown on every face, so the beach camera cannot see it edge-on.
        if lod == 0:
            vquad(M.mesh(0, "bulbcrest"), FT, FT.L * 0.08, FT.L * 0.92, 8.15, ttop + 2.2, ttop + 8.4, 1)
            vquad(M.mesh(0, "bulbcrest"), FT, FT.L * 0.08, FT.L * 0.92, -8.15, ttop + 2.2, ttop + 8.4, -1)
            uquad(M.mesh(0, "bulbcrest"), FT, -0.15, -7.7, 7.7, ttop + 2.2, ttop + 8.4, -1)
            uquad(M.mesh(0, "bulbcrest"), FT, FT.L + 0.15, -7.7, 7.7, ttop + 2.2, ttop + 8.4, 1)
            vquad(M.mesh(0, "white"), FT, FT.L * 0.22, FT.L * 0.78, 8.28, ttop + 4.6, ttop + 6.6, 1)
            vquad(M.mesh(0, "teal"), FT, FT.L * 0.18, FT.L * 0.82, 8.22, ttop + 3.3, ttop + 4.5, 1)
        else:
            obox(M.mesh(1, "bulbcrest"), FT, -0.2, FT.L + 0.2, -8.2, 8.2, ttop + 2.2, ttop + 8.0)
        obox(M.mesh(lod, "slab"), FT, -0.2, FT.L + 0.2, -7.6, 7.6, ttop + 8.3, ttop + 8.8)

    # the low block this hero already hides, just west of the ring (named Dive Phoenix)
    FHIDE = Frame((-8894.0, -4836.0), (-8870.0, -4816.0), O)
    top = balcony_wing(M, FHIDE, 0, FHIDE.L, 8.0, 0.3, 2, FH, 4.0, mats, depth=1.2, faces=(1,))
    for lod in (0, 1):
        hip_roof(M.mesh(lod, "tile"), FHIDE, -0.6, FHIDE.L + 0.6, -8.6, 8.6, top, 2.6)

    # Flat beach (the rows read as a resort, not a slope) plus a higher lawn
    # on the south plateau, which sits about 3 m above the origin snap.
    FC = Frame((-8824.0, -4936.0), (-8814.0, -4830.0), O)
    lawn_y, sand_y, plat_y = 2.05, 2.2, 4.35
    hquad(M.mesh(0, "lawn"), FC, -70, 220, -50, 72, lawn_y)
    hquad(M.mesh(1, "lawn"), FC, -70, 220, -50, 72, lawn_y)
    hquad(M.mesh(0, "lawn"), FC, 40, 210, -30, 66, plat_y)
    hquad(M.mesh(0, "sand"), FC, -28, 165, 64, 138, sand_y)
    # Pool and white pavilion on the lawn the beach camera already sees, left of the tower.
    water = lawn_y + 0.22
    hquad(M.mesh(0, "bulbpool"), FC, 2, 58, 6, 50, water)
    hquad(M.mesh(1, "bulbpool"), FC, 2, 58, 6, 50, water)
    obox(M.mesh(0, "white"), FC, 0, 60, 4.2, 51.6, water - 0.38, water - 0.04)
    uu = 6
    while uu < 54:
        hquad(M.mesh(0, "bulb"), FC, uu - 0.2, uu + 0.2, 4.4, 5.2, water + 0.1)
        hquad(M.mesh(0, "bulb"), FC, uu - 0.2, uu + 0.2, 50.2, 51.0, water + 0.1)
        uu += 6
    py = lawn_y
    for lod in (0, 1):
        obox(M.mesh(lod, "white"), FC, 64, 108, 38, 58, py, py + 3.2)
        hip_roof(M.mesh(lod, "white"), FC, 62, 110, 36, 60, py + 3.05, 3.3)
        if lod == 0:
            vquad(M.mesh(0, "glass"), FC, 66, 106, 58.2, py + 0.55, py + 2.9, 1)
            vquad(M.mesh(0, "bulb"), FC, 65, 107, 59.4, py + 2.3, py + 3.0, 1)
    def blocked(u, v):
        return (0 <= u <= 60 and 4 <= v <= 52) or (62 <= u <= 112 and 36 <= v <= 60)
    k = 0
    for u in range(-8, 170, 6):
        for v, base, yy in ((6, 14, lawn_y), (50, 16, plat_y), (58, 13, plat_y)):
            if blocked(u, v):
                continue
            if v >= 40 and u < 55:
                yy = lawn_y
            palm(M, FC, u + (k % 3) * 0.6, v, h=base + (k % 4) * 0.5, spin=k * 0.45, y0=yy)
            k += 1
    for row, v in enumerate((72, 84, 96, 108)):
        for i, u in enumerate(range(-2, 150, 7)):
            palapa(M, FC, u + (row % 2) * 3.4, v, y0=sand_y)
    rk, u = 0, -16.0
    while u < 156:
        w = 2.5 + (rk % 3) * 1.1
        h = 1.55 + (rk % 5) * 0.5
        obox(M.mesh(0, "rock"), FC, u, u + w, 126, 130.5, 0.35, 0.35 + h)
        if rk % 2 == 0:
            obox(M.mesh(0, "rock"), FC, u + 0.5, u + w + 1.0, 129.2, 133.4, 0.15, 1.2)
        u += 3.1
        rk += 1
    # One opaque mesh per LOD. Glass and bulbs stay named so the night pass lights them.
    fold_body(M, keep={"glass", "bulb", "bulbpool", "bulbcrest"})
    info = write_glb(M, HERO / "divephoenix.glb")
    paint_emissive(HERO / "divephoenix.glb", {
        "bulb": [1.0, 0.55, 0.12],
        "bulbpool": [0.15, 0.55, 1.0],
        "bulbcrest": [0.55, 0.95, 1.0],
    })
    check_glb(HERO / "divephoenix.glb")
    if not (2800 <= info["lod0"] <= 16000):
        print("WARN lod0", info["lod0"])
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    patch(info)
    def world(u, v, y):
        x, yy, z = FC.p(u, v, y)
        return (round(x + O[0], 1), round(z + O[1], 1), round(yy, 2))
    print("phoenix", info)
    print("beach", world(50, 70, 12), "court", world(52, 25, 1.4), "wing", world(40, -6, 16))
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "divephoenix"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = re.sub(r'"status": "[^"]*"',
                    '"status": "v6-grokbot (lawn, palms, lit pools, palapas, breakwater, lit crest)"', block, count=1)
    block = re.sub(r'"divephoenix_lod0": \d+', f'"divephoenix_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"divephoenix_lod1": \d+', f'"divephoenix_lod1": {info["lod1"]}', block, count=1)
    block = block.replace('"textures": 2', '"textures": 0', 1)
    old = '"ref_sources": "diviresorts.com Divi Aruba Phoenix (white tower, Palm Beach)"'
    new = ('"ref_sources": "diviresorts.com resort aerial: long light-grey wing, about six '
           'storeys, glass balconies, red-tile hips, and the tall slim peach tower at the '
           'south end of that wing, pool court with palms and beach umbrellas to the west. '
           'Esri aerial: the red roofs run north-south on the street side of the ring. '
           'Built by tools/grokbot/phoenix.py"')
    block = block.replace(
        "the tall peach tower stands outside this footprint.",
        "the tall slim peach tower stands at the south end of that wing.",
        1)
    prev = ('"ref_sources": "Esri aerial over OSM: chain of red hip roofs from the beach '
            '(northwest) to the street, pool on the ocean side; cream walls. The white '
            'high-rise northeast of the ring is a different building. Built by tools/grokbot/phoenix.py"')
    current = ('"ref_sources": "diviresorts.com resort aerial: long light-grey wing, about six '
                'storeys, glass balconies, red-tile hips; the tall slim peach tower stands at the '
                'south end of that wing. Esri aerial: the red roofs run north-south on the street '
                'side of the ring, pool to the west. Built by tools/grokbot/phoenix.py"')
    if old in block:
        block = block.replace(old, new, 1)
    elif prev in block:
        block = block.replace(prev, new, 1)
    elif current in block:
        block = block.replace(current, new, 1)
    elif "diviresorts.com resort aerial" not in block:
        raise SystemExit("phoenix ref anchor missing")
    block = block.replace(
        "generated by /workspace/landmarks/gen.mjs",
        "generated by tools/grokbot/phoenix.py", 1)
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == "divephoenix")
    assert hit["tris"]["divephoenix_lod0"] == info["lod0"]


if __name__ == "__main__":
    build()
