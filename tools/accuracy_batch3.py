#!/usr/bin/env python3
"""Batch 3 — San Nicolas (not the murals), inland cunucu houses, Balashi, highway curbs.

Improves in place: balashi.glb (same id, origin, footprint, node names).
Adds heroes. Does not touch charliesbar, the sn_* mural set, or web_balashi_tanks.

References are visual guides only. Nothing here is a pasted photo.
"""
import json
import math
import os
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from hero_glb import (
    Model, box, check_glb, fan, prism, sign_quad, wall_ring, write_glb,
)

ROOT = Path(__file__).resolve().parents[1]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
REAL = ROOT / "game" / "data" / "real"
FONT = "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf"

WHITE = (0.94, 0.93, 0.88)
BROWN = (0.36, 0.16, 0.09)
YELLOW = (0.95, 0.68, 0.08)
RED_ROOF = (0.72, 0.18, 0.16)
CLAY = (0.62, 0.24, 0.14)
GLASS = (0.07, 0.10, 0.14)
STEEL = (0.72, 0.75, 0.78)
CONCRETE = (0.78, 0.76, 0.72)
STACK = (0.70, 0.68, 0.64)
DARK = (0.18, 0.18, 0.18)
BLUE = (0.12, 0.32, 0.62)
BALASHI_BLUE = (0.08, 0.28, 0.62)
THATCH = (0.70, 0.52, 0.24)
WOOD = (0.42, 0.28, 0.14)
SAND = (0.86, 0.80, 0.66)
ORANGE = (0.86, 0.42, 0.12)

# West and east of Charlie's, on Zeppenfeldstraat. Hulls were checked so they
# do not contain Charlie's or an sn_murals hide point.
WEST_HULL = [
    (6812.4, 9629.2), (6816.6, 9614.8), (6838.0, 9602.0), (6846.3, 9604.6),
    (6840.3, 9638.4), (6836.1, 9652.0), (6822.6, 9647.9),
]
EAST_HULL = [
    (6900.5, 9631.6), (6904.4, 9619.5), (6911.8, 9621.9), (6918.9, 9624.3),
    (6914.8, 9636.4), (6906.1, 9658.3), (6902.5, 9657.2),
]
NICOLAAS = [
    (6593.4, 9439.2), (6606.0, 9439.6), (6607.2, 9434.4), (6594.0, 9433.2),
]
# The lot directly behind the storefront. Together they are one corner building.
NICOLAAS_REAR = [
    (6595.1, 9433.0), (6606.0, 9433.8), (6606.0, 9427.6), (6595.1, 9427.6),
]
YIU = [
    (6583.0, 9427.5), (6587.7, 9432.0), (6592.7, 9436.9), (6594.1, 9419.8), (6584.2, 9419.7),
]

# OSM chimney cluster east of San Nicolas (man_made=chimney). World metres.
CHIMNEYS = [
    (7794, 10313, 62), (7837, 10337, 48), (7448, 10193, 44),
    (7792, 10164, 70), (7613, 10418, 40), (7978, 10593, 52), (8083, 10712, 86),
]
REFINERY_O = (8000.0, 10600.0)

HOUSES = [
    # id, ring, road name, wall, fence, roof, porch, cactus
    ("cunucu_paradera", [(-4101.3, -1324.8), (-4101.3, -1318.5), (-4089.9, -1318.6), (-4089.9, -1324.9)],
     "Paradera", (0.95, 0.74, 0.16), (0.93, 0.70, 0.18), CLAY, True, False),
    ("cunucu_piedra", [(-1553.9, -44.0), (-1552.8, -35.4), (-1536.9, -37.4), (-1538.0, -46.0)],
     "Piedra Plat", (0.42, 0.74, 0.68), WHITE, (0.78, 0.38, 0.16), True, False),
    ("cunucu_tanki", [(-5662.1, -1501.9), (-5652.3, -1501.9), (-5652.3, -1516.0), (-5662.1, -1516.0)],
     "Tanki Leendert", (0.88, 0.55, 0.40), (0.62, 0.28, 0.18), CLAY, True, True),
    ("cunucu_sabana", [(801.1, 5399.0), (801.2, 5411.2), (814.0, 5411.0), (813.9, 5398.9)],
     "Sabana Basora", (0.93, 0.86, 0.62), WHITE, (0.70, 0.28, 0.14), True, False),
    ("cunucu_pos", [(1534.5, 5843.1), (1543.0, 5849.8), (1547.5, 5844.2), (1539.0, 5837.5)],
     "Pos Chikito", (0.90, 0.48, 0.58), (0.22, 0.42, 0.70), CLAY, True, False),
]

PASTEL = [
    (0.95, 0.78, 0.32), (0.40, 0.76, 0.74), (0.92, 0.52, 0.60),
    (0.94, 0.92, 0.86), (0.50, 0.70, 0.38), (0.88, 0.46, 0.26),
]
AWNING = [
    (0.75, 0.16, 0.14), (0.85, 0.55, 0.12), (0.15, 0.38, 0.62),
    (0.20, 0.48, 0.32), (0.55, 0.16, 0.38), (0.10, 0.10, 0.12),
]

BALASHI_O = (-1322.2, 4227.0)
BALASHI_RING = [(-1352.8, 4234.2), (-1331.4, 4256.9), (-1291.6, 4219.8), (-1313.0, 4197.1)]


def sign_png(text, bg, fg, w=512, h=128):
    im = Image.new("RGBA", (w, h), bg)
    dr = ImageDraw.Draw(im)
    size = 78
    font = ImageFont.truetype(FONT, size)
    while font.getlength(text) > w - 24 and size > 22:
        size -= 4
        font = ImageFont.truetype(FONT, size)
    tw = font.getlength(text)
    dr.text(((w - tw) / 2, (h - size) / 2 - 2), text, fill=fg, font=font)
    buf = __import__("io").BytesIO()
    im.save(buf, "PNG")
    return buf.getvalue()


