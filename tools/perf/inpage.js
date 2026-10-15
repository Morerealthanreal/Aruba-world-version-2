// Injected after boot. Installs: virtual rAF time (fixed 1/30 s per frame, matches A's __stepN),
// per-callback/per-function timing, renderer.info per-frame + per-category draw tallies.
(() => {
  if (window.__M) return;
  const g = window.game, A = g.real, R = g.renderer;
  const M = (window.__M = { frame: 0, rec: false, frames: [], fn: {}, top: [], vstep: 1000 / 30, vt: 0, cat: null });
  const now = () => performance.now();
  // ---- virtual time for rAF callbacks (add-ons read rAF timestamps)
  const raf0 = window.requestAnimationFrame.bind(window);
  let lastReal = -1, cur = null;
  M.useVirtual = false;
  window.requestAnimationFrame = (cb) => raf0((t) => {
    if (t !== lastReal) { // first callback of a new frame
      lastReal = t;
      if (cur) M.endFrame(cur);
      M.frame++; M.vt += M.vstep;
      cur = { f: M.frame, t0: now(), cb: {}, fn: {}, heap0: performance.memory ? performance.memory.usedJSHeapSize : 0 };
      M.cur = cur;
    }
    const s = now();
    try { cb(M.useVirtual ? M.vt : t); } finally {
      const d = now() - s, k = cb.name || "anon";
      cur.cb[k] = (cur.cb[k] || 0) + d;
    }
  });
  M.endFrame = (c) => {
    c.heap1 = performance.memory ? performance.memory.usedJSHeapSize : 0;
    c.calls = R.info.render.calls; c.tris = R.info.render.triangles;
    R.info.reset();
    if (!M.rec) return;
    let cbt = 0; for (const k in c.cb) cbt += c.cb[k];
    c.cbt = cbt;
    M.frames.push({ f: c.f, cbt, cb: c.cb, fn: c.fn, calls: c.calls, tris: c.tris, dh: c.heap1 - c.heap0, glc: c.glc || 0, glu: c.glu || 0, up: c.up || null, progs: R.info.programs ? R.info.programs.length : 0, x: g.S.car.x, z: g.S.car.z, q: A.queue.length });
  };
  R.info.autoReset = false;
  // ---- time in texture/buffer uploads (first use of a texture/geometry)
  {
    const gl = R.getContext();
    for (const k of ["texImage2D", "texSubImage2D", "texStorage2D", "generateMipmap", "bufferData", "bufferSubData", "compressedTexImage2D", "texImage3D"]) {
      if (!gl[k]) continue;
      const f = gl[k].bind(gl);
      gl[k] = (...a) => { const s = now(); try { return f(...a); } finally { const d = now() - s; if (M.cur) { M.cur.glu = (M.cur.glu || 0) + d; const u = M.cur.up || (M.cur.up = {}); u[k] = (u[k] || 0) + d; } } };
    }
  }
  // ---- time blocked on shader compile/link (first-use status/log queries wait for the driver)
  const gl = R.getContext();
  for (const k of ["getProgramParameter", "getProgramInfoLog", "getShaderInfoLog", "getShaderParameter", "linkProgram", "compileShader"]) {
    const f = gl[k].bind(gl);
    gl[k] = (...a) => { const s = now(); try { return f(...a); } finally { if (M.cur) M.cur.glc = (M.cur.glc || 0) + now() - s; } };
  }
  // ---- function timing
  const stack = [];
  M.wrap = (obj, key, label) => {
    if (!obj || typeof obj[key] !== "function" || obj[key].__w) return false;
    const f = obj[key];
    const w = function (...a) {
      const s = now();
      stack.push(label);
      try { return f.apply(this, a); } finally {
        stack.pop();
        const d = now() - s;
        const e = M.fn[label] || (M.fn[label] = { n: 0, sum: 0, max: 0 });
        if (M.rec) { e.n++; e.sum += d; if (d > e.max) e.max = d; }
        if (M.cur) M.cur.fn[label] = (M.cur.fn[label] || 0) + d;
        if (M.rec && d > 8) { M.top.push({ label, d: +d.toFixed(2), f: M.frame, parent: stack[stack.length - 1] || "" }); }
      }
    };
    w.__w = true; obj[key] = w; return true;
  };
  // ---- per-category draw tally (one frame on demand)
  const rbd = R.renderBufferDirect.bind(R);
  R.renderBufferDirect = function (camera, scene, geometry, material, object, group) {
    if (M.cat) {
      const shadow = material && (material.isMeshDepthMaterial || material.isMeshDistanceMaterial);
      let o = object, name = o.name;
      for (let i = 0; i < 4 && !name && o.parent; i++) { o = o.parent; name = o.name; }
      name = (name || "?").replace(/\d+$/, "#");
      if (/^(Mesh|Wheel|Body|Car)/i.test(name) || object.parent?.name === "car") name = "car/" + name;
      const key = (shadow ? "S " : "  ") + name;
      const t0 = R.info.render.triangles, c0 = R.info.render.calls;
      rbd(camera, scene, geometry, material, object, group);
      const e = M.cat[key] || (M.cat[key] = { calls: 0, tris: 0 });
      e.calls += R.info.render.calls - c0; e.tris += R.info.render.triangles - t0;
      return;
    }
    return rbd(camera, scene, geometry, material, object, group);
  };
})();
