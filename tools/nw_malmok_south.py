#!/usr/bin/env python3
"""Malmok boardwalk, the ocean shoulder of Oduber south of the beach.

The flat run of Avenida Nelson O. Oduber between the north end of the high-rises
and Malmok Beach: concrete walk, a hardwood deck, a red cycle strip, bollards,
low lights, benches, one bus shelter, and verge plants. Geometry is original.

Reference, not copied: TPEF Malmok Boardwalk phases 1 and 2, which start at
Fisherman's Huts and run north (hardwood, klinkers, bollards, pedestrian and
cycle lanes, low lighting, a bus stop). No photographs are stored.

Stays north of the Palm Beach hotels and off the Hadicurari huts.
"""

from __future__ import annotations

import importlib.util
import json
import math
import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, os.path.join(ROOT, "tools"))

os.environ.setdefault("PYTHONDONTWRITEBYTECODE", "1")

_spec = importlib.util.spec_from_file_location(
    "nw_coast_build", os.path.join(ROOT, "tools", "nw-coast", "build_coast.py")
)
coast = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(coast)

from hero_glb import check_glb  # noqa: E402

HERO_ID = "nw_mk_south"
MANIFEST = os.path.join(ROOT, "game", "data", "hero", "manifest.json")
GLB = os.path.join(ROOT, "game", "models", "hero", f"{HERO_ID}.glb")

# Ocean-positive offsets from the asphalt edge, metres.
CURB = (0.45, 0.68)
CYCLE = (0.78, 1.95)
WALK = (2.15, 4.75)
KLINK = (4.15, 4.75)  # outer band of the walk, cobble instead of concrete
WALK_CONC = (2.15, 4.15)
BOLLARD_S = 2.02
BENCH_S = 5.35
LIGHT_S = 4.95
PLANT_S = 6.6

Z0, Z1 = -8120.0, -8580.0
STEP = 4.0
# No landmark sits on this shoulder. The constant keeps the shared clearance check.
LIONS = (0.0, 0.0)

LIFT = 0.13
FACE = 0.09


def load_coast_roads():
    """Smith and Oduber, including the narrow fork the shared loader drops."""
    roads = []
    real = coast.REAL
    for fn in os.listdir(real):
        if not (fn.startswith("r_") and fn.endswith(".json")):
            continue
        rx, rz = (int(p) for p in fn[2:-5].split("_"))
        if rx > 4 or rz > 6 or rx < 1 or rz < 1:
            continue
        data = json.load(open(os.path.join(real, fn)))
        for r in data.get("roads") or []:
            if r.get("n") not in ("L.G. Smith Boulevard", "Avenida Nelson O. Oduber"):
                continue
            if r.get("w", 0) < 4 or len(r.get("p") or []) < 2:
                continue
            roads.append(r)
    return roads


def road_at(roads, z):
    """Westernmost carriageway crossing this z. Returns (x, width, name) or None."""
    best = None
    for r in roads:
        p = r["p"]
        for a, b in zip(p, p[1:]):
            z0, z1 = a[1], b[1]
            if abs(z1 - z0) < 0.2:
                continue
            if (z - z0) * (z - z1) > 0:
                continue
            t = (z - z0) / (z1 - z0)
            if t < -0.02 or t > 1.02:
                continue
            x = a[0] + t * (b[0] - a[0])
            if best is None or x < best[0]:
                best = (x, float(r["w"]), r["n"])
    return best


def ocean_normal(dx, dz):
    L = math.hypot(dx, dz) or 1.0
    dx, dz = dx / L, dz / L
    # Perpendicular that points west (ocean, -x).
    lx, lz = -dz, dx
    if lx > 0:
        lx, lz = -lx, -lz
    n = math.hypot(lx, lz) or 1.0
    return lx / n, lz / n


def extra_at(z):
    return 0.0


def in_golf(rings, x, z):
    if x < -8920 or z > -8700 or z < -10400:
        return False
    for poly in rings:
        xs = [p[0] for p in poly]
        zs = [p[1] for p in poly]
        if x < min(xs) - 2 or x > max(xs) + 2 or z < min(zs) - 2 or z > max(zs) + 2:
            continue
        if coast.inside(poly, x, z):
            return True
    return False


def golf_rings():
    data = json.load(open(os.path.join(coast.REAL, "tds_golf.json")))
    rings = []

    def walk(obj):
        if isinstance(obj, dict):
            o = obj.get("o")
            if isinstance(o, list) and o and isinstance(o[0], (list, tuple)) and len(o[0]) >= 2:
                rings.append(o)
            for v in obj.values():
                walk(v)
        elif isinstance(obj, list):
            for v in obj:
                walk(v)

    walk(data)
    return rings


