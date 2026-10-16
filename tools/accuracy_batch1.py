#!/usr/bin/env python3
"""Batch 1 — most-driven south and central landmarks.

Rebuilds (same hero id, same footprint, same origin):
  charliesbar, zeerovers, arikokvc
Recolours the existing airport terminal shell (geometry kept) and adds:
  apt_tower   Queen Beatrix control tower
  apt_tealroof  airside standing-seam roof cap
  filomena    Misa Santa Filomena, Paradera

References are visual guides only. Nothing here is a pasted photo.
"""
import json
import struct
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

from hero_glb import (
    Model, box, check_glb, fan, gable_roof, prism, sign_quad, wall_ring, write_glb,
)

ROOT = Path(__file__).resolve().parents[1]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
FONT = "/usr/share/fonts/truetype/noto/NotoSans-Bold.ttf"

# sRGB-style 0-1, matching the colours already baked into hero GLBs
YELLOW = (0.93, 0.74, 0.18)
YELLOW_DEEP = (0.86, 0.62, 0.12)
BROWN = (0.36, 0.18, 0.09)
WHITE = (0.95, 0.94, 0.90)
ROOF_RED = (0.55, 0.24, 0.16)
DOOR_RED = (0.72, 0.13, 0.10)
GLASS = (0.05, 0.08, 0.12)
TEAL = (0.22, 0.68, 0.66)
BEIGE = (0.78, 0.67, 0.52)
TOWER_YEL = (0.95, 0.78, 0.16)
TOWER_ORA = (0.93, 0.42, 0.10)
CREAM = (0.94, 0.91, 0.84)
CHAR_BROWN = (0.28, 0.16, 0.10)
AWN_RED = (0.75, 0.10, 0.12)
STEEL = (0.45, 0.48, 0.50)
THATCH = (0.62, 0.50, 0.32)
WOOD = (0.45, 0.30, 0.16)
STONE = (0.62, 0.50, 0.36)
STONE_DARK = (0.40, 0.28, 0.16)
PARK = (0.36, 0.22, 0.12)
BLUE_SIGN = (0.05, 0.22, 0.55)
PALM = (0.16, 0.42, 0.14)
TRUNK = (0.42, 0.30, 0.16)


def sign_png(text, bg, fg, w=512, h=128):
    im = Image.new("RGBA", (w, h), bg)
    dr = ImageDraw.Draw(im)
    size = 86
    font = ImageFont.truetype(FONT, size)
    while font.getlength(text) > w - 28 and size > 28:
        size -= 4
        font = ImageFont.truetype(FONT, size)
    tw = font.getlength(text)
    dr.text(((w - tw) / 2, (h - size) / 2 - 4), text, fill=fg, font=font)
    buf = __import__("io").BytesIO()
    im.save(buf, "PNG")
    return buf.getvalue()


def recolor_materials(path, edits):
    """Change baseColorFactor on named materials. Geometry bytes stay put."""
    data = Path(path).read_bytes()
    o = 12
    js = blob = None
    while o < len(data) - 8:
        ln, ct = struct.unpack_from("<II", data, o)
        o += 8
        chunk = data[o:o + ln]
        o += ln
        if ct == 0x4E4F534A:
            js = json.loads(chunk)
        elif ct == 0x004E4942:
            blob = chunk
    n = 0
    for m in js["materials"]:
        if m["name"] in edits:
            m.setdefault("pbrMetallicRoughness", {})["baseColorFactor"] = edits[m["name"]]
            n += 1
    if n != len(edits):
        raise SystemExit(f"{path}: recolored {n}, wanted {list(edits)}")
    raw = json.dumps(js, separators=(",", ":")).encode()
    raw += b" " * ((4 - len(raw) % 4) % 4)
    blob += b"\x00" * ((4 - len(blob) % 4) % 4)

    def chunk(tag, buf):
        return struct.pack("<II", len(buf), tag) + buf

    body = b"glTF" + struct.pack("<II", 2, 0) + chunk(0x4E4F534A, raw) + chunk(0x004E4942, blob)
    body = body[:8] + struct.pack("<I", len(body)) + body[12:]
    Path(path).write_bytes(body)
    return n


# ---------------------------------------------------------------- Filomena
# OSM way 170899528. West gable faces the Paradera road (the road sits ~10 m
# further west). Tower is on the right of that facade when you face the door,
# which is the south corner. Colours from Wikimedia "Santa Filomena Catholic
# Parish" / "St Filomena Church (Paradera)": marigold walls, white trim,
# dark-brown plinth, red-brown gable roof, red door, louvered belfry, white cross.

FILO_RING = [
    (-3732.25, -1812.93), (-3699.15, -1812.24), (-3699.33, -1816.65),
    (-3688.97, -1816.47), (-3689.15, -1810.31), (-3684.98, -1810.21),
    (-3685.09, -1797.17), (-3689.15, -1797.17), (-3689.15, -1791.57),
    (-3701.00, -1792.03), (-3701.00, -1796.25), (-3732.70, -1797.17),
]


def _cent(ring):
    return sum(p[0] for p in ring) / len(ring), sum(p[1] for p in ring) / len(ring)


