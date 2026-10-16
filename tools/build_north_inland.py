#!/usr/bin/env python3
"""Bake Casibari walls, kunuku fences, and the Hooiberg north slope.

Roads come from the shipped region JSON. Ground photos are not read here.
"""
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REAL = ROOT / "game" / "data" / "real"
OUT = REAL / "north_inland.json"

# Casibari entrance hero, Hooiberg summit hero, Tanki Flip.
CASI = (-2827.0, -1197.0)
SUMMIT = (-2709.0, 328.0)
TANKI = (-6572.0, -2878.0)


def rnd(v, n=1):
    return round(float(v), n)


def length(pts):
    return sum(math.hypot(b[0] - a[0], b[1] - a[1]) for a, b in zip(pts, pts[1:]))


def dist(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


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
        out.append((-dz / L, dx / L, math.atan2(dz, dx)))
    return out


def roads():
    found = []
    for path in REAL.glob("r_*.json"):
        blob = json.loads(path.read_text())
        for r in blob.get("roads") or []:
            pts = [(p[0], p[1]) for p in r.get("p") or []]
            if len(pts) < 2:
                continue
            found.append({"id": r.get("id"), "name": r.get("n") or "", "u": r.get("u") or 0, "pts": pts, "len": length(pts)})
    return found


def add_line(rows, pts, side, step, off, cap, scale=1.0, limit=None):
    samples = resample(pts, step)
    added = 0
    budget = limit if limit is not None else cap
    for p, (nx, nz, yaw) in zip(samples, normals(samples)):
        if len(rows) >= cap or added >= budget:
            return
        sy = scale * (0.85 + ((int(abs(p[0] + p[1])) // 3) % 4) * 0.08)
        rows.append([rnd(p[0] + nx * side * off), rnd(p[1] + nz * side * off), rnd(yaw, 2), rnd(sy, 2)])
        added += 1


def main():
    all_roads = roads()
    by_id = {}
    for r in all_roads:
        by_id.setdefault((r["name"], r["id"]), r)

    def pick(name, rid):
        for r in all_roads:
            if r["name"] == name and r["id"] == rid:
                return r
        raise SystemExit(f"missing {name} {rid}")

    walls = []
    # The road past the Casibari boulders. One side, the stone wall in the photo.
    # Side -1 puts the wall between the road and the boulders (the photo).
    add_line(walls, pick("Casibari", 475)["pts"], -1, 3.9, 4.2, 140, limit=72)
    add_line(walls, pick("Casibari", 473)["pts"], -1, 3.9, 4.2, 140, limit=68)

    fences = []
    # Kunuku (yatu cactus) fences. A short step so the row reads as a living hedge.
    add_line(fences, pick("Casibari", 474)["pts"], -1, 1.45, 5.0, 240, 1.0, 40)
    add_line(fences, pick("Casibari", 2110)["pts"], -1, 1.45, 5.0, 240, 1.0, 36)
    add_line(fences, pick("Casibari", 2394)["pts"], -1, 1.45, 5.2, 240, 1.0, 28)
    # Tanki Flip's west dirt edge, then the Noord fringe toward Alto Vista.
    add_line(fences, pick("Hato", 1056)["pts"], 1, 1.5, 5.2, 240, 1.05, 48)
    add_line(fences, pick("Noord", 2565)["pts"], 1, 1.45, 4.8, 240, 1.0, 56)
    add_line(fences, pick("Tanki Flip", 5660)["pts"], -1, 1.5, 5.4, 240, 0.95, 32)

    # The north slope already carries the island scrub and cactus scatter.
    # Extra boxes read as crates, so this band stays empty.
    scrub = []
    # The summit hero already has the two telecom towers. A second pair doubles them.
    antennas = []

    casi_road = pick("Casibari", 475)["pts"]
    noord = pick("Noord", 2565)["pts"]
    data = {
        "anchors": [list(CASI), list(SUMMIT), list(TANKI), [rnd(noord[len(noord) // 2][0]), rnd(noord[len(noord) // 2][1])]],
        "walls": walls,
        "fences": fences,
        "scrub": scrub,
        "antennas": antennas,
        "summit": list(SUMMIT),
        "view": {
            "ayo": [-109.4, -1258.7, -122.0, -1294.0],
            "casibari": [rnd(casi_road[2][0] + 6), rnd(casi_road[2][1]), rnd(casi_road[6][0]), rnd(casi_road[6][1])],
            "hooi": [rnd(SUMMIT[0] + 24), rnd(SUMMIT[1] - 240), rnd(SUMMIT[0]), rnd(SUMMIT[1])],
            "tanki": [rnd(noord[1][0]), rnd(noord[1][1]), rnd(noord[min(8, len(noord) - 1)][0]), rnd(noord[min(8, len(noord) - 1)][1])],
        },
    }
    OUT.write_text(json.dumps(data, separators=(",", ":")))
    print("walls", len(walls), "fences", len(fences), "scrub", len(scrub), "view", data["view"])


if __name__ == "__main__":
    main()
