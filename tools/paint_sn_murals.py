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

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT_IMG = ROOT / "game" / "textures" / "sn_mural_atlas.jpg"
OUT_JSON = ROOT / "game" / "data" / "sn_murals.json"

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
        # The game wall is red (#d8553f). The owl sits on a cream field that
        # runs to the corners, so it reads as paint on the wall.
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
        "address": "Bernard van de Veen Zeppenfeldstraat 9, street wall of La Aruba (pin falls inside the block)",
        "bld": 4079, "wall": 1,
        # House-kit windows stand 0.13 m off this wall. Sit the paint in front of them.
        "lift": 0.24,
        "anchor": "mid",
        "sharp": True,
        "wm": 14.8, "hm": 3.2,
        "pw": 1600, "ph": 720,
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
        "pw": 1800, "ph": 600,
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
    """Farid Rueda owl: cream wall, mandala face, ear tufts, teal beak.

    The field runs to the edges of a wide wall. The owl stays tall in the
    middle, so the cream is the painted wall rather than a square panel.
    """
    im = Image.new("RGB", (w, h), (236, 226, 204))
    d = ImageDraw.Draw(im, "RGBA")
    wash(d, (0, 0, w, h), (246, 238, 218), (214, 202, 176))
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
    im = Image.new("RGB", (w, h), (12, 12, 14))
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
    d.ellipse([w * 0.34, h * 0.08, w * 0.68, h * 0.92], fill=(150, 90, 40))
    d.ellipse([w * 0.40, h * 0.16, w * 0.62, h * 0.84], fill=(196, 140, 60))
    for i in range(7):
        yy = h * (0.2 + i * 0.09)
        d.arc([w * 0.38, yy, w * 0.64, yy + h * 0.12], 200, 340, fill=(70, 40, 24), width=3)
    d.ellipse([w * 0.44, h * 0.28, w * 0.52, h * 0.48], outline=(20, 140, 150), width=4)
    d.ellipse([w * 0.52, h * 0.30, w * 0.60, h * 0.48], outline=(20, 130, 160), width=4)
    d.ellipse([w * 0.46, h * 0.34, w * 0.50, h * 0.42], fill=(230, 240, 220))
    d.polygon([(w * 0.46, h * 0.78), (w * 0.56, h * 0.78), (w * 0.52, h * 0.92)], fill=(230, 226, 214))
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
    """Profile flamingo head on a geometric facade, beak to the right.

    The wall is a long low strip, so the head fills the height and the
    triangles run the full width. A white shutter band sits along the bottom.
    """
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

    # upper windows on the right, dark rectangles in the colour field
    for i, x in enumerate((0.62, 0.74, 0.86)):
        d.rectangle([w * x, h * 0.06, w * (x + 0.07), h * 0.28], fill=(28, 32, 40))
        d.rectangle([w * x, h * 0.06, w * (x + 0.07), h * 0.28], outline=(210, 214, 216), width=2)
        d.line([(w * (x + 0.035), h * 0.08), (w * (x + 0.035), h * 0.26)], fill=(180, 184, 188), width=1)

    # roller shutters
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


def shade_into(im, mask, light, shadow, mode="linear"):
    """Replace masked pixels with a light-to-shadow gradient."""
    bb = mask.getbbox()
    if not bb:
        return
    x0, y0, x1, y1 = bb
    mp = mask.load()
    px = im.load()
    lx = x0 + (x1 - x0) * 0.34
    ly = y0 + (y1 - y0) * 0.28
    rx = max(1.0, (x1 - x0) * 0.62)
    ry = max(1.0, (y1 - y0) * 0.62)
    span_x = max(1.0, x1 - x0)
    span_y = max(1.0, y1 - y0)
    for y in range(y0, y1):
        for x in range(x0, x1):
            a = mp[x, y]
            if a < 16:
                continue
            if mode == "sphere":
                t = math.sqrt(((x - lx) / rx) ** 2 + ((y - ly) / ry) ** 2)
                t = max(0.0, min(1.0, (t - 0.08) / 1.05))
            else:
                t = (x - x0) / span_x * 0.42 + (y - y0) / span_y * 0.85
                t = max(0.0, min(1.0, t))
            c = tuple(int(light[k] + (shadow[k] - light[k]) * t) for k in range(3))
            if a < 250:
                b = px[x, y]
                f = a / 255.0
                c = tuple(int(b[k] * (1 - f) + c[k] * f) for k in range(3))
            px[x, y] = c


def capsule(draw, a, b, ra, rb, fill):
    ax, ay = a
    bx, by = b
    ang = math.atan2(by - ay, bx - ax)
    px, py = math.cos(ang + math.pi / 2), math.sin(ang + math.pi / 2)
    draw.polygon([
        (ax + px * ra, ay + py * ra),
        (bx + px * rb, by + py * rb),
        (bx - px * rb, by - py * rb),
        (ax - px * ra, ay - py * ra),
    ], fill=fill)
    draw.ellipse([ax - ra, ay - ra, ax + ra, ay + ra], fill=fill)
    draw.ellipse([bx - rb, by - rb, bx + rb, by + rb], fill=fill)