def sample_centerline(roads):
    raw = []
    z = Z0
    while z >= Z1:
        hit = road_at(roads, z)
        if hit:
            raw.append((z, hit[0], hit[1], hit[2]))
        z -= STEP
    if len(raw) < 8:
        raise SystemExit(f"centerline only {len(raw)} samples")
    pts = []
    for i, (z, x, w, name) in enumerate(raw):
        if i + 1 < len(raw):
            dx = raw[i + 1][1] - x
            dz = raw[i + 1][0] - z
        else:
            dx = x - raw[i - 1][1]
            dz = z - raw[i - 1][0]
        nx, nz = ocean_normal(dx, dz)
        pts.append({"z": z, "x": x, "w": w, "name": name, "n": (nx, nz), "ex": extra_at(z)})
    return pts


def strip_corners(p, q, s0, s1):
    def corner(pt, s):
        nx, nz = pt["n"]
        edge = pt["w"] * 0.5 + pt["ex"]
        x = pt["x"] + nx * (edge + s)
        z = pt["z"] + nz * (edge + s)
        y = coast.mesh_height(x, z) + LIFT
        return (x, y, z)

    return corner(p, s0), corner(p, s1), corner(q, s1), corner(q, s0)


def flat_enough(corners):
    ys = [c[1] for c in corners]
    if max(ys) - min(ys) > 1.25:
        return False
    if min(ys) < 0.45:
        return False
    return True


def add_slab(b, lods, mat, corners):
    a, bp, c, d = corners
    for lod in lods:
        b.quad(lod, mat, [a, bp, c, d], (0, 1, 0))
        b.quad(
            lod,
            mat,
            [bp, (bp[0], bp[1] - FACE, bp[2]), (c[0], c[1] - FACE, c[2]), c],
            (bp[0] - a[0], 0, bp[2] - a[2]),
        )
        b.quad(
            lod,
            mat,
            [d, (d[0], d[1] - FACE, d[2]), (a[0], a[1] - FACE, a[2]), a],
            (a[0] - bp[0], 0, a[2] - bp[2]),
        )


def yaw_of(p, q):
    return math.atan2(q["z"] - p["z"], q["x"] - p["x"])


def offset_point(pt, s):
    nx, nz = pt["n"]
    edge = pt["w"] * 0.5 + pt["ex"]
    x = pt["x"] + nx * (edge + s)
    z = pt["z"] + nz * (edge + s)
    return x, z, coast.mesh_height(x, z)


def rot(x, z, yaw):
    c, s = math.cos(yaw), math.sin(yaw)
    return x * c - z * s, x * s + z * c


def add_bollard(b, x, z, y, lod1):
    b.box(0, "white", x - 0.07, y, z - 0.07, x + 0.07, y + 0.82, z + 0.07)
    b.box(0, "yellow", x - 0.085, y + 0.48, z - 0.085, x + 0.085, y + 0.64, z + 0.085)
    if lod1:
        b.box(1, "white", x - 0.08, y, z - 0.08, x + 0.08, y + 0.8, z + 0.08)


def add_light(b, x, z, y, lod1):
    b.box(0, "iron", x - 0.05, y, z - 0.05, x + 0.05, y + 0.62, z + 0.05)
    b.box(0, "lamp", x - 0.11, y + 0.58, z - 0.11, x + 0.11, y + 0.74, z + 0.11)
    if lod1:
        b.box(1, "lamp", x - 0.1, y + 0.5, z - 0.1, x + 0.1, y + 0.72, z + 0.1)


def add_bench(b, x, z, y, yaw, lod1):
    # Slats run along the path. Seat faces the ocean (local -z of yaw is not
    # guaranteed; the bench is symmetric enough that the slats read either way).
    for i, ly in enumerate((0.42, 0.62, 0.84)):
        b.box_yaw(0, "wood", x, y + ly, z, 0.78, 0.035, 0.16, yaw)
    b.box_yaw(0, "conc", x, y, z, 0.62, 0.40, 0.22, yaw)
    if lod1:
        b.box_yaw(1, "wood", x, y + 0.42, z, 0.78, 0.28, 0.18, yaw)


