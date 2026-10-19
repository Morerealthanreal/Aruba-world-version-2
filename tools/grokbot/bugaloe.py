#!/usr/bin/env python3
"""Bugaloe at De Palm Pier: a thatched palapa bar on wooden pilings.

Same hero id and origin. The OSM footprint is only the shore end; the pier
runs west into the water. The night drone (YouTube zEBaFtoL3_o) shows the
long thatch roof, open sides, a lit deck and a catamaran alongside. Daytime
close-ups (arubaunleashed.com, 30a.com) show mint-painted posts, a blue bar,
hanging BUGALOE letters, a navy skirt at the waterline, and palms and
umbrellas on the sand. Geometry only. One sign image, shared by the gable,
the bar banner and the music board.
"""
import math
import json
import re
import struct
import sys
from pathlib import Path

from PIL import Image

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, fold_body, write_glb  # noqa: E402
from hotelkit import FONT_SANS, Frame, hip_roof, obox, png_bytes, text_png, tri_out, uquad, vquad  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-8523.4, -5313.88)

# Dried thatch from the daytime side photo: tan courses with a darker ragged
# hem, not a single bright yellow board.
STRAW = (0.72, 0.52, 0.28)
STRAW_D = (0.55, 0.36, 0.16)
FRINGE = (0.42, 0.26, 0.10)
WOOD = (0.50, 0.32, 0.16)
POST = (0.42, 0.26, 0.13)
DECK = (0.74, 0.58, 0.36)
DECK_D = (0.58, 0.42, 0.24)
RAIL = (0.48, 0.34, 0.20)
BULB = (0.42, 0.20, 0.06)
# Painted bar, from the interior and side photos.
TEAL = (0.42, 0.78, 0.74)
TEAL_D = (0.28, 0.55, 0.56)
CEIL = (0.62, 0.82, 0.88)
NAVY = (0.07, 0.10, 0.22)
SKIRT_W = (0.82, 0.84, 0.86)
BLUE = (0.13, 0.38, 0.78)
ORANGE = (0.86, 0.42, 0.16)
RED = (0.78, 0.16, 0.14)
YELLOW = (0.92, 0.76, 0.18)
PINK = (0.84, 0.52, 0.62)
GREEN = (0.18, 0.58, 0.32)
WHITE = (0.90, 0.90, 0.88)
HULL = (0.86, 0.42, 0.14)
NET = (0.55, 0.42, 0.26)
TRUNK = (0.40, 0.26, 0.13)
FROND = (0.14, 0.40, 0.16)
SKIN = (0.62, 0.44, 0.32)
SKINB = (0.40, 0.26, 0.18)
SHIRT = (0.12, 0.42, 0.82)
SHIRT2 = (0.90, 0.90, 0.92)
SHIRT3 = (0.85, 0.28, 0.32)
SHORTS = (0.12, 0.14, 0.18)
SHORTS2 = (0.20, 0.32, 0.62)

ATLAS_H = 320


def lin(c):
    return tuple(round(min(1, v) ** 2.2, 4) for v in c)


def slope_bands(mesh_a, mesh_b, F, u0, u1, v_edge, y0, rise, n, lift=0.08):
    """Thatch courses from the eave up to the ridge, lifted off the hip."""
    s = 1 if v_edge >= 0 else -1
    V = abs(v_edge)
    cen = F.p((u0 + u1) / 2, 0, y0 - 4)
    for i in range(n):
        f0, f1 = i / n, (i + 1) / n
        v0, v1 = s * V * (1 - f0), s * V * (1 - f1)
        ya = y0 + rise * f0 + lift
        yb = y0 + rise * f1 + lift + 0.03
        A, B = F.p(u0, v0, ya), F.p(u1, v0, ya)
        C, D = F.p(u1, v1, yb), F.p(u0, v1, yb)
        m = mesh_a if i % 2 == 0 else mesh_b
        tri_out(m, A, B, C, cen)
        tri_out(m, A, C, D, cen)


def fringe(mesh, F, u0, u1, v_edge, y, drop=1.15, out=0.72, step=1.05):
    """Hanging thatch along an eave. Lengths stagger so the edge is ragged."""
    s = 1 if v_edge >= 0 else -1
    u, k = u0, 0
    while u < u1 - 0.15:
        w = min(step, u1 - u)
        d0 = drop * (0.62 + 0.38 * ((k * 3) % 5) / 4)
        d1 = drop * (0.55 + 0.45 * ((k * 2) % 4) / 3)
        o0 = out * (0.75 + 0.25 * (k % 3) / 2)
        o1 = out * (0.7 + 0.3 * ((k + 2) % 3) / 2)
        A = F.p(u, v_edge, y + 0.05)
        B = F.p(u + w, v_edge, y + 0.05)
        C = F.p(u + w * 0.9, v_edge + s * o1, y - d1)
        D = F.p(u + w * 0.1, v_edge + s * o0, y - d0)
        cen = F.p(u + w / 2, v_edge - s * 1.5, y)
        tri_out(mesh, A, B, C, cen)
        tri_out(mesh, A, C, D, cen)
        u += step * 0.92
        k += 1


