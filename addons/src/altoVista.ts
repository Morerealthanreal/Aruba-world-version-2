// Alto Vista Chapel surroundings: the Way of the Cross and the dry cunucu around the chapel. Off with ?avc=0.
// The chapel itself, its walled yard with the curved pews, the Peace Labyrinth, the big cairn and the one white
// cross monument at the bend are Modeler's hero meshes (game/data/hero/manifest.json: altovista, altovista_plaza,
// peace_labyrinth, altovista_cairn, altovista_cross) and are not rebuilt or moved here. Around them A draws flat
// tan sand with fan palms and a few green blobs. The real hill is dry cunucu on rocky caliche: dense olive scrub
// right to the road edge, tall kadushi clumps, wind-bent divi-divi trees leaning away from the trade wind, pale
// limestone rocks, and the winding Alto Vista road lined all along with slim white crosses, each with a small dark
// plaque where the arms meet (the Stations of the Cross the pilgrims walk up).
// Visual reference only (nothing copied): Serge Melki, CC BY 2.0,
// https://commons.wikimedia.org/wiki/File:On_the_road_to_AltoVista_Church_Aruba_(2891521166).jpg (the crosses on
// the shoulder, the scrub and kadushi); Erik Cleves Kristensen, CC BY 2.0,
// https://commons.wikimedia.org/wiki/File:Alto_Vista_Chapel,_Aruba.jpg ; https://en.wikipedia.org/wiki/Alto_Vista_Chapel
// ("winding and has a string of crosses all along its route").
// Geometry: OSM node 540115823 (chapel), ways 23058759 / 779654539 / 779654540 (Alto Vista), 93476342 (parking),
// 186595134 (yard wall), 490716937 (Labyrinthe de la Paix); roads and houses from A's own region data (r_5_5,
// r_6_5), slopes from A's heights. Everything is rebuilt in code.
// 5 draw calls: one merged flat-shaded mesh (crosses, limestone rocks), instanced scrub, instanced kadushi, instanced
// divi-divi trunks and crowns. No textures, no lights. Built once after the height regions stream in; per frame
// only a night colour lerp. A's scattered plants in the zone give way through the shared __awVegHit hook.
// Stays inside x -4890..-4240, z -6340..-5780.
import {
  BufferGeometry, BoxGeometry, Color, CylinderGeometry, Euler, Float32BufferAttribute, IcosahedronGeometry,
  InstancedMesh, Matrix4, Mesh, MeshLambertMaterial, Quaternion, Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { uNight } from "./uniforms";

type P = number[];
// game metres (x east, z south). A's Alto Vista road (id 39) from the Noord side up to the chapel turning loop.
const AV: P[] = [[-4855.4, -5800.0], [-4800.0, -5833.8], [-4791.2, -5839.2], [-4774.4, -5848.8], [-4759.1, -5859.0], [-4748.7, -5867.6], [-4741.6, -5876.7], [-4735.6, -5886.2], [-4731.9, -5895.3], [-4726.9, -5911.5], [-4718.6, -5942.2], [-4710.4, -5968.2], [-4705.4, -5979.8], [-4700.3, -5989.1], [-4695.2, -5995.3], [-4688.0, -6000.6], [-4680.0, -6005.3], [-4669.1, -6009.3], [-4655.7, -6012.9], [-4629.4, -6019.3], [-4615.8, -6022.5], [-4602.1, -6028.1], [-4565.2, -6046.9], [-4494.2, -6079.9], [-4476.1, -6092.0], [-4466.6, -6099.3], [-4458.2, -6107.3], [-4451.5, -6115.5], [-4446.9, -6122.2], [-4440.1, -6135.0], [-4438.7, -6138.7], [-4438.3, -6143.8], [-4438.9, -6148.9], [-4440.7, -6154.0], [-4444.0, -6156.8], [-4449.4, -6159.0], [-4453.9, -6159.9], [-4482.5, -6159.4]];
const ROADS: [number, P[]][] = [
  [4.0, [[-4904.6, -5878.1], [-4885.3, -5877.4], [-4861.3, -5874.0], [-4834.2, -5872.4], [-4818.2, -5862.9], [-4808.2, -5861.1], [-4800.8, -5856.6], [-4800.0, -5855.4]]],
  [4.0, [[-4902.9, -6021.4], [-4897.7, -6024.7], [-4885.9, -6027.2], [-4869.8, -6027.0], [-4854.2, -6026.9], [-4842.6, -6033.0], [-4839.6, -6045.1], [-4849.8, -6057.5], [-4864.1, -6061.1], [-4873.8, -6059.2], [-4881.6, -6055.0], [-4889.8, -6050.4], [-4899.3, -6044.3], [-4905.6, -6033.4], [-4902.9, -6021.4], [-4904.8, -5982.1], [-4904.6, -5926.1], [-4905.6, -5919.3], [-4908.7, -5897.2], [-4908.0, -5889.0], [-4904.6, -5878.1]]],
  [6.0, [[-4438.7, -6138.7], [-4433.7, -6144.4], [-4426.1, -6151.8], [-4419.5, -6157.2], [-4412.8, -6162.0], [-4404.0, -6165.7], [-4396.0, -6167.2], [-4387.0, -6166.8], [-4373.4, -6164.6], [-4365.8, -6163.6], [-4360.0, -6163.9], [-4354.9, -6165.1], [-4347.2, -6167.9], [-4341.7, -6172.3], [-4333.7, -6179.1], [-4329.2, -6181.0], [-4325.3, -6181.9], [-4319.9, -6182.6], [-4306.0, -6181.6], [-4298.6, -6180.7], [-4293.6, -6180.9], [-4288.6, -6181.7], [-4276.7, -6184.5], [-4264.7, -6189.2], [-4257.3, -6193.1], [-4251.9, -6197.7], [-4248.3, -6202.2], [-4246.1, -6206.3], [-4244.6, -6210.5], [-4242.3, -6223.4], [-4238.5, -6240.2], [-4233.8, -6252.6], [-4223.5, -6270.8], [-4213.6, -6289.1], [-4211.1, -6294.7], [-4208.8, -6301.6], [-4206.3, -6308.1], [-4205.8, -6310.8], [-4204.9, -6316.0], [-4203.7, -6327.6], [-4204.4, -6343.1], [-4204.6, -6351.8], [-4204.4, -6355.2], [-4203.5, -6359.4], [-4198.4, -6369.5], [-4194.5, -6374.5], [-4179.4, -6389.1], [-4159.0, -6405.4], [-4146.3, -6415.3], [-4141.9, -6419.9], [-4139.2, -6423.7], [-4137.1, -6429.4], [-4136.6, -6435.3], [-4136.5, -6444.4], [-4137.4, -6456.2], [-4136.0, -6466.7], [-4133.3, -6477.1], [-4120.7, -6510.0], [-4112.4, -6534.4], [-4110.2, -6540.0], [-4109.2, -6546.7], [-4109.5, -6553.4], [-4110.9, -6559.2], [-4113.3, -6564.9], [-4120.8, -6578.5], [-4126.6, -6588.6], [-4130.8, -6598.9], [-4131.7, -6609.1], [-4132.3, -6621.9], [-4134.5, -6641.1], [-4138.3, -6654.2], [-4175.8, -6737.2], [-4183.0, -6749.9], [-4196.2, -6764.6], [-4235.8, -6800.0]]],
  [3.6, [[-4412.8, -6162.0], [-4420.3, -6180.5], [-4426.1, -6200.9], [-4427.9, -6211.5]]],
  [6.0, [[-4494.2, -6079.9], [-4484.2, -6058.6], [-4474.8, -6046.2], [-4463.1, -6037.4], [-4449.2, -6032.5], [-4417.0, -6027.9], [-4397.4, -6026.8], [-4343.6, -6029.9], [-4323.8, -6030.0], [-4313.2, -6028.3], [-4297.2, -6019.4], [-4263.8, -5982.0], [-4251.6, -5973.6], [-4243.5, -5970.0], [-4231.0, -5967.6], [-4217.4, -5968.9], [-4204.8, -5970.0], [-4162.6, -5979.1], [-4129.8, -5989.5], [-4114.8, -5997.8], [-4104.9, -6001.6], [-4095.4, -6005.2], [-4076.8, -6009.3], [-4038.2, -6021.8], [-4000.6, -6030.7], [-3987.9, -6032.0]]],
  [4.0, [[-4800.0, -5855.4], [-4795.9, -5849.5], [-4791.2, -5839.2]]],
  [3.6, [[-4499.9, -6188.1], [-4503.9, -6190.9], [-4507.9, -6193.6], [-4511.7, -6197.6], [-4513.7, -6200.6], [-4515.1, -6205.2], [-4515.2, -6209.2], [-4514.3, -6212.9], [-4512.5, -6214.9], [-4510.0, -6216.2], [-4506.2, -6216.9], [-4492.8, -6216.9], [-4478.4, -6216.6]]],
  [7.2, [[-4499.9, -6188.1], [-4496.0, -6189.2], [-4491.5, -6189.0], [-4486.8, -6187.5], [-4484.2, -6184.9], [-4482.1, -6180.6], [-4481.6, -6176.6], [-4481.4, -6171.9], [-4482.5, -6159.4]]],
  [7.2, [[-4482.5, -6159.4], [-4494.8, -6159.6], [-4500.0, -6160.4], [-4504.2, -6163.2], [-4506.6, -6165.8], [-4508.1, -6168.9], [-4508.7, -6172.4], [-4508.6, -6175.2], [-4507.2, -6181.2], [-4504.1, -6185.5], [-4499.9, -6188.1]]],
  [4.8, [[-4504.6, -6190.6], [-4518.8, -6190.6]]],
  [4.8, [[-4478.4, -6195.0], [-4518.8, -6194.8]]],
  [4.8, [[-4478.3, -6199.2], [-4518.8, -6198.9]]],
  [4.8, [[-4478.3, -6203.4], [-4518.8, -6203.1]]],
  [4.8, [[-4478.2, -6207.6], [-4518.8, -6207.4]]],
  [4.8, [[-4478.2, -6211.8], [-4518.8, -6211.6]]],
  [4.8, [[-4478.1, -6216.0], [-4518.8, -6215.8]]],
];
// A's houses (centre x, z, radius), the chapel's walled yard, parking, labyrinth and the hero cairn and cross: kept clear
const HOUSES: P[] = [[-4818.6, -5868.4, 2.8], [-4821.6, -5873.8, 5.5], [-4837.9, -5862.2, 7.5], [-4863.7, -5898.6, 7.5], [-4853.1, -6084.9, 24.3]];
const BOXES: P[] = [[-4481, -4427, -6211, -6161], [-4522, -4475, -6223, -6155], [-4419, -4395, -6220, -6196]]; // x0 x1 z0 z1
const HEROES: P[] = [[-4429, -6142, 7], [-4718, -5913, 5], [-4447, -6188, 14]];
const X_W = -4890, X_E = -4240, Z_N = -6340, Z_S = -5780;
const HW = 3.6; // A's Alto Vista half width (7.2 m)
const HERO_CROSS_S = 179.8; // where the hero cross monument sits along AV (right side, 8.2 m out)

const hash = (x: number, z: number) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };
const sm = (t: number) => t * t * (3 - 2 * t);
function vnoise(x: number, z: number, s: number) {
  const fx = x / s, fz = z / s, ix = Math.floor(fx), iz = Math.floor(fz), tx = sm(fx - ix), tz = sm(fz - iz);
  const a = hash(ix, iz), b = hash(ix + 1, iz), c = hash(ix, iz + 1), d = hash(ix + 1, iz + 1);
  return a + (b - a) * tx + (c - a) * tz + (a - b - c + d) * tx * tz;
}
function segDist(x: number, z: number, ax: number, az: number, bx: number, bz: number) {
  const dx = bx - ax, dz = bz - az, L = dx * dx + dz * dz;
  const t = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L)) : 0;
  return Math.hypot(x - ax - t * dx, z - az - t * dz);
}
const lineDist = (l: P[], x: number, z: number) => { let m = 1e9; for (let i = 1; i < l.length; i++) m = Math.min(m, segDist(x, z, l[i - 1][0], l[i - 1][1], l[i][0], l[i][1])); return m; };
const inZone = (x: number, z: number) => x > X_W && x < X_E && z > Z_N && z < Z_S;
/** clear of every road, A's houses, the chapel yard / parking / labyrinth and the hero props */
const clear = (x: number, z: number, pad: number) => {
  if (lineDist(AV, x, z) < HW + 1.2 + pad) return false;
  for (const [w, l] of ROADS) if (lineDist(l, x, z) < w / 2 + 1.2 + pad) return false;
  for (const [hx, hz, r] of HOUSES) if (Math.hypot(x - hx, z - hz) < r + 2 + pad) return false;
  for (const [x0, x1, z0, z1] of BOXES) if (x > x0 - pad && x < x1 + pad && z > z0 - pad && z < z1 + pad) return false;
  for (const [hx, hz, r] of HEROES) if (Math.hypot(x - hx, z - hz) < r + pad) return false;
  return true;
};
/** how much the dry cunucu covers a spot: dense along the road, thinner far out, patchy everywhere */
const cover = (x: number, z: number) => {
  const d = lineDist(AV, x, z), near = d < 40 ? 1 : Math.max(0.25, 1 - (d - 40) / 220);
  return near * (0.45 + 0.75 * vnoise(x + 300, z - 90, 32));
};
/** Colour every vertex of a geometry and drop uvs, so differently built parts can be merged. */
function paint(g: BufferGeometry, hex: number, k = 1) {
  const geo = g.index ? g.toNonIndexed() : g; if (geo !== g) g.dispose();
  geo.deleteAttribute("uv");
  const c = new Color(hex), n = geo.attributes.position.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = c.r * k; a[i * 3 + 1] = c.g * k; a[i * 3 + 2] = c.b * k; }
  geo.setAttribute("color", new Float32BufferAttribute(a, 3));
  return geo;
}

