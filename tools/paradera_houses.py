#!/usr/bin/env python3
"""Five more cunucu houses on Paradera lots that do not already have a hero.

Same house as the earlier inland kit: one storey, coloured walls, hip roof,
porch, low fence. Lots come from the OSM building footprints already in the
road tiles. No photo textures. Does not move the church or the first
Paradera house.
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

WALLS = [
    (0.93, 0.72, 0.28),
    (0.86, 0.45, 0.32),
    (0.55, 0.72, 0.62),
    (0.90, 0.82, 0.62),
    (0.72, 0.48, 0.55),
]
FENCES = [
    (0.55, 0.28, 0.16),
    (0.92, 0.90, 0.84),
    (0.45, 0.32, 0.22),
    (0.62, 0.28, 0.18),
    (0.90, 0.88, 0.82),
]
ROOFS = [B.CLAY, (0.55, 0.16, 0.12), B.CLAY, (0.62, 0.22, 0.14), (0.48, 0.18, 0.14)]
IDS = ["para_house_a", "para_house_b", "para_house_c", "para_house_d", "para_house_e"]


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


def lots(roads, heroes):
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


def append(entries):
    text = MANIFEST.read_text()
    for e in entries:
        if f'"id": "{e["id"]}"' in text:
            raise SystemExit(f'{e["id"]} already present')
    chunks = []
    for entry in entries:
        body = json.dumps(entry, indent=1)
        chunks.append("\n".join(" " + line for line in body.splitlines()))
    text = text.rstrip()[:-1] + ",\n" + ",\n".join(chunks) + "\n]\n"
    json.loads(text)
    MANIFEST.write_text(text)


def main():
    roads, _buildings = B.load_regions()
    heroes = []
    for e in json.loads(MANIFEST.read_text()):
        if "x" in e and "z" in e:
            heroes.append((e["x"], e["z"], e.get("id")))
    chosen = lots(roads, heroes)
    entries = []
    ref = (
        "Cunucu house: one storey, coloured walls, hip roof, porch, low concrete fence. "
        "Same kit as the first Paradera house. OSM house footprint on the Paradera road. Not a photo texture."
    )
    for i, (cx, cz, ring) in enumerate(chosen):
        spec = (IDS[i], ring, "Paradera", WALLS[i], FENCES[i], ROOFS[i], True, i % 2 == 0)
        info, (hx, hz), hide = B.build_house(spec, roads)
        h = sample_h(hx, hz)
        if abs(h) < 0.05:
            raise SystemExit(f"refusing a zero pin at {IDS[i]}")
        entry = B.manifest_entry(IDS[i], "", hx, hz, info, 160, "house", hide, ref, False, 0)
        entry["y"] = round(h, 2)
        entry["status"] = "accuracy-paradera"
        entries.append(entry)
        print(IDS[i], "pinned", round(h, 2))
    append(entries)
    print("manifest ok")


if __name__ == "__main__":
    main()
