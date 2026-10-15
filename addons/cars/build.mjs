// Builds game/models/cars.glb (traffic + parked-car kit, 5 variants x 2 LODs).
// Run: npm run cars   (from addons/; CAR_STATS=1 prints per-stage triangle counts)
//
// Kit contract (A's loader, regex /^([a-z]+)(\d+)_L(\d)_([a-z]+)/): one mesh per
// car{variant}_L{lod}_{material}, no node transforms, nose +Z, origin at ground centre.
// Materials are A's street kit set (paint, chrome, glass, plate, dark, light, tail); L0 uses all 7,
// L1 drops chrome, so instanced draw calls per lot are unchanged. Traffic (3/6/9 cars) uses L0;
// parked lots use L0 within parkHi and L1 out to parkR.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as THREE from "three";
import {
  Parts, makeBody, loftBody, hit, loftCabin, cornerDecal, endDecal, sideDecal, topDecal, rounded, lerp,
  tyreGeo, rimFaceGeo, rbox, T, S, RY, mul, wheelSet, sweepBox, outward,
} from "./lib.mjs";
import { KIT } from "./specs.mjs";
import { writeGLB } from "./glb.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, "../../game/models");

const LOD = {
  0: { ring: { bf: 1, ba: 2, s: 3, ta: 3, t: 2 }, ends: 4, arch: 5, dz: 0.45, gap: 0.06, cab: { s: 2, a: 3, t: 2, zf: 0.8 }, tyre: 12, rim: 12, detail: 1 },
  1: { ring: { bf: 0, ba: 1, s: 1, ta: 1, t: 1 }, ends: 2, arch: 2, dz: 1.2, gap: 0.25, cab: { s: 1, a: 1, t: 1, zf: 0.34 }, tyre: 7, rim: 7, detail: 0 },
};