def cent(ring):
    return sum(p[0] for p in ring) / len(ring), sum(p[1] for p in ring) / len(ring)


def shoelace(ring):
    a = 0.0
    for i in range(len(ring)):
        x1, z1 = ring[i]
        x2, z2 = ring[(i + 1) % len(ring)]
        a += x1 * z2 - x2 * z1
    return a


def ccw(ring):
    return list(ring) if shoelace(ring) > 0 else list(reversed(ring))


def pip(x, z, poly):
    inside = False
    j = len(poly) - 1
    for i in range(len(poly)):
        xi, zi = poly[i]
        xj, zj = poly[j]
        if (zi > z) != (zj > z) and x < (xj - xi) * (z - zi) / (zj - zi + 1e-12) + xi:
            inside = not inside
        j = i
    return inside


def load_regions():
    roads, buildings = [], []
    for p in sorted(REAL.glob("r_*.json")):
        d = json.loads(p.read_text())
        roads.extend(d.get("roads") or [])
        for b in d.get("b") or []:
            if b.get("p") and len(b["p"]) >= 3:
                buildings.append(b)
    return roads, buildings


def closest_on(roads, x, z, name=None):
    best = 1e18
    bp = (x, z)
    for r in roads:
        if name is not None and r.get("n") != name:
            continue
        pts = r["p"]
        for i in range(len(pts) - 1):
            ax, az = pts[i]
            bx, bz = pts[i + 1]
            dx, dz = bx - ax, bz - az
            L2 = dx * dx + dz * dz
            t = 0 if L2 < 1e-8 else max(0, min(1, ((x - ax) * dx + (z - az) * dz) / L2))
            qx, qz = ax + t * dx, az + t * dz
            d = (qx - x) ** 2 + (qz - z) ** 2
            if d < best:
                best = d
                bp = (qx, qz)
    return bp


class XF:
    """Right-handed map from a local (x, y, z) frame into model space."""

    def __init__(self, mesh, xx, xz, zx, zz):
        self.m = mesh
        self.xx, self.xz, self.zx, self.zz = xx, xz, zx, zz

    def p(self, v):
        x, y, z = v
        return (x * self.xx + z * self.zx, y, x * self.xz + z * self.zz)

    def tri(self, a, b, c, uvs=None):
        self.m.tri(self.p(a), self.p(b), self.p(c), uvs)

    def quad(self, a, b, c, d, uvs=None):
        self.m.quad(self.p(a), self.p(b), self.p(c), self.p(d), uvs=uvs)


def frame_toward(ox, oz, road):
    rx, rz = road[0] - ox, road[1] - oz
    L = math.hypot(rx, rz) or 1.0
    zx, zz = rx / L, rz / L
    xx, xz = zz, -zx  # +X is right when facing the road; det = +1
    return xx, xz, zx, zz


def to_local(x, z, ox, oz, xx, xz, zx, zz):
    dx, dz = x - ox, z - oz
    return dx * xx + dz * xz, dx * zx + dz * zz


def cyl(mesh, cx, cz, r, y0, y1, n=8):
    ring = [(cx + r * math.cos(i * 2 * math.pi / n), cz + r * math.sin(i * 2 * math.pi / n)) for i in range(n)]
    ring = ccw(ring)
    wall_ring(mesh, ring, y0, y1)
    fan(mesh, ring, y1, up=True)
    fan(mesh, ring, y0, up=False)


def hip_local(mesh, x0, x1, z0, z1, ye, yp):
    """Hip roof. Ridge along the long axis. Windings match gable_roof so slopes face up."""
    dx, dz = x1 - x0, z1 - z0
    if dx >= dz:
        ins = max(0.4, min(dx * 0.22, dz * 0.45))
        r0 = (x0 + ins, yp, (z0 + z1) / 2)
        r1 = (x1 - ins, yp, (z0 + z1) / 2)
        mesh.quad((x0, ye, z0), r0, r1, (x1, ye, z0))
        mesh.quad((x1, ye, z1), r1, r0, (x0, ye, z1))
        mesh.tri((x1, ye, z1), (x1, ye, z0), r1)
        mesh.tri((x0, ye, z0), (x0, ye, z1), r0)
    else:
        ins = max(0.4, min(dz * 0.22, dx * 0.45))
        r0 = ((x0 + x1) / 2, yp, z0 + ins)
        r1 = ((x0 + x1) / 2, yp, z1 - ins)
        mesh.quad((x0, ye, z1), (x0, ye, z0), r0, r1)
        mesh.quad((x1, ye, z0), (x1, ye, z1), r1, r0)
        mesh.tri((x0, ye, z1), (x1, ye, z1), r1)
        mesh.tri((x1, ye, z0), (x0, ye, z0), r0)


def palapa(thatch, wood, x, z):
    n = 8
    ring = []
    for i in range(n):
        a = i * 2 * math.pi / n
        ring.append((x + 2.35 * math.cos(a), z + 2.35 * math.sin(a)))
    apex = (x, 3.15, z)
    for i in range(n):
        x0, z0 = ring[i]
        x1, z1 = ring[(i + 1) % n]
        thatch.tri((x0, 2.15, z0), (x1, 2.15, z1), apex)
    for k in range(4):
        a = k * math.pi / 2 + 0.4
        box(wood, x + 1.35 * math.cos(a), 1.05, z + 1.35 * math.sin(a), 0.12, 2.1, 0.12)


def boat(hull, cabin, x, z, hx, hz, color_mesh):
    # long axis along (hx, hz)
    box(color_mesh, x, 0.45, z, 1.3, 0.55, 3.4)
    box(cabin, x, 0.95, z - 0.2, 0.9, 0.5, 1.2)


