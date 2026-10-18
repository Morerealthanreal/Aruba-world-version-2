#!/usr/bin/env python3
"""Photo-matched Oranjestad fronts. Geometry only — no photo textures.

Main Street (Caya G.F. Betico Croes):
  West block follows the postcard row (pink stepped gable, white scrolled
  gable, sky neck gable, yellow balcony). The long run east of that, seen
  from the trolley, is a low two-storey shopfront, not a canyon of gables.

Waterfront:
  Royal Plaza is the pink Dutch mall: white-trimmed stepped gables, teal
  awnings, white balconies, a spiral stair and the gold dome.
  Renaissance Mall's L.G. Smith face is the ochre hip-roof block with the
  curved pediment and white columns.

Shared manifest entries are updated in place (tris, textures, status,
ref_sources only). Nothing else in the file is rewritten by hand, and no
other lane's ids are touched.
"""
from __future__ import annotations

import json
import math
import sys
from pathlib import Path

import build_downtown as D

ROOT = Path("/workspace")
HERO = ROOT / "game/models/hero"
MANIFEST = ROOT / "game/data/hero/manifest.json"

PINK = (0.93, 0.55, 0.70)
PINK_DEEP = (0.86, 0.40, 0.58)
WHITE = D.WHITE
TEAL = (0.35, 0.78, 0.82)
TEAL_DARK = (0.22, 0.62, 0.70)
TERRACOTTA = D.TERRACOTTA
GOLD = (0.92, 0.72, 0.22)
GOLD_DARK = (0.72, 0.50, 0.12)
OCHRE = (0.90, 0.70, 0.28)
OCHRE_DARK = (0.78, 0.55, 0.16)
GLASS = (0.12, 0.18, 0.24)
CREAM = (0.94, 0.91, 0.86)
SHOP = (0.28, 0.16, 0.12)
YELLOW = (0.95, 0.78, 0.22)

ROYAL_REFS = (
    "Placement: OSM Royal Plaza footprint (ODbL). Geometry rebuilt to match "
    "Wikimedia Commons File:ARUBA-oranjestad-royalplaza.jpg (CC BY-SA 3.0, Bgabel) "
    "File:Downtown Oranjestad, Aruba (4901401611).jpg (CC BY 2.0, David Stanley), "
    "and File:ROYAL PLAZA IN ORANJESTAD, ARUBA.JPG (CC BY-SA 3.0, KLOTZ) for the dome. "
    "Photos are reference only and are not used as textures."
)
REN_REFS = (
    "Placement: OSM Renaissance Mall footprint (ODbL). Geometry rebuilt to match "
    "Wikimedia Commons File:Oranjestad -Centro de Aruba- L.G. Smith Blvd - Renaissance Mall - panoramio.jpg "
    "(CC BY 3.0) and File:Aruba Oranjestad MainStreet.jpg (CC BY-SA 3.0, Set1536), "
    "the L.G. Smith view of the ochre hip roof and curved pediment. "
    "Photos are reference only and are not used as textures."
)
STREET_REFS = (
    D.REFS
    + " West block colours and gables follow the Main Street postcard row "
    "(pink, white scrolled, sky, yellow balcony). The long run matches "
    "Wikimedia Commons File:Oranjestad trolley - operator's view.jpg "
    "(CC BY-SA 2.0, Roger Wollstadt): low two-storey shopfronts, not tall gables. "
    "Photos are reference only and are not used as textures."
)


def facing_edges(poly, road, max_dist=22.0, min_face=0.7, min_len=8.0):
    area = D.poly_area(poly)
    ccw = area > 0
    out = []
    for i in range(len(poly)):
        a, b = poly[i], poly[(i + 1) % len(poly)]
        dx, dz = b[0] - a[0], b[1] - a[1]
        length = D.hypot(dx, dz)
        if length < min_len:
            continue
        left = (-dz / length, dx / length)
        outward = left if not ccw else (dz / length, -dx / length)
        mid = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
        dist = D.min_dist_to_poly(mid, road)
        q = D.closest_on_line(mid, road)
        toward = D.norm((q[0] - mid[0], q[1] - mid[1]))
        face = D.dot(outward, toward)
        if face >= min_face and dist <= max_dist:
            out.append((a, b, length, outward, dist))
    return out


def quad(prim, pts, color, flip=False):
    if flip:
        prim.quad(pts[1], pts[0], pts[3], pts[2], color)
    else:
        prim.quad(pts[0], pts[1], pts[2], pts[3], color)


def disc(prim, cx, cy, cz, r, color, normal, seg=10):
    """Flat disc. normal is a unit vector; the disc lies in the perpendicular plane."""
    nx, ny, nz = normal
    ax, ay, az = (0, 1, 0) if abs(ny) < 0.85 else (1, 0, 0)
    tx = ay * nz - az * ny
    ty = az * nx - ax * nz
    tz = ax * ny - ay * nx
    tl = math.sqrt(tx * tx + ty * ty + tz * tz) or 1
    tx, ty, tz = tx / tl, ty / tl, tz / tl
    bx = ny * tz - nz * ty
    by = nz * tx - nx * tz
    bz = nx * ty - ny * tx
    center = (cx, cy, cz)
    prev = None
    first = None
    for i in range(seg + 1):
        a = math.tau * i / seg
        p = (
            cx + (tx * math.cos(a) + bx * math.sin(a)) * r,
            cy + (ty * math.cos(a) + by * math.sin(a)) * r,
            cz + (tz * math.cos(a) + bz * math.sin(a)) * r,
        )
        if prev is not None:
            prim.tri(center, prev, p, color)
        else:
            first = p
        prev = p


