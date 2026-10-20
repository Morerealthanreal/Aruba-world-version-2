// Ser'i Noka, Santa Cruz: the stone cross on its boulder, the boulder hill and the open-air amphitheatre at its foot.
// Off with ?serinoka=0. A draws the hill north-west of the Santa Cruz church as flat tan ground with scattered
// palms, so neither the cross that gave the town its name nor the 1963 theatre are there.
// The references show a low hill of pale, rounded diorite boulders under dense dry thicket and kadushi. On the
// highest boulder stands a ~5.5 m stone cross of rough mottled local stone inlaid with white quartz, built in
// 1968 (inaugurated Good Friday 12 April 1968) where tradition puts the first wooden cross the Spanish planted.
// At the hill's foot, in the old Awa Blanco gully, is Teatro Ser'i Noka (opened 8 December 1963): a ~500-seat
// fan of stone tiers with concrete caps facing a raised stage behind a natural-stone retaining wall, with the
// cross on its rock in the background.
// Positions are OSM (historic=monument node 8907148628 for the cross, amenity=theatre node 4835384944 for the
// theatre) and A's region roads and buildings, rebuilt in code; the hill outline and the stage were read off
// Esri satellite imagery; photos are reference only. The church next door is a hero model and is left alone.
// 3 draw calls, no textures: one merged vertex-coloured stone mesh (boulders, cross, tiers, stage), one
// InstancedMesh of thicket clumps, one InstancedMesh of kadushi. A's palms on the hill and all of A's veg on
// the boulders and the theatre are skipped through __awVegHit. Built once in 2 steps on 1.5 s ticks after
// height region 9,12 has streamed in; per frame only a night colour lerp. Hidden past 2.5 km.
import {
  BoxGeometry, BufferGeometry, Color, CylinderGeometry, DoubleSide, Euler, Float32BufferAttribute, Group,
  IcosahedronGeometry, InstancedMesh, Matrix4, Mesh, MeshLambertMaterial, Quaternion, Vector3,
} from "three";
import { mergeGeometries, mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { uNight } from "./uniforms";

type P = number[];
// game metres (x east, z south)
const CROSS: P = [-1393.7, 869.3]; // OSM node 8907148628 (historic=monument), the cross on its boulder
const THEATRE: P = [-1474.2, 946.7]; // OSM node 4835384944 (Ser'i Noca Outdoor Theater), the stage front
// the wooded boulder hill between the streets north of the church, from Esri imagery (trimmed off the roads and houses)
const HILL: P[] = [[-1538, 793], [-1392.5, 798.8], [-1372, 840.5], [-1290, 843.5], [-1285, 860], [-1262, 866], [-1262, 971], [-1344.7, 971.4], [-1427.4, 979.5], [-1456.6, 963.9], [-1538, 958]];
// A's region 9,12 roads at the hill's edge (ax, az, bx, bz, clearance) and a house block at its north-west corner (x, z, r)
const ROADS: number[][] = [[-1546.1, 957.8, -1550.3, 947.3, 5.5], [-1252.7, 872.1, -1252.8, 869.3, 4.3], [-1252.8, 869.3, -1253.8, 847.2, 4.3], [-1277.1, 835.5, -1290.3, 835.6, 5.5], [-1290.3, 835.6, -1358.1, 838.3, 5.5], [-1358.1, 838.3, -1363.3, 835.5, 5.5], [-1363.3, 835.5, -1367.0, 828.4, 5.5], [-1367.0, 828.4, -1368.3, 804.5, 5.5]];
const HOLES: number[][] = [[-1388.6, 797.2, 21]];
// the theatre faces the cross: the stage is on +U from THEATRE, the tiers fan out on -U
const UL = Math.hypot(CROSS[0] - THEATRE[0], CROSS[1] - THEATRE[1]);
const U: P = [(CROSS[0] - THEATRE[0]) / UL, (CROSS[1] - THEATRE[1]) / UL];
const V: P = [-U[1], U[0]];
const ROWS = 9, R0 = 6, TREAD = 0.9, RISE = 0.45, SPAN = (75 * Math.PI) / 180; // ~500 seats
const THEATRE_R = R0 + ROWS * TREAD + 0.4 + 2; // veg-free radius
// pale boulders round the cross and on the two bare patches of the hill (dx, dz from CROSS, radius x, height, radius z)
const DOME = { rx: 6, ry: 3.2, rz: 5, cy: 0.1 };
const BOULDERS: number[][] = [
  [-6.5, 4.5, 3.2, 1.6, 2.6], [-3, 8.5, 2.6, 1.3, 2.2], [5.5, 5, 2.4, 1.4, 2], [7.5, -2.5, 2.2, 1.5, 2.6], [-7.5, -3, 2, 1.2, 1.7],
  [1.5, -7, 2.8, 1.5, 2.1], [-11, 9, 1.8, 1, 1.5], [10, 9.5, 1.6, 0.9, 1.4], [-2, 13, 2.2, 1, 1.8],
  [-56, 26, 3, 1.5, 2.4], [-52, 31, 2, 1.1, 1.8], [-61, 30, 1.7, 0.9, 1.5], [-45, 28, 1.5, 0.8, 1.3],
  [44, 6, 2.8, 1.4, 2.2], [50, 12, 2.2, 1.2, 1.9], [38, 13, 1.6, 0.9, 1.4], [57, 4, 1.9, 1, 1.6],
];
const MIDX = -1400, MIDZ = 890, SHOW = 2500;

const hash = (x: number, z: number) => { const s = Math.sin(x * 12.9898 + z * 78.233) * 43758.5453; return s - Math.floor(s); };
function pip(p: P[], x: number, z: number) {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const a = p[i], b = p[j];
    if ((a[1] > z) !== (b[1] > z) && x < ((b[0] - a[0]) * (z - a[1])) / (b[1] - a[1]) + a[0]) c = !c;
  }
  return c;
}
function segDist(x: number, z: number, ax: number, az: number, bx: number, bz: number) {
  const dx = bx - ax, dz = bz - az, L = dx * dx + dz * dz;
  const t = L ? Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / L)) : 0;
  return Math.hypot(x - ax - t * dx, z - az - t * dz);
}
const onRoad = (x: number, z: number) => ROADS.some(([ax, az, bx, bz, r]) => segDist(x, z, ax, az, bx, bz) < r) || HOLES.some(([hx, hz, r]) => Math.hypot(x - hx, z - hz) < r);
const theatreDist = (x: number, z: number) => Math.hypot(x - THEATRE[0], z - THEATRE[1]);
/** Inside the dome or a boulder (plus a margin), so no veg grows through the rock. */
function onRock(x: number, z: number, pad: number) {
  const dx = x - CROSS[0], dz = z - CROSS[1];
  if ((dx / (DOME.rx + pad)) ** 2 + (dz / (DOME.rz + pad)) ** 2 < 1) return true;
  for (const [bx, bz, rx, , rz] of BOULDERS) if (((dx - bx) / (rx + pad)) ** 2 + ((dz - bz) / (rz + pad)) ** 2 < 1) return true;
  return false;
}

