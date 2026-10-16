#!/usr/bin/env python3
"""Bake Tierra del Sol resort footprints around the golf course.

Layout is OSM: building footprints and residential streets in a band around
course relation 14139348, plus the two private gates where Caya di Solo meets
the public road. The California Lighthouse lot and the Arashi coast are left
out. Visual reference (not textures): the Commons perimeter photo and the
cream-and-terracotta villa fronts.

Inputs (local extracts, not committed):
  /tmp/tds/way1.xml   OSM way 252415592
  /tmp/tds/way2.xml   OSM way 1060132666
  /tmp/tds/resort.json  Overpass buildings, highways, gates in the bbox
"""
import json, math, os, xml.etree.ElementTree as ET
from shapely.geometry import LineString, Point, Polygon, box
from shapely.ops import unary_union
from shapely.validation import make_valid

# Resort streets. Malmokweg and L.G. Smith stay the public roads.
STREETS = {
    "Caya Baranca", "Caya Di Biento", "Caya Di Oro", "Caya Di Sero", "Caya Mesa Bista",
    "Caya di Campeonan", "Caya di Solo", "Caya Bunita Bista", "Caya Bista Lamar", "Catalina",
}

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
LAT0, LON0 = 12.52, -69.97
MX = 111320 * math.cos(math.radians(LAT0))
MZ = 110540
CLUB = {252415572, 629608207, 252415573, 261489382}
# Lighthouse grounds, Faro Blanco, and the Arashi shore another agent owns.
EXCLUSIONS = [
    ((-8875.2, -10343.45), 180),
    ((-8911.92, -10321.48), 90),
    ((-8862.0, -10382.0), 60),
]
ARASHI = box(-12000, -12000, (-70.047 - LON0) * MX, (LAT0 - 12.609) * MZ)
GATES = [(12.6007282, -70.0421047), (12.6007226, -70.0419954)]


def xz(lat, lon):
    return ((lon - LON0) * MX, (LAT0 - lat) * MZ)


def way_ring(path):
    root = ET.parse(path).getroot()
    nodes = {n.get("id"): (float(n.get("lat")), float(n.get("lon"))) for n in root.findall("node")}
    way = root.find("way")
    return [xz(*nodes[nd.get("ref")]) for nd in way.findall("nd")]


def course_polygon():
    r1, r2 = way_ring("/tmp/tds/way1.xml"), way_ring("/tmp/tds/way2.xml")

    def d(a, b):
        return math.hypot(a[0] - b[0], a[1] - b[1])

    if d(r1[-1], r2[0]) < 1:
        ring = r1[:-1] + r2
    elif d(r1[-1], r2[-1]) < 1:
        ring = r1[:-1] + list(reversed(r2))
    elif d(r1[0], r2[0]) < 1:
        ring = list(reversed(r1))[:-1] + r2
    else:
        ring = list(reversed(r1))[:-1] + list(reversed(r2))
    return make_valid(Polygon(ring))


def rnd(p):
    return [round(p[0], 1), round(p[1], 1)]


def simplify_ring(poly):
    g = poly.simplify(1.1, preserve_topology=True)
    if g.geom_type != "Polygon":
        g = poly
    ring = list(g.exterior.coords)[:-1]
    if len(ring) > 8:
        step = math.ceil(len(ring) / 8)
        ring = ring[::step]
    if len(ring) < 3:
        return None
    return [rnd(p) for p in ring]


