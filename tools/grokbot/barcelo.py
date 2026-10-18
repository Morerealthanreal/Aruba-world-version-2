#!/usr/bin/env python3
"""Barceló Aruba (Palm Beach): a U of peach balcony wings with red-tile caps.

Same hero id, origin and OSM footprint. Massing from the Esri aerial over
the OSM ring: a 9-storey north wing (the North Tower, Royal Level on its top
floors per barcelo.com) and a 9-storey south wing, both ~21-23 m deep and
running WNW-ESE to the beach, joined on the street side by a long, wide,
lower spine under two red-tile slopes, with a low red-roofed lobby annex on
its pool side. Facts: 9 floors, 373 rooms, all with balcony (barcelo.com,
Business Travel News). Look from the hotel's own video stills: warm peach
walls, white slab edges, dark railings, terracotta tile skirts on the roof
edges, and the 'Barceló Aruba' panel high on the tower by the entrance.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, wall_ring, write_glb  # noqa: E402
from hotelkit import (Frame, FONT_SANS, balcony_wing, hip_roof, mansard, obox,  # noqa: E402
                      png_bytes, text_png, uquad)
from hotelkit import ear_fan, ccw  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
O = (-8295.92, -5570.39)
RING = [(-8372, -5532.1), (-8314.2, -5504.8), (-8313.2, -5506.9), (-8309.5, -5505.1), (-8306.9, -5510.6),
        (-8289.7, -5502.4), (-8280.3, -5521.8), (-8259.4, -5511.9), (-8210.7, -5613.3), (-8246.5, -5630.7),
        (-8255.5, -5609.3), (-8260.8, -5611.8), (-8258.4, -5616.6), (-8307.8, -5639.9), (-8309.7, -5635.9),
        (-8317.8, -5639.8), (-8324.4, -5626.2), (-8317.1, -5622.8), (-8319.9, -5617), (-8269.4, -5593.1),
        (-8266.6, -5598.8), (-8261.9, -5596.6), (-8268.1, -5583.7), (-8279.4, -5589), (-8293.6, -5559.5),
        (-8282.5, -5554.2), (-8299.2, -5519.5), (-8305.5, -5522.5), (-8303.1, -5527.6), (-8351.1, -5550.4),
        (-8352.7, -5547), (-8362.6, -5551.6)]

PEACH = (0.94, 0.76, 0.60)
PEACH_SH = (0.86, 0.68, 0.53)
WHITE = (0.94, 0.92, 0.87)
TILE = (0.66, 0.30, 0.19)
RAIL = (0.30, 0.24, 0.20)
GLASS = (0.12, 0.15, 0.18)
ROOF = (0.86, 0.83, 0.76)
GROUND = (0.20, 0.22, 0.24)

FH = 3.1
GF = 4.2


def build():
    M = Model("barcelo")
    for n, c, r in (("wall", PEACH, .85), ("recess", PEACH_SH, .9), ("slab", WHITE, .8), ("rail", RAIL, .5),
                    ("glass", GLASS, .25), ("tile", TILE, .8), ("roof", ROOF, .9), ("ground", GROUND, .3)):
        # the loader treats factors as linear: store the photo's sRGB colour linearised
        M.material(n, tuple(round(v ** 2.2, 4) for v in c), rough=r)
    M.material("sign", WHITE, rough=.5, textured=True, emissive=.15)
    mats = {"wall": "wall", "recess": "recess", "slab": "slab", "rail": "rail", "glass": "glass", "fin": "wall"}
    ring = ccw([(x - O[0], z - O[1]) for x, z in RING])
    for lod in (0, 1):
        wall_ring(M.mesh(lod, "ground"), ring, -2.0, 3.2)
        wall_ring(M.mesh(lod, "wall"), ring, 3.2, GF + 0.4)
        ear_fan(M.mesh(lod, "roof"), ring, GF + 0.4)

    def wing(a, b, hv, floors, cap="mansard"):
        F = Frame(a, b, O)
        for lod in (0, 1):
            obox(M.mesh(lod, "wall"), F, 0, F.L, -hv, hv, GF - 0.2, GF + 0.5)
        top = balcony_wing(M, F, 0, F.L, hv, GF + 0.4, floors, FH, 3.9, mats)
        for lod in (0, 1):
            obox(M.mesh(lod, "slab"), F, -0.2, F.L + 0.2, -hv - 0.2, hv + 0.2, top, top + 0.9)
            if cap == "mansard":
                mansard(M.mesh(lod, "tile"), F, -0.2, F.L + 0.2, -hv - 0.2, hv + 0.2, top + 0.9, 2.2, 1.8)
                obox(M.mesh(lod, "roof"), F, 1.4, F.L - 1.4, -hv + 1.4, hv - 1.4, top + 0.9, top + 2.3)
            else:
                hip_roof(M.mesh(lod, "tile"), F, -0.3, F.L + 0.3, -hv - 0.3, hv + 0.3, top + 0.9, cap)
        return F, top

    # north wing (North Tower) and south wing, beach to street
    FN, topn = wing((-8320.0, -5628.5), (-8262.0, -5604.5), 11.0, 9)
    FS, tops = wing((-8367.5, -5542.0), (-8309.0, -5516.5), 10.5, 9)
    # street spine: lower and wide, under two red slopes with a flat strip between
    FP = Frame((-8279.0, -5516.0), (-8233.5, -5611.0), O)
    hv = 19.0
    topp = balcony_wing(M, FP, 0, FP.L, hv, GF + 0.4, 4, FH, 3.9, mats, depth=1.5)
    for lod in (0, 1):
        obox(M.mesh(lod, "slab"), FP, -0.2, FP.L + 0.2, -hv - 0.2, hv + 0.2, topp, topp + 0.6)
        for s in (-1, 1):
            a, b = sorted((s * 3.5, s * (hv + 0.2)))
            hip_roof(M.mesh(lod, "tile"), FP, 0, FP.L, a, b, topp + 0.6, 3.6)
    # pool-side lobby annex with a red hip roof
    FL = Frame((-8275.4, -5587.5), (-8290.0, -5556.4), O)
    for lod in (0, 1):
        obox(M.mesh(lod, "wall"), FL, 0, FL.L, -8, 8, 0, 8.5)
        hip_roof(M.mesh(lod, "tile"), FL, -0.6, FL.L + 0.6, -8.6, 8.6, 8.5, 3.2)
    # rounded beach-end pavilion by the north wing (red hip roof in the aerial)
    FT = Frame((-8336.0, -5615.0), (-8322.0, -5609.0), O)
    for lod in (0, 1):
        obox(M.mesh(lod, "wall"), FT, 0, FT.L, -7, 7, 0, 7.0)
        hip_roof(M.mesh(lod, "tile"), FT, -0.6, FT.L + 0.6, -7.6, 7.6, 7.0, 3.0)
    # 'Barceló Aruba' panel high on the street end of the North Tower
    png = text_png(["Barceló Aruba"], 512, 128, (238, 234, 226, 255), (40, 44, 52, 255), FONT_SANS)
    for lod in (0, 1):
        uquad(M.mesh(lod, "sign"), FN, FN.L + 0.45, -6.5, 6.5, topn - 3.4, topn - 0.4, 1,
              uvs=((0, 1), (1, 1), (1, 0), (0, 0)))
    info = write_glb(M, HERO / "barcelo.glb", images=[png_bytes(png)])
    check_glb(HERO / "barcelo.glb")
    print("barcelo", info, "north top", round(topn, 1), "spine top", round(topp, 1))
    return info


if __name__ == "__main__":
    build()
