#!/usr/bin/env python3
"""Pastel colonial fronts for three Oranjestad places.

Replaces the existing heroes in place (no second row on top of them):

- ora_wilhelm: Wilhelminastraat shop row, including the sage porch house
  beside blue Que Pasa (Wilhelminastraat 24).
- cityhall: lime Ecury house / Stadhuis, white neck gable and balcony.
- ora_haven: Havenstraat shop row with shutters, galleries and name boards.

Photos are reference only, never textures. Interiors are not modelled.
The 1846 church, other landmarks, pedestrians and vehicles stay as they are.
"""
from __future__ import annotations

import json
import math
import struct
from pathlib import Path

from build_batch2 import chain_lines, load_named
from build_downtown import (
    GLASS,
    TERRACOTTA,
    Atlas,
    Glb,
    Prim,
    box,
    centroid,
    cyl,
    extrude_walls,
    face_yaw,
    hash01,
    height_at,
    parapet,
    point_in,
    poly_area,
    shop_name,
    street_edge,
    yaw_quat,
)
from build_streetlevel import build_wilhelm, load_cars, paint_signs

ROOT = Path("/workspace")
HERO = ROOT / "game/models/hero"
MANIFEST = ROOT / "game/data/hero/manifest.json"
REAL = ROOT / "game/data/real"
ROAD_FILES = ("r_3_11.json", "r_3_12.json", "r_4_11.json", "r_4_12.json")

# Saturated enough to stay coloured under the Caribbean sun. Pale creams wash out.
SAGE = (0.32, 0.50, 0.30)
LIME = (0.34, 0.56, 0.28)
BLUE = (0.18, 0.30, 0.58)
TRIM = (0.93, 0.91, 0.86)
WOOD = (0.34, 0.18, 0.10)
SHUTTER = (0.16, 0.32, 0.22)
PASTELS = [
    (0.74, 0.36, 0.46),
    (0.82, 0.62, 0.18),
    (0.76, 0.44, 0.26),
    (0.28, 0.44, 0.60),
    (0.68, 0.46, 0.20),
    (0.42, 0.54, 0.34),
    (0.58, 0.32, 0.40),
    (0.34, 0.46, 0.52),
]
PINS = (
    ("que pasa", BLUE),
    ("paris", (0.62, 0.18, 0.20)),
    ("cosecha", (0.80, 0.60, 0.16)),
    ("liquid", (0.78, 0.40, 0.20)),
    ("kok", (0.74, 0.64, 0.46)),
    ("forever", (0.76, 0.40, 0.52)),
    ("drugstore", (0.80, 0.58, 0.16)),
    ("shark", (0.20, 0.40, 0.55)),
    ("jewel", (0.66, 0.30, 0.36)),
    ("stop", (0.76, 0.46, 0.22)),
    ("jasmine", (0.52, 0.36, 0.58)),
    ("manolo", (0.36, 0.50, 0.38)),
    ("gelat", (0.78, 0.40, 0.48)),
    ("anno", (0.70, 0.48, 0.20)),
    ("barber", (0.22, 0.40, 0.48)),
    ("parking", (0.78, 0.58, 0.22)),
    ("mini", (0.72, 0.50, 0.24)),
)
NOTE = (
    "Visitor photos used as colour reference only, not textures: "
    "Wilhelminastraat 24 sage porch, white columns and brown shutters beside blue Que Pasa; "
    "lime City Hall (Ecury house) with a white neck gable; "
    "Havenstraat pastel shop row with shutters and galleries."
)


def chain(name, box):
    x0, x1, z0, z1 = box
    raw = load_named((name,), ROAD_FILES)
    clipped = []
    for ln in raw:
        pts = [p for p in ln if x0 - 40 <= p[0] <= x1 + 40 and z0 - 40 <= p[1] <= z1 + 40]
        if len(pts) >= 2:
            clipped.append(pts)
    return chain_lines(clipped, gap=20) if clipped else []


def board_name(name):
    low = (name or "").lower()
    if "que pasa" in low:
        return "QUE PASA"
    if "forever" in low:
        return "ARUBA FOREVER"
    if "paris" in low:
        return "PARIS"
    if "anno" in low:
        return "ANNO 1877"
    if "drugstore" in low:
        return "DRUGSTORE"
    return (name or "").strip()