def _rnd(n):
    x = math.sin(n * 12.9898) * 43758.5453
    return x - math.floor(x)


def thatch_shag(mesh_a, mesh_b, F, u0, u1, v_edge, y0, rise):
    """One straw strip from the ridge to a ragged hem. No horizontal courses,
    which read as planks from the side."""
    s = 1 if v_edge >= 0 else -1
    V = abs(v_edge)
    u, k = u0, 1
    while u < u1 - 0.1:
        w = 0.22 + 0.16 * _rnd(k)
        for t in range(2):
            r0, r1, r2 = _rnd(k + t * 5), _rnd(k + t + 2), _rnd(k + t * 3 + 7)
            f_top = 0.72 + 0.26 * r0
            v_top = s * V * (1 - f_top)
            y_top = y0 + rise * f_top + 0.06
            droop = 0.25 + 0.85 * r1
            out = 0.55 + 0.95 * r2
            v_bot = s * (V + 0.15 + 0.35 * r2)
            y_bot = y0 - droop
            skew = (r0 - 0.5) * 0.18
            A = F.p(u + skew, v_top, y_top)
            B = F.p(u + w + skew, v_top + s * 0.04, y_top - 0.03)
            C = F.p(u + w * (0.55 + 0.3 * r1), v_bot + s * out, y_bot)
            D = F.p(u + w * 0.08, v_bot + s * out * 0.65, y_bot - 0.2 * r0)
            cen = F.p(u + w / 2, 0, y_top)
            m = mesh_a if r2 > 0.42 else mesh_b
            tri_out(m, A, B, C, cen)
            tri_out(m, A, C, D, cen)
        u += 0.24 + 0.1 * _rnd(k + 6)
        k += 1


def glyph(M, F, u, v, y, w, h, parts, color, depth=0.72):
    """3D block letter running along the pier. parts are (u0, u1, y0, y1) of the cell.
    Thickness is along +v, so a camera south of the pier reads the south face."""
    for uf0, uf1, yf0, yf1 in parts:
        obox(
            M.mesh(0, color), F,
            u + w * uf0, u + w * uf1,
            v, v + depth,
            y + h * yf0, y + h * yf1,
        )


# Front faces the shore, so a camera looking out to sea reads the word.
# Counters stay open so the word reads from the south drone, not as colour blocks.
GLYPHS = {
    "B": ((0.00, 0.22, 0, 1), (0.18, 0.86, 0.80, 1), (0.18, 0.72, 0.42, 0.56),
          (0.18, 0.92, 0, 0.18), (0.70, 0.92, 0.54, 0.84), (0.76, 1, 0.16, 0.44)),
    "U": ((0.00, 0.22, 0.16, 1), (0.78, 1, 0.16, 1), (0.16, 0.84, 0, 0.22)),
    "G": ((0.00, 0.22, 0.12, 0.88), (0.16, 0.92, 0.80, 1), (0.16, 0.92, 0, 0.18),
          (0.62, 1, 0.34, 0.50), (0.78, 1, 0.16, 0.52)),
    "A": ((0.08, 0.28, 0, 0.78), (0.72, 0.92, 0, 0.78), (0.16, 0.84, 0.78, 1), (0.24, 0.76, 0.38, 0.52)),
    "L": ((0.00, 0.24, 0, 1), (0.18, 1, 0, 0.18)),
    "O": ((0.00, 0.22, 0.16, 0.84), (0.78, 1, 0.16, 0.84), (0.16, 0.84, 0.82, 1), (0.16, 0.84, 0, 0.18)),
    "E": ((0.00, 0.24, 0, 1), (0.18, 1, 0.82, 1), (0.18, 0.78, 0.42, 0.56), (0.18, 1, 0, 0.18)),
}


def fringe_end(M, F, u, eave, V, rise):
    """A few ragged tags on a hip end, so the shore and sea ends are not a clean cut."""
    mesh = M.mesh(0, "fringe")
    s = -1 if u < F.L / 2 else 1
    v = -V * 0.7
    while v < V * 0.7:
        A = F.p(u, v, eave + rise * (1 - abs(v) / V) * 0.35)
        B = F.p(u, v + 1.1, eave + rise * (1 - abs(v + 1.1) / V) * 0.35)
        C = F.p(u + s * 0.7, v + 0.7, eave - 0.7)
        cen = F.p(u - s, 0, eave)
        tri_out(mesh, A, B, C, cen)
        v += 1.35


