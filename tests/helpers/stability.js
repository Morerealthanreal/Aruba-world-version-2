// Shared helpers for the stability spec and the profiling script.
// A kinematic "rail" moves the player along a fixed route every frame so runs are
// deterministic (same path, same speed) on any machine, and a probe records frame
// times, draw calls, region streaming events and chunk LOD swaps while it runs.

/** Island waypoints (lat, lon). The drive follows roads between them via the nav road graph. */
export const DRIVE_WAYPOINTS = [
  { name: "oranjestad", lat: 12.5186, lon: -70.0358 },
  { name: "eagle-beach", lat: 12.5530, lon: -70.0570 },
  { name: "palm-beach", lat: 12.5735, lon: -70.0450 },
  { name: "noord", lat: 12.5681, lon: -70.0336 },
  { name: "california", lat: 12.6132, lon: -70.0514 },
];

/** Flight loop around the island at a fixed altitude above ground. */
export const FLIGHT_WAYPOINTS = [
  { name: "oranjestad", lat: 12.5186, lon: -70.0358 },
  { name: "california", lat: 12.6132, lon: -70.0514 },
  { name: "alto-vista", lat: 12.5790, lon: -69.9940 },
  { name: "arikok", lat: 12.4960, lon: -69.9330 },
  { name: "san-nicolas", lat: 12.4362, lon: -69.9105 },
  { name: "airport", lat: 12.5014, lon: -70.0152 },
  { name: "oranjestad", lat: 12.5186, lon: -70.0358 },
];

