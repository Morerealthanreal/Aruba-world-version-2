#!/usr/bin/env python3
"""Inland towns, San Nicolas Main Street (non-mural), refinery roadside,
Savaneta waterfront, Hooiberg trailhead, and rural gravel shoulders.

Improves marines_gate in place (same id, origin, node names). Every other
hero is new and sits off the lots already used by queued batches. References
are visual guides only — nothing here is a pasted photo.

Shoulder decision: open Arikok and rural named stretches lose the town
sidewalk flag (sw=0). The road shader then draws a crumbled gravel edge.
Town streets are left alone.
"""
import json
import math
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from hero_glb import (
    Model, check_glb, fan, sign_quad, wall_ring, write_glb,
)

ROOT = Path(__file__).resolve().parents[1]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
REAL = ROOT / "game" / "data" / "real"
FONT = "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf"

CREAM = (0.93, 0.90, 0.82)
WHITE = (0.95, 0.94, 0.90)
PINK = (0.86, 0.55, 0.62)
SALMON = (0.84, 0.48, 0.38)
YELLOW = (0.93, 0.78, 0.28)
MINT = (0.62, 0.78, 0.68)
TURQ = (0.20, 0.62, 0.66)
BANK = (0.90, 0.91, 0.88)
ORANGE = (0.86, 0.48, 0.16)
AWN = (0.72, 0.12, 0.14)
ROOF = (0.55, 0.22, 0.14)
GLASS = (0.06, 0.09, 0.13)
BLACK = (0.08, 0.08, 0.09)
STEEL = (0.55, 0.57, 0.58)
TANK = (0.82, 0.83, 0.80)
PIPE = (0.62, 0.16, 0.12)
GREEN = (0.18, 0.42, 0.22)
STONE = (0.62, 0.58, 0.50)
WOOD = (0.62, 0.48, 0.28)
WOOD_DARK = (0.42, 0.30, 0.16)
SAND = (0.76, 0.68, 0.48)
CACTUS = (0.35, 0.48, 0.28)
FENCE = (0.72, 0.40, 0.28)

# Mural and queued-batch origins that this hide list must not cover.
AVOID = [
    (6922.2, 9656.1), (6953.6, 9665.2), (6970, 9667.6), (6983, 9647),
    (7007.1, 9660.8), (6962, 9684.2), (6844.9, 9648.6), (6886.4, 9611),
    (6911, 9593), (6943.9, 9587), (6892.3, 9592.4), (7034.6, 9662.7),
    (7044.7, 9667.2), (6967.3, 9594.5), (6917, 9577.9), (6749.4, 9579.9),
    (6875.3, 9642.9), (6572.8, 9435.5), (6615.0, 9295.7), (6600.1, 9436.6),
    (6628.5, 9493.0), (2545.8, 8174.2), (2786.0, 8328.0),
]

# #40 skyline columns. This roadside hero stays clear of them.
CHIMNEYS = [
    (7794, 10313), (7837, 10337), (7448, 10193), (7792, 10164),
    (7613, 10418), (7978, 10593), (8083, 10712), (8000, 10600),
]

RURAL_SHOULDER = {
    "Weg Fontein", "Diamantbergweg", "Franse Pas", "Weg Sero Blanco",
    "Ayo", "Balashi", "Hooiberg",
}
OFF_LIMITS_ROADS = {
    "J.E. Irausquin Boulevard", "L.G. Smith Boulevard", "Tamarijn", "Sasakiweg",
}


def sign_png(lines, bg, fg, w=512, h=128):
    im = Image.new("RGBA", (w, h), bg)
    dr = ImageDraw.Draw(im)
    n = len(lines)
    size = 64 if n == 1 else 42
    font = ImageFont.truetype(FONT, size)
    while any(font.getlength(t) > w - 24 for t in lines) and size > 18:
        size -= 2
        font = ImageFont.truetype(FONT, size)
    block = n * (size + 6)
    y = (h - block) / 2
    for t in lines:
        tw = font.getlength(t)
        dr.text(((w - tw) / 2, y), t, fill=fg, font=font)
        y += size + 6
    buf = BytesIO()
    im.save(buf, "PNG")
    return buf.getvalue()


def unit2(x, z):
    L = math.hypot(x, z)
    if L < 1e-6:
        return (0.0, 1.0)
    return (x / L, z / L)


def pip(x, z, poly):
    n = len(poly)
    inside = False
    j = n - 1
    for i in range(n):
        xi, zi = poly[i]
        xj, zj = poly[j]
        if ((zi > z) != (zj > z)) and (x < (xj - xi) * (z - zi) / (zj - zi + 1e-12) + xi):
            inside = not inside
        j = i
    return inside


def convex_hull(pts):
    pts = sorted(set((round(p[0], 2), round(p[1], 2)) for p in pts))
    if len(pts) <= 2:
        return pts

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


class Frame:
    """Local +Z toward the road, local +X = the viewer's right. det +1."""

    def __init__(self, origin, oz):
        zx, zz = unit2(oz[0], oz[1])
        self.oz = (zx, zz)
        self.ox = (zz, -zx)
        self.o = origin

    def p(self, x, y, z):
        return (
            self.o[0] + self.ox[0] * x + self.oz[0] * z,
            y,
            self.o[1] + self.ox[1] * x + self.oz[1] * z,
        )


