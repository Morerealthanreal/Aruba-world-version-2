#!/usr/bin/env python3
"""Close the coast-road curb gaps, place the Arubus stops, and dress parking.

The Palm Beach hotel frontage already has pb_busstops. North of the Ritz the
drive is Avenida Nelson O. Oduber, then L.G. Smith Boulevard through Malmok
and Boca Catalina to Arashi. This pass:

- draws a concrete curb wherever that road has no engine sidewalk, including
  across the height steps and narrow tracks that left holes in the shoulder
- puts a blue-roof shelter at each OSM bus_stop on that stretch
- replaces the tall flat commercial box beside the Arashi lot with the low
  orange-roof shop the hill photo shows
- lays the Malmok and Boca Catalina beach parking (gravel, a few cars, a
  P board, and a name board)

Golf, the Tierra del Sol resort, and the hotel shells stay out. textures 0.
"""
import json
import math
import sys
from pathlib import Path

from PIL import Image

from hero_glb import Model, box, check_glb, write_glb

ROOT = Path(__file__).resolve().parents[1]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
REAL = ROOT / "game" / "data" / "real"
X0, Z0, RS, STEP = -10800.0, -11800.0, 1000.0, 4.0

Z_SOUTH, Z_NORTH = -7120.0, -10004.0
COAST_NAMES = ("Avenida Nelson O. Oduber", "L.G. Smith Boulevard")
PREFIX = "nw_rd_"

CONC = (0.72, 0.70, 0.64)
GRAVEL = (0.52, 0.48, 0.42)
BLUE = (0.13, 0.34, 0.62)
WHITE = (0.92, 0.90, 0.86)
YELLOW = (0.86, 0.70, 0.16)
BLACK = (0.12, 0.12, 0.13)
CREAM = (0.90, 0.86, 0.76)
ROOF = (0.74, 0.34, 0.16)
GLASS = (0.45, 0.62, 0.74)
DOOR = (0.28, 0.36, 0.46)
WOOD = (0.42, 0.28, 0.16)
CARS = (
    (0.16, 0.18, 0.22),
    (0.18, 0.32, 0.55),
    (0.62, 0.14, 0.12),
    (0.78, 0.76, 0.70),
)

# One hero per stretch so a player next to the pieces is inside the 700 m cap.
SEGMENTS = (
    ("nw_rd_north", -7120.0, -8200.0),
    ("nw_rd_mid", -8200.0, -9150.0),
    ("nw_rd_boca", -9150.0, -9700.0),
    ("nw_rd_arashi", -9700.0, -10010.0),
)

# OSM highway=bus_stop nodes on L10 north of the hotel strip. Pairs that sit
# on the same shoulder a few metres apart are one stop.
STOPS = (
    ("HADI", -8219.5, -7320.0),
    ("458", -8289.0, -7476.0),
    ("ZUID", -8427.0, -7870.0),
    ("MALMOK", -8715.0, -8870.0),
    ("TRES", -8778.0, -9086.0),
    ("BOCA", -8856.0, -9466.0),
    ("ARASHI", -9008.0, -9908.0),
)

# OSM parking ways, world metres. Arashi's roadside lot (way 98860441) is
# already arashi_roadpark and is not repeated here.
LOTS = (
    ("zuid", "lane", [(-8441.8, -7897.2), (-8443.2, -7893.1), (-8423.4, -7836.3), (-8419.7, -7834.2)]),
    ("south", "street", [(-8490.2, -8044.9), (-8493.7, -8047.4), (-8510.3, -8103.1), (-8509.1, -8108.2)]),
    ("mid", "street", [(-8638.8, -8574.5), (-8639.4, -8565.8), (-8632.1, -8540.1), (-8628.5, -8537.0)]),
    ("malmok", "street", [(-8710.6, -8842.0), (-8712.0, -8835.3), (-8705.1, -8808.1), (-8700.7, -8804.6)]),
    ("boca_s", "surface", [(-8830.0, -9314.3), (-8835.7, -9312.9), (-8827.1, -9277.5), (-8821.4, -9278.9)]),
    ("boca_n", "surface", [(-8842.2, -9360.6), (-8847.7, -9359.4), (-8839.4, -9323.6), (-8833.9, -9324.9)]),
)

# The tall flat 'com' box beside the lot. The hill photo shows a low
# orange-roof shop, not a 7 m extrusion.
SHOP = [
    [-9021.7, -9849.2],
    [-9016.6, -9849.1],
    [-9016.6, -9847.5],
    [-9013.0, -9847.5],
    [-9012.9, -9851.7],
    [-9013.9, -9851.7],
    [-9013.9, -9858.5],
    [-9021.7, -9858.6],
]

