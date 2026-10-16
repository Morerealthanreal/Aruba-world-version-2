#!/usr/bin/env python3
"""Antilla far silhouette and California Lighthouse close-up.

The Malmok sand is about 730 m from nw_antilla. On medium the hero is inside
the 1000 m cap, but the snorkel wreck (rails to about y=0.7, masts to about
y=6) stays under the horizon. Past 600 m the same hero switches to a cheap
dark hull and three masts tall enough to read from the beach. The close lod
is the existing wreck and yellow buoys.

The engine tower at (-8840, -10365) is a white cobblestone shaft with a plain
gallery and no door. This hero is a cream stone skin on that same shaft, plus
the base courses, the door toward the grounds, and an iron gallery rail. It is
not a second tower, and it stays on the lighthouse lot.

Do not run tools/nw-coast/build_coast.py. This imports its mesh helper so the
close wreck stays the one already shipped.
"""
from __future__ import annotations

import importlib.util
import json
import math
import os
import sys

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, ROOT)

from tools.hero_glb import Model, check_glb, write_glb  # noqa: E402

spec = importlib.util.spec_from_file_location(
    "build_coast", os.path.join(ROOT, "tools", "nw-coast", "build_coast.py")
)
coast = importlib.util.module_from_spec(spec)
spec.loader.exec_module(coast)

MANIFEST = os.path.join(ROOT, "game", "data", "hero", "manifest.json")
HERO = os.path.join(ROOT, "game", "models", "hero")
GOLF = os.path.join(ROOT, "game", "data", "real", "tds_golf.json")

# Engine shaft: Cylinder(top 2.3, bottom 3.3, height 27) centred at local y=13.5,
# group placed at heightAt-0.4. A hero with y=0 sits on heightAt, so hero y = engine y - 0.4.
ENGINE_DROP = 0.4
OUT = 0.20
TOWER = (-8840.0, -10365.0)
GROUNDS = (-8875.2, -10343.45)

# Pale rubble, the colour the coast notes already use, lightened one step so the
# shaft reads as the cream tower in the Arashi photo rather than white cobbles.
SHAFT = (0.89, 0.83, 0.71)
BASE = (0.80, 0.74, 0.62)
BAND = (0.72, 0.65, 0.53)
JAMB = (0.60, 0.54, 0.44)
DOOR = (0.13, 0.09, 0.07)
IRON = (0.09, 0.10, 0.11)
WIN = (0.08, 0.09, 0.10)
HULK = (0.15, 0.10, 0.07)


def _cross(a, b):
    return (
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    )


def _dot(a, b):
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]


def _sub(a, b):
    return (a[0] - b[0], a[1] - b[1], a[2] - b[2])


def quad_out(mesh, a, b, c, d, outward):
    n = _cross(_sub(b, a), _sub(c, a))
    if _dot(n, outward) < 0:
        mesh.quad(a, d, c, b)
    else:
        mesh.quad(a, b, c, d)


def obox(mesh, c, ux, uy, uz, hx, hy, hz):
    """Box centred on c. ux/uy/uz are unit axes, hx/hy/hz are half extents."""
    if hx < 1e-4 or hy < 1e-4 or hz < 1e-4:
        return

    def p(sx, sy, sz):
        return (
            c[0] + ux[0] * sx * hx + uy[0] * sy * hy + uz[0] * sz * hz,
            c[1] + ux[1] * sx * hx + uy[1] * sy * hy + uz[1] * sz * hz,
            c[2] + ux[2] * sx * hx + uy[2] * sy * hy + uz[2] * sz * hz,
        )

    lbf, rbf = p(-1, -1, -1), p(1, -1, -1)
    ltf, rtf = p(-1, 1, -1), p(1, 1, -1)
    lbb, rbb = p(-1, -1, 1), p(1, -1, 1)
    ltb, rtb = p(-1, 1, 1), p(1, 1, 1)
    quad_out(mesh, rbf, rbb, rtb, rtf, ux)
    quad_out(mesh, lbb, lbf, ltf, ltb, (-ux[0], -ux[1], -ux[2]))
    quad_out(mesh, ltf, rtf, rtb, ltb, uy)
    quad_out(mesh, lbf, lbb, rbb, rbf, (-uy[0], -uy[1], -uy[2]))
    quad_out(mesh, lbb, ltb, rtb, rbb, uz)
    quad_out(mesh, lbf, rbf, rtf, ltf, (-uz[0], -uz[1], -uz[2]))