def add_bin(b, x, z, y):
    b.cyl(0, "iron", x, y, z, 0.22, y + 0.72, 0.20, 6)
    b.cyl(0, "yellow", x, y + 0.62, z, 0.24, y + 0.74, 0.24, 6)


def add_palm(b, x, z, lod1):
    g = coast.mesh_height(x, z)
    top = g + 5.6
    b.cyl(0, "trunk", x, g - 0.15, z, 0.16, top, 0.09, 6)
    if lod1:
        b.cyl(1, "trunk", x, g, z, 0.16, top - 0.3, 0.1, 5)
        b.box(1, "leaf", x - 1.3, top - 0.7, z - 1.3, x + 1.3, top + 0.15, z + 1.3)
    for i in range(6):
        ang = i * math.tau / 6.0 + 0.3
        tip = (x + math.cos(ang) * 2.15, top - 0.85, z + math.sin(ang) * 2.15)
        mat = "leaf" if i % 2 == 0 else "leafd"
        b.beam(0, mat, (x, top + 0.05, z), tip, 0.28, 0.05)


def add_shelter(b, x, z, yaw):
    g = coast.mesh_height(x, z)
    b.box_yaw(0, "conc", x, g, z, 1.85, 0.08, 0.95, yaw)
    b.box_yaw(1, "conc", x, g, z, 1.85, 0.1, 0.95, yaw)
    for lx, lz in ((-1.55, -0.72), (1.55, -0.72), (-1.55, 0.72), (1.55, 0.72)):
        ox, oz = rot(lx, lz, yaw)
        b.box(0, "green", x + ox - 0.05, g, z + oz - 0.05, x + ox + 0.05, g + 2.35, z + oz + 0.05)
    b.box_yaw(0, "yellow", x, g + 2.28, z, 2.05, 0.08, 1.15, yaw)
    b.box_yaw(1, "yellow", x, g + 2.25, z, 2.0, 0.12, 1.1, yaw)
    b.box_yaw(0, "wood", x, g + 0.42, z, 1.15, 0.05, 0.28, yaw)
    # Blank board on the road side of the roof. No lettering.
    ox, oz = rot(0.0, 0.85, yaw)
    b.box_yaw(0, "white", x + ox, g + 1.55, z + oz, 0.55, 0.38, 0.04, yaw)


def add_palapa(b, x, z, yaw):
    g = coast.mesh_height(x, z)
    arm = 1.55
    c, s = math.cos(yaw), math.sin(yaw)
    for sx, sz in ((-1, -1), (1, -1), (-1, 1), (1, 1)):
        px = x + (sx * arm) * c - (sz * arm) * s
        pz = z + (sx * arm) * s + (sz * arm) * c
        b.cyl(0, "wood", px, g - 0.1, pz, 0.08, g + 2.25, 0.06, 5)
    e = 2.15
    roof = [
        (x - e * c + e * s, z - e * s - e * c),
        (x + e * c + e * s, z + e * s - e * c),
        (x + e * c - e * s, z + e * s + e * c),
        (x - e * c - e * s, z - e * s + e * c),
    ]
    b.mat("thatchd", (0.45, 0.30, 0.14), 0.9)
    b.mat("thatche", (0.22, 0.13, 0.06), 0.92)
    b.hip(0, "thatchd", roof, g + 2.2, 0.85)
    b.box_yaw(0, "thatche", x, g + 2.05, z, e * 0.7, 0.06, e * 0.7, yaw)
    b.box_yaw(1, "thatchd", x, g + 2.15, z, e * 0.9, 0.7, e * 0.9, yaw)


def find_parking(samples):
    """One bay where the shoulder stays level with the walk."""
    run = []
    best = []
    for p in samples:
        if not p.get("ok"):
            run = []
            continue
        if abs(p["z"] + 8320) < 14:
            run = []
            continue
        _gx, _gz, gy = offset_point(p, 1.3)
        if abs(gy - (p["walk_y"] - LIFT)) > 0.55:
            run = []
            continue
        run.append(p)
        if len(run) > len(best):
            best = list(run)
    if len(best) < 4:
        print("parking: no flat bay")
        return []
    return best[:5]


def add_parking(b, best):
    if len(best) < 2:
        return None
    for i in range(len(best) - 1):
        corners = strip_corners(best[i], best[i + 1], 0.35, 2.05)
        if flat_enough(corners):
            # A hair above the walk so the bay reads as its own pad.
            raised = tuple((c[0], c[1] + 0.02, c[2]) for c in corners)
            add_slab(b, (0, 1), "asphalt", raised)
    for p in best[::2][:3]:
        x, z, y = offset_point(p, 1.85)
        b.box_yaw(0, "white", x, y + 0.02, z, 0.18, 0.16, 0.55, p["yaw"])
    return best[0]["z"], best[-1]["z"]


