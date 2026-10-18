#!/usr/bin/env python3
"""Arikok cave mouths: Fontein and Quadirikiri.

A limestone hillside with the opening cut into it. The dark face sits back
under a brow, with rock jambs beside it, so the hole is what you see from
the road. Fontein keeps a gate and its mouth is offset along the face so
the tree on the OSM node is not standing in the doorway. Quadirikiri has
two mouths and two holes in the crest. No photo textures. Conchi is later.
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


def wedge(mesh, x_face, x_back, z0, z1, y_face, y_back, y0=-2.2):
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


def shoulders(hi, hid, half, mouths, height, depth):
    """Rock either side of the openings. The face stays a wall; the skyline
    is a separate row of blocks so there is no shed roof."""
    ordered = sorted(mouths, key=lambda m: m[0])
    spans = []
    cursor = -half
    for z, w, _mh in ordered:
        left = z - w / 2 - 1.05
        if left - cursor > 0.4:
            spans.append((cursor, left))
        cursor = z + w / 2 + 1.05
    if half - cursor > 0.4:
        spans.append((cursor, half))
    for z0, z1 in spans:
        span = z1 - z0
        pieces = 3 if span > 5 else 2 if span > 2.4 else 1
        for i in range(pieces):
            a = z0 + span * i / pieces
            b = z0 + span * (i + 1) / pieces
            mid = (a + b) / 2
            jump = (i * 2 + int(abs(mid))) % 3
            face_h = height * (0.8 + 0.14 * jump)
            wedge(hi, 0.15, -depth, a, b, face_h, face_h * 0.9)
            for seam in (1.2, 2.5):
                if seam < face_h - 0.6:
                    G.box(hid, 0.42, seam, mid, 0.4, 0.16, (b - a) * 0.72)
            G.box(hi, 0.45, face_h * 0.45, mid, 0.6, 0.36, (b - a) * 0.5)


def crest(hi, hic, half, height, depth, skylights):
    """A few bulges on the crest, plus the roof pits. Not a battlement row."""
    knob(hi, -0.6, height * 0.82, -half * 0.35, 2.0, 1.15, 1.7)
    knob(hi, -1.6, height * 0.95, half * 0.05, 1.6, 1.35, 2.1)
    knob(hi, -0.8, height * 0.7, half * 0.48, 2.3, 0.85, 1.5)
    for z, w in skylights:
        G.box(hic, -depth * 0.22, height * 0.5, z, w * 0.6, 1.6, w * 0.6)


def opening(hi, hic, hil, hig, z, w, mh, depth, gate, steps=False):
    """Dark mouth under a thick shelf. Upper corners are rock, so it is not a rectangle."""
    lip = 1.45
    recede = min(4.0, depth * 0.5)
    front = lip - 0.45
    G.box(hic, front - recede / 2, mh * 0.42, z, recede, mh * 0.84, w * 0.78)
    # Shelf, not a sloping roof. Underside sits just over the hole.
    G.box(hi, lip + 0.15, mh + 0.7, z, 2.4, 1.35, w + 2.4)
    for side in (-1, 1):
        G.box(hi, lip - 0.05, mh * 0.5, z + side * (w / 2 + 0.2), 1.5, mh * 1.15, 1.05)
        # Rock in the top corners, pulling the hole toward an arch.
        G.box(hi, lip - 0.15, mh * 0.78, z + side * (w * 0.28), 1.7, mh * 0.48, w * 0.24)
    wedge(hil, lip + 3.6, 0.2, z - w * 0.7, z + w * 0.7, 0.05, 0.4, y0=-1.7)
    if steps:
        for s in range(4):
            G.box(hil, lip + 0.9 + s * 0.48, 0.16 + s * 0.16, z, 0.48, 0.18, w * 0.42)
    if gate:
        gx = lip - 0.2
        span = w * 0.62
        for k in range(5):
            zz = z - span / 2 + k * (span / 4)
            G.box(hig, gx, mh * 0.4, zz, 0.05, mh * 0.72, 0.07)
        G.box(hig, gx, 0.18, z, 0.05, 0.07, span)


def build_cave(name, lat, lon, mouths, length, height, depth, gate=False, skylights=()):
    """mouths: (z, width, mouth_height). Local +X is turned toward the road."""
    cx, cz = from_ll(lat, lon)
    road = nearest_road(cx, cz)
    ang = math.atan2(road[1] - cz, road[0] - cx) if road else 0.0
    print(f"  {name} road {road[3]!r} {road[2]:.0f} m" if road else f"  {name} no road")

    model = G.Model(name)
    # Kept in the band that renders as tan limestone. Brighter reads as a white shed.
    rock = model.material("rock", (0.23, 0.18, 0.13), rough=0.94)
    strata = model.material("strata", (0.12, 0.09, 0.07), rough=0.96)
    talus = model.material("talus", (0.27, 0.21, 0.14), rough=0.9)
    cave = model.material("cave", (0.015, 0.012, 0.01), rough=1.0)
    gate_c = model.material("gate", (0.16, 0.16, 0.15), rough=0.5)
    hi = model.mesh(0, rock)
    lo = model.mesh(1, rock)
    hid = model.mesh(0, strata)
    hil = model.mesh(0, talus)
    hic = model.mesh(0, cave)
    loc = model.mesh(1, cave)
    hig = model.mesh(0, gate_c)

    half = length / 2
    shoulders(hi, hid, half, mouths, height, depth)
    crest(hi, hic, half, height, depth, skylights)
    widest = max(mouths, key=lambda m: m[1])[0] if len(mouths) > 1 else None
    for z, w, mh in mouths:
        opening(hi, hic, hil, hig, z, w, mh, depth, gate, steps=(z == widest))

    knob(hil, 2.8, 0.2, -half * 0.25, 1.4, 0.35, 1.2)

    wedge(lo, 0.05, -depth, -half, half, height * 0.62, height * 1.05)
    for z, w, mh in mouths:
        G.box(loc, 0.3, mh * 0.48, z, 2.6, mh * 0.9, w * 0.8)

    rotate_model(model, ang)
    info = G.write_glb(model, HERO / f"{name}.glb")
    G.check_glb(HERO / f"{name}.glb")
    h0 = sample_h(cx, cz, {})
    print(name, round(cx, 2), round(cz, 2), "h", round(h0, 2), info)
    return cx, cz, h0, info, ang


def footprint(cx, cz, ang, length, depth):
    """World quad covering the cliff, so a stray mass does not sit in the mouth."""
    c, s = math.cos(ang), math.sin(ang)
    local = [
        (6.5, -length / 2 - 1),
        (6.5, length / 2 + 1),
        (-depth - 1, length / 2 + 1),
        (-depth - 1, -length / 2 - 1),
    ]
    world = []
    for x, z in local:
        world.append([round(cx + x * c - z * s, 1), round(cz + x * s + z * c, 1)])
    return world


def upsert_manifest(entries):
    """Replace these ids in place. A full rewrite is avoided when the ids exist."""
    text = MANIFEST.read_text()
    present = all(f'"id": "{e["id"]}"' in text for e in entries)
    if not present:
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
        return
    data = json.loads(text)
    by_id = {e["id"]: e for e in entries}
    out = []
    seen = set()
    for item in data:
        if item.get("id") in by_id:
            out.append(by_id[item["id"]])
            seen.add(item["id"])
        else:
            out.append(item)
    for entry in entries:
        if entry["id"] not in seen:
            out.append(entry)
    dumped = json.dumps(out, indent=1) + "\n"
    json.loads(dumped)
    # Only accept the rewrite when the rest of the file is unchanged.
    old = json.loads(text)
    old_ids = [i.get("id") for i in old]
    new_ids = [i.get("id") for i in out]
    if old_ids != new_ids:
        raise SystemExit("manifest id order changed")
    MANIFEST.write_text(dumped)


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
        # Mouth sits along the face, off the tree that grows on the node.
        mouths=[(3.6, 6.4, 4.4)],
        length=16, height=6.6, depth=10, gate=True,
    )
    quad = build_cave(
        "quadirikiri", 12.4825269, -69.8995204,
        mouths=[(-5.6, 8.0, 4.6), (6.6, 6.2, 3.8)],
        length=26, height=6.4, depth=11,
        skylights=[(-1.6, 2.6), (5.4, 2.2)],
    )
    fx, fz, fh, finfo, fang = fontein
    qx, qz, qh, qinfo, qang = quad
    if fh == 0 or qh == 0:
        raise SystemExit("refusing a zero ground pin")
    upsert_manifest([
        entry(
            "fontein_cave", fx, fz, fh, finfo,
            "Fontein Cave",
            "Commons views of the Fontein cave mouth: one opening cut into a limestone face, metal gate set inside the shadow, talus at the foot. OSM node 540167863. Geometry only.",
            footprint(fx, fz, fang, 16, 10), 380,
        ),
        entry(
            "quadirikiri", qx, qz, qh, qinfo,
            "Quadirikiri Cave",
            "Commons views of Quadirikiri: two mouths in a low limestone cliff and two holes in the crest. OSM node 540982491. Geometry only.",
            footprint(qx, qz, qang, 26, 11), 400,
        ),
    ])
    print("manifest ok", finfo, qinfo)


if __name__ == "__main__":
    main()
