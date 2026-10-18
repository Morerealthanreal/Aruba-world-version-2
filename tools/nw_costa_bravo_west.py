#!/usr/bin/env python3
"""Townhouses on the north side of Costa Bravo, between Diamante and Sero Callejón.

OSM footprints here are narrow hipped units, about five metres wide, with one
wider two-storey unit at the east end. Listing pages for the Gold Coast row
describe the same thing: low townhouses, a larger end unit, a small yard, and
a front wall. Geometry is original. No photographs are stored.

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
    b.mat("coral", coast.CORAL, 0.92)
    b.mat("terr", coast.TERR, 0.84)
    b.mat("frame", coast.FRAME_C, 0.62)
    b.mat("glass", coast.GLASS, 0.12)
    b.mat("shut", coast.SHUTTER, 0.7)
    b.mat("white", (0.93, 0.92, 0.88), 0.7)
    b.mat("iron", (0.22, 0.23, 0.24), 0.55)
    b.mat("lamp", (0.93, 0.86, 0.62), 0.45)
    b.mat("trunk", coast.TRUNK, 0.9)
    b.mat("cact", coast.CACT, 0.8)
    for i, rgb in enumerate(coast.WALLS):
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
        polys.append(shrink(poly, 0.06))

    hides = []
    for idx, ((bld, pt, hit), poly) in enumerate(zip(chosen, polys)):
        gnd = coast.mesh_height(pt[0], pt[1])
        raw_h = float(bld.get("h") or 3.4)
        two = raw_h >= 5.0
        wall_h = 5.15 if two else 2.85
        rise = 1.2 if two else 0.95
        paint = f"w{idx % len(coast.WALLS)}"
        b.extrude(0, "coral", poly, gnd - 0.35, gnd + 0.42, top=False)
        b.extrude(0, paint, poly, gnd + 0.42, gnd + wall_h, top=True)
        b.extrude(1, paint, poly, gnd - 0.15, gnd + wall_h, top=True)
        b.hip(0, "terr", poly, gnd + wall_h, rise)
        add_openings(b, poly, polys, idx, gnd, two)
        add_front_wall(b, poly, bravo, gnd)
        hides.append([round(pt[0], 1), round(pt[1], 1)])

    plants = lamps = 0
    for idx, (bld, pt, _hit) in enumerate(chosen):
        poly = polys[idx]
        north_z = min(p[1] for p in poly) - 1.5
        px, pz = pt[0], north_z
        if on_any(polys, px, pz):
            continue
        if closest(bravo, px, pz)[0] < 3.0:
            continue
        if idx == len(chosen) - 1:
            # Side yard of the wider end unit, off the cross street.
            ex = max(p[0] for p in poly) + 2.2
            ez = pt[1]
            if not on_any(polys, ex, ez) and closest(bravo, ex, ez)[0] > 4.0:
                coast.add_divi(b, ex, ez, lean=1.2, h=2.6, yaw=0.4)
                plants += 1
        elif idx % 2 == 0:
            coast.add_cactus(b, px, pz, h=1.35, arms=2)
            plants += 1
        if lamps < 3 and idx % 3 == 0:
            south_z = max(p[1] for p in poly) + 2.4
            lx, lz = pt[0], south_z
            if closest(bravo, lx, lz)[0] > 2.6 and not on_any(polys, lx, lz):
                g = coast.mesh_height(lx, lz)
                b.cyl(0, "iron", lx, g, lz, 0.045, g + 2.7, 0.035, 6)
                b.box(0, "lamp", lx - 0.18, g + 2.55, lz - 0.08, lx + 0.18, g + 2.7, lz + 0.08)
                b.cyl(1, "iron", lx, g, lz, 0.06, g + 2.5, 0.045, 5)
                lamps += 1

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


def add_openings(b, poly, polys, idx, gnd, two):
    others = [p for i, p in enumerate(polys) if i != idx]
    n = len(poly)
    for i in range(n):
        a, c = poly[i], poly[(i + 1) % n]
        length = edge_len(a, c)
        if length < 3.2:
            continue
        dx, dz = c[0] - a[0], c[1] - a[1]
        L = length
        oxn, ozn = dz / L, -dx / L
        mx, mz = (a[0] + c[0]) * 0.5, (a[1] + c[1]) * 0.5
        if party(mx + oxn * 0.4, mz + ozn * 0.4, others):
            continue
        yaw = math.atan2(dz, dx)
        count = 2 if length >= 8 else 1
        levels = (1.05, 3.35) if two else (1.02,)
        for level in levels:
            for k in range(count):
                t = (k + 1) / (count + 1)
                coast.add_opening(
                    b, a[0] + dx * t, a[1] + dz * t, gnd + level, yaw
                )


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
            "Gold Coast listing pages show a row of low townhouses with a larger "
            "end unit, cream walls, a pitched roof, and a small front wall. "
            "Malmokweg, the coast road, Figaroa, the golf course, and the next "
            "block east of Sero Callejón stay out of this slice. Original geometry, no photos."
        ),
        "frame": "glb origin = footprint centroid (world x,z); glTF +X = world x, +Z = world z, Y up; generated by tools/nw_costa_bravo_west.py",
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
    open(MANIFEST, "w").write(new)
    print(f"spliced {HERO_ID}")


def main():
    ox, oz, y0, tris, hides = build()
    splice(entry(ox, oz, y0, tris, hides))


if __name__ == "__main__":
    main()
