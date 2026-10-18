#!/usr/bin/env python3
"""Marriott's Aruba Ocean Club (Palm Beach): a U of white balcony wings under
teal metal hip roofs, open to the beach around the rock-waterfall pool.

Same hero id, origin and OSM footprint (way 643104752: levels 6, height 20).
Massing over the OSM ring: a north wing and a longer south wing, both ~21 m
deep and running from the beach (west) to the street, joined on the street
side by an east stem, with a lower lobby block at the south-east corner.
Look from the resort's own photos (Marriott gallery stills in timeshare video
B5udOCtv2D0): white walls, white slab edges and white railings around deep
balconies with blue-grey glass, a teal standing-seam hip roof with small
gables whose faces are peach, and a blank beach end wall carrying a stepped
peach ornament panel over a column of windows. 6 floors (Marriott / Travel
Weekly factsheet) above a taller ground floor; built 1999.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, wall_ring, write_glb  # noqa: E402
from hotelkit import Frame, balcony_wing, ccw, ear_fan, hip_roof, obox, tri_out, vquad, uquad  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
O = (-7956.02, -6550.71)
RING = [(-8033.5, -6517.9), (-7942.4, -6510), (-7941.7, -6517.3), (-7938.4, -6517.3), (-7938.3, -6522.1),
        (-7937.7, -6522.8), (-7937.5, -6531.2), (-7939.1, -6531.2), (-7938.2, -6553.7), (-7936.5, -6553.8),
        (-7932.1, -6557.7), (-7900.6, -6555.1), (-7895.9, -6605), (-8025.3, -6615.6), (-8027.2, -6593.5),
        (-7950, -6586.7), (-7948.6, -6585.2), (-7952.9, -6535.5), (-7954.1, -6533.9), (-8032.7, -6540.1)]

WHITE = (0.95, 0.94, 0.90)
WHITE_SH = (0.86, 0.86, 0.84)
SLAB = (0.98, 0.97, 0.94)
RAIL = (0.90, 0.90, 0.88)
GLASS = (0.50, 0.58, 0.64)
TEAL = (0.26, 0.52, 0.52)
PEACH = (0.93, 0.70, 0.56)
ROOF = (0.80, 0.80, 0.78)
GROUND = (0.20, 0.22, 0.24)

FH = 3.0
GF = 3.6
FLOORS = 5          # balcony floors above the ground floor: 6 floors in all


def build():
    M = Model("m_marriottoceanclub")
    for n, c, r in (("wall", WHITE, .85), ("recess", WHITE_SH, .9), ("slab", SLAB, .8), ("rail", RAIL, .5),
                    ("glass", GLASS, .2), ("teal", TEAL, .55), ("peach", PEACH, .85), ("roof", ROOF, .9),
                    ("ground", GROUND, .3)):
        M.material(n, tuple(round(v ** 2.2, 4) for v in c), rough=r)
    mats = {"wall": "wall", "recess": "recess", "slab": "slab", "rail": "rail", "glass": "glass", "fin": "wall"}
    ring = ccw([(x - O[0], z - O[1]) for x, z in RING])
    for lod in (0, 1):
        wall_ring(M.mesh(lod, "ground"), ring, -2.0, 0.6)
        wall_ring(M.mesh(lod, "wall"), ring, 0.6, GF)
        ear_fan(M.mesh(lod, "roof"), ring, GF)

    def gable(lod, F, u, s, hv, y0, w=9.0, h=4.2):
        # small peach-faced gable standing proud of the hip slope on face s
        v = s * (hv + 0.35)
        A, B, C = F.p(u - w / 2, v, y0), F.p(u + w / 2, v, y0), F.p(u, v, y0 + h)
        cen = F.p(u, 0, y0)
        tri_out(M.mesh(lod, "peach"), A, B, C, cen)
        # its teal roof: two slopes back into the hip
        D = F.p(u, s * (hv - 3.5), y0 + h)
        for P, Q in ((A, C), (C, B)):
            Pb = (P[0] - F.vx * s * 3.8, P[1], P[2] - F.vz * s * 3.8)
            for m in (M.mesh(lod, "teal"),):
                tri_out(m, P, Q, D, cen)
                tri_out(m, P, Pb, D, cen)

    def wing(a, b, hv, floors, gables=(), ornament=False):
        F = Frame(a, b, O)
        top = balcony_wing(M, F, 0, F.L, hv, GF, floors, FH, 4.2, mats, depth=1.7)
        for lod in (0, 1):
            obox(M.mesh(lod, "slab"), F, -0.15, F.L + 0.15, -hv - 0.15, hv + 0.15, top, top + 0.7)
            hip_roof(M.mesh(lod, "teal"), F, -0.6, F.L + 0.6, -hv - 0.6, hv + 0.6, top + 0.7, 6.0)
            if lod == 0:
                for u in gables:
                    for s in (-1, 1):
                        gable(lod, F, u, s, hv, top + 0.7)
        if ornament:
            # beach end (u=0): blank wall, column of windows, stepped peach panel
            for lod in (0, 1):
                ob = M.mesh(lod, "wall")
                obox(ob, F, -0.4, 0.0, -hv, hv, GF, top)
                p = M.mesh(lod, "peach")
                y = top - 5.2
                for k, (w, h) in enumerate(((7.0, 1.2), (5.4, 1.0), (3.6, 1.0), (1.8, 0.9))):
                    uquad(p, F, -0.45, -w / 2, w / 2, y, y + h, -1)
                    y += h
                if lod == 0:
                    g = M.mesh(lod, "glass")
                    for f in range(floors):
                        yy = GF + f * FH + 0.8
                        for vv in (-hv + 2.2, hv - 2.2):
                            uquad(g, F, -0.45, vv - 0.6, vv + 0.6, yy, yy + 1.5, -1)
        return F, top

    # north wing and south wing, beach (west) end first
    FN, topn = wing((-8031.0, -6529.0), (-7946.0, -6522.5), 10.5, FLOORS, gables=(26.0, 58.0), ornament=True)
    FS, tops = wing((-8024.5, -6604.0), (-7953.0, -6597.8), 10.5, FLOORS, gables=(24.0, 52.0), ornament=True)
    # east stem joining them along the street side
    FE, tope = wing((-7945.3, -6533.0), (-7943.2, -6587.0), 7.0, FLOORS, gables=(27.0,))
    # lower lobby block at the south-east corner, by the porte-cochere
    FL = Frame((-7916.0, -6557.0), (-7912.0, -6604.0), O)
    topl = balcony_wing(M, FL, 0, FL.L, 15.0, GF, 2, FH, 4.2, mats, depth=1.4)
    for lod in (0, 1):
        obox(M.mesh(lod, "slab"), FL, -0.15, FL.L + 0.15, -15.15, 15.15, topl, topl + 0.6)
        hip_roof(M.mesh(lod, "teal"), FL, -0.6, FL.L + 0.6, -15.6, 15.6, topl + 0.6, 4.0)
        if lod == 0:
            gable(lod, FL, FL.L / 2, -1, 15.0, topl + 0.6, w=9.0, h=3.6)
    info = write_glb(M, HERO / "m_marriottoceanclub.glb")
    check_glb(HERO / "m_marriottoceanclub.glb")
    print("oceanclub", info, "tops", round(topn, 1), round(topl, 1))
    return info


if __name__ == "__main__":
    build()
