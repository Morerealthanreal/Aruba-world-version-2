// Procedural car geometry: lofted lower body + greenhouse, surface decals (lights, grilles,
// plates, seams), wheels. Units are metres; x right, y up, nose +Z, origin at ground centre.
import * as THREE from "three";

// ---------- small math ----------
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const lerp = (a, b, t) => a + (b - a) * t;
/** monotone cubic (Fritsch-Carlson) through [[x, y], ...], x ascending; clamped outside */
export function mono(pts) {
  const n = pts.length, xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]);
  if (n === 1) return () => ys[0];
  const d = [], m = new Array(n);
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]));
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2;
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) { m[i] = m[i + 1] = 0; continue; }
    const a = m[i] / d[i], b = m[i + 1] / d[i], s = a * a + b * b;
    if (s > 9) { const t = 3 / Math.sqrt(s); m[i] = t * a * d[i]; m[i + 1] = t * b * d[i]; }
  }
  return (x) => {
    if (x <= xs[0]) return ys[0];
    if (x >= xs[n - 1]) return ys[n - 1];
    let i = 0; while (x > xs[i + 1]) i++;
    const h = xs[i + 1] - xs[i], t = (x - xs[i]) / h, t2 = t * t, t3 = t2 * t;
    return (2 * t3 - 3 * t2 + 1) * ys[i] + (t3 - 2 * t2 + t) * h * m[i] + (-2 * t3 + 3 * t2) * ys[i + 1] + (t3 - t2) * h * m[i + 1];
  };
}
/** quarter-ellipse falloff: 0 at `a`, 1 at `b` with a vertical tangent there */
export const ell = (z, a, b) => { const s = clamp((z - a) / (b - a), 0, 1); return 1 - Math.sqrt(1 - s * s); };

// ---------- mesh accumulator ----------
export class Part {
  constructor() { this.p = []; this.uv = []; this.i = []; }
  v(x, y, z, u = 0, w = 0) { this.p.push(x, y, z); this.uv.push(u, w); return this.p.length / 3 - 1; }
  /** triangle; with a hint vector the winding is flipped so the face normal agrees with it */
  t(a, b, c, hint) {
    if (hint) {
      const P = this.p, ax = P[a * 3], ay = P[a * 3 + 1], az = P[a * 3 + 2];
      const ux = P[b * 3] - ax, uy = P[b * 3 + 1] - ay, uz = P[b * 3 + 2] - az;
      const vx = P[c * 3] - ax, vy = P[c * 3 + 1] - ay, vz = P[c * 3 + 2] - az;
      const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx;
      if (nx * hint[0] + ny * hint[1] + nz * hint[2] < 0) { this.i.push(a, c, b); return; }
    }
    this.i.push(a, b, c);
  }
  get tris() { return this.i.length / 3; }
}
export class Parts {
  constructor() { this.m = {}; }
  get(k) { return (this.m[k] ||= new Part()); }
  /** copy a three.js geometry in (matrix applied; mirrored matrices keep outward winding) */
  geo(k, g, mat, orient) {
    const P = this.get(k), src = g.index ? g : g.clone().setIndex([...Array(g.attributes.position.count).keys()]);
    const pos = src.attributes.position, uv = src.attributes.uv, base = P.p.length / 3, v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) { v.fromBufferAttribute(pos, i); if (mat) v.applyMatrix4(mat); P.v(v.x, v.y, v.z, uv ? uv.getX(i) : 0, uv ? uv.getY(i) : 0); }
    const flip = mat && mat.determinant() < 0, idx = src.index.array;
    for (let i = 0; i < idx.length; i += 3) {
      const a = base + idx[i], b = base + idx[i + 1], c = base + idx[i + 2];
      if (orient) {
        const cx = (P.p[a * 3] + P.p[b * 3] + P.p[c * 3]) / 3, cy = (P.p[a * 3 + 1] + P.p[b * 3 + 1] + P.p[c * 3 + 1]) / 3, cz = (P.p[a * 3 + 2] + P.p[b * 3 + 2] + P.p[c * 3 + 2]) / 3;
        P.t(a, b, c, orient(cx, cy, cz));
      } else if (flip) P.i.push(a, c, b); else P.i.push(a, b, c);
    }
  }
  /** grid of points rows[r][c]; quads (r,c)-(r+1,c+1); mat may be a function (r, c) => key|null */
  grid(mat, rows, hint, uvf) {
    const R = rows.length, C = rows[0].length;
    const keys = new Set();
    for (let r = 0; r < R - 1; r++) for (let c = 0; c < C - 1; c++) { const k = typeof mat === "function" ? mat(r, c) : mat; if (k) keys.add(k); }
    for (const k of keys) {
      const P = this.get(k), id = new Map();
      const vi = (r, c) => { const key = r * 65536 + c; let i = id.get(key); if (i === undefined) { const q = rows[r][c], uv = uvf ? uvf(r, c) : [0, 0]; i = P.v(q[0], q[1], q[2], uv[0], uv[1]); id.set(key, i); } return i; };
      for (let r = 0; r < R - 1; r++) for (let c = 0; c < C - 1; c++) {
        if ((typeof mat === "function" ? mat(r, c) : mat) !== k) continue;
        const a = vi(r, c), b = vi(r, c + 1), cc = vi(r + 1, c + 1), d = vi(r + 1, c);
        const h = typeof hint === "function" ? hint(r, c) : hint;
        P.t(a, b, cc, h); P.t(a, cc, d, h);
      }
    }
  }
}

