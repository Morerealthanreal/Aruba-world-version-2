#!/usr/bin/env python3
"""Median and centre lights on the airport end of Watty Vos.

Commons 'Directional signs on Watty Vos Boulevard' (12.50795, -70.00915,
inside the owned box) shows the divided boulevard: two carriageways, a
median, and streetlights down the centre. The road data already has the
paired one-way carriageways. This hero fills the gap between them.

Does not edit the asphalt shader, does not set ow=0, and does not leave
the owned box (-5600<x<-4000, -300<z<2000). Noord and the hotel strip
stay untouched. The old dash run is replaced: those boxes were the 9.6 ms.
"""
import json
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, write_glb  # noqa: E402
from hooiberg_stair import sample_h  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
REAL = ROOT / "game" / "data" / "real"
ID = "watty_lane_dashes"

X0, X1 = -5600.0, -4000.0
Z0, Z1 = -300.0, 2000.0
MEDIAN_W = 2.6
LIGHT_EVERY = 62.0


def owned(x, z):
    return X0 < x < X1 and Z0 < z < Z1


def length_of(pts):
    return sum(math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) for i in range(len(pts) - 1))


def named_watty():
    found = []
    for path in sorted(REAL.glob("r_*.json")):
        data = json.loads(path.read_text())
        for road in data.get("roads") or []:
            if "Watty" not in (road.get("n") or ""):
                continue
            if (road.get("w") or 0) < 7 or (road.get("c") or 0) < 4:
                continue
            pts = road.get("p") or []
            if len(pts) < 2 or length_of(pts) < 40:
                continue
            if sum(1 for x, z in pts if owned(x, z)) < 2:
                continue
            found.append(pts)
    if len(found) < 2:
        raise SystemExit("need a pair of Watty carriageways")
    return found


def project(x, z, pts):
    best = None
    for i in range(len(pts) - 1):
        ax, az = pts[i]
        bx, bz = pts[i + 1]
        dx, dz = bx - ax, bz - az
        L2 = dx * dx + dz * dz or 1.0
        t = max(0.0, min(1.0, ((x - ax) * dx + (z - az) * dz) / L2))
        qx, qz = ax + t * dx, az + t * dz
        d = math.hypot(x - qx, z - qz)
        if best is None or d < best[0]:
            best = (d, qx, qz)
    return best


def resample(pts, step):
    out = [pts[0]]
    acc = 0.0
    x0, z0 = pts[0]
    for i in range(len(pts) - 1):
        x1, z1 = pts[i + 1]
        seg = math.hypot(x1 - x0, z1 - z0)
        if seg < 1e-6:
            x0, z0 = x1, z1
            continue
        while acc + seg >= step:
            t = (step - acc) / seg
            x0 += (x1 - x0) * t
            z0 += (z1 - z0) * t
            out.append((x0, z0))
            seg = math.hypot(x1 - x0, z1 - z0)
            acc = 0.0
            if seg < 1e-6:
                break
        acc += seg
        x0, z0 = x1, z1
    return out


def median_line():
    """Midline where two owned carriageways run 8–20 m apart."""
    polys = named_watty()
    raw = []
    for ia, pts in enumerate(polys):
        for x, z in resample(pts, 8.0):
            if not owned(x, z):
                continue
            best = None
            for ib, other in enumerate(polys):
                if ib == ia:
                    continue
                d, qx, qz = project(x, z, other)
                if 8.0 <= d <= 20.0 and owned(qx, qz) and (best is None or d < best[0]):
                    best = (d, qx, qz)
            if best:
                raw.append(((x + best[1]) * 0.5, (z + best[2]) * 0.5))
    if len(raw) < 12:
        raise SystemExit(f"median has too few points ({len(raw)})")
    # The boulevard runs from the airport (northeast) toward the southwest.
    axis = (-0.34, -0.94)
    raw.sort(key=lambda p: p[0] * axis[0] + p[1] * axis[1])
    stretches, cur = [], [raw[0]]
    for p in raw[1:]:
        if math.hypot(p[0] - cur[-1][0], p[1] - cur[-1][1]) < 7:
            continue
        if math.hypot(p[0] - cur[-1][0], p[1] - cur[-1][1]) > 24:
            if len(cur) >= 4:
                stretches.append(cur)
            cur = [p]
        else:
            cur.append(p)
    if len(cur) >= 4:
        stretches.append(cur)
    if not stretches:
        raise SystemExit("no median stretch")
    return stretches


