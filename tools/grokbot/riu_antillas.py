#!/usr/bin/env python3
"""Hotel Riu Palace Antillas (Palm Beach): white slab over a white podium.

Same hero id, origin and footprint as before (OSM building in r_2_6). The
slab sits on the podium's west side, long axis NNW-SSE, as read from the
Esri aerial (roof strip and its shadow). Reference photo: Commons
'Hotel Riu Palace Aruba in 2015.jpg' (Choinowski, CC BY-SA 4.0), which is
this building seen from J.E. Irausquin: 15 room floors of deep recessed
balconies between white fins and slab edges, a blank service core at the
north end that rises above the roof with a rail, a column of slit windows
and the red RIU wordmark with its crown at the top, and a two-storey white
podium. Geometry only, plus one small sign texture.
"""
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from hero_glb import Model, check_glb, fan, wall_ring, write_glb  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
HERO = ROOT / "game" / "models" / "hero"
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"

O = (-8536.23, -5045.4)
RING = [
    (-8581.5, -5036.2), (-8562.2, -5007.6), (-8550.6, -5015.4), (-8550.8, -5012.1), (-8550.1, -5010.7),
    (-8546.8, -5008.6), (-8544.1, -5008.8), (-8541.8, -5010.4), (-8540.8, -5012.1), (-8540.8, -5016.0),
    (-8532.2, -5003.3), (-8525.9, -5007.1), (-8505.7, -5002.5), (-8503.4, -5021.9), (-8495.6, -5027.8),
    (-8504.6, -5040.2), (-8503.2, -5041.2), (-8507.7, -5047.2), (-8462.8, -5027.5), (-8459.0, -5033.9),
    (-8456.8, -5032.7), (-8446.5, -5053.5), (-8443.2, -5051.6), (-8431.6, -5075.7), (-8510.7, -5114.7),
    (-8549.4, -5088.9), (-8555.0, -5096.2), (-8573.0, -5084.2), (-8568.1, -5076.5), (-8571.4, -5074.5),
    (-8568.9, -5071.0), (-8572.9, -5068.6), (-8570.0, -5064.6), (-8573.1, -5062.6), (-8570.8, -5059.0),
    (-8574.6, -5056.3), (-8571.8, -5053.0), (-8575.4, -5050.5), (-8573.5, -5047.3), (-8576.7, -5044.6),
    (-8574.7, -5040.9),
]
# Slab axis from the aerial: north end (core) to south end, world x,z.
N_END = (-8564.0, -5085.0)
S_END = (-8508.0, -5004.0)  # prow tip lands ~5 m further on
W = 17.0          # slab depth, outer face to outer face
BAL = 1.8         # balcony recess
PODIUM = 8.0      # two-storey podium
FLOOR = 3.0
NFLOORS = 15
CORE = 10.0       # core length at the north end
BAY = 4.0

WHITE = (0.93, 0.93, 0.91)
WHITE_SH = (0.74, 0.75, 0.74)  # recess back wall, out of the sun
ROOF = (0.70, 0.71, 0.70)
GLASS = (0.10, 0.14, 0.18)
RAIL = (0.62, 0.70, 0.72)
LOBBY = (0.16, 0.20, 0.24)
STEEL = (0.80, 0.80, 0.78)


def local(p):
    return (p[0] - O[0], p[1] - O[1])


def ccw(r):
    a = sum(r[i][0] * r[i - 1][1] - r[i - 1][0] * r[i][1] for i in range(len(r)))
    return r if a < 0 else r[::-1]


