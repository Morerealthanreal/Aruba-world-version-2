// Seroe Colorado / Colorado Point (Aruba's south-east tip) accuracy pass. Off with ?seroecolorado=0.
// A draws the headland as a smooth tan hill with a few green bushes, sloping gently into turquoise
// shallows, with no surf, no rocks and no lighthouse. References show a ~38 m red-ochre limestone
// plateau with pale dry-grass patches, a dark broken rock edge on the east and south-east sides where
// the trade-wind swell breaks straight onto the rocks in a white band, deep blue water close in, two
// rock islets off the Seroe Colorado natural bridge, three round concrete WWII 155 mm gun foundations
// ("Panama mounts") on the top, and the present lighthouse: a dark steel column on a concrete plinth
// carrying a square wire-mesh cage with the lamp, and a caged ladder (8 m, Fl W 6s).
// Geometry is OSM (coastline 98105051, cliff 908073341, islets 98105014 / 98105156, lighthouse node
// 540121392, gun nodes 999340561 / 5924271591 / 999340564, natural bridge node 6859250986) and A's
// road data, rebuilt in code. The inland edge of the red soil was read off satellite imagery; photos
// are reference only. 5 draw calls: one soil sheet, one dark-water sheet, one surf ribbon, one merged
// props mesh (rocks, islets, arch, gun foundations, lighthouse) and one tiny lamp flash. Built once
// in 3 small steps after the height regions have streamed in; per frame only a colour/opacity lerp
// when drawn. Stays east of x 10750 and south of z 10790: far from Boca Grandi, Rodgers Beach, Baby
// Beach, the Community Church and San Nicolas.
import {
  BoxGeometry, BufferGeometry, Color, CylinderGeometry, DoubleSide, Float32BufferAttribute, IcosahedronGeometry,
  Mesh, MeshBasicMaterial, MeshLambertMaterial, SphereGeometry, TorusGeometry, Vector4,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { uNight, uTime } from "./uniforms";

type P = number[];
// game metres (x east, z south). COAST: OSM coastline 98105051 from north of the plateau round Colorado
// Point to the south shore under it (N -> S, 1.5 m simplified). ISLETS: OSM place=island rings.
// CLIFF_S: OSM natural=cliff on the south side of the plateau. ROADS (ax, az, bx, bz, clearance): A's roads.
const COAST: P[] = [[11022.3,10791.7],[11028.8,10800.7],[11029.1,10808.6],[11035.6,10818.6],[11035.8,10832.5],[11042.6,10848.4],[11044.3,10870.7],[11061.7,10873.8],[11065.9,10880.7],[11084.1,10891.7],[11085.8,10897.1],[11079.5,10903.3],[11082.8,10906.2],[11091.1,10907.4],[11091.0,10919.3],[11103.1,10916.9],[11105.8,10919.7],[11111.7,10919.0],[11116.6,10923.9],[11115.8,10928.6],[11121.9,10930.6],[11121.6,10938.6],[11125.5,10939.0],[11130.7,10934.7],[11129.6,10942.6],[11131.7,10946.0],[11133.0,10942.6],[11138.5,10943.2],[11137.8,10939.4],[11147.5,10940.7],[11142.0,10949.9],[11146.2,10951.9],[11145.4,10955.9],[11147.9,10957.8],[11151.6,10955.1],[11154.1,10962.8],[11157.7,10962.3],[11159.5,10970.2],[11163.9,10973.9],[11161.8,10980.3],[11164.1,10986.5],[11180.9,10985.7],[11184.6,10982.6],[11200.4,10988.9],[11202.0,10997.8],[11196.8,11004.1],[11182.9,11013.1],[11180.3,11010.3],[11175.4,11012.4],[11173.0,11018.6],[11174.5,11030.3],[11178.9,11029.4],[11182.2,11034.4],[11175.4,11041.7],[11174.9,11045.4],[11177.6,11051.6],[11182.8,11055.2],[11183.5,11060.8],[11192.7,11056.0],[11193.1,11063.7],[11197.7,11056.0],[11206.2,11056.8],[11203.5,11060.4],[11206.3,11067.2],[11195.7,11080.6],[11193.6,11089.3],[11206.6,11087.7],[11201.1,11098.3],[11215.6,11098.1],[11228.8,11102.2],[11230.5,11116.6],[11228.0,11123.0],[11236.5,11120.3],[11243.2,11122.5],[11249.3,11119.9],[11251.1,11130.1],[11251.9,11126.2],[11262.2,11122.1],[11274.5,11125.9],[11275.6,11130.1],[11273.1,11136.8],[11266.7,11141.8],[11266.2,11145.3],[11276.9,11161.1],[11284.2,11161.0],[11290.6,11168.3],[11286.8,11170.0],[11285.1,11175.5],[11297.1,11179.1],[11304.3,11191.1],[11296.9,11191.4],[11294.6,11194.3],[11297.2,11205.7],[11290.9,11209.3],[11291.0,11212.4],[11300.2,11217.6],[11305.7,11216.1],[11309.1,11219.9],[11323.4,11219.1],[11315.4,11227.9],[11316.2,11234.0],[11330.5,11245.3],[11340.7,11257.9],[11350.6,11263.7],[11359.8,11264.8],[11361.1,11267.0],[11352.7,11279.0],[11339.9,11286.9],[11330.1,11296.3],[11324.9,11299.7],[11310.3,11300.5],[11301.0,11312.7],[11293.8,11314.0],[11290.1,11318.2],[11277.1,11323.4],[11262.5,11336.4],[11249.5,11338.3],[11201.2,11374.8],[11205.2,11378.5],[11190.5,11410.9],[11193.5,11425.9],[11191.4,11429.2],[11184.3,11425.0],[11180.7,11425.7],[11195.4,11433.1],[11191.2,11438.6],[11193.7,11442.8],[11213.7,11449.3],[11211.3,11455.4],[11222.1,11459.1],[11218.3,11463.9],[11225.1,11465.5],[11232.5,11476.3],[11230.9,11486.7],[11226.1,11493.5],[11226.7,11497.7],[11214.9,11508.7],[11224.9,11528.0],[11223.5,11538.8],[11230.5,11549.2],[11232.8,11558.5],[11231.3,11566.1],[11225.3,11576.5],[11228.2,11584.8],[11221.3,11599.0],[11223.8,11611.4],[11222.0,11616.2],[11213.5,11624.8],[11205.4,11627.8],[11201.4,11626.7],[11194.2,11618.7],[11179.5,11614.1],[11164.3,11601.7],[11137.8,11586.4],[11126.4,11569.8],[11110.0,11565.2],[11095.5,11556.9],[11037.5,11552.5],[10975.8,11555.0],[10970.2,11549.4],[10980.3,11550.1],[10988.3,11546.6]];
const ISLETS: P[][] = [[[11186.9,11028.7],[11187.3,11030.9],[11184.6,11034.8],[11183.9,11037.8],[11185.2,11041.4],[11187.0,11043.3],[11189.3,11041.5],[11196.7,11040.1],[11198.9,11038.2],[11199.5,11036.2],[11198.5,11026.5],[11195.7,11020.3],[11193.4,11019.2],[11189.1,11020.6],[11186.5,11024.3]], [[11173.4,10975.9],[11169.0,10974.6],[11167.8,10975.2],[11170.6,10979.8],[11173.7,10983.0],[11175.7,10982.8],[11177.0,10980.5],[11175.6,10977.5]]];
const CLIFF_S: P[] = [[10922.5,11408.8],[10929.7,11420.3],[10953.6,11419.2],[10957.6,11432.9],[10982.6,11437.9],[10988.0,11449.8],[10996.7,11449.4],[11015.9,11458.1],[11023.8,11473.5],[11036.9,11487.2],[11049.5,11489.4],[11050.6,11496.2],[11070.9,11497.6],[11087.5,11491.5],[11096.6,11495.1],[11109.2,11488.6],[11121.2,11495.5],[11127.7,11503.7]];
const ROADS: number[][] = [[10755.2,11200.0,10764.8,11193.7,4.5],[10764.8,11193.7,10791.8,11188.8,4.5],[10791.8,11188.8,10832.3,11189.4,4.5],[10832.3,11189.4,10864.3,11186.3,4.5],[10864.3,11186.3,10878.8,11183.6,4.5],[10878.8,11183.6,10904.5,11178.8,4.5],[10904.5,11178.8,10911.9,11178.7,4.5],[10911.9,11178.7,10920.2,11180.5,4.5],[10920.2,11180.5,10936.8,11185.2,4.5],[10936.8,11185.2,10951.0,11185.8,4.5],[10951.0,11185.8,10965.8,11185.0,4.5],[10964.0,11196.1,10958.5,11166.2,3.9],[10968.1,11195.3,10962.6,11165.4,3.9],[10972.2,11194.5,10966.8,11164.7,3.9],[10696.5,11341.2,10707.5,11350.2,5.3],[10707.5,11350.2,10711.1,11354.2,5.3],[10711.1,11354.2,10715.1,11359.6,5.3],[10715.1,11359.6,10717.5,11364.0,5.3],[10717.5,11364.0,10719.5,11370.5,5.3],[10719.5,11370.5,10721.0,11380.5,5.3],[10721.0,11380.5,10722.9,11389.9,5.3],[10722.9,11389.9,10724.7,11403.9,5.3],[10724.7,11403.9,10730.2,11417.6,5.3],[10730.2,11417.6,10733.6,11422.4,5.3],[10733.6,11422.4,10737.5,11426.9,5.3],[10737.5,11426.9,10743.7,11431.9,5.3],[10743.7,11431.9,10757.8,11438.6,5.3],[10757.8,11438.6,10773.5,11445.5,5.3],[10773.5,11445.5,10786.1,11452.9,5.3],[10786.1,11452.9,10798.9,11460.6,5.3],[10798.9,11460.6,10808.3,11467.6,5.3],[10808.3,11467.6,10814.9,11476.6,5.3],[10814.9,11476.6,10820.0,11485.2,5.3],[10820.0,11485.2,10829.9,11503.6,5.3],[10829.9,11503.6,10832.6,11507.8,5.3],[10832.6,11507.8,10838.4,11515.3,5.3],[10838.4,11515.3,10845.7,11523.2,5.3],[10845.7,11523.2,10848.9,11526.1,5.3],[10848.9,11526.1,10850.8,11531.5,5.3],[10850.8,11531.5,10849.9,11537.8,5.3],[10849.9,11537.8,10848.9,11543.5,5.3],[10848.9,11543.5,10844.4,11548.2,5.3],[10844.4,11548.2,10831.6,11553.7,5.3],[10831.6,11553.7,10810.7,11562.0,5.3],[10810.7,11562.0,10783.9,11576.6,5.3],[10783.9,11576.6,10762.3,11585.2,5.3],[10762.3,11585.2,10739.8,11592.1,5.3],[10739.8,11592.1,10711.2,11601.4,5.3],[10711.2,11601.4,10676.2,11612.2,5.3],[10849.9,11537.8,10870.8,11538.3,3.3],[10870.8,11538.3,10879.8,11544.4,3.3],[10879.8,11544.4,10886.0,11553.9,3.3],[10698.6,11223.3,10712.1,11232.5,4.5],[10712.1,11232.5,10715.6,11235.0,4.5],[10715.6,11235.0,10718.6,11237.6,4.5],[10718.6,11237.6,10721.4,11238.6,4.5],[10721.4,11238.6,10724.2,11238.3,4.5],[10724.2,11238.3,10726.5,11237.4,4.5],[10726.5,11237.4,10728.1,11235.8,4.5],[10728.1,11235.8,10736.0,11222.5,4.5],[10736.0,11222.5,10751.0,11202.8,4.5],[10751.0,11202.8,10755.2,11200.0,4.5],[10711.2,11601.4,10703.9,11614.3,3.5],[10703.9,11614.3,10700.0,11617.9,3.5],[10724.7,11403.9,10703.9,11408.9,3.3],[10703.9,11408.9,10682.2,11406.3,3.3]];
const LIGHT = [10959.3, 11243.3];
const GUNS: P[] = [[10879.4, 11203.7], [10945.9, 11172.8], [10880.8, 11284.8]];
const BRIDGE = [11158.2, 11007.6];
// inland edge of the red-ochre soil (approximate, read off satellite; the sheet fades over 45 m inside it)
const INLAND: P[] = [[10935,10870],[10845,10955],[10785,11075],[10765,11200],[10785,11330],[10835,11440],[10905,11530]];
const HEAD: P[] = [...COAST, ...INLAND.slice().reverse()];
// direction the trade-wind swell comes from (ENE), for how hard each stretch of coast is hit
const SWELL = [0.92, -0.38];
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
/** Seaward unit normal of coast segment i (the sea is on the left of the N -> S walk, i.e. east then south). */
function normal(i: number) {
  const [ax, az] = COAST[i], [bx, bz] = COAST[i + 1], l = Math.hypot(bx - ax, bz - az) || 1;
  return [(bz - az) / l, -(bx - ax) / l];
}
/** 0..1: how square-on a coast segment faces the ENE swell. */
const exposure = (n: number[]) => Math.max(0, Math.min(1, n[0] * SWELL[0] + n[1] * SWELL[1]));
/** Nearest coast segment: [distance, exposure]. */
function coastInfo(x: number, z: number) {
  let m = 1e9, k = 0;
  for (let i = 1; i < COAST.length; i++) { const d = segDist(x, z, COAST[i - 1][0], COAST[i - 1][1], COAST[i][0], COAST[i][1]); if (d < m) { m = d; k = i - 1; } }
  return [m, exposure(normal(k))];
}
function roadClear(x: number, z: number) {
  let a = 1;
  for (const [ax, az, bx, bz, r] of ROADS) { const d = segDist(x, z, ax, az, bx, bz); if (d < r + 1) a = Math.min(a, smooth(r - 1.5, r + 0.5, d)); }
  return a;
}
/** A's actual waterline along the seaward normal of a coast point (its terrain can run a little past OSM's line). */
function waterline(h: (x: number, z: number) => number, x: number, z: number, nx: number, nz: number) {
  let land = false;
  for (let t = -25; t <= 60; t += 1) { const y = h(x + nx * t, z + nz * t); if (y >= 0) land = true; else if (land) return t; }
  return 0;
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
function sheet(pos: number[], col: number[], idx: number[], normals: boolean) {
  const geo = new BufferGeometry();
  geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
  geo.setAttribute("color", new Float32BufferAttribute(col, 4));
  if (!normals) geo.setAttribute("normal", new Float32BufferAttribute(new Float32Array(pos.length).map((_, i) => (i % 3 === 1 ? 1 : 0)), 3));
  geo.setIndex(idx); if (normals) geo.computeVertexNormals(); geo.computeBoundingSphere();
  return geo;
}

type World = { heightAt(x: number, z: number): number; regions: Map<string, { rx: number; rz: number; H?: unknown }>; M: { X0: number; Z0: number; RS: number }; ov?: { w: number; h: number; H: Float32Array; step: number } };
type H = (x: number, z: number) => number;

export class SeroeColorado {
  stats = { built: false, soilQuads: 0, seaQuads: 0, surfQuads: 0, rocks: 0, ms: 0, bridge: [0, 0] };
  private timer = 0;
  private step = 0;
  constructor(private g: AGame) {
    this.timer = window.setInterval(() => this.tick(), 1500);
  }

  private key(W: World, x: number, z: number) { return `${Math.floor((x - W.M.X0) / W.M.RS)},${Math.floor((z - W.M.Z0) / W.M.RS)}`; }

  private tick() {
    const W = this.g.real as unknown as World;
    if (!W?.regions || !W.M) return;
    const t0 = performance.now();
    const low = this.g.real?.q?.name === "low";
    if (this.step === 0) {
      const ready = new Set<string>();
      for (const r of W.regions.values()) if (r.H) ready.add(`${r.rx},${r.rz}`);
      const keys = new Set<string>();
      for (const [x, z] of HEAD) keys.add(this.key(W, x, z));
      if (![...keys].every((k) => ready.has(k))) return;
    }
    const h: H = (x, z) => { const v = W.heightAt(x, z); return Number.isFinite(v) ? v : 0; };
    // outside the loaded-region "hole" A also draws its 32 m overview terrain, which can sit a metre or so above
    // the detailed ground on this slope; there the surface you see is whichever of the two is higher
    const hv: H = (x, z) => {
      const r = h(x, z), o = W.ov; if (!o) return r;
      const fx = (x - W.M.X0) / o.step, fz = (z - W.M.Z0) / o.step, i = Math.floor(fx), j = Math.floor(fz);
      if (i < 0 || j < 0 || i + 1 >= o.w || j + 1 >= o.h) return r;
      // A's overview mesh: vertices at H - 0.15, cells split along the (i+1, j)-(i, j+1) diagonal
      const tx = fx - i, tz = fz - j, w = o.w, A = o.H, h00 = A[j * w + i], h10 = A[j * w + i + 1], h01 = A[(j + 1) * w + i], h11 = A[(j + 1) * w + i + 1];
      const ov = tx + tz <= 1 ? h00 + (h10 - h00) * tx + (h01 - h00) * tz : h11 + (h01 - h11) * (1 - tx) + (h10 - h11) * (1 - tz);
      return Math.max(r, ov - 0.15);
    };
    // three small steps, one per tick, so no single frame pays for the whole build
    if (this.step === 0) this.g.scene.add(this.soil(h, hv, low));
    else if (this.step === 1) this.g.scene.add(this.sea(h, low), this.surf(h, low));
    else if (this.step === 2) { this.g.scene.add(this.props(h, hv, low), this.lamp(hv)); window.clearInterval(this.timer); this.stats.built = true; }
    this.step++;
    this.stats.ms += Math.round(performance.now() - t0);
  }

  /** Red-ochre soil over the plateau: pale dry-grass patches, grey-brown rock toward the broken edge. */
  private soil(h: H, hv: H, low: boolean): Mesh {
    const S = low ? 6 : 4.5;
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (const [x, z] of HEAD) { x0 = Math.min(x0, x - 60); x1 = Math.max(x1, x + 60); z0 = Math.min(z0, z); z1 = Math.max(z1, z + 60); }
    x0 = Math.floor(x0 / S) * S; z0 = Math.floor(z0 / S) * S;
    const nx = Math.ceil((x1 - x0) / S) + 2, nz = Math.ceil((z1 - z0) / S) + 2;
    const pos: number[] = [], col: number[] = [], idx: number[] = [], ovY: number[] = [], vid = new Int32Array(nx * nz).fill(-1);
    // A's ground that runs seaward of the OSM coastline here (to the islets) is rock too, not pale sand
    const shore = (x: number, z: number) => lineDist(x, z, COAST) < 60;
    const soilC = new Color(0x76564a), soilD = new Color(0x62473c), grassC = new Color(0x948866), rockC = new Color(0x6a5c52), edgeC = new Color(0x4a403b), c = new Color();
    const vert = (i: number, j: number) => {
      const k = j * nx + i; if (vid[k] >= 0) return vid[k];
      const x = x0 + i * S, z = z0 + j * S, y = h(x, z), yv = Math.max(y, hv(x, z));
      const n1 = Math.sin(x * 0.11 + Math.sin(z * 0.07) * 2.1) * Math.sin(z * 0.09 + Math.sin(x * 0.05) * 1.7);
      const n2 = hash(Math.floor(x / 7), Math.floor(z / 7));
      c.copy(soilC).lerp(soilD, smooth(0.3, 0.95, n2) * 0.5);
      c.lerp(grassC, smooth(0.2, 0.75, n1) * (0.3 + 0.25 * hash(x * 0.13, z * 0.11))); // thin pale dry grass in patches
      const [dC, ex] = coastInfo(x, z);
      // broken grey-brown limestone toward the edge: a wide dark band on the windward side, narrow on the south
      const band = 1 - smooth(6, 14 + 40 * ex, dC);
      c.lerp(rockC, band * 0.85).lerp(edgeC, (1 - smooth(0, 6 + 12 * ex, dC)) * 0.8);
      c.lerp(rockC, (1 - smooth(1, 9, lineDist(x, z, CLIFF_S))) * 0.7); // the step on the south side of the top
      c.multiplyScalar(0.94 + hash(x * 0.37, z * 0.41) * 0.1);
      const inHead = inside(HEAD, x, z);
      if (!inHead) c.copy(edgeC).multiplyScalar(0.94 + hash(x * 0.37, z * 0.41) * 0.12);
      let a = inHead ? smooth(0, 45, lineDist(x, z, INLAND)) * 0.75 : shore(x, z) ? 0.75 * (1 - smooth(40, 60, lineDist(x, z, COAST))) : 0;
      a *= smooth(10790, 10870, z) * smooth(-0.15, 0.2, yv) * roadClear(x, z);
      pos.push(x, y + 0.15, z); ovY.push(yv + 0.15); col.push(c.r, c.g, c.b, a);
      return (vid[k] = pos.length / 3 - 1);
    };
    for (let j = 0; j + 1 < nz; j++) for (let i = 0; i + 1 < nx; i++) {
      const cx = x0 + (i + 0.5) * S, cz = z0 + (j + 0.5) * S;
      if (Math.max(h(cx, cz), hv(cx, cz)) < -0.4 || (!inside(HEAD, cx, cz) && !(shore(cx, cz) && cz > 10800))) continue;
      const a = vert(i, j), b = vert(i + 1, j), d = vert(i, j + 1), e = vert(i + 1, j + 1);
      idx.push(a, d, b, b, d, e); this.stats.soilQuads++;
    }
    const geo = sheet(pos, col, idx, true); geo.setAttribute("ovY", new Float32BufferAttribute(ovY, 1));
    const mat = new MeshLambertMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
    // same test as A's overview shader: inside the hole drape on the detailed ground, outside on the visible top
    const hole = (this.g.real as unknown as { hole?: { value: Vector4 } }).hole ?? { value: new Vector4() };
    mat.onBeforeCompile = (sh) => {
      sh.uniforms.uHole = hole;
      sh.vertexShader = sh.vertexShader.replace("#include <common>", "#include <common>\nattribute float ovY;\nuniform vec4 uHole;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\nif (!(position.x >= uHole.x && position.x <= uHole.z && position.z >= uHole.y && position.z <= uHole.w)) transformed.y = ovY;");
    };
    mat.customProgramCacheKey = () => "aw-seroecolorado-soil";
    const m = new Mesh(geo, mat); m.name = "aw:seroecolorado:soil";
    const dim = new Color(0x2c3448); // A's ground goes dark at night
    m.onBeforeRender = () => { const k = uNight.value; mat.color.setHex(0xffffff).lerp(dim, k); mat.opacity = 1 - 0.7 * k; };
    m.renderOrder = 1; m.castShadow = false; m.receiveShadow = true;
    return m;
  }

  /** Deep blue right up to the rocks on the windward side (A's depth ramp paints turquoise shallows there). */
  private sea(h: H, low: boolean): Mesh {
    const S = low ? 8 : 6, OUT = 140;
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    for (const [x, z] of COAST) { x0 = Math.min(x0, x - 20); x1 = Math.max(x1, x + OUT); z0 = Math.min(z0, z - 20); z1 = Math.max(z1, z + OUT); }
    x0 = Math.floor(x0 / S) * S; z0 = Math.floor(z0 / S) * S;
    const nx = Math.ceil((x1 - x0) / S) + 1, nz = Math.ceil((z1 - z0) / S) + 1;
    const pos: number[] = [], col: number[] = [], idx: number[] = [], vid = new Int32Array(nx * nz).fill(-1);
    const nearC = new Color(0x123a58), farC = new Color(0x1a5a80), wetC = new Color(0x4a3f39), c = new Color();
    const vert = (i: number, j: number) => {
      const k = j * nx + i; if (vid[k] >= 0) return vid[k];
      const x = x0 + i * S, z = z0 + j * S;
      const [d, ex] = coastInfo(x, z);
      c.copy(nearC).lerp(farC, smooth(20, OUT, d));
      let a = Math.min(1, ex * 1.4) * 0.8 * (1 - smooth(50, OUT, d)) * smooth(-2, 6, d);
      // awash rock ledges instead of A's pale sandy shallows: there is no sand at the foot of these rocks
      const y = h(x, z), wet = smooth(-1.6, -0.3, y) * (1 - smooth(0.1, 0.5, y));
      c.lerp(wetC, wet);
      a = Math.max(a * (1 - smooth(-1.2, 0.2, y)), 0.85 * wet * (0.4 + 0.6 * Math.min(1, ex * 2)));
      a *= smooth(10790, 10880, z) * smooth(10960, 11060, x); // fade in north of the plateau / along the south shore
      pos.push(x, WATER_Y, z); col.push(c.r, c.g, c.b, a);
      return (vid[k] = pos.length / 3 - 1);
    };
    for (let j = 0; j + 1 < nz; j++) for (let i = 0; i + 1 < nx; i++) {
      const cx = x0 + (i + 0.5) * S, cz = z0 + (j + 0.5) * S;
      if (h(cx, cz) > 0.5 || lineDist(cx, cz, COAST) > OUT) continue;
      const a = vert(i, j), b = vert(i + 1, j), d = vert(i, j + 1), e = vert(i + 1, j + 1);
      idx.push(a, d, b, b, d, e); this.stats.seaQuads++;
    }
    const mat = new MeshLambertMaterial({ vertexColors: true, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 });
    const m = new Mesh(sheet(pos, col, idx, false), mat); m.name = "aw:seroecolorado:sea";
    const day = new Color(0xffffff), night = new Color(0x0d2238);
    m.onBeforeRender = () => { const k = uNight.value; mat.color.copy(day).lerp(night, k); mat.opacity = 1 - 0.55 * k; };
    m.renderOrder = 3; m.castShadow = false; m.receiveShadow = false; // after A's water (renderOrder 2)
    return m;
  }

  /** White surf where the swell breaks on the rocks: a standing splash at the rock line and trailing foam. */
  private surf(h: H, low: boolean): Mesh {
    const pos: number[] = [], col: number[] = [], idx: number[] = [];
    const step = low ? 4 : 3, Y = WATER_Y + 0.1;
    // samples along the coast, pushed out to A's waterline and smoothed so the ribbon never folds
    const S: number[][] = [];
    let run = 0;
    for (let i = 0; i + 1 < COAST.length; i++) {
      const [ax, az] = COAST[i], [bx, bz] = COAST[i + 1], len = Math.hypot(bx - ax, bz - az), [nx, nz] = normal(i);
      const n = Math.max(1, Math.ceil(len / step));
      for (let k = i > 0 ? 1 : 0; k <= n; k++) {
        const t = (k / n) * len, x = ax + (bx - ax) * t / len, z = az + (bz - az) * t / len;
        S.push([x, z, nx, nz, waterline(h, x, z, nx, nz), run + t]);
      }
      run += len;
    }
    const W0 = S.map((_, i) => { let a = 0, n = 0; for (let j = Math.max(0, i - 4); j <= Math.min(S.length - 1, i + 4); j++) { a += S[j][4]; n++; } return a / n; });
    let first = true;
    S.forEach(([cx, cz, , , , s0], si) => {
      let nx = 0, nz = 0; // normal averaged with the neighbours too, for the same reason
      for (let j = Math.max(0, si - 3); j <= Math.min(S.length - 1, si + 3); j++) { nx += S[j][2]; nz += S[j][3]; }
      const l = Math.hypot(nx, nz) || 1; nx /= l; nz /= l;
      const ex = exposure([nx, nz]), w0 = W0[si] - 1, x = cx + nx * w0, z = cz + nz * w0;
      // sets break in sections; the windward rocks are almost always white, the south side less so
      const s = Math.sin(s0 * 0.09 + Math.sin(s0 * 0.021) * 3.1) * 0.5 + 0.5;
      let a = (0.35 + 0.65 * ex) * (0.55 + 0.45 * smooth(0.25, 0.7, s)) * (0.8 + 0.2 * hash(s0, 1.3));
      a *= smooth(10795, 10860, z) * smooth(10990, 11040, x);
      const w = (8 + 20 * ex) * (0.75 + 0.5 * hash(Math.floor(s0 / 9), 2.1)); // foam reach, seaward
      const hc = (0.5 + 1.3 * ex) * a * (0.7 + 0.6 * hash(s0, 4.7)); // spray standing up off the rocks
      const base = pos.length / 3;
      pos.push(x - nx * 2, Y, z - nz * 2, x + nx * 1.5, Y + hc, z + nz * 1.5, x + nx * w * 0.45, Y + hc * 0.2, z + nz * w * 0.45, x + nx * w, Y, z + nz * w);
      const wash = 0.45 + 0.5 * hash(Math.floor(s0 / 6), 7.7);
      col.push(1, 1, 1, a * 0.7, 1, 1, 1, a, 1, 1, 1, a * wash, 1, 1, 1, 0);
      if (!first) { const p = base - 4; for (let r = 0; r < 3; r++) idx.push(p + r, base + r, p + r + 1, p + r + 1, base + r, base + r + 1); this.stats.surfQuads += 3; }
      first = false;
    });
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 4));
    geo.setIndex(idx); geo.computeBoundingSphere();
    const mat = new MeshBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false, side: DoubleSide, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
    const m = new Mesh(geo, mat); m.name = "aw:seroecolorado:surf";
    const day = new Color(0xf6fcff), night = new Color(0x2a3a4c);
    m.onBeforeRender = () => { mat.color.copy(day).lerp(night, uNight.value); mat.opacity = 0.75 + 0.25 * Math.sin(uTime.value * 0.8); };
    m.renderOrder = 4; m.castShadow = false; m.receiveShadow = false;
    return m;
  }

  /** Rock edge and islets, the natural bridge, the three gun foundations and the lighthouse, in one mesh. */
  private props(h: H, hv: H, low: boolean): Mesh {
    const parts: BufferGeometry[] = [];
    const ironT = [0x5b4a3e, 0x6a5444, 0x4d4038, 0x75604c, 0x584638];
    const rock = (x: number, z: number, sx: number, sy: number, sz: number, rot: number, y: number, hex: number, seed: number) => {
      const g = new IcosahedronGeometry(1, 0);
      const pa = g.attributes.position as Float32BufferAttribute;
      for (let i = 0; i < pa.count; i++) { const vx = pa.getX(i), vy = pa.getY(i), vz = pa.getZ(i), j = 0.7 + 0.6 * hash(seed + Math.round(vx * 100) * 1.37 + Math.round(vz * 100) * 0.71, Math.round(vy * 100)); pa.setXYZ(i, vx * j, vy * j, vz * j); } // keyed on the corner, not the index: the icosahedron is non-indexed, so shared corners must move together
      g.computeVertexNormals(); g.scale(sx, sy, sz); g.rotateY(rot); g.translate(x, y, z);
      parts.push(paint(g, hex, 0.3, seed)); this.stats.rocks++;
    };
    // broken rock edge: blocks straddling the waterline all round, and a second, taller row on the slope
    // behind them where the swell hits square-on
    for (let i = 0; i + 1 < COAST.length; i++) {
      const [ax, az] = COAST[i], [bx, bz] = COAST[i + 1], len = Math.hypot(bx - ax, bz - az), [nx, nz] = normal(i), ex = exposure([nx, nz]);
      if (Math.max(az, bz) < 10800) continue;
      const rot = Math.atan2(-(bz - az), bx - ax), n = Math.ceil(len / (low ? 4 : 3));
      for (let k = 0; k < n; k++) {
        const t = (k + hash(ax + k, az)) / n, x = ax + (bx - ax) * t, z = az + (bz - az) * t, s = x + z * 1.7;
        const wl = waterline(h, x, z, nx, nz), o = wl + (hash(x, z) - 0.55) * 7, px = x + nx * o, pz = z + nz * o;
        const r = 1.6 + hash(z, x) * 2.4, sy = 1.0 + hash(x * 2, z) * (1.2 + 1.6 * ex);
        rock(px, pz, r * 1.3, sy, r * (0.6 + hash(z * 2, x) * 0.4), rot, Math.max(h(px, pz), -1.6) + sy * 0.25, ironT[k % ironT.length], s);
        if (ex > 0.3 && hash(s, 5.1) < 0.8) {
          const o2 = wl - (5 + hash(s, 6.3) * 9), qx = x + nx * o2, qz = z + nz * o2, r2 = 1.8 + hash(s, 7.9) * 2.6, sy2 = 1.4 + hash(s, 8.3) * 2.2 * ex;
          rock(qx, qz, r2 * 1.2, sy2, r2 * 0.7, rot + (hash(s, 9.1) - 0.5) * 0.6, h(qx, qz) + sy2 * 0.15, ironT[(k + 2) % ironT.length], s + 11);
        }
      }
    }
    // the two rock islets off the natural bridge (OSM place=island), filled with weathered blocks
    for (const ring of ISLETS) {
      let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
      for (const [x, z] of ring) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
      for (let x = x0; x <= x1; x += 2.6) for (let z = z0; z <= z1; z += 2.6) {
        const px = x + (hash(x, z) - 0.5) * 1.5, pz = z + (hash(z, x) - 0.5) * 1.5;
        if (!inside(ring, px, pz)) continue;
        const r = 1.6 + hash(px, pz) * 1.4, sy = 1.6 + hash(pz, px) * 1.6;
        rock(px, pz, r, sy, r * 0.8, hash(px, 3) * 6.28, 0.2 + sy * 0.25, ironT[Math.floor(hash(px, pz) * 5) % 5], px + pz);
      }
    }
    // Seroe Colorado natural bridge: a small rock arch on the waterline nearest the OSM node, opening along the coast
    {
      let m = 1e9, k = 0;
      for (let i = 0; i + 1 < COAST.length; i++) { const d = segDist(BRIDGE[0], BRIDGE[1], COAST[i][0], COAST[i][1], COAST[i + 1][0], COAST[i + 1][1]); if (d < m) { m = d; k = i; } }
      const [ax, az] = COAST[k], [bx, bz] = COAST[k + 1], [nx, nz] = normal(k);
      const mx = (ax + bx) / 2, mz = (az + bz) / 2, wl = waterline(h, mx, mz, nx, nz), cx = mx + nx * (wl - 1), cz = mz + nz * (wl - 1);
      this.stats.bridge = [Math.round(cx), Math.round(cz)];
      const arch = new TorusGeometry(3.0, 1.1, 5, 9, Math.PI);
      const pa = arch.attributes.position as Float32BufferAttribute;
      for (let i = 0; i < pa.count; i++) { const vx = pa.getX(i), vy = pa.getY(i), vz = pa.getZ(i), q = Math.round(vx * 100) * 1.7 + Math.round(vy * 100) * 0.3 + Math.round(vz * 100), j = 0.85 + 0.3 * hash(q, 2.2); pa.setXYZ(i, vx * j, vy * (0.9 + 0.2 * hash(q, 4.4)), vz * 1.6); } // keyed on position so the seam vertices stay together
      arch.computeVertexNormals();
      arch.rotateY(Math.atan2(nx, nz) + Math.PI / 2); // span runs seaward, so the opening faces along the coast
      arch.translate(cx, WATER_Y - 0.4, cz);
      parts.push(paint(arch, 0x6b5646, 0.15, 3));
      for (const o of [-3.2, 3.2]) rock(cx + nx * o, cz + nz * o, 1.6, 1.4, 1.8, hash(o, 1) * 6, Math.max(h(cx + nx * o, cz + nz * o), -1.2) + 0.3, 0x5b4a3e, o + 40);
    }
    // WWII 155 mm gun foundations ("Panama mounts"): a low round concrete ring and a centre pivot block
    GUNS.forEach(([gx, gz], gi) => {
      const R = 5.4, segs = 16;
      for (let s = 0; s < segs; s++) {
        const a = (s / segs) * Math.PI * 2, x = gx + Math.cos(a) * R, z = gz + Math.sin(a) * R;
        const b = new BoxGeometry(2.25, 0.5, 1.0); b.rotateY(-a + Math.PI / 2); b.translate(x, hv(x, z) + 0.12, z);
        parts.push(paint(b, hash(s, gi) < 0.2 ? 0x8a857c : 0x9e998e, 0.12, s + gi * 20));
      }
      const c = new CylinderGeometry(0.95, 1.1, 0.6, 8); c.translate(gx, hv(gx, gz) + 0.2, gz); parts.push(paint(c, 0x8f8a80, 0.1, gi));
      if (gi === 0) { // a cactus growing up inside the foundation
        const y = hv(gx + 2.2, gz + 1.2);
        const t = new CylinderGeometry(0.18, 0.22, 2.6, 6); t.translate(gx + 2.2, y + 1.3, gz + 1.2); parts.push(paint(t, 0x4c6b3c, 0.1, 5));
        const a1 = new CylinderGeometry(0.13, 0.15, 1.2, 6); a1.translate(gx + 2.55, y + 1.7, gz + 1.2); parts.push(paint(a1, 0x4c6b3c, 0.1, 6));
      }
    });
    // lighthouse: concrete plinth, dark steel column, square deck with a wire-mesh cage round the lamp, caged ladder
    {
      const [lx, lz] = LIGHT, y = hv(lx, lz) - 0.1, sp: BufferGeometry[] = [];
      const steel = 0x24272a;
      const box = (w: number, hh: number, d: number, px: number, py: number, pz: number, hex: number) => { const b = new BoxGeometry(w, hh, d); b.translate(px, py, pz); sp.push(paint(b, hex)); };
      box(2.8, 0.45, 2.8, 0, 0.22, 0, 0x8e8a82); // plinth
      box(1.1, 0.25, 1.1, 0, 0.55, 0, steel); // base plate
      const col = new CylinderGeometry(0.24, 0.3, 5.3, 8); col.translate(0, 3.1, 0); sp.push(paint(col, steel));
      const T = 5.75, C = 2.4, HC = 2.1; // deck height, cage width, cage height
      box(C + 0.2, 0.28, C + 0.2, 0, T, 0, steel); // deck
      box(C + 0.2, 0.12, C + 0.2, 0, T + HC, 0, steel); // cage roof
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) box(0.08, HC, 0.08, sx * C / 2, T + HC / 2, sz * C / 2, steel); // corner posts
      for (const ry of [0.9, HC * 0.98]) for (const s of [-1, 1]) { box(C, 0.06, 0.06, 0, T + ry, s * C / 2, steel); box(0.06, 0.06, C, s * C / 2, T + ry, 0, steel); }
      for (let i = 1; i < 8; i++) { const u = -C / 2 + (i / 8) * C; for (const s of [-1, 1]) { box(0.03, HC, 0.03, u, T + HC / 2, s * C / 2, 0x3a3d40); box(0.03, HC, 0.03, s * C / 2, T + HC / 2, u, 0x3a3d40); } } // mesh
      const lan = new CylinderGeometry(0.22, 0.22, 0.55, 8); lan.translate(0, T + 0.5, 0); sp.push(paint(lan, 0x8c8a84));
      // caged ladder hanging under one side of the deck
      for (const s of [-0.25, 0.25]) box(0.05, 2.6, 0.05, C / 2 + 0.25, T - 1.3, s, steel);
      for (let i = 0; i < 8; i++) box(0.04, 0.04, 0.5, C / 2 + 0.25, T - 2.5 + i * 0.33, 0, steel);
      for (const yy of [T - 2.5, T - 1.6, T - 0.7]) { box(0.05, 0.05, 0.8, C / 2 + 0.75, yy, 0, steel); box(0.5, 0.05, 0.05, C / 2 + 0.5, yy, 0.4, steel); box(0.5, 0.05, 0.05, C / 2 + 0.5, yy, -0.4, steel); }
      for (const s of [-0.4, 0.4]) box(0.04, 2.6, 0.04, C / 2 + 0.75, T - 1.3, s, steel);
      const lh = mergeGeometries(sp)!; sp.forEach((g) => g.dispose());
      lh.rotateY(0.35); lh.translate(lx, y, lz); parts.push(lh);
    }
    const geo = mergeGeometries(parts)!; parts.forEach((g) => g.dispose());
    geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, flatShading: true, side: DoubleSide });
    const mesh = new Mesh(geo, mat); mesh.name = "aw:seroecolorado:props"; mesh.castShadow = !low; mesh.receiveShadow = !low;
    const dim = new Color(0x55607a);
    mesh.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.6); };
    return mesh;
  }

  /** The lamp: white flash every 6 s (Fl W 6s) once it is dark. */
  private lamp(h: H): Mesh {
    const [lx, lz] = LIGHT;
    const mat = new MeshBasicMaterial({ color: 0xfff4d6, transparent: true, depthWrite: false, opacity: 0 });
    const m = new Mesh(new SphereGeometry(0.45, 10, 8), mat); m.name = "aw:seroecolorado:lamp";
    m.position.set(lx, h(lx, lz) - 0.1 + 5.75 + 0.95, lz);
    m.onBeforeRender = () => { const p = uTime.value % 6, on = p < 0.5 ? 1 - p / 0.5 * 0.3 : 0; mat.opacity = on * smooth(0.25, 0.7, uNight.value); m.scale.setScalar(1 + on * 1.5); };
    m.renderOrder = 5;
    return m;
  }
}