// ---------- three.js geometry helpers ----------
export const T = (x, y, z) => new THREE.Matrix4().makeTranslation(x, y, z);
export const S = (x, y, z) => new THREE.Matrix4().makeScale(x, y, z);
export const RY = (a) => new THREE.Matrix4().makeRotationY(a);
export const mul = (...ms) => ms.reduce((a, b) => a.multiply(b), new THREE.Matrix4());
/** superellipsoid (rounded box) of half-size sx, sy, sz; e: 2 = sphere, -> 0 = box */
export function rbox(sx, sy, sz, e = 0.4, ws = 10, hs = 6) {
  const g = new THREE.SphereGeometry(1, ws, hs), p = g.attributes.position;
  const f = (v) => Math.sign(v) * Math.abs(v) ** e;
  for (let i = 0; i < p.count; i++) p.setXYZ(i, f(p.getX(i)) * sx, f(p.getY(i)) * sy, f(p.getZ(i)) * sz);
  return g;
}
export const outward = (cx, cy, cz) => (x, y, z) => [x - cx, y - cy, z - cz];

// ---------- lower body ----------
/**
 * spec.body: {
 *   z: [zr, zf], W, top: [[z, y]...], bot: [[z, y]...],
 *   nose: {a, b}, tail: {a, b}, chin: {a, b}, rchin: {a, b}   (end roundings: length a, drop/rise b)
 *   plan: {fax, faz, rax, raz, flare: [[z, amp, halfLen]...]} (plan-view corner ellipses, fender bulges)
 *   rt, rb, ti, tb, crown, bulge                                   (cross-section shape)
 * }
 * spec.wheel: {R, w, zF, zR, x, Ra}
 */
