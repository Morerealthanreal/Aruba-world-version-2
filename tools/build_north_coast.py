#!/usr/bin/env python3
"""Bake north-coast landmark positions for the runtime addon.

OSM is the layout authority. Coordinates are Aruba World metres
(x east, z south). The script does not download imagery.
"""
import json
import math
import xml.etree.ElementTree as ET
from pathlib import Path

LAT0, LON0 = 12.52, -69.97
MX = 111320 * math.cos(math.radians(LAT0))
MZ = 110540
# Hooiberg peak (node 4253910397). Stay well clear of it.
HOOI = (-2709.2, 327.2)
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "game" / "data" / "real" / "north_coast.json"


def xz(lat, lon):
    return ((lon - LON0) * MX, (LAT0 - lat) * MZ)


def rnd(v, n=1):
    return round(float(v), n)


def pip(ring, x, z):
    c = False
    j = len(ring) - 1
    for i in range(len(ring)):
        yi, yj = ring[i][1], ring[j][1]
        if (yi > z) != (yj > z) and x < (ring[j][0] - ring[i][0]) * (z - yi) / (yj - yi) + ring[i][0]:
            c = not c
        j = i
    return c


def centroid(ring):
    pts = ring[:-1] if len(ring) > 1 and ring[0] == ring[-1] else ring
    return (sum(p[0] for p in pts) / len(pts), sum(p[1] for p in pts) / len(pts))


def allowed(x, z, lat, lon):
    if lon < -70.025 or lon > -69.954 or lat < 12.530:
        return False
    if math.hypot(x - HOOI[0], z - HOOI[1]) < 800:
        return False
    # Lighthouse / Arashi sit far west of this clip.
    if x < -6400:
        return False
    return True


def load_way(path, way_id):
    root = ET.parse(path).getroot()
    nodes = {n.get("id"): (float(n.get("lat")), float(n.get("lon"))) for n in root.findall("node")}
    for w in root.findall("way"):
        if w.get("id") != str(way_id):
            continue
        pts = []
        for nd in w.findall("nd"):
            lat, lon = nodes[nd.get("ref")]
            pts.append((xz(lat, lon), lat, lon))
        return pts
    raise SystemExit(f"missing way {way_id} in {path}")


def resample(pts, step=14.0):
    if len(pts) < 2:
        return pts
    out = [pts[0]]
    acc = 0.0
    for i in range(1, len(pts)):
        ax, az = pts[i - 1]
        bx, bz = pts[i]
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
    if math.hypot(out[-1][0] - pts[-1][0], out[-1][1] - pts[-1][1]) > 3:
        out.append(pts[-1])
    return out


def clip_lines(raw):
    """raw: list of (x, z, lat, lon). Split where a point is outside the coast band."""
    lines = []
    cur = []
    for x, z, lat, lon in raw:
        if allowed(x, z, lat, lon):
            cur.append((x, z))
        elif cur:
            lines.append(cur)
            cur = []
    if cur:
        lines.append(cur)
    kept = []
    for line in lines:
        line = resample(line, 14)
        if len(line) >= 2 and sum(math.hypot(line[i][0] - line[i - 1][0], line[i][1] - line[i - 1][1]) for i in range(1, len(line))) >= 28:
            kept.append(line)
    return kept