def frustum(mesh, y0, y1, r0, r1, sides, caps=True):
    if y1 - y0 < 1e-4 or sides < 3:
        return
    bot, top = [], []
    for i in range(sides):
        t = math.tau * i / sides
        ct, st = math.cos(t), math.sin(t)
        bot.append((ct * r0, y0, st * r0))
        top.append((ct * r1, y1, st * r1))
    for i in range(sides):
        j = (i + 1) % sides
        mid = (
            (bot[i][0] + bot[j][0] + top[i][0] + top[j][0]) * 0.25,
            0.0,
            (bot[i][2] + bot[j][2] + top[i][2] + top[j][2]) * 0.25,
        )
        quad_out(mesh, bot[i], bot[j], top[j], top[i], mid)
    if not caps:
        return
    c0 = (0.0, y0, 0.0)
    c1 = (0.0, y1, 0.0)
    if r0 > 1e-3:
        for i in range(sides):
            j = (i + 1) % sides
            mesh.tri(c0, bot[j], bot[i])
    if r1 > 1e-3:
        for i in range(sides):
            j = (i + 1) % sides
            mesh.tri(c1, top[i], top[j])


def annulus(mesh, y0, y1, rin, rout, sides):
    if y1 - y0 < 1e-4 or rout - rin < 1e-3 or sides < 3:
        return
    o0, o1, i0, i1 = [], [], [], []
    for i in range(sides):
        t = math.tau * i / sides
        ct, st = math.cos(t), math.sin(t)
        o0.append((ct * rout, y0, st * rout))
        o1.append((ct * rout, y1, st * rout))
        i0.append((ct * rin, y0, st * rin))
        i1.append((ct * rin, y1, st * rin))
    for i in range(sides):
        j = (i + 1) % sides
        mid = ((o0[i][0] + o0[j][0]) * 0.5, 0.0, (o0[i][2] + o0[j][2]) * 0.5)
        inn = ((i0[i][0] + i0[j][0]) * 0.5, 0.0, (i0[i][2] + i0[j][2]) * 0.5)
        quad_out(mesh, o1[i], o1[j], i1[j], i1[i], (0, 1, 0))
        quad_out(mesh, o0[j], o0[i], i0[i], i0[j], (0, -1, 0))
        quad_out(mesh, o0[i], o0[j], o1[j], o1[i], mid)
        quad_out(mesh, i0[j], i0[i], i1[i], i1[j], (-inn[0], 0, -inn[2]))


def radial_box(mesh, ang, r0, r1, y0, y1, half_w):
    rad = (math.cos(ang), 0.0, math.sin(ang))
    tan = (-math.sin(ang), 0.0, math.cos(ang))
    up = (0.0, 1.0, 0.0)
    c = (rad[0] * (r0 + r1) * 0.5, (y0 + y1) * 0.5, rad[2] * (r0 + r1) * 0.5)
    obox(mesh, c, rad, up, tan, (r1 - r0) * 0.5, (y1 - y0) * 0.5, half_w)


def shell_r(y_hero):
    y_e = y_hero + ENGINE_DROP
    return 3.3 - y_e / 27.0 + OUT