def pin_color(name, index):
    low = (name or "").lower()
    for key, col in PINS:
        if key in low:
            return col
    return PASTELS[int(hash01(index or 1, 5) * len(PASTELS)) % len(PASTELS)]


def buildings_from_hide(hide, buildings, road, landmarks):
    out = []
    seen = set()
    for p in hide:
        b = next((b for b in buildings if point_in(b["poly"], p[0], p[1])), None)
        if b is None or id(b) in seen:
            continue
        edge = street_edge(b["poly"], road)
        if edge is None or edge[4] < 3.5:
            continue
        seen.add(id(b))
        name = shop_name(b, landmarks)
        row = dict(b)
        row["edge"] = edge
        row["sign_name"] = board_name(name)
        row["color"] = pin_color(name, b.get("i") or len(out))
        row["gable"] = len(out) % 3
        row["gable_scale"] = 0.52
        row["rise"] = 1.25
        row["balcony"] = False
        row["porch"] = False
        row["gallery"] = False
        row["shutter"] = SHUTTER
        out.append(row)
    return out


def mark_wilhelm(rows):
    pasa = next((b for b in rows if "que pasa" in (b.get("n") or "").lower() or b["sign_name"] == "QUE PASA"), None)
    if pasa is None:
        return
    pasa["color"] = BLUE
    pasa["balcony"] = True
    pasa["gable"] = 2
    pasa["gable_scale"] = 0.22
    pasa["rise"] = 1.7
    pasa["sign_name"] = "QUE PASA"
    outward = pasa["edge"][5]
    same = [
        b
        for b in rows
        if b is not pasa and outward[0] * b["edge"][5][0] + outward[1] * b["edge"][5][1] > 0.45
    ]
    if not same:
        return
    sage = min(same, key=lambda b: math.hypot(b["c"][0] - pasa["c"][0], b["c"][1] - pasa["c"][1]))
    # Wilhelminastraat 24, the sage porch beside Que Pasa. It is a house, not a billboard.
    sage["color"] = SAGE
    sage["porch"] = True
    sage["balcony"] = True
    sage["gable"] = 1
    sage["gable_scale"] = 0.46
    sage["rise"] = 0.7
    sage["sign_name"] = ""
    sage["shutter"] = WOOD
    for i, b in enumerate(rows):
        if b is pasa or b is sage:
            continue
        if i % 3 == 0 and b["edge"][4] > 8:
            b["balcony"] = True


def mark_haven(rows):
    for b in rows:
        if b["edge"][4] >= 8.5:
            b["gallery"] = True
            b["balcony"] = False


def quad_facing(prim, pts, color, outward, uvs=None):
    n = Prim._n(pts[0], pts[1], pts[2])
    if n is None:
        return
    if n[0] * outward[0] + n[2] * outward[1] < 0:
        pts = (pts[1], pts[0], pts[3], pts[2])
        if uvs:
            uvs = (uvs[1], uvs[0], uvs[3], uvs[2])
    prim.quad(*pts, color, uvs)


def oriented_box(prim, cx, cy, cz, sx, sy, sz, ax, az, ox, oz, color):
    hx, hy, hz = sx / 2, sy / 2, sz / 2

    def P(u, v, w):
        return (cx + ax * u + ox * w, cy + v, cz + az * u + oz * w)

    faces = [
        ((hx, -hy, hz), (-hx, -hy, hz), (-hx, hy, hz), (hx, hy, hz)),
        ((-hx, -hy, -hz), (hx, -hy, -hz), (hx, hy, -hz), (-hx, hy, -hz)),
        ((hx, -hy, -hz), (hx, -hy, hz), (hx, hy, hz), (hx, hy, -hz)),
        ((-hx, -hy, hz), (-hx, -hy, -hz), (-hx, hy, -hz), (-hx, hy, hz)),
        ((-hx, hy, -hz), (hx, hy, -hz), (hx, hy, hz), (-hx, hy, hz)),
        ((-hx, -hy, hz), (hx, -hy, hz), (hx, -hy, -hz), (-hx, -hy, -hz)),
    ]
    center = (cx, cy, cz)
    for face in faces:
        pts = tuple(P(*p) for p in face)
        n = Prim._n(*pts[:3])
        if n is None:
            continue
        mid = tuple(sum(p[k] for p in pts) / 4 for k in range(3))
        if sum(n[k] * (mid[k] - center[k]) for k in range(3)) < 0:
            pts = (pts[0], pts[3], pts[2], pts[1])
        prim.quad(*pts, color)