def box_xf(mesh, fr, x0, x1, y0, y1, z0, z1):
    if x1 < x0:
        x0, x1 = x1, x0
    if y1 < y0:
        y0, y1 = y1, y0
    if z1 < z0:
        z0, z1 = z1, z0
    P = fr.p
    lbf, rbf = P(x0, y0, z0), P(x1, y0, z0)
    rtf, ltf = P(x1, y1, z0), P(x0, y1, z0)
    lbb, rbb = P(x0, y0, z1), P(x1, y0, z1)
    rtb, ltb = P(x1, y1, z1), P(x0, y1, z1)
    mesh.quad(rbf, rbb, rtb, rtf)
    mesh.quad(lbb, lbf, ltf, ltb)
    mesh.quad(ltf, rtf, rtb, ltb)
    mesh.quad(lbf, lbb, rbb, rbf)
    mesh.quad(lbb, ltb, rtb, rbb)
    mesh.quad(lbf, rbf, rtf, ltf)


def cyl_xf(mesh, fr, cx, cz, r, y0, y1, n=8):
    ring = []
    for i in range(n):
        a = 2 * math.pi * i / n
        ring.append((cx + r * math.cos(a), cz + r * math.sin(a)))
    world = [(fr.p(x, 0, z)[0], fr.p(x, 0, z)[2]) for x, z in ring]
    wall_ring(mesh, world, y0, y1)
    fan(mesh, world, y1, up=True)
    fan(mesh, world, y0, up=False)


def hip_xf(mesh, fr, x0, x1, z0, z1, ye, yp):
    P = fr.p
    ins = min((x1 - x0) * 0.22, (z1 - z0) * 0.46)
    ins = max(ins, 0.35)
    zm = (z0 + z1) / 2
    a, b = P(x0, ye, z0), P(x1, ye, z0)
    c, d = P(x1, ye, z1), P(x0, ye, z1)
    r0, r1 = P(x0 + ins, yp, zm), P(x1 - ins, yp, zm)
    mesh.quad(a, r0, r1, b)
    mesh.quad(d, c, r1, r0)
    mesh.tri(a, d, r0)
    mesh.tri(c, b, r1)


def load_buildings():
    out = []
    for f in REAL.glob("r_*.json"):
        data = json.loads(f.read_text())
        for b in data.get("b") or []:
            p = b.get("p") or []
            if len(p) >= 3:
                out.append(b)
    return out


def load_roads():
    out = []
    for f in REAL.glob("r_*.json"):
        data = json.loads(f.read_text())
        for r in data.get("roads") or []:
            if r.get("p") and len(r["p"]) >= 2:
                out.append((r, f.name))
    return out


def closest_road(roads, x, z, min_class=1):
    best = None
    for r, fn in roads:
        if (r.get("c") or 0) < min_class:
            continue
        p = r["p"]
        for a, b in zip(p, p[1:]):
            ax, az = a
            bx, bz = b
            dx, dz = bx - ax, bz - az
            L2 = dx * dx + dz * dz or 1
            t = max(0, min(1, ((x - ax) * dx + (z - az) * dz) / L2))
            qx, qz = ax + dx * t, az + dz * t
            d = (qx - x) ** 2 + (qz - z) ** 2
            if best is None or d < best[0]:
                best = (d, qx, qz, r.get("n") or "", fn)
    return best


def named_buildings(buildings, names, box=None):
    found = []
    for b in buildings:
        if b.get("n") not in names:
            continue
        p = [(a[0], a[1]) for a in b["p"]]
        mx = sum(a[0] for a in p) / len(p)
        mz = sum(a[1] for a in p) / len(p)
        if box and not (box[0] <= mx <= box[1] and box[2] <= mz <= box[3]):
            continue
        found.append((b["n"], p, mx, mz, b.get("h") or 3.4))
    # one footprint per name: the one inside the box
    seen = {}
    for item in found:
        seen[item[0]] = item
    missing = [n for n in names if n not in seen]
    if missing:
        raise SystemExit(f"missing buildings {missing}")
    return [seen[n] for n in names]


def lot_near(buildings, x, z, radius=12):
    best = None
    for b in buildings:
        if b.get("n"):
            continue
        if b.get("k") not in ("house", "small"):
            continue
        p = [(a[0], a[1]) for a in b["p"]]
        mx = sum(a[0] for a in p) / len(p)
        mz = sum(a[1] for a in p) / len(p)
        d = (mx - x) ** 2 + (mz - z) ** 2
        if d <= radius * radius and (best is None or d < best[0]):
            best = (d, p, mx, mz)
    if best is None:
        raise SystemExit(f"no house lot near {x},{z}")
    return best[1], best[2], best[3]


def obb(fr, ring, origin):
    xs, zs = [], []
    for x, z in ring:
        dx, dz = x - origin[0], z - origin[1]
        xs.append(dx * fr.ox[0] + dz * fr.ox[1])
        zs.append(dx * fr.oz[0] + dz * fr.oz[1])
    return min(xs), max(xs), min(zs), max(zs)


def add_windows(mesh, fr, x0, x1, z_face, floors, yawning=2.55):
    span = x1 - x0
    n = 2 if span < 8 else 3
    gap = span / (n + 1)
    for i in range(1, n + 1):
        x = x0 + gap * i
        for fl in range(floors):
            y = 1.15 + fl * 3.15
            if y + 1.3 > floors * 3.2 + 0.4:
                continue
            box_xf(mesh, fr, x - 0.55, x + 0.55, y, y + 1.15, z_face - 0.02, z_face + 0.08)


