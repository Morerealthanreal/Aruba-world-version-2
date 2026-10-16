#!/usr/bin/env python3
"""Place Noord and Alto Vista cunucu houses, and bake north-coast dirt routes.

Santa Anna church, its grounds, and the Alto Vista chapel are already heroes
and are not touched. Ground photos are references only; nothing here samples them.
"""
import json
import math
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
REAL = ROOT / "game" / "data" / "real"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
GLB = ROOT / "game" / "models" / "hero"
OUT = REAL / "noord_yards.json"
SRC = GLB / "cunucu_paradera.glb"

# OSM house lots. Centroids are matched, then the real polygon is copied.
# Noord row is Caya Ange Perez, east of Sint Anna Kerk. Alto Vista lots are
# the residential cluster south of the chapel, not the chapel itself.
PICKS = [
    ("cunucu_noord_ange1", "yellow", -6484.6, -4791.4),
    ("cunucu_noord_ange2", "white", -6453.9, -4792.1),
    ("cunucu_noord_ange3", "salmon", -6427.7, -4787.3),
    ("cunucu_noord_ange4", "yellow", -6407.9, -4794.8),
    ("cunucu_alto_1", "yellow", -4863.7, -5898.6),
    ("cunucu_alto_2", "white", -4837.9, -5862.2),
    ("cunucu_alto_3", "salmon", -4873.4, -5851.3),
    ("cunucu_alto_4", "white", -4897.8, -5843.4),
]

GLB_FOR = {
    "yellow": "models/hero/cunucu_paradera.glb",
    "white": "models/hero/cunucu_white.glb",
    "salmon": "models/hero/cunucu_salmon.glb",
}

# House body in the GLB (metres). The yard fence sits outside this.
BODY_POS_X = 6.02
BODY_NEG_X = 5.57
BODY_Z = 3.44
FENCE_FRONT = 7.6


def rnd(v, n=1):
    return round(float(v), n)


def dist(a, b):
    return math.hypot(a[0] - b[0], a[1] - b[1])


def centroid(poly):
    return sum(p[0] for p in poly) / len(poly), sum(p[1] for p in poly) / len(poly)


def length(pts):
    return sum(dist(a, b) for a, b in zip(pts, pts[1:]))


def resample(pts, step):
    if len(pts) < 2:
        return [tuple(pts[0])]
    out = [tuple(pts[0])]
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
    if dist(out[-1], pts[-1]) > step * 0.35:
        out.append(tuple(pts[-1]))
    return out


def load_roads():
    found = []
    for path in sorted(REAL.glob("r_*.json")):
        blob = json.loads(path.read_text())
        for road in blob.get("roads") or []:
            pts = [(p[0], p[1]) for p in road.get("p") or []]
            if len(pts) < 2:
                continue
            found.append({
                "id": road.get("id"),
                "name": road.get("n") or "",
                "u": road.get("u") or 0,
                "pts": pts,
            })
    return found


def load_houses():
    found = []
    for path in REAL.glob("r_*.json"):
        blob = json.loads(path.read_text())
        for b in blob.get("b") or []:
            poly = [(p[0], p[1]) for p in b.get("p") or []]
            if len(poly) < 3:
                continue
            c = centroid(poly)
            found.append((c, poly, b.get("k"), b.get("n") or ""))
    return found


def nearest_road(roads, x, z):
    best = None
    for road in roads:
        pts = road["pts"]
        for i in range(len(pts) - 1):
            ax, az = pts[i]
            bx, bz = pts[i + 1]
            dx, dz = bx - ax, bz - az
            l2 = dx * dx + dz * dz or 1.0
            t = max(0.0, min(1.0, ((x - ax) * dx + (z - az) * dz) / l2))
            px, pz = ax + dx * t, az + dz * t
            d = math.hypot(x - px, z - pz)
            if best is None or d < best[0]:
                best = (d, px - x, pz - z, road["id"], road["name"], road["u"])
    return best


def stitch(segs, gap=90.0):
    segs = [list(s) for s in segs]
    used = [False] * len(segs)
    chain = list(segs[0])
    used[0] = True
    grew = True
    while grew:
        grew = False
        for at_tail in (True, False):
            tip = chain[-1] if at_tail else chain[0]
            best = None
            for i, seg in enumerate(segs):
                if used[i]:
                    continue
                for flip, end in ((False, seg[0]), (True, seg[-1])):
                    d = dist(tip, end)
                    if best is None or d < best[0]:
                        best = (d, i, flip)
            if not best or best[0] > gap:
                continue
            d, i, flip = best
            seg = list(reversed(segs[i])) if flip else list(segs[i])
            if not at_tail:
                seg = list(reversed(seg))
                chain = (seg[:-1] if d < 1.5 else seg) + chain
            else:
                chain.extend(seg[1:] if d < 1.5 else seg)
            used[i] = True
            grew = True
            break
    return chain, sum(1 for u in used if not u)


