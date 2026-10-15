// PORT=8777 node air_cmp.mjs <label> "<query>" <spot> [settleMaxS]  e.g. air_cmp.mjs pr_med_noord "q=med&t=10&freeze=1" noord
// Visual check at a named spot (tests/aruba-world.spec.js coordinates), for main vs PR comparisons with compose.py.
// Teleports on foot, waits until the scene is complete, then shoots the ground view and a 60 m aerial view
// (camera override at render time, so A's / the add-ons' culling still use the player as focus).
// "Complete" = no region jobs / loads, add-on pending() jobs done, hero GLBs within A's 1500 m radius loaded and
// (on main) bldMerge's queue empty: before that A's per-cell bldR rule hides far cells, which is not what a
// player sees after a few seconds. Software GL is well under 1 fps at 1000x620, so it settles at a small
// viewport (SETTLE_VP, default 320x200) and switches back for the shots.
import fs from "fs";
import { boot, sleep } from "./boot.mjs";
fs.mkdirSync("./res/shots", { recursive: true });
const SPOTS = { noord: [12.5681, -70.0336], "palm-beach": [12.5704, -70.045], oranjestad: [12.5186, -70.0358], hooiberg: [12.5167, -69.9958] };
const [label, query = "q=med&t=10&freeze=1", spot = "oranjestad", settleMax = "3000"] = process.argv.slice(2);
const { browser, page } = await boot(query + "&fpsguard=0", { w: 1000, h: 620, dpr: 1, mobile: false });
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
    let p = 0, nb = 0, hp = 0, bm = 0;
    for (const r of A.regions.values()) if (r.state !== "built") nb++;
    for (const k of Object.keys(aw)) if (aw[k] && typeof aw[k].pending === "function") p += aw[k].pending();
    if (A.hero) for (const n of A.hero.list) if (!n._g && Math.hypot(n.x - e.x, n.z - e.z) < 1500) hp++;
    const B = aw.bmerge;
    if (B && !aw.bbatch && B.todo) { bm = B.todo.length; for (const r of A.regions.values()) if (r.state === "built" && r.group && !r.__awBM) bm++; }
    return { q: A.queue.length, l: A.loading, nb, p, hp, bm };
  });
  if (!st.q && !st.l && !st.nb && !st.p && !st.hp && !st.bm) break;
  if (Date.now() - t0 > +settleMax * 1000) { console.log("NOT SETTLED", JSON.stringify(st)); break; }
}
const settleS = (Date.now() - t0) / 1000 | 0;
await page.setViewport(VP);
await sleep(12000);
await page.screenshot({ path: `./res/shots/${label}_ground.png` });
await page.evaluate(() => {
  const g = window.game, P = window.__awPost, cam = g.camera, S = g.S;
  const e = S.mode === "walk" ? S.walk : S.car, ox = Math.sin(S.camYaw), oz = Math.cos(S.camYaw);
  const v = { p: [e.x + ox * 70, e.y + 60, e.z + oz * 70], t: [e.x - ox * 120, e.y, e.z - oz * 120] };
  const wrap = (o, k) => { const f = o[k].bind(o); o[k] = (...a) => { cam.position.set(...v.p); cam.lookAt(...v.t); cam.updateMatrixWorld(); return f(...a); }; };
  if (P && P.on) wrap(P, "render"); else wrap(g.renderer, "render");
});
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