def build_shop_row(model_id, items, roads, colors, sign_text, sign_on):
    """items: list of (name, ring, mx, mz, h). Front faces the nearest class>=2 road."""
    M = Model(model_id)
    wall_mats = {}
    for name, rgb in colors.items():
        wall_mats[name] = M.material(f"w{abs(hash(name)) % 10000}", rgb, 0.8)
    awn = M.material("awn", AWN, 0.6, double=True)
    glass = M.material("glass", GLASS, 0.15, double=True)
    trim = M.material("trim", WHITE, 0.7)
    roof = M.material("roof", (0.45, 0.46, 0.48), 0.6)
    sign = M.material("sign", WHITE, 0.45, emissive=0.4, textured=True)
    door = M.material("door", (0.25, 0.16, 0.10), 0.7)

    pts = [p for it in items for p in it[1]]
    ox = sum(p[0] for p in pts) / len(pts)
    oz = sum(p[1] for p in pts) / len(pts)
    # road sample at the group centroid, then per building
    frames = []
    for name, ring, mx, mz, h in items:
        hit = closest_road(roads, mx, mz, 2)
        if hit is None:
            raise SystemExit(f"no road for {name}")
        _, qx, qz, rname, _fn = hit
        # Mesh stays local to the manifest origin. The loader adds (x, z).
        fr = Frame((0.0, 0.0), (qx - mx, qz - mz))
        x0, x1, z0, z1 = obb(fr, ring, (mx, mz))
        # pad a little so the mass covers the footprint
        x0 -= 0.15
        x1 += 0.15
        z0 -= 0.15
        z1 += 0.05
        floors = 2 if h >= 6 else 1
        yh = 3.35 if floors == 1 else 6.7
        frames.append((name, fr, x0, x1, z0, z1, floors, yh))

    png = sign_png([sign_text], (28, 48, 92, 255), (255, 255, 255, 255))

    for lod in (0, 1):
        for name, fr, x0, x1, z0, z1, floors, yh in frames:
            wm = wall_mats[name]
            box_xf(M.mesh(lod, wm), fr, x0, x1, 0.05, yh, z0, z1)
            box_xf(M.mesh(lod, roof), fr, x0 - 0.15, x1 + 0.15, yh - 0.05, yh + 0.28, z0 - 0.1, z1 + 0.15)
            if lod == 0:
                # awning on the road face
                box_xf(M.mesh(lod, awn), fr, x0 + 0.3, x1 - 0.3, 2.55, 2.72, z1 - 0.05, z1 + 1.65)
                box_xf(M.mesh(lod, awn), fr, x0 + 0.3, x1 - 0.3, 2.15, 2.58, z1 + 1.45, z1 + 1.7)
                box_xf(M.mesh(lod, door), fr, -0.7, 0.7, 0.05, 2.35, z1 - 0.05, z1 + 0.12)
                add_windows(M.mesh(lod, glass), fr, x0, x1, z1, floors)
                box_xf(M.mesh(lod, trim), fr, x0 - 0.08, x1 + 0.08, yh - 0.08, yh + 0.35, z1 - 0.05, z1 + 0.18)
                if name == sign_on:
                    sw = min(4.6, (x1 - x0) * 0.7)
                    a = fr.p(-sw / 2, yh + 0.95, z1 + 0.22)
                    b = fr.p(sw / 2, yh + 0.95, z1 + 0.22)
                    c = fr.p(sw / 2, yh + 0.22, z1 + 0.22)
                    d = fr.p(-sw / 2, yh + 0.22, z1 + 0.22)
                    sign_quad(M.mesh(lod, sign), a, b, c, d)
            else:
                box_xf(M.mesh(lod, awn), fr, x0 + 0.4, x1 - 0.4, 2.4, 2.7, z1, z1 + 1.2)

    hull = convex_hull(pts)
    # normals: +z face of the first shop must point toward its road
    name, fr, x0, x1, z0, z1, floors, yh = frames[0]
    # sample two points on the +z face and the road direction
    n = fr.oz
    if n[0] * fr.oz[0] + n[1] * fr.oz[1] < 0.9:
        raise SystemExit("frame lost")
    for px, pz in AVOID:
        if pip(px, pz, hull):
            raise SystemExit(f"{model_id} hide covers protected point {px},{pz}")
    info = write_glb(M, HERO / f"{model_id}.glb", images=[png])
    check_glb(HERO / f"{model_id}.glb")
    return info, (ox, oz), hull