def main():
    course = course_polygon()
    res = json.load(open("/tmp/tds/resort.json"))
    gold = None
    for e in res["elements"]:
        if e["id"] == 378078106 and "geometry" in e:
            gold = make_valid(Polygon([xz(p["lat"], p["lon"]) for p in e["geometry"]]))
    streets = []
    for e in res["elements"]:
        t = e.get("tags", {})
        if t.get("name") in STREETS and t.get("highway") and "geometry" in e:
            streets.append(LineString([xz(p["lat"], p["lon"]) for p in e["geometry"]]))
    near = unary_union(streets).buffer(42).intersection(course.buffer(170))
    band = course.buffer(90).difference(course.buffer(-6))
    zone = unary_union([near, band])
    if gold is not None:
        zone = zone.difference(gold.buffer(8))
    for (x, z), r in EXCLUSIONS:
        zone = zone.difference(Point(x, z).buffer(r))
    zone = zone.difference(ARASHI)
    golf = json.load(open(os.path.join(ROOT, "game/data/real/tds_golf.json")))
    block = unary_union(
        [Polygon(p["o"]) for p in golf["fairways"] + golf["greens"] + golf["tees"] + golf["bunkers"] + golf["water"]]
        + [Polygon(r) for r in golf["club"]]
        + [Polygon(golf["pool"])]
    ).buffer(3)

    villas = []
    for e in res["elements"]:
        t = e.get("tags", {})
        if e["type"] != "way" or "building" not in t or "geometry" not in e or e["id"] in CLUB:
            continue
        pts = [xz(p["lat"], p["lon"]) for p in e["geometry"]]
        if len(pts) < 4:
            continue
        poly = make_valid(Polygon(pts))
        if poly.is_empty or poly.geom_type != "Polygon" or poly.area < 22 or poly.area > 900:
            continue
        rp = poly.representative_point()
        if not zone.contains(rp) or block.contains(rp):
            continue
        ring = simplify_ring(poly)
        if not ring:
            continue
        villas.append({"p": ring, "s": 2 if poly.area >= 300 else 1, "h": rnd((rp.x, rp.y))})

    roads = []
    road_zone = zone.buffer(14).difference(block)
    for e in res["elements"]:
        t = e.get("tags", {})
        if t.get("highway") not in ("residential", "service", "living_street", "unclassified") or "geometry" not in e:
            continue
        line = LineString([xz(p["lat"], p["lon"]) for p in e["geometry"]])
        part = line.intersection(road_zone)
        if part.is_empty:
            continue
        bits = [part] if part.geom_type == "LineString" else list(part.geoms) if part.geom_type == "MultiLineString" else []
        width = 3.6 if t["highway"] == "service" else 5.4
        for bit in bits:
            bit = bit.simplify(1.6)
            if bit.length < 14 or len(bit.coords) < 2:
                continue
            roads.append({"w": width, "p": [rnd(c) for c in bit.coords]})

    gpts = [xz(a, b) for a, b in GATES]
    mid = ((gpts[0][0] + gpts[1][0]) / 2, (gpts[0][1] + gpts[1][1]) / 2)
    dx, dz = gpts[1][0] - gpts[0][0], gpts[1][1] - gpts[0][1]
    L = math.hypot(dx, dz) or 1
    ax, az = dx / L, dz / L
    sx, sz = -az, ax
    cc = course.centroid
    if (cc.x - mid[0]) * sx + (cc.y - mid[1]) * sz < 0:
        sx, sz = -sx, -sz
    plants = []
    for i, x in enumerate((-11, -7.5, -3.5, 1.5, 6, 10.5)):
        plants.append({"k": "cactus", "x": round(mid[0] + ax * x + sx * -1.7, 1), "z": round(mid[1] + az * x + sz * -1.7, 1), "s": round(0.85 + (i % 3) * 0.18, 2), "yaw": round(i * 0.7, 2)})
    for i, (x, z, sc) in enumerate(((-6, 5.5, 1.15), (1.5, 7, 1.35), (8, 4.5, 1.05), (-2, 12, 1.2))):
        plants.append({"k": "palm", "x": round(mid[0] + ax * x + sx * z, 1), "z": round(mid[1] + az * x + sz * z, 1), "s": sc, "yaw": round(0.4 + i, 2)})

    anchor = [-7791.0, -9429.0]
    out = {
        "name": "Tierra del Sol resort",
        "source": "OSM buildings and residential roads in a band around relation 14139348; gates 2452452355 and 2452452403. Lighthouse and Arashi excluded.",
        "anchor": anchor,
        "villas": villas,
        "roads": roads,
        "gate": {"x": round(mid[0], 1), "z": round(mid[1], 1), "ax": round(ax, 4), "az": round(az, 4), "sx": round(sx, 4), "sz": round(sz, 4)},
        "plants": plants,
    }
    dest = os.path.join(ROOT, "game/data/real/tds_resort.json")
    with open(dest, "w") as f:
        json.dump(out, f, separators=(",", ":"))
    road_m = sum(LineString(r["p"]).length for r in roads)
    print(f"villas {len(villas)} two-story {sum(1 for v in villas if v['s']==2)} roads {len(roads)} {road_m:.0f}m plants {len(plants)}")
    print("gate", out["gate"])


if __name__ == "__main__":
    main()