/** Installed before the game loads: frame timing and long-task capture. */
export async function installFrameProbe(page) {
  await page.addInitScript(() => {
    const probe = {
      frames: [],
      longTasks: [],
      t0: 0,
      running: false,
      last: 0,
    };
    window.__awProbe = probe;
    const tick = (now) => {
      if (probe.running) {
        if (probe.last) probe.frames.push([now - probe.t0, now - probe.last]);
        probe.last = now;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    try {
      new PerformanceObserver((list) => {
        if (!probe.running) return;
        for (const e of list.getEntries()) probe.longTasks.push([e.startTime - probe.t0, e.duration]);
      }).observe({ entryTypes: ["longtask"] });
    } catch {
      /* longtask is Chromium-only */
    }
  });
}

/**
 * Build the route in the page and start the rail + streaming probe.
 * mode: "car" or "plane". speed in m/s. For the plane, alt is metres above ground.
 */
export async function startRun(page, { mode, waypoints, speed, alt = 160 }) {
  return page.evaluate(
    ({ mode, waypoints, speed, alt }) => {
      const game = window.game;
      const aw = window.__aw;
      const pts = [];
      const wps = waypoints.map((w) => game.fromLL(w.lat, w.lon));
      if (mode === "car" && aw?.nav?.graph) {
        const nav = aw.nav;
        const g = nav.graph;
        for (let i = 0; i + 1 < wps.length; i++) {
          const a = g.nearest(wps[i].x, wps[i].z);
          const b = g.nearest(wps[i + 1].x, wps[i + 1].z);
          const path = g.findPath(a, b, nav.heap, nav.cameFrom, nav.gScore);
          for (const id of path) {
            const n = g.nodes[id];
            const prev = pts[pts.length - 1];
            if (!prev || Math.hypot(prev.x - n.x, prev.z - n.z) > 0.5) pts.push({ x: n.x, z: n.z });
          }
        }
      } else {
        for (const p of wps) pts.push({ x: p.x, z: p.z });
      }
      // cumulative distance for constant-speed interpolation
      const cum = [0];
      for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].z - pts[i - 1].z));
      const total = cum[cum.length - 1];

      const at = (d) => {
        d = Math.min(Math.max(0, d), total);
        let lo = 0, hi = cum.length - 1;
        while (hi - lo > 1) { const m = (lo + hi) >> 1; if (cum[m] <= d) lo = m; else hi = m; }
        const seg = cum[hi] - cum[lo] || 1, t = (d - cum[lo]) / seg;
        const a = pts[lo], b = pts[hi];
        return { x: a.x + (b.x - a.x) * t, z: a.z + (b.z - a.z) * t, h: Math.atan2(-(b.x - a.x), -(b.z - a.z)) };
      };

      const real = game.real;
      const M = real.M;
      const radius = real.q.radius;
      const S = game.S;
      const start = at(0);
      if (mode === "car") game.teleport("car", start.x, start.z, start.h);
      else game.teleport("plane", start.x, start.z, start.h);

      const probe = window.__awProbe;
      const run = {
        mode, total, dist: 0, done: false,
        regions: new Map(), // key -> { firstSeen, built, disposed[], loads }
        events: [],
        samples: [],
        lodSwaps: 0,
        lateEnter: [], // player entered a region before it was built
        visibleLoss: [], // a built region within radius was disposed
        draws: [],
      };
      window.__awRun = run;
      probe.frames.length = 0;
      probe.longTasks.length = 0;
      probe.t0 = performance.now();
      probe.last = 0;
      probe.running = true;

      // region dispose hook (events with the player distance at dispose time)
      const origDispose = real.disposeRegion.bind(real);
      real.disposeRegion = (R) => {
        const k = R.rx + "," + R.rz;
        const cx = M.X0 + (R.rx + 0.5) * M.RS, cz = M.Z0 + (R.rz + 0.5) * M.RS;
        const p = mode === "car" ? S.car : S.plane;
        const d = Math.max(0, Math.hypot(cx - p.x, cz - p.z) - M.RS * 0.71);
        const t = performance.now() - probe.t0;
        run.events.push(["dispose", t, k, Math.round(d), R.state]);
        const r = run.regions.get(k);
        if (r) r.disposed.push(t);
        if (R.state === "built" && d < radius) run.visibleLoss.push([t, k, Math.round(d)]);
        return origDispose(R);
      };
      run.restore = () => { real.disposeRegion = origDispose; };

      // chunk LOD swap counter (terrain chunk step changes)
      const chunkStep = new WeakMap();

      // main-scene draw calls per frame
      const renderer = game.renderer;
      const origRender = renderer.render.bind(renderer);
      renderer.render = (scene, cam) => {
        const r = origRender(scene, cam);
        if (scene === game.scene && probe.running) run.draws.push(renderer.info.render.calls);
        return r;
      };
      run.restoreRender = () => { renderer.render = origRender; };

      let lastNow = performance.now();
      let sampleT = 0;
      const step = () => {
        if (run.done) return;
        const now = performance.now();
        const dt = Math.min(0.25, (now - lastNow) / 1000);
        lastNow = now;
        run.dist += speed * dt;
        const p = at(run.dist);
        if (mode === "car") {
          S.car.x = p.x; S.car.z = p.z; S.car.h = p.h; S.car.s = speed;
        } else {
          const gy = Math.max(0, real.heightAt(p.x, p.z));
          S.plane.x = p.x; S.plane.z = p.z; S.plane.h = p.h; S.plane.p = 0; S.plane.r = 0;
          S.plane.y = gy + alt; S.plane.s = speed; S.plane.thr = 0.6;
        }
        // streaming bookkeeping
        const t = now - probe.t0;
        for (const [k, R] of real.regions) {
          let r = run.regions.get(k);
          if (!r || (r.disposed.length && r.disposed[r.disposed.length - 1] > (r.lastLoad || 0))) {
            if (!r) { r = { firstSeen: t, built: null, disposed: [], loads: 0, lastLoad: t }; run.regions.set(k, r); }
            r.loads++; r.lastLoad = t; r.built = null;
            run.events.push(["load", t, k]);
          }
          if (R.state === "built" && r.built === null) { r.built = t; run.events.push(["built", t, k, Math.round(t - r.lastLoad)]); }
          if (R.chunks) for (const c of R.chunks) {
            const prev = chunkStep.get(c);
            if (prev !== undefined && prev !== c.step) run.lodSwaps++;
            chunkStep.set(c, c.step);
          }
        }
        // did the player enter a region that is not built yet? (late pop-in)
        const rx = Math.floor((p.x - M.X0) / M.RS), rz = Math.floor((p.z - M.Z0) / M.RS);
        const key = rx + "," + rz;
        const R = real.regions.get(key);
        if (mode === "car" && real.exists?.has?.(key) && (!R || R.state !== "built")) {
          const last = run.lateEnter[run.lateEnter.length - 1];
          if (!last || last[1] !== key) run.lateEnter.push([Math.round(t), key, R ? R.state : "none"]);
        }
        if (t - sampleT > 1000) {
          sampleT = t;
          const mem = renderer.info.memory;
          run.samples.push({ t: Math.round(t), dist: Math.round(run.dist), regions: real.regions.size, queue: real.queue.length, textures: mem.textures, geometries: mem.geometries });
        }
        if (run.dist >= total) { run.done = true; return; }
        requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      return { points: pts.length, total: Math.round(total) };
    },
    { mode, waypoints, speed, alt },
  );
}

