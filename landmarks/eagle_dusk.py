#!/usr/bin/env python3
"""Eagle and Manchebo dusk lights and sea grape.

Local props only. The island water shader and the resort heroes stay as they
are. Emissive bulbs are the same cheap glow the rest of the map uses for
night: hotel windows, boulevard lamps, and the beach-bar strings. A colour
sheet in the shallows shadowed the dry sand, so the beach grain and the water
stay with the terrain. Sea grape sits on the dune, clear of the fofoti that
are already there.

Run: EAGLE_DUSK=1 python3 landmarks/eagle_dusk.py
"""
import json
import math
import os
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
import landmarks.eagle_strip as es

# South of the Palm Beach towers, north of the Oranjestad waterfront.
Z_N, Z_S = -4480.0, -1900.0


def glow_mat(g, name, rgb, emissive, alpha=1.0):
    m = {
        "name": name,
        "doubleSided": True,
        "pbrMetallicRoughness": {
            "baseColorFactor": [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, alpha],
            "roughnessFactor": 0.45,
            "metallicFactor": 0,
        },
        "emissiveFactor": [emissive[0] / 255, emissive[1] / 255, emissive[2] / 255],
    }
    if alpha < 0.999:
        m["alphaMode"] = "BLEND"
    g.mats.append(m)
    return len(g.mats) - 1


def shore_at(z):
    """First dry sand walking east from deep water. Manchebo is west of Eagle."""
    prev = es.height_at(-10480, z)
    x = -10476.0
    while x < -8900:
        h = es.height_at(x, z)
        if prev < 0.2 <= h:
            return x
        prev = h
        x += 4
    return None


def road_x(z, segs):
    for x1, z1, x2, z2, _w in segs:
        dz = z2 - z1
        if abs(dz) < 1e-3:
            continue
        t = (z - z1) / dz
        if 0 <= t <= 1:
            return x1 + (x2 - x1) * t
    return None


def quad_xz(mesh, x0, z0, x1, z1, y):
    a = mesh.v(x0, y, z0, 0, 1, 0, 0, 0)
    b = mesh.v(x1, y, z0, 0, 1, 0, 1, 0)
    c = mesh.v(x1, y, z1, 0, 1, 0, 1, 1)
    d = mesh.v(x0, y, z1, 0, 1, 0, 0, 1)
    mesh.quad(a, b, c, d)


def unit_quad(normal):
    mesh = es.M()
    nx, ny, nz = normal
    if abs(ny) > 0.5:
        pts = [(-0.5, 0, -0.5), (0.5, 0, -0.5), (0.5, 0, 0.5), (-0.5, 0, 0.5)]
    else:
        # a window, facing the beach (west, -X). 1.6 m tall, 1.15 m wide.
        pts = [(0, -0.8, -0.58), (0, 0.8, -0.58), (0, 0.8, 0.58), (0, -0.8, 0.58)]
    ids = [mesh.v(x, y, z, nx, ny, nz, 0, 0) for x, y, z in pts]
    mesh.quad(*ids)
    return mesh


def lamp_pole():
    mesh = es.M()
    es.tube(mesh, [(0, 0, 0), (0, 3.3, 0)], 0.055, 0.04, 5)
    return mesh


def bulb():
    mesh = es.M()
    es.ico(mesh, 0, 0, 0, 0.28, 0.28, 0.28)
    return mesh


def grape(lod):
    """Low round sea-grape clump. About 1.3 m tall, wider than it is high."""
    mesh = es.M()
    # bottoms sit on y=0 so the clump is planted, not hovering
    clumps = [(0.0, 0.50, 0.0, 1.05, 0.48, 0.85), (0.62, 0.34, 0.12, 0.62, 0.32, 0.52)]
    if lod == 0:
        clumps.append((-0.5, 0.32, -0.08, 0.55, 0.30, 0.46))
    for c in clumps:
        es.ico(mesh, *c)
    return mesh


def _gltf(path):
    data = open(path, "rb").read()
    off = 12
    js = bin_ = None
    while off < len(data):
        clen, ctype = struct.unpack_from("<I4s", data, off)
        chunk = data[off + 8:off + 8 + clen]
        if ctype == b"JSON":
            js = json.loads(chunk)
        elif ctype == b"BIN\x00":
            bin_ = chunk
        off += 8 + clen
    return js, bin_


