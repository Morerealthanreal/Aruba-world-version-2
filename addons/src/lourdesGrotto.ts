// Lourdes Grotto on Sero Preto (north-west of San Nicolas, outside the town core) accuracy pass. Off with ?lgr=0.
// A draws nothing here: the OSM attraction node 4256278587 sits on bare dirt at the foot of the Sero Preto slope.
// The real grotto (Grot van Onze Lieve Vrouw van Lourdes, 1958) is a cave mouth built up from rough grey-tan
// coral-limestone blocks into the hillside, with a white Mary statue (blue sash, hands folded) standing on a
// white shelf in a dark upper niche, flowers at her feet and a low rough stone ledge in front where people sit.
// Visual reference only (nothing copied): Arthur Meiners / Coleccion Aruba, CC BY-SA 4.0,
// https://commons.wikimedia.org/wiki/File:BNA-DIG-MEINERS-0143_-_Landschap_-_Seroe_Pretoe,_Grot_van_Onze_lieve_Vrouwe_van_Lourdes_630700_c.jpg
// Geometry: OSM node 4256278587 (grotto), footway 426321469 (path from the Sero Preto road), scrub 626933654
// (the hillside it is cut into), road 30422421 (kept clear). Everything is rebuilt in code.
// 3 draw calls: one merged flat-shaded rock mesh (cave surround, side walls, roof and the hill mass behind),
// one merged props mesh (dark cave back, shelf, statue, flowers, front ledge, shrubs) and one
// flagstone ribbon for the footway and the small plaza. No textures, no lights. Built once after the height
// regions stream in; per frame only a night colour lerp. A's vegetation on the plaza and path is dropped
// through the shared __awVegHit hook. Stays inside x 6900-6975, z 7660-7730.
import {
  BufferGeometry, BoxGeometry, Color, DoubleSide, Float32BufferAttribute, IcosahedronGeometry,
  LatheGeometry, Matrix4, Mesh, MeshLambertMaterial, SphereGeometry, Vector2,
} from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { uNight } from "./uniforms";

type P = number[];
// game metres (x east, z south). G: OSM grotto node. PATH: OSM footway 426321469 from the road to the grotto.
const G: P = [6940.9, 7692.5];
const PATH: P[] = [[6954.8, 7722.5], [6944.1, 7716.6], [6941.2, 7711.9], [6940.0, 7707.3], [6939.8, 7703.7], [6940.0, 7700.6], [6943.4, 7694.6], [6940.9, 7692.5]];
// the slope rises to the west and north (Sero Preto); the footway's last leg walks in north-west, so the mouth faces south-east
const FX = 0.766, FZ = 0.643; // unit facing, out of the cave toward the visitors
const RX = -FZ, RZ = FX; // local +x (right, seen from inside the cave)
const MOUTH = 3; // the cave mouth sits this far back into the slope from the OSM node, the node is the plaza
const X_W = 6900, X_E = 6975, Z_N = 7660, Z_S = 7730;
const ROAD: P[] = [[6987.6, 7637.3], [6987.7, 7648.0], [6984.6, 7658.7], [6981.5, 7666.6], [6977.5, 7676.1], [6973.5, 7685.0], [6963.5, 7707.4], [6954.8, 7722.5], [6944.6, 7739.0]];

const hash = (x: number, z: number) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };
function segDist(x: number, z: number, ax: number, az: number, bx: number, bz: number) {
  const dx = bx - ax, dz = bz - az, L = dx * dx + dz * dz;
  const t = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L)) : 0;
  return Math.hypot(x - ax - t * dx, z - az - t * dz);
}
const lineDist = (l: P[], x: number, z: number) => { let m = 1e9; for (let i = 1; i < l.length; i++) m = Math.min(m, segDist(x, z, l[i - 1][0], l[i - 1][1], l[i][0], l[i][1])); return m; };
/** local grotto frame (lx right, lz out toward the visitors, origin at the cave mouth) to world x/z */
const wx = (lx: number, lz: number) => G[0] + FX * (lz - MOUTH) + RX * lx;
const wz = (lx: number, lz: number) => G[1] + FZ * (lz - MOUTH) + RZ * lx;
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

type Region = { H?: unknown; vegCache?: unknown };
type World = { heightAt(x: number, z: number): number; regions: Map<string, Region>; M: { X0: number; Z0: number; RS: number }; vegDirty?: boolean; q?: { name?: string } };