def build_house(model_id, ring, roads, wall_rgb, fence_rgb):
    M = Model(model_id)
    wall = M.material("wall", wall_rgb, 0.82)
    trim = M.material("trim", WHITE, 0.7)
    roof = M.material("roof", ROOF, 0.75)
    fence = M.material("fence", fence_rgb, 0.8)
    cap = M.material("cap", WHITE, 0.6)
    glass = M.material("glass", GLASS, 0.2, double=True)
    door = M.material("door", (0.45, 0.22, 0.12), 0.7)
    cactus = M.material("cactus", CACTUS, 0.8)
    porch = M.material("porch", WOOD, 0.7)

    mx = sum(p[0] for p in ring) / len(ring)
    mz = sum(p[1] for p in ring) / len(ring)
    hit = closest_road(roads, mx, mz, 1)
    if hit is None:
        raise SystemExit(f"no road for {model_id}")
    _, qx, qz, _n, _fn = hit
    fr = Frame((0.0, 0.0), (qx - mx, qz - mz))
    x0, x1, z0, z1 = obb(fr, ring, (mx, mz))
    # porch recess: walls stop short of the road face
    z_wall = z1 - 1.25
    for lod in (0, 1):
        box_xf(M.mesh(lod, wall), fr, x0, x1, 0.05, 3.15, z0, z_wall)
        hip_xf(M.mesh(lod, roof), fr, x0 - 0.35, x1 + 0.35, z0 - 0.3, z1 + 0.25, 3.05, 4.55)
        box_xf(M.mesh(lod, trim), fr, x0 - 0.08, x1 + 0.08, 3.0, 3.2, z0, z_wall)
        if lod == 0:
            # porch posts and floor
            box_xf(M.mesh(lod, porch), fr, x0, x1, 0.08, 0.22, z_wall, z1)
            for px in (x0 + 0.2, x1 - 0.2):
                box_xf(M.mesh(lod, trim), fr, px - 0.12, px + 0.12, 0.22, 3.05, z1 - 0.28, z1 - 0.04)
            box_xf(M.mesh(lod, door), fr, -0.55, 0.55, 0.15, 2.25, z_wall - 0.02, z_wall + 0.08)
            add_windows(M.mesh(lod, glass), fr, x0, x1, z_wall, 1)
            # chimney
            box_xf(M.mesh(lod, trim), fr, x0 + 0.6, x0 + 1.3, 3.3, 5.05, z0 + 0.8, z0 + 1.5)
            # fence with a gap on the road side
            fence_ring(M, fr, x0 - 1.1, x1 + 1.1, z0 - 1.1, z1 + 0.3, fence, cap, lod)
            # organ-pipe cactus in the side yard
            box_xf(M.mesh(lod, cactus), fr, x0 - 0.85, x0 - 0.45, 0.1, 2.4, z0 + 0.4, z0 + 0.8)
            box_xf(M.mesh(lod, cactus), fr, x0 - 0.7, x0 - 0.45, 0.8, 3.1, z0 + 0.55, z0 + 0.85)
        else:
            box_xf(M.mesh(lod, fence), fr, x0 - 1.1, x1 + 1.1, 0.1, 0.9, z0 - 1.1, z0 - 0.85)

    hull = convex_hull(ring)
    for px, pz in AVOID:
        if pip(px, pz, hull):
            raise SystemExit(f"{model_id} covers a protected point")
    info = write_glb(M, HERO / f"{model_id}.glb")
    check_glb(HERO / f"{model_id}.glb")
    return info, (mx, mz), hull


def fence_ring(M, fr, x0, x1, z0, z1, fence, cap, lod):
    """Masonry cunucu wall with a white cap and a gate gap on the road side."""
    mesh = M.mesh(lod, fence)
    caps = M.mesh(lod, cap)
    t = 0.28
    gap0 = -1.15
    gap1 = 1.15
    # back and sides are solid; the road face (+z) is split around the gate
    segs = [
        (x0, x1, z0, z0 + t),
        (x1 - t, x1, z0, z1),
        (x0, x0 + t, z0, z1),
        (x0, gap0, z1 - t, z1),
        (gap1, x1, z1 - t, z1),
    ]
    for a, b, c, d in segs:
        box_xf(mesh, fr, a, b, 0.05, 1.05, c, d)
        box_xf(caps, fr, a - 0.04, b + 0.04, 1.02, 1.22, c - 0.04, d + 0.04)
    # white pyramidal caps read as a few posts along the front
    if lod == 0:
        for x in (x0, gap0, gap1, x1):
            box_xf(caps, fr, x - 0.22, x + 0.22, 1.05, 1.45, z1 - 0.22, z1 + 0.08)


