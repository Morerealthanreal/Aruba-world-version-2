#!/usr/bin/env python3
"""Marriott's Aruba Ocean Club (Palm Beach): a U of white balcony wings under
teal metal hip roofs, open to the beach around the rock-waterfall pool.

Same hero id, origin and OSM footprint (way 643104752: levels 6, height 20).
Massing over the OSM ring: a north wing and a longer south wing, both ~21 m
deep and running from the beach (west) to the street, joined on the street
side by an east stem, with a lower lobby block at the south-east corner.
Look from the resort's own photos (Marriott gallery stills in timeshare video
B5udOCtv2D0): white walls, white slab edges and white railings around deep
balconies with blue-grey glass, a teal standing-seam hip roof with small
gables whose faces are peach, and a blank beach end wall carrying a stepped
peach ornament panel over a column of windows. 6 floors (Marriott / Travel
Weekly factsheet) above a taller ground floor; built 1999.
"""
import json
import math
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, fan, prism, wall_ring, write_glb  # noqa: E402
from hotelkit import Frame, balcony_wing, ccw, ear_fan, hip_roof, obox, tri_out, vquad, uquad  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-7956.02, -6550.71)
RING = [(-8033.5, -6517.9), (-7942.4, -6510), (-7941.7, -6517.3), (-7938.4, -6517.3), (-7938.3, -6522.1),
        (-7937.7, -6522.8), (-7937.5, -6531.2), (-7939.1, -6531.2), (-7938.2, -6553.7), (-7936.5, -6553.8),
        (-7932.1, -6557.7), (-7900.6, -6555.1), (-7895.9, -6605), (-8025.3, -6615.6), (-8027.2, -6593.5),
        (-7950, -6586.7), (-7948.6, -6585.2), (-7952.9, -6535.5), (-7954.1, -6533.9), (-8032.7, -6540.1)]

WHITE = (0.95, 0.94, 0.90)
WHITE_SH = (0.86, 0.86, 0.84)
SLAB = (0.98, 0.97, 0.94)
RAIL = (0.90, 0.90, 0.88)
GLASS = (0.50, 0.58, 0.64)
TEAL = (0.26, 0.52, 0.52)
PEACH = (0.93, 0.70, 0.56)
ROOF = (0.80, 0.80, 0.78)
GROUND = (0.20, 0.22, 0.24)
PAVING = (0.80, 0.74, 0.66)
STONE = (0.88, 0.84, 0.76)
WATER = (0.22, 0.70, 0.78)
ROCK = (0.72, 0.70, 0.66)
ROCKD = (0.55, 0.53, 0.50)
FALL = (0.92, 0.95, 0.97)
POSTC = (0.62, 0.60, 0.56)
LOUNGER = (0.95, 0.95, 0.93)

# OSM swimming pool in the courtyard (region r_2_5), world x,z.
POOL = [
    (-8046.5, -6558.5), (-8045.6, -6554.4), (-8041.6, -6551.7), (-8035.8, -6551.7),
    (-8032.5, -6555.7), (-8032.4, -6561.7), (-8029.5, -6567.7), (-8022.6, -6568.8),
    (-8018.3, -6564.5), (-8008.7, -6568.0), (-7999.6, -6559.9), (-7995.1, -6551.9),
    (-7991.7, -6558.8), (-7989.3, -6575.8), (-7996.0, -6578.3), (-8002.9, -6577.8),
    (-8010.8, -6571.9), (-8024.2, -6575.3), (-8029.1, -6585.7), (-8034.1, -6585.6),
    (-8042.7, -6569.5), (-8045.0, -6561.6),
]

FH = 3.0
GF = 3.6
FLOORS = 5          # balcony floors above the ground floor: 6 floors in all


def _hull(pts):
    pts = sorted(set((round(x, 2), round(z, 2)) for x, z in pts))

    def cross(o, a, b):
        return (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0])

    lower = []
    for p in pts:
        while len(lower) >= 2 and cross(lower[-2], lower[-1], p) <= 0:
            lower.pop()
        lower.append(p)
    upper = []
    for p in reversed(pts):
        while len(upper) >= 2 and cross(upper[-2], upper[-1], p) <= 0:
            upper.pop()
        upper.append(p)
    return lower[:-1] + upper[:-1]


def _loc(x, z, y):
    return (x - O[0], y, z - O[1])


def _outward(cx, cz, x0, z0, x1, z1):
    dx, dz = x1 - x0, z1 - z0
    L = math.hypot(dx, dz) or 1.0
    nx, nz = dz / L, -dx / L
    mx, mz = (x0 + x1) / 2, (z0 + z1) / 2
    if (mx + nx - cx) ** 2 + (mz + nz - cz) ** 2 < (mx - cx) ** 2 + (mz - cz) ** 2:
        nx, nz = -nx, -nz
    return nx, nz


