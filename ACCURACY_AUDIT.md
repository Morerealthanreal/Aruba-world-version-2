# Aruba World accuracy audit

Prioritised from the driver's seat: most-used roads and famous landmarks first. Owned areas are Savaneta, Pos Chiquito, Santa Cruz, Paradera, Piedra Plat, Tanki Leendert, Sabana Basora, Hooiberg, Arikok (Fontein, Quadirikiri, Natural Pool), Seroe Colorado, San Nicolas town (not the murals), Queen Beatrix Airport, and Route 1 / the Sasaki road / Watty Vos Boulevard. Off-limits items are listed for their owners and were not edited.

References are visual guides only. Nothing below is a pasted photo.

## Batch 1 — done in this change

1. **Misa Santa Filomena, Paradera** (OSM way 170899528). Was a generic mass. Now a marigold church: brown plinth, white trim, red-brown gable roof, red door, louvered tower and white cross on the south end of the west front, side chapel, one palm. The tower reads from the road. A neighbouring volume still sits in front of part of the nave from the west; the church's own footprint is in the hide list.
2. **Queen Beatrix terminal colour.** `airport_fx` geometry (gates, bridges, aircraft) is unchanged. The shell is warm sand instead of cool grey, and `apt_tealroof` adds the turquoise airside cap in that model's own frame.
3. **Control tower** (OSM way 97597616). New yellow shaft, orange band, dark cab, yellow mullions, mast. It stands at the north-east end of the terminal and clears the roof. The terminal model is still about 6 m tall against a real two-storey airside wall; the tower is scaled to that model, not to a corrected terminal.
4. **Charlie's Bar, San Nicolas** (OSM way 369622877). Same origin and footprint. Two storeys, dark-brown dado, cream walls, red/white awnings, `CHARLIE'S BAR` on the north front (Zeppenfeldstraat), simple coloured fish on the side street. Not a copy of the mural.
5. **Zeerovers, Savaneta** (OSM way 639821170). Same origin and footprint. Open roof, posts, picnic tables, blue `ZEEROVERS` sign toward the road. Neighbouring beach buildings still crowd the road approach.
6. **Arikok visitor centre** (OSM way 169938948). Same origin and footprint. The old high LOD used an uncoloured white wall. Walls are now stone, with a dark plinth, a deep eave, and a sign reading `PARKE NACIONAL ARIKOK`.

## Batch 2 — this change

1. **Hooiberg height.** The summit sample was about 144 m. A raised cosine of +20.73 m, radius 200 m, brings the peak sample to 165 m and dies before the village and before the bottom of the stairs. Blue (urban) channel kept. `hooiberg_summit` still has `y: 0`, so it sits on the new ground. The stair mesh was retied first, then seated so the green tread tops stay about 0.22 m above the new slope. Path and green paint kept (dashcam note; the 2013 cone photo does not show the step colour).
2. **Church of Holy Mary, Santa Cruz** (OSM way 297003468). White walls, blue plinth and trim, blue gable cross, square tower with vertical blue grooves and a red tile cap, wood doors, stone steps. The tower is on the road-facing corner. Ground photo: Commons “Church of Holy Mary (Aruba)”, 2021.
3. **Sagrado Curason, Savaneta** (OSM way 376320397). Peach walls, maroon stripes and pointed window hoods, red gable roof, square tower, white cross, one palm with a whitewashed base. Ground photos: Commons “Church of the Holy Heart (Aruba)”, 2017. The historical RCE chapel is the older building; this is the standing church.
4. **Seroe Colorado Community Church** (OSM way 97566669). White walls, steep red gables, stone buttresses, round window, side chapel, columnar cacti. Modelled as the standing 1939 church. Ground photos: Commons “Community Church Seroe Colorado”, 2018.
5. **Fontein Cave** (OSM node 540167863). Dark limestone cliff, one gated mouth, facing the road. Ground photo: Commons “Limestone cliffs near Fontein Cave”.
6. **Quadirikiri Cave** (OSM node 540982491, spelled Guadirikiri there). Two mouths and two roof openings in a dark cliff. The available ground photo is the interior looking out; the exterior is a reconstruction, not a texture.
7. **Conchi / Natural Pool** (OSM way 796907733). Dark rock rim around the existing water polygon, lower on the ocean side, plus a turquoise disc because the engine water sits at sea level and the DEM here is under a metre. Ground photo: Commons “Aruba-Natural-Pool-2013”.
8. **Owned highway lane dashes.** The road shader already paints edge lines on class 2+ and a centre dash on two-way roads. Wide one-way carriageways (class ≥ 3, width 6.5–12 m) had no lane line. White dashes, 3.2 m long on a 9 m period, were added along about 17 km of the south highway and the airport end of Watty Vos Boulevard (`-5600 < x < -4000`, `-300 < z < 2000`). Roundabout aprons skipped. The named Sasakiweg, the Sasaki fuel stop, and the Sasaki station are in Noord and were not edited. L.G. Smith Boulevard through Noord, Palm Beach and Oranjestad was not edited. The hotel-strip end of Watty Vos was not edited.

## Owned, still wrong (next batches)

1. **San Nicolas town, non-mural.** Main street is still generic massing plus brand boxes. The Museum of Industry water tower shape is unverified. Do not touch the `sn_*` mural set (PR #15), including `sn_pinkchurch` until its owner confirms it is not part of that set.
2. **Paradera, Piedra Plat, Tanki Leendert, Sabana Basora, Pos Chiquito** residential fabric is generic OSM massing. San Nicolas has the house kit; these towns do not.
3. **Balashi brewery** is a small box. The tank models nearby are a separate hero.
4. **Sidewalks, curbs and roundabout aprons** on the owned highways were not rebuilt. Two-way town streets in Savaneta, Santa Cruz and Pos Chiquito already get edge lines and a centre dash from the shader.
5. **Terminal height.** Airside wall in the photos is two storeys. `airport_fx` tops out near 6 m. Rescaling it would distort the jet bridges and aircraft, so it was left.
6. **Hooiberg stair colour** is still the dashcam green. A close ground photo of the treads was not found.

## Off limits — for their owners

- **Noord.** Shop positions along the r40 strip were timing estimates. The Digicel tank and Palm Court / Bon Bini placements are unverified.
- **Palm Beach and Eagle Beach / Manchebo.** Hotel heroes and the low-rise strip exist. Pools and palapas were added earlier. Not rechecked this pass.
- **Downtown Oranjestad.** The Penha row was built earlier. Many side streets still have no facing street-level reference.
- **California lighthouse / Faro Blanco** and **Tierra del Sol.** Not inspected.
- **San Nicolas murals.** PR #15. Several `sn_*` entries are marked approximate. Do not edit.
- **Pedestrians, the motorcycle, audio, engine and performance code.** Out of scope.
