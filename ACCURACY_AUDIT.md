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

## Owned, still wrong (next batches)

1. **Hooiberg.** Peak in the terrain is about 144 m; the real hill is about 165 m. Do not lift the DEM until the staircase is retied: `hooiberg_steps` is a fixed mesh whose origin sits on the summit height, so a taller peak floats the whole stair. Step colour (green in the model) is still unverified. Summit shed and mast can stay.
2. **Santa Cruz parish church** and **Savaneta church** are not in the landmark list. The Santa Cruz fast-food strip and Savaneta shops exist; the churches do not.
3. **Seroe Colorado Community Church** is a pin with no building.
4. **Fontein, Quadirikiri, Conchi / Natural Pool** are pins and terrain only. No cave mouths or rock bowls.
5. **San Nicolas town, non-mural.** Main street is still generic massing plus brand boxes. The Museum of Industry water tower shape is unverified. Do not touch the `sn_*` mural set (PR #15), including `sn_pinkchurch` until its owner confirms it is not part of that set.
6. **Paradera, Piedra Plat, Tanki Leendert, Sabana Basora, Pos Chiquito** residential fabric is generic OSM massing. San Nicolas has the house kit; these towns do not.
7. **Balashi brewery** is a small box. The tank models nearby are a separate hero.
8. **Route 1, the Sasaki road, Watty Vos Boulevard.** Lane count, roundabout aprons, markings, sidewalks and curbs have not been checked from the driver's seat. `rb_monolith`, `rb_chevron` and the Sasaki station exist and were left as they are.
9. **Terminal height.** Airside wall in the photos is two storeys. `airport_fx` tops out near 6 m. Rescaling it would distort the jet bridges and aircraft, so it was left.

## Off limits — for their owners

- **Noord.** Shop positions along the r40 strip were timing estimates. The Digicel tank and Palm Court / Bon Bini placements are unverified.
- **Palm Beach and Eagle Beach / Manchebo.** Hotel heroes and the low-rise strip exist. Pools and palapas were added earlier. Not rechecked this pass.
- **Downtown Oranjestad.** The Penha row was built earlier. Many side streets still have no facing street-level reference.
- **California lighthouse / Faro Blanco** and **Tierra del Sol.** Not inspected.
- **San Nicolas murals.** PR #15. Several `sn_*` entries are marked approximate. Do not edit.
- **Pedestrians, the motorcycle, audio, engine and performance code.** Out of scope.
