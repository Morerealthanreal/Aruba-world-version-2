#!/usr/bin/env python3
"""North-west shore scene: Malmok houses, Fisherman's Huts, beach bars, signs, rock and sand.

Placement uses the baked-map projection (longitude scaled by cos(lat)), which
matches the road tiles. Terrain Y is sampled from the same DEM the game
bilinear-filters (4 m grid). Each GLB origin sits on that height, and every
vertex stores Y relative to it.

Colours and shapes are checked against ground photos: the Hadicurari shore
(pale sand, dark inshore boulders, a low limestone wall), the white dune sand
under the California Lighthouse, and the Arashi villa row (warm white walls,
terracotta hips) seen from the lighthouse hill. Malmok between the huts and
Tres Trapi is the narrow rocky shelf with sand pockets. Beach bars follow the
open-timber, thick-thatch, turquoise-and-yellow build of a Bugaloe-style bar.
The Palm Beach Bugaloe itself stays where it is. Geometry is original.
Tierra del Sol's streets and the golf resort are not touched.
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
            "asset": {"version": "2.0", "generator": "tools/nw-coast/build_shore.py"},
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



# Photo-checked colours. Albedo, not the sunlit pixel, so the engine light
# still has somewhere to go. Arashi dune sand is the white end; Hadicurari is
# a little greyer; Malmok pockets sit between them. Limestone is the pale
# ironshore, and the inshore boulders are the dark wet rocks in the Hadicurari
# photograph.
SAND_W = (0.90, 0.88, 0.83)
SAND_H = (0.84, 0.83, 0.78)
SAND_M = (0.86, 0.84, 0.78)
LIME = (0.74, 0.71, 0.64)
LIME_D = (0.56, 0.53, 0.48)
WET = (0.40, 0.38, 0.34)
BOULDER_C = (0.32, 0.31, 0.29)
WALL_W = (0.94, 0.92, 0.86)
WALL_C = (0.90, 0.86, 0.76)
TERR_R = (0.72, 0.36, 0.18)
TERR_D = (0.60, 0.28, 0.15)
ROOF_FLAT = (0.78, 0.76, 0.70)
PLINTH = (0.78, 0.70, 0.58)
GLASS_C = (0.52, 0.66, 0.74)
FRAME_W = (0.95, 0.94, 0.90)
SHUT_G = (0.18, 0.36, 0.26)
SHUT_B = (0.20, 0.34, 0.50)
DOOR_C = (0.36, 0.24, 0.16)
# Bugaloe-style: golden thatch hat, turquoise and sun-yellow posts. Not the
# Palm Beach pier bar, and not its name.
THATCH_G = (0.70, 0.52, 0.26)
THATCH_S = (0.46, 0.30, 0.13)
POST_T = (0.12, 0.62, 0.66)
POST_Y = (0.92, 0.70, 0.12)
POST_O = (0.86, 0.42, 0.14)
DECK_C = (0.55, 0.42, 0.28)
TIN = (0.72, 0.74, 0.76)
TIN_R = (0.58, 0.34, 0.22)
HUT_C = [
    (0.20, 0.66, 0.72),
    (0.90, 0.74, 0.18),
    (0.74, 0.22, 0.16),
    (0.93, 0.92, 0.88),
    (0.22, 0.40, 0.66),
    (0.86, 0.48, 0.16),
]
SIGN_BOARD = (0.93, 0.90, 0.82)
SIGN_INK = (0.10, 0.26, 0.42)
SIGN_BLUE = (0.10, 0.32, 0.55)
SIGN_WHITE = (0.95, 0.95, 0.93)
POST_W = (0.42, 0.30, 0.18)

COAST = {
    "L.G. Smith Boulevard",
    "Hudishibana",
    "Avenida Nelson O. Oduber",
}
FRAME = (
    "glb origin = footprint centroid (world x,z); glTF +X = world x, +Z = world z, Y up; "
    "generated by tools/nw-coast/build_shore.py"
)

# 5x7, top row first. Enough for the four roadside boards.
FONT = {
    "A": ["01110", "10001", "10001", "11111", "10001", "10001", "10001"],
    "C": ["01110", "10001", "10000", "10000", "10000", "10001", "01110"],
    "E": ["11111", "10000", "10000", "11110", "10000", "10000", "11111"],
    "F": ["11111", "10000", "10000", "11110", "10000", "10000", "10000"],
    "G": ["01110", "10001", "10000", "10111", "10001", "10001", "01110"],
    "H": ["10001", "10001", "10001", "11111", "10001", "10001", "10001"],
    "I": ["11111", "00100", "00100", "00100", "00100", "00100", "11111"],
    "K": ["10001", "10010", "10100", "11000", "10100", "10010", "10001"],
    "L": ["10000", "10000", "10000", "10000", "10000", "10000", "11111"],
    "M": ["10001", "11011", "10101", "10101", "10001", "10001", "10001"],
    "N": ["10001", "11001", "10101", "10011", "10001", "10001", "10001"],
    "O": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
    "R": ["11110", "10001", "10001", "11110", "10100", "10010", "10001"],
    "S": ["01111", "10000", "10000", "01110", "00001", "00001", "11110"],
    "T": ["11111", "00100", "00100", "00100", "00100", "00100", "00100"],
    "U": ["10001", "10001", "10001", "10001", "10001", "10001", "01110"],
}

_LAND = None


def land_ring():
    global _LAND
    if _LAND is None:
        _LAND = json.load(open(os.path.join(ROOT, "game", "data", "aruba.json")))["land"][0]["outer"]
    return _LAND


def coast_x(z: float):
    ring = land_ring()
    xs = []
    n = len(ring)
    for i in range(n):
        a, bpt = ring[i], ring[(i + 1) % n]
        z0, z1 = a[1], bpt[1]
        if abs(z1 - z0) < 1e-9 or (z - z0) * (z - z1) > 0:
            continue
        t = (z - z0) / (z1 - z0)
        if 0.0 <= t <= 1.0:
            xs.append(a[0] + t * (bpt[0] - a[0]))
    xs = [x for x in xs if x < -8000]
    return min(xs) if xs else None


def load_roads():
    roads = []
    for fn in os.listdir(REAL):
        if not (fn.startswith("r_") and fn.endswith(".json")):
            continue
        data = json.load(open(os.path.join(REAL, fn)))
        for r in data.get("roads") or []:
            if r.get("n") in COAST and len(r.get("p") or []) >= 2:
                roads.append(r)
    return roads


def load_buildings():
    out = []
    for fn in os.listdir(REAL):
        if not (fn.startswith("r_") and fn.endswith(".json")):
            continue
        data = json.load(open(os.path.join(REAL, fn)))
        for b in data.get("b") or []:
            poly = b.get("p") or []
            if len(poly) < 3:
                continue
            xs = [p[0] for p in poly]
            zs = [p[1] for p in poly]
            cx, cz = sum(xs) / len(xs), sum(zs) / len(zs)
            if not (-10000 <= cz <= -8800 and -9300 <= cx <= -8500):
                continue
            out.append(
                {
                    "i": b.get("i"),
                    "h": b.get("h") or 3.4,
                    "k": b.get("k") or "house",
                    "r": b.get("r") or "flat",
                    "p": [(p[0], p[1]) for p in poly],
                    "cx": cx,
                    "cz": cz,
                }
            )
    return out


def road_frame(roads, z):
    """Westernmost coast-road crossing at z: x, full width, name, segment dx, dz."""
    best = None
    for r in roads:
        if r["n"] not in COAST:
            continue
        p = r["p"]
        for a, bpt in zip(p, p[1:]):
            z0, z1 = a[1], bpt[1]
            if abs(z1 - z0) < 0.25:
                continue
            if (z - z0) * (z - z1) > 0:
                continue
            t = (z - z0) / (z1 - z0)
            if t < -0.001 or t > 1.001:
                continue
            x = a[0] + t * (bpt[0] - a[0])
            dx, dz = bpt[0] - a[0], bpt[1] - a[1]
            if best is None or x < best[0] - 0.4:
                best = (x, r["w"], r["n"], dx, dz)
    return best


def inland_normal(dx, dz):
    L = math.hypot(dx, dz) or 1.0
    p1 = (-dz / L, dx / L)
    p2 = (dz / L, -dx / L)
    return p1 if p1[0] >= p2[0] else p2


def face_yaw(fx, fz):
    """box_yaw whose local +z points along (fx, fz)."""
    return math.atan2(-fx, fz)


def append_manifest(entries):
    raw = open(MANIFEST, encoding="utf-8").read()
    data = json.loads(raw)
    keep = [e for e in data if not str(e.get("id", "")).startswith("nw_shore_")]
    m = re.search(r'\n\s*"id": "nw_shore_', raw)
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
            raise SystemExit("could not find the comma before nw_shore_ entries")
        prefix = raw[:comma].rstrip()
    parts = []
    for e in entries:
        dumped = json.dumps(e, indent=1)
        parts.append("\n".join((" " + line) if line else line for line in dumped.split("\n")))
    out = prefix + ",\n" + ",\n".join(parts) + "\n]\n"
    parsed = json.loads(out)
    if parsed[: len(keep)] != keep:
        raise SystemExit("manifest prefix changed while appending shore entries")
    if len(parsed) != len(keep) + len(entries):
        raise SystemExit("manifest count mismatch")
    open(MANIFEST, "w", encoding="utf-8").write(out)


def entry(bid, x, z, tris, switch, refs, hide=None):
    return {
        "id": bid,
        "k": bid,
        "status": "v1-nw-shore",
        "x": round(x, 2),
        "z": round(z, 2),
        "y": 0,
        "rotation": 0,
        "glb": f"models/hero/{bid}.glb",
        "lod": {"hi": f"{bid}_lod0", "lo": f"{bid}_lod1", "switch_m": switch},
        "tris": {f"{bid}_lod0": tris[0], f"{bid}_lod1": tris[1]},
        "textures": 0,
        "hide_footprint": None,
        "hide": hide or [],
        "sign": False,
        "kind": "replace",
        "new_place": False,
        "geo_source": "OSM footprints and coastline, Aruba DEM height tiles",
        "ref_sources": refs,
        "frame": FRAME,
        "cat": "landmark",
        "name": "",
    }


def ccw(poly):
    area = 0.0
    for i in range(len(poly)):
        a, bpt = poly[i], poly[(i + 1) % len(poly)]
        area += a[0] * bpt[1] - bpt[0] * a[1]
    if area < 0:
        return list(reversed(poly)), abs(area) * 0.5
    return list(poly), abs(area) * 0.5


def edges(poly):
    out = []
    n = len(poly)
    for i in range(n):
        a, bpt = poly[i], poly[(i + 1) % n]
        dx, dz = bpt[0] - a[0], bpt[1] - a[1]
        L = math.hypot(dx, dz)
        if L < 0.4:
            continue
        nx, nz = dz / L, -dx / L
        out.append((a, bpt, L, nx, nz))
    out.sort(key=lambda e: -e[2])
    return out


def paint_text(b, lod, mat, text, cx, y, cz, yaw, pix=0.062):
    c, s = math.cos(yaw), math.sin(yaw)

    def wp(lx, ly, lz):
        return (cx + lx * c - lz * s, y + ly, cz + lx * s + lz * c)

    cols = 0
    for ch in text:
        cols += 3 if ch == " " else 6
    width = cols * pix
    lx = -width * 0.5
    for ch in text:
        if ch == " ":
            lx += 3 * pix
            continue
        glyph = FONT[ch]
        for r, row in enumerate(glyph):
            for col, bit in enumerate(row):
                if bit != "1":
                    continue
                px = lx + (col + 0.5) * pix
                py = (6 - r) * pix
                x, yy, z = wp(px, py + pix * 0.5, 0.075)
                b.box_yaw(lod, mat, x, yy - pix * 0.45, z, pix * 0.42, pix * 0.88, 0.012, yaw)
        lx += 6 * pix
    return width


def sign_stroke(b, x, z, yaw, lx0, ly0, lx1, ly1, mat, thick=0.042):
    """A bar lying in the sign face (local x right, y up, z toward the reader)."""
    c, s = math.cos(yaw), math.sin(yaw)
    dx, dy = lx1 - lx0, ly1 - ly0
    L = math.hypot(dx, dy) or 1.0
    px, py = -dy / L * thick * 0.5, dx / L * thick * 0.5

    def wp(lx, ly):
        return (x + lx * c - 0.082 * s, ly, z + lx * s + 0.082 * c)

    b.quad(
        0,
        mat,
        [
            wp(lx0 + px, ly0 + py),
            wp(lx1 + px, ly1 + py),
            wp(lx1 - px, ly1 - py),
            wp(lx0 - px, ly0 - py),
        ],
        (-s, 0.0, c),
    )


def add_sign(b, lines, x, z, yaw, board, ink, g=None, chevron=False):
    g = mesh_height(x, z) if g is None else g
    pix = 0.058
    glyph_h = 7.05 * pix
    gap = 0.07
    pad = 0.10
    n = len(lines)
    hy = pad * 2 + n * glyph_h + max(0, n - 1) * gap
    y0 = g + 1.02
    widths = []
    for i, line in enumerate(lines):
        y = y0 + pad + (n - 1 - i) * (glyph_h + gap)
        widths.append(paint_text(b, 0, ink, line, x, y, z, yaw, pix))
    widest = max(widths) if widths else 0.4
    left = widest * 0.5 + 0.16
    right = widest * 0.5 + (0.58 if chevron else 0.16)
    shift = (right - left) * 0.5
    half = (left + right) * 0.5
    c, s = math.cos(yaw), math.sin(yaw)
    bx, bz = x + shift * c, z + shift * s
    b.box_yaw(0, board, bx, y0, bz, half, hy, 0.04, yaw)
    b.box_yaw(1, board, bx, y0, bz, half, hy, 0.05, yaw)
    for lx in (-left + 0.14, right - 0.14):
        px, pz = x + lx * c, z + lx * s
        b.box(0, "postw", px - 0.06, g - 0.05, pz - 0.06, px + 0.06, y0 + 0.08, pz + 0.06)
        b.box(1, "postw", px - 0.07, g, pz - 0.07, px + 0.07, y0, pz + 0.07)
    if chevron:
        tip = widest * 0.5 + 0.42
        mid = y0 + hy * 0.5
        sign_stroke(b, x, z, yaw, tip, mid, tip - 0.32, mid + 0.15, ink)
        sign_stroke(b, x, z, yaw, tip, mid, tip - 0.32, mid - 0.15, ink)
    return widest


def add_window(b, mx, mz, yaw, nx, nz, y, shutter):
    mx += nx * 0.09
    mz += nz * 0.09
    b.box_yaw(0, "framew", mx, y, mz, 0.50, 1.12, 0.04, yaw)
    b.box_yaw(0, "glassc", mx + nx * 0.035, y + 0.08, mz + nz * 0.035, 0.36, 0.88, 0.015, yaw)
    if shutter is None:
        return
    c, s = math.cos(yaw), math.sin(yaw)
    for side, swing in ((-1, -0.7), (1, 0.75)):
        ox = mx + c * side * 0.46 + nx * 0.16
        oz = mz + s * side * 0.46 + nz * 0.16
        b.box_yaw(0, shutter, ox, y + 0.06, oz, 0.26, 1.02, 0.018, yaw + swing * side)


def add_house(b, house, roads):
    poly, area = ccw(house["p"])
    pt = interior_point(poly)
    if pt is None:
        return None
    ix, iz = pt
    g = mesh_height(ix, iz)
    if g < 0.4 or g > 16:
        return None
    wall_h = 6.15 if house["h"] >= 6 else 3.2
    wall_name = "wallc" if house["i"] % 5 == 0 else "wallw"
    roof_name = "terr" if house["r"] == "hipped" else "rooff"
    b.extrude(0, "plinth", poly, g - 0.04, g + 0.46)
    b.extrude(0, wall_name, poly, g + 0.40, g + wall_h)
    b.extrude(1, "plinth", poly, g - 0.04, g + 0.46)
    b.extrude(1, wall_name, poly, g + 0.40, g + wall_h)
    if house["r"] == "hipped":
        b.hip(0, roof_name, poly, g + wall_h - 0.02, 1.15)
        b.hip(1, roof_name, poly, g + wall_h - 0.02, 1.05)
    else:
        b.extrude(0, roof_name, poly, g + wall_h - 0.08, g + wall_h + 0.22, top=True)
        b.extrude(1, roof_name, poly, g + wall_h - 0.05, g + wall_h + 0.2, top=True)
    els = edges(poly)
    rf = road_frame(roads, iz)
    shut = "shutg" if house["i"] % 3 else "shutb"
    if house["i"] % 4 == 0:
        shut = None
    for i, (a, bpt, L, nx, nz) in enumerate(els[:2]):
        if L < 4.2:
            continue
        mx, mz = (a[0] + bpt[0]) * 0.5, (a[1] + bpt[1]) * 0.5
        yaw = math.atan2(bpt[1] - a[1], bpt[0] - a[0])
        add_window(b, mx, mz, yaw, nx, nz, g + 1.15, shut)
        if wall_h > 5:
            add_window(b, mx, mz, yaw, nx, nz, g + 3.55, shut)
    if rf:
        rx, rw, _, _, _ = rf
        best = None
        for a, bpt, L, nx, nz in els:
            mx, mz = (a[0] + bpt[0]) * 0.5, (a[1] + bpt[1]) * 0.5
            # Outward normal toward the road center at this house's z.
            dot = nx * (rx - mx) + nz * (iz - mz)
            if best is None or dot > best[0]:
                best = (dot, a, bpt, L, nx, nz, mx, mz)
        if best and best[0] > 0 and best[3] > 2.4:
            _, a, bpt, L, nx, nz, mx, mz = best
            yaw = math.atan2(bpt[1] - a[1], bpt[0] - a[0])
            b.box_yaw(0, "doorc", mx + nx * 0.08, g + 0.42, mz + nz * 0.08, 0.42, 2.05, 0.03, yaw)
            # Low white wall toward the road, only when it clears the asphalt.
            gap = math.hypot(rx - mx, iz - mz)
            if rw * 0.5 + 3.2 < gap < 16:
                c, s = math.cos(yaw), math.sin(yaw)
                wx = mx + nx * min(2.2, gap - rw * 0.5 - 1.4)
                wz = mz + nz * min(2.2, gap - rw * 0.5 - 1.4)
                if math.hypot(rx - wx, iz - wz) > rw * 0.5 + 1.3:
                    span = min(L * 0.55, 7.5)
                    b.box_yaw(0, "wallw", wx, g, wz, span * 0.5, 0.72, 0.12, yaw)
                    b.box_yaw(1, "wallw", wx, g, wz, span * 0.5, 0.65, 0.14, yaw)
    return [round(ix, 2), round(iz, 2)]


def add_hut(b, x, z, yaw, color_name, roof):
    g = mesh_height(x, z)
    hw, hd = 2.05, 1.55
    # Deck, then three walls, open on the sea side (local -z).
    b.box_yaw(0, "deckc", x, g, z, hw + 0.35, 0.18, hd + 0.45, yaw)
    b.box_yaw(1, "deckc", x, g, z, hw, 0.22, hd, yaw)
    c, s = math.cos(yaw), math.sin(yaw)
    posts = []
    for lx in (-hw, hw):
        for lz in (-hd, hd):
            posts.append((x + lx * c - lz * s, z + lx * s + lz * c))
    for px, pz in posts:
        b.box(0, "postw", px - 0.07, g, pz - 0.07, px + 0.07, g + 2.35, pz + 0.07)
    # Back and two sides. Leave the sea face (local -z) open so the hut reads as a shelter.
    def wall_at(lx0, lz0, lx1, lz1, ox, oz):
        a = (x + lx0 * c - lz0 * s, z + lx0 * s + lz0 * c)
        bpt = (x + lx1 * c - lz1 * s, z + lx1 * s + lz1 * c)
        wx, wz = ox * c - oz * s, ox * s + oz * c
        b.quad(
            0,
            color_name,
            [
                (a[0], g + 0.18, a[1]),
                (bpt[0], g + 0.18, bpt[1]),
                (bpt[0], g + 2.2, bpt[1]),
                (a[0], g + 2.2, a[1]),
            ],
            (wx, 0, wz),
        )

    wall_at(-hw, hd, hw, hd, 0, 1)
    wall_at(-hw, hd, -hw, -hd, -1, 0)
    wall_at(hw, -hd, hw, hd, 1, 0)
    if roof == "thatch":
        # posts are (-hw,-hd), (-hw,+hd), (+hw,-hd), (+hw,+hd). Walk the rectangle.
        ring = [posts[0], posts[2], posts[3], posts[1]]
        b.hip(0, "thatchg", ring, g + 2.15, 0.85)
    else:
        tin = "tinr" if roof == "rust" else "tinc"
        overhang = 0.35
        b.box_yaw(0, tin, x, g + 2.2, z, hw + overhang, 0.08, hd + overhang, yaw)
        b.box_yaw(0, tin, x, g + 2.32, z, hw + 0.1, 0.05, hd * 0.55, yaw)
    # lod1 mass
    b.box_yaw(1, color_name, x, g + 0.15, z, hw, 2.15, hd, yaw)
    b.box_yaw(1, "thatchg" if roof == "thatch" else "tinc", x, g + 2.25, z, hw + 0.2, 0.35, hd + 0.2, yaw)


def add_bar(b, x, z, yaw):
    """Open thatch bar: thick golden roof, turquoise and yellow posts, timber deck."""
    g = mesh_height(x, z)
    hw, hd = 4.1, 2.7
    b.box_yaw(0, "deckc", x, g, z, hw, 0.28, hd, yaw)
    b.box_yaw(1, "deckc", x, g, z, hw, 0.3, hd, yaw)
    c, s = math.cos(yaw), math.sin(yaw)
    colors = ["postt", "posty", "posto", "postt", "posty", "posto"]
    k = 0
    pts = []
    for lx in (-hw + 0.35, 0, hw - 0.35):
        for lz in (-hd + 0.3, hd - 0.3):
            px = x + lx * c - lz * s
            pz = z + lx * s + lz * c
            pts.append((px, pz))
            col = colors[k % len(colors)]
            k += 1
            b.cyl(0, col, px, g + 0.25, pz, 0.11, g + 2.45, 0.10, 8)
            b.box(1, col, px - 0.12, g + 0.25, pz - 0.12, px + 0.12, g + 2.4, pz + 0.12)
    # Hip over the post ring, plus a dark skirt so the eave reads as thatch.
    ring = []
    for lx in (-hw - 0.35, hw + 0.35):
        for lz in (-hd - 0.25, hd + 0.45):
            ring.append((x + lx * c - lz * s, z + lx * s + lz * c))
    # ring order needs to be around the rectangle: (-,-), (+,-), (+,+), (-,+)
    ordered = [ring[0], ring[2], ring[3], ring[1]]
    b.hip(0, "thatchg", ordered, g + 2.35, 1.15)
    b.hip(1, "thatchg", ordered, g + 2.35, 1.0)
    for i in range(4):
        a, bpt = ordered[i], ordered[(i + 1) % 4]
        b.quad(
            0,
            "thatchs",
            [
                (a[0], g + 2.05, a[1]),
                (bpt[0], g + 2.05, bpt[1]),
                (bpt[0], g + 2.42, bpt[1]),
                (a[0], g + 2.42, a[1]),
            ],
            (bpt[1] - a[1], 0, a[0] - bpt[0]),
        )
    # Counter along the back (local +z).
    b.box_yaw(0, "deckc", x + (-s) * (hd - 0.7), g + 0.28, z + c * (hd - 0.7), hw - 0.5, 0.95, 0.38, yaw)
    # Two picnic tables on the open side.
    for side in (-1.3, 1.3):
        tx = x + c * side - (-s) * 0.4
        tz = z + s * side + c * 0.4
        b.box_yaw(0, "postw", tx, g + 0.28, tz, 0.7, 0.08, 0.38, yaw)
        for lx in (-0.55, 0.55):
            for lz in (-0.25, 0.25):
                px = tx + lx * c - lz * s
                pz = tz + lx * s + lz * c
                b.box(0, "postw", px - 0.04, g + 0.28, pz - 0.04, px + 0.04, g + 0.72, pz + 0.04)
    # Half-wall of turquoise at the back, the painted band under the thatch.
    b.box_yaw(0, "postt", x - s * (hd - 0.15), g + 0.28, z + c * (hd - 0.15), hw - 0.2, 0.85, 0.08, yaw)


def boulder(b, x, z, yaw, scale, top):
    bh = mesh_height(x, z)
    bot = max(top - 0.75 * scale, min(bh, 0.05) - 0.08)
    if top - bot < 0.18:
        return
    b.box_yaw(0, "boulder", x, bot, z, 0.7 * scale, top - bot, 0.55 * scale, yaw)
    b.box_yaw(0, "limed", x + 0.35 * scale, bot + 0.05, z + 0.2, 0.4 * scale, max(0.2, (top - bot) * 0.7), 0.35 * scale, yaw + 0.6)
    if scale > 0.8:
        b.box_yaw(1, "boulder", x, bot, z, 0.75 * scale, top - bot, 0.6 * scale, yaw)


def sand_cell(b, mat, x, z, step, lod):
    h00 = mesh_height(x, z)
    h10 = mesh_height(x + step, z)
    h11 = mesh_height(x + step, z + step)
    h01 = mesh_height(x, z + step)
    hs = (h00, h10, h11, h01)
    if min(hs) < 0.18 or max(hs) > 3.3:
        return False
    if max(hs) - min(hs) > 1.15:
        return False
    lift = 0.055 if lod == 0 else 0.08
    b.quad(
        lod,
        mat,
        [
            (x, h00 + lift, z),
            (x + step, h10 + lift, z),
            (x + step, h11 + lift, z + step),
            (x, h01 + lift, z + step),
        ],
        (0, 1, 0),
    )
    return True


def _on_house(x, z, step, polys):
    if not polys:
        return False
    for px, pz in (
        (x + step * 0.5, z + step * 0.5),
        (x, z),
        (x + step, z),
        (x + step, z + step),
        (x, z + step),
    ):
        for poly in polys:
            if inside(poly, px, pz):
                return True
    return False


def shore_pass(b, z0, z1, mode, houses=()):
    """mode: 'sand' (Arashi white), 'rock' (Malmok shelf), 'huts' (Hadicurari)."""
    roads_ok = 0
    step = 8.0 if mode != "rock" else 9.0
    z = z0
    band = 42.0 if mode == "sand" else (28.0 if mode == "rock" else 36.0)
    n_sand = n_rock = 0
    while z < z1:
        cx = coast_x(z + step * 0.5)
        rf = road_frame(roads_hold, z + step * 0.5)
        if cx is None:
            z += step
            continue
        limit = cx + band
        if rf:
            asphalt = rf[0] - rf[1] * 0.5 - 2.0
            limit = min(limit, asphalt)
        x = cx + 1.5
        col = 0
        while x + step < limit:
            mat = {"sand": "sandw", "rock": "sandm", "huts": "sandh"}[mode]
            # Malmok keeps sand to pockets: every other inland cell.
            if mode == "rock" and col % 2 == 1 and x > cx + 12:
                x += step
                col += 1
                continue
            if _on_house(x, z, step, houses):
                x += step
                col += 1
                continue
            if sand_cell(b, mat, x, z, step, 0):
                n_sand += 1
                if col % 2 == 0 and int(z / step) % 2 == 0:
                    sand_cell(b, mat, x, z, step, 1)
            x += step
            col += 1
        # Waterline rock and an inshore boulder.
        h_in = mesh_height(cx + 6, z)
        h_out = mesh_height(cx - 6, z)
        if rf is None or cx + 2 < rf[0] - rf[1] * 0.5 - 1.0:
            if 0.15 <= h_in <= 2.6:
                b.box_yaw(0, "wet", cx + 1.2, h_in - 0.05, z, 1.5, 0.22, 1.05, 0.4)
                if mode != "sand" or int(z) % 24 < 8:
                    b.box_yaw(0, "lime", cx + 3.4, h_in - 0.02, z + 1.1, 1.8, 0.32, 1.15, -0.3)
                    n_rock += 1
                if int(z) % 18 < 9:
                    b.box_yaw(1, "lime", cx + 2.4, max(h_in, 0.2), z, 1.6, 0.28, 1.0, 0.2)
            elif h_in > 2.6:
                # Cliff face: a short tumble of limestone down the slope.
                px = cx + 2
                for k in range(4):
                    hh = mesh_height(px, z)
                    if hh < 0.3:
                        break
                    b.box_yaw(0, "lime" if k % 2 == 0 else "limed", px, hh - 0.08, z, 1.3, 0.4, 0.9, 0.5 * k)
                    px -= 3.2
                    n_rock += 1
        if mode != "sand" and h_out < 0.4 and (rf is None or cx - 5 < rf[0] - rf[1] * 0.5):
            every = 22 if mode == "huts" else 28
            if int(z) % every < step:
                top = 0.58 if mode == "huts" else 0.48
                boulder(b, cx - 5.5, z, 0.3, 1.15 if mode == "huts" else 0.9, top)
                n_rock += 1
        if mode == "huts" and int(z) % 16 < step:
            wx = cx + 32
            if rf and wx < rf[0] - rf[1] * 0.5 - 3:
                wh = mesh_height(wx, z)
                if 0.35 <= wh <= 1.7:
                    b.box_yaw(0, "lime", wx, wh - 0.04, z, 3.2, 0.55, 0.32, 0.15)
                    b.box_yaw(1, "lime", wx, wh, z, 3.0, 0.45, 0.34, 0.15)
        z += step
    return n_sand, n_rock


roads_hold = []


def register(b: B):
    b.mat("wallw", WALL_W, 0.82)
    b.mat("wallc", WALL_C, 0.84)
    b.mat("plinth", PLINTH, 0.9)
    b.mat("terr", TERR_R, 0.78)
    b.mat("terrd", TERR_D, 0.8)
    b.mat("rooff", ROOF_FLAT, 0.9)
    b.mat("framew", FRAME_W, 0.55)
    b.mat("glassc", GLASS_C, 0.14)
    b.mat("shutg", SHUT_G, 0.7)
    b.mat("shutb", SHUT_B, 0.68)
    b.mat("doorc", DOOR_C, 0.72)
    b.mat("sandw", SAND_W, 0.96)
    b.mat("sandh", SAND_H, 0.96)
    b.mat("sandm", SAND_M, 0.96)
    b.mat("lime", LIME, 0.92)
    b.mat("limed", LIME_D, 0.9)
    b.mat("wet", WET, 0.72)
    b.mat("boulder", BOULDER_C, 0.88)
    b.mat("deckc", DECK_C, 0.78)
    b.mat("thatchg", THATCH_G, 0.95)
    b.mat("thatchs", THATCH_S, 0.96)
    b.mat("postt", POST_T, 0.55)
    b.mat("posty", POST_Y, 0.55)
    b.mat("posto", POST_O, 0.55)
    b.mat("postw", POST_W, 0.8)
    b.mat("tinc", TIN, 0.45)
    b.mat("tinr", TIN_R, 0.62)
    for i, rgb in enumerate(HUT_C):
        b.mat(f"hut{i}", rgb, 0.7)
    b.mat("signb", SIGN_BOARD, 0.7)
    b.mat("signi", SIGN_INK, 0.6)
    b.mat("signu", SIGN_BLUE, 0.5)
    b.mat("signw", SIGN_WHITE, 0.45)


def build():
    global roads_hold
    roads_hold = load_roads()
    buildings = load_buildings()
    houses = []
    skip_ids = {366, 7001}
    avoid = [(-9006.4, -9823.7, 14), (-8793.0, -9260.0, 16), (-8852.0, -9450.0, 18)]
    for bld in buildings:
        if bld["i"] in skip_ids:
            continue
        if bld["k"] not in ("house", "com"):
            continue
        if not (-9860 <= bld["cz"] <= -9090):
            continue
        rf = road_frame(roads_hold, bld["cz"])
        if not rf or rf[2] != "L.G. Smith Boulevard":
            continue
        # Seaward villas sit well off the centre line; the inland row is still
        # Malmok. Tierra del Sol is the next neighbourhood east of this band.
        dx = bld["cx"] - rf[0]
        if dx < -62 or dx > 72:
            continue
        if any(math.hypot(bld["cx"] - ax, bld["cz"] - az) < rad for ax, az, rad in avoid):
            continue
        poly, area = ccw(bld["p"])
        if area < 28 or area > 420:
            continue
        bld["p"] = poly
        houses.append(bld)
    print("houses", len(houses))

    hx = sum(h["cx"] for h in houses) / len(houses)
    hz = sum(h["cz"] for h in houses) / len(houses)
    hb = B(hx, hz, height(hx, hz))
    register(hb)
    hides = []
    kept = 0
    for h in houses:
        pt = add_house(hb, h, roads_hold)
        if pt:
            hides.append(pt)
            kept += 1
    # Malmok board on the inland shoulder, clear of the villas.
    rf = road_frame(roads_hold, -9385)
    if rf:
        inn = inland_normal(rf[3], rf[4])
        sx = rf[0] + inn[0] * (rf[1] * 0.5 + 3.2)
        sz = -9385 + inn[1] * (rf[1] * 0.5 + 3.2)
        yaw = face_yaw(-inn[0], -inn[1])
        add_sign(hb, ["MALMOK"], sx, sz, yaw, "signb", "signi")
        print("malmok sign", round(sx, 1), round(sz, 1))
    htris = hb.save(os.path.join(HERO, "nw_shore_houses.glb"), "nw_shore_houses")
    print("house tris", htris, "kept", kept)

    # North shore: lighthouse road, Arashi sand, Boca cliff rock, down to Tres Trapi.
    nx, nz = -9005.0, -9700.0
    nb = B(nx, nz, height(nx, nz))
    register(nb)
    print("north sand/rock", shore_pass(nb, -10440, -9050, "sand", [h["p"] for h in houses]))
    # Arashi bar on the sand, south of the palapa field and seaward of the shack.
    cz = -9836.0
    cx = coast_x(cz)
    if cx:
        bx, bz = cx + 16.0, cz
        # Face the open side toward the sea (local -z ~ west, -x).
        add_bar(nb, bx, bz, yaw=math.atan2(0.15, -1.0))
        print("arashi bar", round(bx, 1), round(bz, 1), "h", round(mesh_height(bx, bz), 2))
    rf = road_frame(roads_hold, -9888)
    if rf:
        inn = inland_normal(rf[3], rf[4])
        sx = rf[0] + inn[0] * (rf[1] * 0.5 + 2.8)
        sz = -9888 + inn[1] * 2
        add_sign(nb, ["ARASHI"], sx, sz, face_yaw(-inn[0], -inn[1]), "signb", "signi")
        print("arashi sign", round(sx, 1), round(sz, 1))
    rf = road_frame(roads_hold, -10170)
    if rf and rf[2] == "Hudishibana":
        # West shoulder, so the board stays off the resort side of the road.
        inn = inland_normal(rf[3], rf[4])
        sx = rf[0] - inn[0] * (rf[1] * 0.5 + 3.0)
        sz = -10170 - inn[1] * 2
        yaw = face_yaw(inn[0], inn[1])
        add_sign(nb, ["LIGHTHOUSE"], sx, sz, yaw, "signu", "signw", chevron=True)
        print("lighthouse sign", round(sx, 1), round(sz, 1), rf[2])
    ntris = nb.save(os.path.join(HERO, "nw_shore_north.glb"), "nw_shore_north")
    print("north tris", ntris)

    # South shore: Malmok rock shelf and the Fisherman's Huts beach.
    sx0, sz0 = -8450.0, -7900.0
    sb = B(sx0, sz0, height(sx0, sz0))
    register(sb)
    print("malmok rock", shore_pass(sb, -9050, -7580, "rock"))
    print("huts sand", shore_pass(sb, -7580, -7120, "huts"))
    hut_n = 0
    for i, z in enumerate(range(-7520, -7160, 28)):
        cx = coast_x(z)
        rf = road_frame(roads_hold, z)
        if cx is None or rf is None:
            continue
        x = cx + 18 + (i % 3) * 3.5
        if x > rf[0] - rf[1] * 0.5 - 12:
            continue
        h = mesh_height(x, z)
        if not (0.35 <= h <= 1.8):
            continue
        # hadicurari_fx occupies about x -8284..-8229, z -7297..-7246.
        if (x - 3.2) < -8223 and (x + 3.2) > -8290 and (z - 2.6) < -7240 and (z + 2.6) > -7303:
            continue
        # Open toward the sea. Sea is -x, so yaw ~ pi (local -z aims west if yaw is atan2(0,-1)=pi).
        roofs = ("thatch", "tin", "rust", "thatch")
        add_hut(sb, x, z, math.pi * 0.92, f"hut{i % len(HUT_C)}", roofs[i % 4])
        hut_n += 1
        print(" hut", round(x, 1), z, "h", round(h, 2))
    # In the gap between huts, seaward of the row, clear of the sail rack.
    cz = -7338.0
    cx = coast_x(cz)
    if cx:
        bx = cx + 11
        add_bar(sb, bx, cz, math.pi * 0.95)
        print("huts bar", round(bx, 1), cz, "h", round(mesh_height(bx, cz), 2))
    rf = road_frame(roads_hold, -7288)
    if rf:
        inn = inland_normal(rf[3], rf[4])
        qx = rf[0] + inn[0] * (rf[1] * 0.5 + 3.0)
        qz = -7288 + inn[1] * (rf[1] * 0.5 + 3.0)
        add_sign(sb, ["FISHERMANS", "HUTS"], qx, qz, face_yaw(-inn[0], -inn[1]), "signb", "signi")
        print("huts sign", round(qx, 1), round(qz, 1), "road", rf[2])
    stris = sb.save(os.path.join(HERO, "nw_shore_south.glb"), "nw_shore_south")
    print("south tris", stris, "huts", hut_n)

    refs_h = (
        "OSM house footprints on L.G. Smith Boulevard from Arashi to Malmok; "
        "Arashi villa row in File:Arashi, Aruba - panoramio.jpg (white walls, terracotta hips); "
        "skips the Arashi Beach Shack, the glass villa, and the lion gate"
    )
    refs_n = (
        "Western shoreline Arashi to the California Lighthouse road. "
        "White dune sand from File:California lighthouse Aruba Arashi beach 2.jpg; "
        "wet limestone and cliff rock at Boca Catalina; "
        "Bugaloe-style open thatch bar on the Arashi sand, not the De Palm Pier bar"
    )
    refs_s = (
        "Malmok rocky shelf (Visit Aruba: narrow ironshore, sand pockets) and "
        "Fisherman's Huts / Hadicurari. Pale sand, dark inshore boulders and a low "
        "limestone wall from File:Hadicurari Beach Palm Beach View Noord Aruba.jpg; "
        "painted timber huts and a thatch beach bar on the sand seaward of the sail rack"
    )
    entries = [
        entry("nw_shore_houses", hx, hz, htris, 220, refs_h, hides),
        entry("nw_shore_north", nx, nz, ntris, 340, refs_n),
        entry("nw_shore_south", sx0, sz0, stris, 320, refs_s),
    ]
    append_manifest(entries)
    print("manifest appended", [e["id"] for e in entries])


if __name__ == "__main__":
    build()
