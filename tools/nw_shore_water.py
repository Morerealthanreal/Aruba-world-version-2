#!/usr/bin/env python3
"""Nearshore water for Malmok, Boca Catalina and Arashi.

The sea shader is left alone. These heroes are opaque sheets sitting just
above the water plane, so the phone still draws the open sea past the band.
Sheets follow the DEM waterline: pale turquoise over the sand shelf, dark
reef patches further out, and small foam wedges only where rock meets the
water. Three snorkel boats moor in the Malmok turquoise. A line of yellow
spars steps toward the Antilla moorings and stops short of the wreck hero.

No second search pin, no second wreck, no textures. Origins use a truthy y
so the loader does not snap the mesh onto a DEM spike.
"""

from __future__ import annotations

import json
import math
import os
import re
import struct

import numpy as np
from PIL import Image

import hero_glb
from hero_glb import Model, box, check_glb, write_glb

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
REAL = os.path.join(ROOT, "game", "data", "real")
HERO = os.path.join(ROOT, "game", "models", "hero")
MANIFEST = os.path.join(ROOT, "game", "data", "hero", "manifest.json")

X0, Z0 = -10800.0, -11800.0
LAT0, LON0 = 12.52, -69.97
Y0 = 0.35
SHEET_Y = 0.07
FOAM_Y = 0.13
FAR_MAX = 620.0

PALE = (0.25, 0.78, 0.73)
AQUA = (0.13, 0.62, 0.64)
AQUA2 = (0.07, 0.46, 0.56)
REEF = (0.035, 0.15, 0.26)
DEEP = (0.02, 0.11, 0.20)
FOAM = (0.92, 0.94, 0.93)
ROCK = (0.11, 0.10, 0.09)
ROCK_W = (0.28, 0.27, 0.25)
HULL = (0.94, 0.95, 0.93)
HULL_D = (0.78, 0.81, 0.83)
DECK = (0.62, 0.50, 0.36)
GLASS = (0.18, 0.30, 0.38)
CANOPY = (0.16, 0.40, 0.68)
MAST = (0.88, 0.89, 0.90)
BUOY = (0.93, 0.72, 0.08)
BUOY_W = (0.94, 0.94, 0.92)
SPAR = (0.75, 0.76, 0.78)
LINE = (0.16, 0.16, 0.17)

_IM: dict[tuple[int, int], np.ndarray] = {}


def ll(lat: float, lon: float) -> tuple[float, float]:
    x = (lon - LON0) * 111320.0 * math.cos(math.radians(lat))
    z = -(lat - LAT0) * 110540.0
    return x, z


def height(x: float, z: float) -> float:
    rx = math.floor((x - X0) / 1000.0)
    rz = math.floor((z - Z0) / 1000.0)
    key = (rx, rz)
    im = _IM.get(key)
    if im is None:
        path = os.path.join(REAL, f"h_{rx}_{rz}.png")
        if not os.path.exists(path):
            return 0.0
        rgb = np.asarray(Image.open(path).convert("RGB"), dtype=np.float32)
        _IM[key] = (rgb[:, :, 0] * 256.0 + rgb[:, :, 1]) / 100.0 - 50.0
        im = _IM[key]
    ox, oz = X0 + rx * 1000.0, Z0 + rz * 1000.0
    s = min(249.001, max(0.0, (x - ox) / 4.0))
    c = min(249.001, max(0.0, (z - oz) / 4.0))
    l, u = int(s), int(c)
    d, f = s - l, c - u
    h00, h10 = float(im[u, l]), float(im[u, l + 1])
    h01, h11 = float(im[u + 1, l]), float(im[u + 1, l + 1])
    return (h00 * (1 - d) + h10 * d) * (1 - f) + (h01 * (1 - d) + h11 * d) * f


_SHORE: dict[float, float | None] = {}


def shore_x(z: float) -> float | None:
    """First land encountered walking east from deep water."""
    key = round(z, 1)
    if key in _SHORE:
        return _SHORE[key]
    x = -9800.0
    prev = height(x, z)
    while x < -8200.0:
        nxt = x + 2.0
        h = height(nxt, z)
        if prev <= 0.18 and h > 0.18:
            t = (0.18 - prev) / (h - prev + 1e-9)
            hit = x + t * 2.0
            _SHORE[key] = hit
            return hit
        prev = h
        x = nxt
    _SHORE[key] = None
    return None


def slope_width(z: float, shore: float) -> float:
    """Metres inland from the waterline until the shelf is 1.2 m up. Steep rock is a short run."""
    for i in range(0, 70):
        if height(shore + i, z) >= 1.2:
            return float(i)
    return 70.0


