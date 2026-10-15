- 21:20 tram rails, marinasign, bigmama (replaces babybeach_fac) deployed

## r190 (Mapillary batch 3, downtown)
- ora_penharow: MAC (pink) / Crocs (blue, balcony) / Sole (pink) stepped-gable row north of Penha (OSM 3623/3622/3621 hidden). Verified vs Mapillary penha_0/3.
- hyatt_garden monument sign shrunk to ~0.95x1.3 m.
- Skipped: Kong Hing neighbour (unverifiable), yellow colonial neighbour (unidentified), "Aruba Car Wash" = actually AVANZA CAR WASH, gone on current aerial (radial plaza).

## Batch 4 (downtown rest) + r191 (Noord aerial checks)
- Downtown: Mapillary has only 13 photos along Caya Betico Croes, all at the Penha end (done r190). Archaeological Museum photos show only the old car-wash lot; Dollar Plus has 0 facing photos. No identity-verified edits possible -> no downtown changes.
- Noord Google-aerial checks: rb_anchor sits on a real roundabout (OK). rb_peachwall centre is a residential cul-de-sac bend, not a roundabout (wrong spot, true location unknown, left). pineapple_exp roadside, nothing identifiable (left). altovista_tank was in empty bush -> moved to OSM storage_tank way 335599536 (-5260,-5893), r 20 m, h 8 m, hides generic OSM 3322. Note: video hint said SE of chapel; this tank is ~850 m SW.

## r192 (Noord aerial checks 2)
- Tesco (-3440,-2711), NAPA (-6612,-3498), WEMA (-6660,-2325): each centred on a real commercial roof in Google aerial -> kept.
- White cross: aerial shows only scrub beside the Alto Vista road; cross too small to confirm -> unchanged.
- Peace Labyrinth: was 110 m off in bush. Moved to (-4408,-6202.5) from labyrinthlocator GPS 12.576112,-70.010569 + wiki, rings clearly visible on aerial behind chapel lot; resized to 60 ft (r 9.3).
- Next by score: Amsterdam Manor lions (0 facing Mapillary photos, spot unknown), retaining-wall roundabout, Palm Court sign, Arashi walls: all lack a location -> blocked.

## r193 (footprint/location checks, score 4-5)
- Google aerial: hardrock_pb on South Beach Centre plaza OK; rb_divisculpt, rb_tubes, rb_welkom, rb_monolith each centred on a real roundabout (sculpture identity not visible from above) -> kept.
- digicel_tank: no round tank within ~100 m on aerial (warehouse roof there; game has open lot). Nearest OSM tank (-8038,-299) is a plain white fuel tank per Mapillary 2024 -> not it. Location still unverified, left.
- BUG FIX gen.mjs cylinder(): side quads + top cap were wound inward, so single-sided materials (tank) looked open/hollow from above. Fixed winding; rebuilt altovista_tank, digicel_tank, jab_tank only. Other GLBs with cyl on non-double-sided mats pick up the fix on their next rebuild (backup gen.mjs.bak5).

## r194
- Spaans Lagoen bridge: r5 11:16-11:25 frames show we DRIVE ACROSS it (catalog "over the highway" was a misdescription); end-on it reads as an A-frame. VINCI/Freyssinet: two inclined steel arches, 4 transverse beams, 16 hangers, 92 m x 16 m deck. Rebuilt as twin arches leaning from deck edges (u=+-7.6) to +-1.2 at a 26 m crown, paired hangers, 4 cross beams. Matches Wikimedia side photo + r5 end-on. sbs: landmarks/shots/br_sbs.jpg (left labels say Mapillary but are Wikimedia CC + r5 video frame).
- Diamonds Intl L.G. Smith 17: no Mapillary photo facing it (nearest are ~100 m inland warehouses) -> unverified, unchanged.
- Subway x4: each sits on an OSM building named Subway (location verified); no Mapillary photos -> facades unverified.
- Dunkin': official listings = Alhambra (J.E. Irausquin 47; ours 50 m from Alhambra bazaar -> OK), "across from Playa Linda" (dunkin_pb ~115 m from Playa Linda -> plausible), Eagle Aruba Resort (J.E. Irausquin 248, not modelled), L.G. Smith 9 Renaissance Marketplace, Tanki Flip, Savaneta (not modelled).

## r195
- spaans_water: DEM has the Spaans Lagoen channel as 3.2-4 m land and the road is draped on it, so no global water plane works. Built 8 m terrain-following water prisms (top = max of 16 samples +0.55 m, 0.2 m steps, 0.8 m skirts hide steps) inside the shoreline traced from the Google aerial (shots/aer_sl_w.png), leaving a +-8.8 m gap for the road deck. Opaque mat 'pondw' (#2f7277). NB gen.mjs strips a leading 'l' from material names (lod prefix): 'lagw'/'lawn' etc. fall back to wall colour. 4.9k tris, switch 1500 m. Faint light step-lines remain at grazing angles.
- Dunkin': OSM/Nominatim nodes: Tanki Flip (-6543,-2888) -> NEW dunkin_tf pole sign by OSM building 3228; L.G. Smith (-7260,339) = Renaissance Marketplace L.G. Smith 9 -> already a renmarket tenant storefront; Bushiri/Alhambra + Bubali/Playa Linda already modelled. Eagle Aruba Resort and Savaneta: not in OSM/Nominatim -> not pinned.
- rb_hearts (-935,4480): night segment of r5 is the return trip (Savaneta -> Oranjestad), hearts ~800 m NW of the bridge. Google aerial shows a large roundabout with brick-red apron + small trees on the island, matching the red-lit curb in r5 11:50-11:52. Kept.
- Silver pipelines: r5 7:40-7:52 pipes alongside a coastal highway (captioned about thermal expansion); the green crossing gantry was not found in 6:40-8:10. Overpass (man_made=pipeline) down -> location unknown, not built.
