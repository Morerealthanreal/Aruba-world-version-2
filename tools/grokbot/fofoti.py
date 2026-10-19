#!/usr/bin/env python3
"""Eagle Beach fofoti trees and the palapa huts beside them.

The Wikimedia photos (Divi divi tree Eagle Beach; Conocarpus erectus at
Eagle Beach, 2019) show a grey trunk that rises and then streams west over
the sand, a tangle of roots, a flat green canopy, a wooden gazebo and
thatched huts. Same hero ids and origins. Nothing is pasted.
"""
import json
import math
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from hero_glb import Model, box, check_glb, write_glb  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"

BARK = (0.70, 0.68, 0.64)
ROOT = (0.55, 0.53, 0.50)
LEAF = (0.16, 0.36, 0.12)
SAND = (0.93, 0.88, 0.76)
THATCH = (0.72, 0.55, 0.28)
THATCH_D = (0.55, 0.40, 0.18)
WOOD = (0.58, 0.42, 0.24)
ROCK = (0.62, 0.60, 0.56)
FLAG = (0.95, 0.82, 0.15)
CHAIR = (0.15, 0.16, 0.18)


def lin(c):
    return tuple(round(min(1.0, v) ** 2.2, 4) for v in c)


def tube(mesh, path, r0, r1, sides):
    rings = []
    for i, (x, y, z) in enumerate(path):
        if i == 0:
            dx, dy, dz = path[1][0] - x, path[1][1] - y, path[1][2] - z
        elif i == len(path) - 1:
            dx, dy, dz = x - path[i - 1][0], y - path[i - 1][1], z - path[i - 1][2]
        else:
            dx = path[i + 1][0] - path[i - 1][0]
            dy = path[i + 1][1] - path[i - 1][1]
            dz = path[i + 1][2] - path[i - 1][2]
        L = math.sqrt(dx * dx + dy * dy + dz * dz) or 1.0
        dx, dy, dz = dx / L, dy / L, dz / L
        sx, sy, sz = (0, 1, 0) if abs(dy) < 0.9 else (1, 0, 0)
        rx = sy * dz - sz * dy
        ry = sz * dx - sx * dz
        rz = sx * dy - sy * dx
        L2 = math.sqrt(rx * rx + ry * ry + rz * rz) or 1.0
        rx, ry, rz = rx / L2, ry / L2, rz / L2
        ux, uy, uz = dy * rz - dz * ry, dz * rx - dx * rz, dx * ry - dy * rx
        rad = r0 + (r1 - r0) * (i / (len(path) - 1))
        ring = []
        for k in range(sides):
            a = k / sides * math.tau
            ca, sa = math.cos(a), math.sin(a)
            ring.append((
                x + (rx * ca + ux * sa) * rad,
                y + (ry * ca + uy * sa) * rad,
                z + (rz * ca + uz * sa) * rad,
            ))
        rings.append(ring)
    for i in range(len(rings) - 1):
        for k in range(sides):
            j = (k + 1) % sides
            mesh.quad(rings[i][k], rings[i][j], rings[i + 1][j], rings[i + 1][k])


def yaw(p, spin, origin):
    c, s = math.cos(spin), math.sin(spin)
    x, y, z = p
    return (origin[0] + x * c - z * s, y, origin[1] + x * s + z * c)


