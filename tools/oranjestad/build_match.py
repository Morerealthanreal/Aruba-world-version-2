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

import io
import json
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

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


def leaf_fan(prim, x, y, z, r, color, tilt=-0.25):
    """A spray of leaf cards. Reads as foliage, not a sphere."""
    for i in range(6):
        ang = i * math.tau / 6 + 0.35
        c, s = math.cos(ang), math.sin(ang)
        tip = (x + c * r, y + r * tilt, z + s * r)
        side = (x + s * r * 0.42, y + r * 0.15, z - c * r * 0.42)
        prim.tri((x, y, z), tip, side, color)
        prim.tri((x, y, z), side, tip, color)


def shade_tree(prim, x, y, z):
    """Leafy sidewalk tree. Crowns are overlapping fans, not green balls."""
    D.cyl(prim, x, y, z, 0.16, 3.3, TRUNK, seg=5)
    crown = y + 2.7
    for ang, length, lift in (
        (0.3, 1.15, 0.85),
        (1.5, 1.35, 1.05),
        (2.7, 1.2, 0.75),
        (4.0, 1.25, 0.95),
        (5.2, 1.1, 0.7),
    ):
        D.cyl(prim, x + math.cos(ang) * 0.2, crown, z + math.sin(ang) * 0.2, 0.05, lift, TRUNK, seg=4)
        leaf_fan(
            prim,
            x + math.cos(ang) * length,
            crown + lift * 0.9,
            z + math.sin(ang) * length,
            1.7,
            LEAF if ang < 3 else LEAF_DARK,
            tilt=-0.35,
        )
    leaf_fan(prim, x, crown + 1.7, z, 1.9, LEAF, tilt=0.08)
    leaf_fan(prim, x + 0.45, crown + 1.05, z - 0.35, 1.15, LEAF_DARK, tilt=-0.4)
    leaf_fan(prim, x - 0.5, crown + 1.15, z + 0.4, 1.2, LEAF, tilt=-0.25)


def shrub(prim, x, y, z):
    leaf_fan(prim, x, y + 0.15, z, 0.38, LEAF, tilt=-0.15)
    leaf_fan(prim, x + 0.12, y + 0.05, z, 0.28, LEAF_DARK, tilt=-0.4)


def lamp_at(prim, x, y, z, face=(0.0, 1.0)):
    """Black post, three globes, and a red banner facing the street."""
    fx, fz = face
    fl = math.hypot(fx, fz) or 1
    fx, fz = fx / fl, fz / fl
    rx, rz = -fz, fx
    D.cyl(prim, x, y, z, 0.06, 4.35, BLACK, seg=5)
    # crossarm along the sidewalk
    D.box(prim, x, y + 4.28, z, 1.2, 0.06, 0.08, BLACK)
    for s in (-0.48, 0.0, 0.48):
        D.box(prim, x + rx * s, y + 4.02, z + rz * s, 0.22, 0.28, 0.22, GLOBE)
        D.box(prim, x + rx * s, y + 4.20, z + rz * s, 0.26, 0.05, 0.26, BLACK)
    # red shield banner under the arm, facing the road
    by = y + 2.55
    prim.quad(
        (x - rx * 0.28 + fx * 0.06, by, z - rz * 0.28 + fz * 0.06),
        (x + rx * 0.28 + fx * 0.06, by, z + rz * 0.28 + fz * 0.06),
        (x + rx * 0.22 + fx * 0.06, by + 1.15, z + rz * 0.22 + fz * 0.06),
        (x - rx * 0.22 + fx * 0.06, by + 1.15, z - rz * 0.22 + fz * 0.06),
        (0.72, 0.10, 0.14),
    )
    prim.quad(
        (x + rx * 0.28 + fx * 0.07, by, z + rz * 0.28 + fz * 0.07),
        (x - rx * 0.28 + fx * 0.07, by, z - rz * 0.28 + fz * 0.07),
        (x - rx * 0.22 + fx * 0.07, by + 1.15, z - rz * 0.22 + fz * 0.07),
        (x + rx * 0.22 + fx * 0.07, by + 1.15, z + rz * 0.22 + fz * 0.07),
        (0.55, 0.08, 0.10),
    )


def bollard_at(prim, x, y, z):
    D.cyl(prim, x, y, z, 0.14, 0.78, WHITE, seg=5)
    D.cyl(prim, x, y + 0.78, z, 0.18, 0.08, WHITE, seg=5)


def planter_at(prim, x, y, z):
    """Square stone planter with a palm, the row along the Renaissance front."""
    D.box(prim, x, y + 0.42, z, 1.55, 0.84, 1.55, STONE)
    D.box(prim, x, y + 0.82, z, 1.72, 0.14, 1.72, (0.52, 0.50, 0.47))
    D.box(prim, x, y + 0.92, z, 1.25, 0.10, 1.25, MULCH)
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


# Stepped shoulders and an S-scroll into the peak. Metres across, metres up.
ROYAL_GABLE = [
    (0.00, 0.10), (0.07, 0.10),
    (0.09, 1.45), (0.18, 1.45),
    (0.20, 2.70), (0.27, 2.35),
    (0.33, 3.45), (0.39, 3.05),
    (0.45, 4.70), (0.50, 5.35),
    (0.55, 4.70), (0.61, 3.05),
    (0.67, 3.45), (0.73, 2.35),
    (0.80, 2.70), (0.82, 1.45),
    (0.91, 1.45), (0.93, 0.10),
    (1.00, 0.10),
]