def route_by_id(roads, road_id):
    segs = [r["pts"] for r in roads if r["id"] == road_id and r["u"] == 1]
    chain, left = stitch(segs)
    print(f"  route {road_id}: segs {len(segs)} unused {left} length {length(chain):.0f}")
    return resample(chain, 10.0)


def lot_scale(poly, cx, cz, yaw, road_d):
    c, s = math.cos(yaw), math.sin(yaw)
    lxs, lzs = [], []
    for x, z in poly:
        wx, wz = x - cx, z - cz
        lxs.append(c * wx - s * wz)
        lzs.append(s * wx + c * wz)
    pos = max(lxs)
    neg = -min(lxs)
    side = min(max(lzs), -min(lzs))
    fit = min(pos / BODY_POS_X, neg / BODY_NEG_X, side / BODY_Z) * 0.96
    road_fit = (road_d - 2.4) / FENCE_FRONT
    scale = min(fit, road_fit, 1.12)
    return rnd(max(0.78, scale), 2)


def front_point(x, z, yaw, dist):
    c, s = math.cos(yaw), math.sin(yaw)
    return rnd(x + dist * c, 1), rnd(z - dist * s, 1)


def along(pts, dist_m):
    if length(pts) < 1:
        return pts[0], (1.0, 0.0)
    walked = 0.0
    for a, b in zip(pts, pts[1:]):
        seg = dist(a, b)
        if walked + seg >= dist_m:
            t = (dist_m - walked) / seg if seg else 0.0
            x = a[0] + (b[0] - a[0]) * t
            z = a[1] + (b[1] - a[1]) * t
            dx, dz = b[0] - a[0], b[1] - a[1]
            n = math.hypot(dx, dz) or 1.0
            return (x, z), (dx / n, dz / n)
        walked += seg
    a, b = pts[-2], pts[-1]
    dx, dz = b[0] - a[0], b[1] - a[1]
    n = math.hypot(dx, dz) or 1.0
    return b, (dx / n, dz / n)


def road_view(pts, dist_m, name):
    (x, z), (dx, dz) = along(pts, dist_m)
    # Stand off the left shoulder, looking ahead along the dirt.
    lx, lz = -dz, dx
    eye = (rnd(x + lx * 9 + dx * -6, 1), rnd(z + lz * 9 + dz * -6, 1))
    look = (rnd(x + dx * 18, 1), rnd(z + dz * 18, 1))
    return {"id": name, "eye": list(eye), "look": list(look), "h": 2.7}


def clone_glb(dst, pairs):
    data = SRC.read_bytes()
    magic, version, glen = struct.unpack_from("<III", data, 0)
    if magic != 0x46546C67 or glen != len(data):
        raise SystemExit("cunucu GLB header is not intact")
    for old, new in pairs:
        ob, nb = old.encode(), new.encode()
        if len(ob) != len(nb):
            raise SystemExit(f"color token length changed: {old} -> {new}")
        if data.count(ob) != 1:
            raise SystemExit(f"color token {old} count {data.count(ob)}")
        data = data.replace(ob, nb, 1)
    dst.write_bytes(data)


def hero_entry(house):
    return {
        "id": house["id"],
        "k": house["id"],
        "name": "",
        "status": "v5-accuracy",
        "x": house["x"],
        "z": house["z"],
        "y": 0,
        "rotation": house["yaw"],
        "scale": house["scale"],
        "glb": GLB_FOR[house["style"]],
        "lod": {
            "hi": "cunucu_paradera_lod0",
            "lo": "cunucu_paradera_lod1",
            "switch_m": 180,
        },
        "tris": {"cunucu_paradera_lod0": 366, "cunucu_paradera_lod1": 114},
        "textures": 0,
        "hide_footprint": house["foot"],
        "hide": [],
        "sign": False,
        "kind": "replace",
        "new_place": False,
        "geo_source": "OSM building footprint",
        "ref_sources": (
            "One-storey cunucu with a hip roof, porch, and low yard wall, reused from the "
            "Paradera house mesh. Wall colours follow Alto Vista 69 (Daphrestauratie, CC BY-SA 4.0) "
            "and the Alto Vista L-house (SMFA, CC BY-SA 3.0). Not a photo texture."
        ),
        "frame": "glb origin = footprint centroid; rotation.y turns glTF +X (the door) toward the nearest road",
        "cat": "house",
    }


