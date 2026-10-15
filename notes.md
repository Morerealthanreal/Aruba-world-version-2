- 21:20 tram rails, marinasign, bigmama (replaces babybeach_fac) deployed

## r190 (Mapillary batch 3, downtown)
- ora_penharow: MAC (pink) / Crocs (blue, balcony) / Sole (pink) stepped-gable row north of Penha (OSM 3623/3622/3621 hidden). Verified vs Mapillary penha_0/3.
- hyatt_garden monument sign shrunk to ~0.95x1.3 m.
- Skipped: Kong Hing neighbour (unverifiable), yellow colonial neighbour (unidentified), "Aruba Car Wash" = actually AVANZA CAR WASH, gone on current aerial (radial plaza).

## Batch 4 (downtown rest) + r191 (Noord aerial checks)
- Downtown: Mapillary has only 13 photos along Caya Betico Croes, all at the Penha end (done r190). Archaeological Museum photos show only the old car-wash lot; Dollar Plus has 0 facing photos. No identity-verified edits possible -> no downtown changes.
- Noord Google-aerial checks: rb_anchor sits on a real roundabout (OK). rb_peachwall centre is a residential cul-de-sac bend, not a roundabout (wrong spot, true location unknown, left). pineapple_exp roadside, nothing identifiable (left). altovista_tank was in empty bush -> moved to OSM storage_tank way 335599536 (-5260,-5893), r 20 m, h 8 m, hides generic OSM 3322. Note: video hint said SE of chapel; this tank is ~850 m SW.

## Plane: TURBO JET + phone flight feel (plane scope only)
- Bundle hooks: `tools/patch_plane.py` (idempotent, marker `__awFly`; run after patch_gv_moto.py). Each hook falls back to A's maths when the add-on is absent.
- `addons/src/turbo.ts` (?turbo=0): plane-only TURBO JET button + key T (tap latches, hold > 0.35 s = momentary burst). Target speed x2 (thr 65% ~280 -> 560 km/h), hard cap 560 km/h via `__awTurboK/__awTurboV`. Exhaust = tail nozzle + 2 lathe plumes (blue-white core with shock diamonds, orange edge; premultiplied additive) + 40 point sprites + glow sprite; 3-4 draws, no lights. FOV push +7 deg through `camera.zoom` (gvMoto.ts owns camera.fov). A has no audio, so no engine pitch.
- `addons/src/fly.ts` (?fly=0): smoothed pitch/bank, ground contact from terrain height, rotate 150 km/h (hands-off at 200 km/h with thr > 50%), hands-off climb-out to ~140 m, low-throttle glide (floor 144 km/h), landing cushion (sink limited near ground), DIVE on ground = brakes, ground speed follows throttle below 50%, landing gear < 60 m AGL, chase cam smoothed and glued to the plane (20 m portrait / 26 m landscape + speed). Switching to the plane within ~450 m of runway 11/29 starts on the runway (teleport elsewhere is undone next frame).
- Offline check: run the bundle's real plane step with the hooks at fixed dt (see PR): takeoff roll ~350 m / 8 s, touchdown ~-1.7 m/s, turbo 281 -> 556 km/h in ~5 s.