def build_nicolaas(roads):
    ring = NICOLAAS + NICOLAAS_REAR
    ox, oz = cent(NICOLAAS)
    road = closest_on(roads, ox, oz, "Van de Veen Zeppenfeldstraat")
    xx, xz, zx, zz = frame_toward(ox, oz, road)
    locs = [to_local(x, z, ox, oz, xx, xz, zx, zz) for x, z in ring]
    x0, x1 = min(p[0] for p in locs), max(p[0] for p in locs)
    z0, z1 = min(p[1] for p in locs), max(p[1] for p in locs)
    M = Model("nicolaas_store")
    wall = M.material("wall", YELLOW, 0.8)
    trim = M.material("trim", WHITE, 0.7)
    roof = M.material("roof", RED_ROOF, 0.55)
    wood = M.material("wood", BROWN, 0.75)
    glass = M.material("glass", GLASS, 0.25)
    sign = M.material("sign", YELLOW, 0.6, textured=True, emissive=0.25)
    wing = M.material("wing", (0.38, 0.74, 0.70), 0.82)
    png = sign_png("NICOLAAS STORE", (242, 174, 20, 255), (20, 16, 14, 255), 640, 120)

    def lod_mesh(lod, mat):
        return XF(M.mesh(lod, mat), xx, xz, zx, zz)

    for lod in (0, 1):
        W, T, R, D, G, S = (lod_mesh(lod, m) for m in (wall, trim, roof, wood, glass, sign))
        prism(W, x0, x1, z0, z1, 0.05, 7.05)
        prism(T, x0 - 0.08, x1 + 0.08, z0 - 0.08, z1 + 0.08, 3.45, 3.72)
        prism(T, x0 - 0.08, x1 + 0.08, z0 - 0.08, z1 + 0.08, 6.85, 7.15)
        hip_local(R, x0 - 0.25, x1 + 0.25, z0 - 0.25, z1 + 0.25, 7.05, 8.55)
        # corner pilasters
        for px, pz in ((x0, z0), (x0, z1), (x1, z0), (x1, z1)):
            prism(T, px - 0.18, px + 0.18, pz - 0.18, pz + 0.18, 0.0, 7.15)
        if lod == 0:
            # upper windows on the street face (local +z) and the right face
            span = x1 - x0
            for i in range(4):
                wx = x0 + span * (i + 0.5) / 4
                prism(D, wx - 0.42, wx + 0.42, z1 - 0.05, z1 + 0.12, 4.35, 6.25)
                prism(G, wx - 0.28, wx + 0.28, z1 + 0.08, z1 + 0.16, 4.5, 6.05)
                prism(T, wx - 0.22, wx + 0.22, z1 + 0.1, z1 + 0.2, 4.85, 5.0)
            # ground-floor openings
            for i in range(3):
                wx = x0 + span * (i + 0.5) / 3
                prism(G, wx - 0.55, wx + 0.55, z1 - 0.02, z1 + 0.08, 0.15, 2.7)
                prism(D, wx - 0.68, wx + 0.68, z1 - 0.02, z1 + 0.16, 0.05, 2.85)
                prism(G, wx - 0.5, wx + 0.5, z1 + 0.1, z1 + 0.2, 0.2, 2.65)
            sign_quad(
                S,
                (x0 + 0.4, 3.25, z1 + 0.22),
                (x1 - 0.4, 3.25, z1 + 0.22),
                (x1 - 0.4, 2.72, z1 + 0.22),
                (x0 + 0.4, 2.72, z1 + 0.22),
            )
            # side door on the +x face (side street)
            prism(D, x1 - 0.05, x1 + 0.14, z0 + 0.8, z0 + 2.3, 0.1, 2.7)
            prism(G, x1 + 0.08, x1 + 0.18, z0 + 1.0, z0 + 2.1, 0.25, 2.5)
    # turquoise one-storey neighbour, Yiu di Tera, on the same hero so the
    # corner reads as the photographed pair. Separate hide ring below.
    yox, yoz = cent(YIU)
    # express Yiu in Nicolaas's model space (Nicolaas origin)
    yring = [(x - ox, z - oz) for x, z in ccw(YIU)]
    for lod in (0, 1):
        Wm = M.mesh(lod, wing)
        Tm = M.mesh(lod, trim)
        wall_ring(Wm, yring, 0.05, 3.5)
        fan(Tm, yring, 3.65, up=True)
        if lod == 0:
            fan(Wm, yring, 0.05, up=False)
    info = write_glb(M, HERO / "nicolaas_store.glb", images=[png])
    check_glb(HERO / "nicolaas_store.glb")
    hide = ccw(NICOLAAS + YIU)  # not a hull; caller passes a real hull
    print("nicolaas", round(ox, 1), round(oz, 1), "front road", [round(v, 1) for v in road], info)
    return info, (ox, oz), nicolaas_hide()


def nicolaas_hide():
    return hull(NICOLAAS + NICOLAAS_REAR + YIU)


def hull(pts):
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


def buildings_in(buildings, poly):
    out = []
    for b in buildings:
        p = b["p"]
        cx, cz = cent(p)
        if pip(cx, cz, poly):
            out.append(b)
    return out


