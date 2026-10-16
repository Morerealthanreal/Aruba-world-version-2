#!/usr/bin/env python3
"""Eagle Beach / Manchebo / Druif low-rise strip.

Rebuilds resort heroes on their OSM footprints (colours, roofs, gables, signs)
and adds instanced fofoti, palapas and umbrellas beside the heroes already on
main. Existing models stay: their roofs, colours and signs are not replaced,
and the Fofoti Trees & Palapas set is not removed. Kits also drape the boulevard
sidewalk, beach-access paths and roadside parking.

Photos and aerials are reference only. Geometry and textures are drawn here.
Scope is the coast from just north of Oranjestad to just south of the Palm
Beach high-rise strip. Nothing north of lat 12.561 is touched.
"""
import json, math, os, struct, sys, zlib
from collections import defaultdict
from PIL import Image, ImageDraw, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAME = os.path.join(ROOT, "game")
MANIFEST = os.path.join(GAME, "data/hero/manifest.json")
HERO = os.path.join(GAME, "models/hero")

ZG, BG = 12.52, -69.97
XG = 111320 * math.cos(math.radians(ZG))
ZG_M = 110540
X0, Z0, RS = -10800.0, -11800.0, 1000.0

# Just south of Divi Phoenix / the high-rise strip, down to Oranjestad's edge.
LAT_N, LAT_S = 12.561, 12.528
LON_W, LON_E = -70.072, -70.045

FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
AERIAL = "/tmp/eagle/aerial"
OSM = "/tmp/eagle/osm.json"

def xz(lat, lon):
    return (lon - BG) * XG, -(lat - ZG) * ZG_M

def ll(x, z):
    return ZG - z / ZG_M, BG + x / XG

def hypot(x, z):
    return math.hypot(x, z)

def in_strip(x, z):
    lat, lon = ll(x, z)
    return LAT_S <= lat <= LAT_N and LON_W <= lon <= LON_E

# ---------------------------------------------------------------- height
_hcache = {}
def height_at(x, z):
    rx = int((x - X0) // RS); rz = int((z - Z0) // RS)
    im = _hcache.get((rx, rz))
    if im is False:
        return 0.0
    if im is None:
        p = os.path.join(GAME, f"data/real/h_{rx}_{rz}.png")
        if not os.path.exists(p):
            _hcache[(rx, rz)] = False
            return 0.0
        im = Image.open(p).convert("RGB")
        _hcache[(rx, rz)] = im
    lx = x - (X0 + rx * RS); lz = z - (Z0 + rz * RS)
    px = max(0, min(im.size[0] - 1, int(round(lx / 4.0))))
    py = max(0, min(im.size[1] - 1, int(round(lz / 4.0))))
    r, g, b = im.getpixel((px, py))
    return (r * 256 + g) / 100.0 - 50.0

# ---------------------------------------------------------------- aerial colour
_bands = None
def bands():
    global _bands
    if _bands is None:
        _bands = []
        for i, (a, b) in enumerate([(12.528, 12.540), (12.540, 12.552), (12.552, 12.563)]):
            im = Image.open(f"{AERIAL}/band_{i}.jpg").convert("RGB")
            _bands.append((a, b, im))
    return _bands

def aerial_rgb(x, z):
    lat, lon = ll(x, z)
    for a, b, im in bands():
        if a <= lat <= b:
            w, h = im.size
            px = int((lon - (-70.068)) / ((-70.049) - (-70.068)) * (w - 1))
            py = int((b - lat) / (b - a) * (h - 1))
            if px < 0 or py < 0 or px >= w or py >= h:
                return None
            return im.getpixel((px, py))
    return None

def is_tree_px(rgb):
    if not rgb:
        return False
    r, g, b = rgb
    return g > r + 12 and g > b + 5 and 70 < g < 210 and r > 40

def is_thatch_px(rgb):
    if not rgb:
        return False
    r, g, b = rgb
    return r > 130 and r > g + 8 and g > b and r < 210 and g < 180 and b < 150

# ---------------------------------------------------------------- png
def png_bytes(im):
    im = im.convert("RGBA")
    raw = b"".join(b"\x00" + im.crop((0, y, im.width, y + 1)).tobytes() for y in range(im.height))
    comp = zlib.compress(raw, 9)
    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff)
    ihdr = struct.pack(">IIBBBBB", im.width, im.height, 8, 6, 0, 0, 0)
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", ihdr) + chunk(b"IDAT", comp) + chunk(b"IEND", b"")