def tree(M, ox, oz, scale=1.0, spin=0.0, detail=True):
    """Grey trunk bent west, roots on the sand, a flat canopy over the lean."""
    origin = (ox, oz)

    def P(path):
        return [yaw((x * scale, y * scale, z * scale), spin, origin) for x, y, z in path]

    trunk = [
        (0.35, 0.25, 0.05), (0.05, 1.25, 0.0), (-1.1, 1.9, 0.08),
        (-3.2, 2.05, -0.06), (-5.6, 1.85, 0.05), (-8.0, 1.65, -0.04), (-10.2, 1.5, 0.02),
    ]
    sides = 7 if detail else 4
    tube(M.mesh(0, "bark"), P(trunk), 0.95 * scale, 0.32 * scale, sides)
    tube(M.mesh(1, "bark"), P(trunk[::2]), 0.85 * scale, 0.36 * scale, 4)
    if detail:
        roots = [
            [(0.7, 0.35, 0.15), (1.8, 0.16, 1.1), (3.2, 0.06, 2.0)],
            [(0.75, 0.3, -0.1), (2.0, 0.12, -0.9), (3.4, 0.05, -1.8)],
            [(0.4, 0.32, 0.3), (0.1, 0.1, 1.6), (-0.6, 0.05, 2.8)],
            [(0.6, 0.28, -0.2), (1.4, 0.1, -1.7), (2.1, 0.05, -2.9)],
            [(0.2, 0.4, 0.05), (-0.8, 0.14, 1.1), (-1.8, 0.05, 2.0)],
            [(0.5, 0.22, 0.4), (1.6, 0.08, 0.2), (2.8, 0.04, 0.15)],
        ]
        for path in roots:
            tube(M.mesh(0, "root"), P(path), 0.36 * scale, 0.1 * scale, 5)
        clumps = [
            (-3.0, 2.35, 0.0, 3.6, 0.55, 3.0),
            (-6.2, 2.1, 0.1, 4.4, 0.5, 3.4),
            (-9.0, 1.9, -0.05, 3.4, 0.42, 2.8),
            (-5.2, 2.45, 1.8, 2.6, 0.38, 1.6),
            (-5.6, 2.4, -1.8, 2.8, 0.38, 1.7),
            (-8.2, 2.15, 1.5, 2.2, 0.32, 1.5),
        ]
        leaf = M.mesh(0, "leaf")
        for x, y, z, rx, ry, rz in clumps:
            px, py, pz = yaw((x * scale, y * scale, z * scale), spin, origin)
            box(leaf, px, py, pz, rx * scale, ry * scale, rz * scale)
    leaf1 = M.mesh(1, "leaf")
    px, py, pz = yaw((-6.4 * scale, 2.05 * scale, 0), spin, origin)
    box(leaf1, px, py, pz, 9.2 * scale, 0.7 * scale, 4.4 * scale)


def rock(M, x, z, s=0.7):
    box(M.mesh(0, "rock"), x, 0.18 * s, z, s, 0.36 * s, s * 0.8)


def chair(M, x, z):
    # Beach chair, long enough to read next to a person-height hut.
    box(M.mesh(0, "chair"), x, 0.42, z, 0.72, 0.1, 1.7)
    box(M.mesh(0, "chair"), x, 0.78, z + 0.72, 0.72, 0.62, 0.1)


def flag(M, x, z):
    box(M.mesh(0, "wood"), x, 1.6, z, 0.06, 3.2, 0.06)
    M.mesh(0, "flag").quad(
        (x, 2.7, z), (x - 0.7, 2.55, z), (x - 0.7, 2.2, z), (x, 2.35, z),
    )


def gazebo(M, x, z):
    """Open wooden hut from the 2019 beach photo: four posts and a hip roof."""
    for dx, dz in ((-1.6, -1.6), (1.6, -1.6), (1.6, 1.6), (-1.6, 1.6)):
        box(M.mesh(0, "wood"), x + dx, 1.35, z + dz, 0.22, 2.7, 0.22)
        box(M.mesh(1, "wood"), x + dx, 1.35, z + dz, 0.28, 2.7, 0.28)
    wood = M.mesh(0, "wood")
    y0, peak = 2.25, 3.15
    corners = [(x - 1.6, y0, z - 1.6), (x + 1.6, y0, z - 1.6), (x + 1.6, y0, z + 1.6), (x - 1.6, y0, z + 1.6)]
    tip = (x, peak, z)
    for i in range(4):
        wood.tri(tip, corners[i], corners[(i + 1) % 4])
    M.mesh(1, "wood").tri(tip, corners[0], corners[2])
    box(M.mesh(0, "wood"), x, 0.45, z - 0.4, 1.4, 0.08, 0.4)