def hemisphere(prim, cx, cy, cz, r, color, seg=10, rings=4):
    for ring in range(rings):
        v0 = (ring / rings) * math.pi * 0.5
        v1 = ((ring + 1) / rings) * math.pi * 0.5
        y0 = math.sin(v0) * r
        y1 = math.sin(v1) * r
        rad0 = math.cos(v0) * r
        rad1 = math.cos(v1) * r
        for i in range(seg):
            a0 = math.tau * i / seg
            a1 = math.tau * (i + 1) / seg
            p00 = (cx + math.cos(a0) * rad0, cy + y0, cz + math.sin(a0) * rad0)
            p10 = (cx + math.cos(a1) * rad0, cy + y0, cz + math.sin(a1) * rad0)
            p11 = (cx + math.cos(a1) * rad1, cy + y1, cz + math.sin(a1) * rad1)
            p01 = (cx + math.cos(a0) * rad1, cy + y1, cz + math.sin(a0) * rad1)
            prim.quad(p00, p10, p11, p01, color)


def arch_opening(prim, glass, wp, t0, t1, y0, y1, push, trim, glass_c):
    """Opening between t0 and t1. Spring line at y1, a shallow arch above it."""
    span = t1 - t0
    if span < 0.4:
        return
    inset = 0.18
    a0, a1 = t0 + inset, t1 - inset
    # jambs
    for t in (t0, t1 - 0.16):
        box_along(prim, wp, t + 0.08, (y0 + y1) * 0.5, push, 0.16, y1 - y0, 0.22, trim)
    glass.quad(
        wp(a0, y0, push + 0.02),
        wp(a1, y0, push + 0.02),
        wp(a1, y1, push + 0.02),
        wp(a0, y1, push + 0.02),
        glass_c,
    )
    mid = (a0 + a1) * 0.5
    rise = min(0.85, span * 0.28)
    half = (a1 - a0) * 0.5
    steps = 4
    spring = wp(mid, y1, push + 0.06)

    def arch_pt(u, extra=0.0, push_out=0.0):
        tt = mid + math.cos(math.pi * u) * half
        yy = y1 + math.sin(math.pi * u) * (rise + extra)
        return wp(tt, yy, push + 0.06 + push_out)

    for i in range(steps):
        u0 = i / steps
        u1 = (i + 1) / steps
        prim.tri(spring, arch_pt(u0), arch_pt(u1), trim)
        prim.tri(arch_pt(u0, 0.1, 0.1), arch_pt(u1, 0.1, 0.1), arch_pt((u0 + u1) * 0.5, 0.02, 0.1), WHITE)


def box_along(prim, wp, t, y, push, w, h, d, color):
    """Axis box in facade space: w along the wall, h vertical, d outward."""
    x0, x1 = t - w / 2, t + w / 2
    y0, y1 = y - h / 2, y + h / 2
    p0, p1 = push - d / 2, push + d / 2
    corners = {
        (0, 0, 0): wp(x0, y0, p0),
        (1, 0, 0): wp(x1, y0, p0),
        (1, 1, 0): wp(x1, y1, p0),
        (0, 1, 0): wp(x0, y1, p0),
        (0, 0, 1): wp(x0, y0, p1),
        (1, 0, 1): wp(x1, y0, p1),
        (1, 1, 1): wp(x1, y1, p1),
        (0, 1, 1): wp(x0, y1, p1),
    }
    faces = [
        ((0, 0, 1), (1, 0, 1), (1, 1, 1), (0, 1, 1)),
        ((1, 0, 0), (0, 0, 0), (0, 1, 0), (1, 1, 0)),
        ((0, 1, 1), (1, 1, 1), (1, 1, 0), (0, 1, 0)),
        ((0, 0, 0), (1, 0, 0), (1, 0, 1), (0, 0, 1)),
        ((1, 0, 1), (1, 0, 0), (1, 1, 0), (1, 1, 1)),
        ((0, 0, 0), (0, 0, 1), (0, 1, 1), (0, 1, 0)),
    ]
    for f in faces:
        prim.quad(*[corners[i] for i in f], color)


def awning(prim, wp, t0, t1, y, push, color, depth=0.85):
    prim.quad(
        wp(t0, y, push),
        wp(t1, y, push),
        wp(t1, y - 0.16, push + depth),
        wp(t0, y - 0.16, push + depth),
        color,
    )


def balcony(prim, wp, t0, t1, y, push, color=WHITE):
    depth = 0.85
    prim.quad(
        wp(t0, y, push),
        wp(t1, y, push),
        wp(t1, y + 0.06, push + depth),
        wp(t0, y + 0.06, push + depth),
        color,
    )
    # top rail
    prim.quad(
        wp(t0, y + 0.72, push + depth),
        wp(t1, y + 0.72, push + depth),
        wp(t1, y + 0.80, push + depth),
        wp(t0, y + 0.80, push + depth),
        color,
    )
    span = t1 - t0
    n = max(2, int(span / 0.7))
    for i in range(n + 1):
        t = t0 + span * i / n
        box_along(prim, wp, t, y + 0.40, push + depth, 0.08, 0.72, 0.08, color)


