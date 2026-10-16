#!/usr/bin/env python3
"""L.G. Smith / south Eagle edge, additive only.

Divi Village golf pins and a boulevard sign, a street-facing Alhambra
board, and a Bubali approach board. The casino, the wooden tower and the
peach arch stay as they are, except the casino dome material is retinted
from blue to brass. Mesh, sign textures and every other hero are untouched.

The Renaissance Island ferry leaves from the marina beside the cruise
terminal (lat 12.519), inside downtown, so it is not built here.
"""
import json, math, os, struct, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import eagle_strip as es

HERO = es.HERO
MANIFEST = es.MANIFEST

# Fairway camera stands on J.E. Irausquin and looks inland across the course.
FAIR_CAM = (-9562.0, -1838.0)
FAIR_LOOK = (-9340.0, -1925.0)
# Boulevard camera for the casino, and the approach camera for the tower.
ALH_CAM = (-9766.0, -2168.0)
ALH_LOOK = (-9860.0, -2188.0)
BUBALI_CAM = (-8486.0, -4572.0)
BUBALI_LOOK = (-8516.0, -4598.0)


def along(cam, look, dist, side=0.0):
    fx, fz, lx, lz = look_basis(cam, look)
    return (cam[0] + fx * dist + lx * side, cam[1] + fz * dist + lz * side)


def sub(origin, x, z):
    return x - origin[0], z - origin[1]


def look_basis(cam, look):
    dx, dz = look[0] - cam[0], look[1] - cam[1]
    L = es.hypot(dx, dz) or 1
    fx, fz = dx / L, dz / L
    # Viewer's left, y-up: looking +x (east), left is -z (north).
    lx, lz = fz, -fx
    return fx, fz, lx, lz


# Forecourt board, a few metres left of the casino camera's centre line.
ALH_SIGN = along(ALH_CAM, ALH_LOOK, 32, 4.0)
# Tower board, just right of the approach so the lookout stays in frame.
BUBALI_SIGN = along(BUBALI_CAM, BUBALI_LOOK, 15, -2.4)


def add_board(face, back, x, z, y, nx, nz, width, height):
    """(nx, nz) points at the viewer. u=0 is that viewer's left."""
    tx, tz = -nz, nx
    hw = width * 0.5
    fx, fz = x + nx * 0.04, z + nz * 0.04
    left = (fx + tx * hw, fz + tz * hw)
    right = (fx - tx * hw, fz - tz * hw)
    a = face.v(left[0], y, left[1], nx, 0, nz, 0, 0)
    b = face.v(right[0], y, right[1], nx, 0, nz, 1, 0)
    c = face.v(right[0], y + height, right[1], nx, 0, nz, 1, 1)
    d = face.v(left[0], y + height, left[1], nx, 0, nz, 0, 1)
    face.quad(a, b, c, d)
    bx, bz = x - nx * 0.08, z - nz * 0.08
    bl = (bx - tx * hw, bz - tz * hw)
    br = (bx + tx * hw, bz + tz * hw)
    e = back.v(bl[0], y, bl[1], -nx, 0, -nz, 0, 0)
    f = back.v(br[0], y, br[1], -nx, 0, -nz, 1, 0)
    g = back.v(br[0], y + height, br[1], -nx, 0, -nz, 1, 1)
    h = back.v(bl[0], y + height, bl[1], -nx, 0, -nz, 0, 1)
    back.quad(e, f, g, h)


def add_posts(mesh, x, z, y1, span):
    for s in (-span, span):
        es.solid_box(mesh, x + s - 0.07, 0, z - 0.07, x + s + 0.07, y1, z + 0.07)


