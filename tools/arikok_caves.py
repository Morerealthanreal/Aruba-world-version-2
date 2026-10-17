#!/usr/bin/env python3
"""Arikok cave mouths: Fontein and Quadirikiri.

Each is a limestone face with the opening cut into it. The dark part is the
recess behind the lip, not a box standing on the sand. Fontein keeps the
gate across its one mouth. Quadirikiri has two open mouths and the two roof
holes the cave is known for. No photo textures. Conchi is a later change.
"""
import json
import math
from pathlib import Path

import hero_glb as G

ROOT = Path(__file__).resolve().parents[1]
REAL = ROOT / "game" / "data" / "real"
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"

X0, Z0, RS, PX = -10800.0, -11800.0, 1000.0, 4.0
XG = 111320 * math.cos(12.52 * math.pi / 180)
ZG = 110540.0


def from_ll(lat, lon):
    return ((lon + 69.97) * XG, -(lat - 12.52) * ZG)


def sample_h(x, z, cache):
    rx, rz = math.floor((x - X0) / RS), math.floor((z - Z0) / RS)
    im = cache.get((rx, rz))
    if im is None:
        from PIL import Image
        im = Image.open(REAL / f"h_{rx}_{rz}.png").convert("RGB")
        cache[(rx, rz)] = im
    pix = im.load()
    o = (x - X0 - rx * RS) / PX
    s = (z - Z0 - rz * RS) / PX
    c = min(249, max(0, math.floor(o)))
    row = min(249, max(0, math.floor(s)))
    u, d = o - c, s - row

    def H(cc, ll):
        r, g, _b = pix[cc, ll]
        return (r * 256 + g) / 100 - 50

    p, m, h, g = H(c, row), H(c + 1, row), H(c, row + 1), H(c + 1, row + 1)
    return p + (m - p) * u + (h - p) * d + (p - m - h + g) * u * d


def nearest_road(x, z, limit=400):
    best = None
    bd = limit * limit
    for path in REAL.glob("r_*.json"):
        data = json.loads(path.read_text())
        for road in data["roads"]:
            name = road.get("n") or ""
            for px, pz in road["p"]:
                d = (px - x) ** 2 + (pz - z) ** 2
                if d < bd:
                    bd = d
                    best = (px, pz, math.sqrt(d), name)
    return best


def quad_facing(mesh, a, b, c, d, outward):
    ax, ay, az = b[0] - a[0], b[1] - a[1], b[2] - a[2]
    bx, by, bz = c[0] - a[0], c[1] - a[1], c[2] - a[2]
    nx = ay * bz - az * by
    ny = az * bx - ax * bz
    nz = ax * by - ay * bx
    if nx * outward[0] + ny * outward[1] + nz * outward[2] < 0:
        mesh.quad(a, d, c, b)
    else:
        mesh.quad(a, b, c, d)


def wedge(mesh, x_face, x_back, z0, z1, y_face, y_back, y0=-1.6):
    """Sloping mass. The road-facing side is +X. Base is buried."""
    fl, fr = (x_face, y_face, z0), (x_face, y_face, z1)
    bl, br = (x_back, y_back, z0), (x_back, y_back, z1)
    fl0, fr0 = (x_face, y0, z0), (x_face, y0, z1)
    bl0, br0 = (x_back, y0, z0), (x_back, y0, z1)
    quad_facing(mesh, fl0, fr0, fr, fl, (1, 0, 0))
    quad_facing(mesh, bl, br, br0, bl0, (-1, 0, 0))
    quad_facing(mesh, fl, fr, br, bl, (0, 1, 0))
    quad_facing(mesh, fl0, bl0, br0, fr0, (0, -1, 0))
    quad_facing(mesh, fl, bl, bl0, fl0, (0, 0, -1))
    quad_facing(mesh, fr0, br0, br, fr, (0, 0, 1))


def knob(mesh, cx, cy, cz, rx, ry, rz):
    """Small limestone bulge. Poles are fans so the normal is not zero."""
    nlat, nlon = 3, 6
    rings = []
    for i in range(nlat + 1):
        v = -math.pi / 2 + math.pi * i / nlat
        cv, sv = math.cos(v), math.sin(v)
        row = []
        for j in range(nlon):
            u = 2 * math.pi * j / nlon
            row.append((cx + rx * cv * math.cos(u), cy + ry * sv, cz + rz * cv * math.sin(u)))
        rings.append(row)
    bot, top = rings[0][0], rings[-1][0]
    for j in range(nlon):
        a, b = rings[1][j], rings[1][(j + 1) % nlon]
        mesh.tri(bot, b, a)
        c, d = rings[-2][j], rings[-2][(j + 1) % nlon]
        mesh.tri(top, c, d)
    for i in range(1, nlat - 1):
        for j in range(nlon):
            a = rings[i][j]
            b = rings[i][(j + 1) % nlon]
            c = rings[i + 1][(j + 1) % nlon]
            d = rings[i + 1][j]
            outward = ((a[0] + c[0]) / 2 - cx, (a[1] + c[1]) / 2 - cy, (a[2] + c[2]) / 2 - cz)
            quad_facing(mesh, a, b, c, d, outward)


