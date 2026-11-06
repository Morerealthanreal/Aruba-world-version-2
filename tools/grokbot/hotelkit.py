"""Shared pieces for the Palm Beach hotel heroes (grokbot/palm-*).

A wing is an oriented block between two world points (its centre line),
with recessed balconies on both long faces: slab edges per floor, fins per
bay, railings and dark doors in lod0, and a dark band per floor in lod1.
All coordinates handed to the Model are local to the hero origin.
"""
import io
import math

from PIL import Image, ImageDraw, ImageFont

FONT_SANS = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_SERIF = "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"


class Frame:
    """u along a->b, v across (+v is u turned to the right, east-ish)."""

    def __init__(self, a, b, origin):
        a = (a[0] - origin[0], a[1] - origin[1])
        b = (b[0] - origin[0], b[1] - origin[1])
        dx, dz = b[0] - a[0], b[1] - a[1]
        self.L = math.hypot(dx, dz)
        self.ux, self.uz = dx / self.L, dz / self.L
        self.vx, self.vz = -self.uz, self.ux
        self.a = a

    def p(self, u, v, y):
        return (self.a[0] + self.ux * u + self.vx * v, y, self.a[1] + self.uz * u + self.vz * v)

    def xz(self, u, v):
        q = self.p(u, v, 0)
        return (q[0], q[2])


def _quad_out(mesh, A, B, C, D, cen, uvs=None):
    nx = (B[1] - A[1]) * (C[2] - A[2]) - (B[2] - A[2]) * (C[1] - A[1])
    ny = (B[2] - A[2]) * (C[0] - A[0]) - (B[0] - A[0]) * (C[2] - A[2])
    nz = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0])
    fc = tuple((A[k] + C[k]) / 2 - cen[k] for k in range(3))
    if nx * fc[0] + ny * fc[1] + nz * fc[2] < 0:
        mesh.quad(A, D, C, B, uvs=(uvs[0], uvs[3], uvs[2], uvs[1]) if uvs else None)
    else:
        mesh.quad(A, B, C, D, uvs=uvs)


def obox(mesh, F, u0, u1, v0, v1, y0, y1, top=True, bottom=False):
    c = [F.p(u, v, y) for (u, v, y) in (
        (u0, v0, y0), (u1, v0, y0), (u1, v1, y0), (u0, v1, y0),
        (u0, v0, y1), (u1, v0, y1), (u1, v1, y1), (u0, v1, y1))]
    cen = tuple(sum(q[k] for q in c) / 8 for k in range(3))
    quads = [(0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)]
    if top:
        quads.append((4, 7, 6, 5))
    if bottom:
        quads.append((0, 1, 2, 3))
    for q in quads:
        _quad_out(mesh, *(c[i] for i in q), cen)


def vquad(mesh, F, u0, u1, v, y0, y1, out, uvs=None):
    """Vertical quad at constant v facing +v (out>0) or -v."""
    A, B, C, D = F.p(u0, v, y0), F.p(u1, v, y0), F.p(u1, v, y1), F.p(u0, v, y1)
    cen = F.p((u0 + u1) / 2, v - out, (y0 + y1) / 2)
    _quad_out(mesh, A, B, C, D, cen, uvs)


def uquad(mesh, F, u, v0, v1, y0, y1, out, uvs=None):
    """Vertical quad at constant u facing +u (out>0) or -u."""
    A, B, C, D = F.p(u, v0, y0), F.p(u, v1, y0), F.p(u, v1, y1), F.p(u, v0, y1)
    cen = F.p(u - out, (v0 + v1) / 2, (y0 + y1) / 2)
    _quad_out(mesh, A, B, C, D, cen, uvs)


def hip_roof(mesh, F, u0, u1, v0, v1, y0, rise):
    """Hipped roof over a rectangle; ridge along the longer side."""
    du, dv = u1 - u0, v1 - v0
    r = min(du, dv) / 2
    if du >= dv:
        ra, rb = (u0 + r, (v0 + v1) / 2), (u1 - r, (v0 + v1) / 2)
    else:
        ra, rb = ((u0 + u1) / 2, v0 + r), ((u0 + u1) / 2, v1 - r)
    yt = y0 + rise
    c = [F.p(u0, v0, y0), F.p(u1, v0, y0), F.p(u1, v1, y0), F.p(u0, v1, y0)]
    A, B = F.p(ra[0], ra[1], yt), F.p(rb[0], rb[1], yt)
    cen = F.p((u0 + u1) / 2, (v0 + v1) / 2, y0 - 5)
    # assign each eave edge to its nearest ridge end
    def near(q):
        return A if (q[0] - A[0]) ** 2 + (q[2] - A[2]) ** 2 <= (q[0] - B[0]) ** 2 + (q[2] - B[2]) ** 2 else B
    for i in range(4):
        p0, p1 = c[i], c[(i + 1) % 4]
        n0, n1 = near(p0), near(p1)
        if n0 is n1:
            tri_out(mesh, p0, p1, n0, cen)
        else:
            _quad_out(mesh, p0, p1, n1, n0, cen)


