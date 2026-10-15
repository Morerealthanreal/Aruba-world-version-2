// PORT=8777 node air_cmp.mjs <label> "<query>" <spot> [settleMaxS]  e.g. air_cmp.mjs pr_med_noord "q=med&t=10&freeze=1" noord
// Visual check at a named spot (tests/aruba-world.spec.js coordinates), for main vs PR comparisons with compose.py.
// Teleports on foot, waits until the scene is complete, then shoots a ground view 7 m behind the player and a
// 60 m aerial view (camera override at render time, so A's / the add-ons' culling still use the player as focus).
// "Complete" = no region jobs / loads, add-on pending() jobs done, flora generated, hero GLBs within A's 1500 m radius loaded and
// (on main) bldMerge's queue empty: before that A's per-cell bldR rule hides far cells, which is not what a
// player sees after a few seconds. Software GL is well under 1 fps at 1000x620, so it settles at a small
// viewport (SETTLE_VP, default 320x200) and switches back for the shots; bldMerge (one bucket every 3rd
// frame) is pumped directly once regions are built (same end state, >1 h of frames at q=high otherwise).
import fs from "fs";
import { boot, sleep } from "./boot.mjs";
fs.mkdirSync("./res/shots", { recursive: true });
const SPOTS = { noord: [12.5681, -70.0336], "palm-beach": [12.5704, -70.045], oranjestad: [12.5186, -70.0358], hooiberg: [12.5167, -69.9958] };
const [label, query = "q=med&t=10&freeze=1", spot = "oranjestad", settleMax = "3000"] = process.argv.slice(2);
// preload=0: Preload shifts A's streaming / LOD centre (__awAhead) up to 220 m along the camera's velocity and only
// decays it on frames under 0.5 s, so in software GL the teleport (and the jump to the aerial camera) leaves a
// stale, run-dependent offset: hero LOD, terrain LOD and building cull then differ between otherwise equal runs.
const { browser, page } = await boot(query + "&fpsguard=0&preload=0", { w: 1000, h: 620, dpr: 1, mobile: false });
const errs = [];
page.on("pageerror", (e) => errs.push(e.message));
await sleep(5000);
const [lat, lon] = SPOTS[spot];
await page.evaluate(({ lat, lon }) => {
  const g = window.game, t = g.fromLL(lat, lon), r = g.nearestRoad(t.x, t.z);
  if (g.S.mode !== "walk") g.setMode("walk");
  g.teleport("walk", r.x, r.z, r.h);
}, { lat, lon });
const VP = { width: 1000, height: 620, deviceScaleFactor: 1, isMobile: false, hasTouch: false };
const [sw, sh] = (process.env.SETTLE_VP || "320x200").split("x").map(Number);
await page.setViewport({ ...VP, width: sw, height: sh });
const t0 = Date.now();
let st;
for (;;) {
  await sleep(5000);
  st = await page.evaluate(() => {
    const A = game.real, aw = window.__aw || {}, S = game.S, e = S.mode === "walk" ? S.walk : S.car;
    // A runs its region jobs with a 7 ms budget per frame; run more of them between frames (dt 0: no time passes)
    if (A.queue.length) for (let k = 0; k < 10 && A.queue.length; k++) A.update(e.x, e.y, e.z, 0, 200);
    let p = 0, nb = 0, hp = 0, bm = 0;
    for (const r of A.regions.values()) if (r.state !== "built") nb++;
    for (const k of Object.keys(aw)) if (aw[k] && typeof aw[k].pending === "function") p += aw[k].pending();
    if (A.hero) for (const n of A.hero.list) if (!n._g && Math.hypot(n.x - e.x, n.z - e.z) < 1500) hp++;
    const B = aw.bmerge;
    if (B && !aw.bbatch && B.todo) { if (!A.queue.length && !A.loading && !nb) for (let i = 0; i < 300 && B.todo.length + [...A.regions.values()].filter((r) => r.state === "built" && r.group && !r.__awBM).length; i++) B.frame(); bm = B.todo.length; for (const r of A.regions.values()) if (r.state === "built" && r.group && !r.__awBM) bm++; }
    const F = aw.flora; let fl = 0;
    if (F && !A.queue.length && !nb) { const b0 = F.budget; F.budget = 200; for (let k = 0; k < 5; k++) F.update(A.regions, e.x, e.z); F.budget = b0; }
    if (F) { fl = F.gen ? 1 : 0; for (const r of A.regions.values()) if (r.state === "built" && r.group && r.json && !r.__awFlora) fl++; }
    return { q: A.queue.length, l: A.loading, nb, p, hp, bm, fl };
  });
  if (!st.q && !st.l && !st.nb && !st.p && !st.hp && !st.bm && !st.fl) break;
  if (Date.now() - t0 > +settleMax * 1000) { console.log("NOT SETTLED", JSON.stringify(st)); break; }
}
const settleS = (Date.now() - t0) / 1000 | 0;
await page.setViewport(VP);
// Both shots use a fixed camera derived from the player: A's follow camera eases toward its target, so after
// settle runs of different length it rests a few pixels apart, which shows up as a full-frame diff.
await page.evaluate(() => {
  const g = window.game, P = window.__awPost, cam = g.camera, S = g.S;
  const e = S.mode === "walk" ? S.walk : S.car, ox = Math.sin(S.camYaw), oz = Math.cos(S.camYaw);
  window.__camViews = {
    ground: { p: [e.x + ox * 7, e.y + 3.2, e.z + oz * 7], t: [e.x - ox * 30, e.y + 1, e.z - oz * 30] },
    aerial: { p: [e.x + ox * 70, e.y + 60, e.z + oz * 70], t: [e.x - ox * 120, e.y, e.z - oz * 120] },
  };
  window.__camView = "ground";
  // wall-clock driven: cloud drift / sea / stars (shared uTime, sky uWind) and the minimap HUD (heading, label picks)
  const mm = document.getElementById("minimap");
  if (mm && mm.parentElement) mm.parentElement.style.visibility = "hidden";
  const sky = g.scene.getObjectByName("aw:sky"), U = sky && sky.material && sky.material.uniforms;
  const wrap = (o, k) => { const f = o[k].bind(o); o[k] = (...a) => {
    const v = window.__camViews[window.__camView]; cam.position.set(...v.p); cam.lookAt(...v.t); cam.updateMatrixWorld();
    if (U && U.uTime && U.uWind) { U.uTime.value = 100; U.uWind.value.set(0.3, 0.6, 0.1, 0.8); }
    return f(...a);
  }; };
  if (P && P.on) wrap(P, "render"); else wrap(g.renderer, "render");
});
await sleep(12000);
await page.screenshot({ path: `./res/shots/${label}_ground.png` });
await page.evaluate(() => { window.__camView = "aerial"; });
await sleep(15000);
await page.screenshot({ path: `./res/shots/${label}.png` });
const d = await page.evaluate(() => {
  const g = window.game, R = g.renderer, ar = R.info.autoReset;
  R.info.autoReset = false; R.info.reset();
  const P = window.__awPost; if (P && P.on) P.render(); else R.render(g.scene, g.camera);
  const r = { tris: R.info.render.triangles, calls: R.info.render.calls, glLost: R.getContext().isContextLost(), guard: window.__aw.guard ? window.__aw.guard.level : null };
  R.info.autoReset = ar; return r;
});
const out = { label, spot, query, settleS, settled: st, ...d, errors: errs.slice(0, 12) };
console.log(JSON.stringify(out));
fs.writeFileSync(`./res/${label}.air.json`, JSON.stringify(out));
await browser.close();
