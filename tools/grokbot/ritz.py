#!/usr/bin/env python3
"""The Ritz-Carlton, Aruba (Palm Beach): two pale-yellow balcony wings and a
red-tile arrival court.

Same hero id, origin and OSM footprint. Massing from the Esri aerial over the
OSM ring: a north guest wing and a south guest wing on the beach side (the
dark balcony slabs), a long white-roofed podium between them, and the formal
arrival block on the street side. Look from the Dec 2022 street approach
(YouTube b3OMuBzd69w): pale yellow stucco, white cornices, a red-tile hip
roof, a tall arched window over three ground arches. Guest wings are the
8-floor balcony slabs (Coleman Partners: 320 rooms, opened 2013; eight floors).
Geometry only.
"""
import json
import math
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
sys.path.insert(0, str(Path(__file__).resolve().parent))
from hero_glb import Model, check_glb, wall_ring, write_glb  # noqa: E402
from hotelkit import Frame, balcony_wing, ccw, ear_fan, hip_roof, obox, tri_out, uquad, vquad  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
O = (-8038.11, -6962.31)

# pale yellow of the arrival court (street still), a slightly deeper sand on the
# guest wings so the balcony shadow reads, white trim, terracotta hips.
YELLOW = (0.97, 0.88, 0.64)
SAND = (0.97, 0.88, 0.64)  # same pale yellow as the arrival court; the game sun darkens it
SAND_SH = (0.86, 0.76, 0.54)
WHITE = (0.96, 0.94, 0.90)
RAIL = (0.90, 0.90, 0.88)
GLASS = (0.16, 0.20, 0.26)
PANEL = (0.42, 0.48, 0.56)  # blue-grey surround of the tall arrival window
TILE = (0.62, 0.26, 0.16)
ROOFW = (0.90, 0.90, 0.88)
DARK = (0.28, 0.26, 0.24)
STONE = (0.78, 0.72, 0.60)
GROUND = (0.22, 0.22, 0.20)

FH = 3.05
GF = 4.4
GUEST = 7  # balcony floors above the ground floor: eight floors in all


def lin(c):
    return tuple(round(v ** 2.2, 4) for v in c)


def _q(mesh, A, B, C, D, cen):
    tri_out(mesh, A, B, C, cen)
    tri_out(mesh, A, C, D, cen)


def arch(M, F, u, v, out, y_base, spring, radius, segs=8, frame=0.26, glass="glass", trim="slab"):
    """Semicircular-headed opening on a constant-v face. `out` is -1 or +1."""
    r = radius
    y_top = spring + r
    cen = F.p(u, v - out * 4.0, (y_base + y_top) / 2)
    g = M.mesh(0, glass)
    # legs
    A = F.p(u - r, v, y_base)
    B = F.p(u + r, v, y_base)
    C = F.p(u + r, v, spring)
    D = F.p(u - r, v, spring)
    _q(g, A, B, C, D, cen)
    pts = []
    for i in range(segs + 1):
        ang = math.pi - math.pi * i / segs
        pts.append((u + r * math.cos(ang), spring + r * math.sin(ang)))
    mid = F.p(u, v, spring)
    for i in range(segs):
        tri_out(g, mid, F.p(pts[i][0], v, pts[i][1]), F.p(pts[i + 1][0], v, pts[i + 1][1]), cen)
    # white jambs and an arc band, sitting just proud of the glass
    vf = v - out * 0.08
    fr = M.mesh(0, trim)
    t = frame
    _q(fr, F.p(u - r - t, vf, y_base), F.p(u - r, vf, y_base),
       F.p(u - r, vf, spring), F.p(u - r - t, vf, spring), cen)
    _q(fr, F.p(u + r, vf, y_base), F.p(u + r + t, vf, y_base),
       F.p(u + r + t, vf, spring), F.p(u + r, vf, spring), cen)
    outer = []
    for i in range(segs + 1):
        ang = math.pi - math.pi * i / segs
        outer.append((u + (r + t) * math.cos(ang), spring + (r + t) * math.sin(ang)))
    for i in range(segs):
        _q(fr,
           F.p(pts[i][0], vf, pts[i][1]), F.p(pts[i + 1][0], vf, pts[i + 1][1]),
           F.p(outer[i + 1][0], vf, outer[i + 1][1]), F.p(outer[i][0], vf, outer[i][1]), cen)
    # one vertical and two horizontal muntins
    mb = M.mesh(0, trim)
    vm = v - out * 0.12
    _q(mb, F.p(u - 0.06, vm, y_base + 0.15), F.p(u + 0.06, vm, y_base + 0.15),
       F.p(u + 0.06, vm, y_top - 0.2), F.p(u - 0.06, vm, y_top - 0.2), cen)
    for yy in (spring - r * 0.15, (y_base + spring) / 2):
        _q(mb, F.p(u - r + 0.08, vm, yy), F.p(u + r - 0.08, vm, yy),
           F.p(u + r - 0.08, vm, yy + 0.1), F.p(u - r + 0.08, vm, yy + 0.1), cen)


