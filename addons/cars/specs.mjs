// Vehicle definitions. Kit index = A's variant number (traffic / parked lots pick them by index;
// 3 and 4 get a white fleet paint in traffic, 4 is excluded from crash scenes).
const win = (n, extra = {}) => ({ n, side: "glass", arc0: "dark", arc: "paint", top: "paint", ...extra });
const pillar = (n, side = "paint") => ({ n, side, arc0: side === "dark" ? "dark" : "paint", arc: "paint", top: "paint" });

export const sedan = {
  name: "sedan",
  body: {
    z: [-2.36, 2.36], W: 0.9,
    top: [[-2.36, 1.0], [-2.0, 1.03], [-1.6, 1.02], [-0.8, 0.98], [0.3, 0.94], [0.85, 0.915], [1.5, 0.855], [2.05, 0.8], [2.36, 0.77]],
    bot: [[-2.36, 0.33], [-1.9, 0.27], [-1.6, 0.235], [1.65, 0.235], [2.0, 0.26], [2.36, 0.28]],
    nose: { a: 0.14, b: 0.1 }, tail: { a: 0.12, b: 0.2 }, chin: { a: 0.12, b: 0.08 }, rchin: { a: 0.1, b: 0.04 },
    plan: { fax: 0.3, faz: 0.46, rax: 0.22, raz: 0.3, flare: [[1.38, 0.012, 0.55], [-1.32, 0.016, 0.6]] },
    rt: 0.15, rb: 0.07, ti: 0.05, tb: 0.035, crown: 0.035, bulge: 0.012,
  },
  wheel: { R: 0.315, w: 0.205, zF: 1.38, zR: -1.32, x: 0.765, Ra: 0.372, rim: 0.215, spokes: 5, style: "twin" },
  cabin: {
    inset: 0.075, tumble: 0.16, rr: 0.12, crown: 0.03, sink: 0.035, H: 1.45,
    prof: [[-1.86, 1.0], [-1.68, 1.11], [-1.4, 1.28], [-1.1, 1.395], [-0.7, 1.44], [-0.25, 1.45], [0.04, 1.425], [0.3, 1.3], [0.58, 1.12], [0.86, 0.925]],
    knots: [{ zb: -1.86, zt: -1.86 }, { zb: -1.62, zt: -1.12 }, { zb: -1.4, zt: -1.02 }, { zb: -0.42, zt: -0.42 }, { zb: -0.33, zt: -0.33 }, { zb: 0.35, zt: 0.02 }, { zb: 0.86, zt: 0.86 }],
    bands: [{ n: 4, side: "paint", arc0: "paint", arc: "paint", top: "glass" }, pillar(2), win(5), pillar(1, "dark"), win(5), win(5, { top: "glass" })],
  },
  head: { phi: [-0.18, 1.08], y: [[0.63, 0.75], [0.69, 0.765]], r: 0.3 },
  tail: { phi: [-0.5, 1.1], y: [[0.8, 0.945], [0.83, 0.955]], r: 0.25 },
  grille: { w: 0.4, y: [0.5, 0.63], r: 0.35, chrome: true },
  intake: { w: 0.5, y: [0.31, 0.42], r: 0.4 },
  plateF: 0.4, plateR: 0.6, diffuser: [0.31, 0.4],
  seams: [0.86, -0.37, -1.4], handles: [-0.22, -1.22], skirt: 0.06,
  mirror: { z: 0.6, y: 0.99 },
};

