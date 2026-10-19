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
BULB = (1.0, 0.86, 0.45)
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


def thatch_shag(mesh_a, mesh_b, F, u0, u1, v_edge, y0, rise, courses=3, step=1.7):
    """Short flaps up the slope. Irregular, so the hip reads as thatch from the side."""
    s = 1 if v_edge >= 0 else -1
    V = abs(v_edge)
    for c in range(courses):
        f = (c + 0.65) / (courses + 0.8)
        v = s * V * (1 - f)
        y = y0 + rise * f
        u, k = u0, c
        while u < u1 - 0.3:
            w = min(step * (0.7 + 0.4 * ((k * 3) % 4) / 3), u1 - u)
            hang = 0.42 + 0.38 * ((k + c) % 4) / 3
            out = 0.28 + 0.22 * (k % 3) / 2
            A = F.p(u, v, y + 0.05)
            B = F.p(u + w, v, y + 0.04)
            C = F.p(u + w * 0.8, v + s * out, y - hang)
            D = F.p(u + w * 0.15, v + s * out * 0.85, y - hang * 0.75)
            cen = F.p(u + w / 2, v - s * 2, y)
            m = mesh_a if (k + c) % 2 == 0 else mesh_b
            tri_out(m, A, B, C, cen)
            tri_out(m, A, C, D, cen)
            u += step * 0.9
            k += 1


def glyph(M, F, u, v, y, w, h, parts, color, depth=0.32):
    """Block letter. parts are fractions (v0, v1, y0, y1) of the cell."""
    for vf0, vf1, yf0, yf1 in parts:
        obox(
            M.mesh(0, color), F,
            u, u + depth,
            v + w * vf0, v + w * vf1,
            y + h * yf0, y + h * yf1,
        )


