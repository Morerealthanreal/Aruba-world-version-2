#!/usr/bin/env python3
"""San Nicolas bar row on B. van der Veen Zeppenfeldstraat, east of Charlie's.

One hero on the OSM shop footprints that are still generic massing:
Nano's, Shirley's, Hoolo! Beauty Salon, Bongo Bar, plus the two
unnamed lots the row's outline would otherwise erase.
Does not touch Charlie's, Fan Bar, the sn_* mural set, or the snmain_west/east rows.
No photo textures.
"""
import json
import math
from pathlib import Path

from accuracy_batch3 import (
    GLASS,
    WHITE,
    buildings_in,
    ccw,
    cent,
    closest_on,
    hull,
    load_regions,
    pip,
)
from hero_glb import Model, check_glb, fan, wall_ring, write_glb
from hooiberg_stair import sample_h

ROOT = Path(__file__).resolve().parents[1]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"

ID = "snmain_bars"
ROAD = "Van de Veen Zeppenfeldstraat"
NAMES = ["Nano's", "Shirley's", "Hoolo! Beauty Salon", "Bongo Bar"]
# Painted concrete and a metal awning, the street language already used beside
# Charlie's. Colours cycle so the row stays a few shared materials. Not a photo.
WALLS = [
    (0.72, 0.16, 0.14),
    (0.22, 0.62, 0.64),
    (0.90, 0.45, 0.62),
]
AWNINGS = [
    (0.93, 0.88, 0.78),
    (0.93, 0.72, 0.18),
    (0.18, 0.32, 0.58),
]


def build(roads, buildings):
    by_name = {}
    for b in buildings:
        n = b.get("n") or ""
        if n in NAMES:
            cx, cz = cent(b["p"])
            if 6900 < cx < 7000 and 9600 < cz < 9720:
                by_name[n] = b
    missing = [n for n in NAMES if n not in by_name]
    if missing:
        raise SystemExit(f"missing shops {missing}")
    named = [by_name[n] for n in NAMES]
    seed = hull([p for b in named for p in b["p"]])
    # Two unnamed two-storey lots sit in the same frontage. Build them too,
    # or the hide polygon would erase them.
    extra = []
    for b in buildings_in(buildings, seed):
        cx, cz = cent(b["p"])
        if any(pip(cx, cz, ccw(c["p"])) for c in named):
            continue
        extra.append(b)
    chosen = named + extra
    chosen.sort(key=lambda b: cent(b["p"])[0])
    ox = sum(cent(b["p"])[0] for b in chosen) / len(chosen)
    oz = sum(cent(b["p"])[1] for b in chosen) / len(chosen)
    hide = hull([p for b in chosen for p in b["p"]])
    swallowed = []
    for b in buildings_in(buildings, hide):
        cx, cz = cent(b["p"])
        if any(pip(cx, cz, ccw(c["p"])) for c in chosen):
            continue
        swallowed.append((b.get("n") or "?", round(cx, 1), round(cz, 1)))
    if swallowed:
        raise SystemExit(f"hide would remove {swallowed}")

    heroes = json.loads(MANIFEST.read_text())
    for e in heroes:
        hp = e.get("hide_footprint") or []
        if len(hp) < 3:
            continue
        for b in chosen:
            cx, cz = cent(b["p"])
            if pip(cx, cz, hp):
                raise SystemExit(f"{b.get('n')} sits in {e['id']} hide")

    M = Model(ID)
    trim = M.material("trim", WHITE, 0.75)
    glass = M.material("glass", GLASS, 0.3, double=True)
    roof = M.material("roof", (0.42, 0.40, 0.38), 0.7)
    mats = []
    for i in range(len(WALLS)):
        wall = M.material(f"w{i}", WALLS[i], 0.82)
        awn = M.material(f"a{i}", AWNINGS[i], 0.55, double=True)
        mats.append((wall, awn))

    for lod in (0, 1):
        for i, b in enumerate(chosen):
            ring = [(x - ox, z - oz) for x, z in ccw(b["p"])]
            bx, bz = cent(b["p"])
            road = closest_on(roads, bx, bz, ROAD)
            if math.hypot(road[0] - bx, road[1] - bz) > 30:
                raise SystemExit(f"{b.get('n')} is {math.hypot(road[0]-bx, road[1]-bz):.0f} m off {ROAD}")
            best, bi = 1e18, 0
            for k in range(len(ring)):
                a, c = ring[k], ring[(k + 1) % len(ring)]
                mx, mz = (a[0] + c[0]) / 2 + ox, (a[1] + c[1]) / 2 + oz
                d = (mx - road[0]) ** 2 + (mz - road[1]) ** 2
                if d < best:
                    best, bi = d, k
            a, c = ring[bi], ring[(bi + 1) % len(ring)]
            dx, dz = c[0] - a[0], c[1] - a[1]
            L = math.hypot(dx, dz) or 1
            oxn, ozn = dz / L, -dx / L
            wall, awn = mats[i % len(mats)]
            Wm, Rm = M.mesh(lod, wall), M.mesh(lod, roof)
            h = 6.2 if (b.get("h") or 0) >= 6 else 3.7
            wall_ring(Wm, ring, 0.05, h)
            fan(Rm, ring, h + 0.08, up=True)
            if lod == 0:
                wall_ring(M.mesh(lod, trim), ring, h - 0.06, h + 0.22)
            if lod == 1:
                continue
            Am, Gm = M.mesh(lod, awn), M.mesh(lod, glass)
            depth = 1.35
            y0, y1 = 2.15, 2.65
            a0 = (a[0], y0, a[1])
            b0 = (c[0], y0, c[1])
            a1 = (a[0] + oxn * depth, y1, a[1] + ozn * depth)
            b1 = (c[0] + oxn * depth, y1, c[1] + ozn * depth)
            Am.quad(a0, b0, b1, a1)
            Am.quad(
                a1, b1,
                (c[0] + oxn * depth, y0 - 0.5, c[1] + ozn * depth),
                (a[0] + oxn * depth, y0 - 0.5, a[1] + ozn * depth),
            )
            mx, mz = (a[0] + c[0]) / 2, (a[1] + c[1]) / 2
            px, pz = -dz / L, dx / L
            door = [
                (mx - px * 0.5 + oxn * 0.06, 0.12, mz - pz * 0.5 + ozn * 0.06),
                (mx + px * 0.5 + oxn * 0.06, 0.12, mz + pz * 0.5 + ozn * 0.06),
                (mx + px * 0.5 + oxn * 0.06, 2.2, mz + pz * 0.5 + ozn * 0.06),
                (mx - px * 0.5 + oxn * 0.06, 2.2, mz - pz * 0.5 + ozn * 0.06),
            ]
            Gm.quad(door[0], door[1], door[2], door[3])
            span = min(1.6, L * 0.28)
            for side in (-1, 1):
                wx, wz = mx + px * side * span, mz + pz * side * span
                Gm.quad(
                    (wx - px * 0.32 + oxn * 0.06, 1.15, wz - pz * 0.32 + ozn * 0.06),
                    (wx + px * 0.32 + oxn * 0.06, 1.15, wz + pz * 0.32 + ozn * 0.06),
                    (wx + px * 0.32 + oxn * 0.06, 2.0, wz + pz * 0.32 + ozn * 0.06),
                    (wx - px * 0.32 + oxn * 0.06, 2.0, wz - pz * 0.32 + ozn * 0.06),
                )
    info = write_glb(M, HERO / f"{ID}.glb")
    check_glb(HERO / f"{ID}.glb")
    y = sample_h(ox, oz, {})
    labels = [b.get("n") or "unnamed" for b in chosen]
    print(ID, "at", round(ox, 2), round(oz, 2), "y", round(y, 2), info, "shops", labels)
    return info, ox, oz, y, hide


