#!/usr/bin/env python3
"""Beach-level fixes along the Eagle Beach / Druif / Manchebo strip.

Adds what the beach cameras showed was missing, and leaves every resort,
fofoti and palapa hero on main untouched:

- a thatched Manchebo beach bar in place of the pink OSM box on the sand
- thatched Divi and Tamarijn beach bars on the sand, with their names
- a Bucuti & Tara board on the sand in front of the resort
- yellow TURTLE NESTING boards above the tide line
- a few palapas on the open sand in front of Manchebo and Bucuti

The Amsterdam Manor fofoti set (eaglebeach_fx) already fills that beach.
Nothing here is stacked on it, and no resort GLB is rewritten.
"""
import json
import math
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import eagle_strip as E

HERO = E.HERO
MANIFEST = E.MANIFEST

# Pink beach boxes in the Manchebo sand view. The resort hero already hides
# The Pirate's Nest; these two still extrude as mauve houses.
MANCHEBO_HIDE_IDS = (30665, 30666)
# "The Swim-Up Bar" is a generic house on the sand in front of Divi.
DIVI_HIDE_IDS = (4455,)


def add_board(face, back, x, z, y, nx, nz, width, height):
    """Board whose normal (nx, nz) points at the viewer.

    Tangent (-nz, nx) is that viewer's left, so u=0 starts the word there.
    The back face uses the same rule for someone reading the other side.
    """
    hw = width * 0.5
    tx, tz = -nz, nx
    fx, fz = x + nx * 0.05, z + nz * 0.05
    left = (fx + tx * hw, fz + tz * hw)
    right = (fx - tx * hw, fz - tz * hw)
    a = face.v(left[0], y, left[1], nx, 0, nz, 0, 0)
    b = face.v(right[0], y, right[1], nx, 0, nz, 1, 0)
    c = face.v(right[0], y + height, right[1], nx, 0, nz, 1, 1)
    d = face.v(left[0], y + height, left[1], nx, 0, nz, 0, 1)
    face.quad(a, b, c, d)
    bnx, bnz = -nx, -nz
    tx2, tz2 = -bnz, bnx
    bx, bz = x - nx * 0.05, z - nz * 0.05
    leftb = (bx + tx2 * hw, bz + tz2 * hw)
    rightb = (bx - tx2 * hw, bz - tz2 * hw)
    a = back.v(leftb[0], y, leftb[1], bnx, 0, bnz, 0, 0)
    b = back.v(rightb[0], y, rightb[1], bnx, 0, bnz, 1, 0)
    c = back.v(rightb[0], y + height, rightb[1], bnx, 0, bnz, 1, 1)
    d = back.v(leftb[0], y + height, leftb[1], bnx, 0, bnz, 0, 1)
    back.quad(a, b, c, d)


def _quad(mesh, pts, uv):
    """pts: 4 xyz tuples, CCW seen from outside. uv: 4 (u, v)."""
    ax, ay, az = pts[1][0] - pts[0][0], pts[1][1] - pts[0][1], pts[1][2] - pts[0][2]
    bx, by, bz = pts[2][0] - pts[0][0], pts[2][1] - pts[0][1], pts[2][2] - pts[0][2]
    nx, ny, nz = ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx
    L = math.sqrt(nx * nx + ny * ny + nz * nz) or 1.0
    nx, ny, nz = nx / L, ny / L, nz / L
    ids = [mesh.v(p[0], p[1], p[2], nx, ny, nz, uv[i][0], uv[i][1]) for i, p in enumerate(pts)]
    mesh.quad(*ids)


