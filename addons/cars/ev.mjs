// Emergency vehicles for evModels.ts (game/models/ev.glb), built with the same lofted-body generator
// as the traffic kit. Nodes: ev{v}_L{lod}_{material} meshes (no transforms, nose +Z, ground origin),
// plus empty marker nodes ev{v}_bar (roof light bar: position, x scale = bar width) and ev{v}_mk
// (right-hand box marker light; the left one is mirrored). Liveries are UV-mapped decals
// (livr/livl sides, cabr/cabl cab doors, hood, rear); UVs follow glTF (v = 0 at the texture top).
import * as THREE from "three";
import { mergeVertices, toCreasedNormals } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import { Parts, makeBody, loftBody, loftCabin, decal, endDecal, sideDecal, rounded, lerp, tyreGeo, rimFaceGeo, rbox, T, S, mul } from "./lib.mjs";
import { lights, frontEnd, plate, sideBits, buildCar, tally, prim } from "./car.mjs";
import { everest, isuzu, ambCab, ambBox } from "./evspecs.mjs";

export const EV_MATS = ["paint", "chrome", "glass", "dark", "light", "tail", "plate", "livr", "livl", "cabr", "cabl", "hood", "rear"];
const LIV_EPS = 0.0035;

/** side livery over the frame sp.livery, cut around the wheel arches; lo/hi bound the panel at z */
function livery(P, bd, sp, keys, L, lo, hi) {
  const { z: [Z0, Z1], y: [Y0, Y1] } = sp.livery, Wh = sp.wheel, m = 0.1;
  const archTop = Wh.R + Wh.Ra + m;
  const gaps = [Wh.zR, Wh.zF].filter((za) => za + Wh.Ra > Z0 && za - Wh.Ra < Z1).sort((a, b) => a - b);
  for (const [side, key] of [[1, keys[0]], [-1, keys[1]]]) {
    const uv = (z, y) => [side > 0 ? (Z1 - z) / (Z1 - Z0) : (z - Z0) / (Z1 - Z0), (Y1 - y) / (Y1 - Y0)];
    const piece = (za, zb, ylo, yhi) => {
      if (zb - za < 0.05) return;
      const nu = Math.max(1, Math.round((zb - za) / (L.detail ? 0.18 : 0.9))), nv = L.detail ? 3 : 1;
      const f = (u, v) => { const z = lerp(za, zb, u); return [z, lerp(ylo(z), yhi(z), v)]; };
      decal(P, bd, key, nu, nv, (u, v) => { const [z, y] = f(u, v); return [[0, y, z], [side, 0, 0]]; }, LIV_EPS, (u, v) => uv(...f(u, v)));
    };
    if (!gaps.length) { piece(Z0, Z1, lo, hi); continue; }
    piece(Z0, Z1, (z) => Math.max(lo(z), archTop), hi);
    const cuts = [Z0, ...gaps.flatMap((za) => [za - Wh.Ra - m, za + Wh.Ra + m]), Z1];
    for (let i = 0; i < cuts.length; i += 2) piece(Math.max(Z0, cuts[i]), Math.min(Z1, cuts[i + 1]), lo, (z) => Math.max(lo(z), archTop));
  }
}
/** flat texture panel on the hood (police "POLIS"), readable from in front of the car */
function hoodText(P, bd, sp, L) {
  const { x, z: [z0, z1] } = sp.hood;
  decal(P, bd, "hood", L.detail ? 4 : 1, L.detail ? 4 : 1, (u, v) => [[lerp(-x, x, u), 4, lerp(z0, z1, v)], [0, -1, 0]], LIV_EPS, (u, v) => [u, v]);
}
function rearText(P, bd, sp, L) {
  const { x, y: [y0, y1] } = sp.rearText;
  endDecal(P, bd, "rear", L.detail ? 4 : 1, 1, -1, (u, v) => [lerp(x, -x, u), lerp(y1, y0, v)], LIV_EPS, (u, v) => [u, v]);
}
const roofAt = (sp, cab, z) => cab.sec(z).ytop + sp.cabin.crown;
/** dark roof-bar base (the lenses are runtime meshes so they can flash) */
function barBase(P, y, z, w, L) {
  P.geo("dark", rbox(w / 2 + 0.03, 0.025, 0.16, 0.3, L.detail ? 10 : 6, L.detail ? 5 : 3), T(0, y + 0.025, z));
}

