// Emergency vehicles (ev.glb): 0 = Ford Everest (KPA police, also ForenSys), 1 = Isuzu MU-X (KPA police),
// 2 = Ford E-series cutaway box ambulance (cab + box are separate lofted bodies).
import { suv } from "./specs.mjs";

const win = (n, extra = {}) => ({ n, side: "glass", arc0: "dark", arc: "paint", top: "paint", ...extra });
const pillar = (n, side = "paint") => ({ n, side, arc0: side === "dark" ? "dark" : "paint", arc: "paint", top: "paint" });

export const everest = {
  name: "everest",
  body: {
    ...suv.body,
    z: [-2.42, 2.47], W: 0.93,
    top: [[-2.42, 1.16], [-2.15, 1.2], [-0.8, 1.18], [0.3, 1.15], [0.9, 1.13], [1.55, 1.08], [2.15, 1.03], [2.47, 1.0]],
    bot: [[-2.42, 0.46], [-2.0, 0.36], [-1.75, 0.31], [1.85, 0.31], [2.15, 0.36], [2.47, 0.4]],
    nose: { a: 0.15, b: 0.12 }, tail: { a: 0.1, b: 0.1 }, chin: { a: 0.16, b: 0.1 }, rchin: { a: 0.12, b: 0.05 },
    plan: { fax: 0.24, faz: 0.4, rax: 0.16, raz: 0.24, flare: [[1.5, 0.02, 0.6], [-1.35, 0.022, 0.6]] },
  },
  wheel: { R: 0.38, w: 0.235, zF: 1.5, zR: -1.35, x: 0.8, Ra: 0.44, rim: 0.24, spokes: 6, style: "spoke" },
  cabin: {
    ...suv.cabin, H: 1.84,
    prof: [[-2.3, 1.2], [-2.23, 1.46], [-2.12, 1.74], [-1.9, 1.82], [-0.6, 1.84], [0.05, 1.835], [0.35, 1.72], [0.65, 1.47], [0.95, 1.15]],
    knots: [{ zb: -2.3, zt: -2.3 }, { zb: -2.16, zt: -2.0 }, { zb: -1.95, zt: -1.88 }, { zb: -1.3, zt: -1.25 }, { zb: -1.2, zt: -1.15 }, { zb: -0.42, zt: -0.42 }, { zb: -0.33, zt: -0.33 }, { zb: 0.42, zt: 0.05 }, { zb: 0.95, zt: 0.95 }],
  },
  head: { phi: [-0.22, 1.05], y: [[0.86, 0.97], [0.91, 0.99]], r: 0.3 },
  tail: { phi: [-0.05, 1.15], y: [[0.96, 1.12], [0.94, 1.13]], r: 0.25 },
  grille: { w: 0.5, y: [0.66, 0.9], r: 0.18, chrome: true },
  intake: { w: 0.6, y: [0.42, 0.55], r: 0.35 },
  plateF: 0.6, plateR: 0.66, diffuser: [0.47, 0.55],
  seams: [0.95, -0.38, -1.29], handles: [-0.24, -1.16], skirt: 0.1, cladding: true,
  mirror: { z: 0.68, y: 1.24 }, rails: true, trimLift: 0.004,
  // livery frame (texture covers z x y; panels are cut around the arches); rear text panel
  livery: { z: [-2.16, 2.04], y: [0.42, 1.1] }, rearText: { x: 0.44, y: [0.82, 0.92] }, hood: { x: 0.5, z: [1.55, 2.05] },
  bar: { z: -0.12, w: 1.6 },
};

export const isuzu = {
  ...everest,
  name: "isuzu",
  body: { ...everest.body, nose: { a: 0.18, b: 0.14 }, plan: { ...everest.body.plan, fax: 0.27, faz: 0.44 } },
  cabin: {
    ...everest.cabin, H: 1.82,
    prof: [[-2.3, 1.2], [-2.2, 1.42], [-2.02, 1.68], [-1.72, 1.8], [-0.6, 1.82], [0.05, 1.815], [0.35, 1.7], [0.65, 1.46], [0.95, 1.15]],
    knots: [{ zb: -2.3, zt: -2.3 }, { zb: -2.12, zt: -1.85 }, { zb: -1.9, zt: -1.72 }, { zb: -1.3, zt: -1.25 }, { zb: -1.2, zt: -1.15 }, { zb: -0.42, zt: -0.42 }, { zb: -0.33, zt: -0.33 }, { zb: 0.42, zt: 0.05 }, { zb: 0.95, zt: 0.95 }],
  },
  head: { phi: [-0.15, 1.12], y: [[0.84, 0.95], [0.92, 0.98]], r: 0.4 },
  grille: { w: 0.46, y: [0.62, 0.9], r: 0.3, chrome: true },
  cladding: false,
  wheel: { ...everest.wheel, spokes: 5, style: "twin" },
};