def edge_frame(edge):
    _s, _i, a, bb, length, outward, _d = edge
    nx, nz = outward
    tx, tz = (bb[0] - a[0]) / length, (bb[1] - a[1]) / length
    return a, bb, length, nx, nz, tx, tz


def P_edge(a, tx, tz, nx, nz, ox, oz, t, depth, y):
    return (a[0] + tx * t + nx * depth - ox, y, a[1] + tz * t + nz * depth - oz)


def band_poly(prim, poly, y0, y1, color, origin, h0, push=0.06):
    ccw = poly_area(poly) > 0
    ox, oz = origin
    for i in range(len(poly)):
        a, b = poly[i], poly[(i + 1) % len(poly)]
        dx, dz = b[0] - a[0], b[1] - a[1]
        length = math.hypot(dx, dz)
        if length < 0.5:
            continue
        outward = (dz / length, -dx / length) if ccw else (-dz / length, dx / length)

        def P(p, y):
            return (p[0] + outward[0] * push - ox, y - h0, p[1] + outward[1] * push - oz)

        p0, p1, p2, p3 = P(a, y0), P(b, y0), P(b, y1), P(a, y1)
        quad_facing(prim, (p0, p1, p2, p3), color, outward)


def roof_fan(prim, poly, roof_y, color, origin, h0, rise):
    c = centroid(poly)
    ox, oz = origin
    for i in range(len(poly)):
        p, q = poly[i], poly[(i + 1) % len(poly)]
        mx, mz = (c[0] + p[0] + q[0]) / 3, (c[1] + p[1] + q[1]) / 3
        if not point_in(poly, mx, mz):
            continue
        peak = (c[0] - ox, roof_y + rise, c[1] - oz)
        e0 = (p[0] - ox, roof_y, p[1] - oz)
        e1 = (q[0] - ox, roof_y, q[1] - oz)
        ux, uz = e1[0] - peak[0], e1[2] - peak[2]
        vx, vz = e0[0] - peak[0], e0[2] - peak[2]
        if uz * vx - ux * vz >= 0:
            prim.tri(peak, e1, e0, color)
        else:
            prim.tri(peak, e0, e1, color)


def shutter_proto(leaf):
    prim = Prim()
    w, h, d = 0.92, 1.22, 0.08
    box(prim, 0, 0, 0, w, h, d, TRIM)
    prim.quad(
        (-w * 0.30, -h * 0.32, d * 0.55),
        (w * 0.30, -h * 0.32, d * 0.55),
        (w * 0.30, h * 0.32, d * 0.55),
        (-w * 0.30, h * 0.32, d * 0.55),
        GLASS,
    )
    box(prim, -w * 0.58, 0, 0.02, 0.18, h * 0.92, 0.05, leaf)
    box(prim, w * 0.58, 0, 0.02, 0.18, h * 0.92, 0.05, leaf)
    return prim


def arch_proto():
    prim = Prim()
    w, h, d = 0.78, 1.7, 0.1
    box(prim, 0, -0.12, 0, w, h * 0.78, d, TRIM)
    box(prim, 0, h * 0.28, 0, w * 0.72, h * 0.22, d, TRIM)
    prim.quad(
        (-w * 0.26, -h * 0.42, d * 0.55),
        (w * 0.26, -h * 0.42, d * 0.55),
        (w * 0.26, h * 0.08, d * 0.55),
        (-w * 0.26, h * 0.08, d * 0.55),
        GLASS,
    )
    prim.tri(
        (-w * 0.22, h * 0.08, d * 0.55),
        (w * 0.22, h * 0.08, d * 0.55),
        (0, h * 0.36, d * 0.55),
        GLASS,
    )
    return prim


def balustrade(prim, edge, y, depth, origin, h0, margin, gap, post_h, color):
    a, _bb, length, nx, nz, tx, tz = edge_frame(edge)
    ox, oz = origin
    span = length - 2 * margin
    if span < 1.2:
        return
    n = max(3, min(18, int(span / gap)))
    for k in range(n + 1):
        t = margin + span * k / n
        px, py, pz = P_edge(a, tx, tz, nx, nz, ox, oz, t, depth, y + post_h * 0.5)
        oriented_box(prim, px, py, pz, 0.08, post_h, 0.08, tx, tz, nx, nz, color)
    cy = y + post_h - 0.06
    tmid = length * 0.5
    px, py, pz = P_edge(a, tx, tz, nx, nz, ox, oz, tmid, depth, cy)
    oriented_box(prim, px, py, pz, span, 0.1, 0.1, tx, tz, nx, nz, color)


