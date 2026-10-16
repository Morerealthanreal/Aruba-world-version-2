#!/usr/bin/env python3
"""Batch 2 accuracy pass.

Hooiberg peak is restored to 165 m only after the stair mesh is retied to the
new slope. Churches, cave mouths and the Conchi rock bowl are rebuilt from
OSM footprints and ground photos (geometry only, no photo textures). Lane
dashes are added on the owned divided highways, where the road shader already
paints edge lines but skips a centre dash on one-way carriageways.

Does not touch Noord, Palm Beach, Eagle Beach or downtown Oranjestad.
"""
import json
import math
import struct
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import hero_glb as G

ROOT = Path(__file__).resolve().parents[1]
REAL = ROOT / "game" / "data" / "real"
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"

X0, Z0, RS, PX = -10800.0, -11800.0, 1000.0, 4.0
XG = 111320 * math.cos(12.52 * math.pi / 180)
ZG = 110540.0
PEAK = (-2708.8013053074337, 327.66266799991104)
PEAK_ADD = 20.73  # 144.27 m SRTM -> 165 m
PEAK_R = 200.0
STEPS_ORIGIN = (-2709.78, 333.95)


def from_ll(lat, lon):
    return ((lon + 69.97) * XG, -(lat - 12.52) * ZG)


def bump(x, z):
    r = math.hypot(x - PEAK[0], z - PEAK[1])
    if r >= PEAK_R:
        return 0.0
    return PEAK_ADD * 0.5 * (1 + math.cos(math.pi * r / PEAK_R))


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
    l = min(249, max(0, math.floor(s)))
    u, d = o - c, s - l

    def H(cc, ll):
        r, g, _b = pix[cc, ll]
        return decode_h(r, g)

    p, m, h, g = H(c, l), H(c + 1, l), H(c, l + 1), H(c + 1, l + 1)
    return p + (m - p) * u + (h - p) * d + (p - m - h + g) * u * d


def raise_dem():
    from PIL import Image
    already = sample_h(*PEAK, {})
    if already > 160:
        print(f"dem already {already:.2f} m")
        return already
    tiles = [(7, 11), (7, 12), (8, 11), (8, 12)]
    changed = 0
    for rx, rz in tiles:
        path = REAL / f"h_{rx}_{rz}.png"
        im = Image.open(path).convert("RGB")
        pix = im.load()
        w, h = im.size
        for l in range(h):
            for c in range(w):
                x = X0 + rx * RS + c * PX
                z = Z0 + rz * RS + l * PX
                add = bump(x, z)
                if add < 0.02:
                    continue
                r, g, b = pix[c, l]
                nr, ng = encode_h(decode_h(r, g) + add)
                pix[c, l] = (nr, ng, b)
                changed += 1
        im.save(path)
    ov_path = REAL / "ov_h.png"
    ov = Image.open(ov_path).convert("RGB")
    op = ov.load()
    step = 32.0
    for l in range(ov.size[1]):
        for c in range(ov.size[0]):
            x = X0 + c * step
            z = Z0 + l * step
            add = bump(x, z)
            if add < 0.02:
                continue
            r, g, b = op[c, l]
            nr, ng = encode_h(decode_h(r, g) + add)
            op[c, l] = (nr, ng, b)
            changed += 1
    ov.save(ov_path)
    cache = {}
    cache = {}
    h = sample_h(*PEAK, cache)
    print(f"dem pixels touched {changed}, peak sample {h:.2f} m")
    return h


def _gltf(path):
    data = Path(path).read_bytes()
    o = 12
    js = blob = None
    while o < len(data) - 8:
        ln, ct = struct.unpack_from("<II", data, o)
        o += 8
        chunk = data[o:o + ln]
        o += ln
        if ct == 0x4E4F534A:
            js = json.loads(chunk)
        elif ct == 0x004E4942:
            blob = chunk
    return js, blob