def median_seg(mesh, cx, cy, cz, tx, tz, length, width, height):
    """Top and two sides. The ends and the underside are not visible."""
    nx, nz = -tz, tx
    hx, hy, hz = length / 2, height / 2, width / 2

    def w(lx, ly, lz):
        return (cx + lx * tx + lz * nx, cy + ly, cz + lx * tz + lz * nz)

    ltf, rtf = w(-hx, hy, -hz), w(hx, hy, -hz)
    ltb, rtb = w(-hx, hy, hz), w(hx, hy, hz)
    lbf, rbf = w(-hx, -hy, -hz), w(hx, -hy, -hz)
    lbb, rbb = w(-hx, -hy, hz), w(hx, -hy, hz)
    mesh.quad(ltf, rtf, rtb, ltb)
    mesh.quad(lbb, ltb, rtb, rbb)
    mesh.quad(rbf, lbf, ltf, rtf)


def pole(post, head, cx, cy, cz, tx, tz, across):
    """Centre light: a dark pole and a bright head over one carriageway."""
    nx, nz = -tz, tx
    h = 8.2
    sign = 1 if across >= 0 else -1

    def q(mesh, y0, y1, lx, lz, sx, sz):
        def p(y, a, b):
            return (cx + a * tx + b * nx, cy + y, cz + a * tz + b * nz)
        mesh.quad(p(y0, lx - sx, lz), p(y0, lx + sx, lz), p(y1, lx + sx, lz), p(y1, lx - sx, lz))
        mesh.quad(p(y0, lx, lz - sz), p(y1, lx, lz - sz), p(y1, lx, lz + sz), p(y0, lx, lz + sz))

    q(post, 0.2, h, 0, 0, 0.09, 0.09)
    q(post, h - 0.35, h - 0.12, 0, sign * 1.15, 0.9, 0.06)
    head.quad(
        (cx + sign * nx * 1.6, cy + h - 0.58, cz + sign * nz * 1.6),
        (cx + sign * nx * 2.3, cy + h - 0.58, cz + sign * nz * 2.3),
        (cx + sign * nx * 2.3, cy + h - 0.22, cz + sign * nz * 2.3),
        (cx + sign * nx * 1.6, cy + h - 0.22, cz + sign * nz * 1.6),
    )