class Hero:
    def __init__(self, name: str, ox: float, oz: float):
        self.name = name
        self.ox = ox
        self.oz = oz
        self.y0 = Y0
        self.model = Model(name)
        self.far = 0.0
        self.seen: set[tuple] = set()
        # Sheet colours blend over the live sea so the ripple stays visible.
        # Boats, rocks and buoys stay opaque.
        specs = {
            "pale": (PALE, 0.38, 0.55),
            "aqua": (AQUA, 0.4, 0.4),
            "aqua2": (AQUA2, 0.42, 0.4),
            "reef": (REEF, 0.55, 0.72),
            "deep": (DEEP, 0.5, 0.72),
            "foam": (FOAM, 0.62, 1.0),
            "rock": (ROCK, 0.86),
            "rockw": (ROCK_W, 0.7),
            "hull": (HULL, 0.4),
            "hulld": (HULL_D, 0.48),
            "deck": (DECK, 0.72),
            "glass": (GLASS, 0.25),
            "canopy": (CANOPY, 0.55),
            "mast": (MAST, 0.45),
            "buoy": (BUOY, 0.42),
            "buoyw": (BUOY_W, 0.38),
            "spar": (SPAR, 0.5),
            "line": (LINE, 0.7, 1.0),
        }
        for mat, spec in specs.items():
            if "water" in mat:
                raise SystemExit(mat)
            rgb, rough = spec[0], spec[1]
            alpha = spec[2] if len(spec) > 2 else 1.0
            self.model.material(mat, rgb, rough, alpha=alpha)

    def note(self, x: float, z: float) -> None:
        self.far = max(self.far, math.hypot(x - self.ox, z - self.oz))

    def loc(self, x: float, y: float, z: float) -> tuple[float, float, float]:
        self.note(x, z)
        return (x - self.ox, y - self.y0, z - self.oz)

    def sheet(self, lod: int, mat: str, x0: float, z0: float, x1: float, z1: float, y: float) -> None:
        if x1 - x0 < 0.4 or z1 - z0 < 0.4:
            return
        key = (lod, round(x0, 2), round(z0, 2), mat)
        if key in self.seen:
            raise SystemExit(f"overlapping sheet {key}")
        self.seen.add(key)
        a = self.loc(x0, y, z0)
        b = self.loc(x1, y, z0)
        c = self.loc(x1, y, z1)
        d = self.loc(x0, y, z1)
        mesh = self.model.mesh(lod, mat)
        # Upward face. quad(a,b,c) would point down for this corner order.
        mesh.quad(a, d, c, b)
        if mesh.nrm[-1][1] < 0.9:
            raise SystemExit(f"sheet normal {mesh.nrm[-1]}")

    def add_box(self, lod: int, mat: str, cx: float, cy: float, cz: float, sx: float, sy: float, sz: float) -> None:
        if sx < 1e-3 or sy < 1e-3 or sz < 1e-3:
            return
        box(self.model.mesh(lod, mat), cx - self.ox, cy - self.y0, cz - self.oz, sx, sy, sz)
        self.note(cx - sx * 0.5, cz - sz * 0.5)
        self.note(cx + sx * 0.5, cz + sz * 0.5)

    def add_obox(self, lod: int, mat: str, cx: float, cy: float, cz: float, sx: float, sy: float, sz: float, yaw: float) -> None:
        if sx < 1e-3 or sy < 1e-3 or sz < 1e-3:
            return
        c, s = math.cos(yaw), math.sin(yaw)
        hx, hy, hz = sx / 2.0, sy / 2.0, sz / 2.0

        def p(lx: float, ly: float, lz: float) -> tuple[float, float, float]:
            return self.loc(cx + lx * c - lz * s, cy + ly, cz + lx * s + lz * c)

        lbf, rbf = p(-hx, -hy, -hz), p(hx, -hy, -hz)
        ltf, rtf = p(-hx, hy, -hz), p(hx, hy, -hz)
        lbb, rbb = p(-hx, -hy, hz), p(hx, -hy, hz)
        ltb, rtb = p(-hx, hy, hz), p(hx, hy, hz)
        mesh = self.model.mesh(lod, mat)
        mesh.quad(rbf, rbb, rtb, rtf)
        mesh.quad(lbb, lbf, ltf, ltb)
        mesh.quad(ltf, rtf, rtb, ltb)
        mesh.quad(lbf, lbb, rbb, rbf)
        mesh.quad(lbb, ltb, rtb, rbb)
        mesh.quad(lbf, rbf, rtf, ltf)


def near_any(x: float, z: float, pts: list[tuple[float, float, float]]) -> bool:
    for px, pz, r in pts:
        if (x - px) ** 2 + (z - pz) ** 2 < r * r:
            return True
    return False


# Dark reef as a few ovals, not a per-cell checker. dz/offshore are metres from the beach node.
REEF_BARS = {
    "malmok": ((-22.0, 44.0, 15.0, 7.0), (24.0, 60.0, 16.0, 7.5), (50.0, 32.0, 9.0, 4.5), (-48.0, 28.0, 8.0, 4.0)),
    "boca": ((0.0, 26.0, 8.0, 4.5), (-30.0, 14.0, 7.0, 3.5)),
    "arashi": ((-55.0, 30.0, 16.0, 5.5), (12.0, 38.0, 12.0, 4.5), (58.0, 22.0, 9.0, 3.5)),
}