def add_sign(signs, edge, y0, y1, origin, h0, uv, bias=0.5):
    a, _bb, length, nx, nz, tx, tz = edge_frame(edge)
    ox, oz = origin
    sw = min(length * 0.46, 6.2)
    if sw < 1.8 or not uv:
        return
    m = max(0.35, min(length - sw - 0.35, length * bias - sw / 2))
    s0 = P_edge(a, tx, tz, nx, nz, ox, oz, m, 0.2, y0)
    s1 = P_edge(a, tx, tz, nx, nz, ox, oz, m + sw, 0.2, y0)
    s2 = P_edge(a, tx, tz, nx, nz, ox, oz, m + sw, 0.2, y1)
    s3 = P_edge(a, tx, tz, nx, nz, ox, oz, m, 0.2, y1)
    u0, v0, u1, v1 = uv
    quad_facing(signs, (s0, s1, s2, s3), TRIM, (nx, nz), ((u0, v0), (u1, v0), (u1, v1), (u0, v1)))


def add_door(prim, edge, ground, origin, h0, t, color=WOOD):
    a, _bb, length, nx, nz, tx, tz = edge_frame(edge)
    ox, oz = origin
    dw = min(1.05, length * 0.16)
    y0 = ground - h0
    y1 = ground + 2.25 - h0
    d0 = P_edge(a, tx, tz, nx, nz, ox, oz, t, 0.12, y0)
    d1 = P_edge(a, tx, tz, nx, nz, ox, oz, t + dw, 0.12, y0)
    d2 = P_edge(a, tx, tz, nx, nz, ox, oz, t + dw, 0.12, y1)
    d3 = P_edge(a, tx, tz, nx, nz, ox, oz, t, 0.12, y1)
    quad_facing(prim, (d0, d1, d2, d3), color, (nx, nz))


def add_windows(bucket, edge, ground, origin, h0, levels, every, scale):
    a, _bb, length, nx, nz, tx, tz = edge_frame(edge)
    ox, oz = origin
    nwin = max(1, min(6, int(length / every)))
    yaw = yaw_quat(face_yaw(nx, nz))
    for level in levels:
        for k in range(nwin):
            t = (k + 1) / (nwin + 1) * length
            # Keep clear of a door parked at the left end.
            if t < 1.5:
                continue
            px, py, pz = P_edge(a, tx, tz, nx, nz, ox, oz, t, 0.14, ground + level - h0)
            bucket.append(((px, py, pz), yaw, scale))


def tile_lip(prim, edge, eave, origin, h0):
    """Short terracotta overhang so a tile roof reads from the sidewalk."""
    a, _bb, length, nx, nz, tx, tz = edge_frame(edge)
    ox, oz = origin
    y = eave - h0
    margin = min(0.4, length * 0.04)
    p0 = P_edge(a, tx, tz, nx, nz, ox, oz, margin, 0.16, y - 0.02)
    p1 = P_edge(a, tx, tz, nx, nz, ox, oz, length - margin, 0.16, y - 0.02)
    p2 = P_edge(a, tx, tz, nx, nz, ox, oz, length - margin, 0.9, y - 0.55)
    p3 = P_edge(a, tx, tz, nx, nz, ox, oz, margin, 0.9, y - 0.55)
    quad_facing(prim, (p0, p1, p2, p3), TERRACOTTA, (nx, nz))


def add_pilasters(prim, edge, ground, eave, origin, h0):
    a, _bb, length, nx, nz, tx, tz = edge_frame(edge)
    ox, oz = origin
    hy = (eave - ground) * 0.5
    cy = ground + hy - h0
    for t in (0.04 * length, 0.96 * length):
        px, py, pz = P_edge(a, tx, tz, nx, nz, ox, oz, t, 0.16, cy)
        oriented_box(prim, px, py, pz, 0.32, eave - ground, 0.22, tx, tz, nx, nz, TRIM)