def build_antilla():
    ax, az = coast.ll(12.60205, -70.05782)
    b = coast.B(ax, az, 0.40)
    b.mat("buoy", coast.BUOY, 0.45)
    b.mat("buoyw", coast.BUOY_W, 0.4)
    b.mat("spar", coast.SPAR, 0.5)
    b.mat("rust", coast.RUST, 0.82)
    b.mat("rustd", coast.RUST_D, 0.88)
    b.mat("sponge", coast.SPONGE, 0.9)
    b.mat("hulk", HULK, 0.9)
    shore_x, shore_z = -8820.0, -8927.0
    dx, dz = shore_x - ax, shore_z - az
    span = math.hypot(dx, dz)
    fx, fz = dx / span, dz / span
    px, pz = -fz, fx
    yaw = math.atan2(fz, fx)
    coast.add_wreck(b, ax, az, fx, fz)
    for t in (-52, -16, 14, 56):
        coast.add_buoy(b, ax + fx * t + px * -12.0, az + fz * t + pz * -12.0, scale=1.7)
    # Drop the short far lod. The beach is past 700 m, so it never cleared the horizon.
    b.tris[1] = 0
    for key in list(b.prim.keys()):
        if key[0] == 1:
            del b.prim[key]

    def at(along, side):
        return ax + fx * along + px * side, az + fz * along + pz * side

    def hulk_box(along, side, y0, y1, half_l, half_b):
        cx, cz = at(along, side)
        b.box_yaw(1, "hulk", cx, y0, cz, half_l, y1 - y0, half_b, yaw)

    def mast(along, side, y1, thick):
        cx, cz = at(along, side)
        h = thick * 0.5
        b.box(1, "hulk", cx - h, 0.35, cz - h, cx + h, y1, cz + h)

    # Broken hull above the waterline, spread across the view (the bow points
    # at the beach, so the length is almost end-on). Tops clear an eye at ~3.6 m.
    hulk_box(-16, -5, 0.25, 13.0, 20, 11)
    hulk_box(18, 6, 0.25, 10.5, 18, 9.5)
    mast(-8, -18, 28.0, 4.4)
    mast(2, 0, 36.0, 5.2)
    mast(14, 18, 23.0, 4.2)
    # Yard on the tall mast, across the line of sight.
    cx, cz = at(2, 0)
    b.box_yaw(1, "hulk", cx, 29.2, cz, 10.0, 2.4, 1.5, yaw + math.pi / 2)

    path = os.path.join(HERO, "nw_antilla.glb")
    tris = b.save(path, "nw_antilla")
    check_glb(path)
    if tris[0] != 656:
        raise SystemExit(f"close wreck changed: lod0 tris {tris[0]}, expected 656")
    far = 0.0
    for (lod, _mat), prim in b.prim.items():
        if lod != 1:
            continue
        xs, ys, zs = prim["p"][0::3], prim["p"][1::3], prim["p"][2::3]
        for x, y, z in zip(xs, ys, zs):
            far = max(far, math.hypot(x, y, z))
    if far >= 640:
        raise SystemExit(f"antilla far lod extends {far:.1f} m")
    # Shore distance must stay above the lod switch.
    sand = (-8822.0, -8928.0)
    shore_d = math.hypot(sand[0] - ax, sand[1] - az)
    if shore_d <= 600:
        raise SystemExit(f"beach is only {shore_d:.0f} m out; switch would show the close wreck")
    print(f"nw_antilla lod {tris[0]}/{tris[1]} far {far:.1f} m  beach {shore_d:.0f} m  origin {ax:.2f},{az:.2f}")
    return tris, (ax, az)


def build_lighthouse():
    door_ang = math.atan2(GROUNDS[1] - TOWER[1], GROUNDS[0] - TOWER[0])
    # Bury the base into the downhill side of the hill so the door is not floating.
    cx, cz = TOWER
    center_h = coast.mesh_height(cx, cz)
    low = 0.0
    for i in range(16):
        a = math.tau * i / 16
        low = min(low, coast.mesh_height(cx + math.cos(a) * 4.3, cz + math.sin(a) * 4.3) - center_h)
    base_bottom = min(-0.45, low - 0.15)

    model = Model("nw_lh_close")
    model.material("shaft", SHAFT, 0.94)
    model.material("base", BASE, 0.96)
    model.material("band", BAND, 0.95)
    model.material("jamb", JAMB, 0.92)
    model.material("door", DOOR, 0.72)
    model.material("iron", IRON, 0.42)
    model.material("win", WIN, 0.55)

    def add_shell(lod, sides, detail):
        shaft = model.mesh(lod, "shaft")
        base = model.mesh(lod, "base")
        # Foundation and the step the engine plinth (radius 4) sits inside.
        frustum(base, base_bottom, 0.32, 4.50, 4.22, sides, caps=True)
        frustum(base, 0.32, 0.98, 4.08, 3.70, sides, caps=True)
        y_shaft0, y_shaft1 = 0.90, 26.52
        frustum(
            shaft,
            y_shaft0,
            y_shaft1,
            shell_r(y_shaft0),
            shell_r(y_shaft1),
            sides + 2,
            caps=False,
        )
        # Cream collar over the engine's white gallery cone (engine y 27.0-27.6).
        collar = model.mesh(lod, "shaft")
        annulus(collar, 26.48, 27.18, 2.48, 3.46, sides)
        door = model.mesh(lod, "door")
        radial_box(door, door_ang, 3.38, 3.64, 0.18, 2.52, 0.40)
        if not detail:
            iron = model.mesh(lod, "iron")
            for k in range(4):
                ang = door_ang + k * math.tau / 4
                radial_box(iron, ang, 3.48, 3.66, 27.05, 28.20, 0.07)
            frustum(iron, 27.85, 28.02, 3.52, 3.52, 8, caps=False)
            return
        jamb = model.mesh(lod, "jamb")
        radial_box(jamb, door_ang, 3.22, 3.50, 0.02, 2.88, 0.62)
        win = model.mesh(lod, "win")
        for k, (dy, dang) in enumerate(((6.6, 0.0), (11.2, 1.7), (16.0, 3.3), (21.2, 4.8))):
            r = shell_r(dy)
            radial_box(win, door_ang + dang, r + 0.03, r + 0.16, dy - 0.42, dy + 0.42, 0.26)
        band = model.mesh(lod, "band")
        for y in (5.4, 12.6, 19.8):
            r = shell_r(y)
            annulus(band, y - 0.11, y + 0.11, r + 0.015, r + 0.07, 10)
        stone = model.mesh(lod, "base")
        for k in range(8):
            ang = k * math.tau / 8 + 0.2
            radial_box(stone, ang, 2.70, 3.38, 26.05, 26.55, 0.22)
        iron = model.mesh(lod, "iron")
        for k in range(8):
            ang = door_ang + k * math.tau / 8
            radial_box(iron, ang, 3.50, 3.68, 27.08, 28.28, 0.055)
        frustum(iron, 27.42, 27.56, 3.58, 3.58, 12, caps=False)
        frustum(iron, 28.02, 28.16, 3.58, 3.58, 12, caps=False)

    add_shell(0, 12, True)
    add_shell(1, 8, False)
    path = os.path.join(HERO, "nw_lh_close.glb")
    info = write_glb(model, path)
    check_glb(path)
    far = 0.0
    for lod in (0, 1):
        for mesh in model.lod[lod].values():
            for x, y, z in mesh.pos:
                far = max(far, math.hypot(x, y, z))
                if math.hypot(x, z) > 6.0:
                    raise SystemExit(f"lighthouse vertex {x:.2f},{z:.2f} leaves the tower")
    if far >= 640:
        raise SystemExit(f"lighthouse far {far:.1f}")
    _assert_off_golf()
    print(
        f"nw_lh_close lod {info['lod0']}/{info['lod1']} far {far:.1f} m  "
        f"base_bottom {base_bottom:.2f} door {math.degrees(door_ang):.0f} deg"
    )
    return info["lod0"], info["lod1"]