def gable_roof(mesh, hx, hz, y0, y1, overhang):
    """Thatch gable. Ridge runs along Z so the long slope faces the beach (west)."""
    x0, x1 = -hx - overhang, hx + overhang
    z0, z1 = -hz - overhang, hz + overhang
    xm = 0.0
    # west slope, then east, then the two gable ends
    _quad(mesh,
          [(x0, y0, z0), (x0, y0, z1), (xm, y1, z1), (xm, y1, z0)],
          [(0, 0), (1, 0), (1, 1), (0, 1)])
    _quad(mesh,
          [(x1, y0, z1), (x1, y0, z0), (xm, y1, z0), (xm, y1, z1)],
          [(0, 0), (1, 0), (1, 1), (0, 1)])
    a = mesh.v(x0, y0, z0, 0, 0.2, -1, 0, 0)
    b = mesh.v(xm, y1, z0, 0, 0.4, -1, 0.5, 1)
    c = mesh.v(x1, y0, z0, 0, 0.2, -1, 1, 0)
    mesh.tri(a, b, c)
    a = mesh.v(x1, y0, z1, 0, 0.2, 1, 0, 0)
    b = mesh.v(xm, y1, z1, 0, 0.4, 1, 0.5, 1)
    c = mesh.v(x0, y0, z1, 0, 0.2, 1, 1.0, 0)
    mesh.tri(a, b, c)


def beach_bar(lod, label_png):
    """Open thatch bar, local, sign facing west (the beach)."""
    wood, roof, sign, back = E.M(), E.M(), E.M(), E.M()
    hx, hz = 2.8, 4.6
    if lod == 0:
        E.solid_box(wood, -hx, 0.04, -hz, hx, 0.22, hz)
        for px, pz in ((-hx + 0.35, -hz + 0.45), (hx - 0.35, -hz + 0.45),
                       (-hx + 0.35, hz - 0.45), (hx - 0.35, hz - 0.45)):
            E.solid_box(wood, px - 0.09, 0.0, pz - 0.09, px + 0.09, 2.45, pz + 0.09)
        E.solid_box(wood, 0.7, 0.22, -2.4, 2.1, 1.05, 2.4)
        gable_roof(roof, hx, hz, 2.35, 3.45, 0.55)
    else:
        E.solid_box(wood, -hx, 0.05, -hz, hx, 2.3, hz)
        E.solid_box(roof, -hx - 0.4, 2.3, -hz - 0.4, hx + 0.4, 3.2, hz + 0.4)
    add_board(sign, back, -hx - 0.15, 0.0, 1.45, -1.0, 0.0, 3.6, 0.9)
    return wood, roof, sign, back


def turtle_board(lod):
    wood, sign, back = E.M(), E.M(), E.M()
    w = 1.7 if lod == 0 else 1.55
    for pz in (-0.62, 0.62):
        E.solid_box(wood, -0.04, 0.0, pz - 0.04, 0.04, 1.15, pz + 0.04)
    add_board(sign, back, -0.02, 0.0, 0.72, -1.0, 0.0, w, 0.48)
    return wood, sign, back


def named_node(g, mesh, name):
    node = {"mesh": mesh}
    if name:
        node["name"] = name
    g.nodes.append(node)
    return len(g.nodes) - 1


def parent(g, name, children):
    g.nodes.append({"name": name, "children": children})
    return len(g.nodes) - 1


def tri_count(g, mesh_index):
    n = 0
    mesh = g.meshes[mesh_index]
    for prim in mesh.get("primitives") or []:
        ia = prim.get("indices")
        if ia is None:
            continue
        n += g.acc[ia]["count"] // 3
    return n


def pack_bar(hero_id, text, bg, fg):
    g = E.G()
    sign = g.tex_mat("sign", E.sign_png(text, bg, fg), repeat=False, emissive=0.15)
    back = g.color_mat("signback", bg)
    wood = g.color_mat("wood", (118, 78, 46))
    thatch = g.tex_mat("thatch", E.thatch_png(), repeat=True)
    # deck and posts share the wood material on lod0; the counter is deck-coloured
    # via the same wood prim so the bar stays one mesh. Recolour is not worth a
    # second material on a phone LOD.
    nodes = []
    tris = {}
    for lod, name in ((0, hero_id + "_lod0"), (1, hero_id + "_lod1")):
        w, r, s, b = beach_bar(lod, sign)
        mi = g.add_mesh(name, [
            (w.p, w.n, w.u, w.i, wood),
            (r.p, r.n, r.u, r.i, thatch),
            (s.p, s.n, s.u, s.i, sign),
            (b.p, b.n, b.u, b.i, back),
        ])
        nodes.append(named_node(g, mi, name))
        tris[name] = tri_count(g, mi)
    path = os.path.join(HERO, hero_id + ".glb")
    open(path, "wb").write(g.pack(nodes))
    return tris, 2