function buildPolice(sp, L) {
  const { P, bd, cab } = buildCar(sp, L);
  const lo = (z) => bd.botL(z) + (sp.skirt || 0) + 0.02, hi = (z) => bd.yt(z) - sp.body.rt * 0.6;
  livery(P, bd, sp, ["livr", "livl"], L, lo, hi);
  hoodText(P, bd, sp, L);
  rearText(P, bd, sp, L);
  const y = roofAt(sp, cab, sp.bar.z);
  barBase(P, y, sp.bar.z, sp.bar.w, L);
  return { P, marks: { bar: { t: [0, y + 0.05, sp.bar.z], s: [sp.bar.w, 1, 1] } } };
}

function buildAmbulance(L) {
  const P = new Parts();
  // cab: van nose + greenhouse; its rear end is buried in the box
  const cb = makeBody(ambCab);
  loftBody(P, cb, L);
  loftCabin(P, cb, L);
  lights(P, cb, ambCab, L, "light", true);
  frontEnd(P, cb, ambCab, L);
  if (L.detail) endDecal(P, cb, "chrome", 10, 1, 1, (u, v) => { const [a, b] = rounded(u, 0.2); return [lerp(-0.9, 0.9, u), lerp(0.5, 0.68, lerp(a, b, v))]; }, 0.006);
  sideBits(P, cb, ambCab, L);
  livery(P, cb, ambCab, ["cabr", "cabl"], L, () => ambCab.livery.y[0], (z) => cb.yt(z) - ambCab.body.rt * 0.6);
  // box: separate parts so cab decals never land on it (and vice versa)
  const Q = new Parts(), bb = makeBody(ambBox);
  loftBody(Q, bb, L);
  lights(Q, bb, ambBox, L, "tail", false);
  livery(Q, bb, ambBox, ["livr", "livl"], L, () => ambBox.livery.y[0], () => ambBox.livery.y[1]);
  rearText(Q, bb, ambBox, L);
  const nu = L.detail ? 3 : 1;
  for (const [x0, x1] of [[-0.9, -0.1], [0.1, 0.9]]) endDecal(Q, bb, "glass", nu, 1, -1, (u, v) => [lerp(x0, x1, u), lerp(1.75, 2.4, v)], 0.006);
  if (L.detail) {
    endDecal(Q, bb, "dark", 1, 4, -1, (u, v) => [lerp(-0.006, 0.006, u), lerp(0.85, 2.85, v)], 0.009);
    for (const z of [0.72, -0.2]) sideDecal(Q, bb, "dark", 1, 4, 1, (u, v) => [z + (u - 0.5) * 0.012, lerp(0.95, 2.78, v)], 0.008);
    sideDecal(Q, bb, "glass", 2, 1, 1, (u, v) => [lerp(-0.05, 0.6, u), lerp(1.9, 2.4, v)], 0.008);
    for (const s of [1, -1]) for (const y of [2.82, 1.2]) endDecal(Q, bb, y > 2 ? "light" : "tail", 1, 1, -1, (u, v) => [s * lerp(0.92, 1.05, u), lerp(y - 0.05, y + 0.05, v)], 0.008);
  }
  plate(Q, bb, L, -1, ambBox.plateR);
  // chassis rails, rear step, fuel tank
  P.geo("dark", new THREE.BoxGeometry(1.0, 0.36, 3.9), T(0, 0.58, -1.15));
  P.geo("dark", new THREE.BoxGeometry(2.1, 0.16, 0.36), T(0, 0.5, -3.42));
  // van mirrors on arms
  if (L.detail) for (const s of [1, -1]) {
    P.geo("dark", rbox(0.035, 0.19, 0.11, 0.4, 8, 5), T(s * 1.24, 1.78, 1.78));
    P.geo("dark", new THREE.CylinderGeometry(0.014, 0.014, 0.26, 5).rotateZ(Math.PI / 2), T(s * 1.11, 1.66, 1.78));
    P.geo("glass", new THREE.PlaneGeometry(0.17, 0.33).rotateY(Math.PI), T(s * 1.24, 1.78, 1.668));
  }
  // wheels: single front, dual rear (the inner rear tyre has no rim face)
  const Wf = ambCab.wheel, Wr = ambBox.wheel;
  for (const s of [1, -1]) {
    wheel(P, Wf, Wf.zF, s * Wf.x, L, true);
    wheel(P, Wr, Wr.zR, s * Wr.x, L, true);
    wheel(P, Wr, Wr.zR, s * (Wr.x - Wr.w - 0.02), L, false);
  }
  for (const [k, part] of Object.entries(Q.m)) { const D = P.get(k), base = D.p.length / 3; D.p.push(...part.p); D.uv.push(...part.uv); for (const i of part.i) D.i.push(base + i); }
  const bz = ambBox.bar.z, by = 2.97 + ambBox.body.crown + 0.005;
  barBase(P, by, bz, ambBox.bar.w, L);
  return { P, marks: { bar: { t: [0, by + 0.05, bz], s: [ambBox.bar.w, 1, 1] }, mk: { t: [ambBox.marker.x, ambBox.marker.y, ambBox.body.z[1] + 0.005] } } };
}

