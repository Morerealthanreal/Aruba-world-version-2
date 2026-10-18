#!/usr/bin/env python3
"""Queen Beatrix landside halls.

USA Departures and Non-USA Departures are cream halls with a teal metal
sawtooth roof and a glass curb front, the way the departures photos read.
Arrivals is a glass front under a folded blue fascia. Each hall keeps its
own OSM footprint. Does not move or rescale airport_fx, apt_tealroof, or
apt_tower. Signs are drawn text, not photos.
"""
import json
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from accuracy_batch3 import ccw, cent, pip  # noqa: E402
from hero_glb import Model, check_glb, fan, wall_ring, write_glb  # noqa: E402
from hooiberg_stair import sample_h  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
HERO = ROOT / "game" / "models" / "hero"
MANIFEST = ROOT / "game" / "data" / "hero" / "manifest.json"
REAL = ROOT / "game" / "data" / "real"

HALLS = [
    ("apt_usa_dep", "USA Departures", "USA Departures"),
    ("apt_nonusa_dep", "Non-USA Departures", "Non-USA Departures"),
    ("apt_arrivals", "Arrivals", "Arrivals"),
]
CREAM = (0.88, 0.80, 0.66)
# Saturated yellow-cream. (0.88, 0.80, 0.66) washes out to a grey glass box in this sun.
# Pale yellow-cream fascia. The curb photo is glass and white, not a brown wall.
USA_WALL = (0.93, 0.88, 0.76)
TEAL = (0.16, 0.64, 0.66)
ARR_BLUE = (0.10, 0.30, 0.74)
GLASS = (0.10, 0.20, 0.26)
WHITE = (0.93, 0.93, 0.90)
# 5-wide, 7-tall. A sign texture is what pushed the phone soak to 4.5
# (limit 4) after main started uploading hero images inside the load radius.
GLYPH = {
    "A": (" ### ", "#   #", "#   #", "#####", "#   #", "#   #", "#   #"),
    "C": (" ####", "#    ", "#    ", "#    ", "#    ", "#    ", " ####"),
    "D": ("###  ", "#  # ", "#   #", "#   #", "#   #", "#  # ", "###  "),
    "E": ("#####", "#    ", "#    ", "#### ", "#    ", "#    ", "#####"),
    "I": ("#####", "  #  ", "  #  ", "  #  ", "  #  ", "  #  ", "#####"),
    "L": ("#    ", "#    ", "#    ", "#    ", "#    ", "#    ", "#####"),
    "N": ("#   #", "##  #", "# # #", "#  ##", "#   #", "#   #", "#   #"),
    "O": (" ### ", "#   #", "#   #", "#   #", "#   #", "#   #", " ### "),
    "P": ("#### ", "#   #", "#   #", "#### ", "#    ", "#    ", "#    "),
    "R": ("#### ", "#   #", "#   #", "#### ", "# #  ", "#  # ", "#   #"),
    "S": (" ####", "#    ", "#    ", " ### ", "    #", "    #", "#### "),
    "T": ("#####", "  #  ", "  #  ", "  #  ", "  #  ", "  #  ", "  #  "),
    "U": ("#   #", "#   #", "#   #", "#   #", "#   #", "#   #", " ### "),
    "V": ("#   #", "#   #", "#   #", "#   #", " # # ", " # # ", "  #  "),
    "-": ("     ", "     ", "     ", " ### ", "     ", "     ", "     "),
    " ": ("     ", "     ", "     ", "     ", "     ", "     ", "     "),
}


