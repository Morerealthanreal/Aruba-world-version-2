#!/usr/bin/env python3
"""Eagle Beach and Manchebo beach life.

Rental chairs and umbrellas on the sand in front of Costa Linda, Bucuti & Tara
and Manchebo, the two wedding gazebos, one volleyball court on the public
sand, and the short beach-entry paths between those resorts. New hero only.
Kits, resort meshes and the pool decks stay as they are.

Photos and the aerial are reference only. Geometry is drawn here.
Run with EAGLE_BEACH_LIFE=1. Never calls eagle_strip.main().
"""
import json
import math
import os
import struct

import eagle_strip as E

HID = "eb_beachlife"
GAME = E.GAME
MANIFEST = E.MANIFEST
HERO = E.HERO

# Metres inland of the dry-sand line. Read off the aerial: Costa Linda's
# checkerboard starts just in from the wash, Bucuti's sits a little further
# up the beach, Manchebo's is the shorter block close to that resort.
ROWS = (
    dict(name="costa", z0=-2704, z1=-2564, offs=(20, 30, 40, 50), step=6.2),
    dict(name="bucuti", z0=-2506, z1=-2394, offs=(16, 28, 40), step=6.4),
    dict(name="manchebo", z0=-2354, z1=-2278, offs=(68, 82), step=6.6),
)

# Peaked roofs on the sand, just inland of those grids.
# Just inland of the chair rows, on sand the beach camera can see.
# The aerial white roofs sit on a dune the resort hides from the shore.
GAZEBOS = (
    ("bucuti", -10102.0, -2436.0),
    ("manchebo", -10106.0, -2306.0),
)

# Dry sand in the palapa gap, seaward of the thatch line so the net
# is on the open beach rather than behind a palapa.
COURT = (-9278.0, -3764.0)

# Cloth colours seen on the rental rows: blue, white, orange.
CLOTH = ((22, 110, 184), (245, 245, 242), (230, 126, 48))


def _sand(x, z):
    rgb = E.aerial_rgb(x, z)
    if not rgb:
        return False
    r, g, b = rgb
    if b > r + 22 and b > 140:
        return False
    if g > r + 16 and g > 85:
        return False
    return r > 165 and g > 145 and b > 110 and r + g > b * 2


def place_y(x, z):
    """The opened terrain keeps these beach mounds, so the prop has to
    use the same height the mesh draws. A point in the wash is lifted
    just clear of the water."""
    h = E.height_at(x, z)
    if h < 0.3:
        h = 0.4
    return h


def _near(x, z, pts, dist):
    d2 = dist * dist
    for px, pz in pts:
        dx, dz = x - px, z - pz
        if dx * dx + dz * dz < d2:
            return True
    return False


def _kit_props():
    """World XZ of palapas and fabric umbrellas already in the kits."""
    manifest = json.loads(open(MANIFEST).read())
    by = {e.get("id"): e for e in manifest}
    pts = []
    for name in ("eb_north", "eb_mid", "eb_south"):
        e = by.get(name)
        if not e:
            continue
        data = open(os.path.join(GAME, e["glb"]), "rb").read()
        length = struct.unpack_from("<I", data, 12)[0]
        js = json.loads(data[20:20 + length])
        off = 20 + length
        blen, _ = struct.unpack_from("<I4s", data, off)
        blob = data[off + 8:off + 8 + blen]
        ox, oz = e["x"], e["z"]
        for n in js.get("nodes", []):
            mi = n.get("mesh")
            if mi is None:
                continue
            mn = js["meshes"][mi]["name"]
            if not (mn.endswith("_thatch0") or ("_uc" in mn and mn.endswith("_0"))):
                continue
            ext = ((n.get("extensions") or {}).get("EXT_mesh_gpu_instancing") or {}).get("attributes") or {}
            if "TRANSLATION" not in ext:
                continue
            acc = js["accessors"][ext["TRANSLATION"]]
            bv = js["bufferViews"][acc["bufferView"]]
            start = bv.get("byteOffset", 0) + acc.get("byteOffset", 0)
            raw = blob[start:start + acc["count"] * 12]
            for i in range(0, acc["count"] * 12, 12):
                x, _y, zz = struct.unpack_from("<fff", raw, i)
                pts.append((x + ox, zz + oz))
    return pts