def build_shop_row(id_, poly, buildings, roads):
    chosen = buildings_in(buildings, poly)
    if not chosen:
        raise SystemExit(f"no shops in {id_}")
    ox = sum(cent(b["p"])[0] for b in chosen) / len(chosen)
    oz = sum(cent(b["p"])[1] for b in chosen) / len(chosen)
    M = Model(id_)
    trim = M.material("trim", WHITE, 0.75)
    glass = M.material("glass", GLASS, 0.3, double=True)
    roof = M.material("roof", (0.55, 0.22, 0.16), 0.7)
    mats = []
    for i, _b in enumerate(chosen):
        wall = M.material(f"w{i}", PASTEL[i % len(PASTEL)], 0.82)
        awn = M.material(f"a{i}", AWNING[i % len(AWNING)], 0.6, double=True)
        mats.append((wall, awn))
    for lod in (0, 1):
        for i, b in enumerate(chosen):
            ring = [(x - ox, z - oz) for x, z in ccw(b["p"])]
            bx, bz = cent(b["p"])
            road = closest_on(roads, bx, bz, "Van de Veen Zeppenfeldstraat")
            # front edge: midpoint closest to the road
            best, bi = 1e18, 0
            for k in range(len(ring)):
                a, c = ring[k], ring[(k + 1) % len(ring)]
                mx, mz = (a[0] + c[0]) / 2 + ox, (a[1] + c[1]) / 2 + oz
                d = (mx - road[0]) ** 2 + (mz - road[1]) ** 2
                if d < best:
                    best, bi = d, k
            a, c = ring[bi], ring[(bi + 1) % len(ring)]
            dx, dz = c[0] - a[0], c[1] - a[1]
            L = math.hypot(dx, dz) or 1
            # outward is to the right of a CCW edge
            oxn, ozn = dz / L, -dx / L
            wall, awn = mats[i]
            Wm, Tm, Rm = M.mesh(lod, wall), M.mesh(lod, trim), M.mesh(lod, roof)
            h = 6.4 if (b.get("h") or 0) >= 6 else 3.7
            wall_ring(Wm, ring, 0.05, h)
            fan(Rm, ring, h + 0.12, up=True)
            # parapet
            wall_ring(Tm, ring, h - 0.08, h + 0.28)
            if lod == 1:
                continue
            Am, Gm = M.mesh(lod, awn), M.mesh(lod, glass)
            depth = 1.05
            y0, y1 = 2.45, 2.75
            a0 = (a[0], y0, a[1])
            b0 = (c[0], y0, c[1])
            a1 = (a[0] + oxn * depth, y1, a[1] + ozn * depth)
            b1 = (c[0] + oxn * depth, y1, c[1] + ozn * depth)
            Am.quad(a0, b0, b1, a1)
            Am.quad(a1, b1, (c[0] + oxn * depth, y0 - 0.08, c[1] + ozn * depth), (a[0] + oxn * depth, y0 - 0.08, a[1] + ozn * depth))
            # door, centred on the front edge, pushed just outside the wall
            mx, mz = (a[0] + c[0]) / 2, (a[1] + c[1]) / 2
            px, pz = -dz / L, dx / L
            door = [
                (mx - px * 0.55 + oxn * 0.08, 0.15, mz - pz * 0.55 + ozn * 0.08),
                (mx + px * 0.55 + oxn * 0.08, 0.15, mz + pz * 0.55 + ozn * 0.08),
                (mx + px * 0.55 + oxn * 0.08, 2.35, mz + pz * 0.55 + ozn * 0.08),
                (mx - px * 0.55 + oxn * 0.08, 2.35, mz - pz * 0.55 + ozn * 0.08),
            ]
            Gm.quad(door[0], door[1], door[2], door[3])
    info = write_glb(M, HERO / f"{id_}.glb")
    check_glb(HERO / f"{id_}.glb")
    print(id_, "shops", len(chosen), [b.get("n") for b in chosen], "at", round(ox, 1), round(oz, 1), info)
    return info, (ox, oz), hull([p for b in chosen for p in b["p"]])


def build_house(spec, roads):
    id_, ring, road_name, wall_c, fence_c, roof_c, porch, cactus = spec
    ox, oz = cent(ring)
    road = closest_on(roads, ox, oz, road_name)
    xx, xz, zx, zz = frame_toward(ox, oz, road)
    locs = [to_local(x, z, ox, oz, xx, xz, zx, zz) for x, z in ring]
    x0, x1 = min(p[0] for p in locs) + 0.15, max(p[0] for p in locs) - 0.15
    z0, z1 = min(p[1] for p in locs) + 0.15, max(p[1] for p in locs) - 0.15
    if x1 - x0 < 3 or z1 - z0 < 3:
        x0, x1 = min(p[0] for p in locs), max(p[0] for p in locs)
        z0, z1 = min(p[1] for p in locs), max(p[1] for p in locs)
    M = Model(id_)
    wall = M.material("wall", wall_c, 0.84)
    trim = M.material("trim", WHITE, 0.7)
    roof = M.material("roof", roof_c, 0.65)
    fence = M.material("fence", fence_c, 0.9)
    wood = M.material("wood", BROWN, 0.8)
    glass = M.material("glass", GLASS, 0.3)
    cactus_m = M.material("cactus", (0.28, 0.48, 0.24), 0.9) if cactus else None

    def X(lod, mat):
        return XF(M.mesh(lod, mat), xx, xz, zx, zz)

    for lod in (0, 1):
        W, T, R, F = X(lod, wall), X(lod, trim), X(lod, roof), X(lod, fence)
        prism(W, x0, x1, z0, z1 - 1.15, 0.08, 3.15)
        # porch recess: the front 1.15 m is a gallery under the main roof
        prism(T, x0, x1, z1 - 1.2, z1, 2.55, 2.72)
        hip_local(R, x0 - 0.35, x1 + 0.35, z0 - 0.35, z1 + 0.45, 3.05, 4.55)
        prism(T, x0 - 0.06, x1 + 0.06, z0 - 0.06, z1 + 0.06, 2.95, 3.15)
        # chimney on the left
        prism(T, x0 + 0.4, x0 + 1.15, z0 + 0.4, z0 + 1.2, 3.0, 4.7)
        # fence, open at the front centre
        fx0, fx1 = x0 - 1.5, x1 + 1.5
        fz0, fz1 = z0 - 1.5, z1 + 1.7
        gap0, gap1 = -1.15, 1.15
        prism(F, fx0, fx1, fz0, fz0 + 0.16, 0.05, 0.9)
        prism(F, fx0, fx0 + 0.16, fz0, fz1, 0.05, 0.9)
        prism(F, fx1 - 0.16, fx1, fz0, fz1, 0.05, 0.9)
        prism(F, fx0, gap0, fz1 - 0.16, fz1, 0.05, 0.9)
        prism(F, gap1, fx1, fz1 - 0.16, fz1, 0.05, 0.9)
        if lod == 0:
            D, G = X(lod, wood), X(lod, glass)
            for px in (x0 + 0.8, (x0 + x1) / 2, x1 - 0.8):
                prism(D, px - 0.08, px + 0.08, z1 - 1.25, z1 - 1.05, 0.05, 2.6)
            prism(G, -0.45, 0.45, z1 - 1.22, z1 - 1.05, 0.15, 2.15)
            prism(T, -0.55, 0.55, z1 - 1.28, z1 - 1.02, 0.05, 2.25)
            # windows on the front wall behind the porch
            for px in (x0 + (x1 - x0) * 0.28, x0 + (x1 - x0) * 0.72):
                prism(T, px - 0.4, px + 0.4, z1 - 1.28, z1 - 1.12, 1.15, 2.15)
                prism(G, px - 0.28, px + 0.28, z1 - 1.18, z1 - 1.08, 1.25, 2.05)
            # fence posts and caps
            for px, pz in ((fx0, fz0), (fx1, fz0), (fx0, fz1), (fx1, fz1), (gap0, fz1), (gap1, fz1)):
                prism(T, px - 0.22, px + 0.22, pz - 0.22, pz + 0.22, 0.05, 1.25)
                prism(T, px - 0.32, px + 0.32, pz - 0.32, pz + 0.32, 1.2, 1.38)
            if cactus_m:
                C = X(lod, cactus_m)
                for i, px in enumerate((-2.2, -0.6, 0.8, 2.0)):
                    h = 1.5 + (i % 3) * 0.35
                    prism(C, px - 0.12, px + 0.12, fz0 + 0.35, fz0 + 0.6, 0.9, 0.9 + h)
    info = write_glb(M, HERO / f"{id_}.glb")
    check_glb(HERO / f"{id_}.glb")
    print(id_, round(ox, 1), round(oz, 1), info)
    return info, (ox, oz), ring