def feather(draw, root, length, ang, width, color, vein, bend=0.0):
    """A broad vane with a curved shaft, not a thin spike."""
    rx, ry = root
    dx, dy = math.cos(ang), math.sin(ang)
    ox, oy = -dy, dx
    tip = (rx + dx * length, ry + dy * length)
    mx = rx + dx * length * 0.42 + ox * length * bend
    my = ry + dy * length * 0.42 + oy * length * bend
    qx = rx + dx * length * 0.78 + ox * length * bend * 0.35
    qy = ry + dy * length * 0.78 + oy * length * bend * 0.35
    w1 = width * 0.95
    w2 = width * 0.42
    draw.polygon([
        (rx + ox * width * 0.22, ry + oy * width * 0.22),
        (mx + ox * w1, my + oy * w1),
        (qx + ox * w2, qy + oy * w2),
        tip,
        (qx - ox * w2 * 0.85, qy - oy * w2 * 0.85),
        (mx - ox * w1 * 0.8, my - oy * w1 * 0.8),
        (rx - ox * width * 0.28, ry - oy * width * 0.28),
    ], fill=color)
    # shaded side of the vane
    draw.polygon([
        (rx, ry),
        (mx - ox * w1 * 0.15, my - oy * w1 * 0.15),
        tip,
        (rx - ox * width * 0.2, ry - oy * width * 0.2),
    ], fill=tuple(max(0, c - 40) for c in color[:3]))
    draw.line([(rx, ry), (mx, my), (qx, qy), tip], fill=vein, width=max(2, int(width * 0.12)))


def beads_along(draw, pts, count, radius, fill, shine=None):
    segs = []
    total = 0.0
    n = len(pts)
    for i in range(n):
        x0, y0 = pts[i]
        x1, y1 = pts[(i + 1) % n]
        length = math.hypot(x1 - x0, y1 - y0)
        segs.append((x0, y0, x1, y1, length))
        total += length
    if total < 1:
        return
    for i in range(count):
        dist = total * (i + 0.5) / count
        acc = 0.0
        for x0, y0, x1, y1, length in segs:
            if length > 0 and acc + length >= dist:
                t = (dist - acc) / length
                x = x0 + (x1 - x0) * t
                y = y0 + (y1 - y0) * t
                draw.ellipse([x - radius, y - radius, x + radius, y + radius], fill=fill)
                if shine:
                    sr = max(1, radius * 0.35)
                    draw.ellipse(
                        [x - sr - radius * 0.22, y - sr - radius * 0.28,
                         x + sr * 0.4, y + sr * 0.2],
                        fill=shine,
                    )
                break
            acc += length


