#!/usr/bin/env python3
"""Held fixes for accuracy PR #31. Does not rerun the batch.

Hooiberg steps were disconnected tilted slabs. They become one concrete
flight (green treads, white risers, the colours in the ground photo) that
follows the 165 m slope, with pipe railings on both sides.

Fontein was a dark box. It becomes a weathered limestone cliff with the
mouth cut into the face, under an overhang, facing the road.

Conchi was uneven grey blocks and a water disc above the surf. The pool
floor is lowered to just below sea level so the water sits in the surf,
and the rim is rounded volcanic rock.
"""
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import accuracy_batch2 as B
import hero_glb as G

HERO = B.HERO
MANIFEST = B.MANIFEST
REAL = B.REAL

# Smoothed centreline of the existing stair, local to STEPS_ORIGIN.
# Top of the cone is the small-z end. The line is the one already in the
# hero (the true stair is not in OSM); only the treads are rebuilt.
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
    L = math.hypot(dx, dz) or 1.0
    return dx / L, dz / L


def build_stairs():
    """One continuous flight. Treads are horizontal, risers vertical.

    The path runs from the bottom (large local z, toward Caya Betico Croes)
    to the summit. Each tread sits on the uphill ground so the step follows
    the slope, and the side stringer closes the gap down to the tread below.
    """
    # STAIR_LINE is stored summit-first. Climb from the road end.
    line = list(reversed(STAIR_LINE))
    run = 0.36
    samples = _resample(line, run)
    cache = {}
    ox, oz = B.STEPS_ORIGIN
    h0 = B.sample_h(ox, oz, cache)
    raw = []
    for x, z in samples:
        raw.append(B.sample_h(ox + x, oz + z, cache) - h0)
    # Light smooth so a single DEM pixel does not kick one riser.
    g = []
    for i, y in enumerate(raw):
        acc = y
        n = 1
        if i:
            acc += raw[i - 1]
            n += 1
        if i + 1 < len(raw):
            acc += raw[i + 1]
            n += 1
        g.append(acc / n)
    # Tread i spans samples[i] -> samples[i+1] at the uphill ground.
    tread_y = [g[i + 1] + 0.04 for i in range(len(samples) - 1)]
    for i in range(1, len(tread_y)):
        if tread_y[i] < tread_y[i - 1] + 0.06:
            tread_y[i] = tread_y[i - 1] + 0.06
    floor0 = g[0] - 0.05

    half = 1.45  # 2.9 m between the white cheeks
    model = G.Model("hooiberg_steps")
    green = model.material("green", (0.20, 0.46, 0.24), rough=0.72)
    white = model.material("white", (0.90, 0.89, 0.86), rough=0.7)
    rail_c = model.material("rail", (0.22, 0.34, 0.24), rough=0.45)
    hi_g, lo_g = model.mesh(0, green), model.mesh(1, green)
    hi_w, lo_w = model.mesh(0, white), model.mesh(1, white)
    hi_r, lo_r = model.mesh(0, rail_c), model.mesh(1, rail_c)

    def side(mesh, a, b, outward):
        quad_facing(mesh, a[0], a[1], a[2], a[3], outward)

    def step(mesh_g, mesh_w, i0, i1, y_top, y_bot):
        p0, p1 = samples[i0], samples[i1]
        tx, tz = _along(p0, p1)
        rx, rz = tz, -tx  # right when looking uphill
        def corner(p, side_sign, y):
            return (p[0] + rx * half * side_sign, y, p[1] + rz * half * side_sign)
        fl, fr = corner(p0, -1, y_top), corner(p0, 1, y_top)
        bl, br = corner(p1, -1, y_top), corner(p1, 1, y_top)
        # Top, seen from above.
        quad_facing(mesh_g, fl, fr, br, bl, (0, 1, 0))
        # Riser at the downhill nose, the face a climber looks at.
        fl2, fr2 = corner(p0, -1, y_bot), corner(p0, 1, y_bot)
        quad_facing(mesh_w, fr, fl, fl2, fr2, (-tx, 0, -tz))
        # Cheeks. Outward is ±right.
        a0, a1 = corner(p0, -1, y_top), corner(p1, -1, y_top)
        b0, b1 = corner(p0, -1, y_bot), corner(p1, -1, y_bot)
        side(mesh_w, (a0, b0, b1, a1), None, (-rx, 0, -rz))
        c0, c1 = corner(p0, 1, y_top), corner(p1, 1, y_top)
        d0, d1 = corner(p0, 1, y_bot), corner(p1, 1, y_bot)
        side(mesh_w, (c0, c1, d1, d0), None, (rx, 0, rz))

    prev = floor0
    for i in range(len(tread_y)):
        step(hi_g, hi_w, i, i + 1, tread_y[i], prev)
        prev = tread_y[i]

    # Distant flight keeps the stepped profile, one tread per ~3 m.
    prev = floor0
    coarse = list(range(0, len(tread_y), 8))
    if coarse[-1] != len(tread_y) - 1:
        coarse.append(len(tread_y) - 1)
    for a, b in zip(coarse, coarse[1:]):
        step(lo_g, lo_w, a, b + 1 if b + 1 < len(samples) else b, tread_y[b], prev)
        prev = tread_y[b]

    def rail_one(mesh, i0, i1, lift):
        p0, p1 = samples[i0], samples[i1]
        tx, tz = _along(p0, p1)
        rx, rz = tz, -tx
        y0 = tread_y[min(i0, len(tread_y) - 1)] + lift
        y1 = tread_y[min(i1, len(tread_y) - 1)] + lift
        for sign in (-1, 1):
            ox, oz_ = rx * (half + 0.16) * sign, rz * (half + 0.16) * sign
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

    def rail_span(mesh, i0, i1, lift):
        for i in range(i0, i1):
            rail_one(mesh, i, min(i + 1, len(samples) - 1), lift)

    rail_span(hi_r, 0, len(tread_y), 0.90)
    rail_span(hi_r, 0, len(tread_y), 0.48)
    # Posts every eight steps, both sides.
    for i in range(0, len(tread_y), 8):
        p = samples[i]
        n = samples[min(i + 1, len(samples) - 1)]
        tx, tz = _along(p, n)
        rx, rz = tz, -tx
        y = tread_y[i]
        for sign in (-1, 1):
            G.box(
                hi_r,
                p[0] + rx * (half + 0.16) * sign,
                y + 0.48,
                p[1] + rz * (half + 0.16) * sign,
                0.07, 0.96, 0.07,
            )
    # Distant rail is one span per coarse step, not one per tread.
    for a, b in zip(coarse, coarse[1:]):
        rail_one(lo_r, a, min(b + 1, len(samples) - 1), 0.90)

    info = G.write_glb(model, HERO / "hooiberg_steps.glb")
    G.check_glb(HERO / "hooiberg_steps.glb")
    # The flight must climb, and the top tread must sit on the summit ground.
    assert tread_y[-1] > tread_y[0] + 80, tread_y[-1] - tread_y[0]
    print("stairs", info, "steps", len(tread_y), "rise", round(tread_y[-1] - floor0, 1))
    return info


