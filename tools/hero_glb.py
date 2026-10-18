#!/usr/bin/env python3
"""Small glTF 2.0 writer for Aruba World hero landmarks.

Phone rules the game already relies on: one material per colour (shared by
both LODs), a lod0 and a lod1 node whose names match the manifest, and no
zero-length normals (those render as black frames on the phone GPU).
Positions are plain float32. Base colours are stored the same way the
existing heroes store them (straight 0-1 values, not linearised).
"""
import json
import struct
from pathlib import Path


def _unit(x, y, z):
    L = (x * x + y * y + z * z) ** 0.5
    if L < 1e-8:
        return None
    return (x / L, y / L, z / L)


class Mesh:
    def __init__(self):
        self.pos = []
        self.nrm = []
        self.uv = []
        self.idx = []
        self.has_uv = False

    def tri(self, a, b, c, uvs=None):
        n = _unit(
            (b[1] - a[1]) * (c[2] - a[2]) - (b[2] - a[2]) * (c[1] - a[1]),
            (b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]),
            (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]),
        )
        if n is None:
            return
        base = len(self.pos)
        self.pos.extend((a, b, c))
        self.nrm.extend((n, n, n))
        if uvs:
            self.has_uv = True
            self.uv.extend(uvs)
        self.idx.extend((base, base + 1, base + 2))

    def quad(self, a, b, c, d, uvs=None):
        # a-b-c-d around the face. CCW when viewed from outside.
        if uvs:
            self.tri(a, b, c, (uvs[0], uvs[1], uvs[2]))
            self.tri(a, c, d, (uvs[0], uvs[2], uvs[3]))
        else:
            self.tri(a, b, c)
            self.tri(a, c, d)

    @property
    def tris(self):
        return len(self.idx) // 3


def box(mesh, cx, cy, cz, sx, sy, sz):
    """Axis-aligned box centred at (cx, cy, cz). Faces wound outward."""
    x0, x1 = cx - sx / 2, cx + sx / 2
    y0, y1 = cy - sy / 2, cy + sy / 2
    z0, z1 = cz - sz / 2, cz + sz / 2
    v = {
        "lbf": (x0, y0, z0), "rbf": (x1, y0, z0), "rtf": (x1, y1, z0), "ltf": (x0, y1, z0),
        "lbb": (x0, y0, z1), "rbb": (x1, y0, z1), "rtb": (x1, y1, z1), "ltb": (x0, y1, z1),
    }
    # +x, -x, +y, -y, +z, -z
    mesh.quad(v["rbf"], v["rbb"], v["rtb"], v["rtf"])
    mesh.quad(v["lbb"], v["lbf"], v["ltf"], v["ltb"])
    mesh.quad(v["ltf"], v["rtf"], v["rtb"], v["ltb"])
    mesh.quad(v["lbf"], v["lbb"], v["rbb"], v["rbf"])
    mesh.quad(v["lbb"], v["ltb"], v["rtb"], v["rbb"])
    mesh.quad(v["lbf"], v["rbf"], v["rtf"], v["ltf"])


def prism(mesh, x0, x1, z0, z1, y0, y1):
    """Box from corner (x0,y0,z0) to (x1,y1,z1)."""
    box(mesh, (x0 + x1) / 2, (y0 + y1) / 2, (z0 + z1) / 2, abs(x1 - x0), abs(y1 - y0), abs(z1 - z0))


def gable_roof(mesh, x0, x1, z0, z1, y_eave, y_peak):
    """Ridge along X. Two slopes plus the two gable triangles are left to the walls."""
    zm = (z0 + z1) / 2
    a, b = (x0, y_eave, z0), (x1, y_eave, z0)
    c, d = (x1, y_eave, z1), (x0, y_eave, z1)
    r0, r1 = (x0, y_peak, zm), (x1, y_peak, zm)
    # south slope (outward +z side is z1). Viewed from +z: want CCW.
    mesh.quad(d, c, r1, r0)
    mesh.quad(a, r0, r1, b)


