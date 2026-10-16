#!/usr/bin/env python3
"""Positions for the Alto Vista–Bushiribana–Natural Bridge corridor.

OSM footprints (already projected; Overpass is not required):
  chapel way 93476341, Bushiribana ruin way 79210010.
The collapsed bridge and Baby Bridge are the published coastal points.
The Natural Pool (12.5246, -69.9287) and its Arikok approach are not included.
"""
import json
import math
from pathlib import Path

LAT0, LON0 = 12.52, -69.97
MX = 111320 * math.cos(math.radians(LAT0))
MZ = 110540
HOOI = (-2709.2, 327.2)
POOL = ((-69.9287 - LON0) * MX, (LAT0 - 12.5246) * MZ)
ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "game" / "data" / "real" / "coast_sites.json"

CHAPEL_C = (-4447.0, -6188.0)
CHAPEL_RING = [
    [-4451.8, -6191.5], [-4442.1, -6191.4], [-4442.1, -6184.5],
    [-4452.0, -6184.5], [-4451.8, -6191.5],
]
RUIN = [
    [-714.9, -3738.9], [-705.4, -3720.0], [-708.2, -3718.3], [-710.0, -3721.6],
    [-713.8, -3719.4], [-710.9, -3713.4], [-723.3, -3708.2], [-733.2, -3730.2],
    [-714.9, -3738.9],
]
COLLAPSE = (1291.2, -2293.7)
BABY = (1296.0, -2331.8)


def rnd(v, n=1):
    return round(float(v), n)


def dist(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


def pip(ring, x, z):
    c = False
    j = len(ring) - 1
    for i in range(len(ring)):
        yi, yj = ring[i][1], ring[j][1]
        if (yi > z) != (yj > z) and x < (ring[j][0] - ring[i][0]) * (z - yi) / (yj - yi + 1e-9) + ring[i][0]:
            c = not c
        j = i
    return c


def cluster(cx, cz, n, rad, seed):
    out = []
    for i in range(n):
        a = i * 2.399963 + seed
        r = rad * math.sqrt((i + 0.5) / n)
        scale = 0.82 + (i * 3 + seed) % 5 * 0.16
        out.append([rnd(cx + math.cos(a) * r), rnd(cz + math.sin(a) * r), rnd(a, 2), rnd(scale, 2)])
    return out


def main():
    # Pilgrim crosses line the seaward side of the road that leaves the chapel
    # toward the southwest (the existing white-cross monument is further along
    # that road and is left as its own hero).
    aim = (-4718.0 - CHAPEL_C[0], -5913.0 - CHAPEL_C[1])
    al = math.hypot(*aim) or 1
    dx, dz = aim[0] / al, aim[1] / al
    px, pz = -dz, dx
    if pz > 0:
        px, pz = -px, -pz
    scales = [0.78, 1.05, 0.88, 1.32, 0.72, 1.12, 0.94, 1.45, 0.84, 1.18]
    crosses = []
    for i, scale in enumerate(scales):
        d = 34 + i * 15.5
        x = CHAPEL_C[0] + dx * d + px * 4.4
        z = CHAPEL_C[1] + dz * d + pz * 4.4
        crosses.append([rnd(x), rnd(z), rnd(math.atan2(dx, dz), 2), rnd(scale, 2)])

    # Cairn fields: one beside the pilgrim road, one inland of the mill, one
    # on the terrace behind the collapse. None of them is the Natural Pool road.
    road_d = 96
    cairn_road = (
        CHAPEL_C[0] + dx * road_d - px * 6.5,
        CHAPEL_C[1] + dz * road_d - pz * 6.5,
    )
    cairns = []
    cairns += cluster(cairn_road[0], cairn_road[1], 8, 7.5, 0.4)
    cairns += cluster(-698.0, -3686.0, 8, 8.0, 1.7)
    cairns += cluster(1246.0, -2266.0, 8, 8.5, 2.8)

    ruin_c = (
        sum(p[0] for p in RUIN[:-1]) / (len(RUIN) - 1),
        sum(p[1] for p in RUIN[:-1]) / (len(RUIN) - 1),
    )
    for p in cairns:
        if pip(RUIN, p[0], p[1]):
            raise SystemExit(f"cairn inside the ruin {p}")
        if dist(p, CHAPEL_C) < 24:
            raise SystemExit(f"cairn in the chapel yard {p}")

    hide = [
        CHAPEL_RING,
        [[-4472, -6196], [-4454, -6196], [-4454, -6180], [-4472, -6180], [-4472, -6196]],
        RUIN,
        [[1322, -2363], [1338, -2363], [1338, -2347], [1322, -2347], [1322, -2363]],
        [[1308, -2341], [1324, -2341], [1324, -2325], [1308, -2325], [1308, -2341]],
    ]
    anchors = [CHAPEL_C, ruin_c, COLLAPSE, BABY, cairn_road, (-698.0, -3686.0), (1246.0, -2266.0)]
    for name, p in [("pool", POOL), ("hooiberg", HOOI)]:
        d = min(dist(a, p) for a in anchors)
        print(f"{name} clearance {d:.0f} m")
        if d < 1500:
            raise SystemExit(f"too close to {name}")
    if any(a[0] < -6400 for a in anchors):
        raise SystemExit("crossed into the lighthouse / Arashi side")

    data = {
        "anchors": [[rnd(p[0]), rnd(p[1])] for p in anchors],
        "chapel": {"c": [rnd(CHAPEL_C[0]), rnd(CHAPEL_C[1])], "ring": CHAPEL_RING},
        "ruin": RUIN,
        "collapse": [rnd(COLLAPSE[0]), rnd(COLLAPSE[1])],
        "baby": [rnd(BABY[0]), rnd(BABY[1])],
        "crosses": crosses,
        "cairns": cairns,
        "hide": hide,
    }
    OUT.write_text(json.dumps(data, separators=(",", ":")))
    print(f"wrote {OUT} bytes={OUT.stat().st_size} crosses={len(crosses)} cairns={len(cairns)}")


if __name__ == "__main__":
    main()
