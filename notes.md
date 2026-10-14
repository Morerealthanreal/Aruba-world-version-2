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
