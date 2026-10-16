#!/usr/bin/env python3
"""Second San Nicolas Art Fair batch. Original paintings, one lean JPEG atlas.

Public photos are reference only. They are not copied into the atlas.
This file set is separate from the first twelve murals so it can ship beside them.
"""
from __future__ import annotations

import json
import math
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "tools" / "sn_paintings" / "fair"
OUT_IMG = ROOT / "game" / "textures" / "sn_fair_atlas.jpg"
OUT_JSON = ROOT / "game" / "data" / "sn_fair_murals.json"

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


def pack(images: list[Image.Image]):
    pad = 2
    max_w = 2048
    order = sorted(range(len(images)), key=lambda i: (-images[i].size[1], -images[i].size[0]))
    rows = []
    for i in order:
        w, h = images[i].size
        placed = False
        for row in rows:
            if row["x"] + w <= max_w:
                row["items"].append((i, row["x"]))
                row["x"] += w + pad
                row["h"] = max(row["h"], h)
                placed = True
                break
        if not placed:
            rows.append({"x": w + pad, "h": h, "items": [(i, 0)]})
    boxes = [None] * len(images)
    y = 0
    for row in rows:
        for i, x in row["items"]:
            w, h = images[i].size
            boxes[i] = (x, y, w, h)
        y += row["h"] + pad
    atlas_h = (max(4, y - pad) + 3) & ~3
    atlas = Image.new("RGB", (max_w, atlas_h), (18, 18, 18))
    for im, (px, py, w, h) in zip(images, boxes):
        atlas.paste(im, (px, py))
    return atlas, boxes