// ---------- shared detail passes ----------
function lights(P, bd, sp, L, key, front) {
  const d = front ? sp.head : sp.tail;
  if (!d) return;
  const nu = L.detail ? 6 : 2, nv = L.detail ? 3 : 1;
  for (const side of [1, -1]) {
    const shape = (grow) => (u, v) => {
      const [lo, hi] = rounded(u, d.r);
      const phi = lerp(d.phi[0] - grow * 1.6, d.phi[1] + grow * 1.6, u);
      const y0 = lerp(d.y[0][0], d.y[1][0], u) - grow * 0.6, y1 = lerp(d.y[0][1], d.y[1][1], u) + grow * 0.6;
      return [phi, lerp(y0, y1, lerp(lo, hi, v))];
    };
    if (L.detail) cornerDecal(P, bd, "dark", nu, nv, front, side, shape(0.018), 0.004);
    cornerDecal(P, bd, key, nu, nv, front, side, shape(0), 0.008);
  }
  if (!front && d.bar) endDecal(P, bd, "tail", L.detail ? 8 : 2, 1, -1, (u, v) => [lerp(-0.62, 0.62, u), lerp(d.y[0][0] + 0.03, d.y[0][0] + 0.05, v)], 0.006);
}
function frontEnd(P, bd, sp, L) {
  const box = (key, w, y, r, eps, dir = 1, nu = L.detail ? 10 : 2, nv = L.detail ? 2 : 1) =>
    endDecal(P, bd, key, nu, nv, dir, (u, v) => { const [lo, hi] = rounded(u, r); return [lerp(-w, w, u), lerp(y[0], y[1], lerp(lo, hi, v))]; }, eps);
  if (sp.grille) {
    if (sp.grille.chrome && L.detail) box("chrome", sp.grille.w + 0.025, [sp.grille.y[0] - 0.02, sp.grille.y[1] + 0.02], sp.grille.r, 0.004);
    box("dark", sp.grille.w, sp.grille.y, sp.grille.r, 0.007);
    if (L.detail) for (let k = 1; k < 4; k++) { const y = lerp(sp.grille.y[0], sp.grille.y[1], k / 4); box(sp.grille.chrome ? "chrome" : "paint", sp.grille.w * 0.92, [y - 0.006, y + 0.006], 0.1, 0.009, 1, 4, 1); }
  }
  if (sp.intake && L.detail) box("dark", sp.intake.w, sp.intake.y, sp.intake.r, 0.005);
  plate(P, bd, L, 1, sp.plateF);
  if (sp.diffuser && L.detail) box("dark", 0.62, sp.diffuser, 0.4, 0.005, -1);
  plate(P, bd, L, -1, sp.plateR);
}
/** flat upright plate, mounted just proud of the most prominent point of the bumper behind it */
function plate(P, bd, L, dir, yc) {
  const pw = 0.26, ph = 0.065, z0 = dir > 0 ? bd.zf - 0.32 : bd.zr + 0.32;
  let z = z0;
  for (let i = 0; i <= 4; i++) for (let j = 0; j <= 2; j++) {
    const h = hit(bd, [lerp(-pw, pw, i / 4), lerp(yc - ph, yc + ph, j / 2), z0], [0, 0, dir]);
    if (h) z = dir > 0 ? Math.max(z, h.p[2]) : Math.min(z, h.p[2]);
  }
  z += dir * 0.02;
  const Q = P.get("plate"), x0 = dir > 0 ? -pw : pw, x1 = -x0;
  const a = Q.v(x0, yc + ph, z, 0, 0), b = Q.v(x1, yc + ph, z, 1, 0), c = Q.v(x1, yc - ph, z, 1, 1), d = Q.v(x0, yc - ph, z, 0, 1);
  Q.t(a, b, c, [0, 0, dir]); Q.t(a, c, d, [0, 0, dir]);
  if (L.detail) P.geo("dark", new THREE.BoxGeometry(pw * 2 + 0.02, ph * 2 + 0.02, Math.abs(z - z0) - 0.004), T(0, yc, (z + z0) / 2 - dir * 0.002));
}
function sideBits(P, bd, sp, L) {
  const B = sp.body, Wh = sp.wheel;
  for (const side of [1, -1]) {
    if (L.detail) for (const z of sp.seams || []) {
      const y0 = Math.max(bd.botL(z) + B.rb, bd.arch(z)) + 0.03, y1 = bd.yt(z) - B.rt * 0.55;
      sideDecal(P, bd, "dark", 1, 3, side, (u, v) => [z + (u - 0.5) * 0.009, lerp(y0, y1, v)], 0.003);
    }
    if (L.detail) for (const z of sp.handles || []) {
      const yh = bd.yt(z) - B.rt * 0.95;
      sideDecal(P, bd, "chrome", 2, 1, side, (u, v) => [z + (u - 0.5) * 0.17, yh + (v - 0.5) * 0.032], 0.006);
    }
    if (sp.skirt && L.detail) {
      const z0 = Wh.zR + Wh.Ra + 0.03, z1 = Wh.zF - Wh.Ra - 0.03;
      sideDecal(P, bd, "dark", 3, 1, side, (u, v) => { const z = lerp(z0, z1, u); return [z, lerp(bd.botL(z) + B.rb * 0.7, bd.botL(z) + sp.skirt, v)]; }, 0.004);
    }
    if (sp.cladding && L.detail) for (const za of [Wh.zF, Wh.zR]) {
      sideDecal(P, bd, "dark", 12, 3, side, (u, v) => { const a = u * Math.PI, rad = Wh.Ra + 0.004 + v * 0.08; return [za + rad * Math.cos(a), Wh.R + rad * Math.sin(a)]; },
        (u, v) => (v > 0 && v < 1 ? 0.028 : 0.004));
    }
  }
}
function mirrors(P, bd, sp) {
  const m = sp.mirror; if (!m) return;
  for (const s of [1, -1]) {
    const x = s * (bd.w(m.z) - sp.cabin.inset * 0.6 + 0.1);
    P.geo("paint", rbox(0.07, 0.055, 0.1, 0.45, 8, 5), mul(T(x, m.y + 0.02, m.z), RY(s * 0.12)));
    P.geo("glass", new THREE.CircleGeometry(1, 8).rotateY(Math.PI), mul(T(x, m.y + 0.02, m.z), RY(s * 0.12), T(s * 0.005, 0, -0.102), S(0.055, 0.042, 1)));
    P.geo("dark", rbox(0.06, 0.018, 0.05, 0.6, 4, 3), T(x - s * 0.08, m.y - 0.02, m.z + 0.02));
  }
}
function chassis(P, bd, sp) {
  const B = sp.body, W = Math.min(B.W - 0.27, sp.wheel.x - sp.wheel.w / 2 - 0.03), y0 = Math.max(0.12, bd.botL(0) - 0.02), y1 = Math.min(bd.yt(sp.wheel.zF), bd.yt(sp.wheel.zR)) - 0.08;
  const z0 = bd.zr + 0.3, z1 = bd.zf - 0.3;
  P.geo("dark", new THREE.BoxGeometry(W * 2, y1 - y0, z1 - z0, 1, 1, 1), T(0, (y0 + y1) / 2, (z0 + z1) / 2));
}
/** wheels in place (kit) */
function kitWheels(P, sp, L) {
  const Wh = sp.wheel;
  for (const w of wheelSet(sp)) {
    const m = (x) => mul(T(w.x + w.s * x, Wh.R, w.z), w.s < 0 ? S(-1, 1, 1) : new THREE.Matrix4());
    P.geo("dark", tyreGeo(Wh.R, Wh.w, Wh.rim, L.tyre, L.detail ? 2 : 0), m(0));
    if (L.detail) {
      P.geo("chrome", rimFaceGeo(Wh.rim, Wh.spokes, L.rim, Wh.style), m(Wh.w / 2 - 0.035));
      P.geo("dark", new THREE.CircleGeometry(Wh.rim, L.rim).rotateY(Math.PI / 2), m(Wh.w / 2 - 0.09));
    } else P.geo("light", new THREE.CircleGeometry(Wh.rim * 0.92, L.rim).rotateY(Math.PI / 2), m(Wh.w / 2 - 0.035));
  }
}

