// Bachelor's Beach (Boca Tabla), the small windward sand cove on the east coast between Boca Grandi and Seroe
// Colorado, accuracy pass. Off with ?bachelors=0.
// A draws the cove as tan ground with a strip of shore foam and deep blue water right up to the sand, with no
// reef and no surf, and only A's generic shrubs behind it. Satellite and photo references show a small pale
// sand pocket in a turquoise cove with a darker sea-grass/rock patch, heavy white windward surf breaking on
// the reef edge off both points (the mouth between them is broken, lighter surf), a shore break along the
// beach strips north and south of the cove, a low pitted limestone lip (OSM natural=cliff) at the back of the
// sand with dark ironshore at the south point, sea grape and creeping beach vines on the dunes behind, low
// dry scrub with kadushi and wind-bent divi-divi on the plateau, and the sandy track that leaves the end of
// A's Seroe Colorado track for a pull-off by the "Bachelors Beach" info board, with a sandy gap down to the beach.
// Geometry is OSM (beach 255369699, coastline 1108799654 / 98105051, cliff 495510393, sand 628177116, path
// 86397011 for the track) and A's road data, rebuilt in code. Reef and surf lines were read off satellite
// imagery by eye; photos are reference only and nothing is textured from them.
// 5 draw calls: one cove/reef colour sheet, one surf ribbon, one sand + track + pull-off sheet, one InstancedMesh
// of scrub clumps and one merged props mesh (limestone lip, ironshore, info board, kadushi, divi-divi).
// Built once (sheets at once, land parts when their height regions have streamed in); per frame only a
// colour/opacity lerp when drawn. Stays between z 9460 and z 9940: well south of Boca Grandi (z < 9160) and
// north of Seroe Colorado (z > 10790), Rodgers Beach and Baby Beach, and out of San Nicolas town.
import {
  BoxGeometry, BufferGeometry, Color, CylinderGeometry, DoubleSide, Euler, Float32BufferAttribute, IcosahedronGeometry,
  InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, MeshLambertMaterial, Quaternion, SphereGeometry, Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { uNight, uTime } from "./uniforms";

type P = number[];
// game metres (x east, z south). COAST: OSM coastline 1108799654 then 98105051, N to S round the cove.
// BEACH: OSM beach ring 255369699; BACK: its inland edge. LEDGE: OSM natural=cliff 495510393 (the low
// limestone lip at the back of the sand). TRACK: OSM path 86397011 from the end of A's track to the pull-off.
const COAST: P[] = [[10680.9,9445.6],[10684.2,9476.0],[10686.0,9487.4],[10687.9,9498.9],[10690.5,9509.3],[10692.4,9517.8],[10694.5,9524.9],[10696.6,9531.7],[10699.4,9540.6],[10702.8,9548.7],[10708.3,9563.6],[10711.2,9574.6],[10713.4,9582.0],[10715.6,9587.7],[10719.2,9601.8],[10720.8,9610.8],[10719.1,9626.8],[10716.9,9630.6],[10714.1,9633.2],[10710.5,9634.1],[10707.9,9632.6],[10703.9,9628.0],[10698.2,9626.7],[10690.5,9628.3],[10684.0,9631.2],[10678.6,9633.6],[10671.4,9637.1],[10665.9,9640.0],[10661.8,9642.5],[10657.9,9645.4],[10654.9,9650.3],[10652.3,9654.5],[10650.0,9660.4],[10648.8,9668.1],[10647.5,9676.2],[10646.8,9684.2],[10646.5,9692.7],[10646.2,9699.1],[10648.5,9705.3],[10651.5,9714.4],[10653.8,9721.7],[10655.4,9727.0],[10658.6,9732.4],[10663.3,9737.6],[10666.8,9742.5],[10671.7,9749.6],[10674.6,9754.1],[10677.8,9757.1],[10685.7,9763.9],[10691.1,9769.0],[10696.3,9773.5],[10703.3,9780.9],[10710.3,9786.2],[10716.9,9788.4],[10725.5,9789.1],[10731.2,9793.9],[10734.7,9799.4],[10735.7,9805.2],[10736.9,9812.6],[10738.3,9818.7],[10739.6,9825.3],[10739.8,9831.0],[10739.9,9838.2],[10737.9,9846.0],[10736.1,9852.1],[10733.4,9857.6],[10730.0,9864.5],[10729.7,9870.3],[10730.4,9874.4],[10732.6,9879.9],[10733.8,9886.7],[10734.5,9892.2],[10736.7,9898.4],[10739.0,9904.2],[10741.2,9908.4],[10744.1,9913.2],[10747.1,9919.4],[10750.0,9927.1]];
const BEACH: P[] = [[10720.8,9610.8],[10719.2,9601.8],[10715.6,9587.7],[10713.4,9582.0],[10711.2,9574.6],[10708.3,9563.6],[10702.8,9548.7],[10699.4,9540.6],[10695.9,9552.3],[10692.6,9568.6],[10691.0,9591.9],[10691.2,9599.2],[10689.8,9607.3],[10685.1,9613.4],[10679.9,9618.0],[10666.5,9626.3],[10653.8,9637.3],[10646.1,9646.5],[10641.0,9654.3],[10635.9,9668.2],[10633.7,9677.5],[10630.9,9689.7],[10639.4,9708.5],[10648.6,9725.5],[10656.5,9740.2],[10699.2,9801.3],[10713.3,9816.8],[10718.9,9826.3],[10722.1,9836.9],[10725.8,9846.7],[10727.2,9855.4],[10730.0,9864.5],[10733.4,9857.6],[10736.1,9852.1],[10737.9,9846.0],[10739.9,9838.2],[10739.8,9831.0],[10739.6,9825.3],[10738.3,9818.7],[10736.9,9812.6],[10735.7,9805.2],[10734.7,9799.4],[10731.2,9793.9],[10725.5,9789.1],[10716.9,9788.4],[10710.3,9786.2],[10703.3,9780.9],[10696.3,9773.5],[10691.1,9769.0],[10685.7,9763.9],[10677.8,9757.1],[10674.6,9754.1],[10671.7,9749.6],[10666.8,9742.5],[10663.3,9737.6],[10658.6,9732.4],[10655.4,9727.0],[10653.8,9721.7],[10651.5,9714.4],[10648.5,9705.3],[10646.2,9699.1],[10646.5,9692.7],[10646.8,9684.2],[10647.5,9676.2],[10648.8,9668.1],[10650.0,9660.4],[10652.3,9654.5],[10654.9,9650.3],[10657.9,9645.4],[10661.8,9642.5],[10665.9,9640.0],[10671.4,9637.1],[10678.6,9633.6],[10684.0,9631.2],[10690.5,9628.3],[10698.2,9626.7],[10703.9,9628.0],[10707.9,9632.6],[10710.5,9634.1],[10714.1,9633.2],[10716.9,9630.6],[10719.1,9626.8]];
const BACK: P[] = BEACH.slice(7, 32);
const LEDGE: P[] = [[10602.7,9630.3],[10612.6,9651.8],[10630.9,9689.7],[10639.4,9708.5],[10648.6,9725.5],[10656.5,9740.2],[10699.2,9801.3],[10709.4,9819.7],[10720.2,9845.6],[10725.8,9870.8],[10732.2,9893.3]];
const TRACK: P[] = [[10406.7,9675.8],[10423.2,9675.4],[10432.3,9674.7],[10449.6,9674.8],[10467.6,9671.4],[10482.5,9668.4],[10502.4,9664.1],[10518.9,9659.4],[10537.1,9657.7],[10554.2,9658.8],[10571.3,9662.6],[10583.6,9670.5]];
// foot path on from the pull-off (OSM 86397011) and the sandy gap through the limestone lip onto the beach (satellite)
const FOOT: P[] = [[10583.6,9670.5],[10595.6,9683.6],[10604.8,9696.4],[10620.0,9698.0],[10636.0,9699.0]];
// reef edge breaker lines (satellite, by eye): heavy surf off the north point, broken lighter break across the
// mouth, heavy surf off the south point; shore break along the narrow beach strips north and south of the cove
const R_N: P[] = [[10728,9470],[10742,9520],[10752,9555],[10763,9590],[10771,9625],[10774,9652]];
const R_M: P[] = [[10768,9666],[10752,9690],[10742,9716],[10744,9744]];
const R_S: P[] = [[10747,9752],[10761,9784],[10778,9806],[10790,9832],[10793,9868],[10796,9930]];
const SB_N: P[] = [[10689,9470],[10697,9510],[10708,9548],[10718,9580],[10726,9606]];
const SB_S: P[] = [[10743,9866],[10742,9886],[10747,9906],[10755,9928]];
const REEF: P[] = [[10726, 9440], ...R_N, ...R_M, ...R_S];
const SEA: P[] = [...COAST, [10900, 9927.1], [10900, 9445.6]];
const PATCH = { x: 10712, z: 9728, rx: 30, rz: 20 }; // dark sea-grass / rock patch in the cove
const PAD = { x: 10577, z: 9664, hl: 13, hw: 8, a: Math.atan2(9670.5 - 9658.8, 10583.6 - 10554.2) };
const SIGN = { x: 10548, z: 9664.5, a: Math.PI }; // info board on the south side of the track, facing arriving cars (-x)
const ROADS: number[][] = [[10369.6,9696.1,10383.6,9687.6,3.3],[10383.6,9687.6,10406.7,9675.8,3.3]]; // end of A's track
const TW = 5.5, FW = 3; // track and foot-path widths
const Z_N = 9460, Z_S = 9940;
const WATER_Y = 0.05;

const hash = (x: number, z: number) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };
const smooth = (a: number, b: number, v: number) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
function inside(p: P[], x: number, z: number) {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, zi] = p[i], [xj, zj] = p[j];
    if ((zi > z) !== (zj > z) && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) c = !c;
  }
  return c;
}
function segDist(x: number, z: number, ax: number, az: number, bx: number, bz: number) {
  const dx = bx - ax, dz = bz - az, L = dx * dx + dz * dz;
  const t = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L)) : 0;
  return Math.hypot(x - ax - t * dx, z - az - t * dz);
}
function lineDist(x: number, z: number, p: P[]) {
  let m = 1e9; for (let i = 1; i < p.length; i++) m = Math.min(m, segDist(x, z, p[i - 1][0], p[i - 1][1], p[i][0], p[i][1])); return m;
}
/** x of the reef edge at this z (the reef lines run roughly north-south), so "seaward of the reef" is x > reefX */
function reefX(z: number) {
  if (z <= REEF[0][1]) return REEF[0][0];
  for (let i = 1; i < REEF.length; i++) {
    const [ax, az] = REEF[i - 1], [bx, bz] = REEF[i];
    if (z <= bz) return ax + (bx - ax) * ((z - az) / Math.max(1e-6, bz - az));
  }
  return REEF[REEF.length - 1][0];
}
const reefDist = (x: number, z: number) => Math.min(lineDist(x, z, R_N), lineDist(x, z, R_M), lineDist(x, z, R_S));
function inPad(x: number, z: number, grow = 0) {
  const dx = x - PAD.x, dz = z - PAD.z, c = Math.cos(PAD.a), s = Math.sin(PAD.a);
  const u = dx * c + dz * s, v = -dx * s + dz * c;
  const ex = Math.max(0, Math.abs(u) - (PAD.hl - PAD.hw)); // rounded ends
  return Math.hypot(ex, v) < PAD.hw + grow;
}
/** Colour every vertex of a geometry and drop uvs, so differently built parts can be merged. */
function paint(g: BufferGeometry, hex: number, jitter = 0, seed = 0) {
  const geo = g.index ? g.toNonIndexed() : g; if (geo !== g) g.dispose();
  geo.deleteAttribute("uv");
  const c = new Color(hex), n = geo.attributes.position.count, a = new Float32Array(n * 3);
  const k = 1 + (hash(seed, 3.7) - 0.5) * jitter;
  for (let i = 0; i < n; i++) { a[i * 3] = c.r * k; a[i * 3 + 1] = c.g * k; a[i * 3 + 2] = c.b * k; }
  geo.setAttribute("color", new Float32BufferAttribute(a, 3));
  return geo;
}