export const hatch = {
  name: "hatch",
  body: {
    z: [-2.0, 2.04], W: 0.87,
    top: [[-2.0, 1.02], [-1.7, 1.04], [-0.8, 1.0], [0.2, 0.95], [0.82, 0.92], [1.4, 0.85], [1.85, 0.8], [2.04, 0.78]],
    bot: [[-2.0, 0.36], [-1.6, 0.25], [-1.4, 0.225], [1.45, 0.225], [1.75, 0.26], [2.04, 0.28]],
    nose: { a: 0.16, b: 0.1 }, tail: { a: 0.1, b: 0.12 }, chin: { a: 0.12, b: 0.08 }, rchin: { a: 0.1, b: 0.05 },
    plan: { fax: 0.3, faz: 0.42, rax: 0.2, raz: 0.24, flare: [[1.27, 0.012, 0.5], [-1.25, 0.018, 0.55]] },
    rt: 0.15, rb: 0.07, ti: 0.05, tb: 0.035, crown: 0.03, bulge: 0.012,
  },
  wheel: { R: 0.3, w: 0.185, zF: 1.27, zR: -1.25, x: 0.745, Ra: 0.355, rim: 0.19, spokes: 8, style: "steel" },
  cabin: {
    inset: 0.07, tumble: 0.15, rr: 0.12, crown: 0.03, sink: 0.035, H: 1.5,
    prof: [[-1.9, 1.05], [-1.82, 1.25], [-1.7, 1.42], [-1.45, 1.49], [-0.6, 1.5], [-0.05, 1.475], [0.25, 1.36], [0.55, 1.15], [0.84, 0.94]],
    knots: [{ zb: -1.9, zt: -1.9 }, { zb: -1.78, zt: -1.6 }, { zb: -1.42, zt: -1.38 }, { zb: -0.44, zt: -0.44 }, { zb: -0.36, zt: -0.36 }, { zb: 0.35, zt: 0.0 }, { zb: 0.84, zt: 0.84 }],
    bands: [{ n: 3, side: "paint", arc0: "paint", arc: "paint", top: "glass" }, pillar(2), win(5), pillar(1, "dark"), win(5), win(5, { top: "glass" })],
  },
  head: { phi: [-0.2, 1.12], y: [[0.63, 0.76], [0.7, 0.79]], r: 0.35 },
  tail: { phi: [-0.15, 1.05], y: [[0.84, 1.0], [0.84, 1.02]], r: 0.25 },
  grille: { w: 0.36, y: [0.53, 0.63], r: 0.4 },
  intake: { w: 0.48, y: [0.31, 0.43], r: 0.45 },
  plateF: 0.42, plateR: 0.62, diffuser: [0.34, 0.42],
  seams: [0.84, -0.4, -1.42], handles: [-0.26, -1.24], skirt: 0.055,
  mirror: { z: 0.6, y: 1.0 },
};

export const suv = {
  name: "suv",
  body: {
    z: [-2.34, 2.37], W: 0.93,
    top: [[-2.34, 1.12], [-2.1, 1.16], [-0.8, 1.13], [0.3, 1.1], [0.85, 1.08], [1.5, 1.02], [2.1, 0.97], [2.37, 0.95]],
    bot: [[-2.34, 0.42], [-1.95, 0.32], [-1.7, 0.28], [1.75, 0.28], [2.05, 0.33], [2.37, 0.36]],
    nose: { a: 0.16, b: 0.12 }, tail: { a: 0.1, b: 0.12 }, chin: { a: 0.14, b: 0.08 }, rchin: { a: 0.1, b: 0.04 },
    plan: { fax: 0.26, faz: 0.4, rax: 0.18, raz: 0.24, flare: [[1.42, 0.018, 0.6], [-1.28, 0.02, 0.6]] },
    rt: 0.14, rb: 0.08, ti: 0.04, tb: 0.04, crown: 0.03, bulge: 0.012,
  },
  wheel: { R: 0.36, w: 0.225, zF: 1.42, zR: -1.28, x: 0.79, Ra: 0.42, rim: 0.23, spokes: 6, style: "spoke" },
  cabin: {
    inset: 0.07, tumble: 0.14, rr: 0.13, crown: 0.025, sink: 0.035, H: 1.72,
    prof: [[-2.2, 1.17], [-2.13, 1.4], [-2.02, 1.64], [-1.8, 1.7], [-0.6, 1.72], [0.0, 1.715], [0.3, 1.6], [0.6, 1.38], [0.88, 1.1]],
    knots: [{ zb: -2.2, zt: -2.2 }, { zb: -2.06, zt: -1.9 }, { zb: -1.85, zt: -1.78 }, { zb: -1.25, zt: -1.2 }, { zb: -1.15, zt: -1.1 }, { zb: -0.42, zt: -0.42 }, { zb: -0.33, zt: -0.33 }, { zb: 0.38, zt: 0.02 }, { zb: 0.88, zt: 0.88 }],
    bands: [{ n: 3, side: "paint", arc0: "paint", arc: "paint", top: "glass" }, pillar(2), win(3), pillar(1, "dark"), win(4), pillar(1, "dark"), win(4), win(5, { top: "glass" })],
  },
  head: { phi: [-0.22, 1.08], y: [[0.8, 0.93], [0.86, 0.95]], r: 0.3 },
  tail: { phi: [-0.1, 1.15], y: [[0.92, 1.07], [0.9, 1.08]], r: 0.25 },
  grille: { w: 0.44, y: [0.6, 0.8], r: 0.25, chrome: true },
  intake: { w: 0.55, y: [0.38, 0.5], r: 0.35 },
  plateF: 0.52, plateR: 0.66, diffuser: [0.42, 0.5],
  seams: [0.88, -0.38, -1.25], handles: [-0.22, -1.1], skirt: 0.1, cladding: true,
  mirror: { z: 0.62, y: 1.17 }, rails: true,
};

