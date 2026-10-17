#!/usr/bin/env python3
"""Rebuild hooiberg_steps as one continuous concrete flight.

The hero on main is scattered tilted green slabs with sand gaps. This keeps
the same id, origin and node names, and replaces the mesh with horizontal
green treads, white risers and cheeks, and pipe rails on both sides. The
flight follows the current terrain (the ~144 m hill). It does not raise the
DEM, and it does not touch the summit shed.
"""
import math
import re
import struct
from pathlib import Path

import hero_glb as G

ROOT = Path(__file__).resolve().parents[1]
REAL = ROOT / "game" / "data" / "real"
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"

X0, Z0, RS, PX = -10800.0, -11800.0, 1000.0, 4.0
STEPS_ORIGIN = (-2709.78, 333.95)

# Smoothed centreline of the existing stair, local to STEPS_ORIGIN.
# Summit is the small-z end. The true stair is not in OSM; this is the
# line already in the hero, so the flight stays on the path players know.
STAIR_LINE = [
    (0.27, -2.08),
    (-0.32, 2.40),
    (-1.57, 11.90),
    (-3.13, 23.79),
    (-4.70, 35.69),
    (-6.27, 47.59),
    (-7.83, 59.49),
    (-9.57, 71.62),
    (-11.22, 83.87),
    (-12.90, 95.94),
    (-14.47, 108.15),
    (-16.04, 120.04),
    (-17.48, 132.08),
    (-19.05, 144.29),
    (-20.53, 156.30),
    (-22.18, 168.55),
    (-23.75, 180.44),
    (-25.31, 192.34),
    (-26.88, 204.24),
    (-28.42, 215.93),
    (-28.91, 219.68),
    (-27.42, 224.44),
]


def sample_h(x, z, cache):
    rx, rz = math.floor((x - X0) / RS), math.floor((z - Z0) / RS)
    im = cache.get((rx, rz))
    if im is None:
        from PIL import Image
        im = Image.open(REAL / f"h_{rx}_{rz}.png").convert("RGB")
        cache[(rx, rz)] = im
    pix = im.load()
    o = (x - X0 - rx * RS) / PX
    s = (z - Z0 - rz * RS) / PX
    c = min(249, max(0, math.floor(o)))
    row = min(249, max(0, math.floor(s)))
    u, d = o - c, s - row

    def H(cc, ll):
        r, g, _b = pix[cc, ll]
        return (r * 256 + g) / 100 - 50

    p, m, h, g = H(c, row), H(c + 1, row), H(c, row + 1), H(c + 1, row + 1)
    return p + (m - p) * u + (h - p) * d + (p - m - h + g) * u * d


def quad_facing(mesh, a, b, c, d, outward):
    ax, ay, az = b[0] - a[0], b[1] - a[1], b[2] - a[2]
    bx, by, bz = c[0] - a[0], c[1] - a[1], c[2] - a[2]
    nx = ay * bz - az * by
    ny = az * bx - ax * bz
    nz = ax * by - ay * bx
    if nx * outward[0] + ny * outward[1] + nz * outward[2] < 0:
        mesh.quad(a, d, c, b)
    else:
        mesh.quad(a, b, c, d)


def _resample(line, step):
    pts = [line[0]]
    acc = 0.0
    for i in range(len(line) - 1):
        x0, z0 = line[i]
        x1, z1 = line[i + 1]
        seg = math.hypot(x1 - x0, z1 - z0)
        if seg < 1e-6:
            continue
        while acc + seg >= step:
            t = (step - acc) / seg
            pts.append((x0 + (x1 - x0) * t, z0 + (z1 - z0) * t))
            x0 += (x1 - x0) * t
            z0 += (z1 - z0) * t
            seg = math.hypot(x1 - x0, z1 - z0)
            acc = 0.0
            if seg < 1e-6:
                break
        acc += seg
    if math.hypot(pts[-1][0] - line[-1][0], pts[-1][1] - line[-1][1]) > step * 0.35:
        pts.append(line[-1])
    return pts


def _along(p, q):
    dx, dz = q[0] - p[0], q[1] - p[1]
    length = math.hypot(dx, dz) or 1.0
    return dx / length, dz / length