def dist(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


def lips_from(cliff, collapse):
    if not cliff:
        return []
    idx = min(range(len(cliff)), key=lambda i: dist(cliff[i], collapse))
    if dist(cliff[idx], collapse) > 55:
        return []
    chains = []
    for span in (range(max(0, idx - 7), idx), range(idx + 1, min(len(cliff), idx + 8))):
        pts = [cliff[i] for i in span if dist(cliff[i], collapse) > 7]
        if len(pts) >= 2:
            chains.append(pts)
    return chains


def main():
    chapel_raw = load_way("/tmp/nc/chapel_area.xml", 93476341)
    ruin_raw = load_way("/tmp/nc/ruins.xml", 79210010)
    ayo_raw = load_way("/tmp/nc/ayo.xml", 43109643)
    cliff_a = [p[0] for p in load_way("/tmp/nc/bridge.xml", 1057963468)]
    cliff_b = [p[0] for p in load_way("/tmp/nc/bridge.xml", 1057963469)]
    chapel = [p[0] for p in chapel_raw]
    ruin = [p[0] for p in ruin_raw]
    ayo = [p[0] for p in ayo_raw]
    cc = centroid(chapel)
    rc = centroid(ruin)
    collapse = xz(12.5407503, -69.9581188)
    baby = xz(12.5410949, -69.9580742)
    ac = centroid(ayo)

    roads = []
    blob = json.loads(Path("/tmp/nc/roads.json").read_text())
    for el in blob["elements"]:
        geom = el.get("geometry") or []
        raw = []
        for g in geom:
            x, z = xz(g["lat"], g["lon"])
            raw.append((x, z, g["lat"], g["lon"]))
        roads.extend(clip_lines(raw))

    lips = lips_from(cliff_a, collapse) + lips_from(cliff_b, collapse)

    # Ayo boulders: a loose field inside the mapped park, a few of them stacked.
    rocks = []
    minx = min(p[0] for p in ayo)
    maxx = max(p[0] for p in ayo)
    minz = min(p[1] for p in ayo)
    maxz = max(p[1] for p in ayo)
    step = 22.0
    n = 0
    x = minx
    while x < maxx and len(rocks) < 26:
        z = minz
        col = 0
        while z < maxz and len(rocks) < 26:
            jx = ((n * 17) % 11) - 5
            jz = ((n * 29) % 11) - 5
            px, pz = x + jx, z + jz
            if pip(ayo, px, pz):
                big = (n % 5) == 0
                sx = 2.4 + (n % 4) * 0.55 + (1.6 if big else 0)
                sy = sx * (0.72 if n % 2 == 0 else 0.9)
                sz = sx * (0.85 + (n % 3) * 0.08)
                yaw = (n * 0.7) % 6.2
                rocks.append([rnd(px), rnd(pz), rnd(sx, 2), rnd(sy, 2), rnd(sz, 2), rnd(yaw, 2), 0])
                if big and len(rocks) < 26:
                    rocks.append([rnd(px + 0.4), rnd(pz - 0.3), rnd(sx * 0.62, 2), rnd(sy * 0.55, 2), rnd(sz * 0.62, 2), rnd(yaw + 0.8, 2), rnd(sy * 1.15, 2)])
            n += 1
            col += 1
            z += step
        x += step

    cacti = []
    for i in range(6):
        a = -0.4 + i * 0.95
        rad = 12.5 + (i % 3)
        cacti.append([rnd(cc[0] + math.sin(a) * rad), rnd(cc[1] + math.cos(a) * 4.5 - 8), rnd(i * 0.9, 2), rnd(0.85 + (i % 3) * 0.2, 2)])
    for i, rock in enumerate(rocks[::3]):
        if len(cacti) >= 14:
            break
        cacti.append([rnd(rock[0] + 3.5), rnd(rock[1] + 2.2), rnd(i * 0.5, 2), rnd(1.1 + (i % 3) * 0.25, 2)])

    # Sparse cairns on the dirt tracks, off the centre line.
    samples = []
    for line in roads:
        walked = 0.0
        for i in range(1, len(line)):
            seg = dist(line[i], line[i - 1])
            walked += seg
            if walked < 200:
                continue
            walked = 0.0
            ax, az = line[i - 1]
            bx, bz = line[i]
            L = seg or 1
            ox, oz = -(bz - az) / L * 3.1, (bx - ax) / L * 3.1
            px, pz = bx + ox, bz + oz
            if dist((px, pz), cc) < 28 or dist((px, pz), rc) < 22 or dist((px, pz), collapse) < 18:
                continue
            samples.append((px, pz, math.atan2(bx - ax, bz - az)))
    if len(samples) > 18:
        stride = len(samples) / 18
        samples = [samples[min(len(samples) - 1, int(i * stride))] for i in range(18)]
    cairns = [[rnd(p[0]), rnd(p[1]), rnd(p[2], 2), rnd(0.75 + (i % 4) * 0.12, 2)] for i, p in enumerate(samples)]

    # White crosses on the chapel approach, not in the yard.
    near = []
    for line in roads:
        for p in line:
            d = dist(p, cc)
            if 22 < d < 150:
                near.append((d, p))
    near.sort()
    crosses = []
    last = -999
    for d, p in near:
        if d - last < 16 or len(crosses) >= 8:
            continue
        last = d
        crosses.append([rnd(p[0] + 2.4), rnd(p[1]), rnd(0.2 * len(crosses), 2)])

    anchors = [cc, rc, collapse, baby, ac]
    for line in roads:
        walked = 0.0
        anchors.append(line[0])
        for i in range(1, len(line)):
            walked += dist(line[i], line[i - 1])
            if walked >= 650:
                anchors.append(line[i])
                walked = 0.0

    def ring(pts):
        return [[rnd(p[0]), rnd(p[1])] for p in pts]

    data = {
        "anchors": ring(anchors),
        "chapel": {"c": [rnd(cc[0]), rnd(cc[1])], "ring": ring(chapel)},
        "ruin": {"ring": ring(ruin)},
        "collapse": [rnd(collapse[0]), rnd(collapse[1])],
        "baby": [rnd(baby[0]), rnd(baby[1])],
        "lips": [ring(c) for c in lips],
        "ayo": ring(ayo),
        "rocks": rocks[:28],
        "cairns": cairns[:18],
        "crosses": crosses[:8],
        "cacti": cacti[:16],
        "roads": [ring(r) for r in roads],
    }
    OUT.write_text(json.dumps(data, separators=(",", ":")))
    road_m = 0.0
    quads = 0
    for line in roads:
        for i in range(1, len(line)):
            road_m += dist(line[i], line[i - 1])
            quads += 1
    print(f"wrote {OUT} bytes={OUT.stat().st_size}")
    print(f"chapel {data['chapel']['c']} ruin {centroid(ruin)} collapse {data['collapse']} baby {data['baby']} ayo {ac}")
    print(f"roads {len(roads)} quads {quads} metres {road_m:.0f} lips {len(lips)} rocks {len(data['rocks'])} cairns {len(cairns)} crosses {len(crosses)} cacti {len(data['cacti'])} anchors {len(anchors)}")
    print("hooiberg clearance", min(math.hypot(a[0] - HOOI[0], a[1] - HOOI[1]) for a in anchors))


if __name__ == "__main__":
    main()