def facade_png(wall, arch=False):
    # Power-of-two. A 64x96 image with mipmaps and repeat wrap is an
    # incomplete texture on WebGL1 and has taken the context down.
    W, H = 64, 128
    im = Image.new("RGBA", (W, H), wall + (255,))
    d = ImageDraw.Draw(im)
    # one storey tile: white frame, dark glass. Ground tile gets an arch when asked.
    def window(y0, arched):
        x0, x1, yy0, yy1 = 14, 50, y0 + 16, y0 + 78
        d.rectangle([x0 - 3, yy0 - 3, x1 + 3, yy1 + 3], fill=(248, 246, 240, 255))
        if arched:
            d.rectangle([x0, yy0 + 18, x1, yy1], fill=(62, 84, 102, 255))
            d.pieslice([x0, yy0, x1, yy0 + 40], 180, 360, fill=(62, 84, 102, 255))
            d.arc([x0 - 3, yy0 - 2, x1 + 3, yy0 + 42], 180, 360, fill=(248, 246, 240, 255), width=3)
        else:
            d.rectangle([x0, yy0, x1, yy1], fill=(74, 98, 118, 255))
            d.line([(W // 2, yy0), (W // 2, yy1)], fill=(248, 246, 240, 255), width=2)
            d.line([(x0, (yy0 + yy1) // 2), (x1, (yy0 + yy1) // 2)], fill=(248, 246, 240, 255), width=2)
    # texture is repeated per floor; arch variant is a separate image used on the ground storey
    window(0, arch)
    return png_bytes(im)

def thatch_png():
    im = Image.new("RGBA", (64, 64), (176, 142, 86, 255))
    d = ImageDraw.Draw(im)
    rng = 17
    for i in range(42):
        rng = (rng * 1103515245 + 12345) & 0x7fffffff
        x = (rng % 64)
        tone = 120 + (rng // 64) % 70
        d.line([(x, 0), (x + ((rng >> 3) % 7) - 3, 64)], fill=(tone, int(tone * 0.78), int(tone * 0.48), 255), width=2)
    return png_bytes(im)

def sign_png(text, bg, fg):
    im = Image.new("RGBA", (512, 128), bg + (255,))
    d = ImageDraw.Draw(im)
    d.rectangle([6, 6, 505, 121], outline=fg + (255,), width=6)
    size = 68
    while size > 22:
        font = ImageFont.truetype(FONT, size)
        w = d.textlength(text, font=font)
        if w < 470:
            break
        size -= 4
    d.text((256, 64), text, fill=fg + (255,), font=font, anchor="mm")
    return png_bytes(im)

def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))

# ---------------------------------------------------------------- glb
class G:
    def __init__(self):
        self.buf = bytearray()
        self.views = []
        self.acc = []
        self.meshes = []
        self.nodes = []
        self.mats = []
        self.images = []
        self.textures = []
        self._mat = {}
        self._img = {}

    def _align(self):
        while len(self.buf) % 4:
            self.buf.append(0)

    def blob(self, data, target=None):
        self._align()
        off = len(self.buf)
        self.buf.extend(data)
        v = {"buffer": 0, "byteOffset": off, "byteLength": len(data)}
        if target:
            v["target"] = target
        self.views.append(v)
        return len(self.views) - 1

    def f32(self, vals, count, ctype_size, typ, mn=None, mx=None):
        raw = struct.pack("<" + "f" * (len(vals)), *vals)
        vi = self.blob(raw, 34962)
        a = {"bufferView": vi, "componentType": 5126, "count": count, "type": typ}
        if mn is not None:
            a["min"] = mn
            a["max"] = mx
        self.acc.append(a)
        return len(self.acc) - 1

    def indices(self, idx):
        if max(idx) < 65535:
            raw = struct.pack("<" + "H" * len(idx), *idx)
            ct = 5123
        else:
            raw = struct.pack("<" + "I" * len(idx), *idx)
            ct = 5125
        vi = self.blob(raw, 34963)
        self.acc.append({"bufferView": vi, "componentType": ct, "count": len(idx), "type": "SCALAR"})
        return len(self.acc) - 1

    def color_mat(self, name, rgb, rough=0.82):
        key = ("c", name, rgb)
        if key in self._mat:
            return self._mat[key]
        self.mats.append({
            "name": name,
            "doubleSided": True,
            "pbrMetallicRoughness": {
                "baseColorFactor": [rgb[0] / 255, rgb[1] / 255, rgb[2] / 255, 1],
                "roughnessFactor": rough, "metallicFactor": 0,
            },
        })
        self._mat[key] = len(self.mats) - 1
        return self._mat[key]

    def tex_mat(self, name, png, repeat=True, emissive=0.0):
        key = ("t", name)
        if key in self._mat:
            return self._mat[key]
        if name not in self._img:
            vi = self.blob(png)
            self.images.append({"bufferView": vi, "mimeType": "image/png"})
            self.textures.append({"sampler": 0 if repeat else 1, "source": len(self.images) - 1})
            self._img[name] = len(self.textures) - 1
        ti = self._img[name]
        m = {"name": name, "doubleSided": True, "pbrMetallicRoughness": {
            "baseColorTexture": {"index": ti}, "roughnessFactor": 0.78, "metallicFactor": 0}}
        if emissive:
            m["emissiveTexture"] = {"index": ti}
            m["emissiveFactor"] = [emissive, emissive, emissive]
        self.mats.append(m)
        self._mat[key] = len(self.mats) - 1
        return self._mat[key]

    def add_mesh(self, name, prims):
        """prims: list of (positions xyz, normals xyz, uvs, indices, material)"""
        gl_prims = []
        for pos, nrm, uv, idx, mat in prims:
            if len(idx) < 3:
                continue
            nv = len(pos) // 3
            xs, ys, zs = pos[0::3], pos[1::3], pos[2::3]
            # A zero normal becomes NaN in the standard material and the high
            # bloom/GTAO chain clears the whole view.
            fixed = list(nrm)
            for k in range(0, len(fixed), 3):
                nx, ny, nz = fixed[k], fixed[k + 1], fixed[k + 2]
                if nx * nx + ny * ny + nz * nz < 1e-8:
                    fixed[k], fixed[k + 1], fixed[k + 2] = 0.0, 1.0, 0.0
            pa = self.f32(pos, nv, 4, "VEC3", [min(xs), min(ys), min(zs)], [max(xs), max(ys), max(zs)])
            na = self.f32(fixed, nv, 4, "VEC3")
            ua = self.f32(uv, nv, 4, "VEC2")
            ia = self.indices(idx)
            gl_prims.append({"attributes": {"POSITION": pa, "NORMAL": na, "TEXCOORD_0": ua}, "indices": ia, "material": mat})
        self.meshes.append({"name": name, "primitives": gl_prims or [{"attributes": {}, "material": 0}]})
        return len(self.meshes) - 1

    def add_inst(self, mesh, translations, rotations, scales):
        n = len(translations) // 3
        ta = self.f32(translations, n, 4, "VEC3",
                      [min(translations[0::3]), min(translations[1::3]), min(translations[2::3])],
                      [max(translations[0::3]), max(translations[1::3]), max(translations[2::3])])
        ra = self.f32(rotations, n, 4, "VEC4")
        sa = self.f32(scales, n, 4, "VEC3")
        node = {"mesh": mesh, "extensions": {"EXT_mesh_gpu_instancing": {"attributes": {
            "TRANSLATION": ta, "ROTATION": ra, "SCALE": sa}}}}
        self.nodes.append(node)
        return len(self.nodes) - 1

    def pack(self, scene_nodes):
        self._align()
        samplers = [
            {"magFilter": 9729, "minFilter": 9987, "wrapS": 10497, "wrapT": 10497},
            {"magFilter": 9729, "minFilter": 9987, "wrapS": 33071, "wrapT": 33071},
        ]
        js = {
            "asset": {"version": "2.0", "generator": "eagle_strip.py"},
            "extensionsUsed": ["EXT_mesh_gpu_instancing"],
            "scene": 0,
            "scenes": [{"nodes": scene_nodes}],
            "nodes": self.nodes,
            "meshes": self.meshes,
            "materials": self.mats,
            "buffers": [{"byteLength": len(self.buf)}],
            "bufferViews": self.views,
            "accessors": self.acc,
        }
        if self.images:
            js["images"] = self.images
            js["textures"] = self.textures
            js["samplers"] = samplers
        if any("extensions" in n for n in self.nodes):
            js["extensionsRequired"] = ["EXT_mesh_gpu_instancing"]
        else:
            js.pop("extensionsUsed")
        payload = json.dumps(js, separators=(",", ":")).encode()
        while len(payload) % 4:
            payload += b" "
        bin_ = bytes(self.buf)
        while len(bin_) % 4:
            bin_ += b"\x00"
        out = bytearray()
        out += b"glTF" + struct.pack("<II", 2, 12 + 8 + len(payload) + 8 + len(bin_))
        out += struct.pack("<I", len(payload)) + b"JSON" + payload
        out += struct.pack("<I", len(bin_)) + b"BIN\x00" + bin_
        return bytes(out)

# ---------------------------------------------------------------- mesh helpers
class M:
    def __init__(self):
        self.p, self.n, self.u, self.i = [], [], [], []
    def v(self, x, y, z, nx, ny, nz, u, v):
        self.p += [x, y, z]; self.n += [nx, ny, nz]; self.u += [u, v]
        return len(self.p) // 3 - 1
    def tri(self, a, b, c):
        self.i += [a, b, c]
    def quad(self, a, b, c, d):
        self.tri(a, b, c); self.tri(a, c, d)
    def empty(self):
        return len(self.i) < 3

def ensure_ccw(poly):
    a = 0
    for i in range(len(poly)):
        x1, z1 = poly[i]; x2, z2 = poly[(i + 1) % len(poly)]
        a += x1 * z2 - x2 * z1
    return poly if a > 0 else list(reversed(poly))

def area(poly):
    a = 0
    for i in range(len(poly)):
        x1, z1 = poly[i]; x2, z2 = poly[(i + 1) % len(poly)]
        a += x1 * z2 - x2 * z1
    return abs(a) * 0.5

def centroid(poly):
    return sum(p[0] for p in poly) / len(poly), sum(p[1] for p in poly) / len(poly)

def pip(x, z, poly):
    c = False
    j = len(poly) - 1
    for i in range(len(poly)):
        xi, zi = poly[i]; xj, zj = poly[j]
        if ((zi > z) != (zj > z)) and (x < (xj - xi) * (z - zi) / ((zj - zi) or 1e-9) + xi):
            c = not c
        j = i
    return c

def wall(mesh, poly, y0, y1, us=3.3):
    n = len(poly)
    for i in range(n):
        x1, z1 = poly[i]; x2, z2 = poly[(i + 1) % n]
        dx, dz = x2 - x1, z2 - z1
        L = hypot(dx, dz)
        # A repeated footprint vertex has no direction. normalize(0) is NaN
        # and the high-quality bloom pass turns that into a black frame.
        if L < 0.05:
            continue
        nx, nz = dz / L, -dx / L
        a = mesh.v(x1, y0, z1, nx, 0, nz, 0, y0 / us)
        b = mesh.v(x2, y0, z2, nx, 0, nz, L / us, y0 / us)
        c = mesh.v(x2, y1, z2, nx, 0, nz, L / us, y1 / us)
        d = mesh.v(x1, y1, z1, nx, 0, nz, 0, y1 / us)
        mesh.quad(a, b, c, d)

def flat_roof(mesh, poly, y):
    cx, cz = centroid(poly)
    c = mesh.v(cx, y, cz, 0, 1, 0, 0.5, 0.5)
    for i in range(len(poly)):
        x1, z1 = poly[i]; x2, z2 = poly[(i + 1) % len(poly)]
        a = mesh.v(x1, y, z1, 0, 1, 0, 0, 0)
        b = mesh.v(x2, y, z2, 0, 1, 0, 1, 0)
        mesh.tri(c, a, b)

def gable_roof(mesh, poly, y, rise):
    """Quad gable. Returns the two peak points (xyz) of the short ends, or None."""
    if len(poly) != 4:
        flat_roof(mesh, poly, y + rise * 0.5)
        return None
    lens = []
    for i in range(4):
        x1, z1 = poly[i]; x2, z2 = poly[(i + 1) % 4]
        lens.append((hypot(x2 - x1, z2 - z1), i))
    li = max(lens)[1]
    p = poly
    # short-edge midpoints are the gable peaks (plan)
    i0 = (li + 3) % 4  # edge into p[li]
    # edges: li is long. short edges are li+1 and li+3
    s1a, s1b = p[(li + 1) % 4], p[(li + 2) % 4]
    s2a, s2b = p[(li + 3) % 4], p[li]
    # wait, if li is the long edge p[li] -> p[li+1], the short edges are
    # p[li+1]->p[li+2] and p[li+3]->p[li]
    a, b = p[li], p[(li + 1) % 4]          # one long eave
    c, d = p[(li + 2) % 4], p[(li + 3) % 4]  # opposite long eave, same winding
    # opposite edge direction may be reversed relative to a->b. For a ccw quad
    # opposite edge p[li+2]->p[li+3] runs against a->b. Midpoints:
    m1 = ((a[0] + d[0]) / 2, (a[1] + d[1]) / 2)  # short side at a/d ? 
    # vertices in order around: a=p[li], b=p[li+1], c=p[li+2], d=p[li+3]
    # short sides: b-c and d-a
    m_bc = ((b[0] + c[0]) / 2, (b[1] + c[1]) / 2)
    m_da = ((d[0] + a[0]) / 2, (d[1] + a[1]) / 2)
    r1 = (m_da[0], y + rise, m_da[1])
    r2 = (m_bc[0], y + rise, m_bc[1])
    def slope(p, q, r, s):
        # quad p,q,s,r with ridge r->s? we pass eave p->q and ridge end near q then near p
        ux, uz = q[0] - p[0], q[1] - p[1]
        vx, vz = r[0] - p[0], r[2] - p[1]
        nx, ny, nz = uy_cross(ux, 0, uz, vx, r[1] - y, vz)
        A = mesh.v(p[0], y, p[1], nx, ny, nz, 0, 0)
        B = mesh.v(q[0], y, q[1], nx, ny, nz, 1, 0)
        C = mesh.v(s[0], s[1], s[2], nx, ny, nz, 1, 1)
        D = mesh.v(r[0], r[1], r[2], nx, ny, nz, 0, 1)
        mesh.quad(A, B, C, D)
    # slope over long eave a->b rising to ridge r1 (near a) and r2 (near b)
    slope(a, b, r1, r2)
    # opposite eave c->d. For ccw, c->d is the opposite long side going back.
    # ridge near c is r2 (m_bc is mid b,c so closer to c), near d is r1.
    slope(c, d, r2, r1)
    return r1, r2, a, b, c, d

def uy_cross(ax, ay, az, bx, by, bz):
    nx, ny, nz = ay * bz - az * by, az * bx - ax * bz, ax * by - ay * bx
    L = math.sqrt(nx * nx + ny * ny + nz * nz)
    if L < 1e-8:
        return 0.0, 1.0, 0.0
    # prefer upward
    if ny < 0:
        nx, ny, nz = -nx, -ny, -nz
    return nx / L, ny / L, nz / L

def gable_face(mesh, e1, e2, peak, outset=0.12):
    """Vertical triangle on a short end, pushed slightly outward, plus two step ledges."""
    mx, mz = (e1[0] + e2[0]) / 2, (e1[1] + e2[1]) / 2
    dx, dz = e2[0] - e1[0], e2[1] - e1[1]
    L = hypot(dx, dz) or 1
    # outward-ish: perpendicular, pick the one away from peak's plan (peak is inset)
    px, pz = -dz / L, dx / L
    # peak plan is midpoint, so both perps are along the edge. Outward is away from building
    # centre, which we approximate as the direction from peak-xy toward the midpoint? peak is above midpoint.
    # Use a fixed outset along the edge normal that points away from the other gable (from e1/e2 mid toward outside).
    # Caller passes peak; the roof ridge goes inward from this end, so outward is from the other end toward this mid.
    ox, oz = px * outset, pz * outset
    y0 = min(e1[2], e2[2]) if False else None
    # e1, e2 are xz at eave; peak is xyz
    def tri(ybase):
        a = mesh.v(e1[0] + ox, ybase, e1[1] + oz, px, 0, pz, 0, 0)
        b = mesh.v(e2[0] + ox, ybase, e2[1] + oz, px, 0, pz, 1, 0)
        c = mesh.v(peak[0] + ox, peak[1], peak[2] + oz, px, 0, pz, 0.5, 1)
        mesh.tri(a, b, c)
    tri(peak[1] - (peak[1] - 0) * 0 + 0)  # placeholder replaced below

def add_gable_trim(mesh, e1, e2, peak, y_eave):
    # The ridge sits on the midpoint of this short end, so peak.xz - midpoint is
    # zero and the old normal was (0,0,0). Push the face out along the edge
    # perpendicular, away from the footprint centroid (local origin).
    dx, dz = e2[0] - e1[0], e2[1] - e1[1]
    L = hypot(dx, dz) or 1
    nx, nz = -dz / L, dx / L
    mx = (e1[0] + e2[0]) / 2
    mz = (e1[1] + e2[1]) / 2
    if nx * mx + nz * mz < 0:
        nx, nz = -nx, -nz
    ox, oz = nx * 0.18, nz * 0.18
    a = mesh.v(e1[0] + ox, y_eave, e1[1] + oz, nx, 0, nz, 0, 0)
    b = mesh.v(e2[0] + ox, y_eave, e2[1] + oz, nx, 0, nz, 1, 0)
    c = mesh.v(peak[0] + ox, peak[1], peak[2] + oz, nx, 0, nz, 0.5, 1)
    mesh.tri(a, b, c)
    # three white steps, widest at the eave
    span_x = e2[0] - e1[0]; span_z = e2[1] - e1[1]
    for s in range(3):
        t = 0.22 + s * 0.22
        y = y_eave + (peak[1] - y_eave) * t
        half = (1 - t) * 0.5
        cx = e1[0] + span_x * 0.5; cz = e1[1] + span_z * 0.5
        x1 = cx - span_x * half; z1 = cz - span_z * half
        x2 = cx + span_x * half; z2 = cz + span_z * half
        # ledge 0.28m out, 0.18m tall
        for k in range(2):
            yy = y + k * 0.16
            inset = 0.05 + k * 0.02
            aa = mesh.v(x1 + ox, yy, z1 + oz, nx, 0, nz, 0, 0)
            bb = mesh.v(x2 + ox, yy, z2 + oz, nx, 0, nz, 1, 0)
            cc = mesh.v(x2 + ox * (1 + inset), yy + 0.02, z2 + oz * (1 + inset), nx, 0.2, nz, 1, 1)
            dd = mesh.v(x1 + ox * (1 + inset), yy + 0.02, z1 + oz * (1 + inset), nx, 0.2, nz, 0, 1)
            mesh.quad(aa, bb, cc, dd)

def box(mesh, x0, y0, z0, x1, y1, z1):
    # 6 faces
    pts = [
        (x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0),
        (x0, y0, z1), (x1, y0, z1), (x1, y1, z1), (x0, y1, z1),
    ]
    faces = [
        (0, 1, 2, 3, (0, 0, -1)),
        (5, 4, 7, 6, (0, 0, 1)),
        (4, 0, 3, 7, (-1, 0, 0)),
        (1, 5, 6, 2, (1, 0, 0)),
        (3, 2, 6, 7, (0, 1, 0)),
        (4, 5, 1, 0, (0, -1, 0)),
    ]
    ids = [mesh.v(*p, 0, 1, 0, 0, 0) for p in pts]
    for a, b, c, d, nm in faces:
        # rewrite normals by duplicating
        pass
    # duplicate per face for correct normals
    mesh.i = mesh.i  # keep
    # redo properly
    # remove the verts we just added? easier to not use ids. I'll just add faces fresh.
    # The verts above are unused if I don't index them. Wasteful but tiny. Skip by not doing that.
    return

def solid_box(mesh, x0, y0, z0, x1, y1, z1):
    faces = [
        ((x0, y0, z0), (x1, y0, z0), (x1, y1, z0), (x0, y1, z0), (0, 0, -1)),
        ((x1, y0, z1), (x0, y0, z1), (x0, y1, z1), (x1, y1, z1), (0, 0, 1)),
        ((x0, y0, z1), (x0, y0, z0), (x0, y1, z0), (x0, y1, z1), (-1, 0, 0)),
        ((x1, y0, z0), (x1, y0, z1), (x1, y1, z1), (x1, y1, z0), (1, 0, 0)),
        ((x0, y1, z0), (x1, y1, z0), (x1, y1, z1), (x0, y1, z1), (0, 1, 0)),
        ((x0, y0, z1), (x1, y0, z1), (x1, y0, z0), (x0, y0, z0), (0, -1, 0)),
    ]
    for a, b, c, d, nm in faces:
        ia = mesh.v(*a, *nm, 0, 0)
        ib = mesh.v(*b, *nm, 1, 0)
        ic = mesh.v(*c, *nm, 1, 1)
        id_ = mesh.v(*d, *nm, 0, 1)
        mesh.quad(ia, ib, ic, id_)

def cone(mesh, y0, y1, r, sides=10, droop=0.35):
    top = mesh.v(0, y1, 0, 0, 1, 0, 0.5, 1)
    ring = []
    for i in range(sides):
        a = i / sides * math.tau
        x, z = math.cos(a) * r, math.sin(a) * r
        ring.append(mesh.v(x, y0, z, x, 0.35, z, i / sides, 0))
    for i in range(sides):
        mesh.tri(top, ring[i], ring[(i + 1) % sides])
    # ragged fringe hanging past the rim
    fringe = []
    for i in range(sides):
        a = (i + 0.5) / sides * math.tau
        x, z = math.cos(a) * (r + 0.18), math.sin(a) * (r + 0.18)
        fringe.append(mesh.v(x, y0 - droop, z, x, -0.2, z, i / sides, 0))
    for i in range(sides):
        mesh.tri(ring[i], fringe[i], ring[(i + 1) % sides])
        mesh.tri(fringe[i], fringe[(i + 1) % sides], ring[(i + 1) % sides])

def pole(mesh, h, r=0.07, sides=6):
    ring0, ring1 = [], []
    for i in range(sides):
        a = i / sides * math.tau
        x, z = math.cos(a) * r, math.sin(a) * r
        ring0.append(mesh.v(x, 0, z, x, 0, z, 0, 0))
        ring1.append(mesh.v(x, h, z, x, 0, z, 0, 1))
    for i in range(sides):
        j = (i + 1) % sides
        mesh.quad(ring0[i], ring0[j], ring1[j], ring1[i])

def tube(mesh, path, r0, r1, sides=6):
    """path: list of (x,y,z)."""
    rings = []
    for i, (x, y, z) in enumerate(path):
        if i == 0:
            dx = path[1][0] - x; dy = path[1][1] - y; dz = path[1][2] - z
        elif i == len(path) - 1:
            dx = x - path[i - 1][0]; dy = y - path[i - 1][1]; dz = z - path[i - 1][2]
        else:
            dx = path[i + 1][0] - path[i - 1][0]
            dy = path[i + 1][1] - path[i - 1][1]
            dz = path[i + 1][2] - path[i - 1][2]
        L = math.sqrt(dx * dx + dy * dy + dz * dz) or 1
        dx, dy, dz = dx / L, dy / L, dz / L
        # side vector
        sx, sy, sz = 0, 1, 0
        if abs(dy) > 0.9:
            sx, sy, sz = 1, 0, 0
        rx, ry, rz = sy * dz - sz * dy, sz * dx - sx * dz, sx * dy - sy * dx
        L2 = math.sqrt(rx * rx + ry * ry + rz * rz) or 1
        rx, ry, rz = rx / L2, ry / L2, rz / L2
        ux, uy, uz = dy * rz - dz * ry, dz * rx - dx * rz, dx * ry - dy * rx
        t = i / (len(path) - 1)
        rad = r0 + (r1 - r0) * t
        ring = []
        for k in range(sides):
            a = k / sides * math.tau
            ca, sa = math.cos(a), math.sin(a)
            px = x + (rx * ca + ux * sa) * rad
            py = y + (ry * ca + uy * sa) * rad
            pz = z + (rz * ca + uz * sa) * rad
            ring.append(mesh.v(px, py, pz, rx * ca + ux * sa, ry * ca + uy * sa, rz * ca + uz * sa, k / sides, t))
        rings.append(ring)
    for i in range(len(rings) - 1):
        for k in range(sides):
            j = (k + 1) % sides
            mesh.quad(rings[i][k], rings[i][j], rings[i + 1][j], rings[i + 1][k])

def ico(mesh, cx, cy, cz, rx, ry, rz):
    t = (1 + math.sqrt(5)) / 2
    verts = [(-1, t, 0), (1, t, 0), (-1, -t, 0), (1, -t, 0),
             (0, -1, t), (0, 1, t), (0, -1, -t), (0, 1, -t),
             (t, 0, -1), (t, 0, 1), (-t, 0, -1), (-t, 0, 1)]
    faces = [(0, 11, 5), (0, 5, 1), (0, 1, 7), (0, 7, 10), (0, 10, 11),
             (1, 5, 9), (5, 11, 4), (11, 10, 2), (10, 7, 6), (7, 1, 8),
             (3, 9, 4), (3, 4, 2), (3, 2, 6), (3, 6, 8), (3, 8, 9),
             (4, 9, 5), (2, 4, 11), (6, 2, 10), (8, 6, 7), (9, 8, 1)]
    ids = []
    for x, y, z in verts:
        L = math.sqrt(x * x + y * y + z * z)
        ids.append(mesh.v(cx + x / L * rx, cy + y / L * ry, cz + z / L * rz, x / L, y / L, z / L, 0, 0))
    for a, b, c in faces:
        mesh.tri(ids[a], ids[b], ids[c])

def yaw_quat(yaw):
    h = yaw * 0.5
    return (0, math.sin(h), 0, math.cos(h))

# ---------------------------------------------------------------- prototypes
def build_tree(lod):
    """Divi-divi: twisted grey trunk, canopy streamed horizontally downwind (west, -X)."""
    bark, leaf = M(), M()
    if lod == 0:
        path = [(0.0, 0.02, 0.0), (0.12, 0.45, 0.22), (-0.05, 0.95, -0.18),
                (-0.55, 1.45, 0.12), (-1.35, 1.85, -0.08), (-2.15, 2.05, 0.05),
                (-2.85, 2.12, -0.04)]
        tube(bark, path, 0.26, 0.06, 7)
        for ang, lean in ((0.2, 0.85), (2.0, 0.95), (3.6, 0.7), (5.1, 0.55)):
            tube(bark, [(0, 0.2, 0), (math.cos(ang) * lean, 0.0, math.sin(ang) * 0.55)], 0.11, 0.035, 4)
        clumps = [(-1.2, 2.15, 0.15, 0.95, 0.32, 0.72),
                  (-2.05, 2.22, 0.05, 1.15, 0.30, 0.85),
                  (-2.85, 2.05, -0.2, 0.85, 0.24, 0.62),
                  (-1.65, 2.35, -0.45, 0.62, 0.22, 0.5),
                  (-3.25, 1.95, 0.25, 0.48, 0.18, 0.38)]
        for c in clumps:
            ico(leaf, *c)
    else:
        path = [(0, 0.1, 0), (-0.9, 1.4, 0), (-2.0, 1.95, 0)]
        tube(bark, path, 0.2, 0.08, 4)
        ico(leaf, -1.9, 2.05, 0, 1.2, 0.32, 0.75)
    return bark, leaf

def build_palapa(lod):
    wood, thatch = M(), M()
    sides = 8 if lod == 0 else 5
    pole(wood, 2.15, 0.075, 5 if lod == 0 else 4)
    cone(thatch, 2.05, 2.72, 1.65 if lod == 0 else 1.5, sides, 0.42 if lod == 0 else 0.2)
    return wood, thatch

def build_brolly(lod):
    pole_m, cloth = M(), M()
    sides = 8 if lod == 0 else 5
    pole(pole_m, 2.05, 0.035, 4)
    # smooth fabric canopy, no fringe: a cone only
    top = cloth.v(0, 2.35, 0, 0, 1, 0, 0.5, 1)
    ring = []
    r = 1.15
    y = 2.05
    for i in range(sides):
        a = i / sides * math.tau
        x, z = math.cos(a) * r, math.sin(a) * r
        ring.append(cloth.v(x, y, z, x, 0.4, z, 0, 0))
    for i in range(sides):
        cloth.tri(top, ring[i], ring[(i + 1) % sides])
    return pole_m, cloth

# ---------------------------------------------------------------- resorts
# wall, trim, roof are RGB tuples. dutch gables on quads. flat roofs when complex.
RESORTS = [
    # anchor xyz is the EXISTING hero origin so the rebuilt GLB stays put
    dict(id="amsterdam", name="Amsterdam Manor Beach Resort", sign="AMSTERDAM MANOR",
         bg="#14213d", fg="#f4d56a", wall=(224, 176, 58), trim=(246, 243, 234), roof=(168, 64, 42),
         dutch=True, arch=False, anchor=(-9180.2, -3847.9), radius=110,
         keys=("amsterdam",), flat_big=False),
    dict(id="m_lacabana", name="La Cabana Beach Resort & Casino", sign="LA CABANA",
         bg="#6e1d32", fg="#f6e27a", wall=(244, 240, 232), trim=(255, 255, 255), roof=(196, 83, 45),
         dutch=False, arch=True, anchor=(-9138.2, -3480.4), radius=70,
         keys=("la cabana", "cabana"), flat_big=False, skip_ids={3318}),
    dict(id="lacabana_ring", name="La Cabana Beach Resort – courtyard wing", sign="LA CABANA",
         bg="#6e1d32", fg="#f6e27a", wall=(236, 236, 232), trim=(255, 255, 255), roof=(232, 230, 224),
         dutch=False, arch=True, anchor=(-9163.5, -3537.5), radius=40,
         keys=(), flat_big=True, only_ids={3318}, flat=True),
    # Kept from main: white facade, red tile roof and the resort sign.
    # Rebuilding it on the footprint replaced that model with a plain block.
    dict(id="eagleres", name="Eagle Aruba Resort & Casino", sign="EAGLE ARUBA",
         bg="#1e3a5f", fg="#ffffff", wall=(231, 208, 168), trim=(247, 243, 234), roof=(184, 90, 56),
         dutch=False, arch=False, anchor=(-9002.5, -3448.4), radius=95,
         keys=("eagle resort",), flat_big=False, keep_main=True),
    dict(id="m_bucutiandtararesort", name="Bucuti & Tara Beach Resort", sign="BUCUTI & TARA",
         bg="#2c2118", fg="#f6f1e6", wall=(243, 239, 230), trim=(255, 252, 246), roof=(166, 75, 50),
         dutch=False, arch=False, anchor=(-9955.2, -2438.7), radius=75,
         keys=("bucuti",), flat_big=False),
    dict(id="m_manchebobeachresortspa", name="Manchebo Beach Resort & Spa", sign="MANCHEBO",
         bg="#7a1f2b", fg="#ffffff", wall=(247, 245, 240), trim=(255, 255, 255), roof=(156, 59, 46),
         dutch=False, arch=False, anchor=(-10036.1, -2306.0), radius=55,
         keys=("manchebo",), flat_big=False),
    dict(id="casadelmar", name="Casa del Mar Beach Resort", sign="CASA DEL MAR",
         bg="#1d3c34", fg="#f4efe4", wall=(246, 243, 238), trim=(255, 255, 255), roof=(196, 90, 58),
         dutch=False, arch=False, anchor=(-9984.4, -2165.7), radius=80,
         keys=("casa del mar",), flat_big=True),
    dict(id="costalinda", name="Costa Linda Beach Resort", sign="COSTA LINDA",
         bg="#0e4d6e", fg="#ffffff", wall=(247, 247, 245), trim=(236, 240, 242), roof=(214, 210, 204),
         dutch=False, arch=False, anchor=(-9903.6, -2592.0), radius=90,
         keys=("costa linda",), flat=True),
    dict(id="oceania", name="Oceania Residences", sign="OCEANIA",
         bg="#245c6b", fg="#ffffff", wall=(242, 242, 240), trim=(255, 255, 255), roof=(210, 210, 206),
         dutch=False, arch=False, anchor=(-9468.9, -3107.3), radius=70,
         keys=("oceania",), flat=True),
    # Kept from main: red roof and the MVC EAGLE BEACH sign.
    dict(id="mvceagle", name="MVC Eagle Beach", sign="MVC EAGLE BEACH",
         bg="#1e3a5f", fg="#ffffff", wall=(240, 230, 212), trim=(255, 250, 242), roof=(184, 90, 56),
         dutch=False, arch=False, anchor=(-9435.8, -3202.7), radius=45,
         keys=("mcv", "mvc"), flat_big=False, keep_main=True),
    dict(id="divi", name="Divi Aruba All Inclusive", sign="DIVI ARUBA",
         bg="#0e6b6b", fg="#ffffff", wall=(243, 239, 232), trim=(255, 255, 255), roof=(196, 92, 60),
         dutch=False, arch=False, anchor=(-9355.7, -2065.7), radius=75,
         keys=("divi aruba",), flat_big=False),
    dict(id="tamarijn", name="Tamarijn Aruba All Inclusive", sign="TAMARIJN",
         bg="#0e7c86", fg="#ffffff", wall=(246, 241, 228), trim=(255, 252, 246), roof=(196, 92, 60),
         dutch=False, arch=False, anchor=(-9326.8, -1707.4), radius=70,
         keys=("tamarijn",), flat_big=False),
    dict(id="dutchvillage", name="Divi Dutch Village Beach Resort", sign="DIVI DUTCH VILLAGE",
         bg="#8c2f2f", fg="#fff6df", wall=(240, 232, 214), trim=(255, 255, 255), roof=(184, 78, 46),
         dutch=True, arch=False, anchor=(-9275.3, -1325.3), radius=80,
         keys=("dutch village", "divi dutch"), cottages=True),
    dict(id="arubabeachclub", name="Aruba Beach Club", sign="ARUBA BEACH CLUB",
         bg="#1a4e73", fg="#ffffff", wall=(245, 242, 234), trim=(255, 255, 255), roof=(70, 122, 158),
         dutch=False, arch=False, anchor=(-10046.1, -2218.1), radius=50,
         keys=("beach club",), flat_big=False),
    dict(id="chaletsuisse", name="Chalet Suisse", sign="CHALET SUISSE",
         bg="#1c3a28", fg="#ffffff", wall=(247, 247, 245), trim=(255, 255, 255), roof=(63, 107, 69),
         dutch=False, arch=False, anchor=(-9389.6, -3293.9), radius=35,
         keys=("challet", "chalet"), flat_big=False),
    # Kept from main so the restaurant keeps its sign instead of a plain box.
    dict(id="screamingeagle", name="Screaming Eagle Restaurant", sign="SCREAMING EAGLE",
         bg="#2a241c", fg="#f2e2b0", wall=(236, 232, 224), trim=(90, 70, 50), roof=(90, 62, 48),
         dutch=False, arch=False, anchor=(-9677.5, -2863.1), radius=30,
         keys=("screaming eagle",), flat_big=False, keep_main=True),
    dict(id="paradisebeach", name="Paradise Beach Villas", sign="PARADISE BEACH",
         bg="#7a2e24", fg="#fff4e0", wall=(247, 244, 239), trim=(255, 255, 255), roof=(184, 74, 50),
         dutch=False, arch=False, anchor=None, radius=40,
         keys=("paradise beach",), flat_big=False, new=True),
    dict(id="tropclub", name="Trop Club & Casino", sign="TROP CLUB",
         bg="#1e3a5f", fg="#f0d78c", wall=(232, 214, 180), trim=(255, 248, 236), roof=(176, 78, 52),
         dutch=False, arch=False, anchor=None, radius=30,
         keys=("trop club",), flat_big=False, new=True),
]

COTTAGE_COLORS = [
    (196, 64, 52), (232, 186, 64), (70, 116, 168), (232, 232, 226),
    (90, 140, 96), (206, 122, 64), (168, 86, 120),
]

def load_buildings():
    out = []
    for rx in range(0, 3):
        for rz in range(6, 12):
            fn = os.path.join(GAME, f"data/real/r_{rx}_{rz}.json")
            if not os.path.exists(fn):
                continue
            d = json.loads(open(fn).read())
            for b in d.get("b") or []:
                p = b.get("p") or []
                if len(p) < 3:
                    continue
                cx = sum(a[0] for a in p) / len(p)
                cz = sum(a[1] for a in p) / len(p)
                if not in_strip(cx, cz):
                    continue
                out.append({
                    "id": b.get("i"), "name": (b.get("n") or ""), "h": float(b.get("h") or 6),
                    "k": b.get("k") or "", "poly": [(a[0], a[1]) for a in p],
                    "cx": cx, "cz": cz, "area": area(p),
                })
    return out

def assign(buildings):
    # anchors that are None get filled from the named footprint centroid
    for r in RESORTS:
        if r["anchor"] is None:
            hits = [b for b in buildings if any(k in b["name"].lower() for k in r["keys"])]
            if hits:
                b = max(hits, key=lambda t: t["area"])
                r["anchor"] = (b["cx"], b["cz"])
            else:
                r["anchor"] = (0, 0)
                r["skip"] = True
    claimed = defaultdict(list)
    for b in buildings:
        if b["h"] > 22:
            continue
        nm = b["name"].lower()
        forced = None
        for r in RESORTS:
            if r.get("skip"):
                continue
            if b["id"] in r.get("only_ids", ()):
                forced = r
                break
            if b["id"] in r.get("skip_ids", ()):
                continue
            if r["keys"] and any(k in nm for k in r["keys"]):
                # closest named resort, so "eagle" doesn't steal screaming eagle via a loose key
                if forced is None or hypot(b["cx"] - r["anchor"][0], b["cz"] - r["anchor"][1]) < hypot(b["cx"] - forced["anchor"][0], b["cz"] - forced["anchor"][1]):
                    # prefer the more specific (longer) key match
                    if forced is None or max(len(k) for k in r["keys"] if k in nm) >= max((len(k) for k in forced["keys"] if k in nm), default=0):
                        forced = r
        if forced:
            claimed[forced["id"]].append(b)
            continue
        # Divi and Tamarijn are mapped as rows of houses, not a hotel relation.
        if b["k"] not in ("hotel", "apt", "house", "com") or b["area"] < 40:
            continue
        best, bd = None, 1e9
        for r in RESORTS:
            if r.get("skip") or r.get("only_ids"):
                continue
            d = hypot(b["cx"] - r["anchor"][0], b["cz"] - r["anchor"][1])
            if d < r["radius"] and d < bd:
                best, bd = r, d
        if best:
            claimed[best["id"]].append(b)
    return claimed

def build_resort(resort, buildings):
    ox, oz = resort["anchor"]
    if resort.get("cottages"):
        return build_cottages(resort, buildings, ox, oz)
    wall_c, trim_c, roof_c = resort["wall"], resort["trim"], resort["roof"]
    g = G()
    fac = g.tex_mat("facade", facade_png(wall_c, False), True)
    fac_g = g.tex_mat("facade_g", facade_png(wall_c, resort["arch"]), True) if resort["arch"] else fac
    trim = g.color_mat("trim", trim_c)
    roof = g.color_mat("tile", roof_c, 0.7)
    signm = g.tex_mat("sign", sign_png(resort["sign"], hex_rgb(resort["bg"]), hex_rgb(resort["fg"])), False, 0.25)
    signback = g.color_mat("signback", hex_rgb(resort["bg"]))
    hi_parts = defaultdict(M)  # mat -> mesh
    # we'll keep separate meshes per material
    parts = {fac: M(), fac_g: M(), trim: M(), roof: M(), signm: M(), signback: M()}
    lo = M()
    lo_roof = M()
    hides = []
    biggest = None
    for b in sorted(buildings, key=lambda t: -t["area"])[:28]:
        poly = ensure_ccw([(x - ox, z - oz) for x, z in b["poly"]])
        if area(poly) < 50:
            continue
        base = height_at(b["cx"], b["cz"]) - height_at(ox, oz)
        # keep low-rise storeys honest: OSM heights, but a roof needs an eave below the peak
        h = max(4.2, min(b["h"], 16.5))
        y0, y1 = base, base + h * 0.78
        rise = max(1.3, h * 0.22)
        flat = resort.get("flat") or (resort.get("flat_big") and (b["area"] > 3500 or len(poly) > 8))
        ground = y0 + min(3.3, (y1 - y0) * 0.45)
        if resort["arch"] and ground < y1 - 0.4:
            wall(parts[fac_g], poly, y0, ground)
            wall(parts[fac], poly, ground, y1)
        else:
            wall(parts[fac], poly, y0, y1)
        if flat or len(poly) != 4:
            flat_roof(parts[roof], poly, y1 + 0.25)
            # low parapet
            wall(parts[trim], poly, y1, y1 + 0.7)
        else:
            peaks = gable_roof(parts[roof], poly, y1, rise if not resort["dutch"] else rise * 1.15)
            if peaks and resort["dutch"]:
                r1, r2, e1, e2, e3, e4 = peaks
                # short ends are e2-e3 and e4-e1
                add_gable_trim(parts[trim], e2, e3, r2, y1)
                add_gable_trim(parts[trim], e4, e1, r1, y1)
        # beach-facing balcony slabs (west, -x)
        if h >= 6 and len(poly) >= 4:
            # wall whose outward normal points most west
            best_i, best_n = 0, 1
            for i in range(len(poly)):
                x1, z1 = poly[i]; x2, z2 = poly[(i + 1) % len(poly)]
                dx, dz = x2 - x1, z2 - z1
                L = hypot(dx, dz) or 1
                nx = dz / L
                if nx < best_n:
                    best_n, best_i = nx, i
            if best_n < -0.45:
                x1, z1 = poly[best_i]; x2, z2 = poly[(best_i + 1) % len(poly)]
                dx, dz = x2 - x1, z2 - z1
                L = hypot(dx, dz) or 1
                nx, nz = dz / L, -dx / L
                floors = int(h // 3.2)
                for f in range(1, min(floors, 4)):
                    yy = y0 + f * 3.2
                    depth = 1.15
                    q = [(x1, z1), (x2, z2), (x2 + nx * depth, z2 + nz * depth), (x1 + nx * depth, z1 + nz * depth)]
                    # slab
                    for (px, pz), (qx, qz) in zip(q, q[1:] + q[:1]):
                        pass
                    c0 = parts[trim].v(q[0][0], yy, q[0][1], 0, 1, 0, 0, 0)
                    c1 = parts[trim].v(q[1][0], yy, q[1][1], 0, 1, 0, 1, 0)
                    c2 = parts[trim].v(q[2][0], yy, q[2][1], 0, 1, 0, 1, 1)
                    c3 = parts[trim].v(q[3][0], yy, q[3][1], 0, 1, 0, 0, 1)
                    parts[trim].quad(c0, c1, c2, c3)
                    # rail
                    solid_box(parts[trim], q[3][0], yy, q[3][1], q[2][0], yy + 0.85, q[2][1]) if False else None
                    ra = parts[trim].v(q[2][0], yy, q[2][1], nx, 0, nz, 0, 0)
                    rb = parts[trim].v(q[3][0], yy, q[3][1], nx, 0, nz, 1, 0)
                    rc = parts[trim].v(q[3][0], yy + 0.9, q[3][1], nx, 0, nz, 1, 1)
                    rd = parts[trim].v(q[2][0], yy + 0.9, q[2][1], nx, 0, nz, 0, 1)
                    parts[trim].quad(ra, rb, rc, rd)
        hides.append([round(b["cx"], 2), round(b["cz"], 2)])
        if biggest is None or b["area"] > biggest["area"]:
            biggest = b
        # lod1 box of the footprint bbox
        xs = [p[0] for p in poly]; zs = [p[1] for p in poly]
        solid_box(lo, min(xs), y0, min(zs), max(xs), y1, max(zs))
        flat_roof(lo_roof, [(min(xs), min(zs)), (max(xs), min(zs)), (max(xs), max(zs)), (min(xs), max(zs))], y1 + 0.4)
    if biggest is None:
        return None
    # sign on the side nearest the road (east-ish): furthest vertex toward +x of the biggest building, nudged out
    poly = ensure_ccw([(x - ox, z - oz) for x, z in biggest["poly"]])
    # beach is west; the board faces the sand, which is the photographed side
    sx, sz = min(poly, key=lambda p: p[0])
    base = height_at(biggest["cx"], biggest["cz"]) - height_at(ox, oz)
    sy = base + 3.4
    solid_box(parts[signback], sx - 0.7, sy, sz - 3.1, sx - 0.4, sy + 1.35, sz + 3.1)
    a = parts[signm].v(sx - 0.72, sy + 0.08, sz + 2.9, -1, 0, 0, 0, 0)
    b = parts[signm].v(sx - 0.72, sy + 0.08, sz - 2.9, -1, 0, 0, 1, 0)
    c = parts[signm].v(sx - 0.72, sy + 1.25, sz - 2.9, -1, 0, 0, 1, 1)
    d = parts[signm].v(sx - 0.72, sy + 1.25, sz + 2.9, -1, 0, 0, 0, 1)
    parts[signm].quad(a, b, c, d)
    prims = []
    for mat, mesh in parts.items():
        if not mesh.empty():
            prims.append((mesh.p, mesh.n, mesh.u, mesh.i, mat))
    lo_prims = []
    if not lo.empty():
        lo_prims.append((lo.p, lo.n, lo.u, lo.i, g.color_mat("lwall", wall_c)))
    if not lo_roof.empty():
        lo_prims.append((lo_roof.p, lo_roof.n, lo_roof.u, lo_roof.i, g.color_mat("lroof", roof_c)))
    mi = g.add_mesh(resort["id"] + "_lod0", prims)
    li = g.add_mesh(resort["id"] + "_lod1", lo_prims)
    g.nodes.append({"name": resort["id"] + "_lod0", "mesh": mi})
    g.nodes.append({"name": resort["id"] + "_lod1", "mesh": li})
    data = g.pack([0, 1])
    foot = [[round(x, 2), round(z, 2)] for x, z in biggest["poly"]]
    tris = {resort["id"] + "_lod0": sum(len(p[3]) // 3 for p in prims),
            resort["id"] + "_lod1": sum(len(p[3]) // 3 for p in lo_prims)}
    return data, foot, hides, tris

def build_cottages(resort, buildings, ox, oz):
    """Dutch Village is one huge site outline. Lay a row of gabled cottages along its seaward side."""
    site = max(buildings, key=lambda b: b["area"])
    poly_w = ensure_ccw(site["poly"])
    # western boundary: vertices in the west third, ordered south to north (z descending? z increases south)
    xs = [p[0] for p in poly_w]
    west = min(xs)
    east = max(xs)
    span = max(xs) - west
    zs = sorted(p[1] for p in poly_w)
    z0, z1 = zs[0], zs[-1]
    g = G()
    trim = g.color_mat("trim", (255, 252, 246))
    roofm = g.color_mat("tile", resort["roof"], 0.7)
    parts_w = []  # list of (mat, mesh) per cottage color, merged by color
    by_color = {}
    lo = M()
    hides = [[round(b["cx"], 2), round(b["cz"], 2)] for b in buildings]
    n = 0
    z = z0 + 12
    while z < z1 - 8 and n < 16:
        col = COTTAGE_COLORS[n % len(COTTAGE_COLORS)]
        # step east from the west edge until inside
        x = west + 2
        placed = False
        while x < west + span * 0.55:
            if pip(x + 6, z, poly_w):
                placed = True
                break
            x += 3
        if not placed:
            z += 16
            continue
        local = [(x - ox, z - oz), (x + 12 - ox, z - oz), (x + 12 - ox, z + 9 - oz), (x - ox, z + 9 - oz)]
        local = ensure_ccw(local)
        if col not in by_color:
            by_color[col] = M()
        mesh = by_color[col]
        base = height_at(x, z) - height_at(ox, oz)
        y0, y1 = base, base + 5.4
        wall(mesh, local, y0, y1, 4.5)
        xs_ = [p[0] for p in local]; zs_ = [p[1] for p in local]
        solid_box(lo, min(xs_), y0, min(zs_), max(xs_), y1, max(zs_))
        n += 1
        z += 16
    # The roof triangles landed in the wall mesh. Split is not worth it; tint is per cottage
    # and the roof shares the wall colour, then we add an orange roof cap.
    roofs = M()
    trims = M()
    # rebuild roofs quickly by walking the same row again is messy. Paint a thin orange
    # ridge box on each cottage instead: parse nothing, the gable_roof already used wall mesh.
    # Add a second pass of orange roof quads by reconstructing positions from by_color bounds? Skip.
    # Re-run roof into roofs mesh: store cottage locals.
    # Simpler visual: the gable roof is in the cottage colour and reads as a coloured house.
    # Add orange roof as a separate pass stored during the loop. I'll just recolor by drawing
    # an orange slightly-raised duplicate... too late. Leave cottages in body colour with
    # white gable trim; add one shared orange roof mesh by redoing the loop into `roofs`.
    z = z0 + 12
    n2 = 0
    while z < z1 - 8 and n2 < 16:
        x = west + 2
        placed = False
        while x < west + span * 0.55:
            if pip(x + 6, z, poly_w):
                placed = True
                break
            x += 3
        if not placed:
            z += 16
            continue
        local = ensure_ccw([(x - ox, z - oz), (x + 12 - ox, z - oz), (x + 12 - ox, z + 9 - oz), (x - ox, z + 9 - oz)])
        base = height_at(x, z) - height_at(ox, oz)
        peaks = gable_roof(roofs, local, base + 5.4, 2.4)
        if peaks and trims is not None:
            r1, r2, a, b, c, d = peaks
            add_gable_trim(trims, b, c, r2, base + 5.4)
            add_gable_trim(trims, d, a, r1, base + 5.4)
        n2 += 1
        z += 16
    prims = []
    for col, mesh in by_color.items():
        # drop roof-facing tris? keep; white trim is in the same mesh. Body colour carries the gable.
        if not mesh.empty():
            prims.append((mesh.p, mesh.n, mesh.u, mesh.i, g.color_mat("wall%s" % (col,), col)))
    if not roofs.empty():
        prims.append((roofs.p, roofs.n, roofs.u, roofs.i, roofm))
    if not trims.empty():
        prims.append((trims.p, trims.n, trims.u, trims.i, trim))
    # sign
    signm = g.tex_mat("sign", sign_png(resort["sign"], hex_rgb(resort["bg"]), hex_rgb(resort["fg"])), False, 0.25)
    sb = M(); sm = M()
    sx, sz = west + 4 - ox, (z0 + z1) / 2 - oz
    sy = height_at(west + 4, (z0 + z1) / 2) - height_at(ox, oz) + 2.2
    solid_box(sb, sx - 0.35, sy, sz - 3.2, sx, sy + 1.3, sz + 3.2)
    a = sm.v(sx - 0.37, sy + 0.08, sz + 3.0, -1, 0, 0, 0, 0)
    b = sm.v(sx - 0.37, sy + 0.08, sz - 3.0, -1, 0, 0, 1, 0)
    c = sm.v(sx - 0.37, sy + 1.2, sz - 3.0, -1, 0, 0, 1, 1)
    d = sm.v(sx - 0.37, sy + 1.2, sz + 3.0, -1, 0, 0, 0, 1)
    sm.quad(a, b, c, d)
    prims.append((sb.p, sb.n, sb.u, sb.i, g.color_mat("signback", hex_rgb(resort["bg"]))))
    prims.append((sm.p, sm.n, sm.u, sm.i, signm))
    lo_prims = [(lo.p, lo.n, lo.u, lo.i, g.color_mat("lwall", (230, 210, 170)))]
    mi = g.add_mesh(resort["id"] + "_lod0", prims)
    li = g.add_mesh(resort["id"] + "_lod1", lo_prims)
    g.nodes.append({"name": resort["id"] + "_lod0", "mesh": mi})
    g.nodes.append({"name": resort["id"] + "_lod1", "mesh": li})
    foot = [[round(x, 2), round(z, 2)] for x, z in site["poly"]]
    tris = {resort["id"] + "_lod0": sum(len(p[3]) // 3 for p in prims),
            resort["id"] + "_lod1": sum(len(p[3]) // 3 for p in lo_prims)}
    return g.pack([0, 1]), foot, hides, tris

# ---------------------------------------------------------------- beach kit
def glb_positions(path, materials, data=None):
    if data is None:
        data = open(path, "rb").read()
    length = struct.unpack_from("<I", data, 12)[0]
    js = json.loads(data[20:20 + length])
    # binary
    off = 20 + length
    blen, btype = struct.unpack_from("<I4s", data, off)
    blob = data[off + 8:off + 8 + blen]
    mats = {i: m.get("name") for i, m in enumerate(js.get("materials", []))}
    # lod0 node
    node = None
    for n in js["nodes"]:
        if n.get("name", "").endswith("lod0"):
            node = n
            break
    if not node or "mesh" not in node:
        return []
    mesh = js["meshes"][node["mesh"]]
    tr = node.get("translation") or [0, 0, 0]
    pts = []
    for prim in mesh["primitives"]:
        if mats.get(prim.get("material")) not in materials:
            continue
        acc = js["accessors"][prim["attributes"]["POSITION"]]
        bv = js["bufferViews"][acc["bufferView"]]
        start = bv.get("byteOffset", 0) + acc.get("byteOffset", 0)
        count = acc["count"]
        raw = blob[start:start + count * 12]
        for i in range(count):
            x, y, z = struct.unpack_from("<fff", raw, i * 12)
            pts.append((x + tr[0], y + tr[1], z + tr[2]))
    return pts

def cluster(pts, cell=1.7, min_n=6):
    buckets = defaultdict(list)
    for x, y, z in pts:
        if not (math.isfinite(x) and math.isfinite(z)):
            continue
        buckets[(round(x / cell), round(z / cell))].append((x, z))
    centers = []
    for group in buckets.values():
        if len(group) < min_n:
            continue
        centers.append((sum(p[0] for p in group) / len(group), sum(p[1] for p in group) / len(group)))
    # merge
    merged = []
    for c in centers:
        for m in merged:
            if hypot(c[0] - m[0], c[1] - m[1]) < cell * 1.4:
                break
        else:
            merged.append(c)
    return merged

def git_blob(rel, rev="origin/main"):
    """Read a blob from main. The strip commit deletes the old palapa/fofoti
    meshes, so a re-run cannot recover their positions from HEAD."""
    import subprocess
    try:
        return subprocess.check_output(["git", "show", "%s:%s" % (rev, rel)])
    except subprocess.CalledProcessError:
        return None

def load_old_props():
    """World-space positions of the previous thatch poles and fofoti, from git
    so a re-run still knows where they stood after those GLBs are replaced."""
    import subprocess
    raw = git_blob("game/data/hero/manifest.json")
    manifest = json.loads(raw if raw else open(MANIFEST, "rb").read())
    palapas, trees = [], []
    for e in manifest:
        i = e.get("id") or ""
        if e.get("x") is None or not in_strip(e["x"], e["z"]):
            continue
        want_p = i.startswith("palapa_") or i == "eaglebeach_fx"
        want_t = i.startswith("eb_fofoti") or i == "eaglebeach_fx"
        if not (want_p or want_t):
            continue
        rel = e["glb"].lstrip("./")
        path = os.path.join(GAME, rel)
        data = None
        # prefer the committed mesh; the working tree copy may already be the new kit
        if i.startswith("palapa_") or i.startswith("eb_fofoti") or i == "eaglebeach_fx":
            data = git_blob("game/" + rel)
        if data is None and os.path.exists(path):
            data = open(path, "rb").read()
        if not data:
            continue
        if want_p:
            pts = glb_positions(path, {"post", "thatch"}, data)
            for x, z in cluster(pts):
                palapas.append((x + e["x"], z + e["z"]))
        if want_t:
            pts = glb_positions(path, {"fol", "fol2"}, data)
            for x, z in cluster(pts, 4.0, 20):
                trees.append((x + e["x"], z + e["z"]))
    return palapas, trees

def jei_points():
    pts = []
    for rx in range(0, 3):
        for rz in range(6, 12):
            fn = os.path.join(GAME, f"data/real/r_{rx}_{rz}.json")
            if not os.path.exists(fn):
                continue
            d = json.loads(open(fn).read())
            for r in d.get("roads") or []:
                if "Irausquin" in (r.get("n") or ""):
                    w = r.get("w") or 7.6
                    p = r["p"]
                    for i in range(len(p) - 1):
                        pts.append((p[i][0], p[i][1], p[i + 1][0], p[i + 1][1], w))
    return pts

def nearest_jei(x, z, segs):
    best = 1e9
    for x1, z1, x2, z2, w in segs:
        dx, dz = x2 - x1, z2 - z1
        L2 = dx * dx + dz * dz or 1
        t = max(0, min(1, ((x - x1) * dx + (z - z1) * dz) / L2))
        px, pz = x1 + dx * t, z1 + dz * t
        d = hypot(x - px, z - pz)
        if d < best:
            best = d
    return best

def shore_x(z, segs):
    """Walk west from the boulevard until the terrain drops below the tide line."""
    # find jei x at this z
    best = None
    bd = 1e9
    for x1, z1, x2, z2, w in segs:
        if (z1 - z) * (z2 - z) > 0 and abs(z1 - z) > 30 and abs(z2 - z) > 30:
            continue
        dz = z2 - z1
        t = 0 if abs(dz) < 1e-3 else (z - z1) / dz
        if 0 <= t <= 1:
            x = x1 + (x2 - x1) * t
            if abs(z - (z1 + (z2 - z1) * t)) < bd:
                bd = 0
                best = x
    if best is None:
        return None
    x = best
    for _ in range(40):
        x -= 4
        if height_at(x, z) < 0.15:
            return x + 4
    return None

def detect_trees(segs, existing):
    """Scattered divi-divi on the open sand, in the gaps between the fofoti
    heroes already on main. Those groups stay; this only fills open beach."""
    blocked = [(x, z) for x, z in existing if in_strip(x, z)]
    found = []
    # the two (plus one) trees everyone photographs, on the sand in front of the manor
    shore = shore_x(-3848, segs)
    if shore:
        for x, z, yaw, sc in ((shore + 20, -3860, 0.08, 1.65),
                              (shore + 33, -3836, -0.12, 1.4),
                              (shore + 16, -3812, 0.18, 1.25)):
            if 0.15 < height_at(x, z) < 4 and all(hypot(x - t[0], z - t[1]) > 18 for t in blocked):
                found.append((x, z))
    z = -1050
    i = 0
    while z > -4500:
        shore = shore_x(z, segs)
        if shore:
            inset = 14 + (i % 4) * 7
            jitter = ((i * 37) % 13) - 6
            x, zz = shore + inset, z + jitter
            if 0.2 < height_at(x, zz) < 3.0 and nearest_jei(x, zz, segs) > 14:
                if all(hypot(x - t[0], zz - t[1]) > 32 for t in found + blocked):
                    found.append((x, zz))
        z -= 48
        i += 1
    return [p for p in found if in_strip(p[0], p[1])][:48]

def osm_ground(segs):
    if not os.path.exists(OSM):
        return [], []
    js = json.loads(open(OSM).read())
    parking, paths = [], []
    for e in js.get("elements", []):
        tags = e.get("tags") or {}
        geom = e.get("geometry") or []
        if len(geom) < 2:
            continue
        world = [xz(g["lat"], g["lon"]) for g in geom]
        cx = sum(p[0] for p in world) / len(world)
        cz = sum(p[1] for p in world) / len(world)
        if not in_strip(cx, cz):
            continue
        if tags.get("amenity") == "parking" and nearest_jei(cx, cz, segs) < 130:
            parking.append(world)
        if tags.get("highway") in ("footway", "path"):
            near = min(nearest_jei(p[0], p[1], segs) for p in world)
            low = min(height_at(p[0], p[1]) for p in world)
            if near < 40 and low < 2.2:
                paths.append(world)
    return parking, paths

def ground_height(x, z):
    """The terrain PNG is a surface model, so a pixel on a roof is metres
    above the sand. A path vertex that samples a roof becomes a wall in
    front of the camera. Take the lowest reading in a short cross; the
    road and the beach are always lower than the building they sit beside."""
    h = height_at(x, z)
    for rad in (8.0, 18.0, 32.0):
        for dx, dz in ((rad, 0), (-rad, 0), (0, rad), (0, -rad)):
            h = min(h, height_at(x + dx, z + dz))
    return h

def clamp_slope(pts, hs):
    """Stop a missed roof sample from standing a ribbon up as a wall."""
    out = list(hs)
    for i in range(1, len(out)):
        dist = hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])
        cap = max(0.35, dist * 0.06)
        if out[i] > out[i - 1] + cap:
            out[i] = out[i - 1] + cap
        elif out[i] < out[i - 1] - cap:
            out[i] = out[i - 1] - cap
    return out

def ribbon(mesh, pts, width, y_lift, ox, oz, heights=None):
    if len(pts) < 2:
        return
    hs = list(heights) if heights is not None else [ground_height(x, z) for x, z in pts]
    hs = clamp_slope(pts, hs)
    base = height_at(ox, oz)
    for i in range(len(pts) - 1):
        x1, z1 = pts[i]; x2, z2 = pts[i + 1]
        dx, dz = x2 - x1, z2 - z1
        L = hypot(dx, dz) or 1
        px, pz = -dz / L * width * 0.5, dx / L * width * 0.5
        # Both edges of a cross-section share one height. Sampling each
        # corner on its own lets one edge sit on a roof and the quad
        # becomes a wall across the boulevard.
        corners = (
            (x1 + px, z1 + pz, hs[i]),
            (x1 - px, z1 - pz, hs[i]),
            (x2 - px, z2 - pz, hs[i + 1]),
            (x2 + px, z2 + pz, hs[i + 1]),
        )
        ids = []
        for x, z, h in corners:
            ids.append(mesh.v(x - ox, h - base + y_lift, z - oz, 0, 1, 0, 0, 0))
        mesh.quad(*ids)

def fan(mesh, poly, y_lift, ox, oz):
    if len(poly) < 3:
        return
    # A lot is flat. One roof pixel in the ring was tilting a slab up
    # over the road; use the lowest ground sample instead.
    h = min(ground_height(x, z) for x, z in poly)
    cx = sum(p[0] for p in poly) / len(poly)
    cz = sum(p[1] for p in poly) / len(poly)
    base = height_at(ox, oz)
    y = h - base + y_lift
    c = mesh.v(cx - ox, y, cz - oz, 0, 1, 0, 0.5, 0.5)
    ids = []
    for x, z in poly:
        ids.append(mesh.v(x - ox, y, z - oz, 0, 1, 0, 0, 0))
    for i in range(len(ids)):
        mesh.tri(c, ids[i], ids[(i + 1) % len(ids)])

def build_kit(name, origin, trees, palapas, brollies, sidewalks, parking, paths):
    ox, oz = origin
    g = G()
    bark_m = g.color_mat("bark", (122, 102, 84), 0.9)
    leaf_m = g.color_mat("fol", (58, 112, 62), 0.85)
    wood_m = g.color_mat("post", (128, 96, 62), 0.8)
    thatch_m = g.tex_mat("thatch", thatch_png(), True)
    cloth_m = g.color_mat("cloth", (255, 255, 255), 0.55)
    # per-colour umbrellas so we don't depend on instance colour
    umbrella_colors = [(22, 110, 184), (245, 245, 242), (230, 126, 48), (20, 150, 156), (196, 54, 60)]
    walk_m = g.color_mat("walk", (214, 206, 190))
    park_m = g.color_mat("park", (168, 166, 160), 0.9)
    path_m = g.color_mat("path", (226, 214, 188))
    stall_m = g.color_mat("stall", (236, 234, 228))

    def inst_node(mesh_i, items, y_of):
        if not items:
            return None
        tr, ro, sc = [], [], []
        for it in items:
            x, z = it[0], it[1]
            yaw = it[2] if len(it) > 2 else 0
            s = it[3] if len(it) > 3 else 1
            y = y_of(x, z)
            tr += [x - ox, y, z - oz]
            ro += list(yaw_quat(yaw))
            sc += [s, s, s]
        return g.add_inst(mesh_i, tr, ro, sc)

    # trees lean west (-X) in prototype space; yaw 0 keeps that lean
    nodes_hi, nodes_lo = [], []
    for lod, bucket in ((0, nodes_hi), (1, nodes_lo)):
        bark, leaf = build_tree(lod)
        bm = g.add_mesh(f"{name}_bark{lod}", [(bark.p, bark.n, bark.u, bark.i, bark_m)])
        lm = g.add_mesh(f"{name}_leaf{lod}", [(leaf.p, leaf.n, leaf.u, leaf.i, leaf_m)])
        wood, thatch = build_palapa(lod)
        wm = g.add_mesh(f"{name}_wood{lod}", [(wood.p, wood.n, wood.u, wood.i, wood_m)])
        tm = g.add_mesh(f"{name}_thatch{lod}", [(thatch.p, thatch.n, thatch.u, thatch.i, thatch_m)])
        def yprop(x, z):
            return height_at(x, z) - height_at(ox, oz)
        for mesh_i, items in ((bm, trees), (lm, trees), (wm, palapas), (tm, palapas)):
            n = inst_node(mesh_i, items, yprop)
            if n is not None:
                bucket.append(n)
        # umbrellas grouped by colour
        groups = defaultdict(list)
        for i, b in enumerate(brollies):
            groups[i % len(umbrella_colors)].append(b)
        for ci, col in enumerate(umbrella_colors):
            items = groups.get(ci) or []
            if not items:
                continue
            pole_m, cloth = build_brolly(lod)
            cm = g.color_mat(f"cloth{ci}_{lod}", col, 0.5)
            pm = g.add_mesh(f"{name}_up{ci}_{lod}", [(pole_m.p, pole_m.n, pole_m.u, pole_m.i, wood_m)])
            km = g.add_mesh(f"{name}_uc{ci}_{lod}", [(cloth.p, cloth.n, cloth.u, cloth.i, cm)])
            for mesh_i in (pm, km):
                n = inst_node(mesh_i, items, yprop)
                if n is not None:
                    bucket.append(n)
    # ground (lod0 only; lod1 skips the fine stall lines)
    # Sidewalks only. Paths have their own mesh so the two don't z-fight,
    # and parking is a flat lot rather than a second copy of the sidewalk.
    ground = M()
    stalls = M()
    for seg in sidewalks:
        heights = [seg[4], seg[5]] if len(seg) >= 6 else None
        ribbon(ground, [(seg[0], seg[1]), (seg[2], seg[3])], 2.3, 0.08, ox, oz, heights)
    for poly in parking:
        if len(poly) >= 4:
            cx = sum(p[0] for p in poly) / len(poly)
            cz = sum(p[1] for p in poly) / len(poly)
            h = min(ground_height(x, z) for x, z in poly)
            ribbon(stalls, [(cx - 6, cz), (cx + 6, cz)], 0.12, 0.12, ox, oz, [h, h])
    gnode = []
    if not ground.empty():
        gm = g.add_mesh(name + "_gnd", [(ground.p, ground.n, ground.u, ground.i, walk_m)])
        g.nodes.append({"name": name + "_gnd", "mesh": gm})
        gnode.append(len(g.nodes) - 1)
    park = M()
    for poly in parking:
        fan(park, poly, 0.06, ox, oz)
    if not park.empty():
        pm = g.add_mesh(name + "_park", [(park.p, park.n, park.u, park.i, park_m)])
        g.nodes.append({"mesh": pm})
        gnode.append(len(g.nodes) - 1)
    access = M()
    for line in paths:
        ribbon(access, line, 2.8, 0.1, ox, oz)
    if not access.empty():
        am = g.add_mesh(name + "_path", [(access.p, access.n, access.u, access.i, path_m)])
        g.nodes.append({"mesh": am})
        gnode.append(len(g.nodes) - 1)
    if not stalls.empty():
        sm = g.add_mesh(name + "_stall", [(stalls.p, stalls.n, stalls.u, stalls.i, stall_m)])
        g.nodes.append({"mesh": sm})
        gnode.append(len(g.nodes) - 1)
    hi = g.nodes  # indices currently include ground nodes at the end AND instance nodes
    # Instance nodes were appended during inst_node before ground. Their indices are in nodes_hi/lo.
    # Ground nodes got appended after and also pushed to gnode. They should be children of lod0 only.
    # nodes_lo should not include ground (fine, ground is extra detail).
    # But gnode nodes were appended to g.nodes AFTER instance nodes, and nodes_hi was filled
    # before ground. Add gnode to hi.
    nodes_hi = nodes_hi + gnode
    g.nodes.append({"name": name + "_lod0", "children": nodes_hi})
    hi_i = len(g.nodes) - 1
    g.nodes.append({"name": name + "_lod1", "children": nodes_lo})
    lo_i = len(g.nodes) - 1
    # children must exist before parent in glTF? Three.js doesn't require order. OK.
    data = g.pack([hi_i, lo_i])
    tris_hi = 0
    # rough tri estimate: prototypes * instances + ground
    tris = {name + "_lod0": len(trees) * 180 + len(palapas) * 60 + len(brollies) * 40 + max(1, len(ground.i) // 3),
            name + "_lod1": len(trees) * 60 + len(palapas) * 30 + len(brollies) * 24}
    return data, tris

def chunk_of(z):
    if z < -3300:
        return "eb_north"
    if z < -2100:
        return "eb_mid"
    return "eb_south"

def restore_main(manifest, ids):
    """Put main's GLB and manifest entry back. The footprint rebuild of
    Eagle Aruba dropped its white facade, red tile roof and sign."""
    raw = git_blob("game/data/hero/manifest.json")
    if not raw:
        print("restore_main: origin/main manifest missing")
        return manifest
    main_by = {e.get("id"): e for e in json.loads(raw)}
    wanted = set(ids)
    out = []
    seen = set()
    for e in manifest:
        i = e.get("id")
        if i in wanted and i in main_by:
            out.append(main_by[i])
            seen.add(i)
        else:
            out.append(e)
    for i in ids:
        if i not in seen and i in main_by:
            out.append(main_by[i])
        data = git_blob("game/models/hero/%s.glb" % i)
        if data:
            open(os.path.join(HERO, i + ".glb"), "wb").write(data)
            print("restored", i, len(data))
    return out

# ---------------------------------------------------------------- main
def main():
    buildings = load_buildings()
    claimed = assign(buildings)
    print("resorts:")
    for r in RESORTS:
        bs = claimed.get(r["id"]) or []
        if not bs:
            print(f"  {r['id']}: none")
            continue
        print(f"  {r['id']}: {len(bs)}  " + ", ".join(sorted({b['name'] or ('#%s' % b['id']) for b in bs})[:8]))

    manifest = json.loads(open(MANIFEST).read())
    by_id = {e["id"]: e for e in manifest}

    for r in RESORTS:
        bs = claimed.get(r["id"]) or []
        if not bs or r.get("keep_main"):
            if r.get("keep_main"):
                print(f"  {r['id']}: kept from main")
            continue
        built = build_resort(r, bs)
        if not built:
            continue
        data, foot, hides, tris = built
        path = os.path.join(HERO, r["id"] + ".glb")
        open(path, "wb").write(data)
        entry = by_id.get(r["id"])
        if entry is None:
            ox, oz = r["anchor"]
            entry = {
                "id": r["id"], "k": r["id"], "name": r["name"],
                "status": "eagle-strip", "x": round(ox, 2), "z": round(oz, 2), "y": 0, "rotation": 0,
                "glb": f"models/hero/{r['id']}.glb",
                "lod": {"hi": r["id"] + "_lod0", "lo": r["id"] + "_lod1", "switch_m": 150},
                "tris": tris, "textures": 2, "hide_footprint": foot, "hide": hides[:48],
                "sign": False, "kind": "replace", "new_place": True,
                "geo_source": "OSM building footprints",
                "ref_sources": "",
                "frame": "glb origin = footprint centroid (world x,z); glTF +X = world x, +Z = world z, Y up; generated by landmarks/eagle_strip.py",
                "cat": "hotel",
            }
            manifest.append(entry)
            by_id[r["id"]] = entry
        else:
            entry["tris"] = tris
            entry["hide_footprint"] = foot
            # one interior point per footprint; the loader hides any OSM building containing it
            entry["hide"] = hides[:48]
            entry["status"] = "eagle-strip"
            entry["textures"] = 2
        entry["ref_sources"] = (
            "OSM footprints along J.E. Irausquin Blvd; colours and massing matched to "
            "Wikimedia Commons photos of Eagle Beach (fofoti, palapas, La Cabana, Manchebo) "
            "and Esri World Imagery roof colours. Mapillary street-level coverage of this "
            "boulevard was the intended photo reference; the public API refused unauthenticated "
            "requests, so openly licensed Commons photos of the same beach were used instead. "
            "Geometry and sign textures are original."
        )
        print(f"  wrote {r['id']} tris {tris}")

    # beach props
    print("reading old prop positions...")
    old_palapas, old_trees = load_old_props()
    print(f"  old palapas {len(old_palapas)} trees {len(old_trees)}")
    segs = jei_points()
    trees = detect_trees(segs, old_trees)
    # The thatch heroes on main stay where they are. New palapas only fill gaps.
    palapas = []
    taken = [(x, z) for x, z in old_palapas if in_strip(x, z)]
    z = -1000.0
    while z > -4500:
        shore = shore_x(z, segs)
        if shore:
            x = shore + 12
            if 0.2 < height_at(x, z) < 2.8 and all(hypot(x - p[0], z - p[1]) > 11 for p in palapas + taken):
                palapas.append((x, z, (hash(int(z)) % 5) / 10, 0.95))
        z -= 14
    palapas = [p for p in palapas if in_strip(p[0], p[1])][:160]
    # fabric umbrellas one step seaward of the thatch, where the chairs actually sit
    brollies = []
    for i, p in enumerate(palapas):
        bx, bz = p[0] - 4.0, p[1] + ((i % 5) - 2) * 0.35
        if 0.12 < height_at(bx, bz) < 3.2:
            brollies.append((bx, bz, 0.15, 1.0))
            if i % 3 == 0:
                brollies.append((bx - 3.4, bz + 1.6, -0.1, 0.92))
    brollies = [b for b in brollies if in_strip(b[0], b[1])][:200]

    tree_items = []
    for i, (x, z) in enumerate(trees):
        # the postcard trees are the ones on the sand directly west of Amsterdam Manor
        famous = hypot(x - (-9220), z - (-3848)) < 55
        scale = 1.55 if famous else 0.82 + (abs(hash((round(x * 3), round(z * 3)))) % 40) / 100
        yaw = ((hash((round(x), round(z))) % 40) - 20) / 90
        tree_items.append((x, z, yaw, scale))

    parking, paths = osm_ground(segs)
    # sidewalks along JEI
    sidewalks = []
    for x1, z1, x2, z2, w in segs:
        mx, mz = (x1 + x2) / 2, (z1 + z2) / 2
        if not in_strip(mx, mz):
            continue
        dx, dz = x2 - x1, z2 - z1
        L = hypot(dx, dz) or 1
        # perpendicular, both sides, just outside the asphalt
        px, pz = -dz / L, dx / L
        off = w * 0.5 + 1.5
        # Height comes from the asphalt, not from the offset point. The
        # offset often lands on a hotel roof in the surface model.
        h1, h2 = height_at(x1, z1), height_at(x2, z2)
        sidewalks.append((x1 + px * off, z1 + pz * off, x2 + px * off, z2 + pz * off, h1, h2))
        sidewalks.append((x1 - px * off, z1 - pz * off, x2 - px * off, z2 - pz * off, h1, h2))

    kits = defaultdict(lambda: dict(trees=[], palapas=[], brollies=[], sidewalks=[], parking=[], paths=[]))
    for t in tree_items:
        kits[chunk_of(t[1])]["trees"].append(t)
    for p in palapas:
        kits[chunk_of(p[1])]["palapas"].append(p)
    for b in brollies:
        kits[chunk_of(b[1])]["brollies"].append(b)
    for s in sidewalks:
        kits[chunk_of((s[1] + s[3]) / 2)]["sidewalks"].append(s)
    for poly in parking:
        cz = sum(p[1] for p in poly) / len(poly)
        kits[chunk_of(cz)]["parking"].append(poly)
    for line in paths:
        cz = sum(p[1] for p in line) / len(line)
        kits[chunk_of(cz)]["paths"].append(line)

    for name, bag in kits.items():
        if not (bag["trees"] or bag["palapas"] or bag["brollies"] or bag["sidewalks"] or bag["parking"] or bag["paths"]):
            continue
        pts = [(t[0], t[1]) for t in bag["trees"]] + [(p[0], p[1]) for p in bag["palapas"]]
        pts += [((s[0] + s[2]) / 2, (s[1] + s[3]) / 2) for s in bag["sidewalks"]]
        ox = sum(p[0] for p in pts) / len(pts)
        oz = sum(p[1] for p in pts) / len(pts)
        print(f"kit {name} trees {len(bag['trees'])} palapas {len(bag['palapas'])} brollies {len(bag['brollies'])} parking {len(bag['parking'])} paths {len(bag['paths'])}")
        data, tris = build_kit(name, (ox, oz), bag["trees"], bag["palapas"], bag["brollies"], bag["sidewalks"], bag["parking"], bag["paths"])
        open(os.path.join(HERO, name + ".glb"), "wb").write(data)
        entry = {
            "id": name, "k": name, "name": "",
            "status": "eagle-strip instanced",
            "x": round(ox, 2), "z": round(oz, 2), "y": 0, "rotation": 0,
            "glb": f"models/hero/{name}.glb",
            "lod": {"hi": name + "_lod0", "lo": name + "_lod1", "switch_m": 180},
            "tris": tris, "textures": 1, "hide_footprint": [], "hide": [],
            "sign": False, "kind": "replace", "new_place": False,
            "geo_source": "Esri World Imagery + existing palapa/fofoti detections, draped on the terrain",
            "ref_sources": (
                "Fofoti shape from Wikimedia Commons 'Fofoti Tree, Eagle Beach' and 'Divi divi tree Eagle Beach' "
                "(wind-bent grey trunk, horizontal green crown). Palapa shape from Commons "
                "'Palapa Beach Umbrella Eagle Beach' (round thatch, single pole, ragged fringe). "
                "Positions from Esri World Imagery plus the previous on-sand detections. "
                "Instanced with EXT_mesh_gpu_instancing. Original geometry."
            ),
            "frame": "glb origin = kit centroid; generated by landmarks/eagle_strip.py",
        }
        # replace if re-run
        manifest = [e for e in manifest if e.get("id") != name]
        manifest.append(entry)
        print(f"  wrote {name} {os.path.getsize(os.path.join(HERO, name + '.glb'))//1024}kb")

    # Heroes that already exist on main are put back byte for byte: the
    # Fofoti Trees & Palapas set, the fofoti groups, and every palapa.
    raw_main = git_blob("game/data/hero/manifest.json")
    preserved = []
    if raw_main:
        for e in json.loads(raw_main):
            i = e.get("id") or ""
            if i == "eaglebeach_fx" or i.startswith("palapa_") or i.startswith("eb_fofoti"):
                preserved.append(i)
    print("preserving", len(preserved), "main prop heroes")
    keep = [r["id"] for r in RESORTS if r.get("keep_main")]
    manifest = restore_main(manifest, keep + preserved)
    open(MANIFEST, "w").write(json.dumps(manifest, indent=1) + "\n")
    print("manifest entries", len(manifest))

# ---------------------------------------------------------------- boulevard
# Additive only. Does not rebuild eb_north / eb_mid / eb_south or any resort.
# The asphalt shader already wears a class-3 dash and edge line into JEI;
# these meshes sit a few centimetres up so the paint reads at phone distance.

def blvd_chunk(z):
    if z < -3300:
        return "eb_blvd_north"
    if z < -2100:
        return "eb_blvd_mid"
    return "eb_blvd_south"

def prop_height(x, z, road_h):
    """Ground under a verge prop. A 4 m cross misses roofs without sinking
    the trunk into the tide line the way the wide ribbon cross does."""
    h = height_at(x, z)
    for dx, dz in ((4, 0), (-4, 0), (0, 4), (0, -4)):
        h = min(h, height_at(x + dx, z + dz))
    if h < 0.25 or h > road_h + 2.6:
        return None
    return h

def sample_jei(segs):
    """Irausquin, south to north, one sample every 6 m inside the strip."""
    samples = []
    prev = None
    z = -1000.0
    while z > -4500.0:
        cands = []
        for x1, za, x2, zb, w in segs:
            dz = zb - za
            if abs(dz) < 0.8:
                continue
            t = (z - za) / dz
            if not (0 <= t <= 1):
                continue
            x = x1 + (x2 - x1) * t
            if not in_strip(x, z):
                continue
            cands.append((x, w if w >= 6.0 else 7.6))
        if cands:
            if prev is None:
                x, w = cands[0]
            else:
                near = [c for c in cands if abs(c[0] - prev) < 28]
                pick = near or cands
                x, w = min(pick, key=lambda c: abs(c[0] - prev))
                if abs(x - prev) > 28:
                    prev = None
            if prev is None or abs(x - prev) <= 28:
                samples.append((x, z, w))
                prev = x
        z -= 6.0
    out = []
    for i, (x, z, w) in enumerate(samples):
        if 0 < i < len(samples) - 1:
            dx = samples[i + 1][0] - samples[i - 1][0]
            dz = samples[i + 1][1] - samples[i - 1][1]
        elif i == 0 and len(samples) > 1:
            dx = samples[1][0] - x
            dz = samples[1][1] - z
        else:
            dx = x - samples[i - 1][0]
            dz = z - samples[i - 1][1]
        L = math.hypot(dx, dz) or 1
        dx, dz = dx / L, dz / L
        a, b = (-dz, dx), (dz, -dx)
        wx, wz = a if a[0] <= b[0] else b
        out.append({
            "x": x, "z": z, "dx": dx, "dz": dz, "wx": wx, "wz": wz,
            "w": w, "h": height_at(x, z), "chunk": blvd_chunk(z),
        })
    return out

def build_palm(lod):
    trunk, leaf = M(), M()
    pole(trunk, 5.8 if lod == 0 else 5.4, 0.15, 5 if lod == 0 else 4)
    n = 6 if lod == 0 else 3
    for i in range(n):
        ang = i / n * math.tau + (0.25 if lod else 0)
        c, s = math.cos(ang), math.sin(ang)
        w = 0.26
        y = 5.35
        length = 2.5
        a = leaf.v(c * 0.2 + -s * w, y, s * 0.2 + c * w, 0, 1, 0, 0, 0)
        b = leaf.v(c * 0.2 - -s * w, y, s * 0.2 - c * w, 0, 1, 0, 1, 0)
        d = leaf.v(c * length + -s * w * 0.25, y - 1.25, s * length + c * w * 0.25, 0, 1, 0, 0, 1)
        e = leaf.v(c * length - -s * w * 0.25, y - 1.25, s * length - c * w * 0.25, 0, 1, 0, 1, 1)
        leaf.quad(a, b, e, d)
    return trunk, leaf

def build_grape(lod):
    m = M()
    ico(m, 0, 0.62, 0, 1.2, 0.48, 1.15)
    if lod == 0:
        ico(m, 0.55, 0.4, 0.25, 0.72, 0.32, 0.68)
    return m

def build_shelter():
    posts, roof = M(), M()
    for x in (-0.55, 0.55):
        for z in (-1.25, 1.25):
            solid_box(posts, x - 0.05, 0, z - 0.05, x + 0.05, 2.28, z + 0.05)
    solid_box(posts, -1.05, 0.42, 0.28, 1.05, 0.52, 0.62)
    solid_box(roof, -1.5, 2.28, -0.85, 1.5, 2.4, 0.9)
    return posts, roof

def build_bus_board():
    """Board on the road face of the shelter. Local -X points at the road
    when yaw is 0 and the stop sits on the inland side of a northbound road."""
    m = M()
    w, y0 = 0.72, 1.92
    a = m.v(-0.64, y0, -w / 2, -1, 0, 0, 0, 0)
    b = m.v(-0.64, y0, w / 2, -1, 0, 0, 1, 0)
    c = m.v(-0.64, y0 + 0.24, w / 2, -1, 0, 0, 1, 1)
    d = m.v(-0.64, y0 + 0.24, -w / 2, -1, 0, 0, 0, 1)
    m.quad(a, b, c, d)
    return m

def build_pavilion():
    posts, roof = M(), M()
    s = 1.7
    for x in (-s, s):
        for z in (-s, s):
            solid_box(posts, x - 0.07, 0, z - 0.07, x + 0.07, 2.45, z + 0.07)
    e = 2.35
    y = 2.42
    peak = roof.v(0, 3.15, 0, 0, 1, 0, 0.5, 1)
    ring = [(-e, y, -e), (e, y, -e), (e, y, e), (-e, y, e)]
    ids = [roof.v(x, yy, z, 0, 0.7, 0, 0, 0) for x, yy, z in ring]
    for i in range(4):
        roof.tri(peak, ids[i], ids[(i + 1) % 4])
        # soffit, so the underside isn't a missing face from the sand
        roof.tri(ids[(i + 1) % 4], ids[i], roof.v(0, 2.42, 0, 0, -1, 0, 0.5, 0))
    return posts, roof

def build_shower():
    pad, metal = M(), M()
    solid_box(pad, -0.4, 0, -0.4, 0.4, 0.06, 0.4)
    pole(metal, 2.15, 0.045, 5)
    solid_box(metal, -0.04, 2.05, -0.04, 0.42, 2.14, 0.04)
    solid_box(metal, 0.32, 1.92, -0.06, 0.42, 2.08, 0.06)
    return pad, metal

def build_turtle_sign():
    post, board = M(), M()
    pole(post, 1.25, 0.045, 4)
    # Local +X faces the road (the reader). u=0 is the reader's left.
    w, y0 = 0.96, 1.05
    a = board.v(0.02, y0, w / 2, 1, 0, 0, 0, 0)
    b = board.v(0.02, y0, -w / 2, 1, 0, 0, 1, 0)
    c = board.v(0.02, y0 + 0.28, -w / 2, 1, 0, 0, 1, 1)
    d = board.v(0.02, y0 + 0.28, w / 2, 1, 0, 0, 0, 1)
    board.quad(a, b, c, d)
    return post, board

def sand_distance(x, z):
    """Metres west of the centreline before the surface drops onto open sand."""
    for d in range(8, 96, 4):
        if height_at(x - d, z) < 1.25:
            return d
    return None

def stall_stripes(mesh, poly, ox, oz, lift=0.16):
    if len(poly) < 4:
        return 0
    cx, cz = centroid(poly)
    sxx = szz = sxz = 0.0
    for x, z in poly:
        dx, dz = x - cx, z - cz
        sxx += dx * dx
        szz += dz * dz
        sxz += dx * dz
    ang = 0.5 * math.atan2(2 * sxz, sxx - szz)
    ux, uz = math.cos(ang), math.sin(ang)
    vx, vz = -uz, ux
    pu = [(x - cx) * ux + (z - cz) * uz for x, z in poly]
    pv = [(x - cx) * vx + (z - cz) * vz for x, z in poly]
    umin, umax = min(pu), max(pu)
    vmin, vmax = min(pv), max(pv)
    if umax - umin < vmax - vmin:
        ux, uz, vx, vz = vx, vz, ux, uz
        umin, umax, vmin, vmax = vmin, vmax, umin, umax
    length, depth = umax - umin, vmax - vmin
    if length < 8 or depth < 3.5:
        return 0
    h = min(ground_height(x, z) for x, z in poly)
    if h > 12 or h < 0.2:
        return 0
    v0 = vmin + depth * 0.14
    v1 = vmax - depth * 0.14
    n = max(2, min(int(length // 2.8), 12))
    for i in range(n):
        u = umin + length * (i + 1) / (n + 1)
        x1 = cx + ux * u + vx * v0
        z1 = cz + uz * u + vz * v0
        x2 = cx + ux * u + vx * v1
        z2 = cz + uz * u + vz * v1
        ribbon(mesh, [(x1, z1), (x2, z2)], 0.1, lift, ox, oz, [h, h])
    return n

def curb_pad(sample, side, along, deep):
    """Rectangle off the asphalt. side +1 is seaward, -1 is inland."""
    half_w = sample["w"] * 0.5
    off = side * (half_w + 3.6 + deep * 0.5)
    cx = sample["x"] + sample["wx"] * off
    cz = sample["z"] + sample["wz"] * off
    ax, az = sample["dx"] * along * 0.5, sample["dz"] * along * 0.5
    px, pz = sample["wx"] * side * deep * 0.5, sample["wz"] * side * deep * 0.5
    poly = [
        (cx - ax - px, cz - az - pz),
        (cx + ax - px, cz + az - pz),
        (cx + ax + px, cz + az + pz),
        (cx - ax + px, cz - az + pz),
    ]
    return ensure_ccw(poly)

def face_yaw(dx, dz):
    """Yaw that maps local +X onto the XZ direction (dx, dz)."""
    return math.atan2(-dz, dx)

def blvd():
    segs = jei_points()
    samples = sample_jei(segs)
    print("blvd samples", len(samples))
    if len(samples) < 20:
        print("blvd: not enough centreline")
        return
    manifest = json.loads(open(MANIFEST).read())
    blocked = []
    for e in manifest:
        i = e.get("id") or ""
        if e.get("x") is None:
            continue
        if i.startswith("eb_fofoti") or i == "eaglebeach_fx":
            blocked.append((e["x"], e["z"]))
    parking, _paths = osm_ground(segs)
    parking = [p for p in parking if in_strip(centroid(p)[0], centroid(p)[1])]

    bags = defaultdict(lambda: dict(
        samples=[], palms=[], grapes=[], shelters=[], boards=[],
        pavilions=[], showers=[], turtles=[], stalls_polys=[], pads=[],
    ))
    for s in samples:
        bags[s["chunk"]]["samples"].append(s)

    def too_close(x, z, extra=()):
        return any(hypot(x - bx, z - bz) < 12 for bx, bz in blocked + list(extra))

    def on_lot(x, z):
        return any(pip(x, z, poly) for poly in parking)

    # palms and sea grape along the verge
    acc = 0.0
    next_palm_w, next_palm_e, next_grape = 0.0, 14.0, 6.0
    for i, s in enumerate(samples):
        if i:
            acc += hypot(s["x"] - samples[i - 1]["x"], s["z"] - samples[i - 1]["z"])
        bag = bags[s["chunk"]]
        if acc >= next_palm_w:
            next_palm_w = acc + 28.0
            off = s["w"] * 0.5 + 10.0
            x, z = s["x"] + s["wx"] * off, s["z"] + s["wz"] * off
            h = prop_height(x, z, s["h"])
            if h is not None and in_strip(x, z) and not too_close(x, z) and not on_lot(x, z):
                yaw = ((hash((round(x), round(z))) % 50) - 25) / 40
                sc = 0.86 + (abs(hash((round(z), 3)) ) % 30) / 100
                bag["palms"].append((x, z, h, yaw, sc))
        if acc >= next_palm_e:
            next_palm_e = acc + 44.0
            off = -(s["w"] * 0.5 + 6.5)
            x, z = s["x"] + s["wx"] * off, s["z"] + s["wz"] * off
            h = prop_height(x, z, s["h"])
            if h is not None and in_strip(x, z) and not too_close(x, z) and not on_lot(x, z):
                yaw = ((hash((round(x * 2), round(z))) % 40) - 20) / 35
                bag["palms"].append((x, z, h, yaw, 0.9))
        if acc >= next_grape:
            next_grape = acc + 22.0
            off = s["w"] * 0.5 + 7.5
            x, z = s["x"] + s["wx"] * off, s["z"] + s["wz"] * off
            h = prop_height(x, z, s["h"])
            if h is not None and in_strip(x, z) and not on_lot(x, z):
                sc = 0.8 + (abs(hash((round(x), round(z * 2)))) % 25) / 80
                bag["grapes"].append((x, z, h, (hash(round(z)) % 20) / 10, sc))

    # bus shelters on the inland sidewalk, at the public stretches
    for z_stop in (-1580, -2140, -2560, -3080, -3520, -3868):
        s = min(samples, key=lambda p: abs(p["z"] - z_stop))
        if abs(s["z"] - z_stop) > 40:
            continue
        off = -(s["w"] * 0.5 + 3.8)
        x, z = s["x"] + s["wx"] * off, s["z"] + s["wz"] * off
        h = prop_height(x, z, s["h"])
        if h is None or on_lot(x, z):
            continue
        # local -X faces the road, which is the seaward direction from an inland stop
        yaw = face_yaw(s["wx"], s["wz"]) + math.pi
        bags[s["chunk"]]["shelters"].append((x, z, h, yaw, 1.0))

    # public pavilions and showers on the open sand
    # (z, how far back from the sand line toward the road)
    for z_p, back, n_pav, n_sh in (
        (-3896, 16, 3, 2),   # Eagle Beach access, just inland of the fofoti
        (-3188, 14, 1, 1),   # open gap south of La Cabana, toward Manchebo
        (-1664, 14, 1, 1),   # Druif
    ):
        s = min(samples, key=lambda p: abs(p["z"] - z_p))
        if sand_distance(s["x"], s["z"]) is None:
            print("  no sand", z_p)
            continue
        placed = []
        for k in range(n_pav):
            shift = (k - (n_pav - 1) / 2.0) * 16.0
            ss = min(samples, key=lambda p: abs(p["z"] - (z_p + shift)))
            d = sand_distance(ss["x"], ss["z"])
            if not d:
                continue
            # sand_distance walks due west, which is the shoreline on this coast
            x = ss["x"] - (d - back)
            z = ss["z"]
            h = prop_height(x, z, ss["h"])
            if h is None or too_close(x, z):
                print("  pavilion skipped", round(x), round(z), h)
                continue
            yaw = face_yaw(ss["dx"], ss["dz"])
            bags[ss["chunk"]]["pavilions"].append((x, z, h, yaw, 1.0))
            placed.append((x, z, ss))
        for k in range(n_sh):
            if not placed:
                break
            x, z, ss = placed[min(k, len(placed) - 1)]
            hx = x + 4.2
            hz = z + (4 if k else -4)
            h = prop_height(hx, hz, ss["h"])
            if h is None:
                continue
            bags[ss["chunk"]]["showers"].append((hx, hz, h, 0.0, 1.0))
        print(f"  beach z {z_p}: pavilions {len(placed)}")

    # turtle boards on the dry sand, facing the boulevard
    acc = 0.0
    next_sign = 80.0
    for i, s in enumerate(samples):
        if i:
            acc += hypot(s["x"] - samples[i - 1]["x"], s["z"] - samples[i - 1]["z"])
        if acc < next_sign:
            continue
        dist = sand_distance(s["x"], s["z"])
        if not dist or not (20 <= dist <= 78):
            continue
        x = s["x"] - (dist - 10)
        z = s["z"]
        h = prop_height(x, z, s["h"])
        if h is None or too_close(x, z):
            continue
        # local +X toward the road (opposite of seaward)
        yaw = face_yaw(-s["wx"], -s["wz"])
        bags[s["chunk"]]["turtles"].append((x, z, h, yaw, 1.0))
        next_sign = acc + 220.0

    # stall paint on the lots the kits already pave, plus a curb pad where
    # the public access has no OSM lot against the boulevard
    for poly in parking:
        cz = centroid(poly)[1]
        bags[blvd_chunk(cz)]["stalls_polys"].append(poly)
    for z_pad, side in ((-3848, -1), (-2420, -1), (-1588, -1)):
        s = min(samples, key=lambda p: abs(p["z"] - z_pad))
        poly = curb_pad(s, side, 18.0, 9.0)
        ccx, ccz = centroid(poly)
        if any(hypot(ccx - centroid(p)[0], ccz - centroid(p)[1]) < 26 for p in parking):
            print("  pad skipped, lot nearby", round(ccx), round(ccz))
            continue
        if any(pip(x, z, q) for x, z in poly for q in parking):
            print("  pad overlaps lot", round(ccx), round(ccz))
            continue
        if prop_height(ccx, ccz, s["h"]) is None:
            print("  pad height skipped", round(ccx), round(ccz))
            continue
        bags[s["chunk"]]["pads"].append(poly)
        print("  pad", round(ccx), round(ccz))

    bus_png = sign_png("BUS", (252, 196, 32), (24, 24, 22))
    turtle_png = sign_png("TURTLE NESTING", (232, 186, 36), (36, 36, 28))

    def inst(g, mesh_i, items, ox, oz):
        if not items:
            return None
        tr, ro, sc = [], [], []
        for x, z, h, yaw, s in items:
            tr += [x - ox, h - height_at(ox, oz), z - oz]
            ro += list(yaw_quat(yaw))
            sc += [s, s, s]
        return g.add_inst(mesh_i, tr, ro, sc)

    for name, bag in bags.items():
        pts = bag["samples"]
        if len(pts) < 4:
            continue
        ox = sum(p["x"] for p in pts) / len(pts)
        oz = sum(p["z"] for p in pts) / len(pts)
        g = G()
        bark_m = g.color_mat("bark", (98, 74, 48))
        leaf_m = g.color_mat("palm", (42, 108, 56))
        grape_m = g.color_mat("grape", (96, 118, 90))
        post_m = g.color_mat("post", (138, 140, 142))
        roof_m = g.color_mat("roof", (32, 102, 168))
        wood_m = g.color_mat("wood", (142, 108, 70))
        canvas_m = g.color_mat("canvas", (232, 226, 208))
        metal_m = g.color_mat("metal", (170, 174, 176))
        pad_m = g.color_mat("spad", (176, 170, 156))
        line_m = g.color_mat("line", (242, 242, 236))
        bike_m = g.color_mat("bike", (186, 58, 46))
        lot_m = g.color_mat("lot", (168, 166, 160), 0.9)
        stall_m = g.color_mat("stalls", (236, 234, 228))
        bus_m = g.tex_mat("bus", bus_png, False)
        turt_m = g.tex_mat("turtle", turtle_png, False)

        nodes_hi, nodes_lo = [], []
        for lod, bucket in ((0, nodes_hi), (1, nodes_lo)):
            trunk, frond = build_palm(lod)
            tm = g.add_mesh(f"{name}_ptr{lod}", [(trunk.p, trunk.n, trunk.u, trunk.i, bark_m)])
            fm = g.add_mesh(f"{name}_pfr{lod}", [(frond.p, frond.n, frond.u, frond.i, leaf_m)])
            grape = build_grape(lod)
            gm = g.add_mesh(f"{name}_grp{lod}", [(grape.p, grape.n, grape.u, grape.i, grape_m)])
            sp, sr = build_shelter()
            sm = g.add_mesh(f"{name}_sht{lod}", [(sp.p, sp.n, sp.u, sp.i, post_m)])
            rm = g.add_mesh(f"{name}_srf{lod}", [(sr.p, sr.n, sr.u, sr.i, roof_m)])
            pp, pr = build_pavilion()
            pm = g.add_mesh(f"{name}_pvp{lod}", [(pp.p, pp.n, pp.u, pp.i, wood_m)])
            qm = g.add_mesh(f"{name}_pvr{lod}", [(pr.p, pr.n, pr.u, pr.i, canvas_m)])
            for mesh_i, items in (
                (tm, bag["palms"]), (fm, bag["palms"]), (gm, bag["grapes"]),
                (sm, bag["shelters"]), (rm, bag["shelters"]),
                (pm, bag["pavilions"]), (qm, bag["pavilions"]),
            ):
                n = inst(g, mesh_i, items, ox, oz)
                if n is not None:
                    bucket.append(n)
            if lod == 0:
                board = build_bus_board()
                bm = g.add_mesh(name + "_bus", [(board.p, board.n, board.u, board.i, bus_m)])
                shpad, shmet = build_shower()
                hm = g.add_mesh(name + "_shw", [(shpad.p, shpad.n, shpad.u, shpad.i, pad_m)])
                mm = g.add_mesh(name + "_shm", [(shmet.p, shmet.n, shmet.u, shmet.i, metal_m)])
                tpost, tboard = build_turtle_sign()
                tpm = g.add_mesh(name + "_tpo", [(tpost.p, tpost.n, tpost.u, tpost.i, wood_m)])
                tbm = g.add_mesh(name + "_tbo", [(tboard.p, tboard.n, tboard.u, tboard.i, turt_m)])
                for mesh_i, items in (
                    (bm, bag["shelters"]), (hm, bag["showers"]), (mm, bag["showers"]),
                    (tpm, bag["turtles"]), (tbm, bag["turtles"]),
                ):
                    n = inst(g, mesh_i, items, ox, oz)
                    if n is not None:
                        bucket.append(n)

        lines, dashes, bike = M(), M(), M()
        for i in range(len(pts) - 1):
            a, b = pts[i], pts[i + 1]
            if hypot(b["x"] - a["x"], b["z"] - a["z"]) > 18:
                continue
            for side in (1, -1):
                ribbon(lines, [
                    (a["x"] + a["wx"] * side * (a["w"] * 0.5 - 0.5), a["z"] + a["wz"] * side * (a["w"] * 0.5 - 0.5)),
                    (b["x"] + b["wx"] * side * (b["w"] * 0.5 - 0.5), b["z"] + b["wz"] * side * (b["w"] * 0.5 - 0.5)),
                ], 0.12, 0.16, ox, oz, [a["h"], b["h"]])
            ribbon(bike, [
                (a["x"] + a["wx"] * (a["w"] * 0.5 + 4.8), a["z"] + a["wz"] * (a["w"] * 0.5 + 4.8)),
                (b["x"] + b["wx"] * (b["w"] * 0.5 + 4.8), b["z"] + b["wz"] * (b["w"] * 0.5 + 4.8)),
            ], 1.6, 0.11, ox, oz, [a["h"], b["h"]])
        # dashed centre: 3 m paint, 6 m gap, measured along the samples
        dist = 0.0
        for i in range(len(pts) - 1):
            a, b = pts[i], pts[i + 1]
            step = hypot(b["x"] - a["x"], b["z"] - a["z"])
            if step > 18:
                dist = 0.0
                continue
            if (dist % 9.0) < 3.0:
                ribbon(dashes, [(a["x"], a["z"]), (b["x"], b["z"])], 0.12, 0.17, ox, oz, [a["h"], b["h"]])
            dist += step

        stalls = M()
        lots = M()
        nstall = 0
        for poly in bag["stalls_polys"]:
            nstall += stall_stripes(stalls, poly, ox, oz)
        for poly in bag["pads"]:
            fan(lots, poly, 0.07, ox, oz)
            nstall += stall_stripes(stalls, poly, ox, oz, 0.16)

        gnode = []
        def add_ground(mesh, mat, tag):
            if mesh.empty():
                return
            mi = g.add_mesh(name + tag, [(mesh.p, mesh.n, mesh.u, mesh.i, mat)])
            g.nodes.append({"mesh": mi})
            gnode.append(len(g.nodes) - 1)
        add_ground(lines, line_m, "_line")
        add_ground(dashes, line_m, "_dash")
        add_ground(bike, bike_m, "_bike")
        add_ground(lots, lot_m, "_lot")
        add_ground(stalls, stall_m, "_stall")
        # lod1 keeps the cycle track (the big read) and drops the fine paint
        bike_node = gnode[2] if len(gnode) > 2 and not bike.empty() else None
        nodes_hi = nodes_hi + gnode
        if bike_node is not None:
            nodes_lo = nodes_lo + [bike_node]
        g.nodes.append({"name": name + "_lod0", "children": nodes_hi})
        hi_i = len(g.nodes) - 1
        g.nodes.append({"name": name + "_lod1", "children": nodes_lo})
        lo_i = len(g.nodes) - 1
        data = g.pack([hi_i, lo_i])
        open(os.path.join(HERO, name + ".glb"), "wb").write(data)
        tris = {
            name + "_lod0": len(bag["palms"]) * 28 + len(bag["grapes"]) * 40 + len(bag["shelters"]) * 36
            + len(bag["pavilions"]) * 28 + len(lines.i) // 3 + len(dashes.i) // 3 + len(bike.i) // 3
            + nstall * 2,
            name + "_lod1": len(bag["palms"]) * 14 + len(bag["grapes"]) * 20 + len(bag["shelters"]) * 20
            + len(bag["pavilions"]) * 16 + len(bike.i) // 3,
        }
        entry = {
            "id": name, "k": name,
            "name": "J.E. Irausquin boulevard",
            "status": "eagle-blvd",
            "x": round(ox, 2), "z": round(oz, 2), "y": 0, "rotation": 0,
            "glb": f"models/hero/{name}.glb",
            "lod": {"hi": name + "_lod0", "lo": name + "_lod1", "switch_m": 640},
            "tris": tris, "textures": 2, "hide_footprint": [], "hide": [],
            "sign": False, "kind": "replace", "new_place": False,
            "geo_source": "OSM J.E. Irausquin centreline and amenity=parking polygons",
            "ref_sources": (
                "Boulevard matched to street level along J.E. Irausquin: white edge lines and a "
                "dashed centre line, a red cycle track on the beach side outside the sidewalk, "
                "blue-roofed bus shelters at the public stretches, royal palms and sea grape on "
                "the verge, stall paint on the existing lots, open canvas pavilions and showers "
                "at Eagle Beach plus a lighter set toward Manchebo and Druif, and yellow "
                "turtle-nesting boards on the sand. The class-3 road shader already fades a dash "
                "into the asphalt; these ribbons sit just above it. Overpass was not reachable, "
                "so the shelters sit at the public accesses rather than on a fresh bus_stop extract. "
                "Geometry and the sign textures are original."
            ),
            "frame": "glb origin = chunk centroid on J.E. Irausquin; generated by landmarks/eagle_strip.py blvd",
            "cat": "landmark",
        }
        manifest = [e for e in manifest if e.get("id") != name]
        manifest.append(entry)
        print(f"  {name} palms {len(bag['palms'])} grape {len(bag['grapes'])} stops {len(bag['shelters'])} "
              f"pav {len(bag['pavilions'])} shower {len(bag['showers'])} turtle {len(bag['turtles'])} "
              f"stalls {nstall} pads {len(bag['pads'])} {os.path.getsize(os.path.join(HERO, name + '.glb')) // 1024}kb")

    open(MANIFEST, "w").write(json.dumps(manifest, indent=1))
    print("manifest", len(manifest))

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "blvd":
        blvd()
    else:
        main()