type Region = { H?: unknown; vegCache?: unknown };
type World = { heightAt(x: number, z: number): number; regions: Map<string, Region>; M: { X0: number; Z0: number; RS: number }; vegDirty?: boolean; q?: { name?: string } };
type H = (x: number, z: number) => number;

export class AltoVista {
  stats = { built: false, crosses: 0, rocks: 0, scrub: 0, kadushi: 0, divi: 0, vegHidden: 0, ms: 0 };
  private timer = 0;
  private meshes: Mesh[] = [];
  constructor(private g: AGame) {
    this.installVeg();
    this.timer = window.setInterval(() => this.tick(), 1500);
  }

  /** A's random fan palms and blobs around the chapel give way to the cunucu built here. */
  private installVeg() {
    const w = window as unknown as { __awVegHit?: (x: number, z: number, n?: string) => boolean };
    const prev = w.__awVegHit;
    w.__awVegHit = (x, z, n) => {
      if (inZone(x, z) && (lineDist(AV, x, z) < 160 || Math.hypot(x + 4447, z + 6188) < 200)) { this.stats.vegHidden++; return true; }
      return prev ? prev(x, z, n) : false;
    };
  }

  private tick() {
    const W = this.g.real as unknown as World;
    if (!W?.regions || !W.M) return;
    const keys = new Set<string>();
    for (let x = X_W; x <= X_E; x += 50) for (let z = Z_N; z <= Z_S; z += 50) keys.add(`${Math.floor((x - W.M.X0) / W.M.RS)},${Math.floor((z - W.M.Z0) / W.M.RS)}`);
    for (const k of keys) if (!W.regions.get(k)?.H) return;
    window.clearInterval(this.timer);
    const t0 = performance.now();
    for (const k of keys) { const r = W.regions.get(k); if (r?.vegCache) { r.vegCache = undefined; W.vegDirty = true; } }
    const low = W.q?.name === "low";
    const h: H = (x, z) => { const v = W.heightAt(x, z); return Number.isFinite(v) ? v : 0; };
    this.meshes = [this.stone(h, low), this.scrub(h, low), this.kadushi(h, low), ...this.divi(h, low)];
    this.g.scene.add(...this.meshes);
    this.stats.built = true;
    this.stats.ms = Math.round(performance.now() - t0);
  }

