#!/usr/bin/env python3
"""Bake Ayo, the Balashi gold mill, and the north-coast dirt-road walls.

OSM is the layout. The Balashi brewery is a different place and is not included.
The Natural Pool is not included. Ground photos are not read here.
"""
import json
import math
import xml.etree.ElementTree as ET
from pathlib import Path

LAT0, LON0 = 12.52, -69.97
MX = 111320 * math.cos(math.radians(LAT0))
MZ = 110540
# Published gold-mill point (12.5046, -69.9604). The brewery hero sits elsewhere.
MILL = (1043.0, 1702.0)
BREWERY = (-1322.2, 4227.0)
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "game" / "data" / "real" / "inland_north.json"


def xz(lat, lon):
    return ((lon - LON0) * MX, (LAT0 - lat) * MZ)


def rnd(v, n=1):
    return round(float(v), n)


def dist(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


def pip(ring, x, z):
    c = False
    j = len(ring) - 1
    for i in range(len(ring)):
        yi, yj = ring[i][1], ring[j][1]
        if (yi > z) != (yj > z) and x < (ring[j][0] - ring[i][0]) * (z - yi) / ((yj - yi) or 1e-6) + ring[i][0]:
            c = not c
        j = i
    return c


def centroid(ring):
    pts = ring[:-1] if len(ring) > 1 and dist(ring[0], ring[-1]) < 0.2 else ring
    return (sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts))


def length(pts):
    return sum(dist(pts[i - 1], pts[i]) for i in range(1, len(pts)))


def resample(pts, step):
    if len(pts) < 2:
        return pts[:]
    out = [pts[0]]
    acc = 0.0
    ax, az = pts[0]
    for bx, bz in pts[1:]:
        seg = math.hypot(bx - ax, bz - az)
        if seg < 0.01:
            continue
        while acc + seg >= step:
            t = (step - acc) / seg
            ax = ax + (bx - ax) * t
            az = az + (bz - az) * t
            out.append((ax, az))
            seg = math.hypot(bx - ax, bz - az)
            acc = 0.0
        acc += seg
        ax, az = bx, bz
    if dist(out[-1], pts[-1]) > step * 0.45:
        out.append(pts[-1])
    return out


def normals(pts):
    out = []
    for i, p in enumerate(pts):
        if i == 0:
            dx, dz = pts[1][0] - p[0], pts[1][1] - p[1]
        elif i == len(pts) - 1:
            dx, dz = p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]
        else:
            dx, dz = pts[i + 1][0] - pts[i - 1][0], pts[i + 1][1] - pts[i - 1][1]
        L = math.hypot(dx, dz) or 1
        # yaw aligns the wall's long axis with the road under Three's Y rotation.
        out.append((-dz / L, dx / L, math.atan2(dz, dx)))
    return out


def load_ayo():
    root = ET.parse("/tmp/nc/ayo.xml").getroot()
    nodes = {n.get("id"): (float(n.get("lat")), float(n.get("lon"))) for n in root.findall("node")}
    for w in root.findall("way"):
        if w.get("id") != "43109643":
            continue
        return [xz(*nodes[nd.get("ref")]) for nd in w.findall("nd")]
    raise SystemExit("missing Ayo way")


def load_roads():
    blob = json.loads(Path("/tmp/nc/roads.json").read_text())
    roads = []
    for el in blob["elements"]:
        tags = el.get("tags") or {}
        hw = tags.get("highway")
        if hw not in ("track", "path", "unclassified", "tertiary"):
            continue
        geom = el.get("geometry") or []
        pts = [xz(g["lat"], g["lon"]) for g in geom]
        if len(pts) < 2:
            continue
        roads.append({"id": el.get("id"), "name": tags.get("name") or "", "hw": hw, "surf": tags.get("surface") or "", "pts": pts, "len": length(pts)})
    return roads


def near_line(pts, x, z, r):
    for p in pts:
        if dist(p, (x, z)) < r:
            return True
    return False