def build():
    M = Model("ritz")
    for n, c, r in (
        ("wall", SAND, .85), ("yellow", YELLOW, .85), ("recess", SAND_SH, .9),
        ("slab", WHITE, .75), ("rail", RAIL, .5), ("glass", GLASS, .2),
        ("panel", PANEL, .4), ("tile", TILE, .75), ("roof", ROOFW, .9),
        ("dark", DARK, .8), ("stone", STONE, .95), ("ground", GROUND, .4),
    ):
        M.material(n, lin(c), rough=r)
    mats = {"wall": "wall", "recess": "recess", "slab": "slab", "rail": "rail", "glass": "glass", "fin": "wall"}

    # plaza, stone rather than white, so the aerial white is only the real roofs
    ring = ccw([(x - O[0], z - O[1]) for x, z in [
        (-8122, -7060), (-7988, -7058), (-7984, -6988),
        (-7986, -6936), (-8016, -6864), (-8072, -6860),
        (-8120, -6896), (-8124, -7032),
    ]])
    for lod in (0, 1):
        wall_ring(M.mesh(lod, "ground"), ring, -1.5, 0.35)
        ear_fan(M.mesh(lod, "stone"), ring, 0.35)

    def guest(a, b, hv, bay=3.15):
        F = Frame(a, b, O)
        top = balcony_wing(M, F, 0, F.L, hv, GF, GUEST, FH, bay, mats, depth=1.7)
        for lod in (0, 1):
            obox(M.mesh(lod, "slab"), F, -0.3, F.L + 0.3, -hv - 0.25, hv + 0.25, top, top + 0.5)
            obox(M.mesh(lod, "dark"), F, 0.15, F.L - 0.15, -hv + 0.35, hv - 0.35, top + 0.4, top + 1.05)
            obox(M.mesh(lod, "wall"), F, -0.5, 0.12, -hv + 0.35, hv - 0.35, GF, top)
            if lod == 0:
                for f in range(GUEST):
                    yy = GF + f * FH + 0.65
                    uquad(M.mesh(0, "glass"), F, -0.55, -2.0, 2.0, yy, yy + 1.65, -1)
        return top

    # dark balcony slabs measured off the Esri roof plan (8 m grid).
    # north wing, beach end west; south wing set a little inland, also E-W.
    guest((-8116.0, -7052.0), (-8072.0, -7038.0), 10.5)
    guest((-8064.0, -6894.0), (-8022.0, -6876.0), 11.0, bay=3.0)

    def pad(a, b, hv, floors, fh=3.3):
        F = Frame(a, b, O)
        top = balcony_wing(M, F, 0, F.L, hv, 0.4, floors, fh, 5.2, mats, depth=1.15, faces=(-1,))
        for lod in (0, 1):
            obox(M.mesh(lod, "roof"), F, -0.2, F.L + 0.2, -hv - 0.2, hv + 0.2, top, top + 0.45)
        return F

    # white flat roofs between the wings (the bright rectangles in the aerial)
    pad((-8068.0, -7054.0), (-7996.0, -7028.0), 12.0, 2)
    pad((-8096.0, -7012.0), (-8012.0, -6976.0), 16.0, 2)
    pad((-8088.0, -6948.0), (-8008.0, -6916.0), 14.0, 2)
    pad((-8112.0, -6884.0), (-8068.0, -6868.0), 8.0, 2)

    # arrival court. a->b runs north to south, so -v points east, at the drive.
    FA = Frame((-8008.0, -6996.0), (-7992.0, -6940.0), O)
    hv = 8.2
    side_top = 9.0
    # the street face stays at -hv. The upper bay must not step past the arches,
    # or it swallows the semicircular head.
    for lod in (0, 1):
        obox(M.mesh(lod, "yellow"), FA, 0, FA.L, -hv, hv, 0.35, side_top)
        obox(M.mesh(lod, "yellow"), FA, FA.L * 0.30, FA.L * 0.70, -hv, hv, side_top, 11.7)
        # deep overhang and a tall hip so the red roof is the skyline from the drive
        hip_roof(M.mesh(lod, "tile"), FA, FA.L * 0.24, FA.L * 0.76, -hv - 2.4, hv + 0.8, 11.55, 5.4)
        hip_roof(M.mesh(lod, "tile"), FA, -0.6, FA.L * 0.28, -hv - 1.3, hv + 0.5, side_top, 2.8)
        hip_roof(M.mesh(lod, "tile"), FA, FA.L * 0.72, FA.L + 0.6, -hv - 1.3, hv + 0.5, side_top, 2.8)
        obox(M.mesh(lod, "slab"), FA, -0.15, FA.L + 0.15, -hv - 0.25, hv + 0.15, side_top - 0.12, side_top + 0.32)
    um = FA.L * 0.5
    face = -hv - 0.35
    arch(M, FA, um, face, -1, 4.35, 8.7, 2.05, segs=8, frame=0.38, glass="panel", trim="slab")
    arch(M, FA, um, face - 0.08, -1, 4.7, 8.4, 1.65, segs=8, frame=0.18, glass="glass", trim="slab")
    for du in (-6.4, 0.0, 6.4):
        arch(M, FA, um + du, face - 0.08, -1, 0.45, 2.15, 1.45, segs=7, frame=0.24)
    for du in (FA.L * 0.12, FA.L * 0.88):
        arch(M, FA, du, face, -1, 0.5, 2.3, 1.35, segs=6, frame=0.22)
    for du in (-9.2, 9.2):
        obox(M.mesh(0, "slab"), FA, um + du - 0.32, um + du + 0.32, -hv - 0.45, -hv + 0.35, 0.4, side_top)

    info = write_glb(M, HERO / "ritz.glb")
    check_glb(HERO / "ritz.glb")
    if not (3000 <= info["lod0"] <= 4500):
        print("WARN lod0", info["lod0"])
    if info["lod1"] >= 600:
        raise SystemExit(f"lod1 {info['lod1']} over 600")
    patch_manifest(info)
    print("ritz", info)
    return info