def reef_bar(kind: str, x: float, z: float, notch: float) -> bool:
    for dz, off, rz, rx in REEF_BARS[kind]:
        zc = notch + dz
        shore = shore_x(zc)
        if shore is None:
            continue
        cx = shore - off
        if ((x - cx) / rx) ** 2 + ((z - zc) / rz) ** 2 <= 1.0:
            return True
    return False


def water_row(kind: str, z: float, shore: float, notch: float) -> tuple[float, float, bool]:
    """Inner gap (metres offshore where sheets start), outer reach, and whether this row is rock."""
    sl = slope_width(z, shore)
    wobble = 8.0 * math.sin(z * 0.037) + 4.0 * math.sin(z * 0.11)
    edge = 1.8 * math.sin(z * 0.17) + 1.1 * math.sin(z * 0.29)
    dist = abs(z - notch)
    steep = sl < 14.0
    if kind == "malmok":
        inner = 5.0 + edge
        if dist < 40.0:
            return inner, 98.0 + wobble, steep
        if dist < 78.0:
            return inner + 1.0, 50.0 + wobble * 0.5, steep
        return inner + 1.5, 34.0 + wobble * 0.35, steep
    if kind == "boca":
        # A short band along the stair, and a darker ribbon on the limestone. A wide slab
        # reads as a rectangle from the cliff top, so the open cove stays the live sea.
        if dist < 22.0:
            return 3.8 + edge * 0.25, 22.0 + wobble * 0.15, False
        if steep or dist < 55.0:
            return 3.2, 11.0 + 2.2 * math.sin(z * 0.21), True
        return 4.5, 16.0, False
    return 5.5 + edge, 58.0 + wobble * 0.7, False


def sheet_mat(kind: str, rock: bool, d: float, x: float, z: float, notch: float) -> str:
    """Two shore-parallel colours plus a few reef ovals. No per-cell noise and no holes."""
    if rock and d < 16.0:
        return "reef"
    if reef_bar(kind, x, z, notch) and d > 10.0:
        return "reef"
    # Malmok boats sit 48–76 m out, still in the turquoise rather than the open sea.
    split = 46.0 + 4.0 * math.sin(z * 0.041) if kind == "malmok" else 30.0 + 3.0 * math.sin(z * 0.05)
    return "pale" if d < split else "aqua"


def emit_water(hero: Hero, kind: str, z0: float, z1: float, notch: float, blocks: list[tuple[float, float, float]], step: float, lod: int) -> int:
    """Lattice sheets that share edges, then merged into shore-parallel runs.

    Boca is skipped: from the cliff a colour slab reads as a panel. The cove keeps
    the live sea, and this hero only adds the cliff wash and the in-water rocks.
    """
    if kind == "boca":
        return 0
    cells: dict[tuple[int, int], str] = {}
    iz0 = math.floor(z0 / step)
    iz1 = math.floor((z1 - 0.01) / step)
    for iz in range(iz0, iz1 + 1):
        zc = (iz + 0.5) * step
        if zc < z0 or zc > z1:
            continue
        shore = shore_x(zc)
        if shore is None:
            continue
        inner, outer, rock = water_row(kind, zc, shore, notch)
        if outer < inner + step:
            continue
        ix0 = math.floor((shore - outer) / step)
        ix1 = math.floor((shore - inner) / step)
        for ix in range(ix0, ix1 + 1):
            x0 = ix * step
            x1 = x0 + step
            xc = x0 + step * 0.5
            if x1 > shore - inner:
                continue
            if xc < shore - outer:
                continue
            if height(xc, zc) > 0.4:
                continue
            if near_any(xc, zc, blocks):
                continue
            d = shore - xc
            cells[(ix, iz)] = sheet_mat(kind, rock, d, xc, zc, notch)
    n = 0
    rows: dict[int, list[tuple[int, str]]] = {}
    for (ix, iz), mat in cells.items():
        rows.setdefault(iz, []).append((ix, mat))
    for iz, row in rows.items():
        row.sort()
        z_a = iz * step
        z_b = z_a + step
        i = 0
        while i < len(row):
            ix, mat = row[i]
            j = i + 1
            while j < len(row) and row[j][0] == row[j - 1][0] + 1 and row[j][1] == mat:
                j += 1
            x_a = ix * step
            x_b = row[j - 1][0] * step + step
            hero.sheet(lod, mat, x_a, z_a, x_b, z_b, SHEET_Y)
            n += 1
            i = j
    return n


def add_foam(hero: Hero, x: float, z: float, sx: float, sz: float, lods: tuple[int, ...]) -> None:
    for lod in lods:
        hero.sheet(lod, "foam", x - sx * 0.5, z - sz * 0.5, x + sx * 0.5, z + sz * 0.5, FOAM_Y)