def draw_sign_text(mesh, text, left, right, y_top, y_bot, oxn, ozn, curb=False):
    glyphs = [GLYPH.get(ch, GLYPH[" "]) for ch in text]
    cell_w = 5
    gap = 1
    total = len(glyphs) * cell_w + (len(glyphs) - 1) * gap
    span = 0.9
    u0 = (1 - span) / 2
    lx, lz = left
    rx, rz = right

    def xz(u, push):
        return (
            lx + (rx - lx) * u + oxn * push,
            lz + (rz - lz) * u + ozn * push,
        )

    for i, glyph in enumerate(glyphs):
        origin = i * (cell_w + gap)
        for row, bits in enumerate(glyph):
            for col, bit in enumerate(bits):
                if bit != "#":
                    continue
                ua = u0 + span * (origin + col) / total
                ub = u0 + span * (origin + col + 1) / total
                va = row / 7
                vb = (row + 1) / 7
                ax, az = xz(ua, 0.06)
                bx, bz = xz(ub, 0.06)
                ya = y_top + (y_bot - y_top) * (0.08 + 0.84 * va)
                yb = y_top + (y_bot - y_top) * (0.08 + 0.84 * vb)
                # Faces the curb. The reverse faces the hall and is culled.
                mesh.quad((ax, ya, az), (ax, yb, az), (bx, yb, bz), (bx, ya, bz))


def load():
    roads, buildings = [], []
    for p in sorted(REAL.glob("r_*.json")):
        d = json.loads(p.read_text())
        roads.extend(d.get("roads") or [])
        buildings.extend(b for b in (d.get("b") or []) if b.get("p") and len(b["p"]) >= 3)
    return roads, buildings


def nearest_curb(roads, x, z):
    best = None
    for r in roads:
        if (r.get("c") or 0) < 2 or (r.get("w") or 0) < 6:
            continue
        pts = r.get("p") or []
        for i in range(len(pts) - 1):
            ax, az = pts[i]
            bx, bz = pts[i + 1]
            dx, dz = bx - ax, bz - az
            L2 = dx * dx + dz * dz or 1
            t = max(0, min(1, ((x - ax) * dx + (z - az) * dz) / L2))
            qx, qz = ax + t * dx, az + t * dz
            d = (qx - x) ** 2 + (qz - z) ** 2
            if best is None or d < best[0]:
                best = (d, qx, qz)
    if best is None:
        raise SystemExit(f"no curb road near {x},{z}")
    return best[1], best[2]


def tri_out(mesh, a, b, c, outward):
    ax, ay, az = b[0] - a[0], b[1] - a[1], b[2] - a[2]
    bx, by, bz = c[0] - a[0], c[1] - a[1], c[2] - a[2]
    nx = ay * bz - az * by
    ny = az * bx - ax * bz
    nz = ax * by - ay * bx
    if nx * outward[0] + ny * outward[1] + nz * outward[2] < 0:
        mesh.tri(a, c, b)
    else:
        mesh.tri(a, b, c)


def road_edges(local, ox, oz, road):
    """Every wall that faces the landside curb. Arrivals is a zigzag of short edges."""
    found = []
    for k in range(len(local)):
        a, c = local[k], local[(k + 1) % len(local)]
        dx, dz = c[0] - a[0], c[1] - a[1]
        length = math.hypot(dx, dz) or 1
        mx = (a[0] + c[0]) / 2 + ox
        mz = (a[1] + c[1]) / 2 + oz
        oxn, ozn = dz / length, -dx / length
        to_rx, to_rz = road[0] - mx, road[1] - mz
        if oxn * to_rx + ozn * to_rz <= 0:
            continue
        if math.hypot(to_rx, to_rz) > 45 or length < 2.5:
            continue
        found.append((a, c, oxn, ozn, length))
    if not found:
        raise SystemExit("no curb-facing edge")
    return found