def spiral(prim, wp, t, y0, y1, push, color=WHITE):
    """Curved stair in front of the wall, the one beside the Royal Plaza dome."""
    steps = 16
    radius = 1.75
    for i in range(steps):
        ang = math.pi * 0.25 + (i / (steps - 1)) * math.pi * 1.45
        out = push + 0.35 + math.sin(ang) * radius
        along = t + math.cos(ang) * radius * 0.95
        y = y0 + (y1 - y0) * (i / (steps - 1))
        box_along(prim, wp, along, y, out, 1.2, 0.12, 0.72, color)
        box_along(prim, wp, along, y + 0.48, out + 0.32, 0.08, 0.78, 0.08, color)
    box_along(prim, wp, t, (y0 + y1) * 0.5, push + 0.25, 0.36, (y1 - y0), 0.36, color)


BLACK = (0.08, 0.08, 0.09)
STONE = (0.64, 0.62, 0.58)
MULCH = (0.55, 0.24, 0.16)
LEAF = (0.16, 0.46, 0.20)
LEAF_DARK = (0.12, 0.34, 0.16)
GLOBE = (0.97, 0.95, 0.86)
TRUNK = (0.42, 0.28, 0.14)


def palm_at(prim, x, y, z, h=5.2):
    """Fan palm. Fronds are radial quads, not axis-aligned planks."""
    D.cyl(prim, x, y, z, 0.15, h * 0.92, TRUNK, seg=5)
    crown = y + h * 0.88
    for i in range(7):
        ang = i * math.tau / 7 + 0.4
        c, s = math.cos(ang), math.sin(ang)
        col = LEAF if i % 2 == 0 else LEAF_DARK
        base_l = (x - s * 0.07, crown, z + c * 0.07)
        base_r = (x + s * 0.07, crown, z - c * 0.07)
        tip = (x + c * 1.65, crown - 0.42, z + s * 1.65)
        mid = (x + c * 0.85, crown - 0.08, z + s * 0.85)
        prim.tri(base_l, base_r, mid, col)
        prim.tri(base_l, mid, tip, col)
        prim.tri(base_r, tip, mid, col)


def shade_tree(prim, x, y, z):
    """Broad tree in a Main Street median bed, as in the trolley view."""
    D.cyl(prim, x, y, z, 0.12, 2.4, TRUNK, seg=5)
    D.sphere(prim, x, y + 3.5, z, 1.35, LEAF, seg=6)
    D.sphere(prim, x + 0.7, y + 3.1, z, 0.85, LEAF_DARK, seg=5)


def lamp_at(prim, x, y, z):
    """Black post, three globes, and the red shield banner from L.G. Smith."""
    D.cyl(prim, x, y, z, 0.055, 4.3, BLACK, seg=5)
    D.box(prim, x, y + 4.25, z, 1.15, 0.06, 0.06, BLACK)
    for dx in (-0.48, 0.0, 0.48):
        D.box(prim, x + dx, y + 4.05, z, 0.20, 0.26, 0.20, GLOBE)
        D.box(prim, x + dx, y + 4.22, z, 0.24, 0.05, 0.24, BLACK)
    prim.quad(
        (x + 0.08, y + 2.35, z + 0.08),
        (x + 0.62, y + 2.25, z + 0.08),
        (x + 0.55, y + 3.25, z + 0.08),
        (x + 0.02, y + 3.35, z + 0.08),
        (0.72, 0.10, 0.16),
    )


def bollard_at(prim, x, y, z):
    D.cyl(prim, x, y, z, 0.14, 0.78, WHITE, seg=5)
    D.cyl(prim, x, y + 0.78, z, 0.18, 0.08, WHITE, seg=5)


def planter_at(prim, x, y, z):
    """Square stone planter with a palm, the row along the Renaissance front."""
    D.box(prim, x, y + 0.42, z, 1.55, 0.84, 1.55, STONE)
    D.box(prim, x, y + 0.88, z, 1.25, 0.10, 1.25, MULCH)
    palm_at(prim, x, y + 0.85, z, h=3.4)
    D.box(prim, x + 0.38, y + 1.15, z, 0.32, 0.28, 0.32, LEAF)


def lattice(prim, wp, t0, t1, y0, push):
    """White criss-cross rail along the L.G. Smith sidewalk."""
    prim.quad(
        wp(t0, y0 + 0.28, push),
        wp(t1, y0 + 0.28, push),
        wp(t1, y0 + 0.36, push),
        wp(t0, y0 + 0.36, push),
        WHITE,
    )
    prim.quad(
        wp(t0, y0 + 1.02, push),
        wp(t1, y0 + 1.02, push),
        wp(t1, y0 + 1.10, push),
        wp(t0, y0 + 1.10, push),
        WHITE,
    )
    t = t0
    while t < t1 - 1.15:
        prim.quad(
            wp(t, y0 + 0.32, push + 0.02),
            wp(t + 0.08, y0 + 0.32, push + 0.02),
            wp(t + 1.15, y0 + 1.02, push + 0.02),
            wp(t + 1.07, y0 + 1.02, push + 0.02),
            WHITE,
        )
        prim.quad(
            wp(t + 1.07, y0 + 0.32, push),
            wp(t + 1.15, y0 + 0.32, push),
            wp(t + 0.08, y0 + 1.02, push),
            wp(t, y0 + 1.02, push),
            WHITE,
        )
        t += 1.25