def add_balcony(prim, edge, ground, origin, h0, porch):
    a, _bb, length, nx, nz, tx, tz = edge_frame(edge)
    ox, oz = origin
    y = ground + 3.28 - h0
    depth = 1.2 if porch else 1.0
    margin = min(0.8, length * 0.08)
    span = length - 2 * margin
    tmid = length * 0.5
    px, py, pz = P_edge(a, tx, tz, nx, nz, ox, oz, tmid, depth * 0.55, y)
    oriented_box(prim, px, py, pz, span, 0.12, depth, tx, tz, nx, nz, TRIM)
    balustrade(prim, edge, y + 0.06, depth, origin, h0, margin, 0.48 if porch else 0.62, 0.72, TRIM)
    if porch:
        cols = 2 if length < 12 else 3
        for k in range(cols):
            t = margin + span * (k + 0.5) / cols
            cx, _cy, cz = P_edge(a, tx, tz, nx, nz, ox, oz, t, depth * 0.55, 0)
            cyl(prim, cx, ground - h0, cz, 0.18, y - (ground - h0), TRIM, seg=8)
        # Street fence in front of the porch, the white rail in the 2025 photo.
        fence_y = ground - h0
        balustrade(prim, edge, fence_y + 0.15, depth + 0.55, origin, h0, margin, 0.42, 0.78, TRIM)


def add_porch_crown(prim, edge, ground, eave, origin, h0):
    """Roof balustrade on the sage house."""
    balustrade(prim, edge, eave - h0 + 0.05, 0.28, origin, h0, edge[4] * 0.08, 0.55, 0.58, TRIM)


def add_gallery(prim, edge, ground, origin, h0):
    a, _bb, length, nx, nz, tx, tz = edge_frame(edge)
    ox, oz = origin
    y = ground + 3.15 - h0
    margin = 0.7
    span = length - 2 * margin
    n = max(2, min(8, int(span / 2.3)))
    for k in range(n + 1):
        t = margin + span * k / n
        cx, _cy, cz = P_edge(a, tx, tz, nx, nz, ox, oz, t, 1.05, 0)
        cyl(prim, cx, ground - h0, cz, 0.12, y - (ground - h0), TRIM, seg=6)
    tmid = length * 0.5
    px, py, pz = P_edge(a, tx, tz, nx, nz, ox, oz, tmid, 1.05, y)
    oriented_box(prim, px, py, pz, span + 0.4, 0.16, 0.28, tx, tz, nx, nz, TRIM)