# Block letters, strokes in a 1x1 cell, v up.
GLYPHS = {
    "A": [((0.08, 0.0), (0.5, 1.0)), ((0.92, 0.0), (0.5, 1.0)), ((0.24, 0.38), (0.76, 0.38))],
    "B": [((0.12, 0.0), (0.12, 1.0)), ((0.12, 1.0), (0.68, 1.0)), ((0.68, 1.0), (0.68, 0.52)),
          ((0.12, 0.52), (0.72, 0.52)), ((0.12, 0.0), (0.68, 0.0)), ((0.68, 0.52), (0.68, 0.0)),
          ((0.68, 0.52), (0.9, 0.76)), ((0.9, 0.76), (0.68, 1.0)), ((0.68, 0.0), (0.92, 0.26)),
          ((0.92, 0.26), (0.68, 0.52))],
    "C": [((0.88, 0.84), (0.22, 1.0)), ((0.22, 1.0), (0.12, 0.5)), ((0.12, 0.5), (0.22, 0.0)), ((0.22, 0.0), (0.88, 0.16))],
    "D": [((0.12, 0.0), (0.12, 1.0)), ((0.12, 1.0), (0.62, 1.0)), ((0.62, 1.0), (0.9, 0.5)),
          ((0.9, 0.5), (0.62, 0.0)), ((0.62, 0.0), (0.12, 0.0))],
    "E": [((0.16, 0.0), (0.16, 1.0)), ((0.16, 1.0), (0.86, 1.0)), ((0.16, 0.5), (0.72, 0.5)), ((0.16, 0.0), (0.86, 0.0))],
    "H": [((0.14, 0.0), (0.14, 1.0)), ((0.86, 0.0), (0.86, 1.0)), ((0.14, 0.5), (0.86, 0.5))],
    "I": [((0.5, 0.0), (0.5, 1.0)), ((0.22, 1.0), (0.78, 1.0)), ((0.22, 0.0), (0.78, 0.0))],
    "K": [((0.16, 0.0), (0.16, 1.0)), ((0.88, 1.0), (0.2, 0.42)), ((0.32, 0.5), (0.9, 0.0))],
    "L": [((0.18, 0.0), (0.18, 1.0)), ((0.18, 0.0), (0.86, 0.0))],
    "M": [((0.06, 0.0), (0.06, 1.0)), ((0.94, 0.0), (0.94, 1.0)), ((0.06, 1.0), (0.5, 0.35)), ((0.94, 1.0), (0.5, 0.35))],
    "O": [((0.2, 0.0), (0.8, 0.0)), ((0.8, 0.0), (0.92, 0.5)), ((0.92, 0.5), (0.8, 1.0)),
          ((0.8, 1.0), (0.2, 1.0)), ((0.2, 1.0), (0.08, 0.5)), ((0.08, 0.5), (0.2, 0.0))],
    "P": [((0.16, 0.0), (0.16, 1.0)), ((0.16, 1.0), (0.7, 1.0)), ((0.7, 1.0), (0.7, 0.48)), ((0.7, 0.48), (0.16, 0.48))],
    "R": [((0.14, 0.0), (0.14, 1.0)), ((0.14, 1.0), (0.68, 1.0)), ((0.68, 1.0), (0.68, 0.5)),
          ((0.68, 0.5), (0.14, 0.5)), ((0.4, 0.5), (0.9, 0.0))],
    "S": [((0.84, 0.86), (0.2, 1.0)), ((0.2, 1.0), (0.16, 0.55)), ((0.16, 0.55), (0.84, 0.45)),
          ((0.84, 0.45), (0.8, 0.0)), ((0.8, 0.0), (0.16, 0.14))],
    "T": [((0.08, 1.0), (0.92, 1.0)), ((0.5, 1.0), (0.5, 0.0))],
    "U": [((0.14, 1.0), (0.14, 0.2)), ((0.14, 0.2), (0.5, 0.0)), ((0.5, 0.0), (0.86, 0.2)), ((0.86, 0.2), (0.86, 1.0))],
    "Z": [((0.1, 1.0), (0.9, 1.0)), ((0.9, 1.0), (0.1, 0.0)), ((0.1, 0.0), (0.9, 0.0))],
    "4": [((0.62, 0.0), (0.62, 1.0)), ((0.62, 1.0), (0.1, 0.38)), ((0.1, 0.38), (0.88, 0.38))],
    "5": [((0.84, 1.0), (0.16, 1.0)), ((0.16, 1.0), (0.16, 0.52)), ((0.16, 0.52), (0.72, 0.52)),
          ((0.72, 0.52), (0.86, 0.22)), ((0.86, 0.22), (0.16, 0.0))],
    "8": [((0.2, 0.5), (0.5, 1.0)), ((0.5, 1.0), (0.8, 0.5)), ((0.8, 0.5), (0.5, 0.5)),
          ((0.5, 0.5), (0.2, 0.5)), ((0.2, 0.5), (0.16, 0.22)), ((0.16, 0.22), (0.5, 0.0)),
          ((0.5, 0.0), (0.84, 0.22)), ((0.84, 0.22), (0.8, 0.5))],
}


_tiles = {}