def ear_fan(mesh, ring, y):
    """Ear-clip a simple polygon (the podium roof is concave)."""
    pts = list(ring)
    area = sum(pts[i - 1][0] * pts[i][1] - pts[i][0] * pts[i - 1][1] for i in range(len(pts)))
    sgn = 1 if area > 0 else -1

    def cross(a, b, c):
        return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0])

    def inside(p, a, b, c):
        d1, d2, d3 = cross(a, b, p), cross(b, c, p), cross(c, a, p)
        neg = d1 < 0 or d2 < 0 or d3 < 0
        pos = d1 > 0 or d2 > 0 or d3 > 0
        return not (neg and pos)

    guard = 0
    while len(pts) > 3 and guard < 10000:
        guard += 1
        n = len(pts)
        for i in range(n):
            a, b, c = pts[i - 1], pts[i], pts[(i + 1) % n]
            if cross(a, b, c) * sgn <= 1e-9:
                continue
            if any(inside(p, a, b, c) for p in pts if p not in (a, b, c)):
                continue
            A, B, C = (a[0], y, a[1]), (b[0], y, b[1]), (c[0], y, c[1])
            # want +Y normal
            nx = (B[1] - A[1]) * (C[2] - A[2]) - (B[2] - A[2]) * (C[1] - A[1])
            ny = (B[2] - A[2]) * (C[0] - A[0]) - (B[0] - A[0]) * (C[2] - A[2])
            mesh.tri(A, B, C) if ny > 0 else mesh.tri(A, C, B)
            del pts[i]
            break
        else:
            break
    if len(pts) == 3:
        a, b, c = pts
        A, B, C = (a[0], y, a[1]), (b[0], y, b[1]), (c[0], y, c[1])
        ny = (B[2] - A[2]) * (C[0] - A[0]) - (B[0] - A[0]) * (C[2] - A[2])
        mesh.tri(A, B, C) if ny > 0 else mesh.tri(A, C, B)


class Frame:
    """Slab frame: u along the axis from the north end, v across (east +)."""

    def __init__(self):
        a, b = local(N_END), local(S_END)
        dx, dz = b[0] - a[0], b[1] - a[1]
        self.L = math.hypot(dx, dz)
        self.ux, self.uz = dx / self.L, dz / self.L
        # v = u rotated so that +v points east (+x)
        self.vx, self.vz = -self.uz, self.ux
        if self.vx < 0:
            self.vx, self.vz = -self.vx, -self.vz
        self.a = a

    def p(self, u, v, y):
        return (self.a[0] + self.ux * u + self.vx * v, y, self.a[1] + self.uz * u + self.vz * v)


def obox(mesh, F, u0, u1, v0, v1, y0, y1):
    """Box in slab frame, faces outward."""
    c = [F.p(u, v, y) for (u, v, y) in (
        (u0, v0, y0), (u1, v0, y0), (u1, v1, y0), (u0, v1, y0),
        (u0, v0, y1), (u1, v0, y1), (u1, v1, y1), (u0, v1, y1))]
    quads = [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]
    cen = tuple(sum(q[k] for q in c) / 8 for k in range(3))
    for q in quads:
        A, B, C, D = (c[i] for i in q)
        nx = (B[1] - A[1]) * (C[2] - A[2]) - (B[2] - A[2]) * (C[1] - A[1])
        ny = (B[2] - A[2]) * (C[0] - A[0]) - (B[0] - A[0]) * (C[2] - A[2])
        nz = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0])
        fc = tuple((A[k] + C[k]) / 2 - cen[k] for k in range(3))
        if nx * fc[0] + ny * fc[1] + nz * fc[2] < 0:
            mesh.quad(A, D, C, B)
        else:
            mesh.quad(A, B, C, D)


def oquad(mesh, F, u0, u1, v, y0, y1, out, uvs=None):
    """Vertical quad at constant v, facing +v if out>0."""
    A, B, C, D = F.p(u0, v, y0), F.p(u1, v, y0), F.p(u1, v, y1), F.p(u0, v, y1)
    nx = (B[1] - A[1]) * (C[2] - A[2]) - (B[2] - A[2]) * (C[1] - A[1])
    nz = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0])
    if (nx * F.vx + nz * F.vz) * out < 0:
        if uvs:
            mesh.quad(A, D, C, B, uvs=(uvs[0], uvs[3], uvs[2], uvs[1]))
        else:
            mesh.quad(A, D, C, B)
    else:
        mesh.quad(A, B, C, D, uvs=uvs)