# Curved pediment with shoulder scrolls, for the Renaissance entrance.
SCROLL_PED = [
    (0.00, 0.15), (0.07, 0.85), (0.13, 0.28),
    (0.22, 1.35), (0.34, 2.35), (0.50, 3.05),
    (0.66, 2.35), (0.78, 1.35), (0.87, 0.28),
    (0.93, 0.85), (1.00, 0.15),
]


def _outline(pts, dist):
    """Push each silhouette point outward so a white border can show past it."""
    n = len(pts)
    base_y = min(p[1] for p in pts)
    cx = (pts[0][0] + pts[-1][0]) * 0.5
    out = []
    for i, (t, y) in enumerate(pts):
        t0, y0 = pts[max(0, i - 1)]
        t1, y1 = pts[min(n - 1, i + 1)]
        dt, dy = t1 - t0, y1 - y0
        ln = math.hypot(dt, dy) or 1.0
        ox, oy = -dy / ln, dt / ln
        if (t - cx) * ox + (y - base_y) * oy < 0:
            ox, oy = -ox, -oy
        out.append((t + ox * dist, y + oy * dist))
    return out


def _fill_profile(prim, wp, pts, push, color):
    worlds = [wp(t, y, push) for t, y in pts]
    base = wp((pts[0][0] + pts[-1][0]) * 0.5, pts[0][1], push)
    for i in range(len(worlds) - 1):
        prim.tri(base, worlds[i], worlds[i + 1], color)


def solid_gable(prim, wp, t0, t1, y_base, color, profile, normal):
    """A gable with a real silhouette: coloured face, white scrolled trim, roundel."""
    width = t1 - t0
    pts = [(t0 + u * width, y_base + h) for u, h in profile]
    rim = _outline(pts, 0.22)
    _fill_profile(prim, wp, rim, 0.02, WHITE)
    _fill_profile(prim, wp, pts, 0.20, color)
    inner = [wp(t, y, 0.24) for t, y in pts]
    outer = [wp(t, y, 0.24) for t, y in rim]
    back = [wp(t, y, -0.45) for t, y in rim]
    for i in range(len(pts) - 1):
        prim.quad(inner[i], inner[i + 1], outer[i + 1], outer[i], WHITE)
        prim.quad(outer[i], outer[i + 1], back[i + 1], back[i], WHITE)
    # roundel in the upper half
    mid_t = (t0 + t1) * 0.5
    peak = max(profile, key=lambda p: p[1])[1]
    disc(
        prim, *wp(mid_t, y_base + peak * 0.62, 0.36),
        min(0.55, width * 0.07), WHITE, (normal[0], 0.0, normal[1]), seg=8,
    )
    disc(
        prim, *wp(mid_t, y_base + peak * 0.62, 0.48),
        min(0.32, width * 0.04), (0.85, 0.55, 0.62), (normal[0], 0.0, normal[1]), seg=8,
    )
    # scroll ends on the shoulders
    for u in (0.20, 0.80):
        disc(
            prim, *wp(t0 + u * width, y_base + peak * 0.42, 0.40),
            0.28, WHITE, (normal[0], 0.0, normal[1]), seg=7,
        )
    # Shoulder scrolls, so the top is scrolled as well as stepped.
    for u, spin in ((0.22, 1.0), (0.78, -1.0)):
        volute(prim, wp, t0 + width * u, y_base + peak * 0.46, 0.42, 0.62, spin)
    tip = wp(mid_t, y_base + peak, 0.2)
    D.box(prim, tip[0], tip[1] + 0.35, tip[2], 0.14, 0.55, 0.14, WHITE)
    D.box(prim, tip[0], tip[1] + 0.68, tip[2], 0.26, 0.08, 0.26, WHITE)


def volute(prim, wp, t, y, push, radius, spin):
    """A white spiral, the scrolled end of a Dutch gable."""
    for i in range(12):
        ang = spin * i / 11 * math.pi * 1.35
        rad = radius * (1.0 - i / 16)
        box_along(
            prim, wp,
            t + math.cos(ang) * rad,
            y + math.sin(ang) * rad * 0.85,
            push,
            0.22, 0.22, 0.28, WHITE,
        )


def grand_stair(prim, wp, t, y0, y1, push):
    """White exterior stair in front of the wall, sweeping toward the street."""
    steps = 12
    width = 3.2
    for i in range(steps):
        f = (i + 0.5) / steps
        y = y0 + (y1 - y0) * f
        p = push + f * 4.8
        along = t + math.sin(f * math.pi) * 1.6
        box_along(prim, wp, along, y, p, width, 0.18, 0.55, WHITE)
        for side in (-1, 1):
            box_along(prim, wp, along + side * width * 0.48, y + 0.5, p, 0.1, 0.85, 0.1, WHITE)
            box_along(prim, wp, along + side * width * 0.48, y + 0.95, p, 0.12, 0.1, 0.12, (0.15, 0.16, 0.18))


def scallop_awning(prim, wp, t0, t1, y, push, color, depth=1.05):
    awning(prim, wp, t0, t1, y, push, color, depth=depth)
    span = t1 - t0
    n = max(3, int(span / 0.85))
    for i in range(n):
        a = t0 + span * i / n
        b = t0 + span * (i + 1) / n
        mid = (a + b) * 0.5
        prim.tri(
            wp(a, y - 0.16, push + depth),
            wp(b, y - 0.16, push + depth),
            wp(mid, y - 0.48, push + depth + 0.04),
            color,
        )


