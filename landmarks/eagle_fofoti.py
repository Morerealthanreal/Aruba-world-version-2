#!/usr/bin/env python3
"""Replace blob fofoti canopies with a twisted trunk, root flare and a flat crown.

Kit instances in eb_north / eb_mid / eb_south / eb_fofoti_north keep their places,
except a kit tree that sits on an existing grove is dropped so the two don't stack.
The grove heroes (eaglebeach_fx, eb_fofoti_10, eb_fofoti_11) keep their signs,
palapas and walls; only the bark and foliage primitives are replaced, at the
same trunk positions. Does not call eagle_strip.main().

Run with EAGLE_FOFOTI=1.
"""
import json
import math
import os
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import eagle_strip as es

HERO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../game/models/hero")
MANIFEST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../game/data/hero/manifest.json")
KITS = ("eb_north", "eb_mid", "eb_south", "eb_fofoti_north")
GROVES = ("eaglebeach_fx", "eb_fofoti_10", "eb_fofoti_11")
DROP = {"bark", "fol", "fol2", "ldome"}


def load_glb(path):
    data = open(path, "rb").read()
    ln = struct.unpack_from("<I", data, 12)[0]
    js = json.loads(data[20:20 + ln])
    off = 20 + ln
    bl = struct.unpack_from("<I", data, off)[0]
    return js, bytearray(data[off + 8:off + 8 + bl])


def save_glb(path, js, blob):
    js["buffers"][0]["byteLength"] = len(blob)
    payload = json.dumps(js, separators=(",", ":")).encode()
    while len(payload) % 4:
        payload += b" "
    raw = bytes(blob)
    while len(raw) % 4:
        raw += b"\x00"
    out = bytearray()
    total = 12 + 8 + len(payload) + 8 + len(raw)
    out += b"glTF" + struct.pack("<II", 2, total)
    out += struct.pack("<I", len(payload)) + b"JSON" + payload
    out += struct.pack("<I", len(raw)) + b"BIN\x00" + raw
    open(path, "wb").write(out)


def read_acc(js, blob, ai):
    a = js["accessors"][ai]
    bv = js["bufferViews"][a["bufferView"]]
    start = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
    ncomp = {"SCALAR": 1, "VEC2": 2, "VEC3": 3, "VEC4": 4}[a["type"]]
    fmt = {5122: "h", 5123: "H", 5126: "f"}[a["componentType"]]
    sz = struct.calcsize(fmt)
    stride = bv.get("byteStride") or sz * ncomp
    out = []
    for i in range(a["count"]):
        out.append(struct.unpack_from("<" + fmt * ncomp, blob, start + i * stride))
    return out, a


def _add_view(js, blob, raw, target=None):
    while len(blob) % 4:
        blob.append(0)
    off = len(blob)
    blob.extend(raw)
    view = {"buffer": 0, "byteOffset": off, "byteLength": len(raw)}
    if target:
        view["target"] = target
    js["bufferViews"].append(view)
    return len(js["bufferViews"]) - 1


def _fix(nrm):
    out = list(nrm)
    for k in range(0, len(out), 3):
        if out[k] ** 2 + out[k + 1] ** 2 + out[k + 2] ** 2 < 1e-8:
            out[k], out[k + 1], out[k + 2] = 0.0, 1.0, 0.0
    return out


def mesh_prim(js, blob, mesh, material):
    pos, nrm, uv, idx = mesh.p, _fix(mesh.n), mesh.u, mesh.i
    if len(idx) < 3:
        raise SystemExit("empty fofoti mesh")
    nv = len(pos) // 3

    def f32(vals):
        return struct.pack("<" + "f" * len(vals), *[float(v) for v in vals])

    xs, ys, zs = pos[0::3], pos[1::3], pos[2::3]
    vi = _add_view(js, blob, f32(pos), 34962)
    js["accessors"].append({
        "bufferView": vi, "componentType": 5126, "count": nv, "type": "VEC3",
        "min": [min(xs), min(ys), min(zs)], "max": [max(xs), max(ys), max(zs)],
    })
    pa = len(js["accessors"]) - 1
    vi = _add_view(js, blob, f32(nrm), 34962)
    js["accessors"].append({"bufferView": vi, "componentType": 5126, "count": nv, "type": "VEC3"})
    na = len(js["accessors"]) - 1
    vi = _add_view(js, blob, f32(uv), 34962)
    js["accessors"].append({"bufferView": vi, "componentType": 5126, "count": nv, "type": "VEC2"})
    ua = len(js["accessors"]) - 1
    if max(idx) < 65535:
        raw, ct = struct.pack("<" + "H" * len(idx), *idx), 5123
    else:
        raw, ct = struct.pack("<" + "I" * len(idx), *idx), 5125
    vi = _add_view(js, blob, raw, 34963)
    js["accessors"].append({"bufferView": vi, "componentType": ct, "count": len(idx), "type": "SCALAR"})
    return {
        "attributes": {"POSITION": pa, "NORMAL": na, "TEXCOORD_0": ua},
        "indices": len(js["accessors"]) - 1,
        "material": material,
    }, len(idx) // 3


