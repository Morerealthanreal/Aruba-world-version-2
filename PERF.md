# Aruba World A: perf findings (in progress, saved 2026-10-12 00:3x AST)

Setup: headless Chrome + SwiftShader, phone emulation 412x915 @2.625 dpr, touch, spawn point (car, Oranjestad),
scripts in /workspace/perf (m.mjs = draw calls per pass + scene counts + CPU profile; results in /workspace/perf/res/*.json).
SwiftShader GPU time shows up as a stall inside GL calls ("native/GL"), so CPU numbers below are JS self-time (game+three) excluding GL.

## Baseline pure A (addons=0)
| tier | draw calls | tris | passes | objects in scene | JS ms/frame idle / driving (desktop x86) |
| LOW  | 1594 | 965k | shadow 192/182k, transmission 695/391k, main 707/393k | 44,299 (39,380 InstancedMesh) | 26.5 / 38.4 |
| MED  | 1821 | 1.14M | shadow 281/284k, main+transmission 1525/855k | 44,630 | 19 / 26 |
| HIGH | 5509 | 4.60M | shadow 998/1.73M, transmission 1500/994k, main 1532/998k, GTAO normal pass 1460/875k | 87,706 (77,354 InstancedMesh), 22 regions | 49 / 73 |
Merged build before fixes (night, fps guard off): LOW 1616 / 967k, MED 1836 / 1.14M, HIGH 5518 / 4.52M; programs 112 -> 226 (LOW) because add-on SpotLight/Ambient change the light count.

## Ranked causes (evidence)
1. Player car glass uses KHR_materials_transmission (car.glb, 5 window meshes, 1 material). three re-renders ALL opaque objects into a transmission RT every frame: +695 draws (LOW) / +1500 draws, +1M tris (HIGH). Toggling transmission=0 removed exactly that pass.
2. HIGH tier: dpr 2 (824x1830 buffer), 4x MSAA half-float composer RT, GTAO (12 samples + 12-sample denoise) = another full scene pass (1460 draws), plus a whole-scene traverse every 1 s inside the GTAO wrapper, shadow map 4096 with 1.73M shadow tris (bld:kit alone 956k tris / 244 draws), radius 2000 m -> 22 regions, 87k objects.
3. Scene graph: one InstancedMesh per building kit / parked-car lot / props: 13,448 kit + 23,946 parked + 1,964 props InstancedMesh on LOW (8 regions); all matrixAutoUpdate -> updateMatrixWorld + multiplyMatrices top JS self-time (6.6 ms/frame of ~25 on LOW desktop). A's cull pass traverses all region meshes every 0.5 s.
4. Monuments + brands: hundreds of tiny BoxGeometry meshes, never distance culled: 421 + 306 draws at spawn on LOW (half of the main pass).
5. Player car itself ~110 meshes / 32 materials (123k tris, clearcoat/iridescence) ~218 draws; pedestrians 12-14 skinned parts each.
6. Minimap 2D canvas redrawn every frame (V_), 0.25-1 ms/frame.
7. Add-ons: second three copy (348 KB, load only), SpotLight headlight always in the light list even at intensity 0 (+cost on every lit fragment, program recompiles), 4 PointLights on HIGH always, water patch walked the whole scene (44k-88k objects) every 6 s.

## Fixes committed (see git log in aruba-world-merged): addons/src/perfFixes.ts + nightLights.ts + 2 inert bundle hooks
After (merged build, night, guard off): LOW 619 draws / 580k tris (was 1616/967k); MED 800 / 726k (was 1836/1.14M).
HIGH after (phone profile): 1178 draws / 1.26M tris (was 5518 / 4.52M), buffer 618x1372 (was 824x1830), GTAO off, 18 regions / 72.5k objects (was 22 / 87.7k), JS 10.8 ms/frame idle+drive (was 49 / 73).
Visual check: /workspace/perf/cmp_low.png, cmp_high.png, cmp_high_car.png (before | after).
Solo (non-concurrent) SwiftShader runs queued -> /workspace/perf/res/solo_*.json
SOLO runs (one browser at a time): 
- A HIGH: 5410 draws / 4.56M tris, 824x1830, 87.7k objs, 22 regions; SwiftShader 0.38 fps idle / 0.33 driving; JS 52 / 70 ms/frame
- P HIGH: 1144 / 1.25M, 618x1372, 72.5k, 18 regions; 0.75 / 0.83 fps; JS 13.9 / 15.1 ms
- A LOW: 1628 / 978k; 0.88 / 0.67 fps; JS 25.2 / 30.8 ms
- P LOW: 608 / 581k; 2.25 / 3.83 fps; JS 8.9 / 12.2 ms
Streaming (pure A HIGH, teleport 2.6 km): 12 region loads (3 concurrent, 0.1-13.6 s each incl. fetch+PNG decode), queue grew to 266 build jobs; A runs jobs only inside its per-frame budget (5 ms phone / 8 ms desktop, at least 1 job per frame), so at low fps tiles barely build (only 4 jobs ran in 60 s at 0.3 fps); one update frame took 47 ms. Building is synchronous main-thread (roads.build, roadGrid, buildings.build per 125 m cell, terrain chunkGeometry), no worker.

# Round 2 (2026-10-12)
1. Controls done: bundle patch rv.brake&&$.revHold&&a.s<.6 -> rv.brake&&a.s<.6. Headless test: hold brake from stop -> s=-0.88 'CAR · R', release -> 0; moving 12 m/s + hold -> slows; moto same; key S hold -> -1.32.

2. Perf round 2 committed: tileInst.ts folds ~39k InstancedMesh (kit/parked/parkedHi/props) into ~447 per-tile buckets; car 110->12 meshes; phone peds HIGH 10->5 (MED 6->4) no shadows; fixed add-on dt going negative at boot (delayed perf.update by ~12 s on HIGH).
Round-2 HIGH (phone profile): 680 draws (was 1144 after round 1, 5410 pure A), 1.23M tris, 9,073 scene objects (was 72.5k / 87.7k), shadow pass 125 draws (was 385), SwiftShader 2.25 fps idle / 1.83 driving (was 0.75/0.83; pure A 0.38/0.33), JS 11.9 / 7.3 ms/frame.
Round-2 LOW: 382 draws (608 r1, 1628 A), 510k tris, 5,647 objects (44k), SwiftShader 4.75 fps idle / 2.83 drive (r1 2.25/3.83 noisy, A 0.88/0.67), JS 4.5 / 6.2 ms.

## Round 3 (art + off-frame tile jobs)
- sun.ts: sun disc/halo sprite + golden-hour key light and haze (?sun=0)
- flora.ts: bougainvillea, aloe, sea grape, desert scrub, wall AC units, shop awnings. All instanced and distance culled, no shadows (?flora=0)
- jobPump.ts + bundle patch (`window.__awJobB`): A's tile-build queue drains from a post-frame MessageChannel task (?jobs=0)
- Phone HIGH: 689 -> 709 draws, 1.229M -> 1.232M tris. Phone LOW: 382 -> 388 draws, 500.6k -> 500.7k tris. No page errors.

## Round 4 (r192, rendering / frame pacing; branch cursor/render-perf-batching-ee34)
Harness: tools/perf (README in measure.mjs header). Serve game/ (PORT, default 8777) and run
`node measure.mjs <label> "" --static [--at=x,z,h]` (draw calls / tris / deterministic chase, street, aerial shots)
and `node measure.mjs <label> "" --drive [--trace --frames=900]` (planned route from spawn at 150 km/h,
fixed 1/30 s steps, q=low, software GL). `cmpdrive.py` makes the before/after table, `trace_top.py` lists
the longest main-thread tasks from the trace. "CPU frame task" = rAF task minus time blocked in GL
shader compile / texture+buffer upload calls; SwiftShader also stalls inside render on its GPU-process
backlog, so the remaining 300-700 ms single frames (both builds) are not phone-representative.

Changes (each off with its flag; everything else unchanged):
| change | flag (off) |
|---|---|
| bldBatch.ts: each region's bld:* cell meshes of one material -> one BatchedMesh (multi-draw). Trim / contact decals use A's own per-cell detailR/contactR rules (A's far LOD that r186's merge disabled); walls/roofs keep r186's region-level bldR result exactly; per-pass frustum test per cell; indirect texture uploaded once | `?bbatch=0` (`?bbshell=<m>` = per-cell shell cull) |
| farCity.ts: far city as one BatchedMesh with per-region frustum culling | `?farbatch=0` |
| instPool.ts: tileInst (kit / parked / props) and flora buckets of all regions share one InstancedMesh per (geometry, material); grow without three's identity fill | `?ipool=0` |
| tools/patch_perf_core.py: allocation-free point-in-polygon / hero `hides` / `__blocked` / brands region key (bit-identical results) | `?corefix=0` |
| splitJobs.ts + tools/patch_street_hook.py: streets job (parked cars, furniture, walls, signs, pools) as time-sliced stages; walls built in adaptive runs and merged back per (material, 80 m cell) | `?split=0` |
| tileInst.ts: region fold sliced (graph walk + instance groups, ~3 ms per frame) | (part of tileInst) |
| mobilePerf.ts: incremental shader warm-up (only new program signatures, max 4 per frame); optional texture pre-upload | `?warmup=full`, `?preup=1` (opt-in) |
| staticFreeze.ts: skip the per-frame matrix walk of subtrees that have not moved (thaw on add / change; check_freeze.mjs: 0 mismatches) | `?mwfreeze=0` |

Static (alternating shadow / no-shadow frames, phone viewport 412x915 @2.625):
| scene | calls before -> after | triangles before -> after | objects |
|---|---|---|---|
| Oranjestad spawn | 441/569 -> 371/492 | 973k/1.48M -> 529k/709k | 5516 -> 4926 |
| spawn chase view | 375/288 -> 288/368 | 1.20M/815k -> 382k/438k | |
| Palm Beach | 476/306 -> 297/444 | 928k/619k -> 428k/601k | 9707 -> 8216 |
Screenshots: chase and street views pixel-identical at both places (max per-pixel RGB sum diff 0 / 11);
aerial view 0.98% / 0.25% of pixels differ: trim and contact decals of houses beyond A's detailR (180 m)
/ contactR (150 m).

Drive 150 km/h, 2401 frames (res/base3 vs res/new8):
| metric | before | after |
|---|---|---|
| CPU frame task p50 / p95 / p99 | 12.5 / 19.4 / 56.1 ms | 10.4 / 18.0 / 27.3 ms |
| frames > 33 / > 50 ms | 51 / 29 | 14 / 7 |
| triangles avg | 776k | 452k |
| draw calls avg | 368 | 367 |
| allocation per frame | 2.0 MB | 1.0 MB |
| scene.updateMatrixWorld avg / max | 3.3 / 87 ms | 1.3 / 9.3 ms |
| buildings.build max | 118 ms | 14.6 ms |
| streets.build max | 156 ms | 13.6 ms |
| flora.update max | 69.6 ms | 10.8 ms |
| tileInst.update max | 27.1 ms | 5.5 ms |
| renderer.compile max | 119 ms | 7.1 ms |
Left alone: mon.update (one-off landmark build when its region arrives, 90-125 ms headless; content code)
and A's veg.setRegions (~7 ms per built region).

### Rebase on main a83a8ea (moto, plane, traffic/audio, sea, cars, landmarks, Noord street furniture, road shader)
- Bundle = main's bundle (incl. tools/patch_streets.py) + tools/patch_perf_core.py + tools/patch_street_hook.py, nothing else
  (checked by re-applying both scripts to main's file: byte-identical). aw-addons.js rebuilt from the merged sources.
- "Empty sky" reports (Oranjestad / Noord at ?q=med, flat light blue, no clouds, HUD fine): that colour is the page
  background (#7ec8ff) showing through a canvas with nothing presented, not culled geometry (culling cannot remove
  the HDR sky). Cause: the add-ons loop runs after A's render in every frame (measured order: render, guard.frame),
  so an fps-guard resolution step (setPixelRatio + resize) cleared the frame A had just drawn and the browser
  presented the empty canvas until A's next frame. At 60 fps a one-frame flash per step; in software GL (0.5-1 fps)
  it stays up for seconds, and the PR build stepped the guard further there (level 6 = post off + lazy shadows,
  which is also why its triangle count read ~0.67M vs ~1.35M). Repro: tools/perf/guard_step.mjs (guard step
  inside a rAF after A's render, then __noRender): main 30/30 sample points page background, with the fix 0/30 at
  low, med and high. Fix: fpsGuard redraws the frame after its resize (only on step frames).
- bldBatch / staticFreeze: no difference found at Oranjestad, Noord, Palm Beach (on foot, ground + 60 m aerial,
  low / med / high, puppeteer + Playwright, teleport and reload-at-spot, fps guard on and off, ?preup=1).

### Rebase on main 28cbba1 (r232-r245: Noord street furniture v2 / Draco hero cells, yard palms + divis in veg data, Palm Beach JEI lamps + medians, Noord palette / asphalt / dirt)
- main's hero loader is now `new Nf().setDRACOLoader(...)`, so patch_perf_core.py anchors on `var dm=new Nf`
  (the rebase had silently dropped corefix). Bundle = main's + patch_perf_core.py + patch_street_hook.py,
  byte-identical when re-applied to main's file. The streets class (A's `Ch`) is byte-identical to a83a8ea,
  so the split streets job still runs exactly A's code; the original `hides` is unchanged apart from a ?v= string.
- guard_step.mjs on 28cbba1: frame presented after a guard step is 88% page background on main (rest = HUD) at
  low / med / high, 0% with this PR.
- Visual check harness pitfalls (handled in tools/perf/air_cmp.mjs): software GL renders well under 1 fps at 1000x620, so
  (1) settle at a 320x200 viewport, then restore 1000x620 (main at Noord q=med had 172 region jobs queued after
  26 min otherwise); (2) wait for hero GLBs within A's 1500 m load radius (main's Oranjestad / Palm Beach shots
  were taken before its heroes arrived); (3) wait for main's bldMerge queue (one bucket every 3rd frame, no
  pending()): until a region is merged A's per-cell bldR rule (from the focus incl. __awAhead) hides its far
  cells, which looked like "PR draws extra buildings" at Palm Beach q=med. bldBatch keeps r186's region-level
  shell result, i.e. main's merged end state. Time fixed with `t=10&freeze=1`. (4) Both shots use a fixed
  camera derived from the player: A's follow camera eases toward its target and comes to rest a few pixels apart
  after settle runs of different length (main settles 3-4x longer), a 6 px shift = 39% "diff" at Palm Beach q=high.
- Settled diffs (RGB sum > 24), aerial / ground: low 1.8/0.4 Oranjestad, 0.7/0.4 Noord, 0.9/4.1 Palm Beach;
  med 2.5/0.5, 1.4/0.7, 2.5/5.6; high 3.2/2.8, 2.0/0.5, 4.8/9.0 (preload still on; see the abf87ae notes).
  Remaining pixels: far roof trim / contact decals beyond A's detailR / contactR (see above), palm sway and the
  player's idle pose (animation time), and on main at q=high the farCity leak below.
- main q=high: farCity shows through inside the streamed area (a dirt-coloured block behind the Palm Beach hotels,
  a dark translucent slab on the hotel ground floor, the dark patch at Oranjestad). Main hides built regions in
  farCity's vertex shader (mask texture via onBeforeCompile); the post chain's override-material passes (GTAO
  depth / normals) draw the mesh without that patch. Identified with an id-colour pick render (aw:farCity at those
  pixels) and `?far=0` on main (block gone; main ?far=0 vs PR 4.0% aerial instead of 11.2%). With this PR the far
  city is a BatchedMesh whose draw list leaves built regions out (CPU, every pass), so the leak is gone; the
  `?farbatch=0` fallback is main's code and still has it.

### Rebase on main abf87ae (r246-r256 Noord yard walls / roofs, bus shelters, zebras, scrub, JEI sidewalks; #10 soak + leak fixes, #11 phone HUD + minimap, #12 realistic sky / sun path)
- Rebased with an --exec step per commit: core bundle = main's file + patch_perf_core.py + patch_street_hook.py,
  aw-addons.js rebuilt from the merged sources, so no auto-merged minified text survives (both byte-identical to a
  fresh rebuild / re-patch at the tip). main's own bundle patches (noord roofwall, minimap) are in main's file.
  Source conflicts were only the `window.__aw` export line (main dropped `sun`, added `minimap`). Typecheck clean.
  The new sky dome is added to the scene, outside A's world group, so staticFreeze never sees it.
- guard_step.mjs on abf87ae: presented frame after a guard step is 88% page background on main at low / med / high,
  0% with this PR.
- Harness: (5) `preload=0`. Preload's look-ahead (__awAhead, up to 220 m along the camera velocity) only decays on
  frames under 0.5 s, so in software GL the teleport / aerial-camera jump leaves a stale, run-dependent focus offset;
  A's hero LOD (switch_m), terrain LOD and bldR then centre on a point up to 220 m away. That made the Coconut Inn
  hero show its LOD1 and the nd_pitch area its overview terrain in one run and not the other (10% "diff" at Noord
  q=med); identical hero state in both builds once probed directly. (6) Cloud drift / sea (shared uTime, sky uWind)
  pinned at render time and the minimap HUD hidden; both are wall-clock driven.
- Settled diffs on abf87ae (RGB sum > 24), aerial / ground:
  | q | Oranjestad | Noord | Palm Beach |
  |---|---|---|---|
  | low | 1.6 / 0.4 | 0.8 / 0.2 | 0.3 / 2.4 |
  | med | 2.4 / 0.8 | 1.1 / 0.2 | 2.0 / 6.1 |
  | high | 3.2 / 2.0 | 2.2 / 0.6 | 5.6 / 10.3 |
  What remains: far roof trim / contact decals beyond A's detailR / contactR (aerial), palm sway + the player's idle
  pose + traffic positions (ground; a bus at Palm Beach q=high), and main's q=high farCity leak (Palm Beach aerial).
  No page errors in any run. Harness settle is slower for the PR at q=high (95-118 s main vs 294-579 s PR): it waits
  for bldBatch, which batches a few cells per frame while A's original cell meshes stay visible; main's bldMerge is
  pumped synchronously by the harness instead.
- Drive (measure.mjs --drive, q=low phone, 2,401 fixed 1/30 s frames, main abf87ae vs this PR on abf87ae):
  | metric | main | PR |
  |---|---|---|
  | CPU frame task p50 / p95 / p99 | 10.8 / 16.6 / 44.2 ms | 8.6 / 15.2 / 23.0 ms |
  | CPU frame task over 33 / 50 ms | 30 / 12 | 7 / 3 |
  | triangles avg | 799k | 471k |
  | draw calls avg | 344 | 364 |
  | alloc per frame | 1.6 MB | 1.0 MB |
  | scene.updateMatrixWorld avg / max | 3.5 / 12.4 ms | 1.1 / 10.0 ms |
  | streets.build max | 177 ms | 17.5 ms |
  | flora.update max | 20.9 ms | 3.1 ms |
  | tileInst.update max | 22.7 ms | 7.2 ms |
  | renderer.compile max | 65.5 ms | 8.6 ms |
  Raw frame task incl. GL max is 2,054 ms for the PR vs 979 ms on main: one SwiftShader shader compile (glc max
  2,007 ms) landing on a different frame; compile totals are 8.1 vs 7.0 s for 243 vs 233 programs (BatchedMesh
  variants). Static spawn view (q=low phone): draw calls 512/364 -> 506/364, triangles 1.48M/960k -> 725k/530k.

### Rebase on main dbf35eb (r257-r260b: Faro Blanco balustrade, California Lighthouse lot, +5 shop signs, data cache bump)
- Same --exec regeneration; only generated-file conflicts. Bundles byte-identical to a fresh rebuild / re-patch,
  typecheck clean, cache versions bumped (-pf11).

## Round 5 (fast drive, 21 km)

Same harness (`measure.mjs --drive --frames=5400 --to=9000,8000`, phone SwiftShader, fixed 1/30 s). Before is r262. After is this branch on r286 (audio, radio, downtown), so it is not a single-variable diff. 5401 frames, route length 21001 m.

The hitch that showed up as ~3500 draws for a handful of frames is gone: cells and kits are copied in the tile pump and stay hidden until that copy exists. `getProgramInfoLog` for programs we warmed runs in that pump, after the link is ready. A few shadow programs still finalize on the first draw.

| metric | low before | low after | med before | med after |
|---|---|---|---|---|
| raw frame p50 / p95 / p99 / max (ms) | 6.0 / 11.7 / 20.4 / 1112 | 7.5 / 12.0 / 17.2 / 615 | 7.3 / 12.9 / 23.0 / 1639 | 6.0 / 11.4 / 17.0 / 1120 |
| raw frames >16 / >33 / >50 ms | 87 / 33 / 32 | 59 / 27 / 27 | 105 / 32 / 31 | 58 / 33 / 32 |
| CPU frame p50 / p95 / p99 / max (ms) | 5.7 / 11.0 / 16.9 / 321 | 7.3 / 10.9 / 14.4 / 291 | 7.1 / 11.9 / 17.9 / 431 | 5.9 / 10.3 / 13.9 / 108 |
| CPU frames >33 / >50 ms | 3 / 2 | 3 / 2 | 6 / 5 | 1 / 1 |
| shader compile total / max (ms) | 8538 / 926 | 7874 / 753 | 10702 / 1615 | 16546 / 1108 |
| texture upload total / max (ms) | 6472 / 1084 | 6459 / 584 | 7261 / 790 | 7480 / 617 |
| draw spikes (calls > 1500) | 30 | 0 | 34 | 0 |
| draw calls avg / max | 291 / 3762 | 280 / 582 | 317 / 3504 | 298 / 1174 |
| triangles max | 3.07M | 1.11M | 2.96M | 1.34M |
| alloc MB/frame | 0.98 | 0.93 | 1.00 | 0.98 |

Gap (wall time from one animation callback to the next) was not recorded on the before run. After, gap p50 is 212 ms on low and 307 ms on med; that is SwiftShader present delay plus the pump, not a phone frame time. Phone soak (`tests/long-drive-soak.spec.js`, low) passes. The high project is skipped by the test.
