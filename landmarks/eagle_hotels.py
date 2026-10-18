#!/usr/bin/env python3
"""Beach-side detail for the J.E. Irausquin low-rise hotels.

Amsterdam Manor's long beach walls get stepped white gables and a railed
balcony under each bay. La Cabana's beach walls get a white arch colonnade.
Existing walls, roofs and sign images are not rewritten.

Does not call eagle_strip.main(). Run with EAGLE_HOTELS=1.
"""
import json
import math
import os
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import eagle_strip as es

HERO = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../game/models/hero")
MANIFEST = os.path.join(os.path.dirname(os.path.abspath(__file__)), "../game/data/hero/manifest.json")


def load_glb(path):
    data = open(path, "rb").read()
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
    out = b"glTF" + struct.pack("<II", 2, 12 + 8 + len(payload) + 8 + len(raw))
    out += struct.pack("<I", len(payload)) + b"JSON" + payload
    out += struct.pack("<I", len(raw)) + b"BIN\x00" + raw
    open(path, "wb").write(out)


def positions(js, blob, prim):
    a = js["accessors"][prim["attributes"]["POSITION"]]
    bv = js["bufferViews"][a["bufferView"]]
    start = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
    stride = bv.get("byteStride") or 12
    return [struct.unpack_from("<fff", blob, start + i * stride) for i in range(a["count"])]


def indices(js, blob, prim):
    a = js["accessors"][prim["indices"]]
    bv = js["bufferViews"][a["bufferView"]]
    start = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
    ctype = a["componentType"]
    fmt = "<H" if ctype == 5123 else "<I"
    sz = 2 if ctype == 5123 else 4
    return [struct.unpack_from(fmt, blob, start + i * sz)[0] for i in range(a["count"])]


def append_prim(js, blob, mesh_name, mesh, material):
    found = next(m for m in js["meshes"] if m.get("name") == mesh_name)
    pos, nrm, uv, idx = mesh.p, mesh.n, mesh.u, mesh.i
    if len(idx) < 3:
        return 0
    if len(idx) > 65000:
        raise SystemExit(f"{mesh_name} trim exceeds uint16")
    for k in range(0, len(nrm), 3):
        if nrm[k] ** 2 + nrm[k + 1] ** 2 + nrm[k + 2] ** 2 < 1e-8:
            nrm[k], nrm[k + 1], nrm[k + 2] = 0.0, 1.0, 0.0
    nv = len(pos) // 3

    def f32(vals):
        return struct.pack("<" + "f" * len(vals), *[float(v) for v in vals])

    def add(raw, target, count, typ, ctype, mn=None, mx=None):
        while len(blob) % 4:
            blob.append(0)
        off = len(blob)
        blob.extend(raw)
        js["bufferViews"].append({"buffer": 0, "byteOffset": off, "byteLength": len(raw), "target": target})
        acc = {"bufferView": len(js["bufferViews"]) - 1, "componentType": ctype, "count": count, "type": typ}
        if mn is not None:
            acc["min"], acc["max"] = mn, mx
        js["accessors"].append(acc)
        return len(js["accessors"]) - 1

    xs, ys, zs = pos[0::3], pos[1::3], pos[2::3]
    pa = add(f32(pos), 34962, nv, "VEC3", 5126, [min(xs), min(ys), min(zs)], [max(xs), max(ys), max(zs)])
    na = add(f32(nrm), 34962, nv, "VEC3", 5126)
    ua = add(f32(uv), 34962, nv, "VEC2", 5126)
    ia = add(struct.pack("<" + "H" * len(idx), *idx), 34963, len(idx), "SCALAR", 5123)
    found["primitives"].append({
        "attributes": {"POSITION": pa, "NORMAL": na, "TEXCOORD_0": ua},
        "indices": ia, "material": material,
    })
    return len(idx) // 3


def mat_of(js, name):
    for i, m in enumerate(js["materials"]):
        if m.get("name") == name:
            return i
    raise SystemExit("no material " + name)


