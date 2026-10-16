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

## Batch 2 — PR #31, not in this branch

Queued for shipping on `cursor/accuracy-churches-caves-8f38`. Not edited here, and not present on this branch: Hooiberg raised to 165 m with the stairs reseated, Santa Cruz / Savaneta / Seroe Colorado churches, Fontein, Quadirikiri, Natural Pool, and the owned-highway centre dashes.

## Batch 3 — done in this change

1. **Nicolaas Store, San Nicolas Main Street.** Main Street is B. van der Veen Zeppenfeldstraat. The store is the yellow two-storey corner from the Commons photo: white cornice and pilasters, pink-red hip roof, brown upper windows, `NICOLAAS STORE` on the street face, and the turquoise one-storey neighbour. `sn_*` murals, including the Alankar facade next door, were not edited.
2. **Charlie's block.** Charlie's Bar is unchanged. The OSM shop lots immediately west (Giordano, Collexion, Dragon, Chong's) and east (Laura's, Union Caribe, Chica Cafe) that are not in the `sn_murals` hide list are now one-storey pastel fronts with awnings. The mural lots stay with their owner.
3. **Refinery skyline.** Columns, a tall stack with a dark cap and a flare, and three white tanks sit on the OSM chimney cluster east of town (origin 8000, 10600) so the skyline loads from San Nicolas and from the Rodgers Beach road. It does not replace `sn_solarpark`.
4. **Baby Beach and Rodgers Beach.** Thatch palapas (and a few pale rocks) on the sand east of Rum Reef, clear of Rum Reef, Big Mama, Secrets and the lettered wall. Rodgers Beach has palapas on the land side of the lagoon and three small fishing boats pulled up on the sand, at the same height as the beach so they do not hang over the lagoon. Those existing beach heroes were not replaced.
5. **Cunucu houses.** One street-facing house on the main road of Paradera, Piedra Plat, Tanki Leendert, Sabana Basora and Pos Chiquito: coloured walls, red or orange hip roof, porch, low fence with white caps. The Tanki house has a cactus row. This is a sample of the driver's view, not a replacement for every lot. San Nicolas keeps its existing house kit.
6. **Balashi brewery.** Same origin and footprint. White hall, blue fascia, `BALASHI` sign toward the road, fermenters, beer-garden canopy. The fence, roadside sign and comms tower heroes are unchanged.
7. **WEB Balashi.** `web_balashi_tanks` was already a tank farm (about 3,000 triangles) and was left in place. A roadside gate on the Balashi W.E.B. road reads `W.E.B. BALASHI`.
8. **Highway sidewalks and curbs.** `sw=1` on 169 owned class 3+ segments at least 6.5 m wide that are not underground and not roundabout aprons, outside Noord, Palm/Eagle and the hotel strip. Town streets that already had sidewalks were left as they were. On Watty Vos the built road shows the curb as a dark edge beside the white line. The paver strip is close in colour to the sand shoulder.

## Owned, still open

1. **Museum of Industry water tower** (`museumindustry`, OSM 7004) already has a model. Its shape was not rechecked from the road in this pass.
2. **Terminal height.** Airside wall in the photos is two storeys. `airport_fx` tops out near 6 m. Rescaling it would distort the jet bridges and aircraft, so it was left.
3. **Rest of Main Street and the inland towns.** Only Nicolaas plus the Charlie's block, and one cunucu house per inland town, were built. Most other lots are still generic masses or the San Nicolas house kit.
4. **Refinery up close.** The skyline reads at a distance. Individual pipe racks and the harbour were not modelled.
5. **Open Arikok highway.** Wide owned class-3 segments through the park got the same curb flag as the town approaches. A desert stretch may want a shoulder rather than a town sidewalk; check from the driver's seat and narrow it if it looks wrong.

## Off limits — for their owners

- **Noord.** Shop positions along the r40 strip were timing estimates. The Digicel tank and Palm Court / Bon Bini placements are unverified.
- **Palm Beach and Eagle Beach / Manchebo.** Hotel heroes and the low-rise strip exist. Pools and palapas were added earlier. Not rechecked this pass.
- **Downtown Oranjestad.** The Penha row was built earlier. Many side streets still have no facing street-level reference.
- **California lighthouse / Faro Blanco** and **Tierra del Sol.** Not inspected.
- **San Nicolas murals.** PR #15. Several `sn_*` entries are marked approximate. Do not edit.
- **Pedestrians, the motorcycle, audio, engine and performance code.** Out of scope.
