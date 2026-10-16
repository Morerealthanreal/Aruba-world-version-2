#!/usr/bin/env python3
"""Bake Andicuri and Daimari parking aprons, and Bushiribana road-edge rocks.

Road centerlines come from the shipped region JSON. Photos are not read here.
"""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REAL = ROOT / "game" / "data" / "real"
OUT = REAL / "north_shore.json"

# Sea lies to the north of Bushiribana, and off the windward points below.
SEA = {
    "bushi": (-700.0, -4100.0),
    "bridge": (1400.0, -2100.0),
    "daimari": (3400.0, -900.0),
}


def rnd(v, n=1):
    return round(float(v), n)


def dist(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


def length(pts):
    return sum(math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(pts, pts[1:]))


def resample(pts, step):
    if len(pts) < 2:
        return list(pts)
    out = [pts[0]]
    acc = 0.0
    ax, az = pts[0]
    for bx, bz in pts[1:]:
        seg = math.hypot(bx - ax, bz - az)
        if seg < 1e-4:
            continue
        while acc + seg >= step:
            t = (step - acc) / seg
            ax, az = ax + (bx - ax) * t, az + (bz - az) * t
            out.append((ax, az))
            seg = math.hypot(bx - ax, bz - az)
            acc = 0.0
        acc += seg
        ax, az = bx, bz
    if dist(out[-1], pts[-1]) > step * 0.45:
        out.append(pts[-1])
    return out


def frame(p, samples, sea):
    """Yaw along the road, and the normal that points toward the sea."""
    i = samples.index(p) if p in samples else 0
    if i == 0:
        dx, dz = samples[1][0] - p[0], samples[1][1] - p[1]
    elif i == len(samples) - 1:
        dx, dz = p[0] - samples[i - 1][0], p[1] - samples[i - 1][1]
    else:
        dx, dz = samples[i + 1][0] - samples[i - 1][0], samples[i + 1][1] - samples[i - 1][1]
    L = math.hypot(dx, dz) or 1
    dx, dz = dx / L, dz / L
    nx, nz = -dz, dx
    sx, sz = sea
    if (sx - p[0]) * nx + (sz - p[1]) * nz < 0:
        nx, nz = -nx, -nz
    # Three.js yaw maps local +X to (cos θ, -sin θ), so θ = -atan2(dz, dx) lays the pad along the road.
    return -math.atan2(dz, dx), nx, nz


def roads():
    found = []
    for path in REAL.glob("r_*.json"):
        blob = json.loads(path.read_text())
        for r in blob.get("roads") or []:
            pts = [(p[0], p[1]) for p in r.get("p") or []]
            if len(pts) < 2:
                continue
            found.append((path.name, r.get("id"), pts))
    return found


def pick(all_roads, name, rid):
    for fn, i, pts in all_roads:
        if fn == name and i == rid:
            return pts
    raise SystemExit(f"missing {name} {rid}")


def add_along(pads, rocks, pts, sea, step, off, pad_w, pad_d, rock_every, limit, scale=1.0):
    samples = resample(pts, step)
    n = 0
    for i, p in enumerate(samples):
        if n >= limit:
            return
        yaw, nx, nz = frame(p, samples, sea)
        px = p[0] + nx * off
        pz = p[1] + nz * off
        pads.append([rnd(px), rnd(pz), rnd(yaw, 2), rnd(pad_w, 1), rnd(pad_d, 1)])
        if rock_every and i % rock_every == 0:
            s = scale * (0.75 + ((int(abs(px + pz)) // 3) % 5) * 0.18)
            rx = px + nx * (pad_w * 0.55)
            rz = pz + nz * (pad_w * 0.55)
            rocks.append([rnd(rx), rnd(rz), rnd(yaw + 0.4, 2), rnd(s, 2)])
        n += 1


def main():
    all_roads = roads()
    pads, rocks = [], []

    # Natural Bridge / Andicuri access: pale dirt under the existing lot.
    bridge = pick(all_roads, "r_12_9.json", 459) + pick(all_roads, "r_11_9.json", 459)[:3]
    add_along(pads, rocks, bridge[:5], SEA["bridge"], 8.0, 3.2, 14.0, 9.0, 2, 6, 0.85)

    # Daimari parking is the flat bench at the end of the track, not slabs on the steep hill.
    beach = pick(all_roads, "r_14_10.json", 1558)
    add_along(pads, rocks, beach[-3:], SEA["daimari"], 12.0, 1.2, 16.0, 11.0, 0, 2, 0.7)

    # Bushiribana: the dirt apron is the road that passes the ruins, plus a short west approach.
    ruins = pick(all_roads, "r_10_8.json", 3827)
    tail = pick(all_roads, "r_9_7.json", 3827)[-4:]
    add_along(pads, rocks, ruins + tail, SEA["bushi"], 11.0, 0.0, 16.0, 12.0, 1, 24, 1.05)

    # Limestone on the packed dirt in front of the mill, kept small so it reads as stones.
    for x, z, s in (
        (-700, -3688, 1.15), (-688, -3680, 0.85), (-676, -3692, 1.05),
        (-664, -3678, 0.75), (-656, -3696, 1.2), (-710, -3700, 0.9),
        (-672, -3704, 0.8), (-694, -3696, 1.0), (-648, -3686, 0.7),
        (-682, -3674, 0.95), (-718, -3684, 1.1), (-660, -3684, 0.85),
    ):
        rocks.append([rnd(x), rnd(z), rnd((abs(x) * 0.01) % 2.5, 2), rnd(s, 2)])

    # Wet-rock lip. The waterline here is near z=-3890; the placer drops the submerged ones.
    for i, x in enumerate(range(-1080, -300, 18)):
        z = -3886 + ((i * 5) % 11) - 5
        rocks.append([rnd(x), rnd(z), rnd((i * 0.6) % 3, 2), rnd(1.15 + (i % 5) * 0.32, 2)])

    data = {
        "anchors": [[1248.0, -2330.0], [-680.0, -3720.0], [-700.0, -3850.0], [3050.0, -1340.0], [3210.0, -1220.0]],
        "pads": pads,
        "rocks": rocks,
        "view": {
            "bridge": [1228.0, -2362.0, 1268.0, -2308.0],
            "bushi": [-660.0, -3672.0, -730.0, -3720.0],
            "surf": [-640.0, -3870.0, -1020.0, -3915.0],
            "daimari": [3148.0, -1288.0, 3245.0, -1165.0],
        },
    }
    OUT.write_text(json.dumps(data, separators=(",", ":")))
    print("pads", len(pads), "rocks", len(rocks))


if __name__ == "__main__":
    main()
