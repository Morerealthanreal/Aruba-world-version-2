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

# Dried palm thatch: a straw field with a darker course and a shaggy eave.
STRAW = (0.72, 0.50, 0.24)
STRAW_D = (0.50, 0.32, 0.14)
FRINGE = (0.36, 0.22, 0.10)
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
    obox(M.mesh(0, shorts), F, u - 0.15, u + 0.15, v - 0.11, v + 0.11, y, y + 0.72)
    obox(M.mesh(0, shirt), F, u - 0.20, u + 0.20, v - 0.13, v + 0.13, y + 0.70, y + 1.16)
    obox(M.mesh(0, skin), F, u - 0.09, u + 0.09, v - 0.09, v + 0.09, y + 1.16, y + 1.40)
    obox(M.mesh(0, shirt), F, u - 0.07, u + 0.07, v - 0.32, v + 0.32, y + 0.92, y + 1.06)


def table(M, F, u, v, y):
    obox(M.mesh(0, "wood"), F, u - 0.45, u + 0.45, v - 0.45, v + 0.45, y + 0.72, y + 0.80)
    obox(M.mesh(0, "post"), F, u - 0.06, u + 0.06, v - 0.06, v + 0.06, y, y + 0.74)
    for su, sv in ((-0.32, -0.32), (0.32, -0.32), (-0.32, 0.32), (0.32, 0.32)):
        obox(M.mesh(0, "wood"), F, u + su - 0.12, u + su + 0.12, v + sv - 0.12, v + sv + 0.12, y, y + 0.08)
        obox(M.mesh(0, "wood"), F, u + su - 0.10, u + su + 0.10, v + sv - 0.04, v + sv + 0.04, y + 0.08, y + 0.48)


