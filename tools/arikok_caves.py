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
    """One wall. Beds are flat courses. The brow is a hard shelf, not a sine bulge."""
    n = 32 if detail else 12
    # Samples sit on both sides of each shelf so the lip is a thin quad.
    ts = (
        (0.0, 0.11, 0.12, 0.27, 0.285, 0.35, 0.37, 0.55, 0.72, 0.88, 1.0)
        if detail else (0.0, 0.27, 0.35, 0.37, 0.7, 1.0)
    )
    bands = len(ts) - 1
    half = length * 0.5
    zs = [-half + length * i / (n - 1) for i in range(n)]
    # The lip sits low, the way the path photos show the caves: a dark slot under a shelf.
    lip = max(2.15, min(2.7, height * 0.28))
    openings = [(mz, mw, min(mh, lip - 0.2)) for mz, mw, mh in mouths]
    crest = []
    for i in range(n):
        h = height * (0.94 + 0.06 * hash01(i, 2))
        if hash01(i, 8) > 0.88:
            h *= 0.92
        end = min(i, n - 1 - i) / max(1.0, n * 0.16)
        if end < 1:
            h *= 0.88 + 0.12 * end
        crest.append(max(height * 0.78, h))

    def course_x(t):
        # Undercut, then a brow that sticks out over the path. Constant per course.
        # A tall face, a low undercut, a brow, then more cliff above it.
        # Falling away to a roof is what read as a shingled shed.
        table = (
            (0.00, 0.55),
            (0.12, 1.45),
            (0.285, 0.22),
            (0.37, 3.05),
            (0.55, 2.45),
            (0.72, 2.15),
            (0.88, 1.85),
        )
        x, bed = table[0][1], 0
        for i, (tt, xx) in enumerate(table):
            if t + 1e-4 >= tt:
                x, bed = xx, i
        return x, bed

    def face_x(i, y, top):
        span = top + 0.5
        t = max(0.0, min(0.999, (y + 0.5) / span))
        x, bed = course_x(t)
        # A course steps as a group. A wave on every column read as scallops.
        x += (hash01((i // 4) + bed * 5, 6) - 0.5) * 0.26
        z = zs[i]
        for mz, mw, _mh in openings:
            if abs(z - mz) < mw * 0.55 and 0.16 < t < 0.46:
                x += 0.65
        end = min(i, n - 1 - i) / max(1.0, n * 0.12)
        if end < 1:
            x *= 0.55 + 0.45 * end
        return max(0.0, x)

    back = -max(6.0, depth * 0.55)
    xs, ys = [], []
    for i in range(n):
        top = crest[i]
        col_y, col_x = [], []
        for t in ts:
            y = -0.5 + (top + 0.5) * t
            col_y.append(y)
            col_x.append(face_x(i, y, top))
        ys.append(col_y)
        xs.append(col_x)

    out = (1, 0.05, 0)
    for i in range(n - 1):
        z0, z1 = zs[i], zs[i + 1]
        for b in range(bands):
            y00, y01 = ys[i][b], ys[i][b + 1]
            y10, y11 = ys[i + 1][b], ys[i + 1][b + 1]
            midy = (y00 + y01 + y10 + y11) * 0.25
            midz = (z0 + z1) * 0.5
            if covered(midz, midy, openings):
                continue
            a = (xs[i][b], y00, z0)
            bb = (xs[i + 1][b], y10, z1)
            c = (xs[i + 1][b + 1], y11, z1)
            d = (xs[i][b + 1], y01, z0)
            quad_facing(rock, a, bb, c, d, out, uvs_for(a, bb, c, d, out))
        a = (xs[i][-1], ys[i][-1], z0)
        bb = (xs[i + 1][-1], ys[i + 1][-1], z1)
        c = (back + 0.4, ys[i + 1][-1] * 0.92, z1)
        d = (back + 0.4, ys[i][-1] * 0.92, z0)
        quad_facing(rock, a, bb, c, d, (0, 1, 0), uvs_for(a, bb, c, d, (0, 1, 0)))
        a = (back, -0.4, z1)
        bb = (back, ys[i + 1][-1] * 0.92, z1)
        c = (back, ys[i][-1] * 0.92, z0)
        d = (back, -0.4, z0)
        quad_facing(rock, a, bb, c, d, (-1, 0, 0), uvs_for(a, bb, c, d, (-1, 0, 0)))

    # The underside of the brow. Without it the path camera looks through the shelf.
    lip_i = 6 if detail else 3
    for i in range(n - 1):
        y = min(ys[i][lip_i], ys[i + 1][lip_i]) - 0.08
        a = (xs[i][lip_i], y, zs[i])
        bb = (xs[i + 1][lip_i], y, zs[i + 1])
        c = (max(0.15, xs[i + 1][lip_i - 1]), y, zs[i + 1])
        d = (max(0.15, xs[i][lip_i - 1]), y, zs[i])
        quad_facing(rock, a, bb, c, d, (0, -1, 0), uvs_for(a, bb, c, d, (0, -1, 0)))

    for i, sign in ((0, -1), (n - 1, 1)):
        z = zs[i]
        for b in range(bands):
            a = (xs[i][b], ys[i][b], z)
            bb = (xs[i][b + 1], ys[i][b + 1], z)
            c = (back, ys[i][b + 1], z)
            d = (back, ys[i][b], z)
            quad_facing(rock, a, bb, c, d, (0, 0, sign), uvs_for(a, bb, c, d, (0, 0, sign)))

    # Ceiling of each mouth: the dark underside of the brow, so the opening reads as a cave.
    for mz, mw, mh in openings:
        z0, z1 = mz - mw * 0.55, mz + mw * 0.55
        y = mh + 0.05
        x_in, x_out = 0.05, 2.05
        a = (x_in, y, z0)
        b = (x_out, y, z0)
        c = (x_out, y, z1)
        d = (x_in, y, z1)
        quad_facing(dark, a, b, c, d, (0, -1, 0))
        mouth_void(dark, mz, mw * 1.05, mh)

    if detail:
        for i in range(2, n - 2, 3):
            z = zs[i]
            y = crest[i] * (0.58 + 0.16 * hash01(i, 9))
            if covered(z, y, openings) or y < lip + 0.6:
                continue
            if hash01(i, 4.2) < 0.45:
                continue
            pit_at(dark, face_x(i, y, crest[i]) - 0.02, y, z, 0.85, 0.38)
        # Pale drip-rock hanging from the brow, longer inside the mouths.
        if drip_mesh is not None:
            for i in range(1, n - 1):
                if hash01(i, 20) < 0.4:
                    continue
                z = zs[i]
                y = -0.5 + (crest[i] + 0.5) * 0.37
                x = face_x(i, y, crest[i]) - 0.08
                hang = 0.8 + hash01(i, 21) * (2.6 if covered(z, 0.4, openings) else 1.5)
                drip(drip_mesh, x, y, z, hang, 0.07 + hash01(i, 22) * 0.08)
                if hash01(i, 23) > 0.72:
                    drip(drip_mesh, x - 0.15, y - 0.05, z + 0.22, hang * 0.45, 0.05)


def drip(mesh, x, y, z, length, rad):
    """A limestone finger hanging from the brow. Four triangles, point down."""
    n = 4
    ring = []
    for k in range(n):
        a = 2 * math.pi * k / n
        ring.append((x + math.cos(a) * rad, y, z + math.sin(a) * rad * 0.65))
    tip = (x + (hash01(int(z * 3), 2) - 0.5) * 0.12, y - length, z)
    for k in range(n):
        a, b = ring[k], ring[(k + 1) % n]
        outward = ((a[0] + b[0]) * 0.5 - x, -0.2, (a[2] + b[2]) * 0.5 - z)
        tri_facing(mesh, a, b, tip, outward, (uv_at(a, 0), uv_at(b, 0), uv_at(tip, 0)))


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
            wave = math.sin(v * 6.283 * 2.5 + noise(u, v, freq, 2.2) * 1.2)
            grain = noise(u, v, freq * 3, 6.6)
            pits = noise(u, v, freq * 5, 8.8)
            stain = noise(u * 0.3, v * 3.0, freq, 3.1)
            shade = 62 + grain * 48 + (wave * 18)
            if wave > 0.72:
                shade += 36
            elif wave < -0.78:
                shade -= 24
            shade += (stain - 0.5) * 22
            if pits < 0.16:
                shade = 16 + grain * 10
            shade = max(14, min(176, shade))
            cp[x, y] = (int(shade * 1.02), int(shade * 0.97), int(shade * 0.90))

    def png(im):
        buf = io.BytesIO()
        im.save(buf, format="PNG", optimize=True)
        return buf.getvalue()

    return png(colour), png(normals)


def bush(mesh, x, z, seed):
    """A low wide thicket. Flat cards read as green shards along the path."""
    lump(mesh, x, 0.0, z, 1.45, 0.5, 1.15, seed)


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
    step = 1.25 if detail else 3.4
    i = 0
    z = -half + 0.8
    while z < half - 0.8:
        blocked = False
        for mz, mw, _mh in openings:
            if abs(z - mz) < mw * 0.22:
                blocked = True
                break
        if not blocked:
            # In front of the brow (the lip is near x=3.3), so the path camera sees it.
            x = 3.2 + hash01(i, 3) * 1.35
            bush(shrub, x, z, i)
            if hash01(i, 8) > 0.35:
                bush(shrub, x + 0.85, z + 0.4, i + 9)
            if hash01(i, 5) > 0.4:
                pear(cactus, x + 0.35, z + 0.25, i + 4)
        z += step
        i += 1


def emit_path(mesh, length):
    """Fontein's approach is a pale stone and dirt path along the wall."""
    half = length * 0.5
    nx, nz = 4, 14
    x0, x1 = 5.0, 9.2
    for j in range(nz):
        z0 = -half + length * j / nz
        z1 = -half + length * (j + 1) / nz
        for i in range(nx):
            xa = x0 + (x1 - x0) * i / nx
            xb = x0 + (x1 - x0) * (i + 1) / nx
            lift = (hash01(i + j * 3, 4) - 0.5) * 0.08
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
    model.material("drip", (0.93, 0.91, 0.84), rough=0.8)
    model.material("mouth", MOUTH, rough=1.0, double=False)
    model.material("iron", IRON, rough=0.55)
    model.material("shrub", (0.10, 0.24, 0.08), rough=0.95, double=True)
    model.material("cactus", (0.18, 0.34, 0.13), rough=0.85, double=True)
    model.material("board", (0.93, 0.91, 0.84), rough=0.7)
    model.material("ink", (0.12, 0.13, 0.12), rough=0.6, double=True)
    model.material("post", (0.35, 0.28, 0.18), rough=0.8)
    model.material("path", (0.78, 0.70, 0.52), rough=0.92)
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