def palapa(M, x, z, detail=True):
    """Round thatch hut: posts, layered cap, ragged fringe, a bench."""
    post = M.mesh(0 if detail else 1, "wood")
    for dx, dz in ((-1.15, -1.15), (1.15, -1.15), (1.15, 1.15), (-1.15, 1.15)):
        box(post, x + dx, 1.35, z + dz, 0.22, 2.7, 0.22)
    if not detail:
        box(M.mesh(1, "thatch"), x, 2.9, z, 5.2, 0.55, 5.2)
        return
    thatch = M.mesh(0, "thatch")
    dark = M.mesh(0, "thatchd")
    sides = 8
    layers = [(2.45, 2.55), (2.8, 1.9), (3.15, 1.15), (3.4, 0.35)]
    rings = []
    for y, r in layers:
        ring = []
        for i in range(sides):
            a = i / sides * math.tau
            ring.append((x + math.cos(a) * r, y, z + math.sin(a) * r))
        rings.append(ring)
    for i in range(len(rings) - 1):
        for k in range(sides):
            j = (k + 1) % sides
            (thatch if i % 2 == 0 else dark).quad(
                rings[i][k], rings[i][j], rings[i + 1][j], rings[i + 1][k],
            )
    top = (x, 3.65, z)
    for k in range(sides):
        thatch.tri(top, rings[-1][k], rings[-1][(k + 1) % sides])
    # ragged hem
    y, r = 2.45, 2.55
    for i in range(sides):
        a0 = i / sides * math.tau
        a1 = (i + 0.7) / sides * math.tau
        drop = 0.45 + (i % 3) * 0.18
        b0 = (x + math.cos(a0) * r, y, z + math.sin(a0) * r)
        b1 = (x + math.cos(a1) * r, y, z + math.sin(a1) * r)
        t0 = (x + math.cos(a0) * (r + 0.15), y - drop, z + math.sin(a0) * (r + 0.15))
        t1 = (x + math.cos(a1) * (r + 0.15), y - drop, z + math.sin(a1) * (r + 0.15))
        dark.quad(b0, b1, t1, t0)
    box(M.mesh(0, "wood"), x, 0.42, z, 1.3, 0.08, 0.45)
    box(M.mesh(1, "thatch"), x, 2.9, z, 5.2, 0.55, 5.2)
    box(M.mesh(1, "wood"), x, 1.35, z, 0.24, 2.7, 0.24)


def sand(M, x0, x1, z0, z1, lod=0):
    box(M.mesh(lod, "sand"), (x0 + x1) / 2, 0.06, (z0 + z1) / 2, abs(x1 - x0), 0.1, abs(z1 - z0))


def new_model():
    M = Model("tmp")
    for name, rgb, rough in (
        ("bark", BARK, 0.9), ("root", ROOT, 0.92), ("leaf", LEAF, 0.8),
        ("sand", SAND, 0.95), ("thatch", THATCH, 0.9), ("thatchd", THATCH_D, 0.92),
        ("wood", WOOD, 0.8), ("rock", ROCK, 0.85), ("flag", FLAG, 0.5), ("chair", CHAIR, 0.6),
    ):
        M.material(name, lin(rgb), rough=rough, double=(name in ("flag", "thatch", "thatchd", "leaf")))
    return M


def build_scene():
    M = new_model()
    M.name = "eaglebeach_fx"
    # Three wind-bent trees along the sand, leaning west (-X).
    tree(M, 2.0, -6.0, 1.15, 0.05)
    tree(M, -1.0, 4.0, 0.85, -0.15)
    tree(M, 3.5, 12.0, 0.7, 0.1)
    rock(M, 4.2, -5.2, 0.9)
    rock(M, 3.4, -7.4, 0.55)
    rock(M, 1.2, 5.5, 0.6)
    chair(M, -1.2, -7.2)
    chair(M, -1.4, -5.2)
    chair(M, 0.6, -8.4)
    chair(M, 5.5, 2.5)
    gazebo(M, 8.0, -2.0)
    flag(M, 6.2, 1.5)
    flag(M, 9.4, 2.2)
    for i, z in enumerate((-14, -8, 8, 16)):
        palapa(M, -6.5, z)
    sand(M, -14, 14, -20, 22, 0)
    sand(M, -14, 14, -20, 22, 1)
    return finish(M)