def build_refinery(roads):
    """Roadside tanks, pipe rack, fence and gate. Origin is the approach
    west of the tank pad, not the skyline chimney set."""
    M = Model("refinery_road")
    tank = M.material("tank", TANK, 0.45)
    tank_d = M.material("tankd", (0.55, 0.56, 0.54), 0.5)
    pipe = M.material("pipe", PIPE, 0.4)
    steel = M.material("steel", STEEL, 0.35)
    fence = M.material("fence", (0.25, 0.28, 0.26), 0.6, double=True)
    wall = M.material("wall", (0.78, 0.76, 0.70), 0.8)
    black = M.material("blk", BLACK, 0.5)
    gravel = M.material("yard", SAND, 0.95)
    column = M.material("col", (0.62, 0.64, 0.66), 0.4)

    # The class-0 track the earlier land camera sits on is near (7603, 10444).
    # The industrial pad is the large footprint around (7770, 10384).
    origin = (7705.0, 10405.0)
    # face the track, which lies west-northwest of the pad. Mesh is local.
    fr = Frame((0.0, 0.0), (7603 - origin[0], 10444 - origin[1]))
    for lod in (0, 1):
        box_xf(M.mesh(lod, gravel), fr, -28, 34, 0.02, 0.12, -6, 22)
        # gate on the road side
        box_xf(M.mesh(lod, black), fr, -6.2, -5.6, 0.1, 3.4, 20.2, 20.8)
        box_xf(M.mesh(lod, black), fr, 5.6, 6.2, 0.1, 3.4, 20.2, 20.8)
        box_xf(M.mesh(lod, steel), fr, -6.2, 6.2, 3.15, 3.55, 20.1, 20.9)
        box_xf(M.mesh(lod, wall), fr, 7.2, 14.5, 0.1, 3.6, 16.5, 22.5)
        # fence run
        box_xf(M.mesh(lod, fence), fr, -26, -6.4, 0.15, 2.15, 20.3, 20.5)
        box_xf(M.mesh(lod, fence), fr, 6.4, 30, 0.15, 2.15, 20.3, 20.5)
        box_xf(M.mesh(lod, fence), fr, -26.1, -25.7, 0.15, 2.15, -4, 20.3)
        box_xf(M.mesh(lod, fence), fr, 29.6, 30.0, 0.15, 2.15, -4, 20.3)
        # white tanks
        for cx, cz, rad, hy in ((-8, 4, 5.2, 7.5), (6, 2, 4.2, 6.2), (18, 8, 6.0, 9.0)):
            cyl_xf(M.mesh(lod, tank), fr, cx, cz, rad, 0.15, hy, 8 if lod == 0 else 6)
            cyl_xf(M.mesh(lod, tank_d), fr, cx, cz, rad + 0.15, hy - 0.35, hy + 0.15, 8 if lod == 0 else 6)
        # red pipe rack along the fence
        box_xf(M.mesh(lod, pipe), fr, -22, 28, 1.15, 1.55, 12.5, 13.15)
        box_xf(M.mesh(lod, steel), fr, -18, -17.4, 0.15, 1.6, 12.2, 13.4)
        box_xf(M.mesh(lod, steel), fr, 8, 8.6, 0.15, 1.6, 12.2, 13.4)
        box_xf(M.mesh(lod, steel), fr, 22, 22.6, 0.15, 1.6, 12.2, 13.4)
        if lod == 0:
            # one process column, short enough that it is not a second skyline stack
            box_xf(M.mesh(lod, column), fr, 24.5, 26.2, 0.2, 16, 0.2, 1.8)
            box_xf(M.mesh(lod, steel), fr, 23.6, 27.1, 15.6, 16.3, -0.6, 2.6)
            for i in range(6):
                box_xf(M.mesh(lod, fence), fr, -24 + i * 8, -23.7 + i * 8, 0.2, 2.05, 20.35, 20.48)
    # keep the column away from the queued skyline coordinates
    col = fr.p(25.3, 0, 1.0)
    col = (origin[0] + col[0], origin[1] + col[2])
    for cx, cz in CHIMNEYS:
        if math.hypot(col[0] - cx, col[1] - cz) < 40:
            raise SystemExit(f"refinery column collides with skyline site {cx},{cz}")
    info = write_glb(M, HERO / "refinery_road.glb")
    check_glb(HERO / "refinery_road.glb")
    return info, origin


def build_pier(model_id, origin, length, width, wood=True):
    """Deck runs world +Z (south, into the water). Origin stays on the shore
    so the hero snaps to the shore height instead of the lagoon."""
    M = Model(model_id)
    deck_c = WOOD if wood else (0.62, 0.63, 0.64)
    deck = M.material("deck", deck_c, 0.7)
    post = M.material("post", WOOD_DARK if wood else (0.45, 0.46, 0.48), 0.6)
    rail = M.material("rail", (0.55, 0.42, 0.24) if wood else STEEL, 0.55, double=True)
    fr = Frame((0.0, 0.0), (0.0, 1.0))  # local +Z south; manifest origin is the shore
    half = width / 2
    for lod in (0, 1):
        box_xf(M.mesh(lod, deck), fr, -half, half, 0.35, 0.58, 0.0, length)
        step = 8 if lod == 0 else 16
        z = 2
        while z < length - 1:
            for x in (-half + 0.15, half - 0.15):
                box_xf(M.mesh(lod, post), fr, x - 0.12, x + 0.12, -1.35, 0.4, z - 0.12, z + 0.12)
            z += step
        if lod == 0:
            box_xf(M.mesh(lod, rail), fr, -half - 0.08, -half + 0.08, 0.55, 1.15, 0.4, length - 0.3)
            box_xf(M.mesh(lod, rail), fr, half - 0.08, half + 0.08, 0.55, 1.15, 0.4, length - 0.3)
            # a short cross pier
            box_xf(M.mesh(lod, deck), fr, -half, half + 7.5, 0.35, 0.55, length * 0.45, length * 0.45 + width)
            box_xf(M.mesh(lod, rail), fr, half, half + 7.2, 0.55, 1.05, length * 0.45, length * 0.45 + 0.12)
        else:
            box_xf(M.mesh(lod, rail), fr, -half, half, 0.7, 0.9, length - 0.4, length)
    info = write_glb(M, HERO / f"{model_id}.glb")
    check_glb(HERO / f"{model_id}.glb")
    return info