def add_spur(b, origin):
    """Short plank path from the promenade toward the Malmok cove, stopping
    short of the existing stair."""
    z = -8928.0
    # Find a start on the walk by scanning x from the road westward.
    x = -8736.0
    prev = None
    placed = 0
    while x > -8802:
        y = coast.mesh_height(x, z)
        nxt = (x - 3.2, z)
        if prev and 0.6 < y < 6.5:
            y2 = coast.mesh_height(nxt[0], z)
            if abs(y2 - y) < 1.1 and y2 > 0.5:
                corners = (
                    (prev[0], y + LIFT, z - 0.7),
                    (prev[0], y + LIFT, z + 0.7),
                    (nxt[0], y2 + LIFT, z + 0.7),
                    (nxt[0], y2 + LIFT, z - 0.7),
                )
                if flat_enough(corners):
                    add_slab(b, (0,), "wood", corners)
                    add_slab(b, (1,), "wood", corners)
                    placed += 1
        prev = (x, z)
        x -= 3.2
    print(f"spur segments {placed}")
    return placed


def build():
    roads = load_coast_roads()
    center = sample_centerline(roads)
    buildings = coast.load_buildings()
    rings = golf_rings()
    b = None
    samples = []
    for i, p in enumerate(center):
        q = center[i + 1] if i + 1 < len(center) else None
        p["yaw"] = yaw_of(p, q or center[i - 1])
        if q is None:
            samples.append(p)
            continue
        walk = strip_corners(p, q, WALK[0], WALK[1])
        wood = -8400.0 <= p["z"] <= -8280.0
        mats_ok = flat_enough(walk) and flat_enough(strip_corners(p, q, CYCLE[0], CYCLE[1]))
        # Stay off houses, the lion gate, and the golf course.
        mx = sum(c[0] for c in walk) / 4
        mz = sum(c[2] for c in walk) / 4
        blocked = in_golf(rings, mx, mz) or math.hypot(mx - LIONS[0], mz - LIONS[1]) < 12
        if not blocked:
            probes = [(mx, mz)] + [(c[0], c[2]) for c in walk]
            for bld in buildings:
                if abs(bld["cx"] - mx) > 45 or abs(bld["cz"] - mz) > 45:
                    continue
                if any(coast.inside(bld["p"], px, pz) for px, pz in probes):
                    blocked = True
                    break
        road_h = coast.mesh_height(p["x"], p["z"])
        walk_h = sum(c[1] for c in walk) / 4
        if abs(road_h - walk_h) > 1.15:
            mats_ok = False
        p["ok"] = bool(mats_ok and not blocked and q)
        p["wood"] = bool(wood and p["ok"])
        p["walk_y"] = walk_h
        samples.append(p)

    xs, zs = [], []
    for p in samples:
        if p.get("ok"):
            x, z, _y = offset_point(p, 3.4)
            xs.append(x)
            zs.append(z)
    if len(xs) < 8:
        raise SystemExit("not enough path")
    ox = sum(xs) / len(xs)
    oz = sum(zs) / len(zs)
    # y=0 is falsy in the loader, so the node would snap to whatever heightAt
    # returns at load time. That sample was 1.8 m low once the region finished.
    # Pin the origin to the same height the vertices are relative to.
    y0 = round(coast.height(ox, oz), 2)
    if abs(y0) < 0.05:
        y0 = 0.05
    print(f"origin {ox:.2f} {oz:.2f} y0 {y0:.2f} samples {len(xs)}")

    b = coast.B(ox, oz, y0)
    b.mat("conc", (0.78, 0.76, 0.71), 0.9)
    b.mat("cycle", (0.62, 0.18, 0.14), 0.84)
    b.mat("klink", (0.66, 0.48, 0.36), 0.88)
    b.mat("wood", (0.50, 0.34, 0.20), 0.82)
    b.mat("plank", (0.58, 0.40, 0.24), 0.78)
    b.mat("white", (0.93, 0.92, 0.88), 0.7)
    b.mat("yellow", (0.90, 0.74, 0.16), 0.55)
    b.mat("iron", (0.18, 0.19, 0.20), 0.6)
    b.mat("lamp", (0.93, 0.86, 0.62), 0.45)
    b.mat("green", (0.12, 0.34, 0.24), 0.7)
    b.mat("trunk", (0.45, 0.34, 0.22), 0.9)
    b.mat("leaf", (0.24, 0.46, 0.22), 0.85)
    b.mat("leafd", (0.16, 0.34, 0.16), 0.85)
    b.mat("cact", (0.36, 0.50, 0.30), 0.8)
    b.mat("asphalt", (0.23, 0.23, 0.24), 0.92)
    bay_pts = find_parking(samples)
    bay_z = {round(p["z"], 1) for p in bay_pts}

    accepted = 0
    for i in range(len(samples) - 1):
        p, q = samples[i], samples[i + 1]
        if not p.get("ok"):
            continue
        # Break the ribbon if the next sample jumped across the junction gap.
        if abs(q["z"] - p["z"]) > STEP * 1.6:
            continue
        if not q.get("ok") and i + 1 < len(samples) - 1:
            # still draw up to a failed sample only when that sample itself is ok
            pass
        if not q.get("ok"):
            continue
        wood = p["wood"] and q.get("wood")
        cyc = strip_corners(p, q, CYCLE[0], CYCLE[1])
        if wood:
            deck = strip_corners(p, q, WALK[0], WALK[1])
            if not flat_enough(deck):
                continue
            add_slab(b, (0, 1), "wood", deck)
            # cross boards
            x, z, y = offset_point(p, (WALK[0] + WALK[1]) * 0.5)
            b.box_yaw(0, "plank", x, y + 0.02, z, 0.10, 0.03, (WALK[1] - WALK[0]) * 0.46, p["yaw"])
        else:
            conc = strip_corners(p, q, WALK_CONC[0], WALK_CONC[1])
            klink = strip_corners(p, q, KLINK[0], KLINK[1])
            if not (flat_enough(conc) and flat_enough(klink)):
                continue
            add_slab(b, (0, 1), "conc", conc)
            add_slab(b, (0,), "klink", klink)
            add_slab(b, (1,), "conc", klink)
        # The side bay replaces the cycle strip along that one stretch.
        in_bay = round(p["z"], 1) in bay_z or round(q["z"], 1) in bay_z
        if flat_enough(cyc) and not in_bay:
            add_slab(b, (0, 1), "cycle", cyc)
        curb = strip_corners(p, q, CURB[0], CURB[1])
        if flat_enough(curb) and not in_bay:
            # curb sits a little higher than the cycle strip
            curb = tuple((c[0], c[1] + 0.06, c[2]) for c in curb)
            add_slab(b, (0,), "conc", curb)
        accepted += 1
    print(f"ribbon segments {accepted}")

    bollards = lights = benches = 0
    for i, p in enumerate(samples):
        if not p.get("ok"):
            continue
        if i % 2 == 0:
            x, z, y = offset_point(p, BOLLARD_S)
            add_bollard(b, x, z, y, lod1=(i % 6 == 0))
            bollards += 1
        if i % 5 == 2:
            x, z, y = offset_point(p, LIGHT_S)
            add_light(b, x, z, y, lod1=True)
            lights += 1
        if i % 8 == 4:
            x, z, y = offset_point(p, BENCH_S)
            if y > 0.8:
                add_bench(b, x, z, y, p["yaw"], lod1=True)
                benches += 1
        if i % 14 == 6:
            x, z, y = offset_point(p, BENCH_S + 0.7)
            if y > 0.8:
                add_bin(b, x, z, y)

    # plants on the sea side where the terrace is still there
    palms = divi = cacti = 0
    for i, p in enumerate(samples):
        if not p.get("ok"):
            continue
        x, z, y = offset_point(p, PLANT_S)
        if y < 1.0 or abs(y - (p["walk_y"] - LIFT)) > 1.4:
            continue
        if in_golf(rings, x, z):
            continue
        if i % 10 == 3 and palms < 5:
            add_palm(b, x, z, lod1=True)
            palms += 1
        elif i % 10 == 7 and divi < 3:
            coast.add_divi(b, x, z, lean=1.6, h=3.1, yaw=math.pi)
            divi += 1
        elif i % 10 == 0 and cacti < 3:
            coast.add_cactus(b, x, z, h=1.5, arms=2)
            cacti += 1

    # Bus shelter on the flat terrace south of Boca, off the cycle lane.
    shelter_pt = next((p for p in samples if p.get("ok") and abs(p["z"] + 8320) < 8), None)
    if shelter_pt:
        sx, sz, sy = offset_point(shelter_pt, 6.4)
        if math.hypot(sx - LIONS[0], sz - LIONS[1]) > 14:
            add_shelter(b, sx, sz, shelter_pt["yaw"])
            print(f"shelter {sx:.1f},{sz:.1f} y={sy:.2f}")

    pala = next((p for p in samples if p.get("wood")), None)
    if pala:
        px, pz, py = offset_point(pala, 7.2)
        if py > 1.2 and abs(py - (pala["walk_y"] - LIFT)) < 1.2:
            add_palapa(b, px, pz, pala["yaw"])
            print(f"palapa {px:.1f},{pz:.1f}")

    bay = add_parking(b, bay_pts)
    print(f"parking {bay}")

    far = 0.0
    for (_lod, _mat), prim in b.prim.items():
        xs_ = prim["p"][0::3]
        zs_ = prim["p"][2::3]
        for x, z in zip(xs_, zs_):
            far = max(far, math.hypot(x, z))
    if far > 620:
        raise SystemExit(f"content {far:.0f} m from origin")
    for (lod, mat), prim in b.prim.items():
        if len(prim["i"]) > 65535:
            raise SystemExit(f"lod{lod} {mat} {len(prim['i'])} indices")

    os.makedirs(os.path.dirname(GLB), exist_ok=True)
    # One shared untextured mesh per LOD. Separate materials were separate GPU geometries.
    tris = b.save_packed(GLB, HERO_ID)
    check_glb(GLB)
    print(f"tris {tris[0]}/{tris[1]} far {far:.1f} bollards {bollards} lights {lights} benches {benches} palms {palms}")
    return ox, oz, y0, tris