// ---------- vehicles ----------
const tally = (P) => Object.values(P.m).reduce((a, p) => a + p.tris, 0);
function buildCar(sp, L) {
  const P = new Parts(), bd = makeBody(sp), st = {};
  let last = 0;
  const mark = (k) => { const n = tally(P); st[k] = n - last; last = n; };
  loftBody(P, bd, L); mark("body");
  const cab = sp.cabin ? loftCabin(P, bd, L) : null; mark("cabin");
  lights(P, bd, sp, L, "light", true);
  lights(P, bd, sp, L, "tail", false); mark("lights");
  if (sp.name === "bus") busBits(P, bd, sp, L);
  else frontEnd(P, bd, sp, L);
  sideBits(P, bd, sp, L); mark("trim");
  chassis(P, bd, sp);
  if (L.detail) mirrors(P, bd, sp);
  if (sp.bed) topDecal(P, bd, "dark", L.detail ? 4 : 1, L.detail ? 3 : 1, (u, v) => [lerp(-(sp.body.W - 0.1), sp.body.W - 0.1, u), lerp(sp.bed[0], sp.bed[1], v)], 0.004);
  if (sp.rails && L.detail && cab) {
    for (const s of [1, -1]) {
      const path = [];
      for (let z = -1.8; z <= 0.05; z += 0.15) { const sc = cab.sec(z), x = s * (sc.xs(sc.ytop - sc.rr) - sc.rr - 0.06); path.push([x, sc.ytop + 0.01, z]); }
      sweepBox(P, "dark", path, 0.022, 0.035);
    }
  }
  if (L.detail && sp.name !== "bus") {
    const ex = new THREE.CylinderGeometry(0.035, 0.035, 0.14, 10, 1, true).rotateX(Math.PI / 2);
    P.geo("chrome", ex, T(-0.5, bd.botL(bd.zr + 0.3) + 0.02, bd.zr + 0.08), outward(-0.5, bd.botL(bd.zr + 0.3) + 0.02, bd.zr + 0.08));
  }
  mark("misc");
  kitWheels(P, sp, L); mark("wheels");
  if (process.env.CAR_STATS) console.log(sp.name, JSON.stringify(st));
  return { P, bd, cab };
}