def dress_row(gid, rows, atlas):
    ox = sum(b["c"][0] for b in rows) / len(rows)
    oz = sum(b["c"][1] for b in rows) / len(rows)
    h0 = height_at(ox, oz)
    origin_xz = (ox, oz)
    paint, signs = Prim(), Prim()
    lod = Prim()
    wood_win, green_win = [], []
    for b in rows:
        ground = height_at(*b["c"])
        eave = ground + 6.5
        extrude_walls(paint, b["poly"], ground, eave, b["color"], origin_xz, h0)
        roof_fan(paint, b["poly"], eave - h0 - 0.02, TERRACOTTA, origin_xz, h0, b.get("rise", 1.25))
        _s, _i, a, bb, _L, outward, _d = b["edge"]
        parapet(paint, a, bb, outward, eave, b["color"], TRIM, origin_xz, h0, b["gable"], scale=b["gable_scale"])
        if b.get("rise", 1) > 1.4:
            tile_lip(paint, b["edge"], eave, origin_xz, h0)
        band_poly(paint, b["poly"], ground, ground + 0.32, TRIM, origin_xz, h0)
        band_poly(paint, b["poly"], ground + 3.12, ground + 3.28, TRIM, origin_xz, h0, 0.07)
        band_poly(paint, b["poly"], eave - 0.08, eave + 0.16, TRIM, origin_xz, h0, 0.08)
        add_pilasters(paint, b["edge"], ground, eave, origin_xz, h0)
        if b["porch"]:
            add_door(paint, b["edge"], ground, origin_xz, h0, b["edge"][4] * 0.22)
            add_door(paint, b["edge"], ground, origin_xz, h0, b["edge"][4] * 0.62)
            add_windows(wood_win, b["edge"], ground, origin_xz, h0, (4.85,), 2.4, (0.95, 1.15, 1))
            add_balcony(paint, b["edge"], ground, origin_xz, h0, True)
            add_porch_crown(paint, b["edge"], ground, eave, origin_xz, h0)
        else:
            add_door(paint, b["edge"], ground, origin_xz, h0, 0.4)
            bucket = wood_win if b["shutter"] == WOOD else green_win
            add_windows(bucket, b["edge"], ground, origin_xz, h0, (1.7, 4.85), 2.8, (1, 1, 1))
            if b["balcony"]:
                add_balcony(paint, b["edge"], ground, origin_xz, h0, False)
            if b["gallery"]:
                add_gallery(paint, b["edge"], ground, origin_xz, h0)
        if b["sign_name"]:
            uv = atlas.add_shop(b["sign_name"][:22])
            if b["gallery"]:
                y0 = ground + 3.85 - h0
            elif b["balcony"] or b["porch"]:
                y0 = ground + 2.35 - h0
            else:
                y0 = ground + 3.42 - h0
            add_sign(signs, b["edge"], y0, y0 + 0.68, origin_xz, h0, uv)
        ccw = poly_area(b["poly"]) > 0
        y1 = ground + 7.1
        for i in range(len(b["poly"])):
            p, q = b["poly"][i], b["poly"][(i + 1) % len(b["poly"])]
            if math.hypot(p[0] - q[0], p[1] - q[1]) < 0.4:
                continue
            A = (p[0] - ox, ground - h0, p[1] - oz)
            B = (q[0] - ox, ground - h0, q[1] - oz)
            C = (q[0] - ox, y1 - h0, q[1] - oz)
            D = (p[0] - ox, y1 - h0, p[1] - oz)
            if ccw:
                lod.quad(B, A, D, C, b["color"])
            else:
                lod.quad(A, B, C, D, b["color"])
    glb = Glb(gid)
    glb.mat("paint", rough=0.84)
    glb.images.append((atlas.png(), "image/png"))
    glb.mat("sign", rough=0.55, tex=0, double=True)
    glb.add(paint, "paint")
    glb.add(signs, "sign")
    if wood_win:
        glb.add_instances(shutter_proto(WOOD), "paint", wood_win)
    if green_win:
        glb.add_instances(shutter_proto(SHUTTER), "paint", green_win)
    glb.lod1_prim = lod
    return glb, (ox, oz, h0)


def paint_clock(atlas):
    d = atlas.draw
    x, y, s = 8, 8, 240
    d.ellipse((x, y, x + s, y + s), fill=(248, 246, 240), outline=(28, 22, 18), width=14)
    cx, cy, r = x + s / 2, y + s / 2, s * 0.36
    for i in range(12):
        ang = -math.pi / 2 + i * math.tau / 12
        inner = 0.78 if i % 3 == 0 else 0.88
        d.line(
            (cx + math.cos(ang) * r * inner, cy + math.sin(ang) * r * inner, cx + math.cos(ang) * r, cy + math.sin(ang) * r),
            fill=(28, 22, 18),
            width=6 if i % 3 == 0 else 3,
        )
    d.ellipse((cx - 7, cy - 7, cx + 7, cy + 7), fill=(28, 22, 18))
    return atlas._uv(x, y, s, s)