def build_balashi(roads):
    ox, oz = BALASHI_O
    ring = [(x - ox, z - oz) for x, z in ccw(BALASHI_RING)]
    road = closest_on(roads, ox, oz, "Balashi")
    # front edge
    best, bi = 1e18, 0
    for k in range(len(ring)):
        a, b = ring[k], ring[(k + 1) % len(ring)]
        mx, mz = (a[0] + b[0]) / 2 + ox, (a[1] + b[1]) / 2 + oz
        d = (mx - road[0]) ** 2 + (mz - road[1]) ** 2
        if d < best:
            best, bi = d, k
    a, b = ring[bi], ring[(bi + 1) % len(ring)]
    dx, dz = b[0] - a[0], b[1] - a[1]
    L = math.hypot(dx, dz) or 1
    oxn, ozn = dz / L, -dx / L
    M = Model("balashi")
    wall = M.material("wall", (0.90, 0.90, 0.86), 0.78)
    blue = M.material("blue", BALASHI_BLUE, 0.55)
    roof = M.material("roof", (0.45, 0.48, 0.50), 0.6)
    steel = M.material("steel", STEEL, 0.35)
    sign = M.material("sign", (0.95, 0.85, 0.35), 0.5, textured=True, emissive=0.35)
    garden = M.material("garden", (0.16, 0.45, 0.22), 0.9)
    png = sign_png("BALASHI", (12, 48, 120, 255), (245, 214, 90, 255), 640, 160)
    for lod in (0, 1):
        Wm, Bm, Rm = M.mesh(lod, wall), M.mesh(lod, blue), M.mesh(lod, roof)
        wall_ring(Wm, ring, 0.1, 8.2)
        fan(Rm, ring, 8.35, up=True)
        # blue fascia just under the eaves, as a slightly larger ring is hard;
        # a band of boxes along the front is enough to read from the road.
        wall_ring(Bm, ring, 6.6, 7.15)
        if lod == 0:
            Sm, Gm, St = M.mesh(lod, sign), M.mesh(lod, garden), M.mesh(lod, steel)
            fan(Wm, ring, 0.1, up=False)
            # fermenters on the side opposite the road
            mx = sum(p[0] for p in ring) / len(ring)
            mz = sum(p[1] for p in ring) / len(ring)
            for i, (fx, fz) in enumerate(((-10, -6), (-4, -9), (3, -7), (9, -10))):
                # push away from the road
                px = mx + fx - oxn * 16
                pz = mz + fz - ozn * 16
                cyl(St, px, pz, 2.1, 0.1, 7.4 + (i % 2), n=8)
                cyl(Bm, px, pz, 2.18, 4.2, 4.55, n=8)
            # sign on the road face
            depth = 0.35
            mid = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
            half = min(8.0, L * 0.32)
            tx, tz = dx / L, dz / L
            s0 = (mid[0] - tx * half + oxn * depth, mid[1] - tz * half + ozn * depth)
            s1 = (mid[0] + tx * half + oxn * depth, mid[1] + tz * half + ozn * depth)
            sign_quad(Sm, (s0[0], 6.3, s0[1]), (s1[0], 6.3, s1[1]), (s1[0], 4.5, s1[1]), (s0[0], 4.5, s0[1]))
            # beer-garden canopy in front of the sign
            for s in (-6, 6):
                box(Bm, mid[0] + tx * s + oxn * 6, 2.2, mid[1] + tz * s + ozn * 6, 0.25, 4.4, 0.25)
            box(Bm, mid[0] + oxn * 6, 4.35, mid[1] + ozn * 6, L * 0.55, 0.18, 5.5)
            box(Gm, mid[0] + oxn * 8, 0.08, mid[1] + ozn * 8, L * 0.5, 0.12, 7)
        else:
            cyl(M.mesh(lod, steel), sum(p[0] for p in ring) / len(ring) - oxn * 18,
                sum(p[1] for p in ring) / len(ring) - ozn * 18, 3.2, 0.1, 8.0, n=6)
    info = write_glb(M, HERO / "balashi.glb", images=[png])
    check_glb(HERO / "balashi.glb")
    print("balashi", info, "road", [round(v, 1) for v in road])
    return info


