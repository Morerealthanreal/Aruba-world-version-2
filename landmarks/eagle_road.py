#!/usr/bin/env python3
"""Boulevard palms and the Irausquin kadushi row.

The J.E. Irausquin kits instance one frond mesh per palm. That mesh was a
flat 12-triangle disc, which reads as a green pole from the road. This
retargets the frond prototype (every instance keeps its matrix) to a crown
of arching fronds, and thickens the trunk slightly.

The roadside hero irausquinfx models each kadushi as one or two green boxes.
Those become a clump of ribbed columns. The new mesh is in hero-local metres
on an identity node: the old lod node is scaled by about 358, so metre
geometry must not be parented under it. White barrier blocks stay.

Lines, the cycle track and shelters are not rewritten.
Does not call eagle_strip.main(). Not idempotent.
EAGLE_ROAD=1 recrowns palms and rebuilds the kadushi row.
EAGLE_ROAD_CACTUS=1 rebuilds only the kadushi row, on the main-branch mesh.
"""
import json
import math
import os
import struct

HERO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../game/models/hero")
MANIFEST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../game/data/hero/manifest.json")
KITS = ("eb_blvd_north", "eb_blvd_mid", "eb_blvd_south")


class M:
    def __init__(self):
        self.p, self.n, self.u, self.i = [], [], [], []

    def v(self, x, y, z, nx, ny, nz, u, v):
        L = math.sqrt(nx * nx + ny * ny + nz * nz) or 1.0
        self.p += [x, y, z]
        self.n += [nx / L, ny / L, nz / L]
        self.u += [u, v]
        return len(self.p) // 3 - 1

    def quad(self, a, b, c, d):
        self.i += [a, b, c, a, c, d]


def ribbon(mesh, ang, segs, reach, droop, y0, width):
    """One frond: a tapering ribbon that leaves the crown and hangs."""
    left, right = [], []
    for s in range(segs + 1):
        t = s / segs
        r = 0.12 + reach * t
        y = y0 - droop * t * t
        a = ang + 0.22 * t
        w = width * (1.0 - 0.72 * t)
        ca, sa = math.cos(a), math.sin(a)
        # lit from above, tilted out along the frond
        nx, ny, nz = ca * 0.45, 0.8, sa * 0.45
        px, pz = -sa, ca
        left.append(mesh.v(ca * r + px * w, y, sa * r + pz * w, nx, ny, nz, t, 0))
        right.append(mesh.v(ca * r - px * w, y, sa * r - pz * w, nx, ny, nz, t, 1))
    for s in range(segs):
        mesh.quad(left[s], right[s], right[s + 1], left[s + 1])


def crown(lod):
    mesh = M()
    # Narrow ribbons. A wide blade reads as a green plank from the road.
    if lod == 0:
        n, segs = 10, 4
        for i in range(n):
            ribbon(mesh, (i + 0.12) / n * math.tau, segs, 3.25, 1.45, 5.5, 0.13)
        for i in range(6):
            ribbon(mesh, (i + 0.4) / 6 * math.tau, 3, 1.7, 0.35, 5.65, 0.08)
    else:
        for i in range(6):
            ribbon(mesh, i / 6 * math.tau, 2, 2.8, 1.2, 5.45, 0.16)
    ys = mesh.p[1::3]
    xs = mesh.p[0::3]
    if min(ys) > 4.5 or max(ys) < 5.3 or max(abs(x) for x in xs) < 2.2:
        raise SystemExit("crown is still a flat disc")
    return mesh


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
    out = b"glTF" + struct.pack("<II", 2, 12 + 8 + len(payload) + 8 + len(raw))
    out += struct.pack("<I", len(payload)) + b"JSON" + payload
    out += struct.pack("<I", len(raw)) + b"BIN\x00" + raw
    open(path, "wb").write(out)


def f32(vals):
    return struct.pack("<" + "f" * len(vals), *[float(v) for v in vals])


def add_view(js, blob, raw, target, count, typ, ctype, mn=None, mx=None):
    while len(blob) % 4:
        blob.append(0)
    off = len(blob)
    blob.extend(raw)
    js["bufferViews"].append({"buffer": 0, "byteOffset": off, "byteLength": len(raw), "target": target})
    acc = {"bufferView": len(js["bufferViews"]) - 1, "componentType": ctype, "count": count, "type": typ}
    if mn is not None:
        acc["min"], acc["max"] = mn, mx
    js["accessors"].append(acc)
    return len(js["accessors"]) - 1