def add_flag(pole, cloth, x, y, z):
    r, h, sides = 0.035, 2.25, 5
    ring0, ring1 = [], []
    for i in range(sides):
        a = i / sides * math.tau
        px, pz = math.cos(a) * r, math.sin(a) * r
        ring0.append(pole.v(x + px, y, z + pz, px, 0, pz, 0, 0))
        ring1.append(pole.v(x + px, y + h, z + pz, px, 0, pz, 0, 1))
    for i in range(sides):
        j = (i + 1) % sides
        pole.quad(ring0[i], ring0[j], ring1[j], ring1[i])
    # Trade wind streams the cloth west (-x), with a small droop so the
    # normal is not zero.
    y0 = y + h
    a = cloth.v(x, y0 - 0.02, z - 0.02, 0, 0.35, 1, 0, 1)
    b = cloth.v(x - 0.78, y0 - 0.16, z + 0.16, 0, 0.35, 1, 1, 1)
    c = cloth.v(x - 0.72, y0 - 0.52, z + 0.05, 0, 0.35, 1, 1, 0)
    d = cloth.v(x, y0 - 0.40, z - 0.08, 0, 0.35, 1, 0, 0)
    cloth.quad(a, b, c, d)


def add_bunker(mesh, x, y, z, rx, rz):
    y += 0.16
    steps = 8
    top = []
    for i in range(steps):
        a = i / steps * math.tau
        top.append(mesh.v(x + math.cos(a) * rx, y, z + math.sin(a) * rz, 0, 1, 0, 0.5, 0.5))
    c = mesh.v(x, y, z, 0, 1, 0, 0.5, 0.5)
    for i in range(steps):
        mesh.tri(c, top[i], top[(i + 1) % steps])


