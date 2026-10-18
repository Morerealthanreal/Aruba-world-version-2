#!/usr/bin/env python3
"""Later San Nicolas Art Fair murals. Original paintings, one lean JPEG atlas.

Public photos are reference only. This set is separate from the first mural atlas.
"""
from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]

_TOOLS = Path(__file__).resolve().parent
import sys

if str(_TOOLS) not in sys.path:
    sys.path.insert(0, str(_TOOLS))
from mural_pack import pack_atlas as pack
SRC = ROOT / "tools" / "sn_paintings" / "later"
OUT_IMG = ROOT / "game" / "textures" / "sn_later_atlas.jpg"
OUT_JSON = ROOT / "game" / "data" / "sn_later_murals.json"

V_LIFT = 0.08
NORM = 0.18


def _smear(canvas: Image.Image, im: Image.Image, x0: int, x1: int, side: str) -> None:
    span = x1 - x0
    if span <= 0:
        return
    sw = max(16, im.width // 5)
    strip = im.crop((0, 0, sw, im.height) if side == "l" else (im.width - sw, 0, im.width, im.height))
    canvas.paste(strip.resize((span, im.height), Image.Resampling.LANCZOS), (x0, 0))


def _field(rgb, w: int, h: int, seed: int) -> Image.Image:
    import numpy as np
    med = np.array(rgb, dtype=np.int16)
    rng = np.random.default_rng(seed)
    noise = rng.integers(-8, 9, size=(h, w, 1))
    a = np.clip(med + noise, 0, 255).astype(np.uint8)
    return Image.fromarray(np.broadcast_to(a, (h, w, 3)).copy())


def _edge_field(im: Image.Image, side: str, w: int, h: int) -> Image.Image:
    """A soft continuation of the painting's own edge, with no repeated detail."""
    sw = max(8, im.width // 24)
    strip = im.crop((0, 0, sw, im.height) if side == "l" else (im.width - sw, 0, im.width, im.height))
    col = strip.resize((1, h), Image.Resampling.BOX)
    return col.resize((w, h), Image.Resampling.BILINEAR)


def _paste_fade(canvas: Image.Image, im: Image.Image, x: int, fade: int) -> None:
    if fade <= 0 or im.width < fade * 2:
        canvas.paste(im, (x, 0))
        return
    overlay = im.convert("RGBA")
    mask = Image.new("L", im.size, 255)
    px = mask.load()
    for i in range(fade):
        a = int(255 * (i + 1) / fade)
        for y in range(im.height):
            px[i, y] = a
            px[im.width - 1 - i, y] = a
    canvas.paste(overlay, (x, 0), mask)


def fit(path: Path, tw: int, th: int, flip: bool = False, crop=None, mode: str = "exact", field=None, panels=None) -> Image.Image:
    im = Image.open(path).convert("RGB")
    if crop:
        w, h = im.size
        l, t, r, b = crop
        im = im.crop((int(l * w), int(t * h), int(r * w), int(b * h)))
    if flip:
        im = im.transpose(Image.FLIP_LEFT_RIGHT)
    if mode == "exact":
        return im.resize((tw, th), Image.Resampling.LANCZOS)
    scale = th / im.height
    nw = max(1, int(im.width * scale))
    im = im.resize((nw, th), Image.Resampling.LANCZOS)
    if nw >= tw:
        x = (nw - tw) // 2
        return im.crop((x, 0, x + tw, th))
    canvas = Image.new("RGB", (tw, th))
    x0 = (tw - nw) // 2
    if mode == "smear":
        if x0 > 0:
            _smear(canvas, im, 0, x0, "l")
        if x0 + nw < tw:
            _smear(canvas, im, x0 + nw, tw, "r")
    elif mode == "edge":
        if x0 > 0:
            canvas.paste(_edge_field(im, "l", x0, th), (0, 0))
        if x0 + nw < tw:
            canvas.paste(_edge_field(im, "r", tw - (x0 + nw), th), (x0 + nw, 0))
    elif mode == "panels" and panels:
        def panel(slot, span, crop):
            pic = Image.open(SRC / slot).convert("RGB")
            if crop:
                pw, ph = pic.size
                l, t, r, b = crop
                pic = pic.crop((int(l * pw), int(t * ph), int(r * pw), int(b * ph)))
            return pic.resize((span, th), Image.Resampling.LANCZOS)
        if x0 > 0:
            canvas.paste(panel(panels["left"], x0, panels.get("left_crop")), (0, 0))
        if x0 + nw < tw:
            canvas.paste(panel(panels["right"], tw - (x0 + nw), panels.get("right_crop")), (x0 + nw, 0))
    else:
        rgb = field or (40, 40, 40)
        if x0 > 0:
            canvas.paste(_field(rgb, x0, th, 1), (0, 0))
        if x0 + nw < tw:
            canvas.paste(_field(rgb, tw - (x0 + nw), th, 2), (x0 + nw, 0))
    if mode == "panels":
        _paste_fade(canvas, im, x0, 36)
    else:
        canvas.paste(im, (x0, 0))
    return canvas



def load_buildings():
    by = {}
    for p in (ROOT / "game" / "data" / "real").glob("r_*.json"):
        data = json.loads(p.read_text())
        for b in data.get("b", []):
            if len(b.get("p") or []) >= 3:
                by[b["i"]] = b
    return by


def walls_of(b):
    poly = b["p"]
    n = len(poly)
    area = 0.0
    for i in range(n):
        x1, z1 = poly[i]
        x2, z2 = poly[(i + 1) % n]
        area += x1 * z2 - x2 * z1
    area *= 0.5
    out = []
    for i in range(n):
        ax, az = poly[i]
        bx, bz = poly[(i + 1) % n]
        dx, dz = bx - ax, bz - az
        length = math.hypot(dx, dz)
        if length < 0.8:
            continue
        lx, lz = -dz / length, dx / length
        ox, oz = (-lx, -lz) if area > 0 else (lx, lz)
        out.append({
            "i": i, "ax": ax, "az": az, "bx": bx, "bz": bz,
            "len": length, "ox": ox, "oz": oz,
        })
    return out


def viewer_right_flip(w) -> bool:
    """True when image-right would land on the viewer's left.

    The viewer stands on the street side, facing against the outward normal.
    Their right is the clockwise perpendicular of that normal.
    """
    dx, dz = w["bx"] - w["ax"], w["bz"] - w["az"]
    rx, rz = w["oz"], -w["ox"]
    return dx * rx + dz * rz < 0


BLD = load_buildings()

# span is metres along the wall from the west/start end when from_start is set,
# otherwise the span is centred on the pin's closest point.
SPECS = [
    {
        "id": "roots",
        "name": "Roots in Bloom",
        "artist": "Gomad",
        "year": 2025,
        "lat": 12.4358654, "lng": -69.9117461,
        "address": "Side of Decor Flower & Gift Shop, Doormanstraat at Marktstraat 2",
        "bld": 5007, "wall": 2,
        "src": "later-roots.jpg",
        "crop": (0.0, 0.17, 1.0, 0.83),
        "mode": "smear",
        "viewer_right": True,
        "world_h": 3.00,
        "ph": 240,
        "sources": [
            "Street Art Cities marker b02175d9-c643-4e82-b966-2f32f6d1209b (12.4358654, -69.9117461), Marktstraat 2, created 17 Sep 2025",
        ],
    },
    {
        "id": "lode",
        "name": "Lo de aquí",
        "artist": "Sake Ink, Fio Silva",
        "year": 2025,
        "lat": 12.4344657, "lng": -69.9086234,
        "address": "Caya Saint Maarten, west end of the street wall",
        "bld": 280, "wall": 1,
        "src": "later-lode.jpg",
        "mode": "exact",
        "viewer_right": True,
        "from_start": 0.2,
        "span": 8.4,
        "world_h": 3.00,
        "ph": 260,
        "sources": [
            "Street Art Cities marker fbbc9808-bd35-448b-9a63-3c2124af1a53 (12.4344657, -69.9086234), Caya Sint Maarten, created 5 Sep 2025",
        ],
    },
    {
        "id": "defender",
        "name": "Defender Nuestra",
        "artist": "Jorit",
        "year": 2017,
        "lat": 12.4359427, "lng": -69.9123144,
        "address": "Doormanstraat face, pin across the street from Piet Heinstraat corner",
        "bld": 9075, "wall": 0,
        "src": "later-defender.jpg",
        "mode": "panels",
        "panels": {
            "left": "later-defender-left.jpg",
            "right": "later-defender-right.jpg",
            "left_crop": (0.42, 0.0, 1.0, 1.0),
            "right_crop": (0.0, 0.05, 0.72, 0.95),
        },
        "viewer_right": True,
        "world_h": 3.00,
        "ph": 250,
        "sources": [
            "Street Art Cities marker 13071 (12.4359427, -69.9123144), Piet Heinstraat, created 23 Nov 2017. The pin stands in front of this Doormanstraat wall.",
        ],
    },
    {
        "id": "grace",
        "name": "Caribbean Grace",
        "artist": "Studio Giftig",
        "year": 2024,
        "lat": 12.4358275, "lng": -69.9109539,
        "address": "Korps Politie Aruba, Kazernestraat bus stop, east wall",
        "bld": 4074, "wall": 9,
        "src": "later-grace.jpg",
        "mode": "exact",
        "viewer_right": True,
        "world_h": 6.77,
        "ph": 320,
        "sources": [
            "Street Art Cities marker 81b840ae-c952-4c2b-8829-51537a3d2a7c (12.4358275, -69.9109539), Arubus stop at the San Nicolas police station, Kazernestraat, created 21 Sep 2024",
        ],
    },
]


def wall(spec):
    return next(w for w in walls_of(BLD[spec["bld"]]) if w["i"] == spec["wall"])


def place(spec, w):
    L = w["len"]
    if "span" in spec:
        span = min(spec["span"], L - 0.3)
        if "from_start" in spec:
            a = spec["from_start"]
        else:
            a = max(0.1, L * 0.5 - span / 2)
        b = min(L - 0.1, a + span)
        a = b - span
    else:
        a, b = 0.08, L - 0.08
        span = b - a
    dx, dz = (w["bx"] - w["ax"]) / L, (w["bz"] - w["az"]) / L
    x0 = w["ax"] + dx * a + w["ox"] * NORM
    z0 = w["az"] + dz * a + w["oz"] * NORM
    x1 = w["ax"] + dx * b + w["ox"] * NORM
    z1 = w["az"] + dz * b + w["oz"] * NORM
    return {
        "wall_i": w["i"],
        "wall_len": L,
        "width": span,
        "x0": x0, "z0": z0, "x1": x1, "z1": z1,
        "ox": w["ox"], "oz": w["oz"],
        "cx": (x0 + x1) / 2, "cz": (z0 + z1) / 2,
    }


def heroes_near(centers):
    manifest = json.loads((ROOT / "game" / "data" / "hero" / "manifest.json").read_text())
    rows = manifest if isinstance(manifest, list) else manifest.get("heroes") or manifest.get("items") or []
    found = []
    for h in rows:
        hid = str(h.get("id") or "")
        if not hid.startswith("sn_"):
            continue
        if hid in {"sn_bollards0", "sn_flagdisk", "sn_solarpark", "sn_pinkchurch"}:
            continue
        x, z = h.get("x"), h.get("z")
        if not isinstance(x, (int, float)) or not isinstance(z, (int, float)):
            continue
        for cid, cx, cz in centers:
            if math.hypot(x - cx, z - cz) < 8.0:
                found.append({"id": hid, "x": x, "z": z, "why": f"approximate hero within 8 m of {cid}"})
                break
    return found


def main():
    images = []
    placed = []
    for spec in SPECS:
        b = BLD[spec["bld"]]
        w = wall(spec)
        face = place(spec, w)
        flip = viewer_right_flip(w) if spec.get("viewer_right") else spec.get("flip", False)
        tw = int(round(spec["ph"] * face["width"] / spec["world_h"]))
        im = fit(
            SRC / spec["src"], tw, spec["ph"], flip, spec.get("crop"),
            spec.get("mode", "exact"), spec.get("field"), spec.get("panels"),
        )
        images.append(im)
        placed.append({
            "spec": spec, "face": face, "bld_h": float(b.get("h") or 3.4),
            "bld_name": b.get("n") or "", "height": spec["world_h"], "flip": flip,
        })
        print(f"{spec['id']:10} bld {spec['bld']} {(b.get('n') or '')[:24]:24} wall {w['i']} {face['width']:.2f}x{spec['world_h']:.2f} flip={flip} tile {im.size}")

    atlas, boxes = pack(images)
    OUT_IMG.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(OUT_IMG, "JPEG", quality=68, optimize=True)
    aw, ah = atlas.size
    murals = []
    centers = []
    for rec, (px, py, pw, ph) in zip(placed, boxes):
        spec = rec["spec"]
        face = rec["face"]
        u0, v1 = px / aw, 1 - py / ah
        u1 = (px + pw) / aw
        v0 = 1 - (py + ph) / ah
        mural = {
            "id": spec["id"],
            "name": spec["name"],
            "artist": spec["artist"],
            "year": spec["year"],
            "address": spec["address"],
            "lat": spec["lat"],
            "lng": spec["lng"],
            "bld": spec["bld"],
            "bld_name": rec["bld_name"],
            "bld_h": rec["bld_h"],
            "wall_i": face["wall_i"],
            "wall_len": round(face["wall_len"], 2),
            "center": [round(face["cx"], 2), round(face["cz"], 2)],
            "p0": [round(face["x0"], 2), round(face["z0"], 2)],
            "p1": [round(face["x1"], 2), round(face["z1"], 2)],
            "normal": [round(face["ox"], 4), round(face["oz"], 4)],
            "width": round(face["width"], 2),
            "height": round(rec["height"], 2),
            "uv": [round(u0, 6), round(v0, 6), round(u1, 6), round(v1, 6)],
            "base": "ground",
            "lift": V_LIFT,
            "sources": spec["sources"],
        }
        murals.append(mural)
        centers.append((spec["id"], face["cx"], face["cz"]))
    doc = {
        "atlas": "textures/sn_later_atlas.jpg",
        "atlas_px": [aw, ah],
        "note": "Later San Nicolas Art Fair murals. Original paintings. Public photos were visual reference only.",
        "hide_heroes": heroes_near(centers),
        "murals": murals,
    }
    OUT_JSON.write_text(json.dumps(doc, indent=1) + "\n")
    print("atlas", atlas.size, OUT_IMG.stat().st_size)
    print("heroes", doc["hide_heroes"])


if __name__ == "__main__":
    main()