def sign_png():
    w, h = 512, 256
    im = Image.new("RGBA", (w, h), (237, 237, 232, 255))
    dr = ImageDraw.Draw(im)
    red = (200, 26, 32, 255)
    gold = (196, 150, 52, 255)
    font = ImageFont.truetype(FONT, 190)
    t = "RIU"
    tw = font.getlength(t)
    dr.text(((w - tw) / 2, 30), t, font=font, fill=red)
    # crown: band plus five points with balls, as on the RIU wordmark
    cx, cy = w / 2, 44
    dr.rectangle((cx - 52, cy + 8, cx + 52, cy + 22), fill=gold)
    for i in range(5):
        x = cx - 48 + i * 24
        top = cy - 22 if i in (0, 2, 4) else cy - 12
        dr.polygon([(x - 9, cy + 8), (x + 9, cy + 8), (x, top)], fill=gold)
        dr.ellipse((x - 5, top - 9, x + 5, top + 1), fill=gold)
    return im


def png_bytes(im):
    import io
    b = io.BytesIO()
    im.save(b, "PNG", optimize=True)
    return b.getvalue()


def build():
    F = Frame()
    M = Model("riuantillas")
    M.material("wall", WHITE)
    M.material("shade", WHITE_SH)
    M.material("roof", ROOF)
    M.material("glass", GLASS, rough=0.25)
    M.material("rail", RAIL, rough=0.3)
    M.material("lobby", LOBBY, rough=0.3)
    M.material("steel", STEEL, rough=0.5)
    M.material("sign", WHITE, rough=0.5, textured=True, emissive=0.12)
    ring = ccw([local(p) for p in RING])
    L = F.L
    top = PODIUM + NFLOORS * FLOOR
    roof_y = top + 1.4
    core_top = roof_y + 4.2
    hv = W / 2
    iv = hv - BAL
    room_u0 = CORE
    nb = int(round((L - room_u0) / BAY))
    bay = (L - room_u0) / nb

    for lod in (0, 1):
        m = lambda k: M.mesh(lod, k)
        # podium: ground glass band, white upper storey, roof
        wall_ring(m("lobby"), ring, -2.0, 3.6)
        wall_ring(m("wall"), ring, 3.6, PODIUM + 0.6)
        ear_fan(m("roof"), ring, PODIUM + 0.6)
        # core block at the north end, full height
        obox(m("wall"), F, -0.5, CORE, -hv - 0.4, hv + 0.4, PODIUM, core_top)
        # slab mass behind the balconies, roof slab and parapet
        obox(m("shade" if lod == 0 else "wall"), F, CORE, L, -iv, iv, PODIUM, top)
        obox(m("wall"), F, CORE - 0.2, L + 0.2, -hv - 0.15, hv + 0.15, top, roof_y)
        ear_fan(m("roof"), [(F.p(u, v, 0)[0], F.p(u, v, 0)[2]) for u, v in
                            ((CORE, -hv), (L, -hv), (L, hv), (CORE, hv))], roof_y + 0.01)
        # south end wall closes the balcony recess
        obox(m("wall"), F, L - 0.4, L + 0.2, -hv - 0.15, hv + 0.15, PODIUM, top)
        # pointed south prow (the aerial shows the slab ending in a point)
        tip = F.p(L + 5.0, 0, 0)
        e1, e2 = F.p(L + 0.2, -hv - 0.15, 0), F.p(L + 0.2, hv + 0.15, 0)
        for (a, b) in ((e2, tip), (tip, e1)):
            m("wall").quad((a[0], PODIUM, a[2]), (a[0], roof_y, a[2]), (b[0], roof_y, b[2]), (b[0], PODIUM, b[2]))
        m("roof").tri((e1[0], roof_y + 0.01, e1[2]), (tip[0], roof_y + 0.01, tip[2]), (e2[0], roof_y + 0.01, e2[2]))
        if lod == 1:
            # far view: a dark band per floor on both long faces reads as the grid
            for f in range(NFLOORS):
                y0 = PODIUM + f * FLOOR + 0.9
                for s in (-1, 1):
                    oquad(m("glass"), F, CORE, L - 0.4, s * (hv + 0.05), y0, y0 + 1.7, s)
            continue
        # ---- lod0 detail ----
        for f in range(NFLOORS + 1):
            y = PODIUM + f * FLOOR
            # floor slab edge runs the full length of both faces
            for s in (-1, 1):
                v0, v1 = sorted((s * iv, s * (hv + 0.15)))
                obox(m("wall"), F, CORE, L - 0.4, v0, v1, y - 0.12, y + 0.22)
        for f in range(NFLOORS):
            y = PODIUM + f * FLOOR
            for s in (-1, 1):
                # glass railing panel and top rail on the balcony line
                oquad(m("rail"), F, CORE, L - 0.4, s * (hv - 0.05), y + 0.22, y + 1.05, s)
                v0, v1 = sorted((s * (hv - 0.12), s * (hv + 0.02)))
                obox(m("steel"), F, CORE, L - 0.4, v0, v1, y + 1.02, y + 1.1)
                # sliding doors set into the back wall, one per bay
                for b in range(nb):
                    u0 = room_u0 + b * bay + 0.45
                    oquad(m("glass"), F, u0, u0 + bay - 0.9, s * (iv + 0.03), y + 0.3, y + 2.55, s)
        # fins between bays, outer face to back wall
        for b in range(nb + 1):
            u = room_u0 + b * bay
            for s in (-1, 1):
                v0, v1 = sorted((s * iv, s * (hv + 0.1)))
                obox(m("wall"), F, u - 0.17, u + 0.17, v0, v1, PODIUM, top)
        # core: slit windows up the east face's south edge, roof rail, sign
        for f in range(NFLOORS + 1):
            y = PODIUM + f * FLOOR + 1.0
            for s in (-1, 1):
                oquad(m("glass"), F, CORE - 2.6, CORE - 1.4, s * (hv + 0.42), y, y + 0.35, s)
        for (ua, ub) in ((-0.5, CORE),):
            for s in (-1, 1):
                v0, v1 = sorted((s * (hv + 0.3), s * (hv + 0.4)))
                obox(m("steel"), F, ua, ub, v0, v1, core_top + 0.95, core_top + 1.05)
            for k in range(6):
                u = ua + (ub - ua) * k / 5
                for s in (-1, 1):
                    v0, v1 = sorted((s * (hv + 0.3), s * (hv + 0.4)))
                    obox(m("steel"), F, u - 0.05, u + 0.05, v0, v1, core_top, core_top + 1.0)
        ear_fan(m("roof"), [(F.p(u, v, 0)[0], F.p(u, v, 0)[2]) for u, v in
                            ((-0.5, -hv - 0.4), (CORE, -hv - 0.4), (CORE, hv + 0.4), (-0.5, hv + 0.4))],
                core_top + 0.01)
    # RIU wordmark near the top of the core, both long faces (both LODs)
    for lod in (0, 1):
        for s in (-1, 1):
            u0, u1 = 0.3, CORE - 0.3
            y0, y1 = core_top - 5.6, core_top - 0.5
            if s > 0:
                oquad(M.mesh(lod, "sign"), F, u0, u1, s * (hv + 0.45), y0, y1, s,
                      uvs=((1, 1), (0, 1), (0, 0), (1, 0)))
            else:
                oquad(M.mesh(lod, "sign"), F, u0, u1, s * (hv + 0.45), y0, y1, s,
                      uvs=((0, 1), (1, 1), (1, 0), (0, 0)))
    info = write_glb(M, HERO / "riuantillas.glb", images=[png_bytes(sign_png())])
    check_glb(HERO / "riuantillas.glb")
    print("riuantillas", info, "slab", round(L, 1), "m bays", nb, "roof", round(roof_y, 1), "core", round(core_top, 1))
    return info


if __name__ == "__main__":
    build()