def build_filomena():
    cx, cz = _cent(FILO_RING)
    M = Model("filomena")
    wall = M.material("wall", YELLOW)
    base = M.material("base", BROWN)
    trim = M.material("trim", WHITE)
    roof = M.material("roof", ROOF_RED)
    door = M.material("door", DOOR_RED)
    glass = M.material("glass", GLASS, rough=0.25)
    palm = M.material("palm", PALM)
    trunk = M.material("trunk", TRUNK)
    # local: x east, z south. West front at x=-33.
    # Nave sits in the main block (z -7.2..6.2, x -32..9).
    x0, x1, z0, z1 = -31.5, 8.5, -6.6, 5.8
    eave, peak = 6.3, 9.4

    def add(lod, mat, fn):
        fn(M.mesh(lod, mat))

    for lod in (0, 1):
        W = lambda m: M.mesh(lod, m)
        # plinth and yellow walls
        prism(W(base), x0, x1, z0, z1, 0, 1.25)
        prism(W(wall), x0, x1, z0, z1, 1.25, eave)
        # gable ends. tri(a, b, c) faces -X (west); the east end is flipped.
        zm = (z0 + z1) / 2
        for x, want_neg_x in ((x0, True), (x1, False)):
            a, b, c = (x, eave, z0), (x, eave, z1), (x, peak, zm)
            if want_neg_x:
                W(wall).tri(a, b, c)
            else:
                W(wall).tri(a, c, b)
            nx = W(wall).nrm[-1][0]
            if (nx < 0) != want_neg_x:
                raise SystemExit(f"filomena gable normal x={nx}")
        gable_roof(W(roof), x0 - 0.45, x1 + 0.45, z0 - 0.45, z1 + 0.45, eave - 0.05, peak + 0.15)
        # white corner pilasters
        for x in (x0, x1 - 0.45):
            for z in (z0, z1 - 0.42):
                prism(W(trim), x, x + 0.45, z, z + 0.42, 0, eave + 0.05)
        # west barge board
        prism(W(trim), x0 - 0.18, x0 + 0.08, z0 - 0.15, z1 + 0.15, eave - 0.1, eave + 0.25)

    # tower on the south end of the west front (right-hand side as you face the door)
    tx0, tx1, tz0, tz1 = -33.2, -26.4, 0.4, 7.2
    for lod in (0, 1):
        W = lambda m: M.mesh(lod, m)
        prism(W(base), tx0, tx1, tz0, tz1, 0, 1.25)
        prism(W(wall), tx0, tx1, tz0, tz1, 1.25, 16.2)
        # white corner strips
        for x in (tx0, tx1 - 0.28):
            for z in (tz0, tz1 - 0.28):
                prism(W(trim), x, x + 0.28, z, z + 0.28, 0, 18.6)
        # belfry cap
        prism(W(trim), tx0 - 0.25, tx1 + 0.25, tz0 - 0.25, tz1 + 0.25, 16.0, 16.55)
        prism(W(wall), tx0, tx1, tz0, tz1, 16.55, 20.4)
        gable_roof(W(roof), tx0 - 0.3, tx1 + 0.3, tz0 - 0.3, tz1 + 0.3, 20.2, 22.6)
        # tower gable triangles (ridge along x, so gables are the east/west ends — also the north/south
        # read as a hip from the road). A small cross sits on the ridge.
        zm = (tz0 + tz1) / 2
        # west gable faces the road (-X); east gable faces +X
        W(wall).tri((tx0, 20.2, tz0), (tx0, 20.2, tz1), (tx0, 22.6, zm))
        W(wall).tri((tx1, 20.2, tz0), (tx1, 22.6, zm), (tx1, 20.2, tz1))
        if W(wall).nrm[-1][0] < 0.5 or W(wall).nrm[-4][0] > -0.5:
            raise SystemExit(f"tower gable normals {W(wall).nrm[-4]} {W(wall).nrm[-1]}")
        # cross
        prism(W(trim), (tx0 + tx1) / 2 - 0.18, (tx0 + tx1) / 2 + 0.18, zm - 0.18, zm + 0.18, 22.3, 26.0)
        prism(W(trim), (tx0 + tx1) / 2 - 1.15, (tx0 + tx1) / 2 + 1.15, zm - 0.16, zm + 0.16, 24.15, 24.7)

    # detail only on lod0
    W = lambda m: M.mesh(0, m)
    # louvered belfry, three slots on the west and south faces (the ones the road sees)
    for i, z in enumerate((1.5, 3.5, 5.5)):
        prism(W(glass), tx0 - 0.08, tx0 + 0.12, z, z + 1.15, 17.1, 19.5)
    for i, x in enumerate((-31.6, -29.8, -28.0)):
        prism(W(glass), x, x + 1.15, tz1 - 0.12, tz1 + 0.08, 17.1, 19.5)
    # west door, canopy, arched window, two round windows
    door_z = -2.2
    prism(W(door), x0 - 0.12, x0 + 0.08, door_z, door_z + 1.5, 0.05, 2.7)
    prism(W(trim), x0 - 1.15, x0 + 0.15, door_z - 0.35, door_z + 1.85, 2.65, 2.95)  # canopy slab
    prism(W(trim), x0 - 1.15, x0 - 0.95, door_z - 0.25, door_z - 0.05, 0, 2.7)
    prism(W(trim), x0 - 1.15, x0 - 0.95, door_z + 1.55, door_z + 1.75, 0, 2.7)
    # arched window above the door
    prism(W(glass), x0 - 0.08, x0 + 0.06, door_z + 0.15, door_z + 1.35, 3.5, 5.5)
    prism(W(trim), x0 - 0.12, x0 + 0.1, door_z, door_z + 1.5, 3.35, 5.7)
    # round windows either side (octagon-ish boxes)
    for zc in (-5.2, 2.6):
        prism(W(glass), x0 - 0.06, x0 + 0.05, zc, zc + 0.85, 3.9, 4.75)
        prism(W(trim), x0 - 0.1, x0 + 0.08, zc - 0.1, zc + 0.95, 3.75, 4.9)
    # side arched windows along the south wall (the long side you see approaching)
    for x in (-22, -16, -10, -4, 2):
        prism(W(glass), x, x + 1.15, z1 - 0.08, z1 + 0.1, 1.7, 4.8)
        prism(W(trim), x - 0.12, x + 1.27, z1 - 0.02, z1 + 0.16, 1.55, 5.0)
    # a few on the north wall
    for x in (-20, -12, -4, 2):
        prism(W(glass), x, x + 1.05, z0 - 0.1, z0 + 0.08, 1.8, 4.6)
    # south side chapel (the smaller gable with its own cross, mid-nave)
    sx0, sx1, sz0, sz1 = -14.5, -6.5, 5.6, 12.2
    prism(W(base), sx0, sx1, sz0, sz1, 0, 1.15)
    prism(W(wall), sx0, sx1, sz0, sz1, 1.15, 5.0)
    gable_roof(W(roof), sx0 - 0.3, sx1 + 0.3, sz0 - 0.2, sz1 + 0.35, 4.9, 7.3)
    zm = (sz0 + sz1) / 2
    # chapel ridge runs along x, cross near the south end
    prism(W(trim), (sx0 + sx1) / 2 - 0.12, (sx0 + sx1) / 2 + 0.12, sz1 - 0.8, sz1 - 0.5, 7.1, 8.7)
    prism(W(trim), (sx0 + sx1) / 2 - 0.55, (sx0 + sx1) / 2 + 0.55, sz1 - 0.72, sz1 - 0.48, 7.7, 8.05)
    prism(W(door), sx0 + 3.2, sx0 + 4.3, sz1 - 0.08, sz1 + 0.08, 0.1, 2.4)
    # one palm in front of the door, west of the facade
    prism(W(trunk), -36.4, -35.7, door_z + 2.4, door_z + 3.1, 0, 5.2)
    # fronds: 6 flat blades
    pcx, pcz = -36.05, door_z + 2.75
    for i, (dx, dz) in enumerate(((1.6, 0.3), (-1.5, 0.4), (0.4, 1.6), (0.2, -1.5), (1.2, 1.1), (-1.2, -1.0))):
        prism(W(palm), pcx - 0.15 + dx * 0.15, pcx + 0.15 + dx, pcz - 0.12 + dz * 0.15, pcz + 0.12 + dz, 4.6, 5.15)

    png = sign_png("STA. FILOMENA", (240, 230, 210, 255), (120, 30, 24, 255), 512, 96)
    # small plaque by the door, facing west (the road)
    sign = M.material("sign", WHITE, rough=0.5, double=True, textured=True)
    sign_quad(
        M.mesh(0, "sign"),
        (x0 - 0.16, 2.15, door_z + 1.85),
        (x0 - 0.16, 2.15, door_z + 3.55),
        (x0 - 0.16, 1.35, door_z + 3.55),
        (x0 - 0.16, 1.35, door_z + 1.85),
    )
    if M.mesh(0, "sign").nrm[-1][0] > -0.5:
        raise SystemExit(f"filomena sign normal {M.mesh(0, 'sign').nrm[-1]}")
    # lod1 keeps the masses only; give it a plain sign-less silhouette (already built)
    info = write_glb(M, HERO / "filomena.glb", images=[png])
    check_glb(HERO / "filomena.glb")
    return cx, cz, info


