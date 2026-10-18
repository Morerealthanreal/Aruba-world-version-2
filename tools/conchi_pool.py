#!/usr/bin/env python3
"""Conchi / Natural Pool: dark volcanic rock open to the sea.

Commons 'Aruba-Natural-Pool-2013' looks across a turquoise basin to open
water. The landward side is rough rock, so the approach is not a sand
beach. The seaward side is a gap: jagged rocks, one stack, the sea, and
the splash where the waves hit. A flat blue disc inside grey boxes was
rejected. The floor stays at the surf (centre -0.35 m, water at world
Y 0.06). The rock grain is generated, not a pasted photo.
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

# OSM way 796907733, the pool water.
CONCHI_LL = [
    (12.524407, -69.928716), (12.524386, -69.928718), (12.524369, -69.928705),
    (12.524347, -69.928689), (12.524349, -69.928662), (12.524370, -69.928606),
    (12.524383, -69.928590), (12.524419, -69.928562), (12.524442, -69.928547),
    (12.524461, -69.928505), (12.524481, -69.928498), (12.524510, -69.928515),
    (12.524518, -69.928544), (12.524525, -69.928541), (12.524520, -69.928514),
    (12.524528, -69.928497), (12.524550, -69.928507), (12.524570, -69.928539),
    (12.524578, -69.928575), (12.524569, -69.928587), (12.524557, -69.928595),
    (12.524546, -69.928585), (12.524537, -69.928563), (12.524531, -69.928554),
    (12.524523, -69.928554), (12.524533, -69.928581), (12.524533, -69.928603),
    (12.524542, -69.928627), (12.524532, -69.928638), (12.524513, -69.928629),
    (12.524481, -69.928665), (12.524469, -69.928665), (12.524458, -69.928673),
    (12.524456, -69.928688), (12.524446, -69.928708), (12.524421, -69.928720),
]


def from_ll(lat, lon):
    return ((lon + 69.97) * XG, -(lat - 12.52) * ZG)


def tile_of(x, z):
    return math.floor((x - X0) / RS), math.floor((z - Z0) / RS)


def decode_h(r, g):
    return (r * 256 + g) / 100 - 50


def encode_h(h):
    v = int(round((h + 50) * 100))
    v = max(0, min(65535, v))
    return v // 256, v % 256


def sample_h(x, z, cache):
    rx, rz = tile_of(x, z)
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
        return decode_h(r, g)

    p, m, h, g = H(c, row), H(c + 1, row), H(c, row + 1), H(c + 1, row + 1)
    return p + (m - p) * u + (h - p) * d + (p - m - h + g) * u * d


def shoelace(ring):
    a = 0.0
    for i, (x, z) in enumerate(ring):
        x1, z1 = ring[(i + 1) % len(ring)]
        a += x * z1 - x1 * z
    return a / 2


def ccw(ring):
    ring = list(ring)
    if shoelace(ring) < 0:
        ring.reverse()
    return ring


def radial_ring(ring, dist):
    out = []
    for x, z in ring:
        length = math.hypot(x, z) or 1.0
        out.append((x + x / length * dist, z + z / length * dist))
    return out


def offset_ring(ring, dist):
    n = len(ring)
    out = []
    for i in range(n):
        x0, z0 = ring[(i - 1) % n]
        x1, z1 = ring[i]
        x2, z2 = ring[(i + 1) % n]
        ax, az = x1 - x0, z1 - z0
        bx, bz = x2 - x1, z2 - z1
        la, lb = math.hypot(ax, az) or 1, math.hypot(bx, bz) or 1
        nax, naz = az / la, -ax / la
        nbx, nbz = bz / lb, -bx / lb
        ox, oz = nax + nbx, naz + nbz
        L = math.hypot(ox, oz) or 1
        out.append((x1 + ox / L * dist, z1 + oz / L * dist))
    return out


def inside(x, z, ring):
    n = len(ring)
    j = n - 1
    hit = False
    for i in range(n):
        xi, zi = ring[i]
        xj, zj = ring[j]
        if (zi > z) != (zj > z):
            xcross = (xj - xi) * (z - zi) / (zj - zi) + xi
            if x < xcross:
                hit = not hit
        j = i
    return hit


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


def uv_at(p):
    s = 2.4
    return ((p[0] + p[2]) / s, p[1] / s)


def uvs_for(a, b, c, d):
    return (uv_at(a), uv_at(b), uv_at(c), uv_at(d))


def ellipsoid(mesh, cx, cy, cz, rx, ry, rz, nlat=5, nlon=8):
    """Round boulder. Poles are triangle fans; a quad on a repeated pole is skipped."""
    rings = []
    for i in range(nlat + 1):
        v = -math.pi / 2 + math.pi * i / nlat
        cv, sv = math.cos(v), math.sin(v)
        row = []
        for j in range(nlon):
            u = 2 * math.pi * j / nlon
            row.append((cx + rx * cv * math.cos(u), cy + ry * sv, cz + rz * cv * math.sin(u)))
        rings.append(row)
    bot, top = rings[0][0], rings[-1][0]
    for j in range(nlon):
        a, b = rings[1][j], rings[1][(j + 1) % nlon]
        mesh.tri(bot, b, a)
        c, d = rings[-2][j], rings[-2][(j + 1) % nlon]
        mesh.tri(top, c, d)
    for i in range(1, nlat - 1):
        for j in range(nlon):
            a = rings[i][j]
            b = rings[i][(j + 1) % nlon]
            c = rings[i + 1][(j + 1) % nlon]
            d = rings[i + 1][j]
            outward = ((a[0] + c[0]) / 2 - cx, (a[1] + c[1]) / 2 - cy, (a[2] + c[2]) / 2 - cz)
            quad_facing(mesh, a, b, c, d, outward)


def dist_outside(x, z, ring):
    """0 inside the ring, otherwise metres to the nearest edge."""
    if inside(x, z, ring):
        return 0.0
    best = 1e9
    n = len(ring)
    for i in range(n):
        x0, z0 = ring[i]
        x1, z1 = ring[(i + 1) % n]
        dx, dz = x1 - x0, z1 - z0
        L2 = dx * dx + dz * dz or 1.0
        t = max(0.0, min(1.0, ((x - x0) * dx + (z - z0) * dz) / L2))
        best = min(best, math.hypot(x - (x0 + t * dx), z - (z0 + t * dz)))
    return best


def carve(world):
    """Pool floor at the surf, and the standing shelf down with it.

    The terrace beside the ring was about 4.4 m while the water sat at
    -0.35 m, so the rim read as a cliff around a pit. The apron within
    16 m comes down to about 0.9 m and then blends back. A second run
    leaves pixels that are already below 2.2 m alone.
    """
    from PIL import Image
    cx = sum(p[0] for p in world) / len(world)
    cz = sum(p[1] for p in world) / len(world)
    rx, rz = tile_of(cx, cz)
    path = REAL / f"h_{rx}_{rz}.png"
    im = Image.open(path).convert("RGB")
    pix = im.load()
    changed = 0
    apron = 16.0
    for row in range(im.size[1]):
        for col in range(im.size[0]):
            x = X0 + rx * RS + col * PX
            z = Z0 + rz * RS + row * PX
            d = dist_outside(x, z, world)
            if d > apron:
                continue
            r, g, b = pix[col, row]
            h = decode_h(r, g)
            if d == 0.0:
                if h <= -0.2:
                    continue
                target = -0.35
            else:
                if h <= 2.2:
                    continue
                t = d / apron
                t = t * t * (3 - 2 * t)
                target = 0.9 * (1 - t) + h * t
            nr, ng = encode_h(target)
            pix[col, row] = (nr, ng, b)
            changed += 1
    im.save(path)
    print(f"carved {changed} px in h_{rx}_{rz}")
    if changed < 4:
        # The ring is already below sea level on a re-run.
        low = 0
        for row in range(im.size[1]):
            for col in range(im.size[0]):
                x = X0 + rx * RS + col * PX
                z = Z0 + rz * RS + row * PX
                if inside(x, z, world) and decode_h(*pix[col, row][:2]) <= -0.2:
                    low += 1
        print(f"already low {low} px")
        if low < 4:
            raise SystemExit("pool carve missed the ring")
    return changed


def hsh(i, salt):
    x = math.sin((i + 1.7) * 12.9898 + salt * 78.233) * 43758.5453
    return x - math.floor(x)


def outward_at(ring, i):
    """Away from the pool centre. An edge normal on a concave corner points
    inward and dragged the wall across the water."""
    x, z = ring[i]
    length = math.hypot(x, z) or 1.0
    return x / length, z / length


def seaward(x, z):
    """Land rises to the west. The sea is the east side of the basin."""
    return x > 1.4


def crag(mesh, x, z, y0, h, rw, rd, seed):
    """Irregular volcanic tooth. A five-quad box read as a grey crate."""
    n = 5
    rings = []
    for ri, frac in enumerate((0.0, 0.42, 1.0)):
        row = []
        shrink = 1.0 - ri * 0.22
        for k in range(n):
            ang = 2 * math.pi * (k + 0.17 * hsh(seed, ri)) / n
            rad = (0.42 + 0.85 * hsh(seed * 5 + k, ri + 1)) * shrink
            jy = (hsh(seed, k + ri * 3) - 0.45) * h * 0.16
            row.append((
                x + math.cos(ang) * rw * rad,
                y0 + h * frac + jy,
                z + math.sin(ang) * rd * rad,
            ))
        rings.append(row)
    for ri in range(len(rings) - 1):
        for k in range(n):
            j = (k + 1) % n
            a, b = rings[ri][k], rings[ri][j]
            c, d = rings[ri + 1][j], rings[ri + 1][k]
            outward = ((a[0] + c[0]) * 0.5 - x, 0.15, (a[2] + c[2]) * 0.5 - z)
            quad_facing(mesh, a, b, c, d, outward, uvs_for(a, b, c, d))
    top = rings[-1]
    for k in range(1, n - 1):
        tri_facing(
            mesh, top[0], top[k + 1], top[k], (0, 1, 0),
            (uv_at(top[0]), uv_at(top[k + 1]), uv_at(top[k])),
        )


def enclose(rock, ring, water_y, sample, detail):
    """Landward crags, and a broken east gap the sea shows through."""
    step = 1 if detail else 2
    pts = [ring[i] for i in range(0, len(ring), step)]
    if len(pts) < 8:
        pts = list(ring)
    n = len(pts)
    gap = 0
    for i, (x, z) in enumerate(pts):
        j = (i + 1) % n
        x2, z2 = pts[j]
        if seaward(x, z) and seaward(x2, z2):
            gap += 1
            if detail and i % 2 == 0:
                crag(rock, x + 0.6, z, water_y - 0.55, 2.2 + 2.6 * hsh(i, 5), 2.4, 1.8, i + 40)
            continue
        # Shoulders framing the gap stay tall. The west rim, where the
        # overlook stands, is lower rock so the sea stays in frame.
        if x < -1.0:
            h = 1.6 + 2.4 * hsh(i, 1)
        else:
            h = 3.4 + 3.2 * hsh(i, 1)
        if not detail and i % 2:
            h *= 0.7
        ox, oz = outward_at(pts, i)
        crag(rock, x + ox * 0.8, z + oz * 0.8, water_y - 0.45, h, 2.2 + hsh(i, 6), 1.8 + hsh(i, 7), i)
    if gap < 3:
        raise SystemExit(f"seaward gap is only {gap} edges")
    if detail:
        # One stack in the gap, the rock that stands in the sea in the photo.
        east = max(range(n), key=lambda i: pts[i][0])
        ex, ez = pts[east]
        crag(rock, ex + 3.5, ez + 1.2, water_y - 0.2, 5.2, 2.4, 2.0, 3)
        crag(rock, ex + 3.8, ez + 0.6, water_y + 3.6, 3.4, 1.5, 1.3, 8)
        crag(rock, ex + 4.0, ez + 1.0, water_y + 6.2, 2.2, 1.0, 0.9, 13)
        scatter_land(rock, pts, water_y, sample)
        sea_rocks(rock, water_y)


def scatter_land(mesh, pts, water_y, sample):
    """Rocks on the west approach. The east is open water, not a boulder field."""
    for di, dist in enumerate((7.0, 16.0)):
        ring = radial_ring(pts, dist)
        for i, (x, z) in enumerate(ring):
            if x > -0.5:
                continue
            if i % 3:
                continue
            g = sample(x, z)
            y0 = min(g, water_y + 0.1) - 0.45
            crag(
                mesh, x, z, y0,
                1.8 + 2.2 * hsh(i, di + 3),
                4.2 + 1.6 * hsh(i, di + 11),
                3.2 + 1.2 * hsh(i, di + 17),
                i + di * 20,
            )


def sea_rocks(mesh, water_y):
    """A few dark rocks standing in the water beyond the gap."""
    for i, (x, z, h) in enumerate(((16, -2, 2.4), (22, 6, 1.6), (28, -6, 1.3), (18, 8, 2.8))):
        crag(mesh, x, z, water_y - 0.5, h, 1.7, 1.4, 60 + i)


def wavy(mesh, ring, y, amp, outward=(0, 1, 0)):
    pts = []
    for i, (x, z) in enumerate(ring):
        yy = y + amp * math.sin(i * 1.3) * (0.4 + 0.6 * math.sin(math.hypot(x, z) * 0.35))
        pts.append((x, yy, z))
    c = (0.0, y + amp * 0.15, 0.0)
    for i in range(len(pts)):
        tri_facing(mesh, c, pts[i], pts[(i + 1) % len(pts)], outward)


def sea_surface(mesh, foam, water_y):
    """Open water east of the basin, with two breaking crests."""
    x0, x1, z0, z1 = 2.0, 70.0, -34.0, 36.0
    nx, nz = 8, 6
    grid = []
    for j in range(nz + 1):
        row = []
        z = z0 + (z1 - z0) * j / nz
        for i in range(nx + 1):
            x = x0 + (x1 - x0) * i / nx
            wave = 0.22 * math.sin(x * 0.45 + z * 0.15) + 0.1 * math.sin(z * 0.6)
            row.append((x, water_y - 0.05 + wave, z))
        grid.append(row)
    for j in range(nz):
        for i in range(nx):
            a, b = grid[j][i], grid[j][i + 1]
            c, d = grid[j + 1][i + 1], grid[j + 1][i]
            quad_facing(mesh, a, b, c, d, (0, 1, 0))
    # Short broken crests and a splash against the gap, not stripes across the whole sea.
    for k in range(9):
        x = 11 + (k % 3) * 6.5 + hsh(k, 2) * 2
        z = -10 + (k // 3) * 8 + hsh(k, 3) * 3
        y = water_y + 0.25 + 0.2 * hsh(k, 4)
        span = 2.2 + hsh(k, 5) * 2.4
        a = (x, y, z)
        b = (x + 0.8, y + 0.35, z + span * 0.35)
        c = (x + 0.3, y + 0.1, z + span)
        d = (x - 0.4, water_y + 0.02, z + span * 0.6)
        quad_facing(foam, a, b, c, d, (0, 1, 0.2))
        # A low curl, kept short so it does not stand up as a white fin.



_VOLC = None


def volcanic_pngs():
    global _VOLC
    if _VOLC is None:
        _VOLC = _volcanic_images()
    return _VOLC


def _volcanic_images():
    import io
    from PIL import Image

    n = 128
    freq = 6

    def cell(ix, iy, salt):
        return hsh((ix % freq) * 13 + (iy % freq) * 7, salt)

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
        for x in range(n):
            u, v = x / n, y / n
            h = 0.0
            amp = 1.0
            for o, salt in enumerate((1.1, 3.7, 8.2)):
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
            nx = (hl - hr) * 4.0
            ny = (hd - hu) * 4.0
            nz = 1.0
            length = math.sqrt(nx * nx + ny * ny + nz * nz) or 1
            np_[x, y] = (int(128 + 127 * nx / length), int(128 + 127 * ny / length), int(255 * nz / length))
            h = height[y][x]
            shade = 10 + h * 48
            if noise(x / n, y / n, freq * 2, 5.5) < 0.2:
                shade = 6
            shade = max(5, min(90, shade))
            rust = noise(x / n, y / n, freq, 9.4)
            # A light brown stain. The stronger orange read as lava on the flat faces.
            if rust > 0.84:
                cp[x, y] = (int(min(110, shade * 1.6)), int(shade * 0.8), int(shade * 0.55))
            else:
                cp[x, y] = (int(shade * 1.02), int(shade * 0.94), int(shade * 0.88))

    def png(im):
        buf = io.BytesIO()
        im.save(buf, format="PNG", optimize=True)
        return buf.getvalue()

    return png(colour), png(normals)


def build():
    world = [from_ll(*p) for p in CONCHI_LL]
    # The floor and the 16 m apron are already carved. Another pass only
    # drifts the hillside, so the mesh rebuild leaves the heightmap alone.
    cx = sum(p[0] for p in world) / len(world)
    cz = sum(p[1] for p in world) / len(world)
    cache = {}
    h0 = sample_h(cx, cz, cache)
    water_y = 0.06 - h0
    print(f"origin {cx:.2f} {cz:.2f} floor {h0:.2f} water local {water_y:.2f} world {h0 + water_y:.3f}")
    if abs((h0 + water_y) - 0.06) > 0.02:
        raise SystemExit("water is not on the surf")
    ring = ccw([(p[0] - cx, p[1] - cz) for p in world])

    m = G.Model("conchi")
    # Multiplied by the volcanic texture. The texture carries the dark grey and the rust.
    m.material("rock", (0.82, 0.74, 0.66), rough=0.96, textured=True, normal=True)
    water = m.material("water", (0.04, 0.62, 0.58), rough=0.16, emissive=0.05)
    sea = m.material("sea", (0.03, 0.18, 0.32), rough=0.1, emissive=0.03)
    foam = m.material("foam", (0.86, 0.90, 0.88), rough=0.4)
    hi = m.mesh(0, "rock")
    lo = m.mesh(1, "rock")
    hiwater, lowater = m.mesh(0, water), m.mesh(1, water)
    hisea, losea = m.mesh(0, sea), m.mesh(1, sea)
    hifoam = m.mesh(0, foam)

    def sample(x, z):
        return sample_h(cx + x, cz + z, cache) - h0

    enclose(hi, ring, water_y, sample, True)
    enclose(lo, ring, water_y, sample, False)
    water_ring = [(x * 0.86, z * 0.86) for x, z in ring]
    wavy(hiwater, water_ring, water_y, 0.1)
    wavy(lowater, water_ring[::3], water_y, 0.06)
    sea_surface(hisea, hifoam, water_y)
    sea_surface(losea, hifoam, water_y)
    rock_mesh = m.mesh(0, "rock")
    if not rock_mesh.has_uv or len(rock_mesh.uv) != len(rock_mesh.pos):
        raise SystemExit(f"rock uvs {len(rock_mesh.uv)} pos {len(rock_mesh.pos)}")
    albedo, normal = volcanic_pngs()
    info = G.write_glb(m, HERO / "conchi.glb", images=[albedo, normal])
    G.check_glb(HERO / "conchi.glb")
    print("conchi", info)
    if info["lod0"] > 2600:
        raise SystemExit("pool mesh is too heavy for the phone")
    return cx, cz, h0, info, world


def footprint(world):
    return [[round(x, 1), round(z, 1)] for x, z in world]


def upsert(entry):
    text = MANIFEST.read_text()
    data = json.loads(text)
    ids = [item.get("id") for item in data]
    if entry["id"] in ids:
        data[ids.index(entry["id"])] = entry
        if ids != [item.get("id") for item in data]:
            raise SystemExit("id order changed")
        MANIFEST.write_text(json.dumps(data, indent=1) + "\n")
        return
    body = json.dumps(entry, indent=1)
    chunk = "\n".join(" " + line for line in body.splitlines())
    if not text.rstrip().endswith("]"):
        raise SystemExit("manifest shape")
    text = text.rstrip()[:-1] + ",\n" + chunk + "\n]\n"
    json.loads(text)
    MANIFEST.write_text(text)


def main():
    cx, cz, h0, info, world = build()
    if h0 == 0:
        raise SystemExit("refusing a zero floor pin")
    upsert({
        "id": "conchi",
        "k": "conchi",
        "name": "Conchi (Natural Pool)",
        "status": "accuracy-conchi",
        "x": round(cx, 2),
        "z": round(cz, 2),
        "y": round(h0, 2),
        "rotation": 0,
        "glb": "models/hero/conchi.glb",
        "lod": {"hi": "conchi_lod0", "lo": "conchi_lod1", "switch_m": 220},
        "tris": {"conchi_lod0": info["lod0"], "conchi_lod1": info["lod1"]},
        "textures": 2,
        "hide_footprint": footprint(world),
        "hide": [],
        "sign": False,
        "kind": "replace",
        "new_place": True,
        "geo_source": "OSM way 796907733, pool lowered to the surf",
        "ref_sources": "Commons 'Aruba-Natural-Pool-2013' (12.52444, -69.92889): open dark volcanic rock with the sea beyond: the east side is a gap with a stack, wave splash, and open water, and the west approach is rough rock rather than sand. Water stays at world Y 0.06. The rock grain is generated, not the photograph.",
        "frame": "glb origin = pool centroid (world x,z); glTF +X = world x, +Z = world z, Y up",
        "cat": "landmark",
    })
    print("manifest ok")


if __name__ == "__main__":
    main()