export function makeBody(spec) {
  const B = spec.body, Wh = spec.wheel, [zr, zf] = B.z;
  const topL = mono(B.top), botL = mono(B.bot);
  const pl = B.plan;
  const yt = (z) => topL(z) - B.nose.b * ell(z, zf - B.nose.a, zf) - B.tail.b * ell(z, zr + B.tail.a, zr);
  const ybB = (z) => botL(z) + B.chin.b * ell(z, zf - B.chin.a, zf) + B.rchin.b * ell(z, zr + B.rchin.a, zr);
  const axles = [Wh.zF, Wh.zR];
  const arch = (z) => { let y = -1; for (const a of axles) { const d = Math.abs(z - a); if (d < Wh.Ra) y = Math.max(y, Wh.R + Math.sqrt(Wh.Ra * Wh.Ra - d * d)); } return y; };
  const yb = (z) => Math.max(ybB(z), arch(z));
  const w = (z) => {
    let v = B.W - pl.fax * ell(z, zf - pl.faz, zf) - pl.rax * ell(z, zr + pl.raz, zr);
    for (const [c, amp, hl] of pl.flare || []) { const t = Math.abs(z - c) / hl; if (t < 1) v += amp * (0.5 + 0.5 * Math.cos(Math.PI * t)); }
    return v;
  };
  const sec = (z) => {
    const b = yb(z), t = yt(z), h = t - b;
    return { yb: b, yt: t, w: w(z), rb: Math.min(B.rb, h * 0.28), rt: Math.min(B.rt, h * 0.48), ti: B.ti, tb: B.tb, crown: B.crown, bulge: B.bulge };
  };
  /** half cross-section from bottom centre round the +x side to top centre; tags give the row type */
  const half = (s, n) => {
    const out = [], tag = [];
    const xb = s.w - s.tb, xt = s.w - s.ti;
    const push = (x, y, k) => { out.push([x, y]); tag.push(k); };
    for (let i = 0; i < n.bf; i++) push((xb - s.rb) * (i / n.bf), s.yb, "bf");
    for (let i = 0; i < n.ba; i++) { const a = -Math.PI / 2 + (i / n.ba) * Math.PI / 2; push(xb - s.rb + s.rb * Math.cos(a), s.yb + s.rb + s.rb * Math.sin(a), "ba"); }
    const y0 = s.yb + s.rb, y1 = s.yt - s.rt;
    for (let i = 0; i < n.s; i++) { const u = i / n.s; push(lerp(xb, xt, u * u) + s.bulge * Math.sin(Math.PI * u), lerp(y0, y1, u), "s"); }
    for (let i = 0; i < n.ta; i++) { const a = (i / n.ta) * Math.PI / 2; push(xt - s.rt + s.rt * Math.cos(a), y1 + s.rt * Math.sin(a), "ta"); }
    const xr = xt - s.rt;
    for (let i = 0; i <= n.t; i++) { const x = xr * (1 - i / n.t); push(x, s.yt + s.crown * (1 - (x / xr) ** 2), "t"); }
    return { pts: out, tag };
  };
  const HI = { bf: 1, ba: 6, s: 8, ta: 10, t: 8 };
  /** top surface height at lateral x (for seating the greenhouse) */
  const topY = (z, x) => {
    const s = sec(z), { pts } = half(s, HI);
    for (let i = pts.length - 1; i > 0; i--) { const [x0, y0] = pts[i], [x1, y1] = pts[i - 1]; if (x >= x0 && x <= x1) return lerp(y0, y1, (x - x0) / (x1 - x0 || 1)); }
    return s.yt - s.rt;
  };
  return { spec, zr, zf, yt, yb, w, sec, half, topY, arch, botL };
}

/** z stations: dense on the end ellipses and around the arches, regular in between */
function bodyStations(bd, lod) {
  const B = bd.spec.body, Wh = bd.spec.wheel, { zr, zf } = bd;
  // arch edges come in pairs (just outside / just inside) so the cut is vertical; they always stay
  const must = [zr, zf], ends = [], opt = [];
  const nE = lod.ends;
  const endE = (a, b) => { for (let k = 0; k < nE; k++) ends.push(lerp(a, b, Math.sin((k / nE) * Math.PI / 2))); };
  endE(zf - Math.max(B.nose.a, B.plan.faz, B.chin.a), zf);
  endE(zr + Math.max(B.tail.a, B.plan.raz, B.rchin.a), zr);
  for (const za of [Wh.zF, Wh.zR]) {
    const n = lod.arch;
    for (let k = 1; k < n; k++) opt.push(za + Wh.Ra * Math.cos((k / n) * Math.PI));
    for (const s of [-1, 1]) must.push(za + s * (Wh.Ra + 0.004), za + s * Wh.Ra * 0.9995);
  }
  const dz = lod.dz * (B.dzScale || 1);
  for (let z = zr + dz; z < zf; z += dz) opt.push(z);
  const keep = must.filter((z) => z >= zr && z <= zf);
  const add = (list, gap) => { for (const z of list) if (z > zr && z < zf && keep.every((k) => Math.abs(k - z) >= gap)) keep.push(z); };
  add(ends, 0.015);
  add(opt, lod.gap);
  return keep.sort((a, b) => a - b);
}