# ---------------------------------------------------------------- Charlie's
# Corner of Zeppenfeldstraat (north, edge 0) and Caya Charlie Brouns (east, edge 1).
# Wikimedia "Charlies Bar San Nicolas, Aruba": two storeys, white above a dark
# brown dado, red-and-white striped awnings, painted sea-life wall on the side
# street, big CHARLIE'S BAR lettering. The fish are simple coloured shapes, not
# the photograph.

CHARLIE_RING = [
    (6869.87, 9631.93), (6885.02, 9636.20), (6882.00, 9646.78), (6880.10, 9646.25),
    (6879.14, 9649.62), (6869.14, 9646.79), (6870.10, 9643.42), (6866.85, 9642.50),
]
CHARLIE_O = (6875.27, 9642.94)  # keep the manifest origin so the hero does not jump


def _local(ring, origin):
    return [(p[0] - origin[0], p[1] - origin[1]) for p in ring]


def _outward(ring):
    """CCW ring -> list of (midx, midz, ox, oz, length) for each edge."""
    out = []
    for i in range(len(ring)):
        x0, z0 = ring[i]
        x1, z1 = ring[(i + 1) % len(ring)]
        dx, dz = x1 - x0, z1 - z0
        L = (dx * dx + dz * dz) ** 0.5 or 1
        ox, oz = dz / L, -dx / L
        out.append(((x0 + x1) / 2, (z0 + z1) / 2, ox, oz, L, (x0, z0), (x1, z1)))
    return out