def entry(ox, oz, y0, tris):
    return {
        "id": HERO_ID,
        "k": HERO_ID,
        "status": "v1-nw-coast",
        "x": round(ox, 2),
        "z": round(oz, 2),
        "y": y0,
        "rotation": 0,
        "glb": f"models/hero/{HERO_ID}.glb",
        "lod": {"hi": f"{HERO_ID}_lod0", "lo": f"{HERO_ID}_lod1", "switch_m": 340},
        "tris": {f"{HERO_ID}_lod0": tris[0], f"{HERO_ID}_lod1": tris[1]},
        "textures": 0,
        "hide_footprint": None,
        "hide": [],
        "sign": False,
        "kind": "replace",
        "new_place": False,
        "name": "",
        "geo_source": "OSM Avenida Nelson O. Oduber centreline, Aruba DEM",
        "ref_sources": (
            "Malmok boardwalk on the ocean shoulder of Avenida Nelson O. Oduber, south of Malmok "
            "Beach and north of the high-rises. TPEF phases 1 and 2 start this promenade at "
            "Fisherman's Huts: concrete and a hardwood deck, a klinker edge, reflective bollards, "
            "a red cycle lane, low lights, and a bus shelter. Hadicurari and the Palm Beach hotels "
            "are not in this slice. Original geometry, no photos."
        ),
        "frame": "glb origin = path centroid (world x,z); glTF +X = world x, +Z = world z, Y up; generated by tools/nw_malmok_south.py",
        "cat": "landmark",
    }


def splice(obj):
    text = open(MANIFEST).read()
    data = json.loads(text)
    ids = [o.get("id") for o in data]
    if HERO_ID in ids:
        raise SystemExit(f"{HERO_ID} already in the manifest; restore it before regenerating")
    formatted = json.dumps(obj, indent=1)
    formatted = "\n".join(" " + line if line else line for line in formatted.split("\n"))
    body = text.rstrip()
    if not body.endswith("]"):
        raise SystemExit("manifest does not end with ]")
    body = body[:-1].rstrip()
    if not body.endswith("}"):
        raise SystemExit("manifest tail is not an object")
    new = body + ",\n" + formatted + "\n]\n"
    check = json.loads(new)
    new_ids = [o.get("id") for o in check]
    if new_ids[:-1] != ids or new_ids[-1] != HERO_ID:
        raise SystemExit("splice changed existing ids")
    # The previous objects must be byte-stable apart from the inserted comma.
    if not text.rstrip().endswith("]") or HERO_ID not in new:
        raise SystemExit("splice failed")
    open(MANIFEST, "w").write(new)
    print(f"spliced {HERO_ID}")


def main():
    ox, oz, y0, tris = build()
    splice(entry(ox, oz, y0, tris))


if __name__ == "__main__":
    main()
