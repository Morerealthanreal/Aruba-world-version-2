#!/usr/bin/env python3
"""Bake Tierra del Sol golf layout from OSM into game/data/real/tds_golf.json.

Positions come from OSM (leisure=golf_course, golf=fairway/green/tee/bunker/cartpath,
natural=water inside the course, the clubhouse buildings and pool). Fairway polygons
exist for only part of the 18 holes; the rest are ribbons offset from the mapped
cart paths toward the mapped greens and bunkers, clipped to the course and kept off
the California Lighthouse / Faro Blanco lot. Aerial imagery is not sampled.
"""
import json, math, os
from shapely.geometry import LineString, Polygon, Point
from shapely.ops import unary_union
from shapely.validation import make_valid

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAT0, LON0 = 12.52, -69.97
MX = 111320 * math.cos(math.radians(LAT0))
MZ = 110540

# California Lighthouse grounds and Faro Blanco. Greens sit ~150 m inland; this
# only clips generated turf so the lot itself stays the existing sandy yard.
EXCLUSIONS = [
    ((-8875.2, -10343.45), 100),
    ((-8911.92, -10321.48), 55),
    ((-8862.0, -10382.0), 40),
]
CLUB_IDS = {252415572, 629608207, 252415573}
POOL_ID = 261489382


def xz(lat, lon):
    return ((lon - LON0) * MX, (LAT0 - lat) * MZ)


def way_pts(e):
    return [xz(p["lat"], p["lon"]) for p in e["geometry"]]


def as_polys(g):
    if g.is_empty:
        return []
    if g.geom_type == "Polygon":
        return [g]
    if g.geom_type == "MultiPolygon":
        return list(g.geoms)
    if g.geom_type == "GeometryCollection":
        return [x for x in g.geoms if x.geom_type == "Polygon"]
    return []


def ring(coords):
    return [[round(x, 1), round(y, 1)] for x, y in coords]


def dump(g, min_area=12):
    out = []
    for p in as_polys(g):
        if p.area < min_area:
            continue
        out.append({
            "o": ring(p.exterior.coords),
            "h": [ring(h.coords) for h in p.interiors if Polygon(h).area > 8],
        })
    return out


def load():
    osm = json.load(open("/tmp/tds/osm.json"))
    extra = json.load(open("/tmp/tds/extra.json"))
    feats = {k: [] for k in ("fairway", "green", "tee", "bunker", "cartpath")}
    for e in osm["elements"]:
        t = e.get("tags") or {}
        k = t.get("golf")
        if k not in feats or not e.get("geometry"):
            continue
        pts = way_pts(e)
        if k == "cartpath" and len(pts) >= 2:
            feats[k].append(pts)
        elif len(pts) >= 3:
            feats[k].append(pts)
    rel = next(e for e in osm["elements"] if e["type"] == "relation" and (e.get("tags") or {}).get("name") == "Tierra del Sol Golf Course")
    rings = [[xz(p["lat"], p["lon"]) for p in m["geometry"]] for m in rel["members"]]
    course = stitch(rings)
    return feats, course, extra


def stitch(rings):
    ring = rings[0][:]
    other = rings[1][:]

    def gap(a, b):
        return math.hypot(a[-1][0] - b[0][0], a[-1][1] - b[0][1])

    if gap(ring, other[::-1]) < gap(ring, other):
        other = other[::-1]
    if gap(ring, other) < 3:
        ring.extend(other[1:])
    else:
        ring.extend(other)
    if math.hypot(ring[0][0] - ring[-1][0], ring[0][1] - ring[-1][1]) < 3:
        ring = ring[:-1]
    return make_valid(Polygon(ring))


def to_poly(pts):
    p = Polygon(pts)
    if not p.is_valid:
        p = make_valid(p)
    return p