def flags(prim, wp, ts, y, push):
    colors = [
        (0.70, 0.12, 0.16),
        (0.95, 0.82, 0.15),
        (0.12, 0.28, 0.62),
        (0.10, 0.45, 0.22),
        (0.85, 0.85, 0.88),
    ]
    for i, t in enumerate(ts):
        box_along(prim, wp, t, y + 1.1, push, 0.06, 2.4, 0.06, WHITE)
        c = colors[i % len(colors)]
        prim.quad(
            wp(t, y + 1.7, push),
            wp(t + 1.15, y + 1.55, push + 0.15),
            wp(t + 1.15, y + 2.35, push + 0.15),
            wp(t, y + 2.45, push),
            c,
        )


def gable_run(prim, a, b, outward, eave, color, origin, h0, count, kind=0, scale=1.15):
    dx, dz = b[0] - a[0], b[1] - a[1]
    length = D.hypot(dx, dz) or 1
    tx, tz = dx / length, dz / length
    for k in range(count):
        aa = (a[0] + tx * length * k / count, a[1] + tz * length * k / count)
        bb = (a[0] + tx * length * (k + 1) / count, a[1] + tz * length * (k + 1) / count)
        # White trim sits behind a pink face so the step border shows.
        D.parapet(prim, aa, bb, outward, eave, WHITE, WHITE, origin, h0, kind, scale=scale * 1.2, inset=0.02)
        D.parapet(prim, aa, bb, outward, eave, color, WHITE, origin, h0, kind, scale=scale, inset=0.26)
        ox, oz = origin
        mx = (aa[0] + bb[0]) * 0.5 + outward[0] * 0.46
        mz = (aa[1] + bb[1]) * 0.5 + outward[1] * 0.46
        disc(prim, mx - ox, eave + 1.15 * scale - h0, mz - oz, 0.38 * scale, WHITE, (outward[0], 0.0, outward[1]), seg=8)


def plateau(poly, floor):
    """Drop the beach tongue of an oversized footprint.

    Royal Plaza and the Renaissance footprint both run off the boulevard
    onto sand that is several metres lower. Extruding that tongue at street
    height leaves a floating wall. The street front stays.
    """
    kept = [p for p in poly if D.height_at(*p) >= floor]
    if len(kept) < 4:
        return poly
    return D.clean_poly(kept)


def mass(prim, poly, ground, top, color, roof, origin, h0, roof_h=2.2):
    D.extrude_walls(prim, poly, ground, top, color, origin, h0)
    c = D.centroid(poly)
    ox, oz = origin
    for i in range(len(poly)):
        p, q = poly[i], poly[(i + 1) % len(poly)]
        prim.tri(
            (c[0] - ox, top + roof_h - h0, c[1] - oz),
            (p[0] - ox, top - h0, p[1] - oz),
            (q[0] - ox, top - h0, q[1] - oz),
            roof,
        )