def coping(mesh, pts, y0, y1, out=0.55):
    """Coping lip around a CCW world ring. pts are world x,z."""
    loc = [(x - O[0], z - O[1]) for x, z in pts]
    cx = sum(p[0] for p in loc) / len(loc)
    cz = sum(p[1] for p in loc) / len(loc)
    cen = (cx, y0 - 3, cz)
    n = len(loc)
    for i in range(n):
        x0, z0 = loc[i]
        x1, z1 = loc[(i + 1) % n]
        nx, nz = _outward(cx, cz, x0, z0, x1, z1)
        ox, oz = nx * out, nz * out
        A, B = (x0, y0, z0), (x1, y0, z1)
        C, D = (x1 + ox, y1, z1 + oz), (x0 + ox, y1, z0 + oz)
        E, F = (x1 + ox, y0, z1 + oz), (x0 + ox, y0, z0 + oz)
        tri_out(mesh, A, B, C, cen)
        tri_out(mesh, A, C, D, cen)
        tri_out(mesh, F, E, C, cen)
        tri_out(mesh, F, C, D, cen)


def circle(n, c, r):
    cx, cz = c
    return [(cx + math.cos(i / n * math.tau) * r, cz + math.sin(i / n * math.tau) * r) for i in range(n)]


def add_pools(M):
    """Stone deck, turquoise basins and the rock waterfall in the courtyard.

    The deck also covers the lavender OSM house that was drawing as a purple
    box on the beach end of the pool. That house is suppressed by a hide point.
    """
    paving, water, stone = M.mesh(0, "paving"), M.mesh(0, "water"), M.mesh(0, "stone")
    rock, rockd, fall = M.mesh(0, "rock"), M.mesh(0, "rockd"), M.mesh(0, "fall")

    def slab(mesh, x0, x1, z0, z1, y0, y1):
        a, b = _loc(x0, z0, y0), _loc(x1, z1, y1)
        prism(mesh, a[0], b[0], a[2], b[2], y0, y1)

    # west apron sits on the purple-box footprint; the east slab is the courtyard
    slab(paving, -8063, -8035.5, -6598, -6546, 0.08, 0.50)
    slab(paving, -8035.5, -7984, -6588, -6546, 0.08, 0.50)
    slab(M.mesh(1, "paving"), -8063, -7984, -6598, -6546, 0.08, 0.46)

    hull = _hull(POOL)
    fan(water, [(x - O[0], z - O[1]) for x, z in hull], 0.64)
    coping(stone, hull, 0.50, 0.80, 0.7)
    xs = [x - O[0] for x, _ in hull]
    zs = [z - O[1] for _, z in hull]
    prism(M.mesh(1, "water"), min(xs), max(xs), min(zs), max(zs), 0.52, 0.62)

    spa = circle(14, (-8058.0, -6576.5), 3.6)
    fan(water, [(x - O[0], z - O[1]) for x, z in spa], 0.66)
    coping(stone, spa, 0.50, 0.78, 0.42)

    rocks = [
        (-8044.0, -6566.0, 7.2, 5.6, 2.5),
        (-8048.2, -6562.2, 5.6, 5.0, 3.7),
        (-8041.2, -6557.6, 5.0, 4.2, 2.9),
        (-8050.4, -6568.2, 4.2, 3.6, 1.8),
        (-8038.2, -6564.2, 3.8, 3.0, 1.6),
        (-8045.6, -6555.2, 3.4, 3.0, 2.2),
        (-8051.6, -6559.8, 3.0, 2.6, 1.3),
        (-8042.4, -6570.6, 3.2, 2.4, 1.15),
    ]
    for i, (x, z, sx, sz, h) in enumerate(rocks):
        m = rock if i % 2 == 0 else rockd
        x0, _, z0 = _loc(x - sx / 2, z - sz / 2, 0.48)
        prism(m, x0, x0 + sx, z0, z0 + sz, 0.48, 0.48 + h)
    slab(M.mesh(1, "rock"), -8052, -8037, -6571, -6554, 0.48, 3.3)
    # west face (beach camera) and east face (pool camera)
    for x0, z0, x1, z1, top, side in (
        (-8051.4, -6564.4, -8051.4, -6560.0, 3.8, 1),
        (-8050.6, -6563.4, -8050.6, -6560.6, 3.0, 1),
        (-8040.6, -6563.0, -8040.6, -6558.8, 2.8, -1),
        (-8041.4, -6564.2, -8041.4, -6559.6, 2.2, -1),
    ):
        A, B = _loc(x0, z0, 0.62), _loc(x1, z1, 0.62)
        C, D = _loc(x1, z1, top), _loc(x0, z0, top)
        cen = _loc(x0 + 3 * side, (z0 + z1) / 2, 2)
        tri_out(fall, A, B, C, cen)
        tri_out(fall, A, C, D, cen)

    for a, b in (
        ((-8060.5, -6586.5), (-8052.2, -6585.0)),
        ((-8061.0, -6552.2), (-8053.4, -6550.8)),
    ):
        F = Frame(a, b, O)
        hip_roof(M.mesh(0, "teal"), F, -0.3, F.L + 0.3, -2.5, 2.5, 2.5, 1.45)
        for s in (-1, 1):
            for u in (0.35, max(0.5, F.L - 0.35)):
                obox(M.mesh(0, "post"), F, u - 0.1, u + 0.1, s * 2.05, s * 2.35, 0.5, 2.5)

    for i, x in enumerate(range(-8030, -8002, 4)):
        z = -6550.4 if i % 2 == 0 else -6552.2
        x0, _, z0 = _loc(x, z, 0)
        prism(M.mesh(0, "lounger"), x0, x0 + 1.85, z0, z0 + 0.7, 0.50, 0.76)