/** Non-indexed copy with a colour per triangle (mottled stone) and no uvs, so differently built parts merge. */
function mottle(g: BufferGeometry, pal: number[], seed: number, quartz = 0) {
  const geo = g.index ? g.toNonIndexed() : g; if (geo !== g) g.dispose();
  geo.deleteAttribute("uv");
  const n = geo.attributes.position.count, a = new Float32Array(n * 3), c = new Color();
  for (let t = 0; t < n; t += 3) {
    const r = hash(seed + t * 0.731, t * 0.177 + seed);
    if (r < quartz) c.setHex(0xe8e5dc); else c.setHex(pal[Math.floor(hash(t * 1.31, seed) * pal.length) % pal.length]).multiplyScalar(0.9 + r * 0.2);
    for (let k = 0; k < 3; k++) { a[(t + k) * 3] = c.r; a[(t + k) * 3 + 1] = c.g; a[(t + k) * 3 + 2] = c.b; }
  }
  geo.setAttribute("color", new Float32BufferAttribute(a, 3));
  if (!geo.attributes.normal) geo.computeVertexNormals();
  return geo;
}
/** Quads (4 corners each, in order round the quad) as a coloured triangle soup. */
class Soup {
  pos: number[] = []; col: number[] = [];
  quad(p: number[][], hex: number, k = 1) {
    const c = new Color(hex).multiplyScalar(k);
    for (const i of [0, 1, 2, 0, 2, 3]) { this.pos.push(p[i][0], p[i][1], p[i][2]); this.col.push(c.r, c.g, c.b); }
  }
  tri(p: number[][], hex: number, k = 1) {
    const c = new Color(hex).multiplyScalar(k);
    for (const v of p) { this.pos.push(v[0], v[1], v[2]); this.col.push(c.r, c.g, c.b); }
  }
  geo() {
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(this.pos, 3));
    g.setAttribute("color", new Float32BufferAttribute(this.col, 3));
    g.computeVertexNormals();
    return g;
  }
}