function busBits(P, bd, sp, L) {
  const W = sp.body.W, nu = L.detail ? 4 : 1;
  for (const side of [1, -1]) {
    sideDecal(P, bd, "glass", L.detail ? 12 : 2, 1, side, (u, v) => [lerp(-5.45, 4.35, u), lerp(1.28, 2.48, v)], 0.006);
    const Wh = sp.wheel, gap = Wh.Ra + 0.03;
    for (const [z0, z1] of [[-5.5, Wh.zR - gap], [Wh.zR + gap, Wh.zF - gap], [Wh.zF + gap, 5.75]])
      sideDecal(P, bd, "dark", L.detail ? Math.max(1, Math.round((z1 - z0) / 1.2)) : 1, 1, side, (u, v) => [lerp(z0, z1, u), lerp(0.4, 0.62, v)], 0.004);
    if (L.detail) for (let z = -4.3; z < 4.3; z += 1.08) sideDecal(P, bd, "dark", 1, 1, side, (u, v) => [z + (u - 0.5) * 0.09, lerp(1.27, 2.49, v)], 0.009);
    if (side > 0) {
      for (const [z0, z1] of [[4.56, 5.62], [-0.15, 1.0]]) sideDecal(P, bd, "glass", nu, 1, side, (u, v) => [lerp(z0, z1, u), lerp(0.55, 2.55, v)], 0.006);
      if (L.detail) for (const zc of [5.09, 0.425]) sideDecal(P, bd, "dark", 1, 1, side, (u, v) => [zc + (u - 0.5) * 0.04, lerp(0.55, 2.55, v)], 0.009);
    } else sideDecal(P, bd, "glass", nu, 1, side, (u, v) => [lerp(4.55, 5.7, u), lerp(1.28, 2.48, v)], 0.006);
  }
  endDecal(P, bd, "glass", nu, L.detail ? 2 : 1, 1, (u, v) => { const [lo, hi] = rounded(u, 0.08); return [lerp(-1.13, 1.13, u), lerp(0.95, 2.52, lerp(lo, hi, v))]; }, 0.006);
  endDecal(P, bd, "dark", nu, 1, 1, (u, v) => [lerp(-0.95, 0.95, u), lerp(2.6, 2.88, v)], 0.006);
  if (L.detail) endDecal(P, bd, "light", 2, 1, 1, (u, v) => [lerp(-0.72, 0.72, u), lerp(2.68, 2.8, v)], 0.009);
  if (L.detail) endDecal(P, bd, "dark", nu, 1, 1, (u, v) => [lerp(-0.6, 0.6, u), lerp(0.42, 0.62, v)], 0.006);
  endDecal(P, bd, "glass", nu, 1, -1, (u, v) => [lerp(-1.0, 1.0, u), lerp(1.75, 2.55, v)], 0.006);
  if (L.detail) endDecal(P, bd, "dark", nu, 1, -1, (u, v) => [lerp(-1.1, 1.1, u), lerp(0.42, 0.62, v)], 0.006);
  plate(P, bd, L, 1, sp.plateF);
  plate(P, bd, L, -1, sp.plateR);
  if (L.detail) for (const s of [1, -1]) {
    P.geo("dark", rbox(0.06, 0.16, 0.05, 0.5, 6, 4), T(s * (W + 0.18), 2.25, 5.95));
    P.geo("dark", new THREE.CylinderGeometry(0.015, 0.015, 0.3, 5).rotateZ(Math.PI / 2), T(s * (W + 0.05), 2.45, 5.95));
  }
}

// ---------- geometry -> glTF arrays ----------
function toGeom(part) {
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(part.p, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(part.uv, 2));
  g.setIndex(part.i);
  g.computeVertexNormals();
  return g;
}
function prim(g) {
  const n = g.attributes.position.count;
  return {
    pos: new Float32Array(g.attributes.position.array), nrm: new Float32Array(g.attributes.normal.array),
    uv: new Float32Array(g.attributes.uv.array),
    idx: n > 65535 ? new Uint32Array(g.index.array) : new Uint16Array(g.index.array),
  };
}

function buildKit() {
  const nodes = [], stats = [];
  const ORDER = ["paint", "chrome", "glass", "dark", "light", "tail", "plate"];
  for (const lod of [0, 1]) KIT.forEach((sp, v) => {
    const { P } = buildCar(sp, LOD[lod]);
    let tris = 0;
    for (const k of ORDER) {
      const part = P.m[k];
      if (!part || !part.i.length) continue;
      if (lod === 1 && k === "chrome") throw new Error("L1 must not use chrome");
      const g = toGeom(part);
      nodes.push({ name: `car${v}_L${lod}_${k}`, prims: [prim(g)] });
      tris += part.tris;
    }
    stats.push(`car${v} L${lod} (${sp.name}): ${tris} tris, ${Object.keys(P.m).length} materials`);
  });
  const glb = writeGLB({ nodes, root: nodes.map((_, i) => i) });
  fs.writeFileSync(path.join(OUT, "cars.glb"), glb);
  return { size: glb.length, stats };
}

const kit = buildKit();
console.log(`cars.glb ${(kit.size / 1024).toFixed(0)} KB\n  ` + kit.stats.join("\n  "));