def replace_named(js, blob, mesh_name, mesh):
    found = [m for m in js["meshes"] if m.get("name") == mesh_name]
    if len(found) != 1 or len(found[0]["primitives"]) != 1:
        raise SystemExit(f"expected one primitive in {mesh_name}")
    prim = found[0]["primitives"][0]
    built, tris = mesh_prim(js, blob, mesh, prim["material"])
    prim["attributes"] = built["attributes"]
    prim["indices"] = built["indices"]
    return tris


def mat_index(js, name):
    for i, m in enumerate(js["materials"]):
        if m.get("name") == name:
            return i
    return None


def decode_bark(js, blob, node):
    sc = (node.get("scale") or [1, 1, 1])[0]
    tr = node.get("translation") or [0, 0, 0]
    mesh = js["meshes"][node["mesh"]]
    prim = None
    for p in mesh["primitives"]:
        if js["materials"][p["material"]].get("name") == "bark":
            prim = p
            break
    if prim is None:
        raise SystemExit("no bark primitive on " + str(node.get("name")))
    pos, acc = read_acc(js, blob, prim["attributes"]["POSITION"])
    quant = acc["componentType"] == 5122
    pts = []
    for q in pos:
        if quant:
            pts.append((
                max(q[0] / 32767, -1) * sc + tr[0],
                max(q[1] / 32767, -1) * sc + tr[1],
                max(q[2] / 32767, -1) * sc + tr[2],
            ))
        else:
            pts.append(q)
    return pts


def clusters_of(pts, thresh=4.2):
    """One centre per trunk. Base y is the lowest bark sample, where the roots meet the sand."""
    ground = [p for p in pts if p[1] < 0.6]
    found = []
    for x, y, z in ground:
        hit = None
        for c in found:
            if math.hypot(x - c[0], z - c[1]) < thresh:
                hit = c
                break
        if hit is None:
            found.append([x, z, y, 1])
            continue
        n = hit[3]
        hit[0] = (hit[0] * n + x) / (n + 1)
        hit[1] = (hit[1] * n + z) / (n + 1)
        hit[2] = min(hit[2], y)
        hit[3] = n + 1
    return [c for c in found if c[3] >= 4]


