// Correctness check for addons/staticFreeze: while driving, recompute the world matrix of every node
// inside frozen subtrees from its local transform and compare with what will be rendered.
import fs from "fs";
import { boot, sleep } from "./boot.mjs";
const q = "q=low&t=10&freeze=1&fpsguard=0";
const { browser, page } = await boot(q, { w: 206, h: 458, dpr: 1 });
await page.evaluate(fs.readFileSync(new URL("./inpage.js", import.meta.url), "utf8"));
await sleep(60000);
const check = () => page.evaluate(() => {
  const f = window.__aw.mwf; if (!f) return "no mwf";
  const M4 = game.camera.matrixWorld.constructor, tmp = new M4(), loc = new M4();
  let nodes = 0, bad = 0, roots = 0; const ex = [];
  const rec = (o, pw) => {
    nodes++;
    if (o.matrixAutoUpdate) loc.compose(o.position, o.quaternion, o.scale); else loc.copy(o.matrix);
    tmp.multiplyMatrices(pw, loc);
    const e = o.matrixWorld.elements, t = tmp.elements; let d = 0;
    for (let i = 0; i < 16; i++) d = Math.max(d, Math.abs(e[i] - t[i]));
    if (d > 1e-3) { bad++; if (ex.length < 8) ex.push(o.name + "/" + o.type + " d=" + d.toFixed(3)); }
    const w = tmp.clone();
    for (const c of o.children) rec(c, w);
  };
  for (const r of f.roots) if (r.frozen && r.o.parent) { roots++; rec(r.o, r.o.parent.matrixWorld); }
  const path = (o) => { const a = []; for (let x = o; x && a.length < 4; x = x.parent) a.unshift((x.name || x.type).slice(0, 18)); return a.join('/'); };
  const un = f.roots.filter((r) => !r.frozen && !r.dead).map((r) => { let n = 0; r.o.traverse(() => n++); return [n, r.depth, path(r.o)]; }).sort((a, b) => b[0] - a[0]).slice(0, 12);
  const st = {}; for (const r of f.roots) { const k = (r.frozen ? 'F' : r.dead ? 'D' : r.t < 0 ? 'new' : 'obs') + r.depth; st[k] = (st[k] || 0) + 1; }
  const samp = f.roots.filter((r) => !r.frozen && !r.dead && r.depth === 2).slice(0, 5).map((r) => [r.t.toFixed(2), r.nodes.length, r.o.children.length, path(r.o)]);
  return { roots, nodes, bad, ex, stats: f.stats, un: un.slice(0, 4), st, samp, clock: f.clock.toFixed(1), oi: f.oi, parents: f.parents.length };
});
await page.evaluate(async () => {
  const r = await window.__fsd.plan({ x: -9700, z: -2900 });
  const pts = (r.lane || r.pts).map((p) => [p[0], p[1]]);
  window.__fsd.route = null;
  let L = 0; const acc = [0]; for (let i = 1; i < pts.length; i++) { L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); acc.push(L); }
  window.__route = { pts, acc, L }; window.__M.useVirtual = true; window.__stepN = 1e9;
  const Rt = window.__route, S = game.S, V = 150 / 3.6; let s = 0, i = 1;
  const step = () => {
    if (window.__pauseDrive) { requestAnimationFrame(step); return; }
    s += V / 30; if (s >= Rt.L - 5) return;
    while (i < Rt.acc.length - 1 && Rt.acc[i] < s) i++;
    const a = Rt.pts[i - 1], b = Rt.pts[i], u = (s - Rt.acc[i - 1]) / (Rt.acc[i] - Rt.acc[i - 1] || 1);
    let j = i; while (j < Rt.acc.length - 1 && Rt.acc[j] < s + 12) j++;
    const c = Rt.pts[j], x = a[0] + (b[0] - a[0]) * u, z = a[1] + (b[1] - a[1]) * u;
    S.car.x = x; S.car.z = z; S.car.h = Math.atan2(-(c[0] - x), -(c[1] - z)); S.car.s = V;
    requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
});
for (let k = 0; k < +(process.env.K || 8); k++) {
  await sleep(40000);
  console.log(k, JSON.stringify(await check()));
}
await browser.close();
