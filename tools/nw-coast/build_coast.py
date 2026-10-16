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


def add_buoy(b: B, x, z, scale=1.0, lod1=True):
    y = 0.40
    r = 0.55 * scale
    b.cyl(0, "buoy", x, y - 0.05, z, r, y + r * 0.95, r * 0.92, 10)
    b.cyl(0, "buoyw", x, y + r * 0.15, z, r * 1.05, y + r * 0.48, r * 1.05, 10)
    b.beam(0, "spar", (x, y + r * 0.4, z), (x, y + 1.7 * scale, z), 0.035 * scale, 0.035 * scale)
    if lod1:
        s = r
        b.box(1, "buoy", x - s, y - s * 0.2, z - s, x + s, y + s * 1.3, z + s)


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
    """Concrete steps descending toward the sea (negative X), embedded in the slope."""
    for i in range(n):
        x1 = x - i * run
        x0 = x1 - run
        top = None
        # tread wants to step down, but stay glued to the ground
        g = min(height(x0, z), height(x1, z), height((x0 + x1) / 2, z - width * 0.3), height((x0 + x1) / 2, z + width * 0.3))
        gmax = max(height(x0, z), height(x1, z))
        top = gmax + 0.08 - i * 0.02
        # keep a visible riser against the previous tread
        if i == 0:
            top = max(top, g + 0.34)
        bot = min(g, top - rise) - 0.08
        if top - bot < 0.2:
            bot = top - 0.28
        b.box(0, "conc", x0, bot, z - width / 2, x1, top, z + width / 2)
        b.box(1, "conc", x0, bot, z - width / 2, x1, top, z + width / 2)


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

    # --- lighthouse tower on the DEM peak nearest the OSM node ---
    node = ll(12.61377, -70.05135)
    best = None
    for dz in range(-36, 37, 2):
        for dx in range(-36, 37, 2):
            x, z = node[0] + dx, node[1] + dz
            h = height(x, z)
            if best is None or h > best[0]:
                best = (h, x, z)
    ox, oz = best[1], best[2]
    print(f"lighthouse peak {ox:.1f},{oz:.1f} h={best[0]:.2f} osm {node[0]:.1f},{node[1]:.1f}")
    b = B(ox, oz, best[0])
    b.mat("stone", STONE, 0.9)
    b.mat("white", WHITE, 0.7)
    b.mat("dome", DOME, 0.45)
    b.mat("glass", GLASS, 0.25)
    b.mat("door", DOOR, 0.8)
    b.mat("rail", RAIL, 0.55)
    b.mat("rock", ROCK, 0.95)
    b.mat("rockw", ROCK_W, 0.95)
    g = best[0]
    # octagonal podium via a 8-side cylinder, then the tapered shaft
    b.cyl(0, "stone", ox, g - 0.3, oz, 5.6, g + 1.15, 5.35, 8)
    b.cyl(0, "stone", ox, g + 1.15, oz, 4.7, g + 2.35, 4.45, 8)
    b.cyl(0, "stone", ox, g + 2.35, oz, 3.45, g + 24.0, 2.45, 16)
    b.cyl(1, "stone", ox, g - 0.2, oz, 4.2, g + 24.0, 2.55, 8)
    # door facing south (the lot is south of the peak, +Z)
    b.box(0, "door", ox - 0.55, g + 0.05, oz + 4.15, ox + 0.55, g + 2.15, oz + 4.55)
    for wy in (8.5, 14.5, 20.0):
        b.box(0, "glass", ox + 3.15, g + wy, oz - 0.28, ox + 3.45, g + wy + 0.7, oz + 0.28)
        b.box(0, "glass", ox - 0.28, g + wy + 1.5, oz - 3.35, ox + 0.28, g + wy + 2.15, oz - 3.05)
    b.deck(0, "white", ox, g + 23.85, oz, 2.2, 3.85, 16, 0.28)
    b.deck(1, "white", ox, g + 23.9, oz, 2.3, 3.6, 8, 0.3)
    for i in range(12):
        t = math.tau * i / 12
        px, pz = ox + math.cos(t) * 3.55, oz + math.sin(t) * 3.55
        b.box(0, "rail", px - 0.05, g + 24.15, pz - 0.05, px + 0.05, g + 25.05, pz + 0.05)
    b.deck(0, "rail", ox, g + 24.95, oz, 3.35, 3.6, 12, 0.08)
    b.cyl(0, "glass", ox, g + 24.7, oz, 2.05, g + 27.7, 1.9, 12)
    b.cyl(0, "white", ox, g + 24.55, oz, 2.2, g + 24.85, 2.2, 12)
    for i in range(8):
        t = math.tau * i / 8
        px, pz = ox + math.cos(t) * 2.05, oz + math.sin(t) * 2.05
        b.box(0, "white", px - 0.06, g + 24.8, pz - 0.06, px + 0.06, g + 27.6, pz + 0.06)
    b.deck(0, "white", ox, g + 27.65, oz, 1.5, 2.7, 12, 0.22)
    b.cyl(0, "dome", ox, g + 27.9, oz, 2.15, g + 30.15, 0.18, 12)
    b.cyl(0, "dome", ox, g + 30.15, oz, 0.28, g + 30.7, 0.28, 8)
    b.cyl(1, "dome", ox, g + 24.2, oz, 2.3, g + 29.5, 0.25, 8)
    # rubble skirt so the podium meets the slope, plus a low viewpoint wall to the west
    for i in range(10):
        t = math.tau * i / 10 + 0.2
        rad = 6.4 + (i % 3) * 0.45
        px, pz = ox + math.cos(t) * rad, oz + math.sin(t) * rad
        tg = height(px, pz)
        top = max(tg + 0.7, g + 0.15)
        b.box_yaw(0, "rock" if i % 2 == 0 else "rockw", px, min(tg, g) - 0.25, pz, 1.15, top - min(tg, g) + 0.25, 0.85, t)
    # viewpoint wall, west rim
    for i in range(5):
        pz = oz - 6 + i * 2.4
        px = ox - 8.5
        tg = height(px, pz)
        b.box(0, "stone", px - 0.28, tg - 0.2, pz - 1.05, px + 0.28, tg + 0.85, pz + 1.05)
    b.box(1, "stone", ox - 9, g - 1.5, oz - 7, ox - 8, g + 0.4, oz + 6)
    tris = b.save(os.path.join(HERO, "nw_lh_tower.glb"), "nw_lh_tower")
    entries.append(
        entry(
            "nw_lh_tower",
            ox,
            oz,
            tris,
            900,
            "Wikipedia California Lighthouse: pale rubble-stone tower, octagonal basement, double gallery and lantern, 30 m, on Hudishibana. OSM node 540121391 snapped onto the DEM peak. Lantern is the dark metal cage visitors photograph; shaft is warm limestone rather than pure white.",
            name="California Lighthouse",
            new_place=True,
        )
    )

    # --- dune scrub around the hill, clear of the road, the lot, and the golf course ---
    b = B(ox, oz, best[0])
    b.mat("trunk", TRUNK, 0.9)
    b.mat("leaf0", LEAF, 0.85)
    b.mat("leaf1", LEAF_D, 0.85)
    b.mat("cact", CACT, 0.8)
    avoid = [(-8870, -10340, 28), (-8858, -10350, 8), (ox, oz, 8)]
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

    # --- Antilla mooring buoys ---
    ax, az = ll(12.60205, -70.05782)
    print(f"antilla {ax:.1f},{az:.1f} seabed {height(ax, az):.1f}")
    b = B(ax, az, 0.40)
    b.mat("buoy", BUOY, 0.45)
    b.mat("buoyw", BUOY_W, 0.4)
    b.mat("spar", SPAR, 0.5)
    # Bow toward the northwest. Four buoys along about 100 m of the 120 m wreck.
    heading = (-0.72, -0.69)
    for t in (-50, -16, 16, 50):
        add_buoy(b, ax + heading[0] * t, az + heading[1] * t, scale=1.35)
    tris = b.save(os.path.join(HERO, "nw_antilla.glb"), "nw_antilla")
    entries.append(
        entry(
            "nw_antilla",
            ax,
            az,
            tris,
            800,
            "SS Antilla, about 12.6021 N, 70.0578 W, roughly 700 m west of Malmok. The wreck itself lies on the seabed; the part you see from the surface is the line of mooring buoys tour boats clip to. Yellow with a white band is the usual Caribbean mooring-buoy colour; sources do not publish this wreck's exact paint, so the band is a moderate reading.",
            y=0.40,
            name="Antilla wreck buoys",
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
    add_cactus(b, tx + 4, tz - 6, h=1.5, arms=2)
    add_cactus(b, tx + 2, tz + 7, h=1.2, arms=2)
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
    # The DEM falls off a short limestone cliff just west of the beach node.
    cliff = bx - 12
    x = bx + 20
    while x > bx - 50:
        if height(x, bz) > 1.5 and height(x - 3, bz) < 0.3:
            cliff = x - 1
            break
        x -= 1
    print(f"  boca cliff x={cliff:.0f} h={height(cliff, bz):.2f}")
    # Eight treads down the face, from the lip to the water.
    lip = cliff + 4
    lip_h = height(lip, bz)
    for i in range(8):
        x1 = lip - i * 1.15
        x0 = x1 - 1.15
        top = lip_h - i * 0.42
        if top < 0.2:
            break
        g0 = min(height(x0, bz), height(x1, bz), height(x0, bz - 1), height(x1, bz + 1))
        bot = min(g0, top - 0.42) - 0.08
        b.box(0, "conc", x0, bot, bz - 1.2, x1, top, bz + 1.2)
        if i % 2 == 0:
            b.box(1, "conc", x0, bot, bz - 1.1, x1, top, bz + 1.1)
    rock_arm(b, cliff + 2, bz - 5, -1.1, -0.15, 5)
    rock_arm(b, cliff + 1, bz + 5, -1.05, 0.12, 4)
    # sand pocket at the foot of the cliff, just above the water
    foot = cliff - 2
    gsand = max(0.25, height(foot, bz))
    b.box(0, "sand", foot - 6, 0.12, bz - 5, foot + 2, gsand + 0.1, bz + 4)
    b.box(1, "sand", foot - 5, 0.15, bz - 4, foot + 1, gsand + 0.08, bz + 3)
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
            "Boca Catalina: a small cove framed by limestone, with concrete snorkel stairs and a pocket of sand. OSM Boca Catalina Beach node 13422393884. Yellow swim buoys sit just off the shelf. The wind-bent divi already at catalina_divi is left in place.",
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
    add_grape(b, cx + 8, cz - 3, 1.15)
    add_divi(b, cx + 12, cz + 4, 1.7, 3.0, math.pi)
    add_cactus(b, cx + 6, cz + 6, 1.3, 2)
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
    for i, rgb in enumerate(HUTS):
        b.mat(f"hut{i}", rgb, 0.84)
    for i, rgb in enumerate(KITES):
        b.mat(f"kite{i}", rgb, 0.55)
    huts = []
    z = hz - 280
    while z < hz + 220 and len(huts) < 8:
        rd = road_x(roads, z, {"Avenida Nelson O. Oduber", "L.G. Smith Boulevard"})
        if rd:
            x = rd[0] - 16
            for _ in range(24):
                if 0.6 <= height(x, z) <= 1.35:
                    break
                x -= 3
            # On the sand, seaward of the carriageway, clear of the existing sail rack.
            if (
                0.55 <= height(x, z) <= 1.5
                and rd[0] - 70 <= x <= rd[0] - 14
                and math.hypot(x + 8260, z + 7260) > 26
            ):
                huts.append((x, z))
        z += 52
    print("  huts", [(round(p[0], 1), round(p[1], 1)) for p in huts])
    for i, (x, z) in enumerate(huts):
        roof = "thatch" if i % 2 == 0 else "metal"
        add_hut(b, x, z, yaw=0.15 * (i % 3 - 1), wall=f"hut{i % 8}", roof_mat=roof, roof_rgb=None)
        if i % 2 == 0:
            add_kite(b, x - 8, z + 6, f"kite{i % 4}", KITES[i % 4], yaw=-0.4)
        if i % 3 == 0:
            add_grape(b, x + 7, z, 1.15)
    add_divi(b, hx + 6, hz + 30, 2.1, 3.5, math.pi)
    add_divi(b, hx - 4, hz - 80, 1.8, 3.2, math.pi)
    add_cactus(b, hx + 10, hz - 20, 1.8, 2)
    sand_sheet(
        b,
        "sand",
        hx - 70,
        hz - 180,
        hx + 15,
        hz + 140,
        12,
        0.35,
        1.55,
        True,
        roads,
        {"Avenida Nelson O. Oduber", "L.G. Smith Boulevard"},
    )
    # lod1 stand-ins for the kites were boxes; huts already wrote lod1. Add a sand lod1 slab.
    b.box(1, "sand", hx - 40, height(hx, hz) - 0.05, hz - 80, hx, height(hx, hz) + 0.05, hz + 60)
    tris = b.save(os.path.join(HERO, "nw_hadi.glb"), "nw_hadi")
    entries.append(
        entry(
            "nw_hadi",
            hx,
            hz,
            tris,
            320,
            "Fisherman's Huts at Hadicurari: a row of small timber huts on the sand north of the high-rises, faded blue, yellow, white and green, thatch and metal roofs, with kite and windsurf sails on the flat lagoon. OSM Hadicurari Beach node 4632067907. The existing sail rack (hadicurari_fx) is left where it stands; these huts extend the beach north and south of it. Sea grape sits between the coast road and the sand.",
            k="osm_n4632067907",
            name="Hadicurari Beach",
        )
    )

    # --- Arashi: larger thatch palapas and a whiter sand sheet, west of the existing umbrella line ---
    arx, arz = ll(12.60963, -70.05292)
    print(f"arashi {arx:.1f},{arz:.1f} h={height(arx, arz):.2f}")
    b = B(arx, arz, height(arx, arz))
    b.mat("wood", WOOD, 0.86)
    b.mat("thatch", THATCH, 0.92)
    b.mat("sand", (0.93, 0.90, 0.80), 0.94)
    b.mat("trunk", TRUNK)
    b.mat("leaf0", LEAF)
    b.mat("leaf1", LEAF_D)
    b.mat("cact", CACT)
    palapas = 0
    # One row on the white-sand contour (about 1 m above the water). The beach
    # shelf is only a few metres wide before the DEM drops into the sea.
    for k, z in enumerate(range(int(arz - 80), int(arz + 50), 14)):
        best = None
        x = arx - 10
        while x > arx - 90:
            h = height(x, z)
            if 0.7 <= h <= 1.5 and (best is None or abs(h - 1.0) < abs(best[0] - 1.0)):
                best = (h, x)
            x -= 2
        if not best:
            continue
        x = best[1]
        if dist_roads(roads, x, z, COAST) < 12:
            continue
        gnd = best[0]
        yaw = 0.04 * ((k % 3) - 1)
        for sx, sz in ((-1.6, -1.6), (1.6, -1.6), (-1.6, 1.6), (1.6, 1.6)):
            b.box_yaw(0, "wood", x + sx, gnd - 0.1, z + sz, 0.08, 2.2, 0.08, yaw)
        b.box_yaw(0, "thatch", x, gnd + 2.1, z, 2.55, 0.32, 2.55, yaw)
        b.box_yaw(0, "thatch", x, gnd + 2.35, z, 1.35, 0.2, 1.35, yaw)
        b.box_yaw(1, "thatch", x, gnd + 2.05, z, 2.4, 0.4, 2.4, yaw)
        palapas += 1
    print(f"  palapas {palapas}")
    sand_sheet(b, "sand", arx - 95, arz - 90, arx - 40, arz + 55, 10, 0.3, 2.0, True, roads, COAST)
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
            "Arashi Beach: whiter sand and a grid of open thatch palapas on the beach side of the existing umbrella line and dirt parking (arashi_fx, arashi_roadpark), which stay. OSM Arashi Beach node 2610646204. Divi-divi and sea grape along the back of the sand.",
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
        b.mat("win", WIN, 0.35)
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
            # a couple of windows on the longest edge
            n = len(poly)
            edges = []
            for i in range(n):
                a, c = poly[i], poly[(i + 1) % n]
                edges.append((math.hypot(c[0] - a[0], c[1] - a[1]), a, c))
            edges.sort(reverse=True)
            for length, a, c in edges[:2]:
                if length < 4:
                    continue
                dx, dz = c[0] - a[0], c[1] - a[1]
                L = math.hypot(dx, dz) or 1
                oxn, ozn = dz / L, -dx / L
                count = max(1, int(length // 3.2))
                for k in range(count):
                    t = (k + 1) / (count + 1)
                    wx = a[0] + dx * t + oxn * 0.12
                    wz = a[1] + dz * t + ozn * 0.12
                    b.box(0, "win", wx - 0.38, gnd + 1.15, wz - 0.28, wx + 0.38, gnd + 2.15, wz + 0.28)
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
                "First-row houses along L.G. Smith Boulevard from Arashi to Malmok, both sides of the coast road. White and cream plaster on a coral-stone plinth, terracotta hips where OSM says hipped, a low coral wall with a gate toward the road. Hides those OSM boxes. Skips the Arashi Beach Shack and the existing glass villa. Does not touch Malmokweg or the Noord grid inland.",
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
        # Lots sit back from the carriageway; the first row is about 30–45 m inland.
        if not (28 < dx < 46):
            continue
        if dist_roads(roads, bld["cx"], bld["cz"], COAST - {"Avenida Nelson O. Oduber"}) + 8 < dx:
            continue
        pt = interior_point(bld["p"])
        if not pt:
            continue
        bub.append((bld, pt, rd, dx))
    bub.sort(key=lambda t: t[3])
    bub = bub[:8]
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

    # manifest
    data = json.loads(open(MANIFEST).read())
    ids = {e["id"] for e in entries}
    data = [e for e in data if e.get("id") not in ids]
    data.extend(entries)
    out = json.dumps(data, indent=1)
    if not out.endswith("\n"):
        out += "\n"
    open(MANIFEST, "w").write(out)
    print("---")
    for e in entries:
        print(f"{e['id']:18} tris {e['tris'][e['id']+'_lod0']:5}/{e['tris'][e['id']+'_lod1']:<4} at {e['x']:.0f},{e['z']:.0f} hide {len(e['hide'])}")


if __name__ == "__main__":
    build()