def build():
    stretches = median_line()
    stations = []
    for stretch in stretches:
        stations.extend(resample(stretch, 22.0))
    # Drop points that landed on top of each other after the resample.
    kept = [stations[0]]
    for p in stations[1:]:
        if math.hypot(p[0] - kept[-1][0], p[1] - kept[-1][1]) > 6:
            kept.append(p)
    stations = kept
    if len(stations) < 8:
        raise SystemExit("too few median stations")
    ox = sum(p[0] for p in stations) / len(stations)
    oz = sum(p[1] for p in stations) / len(stations)
    cache = {}
    oy = sample_h(ox, oz, cache)
    tangents = []
    for i, (x, z) in enumerate(stations):
        k = i + 1 if i + 1 < len(stations) else i - 1
        tx, tz = stations[k][0] - x, stations[k][1] - z
        mag = math.hypot(tx, tz) or 1
        tangents.append((tx / mag, tz / mag))
    M = Model(ID)
    concrete = M.material("concrete", (0.30, 0.29, 0.26), 0.9)
    pole_m = M.material("pole", (0.10, 0.10, 0.10), 0.5)
    lamp = M.material("lamp", (0.85, 0.78, 0.55), 0.4, emissive=0.35)
    along = 0.0
    light_at = []
    for i in range(len(stations)):
        if i:
            along += math.hypot(stations[i][0] - stations[i - 1][0], stations[i][1] - stations[i - 1][1])
        if not light_at or along - light_at[-1][0] >= LIGHT_EVERY:
            light_at.append((along, i))
    for lod, step, light_step in ((0, 1, 1), (1, 2, 2)):
        curb = M.mesh(lod, concrete)
        posts = M.mesh(lod, pole_m)
        heads = M.mesh(lod, lamp)
        for i in range(0, len(stations) - 1, step):
            j = min(i + step, len(stations) - 1)
            x0, z0 = stations[i]
            x1, z1 = stations[j]
            seg = math.hypot(x1 - x0, z1 - z0)
            if seg < 3:
                continue
            tx, tz = tangents[i]
            mx, mz = (x0 + x1) / 2 - ox, (z0 + z1) / 2 - oz
            h = sample_h((x0 + x1) / 2, (z0 + z1) / 2, cache)
            cy = (h - oy) + 0.22
            median_seg(curb, mx, cy, mz, tx, tz, seg * 0.96, MEDIAN_W, 0.28)
        for n, (_dist, i) in enumerate(light_at):
            if n % light_step:
                continue
            x, z = stations[i]
            tx, tz = tangents[i]
            h = sample_h(x, z, cache)
            cy = (h - oy) + 0.36
            # Alternate which carriageway the arm reaches over.
            pole(posts, heads, x - ox, cy, z - oz, tx, tz, 1 if n % 2 == 0 else -1)
    info = write_glb(M, HERO / f"{ID}.glb")
    check_glb(HERO / f"{ID}.glb")
    metres = sum(length_of(s) for s in stretches)
    print(ID, "median_m", round(metres, 1), "stations", len(stations), "lights", len(light_at),
          "at", round(ox, 2), round(oz, 2), "y", round(oy, 2), info)
    if info["lod0"] > 900:
        raise SystemExit("boulevard mesh is heavier than the dash run it replaces")
    return info, ox, oz, oy, metres, len(light_at)


def upsert(info, ox, oz, oy, metres, nlight):
    data = json.loads(MANIFEST.read_text())
    y = round(oy, 2) or 0.05
    entry = {
        "id": ID, "k": ID, "name": "", "status": "accuracy-highway",
        "x": round(ox, 2), "z": round(oz, 2), "y": y, "rotation": 0,
        "glb": f"models/hero/{ID}.glb",
        "lod": {"hi": f"{ID}_lod0", "lo": f"{ID}_lod1", "switch_m": 280},
        "tris": {f"{ID}_lod0": info["lod0"], f"{ID}_lod1": info["lod1"]},
        "textures": 0,
        "hide_footprint": None,
        "hide": [],
        "sign": False,
        "kind": "replace",
        "new_place": False,
        "geo_source": (
            f"Midline between the paired owned Watty Vos carriageways "
            f"({round(metres)} m of median, {nlight} centre lights)"
        ),
        "ref_sources": (
            "Commons 'Directional signs on Watty Vos Boulevard, Aruba' is at 12.50795, -70.00915, "
            "which is inside the owned airport end (about x=-4254, z=1332), not the hotel strip. "
            "The sign points toward Palm Beach; the photo itself is the divided boulevard: a median "
            "between the two one-way carriageways and streetlights down the centre. "
            "The asphalt shader was not edited and ow was not changed. "
            "Nothing was added outside -5600<x<-4000, -300<z<2000."
        ),
        "frame": "glb origin = median centroid (world x,z); glTF +X = world x, +Z = world z, Y up",
        "cat": "road",
    }
    ids = [item.get("id") for item in data]
    if ID not in ids:
        data.append(entry)
    else:
        data[ids.index(ID)] = entry
    if [item.get("id") for item in data] != (ids if ID in ids else ids + [ID]):
        raise SystemExit("id order changed")
    MANIFEST.write_text(json.dumps(data, indent=1) + "\n")


def main():
    info, ox, oz, oy, metres, nlight = build()
    upsert(info, ox, oz, oy, metres, nlight)


if __name__ == "__main__":
    main()