def build_marines():
    """Same origin as the existing gate. Black arch, sentry box, fence.
    The Savaneta road is a few metres south-east of the pin."""
    M = Model("marines_gate")
    black = M.material("blk", BLACK, 0.45)
    sentry = M.material("sentry", CREAM, 0.75)
    roof = M.material("roof", (0.70, 0.28, 0.16), 0.6)
    wall = M.material("wall", (0.16, 0.28, 0.18), 0.7)  # fence green
    glass = M.material("glass", GLASS, 0.2, double=True)
    sign = M.material("sign", (0.85, 0.86, 0.80), 0.4, emissive=0.35, textured=True)
    flag = M.material("flag", (0.12, 0.32, 0.62), 0.5, double=True)
    # road closest point from the survey is (3788, 8119); origin (3790.1, 8114.5)
    origin = (3790.1, 8114.5)
    fr = Frame((0.0, 0.0), (3788 - origin[0], 8119 - origin[1]))
    png = sign_png(["KORPS MARINIERS"], (12, 12, 14, 255), (245, 245, 240, 255), w=640, h=128)
    for lod in (0, 1):
        # arch posts across the driveway (local X), sign toward the road (+Z)
        box_xf(M.mesh(lod, black), fr, -3.55, -2.85, 0.05, 4.35, -0.35, 0.35)
        box_xf(M.mesh(lod, black), fr, 2.85, 3.55, 0.05, 4.35, -0.35, 0.35)
        box_xf(M.mesh(lod, black), fr, -3.6, 3.6, 3.85, 4.45, -0.45, 0.45)
        box_xf(M.mesh(lod, black), fr, -2.4, 2.4, 4.35, 4.85, -0.3, 0.3)
        # fence along the road
        box_xf(M.mesh(lod, wall), fr, -14, -3.7, 0.1, 1.7, -0.15, 0.12)
        box_xf(M.mesh(lod, wall), fr, 3.7, 12, 0.1, 1.7, -0.15, 0.12)
        if lod == 0:
            a = fr.p(-2.5, 3.72, 0.5)
            b = fr.p(2.5, 3.72, 0.5)
            c = fr.p(2.5, 3.05, 0.5)
            d = fr.p(-2.5, 3.05, 0.5)
            sign_quad(M.mesh(lod, sign), a, b, c, d)
            # sentry box on the right of the opening, as seen from the road
            box_xf(M.mesh(lod, sentry), fr, 4.3, 7.4, 0.08, 2.7, -2.6, 0.15)
            box_xf(M.mesh(lod, roof), fr, 4.1, 7.6, 2.65, 2.95, -2.8, 0.4)
            box_xf(M.mesh(lod, glass), fr, 5.3, 6.5, 1.2, 2.15, 0.12, 0.28)
            # flag pole
            box_xf(M.mesh(lod, black), fr, -6.3, -6.05, 0.1, 6.2, -1.5, -1.25)
            box_xf(M.mesh(lod, flag), fr, -6.05, -4.3, 4.6, 5.5, -1.45, -1.2)
            for x in (-12, -8, 8, 11):
                box_xf(M.mesh(lod, black), fr, x - 0.1, x + 0.1, 0.1, 1.75, -0.2, 0.15)
    info = write_glb(M, HERO / "marines_gate.glb", images=[png])
    check_glb(HERO / "marines_gate.glb")
    return info


def build_hooiberg():
    """Trailhead on the flat shelf just north of Caya G.F. Betico Croes.
    Does not move hooiberg_steps or hooiberg_summit."""
    M = Model("hooiberg_base")
    stone = M.material("stone", STONE, 0.9)
    sign = M.material("sign", (0.20, 0.45, 0.22), 0.5, emissive=0.3, textured=True)
    post = M.material("post", WOOD_DARK, 0.7)
    cactus = M.material("cactus", CACTUS, 0.85)
    leaf = M.material("leaf", GREEN, 0.8)
    trunk = M.material("trunk", (0.38, 0.26, 0.14), 0.8)
    roof = M.material("roof", (0.16, 0.40, 0.22), 0.6)
    png = sign_png(["HOOIBERG"], (16, 72, 36, 255), (255, 255, 255, 255))
    # road is south of the shelf. Face the sign south, toward the road.
    origin = (-2712.0, 592.0)
    fr = Frame((0.0, 0.0), (0.0, 1.0))
    for lod in (0, 1):
        # low stone wall along the road, with a gap
        box_xf(M.mesh(lod, stone), fr, -14, -2.2, 0.1, 0.85, 8.5, 9.3)
        box_xf(M.mesh(lod, stone), fr, 2.2, 14, 0.1, 0.85, 8.5, 9.3)
        box_xf(M.mesh(lod, stone), fr, -14, -13.2, 0.1, 0.7, -6, 8.6)
        box_xf(M.mesh(lod, stone), fr, 13.2, 14, 0.1, 0.7, -6, 8.6)
        # shelter
        for x in (-4.2, 4.2):
            for z in (-2.2, 2.4):
                box_xf(M.mesh(lod, post), fr, x - 0.12, x + 0.12, 0.1, 2.7, z - 0.12, z + 0.12)
        box_xf(M.mesh(lod, roof), fr, -5.0, 5.0, 2.55, 2.85, -3.0, 3.3)
        if lod == 0:
            box_xf(M.mesh(lod, post), fr, -1.3, -1.05, 0.1, 2.15, 7.4, 7.7)
            box_xf(M.mesh(lod, post), fr, 1.05, 1.3, 0.1, 2.15, 7.4, 7.7)
            a = fr.p(-1.15, 2.05, 7.85)
            b = fr.p(1.15, 2.05, 7.85)
            c = fr.p(1.15, 1.15, 7.85)
            d = fr.p(-1.15, 1.15, 7.85)
            sign_quad(M.mesh(lod, sign), a, b, c, d)
            # cacti and a watapana-like tree on the lot
            box_xf(M.mesh(lod, cactus), fr, -9.2, -8.7, 0.1, 3.4, 2.0, 2.5)
            box_xf(M.mesh(lod, cactus), fr, -8.9, -8.55, 1.2, 4.3, 2.2, 2.6)
            box_xf(M.mesh(lod, cactus), fr, 8.4, 8.9, 0.1, 2.8, 1.2, 1.7)
            box_xf(M.mesh(lod, trunk), fr, 9.4, 10.0, 0.1, 2.2, -2.5, -1.9)
            box_xf(M.mesh(lod, leaf), fr, 7.6, 12.2, 1.7, 3.3, -4.2, 0.4)
            box_xf(M.mesh(lod, trunk), fr, -11.2, -10.6, 0.1, 1.8, -1.0, -0.4)
            box_xf(M.mesh(lod, leaf), fr, -13.4, -8.6, 1.4, 2.9, -2.6, 1.2)
    info = write_glb(M, HERO / "hooiberg_base.glb", images=[png])
    check_glb(HERO / "hooiberg_base.glb")
    return info, origin