def retarget(js, blob, mesh_name, mesh):
    found = next(m for m in js["meshes"] if m.get("name") == mesh_name)
    prim = found["primitives"][0]
    old = js["accessors"][prim["indices"]]["count"] // 3
    pos, nrm, uv, idx = mesh.p, mesh.n, mesh.u, mesh.i
    if len(idx) > 65000:
        raise SystemExit(mesh_name + " too many indices")
    nv = len(pos) // 3
    xs, ys, zs = pos[0::3], pos[1::3], pos[2::3]
    prim["attributes"]["POSITION"] = add_view(
        js, blob, f32(pos), 34962, nv, "VEC3", 5126,
        [min(xs), min(ys), min(zs)], [max(xs), max(ys), max(zs)],
    )
    prim["attributes"]["NORMAL"] = add_view(js, blob, f32(nrm), 34962, nv, "VEC3", 5126)
    prim["attributes"]["TEXCOORD_0"] = add_view(js, blob, f32(uv), 34962, nv, "VEC2", 5126)
    prim["indices"] = add_view(js, blob, struct.pack("<" + "H" * len(idx), *idx), 34963, len(idx), "SCALAR", 5123)
    return old, len(idx) // 3


def thicken_trunk(js, blob, mesh_name, scale=1.55):
    """Keep the height and the triangle count. A 14 cm stick reads as a pole."""
    found = next(m for m in js["meshes"] if m.get("name") == mesh_name)
    prim = found["primitives"][0]
    pa = js["accessors"][prim["attributes"]["POSITION"]]
    na = js["accessors"][prim["attributes"]["NORMAL"]]
    pb = js["bufferViews"][pa["bufferView"]]
    nb = js["bufferViews"][na["bufferView"]]
    pstart = pb.get("byteOffset", 0)
    nstart = nb.get("byteOffset", 0)
    pos, nrm = [], []
    for i in range(pa["count"]):
        x, y, z = struct.unpack_from("<fff", blob, pstart + i * 12)
        nx, ny, nz = struct.unpack_from("<fff", blob, nstart + i * 12)
        pos += [x * scale, y, z * scale]
        L = math.sqrt((nx * scale) ** 2 + ny * ny + (nz * scale) ** 2) or 1
        nrm += [nx * scale / L, ny / L, nz * scale / L]
    xs, ys, zs = pos[0::3], pos[1::3], pos[2::3]
    prim["attributes"]["POSITION"] = add_view(
        js, blob, f32(pos), 34962, pa["count"], "VEC3", 5126,
        [min(xs), min(ys), min(zs)], [max(xs), max(ys), max(zs)],
    )
    prim["attributes"]["NORMAL"] = add_view(js, blob, f32(nrm), 34962, na["count"], "VEC3", 5126)


def instances(js, mesh_name):
    mesh_i = next(i for i, m in enumerate(js["meshes"]) if m.get("name") == mesh_name)
    for node in js["nodes"]:
        if node.get("mesh") != mesh_i:
            continue
        ext = node.get("extensions", {}).get("EXT_mesh_gpu_instancing")
        if not ext:
            return 1
        return js["accessors"][ext["attributes"]["TRANSLATION"]]["count"]
    raise SystemExit("no node for " + mesh_name)


def patch_tris(deltas):
    text = open(MANIFEST).read()
    for key, add in deltas.items():
        needle = f'"{key}": '
        i = text.find(needle)
        if i < 0:
            raise SystemExit("missing " + key)
        j = i + len(needle)
        k = j
        while text[k] in "0123456789":
            k += 1
        old = int(text[j:k])
        text = text[:j] + str(old + add) + text[k:]
        print(f"  tris {key} {old} -> {old + add}")
    if not text.rstrip().endswith("]"):
        raise SystemExit("manifest does not end with ]")
    open(MANIFEST, "w").write(text)