def sign_atlas():
    gable = text_png(["BUGALOE"], 512, 128, (255, 236, 190, 255), (92, 52, 24, 255), FONT_SANS)
    banner = text_png(["BEACH BAR - GRILL"], 512, 96, (176, 42, 34, 255), (255, 236, 190, 255), FONT_SANS)
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
    F = Frame((-8516.0, -5310.5), (-8586.0, -5322.0), O)
    L, hv = F.L, 5.4
    deck_y = 1.25
    eave = 3.45
    overhang = 1.7
    V = hv + overhang          # eave half-width
    rise = 4.4                 # steep enough that the hip reads from the air
    for lod in (0, 1):
        obox(M.mesh(lod, "deck"), F, -1.2, L + 1.0, -hv - 0.15, hv + 0.15, deck_y - 0.32, deck_y + 0.08)
        hip_roof(M.mesh(lod, "strawd"), F, -0.4, L + 0.6, -V, V, eave, rise)
        if lod == 0:
            ridge_u0, ridge_u1 = V, L - V
            slope_bands(M.mesh(0, "straw"), M.mesh(0, "strawd"), F, ridge_u0, ridge_u1, V, eave, rise, 7)
            slope_bands(M.mesh(0, "straw"), M.mesh(0, "strawd"), F, ridge_u0, ridge_u1, -V, eave, rise, 7)
            obox(M.mesh(0, "strawd"), F, ridge_u0 - 0.4, ridge_u1 + 0.4, -0.38, 0.38,
                 eave + rise - 0.05, eave + rise + 0.42)
        else:
            obox(M.mesh(1, "strawd"), F, V, L - V, -0.3, 0.3, eave + rise - 0.05, eave + rise + 0.35)
        # shore gable, orange where the music board sits, wood frame around it
        obox(M.mesh(lod, "orange"), F, -0.25, 0.28, -hv + 0.2, hv - 0.2, deck_y, eave - 0.15)

    # pilings the whole way, into the water
    for lod, step in ((0, 5.4), (1, 10.8)):
        u = 1.6
        while u < L - 0.6:
            for s in (-1, 1):
                obox(M.mesh(lod, "post"), F, u - 0.28, u + 0.28, s * (hv - 0.15), s * (hv + 0.45),
                     -2.4, deck_y - 0.05)
            u += step
        for s in (-1, 1):
            obox(M.mesh(lod, "wood"), F, 1.2, L - 0.4, s * (hv - 0.05), s * (hv + 0.28),
                 deck_y - 0.55, deck_y - 0.28)

    # navy skirt the daytime side photo shows, stopping above the pile tips
    # so the night view still reads the pilings underneath
    for lod in (0, 1):
        for s in (-1, 1):
            vquad(M.mesh(lod, "navy"), F, 0.4, L + 0.5, s * (hv + 0.55), -0.05, deck_y - 0.08, s)
            vquad(M.mesh(lod, "skirtw"), F, 0.4, L + 0.5, s * (hv + 0.58), deck_y - 0.16, deck_y + 0.06, s)
        uquad(M.mesh(lod, "navy"), F, L + 0.85, -hv - 0.2, hv + 0.2, -0.05, deck_y - 0.08, 1)

    # open palapa: mint posts, rails, teal tie beams, bulbs
    posts = []
    u = 2.6
    panels = ("orange", "red", "yellow", "blue", "green")
    while u < L - 2.2:
        posts.append(u)
        u += 4.4
    for i, u in enumerate(posts):
        for s in (-1, 1):
            obox(M.mesh(0, "teal"), F, u - 0.16, u + 0.16, s * (hv - 0.7), s * (hv - 0.28), deck_y, eave + 0.05)
            vquad(M.mesh(0, panels[i % len(panels)]), F, u - 0.10, u + 0.10, s * (hv - 0.26),
                  deck_y + 0.55, eave - 0.45, s)
        obox(M.mesh(0, "teal"), F, u - 0.12, u + 0.12, -(hv - 0.5), hv - 0.5, eave - 0.28, eave - 0.02)
        for s in (-1, 1):
            vv = s * (hv - 0.35)
            vquad(M.mesh(0, "rail"), F, u - 2.05, u + 2.05, vv, deck_y + 0.86, deck_y + 1.02, s)
            vquad(M.mesh(0, "rail"), F, u - 2.05, u + 2.05, vv, deck_y + 0.42, deck_y + 0.54, s)
            obox(M.mesh(0, "bulb"), F, u - 0.12, u + 0.12, s * (hv - 0.85), s * (hv - 0.52), eave - 0.42, eave - 0.14)
    # a thin glowing run under each eave, plus bulb dots so the night drone reads a lit edge
    for s in (-1, 1):
        obox(M.mesh(0, "bulb"), F, 3.0, L - 2.0, s * (hv - 0.86), s * (hv - 0.74), eave - 0.34, eave - 0.22)
        uu = 3.4
        while uu < L - 2.0:
            vquad(M.mesh(0, "bulb"), F, uu - 0.08, uu + 0.08, s * (hv - 0.62), eave - 0.55, eave - 0.32, s)
            vquad(M.mesh(0, "bulb"), F, uu - 0.07, uu + 0.07, s * (hv + 0.02), deck_y + 0.62, deck_y + 0.82, s)
            uu += 3.6
    # king posts and a painted plank ceiling over the bar half
    u = 6.0
    while u < L - 6:
        obox(M.mesh(0, "teal"), F, u - 0.12, u + 0.12, -0.14, 0.14, deck_y, eave + rise - 0.4)
        u += 8.5
    obox(M.mesh(0, "ceil"), F, 5.0, L * 0.62, -2.6, 2.6, eave + 1.45, eave + 1.58)
    # bar: blue counter, wood top, back shelf, bottle row
    bar1 = L * 0.48
    obox(M.mesh(0, "blue"), F, 5.2, bar1, -1.35, 1.35, deck_y, deck_y + 1.02)
    obox(M.mesh(0, "wood"), F, 5.05, bar1 + 0.15, -1.5, 1.5, deck_y + 1.00, deck_y + 1.14)
    obox(M.mesh(0, "wood"), F, 6.2, bar1 - 0.6, -0.28, 0.28, deck_y + 1.14, deck_y + 2.15)
    bottles = ("shirt2", "green", "yellow", "shirt", "orange", "red", "white", "shirt2")
    bu = 7.0
    for name in bottles:
        obox(M.mesh(0, name), F, bu, bu + 0.16, -0.10, 0.10, deck_y + 2.15, deck_y + 2.52)
        bu += 0.55
    # stools along both sides of the counter
    u = 7.2
    while u < bar1 - 1.0:
        for s in (-1, 1):
            obox(M.mesh(0, "deckd"), F, u - 0.18, u + 0.18, s * 1.55, s * 2.15, deck_y, deck_y + 0.46)
            obox(M.mesh(0, "white"), F, u - 0.16, u + 0.16, s * 1.7, s * 2.05, deck_y + 0.46, deck_y + 0.54)
        u += 2.6
    # tables down the open pier, and two red booth benches
    for tu, tv in ((28, 3.15), (40, -3.15), (52, 3.15)):
        table(M, F, tu, tv, deck_y)
    obox(M.mesh(0, "red"), F, 24, 34, 3.5, 4.3, deck_y, deck_y + 0.48)
    obox(M.mesh(0, "red"), F, 24, 34, 4.15, 4.45, deck_y + 0.48, deck_y + 0.95)
    # deck planks
    u = 0.3
    while u < L - 0.3:
        obox(M.mesh(0, "deckd"), F, u, u + 0.16, -hv + 0.4, hv - 0.4, deck_y + 0.06, deck_y + 0.14)
        u += 1.55
    fringe(M.mesh(0, "fringe"), F, 0.4, L - 0.2, V, eave)
    fringe(M.mesh(0, "fringe"), F, 0.4, L - 0.2, -V, eave)
    fringe_end(M, F, -0.2, eave, V, rise)
    fringe_end(M, F, L + 0.4, eave, V, rise)
    for s in (-1, 1):
        vquad(M.mesh(1, "rail"), F, 1.0, L - 1.5, s * (hv - 0.3), deck_y + 0.7, deck_y + 0.95, s)
        vquad(M.mesh(1, "fringe"), F, 0.5, L - 0.3, s * (V + 0.35), eave - 0.9, eave + 0.1, s)

    # hanging letters and a fishing net, under the bar ceiling
    letters = (
        ("red", 0), ("pink", 1), ("blue", 2), ("yellow", 3),
        ("green", 4), ("orange", 5), ("green", 6),
    )
    span = 6.2
    for mat, i in letters:
        a = -span / 2 + i * (span / 7)
        obox(M.mesh(0, mat), F, 9.3, 9.7, a + 0.06, a + span / 7 - 0.08, eave - 0.35, eave + 0.55)
    hquad(M.mesh(0, "net"), F, 8.2, 16.5, -2.4, 2.4, eave + 1.2, up=1)
    # staff in blue, guests at the stools and the rail
    person(M, F, bar1 + 0.7, 0.0, deck_y, "shirt", "shorts", "skin")
    person(M, F, 12.0, 2.4, deck_y, "shirt2", "shorts2", "skin")
    person(M, F, 20.0, 4.55, deck_y, "shirt3", "shorts", "skin")
    person(M, F, 38.0, 4.65, deck_y, "shirt", "shorts2", "skinb")
    person(M, F, 50.0, 4.5, deck_y, "yellow", "shorts", "skinb")

    # catamaran on the north side, where the night drone has a boat in the foreground
    cu0, cu1 = 38.0, 56.0
    for lod in (0, 1):
        for vv in (11.2, 15.6):
            obox(M.mesh(lod, "hull"), F, cu0, cu1, vv - 0.7, vv + 0.7, -0.25, 0.85)
            obox(M.mesh(lod, "white"), F, cu0 + 0.4, cu1 - 0.4, vv - 0.55, vv + 0.55, 0.7, 1.05)
        obox(M.mesh(lod, "white"), F, cu0 + 1.5, cu1 - 1.2, 11.6, 15.2, 0.95, 1.2)
        obox(M.mesh(lod, "teal"), F, (cu0 + cu1) / 2 - 0.12, (cu0 + cu1) / 2 + 0.12, 13.2, 13.55, 1.2, 8.4)
    if True:
        obox(M.mesh(0, "white"), F, 44, 52, 12.4, 14.6, 1.2, 2.5)
        hquad(M.mesh(0, "net"), F, cu0 + 0.8, cu1 - 0.8, 11.8, 15.0, 1.05, up=1)
        person(M, F, 46.0, 13.4, 1.25, "shirt2", "shorts", "skin")
        person(M, F, 50.5, 13.4, 1.25, "shirt", "shorts2", "skinb")
        vquad(M.mesh(0, "bulb"), F, 42.2, 42.5, 13.4, 2.3, 2.55, 1)

    # palms and umbrellas on the sand east of the pier, the beach the drone looks toward
    for u, v in ((-8, -11), (-14, -5), (-18, 3), (-7, 9), (-16, 14), (-11, -16), (-22, 8)):
        palm(M, F, u, v, h=6.6 + (abs(v) % 3) * 0.6, lods=(0, 1) if abs(u) < 16 else (0,))
    for u, v, col in ((-4.5, -8, "red"), (-5.5, 8.5, "yellow"), (-7, 13, "blue"), (-6, -14.5, "orange")):
        umbrella(M, F, u, v, col)
    # a small shore palapa beside the pier mouth, the second thatch in the side photo
    pu0, pu1, pv0, pv1 = -15.0, -3.5, 6.2, 13.5
    hip_roof(M.mesh(0, "strawd"), F, pu0, pu1, pv0, pv1, 2.7, 2.0)
    obox(M.mesh(0, "deck"), F, pu0 + 0.4, pu1 - 0.4, pv0 + 0.4, pv1 - 0.4, 0.15, 0.4)
    for uu, vv in ((pu0 + 0.8, pv0 + 0.8), (pu1 - 0.8, pv0 + 0.8), (pu0 + 0.8, pv1 - 0.8), (pu1 - 0.8, pv1 - 0.8)):
        obox(M.mesh(0, "teal"), F, uu - 0.12, uu + 0.12, vv - 0.12, vv + 0.12, 0.3, 2.75)
    hip_roof(M.mesh(1, "strawd"), F, pu0, pu1, pv0, pv1, 2.7, 2.0)

    png = sign_atlas()
    uquad(M.mesh(0, "sign"), F, -0.42, -3.3, 3.3, eave - 1.55, eave - 0.2, -1, uvs=band_uv(0, 128))
    uquad(M.mesh(1, "sign"), F, -0.42, -3.3, 3.3, eave - 1.55, eave - 0.2, -1, uvs=band_uv(0, 128))
    # banner across the bar, readable from the deck; music board on the shore wall
    uquad(M.mesh(0, "sign"), F, 8.4, -3.4, 3.4, eave + 0.65, eave + 1.25, 1, uvs=band_uv(128, 224))
    uquad(M.mesh(0, "sign"), F, 8.55, -3.4, 3.4, eave + 0.65, eave + 1.25, -1, uvs=band_uv(128, 224))
    uquad(M.mesh(0, "sign"), F, 0.36, -2.4, 2.4, deck_y + 1.35, deck_y + 2.15, 1, uvs=band_uv(224, 320))

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
                    '"status": "v4-grokbot (thatched palapa, palms, bar, night lights)"', block, count=1)
    block = re.sub(r'"bugaloe_lod0": \d+', f'"bugaloe_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"bugaloe_lod1": \d+', f'"bugaloe_lod1": {info["lod1"]}', block, count=1)
    block = re.sub(r'"switch_m": \d+', '"switch_m": 220', block, count=1)
    block = re.sub(
        r'"ref_sources": "[^"]*"',
        '"ref_sources": "Night drone (YouTube zEBaFtoL3_o): thatch pier, lit eaves, palms on the beach, catamaran alongside. Daytime close-ups (arubaunleashed.com, 30a.com): mint posts, blue bar, BUGALOE letters, navy skirt, umbrellas. Esri aerial: pier west from this footprint. Built by tools/grokbot/bugaloe.py"',
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
