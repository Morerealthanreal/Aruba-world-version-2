# Reference photo library

Real-world reference photos for modelling Aruba World, organized as

    refs/places/<area>/<place>/<photo>.jpg
    refs/places/<area>/<place>/index.json

Areas: `palm-eagle-beach`, `noord`, `oranjestad`, `interior` (Arikok, Santa Cruz, Paradera...), `san-nicolas`, `_vehicles` (non-place refs such as emergency liveries).
Place folders use lowercase-kebab names (`california-lighthouse`, `santa-anna-church`).

## Rules
- JPEG only, **< 300 KB each**, longest side ≤ 1280 px.
- One photo, one entry in that folder's `index.json`. No duplicates (the seed script dedupes by perceptual hash).
- Record source and license. Mapillary images are CC BY-SA 4.0 (credit the uploader). Web photos marked `unknown - reference only` are for internal modelling reference only: never ship them in the game build.

## index.json schema
See `index.schema.json`. Each folder:
```json
{ "place": "california-lighthouse", "area": "noord",
  "photos": [ { "file": "lh_0.jpg", "source_url": "https://www.mapillary.com/app/?pKey=...",
    "license": "CC BY-SA 4.0 (Mapillary)", "credit": "Mapillary / user",
    "lat": 12.6139, "lon": -70.0512, "heading": 35.1, "date": "2024-01-06",
    "shows": "what the photo shows" } ] }
```
`heading` = camera compass bearing in degrees (0 = north). Unknown fields are `null`.
`original_path` notes where the seed copy came from on the build box.

## Seeding
`tools/build_refs_library.py` collected the box's existing refs (`/workspace/landmarks/{mly,ref,refs}`, `/tmp/refs`). Lat/lon for Mapillary shots are converted back from game coordinates (≈ metre accuracy). Street sweeps (`mly/sv_*`, ~700 frames) and contact sheets were left out on purpose.