def retie_stairs():
    """Keep every stair vertex's clearance over the old ground, on the new slope.

    A second run sees the float32 mesh already seated on the 165 m slope and
    leaves it alone. Re-applying the bump delta would lift the treads again.
    """
    js, blob = _gltf(HERO / "hooiberg_steps.glb")
    accs = js["accessors"]
    pa0 = accs[js["meshes"][0]["primitives"][0]["attributes"]["POSITION"]]
    if pa0.get("componentType") == 5126:
        def tris(mesh):
            return sum(accs[p["indices"]]["count"] // 3 for p in mesh["primitives"])
        info = {
            "lod0": tris(js["meshes"][0]),
            "lod1": tris(js["meshes"][1]),
            "bytes": (HERO / "hooiberg_steps.glb").stat().st_size,
        }
        print("stairs already seated", info)
        return info
    node = js["nodes"][0]
    sc = node["scale"]
    tr = node["translation"]
    cache = {}
    b0 = bump(*STEPS_ORIGIN)
    model = G.Model("hooiberg_steps")
    # Preserve the painted colours already in the file.
    colours = {
        "wall": ((1, 1, 1, 1), True),
        "roof": ((0.62396, 0.59062, 0.52712, 1), False),
        "green": ((0.07819, 0.32314, 0.10224, 1), False),
        "rail": ((0.68669, 0.68669, 0.68669, 1), False),
    }
    for name, (rgba, double) in colours.items():
        model.material(name, rgba[:3], double=double)
    mesh0 = js["meshes"][0]
    views = js["bufferViews"]
    accs = js["accessors"]
    # lod1 in the old file is a speck. Rebuild it from the retied centreline.
    centre = []
    for prim in mesh0["primitives"]:
        mat = js["materials"][prim["material"]]["name"]
        if mat == "lroof":
            mat = "roof"
        pa = accs[prim["attributes"]["POSITION"]]
        ia = accs[prim["indices"]]
        pv = views[pa["bufferView"]]
        iv = views[ia["bufferView"]]
        stride = pv.get("byteStride", 12)
        po = pv.get("byteOffset", 0) + pa.get("byteOffset", 0)
        io = iv.get("byteOffset", 0) + ia.get("byteOffset", 0)
        verts = []
        for i in range(pa["count"]):
            x, y, z = struct.unpack_from("<3h", blob, po + i * stride)
            lx = x / 32767 * sc[0] + tr[0]
            ly = y / 32767 * sc[1] + tr[1]
            lz = z / 32767 * sc[2] + tr[2]
            wx, wz = STEPS_ORIGIN[0] + lx, STEPS_ORIGIN[1] + lz
            ly = ly + bump(wx, wz) - b0
            verts.append((lx, ly, lz))
        mesh = model.mesh(0, mat)
        for k in range(0, ia["count"], 3):
            a, b, c = struct.unpack_from("<3H", blob, io + k * 2)
            mesh.tri(verts[a], verts[b], verts[c])
        if mat == "green":
            # centreline samples for the distant ribbon: average of each y-band
            centre.extend(verts)
    # Distant ribbon follows the retied treads, not the old 10 cm speck.
    centre.sort(key=lambda p: p[2])
    ribbon = model.mesh(1, "green")
    bins = {}
    for x, y, z in centre:
        bins.setdefault(round(z / 8), []).append((x, y, z))
    keys = sorted(bins)
    pts = []
    for k in keys:
        xs, ys, zs = zip(*bins[k])
        pts.append((sum(xs) / len(xs), sum(ys) / len(ys), sum(zs) / len(zs)))
    for i in range(len(pts) - 1):
        x0, y0, z0 = pts[i]
        x1, y1, z1 = pts[i + 1]
        dx, dz = x1 - x0, z1 - z0
        L = math.hypot(dx, dz) or 1
        px, pz = -dz / L * 1.15, dx / L * 1.15
        y0 += 0.25
        y1 += 0.25
        ribbon.quad(
            (x0 - px, y0, z0 - pz),
            (x1 - px, y1, z1 - pz),
            (x1 + px, y1, z1 + pz),
            (x0 + px, y0, z0 + pz),
        )
    info = G.write_glb(model, HERO / "hooiberg_steps.glb")
    G.check_glb(HERO / "hooiberg_steps.glb")
    # clearance of the green treads versus the new terrain, at the two ends
    greens = [p for p in model.mesh(0, "green").pos]
    greens.sort(key=lambda p: p[2])
    for label, p in (("top", greens[0]), ("bottom", greens[-1])):
        wx, wz = STEPS_ORIGIN[0] + p[0], STEPS_ORIGIN[1] + p[2]
        world_y = sample_h(*STEPS_ORIGIN, cache) + p[1]
        ground = sample_h(wx, wz, cache)
        print(f"stair {label} clearance {world_y - ground:.2f} m at r={math.hypot(wx-PEAK[0], wz-PEAK[1]):.0f}")
    print("stairs", info)
    return info


def shoelace(ring):
    a = 0.0
    for i, (x, z) in enumerate(ring):
        x1, z1 = ring[(i + 1) % len(ring)]
        a += x * z1 - x1 * z
    return a


def ccw(ring):
    ring = list(ring)
    if shoelace(ring) < 0:
        ring.reverse()
    return ring


def offset_ring(ring, dist):
    """Outward offset of a CCW ring."""
    n = len(ring)
    out = []
    for i in range(n):
        x0, z0 = ring[(i - 1) % n]
        x1, z1 = ring[i]
        x2, z2 = ring[(i + 1) % n]
        ax, az = x1 - x0, z1 - z0
        bx, bz = x2 - x1, z2 - z1
        la, lb = math.hypot(ax, az) or 1, math.hypot(bx, bz) or 1
        # right-hand normal is outward for CCW
        nax, naz = az / la, -ax / la
        nbx, nbz = bz / lb, -bx / lb
        ox, oz = nax + nbx, naz + nbz
        L = math.hypot(ox, oz) or 1
        out.append((x1 + ox / L * dist, z1 + oz / L * dist))
    return out


def longest_edge(ring):
    best = 0
    ang = 0
    for i, (x, z) in enumerate(ring):
        x1, z1 = ring[(i + 1) % len(ring)]
        dx, dz = x1 - x, z1 - z
        L = math.hypot(dx, dz)
        if L > best:
            best = L
            ang = math.atan2(dz, dx)
    return ang, best


def to_align(x, z, ang):
    c, s = math.cos(-ang), math.sin(-ang)
    return (x * c - z * s, x * s + z * c)


def rotate_model(model, ang):
    c, s = math.cos(ang), math.sin(ang)
    for lod in model.lod:
        for mesh in lod.values():
            mesh.pos = [(p[0] * c - p[2] * s, p[1], p[0] * s + p[2] * c) for p in mesh.pos]
            mesh.nrm = [(n[0] * c - n[2] * s, n[1], n[0] * s + n[2] * c) for n in mesh.nrm]


def load_roads():
    roads = []
    for path in REAL.glob("r_*.json"):
        data = json.loads(path.read_text())
        for r in data["roads"]:
            roads.append(r)
        for j in data.get("junc") or []:
            roads.append({"_junc": j})
    return roads


def nearest_road_point(roads, x, z, limit=120):
    best = None
    bd = limit * limit
    for r in roads:
        if "_junc" in r or "p" not in r:
            continue
        for px, pz in r["p"]:
            d = (px - x) ** 2 + (pz - z) ** 2
            if d < bd:
                bd = d
                best = (px, pz, math.sqrt(d), r.get("n") or "")
    return best


def church_frame(world_ring, roads):
    cx = sum(p[0] for p in world_ring) / len(world_ring)
    cz = sum(p[1] for p in world_ring) / len(world_ring)
    local = [(p[0] - cx, p[1] - cz) for p in world_ring]
    ang, length = longest_edge(local)
    aligned = [to_align(x, z, ang) for x, z in local]
    # +X in aligned space follows the long edge. Flip so +X points at the road.
    road = nearest_road_point(roads, cx, cz, 250)
    if road:
        rx, rz = to_align(road[0] - cx, road[1] - cz, ang)
        if rx < 0:
            ang += math.pi
            aligned = [(-x, -z) for x, z in aligned]
            rx, rz = -rx, -rz
        print(f"  front toward road {road[3]!r} {road[2]:.0f} m, aligned road ({rx:.1f},{rz:.1f})")
    xs = [p[0] for p in aligned]
    zs = [p[1] for p in aligned]
    return cx, cz, ang, aligned, min(xs), max(xs), min(zs), max(zs), length


def add_windows(mesh_g, mesh_f, x, z, y0, y1, face, n=1, gap=2.4):
    """Tall dark windows with a pointed hood, on one face of an aligned wall."""
    for i in range(n):
        t = (i - (n - 1) / 2) * gap
        if face in ("px", "nx"):
            xx = x + (0.08 if face == "px" else -0.08)
            zz = z + t
            G.box(mesh_g, xx, (y0 + y1) / 2, zz, 0.12, y1 - y0, 0.55)
            G.prism(mesh_f, xx - 0.08, xx + 0.08, zz - 0.7, zz + 0.7, y1 - 0.15, y1 + 0.55)
        else:
            zz = z + (0.08 if face == "pz" else -0.08)
            xx = x + t
            G.box(mesh_g, xx, (y0 + y1) / 2, zz, 0.55, y1 - y0, 0.12)
            G.prism(mesh_f, xx - 0.7, xx + 0.7, zz - 0.08, zz + 0.08, y1 - 0.15, y1 + 0.55)


def cross(mesh, x, y, z, h, w, t, axis="z"):
    if axis == "z":
        G.box(mesh, x, y, z, t, h, t)
        G.box(mesh, x, y + h * 0.18, z, t, t, w)
    else:
        G.box(mesh, x, y, z, t, h, t)
        G.box(mesh, x, y + h * 0.18, z, w, t, t)


def build_santa_cruz(roads):
    # OSM way 297003468, Parokia Inmaculada Concepción / Church of Holy Mary.
    ll = [
        (12.510516, -69.982505), (12.510544, -69.982504), (12.510542, -69.982453),
        (12.510514, -69.982454), (12.510502, -69.982127), (12.510541, -69.982126),
        (12.510538, -69.982058), (12.510485, -69.982060), (12.510484, -69.982027),
        (12.510409, -69.982030), (12.510410, -69.982063), (12.510363, -69.982065),
        (12.510366, -69.982137), (12.510383, -69.982136), (12.510397, -69.982509),
    ]
    world = [from_ll(*p) for p in ll]
    cx, cz, ang, aligned, x0, x1, z0, z1, length = church_frame(world, roads)
    ring = ccw(aligned)
    m = G.Model("sc_holymary")
    wall = m.material("wall", (0.90, 0.89, 0.86))
    blue = m.material("blue", (0.20, 0.40, 0.70))
    plinth = m.material("plinth", (0.16, 0.32, 0.58))
    roof = m.material("roof", (0.78, 0.76, 0.72))
    cap = m.material("cap", (0.72, 0.32, 0.16))
    door = m.material("door", (0.40, 0.24, 0.12))
    glass = m.material("glass", (0.12, 0.16, 0.22))
    step = m.material("step", (0.72, 0.62, 0.48))
    hi_w, hi_b, hi_p = m.mesh(0, wall), m.mesh(0, blue), m.mesh(0, plinth)
    G.wall_ring(hi_w, ring, 0, 7.2)
    G.wall_ring(hi_p, offset_ring(ring, 0.14), 0, 1.25)
    G.gable_roof(m.mesh(0, roof), x0 - 0.4, x1 + 0.6, z0 + 0.4, z1 - 0.4, 6.9, 11.2)
    # gable-end cross and blue rake, on the front (+X)
    G.prism(hi_b, x1 - 0.15, x1 + 0.08, z0 + 0.3, z1 - 0.3, 7.0, 7.25)
    cross(hi_b, x1 + 0.12, 9.2, (z0 + z1) / 2 + 1.2, 2.4, 1.5, 0.18, "x")
    # Tower on the viewer's left of the east front, matching the 2021 photo.
    # Facing +X, left is +Z.
    tx, tz = x1 - 1.6, z1 - 2.2
    G.box(hi_w, tx, 9.0, tz, 4.4, 18.0, 4.4)
    G.box(hi_p, tx, 0.7, tz, 4.7, 1.4, 4.7)
    G.box(hi_b, tx, 16.6, tz, 4.8, 0.35, 4.8)
    for s in (-1.15, 1.15):
        G.box(hi_b, tx + s, 8.5, tz + 2.25, 0.18, 12, 0.12)
        G.box(hi_b, tx + s, 8.5, tz - 2.25, 0.18, 12, 0.12)
        G.box(hi_b, tx + 2.25, 8.5, tz + s, 0.12, 12, 0.18)
    add_windows(m.mesh(0, glass), hi_b, tx + 2.2, tz, 14.6, 16.2, "px", 3, 0.9)
    # red tile cap
    G.gable_roof(m.mesh(0, cap), tx - 2.3, tx + 2.3, tz - 2.3, tz + 2.3, 17.7, 20.4)
    cross(hi_b, tx, 20.6, tz, 1.5, 0.9, 0.12, "z")
    # porch and doors
    G.box(hi_w, x1 + 2.2, 3.3, (z0 + z1) / 2 - 1.5, 4.6, 0.28, 7.2)
    G.prism(hi_w, x1 - 0.2, x1 + 4.4, (z0 + z1) / 2 - 5.2, (z0 + z1) / 2 + 2.2, 3.15, 3.45)
    G.box(m.mesh(0, door), x1 + 0.15, 1.7, (z0 + z1) / 2 - 1.5, 0.2, 3.2, 2.4)
    add_windows(m.mesh(0, glass), hi_b, x1, (z0 + z1) / 2 + 2.4, 4.2, 8.6, "px", 1)
    add_windows(m.mesh(0, glass), hi_b, x1, (z0 + z1) / 2 - 4.6, 4.0, 7.4, "px", 1)
    for i, yy in enumerate((0.18, 0.42, 0.66)):
        G.box(m.mesh(0, step), x1 + 3.2 + i * 0.15, yy, (z0 + z1) / 2 - 1.5, 6.5 - i * 0.7, 0.22, 8.5)
    # side windows along the long walls
    add_windows(m.mesh(0, glass), hi_b, (x0 + x1) / 2, z0, 2.2, 5.4, "nz", 4, 6)
    add_windows(m.mesh(0, glass), hi_b, (x0 + x1) / 2 - 4, z1, 2.2, 5.4, "pz", 3, 6)
    # lod1: nave box, roof wedge, tower
    G.box(m.mesh(1, wall), (x0 + x1) / 2, 3.6, (z0 + z1) / 2, x1 - x0, 7.2, z1 - z0)
    G.box(m.mesh(1, plinth), (x0 + x1) / 2, 0.6, (z0 + z1) / 2, x1 - x0 + 0.3, 1.2, z1 - z0 + 0.3)
    G.box(m.mesh(1, wall), tx, 9, tz, 4.4, 18, 4.4)
    G.box(m.mesh(1, cap), tx, 19.2, tz, 3.2, 2.2, 3.2)
    G.gable_roof(m.mesh(1, roof), x0, x1, z0, z1, 6.9, 11.2)
    rotate_model(m, ang)
    info = G.write_glb(m, HERO / "sc_holymary.glb")
    G.check_glb(HERO / "sc_holymary.glb")
    print("santa cruz", round(cx, 1), round(cz, 1), info, "len", round(length, 1))
    return cx, cz, world, info


def build_savaneta(roads):
    # OSM way 376320397, catholic. Ground photo: peach walls, maroon stripes,
    # red roof, square tower with a white cross (Holy Heart, Savaneta).
    ll = [
        (12.447715, -69.943259), (12.447581, -69.943281),
        (12.447536, -69.942999), (12.447670, -69.942976),
    ]
    world = [from_ll(*p) for p in ll[:-1]] if False else [from_ll(*p) for p in ll]
    cx, cz, ang, aligned, x0, x1, z0, z1, length = church_frame(world, roads)
    ring = ccw(aligned)
    m = G.Model("sav_sacredheart")
    wall = m.material("wall", (0.86, 0.55, 0.36))
    maroon = m.material("maroon", (0.48, 0.20, 0.22))
    roof = m.material("roof", (0.62, 0.15, 0.12))
    door = m.material("door", (0.36, 0.18, 0.08))
    glass = m.material("glass", (0.20, 0.28, 0.34))
    white = m.material("white", (0.93, 0.93, 0.90))
    palm = m.material("palm", (0.45, 0.32, 0.18))
    frond = m.material("frond", (0.16, 0.42, 0.16))
    hi_w, hi_m = m.mesh(0, wall), m.mesh(0, maroon)
    G.wall_ring(hi_w, ring, 0, 6.4)
    G.wall_ring(hi_m, offset_ring(ring, 0.10), 0, 0.7)
    G.gable_roof(m.mesh(0, roof), x0 - 0.3, x1 + 0.4, z0 - 0.2, z1 + 0.2, 6.2, 10.4)
    # tower at the front, viewer's left (+Z)
    tx, tz = x1 - 2.2, z1 + 0.4
    G.box(hi_w, tx, 8.2, tz, 4.6, 16.4, 4.6)
    for s in (-1.35, 0, 1.35):
        G.box(hi_m, tx + s, 8.0, tz + 2.35, 0.28, 14.5, 0.16)
        G.box(hi_m, tx + 2.35, 8.0, tz + s, 0.16, 14.5, 0.28)
    add_windows(m.mesh(0, glass), hi_m, tx, tz + 2.3, 12.4, 15.2, "pz", 2, 1.1)
    G.prism(m.mesh(0, white), tx - 2.6, tx + 2.6, tz - 2.6, tz + 2.6, 16.2, 16.5)
    G.gable_roof(m.mesh(0, roof), tx - 2.5, tx + 2.5, tz - 2.5, tz + 2.5, 16.4, 18.6)
    cross(m.mesh(0, white), tx, 18.8, tz, 1.6, 1.0, 0.12)
    # front gable windows and door
    G.box(m.mesh(0, door), x1 + 0.12, 1.6, 0, 0.18, 3.0, 2.2)
    add_windows(m.mesh(0, glass), hi_m, x1, 2.6, 3.4, 8.8, "px", 1)
    add_windows(m.mesh(0, glass), hi_m, x1, -2.6, 3.4, 8.8, "px", 1)
    add_windows(m.mesh(0, glass), hi_m, (x0 + x1) / 2, z0, 1.8, 4.6, "nz", 4, 5.5)
    add_windows(m.mesh(0, glass), hi_m, (x0 + x1) / 2, z1, 1.8, 4.6, "pz", 3, 5.5)
    # one palm in front, whitewashed base as in the photo
    px, pz = x1 + 6.5, z1 - 1.5
    G.box(m.mesh(0, palm), px, 3.2, pz, 0.45, 6.4, 0.45)
    G.box(m.mesh(0, white), px, 0.7, pz, 0.55, 1.4, 0.55)
    G.box(m.mesh(0, frond), px, 6.5, pz, 3.4, 0.25, 0.7)
    G.box(m.mesh(0, frond), px, 6.4, pz, 0.7, 0.25, 3.2)
    # lod1
    G.box(m.mesh(1, wall), (x0 + x1) / 2, 3.2, 0, x1 - x0, 6.4, z1 - z0)
    G.gable_roof(m.mesh(1, roof), x0, x1, z0, z1, 6.2, 10.4)
    G.box(m.mesh(1, wall), tx, 8, tz, 4.6, 16, 4.6)
    rotate_model(m, ang)
    info = G.write_glb(m, HERO / "sav_sacredheart.glb")
    G.check_glb(HERO / "sav_sacredheart.glb")
    print("savaneta", round(cx, 1), round(cz, 1), info)
    return cx, cz, world, info


def build_seroe(roads):
    # OSM way 97566669. Ground photos: white chapel, steep red gables,
    # stone buttresses, round window, separate small sunday-school gable.
    ll = [
        (12.419618, -69.884159), (12.419790, -69.884318),
        (12.419709, -69.884411), (12.419536, -69.884251),
    ]
    world = [from_ll(*p) for p in ll]
    cx, cz, ang, aligned, x0, x1, z0, z1, length = church_frame(world, roads)
    ring = ccw(aligned)
    m = G.Model("seroe_church")
    wall = m.material("wall", (0.93, 0.92, 0.88))
    roof = m.material("roof", (0.55, 0.13, 0.10))
    stone = m.material("stone", (0.75, 0.70, 0.60))
    door = m.material("door", (0.28, 0.13, 0.10))
    glass = m.material("glass", (0.15, 0.18, 0.20))
    cactus = m.material("cactus", (0.22, 0.40, 0.20))
    hi_w = m.mesh(0, wall)
    G.wall_ring(hi_w, ring, 0, 5.6)
    G.gable_roof(m.mesh(0, roof), x0 - 0.3, x1 + 0.3, z0 - 0.15, z1 + 0.15, 5.4, 11.4)
    # transept gable on the +Z side
    G.prism(hi_w, -2.2, 3.4, z1 - 0.4, z1 + 3.2, 0, 5.5)
    G.gable_roof(m.mesh(0, roof), -2.5, 3.7, z1 - 0.5, z1 + 3.4, 5.3, 8.2)
    G.box(m.mesh(0, door), 0.6, 1.5, z1 + 3.25, 1.1, 2.6, 0.16)
    G.box(m.mesh(0, glass), 0.6, 4.3, z1 + 3.28, 0.7, 1.3, 0.1)
    # front: round window (octagon-ish box) and arched door
    G.box(m.mesh(0, glass), x1 + 0.1, 6.6, 0, 0.12, 1.1, 1.1)
    G.box(m.mesh(0, door), x1 + 0.1, 1.6, 0, 0.16, 3.0, 1.6)
    # buttresses along the long side
    span = x1 - x0
    for i in range(5):
        x = x0 + span * (0.18 + 0.15 * i)
        G.box(m.mesh(0, stone), x, 2.5, z0 - 0.85, 0.9, 5.0, 1.5)
        G.box(m.mesh(0, stone), x, 4.7, z0 - 0.55, 0.55, 1.3, 0.9)
        G.box(m.mesh(0, stone), x, 2.3, z1 + 0.55, 0.8, 4.6, 1.2)
        G.box(m.mesh(0, stone), x, 4.4, z1 + 0.35, 0.5, 1.1, 0.7)
    # sunday-school chapel off the rear corner
    G.box(hi_w, x0 - 3.2, 2.4, z0 + 1.5, 6.2, 4.8, 5.2)
    G.gable_roof(m.mesh(0, roof), x0 - 6.4, x0, z0 - 1.2, z0 + 4.2, 4.6, 6.8)
    G.box(m.mesh(0, door), x0 - 3.2, 1.3, z0 - 1.15, 1.2, 2.2, 0.12)
    # two columnar cacti, the thing you see before the building from the lot
    for cx_, cz_, h in ((x1 + 4, z1 + 2, 5.5), (x1 + 2, z0 - 3, 4.2)):
        G.box(m.mesh(0, cactus), cx_, h / 2, cz_, 0.55, h, 0.55)
    G.box(m.mesh(1, wall), 0, 2.8, 0, x1 - x0, 5.6, z1 - z0)
    G.gable_roof(m.mesh(1, roof), x0, x1, z0, z1, 5.4, 11.4)
    G.box(m.mesh(1, wall), x0 - 3.2, 2.4, z0 + 1.5, 6.2, 4.8, 5.2)
    rotate_model(m, ang)
    info = G.write_glb(m, HERO / "seroe_church.glb")
    G.check_glb(HERO / "seroe_church.glb")
    print("seroe", round(cx, 1), round(cz, 1), info)
    return cx, cz, world, info


def build_cave(name, lat, lon, roads, mouths, length, height, depth):
    """Dark limestone cliff with cave mouths facing the nearest road."""
    cx, cz = from_ll(lat, lon)
    road = nearest_road_point(roads, cx, cz, 400)
    if road:
        ang = math.atan2(road[1] - cz, road[0] - cx)
        print(f"  {name} faces road {road[3]!r} {road[2]:.0f} m")
    else:
        ang = 0
    m = G.Model(name)
    # Dark charcoal limestone. The first pass was a pale box and read as a garage.
    rock = m.material("rock", (0.11, 0.10, 0.09))
    dark = m.material("dark", (0.035, 0.032, 0.03))
    rust = m.material("rust", (0.22, 0.18, 0.14))
    gate = m.material("gate", (0.16, 0.15, 0.14))
    hi = m.mesh(0, rock)
    # cliff body set back from the road, with a lip over the mouths
    G.box(hi, -depth / 2 - 0.6, height / 2, 0, depth, height, length)
    G.box(hi, -0.2, height - 1.8, 0, depth * 0.45, 2.6, length * 0.98)
    G.box(m.mesh(0, rust), -depth * 0.15, height - 0.2, -length * 0.18, depth * 0.4, 1.8, length * 0.32)
    G.box(hi, -depth * 0.3, height + 0.7, length * 0.16, depth * 0.32, 2.4, length * 0.26)
    for i, (z, w, mh) in enumerate(mouths):
        # open mouth under the overhang, low, wider than it is tall
        G.box(m.mesh(0, dark), 0.05, mh / 2 + 0.15, z, 1.6, mh, w)
        G.box(hi, 0.15, mh * 0.35, z - w / 2 - 0.35, 1.5, mh * 0.7, 0.7)
        G.box(hi, 0.15, mh * 0.35, z + w / 2 + 0.35, 1.5, mh * 0.7, 0.7)
        if name == "fontein_cave":
            for k in range(3):
                G.box(m.mesh(0, gate), 0.9, 0.55 + k * (mh / 3.4), z, 0.05, 0.05, w * 0.88)
    if name == "quadirikiri":
        for z in (-4.5, 5.5):
            G.box(m.mesh(0, dark), -depth * 0.35, height + 0.15, z, 2.2, 0.5, 2.2)
    G.box(m.mesh(1, rock), -depth / 2, height / 2, 0, depth, height, length)
    for z, w, mh in mouths:
        G.box(m.mesh(1, dark), 0.2, mh / 2, z, 0.6, mh, w)
    rotate_model(m, ang)
    info = G.write_glb(m, HERO / f"{name}.glb")
    G.check_glb(HERO / f"{name}.glb")
    print(name, round(cx, 1), round(cz, 1), info)
    return cx, cz, info


def build_conchi():
    # Water polygon already exists in r_15_11. Rocks around it, plus a
    # turquoise disc so the bowl reads from the path. OSM way 796907733.
    ll = [
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
    world = [from_ll(*p) for p in ll]
    cx = sum(p[0] for p in world) / len(world)
    cz = sum(p[1] for p in world) / len(world)
    ring = ccw([(p[0] - cx, p[1] - cz) for p in world])
    outer = offset_ring(ring, 3.2)
    m = G.Model("conchi")
    rock = m.material("rock", (0.22, 0.18, 0.15))
    wet = m.material("wet", (0.30, 0.24, 0.18))
    water = m.material("water", (0.10, 0.62, 0.58), rough=0.18, emissive=0.12)
    hi = m.mesh(0, rock)
    hiw = m.mesh(0, wet)
    n = len(outer)
    for i in range(n):
        x0, z0 = outer[i]
        x1, z1 = outer[(i + 1) % n]
        mx, mz = (x0 + x1) / 2, (z0 + z1) / 2
        # north (negative z) is the ocean side: lower rocks, a gap for the surge
        sea = mz < -2
        h = 1.4 + (i * 37 % 5) * 0.55
        if sea:
            h *= 0.45
        span = math.hypot(x1 - x0, z1 - z0)
        mesh = hiw if i % 3 == 0 else hi
        G.box(mesh, mx, h / 2, mz, max(1.3, span * 0.85), h, 2.4)
    # one stack on the landward lip, like the photo
    G.box(hi, 1.5, 3.2, 6.5, 3.2, 6.4, 2.6)
    G.box(hiw, 4.2, 2.2, 5.2, 2.2, 4.4, 2.0)
    G.fan(m.mesh(0, water), ring, 0.35, up=True)
    G.box(m.mesh(1, rock), 0, 1.6, 2.5, 16, 3.2, 14)
    G.fan(m.mesh(1, water), ring[::3] + ring[:1], 0.35, up=True)
    info = G.write_glb(m, HERO / "conchi.glb")
    G.check_glb(HERO / "conchi.glb")
    print("conchi", round(cx, 1), round(cz, 1), info)
    return cx, cz, world, info


def owned_point(x, z):
    """South highway and the airport end of Watty Vos. Not the hotel strip."""
    if z < -1800:
        return False
    if x < -7800:
        return False
    if x < -6400 and z < 400:
        return False
    return z > 400 or (-5600 < x < -4000 and -300 < z < 2000)


def collect_carriageways():
    """One-way carriageways wide enough for two lanes. Edge lines already paint."""
    runs = []
    junctions = []
    for path in sorted(REAL.glob("r_*.json")):
        data = json.loads(path.read_text())
        for j in data.get("junc") or []:
            junctions.append(j)
        for r in data["roads"]:
            if r.get("u") or r.get("rb"):
                continue
            if not r.get("ow"):
                continue
            if r.get("c", 0) < 3 or not (6.5 <= r.get("w", 0) <= 12):
                continue
            pts = r["p"]
            if not pts or not any(owned_point(x, z) for x, z in pts):
                continue
            # resample every 3 m, drop the parts outside the owned box
            acc = []
            for i in range(len(pts) - 1):
                x0, z0 = pts[i]
                x1, z1 = pts[i + 1]
                dist = math.hypot(x1 - x0, z1 - z0)
                n = max(1, int(dist / 3))
                for k in range(n):
                    t = k / n
                    x = x0 + (x1 - x0) * t
                    z = z0 + (z1 - z0) * t
                    if owned_point(x, z):
                        acc.append((x, z))
                    elif acc:
                        runs.append(acc)
                        acc = []
            if acc:
                runs.append(acc)
    # drop points that fall inside a roundabout apron
    kept = []
    for run in runs:
        cur = []
        for x, z in run:
            if any(math.hypot(x - j[0], z - j[1]) < (j[2] if len(j) > 2 else 8) + 6 for j in junctions):
                if len(cur) > 8:
                    kept.append(cur)
                cur = []
            else:
                cur.append((x, z))
        if len(cur) > 8:
            kept.append(cur)
    return kept


def add_slab(mesh, x, y, z, ax, az, length, width, thick):
    tmp = G.Mesh()
    G.box(tmp, 0, 0, 0, length, thick, width)
    L = math.hypot(ax, az) or 1
    ax, az = ax / L, az / L
    px, pz = -az, ax
    base = len(mesh.pos)
    for p, n in zip(tmp.pos, tmp.nrm):
        mesh.pos.append((x + ax * p[0] + px * p[2], y + p[1], z + az * p[0] + pz * p[2]))
        mesh.nrm.append((ax * n[0] + px * n[2], n[1], az * n[0] + pz * n[2]))
    mesh.idx.extend(i + base for i in tmp.idx)


def build_lane_dashes():
    runs = collect_carriageways()
    total_m = 0
    groups = []
    for run in runs:
        for i in range(1, len(run)):
            total_m += math.hypot(run[i][0] - run[i - 1][0], run[i][1] - run[i - 1][1])
        # a dash every 9 m, matching the shader's centre-line period.
        # keep each road run together so a hero is not scattered across the island.
        acc = 0.0
        nxt = 4.0
        one = []
        for i in range(1, len(run)):
            x0, z0 = run[i - 1]
            x1, z1 = run[i]
            seg = math.hypot(x1 - x0, z1 - z0)
            while acc + seg >= nxt:
                t = (nxt - acc) / seg if seg else 0
                one.append((x0 + (x1 - x0) * t, z0 + (z1 - z0) * t, x1 - x0, z1 - z0))
                nxt += 9.0
            acc += seg
        for i in range(0, len(one), 110):
            part = one[i:i + 110]
            if len(part) >= 3:
                groups.append(part)
    dashes = [d for g in groups for d in g]
    print(f"lane dashes {len(dashes)} along {total_m/1000:.1f} km, {len(groups)} heroes")
    cache = {}
    heroes = []
    for i, part in enumerate(groups):
        cx = sum(p[0] for p in part) / len(part)
        cz = sum(p[1] for p in part) / len(part)
        h0 = sample_h(cx, cz, cache)
        name = f"hwy_dash_{i:02d}"
        m = G.Model(name)
        paint = m.material("paint", (0.86, 0.86, 0.82), rough=0.55)
        hi, lo = m.mesh(0, paint), m.mesh(1, paint)
        ribbon = []
        for x, z, ax, az in part:
            y = sample_h(x, z, cache) - h0 + 0.16
            add_slab(hi, x - cx, y, z - cz, ax, az, 3.2, 0.16, 0.05)
            ribbon.append((x - cx, y, z - cz))
        for a, b in zip(ribbon, ribbon[1:]):
            if math.hypot(b[0] - a[0], b[2] - a[2]) > 40:
                continue
            dx, dz = b[0] - a[0], b[2] - a[2]
            L = math.hypot(dx, dz) or 1
            px, pz = -dz / L * 0.08, dx / L * 0.08
            lo.quad(
                (a[0] - px, a[1], a[2] - pz),
                (b[0] - px, b[1], b[2] - pz),
                (b[0] + px, b[1], b[2] + pz),
                (a[0] + px, a[1], a[2] + pz),
            )
        info = G.write_glb(m, HERO / f"{name}.glb")
        G.check_glb(HERO / f"{name}.glb")
        heroes.append((name, cx, cz, info))
    print(f"dash heroes {len(heroes)}")
    return heroes


def entry(id_, x, z, info, name, refs, footprint, switch=320, place=True):
    return {
        "id": id_,
        "k": id_,
        "name": name,
        "status": "accuracy-b2",
        "x": round(x, 2),
        "z": round(z, 2),
        "y": 0,
        "rotation": 0,
        "glb": f"models/hero/{id_}.glb",
        "lod": {"hi": f"{id_}_lod0", "lo": f"{id_}_lod1", "switch_m": switch},
        "tris": {f"{id_}_lod0": info["lod0"], f"{id_}_lod1": info["lod1"]},
        "textures": 0,
        "hide_footprint": [[round(p[0], 1), round(p[1], 1)] for p in footprint],
        "hide": [],
        "sign": False,
        "kind": "replace",
        "new_place": place,
        "geo_source": "OSM footprint / centreline",
        "ref_sources": refs,
        "frame": "glb origin = footprint centroid (world x,z); glTF +X = world x, +Z = world z, Y up",
        "cat": "landmark",
    }


def tiny_ring(x, z):
    return [(x - 0.2, z - 0.2), (x + 0.2, z - 0.2), (x + 0.2, z + 0.2)]


def patch_manifest(new_entries, stair_info):
    text = MANIFEST.read_text()
    text = text.replace(
        '"hooiberg_steps_lod0": 1375,\n   "hooiberg_steps_lod1": 7',
        f'"hooiberg_steps_lod0": {stair_info["lod0"]},\n   "hooiberg_steps_lod1": {stair_info["lod1"]}',
    )
    old_steps = "r28.mp4 3:00 green-painted concrete Hooiberg steps; drawn from the peak toward Caya Betico Croes (true stair line not in OSM data available), approx."
    new_steps = old_steps + " Heights retied to the 165 m peak (raised-cosine restore of the SRTM summit, radius 200 m). Green paint kept: dashcam note, no ground photo contradicted it."
    if old_steps not in text:
        raise SystemExit("steps ref not found")
    text = text.replace(old_steps, new_steps)
    old_sum = "r28.mp4 1:28 Hooiberg summit: pink utility building with graffiti + two telecom towers; Nominatim Hooiberg peak node 4253910397, layout approx."
    new_sum = old_sum + " Summit now sits on a 165 m peak (was ~144 m)."
    if old_sum not in text:
        raise SystemExit("summit ref not found")
    text = text.replace(old_sum, new_sum)
    blob_lines = []
    for e in new_entries:
        dumped = json.dumps(e, indent=1)
        blob_lines.append("\n".join((" " + ln) if ln else ln for ln in dumped.splitlines()))
    block = ",\n" + ",\n".join(blob_lines) + "\n"
    if not text.rstrip().endswith("]"):
        raise SystemExit("manifest shape")
    text = text.rstrip()[:-1] + block + "]\n"
    MANIFEST.write_text(text)
    json.loads(MANIFEST.read_text())
    print("manifest entries", len(new_entries))


def main():
    if (HERO / "sc_holymary.glb").exists() and sample_h(*PEAK, {}) > 160:
        raise SystemExit("batch 2 is already on disk; rebuild one landmark, do not rerun main()")
    print("peak before", end=" ")
    h = raise_dem()
    if not (164.2 <= h <= 165.8):
        raise SystemExit(f"peak {h} not ~165")
    stair = retie_stairs()
    roads = load_roads()
    print("santa cruz")
    sx, sz, sring, sinfo = build_santa_cruz(roads)
    print("savaneta")
    vx, vz, vring, vinfo = build_savaneta(roads)
    print("seroe")
    ex, ez, ering, einfo = build_seroe(roads)
    print("fontein")
    fx, fz, finfo = build_cave(
        "fontein_cave", 12.4929282, -69.9073335, roads,
        mouths=[(0, 4.2, 3.2)], length=22, height=7.5, depth=8,
    )
    print("quadirikiri")
    qx, qz, qinfo = build_cave(
        "quadirikiri", 12.4825269, -69.8995204, roads,
        mouths=[(-6.5, 6.5, 4.2), (6.0, 5.2, 3.6)], length=34, height=8.5, depth=10,
    )
    print("conchi")
    kx, kz, kring, kinfo = build_conchi()
    dashes = build_lane_dashes()
    entries = [
        entry("sc_holymary", sx, sz, sinfo,
              "Church of Holy Mary (Santa Cruz)",
              "Ground photo Commons 'Church of Holy Mary (Aruba)' 2021: white walls, blue plinth and trim, blue cross, red tile tower cap, wood doors, stone steps. OSM way 297003468.",
              sring, 360),
        entry("sav_sacredheart", vx, vz, vinfo,
              "Sagrado Curason (Savaneta)",
              "Ground photos Commons 'Church of the Holy Heart (Aruba)' 2017: peach walls, maroon stripes and window hoods, red roof, square tower, white cross. OSM way 376320397.",
              vring, 340),
        entry("seroe_church", ex, ez, einfo,
              "Seroe Colorado Community Church",
              "Ground photos Commons 'Community Church Seroe Colorado' 2018: white walls, steep red gables, stone buttresses, round window, small sunday-school chapel. OSM way 97566669.",
              ering, 340),
        entry("fontein_cave", fx, fz, finfo,
              "Fontein Cave",
              "Ground photo Commons 'Limestone cliffs near Fontein Cave': dark limestone cliff and cave mouths. Gated mouth. OSM node 540167863. Not a photo texture.",
              tiny_ring(fx, fz), 400),
        entry("quadirikiri", qx, qz, qinfo,
              "Quadirikiri Cave",
              "Ground photo Commons 'Base of the Cliff Quadirikiri Cave': dark eroded limestone, two mouths, roof holes. OSM node 540982491. Not a photo texture.",
              tiny_ring(qx, qz), 420),
        entry("conchi", kx, kz, kinfo,
              "Conchi (Natural Pool)",
              "Ground photo Commons 'Aruba-Natural-Pool-2013': dark rock bowl, turquoise water, ocean to the north. OSM way 796907733. Not a photo texture.",
              kring, 450),
    ]
    for name, x, z, info in dashes:
        entries.append(entry(
            name, x, z, info, "",
            "White lane dashes along owned divided highways (Route 1 south of Oranjestad, the airport end of Watty Vos). The road shader already paints edge lines; one-way carriageways had no lane line. Noord, Palm Beach and downtown Oranjestad were not edited. The named Sasakiweg is in Noord and was left alone.",
            tiny_ring(x, z), 500, place=False,
        ))
    patch_manifest(entries, stair)
    # cache bust constants. The bundle itself is not committed.
    hv = ROOT / "tools" / "patch_herover.py"
    t = hv.read_text().replace("HV='h202610160103'", "HV='h202610161200'")
    if "h202610161200" not in t:
        raise SystemExit("hero version not bumped")
    hv.write_text(t)
    dv = ROOT / "tools" / "patch_dataver.py"
    dvt = dv.read_text().replace("DV='d4ea89c302f'", "DV='b2c165a200'")
    if "b2c165a200" not in dvt:
        raise SystemExit("data version not bumped")
    dv.write_text(dvt)
    print("done")


if __name__ == "__main__":
    main()