def build_charlies():
    ring = _ensure_ccw(_local(CHARLIE_RING, CHARLIE_O))
    M = Model("charliesbar")
    white = M.material("wall", CREAM)
    brown = M.material("base", CHAR_BROWN)
    roof = M.material("roof", (0.38, 0.36, 0.34))
    glass = M.material("glass", GLASS, rough=0.3)
    awn_r = M.material("awnr", AWN_RED, double=True)
    awn_w = M.material("awnw", WHITE, double=True)
    trim = M.material("trim", (0.55, 0.40, 0.28))
    mural = M.material("mural", (0.20, 0.55, 0.72))
    fish_c = [
        M.material("f1", (0.95, 0.55, 0.10)),
        M.material("f2", (0.95, 0.85, 0.15)),
        M.material("f3", (0.95, 0.95, 0.95)),
        M.material("f4", (0.15, 0.65, 0.55)),
        M.material("f5", (0.85, 0.25, 0.20)),
    ]
    door = M.material("door", (0.15, 0.08, 0.05))
    H = 7.05
    for lod in (0, 1):
        W = lambda m: M.mesh(lod, m)
        wall_ring(W(brown), ring, 0, 1.25)
        wall_ring(W(white), ring, 1.25, H)
        fan(W(roof), ring, H, up=True)
        # thin roof lip
        lip = _offset(ring, 0.35)
        wall_ring(W(roof), lip, H, H + 0.28)
        fan(W(roof), lip, H + 0.28, up=True)
    nrm = M.mesh(0, "base").nrm[-1]
    last = _outward(ring)[-1]
    if nrm[0] * last[2] + nrm[2] * last[3] < 0.5:
        raise SystemExit(f"charlies wall normal {tuple(round(v, 2) for v in nrm)}")
    ups = sum(1 for i in range(0, len(M.mesh(0, "roof").nrm), 3) if M.mesh(0, "roof").nrm[i][1] > 0.5)
    if ups < 4:
        raise SystemExit(f"charlies roof up-facing tris {ups}")
    # floor band
    W = lambda m: M.mesh(0, m)
    wall_ring(W(trim), ring, 3.35, 3.55)
    edges = _outward(ring)
    # north front: longest edge whose outward z is most negative
    front = min(edges, key=lambda e: e[3])  # oz
    side = max(edges, key=lambda e: e[2])   # ox, the east street
    _awning_row(M, front, y=2.55, n=4, reach=1.35)
    _awning_row(M, side, y=2.55, n=2, reach=1.25)
    _awning_row(M, side, y=5.15, n=2, reach=1.05)
    # upper windows on the front
    _windows_along(M, front, y0=4.15, y1=6.15, n=4, glass=glass, frame=trim)
    _windows_along(M, side, y0=4.2, y1=6.05, n=2, glass=glass, frame=trim)
    # door on the front, near the east corner (the photo's corner entrance)
    _door_on_edge(M, front, door, along=0.72)
    # sea-life wall on the upper side-street face: a blue panel plus five fish
    _mural(M, side, mural, fish_c)
    png = sign_png("CHARLIE'S BAR", (250, 246, 236, 255), (196, 30, 36, 255), 640, 140)
    M.material("sign", WHITE, rough=0.45, double=True, textured=True)
    _sign_on_edge(M, front, y0=5.35, y1=6.7, along0=0.18, along1=0.82, mat="sign")
    info = write_glb(M, HERO / "charliesbar.glb", images=[png])
    check_glb(HERO / "charliesbar.glb")
    return info


def _ensure_ccw(ring):
    area = sum(
        ring[i][0] * ring[(i + 1) % len(ring)][1] - ring[(i + 1) % len(ring)][0] * ring[i][1]
        for i in range(len(ring))
    )
    return list(reversed(ring)) if area < 0 else ring


def _offset(ring, d):
    """Push each vertex out by the average of its two edge outward normals."""
    n = len(ring)
    outs = []
    for i in range(n):
        x0, z0 = ring[i]
        x1, z1 = ring[(i + 1) % n]
        dx, dz = x1 - x0, z1 - z0
        L = (dx * dx + dz * dz) ** 0.5 or 1
        outs.append((dz / L, -dx / L))
    out = []
    for i in range(n):
        ox = outs[i - 1][0] + outs[i][0]
        oz = outs[i - 1][1] + outs[i][1]
        L = (ox * ox + oz * oz) ** 0.5 or 1
        out.append((ring[i][0] + ox / L * d, ring[i][1] + oz / L * d))
    return out


def _edge_points(edge, along, y, reach=0):
    """Point along an edge (0..1) at height y, pushed `reach` metres outward."""
    mx, mz, ox, oz, L, a, b = edge
    x = a[0] + (b[0] - a[0]) * along + ox * reach
    z = a[1] + (b[1] - a[1]) * along + oz * reach
    return x, y, z