def main():
    feats, course, extra = load()
    ex = unary_union([Point(x, z).buffer(r) for (x, z), r in EXCLUSIONS])
    fair_polys = []
    for pts in feats["fairway"]:
        p = to_poly(pts)
        fair_polys.extend([g for g in as_polys(p) if g.area > 20])
    fair = unary_union(fair_polys) if fair_polys else Polygon()
    greens = [g for pts in feats["green"] for g in as_polys(to_poly(pts)) if g.area > 15]
    bunkers = [g for pts in feats["bunker"] for g in as_polys(to_poly(pts)) if g.area > 6]
    tees = [g for pts in feats["tee"] for g in as_polys(to_poly(pts)) if g.area > 4]
    targets = [g.centroid for g in greens + bunkers]

    pieces = []
    for pts in feats["cartpath"]:
        line = LineString(pts)
        if line.length < 15:
            continue
        samples = []
        d = 0.0
        while d <= line.length:
            p = line.interpolate(d)
            p2 = line.interpolate(min(line.length, d + 4))
            dx, dz = p2.x - p.x, p2.y - p.y
            L = math.hypot(dx, dz) or 1.0
            nx, nz = -dz / L, dx / L
            left = right = 0.0
            best = 1e9
            for t in targets:
                vx, vz = t.x - p.x, t.y - p.y
                dist = math.hypot(vx, vz)
                if dist > 68 or dist < 1.5:
                    continue
                best = min(best, dist)
                w = 1.0 / dist
                if vx * nx + vz * nz >= 0:
                    left += w
                else:
                    right += w
            if best < 60 and max(left, right) > 0.025:
                sign = 1 if left >= right else -1
                off = min(16.0, max(9.0, best * 0.30))
                samples.append((p.x + sign * nx * off, p.y + sign * nz * off))
            d += 9.0
        if len(samples) >= 3:
            pieces.append(LineString(samples).buffer(18.5, cap_style=1, join_style=1))
    syn = unary_union(pieces) if pieces else Polygon()
    turf = unary_union([syn, fair]).intersection(course).difference(ex)
    turf = make_valid(turf).simplify(1.2, preserve_topology=True)

    waters = []
    for e in extra["elements"]:
        t = e.get("tags") or {}
        if t.get("natural") != "water" or not e.get("geometry"):
            continue
        p = to_poly(way_pts(e))
        inter = p.intersection(course).difference(ex)
        if inter.is_empty:
            continue
        if 200 < inter.area < 16000:
            waters.append(inter)
            print("water", e["id"], round(inter.area))
        else:
            print("water skip", e["id"], round(inter.area))
    water = make_valid(unary_union(waters)) if waters else Polygon()
    # keep sand and green on top of any overlapping turf
    if not water.is_empty:
        turf = make_valid(turf.difference(water.buffer(1.0)))

    club = []
    pool = None
    for e in extra["elements"]:
        if not e.get("geometry"):
            continue
        if e["id"] in CLUB_IDS:
            club.extend(as_polys(to_poly(way_pts(e))))
        if e["id"] == POOL_ID:
            pool = to_poly(way_pts(e))

    # palms: a cluster at the pool, plus one near most greens, away from the lighthouse lot
    palms = []
    if pool is not None:
        c = pool.centroid
        for i in range(8):
            a = i / 8 * math.tau
            palms.append([round(c.x + math.cos(a) * 16, 1), round(c.y + math.sin(a) * 11, 1)])
    for i, g in enumerate(greens):
        if i % 2:
            continue
        c = g.centroid
        if ex.contains(Point(c.x, c.y)) or Point(c.x, c.y).distance(ex) < 30:
            continue
        # sit just off the green, on the turf side
        palms.append([round(c.x + 14, 1), round(c.y - 8, 1)])
    flags = [[round(g.centroid.x, 1), round(g.centroid.y, 1)] for g in greens]

    data = {
        "name": "Tierra del Sol Golf Course",
        "source": "OSM relation 14139348 + golf=* ways (fairway/green/tee/bunker/cartpath); natural=water inside the course; clubhouse ways 252415572/629608207/252415573; pool 261489382",
        "fairways": dump(turf, 30),
        "greens": dump(unary_union(greens).intersection(course), 12) if greens else [],
        "tees": dump(unary_union(tees), 4) if tees else [],
        "bunkers": dump(unary_union(bunkers), 6) if bunkers else [],
        "water": dump(water, 40),
        "paths": [ring(pts) for pts in feats["cartpath"] if len(pts) >= 2],
        "club": [ring(p.exterior.coords) for p in club],
        "pool": ring(pool.exterior.coords) if pool is not None else [],
        "palms": palms,
        "flags": flags,
        "anchor": [round(course.centroid.x, 1), round(course.centroid.y, 1)],
    }
    out = os.path.join(ROOT, "game/data/real/tds_golf.json")
    json.dump(data, open(out, "w"), separators=(",", ":"))
    print("wrote", out, "bytes", os.path.getsize(out))
    print("fairway parts", len(data["fairways"]), "greens", len(data["greens"]), "tees", len(data["tees"]),
          "bunkers", len(data["bunkers"]), "water", len(data["water"]), "paths", len(data["paths"]),
          "palms", len(palms), "flags", len(flags), "turf_m2", round(turf.area))
    preview(course, turf, greens, bunkers, tees, water, feats["cartpath"])


def preview(course, turf, greens, bunkers, tees, water, paths):
    try:
        from PIL import Image, ImageDraw
    except ImportError:
        return
    src = "/tmp/tds/img/esri_course.jpg"
    if not os.path.exists(src):
        return
    im = Image.open(src).convert("RGBA")
    ov = Image.new("RGBA", im.size, (0, 0, 0, 0))
    dr = ImageDraw.Draw(ov)
    minlon, maxlat, maxlon, minlat = -70.052, 12.614, -70.032, 12.598
    W, H = im.size

    def ll(x, z):
        lon = LON0 + x / MX
        lat = LAT0 - z / MZ
        return ((lon - minlon) / (maxlon - minlon) * W, (maxlat - lat) / (maxlat - minlat) * H)

    def draw(g, fill):
        for p in as_polys(g):
            dr.polygon([ll(x, y) for x, y in p.exterior.coords], fill=fill)

    draw(turf, (46, 168, 62, 120))
    for g in greens:
        draw(g, (90, 240, 90, 190))
    for b in bunkers:
        draw(b, (255, 252, 245, 210))
    for t in tees:
        draw(t, (210, 220, 70, 200))
    if not water.is_empty:
        draw(water, (30, 130, 190, 180))
    for pts in paths:
        dr.line([ll(x, z) for x, z in pts], fill=(25, 25, 25, 230), width=1)
    out = Image.alpha_composite(im, ov).convert("RGB")
    dest = "/tmp/tds/img/preview.jpg"
    out.save(dest, quality=84)
    print("preview", dest)


if __name__ == "__main__":
    main()
