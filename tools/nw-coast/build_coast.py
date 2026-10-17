#!/usr/bin/env python3
"""North-west coast heroes: California Lighthouse through Fisherman's Huts.

Placement uses the baked-map projection (longitude scaled by cos(lat)), which
matches the road tiles. Terrain Y is sampled from the same DEM the game
bilinear-filters (4 m grid). Each GLB origin sits on that height, and every
vertex stores Y relative to it.

Sources for shapes and colours: OSM footprints and coast nodes, the DEM,
Wikipedia's description of the California Lighthouse (pale rubble-stone shaft,
octagonal base, double gallery, 30 m), and published visitor descriptions of
Fisherman's Huts, Tres Trapi, Boca Catalina, Malmok, Arashi, and the Antilla
mooring buoys. Geometry is original.
"""

from __future__ import annotations

import json
import math
import os
import re
import struct
from collections import defaultdict

import numpy as np
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
REAL = os.path.join(ROOT, "game", "data", "real")
HERO = os.path.join(ROOT, "game", "models", "hero")
MANIFEST = os.path.join(ROOT, "game", "data", "hero", "manifest.json")

X0, Z0 = -10800.0, -11800.0
LAT0, LON0 = 12.52, -69.97


def ll(lat: float, lon: float) -> tuple[float, float]:
    x = (lon - LON0) * 111320.0 * math.cos(math.radians(lat))
    z = -(lat - LAT0) * 110540.0
    return x, z


_IM: dict[tuple[int, int], np.ndarray] = {}


def height(x: float, z: float) -> float:
    rx = math.floor((x - X0) / 1000.0)
    rz = math.floor((z - Z0) / 1000.0)
    key = (rx, rz)
    im = _IM.get(key)
    if im is None:
        path = os.path.join(REAL, f"h_{rx}_{rz}.png")
        if not os.path.exists(path):
            return 0.0
        rgb = np.asarray(Image.open(path).convert("RGB"), dtype=np.float32)
        _IM[key] = (rgb[:, :, 0] * 256.0 + rgb[:, :, 1]) / 100.0 - 50.0
        im = _IM[key]
    ox, oz = X0 + rx * 1000.0, Z0 + rz * 1000.0
    s = min(249.001, max(0.0, (x - ox) / 4.0))
    c = min(249.001, max(0.0, (z - oz) / 4.0))
    l, u = int(s), int(c)
    d, f = s - l, c - u
    h00, h10 = im[u, l], im[u, l + 1]
    h01, h11 = im[u + 1, l], im[u + 1, l + 1]
    return float((h00 * (1 - d) + h10 * d) * (1 - f) + (h01 * (1 - d) + h11 * d) * f)


def mesh_height(x: float, z: float) -> float:
    """Height on the rendered 4 m terrain mesh.

    Chunks sit on the same 4 m lattice as the DEM (region origin is a multiple
    of 4). Each cell is two triangles, (x,z)-(x,z+4)-(x+4,z) and
    (x+4,z)-(x,z+4)-(x+4,z+4). Bilinear sampling misses that fold, which is
    what left the old Boca treads off the cliff face.
    """
    gx = math.floor(x / 4.0) * 4.0
    gz = math.floor(z / 4.0) * 4.0
    u = (x - gx) / 4.0
    v = (z - gz) / 4.0
    h00 = height(gx, gz)
    h10 = height(gx + 4.0, gz)
    h01 = height(gx, gz + 4.0)
    h11 = height(gx + 4.0, gz + 4.0)
    if u + v <= 1.0:
        return h00 + u * (h10 - h00) + v * (h01 - h00)
    return h11 + (1.0 - u) * (h01 - h11) + (1.0 - v) * (h10 - h11)


def inside(poly, x, z) -> bool:
    r = False
    j = len(poly) - 1
    for i in range(len(poly)):
        xi, zi = poly[i][0], poly[i][1]
        xj, zj = poly[j][0], poly[j][1]
        if (zi > z) != (zj > z) and x < (xj - xi) * (z - zi) / (zj - zi) + xi:
            r = not r
        j = i
    return r


def interior_point(poly):
    cx = sum(p[0] for p in poly) / len(poly)
    cz = sum(p[1] for p in poly) / len(poly)
    if inside(poly, cx, cz):
        return cx, cz
    n = len(poly)
    for i in range(n):
        a, b, c = poly[i], poly[(i + 1) % n], poly[(i + 2) % n]
        mx = (a[0] + b[0] + c[0]) / 3
        mz = (a[1] + b[1] + c[1]) / 3
        if inside(poly, mx, mz):
            return mx, mz
    return None


def load_roads(names: set[str]):
    roads = []
    for fn in os.listdir(REAL):
        if not (fn.startswith("r_") and fn.endswith(".json")):
            continue
        rx, rz = (int(p) for p in fn[2:-5].split("_"))
        if rx > 4 or rz > 6 or rx < 1 or rz < 1:
            continue
        data = json.load(open(os.path.join(REAL, fn)))
        for r in data.get("roads") or []:
            if r.get("n") in names and r.get("w", 0) >= 6 and len(r.get("p") or []) >= 2:
                roads.append(r)
    return roads


def load_buildings():
    out = []
    for fn in os.listdir(REAL):
        if not (fn.startswith("r_") and fn.endswith(".json")):
            continue
        rx, rz = (int(p) for p in fn[2:-5].split("_"))
        if not (1 <= rx <= 3 and 1 <= rz <= 5):
            continue
        data = json.load(open(os.path.join(REAL, fn)))
        for b in data.get("b") or []:
            poly = b.get("p") or []
            if len(poly) < 3:
                continue
            xs = [p[0] for p in poly]
            zs = [p[1] for p in poly]
            out.append(
                {
                    "i": b.get("i"),
                    "h": b.get("h") or 3.4,
                    "k": b.get("k") or "house",
                    "r": b.get("r") or "flat",
                    "p": poly,
                    "cx": sum(xs) / len(xs),
                    "cz": sum(zs) / len(zs),
                }
            )
    return out


def road_x(roads, z, names: set[str]):
    best = None
    for r in roads:
        if r["n"] not in names:
            continue
        p = r["p"]
        for a, b in zip(p, p[1:]):
            z0, z1 = a[1], b[1]
            if abs(z1 - z0) < 0.25:
                continue
            if (z - z0) * (z - z1) > 0:
                continue
            t = (z - z0) / (z1 - z0)
            if t < -0.001 or t > 1.001:
                continue
            x = a[0] + t * (b[0] - a[0])
            if best is None or x < best[0]:
                best = (x, r["w"], r["n"])
    return best


def dist_roads(roads, x, z, names: set[str] | None = None) -> float:
    best = 1e9
    for r in roads:
        if names and r["n"] not in names:
            continue
        p = r["p"]
        for a, b in zip(p, p[1:]):
            dx, dz = b[0] - a[0], b[1] - a[1]
            L2 = dx * dx + dz * dz
            if L2 < 1e-6:
                d = math.hypot(x - a[0], z - a[1])
            else:
                t = max(0.0, min(1.0, ((x - a[0]) * dx + (z - a[1]) * dz) / L2))
                d = math.hypot(x - (a[0] + t * dx), z - (a[1] + t * dz))
            if d < best:
                best = d
    return best


def _sub(a, b):
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])


def _cross(u, v):
    return (
        u[1] * v[2] - u[2] * v[1],
        u[2] * v[0] - u[0] * v[2],
        u[0] * v[1] - u[1] * v[0],
    )


def _dot(u, v):
    return u[0] * v[0] + u[1] * v[1] + u[2] * v[2]


def _norm(v):
    L = math.sqrt(_dot(v, v))
    if L < 1e-12:
        return (0.0, 1.0, 0.0), 0.0
    return (v[0] / L, v[1] / L, v[2] / L), L


def basis(d):
    d, L = _norm(d)
    helper = (1.0, 0.0, 0.0) if abs(d[1]) > 0.85 else (0.0, 1.0, 0.0)
    s, _ = _norm(_cross(d, helper))
    u, _ = _norm(_cross(s, d))
    return d, s, u, L