export const pickup = {
  name: "pickup",
  body: {
    z: [-2.72, 2.58], W: 0.93,
    top: [[-2.72, 1.2], [-1.1, 1.2], [-0.9, 1.19], [0.4, 1.18], [0.95, 1.17], [1.6, 1.12], [2.3, 1.07], [2.58, 1.05]],
    bot: [[-2.72, 0.5], [-2.3, 0.42], [-2.0, 0.34], [1.95, 0.34], [2.25, 0.38], [2.58, 0.4]],
    nose: { a: 0.14, b: 0.12 }, tail: { a: 0.04, b: 0.03 }, chin: { a: 0.14, b: 0.08 }, rchin: { a: 0.05, b: 0.02 },
    plan: { fax: 0.24, faz: 0.36, rax: 0.05, raz: 0.06, flare: [[1.55, 0.02, 0.6], [-1.53, 0.02, 0.6]] },
    rt: 0.1, rb: 0.07, ti: 0.03, tb: 0.04, crown: 0.025, bulge: 0.01,
  },
  wheel: { R: 0.37, w: 0.235, zF: 1.55, zR: -1.53, x: 0.785, Ra: 0.44, rim: 0.215, spokes: 6, style: "spoke" },
  cabin: {
    inset: 0.07, tumble: 0.13, rr: 0.11, crown: 0.025, sink: 0.035, H: 1.81,
    prof: [[-1.0, 1.24], [-0.97, 1.55], [-0.93, 1.79], [-0.85, 1.81], [0.2, 1.81], [0.45, 1.7], [0.7, 1.46], [0.96, 1.19]],
    knots: [{ zb: -1.0, zt: -1.0 }, { zb: -0.96, zt: -0.9 }, { zb: -0.86, zt: -0.84 }, { zb: -0.18, zt: -0.18 }, { zb: -0.1, zt: -0.1 }, { zb: 0.5, zt: 0.24 }, { zb: 0.96, zt: 0.96 }],
    bands: [{ n: 2, side: "paint", arc0: "paint", arc: "paint", top: "glass" }, pillar(1), win(4), pillar(1, "dark"), win(4), win(5, { top: "glass" })],
  },
  head: { phi: [-0.25, 1.05], y: [[0.86, 1.0], [0.9, 1.02]], r: 0.25 },
  tail: { phi: [0.9, 1.45], y: [[0.78, 1.14], [0.78, 1.14]], r: 0.15, vert: true },
  grille: { w: 0.5, y: [0.66, 0.9], r: 0.18, chrome: true },
  intake: { w: 0.56, y: [0.44, 0.56], r: 0.3 },
  plateF: 0.6, plateR: 0.62, diffuser: [0.5, 0.56],
  seams: [0.96, -0.14, -0.98], handles: [-0.02, -0.8], skirt: 0.08, cladding: true,
  mirror: { z: 0.72, y: 1.27 }, bed: [-2.66, -1.06],
};

export const bus = {
  name: "bus",
  body: {
    z: [-5.98, 6.02], W: 1.27,
    top: [[-5.98, 3.0], [6.02, 3.0]],
    bot: [[-5.98, 0.42], [-5.4, 0.36], [5.4, 0.36], [6.02, 0.38]],
    nose: { a: 0.22, b: 0.16 }, tail: { a: 0.18, b: 0.12 }, chin: { a: 0.1, b: 0.04 }, rchin: { a: 0.1, b: 0.04 },
    plan: { fax: 0.2, faz: 0.24, rax: 0.16, raz: 0.2, flare: [] },
    rt: 0.2, rb: 0.06, ti: 0.04, tb: 0.02, crown: 0.02, bulge: 0.008, dzScale: 4,
  },
  wheel: { R: 0.5, w: 0.28, zF: 3.92, zR: -2.42, x: 1.1, Ra: 0.58, rim: 0.3, spokes: 10, style: "steel" },
  head: { phi: [-0.15, 0.95], y: [[0.62, 0.78], [0.62, 0.78]], r: 0.3 },
  tail: { phi: [0.55, 1.4], y: [[0.6, 1.25], [0.6, 1.25]], r: 0.2, vert: true },
  plateF: 0.5, plateR: 0.62,
};

export const KIT = [sedan, hatch, suv, pickup, bus];