def build():
    M = Model("m_marriottoceanclub")
    for n, c, r in (("wall", WHITE, .85), ("recess", WHITE_SH, .9), ("slab", SLAB, .8), ("rail", RAIL, .5),
                    ("glass", GLASS, .2), ("teal", TEAL, .55), ("peach", PEACH, .85), ("roof", ROOF, .9),
                    ("ground", GROUND, .3), ("paving", PAVING, .85), ("stone", STONE, .7),
                    ("rock", ROCK, .95), ("rockd", ROCKD, 1), ("post", POSTC, .8), ("lounger", LOUNGER, .6)):
        M.material(n, tuple(round(v ** 2.2, 4) for v in c), rough=r)
    M.material("water", tuple(round(v ** 2.2, 4) for v in WATER), rough=.12, emissive=.06)
    M.material("fall", tuple(round(v ** 2.2, 4) for v in FALL), rough=.25, emissive=.2)
    mats = {"wall": "wall", "recess": "recess", "slab": "slab", "rail": "rail", "glass": "glass", "fin": "wall"}
    ring = ccw([(x - O[0], z - O[1]) for x, z in RING])
    for lod in (0, 1):
        wall_ring(M.mesh(lod, "ground"), ring, -2.0, 0.6)
        wall_ring(M.mesh(lod, "wall"), ring, 0.6, GF)
        ear_fan(M.mesh(lod, "roof"), ring, GF)

    def gable(lod, F, u, s, hv, y0, w=9.0, h=4.2):
        # small peach-faced gable standing proud of the hip slope on face s
        v = s * (hv + 0.35)
        A, B, C = F.p(u - w / 2, v, y0), F.p(u + w / 2, v, y0), F.p(u, v, y0 + h)
        cen = F.p(u, 0, y0)
        tri_out(M.mesh(lod, "peach"), A, B, C, cen)
        # its teal roof: two slopes back into the hip
        D = F.p(u, s * (hv - 3.5), y0 + h)
        for P, Q in ((A, C), (C, B)):
            Pb = (P[0] - F.vx * s * 3.8, P[1], P[2] - F.vz * s * 3.8)
            for m in (M.mesh(lod, "teal"),):
                tri_out(m, P, Q, D, cen)
                tri_out(m, P, Pb, D, cen)

    def wing(a, b, hv, floors, gables=(), ornament=False):
        F = Frame(a, b, O)
        top = balcony_wing(M, F, 0, F.L, hv, GF, floors, FH, 4.2, mats, depth=1.7)
        for lod in (0, 1):
            obox(M.mesh(lod, "slab"), F, -0.15, F.L + 0.15, -hv - 0.15, hv + 0.15, top, top + 0.7)
            hip_roof(M.mesh(lod, "teal"), F, -0.6, F.L + 0.6, -hv - 0.6, hv + 0.6, top + 0.7, 6.0)
            if lod == 0:
                for u in gables:
                    for s in (-1, 1):
                        gable(lod, F, u, s, hv, top + 0.7)
        if ornament:
            # beach end (u=0): blank wall, column of windows, stepped peach panel
            for lod in (0, 1):
                ob = M.mesh(lod, "wall")
                obox(ob, F, -0.4, 0.0, -hv, hv, GF, top)
                p = M.mesh(lod, "peach")
                y = top - 5.2
                for k, (w, h) in enumerate(((7.0, 1.2), (5.4, 1.0), (3.6, 1.0), (1.8, 0.9))):
                    uquad(p, F, -0.45, -w / 2, w / 2, y, y + h, -1)
                    y += h
                if lod == 0:
                    g = M.mesh(lod, "glass")
                    for f in range(floors):
                        yy = GF + f * FH + 0.8
                        for vv in (-hv + 2.2, hv - 2.2):
                            uquad(g, F, -0.45, vv - 0.6, vv + 0.6, yy, yy + 1.5, -1)
        return F, top

    # north wing and south wing, beach (west) end first
    FN, topn = wing((-8031.0, -6529.0), (-7946.0, -6522.5), 10.5, FLOORS, gables=(26.0, 58.0), ornament=True)
    FS, tops = wing((-8024.5, -6604.0), (-7953.0, -6597.8), 10.5, FLOORS, gables=(24.0, 52.0), ornament=True)
    # east stem joining them along the street side
    FE, tope = wing((-7945.3, -6533.0), (-7943.2, -6587.0), 7.0, FLOORS, gables=(27.0,))
    # lower lobby block at the south-east corner, by the porte-cochere
    FL = Frame((-7916.0, -6557.0), (-7912.0, -6604.0), O)
    topl = balcony_wing(M, FL, 0, FL.L, 15.0, GF, 2, FH, 4.2, mats, depth=1.4)
    for lod in (0, 1):
        obox(M.mesh(lod, "slab"), FL, -0.15, FL.L + 0.15, -15.15, 15.15, topl, topl + 0.6)
        hip_roof(M.mesh(lod, "teal"), FL, -0.6, FL.L + 0.6, -15.6, 15.6, topl + 0.6, 4.0)
        if lod == 0:
            gable(lod, FL, FL.L / 2, -1, 15.0, topl + 0.6, w=9.0, h=3.6)
    add_pools(M)
    info = write_glb(M, HERO / "m_marriottoceanclub.glb")
    check_glb(HERO / "m_marriottoceanclub.glb")
    if info["lod0"] > 4500:
        print("WARN lod0", info["lod0"])
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    patch(info)
    buried = bury_pool_blob()
    print("oceanclub", info, "tops", round(topn, 1), round(topl, 1), "buried", buried)
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "m_marriottoceanclub"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = re.sub(r'"m_marriottoceanclub_lod0": \d+', f'"m_marriottoceanclub_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"m_marriottoceanclub_lod1": \d+', f'"m_marriottoceanclub_lod1": {info["lod1"]}', block, count=1)
    old_hide = '"hide": [\n   [\n    -7960.6,\n    -6609.7\n   ]\n  ]'
    new_hide = ('"hide": [\n   [\n    -7960.6,\n    -6609.7\n   ],\n   [\n    -8048.0,\n    -6584.0\n   ]\n  ]')
    if old_hide in block:
        block = block.replace(old_hide, new_hide, 1)
    elif "-8048.0" not in block:
        raise SystemExit("ocean club hide anchor missing")
    if "Courtyard pool and deck" not in block:
        block = block.replace(
            "OSM way 643104752",
            "OSM way 643104752. Courtyard pool and deck replace the lavender OSM house "
            "(-8048, -6584) and the flat OSM pool under it",
            1,
        )
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == "m_marriottoceanclub")
    assert hit["tris"]["m_marriottoceanclub_lod0"] == info["lod0"]
    assert [-8048.0, -6584.0] in hit["hide"]


def bury_pool_blob():
    """The marriottpool hero sits on this courtyard but its quantized mesh is a
    cloud of 100 m triangles. Replace it with a marker under the sand so the
    new deck is what you see. Same id and origin."""
    M = Model("marriottpool")
    M.material("mark", (0.3, 0.3, 0.3), rough=1)
    for lod in (0, 1):
        prism(M.mesh(lod, "mark"), -0.4, 0.4, -0.4, 0.4, -2.4, -1.8)
    info = write_glb(M, HERO / "marriottpool.glb")
    check_glb(HERO / "marriottpool.glb")
    text = MANIFEST.read_text()
    i = text.find('"id": "marriottpool"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = re.sub(r'"marriottpool_lod0": \d+', f'"marriottpool_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"marriottpool_lod1": \d+', f'"marriottpool_lod1": {info["lod1"]}', block, count=1)
    MANIFEST.write_text(text[:i] + block + text[k:])
    return info


if __name__ == "__main__":
    build()