const ambWheel = { R: 0.4, w: 0.25, x: 0.86, Ra: 0.48, rim: 0.24, spokes: 8, style: "steel" };
export const ambCab = {
  name: "ambCab",
  body: {
    z: [0.7, 3.42], W: 1.0,
    top: [[0.7, 1.36], [1.95, 1.36], [2.25, 1.3], [2.8, 1.22], [3.2, 1.17], [3.42, 1.12]],
    bot: [[0.7, 0.48], [2.9, 0.48], [3.42, 0.55]],
    nose: { a: 0.2, b: 0.12 }, tail: { a: 0.03, b: 0.01 }, chin: { a: 0.12, b: 0.06 }, rchin: { a: 0.03, b: 0.01 },
    plan: { fax: 0.14, faz: 0.3, rax: 0.01, raz: 0.03, flare: [[2.4, 0.02, 0.6]] },
    rt: 0.1, rb: 0.06, ti: 0.03, tb: 0.03, crown: 0.03, bulge: 0.01,
  },
  wheel: { ...ambWheel, zF: 2.4, zR: -99 },
  cabin: {
    inset: 0.06, tumble: 0.1, rr: 0.1, crown: 0.02, sink: 0.03, H: 2.33,
    prof: [[0.72, 2.3], [1.45, 2.32], [1.62, 2.26], [1.85, 1.9], [2.05, 1.58], [2.2, 1.38]],
    knots: [{ zb: 0.72, zt: 0.72 }, { zb: 0.9, zt: 0.9 }, { zb: 0.98, zt: 0.98 }, { zb: 1.88, zt: 1.6 }, { zb: 1.96, zt: 1.66 }, { zb: 2.2, zt: 2.2 }],
    bands: [pillar(1), pillar(1, "dark"), win(5), pillar(1, "dark"), { n: 4, side: "paint", arc0: "paint", arc: "paint", top: "glass" }],
  },
  head: { phi: [-0.12, 0.95], y: [[0.88, 1.05], [0.9, 1.05]], r: 0.25 },
  grille: { w: 0.44, y: [0.7, 1.04], r: 0.14, chrome: true },
  plateF: 0.52,
  seams: [1.92, 0.95], handles: [1.08], trimLift: 0.004,
  livery: { z: [0.92, 1.86], y: [0.56, 1.33] },
};

export const ambBox = {
  name: "ambBox",
  body: {
    z: [-3.3, 0.86], W: 1.15,
    top: [[-3.3, 2.97], [0.86, 2.97]],
    bot: [[-3.3, 0.8], [0.86, 0.8]],
    nose: { a: 0.05, b: 0.03 }, tail: { a: 0.05, b: 0.03 }, chin: { a: 0.04, b: 0.02 }, rchin: { a: 0.04, b: 0.02 },
    plan: { fax: 0.03, faz: 0.05, rax: 0.03, raz: 0.05, flare: [] },
    rt: 0.07, rb: 0.03, ti: 0.01, tb: 0.01, crown: 0.012, bulge: 0, dzScale: 2,
  },
  wheel: { ...ambWheel, zF: 99, zR: -2.0, x: 0.98, Ra: 0.5 },
  tail: { phi: [-0.2, 0.7], y: [[0.92, 1.38], [0.92, 1.38]], r: 0.15 },
  plateR: 0.62, trimLift: 0.004,
  livery: { z: [-3.2, 0.78], y: [0.84, 2.9] }, rearText: { x: 1.0, y: [1.02, 1.5] },
  bar: { z: 0.62, w: 1.75 }, marker: { x: 0.85, y: 2.78 },
};
