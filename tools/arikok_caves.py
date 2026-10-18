#!/usr/bin/env python3
"""Fontein and Quadirikiri as continuous limestone cliffs.

The Commons photos are one dark-grey wall: a projecting brow, a base cut
back into shadow, and a black mouth under that lip. A row of peaked facets
read as crystal shards, so the crest stays connected and the pits live in
a generated colour and normal. The photos are not pasted. Same ids,
origins, and node names. The caves sit far from the phone-soak route, so
these two images are not uploaded on that drive.
"""
import json
import math
from pathlib import Path

import hero_glb as G

ROOT = Path(__file__).resolve().parents[1]
REAL = ROOT / "game" / "data" / "real"
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"

X0, Z0, RS, PX = -10800.0, -11800.0, 1000.0, 4.0
XG = 111320 * math.cos(12.52 * math.pi / 180)
ZG = 110540.0

# Multiplied by the limestone texture. The texture is the dark grey of the
# cliff photos. A flat 0.15 washed out, and a flat 0.66 went beige.
ROCK = (0.9, 0.88, 0.84)
MOUTH = (0.008, 0.008, 0.007)
IRON = (0.04, 0.04, 0.038)


def from_ll(lat, lon):
    return ((lon + 69.97) * XG, -(lat - 12.52) * ZG)


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


def nearest_road(x, z, limit=400):
    best = None
    bd = limit * limit
    for path in REAL.glob("r_*.json"):
        data = json.loads(path.read_text())
        for road in data["roads"]:
            name = road.get("n") or ""
            for px, pz in road["p"]:
                d = (px - x) ** 2 + (pz - z) ** 2
                if d < bd:
                    bd = d
                    best = (px, pz, math.sqrt(d), name)
    return best


def tri_down(mesh, a, b, c):
    ax, ay, az = b[0] - a[0], b[1] - a[1], b[2] - a[2]
    bx, by, bz = c[0] - a[0], c[1] - a[1], c[2] - a[2]
    ny = az * bx - ax * bz
    if ny > 0:
        mesh.tri(a, c, b)
    else:
        mesh.tri(a, b, c)


def hash01(i, salt):
    x = math.sin((i + 3.0) * 12.9898 + salt * 78.233) * 43758.5453
    return x - math.floor(x)


def covered(z, y, mouths):
    """An arched mouth: wide at the floor, pinched under the lip, edges uneven."""
    for mz, mw, mh in mouths:
        if y >= mh or y < -0.15:
            continue
        t = (y + 0.15) / (mh + 0.15)
        wobble = 0.82 + 0.28 * hash01(int(z * 1.7 + y * 2.4), 6)
        half = mw * 0.42 * (1.05 - 0.4 * t) * wobble
        if abs(z - mz) < half:
            return mh
    return None


def quad_facing(mesh, a, b, c, d, outward, uvs=None):
    ax, ay, az = b[0] - a[0], b[1] - a[1], b[2] - a[2]
    bx, by, bz = c[0] - a[0], c[1] - a[1], c[2] - a[2]
    nx = ay * bz - az * by
    ny = az * bx - ax * bz
    nz = ax * by - ay * bx
    if nx * outward[0] + ny * outward[1] + nz * outward[2] < 0:
        if uvs:
            mesh.quad(a, d, c, b, (uvs[0], uvs[3], uvs[2], uvs[1]))
        else:
            mesh.quad(a, d, c, b)
    else:
        mesh.quad(a, b, c, d, uvs)


def tri_facing(mesh, a, b, c, outward, uvs=None):
    ax, ay, az = b[0] - a[0], b[1] - a[1], b[2] - a[2]
    bx, by, bz = c[0] - a[0], c[1] - a[1], c[2] - a[2]
    nx = ay * bz - az * by
    ny = az * bx - ax * bz
    nz = ax * by - ay * bx
    if nx * outward[0] + ny * outward[1] + nz * outward[2] < 0:
        if uvs:
            mesh.tri(a, c, b, (uvs[0], uvs[2], uvs[1]))
        else:
            mesh.tri(a, c, b)
    else:
        mesh.tri(a, b, c, uvs)


def axis_of(outward):
    ax, ay, az = abs(outward[0]), abs(outward[1]), abs(outward[2])
    if ax >= ay and ax >= az:
        return 0
    if ay >= az:
        return 1
    return 2


def uv_at(p, axis):
    s = 7.5
    if axis == 0:
        return (p[2] / s, p[1] / s)
    if axis == 1:
        return (p[0] / s, p[2] / s)
    return (p[0] / s, p[1] / s)