def _solid(mesh, x0, x1, y0, y1, z0, z1):
    G.prism(mesh, x0, x1, z0, z1, y0, y1)


def build_fontein():
    """Limestone cliff. The mouth is a hole in the face, not a box on the sand.

    Local +X faces the road; rotate_model turns that toward the nearest road,
    the same convention the batch used.
    """
    cx, cz = 6810.15, 2992.52
    roads = B.load_roads()
    road = B.nearest_road_point(roads, cx, cz, 400)
    ang = math.atan2(road[1] - cz, road[0] - cx) if road else 0.0
    print(f"  fontein faces road {road[3]!r} {road[2]:.0f} m ang {ang:.2f}")

    m = G.Model("fontein_cave")
    rock = m.material("rock", (0.46, 0.44, 0.40), rough=0.92)
    dark = m.material("strata", (0.30, 0.28, 0.26), rough=0.95)
    light = m.material("talus", (0.64, 0.60, 0.52), rough=0.9)
    cave = m.material("cave", (0.045, 0.040, 0.036), rough=1.0)
    gate = m.material("gate", (0.18, 0.17, 0.16), rough=0.6)
    hi, lo = m.mesh(0, rock), m.mesh(1, rock)
    hid, lod = m.mesh(0, dark), m.mesh(1, dark)
    hil = m.mesh(0, light)
    hic, loc = m.mesh(0, cave), m.mesh(1, cave)
    hig = m.mesh(0, gate)

    # Irregular cliff: tall centre, lower shoulders, foot buried in the sand.
    _solid(hi, -9.2, -1.6, -0.55, 12.6, -13.5, 13.5)
    _solid(hi, -7.4, 0.35, -0.5, 10.2, -17.5, -2.6)
    _solid(hi, -7.0, 0.55, -0.5, 8.6, 2.6, 16.5)
    _solid(hi, -6.2, 0.2, -0.45, 6.4, -20.0, -14.0)
    _solid(hi, -5.4, 0.9, -0.45, 5.2, 13.5, 19.5)
    _solid(hi, -4.8, -0.4, 11.4, 14.2, -5.0, 4.5)  # broken crest
    _solid(hi, -3.5, -0.2, 9.6, 12.4, 4.0, 10.0)
    # Brow projecting over the mouth, toward the road.
    _solid(hi, -3.2, 1.85, 3.35, 6.8, -6.4, 6.6)
    _solid(hid, -2.4, 1.55, 3.15, 4.05, -5.6, 5.6)  # dark underside of the brow
    # Stepped arch: rock fills the upper corners of the opening.
    for i, (y0, inset) in enumerate(((1.7, 0.55), (2.25, 1.15), (2.75, 1.8))):
        _solid(hi, -1.2, 0.45, y0, 3.45, -3.15, -3.15 + inset)
        _solid(hi, -1.2, 0.45, y0, 3.45, 3.15 - inset, 3.15)
    # Jambs proud of the face, so the cut has a thickness.
    _solid(hi, -0.4, 0.7, -0.4, 3.5, -4.3, -2.9)
    _solid(hi, -0.4, 0.7, -0.4, 3.5, 2.9, 4.3)
    _solid(hil, -0.2, 0.85, -0.55, 1.15, -4.6, -3.2)
    _solid(hil, -0.2, 0.85, -0.55, 1.15, 3.2, 4.6)
    # Sill, just under the opening, so the mouth is not a floating hole.
    _solid(hil, -1.0, 1.1, -0.55, 0.18, -3.3, 3.3)
    # Talus along the foot.
    _solid(hil, -2.0, 1.4, -0.6, 0.7, -18.0, -6.0)
    _solid(hil, -1.6, 1.6, -0.6, 0.85, 6.5, 17.5)
    # Bedding ledges.
    _solid(hid, -1.0, 0.7, 5.15, 5.45, -16.0, -4.0)
    _solid(hid, -0.8, 0.85, 7.55, 7.85, 3.5, 15.5)
    _solid(hid, -2.5, 0.15, 2.05, 2.28, -15.5, -5.5)

    # Interior of the main mouth, recessed behind the face.
    _solid(hic, -6.4, 0.15, 0.05, 3.15, -2.75, 2.75)
    _solid(hic, -5.6, -1.4, 2.6, 4.4, -2.4, 2.4)
    # Side hollow, the second scoop in the cliff.
    _solid(hic, -3.4, 0.25, 0.1, 2.15, 7.4, 10.6)
    _solid(hi, -0.3, 0.55, 1.7, 2.5, 7.2, 8.0)
    _solid(hi, -0.3, 0.55, 1.7, 2.5, 10.0, 10.8)
    # A small high crevice.
    _solid(hic, -2.2, 0.1, 6.3, 7.6, -8.2, -6.4)

    # Gate across the main mouth, set on the face.
    for k in range(4):
        _solid(hig, 0.35, 0.48, 0.45 + k * 0.7, 0.52 + k * 0.7, -2.55, 2.55)
    _solid(hig, 0.32, 0.5, 0.3, 3.05, -2.55, -2.42)
    _solid(hig, 0.32, 0.5, 0.3, 3.05, 2.42, 2.55)

    # Distant cliff: one mass, the brow, and the dark mouth.
    _solid(lo, -8.0, 0.2, -0.4, 11.5, -16.0, 16.0)
    _solid(lo, -2.0, 1.4, 3.4, 6.4, -6.0, 6.0)
    _solid(loc, -2.0, 0.3, 0.15, 2.8, -2.6, 2.6)
    _solid(lod, -1.5, 0.4, 3.2, 3.7, -5.0, 5.0)

    B.rotate_model(m, ang)
    info = G.write_glb(m, HERO / "fontein_cave.glb")
    G.check_glb(HERO / "fontein_cave.glb")
    print("fontein", info)
    return info