def _quant_xz(path, ox, oz):
    js, bin_ = _gltf(path)
    node = js["nodes"][0]
    tr = node.get("translation") or [0, 0, 0]
    sc = node.get("scale") or [1, 1, 1]
    mats = {i: m.get("name") for i, m in enumerate(js.get("materials") or [])}
    mesh = js["meshes"][node["mesh"]]
    pts = []
    for prim in mesh["primitives"]:
        if mats.get(prim.get("material")) not in {"bark", "fol", "fol2"}:
            continue
        acc = js["accessors"][prim["attributes"]["POSITION"]]
        if acc.get("componentType") != 5122:
            continue
        bv = js["bufferViews"][acc["bufferView"]]
        start = bv.get("byteOffset", 0) + (acc.get("byteOffset") or 0)
        stride = bv.get("byteStride") or 6
        step = max(1, acc["count"] // 400)
        for i in range(0, acc["count"], step):
            qx, _qy, qz = struct.unpack_from("<hhh", bin_, start + i * stride)
            pts.append((ox + tr[0] + (qx / 32767.0) * sc[0], oz + tr[2] + (qz / 32767.0) * sc[2]))
    return pts


def _inst_xz(path, ox, oz):
    js, bin_ = _gltf(path)
    node = None
    for n in js["nodes"]:
        ext = (n.get("extensions") or {}).get("EXT_mesh_gpu_instancing")
        if ext and n.get("mesh") == 0:
            node = n
            break
    if node is None:
        return []
    acc = js["accessors"][node["extensions"]["EXT_mesh_gpu_instancing"]["attributes"]["TRANSLATION"]]
    bv = js["bufferViews"][acc["bufferView"]]
    start = bv.get("byteOffset", 0) + (acc.get("byteOffset") or 0)
    stride = bv.get("byteStride") or 12
    pts = []
    for i in range(acc["count"]):
        x, _y, z = struct.unpack_from("<fff", bin_, start + i * stride)
        pts.append((ox + x, oz + z))
    return pts


def blocked_bark():
    man = json.loads(open(es.MANIFEST).read())
    by = {e.get("id"): e for e in man}
    pts = []
    for hid in ("eaglebeach_fx", "eb_fofoti_10", "eb_fofoti_11", "eb_fofoti_12"):
        e = by.get(hid)
        if not e:
            continue
        pts.extend(_quant_xz(os.path.join(es.HERO, hid + ".glb"), e["x"], e["z"]))
    north = by.get("eb_north")
    if north and os.path.exists(os.path.join(es.HERO, "eb_north.glb")):
        pts.extend(_inst_xz(os.path.join(es.HERO, "eb_north.glb"), north["x"], north["z"]))
    cells = {}
    for x, z in pts:
        cells.setdefault((int(x // 10), int(z // 10)), []).append((x, z))
    return cells


def near_bark(cells, x, z, rad=12.0):
    ix, iz = int(x // 10), int(z // 10)
    r2 = rad * rad
    for dx in (-2, -1, 0, 1, 2):
        for dz in (-2, -1, 0, 1, 2):
            for px, pz in cells.get((ix + dx, iz + dz), ()):
                if (x - px) ** 2 + (z - pz) ** 2 < r2:
                    return True
    return False


def on_building(buildings, x, z):
    for b in buildings:
        if b["area"] < 40:
            continue
        if abs(b["cx"] - x) > 50 or abs(b["cz"] - z) > 50:
            continue
        if es.pip(x, z, b["poly"]):
            return True
    return False


def collect():
    segs = es.jei_points()
    buildings = es.load_buildings()
    bark = blocked_bark()
    pale, reef, grapes, lamps = [], [], [], []
    z = Z_N
    while z <= Z_S:
        shore = shore_at(z)
        road = road_x(z, segs)
        if shore:
            # Patches, not a ribbon. A continuous sheet casts a shadow across
            # the beach and reads as a white bar on the swash.
            for dx in (-18, -34, -50):
                x = shore + dx
                h = es.height_at(x, z)
                if not (-2.2 < h < -0.4):
                    continue
                c = es.aerial_rgb(x, z)
                if c and (c[0] + c[1] + c[2]) > 500:
                    pale.append((x, z, -0.25))
            # reef: a dark crown in the shallows, darker than the water beside it
            for dx in (-22, -36, -50):
                x = shore + dx
                h = es.height_at(x, z)
                if not (-2.4 < h < -0.4):
                    continue
                c = es.aerial_rgb(x, z)
                nb = es.aerial_rgb(x, z + 16)
                if not c or not nb:
                    continue
                if (c[0] + c[1] + c[2]) < (nb[0] + nb[1] + nb[2]) - 28 and c[1] + 6 >= c[0] and c[1] < 210:
                    reef.append((x, z, -0.2))
        # sea grape on the dune between the sand and the boulevard
        if shore and road and road - shore > 28:
            x = shore + 20
            while x < road - 14:
                h = es.height_at(x, z)
                c = es.aerial_rgb(x, z)
                if c and 0.35 < h < 3.4:
                    r, g, b = c
                    if g + 8 >= r and g + 2 >= b and (r + g + b) < 500 and g < 175:
                        if not near_bark(bark, x, z) and not on_building(buildings, x, z):
                            if not any(es.hypot(x - a, z - b) < 16 for a, b, _s in grapes):
                                sc = 1.25 if (r + g + b) < 400 else 0.95
                                grapes.append((x, z, sc))
                                break
                x += 8
        if road and int(round(z)) % 70 < 14:
            lx = road - 6.5
            h = es.height_at(lx, z)
            if _on_dry(lx, z) and not on_building(buildings, lx, z):
                if not any(abs(z - pz) < 50 for _px, pz in lamps):
                    lamps.append((lx, z))
        z += 14
    def thin(rows, gap, cap):
        kept = []
        for x, z, y in rows:
            if any(es.hypot(x - a, z - b) < gap for a, b, _y in kept):
                continue
            kept.append((x, z, y))
            if len(kept) >= cap:
                break
        return kept
    pale = thin(pale, 34, 36)
    reef = thin(reef, 28, 32)
    grapes.sort(key=lambda t: t[1])
    if len(grapes) > 64:
        step = len(grapes) / 64
        grapes = [grapes[int(i * step)] for i in range(64)]
    print("pale", len(pale), "reef", len(reef), "grape", len(grapes), "lamps", len(lamps))
    return pale, reef, grapes, lamps, buildings


def _mesh_pts(path):
    """Local positions of the first mesh, decoded if the hero is quantized."""
    js, buf = _gltf(path)
    node = js["nodes"][0]
    tr = node.get("translation") or [0, 0, 0]
    sc = node.get("scale") or [1, 1, 1]
    mesh = js["meshes"][node["mesh"]]
    prim = mesh["primitives"][0]
    acc = js["accessors"][prim["attributes"]["POSITION"]]
    bv = js["bufferViews"][acc["bufferView"]]
    start = bv.get("byteOffset", 0) + (acc.get("byteOffset") or 0)
    ct = acc.get("componentType")
    stride = bv.get("byteStride") or (6 if ct == 5122 else 12)
    step = max(1, acc["count"] // 900)
    pts = []
    for i in range(0, acc["count"], step):
        if ct == 5122:
            qx, qy, qz = struct.unpack_from("<hhh", buf, start + i * stride)
            pts.append((tr[0] + (qx / 32767.0) * sc[0], tr[1] + (qy / 32767.0) * sc[1], tr[2] + (qz / 32767.0) * sc[2]))
        elif ct == 5126:
            x, y, z = struct.unpack_from("<fff", buf, start + i * stride)
            pts.append((tr[0] + x * sc[0], tr[1] + y * sc[1], tr[2] + z * sc[2]))
    return pts


def hero_windows():
    """Warm panes on the beach face of each low-rise hero, just outside the mesh."""
    heroes = [
        ("amsterdam", 2),
        ("m_lacabana", 3),
        ("m_manchebobeachresortspa", 2),
        ("m_bucutiandtararesort", 2),
        ("costalinda", 3),
        ("divi", 2),
        ("tamarijn", 2),
        ("casadelmar", 2),
        ("paradisebeach", 2),
    ]
    man = {e.get("id"): e for e in json.loads(open(es.MANIFEST).read())}
    out = []
    for hid, floors in heroes:
        e = man.get(hid)
        path = os.path.join(es.HERO, hid + ".glb")
        if not e or not os.path.exists(path):
            print("skip windows", hid)
            continue
        pts = _mesh_pts(path)
        if len(pts) < 8:
            continue
        maxy = max(p[1] for p in pts)
        # west edge of each slice, so a wing does not steal every window
        bins = {}
        for x, _y, z in pts:
            k = int(round(z / 8.0)) * 8
            if k not in bins or x < bins[k]:
                bins[k] = x
        beach = sorted((z, x) for z, x in bins.items() if x < 2.0)
        if len(beach) < 2:
            beach = sorted(bins.items())
        n = min(4, len(beach))
        picks = []
        for i in range(n):
            z, x = beach[int(i * (len(beach) - 1) / max(1, n - 1))]
            if not picks or abs(z - picks[-1][0]) > 6:
                picks.append((z, x))
        ground = es.height_at(e["x"], e["z"])
        for lz, lx in picks:
            wx = e["x"] + lx - 0.65
            wz = e["z"] + lz
            f = 0
            while f < floors:
                ly = 2.4 + f * 2.6
                if ly > maxy - 1.0:
                    break
                out.append((wx, ground + ly, wz))
                f += 1
    print("windows", len(out))
    return out[:72]


def _on_dry(x, z):
    """A glow in the wash reads as a blob offshore once High bloom picks it up."""
    h = es.height_at(x, z)
    shore = shore_at(z)
    if shore is not None and x < shore + 0.6:
        return False
    return 0.35 < h < 8.0

def bar_bulbs():
    """String lights at the fofoti palapa bar and the Manchebo sand."""
    # Just seaward of the palapa roofs, on the sand, so the string is not inside the bar mesh.
    spots = [(-9266, -3836, 16, 0.15), (-10138, -2318, 14, 0.4), (-10070, -2478, 12, 1.1)]
    bulbs = []
    for x, z, n, yaw in spots:
        h = es.height_at(x, z)
        if not (0.35 < h < 4):
            print("skip bar", x, z, "h", round(h, 2))
            continue
        kept = 0
        for i in range(n):
            t = i - (n - 1) / 2
            bx = x + math.sin(yaw) * t * 0.9
            bz = z + math.cos(yaw) * t * 0.9
            if not _on_dry(bx, bz):
                print("skip bulb", round(bx, 1), round(bz, 1), "h", round(es.height_at(bx, bz), 2))
                continue
            bulbs.append((bx, h + 2.35, bz))
            kept += 1
        print("bar", x, z, "bulbs", kept)
    return bulbs


def add_ribbon(mesh, rows, ox, oz):
    """rows: (x0, x1, z, y) every 14 m. Stitch neighbours into quads."""
    rows = sorted(rows, key=lambda r: r[2])
    if len(rows) < 2:
        return 0
    ids = []
    for x0, x1, z, y in rows:
        a = mesh.v(x0 - ox, y, z - oz, 0, 1, 0, 0, 0)
        b = mesh.v(x1 - ox, y, z - oz, 0, 1, 0, 1, 0)
        ids.append((a, b))
    for i in range(len(ids) - 1):
        # skip a tear where the shore jumps (Eagle vs a gap)
        if abs(rows[i + 1][2] - rows[i][2]) > 20:
            continue
        a0, b0 = ids[i]
        a1, b1 = ids[i + 1]
        mesh.quad(a0, b0, b1, a1)
    return len(mesh.i) // 3


def mark_unlit(raw, names):
    """Colour sheets use MeshBasic so the drone gradient is not shaded grey."""
    js, buf = _gltf_bytes(raw)
    used = js.setdefault("extensionsUsed", [])
    if "KHR_materials_unlit" not in used:
        used.append("KHR_materials_unlit")
    for m in js["materials"]:
        if m.get("name") in names:
            m.setdefault("extensions", {})["KHR_materials_unlit"] = {}
            m.pop("emissiveFactor", None)
    return _repack(js, buf)


def _gltf_bytes(data):
    off = 12
    js = bin_ = None
    while off < len(data):
        clen, ctype = struct.unpack_from("<I4s", data, off)
        chunk = data[off + 8:off + 8 + clen]
        if ctype == b"JSON":
            js = json.loads(chunk)
        elif ctype == b"BIN\x00":
            bin_ = chunk
        off += 8 + clen
    return js, bin_


def _repack(js, buf):
    payload = json.dumps(js, separators=(",", ":")).encode()
    while len(payload) % 4:
        payload += b" "
    bin_ = bytes(buf)
    while len(bin_) % 4:
        bin_ += b"\x00"
    out = bytearray()
    out += b"glTF" + struct.pack("<II", 2, 12 + 8 + len(payload) + 8 + len(bin_))
    out += struct.pack("<I", len(payload)) + b"JSON" + payload
    out += struct.pack("<I", len(bin_)) + b"BIN\x00" + bin_
    return bytes(out)


def build():
    pale, reef, grapes, lamps, buildings = collect()
    windows = [w for w in hero_windows() if _on_dry(w[0], w[2])]
    bulbs = bar_bulbs()
    print("bar bulbs", len(bulbs))
    # Pale and reef samples are not meshed. A colour sheet in the shallows
    # shadowed the dry sand, so a short count must not block the lamps.
    if len(grapes) < 8:
        raise SystemExit("too little sea grape, not writing")
    pts = [(p[0], p[1]) for p in pale] + [(g[0], g[1]) for g in grapes]
    ox = sum(p[0] for p in pts) / len(pts)
    oz = sum(p[1] for p in pts) / len(pts)
    base = es.height_at(ox, oz)
    g = es.G()
    # Shallow sheets and seabed discs both cast a shadow across the dry sand
    # (hero meshes cast shadows on High). The water keeps the island shader.
    leaf_m = glow_mat(g, "grape", (46, 104, 58), (0, 0, 0))
    pole_m = glow_mat(g, "pole", (186, 178, 164), (0, 0, 0))
    bulb_m = glow_mat(g, "bulb", (255, 214, 140), (255, 196, 90))
    win_m = glow_mat(g, "win", (255, 220, 160), (255, 186, 80))

    def inst(mesh, mat, triples, scales=None):
        """triples are absolute (x,y,z). Returns the node index."""
        if len(triples) < 1:
            return None
        mi = g.add_mesh("m", [(mesh.p, mesh.n, mesh.u, mesh.i, mat)])
        tr, ro, sc = [], [], []
        for i, (x, y, z) in enumerate(triples):
            tr += [x - ox, y - base, z - oz]
            ro += [0, 0, 0, 1]
            s = scales[i] if scales else 1
            if isinstance(s, tuple):
                sc += list(s)
            else:
                sc += [s, s, s]
        return g.add_inst(mi, tr, ro, sc)

    grape_s = [s for _x, _z, s in grapes]
    # bushes sit on the sand minimum beside a canopy pixel
    grape_xyz = []
    for x, z, _s in grapes:
        y = es.height_at(x, z)
        for dx, dz in ((-4, 0), (4, 0), (0, -4), (0, 4)):
            h = es.height_at(x + dx, z + dz)
            if 0.3 < h < y:
                y = h
        grape_xyz.append((x, y, z))
    g0 = inst(grape(0), leaf_m, grape_xyz, grape_s)
    g1 = inst(grape(1), leaf_m, grape_xyz, grape_s)
    lamp_xyz = []
    for x, z in lamps:
        y = es.height_at(x, z)
        lamp_xyz.append((x, y, z))
    # Each LOD gets its own nodes. A glTF node has one parent.
    pole_n = inst(lamp_pole(), pole_m, lamp_xyz)
    pole_n1 = inst(lamp_pole(), pole_m, lamp_xyz)
    bulb_xyz = [(x, y + 3.35, z) for x, y, z in lamp_xyz]
    bulb_n = inst(bulb(), bulb_m, bulb_xyz)
    bulb_n1 = inst(bulb(), bulb_m, bulb_xyz)
    bar_xyz = [(x, y, z) for x, y, z in bulbs]
    bar_s = [0.72] * len(bulbs)
    bar_n = inst(bulb(), bulb_m, bar_xyz, bar_s)
    bar_n1 = inst(bulb(), bulb_m, bar_xyz, bar_s)
    win_q = unit_quad((-1, 0, 0))
    win_n = inst(win_q, win_m, windows)
    win_n1 = inst(win_q, win_m, windows)

    def lod(name, nodes):
        kids = [n for n in nodes if n is not None]
        g.nodes.append({"name": name, "children": kids})
        return len(g.nodes) - 1

    hi = lod("eb_dusk_lod0", [g0, pole_n, bulb_n, bar_n, win_n])
    lo = lod("eb_dusk_lod1", [g1, pole_n1, bulb_n1, bar_n1, win_n1])
    path = os.path.join(es.HERO, "eb_dusk.glb")
    raw = g.pack([hi, lo])
    open(path, "wb").write(raw)
    print("wrote", path, "bytes", os.path.getsize(path), "origin", round(ox, 1), round(oz, 1))
    tris0 = len(grapes) * (len(grape(0).i) // 3)
    tris0 += len(lamps) * (len(lamp_pole().i) // 3 + 20) + len(bulbs) * 20 + len(windows) * 2
    tris1 = len(grapes) * (len(grape(1).i) // 3)
    tris1 += len(lamps) * (len(lamp_pole().i) // 3 + 20) + len(bulbs) * 20 + len(windows) * 2
    return {
        "ox": ox, "oz": oz,
        "tris0": tris0, "tris1": tris1,
        "grape": len(grapes), "lamps": len(lamps), "reef": len(reef),
        "windows": len(windows), "bars": len(bulbs),
    }


def write_manifest(info):
    raw = open(es.MANIFEST).read()
    manifest = json.loads(raw)
    entry = {
        "id": "eb_dusk", "k": "eb_dusk",
        "name": "Eagle Beach dusk lights, shallows, and sea grape",
        "status": "eagle-strip",
        "x": round(info["ox"], 2), "z": round(info["oz"], 2), "y": 0, "rotation": 0,
        "glb": "models/hero/eb_dusk.glb",
        "lod": {"hi": "eb_dusk_lod0", "lo": "eb_dusk_lod1", "switch_m": 380},
        "tris": {"eb_dusk_lod0": info["tris0"], "eb_dusk_lod1": info["tris1"]},
        "textures": 0, "hide_footprint": [], "hide": [],
        "sign": False, "kind": "replace", "new_place": False,
        "geo_source": "Esri World Imagery shore and dune along Eagle Beach and Manchebo",
        "ref_sources": (
            "Sea grape is the low round bush on the dune between the sand and J.E. "
            "Irausquin, placed where the aerial is dark green and clear of the fofoti. "
            "A colour sheet in the shallows shadowed the dry sand, so the beach grain "
            "and the island water shader stay as they are. Hotel windows sit on the "
            "beach face of each resort hero. Boulevard lamps and the palapa-bar strings "
            "are emissive glow, the same cheap night read used elsewhere on the map. "
            "Existing resort heroes and the fofoti sets are left in place. Original geometry."
        ),
        "frame": "glb origin = centroid of the sea grape and the shallow samples; landmarks/eagle_dusk.py",
        "cat": "landmark",
    }
    # Splice one entry. Dumping the whole file rewrites every other hero.
    block = json.dumps(entry, indent=1)
    block = "\n".join((" " + line) if line else line for line in block.split("\n"))
    if '"id": "eb_dusk"' in raw:
        raise SystemExit("eb_dusk already in the manifest; refusing to rewrite it in place")
    head = raw.rstrip()
    if not head.endswith("]"):
        raise SystemExit("manifest does not end with ]")
    head = head[:-1].rstrip()
    if not head.endswith("}"):
        raise SystemExit("manifest tail is not an object")
    text = head + ",\n" + block + "\n]"
    check = json.loads(text)
    old_by = {e.get("id"): e for e in manifest}
    changed = [e.get("id") for e in check if e.get("id") != "eb_dusk" and old_by.get(e.get("id")) != e]
    if changed or not any(e.get("id") == "eb_dusk" for e in check):
        raise SystemExit("refusing to rewrite heroes: " + ", ".join(changed[:8]))
    open(es.MANIFEST, "w").write(text)
    print("manifest", len(check), "tris", info["tris0"], info["tris1"])


if __name__ == "__main__":
    if os.environ.get("EAGLE_DUSK") != "1":
        raise SystemExit("set EAGLE_DUSK=1")
    write_manifest(build())