def paint_boss(w, h):
    """WD's seated teal iguana: big head, crest, claws, red plinth, water.

    The street wall is long and low, so the tile is only as wide as a seated
    animal (about 7 m) instead of stretching one silhouette across 15 m.
    Drawn at 2× in a 1600×720 design so the eye and scales stay round.
    """
    W, H = w * 2, h * 2
    sx, sy = W / 1600.0, H / 720.0

    def X(px):
        return px * sx

    def Y(py):
        return py * sy

    def R(px):
        return px * sx

    def P(pts):
        return [(X(x), Y(y)) for x, y in pts]

    im = Image.new("RGB", (W, H), (236, 214, 152))
    d = ImageDraw.Draw(im, "RGBA")
    wash(d, (0, 0, W, H), (248, 230, 176), (198, 164, 104))
    rnd = rng(41)
    for _ in range(80):
        x, y = rnd.randint(0, W - 1), rnd.randint(0, H - 1)
        rad = rnd.randint(10, 46)
        d.ellipse([x - rad, y - rad, x + rad, y + rad], fill=(255, 246, 214, 26))

    # Dark negative space. Spine tips and the snout break out of it into the plaster.
    field = []
    for i in range(36):
        t = i / 35
        ang = math.pi * (1 + t)
        field.append((X(820 + math.cos(ang) * 760), Y(300 + math.sin(ang) * 210)))
    field += [(X(1560), Y(560)), (X(40), Y(560))]
    d.polygon([(int(a), int(b)) for a, b in field], fill=(10, 52, 62))
    field_mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(field_mask).polygon([(int(a), int(b)) for a, b in field], fill=255)
    shade_into(im, field_mask, (36, 108, 118), (4, 28, 36), "linear")

    head = [
        (48, 318), (100, 230), (180, 145), (290, 78), (410, 52),
        (510, 108), (545, 190), (500, 280), (430, 360),
        (300, 455), (170, 430), (80, 370), (36, 320),
    ]
    body = [
        (470, 168), (590, 92), (740, 130), (900, 190), (1060, 255),
        (1240, 300), (1420, 335), (1555, 385), (1510, 430), (1380, 410),
        (1260, 455), (1160, 545), (1040, 600), (930, 575), (990, 490),
        (860, 515), (680, 530), (520, 490), (450, 420), (500, 280),
    ]
    outline = (3, 24, 32)

    def fill_shape(pts, light, shadow):
        xy = P(pts)
        for ox, oy in ((-8, 0), (8, 0), (0, -8), (0, 8), (-6, -6), (6, -5), (-5, 6), (6, 6)):
            d.polygon([(a + ox, b + oy) for a, b in xy], fill=outline)
        d.polygon(xy, fill=light)
        mask = Image.new("L", (W, H), 0)
        ImageDraw.Draw(mask).polygon(xy, fill=255)
        shade_into(im, mask, light, shadow, "linear")
        return mask

    body_mask = fill_shape(body, (64, 176, 178), (6, 58, 68))
    head_mask = fill_shape(head, (86, 196, 194), (10, 72, 82))

    # Pale jaw and hanging dewlap, then the belly.
    d.polygon(P([
        (70, 300), (160, 270), (250, 300), (230, 370), (120, 400), (55, 345),
    ]), fill=(150, 214, 204, 170))
    d.polygon(P([
        (150, 360), (250, 340), (310, 390), (270, 455), (160, 440),
    ]), fill=(110, 186, 184, 150))
    for i, x in enumerate((150, 185, 220, 255)):
        d.arc([X(x), Y(330), X(x + 48), Y(450)], 60, 140, fill=(4, 48, 56, 200), width=max(2, int(R(2))))
    d.polygon(P([
        (500, 430), (700, 470), (980, 490), (1120, 450),
        (980, 545), (700, 555), (480, 500),
    ]), fill=(130, 210, 204, 145))

    # Scale rows. Skip the eye so the iris stays clean.
    mp_b = body_mask.load()
    mp_h = head_mask.load()
    step = max(7, int(R(11)))
    rad = max(5, int(R(7)))
    eye_box = (X(230 - 70), Y(200 - 70), X(230 + 70), Y(200 + 70))
    for y in range(rad, H - rad, step):
        shift = step // 2 if (y // step) % 2 else 0
        for x in range(rad + shift, W - rad, step):
            on_body = mp_b[x, y] > 200
            on_head = mp_h[x, y] > 200
            if not on_body and not on_head:
                continue
            if mp_b[x, min(H - 1, y + rad)] < 160 and mp_h[x, min(H - 1, y + rad)] < 160:
                continue
            if eye_box[0] <= x <= eye_box[2] and eye_box[1] <= y <= eye_box[3]:
                continue
            col = (8, 52, 60) if ((x // step) + (y // step)) % 2 == 0 else (20, 90, 96)
            d.arc([x - rad, y - rad // 3, x + rad, y + rad], 15, 165, fill=col, width=max(2, rad // 3))

    # Crest: broad blades, tallest over the neck, tips in the cream plaster.
    crest = [
        (330, 70, 70), (410, 62, 108), (500, 78, 130), (590, 100, 118),
        (690, 128, 92), (800, 162, 70), (910, 200, 52), (1020, 240, 36),
    ]
    for bx, by, ht in crest:
        tip = (X(bx + 10), Y(by) - R(ht))
        base = (X(bx), Y(by) + R(8))
        half = R(18 + ht * 0.1)
        ang = math.atan2(tip[1] - base[1], tip[0] - base[0])
        ox, oy = math.cos(ang + math.pi / 2) * half, math.sin(ang + math.pi / 2) * half
        d.polygon([
            (base[0] + ox, base[1] + oy), tip,
            (base[0] - ox * 0.55, base[1] - oy * 0.55),
        ], fill=(4, 40, 50))
        d.polygon([
            (base[0] + ox * 0.15, base[1]), tip,
            (base[0] - ox * 0.05, base[1]),
        ], fill=(120, 200, 196))

    # Raised forelimb, bent, with the hand in front of the jaw.
    def shaded_limb(a, b, ra, rb, light, shadow):
        capsule(d, a, b, ra + R(3), rb + R(2), outline)
        capsule(d, a, b, ra, rb, light)
        mask = Image.new("L", (W, H), 0)
        capsule(ImageDraw.Draw(mask), a, b, ra, rb, 255)
        shade_into(im, mask, light, shadow, "sphere")

    shoulder, elbow, wrist = (X(470), Y(360)), (X(300), Y(250)), (X(175), Y(285))
    shaded_limb(shoulder, elbow, R(40), R(26), (70, 180, 184), (8, 60, 70))
    shaded_limb(elbow, wrist, R(26), R(16), (96, 200, 196), (12, 72, 80))
    d.ellipse([wrist[0] - R(18), wrist[1] - R(16), wrist[0] + R(20), wrist[1] + R(18)], fill=(20, 90, 100))

    def claws(origin, angs, length):
        for i, ang in enumerate(angs):
            ln = R(length + (i % 2) * 10)
            x0, y0 = origin
            x1 = x0 + math.cos(ang) * ln
            y1 = y0 + math.sin(ang) * ln
            ox, oy = math.cos(ang + math.pi / 2) * R(3.2), math.sin(ang + math.pi / 2) * R(3.2)
            d.polygon([(x0 + ox, y0 + oy), (x1, y1), (x0 - ox * 0.6, y0 - oy * 0.6)], fill=(16, 14, 14))
            d.line([(x0, y0), (x1, y1)], fill=(240, 226, 190), width=max(1, int(R(1.4))))

    claws((X(155), Y(270)), (-2.7, -2.25, -1.8, -1.35), 36)

    # Planted foreleg and a heavy hind leg.
    shaded_limb((X(430), Y(470)), (X(300), Y(575)), R(34), R(20), (48, 150, 156), (6, 52, 60))
    shaded_limb((X(1040), Y(380)), (X(990), Y(575)), R(58), R(32), (40, 140, 150), (4, 48, 58))
    claws((X(250), Y(590)), (1.05, 1.4, 1.75, 2.1), 30)
    claws((X(960), Y(590)), (1.2, 1.55, 1.95, 2.3), 34)

    # Mouth, nostril, tympanum.
    d.line([(X(46), Y(312)), (X(90), Y(292)), (X(170), Y(278))], fill=(6, 22, 28), width=max(2, int(R(3))))
    d.line([(X(52), Y(304)), (X(150), Y(270))], fill=(190, 224, 210), width=max(2, int(R(1.6))))
    d.ellipse([X(92), Y(248), X(118), Y(272)], fill=(6, 30, 36))
    d.ellipse([X(96), Y(252), X(108), Y(264)], fill=(180, 210, 200))
    d.ellipse([X(390), Y(230), X(455), Y(300)], fill=(18, 86, 96))
    d.ellipse([X(400), Y(242), X(444), Y(288)], outline=(4, 32, 40), width=max(2, int(R(2))))
    d.ellipse([X(412), Y(255), X(432), Y(276)], fill=(8, 40, 48))

    # Eye.
    ex, ey, er = X(236), Y(196), R(52)
    d.ellipse([ex - er * 1.35, ey - er * 1.15, ex + er * 1.2, ey + er * 1.3], fill=(4, 32, 40))
    d.ellipse([ex - er, ey - er, ex + er, ey + er], fill=(242, 204, 74))
    d.ellipse([ex - er * 0.72, ey - er * 0.72, ex + er * 0.72, ey + er * 0.72], fill=(168, 112, 28))
    for k in range(10):
        a0 = k * 18
        d.arc([ex - er * 0.62, ey - er * 0.62, ex + er * 0.62, ey + er * 0.62], a0, a0 + 8, fill=(110, 64, 12), width=max(1, int(er * 0.07)))
    d.ellipse([ex - er * 0.34, ey - er * 0.34, ex + er * 0.34, ey + er * 0.34], fill=(250, 226, 120))
    d.polygon([
        (ex, ey - er * 0.82), (ex + er * 0.13, ey),
        (ex, ey + er * 0.82), (ex - er * 0.13, ey),
    ], fill=(8, 6, 6))
    d.ellipse([ex - er * 0.42, ey - er * 0.55, ex - er * 0.12, ey - er * 0.22], fill=(255, 252, 236))
    d.arc([ex - er, ey - er * 0.9, ex + er * 0.9, ey + er * 0.2], 210, 340, fill=(6, 24, 30), width=max(2, int(er * 0.12)))

    # Red plinth, water, fleshy tentacles.
    d.rectangle([0, Y(575), W, Y(655)], fill=(164, 32, 38))
    d.rectangle([0, Y(575), W, Y(586)], fill=(214, 92, 82))
    d.rectangle([0, Y(646), W, Y(655)], fill=(90, 14, 20))
    for vx in (120, 520, 980, 1380):
        d.rectangle([X(vx), Y(582), X(vx + 22), Y(650)], fill=(112, 18, 24))
    # toes sit on the plinth; keep the legs heavy so they are not sticks
    shaded_limb((X(430), Y(490)), (X(290), Y(590)), R(36), R(24), (36, 130, 140), (4, 44, 52))
    shaded_limb((X(1040), Y(460)), (X(980), Y(598)), R(62), R(36), (28, 120, 132), (4, 40, 50))
    d.ellipse([X(250), Y(575), X(330), Y(625)], fill=(20, 100, 110))
    d.ellipse([X(900), Y(575), X(1020), Y(635)], fill=(16, 84, 96))
    claws((X(245), Y(600)), (1.05, 1.4, 1.75, 2.1), 34)
    claws((X(940), Y(608)), (1.15, 1.5, 1.9, 2.25), 38)

    def wave(y0, amp, phase, col):
        pts = []
        steps = 56
        for i in range(steps + 1):
            pts.append((W * i / steps, Y(y0) + math.sin(i * 0.5 + phase) * R(amp)))
        pts += [(W, H), (0, H)]
        d.polygon(pts, fill=col)

    wave(640, 10, 0.3, (14, 86, 124))
    wave(662, 8, 1.5, (28, 140, 168))
    wave(688, 6, 2.8, (150, 214, 216))

    def tentacle(ctrl, w0, w1):
        p0, p1, p2 = ctrl
        left, right, mid = [], [], []
        prev = None
        for i in range(20):
            t = i / 19
            u = 1 - t
            x = u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0]
            y = u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]
            dx = 2 * u * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0])
            dy = 2 * u * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1])
            ln = math.hypot(dx, dy) or 1
            ox, oy = -dy / ln, dx / ln
            width = w0 + (w1 - w0) * t
            left.append((X(x + ox * width), Y(y + oy * width)))
            right.append((X(x - ox * width), Y(y - oy * width)))
            mid.append((X(x), Y(y), width))
            prev = (x, y)
        d.polygon(left + right[::-1], fill=(10, 36, 72))
        core = [(x, y) for x, y, _width in mid]
        d.line(core, fill=(70, 140, 168), width=max(3, int(R(w1 * 0.45))))
        for i, (x, y, width) in enumerate(mid):
            if i % 3 != 1:
                continue
            rr = R(max(4, width * 0.28))
            d.ellipse([x - rr, y - rr, x + rr, y + rr], fill=(232, 204, 164))
            d.ellipse([x - rr * 0.45, y - rr * 0.45, x + rr * 0.45, y + rr * 0.45], fill=(150, 64, 68))

    tentacle([(70, 700), (200, 655), (360, 615)], 26, 12)
    tentacle([(600, 710), (760, 660), (940, 625)], 24, 11)
    tentacle([(1180, 708), (1340, 655), (1500, 630)], 22, 10)

    grain(im, 6, 2)
    return im.resize((w, h), Image.Resampling.LANCZOS)


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