def add_rock(hero: Hero, x: float, z: float, sx: float, top: float, sz: float, yaw: float) -> None:
    cy = -0.02 + top * 0.5
    hero.add_obox(0, "rock", x, cy, z, sx, top, sz, yaw)
    hero.add_obox(0, "rockw", x, top - 0.08, z, sx * 0.72, 0.1, sz * 0.72, yaw)
    hero.add_obox(1, "rock", x, cy, z, sx, top * 0.85, sz, yaw)
    # Wash on the shore side of the nub (east, +x).
    add_foam(hero, x + sx * 0.45 + 0.7, z, 1.15, 0.7, (0, 1))
    add_foam(hero, x + 0.2, z + sz * 0.3, 0.8, 0.5, (0,))


def place_rocks(spec: list[tuple[float, float, float, float, float, float]], notch_z: float, avoid: list[tuple[float, float, float]]) -> list[tuple[float, float, float]]:
    """spec rows: dz, offshore, sx, top, sz, yaw. Returns block radii for the sheets."""
    placed = []
    for dz, off, sx, top, sz, yaw in spec:
        z = notch_z + dz
        shore = shore_x(z)
        if shore is None:
            continue
        x = shore - off
        for _ in range(8):
            if height(x, z) < -0.05:
                break
            x -= 2.0
        if height(x, z) > 0.02:
            continue
        if near_any(x, z, avoid):
            continue
        placed.append((x, z, sx, top, sz, yaw))
        avoid.append((x, z, max(sx, sz) * 0.5 + 2.2))
    return [(p[0], p[1], max(p[2], p[4]) * 0.42) for p in placed], placed


def add_buoy(hero: Hero, x: float, z: float, scale: float = 1.0, flag: bool = True) -> None:
    r = 0.85 * scale
    y = 0.42
    hero.add_box(0, "buoy", x, y + r * 0.35, z, r * 2.0, r * 1.15, r * 2.0)
    hero.add_box(0, "buoyw", x, y + r * 0.55, z, r * 2.15, r * 0.28, r * 2.15)
    top = y + 6.4 * scale
    hero.add_box(0, "spar", x, (y + top) * 0.5, z, 0.08, top - y, 0.08)
    if flag:
        hero.add_box(0, "buoy", x, top - 0.55 * scale, z + 0.7 * scale, 0.06, 0.9 * scale, 1.5 * scale)
    hero.add_box(1, "buoy", x, y + r * 0.4, z, r * 2.0, r * 1.2, r * 2.0)
    hero.add_box(1, "spar", x, (y + r + top) * 0.5, z, 0.1, top - (y + r), 0.1)
    if flag:
        hero.add_box(1, "buoy", x, top - 0.5 * scale, z + 0.65 * scale, 0.08, 0.8 * scale, 1.4 * scale)


def add_cat(hero: Hero, x: float, z: float, yaw: float, canopy: bool, mast_h: float) -> None:
    # Local +Z is the hull length. Yaw swings that axis so both hulls read from the beach.
    def hull_at(side: float, lod: int) -> None:
        c, s = math.cos(yaw), math.sin(yaw)
        hx = x + side * c
        hz = z + side * s
        hero.add_obox(lod, "hull", hx, 0.64, hz, 0.92, 0.78, 11.2, yaw)
        hero.add_obox(lod, "hulld", hx, 0.38, hz, 0.98, 0.14, 11.0, yaw)

    mast_x = x - 0.4 * math.sin(yaw)
    mast_z = z + 0.4 * math.cos(yaw)
    for lod in (0, 1):
        hull_at(1.45, lod)
        hull_at(-1.45, lod)
        hero.add_obox(lod, "deck", x, 1.10, z, 3.5, 0.1, 7.6, yaw)
        hero.add_obox(lod, "mast", mast_x, 1.14 + mast_h * 0.5, mast_z, 0.1, mast_h, 0.1, 0.0)
    if canopy:
        c, s = math.cos(yaw), math.sin(yaw)
        hero.add_obox(0, "canopy", x + 1.2 * s, 2.35, z + 1.2 * c, 3.3, 0.08, 3.6, yaw)
        for lx, lz in ((-1.4, 0.2), (1.4, 0.2), (-1.4, 2.6), (1.4, 2.6)):
            hero.add_box(0, "mast", x + lx * c - lz * s, 1.7, z + lx * s + lz * c, 0.06, 1.25, 0.06)
    # Buoy just west of the hulls, with a short line that starts outside the bow.
    bow_x = x - 8.4
    buoy_x = x - 14.0
    add_buoy(hero, buoy_x, z + 1.4, scale=0.55, flag=False)
    hero.add_box(0, "line", (bow_x + buoy_x) * 0.5, 0.36, z + 0.7, abs(buoy_x - bow_x), 0.05, 0.05)


