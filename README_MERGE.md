# Aruba World — merge workspace (A + B)

**Base = A** (the live build, `game/`, copied verbatim from Morerealthanreal/aruba-world @ a093c61).
**B (SuperGrok) features come in as add-on modules** (`addons/src`, TypeScript), bundled to
`game/addons/aw-addons.js` and loaded by ONE line in `game/index.html`. A's minified bundle is not edited.

Run: `./serve.sh` → http://127.0.0.1:8777/  (rebuild only: `cd addons && npm run build`)

URL switches: `?addons=0` pure A · `?daynight=0` · `?fpsguard=0` · `?t=21.5` start hour ·
`?daylen=24` minutes per game day · `?freeze=1` · `?fps=30|50|55` guard target · `?q=low|med|high` (A).

| add-on file | ported from B | does |
| --- | --- | --- |
| day.ts | look/day.ts | day model (Aruba sun: rise 06:30 / set 18:30), sky colours |
| sky.ts | look/sky.ts | gradient + stars + moon dome, fades in over A's HDR sky at dusk/night |
| daynight.ts | runGame.applyDay | moves A's sun (rotates HDR+IBL with it), sunset tint, bright-night rules (high moon y=.78, blue hemi / warm ground, cool ambient, exposure up), fog follows horizon |
| nightLights.ts | materials.ts / townLights.ts / headlight | lit windows (patched into A's wall shader `gMask`), glowing street-lamp bulbs, car/moto headlight spot (all tiers), 4 warm pools on HIGH snapped to real lamps |
| fpsGuard.ts | new (neither had one) | holds target fps: render scale 90→60 %, then lazy shadows, then post-FX off; steps back up with headroom |
| clock.ts / ui.ts | new | saved clock, clock chip in A's top bar, Time-of-day + FPS-guard rows in A's Settings (also styles that sheet — A ships no CSS for it) |
| env.ts | — | the only place that touches `window.game`; swap for real imports when A's source arrives |

## When A's original source arrives
1. Put it in `src-a/` (or replace `game/` with its build). Diff its build against `game/` to confirm it matches a093c61.
2. Move `addons/src/*` into its source tree (e.g. `src/look/`), replace `env.ts` lookups with direct imports,
   call `dayNight.apply()` / `lights.update()` / `guard.frame()` from A's own loop, drop the duplicate three copy (-80 KB gz).
3. Then do the deeper B ports that need source: worker-baked instancing (perf/chunk.worker.ts, bake.ts), B's chase-cam/steer numbers, B's facade palette into A's wall shader.