def hquad(mesh, F, u0, u1, v0, v1, y, up=1):
    A, B = F.p(u0, v0, y), F.p(u1, v0, y)
    C, D = F.p(u1, v1, y), F.p(u0, v1, y)
    cen = F.p((u0 + u1) / 2, (v0 + v1) / 2, y - up)
    tri_out(mesh, A, B, C, cen)
    tri_out(mesh, A, C, D, cen)


def paint_bulb(path):
    """The night pass brightens a material named bulb. Colour it amber, not grey."""
    data = Path(path).read_bytes()
    o = 12
    js = blob = None
    chunks = []
    while o < len(data) - 8:
        ln, ct = struct.unpack_from("<II", data, o)
        o += 8
        raw = data[o:o + ln]
        o += ln
        chunks.append((ct, raw))
        if ct == 0x4E4F534A:
            js = json.loads(raw)
        elif ct == 0x004E4942:
            blob = raw
    hit = False
    for mat in js["materials"]:
        if mat.get("name") == "bulb":
            mat["emissiveFactor"] = [1.0, 0.45, 0.08]
            hit = True
    if not hit:
        raise SystemExit("bulb material missing")
    js_bytes = json.dumps(js, separators=(",", ":")).encode()
    pad = (4 - len(js_bytes) % 4) % 4
    js_bytes += b" " * pad
    out = [b"glTF", struct.pack("<II", 2, 0)]
    body = b""
    for ct, raw in chunks:
        raw = js_bytes if ct == 0x4E4F534A else raw
        body += struct.pack("<II", len(raw), ct) + raw
    total = 12 + len(body)
    Path(path).write_bytes(b"glTF" + struct.pack("<II", 2, total) + body)
    if blob is None:
        raise SystemExit("glb bin missing")


def band_uv(y0, y1, H=ATLAS_H):
    """UVs for a horizontal band. v=0 is the top of the atlas."""
    vt, vb = y0 / H, y1 / H
    return ((0, vb), (1, vb), (1, vt), (0, vt))


def palm(M, F, u, v, h=7.4, lods=(0,)):
    for lod in lods:
        obox(M.mesh(lod, "trunk"), F, u - 0.16, u + 0.16, v - 0.16, v + 0.16, 0.05, h)
        if lod == 0:
            crown = F.p(u, v, h + 0.15)
            cen = F.p(u, v, h - 2)
            mesh = M.mesh(0, "frond")
            for i in range(6):
                a = i * math.tau / 6 + (0.4 if u < 0 else 0.1)
                du, dv = math.cos(a) * 2.5, math.sin(a) * 2.5
                p1 = F.p(u + du * 0.35, v + dv * 0.35, h - 0.15)
                p2 = F.p(u + du, v + dv, h - 1.55)
                tri_out(mesh, crown, p1, p2, cen)
        else:
            obox(M.mesh(lod, "frond"), F, u - 1.1, u + 1.1, v - 1.1, v + 1.1, h - 0.3, h + 0.7)


def umbrella(M, F, u, v, color):
    obox(M.mesh(0, "wood"), F, u - 0.06, u + 0.06, v - 0.06, v + 0.06, 0.05, 2.15)
    top = F.p(u, v, 2.35)
    cen = F.p(u, v, 1.5)
    mesh = M.mesh(0, color)
    for i in range(6):
        a0 = i * math.tau / 6
        a1 = (i + 1) * math.tau / 6
        r0 = F.p(u + math.cos(a0) * 1.35, v + math.sin(a0) * 1.35, 1.9)
        r1 = F.p(u + math.cos(a1) * 1.35, v + math.sin(a1) * 1.35, 1.9)
        tri_out(mesh, top, r0, r1, cen)


def person(M, F, u, v, y, shirt, shorts, skin="skin"):
    """Clothed figure of boxes, standing on y. Lod0 only."""
    obox(M.mesh(0, shorts), F, u - 0.14, u + 0.14, v - 0.10, v + 0.10, y, y + 0.70)
    obox(M.mesh(0, shirt), F, u - 0.18, u + 0.18, v - 0.12, v + 0.12, y + 0.68, y + 1.12)
    obox(M.mesh(0, skin), F, u - 0.08, u + 0.08, v - 0.08, v + 0.08, y + 1.12, y + 1.34)


def chair(M, F, u, v, y, color, face=1):
    """Wooden chair with a back, chunky enough for the drone."""
    obox(M.mesh(0, color), F, u - 0.22, u + 0.22, v - 0.22, v + 0.22, y + 0.38, y + 0.48)
    obox(M.mesh(0, color), F, u - 0.2, u + 0.2, v + face * 0.12, v + face * 0.22, y + 0.46, y + 0.98)
    obox(M.mesh(0, "wood"), F, u - 0.18, u - 0.1, v - 0.16, v - 0.08, y, y + 0.4)
    obox(M.mesh(0, "wood"), F, u + 0.1, u + 0.18, v + 0.08, v + 0.16, y, y + 0.4)