def rail_run(prim, wp, t0, t1, y, push, color=WHITE):
    """Balcony slab plus a balustrade dense enough to read as a railing."""
    balcony(prim, wp, t0, t1, y, push, color)
    # extra lower rail so the balusters aren't a row of floating posts
    depth = 0.85
    prim.quad(
        wp(t0, y + 0.28, push + depth),
        wp(t1, y + 0.28, push + depth),
        wp(t1, y + 0.36, push + depth),
        wp(t0, y + 0.36, push + depth),
        color,
    )


def striped_band(prim, wp, t0, t1, y0, y1, push, colors):
    n = len(colors)
    for i, col in enumerate(colors):
        a = y0 + (y1 - y0) * i / n
        b = y0 + (y1 - y0) * (i + 1) / n
        prim.quad(wp(t0, a, push), wp(t1, a, push), wp(t1, b, push), wp(t0, b, push), col)


def clock_post(prim, x, y, z, nx, nz):
    """Ornate street clock in front of Royal Plaza."""
    D.cyl(prim, x, y, z, 0.09, 3.15, (0.10, 0.32, 0.34), seg=6)
    D.box(prim, x, y + 3.25, z, 0.55, 0.12, 0.55, (0.12, 0.38, 0.40))
    face = (nx, 0.0, nz)
    disc(prim, x + nx * 0.16, y + 2.55, z + nz * 0.16, 0.48, CREAM, face, seg=10)
    disc(prim, x + nx * 0.22, y + 2.55, z + nz * 0.22, 0.40, WHITE, face, seg=8)
    rx, rz = -nz, nx
    cy = y + 2.55
    cz = z + nz * 0.28
    cx = x + nx * 0.28
    prim.quad(
        (cx - rx * 0.03, cy, cz - rz * 0.03),
        (cx + rx * 0.03, cy, cz + rz * 0.03),
        (cx + rx * 0.03, cy + 0.24, cz + rz * 0.03),
        (cx - rx * 0.03, cy + 0.24, cz - rz * 0.03),
        BLACK,
    )
    prim.quad(
        (cx, cy - 0.03, cz),
        (cx + rx * 0.18, cy - 0.03, cz + rz * 0.18),
        (cx + rx * 0.18, cy + 0.03, cz + rz * 0.18),
        (cx, cy + 0.03, cz),
        BLACK,
    )


def crest_png():
    """Painted 'Royal Plaza' plaque. Generated, not a photograph."""
    im = Image.new("RGB", (640, 200), (244, 236, 220))
    draw = ImageDraw.Draw(im)
    draw.rounded_rectangle((8, 8, 631, 191), radius=28, fill=(250, 244, 232), outline=(120, 36, 48), width=8)
    # small crown above the words
    cx, cy = 320, 48
    draw.polygon(
        [(cx - 54, cy + 18), (cx - 36, cy - 16), (cx - 18, cy + 8), (cx, cy - 26),
         (cx + 18, cy + 8), (cx + 36, cy - 16), (cx + 54, cy + 18)],
        fill=(196, 150, 42),
    )
    font = ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSerif-Italic.ttf", 72)
    text = "Royal Plaza"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    draw.text(((640 - tw) / 2, 78), text, fill=(122, 28, 48), font=font)
    buf = io.BytesIO()
    im.save(buf, format="PNG", optimize=True)
    return buf.getvalue()


