// Frenchman's Pass (Franse Pas / Rooi Frances) accuracy pass. Off with ?fpp=0.
// A draws the pass as bare sand hills with a few scattered cacti and fan palms. The real pass is the narrow
// winding road through the gap between the rocky hills east of Balashi: the dry-forest thicket (watapana /
// mesquite-type trees) grows right to the edge and arches over the road, the shoulders are dry grass and leaf
// litter, the hill crests break out in grey-brown weathered rock with kadushi columns on top, and a small
// dark-brown board stands on the shoulder at the pass itself.
// Visual reference only (nothing copied): Don Rosborough, public domain,
// https://commons.wikimedia.org/wiki/File:Frenchmans_Pass,_Aruba_1.jpg and
// https://commons.wikimedia.org/wiki/File:Frenchmans_Pass,_Aruba_2.jpg ; Christina Ras, CC BY-SA 4.0,
// https://commons.wikimedia.org/wiki/File:Franse_pas.jpg (rock outcrop over the thicket).
// Geometry: OSM way 224290276 (Franse Pas), attraction node 8569271620 (Frenchman's Pass), peaks 6496504324 /
// 6496504325 / 6496504326, wood 691869866, scrub 691869868, side roads and houses from A's own region data,
// slopes from A's heights. Everything is rebuilt in code.
// 5 draw calls: one merged flat-shaded rock mesh (outcrops, shoulder boulders, the board), instanced trunks,
// instanced crowns, instanced kadushi and one dry-shoulder ribbon. No textures, no lights. Built once after the
// height region streams in; per frame only a night colour lerp. A's scattered plants in the pass are dropped
// through the shared __awVegHit hook. Stays inside x -460..-60, z 3390..3930: clear of the Balashi gold-mill
// ruins (z > 3990), the Spaans Lagoen inlet and the brewery. The road surface itself is not touched.
import {
  BufferGeometry, BoxGeometry, Color, CylinderGeometry, Euler, Float32BufferAttribute, IcosahedronGeometry,
  InstancedMesh, Matrix4, Mesh, MeshLambertMaterial, Quaternion, Vector3,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { uNight } from "./uniforms";

type P = number[];
// game metres (x east, z south): OSM Franse Pas centreline through the gap, north (Balashi) to south (Spaans Lagoen side)
const FP: P[] = [[-255.8, 3375.3], [-252.5, 3409.7], [-253.5, 3438.1], [-257.6, 3502.7], [-265.1, 3573.8], [-268.1, 3633.4], [-273.9, 3692.5], [-286.6, 3735.7], [-295.1, 3759.0], [-299.0, 3776.6], [-298.5, 3798.2], [-283.8, 3825.0], [-266.2, 3849.2], [-245.0, 3876.7], [-229.5, 3894.9], [-209.5, 3915.9], [-178.1, 3946.8]];
// side roads that leave the pass (Balashi 571, 574, 2366, 2645): kept clear
const SIDE: P[][] = [
  [[-268.1, 3633.4], [-257.5, 3631.3], [-251.6, 3626.4], [-240.6, 3613.4], [-227.4, 3600.8], [-221.2, 3597.0], [-195.0, 3585.2], [-134.7, 3559.5], [-93.2, 3539.8], [-73.8, 3524.6], [-54.4, 3502.9]],
  [[-253.5, 3438.1], [-238.7, 3433.2], [-212.9, 3418.7], [-191.9, 3409.5], [-171.2, 3397.1], [-159.7, 3383.4], [-150.7, 3370.8]],
  [[-245.0, 3876.7], [-240.6, 3900.6], [-223.1, 3948.4]],
  [[-223.1, 3948.4], [-209.5, 3915.9]],
  [[-270.5, 3965.6], [-317.7, 3923.3], [-340.1, 3907.7], [-362.0, 3892.4], [-378.2, 3875.9], [-393.2, 3866.3], [-425.3, 3856.1], [-441.5, 3853.2], [-458.8, 3852.4]],
];
// A's houses at the pass ends (centre x, z, radius)
const HOUSES: P[] = [[-237.4, 3401.6, 8.1], [-173.1, 3366.4, 12.2], [-419.2, 3849.9, 7.3], [-421.4, 3883.8, 7.5], [-371.4, 3907.8, 8.5], [-345.8, 3921.4, 6.9], [-41.2, 3434.0, 3.8]];
const SIGN: P = [-311.0, 3783.0]; // OSM tourism=attraction "Frenchman's Pass"
const X_W = -460, X_E = -60, Z_N = 3390, Z_S = 3930;
const HW = 3.8; // A's Franse Pas half width (7.6 m)

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
/** clear of the side roads and A's houses */
const clear = (x: number, z: number, pad: number) => {
  for (const s of SIDE) if (lineDist(s, x, z) < 3 + pad) return false;
  for (const [hx, hz, r] of HOUSES) if (Math.hypot(x - hx, z - hz) < r + pad) return false;
  return true;
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
// resampled centreline: x, z, unit normal (nx, nz), road height
type CP = { x: number; z: number; nx: number; nz: number; y: number };

export class FrenchmansPass {
  stats = { built: false, arch: 0, fill: 0, boulders: 0, kadushi: 0, shoulder: 0, vegHidden: 0, ms: 0 };
  private timer = 0;
  private meshes: Mesh[] = [];
  constructor(private g: AGame) {
    this.installVeg();
    this.timer = window.setInterval(() => this.tick(), 1500);
  }

  /** A's random cacti and fan palms in the pass give way to the thicket built here. */
  private installVeg() {
    const w = window as unknown as { __awVegHit?: (x: number, z: number, n?: string) => boolean };
    const prev = w.__awVegHit;
    w.__awVegHit = (x, z, n) => {
      if (inZone(x, z) && lineDist(FP, x, z) < 75) { this.stats.vegHidden++; return true; }
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
    const h = (x: number, z: number) => { const v = W.heightAt(x, z); return Number.isFinite(v) ? v : 0; };
    const cl = this.centre(h);
    const trees = this.trees(h, cl, low);
    this.meshes = [this.rocks(h, cl, low), ...trees, this.kadushi(h, cl, low), this.shoulder(h, cl)];
    this.g.scene.add(...this.meshes);
    this.stats.built = true;
    this.stats.ms = Math.round(performance.now() - t0);
  }

  dispose() {
    window.clearInterval(this.timer);
    for (const m of this.meshes) { m.removeFromParent(); m.geometry.dispose(); (m.material as MeshLambertMaterial).dispose(); if (m instanceof InstancedMesh) m.dispose(); }
    this.meshes = [];
  }

  /** Franse Pas centreline every 2.5 m, inside the zone. */
  private centre(h: (x: number, z: number) => number): CP[] {
    const out: CP[] = [];
    for (let i = 1; i < FP.length; i++) {
      const [ax, az] = FP[i - 1], [bx, bz] = FP[i], len = Math.hypot(bx - ax, bz - az), ux = (bx - ax) / len, uz = (bz - az) / len;
      for (let s = 0; s < len; s += 2.5) {
        const x = ax + ux * s, z = az + uz * s;
        if (z > Z_N - 5 && z < Z_S + 5) out.push({ x, z, nx: -uz, nz: ux, y: h(x, z) });
      }
    }
    return out;
  }
  /** nearest centreline sample */
  private near(cl: CP[], x: number, z: number) {
    let b = cl[0], m = 1e18;
    for (const c of cl) { const d = (c.x - x) ** 2 + (c.z - z) ** 2; if (d < m) { m = d; b = c; } }
    return b;
  }

  /**
   * Thicket: trees on both shoulders leaning in so their crowns meet over the road (the green tunnel),
   * then denser low trees and shrubs on the valley floor thinning out up the slopes.
   */
  private trees(h: (x: number, z: number) => number, cl: CP[], low: boolean): InstancedMesh[] {
    type T = { bx: number; bz: number; by: number; cx: number; cy: number; cz: number; r: number; ry: number; trunk: boolean; tone: number };
    const T: T[] = [];
    const step = low ? 6.5 : 4.5;
    // shoulder trees: trunk 5.5-9 m off the centreline, crown 1.4-3.6 m off it and at least 5 m above the road
    for (let i = 0; i < cl.length; i += Math.round(step / 2.5)) {
      const c = cl[i];
      for (const s of [-1, 1]) {
        const sd = hash(c.x * 0.31 + s, c.z * 0.17);
        if (sd > 0.35 + 0.6 * vnoise(c.x + s * 40, c.z, 45)) continue; // gaps, not a hedge
        const d = 5.5 + hash(c.z, c.x + s) * 3.5, j = (hash(c.x, c.z * 2 + s) - 0.5) * 2;
        const bx = c.x + c.nx * s * d + c.nz * j, bz = c.z + c.nz * s * d - c.nx * j;
        if (!inZone(bx, bz) || !clear(bx, bz, 2.5)) continue;
        const lat = 1.4 + hash(bx, bz) * 2.2, ry = 1.0 + hash(bz, bx) * 0.4, r = 2.4 + hash(bx * 2, bz) * 0.9;
        const cx = c.x + c.nx * s * lat, cz = c.z + c.nz * s * lat, cy = c.y + 5.4 + 0.85 * ry, by = h(bx, bz);
        T.push({ bx, bz, by, cx, cz, cy, r, ry, trunk: true, tone: hash(bx, 7) * 0.5 });
        // two more lumps down the lean, toward the trunk, so the crown is a spreading mass, not a disc
        for (let k = 1; k <= 2; k++) {
          const f = k / 3, ax = cx + (bx - cx) * f * 1.1 + c.nz * (hash(bx, k) - 0.5) * 3, az = cz + (bz - cz) * f * 1.1 - c.nx * (hash(bz, k) - 0.5) * 3;
          T.push({ bx, bz, by, cx: ax, cz: az, cy: cy - 0.4 - k * 0.5 + hash(k, bx) * 0.6, r: r * (0.75 + hash(ax, k) * 0.3), ry: ry * 0.95, trunk: false, tone: hash(bx, 7 + k) * 0.6 });
        }
        this.stats.arch++;
      }
    }
    // valley floor and slopes: grid, thicker low down, thinning up toward the rocky crests
    const g = low ? 8.5 : 6;
    for (let x = X_W; x <= X_E; x += g) for (let z = Z_N; z <= Z_S; z += g) {
      const px = x + (hash(x, z) - 0.5) * g, pz = z + (hash(z, x) - 0.5) * g;
      const d = lineDist(FP, px, pz);
      if (d < 10 || d > 70 || !inZone(px, pz) || !clear(px, pz, 3)) continue;
      const y = h(px, pz), rh = y - this.near(cl, px, pz).y;
      const base = rh < 7 ? 0.8 : rh < 20 ? 0.8 - (rh - 7) * 0.045 : 0.15;
      if (hash(px * 0.7, pz * 1.3) > base * (0.45 + 0.7 * vnoise(px - 90, pz + 333, 35))) continue;
      const tall = rh < 9 && hash(pz, px * 3) < 0.55;
      // a clump of 2-3 overlapping lumps: the thicket reads as a mass of dull olive scrub, not single lollipops
      const nl = 2 + (hash(px * 5, pz) < 0.4 ? 1 : 0);
      for (let k = 0; k < nl; k++) {
        const r = (tall ? 1.9 + hash(px * 3, pz + k) * 1.2 : 1.1 + hash(px * 3, pz + k) * 1.0) * (k ? 0.8 : 1);
        const ry = tall ? r * 0.62 : r * 0.7;
        const lx = px + (k ? (hash(px, k + 9) - 0.5) * r * 2.2 : 0), lz = pz + (k ? (hash(pz, k + 9) - 0.5) * r * 2.2 : 0), ly = k ? h(lx, lz) : y;
        const cy = tall && !k ? y + 2.4 + hash(px, 5) * 1.4 + ry * 0.4 : ly + ry * (tall ? 0.9 : 0.5);
        T.push({ bx: px, bz: pz, by: y, cx: lx, cz: lz, cy, r, ry, trunk: tall && !k, tone: 0.35 + hash(lx, lz + 7) * 0.65 });
      }
      this.stats.fill++;
    }
    // brighter fresh greens on the shoulder trees (tone < 0.5), duller olive scrub further out
    const tones = [0x7a9640, 0x6c8a38, 0x86a04a, 0x5f7a33, 0x5b6a34, 0x66733a, 0x4f5e2e, 0x707c40, 0x58663a, 0x4a5a2c];
    const nT = T.filter((t) => t.trunk).length;
    const trunk = new CylinderGeometry(0.11, 0.2, 1, 5, 1, true); trunk.translate(0, 0.5, 0);
    const tm = new MeshLambertMaterial({ color: 0xffffff });
    const trunks = new InstancedMesh(trunk, tm, Math.max(1, nT));
    const cm = new MeshLambertMaterial({ color: 0xffffff, flatShading: true });
    const crowns = new InstancedMesh(new IcosahedronGeometry(1, low ? 0 : 1), cm, Math.max(1, T.length));
    trunks.name = "aw:fpp:trunks"; crowns.name = "aw:fpp:crowns";
    trunks.castShadow = crowns.castShadow = !low; trunks.receiveShadow = crowns.receiveShadow = !low;
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), up = new Vector3(0, 1, 0), dir = new Vector3(), c = new Color();
    let it = 0;
    T.forEach((t, i) => {
      e.set((hash(t.cx, 1) - 0.5) * 0.2, hash(t.cz, t.cx) * 6.28, (hash(t.cz, 2) - 0.5) * 0.2); q.setFromEuler(e);
      s.set(t.r * (1 + hash(t.cz, 4) * 0.4), t.ry, t.r); p.set(t.cx, t.cy, t.cz); m.compose(p, q, s); crowns.setMatrixAt(i, m);
      crowns.setColorAt(i, c.setHex(tones[Math.floor(t.tone * tones.length) % tones.length]).multiplyScalar(0.92 + hash(t.cx, t.cz) * 0.14));
      if (!t.trunk) return;
      dir.set(t.cx - t.bx, t.cy - t.ry * 0.3 - t.by + 0.3, t.cz - t.bz); const L = dir.length(); dir.multiplyScalar(1 / L);
      q.setFromUnitVectors(up, dir); const k = 0.55 + t.r * 0.12; s.set(k, L, k); p.set(t.bx, t.by - 0.3, t.bz); m.compose(p, q, s); trunks.setMatrixAt(it, m);
      trunks.setColorAt(it++, c.setHex(hash(t.bx, 3) < 0.5 ? 0x4a3d30 : 0x5a4a3a));
    });
    if (!nT) trunks.count = 0;
    for (const im of [trunks, crowns]) { im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.computeBoundingSphere(); }
    const dimT = new Color(0x3a4258), dimC = new Color(0x4a5a70);
    trunks.onBeforeRender = () => { tm.color.setHex(0xffffff).lerp(dimT, uNight.value * 0.7); };
    crowns.onBeforeRender = () => { cm.color.setHex(0xffffff).lerp(dimC, uNight.value * 0.7); };
    return [trunks, crowns];
  }

  /** Grey-brown weathered outcrops on the slopes and crests, a few boulders on the shoulders, and the board at the pass. */
  private rocks(h: (x: number, z: number) => number, cl: CP[], low: boolean): Mesh {
    const parts: BufferGeometry[] = [];
    const tones = [0x7d786c, 0x6c675c, 0x8a8476, 0x5f5a50, 0x948c7c];
    const cap = low ? 300 : 480;
    let n = 0;
    const boulder = (x: number, z: number, sx: number, sy: number, sz: number, sink: number) => {
      if (n >= cap) return;
      const seed = n * 7.31 + 1, geo = new IcosahedronGeometry(1, 0);
      const pa = geo.attributes.position as Float32BufferAttribute;
      for (let i = 0; i < pa.count; i++) { const k = 0.8 + hash(pa.getX(i) * 3.1 + seed, pa.getY(i) * 2.7 + pa.getZ(i)) * 0.34; pa.setXYZ(i, pa.getX(i) * k, pa.getY(i) * k, pa.getZ(i) * k); }
      geo.scale(sx, sy, sz); geo.rotateY(hash(seed, 2) * 6.28);
      // sink into the slope: base below the lowest ground under the block
      const y = (h(x - sx * 0.6, z) + h(x + sx * 0.6, z) + h(x, z - sz * 0.6) + h(x, z + sz * 0.6)) / 4 + sy * sink;
      geo.translate(x, y, z);
      const g2 = paint(geo, tones[Math.floor(hash(seed, 5) * tones.length) % tones.length], 0.9 + hash(seed, 6) * 0.18);
      const pos = g2.attributes.position, col = g2.attributes.color as Float32BufferAttribute;
      for (let i = 0; i < pos.count; i++) { // darker weathering low down, sun-bleached tops, dark pockets on some faces
        const f = Math.floor(i / 3), pit = hash(f + seed, 8.1) < 0.2 ? 0.66 : 1;
        const t = pit * Math.max(0.72, Math.min(1.12, 0.82 + (pos.getY(i) - y) / (sy * 2.2)));
        col.setXYZ(i, col.getX(i) * t, col.getY(i) * t, col.getZ(i) * t);
      }
      parts.push(g2); n++;
    };
    // the odd boulder on the shoulders, beyond A's gravel edge
    for (let i = 0; i < cl.length; i += 6) {
      const c = cl[i], sd = hash(c.x * 1.3, c.z * 0.7); if (sd > 0.35) continue;
      const side = sd < 0.17 ? -1 : 1, d = HW + 3.4 + hash(c.z, 4) * 3, x = c.x + c.nx * side * d, z = c.z + c.nz * side * d;
      if (!clear(x, z, 3) || !inZone(x, z)) continue;
      const b = 0.7 + hash(x, z) * 0.8; boulder(x, z, b * 1.2, b * 0.75, b, 0.3);
    }
    // outcrop clusters where the ground stands well above the road; candidates are shuffled before the cap so
    // both sides of the gap get their share
    const cand: number[][] = [];
    const g = low ? 12 : 9;
    for (let x = X_W; x <= X_E; x += g) for (let z = Z_N; z <= Z_S; z += g) {
      const px = x + (hash(x + 3, z) - 0.5) * g, pz = z + (hash(z + 3, x) - 0.5) * g;
      if (!inZone(px, pz) || !clear(px, pz, 4)) continue;
      const d = lineDist(FP, px, pz); if (d < 16) continue;
      const rh = h(px, pz) - this.near(cl, px, pz).y; if (rh < 8) continue;
      const pr = Math.min(0.85, (rh - 8) * 0.05) * (vnoise(px + 700, pz - 200, 28) > 0.48 ? 1 : 0.15);
      if (hash(px * 1.7, pz * 0.9) > pr) continue;
      cand.push([px, pz, rh, hash(pz * 1.1, px * 0.3) - Math.min(0.3, d < 70 ? 0.3 : 0)]); // favour the slopes seen from the road
    }
    cand.sort((p, q) => p[3] - q[3]);
    for (const [px, pz, rh] of cand) {
      const k = 2 + Math.floor(hash(px, pz * 3) * (low ? 3 : 4));
      for (let j = 0; j < k; j++) {
        const a = hash(j + px, pz) * 6.28, rr = j ? 1.5 + hash(px, j + pz) * 3 : 0, big = 1.2 + hash(pz + j, px) * (rh > 18 ? 2.6 : 1.6);
        boulder(px + Math.cos(a) * rr, pz + Math.sin(a) * rr, big * (1 + hash(j, px) * 0.5), big * (0.6 + hash(j, pz) * 0.4), big, 0.35);
      }
    }
    this.stats.boulders = n;
    // the dark-brown board on two posts, on the shoulder by the OSM "Frenchman's Pass" point, facing the road
    const c = this.near(cl, SIGN[0], SIGN[1]), side = Math.sign((SIGN[0] - c.x) * c.nx + (SIGN[1] - c.z) * c.nz) || 1;
    const bx = c.x + c.nx * side * (HW + 3.0), bz = c.z + c.nz * side * (HW + 3.0), by = h(bx, bz);
    const rot = Math.atan2(c.nx, c.nz); // board face points along the normal, at the road
    const along = (o: number) => [bx + c.nz * o, bz - c.nx * o];
    for (const o of [-0.6, 0.6]) { const [x, z] = along(o); const post = new BoxGeometry(0.1, 1.9, 0.1); post.translate(x, by + 0.75, z); parts.push(paint(post, 0x4d3a2a)); }
    const board = new BoxGeometry(1.5, 0.95, 0.07); board.rotateY(rot); board.translate(bx, by + 1.25, bz); parts.push(paint(board, 0x3a2a1d));
    const geo = mergeGeometries(parts)!; parts.forEach((p) => p.dispose());
    geo.computeVertexNormals(); geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, flatShading: true });
    const m = new Mesh(geo, mat); m.name = "aw:fpp:rocks"; m.castShadow = !low; m.receiveShadow = !low;
    const dim = new Color(0x4a5268);
    m.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.7); };
    return m;
  }

  /** Kadushi columns on the rocky slopes and crests (the skyline in the reference photo). */
  private kadushi(h: (x: number, z: number) => number, cl: CP[], low: boolean): InstancedMesh {
    const parts: BufferGeometry[] = [];
    const col = new CylinderGeometry(0.2, 0.25, 4, 7); col.translate(0, 2, 0); parts.push(col);
    for (const [s, y0, len] of [[-1, 1.3, 1.6], [1, 1.9, 1.2]]) {
      const el = new CylinderGeometry(0.15, 0.15, 0.55, 6); el.rotateZ(Math.PI / 2); el.translate(s * 0.42, y0, 0); parts.push(el);
      const arm = new CylinderGeometry(0.15, 0.17, len, 6); arm.translate(s * 0.68, y0 + len / 2 - 0.08, 0); parts.push(arm);
    }
    const geo = mergeGeometries(parts)!; parts.forEach((p) => p.dispose());
    const spots: P[] = [];
    const want = low ? 45 : 85;
    for (let i = 0; i < 4000 && spots.length < want; i++) {
      const x = X_W + hash(i, 1.7) * (X_E - X_W), z = Z_N + hash(i, 2.9) * (Z_S - Z_N);
      const d = lineDist(FP, x, z); if (d < 7 || d > 80 || !clear(x, z, 3)) continue;
      const rh = h(x, z) - this.near(cl, x, z).y; if (rh < 6 || hash(x, z) > Math.min(0.9, rh * 0.04)) continue;
      spots.push([x, z, h(x, z)]);
    }
    const mat = new MeshLambertMaterial({ color: 0xffffff, flatShading: true });
    const im = new InstancedMesh(geo, mat, Math.max(1, spots.length));
    im.name = "aw:fpp:kadushi"; im.castShadow = !low; im.receiveShadow = false;
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), c = new Color();
    spots.forEach(([x, z, y], i) => {
      e.set(0, hash(z, x) * 6.28, 0); q.setFromEuler(e); const k = 0.7 + hash(x * 2, z) * 0.7;
      s.set(k, k * (0.85 + hash(z, 3) * 0.4), k); p.set(x, y - 0.2, z); m.compose(p, q, s); im.setMatrixAt(i, m);
      im.setColorAt(i, c.setHex(hash(x, 11) < 0.5 ? 0x5e7a52 : 0x6b8459));
    });
    if (!spots.length) im.count = 0;
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true; im.computeBoundingSphere();
    this.stats.kadushi = spots.length;
    const dim = new Color(0x4a5a70);
    im.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.7); };
    return im;
  }

  /** Dry grass and leaf-litter shoulder bands either side of the road, beyond A's gravel edge. */
  private shoulder(h: (x: number, z: number) => number, cl: CP[]): Mesh {
    const pos: number[] = [], col: number[] = [], idx: number[] = [];
    const tones = [new Color(0x8a7d5e), new Color(0x7f7256), new Color(0x938665), new Color(0x766a50)], c = new Color();
    const y = (x: number, z: number) => Math.max(h(x, z), h(x + 0.5, z), h(x - 0.5, z), h(x, z + 0.5), h(x, z - 0.5)) + 0.06;
    for (let i = 1; i < cl.length; i++) {
      const a = cl[i - 1], b = cl[i];
      if (!inZone(a.x, a.z)) continue;
      for (const s of [-1, 1]) {
        const w0 = HW + 0.9, wa = w0 + 1.6 + vnoise(a.x + s * 50, a.z, 14) * 2.2, wb = w0 + 1.6 + vnoise(b.x + s * 50, b.z, 14) * 2.2;
        const pts = [[a.x + a.nx * s * w0, a.z + a.nz * s * w0], [b.x + b.nx * s * w0, b.z + b.nz * s * w0], [b.x + b.nx * s * wb, b.z + b.nz * s * wb], [a.x + a.nx * s * wa, a.z + a.nz * s * wa]];
        if (pts.some(([x, z]) => !clear(x, z, 0))) continue;
        const base = pos.length / 3;
        c.copy(tones[Math.floor(hash(a.x * s, a.z) * tones.length) % tones.length]).multiplyScalar(0.95 + hash(a.z, s) * 0.08);
        for (const [x, z] of pts) { pos.push(x, y(x, z), z); col.push(c.r, c.g, c.b); }
        const [p0, p1, p2] = pts, upw = (p1[1] - p0[1]) * (p2[0] - p0[0]) - (p1[0] - p0[0]) * (p2[1] - p0[1]) > 0; // face up
        if (upw) idx.push(base, base + 1, base + 2, base, base + 2, base + 3); else idx.push(base, base + 2, base + 1, base, base + 3, base + 2);
        this.stats.shoulder++;
      }
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 3));
    geo.setIndex(idx); geo.computeVertexNormals(); geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, polygonOffset: true, polygonOffsetFactor: -3, polygonOffsetUnits: -3 });
    const m = new Mesh(geo, mat); m.name = "aw:fpp:shoulder"; m.receiveShadow = true;
    const dim = new Color(0x3a4258);
    m.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.75); };
    return m;
  }
}
