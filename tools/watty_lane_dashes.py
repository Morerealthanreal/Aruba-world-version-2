#!/usr/bin/env python3
"""Lane dashes on the airport end of Watty Vos.

That carriageway is class 4 and one-way, so the asphalt shader draws the edge
lines and skips the broken centre line. A 7.6 m one-way road is two lanes; the
missing mark is the white dash between them.

Owned stretch only: about -5600 < x < -4000 and -300 < z < 2000.
Does not edit the asphalt shader, and does not touch Noord or the hotel strip.
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

# Airport-end Watty Vos. Noord Sasakiweg and the hotel strip are outside this box.
X0, X1 = -5600.0, -4000.0
Z0, Z1 = -300.0, 2000.0
DASH = 3.2
GAP = 9.0
WHITE = (0.93, 0.93, 0.90)


def owned(x, z):
    return X0 < x < X1 and Z0 < z < Z1


def length_of(pts):
    return sum(math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) for i in range(len(pts) - 1))


def pick_road():
    best = None
    for p in sorted(REAL.glob("r_*.json")):
        d = json.loads(p.read_text())
        for r in d.get("roads") or []:
            if "Watty" not in (r.get("n") or ""):
                continue
            if (r.get("w") or 0) < 7 or r.get("ow") != 1:
                continue
            pts = r.get("p") or []
            if len(pts) < 2 or not all(owned(x, z) for x, z in pts):
                continue
            L = length_of(pts)
            if best is None or L > best[0]:
                best = (L, pts, r.get("n"), r.get("w"))
    if best is None or best[0] < 200:
        raise SystemExit(f"no owned Watty Vos carriageway ({best})")
    return best


def resample(pts, step):
    out = [pts[0]]
    acc = 0.0
    for i in range(len(pts) - 1):
        x0, z0 = pts[i]
        x1, z1 = pts[i + 1]
        seg = math.hypot(x1 - x0, z1 - z0)
        if seg < 1e-6:
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
    return out


def oriented_box(mesh, cx, cy, cz, tx, tz, length, width, height):
    """Thin box. +X along the road, +Z to the left, faces wound outward."""
    nx, nz = -tz, tx
    hx, hy, hz = length / 2, height / 2, width / 2

    def w(lx, ly, lz):
        return (cx + lx * tx + lz * nx, cy + ly, cz + lx * tz + lz * nz)

    lbf, rbf = w(-hx, -hy, -hz), w(hx, -hy, -hz)
    ltf, rtf = w(-hx, hy, -hz), w(hx, hy, -hz)
    lbb, rbb = w(-hx, -hy, hz), w(hx, -hy, hz)
    ltb, rtb = w(-hx, hy, hz), w(hx, hy, hz)
    mesh.quad(rbf, rbb, rtb, rtf)
    mesh.quad(lbb, lbf, ltf, ltb)
    mesh.quad(ltf, rtf, rtb, ltb)
    mesh.quad(lbf, lbb, rbb, rbf)
    mesh.quad(lbb, ltb, rtb, rbb)
    mesh.quad(lbf, rbf, rtf, ltf)


def build():
    L, pts, name, width = pick_road()
    stations = resample(pts, GAP)
    # Drop the ends so a dash does not run into the junction.
    stations = [p for i, p in enumerate(stations) if 8 < i * GAP < L - 8]
    if len(stations) < 8:
        raise SystemExit("too few dashes")
    ox = sum(p[0] for p in stations) / len(stations)
    oz = sum(p[1] for p in stations) / len(stations)
    cache = {}
    oy = sample_h(ox, oz, cache)
    M = Model(ID)
    paint = M.material("paint", WHITE, 0.45)
    tangents = []
    for i, (x, z) in enumerate(stations):
        k = i + 1 if i + 1 < len(stations) else i - 1
        tx, tz = stations[k][0] - x, stations[k][1] - z
        mag = math.hypot(tx, tz) or 1
        tangents.append((tx / mag, tz / mag))
    for lod in (0, 1):
        mesh = M.mesh(lod, paint)
        step = 1 if lod == 0 else 3
        for i in range(0, len(stations), step):
            x, z = stations[i]
            tx, tz = tangents[i]
            h = sample_h(x, z, cache)
            # Road surface is about 9 cm above the terrain. Sit the paint on it.
            cy = (h - oy) + 0.18
            oriented_box(mesh, x - ox, cy, z - oz, tx, tz, DASH, 0.15, 0.06)
    info = write_glb(M, HERO / f"{ID}.glb")
    check_glb(HERO / f"{ID}.glb")
    print(ID, name, "length", round(L, 1), "dashes", len(stations), "at", round(ox, 2), round(oz, 2), "y", round(oy, 2), "w", width, info)
    return info, ox, oz, oy, name, L, len(stations)


def append(info, ox, oz, oy, name, road_len, ndash):
    text = MANIFEST.read_text()
    if f'"id": "{ID}"' in text:
        raise SystemExit("already present")
    y = round(oy, 2) or 0.05
    entry = {
        "id": ID, "k": ID, "name": "", "status": "accuracy-highway",
        "x": round(ox, 2), "z": round(oz, 2), "y": y, "rotation": 0,
        "glb": f"models/hero/{ID}.glb",
        "lod": {"hi": f"{ID}_lod0", "lo": f"{ID}_lod1", "switch_m": 120},
        "tris": {f"{ID}_lod0": info["lod0"], f"{ID}_lod1": info["lod1"]},
        "textures": 0,
        "hide_footprint": None,
        "hide": [],
        "sign": False,
        "kind": "replace",
        "new_place": False,
        "geo_source": f"Centreline of the owned {name} carriageway ({round(road_len)} m, {ndash} dashes)",
        "ref_sources": (
            "Airport-end Watty Vos is a one-way class-4 road about 7.6 m wide, two lanes. "
            "The asphalt shader already paints the edge lines and withholds the broken line on one-way roads. "
            "These dashes are the lane line between the two lanes, on the stretch inside "
            "-5600<x<-4000 and -300<z<2000. Noord and the hotel strip are outside that box. "
            "The asphalt shader was not edited."
        ),
        "frame": "glb origin = dash-run centroid (world x,z); glTF +X = world x, +Z = world z, Y up",
        "cat": "road",
    }
    if not text.rstrip().endswith("]"):
        raise SystemExit("manifest ending")
    text = text.rstrip()[:-1].rstrip()
    blob = json.dumps(entry, indent=1)
    blob = "\n".join(" " + ln for ln in blob.split("\n"))
    text = text + ",\n" + blob + "\n]\n"
    json.loads(text)
    MANIFEST.write_text(text)


def main():
    info, ox, oz, oy, name, road_len, ndash = build()
    append(info, ox, oz, oy, name, road_len, ndash)


if __name__ == "__main__":
    main()
