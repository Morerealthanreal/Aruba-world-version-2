#!/usr/bin/env python3
"""Townhouses on the north side of Costa Bravo, between Diamante and Sero Callejón.

Satellite of this block shows a repeating row of red-tile townhouses with
palms and parking in front. Gold Coast listings (Diamante 75 and the
neighbouring units) put the bedrooms upstairs, each with a balcony. OSM
stores most of these footprints as h=3.4, which is the default, not the
two-storey mass. Geometry is original. No photographs are stored.

The Malmokweg villa rows, the coast spur, Figaroa, Tierra del Sol, and the
next Costa Bravo block east of Sero Callejón stay out of this slice.
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

HERO_ID = "nw_cb_west"
MANIFEST = os.path.join(ROOT, "game", "data", "hero", "manifest.json")
GLB = os.path.join(ROOT, "game", "models", "hero", f"{HERO_ID}.glb")

# Diamante meets Costa Bravo near x -7997. Sero Callejón meets it near x -7911.
# This is the block between those two crossings, not the rows further east.
X_WEST, X_EAST = -8005.0, -7915.0
ROAD_BAND = 20.0
SIDE_STREETS = {
    "Malmokweg",
    "L.G. Smith Boulevard",
    "Caya Pitaya",
    "Caya Pelican",
    "Diamante",
    "Caya Frans Figoroa",
    "Caya Francisco D. Figaroa",
    "Costa di Oro",
    "Costa Bunita",
    "Caya di Solo",
    "Costa Luna",
    "Sero Alue",
    "Sero Callejón",
    "Caya Turtuga",
}


def load_named(names):
    roads = []
    real = coast.REAL
    for fn in os.listdir(real):
        if not (fn.startswith("r_") and fn.endswith(".json")):
            continue
        data = json.load(open(os.path.join(real, fn)))
        if not isinstance(data, dict):
            continue
        for r in data.get("roads") or []:
            if isinstance(r, dict) and r.get("n") in names and len(r.get("p") or []) >= 2:
                roads.append(r["p"])
    return roads


def closest(roads, x, z):
    best = None
    for p in roads:
        for a, b in zip(p, p[1:]):
            ax, az = a
            bx, bz = b
            vx, vz = bx - ax, bz - az
            l2 = vx * vx + vz * vz or 1.0
            t = max(0.0, min(1.0, ((x - ax) * vx + (z - az) * vz) / l2))
            mx, mz = ax + t * vx, az + t * vz
            d = math.hypot(x - mx, z - mz)
            if best is None or d < best[0]:
                best = (d, mx, mz, vx, vz)
    return best


def shrink(poly, dist):
    cx = sum(p[0] for p in poly) / len(poly)
    cz = sum(p[1] for p in poly) / len(poly)
    out = []
    for x, z in poly:
        dx, dz = cx - x, cz - z
        length = math.hypot(dx, dz) or 1.0
        step = min(dist, length * 0.25)
        out.append((x + dx / length * step, z + dz / length * step))
    return out


def edge_len(a, c):
    return math.hypot(c[0] - a[0], c[1] - a[1])


def street_edge(poly, roads):
    best = None
    for i in range(len(poly)):
        a, c = poly[i], poly[(i + 1) % len(poly)]
        mx, mz = (a[0] + c[0]) * 0.5, (a[1] + c[1]) * 0.5
        d = closest(roads, mx, mz)
        if d and (best is None or d[0] < best[0]):
            best = (d[0], i, a, c, mx, mz)
    return best


def outward_of(a, c, roads):
    dx, dz = c[0] - a[0], c[1] - a[1]
    length = math.hypot(dx, dz) or 1.0
    ox, oz = dz / length, -dx / length
    mx, mz = (a[0] + c[0]) * 0.5, (a[1] + c[1]) * 0.5
    if closest(roads, mx + ox, mz + oz)[0] > closest(roads, mx - ox, mz - oz)[0]:
        ox, oz = -ox, -oz
    return ox, oz, dx / length, dz / length


def gable(b, lod, mat, wall, poly, street_i, y_eave, rise):
    """Ridge from the street face to the back, so each narrow unit is its own bay."""
    n = len(poly)
    a, c = poly[street_i], poly[(street_i + 1) % n]
    smx, smz = (a[0] + c[0]) * 0.5, (a[1] + c[1]) * 0.5
    far = None
    for i in range(n):
        if i == street_i:
            continue
        p, q = poly[i], poly[(i + 1) % n]
        mx, mz = (p[0] + q[0]) * 0.5, (p[1] + q[1]) * 0.5
        dist = math.hypot(mx - smx, mz - smz)
        if far is None or dist > far[0]:
            far = (dist, p, q, mx, mz)
    rf = (smx, y_eave + rise, smz)
    rb = (far[3], y_eave + rise, far[4])
    rx, rz = rb[0] - rf[0], rb[2] - rf[2]

    def side(p):
        return rx * (p[1] - rf[2]) - rz * (p[0] - rf[0])

    left, right = [], []
    for p in poly:
        (left if side(p) >= 0 else right).append(p)

    def slope(pts):
        if len(pts) < 2:
            return
        pts = sorted(pts, key=lambda p: (p[0] - rf[0]) * rx + (p[1] - rf[2]) * rz)
        e0 = (pts[0][0], y_eave, pts[0][1])
        e1 = (pts[-1][0], y_eave, pts[-1][1])
        b.quad(lod, mat, [e0, e1, (rb[0], rb[1], rb[2]), rf], (0, 1, 0))

    slope(left)
    slope(right)
    for edge in ((a, c), (far[1], far[2])):
        p0, p1 = edge
        dx, dz = p1[0] - p0[0], p1[1] - p0[1]
        length = math.hypot(dx, dz) or 1.0
        ox, oz = dz / length, -dx / length
        peak = ((p0[0] + p1[0]) * 0.5, y_eave + rise, (p0[1] + p1[1]) * 0.5)
        b.tri(lod, wall, (p0[0], y_eave, p0[1]), (p1[0], y_eave, p1[1]), peak, (ox, 0, oz))


def add_balcony(b, a, c, g, ox, oz, ux, uz):
    length = edge_len(a, c)
    if length < 3.2:
        return
    half = min(1.35, length * 0.28)
    mx, mz = (a[0] + c[0]) * 0.5, (a[1] + c[1]) * 0.5
    depth = 1.15
    y = g + 2.72
    c0 = (mx - ux * half, y, mz - uz * half)
    c1 = (mx + ux * half, y, mz + uz * half)
    o0 = (c0[0] + ox * depth, y, c0[2] + oz * depth)
    o1 = (c1[0] + ox * depth, y, c1[2] + oz * depth)
    b.quad(0, "white", [c0, c1, o1, o0], (0, 1, 0))
    b.quad(0, "white", [o0, o1, c1, c0], (0, -1, 0))
    rail_y0, rail_y1 = y + 0.04, y + 0.92
    b.beam(0, "iron", (o0[0], rail_y1, o0[2]), (o1[0], rail_y1, o1[2]), 0.02, 0.018)
    steps = 5
    for i in range(steps + 1):
        t = i / steps
        x = o0[0] + (o1[0] - o0[0]) * t
        z = o0[2] + (o1[2] - o0[2]) * t
        b.box(0, "iron", x - 0.02, rail_y0, z - 0.02, x + 0.02, rail_y1, z + 0.02)
    # Side rails back to the wall.
    for end in (o0, o1):
        wall = (end[0] - ox * depth, rail_y1, end[2] - oz * depth)
        b.beam(0, "iron", (end[0], rail_y1, end[2]), wall, 0.018, 0.016)
    yaw = math.atan2(uz, ux)
    coast.add_opening(b, mx + ox * 0.12, mz + oz * 0.12, g + 2.85, yaw)


def add_palm(b, x, z):
    g = coast.mesh_height(x, z)
    cx, cz, y = x, z, g - 0.05
    for i in range(4):
        ny = y + 1.15
        b.cyl(0, "trunk", cx, y, cz, 0.16 - i * 0.015, ny, 0.13 - i * 0.012, 6)
        cx, cz, y = cx + 0.04, cz + 0.02, ny
    b.cyl(1, "trunk", x, g, z, 0.12, g + 4.2, 0.07, 5)
    for k in range(7):
        ang = k * math.tau / 7.0
        mid = (cx + math.cos(ang) * 0.9, y + 0.25, cz + math.sin(ang) * 0.9)
        tip = (cx + math.cos(ang) * 2.1, y - 0.4, cz + math.sin(ang) * 2.1)
        b.beam(0, "palm", (cx, y + 0.1, cz), mid, 0.09, 0.03)
        b.beam(0, "palm", mid, tip, 0.05, 0.018)
        if k % 2 == 0:
            b.beam(1, "palm", (cx, y, cz), tip, 0.07, 0.03)


def add_pad(b, mx, mz, ox, oz, ux, uz, g):
    depth, half = 4.2, 1.35
    y0, y1 = g - 0.02, g + 0.06
    c0 = (mx - ux * half + ox * 1.3, mz - uz * half + oz * 1.3)
    c1 = (mx + ux * half + ox * 1.3, mz + uz * half + oz * 1.3)
    o0 = (c0[0] + ox * depth, c0[1] + oz * depth)
    o1 = (c1[0] + ox * depth, c1[1] + oz * depth)
    poly = [c0, c1, o1, o0]
    b.extrude(0, "pad", poly, y0, y1, top=True)


def build():
    bravo = load_named({"Costa Bravo"})
    side = load_named(SIDE_STREETS)
    if not bravo:
        raise SystemExit("Costa Bravo missing")
    chosen = []
    for bld in coast.load_buildings():
        if (bld.get("h") or 0) >= 8:
            continue
        if bld["k"] not in ("house", "yes", "residential", "detached"):
            continue
        cx, cz = bld["cx"], bld["cz"]
        if not (X_WEST <= cx <= X_EAST):
            continue
        hit = closest(bravo, cx, cz)
        if not hit or hit[0] > ROAD_BAND:
            continue
        # North of the carriageway. More negative z is north.
        if cz >= hit[2] - 1.0:
            continue
        other = closest(side, cx, cz)
        if other and other[0] + 1.0 < hit[0]:
            continue
        pt = coast.interior_point(bld["p"])
        if not pt:
            continue
        chosen.append((bld, pt, hit))
    chosen.sort(key=lambda t: t[0]["cx"])
    print(f"houses {len(chosen)}")
    if not (8 <= len(chosen) <= 12):
        raise SystemExit("expected the Diamante–Sero Callejón block")

    ox = sum(t[1][0] for t in chosen) / len(chosen)
    oz = sum(t[1][1] for t in chosen) / len(chosen)
    y0 = round(coast.mesh_height(ox, oz), 2)
    if y0 == 0:
        y0 = 0.02
    b = coast.B(ox, oz, y0)
    b.mat("coral", coast.CORAL, 0.9)
    b.mat("tile", (0.78, 0.32, 0.14), 0.76)
    b.mat("frame", coast.FRAME_C, 0.62)
    b.mat("glass", coast.GLASS, 0.12)
    b.mat("shut", coast.SHUTTER, 0.7)
    b.mat("white", (0.94, 0.93, 0.90), 0.7)
    b.mat("wood", (0.42, 0.30, 0.20), 0.72)
    b.mat("iron", (0.22, 0.23, 0.24), 0.5)
    b.mat("trunk", coast.TRUNK, 0.9)
    b.mat("palm", (0.20, 0.40, 0.16), 0.8)
    b.mat("pad", (0.72, 0.70, 0.66), 0.9)
    stucco = ((0.94, 0.91, 0.86), (0.90, 0.84, 0.74), (0.86, 0.80, 0.70))
    for i, rgb in enumerate(stucco):
        b.mat(f"w{i}", rgb, 0.82)

    polys = []
    for bld, _pt, _hit in chosen:
        poly = list(bld["p"])
        area = 0.0
        for i in range(len(poly)):
            a, c = poly[i], poly[(i + 1) % len(poly)]
            area += a[0] * c[1] - c[0] * a[1]
        if area < 0:
            poly = list(reversed(poly))
        polys.append(shrink(poly, 0.08))

    hides = []
    plants = lamps = 0
    for idx, ((bld, pt, _hit), poly) in enumerate(zip(chosen, polys)):
        gnd = coast.mesh_height(pt[0], pt[1])
        wide = edge_len(*street_edge(poly, bravo)[2:4]) >= 8.0 if street_edge(poly, bravo) else False
        wall_h = 5.2
        paint = f"w{idx % 3}"
        b.extrude(0, "coral", poly, gnd - 0.3, gnd + 0.4, top=False)
        b.extrude(0, paint, poly, gnd + 0.4, gnd + wall_h, top=True)
        b.extrude(1, paint, poly, gnd - 0.1, gnd + wall_h, top=True)
        edge = street_edge(poly, bravo)
        if edge:
            _dist, si, a, c, mx, mz = edge
            out_x, out_z, ux, uz = outward_of(a, c, bravo)
            if wide:
                hip_like(b, 0, "tile", poly, gnd + wall_h, 1.7)
                hip_like(b, 1, "tile", poly, gnd + wall_h, 1.3)
            else:
                gable(b, 0, "tile", paint, poly, si, gnd + wall_h, 1.45)
                gable(b, 1, "tile", paint, poly, si, gnd + wall_h, 1.1)
            add_balcony(b, a, c, gnd, out_x, out_z, ux, uz)
            yaw = math.atan2(uz, ux)
            coast.add_opening(b, mx + out_x * 0.1, mz + out_z * 0.1, gnd + 0.15, yaw)
            add_openings(b, poly, polys, idx, gnd, street_i=si)
            far_pad = closest(bravo, mx + out_x * 5.5, mz + out_z * 5.5)
            if far_pad and far_pad[0] > 3.4:
                add_pad(b, mx, mz, out_x, out_z, ux, uz, gnd)
            px, pz = mx + out_x * 6.2, mz + out_z * 6.2
            if closest(bravo, px, pz)[0] > 3.6 and not on_any(polys, px, pz) and idx % 2 == 0:
                add_palm(b, px, pz)
                plants += 1
        hides.append([round(pt[0], 1), round(pt[1], 1)])

    far = 0.0
    for (_lod, _mat), prim in b.prim.items():
        xs_ = prim["p"][0::3]
        zs_ = prim["p"][2::3]
        for x, z in zip(xs_, zs_):
            far = max(far, math.hypot(x, z))
    if far > 620:
        raise SystemExit(f"content {far:.0f} m from origin")
    tris = b.save_packed(GLB, HERO_ID)
    check_glb(GLB)
    print(
        f"origin {ox:.2f},{oz:.2f} y {y0} tris {tris[0]}/{tris[1]} "
        f"far {far:.1f} plants {plants} lamps {lamps}"
    )
    print("hides", hides)
    return ox, oz, y0, tris, hides


def hip_like(b, lod, mat, poly, y_eave, rise):
    n = len(poly)
    cx = sum(p[0] for p in poly) / n
    cz = sum(p[1] for p in poly) / n
    inner = [(cx + (p[0] - cx) * 0.22, cz + (p[1] - cz) * 0.22) for p in poly]
    yt = y_eave + rise
    for i in range(n):
        j = (i + 1) % n
        b.quad(
            lod,
            mat,
            [
                (poly[i][0], y_eave, poly[i][1]),
                (poly[j][0], y_eave, poly[j][1]),
                (inner[j][0], yt, inner[j][1]),
                (inner[i][0], yt, inner[i][1]),
            ],
            (0, 1, 0),
        )
    for i in range(n):
        j = (i + 1) % n
        b.tri(lod, mat, (cx, yt, cz), (inner[i][0], yt, inner[i][1]), (inner[j][0], yt, inner[j][1]), (0, 1, 0))


def add_openings(b, poly, polys, idx, gnd, street_i):
    """Windows on the back face. Party walls and the balcony face stay closed."""
    others = [p for i, p in enumerate(polys) if i != idx]
    n = len(poly)
    for i in range(n):
        if i == street_i:
            continue
        a, c = poly[i], poly[(i + 1) % n]
        length = edge_len(a, c)
        if length < 3.2:
            continue
        dx, dz = c[0] - a[0], c[1] - a[1]
        oxn, ozn = dz / length, -dx / length
        mx, mz = (a[0] + c[0]) * 0.5, (a[1] + c[1]) * 0.5
        if party(mx + oxn * 0.45, mz + ozn * 0.45, others) or party(mx - oxn * 0.45, mz - ozn * 0.45, others):
            continue
        yaw = math.atan2(dz, dx)
        count = 2 if length >= 8 else 1
        for level in (1.15, 3.45):
            for k in range(count):
                t = (k + 1) / (count + 1)
                coast.add_opening(b, a[0] + dx * t, a[1] + dz * t, gnd + level, yaw)


def party(x, z, others):
    for poly in others:
        if coast.inside(poly, x, z):
            return True
    return False


def add_front_wall(b, poly, bravo, gnd):
    n = len(poly)
    best = None
    for i in range(n):
        a, c = poly[i], poly[(i + 1) % n]
        mx, mz = (a[0] + c[0]) * 0.5, (a[1] + c[1]) * 0.5
        d = closest(bravo, mx, mz)
        if d and (best is None or d[0] < best[0]):
            best = (d[0], a, c, mx, mz)
    if not best or best[0] > 22 or edge_len(best[1], best[2]) < 3.2:
        return
    a, c = best[1], best[2]
    dx, dz = c[0] - a[0], c[1] - a[1]
    L = math.hypot(dx, dz) or 1.0
    oxn, ozn = dz / L, -dx / L
    if closest(bravo, best[3] + oxn, best[4] + ozn)[0] > closest(bravo, best[3] - oxn, best[4] - ozn)[0]:
        oxn, ozn = -oxn, -ozn
    inset = 0.55
    for seg in ((0.08, 0.38), (0.62, 0.92)):
        a1 = (a[0] + dx * seg[0] + oxn * inset, a[1] + dz * seg[0] + ozn * inset)
        a2 = (a[0] + dx * seg[1] + oxn * inset, a[1] + dz * seg[1] + ozn * inset)
        g1 = coast.mesh_height(a1[0], a1[1])
        b.beam(0, "coral", (a1[0], g1, a1[1]), (a2[0], g1 + 0.7, a2[1]), 0.12, 0.14)
    gx = a[0] + dx * 0.5 + oxn * inset
    gz = a[1] + dz * 0.5 + ozn * inset
    gy = coast.mesh_height(gx, gz)
    for side in (-0.42, 0.42):
        px = gx + (dx / L) * side
        pz = gz + (dz / L) * side
        b.box(0, "white", px - 0.07, gy, pz - 0.07, px + 0.07, gy + 0.95, pz + 0.07)


def on_any(polys, x, z):
    for poly in polys:
        if coast.inside(poly, x, z):
            return True
    return False


def entry(ox, oz, y0, tris, hides):
    return {
        "id": HERO_ID,
        "k": HERO_ID,
        "status": "v1-nw-coast",
        "x": round(ox, 2),
        "z": round(oz, 2),
        "y": y0,
        "rotation": 0,
        "glb": f"models/hero/{HERO_ID}.glb",
        "lod": {"hi": f"{HERO_ID}_lod0", "lo": f"{HERO_ID}_lod1", "switch_m": 220},
        "tris": {f"{HERO_ID}_lod0": tris[0], f"{HERO_ID}_lod1": tris[1]},
        "textures": 0,
        "hide_footprint": None,
        "hide": hides,
        "sign": False,
        "kind": "replace",
        "new_place": False,
        "name": "",
        "geo_source": "OSM Costa Bravo centreline and footprints, Aruba DEM",
        "ref_sources": (
            "North side of Costa Bravo between Diamante and Sero Callejón. "
            "Satellite of this block (https://www.google.com/maps/@12.599858,-70.043234,131m/data=!3m1!1e3) "
            "shows repeating red-tile townhouse bays, palms, and parking. "
            "Gold Coast Diamante 75 (https://remaxaruba.com/property/details/gold-coast-diamante-75) "
            "is a two-storey corner unit on this row: upstairs bedrooms with balconies. "
            "Original geometry, no photos in the mesh."
        ),
        "frame": "glb origin = footprint centroid (world x,z); glTF +X = world x, +Z = world z, Y up; generated by tools/nw_costa_bravo_west.py",
        "cat": "landmark",
    }


def rewrite_entry(obj):
    text = open(MANIFEST).read()
    key = f'"id": "{HERO_ID}"'
    at = text.find(key)
    if at < 0:
        raise SystemExit(f"{HERO_ID} missing from manifest")
    start = text.rfind("{", 0, at)
    depth = 0
    end = None
    for j in range(start, len(text)):
        if text[j] == "{":
            depth += 1
        elif text[j] == "}":
            depth -= 1
            if depth == 0:
                end = j + 1
                break
    if end is None:
        raise SystemExit("unterminated hero object")
    lines = json.dumps(obj, indent=1).split("\n")
    formatted = lines[0] + "\n" + "\n".join((" " + ln) if ln else ln for ln in lines[1:])
    new = text[:start] + formatted + text[end:]
    check = json.loads(new)
    ids = [o.get("id") for o in check]
    if ids.count(HERO_ID) != 1 or [o.get("id") for o in json.loads(text)] != ids:
        raise SystemExit("rewrite changed the hero list")
    open(MANIFEST, "w").write(new)
    print(f"updated {HERO_ID}")


def main():
    ox, oz, y0, tris, hides = build()
    rewrite_entry(entry(ox, oz, y0, tris, hides))


if __name__ == "__main__":
    main()