type World = { heightAt(x: number, z: number): number; regions: Map<string, { rx: number; rz: number; H?: unknown }>; M: { X0: number; Z0: number; RS: number } };

export class BachelorsBeach {
  stats = { built: false, coveQuads: 0, surfQuads: 0, sandQuads: 0, clumps: 0, rocks: 0, ms: 0 };
  private timer = 0;
  private sheetDone = false;
  private landDone = false;
  constructor(private g: AGame) {
    this.timer = window.setInterval(() => this.tick(), 1500);
  }

  private key(W: World, x: number, z: number) { return `${Math.floor((x - W.M.X0) / W.M.RS)},${Math.floor((z - W.M.Z0) / W.M.RS)}`; }

  private tick() {
    const W = this.g.real as unknown as World;
    if (!W?.regions || !W.M) return;
    const t0 = performance.now();
    const low = this.g.real?.q?.name === "low";
    if (!this.sheetDone) { this.g.scene.add(this.cove(low), this.surf(low)); this.sheetDone = true; } // flat, needs no heights
    if (!this.landDone) {
      const ready = new Set<string>();
      for (const r of W.regions.values()) if (r.H) ready.add(`${r.rx},${r.rz}`);
      const keys = new Set<string>();
      for (const [x, z] of [...BEACH, ...TRACK, ...LEDGE, [10540, 9480], [10540, 9900]]) keys.add(this.key(W, x, z));
      if ([...keys].every((k) => ready.has(k))) {
        const h = (x: number, z: number) => { const v = W.heightAt(x, z); return Number.isFinite(v) ? v : 0; };
        this.g.scene.add(this.sand(h, low), this.scrub(h, low), this.props(h, low));
        this.landDone = true;
      }
    }
    if (this.landDone) { window.clearInterval(this.timer); this.stats.built = true; }
    this.stats.ms += Math.round(performance.now() - t0);
  }