def build_one_tree(name, scale, spin):
    M = new_model()
    M.name = name
    tree(M, 0.4, 0.0, scale, spin)
    rock(M, 2.2, 1.1, 0.7)
    rock(M, 1.6, -1.4, 0.45)
    sand(M, -8, 6, -5, 5, 0)
    return finish(M)


def build_hut(name):
    M = new_model()
    M.name = name
    palapa(M, 0, 0, detail=True)
    sand(M, -2.4, 2.4, -2.4, 2.4, 0)
    return finish(M)


def finish(M):
    info = write_glb(M, HERO / f"{M.name}.glb")
    check_glb(HERO / f"{M.name}.glb")
    if info["lod1"] >= 600:
        raise SystemExit(f"{M.name} lod1 {info['lod1']}")
    print(M.name, info)
    return info


def patch(name, info, status, sources):
    text = MANIFEST.read_text()
    i = text.find(f'"id": "{name}"')
    if i < 0:
        raise SystemExit(f"missing {name}")
    k = text.find('\n  "id":', i + 10)
    if k < 0:
        k = len(text)
    block = text[i:k]
    block, n = re.subn(r'"status": "[^"]*"', f'"status": "{status}"', block, count=1)
    if n != 1:
        raise SystemExit(f"{name} status")
    block = re.sub(rf'"{name}_lod0": \d+', f'"{name}_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(rf'"{name}_lod1": \d+', f'"{name}_lod1": {info["lod1"]}', block, count=1)
    block = re.sub(r'"textures": \d+', '"textures": 0', block, count=1)
    new = '"ref_sources": "' + sources + '"'
    block, n = re.subn(r'"ref_sources": "(?:[^"\\]|\\.)*"', new, block, count=1)
    if n != 1:
        raise SystemExit(f"{name} refs")
    MANIFEST.write_text(text[:i] + block + text[k:])


TREE_SRC = (
    "Wikimedia Commons File:Divi divi tree Eagle Beach.jpg and "
    "File:Mangrove tree (Conocarpus erectus) at Eagle Beach, Aruba 2019.jpg "
    "(CC BY-SA): grey trunk bent west, exposed roots, flat green canopy, rocks on white sand. "
    "No photo is pasted. Built by tools/grokbot/fofoti.py"
)
HUT_SRC = (
    "Wikimedia Commons File:Mangrove tree (Conocarpus erectus) at Eagle Beach, Aruba 2019.jpg "
    "(CC BY-SA): wooden gazebo and round thatched huts with a ragged hem and a bench. "
    "No photo is pasted. Built by tools/grokbot/fofoti.py"
)


def main():
    scene = build_scene()
    patch(
        "eaglebeach_fx", scene,
        "v4-grokbot (wind-bent fofoti, gazebo, thatched huts)",
        TREE_SRC + " " + HUT_SRC,
    )
    specs = [
        ("eb_fofoti_10", 1.05, 0.0),
        ("eb_fofoti_11", 0.95, 0.2),
        ("eb_fofoti_12", 1.1, -0.1),
        ("eb_fofoti_13", 0.9, 0.15),
        ("eb_fofoti_north", 1.0, -0.2),
    ]
    for name, scale, spin in specs:
        info = build_one_tree(name, scale, spin)
        patch(name, info, "v4-grokbot (wind-bent fofoti, roots, flat canopy)", TREE_SRC)
    data = json.loads(MANIFEST.read_text())
    for h in data:
        if not h["id"].startswith("palapa_"):
            continue
        info = build_hut(h["id"])
        patch(h["id"], info, "v4-grokbot (thatched hut, four posts, fringe, bench)", HUT_SRC)
    print("done")


if __name__ == "__main__":
    main()