class B:
    def __init__(self, ox, oz, y0):
        self.ox, self.oz, self.y0 = ox, oz, y0
        self.mats = []
        self.mi = {}
        self.prim = defaultdict(lambda: {"p": [], "n": [], "i": []})
        self.tris = [0, 0]

    def mat(self, name, rgb, rough=0.86):
        if name not in self.mi:
            self.mi[name] = len(self.mats)
            self.mats.append((name, rgb, rough))
        return name

    def tri(self, lod, mat, a, b, c, outward):
        ab, ac = _sub(b, a), _sub(c, a)
        n = _cross(ab, ac)
        ln = math.sqrt(_dot(n, n))
        if ln < 1e-8:
            return
        if _dot(n, outward) < 0:
            b, c = c, b
            n = (-n[0], -n[1], -n[2])
        n = (n[0] / ln, n[1] / ln, n[2] / ln)
        prim = self.prim[(lod, mat)]
        base = len(prim["p"]) // 3
        for p in (a, b, c):
            prim["p"] += (p[0] - self.ox, p[1] - self.y0, p[2] - self.oz)
            prim["n"] += n
        prim["i"] += (base, base + 1, base + 2)
        self.tris[lod] += 1

    def quad(self, lod, mat, pts, outward):
        self.tri(lod, mat, pts[0], pts[1], pts[2], outward)
        self.tri(lod, mat, pts[0], pts[2], pts[3], outward)

    def box(self, lod, mat, x0, y0, z0, x1, y1, z1):
        if x1 < x0:
            x0, x1 = x1, x0
        if y1 < y0:
            y0, y1 = y1, y0
        if z1 < z0:
            z0, z1 = z1, z0
        if x1 - x0 < 1e-4 or y1 - y0 < 1e-4 or z1 - z0 < 1e-4:
            return
        self.quad(lod, mat, [(x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1)], (0, 0, 1))
        self.quad(lod, mat, [(x1, y0, z0), (x0, y0, z0), (x0, y1, z0), (x1, y1, z0)], (0, 0, -1))
        self.quad(lod, mat, [(x1, y0, z1), (x1, y0, z0), (x1, y1, z0), (x1, y1, z1)], (1, 0, 0))
        self.quad(lod, mat, [(x0, y0, z0), (x0, y0, z1), (x0, y1, z1), (x0, y1, z0)], (-1, 0, 0))
        self.quad(lod, mat, [(x0, y1, z1), (x1, y1, z1), (x1, y1, z0), (x0, y1, z0)], (0, 1, 0))
        self.quad(lod, mat, [(x0, y0, z0), (x1, y0, z0), (x1, y0, z1), (x0, y0, z1)], (0, -1, 0))

    def box_yaw(self, lod, mat, cx, y0, cz, hx, hy, hz, yaw):
        if hx < 1e-4 or hy < 1e-4 or hz < 1e-4:
            return
        c, s = math.cos(yaw), math.sin(yaw)

        def p(lx, ly, lz):
            return (cx + lx * c - lz * s, y0 + ly, cz + lx * s + lz * c)

        v = [
            p(-hx, 0, -hz),
            p(hx, 0, -hz),
            p(hx, hy, -hz),
            p(-hx, hy, -hz),
            p(-hx, 0, hz),
            p(hx, 0, hz),
            p(hx, hy, hz),
            p(-hx, hy, hz),
        ]
        right = (c, 0, s)
        fwd = (-s, 0, c)
        self.quad(lod, mat, [v[4], v[5], v[6], v[7]], fwd)
        self.quad(lod, mat, [v[1], v[0], v[3], v[2]], (-fwd[0], 0, -fwd[2]))
        self.quad(lod, mat, [v[5], v[1], v[2], v[6]], right)
        self.quad(lod, mat, [v[0], v[4], v[7], v[3]], (-right[0], 0, -right[2]))
        self.quad(lod, mat, [v[3], v[7], v[6], v[2]], (0, 1, 0))
        self.quad(lod, mat, [v[0], v[1], v[5], v[4]], (0, -1, 0))

    def cyl(self, lod, mat, cx, y0, cz, r0, y1, r1, sides):
        if abs(y1 - y0) < 1e-4 or (r0 < 1e-4 and r1 < 1e-4):
            return
        a0, a1 = [], []
        for i in range(sides):
            t = math.tau * i / sides
            ct, st = math.cos(t), math.sin(t)
            a0.append((cx + ct * r0, y0, cz + st * r0))
            a1.append((cx + ct * r1, y1, cz + st * r1))
        for i in range(sides):
            j = (i + 1) % sides
            mx = (a0[i][0] + a0[j][0]) * 0.5 - cx
            mz = (a0[i][2] + a0[j][2]) * 0.5 - cz
            self.quad(lod, mat, [a0[i], a0[j], a1[j], a1[i]], (mx, 0, mz))
        c0 = (cx, y0, cz)
        c1 = (cx, y1, cz)
        if r0 > 1e-3:
            for i in range(sides):
                j = (i + 1) % sides
                self.tri(lod, mat, c0, a0[j], a0[i], (0, -1, 0))
        if r1 > 1e-3:
            for i in range(sides):
                j = (i + 1) % sides
                self.tri(lod, mat, c1, a1[i], a1[j], (0, 1, 0))

    def beam(self, lod, mat, p0, p1, rx, ry):
        d, s, u, L = basis(_sub(p1, p0))
        if L < 1e-4 or rx < 1e-4 or ry < 1e-4:
            return

        def ring(p):
            return [
                (p[0] + s[0] * rx + u[0] * ry, p[1] + s[1] * rx + u[1] * ry, p[2] + s[2] * rx + u[2] * ry),
                (p[0] - s[0] * rx + u[0] * ry, p[1] - s[1] * rx + u[1] * ry, p[2] - s[2] * rx + u[2] * ry),
                (p[0] - s[0] * rx - u[0] * ry, p[1] - s[1] * rx - u[1] * ry, p[2] - s[2] * rx - u[2] * ry),
                (p[0] + s[0] * rx - u[0] * ry, p[1] + s[1] * rx - u[1] * ry, p[2] + s[2] * rx - u[2] * ry),
            ]

        r0, r1 = ring(p0), ring(p1)
        for i in range(4):
            j = (i + 1) % 4
            mid = (
                (r0[i][0] + r0[j][0] + r1[i][0] + r1[j][0]) * 0.25,
                (r0[i][1] + r0[j][1] + r1[i][1] + r1[j][1]) * 0.25,
                (r0[i][2] + r0[j][2] + r1[i][2] + r1[j][2]) * 0.25,
            )
            outward = _sub(mid, ((p0[0] + p1[0]) * 0.5, (p0[1] + p1[1]) * 0.5, (p0[2] + p1[2]) * 0.5))
            self.quad(lod, mat, [r0[i], r0[j], r1[j], r1[i]], outward)
        self.quad(lod, mat, [r0[0], r0[3], r0[2], r0[1]], (-d[0], -d[1], -d[2]))
        self.quad(lod, mat, [r1[0], r1[1], r1[2], r1[3]], d)

    def deck(self, lod, mat, cx, y, cz, rin, rout, sides, thick):
        if rout - rin < 1e-3 or thick < 1e-3:
            return
        y0, y1 = y, y + thick
        outer0, outer1, inner0, inner1 = [], [], [], []
        for i in range(sides):
            t = math.tau * i / sides
            ct, st = math.cos(t), math.sin(t)
            outer0.append((cx + ct * rout, y0, cz + st * rout))
            outer1.append((cx + ct * rout, y1, cz + st * rout))
            inner0.append((cx + ct * rin, y0, cz + st * rin))
            inner1.append((cx + ct * rin, y1, cz + st * rin))
        for i in range(sides):
            j = (i + 1) % sides
            self.quad(lod, mat, [outer1[i], outer1[j], inner1[j], inner1[i]], (0, 1, 0))
            self.quad(lod, mat, [outer0[j], outer0[i], inner0[i], inner0[j]], (0, -1, 0))
            mx = (outer0[i][0] + outer0[j][0]) * 0.5 - cx
            mz = (outer0[i][2] + outer0[j][2]) * 0.5 - cz
            self.quad(lod, mat, [outer0[i], outer0[j], outer1[j], outer1[i]], (mx, 0, mz))
            self.quad(lod, mat, [inner0[j], inner0[i], inner1[i], inner1[j]], (-mx, 0, -mz))

    def extrude(self, lod, mat, poly, y0, y1, top=True):
        if y1 - y0 < 1e-3 or len(poly) < 3:
            return
        area = 0.0
        for i in range(len(poly)):
            a, b = poly[i], poly[(i + 1) % len(poly)]
            area += a[0] * b[1] - b[0] * a[1]
        if area < 0:
            poly = list(reversed(poly))
        n = len(poly)
        for i in range(n):
            a, b = poly[i], poly[(i + 1) % n]
            dx, dz = b[0] - a[0], b[1] - a[1]
            if dx * dx + dz * dz < 0.04:
                continue
            outward = (dz, 0, -dx)
            self.quad(
                lod,
                mat,
                [(a[0], y0, a[1]), (b[0], y0, b[1]), (b[0], y1, b[1]), (a[0], y1, a[1])],
                outward,
            )
        if top:
            cx = sum(p[0] for p in poly) / n
            cz = sum(p[1] for p in poly) / n
            for i in range(n):
                a, b = poly[i], poly[(i + 1) % n]
                self.tri(lod, mat, (cx, y1, cz), (a[0], y1, a[1]), (b[0], y1, b[1]), (0, 1, 0))

    def hip(self, lod, mat, poly, y_eave, rise):
        area = 0.0
        for i in range(len(poly)):
            a, bpt = poly[i], poly[(i + 1) % len(poly)]
            area += a[0] * bpt[1] - bpt[0] * a[1]
        if area < 0:
            poly = list(reversed(poly))
        n = len(poly)
        cx = sum(p[0] for p in poly) / n
        cz = sum(p[1] for p in poly) / n
        inner = [(cx + (p[0] - cx) * 0.45, cz + (p[1] - cz) * 0.45) for p in poly]
        yt = y_eave + rise
        for i in range(n):
            j = (i + 1) % n
            self.quad(
                lod,
                mat,
                [
                    (poly[i][0], y_eave, poly[i][1]),
                    (poly[j][0], y_eave, poly[j][1]),
                    (inner[j][0], yt, inner[j][1]),
                    (inner[i][0], yt, inner[i][1]),
                ],
                (0, 1, 0),
            )
        for i in range(n):
            j = (i + 1) % n
            self.tri(
                lod,
                mat,
                (cx, yt, cz),
                (inner[i][0], yt, inner[i][1]),
                (inner[j][0], yt, inner[j][1]),
                (0, 1, 0),
            )

    def save(self, path, node):
        prims = []
        blob = bytearray()
        views = []
        accs = []

        def push(data: bytes, target):
            while len(blob) % 4:
                blob.append(0)
            off = len(blob)
            blob.extend(data)
            views.append({"buffer": 0, "byteOffset": off, "byteLength": len(data), "target": target})
            return len(views) - 1

        materials = []
        for name, rgb, rough in self.mats:
            materials.append(
                {
                    "name": name,
                    "doubleSided": False,
                    "pbrMetallicRoughness": {
                        "baseColorFactor": [rgb[0], rgb[1], rgb[2], 1],
                        "metallicFactor": 0,
                        "roughnessFactor": rough,
                    },
                }
            )
        meshes = []
        nodes = []
        for lod in (0, 1):
            mprims = []
            for (plod, mat), prim in self.prim.items():
                if plod != lod or len(prim["i"]) < 3:
                    continue
                pos = struct.pack("<" + "f" * len(prim["p"]), *prim["p"])
                nrm = struct.pack("<" + "f" * len(prim["n"]), *prim["n"])
                idx = struct.pack("<" + "H" * len(prim["i"]), *prim["i"])
                pv = push(pos, 34962)
                nv = push(nrm, 34962)
                iv = push(idx, 34963)
                xs = prim["p"][0::3]
                ys = prim["p"][1::3]
                zs = prim["p"][2::3]
                pa = {
                    "bufferView": pv,
                    "componentType": 5126,
                    "count": len(xs),
                    "type": "VEC3",
                    "min": [min(xs), min(ys), min(zs)],
                    "max": [max(xs), max(ys), max(zs)],
                }
                na = {"bufferView": nv, "componentType": 5126, "count": len(xs), "type": "VEC3"}
                ia = {"bufferView": iv, "componentType": 5123, "count": len(prim["i"]), "type": "SCALAR"}
                accs.extend((pa, na, ia))
                mprims.append(
                    {
                        "attributes": {"POSITION": len(accs) - 3, "NORMAL": len(accs) - 2},
                        "indices": len(accs) - 1,
                        "material": self.mi[mat],
                    }
                )
            if not mprims:
                raise SystemExit(f"{node} lod{lod} has no triangles")
            meshes.append({"name": f"{node}_lod{lod}", "primitives": mprims})
            nodes.append({"name": f"{node}_lod{lod}", "mesh": lod})
        gltf = {
            "asset": {"version": "2.0", "generator": "tools/nw-coast/build_coast.py"},
            "scene": 0,
            "scenes": [{"nodes": [0, 1], "name": node}],
            "nodes": nodes,
            "meshes": meshes,
            "materials": materials,
            "accessors": accs,
            "bufferViews": views,
            "buffers": [{"byteLength": len(blob)}],
        }
        js = json.dumps(gltf, separators=(",", ":")).encode("utf-8")
        js += b" " * ((4 - len(js) % 4) % 4)
        binb = bytes(blob)
        binb += b"\x00" * ((4 - len(binb) % 4) % 4)
        total = 12 + 8 + len(js) + 8 + len(binb)
        out = struct.pack("<4sII", b"glTF", 2, total)
        out += struct.pack("<I4s", len(js), b"JSON") + js
        out += struct.pack("<I4s", len(binb), b"BIN\x00") + binb
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as f:
            f.write(out)
        return self.tris

    def save_packed(self, path, node):
        """One geometry and one shared material per LOD, no textures.

        A material used to be its own primitive, so a phone that first drew the
        hidden LOD during the measured loops uploaded about thirty geometries at
        once. Vertex colours keep the paint on a single mesh. The index buffer
        stays under the UNSIGNED_SHORT cap; a slice that would not fit is rejected
        rather than split back into extra geometries.
        """
        blob = bytearray()
        views = []
        accs = []

        def push(data: bytes, target):
            while len(blob) % 4:
                blob.append(0)
            off = len(blob)
            blob.extend(data)
            views.append({"buffer": 0, "byteOffset": off, "byteLength": len(data), "target": target})
            return len(views) - 1

        rgb = {name: colour for name, colour, _rough in self.mats}
        materials = [
            {
                "name": "shared",
                "doubleSided": False,
                "pbrMetallicRoughness": {
                    "baseColorFactor": [1, 1, 1, 1],
                    "metallicFactor": 0,
                    "roughnessFactor": 0.86,
                },
            }
        ]
        meshes = []
        nodes = []
        for lod in (0, 1):
            pos, nrm, col, idx = [], [], [], []
            for (plod, mat), prim in self.prim.items():
                if plod != lod or len(prim["i"]) < 3:
                    continue
                base = len(pos) // 3
                pos.extend(prim["p"])
                nrm.extend(prim["n"])
                col.extend(rgb[mat] * (len(prim["p"]) // 3))
                idx.extend(i + base for i in prim["i"])
            if len(idx) < 3:
                raise SystemExit(f"{node} lod{lod} has no triangles")
            if len(idx) > 65535:
                raise SystemExit(f"{node} lod{lod} has {len(idx)} indices")
            pv = push(struct.pack("<" + "f" * len(pos), *pos), 34962)
            nv = push(struct.pack("<" + "f" * len(nrm), *nrm), 34962)
            cv = push(struct.pack("<" + "f" * len(col), *col), 34962)
            iv = push(struct.pack("<" + "H" * len(idx), *idx), 34963)
            xs, ys, zs = pos[0::3], pos[1::3], pos[2::3]
            cs = (col[0::3], col[1::3], col[2::3])
            pa = {
                "bufferView": pv,
                "componentType": 5126,
                "count": len(xs),
                "type": "VEC3",
                "min": [min(xs), min(ys), min(zs)],
                "max": [max(xs), max(ys), max(zs)],
            }
            na = {"bufferView": nv, "componentType": 5126, "count": len(xs), "type": "VEC3"}
            # min/max marks this as not a normal stream (check_glb treats bare VEC3 as normals)
            ca = {
                "bufferView": cv,
                "componentType": 5126,
                "count": len(xs),
                "type": "VEC3",
                "min": [min(cs[0]), min(cs[1]), min(cs[2])],
                "max": [max(cs[0]), max(cs[1]), max(cs[2])],
            }
            ia = {"bufferView": iv, "componentType": 5123, "count": len(idx), "type": "SCALAR"}
            accs.extend((pa, na, ca, ia))
            base_acc = len(accs) - 4
            meshes.append(
                {
                    "name": f"{node}_lod{lod}",
                    "primitives": [
                        {
                            "attributes": {
                                "POSITION": base_acc,
                                "NORMAL": base_acc + 1,
                                "COLOR_0": base_acc + 2,
                            },
                            "indices": base_acc + 3,
                            "material": 0,
                        }
                    ],
                }
            )
            nodes.append({"name": f"{node}_lod{lod}", "mesh": lod})
        gltf = {
            "asset": {"version": "2.0", "generator": "tools/nw-coast/build_coast.py save_packed"},
            "scene": 0,
            "scenes": [{"nodes": [0, 1], "name": node}],
            "nodes": nodes,
            "meshes": meshes,
            "materials": materials,
            "accessors": accs,
            "bufferViews": views,
            "buffers": [{"byteLength": len(blob)}],
        }
        js = json.dumps(gltf, separators=(",", ":")).encode("utf-8")
        js += b" " * ((4 - len(js) % 4) % 4)
        binb = bytes(blob)
        binb += b"\x00" * ((4 - len(binb) % 4) % 4)
        total = 12 + 8 + len(js) + 8 + len(binb)
        out = struct.pack("<4sII", b"glTF", 2, total)
        out += struct.pack("<I4s", len(js), b"JSON") + js
        out += struct.pack("<I4s", len(binb), b"BIN\x00") + binb
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "wb") as f:
            f.write(out)
        return self.tris


# ---------------------------------------------------------------------------
# colours
# ---------------------------------------------------------------------------

STONE = (0.83, 0.78, 0.68)
STONE_D = (0.58, 0.54, 0.47)
WHITE = (0.93, 0.91, 0.86)
DOME = (0.16, 0.17, 0.18)
GLASS = (0.50, 0.66, 0.74)
DOOR = (0.28, 0.20, 0.14)
RAIL = (0.90, 0.90, 0.86)
ROCK = (0.62, 0.58, 0.51)
ROCK_W = (0.46, 0.44, 0.40)
CONC = (0.74, 0.73, 0.69)
SAND = (0.90, 0.86, 0.74)
THATCH = (0.66, 0.50, 0.28)
WOOD = (0.40, 0.30, 0.20)
CORAL = (0.76, 0.70, 0.60)
TERR = (0.58, 0.30, 0.20)
WIN = (0.22, 0.28, 0.34)
LEAF = (0.28, 0.46, 0.24)
LEAF_D = (0.18, 0.34, 0.16)
CACT = (0.36, 0.50, 0.30)
TRUNK = (0.42, 0.32, 0.22)
BUOY = (0.93, 0.72, 0.08)
BUOY_W = (0.94, 0.94, 0.92)
SPAR = (0.75, 0.76, 0.78)
WALLS = [
    (0.93, 0.91, 0.86),
    (0.90, 0.87, 0.80),
    (0.86, 0.82, 0.74),
    (0.94, 0.90, 0.80),
    (0.82, 0.80, 0.74),
    (0.91, 0.86, 0.78),
]
HUTS = [
    (0.45, 0.62, 0.70),
    (0.78, 0.66, 0.32),
    (0.88, 0.85, 0.78),
    (0.40, 0.52, 0.38),
    (0.60, 0.46, 0.32),
    (0.48, 0.68, 0.66),
    (0.72, 0.52, 0.40),
    (0.80, 0.74, 0.62),
]
KITES = [
    (0.85, 0.18, 0.16),
    (0.95, 0.78, 0.12),
    (0.15, 0.62, 0.78),
    (0.85, 0.28, 0.55),
]
# Dried palm is much darker than a beach umbrella. The skirt band is the shadowed edge.
THATCH_D = (0.32, 0.18, 0.07)
THATCH_E = (0.16, 0.09, 0.04)
FRAME_C = (0.94, 0.93, 0.88)
SHUTTER = (0.20, 0.36, 0.26)
RUST = (0.36, 0.18, 0.09)
RUST_D = (0.22, 0.12, 0.07)
SPONGE = (0.72, 0.42, 0.22)
GRAVEL = (0.55, 0.53, 0.48)
STALL = (0.88, 0.86, 0.78)
BOARD = (0.86, 0.89, 0.90)
LINE_C = (0.10, 0.10, 0.11)


def add_buoy(b: B, x, z, scale=1.0, lod1=True):
    """Float plus a tall spar. The sea draws over anything under the horizon, so the spar has to reach the sky."""
    y = 0.45
    r = 0.62 * scale
    b.cyl(0, "buoy", x, y - 0.02, z, r, y + r * 0.95, r * 0.9, 10)
    b.cyl(0, "buoyw", x, y + r * 0.18, z, r * 1.05, y + r * 0.5, r * 1.05, 10)
    top = y + 3.6 * scale
    b.beam(0, "spar", (x, y + r * 0.3, z), (x, top, z), 0.045 * max(scale, 0.8), 0.045 * max(scale, 0.8))
    b.box(0, "buoy", x, top - 0.7 * scale, z - 0.02, x + 0.55 * scale, top - 0.08, z + 0.02)
    if lod1:
        s = max(r, 0.45)
        b.box(1, "buoy", x - s, y, z - s, x + s, y + s * 1.2, z + s)
        b.box(1, "spar", x - 0.08, y + s, z - 0.08, x + 0.08, top, z + 0.08)


def add_divi(b: B, x, z, lean=1.7, h=3.4, yaw=math.pi):
    g = height(x, z)
    top = (x + math.cos(yaw) * lean, g + h, z + math.sin(yaw) * lean)
    b.beam(0, "trunk", (x, g - 0.15, z), top, 0.11, 0.10)
    b.beam(1, "trunk", (x, g - 0.1, z), top, 0.14, 0.12)
    for k, spread in enumerate((-0.5, -0.15, 0.2, 0.55)):
        leaf = (0.34, 0.48, 0.26) if k % 2 == 0 else LEAF_D
        name = f"leaf{k % 2}"
        b.mat(name, leaf)
        tip = (
            top[0] + math.cos(yaw) * (1.5 + k * 0.25) + math.cos(yaw + 1.57) * spread,
            top[1] + 0.15 + 0.08 * k,
            top[2] + math.sin(yaw) * (1.5 + k * 0.25) + math.sin(yaw + 1.57) * spread,
        )
        b.beam(0, name, (top[0], top[1] - 0.05, top[2]), tip, 0.55, 0.08)
        if k % 2 == 0:
            b.beam(1, name, (top[0], top[1], top[2]), tip, 0.4, 0.1)


def add_cactus(b: B, x, z, h=2.3, arms=2):
    g = height(x, z)
    b.cyl(0, "cact", x, g - 0.1, z, 0.16, g + h, 0.12, 7)
    b.cyl(1, "cact", x, g, z, 0.16, g + h * 0.85, 0.12, 5)
    for i in range(arms):
        ang = i * 2.2 + 0.4
        y = g + h * (0.42 + 0.12 * i)
        tip = (x + math.cos(ang) * 0.55, y + 0.65, z + math.sin(ang) * 0.55)
        b.beam(0, "cact", (x, y, z), tip, 0.09, 0.08)
        b.beam(0, "cact", tip, (tip[0], tip[1] + 0.55, tip[2]), 0.08, 0.07)


def add_grape(b: B, x, z, s=1.0):
    g = height(x, z)
    b.beam(0, "trunk", (x, g - 0.1, z), (x, g + 0.55 * s, z), 0.06, 0.06)
    clumps = [(0, 0.7), (0.55, 0.45), (-0.5, 0.4), (0.15, 0.95), (-0.2, 0.35)]
    for i, (dx, dy) in enumerate(clumps):
        name = "leaf0" if i % 2 == 0 else "leaf1"
        b.mat(name, LEAF if i % 2 == 0 else LEAF_D)
        b.box(
            0,
            name,
            x + dx * s - 0.55 * s,
            g + dy * s,
            z - 0.45 * s,
            x + dx * s + 0.55 * s,
            g + dy * s + 0.42 * s,
            z + 0.45 * s,
        )
    b.box(1, "leaf0", x - 0.7 * s, g + 0.3 * s, z - 0.5 * s, x + 0.7 * s, g + 1.15 * s, z + 0.5 * s)


def add_kite(b: B, x, z, color_name, rgb, yaw):
    b.mat(color_name, rgb, 0.6)
    g = height(x, z)
    b.beam(0, "wood", (x, g, z), (x, g + 2.5, z), 0.03, 0.03)
    n = (math.cos(yaw), 0.15, math.sin(yaw))
    top = (x, g + 3.15, z)
    bot = (x, g + 1.35, z)
    left = (x + math.sin(yaw) * 0.75, g + 2.15, z - math.cos(yaw) * 0.75)
    right = (x - math.sin(yaw) * 0.75, g + 2.15, z + math.cos(yaw) * 0.75)
    for sgn, lift in ((1, 0.0), (-1, 0.03)):
        off = (n[0] * lift * sgn, n[1] * lift * sgn, n[2] * lift * sgn)
        pts = [tuple(p[k] + off[k] for k in range(3)) for p in (top, left, bot, right)]
        outward = (n[0] * sgn, n[1] * sgn, n[2] * sgn)
        b.tri(0, color_name, pts[0], pts[1], pts[2], outward)
        b.tri(0, color_name, pts[0], pts[2], pts[3], outward)
    b.box(1, color_name, x - 0.2, g + 1.4, z - 0.2, x + 0.2, g + 3.0, z + 0.2)


def add_hut(b: B, x, z, yaw, wall, roof_mat, roof_rgb):
    b.mat(wall, wall if False else HUTS[0])  # placeholder overwritten below
    g = height(x, z)
    # wall name is a colour key already registered by the caller
    b.box_yaw(0, wall, x, g - 0.2, z, 2.3, 2.35, 1.55, yaw)
    b.box_yaw(0, roof_mat, x, g + 2.15, z, 2.6, 0.45, 1.85, yaw)
    # door on the sea side (-X before yaw). yaw 0 means long axis along Z, sea is -X.
    c, s = math.cos(yaw), math.sin(yaw)
    dx, dz = -c, -s
    b.box(
        0,
        "door",
        x + dx * 1.45 - 0.35,
        g,
        z + dz * 1.45 - 0.28,
        x + dx * 1.62 + 0.35,
        g + 1.5,
        z + dz * 1.62 + 0.28,
    )
    b.box_yaw(1, wall, x, g, z, 2.3, 2.5, 1.55, yaw)


def sand_sheet(b: B, mat, x0, z0, x1, z1, step, hmin, hmax, near_roads, roads, road_names):
    x = x0
    while x < x1:
        z = z0
        while z < z1:
            samples = [
                height(x, z),
                height(x + step, z),
                height(x + step, z + step),
                height(x, z + step),
            ]
            if max(samples) <= hmax and min(samples) >= hmin and max(samples) - min(samples) < 1.1:
                cx, cz = x + step * 0.5, z + step * 0.5
                if dist_roads(roads, cx, cz, road_names) > 8.0:
                    lift = 0.07
                    top = [
                        (x, samples[0] + lift, z),
                        (x + step, samples[1] + lift, z),
                        (x + step, samples[2] + lift, z + step),
                        (x, samples[3] + lift, z + step),
                    ]
                    bot = [(p[0], p[1] - 0.1, p[2]) for p in top]
                    b.quad(0, mat, top, (0, 1, 0))
                    b.quad(0, mat, [bot[0], bot[3], bot[2], bot[1]], (0, -1, 0))
            z += step
        x += step


def steps_west(b: B, x, z, n, run, width, rise):
    """Thin treads descending west. Thickness stays at the riser so a steep DEM cannot turn a step into a pillar."""
    prev = None
    thick = max(0.28, rise)
    for i in range(n):
        x1 = x - i * run
        x0 = x1 - run
        g_back = height(x1, z)
        g_mid = height((x0 + x1) * 0.5, z)
        top = max(g_back, g_mid) + 0.04
        if prev is not None:
            top = min(top, prev - 0.05)
        if top < 0.16:
            break
        bot = top - thick
        b.box(0, "conc", x0, bot, z - width / 2, x1, top, z + width / 2)
        b.box(1, "conc", x0, bot, z - width / 2, x1, top, z + width / 2)
        prev = top


def stair_flight(b: B, z, x_top, run=0.30, width=2.5, max_n=18):
    """One westbound flight, seated on the terrain mesh, with cheek walls and a north rail.

    Each tread's top is the mesh under that tread, so the flight follows the
    cliff instead of stopping on the gentle shelf above it. Thickness is capped
    so a steep face cannot extrude the step into a pillar down to the seabed.
    Returns (count, x of the west edge, top of the lowest tread).
    """
    x1 = x_top
    prev = None
    placed = []
    for i in range(max_n):
        x0 = x1 - run
        # Seat the tread on the high (east) edge so the nose projects over the drop.
        # Using the low edge buried every tread inside the cliff face.
        backs = [mesh_height(x1 - 0.04, z + width * fz) for fz in (-0.28, 0.0, 0.28)]
        fronts = [mesh_height(x0 + 0.04, z + width * fz) for fz in (-0.28, 0.0, 0.28)]
        back, front = min(backs), min(fronts)
        top = back + 0.05
        if prev is not None:
            top = min(top, prev - 0.16)
            if top > back + 0.12:
                top = back + 0.05
        if top < 0.42:
            break
        rise = (prev - top) if prev is not None else max(0.18, top - front)
        thick = min(0.46, max(0.18, rise if rise > 0.05 else 0.18))
        bot = top - thick
        bot = max(bot, min(front, back) - 0.08)
        if top - bot < 0.14:
            bot = top - 0.14
        b.box(0, "conc", x0, bot, z - width / 2, x1, top, z + width / 2)
        if i % 2 == 0:
            b.box(1, "conc", x0, bot, z - width / 2, x1, top, z + width / 2)
        # A low curb, so the treads stay the thing you see.
        curb = top + 0.18
        for side in (-1, 1):
            zs = z + side * (width / 2 + 0.06)
            b.box(0, "conc", x0, top - 0.02, zs - 0.055, x1, curb, zs + 0.055)
        placed.append((x0, x1, top, bot))
        prev = top
        x1 = x0
    if not placed:
        return 0, x_top, height(x_top, z)
    # top landing, so the flight starts as a step off the cliff path
    x_back, top0 = placed[0][1], placed[0][2]
    b.box(0, "conc", x_back, top0 - 0.28, z - width / 2, x_back + 0.9, top0, z + width / 2)
    b.box(1, "conc", x_back, top0 - 0.22, z - width / 2, x_back + 0.8, top0, z + width / 2)
    # north handrail (north is -z), one rail the way the snorkel entry is built
    zrail = z - width / 2 - 0.22
    p0 = (placed[0][1] + 0.15, placed[0][2] + 0.95, zrail)
    p1 = (placed[-1][0] + 0.05, placed[-1][2] + 0.95, zrail)
    b.beam(0, "rail", p0, p1, 0.035, 0.028)
    for i in range(0, len(placed), 3):
        x0, x1s, top, _bot = placed[i]
        xm = (x0 + x1s) * 0.5
        b.beam(0, "rail", (xm, top + 0.02, zrail), (xm, top + 0.95, zrail), 0.025, 0.025)
        b.box(1, "rail", xm - 0.04, top + 0.15, zrail - 0.04, xm + 0.04, top + 0.95, zrail + 0.04)
    print(
        f"  flight n={len(placed)} x {placed[0][1]:.2f}->{placed[-1][0]:.2f} "
        f"top {placed[0][2]:.2f}->{placed[-1][2]:.2f}"
    )
    return len(placed), placed[-1][0], placed[-1][2]


def add_palapa(b: B, x, z, yaw=0.0, span=2.15):
    """Open palm-thatch roof on posts, with a hanging skirt so it is not an umbrella."""
    g = height(x, z)
    c, s = math.cos(yaw), math.sin(yaw)
    arm = span * 0.72
    for sx, sz in ((-1, -1), (1, -1), (-1, 1), (1, 1)):
        px = x + sx * arm * c - sz * arm * s
        pz = z + sx * arm * s + sz * arm * c
        b.cyl(0, "wood", px, g - 0.2, pz, 0.10, g + 2.35, 0.07, 6)
    e = span
    roof = [
        (x - e * c + e * s, z - e * s - e * c),
        (x + e * c + e * s, z + e * s - e * c),
        (x + e * c - e * s, z + e * s + e * c),
        (x - e * c - e * s, z - e * s + e * c),
    ]
    b.hip(0, "thatchd", roof, g + 2.28, 1.05)
    # dark ceiling, so the underside is thatch rather than a hole
    b.box_yaw(0, "thatche", x, g + 2.12, z, span * 0.78, 0.07, span * 0.78, yaw)
    skirt = 0.78
    for i in range(4):
        a, cpt = roof[i], roof[(i + 1) % 4]
        mx, mz = (a[0] + cpt[0]) * 0.5, (a[1] + cpt[1]) * 0.5
        dx, dz = cpt[0] - a[0], cpt[1] - a[1]
        L = math.hypot(dx, dz) or 1.0
        ox, oz = dz / L, -dx / L
        b.box_yaw(0, "thatche", mx + ox * 0.08, g + 2.28 - skirt, mz + oz * 0.08, L * 0.5 + 0.1, skirt, 0.12, math.atan2(dz, dx))
    b.box_yaw(1, "thatchd", x, g + 2.2, z, span * 0.95, 0.85, span * 0.95, yaw)


def add_beach_hut(b: B, x, z, yaw, wall):
    """Walled beach hut with a thatch hip, distinct from the open palapas."""
    g = height(x, z)
    b.box_yaw(0, wall, x, g - 0.15, z, 1.65, 2.25, 1.25, yaw)
    b.box_yaw(1, wall, x, g, z, 1.65, 2.3, 1.25, yaw)
    c, s = math.cos(yaw), math.sin(yaw)
    # door on the sea side
    b.box_yaw(0, "door", x - c * 1.58, g, z - s * 1.58, 0.06, 1.6, 0.36, yaw)
    e = 2.05
    roof = [
        (x - e * c + e * s, z - e * s - e * c),
        (x + e * c + e * s, z + e * s - e * c),
        (x + e * c - e * s, z + e * s + e * c),
        (x - e * c - e * s, z - e * s + e * c),
    ]
    b.hip(0, "thatchd", roof, g + 2.15, 0.85)
    for i in range(4):
        a, cpt = roof[i], roof[(i + 1) % 4]
        mx, mz = (a[0] + cpt[0]) * 0.5, (a[1] + cpt[1]) * 0.5
        dx, dz = cpt[0] - a[0], cpt[1] - a[1]
        L = math.hypot(dx, dz) or 1.0
        b.box_yaw(0, "thatche", mx, g + 1.72, mz, L * 0.5, 0.42, 0.09, math.atan2(dz, dx))


def add_opening(b: B, x, z, y, yaw):
    """Window on a wall: off-white frame, glass, two shutters swung open."""
    c, s = math.cos(yaw), math.sin(yaw)
    nx, nz = s, -c  # outward
    x += nx * 0.11
    z += nz * 0.11
    for side in (-1.0, 1.0):
        b.box_yaw(0, "frame", x + c * side * 0.46, y, z + s * side * 0.46, 0.05, 1.18, 0.055, yaw)
    b.box_yaw(0, "frame", x, y + 1.08, z, 0.51, 0.07, 0.055, yaw)
    b.box_yaw(0, "frame", x, y + 0.02, z, 0.51, 0.07, 0.055, yaw)
    b.box_yaw(0, "glass", x + nx * 0.025, y + 0.12, z + nz * 0.025, 0.38, 0.88, 0.018, yaw)
    open_ang = 0.65
    ca, sa = math.cos(open_ang), math.sin(open_ang)
    for side in (-1.0, 1.0):
        dx = side * c * ca + nx * sa
        dz = side * s * ca + nz * sa
        syaw = math.atan2(dz, dx)
        half = 0.22
        b.box_yaw(
            0,
            "shut",
            x + c * side * 0.52 + dx * half,
            y + 0.08,
            z + s * side * 0.52 + dz * half,
            half,
            1.02,
            0.028,
            syaw,
        )


def add_air_kite(b: B, x, z, color_name, alt, reach, side):
    """Static crescent facing the beach. A flat kite reads as a line from the sand."""
    g = height(x, z)
    kx = x - reach
    kz = z + side
    ky = alt
    b.beam(0, "line", (x, g + 1.0, z), (kx, ky - 1.4, kz), 0.016, 0.016)
    segs = 6
    span = 6.4
    lead, trail = [], []
    for i in range(segs + 1):
        t = i / segs
        zoff = (t - 0.5) * span
        # Pinched tips and a deep belly, so the silhouette is a crescent.
        belly = math.sin(t * math.pi)
        lead.append((kx + 0.4, ky + 1.15 + belly * 0.35, kz + zoff))
        trail.append((kx - 0.15, ky + 1.15 - belly * 2.5, kz + zoff * 0.92))
    for i in range(segs):
        b.quad(0, color_name, [lead[i], lead[i + 1], trail[i + 1], trail[i]], (1, 0.2, 0))
        b.quad(0, color_name, [lead[i + 1], lead[i], trail[i], trail[i + 1]], (-1, 0.2, 0))
    b.box(1, color_name, kx - 0.2, ky - 1.8, kz - 2.6, kx + 0.5, ky + 1.3, kz + 2.6)


def add_windsurf(b: B, x, z, color_name, yaw):
    """Board, mast and sail standing on the sand. No cloth simulation."""
    g = height(x, z)
    if g < 0.25:
        return False
    b.box_yaw(0, "board", x, g + 0.02, z, 1.35, 0.05, 0.28, yaw)
    b.box_yaw(1, "board", x, g + 0.02, z, 1.2, 0.08, 0.3, yaw)
    b.beam(0, "spar", (x, g + 0.08, z), (x, g + 4.15, z), 0.035, 0.035)
    c, s = math.cos(yaw + 1.15), math.sin(yaw + 1.15)
    top = (x + c * 0.1, g + 4.0, z + s * 0.1)
    foot = (x + c * 0.05, g + 0.5, z + s * 0.05)
    clew = (x + c * 1.7, g + 1.7, z + s * 1.7)
    outward = (s, 0.15, -c)
    b.tri(0, color_name, top, foot, clew, outward)
    b.tri(0, color_name, top, clew, foot, (-outward[0], -outward[1], -outward[2]))
    # boom
    b.beam(0, "spar", (x, g + 1.35, z), clew, 0.02, 0.02)
    return True


def add_wreck(b: B, ax, az, fx, fz):
    """SS Antilla on its port side, broken amidships. The game sea is opaque, so the upper rail, bridge and masts break the surface."""
    yaw = math.atan2(fz, fx)
    px, pz = -fz, fx

    def hull(along, side, half_l, y0, y1, half_b, mat, lods):
        cx = ax + fx * along + px * side
        cz = az + fz * along + pz * side
        for lod in lods:
            b.box_yaw(lod, mat, cx, y0, cz, half_l, y1 - y0, half_b, yaw)

    # Stern, a gap, then the bow (+along, toward the beach). Above water the
    # rail is narrow and broken, so it does not read as a floating dock.
    hull(-34, 1.6, 26, -1.6, 0.72, 1.15, "rust", (0, 1))
    hull(-34, -1.4, 22, -3.2, 0.22, 2.2, "rustd", (0,))
    hull(32, 1.5, 28, -1.5, 0.68, 1.1, "rust", (0, 1))
    hull(32, -1.3, 24, -3.0, 0.18, 2.1, "rustd", (0,))
    for along_d, y1, half in ((-48, 1.15, 2.2), (-18, 1.35, 3.0), (8, 1.05, 2.4), (40, 1.45, 2.8)):
        hull(along_d, 1.7, half, 0.35, y1, 0.7, "rustd", (0, 1))
    hull(48, 1.2, 3.6, 0.45, 2.35, 1.8, "rustd", (0, 1))
    for along_d, side, top in ((-22, 1.5, 4.6), (14, 1.4, 4.2), (-2, 0.8, 1.6)):
        cx = ax + fx * along_d + px * side
        cz = az + fz * along_d + pz * side
        mast_top = top + (1.6 if top > 3 else 0)
        b.beam(0, "spar", (cx, 0.35, cz), (cx, mast_top, cz), 0.16, 0.14)
        b.box(1, "spar", cx - 0.16, 0.45, cz - 0.16, cx + 0.16, mast_top, cz + 0.16)
        if top > 3:
            b.beam(0, "spar", (cx - px * 2.2, mast_top - 1.1, cz - pz * 2.2), (cx + px * 2.2, mast_top - 0.9, cz + pz * 2.2), 0.08, 0.06)
    for along_d in (-50, -24, -8, 12, 36, 55):
        cx = ax + fx * along_d + px * 2.2
        cz = az + fz * along_d + pz * 2.2
        b.box_yaw(0, "sponge", cx, 0.45, cz, 1.5, 0.36, 0.55, yaw)


def parking_pad(b, roads, x0, x1, z0, z1):
    """Gravel stalls between the coast road and the beach, following the slope, off the asphalt."""
    step_x, step_z = 8.0, 7.0
    cells = 0
    z = z0
    while z < z1 - 1:
        x = x0
        zz = min(z + step_z, z1)
        while x < x1 - 1:
            xx = min(x + step_x, x1)
            cx, cz = (x + xx) * 0.5, (z + zz) * 0.5
            if dist_roads(roads, cx, cz, COAST) < 7.0:
                x += step_x
                continue
            samples = [height(x, z), height(xx, z), height(xx, zz), height(x, zz)]
            if max(samples) - min(samples) > 1.4 or min(samples) < 1.2:
                x += step_x
                continue
            lift = 0.045
            top = [
                (x, samples[0] + lift, z),
                (xx, samples[1] + lift, z),
                (xx, samples[2] + lift, zz),
                (x, samples[3] + lift, zz),
            ]
            bot = [(p[0], p[1] - 0.08, p[2]) for p in top]
            b.quad(0, "gravel", top, (0, 1, 0))
            b.quad(0, "gravel", [bot[0], bot[3], bot[2], bot[1]], (0, -1, 0))
            cells += 1
            x += step_x
        # stall line across this row
        if dist_roads(roads, (x0 + x1) * 0.5, z, COAST) > 8.0:
            h0, h1 = height(x0, z), height(x1, z)
            b.beam(0, "stall", (x0, h0 + 0.07, z), (x1, h1 + 0.07, z), 0.035, 0.012)
        z += step_z
    if cells:
        g = height((x0 + x1) * 0.5, (z0 + z1) * 0.5)
        b.box(1, "gravel", x0, g - 0.1, z0, x1, g + 0.08, z1)
    return cells


def append_manifest(entries):
    """Append nw_ heroes without reformatting the entries already in the file."""
    raw = open(MANIFEST, encoding="utf-8").read()
    data = json.loads(raw)
    keep = [e for e in data if not str(e.get("id", "")).startswith("nw_")]
    m = re.search(r'\n\s*"id": "nw_', raw)
    if m is None:
        body = raw.rstrip()
        if not body.endswith("]"):
            raise SystemExit("manifest does not end with ]")
        body = body[:-1].rstrip()
        if not body.endswith("}"):
            raise SystemExit("manifest tail is not an object")
        prefix = body
    else:
        brace = raw.rfind("{", 0, m.start())
        comma = raw.rfind(",", 0, brace)
        if comma < 0:
            raise SystemExit("could not find the comma before nw_ entries")
        prefix = raw[:comma].rstrip()
    parts = []
    for e in entries:
        dumped = json.dumps(e, indent=1)
        parts.append("\n".join((" " + line) if line else line for line in dumped.split("\n")))
    out = prefix + ",\n" + ",\n".join(parts) + "\n]\n"
    parsed = json.loads(out)
    if parsed[: len(keep)] != keep:
        raise SystemExit("manifest prefix changed while appending nw_ entries")
    if len(parsed) != len(keep) + len(entries):
        raise SystemExit("manifest count mismatch")
    open(MANIFEST, "w", encoding="utf-8").write(out)


def rock_arm(b: B, x, z, dx, dz, n=4):
    for i in range(n):
        px = x + dx * i * 1.7
        pz = z + dz * i * 0.35 * (1 if i % 2 == 0 else -1)
        g = height(px, pz)
        if g < 0.05:
            continue
        yaw = 0.4 * i
        hx = 1.1 + (i % 3) * 0.25
        hy = 0.45 + (i % 2) * 0.35
        b.box_yaw(0, "rock" if i % 2 == 0 else "rockw", px, g - 0.15, pz, hx, hy, 0.8, yaw)
        if i % 2 == 0:
            b.box_yaw(1, "rock", px, g - 0.1, pz, hx, hy * 0.8, 0.8, yaw)


COAST = {
    "L.G. Smith Boulevard",
    "Hudishibana",
    "Avenida Nelson O. Oduber",
    "J.E. Irausquin Boulevard",
}
FRAME = (
    "glb origin = footprint centroid (world x,z); glTF +X = world x, +Z = world z, Y up; "
    "generated by tools/nw-coast/build_coast.py"
)


def entry(bid, x, z, tris, switch, refs, hide=None, y=0, name=None, k=None, new_place=False, cat="landmark"):
    e = {
        "id": bid,
        "k": k or bid,
        "status": "v1-nw-coast",
        "x": round(x, 2),
        "z": round(z, 2),
        "y": y,
        "rotation": 0,
        "glb": f"models/hero/{bid}.glb",
        "lod": {"hi": f"{bid}_lod0", "lo": f"{bid}_lod1", "switch_m": switch},
        "tris": {f"{bid}_lod0": tris[0], f"{bid}_lod1": tris[1]},
        "textures": 0,
        "hide_footprint": None,
        "hide": hide or [],
        "sign": False,
        "kind": "replace",
        "new_place": new_place,
        "geo_source": "OSM coastline and footprints, Aruba DEM (game height tiles)",
        "ref_sources": refs,
        "frame": FRAME,
        "cat": cat,
    }
    if name:
        e["name"] = name
    else:
        # Keep a readable label without creating a search pin. The loader adds a
        # pin whenever name is truthy and k is new, so scenery uses a blank name.
        e["name"] = ""
    if not new_place and k and name:
        # Attached to an existing landmark pin. Leaving sign out preserves that pin's sign.
        e.pop("sign", None)
    if new_place:
        e["sign"] = False
    return e


def build():
    roads = load_roads(COAST)
    buildings = load_buildings()
    entries = []

    # The monument tower already stands at the sea-shader point (-8840, -10365).
    # A second shaft on the DEM peak reads as a duplicate, so this pass keeps that
    # tower and only adds the dune scrub plus a low wall on the west viewpoint.
    node = ll(12.61377, -70.05135)
    best = None
    for dz in range(-36, 37, 2):
        for dx in range(-36, 37, 2):
            x, z = node[0] + dx, node[1] + dz
            h = height(x, z)
            if best is None or h > best[0]:
                best = (h, x, z)
    ox, oz = best[1], best[2]
    monument = (-8840.0, -10365.0)
    print(f"lighthouse hill {ox:.1f},{oz:.1f} h={best[0]:.2f} monument {monument[0]:.0f},{monument[1]:.0f}")
    tower_glb = os.path.join(HERO, "nw_lh_tower.glb")
    if os.path.exists(tower_glb):
        os.remove(tower_glb)


    # --- dune scrub around the hill, clear of the road, the lot, and the golf course ---
    b = B(ox, oz, best[0])
    b.mat("trunk", TRUNK, 0.9)
    b.mat("leaf0", LEAF, 0.85)
    b.mat("leaf1", LEAF_D, 0.85)
    b.mat("cact", CACT, 0.8)
    b.mat("stone", STONE, 0.92)
    # lot, coconut stand, and the existing monument shaft
    avoid = [(-8870, -10340, 28), (-8858, -10350, 8), (monument[0], monument[1], 11), (ox, oz, 6)]
    planted = {"divi": 0, "cact": 0, "grape": 0}
    for iz, z in enumerate(range(-10540, -10230, 16)):
        for ix, x in enumerate(range(-8960, -8740, 15)):
            if dist_roads(roads, x, z, COAST) < 9:
                continue
            if any(math.hypot(x - ax, z - az) < rad for ax, az, rad in avoid):
                continue
            h = height(x, z)
            if h < 7 or h > 31.5:
                continue
            kind = (ix * 3 + iz * 5) % 7
            jx = ((ix * 13 + iz * 7) % 9) - 4
            jz = ((ix * 5 + iz * 11) % 9) - 4
            px, pz = x + jx, z + jz
            if kind == 0 and planted["divi"] < 12:
                add_divi(b, px, pz, lean=1.8, h=3.1 + (ix % 3) * 0.3, yaw=math.pi)
                planted["divi"] += 1
            elif kind in (1, 2) and planted["cact"] < 18:
                add_cactus(b, px, pz, h=1.6 + (iz % 4) * 0.35, arms=2 if kind == 1 else 3)
                planted["cact"] += 1
            elif kind == 3 and planted["grape"] < 8 and h < 18:
                add_grape(b, px, pz, 1.1)
                planted["grape"] += 1
    # frame the south approach so the street camera sees plants beside the tower
    add_divi(b, ox - 18, oz + 22, lean=2.0, h=3.6, yaw=math.pi)
    add_divi(b, ox + 14, oz + 16, lean=1.6, h=3.0, yaw=math.pi * 0.85)
    add_cactus(b, ox - 12, oz + 10, h=2.4, arms=3)
    add_cactus(b, ox + 10, oz + 26, h=1.8, arms=2)
    add_grape(b, ox - 22, oz + 8, 1.3)
    # low wall on the west viewpoint, beside the monument, not a second tower
    for i in range(4):
        pz = monument[1] - 3 + i * 2.5
        px = monument[0] - 10
        tg = height(px, pz)
        if tg < 12:
            continue
        b.box(0, "stone", px - 0.28, tg - 0.15, pz - 1.05, px + 0.28, tg + 0.75, pz + 1.05)
        b.box(1, "stone", px - 0.28, tg - 0.1, pz - 1.05, px + 0.28, tg + 0.55, pz + 1.05)
    print("dunes", planted, "tris pending")
    tris = b.save(os.path.join(HERO, "nw_lh_dunes.glb"), "nw_lh_dunes")
    entries.append(
        entry(
            "nw_lh_dunes",
            ox,
            oz,
            tris,
            380,
            "Divi-divi lean west, the trade-wind direction, with kadushi and sea grape on the Hudishibana plateau. Kept off the coast road, the lighthouse lot, and north of the hill where Tierra del Sol's golf course starts.",
        )
    )

    # --- Antilla: mooring buoys plus the wreck breaking the surface ---
    ax, az = ll(12.60205, -70.05782)
    print(f"antilla {ax:.1f},{az:.1f} seabed {height(ax, az):.1f}")
    b = B(ax, az, 0.40)
    b.mat("buoy", BUOY, 0.45)
    b.mat("buoyw", BUOY_W, 0.4)
    b.mat("spar", SPAR, 0.5)
    b.mat("rust", RUST, 0.82)
    b.mat("rustd", RUST_D, 0.88)
    b.mat("sponge", SPONGE, 0.9)
    # Bow points east, toward Malmok beach. The old heading ran southwest, away from shore.
    shore_x, shore_z = -8820.0, -8927.0
    dx, dz = shore_x - ax, shore_z - az
    span = math.hypot(dx, dz) or 1.0
    fx, fz = dx / span, dz / span
    px, pz = -fz, fx
    print(f"  antilla bow ({fx:.3f},{fz:.3f}) toward shore {span:.0f} m")
    add_wreck(b, ax, az, fx, fz)
    for t in (-52, -16, 14, 56):
        add_buoy(b, ax + fx * t + px * -12.0, az + fz * t + pz * -12.0, scale=1.7)
    tris = b.save(os.path.join(HERO, "nw_antilla.glb"), "nw_antilla")
    entries.append(
        entry(
            "nw_antilla",
            ax,
            az,
            tris,
            800,
            "SS Antilla, about 12.6021 N, 70.0578 W, roughly 700 m west of Malmok. The German freighter lies on her port side, broken amidships, bow toward the beach; the real wreck is fully submerged, but this sea is opaque, so the upper rail, a bridge block and the masts break the surface and the yellow mooring buoys sit off the starboard side. Yellow with a white band is the usual Caribbean mooring-buoy colour.",
            y=0.40,
            name="Antilla shipwreck",
            new_place=True,
        )
    )

    # --- Tres Trapi: three steps, ironshore, no sand beach ---
    tx, tz = ll(12.60242, -70.05131)
    print(f"tres pin {tx:.1f},{tz:.1f} h={height(tx, tz):.2f}")
    b = B(tx, tz, height(tx, tz))
    for name, col in (("conc", CONC), ("rock", ROCK), ("rockw", ROCK_W), ("trunk", TRUNK), ("leaf0", LEAF), ("leaf1", LEAF_D), ("cact", CACT)):
        b.mat(name, col)
    # walk west from the pin to where the shelf meets the water
    sx = tx
    while sx > tx - 40 and height(sx, tz) > 0.9:
        sx -= 1.0
    steps_west(b, sx + 1.2, tz, 3, 1.15, 3.1, 0.36)
    rock_arm(b, sx + 2, tz - 3.2, -1.3, -0.4, 5)
    rock_arm(b, sx + 1, tz + 3.0, -1.2, 0.35, 5)
    # ironshore apron, no sand
    for i in range(6):
        px = sx - 1.5 - i * 1.6
        pz = tz + (i % 3 - 1) * 1.4
        gnd = height(px, pz)
        top = max(0.22, gnd + 0.12)
        b.box_yaw(0, "rockw" if i % 2 else "rock", px, min(gnd, 0.1) - 0.1, pz, 1.4, top - min(gnd, 0.1) + 0.15, 1.1, i * 0.5)
    # shoulder pull-off on the sea edge of the road, not on the asphalt
    rd = road_x(roads, tz, {"L.G. Smith Boulevard"})
    if rd:
        pad_x = rd[0] - rd[1] * 0.5 - 2.2
        gpad = height(pad_x, tz)
        b.box(0, "rock", pad_x - 1.6, gpad - 0.08, tz - 7, pad_x + 1.6, gpad + 0.06, tz + 7)
        b.box(1, "rock", pad_x - 1.6, gpad - 0.05, tz - 7, pad_x + 1.6, gpad + 0.05, tz + 7)
    add_cactus(b, tx + 12, tz - 14, h=1.5, arms=2)
    add_cactus(b, tx + 9, tz + 12, h=1.2, arms=2)
    add_divi(b, tx + 8, tz + 3, lean=1.5, h=2.8, yaw=math.pi)
    tris = b.save(os.path.join(HERO, "nw_tres.glb"), "nw_tres")
    entries.append(
        entry(
            "nw_tres",
            tx,
            tz,
            tris,
            280,
            "Tres Trapi means three steps: three concrete treads in the ironshore, no sandy beach and no facilities, cars stop on the shoulder. OSM node 4491605028. Limestone shelf and kadushi match the snorkel entry visitors describe.",
            k="osm_n4491605028",
            name="Tres Trapi",
        )
    )

    # --- Boca Catalina cove ---
    bx, bz = ll(12.60618, -70.05238)
    print(f"boca {bx:.1f},{bz:.1f} h={height(bx, bz):.2f}")
    b = B(bx, bz, height(bx, bz))
    b.mat("conc", CONC)
    b.mat("rock", ROCK)
    b.mat("rockw", ROCK_W)
    b.mat("sand", SAND, 0.92)
    b.mat("buoy", BUOY, 0.45)
    b.mat("buoyw", BUOY_W, 0.4)
    b.mat("spar", SPAR, 0.5)
    b.mat("trunk", TRUNK)
    b.mat("leaf0", LEAF)
    b.mat("leaf1", LEAF_D)
    b.mat("cact", CACT)
    b.mat("rail", RAIL, 0.4)
    # The DEM falls off a short limestone cliff just west of the beach node.
    cliff = bx - 12
    x = bx + 20
    while x > bx - 50:
        if height(x, bz) > 1.5 and height(x - 3, bz) < 0.3:
            cliff = x - 1
            break
        x -= 1
    print(f"  boca cliff x={cliff:.0f} h={height(cliff, bz):.2f} mesh={mesh_height(cliff, bz):.2f}")
    # Start the flight where the path is still about 5 m up, and run it down the cliff face.
    x_top = cliff + 10
    while x_top > cliff - 4 and mesh_height(x_top, bz) > 4.85:
        x_top -= 0.2
    print(f"  boca flight start x={x_top:.2f} mesh={mesh_height(x_top, bz):.2f}")
    placed, x_end, _y_end = stair_flight(b, bz, x_top, run=0.40, width=2.2)
    print(f"  boca steps {placed}")
    rock_arm(b, cliff + 2, bz - 5, -1.1, -0.15, 5)
    rock_arm(b, cliff + 1, bz + 5, -1.05, 0.12, 4)
    # sand pocket west of the lowest tread, on the shelf that is still above the water
    foot = x_end - 0.4
    gsand = height(foot - 1.5, bz)
    sand_top = 0.28 if gsand < 0.2 else min(gsand + 0.06, 0.55)
    b.box(0, "sand", foot - 3.2, sand_top - 0.08, bz - 2.6, foot, sand_top, bz + 2.4)
    b.box(1, "sand", foot - 2.6, sand_top - 0.06, bz - 2.0, foot - 0.2, sand_top, bz + 1.8)
    wx = cliff - 1
    while wx > cliff - 30 and height(wx, bz) > 0.05:
        wx -= 2
    add_buoy(b, wx - 8, bz - 3, 0.75, lod1=True)
    add_buoy(b, wx - 5, bz + 4, 0.7, lod1=False)
    add_grape(b, cliff + 8, bz - 6, 1.2)
    add_grape(b, cliff + 10, bz + 7, 1.0)
    add_cactus(b, cliff + 14, bz + 2, 1.4, 2)
    add_divi(b, cliff + 16, bz - 3, 1.8, 3.2, math.pi)
    tris = b.save(os.path.join(HERO, "nw_boca.glb"), "nw_boca")
    entries.append(
        entry(
            "nw_boca",
            bx,
            bz,
            tris,
            300,
            "Boca Catalina: a small cove framed by limestone. The snorkel stair is one concrete flight down the cliff face, with cheek walls and a north handrail, plus a pocket of sand at the bottom. OSM Boca Catalina Beach node 13422393884. Yellow swim buoys sit just off the shelf. The wind-bent divi already at catalina_divi is left in place.",
            k="osm_n13422393884",
            name="Boca Catalina Beach",
        )
    )

    # --- Malmok beach cove ---
    mx, mz = ll(12.60076, -70.05077)
    # the named node sits near the road; the swim shelf is seaward
    print(f"malmok node {mx:.1f},{mz:.1f} h={height(mx, mz):.2f}")
    sea = mx
    while sea > mx - 80 and height(sea, mz) > 1.15:
        sea -= 2
    print(f"  malmok shore x={sea:.1f} h={height(sea, mz):.2f}")
    cx, cz = sea - 4, mz
    b = B(cx, cz, height(cx, cz))
    for name, col in (
        ("conc", CONC),
        ("rock", ROCK),
        ("rockw", ROCK_W),
        ("sand", SAND),
        ("buoy", BUOY),
        ("buoyw", BUOY_W),
        ("spar", SPAR),
        ("trunk", TRUNK),
        ("leaf0", LEAF),
        ("leaf1", LEAF_D),
        ("cact", CACT),
    ):
        b.mat(name, col, 0.8)
    steps_west(b, cx + 6, cz, 4, 1.05, 2.4, 0.32)
    rock_arm(b, cx + 5, cz - 4.5, -1.5, -0.25, 4)
    rock_arm(b, cx + 4, cz + 4.2, -1.4, 0.2, 4)
    gs = height(cx, cz)
    b.box(0, "sand", cx - 7, gs - 0.06, cz - 5, cx + 5, max(gs, 0.3) + 0.08, cz + 4)
    b.box(1, "sand", cx - 6, gs - 0.02, cz - 4, cx + 4, max(gs, 0.3) + 0.05, cz + 3)
    wx = cx - 2
    while wx > cx - 50 and height(wx, cz) > 0.15:
        wx -= 2
    add_buoy(b, wx - 5, cz - 2, 0.7)
    add_buoy(b, wx - 3, cz + 3.5, 0.65, lod1=False)
    add_grape(b, cx + 9, cz - 5, 1.15)
    add_divi(b, cx + 18, cz + 9, 1.7, 3.0, math.pi)
    add_cactus(b, cx + 14, cz + 2, 1.3, 2)
    tris = b.save(os.path.join(HERO, "nw_malmok_cove.glb"), "nw_malmok_cove")
    entries.append(
        entry(
            "nw_malmok_cove",
            cx,
            cz,
            tris,
            280,
            "Malmok Beach: a small sand notch in the limestone shelf off L.G. Smith Boulevard, with a short stair and swim buoys. OSM beach way 255368366. The coast-road villa row is a separate model.",
            name="Malmok Beach",
            new_place=True,
        )
    )

    # --- Hadicurari / Fisherman's Huts ---
    hx, hz = ll(12.58556, -70.04608)
    print(f"hadi {hx:.1f},{hz:.1f} h={height(hx, hz):.2f}")
    b = B(hx, hz, height(hx, hz))
    b.mat("door", DOOR, 0.75)
    b.mat("wood", WOOD, 0.85)
    b.mat("thatch", THATCH, 0.9)
    b.mat("metal", (0.62, 0.64, 0.66), 0.55)
    b.mat("sand", SAND, 0.93)
    b.mat("trunk", TRUNK)
    b.mat("leaf0", LEAF)
    b.mat("leaf1", LEAF_D)
    b.mat("cact", CACT)
    b.mat("line", LINE_C, 0.7)
    b.mat("board", BOARD, 0.55)
    b.mat("spar", SPAR, 0.45)
    b.mat("buoy", BUOY, 0.45)
    b.mat("buoyw", BUOY_W, 0.4)
    for i, rgb in enumerate(HUTS):
        b.mat(f"hut{i}", rgb, 0.84)
    for i, rgb in enumerate(KITES):
        b.mat(f"kite{i}", rgb, 0.55)
    def on_house(x, z, road):
        for bld in buildings:
            if bld["cx"] > road + 6 or abs(bld["cz"] - z) > 30:
                continue
            xs = [p[0] for p in bld["p"]]
            zs = [p[1] for p in bld["p"]]
            if min(xs) - 3 <= x <= max(xs) + 3 and min(zs) - 3 <= z <= max(zs) + 3:
                return True
        return False

    huts = []
    # Open sand, seaward of the beach houses and clear of the sail rack.
    for z in (-7400, -7364, -7332, -7296, -7236, -7204):
        rd = road_x(roads, z, {"Avenida Nelson O. Oduber", "L.G. Smith Boulevard"})
        if not rd:
            continue
        x = rd[0] - 14
        placed = None
        for _ in range(30):
            h = height(x, z)
            if (
                x <= rd[0] - 16
                and not on_house(x, z, rd[0])
                and 0.55 <= h <= 1.4
                and math.hypot(x + 8260, z + 7260) > 14
            ):
                placed = x
                break
            x -= 2.5
        if placed is not None and dist_roads(roads, placed, z, COAST) >= 9:
            huts.append((placed, z))
    print("  huts", [(round(p[0], 1), round(p[1], 1)) for p in huts])
    kites = 0
    rigs = 0
    for i, (x, z) in enumerate(huts):
        roof = "thatch" if i % 2 == 0 else "metal"
        add_hut(b, x, z, yaw=0.15 * (i % 3 - 1), wall=f"hut{i % 8}", roof_mat=roof, roof_rgb=None)
        if i % 3 == 0:
            add_grape(b, x + 7, z, 1.15)
        # Kites fly in the morning and late afternoon; windsurf rigs share the same sand.
        if i % 2 == 0:
            add_air_kite(
                b,
                x - 5,
                z + 3,
                f"kite{i % 4}",
                alt=9.5 + (i % 3) * 2.4,
                reach=15 + (i % 3) * 4,
                side=(i - 2) * 2.5,
            )
            kites += 1
        else:
            if add_windsurf(b, x - 16, z - 5, f"kite{i % 4}", yaw=-0.5):
                rigs += 1
    # a couple more rigs on the open sand, clear of the hut row and the sail rack
    for j, (dx, dz, yaw) in enumerate(((-18, 14, -0.2), (-16, -18, 0.15), (-22, 4, -0.5))):
        px, pz = hx + dx, hz + dz
        if 0.35 <= height(px, pz) <= 1.3 and not on_house(px, pz, hx + 40):
            if add_windsurf(b, px, pz, f"kite{j % 4}", yaw):
                rigs += 1
    add_air_kite(b, hx - 10, hz - 24, "kite1", alt=14.5, reach=22, side=6)
    add_air_kite(b, hx - 8, hz + 18, "kite2", alt=11.0, reach=18, side=-5)
    kites += 2
    # yellow buoys marking the riding zone, about 70 m off the beach
    zone = 0
    for i, z in enumerate(range(-7420, -7160, 36)):
        shore = -8080.0
        while shore > -8600 and height(shore, z) > 0.2:
            shore -= 4
        bxu = shore - 68
        add_buoy(b, bxu, z, 0.55, lod1=(i % 2 == 0))
        zone += 1
    print(f"  hadi kites {kites} windsurf {rigs} zone buoys {zone}")
    add_divi(b, hx + 6, hz + 30, 2.1, 3.5, math.pi)
    add_divi(b, hx - 4, hz - 80, 1.8, 3.2, math.pi)
    add_cactus(b, hx + 10, hz - 20, 1.8, 2)
    # The beach is already sand. A second sheet leaves a hard white rectangle.
    tris = b.save(os.path.join(HERO, "nw_hadi.glb"), "nw_hadi")
    entries.append(
        entry(
            "nw_hadi",
            hx,
            hz,
            tris,
            320,
            "Fisherman's Huts at Hadicurari: a row of small timber huts on the sand north of the high-rises, faded blue, yellow, white and green, thatch and metal roofs. Crescent kites sit in the sky on lines (the morning and late-day sport) and windsurf rigs stand on the sand; a line of yellow buoys marks the riding zone offshore. OSM Hadicurari Beach node 4632067907. The existing sail rack (hadicurari_fx) is left where it stands. No kite-brand marks.",
            k="osm_n4632067907",
            name="Hadicurari Beach",
        )
    )

    # --- Arashi: thatched palapas set back from the umbrellas, beach huts, gravel parking ---
    arx, arz = ll(12.60963, -70.05292)
    print(f"arashi {arx:.1f},{arz:.1f} h={height(arx, arz):.2f}")
    b = B(arx, arz, height(arx, arz))
    b.mat("wood", WOOD, 0.86)
    b.mat("thatchd", THATCH_D, 0.94)
    b.mat("thatche", THATCH_E, 0.96)
    b.mat("sand", (0.93, 0.90, 0.80), 0.94)
    b.mat("trunk", TRUNK)
    b.mat("leaf0", LEAF)
    b.mat("leaf1", LEAF_D)
    b.mat("cact", CACT)
    b.mat("door", DOOR, 0.75)
    b.mat("gravel", GRAVEL, 0.95)
    b.mat("stall", STALL, 0.6)
    for i, rgb in enumerate(HUTS):
        b.mat(f"hut{i}", rgb, 0.84)
    palapas = 0
    # Seaward umbrella posts sit near x=-9048. Keep this row inland of that line.
    for k, z in enumerate(range(int(arz - 70), int(arz + 48), 16)):
        best = None
        x = -9028.0
        while x < arx - 6:
            h = height(x, z)
            if 1.9 <= h <= 2.55 and (best is None or abs(h - 2.15) < abs(best[0] - 2.15)):
                best = (h, x)
            x += 1.5
        if not best or dist_roads(roads, best[1], z, COAST) < 16:
            continue
        add_palapa(b, best[1], z, yaw=0.05 * ((k % 3) - 1), span=1.75)
        palapas += 1
        print(f"  palapa {best[1]:.1f},{z} h={best[0]:.2f}")
    huts_n = 0
    hut_east = -1e9
    # Walled huts on the lot edge, inland of the palapas and staggered between them.
    for k, z in enumerate(range(int(arz - 62), int(arz + 30), 32)):
        best = None
        x = arx + 6
        while x > -9028:
            h = height(x, z)
            if 2.55 <= h <= 3.35 and (best is None or abs(h - 2.85) < abs(best[0] - 2.85)):
                best = (h, x)
            x -= 1.5
        if not best or dist_roads(roads, best[1], z, COAST) < 14:
            continue
        add_beach_hut(b, best[1], z, yaw=0.08 * ((k % 3) - 1), wall=f"hut{k % 8}")
        hut_east = max(hut_east, best[1] + 1.9)
        huts_n += 1
        print(f"  hut {best[1]:.1f},{z} h={best[0]:.2f}")
    # gravel between the huts and the asphalt, clear of the parked-car strip at the road edge
    rd = road_x(roads, arz, {"L.G. Smith Boulevard"})
    if rd:
        asphalt_west = rd[0] - rd[1] * 0.5 - 0.8
        pad_east = asphalt_west - 2.5
        pad_west = pad_east - 14.0
        # Pull the lot off a hut only when that still leaves a row of stalls.
        if hut_east > -1e8 and hut_east + 0.6 < pad_east - 8:
            pad_west = max(pad_west, hut_east + 0.6)
        if pad_east - pad_west > 4:
            cells = parking_pad(b, roads, pad_west, pad_east, arz - 62, arz + 42)
            print(f"  parking cells {cells} x {pad_west:.0f}..{pad_east:.0f} road {rd[0]:.0f} w {rd[1]:.1f}")
    print(f"  palapas {palapas} beach huts {huts_n}")
    sand_sheet(b, "sand", arx - 95, arz - 90, arx - 40, arz + 55, 10, 0.3, 1.45, True, roads, COAST)
    b.box(1, "sand", arx - 80, height(arx, arz) - 0.2, arz - 50, arx - 45, height(arx, arz) + 0.2, arz + 30)
    add_grape(b, arx - 20, arz - 10, 1.3)
    add_grape(b, arx - 24, arz + 18, 1.1)
    add_grape(b, arx - 18, arz - 36, 1.2)
    add_divi(b, arx - 8, arz + 8, 2.0, 3.4, math.pi)
    add_divi(b, arx - 12, arz - 24, 1.7, 3.0, math.pi)
    add_cactus(b, arx + 6, arz + 20, 2.0, 3)
    tris = b.save(os.path.join(HERO, "nw_arashi.glb"), "nw_arashi")
    entries.append(
        entry(
            "nw_arashi",
            arx,
            arz,
            tris,
            340,
            "Arashi Beach: dark palm-thatch palapas with posts and a hanging skirt, set back on the 2 m terrace so they stand apart from the lower umbrella line (arashi_fx). Walled thatch beach huts and a gravel stall lot sit between that row and the coast road; the roadside cars (arashi_roadpark) and the Beach Shack stay. OSM Arashi Beach node 2610646204.",
            k="m_arashibeach",
            name="Arashi Beach",
        )
    )

    # --- waterfront villas along L.G. Smith, both sides of the coast road ---
    skip = {366, 7001}  # Arashi Beach Shack hero, and the glass villa hero
    chosen = []
    for bld in buildings:
        if bld["i"] in skip:
            continue
        if not (-9880 <= bld["cz"] <= -9050):
            continue
        rd = road_x(roads, bld["cz"], {"L.G. Smith Boulevard"})
        if not rd:
            continue
        dx = bld["cx"] - rd[0]
        if abs(dx) > 34:
            continue
        pt = interior_point(bld["p"])
        if not pt:
            continue
        chosen.append((bld, pt, rd))
    print(f"villas {len(chosen)}")
    if chosen:
        vx = sum(c[1][0] for c in chosen) / len(chosen)
        vz = sum(c[1][1] for c in chosen) / len(chosen)
        b = B(vx, vz, height(vx, vz))
        b.mat("coral", CORAL, 0.92)
        b.mat("terr", TERR, 0.84)
        b.mat("frame", FRAME_C, 0.62)
        b.mat("glass", GLASS, 0.12)
        b.mat("shut", SHUTTER, 0.7)
        b.mat("door", DOOR, 0.75)
        for i, rgb in enumerate(WALLS):
            b.mat(f"w{i}", rgb, 0.82)
        hides = []
        for idx, (bld, pt, rd) in enumerate(chosen):
            poly = bld["p"]
            area = 0.0
            for i in range(len(poly)):
                a, c = poly[i], poly[(i + 1) % len(poly)]
                area += a[0] * c[1] - c[0] * a[1]
            if area < 0:
                poly = list(reversed(poly))
            gnd = height(pt[0], pt[1])
            wall_h = 6.4 if bld["h"] >= 6 else 3.35
            paint = f"w{idx % len(WALLS)}"
            b.extrude(0, "coral", poly, gnd - 0.45, gnd + 0.55, top=False)
            b.extrude(0, paint, poly, gnd + 0.55, gnd + wall_h, top=True)
            b.extrude(1, paint, poly, gnd - 0.3, gnd + wall_h, top=True)
            if bld["r"] == "hipped":
                b.hip(0, "terr", poly, gnd + wall_h, 1.45 if wall_h < 5 else 1.7)
            else:
                # low parapet
                b.extrude(0, paint, poly, gnd + wall_h, gnd + wall_h + 0.35, top=False)
            # framed, glazed windows with shutters on the two long walls; a second row only upstairs
            n = len(poly)
            edges = []
            for i in range(n):
                a, cpt = poly[i], poly[(i + 1) % n]
                edges.append((math.hypot(cpt[0] - a[0], cpt[1] - a[1]), a, cpt))
            edges.sort(reverse=True)
            rows = (1.05, 3.55) if wall_h >= 6 else (1.05,)
            for length, a, cpt in edges[:2]:
                if length < 4:
                    continue
                dx, dz = cpt[0] - a[0], cpt[1] - a[1]
                yaw = math.atan2(dz, dx)
                count = 2 if length >= 7.5 else 1
                for k in range(count):
                    t = (k + 1) / (count + 1)
                    wx = a[0] + dx * t
                    wz = a[1] + dz * t
                    for row in rows:
                        add_opening(b, wx, wz, gnd + row, yaw)
            # coral boundary wall toward the road, with a gate
            rx = rd[0]
            best_e = None
            for i in range(n):
                a, c = poly[i], poly[(i + 1) % n]
                mx, mz = (a[0] + c[0]) / 2, (a[1] + c[1]) / 2
                d = math.hypot(mx - rx, mz - bld["cz"])
                if best_e is None or d < best_e[0]:
                    best_e = (d, a, c)
            if best_e and best_e[0] < 40:
                a, c = best_e[1], best_e[2]
                dx, dz = c[0] - a[0], c[1] - a[1]
                L = math.hypot(dx, dz)
                if L > 4:
                    oxn, ozn = dz / L, -dx / L
                    # pull the wall off the asphalt
                    inset = 0.55
                    for seg in ((0.08, 0.38), (0.62, 0.92)):
                        a1 = (a[0] + dx * seg[0] + oxn * inset, a[1] + dz * seg[0] + ozn * inset)
                        a2 = (a[0] + dx * seg[1] + oxn * inset, a[1] + dz * seg[1] + ozn * inset)
                        b.beam(0, "coral", (a1[0], gnd, a1[1]), (a2[0], gnd + 0.75, a2[1]), 0.16, 0.18)
            hides.append([round(pt[0], 1), round(pt[1], 1)])
        tris = b.save(os.path.join(HERO, "nw_villas.glb"), "nw_villas")
        entries.append(
            entry(
                "nw_villas",
                vx,
                vz,
                tris,
                240,
                "First-row houses along L.G. Smith Boulevard from Arashi to Malmok, both sides of the coast road. White and cream plaster on a coral-stone plinth, terracotta hips where OSM says hipped, windows with a pale frame, glass and open dark-green shutters, and a low coral wall with a gate toward the road. Hides those OSM boxes. Skips the Arashi Beach Shack and the existing glass villa. Does not touch Malmokweg or the Noord grid inland.",
                hide=hides,
            )
        )

    # --- Bubali north end: the first land-side houses on Oduber, just inland of Hadicurari ---
    bub = []
    for bld in buildings:
        if not (-7850 <= bld["cz"] <= -7100):
            continue
        rd = road_x(roads, bld["cz"], {"Avenida Nelson O. Oduber"})
        if not rd:
            continue
        dx = bld["cx"] - rd[0]
        # Lots sit back from the carriageway. The coloured boxes in the
        # street view are 31–57 m inland; a 46 m cutoff left that row up.
        if not (28 < dx < 60):
            continue
        if (bld["h"] or 0) >= 8:
            continue
        if dist_roads(roads, bld["cx"], bld["cz"], COAST - {"Avenida Nelson O. Oduber"}) + 8 < dx:
            continue
        pt = interior_point(bld["p"])
        if not pt:
            continue
        bub.append((bld, pt, rd, dx))
    bub.sort(key=lambda t: t[0]["cz"])
    print(f"bubali houses {len(bub)}")
    if bub:
        vx = sum(t[1][0] for t in bub) / len(bub)
        vz = sum(t[1][1] for t in bub) / len(bub)
        b = B(vx, vz, height(vx, vz))
        b.mat("coral", CORAL, 0.92)
        b.mat("terr", TERR, 0.84)
        b.mat("win", WIN, 0.35)
        for i, rgb in enumerate(WALLS):
            b.mat(f"w{i}", rgb, 0.82)
        hides = []
        for idx, (bld, pt, rd, _dx) in enumerate(bub):
            poly = bld["p"]
            area = 0.0
            for i in range(len(poly)):
                a, c = poly[i], poly[(i + 1) % len(poly)]
                area += a[0] * c[1] - c[0] * a[1]
            if area < 0:
                poly = list(reversed(poly))
            gnd = height(pt[0], pt[1])
            wall_h = 3.3
            paint = f"w{idx % len(WALLS)}"
            b.extrude(0, "coral", poly, gnd - 0.4, gnd + 0.5, top=False)
            b.extrude(0, paint, poly, gnd + 0.5, gnd + wall_h, top=True)
            b.extrude(1, paint, poly, gnd - 0.2, gnd + wall_h, top=True)
            if bld["r"] == "hipped":
                b.hip(0, "terr", poly, gnd + wall_h, 1.3)
            hides.append([round(pt[0], 1), round(pt[1], 1)])
        tris = b.save(os.path.join(HERO, "nw_bubali.glb"), "nw_bubali")
        entries.append(
            entry(
                "nw_bubali",
                vx,
                vz,
                tris,
                220,
                "North end of the Bubali coast, the first land-side houses on Avenida Nelson O. Oduber beside Hadicurari. Low plaster houses on a coral plinth. Stays on the coast road: Palm Beach hotels and the Noord side streets are not touched.",
                hide=hides,
            )
        )

    # Append nw_ heroes. A full json.dumps rewrites every existing entry.
    append_manifest(entries)
    print("---")
    for e in entries:
        print(f"{e['id']:18} tris {e['tris'][e['id']+'_lod0']:5}/{e['tris'][e['id']+'_lod1']:<4} at {e['x']:.0f},{e['z']:.0f} hide {len(e['hide'])}")


if __name__ == "__main__":
    build()