def add_mono(hero: Hero, x: float, z: float, yaw: float, mast_h: float) -> None:
    for lod in (0, 1):
        hero.add_obox(lod, "hull", x, 0.68, z, 2.15, 0.86, 10.4, yaw)
        hero.add_obox(lod, "hulld", x, 0.40, z, 2.25, 0.14, 10.2, yaw)
        hero.add_obox(lod, "mast", x, 1.16 + mast_h * 0.5, z - 1.5, 0.1, mast_h, 0.1, 0.0)
    hero.add_obox(0, "hull", x, 1.68, z + 0.7, 1.85, 1.05, 3.3, yaw)
    hero.add_obox(0, "glass", x + 0.98, 1.78, z + 0.7, 0.06, 0.4, 1.25, yaw)
    hero.add_obox(0, "glass", x - 0.98, 1.78, z + 0.7, 0.06, 0.4, 1.25, yaw)
    hero.add_obox(1, "hull", x, 1.62, z + 0.6, 1.7, 0.9, 3.0, yaw)
    bow_x = x - 8.0
    buoy_x = x - 13.5
    add_buoy(hero, buoy_x, z - 1.0, scale=0.5, flag=False)
    hero.add_box(0, "line", (bow_x + buoy_x) * 0.5, 0.36, z - 0.5, abs(buoy_x - bow_x), 0.05, 0.05)


def existing_malmok_buoys() -> list[tuple[float, float]]:
    mx, mz = ll(12.60076, -70.05077)
    sea = mx
    while sea > mx - 80 and height(sea, mz) > 1.15:
        sea -= 2.0
    cx, cz = sea - 4.0, mz
    wx = cx - 2.0
    while wx > cx - 50 and height(wx, cz) > 0.15:
        wx -= 2.0
    return [(wx - 5.0, cz - 2.0), (wx - 3.0, cz + 3.5)]


def existing_boca_buoys() -> list[tuple[float, float]]:
    bx, bz = ll(12.60618, -70.05238)
    cliff = bx - 12.0
    x = bx + 20.0
    while x > bx - 50.0:
        if height(x, bz) > 1.5 and height(x - 3.0, bz) < 0.3:
            cliff = x - 1.0
            break
        x -= 1.0
    wx = cliff - 1.0
    while wx > cliff - 30.0 and height(wx, bz) > 0.05:
        wx -= 2.0
    return [(wx - 8.0, bz - 3.0), (wx - 5.0, bz + 4.0)]


def existing_antilla() -> tuple[tuple[float, float], list[tuple[float, float]]]:
    ax, az = ll(12.60205, -70.05782)
    dx, dz = -8820.0 - ax, -8927.0 - az
    span = math.hypot(dx, dz) or 1.0
    fx, fz = dx / span, dz / span
    px, pz = -fz, fx
    buoys = []
    for t in (-52.0, -16.0, 14.0, 56.0):
        buoys.append((ax + fx * t + px * -12.0, az + fz * t + pz * -12.0))
    return (ax, az), buoys


def antilla_line(notch_x: float, notch_z: float, existing: list[tuple[float, float]]) -> list[tuple[float, float]]:
    near = min(existing, key=lambda p: math.hypot(p[0] - notch_x, p[1] - notch_z))
    dx, dz = near[0] - notch_x, near[1] - notch_z
    span = math.hypot(dx, dz)
    ux, uz = dx / span, dz / span
    out = []
    for dist in (150.0, 230.0, 315.0, 400.0, 485.0):
        if dist > span - 140.0:
            break
        x = notch_x + ux * dist
        z = notch_z + uz * dist
        out.append((x, z))
    if len(out) < 4:
        raise SystemExit(f"antilla line too short ({len(out)}) span {span:.0f}")
    for x, z in out:
        for ex, ez in existing:
            if math.hypot(x - ex, z - ez) < 120.0:
                raise SystemExit(f"buoy {(x, z)} collides with existing {(ex, ez)}")
    return out


def stand_on(z: float, shore: float) -> tuple[float, float]:
    x = shore + 1.5
    for _ in range(36):
        h = height(x, z)
        if 0.65 <= h <= 2.6:
            return x, h
        x += 1.2
    return shore + 10.0, height(shore + 10.0, z)


def build_beach(name: str, kind: str, z0: float, z1: float, notch: float, blocks: list[tuple[float, float, float]], extras: list[tuple[float, float]]) -> tuple[Hero, dict]:
    shore = shore_x(notch)
    if shore is None:
        raise SystemExit(f"no shore at {notch}")
    pts = list(extras)
    for z in (z0, notch, z1):
        sh = shore_x(z)
        if sh is None:
            continue
        inner, outer, _rock = water_row(kind, z, sh, notch)
        pts.append((sh - inner, z))
        pts.append((sh - outer, z))
    anchor = (shore + 8.0, notch)
    ox, oz = pick_origin(pts, anchor)
    hero = Hero(name, ox, oz)
    # Rocks stay in the blocks list so a sheet does not cut through a nub.
    n0 = emit_water(hero, kind, z0, z1, notch, blocks, 3.0, 0)
    n1 = emit_water(hero, kind, z0, z1, notch, blocks, 6.0, 1)
    info = {
        "shore": shore,
        "origin": (ox, oz),
        "sheets": (n0, n1),
        "anchor": anchor,
        "stand": stand_on(notch, shore),
    }
    return hero, info