def plaque(prim, cx, cy, cz, nx, nz, w, h):
    rx, rz = -nz, nx
    hw, hh = w / 2, h / 2
    pts = []
    for su, sv in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
        pts.append((cx + rx * su * hw + nx * 0.08, cy + sv * hh, cz + rz * su * hw + nz * 0.08))
    # U runs right-to-left in this facade frame; flip it so the words read.
    prim.quad(pts[0], pts[1], pts[2], pts[3], WHITE, ((1, 1), (0, 1), (0, 0), (1, 0)))


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
    # Three tall gables. From the street (outward) the start is on the
    # viewer's left and the dome is on the right, matching the photograph.
    gable_w, gap = 6.6, 0.35
    gable_end = 3 * gable_w + 2 * gap
    if gable_end > run - 14:
        gable_w = max(5.2, (run - 14 - 2 * gap) / 3)
        gable_end = 3 * gable_w + 2 * gap
    for i in range(3):
        t0 = 0.4 + i * (gable_w + gap)
        solid_gable(paint, wp, t0, t0 + gable_w, wall_top - 0.15, PINK, ROYAL_GABLE, outward)
    # Two balcony floors, teal scalloped awnings, white rails.
    front = gable_end + 0.2
    for yb, aw in ((ground + 3.45, ground + 4.35), (ground + 6.25, ground + 7.15)):
        rail_run(paint, wp, 0.5, front, yb, 0.30)
        bay = 2.15
        t = 0.7
        while t + bay < front:
            arch_opening(paint, glass, wp, t, t + bay - 0.12, yb - 1.55, yb - 0.05, 0.12, WHITE, GLASS)
            scallop_awning(paint, wp, t, t + bay - 0.12, aw, 0.42, TEAL, depth=1.15)
            t += bay
    # Orange tiles under the gables, the roof band between the parapets.
    paint.quad(
        wp(0.3, wall_top - 0.05, 0.25),
        wp(gable_end, wall_top - 0.05, 0.25),
        wp(gable_end, wall_top - 0.95, 1.85),
        wp(0.3, wall_top - 0.95, 1.85),
        TERRACOTTA,
    )
    # Dark shopfront and white columns under the gables. The mass wall sits
    # proud of the footprint edge, so the glass has to clear it.
    paint.quad(
        wp(0.3, ground + 0.1, 0.55),
        wp(front, ground + 0.1, 0.55),
        wp(front, ground + 3.15, 0.55),
        wp(0.3, ground + 3.15, 0.55),
        SHOP,
    )
    t = 1.1
    while t < front:
        box_along(paint, wp, t, ground + 1.65, 0.95, 0.38, 3.2, 0.38, WHITE)
        t += 3.3
    # White curved stair on the right of the gable block, clear of the dome.
    stair_t = gable_end + 1.4
    spiral(paint, wp, stair_t, ground + 0.15, ground + 6.5, 1.35)
    # A row of flags along the upper balcony.
    flag_ts = [1.6 + i * 3.1 for i in range(6)]
    flags(paint, wp, flag_ts, ground + 6.5, 1.15)
    # Dome pavilion to the right: striped lower storefront, white drum.
    dome_t = min(run - 5.5, stair_t + 9.2)
    # The drum's street face sits about 3 m out. Stripes have to be in
    # front of that or the white cylinder hides them.
    stripe_0, stripe_1 = dome_t - 5.6, dome_t + 5.6
    striped_band(
        paint, wp, stripe_0, stripe_1, ground + 0.25, ground + 3.15, 3.45,
        (TEAL, WHITE, TEAL, WHITE, TEAL, WHITE, TEAL, WHITE),
    )
    for i, col in enumerate((TEAL, WHITE, TEAL, WHITE, TEAL, WHITE, TEAL, WHITE)):
        awning(
            paint, wp,
            stripe_0 + i * 1.4, stripe_0 + (i + 1) * 1.4 - 0.06,
            ground + 3.25, 3.5, col, depth=2.4,
        )
    dome_c = wp(dome_t, ground, -1.6)
    cx, base_y, cz = dome_c
    drum_h = 6.6
    drum_r = 4.15
    D.cyl(paint, cx, base_y, cz, drum_r, drum_h, WHITE, seg=12)
    # Two balcony rings on the white drum.
    for lift, rad in ((2.35, drum_r + 0.15), (drum_h - 0.15, drum_r + 0.35)):
        for i in range(14):
            ang = i * math.tau / 14
            D.box(
                paint,
                cx + math.cos(ang) * rad,
                base_y + lift + 0.42,
                cz + math.sin(ang) * rad,
                0.12, 0.78, 0.12, WHITE,
            )
        D.cyl(paint, cx, base_y + lift + 0.78, cz, rad + 0.08, 0.08, WHITE, seg=12)
    hemisphere(paint, cx, base_y + drum_h + 0.15, cz, drum_r - 0.25, GOLD, seg=12, rings=4)
    D.cyl(paint, cx, base_y + drum_h + 3.5, cz, 0.85, 1.35, GOLD, seg=8)
    # lantern openings
    for i in range(6):
        ang = i * math.tau / 6
        D.box(
            paint,
            cx + math.cos(ang) * 0.86,
            base_y + drum_h + 4.05,
            cz + math.sin(ang) * 0.86,
            0.22, 0.55, 0.08, (0.25, 0.18, 0.10),
        )
    hemisphere(paint, cx, base_y + drum_h + 4.85, cz, 0.7, GOLD, seg=6, rings=3)
    # Crest on the street side of the white drum.
    sign = D.Prim()
    plaque(
        sign,
        cx + nx * (drum_r + 0.05),
        base_y + drum_h * 0.62,
        cz + nz * (drum_r + 0.05),
        nx, nz, 5.2, 1.55,
    )
    # Palms at the sides so the gable centre stays readable. White bollards
    # and the clock post stand in the foreground, as in the street photo.
    for t, ph in ((1.4, 6.8), (dome_t + 4.2, 7.4)):
        x, y, z = wp(t, ground, 7.2)
        palm_at(paint, x, y, z, h=ph)
    t = 1.5
    while t < dome_t + 4:
        x, y, z = wp(t, ground, 10.5)
        bollard_at(paint, x, y, z)
        t += 4.2
    x, y, z = wp(dome_t - 4.2, ground, 9.4)
    clock_post(paint, x, y, z, nx, nz)

    lod = D.Prim()
    mass(lod, body, ground, wall_top, PINK, TERRACOTTA, (ox, oz), h0, roof_h=1.2)
    D.box(lod, cx, base_y + 5, cz, 8, 8, 8, GOLD)

    glb = D.Glb("royalplaza")
    glb.mat("paint", rough=0.82, double=True)
    glb.mat("glass", color=[1, 1, 1, 1], rough=0.15, metal=0.02, double=True)
    glb.images.append((crest_png(), "image/png"))
    glb.mat("sign", rough=0.5, tex=0, double=True)
    glb.add(paint, "paint")
    glb.add(glass, "glass")
    glb.add(sign, "sign")
    glb.lod1_prim = lod
    data, tris = glb.pack()
    (HERO / "royalplaza.glb").write_bytes(data)
    # Street photo: across the boulevard at eye height, three gables on the
    # left and the dome on the right. Stay on the road; the beach past ~22 m
    # drops several metres.
    stand_t = gable_end * 0.28
    focus_t = gable_end * 0.55 + 4.0
    dist = 20.0
    for trial in (16.0, 20.0, 24.0):
        tx = a[0] + dx * stand_t + nx * trial
        tz = a[1] + dz * stand_t + nz * trial
        print(f"  royal stand d={trial:.0f} h={D.height_at(tx, tz):.2f} at {tx:.1f},{tz:.1f}")
    cam = (a[0] + dx * stand_t + nx * dist, a[1] + dz * stand_t + nz * dist)
    look = (a[0] + dx * focus_t, a[1] + dz * focus_t)
    # Dome photo: clock to the left of the drum, crest and stripes facing us.
    dome_cam = (a[0] + dx * (dome_t - 5.5) + nx * 14.0, a[1] + dz * (dome_t - 5.5) + nz * 14.0)
    print(
        f"royal tris {tris} run {run:.1f} gable_end {gable_end:.1f} dome_t {dome_t:.1f} "
        f"ground {ground:.2f}"
    )
    print(f"  CAM royal {cam[0]:.2f},{cam[1]:.2f} look {look[0]:.2f},{look[1]:.2f} eye 1.7 looky {ground + 6.4:.2f}")
    print(f"  CAM dome {dome_cam[0]:.2f},{dome_cam[1]:.2f} lookx {a[0] + dx * dome_t:.2f},{a[1] + dz * dome_t:.2f}")
    # Viewpoints locked to the reference frames (street.jpg and dome.jpg).
    return tris, {
        "royal": {
            "stand": [-7623.51, -18.12],
            "eye": [-7623.51, 1.7, -18.12],
            "look": [look[0], ground + 6.4, look[1]],
            "fov": 56,
        },
        "dome": {
            "stand": [-7607.39, -15.75],
            "eye": [-7607.39, 1.7, -15.75],
            "look": [a[0] + dx * (dome_t + 0.4), ground + 7.6, a[1] + dz * (dome_t + 0.4)],
            "fov": 42,
        },
    }


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
    # Low mall body. The entrance pavilion and the hotel wing are built
    # on the street edges so the hotel can rise behind the pavilion.
    mall_top = ground + 5.6
    mass(paint, body, ground, mall_top, OCHRE, TERRACOTTA, (ox, oz), h0, roof_h=1.8)
    pavilion = edges[0]
    hotel = max(edges, key=lambda e: e[2])
    pa, pb, plen, pout, _pd = pavilion
    ha, hb, hlen, hout, _hd = hotel
    # Down-the-boulevard direction: from the pavilion toward the far end of the hotel.
    sdx, sdz = hb[0] - pa[0], hb[1] - pa[1]
    sl = D.hypot(sdx, sdz) or 1
    sdx, sdz = sdx / sl, sdz / sl

    def dress_edge(edge):
        a, b, length, outward, dist = edge
        dx, dz = (b[0] - a[0]) / length, (b[1] - a[1]) / length
        nx, nz = outward

        def wp(t, y, push, a=a, dx=dx, dz=dz, nx=nx, nz=nz):
            return (
                a[0] + dx * t + nx * push - ox,
                y - h0,
                a[1] + dz * t + nz * push - oz,
            )

        return a, b, length, outward, dx, dz, nx, nz, wp

    a, b, length, outward, dx, dz, nx, nz, wp = dress_edge(pavilion)
    # Yellow entrance wall, orange tile roof, scroll pediment, round window.
    paint.quad(
        wp(0.15, ground + 0.05, 0.28),
        wp(length - 0.15, ground + 0.05, 0.28),
        wp(length - 0.15, ground + 5.15, 0.28),
        wp(0.15, ground + 5.15, 0.28),
        OCHRE,
    )
    # Tile roof overhangs the street, so the orange slope shows above the pediment.
    paint.quad(
        wp(0.0, ground + 4.55, 1.35),
        wp(length, ground + 4.55, 1.35),
        wp(length, ground + 6.85, -3.4),
        wp(0.0, ground + 6.85, -3.4),
        TERRACOTTA,
    )
    solid_gable(paint, wp, 0.35, length - 0.35, ground + 5.05, OCHRE, SCROLL_PED, outward)
    # round window under the pediment, left of centre like the photograph
    disc(paint, *wp(length * 0.62, ground + 3.55, 0.42), 0.72, WHITE, (nx, 0, nz), seg=10)
    disc(paint, *wp(length * 0.62, ground + 3.55, 0.55), 0.46, GLASS, (nx, 0, nz), seg=8)
    # white columns at the entrance, with base and capital
    for u in (0.16, 0.38, 0.62, 0.84):
        t = length * u
        box_along(paint, wp, t, ground + 2.35, 1.15, 0.48, 4.5, 0.48, WHITE)
        box_along(paint, wp, t, ground + 0.22, 1.15, 0.62, 0.28, 0.62, WHITE)
        box_along(paint, wp, t, ground + 4.55, 1.15, 0.70, 0.22, 0.70, WHITE)
    # dark opening behind the columns
    glass.quad(
        wp(length * 0.12, ground + 0.15, 0.32),
        wp(length * 0.88, ground + 0.15, 0.32),
        wp(length * 0.88, ground + 3.9, 0.32),
        wp(length * 0.12, ground + 3.9, 0.32),
        GLASS,
    )

    a, b, length, outward, dx, dz, nx, nz, wp = dress_edge(hotel)
    # Tall yellow hotel wing further down the boulevard.
    hotel_top = ground + 13.6
    paint.quad(
        wp(0.2, ground + 0.05, 0.4),
        wp(length - 0.2, ground + 0.05, 0.4),
        wp(length - 0.2, hotel_top, 0.4),
        wp(0.2, hotel_top, 0.4),
        YELLOW,
    )
    # side returns so the wing has thickness
    for t, sign in ((0.2, -1), (length - 0.2, 1)):
        paint.quad(
            wp(t, ground, 0.4),
            wp(t, ground, -6.0),
            wp(t, hotel_top, -6.0),
            wp(t, hotel_top, 0.4),
            YELLOW,
        )
    paint.quad(
        wp(0.2, hotel_top, 0.4),
        wp(length - 0.2, hotel_top, 0.4),
        wp(length - 0.2, hotel_top + 1.7, -5.5),
        wp(0.2, hotel_top + 1.7, -5.5),
        TERRACOTTA,
    )
    paint.quad(
        wp(0.0, hotel_top, 0.15),
        wp(length, hotel_top, 0.15),
        wp(length, hotel_top + 0.22, 0.45),
        wp(0.0, hotel_top + 0.22, 0.45),
        WHITE,
    )
    floors = [ground + 2.3, ground + 5.2, ground + 8.1, ground + 11.0]
    bay = 2.5
    t = 0.9
    while t + bay < length - 0.5:
        for y in floors:
            box_along(paint, wp, t + bay * 0.5, y, 0.52, 1.15, 1.45, 0.10, WHITE)
            glass.quad(
                wp(t + 0.35, y - 0.55, 0.62),
                wp(t + bay - 0.35, y - 0.55, 0.62),
                wp(t + bay - 0.35, y + 0.5, 0.62),
                wp(t + 0.35, y + 0.5, 0.62),
                GLASS,
            )
        t += bay
    rail_run(paint, wp, 0.8, length - 0.8, ground + 9.4, 0.45)
    flags(paint, wp, [length * 0.3, length * 0.55, length * 0.8], ground + 6.4, 1.05)
    lattice(paint, wp, 1.0, length - 1.0, ground, 3.6)

    # Square stone planters and black lamps in a row down the boulevard,
    # on the street side of the facade so they recede in the down-street shot.
    # Start past the columns so the pediment stays readable.
    face = pout
    row = 0
    dist_along = 10.0
    while dist_along < sl - 4:
        x = pa[0] + sdx * dist_along + face[0] * 8.6
        z = pa[1] + sdz * dist_along + face[1] * 8.6
        gy = D.height_at(x, z)
        if gy > ground - 2.5:
            planter_at(paint, x - ox, gy - h0, z - oz)
            if row % 2 == 0:
                lx = pa[0] + sdx * (dist_along + 2.4) + face[0] * 5.4
                lz = pa[1] + sdz * (dist_along + 2.4) + face[1] * 5.4
                lamp_at(paint, lx - ox, D.height_at(lx, lz) - h0, lz - oz, face=face)
        dist_along += 5.6
        row += 1

    lod = D.Prim()
    mass(lod, body, ground, mall_top, OCHRE, TERRACOTTA, (ox, oz), h0, roof_h=1.2)
    D.box(lod, (ha[0] + hb[0]) * 0.5 - ox, (hotel_top - h0) * 0.5, (ha[1] + hb[1]) * 0.5 - oz, 8, hotel_top - ground, 10, YELLOW)
    glb = D.Glb("renmall")
    glb.mat("paint", rough=0.84, double=True)
    glb.mat("glass", color=[1, 1, 1, 1], rough=0.16, double=True)
    glb.add(paint, "paint")
    glb.add(glass, "glass")
    glb.lod1_prim = lod
    data, tris = glb.pack()
    (HERO / "renmall.glb").write_bytes(data)
    # On the boulevard, back from the pavilion, looking down L.G. Smith the
    # way the street photo does: pediment close on the left, hotel receding.
    stand = (
        pa[0] + pout[0] * 18.0 - sdx * 14.0,
        pa[1] + pout[1] * 18.0 - sdz * 14.0,
    )
    look = (
        pa[0] + sdx * 30.0 + pout[0] * 1.2,
        pa[1] + sdz * 30.0 + pout[1] * 1.2,
    )
    print(f"renaissance tris {tris} ground {ground:.2f} stand h {D.height_at(*stand):.2f}")
    print(f"  pavilion {pa[0]:.1f},{pa[1]:.1f} -> {pb[0]:.1f},{pb[1]:.1f} out {pout}")
    print(f"  hotel {ha[0]:.1f},{ha[1]:.1f} -> {hb[0]:.1f},{hb[1]:.1f}")
    print(f"  CAM ren {stand[0]:.2f},{stand[1]:.2f} look {look[0]:.2f},{look[1]:.2f} looky {ground + 6.2:.2f}")
    # Viewpoint locked to lgsmith-front.jpg: pediment left, boulevard receding.
    return tris, {
        "renaissance": {
            "stand": [-7470.03, 85.66],
            "eye": [-7470.03, 1.7, 85.66],
            "look": [-7442.50, ground + 7.0, 83.73],
            "fov": 52,
        }
    }


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
    half = 2.35
    for i in range(len(road) - 1):
        ax, az = road[i]
        bx, bz = road[i + 1]
        if max(ax, bx) < lo or min(ax, bx) > hi:
            continue
        seg = D.hypot(bx - ax, bz - az)
        if seg < 0.4:
            continue
        px, pz = -(bz - az) / seg * half, (bx - ax) / seg * half
        # unit perpendicular, used again for the rails
        ux, uz = -(bz - az) / seg, (bx - ax) / seg
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
        yb = y + 0.12
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
        # Two rails down the centre of the brick walk. The trolley photo
        # looks straight along them.
        rail = (0.25, 0.25, 0.27)
        yr = y + 0.16
        for sign in (-1, 1):
            off = 0.46 * sign
            ra = (ax + ux * off - ox, yr, az + uz * off - oz)
            rb = (bx + ux * off - ox, yr, bz + uz * off - oz)
            rc = (bx + ux * (off + 0.07) - ox, yr, bz + uz * (off + 0.07) - oz)
            rd = (ax + ux * (off + 0.07) - ox, yr, az + uz * (off + 0.07) - oz)
            nr = paint._n(ra, rb, rc)
            if nr and nr[1] < 0:
                paint.quad(ra, rd, rc, rb, rail)
            else:
                paint.quad(ra, rb, rc, rd, rail)
    walked = 0.0
    next_at = 5.0
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
                # Trees sit in the red beds, off the rails, alternating sides.
                ux, uz = -(bz - az) / seg, (bx - ax) / seg
                side = 1.45 if placed % 2 == 0 else -1.45
                tx, tz = x + ux * side, z + uz * side
                shade_tree(paint, tx - ox, gy - h0, tz - oz)
                shrub(paint, tx - ox + ux * 0.7, gy - h0, tz - oz + uz * 0.7)
                shrub(paint, tx - ox - ux * 0.55, gy - h0, tz - oz - uz * 0.55)
                placed += 1
            next_at += 8.5
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
        ((0.94, 0.58, 0.68), 0, True, 1.45, 2.4),
        ((0.96, 0.95, 0.92), 2, False, 1.55, 2.4),
        ((0.42, 0.70, 0.88), 1, False, 1.35, 2.2),
        ((0.96, 0.78, 0.28), 0, True, 1.4, 2.4),
    ]
    # East of the postcard block the trolley looks down a low shopfront street.
    plain = [
        ((0.90, 0.90, 0.88), 2, False, 0.38, 0.45),
        ((0.78, 0.86, 0.92), 2, False, 0.38, 0.45),
        ((0.94, 0.93, 0.90), 2, False, 0.32, 0.4),
        ((0.64, 0.78, 0.86), 2, False, 0.38, 0.45),
    ]
    west = sorted((b for b in picked if b["c"][0] < -7120), key=lambda b: b["c"][0])
    east = [b for b in picked if b["c"][0] >= -7120]
    # The postcard camera stands north of this row and looks south, so the
    # eastern building is on the left. Pink, white, sky, yellow run left to
    # right across Loft, Yolo, Oils and The Athlete's Foot.
    postcard_colors = {
        -7215.3: photo[0],
        -7222.9: photo[1],
        -7228.3: photo[1],
        -7235.1: photo[2],
        -7243.2: photo[3],
    }
    for i, b in enumerate(west):
        key = min(postcard_colors, key=lambda x: abs(x - b["c"][0]), default=None)
        if key is not None and abs(key - b["c"][0]) < 0.8:
            col, kind, bal, scale, lip = postcard_colors[key]
        else:
            col, kind, bal, scale, lip = photo[i % 4]
        b["color"] = col
        b["gable"] = kind
        b["balcony"] = bal
        b["gscale"] = scale
        b["lip"] = lip
    for i, b in enumerate(east):
        col, kind, bal, scale, lip = plain[i % 4]
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
    cams = street_cameras(picked, ped)
    return written, cams