def obox(mesh, cx, cy, cz, tx, tz, nx, nz, hx, hy, hz):
    """Box aligned to the wall: T along the wall, N outward, Y up."""
    axes = ((tx, 0.0, tz, hx), (0.0, 1.0, 0.0, hy), (nx, 0.0, nz, hz))
    # six faces, each a quad. Double-sided materials, normals still set.
    for ai, (ax, ay, az, h) in enumerate(axes):
        others = [a for j, a in enumerate(axes) if j != ai]
        for sign in (-1.0, 1.0):
            ox = cx + ax * h * sign
            oy = cy + ay * h * sign
            oz = cz + az * h * sign
            nrm = (ax * sign, ay * sign, az * sign)
            (bx, by, bz, hb), (cx_, cy_, cz_, hc) = others
            corners = []
            for s1 in (-1.0, 1.0):
                for s2 in (-1.0, 1.0):
                    corners.append((
                        ox + bx * hb * s1 + cx_ * hc * s2,
                        oy + by * hb * s1 + cy_ * hc * s2,
                        oz + bz * hb * s1 + cz_ * hc * s2,
                    ))
            # corners order is (-1,-1), (-1,+1), (+1,-1), (+1,+1) — not a loop.
            # Rebuild a loop: s1,s2 = (-,-), (+,-), (+,+), (-,+)
            loop = []
            for s1, s2 in ((-1, -1), (1, -1), (1, 1), (-1, 1)):
                loop.append((
                    ox + bx * hb * s1 + cx_ * hc * s2,
                    oy + by * hb * s1 + cy_ * hc * s2,
                    oz + bz * hb * s1 + cz_ * hc * s2,
                ))
            ids = [mesh.v(*p, *nrm, 0, 0) for p in loop]
            mesh.quad(ids[0], ids[1], ids[2], ids[3])


def frame(tx, tz, nx, nz):
    """Right-handed frame whose N matches the wall's outward normal."""
    ox, oz = -tz, tx  # T × Y
    if ox * nx + oz * nz < 0:
        tx, tz = -tx, -tz
        ox, oz = -ox, -oz
    return tx, tz, ox, oz


def wall_segments(js, blob, mesh_name):
    """Long vertical facade edges: length, outward normal, endpoints, eave."""
    mesh = next(m for m in js["meshes"] if m.get("name") == mesh_name)
    prim = mesh["primitives"][0]
    pts = positions(js, blob, prim)
    idx = indices(js, blob, prim)
    best = {}
    for t in range(0, len(idx), 3):
        tri = [pts[idx[t + k]] for k in range(3)]
        ys = [p[1] for p in tri]
        if max(ys) - min(ys) < 2.0:
            continue
        a, b, c = tri
        ux, uy, uz = b[0] - a[0], b[1] - a[1], b[2] - a[2]
        vx, vy, vz = c[0] - a[0], c[1] - a[1], c[2] - a[2]
        nx = uy * vz - uz * vy
        ny = uz * vx - ux * vz
        nz = ux * vy - uy * vx
        L = math.sqrt(nx * nx + ny * ny + nz * nz) or 1
        nx, ny, nz = nx / L, ny / L, nz / L
        if abs(ny) > 0.35:
            continue
        midy = (min(ys) + max(ys)) * 0.5
        low = [p for p in tri if p[1] <= midy]
        if len(low) < 2:
            continue
        p, q = low[0], low[1]
        length = math.hypot(p[0] - q[0], p[2] - q[2])
        if length < 8:
            continue
        key = (round(p[0], 0), round(p[2], 0), round(q[0], 0), round(q[2], 0), round(nx, 1))
        ytop = max(ys)
        prev = best.get(key)
        if prev is None or ytop > prev[5]:
            best[key] = (length, nx, nz, p, q, ytop)
    return list(best.values())


def sign_box(js, blob, mesh):
    for prim in mesh["primitives"]:
        if js["materials"][prim["material"]].get("name") == "sign":
            pts = positions(js, blob, prim)
            return (
                min(p[0] for p in pts), max(p[0] for p in pts),
                min(p[2] for p in pts), max(p[2] for p in pts),
            )
    return None


def near_sign(box, x, z, pad=3.5):
    if box is None:
        return False
    return (box[0] - pad) <= x <= (box[1] + pad) and (box[2] - pad) <= z <= (box[3] + pad)


def gable(mesh, cx, cz, tx, tz, nx, nz, y0, rise, half):
    """Stepped gable. The outline narrows, it is not a triangle with lines on it."""
    tx, tz, nx, nz = frame(tx, tz, nx, nz)
    # Strong taper so the part that clears the roof still reads as steps, not a slab.
    fracs = (1.0, 0.74, 0.50, 0.30, 0.14)
    steps = len(fracs)
    for i, frac in enumerate(fracs):
        hy = rise / steps * 0.52
        y = y0 + rise * (i + 0.5) / steps
        obox(mesh, cx + nx * 0.7, y, cz + nz * 0.7, tx, tz, nx, nz, half * frac, hy, 0.48)