def _blocked_buildings():
    out = []
    for b in E.load_buildings():
        if b["area"] >= 8000:
            continue
        out.append(b)
    return out


def _in_building(x, z, buildings):
    for b in buildings:
        if abs(b["cx"] - x) > 40 or abs(b["cz"] - z) > 40:
            continue
        if E.pip(x, z, b["poly"]):
            return True
    return False


def _yaw_to_sea(nx, nz):
    """Yaw so local -X points along the seaward normal."""
    return math.atan2(nz, -nx)


def _dry_shore(z):
    for x in range(-10440, -9800, 2):
        h = E.height_at(x, z)
        rgb = E.aerial_rgb(x, z)
        if not rgb:
            continue
        r, g, b = rgb
        if h > 0.45 and r > 190 and r + 12 > b and g > 155 and not (g > r + 14 and g > 125):
            return x
    return None


def _rows(blocked, buildings, gazebo_xy):
    placed = []
    # The shore faces west. A small along-shore component follows the curve.
    yaw = _yaw_to_sea(-0.96, -0.28)
    for spec in ROWS:
        z = spec["z0"]
        while z <= spec["z1"]:
            shore = _dry_shore(z)
            if shore is None:
                z += spec["step"]
                continue
            for i, off in enumerate(spec["offs"]):
                x = shore + off
                rgb = E.aerial_rgb(x, z)
                # Only a real tree crown. Shaded sand under an umbrella still reads as sand.
                if rgb and rgb[1] > rgb[0] + 28 and rgb[1] > 115:
                    continue
                if rgb and rgb[2] > rgb[0] + 35 and rgb[2] > 160:
                    continue
                h = E.height_at(x, z)
                if h < 0.05:
                    continue
                if _in_building(x, z, buildings):
                    continue
                if _near(x, z, blocked, 8.0):
                    continue
                if _near(x, z, gazebo_xy, 7.5):
                    continue
                if _near(x, z, [(p[0], p[1]) for p in placed], 3.6):
                    continue
                placed.append((x, z, yaw, (i + int(abs(z) // spec["step"])) % 3, spec["name"]))
            z += spec["step"]
    return placed


def _gazebos(buildings):
    out = []
    for name, x, z in GAZEBOS:
        if _in_building(x, z, buildings):
            # step seaward off the footprint
            moved = False
            for dx in range(2, 18, 2):
                if not _in_building(x - dx, z, buildings):
                    x, z = x - dx, z
                    moved = True
                    break
            if not moved:
                print(f"  gazebo {name} skipped (building)")
                continue
        print(f"  gazebo {name} @ {x:.0f},{z:.0f} y {place_y(x, z):.2f}")
        out.append((name, x, z))
    return out


def _court(blocked, buildings):
    """Posts on the dry public sand in the gap between palapa groups."""
    x, z = COURT
    posts = ((x, z - 4.2), (x, z + 4.2))
    for cx, cz in posts:
        if _in_building(cx, cz, buildings) or _near(cx, cz, blocked, 7.0):
            print(f"  court blocked @ {cx:.0f},{cz:.0f}")
            return None
        if E.height_at(cx, cz) < 0.15:
            print(f"  court in the wash @ {cx:.0f},{cz:.0f}")
            return None
    print(f"  court @ {x:.0f},{z:.0f}")
    return (x, z)


def _paths(buildings, sets):
    """Short packed-sand entries from the back of each rental grid inland."""
    # Start just inland of the grids, in the gaps the aerial shows between resorts.
    seeds = (
        (-9970.0, -2648.0),
        (-10070.0, -2456.0),
        (-10078.0, -2324.0),
        (-10070.0, -2232.0),
    )
    chair_xy = [(p[0], p[1]) for p in sets]
    paths = []
    for x0, z0 in seeds:
        found = None
        for dz in (0, 10, -10, 18, -18):
            z = z0 + dz
            pts = []
            x = x0
            for _ in range(14):
                if _in_building(x, z, buildings):
                    break
                if _near(x, z, chair_xy, 2.4):
                    break
                h = place_y(x, z)
                if h > 5.5:
                    break
                rgb = E.aerial_rgb(x, z)
                if rgb and rgb[1] > rgb[0] + 30 and rgb[1] > 120 and len(pts) > 3:
                    break
                pts.append((x, z))
                x += 3.0
            if len(pts) >= 4 and pts[-1][0] - pts[0][0] > 10:
                found = pts
                break
        if not found:
            print(f"  path {x0:.0f},{z0:.0f} skipped")
            continue
        paths.append(found)
        print(f"  path {found[0][0]:.0f},{found[0][1]:.0f} -> {found[-1][0]:.0f},{found[-1][1]:.0f}")
    return paths


def _fabric(mesh, sides, radius, y_rim, y_top):
    top = mesh.v(0, y_top, 0, 0, 1, 0, 0.5, 1)
    ring = []
    for i in range(sides):
        a = i / sides * math.tau
        x, z = math.cos(a) * radius, math.sin(a) * radius
        ring.append(mesh.v(x, y_rim, z, x, 0.45, z, i / sides, 0))
    for i in range(sides):
        mesh.tri(top, ring[i], ring[(i + 1) % sides])


def _chair(mesh, lod):
    """Lounger facing local -X (the sea once the instance is yawed)."""
    E.solid_box(mesh, -0.55, 0.22, -0.26, 0.42, 0.32, 0.26)
    if lod == 0:
        E.solid_box(mesh, 0.28, 0.28, -0.24, 0.40, 0.58, 0.24)


def _gazebo(mesh, lod):
    sides = 8 if lod == 0 else 6
    r = 2.45
    for i in range(sides):
        a = i / sides * math.tau
        x, z = math.cos(a) * r, math.sin(a) * r
        E.solid_box(mesh, x - 0.07, 0.02, z - 0.07, x + 0.07, 2.45, z + 0.07)


def _court_mesh(mesh, lod):
    # Posts and a two-band net. No sand sheet: a sheet shadows the beach.
    for z in (-4.15, 4.15):
        E.solid_box(mesh, -0.09, 0.02, z - 0.09, 0.09, 2.55, z + 0.09)
    if lod == 0:
        for y0, y1 in ((1.15, 1.22), (1.85, 1.92)):
            E.solid_box(mesh, -0.02, y0, -4.05, 0.02, y1, 4.05)
        # a slight sag in the middle of the top tape
        E.solid_box(mesh, -0.02, 1.55, -1.2, 0.02, 1.62, 1.2)
    else:
        E.solid_box(mesh, -0.02, 1.2, -4.0, 0.02, 1.9, 4.0)


def _build(sets, gazebos, court, paths):
    pts = [(p[0], p[1]) for p in sets]
    pts += [(g[1], g[2]) for g in gazebos]
    if court:
        pts.append(court)
    for path in paths:
        pts.extend(path)
    ox = sum(p[0] for p in pts) / len(pts)
    oz = sum(p[1] for p in pts) / len(pts)
    base = E.height_at(ox, oz)

    def ly(x, z):
        return place_y(x, z) - base

    g = E.G()
    wood_m = g.color_mat("wood", (148, 116, 78), 0.8)
    post_m = g.color_mat("post", (236, 232, 224), 0.7)
    roof_m = g.color_mat("groof", (248, 248, 246), 0.55)
    net_m = g.color_mat("net", (226, 226, 220), 0.9)
    path_m = g.color_mat("entry", (186, 158, 116), 0.92)
    cloth_m = [g.color_mat(f"rent{i}", c, 0.5) for i, c in enumerate(CLOTH)]

    def inst(mesh_i, items, y_of):
        if not items:
            return None
        tr, ro, sc = [], [], []
        for it in items:
            x, z = it[0], it[1]
            yaw = it[2] if len(it) > 2 else 0.0
            s = it[3] if len(it) > 3 else 1.0
            tr += [x - ox, y_of(x, z), z - oz]
            ro += list(E.yaw_quat(yaw))
            sc += [s, s, s]
        return g.add_inst(mesh_i, tr, ro, sc)

    nodes_hi, nodes_lo = [], []
    for lod, bucket in ((0, nodes_hi), (1, nodes_lo)):
        pole_m, = (E.M(),)
        E.pole(pole_m, 2.05, 0.04, 5 if lod == 0 else 4)
        pm = g.add_mesh(f"rent_pole{lod}", [(pole_m.p, pole_m.n, pole_m.u, pole_m.i, wood_m)])
        chair = E.M()
        _chair(chair, lod)
        cm = g.add_mesh(f"rent_chair{lod}", [(chair.p, chair.n, chair.u, chair.i, wood_m)])
        # one cloth mesh per colour
        cloth_ids = []
        for ci, col in enumerate(CLOTH):
            cloth = E.M()
            _fabric(cloth, 8 if lod == 0 else 5, 1.28, 1.95, 2.28)
            cloth_ids.append(g.add_mesh(
                f"rent_cloth{ci}_{lod}",
                [(cloth.p, cloth.n, cloth.u, cloth.i, cloth_m[ci])],
            ))
        groups = {0: [], 1: [], 2: []}
        chairs = []
        for x, z, yaw, ci, _name in sets:
            groups[ci].append((x, z, yaw, 1.0))
        for x, z, yaw, _ci, _name in sets:
            # offset along the shore (local +Z after yaw)
            cy, sy = math.cos(yaw), math.sin(yaw)
            # local +Z in world: yaw rotation of (0,1) -> (sin yaw, cos yaw)
            oxz, ozz = math.sin(yaw), math.cos(yaw)
            for side in (-0.95, 0.95):
                chairs.append((x + oxz * side, z + ozz * side, yaw, 1.0))
        n = inst(pm, [it for grp in groups.values() for it in grp], ly)
        if n is not None:
            bucket.append(n)
        for ci, items in groups.items():
            n = inst(cloth_ids[ci], items, ly)
            if n is not None:
                bucket.append(n)
        n = inst(cm, chairs, ly)
        if n is not None:
            bucket.append(n)

        gaz = E.M()
        _gazebo(gaz, lod)
        gm = g.add_mesh(f"gazebo{lod}", [(gaz.p, gaz.n, gaz.u, gaz.i, post_m)])
        # roof is a second material: rebuild roof-only by painting the whole
        # gazebo white posts + white roof. One material keeps the draw cheap.
        # Repaint roof by a second mesh that is only the cone.
        roof = E.M()
        _fabric(roof, 8 if lod == 0 else 6, 2.95, 2.35, 4.05)
        rm = g.add_mesh(f"gazroof{lod}", [(roof.p, roof.n, roof.u, roof.i, roof_m)])
        gitems = [(x, z, 0.0, 1.0) for _n, x, z in gazebos]
        for mesh_i in (gm, rm):
            n = inst(mesh_i, gitems, ly)
            if n is not None:
                bucket.append(n)

        if court:
            ct = E.M()
            _court_mesh(ct, lod)
            ctm = g.add_mesh(f"court{lod}", [(ct.p, ct.n, ct.u, ct.i, net_m)])
            # A translated node, not an instance. An instance 1 km from the
            # hero origin sits outside the mesh bounds and gets culled.
            g.nodes.append({
                "mesh": ctm,
                "translation": [court[0] - ox, ly(court[0], court[1]), court[1] - oz],
            })
            bucket.append(len(g.nodes) - 1)

    path_mesh = E.M()
    for seg in paths:
        hs = [place_y(x, z) for x, z in seg]
        E.ribbon(path_mesh, seg, 2.4, 0.14, ox, oz, hs)
    if not path_mesh.empty():
        pmi = g.add_mesh("entries", [(path_mesh.p, path_mesh.n, path_mesh.u, path_mesh.i, path_m)])
        g.nodes.append({"name": "entries", "mesh": pmi})
        nodes_hi.append(len(g.nodes) - 1)

    g.nodes.append({"name": HID + "_lod0", "children": nodes_hi})
    g.nodes.append({"name": HID + "_lod1", "children": nodes_lo})
    hi = len(g.nodes) - 2
    lo = len(g.nodes) - 1
    data = g.pack([hi, lo])
    path = os.path.join(HERO, HID + ".glb")
    open(path, "wb").write(data)

    def count(lod_children):
        # expanded tris: mesh tris times instances
        total = 0
        for ni in lod_children:
            node = g.nodes[ni]
            if "children" in node:
                continue
            mi = node.get("mesh")
            if mi is None:
                continue
            prims = g.meshes[mi]["primitives"]
            tris = 0
            for prim in prims:
                if "indices" not in prim:
                    continue
                tris += g.acc[prim["indices"]]["count"] // 3
            ext = ((node.get("extensions") or {}).get("EXT_mesh_gpu_instancing") or {}).get("attributes") or {}
            ninst = g.acc[ext["TRANSLATION"]]["count"] if "TRANSLATION" in ext else 1
            total += tris * ninst
        return total

    tris = {HID + "_lod0": count(nodes_hi), HID + "_lod1": count(nodes_lo)}
    print(f"  wrote {path} {os.path.getsize(path)//1024}kb tris {tris}")
    return ox, oz, tris


def _write_court(court):
    """Own hero. A mesh 1 km from eb_beachlife's origin was frustum-culled."""
    if not court:
        return None
    g = E.G()
    mat = g.color_mat("net", (236, 236, 230), 0.9)
    nodes = []
    for lod in (0, 1):
        ct = E.M()
        _court_mesh(ct, lod)
        mi = g.add_mesh(f"eb_volley_lod{lod}", [(ct.p, ct.n, ct.u, ct.i, mat)])
        g.nodes.append({"name": f"eb_volley_lod{lod}", "mesh": mi})
        nodes.append(len(g.nodes) - 1)
    data = g.pack(nodes)
    path = os.path.join(HERO, "eb_volley.glb")
    open(path, "wb").write(data)
    tris = {}
    for lod, ni in enumerate(nodes):
        mi = g.nodes[ni]["mesh"]
        n = 0
        for prim in g.meshes[mi]["primitives"]:
            if "indices" in prim:
                n += g.acc[prim["indices"]]["count"] // 3
        tris[f"eb_volley_lod{lod}"] = n
    print(f"  wrote {path} {os.path.getsize(path)}b tris {tris}")
    return tris


def _entry(hid, ox, oz, tris, status, ref, frame):
    return {
        "id": hid, "k": hid, "name": "",
        "status": status,
        "x": round(ox, 2), "z": round(oz, 2), "y": 0, "rotation": 0,
        "glb": f"models/hero/{hid}.glb",
        "lod": {"hi": hid + "_lod0", "lo": hid + "_lod1", "switch_m": 170},
        "tris": tris, "textures": 0, "hide_footprint": [], "hide": [],
        "sign": False, "kind": "replace", "new_place": False,
        "geo_source": "Esri World Imagery of the Eagle Beach and Manchebo sand",
        "ref_sources": ref,
        "frame": frame,
    }


def _write_manifest(ox, oz, tris, n_sets, n_paths, court, court_tris):
    raw = open(MANIFEST).read()
    before = json.loads(raw)
    before_ids = [e.get("id") for e in before]
    entry = {
        "id": HID, "k": HID, "name": "",
        "status": "eagle beach life",
        "x": round(ox, 2), "z": round(oz, 2), "y": 0, "rotation": 0,
        "glb": f"models/hero/{HID}.glb",
        "lod": {"hi": HID + "_lod0", "lo": HID + "_lod1", "switch_m": 170},
        "tris": tris, "textures": 0, "hide_footprint": [], "hide": [],
        "sign": False, "kind": "replace", "new_place": False,
        "geo_source": "Esri World Imagery of the Eagle Beach and Manchebo sand",
        "ref_sources": (
            "Rental rows are the chair-and-umbrella grids on the inland sand in front of "
            "Costa Linda, Bucuti & Tara and Manchebo. The white wedding gazebos sit just "
            "inland of those rows (Bucuti's is the peaked roof at the back of its grid; "
            "Manchebo's is the smaller one on its sand). "
            "Beach entries are the short packed-sand gaps between those resorts. "
            "Existing palapas, kit umbrellas, pool decks and resort meshes are not moved."
        ),
        "frame": "glb origin = centroid of the new props; generated by landmarks/eagle_beachlife.py",
    }
    # Splice one object. json.dumps of the whole file would rewrite every entry.
    block = json.dumps(entry, indent=1)
    block = "\n".join((" " + line) if line else line for line in block.split("\n"))
    if not raw.rstrip().endswith("]"):
        raise SystemExit("manifest does not end with ]")
    head = raw.rstrip()[:-1].rstrip()
    if not head.endswith("}"):
        raise SystemExit("manifest tail is not an object")
    new_ids = {HID, "eb_volley"}
    if any(e.get("id") in new_ids for e in json.loads(raw)):
        raise SystemExit("beach-life id already in the manifest; remove it before re-running")
    blocks = [block]
    if court and court_tris:
        centry = _entry(
            "eb_volley", court[0], court[1], court_tris,
            "eagle beach volleyball",
            "One beach-volleyball net on the open sand north of Amsterdam Manor, "
            "in the gap between the existing palapa groups. Posts and a tape net only.",
            "glb origin = court centre; generated by landmarks/eagle_beachlife.py",
        )
        cblock = json.dumps(centry, indent=1)
        cblock = "\n".join((" " + line) if line else line for line in cblock.split("\n"))
        blocks.append(cblock)
    text = head + ",\n" + ",\n".join(blocks) + "\n]"
    after = json.loads(text)
    after_ids = [e.get("id") for e in after]
    if [i for i in before_ids if i not in new_ids] != [i for i in after_ids if i not in new_ids]:
        raise SystemExit("manifest ids changed")
    bmap = {e.get("id"): e for e in before}
    for e in after:
        i = e.get("id")
        if i in new_ids:
            continue
        if bmap.get(i) != e:
            raise SystemExit(f"manifest entry changed: {i}")
    if not text.endswith("]"):
        raise SystemExit("bad tail")
    open(MANIFEST, "w").write(text if text.endswith("\n") else text)
    # The source file has no newline after ]. Match that.
    if open(MANIFEST, "rb").read().endswith(b"]\n"):
        t = open(MANIFEST, "rb").read()[:-1]
        open(MANIFEST, "wb").write(t)
    print("manifest", len(after), "sets", n_sets, "paths", n_paths)


def main():
    blocked = _kit_props()
    buildings = _blocked_buildings()
    print(f"kit props {len(blocked)} buildings {len(buildings)}")
    gazebos = _gazebos(buildings)
    gxy = [(g[1], g[2]) for g in gazebos]
    sets = _rows(blocked, buildings, gxy)
    print(f"rental sets {len(sets)}")
    for name in ("costa", "bucuti", "manchebo"):
        n = sum(1 for s in sets if s[4] == name)
        print(f"  {name} {n}")
    court = _court(blocked, buildings)
    paths = _paths(buildings, sets)
    if len(sets) < 40:
        raise SystemExit(f"too few rental sets ({len(sets)})")
    ox, oz, tris = _build(sets, gazebos, None, paths)
    court_tris = _write_court(court)
    _write_manifest(ox, oz, tris, len(sets), len(paths), court, court_tris)
    # a placement dump for the aerial check
    dump = {
        "sets": [[round(p[0], 1), round(p[1], 1), p[4]] for p in sets],
        "gazebos": [[n, round(x, 1), round(z, 1)] for n, x, z in gazebos],
        "court": [round(court[0], 1), round(court[1], 1)] if court else None,
        "paths": [[[round(x, 1), round(z, 1)] for x, z in seg] for seg in paths],
    }
    open("/tmp/eagle/life/placed.json", "w").write(json.dumps(dump))
    print("origin", round(ox, 1), round(oz, 1))


if __name__ == "__main__":
    if os.environ.get("EAGLE_BEACH_LIFE") == "1":
        main()