def instances_for(points, origin, yaw=0.0, scale=1.0):
    ox, oz = origin
    oh = E.height_at(ox, oz)
    tr, rot, sc = [], [], []
    quat = E.yaw_quat(yaw)
    for x, z in points:
        base = E.height_at(x, z)
        if base > 3.2:
            base = E.ground_height(x, z)
        tr += [x - ox, base - oh, z - oz]
        rot += list(quat)
        sc += [scale, scale, scale]
    return tr, rot, sc


def pack_props(hero_id, palapas, turtles, board, origin):
    """One hero: instanced palapas and turtle boards, plus one name board."""
    g = E.G()
    wood_c = g.color_mat("wood", (110, 74, 44))
    thatch = g.tex_mat("thatch", E.thatch_png(), repeat=True)
    cloth = g.color_mat("cloth", (232, 196, 92))
    yel = g.tex_mat("turtle", E.sign_png("TURTLE NESTING", (230, 176, 8), (28, 24, 18)), repeat=False, emissive=0.2)
    yback = g.color_mat("turtleback", (196, 148, 8))
    if board:
        bsign = g.tex_mat("bsign", E.sign_png(board["text"], board["bg"], board["fg"]), repeat=False, emissive=0.15)
        bback = g.color_mat("bback", board["bg"])
    else:
        bsign = bback = None
    nodes_hi, nodes_lo = [], []
    tris = {}
    ox, oz = origin

    def add_inst_mesh(lod_nodes, mesh_name, prims, pts, vary):
        if not pts:
            return
        mi = g.add_mesh(mesh_name, prims)
        tr, rot, sc = instances_for(pts, origin, 0.0, 1.0)
        if vary:
            rot, sc = [], []
            for i in range(len(pts)):
                rot += list(E.yaw_quat((i * 0.7) - 0.4))
                s = 0.92 + (i % 3) * 0.08
                sc += [s, s, s]
        lod_nodes.append(g.add_inst(mi, tr, rot, sc))

    for lod, bucket, tag in ((0, nodes_hi, "lod0"), (1, nodes_lo, "lod1")):
        pw, pt = E.build_palapa(lod)
        add_inst_mesh(bucket, "palapa_" + tag, [
            (pw.p, pw.n, pw.u, pw.i, wood_c),
            (pt.p, pt.n, pt.u, pt.i, thatch if lod == 0 else cloth),
        ], palapas, True)
        tw, ts, tb = turtle_board(lod)
        add_inst_mesh(bucket, "turtle_" + tag, [
            (tw.p, tw.n, tw.u, tw.i, wood_c),
            (ts.p, ts.n, ts.u, ts.i, yel),
            (tb.p, tb.n, tb.u, tb.i, yback),
        ], turtles, False)
        if board:
            sign, back = E.M(), E.M()
            bx, bz = board["x"] - ox, board["z"] - oz
            by = E.height_at(board["x"], board["z"]) - E.height_at(ox, oz)
            add_board(sign, back, bx, bz, by + 1.15, -1.0, 0.0, 3.4, 0.85)
            # two posts
            posts = E.M()
            for dz in (-1.45, 1.45):
                E.solid_box(posts, bx - 0.06, by, bz + dz - 0.06, bx + 0.06, by + 1.2, bz + dz + 0.06)
            mi = g.add_mesh("board_" + tag, [
                (posts.p, posts.n, posts.u, posts.i, wood_c),
                (sign.p, sign.n, sign.u, sign.i, bsign),
                (back.p, back.n, back.u, back.i, bback),
            ])
            bucket.append(named_node(g, mi, None))

    # named_node appended a name of None. Parents need real names.
    hi = parent(g, hero_id + "_lod0", nodes_hi)
    lo = parent(g, hero_id + "_lod1", nodes_lo)
    # tri count is the prototype, not times instances
    tris[hero_id + "_lod0"] = sum(tri_count(g, g.nodes[i]["mesh"]) for i in nodes_hi if "mesh" in g.nodes[i])
    tris[hero_id + "_lod1"] = sum(tri_count(g, g.nodes[i]["mesh"]) for i in nodes_lo if "mesh" in g.nodes[i])
    path = os.path.join(HERO, hero_id + ".glb")
    open(path, "wb").write(g.pack([hi, lo]))
    return tris, 2 if board else 1