def uvs_for(a, b, c, d, outward):
    axis = axis_of(outward)
    return (uv_at(a, axis), uv_at(b, axis), uv_at(c, axis), uv_at(d, axis))


def cracked(mesh, a, b, c, d, outward, amp):
    """Four facets around a point pushed along the face, so the normal is not one flat quad."""
    axis = axis_of(outward)
    m = (
        (a[0] + b[0] + c[0] + d[0]) * 0.25 + outward[0] * amp,
        (a[1] + b[1] + c[1] + d[1]) * 0.25 + outward[1] * amp,
        (a[2] + b[2] + c[2] + d[2]) * 0.25 + outward[2] * amp,
    )
    for p, q in ((a, b), (b, c), (c, d), (d, a)):
        tri_facing(mesh, p, q, m, outward, (uv_at(p, axis), uv_at(q, axis), uv_at(m, axis)))


def pit_at(mesh, x_face, y, z, w, h):
    """A dark pocket set into the face."""
    xf = x_face - 0.08
    xb = xf - 0.85
    z0, z1 = z - w * 0.5, z + w * 0.5
    y0, y1 = max(0.15, y - h * 0.5), y + h * 0.5
    quad_facing(mesh, (xb, y0, z0), (xb, y0, z1), (xb, y1, z1), (xb, y1, z0), (1, 0, 0))
    quad_facing(mesh, (xb, y0, z0), (xf, y0, z0), (xf, y0, z1), (xb, y0, z1), (0, 1, 0))
    quad_facing(mesh, (xf, y1, z0), (xb, y1, z0), (xb, y1, z1), (xf, y1, z1), (0, -1, 0))
    quad_facing(mesh, (xf, y0, z0), (xf, y1, z0), (xb, y1, z0), (xb, y0, z0), (0, 0, 1))
    quad_facing(mesh, (xb, y0, z1), (xb, y1, z1), (xf, y1, z1), (xf, y0, z1), (0, 0, -1))


def flake(mesh, x, y, z, seed):
    """A jagged slab hanging off the brow. A box there read as a crate."""
    w = 0.9 + hash01(seed, 1) * 1.1
    h = 0.45 + hash01(seed, 2) * 0.7
    lean = (hash01(seed, 4) - 0.3) * 0.35
    a = (x + 0.15, y, z - w)
    b = (x + lean, y - 0.05, z + w * 0.55)
    c = (x + 0.85 + lean, y - h, z + w * 0.15)
    d = (x + 0.35, y - h * 0.75, z - w * 0.65)
    quad_facing(mesh, a, b, c, d, (1, 0.2, 0), uvs_for(a, b, c, d, (1, 0.2, 0)))
    t = 0.28
    a2 = (a[0] - t, a[1] - 0.05, a[2])
    b2 = (b[0] - t, b[1] - 0.05, b[2])
    c2 = (c[0] - t * 0.4, c[1], c[2])
    d2 = (d[0] - t * 0.4, d[1], d[2])
    quad_facing(mesh, a2, d2, c2, b2, (-1, 0, 0), uvs_for(a2, d2, c2, b2, (-1, 0, 0)))
    quad_facing(mesh, a, a2, b2, b, (0, 1, 0), uvs_for(a, a2, b2, b, (0, 1, 0)))
    quad_facing(mesh, d, c, c2, d2, (0, -1, 0), uvs_for(d, c, c2, d2, (0, -1, 0)))


def lump(mesh, x, y, z, rx, ry, rz, seed):
    """Talus block with an uneven crown, seated on the ground."""
    n = 6
    top, bot = [], []
    for k in range(n):
        ang = 2 * math.pi * k / n + hash01(seed, k) * 0.35
        rad = 0.45 + 0.75 * hash01(seed * 3 + k, 2)
        jy = (hash01(seed, k + 3) - 0.35) * ry * 0.45
        top.append((x + math.cos(ang) * rx * rad * 0.62, y + ry + jy, z + math.sin(ang) * rz * rad * 0.62))
        bot.append((x + math.cos(ang) * rx * rad, y, z + math.sin(ang) * rz * rad))
    for k in range(n):
        j = (k + 1) % n
        mx = (bot[k][0] + bot[j][0]) * 0.5 - x
        mz = (bot[k][2] + bot[j][2]) * 0.5 - z
        outward = (mx, 0.25, mz)
        a, b, c, d = bot[k], bot[j], top[j], top[k]
        quad_facing(mesh, a, b, c, d, outward, uvs_for(a, b, c, d, outward))
    for k in range(1, n - 1):
        tri_facing(
            mesh, top[0], top[k + 1], top[k], (0, 1, 0),
            (uv_at(top[0], 1), uv_at(top[k + 1], 1), uv_at(top[k], 1)),
        )


