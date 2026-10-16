#!/usr/bin/env python3
"""Street-level props along J.E. Irausquin Blvd, Eagle Beach to Druif.

Main already has the boulevard sidewalks, the OSM parking slabs, the red
cycle lanes, and the fofoti / palapa heroes. This only fills the gaps a
street check still shows: blue bus shelters, lamp posts, mid-block
beach-access crossings (the road shader paints zebras only at junctions),
stall lines on the lots the kits already pave, open showers and lifeguard
chairs on the dry sand, and a freestanding Tulip board where that restaurant
has no hero of its own.

Kits eb_north / eb_mid / eb_south are not rewritten. Resort heroes and the
fofoti set are not replaced. Photos are reference only.
"""
import json
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import eagle_strip as E

HERO = E.HERO
MANIFEST = E.MANIFEST

# Famous pair and the palapa field. Do not stack a second set here.
FOFOTI_BOX = (-9366.0, -9190.0, -3873.0, -3697.0)


def chunk_of(z):
    if z < -3300:
        return "jei_st_n"
    if z < -2100:
        return "jei_st_m"
    return "jei_st_s"


def face_yaw(dx, dz):
    """Yaw that maps local +X onto the XZ direction (dx, dz)."""
    return math.atan2(-dz, dx)


def prop_height(x, z, road_h):
    h = E.height_at(x, z)
    for dx, dz in ((4, 0), (-4, 0), (0, 4), (0, -4)):
        h = min(h, E.height_at(x + dx, z + dz))
    if h < 0.35 or h > road_h + 2.8:
        return None
    return h


def sample_jei(segs):
    samples = []
    prev = None
    z = -1100.0
    while z > -4450.0:
        cands = []
        for x1, za, x2, zb, w in segs:
            dz = zb - za
            if abs(dz) < 0.8:
                continue
            t = (z - za) / dz
            if not (0 <= t <= 1):
                continue
            x = x1 + (x2 - x1) * t
            if not E.in_strip(x, z):
                continue
            cands.append((x, w if w >= 6.0 else 7.6))
        if cands:
            if prev is None:
                x, w = cands[0]
            else:
                near = [c for c in cands if abs(c[0] - prev) < 28]
                pick = near or cands
                x, w = min(pick, key=lambda c: abs(c[0] - prev))
                if abs(x - prev) > 28:
                    prev = None
            if prev is None or abs(x - prev) <= 28:
                samples.append((x, z, w))
                prev = x
        z -= 8.0
    out = []
    for i, (x, z, w) in enumerate(samples):
        if 0 < i < len(samples) - 1:
            dx = samples[i + 1][0] - samples[i - 1][0]
            dz = samples[i + 1][1] - samples[i - 1][1]
        elif i == 0 and len(samples) > 1:
            dx = samples[1][0] - x
            dz = samples[1][1] - z
        else:
            dx = x - samples[i - 1][0]
            dz = z - samples[i - 1][1]
        L = math.hypot(dx, dz) or 1
        dx, dz = dx / L, dz / L
        a, b = (-dz, dx), (dz, -dx)
        wx, wz = a if a[0] <= b[0] else b
        out.append({
            "x": x, "z": z, "dx": dx, "dz": dz, "wx": wx, "wz": wz,
            "w": w, "h": E.height_at(x, z), "chunk": chunk_of(z),
        })
    return out


def build_shelter():
    body, roof = E.M(), E.M()
    for x in (-0.72, 0.72):
        for z in (-1.35, 1.35):
            E.solid_box(body, x - 0.045, 0, z - 0.045, x + 0.045, 2.32, z + 0.045)
    E.solid_box(body, -0.9, 0.42, 0.45, 0.9, 0.52, 1.05)
    E.solid_box(roof, -1.4, 2.30, -1.75, 1.4, 2.44, 1.75)
    return body, roof


def build_bus_board():
    """Yellow BUS board on local -X, which faces the road from an inland stop.
    u=0 is the viewer's left when they stand on that side looking at the board."""
    m = E.M()
    w, y0 = 0.92, 1.82
    a = m.v(-0.8, y0, -w / 2, -1, 0, 0, 0, 0)
    b = m.v(-0.8, y0, w / 2, -1, 0, 0, 1, 0)
    c = m.v(-0.8, y0 + 0.28, w / 2, -1, 0, 0, 1, 1)
    d = m.v(-0.8, y0 + 0.28, -w / 2, -1, 0, 0, 0, 1)
    m.quad(a, b, c, d)
    return m