def _awning_row(M, edge, y, n, reach):
    for i in range(n):
        a0 = (i + 0.18) / n
        a1 = (i + 0.82) / n
        for s, mat in enumerate(("awnw", "awnr", "awnw", "awnr")):
            t0 = a0 + (a1 - a0) * s / 4
            t1 = a0 + (a1 - a0) * (s + 1) / 4
            p0 = _edge_points(edge, t0, y, 0.05)
            p1 = _edge_points(edge, t1, y, 0.05)
            p2 = _edge_points(edge, t1, y - 0.35, reach)
            p3 = _edge_points(edge, t0, y - 0.35, reach)
            # outward face
            M.mesh(0, mat).quad(p0, p1, p2, p3)


def _outward_quad(mesh, edge, a0, y0, a1, y1, reach):
    """Wall quad facing the outside of a CCW ring. along a0..a1, height y0..y1."""
    p00 = _edge_points(edge, a0, y0, reach)
    p01 = _edge_points(edge, a0, y1, reach)
    p11 = _edge_points(edge, a1, y1, reach)
    p10 = _edge_points(edge, a1, y0, reach)
    mesh.quad(p00, p01, p11, p10)
    n = mesh.nrm[-1]
    if n[0] * edge[2] + n[2] * edge[3] < 0.5:
        raise SystemExit(f"outward quad normal {tuple(round(v, 2) for v in n)} edge {(round(edge[2], 2), round(edge[3], 2))}")


def _windows_along(M, edge, y0, y1, n, glass, frame):
    for i in range(n):
        a0 = (i + 0.28) / n
        a1 = (i + 0.62) / n
        _outward_quad(M.mesh(0, glass), edge, a0, y0, a1, y1, 0.06)
        _outward_quad(M.mesh(0, frame), edge, a0 - 0.02, y0 - 0.08, a1 + 0.02, y0 + 0.06, 0.12)


def _door_on_edge(M, edge, mat, along):
    _outward_quad(M.mesh(0, mat), edge, along - 0.06, 0.05, along + 0.06, 2.5, 0.08)


def _sign_on_edge(M, edge, y0, y1, along0, along1, mat):
    # On a CCW ring the edge runs toward the outside viewer's left, so the
    # higher 'along' is the left end of the sign.
    sign_quad(
        M.mesh(0, mat),
        _edge_points(edge, along1, y1, 0.16),
        _edge_points(edge, along0, y1, 0.16),
        _edge_points(edge, along0, y0, 0.16),
        _edge_points(edge, along1, y0, 0.16),
    )
    n = M.mesh(0, mat).nrm[-1]
    if n[0] * edge[2] + n[2] * edge[3] < 0.5:
        raise SystemExit(f"sign normal {tuple(round(v, 2) for v in n)}")


def _mural(M, edge, mural, fish):
    _outward_quad(M.mesh(0, mural), edge, 0.12, 3.7, 0.88, 6.55, 0.08)
    tx = edge[6][0] - edge[5][0]
    tz = edge[6][1] - edge[5][1]
    L = (tx * tx + tz * tz) ** 0.5 or 1
    tx, tz = tx / L, tz / L
    for i, mat in enumerate(fish):
        a = 0.22 + i * 0.12
        mx, my, mz = _edge_points(edge, a, 4.4 + (i % 2) * 0.9, 0.18)
        top = (mx, my + 0.28, mz)
        bot = (mx, my - 0.22, mz)
        # +tangent is the outside viewer's left
        left = (mx + tx * 0.42, my, mz + tz * 0.42)
        right = (mx - tx * 0.42, my, mz - tz * 0.42)
        M.mesh(0, mat).tri(top, bot, right)
        M.mesh(0, mat).tri(top, left, bot)
        n = M.mesh(0, mat).nrm[-1]
        if n[0] * edge[2] + n[2] * edge[3] < 0.5:
            raise SystemExit(f"fish normal {tuple(round(v, 2) for v in n)}")


# ---------------------------------------------------------------- Zeerovers
# OSM way 639821170, on the sand at Savaneta with the sea to the south and
# Caya Rev. Pader Bruno Fick to the north. The real place is an open beach
# pavilion (picnic tables, posts, a roof), not a closed shed. Blue ZEEROVERS
# sign kept — that part of the old hero was right.

ZEER_RING = [
    (2530.41, 8178.97), (2542.04, 8161.79), (2543.34, 8162.68), (2548.19, 8150.73),
    (2556.53, 8153.73), (2550.28, 8167.75), (2558.37, 8172.00), (2557.18, 8177.87),
    (2555.02, 8177.38), (2551.08, 8187.66), (2549.58, 8186.94), (2544.29, 8191.69),
    (2542.19, 8193.57), (2539.05, 8196.12), (2528.57, 8183.93), (2532.13, 8181.09),
]
ZEER_O = (2545.84, 8174.19)


