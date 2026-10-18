#!/usr/bin/env python3
"""Swap the cone palapa prototype for a thatch hut inside the Eagle Beach kits.

Keeps every instance matrix. Does not call eagle_strip.main() or refresh_street().
Run with EAGLE_HUTS=1. A bare `python3 landmarks/eagle_huts.py` does nothing.
"""
import json
import os
import struct

import eagle_strip as es

HERO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../game/models/hero")
MANIFEST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../game/data/hero/manifest.json")
KITS = ("eb_north", "eb_mid", "eb_south")


def load_glb(path):
    data = open(path, "rb").read()
    if data[:4] != b"glTF":
        raise SystemExit(f"not a glb: {path}")
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


def _add_view(js, blob, raw, target):
    while len(blob) % 4:
        blob.append(0)
    off = len(blob)
    blob.extend(raw)
    js["bufferViews"].append({
        "buffer": 0, "byteOffset": off, "byteLength": len(raw), "target": target,
    })
    return len(js["bufferViews"]) - 1


def _fix_normals(nrm):
    out = list(nrm)
    for k in range(0, len(out), 3):
        nx, ny, nz = out[k], out[k + 1], out[k + 2]
        if nx * nx + ny * ny + nz * nz < 1e-8:
            out[k], out[k + 1], out[k + 2] = 0.0, 1.0, 0.0
    return out


def replace_mesh(js, blob, mesh_name, mesh):
    """Point one prototype primitive at new geometry. Instance nodes stay put."""
    found = [m for m in js["meshes"] if m.get("name") == mesh_name]
    if len(found) != 1 or len(found[0]["primitives"]) != 1:
        raise SystemExit(f"expected one primitive in {mesh_name}")
    prim = found[0]["primitives"][0]
    pos, nrm, uv, idx = mesh.p, _fix_normals(mesh.n), mesh.u, mesh.i
    if len(idx) < 3 or len(pos) < 9:
        raise SystemExit(f"empty mesh {mesh_name}")
    nv = len(pos) // 3
    xs, ys, zs = pos[0::3], pos[1::3], pos[2::3]

    def f32(vals):
        return struct.pack("<" + "f" * len(vals), *[float(v) for v in vals])

    vi = _add_view(js, blob, f32(pos), 34962)
    js["accessors"].append({
        "bufferView": vi, "componentType": 5126, "count": nv, "type": "VEC3",
        "min": [min(xs), min(ys), min(zs)], "max": [max(xs), max(ys), max(zs)],
    })
    prim["attributes"]["POSITION"] = len(js["accessors"]) - 1
    vi = _add_view(js, blob, f32(nrm), 34962)
    js["accessors"].append({"bufferView": vi, "componentType": 5126, "count": nv, "type": "VEC3"})
    prim["attributes"]["NORMAL"] = len(js["accessors"]) - 1
    vi = _add_view(js, blob, f32(uv), 34962)
    js["accessors"].append({"bufferView": vi, "componentType": 5126, "count": nv, "type": "VEC2"})
    prim["attributes"]["TEXCOORD_0"] = len(js["accessors"]) - 1
    if max(idx) < 65535:
        raw, ct = struct.pack("<" + "H" * len(idx), *idx), 5123
    else:
        raw, ct = struct.pack("<" + "I" * len(idx), *idx), 5125
    vi = _add_view(js, blob, raw, 34963)
    js["accessors"].append({"bufferView": vi, "componentType": ct, "count": len(idx), "type": "SCALAR"})
    prim["indices"] = len(js["accessors"]) - 1
    return len(idx) // 3


def instance_count(js, mesh_index):
    for node in js["nodes"]:
        if node.get("mesh") == mesh_index:
            ext = ((node.get("extensions") or {}).get("EXT_mesh_gpu_instancing") or {}).get("attributes") or {}
            if "TRANSLATION" in ext:
                return js["accessors"][ext["TRANSLATION"]]["count"]
    return 1


def tri_count(js, mesh_name):
    mesh = next(m for m in js["meshes"] if m.get("name") == mesh_name)
    acc = js["accessors"][mesh["primitives"][0]["indices"]]
    return acc["count"] // 3


def patch_manifest(deltas):
    """deltas: {lod_key: added_tris}. Touch only those numbers."""
    text = open(MANIFEST).read()
    for key, add in deltas.items():
        needle = f'"{key}": '
        i = text.find(needle)
        if i < 0:
            raise SystemExit(f"manifest missing {key}")
        j = i + len(needle)
        k = j
        while k < len(text) and text[k] in "0123456789":
            k += 1
        old = int(text[j:k])
        text = text[:j] + str(old + add) + text[k:]
        print(f"  tris {key} {old} -> {old + add}")
    if not text.endswith("]"):
        # the file ends with ] and no trailing newline
        raise SystemExit("manifest does not end with ]")
    open(MANIFEST, "w").write(text)


def main():
    deltas = {}
    for name in KITS:
        path = os.path.join(HERO, name + ".glb")
        js, blob = load_glb(path)
        # counts before the swap, from the live accessors
        before = {}
        for lod in (0, 1):
            for part in ("wood", "thatch"):
                key = f"{name}_{part}{lod}"
                before[key] = tri_count(js, key)
        for lod in (0, 1):
            wood, thatch = es.build_palapa(lod)
            tw = replace_mesh(js, blob, f"{name}_wood{lod}", wood)
            tt = replace_mesh(js, blob, f"{name}_thatch{lod}", thatch)
            mi_w = next(i for i, m in enumerate(js["meshes"]) if m.get("name") == f"{name}_wood{lod}")
            n = instance_count(js, mi_w)
            old = before[f"{name}_wood{lod}"] + before[f"{name}_thatch{lod}"]
            deltas[f"{name}_lod{lod}"] = (tw + tt - old) * n
            print(f"{name} lod{lod} hut {old} -> {tw + tt} tris x {n}")
        save_glb(path, js, blob)
        # the hut must not have collapsed back into a cone: fringe drops below the rim
        wood, thatch = es.build_palapa(0)
        ys = thatch.p[1::3]
        if min(ys) > 1.55 or max(ys) < 2.5:
            raise SystemExit(f"thatch silhouette is still a cone ({min(ys):.2f}..{max(ys):.2f})")
    patch_manifest(deltas)
    print("huts swapped")


if __name__ == "__main__":
    if os.environ.get("EAGLE_HUTS") == "1":
        main()
    else:
        print("eagle_huts: set EAGLE_HUTS=1 to swap the palapa prototypes")