def seated(M, F, u, v, y, shirt, skin="skin"):
    obox(M.mesh(0, shirt), F, u - 0.15, u + 0.15, v - 0.11, v + 0.11, y + 0.42, y + 0.92)
    obox(M.mesh(0, skin), F, u - 0.07, u + 0.07, v - 0.07, v + 0.07, y + 0.92, y + 1.14)


def dining(M, F, u, v, y, chair_color):
    """Empty table and four chairs. People stay with agent A."""
    obox(M.mesh(0, "wood"), F, u - 0.55, u + 0.55, v - 0.4, v + 0.4, y + 0.68, y + 0.78)
    obox(M.mesh(0, "post"), F, u - 0.06, u + 0.06, v - 0.06, v + 0.06, y, y + 0.7)
    face = 1 if v >= 0 else -1
    other = "white" if chair_color == "red" else "red"
    for su in (-0.32, 0.32):
        chair(M, F, u + su, v - 0.22, y, chair_color, face)
        chair(M, F, u + su, v + 0.22, y, other, -face)


def sign_atlas():
    gable = text_png(["BUGALOE"], 512, 128, (255, 236, 190, 255), (92, 52, 24, 255), FONT_SANS)
    # Cream board, red letters, matching the beam over the bar.
    banner = text_png(["BEACH BAR - GRILL"], 512, 96, (255, 236, 190, 255), (176, 42, 34, 255), FONT_SANS)
    music = text_png(["MUSICA EN VIVO"], 512, 96, (214, 122, 36, 255), (255, 244, 220, 255), FONT_SANS)
    im = Image.new("RGBA", (512, ATLAS_H), (0, 0, 0, 0))
    im.paste(gable, (0, 0))
    im.paste(banner, (0, 128))
    im.paste(music, (0, 224))
    return im


