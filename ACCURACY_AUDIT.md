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

## Inland churches — done in this change

1. **Church of Holy Mary, Santa Cruz** (OSM way 297003468). New hero at the parish footprint. White walls, blue plinth and trim, blue cross, red tile tower cap. The neighbouring fast-food heroes are left in place. Floor is pinned to the detailed ground (34.76 m).
2. **Sagrado Curason, Savaneta** (OSM way 376320397). Peach walls, maroon stripes and window hoods, red roof, square tower, white cross. This is the church, not the Colegio Sagrado Curazon campus hero about 90 m north. Floor pinned at 8.91 m.
3. **Seroe Colorado Community Church** (OSM way 97566669). White walls, steep red gables, stone buttresses, round window, and the small sunday-school chapel. Floor pinned at 20.66 m.

## Owned, still wrong (next batches)

1. **Hooiberg.** Peak in the terrain is about 144 m; the real hill is about 165 m. Do not lift the DEM until the staircase is retied: `hooiberg_steps` is a fixed mesh whose origin sits on the summit height, so a taller peak floats the whole stair. Step colour (green in the model) is still unverified. Summit shed and mast can stay.
2. **Fontein, Quadirikiri, Conchi / Natural Pool** are pins and terrain only. No cave mouths or rock bowls.
3. **San Nicolas town, non-mural.** The bar row just east of Charlie's on B. van der Veen Zeppenfeldstraat (Nano's, Shirley's, Hoolo, Bongo Bar, and the two lots between Nano's and Shirley's) is now painted one- and two-storey shopfronts with awnings (`snmain_bars`). Charlie's, Fan Bar, Nicolaas Store, and the `sn_*` mural set were not edited. The rest of Main Street west of Charlie's, and most side streets, are still generic massing.

## Water tower — done in this change

**Museum of Industry, San Nicolas** (OSM 7004), same origin and node names. From Bernhardstraat the old hero was a low white hall. It is now the yellow cylinder from the Commons photo: tan ribs, dark cap, a small clock on the north face, a blue glass drum on the street side, and a low yellow wing with `MUSEUM OF INDUSTRY`. The shaft is about 36 m so it reads against the one-storey town. The mural set was not edited.
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