def _assert_off_golf():
    golf = json.load(open(GOLF, encoding="utf-8"))
    rings = []
    for item in golf["fairways"] + golf["greens"] + golf["bunkers"]:
        rings.append(item["o"])

    def inside(x, z, poly):
        hit = False
        j = len(poly) - 1
        for i in range(len(poly)):
            xi, zi = poly[i]
            xj, zj = poly[j]
            if (zi > z) != (zj > z) and x < (xj - xi) * (z - zi) / (zj - zi + 1e-15) + xi:
                hit = not hit
            j = i
        return hit

    nearest = 1e9
    for ring in rings:
        for x, z in ring:
            nearest = min(nearest, math.hypot(x - TOWER[0], z - TOWER[1]))
    if nearest < 40:
        raise SystemExit(f"golf comes within {nearest:.0f} m of the tower")
    for i in range(8):
        a = math.tau * i / 8
        x, z = TOWER[0] + math.cos(a) * 6, TOWER[1] + math.sin(a) * 6
        for ring in rings:
            if inside(x, z, ring):
                raise SystemExit(f"tower apron {x:.0f},{z:.0f} is on a fairway")


def _brace_end(raw, start):
    depth = 0
    for i in range(start, len(raw)):
        if raw[i] == "{":
            depth += 1
        elif raw[i] == "}":
            depth -= 1
            if depth == 0:
                return i + 1
    raise SystemExit("unbalanced manifest object")


def _dump_entry(entry):
    dumped = json.dumps(entry, indent=1)
    return "\n".join((" " + line) if line else line for line in dumped.split("\n"))