def centroid_of(ids, buildings):
    pts = []
    for b in buildings:
        if b["id"] in ids:
            pts.append((b["cx"], b["cz"]))
    return pts


def clear_of(x, z, buildings, palapas, gap=16.0, hmax=2.4):
    if not E.in_strip(x, z):
        return False
    h = E.height_at(x, z)
    if not (0.6 <= h <= hmax):
        return False
    for b in buildings:
        if abs(b["cx"] - x) < 30 and abs(b["cz"] - z) < 30 and E.pip(x, z, b["poly"]):
            return False
    for px, pz in palapas:
        if math.hypot(px - x, pz - z) < gap:
            return False
    # eaglebeach_fx footprint, dequantized. Do not stack on that set.
    if -9366 < x < -9190 and -3873 < z < -3697:
        return False
    return True


def entry(hero_id, name, x, z, tris, textures, hide, ref, switch=180):
    return {
        "id": hero_id,
        "k": hero_id,
        "name": name,
        "status": "eagle-match",
        "x": round(x, 2),
        "z": round(z, 2),
        "y": 0,
        "rotation": 0,
        "glb": "models/hero/" + hero_id + ".glb",
        "lod": {"hi": hero_id + "_lod0", "lo": hero_id + "_lod1", "switch_m": switch},
        "tris": tris,
        "textures": textures,
        "hide_footprint": None,
        "hide": [[round(p[0], 2), round(p[1], 2)] for p in hide],
        "sign": False,
        "kind": "replace",
        "new_place": not hide,
        "geo_source": "placed on open sand in the Eagle Beach / Druif / Manchebo strip",
        "ref_sources": ref,
        "frame": "glb origin = placement (world x,z); glTF +X = world x, +Z = world z, Y up; generated by landmarks/eagle_beach_match.py",
        "cat": "park",
    }


