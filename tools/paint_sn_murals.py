#!/usr/bin/env python3
"""Paint an original San Nicolas mural atlas and pin each panel to an OSM wall.

Reference photos (Wikimedia Commons, Street Art Cities, the Aruba Smart Map
Play Store listing) are consulted only while drawing. Nothing from those files
is copied into the atlas.
"""
from __future__ import annotations

import json
import math
import random
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

from mural_rectify import RECTIFIED_MURAL_IDS, load_rectified_pil

ROOT = Path(__file__).resolve().parents[1]
OUT_IMG = ROOT / "game" / "textures" / "sn_mural_atlas.jpg"
OUT_JSON = ROOT / "game" / "data" / "sn_murals.json"
PAINT_SRC = ROOT / "tools" / "sn_paintings"

ZG, BG = 12.52, -69.97
XG = 111320 * math.cos(ZG * math.pi / 180)
ZG_M = 110540


def xz(lat, lng):
    return (lng - BG) * XG, -(lat - ZG) * ZG_M


def load_buildings():
    by = {}
    for name in ("r_17_21.json", "r_17_20.json", "r_16_21.json"):
        data = json.loads((ROOT / "game" / "data" / "real" / name).read_text())
        for b in data.get("b", []):
            poly = b.get("p") or []
            if len(poly) >= 3:
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
        if length < 1.2:
            continue
        # Left of a CCW edge points inward. Flip when the ring is CCW.
        lx, lz = -dz / length, dx / length
        if area > 0:
            ox, oz = -lx, -lz
        else:
            ox, oz = lx, lz
        out.append({
            "i": i, "ax": ax, "az": az, "bx": bx, "bz": bz,
            "len": length, "ox": ox, "oz": oz,
            "mx": (ax + bx) / 2, "mz": (az + bz) / 2,
        })
    return out


def project(px, pz, w):
    dx, dz = w["bx"] - w["ax"], w["bz"] - w["az"]
    L2 = dx * dx + dz * dz or 1
    t = max(0.0, min(1.0, ((px - w["ax"]) * dx + (pz - w["az"]) * dz) / L2))
    qx, qz = w["ax"] + dx * t, w["az"] + dz * t
    dist = math.hypot(px - qx, pz - qz)
    facing = (px - qx) * w["ox"] + (pz - qz) * w["oz"]
    return dist, facing, t, qx, qz


BLD = load_buildings()


def choose_wall(lat, lng, bld, wall_i=None):
    x, z = xz(lat, lng)
    b = BLD[bld]
    ws = walls_of(b)
    if wall_i is not None:
        w = next(w for w in ws if w["i"] == wall_i)
        dist, facing, t, qx, qz = project(x, z, w)
        return b, w, dist, facing, t, qx, qz
    best = None
    for w in ws:
        dist, facing, t, qx, qz = project(x, z, w)
        score = dist + (0 if facing > 0.4 else 40) - min(w["len"], 18) * 0.08
        rec = (score, b, w, dist, facing, t, qx, qz)
        if best is None or rec[0] < best[0]:
            best = rec
    return best[1:]