def pick_origin(pts: list[tuple[float, float]], anchor: tuple[float, float]) -> tuple[float, float]:
    ox = sum(p[0] for p in pts) / len(pts)
    oz = sum(p[1] for p in pts) / len(pts)
    da = math.hypot(anchor[0] - ox, anchor[1] - oz)
    if da > 640.0:
        t = 620.0 / da
        ox = anchor[0] + (ox - anchor[0]) * t
        oz = anchor[1] + (oz - anchor[1]) * t
    for _ in range(8):
        far = max(pts, key=lambda p: math.hypot(p[0] - ox, p[1] - oz))
        df = math.hypot(far[0] - ox, far[1] - oz)
        if df <= FAR_MAX - 30.0:
            break
        ox = ox * 0.72 + far[0] * 0.28
        oz = oz * 0.72 + far[1] * 0.28
        da = math.hypot(anchor[0] - ox, anchor[1] - oz)
        if da > 660.0:
            t = 640.0 / da
            ox = anchor[0] + (ox - anchor[0]) * t
            oz = anchor[1] + (oz - anchor[1]) * t
    return ox, oz


def finish(hero: Hero, anchor: tuple[float, float]) -> dict:
    if hero.far > FAR_MAX:
        raise SystemExit(f"{hero.name} far {hero.far:.1f} > {FAR_MAX}")
    da = math.hypot(anchor[0] - hero.ox, anchor[1] - hero.oz)
    if da > 690.0:
        raise SystemExit(f"{hero.name} beach is {da:.0f} m from the origin")
    if hero.model.tri_count(0) < 1 or hero.model.tri_count(1) < 1:
        raise SystemExit(f"{hero.name} missing a LOD")
    path = os.path.join(HERO, f"{hero.name}.glb")
    info = write_glb(hero.model, path)
    check_glb(path)
    info["far"] = round(hero.far, 1)
    info["beach_m"] = round(da, 1)
    return info


def entry(bid: str, x: float, z: float, tris: dict, refs: str) -> dict:
    return {
        "id": bid,
        "k": bid,
        "status": "v1-nw-shore-water",
        "x": round(x, 2),
        "z": round(z, 2),
        "y": Y0,
        "rotation": 0,
        "glb": f"models/hero/{bid}.glb",
        "lod": {"hi": f"{bid}_lod0", "lo": f"{bid}_lod1", "switch_m": 560},
        "tris": {f"{bid}_lod0": tris["lod0"], f"{bid}_lod1": tris["lod1"]},
        "textures": 0,
        "hide_footprint": None,
        "hide": [],
        "sign": False,
        "kind": "replace",
        "new_place": False,
        "geo_source": "Aruba DEM waterline (game height tiles); colours from Malmok and Arashi shore photos",
        "ref_sources": refs,
        "frame": "glb origin offshore so y stays at sea level; glTF +X = world x, +Z = world z, Y up; generated by tools/nw_shore_water.py",
        "cat": "landmark",
        "name": "",
    }


def _object_end(raw: str, brace: int) -> int:
    depth = 0
    i = brace
    in_str = False
    esc = False
    while i < len(raw):
        ch = raw[i]
        if in_str:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == '"':
                in_str = False
        else:
            if ch == '"':
                in_str = True
            elif ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    return i
        i += 1
    raise SystemExit("unbalanced manifest object")


def cut_prefix(raw: str) -> str:
    """Drop only nw_sw_ objects. Every other hero stays byte-for-byte."""
    while True:
        m = re.search(r'"id": "nw_sw_', raw)
        if not m:
            break
        brace = raw.rfind("{", 0, m.start())
        if brace < 0:
            raise SystemExit("nw_sw_ id without an object")
        end = _object_end(raw, brace) + 1
        pre = raw.rfind(",", 0, brace)
        gap = raw[pre + 1 : brace] if pre >= 0 else ""
        if pre >= 0 and gap.strip() == "":
            raw = raw[:pre] + raw[end:]
        else:
            j = end
            while j < len(raw) and raw[j] in " \n\r\t":
                j += 1
            if j < len(raw) and raw[j] == ",":
                raw = raw[:brace] + raw[j + 1 :]
            else:
                raw = raw[:brace] + raw[end:]
    parsed = json.loads(raw)
    bad = [e.get("id") for e in parsed if str(e.get("id", "")).startswith("nw_sw_")]
    if bad:
        raise SystemExit(f"nw_sw_ still in manifest: {bad}")
    return raw