def stem(mesh, x, z, y0, y1, radius, lean=(0.0, 0.0), sides=8):
    """One ribbed column. Alternate radii cut the kadushi flutes."""
    rings_t = (0.0, 0.45, 1.0)
    rings_s = (0.92, 1.0, 0.78)
    rings = []
    for t, scale in zip(rings_t, rings_s):
        y = y0 + (y1 - y0) * t
        ox, oz = lean[0] * t, lean[1] * t
        ring = []
        for i in range(sides):
            a = i / sides * math.tau
            ca, sa = math.cos(a), math.sin(a)
            flute = 0.72 if i % 2 else 1.0
            r = radius * scale * flute
            ring.append(mesh.v(x + ox + ca * r, y, z + oz + sa * r, ca, 0.08, sa, i / sides, t))
        rings.append(ring)
    for s in range(len(rings) - 1):
        for i in range(sides):
            j = (i + 1) % sides
            mesh.quad(rings[s][i], rings[s][j], rings[s + 1][j], rings[s + 1][i])
    tip_y = y1 + min(0.08, (y1 - y0) * 0.03)
    c = mesh.v(x + lean[0], tip_y, z + lean[1], 0, 1, 0, 0.5, 1)
    top = rings[-1]
    for i in range(sides):
        mesh.i += [c, top[i], top[(i + 1) % sides]]


def decode_prim(js, blob, node, prim):
    sx, sy, sz = node["scale"]
    tx, ty, tz = node["translation"]
    a = js["accessors"][prim["attributes"]["POSITION"]]
    bv = js["bufferViews"][a["bufferView"]]
    start = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
    stride = bv.get("byteStride") or 6
    pts = []
    for i in range(a["count"]):
        q = struct.unpack_from("<hhh", blob, start + i * stride)
        xyz = [max(v / 32767.0, -1.0) for v in q]
        pts.append((xyz[0] * sx + tx, xyz[1] * sy + ty, xyz[2] * sz + tz))
    return pts