def splice_manifest(antilla_tris, lh_tris):
    raw = open(MANIFEST, encoding="utf-8").read()
    before = json.loads(raw)
    ids_before = [e["id"] for e in before]
    idx = raw.find('"id": "nw_antilla"')
    if idx < 0:
        raise SystemExit("nw_antilla missing")
    start = raw.rfind("{", 0, idx)
    end = _brace_end(raw, start)
    block = raw[start:end]
    block2 = block.replace('"switch_m": 800', '"switch_m": 600', 1)
    block2 = block2.replace('"nw_antilla_lod1": 216', f'"nw_antilla_lod1": {antilla_tris[1]}', 1)
    old_ref = (
        "SS Antilla, about 12.6021 N, 70.0578 W, roughly 700 m west of Malmok. "
        "The German freighter lies on her port side, broken amidships, bow toward the beach; "
        "the real wreck is fully submerged, but this sea is opaque, so the upper rail, a bridge block "
        "and the masts break the surface and the yellow mooring buoys sit off the starboard side. "
        "Yellow with a white band is the usual Caribbean mooring-buoy colour."
    )
    new_ref = (
        old_ref
        + " From the Malmok sand the close masts stay under the horizon, so past 600 m the hero "
        "switches to a cheaper dark silhouette: two broken hull blocks and three masts, with one yard, "
        "sized to read above the sea. Inside 600 m the snorkel wreck, bridge and yellow buoys are unchanged."
    )
    if old_ref not in block2:
        raise SystemExit("antilla ref_sources text moved")
    block2 = block2.replace(old_ref, new_ref, 1)
    if block2 == block:
        raise SystemExit("antilla manifest block did not change")
    if '"id": "nw_lh_close"' in raw:
        raise SystemExit("nw_lh_close already in the manifest")
    entry = {
        "id": "nw_lh_close",
        "k": "nw_lh_close",
        "status": "v1-nw-coast",
        "x": TOWER[0],
        "z": TOWER[1],
        "y": 0,
        "rotation": 0,
        "glb": "models/hero/nw_lh_close.glb",
        "lod": {
            "hi": "nw_lh_close_lod0",
            "lo": "nw_lh_close_lod1",
            "switch_m": 140,
        },
        "tris": {
            "nw_lh_close_lod0": lh_tris[0],
            "nw_lh_close_lod1": lh_tris[1],
        },
        "textures": 0,
        "hide_footprint": None,
        "hide": [],
        "sign": False,
        "kind": "replace",
        "new_place": False,
        "geo_source": "Engine monument at (-8840, -10365), Aruba DEM",
        "ref_sources": (
            "California Lighthouse, Noord. Ground view from Arashi (pale cream tapered shaft, "
            "small dark windows, a gallery with a metal rail, dark lantern) and the close lot "
            "(stone base, dark door facing the grounds, Faro Blanco to the southwest). The engine "
            "shaft stays; this skin is cream rubble 0.2 m outside it so the white cobble map does not "
            "show up close, with the door and an iron rail on the gallery. Lantern and dome stay the "
            "engine model. Nothing is added on the Tierra del Sol fairways."
        ),
        "frame": (
            "glb origin = monument (world x,z), y snapped to the DEM; "
            "glTF +X = world x, +Z = world z, Y up; generated by tools/nw_antilla_lh.py"
        ),
        "cat": "landmark",
        "name": "",
    }
    body = (raw[:start] + block2 + raw[end:]).rstrip()
    if not body.endswith("]"):
        raise SystemExit("manifest does not end with ]")
    body = body[:-1].rstrip()
    out = body + ",\n" + _dump_entry(entry) + "\n]\n"
    parsed = json.loads(out)
    ids_after = [e["id"] for e in parsed]
    if ids_after != ids_before + ["nw_lh_close"]:
        raise SystemExit("manifest id list changed beyond the new lighthouse hero")
    ant = next(e for e in parsed if e["id"] == "nw_antilla")
    if ant["lod"]["switch_m"] != 600 or ant["tris"]["nw_antilla_lod1"] != antilla_tris[1]:
        raise SystemExit("antilla fields did not stick")
    if ant["tris"]["nw_antilla_lod0"] != 656 or ant["y"] != 0.4 or ant["name"] != "Antilla shipwreck":
        raise SystemExit("antilla pin or close lod was rewritten")
    if ant["new_place"] is not True or ant["sign"] is not False:
        raise SystemExit("antilla pin flags changed")
    lh = parsed[-1]
    if lh["name"] != "" or lh["new_place"] is not False or lh["sign"] is not False or lh["y"] != 0:
        raise SystemExit("lighthouse hero would create a second pin or miss the DEM snap")
    # Every other object byte-identical aside from the antilla block and the append.
    for old, new in zip(before, parsed[:-1]):
        if old["id"] == "nw_antilla":
            continue
        if old != new:
            raise SystemExit(f"manifest object changed: {old['id']}")
    open(MANIFEST, "w", encoding="utf-8").write(out)
    print("manifest spliced", antilla_tris, lh_tris)


def main():
    ant_tris, _origin = build_antilla()
    lh_tris = build_lighthouse()
    splice_manifest(ant_tris, lh_tris)


if __name__ == "__main__":
    main()
