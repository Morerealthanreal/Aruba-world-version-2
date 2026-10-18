#!/usr/bin/env python3
"""Sint Anna Kerk, Noord: the grey-and-white church and the cemetery south of it.

Same hero id, origin and OSM footprint. The 2020 paint (Commons, CC BY-SA) is
blue-grey walls, white quoins and a stepped gable, a light-grey metal roof and
a dark spire with a cross. The yellow paint in the 2014 photo is the old colour.
The white tomb grid sits immediately south of the nave; the Jesus statue north
of the church is the separate sa_grounds hero and is not rebuilt here.
"""
import json
import math
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, gable_roof, prism, write_glb  # noqa: E402
from hotelkit import tri_out  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-6641.72, -4706.28)

GREY = (0.58, 0.64, 0.70)
GREY_D = (0.46, 0.52, 0.58)
WHITE = (0.94, 0.94, 0.92)
ROOF = (0.75, 0.77, 0.79)
SPIRE = (0.08, 0.11, 0.10)
DOOR = (0.36, 0.20, 0.12)
LOUVER = (0.86, 0.84, 0.76)
GLASS = (0.20, 0.24, 0.28)
TOMB = (0.91, 0.91, 0.89)
TOMB_D = (0.78, 0.78, 0.76)
PATH = (0.70, 0.68, 0.64)

# nave in hero-local metres. West facade faces the road (local -x).
X0, X1 = -38.0, 6.5
Z0, Z1 = -9.6, 9.6
WALL = 8.05
PEAK = 13.15


def lin(c):
    return tuple(round(v ** 2.2, 4) for v in c)


def q(mesh, A, B, C, D, cen):
    tri_out(mesh, A, B, C, cen)
    tri_out(mesh, A, C, D, cen)


def arch_x(M, x, zc, yb, spring, radius, out=-1, segs=8, frame=0.22,
           glass="glass", trim="white"):
    """Opening on a constant-x wall. out=-1 faces west."""
    r = radius
    cen = (x - out * 6.0, (yb + spring + r) / 2, zc)
    g = M.mesh(0, glass)
    q(g, (x, yb, zc - r), (x, yb, zc + r), (x, spring, zc + r), (x, spring, zc - r), cen)
    mid = (x, spring, zc)
    pts = []
    for i in range(segs + 1):
        ang = math.pi - math.pi * i / segs
        pts.append((spring + r * math.sin(ang), zc + r * math.cos(ang)))
    for i in range(segs):
        tri_out(g, mid, (x, pts[i][0], pts[i][1]), (x, pts[i + 1][0], pts[i + 1][1]), cen)
    xf = x + out * 0.06  # proud of the wall, toward the outside. out=-1 → smaller x
    # wait: out=-1 faces west, outside is smaller x, so proud is x + out*0.06 = x-0.06. yes.
    fr = M.mesh(0, trim)
    t = frame
    q(fr, (xf, yb, zc - r - t), (xf, yb, zc - r), (xf, spring, zc - r), (xf, spring, zc - r - t), cen)
    q(fr, (xf, yb, zc + r), (xf, yb, zc + r + t), (xf, spring, zc + r + t), (xf, spring, zc + r), cen)
    outer = []
    for i in range(segs + 1):
        ang = math.pi - math.pi * i / segs
        outer.append((spring + (r + t) * math.sin(ang), zc + (r + t) * math.cos(ang)))
    for i in range(segs):
        q(fr, (xf, pts[i][0], pts[i][1]), (xf, pts[i + 1][0], pts[i + 1][1]),
          (xf, outer[i + 1][0], outer[i + 1][1]), (xf, outer[i][0], outer[i][1]), cen)