def patch_manifest(info):
    text = MANIFEST.read_text()
    i = text.find('"id": "ritz"')
    k = text.find('\n  "id":', i + 10)
    block = text[i:k]
    block = block.replace('"status": "v3-procedural rebuild"',
                           '"status": "v4-grokbot (OSM footprint, photo-matched)"', 1)
    block = re.sub(r'"ritz_lod0": \d+', f'"ritz_lod0": {info["lod0"]}', block, count=1)
    block = re.sub(r'"ritz_lod1": \d+', f'"ritz_lod1": {info["lod1"]}', block, count=1)
    block = block.replace('"textures": 2', '"textures": 0', 1)
    old = '"ref_sources": "ritzcarlton.com Aruba (sand/ochre 9-storey wings, white cornice bands, dark balcony glass); previous v2 photo-matched model; OSM footprint"'
    new = ('"ref_sources": "Street approach Dec 2022 (YouTube b3OMuBzd69w): pale yellow stucco, '
           'white cornices, red-tile hips, tall arched window over three ground arches. '
           'Esri aerial: north and south beach wings are the dark balcony slabs, white flat roofs '
           'between them. Eight floors, 320 rooms, opened 2013 (Coleman Partners). '
           'Built by tools/grokbot/ritz.py"')
    if old in block:
        block = block.replace(old, new, 1)
    elif "YouTube b3OMuBzd69w" not in block:
        raise SystemExit("ref_sources anchor missing")
    block = block.replace(
        '"frame": "glb origin = footprint centroid (world x,z); glTF +X = world x, +Z = world z, Y up; generated by /workspace/landmarks/gen.mjs"',
        '"frame": "glb origin = footprint centroid (world x,z); glTF +X = world x, +Z = world z, Y up; generated by tools/grokbot/ritz.py"',
        1)
    MANIFEST.write_text(text[:i] + block + text[k:])
    # confirm the json still parses and the counts landed
    data = json.loads(MANIFEST.read_text())
    hit = next(h for h in data if h["id"] == "ritz")
    assert hit["tris"]["ritz_lod0"] == info["lod0"]
    assert hit["tris"]["ritz_lod1"] == info["lod1"]


if __name__ == "__main__":
    build()