def append_entries(entries: list[dict]) -> None:
    raw = cut_prefix(open(MANIFEST, encoding="utf-8").read())
    base = json.loads(raw)
    body = raw.rstrip()
    if not body.endswith("]"):
        raise SystemExit("manifest does not end with ]")
    body = body[:-1].rstrip()
    if not body.endswith("}"):
        raise SystemExit("manifest tail is not an object")
    parts = []
    for e in entries:
        dumped = json.dumps(e, indent=1)
        parts.append("\n".join((" " + line) if line else line for line in dumped.split("\n")))
    out = body + ",\n" + ",\n".join(parts) + "\n]\n"
    parsed = json.loads(out)
    if parsed[: len(base)] != base:
        raise SystemExit("manifest prefix changed while appending nw_sw_ entries")
    ids = [e.get("id") for e in parsed]
    if ids[-len(entries) :] != [e["id"] for e in entries]:
        raise SystemExit(f"manifest tail {ids[-len(entries):]}")
    if len(parsed) != len(base) + len(entries):
        raise SystemExit("manifest count mismatch")
    open(MANIFEST, "w", encoding="utf-8").write(out)


def cliff_foam(hero: Hero, z0: float, z1: float, notch: float) -> int:
    n = 0
    z = z0
    while z < z1:
        shore = shore_x(z)
        if shore is not None:
            if slope_width(z, shore) < 14.0:
                add_foam(hero, shore - 2.3, z, 1.15, 0.65, (0, 1) if n % 2 == 0 else (0,))
                n += 1
        z += 7.5
    return n