def build_web(roads):
    # Name the plant from the road. The tank farm hero is already detailed and stays.
    best = None
    for r in roads:
        if "W.E.B" not in (r.get("n") or ""):
            continue
        for i in range(len(r["p"]) - 1):
            ax, az = r["p"][i]
            bx, bz = r["p"][i + 1]
            mx, mz = (ax + bx) / 2, (az + bz) / 2
            d = (mx + 960) ** 2 + (mz - 5050) ** 2
            if best is None or d < best[0]:
                best = (d, ax, az, bx, bz)
    if best is None:
        raise SystemExit("WEB road missing")
    _, ax, az, bx, bz = best
    mx, mz = (ax + bx) / 2, (az + bz) / 2
    dx, dz = bx - ax, bz - az
    L = math.hypot(dx, dz) or 1
    # offset toward the tanks, but face the sign back at the road (det stays +1)
    sx, sz = -dz / L, dx / L
    if (mx + sx * 8 + 960) ** 2 + (mz + sz * 8 - 5050) ** 2 > (mx - sx * 8 + 960) ** 2 + (mz - sz * 8 - 5050) ** 2:
        sx, sz = -sx, -sz
    ox, oz = mx + sx * 7.5, mz + sz * 7.5
    zx, zz = -sx, -sz
    xx, xz = zz, -zx
    M = Model("web_gate")
    white = M.material("white", WHITE, 0.7)
    blue = M.material("blue", (0.10, 0.35, 0.70), 0.5)
    sign = M.material("sign", (0.10, 0.35, 0.70), 0.45, textured=True, emissive=0.3)
    png = sign_png("W.E.B.  BALASHI", (10, 55, 130, 255), (245, 245, 240, 255), 640, 140)
    for lod in (0, 1):
        W = XF(M.mesh(lod, white), xx, xz, zx, zz)
        B = XF(M.mesh(lod, blue), xx, xz, zx, zz)
        # posts and beam. Origin is the gate, so local 0 is the sign.
        prism(W, -3.4, -2.9, -0.25, 0.25, 0, 3.4)
        prism(W, 2.9, 3.4, -0.25, 0.25, 0, 3.4)
        prism(B, -3.5, 3.5, -0.3, 0.3, 3.15, 3.55)
        if lod == 0:
            S = XF(M.mesh(lod, sign), xx, xz, zx, zz)
            sign_quad(S, (-2.7, 2.85, 0.32), (2.7, 2.85, 0.32), (2.7, 2.05, 0.32), (-2.7, 2.05, 0.32))
            prism(B, -2.6, 2.6, 0.18, 0.36, 1.95, 2.95)
    info = write_glb(M, HERO / "web_gate.glb", images=[png])
    check_glb(HERO / "web_gate.glb")
    print("web_gate", round(ox, 1), round(oz, 1), info)
    return info, (ox, oz)


def build_refinery():
    ox, oz = REFINERY_O
    M = Model("refinery_sky")
    conc = M.material("conc", STACK, 0.8)
    dark = M.material("dark", DARK, 0.7)
    tank = M.material("tank", (0.86, 0.87, 0.84), 0.55)
    band = M.material("band", (0.25, 0.28, 0.30), 0.5)
    steel = M.material("steel", STEEL, 0.4)
    flame = M.material("flame", (1.0, 0.42, 0.05), 0.3, emissive=0.9)
    shed = M.material("shed", (0.55, 0.56, 0.58), 0.75)

    def rel(x, z):
        return x - ox, z - oz

    for lod in (0, 1):
        C, D, T = M.mesh(lod, conc), M.mesh(lod, dark), M.mesh(lod, tank)
        if lod == 0:
            B, S, F, H = M.mesh(lod, band), M.mesh(lod, steel), M.mesh(lod, flame), M.mesh(lod, shed)
            for x, z, h in CHIMNEYS:
                rx, rz = rel(x, z)
                if h >= 80:
                    cyl(C, rx, rz, 2.4, 0, h - 6, n=8)
                    cyl(D, rx, rz, 2.5, h - 6, h, n=8)
                    cyl(F, rx, rz, 0.7, h, h + 3.2, n=6)
                else:
                    cyl(S, rx, rz, 1.5, 0, h, n=8)
                    cyl(D, rx, rz, 1.7, h * 0.55, h * 0.55 + 0.6, n=8)
                    cyl(C, rx, rz, 2.6, h * 0.72, h * 0.72 + 0.35, n=8)
            # tank farm just north of the columns, where OSM storage tanks sit
            for i, (dx, dz) in enumerate(((-520, -280), (-470, -330), (-560, -240))):
                cyl(T, dx, dz, 16, 0, 14, n=10)
                cyl(B, dx, dz, 16.2, 8.5, 9.3, n=10)
            box(H, -80, 4, -40, 70, 8, 24)
            box(H, 40, 3, 20, 40, 6, 18)
        else:
            for x, z, h in CHIMNEYS:
                rx, rz = rel(x, z)
                box(C if h < 80 else D, rx, h / 2, rz, 4, h, 4)
            box(T, -510, 7, -290, 40, 14, 40)
    info = write_glb(M, HERO / "refinery_sky.glb")
    check_glb(HERO / "refinery_sky.glb")
    print("refinery", info)
    return info


