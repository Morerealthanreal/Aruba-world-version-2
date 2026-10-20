// Barcadera cargo port (Aruba's container terminal, south coast). Off with ?barcadera=0.
// A draws the reclaimed terminal as bare sand, with palms on it and a sandy slope where the quay should be,
// and paints the whole basin the same turquoise as the reef flats. Public references describe a multi-cargo
// terminal run by ASTEC, rebuilt in 2015. It has a 440 m concrete berth with 11 m alongside, about 300 m of
// gantry-crane rail, bollards every 26 m, two breasting dolphins on the west side and one mooring dolphin on
// the east side, a shallow "barquito" quay, a paved ~90,000 m2 container yard with reefer plugs, and an
// aggregates bulk area. The equipment is one Panamax PACECO ship-to-shore gantry crane, one Liebherr mobile
// harbour crane and reach stackers stacking up to five high.
// The basin isn't behind a breakwater: the Palm Island keys and their reef shelter it. The dredged water is
// dark blue close to the quay, the reef flat is turquoise, and the swell breaks on the reef's outer edge.
// Geometry is OSM, rebuilt in code: coastline 1072277802 (the quay faces), the port area 618957379, the
// yard's stacking aisles 1355177801-1355177810, 30287381 and 629639013, harbour water 1223442097 and reef
// 1017328559. Photos are reference only. Colours of the cranes and boxes are generic.
// 5 draw calls: yard paving sheet, basin water sheet, reef surf ribbon, one merged props mesh (quay, dolphins,
// cranes, masts, bulk piles, revetment rock, kadushi) and one InstancedMesh of containers. Built once, in 3
// small steps after the height regions under the port have streamed in. Per frame there's only a colour or
// opacity lerp. Veg on the paved yard (and palms anywhere in the port) is skipped through A's __awVegHit hook.
// The deck follows A's ground except over the slope at the face, so walkers never sink into it.
// Stays east of x -3330 (airport side) and far west of Spaans Lagoen. A's own fence, banner and tank
// heroes by the Barcadera road are not touched.
import {
  BoxGeometry, BufferGeometry, Color, ConeGeometry, CylinderGeometry, DoubleSide, Float32BufferAttribute,
  IcosahedronGeometry, InstancedMesh, Matrix4, Mesh, MeshBasicMaterial, MeshLambertMaterial, Quaternion, Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { uNight, uTime } from "./uniforms";

type P = number[];
// Quay frame: s along the main berth from its west end (OSM coastline node at -3217.2, 4349.0), w seaward.
const QX = -3217.2, QZ = 4349.0, UX = 0.898563, UZ = 0.438844, NX = -UZ, NZ = UX; // N = seaward normal
const YAW = Math.atan2(-UZ, UX); // rotateY(YAW) maps local +x to the berth direction and local +z to seaward
const toW = (s: number, w: number): P => [QX + UX * s + NX * w, QZ + UZ * s + NZ * w];
const toS = (x: number, z: number): P => [(x - QX) * UX + (z - QZ) * UZ, (x - QX) * NX + (z - QZ) * NZ];
// OSM coastline 1072277802 round the reclaimed terminal (land on the left): west revetment, main berth,
// the step back to the barquito quay, the barquito quay, then the east and north-east revetments.
const CHAIN: P[] = [[-3186.5, 4286.0], [-3217.2, 4349.0], [-2812.6, 4546.6], [-2791.0, 4500.0], [-2686.6, 4547.0], [-2597.5, 4354.5], [-2680.4, 4289.0]];
const KIND = ["rock", "main", "low", "low", "rock", "rock"]; // per CHAIN segment
const Q0 = 1, Q1 = 4; // CHAIN vertices 1..4 are the concrete quay run
// Paved terminal in quay-frame metres (s, inland d = -w): OSM port area 618957379 on the sea and west sides,
// behind the back aisle 629639013 and the Astec gate fences (618957404, 618957415) on the land side.
const YARD_SD: P[] = [[0, 0], [450.3, 0], [449.2, 51.4], [562.0, 56.1], [559.3, 267.0], [452.8, 285.2], [430, 252], [222, 250], [205, 228], [117.2, 226.6], [121.5, 121.9], [87.4, 120.0], [22.0, 120.2], [21.4, 103.1], [4.5, 102.0], [-0.1, 70.1]];
const YARD: P[] = YARD_SD.map(([s, d]) => toW(s, -d));
// Stacking aisles (OSM service ways running inland from the apron road at d 34), their s positions
const AISLES = [141, 162, 190, 217, 242, 269, 297, 347, 378, 426];
// OSM harbour water 1223442097 ("Barcadera haven"), cut at x -3330 so nothing reaches the airport side
const BASIN: P[] = [[-3330, 4296.4], [-2811.0, 4554.8], [-2791.4, 4539.5], [-2764.5, 4554.0], [-2805.6, 4623.0], [-2830.4, 4681.0], [-2897.8, 4761.7], [-3015.9, 4757.4], [-3143.8, 4716.5], [-3253.8, 4660.1], [-3330, 4596]];
// OSM reef 1017328559: inner edge (the keys' basin side) and outer edge (seaward of the keys), simplified
const REEF_IN: P[] = [[-2586.0, 4948.0], [-2611.9, 4928.6], [-2706.7, 4887.4], [-2774.4, 4847.4], [-2806.8, 4834.7], [-2818.7, 4806.8], [-2879.4, 4783.4], [-2913.7, 4775.0], [-2959.0, 4777.9], [-3053.4, 4767.2], [-3098.5, 4753.0], [-3216.9, 4701.1], [-3278.2, 4666.3], [-3335.4, 4619.9]];
const REEF_OUT: P[] = [[-3294.6, 4842.9], [-3213.2, 4889.7], [-3064.6, 4937.5], [-2931.5, 4989.6], [-2826.5, 5045.6], [-2733.1, 5089.8], [-2599.2, 5144.1]];
const WATER_Y = 0.05, FO = 4.5, DW = 26; // quay face this far seaward of OSM's line (A's waterline is 0-4 m out); deck depth

// deck sits on the edge height only over the slope at the face, then follows A's ground (walkers stay on top)
const ramp = (w: number) => { const t = Math.max(0, Math.min(1, (-w - 1) / 8)); return t * t * (3 - 2 * t); };
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
function lineDist(x: number, z: number, p: P[], closed = false) {
  let m = 1e9; const n = p.length;
  for (let i = 1; i < n + (closed ? 1 : 0); i++) { const a = p[i - 1], b = p[i % n]; m = Math.min(m, segDist(x, z, a[0], a[1], b[0], b[1])); }
  return m;
}
const segN = (i: number): P => { const [ax, az] = CHAIN[i], [bx, bz] = CHAIN[i + 1], l = Math.hypot(bx - ax, bz - az); return [-(bz - az) / l, (bx - ax) / l]; };
/** Distance to the nearest revetment (rock) face of the terminal. */
function rockDist(x: number, z: number) {
  let m = 1e9;
  for (let i = 0; i < KIND.length; i++) if (KIND[i] === "rock") m = Math.min(m, segDist(x, z, CHAIN[i][0], CHAIN[i][1], CHAIN[i + 1][0], CHAIN[i + 1][1]));
  return m;
}
/** Colour every vertex of a geometry and drop uvs, so differently built parts can be merged. */
function paint(g: BufferGeometry, hex: number, jitter = 0, seed = 0, shade = 0) {
  const geo = g.index ? g.toNonIndexed() : g; if (geo !== g) g.dispose();
  geo.deleteAttribute("uv");
  const c = new Color(hex), pos = geo.attributes.position, n = pos.count, a = new Float32Array(n * 3);
  const k = 1 + (hash(seed, 3.7) - 0.5) * jitter;
  let y0 = 1e9, y1 = -1e9;
  if (shade) for (let i = 0; i < n; i++) { const y = pos.getY(i); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  for (let i = 0; i < n; i++) {
    const f = shade ? k * (1 - shade + shade * (pos.getY(i) - y0) / Math.max(0.01, y1 - y0)) : k;
    a[i * 3] = c.r * f; a[i * 3 + 1] = c.g * f; a[i * 3 + 2] = c.b * f;
  }
  geo.setAttribute("color", new Float32BufferAttribute(a, 3));
  return geo;
}
function sheet(pos: number[], col: number[], idx: number[]) {
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
  geo.setAttribute("color", new Float32BufferAttribute(col, 4));
  geo.setAttribute("normal", new Float32BufferAttribute(new Float32Array(pos.length).map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
  geo.setIndex(idx); geo.computeBoundingSphere();
  return geo;
}

type World = { heightAt(x: number, z: number): number; regions: Map<string, { rx: number; rz: number; H?: unknown; vegCache?: unknown }>; M: { X0: number; Z0: number; RS: number }; vegDirty?: boolean };
type H = (x: number, z: number) => number;
type Sample = { x: number; z: number; mx: number; mz: number; seg: number; top: number };

export class Barcadera {
  stats = { built: false, yardQuads: 0, seaQuads: 0, surfQuads: 0, containers: 0, rocks: 0, vegSkipped: 0, ms: 0 };
  private timer = 0;
  private step = 0;
  private quay: Sample[] = [];
  private qMain: Sample[] = [];
  private qLow: Sample[] = [];
  constructor(private g: AGame) {
    this.installVeg();
    this.timer = window.setInterval(() => this.tick(), 1500);
  }

  /** A asks this hook for every palm (p), divi (d), kadushi (k), shrub (s) and rock (r) it places. */
  private installVeg() {
    const w = window as unknown as { __awVegHit?: (x: number, z: number, n?: string) => boolean };
    const prev = w.__awVegHit;
    w.__awVegHit = (x, z, n) => {
      if (x > -3340 && x < -2350 && z > 3990 && z < 4600) {
        // nothing grows on the paving; palms aren't part of the port's dry scrub at all
        if (inside(YARD, x, z) && rockDist(x, z) > 10) { this.stats.vegSkipped++; return true; }
        if (n === "p" && x < -2560 && z > 4190) { this.stats.vegSkipped++; return true; }
      }
      return prev ? prev(x, z, n) : false;
    };
    // regions that already cached their veg before this add-on loaded: re-ask the hook once
    const W = this.g.real as unknown as World;
    if (W?.regions && W.M) {
      let hit = false;
      for (const r of W.regions.values()) if ((r.rx === 7 || r.rx === 8) && (r.rz === 15 || r.rz === 16) && r.vegCache) { r.vegCache = undefined; hit = true; }
      if (hit) W.vegDirty = true;
    }
  }

  private tick() {
    const W = this.g.real as unknown as World;
    if (!W?.regions || !W.M) return;
    const t0 = performance.now();
    const low = this.g.real?.q?.name === "low";
    if (this.step === 0) {
      const ready = new Set<string>();
      for (const r of W.regions.values()) if (r.H) ready.add(`${r.rx},${r.rz}`);
      const keys = new Set<string>();
      for (const [x, z] of [...YARD, ...BASIN]) keys.add(`${Math.floor((x - W.M.X0) / W.M.RS)},${Math.floor((z - W.M.Z0) / W.M.RS)}`);
      if (![...keys].every((k) => ready.has(k))) return;
    }
    const h: H = (x, z) => { const v = W.heightAt(x, z); return Number.isFinite(v) ? v : 0; };
    if (this.step === 0) { this.quay = this.sampleQuay(h); this.qMain = this.quay.filter((q) => q.seg === 1); this.qLow = this.quay.filter((q) => q.seg > 1); this.g.scene.add(this.yard(h, low)); }
    else if (this.step === 1) this.g.scene.add(this.sea(h, low), this.surf(low));
    else if (this.step === 2) { this.g.scene.add(this.props(h, low), this.containers(h, low)); window.clearInterval(this.timer); this.stats.built = true; }
    this.step++;
    this.stats.ms += Math.round(performance.now() - t0);
  }

  /** Cross-sections along the concrete quay run, mitred at the corners, with a deck height that covers A's slope. */
  private sampleQuay(h: H): Sample[] {
    const S: Sample[] = [];
    for (let i = Q0; i < Q1; i++) {
      const [ax, az] = CHAIN[i], [bx, bz] = CHAIN[i + 1], len = Math.hypot(bx - ax, bz - az), n = Math.max(1, Math.round(len / 5));
      for (let k = i > Q0 ? 1 : 0; k <= n; k++) {
        const t = k / n, x = ax + (bx - ax) * t, z = az + (bz - az) * t;
        let [mx, mz] = segN(i);
        if (k === n && i + 1 < Q1) { // mitre into the next segment so the face and deck join cleanly
          const [cx, cz] = segN(i + 1), d = 1 + mx * cx + mz * cz; mx = (mx + cx) / d; mz = (mz + cz) / d;
        }
        let top = -1e9;
        for (let w = -9; w <= 0; w += 1.5) top = Math.max(top, h(x + mx * w, z + mz * w));
        S.push({ x, z, mx, mz, seg: i, top: Math.min(7.5, Math.max(0.9, top + 0.15)) });
      }
    }
    // smooth the deck along the run so it reads as one slab
    const tops = S.map((_, i) => { let a = 0, c = 0; for (let j = Math.max(0, i - 5); j <= Math.min(S.length - 1, i + 5); j++) { a += S[j].top; c++; } return a / c; });
    S.forEach((s, i) => { s.top = Math.max(s.top, tops[i]); });
    return S;
  }

  /** Deck height at a point on the quay strip (or -1e9 off it): flat at the face, easing down to A's ground inland. */
  private deckAt(h: H, x: number, z: number) {
    const [s, w] = toS(x, z);
    let best = -1e9;
    if (s > -2 && s < 452 && w < FO + 0.1 && w > -DW) { // main berth
      const S = this.qMain;
      const f = Math.max(0, Math.min(S.length - 1, (s / 450.3) * (S.length - 1))), i = Math.floor(f), j = Math.min(S.length - 1, i + 1);
      const top = S[i].top + (S[j].top - S[i].top) * (f - i), r = ramp(w);
      best = Math.max(h(x, z) + 0.12, top * (1 - r) + (h(x, z) + 0.12) * r);
    } else for (const q of this.qLow) if (Math.hypot(x - q.x, z - q.z) < DW + FO) {
      const w2 = (x - q.x) * q.mx + (z - q.z) * q.mz; const r = ramp(w2);
      if (w2 < FO + 0.1 && w2 > -DW) best = Math.max(best, Math.max(h(x, z) + 0.12, q.top * (1 - r) + (h(x, z) + 0.12) * r));
    }
    return best;
  }
  private surfY(h: H, x: number, z: number) { return Math.max(h(x, z) + 0.1, this.deckAt(h, x, z)); }

  /** Grey paving over the terminal: concrete apron at the quay, darker asphalt in the stacks, a dusty bulk corner. */
  private yard(h: H, low: boolean): Mesh {
    const S = low ? 6 : 4;
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (const [x, z] of YARD) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
    x0 = Math.floor(x0 / S) * S - S; z0 = Math.floor(z0 / S) * S - S;
    const nx = Math.ceil((x1 - x0) / S) + 3, nz = Math.ceil((z1 - z0) / S) + 3;
    const pos: number[] = [], col: number[] = [], idx: number[] = [], vid = new Int32Array(nx * nz).fill(-1);
    const apron = new Color(0x8b8b89), asph = new Color(0x5d5d5c), asph2 = new Color(0x6c6a66), bulk = new Color(0xa49d8e), stain = new Color(0x8a8377), c = new Color();
    const vert = (i: number, j: number) => {
      const k = j * nx + i; if (vid[k] >= 0) return vid[k];
      const x = x0 + i * S, z = z0 + j * S, [s, w] = toS(x, z), d = -w;
      c.copy(asph).lerp(asph2, hash(Math.floor(x / 9), Math.floor(z / 9)) * 0.8);
      if (d < 40 && s > 125) c.copy(apron).multiplyScalar(0.95 + hash(x * 0.3, z * 0.3) * 0.08); // concrete apron
      if (s < 125 && d < 125) c.copy(bulk).lerp(stain, hash(Math.floor(x / 7), Math.floor(z / 7)) * 0.7); // bulk area
      c.multiplyScalar(0.96 + hash(x * 0.71, z * 0.37) * 0.07);
      // unpaved crest along the revetments (A's ground and the scrub show there), soft at the land edge
      const a = 0.96 * smooth(4, 11, rockDist(x, z)) * smooth(-2, 4, lineDist(x, z, YARD, true) * (inside(YARD, x, z) ? 1 : -1));
      const y = Math.max(h(x, z) + 0.1, this.deckAt(h, x, z) + 0.02);
      pos.push(x, y, z); col.push(c.r, c.g, c.b, a);
      return (vid[k] = pos.length / 3 - 1);
    };
    for (let j = 0; j + 1 < nz; j++) for (let i = 0; i + 1 < nx; i++) {
      const cx = x0 + (i + 0.5) * S, cz = z0 + (j + 0.5) * S;
      if (!inside(YARD, cx, cz) && lineDist(cx, cz, YARD, true) > S) continue;
      const [s, w] = toS(cx, cz);
      if (s > 2 && s < 448 && w > -DW + 8) continue; // the deck covers the berth strip
      const a = vert(i, j), b = vert(i + 1, j), d = vert(i, j + 1), e = vert(i + 1, j + 1);
      idx.push(a, d, b, b, d, e); this.stats.yardQuads++;
    }
    const mat = new MeshLambertMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
    const m = new Mesh(sheet(pos, col, idx), mat); m.name = "aw:barcadera:yard";
    const dim = new Color(0x2c3448);
    m.onBeforeRender = () => { const k = uNight.value; mat.color.setHex(0xffffff).lerp(dim, k); mat.opacity = 1 - 0.6 * k; };
    m.renderOrder = 1; m.castShadow = false; m.receiveShadow = !low;
    return m;
  }

  /** Dredged basin: dark blue along the berth, fading to A's turquoise toward the keys' reef flat. */
  private sea(h: H, low: boolean): Mesh {
    const S = low ? 8 : 6;
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (const [x, z] of BASIN) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
    x0 = Math.floor(x0 / S) * S; z0 = Math.floor(z0 / S) * S;
    const nx = Math.ceil((x1 - x0) / S) + 2, nz = Math.ceil((z1 - z0) / S) + 2;
    const pos: number[] = [], col: number[] = [], idx: number[] = [], vid = new Int32Array(nx * nz).fill(-1);
    const deep = new Color(0x123f5f), mid = new Color(0x1d6584), c = new Color();
    const main = CHAIN.slice(1, 3);
    const vert = (i: number, j: number) => {
      const k = j * nx + i; if (vid[k] >= 0) return vid[k];
      const x = x0 + i * S, z = z0 + j * S, dq = lineDist(x, z, main), dr = lineDist(x, z, REEF_IN);
      c.copy(deep).lerp(mid, smooth(40, 220, dq));
      let a = 0.86 * (1 - smooth(150, 300, dq)) * smooth(10, 80, dr);
      a = Math.max(a, 0.5 * (1 - smooth(20, 70, lineDist(x, z, CHAIN.slice(2, 5))))); // the barquito corner is dredged too
      a *= smooth(-3330, -3140, x) * (1 - smooth(-0.5, -0.05, h(x, z)));
      a *= smooth(-6, 50, lineDist(x, z, BASIN, true) * (inside(BASIN, x, z) ? 1 : -1)) * 0.85; // soft edge, no hard outline
      pos.push(x, WATER_Y, z); col.push(c.r, c.g, c.b, a);
      return (vid[k] = pos.length / 3 - 1);
    };
    for (let j = 0; j + 1 < nz; j++) for (let i = 0; i + 1 < nx; i++) {
      const cx = x0 + (i + 0.5) * S, cz = z0 + (j + 0.5) * S;
      if (cx < -3330 || (!inside(BASIN, cx, cz) && lineDist(cx, cz, BASIN, true) > S) || h(cx, cz) > 0.3) continue;
      const a = vert(i, j), b = vert(i + 1, j), d = vert(i, j + 1), e = vert(i + 1, j + 1);
      idx.push(a, d, b, b, d, e); this.stats.seaQuads++;
    }
    const mat = new MeshLambertMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const m = new Mesh(sheet(pos, col, idx), mat); m.name = "aw:barcadera:basin";
    const day = new Color(0xffffff), night = new Color(0x0d2238);
    m.onBeforeRender = () => { const k = uNight.value; mat.color.copy(day).lerp(night, k); mat.opacity = 1 - 0.55 * k; };
    m.renderOrder = 3; m.castShadow = false; m.receiveShadow = false; // after A's water (renderOrder 2)
    return m;
  }

  /** The swell breaking on the reef's outer edge, in sections, with foam washing in over the flat. */
  private surf(low: boolean): Mesh {
    const pos: number[] = [], col: number[] = [], idx: number[] = [];
    const step = low ? 6 : 4, Y = WATER_Y + 0.1;
    let run = 0, first = true;
    for (let i = 0; i + 1 < REEF_OUT.length; i++) {
      const [ax, az] = REEF_OUT[i], [bx, bz] = REEF_OUT[i + 1], len = Math.hypot(bx - ax, bz - az);
      let nx = -(bz - az) / len, nz = (bx - ax) / len; if (nz < 0) { nx = -nx; nz = -nz; } // seaward is south
      const n = Math.max(1, Math.ceil(len / step));
      for (let k = i > 0 ? 1 : 0; k <= n; k++) {
        const s0 = run + (k / n) * len, x = ax + (bx - ax) * k / n, z = az + (bz - az) * k / n;
        const sec = Math.sin(s0 * 0.05 + Math.sin(s0 * 0.013) * 2.7) * 0.5 + 0.5;
        let a = (0.35 + 0.6 * smooth(0.3, 0.8, sec)) * (0.8 + 0.2 * hash(s0, 1.3));
        a *= smooth(-3330, -3250, x) * (1 - smooth(-2700, -2600, x));
        const wi = (7 + 9 * hash(Math.floor(s0 / 11), 2.1)) * (0.6 + 0.4 * sec), hc = 0.35 * a;
        const base = pos.length / 3;
        // seaward lip, the white break standing a little up, foam trailing in over the reef
        pos.push(x + nx * 3, Y, z + nz * 3, x, Y + hc, z, x - nx * wi * 0.4, Y + hc * 0.2, z - nz * wi * 0.4, x - nx * wi, Y, z - nz * wi);
        col.push(1, 1, 1, 0, 1, 1, 1, a, 1, 1, 1, a * (0.4 + 0.4 * hash(Math.floor(s0 / 7), 7.7)), 1, 1, 1, 0);
        if (!first) { const p = base - 4; for (let r = 0; r < 3; r++) idx.push(p + r, base + r, p + r + 1, p + r + 1, base + r, base + r + 1); this.stats.surfQuads += 3; }
        first = false;
      }
      run += len;
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setIndex(idx); geo.computeBoundingSphere();
    const mat = new MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
    const m = new Mesh(geo, mat); m.name = "aw:barcadera:surf";
    const day = new Color(0xf4fbff), night = new Color(0x2a3a4c);
    m.onBeforeRender = () => { mat.color.copy(day).lerp(night, uNight.value); mat.opacity = 0.7 + 0.3 * Math.sin(uTime.value * 0.6); };
    m.renderOrder = 4; m.castShadow = false; m.receiveShadow = false;
    return m;
  }

  /** Quay deck and face, fenders, bollards, rails, dolphins, the two cranes, masts, bulk piles, revetment and scrub. */
  private props(h: H, low: boolean): Mesh {
    const parts: BufferGeometry[] = [];
    // ---- quay: deck slab, vertical face, end caps (one hand-built strip, vertex coloured)
    {
      const Q = this.quay, rows = [FO, FO - 1.25, FO - 1.3, FO - 1.6, FO - 1.65, 0, -5, -10, -15, -20, -DW];
      const pos: number[] = [], col: number[] = [], idx: number[] = [];
      const cope = new Color(0x9f9f9c), conc = new Color(0x8b8b89), yel = new Color(0xd9b43a), faceC = new Color(0x8c8b87), wet = new Color(0x4b4f4d), c = new Color();
      const push = (x: number, y: number, z: number, cc: Color) => { pos.push(x, y, z); col.push(cc.r, cc.g, cc.b); return pos.length / 3 - 1; };
      const R = rows.length, deck: number[][] = [];
      Q.forEach((q) => {
        const row: number[] = [];
        rows.forEach((w, k) => {
          const x = q.x + q.mx * w, z = q.z + q.mz * w, g = h(x, z) + 0.12, r = ramp(w);
          const y = Math.max(g, q.top * (1 - r) + g * r);
          c.copy(k < 2 ? cope : k < 4 ? yel : conc).multiplyScalar(0.95 + hash(q.x * 0.2 + k, q.z * 0.2) * 0.08);
          row.push(push(x, y, z, c));
        });
        deck.push(row);
      });
      for (let i = 0; i + 1 < Q.length; i++) for (let k = 0; k + 1 < R; k++) {
        const a = deck[i][k], b = deck[i + 1][k], d = deck[i][k + 1], e = deck[i + 1][k + 1];
        idx.push(a, b, d, b, e, d);
      }
      // face: cope line, weathered concrete, a dark wet band at the waterline, down into the water
      const face: number[][] = Q.map((q) => {
        const x = q.x + q.mx * FO, z = q.z + q.mz * FO;
        return [push(x, q.top, z, cope), push(x, q.top - 0.45, z, faceC), push(x, 0.7, z, c.copy(faceC).multiplyScalar(0.85)), push(x, 0.1, z, wet), push(x, -3, z, wet)];
      });
      for (let i = 0; i + 1 < Q.length; i++) for (let k = 0; k < 4; k++) {
        const a = face[i][k], b = face[i + 1][k], d = face[i][k + 1], e = face[i + 1][k + 1];
        idx.push(a, d, b, b, d, e);
      }
      // end caps down to A's ground at both ends of the run
      for (const [qi, sgn] of [[0, 1], [Q.length - 1, -1]] as const) {
        const q = Q[qi], top: number[] = [], bot: number[] = [];
        rows.forEach((w) => {
          const x = q.x + q.mx * w, z = q.z + q.mz * w, g = h(x, z) + 0.12, r = ramp(w);
          top.push(push(x, Math.max(g, q.top * (1 - r) + g * r), z, faceC)); bot.push(push(x, Math.min(g - 0.6, -0.5), z, wet));
        });
        for (let k = 0; k + 1 < R; k++) sgn > 0 ? idx.push(top[k], bot[k], top[k + 1], top[k + 1], bot[k], bot[k + 1]) : idx.push(top[k], top[k + 1], bot[k], top[k + 1], bot[k + 1], bot[k]);
      }
      const g = new BufferGeometry();
      g.setAttribute("position", new Float32BufferAttribute(pos, 3));
      g.setAttribute("color", new Float32BufferAttribute(col, 3));
      g.setIndex(idx); g.computeVertexNormals();
      parts.push(g.toNonIndexed()); g.dispose();
    }
    // helpers in the quay frame (s along the berth, w seaward, y up)
    const deckY = (s: number, w: number) => { const [x, z] = toW(s, w); return this.surfY(h, x, z); };
    const box = (s: number, w: number, y: number, ls: number, ly: number, lw: number, hex: number, shade = 0.15, rot = 0) => {
      const b = new BoxGeometry(ls, ly, lw); if (rot) b.rotateY(rot); b.translate(s, y + ly / 2, w); b.rotateY(YAW); b.translate(QX, 0, QZ);
      parts.push(paint(b, hex, 0.06, s + w, shade));
    };
    // straight member between two points in the s-w-y frame
    const beam = (s0: number, w0: number, y0: number, s1: number, w1: number, y1: number, t: number, hex: number) => {
      const ds = s1 - s0, dw = w1 - w0, dy = y1 - y0, L = Math.hypot(ds, dw, dy);
      const b = new BoxGeometry(t, L, t);
      const q = new Quaternion().setFromUnitVectors(new Vector3(0, 1, 0), new Vector3(ds / L, dy / L, dw / L));
      b.applyQuaternion(q); b.translate((s0 + s1) / 2, (y0 + y1) / 2, (w0 + w1) / 2); b.rotateY(YAW); b.translate(QX, 0, QZ);
      parts.push(paint(b, hex, 0.04, s0 + y0));
    };
    const cyl = (s: number, w: number, y: number, r: number, ly: number, hex: number, seg = 8) => {
      const b = new CylinderGeometry(r, r, ly, seg); b.translate(s, y + ly / 2, w); b.rotateY(YAW); b.translate(QX, 0, QZ);
      parts.push(paint(b, hex, 0.05, s * 3 + w));
    };
    const mainTop = (s: number) => deckY(s, FO - 0.5);
    // fenders on the face and bollards on the cope (1000 kN every 26 m)
    for (let s = 6; s < 447; s += 13) { const y = mainTop(s); box(s, FO + 0.3, Math.max(0.2, y - 2.9), 1.7, 2.6, 0.6, 0x1d1d1f, 0.2); }
    for (let s = 10; s < 447; s += 26) { const y = mainTop(s); cyl(s, FO - 0.9, y, 0.32, 0.55, 0x2a2b2e); cyl(s, FO - 0.9, y + 0.55, 0.44, 0.14, 0x2a2b2e); }
    // two crane rails, ~300 m on the east part of the berth
    const WR = FO - 2.5, LR = WR - 30.5;
    for (let s = 146; s < 444; s += 6) for (const w of [WR, LR]) box(s + 3, w, deckY(s + 3, w) - 0.02, 6.05, 0.08, 0.3, 0x3c3a37, 0);
    // breasting dolphins west of the berth, mooring dolphin east of it, with steel catwalks to the quay
    const dTop = mainTop(2);
    const dolph = (s: number, w: number, hy: number) => { box(s, w, -3, 6.5, hy + 3, 6.5, 0x938f86, 0.35); box(s, w + 3.4, Math.max(0, hy - 2.6), 2.2, 2.4, 0.5, 0x1d1d1f, 0.2); cyl(s, w - 1.2, hy, 0.3, 0.5, 0x2a2b2e); };
    dolph(-30, FO + 1, dTop); dolph(-62, FO + 1, dTop);
    beam(-1, FO - 2, dTop - 0.3, -26.5, FO - 0.5, dTop - 0.3, 1.0, 0x6a6f74); beam(-33.5, FO - 0.5, dTop - 0.3, -58.5, FO - 0.5, dTop - 0.3, 1.0, 0x6a6f74);
    const eTop = mainTop(445);
    dolph(482, FO + 14, eTop); beam(449, FO + 6, eTop - 0.3, 478.5, FO + 13, eTop - 0.3, 1.0, 0x6a6f74);
    // barquito quay: smaller bollards
    for (const q of this.quay) if (q.seg === 3 && hash(q.x, q.z) < 0.45) { const x = q.x + q.mx * (FO - 0.8), z = q.z + q.mz * (FO - 0.8), [s, w] = toS(x, z); cyl(s, w, q.top, 0.22, 0.45, 0x2a2b2e, 6); }
    // ---- Panamax ship-to-shore gantry crane on the rails (boom lowered over the berth)
    {
      const s0 = 305, y0 = deckY(s0, WR), white = 0xd9d8d2, blue = 0x2d5a86, P = 40, BY = 43;
      for (const ds of [-9, 9]) {
        for (const w of [WR, LR]) { box(s0 + ds, w, y0, 7, 1.6, 2.2, 0x55524c, 0.3); box(s0 + ds, w, y0 + 1.6, 1.8, P - 1.6, 1.8, white, 0.1); }
        box(s0 + ds, (WR + LR) / 2, y0 + P, 2.0, 2.2, WR - LR + 2, white); // portal beams across the rails
        box(s0 + ds, (WR + LR) / 2, y0 + 12, 1.4, 1.4, WR - LR, white); // sill ties
        beam(s0 + ds, WR, y0 + 13, s0 + ds, LR, y0 + P - 1, 0.8, white); // diagonal bracing
      }
      for (const w of [WR, LR]) box(s0, w, y0 + P, 20, 1.8, 1.8, white); // longitudinal ties at the top of the legs
      for (const ds of [-2.3, 2.3]) box(s0 + ds, (WR + 44 + LR - 16) / 2, y0 + BY, 1.4, 3.0, WR + 44 - (LR - 16), white); // boom + girder
      // A-frame and stays
      const AW = WR - 4, AY = y0 + 64;
      for (const ds of [-8, 8]) { beam(s0 + ds, WR, y0 + P + 2, s0 + ds * 0.3, AW, AY, 1.3, white); beam(s0 + ds, LR, y0 + P + 2, s0 + ds * 0.3, AW, AY, 1.3, white); }
      box(s0, AW, AY - 1, 6, 2, 2, white);
      for (const ds of [-2.3, 2.3]) { beam(s0 + ds * 0.5, AW, AY, s0 + ds, WR + 43, y0 + BY + 3, 0.35, 0x8a8a86); beam(s0 + ds * 0.5, AW, AY, s0 + ds, LR - 15, y0 + BY + 3, 0.35, 0x8a8a86); }
      box(s0, LR - 9, y0 + BY + 3, 9, 4.5, 11, blue, 0.2); // machinery house on the backreach
      box(s0, WR + 8, y0 + BY - 4.5, 6, 2.2, 6, 0x6d6f72); box(s0 + 1.8, WR + 8, y0 + BY - 7.6, 2.6, 3, 3, 0x3f5f80); // trolley and cab
      box(s0, WR + 44, y0 + BY - 0.5, 6, 1, 2, 0xc4362a); // boom tip
    }
    // ---- Liebherr mobile harbour crane on the apron, boom raised toward the berth
    {
      const s0 = 205, w0 = -13, y0 = deckY(s0, w0), body = 0xe9e7e0, yel = 0xe0b11e;
      box(s0, w0, y0 + 0.9, 15, 2.4, 9, yel, 0.25);
      for (const a of [-1, 1]) for (const b of [-1, 1]) { beam(s0 + a * 5, w0 + b * 3.5, y0 + 2.2, s0 + a * 9, w0 + b * 7.5, y0 + 1.6, 0.9, yel); box(s0 + a * 9, w0 + b * 7.5, y0, 2.2, 1.0, 2.2, 0x3a3a3a); }
      cyl(s0, w0, y0 + 3.3, 1.9, 19, body, 8);
      box(s0, w0 - 2, y0 + 22, 7.5, 4.2, 12, body, 0.2); box(s0 + 2.8, w0 + 2.5, y0 + 19, 2.4, 2.6, 2.6, 0x46607a); // superstructure, cab
      box(s0, w0 - 8, y0 + 21.5, 7.8, 3.2, 3, 0x8c8c88); // counterweight
      for (const ds of [-1.2, 1.2]) beam(s0 + ds, w0 + 3, y0 + 24, s0 + ds * 0.5, w0 + 30, y0 + 53, 1.1, body);
      beam(s0, w0 + 30, y0 + 53, s0, w0 + 30, y0 + 30, 0.12, 0x333333); box(s0, w0 + 30, y0 + 28.6, 2.4, 1.4, 6, yel); // hoist rope + spreader
    }
    // ---- reach stackers in two aisles
    for (const [s0, w0, rot] of [[230, -60, 0], [322, -150, 0.1]]) {
      const y0 = deckY(s0, w0), c = 0xc9342b;
      box(s0, w0, y0 + 0.6, 3.6, 2.4, 8.5, c, 0.3, rot); box(s0, w0 - 2.6, y0 + 3.0, 2.4, 2.4, 2.4, 0x3d4a55, 0, rot);
      beam(s0, w0 - 3, y0 + 3.2, s0, w0 + 6, y0 + 9, 1.0, c); box(s0, w0 + 6.5, y0 + 8.2, 6.2, 0.6, 1.2, 0xe0b11e, 0, rot);
      for (const a of [-1.6, 1.6]) for (const b of [-2.8, 2.8]) cyl(s0 + a, w0 + b, y0, 0.8, 0.6, 0x1c1c1c, 8);
    }
    // ---- high-mast floodlights at the aisle crossings and on the apron
    for (const [s, d] of [[162, 135], [242, 134], [297, 136], [378, 138], [190, 36], [347, 36], [440, 150], [60, 110]]) {
      const y = deckY(s, -d); cyl(s, -d, y, 0.45, 30, 0xa8aaa8, 6); box(s, -d, y + 30, 3.2, 1.0, 1.2, 0x5c5f63);
    }
    // ---- aggregates bulk area: three piles in a block-walled bin (reference: Commons "Barcadera - panoramio (1)")
    for (const [s, d, r, hh, cc] of [[38, 62, 13, 7, 0xd2c6a8], [70, 66, 12, 6.5, 0x9b968c], [100, 60, 11, 6, 0xcbb894]]) {
      const y = deckY(s, -d), cn = new ConeGeometry(r, hh, low ? 9 : 14, 1); cn.translate(s, y + hh / 2 - 0.2, -d); cn.rotateY(YAW); cn.translate(QX, 0, QZ);
      parts.push(paint(cn, cc, 0.05, s, 0.3));
    }
    for (let s = 22; s < 118; s += 2.4) box(s, -84, deckY(s, -84) - 0.1, 2.3, 2.6, 1.0, 0xa7a49c, 0.2);
    for (const s of [54, 86]) for (let d = 58; d < 84; d += 2.4) box(s, -d, deckY(s, -d) - 0.1, 1.0, 2.6, 2.3, 0xa7a49c, 0.2);
    // ---- armour-stone revetment on the west, east and north-east faces, at A's waterline
    const stone = [0x8b8378, 0x9c9386, 0x7a736b, 0xa59d90, 0x6f6962];
    for (let i = 0; i < KIND.length; i++) {
      if (KIND[i] !== "rock") continue;
      const [ax, az] = CHAIN[i], [bx, bz] = CHAIN[i + 1], len = Math.hypot(bx - ax, bz - az), [nx, nz] = segN(i), rot = Math.atan2(-(bz - az), bx - ax);
      const n = Math.ceil(len / (low ? 3.2 : 2.4));
      for (let k = 0; k < n; k++) {
        const t = (k + hash(ax + k, az)) / n, x = ax + (bx - ax) * t, z = az + (bz - az) * t;
        let wl = 0; for (let o = -12; o <= 20; o += 1) if (h(x + nx * o, z + nz * o) < 0) { wl = o; break; }
        for (const [off, sz] of [[wl - 1, 1.0], [wl - 4.5, 0.85], [wl + 2, 0.8]] as const) {
          if (low && sz < 0.85 && hash(k, i) < 0.5) continue;
          const o = off + (hash(x, z + off) - 0.5) * 2, px = x + nx * o, pz = z + nz * o, r = (1.1 + hash(z, x + off) * 1.0) * sz;
          const g = new IcosahedronGeometry(1, 0), pa = g.attributes.position as Float32BufferAttribute, sd = px + pz * 1.7;
          for (let v = 0; v < pa.count; v++) { const vx = pa.getX(v), vy = pa.getY(v), vz = pa.getZ(v), j = 0.75 + 0.5 * hash(sd + Math.round(vx * 100) * 1.37 + Math.round(vz * 100) * 0.71, Math.round(vy * 100)); pa.setXYZ(v, vx * j, vy * j, vz * j); }
          g.computeVertexNormals(); g.scale(r * 1.3, r * 0.8, r); g.rotateY(rot + hash(sd, 2) * 1.2); g.translate(px, Math.max(h(px, pz), -1.4) + r * 0.3, pz);
          parts.push(paint(g, stone[(k + i) % stone.length], 0.25, sd)); this.stats.rocks++;
        }
      }
      // dry crest: kadushi columns and low scrub between the stones and the paving
      for (let s = 4; s < len - 4; s += low ? 9 : 6) {
        const t = s / len, x = ax + (bx - ax) * t - nx * (5 + hash(s, i) * 5), z = az + (bz - az) * t - nz * (5 + hash(i, s) * 5);
        const y = h(x, z);
        if (hash(s * 1.3, i) < 0.4) {
          for (let c = 0; c < 3 + Math.floor(hash(s, 9) * 3); c++) {
            const ch = 1.8 + hash(s + c, 4) * 2.6, cx = x + (hash(c, s) - 0.5) * 1.2, cz = z + (hash(s, c) - 0.5) * 1.2;
            const cg = new CylinderGeometry(0.17, 0.21, ch, 6); cg.translate(cx, y + ch / 2, cz); parts.push(paint(cg, 0x58744a, 0.15, s + c, 0.25));
          }
        } else {
          const sg = new IcosahedronGeometry(1, 0); sg.scale(1.6 + hash(s, 3), 0.8 + hash(3, s) * 0.5, 1.4); sg.translate(x, y + 0.35, z);
          parts.push(paint(sg, hash(s, 5) < 0.5 ? 0x6e6a44 : 0x7d7652, 0.2, s, 0.3));
        }
      }
    }
    const geo = mergeGeometries(parts)!; parts.forEach((g) => g.dispose());
    geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true });
    const mesh = new Mesh(geo, mat); mesh.name = "aw:barcadera:props"; mesh.castShadow = !low; mesh.receiveShadow = !low;
    const dim = new Color(0x4a5568);
    mesh.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.6); };
    return mesh;
  }

  /** Container stacks between the OSM aisles: 40 ft and 20 ft boxes, 1-4 high, a block of white reefers. */
  private containers(h: H, low: boolean): InstancedMesh {
    const spots: number[][] = []; // s, d(inland), len, tier, colour
    const pal = [0x2f5f9e, 0x1f3f6e, 0x7a2b22, 0xa33a2a, 0x8c8c86, 0xc9c4b8, 0xd86b1f, 0x3d6b45, 0xe6e4dc, 0x5a4a3a, 0x4f86b5, 0xb8892c, 0x2f5f9e, 0x8c8c86];
    const maxT = low ? 3 : 4;
    for (let a = 0; a + 1 < AISLES.length; a++) {
      const sA = AISLES[a] + 5.5, sB = AISLES[a + 1] - 5.5, cols = Math.floor((sB - sA) / 2.75);
      const reefer = a === 0;
      for (const [d0, d1] of [[41, 128], [143, AISLES[a] >= 217 ? 229 : 205]]) {
        if (reefer && d0 > 100) continue;
        for (let d = d0; d + 12.2 <= d1; d += 13.1) {
          // rows fill from the aisle sides, so the gaps are whole stacks in the middle of a row, not random holes
          const r = hash(d * 0.3 + a, a * 1.7 + d0), gap = r < (low ? 0.3 : 0.15) ? cols : Math.floor(hash(a, d) * (low ? cols * 0.6 : cols * 0.35));
          const g0 = Math.floor((cols - gap) / 2), rowT = 1 + Math.floor(hash(d + a * 7, d0) * (reefer ? 2 : maxT));
          for (let c = 0; c < cols; c++) {
          if (c >= g0 && c < g0 + gap) continue; // empty stacks
          const s = sA + 1.3 + c * 2.75;
          const tiers = Math.max(1, Math.min(reefer ? 2 : maxT, rowT + (hash(s, d) < 0.3 ? -1 : 0)));
          const twenty = !reefer && hash(s, d * 1.7) < 0.3;
          for (let t = 0; t < tiers; t++) {
            const cc = reefer ? (hash(t, s) < 0.8 ? 0xeeeeea : 0xd8d8d2) : pal[Math.floor(hash(s * 1.9 + t, d + t * 3) * pal.length) % pal.length];
            if (twenty) { spots.push([s, d + 3.03, 6.06, t, cc]); if (hash(s, d + t) < 0.85) spots.push([s, d + 9.17, 6.06, t, pal[Math.floor(hash(s + t, d * 2.3) * pal.length) % pal.length]]); }
            else spots.push([s, d + 6.1, 12.19, t, cc]);
          }
          }
        }
      }
    }
    // a few stacks of empties at the east end and boxes waiting on the apron
    for (let i = 0; i < (low ? 14 : 24); i++) { const s = 455 + hash(i, 1) * 90, d = 80 + hash(1, i) * 150; for (let t = 0; t < 1 + Math.floor(hash(i, 5) * 3); t++) spots.push([s, d, 12.19, t, pal[(i + t) % pal.length]]); }
    for (const s of [250, 263, 276]) spots.push([s, 24, 12.19, 0, pal[Math.floor(hash(s, 2) * pal.length)]]);
    const geo = new BoxGeometry(1, 1, 1); geo.translate(0, 0.5, 0);
    const pa = geo.attributes.position, sh = new Float32Array(pa.count * 3);
    for (let i = 0; i < pa.count; i++) { const k = pa.getY(i) > 0.5 ? 1.0 : 0.72; sh[i * 3] = sh[i * 3 + 1] = sh[i * 3 + 2] = k; } // darker at the foot of each box
    geo.setAttribute("color", new Float32BufferAttribute(sh, 3));
    const mat = new MeshLambertMaterial({ vertexColors: true });
    const im = new InstancedMesh(geo, mat, spots.length); im.name = "aw:barcadera:containers"; im.castShadow = !low; im.receiveShadow = !low;
    const m = new Matrix4(), q = new Quaternion().setFromAxisAngle(new Vector3(0, 1, 0), YAW), p = new Vector3(), sc = new Vector3(), c = new Color();
    const base = new Map<string, number>();
    spots.forEach(([s, d, len, t, cc], i) => {
      const key = `${Math.round(s * 4)},${Math.round(d)}`;
      let y = base.get(key);
      if (y === undefined) { const [x, z] = toW(s, -d); y = this.surfY(h, x, z) - 0.05; base.set(key, y); }
      const [x, z] = toW(s, -d);
      p.set(x, y + t * 2.6, z); sc.set(2.44, 2.59, len); m.compose(p, q, sc); im.setMatrixAt(i, m);
      im.setColorAt(i, c.setHex(cc).multiplyScalar(0.92 + hash(s * 3 + t, d) * 0.12));
    });
    const dim = new Color(0x4a5568);
    im.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.65); };
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere(); this.stats.containers = spots.length;
    return im;
  }
}