def rotate_model(model, ang):
    c, s = math.cos(ang), math.sin(ang)
    for lod in model.lod:
        for mesh in lod.values():
            mesh.pos = [(p[0] * c - p[2] * s, p[1], p[0] * s + p[2] * c) for p in mesh.pos]
            mesh.nrm = [(n[0] * c - n[2] * s, n[1], n[0] * s + n[2] * c) for n in mesh.nrm]


def build_cave(name, lat, lon, mouths, length, height, depth, gate=False, skylights=()):
    """mouths: (z, width, mouth_height). Local +X is turned toward the road."""
    cx, cz = from_ll(lat, lon)
    road = nearest_road(cx, cz)
    ang = math.atan2(road[1] - cz, road[0] - cx) if road else 0.0
    print(f"  {name} road {road[3]!r} {road[2]:.0f} m" if road else f"  {name} no road")

    model = G.Model(name)
    # Warm and dark. Brighter limestone was lighting as a white shed.
    rock = model.material("rock", (0.22, 0.19, 0.16), rough=0.94)
    strata = model.material("strata", (0.13, 0.11, 0.09), rough=0.96)
    talus = model.material("talus", (0.30, 0.26, 0.21), rough=0.9)
    cave = model.material("cave", (0.02, 0.018, 0.016), rough=1.0)
    gate_c = model.material("gate", (0.07, 0.07, 0.065), rough=0.55)
    hi = model.mesh(0, rock)
    lo = model.mesh(1, rock)
    hid = model.mesh(0, strata)
    hil = model.mesh(0, talus)
    hic = model.mesh(0, cave)
    loc = model.mesh(1, cave)
    hig = model.mesh(0, gate_c)

    half = length / 2
    # Sort mouths and fill the cliff in spans, leaving each mouth as a gap.
    ordered = sorted(mouths, key=lambda m: m[0])
    spans = []
    cursor = -half
    for z, w, mh in ordered:
        left = z - w / 2
        if left - cursor > 0.4:
            spans.append((cursor, left))
        cursor = z + w / 2
    if half - cursor > 0.4:
        spans.append((cursor, half))

    for i, (z0, z1) in enumerate(spans):
        y_face = height * (0.72 + 0.18 * (i % 2))
        y_back = height * 0.42
        wedge(hi, 0.8, -depth, z0, z1, y_face, y_back)
        # A bedding line across the face of each shoulder.
        G.box(hid, 0.95, y_face * 0.55, (z0 + z1) / 2, 0.35, 0.28, (z1 - z0) * 0.82)

    for z, w, mh in ordered:
        # Brow: the soffit is the top of the mouth, and the lip sticks out
        # past the shoulders so the opening sits in shadow.
        wedge(hi, 2.15, -depth * 0.55, z - w / 2 - 0.5, z + w / 2 + 0.5, mh + 0.15, height * 0.95, y0=mh - 0.05)
        # Jambs, thicker at the bottom, so the cut has sides.
        G.box(hi, 1.15, mh * 0.42, z - w / 2 - 0.35, 1.5, mh * 0.85, 0.9)
        G.box(hi, 1.15, mh * 0.42, z + w / 2 + 0.35, 1.5, mh * 0.85, 0.9)
        # Arch: rock closing the upper corners.
        G.box(hi, 1.05, mh - 0.15, z - w / 2 + 0.55, 1.2, 0.7, 1.3)
        G.box(hi, 1.05, mh - 0.15, z + w / 2 - 0.55, 1.2, 0.7, 1.3)
        # Recess. The front of this block is behind the lip.
        G.box(hic, -depth * 0.28, mh * 0.46, z, depth * 0.7, mh * 0.88, w * 0.82)
        # Sill and a fan of broken stone in front of the mouth.
        G.box(hil, 1.7, 0.12, z, 1.6, 0.35, w * 0.7)
        wedge(hil, 3.2, 1.1, z - w * 0.55, z + w * 0.55, 0.45, 0.15, y0=-1.5)
        if gate:
            for k in range(4):
                G.box(hig, 0.55, 0.45 + k * (mh / 4.6), z, 0.06, 0.07, w * 0.78)
            G.box(hig, 0.55, mh * 0.5, z - w * 0.28, 0.08, mh * 0.85, 0.08)
            G.box(hig, 0.55, mh * 0.5, z + w * 0.28, 0.08, mh * 0.85, 0.08)

    # Crest and a couple of face knobs so the wall is not one plane.
    wedge(hi, 0.2, -depth * 0.7, -half * 0.25, half * 0.2, height + 1.4, height * 0.7, y0=height * 0.72)
    knob(hi, 1.3, height * 0.62, -half * 0.45, 1.6, 1.3, 1.4)
    knob(hi, 1.5, height * 0.38, half * 0.38, 1.4, 1.1, 1.5)
    knob(hil, 2.0, 0.4, -half * 0.2, 1.8, 0.7, 1.6)

    for z, w in skylights:
        # A hole in the crest: dark pit with a raised rim.
        G.box(hic, -depth * 0.35, height * 0.78, z, w, height * 0.45, w)
        G.box(hi, -depth * 0.35, height * 0.98, z - w * 0.65, w * 0.45, 0.7, w * 1.5)
        G.box(hi, -depth * 0.35, height * 0.98, z + w * 0.65, w * 0.45, 0.7, w * 1.5)
        G.box(hi, -depth * 0.35 - w * 0.55, height * 0.98, z, w * 1.4, 0.55, w * 0.4)

    # Distant read: one face, the mouths still dark.
    wedge(lo, 0.6, -depth, -half, half, height * 0.8, height * 0.4)
    for z, w, mh in ordered:
        G.box(loc, -1.0, mh * 0.45, z, 2.2, mh * 0.8, w * 0.75)

    rotate_model(model, ang)
    info = G.write_glb(model, HERO / f"{name}.glb")
    G.check_glb(HERO / f"{name}.glb")
    h0 = sample_h(cx, cz, {})
    print(name, round(cx, 2), round(cz, 2), "h", round(h0, 2), info)
    return cx, cz, h0, info, ang


