#!/usr/bin/env python3
"""Bugaloe at De Palm Pier: a thatched palapa bar on wooden pilings.

Same hero id and origin. The OSM footprint is only the shore end; the pier
runs west into the water, where the Esri aerial and the night drone still
(YouTube zEBaFtoL3_o) put a long thatch roof with a shaggy eave, open sides
and a deck over the water. Geometry only, plus the name on the shore gable.
"""
import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, write_glb  # noqa: E402
from hotelkit import FONT_SANS, Frame, hip_roof, obox, png_bytes, text_png, tri_out, uquad, vquad  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-8523.4, -5313.88)

# Dried palm thatch: a straw field with a darker course and a shaggy eave.
# The drone still is night, so the roof reads dark; these are the daytime straw.
STRAW = (0.72, 0.50, 0.24)
STRAW_D = (0.50, 0.32, 0.14)
FRINGE = (0.36, 0.22, 0.10)
WOOD = (0.50, 0.32, 0.16)
POST = (0.42, 0.26, 0.13)
DECK = (0.74, 0.58, 0.36)
DECK_D = (0.58, 0.42, 0.24)
RAIL = (0.70, 0.64, 0.54)
BULB = (1.0, 0.86, 0.45)


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


def build():
    M = Model("bugaloe")
    for n, c, r in (
        ("straw", STRAW, .95), ("strawd", STRAW_D, .95), ("fringe", FRINGE, 1),
        ("wood", WOOD, .8), ("deck", DECK, .75), ("deckd", DECK_D, .8),
        ("rail", RAIL, .5), ("post", POST, .8),
    ):
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
        # base hip, then courses on top so the slope is straw bands rather than one slab
        hip_roof(M.mesh(lod, "strawd"), F, -0.4, L + 0.6, -V, V, eave, rise)
        if lod == 0:
            ridge_u0, ridge_u1 = V, L - V
            slope_bands(M.mesh(0, "straw"), M.mesh(0, "strawd"), F, ridge_u0, ridge_u1, V, eave, rise, 7)
            slope_bands(M.mesh(0, "straw"), M.mesh(0, "strawd"), F, ridge_u0, ridge_u1, -V, eave, rise, 7)
            # ridge cap, the line you see from the drone
            obox(M.mesh(0, "strawd"), F, ridge_u0 - 0.4, ridge_u1 + 0.4, -0.38, 0.38,
                 eave + rise - 0.05, eave + rise + 0.42)
        else:
            obox(M.mesh(1, "strawd"), F, V, L - V, -0.3, 0.3, eave + rise - 0.05, eave + rise + 0.35)
        # shore gable, where the name sits
        obox(M.mesh(lod, "wood"), F, -0.25, 0.28, -hv + 0.2, hv - 0.2, deck_y, eave - 0.15)

    # pilings the whole way, into the water, thicker than the old shore-only posts
    for lod, step in ((0, 5.4), (1, 10.8)):
        u = 1.6
        while u < L - 0.6:
            for s in (-1, 1):
                obox(M.mesh(lod, "post"), F, u - 0.28, u + 0.28, s * (hv - 0.15), s * (hv + 0.45),
                     -2.4, deck_y - 0.05)
            u += step
        # a wale tying the piles just under the deck
        for s in (-1, 1):
            obox(M.mesh(lod, "wood"), F, 1.2, L - 0.4, s * (hv - 0.05), s * (hv + 0.28),
                 deck_y - 0.55, deck_y - 0.28)

    # open palapa: posts, rails, cross beams, bulbs, the bar. Close up only.
    posts = []
    u = 2.6
    while u < L - 2.2:
        posts.append(u)
        u += 4.4
    for u in posts:
        for s in (-1, 1):
            obox(M.mesh(0, "post"), F, u - 0.16, u + 0.16, s * (hv - 0.7), s * (hv - 0.28), deck_y, eave + 0.05)
        # tie beam across, under the thatch
        obox(M.mesh(0, "wood"), F, u - 0.12, u + 0.12, -(hv - 0.5), hv - 0.5, eave - 0.28, eave - 0.02)
        vquad(M.mesh(0, "rail"), F, u - 2.05, u + 2.05, hv - 0.35, deck_y + 0.12, deck_y + 0.95, 1)
        vquad(M.mesh(0, "rail"), F, u - 2.05, u + 2.05, -(hv - 0.35), deck_y + 0.12, deck_y + 0.95, -1)
        for s in (-1, 1):
            obox(M.mesh(0, "bulb"), F, u - 0.14, u + 0.14, s * (hv - 0.85), s * (hv - 0.5), eave - 0.42, eave - 0.12)
    # king posts down the middle so the roof is held, not a floating slab
    u = 6.0
    while u < L - 6:
        obox(M.mesh(0, "post"), F, u - 0.14, u + 0.14, -0.16, 0.16, deck_y, eave + rise - 0.3)
        u += 8.5
    # bar counter on the shore half, with a back shelf and stools
    obox(M.mesh(0, "wood"), F, 5.5, L * 0.52, -1.25, 1.25, deck_y, deck_y + 1.12)
    obox(M.mesh(0, "wood"), F, 6.0, L * 0.52 - 0.5, -0.32, 0.32, deck_y + 1.12, deck_y + 1.8)
    u = 7.2
    while u < L * 0.5:
        for s in (-1, 1):
            obox(M.mesh(0, "deckd"), F, u - 0.2, u + 0.2, s * 1.5, s * 2.15, deck_y, deck_y + 0.1)
            obox(M.mesh(0, "post"), F, u - 0.06, u + 0.06, s * 1.65, s * 1.95, deck_y - 0.4, deck_y)
        u += 3.2
    # deck planks, sparse so the pier reads as boards without blowing the budget
    u = 0.3
    while u < L - 0.3:
        obox(M.mesh(0, "deckd"), F, u, u + 0.16, -hv + 0.4, hv - 0.4, deck_y + 0.06, deck_y + 0.14)
        u += 1.55
    # shaggy eave, the part the drone still actually shows
    fringe(M.mesh(0, "fringe"), F, 0.4, L - 0.2, V, eave)
    fringe(M.mesh(0, "fringe"), F, 0.4, L - 0.2, -V, eave)
    # short fringe on the two hip ends
    fringe_end(M, F, -0.2, eave, V, rise)
    fringe_end(M, F, L + 0.4, eave, V, rise)
    # lod1: one rail band and a short fringe suggestion
    for s in (-1, 1):
        vquad(M.mesh(1, "rail"), F, 1.0, L - 1.5, s * (hv - 0.3), deck_y + 0.15, deck_y + 0.85, s)
        vquad(M.mesh(1, "fringe"), F, 0.5, L - 0.3, s * (V + 0.35), eave - 0.9, eave + 0.1, s)

    png = text_png(["BUGALOE"], 512, 128, (92, 52, 24, 255), (255, 236, 190, 255), FONT_SANS)
    uquad(M.mesh(0, "sign"), F, -0.42, -3.3, 3.3, eave - 1.55, eave - 0.2, -1,
          uvs=((0, 1), (1, 1), (1, 0), (0, 0)))
    uquad(M.mesh(1, "sign"), F, -0.42, -3.3, 3.3, eave - 1.55, eave - 0.2, -1,
          uvs=((0, 1), (1, 1), (1, 0), (0, 0)))

    info = write_glb(M, HERO / "bugaloe.glb", images=[png_bytes(png)])
    check_glb(HERO / "bugaloe.glb")
    if not (2500 <= info["lod0"] <= 4500):
        print("WARN lod0", info["lod0"])
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']}")
    patch(info)
    print("bugaloe", info, "pier", round(L, 1), "ridge", round(eave + rise, 2))
    return info


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


def patch(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "bugaloe"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = re.sub(r'"status": "[^"]*"',
                    '"status": "v4-grokbot (thatched palapa on pilings, drone viewpoint)"', block, count=1)
    block = re.sub(r'"bugaloe_lod0": \d+', f'"bugaloe_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"bugaloe_lod1": \d+', f'"bugaloe_lod1": {info["lod1"]}', block, count=1)
    block = re.sub(r'"switch_m": \d+', '"switch_m": 220', block, count=1)
    if "tools/grokbot/bugaloe.py" not in block:
        raise SystemExit("bugaloe ref anchor missing")
    MANIFEST.write_text(text[:i] + block + text[k:])
    hit = next(h for h in json.loads(MANIFEST.read_text()) if h["id"] == "bugaloe")
    assert hit["tris"]["bugaloe_lod0"] == info["lod0"]
    assert hit["lod"]["switch_m"] == 220


if __name__ == "__main__":
    build()