def paint_mujer(w, h):
    """Lina Arias portrait: shaded face, beaded mask, feather headdress.

    Turquoise runs to both ends of the street wall. Drawn at 2× in an
    1800×600 design so the face is round, then scaled into the atlas tile.
    """
    W, H = w * 2, h * 2
    sx, sy = W / 1800.0, H / 600.0

    def X(px):
        return px * sx

    def Y(py):
        return py * sy

    def R(px):
        return px * sx

    im = Image.new("RGB", (W, H), (8, 148, 160))
    d = ImageDraw.Draw(im, "RGBA")
    wash(d, (0, 0, W, H), (32, 184, 190), (4, 112, 132))
    r = rng(33)
    for i in range(48):
        x = int(W * i / 48 + r.randint(-8, 8))
        d.line([(x, 0), (x + r.randint(-14, 14), H)], fill=(255, 255, 255, 22), width=max(2, int(R(2))))
        if i % 3 == 0:
            d.line([(x + 6, 0), (x - 4, H)], fill=(0, 60, 70, 28), width=max(2, int(R(3))))

    cx, cy = X(900), Y(292)

    # Soft shadow so the figure sits on the wall.
    d.ellipse([cx - R(280), Y(360), cx + R(280), Y(620)], fill=(0, 50, 60, 70))

    # Headdress. Broad black vanes behind, broad red vanes in front.
    root_y = Y(268)
    for i in range(13):
        t = (i - 6) / 6
        ang = -math.pi / 2 + t * 1.15
        bend = 0.18 if i % 2 == 0 else -0.14
        root = (cx + math.cos(ang) * R(70), root_y + math.sin(ang) * R(70))
        feather(d, root, R(175 + (i % 3) * 16), ang, R(20), (22, 16, 18), (86, 74, 64), bend)
    for i in range(11):
        t = (i - 5) / 5
        ang = -math.pi / 2 + t * 0.95
        bend = -0.12 if i % 2 == 0 else 0.16
        root = (cx + math.cos(ang) * R(58), root_y + math.sin(ang) * R(58))
        col = (186, 32, 44) if i % 2 == 0 else (140, 18, 30)
        feather(d, root, R(142 + (i % 2) * 14), ang, R(28), col, (96, 18, 26), bend)
    for side in (-1, 1):
        root = (cx + side * R(130), Y(310))
        angs = (-2.55, -2.15, -1.75) if side < 0 else (-1.4, -1.0, -0.6)
        for k, ang in enumerate(angs):
            feather(d, root, R(110 - k * 10), ang, R(24), (176, 28, 40), (80, 14, 22), 0.2 * side)

    def limb_mask(a, b, ra, rb):
        mask = Image.new("L", (W, H), 0)
        capsule(ImageDraw.Draw(mask), a, b, ra, rb, 255)
        return mask

    def shaded_arm(a, b, ra, rb):
        capsule(d, a, b, ra + R(5), rb + R(4), (62, 36, 28))
        capsule(d, a, b, ra, rb, (168, 114, 82))
        shade_into(im, limb_mask(a, b, ra, rb), (228, 176, 136), (96, 54, 38), "sphere")

    # Bent arms: upper arm, then a forearm that reaches out. Thick enough to read as limbs.
    l_sh, l_el, l_hd = (cx - R(90), Y(455)), (X(520), Y(530)), (X(130), Y(470))
    r_sh, r_el, r_hd = (cx + R(100), Y(460)), (X(1280), Y(545)), (X(1620), Y(490))
    shaded_arm(l_sh, l_el, R(52), R(36))
    shaded_arm(l_el, l_hd, R(36), R(22))
    shaded_arm(r_sh, r_el, R(50), R(34))
    shaded_arm(r_el, r_hd, R(34), R(22))
    # hands
    for hx, hy in (l_hd, r_hd):
        d.ellipse([hx - R(26), hy - R(18), hx + R(28), hy + R(20)], fill=(196, 140, 104))
        d.ellipse([hx - R(26), hy - R(18), hx + R(8), hy + R(4)], fill=(230, 186, 150, 140))
    for ex, ey in (l_el, r_el):
        d.ellipse([ex - R(18), ey - R(16), ex + R(18), ey + R(16)], fill=(186, 128, 92))

    # Shoulders and torso. Round shoulder masses, not a trapezoid.
    d.ellipse([cx - R(190), Y(400), cx - R(20), Y(530)], fill=(120, 74, 52))
    d.ellipse([cx + R(10), Y(405), cx + R(185), Y(535)], fill=(120, 74, 52))
    torso = [
        (cx - R(160), Y(455)), (cx - R(30), Y(400)), (cx + R(40), Y(398)),
        (cx + R(165), Y(460)), (cx + R(130), Y(590)), (cx - R(120), Y(592)),
    ]
    d.polygon(torso, fill=(150, 102, 74))
    torso_mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(torso_mask).polygon(torso, fill=255)
    ImageDraw.Draw(torso_mask).ellipse([cx - R(190), Y(400), cx - R(20), Y(530)], fill=255)
    ImageDraw.Draw(torso_mask).ellipse([cx + R(10), Y(405), cx + R(185), Y(535)], fill=255)
    shade_into(im, torso_mask, (214, 160, 120), (86, 48, 36), "sphere")
    neck = [
        (cx - R(28), Y(360)), (cx + R(28), Y(358)),
        (cx + R(24), Y(430)), (cx - R(24), Y(432)),
    ]
    d.polygon(neck, fill=(176, 126, 96))
    neck_mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(neck_mask).polygon(neck, fill=255)
    shade_into(im, neck_mask, (220, 170, 136), (130, 84, 64), "sphere")

    # Chest paint: a V of neckline and short diagonals, not a stack of bars.
    d.line([(cx - R(70), Y(455)), (cx, Y(530)), (cx + R(74), Y(458))], fill=(36, 22, 18), width=max(2, int(R(3))))
    d.line([(cx - R(48), Y(470)), (cx - R(8), Y(530))], fill=(36, 22, 18), width=max(2, int(R(2))))
    d.line([(cx + R(52), Y(472)), (cx + R(12), Y(528))], fill=(36, 22, 18), width=max(2, int(R(2))))
    for i, yy in enumerate((500, 530, 560)):
        d.arc([cx - R(70 - i * 8), Y(yy), cx + R(70 - i * 8), Y(yy + 36)], 20, 160, fill=(48, 28, 22), width=max(2, int(R(2))))

    # Geometric cuff on the left forearm.
    ax, ay = l_el
    bx, by = l_hd
    ang = math.atan2(by - ay, bx - ax)
    ox, oy = math.cos(ang + math.pi / 2), math.sin(ang + math.pi / 2)
    for i in range(6):
        t = 0.42 + i * 0.07
        px = ax + (bx - ax) * t
        py = ay + (by - ay) * t
        d.polygon([
            (px - math.cos(ang) * R(8), py - math.sin(ang) * R(8)),
            (px + ox * R(16), py + oy * R(16)),
            (px + math.cos(ang) * R(8), py + math.sin(ang) * R(8)),
        ], fill=(22, 18, 16))
        d.line([
            (px - math.cos(ang) * R(8), py - math.sin(ang) * R(8)),
            (px + ox * R(16), py + oy * R(16)),
        ], fill=(214, 176, 64), width=max(1, int(R(1.4))))

    # Face, shaded as a volume. Cheeks, nose and lips are modelled on top.
    face_box = [cx - R(92), cy - R(108), cx + R(92), cy + R(118)]
    d.ellipse([face_box[0] - R(6), face_box[1] - R(4), face_box[2] + R(6), face_box[3] + R(4)], fill=(90, 52, 40))
    d.ellipse(face_box, fill=(186, 136, 104))
    face_mask = Image.new("L", (W, H), 0)
    ImageDraw.Draw(face_mask).ellipse(face_box, fill=255)
    shade_into(im, face_mask, (236, 196, 162), (122, 74, 56), "sphere")
    # cheek and chin shadows
    d.ellipse([cx - R(78), cy + R(10), cx - R(28), cy + R(70)], fill=(150, 86, 66, 90))
    d.ellipse([cx + R(30), cy + R(12), cx + R(78), cy + R(72)], fill=(150, 86, 66, 90))
    d.ellipse([cx - R(36), cy + R(78), cx + R(36), cy + R(118)], fill=(110, 64, 50, 80))
    # brow highlight
    d.ellipse([cx - R(40), cy - R(90), cx + R(36), cy - R(48)], fill=(236, 206, 176, 70))

    # Nose.
    d.polygon([
        (cx, cy - R(8)), (cx + R(7), cy + R(36)), (cx - R(7), cy + R(36)),
    ], fill=(168, 110, 86, 160))
    d.ellipse([cx - R(16), cy + R(28), cx - R(2), cy + R(42)], fill=(96, 52, 44))
    d.ellipse([cx + R(2), cy + R(28), cx + R(16), cy + R(42)], fill=(96, 52, 44))
    d.ellipse([cx - R(4), cy + R(8), cx + R(5), cy + R(22)], fill=(236, 200, 170, 140))

    # Lips.
    d.polygon([
        (cx - R(28), cy + R(52)), (cx, cy + R(44)), (cx + R(28), cy + R(52)),
        (cx + R(8), cy + R(60)), (cx - R(8), cy + R(60)),
    ], fill=(132, 62, 64))
    d.ellipse([cx - R(24), cy + R(54), cx + R(24), cy + R(78)], fill=(186, 96, 96))
    d.ellipse([cx - R(12), cy + R(58), cx + R(6), cy + R(70)], fill=(220, 150, 140, 160))
    d.arc([cx - R(20), cy + R(48), cx + R(20), cy + R(66)], 10, 170, fill=(90, 36, 42), width=max(2, int(R(1.5))))

    # Blue mask, then a border of separate yellow beads.
    mask_pts = [
        (cx - R(118), cy + R(6)),
        (cx - R(86), cy - R(48)),
        (cx - R(24), cy - R(62)),
        (cx, cy - R(36)),
        (cx + R(24), cy - R(62)),
        (cx + R(86), cy - R(48)),
        (cx + R(118), cy + R(6)),
        (cx + R(90), cy + R(52)),
        (cx, cy + R(66)),
        (cx - R(90), cy + R(52)),
    ]
    d.polygon(mask_pts, fill=(10, 58, 102))
    mask_m = Image.new("L", (W, H), 0)
    ImageDraw.Draw(mask_m).polygon(mask_pts, fill=255)
    shade_into(im, mask_m, (48, 130, 176), (6, 32, 64), "sphere")
    beads_along(d, mask_pts, 46, R(6.5), (232, 188, 42), (255, 236, 170))

    # Diamond eyes with catchlights.
    for sign in (-1, 1):
        ex = cx + sign * R(42)
        ey = cy + R(2)
        s = R(20)
        d.polygon([(ex, ey - s * 1.15), (ex + s, ey), (ex, ey + s * 1.15), (ex - s, ey)], fill=(248, 244, 236))
        d.polygon([
            (ex, ey - s * 1.15), (ex + s, ey), (ex, ey + s * 0.1), (ex - s * 0.15, ey - s * 0.2),
        ], outline=(20, 28, 36))
        inn = s * 0.48
        d.polygon([(ex, ey - inn), (ex + inn * 0.7, ey), (ex, ey + inn), (ex - inn * 0.7, ey)], fill=(16, 14, 18))
        d.ellipse([ex - s * 0.28, ey - s * 0.45, ex - s * 0.02, ey - s * 0.16], fill=(255, 255, 250))

    # Yellow pom-poms in an arc, each with a shaded side and a highlight.
    for i in range(9):
        t = (i - 4) / 4
        ang = -math.pi / 2 + t * 0.95
        px = cx + math.cos(ang) * R(128)
        py = Y(236) + math.sin(ang) * R(128)
        rad = R(20 - abs(t) * 2)
        d.ellipse([px - rad, py - rad * 0.2, px + rad * 0.3, py + rad], fill=(150, 110, 24))
        d.ellipse([px - rad, py - rad, px + rad, py + rad], fill=(236, 198, 64))
        d.ellipse([px - rad * 0.45, py - rad * 0.62, px + rad * 0.05, py - rad * 0.05], fill=(255, 236, 160))

    # Brow jewel and the gold drop onto the mask.
    jx, jy, jr = cx, Y(188), R(16)
    d.ellipse([jx - jr * 1.35, jy - jr * 1.35, jx + jr * 1.35, jy + jr * 1.35], fill=(212, 170, 48))
    d.ellipse([jx - jr, jy - jr, jx + jr, jy + jr], fill=(186, 24, 36))
    d.ellipse([jx - jr * 0.45, jy - jr * 0.55, jx + jr * 0.05, jy - jr * 0.05], fill=(255, 180, 160))
    d.polygon([
        (jx, jy + jr), (jx + R(8), jy + jr + R(22)), (jx, jy + jr + R(36)), (jx - R(8), jy + jr + R(22)),
    ], fill=(214, 170, 52))
    d.polygon([
        (jx, jy + jr + R(6)), (jx + R(3), jy + jr + R(18)), (jx, jy + jr + R(28)), (jx - R(3), jy + jr + R(18)),
    ], fill=(255, 220, 120))

    # Necklace: a curve of beads and hanging strands.
    neck_pts = []
    for i in range(16):
        t = i / 15
        neck_pts.append((cx + (t - 0.5) * R(150), Y(400) + math.sin(t * math.pi) * R(18)))
    beads_along(d, neck_pts, 15, R(5.5), (12, 36, 52), (80, 140, 160))
    for i in range(7):
        t = (i + 0.5) / 7
        x = cx + (t - 0.5) * R(120)
        y0 = Y(412) + abs(t - 0.5) * R(10)
        y1 = Y(500) + abs(t - 0.5) * R(30)
        d.line([(x, y0), (x, y1)], fill=(16, 40, 56), width=max(1, int(R(1.5))))
        for k in range(4):
            by = y0 + (y1 - y0) * (k + 1) / 4
            rr = R(3.2)
            d.ellipse([x - rr, by - rr, x + rr, by + rr], fill=(20, 48, 64))
    d.polygon([
        (cx, Y(498)), (cx + R(10), Y(528)), (cx, Y(548)), (cx - R(10), Y(528)),
    ], fill=(214, 170, 52))

    grain(im, 5, 14)
    return im.resize((w, h), Image.Resampling.LANCZOS)