def _ellipsoid(mesh, cx, cy, cz, rx, ry, rz, nlat=3, nlon=8):
    rings = []
    for i in range(nlat + 1):
        v = -math.pi / 2 + math.pi * i / nlat
        row = []
        for j in range(nlon):
            u = 2 * math.pi * j / nlon
            row.append((
                cx + rx * math.cos(v) * math.cos(u),
                cy + ry * math.sin(v),
                cz + rz * math.cos(v) * math.sin(u),
            ))
        rings.append(row)
    for i in range(nlat):
        for j in range(nlon):
            a = rings[i][j]
            b = rings[i][(j + 1) % nlon]
            c = rings[i + 1][(j + 1) % nlon]
            d = rings[i + 1][j]
            outward = (
                (a[0] + c[0]) / 2 - cx,
                (a[1] + c[1]) / 2 - cy,
                (a[2] + c[2]) / 2 - cz,
            )
            quad_facing(mesh, a, b, c, d, outward)


def _inside(x, z, ring):
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


def _carve_pool(world):
    """Drop the DEM inside the pool to just below sea level.

    The ocean surface is world Y = 0. A disc placed on top of the old
    shelf (about 0.9 m) floated above the surf. The shelf outside the
    ring is left alone so the approach does not sink.
    """
    from PIL import Image
    rx, rz = B.tile_of(sum(p[0] for p in world) / len(world), sum(p[1] for p in world) / len(world))
    path = REAL / f"h_{rx}_{rz}.png"
    im = Image.open(path).convert("RGB")
    pix = im.load()
    changed = 0
    for l in range(im.size[1]):
        for c in range(im.size[0]):
            x = B.X0 + rx * B.RS + c * B.PX
            z = B.Z0 + rz * B.RS + l * B.PX
            if not _inside(x, z, world):
                continue
            r, g, b = pix[c, l]
            h = B.decode_h(r, g)
            if h <= -0.2:
                continue
            nr, ng = B.encode_h(-0.35)
            pix[c, l] = (nr, ng, b)
            changed += 1
    im.save(path)
    print(f"conchi carved {changed} px in h_{rx}_{rz}")
    return changed


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