def oculus(M, x, zc, y, r, segs=12):
    cen = (x + 6.0, y, zc)
    g = M.mesh(0, "glass")
    for i in range(segs):
        a0 = 2 * math.pi * i / segs
        a1 = 2 * math.pi * (i + 1) / segs
        tri_out(g, (x, y, zc),
                (x, y + r * math.sin(a0), zc + r * math.cos(a0)),
                (x, y + r * math.sin(a1), zc + r * math.cos(a1)), cen)
    fr = M.mesh(0, "white")
    t = 0.28
    for i in range(segs):
        a0 = 2 * math.pi * i / segs
        a1 = 2 * math.pi * (i + 1) / segs
        q(fr,
          (x - 0.05, y + r * math.sin(a0), zc + r * math.cos(a0)),
          (x - 0.05, y + r * math.sin(a1), zc + r * math.cos(a1)),
          (x - 0.05, y + (r + t) * math.sin(a1), zc + (r + t) * math.cos(a1)),
          (x - 0.05, y + (r + t) * math.sin(a0), zc + (r + t) * math.cos(a0)), cen)


def cone(mesh, cx, cz, y0, y1, r, n=8):
    cen = (cx, (y0 + y1) / 2, cz)
    apex = (cx, y1, cz)
    ring = []
    for i in range(n):
        a = 2 * math.pi * i / n
        ring.append((cx + r * math.cos(a), cz + r * math.sin(a)))
    for i in range(n):
        x0, z0 = ring[i]
        x1, z1 = ring[(i + 1) % n]
        tri_out(mesh, (x0, y0, z0), (x1, y0, z1), apex, cen)