def build_beaches():
    # Baby Beach sand (terrain about +0.4 to +2 m). The first placement sat in the
    # lagoon (terrain below 0). East of Rum Reef, clear of Big Mama and Secrets.
    baby = [(9600, 11668), (9655, 11672), (9710, 11666), (9760, 11674)]
    ox = sum(p[0] for p in baby) / len(baby)
    oz = sum(p[1] for p in baby) / len(baby)
    M = Model("baby_palapas")
    thatch = M.material("thatch", THATCH, 0.95, double=True)
    wood = M.material("wood", WOOD, 0.85)
    rock = M.material("rock", (0.72, 0.68, 0.58), 0.95)
    for lod in (0, 1):
        Th, W = M.mesh(lod, thatch), M.mesh(lod, wood)
        pts = baby if lod == 0 else baby[::2]
        for x, z in pts:
            palapa(Th, W, x - ox, z - oz)
        if lod == 0:
            R = M.mesh(lod, rock)
            for x, z, s in ((9625, 11658, 1.3), (9705, 11658, 1.6), (9755, 11662, 1.1)):
                box(R, x - ox, s * 0.35, z - oz, s * 1.6, s * 0.7, s)
    info_b = write_glb(M, HERO / "baby_palapas.glb")
    check_glb(HERO / "baby_palapas.glb")

    # Rodgers Beach sand is the low strip just west of Baby Beach (terrain +0.4 to +2.5 m).
    # The lagoon polygon's eastern edge is open water, so palapas are not hung on it.
    spots = [(9385, 11495), (9435, 11525), (9475, 11555), (9368, 11540), (9455, 11490)]
    boats = [(9300, 11510, 1, 0), (9285, 11470, 1, 0), (9260, 11530, 0, 1)]
    rx = sum(p[0] for p in spots) / len(spots)
    rz = sum(p[1] for p in spots) / len(spots)
    R = Model("rodgers_beach")
    thatch = R.material("thatch", THATCH, 0.95, double=True)
    wood = R.material("wood", WOOD, 0.85)
    red = R.material("red", (0.72, 0.16, 0.12), 0.6)
    blue = R.material("blue", (0.12, 0.32, 0.62), 0.55)
    yellow = R.material("yellow", (0.90, 0.75, 0.15), 0.6)
    cabin = R.material("cabin", WHITE, 0.7)
    colors = [red, blue, yellow]
    for lod in (0, 1):
        Th, W = R.mesh(lod, thatch), R.mesh(lod, wood)
        use = spots if lod == 0 else spots[::2]
        for x, z in use:
            palapa(Th, W, x - rx, z - rz)
        if lod == 0:
            for i, (x, z, hx, hz) in enumerate(boats[:3]):
                boat(None, R.mesh(lod, cabin), x - rx, z - rz, hx, hz, R.mesh(lod, colors[i]))
    info_r = write_glb(R, HERO / "rodgers_beach.glb")
    check_glb(HERO / "rodgers_beach.glb")
    print("baby", round(ox, 1), round(oz, 1), info_b)
    print("rodgers", round(rx, 1), round(rz, 1), "palapas", len(spots), info_r)
    return info_b, (ox, oz), info_r, (rx, rz)


def owned_highway(r):
    if r.get("u") or r.get("rb") or r.get("sw"):
        return False
    if (r.get("c") or 0) < 3:
        return False
    w = r.get("w") or 0
    if w < 6.5 or w > 30:
        return False
    name = r.get("n") or ""
    if name in ("J.E. Irausquin Boulevard",):
        return False
    pts = r.get("p") or []
    if len(pts) < 2:
        return False
    for x, z in pts:
        if z < -1800 or x < -7800:
            return False
        if x < -6400 and z < 400:
            return False
    return True


def patch_sidewalks():
    n = 0
    files = 0
    for p in sorted(REAL.glob("r_*.json")):
        raw = p.read_text()
        body = raw.strip()
        d = json.loads(body)
        compact = json.dumps(d, separators=(",", ":"))
        style = (",", ":") if body == compact else (", ", ": ")
        ch = False
        for r in d.get("roads") or []:
            if owned_highway(r):
                r["sw"] = 1
                ch = True
                n += 1
        if not ch:
            continue
        text = json.dumps(d, separators=style)
        if not raw.endswith("\n"):
            p.write_text(text)
        else:
            p.write_text(text + "\n")
        files += 1
    print("sidewalks", n, "segments in", files, "files")
    return n


def manifest_entry(id_, name, x, z, info, switch, cat, hide, refs, new_place, textures=0):
    return {
        "id": id_, "k": id_, "name": name, "status": "v5-accuracy",
        "x": round(x, 2), "z": round(z, 2), "y": 0, "rotation": 0,
        "glb": f"models/hero/{id_}.glb",
        "lod": {"hi": f"{id_}_lod0", "lo": f"{id_}_lod1", "switch_m": switch},
        "tris": {f"{id_}_lod0": info["lod0"], f"{id_}_lod1": info["lod1"]},
        "textures": textures,
        "hide_footprint": [[round(p[0], 2), round(p[1], 2)] for p in hide] if hide else None,
        "hide": [],
        "sign": False,
        "kind": "replace",
        "new_place": new_place,
        "geo_source": "OSM building footprint",
        "ref_sources": refs,
        "frame": "glb origin = footprint centroid (world x,z); glTF +X = world x, +Z = world z, Y up",
        "cat": cat,
    }


def patch_manifest(balashi_info, balashi_ref, entries):
    import re
    text = MANIFEST.read_text()
    for id_ in [e["id"] for e in entries]:
        if f'"id": "{id_}"' in text:
            raise SystemExit(f"{id_} already in the manifest")
    text2, n = re.subn(rf'("balashi_lod0": )\d+', rf'\g<1>{balashi_info["lod0"]}', text, count=1)
    text2, n2 = re.subn(rf'("balashi_lod1": )\d+', rf'\g<1>{balashi_info["lod1"]}', text2, count=1)
    if n != 1 or n2 != 1:
        raise SystemExit(f"balashi tris patch failed {n},{n2}")
    idx = text2.find('"id": "balashi"')
    nxt = text2.find('\n  "id":', idx + 4)
    # balashi's next id is indented with two spaces inside the array item,
    # and the following object starts a new "id" at two-space indent too.
    ridx = text2.find('"ref_sources":', idx, nxt if nxt > 0 else len(text2))
    if ridx < 0:
        raise SystemExit("balashi ref missing")
    q_open = text2.find('"', ridx + len('"ref_sources"'))
    q_close = q_open + 1
    while True:
        q_close = text2.find('"', q_close)
        if q_close < 0 or text2[q_close - 1] != "\\":
            break
        q_close += 1
    ref_esc = balashi_ref.replace("\\", "\\\\").replace('"', '\\"')
    text = text2[:q_open + 1] + ref_esc + text2[q_close:]
    if not text.rstrip().endswith("]"):
        raise SystemExit("manifest does not end with ]")
    text = text.rstrip()[:-1].rstrip()
    if not text.endswith("}"):
        raise SystemExit("unexpected manifest ending")
    text = text + ","
    for e in entries:
        blob = json.dumps(e, indent=1)
        blob = "\n".join(" " + ln for ln in blob.split("\n"))
        text = text + "\n" + blob + ","
    text = text[:-1] + "\n]\n"
    json.loads(text)
    MANIFEST.write_text(text)
    print("manifest", len(entries), "new entries")


