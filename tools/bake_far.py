# Bake island-wide building massing for the far HLOD layer (addons/src/farCity.ts).
# One record per OSM building: oriented bounding box (min-area rect) + height + kind/roof + region id.
# Output: game/data/far/massing.bin  (little endian)
#   header: u32 magic 'AWF1', u32 count
#   per building (14 B): i16 cx, i16 cz (0.5 m), i16 hx, i16 hz (half-axis-1 vector, 0.05 m), u8 w1 (half width along perpendicular, 0.25 m),
#                        u8 h (0.25 m), u8 kind|roof<<4, u8 seed, u16 region (rx*32+rz)
import json, glob, math, os, struct, re
src = os.path.join(os.path.dirname(__file__), '../game/data/real')
out = os.path.join(os.path.dirname(__file__), '../game/data/far'); os.makedirs(out, exist_ok=True)
KIND = {'house': 0, 'com': 1, 'hotel': 2, 'apt': 3, 'ind': 4, 'small': 5, 'civic': 6}
ROOF = {'flat': 0, 'flat0': 0, 'hipped': 1, 'hip': 1, 'gabled': 2}
def hull(pts):
    pts = sorted(set(pts))
    if len(pts) < 3: return pts
    def cr(o, a, b): return (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0])
    lo, up = [], []
    for p in pts:
        while len(lo) >= 2 and cr(lo[-2], lo[-1], p) <= 0: lo.pop()
        lo.append(p)
    for p in reversed(pts):
        while len(up) >= 2 and cr(up[-2], up[-1], p) <= 0: up.pop()
        up.append(p)
    return lo[:-1] + up[:-1]
def obb(poly):
    H = hull([tuple(p) for p in poly]); best = None
    for i in range(len(H)):
        a, b = H[i], H[(i+1) % len(H)]; ex, ez = b[0]-a[0], b[1]-a[1]; L = math.hypot(ex, ez)
        if L < 1e-6: continue
        ux, uz = ex/L, ez/L; vx, vz = -uz, ux
        us = [p[0]*ux + p[1]*uz for p in H]; vs = [p[0]*vx + p[1]*vz for p in H]
        area = (max(us)-min(us)) * (max(vs)-min(vs))
        if best is None or area < best[0]: best = (area, ux, uz, min(us), max(us), min(vs), max(vs))
    if not best: return None
    _, ux, uz, u0, u1, v0, v1 = best
    cu, cv = (u0+u1)/2, (v0+v1)/2
    cx, cz = cu*ux + cv*(-uz), cu*uz + cv*ux
    return cx, cz, ux*(u1-u0)/2, uz*(u1-u0)/2, (v1-v0)/2
recs = []
for f in sorted(glob.glob(os.path.join(src, 'r_*.json'))):
    m = re.search(r'r_(\d+)_(\d+)\.json$', f); rx, rz = int(m.group(1)), int(m.group(2))
    for b in json.load(open(f)).get('b', []):
        p = b.get('p')
        if not p or len(p) < 3: continue
        o = obb(p)
        if not o: continue
        cx, cz, hx, hz, w1 = o
        if math.hypot(hx, hz) < 1.2 or w1 < 1.2: continue
        h = max(2.6, min(63, b.get('h') or 4))
        recs.append(struct.pack('<hhhhBBBBH', round(cx*2), round(cz*2), round(hx*20), round(hz*20), min(255, round(w1*4)),
            round(h*4), KIND.get(b.get('k'), 0) | (ROOF.get(b.get('r'), 0) << 4), (b.get('i') or 0) & 255, rx*32+rz))
with open(os.path.join(out, 'massing.bin'), 'wb') as fo:
    fo.write(b'AWF1' + struct.pack('<I', len(recs))); fo.write(b''.join(recs))
print(len(recs), 'buildings', os.path.getsize(os.path.join(out, 'massing.bin')), 'bytes')