export function loftBody(parts, bd, lod) {
  const zs = bodyStations(bd, lod);
  const rings = [], tags = [];
  for (const z of zs) {
    const { pts, tag } = bd.half(bd.sec(z), lod.ring);
    const ring = [];
    for (let i = 0; i < pts.length; i++) ring.push([pts[i][0], pts[i][1], z]);
    for (let i = pts.length - 2; i >= 0; i--) ring.push([-pts[i][0], pts[i][1], z]);
    rings.push(ring);
    if (!tags.length) { for (const t of tag) tags.push(t); for (let i = tag.length - 2; i >= 0; i--) tags.push(tag[i]); }
  }
  // rows of the grid = stations; columns = ring points. face column c lies between ring points c, c+1
  const matOf = (r, c) => {
    const t = c < tags.length / 2 ? tags[c] : tags[c + 1];
    return t === "bf" ? "dark" : "paint";
  };
  parts.grid(matOf, rings);
  // end caps (flat fans): front faces +z, rear faces -z
  for (const [ri, dir] of [[rings.length - 1, 1], [0, -1]]) {
    const ring = rings[ri], cx = 0, cy = ring.reduce((a, p) => a + p[1], 0) / ring.length, cz = ring[0][2];
    const P = parts.get("paint"), c = P.v(cx, cy, cz), ids = ring.map((q) => P.v(q[0], q[1], q[2]));
    for (let i = 0; i < ids.length; i++) P.t(c, ids[i], ids[(i + 1) % ids.length], [0, 0, dir]); // closes the bottom when lod.ring.bf = 0
  }
  meshHits(bd, parts);
  return zs.length;
}

// ---------- greenhouse ----------
/**
 * spec.cabin: { inset, tumble, rr, crown, sink, prof: [[z, y]...], H,
 *   knots: [{zb, zt}...] rear -> front, bands: [{n, side, arc0, arc, top}...] }
 */
export function loftCabin(parts, bd, lod) {
  const C = bd.spec.cabin, prof = mono(C.prof), ns = lod.cab.s, na = lod.cab.a, nt = lod.cab.t;
  const sec = (z) => {
    const wb = bd.w(z) - C.inset, belt = bd.yt(z), ybase = bd.topY(z, wb) - C.sink;
    const ytop = Math.max(prof(z), belt + 0.012), h = ytop - ybase;
    const xs = (y) => wb - C.tumble * clamp((y - belt) / (C.H - belt), 0, 1);
    return { wb, ybase, ytop, rr: Math.min(C.rr, h * 0.45), xs };
  };
  const pt = (z, k) => {
    const s = sec(z), ys = s.ytop - s.rr, xT = s.xs(ys), cx = xT - s.rr;
    if (k <= ns) { const y = lerp(s.ybase, ys, k / ns); return [s.xs(y), y]; }
    if (k <= ns + na) { const a = ((k - ns) / na) * Math.PI / 2; return [cx + s.rr * Math.cos(a), ys + s.rr * Math.sin(a)]; }
    const x = cx * (1 - (k - ns - na) / nt);
    return [x, s.ytop + C.crown * (1 - (x / cx) ** 2)];
  };
  const H = ns + na + nt; // half-ring segments
  const vOf = (k) => (k <= ns ? k / ns : 1);
  const K = C.knots;
  const colsPer = C.bands.map((b) => Math.max(1, Math.round(b.n * lod.cab.zf)));
  const nCols = colsPer.reduce((a, b) => a + b, 0) + 1;
  const zAt = (col, k) => {
    let c = col, bi = 0;
    while (bi < colsPer.length - 1 && c > colsPer[bi]) { c -= colsPer[bi]; bi++; }
    const v = vOf(k), z0 = lerp(K[bi].zb, K[bi].zt, v), z1 = lerp(K[bi + 1].zb, K[bi + 1].zt, v);
    return lerp(z0, z1, c / colsPer[bi]);
  };
  const bandOf = (col) => { let c = col, bi = 0; while (bi < colsPer.length - 1 && c >= colsPer[bi]) { c -= colsPer[bi]; bi++; } return C.bands[bi]; };
  const rows = [];
  for (let col = 0; col < nCols; col++) {
    const ring = [];
    for (let k = 0; k <= H; k++) { const z = zAt(col, k), [x, y] = pt(z, k); ring.push([x, y, z]); }
    for (let k = H - 1; k >= 0; k--) { const z = zAt(col, k), [x, y] = pt(z, k); ring.push([-x, y, z]); }
    rows.push(ring);
  }
  const rowType = (c) => { const k = c < H ? c : 2 * H - 1 - c; return k < ns ? "side" : k === ns ? "arc0" : k < ns + na ? "arc" : "top"; };
  parts.grid((r, c) => bandOf(r)[rowType(c)], rows);
  // tiny end caps (hidden in the cowl / deck)
  for (const [ri, dir] of [[rows.length - 1, 1], [0, -1]]) {
    const ring = rows[ri], P = parts.get("dark"), cy = ring.reduce((a, p) => a + p[1], 0) / ring.length;
    const c = P.v(0, cy, ring[H][2]), ids = ring.map((q) => P.v(q[0], q[1], q[2]));
    for (let i = 0; i < ids.length - 1; i++) P.t(c, ids[i], ids[i + 1], [0, 0, dir]);
  }
  return { sec, prof };
}