def stamp(dst, src, x, y, z, s):
    base = len(dst.p) // 3
    for i in range(0, len(src.p), 3):
        dst.p += [src.p[i] * s + x, src.p[i + 1] * s + y, src.p[i + 2] * s + z]
        nx, ny, nz = src.n[i], src.n[i + 1], src.n[i + 2]
        L = math.sqrt(nx * nx + ny * ny + nz * nz) or 1.0
        dst.n += [nx / L, ny / L, nz / L]
        ui = (i // 3) * 2
        dst.u += [src.u[ui], src.u[ui + 1]]
    for idx in src.i:
        dst.i.append(idx + base)


def scale_for(x, z):
    h = (int(round(x * 10)) * 13 + int(round(z * 7))) & 7
    return 0.90 + h * 0.035


def local_ground(ox, oz, x, z):
    """Hero-local y of the terrain. The model sits on the ground at its origin."""
    return es.height_at(ox + x, oz + z) - es.height_at(ox, oz)


def build_grove(lod, spots, ox=None, oz=None):
    proto_b, proto_l = es.build_tree(lod)
    bark, leaf, upper = es.M(), es.M(), es.M()
    for x, z, y in spots:
        s = scale_for(x, z)
        if ox is None:
            # Cluster base is the old root sample, a little under the sand.
            y += 0.35
        else:
            # The beach rises toward the road. A flat lift buries the south
            # trunks, so each flare sits on the terrain under that tree.
            # 0.55 clears the root radius, which hangs below the path.
            y = local_ground(ox, oz, x, z) + 0.55
        stamp(bark, proto_b, x, y, z, s)
        stamp(leaf, proto_l, x, y, z, s)
        # Pale stones on the sand by the flare, as in the beach photos.
        for dx, dz, rx, ry in (
            (1.15, 0.45, 0.38, 0.18), (1.55, -0.55, 0.26, 0.12), (-0.35, 1.05, 0.32, 0.14),
            (0.4, -1.25, 0.22, 0.10), (-1.35, 0.25, 0.28, 0.12), (1.85, 0.95, 0.18, 0.09),
        ):
            es.ico(upper, x + dx * s, y + ry * s * 0.45, z + dz * s, rx * s, ry * s, rx * s * 0.8)
    return bark, leaf, upper


def drop_blobs(js):
    removed = 0
    for mesh in js["meshes"]:
        kept = []
        for prim in mesh["primitives"]:
            name = js["materials"][prim["material"]].get("name")
            if name in DROP:
                removed += js["accessors"][prim["indices"]]["count"] // 3
                continue
            kept.append(prim)
        if not kept:
            raise SystemExit(f"dropping blobs would empty {mesh.get('name')}")
        mesh["primitives"] = kept
    return removed


def reparent(js, blob, node_index, bark, leaf, upper):
    node = js["nodes"][node_index]
    if "mesh" not in node:
        raise SystemExit(f"{node.get('name')} is already a group")
    parts = []
    tris = 0
    for mesh, mat_name in ((bark, "bark"), (leaf, "fol"), (upper, "fol2")):
        mi = mat_index(js, mat_name)
        if mi is None or len(mesh.i) < 3:
            continue
        prim, n = mesh_prim(js, blob, mesh, mi)
        parts.append(prim)
        tris += n
    js["meshes"].append({"name": node["name"] + "_divi", "primitives": parts})
    mesh_i = len(js["meshes"]) - 1
    child = {k: v for k, v in node.items() if k != "name"}
    js["nodes"].append(child)
    js["nodes"].append({"mesh": mesh_i})
    js["nodes"][node_index] = {
        "name": node["name"],
        "children": [len(js["nodes"]) - 2, len(js["nodes"]) - 1],
    }
    return tris


def origins():
    man = json.loads(open(MANIFEST).read())
    return {e["id"]: (e["x"], e["z"]) for e in man if e.get("id")}


def grove_world(path, ox, oz):
    js, blob = load_glb(path)
    node = next(n for n in js["nodes"] if n.get("name", "").endswith("_lod0"))
    pts = decode_bark(js, blob, node)
    spots = clusters_of(pts)
    world = [(ox + c[0], oz + c[1]) for c in spots]
    local = [(c[0], c[1], c[2]) for c in spots]
    print(f"  {os.path.basename(path)} trunks {len(spots)}")
    return world, local


def rewrite_grove(name, local):
    path = os.path.join(HERO, name + ".glb")
    js, blob = load_glb(path)
    # colour the trunk as weathered grey. Foliage materials stay.
    for m in js["materials"]:
        if m.get("name") == "bark":
            m["pbrMetallicRoughness"]["baseColorFactor"] = [0.29, 0.26, 0.23, 1]
    removed = drop_blobs(js)
    new = 0
    for lod, suffix in ((0, "_lod0"), (1, "_lod1")):
        ox, oz = origins()[name]
        bark, leaf, upper = build_grove(lod, local, ox, oz)
        node_i = next(i for i, n in enumerate(js["nodes"]) if n.get("name") == name + suffix)
        new += reparent(js, blob, node_i, bark, leaf, upper) if lod == 0 else 0
        if lod == 1:
            # count lod1 separately via the return
            pass
    # recompute per lod from the reparent return — do lods explicitly
    return js, blob, removed


def rewrite_grove_counted(name, local):
    path = os.path.join(HERO, name + ".glb")
    js, blob = load_glb(path)
    for m in js["materials"]:
        if m.get("name") == "bark":
            m["pbrMetallicRoughness"]["baseColorFactor"] = [0.29, 0.26, 0.23, 1]
    removed_by = {}
    # count dropped tris per lod mesh before deleting
    for mesh in js["meshes"]:
        n = 0
        for prim in mesh["primitives"]:
            if js["materials"][prim["material"]].get("name") in DROP:
                n += js["accessors"][prim["indices"]]["count"] // 3
        removed_by[mesh.get("name")] = n
    drop_blobs(js)
    added = {}
    for lod in (0, 1):
        suffix = f"_lod{lod}"
        ox, oz = origins()[name]
        bark, leaf, upper = build_grove(lod, local, ox, oz)
        node_i = next(i for i, n in enumerate(js["nodes"]) if n.get("name") == name + suffix)
        added[name + suffix] = reparent(js, blob, node_i, bark, leaf, upper)
        print(f"  {name}{suffix} dropped {removed_by.get(name + suffix, 0)} added {added[name + suffix]}")
    save_glb(path, js, blob)
    return {k: added.get(k, 0) - removed_by.get(k, 0) for k in added}


def node_for_mesh(js, mesh_name):
    mi = next(i for i, m in enumerate(js["meshes"]) if m.get("name") == mesh_name)
    nodes = [n for n in js["nodes"] if n.get("mesh") == mi]
    if len(nodes) != 1:
        raise SystemExit(f"{mesh_name} nodes {len(nodes)}")
    return nodes[0]


def filter_kit(js, blob, name, ox, oz, occupied):
    """Drop kit trees standing on a grove trunk. Bark and leaf share the kept list."""
    dropped = 0
    for lod in (0, 1):
        bark_node = node_for_mesh(js, f"{name}_bark{lod}")
        leaf_node = node_for_mesh(js, f"{name}_leaf{lod}")
        attrs = bark_node["extensions"]["EXT_mesh_gpu_instancing"]["attributes"]
        tr, _ = read_acc(js, blob, attrs["TRANSLATION"])
        ro, _ = read_acc(js, blob, attrs["ROTATION"])
        sc, _ = read_acc(js, blob, attrs["SCALE"])
        keep = []
        for i, t in enumerate(tr):
            x, z = ox + t[0], oz + t[2]
            if any(math.hypot(x - a, z - b) < 8.5 for a, b in occupied):
                dropped += 1
                continue
            keep.append(i)
        if not keep:
            raise SystemExit(f"{name} lod{lod} would lose every tree")
        if len(keep) == len(tr):
            continue

        def pack(rows):
            flat = [c for i in keep for c in rows[i]]
            return struct.pack("<" + "f" * len(flat), *[float(v) for v in flat])

        def add(raw, typ, count, mn=None, mx=None):
            vi = _add_view(js, blob, raw)
            acc = {"bufferView": vi, "componentType": 5126, "count": count, "type": typ}
            if mn is not None:
                acc["min"], acc["max"] = mn, mx
            js["accessors"].append(acc)
            return len(js["accessors"]) - 1

        n = len(keep)
        xs = [tr[i][0] for i in keep]
        ys = [tr[i][1] for i in keep]
        zs = [tr[i][2] for i in keep]
        new_attr = {
            "TRANSLATION": add(pack(tr), "VEC3", n, [min(xs), min(ys), min(zs)], [max(xs), max(ys), max(zs)]),
            "ROTATION": add(pack(ro), "VEC4", n),
            "SCALE": add(pack(sc), "VEC3", n),
        }
        for node in (bark_node, leaf_node):
            node["extensions"]["EXT_mesh_gpu_instancing"]["attributes"] = dict(new_attr)
    return dropped // 2  # counted once per lod pair; caller wants trees removed, same for both lods


def patch_tris(deltas):
    text = open(MANIFEST).read()
    for key, add in deltas.items():
        needle = f'"{key}": '
        i = text.find(needle)
        if i < 0:
            raise SystemExit(f"manifest missing {key}")
        j = i + len(needle)
        k = j
        while text[k] in "-0123456789":
            k += 1
        old = int(text[j:k])
        text = text[:j] + str(old + int(add)) + text[k:]
        print(f"  tris {key} {old} -> {old + int(add)}")
    if not text.rstrip().endswith("]"):
        raise SystemExit("manifest does not end with ]")
    open(MANIFEST, "w").write(text)


def main():
    org = origins()
    occupied = []
    locals_ = {}
    for name in GROVES:
        world, local = grove_world(os.path.join(HERO, name + ".glb"), *org[name])
        occupied.extend(world)
        locals_[name] = local
    # north-sand kit trees are real placements; a strip kit tree on top of one goes
    north = node_positions(os.path.join(HERO, "eb_fofoti_north.glb"), *org["eb_fofoti_north"])
    occupied.extend(north)
    print(f"  occupied trunks {len(occupied)}")

    deltas = {}
    for name in GROVES:
        deltas.update(rewrite_grove_counted(name, locals_[name]))

    for name in KITS:
        path = os.path.join(HERO, name + ".glb")
        js, blob = load_glb(path)
        paint(js)
        removed_trees = 0
        if name != "eb_fofoti_north":
            removed_trees = filter_kit(js, blob, name, *org[name], occupied)
            print(f"  {name} dropped {removed_trees} trees that sat on a grove")
        for lod in (0, 1):
            bark, leaf = es.build_tree(lod)
            old_b = js["accessors"][next(m for m in js["meshes"] if m["name"] == f"{name}_bark{lod}")["primitives"][0]["indices"]]["count"] // 3
            old_l = js["accessors"][next(m for m in js["meshes"] if m["name"] == f"{name}_leaf{lod}")["primitives"][0]["indices"]]["count"] // 3
            nb = replace_named(js, blob, f"{name}_bark{lod}", bark)
            nl = replace_named(js, blob, f"{name}_leaf{lod}", leaf)
            node = node_for_mesh(js, f"{name}_bark{lod}")
            ninst = js["accessors"][node["extensions"]["EXT_mesh_gpu_instancing"]["attributes"]["TRANSLATION"]]["count"]
            deltas[f"{name}_lod{lod}"] = (nb + nl - old_b - old_l) * ninst - (old_b + old_l) * removed_trees
            print(f"  {name} lod{lod} {old_b + old_l} -> {nb + nl} tris x {ninst}")
        save_glb(path, js, blob)
    assert_crown()
    patch_tris(deltas)
    print("fofoti swapped")


# Leaf green with almost no blue. (0.15, 0.36, 0.16) went pale teal in the sun;
# a near-black green read as flat slabs. This stays a dense divi green.
FOLIAGE = [0.06, 0.18, 0.035, 1]


def paint(js):
    for m in js["materials"]:
        name = m.get("name")
        pbr = m.setdefault("pbrMetallicRoughness", {})
        if name == "bark":
            # Weathered grey-brown, as on the Eagle Beach divi. Near-black
            # reads as a silhouette with no twist.
            pbr["baseColorFactor"] = [0.20, 0.16, 0.13, 1]
        elif name == "fol":
            pbr["baseColorFactor"] = list(FOLIAGE)
            pbr["roughnessFactor"] = 0.94
            pbr["metallicFactor"] = 0.0
            m["doubleSided"] = True
        elif name == "fol2":
            # Pale beach stones around the roots. fol2 is unused by the palapas.
            pbr["baseColorFactor"] = [0.78, 0.76, 0.72, 1]
            pbr["roughnessFactor"] = 0.96
            pbr["metallicFactor"] = 0.0


def assert_crown():
    """Rounded small-leaf crown swept west, sitting on a trunk that leans that way."""
    bark, leaf = es.build_tree(0)
    xs, ys = leaf.p[0::3], leaf.p[1::3]
    span = max(xs) - min(xs)
    thick = max(ys) - min(ys)
    # Tip of the scaled leader. A leaf must actually meet it.
    tipx, tipy = -2.15 * 1.65, 2.16 * 1.65
    on_trunk = any((x - tipx) ** 2 + (y - tipy) ** 2 < 0.7 ** 2 for x, y in zip(xs, ys))
    # Wider than tall, west of the flare, and not a single flat pad.
    if (min(bark.p[0::3]) > -1.5 or span < 3.2 or span > 6.5 or min(xs) > -4.0
            or max(xs) > -2.5 or thick < 1.3 or thick > 3.2
            or not (3.2 < max(ys) < 5.4) or not on_trunk):
        raise SystemExit(
            f"crown still a slab span={span:.2f} thick={thick:.2f} "
            f"x={min(xs):.2f}..{max(xs):.2f} y={min(ys):.2f}..{max(ys):.2f} "
            f"bark_x={min(bark.p[0::3]):.2f} on_trunk={on_trunk}"
        )


def divi_mesh(js, name):
    found = [m for m in js["meshes"] if m.get("name") == name]
    if len(found) != 1:
        return None
    return found[0]


def replace_grove_parts(js, blob, mesh, bark, leaf, upper):
    old = 0
    for prim in mesh["primitives"]:
        old += js["accessors"][prim["indices"]]["count"] // 3
    prims = []
    new = 0
    for part, mat_name in ((bark, "bark"), (leaf, "fol"), (upper, "fol2")):
        mi = mat_index(js, mat_name)
        if mi is None or len(part.i) < 3:
            continue
        prim, n = mesh_prim(js, blob, part, mi)
        prims.append(prim)
        new += n
    if not prims:
        raise SystemExit("grove refresh produced an empty crown")
    mesh["primitives"] = prims
    return new - old


def spots_from_divi(js, blob, mesh):
    prim = None
    for p in mesh["primitives"]:
        if js["materials"][p["material"]].get("name") == "bark":
            prim = p
            break
    if prim is None:
        raise SystemExit("divi mesh has no bark")
    pos, _ = read_acc(js, blob, prim["attributes"]["POSITION"])
    pts = [(p[0], p[1], p[2]) for p in pos]
    # Only the flare. A tree whose base sits below the hero origin has its
    # whole trunk under y=1.3, and those points would sprout extra trees.
    roots = []
    for p in pts:
        if p[1] > 4.8:
            continue
        under = False
        for q in pts:
            if q[1] < p[1] - 0.4 and (p[0] - q[0]) ** 2 + (p[2] - q[2]) ** 2 < 2.56:
                under = True
                break
        if not under:
            roots.append(p)
    found = []
    for x, y, z in roots:
        hit = None
        for c in found:
            if math.hypot(x - c[0], z - c[1]) < 4.2:
                hit = c
                break
        if hit is None:
            found.append([x, z, y, 1])
            continue
        n = hit[3]
        hit[0] = (hit[0] * n + x) / (n + 1)
        hit[1] = (hit[1] * n + z) / (n + 1)
        hit[2] = min(hit[2], y)
        hit[3] = n + 1
    # A real flare has a bundle of root verts. The underside of a crown
    # clump is a local minimum too, but only a dozen verts.
    spots = [(c[0], c[1], c[2]) for c in found if c[3] >= 16]
    if len(spots) < 3:
        raise SystemExit(f"could not recover grove trunks ({len(spots)})")
    return spots


def ensure_color(js, name, rgba, rough=0.96):
    for i, m in enumerate(js["materials"]):
        if m.get("name") != name:
            continue
        pbr = m.setdefault("pbrMetallicRoughness", {})
        pbr["baseColorFactor"] = list(rgba)
        pbr["roughnessFactor"] = rough
        pbr["metallicFactor"] = 0
        m["doubleSided"] = True
        return i
    js["materials"].append({
        "name": name,
        "doubleSided": True,
        "pbrMetallicRoughness": {
            "baseColorFactor": list(rgba),
            "roughnessFactor": rough,
            "metallicFactor": 0,
        },
    })
    return len(js["materials"]) - 1


def upsert_child_mesh(js, blob, parent_name, mesh_name, prim_meshes):
    """Replace a dress mesh, or hang a new one off the lod group. Returns the tris delta."""
    prims = []
    tris = 0
    for mesh, mi in prim_meshes:
        if len(mesh.i) < 3:
            continue
        prim, n = mesh_prim(js, blob, mesh, mi)
        prims.append(prim)
        tris += n
    if not prims:
        return 0
    existing = [i for i, m in enumerate(js["meshes"]) if m.get("name") == mesh_name]
    if existing:
        old = sum(js["accessors"][p["indices"]]["count"] // 3 for p in js["meshes"][existing[0]]["primitives"])
        js["meshes"][existing[0]]["primitives"] = prims
        return tris - old
    js["meshes"].append({"name": mesh_name, "primitives": prims})
    js["nodes"].append({"mesh": len(js["meshes"]) - 1})
    parent = next(n for n in js["nodes"] if n.get("name") == parent_name)
    parent.setdefault("children", []).append(len(js["nodes"]) - 1)
    return tris


def sand_sheet(ox, oz):
    """Near-white coral sand over the Eagle Beach apron. Colour only, no texture."""
    mesh = es.M()
    step = 4.0
    x0, x1 = ox - 40.0, ox + 52.0
    z0, z1 = oz - 110.0, oz + 150.0
    cols = int((x1 - x0) / step)
    rows = int((z1 - z0) / step)
    base = es.height_at(ox, oz)
    for iz in range(rows):
        for ix in range(cols):
            corners = []
            dry = True
            # CCW from above so the face normal points up.
            for dx, dz in ((0.0, 0.0), (0.0, step), (step, step), (step, 0.0)):
                wx, wz = x0 + ix * step + dx, z0 + iz * step + dz
                h = es.height_at(wx, wz)
                if h < 0.2 or h > 4.0:
                    dry = False
                corners.append((wx - ox, h - base + 0.05, wz - oz))
            if not dry:
                continue
            ids = [mesh.v(x, y, z, 0, 1, 0, 0, 0) for x, y, z in corners]
            mesh.quad(ids[0], ids[1], ids[2], ids[3])
    return mesh


def dress_beach(js, blob, name, ox, oz, spots):
    """White sand, driftwood, extra stones and the inland tree line. Eagle Beach hero only."""
    if name != "eaglebeach_fx":
        return 0
    sand_i = ensure_color(js, "sand", [0.93, 0.91, 0.86], 0.98)
    drift_i = ensure_color(js, "drift", [0.42, 0.36, 0.30], 0.94)
    bark_i = mat_index(js, "bark")
    fol_i = mat_index(js, "fol")
    stone_i = mat_index(js, "fol2")
    sand = sand_sheet(ox, oz)
    wood, stones, line_b, line_l = es.M(), es.M(), es.M(), es.M()
    # The photographed tree, the northern of the two on the open sand.
    tx, tz = -9218.2 - ox, -3869.8 - oz
    best = min(spots, key=lambda s: (s[0] - tx) ** 2 + (s[1] - tz) ** 2)
    tx, tz = best[0], best[1]
    gy = local_ground(ox, oz, tx, tz)

    def gy_at(x, z):
        return local_ground(ox, oz, x, z)

    # Driftwood on the sand in front of the trunk (south, toward a viewer on the beach).
    for dx, dz, yaw, length, rad in (
        (-1.4, 2.6, 0.5, 1.15, 0.09), (2.0, 2.1, 1.8, 0.85, 0.07),
        (-2.8, 1.4, 2.2, 1.25, 0.08), (0.6, 3.8, 1.1, 0.95, 0.06),
    ):
        x, z = tx + dx, tz + dz
        y = gy_at(x, z) + 0.02
        dxv, dzv = math.cos(yaw) * length, math.sin(yaw) * length
        es.tube(wood, [
            (x, y + rad, z),
            (x + dxv * 0.5, y + rad * 0.9, z + dzv * 0.5),
            (x + dxv, y + rad * 0.75, z + dzv),
        ], rad, rad * 0.8, 6, twist=0.4, knot=0.12)
    for dx, dz, rx, ry in (
        (2.8, 1.6, 0.34, 0.16), (-2.2, 2.8, 0.28, 0.13), (4.2, 3.4, 0.22, 0.11),
        (-0.6, 5.1, 0.18, 0.08), (1.4, -1.8, 0.26, 0.12),
    ):
        x, z = tx + dx, tz + dz
        es.ico(stones, x, gy_at(x, z) + ry * 0.4, z, rx, ry, rx * 0.85)
    # Low tree line inland (east, the right side when looking north toward the sea-left view).
    proto_b, proto_l = es.build_tree(0)
    # Stay on the sand. Further east the terrain climbs onto the boulevard.
    # Small and well north of the postcard stand, so they read as the far tree line.
    for dx, dz, sc in ((11, -22, 0.30), (16, -30, 0.26), (8, -28, 0.24), (14, -18, 0.28), (6, -34, 0.22)):
        x, z = tx + dx, tz + dz
        y = gy_at(x, z) + 0.55
        stamp(line_b, proto_b, x, y, z, sc)
        stamp(line_l, proto_l, x, y, z, sc)
    return upsert_child_mesh(
        js, blob, name + "_lod0", name + "_lod0_dress",
        ((sand, sand_i), (wood, drift_i), (stones, stone_i), (line_b, bark_i), (line_l, fol_i)),
    )


def fix_sign(js, blob):
    """The Passions board is mirrored, so BEACH reads backwards."""
    mat = next((m for m in js["materials"] if m.get("name") == "sign"), None)
    if mat is None or mat.get("extras", {}).get("readable"):
        return
    mesh = next(m for m in js["meshes"] if m.get("name") == "eaglebeach_fx_lod0")
    prim = next(p for p in mesh["primitives"] if js["materials"][p["material"]].get("name") == "sign")
    a = js["accessors"][prim["attributes"]["TEXCOORD_0"]]
    bv = js["bufferViews"][a["bufferView"]]
    start = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
    stride = bv.get("byteStride") or 4
    for i in range(a["count"]):
        off = start + i * stride
        u, v = struct.unpack_from("<HH", blob, off)
        struct.pack_into("<HH", blob, off, 65535 - u, v)
    mat.setdefault("extras", {})["readable"] = True


def refresh():
    """The groves are already reparented. Swap the crown meshes in place."""
    assert_crown()
    deltas = {}
    org = origins()
    only = os.environ.get("EAGLE_FOFOTI_ONLY")
    groves = (only,) if only else GROVES
    for name in groves:
        path = os.path.join(HERO, name + ".glb")
        js, blob = load_glb(path)
        paint(js)
        spots = None
        for lod in (0, 1):
            mesh = divi_mesh(js, f"{name}_lod{lod}_divi")
            if mesh is None:
                raise SystemExit(f"{name} lod{lod} has no divi mesh to refresh")
            # Lod1 trunks are too thin to re-cluster. Both lods share the lod0 roots.
            if spots is None:
                spots = spots_from_divi(js, blob, mesh)
                expect = {"eaglebeach_fx": 7, "eb_fofoti_10": 11, "eb_fofoti_11": 18}
                if len(spots) != expect[name]:
                    raise SystemExit(f"{name} clustered {len(spots)} trunks, want {expect[name]}")
            # spots_from_divi returns the lifted root height. Seating ignores it
            # and puts each flare on the terrain under that trunk.
            local = [(x, z, y) for x, z, y in spots]
            ox, oz = org[name]
            bark, leaf, upper = build_grove(lod, local, ox, oz)
            deltas[f"{name}_lod{lod}"] = replace_grove_parts(js, blob, mesh, bark, leaf, upper)
            print(f"  {name} lod{lod} trees {len(spots)} delta {deltas[f'{name}_lod{lod}']}")
        if name == "eaglebeach_fx":
            dress = dress_beach(js, blob, name, org[name][0], org[name][1], [(x, z) for x, z, _y in spots])
            deltas["eaglebeach_fx_lod0"] = deltas.get("eaglebeach_fx_lod0", 0) + dress
            fix_sign(js, blob)
            print(f"  eaglebeach dress delta {dress}")
        save_glb(path, js, blob)
    if only:
        patch_tris(deltas)
        print("fofoti crowns refreshed", only)
        return
    for name in KITS:
        path = os.path.join(HERO, name + ".glb")
        js, blob = load_glb(path)
        paint(js)
        for lod in (0, 1):
            bark, leaf = es.build_tree(lod)
            old_b = js["accessors"][next(m for m in js["meshes"] if m["name"] == f"{name}_bark{lod}")["primitives"][0]["indices"]]["count"] // 3
            old_l = js["accessors"][next(m for m in js["meshes"] if m["name"] == f"{name}_leaf{lod}")["primitives"][0]["indices"]]["count"] // 3
            nb = replace_named(js, blob, f"{name}_bark{lod}", bark)
            nl = replace_named(js, blob, f"{name}_leaf{lod}", leaf)
            node = node_for_mesh(js, f"{name}_bark{lod}")
            ninst = js["accessors"][node["extensions"]["EXT_mesh_gpu_instancing"]["attributes"]["TRANSLATION"]]["count"]
            deltas[f"{name}_lod{lod}"] = (nb + nl - old_b - old_l) * ninst
            print(f"  {name} lod{lod} {old_b + old_l} -> {nb + nl} tris x {ninst}")
        save_glb(path, js, blob)
    patch_tris(deltas)
    print("fofoti crowns refreshed")


def node_positions(path, ox, oz):
    js, blob = load_glb(path)
    node = node_for_mesh(js, os.path.basename(path).replace(".glb", "") + "_bark0")
    tr, _ = read_acc(js, blob, node["extensions"]["EXT_mesh_gpu_instancing"]["attributes"]["TRANSLATION"])
    return [(ox + t[0], oz + t[2]) for t in tr]


if __name__ == "__main__":
    if os.environ.get("EAGLE_FOFOTI") == "1":
        probe, _ = load_glb(os.path.join(HERO, "eaglebeach_fx.glb"))
        lod0 = next(n for n in probe["nodes"] if n.get("name") == "eaglebeach_fx_lod0")
        if "children" in lod0:
            refresh()
        else:
            main()
    else:
        print("eagle_fofoti: set EAGLE_FOFOTI=1 to replace the fofoti meshes")