def manifest_entry(id_, name, x, z, info, switch, cat, hide, refs, textures=0, new_place=False):
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


def append_manifest(entries):
    text = MANIFEST.read_text()
    ids = [e["id"] for e in entries]
    for i in ids:
        if f'"id": "{i}"' in text:
            raise SystemExit(f"{i} already in manifest")
    extra = ""
    for e in entries:
        dumped = json.dumps(e, indent=1)
        extra += ",\n" + "\n".join(" " + line for line in dumped.splitlines())
    if not text.rstrip().endswith("]"):
        raise SystemExit("manifest does not end with ]")
    text = text.rstrip()[:-1].rstrip()
    if not text.endswith("}"):
        raise SystemExit("unexpected manifest ending")
    text = text + extra + "\n]\n"
    json.loads(text)
    MANIFEST.write_text(text)


def patch_marines(info):
    text = MANIFEST.read_text()
    idx = text.find('"id": "marines_gate"')
    if idx < 0:
        raise SystemExit("marines_gate missing")
    nxt = text.find('\n  "id":', idx + 10)
    block = text[idx:nxt if nxt > 0 else len(text)]
    block2 = block.replace('"marines_gate_lod0": 119', f'"marines_gate_lod0": {info["lod0"]}', 1)
    block2 = block2.replace('"marines_gate_lod1": 7', f'"marines_gate_lod1": {info["lod1"]}', 1)
    block2 = block2.replace('"textures": 0', '"textures": 1', 1)
    old = "r8.mp4 1:44 KORPS MARINIERS black arch gate with a sentry box; Nominatim node Korps-Mariniers (Savaneta), orientation approx."
    new = (
        "r8.mp4 1:44 KORPS MARINIERS black arch and sentry box; "
        "Commons Marinierskazerne Savaneta (vehicle shed, fence, cream sentry). "
        "Gate rebuilt in place at the same origin. Fishing piers are separate heroes."
    )
    if old not in block2:
        raise SystemExit("marines ref_sources text changed")
    block2 = block2.replace(old, new, 1)
    if block2 == block:
        raise SystemExit("marines patch did nothing")
    text = text[:idx] + block2 + text[nxt if nxt > 0 else len(text):]
    json.loads(text)
    MANIFEST.write_text(text)


def owned(x, z):
    if z < -1800 or x < -7800:
        return False
    if x < -6400 and z < 400:
        return False
    return True


def clear_rural_shoulders():
    """sw 1 -> 0 on the named open Arikok / rural roads only."""
    changed = []
    for f in sorted(REAL.glob("r_*.json")):
        raw = f.read_text()
        sep = (", ", ": ") if raw[:40].count(" ") else (",", ":")
        # confirm style by round-trip equality of the first road-bearing file
        data = json.loads(raw)
        if json.dumps(data, separators=sep) != raw:
            # try the other style before giving up
            other = (",", ":") if sep[0] != "," else (", ", ": ")
            if json.dumps(data, separators=other) == raw:
                sep = other
            else:
                raise SystemExit(f"{f.name} is not a known JSON style")
        n = 0
        for r in data.get("roads") or []:
            name = r.get("n") or ""
            if name in OFF_LIMITS_ROADS or name not in RURAL_SHOULDER:
                continue
            if r.get("sw") != 1 or (r.get("c") or 0) < 3 or r.get("u"):
                continue
            p = r.get("p") or []
            if not p:
                continue
            mx = sum(a[0] for a in p) / len(p)
            mz = sum(a[1] for a in p) / len(p)
            if not owned(mx, mz):
                continue
            r["sw"] = 0
            n += 1
            changed.append((f.name, name, round(mx), round(mz)))
        if n:
            out = json.dumps(data, separators=sep)
            if json.loads(out) != data:
                raise SystemExit(f"round trip failed {f.name}")
            f.write_text(out)
    return changed