def paint_declare(w, h):
    im = Image.new("RGB", (w, h), (168, 132, 86))
    d = ImageDraw.Draw(im, "RGBA")
    wash(d, (0, 0, w, h), (186, 148, 96), (120, 86, 52))
    # doorway
    d.rectangle([w * 0.22, h * 0.08, w * 0.78, h * 0.98], fill=(150, 112, 70))
    # sack
    d.polygon([
        (w * 0.30, h * 0.18), (w * 0.70, h * 0.16), (w * 0.74, h * 0.88), (w * 0.26, h * 0.90),
    ], fill=(196, 154, 96))
    d.rectangle([w * 0.36, h * 0.28, w * 0.64, h * 0.62], outline=(40, 30, 20), width=2)
    for i in range(8):
        x = w * (0.38 + i * 0.03)
        d.line([(x, h * 0.32), (x, h * 0.58)], fill=(20, 16, 14), width=2)
    d.ellipse([w * 0.40, h * 0.64, w * 0.62, h * 0.82], fill=(210, 180, 60))
    d.ellipse([w * 0.46, h * 0.68, w * 0.56, h * 0.78], fill=(40, 110, 50))
    grain(im, 11, 16)
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


def main():
    images = []
    placed = []
    for spec in SPECS:
        im = PAINT[spec["id"]](spec["pw"], spec["ph"])
        if not spec.get("sharp"):
            im = im.filter(ImageFilter.SMOOTH)
        images.append(im)
        b, w, dist, facing, t, qx, qz = choose_wall(spec["lat"], spec["lng"], spec["bld"], spec["wall"])
        # Fit the painted aspect inside the real wall.
        aspect = spec["pw"] / spec["ph"]
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
    for rec, (px, py, pw, ph) in zip(placed, boxes):
        spec = rec["spec"]
        # three.js flipY default: v grows up from the bottom of the image
        u0, u1 = px / aw, (px + pw) / aw
        v0, v1 = 1 - (py + ph) / ah, 1 - py / ah
        murals.append({
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
            "wall_i": rec["wall_i"],
            "wall_len": round(rec["wall_len"], 2),
            "gps_dist_m": round(rec["dist"], 2),
            "center": [round(rec["cx"], 2), round(rec["cz"], 2)],
            "p0": [round(rec["x0"], 2), round(rec["z0"], 2)],
            "p1": [round(rec["x1"], 2), round(rec["z1"], 2)],
            "normal": [round(rec["ox"], 4), round(rec["oz"], 4)],
            "width": round(rec["width"], 2),
            "height": round(rec["height"], 2),
            "uv": [round(u0, 6), round(v0, 6), round(u1, 6), round(v1, 6)],
            "sources": spec["sources"],
        })
    doc = {
        "atlas": "textures/sn_mural_atlas.jpg",
        "atlas_px": [aw, ah],
        "note": "Original paintings. Public photos were visual reference only and are not embedded.",
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
