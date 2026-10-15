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

## r196
- Overpass still down; used the OSM editing API /map bbox (0.02 deg tiles, lon -70.03..-69.95, lat 12.44..12.52) -> 13 man_made=pipeline ways (W.E.B. Aruba). Overground ones (Spaans Lagoen -992,5114 -> San Nicolas 6257,9477, ~9.5 km) built as web_pipe_0..11 (pipes_chunks.json): 2 silver pipes r0.24 at 0.75 m on supports every <=16 m, switch 700 m, ~20k tris total, max 3.4k per chunk. Short underground road crossings left out. Green crossing gantry still unseen in r5 -> not built. NB: the user expected Oranjestad-Barcadera; OSM has no pipeline there.
- spaans_water: new gen.mjs extra type 'hfield' (quads with per-vertex y, quadAuto). Water is now one continuous surface (vertex = max terrain in +-3 m +0.45) -> no step lines, 1743 tris (was 4.9k).

## r197
- BIG FIX: spaans_bridge sat on OSM 1023428708, a *service* bridge carrying the W.E.B. pipeline (the Google aerial there shows a steel truss pipe bridge). The Route 1 arch bridge is the trunk pair OSM 451805520/463189658, centre ~(-442,5000), ~94 m (matches VINCI 92 m). Wikimedia photo camera (12.473825,-69.975372, heading 53) points at it. Moved; aerial aer_tb_w.png shows the twin arches there.
- spaans_water2: water under the arch bridge (aerial-traced, hfield, 267 tris); old spaans_water stays (lagoon under the pipe bridge is real water).
- spaans_pedbridge: OSM footway 35043372 + cycleway 628177161 bridge beside Route 1 -> yellow steel railings both sides (r26 12:59-13:01 yellow railings/stairs at the bridge end). Railings only; the path surface is the game's own.
- Bollards: dt_bollards0 (downtown) and sc_bollards0 (Santa Cruz) already exist (master_list line 316 [x]); line 281 "todo" was stale.

## Checks after r197 (no build changes)
- Arch placement: Google aerial crop (landmarks/shots/tb_crop.png) shows ONE 4-lane deck carrying both carriageways; the two arch ribs spring from the outer deck edges, hangers drop to the outer edges, cross beams over the deck. r5 11:22 shows hangers on both sides of the car. Our model (ribs from u=+-7.6 about the centreline between the two OSM carriageways, leaning to +-1.2) = spans both carriageways. Correct, no change.
- Roundabouts: island-wide OSM junction=roundabout pulled via API tiles -> landmarks/osm_rbs.json (59 rings). My lon/lat->game formula drifts ~1.7 m per km east (dx ~ -16 -0.0017x), so 5-40 m "offsets" east are projection drift, not misplacement. After correction every rb_* incl. rb_pyramid sits on an OSM ring, except rb_peachwall (no OSM ring; n1 00:27 frames show a small residential circle with peach scalloped wall + dark-blue columns, and the aerial at its spot shows a residential turning circle, so plausibly right) and rb_n2mound_n (134 m from any ring; free mini-rb with a mound island at Catiri (-4285,-4751) is a candidate, unconfirmed).
- Arashi stone walls/palapas: no specific location -> skipped.

## r198 (route accuracy, Noord batch 1)
- Google Map Tiles aerials started coming back blank (~21:00, likely quota); switched to Esri World Imagery z18 via landmarks/esri.py (out x z halfwidth). NB aerial.mjs game shots hide hero GLBs (use shot4 to see heroes).
- Noord 12-point Esri-vs-game comparison (shots/noord_cmp2.jpg, noord_cmp7.jpg): road layout matches well; main gap = houses missing from OSM.
- Added Microsoft Global ML Building Footprints (2026-02, Aruba, 68k) minus OSM overlap (>15%), roads (buffered), heroes (15 m), <40 m2 -> 1660 Noord buildings (msb/noord_add.json; drift-corrected lon/lat->game). Built as 130 400 m chunks msb_noord_* (1-storey, hip tile roof if rect <=300 m2, else flat; one wall colour per chunk), 37k tris total, max 749/chunk, switch 650 m.
- IMPORTANT: after any `node malls.mjs` run that re-emits msb chunks, run `python3 msb_fix.py` before install.sh (clears name/new_place/hide_footprint so they don't become 130 search places or hide OSM buildings).
- Credits: addons/src/index.ts adds the MSB ODbL line (only the credits block touched).
- Island-wide there are ~10.4k MSB-only buildings (msb/missing.json); only Noord added so far.

## r199 (ML-footprint houses quality)
- gen.mjs: per-part vertex colours (part.vcol walls, part.vroof roof) -> COLOR_0; white textures/materials tinted per building, so 1 chunk keeps ~4 draw calls. part.gnd forces ground facade on raised parts.
- msb chunks are now textured facade parts (windows + shutters, 'upper' bay), 12-colour vivid palette per building, hip tile roofs in 5 shades / parapet flat roofs. Noord 43.8k tris, max 988/chunk.
- malls.mjs loops AREAS noord/palmbeach/oranjestad/sannicolas (msb/<area>_add.json from landmarks/msb_area.py).
- tools/patch_veg_clear.py: grid-hashed tree clearing (window.__awVegHit) incl. circles over every msb house in AREAS (re-run after adding areas).
- r199b: added msb chunks for Palm Beach (169), Oranjestad (1270), San Nicolas (499) = 197 chunks, 51.7k tris, max 892/chunk; veg clearing now covers 3598 houses.
- r199c: msb walls are now plain vertex-tinted walls + untinted decal quads (material ground_dec, gen.mjs decalTex: window w/ white frame+shutters, door, roller door) so frames/shutters stay white. >400 m2 footprints (70) -> 'shed' commercial/warehouse look (6.3 m, muted cladding, roller door on longest side, high windows, flat grey roof). Total msb 165k tris (327 chunks, max 1656), LOD 650 m.
- bldMerge "before/after" in lc2 stats counts core OSM building meshes merged per region, NOT msb chunks; verified msb chunks loaded+visible with landmarks/vis.mjs (on/off screenshots, shots/vis_sheet.png).