def build():
    M = Model("bugaloe")
    colours = (
        ("straw", STRAW, .95), ("strawd", STRAW_D, .95), ("fringe", FRINGE, 1),
        ("wood", WOOD, .8), ("deck", DECK, .75), ("deckd", DECK_D, .8),
        ("rail", RAIL, .55), ("post", POST, .8),
        ("teal", TEAL, .55), ("teald", TEAL_D, .6), ("ceil", CEIL, .5),
        ("navy", NAVY, .8), ("skirtw", SKIRT_W, .6),
        ("blue", BLUE, .45), ("orange", ORANGE, .6), ("red", RED, .55),
        ("yellow", YELLOW, .5), ("pink", PINK, .55), ("green", GREEN, .55),
        ("white", WHITE, .4), ("hull", HULL, .6), ("net", NET, .9),
        ("trunk", TRUNK, .85), ("frond", FROND, .8),
        ("skin", SKIN, .7), ("skinb", SKINB, .7),
        ("shirt", SHIRT, .55), ("shirt2", SHIRT2, .55), ("shirt3", SHIRT3, .55),
        ("shorts", SHORTS, .7), ("shorts2", SHORTS2, .7),
    )
    for n, c, r in colours:
        M.material(n, lin(c), rough=r)
    M.material("bulb", lin(BULB), rough=.4, emissive=.85)
    M.material("sign", (0.96, 0.93, 0.84), rough=.5, textured=True, emissive=.22)

    # shore (east, u=0) to sea (west). The aerial pier leaves the beach going west.
    # Two hips: a near-square pavilion at the beach end and a long hip down the pier,
    # the pair the daytime side photo shows. +v is north.
    F = Frame((-8516.0, -5310.5), (-8586.0, -5322.0), O)
    L, hv = F.L, 5.4
    deck_y = 1.25
    overhang = 1.65
    V = hv + overhang
    # u0, u1, eave, rise. A gap between them so the side camera sees two peaks.
    # Eaves sit high so the south side stays open under a short hem. The drone
    # looks into that opening the way the daytime photo does.
    roofs = (
        (-0.5, 16.4, 3.9, 2.5),
        (19.0, L + 0.35, 4.2, 3.05),
    )

    def eave_at(u):
        for u0, u1, eave, _rise in roofs:
            if u0 - 0.4 <= u <= u1 + 0.2:
                return eave
        return roofs[0][2]

    for lod in (0, 1):
        obox(M.mesh(lod, "deck"), F, -1.2, L + 1.0, -hv - 0.15, hv + 0.15, deck_y - 0.32, deck_y + 0.08)
        for u0, u1, eave, rise in roofs:
            # Dark hip underneath. The straw tags cover it; gaps read as shadow, not boards.
            hip_roof(M.mesh(lod, "strawd"), F, u0, u1, -V, V, eave, rise)
            inset = min(V, (u1 - u0) * 0.46)
            ru0, ru1 = u0 + inset, u1 - inset
            if ru1 < ru0:
                ru0 = ru1 = (u0 + u1) / 2
            cap = "straw" if lod == 0 else "strawd"
            obox(M.mesh(lod, cap), F, ru0 - 0.15, ru1 + 0.15, -0.32, 0.32,
                 eave + rise - 0.04, eave + rise + (0.38 if lod == 0 else 0.28))
            # No long courses here. Continuous bands read as boards from a low side camera.
            # The ragged flaps further down are what makes the hip look like thatch.
        # shore gable of the pavilion
        obox(M.mesh(lod, "orange"), F, -0.35, 0.22, -hv + 0.15, hv - 0.15, deck_y, roofs[0][2] - 0.2)

    # pilings the whole way, into the water
    for lod, step in ((0, 5.4), (1, 10.8)):
        u = 1.6
        while u < L - 0.6:
            for s in (-1, 1):
                obox(M.mesh(lod, "post"), F, u - 0.26, u + 0.26, s * (hv - 0.15), s * (hv + 0.42),
                     -2.4, deck_y - 0.05)
            u += step
        for s in (-1, 1):
            obox(M.mesh(lod, "wood"), F, 1.2, L - 0.4, s * (hv - 0.05), s * (hv + 0.26),
                 deck_y - 0.55, deck_y - 0.28)

    # navy skirt, cut into drapes so the hem sags, with a white trim where it meets the deck
    u = 0.3
    k = 0
    while u < L - 0.2:
        w = min(2.15, L - 0.2 - u)
        sag = 0.12 + 0.42 * ((k * 3) % 5) / 4
        for s in (-1, 1):
            vquad(M.mesh(0, "navy"), F, u, u + w, s * (hv + 0.52), -0.02 - sag, deck_y - 0.1, s)
        u += 2.05
        k += 1
    for lod in (0, 1):
        for s in (-1, 1):
            if lod == 1:
                vquad(M.mesh(1, "navy"), F, 0.4, L + 0.4, s * (hv + 0.52), -0.15, deck_y - 0.1, s)
            vquad(M.mesh(lod, "skirtw"), F, 0.3, L + 0.4, s * (hv + 0.56), deck_y - 0.12, deck_y + 0.08, s)
        uquad(M.mesh(lod, "navy"), F, L + 0.7, -hv - 0.15, hv + 0.15, -0.2, deck_y - 0.08, 1)

    # teal posts, painted panels, rails. Height follows whichever hip is overhead.
    posts = []
    u = 2.2
    panels = ("orange", "red", "yellow", "blue", "green")
    while u < L - 1.6:
        posts.append(u)
        u += 4.6
    for i, u in enumerate(posts):
        ev = eave_at(u)
        for s in (-1, 1):
            obox(M.mesh(0, "teal"), F, u - 0.15, u + 0.15, s * (hv - 0.72), s * (hv - 0.32), deck_y, ev + 0.04)
            vquad(M.mesh(0, panels[i % len(panels)]), F, u - 0.09, u + 0.09, s * (hv - 0.28),
                  deck_y + 0.55, ev - 0.55, s)
            vv = s * (hv - 0.38)
            # The hanging BUGALOE sits in this bay. A rail across it cuts the letters.
            if u + 2.15 < 5.3 or u - 2.15 > 14.5:
                vquad(M.mesh(0, "rail"), F, u - 2.15, u + 2.15, vv, deck_y + 0.84, deck_y + 0.98, s)
                vquad(M.mesh(0, "rail"), F, u - 2.15, u + 2.15, vv, deck_y + 0.4, deck_y + 0.5, s)
        # Keep the cross-beam out of the letter bay so it does not cut the sign.
        if not (5.5 < u < 15.2):
            obox(M.mesh(0, "teal"), F, u - 0.1, u + 0.1, -(hv - 0.55), hv - 0.55, ev - 0.22, ev - 0.02)
    for s in (-1, 1):
        vquad(M.mesh(1, "rail"), F, 1.0, L - 1.5, s * (hv - 0.35), deck_y + 0.7, deck_y + 0.95, s)
        for u0, u1, eave, _rise in roofs:
            vquad(M.mesh(1, "fringe"), F, u0 + 0.4, u1 - 0.3, s * (V + 0.3), eave - 0.85, eave + 0.05, s)

    # String lights under the hem, and lanterns in the open side. The night drone
    # looks into the south opening and sees the amber ceiling through it.
    for u0, u1, eave, _rise in roofs:
        uu = u0 + 0.6
        while uu < u1 - 0.4:
            for s in (-1, 1):
                obox(M.mesh(0, "bulb"), F, uu - 0.11, uu + 0.11, s * (V + 0.35) - 0.11, s * (V + 0.35) + 0.11, eave - 0.72, eave - 0.28)
                hquad(M.mesh(0, "bulb"), F, uu - 0.16, uu + 0.16, s * (V + 0.22), s * (V + 0.55), eave - 0.7)
            uu += 1.7
        for s in (-1, 1):
            # Warm band just under the eave, above the furniture, facing the opening.
            vquad(M.mesh(0, "bulb"), F, u0 + 0.4, u1 - 0.4, s * (hv - 0.15), eave - 1.05, eave - 0.12, s)
        # Ceiling, plus the south opening itself, which is what the drone looks into.
        hquad(M.mesh(0, "bulb"), F, u0 + 0.8, u1 - 0.8, -2.4, 2.4, eave + 0.55, up=-1)
        vquad(M.mesh(0, "bulb"), F, u0 + 0.6, u1 - 0.6, -3.15, deck_y + 0.85, eave - 0.55, -1)
        uu = u0 + 1.4
        while uu < u1 - 1.0:
            obox(M.mesh(0, "bulb"), F, uu - 0.16, uu + 0.16, -4.55, -4.15, eave - 1.45, eave - 0.55)
            uu += 3.1
    # king posts and a light-blue plank ceiling under each hip
    for u0, u1, eave, rise in roofs:
        u = u0 + 4.2
        while u < u1 - 3.0:
            if not (24.0 < u < 32.0):
                for s in (-1, 1):
                    obox(M.mesh(0, "teal"), F, u - 0.08, u + 0.08, s * 1.7, s * 1.95, deck_y + 1.1, eave + rise * 0.55)
            u += 11.0
        # Plank ceiling sits above the banner. The ridge is higher, so this stays inside the hip.
        obox(M.mesh(0, "ceil"), F, u0 + 1.2, u1 - 1.2, -2.7, 2.7, eave + 1.65, eave + 1.8)

    # Shag on the slope, and a short ragged hem. The hem must not close the open side.
    for u0, u1, eave, rise in roofs:
        for s in (V, -V):
            fringe(M.mesh(0, "fringe"), F, u0 + 0.1, u1 - 0.1, s, eave, drop=0.72, out=1.45, step=0.58)
            thatch_shag(M.mesh(0, "straw"), M.mesh(0, "strawd"), F, u0 + 0.15, u1 - 0.1, s, eave, rise)
        fringe_end(M, F, u0 + 0.05, eave, V, rise)
        fringe_end(M, F, u1 - 0.05, eave, V, rise)

    # Bar sits inboard so the south drone sees tables, not a blue wall.
    obox(M.mesh(0, "blue"), F, 3.2, 12.2, -2.55, -1.35, deck_y, deck_y + 1.05)
    obox(M.mesh(0, "wood"), F, 3.1, 12.4, -2.7, -1.2, deck_y + 1.02, deck_y + 1.14)
    bar0, bar1 = 22.0, 36.5
    obox(M.mesh(0, "blue"), F, bar0, bar1, -2.7, -1.15, deck_y, deck_y + 1.02)
    obox(M.mesh(0, "wood"), F, bar0 - 0.1, bar1 + 0.12, -2.85, -1.0, deck_y + 1.0, deck_y + 1.12)
    obox(M.mesh(0, "wood"), F, bar0 + 0.8, bar1 - 0.8, -2.35, -1.7, deck_y + 1.12, deck_y + 2.05)
    bu = bar0 + 1.4
    for name in ("shirt2", "green", "yellow", "shirt", "orange", "white"):
        obox(M.mesh(0, name), F, bu, bu + 0.14, -2.15, -1.95, deck_y + 2.05, deck_y + 2.4)
        bu += 1.6
    u = bar0 + 1.2
    while u < bar1 - 0.8:
        hquad(M.mesh(0, "white"), F, u - 0.16, u + 0.16, -0.95, -0.55, deck_y + 0.62)
        vquad(M.mesh(0, "white"), F, u - 0.14, u + 0.14, -0.62, deck_y + 0.62, deck_y + 1.0, 1)
        u += 1.7
    # red bench on the north side of the shore pavilion. The south side is tables.
    obox(M.mesh(0, "red"), F, 3.2, 13.5, 3.15, 4.15, deck_y, deck_y + 0.46)
    obox(M.mesh(0, "red"), F, 3.2, 13.5, 3.99, 4.31, deck_y + 0.46, deck_y + 0.92)
    # deck planks as strips, not boxes
    u = 0.4
    while u < L - 0.3:
        hquad(M.mesh(0, "deckd"), F, u, u + 0.16, -hv + 0.55, hv - 0.55, deck_y + 0.09)
        u += 1.7
    # Empty tables and red/white chairs along the south opening, where the drone looks in.
    for tu, tv, col in (
        (4.2, -4.55, "red"), (7.8, -4.4, "white"), (11.2, -4.6, "red"),
        (5.4, 2.3, "white"), (9.6, 2.5, "red"),
        (24.0, -4.5, "white"), (30.0, -4.35, "red"), (36.5, -4.55, "white"),
        (43.5, -4.4, "red"), (50.5, -4.5, "white"), (58.0, -4.3, "red"), (65.0, -4.4, "white"),
        (27.5, 2.4, "red"), (40.5, 2.3, "white"), (52.5, 2.5, "red"),
    ):
        dining(M, F, tu, tv, deck_y, col)
    # Narrow amber strips on the deck edge. The night drone sees them through the open side.
    hquad(M.mesh(0, "bulb"), F, 1.5, 15.5, -5.05, -4.45, deck_y + 0.11)
    hquad(M.mesh(0, "bulb"), F, 20.0, L - 1.0, -5.05, -4.45, deck_y + 0.11)

    # 3D coloured BUGALOE under the shore pavilion, facing the south drone.
    # +u is west, which is screen-left when that camera looks north, so B is the west letter.
    letter_cols = (("B", "red"), ("U", "pink"), ("G", "blue"), ("A", "yellow"),
                   ("L", "green"), ("O", "orange"), ("E", "green"))
    lw, gap, lh = 1.32, 0.08, 1.32
    step = lw + gap
    u_left = 14.0
    v_let = -4.35
    ly0 = deck_y + 0.58
    for i, (ch, mat) in enumerate(letter_cols):
        glyph(M, F, u_left - i * step, v_let, ly0, lw, lh, GLYPHS[ch], mat)
    u_right = u_left - (len(letter_cols) - 1) * step
    # Nets over and beside the letters, and swags under both roofs.
    hquad(M.mesh(0, "net"), F, u_right - 0.4, u_left + lw + 0.35, v_let - 0.25, v_let + 0.85, ly0 + lh + 0.08)
    vquad(M.mesh(0, "net"), F, u_right - 0.15, u_right + 0.7, v_let - 0.05, ly0 - 0.15, ly0 + lh + 0.2, -1)
    vquad(M.mesh(0, "net"), F, u_left + lw - 0.55, u_left + lw + 0.25, v_let - 0.05, ly0 - 0.15, ly0 + lh + 0.25, -1)
    for i in range(len(letter_cols) - 1):
        uu = u_left - i * step - gap
        hquad(M.mesh(0, "bulb"), F, uu - 0.08, uu + 0.08, v_let + 0.05, v_let + 0.28, ly0 + lh - 0.05)
    for uu, yy in ((5.2, roofs[0][2] - 0.05), (10.2, roofs[0][2] - 0.05),
                   (26.0, roofs[1][2] - 0.05), (38.0, roofs[1][2] - 0.05),
                   (50.0, roofs[1][2] - 0.05), (62.0, roofs[1][2] - 0.05)):
        hquad(M.mesh(0, "net"), F, uu, uu + 3.2, -2.8, 2.8, yy)
        vquad(M.mesh(0, "net"), F, uu + 0.2, uu + 2.8, -2.5, yy - 1.25, yy + 0.05, -1)
        vquad(M.mesh(0, "net"), F, uu + 0.2, uu + 2.8, 2.5, yy - 1.25, yy + 0.05, 1)

    # catamaran on the north side, in front of a camera standing north of the pier
    cu0, cu1 = 40.0, 58.0
    for lod in (0, 1):
        for vv in (10.6, 15.2):
            obox(M.mesh(lod, "hull"), F, cu0, cu1, vv - 0.65, vv + 0.65, -0.25, 0.85)
            obox(M.mesh(lod, "white"), F, cu0 + 0.4, cu1 - 0.4, vv - 0.5, vv + 0.5, 0.7, 1.05)
        obox(M.mesh(lod, "white"), F, cu0 + 1.4, cu1 - 1.1, 11.0, 14.8, 0.95, 1.18)
        obox(M.mesh(lod, "teal"), F, (cu0 + cu1) / 2 - 0.1, (cu0 + cu1) / 2 + 0.1, 12.6, 12.95, 1.15, 9.2)
    obox(M.mesh(0, "white"), F, 46, 54, 11.6, 14.2, 1.18, 2.35)
    hquad(M.mesh(0, "net"), F, cu0 + 0.6, cu1 - 0.6, 11.2, 14.6, 1.08)
    uu = cu0 + 1.0
    while uu < cu1 - 0.6:
        for vv in (11.15, 14.55):
            hquad(M.mesh(0, "bulb"), F, uu - 0.22, uu + 0.22, vv - 0.18, vv + 0.18, 1.28)
        uu += 2.3
    vquad(M.mesh(0, "bulb"), F, 43.2, 43.55, 12.9, 2.15, 2.45, 1)

    # palms and umbrellas on the sand east of the pier
    for u, v in ((-6, -9), (-12, -4), (-18, 2), (-8, 8), (-15, 13), (-11, -15), (-20, 7), (-4, 4), (-16, -10)):
        palm(M, F, u, v, h=6.4 + (abs(int(v)) % 3) * 0.7, lods=(0, 1) if abs(u) < 14 else (0,))
        hquad(M.mesh(0, "bulb"), F, u - 0.12, u + 0.12, v - 0.12, v + 0.12, 1.7)
    for u, v, col in (
        (-3.2, -6.5, "red"), (-4.2, 6.2, "yellow"), (-5.5, 12.5, "blue"),
        (-3.8, -13.5, "orange"), (-7.5, -1.5, "white"), (-6.2, 16.5, "green"),
        (-9.5, -8.5, "red"), (-2.4, 2.2, "blue"),
    ):
        umbrella(M, F, u, v, col)

    png = sign_atlas()
    # BUGALOE on the shore gable, facing the beach
    uquad(M.mesh(0, "sign"), F, -0.48, -3.4, 3.4, roofs[0][2] - 1.7, roofs[0][2] - 0.25, -1, uvs=band_uv(0, 128))
    uquad(M.mesh(1, "sign"), F, -0.48, -3.4, 3.4, roofs[0][2] - 1.7, roofs[0][2] - 0.25, -1, uvs=band_uv(0, 128))
    # Beach Bar-Grill above the letters, facing the south drone.
    vquad(M.mesh(0, "sign"), F, u_right - 0.3, u_left + lw + 0.3, v_let - 0.06,
          ly0 + lh + 0.18, ly0 + lh + 0.72, -1, uvs=band_uv(128, 224))
    long_eave = roofs[1][2]
    vquad(M.mesh(0, "sign"), F, 28.0, 40.5, hv - 0.15, long_eave - 0.05, long_eave + 0.62, 1, uvs=band_uv(128, 224))
    vquad(M.mesh(0, "sign"), F, 28.0, 40.5, -(hv - 0.15), long_eave - 0.05, long_eave + 0.62, -1, uvs=band_uv(128, 224))
    # music board on the south wall beside the bar, facing into the room
    vquad(M.mesh(0, "sign"), F, 22.4, 28.6, -4.85, deck_y + 1.25, deck_y + 2.15, 1, uvs=band_uv(224, 320))

    # Sign keeps its texture and bulb keeps its name. Everything else is one
    # vertex-coloured mesh per LOD so the phone soak does not upload a geometry
    # per timber colour.
    fold_body(M, keep={"sign", "bulb"})
    info = write_glb(M, HERO / "bugaloe.glb", images=[png_bytes(png)])
    paint_bulb(HERO / "bugaloe.glb")
    check_glb(HERO / "bugaloe.glb")
    if not (2500 <= info["lod0"] <= 14000):
        print("WARN lod0", info["lod0"])
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    patch(info)
    # world anchors for the spot camera (F.p is origin-local)
    def world(u, v, y):
        x, yy, z = F.p(u, v, y)
        return (round(x + O[0], 1), round(z + O[1], 1), round(yy, 2))
    print("bugaloe", info, "pier", round(L, 1))
    print("anchors", {
        "bar": world(16, 0, deck_y),
        "north": world(42, 24, 3),
        "deck": world(30, -2, deck_y),
        "beach": world(-10, 0, 1),
        "boat": world(47, 13.4, 1.2),
    })
    return info