def main():
    roads = load_roads()
    houses = load_houses()
    placed = []
    for hid, style, tx, tz in PICKS:
        match = None
        for c, poly, kind, name in houses:
            if math.hypot(c[0] - tx, c[1] - tz) < 1.2:
                match = (c, poly, kind, name)
                break
        if not match:
            raise SystemExit(f"no OSM house at {tx},{tz}")
        c, poly, kind, name = match
        road = nearest_road(roads, c[0], c[1])
        road_d, dx, dz, rid, rname, ru = road
        yaw = math.atan2(-dz, dx)
        scale = lot_scale(poly, c[0], c[1], yaw, road_d)
        foot = [[rnd(x, 1), rnd(z, 1)] for x, z in poly]
        house = {
            "id": hid,
            "style": style,
            "x": rnd(c[0], 1),
            "z": rnd(c[1], 1),
            "yaw": round(yaw, 4),
            "scale": scale,
            "foot": foot,
        }
        placed.append(house)
        print(
            f"{hid} {style} ({house['x']},{house['z']}) yaw {yaw:.3f} "
            f"scale {scale} road {road_d:.1f}m id {rid} {rname!r} u={ru} k={kind}"
        )

    print("routes")
    noordkust = route_by_id(roads, 1690)
    alto = route_by_id(roads, 1559)
    bushi = route_by_id(roads, 3827)
    routes = [
        {"name": "noordkust", "pts": [[rnd(x), rnd(z)] for x, z in noordkust]},
        {"name": "alto", "pts": [[rnd(x), rnd(z)] for x, z in alto]},
        {"name": "bushi", "pts": [[rnd(x), rnd(z)] for x, z in bushi]},
    ]
    fleet = [
        {"route": "noordkust", "kind": "atv", "at": 220, "speed": 8.4, "color": 0xD32F2F},
        {"route": "noordkust", "kind": "utv", "at": 980, "speed": 7.5, "color": 0xF4F1EA},
        {"route": "noordkust", "kind": "jeep", "at": 1680, "speed": 9.1, "color": 0xD7C4A3},
        {"route": "alto", "kind": "atv", "at": 60, "speed": 7.8, "color": 0x1565C0},
        {"route": "alto", "kind": "utv", "at": 240, "speed": 8.6, "color": 0xEF6C00},
        {"route": "alto", "kind": "jeep", "at": 420, "speed": 7.2, "color": 0xF7F4EE},
        {"route": "bushi", "kind": "atv", "at": 140, "speed": 8.8, "color": 0xF9A825},
        {"route": "bushi", "kind": "utv", "at": 860, "speed": 7.9, "color": 0x263238},
    ]
    church = (-6641.7, -4706.3)
    row = placed[1]
    views = [
        {
            "id": "noord-row",
            "eye": list(front_point(row["x"], row["z"], row["yaw"], 16)),
            "look": [row["x"], row["z"]],
            "h": 2.5,
        },
        {
            "id": "noord-church",
            "eye": [-6310.0, -4768.0],
            "look": [church[0], church[1]],
            "h": 8.0,
        },
        {
            "id": "alto-white",
            "eye": list(front_point(placed[5]["x"], placed[5]["z"], placed[5]["yaw"], 14)),
            "look": [placed[5]["x"], placed[5]["z"]],
            "h": 2.4,
        },
        {
            "id": "alto-yellow",
            "eye": list(front_point(placed[4]["x"], placed[4]["z"], placed[4]["yaw"], 14)),
            "look": [placed[4]["x"], placed[4]["z"]],
            "h": 2.4,
        },
        road_view(noordkust, length(noordkust) * 0.35, "dirt-noordkust"),
        road_view(alto, length(alto) * 0.45, "dirt-alto"),
        road_view(bushi, length(bushi) * 0.55, "dirt-bushi"),
    ]
    blob = {
        "houses": [{k: h[k] for k in ("id", "x", "z", "yaw", "scale", "style")} for h in placed],
        "routes": routes,
        "fleet": fleet,
        "views": views,
    }
    OUT.write_text(json.dumps(blob, indent=1) + "\n")
    print("wrote", OUT, "houses", len(placed), "fleet", len(fleet))

    clone_glb(GLB / "cunucu_white.glb", [
        ("0.95,0.74,0.16", "0.94,0.93,0.90"),
        ("0.62,0.24,0.14", "0.16,0.17,0.18"),
        ("0.93,0.7,0.18", "0.93,0.9,0.86"),
        ("0.36,0.16,0.09", "0.18,0.34,0.16"),
    ])
    clone_glb(GLB / "cunucu_salmon.glb", [
        ("0.95,0.74,0.16", "0.86,0.55,0.42"),
        ("0.93,0.7,0.18", "0.86,0.5,0.32"),
    ])
    print("cloned white and salmon GLBs")

    text = MANIFEST.read_text()
    nl = text.endswith("\n")
    manifest = json.loads(text)
    keep = [e for e in manifest if not str(e.get("id", "")).startswith(("cunucu_noord_", "cunucu_alto_"))]
    keep.extend(hero_entry(h) for h in placed)
    out = json.dumps(keep, indent=1)
    if nl:
        out += "\n"
    MANIFEST.write_text(out)
    print("manifest entries", len(keep))


if __name__ == "__main__":
    main()