def build_royal(smith):
    manifest = json.loads(MANIFEST.read_text())
    hero = next(e for e in manifest if e["id"] == "royalplaza")
    poly = D.clean_poly([(p[0], p[1]) for p in hero["hide_footprint"]])
    body = plateau(poly, 6.2)
    ox, oz = hero["x"], hero["z"]
    h0 = D.height_at(ox, oz)
    ground = D.height_at(*D.centroid(poly))
    edges = facing_edges(poly, smith)
    if not edges:
        raise SystemExit("royal plaza has no street edge")
    # Boulevard face: the close edges are split by a recess. Start at the
    # southern corner and run to the northern one so the pink front is the
    # whole street wall, not one OSM segment.
    a, b, length, outward, dist = min(edges, key=lambda e: e[0][0] + e[0][1])
    dx, dz = (b[0] - a[0]) / length, (b[1] - a[1]) / length

    def along(p, a=a, dx=dx, dz=dz):
        return (p[0] - a[0]) * dx + (p[1] - a[1]) * dz

    run = max(along(p) for edge in edges for p in (edge[0], edge[1]))
    run = max(36.0, min(run, 90.0))
    # Stop where the boulevard falls away to the beach. Past that the
    # pink wall would hang in the air.
    base_h = D.height_at(a[0], a[1])
    t_lim = 10.0
    while t_lim < run:
        if D.height_at(a[0] + dx * t_lim, a[1] + dz * t_lim) < base_h - 1.15:
            run = max(34.0, t_lim - 2.0)
            break
        t_lim += 2.0
    b = (a[0] + dx * run, a[1] + dz * run)
    nx, nz = outward

    def wp(t, y, push):
        return (
            a[0] + dx * t + nx * push - ox,
            y - h0,
            a[1] + dz * t + nz * push - oz,
        )

    paint, glass = D.Prim(), D.Prim()
    # Pink body. The old mall was a tall grey slab; the real building is a
    # three-storey pink block under a tile roof.
    wall_top = ground + 8.4
    mass(paint, body, ground, wall_top, PINK, TERRACOTTA, (ox, oz), h0, roof_h=2.6)
    # White cornice on the street line
    paint.quad(
        wp(0, wall_top, 0.2),
        wp(run, wall_top, 0.2),
        wp(run, wall_top + 0.28, 0.45),
        wp(0, wall_top + 0.28, 0.45),
        WHITE,
    )
    # Three large gables on the level part of the boulevard. The dome
    # pavilion sits at the far end, as in the street photograph.
    gable_end = min(26.0, run * 0.62)
    gable_run(
        paint,
        (a[0], a[1]),
        (a[0] + dx * gable_end, a[1] + dz * gable_end),
        outward,
        wall_top,
        PINK,
        (ox, oz),
        h0,
        3,
        kind=0,
        scale=1.22,
    )
    # Two balcony floors with teal awnings and arched openings.
    for floor, ybase in ((0, ground + 3.55), (1, ground + 6.15)):
        front = min(run - 12, gable_end + 2)
        balcony(paint, wp, 1.0, front, ybase, 0.35)
        bay = 3.6
        t = 1.4
        while t + bay < front:
            arch_opening(paint, glass, wp, t, t + bay - 0.25, ybase - 1.7, ybase - 0.15, 0.15, WHITE, GLASS)
            awning(paint, wp, t, t + bay - 0.25, ybase - 0.05, 0.4, TEAL if floor else TEAL_DARK)
            t += bay
    # Ground floor shop band and a yellow awning, with white columns.
    shop_end = min(run - 12, gable_end + 4)
    paint.quad(
        wp(0.4, ground + 0.15, 0.12),
        wp(shop_end, ground + 0.15, 0.12),
        wp(shop_end, ground + 3.15, 0.12),
        wp(0.4, ground + 3.15, 0.12),
        SHOP,
    )
    awning(paint, wp, 0.6, shop_end * 0.62, ground + 3.25, 0.3, YELLOW)
    awning(paint, wp, shop_end * 0.62, shop_end, ground + 3.25, 0.3, (0.55, 0.22, 0.48))
    t = 1.2
    while t < shop_end:
        box_along(paint, wp, t, ground + 1.7, 0.55, 0.32, 3.3, 0.32, WHITE)
        t += 4.2
    # Spiral stair left of the dome, as in the street photo.
    spiral(paint, wp, shop_end * 0.72, ground + 0.2, ground + 6.4, 1.6)
    flags(paint, wp, [6, 16, 26, shop_end * 0.8], ground + 6.3, 1.3)
    # Gold dome at the north end of the pink front, clear of the gables.
    dome_t = min(run - 5.5, shop_end + 7.5)
    dome_c = wp(dome_t, ground, -1.2)
    # wp returns local coords; hemisphere wants the same space
    cx, base_y, cz = dome_c
    drum_h = 7.2
    D.cyl(paint, cx, base_y, cz, 4.8, drum_h, PINK, seg=10)
    D.cyl(paint, cx, base_y + drum_h - 0.15, cz, 5.15, 0.28, WHITE, seg=10)
    # balustrade around the drum, the white rail under the gold dome
    for i in range(12):
        ang = i * math.tau / 12
        D.box(
            paint,
            cx + math.cos(ang) * 5.15,
            base_y + drum_h + 0.45,
            cz + math.sin(ang) * 5.15,
            0.14,
            0.72,
            0.14,
            WHITE,
        )
    hemisphere(paint, cx, base_y + drum_h + 0.35, cz, 4.5, GOLD, seg=10, rings=4)
    D.cyl(paint, cx, base_y + drum_h + 3.6, cz, 0.7, 1.5, GOLD_DARK, seg=6)
    hemisphere(paint, cx, base_y + drum_h + 5.1, cz, 0.7, GOLD, seg=6, rings=3)
    # clock face toward the street
    disc(paint, *wp(dome_t, ground + 5.4, 3.6), 0.7, CREAM, (nx, 0, nz), seg=8)
    disc(paint, *wp(dome_t, ground + 5.4, 3.75), 0.48, WHITE, (nx, 0, nz), seg=8)
    # Teal-and-white striped awning on the dome pavilion, from the street photo.
    for i, col in enumerate((TEAL, WHITE, TEAL, WHITE, TEAL, WHITE)):
        awning(
            paint, wp,
            dome_t - 5.2 + i * 1.55, dome_t - 3.7 + i * 1.55,
            ground + 3.45, 3.4, col, depth=2.3,
        )
    # Palms, lamps, bollards and the white rail on the boulevard sidewalk.
    t = 3.0
    while t < shop_end:
        x, y, z = wp(t, ground, 6.2)
        if int(t / 3) % 2 == 0:
            palm_at(paint, x, y, z, h=5.4)
        else:
            lamp_at(paint, x, y, z)
        t += 7.5
    t = 2.0
    while t < shop_end:
        x, y, z = wp(t, ground, 9.0)
        bollard_at(paint, x, y, z)
        t += 3.4
    lattice(paint, wp, 0.5, shop_end, ground, 8.2)
    # Clock post beside the dome, the one in the street photograph.
    x, y, z = wp(dome_t - 3.5, ground, 7.5)
    lamp_at(paint, x, y, z)
    disc(paint, x, y + 3.15, z + 0.16, 0.42, CREAM, (nx, 0, nz), seg=8)

    lod = D.Prim()
    mass(lod, body, ground, wall_top, PINK, TERRACOTTA, (ox, oz), h0, roof_h=1.2)
    D.box(lod, cx, base_y + 6, cz, 8, 8, 8, GOLD)

    glb = D.Glb("royalplaza")
    glb.mat("paint", rough=0.82, double=True)
    glb.mat("glass", color=[1, 1, 1, 1], rough=0.15, metal=0.02, double=True)
    glb.add(paint, "paint")
    glb.add(glass, "glass")
    glb.lod1_prim = lod
    data, tris = glb.pack()
    (HERO / "royalplaza.glb").write_bytes(data)
    # Camera on the boulevard sidewalk, not down the beach slope.
    cam = (a[0] + dx * 10 + nx * 14, a[1] + dz * 10 + nz * 14)
    look = (a[0] + dx * 20, a[1] + dz * 20)
    print(f"royal tris {tris} cam {cam[0]:.0f},{cam[1]:.0f} look {look[0]:.0f},{look[1]:.0f}")
    return tris, (ox, oz)