def emit(name, build):
    """build(g, lod) -> list of (mesh, mat). Returns (path, tris, images)."""
    g = es.G()
    hi = build(g, 0)
    lo = build(g, 1)
    mi = g.add_mesh(name + "_lod0", [(m.p, m.n, m.u, m.i, mat) for m, mat in hi if not m.empty()])
    li = g.add_mesh(name + "_lod1", [(m.p, m.n, m.u, m.i, mat) for m, mat in lo if not m.empty()])
    g.nodes.append({"name": name + "_lod0", "mesh": mi})
    g.nodes.append({"name": name + "_lod1", "mesh": li})
    data = g.pack([0, 1])
    path = os.path.join(HERO, name + ".glb")
    open(path, "wb").write(data)
    tris = {}
    for label, parts in ((name + "_lod0", hi), (name + "_lod1", lo)):
        tris[label] = sum(len(m.i) // 3 for m, _ in parts)
    return tris, len(g.images)


def upsert(entry):
    manifest = json.loads(open(MANIFEST).read())
    manifest = [e for e in manifest if e.get("id") != entry["id"]]
    manifest.append(entry)
    open(MANIFEST, "w").write(json.dumps(manifest, indent=1))
    return len(manifest)


def entry(name, title, ox, oz, tris, textures, switch, ref):
    return {
        "id": name,
        "k": name,
        "name": title,
        "status": "smith-edge additive",
        "x": round(ox, 2),
        "z": round(oz, 2),
        "y": 0,
        "rotation": 0,
        "glb": f"models/hero/{name}.glb",
        "lod": {"hi": name + "_lod0", "lo": name + "_lod1", "switch_m": switch},
        "tris": tris,
        "textures": textures,
        "hide_footprint": [],
        "hide": [],
        "sign": False,
        "kind": "replace",
        "new_place": False,
        "geo_source": "terrain height at the placement; no OSM footprint replaced",
        "ref_sources": ref,
        "frame": "glb origin = sign; glTF +X = world x, +Z = world z, Y up; landmarks/smith_edge.py",
        "cat": "landmark",
    }


def local_y(origin, x, z, base):
    return es.height_at(x, z) - base


def build_golf(g, lod):
    fx, fz, leftx, leftz = look_basis(FAIR_CAM, FAIR_LOOK)
    # On the grass, in the middle of the fairway camera, close enough
    # that the whole board is in frame and in front of the far roof line.
    sx = FAIR_CAM[0] + fx * 28 - leftx * 0.4
    sz = FAIR_CAM[1] + fz * 28 - leftz * 0.4
    origin = (sx, sz)
    base = es.height_at(sx, sz)
    face, back, posts = es.M(), es.M(), es.M()
    pole, red, yellow, sand = es.M(), es.M(), es.M(), es.M()
    fm = g.tex_mat("golfsign", es.sign_png("DIVI VILLAGE GOLF", (27, 92, 52), (255, 255, 255)), repeat=False, emissive=0.25)
    bm = g.color_mat("golfback", (18, 64, 38))
    pm = g.color_mat("golfpost", (236, 236, 230))
    wm = g.color_mat("pin", (240, 240, 236))
    rm = g.color_mat("flagred", (186, 42, 36))
    ym = g.color_mat("flagyellow", (232, 190, 46))
    sm = g.color_mat("bunker", (214, 196, 150))
    lx, lz = sub(origin, sx, sz)
    # Normal toward the camera (west of the sign).
    nx, nz = -fx, -fz
    add_board(face, back, lx, lz, 1.85, nx, nz, 6.4, 1.35)
    add_posts(posts, lx, lz, 1.85, 2.9)
    # Pins on the open grass in front of the distant roof line.
    pins = []
    for dist, side, kind in (
        (36, -11, "red"),
        (52, 9, "yellow"),
        (70, -4, "red"),
        (96, 13, "yellow"),
        (128, -8, "red"),
    ):
        x = FAIR_CAM[0] + fx * dist + leftx * side
        z = FAIR_CAM[1] + fz * dist + leftz * side
        h = es.height_at(x, z)
        # The fairway camera's grass plane samples a few metres up in the
        # surface model. Skip only a real roof.
        if h > 6.0:
            continue
        pins.append((x, z, kind, h))
    # The low fairway past the rise, where the ground drops back under 2 m.
    for x, z, kind in ((-9413, -1896, "yellow"), (-9360, -1910, "red"), (-9310, -1955, "yellow")):
        h = es.height_at(x, z)
        if h < 2.2:
            pins.append((x, z, kind, h))
    for x, z, kind, h in pins:
        px, pz = sub(origin, x, z)
        y = h - base
        if lod == 0:
            add_flag(pole, red if kind == "red" else yellow, px, y, pz)
        else:
            es.solid_box(pole, px - 0.04, y, pz - 0.04, px + 0.04, y + 2.1, pz + 0.04)
    if lod == 0:
        for x, z, rx, rz in ((-9400, -1904, 3.2, 2.1), (-9348, -1918, 2.6, 1.8)):
            if es.height_at(x, z) < 2.0:
                bx, bz = sub(origin, x, z)
                add_bunker(sand, bx, es.height_at(x, z) - base, bz, rx, rz)
    print(f"  golf origin {origin[0]:.1f},{origin[1]:.1f} base {base:.2f} pins {len(pins)}")
    return [(face, fm), (back, bm), (posts, pm), (pole, wm), (red, rm), (yellow, ym), (sand, sm)]


def build_sign(g, lod, text, subtext, bg, fg, fg2, nx, nz, width=7.2):
    top, bot, back, low, posts = es.M(), es.M(), es.M(), es.M(), es.M()
    fm = g.tex_mat("top", es.sign_png(text, bg, fg), repeat=False, emissive=0.22)
    sm = g.tex_mat("sub", es.sign_png(subtext, bg, fg2), repeat=False, emissive=0.16)
    bm = g.color_mat("back", tuple(max(0, c - 28) for c in bg))
    pm = g.color_mat("post", (236, 232, 224))
    add_board(top, back, 0, 0, 2.45, nx, nz, width, 1.55)
    add_board(bot, low, 0, 0, 1.05, nx, nz, width * 0.78, 1.0)
    add_posts(posts, 0, 0, 2.45, width * 0.46)
    return [(top, fm), (bot, sm), (back, bm), (low, bm), (posts, pm)]


def build_bubali(g, lod):
    # South-east of the tower, off the camera's line of sight, so the
    # wooden lookout stays fully visible. Faces the approach.
    ox, oz = BUBALI_SIGN
    cam = BUBALI_CAM
    nx, nz = cam[0] - ox, cam[1] - oz
    L = es.hypot(nx, nz) or 1
    nx, nz = nx / L, nz / L
    return build_sign(
        g, lod, "BUBALI", "BIRD SANCTUARY",
        (22, 92, 58), (255, 255, 255), (255, 255, 255),
        nx, nz, width=5.2,
    )


def retint_domes():
    path = os.path.join(HERO, "m_alhambracasinoandshoppin.glb")
    data = open(path, "rb").read()
    off = 12
    ln, typ = struct.unpack_from("<I4s", data, off)
    js = json.loads(data[off + 8:off + 8 + ln])
    bin_off = off + 8 + ln
    bln, btyp = struct.unpack_from("<I4s", data, bin_off)
    assert btyp == b"BIN\x00"
    blob = data[bin_off + 8:bin_off + 8 + bln]
    gold = [0.86, 0.64, 0.24, 1]
    n = 0
    for m in js["materials"]:
        if m.get("name") in ("dome", "ldome"):
            p = m.setdefault("pbrMetallicRoughness", {})
            print("  dome was", m["name"], p.get("baseColorFactor"))
            p["baseColorFactor"] = gold
            p["roughnessFactor"] = 0.42
            n += 1
    assert n == 2, n
    payload = json.dumps(js, separators=(",", ":")).encode()
    while len(payload) % 4:
        payload += b" "
    while len(blob) % 4:
        blob += b"\x00"
    out = bytearray()
    total = 12 + 8 + len(payload) + 8 + len(blob)
    out += b"glTF" + struct.pack("<II", 2, total)
    out += struct.pack("<I", len(payload)) + b"JSON" + payload
    out += struct.pack("<I", len(blob)) + b"BIN\x00" + blob
    open(path, "wb").write(out)
    print("  retinted", path, "bytes", len(out))


def main():
    # Golf. Origin is the sign, computed the same way as the mesh.
    fx, fz, leftx, leftz = look_basis(FAIR_CAM, FAIR_LOOK)
    gx = FAIR_CAM[0] + fx * 28 - leftx * 0.4
    gz = FAIR_CAM[1] + fz * 28 - leftz * 0.4

    def golf(g, lod):
        return build_golf(g, lod)

    # build_golf prints and uses the same origin. Materials live on g, and
    # build_golf is called twice (lod 0 and lod 1) on ONE G, so textures are
    # reused via _mat. Good.
    tris, ntex = emit("dv_golf", golf)
    upsert(entry(
        "dv_golf", "Divi Village golf pins and boulevard sign",
        gx, gz, tris, ntex, 640,
        "Divi Village Golf & Beach Resort, 9-hole course inland of J.E. Irausquin "
        "at the Druif end (about 12.537, -70.056). Street View: green fairway, "
        "red and yellow pins, a roadside DIVI VILLAGE sign. The peach arch hero "
        "is left where it is.",
    ))
    print("dv_golf", tris)

    ax, az = ALH_SIGN
    anx, anz = ALH_CAM[0] - ax, ALH_CAM[1] - az
    alen = es.hypot(anx, anz) or 1
    anx, anz = anx / alen, anz / alen

    def alh(g, lod):
        return build_sign(
            g, lod, "ALHAMBRA", "CASINO & SHOPS",
            (122, 28, 42), (232, 196, 110), (244, 236, 220),
            anx, anz, width=6.6,
        )

    tris, ntex = emit("alhambra_sign", alh)
    upsert(entry(
        "alhambra_sign", "Alhambra casino forecourt sign",
        ax, az, tris, ntex, 400,
        "Alhambra Casino & Shopping Bazaar at the Queen Conch roundabout. "
        "Street View: burgundy board, gold ALHAMBRA letters, white arcade and "
        "brass onion domes. The existing hero keeps its mesh and its own sign; "
        "this board faces J.E. Irausquin from the forecourt.",
    ))
    print("alhambra_sign", tris)

    bx, bz = BUBALI_SIGN

    def bub(g, lod):
        return build_bubali(g, lod)

    tris, ntex = emit("bubali_board", bub)
    upsert(entry(
        "bubali_board", "Bubali Bird Sanctuary approach board",
        bx, bz, tris, ntex, 280,
        "Bubali Bird Sanctuary observation tower, two-level wooden lookout "
        "inland of J.E. Irausquin (aruba.com / OSM). The tower hero and its "
        "green sign are unchanged. This board faces the south-east approach.",
    ))
    print("bubali_board", tris)
    retint_domes()


if __name__ == "__main__":
    main()