def main():
    if '"id": "snmain_bank"' in MANIFEST.read_text():
        raise SystemExit("snmain_bank already in the manifest; refuse a second append")
    buildings = load_buildings()
    roads = load_roads()
    entries = []

    shop_specs = [
        ("snmain_bank",
         ["Post Kantoor San Nicolas", "Setar Teleshop", "Caribbean Mercantile Bank"],
         ["Community Museum"],
         {"Post Kantoor San Nicolas": CREAM, "Setar Teleshop": TURQ, "Caribbean Mercantile Bank": BANK},
         "CMB", "Caribbean Mercantile Bank", 220,
         "Post office, Setar and Caribbean Mercantile Bank on Zeppenfeldstraat. Two-storey white bank. Commons street festival and OSM names. Not a mural lot."),
        ("snmain_deseada",
         ["La Deseada", "FCCA", "Esquire"],
         [],
         {"La Deseada": PINK, "FCCA": CREAM, "Esquire": YELLOW},
         "LA DESEADA", "La Deseada", 200,
         "Pink La Deseada corner on Zeppenfeldstraat, north of Charlie's. Commons King's Night festival photo. Charlie's and the mural hide points are not in this footprint."),
        ("snmain_liberty",
         ["Liberty Store", "Arubabank"],
         [],
         {"Liberty Store": ORANGE, "Arubabank": (0.20, 0.38, 0.70)},
         "LIBERTY", "Liberty Store", 180,
         "Liberty Store and Arubabank on the south side of Zeppenfeldstraat. OSM shop names."),
        ("snmain_mediq",
         ["Mediq"],
         [],
         {"Mediq": WHITE},
         "MEDIQ", "Mediq", 180,
         "Two-storey Mediq on Zeppenfeldstraat. OSM name and height."),
    ]
    for id_, names, extra_hide, colors, label, sign_on, switch, refs in shop_specs:
        items = named_buildings(buildings, names, (6300, 7200, 9200, 9800))
        info, (x, z), hull = build_shop_row(id_, items, roads, colors, label, sign_on)
        if extra_hide:
            for _n, ring, _mx, _mz, _h in named_buildings(buildings, extra_hide, (6300, 7200, 9200, 9800)):
                hull = convex_hull(hull + ring)
            for px, pz in AVOID:
                if pip(px, pz, hull):
                    raise SystemExit(f"{id_} extra hide covers {px},{pz}")
        print(id_, info, "at", round(x, 1), round(z, 1))
        entries.append(manifest_entry(
            id_, "", x, z, info, switch, "shop", hull, refs, textures=1))

    houses = [
        ("cunucu_para_hip_a", (-3381.0, -1902.0), SALMON, FENCE,
         "Salmon cunucu house, red hip roof, terracotta fence with white caps. Paradera lot, not the earlier yellow house."),
        ("cunucu_para_hip_b", (-3091.0, -1887.0), YELLOW, WHITE,
         "Yellow cunucu house with a white fence and porch. Second Paradera lot, different footprint."),
        ("cunucu_scruz_hip_a", (-1714.7, 990.4), CREAM, WHITE,
         "Cream cunucu house west of the Santa Cruz commercial strip. Commons cunucu-house guide: hip roof, porch, cactus."),
        ("cunucu_scruz_hip_b", (-1599.8, 1016.6), MINT, FENCE,
         "Mint cunucu house in Santa Cruz. Same porch-and-fence pattern, different lot and colour."),
    ]
    for id_, (tx, tz), wall, fence, refs in houses:
        ring, mx, mz = lot_near(buildings, tx, tz)
        info, origin, hull = build_house(id_, ring, roads, wall, fence)
        print(id_, info, "at", round(origin[0], 1), round(origin[1], 1))
        entries.append(manifest_entry(id_, "", origin[0], origin[1], info, 200, "house", hull, refs))

    info, origin = build_refinery(roads)
    print("refinery_road", info, "at", origin)
    entries.append(manifest_entry(
        "refinery_road", "San Nicolas refinery", origin[0], origin[1], info, 700, "landmark", None,
        "Roadside tanks, red pipe rack, chain-link fence and gate on the land approach west of the pad. Commons Citgo/Valero refinery views. Not the distant chimney skyline.",
        new_place=True))

    info = build_pier("sav_pier_west", (2964.0, 8336.0), 52, 2.6, wood=True)
    print("sav_pier_west", info)
    entries.append(manifest_entry(
        "sav_pier_west", "Savaneta fishing pier", 2964.0, 8336.0, info, 400, "landmark", None,
        "Wooden fishing pier on the open shore east of Zeerovers and Flying Fishbone. Commons 'Pier na Savaneta' and 'Pier pa yega lama'. Origin is on the shore so the deck does not float.",
        new_place=True))
    info = build_pier("sav_pier_east", (3128.0, 8346.0), 68, 3.2, wood=False)
    print("sav_pier_east", info)
    entries.append(manifest_entry(
        "sav_pier_east", "Savaneta fishing pier", 3128.0, 8346.0, info, 450, "landmark", None,
        "Longer fishing pier further east along the same Savaneta shore, clear of the marine gate and of Zeerovers.",
        new_place=True))

    info, origin = build_hooiberg()
    print("hooiberg_base", info, "at", origin)
    # The OSM house sitting on the shelf is the lot the trailhead replaces.
    hooi_hide = [(-2721.6, 585.2), (-2720.7, 601.8), (-2712.3, 601.4), (-2713.1, 584.8)]
    entries.append(manifest_entry(
        "hooiberg_base", "Hooiberg", origin[0], origin[1], info, 320, "landmark", hooi_hide,
        "Trailhead at the foot of Hooiberg: stone wall, green shelter, HOOIBERG sign, cactus and watapana. Commons 'Hooiberg hill parking lot' and 'Hooiberg hill staircase'. Stairs and summit heroes are not moved.",
        textures=1, new_place=True))

    gate = build_marines()
    print("marines_gate", gate)
    patch_marines(gate)
    append_manifest(entries)

    changed = clear_rural_shoulders()
    print("rural shoulders cleared", len(changed))
    for row in changed:
        print(" ", row)


if __name__ == "__main__":
    main()