def build_renaissance(smith):
    manifest = json.loads(MANIFEST.read_text())
    hero = next(e for e in manifest if e["id"] == "renmall")
    poly = D.clean_poly([(p[0], p[1]) for p in hero["hide_footprint"]])
    body = plateau(poly, 8.0)
    ox, oz = hero["x"], hero["z"]
    h0 = D.height_at(ox, oz)
    ground = D.height_at(*D.centroid(poly))
    edges = facing_edges(poly, smith, max_dist=20)
    if not edges:
        raise SystemExit("renaissance has no street edge")
    edges.sort(key=lambda e: e[0][0])  # south / west first (more negative x)
    paint, glass = D.Prim(), D.Prim()
    wall_top = ground + 12.2
    mass(paint, body, ground, wall_top, OCHRE, TERRACOTTA, (ox, oz), h0, roof_h=2.8)
    # Curved pediment on the near (southern) street piece, hotel windows on the long piece.
    pavilion = edges[0]
    hotel = max(edges, key=lambda e: e[2])
    for edge, mode in ((pavilion, "pavilion"), (hotel, "hotel")):
        a, b, length, outward, dist = edge
        dx, dz = (b[0] - a[0]) / length, (b[1] - a[1]) / length
        nx, nz = outward

        def wp(t, y, push, a=a, dx=dx, dz=dz, nx=nx, nz=nz):
            return (
                a[0] + dx * t + nx * push - ox,
                y - h0,
                a[1] + dz * t + nz * push - oz,
            )

        if mode == "pavilion":
            D.parapet(paint, a, b, outward, ground + 8.6, OCHRE, WHITE, (ox, oz), h0, 2, scale=1.55)
            # round medallion in the gable, and the round window on the wall
            disc(paint, *wp(length * 0.5, ground + 10.2, 0.35), 0.85, CREAM, (nx, 0, nz))
            disc(paint, *wp(length * 0.5, ground + 10.2, 0.48), 0.55, (0.75, 0.55, 0.28), (nx, 0, nz))
            disc(paint, *wp(length * 0.72, ground + 6.4, 0.42), 0.7, WHITE, (nx, 0, nz))
            disc(paint, *wp(length * 0.72, ground + 6.4, 0.55), 0.42, GLASS, (nx, 0, nz))
            # three white columns under the pediment
            for t in (length * 0.22, length * 0.5, length * 0.78):
                box_along(paint, wp, t, ground + 2.4, 0.7, 0.42, 4.6, 0.42, WHITE)
            awning(paint, wp, 0.4, length - 0.4, ground + 4.7, 0.45, TERRACOTTA)
        else:
            # four floors of white-framed windows, a balcony on the upper floor
            floors = [ground + 2.2, ground + 4.8, ground + 7.4, ground + 10.0]
            bay = 2.4
            t = 0.8
            while t + bay < length - 0.4:
                for y in floors:
                    box_along(paint, wp, t + bay * 0.5, y, 0.16, 1.15, 1.45, 0.12, WHITE)
                    glass.quad(
                        wp(t + 0.35, y - 0.55, 0.24),
                        wp(t + bay - 0.35, y - 0.55, 0.24),
                        wp(t + bay - 0.35, y + 0.5, 0.24),
                        wp(t + 0.35, y + 0.5, 0.24),
                        GLASS,
                    )
                t += bay
            balcony(paint, wp, 0.6, length - 0.6, ground + 8.7, 0.25)
            # white eaves
            paint.quad(
                wp(0, wall_top, 0.15),
                wp(length, wall_top, 0.15),
                wp(length, wall_top + 0.25, 0.4),
                wp(0, wall_top + 0.25, 0.4),
                WHITE,
            )
    # colonnade along the whole near front
    a, b, length, outward, dist = hotel
    dx, dz = (b[0] - a[0]) / length, (b[1] - a[1]) / length
    nx, nz = outward

    def wp_h(t, y, push):
        return (
            a[0] + dx * t + nx * push - ox,
            y - h0,
            a[1] + dz * t + nz * push - oz,
        )

    t = 1.0
    while t < length:
        box_along(paint, wp_h, t, ground + 1.8, 1.5, 0.38, 3.5, 0.38, WHITE)
        t += 4.0
    # Stone planters, palms and lamp posts along the sidewalk, plus the
    # white criss-cross rail and a short run of flags.
    t = 2.0
    while t < length - 1:
        x, y, z = wp_h(t, ground, 7.2)
        planter_at(paint, x, y, z)
        if int(t) % 12 < 6:
            x2, y2, z2 = wp_h(t + 3.2, ground, 4.6)
            lamp_at(paint, x2, y2, z2)
        t += 6.5
    lattice(paint, wp_h, 0.4, length - 0.4, ground, 5.4)
    flags(paint, wp_h, [length * 0.25, length * 0.55, length * 0.8], ground + 6.2, 1.2)

    lod = D.Prim()
    mass(lod, body, ground, wall_top, OCHRE, TERRACOTTA, (ox, oz), h0, roof_h=1.4)
    glb = D.Glb("renmall")
    glb.mat("paint", rough=0.84, double=True)
    glb.mat("glass", color=[1, 1, 1, 1], rough=0.16, double=True)
    glb.add(paint, "paint")
    glb.add(glass, "glass")
    glb.lod1_prim = lod
    data, tris = glb.pack()
    (HERO / "renmall.glb").write_bytes(data)
    mid = ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
    cam = (mid[0] + nx * 16, mid[1] + nz * 16)
    print(f"renaissance tris {tris} cam {cam[0]:.0f},{cam[1]:.0f} look {mid[0]:.0f},{mid[1]:.0f}")
    return tris