def append_manifest(info, ox, oz, y, hide):
    text = MANIFEST.read_text()
    if f'"id": "{ID}"' in text:
        raise SystemExit(f"{ID} already in the manifest")
    if not text.rstrip().endswith("]"):
        raise SystemExit("manifest does not end with ]")
    y = round(y, 2)
    if y == 0:
        y = 0.05
    entry = {
        "id": ID, "k": ID, "name": "", "status": "accuracy-sn-bars",
        "x": round(ox, 2), "z": round(oz, 2), "y": y, "rotation": 0,
        "glb": f"models/hero/{ID}.glb",
        "lod": {"hi": f"{ID}_lod0", "lo": f"{ID}_lod1", "switch_m": 150},
        "tris": {f"{ID}_lod0": info["lod0"], f"{ID}_lod1": info["lod1"]},
        "textures": 0,
        "hide_footprint": [[round(p[0], 2), round(p[1], 2)] for p in hide],
        "hide": [],
        "sign": False,
        "kind": "replace",
        "new_place": False,
        "geo_source": "OSM footprints on Zeppenfeldstraat: Nano's, Shirley's, Hoolo! Beauty Salon, Bongo Bar, and the two unnamed lots between Nano's and Shirley's",
        "ref_sources": (
            "B. van der Veen Zeppenfeldstraat east of Charlie's Bar is a row of one-storey bars "
            "and shops: painted concrete, a metal awning, a dark doorway. These four OSM lots "
            "(Nano's, Shirley's, Hoolo! Beauty Salon, Bongo Bar) were still generic massing. "
            "Charlie's, Fan Bar, and the sn_* mural set are unchanged. Geometry only, not a photo."
        ),
        "frame": "glb origin = footprint centroid (world x,z); glTF +X = world x, +Z = world z, Y up",
        "cat": "store",
    }
    text = text.rstrip()[:-1].rstrip()
    if not text.endswith("}"):
        raise SystemExit("unexpected manifest ending")
    blob = json.dumps(entry, indent=1)
    blob = "\n".join(" " + ln for ln in blob.split("\n"))
    text = text + ",\n" + blob + "\n]\n"
    json.loads(text)
    MANIFEST.write_text(text)
    print("manifest appended", ID)


def main():
    roads, buildings = load_regions()
    info, ox, oz, y, hide = build(roads, buildings)
    append_manifest(info, ox, oz, y, hide)


if __name__ == "__main__":
    main()