def footprint(cx, cz, ang, length, depth):
    """World quad covering the cliff, so a stray mass does not sit in the mouth."""
    c, s = math.cos(ang), math.sin(ang)
    local = [(2.5, -length / 2 - 1), (2.5, length / 2 + 1), (-depth - 1, length / 2 + 1), (-depth - 1, -length / 2 - 1)]
    world = []
    for x, z in local:
        world.append([round(cx + x * c - z * s, 1), round(cz + x * s + z * c, 1)])
    return world


def append_manifest(entries):
    text = MANIFEST.read_text()
    if not text.rstrip().endswith("]"):
        raise SystemExit("manifest shape")
    chunks = []
    for entry in entries:
        body = json.dumps(entry, indent=1)
        chunks.append("\n".join(" " + line for line in body.splitlines()))
    block = ",\n" + ",\n".join(chunks) + "\n"
    text = text.rstrip()[:-1] + block + "]\n"
    json.loads(text)
    MANIFEST.write_text(text)


def entry(id_, x, z, y, info, name, refs, ring, switch):
    return {
        "id": id_,
        "k": id_,
        "name": name,
        "status": "accuracy-caves",
        "x": round(x, 2),
        "z": round(z, 2),
        "y": round(y, 2),
        "rotation": 0,
        "glb": f"models/hero/{id_}.glb",
        "lod": {"hi": f"{id_}_lod0", "lo": f"{id_}_lod1", "switch_m": switch},
        "tris": {f"{id_}_lod0": info["lod0"], f"{id_}_lod1": info["lod1"]},
        "textures": 0,
        "hide_footprint": ring,
        "hide": [],
        "sign": False,
        "kind": "replace",
        "new_place": True,
        "geo_source": "OSM node, mouth facing the nearest road",
        "ref_sources": refs,
        "frame": "glb origin = cave mouth centroid (world x,z); glTF +X = world x, +Z = world z, Y up",
        "cat": "landmark",
    }


def main():
    fontein = build_cave(
        "fontein_cave", 12.4929282, -69.9073335,
        mouths=[(0.0, 4.4, 3.1)],
        length=18, height=7.2, depth=9, gate=True,
    )
    quad = build_cave(
        "quadirikiri", 12.4825269, -69.8995204,
        mouths=[(-5.2, 6.2, 3.8), (6.4, 4.6, 3.0)],
        length=28, height=6.6, depth=11,
        skylights=[(-2.2, 2.4), (4.8, 2.0)],
    )
    fx, fz, fh, finfo, fang = fontein
    qx, qz, qh, qinfo, qang = quad
    if fh == 0 or qh == 0:
        raise SystemExit("refusing a zero ground pin")
    append_manifest([
        entry(
            "fontein_cave", fx, fz, fh, finfo,
            "Fontein Cave",
            "Commons views of the Fontein cave mouth: one opening cut into a limestone face, metal gate set inside the shadow, talus at the foot. OSM node 540167863. Geometry only.",
            footprint(fx, fz, fang, 18, 9), 380,
        ),
        entry(
            "quadirikiri", qx, qz, qh, qinfo,
            "Quadirikiri Cave",
            "Commons views of Quadirikiri: two mouths in a low limestone cliff and two holes in the crest. OSM node 540982491. Geometry only.",
            footprint(qx, qz, qang, 28, 11), 400,
        ),
    ])
    print("manifest ok")


if __name__ == "__main__":
    main()