// ---------- surface decals ----------
/** decals project onto the lofted mesh itself, not the analytic surface it samples (set by loftBody) */
function meshHits(bd, parts) {
  const pos = [], idx = [];
  for (const k of ["paint", "dark"]) {
    const P = parts.m[k]; if (!P) continue;
    const base = pos.length / 3;
    pos.push(...P.p); for (const i of P.i) idx.push(base + i);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
  bd.mesh = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }));
  bd.ray = new THREE.Raycaster();
}
/** first surface crossing on a ray from o along d; out = the ray leaves the body there */
export function hit(bd, o, d, tMax = 3) {
  bd.ray.set(new THREE.Vector3(...o), new THREE.Vector3(...d).normalize());
  bd.ray.far = tMax;
  const h = bd.ray.intersectObject(bd.mesh, false)[0];
  if (!h) return null;
  return { p: [h.point.x, h.point.y, h.point.z], out: h.face.normal.dot(bd.ray.ray.direction) > 0 };
}
/**
 * decal grid over (u, v) in [0,1]^2; ray(u, v) -> [origin, dir]. Lifted eps (or eps(u, v)) off the surface.
 * uvf(u, v) gives texture coords (plates).
 */
export function decal(parts, bd, key, nu, nv, ray, eps = 0.005, uvf) {
  const H = [];
  for (let j = 0; j <= nv; j++) {
    const row = [];
    for (let i = 0; i <= nu; i++) {
      const [o, d] = ray(i / nu, j / nv), h = hit(bd, o, d);
      if (!h) { console.warn(`decal miss (${key}) at u=${(i / nu).toFixed(2)} v=${(j / nv).toFixed(2)} o=${o.map((x) => x.toFixed(2))}`); return false; }
      const s = h.out ? 1 : -1;
      row.push({ p: h.p, d: [d[0] * s, d[1] * s, d[2] * s] });
    }
    H.push(row);
  }
  // lift along the decal's own surface normal (rays can be far from the normal on curved panels)
  const at = (j, i) => H[clamp(j, 0, nv)][clamp(i, 0, nu)].p;
  // a flat cell sinks below a convex panel; raise its corners by how far the cell centre is under the surface
  const need = H.map((row) => row.map(() => 0));
  for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) {
    const [o, d] = ray((i + 0.5) / nu, (j + 0.5) / nv), h = hit(bd, o, d);
    if (!h) continue;
    const cs = [at(j, i), at(j, i + 1), at(j + 1, i), at(j + 1, i + 1)];
    const c = [0, 1, 2].map((k) => cs.reduce((a, p) => a + p[k], 0) / 4);
    const q = H[j][i].d, dep = (h.p[0] - c[0]) * q[0] + (h.p[1] - c[1]) * q[1] + (h.p[2] - c[2]) * q[2];
    if (dep > 0) for (const [jj, ii] of [[j, i], [j, i + 1], [j + 1, i], [j + 1, i + 1]]) need[jj][ii] = Math.max(need[jj][ii], dep);
  }
  const rows = H.map((row, j) => row.map((q, i) => {
    const a = at(j, i + 1), b = at(j, i - 1), c = at(j + 1, i), e = at(j - 1, i);
    const tu = [a[0] - b[0], a[1] - b[1], a[2] - b[2]], tv = [c[0] - e[0], c[1] - e[1], c[2] - e[2]];
    let n = [tu[1] * tv[2] - tu[2] * tv[1], tu[2] * tv[0] - tu[0] * tv[2], tu[0] * tv[1] - tu[1] * tv[0]];
    const l = Math.hypot(...n);
    n = l > 1e-9 ? n.map((x) => x / l) : q.d;
    if (n[0] * q.d[0] + n[1] * q.d[1] + n[2] * q.d[2] < 0) n = n.map((x) => -x);
    const k = (typeof eps === "function" ? eps(i / nu, j / nv) : eps) + need[j][i];
    return [q.p[0] + n[0] * k, q.p[1] + n[1] * k, q.p[2] + n[2] * k, n[0], n[1], n[2]];
  }));
  parts.grid(key, rows, (r, c) => rows[r][c].slice(3), uvf ? (r, c) => uvf(c / nu, r / nv) : undefined);
  return true;
}
/** rounded-rectangle bounds for decals: v range at u for a box of corner radius rf (fraction of height) */
export const rounded = (u, rf) => {
  const k = clamp(Math.min(u, 1 - u) / Math.max(rf, 1e-3), 0, 1);
  const c = 1 - Math.sqrt(Math.max(0, 1 - (1 - k) ** 2));
  return [c * rf, 1 - c * rf];
};
/** side-surface decal at (z, y) rectangle-ish region: f(u, v) -> [z, y]; side = +1 / -1 */
export function sideDecal(parts, bd, key, nu, nv, side, f, eps = 0.004) {
  return decal(parts, bd, key, nu, nv, (u, v) => { const [z, y] = f(u, v); return [[0, y, z], [side, 0, 0]]; }, eps);
}
/** front (dir=+1) or rear (dir=-1) decal: f(u, v) -> [x, y] */
export function endDecal(parts, bd, key, nu, nv, dir, f, eps = 0.004, uvf) {
  const zc = dir > 0 ? bd.zf - 0.32 : bd.zr + 0.32;
  return decal(parts, bd, key, nu, nv, (u, v) => { const [x, y] = f(u, v); return [[x, y, zc], [0, 0, dir]]; }, eps, uvf);
}
/** corner decal: rays fan out horizontally from the plan-corner centre; f(u, v) -> [phi, y] */
export function cornerDecal(parts, bd, key, nu, nv, front, side, f, eps = 0.005) {
  const pl = bd.spec.body.plan, W = bd.spec.body.W;
  const cz = front ? bd.zf - pl.faz : bd.zr + pl.raz, cx = side * (W - (front ? pl.fax : pl.rax)) * 0.85;
  return decal(parts, bd, key, nu, nv, (u, v) => {
    const [phi, y] = f(u, v);
    return [[cx, y, cz], [side * Math.sin(phi), 0, (front ? 1 : -1) * Math.cos(phi)]];
  }, eps);
}
/** top decal (rays straight down from above): f(u, v) -> [x, z] */
export function topDecal(parts, bd, key, nu, nv, f, eps = 0.004) {
  return decal(parts, bd, key, nu, nv, (u, v) => { const [x, z] = f(u, v); return [[x, 4, z], [0, -1, 0]]; }, eps);
}

