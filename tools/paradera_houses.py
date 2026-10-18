#!/usr/bin/env python3
"""Five Paradera houses, each matched to the roof on its own lot.

Aerial of the lots (Esri, visual guide only): a is a low tan roof in a dirt
yard, b and c are red tile (hip and gable, so the two red roofs are not the
same shape), d is a light flat roof, e is a pale flat roof on grey walls.
No photo textures. Does not move the church or the earlier cunucu houses.
"""
import json
import math
from pathlib import Path

import accuracy_batch3 as B

ROOT = Path(__file__).resolve().parents[1]
REAL = ROOT / "game" / "data" / "real"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"

X0, Z0, RS, PX = -10800.0, -11800.0, 1000.0, 4.0

# Lots already used by the inland-waterfront houses, so a later merge does not stack.
TAKEN = [(-3381.0, -1902.0), (-3091.0, -1887.0), (-1714.7, 990.4), (-1599.8, 1016.6)]

IDS = ["para_house_a", "para_house_b", "para_house_c", "para_house_d", "para_house_e"]
# kind, wall, roof, porch, wall height, roof rise
STYLES = {
    "para_house_a": ("hip", (0.84, 0.76, 0.62), (0.55, 0.42, 0.30), True, 2.7, 0.9),
    "para_house_b": ("hip", (0.94, 0.92, 0.86), (0.66, 0.24, 0.14), True, 3.15, 1.55),
    "para_house_c": ("gable", (0.95, 0.94, 0.90), (0.72, 0.22, 0.12), True, 3.2, 1.85),
    "para_house_d": ("flat", (0.92, 0.92, 0.90), (0.78, 0.79, 0.78), False, 3.0, 0.22),
    "para_house_e": ("flat", (0.70, 0.70, 0.68), (0.90, 0.90, 0.88), False, 2.75, 0.18),
}


def sample_h(x, z):
    from PIL import Image
    rx, rz = math.floor((x - X0) / RS), math.floor((z - Z0) / RS)
    im = Image.open(REAL / f"h_{rx}_{rz}.png").convert("RGB")
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


def gable_road(mesh, x0, x1, z0, z1, ye, yp):
    """Ridge runs toward the road so the gable triangle faces the street."""
    xm = (x0 + x1) / 2
    r0, r1 = (xm, yp, z0), (xm, yp, z1)
    mesh.tri((x0, ye, z1), (x1, ye, z1), r1)
    mesh.tri((x1, ye, z0), (x0, ye, z0), r0)
    mesh.quad((x0, ye, z0), r0, r1, (x0, ye, z1))
    mesh.quad((x1, ye, z1), r1, r0, (x1, ye, z0))


def build_one(id_, ring, roads):
    kind, wall_c, roof_c, porch, wall_h, rise = STYLES[id_]
    ox, oz = B.cent(ring)
    road = B.closest_on(roads, ox, oz, "Paradera")
    xx, xz, zx, zz = B.frame_toward(ox, oz, road)
    locs = [B.to_local(x, z, ox, oz, xx, xz, zx, zz) for x, z in ring]
    x0, x1 = min(p[0] for p in locs) + 0.12, max(p[0] for p in locs) - 0.12
    z0, z1 = min(p[1] for p in locs) + 0.12, max(p[1] for p in locs) - 0.12
    M = B.Model(id_)
    wall = M.material("wall", wall_c, 0.84)
    roof = M.material("roof", roof_c, 0.62)
    trim = M.material("trim", (0.94, 0.93, 0.88), 0.7)
    glass = M.material("glass", B.GLASS, 0.3)
    door = M.material("door", (0.28, 0.16, 0.10), 0.8)
    eave = wall_h
    peak = wall_h + rise
    front = z1 - (1.15 if porch else 0.0)
    for lod in (0, 1):
        W = B.XF(M.mesh(lod, wall), xx, xz, zx, zz)
        R = B.XF(M.mesh(lod, roof), xx, xz, zx, zz)
        T = B.XF(M.mesh(lod, trim), xx, xz, zx, zz)
        B.prism(W, x0, x1, z0, front, 0.08, wall_h)
        if kind == "hip":
            B.hip_local(R, x0 - 0.3, x1 + 0.3, z0 - 0.25, z1 + 0.35, eave, peak)
        elif kind == "gable":
            gable_road(R, x0 - 0.25, x1 + 0.25, z0 - 0.2, z1 + 0.3, eave, peak)
        else:
            B.prism(R, x0 - 0.2, x1 + 0.2, z0 - 0.15, z1 + 0.2, eave, eave + rise)
        if porch and lod == 0:
            B.prism(T, x0, x1, front, z1, eave - 0.15, eave)
            for px in (x0 + 0.15, x1 - 0.15):
                B.prism(T, px - 0.1, px + 0.1, z1 - 0.15, z1, 0.05, eave)
        if lod == 1:
            continue
        G = B.XF(M.mesh(lod, glass), xx, xz, zx, zz)
        D = B.XF(M.mesh(lod, door), xx, xz, zx, zz)
        D.quad(
            (-0.45, 0.1, front + 0.04), (0.45, 0.1, front + 0.04),
            (0.45, 2.05, front + 0.04), (-0.45, 2.05, front + 0.04),
        )
        span = x1 - x0
        for frac in ((0.28, 0.72) if kind != "flat" else (0.5,)):
            wx = x0 + span * frac
            G.quad(
                (wx - 0.35, 1.15, front + 0.05), (wx + 0.35, 1.15, front + 0.05),
                (wx + 0.35, 2.0, front + 0.05), (wx - 0.35, 2.0, front + 0.05),
            )
    info = B.write_glb(M, B.HERO / f"{id_}.glb")
    B.check_glb(B.HERO / f"{id_}.glb")
    print(id_, kind, round(ox, 1), round(oz, 1), info)
    return info, ox, oz, ring