def build_zeerovers():
    ring = _ensure_ccw(_local(ZEER_RING, ZEER_O))
    M = Model("zeerovers")
    roof = M.material("roof", (0.72, 0.70, 0.64))
    post = M.material("post", WOOD)
    trim = M.material("trim", BLUE_SIGN)
    table = M.material("table", (0.55, 0.40, 0.24))
    bench = M.material("bench", (0.40, 0.28, 0.16))
    kitchen = M.material("wall", (0.90, 0.88, 0.82))
    base = M.material("base", (0.45, 0.42, 0.38))
    deck = M.material("deck", (0.78, 0.72, 0.60))
    # deck and roof from the footprint
    for lod in (0, 1):
        W = lambda m: M.mesh(lod, m)
        fan(W(deck), ring, 0.08, up=True)
        lip = _offset(ring, 1.1)
        fan(W(roof), lip, 3.55, up=True)
        wall_ring(W(trim), lip, 3.35, 3.62)
    # posts at every other vertex, full height
    for i, (x, z) in enumerate(ring):
        if i % 2:
            continue
        prism(M.mesh(0, "post"), x - 0.14, x + 0.14, z - 0.14, z + 0.14, 0, 3.45)
        if i % 4 == 0:
            prism(M.mesh(1, "post"), x - 0.18, x + 0.18, z - 0.18, z + 0.18, 0, 3.45)
    # kitchen block on the north side (toward the road): the edge with the most negative oz
    edges = _outward(ring)
    road = min(edges, key=lambda e: e[3])
    # a short enclosed kitchen inset from that edge
    k0 = _edge_points(road, 0.25, 0, -1.2)  # inward is -outward
    k1 = _edge_points(road, 0.75, 0, -1.2)
    k2 = _edge_points(road, 0.75, 0, -6.5)
    k3 = _edge_points(road, 0.25, 0, -6.5)
    kr = [(k0[0], k0[2]), (k1[0], k1[2]), (k2[0], k2[2]), (k3[0], k3[2])]
    # winding of kr may be CW because we walked inward; check area
    area = sum(kr[i][0] * kr[(i + 1) % 4][1] - kr[(i + 1) % 4][0] * kr[i][1] for i in range(4))
    if area < 0:
        kr = list(reversed(kr))
    for lod in (0, 1):
        wall_ring(M.mesh(lod, "base"), kr, 0, 0.8)
        wall_ring(M.mesh(lod, "wall"), kr, 0.8, 3.15)
        fan(M.mesh(lod, "roof"), kr, 3.2, up=True)
    # picnic tables — a handful, down the middle of the pavilion
    cx = sum(p[0] for p in ring) / len(ring)
    cz = sum(p[1] for p in ring) / len(ring)
    for i, (dx, dz) in enumerate(((-6, -4), (2, -2), (8, 3), (-4, 6), (5, 8), (-8, 2))):
        tx, tz = cx + dx, cz + dz
        prism(M.mesh(0, "table"), tx - 1.3, tx + 1.3, tz - 0.45, tz + 0.45, 0.72, 0.86)
        prism(M.mesh(0, "bench"), tx - 1.2, tx + 1.2, tz - 0.95, tz - 0.6, 0.4, 0.52)
        prism(M.mesh(0, "bench"), tx - 1.2, tx + 1.2, tz + 0.6, tz + 0.95, 0.4, 0.52)
    png = sign_png("ZEEROVERS", (10, 48, 130, 255), (255, 255, 255, 255), 640, 140)
    M.material("sign", WHITE, rough=0.45, double=True, textured=True)
    _sign_on_edge(M, road, y0=2.15, y1=3.15, along0=0.2, along1=0.8, mat="sign")
    info = write_glb(M, HERO / "zeerovers.glb", images=[png])
    check_glb(HERO / "zeerovers.glb")
    return info


# ---------------------------------------------------------------- Arikok VC
# OSM way 169938948. The old hero's walls used the uncoloured 'ground' material,
# so the lodge read as a white box under a brown lid. The park buildings are
# stone/earth with a deep eave. Sign wording is the park's own name.

ARIK_RING = [
    (2569.71, 2301.94), (2560.86, 2307.24), (2553.88, 2313.65), (2547.52, 2321.02),
    (2543.26, 2328.90), (2564.04, 2339.14), (2568.19, 2332.46), (2572.82, 2328.08),
    (2579.30, 2325.18),
]
ARIK_O = (2562.18, 2321.94)


def build_arikok():
    ring = _ensure_ccw(_local(ARIK_RING, ARIK_O))
    M = Model("arikokvc")
    wall = M.material("wall", STONE)
    base = M.material("base", STONE_DARK)
    roof = M.material("roof", PARK)
    trim = M.material("trim", (0.78, 0.68, 0.48))
    glass = M.material("glass", GLASS, rough=0.3)
    post = M.material("post", WOOD)
    for lod in (0, 1):
        W = lambda m: M.mesh(lod, m)
        wall_ring(W(base), ring, 0, 0.7)
        wall_ring(W(wall), ring, 0.7, 3.9)
        eave = _offset(ring, 2.0)
        fan(W(roof), eave, 4.35, up=True)
        wall_ring(W(roof), eave, 4.05, 4.4)
        fan(W(trim), ring, 3.95, up=True)
    # porch posts along the longest edge
    edges = _outward(ring)
    front = max(edges, key=lambda e: e[4])
    for t in (0.2, 0.5, 0.8):
        p = _edge_points(front, t, 0, 1.6)
        prism(M.mesh(0, "post"), p[0] - 0.16, p[0] + 0.16, p[2] - 0.16, p[2] + 0.16, 0, 4.05)
    # a run of windows on that face
    _windows_along(M, front, y0=1.5, y1=3.1, n=4, glass=glass, frame=trim)
    png = sign_png("PARKE NACIONAL ARIKOK", (92, 56, 30, 255), (255, 248, 230, 255), 768, 140)
    M.material("sign", WHITE, rough=0.5, double=True, textured=True)
    _sign_on_edge(M, front, y0=3.15, y1=4.15, along0=0.15, along1=0.85, mat="sign")
    info = write_glb(M, HERO / "arikokvc.glb", images=[png])
    check_glb(HERO / "arikokvc.glb")
    return info