def balcony(mesh, cx, cz, tx, tz, nx, nz, y, half):
    """Deck, posts and two rails. A sheet would read as another box."""
    tx, tz, nx, nz = frame(tx, tz, nx, nz)
    depth = 1.05
    deck_y = y
    obox(mesh, cx + nx * (depth * 0.5 + 0.12), deck_y, cz + nz * (depth * 0.5 + 0.12),
         tx, tz, nx, nz, half * 0.92, 0.06, depth * 0.5)
    front = depth + 0.12
    posts = 4
    for i in range(posts):
        t = -1 + (2 * i / (posts - 1))
        px = cx + tx * half * 0.88 * t + nx * front
        pz = cz + tz * half * 0.88 * t + nz * front
        obox(mesh, px, deck_y + 0.48, pz, tx, tz, nx, nz, 0.045, 0.48, 0.045)
    for rail_y, hy in ((0.92, 0.045), (0.48, 0.03)):
        obox(mesh, cx + nx * front, deck_y + rail_y, cz + nz * front,
             tx, tz, nx, nz, half * 0.9, hy, 0.035)


def arch(mesh, cx, cz, tx, tz, nx, nz, y0=0.15):
    """A pier, a semicircular band, and the other pier. The band shares the spring line."""
    tx, tz, nx, nz = frame(tx, tz, nx, nz)
    spring = 2.15
    outer, inner = 1.22, 0.78
    deep = 0.18
    segs = 8

    def at(radius, ang, y_lift):
        return (
            cx + tx * math.cos(ang) * radius,
            spring + math.sin(ang) * radius * y_lift,
            cz + tz * math.cos(ang) * radius,
        )

    def band(radius, ang0, ang1, nsign):
        """One face of the arch ring. nsign +1 is the beach side."""
        a = at(radius, ang0, 0.92)
        b = at(radius, ang1, 0.92)
        ids = []
        for p in (a, b):
            ids.append(mesh.v(
                p[0] + nx * deep * nsign, p[1], p[2] + nz * deep * nsign,
                nx * nsign, 0, nz * nsign, 0, 0,
            ))
        return ids

    # solid ring: front, back, extrados, soffit
    for i in range(segs):
        a0 = math.pi * i / segs
        a1 = math.pi * (i + 1) / segs
        of = band(outer, a0, a1, 1)
        ob = band(outer, a0, a1, -1)
        inf = band(inner, a0, a1, 1)
        inb = band(inner, a0, a1, -1)
        mesh.quad(of[0], of[1], inf[1], inf[0])  # beach face
        mesh.quad(ob[1], ob[0], inb[0], inb[1])  # back
        mesh.quad(ob[0], ob[1], of[1], of[0])    # extrados
        mesh.quad(inf[0], inf[1], inb[1], inb[0])  # soffit
    # piers land on the springing, so the opening reads as an arch
    jamb = (outer - inner) * 0.5
    mid_r = (outer + inner) * 0.5
    for side in (-1.0, 1.0):
        px = cx + tx * side * mid_r
        pz = cz + tz * side * mid_r
        obox(mesh, px, (y0 + spring) * 0.5, pz, tx, tz, nx, nz, jamb, (spring - y0) * 0.5, deep)


def beach_walls(segments, min_len):
    """Walls whose outward normal points to the beach (west, -X)."""
    out = [s for s in segments if s[1] < -0.72 and s[0] >= min_len]
    out.sort(key=lambda s: -s[0])
    return out


def walk(wall, inset, step, limit):
    length, nx, nz, p, q, ytop = wall
    dx, dz = q[0] - p[0], q[2] - p[2]
    L = math.hypot(dx, dz) or 1
    tx, tz = dx / L, dz / L
    s = inset
    n = 0
    while s < L - inset and n < limit:
        yield (p[0] + tx * s, p[2] + tz * s, tx, tz, nx, nz, ytop)
        s += step
        n += 1


