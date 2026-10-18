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
from hero_glb import Model, check_glb, fan, sign_quad, wall_ring, write_glb
from hooiberg_stair import sample_h

ROOT = Path(__file__).resolve().parents[1]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"

ID = "snmain_bars"
ROAD = "Van de Veen Zeppenfeldstraat"
NAMES = ["Nano's", "Shirley's", "Hoolo! Beauty Salon", "Bongo Bar"]
# Each front is its own colour and sign. The shared awning kit was the rejection.
# Colours are the painted-concrete range on this street (Charlie's white-over-black,
# Fan Bar cream, the peach and pink bars on the side street). Signs are drawn text.
SPECS = {
    "Nano's": {"wall": (0.93, 0.92, 0.88), "base": (0.16, 0.12, 0.10), "sign": "NANO'S", "awning": False, "door": (0.32, 0.18, 0.10)},
    "Shirley's": {"wall": (0.55, 0.72, 0.74), "base": (0.86, 0.84, 0.78), "sign": "SHIRLEY'S", "awning": True, "door": (0.85, 0.85, 0.82)},
    "Hoolo! Beauty Salon": {"wall": (0.93, 0.72, 0.62), "base": (0.93, 0.72, 0.62), "sign": "HOOLO!", "awning": False, "door": (0.20, 0.32, 0.38)},
    "Bongo Bar": {"wall": (0.62, 0.16, 0.16), "base": (0.12, 0.18, 0.36), "sign": "BONGO", "awning": False, "door": (0.10, 0.10, 0.10)},
}


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
    signmat = M.material("sign", (0.12, 0.12, 0.12), 0.55, textured=True, emissive=0.4)
    wall_mats = {}
    door_mats = {}
    for name, spec in SPECS.items():
        wall_mats[name] = M.material("w_" + name.split()[0].lower().replace("'", ""), spec["wall"], 0.82)
        door_mats[name] = M.material("d_" + name.split()[0].lower().replace("'", ""), spec["door"], 0.75)
    # Two unnamed lots keep their own colours so they are not copies of a named shop.
    extra_walls = [
        M.material("w_up_a", (0.90, 0.82, 0.62), 0.82),
        M.material("w_up_b", (0.86, 0.70, 0.72), 0.82),
    ]
    awning = M.material("awning", (0.90, 0.90, 0.88), 0.5, double=True)
    labels = []
    for b in chosen:
        spec = SPECS.get(b.get("n") or "")
        labels.append(spec["sign"] if spec else "")
    from accuracy_batch3 import sign_png
    # One atlas, a slice per shop, so the signs are not the same picture.
    import io
    from PIL import Image, ImageDraw, ImageFont
    font_path = "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf"
    atlas = Image.new("RGBA", (1024, 128), (20, 18, 16, 255))
    draw = ImageDraw.Draw(atlas)
    nslot = max(1, len(labels))
    slot_w = 1024 // nslot
    font = ImageFont.truetype(font_path, 64)
    for i, text in enumerate(labels):
        if not text:
            continue
        size = 64
        font = ImageFont.truetype(font_path, size)
        while font.getlength(text) > slot_w - 16 and size > 18:
            size -= 4
            font = ImageFont.truetype(font_path, size)
        tw = font.getlength(text)
        draw.text((i * slot_w + (slot_w - tw) / 2, (128 - size) / 2 - 2), text, fill=(245, 240, 230, 255), font=font)
    buf = io.BytesIO()
    atlas.save(buf, "PNG")
    png = buf.getvalue()

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
            name = b.get("n") or ""
            spec = SPECS.get(name)
            if spec:
                wall = wall_mats[name]
                base_c = spec["base"]
            else:
                wall = extra_walls[i % 2]
                base_c = None
            Wm, Rm = M.mesh(lod, wall), M.mesh(lod, roof)
            h = 6.2 if (b.get("h") or 0) >= 6 else 3.7
            wall_ring(Wm, ring, 0.05, h)
            fan(Rm, ring, h + 0.08, up=True)
            if lod == 0 and base_c and base_c != spec["wall"]:
                base = M.material(f"base{i}", base_c, 0.85)
                wall_ring(M.mesh(lod, base), ring, 0.05, 0.85)
            if lod == 0:
                wall_ring(M.mesh(lod, trim), ring, h - 0.06, h + 0.22)
            if lod == 1:
                continue
            mx, mz = (a[0] + c[0]) / 2, (a[1] + c[1]) / 2
            px, pz = -dz / L, dx / L
            door_m = door_mats[name] if spec else glass
            Dm = M.mesh(lod, door_m)
            door = [
                (mx - px * 0.45 + oxn * 0.08, 0.08, mz - pz * 0.45 + ozn * 0.08),
                (mx + px * 0.45 + oxn * 0.08, 0.08, mz + pz * 0.45 + ozn * 0.08),
                (mx + px * 0.45 + oxn * 0.08, 2.15, mz + pz * 0.45 + ozn * 0.08),
                (mx - px * 0.45 + oxn * 0.08, 2.15, mz - pz * 0.45 + ozn * 0.08),
            ]
            Dm.quad(door[0], door[1], door[2], door[3])
            Gm = M.mesh(lod, glass)
            if h > 5:
                for side in (-1, 1):
                    wx, wz = mx + px * side * min(1.4, L * 0.22), mz + pz * side * min(1.4, L * 0.22)
                    Gm.quad(
                        (wx - px * 0.4 + oxn * 0.08, 3.5, wz - pz * 0.4 + ozn * 0.08),
                        (wx + px * 0.4 + oxn * 0.08, 3.5, wz + pz * 0.4 + ozn * 0.08),
                        (wx + px * 0.4 + oxn * 0.08, 5.2, wz + pz * 0.4 + ozn * 0.08),
                        (wx - px * 0.4 + oxn * 0.08, 5.2, wz - pz * 0.4 + ozn * 0.08),
                    )
            elif spec and spec["awning"]:
                depth = 1.1
                y0 = 2.35
                Am = M.mesh(lod, awning)
                Am.quad(
                    (a[0], y0, a[1]), (c[0], y0, c[1]),
                    (c[0] + oxn * depth, y0 + 0.35, c[1] + ozn * depth),
                    (a[0] + oxn * depth, y0 + 0.35, a[1] + ozn * depth),
                )
            else:
                Gm.quad(
                    (mx - px * 0.7 + oxn * 0.08, 1.2, mz - pz * 0.7 + ozn * 0.08),
                    (mx + px * 0.7 + oxn * 0.08, 1.2, mz + pz * 0.7 + ozn * 0.08),
                    (mx + px * 0.7 + oxn * 0.08, 2.05, mz + pz * 0.7 + ozn * 0.08),
                    (mx - px * 0.7 + oxn * 0.08, 2.05, mz - pz * 0.7 + ozn * 0.08),
                )
            if spec:
                u0, u1 = i / nslot, (i + 1) / nslot
                half = min(2.2, L * 0.32)
                # Screen-left is toward c when standing in the road.
                left = (mx + px * half + oxn * 0.16, mz + pz * half + ozn * 0.16)
                right = (mx - px * half + oxn * 0.16, mz - pz * half + ozn * 0.16)
                top, bot = (2.85 if h < 5 else 3.15), (2.35 if h < 5 else 2.55)
                Sm = M.mesh(lod, signmat)
                Sm.quad(
                    (left[0], top, left[1]), (left[0], bot, left[1]),
                    (right[0], bot, right[1]), (right[0], top, right[1]),
                    uvs=((u0, 0), (u0, 1), (u1, 1), (u1, 0)),
                )
    info = write_glb(M, HERO / f"{ID}.glb", images=[png])
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
        "textures": 1,
        "hide_footprint": [[round(p[0], 2), round(p[1], 2)] for p in hide],
        "hide": [],
        "sign": False,
        "kind": "replace",
        "new_place": False,
        "geo_source": "OSM footprints on Zeppenfeldstraat: Nano's, Shirley's, Hoolo! Beauty Salon, Bongo Bar, and the two unnamed lots between Nano's and Shirley's",
        "ref_sources": (
            "Zeppenfeldstraat east of Charlie's. Each OSM shop has its own front and a drawn sign: "
            "Nano's (white over a dark base), Shirley's (blue-green, awning), Hoolo! (peach), "
            "Bongo Bar (red over blue). The two unnamed lots stay two-storey. "
            "Charlie's, Fan Bar, and the sn_* mural set are unchanged. Signs are drawn text, not a photo."
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