def build_conchi():
    world = [B.from_ll(*p) for p in CONCHI_LL]
    _carve_pool(world)
    cx = sum(p[0] for p in world) / len(world)
    cz = sum(p[1] for p in world) / len(world)
    cache = {}
    h0 = B.sample_h(cx, cz, cache)
    # Surf is world Y ~ 0.06. Local Y is relative to the (now lower) origin.
    water_y = 0.06 - h0
    print(f"conchi origin h {h0:.2f} water local {water_y:.2f}")
    ring = B.ccw([(p[0] - cx, p[1] - cz) for p in world])
    outer = B.offset_ring(ring, 1.6)

    m = G.Model("conchi")
    rock = m.material("rock", (0.13, 0.10, 0.08), rough=0.92)
    warm = m.material("warm", (0.26, 0.16, 0.10), rough=0.88)
    wet = m.material("wet", (0.07, 0.06, 0.055), rough=0.7)
    water = m.material("water", (0.06, 0.70, 0.66), rough=0.16, emissive=0.08)
    hi = m.mesh(0, rock)
    hiw = m.mesh(0, warm)
    hid = m.mesh(0, wet)
    lo = m.mesh(1, rock)
    low = m.mesh(1, wet)

    n = len(outer)
    for i in range(n):
        x0, z0 = outer[i]
        x1, z1 = outer[(i + 1) % n]
        lx, lz = (x0 + x1) / 2, (z0 + z1) / 2
        span = math.hypot(x1 - x0, z1 - z0)
        g = B.sample_h(cx + lx, cz + lz, cache) - h0
        # +Z is the ocean side of this ring (the shelf drops that way).
        sea = lz > 6.0 and g < water_y + 1.2
        if sea and i % 3 == 0:
            continue  # surge gap
        if sea:
            top = water_y + 0.55 + (i % 3) * 0.18
            bot = water_y - 0.45
            rad = 0.9 + (i % 2) * 0.25
        else:
            extra = 0.4 + (i * 5 % 7) * 0.22
            top = max(g + 0.7, water_y + 1.3) + extra
            bot = min(g - 0.35, water_y - 0.4)
            rad = max(1.15, min(2.3, span * 0.55))
        mesh = hid if i % 4 == 0 else (hiw if i % 3 == 0 else hi)
        _ellipsoid(mesh, lx, (top + bot) / 2, lz, rad, (top - bot) / 2, rad * 0.82, 3, 7)
    # Two larger landward masses, the rocks that close the back of the bowl.
    land = sorted(outer, key=lambda p: p[1])[:4]
    for k, (lx, lz) in enumerate(land):
        g = B.sample_h(cx + lx, cz + lz, cache) - h0
        top = max(g + 1.6, water_y + 2.4)
        bot = water_y - 0.5
        _ellipsoid(hi if k % 2 == 0 else hiw, lx, (top + bot) / 2, lz, 2.4, (top - bot) / 2, 2.0, 3, 8)

    water_ring = [(x * 0.84, z * 0.84) for x, z in ring]
    G.fan(m.mesh(0, water), water_ring, water_y, up=True)
    G.fan(m.mesh(1, water), water_ring[::3] + water_ring[:1], water_y, up=True)
    # Distant rim: a handful of the same boulders.
    for i in range(0, n, 4):
        x0, z0 = outer[i]
        g = B.sample_h(cx + x0, cz + z0, cache) - h0
        top = max(g + 0.8, water_y + 1.4)
        bot = water_y - 0.3
        _ellipsoid(lo if i % 8 == 0 else low, x0, (top + bot) / 2, z0, 1.8, (top - bot) / 2, 1.5, 2, 6)

    info = G.write_glb(m, HERO / "conchi.glb")
    G.check_glb(HERO / "conchi.glb")
    print("conchi", round(cx, 1), round(cz, 1), info, "water_world", round(h0 + water_y, 3))
    assert abs((h0 + water_y) - 0.06) < 0.02
    return info