def emit_cliff(rock, dark, length, height, depth, mouths, detail, drip_mesh=None):
    """Separate horizontal beds. Each bed is a vertical face plus a flat ledge.

    Connecting those heights with one sloped sheet is what read as a scalloped wall.
    """
    n = 22 if detail else 9
    half = length * 0.5
    zs = [-half + length * i / (n - 1) for i in range(n)]
    scale = height / 9.2
    # y0, y1, outer x. A bigger x on the next bed is an overhang.
    raw = (
        (0.00, 1.15, 1.65),
        (1.15, 2.40, 0.28),
        (2.40, 2.78, 3.70),
        (2.78, 4.35, 2.15),
        (4.35, 4.70, 2.72),
        (4.70, 6.35, 2.05),
        (6.35, 6.68, 2.48),
        (6.68, 9.20, 1.85),
    )
    beds = [(a * scale, b * scale, x) for a, b, x in raw]
    beds[-1] = (beds[-1][0], height * (0.96 + 0.04 * hash01(1, 2)), beds[-1][2])
    lip = beds[2][0]
    openings = [(mz, mw, min(mh, lip - 0.12)) for mz, mw, mh in mouths]
    back = -max(6.0, depth * 0.55)

    def face_x(i, bi, x):
        amp = (0.9 if bi == 2 else 0.55) if detail else 0.16
        xx = x + (hash01(i // 2 + bi * 5, 6) - 0.5) * amp
        # The brow steps in and out. A constant overhang reads as a floor plate.
        if bi == 2:
            xx += (hash01(i, 14) - 0.35) * (1.4 if detail else 0.45)
        end = min(i, n - 1 - i) / max(1.0, n * 0.1)
        if end < 1:
            xx *= 0.62 + 0.38 * end
        return max(0.08, xx)

    face = [[face_x(i, bi, beds[bi][2]) for bi in range(len(beds))] for i in range(n)]
    # One height per vertex per bed boundary, so neighbouring quads share
    # an edge. Independent jitter left sky-coloured cracks along every course.
    wob = 0.16 if detail else 0.04
    ys = []
    for i in range(n):
        col = []
        for b in range(len(beds) + 1):
            base = beds[0][0] if b == 0 else beds[b - 1][1]
            col.append(base + (hash01(i * 3 + b, 11) - 0.5) * wob)
        ys.append(col)

    def rock_quad(a, b, c, d, outward):
        quad_facing(rock, a, b, c, d, outward, uvs_for(a, b, c, d, outward))

    for i in range(n - 1):
        z0, z1 = zs[i], zs[i + 1]
        midz = (z0 + z1) * 0.5
        for bi, (y0, y1, _x) in enumerate(beds):
            yb0, yb1 = ys[i][bi], ys[i + 1][bi]
            yt0, yt1 = ys[i][bi + 1], ys[i + 1][bi + 1]
            midy = (y0 + y1) * 0.5
            open_bed = bi <= 1 and covered(midz, midy, openings)
            x0, x1 = face[i][bi], face[i + 1][bi]
            if not open_bed:
                a = (x0, yb0, z0)
                b = (x1, yb1, z1)
                c = (x1, yt1, z1)
                d = (x0, yt0, z0)
                # The recessed course is the shadow under the brow. Pale colour
                # stays on the hanging fingers, not on a full-width band.
                if bi == 1:
                    quad_facing(dark, a, b, c, d, (1, 0, 0))
                else:
                    rock_quad(a, b, c, d, (1, 0.02, 0))
            if bi + 1 >= len(beds):
                continue
            nx0, nx1 = face[i][bi + 1], face[i + 1][bi + 1]
            la, lb = (x0, yt0, z0), (x1, yt1, z1)
            lc, ld = (nx1, yt1, z1), (nx0, yt0, z0)
            projecting = (nx0 + nx1) > (x0 + x1) + 0.2
            if open_bed and not projecting:
                continue
            if projecting:
                quad_facing(dark, la, lb, lc, ld, (0, -1, 0))
            else:
                rock_quad(la, ld, lc, lb, (0, 1, 0))
        crest0, crest1 = ys[i][-1], ys[i + 1][-1]
        a = (face[i][-1], crest0, z0)
        b = (face[i + 1][-1], crest1, z1)
        c = (back + 0.4, crest1 * 0.94, z1)
        d = (back + 0.4, crest0 * 0.94, z0)
        rock_quad(a, b, c, d, (0, 1, 0))
        a = (back, -0.35, z1)
        b = (back, height * 0.9, z1)
        c = (back, height * 0.9, z0)
        d = (back, -0.35, z0)
        rock_quad(a, b, c, d, (-1, 0, 0))

    for i, sign in ((0, -1), (n - 1, 1)):
        z = zs[i]
        a = (face[i][0], 0.0, z)
        b = (face[i][-1], height * 0.92, z)
        c = (back, height * 0.92, z)
        d = (back, 0.0, z)
        rock_quad(a, b, c, d, (0, 0, sign))

    for mz, mw, mh in openings:
        z0, z1 = mz - mw * 0.52, mz + mw * 0.52
        y = mh + 0.02
        quad_facing(dark, (0.05, y, z0), (3.3, y, z0), (3.3, y, z1), (0.05, y, z1), (0, -1, 0))
        mouth_void(dark, mz, mw * 1.05, mh)
        # Jambs so the opening has a thickness, not a hole in a sheet.
        for zz, sgn in ((z0, 1), (z1, -1)):
            quad_facing(
                rock,
                (0.2, -0.2, zz), (0.2, mh, zz), (2.4, mh * 0.92, zz), (2.1, -0.2, zz),
                (0, 0, sgn),
                uvs_for((0.2, -0.2, zz), (0.2, mh, zz), (2.4, mh, zz), (2.1, -0.2, zz), (0, 0, sgn)),
            )

    if not detail:
        return
    for i in range(2, n - 2, 2):
        z = zs[i]
        for bi in (3, 5, 7):
            if hash01(i, bi + 4.2) < 0.55:
                continue
            y0, y1, _x = beds[bi]
            y = (y0 + y1) * 0.5
            if covered(z, y, openings):
                continue
            pit_at(dark, face[i][bi] + 0.02, y, z, 0.7 + hash01(i, bi) * 0.5, 0.28 + hash01(i, bi + 1) * 0.25)
        if hash01(i, 9) > 0.62 and not covered(z, beds[3][0] + 0.4, openings):
            knuckle(rock, face[i][3], beds[3][0] + 0.35, z, 0.7, 0.45)
    if drip_mesh is None:
        return
    for i in range(1, n - 1):
        z = zs[i]
        over = covered(z, 0.5, openings)
        y = lip - 0.04
        count = 2 if (over or hash01(i, 20) > 0.4) else 1
        for k in range(count):
            x = 1.5 + hash01(i * 3 + k, 19) * 1.9
            hang = 0.28 + hash01(i + k, 21) * (0.85 if over else 0.45)
            rad = 0.22 + hash01(i + k, 22) * 0.28
            drip(drip_mesh, x, y, z + (k - 1) * 0.28, hang, rad)
        if hash01(i, 24) > 0.55:
            # A narrow pale streak on the face. A full course of this colour
            # read as a white stripe across the wall.
            sx = face[i][min(5, len(beds) - 1)] + 0.03
            w = 0.16 + hash01(i, 25) * 0.14
            h = 0.9 + hash01(i, 26) * 1.5
            zy = beds[min(5, len(beds) - 1)][1] - 0.05
            a = (sx, zy, z - w)
            b = (sx, zy, z + w)
            c = (sx - 0.04, zy - h, z + w * 0.55)
            d = (sx - 0.04, zy - h, z - w * 0.55)
            quad_facing(drip_mesh, a, b, c, d, (1, 0, 0))


def knuckle(mesh, x, y, z, w, h):
    """A block sticking out of a bed. A displaced center read as a crystal."""
    d = 0.35
    a = (x, y, z - w * 0.5)
    b = (x, y, z + w * 0.5)
    c = (x, y + h, z + w * 0.5)
    dpt = (x, y + h, z - w * 0.5)
    rock_out = (1, 0, 0)
    quad_facing(mesh, a, b, c, dpt, rock_out, uvs_for(a, b, c, dpt, rock_out))
    f = (x + d, y + 0.04, z)
    for p, q in ((a, b), (b, c), (c, dpt), (dpt, a)):
        tri_facing(mesh, p, q, f, (1, 0.2, 0), (uv_at(p, 0), uv_at(q, 0), uv_at(f, 0)))


def drip(mesh, x, y, z, length, rad):
    """A short knobby pendant. A long cone read as a white icicle."""
    n = 4
    top, mid = [], []
    for k in range(n):
        a = 2 * math.pi * k / n + 0.4
        j = 0.7 + hash01(k + int(z * 5) + int(x * 3), 3) * 0.55
        top.append((x + math.cos(a) * rad * j, y, z + math.sin(a) * rad * 0.72 * j))
        mid.append((
            x + math.cos(a) * rad * j * 0.72,
            y - length * 0.62,
            z + math.sin(a) * rad * 0.5 * j,
        ))
    tip = (x + (hash01(int(z * 3), 2) - 0.5) * 0.08, y - length, z)
    for k in range(n):
        a, b = top[k], top[(k + 1) % n]
        c, d = mid[(k + 1) % n], mid[k]
        outward = ((a[0] + b[0]) * 0.5 - x, -0.15, (a[2] + b[2]) * 0.5 - z)
        quad_facing(mesh, a, b, c, d, outward)
        tri_facing(mesh, d, c, tip, outward)


def mouth_void(mesh, mz, mw, mh):
    """Black cave interior. It fills the opening so the desert does not show through."""
    x_face, x_back = -0.55, -6.4
    y0, y1 = -0.6, mh
    z0, z1 = mz - mw * 0.5, mz + mw * 0.5
    quad_facing(mesh, (x_back, y0, z0), (x_back, y0, z1), (x_back, y1, z1), (x_back, y1, z0), (1, 0, 0))
    quad_facing(mesh, (x_face, y0, z0), (x_face, y0, z1), (x_back, y0, z1), (x_back, y0, z0), (0, 1, 0))
    quad_facing(mesh, (x_face, y1, z0), (x_back, y1, z0), (x_back, y1, z1), (x_face, y1, z1), (0, -1, 0))
    quad_facing(mesh, (x_face, y0, z0), (x_face, y1, z0), (x_back, y1, z0), (x_back, y0, z0), (0, 0, 1))
    quad_facing(mesh, (x_back, y0, z1), (x_back, y1, z1), (x_face, y1, z1), (x_face, y0, z1), (0, 0, -1))


def skylight(mesh, sx, sz, rad, crest_y):
    n = 6
    top, bot = [], []
    for i in range(n):
        a = 2 * math.pi * i / n
        c, s = math.cos(a), math.sin(a)
        top.append((sx + c * rad, crest_y + 0.05, sz + s * rad))
        bot.append((sx + c * rad * 0.7, crest_y - 2.4, sz + s * rad * 0.7))
    for i in range(n):
        j = (i + 1) % n
        ang = 2 * math.pi * (i + 0.5) / n
        quad_facing(mesh, top[i], top[j], bot[j], bot[i], (math.cos(ang), 0, math.sin(ang)))
    mid = (sx, crest_y - 2.4, sz)
    for i in range(n):
        mesh.tri(mid, bot[(i + 1) % n], bot[i])


def gate(mesh, mz, mw, mh):
    """A few bars inside the shadow. A full rail across the mouth read as a window."""
    span = mw * 0.55
    x = -3.8
    for k in range(3):
        z = mz - span / 2 + k * (span / 2)
        G.box(mesh, x, mh * 0.42, z, 0.06, mh * 0.7, 0.06)


def rotate_model(model, ang):
    c, s = math.cos(ang), math.sin(ang)
    for lod in model.lod:
        for mesh in lod.values():
            mesh.pos = [(p[0] * c - p[2] * s, p[1], p[0] * s + p[2] * c) for p in mesh.pos]
            mesh.nrm = [(n[0] * c - n[2] * s, n[1], n[0] * s + n[2] * c) for n in mesh.nrm]



_ROCK_PNG = None


def rock_pngs():
    """Tileable limestone colour and a matching normal. Not a photograph."""
    global _ROCK_PNG
    if _ROCK_PNG is None:
        _ROCK_PNG = _limestone_images()
    return _ROCK_PNG


def _limestone_images():
    import io
    from PIL import Image

    n = 160
    freq = 8

    def cell(ix, iy, salt):
        return hash01((ix % freq) * 17 + (iy % freq) * 9, salt)

    def noise(u, v, octaves, salt):
        xf, yf = u * octaves, v * octaves
        x0, y0 = math.floor(xf), math.floor(yf)
        fx, fy = xf - x0, yf - y0
        sx = fx * fx * (3 - 2 * fx)
        sy = fy * fy * (3 - 2 * fy)
        a = cell(x0, y0, salt)
        b = cell(x0 + 1, y0, salt)
        c = cell(x0, y0 + 1, salt)
        d = cell(x0 + 1, y0 + 1, salt)
        return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy

    height = [[0.0] * n for _ in range(n)]
    for y in range(n):
        v = y / n
        for x in range(n):
            u = x / n
            h = 0.0
            amp = 1.0
            for o, salt in enumerate((1.2, 4.4, 9.1)):
                h += amp * noise(u, v, freq * (o + 1), salt)
                amp *= 0.5
            height[y][x] = h
    colour = Image.new("RGB", (n, n))
    normals = Image.new("RGB", (n, n))
    cp, np_ = colour.load(), normals.load()
    for y in range(n):
        for x in range(n):
            hl = height[y][(x - 1) % n]
            hr = height[y][(x + 1) % n]
            hd = height[(y - 1) % n][x]
            hu = height[(y + 1) % n][x]
            nx = (hl - hr) * 3.4
            ny = (hd - hu) * 3.4
            nz = 1.0
            length = math.sqrt(nx * nx + ny * ny + nz * nz) or 1.0
            np_[x, y] = (
                int(128 + 127 * nx / length),
                int(128 + 127 * ny / length),
                int(255 * nz / length),
            )
            v = y / n
            u = x / n
            # A few pale and dark courses, pits, and stains. A tight sine
            # read as wood grain.
            grain = noise(u, v, freq * 3, 6.6)
            pits = noise(u, v, freq * 6, 8.8)
            stain = noise(u * 0.4, v * 2.2, freq, 3.1)
            # Thin horizontal bedding lines. A sine across the face read as scallops.
            band = (v * 3.2 + stain * 0.2) % 1.0
            line = 12 if band < 0.045 else 0
            shade = 74 + grain * 34 + (stain - 0.5) * 16 - line
            if pits < 0.13:
                shade = 18 + grain * 8
            elif pits > 0.86:
                shade += 34
            shade = max(16, min(168, shade))
            cp[x, y] = (int(shade * 1.02), int(shade * 0.97), int(shade * 0.90))

    def png(im):
        buf = io.BytesIO()
        im.save(buf, format="PNG", optimize=True)
        return buf.getvalue()

    return png(colour), png(normals)


def bush(mesh, x, z, seed):
    """A low wide thicket. Tall crowns washed out to lime cones."""
    ry = 0.28 + hash01(seed, 1) * 0.22
    rx = 0.95 + hash01(seed, 2) * 0.45
    lump(mesh, x, 0.0, z, rx, ry, rx * 0.9, seed)
    lump(mesh, x + 0.75, 0.0, z + 0.3, rx * 0.65, ry * 0.7, rx * 0.55, seed + 3)


def pear(mesh, x, z, seed):
    """Flat prickly-pear pads, wider than they are tall."""
    for k, yaw, w, h in ((0, 0.4, 0.34, 0.16), (1, 1.5, 0.26, 0.13)):
        c, s = math.cos(yaw), math.sin(yaw)
        y = 0.28 + k * 0.22
        mesh.quad(
            (x - w * c, y, z - w * s),
            (x + w * 0.15 * s, y + h, z + w * 0.15 * c),
            (x + w * c, y, z + w * s),
            (x - w * 0.15 * s, y - h * 0.15, z - w * 0.15 * c),
        )


def emit_verge(shrub, cactus, length, openings, detail):
    """Dense scrub against the cliff foot. The path itself stays clear."""
    half = length * 0.5
    step = 1.85 if detail else 4.4
    i = 0
    z = -half + 0.6
    while z < half - 0.6:
        blocked = False
        for mz, mw, _mh in openings:
            if abs(z - mz) < mw * 0.35:
                blocked = True
                break
        if not blocked:
            # In front of the brow (the lip is near x=3.7), two rows, so the path sees a thicket.
            x = 4.3 + hash01(i, 3) * 1.1
            bush(shrub, x, z, i)
            if detail and hash01(i, 8) > 0.55:
                bush(cactus, x + 1.7, z + 0.55, i + 9)
            if hash01(i, 5) > 0.55:
                pear(cactus, x + 0.4, z + 0.3, i + 4)
        z += step
        i += 1


def emit_path(mesh, length):
    """Fontein's approach is a pale stone and dirt path along the wall."""
    half = length * 0.5
    nx, nz = 1, 8
    x0, x1 = 7.6, 13.4
    for j in range(nz):
        z0 = -half + length * j / nz
        z1 = -half + length * (j + 1) / nz
        for i in range(nx):
            xa = x0 + (x1 - x0) * i / nx
            xb = x0 + (x1 - x0) * (i + 1) / nx
            lift = (hash01(i + j * 3, 4) - 0.5) * 0.03
            y = 0.02 + lift
            a = (xa, y, z0)
            b = (xb, y, z0)
            c = (xb, y + (hash01(i, j) - 0.5) * 0.05, z1)
            d = (xa, y, z1)
            quad_facing(mesh, a, b, c, d, (0, 1, 0))


# 5x7. Only the letters a cave sign needs.
_GLYPH = {
    "A": "01110100011000111111100011000110001",
    "D": "11110100011000110001100011111010000",
    "E": "11111100001111010000100001111110000",
    "F": "11111100001111010000100001000010000",
    "I": "11111001000010000100001000010001111",
    "K": "10001100101110011000101001001010001",
    "N": "10001110011010110101100111000110001",
    "O": "01110100011000110001100010111000000",
    "Q": "01110100011000110101100100111000010",
    "R": "11110100011111010010100101000110001",
    "T": "11111001000010000100001000010000100",
    "U": "10001100011000110001100010111000000",
}


def _letters(mesh, text, x, y, z, h):
    """Dark letters on the road side of a board. The board extends along +Z."""
    pen = 0.0
    for ch in text:
        g = _GLYPH.get(ch)
        if not g:
            pen += h * 0.4
            continue
        cw = h * 0.7
        for row in range(7):
            for col in range(5):
                if g[row * 5 + col] != "1":
                    continue
                lx = pen + col * cw / 5
                ly = (6 - row) * h / 7
                z0, z1 = z + lx, z + lx + cw / 5 * 0.9
                y0, y1 = y + ly, y + ly + h / 7 * 0.9
                mesh.quad((x, y0, z0), (x, y0, z1), (x, y1, z1), (x, y1, z0))
        pen += cw + h * 0.08


def info_board(board, ink, post, length, label):
    """The Quadirikiri approach has a park panel. Letters, not the photograph."""
    z = length * 0.36
    x = 5.4
    G.box(post, x, 0.55, z, 0.12, 1.1, 0.12)
    G.box(board, x + 0.08, 1.45, z, 0.06, 0.9, 2.3)
    _letters(ink, label, x + 0.14, 1.12, z - 1.0, 0.2)


def build_cave(name, lat, lon, mouths, length, height, depth, gate_on=False, sign=None, path=False):
    cx, cz = from_ll(lat, lon)
    road = nearest_road(cx, cz)
    ang = math.atan2(road[1] - cz, road[0] - cx) if road else 0.0
    print(f"  {name} road {road[3]!r} {road[2]:.0f} m" if road else f"  {name} no road")

    model = G.Model(name)
    model.material("rock", ROCK, rough=0.94, textured=True, normal=True)
    model.material("drip", (0.50, 0.48, 0.44), rough=0.97)
    model.material("mouth", MOUTH, rough=1.0, double=False)
    model.material("iron", IRON, rough=0.55)
    model.material("shrub", (0.045, 0.11, 0.035), rough=0.98, double=True)
    model.material("cactus", (0.09, 0.16, 0.055), rough=0.92, double=True)
    model.material("board", (0.93, 0.91, 0.84), rough=0.7)
    model.material("ink", (0.12, 0.13, 0.12), rough=0.6, double=True)
    model.material("post", (0.35, 0.28, 0.18), rough=0.8)
    model.material("path", (0.36, 0.28, 0.16), rough=0.97)
    hi, him = model.mesh(0, "rock"), model.mesh(0, "mouth")
    lo, lom = model.mesh(1, "rock"), model.mesh(1, "mouth")
    emit_cliff(hi, him, length, height, depth, mouths, True, model.mesh(0, "drip"))
    emit_cliff(lo, lom, length, height, depth, mouths, False)
    lip = max(2.15, min(2.7, height * 0.28))
    openings = [(mz, mw, min(mh, lip - 0.2)) for mz, mw, mh in mouths]
    emit_verge(model.mesh(0, "shrub"), model.mesh(0, "cactus"), length, openings, True)
    emit_verge(model.mesh(1, "shrub"), model.mesh(1, "cactus"), length, openings, False)
    if gate_on:
        z, w, mh = mouths[0]
        gate(model.mesh(0, "iron"), z, w, mh)
    if path:
        emit_path(model.mesh(0, "path"), length)
    if sign:
        info_board(model.mesh(0, "board"), model.mesh(0, "ink"), model.mesh(0, "post"), length, sign)
        info_board(model.mesh(1, "board"), model.mesh(1, "ink"), model.mesh(1, "post"), length, sign)

    rock_mesh = model.mesh(0, "rock")
    if not rock_mesh.has_uv or len(rock_mesh.uv) != len(rock_mesh.pos):
        raise SystemExit(f"rock uvs {len(rock_mesh.uv)} positions {len(rock_mesh.pos)}")
    rotate_model(model, ang)
    albedo, normal = rock_pngs()
    info = G.write_glb(model, HERO / f"{name}.glb", images=[albedo, normal])
    G.check_glb(HERO / f"{name}.glb")
    h0 = sample_h(cx, cz, {})
    print(name, round(cx, 2), round(cz, 2), "h", round(h0, 2), "ang", round(ang, 3), info)
    # The rejected mound was about 3,000 triangles and 11.6 ms. Drips, beds, and
    # the path stay under that, and these caves are off the phone-soak route.
    if info["lod0"] > 2800:
        raise SystemExit(f"{name} lod0 {info['lod0']} is too heavy (was ~3000 and 11.6 ms)")
    return cx, cz, h0, info, ang


def footprint(cx, cz, ang, length, depth):
    c, s = math.cos(ang), math.sin(ang)
    local = [
        (4.0, -length / 2 - 1.5),
        (4.0, length / 2 + 1.5),
        (-depth - 1.5, length / 2 + 1.5),
        (-depth - 1.5, -length / 2 - 1.5),
    ]
    world = []
    for x, z in local:
        world.append([round(cx + x * c - z * s, 1), round(cz + x * s + z * c, 1)])
    return world


def upsert_manifest(entries):
    text = MANIFEST.read_text()
    data = json.loads(text)
    by_id = {e["id"]: e for e in entries}
    out = []
    seen = set()
    for item in data:
        if item.get("id") in by_id:
            out.append(by_id[item["id"]])
            seen.add(item["id"])
        else:
            out.append(item)
    for entry in entries:
        if entry["id"] not in seen:
            out.append(entry)
    old_ids = [i.get("id") for i in data]
    new_ids = [i.get("id") for i in out]
    if [i for i in old_ids if i not in by_id] != [i for i in new_ids if i not in by_id]:
        raise SystemExit("manifest id order changed")
    MANIFEST.write_text(json.dumps(out, indent=1) + "\n")


def entry(id_, x, z, y, info, name, refs, ring, switch):
    return {
        "id": id_,
        "k": id_,
        "name": name,
        "status": "accuracy-caves",
        "x": round(x, 2),
        "z": round(z, 2),
        "y": round(y, 2),
        "rotation": 0,
        "glb": f"models/hero/{id_}.glb",
        "lod": {"hi": f"{id_}_lod0", "lo": f"{id_}_lod1", "switch_m": switch},
        "tris": {f"{id_}_lod0": info["lod0"], f"{id_}_lod1": info["lod1"]},
        "textures": 2,
        "hide_footprint": ring,
        "hide": [],
        "sign": False,
        "kind": "replace",
        "new_place": True,
        "geo_source": "OSM node, mouth facing the nearest road",
        "ref_sources": refs,
        "frame": "glb origin = cave mouth centroid (world x,z); glTF +X = world x, +Z = world z, Y up",
        "cat": "landmark",
    }


def main():
    # Mouths are wide and sit under the lip. Fontein's first mouth is the gated one.
    fontein = build_cave(
        "fontein_cave", 12.4929282, -69.9073335,
        mouths=[(4.2, 8.4, 3.3), (-9.0, 5.6, 2.4)],
        length=42, height=9.2, depth=14, gate_on=True, path=True,
    )
    quad = build_cave(
        "quadirikiri", 12.4825269, -69.8995204,
        mouths=[(-5.5, 8.6, 3.6), (8.4, 5.8, 2.6)],
        length=46, height=10.6, depth=15, sign="QUADIRIKIRI",
    )
    fx, fz, fh, finfo, fang = fontein
    qx, qz, qh, qinfo, qang = quad
    if fh == 0 or qh == 0:
        raise SystemExit("refusing a zero ground pin")
    upsert_manifest([
        entry(
            "fontein_cave", fx, fz, fh, finfo,
            "Fontein Cave",
            "Commons 'Limestone cliffs near Fontein Cave, Aruba': layered grey limestone, a deep overhang with hanging drip-rock, cave mouths, dense green scrub, and the pale stone path. Generated rock colour and normal, not the photograph. OSM node 540167863.",
            footprint(fx, fz, fang, 42, 14), 380,
        ),
        entry(
            "quadirikiri", qx, qz, qh, qinfo,
            "Quadirikiri Cave",
            "Commons 'Base of the Cliff Quadirikiri Cave': pitted layered limestone, pale drip-rock under a deep brow, and a dark recess. 'Quadirikiri Cave Aruba' is the park panel, lettered rather than pasted. Generated rock colour. OSM node 540982491.",
            footprint(qx, qz, qang, 46, 15), 400,
        ),
    ])
    print("manifest ok", finfo, qinfo)


if __name__ == "__main__":
    main()