# id, title, artist, year, lat, lng, bld id, optional wall index,
# width m, height m, paint px, sources
SPECS = [
    {
        "id": "night_watcher",
        "name": "Night Watcher",
        "artist": "Farid Rueda",
        "year": 2016,
        "lat": 12.4357777, "lng": -69.9113945,
        "address": "Bernhardstraat 144, west wall of Korps Politie Aruba",
        "bld": 4074, "wall": 0,
        # OSM wall is red; the real facade is white where the SAC photo was taken.
        "wall_face": "#f5f3ef",
        "fill": True,
        "sharp": True,
        "wm": 15.6, "hm": 6.8,
        "pw": 1600, "ph": 700,
        "sources": [
            "Street Art Cities marker 13073 (lat 12.4357777, lng -69.9113945, Bernhardstraat 144)",
            "Wikimedia Commons File:Mural police station San Nicolas Aruba .jpeg and File:Mural police station San Nicolas Aruba16 06 35 979000.jpeg (Caribiana, CC BY-SA 4.0, camera 12.43591, -69.91149)",
        ],
    },
    {
        "id": "lionfish",
        "name": "Lion Fish",
        "artist": "Dopie",
        "year": 2017,
        "lat": 12.4348797, "lng": -69.9090145,
        "address": "Caya Dick Cooper, south wall",
        "bld": 11521, "wall": 2,
        "wm": 13.2, "hm": 3.05,
        "pw": 860, "ph": 198,
        "sources": [
            "Street Art Cities marker 13093 (lat 12.4348797, lng -69.9090145, Caya Dick Cooper)",
            "Wikimedia Commons File:Mural Lionfish Caya Dick Cooper.jpg (CC BY-SA 4.0, 12.435000, -69.909167)",
        ],
    },
    {
        "id": "turtles",
        "name": "Save the Turtles",
        "artist": "Ice One",
        "year": 2017,
        "lat": 12.4350338, "lng": -69.9102934,
        "address": "Stuyvesantstraat",
        "bld": 11587, "wall": 3,
        "wm": 10.2, "hm": 3.02,
        "pw": 780, "ph": 230,
        "sources": [
            "Street Art Cities marker 13083 (lat 12.4350338, lng -69.9102934, Stuyvesantstraat)",
            "Wikimedia Commons File:San Nicolas murals (Aruba) 23 00 09 183000.jpeg (Caribiana, CC BY-SA 4.0; described as Ice One, Stuyvesantstraat, 2017)",
        ],
    },
    {
        "id": "flamingos",
        "name": "Flamingos",
        "artist": "Graff Mapping and Richard Santana",
        "year": 2016,
        "lat": 12.4348557, "lng": -69.9098535,
        "address": "Stuyvesantstraat, the red street wall in front of the Trilax corner (the pin's own facade is buried behind this house)",
        "bld": 11591, "wall": 0,
        # This is the red wall the street camera actually sees, and it carries
        # the game's procedural ring. Cover that face edge to edge.
        "fill": True,
        "sharp": True,
        "wm": 10.0, "hm": 3.3,
        "pw": 1600, "ph": 536,
        "sources": [
            "Street Art Cities marker 13091 (lat 12.4348557, lng -69.9098535, Stuyvesantstraat). Photo on that page used as visual reference only.",
        ],
    },
    {
        "id": "iguana",
        "name": "Iguana",
        "artist": "Bordalo II",
        "year": 2016,
        "lat": 12.4346819, "lng": -69.9099513,
        "address": "Long street wall of the block the Stuyvesantstraat pin falls inside (the rendered facade on that side)",
        "bld": 11592, "wall": 0,
        "wm": 16.0, "hm": 3.3,
        "pw": 960, "ph": 198,
        "sources": [
            "Street Art Cities marker 13085 (lat 12.4346819, lng -69.9099513, Stuyvesantstraat). Photo on that page used as visual reference only.",
        ],
    },
    {
        "id": "prikichi",
        "name": "Prikichi",
        "artist": "Garrick Marchena",
        "year": 2017,
        "lat": 12.4356834, "lng": -69.9099984,
        "address": "Bargestraat / Crijnssenstraat corner, street wall",
        "bld": 11563, "wall": 0,
        "wm": 7.2, "hm": 3.05,
        "pw": 620, "ph": 262,
        "sources": [
            "Street Art Cities marker 13080 (lat 12.4356834, lng -69.9099984, Bargestraat). Photo on that page used as visual reference only.",
        ],
    },
    {
        "id": "pelican",
        "name": "Pelican",
        "artist": "Chemis",
        "year": 2017,
        "lat": 12.4357751, "lng": -69.9101472,
        "address": "Bargestraat, Customs block street wall",
        "bld": 5014, "wall": 5,
        "wm": 7.4, "hm": 3.05,
        "pw": 640, "ph": 264,
        "sources": [
            "Street Art Cities marker 13079 (lat 12.4357751, lng -69.9101472, Bargestraat). Photo on that page used as visual reference only.",
        ],
    },
    {
        "id": "boss",
        "name": "The Boss (blue iguana)",
        "artist": "WD (Wild Drawing)",
        "year": 2017,
        "lat": 12.4355315, "lng": -69.9100037,
        "address": "Bernard van de Veen Zeppenfeldstraat 9, both street faces of La Aruba #2",
        "bld": 4079,
        # Short return, then the long Zeppenfeldstraat face, one continuous painting.
        "unwrap": [0, 1],
        "base": "ground",
        # Clear of the plaster at a street angle, still behind the 0.13 m window frames.
        "lift": 0.10,
        "end_inset": 0.04,
        "sharp": True,
        # 19.50 m of facade. Stop under the flat roof at 3.4 m so the slab does not cover the painting.
        "pw": 2048, "ph": 328,
        # Shutter meshes are wider than the glass. Holes are metres from each wall start, up from the mural bottom.
        "holes": [
            {"wall": 1, "rect": [4.87, 0.68, 6.91, 2.58]},
            {"wall": 1, "rect": [12.72, 0.68, 14.76, 2.58]},
        ],
        "sources": [
            "Street Art Cities marker 13081 (lat 12.4355315, lng -69.9100037, B. v/d Veen Zeppenfeldstraat 9). Photo on that page used as visual reference only.",
        ],
    },
    {
        "id": "alice",
        "name": "Miss Alice",
        "artist": "Odeith",
        "year": 2017,
        "lat": 12.4344049, "lng": -69.9093784,
        "address": "Bernard van de Veen Zeppenfeldstraat 21, Alankar block",
        "bld": 4083, "wall": 1,
        "wm": 12.8, "hm": 3.05,
        "pw": 820, "ph": 196,
        "sources": [
            "Street Art Cities marker 13092 (lat 12.4344049, lng -69.9093784, B. v/d Veen Zeppenfeldstraat 21). Photo on that page used as visual reference only.",
        ],
    },
    {
        "id": "melting_pot",
        "name": "Melting Pot",
        "artist": "Armando Goedgedrag",
        "year": 2022,
        "lat": 12.436172, "lng": -69.911256,
        "address": "Bernhardstraat, low street wall beside Sam's, opposite the police-station block",
        "bld": 11606, "wall": 0,
        "wm": 14.6, "hm": 3.05,
        "pw": 876, "ph": 183,
        "sources": [
            "Wikimedia Commons File:San Nicolas Murals.jpeg (CC BY-SA 4.0). Description: Melting Pot by Armando Goedgedrag, Bernhardstraat opposite the police station. Camera 12.436172, -69.911256.",
        ],
    },
    {
        "id": "mujer_azul",
        "name": "Mujer Azul",
        "artist": "Lina Arias",
        "year": 2018,
        "lat": 12.435077, "lng": -69.9100802,
        "address": "Van Renselaerstraat 2, the Emporium face the street sees (the address wall is hidden behind Jewelenhuisje)",
        "bld": 4081, "wall": 0,
        # This face carries the procedural blue ring. The portrait covers it.
        "fill": True,
        "sharp": True,
        "wm": 10.0, "hm": 3.3,
        # Full wall. The figure stays centered; bright cyan runs to the edges.
        "pw": 2048, "ph": 684,
        "sources": [
            "Street Art Cities marker 13086 (lat 12.435077, lng -69.9100802, van Renselaerstraat 2)",
            "Wikimedia Commons File:Mural art in and around Mainstreet, San Nicolas Aruba 07.jpg (CC0, same headdress portrait)",
        ],
    },
    {
        "id": "nothing_to_declare",
        "name": "Nothing to Declare",
        "artist": "Leon Keer",
        "year": 2016,
        "lat": 12.4358289, "lng": -69.9103532,
        "address": "B. v/d Veen Zeppenfeldstraat, beside the Uncle Louis block",
        "bld": 11550, "wall": 0,
        "wm": 4.6, "hm": 3.05,
        "pw": 460, "ph": 305,
        "sources": [
            "Street Art Cities marker 13075 (lat 12.4358289, lng -69.9103532)",
            "Wikimedia Commons File:Mural Harina Pan.jpg (CC BY-SA 4.0, camera 12.435833, -69.910278; described as Leon Keer 2016 on B. v/d Veen Zeppenfeldstraat next to Uncle Louis Store)",
        ],
    },
]


def rng(seed):
    return random.Random(seed)


def grain(im, amount, seed):
    r = rng(seed)
    px = im.load()
    w, h = im.size
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            j = r.randint(-amount, amount)
            for dy in (0, 1):
                for dx in (0, 1):
                    if x + dx >= w or y + dy >= h:
                        continue
                    p = px[x + dx, y + dy]
                    px[x + dx, y + dy] = tuple(max(0, min(255, c + j)) for c in p[:3])


def wash(draw, box, c1, c2, steps=18):
    x0, y0, x1, y1 = box
    for i in range(steps):
        t = i / max(1, steps - 1)
        c = tuple(int(c1[k] + (c2[k] - c1[k]) * t) for k in range(3))
        yy0 = int(y0 + (y1 - y0) * i / steps)
        yy1 = int(y0 + (y1 - y0) * (i + 1) / steps) + 1
        draw.rectangle([x0, yy0, x1, yy1], fill=c)