def main() -> None:
    wreck, wreck_buoys = existing_antilla()
    swim_m = existing_malmok_buoys()
    swim_b = existing_boca_buoys()
    print(f"antilla wreck {wreck[0]:.1f},{wreck[1]:.1f}")
    print("antilla buoys", [(round(p[0], 1), round(p[1], 1)) for p in wreck_buoys])
    print("malmok swim", [(round(p[0], 1), round(p[1], 1)) for p in swim_m])
    print("boca swim", [(round(p[0], 1), round(p[1], 1)) for p in swim_b])

    malmok_z = -8927.0
    malmok_shore = shore_x(malmok_z)
    if malmok_shore is None:
        raise SystemExit("malmok shore missing")
    print(f"malmok shore {malmok_shore:.1f} slope {slope_width(malmok_z, malmok_shore):.0f}")

    avoid: list[tuple[float, float, float]] = [(p[0], p[1], 9.0) for p in swim_m + swim_b]
    rock_spec = [
        (-48, 11, 1.5, 0.42, 1.15, 0.4),
        (-34, 7, 1.8, 0.55, 1.3, 0.2),
        (-22, 15, 2.2, 0.62, 1.5, 1.0),
        (-12, 6, 1.3, 0.36, 1.0, 0.7),
        (4, 13, 1.7, 0.48, 1.25, 0.5),
        (16, 8, 2.0, 0.7, 1.4, 1.2),
        (28, 16, 1.4, 0.4, 1.1, 0.3),
        (42, 10, 1.9, 0.58, 1.35, 0.9),
        (-6, 18, 1.2, 0.32, 0.9, 0.6),
        (22, 5, 1.6, 0.46, 1.2, 1.5),
    ]
    blocks, rocks = place_rocks(rock_spec, malmok_z, avoid)
    # Boats sit in the turquoise, clear of the shallows nubs and the two swim buoys.
    boats = []
    for kind, dz, off, yaw in (
        ("cat", 30.0, 58.0, 0.52),
        ("mono", 2.0, 76.0, 0.16),
        ("canopy", -26.0, 48.0, -0.58),
    ):
        z = malmok_z + dz
        shore = shore_x(z)
        if shore is None:
            raise SystemExit("boat shore missing")
        x = shore - off
        while height(x, z) > -0.25 and off < 110:
            off += 4.0
            x = shore - off
        if height(x, z) > -0.15:
            raise SystemExit(f"boat {kind} still on land at {x:.0f},{z:.0f} h={height(x, z):.2f}")
        if near_any(x, z, avoid):
            raise SystemExit(f"boat {kind} overlaps a buoy or rock")
        boats.append((kind, x, z, yaw))
        avoid.append((x, z, 14.0))
        print(f"  boat {kind} {x:.1f},{z:.1f} h={height(x, z):.2f} off {off:.0f}")

    line = antilla_line(malmok_shore, malmok_z, wreck_buoys)
    for x, z in line:
        if near_any(x, z, [(b[1], b[2], 18.0) for b in boats]):
            raise SystemExit(f"line buoy hits a boat {x:.0f},{z:.0f}")
        d_wreck = math.hypot(x - wreck[0], z - wreck[1])
        print(f"  line buoy {x:.1f},{z:.1f} wreck {d_wreck:.0f} m")

    extras = [(p[0], p[1]) for p in line] + [(b[1], b[2]) for b in boats]
    hero, info = build_beach("nw_sw_malmok", "malmok", malmok_z - 90.0, malmok_z + 90.0, malmok_z, blocks, extras)
    for _x, _z, sx, top, sz, yaw in rocks:
        add_rock(hero, _x, _z, sx, top, sz, yaw)
    for kind, x, z, yaw in boats:
        if kind == "cat":
            add_cat(hero, x, z, yaw, canopy=False, mast_h=8.2)
        elif kind == "mono":
            add_mono(hero, x, z, yaw, mast_h=8.6)
        else:
            add_cat(hero, x, z, yaw, canopy=True, mast_h=9.4)
    for i, (x, z) in enumerate(line):
        add_buoy(hero, x, z, scale=1.15 if i < 3 else 1.3, flag=True)
    tri = finish(hero, info["anchor"])
    print(f"malmok sheets {info['sheets']} far {tri['far']} beach {tri['beach_m']} tris {tri['lod0']}/{tri['lod1']}")
    stand = info["stand"]
    print(f"CAM malmok eye {stand[0]:.1f},{stand[1]:.2f},{malmok_z:.1f} look {boats[2][1]:.1f},{boats[2][2]:.1f}")

    boca_z = -9526.0
    boca_shore = shore_x(boca_z)
    if boca_shore is None:
        raise SystemExit("boca shore missing")
    print(f"boca shore {boca_shore:.1f} slope {slope_width(boca_z, boca_shore):.0f}")
    for dz in (-40, -20, 0, 20, 40):
        sh = shore_x(boca_z + dz)
        if sh:
            print(f"  boca z {boca_z + dz:.0f} shore {sh:.0f} slope {slope_width(boca_z + dz, sh):.0f}")
    boca_blocks, boca_rocks = place_rocks(
        [
            (-8, 14, 1.4, 0.4, 1.1, 0.4),
            (6, 18, 1.6, 0.48, 1.2, 0.8),
            (0, 28, 1.2, 0.34, 1.0, 0.2),
        ],
        boca_z,
        [(p[0], p[1], 8.0) for p in swim_b],
    )
    hero_b, info_b = build_beach("nw_sw_boca", "boca", boca_z - 70.0, boca_z + 70.0, boca_z, boca_blocks, [])
    for rec in boca_rocks:
        add_rock(hero_b, *rec)
    foam_n = cliff_foam(hero_b, boca_z - 55.0, boca_z + 55.0, boca_z)
    tri_b = finish(hero_b, info_b["anchor"])
    print(f"boca sheets {info_b['sheets']} foam {foam_n} far {tri_b['far']} tris {tri_b['lod0']}/{tri_b['lod1']}")
    print(f"CAM boca eye {info_b['stand'][0]:.1f},{info_b['stand'][1]:.2f},{boca_z + 12:.1f}")

    arashi_z = -9908.0
    arashi_shore = shore_x(arashi_z)
    if arashi_shore is None:
        raise SystemExit("arashi shore missing")
    print(f"arashi shore {arashi_shore:.1f} slope {slope_width(arashi_z, arashi_shore):.0f}")
    arashi_blocks, arashi_rocks = place_rocks(
        [
            (-78, 12, 1.3, 0.34, 1.0, 0.5),
            (-36, 16, 1.6, 0.42, 1.15, 0.3),
            (-4, 9, 1.2, 0.3, 0.9, 1.1),
            (32, 18, 1.5, 0.4, 1.1, 0.7),
            (70, 11, 1.35, 0.36, 1.05, 0.4),
            (8, 22, 1.1, 0.28, 0.85, 0.9),
        ],
        arashi_z,
        [],
    )
    hero_a, info_a = build_beach("nw_sw_arashi", "arashi", arashi_z - 120.0, arashi_z + 110.0, arashi_z, arashi_blocks, [])
    for rec in arashi_rocks:
        add_rock(hero_a, *rec)
    tri_a = finish(hero_a, info_a["anchor"])
    print(f"arashi sheets {info_a['sheets']} rocks {len(arashi_rocks)} far {tri_a['far']} tris {tri_a['lod0']}/{tri_a['lod1']}")
    print(f"CAM arashi eye {info_a['stand'][0]:.1f},{info_a['stand'][1]:.2f},{arashi_z:.1f} shore {arashi_shore:.1f}")

    entries = [
        entry(
            "nw_sw_malmok",
            hero.ox,
            hero.oz,
            tri,
            "Malmok shallows: pale turquoise over the sand shelf, dark reef patches, black rock nubs with small foam, three moored snorkel boats (two cats, one cabin monohull) and five yellow spars stepping toward the Antilla moorings, short of the wreck hero.",
        ),
        entry(
            "nw_sw_boca",
            hero_b.ox,
            hero_b.oz,
            tri_b,
            "Boca Catalina cove: cliff wash and a few dark rocks in the water. The bowl keeps the live sea, because a colour slab read as a panel from the stair. The stair, sand pocket and two swim buoys stay where they are.",
        ),
        entry(
            "nw_sw_arashi",
            hero_a.ox,
            hero_a.oz,
            tri_a,
            "Arashi shallows: a wide pale band off the sand, scattered dark reef and a few wet rocks with foam. Palapas, huts and the gravel lot stay inland of the waterline.",
        ),
    ]
    append_entries(entries)
    print("manifest", [e["id"] for e in entries])


if __name__ == "__main__":
    main()