def wall_ring(mesh, ring, y0, y1):
    """Extrude a CCW (x,z) ring upward. Outward faces."""
    n = len(ring)
    for i in range(n):
        x0, z0 = ring[i]
        x1, z1 = ring[(i + 1) % n]
        mesh.quad((x0, y0, z0), (x0, y1, z0), (x1, y1, z1), (x1, y0, z1))


def fan(mesh, ring, y, up=True):
    """Triangle fan. Ring is CCW in the same sense as wall_ring (positive shoelace
    in x,z). That winding's a-b-c triangle points down, so the up face is a-c-b."""
    if len(ring) < 3:
        return
    for i in range(1, len(ring) - 1):
        a = (ring[0][0], y, ring[0][1])
        b = (ring[i][0], y, ring[i][1])
        c = (ring[i + 1][0], y, ring[i + 1][1])
        if up:
            mesh.tri(a, c, b)
        else:
            mesh.tri(a, b, c)


def sign_quad(mesh, a, b, c, d):
    """Textured quad. a top-left, b top-right, c bottom-right, d bottom-left,
    as seen from outside. Wound so that side is the front face."""
    mesh.quad(a, d, c, b, uvs=((0, 0), (0, 1), (1, 1), (1, 0)))


class Model:
    def __init__(self, name):
        self.name = name
        self.mats = {}  # name -> (rgba, roughness, double, emissive or None, has_tex)
        self.lod = [{}, {}]  # lod -> mat name -> Mesh

    def material(self, name, rgb, rough=0.85, double=False, emissive=None, textured=False, normal=False):
        self.mats[name] = (tuple(rgb) + (1,), rough, double, emissive, textured, normal)
        return name

    def mesh(self, lod, mat):
        return self.lod[lod].setdefault(mat, Mesh())

    def tri_count(self, lod):
        return sum(m.tris for m in self.lod[lod].values())


def _pad(b, n, ch):
    return b + ch * ((n - len(b) % n) % n)