def _replace(text, old, new, label):
    if new in text:
        return text
    if old not in text:
        raise SystemExit(f"manifest string missing: {label}")
    return text.replace(old, new, 1)


def patch_manifest(stair, fontein, conchi):
    text = MANIFEST.read_text()
    text = _replace(
        text,
        '"name": "Green-painted concrete Hooiberg steps (approx line)"',
        '"name": "Hooiberg concrete stair"',
        "stair name",
    )
    import re
    text, n = re.subn(
        r'"hooiberg_steps_lod0": \d+,\n   "hooiberg_steps_lod1": \d+',
        f'"hooiberg_steps_lod0": {stair["lod0"]},\n   "hooiberg_steps_lod1": {stair["lod1"]}',
        text, count=1,
    )
    if n != 1:
        raise SystemExit("stair tris")
    text = _replace(
        text,
        "r28.mp4 3:00 green-painted concrete Hooiberg steps; drawn from the peak toward Caya Betico Croes (true stair line not in OSM data available), approx. Heights retied to the 165 m peak (raised-cosine restore of the SRTM summit, radius 200 m). Green paint kept: dashcam note, no ground photo contradicted it.",
        "Ground photo Commons 'Hooiberg hill staircase': one continuous concrete flight, green treads, white risers, pipe railings both sides. Same line from the peak toward Caya Betico Croes. Treads are horizontal and the stringers close the gaps. Heights follow the 165 m slope.",
        "stair ref",
    )
    text, n = re.subn(
        r'"fontein_cave_lod0": \d+,\n   "fontein_cave_lod1": \d+',
        f'"fontein_cave_lod0": {fontein["lod0"]},\n   "fontein_cave_lod1": {fontein["lod1"]}',
        text, count=1,
    )
    if n != 1:
        raise SystemExit("fontein tris")
    text = _replace(
        text,
        "Ground photo Commons 'Limestone cliffs near Fontein Cave': dark limestone cliff and cave mouths. Gated mouth. OSM node 540167863. Not a photo texture.",
        "Ground photo Commons 'Limestone cliffs near Fontein Cave': weathered limestone face, overhang, mouth cut into the base. Gated. OSM node 540167863. Not a photo texture.",
        "fontein ref",
    )
    text, n = re.subn(
        r'"conchi_lod0": \d+,\n   "conchi_lod1": \d+',
        f'"conchi_lod0": {conchi["lod0"]},\n   "conchi_lod1": {conchi["lod1"]}',
        text, count=1,
    )
    if n != 1:
        raise SystemExit("conchi tris")
    text = _replace(
        text,
        "Ground photo Commons 'Aruba-Natural-Pool-2013': dark rock bowl, turquoise water, ocean to the north. OSM way 796907733. Not a photo texture.",
        "Ground photo Commons 'Aruba-Natural-Pool-2013': rounded dark volcanic rock, turquoise pool level with the surf, low rocks on the ocean side. Pool floor lowered to just below sea level so the disc sits in the surf. OSM way 796907733. Not a photo texture.",
        "conchi ref",
    )
    MANIFEST.write_text(text)
    json_ok = __import__("json").loads(MANIFEST.read_text())
    ids = {e["id"] for e in json_ok}
    assert "hooiberg_steps" in ids and "fontein_cave" in ids and "conchi" in ids
    print("manifest patched", len(json_ok))


def main():
    stair = build_stairs()
    fontein = build_fontein()
    conchi = build_conchi()
    patch_manifest(stair, fontein, conchi)


if __name__ == "__main__":
    main()