def tri_out(mesh, A, B, C, cen):
    nx = (B[1] - A[1]) * (C[2] - A[2]) - (B[2] - A[2]) * (C[1] - A[1])
    ny = (B[2] - A[2]) * (C[0] - A[0]) - (B[0] - A[0]) * (C[2] - A[2])
    nz = (B[0] - A[0]) * (C[1] - A[1]) - (B[1] - A[1]) * (C[0] - A[0])
    fc = tuple((A[k] + B[k] + C[k]) / 3 - cen[k] for k in range(3))
    if nx * fc[0] + ny * fc[1] + nz * fc[2] < 0:
        mesh.tri(A, C, B)
    else:
        mesh.tri(A, B, C)


def mansard(mesh, F, u0, u1, v0, v1, y0, h, inset):
    """Sloped tile skirt around a flat roof (the Palm Beach red-tile cap)."""
    o = [F.p(u0, v0, y0), F.p(u1, v0, y0), F.p(u1, v1, y0), F.p(u0, v1, y0)]
    i = [F.p(u0 + inset, v0 + inset, y0 + h), F.p(u1 - inset, v0 + inset, y0 + h),
         F.p(u1 - inset, v1 - inset, y0 + h), F.p(u0 + inset, v1 - inset, y0 + h)]
    cen = F.p((u0 + u1) / 2, (v0 + v1) / 2, y0 - 10)
    for k in range(4):
        _quad_out(mesh, o[k], o[(k + 1) % 4], i[(k + 1) % 4], i[k], cen)


def balcony_wing(M, F, u0, u1, hv, y0, floors, fh, bay, mats, depth=1.6, faces=(-1, 1),
                 ends=True, door_h=2.3):
    """Recessed-balcony block between u0..u1, half-depth hv, floors from y0.

    mats: dict wall, recess, slab, rail, glass, fin (material names).
    Returns the roof height.
    """
    top = y0 + floors * fh
    iv = hv - depth
    nb = max(1, int(round((u1 - u0) / bay)))
    b = (u1 - u0) / nb
    for lod in (0, 1):
        m = lambda k: M.mesh(lod, mats[k])
        if lod == 1:
            obox(m("wall"), F, u0, u1, -hv, hv, y0, top)
            for f in range(floors):
                yy = y0 + f * fh + 0.9
                for s in faces:
                    vquad(m("recess"), F, u0 + 0.3, u1 - 0.3, s * (hv + 0.04), yy + 0.2, yy + 1.4, s)
                    vquad(m("slab"), F, u0, u1, s * (hv + 0.06), yy - 0.9, yy - 0.6, s)
            continue
        vin = [-hv if -1 not in faces else -iv, hv if 1 not in faces else iv]
        obox(m("recess"), F, u0, u1, vin[0], vin[1], y0, top)
        if ends:
            for uu in (u0, u1):
                for s in faces:
                    v0_, v1_ = sorted((s * iv, s * hv))
                    obox(m("wall"), F, uu - 0.25, uu + 0.25, v0_, v1_, y0, top)
        for f in range(floors + 1):
            yy = y0 + f * fh
            for s in faces:
                v0_, v1_ = sorted((s * iv, s * (hv + 0.08)))
                obox(m("slab"), F, u0, u1, v0_, v1_, yy - 0.14, yy + 0.18, bottom=True)
        for f in range(floors):
            yy = y0 + f * fh
            for s in faces:
                vquad(m("rail"), F, u0, u1, s * (hv - 0.05), yy + 0.18, yy + 1.05, s)
                for k in range(nb):
                    a = u0 + k * b + 0.4
                    vquad(m("glass"), F, a, a + b - 0.8, s * (iv + 0.02), yy + 0.25, yy + door_h, s)
        for k in range(1, nb):
            uu = u0 + k * b
            for s in faces:
                v0_, v1_ = sorted((s * iv, s * hv))
                obox(m("fin"), F, uu - 0.14, uu + 0.14, v0_, v1_, y0, top, top=False)
    return top


def text_png(lines, w, h, bg, fg, font=FONT_SANS, pad=16):
    im = Image.new("RGBA", (w, h), bg)
    dr = ImageDraw.Draw(im)
    n = len(lines)
    lh = (h - 2 * pad) / n
    for k, t in enumerate(lines):
        size = int(lh * 0.9)
        f = ImageFont.truetype(font, size)
        while f.getlength(t) > w - 2 * pad and size > 10:
            size -= 2
            f = ImageFont.truetype(font, size)
        tw = f.getlength(t)
        dr.text(((w - tw) / 2, pad + k * lh + (lh - size) / 2 - size * 0.1), t, font=f, fill=fg)
    return im


def png_bytes(im):
    b = io.BytesIO()
    im.save(b, "PNG", optimize=True)
    return b.getvalue()
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