def lots_unused(roads, heroes):
    found = []
    for path in sorted(REAL.glob("r_*.json")):
        data = json.loads(path.read_text())
        for b in data.get("b") or []:
            if b.get("k") != "house":
                continue
            ring = b.get("p") or []
            if not (4 <= len(ring) <= 6):
                continue
            xs = [p[0] for p in ring]
            zs = [p[1] for p in ring]
            if not (-4600 < sum(xs) / len(xs) < -2800 and -2600 < sum(zs) / len(zs) < -700):
                continue
            w, dep = max(xs) - min(xs), max(zs) - min(zs)
            if not (8 <= w <= 16 and 7 <= dep <= 16):
                continue
            cx, cz = sum(xs) / len(xs), sum(zs) / len(zs)
            road = B.closest_on(roads, cx, cz, "Paradera")
            if math.hypot(road[0] - cx, road[1] - cz) > 22:
                continue
            if any(math.hypot(cx - x, cz - z) < 28 for x, z, _id in heroes):
                continue
            if any(math.hypot(cx - x, cz - z) < 36 for x, z in TAKEN):
                continue
            found.append((cx, cz, ring))
    found.sort(key=lambda t: (t[0], t[1]))
    picked = []
    for cx, cz, ring in found:
        if any(math.hypot(cx - x, cz - z) < 55 for x, z, _r in picked):
            continue
        picked.append((cx, cz, ring))
        if len(picked) == 5:
            break
    if len(picked) < 5:
        raise SystemExit(f"only {len(picked)} free Paradera lots")
    return picked


def upsert(entries):
    data = json.loads(MANIFEST.read_text())
    by_id = {e["id"]: e for e in entries}
    out, seen = [], set()
    for item in data:
        if item.get("id") in by_id:
            out.append(by_id[item["id"]])
            seen.add(item["id"])
        else:
            out.append(item)
    missing = [i for i in IDS if i not in seen]
    if missing:
        raise SystemExit(f"missing existing entries {missing}")
    old = [i.get("id") for i in data]
    new = [i.get("id") for i in out]
    if old != new:
        raise SystemExit("manifest id order changed")
    MANIFEST.write_text(json.dumps(out, indent=1) + "\n")


def main():
    roads, _buildings = B.load_regions()
    data = json.loads(MANIFEST.read_text())
    by_id = {e["id"]: e for e in data}
    ref = (
        "Each house follows the roof on its own lot in the Esri aerial: "
        "a low tan hip in a dirt yard, a red hip, a red gable, a light flat roof, "
        "and a pale flat roof on grey walls. Same OSM footprints. Not a photo texture."
    )
    entries = []
    for id_ in IDS:
        prev = by_id[id_]
        ring = prev["hide_footprint"]
        info, hx, hz, hide = build_one(id_, ring, roads)
        h = sample_h(hx, hz)
        if abs(h) < 0.05:
            raise SystemExit(f"refusing a zero pin at {id_}")
        entry = dict(prev)
        entry["y"] = round(h, 2)
        entry["tris"] = {f"{id_}_lod0": info["lod0"], f"{id_}_lod1": info["lod1"]}
        entry["status"] = "accuracy-paradera"
        entry["ref_sources"] = ref
        entries.append(entry)
        print(id_, "pinned", round(h, 2))
    upsert(entries)
    print("manifest ok")


if __name__ == "__main__":
    main()
