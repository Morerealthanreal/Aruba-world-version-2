#!/usr/bin/env python3
"""Marriott's Aruba Surf Club (Palm Beach): a long sand-coloured balcony slab
broken by salmon stair towers, under red-tile hip roofs.

Same hero id, origin and OSM footprint (way 40082945: levels "13;2",
heights "43.5;38"). The ring is one long slab running from the beach (west)
to the street with a step about two-thirds along; the beach part is the
tall one (13 floors, 43.5 m) and the street part lower (38 m). Look from the
resort videos (-Z3xBQbZpGg hotel tour, EVzxoJGTfs0 4K walk): pale sand walls,
white slab edges and white railings across every bay on both long faces,
salmon-terracotta stair/lift towers standing proud of the face and rising a
storey above the roof, and red-tile hip roofs with a tile skirt.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, fold_body, wall_ring, write_glb  # noqa: E402
from hotelkit import Frame, balcony_wing, ccw, ear_fan, hip_roof, mansard, obox  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
O = (-7936.09, -6440.78)
RING = [(-8046.6, -6441.2), (-8044, -6441.1), (-8044.1, -6439.3), (-8034.3, -6438.8), (-8034.2, -6441),
        (-7960.4, -6435.5), (-7961.8, -6421.7), (-7952.3, -6421), (-7951.2, -6430.2), (-7956.9, -6430.6),
        (-7956.6, -6435.2), (-7952.4, -6434.9), (-7917, -6429.5), (-7917.3, -6426.8), (-7909.5, -6426),
        (-7909.6, -6424.2), (-7896.8, -6423.2), (-7897, -6421.3), (-7887.6, -6420.2), (-7887.6, -6416),
        (-7867.5, -6415.2), (-7867.4, -6418.2), (-7864.7, -6423.2), (-7863.4, -6433.5), (-7861.3, -6436.4),
        (-7861.5, -6443.3), (-7860.9, -6452.1), (-7863.7, -6452.6), (-7863.6, -6456.3), (-7878.6, -6457.5),
        (-7878.5, -6455.7), (-7890.8, -6457.1), (-7891.2, -6454.8), (-7903, -6456), (-7903.4, -6454.1),
        (-7915.2, -6455.4), (-7915.6, -6453.4), (-8031.6, -6465), (-8031.4, -6468.1), (-8041.1, -6469.1),
        (-8041.3, -6467.3), (-8044.6, -6467.6)]

SAND = (0.94, 0.78, 0.58)
SAND_SH = (0.86, 0.71, 0.54)
SALMON = (0.82, 0.54, 0.42)
WHITE = (0.96, 0.95, 0.92)
RAIL = (0.93, 0.93, 0.91)
GLASS = (0.34, 0.36, 0.38)
TILE = (0.66, 0.30, 0.20)
ROOF = (0.82, 0.80, 0.76)
GROUND = (0.20, 0.22, 0.24)

FH = 3.1
GF = 4.4


def build():
    M = Model("marriott_surfclub")
    for n, c, r in (("wall", SAND, .85), ("recess", SAND_SH, .9), ("salmon", SALMON, .85), ("slab", WHITE, .8),
                    ("rail", RAIL, .5), ("glass", GLASS, .2), ("tile", TILE, .8), ("roof", ROOF, .9),
                    ("ground", GROUND, .3)):
        M.material(n, tuple(round(v ** 2.2, 4) for v in c), rough=r)
    mats = {"wall": "wall", "recess": "recess", "slab": "slab", "rail": "rail", "glass": "glass", "fin": "wall"}
    ring = ccw([(x - O[0], z - O[1]) for x, z in RING])
    for lod in (0, 1):
        wall_ring(M.mesh(lod, "ground"), ring, -2.0, 0.6)
        wall_ring(M.mesh(lod, "wall"), ring, 0.6, GF)
        ear_fan(M.mesh(lod, "roof"), ring, GF)

    def slab(a, b, hv, floors, towers):
        F = Frame(a, b, O)
        top = balcony_wing(M, F, 0, F.L, hv, GF, floors, FH, 3.7, mats, depth=1.8)
        for lod in (0, 1):
            obox(M.mesh(lod, "slab"), F, -0.2, F.L + 0.2, -hv - 0.2, hv + 0.2, top, top + 0.8)
            mansard(M.mesh(lod, "tile"), F, -0.2, F.L + 0.2, -hv - 0.2, hv + 0.2, top + 0.8, 2.0, 2.0)
            obox(M.mesh(lod, "roof"), F, 1.8, F.L - 1.8, -hv + 1.8, hv - 1.8, top + 0.8, top + 2.6)
            # salmon stair/lift towers: proud of both faces, a storey above the roof, red hip caps
            for u in towers:
                obox(M.mesh(lod, "salmon"), F, u - 3.6, u + 3.6, -hv - 1.2, hv + 1.2, 0.6, top + FH + 0.8)
                hip_roof(M.mesh(lod, "tile"), F, u - 4.2, u + 4.2, -hv - 1.8, hv + 1.8, top + FH + 0.8, 3.2)
        # beach and street end walls: salmon full-height panels
        for lod in (0, 1):
            for uu in (-0.3, F.L + 0.3):
                obox(M.mesh(lod, "salmon"), F, uu - 0.3, uu + 0.3, -3.2, 3.2, GF, top + 0.8)
        return F, top

    # tall beach slab (13 floors incl. ground, 43.5 m) and lower street slab (38 m)
    FW, topw = slab((-8045.5, -6454.0), (-7957.0, -6446.0), 13.5, 12, towers=(30.0, 62.0))
    FE, tope = slab((-7957.0, -6446.0), (-7862.0, -6438.0), 15.0, 10, towers=(34.0, 70.0))
    # One opaque mesh per LOD. Glass stays separate so the night pass still lights it.
    fold_body(M, keep={"glass"})
    info = write_glb(M, HERO / "marriott_surfclub.glb")
    check_glb(HERO / "marriott_surfclub.glb")
    print("surfclub", info, "tops", round(topw, 1), round(tope, 1))
    return info


if __name__ == "__main__":
    build()