def column_box(mesh, cx, cz, ax, az, ox, oz, y0, y1, s=0.7):
    """White column. (outward, up, along-facade) is right-handed, same winding as box()."""
    hx, hz = s / 2, s / 2

    def p(lx, y, lz):
        return (cx + lx * ox + lz * ax, y, cz + lx * oz + lz * az)

    lbf, rbf = p(-hx, y0, -hz), p(hx, y0, -hz)
    ltf, rtf = p(-hx, y1, -hz), p(hx, y1, -hz)
    lbb, rbb = p(-hx, y0, hz), p(hx, y0, hz)
    ltb, rtb = p(-hx, y1, hz), p(hx, y1, hz)
    mesh.quad(rbf, rbb, rtb, rtf)
    mesh.quad(lbb, lbf, ltf, ltb)
    mesh.quad(ltf, rtf, rtb, ltb)
    mesh.quad(lbf, lbb, rbb, rbf)
    mesh.quad(lbb, ltb, rtb, rbb)
    mesh.quad(lbf, rbf, rtf, ltf)


def palm(trunk, frond, x, z, ax, az, ox, oz, h=8.6):
    """A tall curb palm. The departures photo has one filling the right of the frame."""
    column_box(trunk, x, z, ax, az, ox, oz, 0.0, h, 0.38)
    for k in range(8):
        yaw = k * 0.785
        c, s = math.cos(yaw), math.sin(yaw)
        dx, dz = ax * c + ox * s, az * c + oz * s
        px, pz = -dz, dx
        tip = (x + dx * 3.8, h + 0.55, z + dz * 3.8)
        a = (x + dx * 0.2, h - 0.05, z + dz * 0.2)
        b = (tip[0] + px * 0.55, tip[1] - 1.15, tip[2] + pz * 0.55)
        d = (tip[0] - px * 0.55, tip[1] - 1.35, tip[2] - pz * 0.55)
        frond.quad(a, b, tip, d)


def person(parts, x, z, ax, az, ox, oz, shirt):
    """A clothed figure at the doors. Boxes only, never the pedestrian system."""
    skin, cloth, shorts = parts

    def box(mesh, y0, y1, s, along=0.0):
        column_box(mesh, x + ax * along, z + az * along, ax, az, ox, oz, y0, y1, s)

    box(skin, 0.0, 0.78, 0.14, -0.1)
    box(skin, 0.0, 0.78, 0.14, 0.1)
    box(shorts, 0.72, 1.12, 0.32)
    box(cloth, 1.08, 1.68, 0.4)
    box(skin, 1.64, 1.92, 0.2)


def pitched_gable(roof, a, c, oxn, ozn, eave, peak, n, depth=6.8, glass=None):
    """A real gable: triangular end plus two slopes back to a ridge. Not a flat triangle."""
    dx, dz = c[0] - a[0], c[1] - a[1]
    length = math.hypot(dx, dz) or 1
    px, pz = dx / length, dz / length
    step = length / n
    for i in range(n):
        def at(t, y, push):
            return (
                a[0] + px * t + oxn * push,
                y,
                a[1] + pz * t + ozn * push,
            )
        t0, t1, tm = step * i, step * (i + 1), step * (i + 0.5)
        fl, fr = at(t0, eave, 0.7), at(t1, eave, 0.7)
        fp = at(tm, peak, 0.75)
        bl, br = at(t0, eave, -depth), at(t1, eave, -depth)
        bp = at(tm, peak, -depth)
        tri_out(roof, fl, fr, fp, (oxn, 0.15, ozn))
        tri_out(roof, bl, bp, br, (-oxn, 0.1, -ozn))
        tri_out(roof, fl, fp, bp, (-px, 1, -pz))
        tri_out(roof, fl, bp, bl, (-px, 1, -pz))
        tri_out(roof, fr, br, bp, (px, 1, pz))
        tri_out(roof, fr, bp, fp, (px, 1, pz))
        if glass is not None:
            # Glass in the gable end, inset from the teal frame.
            def inn(p, q, k):
                return (p[0] + (q[0] - p[0]) * k, p[1] + (q[1] - p[1]) * k, p[2] + (q[2] - p[2]) * k)
            # Most of the gable end is glass, the way the curb photo reads.
            g0, g1 = inn(fp, fl, 0.86), inn(fp, fr, 0.86)
            # Sit the pane in front of the teal triangle. On the same plane the roof wins.
            def out(p, push):
                return (p[0] + oxn * push, p[1], p[2] + ozn * push)
            g0, g1 = out(g0, 0.22), out(g1, 0.22)
            g2 = out((fp[0], fp[1] - 0.55, fp[2]), 0.28)
            tri_out(glass, g0, g1, g2, (oxn, 0.2, ozn))