type World = { heightAt(x: number, z: number): number; regions: Map<string, { rx: number; rz: number; H?: unknown; vegCache?: unknown }>; M: { X0: number; Z0: number; RS: number }; vegDirty?: boolean };
type H = (x: number, z: number) => number;

export class SeriNoka {
  stats = { built: false, stoneTris: 0, crossTris: 0, theatreTris: 0, clumps: 0, kadushi: 0, vegSkipped: 0, ms: 0, part: {} as Record<string, number> };
  private timer = 0;
  private step = 0;
  private group = new Group();
  constructor(private g: AGame) {
    this.group.name = "aw:serinoka";
    this.installVeg();
    this.timer = window.setInterval(() => this.tick(), 1500);
  }

  /** A asks this hook for every palm (p), divi (d), kadushi (k), shrub (s) and rock (r) it places: no palms on the
   * hill (it's dry thicket), nothing on the boulders or in the theatre. */
  private installVeg() {
    const w = window as unknown as { __awVegHit?: (x: number, z: number, n?: string) => boolean };
    const prev = w.__awVegHit;
    w.__awVegHit = (x, z, n) => {
      if (x > -1545 && x < -1255 && z > 790 && z < 985) {
        if (theatreDist(x, z) < THEATRE_R || onRock(x, z, 0.8) || (n === "p" && pip(HILL, x, z))) { this.stats.vegSkipped++; return true; }
      }
      return prev ? prev(x, z, n) : false;
    };
    const W = this.g.real as unknown as World;
    if (W?.regions) {
      let hit = false;
      for (const r of W.regions.values()) if (r.rx === 9 && r.rz === 12 && r.vegCache) { r.vegCache = undefined; hit = true; }
      if (hit) W.vegDirty = true;
    }
  }

  private timed<T>(k: string, f: () => T): T { const t = performance.now(); const r = f(); this.stats.part[k] = Math.round(performance.now() - t); return r; }

  private tick() {
    const W = this.g.real as unknown as World;
    if (!W?.regions || !W.M) return;
    if (this.step >= 2) { // built: hide everything when the camera is far away
      const c = this.g.camera.position, show = Math.hypot(c.x - MIDX, c.z - MIDZ) < SHOW;
      if (this.group.visible !== show) this.group.visible = show;
      return;
    }
    if (this.step === 0) {
      const key = `${Math.floor((CROSS[0] - W.M.X0) / W.M.RS)},${Math.floor((CROSS[1] - W.M.Z0) / W.M.RS)}`;
      let ready = false;
      for (const r of W.regions.values()) if (r.H && `${r.rx},${r.rz}` === key) ready = true;
      if (!ready) return;
    }
    const t0 = performance.now();
    const low = this.g.real?.q?.name === "low";
    const h: H = (x, z) => { const v = W.heightAt(x, z); return Number.isFinite(v) ? v : 0; };
    if (this.step === 0) { this.group.add(this.timed("stone", () => this.stone(h, low))); this.g.scene.add(this.group); }
    else {
      this.group.add(this.timed("thicket", () => this.thicket(h, low)), this.timed("kadushi", () => this.kadushi(h, low)));
      this.stats.built = true; window.clearInterval(this.timer); this.timer = window.setInterval(() => this.tick(), 1000);
    }
    this.step++;
    this.stats.ms += Math.round(performance.now() - t0);
  }