def patch(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "bugaloe"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = re.sub(r'"status": "[^"]*"',
                    '"status": "v10-grokbot (ridge-to-hem shag, deck tables, hanging letters)"', block, count=1)
    block = re.sub(r'"bugaloe_lod0": \d+', f'"bugaloe_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"bugaloe_lod1": \d+', f'"bugaloe_lod1": {info["lod1"]}', block, count=1)
    block = re.sub(r'"switch_m": \d+', '"switch_m": 220', block, count=1)
    block = re.sub(
        r'"ref_sources": "[^"]*"',
        '"ref_sources": "Night drone (YouTube zEBaFtoL3_o): two thatch hips, string lights, lit hotels and palms, catamaran with deck lights. Daytime (30a.com, arubaunleashed.com): golden hips, teal posts, navy skirt, BUGALOE letters, Beach Bar-Grill board, nets, red and white chairs. Esri aerial: pier west from this footprint. Built by tools/grokbot/bugaloe.py"',
        block, count=1)
    if "tools/grokbot/bugaloe.py" not in block:
        raise SystemExit("bugaloe ref anchor missing")
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == "bugaloe")
    assert hit["tris"]["bugaloe_lod0"] == info["lod0"]
    assert hit["lod"]["switch_m"] == 220
    assert hit["textures"] == 1


if __name__ == "__main__":
    build()