export class LourdesGrotto {
  stats = { built: false, rocks: 0, flowers: 0, pathQuads: 0, vegHidden: 0, ms: 0 };
  private timer = 0;
  private meshes: Mesh[] = [];
  constructor(private g: AGame) {
    this.installVeg();
    this.timer = window.setInterval(() => this.tick(), 1500);
  }

  /** Keep A's scattered plants off the plaza, the cave and the footway. */
  private installVeg() {
    const w = window as unknown as { __awVegHit?: (x: number, z: number, n?: string) => boolean };
    const prev = w.__awVegHit;
    w.__awVegHit = (x, z, n) => {
      if (x > X_W && x < X_E && z > Z_N && z < Z_S && (Math.hypot(x - G[0], z - G[1]) < 14 || lineDist(PATH, x, z) < 2.5)) { this.stats.vegHidden++; return true; }
      return prev ? prev(x, z, n) : false;
    };
  }

  private tick() {
    const W = this.g.real as unknown as World;
    if (!W?.regions || !W.M) return;
    const keys = new Set<string>();
    for (let x = X_W; x <= X_E; x += 25) for (let z = Z_N; z <= Z_S; z += 25) keys.add(`${Math.floor((x - W.M.X0) / W.M.RS)},${Math.floor((z - W.M.Z0) / W.M.RS)}`);
    for (const k of keys) if (!W.regions.get(k)?.H) return;
    window.clearInterval(this.timer);
    const t0 = performance.now();
    for (const k of keys) { const r = W.regions.get(k); if (r?.vegCache) { r.vegCache = undefined; W.vegDirty = true; } }
    const low = W.q?.name === "low";
    const h = (x: number, z: number) => { const v = W.heightAt(x, z); return Number.isFinite(v) ? v : 0; };
    const y0 = h(wx(0, 0), wz(0, 0));
    this.meshes = [this.rocks(h, y0, low), this.props(h, y0, low), this.path(h)];
    this.g.scene.add(...this.meshes);
    this.stats.built = true;
    this.stats.ms = Math.round(performance.now() - t0);
  }

  dispose() {
    window.clearInterval(this.timer);
    for (const m of this.meshes) { m.removeFromParent(); m.geometry.dispose(); (m.material as MeshLambertMaterial).dispose(); }
    this.meshes = [];
  }