  /** Boulders, the cross and the theatre, merged into one flat-shaded vertex-coloured mesh. */
  private stone(h: H, low: boolean): Mesh {
    const parts: BufferGeometry[] = [];
    const base = h(CROSS[0], CROSS[1]);
    // the dome under the cross; its top is kept smooth so the cross base sits on it
    const dome = this.boulder(CROSS[0], CROSS[1], base, DOME.rx, DOME.ry, DOME.rz, DOME.cy, low ? 2 : 3, 11, true);
    parts.push(dome);
    BOULDERS.forEach(([dx, dz, rx, ry, rz], i) => {
      const x = CROSS[0] + dx, z = CROSS[1] + dz;
      parts.push(this.boulder(x, z, h(x, z), rx, ry, rz, -0.15, 1, 23 + i * 7, false));
    });
    const top = base + DOME.ry * (DOME.cy + 0.92); // the crown (see boulder's flattened top)
    const cross = this.cross(top);
    this.stats.crossTris = cross.attributes.position.count / 3;
    parts.push(cross);
    const th = this.theatre(h, low);
    this.stats.theatreTris = th.attributes.position.count / 3;
    parts.push(th);
    const geo = mergeGeometries(parts)!; parts.forEach((p) => p.dispose());
    geo.computeBoundingSphere();
    const mat = new MeshLambertMaterial({ vertexColors: true, side: DoubleSide, flatShading: true });
    const mesh = new Mesh(geo, mat); mesh.name = "aw:serinoka:stone"; mesh.castShadow = !low; mesh.receiveShadow = !low;
    const dim = new Color(0x55607a);
    mesh.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.6); };
    this.stats.stoneTris = geo.attributes.position.count / 3;
    return mesh;
  }

  /** A pale rounded diorite boulder, half buried: lumpy (the same jitter on shared corners, so no cracks), lighter
   * on top, weathered darker toward the ground with grey streaks. */
  private boulder(x: number, z: number, y: number, rx: number, ry: number, rz: number, cy: number, detail: number, seed: number, smoothTop: boolean) {
    const g = new IcosahedronGeometry(1, detail);
    g.deleteAttribute("uv");
    const pa = g.attributes.position as Float32BufferAttribute, n = pa.count;
    const col = new Float32Array(n * 3), c = new Color(), topC = new Color(0xe3d3b2), midC = new Color(0xd2bb94), lowC = new Color(0x9f8a69), streak = new Color(0x8f8a80);
    const yaw = hash(seed, 1) * 6.28, cs = Math.cos(yaw), sn = Math.sin(yaw);
    for (let i = 0; i < n; i++) {
      const vx = pa.getX(i), vy = pa.getY(i), vz = pa.getZ(i);
      const kx = Math.round(vx * 1000), ky = Math.round(vy * 1000), kz = Math.round(vz * 1000);
      let j = 0.86 + 0.24 * hash(kx * 0.013 + seed, ky * 0.017 + kz * 0.011);
      if (smoothTop) j = 1 + (j - 1) * Math.min(1, Math.max(0, (0.9 - vy) * 2.5)); // flat-ish crown for the cross
      const fy = vy < 0 ? vy * 0.9 : vy * (smoothTop ? 0.92 : 0.8); // domed, flatter crown
      const lx = vx * rx * j, lz = vz * rz * j;
      pa.setXYZ(i, x + lx * cs - lz * sn, y + ry * (cy + fy * j), z + lx * sn + lz * cs);
      c.copy(midC).lerp(topC, Math.max(0, vy) * 0.8).lerp(lowC, Math.max(0, 0.25 - vy) * 1.1);
      const s = hash(kx * 0.007 + seed * 3, kz * 0.009);
      if (s > 0.82) c.lerp(streak, 0.45);
      c.multiplyScalar(0.93 + hash(kz * 0.02, kx * 0.03 + seed) * 0.12);
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    g.setAttribute("color", new Float32BufferAttribute(col, 3));
    g.computeVertexNormals();
    return g;
  }

  /** The 1968 stone cross: a rough shaft and arms of mottled local stone with white quartz, slightly flared ends,
   * on a rough plinth. Its face looks down to the theatre (the audience sees it broadside behind the stage). */
  private cross(top: number) {
    const pal = [0x8b7d6b, 0x7f7262, 0x93836d, 0x857d72, 0x7a6f60, 0x9a8a72];
    const yaw = Math.atan2(U[0], U[1]); // local z along U (toward the theatre is -z), arms along local x
    const out: BufferGeometry[] = [];
    const add = (w: number, ht: number, d: number, ox: number, oy: number, sx: number, sy: number, sz: number, seed: number) => {
      const b = new BoxGeometry(w, ht, d, sx, sy, sz); b.translate(ox, oy, 0); b.rotateY(yaw); b.translate(CROSS[0], top, CROSS[1]);
      out.push(mottle(b, pal, seed, 0.08));
    };
    add(1.5, 0.9, 1.35, 0, 0.05, 2, 1, 2, 3); // plinth, sunk into the crown
    add(0.72, 5.5, 0.64, 0, 0.4 + 2.75, 2, 9, 2, 5); // shaft
    add(2.5, 0.62, 0.6, 0, 4.15, 6, 1, 1, 7); // arms
    for (const s of [-1, 1]) add(0.3, 0.86, 0.7, s * 1.33, 4.15, 1, 2, 1, 9 + s); // flared arm ends
    add(0.86, 0.3, 0.72, 0, 0.4 + 5.5, 2, 1, 1, 13); // flared head
    const g = mergeGeometries(out)!; out.forEach((b) => b.dispose());
    return g;
  }

  /** Teatro Ser'i Noka: a fan of stone tiers with pale concrete treads (~500 seats) round a sand orchestra, a
   * parapet behind the top row, and a raised stage behind a natural-stone retaining wall, facing the cross. */
  private theatre(h: H, low: boolean) {
    const S = new Soup();
    const [cx, cz] = THEATRE, y0 = h(cx, cz);
    const at = (a: number, b: number): P => [cx + U[0] * a + V[0] * b, cz + U[1] * a + V[1] * b];
    const stone = [0x8e8f8a, 0x9a8f80, 0x7e8284, 0xa39886, 0x86807a];
    const capC = 0xafa797, stageTop = 0xb3aa98;
    const K = low ? 16 : 26;
    // the lowest ground under the tiers, so the back and ends reach below it
    let gmin = y0;
    for (let k = 0; k <= 8; k++) for (const r of [R0, R0 + ROWS * TREAD + 0.5]) {
      const th = -SPAN + (2 * SPAN * k) / 8, p = at(-Math.cos(th) * r, Math.sin(th) * r); gmin = Math.min(gmin, h(p[0], p[1]));
    }
    const foot = gmin - y0 - 0.6;
    // profile (radius, height over the orchestra): risers and treads up the fan, then a parapet and the back wall
    const prof: number[][] = [[R0, foot]];
    for (let i = 0; i < ROWS; i++) { const r = R0 + i * TREAD, t = RISE * (i + 1); prof.push([r, t], [r + TREAD, t]); }
    const rTop = R0 + ROWS * TREAD, tTop = RISE * ROWS;
    prof.push([rTop, tTop + 0.9], [rTop + 0.4, tTop + 0.9], [rTop + 0.4, foot]);
    const P3 = (th: number, r: number, y: number) => { const p = at(-Math.cos(th) * r, Math.sin(th) * r); return [p[0], y0 + y, p[1]]; };
    for (let k = 0; k < K; k++) {
      const t0 = -SPAN + (2 * SPAN * k) / K, t1 = -SPAN + (2 * SPAN * (k + 1)) / K;
      for (let s = 0; s + 1 < prof.length; s++) {
        const [ra, ya] = prof[s], [rb, yb] = prof[s + 1];
        const tread = Math.abs(ya - yb) < 1e-6;
        const hex = tread ? capC : stone[Math.floor(hash(k * 1.7 + s, s * 0.37) * stone.length)];
        S.quad([P3(t0, ra, ya), P3(t1, ra, ya), P3(t1, rb, yb), P3(t0, rb, yb)], hex, tread ? 0.95 + hash(k, s) * 0.08 : 0.9 + hash(s, k) * 0.2);
      }
    }
    // end walls of the fan: one stone panel under each row, and the parapet
    for (const th of [-SPAN, SPAN]) {
      for (let i = 0; i < ROWS; i++) { const r = R0 + i * TREAD, t = RISE * (i + 1); S.quad([P3(th, r, foot), P3(th, r + TREAD, foot), P3(th, r + TREAD, t), P3(th, r, t)], stone[i % stone.length]); }
      S.quad([P3(th, rTop, foot), P3(th, rTop + 0.4, foot), P3(th, rTop + 0.4, tTop + 0.9), P3(th, rTop, tTop + 0.9)], stone[2]);
    }
    // the stage: a straight natural-stone front on the orchestra and a rounded back, ~12 m across
    const SF = 0.8, SR = 6, SH = 1.0, sFoot = Math.min(h(...at(SF, 0) as [number, number]), h(...at(SF + SR, 0) as [number, number])) - y0 - 0.5;
    const N = low ? 10 : 16, ring: P[] = [];
    ring.push(at(SF, -SR));
    for (let i = 1; i < N; i++) { const f = (Math.PI * i) / N; ring.push(at(SF + SR * Math.sin(f), -SR * Math.cos(f))); }
    ring.push(at(SF, SR));
    const mid = at(SF + SR * 0.45, 0);
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length];
      S.tri([[mid[0], y0 + SH, mid[1]], [a[0], y0 + SH, a[1]], [b[0], y0 + SH, b[1]]], stageTop, 0.96 + hash(i, 3) * 0.06);
      // side walls, split in two courses so the natural stone mottles
      for (const [ya, yb] of [[sFoot, SH * 0.5], [SH * 0.5, SH]]) S.quad([[a[0], y0 + ya, a[1]], [b[0], y0 + ya, b[1]], [b[0], y0 + yb, b[1]], [a[0], y0 + yb, a[1]]], stone[Math.floor(hash(i * 2.3, ya) * stone.length)]);
    }
    return S.geo();
  }

  /** Dense dry thicket on the hill: low rounded crowns of kwihi and scrub, darker in the gullies. */
  private thicket(h: H, low: boolean): InstancedMesh {
    const spots: number[][] = [];
    const step = low ? 8 : 5.5;
    for (let z = 795; z <= 980; z += step) for (let x = -1536; x <= -1262; x += step) {
      const px = x + (hash(x, z) - 0.5) * step * 0.9, pz = z + (hash(z, x) - 0.5) * step * 0.9;
      if (hash(px * 0.7, pz * 1.1) > 0.85 || !pip(HILL, px, pz) || onRoad(px, pz)) continue;
      const r = (low ? 2.6 : 1.9) + hash(px * 3, pz) * (low ? 2 : 1.6);
      if (theatreDist(px, pz) < THEATRE_R + r * 0.5 || onRock(px, pz, r * 0.6)) continue;
      spots.push([px, pz, h(px, pz), r]);
    }
    // a soft, slightly lumpy crown: the 20-triangle icosahedron with shared corners and smooth normals
    const ico = new IcosahedronGeometry(1, 0); ico.deleteAttribute("uv"); ico.deleteAttribute("normal");
    const blob = mergeVertices(ico); ico.dispose();
    const bp = blob.attributes.position as Float32BufferAttribute;
    for (let i = 0; i < bp.count; i++) { const j = 0.85 + 0.3 * hash(i * 1.9, 4.2); bp.setXYZ(i, bp.getX(i) * j, Math.max(-0.35, bp.getY(i)) * j, bp.getZ(i) * j); }
    blob.computeVertexNormals();
    const im = new InstancedMesh(blob, new MeshLambertMaterial({ color: 0xffffff }), Math.max(1, spots.length));
    im.count = spots.length;
    im.name = "aw:serinoka:thicket"; im.castShadow = !low; im.receiveShadow = !low;
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), c = new Color();
    const tints = [0x3a4a26, 0x44542c, 0x4e5a33, 0x3d4d2a, 0x5d5f3f, 0x4a4f2e];
    spots.forEach(([x, z, y, r], i) => {
      const ht = r * (0.5 + hash(z, x * 2) * 0.25);
      e.set(0, hash(z, x) * 6.28, 0); q.setFromEuler(e);
      s.set(r * (1 + hash(z, 4) * 0.35), ht, r); p.set(x, y + ht * 0.3, z); m.compose(p, q, s); im.setMatrixAt(i, m);
      im.setColorAt(i, c.setHex(tints[Math.floor(hash(x * 2, z * 2) * tints.length) % tints.length]));
    });
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere();
    const dim = new Color(0x4a5a70), mat = im.material as MeshLambertMaterial;
    im.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.7); };
    this.stats.clumps = spots.length;
    return im;
  }

  /** Kadushi (columnar cactus) stands: thick round the cross's boulders, scattered over the rest of the hill. */
  private kadushi(h: H, low: boolean): InstancedMesh {
    const cols: BufferGeometry[] = [];
    for (const [ox, oz, r, ht] of [[0, 0, 0.15, 3.2], [0.38, 0.12, 0.12, 2.5], [-0.32, 0.26, 0.12, 2.1], [0.06, -0.38, 0.13, 2.8]]) {
      const c = new CylinderGeometry(r * 0.85, r, ht, 6, 1); c.translate(ox, ht / 2, oz); c.deleteAttribute("uv"); cols.push(c);
    }
    const geo = mergeGeometries(cols)!; cols.forEach((c) => c.dispose());
    const spots: number[][] = [];
    const nNear = low ? 22 : 34, nFar = low ? 14 : 24;
    for (let i = 0; spots.length < nNear && i < nNear * 6; i++) { // round the cross
      const a = hash(i, 5.1) * 6.283, d = 8 + hash(i, 7.7) * 26, x = CROSS[0] + Math.cos(a) * d, z = CROSS[1] + Math.sin(a) * d;
      if (!onRock(x, z, 0.6) && !onRoad(x, z) && theatreDist(x, z) > THEATRE_R && pip(HILL, x, z)) spots.push([x, z]);
    }
    for (let i = 0; spots.length < nNear + nFar && i < nFar * 8; i++) { // the rest of the hill
      const x = -1536 + hash(i, 2.3) * 274, z = 795 + hash(i, 9.1) * 185;
      if (!onRock(x, z, 0.6) && !onRoad(x, z) && theatreDist(x, z) > THEATRE_R && pip(HILL, x, z)) spots.push([x, z]);
    }
    const im = new InstancedMesh(geo, new MeshLambertMaterial({ color: 0xffffff, flatShading: true }), Math.max(1, spots.length));
    im.count = spots.length;
    im.name = "aw:serinoka:kadushi"; im.castShadow = !low; im.receiveShadow = !low;
    const m = new Matrix4(), q = new Quaternion(), e = new Euler(), p = new Vector3(), s = new Vector3(), c = new Color();
    const tints = [0x4f6a3c, 0x45603a, 0x587046, 0x627248];
    spots.forEach(([x, z], i) => {
      const k = 0.8 + hash(z, x) * 0.6;
      e.set((hash(x, 1) - 0.5) * 0.08, hash(z, x * 3) * 6.28, (hash(z, 2) - 0.5) * 0.08); q.setFromEuler(e);
      s.set(k, k * (0.9 + hash(x, z) * 0.4), k); p.set(x, h(x, z) - 0.1, z); m.compose(p, q, s); im.setMatrixAt(i, m);
      im.setColorAt(i, c.setHex(tints[Math.floor(hash(x * 5, z) * tints.length) % tints.length]));
    });
    im.instanceMatrix.needsUpdate = true; if (im.instanceColor) im.instanceColor.needsUpdate = true;
    im.computeBoundingSphere();
    const dim = new Color(0x4a5a70), mat = im.material as MeshLambertMaterial;
    im.onBeforeRender = () => { mat.color.setHex(0xffffff).lerp(dim, uNight.value * 0.7); };
    this.stats.kadushi = spots.length;
    return im;
  }
}