function wheel(P, Wh, z, x, L, face) {
  const s = Math.sign(x), m = (dx) => mul(T(x + s * dx, Wh.R, z), s < 0 ? S(-1, 1, 1) : new THREE.Matrix4());
  P.geo("dark", tyreGeo(Wh.R, Wh.w, Wh.rim, L.tyre, L.detail ? 2 : 0), m(0));
  if (!face) return;
  if (L.detail) {
    P.geo("chrome", rimFaceGeo(Wh.rim, Wh.spokes, L.rim, Wh.style), m(Wh.w / 2 - 0.035));
    P.geo("dark", new THREE.CircleGeometry(Wh.rim, L.rim).rotateY(Math.PI / 2), m(Wh.w / 2 - 0.09));
  } else P.geo("light", new THREE.CircleGeometry(Wh.rim * 0.92, L.rim).rotateY(Math.PI / 2), m(Wh.w / 2 - 0.035));
}

const UV_MATS = ["plate", "livr", "livl", "cabr", "cabl", "hood", "rear"];
function geom(part, k) {
  let g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(part.p, 3));
  if (UV_MATS.includes(k)) g.setAttribute("uv", new THREE.Float32BufferAttribute(part.uv, 2));
  g.setIndex(part.i);
  g = toCreasedNormals(g, (50 * Math.PI) / 180);
  return mergeVertices(g, 1e-5);
}

export function buildEvGLB(LOD) {
  const nodes = [], stats = [];
  const vars = [(L) => buildPolice(everest, L), (L) => buildPolice(isuzu, L), (L) => buildAmbulance(L)];
  vars.forEach((build, v) => {
    for (const lod of [0, 1]) {
      const { P, marks } = build(LOD[lod]);
      for (const k of EV_MATS) {
        const part = P.m[k];
        if (!part || !part.i.length) continue;
        nodes.push({ name: `ev${v}_L${lod}_${k}`, prims: [prim(geom(part, k))] });
      }
      for (const k of Object.keys(P.m)) if (!EV_MATS.includes(k)) throw new Error("unknown ev material " + k);
      stats.push(`ev${v} L${lod}: ${tally(P)} tris, ${Object.keys(P.m).length} materials`);
      if (lod === 0) for (const [n, m] of Object.entries(marks)) nodes.push({ name: `ev${v}_${n}`, t: m.t, s: m.s });
    }
  });
  return { nodes, stats };
}