def sawtooth(mesh, a, c, oxn, ozn, eave, peak, n):
    dx, dz = c[0] - a[0], c[1] - a[1]
    length = math.hypot(dx, dz) or 1
    px, pz = dx / length, dz / length
    step = length / n
    out = (oxn, 0.35, ozn)
    for i in range(n):
        def at(t, y, push):
            return (
                a[0] + px * t + oxn * push,
                y,
                a[1] + pz * t + ozn * push,
            )
        t0, t1, tm = step * i, step * (i + 1), step * (i + 0.5)
        left, right = at(t0, eave, 0.15), at(t1, eave, 0.15)
        top = at(tm, peak, 0.4)
        tri_out(mesh, left, right, top, out)
        # Ridge sloping back onto the roof so the gable has thickness.
        back = at(tm, eave + 0.15, -2.4)
        tri_out(mesh, left, top, back, (0, 1, 0))
        tri_out(mesh, top, right, back, (0, 1, 0))


def build_one(id_, osm_name, label, buildings, roads, heroes):
    hits = []
    for b in buildings:
        if (b.get("n") or "") != osm_name:
            continue
        cx, cz = cent(b["p"])
        if -4500 < cx < -3800 and 1600 < cz < 2000:
            hits.append(b)
    if len(hits) != 1:
        raise SystemExit(f"{osm_name}: expected 1 footprint, got {len(hits)}")
    b = hits[0]
    ring_w = ccw(b["p"])
    ox, oz = cent(ring_w)
    for e in heroes:
        hp = e.get("hide_footprint") or []
        if e.get("id") == id_:
            continue
        if len(hp) >= 3 and pip(ox, oz, hp):
            raise SystemExit(f"{osm_name} centroid sits in {e['id']}")
    road = nearest_curb(roads, ox, oz)
    local = [(x - ox, z - oz) for x, z in ring_w]
    faces = road_edges(local, ox, oz, road)
    a, c, oxn, ozn, L = max(faces, key=lambda e: e[4])
    dx, dz = c[0] - a[0], c[1] - a[1]
    arrivals = "arriv" in osm_name.lower()
    usa = id_ == "apt_usa_dep"
    # OSM puts Non-USA at 3.7 m. The landside photos are two-storey halls;
    # the eave stays at the tagged height and the roof rises above it.
    h = 6.6 if (b.get("h") or 0) >= 6 else 4.2
    roof_c = ARR_BLUE if arrivals else TEAL
    n_gable = max(3, min(7, int(sum(e[4] for e in faces) / 12)))

    M = Model(id_)
    wall = M.material("wall", USA_WALL if usa else CREAM, 0.78)
    roofm = M.material("roof", roof_c, 0.45)
    # USA glass is the blue-green curtain wall. The other halls keep the darker pane.
    # Deeper than the teal roof so the gable-end glass and the curtain wall stay separate.
    # Light enough that the sun does not wash it back to the grey wall behind it.
    glass = M.material(
        "glass",
        (0.52, 0.74, 0.80) if usa else GLASS,
        0.18 if usa else 0.22,
        double=True,
    )
    white = M.material("white", WHITE, 0.55)
    # Double-sided so the curb sees the letters even if a gable sits on the same plane.
    ink = M.material("ink", (0.05, 0.05, 0.06), 0.45, double=True) if usa else None
    panel = M.material("panel", (0.10, 0.12, 0.14), 0.55)
    # The curb photo has yellow airline boards under the glass. A flat yellow
    # quad, not a pasted sign, and only on USA Departures.
    board = M.material("board", (1.0, 0.85, 0.05), 0.4, double=True, emissive=0.85) if usa else None
    trunk = M.material("trunk", (0.42, 0.30, 0.16), 0.85) if usa else None
    frond = M.material("frond", (0.10, 0.42, 0.16), 0.8, double=True) if usa else None
    skin = M.material("skin", (0.62, 0.45, 0.32), 0.7) if usa else None
    shirt_a = M.material("shirt", (0.12, 0.28, 0.55), 0.7) if usa else None
    shirt_b = M.material("shirtb", (0.55, 0.12, 0.14), 0.7) if usa else None
    shorts = M.material("shorts", (0.16, 0.16, 0.18), 0.75) if usa else None
    for lod in (0, 1):
        wall_ring(M.mesh(lod, wall), local, 0.05, h)
        fan(M.mesh(lod, roofm), local, h + 0.05, up=True)
        peak = h + (4.2 if usa else 1.05 if arrivals else 1.7)
        for ea, ec, enx, enz, elen in faces:
            bays = 1 if elen < 9 else max(2, min(6, int(elen / 12)))
            if lod == 1:
                bays = max(1, bays // 2) if usa else 1
            if usa:
                gmesh = M.mesh(lod, glass) if lod == 0 else None
                pitched_gable(M.mesh(lod, roofm), ea, ec, enx, enz, h, peak, bays, glass=gmesh)
            else:
                sawtooth(M.mesh(lod, roofm), ea, ec, enx, enz, h - 0.05, peak, bays)
        if lod == 1:
            continue
        Gm, Wm, Sm = M.mesh(lod, glass), M.mesh(lod, white), M.mesh(lod, panel)
        Bm = M.mesh(lod, board) if board else None
        for ea, ec, enx, enz, elen in faces:
            edx, edz = (ec[0] - ea[0]) / elen, (ec[1] - ea[1]) / elen
            bays = 1 if elen < 9 else max(2, min(6, int(elen / 12)))
            if usa:
                # White colonnade in front of a glass curtain wall, plus the eave beam.
                for i in range(bays + 1):
                    t = i / bays
                    mx = ea[0] + (ec[0] - ea[0]) * t
                    mz = ea[1] + (ec[1] - ea[1]) * t
                    column_box(Wm, mx + enx * 1.35, mz + enz * 1.35, edx, edz, enx, enz, 0.02, h - 0.08, 0.62)
                for yb, bh, push in ((h - 0.42, 0.32, 1.2), (2.48, 0.22, 1.45)):
                    beam0 = (ea[0] + enx * push, yb, ea[1] + enz * push)
                    beam1 = (ec[0] + enx * push, yb, ec[1] + enz * push)
                    Wm.quad(
                        (beam0[0], beam0[1], beam0[2]),
                        (beam1[0], beam1[1], beam1[2]),
                        (beam1[0], beam1[1] + bh, beam1[2]),
                        (beam0[0], beam0[1] + bh, beam0[2]),
                    )
                for i in range(bays):
                    t = (i + 0.5) / bays
                    mx, mz = ea[0] + (ec[0] - ea[0]) * t, ea[1] + (ec[1] - ea[1]) * t
                    half = elen / bays * 0.46
                    # Upper curtain wall, almost the full bay.
                    # Stop below the fascia so the cream band and the letters stay visible.
                    g0 = (mx - edx * half + enx * 0.4, 2.85, mz - edz * half + enz * 0.4)
                    g1 = (mx + edx * half + enx * 0.4, 2.85, mz + edz * half + enz * 0.4)
                    g2 = (mx + edx * half + enx * 0.4, h - 1.85, mz + edz * half + enz * 0.4)
                    g3 = (mx - edx * half + enx * 0.4, h - 1.85, mz - edz * half + enz * 0.4)
                    Gm.quad(g0, g1, g2, g3)
                    # Glass doors under the walkway beam.
                    dw = half * 0.62
                    d0 = (mx - edx * dw + enx * 0.55, 0.05, mz - edz * dw + enz * 0.55)
                    d1 = (mx + edx * dw + enx * 0.55, 0.05, mz + edz * dw + enz * 0.55)
                    d2 = (mx + edx * dw + enx * 0.55, 2.32, mz + edz * dw + enz * 0.55)
                    d3 = (mx - edx * dw + enx * 0.55, 2.32, mz - edz * dw + enz * 0.55)
                    Gm.quad(d0, d1, d2, d3)
                    # Yellow airline board on the glass, every other bay so they stay separate.
                    if i % 2 == 0:
                        bw = min(3.2, half * 1.15)
                        b0 = (mx - edx * bw + enx * 0.9, 3.15, mz - edz * bw + enz * 0.9)
                        b1 = (mx + edx * bw + enx * 0.9, 3.15, mz + edz * bw + enz * 0.9)
                        b2 = (mx + edx * bw + enx * 0.9, 4.15, mz + edz * bw + enz * 0.9)
                        b3 = (mx - edx * bw + enx * 0.9, 4.15, mz - edz * bw + enz * 0.9)
                        Bm.quad(b0, b3, b2, b1)
                continue
            for i in range(bays):
                t = (i + 0.5) / bays
                mx, mz = ea[0] + (ec[0] - ea[0]) * t, ea[1] + (ec[1] - ea[1]) * t
                half = elen / bays * 0.38
                g0 = (mx - edx * half + enx * 0.1, 0.35, mz - edz * half + enz * 0.1)
                g1 = (mx + edx * half + enx * 0.1, 0.35, mz + edz * half + enz * 0.1)
                g2 = (mx + edx * half + enx * 0.1, h - 0.85, mz + edz * half + enz * 0.1)
                g3 = (mx - edx * half + enx * 0.1, h - 0.85, mz - edz * half + enz * 0.1)
                Gm.quad(g0, g1, g2, g3)
                col = (mx + edx * half + enx * 0.12, mz + edz * half + enz * 0.12)
                Wm.quad(
                    (col[0] - edx * 0.1, 0.2, col[1] - edz * 0.1),
                    (col[0] + edx * 0.1, 0.2, col[1] + edz * 0.1),
                    (col[0] + edx * 0.1, h - 0.3, col[1] + edz * 0.1),
                    (col[0] - edx * 0.1, h - 0.3, col[1] - edz * 0.1),
                )
        # From the curb, screen-left is toward c and screen-right toward a.
        px, pz = (c[0] - a[0]) / L, (c[1] - a[1]) / L
        half_s = min(7.5, L * 0.28)
        mid = ((a[0] + c[0]) / 2, (a[1] + c[1]) / 2)
        # USA letters sit on the cream fascia under the eave, in front of the columns.
        if usa:
            top, bot = h - 0.12, h - 1.55
            push = 1.7
        else:
            top, bot = h - 0.25, h - 1.15
            push = 0.45
        left = (mid[0] + px * half_s + oxn * push, mid[1] + pz * half_s + ozn * push)
        right = (mid[0] - px * half_s + oxn * push, mid[1] - pz * half_s + ozn * push)
        if not usa:
            Sm.quad(
                (left[0], top, left[1]), (left[0], bot, left[1]),
                (right[0], bot, right[1]), (right[0], top, right[1]),
            )
            draw_sign_text(Wm, label.upper(), left, right, top, bot, oxn, ozn)
        else:
            # Dark letters on the cream fascia. A black panel read as a bar, not a sign.
            draw_sign_text(M.mesh(lod, ink), label.upper(), left, right, top, bot, oxn, ozn, curb=True)
            edx, edz = (c[0] - a[0]) / L, (c[1] - a[1]) / L
            Tm, Fm = M.mesh(lod, trunk), M.mesh(lod, frond)
            # The curb photo stands just west of centre, so one palm frames the right.
            for t in (0.40, 0.74):
                px = a[0] + (c[0] - a[0]) * t + oxn * 8.4
                pz = a[1] + (c[1] - a[1]) * t + ozn * 8.4
                palm(Tm, Fm, px, pz, edx, edz, oxn, ozn)
            shirts = (shirt_a, shirt_b, shirt_a, shirt_b, shirt_a)
            for i, t in enumerate((0.52, 0.56, 0.60, 0.66, 0.71)):
                px = a[0] + (c[0] - a[0]) * t + oxn * 3.1
                pz = a[1] + (c[1] - a[1]) * t + ozn * 3.1
                person((M.mesh(lod, skin), M.mesh(lod, shirts[i]), M.mesh(lod, shorts)), px, pz, edx, edz, oxn, ozn, shirts[i])
    info = write_glb(M, HERO / f"{id_}.glb")
    check_glb(HERO / f"{id_}.glb")
    y = sample_h(ox, oz, {})
    print(id_, osm_name, round(ox, 2), round(oz, 2), "y", round(y, 2), "h", h, "front", round(L, 1), "gables", n_gable, info)
    return info, ox, oz, y, ring_w


def upsert(entries):
    data = json.loads(MANIFEST.read_text())
    by_id = {e["id"]: e for e in entries}
    out, seen = [], set()
    for item in data:
        if item.get("id") in by_id:
            out.append(by_id[item["id"]])
            seen.add(item["id"])
        else:
            out.append(item)
    for e in entries:
        if e["id"] not in seen:
            out.append(e)
    old = [i.get("id") for i in data]
    new = [i.get("id") for i in out]
    if [i for i in old if i not in by_id] != [i for i in new if i not in by_id]:
        raise SystemExit("manifest id order changed")
    MANIFEST.write_text(json.dumps(out, indent=1) + "\n")
    print("manifest", list(by_id))


def main():
    roads, buildings = load()
    heroes = json.loads(MANIFEST.read_text())
    entries = []
    ref = (
        "Queen Beatrix landside. USA Departures matches Commons 'Aruba Airport US departures "
        "terminal': yellow-cream fascia, teal pitched gables with glass in the gable ends, "
        "a glass curtain wall, white colonnade, yellow airline boards, USA Departures letters, "
        "curb palms, and people at the doors. Arrivals keeps the folded blue fascia. "
        "Non-USA Departures keeps the sawtooth on its own footprint. airport_fx, apt_tealroof, and "
        "the control tower are unchanged. The hall names are letter geometry, with no embedded image, so the phone soak does not gain a texture."
    )
    for id_, osm_name, label in HALLS:
        info, ox, oz, y, ring = build_one(id_, osm_name, label, buildings, roads, heroes)
        y = round(y, 2) or 0.05
        entries.append({
            "id": id_, "k": id_, "name": osm_name, "status": "accuracy-airport",
            "x": round(ox, 2), "z": round(oz, 2), "y": y, "rotation": 0,
            "glb": f"models/hero/{id_}.glb",
            "lod": {"hi": f"{id_}_lod0", "lo": f"{id_}_lod1", "switch_m": 200},
            "tris": {f"{id_}_lod0": info["lod0"], f"{id_}_lod1": info["lod1"]},
            "textures": 0,
            "hide_footprint": [[round(p[0], 2), round(p[1], 2)] for p in ring],
            "hide": [],
            "sign": False,
            "kind": "replace",
            "new_place": True,
            "geo_source": f"OSM building '{osm_name}'",
            "ref_sources": ref,
            "frame": "glb origin = footprint centroid (world x,z); glTF +X = world x, +Z = world z, Y up",
            "cat": "landmark",
        })
    upsert(entries)


if __name__ == "__main__":
    main()