  /** Cove colour sheet: pale aqua over the sand, turquoise cove with a dark patch, reef band, fading out past the reef. */
  private cove(low: boolean): Mesh {
    const S = low ? 6 : 4, OUT = 70;
    const x0 = Math.floor(10630 / S) * S, x1 = 10880, z0 = Math.floor(Z_N / S) * S, z1 = Z_S;
    const nx = Math.ceil((x1 - x0) / S) + 1, nz = Math.ceil((z1 - z0) / S) + 1;
    const pos: number[] = [], col: number[] = [], idx: number[] = [], vid = new Int32Array(nx * nz).fill(-1);
    const shoreC = new Color(0xd6fbf2), midC = new Color(0x62d8cf), coveC = new Color(0x3cc2bf), patchC = new Color(0x22706f);
    const bandC = new Color(0x26757a), coralC = new Color(0x4a5d4b), deepC = new Color(0x1a5f86), c = new Color();
    const vert = (i: number, j: number) => {
      const k = j * nx + i; if (vid[k] >= 0) return vid[k];
      const x = x0 + i * S, z = z0 + j * S;
      const dShore = lineDist(x, z, COAST), dReef = reefDist(x, z), dOut = x - reefX(z);
      // sandy shallows -> turquoise ~45 m out (small cove, steeper than the leeward bays)
      c.copy(shoreC).lerp(midC, smooth(0, 45, dShore)).lerp(coveC, smooth(45, 110, dShore) * 0.6);
      const ps = Math.hypot((x - PATCH.x) / PATCH.rx, (z - PATCH.z) / PATCH.rz);
      c.lerp(patchC, (1 - smooth(0.5, 1.15, ps)) * 0.65 * (0.8 + 0.2 * Math.sin(x * 0.11 + z * 0.07)));
      // reef band on the inner side of the breaker lines, patchy coral heads
      const n = Math.sin(x * 0.05 + Math.sin(z * 0.035) * 2.2) * Math.sin(z * 0.06 + Math.sin(x * 0.024) * 1.8);
      const band = (1 - smooth(8, 45, dReef)) * (dOut < 0 ? 1 : 0.5);
      if (band > 0) { c.lerp(bandC, band * 0.8); c.lerp(coralC, Math.min(0.7, Math.max(0, n + 0.15) * 1.5 * (0.7 + 0.3 * hash(x, z))) * band); }
      let a = 0.6 + 0.22 * (1 - smooth(0, 30, dShore));
      if (dOut > 0) { c.lerp(deepC, smooth(0, OUT, dOut) * 0.85); a *= 1 - smooth(8, OUT, dOut); } // into A's sea past the reef
      a *= smooth(Z_N, Z_N + 50, z) * (1 - smooth(Z_S - 45, Z_S, z));
      pos.push(x, WATER_Y, z); col.push(c.r, c.g, c.b, Math.max(0, a));
      return (vid[k] = pos.length / 3 - 1);
    };
    for (let j = 0; j + 1 < nz; j++) for (let i = 0; i + 1 < nx; i++) {
      const cx = x0 + (i + 0.5) * S, cz = z0 + (j + 0.5) * S;
      if (cz < Z_N || cz > Z_S || !inside(SEA, cx, cz) || cx - reefX(cz) > OUT + S) continue;
      const a = vert(i, j), b = vert(i + 1, j), d = vert(i, j + 1), e = vert(i + 1, j + 1);
      idx.push(a, d, b, b, d, e); this.stats.coveQuads++;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setAttribute("normal", new Float32BufferAttribute(new Float32Array(pos.length).map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
    geo.setIndex(idx); geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const m = new Mesh(geo, mat); m.name = "aw:bachelors:cove";
    const day = new Color(0xffffff), night = new Color(0x0d2238);
    m.onBeforeRender = () => { const k = uNight.value; mat.color.copy(day).lerp(night, k); mat.opacity = 1 - 0.55 * k; };
    m.renderOrder = 3; m.castShadow = false; m.receiveShadow = false; // after A's water (renderOrder 2)
    return m;
  }

  /** Windward surf: crest + trailing whitewater ribbons on the reef and shore-break lines, dashed by vertex alpha. */
  private surf(low: boolean): Mesh {
    const pos: number[] = [], col: number[] = [], idx: number[] = [];
    const step = low ? 4 : 3;
    const line = (L: P[], li: number, wide: (f: number) => number, fadeIn: number, crest: number, solid: number, ch: number, freq: number) => {
      // seaward normal: the side that gets further from the coast
      const [ax0, az0] = L[0], [bx0, bz0] = L[1], l0 = Math.hypot(bx0 - ax0, bz0 - az0);
      let sg = 1; { const nx = -(bz0 - az0) / l0, nz = (bx0 - ax0) / l0; if (lineDist(ax0 + nx * 10, az0 + nz * 10, COAST) < lineDist(ax0, az0, COAST)) sg = -1; }
      let total = 0; for (let i = 1; i < L.length; i++) total += Math.hypot(L[i][0] - L[i - 1][0], L[i][1] - L[i - 1][1]);
      let run = 0, first = true;
      const Y = WATER_Y + 0.1, tail = Math.min(30, total * 0.3);
      for (let i = 1; i < L.length; i++) {
        const [ax, az] = L[i - 1], [bx, bz] = L[i], len = Math.hypot(bx - ax, bz - az);
        const ux = (bx - ax) / len, uz = (bz - az) / len, nx = -uz * sg, nz = ux * sg;
        const n = Math.ceil(len / step);
        for (let k = i > 1 ? 1 : 0; k <= n; k++) {
          const t = (k / n) * len, f = (run + t) / total, s0 = run + t;
          const off = 3 + Math.sin(s0 * 0.05 + li) * 3;
          const x = ax + ux * t + nx * off, z = az + uz * t + nz * off;
          // breakers come in sections: the point reefs are almost a solid wall, the mouth and shore break are broken
          const s = Math.sin(s0 * freq + Math.sin(s0 * 0.021 + li) * 3.0 + li * 1.7) * 0.5 + 0.5;
          let a = (solid + (1 - solid) * smooth(0.3, 0.75, s)) * (0.8 + 0.2 * hash(k + i * 17, li));
          a *= smooth(0, fadeIn, s0) * (1 - smooth(total - tail, total, s0));
          const w = wide(f) * (0.8 + 0.4 * (0.5 + 0.5 * Math.sin(s0 * 0.12 + li * 2.3))); // whitewater width (landward)
          const hc = ch * a * (0.8 + 0.4 * hash(s0, li + 3));
          const base = pos.length / 3;
          pos.push(x + nx * 4, Y, z + nz * 4, x, Y + hc, z, x - nx * w * 0.4, Y + hc * 0.25, z - nz * w * 0.4, x - nx * w, Y, z - nz * w);
          const wash = 0.4 + 0.5 * hash(Math.floor(s0 / 6), li + 11); // foam comes in patches across the wash
          col.push(1, 1, 1, a * crest * 0.3, 1, 1, 1, a * crest, 1, 1, 1, a * crest * wash, 1, 1, 1, a * crest * wash * 0.15);
          if (!first) { const p = base - 4; for (let r = 0; r < 3; r++) idx.push(p + r, base + r, p + r + 1, p + r + 1, base + r, base + r + 1); this.stats.surfQuads += 3; }
          first = false;
        }
        run += len;
      }
    };
    line(R_N, 0, (f) => 14 + 24 * smooth(0.35, 0.9, f), 40, 1, 0.72, 2.4, 0.07); // widens toward the north point
    line(R_M, 1, () => 7, 8, 0.6, 0.1, 0.8, 0.16);
    line(R_S, 2, (f) => 30 - 14 * smooth(0.5, 1, f), 12, 1, 0.68, 2.3, 0.08);
    line(SB_N, 3, () => 5, 12, 0.7, 0.3, 0.5, 0.12);
    line(SB_S, 4, () => 6, 8, 0.75, 0.35, 0.6, 0.11);
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setIndex(idx); geo.computeBoundingSphere();
    const mat = new MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
    const m = new Mesh(geo, mat); m.name = "aw:bachelors:surf";
    const day = new Color(0xf6fcff), night = new Color(0x2a3a4c);
    m.onBeforeRender = () => { mat.color.copy(day).lerp(night, uNight.value); mat.opacity = 0.78 + 0.22 * Math.sin(uTime.value * 0.9 + 1.3); };
    m.renderOrder = 4; m.castShadow = false; m.receiveShadow = false;
    return m;
  }

  /** Pale sand over the OSM beach, the compacted sand track, pull-off and foot path, draped on A's ground. */
  private sand(h: (x: number, z: number) => number, low: boolean): Mesh {
    const S = low ? 4 : 3;
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (const [x, z] of [...BEACH, ...TRACK, ...FOOT]) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
    x0 = Math.floor((x0 - 12) / S) * S; z0 = Math.floor((z0 - 12) / S) * S; x1 += 12; z1 += 12;
    const nx = Math.ceil((x1 - x0) / S) + 2, nz = Math.ceil((z1 - z0) / S) + 2;
    const pos: number[] = [], col: number[] = [], idx: number[] = [], vid = new Int32Array(nx * nz).fill(-1);
    const sandC = new Color(0xf5f0e4), wetC = new Color(0xd8cdb8), trackC = new Color(0xd6cfbf), rutC = new Color(0xb9b09c), c = new Color();
    // A's shoreline sits a few metres off the OSM coast: carry the sand on down to A's own waterline (the
    // alpha follows the ground height there), so the sand edge follows the water and not the grid
    const wash = (x: number, z: number) => (z > 9535 && z < 9870 && inside(SEA, x, z) ? 1 - smooth(8, 16, lineDist(x, z, COAST)) : 0);
    const trackW = (x: number, z: number) => Math.max(1 - smooth(TW / 2 - 1, TW / 2 + 1.5, lineDist(x, z, TRACK)), 1 - smooth(FW / 2 - 0.8, FW / 2 + 1.2, lineDist(x, z, FOOT)),
      inPad(x, z, 0) ? 1 : inPad(x, z, 2.5) ? 0.45 : 0);
    const vert = (i: number, j: number) => {
      const k = j * nx + i; if (vid[k] >= 0) return vid[k];
      const x = x0 + i * S, z = z0 + j * S, y = h(x, z);
      const tr = trackW(x, z), ns = hash(x * 0.37, z * 0.41);
      c.copy(sandC).lerp(wetC, 1 - smooth(0.15, 0.9, y)).multiplyScalar(0.97 + ns * 0.05);
      if (tr > 0) {
        // two tyre ruts along the track centre
        const dt = lineDist(x, z, TRACK), rut = Math.abs(dt - 1.1) < 0.7 && !inPad(x, z, 0) ? 0.5 : 0;
        c.lerp(trackC.clone().lerp(rutC, rut).multiplyScalar(0.93 + ns * 0.1), tr);
      }
      const edge = inside(BEACH, x, z) ? smooth(0, 6, lineDist(x, z, BACK)) : wash(x, z);
      const a = Math.max(edge * 0.66, tr * 0.88) * smooth(0.0, 0.35, y);
      pos.push(x, y + 0.1, z); col.push(c.r, c.g, c.b, a);
      return (vid[k] = pos.length / 3 - 1);
    };
    for (let j = 0; j + 1 < nz; j++) for (let i = 0; i + 1 < nx; i++) {
      const cx = x0 + (i + 0.5) * S, cz = z0 + (j + 0.5) * S;
      if (!inside(BEACH, cx, cz) && wash(cx, cz) <= 0 && lineDist(cx, cz, TRACK) > TW / 2 + 2 + S && lineDist(cx, cz, FOOT) > FW / 2 + 2 + S && !inPad(cx, cz, 3 + S)) continue;
      if (h(cx, cz) < -0.2) continue;
      const a = vert(i, j), b = vert(i + 1, j), d = vert(i, j + 1), e = vert(i + 1, j + 1);
      idx.push(a, d, b, b, d, e); this.stats.sandQuads++;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setIndex(idx); geo.computeVertexNormals(); geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
    const m = new Mesh(geo, mat); m.name = "aw:bachelors:sand";
    const dim = new Color(0x2c3448); // A's ground goes dark at night: keep the pale sand from glowing
    m.onBeforeRender = () => { const k = uNight.value; mat.color.setHex(0xffffff).lerp(dim, k); mat.opacity = 1 - 0.7 * k; };
    m.renderOrder = 1; m.castShadow = false; m.receiveShadow = true;
    return m;
  }

  private clear(x: number, z: number, onSand = false) {
    if (!onSand && inside(BEACH, x, z)) return false;
    if (inPad(x, z, 3) || lineDist(x, z, TRACK) < TW / 2 + 1.5 || lineDist(x, z, FOOT) < FW / 2 + 1.5) return false;
    for (const [ax, az, bx, bz, r] of ROADS) if (segDist(x, z, ax, az, bx, bz) < r) return false;
    if (Math.hypot(x - SIGN.x, z - SIGN.z) < 3) return false;
    return true;
  }

  /** Sea grape and beach vines on the dunes by the cove, low dry scrub on the plateau behind the limestone lip. */
  private scrub(h: (x: number, z: number) => number, low: boolean): InstancedMesh {
    const spots: number[][] = []; // x, z, y, kind (0 dry scrub, 1 sea grape, 2 vine mat)
    const step = low ? 6 : 4.5;
    for (let x = 10530; x <= 10760; x += step) for (let z = 9480; z <= 9905; z += step) {
      const px = x + (hash(x, z) - 0.5) * step * 0.9, pz = z + (hash(z, x) - 0.5) * step * 0.9;
      if (inside(SEA, px, pz)) continue;
      const y = h(px, pz); if (y < 0.4) continue; // dry land only
      const r1 = hash(px * 0.7, pz * 1.1), r2 = hash(px * 1.3, pz * 0.7), dL = lineDist(px, pz, LEDGE);
      let kind = -1;
      if (inside(BEACH, px, pz)) { if (lineDist(px, pz, BACK) < 7 && r1 < 0.35) kind = 2; } // vines creeping onto the back of the sand
      else if (dL < 3.5) continue; // the limestone lip itself
      else if (pz < 9645) { // dunes north-west of the cove: dense sea grape with vine mats between
        const dC = lineDist(px, pz, COAST);
        if (r1 < (dC < 70 ? 0.7 : 0.45)) kind = r2 < (dC < 45 ? 0.5 : 0.3) ? 1 : r2 < 0.75 ? 2 : 0;
      } else if (dL < 14) { if (r1 < 0.45) kind = r2 < 0.45 ? 2 : r2 < 0.75 ? 1 : 0; } // vines and sea grape spilling over the lip
      else if (r1 < 0.24) kind = r2 < 0.15 ? 1 : 0; // sparse low scrub on the sandy plateau
      if (kind < 0 || !this.clear(px, pz, kind === 2)) continue;
      spots.push([px, pz, y, kind]);
    }
    const im = new InstancedMesh(new IcosahedronGeometry(1, 0), new MeshLambertMaterial({ color: 0xffffff, flatShading: true }), spots.length);
    im.name = "aw:bachelors:scrub"; im.castShadow = !low; im.receiveShadow = !low;
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), c = new Color();
    const seaT = [0x2f5a22, 0x3a6528, 0x44702e, 0x2c5220], scrubT = [0x5a633c, 0x666d48, 0x4e5a35, 0x707249, 0x62633f], vineT = [0x4f7a2e, 0x5b8434, 0x46702a, 0x63883a];
    spots.forEach(([x, z, y, kind], i) => {
      const r = kind === 1 ? 1.2 + hash(x * 3, z) * 1.4 : kind === 0 ? 0.6 + hash(x * 3, z) * 0.8 : 0.7 + hash(x * 3, z) * 0.9;
      const ht = kind === 1 ? r * 0.6 : kind === 0 ? r * 0.5 : 0.22 + r * 0.08;
      e.set(0, hash(z, x) * 6.28, 0); q.setFromEuler(e);
      s.set(r * (1 + hash(z, 4) * 0.4), ht, r); p.set(x, y + ht * (kind === 2 ? 0.35 : 0.65), z); m.compose(p, q, s); im.setMatrixAt(i, m);
      const t = kind === 1 ? seaT : kind === 0 ? scrubT : vineT; im.setColorAt(i, c.setHex(t[Math.floor(hash(x * 2, z * 2) * t.length) % t.length]));
    });
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere();
    const dim = new Color(0x4a5a70), mat = im.material as MeshLambertMaterial;
    im.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.7); };
    this.stats.clumps = spots.length;
    return im;
  }

  /** Limestone lip at the back of the sand, ironshore at the points, the info board, kadushi and divi-divi. */
  private props(h: (x: number, z: number) => number, low: boolean): Mesh {
    const parts: BufferGeometry[] = [];
    const rock = (x: number, z: number, sx: number, sy: number, sz: number, hex: number, seed: number, rot?: number) => {
      const g = new IcosahedronGeometry(1, 0);
      const pa = g.attributes.position as Float32BufferAttribute;
      for (let i = 0; i < pa.count; i++) { const j = 0.75 + 0.5 * hash(seed + i * 1.37, i); pa.setXYZ(i, pa.getX(i) * j, pa.getY(i) * j, pa.getZ(i) * j); }
      g.computeVertexNormals(); g.scale(sx, sy, sz); g.rotateY(rot ?? hash(seed, 9) * 6.28); g.translate(x, Math.max(h(x, z), -0.25) + sy * 0.35, z);
      parts.push(paint(g, hex, 0.25, seed)); this.stats.rocks++;
    };
    // low limestone lip: weathered pale grey-ochre blocks along the OSM cliff line, broken where the foot path drops onto the sand
    const lime = [0xb0a389, 0xa09379, 0x8e836c, 0xbdb096, 0x978b72];
    for (let i = 1; i < LEDGE.length; i++) {
      const [ax, az] = LEDGE[i - 1], [bx, bz] = LEDGE[i], len = Math.hypot(bx - ax, bz - az), n = Math.ceil(len / (low ? 3.6 : 2.7));
      const ang = Math.atan2(bz - az, bx - ax);
      for (let k = 0; k < n; k++) {
        const t = (k + hash(ax + k, az)) / n, x = ax + (bx - ax) * t, z = az + (bz - az) * t;
        if (lineDist(x, z, FOOT) < 5) continue;
        const o = (hash(x, z) - 0.3) * 2.5, ox = -(bz - az) / len * o, oz = (bx - ax) / len * o;
        const L = 1.0 + hash(z, x) * 0.9;
        rock(x + ox, z + oz, L, 0.45 + hash(x * 2, z) * 0.55, 0.6 + hash(z * 2, x) * 0.45, lime[k % lime.length], x + z, -ang + (hash(k, i) - 0.5) * 0.5);
      }
    }
    // ironshore: dark pitted rock at the waterline on the north point lip and round the south point
    const iron = [0x4f4a44, 0x5d564d, 0x67604f, 0x454039];
    const ironRun = (pts: P[], gap: number, spread: number) => {
      for (let i = 1; i < pts.length; i++) {
        const [ax, az] = pts[i - 1], [bx, bz] = pts[i], len = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.ceil(len / gap));
        for (let k = 0; k < n; k++) {
          const t = (k + hash(ax + k, az)) / n, x = ax + (bx - ax) * t, z = az + (bz - az) * t;
          const o = (hash(x, z) - 0.35) * spread, ox = (bz - az) / len * o, oz = -(bx - ax) / len * o;
          const r = 1.2 + hash(z, x) * 2.0;
          rock(x + ox, z + oz, r, 0.4 + hash(x * 2, z) * 0.6, r * (0.6 + hash(z * 2, x) * 0.5), iron[k % iron.length], x * 1.1 + z);
        }
      }
    };
    ironRun(COAST.filter(([, z]) => z > 9598 && z < 9634), low ? 4 : 3, 5);
    ironRun(COAST.filter(([, z]) => z > 9803 && z < 9850), low ? 4 : 3, 5);
    ironRun(COAST.filter(([, z]) => z > 9862 && z < 9930), low ? 3.6 : 2.7, 7);
    // pull-off: pale edge stones along the seaward rim
    for (let i = 0; i < 8; i++) {
      const u = -PAD.hl + (i / 7) * PAD.hl * 2, v = PAD.hw + 1.2, c = Math.cos(PAD.a), s = Math.sin(PAD.a);
      rock(PAD.x + u * c - v * s, PAD.z + u * s + v * c, 0.45 + hash(i, 7) * 0.25, 0.32, 0.4, 0xd9d2c4, i * 13);
    }
    // "Bachelors Beach" info board: two wooden posts, blue header, white rule panels with red signs, blue strip, yellow panel
    {
      const sp: BufferGeometry[] = [];
      const box = (w: number, hh: number, d: number, px: number, py: number, pz: number, hex: number) => {
        const g = new BoxGeometry(w, hh, d); g.translate(px, py, pz); sp.push(paint(g, hex));
      };
      const W = 1.7;
      box(0.11, 3.3, 0.11, -0.62, 1.65, -0.04, 0x5a4636); box(0.11, 3.3, 0.11, 0.62, 1.65, -0.04, 0x5a4636);
      box(W, 0.6, 0.04, 0, 3.0, 0.03, 0x2b8fc3); box(0.38, 0.2, 0.01, 0.45, 3.0, 0.055, 0xf2f2f2); // header with the island outline
      for (let k = 0; k < 4; k++) { const y = 2.42 - k * 0.47; box(W - 0.04, 0.42, 0.03, 0, y, 0.03, 0xe9eae6); box(0.24, 0.24, 0.01, -0.6, y, 0.05, 0xc0392b); }
      box(W - 0.04, 0.18, 0.03, 0, 0.42, 0.03, 0x2a7fb4); box(W - 0.04, 0.38, 0.03, 0, 0.12 + 0.06, 0.03, 0xe5cf37);
      const sg = mergeGeometries(sp)!; sp.forEach((g) => g.dispose());
      sg.translate(0, 0.25, 0); // the panels start ~0.25 m above the sand
      sg.rotateY(Math.PI / 2 - SIGN.a); sg.translate(SIGN.x, h(SIGN.x, SIGN.z) - 0.1, SIGN.z); parts.push(sg);
    }
    // kadushi (columnar cactus) clumps and wind-bent divi-divi on the plateau and the north dunes
    const lean = new Vector3(-0.92, 0, 0.38); // the trade wind blows from the ENE, so trees lean WSW
    let cacti = 0, divi = 0;
    for (let i = 0; i < 60 && (cacti < (low ? 8 : 12) || divi < (low ? 4 : 6)); i++) {
      const x = 10560 + hash(i, 21) * 170, z = 9490 + hash(i, 22) * 400;
      if (!this.clear(x, z) || inside(SEA, x, z) || lineDist(x, z, LEDGE) < 6 || lineDist(x, z, BACK) < 6) continue;
      const y = h(x, z); if (y < 1) continue;
      if (hash(i, 23) < 0.6 && cacti < (low ? 8 : 12)) {
        const stems = 3 + Math.floor(hash(i, 24) * 4);
        for (let k = 0; k < stems; k++) {
          const H = 1.6 + hash(i, k + 30) * 2.6, ox = (hash(i, k + 40) - 0.5) * 1.4, oz = (hash(i, k + 50) - 0.5) * 1.4;
          const g = new CylinderGeometry(0.15, 0.19, H, 6, 1); g.translate(x + ox, y + H / 2 - 0.1, z + oz); parts.push(paint(g, 0x4c7438, 0.2, i * 7 + k));
        }
        cacti++;
      } else if (divi < (low ? 4 : 6)) {
        const H = 2.2 + hash(i, 25) * 1.2, g = new CylinderGeometry(0.12, 0.2, H, 5, 1);
        g.translate(0, H / 2, 0); g.rotateZ(0.5); g.rotateY(Math.atan2(lean.z, -lean.x)); g.translate(x, y - 0.1, z);
        parts.push(paint(g, 0x5a4634, 0.15, i));
        const crown = new SphereGeometry(1, 7, 4); crown.scale(2.6 + hash(i, 26), 0.7, 1.9);
        crown.rotateY(Math.atan2(lean.z, -lean.x)); crown.translate(x + lean.x * H * 0.55, y + H * 0.9, z + lean.z * H * 0.55);
        parts.push(paint(crown, 0x4a6a2b, 0.2, i + 3));
        divi++;
      }
    }
    const geo = mergeGeometries(parts)!; parts.forEach((g) => g.dispose());
    geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, side: DoubleSide });
    const mesh = new Mesh(geo, mat); mesh.name = "aw:bachelors:props"; mesh.castShadow = !low; mesh.receiveShadow = !low;
    const dim = new Color(0x55607a);
    mesh.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.6); };
    return mesh;
  }
}