def main():
    buildings = E.load_buildings()
    manifest = json.loads(open(MANIFEST).read())
    manifest = [h for h in manifest if h.get("status") != "eagle-match"]
    keep_ids = {h["id"] for h in manifest}
    palapas = [(h["x"], h["z"]) for h in manifest if str(h["id"]).startswith("palapa")]

    manchebo_hide = centroid_of(MANCHEBO_HIDE_IDS, buildings)
    divi_hide = centroid_of(DIVI_HIDE_IDS, buildings)
    assert len(manchebo_hide) == 2 and len(divi_hide) == 1

    # Bar sits on the pink footprint but its east wall stays clear of the
    # Manchebo hero (that mesh reaches world x ≈ -10087).
    manchebo_at = (-10118.0, -2330.0)
    divi_at = (-9496.0, -2024.0)
    tam_at = (-9522.0, -1740.0)
    for label, (x, z) in ("tam", tam_at), ("divi", divi_at), ("manchebo", manchebo_at):
        print(label, "h", round(E.height_at(x, z), 2), "g", round(E.ground_height(x, z), 2))

    bars = [
        ("manchebo_bar", "Manchebo beach bar", manchebo_at, "MANCHEBO", (122, 31, 43), (255, 255, 255),
         manchebo_hide, "Manchebo Beach Resort beach side: white walls, terracotta roofs, and a thatched beach restaurant. The pink OSM box on the sand is hidden; the resort hero is not edited."),
        ("divi_bar", "Divi beach bar", divi_at, "DIVI", (14, 107, 107), (255, 255, 255),
         divi_hide, "Divi Aruba beach: open thatched bar on the sand west of the resort. Replaces the generic Swim-Up Bar extrusion. The Divi hotel hero is not edited."),
        ("tamarijn_bar", "Tamarijn beach bar", tam_at, "TAMARIJN", (14, 124, 134), (255, 255, 255),
         [], "Tamarijn Aruba beach: thatched bar on the open sand west of the resort. The Tamarijn hotel hero is not edited."),
    ]
    written = []
    for hero_id, name, (x, z), text, bg, fg, hide, ref in bars:
        tris, textures = pack_bar(hero_id, text, bg, fg)
        written.append(entry(hero_id, name, x, z, tris, textures, hide, ref, switch=160))
        print(hero_id, tris)

    south_palapa_try = [(-10124, -2380), (-10100, -2405), (-10124, -2430), (-10124, -2480)]
    south_turtle_try = [(-10140, -2360), (-10130, -2288), (-10130, -2490)]
    north_turtle_try = [(-9249, -4080), (-9297, -3646), (-9441, -3400)]
    south_palapas = [(x, z) for x, z in south_palapa_try if clear_of(x, z, buildings, palapas)]
    south_turtles = [(x, z) for x, z in south_turtle_try if clear_of(x, z, buildings, palapas, gap=8, hmax=3.0)]
    north_turtles = [(x, z) for x, z in north_turtle_try if clear_of(x, z, buildings, palapas, gap=8, hmax=2.6)]
    print("south palapas", south_palapas)
    print("south turtles", south_turtles)
    print("north turtles", north_turtles)
    assert south_palapas and south_turtles and north_turtles

    board = {"x": -10095.0, "z": -2468.0, "text": "BUCUTI & TARA",
             "bg": (44, 33, 24), "fg": (246, 241, 230)}
    print("bucuti board h", round(E.height_at(board["x"], board["z"]), 2),
          "clear", clear_of(board["x"], board["z"], buildings, palapas, gap=10))

    def origin_of(pts):
        return (sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts))

    south_pts = south_palapas + south_turtles + [(board["x"], board["z"])]
    south_o = origin_of(south_pts)
    north_o = origin_of(north_turtles)
    print("origins", south_o, north_o)

    tris, textures = pack_props("eb_beach_s", south_palapas, south_turtles, board, south_o)
    written.append(entry(
        "eb_beach_s", "Manchebo and Bucuti beach palapas",
        south_o[0], south_o[1], tris, textures, [],
        "Public palapas and a Bucuti & Tara beach board on open sand west of those resorts, plus yellow turtle-nesting markers. Existing palapa heroes are not moved.",
        switch=220))
    print("eb_beach_s", tris)

    tris, textures = pack_props("eb_turtle_n", [], north_turtles, None, north_o)
    written.append(entry(
        "eb_turtle_n", "Eagle Beach turtle nesting signs",
        north_o[0], north_o[1], tris, textures, [],
        "Yellow TURTLE NESTING boards on the sand above the tide line, north and south of the existing Fofoti Trees & Palapas set. That set is not edited.",
        switch=220))
    print("eb_turtle_n", tris)

    ids = {h["id"] for h in manifest}
    for e in written:
        assert e["id"] not in ids, e["id"]
        manifest.append(e)
    raw = json.dumps(manifest, indent=1)
    # The file on main round-trips with indent=1 and no trailing newline.
    open(MANIFEST, "w").write(raw)
    lost = keep_ids - {h["id"] for h in manifest}
    assert not lost, lost
    print("manifest", len(manifest), "added", len(written))


if __name__ == "__main__":
    main()
