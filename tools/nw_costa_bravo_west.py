#!/usr/bin/env python3
"""Townhouses on the north side of Costa Bravo, between Diamante and Sero Callejón.

Satellite of this block shows a repeating row of red-tile gables facing
Costa Bravo, with parking bays in front. The Diamante 75 listing front is a
strong yellow facade: white arched door surrounds with a pediment, curved
wrought-iron balconies, and orange planters along a paver drive. OSM stores
most of these footprints as h=3.4, which is the default, not the two-storey
mass. Geometry is original. No photographs are stored in the mesh.

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


def slope_roof(b, lod, mat, wall, poly, street_i, y_eave, rise, others):
    """Tile slope facing the street. The ridge runs along the row, and the
    triangular gable is on the exposed end, the way Diamante 75 is built."""
    n = len(poly)
    a, c = poly[street_i], poly[(street_i + 1) % n]
    dx, dz = c[0] - a[0], c[1] - a[1]
    length = math.hypot(dx, dz) or 1.0
    ux, uz = dx / length, dz / length
    ox, oz = dz / length, -dx / length
    mx, mz = (a[0] + c[0]) * 0.5, (a[1] + c[1]) * 0.5
    cx = sum(p[0] for p in poly) / n
    cz = sum(p[1] for p in poly) / n
    # ox points into the lot, away from the carriageway.
    if (cx - mx) * ox + (cz - mz) * oz < 0:
        ox, oz = -ox, -oz
    alongs = [((p[0] - mx) * ux + (p[1] - mz) * uz) for p in poly]
    depths = [((p[0] - mx) * ox + (p[1] - mz) * oz) for p in poly]
    amin, amax = min(alongs), max(alongs)
    max_d = max(0.8, max(depths))
    ridge_d = max_d * 0.48
    ytop = y_eave + rise

    def wp(along, depth, y):
        return (mx + ux * along + ox * depth, y, mz + uz * along + oz * depth)

    f0, f1 = wp(amin, 0.0, y_eave), wp(amax, 0.0, y_eave)
    r0, r1 = wp(amin, ridge_d, ytop), wp(amax, ridge_d, ytop)
    b0, b1 = wp(amin, max_d, y_eave), wp(amax, max_d, y_eave)
    b.quad(lod, mat, [f0, f1, r1, r0], (-ox, 0.55, -oz))
    b.quad(lod, mat, [b1, b0, r0, r1], (ox, 0.55, oz))
    for sign, along in ((-1.0, amin), (1.0, amax)):
        probe = wp(along + sign * 0.55, max_d * 0.45, y_eave)
        if party(probe[0], probe[2], others):
            continue
        outward = (ux * sign, 0.0, uz * sign)
        front, back, peak = wp(along, 0.0, y_eave), wp(along, max_d, y_eave), wp(along, ridge_d, ytop)
        b.tri(lod, wall, front, back, peak, outward)
        if lod == 0:
            b.beam(0, "white", front, peak, 0.06, 0.045)
            b.beam(0, "white", back, peak, 0.06, 0.045)


def add_window(b, x, z, y, yaw):
    """White frame and glass. This facade has no green shutters."""
    c, s = math.cos(yaw), math.sin(yaw)
    nx, nz = s, -c
    x += nx * 0.1
    z += nz * 0.1
    for side in (-1.0, 1.0):
        b.box_yaw(0, "white", x + c * side * 0.42, y, z + s * side * 0.42, 0.05, 1.05, 0.055, yaw)
    b.box_yaw(0, "white", x, y + 0.98, z, 0.47, 0.055, 0.06, yaw)
    b.box_yaw(0, "white", x, y, z, 0.47, 0.055, 0.06, yaw)
    b.box_yaw(0, "glass", x + nx * 0.03, y + 0.12, z + nz * 0.03, 0.32, 0.78, 0.016, yaw)


def add_arch_door(b, mx, mz, g, ox, oz, ux, uz):
    """White semicircular surround and a dark door. The pediment is up at the eave."""
    x = mx + ox * 0.24
    z = mz + oz * 0.24
    y = g + 0.06
    yaw = math.atan2(uz, ux)
    b.box_yaw(0, "door", x, y, z, 0.38, 2.05, 0.035, yaw)
    for side in (-1.0, 1.0):
        b.box_yaw(0, "white", x + ux * side * 0.48, y, z + uz * side * 0.48, 0.08, 2.12, 0.08, yaw)
    spring = y + 2.08
    b.box_yaw(0, "white", x, spring - 0.02, z, 0.56, 0.08, 0.09, yaw)
    radius = 0.56
    segs = 7
    pts = []
    for i in range(segs + 1):
        ang = math.pi - math.pi * i / segs
        pts.append(
            (
                x + ux * math.cos(ang) * radius + ox * 0.02,
                spring + math.sin(ang) * radius,
                z + uz * math.cos(ang) * radius + oz * 0.02,
            )
        )
    for p0, p1 in zip(pts, pts[1:]):
        b.beam(0, "white", p0, p1, 0.1, 0.075)


def add_facade_pediment(b, mx, mz, y_base, ox, oz, ux, uz):
    """Curved white pediment with a terracotta inset, above the balcony."""
    x = mx + ox * 0.3
    z = mz + oz * 0.3
    half = 0.92
    peak_h = 1.05
    left = (x - ux * 0.62, y_base + 0.12, z - uz * 0.62)
    right = (x + ux * 0.62, y_base + 0.12, z + uz * 0.62)
    peak = (x, y_base + peak_h * 0.82, z)
    b.tri(0, "tile", left, right, peak, (ox, 0.25, oz))
    segs = 6
    pts = []
    for i in range(segs + 1):
        t = i / segs
        along = (t - 0.5) * 2.0 * half
        h = peak_h * math.sin(t * math.pi) ** 0.72
        pts.append((x + ux * along, y_base + h, z + uz * along))
    for p0, p1 in zip(pts, pts[1:]):
        b.beam(0, "white", p0, p1, 0.07, 0.05)
    b.beam(
        0,
        "white",
        (x - ux * half, y_base, z - uz * half),
        (x + ux * half, y_base, z + uz * half),
        0.06,
        0.045,
    )
    cy = y_base + peak_h * 0.48
    ring = []
    sides = 8
    rad = 0.16
    center = (x + ox * 0.04, cy, z + oz * 0.04)
    for i in range(sides):
        ang = i * math.tau / sides
        ring.append((center[0] + ux * math.cos(ang) * rad, center[1] + math.sin(ang) * rad, center[2] + uz * math.cos(ang) * rad))
    for i in range(sides):
        b.tri(0, "white", center, ring[i], ring[(i + 1) % sides], (ox, 0.1, oz))


def add_curved_balcony(b, mx, mz, g, ox, oz, ux, uz):
    """A bowed Juliet balcony: curved floor, curved rail, vertical bars."""
    y = g + 2.72
    half = 0.84
    bow = 0.62
    segs = 7

    def along_out(i):
        s = (i / segs - 0.5) * 2.0
        return s * half, 0.08 + bow * (1.0 - s * s)

    for i in range(segs):
        a0, o0 = along_out(i)
        a1, o1 = along_out(i + 1)
        w0 = (mx + ux * a0 + ox * 0.02, y, mz + uz * a0 + oz * 0.02)
        w1 = (mx + ux * a1 + ox * 0.02, y, mz + uz * a1 + oz * 0.02)
        q0 = (mx + ux * a0 + ox * o0, y, mz + uz * a0 + oz * o0)
        q1 = (mx + ux * a1 + ox * o1, y, mz + uz * a1 + oz * o1)
        b.quad(0, "white", [w0, w1, q1, q0], (0, 1, 0))
        b.quad(0, "white", [q0, q1, w1, w0], (0, -1, 0))
    rail0, rail1 = y + 0.05, y + 0.9
    outer = []
    for i in range(segs + 1):
        along, out = along_out(i)
        outer.append((mx + ux * along + ox * out, rail1, mz + uz * along + oz * out))
    for i in range(segs):
        b.beam(0, "iron", outer[i], outer[i + 1], 0.028, 0.02)
        b.beam(
            0,
            "iron",
            (outer[i][0], rail0, outer[i][2]),
            (outer[i + 1][0], rail0, outer[i + 1][2]),
            0.016,
            0.012,
        )
    for i, p in enumerate(outer):
        b.box(0, "iron", p[0] - 0.016, rail0, p[2] - 0.016, p[0] + 0.016, rail1, p[2] + 0.016)
        if i in (0, segs):
            _along, out = along_out(i)
            wall = (p[0] - ox * out, rail1, p[2] - oz * out)
            b.beam(0, "iron", p, wall, 0.024, 0.018)
    add_window(b, mx + ox * 0.06, mz + oz * 0.06, g + 2.82, math.atan2(uz, ux))


def _frond(b, lod, mat, crown, ang, reach, lift, droop, width, steps):
    """A flat arched leaf, not a stick. Both faces, because the shared material is single-sided."""
    sx, sz = -math.sin(ang), math.cos(ang)
    pts = []
    for s in range(steps + 1):
        t = s / steps
        rad = 0.12 + reach * t
        y = crown[1] + math.sin(t * math.pi) * lift - t * droop
        pts.append((crown[0] + math.cos(ang) * rad, y, crown[2] + math.sin(ang) * rad))
    for s in range(steps):
        t0, t1 = s / steps, (s + 1) / steps
        w0, w1 = width * (1.0 - 0.72 * t0), width * (1.0 - 0.72 * t1)
        p, q = pts[s], pts[s + 1]
        a = (p[0] - sx * w0, p[1], p[2] - sz * w0)
        c = (p[0] + sx * w0, p[1], p[2] + sz * w0)
        d = (q[0] + sx * w1, q[1], q[2] + sz * w1)
        e = (q[0] - sx * w1, q[1], q[2] - sz * w1)
        b.quad(lod, mat, [a, c, d, e], (0, 1, 0))
        b.quad(lod, mat, [c, a, e, d], (0, -1, 0))


def add_palm(b, x, z):
    g = coast.mesh_height(x, z)
    cx, cz, y = x, z, g - 0.04
    for i in range(5):
        ny = y + 1.05
        b.cyl(0, "trunk", cx, y, cz, 0.20 - i * 0.02, ny, 0.16 - i * 0.018, 7)
        cx, cz, y = cx + 0.03, cz + 0.015, ny
    b.cyl(1, "trunk", x, g, z, 0.13, g + 4.8, 0.07, 5)
    crown = (cx, y + 0.08, cz)
    for k in range(12):
        ang = k * math.tau / 12.0
        _frond(b, 0, "palm" if k % 2 == 0 else "palmd", crown, ang, 2.55, 0.95, 1.15, 0.20, 4)
    for k in range(8):
        ang = k * math.tau / 8.0 + 0.2
        _frond(b, 0, "palm", crown, ang, 1.55, 0.7, 0.35, 0.14, 3)
    for k in range(5):
        ang = k * math.tau / 5.0
        tip = (crown[0] + math.cos(ang) * 2.2, crown[1] - 0.35, crown[2] + math.sin(ang) * 2.2)
        b.beam(1, "palm", crown, tip, 0.06, 0.02)


def add_planter(b, x, z, yaw, g):
    """A long orange planter with a green top, set along the paver drive."""
    b.box_yaw(0, "planter", x, g + 0.02, z, 0.72, 0.34, 0.26, yaw)
    b.box_yaw(0, "leaf", x, g + 0.34, z, 0.58, 0.16, 0.18, yaw)


def add_pad(b, mx, mz, ox, oz, ux, uz, g):
    """Paver drive: a warm slab with darker joints, not a grey concrete pad."""
    depth, half = 4.6, 1.2
    y0, y1 = g - 0.02, g + 0.05
    c0 = (mx - ux * half + ox * 1.15, mz - uz * half + oz * 1.15)
    c1 = (mx + ux * half + ox * 1.15, mz + uz * half + oz * 1.15)
    o0 = (c0[0] + ox * depth, c0[1] + oz * depth)
    o1 = (c1[0] + ox * depth, c1[1] + oz * depth)
    b.extrude(0, "paver", [c0, c1, o1, o0], y0, y1, top=True)
    for k in (1, 2, 3):
        t = k / 4.0
        a = (c0[0] + (o0[0] - c0[0]) * t, c0[1] + (o0[1] - c0[1]) * t)
        c = (c1[0] + (o1[0] - c1[0]) * t, c1[1] + (o1[1] - c1[1]) * t)
        nrm = 0.05
        a2 = (a[0] + ox * nrm, a[1] + oz * nrm)
        c2 = (c[0] + ox * nrm, c[1] + oz * nrm)
        b.extrude(0, "joint", [a, c, c2, a2], y1, y1 + 0.012, top=True)


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
    b.mat("white", (0.96, 0.95, 0.92), 0.62)
    b.mat("door", (0.30, 0.18, 0.11), 0.7)
    b.mat("wood", (0.42, 0.30, 0.20), 0.72)
    b.mat("iron", (0.16, 0.17, 0.18), 0.45)
    b.mat("trunk", coast.TRUNK, 0.9)
    b.mat("palm", (0.18, 0.46, 0.16), 0.78)
    b.mat("palmd", (0.12, 0.32, 0.12), 0.82)
    b.mat("leaf", (0.20, 0.44, 0.16), 0.8)
    b.mat("planter", (0.88, 0.38, 0.08), 0.78)
    b.mat("flower", (0.93, 0.45, 0.10), 0.7)
    b.mat("paver", (0.76, 0.68, 0.54), 0.92)
    b.mat("joint", (0.48, 0.42, 0.34), 0.95)
    # Strong yellow, not the beige stucco the listing front does not have.
    stucco = ((0.93, 0.74, 0.16), (0.90, 0.68, 0.12), (0.96, 0.80, 0.22))
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
        wall_h = 5.2
        paint = f"w{idx % 3}"
        b.extrude(0, "coral", poly, gnd - 0.3, gnd + 0.4, top=False)
        b.extrude(0, paint, poly, gnd + 0.4, gnd + wall_h, top=True)
        b.extrude(1, paint, poly, gnd - 0.1, gnd + wall_h, top=True)
        edge = street_edge(poly, bravo)
        if edge:
            _dist, si, a, c, mx, mz = edge
            out_x, out_z, ux, uz = outward_of(a, c, bravo)
            others = [p for i, p in enumerate(polys) if i != idx]
            slope_roof(b, 0, "tile", paint, poly, si, gnd + wall_h, 1.85, others)
            slope_roof(b, 1, "tile", paint, poly, si, gnd + wall_h, 1.2, others)
            span = edge_len(a, c)
            bay_n = max(1, int(round(span / 5.2)))
            yaw = math.atan2(uz, ux)
            b.beam(
                0,
                "white",
                (a[0] + out_x * 0.16, gnd + wall_h, a[1] + out_z * 0.16),
                (c[0] + out_x * 0.16, gnd + wall_h, c[1] + out_z * 0.16),
                0.07,
                0.05,
            )
            for k in range(bay_n):
                t = (k + 0.5) / bay_n
                bx_ = a[0] + (c[0] - a[0]) * t
                bz_ = a[1] + (c[1] - a[1]) * t
                add_curved_balcony(b, bx_, bz_, gnd, out_x, out_z, ux, uz)
                add_arch_door(b, bx_, bz_, gnd, out_x, out_z, ux, uz)
                add_facade_pediment(b, bx_, bz_, gnd + wall_h - 0.08, out_x, out_z, ux, uz)
                for pside in (-1.0, 1.0):
                    sx = bx_ + ux * pside * 1.45 + out_x * 1.45
                    sz = bz_ + uz * pside * 1.45 + out_z * 1.45
                    if closest(bravo, sx, sz)[0] > 2.0 and not on_any(polys, sx, sz):
                        add_planter(b, sx, sz, yaw, gnd)
                        plants += 1
            add_openings(b, poly, polys, idx, gnd, street_i=si)
            far_pad = closest(bravo, mx + out_x * 5.5, mz + out_z * 5.5)
            if far_pad and far_pad[0] > 3.4:
                add_pad(b, mx, mz, out_x, out_z, ux, uz, gnd)
            # Palms sit beside the drive, between bays, the way the satellite shows them.
            side = 1.0 if idx % 2 == 0 else -1.0
            px = mx + ux * side * min(1.7, span * 0.34) + out_x * 4.6
            pz = mz + uz * side * min(1.7, span * 0.34) + out_z * 4.6
            if closest(bravo, px, pz)[0] > 3.2 and not on_any(polys, px, pz):
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
                add_window(b, a[0] + dx * t, a[1] + dz * t, gnd + level, yaw)


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
            "Satellite of this block (https://www.google.com/maps/@12.599858,-70.043234,131m/data=!3m1!1e3, "
            "refs/places/noord/diamante-75/satellite.jpg) shows repeating red-tile gable bays facing Costa Bravo, "
            "with palms and parking bays in front. There is no Street View on this carriageway. "
            "The Diamante 75 listing front (https://remaxaruba.com/property/details/gold-coast-diamante-75, "
            "refs/places/noord/diamante-75/) is a strong yellow facade with white arched, pedimented door surrounds, "
            "curved wrought-iron balconies, and orange planters along a paver drive. "
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