def build_stairs():
    """Climb from the road (large local z) to the summit. Treads stay horizontal."""
    line = list(reversed(STAIR_LINE))
    # A 36 cm run made a pipe segment per tread, and that mesh was heavy
    # enough to stall the phone soak when the route passes the hill.
    # 45 cm is still a step, and the rail is one span between posts.
    run = 0.45
    samples = _resample(line, run)
    cache = {}
    ox, oz = STEPS_ORIGIN
    h0 = sample_h(ox, oz, cache)
    raw = [sample_h(ox + x, oz + z, cache) - h0 for x, z in samples]
    ground = []
    for i, y in enumerate(raw):
        acc, n = y, 1
        if i:
            acc += raw[i - 1]
            n += 1
        if i + 1 < len(raw):
            acc += raw[i + 1]
            n += 1
        ground.append(acc / n)
    # Nosing sits just proud of the uphill ground. A 4 cm lip vanished into
    # the 4 m terrain mesh. Only stop a tread from dipping below the one
    # below it; the summit cone is flatter than a full riser, and forcing
    # 6 cm there lifts the flight off the hill.
    tread_y = [ground[i + 1] + 0.14 for i in range(len(samples) - 1)]
    for i in range(1, len(tread_y)):
        if tread_y[i] < tread_y[i - 1] + 0.015:
            tread_y[i] = tread_y[i - 1] + 0.015
    floor0 = ground[0] - 0.05
    extra = [tread_y[i] - (ground[i + 1] + 0.14) for i in range(len(tread_y))]
    print(
        "ground",
        round(h0, 2),
        "steps",
        len(tread_y),
        "rise",
        round(tread_y[-1] - floor0, 1),
        "proud",
        round(min(extra), 3),
        round(max(extra), 3),
    )
    if max(extra) > 0.45:
        raise SystemExit("stair leaves the slope")
    if tread_y[-1] < tread_y[0] + 70:
        raise SystemExit(f"stair does not climb: {tread_y[-1] - tread_y[0]}")

    half = 1.45
    model = G.Model("hooiberg_steps")
    green = model.material("green", (0.20, 0.46, 0.24), rough=0.72)
    white = model.material("white", (0.90, 0.89, 0.86), rough=0.7)
    rail_c = model.material("rail", (0.22, 0.34, 0.24), rough=0.45)
    hi_g, lo_g = model.mesh(0, green), model.mesh(1, green)
    hi_w, lo_w = model.mesh(0, white), model.mesh(1, white)
    hi_r, lo_r = model.mesh(0, rail_c), model.mesh(1, rail_c)

    def corner(p, side_sign, y, rx, rz):
        return (p[0] + rx * half * side_sign, y, p[1] + rz * half * side_sign)

    def step(mesh_g, mesh_w, i0, i1, y_top, y_bot):
        p0, p1 = samples[i0], samples[i1]
        tx, tz = _along(p0, p1)
        rx, rz = tz, -tx
        fl, fr = corner(p0, -1, y_top, rx, rz), corner(p0, 1, y_top, rx, rz)
        bl, br = corner(p1, -1, y_top, rx, rz), corner(p1, 1, y_top, rx, rz)
        quad_facing(mesh_g, fl, fr, br, bl, (0, 1, 0))
        # The ground photo paints the riser green and the front nosing white.
        nose = min(0.08, max(0.0, y_top - y_bot))
        y_nose = y_top - nose
        fln, frn = corner(p0, -1, y_nose, rx, rz), corner(p0, 1, y_nose, rx, rz)
        fl2, fr2 = corner(p0, -1, y_bot, rx, rz), corner(p0, 1, y_bot, rx, rz)
        if nose > 0.01:
            quad_facing(mesh_w, fr, fl, fln, frn, (-tx, 0, -tz))
        if y_nose - y_bot > 0.01:
            quad_facing(mesh_g, frn, fln, fl2, fr2, (-tx, 0, -tz))
        a0, a1 = corner(p0, -1, y_top, rx, rz), corner(p1, -1, y_top, rx, rz)
        b0, b1 = corner(p0, -1, y_bot, rx, rz), corner(p1, -1, y_bot, rx, rz)
        quad_facing(mesh_w, a0, b0, b1, a1, (-rx, 0, -rz))
        c0, c1 = corner(p0, 1, y_top, rx, rz), corner(p1, 1, y_top, rx, rz)
        d0, d1 = corner(p0, 1, y_bot, rx, rz), corner(p1, 1, y_bot, rx, rz)
        quad_facing(mesh_w, c0, c1, d1, d0, (rx, 0, rz))

    prev = floor0
    for i in range(len(tread_y)):
        step(hi_g, hi_w, i, i + 1, tread_y[i], prev)
        prev = tread_y[i]

    prev = floor0
    coarse = list(range(0, len(tread_y), 8))
    if coarse[-1] != len(tread_y) - 1:
        coarse.append(len(tread_y) - 1)
    for a, b in zip(coarse, coarse[1:]):
        step(lo_g, lo_w, a, b + 1, tread_y[b], prev)
        prev = tread_y[b]

    def rail_one(mesh, i0, i1, lift):
        p0, p1 = samples[i0], samples[i1]
        tx, tz = _along(p0, p1)
        rx, rz = tz, -tx
        y0 = tread_y[min(i0, len(tread_y) - 1)] + lift
        y1 = tread_y[min(i1, len(tread_y) - 1)] + lift
        for sign in (-1, 1):
            ox = rx * (half + 0.16) * sign
            oz_ = rz * (half + 0.16) * sign
            lat = 0.035
            a = (p0[0] + ox - rx * lat * sign, y0, p0[1] + oz_ - rz * lat * sign)
            b = (p0[0] + ox + rx * lat * sign, y0, p0[1] + oz_ + rz * lat * sign)
            c = (p1[0] + ox + rx * lat * sign, y1, p1[1] + oz_ + rz * lat * sign)
            d = (p1[0] + ox - rx * lat * sign, y1, p1[1] + oz_ - rz * lat * sign)
            quad_facing(mesh, a, b, c, d, (0, 1, 0))
            e = (a[0], a[1] + 0.045, a[2])
            f = (b[0], b[1] + 0.045, b[2])
            g = (c[0], c[1] + 0.045, c[2])
            h = (d[0], d[1] + 0.045, d[2])
            quad_facing(mesh, e, h, g, f, (rx * sign, 0, rz * sign))

    span = 4
    i = 0
    while i < len(tread_y):
        j = min(i + span, len(tread_y))
        rail_one(hi_r, i, j, 0.90)
        rail_one(hi_r, i, j, 0.48)
        i = j
    for i in range(0, len(tread_y), 8):
        p = samples[i]
        nxt = samples[min(i + 1, len(samples) - 1)]
        _tx, _tz = _along(p, nxt)
        rx, rz = _tz, -_tx
        y = tread_y[i]
        for sign in (-1, 1):
            G.box(
                hi_r,
                p[0] + rx * (half + 0.16) * sign,
                y + 0.48,
                p[1] + rz * (half + 0.16) * sign,
                0.07, 0.96, 0.07,
            )
    for a, b in zip(coarse, coarse[1:]):
        rail_one(lo_r, a, min(b + 1, len(samples) - 1), 0.90)

    info = G.write_glb(model, HERO / "hooiberg_steps.glb")
    G.check_glb(HERO / "hooiberg_steps.glb")
    # Confirm the written positions are plain float32 in the hero frame.
    data = (HERO / "hooiberg_steps.glb").read_bytes()
    o = 12
    js = None
    while o < len(data) - 8:
        ln, ct = struct.unpack_from("<II", data, o)
        o += 8
        chunk = data[o:o + ln]
        o += ln
        if ct == 0x4E4F534A:
            import json
            js = json.loads(chunk)
    assert js["nodes"][0]["name"] == "hooiberg_steps_lod0"
    assert js["nodes"][1]["name"] == "hooiberg_steps_lod1"
    assert "scale" not in js["nodes"][0]
    print("stairs", info)
    return info, h0