def build_lamp():
    pole, head = E.M(), E.M()
    E.pole(pole, 5.5, 0.055, 6)
    E.solid_box(pole, 0.0, 5.28, -0.035, 1.05, 5.40, 0.035)
    E.solid_box(head, 0.62, 5.08, -0.18, 1.15, 5.30, 0.18)
    return pole, head


def build_shower():
    pad, metal = E.M(), E.M()
    E.solid_box(pad, -0.42, 0, -0.42, 0.42, 0.07, 0.42)
    E.pole(metal, 2.15, 0.04, 5)
    E.solid_box(metal, -0.03, 2.04, -0.035, 0.48, 2.12, 0.035)
    E.solid_box(metal, 0.32, 1.88, -0.07, 0.46, 2.06, 0.07)
    return pad, metal


def build_guard():
    wood, shade, flag = E.M(), E.M(), E.M()
    for x in (-0.26, 0.26):
        for z in (-0.2, 0.2):
            E.solid_box(wood, x - 0.028, 0, z - 0.028, x + 0.028, 1.65, z + 0.028)
    E.solid_box(wood, -0.4, 1.58, -0.3, 0.4, 1.68, 0.3)
    E.solid_box(wood, -0.4, 1.68, -0.26, -0.32, 2.12, 0.26)
    E.solid_box(shade, -0.52, 2.28, -0.42, 0.52, 2.40, 0.42)
    E.solid_box(wood, 0.36, 1.68, -0.02, 0.40, 2.65, 0.02)
    E.solid_box(flag, 0.40, 2.28, -0.015, 0.78, 2.55, 0.015)
    return wood, shade, flag


def add_board(mesh, x, z, y, nx, nz, width, height, ox, oz, base):
    """Name board. (nx, nz) points at the viewer. u=0 is that viewer's left."""
    tx, tz = -nz, nx
    hw = width * 0.5
    fx, fz = x + nx * 0.05, z + nz * 0.05
    left = (fx + tx * hw, fz + tz * hw)
    right = (fx - tx * hw, fz - tz * hw)
    ny = y - base

    def vert(px, py, pz, nnx, nnz, u, v):
        return mesh.v(px - ox, py, pz - oz, nnx, 0, nnz, u, v)

    a = vert(left[0], ny, left[1], nx, nz, 0, 0)
    b = vert(right[0], ny, right[1], nx, nz, 1, 0)
    c = vert(right[0], ny + height, right[1], nx, nz, 1, 1)
    d = vert(left[0], ny + height, left[1], nx, nz, 0, 1)
    mesh.quad(a, b, c, d)
    bnx, bnz = -nx, -nz
    tx2, tz2 = -bnz, bnx
    bx, bz = x - nx * 0.05, z - nz * 0.05
    leftb = (bx + tx2 * hw, bz + tz2 * hw)
    rightb = (bx - tx2 * hw, bz - tz2 * hw)
    a = vert(leftb[0], ny, leftb[1], bnx, bnz, 0, 0)
    b = vert(rightb[0], ny, rightb[1], bnx, bnz, 1, 0)
    c = vert(rightb[0], ny + height, rightb[1], bnx, bnz, 1, 1)
    d = vert(leftb[0], ny + height, leftb[1], bnx, bnz, 0, 1)
    mesh.quad(a, b, c, d)


def zebra(mesh, s, ox, oz):
    half = s["w"] * 0.5 - 0.7
    if half < 2.2:
        return 0
    step = 0.95
    across = -half
    i = n = 0
    while across <= half + 1e-6:
        if i % 2 == 0:
            cx = s["x"] + s["wx"] * across
            cz = s["z"] + s["wz"] * across
            x1 = cx - s["dx"] * 1.7
            z1 = cz - s["dz"] * 1.7
            x2 = cx + s["dx"] * 1.7
            z2 = cz + s["dz"] * 1.7
            E.ribbon(mesh, [(x1, z1), (x2, z2)], 0.42, 0.16, ox, oz, [s["h"], s["h"]])
            n += 1
        across += step
        i += 1
    return n