def write_glb(model: Model, path, images=None):
    """images: list of (bufferView-bound) png bytes, used by any textured material (index 0)."""
    images = images or []
    # pack BIN: image bytes first, then per-primitive indices + pos + nrm + uv
    bin_parts = []
    views = []  # dicts

    def add_view(data, target=None, stride=None):
        data = _pad(data, 4, b"\x00")
        off = sum(len(p) for p in bin_parts)
        bin_parts.append(data)
        v = {"buffer": 0, "byteOffset": off, "byteLength": len(data)}
        if target:
            v["target"] = target
        if stride:
            v["byteStride"] = stride
        views.append(v)
        return len(views) - 1

    image_views = []
    for png in images:
        image_views.append(add_view(png))

    accessors = []
    materials = []
    mat_index = {}
    for name, spec in model.mats.items():
        rgba, rough, double, emissive, textured = spec[:5]
        has_normal = spec[5] if len(spec) > 5 else False
        m = {
            "name": name,
            "pbrMetallicRoughness": {
                "baseColorFactor": [round(c, 5) for c in rgba],
                "roughnessFactor": rough,
                "metallicFactor": 0,
            },
        }
        if double:
            m["doubleSided"] = True
        if textured and image_views:
            m["pbrMetallicRoughness"]["baseColorTexture"] = {"index": 0}
            if emissive is None and not has_normal:
                emissive = 0.35
        if has_normal and len(image_views) > 1:
            # glTF normal scale. Strong enough that a flat face still reads as pitted rock.
            m["normalTexture"] = {"index": 1, "scale": 1.6}
        if emissive:
            m["emissiveFactor"] = [emissive, emissive, emissive]
            if textured and image_views and emissive and not has_normal:
                m["emissiveTexture"] = {"index": 0}
        materials.append(m)
        mat_index[name] = len(materials) - 1

    meshes = []
    nodes = []
    for lod in (0, 1):
        prims = []
        for mat, mesh in model.lod[lod].items():
            if mesh.tris == 0:
                continue
            if len(mesh.idx) > 65535:
                raise SystemExit(f"{model.name} lod{lod} {mat} has {len(mesh.idx)} indices")
            ib = struct.pack("<" + "H" * len(mesh.idx), *mesh.idx)
            pb = b"".join(struct.pack("<3f", *p) for p in mesh.pos)
            nb = b"".join(struct.pack("<3f", *n) for n in mesh.nrm)
            iv = add_view(ib, 34963)
            pv = add_view(pb, 34962, 12)
            nv = add_view(nb, 34962, 12)
            mn = [min(p[k] for p in mesh.pos) for k in range(3)]
            mx = [max(p[k] for p in mesh.pos) for k in range(3)]
            ip = len(accessors)
            accessors.append({"bufferView": iv, "componentType": 5123, "count": len(mesh.idx), "type": "SCALAR"})
            accessors.append({"bufferView": pv, "componentType": 5126, "count": len(mesh.pos), "type": "VEC3", "min": mn, "max": mx})
            accessors.append({"bufferView": nv, "componentType": 5126, "count": len(mesh.nrm), "type": "VEC3"})
            prim = {"attributes": {"POSITION": ip + 1, "NORMAL": ip + 2}, "indices": ip, "material": mat_index[mat], "mode": 4}
            if mesh.has_uv:
                ub = b"".join(struct.pack("<2f", *u) for u in mesh.uv)
                uv = add_view(ub, 34962, 8)
                accessors.append({"bufferView": uv, "componentType": 5126, "count": len(mesh.uv), "type": "VEC2"})
                prim["attributes"]["TEXCOORD_0"] = len(accessors) - 1
            prims.append(prim)
        meshes.append({"name": f"{model.name}_lod{lod}", "primitives": prims})
        nodes.append({"name": f"{model.name}_lod{lod}", "mesh": lod})

    blob = b"".join(bin_parts)
    gltf = {
        "asset": {"version": "2.0", "generator": "aruba-hero-glb"},
        "scene": 0,
        "scenes": [{"name": model.name, "nodes": [0, 1]}],
        "nodes": nodes,
        "meshes": meshes,
        "materials": materials,
        "accessors": accessors,
        "bufferViews": views,
        "buffers": [{"byteLength": len(blob)}],
    }
    if images:
        gltf["samplers"] = [{"wrapS": 10497, "wrapT": 10497, "magFilter": 9729, "minFilter": 9986}]
        gltf["textures"] = [{"source": i, "sampler": 0} for i in range(len(images))]
        gltf["images"] = [
            {"name": "img%d" % i, "mimeType": "image/png", "bufferView": image_views[i]}
            for i in range(len(images))
        ]
    js = json.dumps(gltf, separators=(",", ":")).encode()
    js = _pad(js, 4, b" ")
    blob = _pad(blob, 4, b"\x00")

    def chunk(tag, data):
        return struct.pack("<II", len(data), tag) + data

    body = b"glTF" + struct.pack("<II", 2, 0) + chunk(0x4E4F534A, js) + chunk(0x004E4942, blob)
    body = body[:8] + struct.pack("<I", len(body)) + body[12:]
    Path(path).write_bytes(body)
    return {"lod0": model.tri_count(0), "lod1": model.tri_count(1), "bytes": len(body)}


def check_glb(path):
    """Reject a hero that would draw black frames (zero normals) or is missing a LOD."""
    data = Path(path).read_bytes()
    assert data[:4] == b"glTF"
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
    names = [n.get("name") for n in js["nodes"]]
    assert any(n.endswith("_lod0") for n in names), names
    assert any(n.endswith("_lod1") for n in names), names
    bad = 0
    total = 0
    for acc in js["accessors"]:
        if acc["type"] != "VEC3":
            continue
        # only normals: no min/max (positions have them)
        if "min" in acc:
            continue
        bv = js["bufferViews"][acc["bufferView"]]
        off = bv.get("byteOffset", 0) + acc.get("byteOffset", 0)
        stride = bv.get("byteStride", 12)
        for i in range(acc["count"]):
            x, y, z = struct.unpack_from("<3f", blob, off + i * stride)
            L = (x * x + y * y + z * z) ** 0.5
            total += 1
            if L < 0.5 or L > 1.5:
                bad += 1
    if bad:
        raise SystemExit(f"{path}: {bad}/{total} bad normals")
    return True