def patch_manifest(info, h0):
    text = MANIFEST.read_text()
    y = round(h0, 2)
    if y == 0:
        raise SystemExit("origin height is 0; refusing to pin")
    name = (
        '("id": "hooiberg_steps",\n  "k": "hooiberg_steps",\n  "name": ")'
        '[^"]+'
        '(",\n  "status": "v4-mall-detail",\n  "x": -2709.78,\n  "z": 333.95,\n  "y": )'
        '[^,\n]+'
    )
    text2, n = re.subn(
        name,
        lambda m: f"{m.group(1)}Hooiberg concrete stair{m.group(2)}{y}",
        text,
        count=1,
    )
    if n != 1:
        raise SystemExit(f"name/y patch {n}")
    text3, n = re.subn(
        r'"hooiberg_steps_lod0": \d+,\n   "hooiberg_steps_lod1": \d+',
        f'"hooiberg_steps_lod0": {info["lod0"]},\n   "hooiberg_steps_lod1": {info["lod1"]}',
        text2,
        count=1,
    )
    if n != 1:
        raise SystemExit(f"tris patch {n}")
    old_ref = (
        "r28.mp4 3:00 green-painted concrete Hooiberg steps; drawn from the peak "
        "toward Caya Betico Croes (true stair line not in OSM data available), approx."
    )
    new_ref = (
        "Commons Hooiberg staircase photo: one continuous flight, green treads and risers, "
        "white nosing and side edges, pipe rails both sides, following the slope "
        "from the peak toward Caya Betico Croes (true line not in OSM)."
    )
    if old_ref in text3:
        text3 = text3.replace(old_ref, new_ref, 1)
    elif new_ref not in text3:
        raise SystemExit("ref missing")
    text4, n = re.subn(
        r'("id": "hooiberg_steps",[\s\S]*?"switch_m": )\d+',
        r"\g<1>140",
        text3,
        count=1,
    )
    if n != 1:
        raise SystemExit(f"switch patch {n}")
    text3 = text4
    MANIFEST.write_text(text3)
    print("manifest y", y, "tris", info["lod0"], info["lod1"])


def main():
    info, h0 = build_stairs()
    patch_manifest(info, h0)


if __name__ == "__main__":
    main()
