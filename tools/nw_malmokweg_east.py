#!/usr/bin/env python3
"""Villa fronts on the middle of Malmokweg, inland of the west-end row.

The west-end hero stops near x -8280. This slice continues the same
street east, still short of Caya Frans Figaroa and the Noord grid.
Each lot keeps its OSM footprint as the yard. The house is a plaster
volume on the street side of that lot: coral plinth, hip of clay tile
with an eave, a columned porch, a wood door and shuttered windows, and
a coral wall with an iron gate. Yards get a divi-divi, a palm, or a
kadushi. Photographs stay out of the GLB.

References (not copied into the mesh): Street View along this block,
the Malmokweg 25 / 27 listing (these numbers sit in the slice), and the
Malmokweg 22-J drone exterior just south of the carriageway
(white plaster, red hips, porch columns, palms).
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


def hip_roof(b, lod, mat, poly, y_eave, rise, inner_k=0.16):
    """Hip with a short ridge. The shared hip() leaves a wide flat cap."""
    area = 0.0
    for i in range(len(poly)):
        a, bp = poly[i], poly[(i + 1) % len(poly)]
        area += a[0] * bp[1] - bp[0] * a[1]
    if area < 0:
        poly = list(reversed(poly))
    n = len(poly)
    cx = sum(p[0] for p in poly) / n
    cz = sum(p[1] for p in poly) / n
    inner = [(cx + (p[0] - cx) * inner_k, cz + (p[1] - cz) * inner_k) for p in poly]
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
        b.tri(
            lod,
            mat,
            (cx, yt, cz),
            (inner[i][0], yt, inner[i][1]),
            (inner[j][0], yt, inner[j][1]),
            (0, 1, 0),
        )


def outset_rect(rect, dist, ux, uz, nx, nz):
    p0, p1, p2, p3 = rect
    return [
        (p0[0] - ux * dist - nx * dist, p0[1] - uz * dist - nz * dist),
        (p1[0] + ux * dist - nx * dist, p1[1] + uz * dist - nz * dist),
        (p2[0] + ux * dist + nx * dist, p2[1] + uz * dist + nz * dist),
        (p3[0] - ux * dist + nx * dist, p3[1] - uz * dist + nz * dist),
    ]


def street_rect(poly, a, c):
    """House rectangle on the street side of a lot. None if the lot is too tight."""
    dx, dz = c[0] - a[0], c[1] - a[1]
    length = math.hypot(dx, dz) or 1.0
    ux, uz = dx / length, dz / length
    nx, nz = dz / length, -dx / length
    cx = sum(p[0] for p in poly) / len(poly)
    cz = sum(p[1] for p in poly) / len(poly)
    mx, mz = (a[0] + c[0]) * 0.5, (a[1] + c[1]) * 0.5
    if (cx - mx) * nx + (cz - mz) * nz < 0:
        nx, nz = -nx, -nz
    for depth in (10.2, 8.4, 6.8):
        for frac in (0.62, 0.48, 0.36):
            width = min(15.5, max(7.2, length * frac))
            if length < 9.0:
                width = max(4.4, length * 0.78)
            half = width * 0.5
            for inset in (4.6, 3.1, 1.8):
                p0 = (mx - ux * half + nx * inset, mz - uz * half + nz * inset)
                p1 = (mx + ux * half + nx * inset, mz + uz * half + nz * inset)
                p2 = (p1[0] + nx * depth, p1[1] + nz * depth)
                p3 = (p0[0] + nx * depth, p0[1] + nz * depth)
                rect = [p0, p1, p2, p3]
                samples = list(rect)
                for i in range(4):
                    q, r = rect[i], rect[(i + 1) % 4]
                    samples.append(((q[0] + r[0]) * 0.5, (q[1] + r[1]) * 0.5))
                if all(coast.inside(poly, p[0], p[1]) for p in samples):
                    return rect, (ux, uz), (nx, nz), width, depth
    return None


def shrink_poly(poly, k):
    cx = sum(p[0] for p in poly) / len(poly)
    cz = sum(p[1] for p in poly) / len(poly)
    return [(cx + (p[0] - cx) * (1.0 - k), cz + (p[1] - cz) * (1.0 - k)) for p in poly]


def roof_rise(poly):
    xs = [p[0] for p in poly]
    zs = [p[1] for p in poly]
    span = max(max(xs) - min(xs), max(zs) - min(zs), 6.0)
    return max(1.2, min(2.15, span * 0.16))


def add_door(b, x, z, g, yaw):
    c, s = math.cos(yaw), math.sin(yaw)
    nx, nz = s, -c
    x += nx * 0.12
    z += nz * 0.12
    b.box_yaw(0, "wood", x, g + 0.02, z, 0.42, 2.12, 0.05, yaw)
    b.box_yaw(0, "frame", x, g + 2.12, z, 0.52, 0.08, 0.07, yaw)
    for side in (-1.0, 1.0):
        b.box_yaw(0, "frame", x + c * side * 0.48, g + 0.02, z + s * side * 0.48, 0.06, 2.16, 0.07, yaw)


def openings_on(b, a, c, g, door=False, upper=None):
    dx, dz = c[0] - a[0], c[1] - a[1]
    length = math.hypot(dx, dz)
    if length < 3.4:
        return
    yaw = math.atan2(dz, dx)
    if door and length >= 6.0:
        coast.add_opening(b, a[0] + dx * 0.27, a[1] + dz * 0.27, g + 1.05, yaw)
        add_door(b, a[0] + dx * 0.5, a[1] + dz * 0.5, g, yaw)
        coast.add_opening(b, a[0] + dx * 0.73, a[1] + dz * 0.73, g + 1.05, yaw)
    else:
        count = 1 if length < 6.5 else (2 if length < 11.5 else 3)
        for k in range(count):
            t = (k + 1) / (count + 1)
            coast.add_opening(b, a[0] + dx * t, a[1] + dz * t, g + 1.05, yaw)
    if upper is not None and length >= 6.0:
        for t in (0.32, 0.68):
            coast.add_opening(b, a[0] + dx * t, a[1] + dz * t, upper, yaw)


def add_porch(b, rect, g, ux, uz, nx, nz, width):
    p0, p1 = rect[0], rect[1]
    depth = 1.85
    y_back = g + 2.62
    y_front = g + 2.42
    back0 = (p0[0] - nx * 0.05, y_back, p0[1] - nz * 0.05)
    back1 = (p1[0] - nx * 0.05, y_back, p1[1] - nz * 0.05)
    front1 = (p1[0] - nx * (0.05 + depth), y_front, p1[1] - nz * (0.05 + depth))
    front0 = (p0[0] - nx * (0.05 + depth), y_front, p0[1] - nz * (0.05 + depth))
    b.quad(0, "white", [back0, back1, front1, front0], (0, 1, 0))
    b.quad(0, "white", [front0, front1, back1, back0], (0, -1, 0))
    b.beam(0, "fascia", front0, front1, 0.06, 0.08)
    stops = (0.12, 0.88) if width < 11.0 else (0.1, 0.34, 0.66, 0.9)
    for t in stops:
        cx = p0[0] + (p1[0] - p0[0]) * t - nx * (depth * 0.85)
        cz = p0[1] + (p1[1] - p0[1]) * t - nz * (depth * 0.85)
        b.box(0, "white", cx - 0.11, g, cz - 0.11, cx + 0.11, g + 2.42, cz + 0.11)


def wall_run(b, a, c, mat, thick, height):
    dx, dz = c[0] - a[0], c[1] - a[1]
    length = math.hypot(dx, dz) or 1.0
    px, pz = -dz / length * thick, dx / length * thick
    g0 = coast.mesh_height(a[0], a[1])
    g1 = coast.mesh_height(c[0], c[1])
    base = min(g0, g1) - 0.08
    top = base + height
    poly = [
        (a[0] + px, a[1] + pz),
        (c[0] + px, c[1] + pz),
        (c[0] - px, c[1] - pz),
        (a[0] - px, a[1] - pz),
    ]
    b.extrude(0, mat, poly, base, top, top=True)
    b.extrude(1, mat, poly, base, top, top=False)


def add_fence(b, a, c, wall_h):
    """Vertical bars on top of the street wall, the Malmokweg frontage pattern."""
    dx, dz = c[0] - a[0], c[1] - a[1]
    length = math.hypot(dx, dz)
    if length < 1.4:
        return
    g = coast.mesh_height((a[0] + c[0]) * 0.5, (a[1] + c[1]) * 0.5)
    y0 = g + wall_h - 0.02
    y1 = y0 + 0.72
    b.beam(0, "iron", (a[0], y1, a[1]), (c[0], y1, c[1]), 0.025, 0.02)
    n = max(2, int(length / 0.72))
    for i in range(1, n):
        t = i / n
        x = a[0] + dx * t
        z = a[1] + dz * t
        b.box(0, "iron", x - 0.035, y0, z - 0.035, x + 0.035, y1, z + 0.035)


def add_gate(b, x, z, along, g, post="stucco"):
    ax, az = along
    for t in (-1.15, 1.15):
        px, pz = x + ax * t, z + az * t
        b.box(0, post, px - 0.1, g, pz - 0.1, px + 0.1, g + 1.9, pz + 0.1)
    for t in (-0.9, -0.6, -0.3, 0.0, 0.3, 0.6, 0.9):
        px, pz = x + ax * t, z + az * t
        b.box(0, "iron", px - 0.02, g + 0.08, pz - 0.02, px + 0.02, g + 1.62, pz + 0.02)
    b.beam(0, "iron", (x - ax * 1.05, g + 1.6, z - az * 1.05), (x + ax * 1.05, g + 1.6, z + az * 1.05), 0.02, 0.018)
    b.beam(1, "iron", (x - ax * 0.95, g + 0.8, z - az * 0.95), (x + ax * 0.95, g + 0.8, z + az * 0.95), 0.03, 0.03)


def add_palm(b, x, z):
    g = coast.mesh_height(x, z)
    cx, cz, y = x, z, g - 0.05
    for i in range(5):
        ny = y + 1.05
        nx = cx + 0.05
        nz = cz + 0.02
        b.cyl(0, "trunk", cx, y, cz, 0.17 - i * 0.012, ny, 0.15 - i * 0.012, 6)
        cx, cz, y = nx, nz, ny
    b.cyl(1, "trunk", x, g, z, 0.14, g + 4.6, 0.08, 5)
    for k in range(8):
        ang = k * math.tau / 8.0
        mid = (cx + math.cos(ang) * 1.05, y + 0.28, cz + math.sin(ang) * 1.05)
        tip = (cx + math.cos(ang) * 2.35, y - 0.45, cz + math.sin(ang) * 2.35)
        b.beam(0, "palm", (cx, y + 0.15, cz), mid, 0.1, 0.035)
        b.beam(0, "palm", mid, tip, 0.06, 0.02)
        if k % 2 == 0:
            b.beam(1, "palm", (cx, y, cz), tip, 0.08, 0.03)


def add_divi_tree(b, x, z, yaw):
    g = coast.mesh_height(x, z)
    c, s = math.cos(yaw), math.sin(yaw)
    p0 = (x, g - 0.05, z)
    p1 = (x + c * 0.15, g + 1.15, z + s * 0.15)
    p2 = (x + c * 1.35, g + 1.65, z + s * 1.35)
    p3 = (x + c * 2.7, g + 1.45, z + s * 2.7)
    b.beam(0, "trunk", p0, p1, 0.13, 0.12)
    b.beam(0, "trunk", p1, p2, 0.11, 0.1)
    b.beam(0, "trunk", p2, p3, 0.08, 0.07)
    b.beam(1, "trunk", p0, p3, 0.12, 0.1)
    for k in range(6):
        ang = yaw + (k - 2.5) * 0.42
        tip = (p3[0] + math.cos(ang) * 0.95, p3[1] + 0.22 + (k % 2) * 0.12, p3[2] + math.sin(ang) * 0.95)
        name = "palm" if k % 2 == 0 else "leafd"
        b.beam(0, name, p3, tip, 0.22, 0.05)
        if k % 2 == 0:
            b.beam(1, name, p3, tip, 0.16, 0.05)


def add_kadushi(b, x, z):
    g = coast.mesh_height(x, z)
    b.cyl(0, "cact", x, g - 0.05, z, 0.18, g + 2.5, 0.13, 7)
    b.cyl(0, "cact", x + 0.32, g - 0.05, z + 0.06, 0.12, g + 1.7, 0.09, 6)
    b.cyl(0, "cact", x - 0.08, g + 1.15, z + 0.28, 0.08, g + 1.85, 0.06, 5)
    b.cyl(1, "cact", x, g, z, 0.16, g + 2.2, 0.11, 5)


def lot_role(bld):
    """The July 2022 street photo at 12.60061, -70.04489 frames two lots."""
    cx, cz = bld["cx"], bld["cz"]
    if math.hypot(cx + 8147.2, cz + 8936.6) < 6.0:
        return "h31"
    if math.hypot(cx + 8161.5, cz + 8941.6) < 8.0:
        return "two"
    return None


def street_frame(bld, weg):
    """Street edge, east-pointing along-axis, and the normal into the lot."""
    poly = bld["p"]
    best = None
    for i in range(len(poly)):
        a, c = poly[i], poly[(i + 1) % len(poly)]
        mx, mz = (a[0] + c[0]) * 0.5, (a[1] + c[1]) * 0.5
        d = closest(weg, mx, mz)
        if d and (best is None or d[0] < best[0]):
            best = (d[0], a, c)
    a, c = best[1], best[2]
    dx, dz = c[0] - a[0], c[1] - a[1]
    span = math.hypot(dx, dz) or 1.0
    ux, uz = dx / span, dz / span
    if ux < 0:
        ux, uz = -ux, -uz
        a, c = c, a
    nx, nz = -uz, ux
    cx, cz = bld["cx"], bld["cz"]
    mx, mz = (a[0] + c[0]) * 0.5, (a[1] + c[1]) * 0.5
    if (cx - mx) * nx + (cz - mz) * nz < 0:
        nx, nz = -nx, -nz
    return a, (ux, uz), (nx, nz), span


def add_bars(b, a, c, wall_h, spacing):
    dx, dz = c[0] - a[0], c[1] - a[1]
    length = math.hypot(dx, dz)
    if length < 0.8:
        return
    g = coast.mesh_height((a[0] + c[0]) * 0.5, (a[1] + c[1]) * 0.5)
    y0 = g + wall_h - 0.02
    y1 = y0 + 0.78
    b.beam(0, "iron", (a[0], y1, a[1]), (c[0], y1, c[1]), 0.02, 0.016)
    b.beam(0, "iron", (a[0], y0 + 0.08, a[1]), (c[0], y0 + 0.08, c[1]), 0.016, 0.014)
    n = max(2, int(length / spacing))
    for i in range(n + 1):
        t = i / n
        x = a[0] + dx * t
        z = a[1] + dz * t
        b.box(0, "iron", x - 0.02, y0, z - 0.02, x + 0.02, y1, z + 0.02)


def add_iron_gate(b, x, z, along, g, half):
    ax, az = along
    for t in (-half - 0.08, half + 0.08):
        px, pz = x + ax * t, z + az * t
        b.box(0, "tan", px - 0.09, g, pz - 0.09, px + 0.09, g + 1.85, pz + 0.09)
    steps = max(3, int(half / 0.16))
    for i in range(-steps, steps + 1):
        t = half * i / steps
        px, pz = x + ax * t, z + az * t
        b.box(0, "iron", px - 0.018, g + 0.06, pz - 0.018, px + 0.018, g + 1.7, pz + 0.018)
    b.beam(
        0, "iron",
        (x - ax * half, g + 1.68, z - az * half),
        (x + ax * half, g + 1.68, z + az * half),
        0.02, 0.016,
    )
    b.beam(
        0, "iron",
        (x - ax * half, g + 0.12, z - az * half),
        (x + ax * half, g + 0.12, z + az * half),
        0.016, 0.014,
    )


def add_shrub(b, x, z, h=0.85):
    g = coast.mesh_height(x, z)
    b.box(0, "shrub", x - 0.42, g, z - 0.32, x + 0.42, g + h * 0.7, z + 0.32)
    b.box(0, "palm", x - 0.28, g + h * 0.35, z - 0.22, x + 0.28, g + h, z + 0.22)


def add_parked(b, x, z, along, mat, length, tall):
    ax, az = along
    yaw = math.atan2(az, ax)
    g = coast.mesh_height(x, z) + 0.02
    b.box_yaw(0, mat, x, g + 0.28, z, length * 0.5, tall * 0.55, 0.82, yaw)
    b.box_yaw(0, "glass", x + ax * length * 0.08, g + tall * 0.55, z + az * length * 0.08, length * 0.18, tall * 0.32, 0.72, yaw)
    for t in (-0.32, 0.32):
        for side in (-0.78, 0.78):
            wx = x + ax * length * t - az * side
            wz = z + az * length * t + ax * side
            b.box_yaw(0, "iron", wx, g, wz, 0.11, 0.32, 0.2, yaw)


def add_gravel(b, west, east, ux, uz, nx, nz):
    """Pale shoulder between the wall and the carriageway. Vertex colour, no photo."""
    sx, sz = -nx, -nz
    y = coast.mesh_height((west[0] + east[0]) * 0.5, (west[1] + east[1]) * 0.5) + 0.04
    near = 0.3
    far = 2.2
    pts = [
        (west[0] + sx * near, y, west[1] + sz * near),
        (east[0] + sx * near, y, east[1] + sz * near),
        (east[0] + sx * far, y, east[1] + sz * far),
        (west[0] + sx * far, y, west[1] + sz * far),
    ]
    b.quad(0, "gravel", pts, (0, 1, 0))
    b.quad(1, "gravel", pts, (0, 1, 0))
    # ux/uz kept so a later caller can extend the strip without recomputing the edge.
    _ = (ux, uz)


def build_street_match(b, bld, role, weg):
    """House 31 and the white two-storey on its west side, from the street photo."""
    a, (ux, uz), (nx, nz), span = street_frame(bld, weg)
    if role == "h31":
        # The OSM footprint is only the inner cottage. The wall in the photo
        # runs on east of the two-storey, about sixteen metres.
        west = (a[0] + ux * 0.4 + nx * 0.15, a[1] + uz * 0.4 + nz * 0.15)
        east = (west[0] + ux * 15.6, west[1] + uz * 15.6)
        gate_t, gate_half = 0.46, 0.72
        house_w, house_d, inset = 11.2, 8.0, 4.8
        paint = "tan"
        storeys = 1
    else:
        west = (a[0] + nx * 0.2, a[1] + nz * 0.2)
        east = (west[0] + ux * span, west[1] + uz * span)
        gate_t, gate_half = 0.24, 1.85
        house_w, house_d, inset = min(14.5, span * 0.72), 9.5, 5.6
        paint = "white"
        storeys = 2
    # The photo is taken from the carriageway. The OSM edge is the cottage, not
    # the boundary wall, so the wall sits forward on the verge.
    pull = 7.4
    west = (west[0] - nx * pull, west[1] - nz * pull)
    east = (east[0] - nx * pull, east[1] - nz * pull)
    dx, dz = east[0] - west[0], east[1] - west[1]
    length = math.hypot(dx, dz) or 1.0
    wall_h = 1.72
    gap0 = max(0.04, gate_t - gate_half / length)
    gap1 = min(0.96, gate_t + gate_half / length)
    for seg in ((0.0, gap0), (gap1, 1.0)):
        a1 = (west[0] + dx * seg[0], west[1] + dz * seg[0])
        a2 = (west[0] + dx * seg[1], west[1] + dz * seg[1])
        wall_run(b, a1, a2, "tan", 0.16, wall_h)
        add_bars(b, a1, a2, wall_h, 0.36)
    gx = west[0] + dx * gate_t
    gz = west[1] + dz * gate_t
    add_iron_gate(b, gx, gz, (ux, uz), coast.mesh_height(gx, gz), gate_half)
    add_gravel(b, west, east, ux, uz, nx, nz)

    mid = (west[0] + dx * 0.55, west[1] + dz * 0.55)
    hx = mid[0] + nx * inset
    hz = mid[1] + nz * inset
    half = house_w * 0.5
    p0 = (hx - ux * half, hz - uz * half)
    p1 = (hx + ux * half, hz + uz * half)
    p2 = (p1[0] + nx * house_d, p1[1] + nz * house_d)
    p3 = (p0[0] + nx * house_d, p0[1] + nz * house_d)
    mass = [p0, p1, p2, p3]
    gnd = coast.mesh_height(hx, hz)
    wall = 5.35 if storeys == 2 else 3.15
    b.extrude(0, "coral", mass, gnd - 0.2, gnd + 0.35, top=False)
    b.extrude(0, paint, mass, gnd + 0.35, gnd + wall, top=True)
    b.extrude(1, paint, mass, gnd - 0.1, gnd + wall, top=True)
    roof = outset_rect(mass, 0.45, ux, uz, nx, nz)
    y_eave = gnd + wall
    hip_roof(b, 0, "tile", roof, y_eave, roof_rise(mass))
    hip_roof(b, 1, "tile", mass, y_eave, roof_rise(mass) * 0.85, inner_k=0.28)
    for i in range(4):
        s, t = roof[i], roof[(i + 1) % 4]
        b.beam(0, "fascia", (s[0], y_eave - 0.02, s[1]), (t[0], y_eave - 0.02, t[1]), 0.06, 0.08)
    upper = gnd + 3.35 if storeys == 2 else None
    openings_on(b, p0, p1, gnd, door=True, upper=upper)
    if storeys == 2:
        # Balcony the street photo shows on the upper floor, behind the wall.
        depth = 1.05
        yb = gnd + 3.2
        outer0 = (p0[0] - nx * depth, p0[1] - nz * depth)
        outer1 = (p1[0] - nx * depth, p1[1] - nz * depth)
        slab = [
            (p0[0], yb, p0[1]),
            (p1[0], yb, p1[1]),
            (outer1[0], yb, outer1[1]),
            (outer0[0], yb, outer0[1]),
        ]
        b.quad(0, "white", slab, (0, 1, 0))
        b.quad(0, "white", list(reversed(slab)), (0, -1, 0))
        b.beam(0, "fascia", (outer0[0], yb, outer0[1]), (outer1[0], yb, outer1[1]), 0.05, 0.08)
        npost = 11
        for i in range(npost + 1):
            t = i / npost
            px = outer0[0] + (outer1[0] - outer0[0]) * t
            pz = outer0[1] + (outer1[1] - outer0[1]) * t
            b.box(0, "white", px - 0.045, yb, pz - 0.045, px + 0.045, yb + 0.92, pz + 0.045)
        b.beam(
            0, "white",
            (outer0[0], yb + 0.9, outer0[1]),
            (outer1[0], yb + 0.9, outer1[1]),
            0.04, 0.04,
        )
        # Pool in the back yard. The satellite of this block shows them.
        px = hx + nx * (house_d + 4.2)
        pz = hz + nz * (house_d + 4.2)
        if coast.inside(bld["p"], px, pz):
            gy = coast.mesh_height(px, pz)
            b.box(0, "pool", px - 1.6, gy + 0.05, pz - 3.1, px + 1.6, gy + 0.18, pz + 3.1)
            b.box(1, "pool", px - 1.6, gy + 0.05, pz - 3.1, px + 1.6, gy + 0.16, pz + 3.1)
    else:
        # Narrow entry cover over the door, not a full-width porch.
        door = ((p0[0] + p1[0]) * 0.5, (p0[1] + p1[1]) * 0.5)
        cover = 1.35
        c0 = (door[0] - ux * 1.5 - nx * 0.05, door[1] - uz * 1.5 - nz * 0.05)
        c1 = (door[0] + ux * 1.5 - nx * 0.05, door[1] + uz * 1.5 - nz * 0.05)
        f0 = (c0[0] - nx * cover, c0[1] - nz * cover)
        f1 = (c1[0] - nx * cover, c1[1] - nz * cover)
        yb = gnd + 2.55
        slab = [(c0[0], yb, c0[1]), (c1[0], yb, c1[1]), (f1[0], yb - 0.08, f1[1]), (f0[0], yb - 0.08, f0[1])]
        b.quad(0, "white", slab, (0, 1, 0))
        for pxz in (f0, f1):
            b.box(0, "white", pxz[0] - 0.08, gnd, pxz[1] - 0.08, pxz[0] + 0.08, gnd + 2.48, pxz[1] + 0.08)
        # Condenser on the street wall, right of the pedestrian gate.
        ax = gx + ux * 1.7 - nx * 0.22
        az = gz + uz * 1.7 - nz * 0.22
        gy = coast.mesh_height(ax, az)
        b.box(0, "frame", ax - 0.28, gy + 0.55, az - 0.16, ax + 0.28, gy + 1.05, az + 0.16)
        # Dark plate where the photo shows the house number.
        b.box(0, "iron", gx + ux * 0.95, gy + 1.15, gz + uz * 0.95, gx + ux * 1.25, gy + 1.38, gz + uz * 1.25)

    # Shrubs just inside the bars, and the palms the photo puts on the right.
    for t in (0.12, 0.28, 0.62, 0.78, 0.9):
        sx = west[0] + dx * t + nx * 0.85
        sz = west[1] + dz * t + nz * 0.85
        add_shrub(b, sx, sz, 0.95 if role == "h31" else 0.8)
    if role == "h31":
        add_palm(b, p1[0] + ux * 1.6 - nx * 0.4, p1[1] + uz * 1.6 - nz * 0.4)
        add_palm(b, p1[0] + ux * 3.4 - nx * 1.6, p1[1] + uz * 3.4 - nz * 1.6)
        # SUV shows through the pedestrian gate. The pickup sits at the right end, cab above the verge.
        add_parked(b, gx + nx * 2.4, gz + nz * 2.4, (ux, uz), "suv", 4.3, 1.55)
        add_parked(b, east[0] - ux * 1.6 + nx * 2.2, east[1] - uz * 1.6 + nz * 2.2, (ux, uz), "truck", 4.6, 2.25)
    return mass, (nx, nz)


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
        if bld["k"] not in ("house", "yes", "residential", "detached", "apt", "small"):
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
    b.mat("tile", (0.78, 0.32, 0.14), 0.78)
    b.mat("frame", coast.FRAME_C, 0.62)
    b.mat("glass", coast.GLASS, 0.12)
    b.mat("shut", coast.SHUTTER, 0.7)
    b.mat("white", (0.94, 0.93, 0.90), 0.7)
    b.mat("fascia", (0.90, 0.88, 0.84), 0.66)
    b.mat("wood", (0.42, 0.30, 0.20), 0.72)
    b.mat("iron", (0.25, 0.26, 0.27), 0.5)
    b.mat("lamp", (0.93, 0.86, 0.62), 0.45)
    b.mat("trunk", coast.TRUNK, 0.9)
    b.mat("cact", coast.CACT, 0.8)
    b.mat("palm", (0.20, 0.40, 0.16), 0.8)
    b.mat("leafd", (0.14, 0.30, 0.13), 0.8)
    # Street photos of this block are warm stucco, with one whiter neighbour.
    stucco = (
        (0.90, 0.73, 0.50),
        (0.94, 0.91, 0.86),
        (0.86, 0.74, 0.56),
        (0.80, 0.66, 0.46),
        (0.92, 0.80, 0.60),
    )
    for i, rgb in enumerate(stucco):
        b.mat(f"w{i}", rgb, 0.84)
    b.mat("stucco", stucco[0], 0.84)
    b.mat("tan", (0.89, 0.70, 0.46), 0.86)
    b.mat("suv", (0.10, 0.10, 0.11), 0.55)
    b.mat("truck", (0.86, 0.86, 0.84), 0.6)
    b.mat("pool", (0.22, 0.62, 0.78), 0.25)
    b.mat("gravel", (0.74, 0.70, 0.60), 0.95)
    b.mat("shrub", (0.22, 0.42, 0.18), 0.85)

    hides = []
    houses = []
    for idx, (bld, pt, hit) in enumerate(chosen):
        poly = list(bld["p"])
        area = 0.0
        for i in range(len(poly)):
            a, c = poly[i], poly[(i + 1) % len(poly)]
            area += a[0] * c[1] - c[0] * a[1]
        if area < 0:
            poly = list(reversed(poly))
        best = None
        for i in range(len(poly)):
            a, c = poly[i], poly[(i + 1) % len(poly)]
            mx, mz = (a[0] + c[0]) * 0.5, (a[1] + c[1]) * 0.5
            d = closest(weg, mx, mz)
            if d and (best is None or d[0] < best[0]):
                best = (d[0], a, c)
        fitted = street_rect(poly, best[1], best[2]) if best and best[0] < 30 else None
        if fitted:
            rect, (ux, uz), (nx, nz), width, depth = fitted
            mass = rect
        else:
            mass = shrink_poly(poly, 0.08)
            ux = uz = nx = nz = None
            width = depth = 0.0
        role = lot_role(bld)
        if role:
            mass, inward = build_street_match(b, bld, role, weg)
            houses.append((bld, mass, inward))
            hides.append([round(pt[0], 1), round(pt[1], 1)])
            continue
        gnd = coast.mesh_height(sum(p[0] for p in mass) / len(mass), sum(p[1] for p in mass) / len(mass))
        two = (bld.get("h") or 0) >= 6.0
        wall_h = 5.35 if two else 3.05
        paint = f"w{idx % 5}"
        b.extrude(0, "coral", mass, gnd - 0.25, gnd + 0.42, top=False)
        b.extrude(0, paint, mass, gnd + 0.42, gnd + wall_h, top=True)
        b.extrude(1, paint, mass, gnd - 0.15, gnd + wall_h, top=True)
        roof = outset_rect(mass, 0.55, ux, uz, nx, nz) if fitted else mass
        y_eave = gnd + wall_h
        hip_roof(b, 0, "tile", roof, y_eave, roof_rise(mass))
        hip_roof(b, 1, "tile", mass, y_eave, roof_rise(mass) * 0.85, inner_k=0.28)
        for i in range(len(roof)):
            a, c = roof[i], roof[(i + 1) % len(roof)]
            b.beam(0, "fascia", (a[0], y_eave - 0.02, a[1]), (c[0], y_eave - 0.02, c[1]), 0.06, 0.09)
        upper = gnd + 3.35 if two else None
        if fitted:
            openings_on(b, mass[0], mass[1], gnd, door=True, upper=upper)
            openings_on(b, mass[1], mass[2], gnd, upper=upper)
            openings_on(b, mass[3], mass[2], gnd)
            openings_on(b, mass[0], mass[3], gnd)
            add_porch(b, mass, gnd, ux, uz, nx, nz, width)
        else:
            edges = []
            for i in range(len(mass)):
                a, c = mass[i], mass[(i + 1) % len(mass)]
                edges.append((math.hypot(c[0] - a[0], c[1] - a[1]), a, c))
            edges.sort(reverse=True)
            for _length, a, c in edges[:3]:
                openings_on(b, a, c, gnd, door=False, upper=upper)
        if best and best[0] < 30:
            a, c = best[1], best[2]
            dx, dz = c[0] - a[0], c[1] - a[1]
            span = math.hypot(dx, dz) or 1.0
            uxw, uzw = dx / span, dz / span
            wall_h = 1.55
            for seg in ((0.03, 0.38), (0.62, 0.97)):
                a1 = (a[0] + dx * seg[0], a[1] + dz * seg[0])
                a2 = (a[0] + dx * seg[1], a[1] + dz * seg[1])
                wall_run(b, a1, a2, paint, 0.16, wall_h)
                add_fence(b, a1, a2, wall_h)
            gx = a[0] + dx * 0.5
            gz = a[1] + dz * 0.5
            add_gate(b, gx, gz, (uxw, uzw), coast.mesh_height(gx, gz), paint)
            # Palm in the court, off the gate, the way the street photos show them.
            lcx = sum(p[0] for p in poly) / len(poly)
            lcz = sum(p[1] for p in poly) / len(poly)
            il = math.hypot(lcx - gx, lcz - gz) or 1.0
            inx, inz = (lcx - gx) / il, (lcz - gz) / il
            px = gx + uxw * 4.4 + inx * 2.4
            pz = gz + uzw * 4.4 + inz * 2.4
            if coast.inside(poly, px, pz) and not coast.inside(mass, px, pz):
                add_palm(b, px, pz)
        houses.append((bld, mass, fitted[2] if fitted else None))
        hides.append([round(pt[0], 1), round(pt[1], 1)])

    plants = lamps = 0
    for i, (bld, mass, inward) in enumerate(houses):
        cx = sum(p[0] for p in mass) / len(mass)
        cz = sum(p[1] for p in mass) / len(mass)
        spot = None
        if inward is not None:
            nx, nz = inward
            for dist in (4.2, 6.5, 8.5, 2.4):
                for side in (1.0, -1.0, 0.0):
                    # Perpendicular to the inward axis, behind the house.
                    px = cx + nx * dist + nz * side * 3.2
                    pz = cz + nz * dist - nx * side * 3.2
                    if coast.inside(bld["p"], px, pz) and not coast.inside(mass, px, pz):
                        spot = (px, pz)
                        break
                if spot:
                    break
        if spot is None:
            continue
        kind = i % 3
        if kind == 0:
            add_palm(b, spot[0], spot[1])
        elif kind == 1:
            add_divi_tree(b, spot[0], spot[1], math.atan2(inward[1], inward[0]) if inward else 0.4)
        else:
            add_kadushi(b, spot[0], spot[1])
        plants += 1
        if lamps >= 4 or not idx_ok(bld) or inward is None:
            continue
        nx, nz = inward
        lx = cx - nx * 6.5
        lz = cz - nz * 6.5
        if closest(weg, lx, lz)[0] > 2.6 and not on_any(chosen, lx, lz):
            g = coast.mesh_height(lx, lz)
            b.cyl(0, "iron", lx, g, lz, 0.05, g + 3.15, 0.04, 6)
            b.box(0, "lamp", lx - 0.18, g + 3.0, lz - 0.1, lx + 0.18, g + 3.16, lz + 0.1)
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
            "Middle of Malmokweg (houses 12-37), inland of the west-end row and short of "
            "Caya Frans Figaroa. Street front follows the July 2022 photo at 12.60061, -70.04489 "
            "(https://www.google.com/maps/@12.6006127,-70.0448912,3a,75y,350h,90t/data=!3m6!1e1!3m4!1sCIHM0ogKEICAgIDOq-GThgE!2e0!7i16384!8i8192) "
            "and the satellite of this block "
            "(https://www.google.com/maps/@12.60055,-70.0449,131m/data=!3m1!1e3): "
            "warm stucco, red hip tile, a tall wall with iron bars, a pedestrian gate, "
            "a white two-storey with a balcony and a vehicle gate on the west, "
            "palms, shrubs, a pool, and cars in the courts. "
            "Malmokweg 25 and 27 sit in the slice "
            "(https://remaxaruba.com/property/details/malmokweg-25). "
            "Original geometry, no photos in the mesh."
        ),
        "frame": "glb origin = footprint centroid (world x,z); glTF +X = world x, +Z = world z, Y up; generated by tools/nw_malmokweg_east.py",
        "cat": "landmark",
    }


def rewrite_entry(obj):
    """Replace the existing hero object. Do not rewrite the rest of the file."""
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
    if ids.count(HERO_ID) != 1:
        raise SystemExit("rewrite duplicated or dropped the hero")
    if [o.get("id") for o in json.loads(text)] != ids:
        raise SystemExit("rewrite changed hero order")
    open(MANIFEST, "w").write(new)
    print(f"updated {HERO_ID}")


def main():
    ox, oz, y0, tris, hides = build()
    rewrite_entry(entry(ox, oz, y0, tris, hides))


if __name__ == "__main__":
    main()