// ---------- wheels ----------
/** tyre around the +x axis at the origin; outer radius R, width w. No inboard sidewall (never seen); prof 0 = square shoulder */
export function tyreGeo(R, w, rim, seg, prof = 2) {
  const pts = [], sh = Math.min(0.06, (R - rim) * 0.45), hw = w / 2;
  pts.push(new THREE.Vector2(R - sh * 0.3, -hw));
  if (!prof) pts.push(new THREE.Vector2(R, hw));
  else for (let i = 0; i <= prof; i++) { const a = (i / prof) * Math.PI / 2; pts.push(new THREE.Vector2(R - sh + sh * Math.cos(a), hw - sh + sh * Math.sin(a))); }
  pts.push(new THREE.Vector2(rim, hw * 0.92));
  return new THREE.LatheGeometry(pts, seg).rotateZ(-Math.PI / 2);
}
/** alloy face: disc of radius r with `spokes` windows; faces +x */
export function rimFaceGeo(r, spokes, seg, style = "spoke") {
  const sh = new THREE.Shape(); sh.absarc(0, 0, r, 0, Math.PI * 2, false);
  const hub = r * 0.3, inner = r * 0.84;
  if (style === "spoke" || style === "twin") {
    const gap = (Math.PI * 2) / spokes, sw = style === "twin" ? 0.42 : 0.3; // spoke angular width fraction
    for (let k = 0; k < spokes; k++) {
      const a0 = k * gap + gap * sw / 2, a1 = (k + 1) * gap - gap * sw / 2, h = new THREE.Path();
      const st = Math.max(2, Math.round(seg / spokes));
      h.moveTo(Math.cos(a0) * hub * 1.25, Math.sin(a0) * hub * 1.25);
      for (let i = 0; i <= st; i++) { const a = lerp(a0 + 0.05, a1 - 0.05, i / st); h.lineTo(Math.cos(a) * inner, Math.sin(a) * inner); }
      h.lineTo(Math.cos(a1) * hub * 1.25, Math.sin(a1) * hub * 1.25);
      h.closePath(); sh.holes.push(h);
      if (style === "twin") { // split each spoke with a slot
        const am = (k + 1) * gap, s = new THREE.Path(), sl = gap * sw * 0.12;
        s.moveTo(Math.cos(am - sl) * hub * 1.6, Math.sin(am - sl) * hub * 1.6); s.lineTo(Math.cos(am - sl * 0.6) * inner * 0.97, Math.sin(am - sl * 0.6) * inner * 0.97);
        s.lineTo(Math.cos(am + sl * 0.6) * inner * 0.97, Math.sin(am + sl * 0.6) * inner * 0.97); s.lineTo(Math.cos(am + sl) * hub * 1.6, Math.sin(am + sl) * hub * 1.6); s.closePath();
        sh.holes.push(s);
      }
    }
  } else if (style === "steel") { // hubcap / steel wheel: ring of round vents
    for (let k = 0; k < spokes; k++) { const a = (k / spokes) * Math.PI * 2, h = new THREE.Path(); h.absarc(Math.cos(a) * r * 0.62, Math.sin(a) * r * 0.62, r * 0.12, 0, Math.PI * 2, true); sh.holes.push(h); }
  }
  return new THREE.ShapeGeometry(sh, Math.max(3, seg / 4)).rotateY(Math.PI / 2); // shape +z normal -> +x
}

// ---------- assembly helpers ----------
export function wheelSet(spec) {
  const Wh = spec.wheel;
  return [[Wh.zF, 1], [Wh.zF, -1], [Wh.zR, 1], [Wh.zR, -1]].map(([z, s]) => ({ z, s, x: s * Wh.x, front: z === Wh.zF }));
}
/** a thin box along a polyline (roof rails, trim) */
export function sweepBox(parts, key, path, wx, wy) {
  const rows = path.map(([x, y, z]) => [[x - wx, y, z], [x - wx, y + wy, z], [x + wx, y + wy, z], [x + wx, y, z], [x - wx, y, z]]);
  parts.grid(key, rows, (r, c) => { const q = rows[r][c], m = path[r]; return [q[0] - m[0], q[1] - m[1] - wy / 2, 0]; });
}