# Front faces the shore, so a camera looking out to sea reads the word.
GLYPHS = {
    "B": ((0.00, 0.28, 0, 1), (0.22, 0.95, 0.76, 1), (0.22, 0.95, 0.40, 0.60),
          (0.22, 1.00, 0, 0.22), (0.70, 1.00, 0.55, 0.80), (0.70, 1.00, 0.18, 0.42)),
    "U": ((0.00, 0.26, 0.18, 1), (0.74, 1, 0.18, 1), (0.16, 0.84, 0, 0.24)),
    "G": ((0.00, 0.26, 0, 1), (0.18, 1, 0.78, 1), (0.18, 1, 0, 0.22), (0.52, 1, 0.36, 0.54)),
    "A": ((0.00, 0.26, 0, 0.84), (0.74, 1, 0, 0.84), (0.12, 0.88, 0.78, 1), (0.18, 0.82, 0.40, 0.56)),
    "L": ((0.00, 0.28, 0, 1), (0.18, 1, 0, 0.22)),
    "O": ((0.00, 0.24, 0.16, 0.84), (0.76, 1, 0.16, 0.84), (0.16, 0.84, 0.78, 1), (0.16, 0.84, 0, 0.22)),
    "E": ((0.00, 0.28, 0, 1), (0.20, 1, 0.78, 1), (0.20, 0.82, 0.40, 0.58), (0.20, 1, 0, 0.22)),
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
    """Seat and back. Two quads, so a full deck of them stays inside the budget."""
    hquad(M.mesh(0, color), F, u - 0.2, u + 0.2, v - 0.2, v + 0.2, y + 0.42)
    vquad(M.mesh(0, color), F, u - 0.18, u + 0.18, v + face * 0.16, y + 0.42, y + 0.92, face)


def seated(M, F, u, v, y, shirt, skin="skin"):
    obox(M.mesh(0, shirt), F, u - 0.15, u + 0.15, v - 0.11, v + 0.11, y + 0.42, y + 0.92)
    obox(M.mesh(0, skin), F, u - 0.07, u + 0.07, v - 0.07, v + 0.07, y + 0.92, y + 1.14)


def dining(M, F, u, v, y, chair_color, sitter=None):
    hquad(M.mesh(0, "wood"), F, u - 0.48, u + 0.48, v - 0.36, v + 0.36, y + 0.7)
    obox(M.mesh(0, "post"), F, u - 0.05, u + 0.05, v - 0.05, v + 0.05, y, y + 0.7)
    face = 1 if v >= 0 else -1
    for su in (-0.28, 0.28):
        chair(M, F, u + su, v - 0.15, y, chair_color, face)
        chair(M, F, u + su, v + 0.15, y, "white" if chair_color == "red" else "red", -face)
    if sitter:
        seated(M, F, u, v - 0.05, y, sitter, "skin" if u % 2 < 1 else "skinb")


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
    roofs = (
        (-0.5, 16.4, 3.05, 3.2),
        (19.0, L + 0.35, 3.50, 4.25),
    )

    def eave_at(u):
        for u0, u1, eave, _rise in roofs:
            if u0 - 0.4 <= u <= u1 + 0.2:
                return eave
        return roofs[0][2]

    for lod in (0, 1):
        obox(M.mesh(lod, "deck"), F, -1.2, L + 1.0, -hv - 0.15, hv + 0.15, deck_y - 0.32, deck_y + 0.08)
        for u0, u1, eave, rise in roofs:
            hip_roof(M.mesh(lod, "straw"), F, u0, u1, -V, V, eave, rise)
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
            vquad(M.mesh(0, "rail"), F, u - 2.15, u + 2.15, vv, deck_y + 0.84, deck_y + 0.98, s)
            vquad(M.mesh(0, "rail"), F, u - 2.15, u + 2.15, vv, deck_y + 0.4, deck_y + 0.5, s)
        # Keep the cross-beam out of the letter bay so it does not cut the sign.
        if not (24.2 < u < 31.5):
            obox(M.mesh(0, "teal"), F, u - 0.1, u + 0.1, -(hv - 0.55), hv - 0.55, ev - 0.22, ev - 0.02)
    for s in (-1, 1):
        vquad(M.mesh(1, "rail"), F, 1.0, L - 1.5, s * (hv - 0.35), deck_y + 0.7, deck_y + 0.95, s)
        for u0, u1, eave, _rise in roofs:
            vquad(M.mesh(1, "fringe"), F, u0 + 0.4, u1 - 0.3, s * (V + 0.3), eave - 0.85, eave + 0.05, s)

    # warm string lights: a glow the night drone sees from above, and a face the side camera sees
    for u0, u1, eave, _rise in roofs:
        uu = u0 + 1.2
        while uu < u1 - 0.8:
            for s in (-1, 1):
                # Outside the thatch lip, so a side camera and the night drone both see the run.
                hquad(M.mesh(0, "bulb"), F, uu - 0.22, uu + 0.22, s * (V + 0.15) - 0.2, s * (V + 0.15) + 0.2, eave - 0.08)
                vquad(M.mesh(0, "bulb"), F, uu - 0.16, uu + 0.16, s * (V + 0.35), eave - 0.7, eave - 0.22, s)
            hquad(M.mesh(0, "bulb"), F, uu - 0.16, uu + 0.16, -0.16, 0.16, eave + 0.42)
            uu += 2.6
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

    # shaggy eaves on both hips. Leave the letter bay open so BUGALOE is readable.
    for u0, u1, eave, rise in roofs:
        spans = [(u0 + 0.2, min(u1 - 0.15, 23.5)), (max(u0 + 0.2, 33.5), u1 - 0.15)]
        for a, b in spans:
            if b - a < 1.2:
                continue
            fringe(M.mesh(0, "fringe"), F, a, b, V, eave, drop=1.45, out=0.95, step=1.28)
            fringe(M.mesh(0, "fringe"), F, a, b, -V, eave, drop=1.45, out=0.95, step=1.28)
            thatch_shag(M.mesh(0, "straw"), M.mesh(0, "strawd"), F, a, b, V, eave, rise, courses=3, step=1.7)
            thatch_shag(M.mesh(0, "straw"), M.mesh(0, "strawd"), F, a, b, -V, eave, rise, courses=3, step=1.7)
        # Only the outer hip ends. Tags on the inner ends hang into the gap and cover the letters.
        if u0 < 5:
            fringe_end(M, F, u0 + 0.05, eave, V, rise)
        if u1 > F.L - 2:
            fringe_end(M, F, u1 - 0.05, eave, V, rise)

    # bar along the south side of the long hip, so an eye-level camera looking
    # west has the counter on the left and the open water on the right
    bar0, bar1 = 22.0, 36.5
    obox(M.mesh(0, "blue"), F, bar0, bar1, -4.55, -2.35, deck_y, deck_y + 1.02)
    obox(M.mesh(0, "wood"), F, bar0 - 0.1, bar1 + 0.12, -4.7, -2.2, deck_y + 1.0, deck_y + 1.12)
    obox(M.mesh(0, "wood"), F, bar0 + 0.8, bar1 - 0.8, -4.15, -3.55, deck_y + 1.12, deck_y + 2.05)
    bu = bar0 + 1.4
    for name in ("shirt2", "green", "yellow", "shirt", "orange", "white"):
        obox(M.mesh(0, name), F, bu, bu + 0.14, -3.95, -3.75, deck_y + 2.05, deck_y + 2.4)
        bu += 1.6
    u = bar0 + 1.2
    while u < bar1 - 0.8:
        hquad(M.mesh(0, "white"), F, u - 0.16, u + 0.16, -2.15, -1.75, deck_y + 0.62)
        vquad(M.mesh(0, "white"), F, u - 0.14, u + 0.14, -1.82, deck_y + 0.62, deck_y + 1.0, 1)
        u += 1.7
    # red benches under the shore pavilion, the daytime side photo
    for v0, v1, back in ((3.15, 4.15, 4.15), (-4.15, -3.15, -4.15)):
        obox(M.mesh(0, "red"), F, 3.2, 13.5, v0, v1, deck_y, deck_y + 0.46)
        obox(M.mesh(0, "red"), F, 3.2, 13.5, back - 0.16, back + 0.16, deck_y + 0.46, deck_y + 0.92)
    # deck planks as strips, not boxes
    u = 0.4
    while u < L - 0.3:
        hquad(M.mesh(0, "deckd"), F, u, u + 0.16, -hv + 0.55, hv - 0.55, deck_y + 0.09)
        u += 1.7
    # tables, red and white chairs, seated guests down the open deck
    sitters = ("shirt", "shirt2", "shirt3", "yellow", "shirt", "shirt2")
    spec = (
        (5.4, 1.2, "white", "shirt2"),
        (5.8, -1.5, "red", "shirt"),
        (10.6, 1.35, "red", "yellow"),
        (11.2, -1.4, "white", "shirt3"),
        (24.8, 2.4, "red", "shirt2"),
        (25.2, -1.15, "white", "shirt"),
        (32.0, 2.5, "white", "shirt3"),
        (32.4, -2.25, "red", "yellow"),
        (39.2, 2.35, "red", "shirt"),
        (39.6, -2.3, "white", "shirt2"),
        (46.4, 2.2, "white", "shirt3"),
        (46.8, -2.15, "red", "shirt"),
        (53.6, 2.4, "red", "yellow"),
        (54.0, -2.2, "white", "shirt2"),
        (61.0, 2.15, "white", "shirt"),
        (61.4, -1.9, "red", "shirt3"),
        (67.2, 1.5, "red", "shirt2"),
    )
    for i, (tu, tv, col, who) in enumerate(spec):
        dining(M, F, tu, tv, deck_y, col, who)
    person(M, F, bar1 + 0.8, -3.4, deck_y, "shirt", "shorts", "skin")
    person(M, F, 27.0, -3.6, deck_y, "shirt", "shorts2", "skinb")
    person(M, F, 44.0, 4.35, deck_y, "shirt2", "shorts", "skin")

    # multicolour BUGALOE letters in the open gap between the two hips, so a
    # shore camera reads the word without looking through the thatch.
    letter_cols = (("B", "red"), ("U", "pink"), ("G", "blue"), ("A", "yellow"),
                   ("L", "green"), ("O", "orange"), ("E", "green"))
    lw, gap, lh = 0.78, 0.12, 1.35
    v0 = -((len(letter_cols) * (lw + gap) - gap) / 2)
    ly0 = deck_y + 1.35
    for i, (ch, mat) in enumerate(letter_cols):
        glyph(M, F, 17.15, v0 + i * (lw + gap), ly0, lw, lh, GLYPHS[ch], mat)
    # fishing nets draped on the beam over the letters, and further down the pier
    hquad(M.mesh(0, "net"), F, 16.5, 17.9, v0 - 0.3, v0 + len(letter_cols) * (lw + gap), ly0 + lh + 0.15)
    vquad(M.mesh(0, "net"), F, 16.6, 17.4, v0 - 0.15, ly0 - 0.1, ly0 + lh + 0.25, -1)
    vquad(M.mesh(0, "net"), F, 16.6, 17.4, v0 + len(letter_cols) * (lw + gap) - 0.15, ly0 - 0.1, ly0 + lh + 0.35, 1)
    vv = v0 + 0.2
    while vv < v0 + len(letter_cols) * (lw + gap) - 0.3:
        hquad(M.mesh(0, "bulb"), F, 16.95, 17.18, vv, vv + 0.14, ly0 + lh + 0.08)
        vv += 0.85
    for uu in (34.0, 46.0, 58.0):
        hquad(M.mesh(0, "net"), F, uu, uu + 3.6, -2.4, 2.4, roofs[1][2] + 0.42)
        vquad(M.mesh(0, "net"), F, uu, uu + 3.2, 2.55, roofs[1][2] - 0.35, roofs[1][2] + 0.4, 1)

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
    person(M, F, 44.5, 12.8, 1.2, "shirt2", "shorts", "skin")
    person(M, F, 48.0, 12.9, 1.2, "shirt", "shorts2", "skinb")
    person(M, F, 51.5, 12.7, 1.2, "yellow", "shorts", "skin")
    person(M, F, 55.0, 13.0, 1.2, "shirt3", "shorts2", "skinb")
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
    # Beach Bar-Grill: across the pier for the interior camera, and on both eaves for the side cameras
    uquad(M.mesh(0, "sign"), F, 16.85, -3.35, 3.35, deck_y + 2.85, deck_y + 3.45, -1, uvs=band_uv(128, 224))
    uquad(M.mesh(0, "sign"), F, 17.55, -3.35, 3.35, deck_y + 2.85, deck_y + 3.45, 1, uvs=band_uv(128, 224))
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
    check_glb(HERO / "bugaloe.glb")
    if not (2500 <= info["lod0"] <= 4500):
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
                    '"status": "v6-grokbot (ragged thatch, letters, furnished deck, night lights)"', block, count=1)
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
