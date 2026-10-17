#!/usr/bin/env python3
"""Villa fronts on the middle of Malmokweg, inland of the west-end row.

The west-end hero stops near x -8280. This slice continues the same
street east, still short of Caya Frans Figaroa and the Noord grid:
low plaster houses, coral boundary walls with a gate, and divi-divi
and kadushi in the yards.

Reference, not copied: listing and drone views of Malmokweg villas
(cream plaster, terracotta hips, coral walls, cactus and divi). Geometry
is original. No photographs are stored.
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

HERO_ID = "nw_mk_wege"
MANIFEST = os.path.join(ROOT, "game", "data", "hero", "manifest.json")
GLB = os.path.join(ROOT, "game", "models", "hero", f"{HERO_ID}.glb")

# Continues the west-end row (which owns x <= -8280) and stops before
# the Figaroa junction and the next cluster east of x -8000.
X_WEST, X_EAST = -8280.0, -8000.0
ROAD_BAND = 26.0
SIDE_STREETS = {
    "Caya Pitaya",
    "Caya Pelican",
    "Diamante",
    "Costa Bravo",
    "Caya Frans Figoroa",
    "Caya Francisco D. Figaroa",
    "Costa di Oro",
    "Costa Bunita",
}


def load_named(names):
    roads = []
    real = coast.REAL
    for fn in os.listdir(real):
        if not (fn.startswith("r_") and fn.endswith(".json")):
            continue
        data = json.load(open(os.path.join(real, fn)))
        for r in data.get("roads") or []:
            if r.get("n") in names and len(r.get("p") or []) >= 2:
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


def build():
    weg = load_named({"Malmokweg"})
    coast_roads = load_named({"L.G. Smith Boulevard", "Avenida Nelson O. Oduber"})
    side_roads = load_named(SIDE_STREETS)
    if not weg:
        raise SystemExit("Malmokweg missing")
    chosen = []
    for bld in coast.load_buildings():
        if (bld.get("h") or 0) >= 8:
            continue
        if bld["k"] not in ("house", "yes", "residential", "detached"):
            continue
        cx, cz = bld["cx"], bld["cz"]
        if not (X_WEST <= cx <= X_EAST):
            continue
        hit = closest(weg, cx, cz)
        if not hit or hit[0] > ROAD_BAND:
            continue
        if hit[1] < X_WEST - 8 or hit[1] > X_EAST + 8:
            continue
        # The coast spur of Malmokweg climbs toward Smith. This slice is the
        # east-west villa run, not that junction.
        if hit[2] > -8888:
            continue
        shore = closest(coast_roads, cx, cz)
        if shore and shore[0] < 48:
            continue
        # A house that faces a side street stays with that street.
        other = closest(side_roads, cx, cz)
        if other and other[0] + 1.0 < hit[0]:
            continue
        pt = coast.interior_point(bld["p"])
        if not pt:
            continue
        chosen.append((bld, pt, hit))
    chosen.sort(key=lambda t: t[0]["cx"])
    print(f"houses {len(chosen)}")
    if len(chosen) < 6:
        raise SystemExit("too few Malmokweg houses")

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

    hides = []
    for idx, (bld, pt, hit) in enumerate(chosen):
        poly = list(bld["p"])
        area = 0.0
        for i in range(len(poly)):
            a, c = poly[i], poly[(i + 1) % len(poly)]
            area += a[0] * c[1] - c[0] * a[1]
        if area < 0:
            poly = list(reversed(poly))
        gnd = coast.mesh_height(pt[0], pt[1])
        wall_h = 3.25
        paint = f"w{idx % len(coast.WALLS)}"
        b.extrude(0, "coral", poly, gnd - 0.4, gnd + 0.5, top=False)
        b.extrude(0, paint, poly, gnd + 0.5, gnd + wall_h, top=True)
        b.extrude(1, paint, poly, gnd - 0.2, gnd + wall_h, top=True)
        if bld["r"] == "hipped":
            b.hip(0, "terr", poly, gnd + wall_h, 1.25)
        else:
            b.extrude(0, paint, poly, gnd + wall_h, gnd + wall_h + 0.32, top=False)
        n = len(poly)
        edges = []
        for i in range(n):
            a, cpt = poly[i], poly[(i + 1) % n]
            edges.append((math.hypot(cpt[0] - a[0], cpt[1] - a[1]), a, cpt))
        edges.sort(reverse=True)
        for length, a, cpt in edges[:2]:
            if length < 4.5:
                continue
            dx, dz = cpt[0] - a[0], cpt[1] - a[1]
            yaw = math.atan2(dz, dx)
            count = 2 if length >= 8 else 1
            for k in range(count):
                t = (k + 1) / (count + 1)
                coast.add_opening(b, a[0] + dx * t, a[1] + dz * t, gnd + 1.05, yaw)
        # Coral wall on the street edge, with a gate in the middle.
        best = None
        for i in range(n):
            a, c = poly[i], poly[(i + 1) % n]
            mx, mz = (a[0] + c[0]) * 0.5, (a[1] + c[1]) * 0.5
            d = closest(weg, mx, mz)
            if d and (best is None or d[0] < best[0]):
                best = (d[0], a, c, mx, mz)
        if best and best[0] < 28:
            a, c = best[1], best[2]
            dx, dz = c[0] - a[0], c[1] - a[1]
            L = math.hypot(dx, dz) or 1.0
            oxn, ozn = dz / L, -dx / L
            # Prefer the side that faces the carriageway.
            if closest(weg, best[3] + oxn, best[4] + ozn)[0] > closest(weg, best[3] - oxn, best[4] - ozn)[0]:
                oxn, ozn = -oxn, -ozn
            inset = 0.7
            for seg in ((0.06, 0.36), (0.64, 0.94)):
                a1 = (a[0] + dx * seg[0] + oxn * inset, a[1] + dz * seg[0] + ozn * inset)
                a2 = (a[0] + dx * seg[1] + oxn * inset, a[1] + dz * seg[1] + ozn * inset)
                g1 = coast.mesh_height(a1[0], a1[1])
                b.beam(0, "coral", (a1[0], g1, a1[1]), (a2[0], g1 + 0.8, a2[1]), 0.14, 0.16)
            gx = a[0] + dx * 0.5 + oxn * inset
            gz = a[1] + dz * 0.5 + ozn * inset
            gy = coast.mesh_height(gx, gz)
            for side in (-0.55, 0.55):
                px = gx + (dx / L) * side
                pz = gz + (dz / L) * side
                b.box(0, "white", px - 0.08, gy, pz - 0.08, px + 0.08, gy + 1.05, pz + 0.08)
        hides.append([round(pt[0], 1), round(pt[1], 1)])

    # Verge planting and a lamp, kept off footprints and off the carriageway.
    plants = lamps = 0
    for bld, pt, hit in chosen:
        d, mx, mz, vx, vz = hit
        L = math.hypot(vx, vz) or 1.0
        sx, sz = -vz / L, vx / L
        side = 1 if (pt[0] - mx) * sx + (pt[1] - mz) * sz > 0 else -1
        # Yard side, a few metres off the wall toward the house.
        px = mx + sx * side * (d * 0.45)
        pz = mz + sz * side * (d * 0.45)
        if coast.inside(bld["p"], px, pz):
            continue
        if plants % 2 == 0:
            coast.add_divi(b, px, pz, lean=1.5, h=2.8, yaw=math.pi)
        else:
            coast.add_cactus(b, px, pz, h=1.5, arms=2)
        plants += 1
        if lamps < 5 and idx_ok(bld):
            lx = mx - sx * side * 3.2
            lz = mz - sz * side * 3.2
            if closest(weg, lx, lz)[0] > 2.4 and not on_any(chosen, lx, lz):
                g = coast.mesh_height(lx, lz)
                b.cyl(0, "iron", lx, g, lz, 0.05, g + 3.1, 0.04, 6)
                b.box(0, "lamp", lx - 0.22, g + 2.95, lz - 0.1, lx + 0.22, g + 3.12, lz + 0.1)
                b.cyl(1, "iron", lx, g, lz, 0.07, g + 2.9, 0.05, 5)
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
    print(f"origin {ox:.2f},{oz:.2f} y {y0} tris {tris[0]}/{tris[1]} far {far:.1f} plants {plants} lamps {lamps}")
    return ox, oz, y0, tris, hides


def idx_ok(bld):
    return int(bld["cx"]) % 3 == 0


def on_any(chosen, x, z):
    for bld, _pt, _hit in chosen:
        if coast.inside(bld["p"], x, z):
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
        "geo_source": "OSM Malmokweg centreline and footprints, Aruba DEM",
        "ref_sources": (
            "Middle of Malmokweg, inland of the west-end villa row and short of "
            "Caya Frans Figaroa. Listing and drone views show low cream houses, "
            "terracotta hips, a coral boundary wall with a gate, and divi-divi and "
            "kadushi in the yards. The west-end row, the coast road, the golf course, "
            "and the Noord grid stay out of this slice. Original geometry, no photos."
        ),
        "frame": "glb origin = footprint centroid (world x,z); glTF +X = world x, +Z = world z, Y up; generated by tools/nw_malmokweg_east.py",
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