def quiet_crowns():
    """The old crown strip sat on top of these buildings. The gables now
    belong to the building meshes, so the strip must not draw a second row."""
    paint = D.Prim()
    D.box(paint, 0, -3.0, 0, 0.2, 0.2, 0.2, PINK)
    glb = D.Glb("ora_crowns")
    glb.mat("paint", rough=0.8)
    glb.add(paint, "paint")
    glb.lod1_prim = paint
    data, tris = glb.pack()
    (HERO / "ora_crowns.glb").write_bytes(data)
    print("crowns retired into the building meshes", tris)
    return tris


def median_trees(paint, buildings, road, origin, h0):
    """Planter beds, shade trees and palms down the tram median.

    The trolley driver's view looks along a brick path with red beds and
    trees, not an empty street between the shopfronts.
    """
    ox, oz = origin
    xs = [b["c"][0] for b in buildings]
    lo, hi = min(xs) - 6, max(xs) + 6
    # Brick tram path under the beds. The trolley view is a paved median,
    # not bare asphalt between the shops.
    brick = (0.74, 0.55, 0.38)
    half = 1.65
    for i in range(len(road) - 1):
        ax, az = road[i]
        bx, bz = road[i + 1]
        if max(ax, bx) < lo or min(ax, bx) > hi:
            continue
        seg = D.hypot(bx - ax, bz - az)
        if seg < 0.4:
            continue
        px, pz = -(bz - az) / seg * half, (bx - ax) / seg * half
        gy = D.height_at((ax + bx) * 0.5, (az + bz) * 0.5)
        y = (gy + 0.05) - h0
        qa = (ax + px - ox, y, az + pz - oz)
        qb = (bx + px - ox, y, bz + pz - oz)
        qc = (bx - px - ox, y, bz - pz - oz)
        qd = (ax - px - ox, y, az - pz - oz)
        n = paint._n(qa, qb, qc)
        if n and n[1] < 0:
            paint.quad(qa, qd, qc, qb, brick)
        else:
            paint.quad(qa, qb, qc, qd, brick)
        # red mulch along both edges of the path, the planter beds in the trolley photo
        bed = (0.62, 0.20, 0.12)
        yb = y + 0.04
        for sign in (-1, 1):
            ba = (ax + px * sign - ox, yb, az + pz * sign - oz)
            bb = (bx + px * sign - ox, yb, bz + pz * sign - oz)
            bc = (bx + px * sign * 0.55 - ox, yb, bz + pz * sign * 0.55 - oz)
            bd = (ax + px * sign * 0.55 - ox, yb, az + pz * sign * 0.55 - oz)
            nb = paint._n(ba, bb, bc)
            if nb and nb[1] < 0:
                paint.quad(ba, bd, bc, bb, bed)
            else:
                paint.quad(ba, bb, bc, bd, bed)
    walked = 0.0
    next_at = 4.0
    placed = 0
    for i in range(len(road) - 1):
        ax, az = road[i]
        bx, bz = road[i + 1]
        seg = D.hypot(bx - ax, bz - az)
        if seg < 0.4:
            continue
        while walked + seg >= next_at:
            t = (next_at - walked) / seg
            x = ax + (bx - ax) * t
            z = az + (bz - az) * t
            if lo <= x <= hi:
                gy = D.height_at(x, z)
                if placed % 2 == 0:
                    shade_tree(paint, x - ox, gy - h0, z - oz)
                else:
                    palm_at(paint, x - ox, gy - h0, z - oz, h=4.8)
                for sx, sz in ((0.55, 0.28), (-0.45, -0.22)):
                    D.box(paint, x - ox + sx, (gy + 0.28) - h0, z - oz + sz, 0.42, 0.32, 0.42, LEAF)
                placed += 1
            next_at += 8.0
        walked += seg