def height(x, z):
    rx = int((x - X0) // RS)
    rz = int((z - Z0) // RS)
    im = _tiles.get((rx, rz))
    if im is False:
        return 0.0
    if im is None:
        p = REAL / f"h_{rx}_{rz}.png"
        if not p.exists():
            _tiles[(rx, rz)] = False
            return 0.0
        im = Image.open(p).convert("RGB")
        _tiles[(rx, rz)] = im
    lx = x - (X0 + rx * RS)
    lz = z - (Z0 + rz * RS)
    fx = min(249.999, max(0.0, lx / STEP))
    fz = min(249.999, max(0.0, lz / STEP))
    ix, iz = int(fx), int(fz)
    u, v = fx - ix, fz - iz

    def pix(i, j):
        r, g, _b = im.getpixel((i, j))
        return (r * 256 + g) / 100.0 - 50.0

    h00, h10 = pix(ix, iz), pix(ix + 1, iz)
    h01, h11 = pix(ix, iz + 1), pix(ix + 1, iz + 1)
    return (
        h00 * (1 - u) * (1 - v)
        + h10 * u * (1 - v)
        + h01 * (1 - u) * v
        + h11 * u * v
    )


def mesh_height(x, z):
    rx = int((x - X0) // RS)
    rz = int((z - Z0) // RS)
    im = _tiles.get((rx, rz))
    if im is False or im is None:
        return height(x, z)
    lx = x - (X0 + rx * RS)
    lz = z - (Z0 + rz * RS)
    fx = min(249.0, max(0.0, lx / STEP))
    fz = min(249.0, max(0.0, lz / STEP))
    ix, iz = int(fx), int(fz)
    u, v = fx - ix, fz - iz

    def pix(i, j):
        r, g, _b = im.getpixel((i, j))
        return (r * 256 + g) / 100.0 - 50.0

    h00, h10 = pix(ix, iz), pix(ix + 1, iz)
    h01, h11 = pix(ix, iz + 1), pix(ix + 1, iz + 1)
    if u + v <= 1.0:
        return h00 * (1 - u - v) + h10 * u + h01 * v
    return h10 * (1 - v) + h11 * (u + v - 1) + h01 * (1 - u)


def pip(x, z, ring):
    inside = False
    j = len(ring) - 1
    for i in range(len(ring)):
        yi, zi = ring[i]
        yj, zj = ring[j]
        if ((zi > z) != (zj > z)) and (x < (yj - yi) * (z - zi) / (zj - zi + 1e-12) + yi):
            inside = not inside
        j = i
    return inside


def load_world():
    roads, others, buildings = [], [], []
    for path in sorted(REAL.glob("r_*.json")):
        data = json.loads(path.read_text())
        for road in data["roads"]:
            pts = road["p"]
            if not any(Z_NORTH - 80 < p[1] < Z_SOUTH + 80 and -9600 < p[0] < -7600 for p in pts):
                continue
            if (road.get("n") or "") in COAST_NAMES:
                roads.append(road)
            elif (road.get("w") or 0) >= 6:
                others.append(road)
        for b in data["b"]:
            ring = b["p"]
            xs = [p[0] for p in ring]
            zs = [p[1] for p in ring]
            cx, cz = sum(xs) / len(xs), sum(zs) / len(zs)
            if -9600 < cx < -7600 and Z_NORTH - 40 < cz < Z_SOUTH + 40:
                buildings.append({"p": ring, "cx": cx, "cz": cz})
    return roads, others, buildings


def load_golf():
    data = json.loads((REAL / "tds_golf.json").read_text())
    rings = []
    for key in ("fairways", "greens", "tees", "bunkers"):
        for feat in data.get(key) or []:
            rings.append(feat["o"])
    return rings


def on_golf(x, z, rings):
    if x < -8920 or z > -8700:
        return False
    return any(pip(x, z, ring) for ring in rings)


def inside_building(buildings, x, z):
    for b in buildings:
        if abs(b["cx"] - x) > 40 or abs(b["cz"] - z) > 40:
            continue
        if pip(x, z, b["p"]):
            return True
    return False


def blocked(buildings, golf, x, z):
    return on_golf(x, z, golf) or inside_building(buildings, x, z)


def center_at(roads, z):
    name = "L.G. Smith Boulevard" if z <= -8940 else "Avenida Nelson O. Oduber"
    best = None
    for road in roads:
        if road["n"] != name:
            continue
        pts = road["p"]
        for i in range(len(pts) - 1):
            z0, z1 = pts[i][1], pts[i + 1][1]
            if abs(z1 - z0) < 1e-4:
                continue
            t = (z - z0) / (z1 - z0)
            if t < -0.001 or t > 1.001:
                continue
            x = pts[i][0] + t * (pts[i + 1][0] - pts[i][0])
            dx = pts[i + 1][0] - pts[i][0]
            dz = z1 - z0
            if best is None or x < best[0]:
                best = (x, road["w"], int(road.get("sw") or 0), dx, dz)
    return best


def build_samples(roads):
    raw = []
    z = Z_SOUTH
    while z >= Z_NORTH:
        hit = center_at(roads, z)
        z -= 4.0
        if hit is None:
            continue
        x, w, sw, dx, dz = hit
        L = math.hypot(dx, dz) or 1.0
        raw.append({"x": x, "z": z + 4.0, "w": w, "sw": sw, "tx": dx / L, "tz": dz / L})
    samples = []
    for i, s in enumerate(raw):
        if 0 < i < len(raw) - 1:
            prev, nxt = raw[i - 1], raw[i + 1]
            if abs(s["x"] - prev["x"]) > 25 and abs(s["x"] - nxt["x"]) > 25 and abs(prev["x"] - nxt["x"]) < 12:
                continue
        samples.append(s)
    return samples


def junction_points(others):
    """Points where a real side street meets the corridor. Narrow tracks are
    not openings: the curb runs through them."""
    pts = []
    for road in others:
        r = road["w"] / 2 + 1.4
        seq = road["p"]
        for i in range(len(seq) - 1):
            x0, z0 = seq[i]
            x1, z1 = seq[i + 1]
            n = max(1, int(math.hypot(x1 - x0, z1 - z0) / 3))
            for k in range(n + 1):
                t = k / n
                pts.append((x0 + (x1 - x0) * t, z0 + (z1 - z0) * t, r))
    return pts


def near_junction(pts, x, z):
    for px, pz, r in pts:
        if (px - x) ** 2 + (pz - z) ** 2 < r * r:
            return True
    return False


def local(x, y, z, origin):
    ox, oz, y0 = origin
    return (x - ox, y - y0, z - oz)


def curb_seg(mesh, a, b, origin):
    ha, hb = mesh_height(*a), mesh_height(*b)
    if min(ha, hb) < 0.22 or abs(ha - hb) > 1.6:
        return False
    dx, dz = b[0] - a[0], b[1] - a[1]
    L = math.hypot(dx, dz)
    if L < 0.4 or L > 30:
        return False
    nx, nz = -dz / L, dx / L
    half = 0.09
    bury, top = 0.05, 0.16

    def corner(pt, h, side, y):
        return local(pt[0] + nx * side, h + y, pt[1] + nz * side, origin)

    a0 = corner(a, ha, -half, -bury)
    b0 = corner(b, hb, -half, -bury)
    b1 = corner(b, hb, half, -bury)
    a1 = corner(a, ha, half, -bury)
    a2 = corner(a, ha, -half, top)
    b2 = corner(b, hb, -half, top)
    b3 = corner(b, hb, half, top)
    a3 = corner(a, ha, half, top)
    mesh.quad(a0, b0, b2, a2)
    mesh.quad(b1, a1, a3, b3)
    mesh.quad(a2, b2, b3, a3)
    mesh.quad(a1, b1, b0, a0)
    mesh.quad(a0, a2, a3, a1)
    mesh.quad(b0, b1, b3, b2)
    return True


def oriented_box(mesh, center, right, normal, width, height, depth):
    """Box centred on `center`, wide along `right`, tall on Y, deep along `normal`."""
    hw, hh, hd = width / 2, height / 2, depth / 2

    def p(u, v, n):
        return (
            center[0] + right[0] * u + normal[0] * n,
            center[1] + v,
            center[2] + right[2] * u + normal[2] * n,
        )

    c = [p(u, v, n) for n in (-hd, hd) for v in (-hh, hh) for u in (-hw, hw)]
    # c: n,v,u with u fastest: 0 - - -, 1 + - -, 2 - + -, 3 + + -, 4 - - +, 5 + - +, 6 - + +, 7 + + +
    mesh.quad(c[1], c[3], c[7], c[5])
    mesh.quad(c[4], c[6], c[2], c[0])
    mesh.quad(c[2], c[6], c[7], c[3])
    mesh.quad(c[4], c[0], c[1], c[5])
    mesh.quad(c[5], c[7], c[6], c[4])
    mesh.quad(c[0], c[2], c[3], c[1])


def add_stroke(mesh, origin, right, up, normal, u0, v0, u1, v1, h, thick):
    du, dv = u1 - u0, v1 - v0
    L = math.hypot(du, dv) or 1.0
    hw = (thick * 0.5) / h
    px, py = -dv / L * hw, du / L * hw

    def at(u, v, n=0.0):
        return (
            origin[0] + right[0] * u * h + up[0] * v * h + normal[0] * n,
            origin[1] + right[1] * u * h + up[1] * v * h + normal[1] * n,
            origin[2] + right[2] * u * h + up[2] * v * h + normal[2] * n,
        )

    d = 0.012
    a = at(u0 + px, v0 + py, d)
    b = at(u1 + px, v1 + py, d)
    c = at(u1 - px, v1 - py, d)
    e = at(u0 - px, v0 - py, d)
    # Face the requested normal.
    mid = at((u0 + u1) / 2, (v0 + v1) / 2, d)
    back = at((u0 + u1) / 2, (v0 + v1) / 2, 0)
    vx, vy, vz = mid[0] - back[0], mid[1] - back[1], mid[2] - back[2]
    ux, uy, uz = b[0] - a[0], b[1] - a[1], b[2] - a[2]
    wx, wy, wz = c[0] - a[0], c[1] - a[1], c[2] - a[2]
    nx = uy * wz - uz * wy
    ny = uz * wx - ux * wz
    nz = ux * wy - uy * wx
    if nx * vx + ny * vy + nz * vz < 0:
        mesh.quad(a, e, c, b)
    else:
        mesh.quad(a, b, c, e)


def add_word(mesh, text, origin, right, up, normal, h, thick):
    gap = 0.22
    cursor = 0.0
    for ch in text:
        glyph = GLYPHS.get(ch)
        if glyph is None:
            cursor += 0.55
            continue
        ox = (
            origin[0] + right[0] * cursor * h,
            origin[1] + right[1] * cursor * h,
            origin[2] + right[2] * cursor * h,
        )
        for (u0, v0), (u1, v1) in glyph:
            add_stroke(mesh, ox, right, up, normal, u0, v0, u1, v1, h, thick)
        cursor += 1.0 + gap
    return cursor * h


def add_shelter(meshes, x, z, tx, tz, label, origin):
    g = mesh_height(x, z)
    if g < 0.35:
        return False
    nx, nz = -tz, tx
    if nx < 0:
        nx, nz = -nx, -nz

    def wp(along, side, y):
        return local(x + tx * along + nx * side, g + y, z + tz * along + nz * side, origin)

    conc, white, blue, yellow, black = meshes

    def slab(mesh, y0, y1, along, side, depth):
        a = wp(-along, depth - side, y0)
        b = wp(along, depth - side, y0)
        c = wp(along, depth + side, y0)
        d = wp(-along, depth + side, y0)
        a1 = wp(-along, depth - side, y1)
        b1 = wp(along, depth - side, y1)
        c1 = wp(along, depth + side, y1)
        d1 = wp(-along, depth + side, y1)
        mesh.quad(a, b, b1, a1)
        mesh.quad(c, d, d1, c1)
        mesh.quad(a1, b1, c1, d1)
        mesh.quad(d, c, b, a)
        mesh.quad(a, d, d1, a1)
        mesh.quad(b, c, c1, b1)

    slab(conc, -0.02, 0.06, 1.7, 0.7, 1.15)
    for sa in (-1.45, 1.45):
        for ss in (0.55, 1.85):
            foot = wp(sa, ss, 0.02)
            top = (foot[0], foot[1] + 2.15, foot[2])
            box(white, (foot[0] + top[0]) / 2, (foot[1] + top[1]) / 2, (foot[2] + top[2]) / 2, 0.08, 2.15, 0.08)
    slab(blue, 2.12, 2.26, 1.9, 0.9, 1.15)
    # Name board facing the road (toward -inland).
    board = wp(0, 0.42, 1.35)
    right = (tx, 0.0, tz)
    up = (0.0, 1.0, 0.0)
    normal = (-nx, 0.0, -nz)
    h = 0.2
    width = len(label) * h * 1.22
    oriented_box(yellow, board, right, normal, width + 0.28, h + 0.16, 0.06)
    start = (
        board[0] - right[0] * width / 2,
        board[1] - h * 0.5,
        board[2] - right[2] * width / 2,
    )
    add_word(black, label, start, right, up, normal, h, 0.035)
    # Small L10 plate under the roof lip.
    plate = wp(0, 0.4, 1.95)
    oriented_box(blue, plate, right, normal, 0.72, 0.24, 0.04)
    pstart = (plate[0] - right[0] * 0.28, plate[1] - 0.08, plate[2] - right[2] * 0.28)
    add_word(white, "L10", pstart, right, up, normal, 0.16, 0.028)
    return True


def add_sign(meshes, x, z, tx, tz, text, fill, ink, origin, tall=1.7):
    g = mesh_height(x, z)
    if g < 0.3:
        return False
    nx, nz = -tz, tx
    if nx < 0:
        nx, nz = -nx, -nz
    post_m, board_m, ink_m = meshes
    p = local(x, g, z, origin)
    box(post_m, p[0], p[1] + tall * 0.5, p[2], 0.08, tall, 0.08)
    h = 0.28 if len(text) > 2 else 0.36
    width = max(0.55, len(text) * h * 1.22)
    board = (p[0], p[1] + tall, p[2])
    right = (tx, 0.0, tz)
    normal = (-nx, 0.0, -nz)
    oriented_box(board_m, board, right, normal, width + 0.22, h + 0.2, 0.06)
    start = (board[0] - right[0] * (len(text) * h * 1.22) / 2, board[1] - h * 0.5, board[2] - right[2] * (len(text) * h * 1.22) / 2)
    add_word(ink_m, text, start, right, (0, 1, 0), normal, h, 0.045)
    return True


def add_car(body, glass, x, z, tx, tz, origin):
    g = mesh_height(x, z)
    if g < 0.25:
        return
    p = local(x, g + 0.42, z, origin)
    # Body along the road. box() is axis aligned, so the long axis follows
    # whichever of x/z the road is closer to.
    if abs(tz) >= abs(tx):
        sx, sz = 1.7, 3.8
    else:
        sx, sz = 3.8, 1.7
    box(body, p[0], p[1], p[2], sx, 0.55, sz)
    box(glass, p[0], p[1] + 0.38, p[2], sx * 0.82, 0.38, sz * 0.45)


def gravel_cell(mesh, x, z, origin):
    s = 2.2
    hs = [mesh_height(x + dx, z + dz) for dx in (-s / 2, s / 2) for dz in (-s / 2, s / 2)]
    if max(hs) - min(hs) > 0.5 or min(hs) < 0.25:
        return False
    lift = 0.06
    g00, g10 = hs[0], hs[1]
    g01, g11 = hs[2], hs[3]
    a = local(x - s / 2, g00 + lift, z - s / 2, origin)
    b = local(x + s / 2, g10 + lift, z - s / 2, origin)
    c = local(x + s / 2, g11 + lift, z + s / 2, origin)
    d = local(x - s / 2, g01 + lift, z + s / 2, origin)
    mesh.quad(a, d, c, b)
    return True


def lot_cells(ring, step=2.3):
    xs = [p[0] for p in ring]
    zs = [p[1] for p in ring]
    x = min(xs) + step / 2
    cells = []
    while x < max(xs):
        z = min(zs) + step / 2
        while z < max(zs):
            if pip(x, z, ring):
                cells.append((x, z))
            z += step
        x += step
    return cells


def shop_ring_ccw(ring):
    area = 0.0
    for i, (x0, z0) in enumerate(ring):
        x1, z1 = ring[(i + 1) % len(ring)]
        area += x0 * z1 - x1 * z0
    if area < 0:
        return list(reversed(ring))
    return list(ring)


def add_shop(meshes, ring, origin, lod):
    cream, roof, glass, door, blue = meshes
    ring = shop_ring_ccw(ring)
    xs = [p[0] for p in ring]
    zs = [p[1] for p in ring]
    cx, cz = sum(xs) / len(xs), sum(zs) / len(zs)
    g = mesh_height(cx, cz)
    if g < 0.3:
        return False
    wall_h = 3.05
    if lod == 1:
        box(cream, *local(cx, g + wall_h * 0.5, cz, origin), max(xs) - min(xs), wall_h, max(zs) - min(zs))
        box(roof, *local(cx, g + wall_h + 0.4, cz, origin), max(xs) - min(xs) + 0.6, 0.7, max(zs) - min(zs) + 0.6)
        return True
    # Walls on the real footprint.
    n = len(ring)
    for i in range(n):
        x0, z0 = ring[i]
        x1, z1 = ring[(i + 1) % n]
        a = local(x0, g, z0, origin)
        b = local(x0, g + wall_h, z0, origin)
        c = local(x1, g + wall_h, z1, origin)
        d = local(x1, g, z1, origin)
        cream_m = cream
        cream_m.quad(a, b, c, d)
    # Orange gable over the bounding rectangle, ridge along Z.
    x0, x1 = min(xs) - 0.35, max(xs) + 0.35
    z0, z1 = min(zs) - 0.35, max(zs) + 0.35
    xm = (x0 + x1) / 2
    ye, yp = g + wall_h, g + wall_h + 1.25
    e0 = local(x0, ye, z0, origin)
    e1 = local(x1, ye, z0, origin)
    e2 = local(x1, ye, z1, origin)
    e3 = local(x0, ye, z1, origin)
    r0 = local(xm, yp, z0, origin)
    r1 = local(xm, yp, z1, origin)
    # West and east slopes, then the two gable ends.
    roof.quad(e0, r0, r1, e3)
    roof.quad(e1, e2, r1, r0)
    roof.tri(e0, e1, r0)
    roof.tri(e2, e3, r1)
    # Blue fascia on the beach (west) wall, then a door and two windows.
    west = min(xs)
    box(blue, *local(west - 0.06, g + wall_h - 0.18, cz, origin), 0.08, 0.28, (max(zs) - min(zs)) * 0.92)
    box(door, *local(west - 0.08, g + 1.05, cz - 1.4, origin), 0.08, 2.1, 1.05)
    box(glass, *local(west - 0.08, g + 1.7, cz + 1.6, origin), 0.06, 1.1, 1.3)
    box(glass, *local(west - 0.08, g + 1.7, cz + 3.3, origin), 0.06, 1.1, 1.1)
    return True


def seg_of(z):
    for sid, z0, z1 in SEGMENTS:
        if z1 < z <= z0 or abs(z - z1) < 1.5:
            return sid
    return SEGMENTS[-1][0]


def build(sid, samples, buildings, golf, junctions, stops, lots, shop):
    if not samples:
        raise SystemExit(f"{sid} has no samples")
    mid = samples[len(samples) // 2]
    ox, oz = mid["x"], mid["z"]
    y0 = height(ox, oz)
    if abs(y0) < 0.05:
        y0 = 0.4
    origin = (ox, oz, y0)
    model = Model(sid)
    conc = model.material("conc", CONC, 0.9)
    blue = model.material("blue", BLUE, 0.55)
    white = model.material("white", WHITE, 0.7)
    yellow = model.material("yellow", YELLOW, 0.6)
    black = model.material("black", BLACK, 0.7)
    gravel = model.material("gravel", GRAVEL, 0.95)
    cream = model.material("cream", CREAM, 0.8)
    roof = model.material("roof", ROOF, 0.75)
    glass = model.material("glass", GLASS, 0.25)
    door = model.material("door", DOOR, 0.6)
    wood = model.material("wood", WOOD, 0.8)
    car_mats = [model.material(f"car{i}", c, 0.55) for i, c in enumerate(CARS)]

    counts = {"curb": 0, "gap": 0, "bus": 0, "gravel": 0, "car": 0, "sign": 0, "shop": 0}

    for i, s in enumerate(samples):
        if i == 0 or s["sw"] != 0:
            continue
        prev = samples[i - 1]
        if prev["sw"] != 0:
            continue
        span = math.hypot(s["x"] - prev["x"], s["z"] - prev["z"])
        if span > 30:
            continue
        half = s["w"] / 2
        ex, ez = -s["tz"], s["tx"]
        if ex < 0:
            ex, ez = -ex, -ez
        for east in (True, False):
            if sid == "nw_rd_arashi" and not east and -9960 < s["z"] < -9840:
                continue
            ax, az = (ex, ez) if east else (-ex, -ez)
            pax, paz = -prev["tz"], prev["tx"]
            if pax < 0:
                pax, paz = -pax, -paz
            if not east:
                pax, paz = -pax, -paz
            a = (prev["x"] + pax * (prev["w"] / 2 + 0.42), prev["z"] + paz * (prev["w"] / 2 + 0.42))
            b = (s["x"] + ax * (half + 0.42), s["z"] + az * (half + 0.42))
            mx, mz = (a[0] + b[0]) / 2, (a[1] + b[1]) / 2
            if blocked(buildings, golf, a[0], a[1]) or blocked(buildings, golf, b[0], b[1]):
                counts["gap"] += 1
                continue
            if near_junction(junctions, mx, mz):
                counts["gap"] += 1
                continue
            for lod in (0, 1):
                if lod == 1 and (i % 2):
                    continue
                if curb_seg(model.mesh(lod, conc), a, b, origin) and lod == 0:
                    counts["curb"] += 1

    for label, sx, sz in stops:
        if seg_of(sz) != sid:
            continue
        best = min(samples, key=lambda s: abs(s["z"] - sz))
        if abs(best["z"] - sz) > 40:
            continue
        ex, ez = -best["tz"], best["tx"]
        if ex < 0:
            ex, ez = -ex, -ez
        placed = False
        for shift in (0.0, 8.0, -8.0, 16.0, -16.0):
            px = best["x"] + (sz + shift - best["z"]) * 0 + ex * (best["w"] / 2 + 2.5)
            # walk along the road by the shift, using the tangent
            px = best["x"] + best["tx"] * shift + ex * (best["w"] / 2 + 2.5)
            pz = best["z"] + best["tz"] * shift + ez * (best["w"] / 2 + 2.5)
            if blocked(buildings, golf, px, pz) or mesh_height(px, pz) < 0.35:
                continue
            meshes = (
                model.mesh(0, conc), model.mesh(0, white), model.mesh(0, blue),
                model.mesh(0, yellow), model.mesh(0, black),
            )
            if add_shelter(meshes, px, pz, best["tx"], best["tz"], label, origin):
                box(model.mesh(1, blue), *local(px, mesh_height(px, pz) + 1.2, pz, origin), 3.2, 2.3, 1.6)
                counts["bus"] += 1
                placed = True
                break
        if not placed:
            print("  missed stop", label, sx, sz)

    car_i = 0
    for name, _kind, ring in lots:
        cz = sum(p[1] for p in ring) / len(ring)
        if seg_of(cz) != sid:
            continue
        cells = [c for c in lot_cells(ring) if not blocked(buildings, golf, c[0], c[1])]
        for x, z in cells:
            if gravel_cell(model.mesh(0, gravel), x, z, origin):
                counts["gravel"] += 1
        if cells:
            xs = [p[0] for p in ring]
            zs = [p[1] for p in ring]
            box(
                model.mesh(1, gravel),
                *local(sum(xs) / len(xs), mesh_height(sum(xs) / len(xs), sum(zs) / len(zs)) + 0.08, sum(zs) / len(zs), origin),
                max(xs) - min(xs),
                0.08,
                max(zs) - min(zs),
            )
        # A few cars on the longer axis of the lot.
        best = min(samples, key=lambda s: abs(s["z"] - cz)) if samples else None
        ncar = 3 if len(cells) > 18 else 2
        for k in range(min(ncar, len(cells))):
            x, z = cells[len(cells) * (k + 1) // (ncar + 1)]
            if best is None:
                continue
            add_car(model.mesh(0, car_mats[car_i % 4]), model.mesh(0, glass), x, z, best["tx"], best["tz"], origin)
            box(model.mesh(1, car_mats[car_i % 4]), *local(x, mesh_height(x, z) + 0.4, z, origin), 1.7, 0.7, 3.4)
            car_i += 1
            counts["car"] += 1
        # P board on the inland side of the lot.
        if best is not None and cells:
            ex, ez = -best["tz"], best["tx"]
            if ex < 0:
                ex, ez = -ex, -ez
            cx = sum(p[0] for p in ring) / len(ring)
            sign_x = cx + ex * 1.2
            sign_z = cz
            if not blocked(buildings, golf, sign_x, sign_z):
                if add_sign(
                    (model.mesh(0, wood), model.mesh(0, blue), model.mesh(0, white)),
                    sign_x, sign_z, best["tx"], best["tz"], "P", BLUE, WHITE, origin, tall=1.55,
                ):
                    box(model.mesh(1, blue), *local(sign_x, mesh_height(sign_x, sign_z) + 1.5, sign_z, origin), 0.5, 0.5, 0.08)
                    counts["sign"] += 1

    # Name boards at the two beaches.
    for text, z_at in (("MALMOK", -8840.0), ("BOCA", -9460.0)):
        if seg_of(z_at) != sid:
            continue
        best = min(samples, key=lambda s: abs(s["z"] - z_at))
        ex, ez = -best["tz"], best["tx"]
        if ex < 0:
            ex, ez = -ex, -ez
        # Beach shoulder, so the board faces inland toward the road.
        px = best["x"] - ex * (best["w"] / 2 + 3.2)
        pz = best["z"]
        if blocked(buildings, golf, px, pz):
            continue
        # Flip the facing by swapping the tangent sign via a local shelter-style normal.
        # add_sign faces -inland, which from the beach shoulder looks out to sea.
        # Place the post on the inland shoulder instead so drivers read it.
        px = best["x"] + ex * (best["w"] / 2 + 3.0)
        pz = best["z"]
        if blocked(buildings, golf, px, pz):
            continue
        if add_sign(
            (model.mesh(0, wood), model.mesh(0, white), model.mesh(0, blue)),
            px, pz, best["tx"], best["tz"], text, WHITE, BLUE, origin, tall=1.85,
        ):
            box(model.mesh(1, white), *local(px, mesh_height(px, pz) + 1.8, pz, origin), 1.6, 0.5, 0.08)
            counts["sign"] += 1

    if shop and sid == "nw_rd_arashi":
        if add_shop(
            (model.mesh(0, cream), model.mesh(0, roof), model.mesh(0, glass), model.mesh(0, door), model.mesh(0, blue)),
            shop, origin, 0,
        ):
            add_shop(
                (model.mesh(1, cream), model.mesh(1, roof), None, None, None),
                shop, origin, 1,
            )
            counts["shop"] += 1

    info = write_glb(model, HERO / f"{sid}.glb")
    check_glb(HERO / f"{sid}.glb")
    far = max(math.hypot(s["x"] - ox, s["z"] - oz) for s in samples)
    if far > 640:
        raise SystemExit(f"{sid} origin is {far:.0f} m from its geometry")
    print(sid, "origin", round(ox, 1), round(oz, 1), "y", round(y0, 2), "far", round(far), counts, info)
    return info, (ox, oz, y0)


def manifest_entry(sid, origin, info, refs, hide):
    ox, oz, y0 = origin
    return {
        "id": sid,
        "k": sid,
        "name": "",
        "status": "v5-accuracy",
        "x": round(ox, 2),
        "z": round(oz, 2),
        "y": round(y0, 2),
        "rotation": 0,
        "glb": f"models/hero/{sid}.glb",
        "lod": {"hi": f"{sid}_lod0", "lo": f"{sid}_lod1", "switch_m": 600},
        "tris": {f"{sid}_lod0": info["lod0"], f"{sid}_lod1": info["lod1"]},
        "textures": 0,
        "hide_footprint": hide,
        "hide": [],
        "sign": False,
        "kind": "replace",
        "new_place": False,
        "geo_source": "OSM coast-road centreline, bus_stop nodes, and parking ways north of the Palm Beach hotels",
        "ref_sources": refs,
        "frame": "glb origin = road sample (world x,z); glTF +X = world x, +Z = world z, Y up; y is the DEM height at the origin",
        "cat": "landmark",
    }


def patch_manifest(entries):
    text = MANIFEST.read_text()
    while True:
        pos = text.find('"id": "nw_rd_')
        if pos < 0:
            break
        start = text.rfind("{", 0, pos)
        cut = text.rfind(",", 0, start)
        if start - cut > 30:
            raise SystemExit("manifest comma not next to the nw_rd_ object")
        depth = 0
        end = None
        for i, ch in enumerate(text[start:], start):
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    end = i + 1
                    break
        if end is None:
            raise SystemExit("unclosed manifest object")
        obj = text[start:end]
        if obj.count('"id"') != 1 or '"id": "nw_rd_' not in obj:
            raise SystemExit("refusing to cut a non nw_rd_ object")
        text = text[:cut] + text[end:]
    body = text.rstrip()
    if not body.endswith("]"):
        raise SystemExit("manifest does not end with ]")
    body = body[:-1].rstrip()
    if body.endswith(","):
        body = body[:-1].rstrip()
    json.loads(body + "\n]\n")
    chunks = []
    for e in entries:
        blob = json.dumps(e, indent=1)
        blob = "\n".join(" " + ln for ln in blob.split("\n"))
        chunks.append(blob)
    text = body + ",\n" + ",\n".join(chunks) + "\n]\n"
    data = json.loads(text)
    got = [e["id"] for e in data if str(e.get("id", "")).startswith(PREFIX)]
    want = [e["id"] for e in entries]
    if got != want:
        raise SystemExit(f"manifest ids {got} != {want}")
    again = json.loads(body + "\n]\n")
    if len(data) != len(again) + len(entries):
        raise SystemExit("manifest length mismatch")
    # The shop ring must hide that box and not the Arashi Beach Shack.
    shop_hide = next(e["hide_footprint"] for e in entries if e["id"] == "nw_rd_arashi")
    if shop_hide:
        cx = sum(p[0] for p in SHOP) / len(SHOP)
        cz = sum(p[1] for p in SHOP) / len(SHOP)
        if not pip(cx, cz, shop_hide):
            raise SystemExit("shop hide misses the commercial centroid")
        if pip(-9006.38, -9823.73, shop_hide):
            raise SystemExit("shop hide covers arashishack")
    MANIFEST.write_text(text)
    print("manifest", want, "len", len(data))


def main():
    roads, others, buildings = load_world()
    golf = load_golf()
    samples = build_samples(roads)
    if len(samples) < 200:
        raise SystemExit(f"only {len(samples)} road samples")
    junctions = junction_points(others)
    groups = {sid: [] for sid, *_ in SEGMENTS}
    for s in samples:
        groups[seg_of(s["z"])].append(s)
    refs = (
        "OSM bus_stop nodes on the L10 corridor north of the hotels: "
        "Hadicurari Beach, Fisherman's Hut, Malmok 458, Malmok Zuid, Malmok Beach, "
        "Tres Trapi, Boca Catalina, Arashi Beach. "
        "OSM parking ways 1167230838, 916189109, 916189104, 916189095, 1186199867, 1186199868 "
        "are the Malmok and Boca Catalina beach-side lots. "
        "The Arashi commercial box (OSM building, flat roof, h 6.9) is rebuilt as the low "
        "orange-roof shop in the lighthouse-hill view of the lot. "
        "pb_busstops already covers the hotel frontage; those shelters are left in place."
    )
    entries = []
    for sid, _z0, _z1 in SEGMENTS:
        info, origin, = build(sid, groups[sid], buildings, golf, junctions, STOPS, LOTS, SHOP if sid == "nw_rd_arashi" else None)
        hide = SHOP if sid == "nw_rd_arashi" else None
        entries.append(manifest_entry(sid, origin, info, refs, hide))
    patch_manifest(entries)


if __name__ == "__main__":
    sys.exit(main())