def cactus_row(js, blob):
    """Each green box on the shoulder becomes a kadushi clump."""
    node = next(n for n in js["nodes"] if n.get("name") == "irausquinfx_lod0")
    if "children" in node or "mesh" not in node:
        raise SystemExit("irausquinfx_lod0 is already a group")
    mesh = js["meshes"][node["mesh"]]
    clusters = []
    removed = 0
    for prim in mesh["primitives"]:
        name = js["materials"][prim["material"]].get("name")
        if name not in ("cact", "cact2"):
            continue
        removed += js["accessors"][prim["indices"]]["count"] // 3
        for p in decode_prim(js, blob, node, prim):
            for c in clusters:
                if abs(p[0] - c[0]) < 1.4 and abs(p[2] - c[1]) < 1.4:
                    c[2] = min(c[2], p[1])
                    c[3] = max(c[3], p[1])
                    break
            else:
                clusters.append([p[0], p[2], p[1], p[1]])
    if len(clusters) < 30:
        raise SystemExit(f"only {len(clusters)} cactus plants")
    plants = M()
    for nplant, (x, z, y0, y1) in enumerate(clusters):
        h = y1 - y0
        if h < 0.8:
            continue
        # Kadushi / yatu: a short trunk and upright ribbed columns that
        # branch low and stay vertical. No sideways saguaro arm.
        fork = y0 + min(0.55, h * 0.28)
        stem(plants, x, z, y0, fork + 0.18, 0.13)
        columns = (
            (0.28, 0.04, 1.00, 0.105, 0.03, 0.0),
            (-0.24, 0.10, 0.86, 0.095, -0.02, 0.02),
            (0.05, -0.30, 0.74, 0.090, 0.0, -0.03),
            (-0.10, 0.26, 0.62, 0.085, -0.02, 0.0),
            (0.22, -0.16, 0.68, 0.080, 0.02, -0.02),
        )
        for dx, dz, frac, radius, lx, lz in columns[:3 + (nplant % 3)]:
            stem(plants, x + dx, z + dz, fork, y0 + h * frac, radius, lean=(lx, lz))
    xs, ys, zs = plants.p[0::3], plants.p[1::3], plants.p[2::3]
    if not xs or max(ys) - min(ys) > 12 or max(abs(v) for v in xs) > 220:
        raise SystemExit("cactus mesh left hero-local metres")
    if max(ys) < 1.0 or min(ys) > 0.5:
        raise SystemExit(f"cactus vertical span looks wrong {min(ys):.2f}..{max(ys):.2f}")
    if len(plants.i) > 60000:
        raise SystemExit("cactus index list does not fit uint16")
    print(f"  cactus plants {len(clusters)} tris {len(plants.i)//3} y {min(ys):.2f}..{max(ys):.2f}")
    # drop the box primitives; the new mesh is in hero metres, so it cannot
    # share the quantized node's scale of 358
    kept = [p for p in mesh["primitives"]
            if js["materials"][p["material"]].get("name") not in ("cact", "cact2")]
    if not any(js["materials"][p["material"]].get("name") == "pill" for p in kept):
        raise SystemExit("white barrier blocks were dropped")
    mesh["primitives"] = kept
    mat = next(i for i, m in enumerate(js["materials"]) if m.get("name") == "cact")
    # dusty blue-green, the colour of a kadushi in sun, not lawn green
    js["materials"][mat]["pbrMetallicRoughness"]["baseColorFactor"] = [0.40, 0.47, 0.34, 1]
    js["materials"][mat]["pbrMetallicRoughness"]["roughnessFactor"] = 0.92
    cactus_mesh = {"name": "irausquinfx_lod0_cactus", "primitives": []}
    js["meshes"].append(cactus_mesh)
    nv = len(plants.p) // 3
    pa = add_view(js, blob, f32(plants.p), 34962, nv, "VEC3", 5126,
                  [min(xs), min(ys), min(zs)], [max(xs), max(ys), max(zs)])
    na = add_view(js, blob, f32(plants.n), 34962, nv, "VEC3", 5126)
    ua = add_view(js, blob, f32(plants.u), 34962, nv, "VEC2", 5126)
    ia = add_view(
        js, blob, struct.pack("<" + "H" * len(plants.i), *plants.i),
        34963, len(plants.i), "SCALAR", 5123,
    )
    cactus_mesh["primitives"].append({
        "attributes": {"POSITION": pa, "NORMAL": na, "TEXCOORD_0": ua},
        "indices": ia, "material": mat,
    })
    old_mesh_index = node["mesh"]
    moved = {
        "translation": node["translation"],
        "scale": node["scale"],
        "mesh": old_mesh_index,
    }
    fresh = {"mesh": len(js["meshes"]) - 1}
    js["nodes"].append(moved)
    js["nodes"].append(fresh)
    node.pop("translation", None)
    node.pop("scale", None)
    node.pop("mesh", None)
    node["children"] = [len(js["nodes"]) - 2, len(js["nodes"]) - 1]
    if abs(moved["scale"][0] - 358) > 2:
        raise SystemExit("scaled child lost the quantization scale")
    return len(plants.i) // 3 - removed


def main():
    prototypes = {0: crown(0), 1: crown(1)}
    deltas = {}
    for kit in KITS:
        path = os.path.join(HERO, kit + ".glb")
        js, blob = load_glb(path)
        for lod, mesh in prototypes.items():
            name = f"{kit}_pfr{lod}"
            old, new = retarget(js, blob, name, mesh)
            n = instances(js, name)
            deltas[f"{kit}_lod{lod}"] = deltas.get(f"{kit}_lod{lod}", 0) + (new - old) * n
            print(f"  {name} {old} -> {new} tris x {n}")
            thicken_trunk(js, blob, f"{kit}_ptr{lod}")
        save_glb(path, js, blob)
    path = os.path.join(HERO, "irausquinfx.glb")
    js, blob = load_glb(path)
    deltas["irausquinfx_lod0"] = cactus_row(js, blob)
    save_glb(path, js, blob)
    patch_tris(deltas)
    print("palms crowned, kadushi row rebuilt")


def cactus_only():
    """Rebuild the kadushi row without touching palm crowns or trunks."""
    path = os.path.join(HERO, "irausquinfx.glb")
    js, blob = load_glb(path)
    delta = cactus_row(js, blob)
    save_glb(path, js, blob)
    patch_tris({"irausquinfx_lod0": delta})
    print("kadushi row rebuilt")


if __name__ == "__main__":
    if os.environ.get("EAGLE_ROAD_CACTUS") == "1":
        cactus_only()
    elif os.environ.get("EAGLE_ROAD") == "1":
        main()
    else:
        print("eagle_road: set EAGLE_ROAD=1 for palms, EAGLE_ROAD_CACTUS=1 for the kadushi row")