/** Wait for the rail to finish (or maxMs), stop probing and return a summary. */
export async function finishRun(page, maxMs) {
  await page.waitForFunction(() => window.__awRun?.done, undefined, { timeout: maxMs, polling: 1000 }).catch(() => {});
  return page.evaluate(() => {
    const run = window.__awRun, probe = window.__awProbe;
    run.done = true;
    probe.running = false;
    run.restore?.();
    run.restoreRender?.();
    const dts = probe.frames.map((f) => f[1]);
    const sorted = [...dts].sort((a, b) => a - b);
    const pct = (q) => (sorted.length ? sorted[Math.min(sorted.length - 1, Math.floor(q * sorted.length))] : 0);
    const dur = probe.frames.length ? probe.frames[probe.frames.length - 1][0] : 0;
    const draws = run.draws;
    const reloads = [...run.regions.values()].filter((r) => r.loads > 1).length;
    const buildLat = run.events.filter((e) => e[0] === "built").map((e) => e[3]).sort((a, b) => a - b);
    return {
      mode: run.mode,
      seconds: +(dur / 1000).toFixed(1),
      distance: Math.round(run.dist),
      frames: dts.length,
      fps: +(dts.length / (dur / 1000 || 1)).toFixed(1),
      p50: +pct(0.5).toFixed(1), p95: +pct(0.95).toFixed(1), p99: +pct(0.99).toFixed(1),
      max: +(sorted[sorted.length - 1] || 0).toFixed(1),
      over100: dts.filter((d) => d > 100).length,
      over250: dts.filter((d) => d > 250).length,
      over500: dts.filter((d) => d > 500).length,
      longTasks: probe.longTasks.length,
      longTaskMax: Math.round(Math.max(0, ...probe.longTasks.map((l) => l[1]))),
      drawsAvg: draws.length ? Math.round(draws.reduce((a, b) => a + b, 0) / draws.length) : 0,
      drawsMax: draws.length ? Math.max(...draws) : 0,
      regionsLoaded: run.events.filter((e) => e[0] === "load").length,
      regionsBuilt: buildLat.length,
      regionsDisposed: run.events.filter((e) => e[0] === "dispose").length,
      regionReloads: reloads,
      buildLatencyP50: buildLat.length ? buildLat[Math.floor(buildLat.length / 2)] : 0,
      buildLatencyMax: buildLat.length ? buildLat[buildLat.length - 1] : 0,
      lodSwaps: run.lodSwaps,
      lateEnter: run.lateEnter,
      visibleLoss: run.visibleLoss,
      texStart: run.samples[0]?.textures, texEnd: run.samples[run.samples.length - 1]?.textures,
      samples: run.samples,
      events: run.events,
      spikes: probe.frames.filter((f) => f[1] > 250).map((f) => [Math.round(f[0]), Math.round(f[1])]),
    };
  });
}