def street_cameras(picked, ped):
    """Postcard row is frontal; the trolley shot looks west down the tracks."""
    # The postcard row is the south-side shops facing north (Loft, Yolo, and
    # the next fronts). Standing north of them looks south at the gables.
    row = [
        b for b in picked
        if b["edge"][5][1] < 0 and -7248 < b["c"][0] < -7208
    ]
    row.sort(key=lambda b: b["c"][0])
    cams = {}
    if len(row) >= 3:
        ox = oz = nx = nz = 0.0
        grounds = []
        for b in row:
            _s, _i, a, bb, _L, outward, _d = b["edge"]
            ox += (a[0] + bb[0]) * 0.5
            oz += (a[1] + bb[1]) * 0.5
            nx += outward[0]
            nz += outward[1]
            grounds.append(D.height_at(*b["c"]))
        n = len(row)
        ox, oz, nx, nz = ox / n, oz / n, nx / n, nz / n
        ln = math.hypot(nx, nz) or 1
        nx, nz = nx / ln, nz / ln
        ground = sum(grounds) / n
        # Slide along the row so a median palm is not dead-centre.
        along = (-nz, nx)
        # Centre the four fronts. The photo is taken from across the tracks,
        # low enough that the brick and rails sit in the foreground.
        ox += along[0] * -2.0
        oz += along[1] * -2.0
        stand = (ox + nx * 18.0, oz + nz * 18.0)
        print(
            f"  CAM postcard {stand[0]:.2f},{stand[1]:.2f} look {ox:.2f},{oz:.2f} "
            f"h {D.height_at(*stand):.2f} facade {ground:.2f} n={n} out {nx:.2f},{nz:.2f}"
        )
        # Viewpoint locked to the tram postcard: gables ahead, tracks in front,
        # the streetcar itself off the left edge of the frame.
        cams["postcard"] = {
            "stand": [-7245.48, -19.04],
            "eye": [-7245.48, 1.7, -19.04],
            "look": [-7239.22, ground + 4.2, -1.43],
            "fov": 64,
        }
    # Operator view, heading west. This stretch is the straight brick run
    # with the tracks in the centre, past the shelter that blocks point 18.
    if len(ped) > 15:
        ax, az = ped[15]
        lx, lz = ped[12]
        print(f"  CAM trolley {ax:.2f},{az:.2f} look {lx:.2f},{lz:.2f} h {D.height_at(ax, az):.2f}")
        cams["trolley"] = {
            "stand": [ax, az],
            "eye": [ax, 1.55, az],
            "look": [lx, D.height_at(lx, lz) + 1.45, lz],
            "fov": 50,
        }
    return cams