  /** Rough coral-limestone blocks: the arched cave surround, its side walls and roof, and the hill mass behind. */
  private rocks(h: (x: number, z: number) => number, y0: number, low: boolean): Mesh {
    const parts: BufferGeometry[] = [];
    const tones = [0xa89c84, 0x938872, 0xb4a88e, 0x8a8070, 0x9f9278];
    let n = 0;
    // one block in the local frame; sz scales x/y/z; ground=true sinks its base into the terrain
    const add = (lx: number, ly: number, lz: number, sx: number, sy: number, sz: number, ground = false, detail = 1) => {
      const x = wx(lx, lz), z = wz(lx, lz), seed = n * 7.31 + 1;
      const geo = new IcosahedronGeometry(1, low ? 0 : detail);
      const p = geo.attributes.position as Float32BufferAttribute;
      for (let i = 0; i < p.count; i++) { // pit the surface so it reads as weathered coral rock, not a blob
        const k = 0.78 + hash(p.getX(i) * 3.1 + seed, p.getY(i) * 2.7 + p.getZ(i)) * 0.36;
        p.setXYZ(i, p.getX(i) * k, p.getY(i) * k, p.getZ(i) * k);
      }
      geo.scale(sx, sy, sz);
      geo.applyMatrix4(new Matrix4().makeRotationY(Math.atan2(FX, FZ) + (hash(seed, 2) - 0.5) * 0.9));
      const y = ground ? h(x, z) + ly * 0.5 + sy * 0.2 : y0 + ly;
      geo.translate(x, y, z);
      const g2 = paint(geo, tones[Math.floor(hash(seed, 5) * tones.length) % tones.length], 0.18, seed);
      // darker toward the base and the cave side, lighter on top, like the photo's sun-bleached crowns
      const pos = g2.attributes.position, col = g2.attributes.color as Float32BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        const f = Math.floor(i / 3), pit = hash(f + seed, 8.1) < 0.22 ? 0.62 : 1; // dark solution pockets, one per face
        const t = pit * Math.max(0.72, Math.min(1.1, 0.8 + (pos.getY(i) - y) / (sy * 2.4)));
        col.setXYZ(i, col.getX(i) * t, col.getY(i) * t, col.getZ(i) * t);
      }
      parts.push(g2); n++;
    };
    // arch around the mouth: opening about 5 m wide and 4.5 m high, framed by smaller pitted blocks
    const AW = 3.0, AH = 4.4;
    for (let i = 0; i <= 22; i++) {
      const t = (i / 22) * Math.PI, r = 1 + (hash(i, 9) - 0.5) * 0.1;
      add(Math.cos(t) * (AW + 0.6) * r, Math.sin(t) * AH * r + 0.3, 0.2 + hash(i, 4) * 0.4, 0.75 + hash(i, 1) * 0.35, 0.7 + hash(i, 2) * 0.35, 0.8, false, 1);
    }
    for (let i = 0; i <= 12; i++) {
      const t = (i / 12) * Math.PI, r = 1 + (hash(i, 9) - 0.5) * 0.1;
      add(Math.cos(t) * (AW + 2.6) * r, Math.sin(t) * (AH + 1.2) * r, -0.8, 1.9 + hash(i, 3) * 0.7, 1.6 + hash(i, 6) * 0.6, 1.6, false, 1);
    }
    // pillar bases down to the ground on both sides of the mouth
    for (const s of [-1, 1]) for (let j = 0; j < 3; j++) add(s * (AW + 0.9 + j * 0.9), 0.4, 0.4 - j * 0.5, 1.1, 1.0, 1.0, true, 1);
    // the rough rock pillar under the statue's shelf
    for (let j = 0; j < 5; j++) add(0.3 + (hash(j, 71) - 0.5) * 0.5, 0.3 + j * 0.45, -2.2 + hash(j, 72) * 0.2, 0.75, 0.42, 0.55, false, 0);
    // cave side walls and roof, receding to the back wall about 3 m in
    for (let d = 1; d <= 3; d++) {
      for (const s of [-1, 1]) for (let j = 0; j < 3; j++) add(s * (AW + 0.3 - d * 0.15), 0.8 + j * 1.5, -d * 0.9, 0.8, 0.9, 0.8, false, 0);
      add((hash(d, 11) - 0.5) * 1.2, AH + 1.0 - d * 0.1, -d * 0.9, 2.2, 0.9, 1.0, false, 0);
    }
    // the hill mass the grotto is built into: big blocks climbing the slope behind and to the sides
    const big = low ? 26 : 40;
    for (let i = 0; i < big; i++) {
      const a = (hash(i, 21) - 0.5) * Math.PI * 1.25, d = 4.5 + hash(i, 22) * 7, lx = Math.sin(a) * d * 1.2, lz = -Math.cos(a) * d * 0.8 - 1.5;
      add(lx, 0, lz, 2.0 + hash(i, 23) * 1.8, 1.6 + hash(i, 24) * 1.8, 2.0 + hash(i, 25) * 1.4, true, 0);
    }
    // the crown of the outcrop right behind the arch, so the surround reads as cut into the hill, not a wall
    for (let i = 0; i < (low ? 9 : 14); i++) add((hash(i, 61) - 0.5) * 9, 3.6 + hash(i, 62) * 2, -2.6 - hash(i, 63) * 4, 2.2 + hash(i, 64), 1.6 + hash(i, 65), 2.2, false, 0);
    const geo = mergeGeometries(parts)!; parts.forEach((g) => g.dispose());
    geo.computeVertexNormals(); geo.computeBoundingSphere();
    this.stats.rocks = n;
    const mat = new MeshLambertMaterial({ vertexColors: true, flatShading: true });
    const m = new Mesh(geo, mat); m.name = "aw:lgr:rocks"; m.castShadow = !low; m.receiveShadow = !low;
    const dim = new Color(0x4a5268);
    m.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.7); };
    return m;
  }

  /** Dark cave back, the white shelf and Mary statue, flowers, the front stone ledge and a few shrubs. */
  private props(h: (x: number, z: number) => number, y0: number, low: boolean): Mesh {
    const parts: BufferGeometry[] = [];
    const rot = new Matrix4().makeRotationY(Math.atan2(FX, FZ));
    // place a local-frame geometry (origin at its local x/z, y relative to the mouth ground)
    const put = (geo: BufferGeometry, lx: number, ly: number, lz: number, hex: number, ground = false, jitter = 0, seed = 0) => {
      geo.applyMatrix4(rot);
      const x = wx(lx, lz), z = wz(lx, lz);
      geo.translate(x, (ground ? h(x, z) : y0) + ly, z);
      parts.push(paint(geo, hex, jitter, seed));
    };
    // dark cave interior: back wall, ceiling shadow and floor
    put(new BoxGeometry(6.4, 5.4, 0.3), 0, 2.6, -3.0, 0x1b1815);
    put(new BoxGeometry(6.0, 0.3, 3.0), 0, 5.0, -1.6, 0x24201b);
    put(new BoxGeometry(5.6, 0.25, 3.0), 0, 0.05, -1.5, 0x5c5446);
    // the white shelf the statue stands on (the rock pillar under it is in the rock mesh)
    put(new BoxGeometry(1.9, 0.1, 0.55), 0.3, 2.25, -1.55, 0xf1efe8);
    // Mary: white robe (lathe), blue sash down the front, folded hands, face and white veil
    const SX = 0.3, SY = 2.3, SZ = -1.7, sc = 1.25; // about 1.9 m with the head, as in the photo
    const robe = new LatheGeometry([[0.0, 0], [0.3, 0], [0.31, 0.15], [0.26, 0.6], [0.22, 1.0], [0.2, 1.22], [0.13, 1.33], [0.0, 1.35]].map(([r, y]) => new Vector2(r * sc, y * sc)), low ? 8 : 14);
    put(robe, SX, SY, SZ, 0xf3f0e7);
    for (const s of [-1, 1]) { const b = new BoxGeometry(0.06, 0.85 * sc, 0.03); b.rotateZ(s * 0.06); put(b, SX + s * 0.05 * sc, SY + 0.6 * sc, SZ + 0.32 * sc, 0x4c7ac4); }
    put(new BoxGeometry(0.46 * sc, 0.07, 0.46 * sc), SX, SY + 1.02 * sc, SZ, 0x4c7ac4); // the sash's belt
    const hands = new BoxGeometry(0.1, 0.2, 0.1); hands.rotateX(-0.3); put(hands, SX, SY + 1.1 * sc, SZ + 0.24 * sc, 0xe7cfb3);
    put(new SphereGeometry(0.12 * sc, 8, 6), SX, SY + 1.47 * sc, SZ + 0.03 * sc, 0xe7cfb3);
    const veil = new SphereGeometry(0.155 * sc, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.62); put(veil, SX, SY + 1.47 * sc, SZ - 0.02 * sc, 0xf6f4ee);
    put(new IcosahedronGeometry(0.06, 0), SX, SY + 0.04, SZ + 0.38 * sc, 0xe8c040); // the golden rose at her feet
    // flowers: potted and growing on the ledges below the statue and at the mouth (pink, red, yellow, white)
    const fl = [0xe0507a, 0xd8302a, 0xf0c419, 0xf4f1ea, 0xc93f8e];
    const nf = low ? 22 : 40;
    for (let i = 0; i < nf; i++) {
      const up = hash(i, 33) < 0.4, side = hash(i, 35) < 0.5 ? -1 : 1;
      const lx = up ? SX + side * (0.4 + hash(i, 31) * 0.45) : (hash(i, 31) - 0.5) * 3.6, lz = -0.6 - hash(i, 32) * 1.2;
      const leaf = new IcosahedronGeometry(0.16 + hash(i, 34) * 0.1, 0); leaf.scale(1, 0.7, 1);
      put(leaf, lx, up ? 2.3 : 0.2, up ? -1.4 : lz, 0x3f6a2c, false, 0.25, i);
      put(new IcosahedronGeometry(0.07, 0), lx, (up ? 2.3 : 0.2) + 0.14, (up ? -1.4 : lz) + 0.05, fl[i % fl.length], false, 0, i);
      this.stats.flowers++;
    }
    // low rough stone ledge in front of the mouth, curving round the plaza (people sit on it)
    // only on the left half: the footway comes in from the right-front
    for (let i = 0; i < 8; i++) {
      const t = -1.2 + (i / 7) * 0.95, R = 6.5, lx = Math.sin(t) * R * 1.15, lz = 1.0 + Math.cos(t) * R;
      const b = new BoxGeometry(1.25, 0.6 + hash(i, 41) * 0.15, 0.6); b.rotateY(-t);
      put(b, lx, 0.25, lz, [0xb1a68e, 0xa0957f, 0xc0b59c][i % 3], true, 0.12, i);
    }
    // a few dark grey-green dry-forest shrubs on the slope beside the grotto
    for (let i = 0; i < (low ? 8 : 14); i++) {
      const s = hash(i, 51) < 0.5 ? -1 : 1, lx = s * (5.5 + hash(i, 52) * 5), lz = -1 - hash(i, 53) * 6;
      const b = new IcosahedronGeometry(1, 0); b.scale(1.4 + hash(i, 54), 0.9 + hash(i, 55) * 0.6, 1.3);
      put(b, lx, 0.7, lz, [0x4f5a34, 0x5b6239, 0x465230][i % 3], true, 0.15, i);
    }
    const geo = mergeGeometries(parts)!; parts.forEach((g) => g.dispose());
    geo.computeVertexNormals(); geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, side: DoubleSide });
    const m = new Mesh(geo, mat); m.name = "aw:lgr:props"; m.castShadow = !low; m.receiveShadow = !low;
    const dim = new Color(0x55607a);
    m.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.6); };
    return m;
  }

  /** Grey flagstone path along the OSM footway, plus a small paved plaza in front of the grotto. */
  private path(h: (x: number, z: number) => number): Mesh {
    const pos: number[] = [], col: number[] = [], idx: number[] = [];
    const tones = [new Color(0xa9a294), new Color(0x9f988a), new Color(0xb2ab9c), new Color(0x968f81)], c = new Color();
    const quad = (pts: number[][], seed: number) => {
      const b = pos.length / 3;
      c.copy(tones[Math.floor(hash(seed, 1.3) * tones.length) % tones.length]).multiplyScalar(0.95 + hash(seed, 2.1) * 0.08);
      for (const [x, z] of pts) { pos.push(x, Math.max(h(x, z), h(x + 0.6, z), h(x - 0.6, z), h(x, z + 0.6), h(x, z - 0.6)) + 0.25, z); col.push(c.r, c.g, c.b); }
      const [p0, p1, p2] = pts, up = (p1[1] - p0[1]) * (p2[0] - p0[0]) - (p1[0] - p0[0]) * (p2[1] - p0[1]) > 0; // wind every slab to face up
      if (up) idx.push(b, b + 1, b + 2, b, b + 2, b + 3); else idx.push(b, b + 2, b + 1, b, b + 3, b + 2);
      this.stats.pathQuads++;
    };
    // the footway: 1.6 m wide, cut into 0.9 m slabs with thin joints; starts 4 m off the road centreline
    const HW = 0.8, L = 0.9, J = 0.06;
    let seed = 0;
    for (let i = 1; i < PATH.length; i++) {
      const [ax, az] = PATH[i - 1], [bx, bz] = PATH[i], len = Math.hypot(bx - ax, bz - az), ux = (bx - ax) / len, uz = (bz - az) / len, nx = -uz, nz = ux;
      for (let s = 0; s + J < len; s += L) {
        const e = Math.min(len, s + L) - J, x0 = ax + ux * s, z0 = az + uz * s, x1 = ax + ux * e, z1 = az + uz * e;
        if (lineDist(ROAD, (x0 + x1) / 2, (z0 + z1) / 2) < 4.5) continue;
        if (Math.hypot((x0 + x1) / 2 - G[0], (z0 + z1) / 2 - G[1]) < 5.5) continue; // the plaza covers the end
        const w = HW * (0.96 + hash(seed, 7) * 0.08);
        quad([[x0 - nx * w, z0 - nz * w], [x1 - nx * w, z1 - nz * w], [x1 + nx * w, z1 + nz * w], [x0 + nx * w, z0 + nz * w]], seed++);
      }
    }
    // the plaza: 1 m flagstones inside an ellipse in front of the mouth, reaching into the cave floor
    const C = 1.0;
    for (let a = -5; a < 5; a += C) for (let b = -0.5; b < 7; b += C) {
      const ca = a + C / 2, cb = b + C / 2;
      if ((ca / 4.8) ** 2 + ((cb - 3) / 4.2) ** 2 > 1 && !(cb < 1.2 && Math.abs(ca) < 2.2)) continue;
      const g = J / 2, p = [[a + g, b + g], [a + C - g, b + g], [a + C - g, b + C - g], [a + g, b + C - g]].map(([lx, lz]) => [wx(lx, lz), wz(lx, lz)]);
      quad(p, 500 + seed++);
    }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new Float32BufferAttribute(pos, 3));
    geo.setAttribute("color", new Float32BufferAttribute(col, 3));
    geo.setIndex(idx); geo.computeVertexNormals(); geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, polygonOffset: true, polygonOffsetFactor: -4, polygonOffsetUnits: -4 });
    const m = new Mesh(geo, mat); m.name = "aw:lgr:path"; m.receiveShadow = true;
    const dim = new Color(0x3a4258);
    m.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.75); };
    return m;
  }
}