def main():
    ayo = load_ayo()
    c = centroid(ayo)
    south = max(ayo, key=lambda p: p[1])
    north = min(ayo, key=lambda p: p[1])
    # Walking trail: south entrance, a bend, then up toward the boulder mound.
    trail = []
    for i in range(18):
        t = i / 17
        x = south[0] + (c[0] - south[0]) * t + math.sin(t * math.pi) * 14
        z = south[1] + (north[1] + 18 - south[1]) * t
        if not pip(ayo, x, z):
            x, z = c[0] * 0.35 + x * 0.65, c[1] * 0.35 + z * 0.65
        trail.append((x, z))
    trail = resample(trail, 4.5)

    # The pile sits just off the walking trail, on the same ground the path uses.
    mi = max(6, len(trail) // 3)
    # Stop at the pile. The rest of the park climbs a ridge and the ribbon reads as a blade.
    trail = trail[:mi + 8]
    base = trail[mi]
    bnx, bnz, byaw = normals(trail)[mi]
    mound = (base[0] + bnx * 9, base[1] + bnz * 9)
    rocks = []
    lifts = [0, 0, 0, 0.2, 0.45, 0, 0.25, 0, 0.5, 0]
    for i in range(10):
        ang = i * 0.85
        rad = 1.2 + (i % 3) * 1.2
        rocks.append([
            rnd(mound[0] + math.cos(ang) * rad), rnd(mound[1] + math.sin(ang) * rad * 0.75),
            rnd(ang, 2), rnd(3.2 + (i % 3) * 0.65, 2), rnd(2.3 + (i % 4) * 0.3, 2), rnd(2.9 + (i % 3) * 0.35, 2), lifts[i],
        ])
    rocks.append([rnd(mound[0] - bnx * 1.2), rnd(mound[1] - bnz * 1.2), rnd(byaw, 2), 5.6, 3.8, 4.8, 0])
    n = 0
    x = mound[0] - 22
    while x < mound[0] + 22 and len(rocks) < 22:
        z = mound[1] - 16
        while z < mound[1] + 16 and len(rocks) < 22:
            px, pz = x + ((n * 5) % 7) - 3, z + ((n * 3) % 5) - 2
            if pip(ayo, px, pz) and 7 < dist((px, pz), mound) < 20 and not near_line(trail, px, pz, 3.6):
                s = 1.5 + (n % 3) * 0.4
                rocks.append([rnd(px), rnd(pz), rnd((n * 0.7) % 6, 2), rnd(s, 2), rnd(s * 0.7, 2), rnd(s * 0.85, 2), 0])
            n += 1
            z += 8
        x += 8

    cacti = []
    for i, k in enumerate(range(mi - 3, mi + 1)):
        p = trail[k]
        nx, nz, yaw = normals(trail)[k]
        side = -1 if i % 2 == 0 else 1
        cacti.append([rnd(p[0] + nx * side * 3.4), rnd(p[1] + nz * side * 3.4), rnd(yaw, 2), rnd(1.25 + (i % 3) * 0.2, 2)])
    for i, p in enumerate(trail[4:-2:3]):
        if len(cacti) >= 12:
            break
        side = -1 if i % 2 == 0 else 1
        nx, nz, yaw = normals(trail)[trail.index(p)]
        cacti.append([rnd(p[0] + nx * side * (4.4 + (i % 3))), rnd(p[1] + nz * side * (4.4 + (i % 3))), rnd(yaw, 2), rnd(0.9 + (i % 3) * 0.15, 2)])

    walls = []
    def add_wall(pts, side, step, off):
        samples = resample(pts, step)
        norms = normals(samples)
        for p, (nx, nz, yaw) in zip(samples, norms):
            sy = 0.75 + ((int(abs(p[0] + p[1])) // 3) % 5) * 0.08
            walls.append([rnd(p[0] + nx * side * off), rnd(p[1] + nz * side * off), rnd(yaw, 2), rnd(sy, 2)])

    # South frontage: the dirt road and the dry-stone wall in the Ayo photo.
    front = []
    zf = south[1] - 6
    x0 = min(p[0] for p in ayo) + 8
    x1 = max(p[0] for p in ayo) - 6
    for i in range(16):
        t = i / 15
        front.append((x0 + (x1 - x0) * t, zf + math.sin(t * math.pi) * 3))
    add_wall(front, 1, 4.5, 3.4)
    # A short run beside the trail, the wall in the Ayo ground photo.
    add_wall(trail[max(0, mi - 8):mi + 3], -1, 4.5, 3.6)

    roads = load_roads()
    named = [r for r in roads if r["name"] in ("Noordkust Road", "Altovista Trail") and r["len"] > 400]
    extra = [r for r in roads if r not in named and r["len"] > 500 and r["hw"] in ("track", "unclassified", "path")]
    extra.sort(key=lambda r: -r["len"])
    for r in named:
        add_wall(r["pts"], 1, 4.5, 5.0)
        add_wall(r["pts"], -1, 4.5, 5.0)
    for r in extra[:2]:
        if len(walls) > 640:
            break
        add_wall(r["pts"], 1, 9.0, 4.6)
        add_wall(r["pts"], -1, 9.0, 4.6)
    walls = walls[:720]

    noord = next(r for r in named if r["name"] == "Noordkust Road")
    samples = resample(noord["pts"], 6)
    # A fairly straight inland stretch for the road shot.
    ribbon = samples[40:68] if len(samples) > 70 else samples[:24]
    dirt = [ribbon]

    if dist(MILL, BREWERY) < 1500:
        raise SystemExit("mill collapsed onto the brewery")

    data = {
        "anchors": [[rnd(c[0]), rnd(c[1])], [rnd(MILL[0]), rnd(MILL[1])], [rnd(ribbon[0][0]), rnd(ribbon[0][1])], [rnd(front[8][0]), rnd(front[8][1])]],
        "ayo": [[rnd(p[0]), rnd(p[1])] for p in ayo],
        "trail": [[rnd(p[0]), rnd(p[1])] for p in trail],
        "rocks": rocks,
        "cacti": cacti,
        "mill": [rnd(MILL[0]), rnd(MILL[1])],
        "walls": walls,
        "dirt": [[[rnd(p[0]), rnd(p[1])] for p in line] for line in dirt],
        "view": {
            "ayo": [rnd(trail[max(0, mi - 5)][0]), rnd(trail[max(0, mi - 5)][1]), rnd(mound[0]), rnd(mound[1])],
            "road": [rnd(ribbon[2][0]), rnd(ribbon[2][1]), rnd(ribbon[14][0]), rnd(ribbon[14][1])],
            "mill": [rnd(MILL[0] + 4), rnd(MILL[1] + 22), rnd(MILL[0] + 2), rnd(MILL[1] - 2)],
            "wind": [8420, 4300, 8565, 4620],
        },
    }
    OUT.write_text(json.dumps(data, separators=(",", ":")))
    print("rocks", len(rocks), "cacti", len(cacti), "walls", len(walls), "trail", len(trail), "ayo", c, "front", front[8], "ribbon", ribbon[2])


if __name__ == "__main__":
    main()