def main():
    roads, buildings = load_regions()
    info_n, (nx, nz), hide_n = build_nicolaas(roads)
    # guard: nicolaas hull must contain the store and not Charlie's
    if not pip(6600.1, 9436.6, hide_n):
        raise SystemExit("nicolaas hide missed the store")
    swallowed = [b.get("n") or "?" for b in buildings_in(buildings, hide_n)]
    print("nicolaas hide covers", swallowed)
    if sorted(swallowed) != sorted(["Nicolas store/ Kulture Cafe", "Yiu di Tera", "?"]):
        raise SystemExit("nicolaas hide would remove a neighbouring building")
    info_w, (wx, wz), hide_w = build_shop_row("snmain_west", WEST_HULL, buildings, roads)
    info_e, (ex, ez), hide_e = build_shop_row("snmain_east", EAST_HULL, buildings, roads)
    if pip(6875.3, 9642.9, hide_w) or pip(6875.3, 9642.9, hide_e):
        raise SystemExit("shop row would hide Charlie's")
    houses = [build_house(spec, roads) for spec in HOUSES]
    info_b = build_balashi(roads)
    info_web, (gx, gz) = build_web(roads)
    info_ref = build_refinery()
    info_baby, (bx, bz), info_rod, (rx, rz) = build_beaches()
    mode = os.environ.get("B3_DATA", "1")
    if mode == "0":
        print("skipping sidewalks and manifest (B3_DATA=0)")
        return
    if mode != "manifest-only":
        patch_sidewalks()

    nic_ref = (
        "Wikimedia Commons '01Nicolaas Store': two-storey yellow corner, white cornice and pilasters, "
        "pink-red hip roof, brown shuttered upper windows, NICOLAAS STORE lettering, open ground floor. "
        "OSM 'Nicolas store/ Kulture Cafe' on B. van der Veen Zeppenfeldstraat 27, with the turquoise "
        "one-storey neighbour (Yiu di Tera). Geometry only, not a photo texture."
    )
    shop_ref = (
        "San Nicolas Main Street is B. van der Veen Zeppenfeldstraat. One-storey shopfronts with "
        "pastel walls and coloured awnings on the lots beside Charlie's that are not in the sn_murals "
        "hide list. Charlie's Bar itself is unchanged."
    )
    house_ref = (
        "Cunucu house: one storey, coloured walls, red hip roof, porch, low concrete fence with white caps. "
        "Guides: Commons 'Cunucu House Sabana Basora 2' (cream walls, porch, red hip) and "
        "'Cunucu Traditional Countryside ... Santa Cruz' (salmon walls, terracotta fence, cactus). "
        "Placed on an OSM house lot facing the town road. Not a photo texture."
    )
    entries = [
        manifest_entry("nicolaas_store", "Nicolaas Store (San Nicolas Main Street)", nx, nz, info_n, 220, "store",
                       hide_n, nic_ref, True, 1),
        manifest_entry("snmain_west", "", wx, wz, info_w, 180, "store", hide_w, shop_ref, False, 0),
        manifest_entry("snmain_east", "", ex, ez, info_e, 180, "store", hide_e, shop_ref, False, 0),
        manifest_entry(
            "refinery_sky", "San Nicolas refinery", REFINERY_O[0], REFINERY_O[1], info_ref, 1600, "landmark",
            None,
            "OSM man_made=chimney nodes east of San Nicolas (about 12.424 to 12.428 N, 69.902 to 69.896 W) "
            "and nearby storage tanks. Skyline of a tall stack, process columns and white tanks, the view "
            "from Rodgers Beach in Commons 'Raffinaderij gezien vanaf Rodgers Beach'. Simplified, not a photo.",
            True, 0),
        manifest_entry(
            "baby_palapas", "", bx, bz, info_baby, 280, "beach", None,
            "Commons 'Baby Beach (Aruba)': thatch palapas and pale rocks on the sand east of Rum Reef, "
            "clear of the Rum Reef, Big Mama, Secrets and lettered-wall heroes.",
            False, 0),
        manifest_entry(
            "rodgers_beach", "Rodgers Beach", rx, rz, info_rod, 320, "beach", None,
            "Commons Rodgers Beach: thatch palapas on the sand and small fishing boats in the shallows, "
            "on the land side of the lagoon immediately west of Baby Beach. The refinery is the separate skyline hero.",
            True, 0),
        manifest_entry(
            "web_gate", "WEB Balashi desalination", gx, gz, info_web, 400, "landmark", None,
            "WEB Aruba Balashi plant (Balashi 76). The existing web_balashi_tanks hero is the tank farm and was not replaced. "
            "This is the roadside gate: white posts, blue beam, W.E.B. BALASHI sign, on the Balashi W.E.B. road.",
            True, 1),
    ]
    for (info, (hx, hz), ring), spec in zip(houses, HOUSES):
        entries.append(manifest_entry(
            spec[0], "", hx, hz, info, 200, "house", ring, house_ref + f" Road: {spec[2]}.", False, 0))
    balashi_ref = (
        "White industrial hall on OSM brewery footprint 4891, blue fascia, BALASHI sign toward the Balashi road, "
        "stainless fermenters, blue beer-garden canopy. Same origin and hide footprint as the previous hero. "
        "The blue fence and roadside sign heroes are unchanged. balashibrewery.com and the brewery-tour description."
    )
    patch_manifest(info_b, balashi_ref, entries)


if __name__ == "__main__":
    main()
