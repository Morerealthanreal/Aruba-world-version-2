#!/usr/bin/env python3
"""Palm Beach north end to Malmok / Arashi, street level.

The drive leaves J.E. Irausquin at the north end of the hotel strip and
continues on the coast road (OSM: Avenida Nelson O. Oduber) until L.G. Smith
Boulevard takes it through Malmok to the Arashi lot. This pass adds the
missing curbs, west-leaning divi-divi, palms where the verge is bare, lamp
posts in the gaps, blue-roof bus shelters, and the Arashi gravel lot with
two dive-shop shacks.

It does not rebuild hotel shells, the Tierra del Sol golf course or resort,
or the heroes already on this stretch (pb_jei, pb_busstops, pb_shelllamps,
arashishack, arashi_roadpark, arashi_fx).

Photos used as shape guides, not textures:
- Wikimedia "Windswept Watapana Tree ... Malmok Beach" (divi leaning over a
  pale sandy shoulder, canopy streamed west toward the sea)
- Wikimedia "Arashi, Aruba - panoramio" (gravel lot with a row of cars
  between the road and the beach, low roofs, palms)
- existing pb_busstops note: blue-roofed Arubus shelter
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

# South edge is just north of the Ritz footprint. North edge is the Arashi
# end of L.G. Smith, short of the lighthouse road.
Z_SOUTH, Z_NORTH = -7120.0, -9996.0
COAST_NAMES = ("Avenida Nelson O. Oduber", "L.G. Smith Boulevard")
PREFIX = "nw_pb_"

CONC = (0.72, 0.70, 0.64)
GRAVEL = (0.55, 0.51, 0.44)
BARK = (0.16, 0.11, 0.08)
LEAF = (0.34, 0.50, 0.16)
PALM_B = (0.46, 0.32, 0.16)
PALM_F = (0.16, 0.42, 0.18)
BLACK = (0.10, 0.10, 0.11)
CREAM = (0.93, 0.86, 0.68)
BLUE = (0.13, 0.34, 0.62)
WHITE = (0.90, 0.89, 0.84)
WOOD = (0.40, 0.28, 0.16)
YELLOW = (0.86, 0.70, 0.16)
TANK = (0.72, 0.76, 0.78)
GLASS = (0.55, 0.70, 0.78)
CARS = (
    (0.16, 0.18, 0.22),
    (0.18, 0.32, 0.55),
    (0.62, 0.14, 0.12),
    (0.78, 0.76, 0.70),
)

# One hero per stretch so a player standing next to the pieces is inside the
# low-quality 700 m cap (the origin has to be near the geometry).
SEGMENTS = (
    ("nw_pb_north", -7120.0, -7900.0),
    ("nw_pb_oduber", -7900.0, -8940.0),
    ("nw_pb_malmok", -8940.0, -9600.0),
    ("nw_pb_arashi", -9600.0, -10040.0),
)


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
    """Height of the 4 m terrain triangle the renderer draws."""
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
        r, g, _b = im.getpixel((max(0, min(250, i)), max(0, min(250, j))))
        return (r * 256 + g) / 100.0 - 50.0

    h00, h10 = pix(ix, iz), pix(ix + 1, iz)
    h01, h11 = pix(ix, iz + 1), pix(ix + 1, iz + 1)
    if u + v <= 1.0:
        return h00 * (1 - u - v) + h10 * u + h01 * v
    return h10 * (1 - v) + h11 * (u + v - 1) + h01 * (1 - u)


def pip(x, z, ring):
    n = len(ring)
    inside = False
    j = n - 1
    for i in range(n):
        yi, zi = ring[i]
        yj, zj = ring[j]
        if ((zi > z) != (zj > z)) and (x < (yj - yi) * (z - zi) / (zj - zi + 1e-12) + yi):
            inside = not inside
        j = i
    return inside


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


def load_world():
    roads = []
    buildings = []
    veg_p, veg_d, lamps = [], [], []
    for path in sorted(REAL.glob("r_*.json")):
        data = json.loads(path.read_text())
        for road in data["roads"]:
            if (road.get("n") or "") in COAST_NAMES:
                pts = road["p"]
                if any(Z_NORTH - 40 < p[1] < Z_SOUTH + 40 and p[0] < -7600 for p in pts):
                    roads.append(road)
        for b in data["b"]:
            ring = b["p"]
            xs = [p[0] for p in ring]
            zs = [p[1] for p in ring]
            cx, cz = sum(xs) / len(xs), sum(zs) / len(zs)
            if -9600 < cx < -7400 and Z_NORTH - 80 < cz < Z_SOUTH + 40:
                buildings.append({
                    "p": ring, "cx": cx, "cz": cz,
                    "w": max(xs) - min(xs), "d": max(zs) - min(zs),
                    "h": b.get("h") or 3, "k": b.get("k") or "", "n": b.get("n") or "",
                })
        veg = data.get("veg") or {}
        for x, z, *_rest in veg.get("p") or []:
            if -9600 < x < -7400 and Z_NORTH < z < Z_SOUTH:
                veg_p.append((x, z))
        for x, z, *_rest in veg.get("d") or []:
            if -9600 < x < -7400 and Z_NORTH < z < Z_SOUTH:
                veg_d.append((x, z))
        for lamp in data.get("lamps") or []:
            x, z = lamp[0], lamp[1]
            if -9600 < x < -7400 and Z_NORTH < z < Z_SOUTH:
                lamps.append((x, z))
    return roads, buildings, veg_p, veg_d, lamps


def center_at(roads, z):
    """Westernmost coast-road crossing at this z, with width, sidewalk flag, tangent."""
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
                best = (x, road["w"], int(road.get("sw") or 0), dx, dz, name)
    return best


def build_samples(roads):
    raw = []
    z = Z_SOUTH
    while z >= Z_NORTH:
        hit = center_at(roads, z)
        z -= 4.0
        if hit is None:
            continue
        x, w, sw, dx, dz, name = hit
        L = math.hypot(dx, dz) or 1.0
        raw.append({
            "x": x, "z": z + 4.0, "w": w, "sw": sw, "name": name,
            "tx": dx / L, "tz": dz / L,
        })
    # Drop a one-sample spike. Keep a real bend, such as the west jog
    # where L.G. Smith turns toward Arashi.
    samples = []
    for i, s in enumerate(raw):
        if 0 < i < len(raw) - 1:
            prev, nxt = raw[i - 1], raw[i + 1]
            if abs(s["x"] - prev["x"]) > 25 and abs(s["x"] - nxt["x"]) > 25 and abs(prev["x"] - nxt["x"]) < 12:
                continue
        samples.append(s)
    return samples


def near(points, x, z, r):
    r2 = r * r
    return any((px - x) ** 2 + (pz - z) ** 2 < r2 for px, pz in points)


def inside_building(buildings, x, z):
    for b in buildings:
        if abs(b["cx"] - x) > 40 or abs(b["cz"] - z) > 40:
            continue
        if pip(x, z, b["p"]):
            return True
    return False


def blocked(buildings, golf, x, z, pad=0.0):
    if on_golf(x, z, golf):
        return True
    if pad and inside_building(buildings, x, z):
        return True
    return inside_building(buildings, x, z)


def seg_of(z):
    for sid, z0, z1 in SEGMENTS:
        # z0 is the south end (greater), z1 the north end
        if z1 <= z <= z0 or abs(z - z0) < 1e-6 or abs(z - z1) < 1e-6:
            if z1 - 0.1 <= z <= z0 + 0.1:
                return sid
    # exact boundary belongs to the northern segment
    for sid, z0, z1 in SEGMENTS:
        if abs(z - z1) < 2:
            return sid
    return None


def local(x, y, z, origin):
    ox, oz, y0 = origin
    return (x - ox, y - y0, z - oz)


def quad_out(mesh, a, b, c, d, center):
    ux, uy, uz = b[0] - a[0], b[1] - a[1], b[2] - a[2]
    vx, vy, vz = c[0] - a[0], c[1] - a[1], c[2] - a[2]
    nx = uy * vz - uz * vy
    ny = uz * vx - ux * vz
    nz = ux * vy - uy * vx
    if nx * (a[0] - center[0]) + ny * (a[1] - center[1]) + nz * (a[2] - center[2]) < 0:
        mesh.quad(a, d, c, b)
    else:
        mesh.quad(a, b, c, d)


def tube(mesh, pts, r0, r1, n=5):
    if len(pts) < 2:
        return

    def cross(a, b):
        return (
            a[1] * b[2] - a[2] * b[1],
            a[2] * b[0] - a[0] * b[2],
            a[0] * b[1] - a[1] * b[0],
        )

    def unit(v):
        L = math.sqrt(v[0] ** 2 + v[1] ** 2 + v[2] ** 2) or 1
        return (v[0] / L, v[1] / L, v[2] / L)

    rings = []
    for i, p in enumerate(pts):
        if i == 0:
            d = (pts[1][0] - p[0], pts[1][1] - p[1], pts[1][2] - p[2])
        elif i == len(pts) - 1:
            d = (p[0] - pts[-2][0], p[1] - pts[-2][1], p[2] - pts[-2][2])
        else:
            d = (pts[i + 1][0] - pts[i - 1][0], pts[i + 1][1] - pts[i - 1][1], pts[i + 1][2] - pts[i - 1][2])
        d = unit(d)
        helper = (0, 0, 1) if abs(d[1]) < 0.85 else (1, 0, 0)
        side = unit(cross(d, helper))
        up = unit(cross(side, d))
        t = i / (len(pts) - 1)
        r = r0 + (r1 - r0) * t
        ring = []
        for k in range(n):
            a = k / n * math.tau
            ca, sa = math.cos(a), math.sin(a)
            ring.append((
                p[0] + (side[0] * ca + up[0] * sa) * r,
                p[1] + (side[1] * ca + up[1] * sa) * r,
                p[2] + (side[2] * ca + up[2] * sa) * r,
            ))
        rings.append(ring)
    for i in range(len(rings) - 1):
        mid = (
            (pts[i][0] + pts[i + 1][0]) / 2,
            (pts[i][1] + pts[i + 1][1]) / 2,
            (pts[i][2] + pts[i + 1][2]) / 2,
        )
        for k in range(n):
            j = (k + 1) % n
            quad_out(mesh, rings[i][k], rings[i][j], rings[i + 1][j], rings[i + 1][k], mid)


def curb_box(mesh, a, b, origin):
    """Low concrete curb between two world points, top following the mesh."""
    ha, hb = mesh_height(*a), mesh_height(*b)
    if ha < 0.35 or hb < 0.35 or abs(ha - hb) > 0.55:
        return False
    dx, dz = b[0] - a[0], b[1] - a[1]
    L = math.hypot(dx, dz)
    if L < 0.4:
        return False
    nx, nz = -dz / L, dx / L
    half = 0.09
    bury, top = 0.06, 0.14

    def corner(pt, h, side, y):
        return local(pt[0] + nx * side, h + y, pt[1] + nz * side, origin)

    v = [
        corner(a, ha, -half, -bury), corner(b, hb, -half, -bury),
        corner(b, hb, half, -bury), corner(a, ha, half, -bury),
        corner(a, ha, -half, top), corner(b, hb, half and top or top, top),
    ]
    # rebuild explicitly so the top uses `top`
    a0 = corner(a, ha, -half, -bury)
    b0 = corner(b, hb, -half, -bury)
    b1 = corner(b, hb, half, -bury)
    a1 = corner(a, ha, half, -bury)
    a2 = corner(a, ha, -half, top)
    b2 = corner(b, hb, -half, top)
    b3 = corner(b, hb, half, top)
    a3 = corner(a, ha, half, top)
    # outward-ish faces; both sides of a curb are visible
    mesh.quad(a0, b0, b2, a2)
    mesh.quad(b1, a1, a3, b3)
    mesh.quad(a2, b2, b3, a3)
    mesh.quad(a1, b1, b0, a0)
    mesh.quad(a0, a2, a3, a1)
    mesh.quad(b0, b1, b3, b2)
    return True


def add_divi(bark, leaf, x, z, origin, lod):
    """Watapana at Malmok scale: dark trunk, crown streamed west over the shoulder.

    The reference tree is several metres tall, with the canopy lying toward
    the sea rather than sitting as a shrub on a short stem.
    """
    g = mesh_height(x, z)
    if g < 0.4:
        return False
    phase = ((int(abs(z)) * 17) % 5) / 4.0
    reach = 5.4 + phase * 1.3
    crown_y = 3.15 + (1.0 - phase) * 0.4

    def w(dx, dy, dz):
        return local(x + dx, g + dy, z + dz, origin)

    trunk = [
        w(0.0, -0.05, 0.0),
        w(-0.12, 0.65, 0.16),
        w(-0.4, 1.5, -0.1),
        w(-1.05, 2.4, 0.08),
        w(-2.0, crown_y - 0.12, -0.04),
        w(-3.3, crown_y + 0.08, 0.06),
        w(-reach, crown_y - 0.08, 0.0),
    ]
    if lod == 0:
        tube(bark, trunk, 0.24, 0.065, 6)
        # The low arm that lies toward the sea under the crown.
        tube(bark, [trunk[2], w(-1.7, 1.05, 0.04), w(-3.2, 0.72, -0.06)], 0.09, 0.035, 4)
        for dx, dy, dz, sx, sy, sz in (
            (-2.15, crown_y + 0.22, 0.12, 2.05, 0.42, 1.5),
            (-3.55, crown_y + 0.16, -0.06, 2.25, 0.38, 1.65),
            (-4.85, crown_y + 0.02, 0.08, 1.85, 0.32, 1.3),
            (-reach - 0.15, crown_y - 0.12, 0.0, 1.15, 0.22, 0.85),
        ):
            box(leaf, *w(dx, dy, dz), sx, sy, sz)
    else:
        tube(bark, [trunk[0], trunk[3], trunk[-1]], 0.16, 0.07, 4)
        box(leaf, *w(-reach * 0.62, crown_y + 0.05, 0.0), reach * 0.82, 0.4, 1.55)
    return True


def add_palm(bark, leaf, x, z, origin, lod):
    g = mesh_height(x, z)
    if g < 0.45:
        return False
    base = local(x, g - 0.05, z, origin)
    if lod == 0:
        top = (base[0], base[1] + 4.6, base[2])
        tube(bark, [base, (base[0] + 0.05, base[1] + 2.2, base[2]), top], 0.13, 0.07, 5)
        for i in range(5):
            a = i / 5 * math.tau
            box(leaf, top[0] + math.cos(a) * 0.7, top[1] - 0.05, top[2] + math.sin(a) * 0.7,
                1.15, 0.05, 0.2)
    else:
        box(bark, base[0], base[1] + 2.2, base[2], 0.16, 4.4, 0.16)
        box(leaf, base[0], base[1] + 4.5, base[2], 1.4, 0.16, 1.4)
    return True


def add_lamp(pole, head, x, z, origin, lod):
    g = mesh_height(x, z)
    if g < 0.4:
        return False
    p = local(x, g - 0.08, z, origin)
    if lod == 0:
        tube(pole, [p, (p[0], p[1] + 3.35, p[2])], 0.055, 0.04, 5)
        box(head, p[0], p[1] + 3.5, p[2], 0.32, 0.22, 0.32)
        box(pole, p[0], p[1] + 3.66, p[2], 0.38, 0.06, 0.38)
    else:
        box(pole, p[0], p[1] + 1.7, p[2], 0.08, 3.4, 0.08)
        box(head, p[0], p[1] + 3.5, p[2], 0.28, 0.2, 0.28)
    return True


def add_shelter(meshes, x, z, tx, tz, origin, lod):
    """Blue-roof Arubus shelter on the inland shoulder, opening toward the road."""
    g = mesh_height(x, z)
    if g < 0.4:
        return False
    # inland axis is +x-ish; the road tangent faces along the boulevard
    nx, nz = -tz, tx
    if nx < 0:
        nx, nz = -nx, -nz
    ox, oz, _y0 = origin

    def wp(along, side, y):
        return local(x + tx * along + nx * side, g + y, z + tz * along + nz * side, origin)

    conc, white, blue, wood, yellow = meshes
    if lod == 0:
        box(conc, *wp(0, 0.9, 0.04)[:3], 3.4, 0.08, 1.6) if False else None
        # pad and roof are axis-aligned in the box() helper, so build them
        # from quads that follow the road.
        def slab(mesh, y0, y1, along, side, depth, width):
            corners = []
            for sa in (-along, along):
                for ss in (-side, side):
                    corners.append(wp(sa, depth + ss, 0))
            # corners order is not paired; do it explicitly
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

        slab(conc, -0.02, 0.06, 1.7, 0.7, 1.15, 0)
        for sa in (-1.45, 1.45):
            for ss in (0.45, 1.85):
                foot = wp(sa, ss, 0)
                tube(white, [foot, (foot[0], foot[1] + 2.15, foot[2])], 0.05, 0.04, 4)
        slab(blue, 2.15, 2.28, 1.85, 0.85, 1.15, 0)
        # bench
        seat0 = wp(-1.1, 1.15, 0.42)
        seat1 = wp(1.1, 1.15, 0.42)
        white.quad(
            (seat0[0], seat0[1], seat0[2]),
            (seat1[0], seat1[1], seat1[2]),
            (seat1[0], seat1[1] + 0.06, seat1[2]),
            (seat0[0], seat0[1] + 0.06, seat0[2]),
        )
        board = wp(0, 2.05, 1.35)
        box(yellow, board[0], board[1], board[2], 0.08, 0.36, 0.55)
    else:
        box(blue, *local(x + nx * 1.15, g + 1.2, z + nz * 1.15, origin), 3.2, 2.3, 1.4)
    return True


def add_car(body, glass, x, z, tx, tz, color_mesh, origin):
    g = mesh_height(x, z)
    if g < 0.3:
        return
    nx, nz = -tz, tx
    p = local(x, g + 0.35, z, origin)
    # body along the road, roughly
    box(color_mesh, p[0], p[1], p[2], 1.7, 0.55, 3.6)
    box(glass, p[0], p[1] + 0.4, p[2] - tz * 0.15, 1.5, 0.4, 1.6)


def add_shack(meshes, ring, origin, lod):
    xs = [p[0] for p in ring]
    zs = [p[1] for p in ring]
    cx, cz = sum(xs) / len(xs), sum(zs) / len(zs)
    g = mesh_height(cx, cz)
    if g < 0.35:
        return False
    length = max(4.2, min(11.0, max(xs) - min(xs)))
    depth = max(3.4, min(8.0, max(zs) - min(zs)))
    white, blue, wood, tank = meshes
    base = local(cx, g, cz, origin)
    if lod == 0:
        box(white, base[0], base[1] + 1.25, base[2], length, 2.5, depth)
        box(blue, base[0], base[1] + 2.15, base[2], length + 0.08, 0.38, depth + 0.08)
        box(wood, base[0], base[1] + 2.62, base[2], length + 0.35, 0.12, depth + 0.35)
        # shade porch on the west side, toward the lot
        box(wood, base[0] - length * 0.15, base[1] + 2.35, base[2] - depth * 0.55, length * 0.7, 0.08, 1.6)
        for i, sx in enumerate((-0.7, 0.0, 0.7)):
            tube(tank, [
                (base[0] + sx, base[1], base[2] + depth * 0.42),
                (base[0] + sx, base[1] + 0.85, base[2] + depth * 0.42),
            ], 0.12, 0.12, 5)
    else:
        box(white, base[0], base[1] + 1.2, base[2], length, 2.4, depth)
        box(blue, base[0], base[1] + 2.2, base[2], length, 0.3, depth)
    return True


def gravel_cell(mesh, x, z, origin, s=2.2):
    g00 = mesh_height(x - s / 2, z - s / 2)
    g10 = mesh_height(x + s / 2, z - s / 2)
    g11 = mesh_height(x + s / 2, z + s / 2)
    g01 = mesh_height(x - s / 2, z + s / 2)
    hs = (g00, g10, g11, g01)
    if min(hs) < 0.3 or max(hs) - min(hs) > 0.45:
        return False
    lift = 0.05
    a = local(x - s / 2, g00 + lift, z - s / 2, origin)
    b = local(x + s / 2, g10 + lift, z - s / 2, origin)
    c = local(x + s / 2, g11 + lift, z + s / 2, origin)
    d = local(x - s / 2, g01 + lift, z + s / 2, origin)
    mesh.quad(a, d, c, b)
    return True


def assign(samples):
    groups = {sid: [] for sid, *_ in SEGMENTS}
    for s in samples:
        sid = None
        for name, z_south, z_north in SEGMENTS:
            if z_north < s["z"] <= z_south or (name == SEGMENTS[-1][0] and abs(s["z"] - z_north) < 2):
                sid = name
                break
        if sid:
            groups[sid].append(s)
    return groups


def build_segment(sid, samples, buildings, golf, veg_p, veg_d, lamps, shacks):
    if not samples:
        raise SystemExit(f"{sid} has no samples")
    mid = samples[len(samples) // 2]
    ox, oz = mid["x"], mid["z"]
    y0 = height(ox, oz)
    if y0 < 0.3:
        raise SystemExit(f"{sid} origin height {y0}")
    origin = (ox, oz, y0)
    model = Model(sid)
    conc = model.material("conc", CONC, 0.9)
    bark = model.material("bark", BARK, 0.9)
    leaf = model.material("leaf", LEAF, 0.85)
    palm_b = model.material("palmb", PALM_B, 0.85)
    palm_f = model.material("palmf", PALM_F, 0.8)
    pole = model.material("pole", BLACK, 0.55)
    head = model.material("head", CREAM, 0.45, emissive=0.25)
    blue = model.material("blue", BLUE, 0.55)
    white = model.material("white", WHITE, 0.7)
    wood = model.material("wood", WOOD, 0.85)
    yellow = model.material("yellow", YELLOW, 0.6)
    gravel = model.material("gravel", GRAVEL, 0.95)
    tank = model.material("tank", TANK, 0.4)
    glass = model.material("glass", GLASS, 0.25)
    car_mats = [model.material(f"car{i}", c, 0.55) for i, c in enumerate(CARS)]

    counts = {"curb": 0, "divi": 0, "palm": 0, "lamp": 0, "bus": 0, "shack": 0, "gravel": 0, "car": 0}
    marks = []
    placed_lamps = []
    since_lamp = 999.0
    since_divi = 999.0
    since_palm = 999.0
    bus_targets = {"nw_pb_north": -7480.0, "nw_pb_malmok": -9280.0, "nw_pb_arashi": -9760.0}
    bus_done = False

    for i, s in enumerate(samples):
        half = s["w"] / 2
        # perpendicular, east / inland is the one with +x
        ex, ez = -s["tz"], s["tx"]
        if ex < 0:
            ex, ez = -ex, -ez
        wx, wz = -ex, -ez
        step = 4.0 if i == 0 else math.hypot(s["x"] - samples[i - 1]["x"], s["z"] - samples[i - 1]["z"])

        def side_point(dist, east):
            ax, az = (ex, ez) if east else (wx, wz)
            return (s["x"] + ax * dist, s["z"] + az * dist)

        # Curbs only where the road data has no sidewalk. The engine already
        # draws a kerb where sw=1 (L.G. Smith through Malmok).
        if s["sw"] == 0 and i > 0:
            prev = samples[i - 1]
            span = math.hypot(s["x"] - prev["x"], s["z"] - prev["z"])
            if prev["sw"] == 0 and span < 55:
                for east in (True, False):
                    # Leave the beach side open along the Arashi dirt lot.
                    if sid == "nw_pb_arashi" and not east and -9960 < s["z"] < -9840:
                        continue
                    a = (prev["x"] + ((-prev["tz"], prev["tx"]) if east else (prev["tz"], -prev["tx"]))[0] * (half + 0.35),
                         prev["z"] + ((-prev["tz"], prev["tx"]) if east else (prev["tz"], -prev["tx"]))[1] * (half + 0.35))
                    # recompute with a consistent east axis from THIS sample's frame
                    ax, az = (ex, ez) if east else (wx, wz)
                    pax, paz = -prev["tz"], prev["tx"]
                    if pax < 0:
                        pax, paz = -pax, -paz
                    if not east:
                        pax, paz = -pax, -paz
                    a = (prev["x"] + pax * (prev["w"] / 2 + 0.4), prev["z"] + paz * (prev["w"] / 2 + 0.4))
                    b = (s["x"] + ax * (half + 0.4), s["z"] + az * (half + 0.4))
                    if blocked(buildings, golf, b[0], b[1]) or blocked(buildings, golf, a[0], a[1]):
                        continue
                    for lod in (0, 1):
                        if lod == 1 and (i % 2):
                            continue
                        if curb_box(model.mesh(lod, conc), a, b, origin):
                            if lod == 0:
                                counts["curb"] += 1

        since_divi += step
        since_palm += step
        since_lamp += step

        if since_divi > 52:
            for east, dist in ((False, half + 3.4), (True, half + 4.6)):
                if east and (i // 12) % 2:
                    continue
                px, pz = side_point(dist, east)
                # Crown streams ~6 m west. Skip a trunk whose canopy would
                # grow through a house.
                if blocked(buildings, golf, px, pz) or blocked(buildings, golf, px - 4.0, pz):
                    continue
                if near(veg_d, px, pz, 12):
                    continue
                if mesh_height(px, pz) < 0.45:
                    continue
                ok = False
                for lod in (0, 1):
                    if add_divi(model.mesh(lod, bark), model.mesh(lod, leaf), px, pz, origin, lod):
                        ok = True
                if ok:
                    counts["divi"] += 1
                    marks.append(("divi", round(px, 1), round(pz, 1), "inland" if east else "beach"))
                    since_divi = 0
                    break

        # Palms are already scattered thickly north of the huts. Fill the
        # bare verge from the hotel north end down to about Hadicurari.
        if s["z"] > -7850 and since_palm > 26:
            east = (i // 6) % 2 == 0
            px, pz = side_point(half + 3.0, east)
            if not blocked(buildings, golf, px, pz) and not near(veg_p, px, pz, 8) and mesh_height(px, pz) > 0.5:
                ok = False
                for lod in (0, 1):
                    if add_palm(model.mesh(lod, palm_b), model.mesh(lod, palm_f), px, pz, origin, lod):
                        ok = True
                if ok:
                    counts["palm"] += 1
                    since_palm = 0

        if near(lamps, s["x"], s["z"], 28) or near(placed_lamps, s["x"], s["z"], 28):
            since_lamp = 0
        elif since_lamp > 48:
            east = (len(placed_lamps) % 2) == 0
            px, pz = side_point(half + 1.15, east)
            if not blocked(buildings, golf, px, pz) and mesh_height(px, pz) > 0.45:
                for lod in (0, 1):
                    add_lamp(model.mesh(lod, pole), model.mesh(lod, head), px, pz, origin, lod)
                counts["lamp"] += 1
                placed_lamps.append((px, pz))
                since_lamp = 0

        target = bus_targets.get(sid)
        if target is not None and not bus_done and abs(s["z"] - target) < 30:
            px, pz = side_point(half + 2.4, True)
            clear = not blocked(buildings, golf, px, pz) and mesh_height(px, pz) > 0.45
            if clear:
                meshes = (
                    model.mesh(0, conc), model.mesh(0, white), model.mesh(0, blue),
                    model.mesh(0, wood), model.mesh(0, yellow),
                )
                add_shelter(meshes, px, pz, s["tx"], s["tz"], origin, 0)
                add_shelter((None, None, model.mesh(1, blue), None, None), px, pz, s["tx"], s["tz"], origin, 1)
                counts["bus"] += 1
                marks.append(("bus", round(px, 1), round(pz, 1)))
                bus_done = True

    if sid == "nw_pb_arashi":
        # Gravel rows west of the existing dirt strip, toward the beach,
        # matching the open lot in the Arashi hill photo.
        road = [s for s in samples if -9965 < s["z"] < -9860]
        for s in road[::2]:
            half = s["w"] / 2
            ex, ez = -s["tz"], s["tx"]
            if ex < 0:
                ex, ez = -ex, -ez
            for dist in (16.0, 21.5):
                px = s["x"] - ex * dist
                pz = s["z"] - ez * dist
                if blocked(buildings, golf, px, pz):
                    continue
                if gravel_cell(model.mesh(0, gravel), px, pz, origin):
                    counts["gravel"] += 1
                    if counts["car"] < 4 and counts["gravel"] % 3 == 0:
                        add_car(
                            None, model.mesh(0, glass), px, pz, s["tx"], s["tz"],
                            model.mesh(0, car_mats[counts["car"] % 4]), origin,
                        )
                        box(model.mesh(1, car_mats[counts["car"] % 4]),
                            *local(px, mesh_height(px, pz) + 0.4, pz, origin), 1.6, 0.7, 3.2)
                        counts["car"] += 1
        for b in shacks:
            if add_shack(
                (model.mesh(0, white), model.mesh(0, blue), model.mesh(0, wood), model.mesh(0, tank)),
                b["p"], origin, 0,
            ):
                add_shack((model.mesh(1, white), model.mesh(1, blue), None, None), b["p"], origin, 1)
                counts["shack"] += 1

    info = write_glb(model, HERO / f"{sid}.glb")
    check_glb(HERO / f"{sid}.glb")
    # Furthest sample must stay inside the low-quality hero cap.
    far = max(math.hypot(s["x"] - ox, s["z"] - oz) for s in samples)
    if far > 640:
        raise SystemExit(f"{sid} origin is {far:.0f} m from its own geometry")
    print(sid, "origin", round(ox, 1), round(oz, 1), "y", round(y0, 2), "far", round(far), counts, info)
    for mark in marks:
        if mark[0] == "bus" or (mark[0] == "divi" and mark[3] == "beach" and int(abs(mark[2])) % 3 == 0):
            print(" ", mark)
    return info, (ox, oz, y0), counts


def pick_shacks(buildings, samples):
    """Small beach-side roofs by the Arashi lot that are not the existing shack."""
    arashi = (-9006.38, -9823.73)
    picked = []
    for b in buildings:
        if b["k"] == "hotel" or "hotel" in b["n"].lower() or "ritz" in b["n"].lower():
            continue
        if math.hypot(b["cx"] - arashi[0], b["cz"] - arashi[1]) < 16:
            continue
        if not (-9920 < b["cz"] < -9760 and -9060 < b["cx"] < -8960):
            continue
        if b["w"] > 16 or b["d"] > 16 or b["w"] * b["d"] > 150 or b["h"] > 4.5:
            continue
        # beach side of the road
        road_x = None
        for s in samples:
            if abs(s["z"] - b["cz"]) < 6:
                road_x = s["x"]
                break
        if road_x is None or b["cx"] > road_x - 6:
            continue
        picked.append(b)
    picked.sort(key=lambda b: b["w"] * b["d"])
    return picked[:2]


def manifest_entry(sid, origin, info, refs):
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
        "hide_footprint": [[round(ox, 2), round(oz, 2)], [round(ox + 0.2, 2), round(oz, 2)], [round(ox + 0.2, 2), round(oz + 0.2, 2)]],
        "hide": [],
        "sign": False,
        "kind": "replace",
        "new_place": False,
        "geo_source": "OSM coast-road centreline, J.E. Irausquin north end to L.G. Smith at Arashi",
        "ref_sources": refs,
        "frame": "glb origin = road sample (world x,z); glTF +X = world x, +Z = world z, Y up; y is the DEM height at the origin",
        "cat": "landmark",
    }


def patch_manifest(entries, shack_hides):
    text = MANIFEST.read_text()
    while True:
        pos = text.find('"id": "nw_pb_')
        if pos < 0:
            break
        start = text.rfind("{", 0, pos)
        cut = text.rfind(",", 0, start)
        if start - cut > 30:
            raise SystemExit("manifest comma not next to the nw_pb_ object")
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
        if obj.count('"id"') != 1 or '"id": "nw_pb_' not in obj:
            raise SystemExit("refusing to cut a non nw_pb_ object")
        text = text[:cut] + text[end:]
    body = text.rstrip()
    if not body.endswith("]"):
        raise SystemExit("manifest does not end with ]")
    body = body[:-1].rstrip()
    if body.endswith(","):
        body = body[:-1].rstrip()
    if not body.endswith("}"):
        raise SystemExit("manifest tail is not an object")
    json.loads(body + "\n]\n")
    # The Arashi hero hides the two generic roofs it replaces.
    if shack_hides:
        for e in entries:
            if e["id"] == "nw_pb_arashi":
                e["hide_footprint"] = shack_hides
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
    # The splice must not have rewritten earlier entries.
    again = json.loads(body + "\n]\n")
    if len(data) != len(again) + len(entries):
        raise SystemExit("manifest length mismatch")
    MANIFEST.write_text(text)
    print("manifest", want)


def main():
    roads, buildings, veg_p, veg_d, lamps = load_world()
    golf = load_golf()
    samples = build_samples(roads)
    if len(samples) < 200:
        raise SystemExit(f"only {len(samples)} road samples")
    groups = assign(samples)
    shacks = pick_shacks(buildings, groups["nw_pb_arashi"])
    print("shacks", [(round(b["cx"], 1), round(b["cz"], 1), round(b["w"], 1), round(b["d"], 1), b["k"], b["n"]) for b in shacks])
    refs = (
        "Wikimedia Commons 'Windswept Watapana Tree Divi-Divi ... Malmok Beach Noord Aruba': "
        "dark trunk, crown streamed west over a pale sandy shoulder. "
        "Wikimedia 'Arashi, Aruba - panoramio': open gravel lot and a row of cars between the road and the beach, low roofs, palms. "
        "pb_busstops: blue-roofed Arubus shelter. Hook-arm lamps already on J.E. Irausquin (pb_jei) are left in place; "
        "these posts fill gaps on the Oduber / L.G. Smith continuation north of the hotels."
    )
    entries = []
    hides = []
    for sid, _z0, _z1 in SEGMENTS:
        info, origin, _counts = build_segment(sid, groups[sid], buildings, golf, veg_p, veg_d, lamps, shacks if sid == "nw_pb_arashi" else [])
        entries.append(manifest_entry(sid, origin, info, refs))
    for b in shacks:
        hides.append([[round(p[0], 2), round(p[1], 2)] for p in b["p"]])
    # hide_footprint is one ring, not a list of rings. Use the first shack's
    # ring and a second hero field only if the loader accepts one polygon.
    # The loader hides a single polygon. Two shacks need two rings; store the
    # larger union as one ring around both if they are close, else only the first.
    if len(hides) == 2:
        a, c = hides
        # one ring that contains both footprints, so both generic roofs drop
        xs = [p[0] for ring in hides for p in ring]
        zs = [p[1] for ring in hides for p in ring]
        pad = 0.4
        hides = [[
            [round(min(xs) - pad, 2), round(min(zs) - pad, 2)],
            [round(max(xs) + pad, 2), round(min(zs) - pad, 2)],
            [round(max(xs) + pad, 2), round(max(zs) + pad, 2)],
            [round(min(xs) - pad, 2), round(max(zs) + pad, 2)],
        ]]
    elif len(hides) == 1:
        hides = hides
    else:
        hides = []
    if hides:
        # don't let the union swallow the existing Arashi shack
        if pip(-9006.38, -9823.73, hides[0]):
            raise SystemExit("shack hide would cover arashishack")
    patch_manifest(entries, hides[0] if hides else None)
    print("samples", len(samples), "buildings considered", len(buildings))
    for z in (-7200, -7400, -7480, -7700, -8200, -8420, -8800, -9100, -9280, -9500, -9760, -9860, -9920):
        hit = center_at(roads, z)
        if hit:
            print(f" road z={z} x={hit[0]:.1f} w={hit[1]:.1f} sw={hit[2]} {hit[5]}")


if __name__ == "__main__":
    sys.exit(main())