# ---------------------------------------------------------------- tower + teal roof
def build_tower():
    # OSM way 97597616, man_made=tower, height tag 25 m. The cab sits on a
    # yellow shaft with an orange band; dark glass cab with yellow mullions;
    # mast above. Colours from Wikimedia "Roman Tokman Aruba Airport".
    M = Model("apt_tower")
    yel = M.material("yel", TOWER_YEL)
    ora = M.material("ora", TOWER_ORA)
    glass = M.material("glass", (0.04, 0.07, 0.10), rough=0.15)
    mull = M.material("mull", TOWER_YEL)
    steel = M.material("steel", STEEL, rough=0.4)
    roof = M.material("roof", (0.30, 0.32, 0.34))
    s = 5.6  # shaft width; the OSM ring is ~7 m across including the cab
    for lod in (0, 1):
        W = lambda m: M.mesh(lod, m)
        # Cab floor ends up ~14 m above the terminal roof, given this spot's terrain.
        prism(W(yel), -s / 2, s / 2, -s / 2, s / 2, 0, 14.0)
        prism(W(ora), -s / 2, s / 2, -s / 2, s / 2, 14.0, 16.4)
        prism(W(yel), -s / 2, s / 2, -s / 2, s / 2, 16.4, 17.4)
        # cab, wider
        c = 7.4
        prism(W(glass), -c / 2, c / 2, -c / 2, c / 2, 17.4, 23.4)
        prism(W(roof), -c / 2 - 0.3, c / 2 + 0.3, -c / 2 - 0.3, c / 2 + 0.3, 23.4, 24.2)
        # mast
        prism(W(steel), -0.18, 0.18, -0.18, 0.18, 24.2, 34.0)
        prism(W(steel), -1.4, 1.4, -0.08, 0.08, 29.2, 29.4)
    # yellow mullions on the cab, lod0
    c = 7.4
    for x in (-c / 2, -c / 6, c / 6, c / 2 - 0.18):
        prism(M.mesh(0, "mull"), x, x + 0.18, -c / 2 - 0.08, c / 2 + 0.08, 17.6, 23.2)
        prism(M.mesh(0, "mull"), -c / 2 - 0.08, c / 2 + 0.08, x, x + 0.18, 17.6, 23.2)
    # a small radar dish
    prism(M.mesh(0, "steel"), -0.9, 0.9, -0.9, 0.9, 27.0, 27.35)
    info = write_glb(M, HERO / "apt_tower.glb")
    check_glb(HERO / "apt_tower.glb")
    return info


def build_teal_roof():
    """Airside roof cap in the airport_fx hero's own frame (same origin).

    airport_fx body occupies local x -185..167, z -75..45, top y 6.1.
    The runway is to the south (+z), and that is the teal standing-seam roof
    in the airside photo. The landside half is left as the existing shell.
    """
    M = Model("apt_tealroof")
    roof = M.material("roof", TEAL)
    fascia = M.material("fascia", (0.16, 0.52, 0.52))
    x0, x1, z0, z1 = -178, 162, -8, 46
    for lod in (0, 1):
        W = lambda m: M.mesh(lod, m)
        prism(W(roof), x0, x1, z0, z1, 6.25, 6.7)
        # fascia so the teal reads from the apron, not only from above
        prism(W(fascia), x0, x1, z1 - 0.6, z1 + 0.35, 5.4, 6.75)
        prism(W(fascia), x0 - 0.3, x0 + 0.5, z0, z1, 5.6, 6.75)
        prism(W(fascia), x1 - 0.5, x1 + 0.3, z0, z1, 5.6, 6.75)
    info = write_glb(M, HERO / "apt_tealroof.glb")
    check_glb(HERO / "apt_tealroof.glb")
    return info


def manifest_entry(id_, name, x, z, info, switch, cat, hide, refs, new_place=True):
    return {
        "id": id_, "k": id_, "name": name, "status": "v5-accuracy",
        "x": round(x, 2), "z": round(z, 2), "y": 0, "rotation": 0,
        "glb": f"models/hero/{id_}.glb",
        "lod": {"hi": f"{id_}_lod0", "lo": f"{id_}_lod1", "switch_m": switch},
        "tris": {f"{id_}_lod0": info["lod0"], f"{id_}_lod1": info["lod1"]},
        "textures": 1 if id_ == "filomena" else 0,
        "hide_footprint": [[round(p[0], 2), round(p[1], 2)] for p in hide] if hide else None,
        "hide": [],
        "sign": False,
        "kind": "replace",
        "new_place": new_place,
        "geo_source": "OSM building footprint",
        "ref_sources": refs,
        "frame": "glb origin = footprint centroid (world x,z); glTF +X = world x, +Z = world z, Y up",
        "cat": cat,
    }