def load_buildings():
    by = {}
    for name in ("r_17_21.json", "r_16_21.json", "r_17_20.json"):
        data = json.loads((ROOT / "game" / "data" / "real" / name).read_text())
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
        "id": "nymph",
        "name": "Carnival Nymph",
        "artist": "Isidora López Paz",
        "year": 2017,
        "lat": 12.4348487, "lng": -69.9095988,
        "address": "Bernard van de Veen Zeppenfeldstraat 21",
        "bld": 11522, "wall": 0,
        "src": "fair-nymph.jpg",
        "world_h": STOREY_H,
        "ph": 240,
        "holes": [[1.15, 0.96, 2.68, 2.50], [4.98, 0.96, 6.52, 2.50]],
        "sources": [
            "Street Art Cities marker 13068 (12.4348487, -69.9095988), Bernard van de Veen Zeppenfeldstraat 21, created 23 Nov 2017",
        ],
    },
    {
        "id": "nina",
        "name": "Niña Bonita",
        "artist": "Street Art Chilango",
        "year": 2016,
        "lat": 12.4361745, "lng": -69.9124217,
        "address": "Bernhardstraat 126, Piet Heinstraat face",
        "bld": 9085, "wall": 3,
        "src": "fair-nina.jpg",
        "crop": (0.045, 0.0, 0.955, 1.0),
        # Outer landscape is stretched once along the upper wall, so the
        # hillside continues without a copied ridge.
        "mode": "quarters",
        "world_h": 3.30,
        "y0": 3.40,
        "ph": 220,
        # Upper-floor openings only. The mural sits above the ground floor.
        "holes": [
            [1.53, 4.39, 3.25, 6.62],
            [6.30, 4.39, 8.02, 6.62],
            [11.08, 4.39, 12.80, 6.62],
            [15.85, 4.39, 17.57, 6.62],
        ],
        "sources": [
            "Street Art Cities marker 13070 (12.4361745, -69.9124217), Bernhardstraat 126, created 21 Sep 2016",
        ],
    },
    {
        "id": "cards",
        "name": "Infinity House of Cards",
        "artist": "Chemis",
        "year": 2016,
        "lat": 12.4352902, "lng": -69.909306,
        "address": "Winter Garden, Caya Dick Cooper front",
        "bld": 4153, "wall": 3,
        # This face runs north→south. A flip puts the jack on the viewer's left.
        # The painting fills this front wall. The short returns stay bare.
        "src": "fair-cards.jpg",
        "crop": (0.02, 0.16, 0.98, 0.98),
        "flip": True,
        "mode": "exact",
        "world_h": STOREY_H,
        "ph": 220,
        "holes": [[5.33, 0.96, 6.97, 2.50]],
        "sources": [
            "Street Art Cities marker 13095 (12.4352902, -69.909306), Caya Dick Cooper, Winter Garden, created 23 Sep 2016",
        ],
    },
    {
        "id": "bao",
        "name": "Bao Awa",
        "artist": "Ice One",
        "year": 2016,
        "lat": 12.4354631, "lng": -69.9093811,
        "address": "Caya Dick Cooper, south wall of Winter Garden",
        "bld": 4153, "wall": 6,
        "src": "fair-bao.jpg",
        "mode": "exact",
        "world_h": STOREY_H,
        "ph": 220,
        "holes": [
            [4.29, 0.96, 5.61, 2.50],
            [7.59, 0.96, 8.91, 2.50],
            [10.89, 0.96, 12.21, 2.50],
        ],
        "sources": [
            "Street Art Cities marker 13096 (12.4354631, -69.9093811), Caya Dick Cooper, created 23 Sep 2016",
        ],
    },
    {
        "id": "bobby",
        "name": "Tribute to Bobby Farrell",
        "artist": "Ives One, Sjembakkus, Beazarility",
        "year": 2016,
        "lat": 12.435754, "lng": -69.9104027,
        "address": "Bernard van de Veen Zeppenfeldstraat",
        "bld": 11551, "wall": 0,
        "src": "fair-bobby.jpg",
        # Drop the sky and the pavement. The head sits in the gap between
        # the middle and right windows. The spare wall is the mural blue.
        "crop": (0.0, 0.22, 0.98, 0.90),
        "mode": "field",
        "align": 0.70,
        "field": (10, 116, 182),
        "world_h": STOREY_H,
        "ph": 240,
        "holes": [
            [1.08, 0.96, 2.52, 2.50],
            [4.68, 0.96, 6.12, 2.50],
            [8.28, 0.96, 9.72, 2.50],
        ],
        "sources": [
            "Street Art Cities marker 13076 (12.435754, -69.9104027), Bernard van de Veen Zeppenfeldstraat, created 23 Sep 2016",
        ],
    },
    {
        "id": "busca",
        "name": "Busca Bo Mes",
        "artist": "Francis Sling",
        "year": 2016,
        "lat": 12.4353062, "lng": -69.9102505,
        "address": "ArtisA corner, Van Renselaerstraat at Zeppenfeldstraat",
        "bld": 5497, "wall": 2,
        "src": "fair-busca.jpg",
        "crop": (0.05, 0.07, 0.90, 0.62),
        # Flip puts the face toward the blank east bay, clear of the door.
        # The rest of the wall continues in the mural orange.
        "flip": True,
        "mode": "field",
        "align": 0.82,
        "field": (198, 108, 12),
        "world_h": STOREY_H,
        "ph": 220,
        "holes": [
            [1.06, 0.96, 2.47, 2.50],
            [4.58, 0.96, 5.99, 2.50],
            [8.32, 0.00, 9.31, 2.24],
        ],
        "sources": [
            "Street Art Cities marker 13082 (12.4353062, -69.9102505), pin on the ArtisA corner of Van Renselaerstraat and Zeppenfeldstraat, created 23 Sep 2016",
        ],
    },
    {
        "id": "blue",
        "name": "Blue Heaven",
        "artist": "Fio Silva",
        "year": 2016,
        "lat": 12.4352308, "lng": -69.9097698,
        "address": "Zeppenfeldstraat 9 block, Van Renselaerstraat wall of Caribbean Union",
        "bld": 4082, "wall": 5,
        "src": "fair-blue.jpg",
        "mode": "exact",
        "world_h": STOREY_H,
        "ph": 190,
        "sources": [
            "Street Art Cities marker 13089 (12.4352308, -69.9097698), Bernard van de Veen Zeppenfeldstraat 9, created 23 Sep 2016. The pin sits at the end of this long street wall.",
        ],
    },
    {
        "id": "stay",
        "name": "We Are Here To Stay",
        "artist": "SYS",
        "year": 2016,
        "lat": 12.4350178, "lng": -69.909239,
        "address": "Caya Dick Cooper",
        "bld": 4152, "wall": 3,
        "src": "fair-stay.jpg",
        "mode": "exact",
        "world_h": STOREY_H,
        "ph": 210,
        "sources": [
            "Street Art Cities marker 13094 (12.4350178, -69.909239), Caya Dick Cooper, created 23 Sep 2016",
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
        "atlas": "textures/sn_fair_atlas.jpg",
        "atlas_px": [aw, ah],
        "note": "Second San Nicolas batch. Original paintings. Public photos were visual reference only.",
        "hide_heroes": heroes_near(centers),
        "murals": murals,
    }
    OUT_JSON.write_text(json.dumps(doc, indent=1) + "\n")
    print("atlas", atlas.size, OUT_IMG.stat().st_size)
    print("heroes", doc["hide_heroes"])


if __name__ == "__main__":
    main()