  dispose() {
    window.clearInterval(this.timer);
    for (const m of this.meshes) { m.removeFromParent(); m.geometry.dispose(); (m.material as MeshLambertMaterial).dispose(); if (m instanceof InstancedMesh) m.dispose(); }
    this.meshes = [];
  }

  /** point and right-hand normal at distance s along the Alto Vista road */
  private at(s: number) {
    for (let i = 1; i < AV.length; i++) {
      const [ax, az] = AV[i - 1], [bx, bz] = AV[i], L = Math.hypot(bx - ax, bz - az);
      if (s <= L || i === AV.length - 1) { const t = Math.min(1, s / L), ux = (bx - ax) / L, uz = (bz - az) / L; return { x: ax + (bx - ax) * t, z: az + (bz - az) * t, nx: -uz, nz: ux }; }
      s -= L;
    }
    return { x: AV[0][0], z: AV[0][1], nx: 1, nz: 0 };
  }
  private avLen() { let L = 0; for (let i = 1; i < AV.length; i++) L += Math.hypot(AV[i][0] - AV[i - 1][0], AV[i][1] - AV[i - 1][1]); return L; }

  /** The white Way-of-the-Cross crosses on the right shoulder going up, and pale limestone rocks in the scrub. */
  private stone(h: H, low: boolean): Mesh {
    const parts: BufferGeometry[] = [];
    const L = this.avLen();
    for (let s = 22; s < L - 40; s += 31) {
      if (Math.abs(s - HERO_CROSS_S) < 16) continue; // the hero monument stands here already
      const c = this.at(s), off = HW + 2.6 + hash(s, 1) * 0.8, x = c.x + c.nx * off, z = c.z + c.nz * off;
      if (!clear(x, z, -HW - 1.0) || !inZone(x, z)) continue;
      const y = h(x, z), rot = Math.atan2(c.nx, c.nz); // arms square to the road, face down the hill to the pilgrims
      const k = 0.9 + hash(s, 2) * 0.25;
      const add = (geo: BufferGeometry, col: number, dy: number) => { geo.rotateY(rot); geo.translate(x, y + dy, z); parts.push(paint(geo, col)); };
      add(new BoxGeometry(0.11 * k, 1.85 * k, 0.11 * k), 0xf2f0ea, 0.75 * k);       // upright, sunk 0.18 m
      add(new BoxGeometry(0.11 * k, 0.11 * k, 0.86 * k), 0xf2f0ea, 1.3 * k);        // arms
      const plaque = new CylinderGeometry(0.11 * k, 0.11 * k, 0.03, 10); plaque.rotateZ(Math.PI / 2);
      plaque.translate(-0.07, 0, 0); add(plaque, 0x2f2a26, 1.3 * k);                // dark station plaque at the crossing
      const base = new IcosahedronGeometry(0.32, 0); base.scale(1.3, 0.45, 1.1); add(base, 0xd9d4c6, 0.02); // whitewashed stones at the foot
      this.stats.crosses++;
    }
    // pale limestone / caliche rocks scattered through the scrub, a few big ones on the slopes
    const tones = [0xc9c0ad, 0xb5ad9b, 0xd6cfbe, 0xa89f8d, 0xbdb3a0];
    const cap = low ? 260 : 420;
    let n = 0;
    for (let i = 0; i < 9000 && n < cap; i++) {
      const x = X_W + hash(i, 4.1) * (X_E - X_W), z = Z_N + hash(i, 5.3) * (Z_S - Z_N);
      if (!inZone(x, z) || !clear(x, z, 0.5)) continue;
      if (lineDist(AV, x, z) > 260 && Math.hypot(x + 4447, z + 6188) > 260) continue;
      if (hash(x * 0.7, z * 1.3) > 0.55 * cover(x, z)) continue;
      const seed = n * 5.17 + 2, geo = new IcosahedronGeometry(1, 0), pa = geo.attributes.position as Float32BufferAttribute;
      for (let j = 0; j < pa.count; j++) { const q = 0.78 + hash(pa.getX(j) * 3.1 + seed, pa.getY(j) * 2.7 + pa.getZ(j)) * 0.4; pa.setXYZ(j, pa.getX(j) * q, pa.getY(j) * q, pa.getZ(j) * q); }
      const b = hash(seed, 3) < 0.12 ? 1.1 + hash(seed, 4) * 0.9 : 0.3 + hash(seed, 4) * 0.5;
      geo.scale(b * 1.3, b * 0.6, b); geo.rotateY(hash(seed, 2) * 6.28);
      geo.translate(x, h(x, z) + b * 0.12, z);
      parts.push(paint(geo, tones[Math.floor(hash(seed, 5) * tones.length) % tones.length], 0.9 + hash(seed, 6) * 0.15));
      n++;
    }
    this.stats.rocks = n;
    const geo = mergeGeometries(parts)!; parts.forEach((p) => p.dispose());
    geo.computeVertexNormals(); geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, flatShading: true });
    const m = new Mesh(geo, mat); m.name = "aw:avc:stone"; m.castShadow = !low; m.receiveShadow = !low;
    const dim = new Color(0x4a5268);
    m.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.7); };
    return m;
  }

  /** Dense olive / dark-green dry scrub right up to the road and thinning out over the hill. */
  private scrub(h: H, low: boolean): InstancedMesh {
    const spots: P[] = [];
    const want = low ? 1300 : 2000, g = low ? 4.2 : 3.6;
    for (let x = X_W; x <= X_E; x += g) for (let z = Z_N; z <= Z_S; z += g) {
      const px = x + (hash(x + 3, z) - 0.5) * g, pz = z + (hash(z + 3, x) - 0.5) * g;
      if (!inZone(px, pz) || !clear(px, pz, 0.6)) continue;
      const d = lineDist(AV, px, pz), dc = Math.hypot(px + 4447, pz + 6188);
      if (d > 230 && dc > 240) continue;
      if (hash(px * 1.3, pz * 0.7) > cover(px, pz) * (d < 25 ? 0.95 : 0.6)) continue;
      spots.push([px, pz, 0, d, hash(pz * 0.37, px * 1.9) - (d < 30 ? 0.55 : d < 70 ? 0.25 : 0)]);
    }
    // the cap keeps the road-side thicket first, then a fair spread over the hill (not the first rows scanned)
    spots.sort((a, b) => a[4] - b[4]); spots.length = Math.min(spots.length, want);
    for (const sp of spots) sp[2] = h(sp[0], sp[1]);
    const geo = new IcosahedronGeometry(1, 0); geo.translate(0, 0.45, 0);
    const mat = new MeshLambertMaterial({ color: 0xffffff, flatShading: true });
    const im = new InstancedMesh(geo, mat, Math.max(1, spots.length));
    im.name = "aw:avc:scrub"; im.castShadow = false; im.receiveShadow = false;
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), c = new Color();
    const cols = [0x3f5530, 0x4a5f33, 0x37492a, 0x55633a, 0x626a42];
    spots.forEach(([x, z, y, d], i) => {
      e.set(0, hash(z, x) * 6.28, 0); q.setFromEuler(e);
      const r = (d < 25 ? 0.95 : 0.7) + hash(x * 2, z) * 1.0;
      s.set(r * (1 + hash(x, 7) * 0.5), r * (0.5 + hash(z, 8) * 0.3), r * (0.85 + hash(x, 9) * 0.3)); p.set(x, y - 0.25, z); m.compose(p, q, s); im.setMatrixAt(i, m);
      im.setColorAt(i, c.setHex(cols[Math.floor(hash(x, 11) * cols.length) % cols.length]));
    });
    if (!spots.length) im.count = 0;
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.computeBoundingSphere();
    this.stats.scrub = spots.length;
    const dim = new Color(0x4a5a70);
    im.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.7); };
    return im;
  }

  /** Tall kadushi clumps: three to five ribbed columns from one base, a few with side arms. */
  private kadushi(h: H, low: boolean): InstancedMesh {
    const parts: BufferGeometry[] = [];
    const cols: P[] = [[0, 0, 4.6, 0.2], [0.42, 0.2, 3.6, 0.17], [-0.35, 0.3, 3.1, 0.16], [0.1, -0.42, 4.0, 0.18], [-0.3, -0.25, 2.4, 0.15]];
    for (const [x, z, hgt, r] of cols) { const cyl = new CylinderGeometry(r * 0.9, r, hgt, 7); cyl.translate(x, hgt / 2, z); parts.push(cyl); }
    const el = new CylinderGeometry(0.13, 0.13, 0.45, 6); el.rotateZ(Math.PI / 2); el.translate(0.62, 1.5, 0.2); parts.push(el);
    const arm = new CylinderGeometry(0.13, 0.15, 1.3, 6); arm.translate(0.82, 2.1, 0.2); parts.push(arm);
    const geo = mergeGeometries(parts)!; parts.forEach((p) => p.dispose());
    const spots: P[] = [];
    const want = low ? 95 : 160;
    for (let i = 0; i < 6000 && spots.length < want; i++) {
      const x = X_W + hash(i, 1.7) * (X_E - X_W), z = Z_N + hash(i, 2.9) * (Z_S - Z_N);
      if (!inZone(x, z) || !clear(x, z, 1.2)) continue;
      const d = lineDist(AV, x, z), dc = Math.hypot(x + 4447, z + 6188);
      if (d > 200 && dc > 220) continue;
      if (hash(x, z) > (d < 30 ? 0.8 : 0.45) * cover(x, z)) continue;
      spots.push([x, z, h(x, z)]);
    }
    const mat = new MeshLambertMaterial({ color: 0xffffff, flatShading: true });
    const im = new InstancedMesh(geo, mat, Math.max(1, spots.length));
    im.name = "aw:avc:kadushi"; im.castShadow = !low; im.receiveShadow = false;
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), c = new Color();
    spots.forEach(([x, z, y], i) => {
      e.set(0, hash(z, x) * 6.28, 0); q.setFromEuler(e); const k = 0.65 + hash(x * 2, z) * 0.6;
      s.set(k, k * (0.85 + hash(z, 3) * 0.45), k); p.set(x, y - 0.2, z); m.compose(p, q, s); im.setMatrixAt(i, m);
      im.setColorAt(i, c.setHex(hash(x, 11) < 0.5 ? 0x5f7d58 : 0x6e8a62));
    });
    if (!spots.length) im.count = 0;
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.computeBoundingSphere();
    this.stats.kadushi = spots.length;
    const dim = new Color(0x4a5a70);
    im.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.7); };
    return im;
  }

  /**
   * Divi-divi trees: a short trunk bent hard downwind and a flat crown streaming out to the west-south-west,
   * away from the north-east trade wind, as on the open windward hills.
   */
  private divi(h: H, low: boolean): InstancedMesh[] {
    const spots: P[] = [];
    const want = low ? 45 : 80;
    for (let i = 0; i < 6000 && spots.length < want; i++) {
      const x = X_W + hash(i, 7.7) * (X_E - X_W), z = Z_N + hash(i, 8.9) * (Z_S - Z_N);
      if (!inZone(x, z) || !clear(x, z, 4)) continue;
      const d = lineDist(AV, x, z), dc = Math.hypot(x + 4447, z + 6188);
      if (d < 9 || (d > 220 && dc > 230)) continue;
      if (hash(x * 1.9, z) > 0.35 * cover(x, z)) continue;
      spots.push([x, z, h(x, z)]);
    }
    const tg = new CylinderGeometry(0.14, 0.22, 1, 6); tg.translate(0, 0.5, 0);
    const cg = new IcosahedronGeometry(1, low ? 0 : 1);
    const tm = new MeshLambertMaterial({ color: 0xffffff, flatShading: true }), cm = new MeshLambertMaterial({ color: 0xffffff, flatShading: true });
    const trunks = new InstancedMesh(tg, tm, Math.max(1, spots.length)), crowns = new InstancedMesh(cg, cm, Math.max(1, spots.length));
    trunks.name = "aw:avc:diviTrunk"; crowns.name = "aw:avc:diviCrown";
    trunks.castShadow = crowns.castShadow = !low; trunks.receiveShadow = crowns.receiveShadow = false;
    const wind = Math.atan2(0.38, -0.92); // downwind direction (x west, a little south), as a yaw
    const dx = -0.92, dz = 0.38;
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), c = new Color();
    spots.forEach(([x, z, y], i) => {
      const k = 0.8 + hash(x, z * 2) * 0.5, lean = 0.72 + hash(z, x) * 0.25, len = 3.2 * k;
      // trunk: tilt away from the wind (rotate about the axis perpendicular to the downwind direction)
      q.setFromAxisAngle(new Vector3(dz, 0, -dx).normalize(), lean);
      s.set(k, len, k); p.set(x, y - 0.15, z); m.compose(p, q, s); trunks.setMatrixAt(i, m);
      trunks.setColorAt(i, c.setHex(hash(x, 5) < 0.5 ? 0x4b3e31 : 0x5b4b3b));
      const tx = x + dx * Math.sin(lean) * len, tz = z + dz * Math.sin(lean) * len, ty = y - 0.15 + Math.cos(lean) * len;
      e.set(0, -wind + (hash(x, 9) - 0.5) * 0.3, 0); q.setFromEuler(e);
      s.set(3.0 * k, 0.75 * k, 1.9 * k); // long axis (local x) downwind
      p.set(tx + dx * 1.6 * k, ty + 0.1, tz + dz * 1.6 * k); m.compose(p, q, s); crowns.setMatrixAt(i, m);
      crowns.setColorAt(i, c.setHex(hash(z, 6) < 0.5 ? 0x556b34 : 0x4a6030));
    });
    if (!spots.length) { trunks.count = 0; crowns.count = 0; }
    for (const im of [trunks, crowns]) { im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.computeBoundingSphere(); }
    this.stats.divi = spots.length;
    const dimT = new Color(0x3a4258), dimC = new Color(0x4a5a70);
    trunks.onBeforeRender = () => { tm.color.setHex(0xffffff).lerp(dimT, uNight.value * 0.7); };
    crowns.onBeforeRender = () => { cm.color.setHex(0xffffff).lerp(dimC, uNight.value * 0.7); };
    return [trunks, crowns];
  }
}