def build():
    M = Model("santaanna_kerk")
    for n, c, r in (
        ("grey", GREY, .85), ("greyd", GREY_D, .9), ("white", WHITE, .7),
        ("roof", ROOF, .55), ("spire", SPIRE, .45), ("door", DOOR, .8),
        ("louver", LOUVER, .7), ("glass", GLASS, .25), ("tomb", TOMB, .8),
        ("tombd", TOMB_D, .85), ("path", PATH, .95),
    ):
        M.material(n, lin(c), rough=r)

    # nave and the lower east sacristy
    for lod in (0, 1):
        prism(M.mesh(lod, "grey"), X0, X1, Z0, Z1, 0.15, WALL)
        gable_roof(M.mesh(lod, "roof"), X0 - 0.4, X1 + 0.3, Z0 - 0.55, Z1 + 0.55, WALL - 0.05, PEAK)
        prism(M.mesh(lod, "grey"), X1 - 0.2, 16.2, -6.2, 6.2, 0.15, 6.4)
        gable_roof(M.mesh(lod, "roof"), X1, 16.6, -6.6, 6.6, 6.35, 9.4)
        # gable walls
        cen = (0, 8, 0)
        tri_out(M.mesh(lod, "grey"), (X0, WALL, Z0), (X0, PEAK, 0), (X0, WALL, Z1), (X0 + 8, 10, 0))
        tri_out(M.mesh(lod, "grey"), (X1, WALL, Z1), (X1, PEAK, 0), (X1, WALL, Z0), (X1 - 8, 10, 0))
    # white eaves
    for lod in (0, 1):
        prism(M.mesh(lod, "white"), X0, X1, Z0 - 0.35, Z0, WALL - 0.45, WALL + 0.15)
        prism(M.mesh(lod, "white"), X0, X1, Z1, Z1 + 0.35, WALL - 0.45, WALL + 0.15)

    # west facade: white quoins, stepped gable edges, the arched window and door
    x = X0 - 0.04
    # corner quoins
    for z0, z1 in ((Z0, Z0 + 0.7), (Z1 - 0.7, Z1)):
        prism(M.mesh(0, "white"), X0 - 0.12, X0 + 0.15, z0, z1, 0.2, WALL)
    # stepped white edges of the gable
    for i, (yy, zw) in enumerate((
        (8.3, 8.6), (9.15, 7.2), (10.0, 5.8), (10.85, 4.5), (11.7, 3.2), (12.45, 2.0),
    )):
        prism(M.mesh(0, "white"), X0 - 0.16, X0 - 0.02, -zw, zw, yy, yy + 0.38)
    # chevron band, the white zig-zag under the oculus
    for i, yy in enumerate((10.15, 10.55, 10.95)):
        zw = 2.4 - i * 0.35
        for s in (-1, 1):
            q(M.mesh(0, "white"),
              (x - 0.02, yy, s * 0.3), (x - 0.02, yy, s * zw),
              (x - 0.02, yy + 0.32, s * (zw - 0.55)), (x - 0.02, yy + 0.32, s * 0.15),
              (x + 4, yy, 0))
    oculus(M, x, 0, 11.55, 0.72)
    # tall louvered arch, blue-grey reveal then the louvers
    arch_x(M, x, 0, 4.7, 8.15, 1.55, glass="greyd", trim="white", frame=0.28)
    arch_x(M, x - 0.05, 0, 4.95, 7.9, 1.25, glass="louver", trim="white", frame=0.12, segs=7)
    for k in range(6):
        yy = 5.3 + k * 0.55
        prism(M.mesh(0, "greyd"), X0 - 0.14, X0 - 0.08, -1.05, 1.05, yy, yy + 0.08)
    # two smaller arches flanking the centre, and the round windows on the grey shoulders
    for s in (-1, 1):
        arch_x(M, x, s * 3.15, 1.3, 3.55, 0.85, glass="louver", trim="white", frame=0.18, segs=6)
        oculus(M, x, s * 6.3, 5.6, 0.85)
    # arched door
    arch_x(M, x - 0.02, 0, 0.25, 2.55, 1.05, glass="door", trim="white", frame=0.2, segs=6)
    prism(M.mesh(0, "white"), X0 - 0.2, X0 - 0.08, -0.08, 0.08, 0.4, 2.4)

    # tower and spire on the west gable
    tx0, tx1 = X0 - 0.8, X0 + 3.4
    for lod in (0, 1):
        prism(M.mesh(lod, "white"), tx0, tx1, -1.7, 1.7, 12.7, 16.6)
        prism(M.mesh(lod, "white"), tx0 - 0.15, tx1 + 0.15, -1.95, 1.95, 16.35, 17.05)
        cone(M.mesh(lod, "spire"), (tx0 + tx1) / 2, 0, 16.9, 29.2, 1.55, 8 if lod == 0 else 4)
    # four dark openings in the white belfry, and the cross
    for s in (-1, 1):
        prism(M.mesh(0, "spire"), tx0 - 0.05, tx0 + 0.02, s * 0.25, s * 0.85, 13.3, 15.4)
        prism(M.mesh(0, "spire"), (tx0 + tx1) / 2 + s * 0.35, (tx0 + tx1) / 2 + s * 0.95,
              -1.72, -1.66, 13.3, 15.4)
    cx = (tx0 + tx1) / 2
    prism(M.mesh(0, "white"), cx - 0.08, cx + 0.08, -0.08, 0.08, 29.0, 31.3)
    prism(M.mesh(0, "white"), cx - 0.55, cx + 0.55, -0.07, 0.07, 30.35, 30.55)

    # long sides: buttresses and an arched window between each pair
    for side, zwall, zout in ((1, Z1, Z1 + 0.85), (-1, Z0, Z0 - 0.85)):
        xs = [X0 + 1.5 + i * 6.4 for i in range(6)]
        for xx in xs:
            for lod in (0, 1):
                z_a, z_b = sorted((zwall - side * 0.05, zout))
                prism(M.mesh(lod, "white"), xx - 0.38, xx + 0.38, z_a, z_b, 0.2, WALL - 0.3)
            if xx < X1 - 2:
                # window centered between this buttress and the next, lod0
                pass
        for i in range(5):
            mx = (xs[i] + xs[i + 1]) / 2
            # arch in the z = zwall plane, facing south (side>0) or north
            zf = zwall + side * 0.05
            cen = (mx, 4, zf - side * 6)
            r = 0.7
            spring, yb = 3.5, 1.5
            g = M.mesh(0, "louver")
            q(g, (mx - r, yb, zf), (mx + r, yb, zf), (mx + r, spring, zf), (mx - r, spring, zf), cen)
            mid = (mx, spring, zf)
            segs = 6
            pts = []
            for k in range(segs + 1):
                ang = math.pi - math.pi * k / segs
                pts.append((mx + r * math.cos(ang), spring + r * math.sin(ang)))
            for k in range(segs):
                tri_out(g, mid, (pts[k][0], pts[k][1], zf), (pts[k + 1][0], pts[k + 1][1], zf), cen)
            fr = M.mesh(0, "white")
            t = 0.16
            zfr = zf + side * 0.04
            q(fr, (mx - r - t, yb, zfr), (mx - r, yb, zfr), (mx - r, spring, zfr), (mx - r - t, spring, zfr), cen)
            q(fr, (mx + r, yb, zfr), (mx + r + t, yb, zfr), (mx + r + t, spring, zfr), (mx + r, spring, zfr), cen)
    # small south porch with a dark roof, just east of the front
    prism(M.mesh(0, "grey"), X0 + 2.2, X0 + 6.4, Z1 - 0.1, Z1 + 2.4, 0.2, 3.6)
    gable_roof(M.mesh(0, "spire"), X0 + 2.0, X0 + 6.6, Z1 - 0.2, Z1 + 2.6, 3.5, 4.6)

    # cemetery: the white tomb grid south of the nave (larger world z)
    # local z positive is south. Keep it east of the road.
    cols, rows = 9, 8
    x_start, z_start = -30.0, 16.0
    dx, dz = 4.6, 5.2
    for lod in (0, 1):
        prism(M.mesh(lod, "path"), x_start - 2, x_start + cols * dx + 1,
              z_start - 2, z_start + rows * dz + 1, 0.02, 0.12)
    for j in range(rows):
        for i in range(cols):
            cx = x_start + i * dx
            cz = z_start + j * dz
            tall = (i + j) % 3 == 0
            prism(M.mesh(0, "tomb"), cx, cx + 1.7, cz, cz + 0.85, 0.12, 0.62 if not tall else 0.85)
            prism(M.mesh(0, "tombd"), cx + 0.15, cx + 1.55, cz + 0.12, cz + 0.73, 0.62, 0.78)
            if tall:
                prism(M.mesh(0, "white"), cx + 0.75, cx + 0.95, cz + 0.35, cz + 0.5, 0.78, 1.35)
                prism(M.mesh(0, "white"), cx + 0.55, cx + 1.15, cz + 0.38, cz + 0.48, 1.05, 1.18)
    # lod1: one slab per row, so the cemetery still reads from the road
    for j in range(rows):
        cz = z_start + j * dz
        prism(M.mesh(1, "tomb"), x_start, x_start + cols * dx - 2.2, cz, cz + 0.9, 0.12, 0.55)

    info = write_glb(M, HERO / "santaanna_kerk.glb")
    check_glb(HERO / "santaanna_kerk.glb")
    print("santaanna", info)
    if not (2500 <= info["lod0"] <= 4500):
        print("WARN lod0", info["lod0"])
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    patch(info)
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "santaanna_kerk"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = block.replace('"status": "v4-mall-detail"',
                           '"status": "v4-grokbot (grey/white, cemetery south)"', 1)
    block = re.sub(r'"santaanna_kerk_lod0": \d+', f'"santaanna_kerk_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"santaanna_kerk_lod1": \d+', f'"santaanna_kerk_lod1": {info["lod1"]}', block, count=1)
    block = block.replace('"textures": 1', '"textures": 0', 1)
    old = ('"ref_sources": "n7.mp4 (Sint Anna Kerk, Noord: yellow church, tall white spire, '
           'pink boundary wall); OSM 3674 \\"Saint Anna\\"; tower/spire proportions approx."')
    new = ('"ref_sources": "Commons Church of Santa Ana Aruba.jpg (Seagullbayaruba / Carlos Naranjo, '
           '2020-09-15, CC BY-SA 4.0) and Santa Anna Church.jpg (Musicfan1077, 2020-09-16, CC BY-SA 4.0): '
           'grey walls, white stepped gable, light-grey metal roof, dark spire. Cemetery is the tomb '
           'grid south of the nave on the Esri aerial. Built by tools/grokbot/santaanna.py"')
    if old in block:
        block = block.replace(old, new, 1)
    elif "tools/grokbot/santaanna.py" not in block:
        raise SystemExit("santaanna ref anchor missing")
    block = block.replace("generated by /workspace/landmarks/gen.mjs",
                           "generated by tools/grokbot/santaanna.py", 1)
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == "santaanna_kerk")
    assert hit["tris"]["santaanna_kerk_lod0"] == info["lod0"]
    assert hit["tris"]["santaanna_kerk_lod1"] == info["lod1"]


if __name__ == "__main__":
    build()