def paint_night(w, h):
    """Farid Rueda owl (SAC 13073). Hand-painted; refs/murals/night_watcher/ for verification only."""
    im = Image.new("RGB", (w, h), (248, 248, 246))
    d = ImageDraw.Draw(im, "RGBA")
    wash(d, (0, 0, w, h), (252, 252, 250), (238, 236, 228))
    r = rng(21)
    for _ in range(70):
        x, y = r.randint(0, w), r.randint(0, h)
        rad = r.randint(10, 48)
        d.ellipse([x - rad, y - rad, x + rad, y + rad], fill=(228, 216, 192, 36))
    # dark skirting, as on the station wall
    d.rectangle([0, int(h * 0.915), w, h], fill=(36, 34, 32))
    d.rectangle([0, int(h * 0.905), w, int(h * 0.92)], fill=(78, 74, 68))

    side = h * 0.92
    cx, cy = w * 0.50, h * 0.43

    def P(x, y):
        return (cx + x * side, cy + y * side)

    # faint wreath
    d.ellipse([*P(-0.62, -0.58), *P(0.62, 0.62)], outline=(170, 190, 180, 90), width=max(2, h // 180))
    d.arc([*P(-0.70, -0.66), *P(0.70, 0.66)], 200, 340, fill=(150, 176, 168, 80), width=max(2, h // 200))

    def tuft(sign, cols):
        d.polygon([P(sign * 0.18, -0.10), P(sign * 0.52, -0.62), P(sign * 0.08, -0.32)], fill=cols[0])
        d.polygon([P(sign * 0.22, -0.16), P(sign * 0.46, -0.52), P(sign * 0.16, -0.30)], fill=cols[1])
        d.polygon([P(sign * 0.28, -0.22), P(sign * 0.40, -0.46), P(sign * 0.24, -0.34)], fill=cols[2])
        for i in range(4):
            yy = -0.22 - i * 0.08
            x0, y0 = P(sign * 0.30, yy)
            x1, y1 = P(sign * 0.38, yy + 0.05)
            d.ellipse([min(x0, x1), min(y0, y1), max(x0, x1), max(y0, y1)], outline=cols[3], width=2)

    tuft(-1, ((32, 96, 78), (196, 164, 52), (48, 70, 120), (230, 210, 120)))
    tuft(1, ((48, 78, 64), (120, 96, 48), (70, 48, 90), (210, 180, 90)))

    # mandala discs behind the petals
    for rad, col in (
        (0.50, (28, 120, 132, 210)),
        (0.40, (92, 64, 150, 200)),
        (0.30, (36, 108, 118, 190)),
    ):
        d.ellipse([*P(-rad, -rad * 0.96), *P(rad, rad * 0.96)], fill=col)

    palette = (
        (42, 150, 168), (150, 84, 176), (36, 110, 128),
        (210, 150, 70), (70, 80, 170), (90, 170, 150),
        (180, 90, 140), (40, 90, 110),
    )
    for i in range(18):
        a0 = -math.pi * 0.92 + i * (math.pi * 1.84 / 18)
        a1 = a0 + 0.16
        rad = 0.36 + (i % 3) * 0.045
        col = palette[i % len(palette)]
        mid = (a0 + a1) / 2
        tip = rad + 0.06
        pts = [
            P(math.cos(a0) * rad * 0.55, math.sin(a0) * rad * 0.55),
            P(math.cos(a0) * rad, math.sin(a0) * rad),
            P(math.cos(mid) * tip, math.sin(mid) * tip),
            P(math.cos(a1) * rad, math.sin(a1) * rad),
        ]
        d.polygon(pts, fill=col + (230,))
        d.line([pts[1], pts[2], pts[3]], fill=(255, 255, 255, 70), width=2)
        # inner leaf mark
        inner = 0.22 + (i % 2) * 0.04
        d.polygon([
            P(math.cos(mid) * 0.12, math.sin(mid) * 0.12),
            P(math.cos(mid - 0.08) * inner, math.sin(mid - 0.08) * inner),
            P(math.cos(mid + 0.08) * inner, math.sin(mid + 0.08) * inner),
        ], fill=palette[(i + 3) % len(palette)] + (180,))

    # brow feathers between the eyes
    d.polygon([P(0, -0.34), P(0.10, -0.08), P(0, 0.02), P(-0.10, -0.08)], fill=(48, 170, 168))
    d.polygon([P(0, -0.26), P(0.045, -0.10), P(0, -0.02), P(-0.045, -0.10)], fill=(230, 190, 80))

    def eye(sx):
        ex, ey = cx + sx * side, cy - 0.02 * side
        rw, rh = side * 0.115, side * 0.145
        d.ellipse([ex - rw * 1.25, ey - rh * 1.2, ex + rw * 1.25, ey + rh * 1.15], fill=(24, 20, 28))
        d.ellipse([ex - rw, ey - rh, ex + rw, ey + rh], fill=(236, 228, 210))
        d.pieslice([ex - rw, ey - rh, ex + rw, ey + rh], 200, 340, fill=(48, 40, 36))
        d.ellipse([ex - rw * 0.42, ey - rh * 0.15, ex + rw * 0.38, ey + rh * 0.55], fill=(28, 22, 20))
        d.ellipse([ex - rw * 0.55, ey - rh * 0.72, ex - rw * 0.05, ey - rh * 0.15], fill=(255, 255, 255, 200))

    eye(-0.145)
    eye(0.145)

    # teal beak diamond
    d.polygon([P(0, 0.02), P(0.07, 0.16), P(0, 0.46), P(-0.07, 0.16)], fill=(28, 168, 166))
    d.polygon([P(0, 0.08), P(0.035, 0.18), P(0, 0.30), P(-0.035, 0.18)], fill=(214, 168, 64))
    d.polygon([P(0, 0.14), P(0.015, 0.20), P(0, 0.26), P(-0.015, 0.20)], fill=(120, 40, 90))
    # cheek petals
    for sign, col in ((-1, (150, 80, 170)), (1, (70, 110, 190))):
        d.polygon([
            P(sign * 0.16, 0.08), P(sign * 0.34, 0.02),
            P(sign * 0.30, 0.18), P(sign * 0.12, 0.16),
        ], fill=col)

    # purple moustache drips under the beak
    d.line([P(-0.28, 0.22), P(-0.08, 0.48), P(0.22, 0.32)], fill=(110, 70, 180), width=max(3, h // 90))
    d.line([P(-0.16, 0.40), P(0.26, 0.50)], fill=(80, 70, 170), width=max(2, h // 120))
    d.polygon([P(0, 0.46), P(0.04, 0.58), P(-0.02, 0.62), P(-0.05, 0.50)], fill=(90, 60, 160))
    grain(im, 8, 3)
    return im


def paint_lion(w, h):
    """DOPIE lionfish (SAC 13093). Flat black field + fish only — no building windows or sky."""
    im = Image.new("RGB", (w, h), (8, 8, 10))
    d = ImageDraw.Draw(im, "RGBA")
    # fins left
    cols_l = [(40, 170, 160), (70, 190, 120), (230, 170, 60), (40, 140, 180)]
    for i, col in enumerate(cols_l):
        y0 = h * (0.08 + i * 0.2)
        d.polygon([(w * 0.46, h * 0.48), (w * 0.04, y0), (w * 0.08, y0 + h * 0.16), (w * 0.42, h * 0.55)], fill=col)
    cols_r = [(230, 150, 40), (210, 90, 40), (180, 60, 50), (240, 190, 80), (160, 70, 40)]
    for i, col in enumerate(cols_r):
        y0 = h * (0.06 + i * 0.16)
        d.polygon([(w * 0.56, h * 0.46), (w * 0.98, y0), (w * 0.96, y0 + h * 0.12), (w * 0.58, h * 0.58)], fill=col)
        # fin eyes
        d.ellipse([w * 0.86, y0 + h * 0.02, w * 0.92, y0 + h * 0.09], outline=(30, 20, 16), width=2)
    # head
    d.ellipse([w * 0.34, h * 0.08, w * 0.68, h * 0.92], fill=(168, 72, 88))
    d.ellipse([w * 0.40, h * 0.16, w * 0.62, h * 0.84], fill=(214, 118, 98))
    for i in range(9):
        yy = h * (0.18 + i * 0.075)
        col = (120, 40, 90) if i % 2 == 0 else (70, 28, 72)
        d.arc([w * 0.38, yy, w * 0.64, yy + h * 0.11], 200, 340, fill=col, width=max(3, h // 80))
    d.polygon([(w * 0.44, h * 0.20), (w * 0.58, h * 0.22), (w * 0.56, h * 0.34), (w * 0.46, h * 0.32)], fill=(240, 200, 80))
    d.ellipse([w * 0.44, h * 0.28, w * 0.52, h * 0.48], outline=(20, 140, 150), width=4)
    d.ellipse([w * 0.52, h * 0.30, w * 0.60, h * 0.48], outline=(20, 130, 160), width=4)
    d.ellipse([w * 0.46, h * 0.34, w * 0.50, h * 0.42], fill=(230, 240, 220))
    d.polygon([(w * 0.46, h * 0.78), (w * 0.56, h * 0.78), (w * 0.52, h * 0.92)], fill=(230, 226, 214))
    d.text((w * 0.72, h * 0.88), "DOPIE", fill=(120, 60, 160))
    grain(im, 8, 11)
    return im


def paint_turtles(w, h):
    im = Image.new("RGB", (w, h), (40, 186, 196))
    d = ImageDraw.Draw(im, "RGBA")
    wash(d, (0, 0, w, h), (56, 198, 206), (18, 140, 168))
    # block courses
    for y in range(0, h, 18):
        d.line([(0, y), (w, y)], fill=(255, 255, 255, 28), width=1)
    def turtle(x, y, s, flip=1):
        d.ellipse([x - 46 * s, y - 16 * s, x + 50 * s, y + 22 * s], fill=(214, 176, 70))
        d.ellipse([x - 28 * s, y - 10 * s, x + 30 * s, y + 16 * s], fill=(86, 140, 60))
        d.polygon([(x + 48 * s * flip, y), (x + 78 * s * flip, y - 10 * s), (x + 70 * s * flip, y + 8 * s)], fill=(70, 120, 60))
        d.ellipse([x - 62 * s, y - 22 * s, x - 28 * s, y + 6 * s], fill=(196, 160, 70))
        d.ellipse([x - 58 * s, y - 16 * s, x - 40 * s, y - 2 * s], fill=(40, 30, 20))
        d.ellipse([x - 20 * s, y + 8 * s, x + 6 * s, y + 28 * s], fill=(180, 140, 60))
        d.ellipse([x + 16 * s, y + 6 * s, x + 40 * s, y + 26 * s], fill=(170, 130, 50))
    turtle(w * 0.22, h * 0.62, h / 90)
    turtle(w * 0.55, h * 0.48, h / 100)
    turtle(w * 0.82, h * 0.40, h / 120, flip=-1)
    # window hole suggestion
    d.rectangle([w * 0.30, h * 0.08, w * 0.48, h * 0.28], fill=(20, 90, 100))
    grain(im, 9, 5)
    return im


def paint_flamingo(w, h):
    """Graffmapping flamingo (SAC 13091). Painted field only — no lamp post, sky, or real window openings."""
    im = Image.new("RGB", (w, h), (48, 176, 196))
    d = ImageDraw.Draw(im, "RGBA")
    # faceted field, left to right, full height above the shutters
    shut = int(h * 0.78)
    cols = [
        (214, 48, 64), (64, 186, 86), (36, 176, 196), (244, 196, 48),
        (240, 112, 36), (36, 96, 186), (196, 48, 140), (120, 200, 70),
        (40, 160, 200), (250, 150, 40), (70, 90, 190), (220, 70, 80),
    ]
    n = 14
    for i in range(n):
        x0 = w * i / n
        x1 = w * (i + 1) / n
        xm = (x0 + x1) / 2
        col = cols[i % len(cols)]
        if i % 2 == 0:
            d.polygon([(x0, 0), (x1, 0), (xm, shut)], fill=col)
            d.polygon([(x0, shut), (x1, shut), (xm, int(shut * 0.35))], fill=cols[(i + 5) % len(cols)])
        else:
            d.polygon([(x0, 0), (x1, 0), (x0, shut * 0.55), (xm, shut)], fill=col)
            d.polygon([(x1, 0), (x1, shut), (xm, shut)], fill=cols[(i + 3) % len(cols)])
    # a few overlapping accent triangles so it is not a single row of wedges
    accents = [
        (0.02, 0.05, 0.22, 0.0, 0.08, 0.55, (250, 220, 60)),
        (0.18, 0.0, 0.36, 0.08, 0.12, 0.42, (40, 80, 180)),
        (0.55, 0.0, 0.78, 0.0, 0.70, 0.48, (120, 210, 80)),
        (0.72, 0.05, 0.98, 0.0, 0.88, 0.50, (240, 90, 40)),
        (0.84, 0.20, 1.0, 0.55, 0.90, 0.75, (30, 140, 190)),
    ]
    for a, b, c, e, f, g, col in accents:
        d.polygon([(w * a, h * b), (w * c, h * e), (w * f, h * g)], fill=col)

    # neck rising on the left into a huge head facing right
    d.polygon([
        (w * 0.02, shut), (w * 0.10, h * 0.42), (w * 0.22, h * 0.18),
        (w * 0.34, h * 0.10), (w * 0.28, h * 0.55), (w * 0.12, shut),
    ], fill=(176, 28, 58))
    d.polygon([
        (w * 0.08, h * 0.50), (w * 0.20, h * 0.22), (w * 0.30, h * 0.16),
        (w * 0.24, h * 0.48),
    ], fill=(214, 60, 86))

    # head
    d.ellipse([w * 0.22, h * 0.04, w * 0.62, h * 0.72], fill=(196, 36, 64))
    d.ellipse([w * 0.30, h * 0.10, w * 0.58, h * 0.58], fill=(224, 72, 96))
    # cheek highlight
    d.ellipse([w * 0.34, h * 0.22, w * 0.52, h * 0.48], fill=(236, 120, 130, 140))
    # crown curve
    d.pieslice([w * 0.26, h * 0.02, w * 0.58, h * 0.36], 200, 340, fill=(160, 24, 52))

    # eye — large enough to read from the street
    ex, ey = w * 0.40, h * 0.26
    ew, eh = w * 0.045, h * 0.16
    d.ellipse([ex - ew, ey - eh, ex + ew, ey + eh], fill=(250, 214, 60))
    d.ellipse([ex - ew * 0.45, ey - eh * 0.45, ex + ew * 0.42, ey + eh * 0.42], fill=(18, 16, 16))
    d.ellipse([ex - ew * 0.35, ey - eh * 0.55, ex - ew * 0.02, ey - eh * 0.1], fill=(255, 255, 255))

    # hooked black beak pointing down-right
    d.polygon([
        (w * 0.50, h * 0.30), (w * 0.78, h * 0.42), (w * 0.74, h * 0.62),
        (w * 0.66, h * 0.78), (w * 0.58, h * 0.58), (w * 0.48, h * 0.46),
    ], fill=(22, 20, 24))
    d.line([(w * 0.52, h * 0.36), (w * 0.70, h * 0.50), (w * 0.64, h * 0.66)], fill=(180, 176, 170), width=max(2, h // 80))
    # beak base where it meets the face
    d.polygon([
        (w * 0.46, h * 0.32), (w * 0.56, h * 0.34), (w * 0.52, h * 0.48), (w * 0.44, h * 0.44),
    ], fill=(236, 228, 220))

    # roller shutters (painted band on the real wall)
    d.rectangle([0, shut, w, h], fill=(232, 232, 230))
    d.rectangle([0, shut, w, shut + max(3, h // 40)], fill=(190, 192, 194))
    step = max(8, w // 140)
    for x in range(0, w, step):
        d.line([(x, shut + 4), (x, h - 2)], fill=(176, 176, 174), width=2)
    # a couple of shutter seams
    for x in (0.33, 0.66):
        d.line([(w * x, shut), (w * x, h)], fill=(150, 150, 148), width=3)
    grain(im, 6, 9)
    return im


def paint_iguana(w, h):
    im = Image.new("RGB", (w, h), (176, 96, 36))
    d = ImageDraw.Draw(im, "RGBA")
    wash(d, (0, 0, w, h), (196, 112, 42), (120, 64, 28))
    # body scraps
    d.polygon([
        (w * 0.18, h * 0.42), (w * 0.62, h * 0.38), (w * 0.70, h * 0.55),
        (w * 0.40, h * 0.62), (w * 0.16, h * 0.58),
    ], fill=(48, 150, 60))
    d.polygon([(w * 0.62, h * 0.42), (w * 0.96, h * 0.28), (w * 0.98, h * 0.40), (w * 0.66, h * 0.52)], fill=(36, 130, 48))
    # head
    d.polygon([(w * 0.08, h * 0.28), (w * 0.28, h * 0.22), (w * 0.30, h * 0.42), (w * 0.10, h * 0.46)], fill=(70, 78, 64))
    d.ellipse([w * 0.20, h * 0.26, w * 0.26, h * 0.34], fill=(230, 200, 40))
    d.ellipse([w * 0.225, h * 0.285, w * 0.245, h * 0.32], fill=(10, 10, 10))
    # legs
    for x, y in ((0.22, 0.58), (0.40, 0.60), (0.55, 0.58)):
        d.polygon([(w * x, h * y), (w * (x + 0.08), h * (y + 0.16)), (w * (x + 0.02), h * (y + 0.2)), (w * (x - 0.04), h * (y + 0.06))], fill=(30, 120, 46))
    # dewlap / spikes
    for i in range(8):
        x = w * (0.22 + i * 0.05)
        d.polygon([(x, h * 0.36), (x + 8, h * 0.28), (x + 14, h * 0.38)], fill=(20, 90, 36))
    grain(im, 12, 4)
    return im


def paint_prikichi(w, h):
    im = Image.new("RGB", (w, h), (150, 206, 224))
    d = ImageDraw.Draw(im, "RGBA")
    wash(d, (0, 0, w, h), (186, 224, 234), (110, 176, 206))
    # parrot
    d.ellipse([w * 0.28, h * 0.08, w * 0.78, h * 0.95], fill=(46, 150, 70))
    d.ellipse([w * 0.48, h * 0.05, w * 0.86, h * 0.55], fill=(70, 170, 78))
    d.polygon([(w * 0.62, h * 0.18), (w * 0.92, h * 0.28), (w * 0.66, h * 0.40)], fill=(70, 64, 58))
    d.ellipse([w * 0.58, h * 0.12, w * 0.70, h * 0.32], fill=(240, 230, 80))
    d.ellipse([w * 0.62, h * 0.18, w * 0.67, h * 0.28], fill=(16, 16, 16))
    d.polygon([(w * 0.22, h * 0.7), (w * 0.55, h * 0.55), (w * 0.7, h * 0.95), (w * 0.3, h * 0.98)], fill=(120, 78, 40))
    # red script blocks (not the real lettering)
    for i, yy in enumerate((0.12, 0.22, 0.32)):
        d.rectangle([w * 0.05, h * yy, w * 0.24, h * yy + h * 0.06], fill=(170, 40, 36))
    grain(im, 8, 6)
    return im


def paint_pelican(w, h):
    im = Image.new("RGB", (w, h), (214, 216, 214))
    d = ImageDraw.Draw(im, "RGBA")
    d.rectangle([0, h * 0.42, w, h], fill=(186, 190, 192))
    # barrel
    d.ellipse([w * 0.18, h * 0.48, w * 0.62, h * 0.98], fill=(20, 92, 190))
    d.ellipse([w * 0.48, h * 0.50, w * 0.90, h * 0.98], fill=(16, 78, 176))
    d.rectangle([w * 0.55, h * 0.62, w * 0.84, h * 0.78], fill=(230, 190, 30))
    # bird
    d.ellipse([w * 0.22, h * 0.08, w * 0.62, h * 0.62], fill=(48, 56, 64))
    d.polygon([(w * 0.18, h * 0.28), (w * 0.02, h * 0.48), (w * 0.28, h * 0.42)], fill=(220, 70, 40))
    d.polygon([(w * 0.08, h * 0.36), (w * 0.0, h * 0.42), (w * 0.16, h * 0.44)], fill=(230, 200, 70))
    d.ellipse([w * 0.30, h * 0.12, w * 0.42, h * 0.30], fill=(230, 210, 70))
    d.ellipse([w * 0.34, h * 0.17, w * 0.39, h * 0.26], fill=(20, 20, 20))
    grain(im, 7, 8)
    return im


def paint_boss(w, h):
    """WD iguana across both street faces: cream swirls, water band, red pillars."""
    # Facade is ~19.5 m wide and ~3.88 m tall. The ground-floor water is a fixed band.
    water_m, height_m = 0.96, 19.495 * h / w
    scale = 2
    W, H = w * scale, h * scale
    rng = np.random.default_rng(11)
    base = np.zeros((H, W, 3), np.int16)
    base[:] = (234, 212, 174)
    base += rng.integers(-10, 11, size=base.shape, dtype=np.int16)
    im = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), "RGB")

    def ring(box, inset, fill):
        mask = Image.new("L", im.size, 0)
        od = ImageDraw.Draw(mask)
        od.ellipse(box, fill=255)
        x0, y0, x1, y1 = box
        od.ellipse([x0 + inset, y0 + inset, x1 - inset, y1 - inset], fill=0)
        col = Image.new("RGBA", im.size, fill)
        im.paste(col, mask=mask)

    ring((-400, -700, 1900, 1700), 300, (16, 88, 114, 255))
    ring((600, -900, 3100, 1800), 340, (22, 108, 136, 255))
    ring((1500, -500, 4000, 1700), 280, (12, 72, 100, 255))
    ring((2300, -300, 4700, 1600), 320, (26, 116, 146, 230))
    ring((100, 80, 2500, 2000), 360, (8, 62, 88, 170))
    ring((80, -250, 1600, 980), 200, (230, 208, 170, 255))

    water_top = int((height_m - water_m) / height_m * H)
    d = ImageDraw.Draw(im, "RGBA")
    span = max(1, H - water_top)
    for i, y in enumerate(range(water_top, H)):
        t = i / span
        d.line([(0, y), (W, y)], fill=(int(18 + 36 * t), int(128 - 48 * t), int(198 - 28 * t), 255))
    for k, amp, col in ((0, 16, (220, 240, 248, 190)), (36, 11, (150, 205, 228, 150)), (64, 20, (236, 248, 255, 170))):
        pts = []
        for x in range(0, W, 8):
            y = water_top + 28 + k + int(math.sin(x * 0.018 + k) * amp + math.sin(x * 0.006) * amp * 0.35)
            pts.append((x, min(H - 1, y)))
        d.line(pts, fill=col, width=4)
    beam = max(8, int(0.15 / height_m * H))
    d.rectangle([0, water_top - beam // 2, W, water_top + beam // 2], fill=(176, 32, 40, 255))
    pillar_w = max(8, int(0.22 / height_m * H))
    spacing = 1.65 / (19.495) * W
    x = spacing * 0.4
    while x < W:
        d.rectangle([x, water_top, x + pillar_w, H], fill=(166, 26, 34, 255))
        x += spacing

    bg = im.resize((w, h), Image.Resampling.LANCZOS)
    raw = np.asarray(Image.open(PAINT_SRC / "boss.jpg").convert("RGB"))
    crop = raw[:552]
    r, g, b = [crop[:, :, i].astype(np.int16) for i in range(3)]
    cream = (r > 165) & (g > 145) & (b > 125) & (r + 12 >= g) & (r + 8 >= b) & (g > 90)
    alpha = Image.fromarray(np.where(cream, 0, 255).astype(np.uint8), "L")
    alpha = alpha.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
    sprite = Image.fromarray(np.dstack([crop, np.asarray(alpha)]), "RGBA")
    beam_y = water_top // scale
    ig_h = max(8, beam_y - 6)
    ig_w = int(ig_h * sprite.size[0] / sprite.size[1] * 1.62)
    sprite = sprite.resize((ig_w, ig_h), Image.Resampling.LANCZOS)
    sp = np.array(sprite)
    fade = min(80, ig_w // 8)
    ramp = np.linspace(1, 0, fade, dtype=np.float32)
    sp[:, -fade:, 3] = (sp[:, -fade:, 3].astype(np.float32) * ramp).astype(np.uint8)
    bg.paste(Image.fromarray(sp, "RGBA"), (6, max(0, beam_y - ig_h + 8)), Image.fromarray(sp, "RGBA"))
    return bg


def paint_alice(w, h):
    im = Image.new("RGB", (w, h), (64, 168, 186))
    d = ImageDraw.Draw(im, "RGBA")
    d.polygon([(0, 0), (w * 0.62, 0), (w * 0.4, h), (0, h)], fill=(48, 156, 176))
    d.polygon([(w * 0.45, 0), (w, 0), (w, h), (w * 0.55, h)], fill=(214, 140, 110))
    d.polygon([(w * 0.15, h * 0.35), (w * 0.85, h * 0.55), (w * 0.7, h), (0, h * 0.7)], fill=(186, 48, 110, 160))
    # face
    d.ellipse([w * 0.22, h * 0.02, w * 0.62, h * 0.78], fill=(36, 120, 150))
    d.ellipse([w * 0.30, h * 0.18, w * 0.55, h * 0.55], fill=(20, 24, 28))
    d.ellipse([w * 0.33, h * 0.24, w * 0.42, h * 0.48], fill=(210, 230, 220))
    d.ellipse([w * 0.44, h * 0.24, w * 0.53, h * 0.48], fill=(210, 230, 220))
    d.arc([w * 0.36, h * 0.48, w * 0.52, h * 0.68], 20, 160, fill=(120, 50, 40), width=3)
    # hands
    d.ellipse([w * 0.28, h * 0.58, w * 0.78, h * 0.98], fill=(176, 96, 64))
    d.ellipse([w * 0.48, h * 0.62, w * 0.92, h * 0.99], fill=(160, 84, 56))
    d.ellipse([w * 0.58, h * 0.7, w * 0.66, h * 0.84], fill=(180, 40, 36))
    grain(im, 8, 12)
    return im


def paint_flowers(w, h):
    im = Image.new("RGB", (w, h), (28, 48, 36))
    d = ImageDraw.Draw(im, "RGBA")
    def bloom(cx, cy, rad, cols):
        for i, c in enumerate(cols):
            a = i * (math.pi * 2 / len(cols))
            x = cx + math.cos(a) * rad * 0.45
            y = cy + math.sin(a) * rad * 0.45
            d.ellipse([x - rad * 0.55, y - rad * 0.38, x + rad * 0.55, y + rad * 0.38], fill=c)
        d.ellipse([cx - rad * 0.22, cy - rad * 0.22, cx + rad * 0.22, cy + rad * 0.22], fill=(230, 190, 40))
    bloom(w * 0.16, h * 0.62, min(h, w * 0.16) * 0.95, [(230, 190, 30), (240, 210, 60), (200, 150, 20), (250, 220, 80), (180, 120, 20), (255, 230, 120)])
    bloom(w * 0.38, h * 0.42, min(h, w * 0.18), [(236, 236, 232), (220, 40, 50), (180, 20, 40), (240, 80, 70), (255, 220, 80)])
    bloom(w * 0.62, h * 0.55, min(h, w * 0.17), [(150, 50, 140), (220, 120, 160), (240, 90, 50), (180, 70, 120), (255, 160, 70)])
    bloom(w * 0.86, h * 0.40, min(h, w * 0.15), [(120, 70, 170), (180, 100, 190), (80, 40, 140), (230, 140, 80)])
    # stamens
    for x in (0.40, 0.44, 0.48):
        d.line([(w * x, h * 0.2), (w * x, h * 0.55)], fill=(20, 16, 16), width=2)
        d.ellipse([w * x - 3, h * 0.18, w * x + 3, h * 0.24], fill=(10, 10, 10))
    grain(im, 8, 15)
    return im


def _reflect_pad(fitted, w, band):
    """Continue the painting past its edges by reflecting a narrow strip, so arms and plaster meet with no seam."""
    import numpy as np
    arr = np.asarray(fitted)
    h, nw, _ = arr.shape
    if nw >= w:
        return fitted.resize((w, h), Image.Resampling.LANCZOS)
    left = (w - nw) // 2
    right = w - nw - left

    def pad(edge, need, touch_on_right):
        parts = []
        flip = True
        while need > 0:
            piece = edge[:, ::-1] if flip else edge
            if piece.shape[1] > need:
                piece = piece[:, -need:] if touch_on_right else piece[:, :need]
            parts.append(piece)
            need -= piece.shape[1]
            flip = not flip
        if touch_on_right:
            parts.reverse()
        return np.concatenate(parts, axis=1)

    band = max(8, min(band, nw // 3))
    left_pad = pad(arr[:, :band], left, True)
    right_pad = pad(arr[:, nw - band:], right, False)
    out = np.concatenate([left_pad, arr, right_pad], axis=1)
    return Image.fromarray(out, "RGB")


def _bright_cyan(arr):
    """Push the wall field toward the sunlit reference cyan. Leave the figure alone."""
    src = arr.astype(np.float32)
    corner = src[6, 6]
    dist = np.linalg.norm(src - corner, axis=2)
    bg = dist < 54
    target = np.array([40.0, 232.0, 244.0], np.float32)
    mix = src * 0.18 + target * 0.82
    out = src.copy()
    out[bg] = mix[bg]
    return np.clip(out, 0, 255).astype(np.uint8)


def paint_mujer(w, h):
    """Centered portrait. Arms bend down to the lower corners and span about 60% of the wall."""
    src = Image.open(PAINT_SRC / "mujer_azul.jpg").convert("RGB")
    fitted_w = max(1, int(round(h * src.size[0] / src.size[1])))
    fitted = np.asarray(src.resize((fitted_w, h), Image.Resampling.LANCZOS))
    fitted = _bright_cyan(fitted)
    field = tuple(int(c) for c in _bright_cyan(np.asarray(src.resize((32, 32), Image.Resampling.BOX)))[2, 2])
    tile = np.empty((h, w, 3), np.uint8)
    tile[:] = field
    rng = np.random.default_rng(4)
    tile = np.clip(tile.astype(np.int16) + rng.integers(-5, 6, size=(h, w, 1)), 0, 255).astype(np.uint8)
    left = (w - fitted_w) / 2
    mid = (w - 1) / 2.0
    # The painting's forearms are the wide part. Open that band so the hands
    # land near 60% of this wall, and leave the face at its painted width.
    # 0.693 is the widest content row of the source, as a fraction of the panel.
    yn = np.linspace(0.0, 1.0, h)
    t = np.clip((yn - 0.56) / 0.16, 0.0, 1.0)
    t = t * t * (3.0 - 2.0 * t)
    base_span = 0.693 * fitted_w / w
    scale = 1.0 + t * (0.60 / max(base_span, 0.05) - 1.0)
    xs = np.arange(w, dtype=np.float32)
    for y in range(h):
        src_x = (mid + (xs - mid) / scale[y]) - left
        valid = (src_x >= 0) & (src_x <= fitted_w - 1)
        sx = np.clip(src_x, 0, fitted_w - 1)
        x0 = np.floor(sx).astype(np.int32)
        x1 = np.minimum(x0 + 1, fitted_w - 1)
        f = (sx - x0)[:, None]
        samp = fitted[y, x0] * (1 - f) + fitted[y, x1] * f
        row = tile[y].astype(np.float32)
        row[valid] = samp[valid]
        tile[y] = np.clip(row, 0, 255).astype(np.uint8)
    return Image.fromarray(tile, "RGB")


def paint_declare(w, h):
    """Nothing to declare / P.A.N. cornmeal box (SAC 13075). Hand-painted flat box face — no people or sky."""
    im = Image.new("RGB", (w, h), (168, 128, 88))
    d = ImageDraw.Draw(im, "RGBA")
    wash(d, (0, 0, w, h), (194, 150, 102), (132, 96, 62))
    # corrugated cardboard bands
    for y in range(0, h, max(6, h // 48)):
        d.line([(0, y), (w, y)], fill=(148, 108, 72, 40), width=1)
    # main panel
    d.rectangle([w * 0.08, h * 0.06, w * 0.94, h * 0.94], fill=(178, 132, 92))
    d.rectangle([w * 0.10, h * 0.08, w * 0.92, h * 0.92], outline=(110, 78, 48), width=max(2, w // 200))
    # folded top flap shadow
    d.polygon([
        (w * 0.10, h * 0.08), (w * 0.92, h * 0.08), (w * 0.88, h * 0.16), (w * 0.14, h * 0.16),
    ], fill=(140, 100, 68))
    # teal P.A.N. oval
    ox0, oy0, ox1, oy1 = w * 0.52, h * 0.22, w * 0.88, h * 0.62
    d.ellipse([ox0, oy0, ox1, oy1], fill=(24, 118, 108))
    d.ellipse([ox0 + w * 0.01, oy0 + h * 0.01, ox1 - w * 0.01, oy1 - h * 0.01], outline=(18, 90, 82), width=3)
    # P.A.N. lettering
    try:
        from PIL import ImageFont
        font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", max(18, int(h * 0.11)))
        small = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", max(10, int(h * 0.028)))
    except OSError:
        font = small = None
    cx, cy = (ox0 + ox1) / 2, (oy0 + oy1) / 2
    for ch, dx, col in (("P", -0.11, (248, 210, 60)), (".", -0.02, (248, 210, 60)), ("A", 0.06, (248, 180, 50)), (".", 0.14, (248, 180, 50)), ("N", 0.24, (240, 150, 40))):
        d.text((cx + w * dx, cy - h * 0.05), ch, fill=col, font=font, anchor="mm")
    # vertical product text
    lines = [
        "PRE-COOKED",
        "WHITE CORN",
        "MAIZ BLANCO",
        "PRECOCIDA",
        "10x100 g",
    ]
    ty = h * 0.20
    for line in lines:
        d.text((w * 0.14, ty), line, fill=(28, 24, 20), font=small)
        ty += h * 0.055
    # barcode block
    bx0, by0 = w * 0.78, h * 0.22
    d.rectangle([bx0, by0, w * 0.90, h * 0.58], fill=(248, 244, 236))
    for i in range(28):
        x = bx0 + (w * 0.12) * i / 28
        bw = max(1, int(w * 0.0025 * (1 + (i % 3))))
        d.rectangle([x, by0 + h * 0.02, x + bw, by0 + h * 0.34], fill=(30, 26, 22))
    d.text((w * 0.84, h * 0.60), "B", fill=(20, 18, 16), font=small, anchor="mm")
    # side flap tear (left)
    d.polygon([
        (w * 0.08, h * 0.10), (w * 0.18, h * 0.12), (w * 0.16, h * 0.88), (w * 0.08, h * 0.90),
    ], fill=(156, 112, 76))
    for y in range(int(h * 0.14), int(h * 0.86), max(5, h // 40)):
        d.line([(w * 0.09, y), (w * 0.17, y + 2)], fill=(120, 86, 56), width=1)
    grain(im, 11, 14)
    return im


PAINT = {
    "night_watcher": paint_night,
    "lionfish": paint_lion,
    "turtles": paint_turtles,
    "flamingos": paint_flamingo,
    "iguana": paint_iguana,
    "prikichi": paint_prikichi,
    "pelican": paint_pelican,
    "boss": paint_boss,
    "alice": paint_alice,
    "melting_pot": paint_flowers,
    "mujer_azul": paint_mujer,
    "nothing_to_declare": paint_declare,
}


def fit_atlas_tile(im: Image.Image, max_w: int = 2048) -> Image.Image:
    w, h = im.size
    if w <= max_w:
        return im
    nh = max(4, int(round(h * max_w / w)))
    return im.resize((max_w, nh), Image.Resampling.LANCZOS)


def mural_tile(spec: dict) -> Image.Image:
    mid = spec["id"]
    if mid in RECTIFIED_MURAL_IDS:
        im = load_rectified_pil(mid)
        return fit_atlas_tile(im)
    return PAINT[mid](spec["pw"], spec["ph"])


def pack(images):
    """Shelf-pack tallest first so the two large tiles share rows with offcuts."""
    pad = 2
    max_w = 2048
    order = sorted(range(len(images)), key=lambda i: -images[i].size[1])
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
    atlas_h = max(4, y - pad)
    # round up to multiple of 4
    atlas_h = (atlas_h + 3) & ~3
    atlas = Image.new("RGB", (max_w, atlas_h), (20, 20, 20))
    for im, (px, py, w, h) in zip(images, boxes):
        atlas.paste(im, (px, py))
    return atlas, boxes


def place_unwrap(spec):
    """One painting split across several walls of the same building, in order."""
    b = BLD[spec["bld"]]
    by_i = {w["i"]: w for w in walls_of(b)}
    order = [by_i[i] for i in spec["unwrap"]]
    total = sum(w["len"] for w in order)
    lift = float(spec.get("lift", 0.04))
    inset = float(spec.get("end_inset", 0.0))
    holes_by = {}
    for hole in spec.get("holes") or []:
        holes_by.setdefault(hole["wall"], []).append(hole["rect"])
    faces = []
    cursor = 0.0
    for idx, w in enumerate(order):
        L = w["len"]
        trim0 = inset if idx == 0 else 0.0
        trim1 = inset if idx == len(order) - 1 else 0.0
        dx, dz = (w["bx"] - w["ax"]) / L, (w["bz"] - w["az"]) / L
        x0 = w["ax"] + dx * trim0 + w["ox"] * lift
        z0 = w["az"] + dz * trim0 + w["oz"] * lift
        x1 = w["bx"] - dx * trim1 + w["ox"] * lift
        z1 = w["bz"] - dz * trim1 + w["oz"] * lift
        span = L - trim0 - trim1
        local = []
        for hx0, hy0, hx1, hy1 in holes_by.get(w["i"], []):
            local.append([round(hx0 - trim0, 3), round(hy0, 3), round(hx1 - trim0, 3), round(hy1, 3)])
        faces.append({
            "wall_i": w["i"],
            "wall_len": L,
            "width": span,
            "x0": x0, "z0": z0, "x1": x1, "z1": z1,
            "ox": w["ox"], "oz": w["oz"],
            "cx": (x0 + x1) / 2, "cz": (z0 + z1) / 2,
            "u0": (cursor + trim0) / total,
            "u1": (cursor + L - trim1) / total,
            "holes": local,
            "id": spec["id"] if L == max(x["len"] for x in order) else spec["id"] + "_return",
        })
        cursor += L
        print(f"{faces[-1]['id']:20} bld {spec['bld']} wall {w['i']} L={L:.2f} panel {span:.2f} u={faces[-1]['u0']:.3f}-{faces[-1]['u1']:.3f} holes={len(local)}")
    return {
        "spec": spec, "faces": faces,
        "bld_name": b.get("n") or "", "bld_h": float(b.get("h") or 3.4),
        "height": total * spec["ph"] / spec["pw"],
    }


def main():
    images = []
    placed = []
    for spec in SPECS:
        im = mural_tile(spec)
        if spec["id"] not in RECTIFIED_MURAL_IDS and not spec.get("sharp"):
            im = im.filter(ImageFilter.SMOOTH)
        images.append(im)
        if spec.get("unwrap"):
            placed.append(place_unwrap(spec))
            continue
        b, w, dist, facing, t, qx, qz = choose_wall(spec["lat"], spec["lng"], spec["bld"], spec["wall"])
        # Fit the painted aspect inside the real wall.
        aspect = im.size[0] / im.size[1]
        bld_h = float(b.get("h") or 3.4)
        if spec.get("fill"):
            # Edge to edge on this face. Paint aspect matches the wall.
            width = max(2.4, w["len"] - 0.08)
            height = width / aspect
            max_h = max(2.2, bld_h - 0.05)
            if height > max_h:
                height = max_h
                width = height * aspect
            half = width / 2 / w["len"]
            t_c = 0.5
        else:
            max_w = max(2.4, w["len"] - 0.45)
            max_h = max(2.2, bld_h - 0.2)
            width = min(spec["wm"], max_w)
            height = width / aspect
            if height > max_h:
                height = max_h
                width = height * aspect
            half = width / 2 / w["len"]
            t_c = 0.5 if spec.get("anchor") == "mid" else min(1 - half, max(half, t))
        cx = w["ax"] + (w["bx"] - w["ax"]) * t_c
        cz = w["az"] + (w["bz"] - w["az"]) * t_c
        dx, dz = (w["bx"] - w["ax"]) / w["len"], (w["bz"] - w["az"]) / w["len"]
        ox, oz = w["ox"], w["oz"]
        lift = float(spec.get("lift", 0.07))
        x0 = cx - dx * width / 2 + ox * lift
        z0 = cz - dz * width / 2 + oz * lift
        x1 = cx + dx * width / 2 + ox * lift
        z1 = cz + dz * width / 2 + oz * lift
        placed.append({
            "spec": spec, "im": im, "dist": dist, "facing": facing,
            "bld_name": b.get("n") or "", "bld_h": bld_h,
            "width": width, "height": height,
            "x0": x0, "z0": z0, "x1": x1, "z1": z1,
            "ox": ox, "oz": oz, "cx": cx, "cz": cz,
            "wall_len": w["len"], "wall_i": w["i"],
        })
        print(f"{spec['id']:20} bld {spec['bld']} { (b.get('n') or '')[:28]:28} wall {w['i']} L={w['len']:.1f} dist={dist:.1f} face={facing:.1f} panel {width:.1f}x{height:.1f} c=({cx:.1f},{cz:.1f})")

    atlas, boxes = pack(images)
    atlas.save(OUT_IMG, "JPEG", quality=68, optimize=True)
    aw, ah = atlas.size
    murals = []

    def emit(spec, rec, face, px, py, pw, ph):
        # three.js flipY default: v grows up from the bottom of the image
        u0, u1 = px / aw, (px + pw) / aw
        v0, v1 = 1 - (py + ph) / ah, 1 - py / ah
        if face is not None:
            span_u = u1 - u0
            u0 = px / aw + span_u * face["u0"]
            u1 = px / aw + span_u * face["u1"]
        pin = xz(spec["lat"], spec["lng"])
        dist = math.hypot(pin[0] - (face["cx"] if face else rec["cx"]), pin[1] - (face["cz"] if face else rec["cz"]))
        src = face or rec
        mural = {
            "id": src.get("id", spec["id"]),
            "name": spec["name"],
            "artist": spec["artist"],
            "year": spec["year"],
            "address": spec["address"],
            "lat": spec["lat"],
            "lng": spec["lng"],
            "bld": spec["bld"],
            "bld_name": rec["bld_name"],
            "bld_h": rec["bld_h"],
            "wall_i": src["wall_i"],
            "wall_len": round(src["wall_len"], 2),
            "gps_dist_m": round(dist, 2),
            "center": [round(src["cx"], 2), round(src["cz"], 2)],
            "p0": [round(src["x0"], 2), round(src["z0"], 2)],
            "p1": [round(src["x1"], 2), round(src["z1"], 2)],
            "normal": [round(src["ox"], 4), round(src["oz"], 4)],
            "width": round(src["width"], 2),
            "height": round(rec["height"] if face else rec["height"], 2),
            "uv": [round(u0, 6), round(v0, 6), round(u1, 6), round(v1, 6)],
            "sources": spec["sources"],
        }
        if spec.get("base"):
            mural["base"] = spec["base"]
            mural["lift"] = float(spec.get("lift", 0.05))
        if face and face.get("holes"):
            mural["holes"] = face["holes"]
        if spec.get("wall_face"):
            mural["wall_face"] = spec["wall_face"]
        return mural

    for rec, (px, py, pw, ph) in zip(placed, boxes):
        spec = rec["spec"]
        if rec.get("faces"):
            for face in rec["faces"]:
                murals.append(emit(spec, rec, face, px, py, pw, ph))
        else:
            murals.append(emit(spec, rec, None, px, py, pw, ph))
    doc = {
        "atlas": "textures/sn_mural_atlas.jpg",
        "atlas_px": [aw, ah],
        "note": "Pilot murals (night_watcher, lionfish, flamingos, nothing_to_declare) are perspective-rectified from verified SAC photos with masks/inpaint; other tiles are procedural placeholders until rectified.",
        "hide_heroes": [
            {"id": "sn_lionfish", "x": 6518.5, "z": 9318.0, "why": "approximate lionfish panel sitting on the Prikichi wall"},
            {"id": "sn_owl", "x": 6376.3, "z": 9392.1, "why": "approximate owl about 80 m off the police-station Night Watcher"},
            {"id": "sn_flamingo", "x": 6628.5, "z": 9493.0, "why": "approximate flamingo off the Stuyvesantstraat coordinate"},
            {"id": "sn_iguana", "x": 6526.3, "z": 9386.0, "why": "approximate iguana overlapping the Mujer Azul block"},
            {"id": "sn_alankar", "x": 6572.8, "z": 9435.5, "why": "approximate Miss Alice panel at the Alankar centroid, off the street wall"},
        ],
        "murals": murals,
    }
    OUT_JSON.write_text(json.dumps(doc, indent=1) + "\n")
    print("atlas", OUT_IMG, atlas.size, OUT_IMG.stat().st_size)


if __name__ == "__main__":
    main()
