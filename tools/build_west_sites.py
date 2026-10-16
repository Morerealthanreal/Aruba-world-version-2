#!/usr/bin/env python3
"""Notes for game/data/real/west_sites.json.

The JSON is the bake the addon drapes. It came from OpenStreetMap (ODbL),
projected with origin latitude 12.52, longitude -69.97.

Ways:
  43109642  Casibari Rock Formation
  962901284 path along the south edge of the formation
  339090140 Andicuri Beach
  455539001 Daimari beach (natural=beach)
  451803770 Boca Prins sand dunes

A cobble ribbon joins that path to one stair flight inside the formation.
OSM has no steps there. The flight sits north of the Casibari entrance hero
so the Mi Dushi sign is left alone. Sint Anna Kerk (santaanna_kerk) and
De Olde Molen (oldemolen) already exist as heroes and are not in this file.
Dune mounds are inside way 451803770, clear of the Boca Prins restaurant hero.
"""
import json
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
JSON = ROOT / "game" / "data" / "real" / "west_sites.json"


def main() -> int:
    doc = json.loads(JSON.read_text())
    print(f"sand quads {len(doc['sand'])}")
    print(f"props {len(doc['props'])}")
    print(f"stairs {doc['stairs']}")
    print(f"anchors {len(doc['anchors'])} clear rings {len(doc['clear'])}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