def dress_main_street():
    ped_lines, smith_lines = D.load_roads()
    osm = json.loads(Path("/tmp/ora_refs/osm.json").read_text())
    ped = []
    for e in osm["elements"]:
        t = e.get("tags") or {}
        if t.get("name") == "Caya G.F. Betico Croes" and t.get("highway") == "pedestrian" and "geometry" in e:
            pts = [((g["lon"] - D.BG) * D.XG, -((g["lat"] - D.ZG) * D.ZLAT)) for g in e["geometry"]]
            if pts and -7800 < pts[0][0] < -6400:
                ped.extend(pts)
    if len(ped) < 4:
        ped = D.flatten(ped_lines)
    buildings = D.load_buildings()
    blockers = D.hero_blockers()
    landmarks = json.loads(D.LANDMARKS.read_text())
    picked = D.select_mainstreet(buildings, ped, blockers, landmarks)
    # Postcard row on the west block. Four repeating fronts from the
    # tram photo: pink stepped, white scrolled, sky neck, yellow with a balcony.
    photo = [
        ((0.94, 0.60, 0.70), 0, True, 1.15, 2.2),
        ((0.95, 0.94, 0.91), 2, False, 1.2, 2.2),
        ((0.70, 0.84, 0.90), 1, False, 1.05, 2.0),
        ((0.96, 0.78, 0.26), 0, True, 1.1, 2.2),
    ]
    # East of the postcard block the trolley looks down a low shopfront street.
    plain = [
        ((0.90, 0.90, 0.88), 2, False, 0.38, 0.45),
        ((0.78, 0.86, 0.92), 2, False, 0.38, 0.45),
        ((0.94, 0.93, 0.90), 2, False, 0.32, 0.4),
        ((0.64, 0.78, 0.86), 2, False, 0.38, 0.45),
    ]
    for i, b in enumerate(picked):
        palette = photo if b["c"][0] < -7120 else plain
        col, kind, bal, scale, lip = palette[i % 4]
        b["color"] = col
        b["gable"] = kind
        b["balcony"] = bal
        b["gscale"] = scale
        b["lip"] = lip
    groups = D.chunk_buildings(picked)
    written = []
    for i, group in enumerate(groups):
        atlas = D.Atlas()
        atlas.street_blade()
        glb, (ox, oz, h0) = D.make_street_glb(group, atlas, ped, extra=median_trees)
        gid = f"ora_gable{i}"
        glb.name = gid
        data, tris = glb.pack()
        (HERO / f"{gid}.glb").write_bytes(data)
        written.append((gid, tris))
        print(f"  {gid} buildings {len(group)} tris {tris}")
    return written


def patch_manifest(updates):
    manifest = json.loads(MANIFEST.read_text())
    seen = set()
    for entry in manifest:
        hid = entry.get("id")
        if hid not in updates:
            continue
        seen.add(hid)
        for key, value in updates[hid].items():
            entry[key] = value
    missing = set(updates) - seen
    if missing:
        raise SystemExit(f"manifest ids missing: {missing}")
    MANIFEST.write_text(json.dumps(manifest, indent=1) + "\n")


def main():
    _ped, smith_lines = D.load_roads()
    smith = D.flatten(smith_lines)
    royal_tris = ren_tris = crown_tris = None
    gables = []
    only = set(sys.argv[1:])
    if not only or "royal" in only:
        royal_tris = build_royal(smith)[0]
    if not only or "renaissance" in only:
        ren_tris = build_renaissance(smith)
    if not only or "crowns" in only:
        crown_tris = quiet_crowns()
    if not only or "street" in only:
        gables = dress_main_street()
    updates = {}
    if royal_tris:
        updates["royalplaza"] = {
            "status": "v8-photo",
            "tris": {"royalplaza_lod0": royal_tris[0], "royalplaza_lod1": royal_tris[1]},
            "textures": 0,
            "ref_sources": ROYAL_REFS,
        }
    if ren_tris:
        updates["renmall"] = {
            "status": "v8-photo",
            "tris": {"renmall_lod0": ren_tris[0], "renmall_lod1": ren_tris[1]},
            "textures": 0,
            "ref_sources": REN_REFS,
        }
    if crown_tris:
        updates["ora_crowns"] = {
            "status": "v8-photo",
            "name": "Dutch gable crowns, folded into Royal Plaza and Renaissance Mall",
            "tris": {"ora_crowns_lod0": crown_tris[0], "ora_crowns_lod1": crown_tris[1]},
            "textures": 0,
            "ref_sources": ROYAL_REFS,
        }
    for gid, tris in gables:
        updates[gid] = {
            "status": "v8-photo",
            "tris": {f"{gid}_lod0": tris[0], f"{gid}_lod1": tris[1]},
            "textures": 1,
            "ref_sources": STREET_REFS,
        }
    if updates:
        patch_manifest(updates)
    print("patched", ", ".join(updates))


if __name__ == "__main__":
    main()