def dress_cityhall(poly, origin, atlas):
    ox, oz, h0 = origin
    paint, signs = Prim(), Prim()
    ground = height_at(ox, oz)
    eave = ground + 8.05
    extrude_walls(paint, poly, ground, eave, LIME, (ox, oz), h0)
    roof_fan(paint, poly, eave - h0 + 0.02, TERRACOTTA, (ox, oz), h0, 0.55)
    band_poly(paint, poly, ground, ground + 0.45, TRIM, (ox, oz), h0, 0.08)
    band_poly(paint, poly, ground + 3.55, ground + 3.75, TRIM, (ox, oz), h0, 0.08)
    band_poly(paint, poly, eave - 0.1, eave + 0.35, TRIM, (ox, oz), h0, 0.1)
    road = chain("Wilhelminastraat", (-7320, -6900, 55, 195))
    edge = street_edge(poly, road)
    _s, _i, a, bb, length, outward, _d = edge
    # White ornamental neck gable, the Ecury / Stadhuis silhouette.
    parapet(paint, a, bb, outward, eave, TRIM, LIME, (ox, oz), h0, 1, scale=0.72)
    add_pilasters(paint, edge, ground, eave, (ox, oz), h0)
    add_balcony(paint, edge, ground, (ox, oz), h0, False)
    add_door(paint, edge, ground, (ox, oz), h0, length * 0.42)
    windows = []
    add_windows(windows, edge, ground, (ox, oz), h0, (1.85, 6.15), 3.1, (1.25, 1.25, 1))
    # side bays
    ccw = poly_area(poly) > 0
    for i in range(len(poly)):
        p, q = poly[i], poly[(i + 1) % len(poly)]
        if abs(p[0] - a[0]) < 0.25 and abs(p[1] - a[1]) < 0.25:
            continue
        dx, dz = q[0] - p[0], q[1] - p[1]
        sl = math.hypot(dx, dz)
        if sl < 4:
            continue
        outward_s = (dz / sl, -dx / sl) if ccw else (-dz / sl, dx / sl)
        add_windows(windows, (0, 0, p, q, sl, outward_s, 0), ground, (ox, oz), h0, (2.2, 5.4), 4.0, (1.05, 1.2, 1))
    uv = atlas.add_shop("STADHUIS")
    add_sign(signs, edge, ground + 2.45 - h0, ground + 3.05 - h0, (ox, oz), h0, uv, bias=0.5)
    clock = paint_clock(atlas)
    a0, _bb, length, nx, nz, tx, tz = edge_frame(edge)
    c0 = P_edge(a0, tx, tz, nx, nz, ox, oz, length * 0.5 - 0.7, 0.28, eave + 1.15 - h0)
    c1 = P_edge(a0, tx, tz, nx, nz, ox, oz, length * 0.5 + 0.7, 0.28, eave + 1.15 - h0)
    c2 = P_edge(a0, tx, tz, nx, nz, ox, oz, length * 0.5 + 0.7, 0.28, eave + 2.55 - h0)
    c3 = P_edge(a0, tx, tz, nx, nz, ox, oz, length * 0.5 - 0.7, 0.28, eave + 2.55 - h0)
    u0, v0, u1, v1 = clock
    quad_facing(signs, (c0, c1, c2, c3), TRIM, (nx, nz), ((u0, v0), (u1, v0), (u1, v1), (u0, v1)))
    lod = Prim()
    xs = [p[0] for p in poly]
    zs = [p[1] for p in poly]
    box(
        lod,
        (max(xs) + min(xs)) / 2 - ox,
        (eave - ground) * 0.5,
        (max(zs) + min(zs)) / 2 - oz,
        max(6, max(xs) - min(xs)),
        eave - ground,
        max(6, max(zs) - min(zs)),
        LIME,
    )
    glb = Glb("cityhall")
    glb.mat("paint", rough=0.82)
    glb.images.append((atlas.png(), "image/png"))
    glb.mat("sign", rough=0.5, tex=0, double=True)
    glb.add(paint, "paint")
    glb.add(signs, "sign")
    glb.add_instances(arch_proto(), "paint", windows)
    glb.lod1_prim = lod
    return glb, edge


def write_glb(glb, gid):
    data, tris = glb.pack()
    path = HERO / f"{gid}.glb"
    path.write_bytes(data)
    print(f"{gid}: {path.stat().st_size / 1024:.0f} KB lod0={tris[0]} lod1={tris[1]}")
    return tris


def audit(path):
    data = Path(path).read_bytes()
    n = struct.unpack_from("<I", data, 12)[0]
    gltf = json.loads(data[20 : 20 + n])
    blob = data[20 + n + 8 :]
    names = [nd.get("name") for nd in gltf["nodes"] if nd.get("name")]
    views, accs = gltf["bufferViews"], gltf["accessors"]
    bad = 0
    for mesh in gltf["meshes"]:
        for prim in mesh["primitives"]:
            pa, ia = accs[prim["attributes"]["POSITION"]], accs[prim["indices"]]
            pv, iv = views[pa["bufferView"]], views[ia["bufferView"]]
            stride = pv.get("byteStride", 12)
            pos = [struct.unpack_from("<fff", blob, pv["byteOffset"] + i * stride) for i in range(pa["count"])]
            comp = 4 if accs[prim["indices"]]["componentType"] == 5125 else 2
            fmt = "<I" if comp == 4 else "<H"
            idx = [struct.unpack_from(fmt, blob, iv["byteOffset"] + i * comp)[0] for i in range(ia["count"])]
            for t in range(0, len(idx), 3):
                a, b, c = (pos[idx[t + k]] for k in range(3))
                ux, uy, uz = b[0] - a[0], b[1] - a[1], b[2] - a[2]
                vx, vy, vz = c[0] - a[0], c[1] - a[1], c[2] - a[2]
                nx, ny, nz = uy * vz - uz * vy, uz * vx - ux * vz, ux * vy - uy * vx
                if nx * nx + ny * ny + nz * nz < 1e-12:
                    bad += 1
    print(f"  audit {Path(path).name}: nodes={names} zero-area {bad}")
    return bad


