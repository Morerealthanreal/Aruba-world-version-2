#!/usr/bin/env python3
"""Iconic San Nicolas murals not yet in earlier batches. One lean JPEG on OSM walls.

Public photos (Street Art Cities, Wikimedia) are reference only while painting.
"""
from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image

_TOOLS = Path(__file__).resolve().parent
import sys

if str(_TOOLS) not in sys.path:
    sys.path.insert(0, str(_TOOLS))
from mural_pack import pack_atlas as pack

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "tools" / "sn_paintings" / "iconic"
OUT_IMG = ROOT / "game" / "textures" / "sn_iconic_atlas.jpg"
OUT_JSON = ROOT / "game" / "data" / "sn_iconic_murals.json"

# World height of a one-storey mural. Flat roofs slab at h=3.4, so the paint
# stays under that: bottom 0.08 + 3.00 = 3.08.
STOREY_H = 3.00
V_LIFT = 0.08
NORM = 0.10


def _repeat_strip(canvas: Image.Image, im: Image.Image, x0: int, x1: int, side: str) -> None:
    """Tile an outer quarter so the continuation is paint, not a flat slab."""
    th = im.height
    qw = max(8, im.width // 4)
    if side == "l":
        strip = im.crop((0, 0, qw, th))
        x = x1
        while x > x0:
            x -= qw
            canvas.paste(strip, (x, 0))
    else:
        strip = im.crop((im.width - qw, 0, im.width, th))
        x = x0
        while x < x1:
            canvas.paste(strip, (x, 0))
            x += qw


def _smear_strip(canvas: Image.Image, im: Image.Image, x0: int, x1: int, side: str) -> None:
    """Stretch one outer band across the gap so a hillside stays a hillside."""
    span = x1 - x0
    if span <= 0:
        return
    th = im.height
    sw = max(16, im.width // 5)
    if side == "l":
        strip = im.crop((0, 0, sw, th))
    else:
        strip = im.crop((im.width - sw, 0, im.width, th))
    canvas.paste(strip.resize((span, th), Image.Resampling.LANCZOS), (x0, 0))


def _place(im: Image.Image, tw: int, align: float, field=None, repeat_left: bool = False, repeat_right: bool = False, smear_left: bool = False, smear_right: bool = False) -> Image.Image:
    th = im.height
    nw = im.width
    canvas = Image.new("RGB", (tw, th))
    x0 = int(round(align * tw - nw / 2))
    x0 = max(0, min(tw - nw, x0))
    if x0 > 0:
        if smear_left:
            _smear_strip(canvas, im, 0, x0, "l")
        elif repeat_left:
            _repeat_strip(canvas, im, 0, x0, "l")
        else:
            sample = field if field is not None else _side_sample(im, "l")
            canvas.paste(_field(sample, x0, th, 1), (0, 0))
    right = tw - (x0 + nw)
    if right > 0:
        if smear_right:
            _smear_strip(canvas, im, x0 + nw, tw, "r")
        elif repeat_right:
            _repeat_strip(canvas, im, x0 + nw, tw, "r")
        else:
            sample = field if field is not None else _side_sample(im, "r")
            canvas.paste(_field(sample, right, th, 2), (x0 + nw, 0))
    canvas.paste(im, (x0, 0))
    return canvas


def _side_sample(im: Image.Image, side: str):
    import numpy as np
    w, h = im.size
    inset = max(4, int(w * 0.12))
    x = inset if side == "l" else w - inset - 8
    y0 = int(h * 0.35)
    y1 = int(h * 0.85)
    return np.array(im.crop((x, y0, x + 8, y1))).reshape(-1, 3)


def _field(sample, w: int, h: int, seed: int) -> Image.Image:
    import numpy as np
    if isinstance(sample, tuple):
        med = np.array(sample, dtype=np.int16)
    else:
        med = np.median(sample, axis=0).astype(np.int16)
    rng = np.random.default_rng(seed)
    noise = rng.integers(-10, 11, size=(h, w, 1))
    a = np.clip(med + noise, 0, 255).astype(np.uint8)
    return Image.fromarray(np.broadcast_to(a, (h, w, 3)).copy())


def fit(path: Path, tw: int, th: int, flip: bool = False, stretch: float = 1.0, crop=None, mode: str = "field", align: float = 0.5, field=None) -> Image.Image:
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
    nw = max(1, int(im.width * scale * stretch))
    im = im.resize((nw, th), Image.Resampling.LANCZOS)
    if nw >= tw:
        x = max(0, min(nw - tw, int(nw * align - tw / 2)))
        return im.crop((x, 0, x + tw, th))
    # quarters: the landscape continues. extend-left: only the low-u side
    # repeats, so a face at the other end is not copied down the wall.
    if mode == "quarters":
        return _place(im, tw, align, field, smear_left=True, smear_right=True)
    if mode == "extend-left":
        return _place(im, tw, align, field, smear_left=True, repeat_right=False)
    return _place(im, tw, align, field)



def load_buildings():
    by = {}
    for path in sorted((ROOT / "game" / "data" / "real").glob("r_*.json")):
        data = json.loads(path.read_text())
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


BLD = load_buildings()

# Holes are metres along the OSM edge (ax → bx) and up from the ground.
# The emitter shifts them into mural-local coordinates.
SPECS = [
    {
        "id": "glow_dark",
        "name": "Glow In The Dark",
        "artist": "Bond Truluv",
        "year": 2016,
        "lat": 12.4348924,
        "lng": -69.9108258,
        "address": "Stuyvesantstraat, San Nicolas",
        "bld": 11601,
        "wall": 3,
        "src": "iconic-glow.jpg",
        "mode": "exact",
        "world_h": STOREY_H,
        "ph": 200,
        "sources": [
            "Street Art Cities marker 13074 (12.4348924, -69.9108258), Stuyvesantstraat, created 23 Sep 2016",
        ],
    },
    {
        "id": "mucha_bunita",
        "name": "Mucha Bunita",
        "artist": "Ives One",
        "year": 2017,
        "lat": 12.4351889,
        "lng": -69.9099012,
        "address": "Bernard van de Veen Zeppenfeldstraat 9, San Nicolas Main Street",
        "bld": 4082,
        "wall": 8,
        "src": "iconic-mucha.jpg",
        "mode": "exact",
        "world_h": STOREY_H,
        "ph": 210,
        "sources": [
            "Street Art Cities marker 13088 (12.4351889, -69.9099012), Zeppenfeldstraat 9, created 23 Nov 2017",
        ],
    },
    {
        "id": "greetings",
        "name": "Greetings from ARUBA",
        "artist": "Aruba Art Fair collective",
        "year": 2016,
        "lat": 12.435189,
        "lng": -69.909486,
        "address": "Bernard van de Veen Zeppenfeldstraat (Main Street)",
        "bld": 11527,
        "wall": 2,
        "src": "iconic-greetings.jpg",
        "mode": "exact",
        "world_h": STOREY_H,
        "ph": 190,
        "sources": [
            "Wikimedia Commons File:San_Nicolas_murals_(Aruba)_23_00_50_266000.jpeg (Caribiana, CC BY-SA 4.0, camera 12.435189, -69.909486)",
        ],
    },
    {
        "id": "flying_ducks",
        "name": "Flying Ducks",
        "artist": "Aruba Art Fair",
        "year": 2016,
        "lat": 12.43596,
        "lng": -69.911,
        "address": "Bernhardstraat, red-brick wall",
        "bld": 4074,
        "wall": 10,
        "src": "iconic-ducks.jpg",
        "mode": "exact",
        "world_h": STOREY_H,
        "ph": 180,
        "sources": [
            "Street art on Bernhardstraat (island video survey; visual reference only)",
        ],
    },
    {
        "id": "theater_mask",
        "name": "Theaterstraat mask",
        "artist": "Aruba Art Fair",
        "year": 2016,
        "lat": 12.4363,
        "lng": -69.9108,
        "address": "Theaterstraat, San Nicolas",
        "bld": 6313,
        "wall": 11,
        "src": "iconic-theater.jpg",
        "mode": "exact",
        "world_h": STOREY_H,
        "ph": 200,
        "sources": [
            "Theaterstraat art district, San Nicolas (OSM wall fit; visual reference only)",
        ],
    },
    {
        "id": "charlies_row",
        "name": "Main Street shopfront strip",
        "artist": "Local San Nicolas artists",
        "year": 2017,
        "lat": 12.4355,
        "lng": -69.9106,
        "address": "Bernard van de Veen Zeppenfeldstraat near Charlie's Bar",
        "bld": 11517,
        "wall": 2,
        "src": "iconic-charlie.jpg",
        "mode": "exact",
        "world_h": STOREY_H,
        "ph": 185,
        "sources": [
            "San Nicolas Main Street pastel shopfronts beside Charlie's Bar (visual reference only)",
        ],
    },
]


def wall(spec):
    return next(w for w in walls_of(BLD[spec["bld"]]) if w["i"] == spec["wall"])


def local_holes(holes, trim0, bottom):
    out = []
    for hx0, hy0, hx1, hy1 in holes or []:
        x0 = hx0 - trim0
        x1 = hx1 - trim0
        y0 = hy0 - bottom
        y1 = hy1 - bottom
        if x1 - x0 < 0.15 or y1 - y0 < 0.15:
            continue
        out.append([round(x0, 3), round(max(0.0, y0), 3), round(x1, 3), round(y1, 3)])
    return out


def place_one(spec, w):
    inset = 0.06
    L = w["len"]
    span = L - inset * 2
    dx, dz = (w["bx"] - w["ax"]) / L, (w["bz"] - w["az"]) / L
    x0 = w["ax"] + dx * inset + w["ox"] * NORM
    z0 = w["az"] + dz * inset + w["oz"] * NORM
    x1 = w["bx"] - dx * inset + w["ox"] * NORM
    z1 = w["bz"] - dz * inset + w["oz"] * NORM
    bottom = spec.get("y0", V_LIFT)
    return {
        "id": spec["id"],
        "wall_i": w["i"],
        "wall_len": L,
        "width": span,
        "x0": x0, "z0": z0, "x1": x1, "z1": z1,
        "ox": w["ox"], "oz": w["oz"],
        "cx": (x0 + x1) / 2, "cz": (z0 + z1) / 2,
        "u0": 0.0, "u1": 1.0,
        "holes": local_holes(spec.get("holes"), inset, bottom),
    }


def place_unwrap(spec):
    by_i = {w["i"]: w for w in walls_of(BLD[spec["bld"]])}
    order = [by_i[i] for i in spec["unwrap"]]
    total = sum(w["len"] for w in order)
    holes_by = spec.get("holes_by_wall") or {}
    faces = []
    cursor = 0.0
    bottom = spec.get("y0", V_LIFT)
    for idx, w in enumerate(order):
        L = w["len"]
        trim0 = 0.05 if idx == 0 else 0.0
        trim1 = 0.05 if idx == len(order) - 1 else 0.0
        dx, dz = (w["bx"] - w["ax"]) / L, (w["bz"] - w["az"]) / L
        x0 = w["ax"] + dx * trim0 + w["ox"] * NORM
        z0 = w["az"] + dz * trim0 + w["oz"] * NORM
        x1 = w["bx"] - dx * trim1 + w["ox"] * NORM
        z1 = w["bz"] - dz * trim1 + w["oz"] * NORM
        span = L - trim0 - trim1
        # Unwrap order is the viewer's right-to-left after the horizontal flip.
        label = ("cards_r", "cards", "cards_l")[idx]
        faces.append({
            "id": label,
            "wall_i": w["i"],
            "wall_len": L,
            "width": span,
            "x0": x0, "z0": z0, "x1": x1, "z1": z1,
            "ox": w["ox"], "oz": w["oz"],
            "cx": (x0 + x1) / 2, "cz": (z0 + z1) / 2,
            "u0": (cursor + trim0) / total,
            "u1": (cursor + L - trim1) / total,
            "holes": local_holes(holes_by.get(w["i"]), trim0, bottom),
        })
        cursor += L
    return faces, total


def heroes_near(centers):
    manifest = json.loads((ROOT / "game" / "data" / "hero" / "manifest.json").read_text())
    rows = manifest if isinstance(manifest, list) else manifest.get("heroes") or manifest.get("items") or []
    found = []
    for h in rows:
        hid = str(h.get("id") or "")
        if not (hid.startswith("sn_") or hid.startswith("ora_")):
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
        bld_h = float(b.get("h") or 3.4)
        if spec.get("unwrap"):
            faces, total = place_unwrap(spec)
            tw = int(round(spec["ph"] * total / spec["world_h"]))
            im = fit(
                SRC / spec["src"], tw, spec["ph"], spec.get("flip", False), spec.get("stretch", 1.0),
                spec.get("crop"), spec.get("mode", "field"), spec.get("align", 0.5), spec.get("field"),
            )
            images.append(im)
            placed.append({
                "spec": spec, "faces": faces, "bld_h": bld_h,
                "bld_name": b.get("n") or "", "height": spec["world_h"],
            })
            for face in faces:
                print(f"{face['id']:12} bld {spec['bld']} wall {face['wall_i']} {face['width']:.2f}x{spec['world_h']:.2f} holes={len(face['holes'])}")
            continue
        w = wall(spec)
        face = place_one(spec, w)
        tw = int(round(spec["ph"] * face["width"] / spec["world_h"]))
        im = fit(
            SRC / spec["src"], tw, spec["ph"], spec.get("flip", False), spec.get("stretch", 1.0),
            spec.get("crop"), spec.get("mode", "field"), spec.get("align", 0.5), spec.get("field"),
        )
        images.append(im)
        placed.append({
            "spec": spec, "face": face, "bld_h": bld_h,
            "bld_name": b.get("n") or "", "height": spec["world_h"],
        })
        print(f"{spec['id']:12} bld {spec['bld']} {(b.get('n') or '')[:22]:22} wall {w['i']} {face['width']:.2f}x{spec['world_h']:.2f} holes={len(face['holes'])} tile {im.size}")

    atlas, boxes = pack(images)
    OUT_IMG.parent.mkdir(parents=True, exist_ok=True)
    atlas.save(OUT_IMG, "JPEG", quality=68, optimize=True)
    aw, ah = atlas.size
    murals = []
    centers = []
    for rec, (px, py, pw, ph) in zip(placed, boxes):
        spec = rec["spec"]
        faces = rec.get("faces") or [rec["face"]]
        u_span0, v1 = px / aw, 1 - py / ah
        v0 = 1 - (py + ph) / ah
        span_u = pw / aw
        for face in faces:
            u0 = u_span0 + span_u * face["u0"]
            u1 = u_span0 + span_u * face["u1"]
            mural = {
                "id": face["id"],
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
                "sources": spec["sources"],
            }
            if "y0" in spec:
                mural["y0"] = spec["y0"]
            else:
                mural["base"] = "ground"
                mural["lift"] = V_LIFT
            if face["holes"]:
                mural["holes"] = face["holes"]
            murals.append(mural)
            centers.append((face["id"], face["cx"], face["cz"]))
    doc = {
        "atlas": "textures/sn_iconic_atlas.jpg",
        "atlas_px": [aw, ah],
        "note": "Iconic San Nicolas walls missing from earlier batches. Original paintings. Public photos were visual reference only.",
        "hide_heroes": heroes_near(centers),
        "murals": murals,
    }
    OUT_JSON.write_text(json.dumps(doc, indent=1) + "\n")
    print("atlas", atlas.size, OUT_IMG.stat().st_size)
    print("heroes", doc["hide_heroes"])


if __name__ == "__main__":
    main()