def amsterdam(js, blob):
    mesh = next(m for m in js["meshes"] if m.get("name") == "amsterdam_lod0")
    before = len(mesh["primitives"])
    avoid = sign_box(js, blob, mesh)
    g = es.M()
    bays = 0
    for wall in beach_walls(wall_segments(js, blob, "amsterdam_lod0"), 16):
        if bays >= 8:
            break
        for cx, cz, tx, tz, nx, nz, ytop in walk(wall, 8.0, 14.0, 3):
            if bays >= 6 or near_sign(avoid, cx, cz, 6):
                continue
            # Peak clears the ridge. A gable that stops at the eave disappears into the roof.
            base = ytop + 0.55
            rise = 6.0
            gable(g, cx, cz, tx, tz, nx, nz, base, rise, 3.35)
            balcony(b := es.M(), cx, cz, tx, tz, nx, nz, max(2.4, ytop * 0.48), 2.15)
            # stitch balcony into g so one primitive carries the bay
            g.p += b.p
            g.n += b.n
            g.u += b.u
            base = (len(g.p) // 3) - (len(b.p) // 3)
            g.i += [i + base for i in b.i]
            bays += 1
    if bays < 3:
        raise SystemExit(f"amsterdam only placed {bays} bays")
    tris = append_prim(js, blob, "amsterdam_lod0", g, mat_of(js, "trim"))
    after = len(next(m for m in js["meshes"] if m.get("name") == "amsterdam_lod0")["primitives"])
    if after != before + 1:
        raise SystemExit("amsterdam primitive count changed unexpectedly")
    print(f"  amsterdam bays {bays} tris {tris}")
    return tris


def lacabana(js, blob):
    mesh = next(m for m in js["meshes"] if m.get("name") == "m_lacabana_lod0")
    before = len(mesh["primitives"])
    avoid = sign_box(js, blob, mesh)
    arches = es.M()
    n = 0
    for wall in beach_walls(wall_segments(js, blob, "m_lacabana_lod0"), 22)[:2]:
        for cx, cz, tx, tz, nx, nz, ytop in walk(wall, 3.2, 4.4, 8):
            if n >= 14 or near_sign(avoid, cx, cz, 4):
                continue
            arch(arches, cx, cz, tx, tz, nx, nz)
            n += 1
    if n < 6:
        raise SystemExit(f"lacabana only placed {n} arches")
    tris = append_prim(js, blob, "m_lacabana_lod0", arches, mat_of(js, "trim"))
    after = len(next(m for m in js["meshes"] if m.get("name") == "m_lacabana_lod0")["primitives"])
    if after != before + 1:
        raise SystemExit("lacabana primitive count changed unexpectedly")
    print(f"  lacabana arches {n} tris {tris}")
    return tris


def patch_tris(deltas):
    text = open(MANIFEST).read()
    for key, add in deltas.items():
        needle = f'"{key}": '
        i = text.find(needle)
        if i < 0:
            raise SystemExit("missing " + key)
        j = i + len(needle)
        k = j
        while text[k] in "0123456789":
            k += 1
        old = int(text[j:k])
        text = text[:j] + str(old + add) + text[k:]
        print(f"  tris {key} {old} -> {old + add}")
    if not text.rstrip().endswith("]"):
        raise SystemExit("manifest does not end with ]")
    open(MANIFEST, "w").write(text)


def sign_bytes(js, blob):
    total = []
    for img in js.get("images") or []:
        bv = js["bufferViews"][img["bufferView"]]
        start = bv.get("byteOffset", 0)
        total.append(bytes(blob[start:start + bv["byteLength"]]))
    return b"".join(total)


def main():
    path = os.path.join(HERO, "amsterdam.glb")
    js, blob = load_glb(path)
    before = sign_bytes(js, blob)
    a_tris = amsterdam(js, blob)
    if sign_bytes(js, blob) != before:
        raise SystemExit("amsterdam sign bytes changed")
    save_glb(path, js, blob)

    path = os.path.join(HERO, "m_lacabana.glb")
    js, blob = load_glb(path)
    before = sign_bytes(js, blob)
    c_tris = lacabana(js, blob)
    if sign_bytes(js, blob) != before:
        raise SystemExit("lacabana sign bytes changed")
    save_glb(path, js, blob)
    patch_tris({"amsterdam_lod0": a_tris, "m_lacabana_lod0": c_tris})
    print("hotels detailed")


if __name__ == "__main__":
    if os.environ.get("EAGLE_HOTELS") == "1":
        main()
    else:
        print("eagle_hotels: set EAGLE_HOTELS=1 to add beach-side gables and arches")