def stall_stripes(mesh, poly, ox, oz, lift=0.18):
    if len(poly) < 4:
        return 0
    cx, cz = E.centroid(poly)
    sxx = szz = sxz = 0.0
    for x, z in poly:
        dx, dz = x - cx, z - cz
        sxx += dx * dx
        szz += dz * dz
        sxz += dx * dz
    ang = 0.5 * math.atan2(2 * sxz, sxx - szz)
    ux, uz = math.cos(ang), math.sin(ang)
    vx, vz = -uz, ux
    pu = [(x - cx) * ux + (z - cz) * uz for x, z in poly]
    pv = [(x - cx) * vx + (z - cz) * vz for x, z in poly]
    umin, umax = min(pu), max(pu)
    vmin, vmax = min(pv), max(pv)
    if umax - umin < vmax - vmin:
        ux, uz, vx, vz = vx, vz, ux, uz
        umin, umax, vmin, vmax = vmin, vmax, umin, umax
    length, depth = umax - umin, vmax - vmin
    if length < 10 or depth < 4:
        return 0
    h = min(E.ground_height(x, z) for x, z in poly)
    if h > 14 or h < 0.15:
        return 0
    v0 = vmin + depth * 0.16
    v1 = vmax - depth * 0.16
    n = max(2, min(int(length // 2.7), 10))
    drawn = 0
    for i in range(n):
        u = umin + length * (i + 1) / (n + 1)
        x1 = cx + ux * u + vx * v0
        z1 = cz + uz * u + vz * v0
        x2 = cx + ux * u + vx * v1
        z2 = cz + uz * u + vz * v1
        E.ribbon(mesh, [(x1, z1), (x2, z2)], 0.11, lift, ox, oz, [h, h])
        drawn += 1
    return drawn


def in_fofoti(x, z):
    x0, x1, z0, z1 = FOFOTI_BOX
    return x0 <= x <= x1 and z0 <= z <= z1


def dry_sand(sample, min_west=22):
    """Dry sand west of the boulevard, clear of the wash and the fofoti field."""
    x, z = sample["x"], sample["z"]
    for d in range(min_west, 80, 2):
        xx = x - d
        h = E.height_at(xx, z)
        if 0.85 <= h <= 1.85 and not in_fofoti(xx, z):
            return xx, z, h
    return None


def nearest_sample(samples, z):
    return min(samples, key=lambda p: abs(p["z"] - z))


def report_fofoti(samples):
    """The famous pair already lives in eaglebeach_fx and eb_fofoti_10.
    Print the gap check and add nothing on top of that field."""
    print("fofoti box", FOFOTI_BOX, "left as the existing heroes")
    for z in (-3860, -3834, -3600, -3300):
        s = nearest_sample(samples, z)
        spot = dry_sand(s, 8)
        print("  sand check z", z, "spot", None if not spot else tuple(round(v, 1) for v in spot))


def build():
    segs = E.jei_points()
    samples = sample_jei(segs)
    print("jei samples", len(samples))
    if len(samples) < 30:
        raise SystemExit("not enough centreline")
    buildings = E.load_buildings()
    polys = [b["poly"] for b in buildings if b["area"] > 30]
    parking, _paths = E.osm_ground(segs)
    parking = [p for p in parking if E.in_strip(*E.centroid(p))]

    def blocked(x, z):
        if any(E.pip(x, z, poly) for poly in polys):
            return True
        if any(E.pip(x, z, poly) for poly in parking):
            return True
        return False

    bags = {}
    for s in samples:
        bags.setdefault(s["chunk"], {
            "samples": [], "shelters": [], "lamps": [], "showers": [], "guards": [],
            "zebras": [], "stalls": [], "shops": [],
        })
        bags[s["chunk"]]["samples"].append(s)

    # Bus shelters on the inland sidewalk, in front of the street cameras.
    for z_stop in (-1520, -2548, -3524, -3892):
        s = nearest_sample(samples, z_stop)
        if abs(s["z"] - z_stop) > 30:
            print("  shelter miss", z_stop)
            continue
        off = -(s["w"] * 0.5 + 4.0)
        x = s["x"] + s["wx"] * off
        z = s["z"] + s["wz"] * off
        h = prop_height(x, z, s["h"])
        if h is None or blocked(x, z):
            print("  shelter skip", round(x), round(z), h)
            continue
        yaw = face_yaw(s["wx"], s["wz"]) + math.pi
        bags[s["chunk"]]["shelters"].append((x, z, h, yaw, 1.0))
        print("  shelter", s["chunk"], round(x, 1), round(z, 1), round(h, 2))

    # Lamps on the seaward verge. The inland side of Manchebo already
    # has a pole in the road shot, so this row fills the beach side.
    acc = 0.0
    next_lamp = 20.0
    for i, s in enumerate(samples):
        if i:
            acc += math.hypot(s["x"] - samples[i - 1]["x"], s["z"] - samples[i - 1]["z"])
        if acc < next_lamp:
            continue
        off = s["w"] * 0.5 + 6.8
        x = s["x"] + s["wx"] * off
        z = s["z"] + s["wz"] * off
        h = prop_height(x, z, s["h"])
        if h is None or blocked(x, z) or not E.in_strip(x, z):
            continue
        # local +X is the arm; point it back at the road
        yaw = face_yaw(-s["wx"], -s["wz"])
        bags[s["chunk"]]["lamps"].append((x, z, h, yaw, 1.0))
        next_lamp = acc + 100.0
    for name, bag in bags.items():
        print("  lamps", name, len(bag["lamps"]))

    # Mid-block crossings at the public beach accesses. Junction zebras
    # are already in the road shader; these are the accesses between them.
    for z_x in (-1660, -3088, -3896):
        s = nearest_sample(samples, z_x)
        if abs(s["z"] - z_x) > 24:
            print("  zebra miss", z_x)
            continue
        bags[s["chunk"]]["zebras"].append(s)
        print("  zebra", s["chunk"], round(s["x"], 1), round(s["z"], 1))

    for poly in parking:
        cx, cz = E.centroid(poly)
        # Roadside and Eagle Beach lots. Far inland pads are hotel courts.
        if E.nearest_jei(cx, cz, segs) > 80:
            continue
        bags[chunk_of(cz)]["stalls"].append(poly)

    # Showers and lifeguard chairs on dry sand, outside the fofoti field.
    # The Eagle pair sits in the sand camera's view, just north of that field.
    beach_spots = []
    # On the sand camera's look, just north of the fofoti field.
    x, z = -9248.0, -3880.0
    h = E.height_at(x, z)
    if 0.75 <= h <= 1.8 and not in_fofoti(x, z):
        beach_spots.append((x, z, h, "jei_st_n"))
    else:
        print("  eagle sand skip", x, z, round(h, 2))
    for z_b in (-3608, -1668):
        s = nearest_sample(samples, z_b)
        spot = dry_sand(s)
        if spot:
            beach_spots.append((*spot, s["chunk"]))
        else:
            print("  no sand", z_b)
    for i, (x, z, h, chunk) in enumerate(beach_spots):
        if any(E.hypot(x - g[0], z - g[1]) < 7 for g in bags[chunk]["showers"]):
            continue
        bags[chunk]["showers"].append((x, z, h, 0.0, 1.0))
        gx, gz = x + 5.0, z + 4.0
        gh = E.height_at(gx, gz)
        if 0.75 <= gh <= 1.9 and not in_fofoti(gx, gz):
            s = nearest_sample(samples, z)
            yaw = face_yaw(s["wx"], s["wz"])
            bags[chunk]["guards"].append((gx, gz, gh, yaw, 1.0))
        print("  beach", chunk, round(x, 1), round(z, 1), round(h, 2))

    # Tulip Restaurant is a plain house extrusion. The sign faces the road
    # (west). Screaming Eagle already has its own hero and is left alone.
    tulip = next((b for b in buildings if "tulip" in b["name"].lower()), None)
    if tulip:
        s = nearest_sample(samples, tulip["cz"])
        # stand the board on the road side of the footprint, not on the roof
        x = s["x"] + s["wx"] * (-(s["w"] * 0.5 + 6.5))
        z = s["z"]
        h = prop_height(x, z, s["h"])
        if h is not None and not blocked(x, z):
            bags[s["chunk"]]["shops"].append({
                "x": x, "z": z, "h": h, "nx": s["wx"], "nz": s["wz"],
                "text": "TULIP", "bg": (246, 242, 230), "fg": (36, 92, 48),
            })
            print("  tulip board", round(x, 1), round(z, 1), round(h, 2))
        else:
            print("  tulip skip", h, None if h is None else blocked(x, z))

    report_fofoti(samples)

    manifest = json.loads(open(MANIFEST).read())
    before_ids = [e.get("id") for e in manifest]
    bus_png = E.sign_png("BUS", (252, 196, 32), (28, 32, 36))

    def inst(g, mesh_i, items, ox, oz):
        if not items:
            return None
        tr, ro, sc = [], [], []
        base = E.height_at(ox, oz)
        for x, z, h, yaw, scale in items:
            tr += [x - ox, h - base, z - oz]
            ro += list(E.yaw_quat(yaw))
            sc += [scale, scale, scale]
        return g.add_inst(mesh_i, tr, ro, sc)

    for name, bag in bags.items():
        pts = bag["samples"]
        if len(pts) < 4:
            continue
        ox = sum(p["x"] for p in pts) / len(pts)
        oz = sum(p["z"] for p in pts) / len(pts)
        base = E.height_at(ox, oz)
        g = E.G()
        post_m = g.color_mat("post", (150, 152, 154))
        roof_m = g.color_mat("roof", (28, 104, 176))
        lamp_m = g.color_mat("lamp", (186, 188, 190))
        bulb_m = g.color_mat("bulb", (255, 214, 120), 0.45)
        metal_m = g.color_mat("metal", (176, 180, 182))
        pad_m = g.color_mat("spad", (186, 178, 160))
        wood_m = g.color_mat("wood", (150, 112, 68))
        shade_m = g.color_mat("shade", (232, 122, 48))
        flag_m = g.color_mat("flag", (196, 48, 42))
        line_m = g.color_mat("zebra", (242, 242, 236))
        stall_m = g.color_mat("stalls", (236, 234, 226))
        bus_m = g.tex_mat("bus", bus_png, False)
        shop_mats = []
        for i, shop in enumerate(bag["shops"]):
            png = E.sign_png(shop["text"], shop["bg"], shop["fg"])
            shop_mats.append(g.tex_mat(f"shop{i}", png, False))

        nodes_hi, nodes_lo = [], []
        for lod, bucket in ((0, nodes_hi), (1, nodes_lo)):
            body, roof = build_shelter()
            bm = g.add_mesh(f"{name}_sh{lod}", [(body.p, body.n, body.u, body.i, post_m)])
            rm = g.add_mesh(f"{name}_sr{lod}", [(roof.p, roof.n, roof.u, roof.i, roof_m)])
            pole, head = build_lamp()
            pm = g.add_mesh(f"{name}_lp{lod}", [(pole.p, pole.n, pole.u, pole.i, lamp_m)])
            hm = g.add_mesh(f"{name}_lh{lod}", [(head.p, head.n, head.u, head.i, bulb_m)])
            for mesh_i, items in (
                (bm, bag["shelters"]), (rm, bag["shelters"]),
                (pm, bag["lamps"]), (hm, bag["lamps"]),
            ):
                n = inst(g, mesh_i, items, ox, oz)
                if n is not None:
                    bucket.append(n)
            if lod == 0:
                board = build_bus_board()
                bb = g.add_mesh(name + "_bus", [(board.p, board.n, board.u, board.i, bus_m)])
                spad, smet = build_shower()
                sm = g.add_mesh(name + "_sw", [(spad.p, spad.n, spad.u, spad.i, pad_m)])
                mm = g.add_mesh(name + "_sm", [(smet.p, smet.n, smet.u, smet.i, metal_m)])
                wood, shade, flag = build_guard()
                wm = g.add_mesh(name + "_gw", [(wood.p, wood.n, wood.u, wood.i, wood_m)])
                km = g.add_mesh(name + "_gs", [(shade.p, shade.n, shade.u, shade.i, shade_m)])
                fm = g.add_mesh(name + "_gf", [(flag.p, flag.n, flag.u, flag.i, flag_m)])
                for mesh_i, items in (
                    (bb, bag["shelters"]),
                    (sm, bag["showers"]), (mm, bag["showers"]),
                    (wm, bag["guards"]), (km, bag["guards"]), (fm, bag["guards"]),
                ):
                    n = inst(g, mesh_i, items, ox, oz)
                    if n is not None:
                        bucket.append(n)

        paint = E.M()
        stalls = E.M()
        signs = E.M()
        posts = E.M()
        nzeb = 0
        for s in bag["zebras"]:
            nzeb += zebra(paint, s, ox, oz)
        nstall = 0
        for poly in bag["stalls"]:
            nstall += stall_stripes(stalls, poly, ox, oz)
        for shop in bag["shops"]:
            E.solid_box(posts,
                        shop["x"] - ox - 0.06, shop["h"] - base, shop["z"] - oz - 0.06,
                        shop["x"] - ox + 0.06, shop["h"] - base + 1.55, shop["z"] - oz + 0.06)
            add_board(signs, shop["x"], shop["z"], shop["h"] + 1.45,
                      shop["nx"], shop["nz"], 2.4, 0.62, ox, oz, base)

        def add_ground(mesh, mat, tag):
            if mesh.empty():
                return None
            mi = g.add_mesh(name + tag, [(mesh.p, mesh.n, mesh.u, mesh.i, mat)])
            g.nodes.append({"mesh": mi})
            return len(g.nodes) - 1

        # Shop boards use their own material. One board per chunk at most.
        sign_node = None
        if bag["shops"] and not signs.empty():
            mi = g.add_mesh(name + "_sign", [(signs.p, signs.n, signs.u, signs.i, shop_mats[0])])
            g.nodes.append({"mesh": mi})
            sign_node = len(g.nodes) - 1
        post_node = add_ground(posts, wood_m, "_spost")
        zebra_node = add_ground(paint, line_m, "_zeb")
        stall_node = add_ground(stalls, stall_m, "_stall")
        for node in (zebra_node, stall_node, sign_node, post_node):
            if node is not None:
                nodes_hi.append(node)
        # lod1 keeps the crossings (they read from the road) and drops stall paint
        if zebra_node is not None:
            nodes_lo.append(zebra_node)

        g.nodes.append({"name": name + "_lod0", "children": nodes_hi})
        hi_i = len(g.nodes) - 1
        g.nodes.append({"name": name + "_lod1", "children": nodes_lo})
        lo_i = len(g.nodes) - 1
        data = g.pack([hi_i, lo_i])
        path = os.path.join(HERO, name + ".glb")
        open(path, "wb").write(data)
        tris = {
            name + "_lod0": (
                len(bag["shelters"]) * 48 + len(bag["lamps"]) * 24
                + len(bag["showers"]) * 20 + len(bag["guards"]) * 36
                + nzeb * 2 + nstall * 2 + len(bag["shops"]) * 14
            ),
            name + "_lod1": len(bag["shelters"]) * 40 + len(bag["lamps"]) * 20 + nzeb * 2,
        }
        entry = {
            "id": name, "k": name,
            "name": "J.E. Irausquin street",
            "status": "jei-street",
            "x": round(ox, 2), "z": round(oz, 2), "y": 0, "rotation": 0,
            "glb": f"models/hero/{name}.glb",
            "lod": {"hi": name + "_lod0", "lo": name + "_lod1", "switch_m": 560},
            "tris": tris, "textures": 1 + len(bag["shops"]),
            "hide_footprint": [], "hide": [],
            "sign": bool(bag["shops"]), "kind": "replace", "new_place": False,
            "geo_source": "OSM J.E. Irausquin centreline and amenity=parking in the Eagle strip",
            "ref_sources": (
                "Street check along J.E. Irausquin from Druif to Eagle Beach: blue-roofed "
                "bus shelters on the inland sidewalk, lamp posts on the verge, white zebra "
                "bars at the public beach accesses, stall lines on the parking lots the kits "
                "already pave, and an open shower plus a lifeguard chair on the dry sand. "
                "The road shader already paints junction zebras, edge lines and a dashed centre. "
                "Fofoti stay on the existing heroes. Tulip is a freestanding board because that "
                "restaurant has no hero of its own. Geometry and the sign textures are original."
            ),
            "frame": "glb origin = chunk centroid on J.E. Irausquin; generated by landmarks/jei_street.py",
            "cat": "landmark",
        }
        manifest = [e for e in manifest if e.get("id") != name]
        manifest.append(entry)
        print(f"  {name} stops {len(bag['shelters'])} lamps {len(bag['lamps'])} "
              f"zebra {nzeb} stalls {nstall} shower {len(bag['showers'])} "
              f"guard {len(bag['guards'])} shops {len(bag['shops'])} "
              f"{os.path.getsize(path) // 1024}kb")

    removed = [i for i in before_ids if i not in {e.get("id") for e in manifest}]
    if removed:
        raise SystemExit("refusing to drop heroes: " + ",".join(removed))
    text = json.dumps(manifest, indent=1)
    # Match the file on main: dumps, no extra blank line.
    open(MANIFEST, "w").write(text)
    print("manifest", len(manifest))


if __name__ == "__main__":
    build()