def bury(hero_id):
    """Keep the manifest id, but stop the mesh drawing in the street."""
    paint = D.Prim()
    D.box(paint, 0, -4.0, 0, 0.12, 0.12, 0.12, (0.5, 0.5, 0.5))
    glb = D.Glb(hero_id)
    glb.mat("paint", rough=0.9)
    glb.add(paint, "paint")
    glb.lod1_prim = paint
    data, tris = glb.pack()
    (HERO / f"{hero_id}.glb").write_bytes(data)
    print("buried", hero_id, tris)
    return tris


def refresh_mallface():
    """Drop the Royal Plaza and Renaissance arcade banners.

    Those signs and columns sat in front of the photo-matched facades.
    The seaport colonnade on the same hero stays.
    """
    import build_batch2 as B

    files = ("r_3_11.json", "r_3_12.json", "r_4_11.json", "r_4_12.json", "r_4_13.json")
    chain = B.chain_lines(B.load_named(("L.G. Smith",), files))
    samples = B.walk_chain(chain, 8.0)
    built = B.build_malls(chain, samples)
    if not built:
        raise SystemExit("mallface rebuild failed")
    glb, _origin = built
    data, tris = glb.pack()
    (HERO / "ora_mallface.glb").write_bytes(data)
    print("mallface seaport-only", tris)
    return tris


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
    cams = {}
    only = set(sys.argv[1:])
    if not only or "royal" in only:
        royal_tris, royal_cams = build_royal(smith)
        cams.update(royal_cams)
    if not only or "renaissance" in only:
        ren_tris, ren_cams = build_renaissance(smith)
        cams.update(ren_cams)
    if not only or "crowns" in only:
        crown_tris = quiet_crowns()
    canopy_tris = bollard_tris = mall_tris = None
    if not only or "street" in only:
        gables, street_cams = dress_main_street()
        cams.update(street_cams)
        canopy_tris = bury("ora_canopies")
        bollard_tris = bury("dt_bollards0")
    if not only or "mallface" in only or "royal" in only:
        mall_tris = refresh_mallface()
    updates = {}
    if royal_tris:
        updates["royalplaza"] = {
            "status": "v8-photo",
            "tris": {"royalplaza_lod0": royal_tris[0], "royalplaza_lod1": royal_tris[1]},
            "textures": 1,
            "ref_sources": ROYAL_REFS,
            # Link the existing landmark so its facade billboard and pylon
            # take noSign. new_place was leaving that pink ROYAL PLAZA board up.
            "new_place": False,
            "sign": False,
        }
    if ren_tris:
        updates["renmall"] = {
            "status": "v8-photo",
            "tris": {"renmall_lod0": ren_tris[0], "renmall_lod1": ren_tris[1]},
            "textures": 0,
            "ref_sources": REN_REFS,
        }
    if canopy_tris:
        updates["ora_canopies"] = {
            "status": "v8-photo",
            "name": "Main Street canopies removed; the postcard and trolley views have none",
            "tris": {"ora_canopies_lod0": canopy_tris[0], "ora_canopies_lod1": canopy_tris[1]},
            "textures": 0,
        }
    if bollard_tris:
        updates["dt_bollards0"] = {
            "status": "v8-photo",
            "name": "Coloured cone bollards removed; they are not in the Main Street photos",
            "tris": {"dt_bollards0_lod0": bollard_tris[0], "dt_bollards0_lod1": bollard_tris[1]},
            "textures": 0,
        }
    if mall_tris:
        updates["ora_mallface"] = {
            "status": "v8-photo",
            "name": "Seaport colonnade; Royal Plaza and Renaissance arcades folded into those facades",
            "tris": {"ora_mallface_lod0": mall_tris[0], "ora_mallface_lod1": mall_tris[1]},
            "textures": 1,
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
    if cams:
        Path("/tmp/fronts-cams.json").write_text(json.dumps(cams, indent=1))
        print("cameras", ", ".join(cams))
    print("patched", ", ".join(updates))


if __name__ == "__main__":
    main()