def patch(entry, tris, textures):
    gid = entry["id"]
    entry["status"] = "v7-pastel"
    entry["tris"] = {f"{gid}_lod0": tris[0], f"{gid}_lod1": tris[1]}
    entry["textures"] = textures
    ref = entry.get("ref_sources") or ""
    if gid != "ora_wilfurn" and "sage porch" not in ref:
        entry["ref_sources"] = (ref.rstrip(".") + ". " + NOTE).strip()
    if gid == "ora_wilfurn":
        entry["frame"] = (
            "glb origin = a point on the dressed street (world x,z); glTF +X = world x, +Z = world z, Y up; "
            "generated by tools/oranjestad/build_streetlevel.py"
        )
    else:
        entry["frame"] = (
            "glb origin = placement point (world x,z); glTF +X = world x, +Z = world z, Y up; "
            "local Y = world Y - terrain height at the origin; generated by tools/oranjestad/build_facades.py"
        )


def main():
    buildings = json_buildings()
    landmarks = json.loads((REAL / "landmarks.json").read_text())
    man = json.loads(MANIFEST.read_text())
    by_id = {e["id"]: e for e in man}
    wil_road = chain("Wilhelminastraat", (-7320, -6900, 55, 195))
    hav_road = chain("Havenstraat", (-7620, -7260, -110, 90))
    print("roads", len(wil_road), len(hav_road))
    wil = buildings_from_hide(by_id["ora_wilhelm"]["hide"], buildings, wil_road, landmarks)
    hav = buildings_from_hide(by_id["ora_haven"]["hide"], buildings, hav_road, landmarks)
    mark_wilhelm(wil)
    mark_haven(hav)
    for label, rows in (("wilhelm", wil), ("haven", hav)):
        print(label, [(b["sign_name"] or b["color"], "porch" if b["porch"] else "", "gal" if b["gallery"] else "") for b in rows])
    results = {}
    for gid, rows in (("ora_wilhelm", wil), ("ora_haven", hav)):
        atlas = Atlas(size=1024)
        glb, _origin = dress_row(gid, rows, atlas)
        results[gid] = (write_glb(glb, gid), 1)
    hall_entry = by_id["cityhall"]
    poly = [(p[0], p[1]) for p in hall_entry["hide_footprint"]]
    origin = (hall_entry["x"], hall_entry["z"], height_at(hall_entry["x"], hall_entry["z"]))
    atlas = Atlas(size=1024)
    glb, edge = dress_cityhall(poly, origin, atlas)
    results["cityhall"] = (write_glb(glb, "cityhall"), 1)
    mid = ((edge[2][0] + edge[3][0]) / 2, (edge[2][1] + edge[3][1]) / 2)
    print(f"cityhall front mid ({mid[0]:.0f},{mid[1]:.0f}) out ({edge[5][0]:+.2f},{edge[5][1]:+.2f})")

    # Drop the colour bands that used to repaint these walls from the sidewalk hero.
    png, cells, S = paint_signs()
    cars = load_cars()
    o_wil = (-7120.0, 120.0, height_at(-7120.0, 120.0))
    furn = build_wilhelm(buildings, cars, o_wil, png, cells, S)
    g = furn[0]
    results["ora_wilfurn"] = (write_glb(g, "ora_wilfurn"), len(g.images))

    for gid, (tris, textures) in results.items():
        patch(by_id[gid], tris, textures)
    by_id["ora_wilfurn"]["name"] = "Wilhelminastraat sidewalks, curbs, lamps and parked cars"
    by_id["ora_wilfurn"]["status"] = "v6-streetlevel"
    MANIFEST.write_text(json.dumps(man, indent=1) + "\n")
    bad = 0
    for gid in results:
        bad += audit(HERO / f"{gid}.glb")
    if bad:
        raise SystemExit(f"{bad} zero-area triangles")


def json_buildings():
    from build_downtown import load_buildings

    return load_buildings()


if __name__ == "__main__":
    main()
