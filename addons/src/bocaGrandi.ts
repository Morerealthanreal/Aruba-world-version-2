// Boca Grandi (windward kite-surf cove, east coast north of Seroe Colorado) accuracy pass. Off with ?bocagrandi=0.
// A draws the cove as a smooth tan beach with shore foam, then deep blue within ~60 m, no reef and bare sand
// behind. Satellite and photo references show a wide shallow reef flat: very pale aqua at the sand, clear
// turquoise in the cove with a dark sea-grass patch, a dark coral band, and heavy white windward surf on the
// outer reef that ends at the "boca" (the reef gap the place is named after), with a second broken reef line
// south of it. The sand is near-white, sea grape and low dry scrub sit behind it, the coast road ends in a
// sandy pull-off, a weathered wooden kite school shack stands at the back of the beach and kites lie on the
// sand. The south end of the cove is rocky ironshore with driftwood.
// Geometry is OSM (beach relation 1406785: coastline 451801407 / 1108808569 / 98105012 and inland edge
// 98105158; coastline 1108799654; scrub 628177118; the Boca Grandi closing baseline 1108808570 for the reef
// gap) and A's road data, rebuilt in code. Reef and surf lines were read off satellite imagery; photos are
// reference only. 5 draw calls: one lagoon/reef sheet, one surf ribbon, one pale-sand + pull-off sheet,
// one InstancedMesh of scrub clumps and one merged props mesh (ironshore, driftwood, shack, kites).
// Built once (sheets at once, land parts when their height regions have streamed in); per frame only a
// colour/opacity lerp when drawn. Stays north of z 9140, far from Rodgers Beach / Baby Beach / Seroe Colorado.
import {
  BoxGeometry, BufferGeometry, Color, CylinderGeometry, DoubleSide, Euler, Float32BufferAttribute, IcosahedronGeometry,
  InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, MeshLambertMaterial, Quaternion, Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { uNight, uTime } from "./uniforms";

type P = number[];
// game metres (x east, z south). COAST: OSM coastline N to S around the cove (1 m simplified).
// R1: outer windward reef breaker line (heavy surf) ending at the reef gap; R2 / R3: inner and outer broken
// reef lines south of the gap. BEACH / BACK: the OSM beach ring and its inland edge. SCRUB: OSM 628177118.
// ROADS (ax, az, bx, bz, clearance) are A's region roads.
const COAST: P[] = [[10399.4,8302.1],[10401.6,8310.8],[10413.6,8315.2],[10437.8,8318.7],[10442.3,8321.6],[10445.5,8326.2],[10450.9,8346.0],[10450.2,8359.9],[10457.7,8372.5],[10457.2,8385.3],[10460.3,8397.8],[10471.7,8416.0],[10482.2,8427.9],[10510.8,8497.7],[10508.2,8516.5],[10442.4,8594.8],[10420.0,8637.0],[10394.9,8707.9],[10380.2,8759.6],[10367.0,8817.4],[10356.0,8876.3],[10357.7,8923.2],[10372.1,8982.8],[10386.9,9010.5],[10403.3,9033.8],[10446.4,9070.9],[10484.1,9084.2],[10528.3,9077.9],[10558.8,9070.7],[10564.0,9070.9],[10590.4,9083.1],[10618.6,9113.2],[10627.3,9126.7]];
const R1: P[] = [[10500,8250],[10530,8285],[10565,8335],[10605,8400],[10645,8480],[10690,8570],[10735,8660],[10770,8740],[10790,8790]];
const R2: P[] = [[10545,8915],[10585,8960],[10640,9000],[10690,9045],[10720,9100]];
const R3: P[] = [[10725,8905],[10740,8960],[10778,9048],[10812,9110]];
const BEACH: P[] = [[10399.4,8302.1],[10318.1,8290.6],[10304.3,8302.2],[10312.0,8315.2],[10306.6,8322.1],[10300.5,8340.4],[10301.2,8355.0],[10328.1,8377.9],[10318.1,8394.7],[10305.8,8406.2],[10304.3,8423.7],[10291.2,8432.9],[10288.9,8445.1],[10290.5,8455.1],[10313.5,8465.0],[10327.4,8472.6],[10343.5,8527.6],[10327.4,8539.1],[10315.8,8542.9],[10311.2,8555.1],[10302.0,8557.4],[10300.5,8565.1],[10292.0,8577.8],[10279.5,8582.3],[10288.9,8597.9],[10307.4,8608.6],[10328.1,8623.1],[10352.8,8629.3],[10360.5,8647.6],[10354.3,8658.3],[10348.1,8675.1],[10339.7,8688.1],[10332.0,8697.3],[10322.8,8702.6],[10313.5,8711.0],[10299.7,8715.6],[10300.4,8752.9],[10274.3,8865.0],[10293.9,8965.0],[10334.0,9040.1],[10379.7,9066.9],[10425.4,9053.7],[10403.3,9033.8],[10386.9,9010.5],[10372.1,8982.8],[10357.7,8923.2],[10356.0,8876.3],[10367.0,8817.4],[10380.2,8759.6],[10394.9,8707.9],[10420.0,8637.0],[10442.4,8594.8],[10508.2,8516.5],[10510.8,8497.7],[10482.2,8427.9],[10471.7,8416.0],[10460.3,8397.8],[10457.2,8385.3],[10457.7,8372.5],[10450.2,8359.9],[10450.9,8346.0],[10445.5,8326.2],[10442.3,8321.6],[10437.8,8318.7],[10413.6,8315.2],[10401.6,8310.8]];
const BACK: P[] = [[10399.4,8302.1],[10318.1,8290.6],[10304.3,8302.2],[10312.0,8315.2],[10306.6,8322.1],[10300.5,8340.4],[10301.2,8355.0],[10328.1,8377.9],[10318.1,8394.7],[10305.8,8406.2],[10304.3,8423.7],[10291.2,8432.9],[10288.9,8445.1],[10290.5,8455.1],[10313.5,8465.0],[10327.4,8472.6],[10343.5,8527.6],[10327.4,8539.1],[10315.8,8542.9],[10311.2,8555.1],[10302.0,8557.4],[10300.5,8565.1],[10292.0,8577.8],[10279.5,8582.3],[10288.9,8597.9],[10307.4,8608.6],[10328.1,8623.1],[10352.8,8629.3],[10360.5,8647.6],[10354.3,8658.3],[10348.1,8675.1],[10339.7,8688.1],[10332.0,8697.3],[10322.8,8702.6],[10313.5,8711.0],[10299.7,8715.6],[10300.4,8752.9],[10274.3,8865.0],[10293.9,8965.0],[10334.0,9040.1],[10379.7,9066.9],[10425.4,9053.7]];
const SCRUB: P[] = [[10222.2,8288.7],[10251.2,8306.8],[10241.2,8322.1],[10215.1,8332.8],[10215.1,8345.0],[10190.5,8361.1],[10185.8,8371.0],[10145.1,8355.0],[10135.1,8356.5],[10126.6,8374.1],[10107.4,8356.5],[10076.6,8337.4],[10055.0,8340.6],[10045.7,8344.8],[10045.8,8351.9],[10040.5,8367.2],[10038.9,8383.2],[10040.5,8408.5],[10047.4,8418.4],[10052.0,8443.6],[10063.5,8465.0],[10078.9,8481.0],[10089.7,8483.3],[10098.9,8505.5],[10092.0,8539.9],[10081.2,8551.3],[10110.5,8575.8],[10118.9,8587.2],[10126.6,8608.6],[10143.5,8615.5],[10152.8,8630.0],[10158.9,8643.8],[10165.8,8664.4],[10166.6,8704.9],[10180.4,8746.9],[10195.1,8751.5],[10208.9,8746.2],[10230.4,8733.2],[10261.2,8730.1],[10272.8,8723.2],[10288.1,8720.2],[10313.5,8711.0],[10322.8,8702.6],[10332.0,8697.3],[10348.1,8675.1],[10354.3,8658.3],[10360.5,8647.6],[10352.8,8629.3],[10328.1,8623.1],[10288.9,8597.9],[10279.5,8582.3],[10292.0,8577.8],[10300.5,8565.1],[10302.0,8557.4],[10311.2,8555.1],[10315.8,8542.9],[10327.4,8539.1],[10343.5,8527.6],[10327.4,8472.6],[10290.5,8455.1],[10288.9,8445.1],[10291.2,8432.9],[10304.3,8423.7],[10305.8,8406.2],[10318.1,8394.7],[10328.1,8377.9],[10301.2,8355.0],[10300.5,8340.4],[10306.6,8322.1],[10312.0,8315.2],[10304.3,8302.2],[10299.5,8285.5],[10291.6,8273.6],[10260.7,8252.2],[10236.2,8252.7]];
const ROADS: number[][] = [[10153.3,9200.0,10156.4,9165.5,4.5],[10156.4,9165.5,10155.5,9138.4,4.5],[10155.5,9138.4,10152.4,9115.6,4.5],[10152.4,9115.6,10141.8,9064.1,4.5],[10148.4,8521.7,10160.9,8520.4,3.5],[10160.9,8520.4,10178.4,8520.3,3.5],[10178.4,8520.3,10188.8,8521.2,3.5],[10188.8,8521.2,10197.2,8524.2,3.5],[10197.2,8524.2,10200.0,8527.5,3.5],[10155.5,9138.4,10200.0,9111.2,3.5],[10139.4,8435.3,10193.2,8467.4,3.5],[10193.2,8467.4,10200.0,8470.0,3.5],[10200.0,8481.8,10195.1,8485.9,3.5],[10195.1,8485.9,10172.5,8506.3,3.5],[10148.4,8521.7,10153.9,8511.6,3.5],[10153.9,8511.6,10157.0,8508.8,3.5],[10157.0,8508.8,10163.4,8505.7,3.5],[10178.4,8520.3,10172.5,8506.3,3.5],[10172.5,8506.3,10163.4,8505.7,3.5],[10163.4,8505.7,10148.5,8496.5,3.5],[10200.0,8527.5,10223.3,8554.8,3.5],[10223.3,8554.8,10236.9,8565.6,3.5],[10236.9,8565.6,10252.5,8575.6,3.5],[10252.5,8575.6,10276.9,8587.2,3.5],[10276.9,8587.2,10291.4,8591.8,3.5],[10291.4,8591.8,10306.5,8593.4,3.5],[10306.5,8593.4,10321.1,8595.4,3.5],[10321.1,8595.4,10334.8,8598.5,3.5],[10334.8,8598.5,10346.5,8602.2,3.5],[10346.5,8602.2,10359.3,8607.3,3.5],[10200.0,9111.2,10255.8,9077.1,3.5],[10255.8,9077.1,10306.8,9046.8,3.5],[10306.8,9046.8,10357.2,9019.1,3.5],[10200.0,8470.0,10209.9,8473.7,3.5],[10209.9,8473.7,10230.8,8475.1,3.5],[10230.8,8475.1,10246.9,8466.8,3.5],[10246.9,8466.8,10255.3,8450.8,3.5],[10276.9,8587.2,10317.0,8573.0,3.5],[10326.5,8464.5,10297.0,8456.6,3.5],[10297.0,8456.6,10273.9,8449.1,3.5],[10273.9,8449.1,10255.3,8450.8,3.5],[10255.3,8450.8,10238.0,8456.7,3.5],[10238.0,8456.7,10225.8,8460.6,3.5],[10230.1,8414.4,10227.5,8434.4,3.5],[10227.5,8434.4,10225.4,8454.4,3.5],[10225.4,8454.4,10225.8,8460.6,3.5],[10225.8,8460.6,10209.9,8473.7,3.5],[10209.9,8473.7,10200.0,8481.8,3.5]];
// the reef gap ("boca"): from the south reef back to the end of the outer reef
const GAP: P[] = [R2[0], R1[R1.length - 1]];
const BAY: P[] = [...COAST, R2[R2.length - 1], ...R2.slice().reverse(), ...R1.slice().reverse()];
// sandy pull-off at the end of the coast-road spur (centre x, z, half length, half width, heading along the road)
const PAD = { x: 10338, z: 8594, hl: 17, hw: 9, a: Math.atan2(8607.3 - 8573.0, 10359.3 - 10317.0) };
// kite school shack at the back of the sand, facing the water; kites laid out on the sand in front of it
const SHACK = { x: 10386, z: 8572, a: Math.atan2(0.64, 0.77) };
const KITES: number[][] = [[10404, 8596, 0.4, 0], [10416, 8584, 1.9, 1], [10398, 8612, 2.6, 2]];
const SEAGRASS = { x: 10475, z: 8915, rx: 55, rz: 45 }; // dark patch inside the cove
const IRON_Z0 = 9062; // ironshore along the coast from here to the south end
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
const reefDist = (x: number, z: number) => Math.min(lineDist(x, z, R1), lineDist(x, z, R2), lineDist(x, z, R3));
function inPad(x: number, z: number, grow = 0) {
  const dx = x - PAD.x, dz = z - PAD.z, c = Math.cos(PAD.a), s = Math.sin(PAD.a);
  const u = dx * c + dz * s, v = -dx * s + dz * c;
  // rounded ends
  const ex = Math.max(0, Math.abs(u) - (PAD.hl - PAD.hw));
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

export class BocaGrandi {
  stats = { built: false, bayQuads: 0, surfQuads: 0, sandQuads: 0, clumps: 0, rocks: 0, ms: 0 };
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
    if (!this.sheetDone) { this.g.scene.add(this.bay(low), this.surf(low)); this.sheetDone = true; } // flat, needs no heights
    if (!this.landDone) {
      const ready = new Set<string>();
      for (const r of W.regions.values()) if (r.H) ready.add(`${r.rx},${r.rz}`);
      const keys = new Set<string>();
      for (const [x, z] of BEACH) keys.add(this.key(W, x, z));
      for (const [x, z] of COAST) keys.add(this.key(W, x, z));
      if ([...keys].every((k) => ready.has(k))) {
        const h = (x: number, z: number) => { const v = W.heightAt(x, z); return Number.isFinite(v) ? v : 0; };
        this.g.scene.add(this.sand(h, low), this.scrub(h, low), this.props(h, low));
        this.landDone = true;
      }
    }
    if (this.landDone) { window.clearInterval(this.timer); this.stats.built = true; }
    this.stats.ms += Math.round(performance.now() - t0);
  }

  /** Reef-flat colour sheet: pale shallows at the sand, turquoise cove, dark coral band, fading out past the reef. */
  private bay(low: boolean): Mesh {
    const S = low ? 8 : 6, OUT = 70;
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (const [x, z] of [...BAY, ...R3]) { x0 = Math.min(x0, x - OUT); x1 = Math.max(x1, x + OUT); z0 = Math.min(z0, z - OUT); z1 = Math.max(z1, z + OUT); }
    x0 = Math.floor(x0 / S) * S; z0 = Math.floor(z0 / S) * S;
    const nx = Math.ceil((x1 - x0) / S) + 1, nz = Math.ceil((z1 - z0) / S) + 1;
    const pos: number[] = [], col: number[] = [], idx: number[] = [], vid = new Int32Array(nx * nz).fill(-1);
    const shoreC = new Color(0xdcfff6), midC = new Color(0x5ad9d0), coveC = new Color(0x3ec8c4), grassC = new Color(0x1e7477);
    const bandC = new Color(0x23797c), coralC = new Color(0x435f4d), deepC = new Color(0x1b6a86), c = new Color();
    const vert = (i: number, j: number) => {
      const k = j * nx + i; if (vid[k] >= 0) return vid[k];
      const x = x0 + i * S, z = z0 + j * S;
      const dShore = lineDist(x, z, COAST), dReef = reefDist(x, z), dGap = segDist(x, z, GAP[0][0], GAP[0][1], GAP[1][0], GAP[1][1]);
      const inBay = inside(BAY, x, z);
      // sandy shallows -> turquoise ~70 m out -> slightly deeper cove turquoise
      c.copy(shoreC).lerp(midC, smooth(0, 70, dShore)).lerp(coveC, smooth(70, 160, dShore) * 0.6);
      // dark sea-grass patch in the middle of the cove (satellite)
      const gs = Math.hypot((x - SEAGRASS.x) / SEAGRASS.rx, (z - SEAGRASS.z) / SEAGRASS.rz);
      const gn = 0.8 + 0.2 * Math.sin(x * 0.09 + z * 0.05);
      c.lerp(grassC, (1 - smooth(0.55, 1.15, gs)) * 0.7 * gn);
      // coral band on the inner side of the reef lines, patchy
      const n = Math.sin(x * 0.045 + Math.sin(z * 0.03) * 2.4) * Math.sin(z * 0.05 + Math.sin(x * 0.021) * 1.9);
      const band = 1 - smooth(20, 140, dReef);
      if (band > 0) {
        c.lerp(bandC, band * 0.85);
        const p = Math.max(0, n + 0.15) * 1.6 * (0.7 + 0.3 * hash(x, z));
        c.lerp(coralC, Math.min(0.75, p) * band);
      }
      let a = 0.62 + 0.2 * (1 - smooth(0, 40, dShore));
      if (!inBay) { c.lerp(deepC, smooth(0, OUT, dReef) * 0.8); a *= 1 - smooth(10, OUT, dReef); } // fade into A's sea past the reef
      // the reef gap: deep water comes in through the boca
      const gap = 1 - smooth(0, 140, dGap);
      if (inBay && gap > 0) { c.lerp(deepC, gap * 0.75); a *= 1 - gap * 0.6; }
      a *= smooth(8250, 8340, z); // the reef flat runs on north along Grapefield: blend out
      a *= 1 - smooth(9090, 9160, z);
      pos.push(x, WATER_Y, z); col.push(c.r, c.g, c.b, Math.max(0, a));
      return (vid[k] = pos.length / 3 - 1);
    };
    for (let j = 0; j + 1 < nz; j++) for (let i = 0; i + 1 < nx; i++) {
      const cx = x0 + (i + 0.5) * S, cz = z0 + (j + 0.5) * S;
      if (cz > 9160 || cz < 8240) continue;
      if (!inside(BAY, cx, cz) && reefDist(cx, cz) > OUT) continue;
      const a = vert(i, j), b = vert(i + 1, j), d = vert(i, j + 1), e = vert(i + 1, j + 1);
      idx.push(a, d, b, b, d, e); this.stats.bayQuads++;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setAttribute("normal", new Float32BufferAttribute(new Float32Array(pos.length).map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
    geo.setIndex(idx); geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const m = new Mesh(geo, mat); m.name = "aw:bocagrandi:bay";
    const day = new Color(0xffffff), night = new Color(0x0d2238);
    m.onBeforeRender = () => { const k = uNight.value; mat.color.copy(day).lerp(night, k); mat.opacity = 1 - 0.55 * k; };
    m.renderOrder = 3; m.castShadow = false; m.receiveShadow = false; // after A's water (renderOrder 2)
    return m;
  }

  /** Windward surf: crest + trailing whitewater ribbons on the three reef lines, dashed by vertex alpha. */
  private surf(low: boolean): Mesh {
    const pos: number[] = [], col: number[] = [], idx: number[] = [];
    const step = low ? 4 : 3;
    // cross-section per step: seaward lip, the standing crest (so the break reads from the beach, not only
    // from above), the rolling whitewater and its fading landward tail
    const line = (L: P[], li: number, wide: (f: number) => number, fadeIn: number, crest: number, solid: number, ch: number, freq: number) => {
      // seaward normal: the side that gets further from the coast
      const [ax0, az0] = L[0], [bx0, bz0] = L[1], l0 = Math.hypot(bx0 - ax0, bz0 - az0);
      let sg = 1; { const nx = -(bz0 - az0) / l0, nz = (bx0 - ax0) / l0; if (lineDist(ax0 + nx * 10, az0 + nz * 10, COAST) < lineDist(ax0, az0, COAST)) sg = -1; }
      let total = 0; for (let i = 1; i < L.length; i++) total += Math.hypot(L[i][0] - L[i - 1][0], L[i][1] - L[i - 1][1]);
      let run = 0, first = true;
      const Y = WATER_Y + 0.1;
      for (let i = 1; i < L.length; i++) {
        const [ax, az] = L[i - 1], [bx, bz] = L[i], len = Math.hypot(bx - ax, bz - az);
        const ux = (bx - ax) / len, uz = (bz - az) / len, nx = -uz * sg, nz = ux * sg;
        const n = Math.ceil(len / step);
        for (let k = i > 1 ? 1 : 0; k <= n; k++) {
          const t = (k / n) * len, f = (run + t) / total, s0 = run + t;
          const off = 4 + Math.sin(s0 * 0.04 + li) * 4;
          const x = ax + ux * t + nx * off, z = az + uz * t + nz * off;
          // breakers come in sections: the outer reef is almost a solid wall, the inner lines are broken
          const s = Math.sin(s0 * freq + Math.sin(s0 * 0.019 + li) * 3.2 + li * 1.7) * 0.5 + 0.5;
          let a = (solid + (1 - solid) * smooth(0.3, 0.75, s)) * (0.8 + 0.2 * hash(k + i * 17, li));
          a *= smooth(0, fadeIn, s0) * (1 - smooth(total - 35, total, s0));
          const w = wide(f) * (0.8 + 0.4 * (0.5 + 0.5 * Math.sin(s0 * 0.11 + li * 2.3))); // whitewater width (landward)
          const hc = ch * a * (0.8 + 0.4 * hash(s0, li + 3));
          const base = pos.length / 3;
          pos.push(x + nx * 5, Y, z + nz * 5, x, Y + hc, z, x - nx * w * 0.4, Y + hc * 0.25, z - nz * w * 0.4, x - nx * w, Y, z - nz * w);
          const wash = 0.4 + 0.5 * hash(Math.floor(s0 / 7), li + 11); // foam comes in patches across the wash
          col.push(1, 1, 1, a * crest * 0.3, 1, 1, 1, a * crest, 1, 1, 1, a * crest * wash, 1, 1, 1, a * crest * wash * 0.15);
          if (!first) { const p = base - 4; for (let r = 0; r < 3; r++) idx.push(p + r, base + r, p + r + 1, p + r + 1, base + r, base + r + 1); this.stats.surfQuads += 3; }
          first = false;
        }
        run += len;
      }
    };
    // outer reef: a narrow break up north that turns into a wide field of whitewater toward the gap
    line(R1, 0, (f) => 12 + 48 * smooth(0.45, 0.88, f), 60, 1, 0.6, 1.6, 0.07);
    line(R2, 1, () => 8, 10, 0.55, 0, 0.6, 0.14);
    line(R3, 2, () => 7, 10, 0.55, 0, 0.7, 0.12);
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setIndex(idx); geo.computeBoundingSphere();
    const mat = new MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
    const m = new Mesh(geo, mat); m.name = "aw:bocagrandi:surf";
    const day = new Color(0xf6fcff), night = new Color(0x2a3a4c);
    // sets rolling in: the whole surf brightens and fades a little (one lerp when drawn)
    m.onBeforeRender = () => { mat.color.copy(day).lerp(night, uNight.value); mat.opacity = 0.78 + 0.22 * Math.sin(uTime.value * 0.9); };
    m.renderOrder = 4; m.castShadow = false; m.receiveShadow = false;
    return m;
  }

  /** Near-white sand over the OSM beach and the compacted sand/gravel pull-off, draped on A's ground. */
  private sand(h: (x: number, z: number) => number, low: boolean): Mesh {
    const S = low ? 5 : 4;
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (const [x, z] of BEACH) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
    x0 = Math.floor((x0 - S) / S) * S; z0 = Math.floor((z0 - S) / S) * S;
    const nx = Math.ceil((x1 - x0) / S) + 2, nz = Math.ceil((z1 - z0) / S) + 2;
    const pos: number[] = [], col: number[] = [], idx: number[] = [], vid = new Int32Array(nx * nz).fill(-1);
    const sandC = new Color(0xf6f1e6), wetC = new Color(0xd9cfbd), padC = new Color(0xc4b79c), c = new Color();
    const vert = (i: number, j: number) => {
      const k = j * nx + i; if (vid[k] >= 0) return vid[k];
      const x = x0 + i * S, z = z0 + j * S, y = h(x, z);
      const pad = inPad(x, z, 0) ? 1 : inPad(x, z, 3) ? 0.5 : 0;
      c.copy(sandC).lerp(wetC, 1 - smooth(0.15, 0.9, y));
      const ns = hash(x * 0.37, z * 0.41);
      c.multiplyScalar(0.97 + ns * 0.05);
      if (pad > 0) c.lerp(padC.clone().multiplyScalar(0.92 + ns * 0.12), pad);
      // fade at the back edge (into A's ground) and at the waterline
      const edge = inside(BEACH, x, z) ? smooth(0, 7, lineDist(x, z, BACK)) : 0;
      let a = Math.max(edge * 0.62, pad * 0.85) * smooth(0.0, 0.35, y);
      a *= smooth(8295, 8320, z); // stop where Grapefield Beach takes over
      pos.push(x, y + 0.1, z); col.push(c.r, c.g, c.b, a);
      return (vid[k] = pos.length / 3 - 1);
    };
    for (let j = 0; j + 1 < nz; j++) for (let i = 0; i + 1 < nx; i++) {
      const cx = x0 + (i + 0.5) * S, cz = z0 + (j + 0.5) * S;
      if (!inside(BEACH, cx, cz) && !inPad(cx, cz, 4)) continue;
      if (h(cx, cz) < -0.2) continue;
      const a = vert(i, j), b = vert(i + 1, j), d = vert(i, j + 1), e = vert(i + 1, j + 1);
      idx.push(a, d, b, b, d, e); this.stats.sandQuads++;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setIndex(idx); geo.computeVertexNormals(); geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
    const m = new Mesh(geo, mat); m.name = "aw:bocagrandi:sand";
    const dim = new Color(0x2c3448); // A's ground goes dark at night: keep the pale sand from glowing
    m.onBeforeRender = () => { const k = uNight.value; mat.color.setHex(0xffffff).lerp(dim, k); mat.opacity = 1 - 0.7 * k; };
    m.renderOrder = 1; m.castShadow = false; m.receiveShadow = true;
    return m;
  }

  private clear(x: number, z: number, onSand = false) {
    if (!onSand && inside(BEACH, x, z)) return false;
    if (inPad(x, z, 3)) return false;
    for (const [ax, az, bx, bz, r] of ROADS) if (segDist(x, z, ax, az, bx, bz) < r) return false;
    if (Math.hypot(x - SHACK.x, z - SHACK.z) < 9) return false;
    for (const [kx, kz] of KITES) if (Math.hypot(x - kx, z - kz) < 5) return false;
    return true;
  }

  /** Sea grape right behind the sand, low grey-green dry scrub further back, creeping beach vines on the sand. */
  private scrub(h: (x: number, z: number) => number, low: boolean): InstancedMesh {
    const spots: number[][] = []; // x, z, y, kind (0 scrub, 1 sea grape, 2 vine)
    const step = low ? 7 : 5;
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (const [x, z] of [...SCRUB, ...BEACH]) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
    x0 -= 50; z1 = Math.min(z1, 9075);
    for (let x = x0; x <= x1; x += step) for (let z = z0; z <= z1; z += step) {
      const px = x + (hash(x, z) - 0.5) * step * 0.9, pz = z + (hash(z, x) - 0.5) * step * 0.9;
      if (pz < 8300) continue;
      const onBeach = inside(BEACH, px, pz), dBack = lineDist(px, pz, BACK);
      let kind = -1;
      if (onBeach) { if (dBack < 9 && hash(px * 1.3, pz * 0.7) < 0.45) kind = 2; } // vines just in front of the dune line
      else if (inside(SCRUB, px, pz)) { if (hash(px * 0.7, pz * 1.1) < 0.6) kind = dBack < 16 ? 1 : 0; }
      else if (dBack < 40 && px < 10420) { if (hash(px * 0.7, pz * 1.1) < (dBack < 16 ? 0.5 : 0.3)) kind = dBack < 16 ? 1 : 0; } // patchy strip behind the sand
      if (kind < 0 || !this.clear(px, pz, kind === 2)) continue;
      const y = h(px, pz); if (y < 0.3) continue; // dry land only
      spots.push([px, pz, y, kind]);
    }
    const im = new InstancedMesh(new IcosahedronGeometry(1, 0), new MeshLambertMaterial({ color: 0xffffff, flatShading: true }), spots.length);
    im.name = "aw:bocagrandi:scrub"; im.castShadow = !low; im.receiveShadow = !low;
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), c = new Color();
    const seaT = [0x2f5a22, 0x3a6528, 0x44702e, 0x2c5220], scrubT = [0x56603a, 0x626a46, 0x4b5733, 0x6e7049, 0x5f6040], vineT = [0x557f34, 0x66893d, 0x4c722e];
    spots.forEach(([x, z, y, kind], i) => {
      const r = kind === 1 ? 1.3 + hash(x * 3, z) * 1.3 : kind === 0 ? 0.7 + hash(x * 3, z) * 0.9 : 1.0 + hash(x * 3, z) * 1.4;
      const ht = kind === 1 ? r * 0.6 : kind === 0 ? r * 0.5 : 0.1;
      e.set(0, hash(z, x) * 6.28, 0); q.setFromEuler(e);
      s.set(r * (1 + hash(z, 4) * 0.4), ht, r); p.set(x, y + ht * (kind === 2 ? 0.2 : 0.65), z); m.compose(p, q, s); im.setMatrixAt(i, m);
      const t = kind === 1 ? seaT : kind === 0 ? scrubT : vineT; im.setColorAt(i, c.setHex(t[Math.floor(hash(x * 2, z * 2) * t.length) % t.length]));
    });
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere();
    const dim = new Color(0x4a5a70), mat = im.material as MeshLambertMaterial;
    im.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.7); };
    this.stats.clumps = spots.length;
    return im;
  }

  /** Ironshore and driftwood at the south end, pull-off edge stones, the kite school shack and kites on the sand. */
  private props(h: (x: number, z: number) => number, low: boolean): Mesh {
    const parts: BufferGeometry[] = [];
    const rock = (x: number, z: number, sx: number, sy: number, sz: number, hex: number, seed: number) => {
      const g = new IcosahedronGeometry(1, 0);
      const pa = g.attributes.position as Float32BufferAttribute;
      for (let i = 0; i < pa.count; i++) { const j = 0.75 + 0.5 * hash(seed + i * 1.37, i); pa.setXYZ(i, pa.getX(i) * j, pa.getY(i) * j, pa.getZ(i) * j); }
      g.computeVertexNormals(); g.rotateY(hash(seed, 9) * 6.28); g.scale(sx, sy, sz); g.translate(x, Math.max(h(x, z), -0.25) + sy * 0.35, z);
      parts.push(paint(g, hex, 0.25, seed)); this.stats.rocks++;
    };
    // ironshore: dark, pitted limestone ledges along the waterline at the south end of the cove
    const iron = [0x4f4a44, 0x5d564d, 0x67604f, 0x454039];
    const sth = COAST.filter(([, z]) => z >= IRON_Z0);
    for (let i = 1; i < sth.length; i++) {
      const [ax, az] = sth[i - 1], [bx, bz] = sth[i], len = Math.hypot(bx - ax, bz - az), n = Math.ceil(len / (low ? 3.5 : 2.6));
      for (let k = 0; k < n; k++) {
        const t = (k + hash(ax + k, az)) / n, x = ax + (bx - ax) * t, z = az + (bz - az) * t;
        const o = (hash(x, z) - 0.5) * 7, ox = -(bz - az) / len * o, oz = (bx - ax) / len * o;
        const r = 1.4 + hash(z, x) * 2.2;
        rock(x + ox, z + oz, r, 0.45 + hash(x * 2, z) * 0.7, r * (0.6 + hash(z * 2, x) * 0.5), iron[k % iron.length], x + z);
      }
    }
    // driftwood: bleached grey logs on the sand at the south end
    for (let i = 0; i < (low ? 5 : 9); i++) {
      const x = 10392 + hash(i, 1) * 50, z = 9028 + hash(i, 2) * 30; if (!inside(BEACH, x, z) || h(x, z) < 0.3) continue;
      const L = 1.8 + hash(i, 3) * 3.2, g = new CylinderGeometry(0.11 + hash(i, 4) * 0.08, 0.16, L, 5, 1);
      g.rotateZ(Math.PI / 2 - 0.08); g.rotateY(hash(i, 5) * 6.28); g.translate(x, h(x, z) + 0.12, z);
      parts.push(paint(g, 0x9c958a, 0.2, i));
    }
    // pull-off: a few edge stones along the seaward rim
    for (let i = 0; i < 9; i++) {
      const u = -PAD.hl + (i / 8) * PAD.hl * 2, v = PAD.hw + 1.2, c = Math.cos(PAD.a), s = Math.sin(PAD.a);
      const x = PAD.x + u * c - v * s, z = PAD.z + u * s + v * c;
      rock(x, z, 0.45 + hash(i, 7) * 0.25, 0.32, 0.4, 0xd9d2c4, i * 13);
    }
    // kite school shack: weathered board walls, reed fringe under a flat roof deck with a railing, painted stripes
    {
      const { x, z, a } = SHACK, y = h(x, z) - 0.15, W = 7.2, D = 4.8, H = 2.7;
      const sp: BufferGeometry[] = [];
      const box = (w: number, hh: number, d: number, px: number, py: number, pz: number, hex: number, seed = 0) => {
        const g = new BoxGeometry(w, hh, d); g.translate(px, py, pz); sp.push(paint(g, hex, 0.12, seed));
      };
      box(W, H, D, 0, H / 2, 0, 0x8a7864, 1); // walls
      box(W + 0.5, 0.18, D + 0.5, 0, H + 0.09, 0, 0x5f5244); // roof deck
      // reed / palm-leaf fringe around the roof edge
      box(W + 0.7, 0.55, 0.12, 0, H - 0.18, D / 2 + 0.3, 0x9a8158); box(W + 0.7, 0.55, 0.12, 0, H - 0.18, -D / 2 - 0.3, 0x9a8158);
      box(0.12, 0.55, D + 0.7, W / 2 + 0.3, H - 0.18, 0, 0x9a8158); box(0.12, 0.55, D + 0.7, -W / 2 - 0.3, H - 0.18, 0, 0x9a8158);
      // roof railing: corner posts and two rails per side
      for (const [px, pz] of [[1, 1], [1, -1], [-1, 1], [-1, -1], [0, 1], [0, -1]]) box(0.1, 0.95, 0.1, px * W / 2, H + 0.65, pz * D / 2, 0x3b342e);
      for (const ry of [0.6, 1.1]) {
        box(W, 0.07, 0.07, 0, H + ry, D / 2, 0x3b342e); box(W, 0.07, 0.07, 0, H + ry, -D / 2, 0x3b342e);
        box(0.07, 0.07, D, W / 2, H + ry, 0, 0x3b342e); box(0.07, 0.07, D, -W / 2, H + ry, 0, 0x3b342e);
      }
      // front (sea side is +z here): dark door and window openings, rainbow stripes on one end panel
      box(1.0, 2.0, 0.06, -1.2, 1.0, D / 2 + 0.03, 0x2c2622); box(1.8, 0.9, 0.06, 1.6, 1.55, D / 2 + 0.03, 0x2c2622);
      [0xc0392b, 0xe6b422, 0x3d8b37, 0x2f63a8].forEach((hex, i) => box(0.4, 2.2, 0.06, -W / 2 + 0.35 + i * 0.4, 1.15, D / 2 + 0.035, hex));
      // two boards leaning on the wall
      box(0.45, 1.4, 0.05, 0.2, 0.7, D / 2 + 0.25, 0xf2f2ee); box(0.45, 1.4, 0.05, 0.75, 0.7, D / 2 + 0.25, 0x2a6fb5);
      const sh = mergeGeometries(sp)!; sp.forEach((g) => g.dispose());
      // face the water: local +z -> heading a
      sh.rotateY(Math.PI / 2 - a); sh.translate(x, y, z); parts.push(sh);
    }
    // kites laid out on the sand: half-arc canopies resting on their tips
    const kc = [[0x1d1d1f, 0xf0f0f0], [0x2a4ea8, 0xc8283a], [0x16181c, 0x8fd14f]];
    for (const [x, z, rot, ci] of KITES) {
      const y = h(x, z);
      // canopy: half tube standing on its tips, flattened; the leading edge is a narrow contrasting strip
      const arc = new CylinderGeometry(2.1, 2.1, 1.3, 12, 1, true, -Math.PI / 2, Math.PI);
      arc.rotateX(-Math.PI / 2); arc.scale(1, 0.55, 1); arc.rotateY(rot); arc.translate(x, y + 0.02, z);
      parts.push(paint(arc, kc[ci][0], 0.1, ci));
      const le = new CylinderGeometry(2.14, 2.14, 0.32, 12, 1, true, -Math.PI / 2, Math.PI);
      le.rotateX(-Math.PI / 2); le.scale(1, 0.56, 1); le.translate(0, 0, 0.66); le.rotateY(rot); le.translate(x, y + 0.02, z);
      parts.push(paint(le, kc[ci][1], 0.05, ci + 5));
    }
    const geo = mergeGeometries(parts)!; parts.forEach((g) => g.dispose());
    geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, side: DoubleSide });
    const mesh = new Mesh(geo, mat); mesh.name = "aw:bocagrandi:props"; mesh.castShadow = !low; mesh.receiveShadow = !low;
    const dim = new Color(0x55607a);
    mesh.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.6); };
    return mesh;
  }
}
