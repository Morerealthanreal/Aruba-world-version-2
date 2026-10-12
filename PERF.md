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
