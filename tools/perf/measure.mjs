// [Q=q=med] node measure.mjs <label> "<extra query>" [--static] [--drive] [--alloc] [--cpu] [--trace] [--frames=N] [--to=x,z] [--at=x,z,h]
// Serve game/ first (PORT, default 8777). Boots q=low at a small phone-aspect viewport (software GL),
// waits for streaming + add-on work to settle, then
//  --static: freezes the sim, switches to the S24-class viewport and records draw calls / triangles per
//            frame, a per-category tally and deterministic chase/street/aerial screenshots (shots/)
//  --drive:  drives a planned route at 150 km/h with fixed 1/30 s steps and records per-frame task time
//            (minus time blocked in GL compile/upload calls), per-function timings and allocations (res/)
import fs from "fs";
import { boot, sleep } from "./boot.mjs";
const OUT = new URL(".", import.meta.url).pathname;
const [label, extra = "", ...flags] = process.argv.slice(2);
const doDrive = flags.includes("--drive"), doStatic = flags.includes("--static") || !doDrive, doTrace = flags.includes("--trace");
const routeTo = (flags.find((f) => f.startsWith("--to=")) || "--to=-9700,-2900").slice(5).split(",").map(Number);
const maxFrames = +((flags.find((f) => f.startsWith("--frames=")) || "--frames=2400").slice(9));
const q = (process.env.Q || "q=low") + "&t=10&freeze=1&fpsguard=0" + (extra ? "&" + extra : "");
const out = { label, q, t: new Date().toISOString() };
const t0 = Date.now();
fs.mkdirSync(OUT + "shots", { recursive: true });
const small = flags.includes("--small");
const SMALL = { width: 206, height: 458, deviceScaleFactor: 1, isMobile: true, hasTouch: true }, PHONE = { width: 412, height: 915, deviceScaleFactor: 2.625, isMobile: true, hasTouch: true };
const { browser, page } = await boot(q, { w: 206, h: 458, dpr: 1 });
console.log("booted in", (Date.now() - t0) / 1000, "s");
await page.evaluate(fs.readFileSync(new URL("./inpage.js", import.meta.url), "utf8"));
// settle: streaming idle + add-on folds/merges done
const settle = async (min = 10000, max = 400000) => {
  const s = Date.now();
  await sleep(min);
  while (Date.now() - s < max) {
    const st = await page.evaluate(() => {
      const aw = window.__aw || {}, A = game.real; let pend = 0;
      for (const r of A.regions.values()) if (r.state === "built") {
        if (aw.bmerge && !r.__awBM) pend++;
        if (aw.flora && !r.__awFlora) pend++;
        if (aw.perf?.inst && !r.__awInst) pend++;
      }
      if (aw.bmerge?.todo?.length) pend++;
      for (const k of Object.keys(aw)) if (aw[k] && typeof aw[k].pending === "function") pend += aw[k].pending();
      return { q: A.queue.length, l: A.loading, pend, f: window.__M.frame };
    });
    console.log("settle", JSON.stringify(st));
    if (!st.q && !st.l && !st.pend) break;
    await sleep(2000);
  }
  await sleep(4000);
};
const at = flags.find((f) => f.startsWith("--at="));
if (at) {
  const [x, z, h] = at.slice(5).split(",").map(Number);
  console.log("at", JSON.stringify(await page.evaluate(async (x, z, h) => {
    const f = window.__fsd; await f.load(); const sn = f.snap(x, z, 3)[0];
    const c = game.S.car; if (sn) { x = sn.x; z = sn.z; } c.x = x; c.z = z; c.h = h || 0; c.s = 0; return [x, z];
  }, x, z, h)));
  await sleep(3000);
}
await settle();
const wrapAll = () => page.evaluate(() => {
  const A = game.real, M = window.__M, aw = window.__aw || {};
  const W = (o, k, l) => M.wrap(o, k, l);
  W(A, "update", "A.update");
  for (const [o, k, l] of [[A.veg, "update", "veg.update"], [A.veg, "setRegions", "veg.setRegions"], [A.amb, "update", "amb.update"], [A.hero, "update", "hero.update"], [A.brands, "update", "brands.update"], [A.mon, "update", "mon.update"], [A.sky, "update", "sky.update"], [A.marks, "placeStatic", "marks.placeStatic"],
    [A.terrain, "chunkGeometry", "job:terrain.chunk"], [A.roads, "build", "job:roads.build"], [A.buildings, "build", "job:buildings.build"], [A.streets, "build", "job:streets.build"], [A.marks, "pools", "job:marks.pools"], [A, "roadGrid", "job:roadGrid"], [A, "junctionsNear", "job:junctionsNear"], [A, "ensureBuilt", "ensureBuilt"], [A, "disposeRegion", "disposeRegion"], [A, "hfTex", "hfTex"], [A, "bitmapTex", "bitmapTex"], [A.marks, "buildRunwayIfNear", "marks.runway"],
    [aw.jobs, "run", "jobPump.run"], [aw.bmerge, "frame", "bmerge.frame"], [aw.flora, "update", "flora.update"], [aw.perf?.inst, "update", "tileInst.update"], [aw.perf?.inst, "gather", "tileInst.gather"], [aw.perf?.inst, "foldList", "tileInst.foldList"], [aw.perf?.inst, "cull", "tileInst.cull"], [aw.perf?.inst?.pools?.size ? Object.getPrototypeOf(aw.perf.inst.pools.values().next().value) : null, "fill", "Pool.fill"], [aw.perf?.inst?.pools?.size ? Object.getPrototypeOf(aw.perf.inst.pools.values().next().value) : null, "grow", "Pool.grow"], [aw.perf, "update", "perf.update"], [aw.tmerge, "apply", "tmerge.apply"], [aw.ovm, "apply", "ovm.apply"], [aw.mperf, "frame", "mperf.frame"], [aw.far, "update", "far.update"], [aw.kids, "update", "kids.update"], [aw.lights, "update", "lights.update"], [aw.lamps, "update", "lamps.update"], [aw.traffic, "update", "traffic.update"], [aw.dn, "apply", "dn.apply"], [aw.guard, "frame", "guard.frame"], [aw.pre, "frame", "pre.frame"], [aw.emerg, "update", "emerg.update"], [aw.crash, "update", "crash.update"], [aw.wind, "update", "wind.update"], [aw.look, "update", "look.update"], [aw.lod, "frame", "lod.frame"], [aw.lod, "update", "lod.update"], [aw.pool, "update", "pool.update"], [aw.pool, "frame", "pool.frame"], [aw.slice, "frame", "slice.frame"],
    [game.renderer, "render", "renderer.render"], [game.scene, "updateMatrixWorld", "scene.updateMatrixWorld"], [aw.mwf, "frame", "mwf.frame"], [aw.bbatch, "frame", "bbatch.frame"], [game.renderer, "compile", "renderer.compile"], [game.renderer.shadowMap, "render", "shadowMap.render"]]) W(o, k, l);
  // add-on stats snapshot
});
const snapStats = () => page.evaluate(() => {
  const aw = window.__aw || {}, A = game.real; let objs = 0, meshes = 0, inst = 0;
  game.scene.traverse((o) => { objs++; if (o.isMesh) meshes++; if (o.isInstancedMesh) inst++; });
  const st = {};
  for (const k of ["perf", "bmerge", "bbatch", "flora", "jobs", "split", "tmerge", "ovm", "far", "mperf", "lod", "pool", "slice", "mwf"]) if (aw[k]?.stats) st[k] = JSON.parse(JSON.stringify(aw[k].stats));
  const gl = game.renderer.info;
  return { objs, meshes, inst, regions: [...A.regions.entries()].map(([k, r]) => k + ":" + r.state), programs: gl.programs.length, geometries: gl.memory.geometries, textures: gl.memory.textures, pr: game.renderer.getPixelRatio(), buf: [game.renderer.domElement.width, game.renderer.domElement.height], stats: st, heapMB: performance.memory ? +(performance.memory.usedJSHeapSize / 1048576).toFixed(1) : 0 };
});
if (doStatic) {
  // freeze sim (A dt=0) so the screenshot pose is the same in every run
  // freeze the sim (A dt=0) and pin the car to a rounded pose: how far the car settled at boot depends on
  // frame timing, and a 0.1 m offset moves every near object in the shots
  out.pose = await page.evaluate(() => {
    window.__stepN = 0;
    const c = game.S.car, A = game.real, dy = Math.round((c.y - A.heightAt(c.x, c.z)) * 100) / 100;
    c.x = Math.round(c.x); c.z = Math.round(c.z); c.h = Math.round(c.h * 20) / 20; c.y = A.heightAt(c.x, c.z) + dy;
    return [c.x, c.y, c.z, c.h];
  });
  await page.setViewport(PHONE);
  await sleep(12000);
  const tally = await page.evaluate(async () => {
    const M = window.__M; const fr = [];
    for (let i = 0; i < 6; i++) { await new Promise((r) => requestAnimationFrame(r)); }
    M.rec = true; M.frames = [];
    for (let i = 0; i < 8; i++) await new Promise((r) => requestAnimationFrame(r));
    M.rec = false;
    const f = M.frames.slice(1);
    M.cat = {}; await new Promise((r) => requestAnimationFrame(r)); await new Promise((r) => requestAnimationFrame(r)); const cat = M.cat; M.cat = null;
    // render 2 frames: the first tallies, keep the second for nothing (cat fills during the frame between)
    return { calls: f.map((x) => x.calls), tris: f.map((x) => x.tris), cat };
  });
  out.static = { ...tally, ...(await snapStats()) };
  // per-category summary
  const cats = Object.entries(tally.cat).sort((a, b) => b[1].calls - a[1].calls);
  out.static.catTop = cats.slice(0, 40).map(([k, v]) => `${k}: ${v.calls} calls, ${v.tris} tris`);
  // group categories
  const grp = {};
  for (const [k, v] of cats) {
    const pass = k[0] === "S" ? "shadow" : "main";
    const n = k.slice(2);
    const gname = n.startsWith("bld:") ? "buildings" : n.startsWith("aw:inst:bld:kit") ? "bld kit (inst)" : n.startsWith("aw:inst:parked") ? "parked cars (inst)" : n.startsWith("aw:inst:props") ? "props (inst)" : n.startsWith("aw:flora") ? "flora" : /^terrain|^ovTerrain|^ov/.test(n) ? "terrain" : n === "road" || n === "plate" ? "roads" : n.startsWith("car/") ? "player car" : n;
    const key = pass + " | " + gname;
    const e = grp[key] || (grp[key] = { calls: 0, tris: 0 }); e.calls += v.calls; e.tris += v.tris;
  }
  out.static.groups = Object.fromEntries(Object.entries(grp).sort((a, b) => b[1].tris - a[1].tris));
  // deterministic views: pin animation clocks, hide ambient traffic / pedestrians / kids, hide fps text
  await page.evaluate(() => {
    const A = game.real, aw = window.__aw || {};
    window.__shotFix = () => { A.veg.time.value = 0; A.water.time.value = 0; if (A.amb) A.amb.group.visible = false; if (aw.kids?.group) aw.kids.group.visible = false; A.group.traverse((o) => { if (o.name === "aw:crash") o.visible = false; }); };
    window.__shotFix();
    const st = document.createElement("style"); st.textContent = "#hudfps,#hudstats{visibility:hidden}"; document.head.appendChild(st);
  });
  out.static.views = {};
  for (const v of ["chase", "street", "aerial"]) {
    await page.evaluate((v) => {
      const c = game.S.car, fx = -Math.sin(c.h), fz = -Math.cos(c.h), y = game.real.heightAt(c.x, c.z);
      window.__freeCam = v === "chase" ? [c.x - fx * 8, y + 3.4, c.z - fz * 8, c.x + fx * 30, y + 0.5, c.z + fz * 30] : v === "street" ? [c.x - fx * 6, y + 3.2, c.z - fz * 6, c.x + fx * 900, y + 3, c.z + fz * 900] : [c.x - fx * 150, y + 140, c.z - fz * 150, c.x + fx * 1500, y, c.z + fz * 1500];
      if (v === "chase") { game.car.visible = true; }
    }, v);
    await sleep(9000);
    const t = await page.evaluate(async () => {
      window.__shotFix(); const M = window.__M; await new Promise((r) => requestAnimationFrame(r)); M.rec = true; M.frames = [];
      for (let i = 0; i < 3; i++) await new Promise((r) => requestAnimationFrame(r)); M.rec = false;
      return M.frames.map((f) => [f.calls, f.tris]);
    });
    out.static.views[v] = t;
    await page.screenshot({ path: `${OUT}shots/${label}_${v}.png` });
  }
  await page.evaluate(() => { window.__freeCam = undefined; });
  console.log("static", JSON.stringify({ calls: tally.calls, tris: tally.tris, objs: out.static.objs, programs: out.static.programs }));
  await page.evaluate(() => { window.__stepN = undefined; });
  await page.setViewport(SMALL);
  await sleep(3000);
}
if (doDrive) {
  await page.evaluate(() => { window.__M.useVirtual = true; window.__stepN = 1e9; });
  await wrapAll();
  const route = await page.evaluate(async (to) => {
    const r = await window.__fsd.plan({ x: to[0], z: to[1] });
    const pts = (r.lane || r.pts).map((p) => [p[0], p[1]]);
    window.__fsd.route = null; window.__fsd.ribbon && window.__fsd.ribbon();
    let L = 0; const acc = [0]; for (let i = 1; i < pts.length; i++) { L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); acc.push(L); }
    window.__route = { pts, acc, L };
    return { n: pts.length, L, a: pts[0], b: pts[pts.length - 1] };
  }, routeTo);
  console.log("route", JSON.stringify(route));
  out.route = route;
  const cdp = await page.createCDPSession();
  if (flags.includes("--alloc")) { await cdp.send("HeapProfiler.enable"); await cdp.send("HeapProfiler.startSampling", { samplingInterval: 8192, includeObjectsCollectedByMajorGC: true, includeObjectsCollectedByMinorGC: true }); }
  if (flags.includes("--cpu")) { await cdp.send("Profiler.enable"); await cdp.send("Profiler.setSamplingInterval", { interval: 500 }); await cdp.send("Profiler.start"); }
  if (doTrace) await page.tracing.start({ path: `${OUT}res/${label}_trace.json`, categories: ["toplevel", "devtools.timeline", "disabled-by-default-devtools.timeline.frame", "v8", "blink.user_timing"] });
  await page.evaluate((maxFrames) => {
    const M = window.__M, Rt = window.__route, S = game.S, V = 150 / 3.6;
    M.rec = true; M.frames = []; M.top = []; for (const k in M.fn) delete M.fn[k];
    let s = 0, i = 1, n = 0;
    window.__driveDone = false;
    const step = () => {
      s += V / 30; n++;
      if (s >= Rt.L - 5 || n > maxFrames) { M.rec = false; window.__driveDone = true; window.__stepN = undefined; S.car.s = 0; return; }
      while (i < Rt.acc.length - 1 && Rt.acc[i] < s) i++;
      const a = Rt.pts[i - 1], b = Rt.pts[i], seg = Rt.acc[i] - Rt.acc[i - 1] || 1, u = (s - Rt.acc[i - 1]) / seg;
      // heading from a look-ahead point (smooth over the lane polyline's kinks)
      let j = i; while (j < Rt.acc.length - 1 && Rt.acc[j] < s + 12) j++;
      const c = Rt.pts[j];
      const x = a[0] + (b[0] - a[0]) * u, z = a[1] + (b[1] - a[1]) * u;
      S.car.x = x; S.car.z = z; S.car.h = Math.atan2(-(c[0] - x), -(c[1] - z)); S.car.s = V;
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, maxFrames);
  let last = Date.now();
  while (!(await page.evaluate(() => window.__driveDone))) {
    await sleep(5000);
    if (Date.now() - last > 30000) { last = Date.now(); console.log("frame", await page.evaluate(() => window.__M.frame + " q=" + game.real.queue.length + " car " + Math.round(game.S.car.x) + "," + Math.round(game.S.car.z))); }
  }
  if (doTrace) await page.tracing.stop();
  const agg = (nodes, val) => { const m = {}; for (const n of nodes) { const c = n.callFrame; const k = (c.functionName || "(anon)") + " " + (c.url || "").split("/").pop().split("?")[0] + ":" + (c.lineNumber + 1) + ":" + (c.columnNumber + 1); m[k] = (m[k] || 0) + val(n); } return Object.entries(m).sort((a, b) => b[1] - a[1]).slice(0, 60); };
  if (flags.includes("--alloc")) {
    const { profile } = await cdp.send("HeapProfiler.stopSampling");
    const flat = []; const walk = (n) => { flat.push(n); (n.children || []).forEach(walk); }; walk(profile.head);
    out.alloc = agg(flat, (n) => n.selfSize).map(([k, v]) => [k, +(v / 1048576).toFixed(2)]);
  }
  if (flags.includes("--cpu")) {
    const { profile } = await cdp.send("Profiler.stop");
    const dt = {}; for (let i = 0; i < profile.samples.length; i++) dt[profile.samples[i]] = (dt[profile.samples[i]] || 0) + (profile.timeDeltas[i] || 0);
    out.cpu = agg(profile.nodes, (n) => (dt[n.id] || 0) / 1000).map(([k, v]) => [k, +v.toFixed(1)]);
  }
  const res = await page.evaluate(() => {
    const M = window.__M, F = M.frames;
    const pct = (arr, p) => { const a = [...arr].sort((x, y) => x - y); return +a[Math.min(a.length - 1, Math.floor(a.length * p))].toFixed(2); };
    const cbt = F.map((f) => f.cbt);
    const fnTotal = {};
    for (const f of F) for (const k in f.fn) { const e = fnTotal[k] || (fnTotal[k] = []); e.push(f.fn[k]); }
    const fnSum = Object.fromEntries(Object.entries(M.fn).map(([k, e]) => [k, { n: e.n, avg: +(e.sum / Math.max(1, e.n)).toFixed(3), max: +e.max.toFixed(2), perFrame: +(e.sum / F.length).toFixed(3) }]).sort((a, b) => b[1].perFrame - a[1].perFrame));
    const W = (f) => ({ f: f.f, cbt: +f.cbt.toFixed(1), glc: +f.glc.toFixed(1), glu: +f.glu.toFixed(1), up: f.up, progs: f.progs, fn: Object.fromEntries(Object.entries(f.fn).filter(([, v]) => v > 1).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, +v.toFixed(1)])) });
    const worstNonGl = [...F].sort((a, b) => (b.cbt - b.glc - b.glu) - (a.cbt - a.glc - a.glu)).slice(0, 15).map(W);
    const worst = [...F].sort((a, b) => b.cbt - a.cbt).slice(0, 15).map((f) => ({ f: f.f, cbt: +f.cbt.toFixed(1), glc: +f.glc.toFixed(1), progs: f.progs, cb: Object.fromEntries(Object.entries(f.cb).map(([k, v]) => [k, +v.toFixed(1)])), fn: Object.fromEntries(Object.entries(f.fn).filter(([, v]) => v > 1).sort((a, b) => b[1] - a[1]).map(([k, v]) => [k, +v.toFixed(1)])) }));
    const dh = F.map((f) => f.dh).filter((d) => d > 0);
    return {
      frames: F.length, cbt: { p50: pct(cbt, 0.5), p95: pct(cbt, 0.95), p99: pct(cbt, 0.99), max: pct(cbt, 1), over16: cbt.filter((x) => x > 16.7).length, over33: cbt.filter((x) => x > 33).length, over50: cbt.filter((x) => x > 50).length },
      calls: { avg: Math.round(F.reduce((a, f) => a + f.calls, 0) / F.length), max: Math.max(...F.map((f) => f.calls)) }, tris: { avg: Math.round(F.reduce((a, f) => a + f.tris, 0) / F.length), max: Math.max(...F.map((f) => f.tris)) },
      allocMBperFrame: +(dh.reduce((a, b) => a + b, 0) / F.length / 1048576).toFixed(3), maxQueue: Math.max(...F.map((f) => f.q)),
      fn: fnSum, worst, worstNonGl, top: M.top.sort((a, b) => b.d - a.d).slice(0, 40),
      series: F.map((f) => [f.f, +f.cbt.toFixed(1), f.calls, f.tris, f.q, +f.glc.toFixed(1), f.progs, +f.glu.toFixed(1)]),
      fnSeries: F.map((f) => Object.fromEntries(Object.entries(f.fn).filter(([, v]) => v > 0.3).map(([k, v]) => [k, +v.toFixed(1)]))),
      glu: { total: +F.reduce((a, f) => a + f.glu, 0).toFixed(1), max: +Math.max(...F.map((f) => f.glu)).toFixed(1) },
      glc: { total: +F.reduce((a, f) => a + f.glc, 0).toFixed(1), max: +Math.max(...F.map((f) => f.glc)).toFixed(1), progs0: F[0].progs, progs1: F[F.length - 1].progs },
      nonGl: (() => { const v = F.map((f) => f.cbt - f.glc - f.glu); return { p50: pct(v, 0.5), p95: pct(v, 0.95), p99: pct(v, 0.99), max: pct(v, 1), over33: v.filter((x) => x > 33).length, over50: v.filter((x) => x > 50).length }; })(),
      gap: (() => { const v = F.map((f) => f.gap || 0); return { p50: pct(v, 0.5), p95: pct(v, 0.95), p99: pct(v, 0.99), max: pct(v, 1), over33: v.filter((x) => x > 33).length, over50: v.filter((x) => x > 50).length }; })(),
      drawSpikes: F.filter((f) => f.calls > 1500).length,
    };
  });
  out.drive = { ...res, after: await snapStats() };
  console.log("drive", JSON.stringify({ frames: res.frames, cbt: res.cbt, gap: res.gap, glc: res.glc, glu: res.glu, nonGl: res.nonGl, calls: res.calls, tris: res.tris, alloc: res.allocMBperFrame, maxQueue: res.maxQueue, drawSpikes: res.drawSpikes }));
}
fs.mkdirSync(OUT + "res", { recursive: true });
fs.writeFileSync(`${OUT}res/${label}.json`, JSON.stringify(out, null, 1));
await browser.close();
console.log("done in", (Date.now() - t0) / 1000, "s");