def patch_manifest(updates, new_entries):
    import re
    text = MANIFEST.read_text()
    for id_, info, ref in updates:
        text2, n = re.subn(
            rf'("{id_}_lod0": )\d+',
            rf'\g<1>{info["lod0"]}',
            text, count=1)
        text2, n2 = re.subn(
            rf'("{id_}_lod1": )\d+',
            rf'\g<1>{info["lod1"]}',
            text2, count=1)
        if n != 1 or n2 != 1:
            raise SystemExit(f"tris patch failed for {id_}: {n},{n2}")
        idx = text2.find(f'"id": "{id_}"')
        if idx < 0:
            raise SystemExit(f"id {id_} missing")
        nxt = text2.find('\n  "id":', idx + 4)
        ridx = text2.find('"ref_sources":', idx, nxt if nxt > 0 else len(text2))
        if ridx < 0:
            raise SystemExit(f"ref_sources missing for {id_}")
        q_open = text2.find('"', ridx + len('"ref_sources"'))
        q_close = q_open + 1
        while True:
            q_close = text2.find('"', q_close)
            if q_close < 0 or text2[q_close - 1] != "\\":
                break
            q_close += 1
        if q_close < 0:
            raise SystemExit(f"unterminated ref for {id_}")
        ref_esc = ref.replace("\\", "\\\\").replace('"', '\\"')
        text = text2[:q_open + 1] + ref_esc + text2[q_close:]
    extra = ""
    for e in new_entries:
        extra += ",\n" + json.dumps(e, indent=1)
    if not text.rstrip().endswith("]"):
        raise SystemExit("manifest does not end with ]")
    text = text.rstrip()
    # drop the closing bracket, insert, close
    if text.endswith("]"):
        text = text[:-1].rstrip()
        if text.endswith("}"):
            text = text + extra + "\n]\n"
        else:
            raise SystemExit("unexpected manifest ending")
    json.loads(text)
    MANIFEST.write_text(text)


def main():
    cx, cz, filo = build_filomena()
    print("filomena", round(cx, 2), round(cz, 2), filo)
    ch = build_charlies()
    print("charlies", ch)
    ze = build_zeerovers()
    print("zeerovers", ze)
    ar = build_arikok()
    print("arikok", ar)
    tw = build_tower()
    print("tower", tw)
    rf = build_teal_roof()
    print("roof", rf)
    n = recolor_materials(HERO / "airport_fx.glb", {
        "body": [0.78, 0.67, 0.52, 1],
        "wall": [0.82, 0.74, 0.62, 1],
        "roof": [0.22, 0.68, 0.66, 1],
        "lroof": [0.22, 0.68, 0.66, 1],
    })
    print("airport recolor", n)
    # tower centroid
    tower_ring = [
        (-4059.33, 1826.61), (-4056.78, 1826.13), (-4054.44, 1827.54), (-4053.79, 1830.28),
        (-4055.39, 1832.53), (-4058.07, 1833.03), (-4060.32, 1831.64), (-4060.94, 1828.90),
    ]
    tx, tz = _cent(tower_ring)
    filo_ref = (
        "Wikimedia Commons 'Santa Filomena Catholic Parish' and 'St Filomena Church (Paradera)' "
        "(marigold walls, white trim and cross, dark-brown plinth, red-brown gable roof, red door, "
        "louvered belfry). OSM way 170899528. West gable faces the Paradera road."
    )
    patch_manifest(
        [
            ("charliesbar", ch,
             "Wikimedia Commons 'Charlies Bar San Nicolas, Aruba' (2009): two-storey corner, white over a dark-brown dado, red/white striped awnings, CHARLIE'S BAR lettering, painted sea-life wall on Caya Charlie Brouns. OSM way 369622877. Simplified geometry, not a photo texture."),
            ("zeerovers", ze,
             "OSM way 639821170 on the Savaneta sand (sea to the south, Caya Rev. Pader Bruno Fick to the north). Open beach pavilion with posts, roof and picnic tables; blue ZEEROVERS sign kept from the previous hero."),
            ("arikokvc", ar,
             "OSM way 169938948. Earth-stone walls and a deep eave (the previous hero's walls were the uncoloured white material). Sign reads PARKE NACIONAL ARIKOK."),
        ],
        [
            manifest_entry(
                "filomena", "Misa Santa Filomena (Paradera)", cx, cz, filo, 320, "landmark",
                FILO_RING, filo_ref, True),
            manifest_entry(
                "apt_tower", "Queen Beatrix control tower", tx, tz, tw, 700, "landmark",
                tower_ring,
                "OSM way 97597616 man_made=tower (height tag 25 m). Wikimedia 'Roman Tokman Aruba Airport': yellow shaft, orange band, dark-glass cab with yellow mullions, mast.",
                True),
            manifest_entry(
                "apt_tealroof", "", -4180, 1900, rf, 800, "park",
                None,
                "Airside roof cap on the existing airport_fx shell. Wikimedia 'Roman Tokman Aruba Airport': turquoise standing-seam roof on the apron side. Same origin as airport_fx so it sits on that model.",
                False),
        ],
    )
    # apt_tealroof should not become a searchable place. manifest_entry with
    # new_place False still has a name key of "" which is fine.
    print("manifest updated")


if __name__ == "__main__":
    main()
