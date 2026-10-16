// Tierra del Sol, the Robert Trent Jones II course beside the California Lighthouse.
// Layout is OSM (relation 14139348 and golf=* ways, plus the clubhouse and the ponds
// tagged natural=water inside the course). Fairway polygons cover only part of the
// 18 holes; the rest are ribbons offset from the mapped cart paths toward the mapped
// greens and bunkers, clipped to the course and kept off the lighthouse / Faro Blanco lot.
// Surfaces are draped on heightAt, one shared material per surface, flags and palms instanced.
// Ground photos (clubhouse tile roofs and a tower, wind-bent palms, white bunkers, desert
// washes rather than a lake on the 15th) set the clubhouse massing and the turf colors.
// ?golf=0 turns it off.
import {
  BoxGeometry, BufferGeometry, Color, CylinderGeometry, DoubleSide, Float32BufferAttribute,
  Group, InstancedMesh, Matrix4, Mesh, MeshLambertMaterial, Quaternion, Vector3,
} from "three";
import type { AGame } from "./env";

type Ring = number[][];
type Poly = { o: Ring; h?: Ring[] };
type GolfData = {
  anchor: number[];
  fairways: Poly[]; greens: Poly[]; tees: Poly[]; bunkers: Poly[]; water: Poly[];
  paths: Ring[]; club: Ring[]; pool: Ring; palms: number[][]; flags: number[][];
};
type World = {
  heightAt(x: number, z: number): number;
  regions: Map<string, { H?: Float32Array }>;
  M: { X0: number; Z0: number; RS: number };
  vegDirty?: boolean;
  hero?: { polys: number[][][]; pts: number[][] };
};
type Tile = { ix: number; iz: number; cx: number; cz: number; built: boolean; hi: Group; lo: Group; hiOn: boolean };

const TILE = 200;
const HI = 4;
const LO = 16;
const LOD = 520;
const SHOW = 3200;
const CELL = 8;

const COL = {
  fairway: 0x3f8c38,
  green: 0x86c652,
  tee: 0x2f8a38,
  bunker: 0xf4f0e4,
  path: 0xb7b3a8,
  water: 0x1e7384,
  deck: 0xe4d5bf,
  wall: 0xf3efe4,
  roof: 0xb8432c,
  glass: 0x243646,
  trunk: 0x6b4a2c,
  frond: 0x1f6b32,
  pole: 0xe8e6e0,
  cloth: 0xf7f4ee,
};

function stripe(mat: MeshLambertMaterial, freq: number, key: string, dark = 0.9) {
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = "varying vec3 vTdsW;\n" + shader.vertexShader.replace(
      "#include <project_vertex>",
      "#include <project_vertex>\n\tvTdsW = (modelMatrix * vec4(transformed, 1.0)).xyz;",
    );
    const f = freq.toFixed(4);
    const g = (freq * 0.37).toFixed(4);
    const d = dark.toFixed(3);
    shader.fragmentShader = "varying vec3 vTdsW;\n" + shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      float s = fract(vTdsW.x * ${f} + vTdsW.z * ${g});
      diffuseColor.rgb *= s < 0.5 ? ${d} : 1.0;`,
    );
  };
  mat.customProgramCacheKey = () => key;
}

function groundMat(color: number, key?: string, freq?: number, dark?: number) {
  const m = new MeshLambertMaterial({ color });
  m.polygonOffset = true;
  m.polygonOffsetFactor = -2;
  m.polygonOffsetUnits = -4;
  if (key && freq) stripe(m, freq, key, dark);
  return m;
}

function pip(ring: Ring, x: number, z: number) {
  let c = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const yi = ring[i][1], yj = ring[j][1];
    if ((yi > z) !== (yj > z) && x < ((ring[j][0] - ring[i][0]) * (z - yi)) / (yj - yi) + ring[i][0]) c = !c;
  }
  return c;
}

function inside(p: Poly, x: number, z: number) {
  if (!pip(p.o, x, z)) return false;
  const holes = p.h || [];
  for (let i = 0; i < holes.length; i++) if (pip(holes[i], x, z)) return false;
  return true;
}

function bbox(ring: Ring) {
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  for (let i = 0; i < ring.length; i++) {
    const x = ring[i][0], z = ring[i][1];
    if (x < x0) x0 = x; if (x > x1) x1 = x; if (z < z0) z0 = z; if (z > z1) z1 = z;
  }
  return { x0, x1, z0, z1 };
}

function centroid(ring: Ring): [number, number] {
  let x = 0, z = 0;
  const n = Math.max(1, ring.length - (ring.length > 1 && ring[0][0] === ring[ring.length - 1][0] ? 1 : 0));
  for (let i = 0; i < n; i++) { x += ring[i][0]; z += ring[i][1]; }
  return [x / n, z / n];
}

function hullOf(ring: Ring): Ring {
  const pts = openRing(ring).map((p) => [p[0], p[1]] as [number, number]);
  pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: [number, number], a: [number, number], b: [number, number]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: [number, number][] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper: [number, number][] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  upper.pop();
  lower.pop();
  return lower.concat(upper);
}

function openRing(ring: Ring) {
  const p = ring.slice();
  if (p.length > 1 && Math.hypot(p[0][0] - p[p.length - 1][0], p[0][1] - p[p.length - 1][1]) < 0.2) p.pop();
  return p;
}

function signedArea(ring: Ring) {
  let a = 0;
  for (let i = 0; i < ring.length; i++) {
    const j = (i + 1) % ring.length;
    a += ring[i][0] * ring[j][1] - ring[j][0] * ring[i][1];
  }
  return a * 0.5;
}

export class TierraGolf {
  private world: World;
  private hAt: (x: number, z: number) => number;
  private group = new Group();
  private data: GolfData | null = null;
  private tiles: Tile[] = [];
  private mask = new Set<string>();
  private mats: Record<string, MeshLambertMaterial>;
  private flags: InstancedMesh;
  private poles: InstancedMesh;
  private palms: InstancedMesh;
  private flagN = 0;
  private palmN = 0;
  private flagAt: number[][] = [];
  private palmAt: number[][] = [];
  private extraPalms: number[][] = [];
  private extraI = 0;
  private propKey = "";
  private club: Group | null = null;
  private clubLo: Mesh | null = null;
  private m = new Matrix4();
  private q = new Quaternion();
  private v = new Vector3();
  constructor(private g: AGame) {
    const w = g.real as unknown as World;
    this.world = w;
    this.hAt = (x, z) => w.heightAt(x, z);
    this.group.name = "aw:tds";
    g.scene.add(this.group);
    this.mats = {
      fairway: groundMat(COL.fairway, "tds-fair", 0.09, 0.86),
      green: groundMat(COL.green, "tds-green", 0.22, 0.9),
      tee: groundMat(COL.tee),
      bunker: groundMat(COL.bunker),
      path: groundMat(COL.path),
      water: groundMat(COL.water),
      deck: groundMat(COL.deck),
      wall: new MeshLambertMaterial({ color: COL.wall, side: DoubleSide }),
      roof: new MeshLambertMaterial({ color: COL.roof }),
      fascia: new MeshLambertMaterial({ color: COL.roof, side: DoubleSide }),
      glass: new MeshLambertMaterial({ color: COL.glass }),
      trunk: new MeshLambertMaterial({ color: COL.trunk }),
      frond: new MeshLambertMaterial({ color: COL.frond }),
      pole: new MeshLambertMaterial({ color: COL.pole }),
      flag: new MeshLambertMaterial({ color: 0xffffff }),
      cloth: new MeshLambertMaterial({ color: COL.cloth }),
    };
    this.poles = this.blankInstances(this.poleGeo(), this.mats.pole, 24);
    this.flags = this.blankInstances(this.flagGeo(), this.mats.flag, 24);
    this.palms = this.blankInstances(this.palmGeo(), this.mats.frond, 40);
    // palm geo carries trunk via a second mesh sharing matrices — built in palmGeo as one colored mesh
    this.installVeg();
    void this.load();
  }

  pending() {
    if (!this.data) return 1;
    let n = 0;
    for (const t of this.tiles) if (!t.built && this.hasH(t.cx, t.cz)) n++;
    if (!this.club && this.hasH(this.data.anchor[0], this.data.anchor[1])) n++;
    return n;
  }

  frame() {
    const cam = this.g.camera.position;
    const ax = this.data ? this.data.anchor[0] : -7800;
    const az = this.data ? this.data.anchor[1] : -9500;
    const dx = cam.x - ax, dz = cam.z - az;
    const show = dx * dx + dz * dz < SHOW * SHOW;
    if (this.group.visible !== show) this.group.visible = show;
    if (!this.data || !show) return;
    this.buildSome();
    this.placeProps();
    this.lod(cam.x, cam.y, cam.z);
  }

  private installVeg() {
    const w = window as unknown as { __awVegHit?: (x: number, z: number, n?: string) => boolean };
    const prev = w.__awVegHit;
    const mask = this.mask;
    w.__awVegHit = (x, z, n) => {
      if (mask.has((Math.floor(x / CELL)) + "," + (Math.floor(z / CELL)))) return true;
      return prev ? prev(x, z, n) : false;
    };
  }

  private async load() {
    try {
      const res = await fetch("./data/real/tds_golf.json", { cache: "force-cache" });
      if (!res.ok) return;
      this.data = await res.json() as GolfData;
    } catch {
      return;
    }
    this.scanTiles();
    this.seedClubPalms();
    this.fillMask();
    this.hideClubFootprints();
    this.world.vegDirty = true;
  }

  private hasH(x: number, z: number) {
    const M = this.world.M;
    const rx = Math.floor((x - M.X0) / M.RS);
    const rz = Math.floor((z - M.Z0) / M.RS);
    const r = this.world.regions.get(rx + "," + rz);
    return !!(r && r.H);
  }

  private scanTiles() {
    const d = this.data!;
    const keys = new Set<string>();
    const add = (x: number, z: number) => {
      const ix = Math.floor(x / TILE), iz = Math.floor(z / TILE);
      keys.add(ix + "," + iz);
    };
    const mark = (p: Poly) => {
      const b = bbox(p.o);
      for (let x = Math.floor(b.x0 / TILE) * TILE; x <= b.x1; x += TILE)
        for (let z = Math.floor(b.z0 / TILE) * TILE; z <= b.z1; z += TILE) add(x + 1, z + 1);
    };
    d.fairways.forEach(mark); d.greens.forEach(mark); d.tees.forEach(mark);
    d.bunkers.forEach(mark); d.water.forEach(mark);
    for (const path of d.paths) for (const p of path) add(p[0], p[1]);
    for (const k of keys) {
      const [ix, iz] = k.split(",").map(Number);
      const hi = new Group(); const lo = new Group();
      hi.visible = false; lo.visible = false;
      hi.matrixAutoUpdate = false; lo.matrixAutoUpdate = false;
      this.group.add(hi, lo);
      this.tiles.push({ ix, iz, cx: ix * TILE + TILE / 2, cz: iz * TILE + TILE / 2, built: false, hi, lo, hiOn: false });
    }
  }

  private fillMask() {
    const d = this.data!;
    const mark = (p: Poly) => {
      const b = bbox(p.o);
      for (let x = Math.floor(b.x0 / CELL) * CELL; x <= b.x1; x += CELL) {
        for (let z = Math.floor(b.z0 / CELL) * CELL; z <= b.z1; z += CELL) {
          if (inside(p, x + CELL / 2, z + CELL / 2)) this.mask.add((Math.floor(x / CELL)) + "," + (Math.floor(z / CELL)));
        }
      }
    };
    d.fairways.forEach(mark); d.greens.forEach(mark); d.tees.forEach(mark);
    d.bunkers.forEach(mark); d.water.forEach(mark);
    for (const ring of d.club) mark({ o: ring });
    if (d.pool.length) mark({ o: d.pool });
    for (const path of d.paths) {
      for (let i = 1; i < path.length; i++) {
        const ax = path[i - 1][0], az = path[i - 1][1], bx = path[i][0], bz = path[i][1];
        const L = Math.hypot(bx - ax, bz - az);
        const n = Math.max(1, Math.ceil(L / 4));
        for (let k = 0; k <= n; k++) {
          const x = ax + (bx - ax) * k / n, z = az + (bz - az) * k / n;
          this.mask.add((Math.floor(x / CELL)) + "," + (Math.floor(z / CELL)));
        }
      }
    }
  }

  private seedClubPalms() {
    const d = this.data!;
    if (!d.club.length) return;
    const c = centroid(d.club[0]);
    const spots: number[][] = [];
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + 0.35;
      const rad = 36 + (i % 3) * 5;
      const x = c[0] + Math.cos(a) * rad;
      const z = c[1] + Math.sin(a) * rad * 0.82;
      if (d.club.some((r) => pip(r, x, z))) continue;
      if (d.pool.length > 3 && pip(d.pool, x, z)) continue;
      spots.push([x, z]);
    }
    this.extraPalms = spots;
  }

  private hideClubFootprints() {
    const hero = this.world.hero;
    if (!hero) return;
    for (const ring of this.data!.club) {
      hero.polys.push(ring);
      const c = centroid(ring);
      hero.pts.push(c);
    }
  }

  private buildSome() {
    let n = 0;
    for (const t of this.tiles) {
      if (t.built || !this.hasH(t.cx, t.cz)) continue;
      this.buildTile(t);
      if (++n >= 2) break;
    }
    if (!this.club && this.data && this.hasH(this.data.club[0]?.[0]?.[0] ?? this.data.anchor[0], this.data.club[0]?.[0]?.[1] ?? this.data.anchor[1])) {
      this.buildClub();
    }
  }

  private buildTile(t: Tile) {
    const d = this.data!;
    const x0 = t.ix * TILE, z0 = t.iz * TILE, x1 = x0 + TILE, z1 = z0 + TILE;
    const inTile = (x: number, z: number) => x >= x0 && x < x1 && z >= z0 && z < z1;
    this.addPolys(t.hi, d.fairways, HI, this.mats.fairway, inTile, () => 0.16);
    this.addPolys(t.lo, d.fairways, LO, this.mats.fairway, inTile, () => 0.42);
    this.addPolys(t.hi, d.greens, HI, this.mats.green, inTile, () => 0.28);
    this.addPolys(t.lo, d.greens, LO, this.mats.green, inTile, () => 0.5);
    this.addPolys(t.hi, d.tees, HI, this.mats.tee, inTile, () => 0.22);
    this.addPolys(t.hi, d.bunkers, 3, this.mats.bunker, inTile, (p, x, z) => this.bowl(p, x, z, 0.22, 0.42));
    this.addPolys(t.lo, d.bunkers, LO, this.mats.bunker, inTile, () => 0.55);
    this.addPolys(t.hi, d.water, HI, this.mats.water, inTile, (p, x, z) => this.flatWater(p, x, z));
    this.addPolys(t.lo, d.water, LO, this.mats.water, inTile, (p, x, z) => this.flatWater(p, x, z));
    this.addPaths(t.hi, d.paths, inTile);
    t.built = true;
    t.hi.visible = false;
    t.lo.visible = false;
  }

  private waterAbs = new Map<Poly, number>();

  /** Lift that puts every vertex on one flat water surface, in the low part of the pond. */
  private flatWater(p: Poly, x: number, z: number) {
    let y = this.waterAbs.get(p);
    if (y === undefined) {
      const b = bbox(p.o);
      const hs: number[] = [];
      for (let sx = b.x0; sx <= b.x1; sx += 8) for (let sz = b.z0; sz <= b.z1; sz += 8) {
        if (!inside(p, sx, sz)) continue;
        const h = this.hAt(sx, sz);
        if (Number.isFinite(h)) hs.push(h);
      }
      if (!hs.length) y = this.hAt(x, z) + 0.12;
      else { hs.sort((a, c) => a - c); y = hs[Math.min(hs.length - 1, Math.floor(hs.length * 0.25))] + 0.1; }
      this.waterAbs.set(p, y);
    }
    return y - this.hAt(x, z);
  }

  private bowl(p: Poly, x: number, z: number, mid: number, rim: number) {
    const c = centroid(p.o);
    let rad = 4;
    for (const q of p.o) rad = Math.max(rad, Math.hypot(q[0] - c[0], q[1] - c[1]));
    const t = Math.min(1, Math.hypot(x - c[0], z - c[1]) / rad);
    return mid + t * t * (rim - mid);
  }

  private addPolys(parent: Group, polys: Poly[], step: number, mat: MeshLambertMaterial, inTile: (x: number, z: number) => boolean, lift: (p: Poly, x: number, z: number) => number) {
    const pos: number[] = [], nor: number[] = [], idx: number[] = [];
    const vert = new Map<string, number>();
    const hAt = this.hAt;
    const vid = (x: number, z: number, yLift: number) => {
      const k = x.toFixed(2) + "," + z.toFixed(2) + "," + yLift.toFixed(3);
      const hit = vert.get(k);
      if (hit !== undefined) return hit;
      const y = hAt(x, z) + yLift;
      const i = pos.length / 3;
      pos.push(x, Number.isFinite(y) ? y : 0, z);
      const s = 4, dx = hAt(x + s, z) - hAt(x - s, z), dz = hAt(x, z + s) - hAt(x, z - s);
      const q = Math.hypot(dx, 8, dz) || 1;
      nor.push(-dx / q, 8 / q, -dz / q);
      vert.set(k, i);
      return i;
    };
    for (const p of polys) {
      const b = bbox(p.o);
      const xa = Math.floor(b.x0 / step) * step, xb = Math.ceil(b.x1 / step) * step;
      const za = Math.floor(b.z0 / step) * step, zb = Math.ceil(b.z1 / step) * step;
      for (let x = xa; x < xb; x += step) for (let z = za; z < zb; z += step) {
        const cx = x + step * 0.5, cz = z + step * 0.5;
        if (!inTile(cx, cz) || !inside(p, cx, cz)) continue;
        const a = vid(x, z, lift(p, x, z)), c = vid(x, z + step, lift(p, x, z + step));
        const e = vid(x + step, z, lift(p, x + step, z)), f = vid(x + step, z + step, lift(p, x + step, z + step));
        idx.push(a, c, e, e, c, f);
      }
    }
    if (!idx.length) return;
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new Float32BufferAttribute(nor, 3));
    g.setIndex(idx);
    g.computeBoundingSphere();
    const mesh = new Mesh(g, mat);
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = true;
    mesh.name = "aw:tds:ground";
    parent.add(mesh);
  }

  private addPaths(parent: Group, paths: Ring[], inTile: (x: number, z: number) => boolean) {
    const pos: number[] = [], nor: number[] = [], idx: number[] = [];
    const hAt = this.hAt;
    const half = 1.35, lift = 0.34;
    for (const path of paths) {
      const pts: number[][] = [];
      for (let i = 1; i < path.length; i++) {
        const ax = path[i - 1][0], az = path[i - 1][1], bx = path[i][0], bz = path[i][1];
        const L = Math.hypot(bx - ax, bz - az);
        const n = Math.max(1, Math.ceil(L / 4));
        for (let k = 0; k < n; k++) pts.push([ax + (bx - ax) * k / n, az + (bz - az) * k / n]);
      }
      pts.push(path[path.length - 1]);
      let prev: number[] | null = null;
      for (let i = 0; i < pts.length; i++) {
        const p = pts[i], q = pts[Math.min(pts.length - 1, i + 1)], r = pts[Math.max(0, i - 1)];
        const dx = q[0] - r[0], dz = q[1] - r[1];
        const L = Math.hypot(dx, dz) || 1;
        const nx = -dz / L * half, nz = dx / L * half;
        const y = hAt(p[0], p[1]) + lift;
        const base = pos.length / 3;
        const s = 4, dhx = hAt(p[0] + s, p[1]) - hAt(p[0] - s, p[1]), dhz = hAt(p[0], p[1] + s) - hAt(p[0], p[1] - s);
        const qq = Math.hypot(dhx, 8, dhz) || 1;
        const ny = [-dhx / qq, 8 / qq, -dhz / qq];
        pos.push(p[0] - nx, y, p[1] - nz, p[0] + nx, y, p[1] + nz);
        nor.push(ny[0], ny[1], ny[2], ny[0], ny[1], ny[2]);
        if (prev && inTile((p[0] + prev[0]) * 0.5, (p[1] + prev[1]) * 0.5)) {
          const a = prev[2], b = a + 1, c = base, d = base + 1;
          idx.push(a, c, b, b, c, d);
        }
        prev = [p[0], p[1], base];
      }
    }
    if (!idx.length) return;
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new Float32BufferAttribute(nor, 3));
    g.setIndex(idx);
    g.computeBoundingSphere();
    const mesh = new Mesh(g, this.mats.path);
    mesh.receiveShadow = true;
    this.mats.path.side = DoubleSide;
    mesh.matrixAutoUpdate = false;
    mesh.name = "aw:tds:path";
    parent.add(mesh);
  }

  private buildClub() {
    const d = this.data!;
    const hi = new Group();
    hi.name = "aw:tds:club";
    for (const ring of d.club) this.extrude(hi, ring, ring === d.club[0] ? 5.4 : 3.6);
    this.tower(hi, d.club[0]);
    if (d.pool.length > 3) this.pool(hi, d.pool);
    hi.traverse((o) => { const m = o as Mesh; if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; m.matrixAutoUpdate = false; } });
    const c = centroid(d.club[0]);
    const y = this.hAt(c[0], c[1]);
    const box = new Mesh(new BoxGeometry(28, 5, 16), this.mats.wall);
    box.position.set(c[0], y + 2.6, c[1]);
    box.matrixAutoUpdate = false;
    box.updateMatrix();
    box.name = "aw:tds:clublo";
    this.group.add(hi, box);
    this.club = hi;
    this.clubLo = box;
  }

  /** Square campanile, the cream tower with a clay-tile cap in the ground photos. */
  private tower(parent: Group, ringIn: Ring) {
    const ring = openRing(ringIn);
    if (ring.length < 3) return;
    const c = centroid(ring);
    let p = ring[0];
    for (const q of ring) if (q[0] < p[0]) p = q;
    const x = p[0] * 0.35 + c[0] * 0.65;
    const z = p[1] * 0.35 + c[1] * 0.65;
    const ground = this.hAt(x, z);
    if (!Number.isFinite(ground)) return;
    const base = ground - 0.2;
    const wallTop = ground + 11.2;
    const s = 6.4;
    const box = new BoxGeometry(s, wallTop - base, s);
    box.translate(x, (base + wallTop) / 2, z);
    parent.add(new Mesh(box, this.mats.wall));
    const peak = wallTop + 2.6;
    const o = s / 2 + 0.45;
    const rp = [x, peak, z, x - o, wallTop, z - o, x + o, wallTop, z - o, x + o, wallTop, z + o, x - o, wallTop, z + o];
    const rg = new BufferGeometry();
    rg.setAttribute("position", new Float32BufferAttribute(rp, 3));
    rg.setIndex([0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 1]);
    rg.computeVertexNormals();
    parent.add(new Mesh(rg, this.mats.fascia));
    const slits: number[] = [];
    const openings: [number, number, number, number][] = [
      [x - s / 2 - 0.05, z, 0, 1],
      [x, z - s / 2 - 0.05, 1, 0],
    ];
    for (const [ox, oz, ax, az] of openings) {
      const hw = 0.55, y0 = wallTop - 3.4, y1 = wallTop - 0.9;
      const quad = [
        [ox - ax * hw, y0, oz - az * hw],
        [ox + ax * hw, y0, oz + az * hw],
        [ox + ax * hw, y1, oz + az * hw],
        [ox - ax * hw, y1, oz - az * hw],
      ];
      for (const tri of [0, 1, 2, 0, 2, 3]) slits.push(quad[tri][0], quad[tri][1], quad[tri][2]);
    }
    const sg = new BufferGeometry();
    sg.setAttribute("position", new Float32BufferAttribute(slits, 3));
    sg.computeVertexNormals();
    parent.add(new Mesh(sg, this.mats.glass));
  }

  private extrude(parent: Group, ringIn: Ring, wallH: number) {
    const ring = openRing(ringIn);
    if (ring.length < 3) return;
    const ys = ring.map(([x, z]) => this.hAt(x, z)).filter((y) => Number.isFinite(y));
    if (!ys.length) return;
    const base = Math.min(...ys) - 0.25;
    const eave = Math.max(...ys) + wallH;
    const c = centroid(ring);
    const crown = eave + (wallH > 4 ? 2.1 : 1.1);
    const pos: number[] = [], idx: number[] = [], win: number[] = [], fascia: number[] = [];
    const push = (x: number, y: number, z: number) => { pos.push(x, y, z); return pos.length / 3 - 1; };
    // OSM rings come in CCW lon/lat; flipping lat makes them CW here. Outward is the left normal of a CW edge.
    const ccw = signedArea(ring) > 0;
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length];
      const i0 = push(a[0], base, a[1]), i1 = push(b[0], base, b[1]);
      const i2 = push(b[0], eave, b[1]), i3 = push(a[0], eave, a[1]);
      idx.push(i0, i1, i2, i0, i2, i3);
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (len < 3.2) continue;
      const dx = (b[0] - a[0]) / len, dz = (b[1] - a[1]) / len;
      const nx = (ccw ? dz : -dz), nz = (ccw ? -dx : dx);
      const fasciaH = 0.55;
      const fq = [
        [a[0] + nx * 0.22, eave - fasciaH, a[1] + nz * 0.22],
        [b[0] + nx * 0.22, eave - fasciaH, b[1] + nz * 0.22],
        [b[0] + nx * 0.22, eave + 0.08, b[1] + nz * 0.22],
        [a[0] + nx * 0.22, eave + 0.08, a[1] + nz * 0.22],
      ];
      for (const tri of [0, 1, 2, 0, 2, 3]) fascia.push(fq[tri][0], fq[tri][1], fq[tri][2]);
      const gap = 4.6;
      const nWin = Math.max(1, Math.floor(len / gap));
      const ww = Math.min(1.35, len / (nWin + 0.6) * 0.42);
      for (let k = 0; k < nWin; k++) {
        const t = (k + 0.5) / nWin;
        const mx = a[0] + (b[0] - a[0]) * t, mz = a[1] + (b[1] - a[1]) * t;
        const wy = eave - 2.35, wh = wallH > 4 ? 1.45 : 1.15;
        const quad = [
          [mx - dx * ww + nx * 0.16, wy, mz - dz * ww + nz * 0.16],
          [mx + dx * ww + nx * 0.16, wy, mz + dz * ww + nz * 0.16],
          [mx + dx * ww + nx * 0.16, wy + wh, mz + dz * ww + nz * 0.16],
          [mx - dx * ww + nx * 0.16, wy + wh, mz - dz * ww + nz * 0.16],
        ];
        for (const tri of [0, 1, 2, 0, 2, 3]) win.push(quad[tri][0], quad[tri][1], quad[tri][2]);
      }
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    g.computeBoundingSphere();
    parent.add(new Mesh(g, this.mats.wall));
    if (win.length) {
      const wg = new BufferGeometry();
      wg.setAttribute("position", new Float32BufferAttribute(win, 3));
      wg.computeVertexNormals();
      parent.add(new Mesh(wg, this.mats.glass));
    }
    if (fascia.length) {
      const fg = new BufferGeometry();
      fg.setAttribute("position", new Float32BufferAttribute(fascia, 3));
      fg.computeVertexNormals();
      parent.add(new Mesh(fg, this.mats.fascia));
    }
    // Hip over the convex hull so a concave footprint doesn't throw roof triangles
    // out across the desert. Winding is forced to face up; the underside is not drawn.
    const hull = hullOf(ring);
    const rp: number[] = [], ri: number[] = [];
    rp.push(c[0], crown, c[1]);
    for (const p of hull) {
      const dx = p[0] - c[0], dz = p[1] - c[1], L = Math.hypot(dx, dz) || 1;
      rp.push(p[0] + dx / L * 0.8, eave + 0.06, p[1] + dz / L * 0.8);
    }
    for (let i = 0; i < hull.length; i++) ri.push(0, 1 + i, 1 + ((i + 1) % hull.length));
    const ax = rp[ri[0] * 3], ay = rp[ri[0] * 3 + 1], az = rp[ri[0] * 3 + 2];
    const bx = rp[ri[1] * 3], by = rp[ri[1] * 3 + 1], bz = rp[ri[1] * 3 + 2];
    const cx = rp[ri[2] * 3], cy = rp[ri[2] * 3 + 1], cz = rp[ri[2] * 3 + 2];
    const ny = (bz - az) * (cx - ax) - (bx - ax) * (cz - az);
    if (ny < 0) for (let i = 0; i < ri.length; i += 3) { const s = ri[i + 1]; ri[i + 1] = ri[i + 2]; ri[i + 2] = s; }
    const rg = new BufferGeometry();
    rg.setAttribute("position", new Float32BufferAttribute(rp, 3));
    rg.setIndex(ri);
    rg.computeVertexNormals();
    rg.computeBoundingSphere();
    parent.add(new Mesh(rg, this.mats.roof));
  }

  private pool(parent: Group, ringIn: Ring) {
    const ring = openRing(ringIn);
    const ys = ring.map(([x, z]) => this.hAt(x, z)).filter((y) => Number.isFinite(y));
    const low = Math.min(...ys);
    const waterY = low + 0.14;
    const deckY = low + 0.22;
    const outward = signedArea(ring) > 0 ? 1 : -1;
    const outer: Ring = [];
    const n = ring.length;
    for (let i = 0; i < n; i++) {
      const p0 = ring[(i + n - 1) % n], p1 = ring[i], p2 = ring[(i + 1) % n];
      const ax = p1[0] - p0[0], az = p1[1] - p0[1], bx = p2[0] - p1[0], bz = p2[1] - p1[1];
      const al = Math.hypot(ax, az) || 1, bl = Math.hypot(bx, bz) || 1;
      let nx = az / al + bz / bl, nz = -ax / al + -bz / bl;
      const nl = Math.hypot(nx, nz) || 1;
      nx = nx / nl * 2.2 * outward; nz = nz / nl * 2.2 * outward;
      outer.push([p1[0] + nx, p1[1] + nz]);
    }
    // deck ring
    const pos: number[] = [], idx: number[] = [];
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const b = pos.length / 3;
      pos.push(ring[i][0], deckY, ring[i][1], ring[j][0], deckY, ring[j][1], outer[j][0], deckY, outer[j][1], outer[i][0], deckY, outer[i][1]);
      idx.push(b, b + 1, b + 2, b, b + 2, b + 3);
    }
    const deck = new BufferGeometry();
    deck.setAttribute("position", new Float32BufferAttribute(pos, 3));
    deck.setIndex(idx);
    deck.computeVertexNormals();
    deck.computeBoundingSphere();
    parent.add(new Mesh(deck, this.mats.deck));
    // water, gridded
    this.addPolys(parent, [{ o: ring }], 2, this.mats.water, () => true, (_p, x, z) => waterY - this.hAt(x, z));
    // a handful of loungers on the deck, instanced via one merged mesh
    const lounge = new BoxGeometry(0.7, 0.18, 1.9);
    const lp: number[] = [];
    const step = Math.max(1, Math.floor(n / 6));
    for (let i = 0, placed = 0; i < n && placed < 6; i += step, placed++) {
      const x = ring[i][0] * 0.35 + outer[i][0] * 0.65;
      const z = ring[i][1] * 0.35 + outer[i][1] * 0.65;
      const a = Math.atan2(outer[i][0] - ring[i][0], outer[i][1] - ring[i][1]);
      const g = lounge.clone();
      g.rotateY(a);
      g.translate(x, deckY + 0.2, z);
      const arr = g.attributes.position.array as Float32Array;
      for (let k = 0; k < arr.length; k++) lp.push(arr[k]);
      g.dispose();
    }
    const lg = new BufferGeometry();
    lg.setAttribute("position", new Float32BufferAttribute(lp, 3));
    lg.computeVertexNormals();
    parent.add(new Mesh(lg, this.mats.cloth));
  }

  private placeProps() {
    const d = this.data!;
    let changed = false;
    while (this.flagN < d.flags.length) {
      const p = d.flags[this.flagN];
      if (!this.hasH(p[0], p[1])) break;
      const y = this.hAt(p[0], p[1]) + 0.28;
      this.setInst(this.poles, this.flagN, p[0], y, p[1], 0, 1);
      this.setInst(this.flags, this.flagN, p[0], y, p[1], 0, 1);
      const col = new Color([0xd22b2b, 0xf2d23a, 0x2a6fdb, 0xf7f7f7, 0xe07a2f][this.flagN % 5]);
      this.flags.setColorAt(this.flagN, col);
      this.flagAt.push([p[0], p[1]]);
      this.flagN++;
      changed = true;
    }
    while (this.palmN < d.palms.length) {
      const p = d.palms[this.palmN];
      if (!this.hasH(p[0], p[1])) break;
      const y = this.hAt(p[0], p[1]);
      const sc = 1.9 + ((Math.abs(Math.sin(p[0] * 0.17 + p[1])) * 0.7));
      this.setInst(this.palms, this.palmN, p[0], y, p[1], p[0] * 0.3, sc, -0.2);
      this.palmAt.push([p[0], p[1], sc, -0.2]);
      this.palmN++;
      changed = true;
    }
    while (this.extraI < this.extraPalms.length && this.palmN < 36) {
      const p = this.extraPalms[this.extraI];
      if (!this.hasH(p[0], p[1])) break;
      const sc = 2.05 + (this.extraI % 4) * 0.15;
      const lean = -0.18 - (this.extraI % 4) * 0.04;
      this.setInst(this.palms, this.palmN, p[0], this.hAt(p[0], p[1]), p[1], p[0] * 0.2, sc, lean);
      this.palmAt.push([p[0], p[1], sc, lean]);
      this.palmN++;
      this.extraI++;
      changed = true;
    }
    if (changed) {
      this.poles.count = this.flagN; this.flags.count = this.flagN; this.palms.count = this.palmN;
      this.poles.instanceMatrix.needsUpdate = true;
      this.flags.instanceMatrix.needsUpdate = true;
      if (this.flags.instanceColor) this.flags.instanceColor.needsUpdate = true;
      this.palms.instanceMatrix.needsUpdate = true;
    }
  }

  private setInst(mesh: InstancedMesh, i: number, x: number, y: number, z: number, yaw: number, s: number, lean = 0) {
    this.v.set(x, y, z);
    this.q.setFromAxisAngle(this.up, yaw);
    if (lean) {
      // Stored lean is negative. A positive rotation about +Z tips the crown toward -X (west).
      this.leanQ.setFromAxisAngle(this.west, -lean);
      this.q.premultiply(this.leanQ);
    }
    this.scale.set(s, s, s);
    this.m.compose(this.v, this.q, this.scale);
    mesh.setMatrixAt(i, this.m);
  }

  private leanQ = new Quaternion();
  private west = new Vector3(0, 0, 1);

  private up = new Vector3(0, 1, 0);
  private scale = new Vector3();

  private lod(cx: number, cy: number, cz: number) {
    const lim = LOD * LOD;
    for (const t of this.tiles) {
      if (!t.built) continue;
      const hi = (cx - t.cx) ** 2 + (cz - t.cz) ** 2 < lim;
      // Always write it. A tile built while the camera is already inside the
      // LOD radius used to stay hidden, because hiOn started matching `hi`.
      t.hi.visible = hi;
      t.lo.visible = !hi;
      t.hiOn = hi;
    }
    if (this.club && this.clubLo && this.data) {
      const c = centroid(this.data.club[0]);
      const near = (cx - c[0]) ** 2 + (cz - c[1]) ** 2 < 600 * 600;
      this.club.visible = near;
      this.clubLo.visible = !near;
    }
    const key = (cx * 0.02 | 0) + "," + (cz * 0.02 | 0) + "," + (cy * 0.02 | 0);
    if (key === this.propKey) return;
    this.propKey = key;
    const eye = cy;
    for (let i = 0; i < this.flagN; i++) {
      const p = this.flagAt[i];
      const d2 = (cx - p[0]) ** 2 + (cz - p[1]) ** 2;
      const s = d2 < lim && eye < 420 ? 1 : 0;
      this.setInst(this.poles, i, p[0], this.hAt(p[0], p[1]) + 0.28, p[1], 0, s);
      this.setInst(this.flags, i, p[0], this.hAt(p[0], p[1]) + 0.28, p[1], 0, s);
    }
    for (let i = 0; i < this.palmN; i++) {
      const p = this.palmAt[i];
      const d2 = (cx - p[0]) ** 2 + (cz - p[1]) ** 2;
      const s = d2 < (LOD + 80) * (LOD + 80) && eye < 480 ? p[2] : 0;
      this.setInst(this.palms, i, p[0], this.hAt(p[0], p[1]), p[1], p[0] * 0.3, s, p[3] || 0);
    }
    if (this.flagN) {
      this.poles.instanceMatrix.needsUpdate = true;
      this.flags.instanceMatrix.needsUpdate = true;
    }
    if (this.palmN) this.palms.instanceMatrix.needsUpdate = true;
  }

  private blankInstances(geo: BufferGeometry, mat: MeshLambertMaterial, n: number) {
    const mesh = new InstancedMesh(geo, mat, n);
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.name = "aw:tds:inst";
    this.group.add(mesh);
    return mesh;
  }

  private poleGeo() {
    const g = new CylinderGeometry(0.035, 0.045, 2.5, 5);
    g.translate(0, 1.25, 0);
    return g;
  }

  private flagGeo() {
    // pennant flying west (-X), trade wind
    const pos = [
      0, 2.5, 0, -1.15, 2.18, 0, -0.95, 2.58, 0.03,
      0, 2.5, 0, -0.95, 2.58, -0.03, -1.15, 2.18, 0,
    ];
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();
    return g;
  }

  private palmGeo() {
    const parts: BufferGeometry[] = [];
    const trunk = new CylinderGeometry(0.16, 0.28, 5.4, 6);
    trunk.translate(0, 2.7, 0);
    this.paint(trunk, COL.trunk);
    parts.push(trunk);
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 + (i % 2) * 0.2;
      const fr = new BoxGeometry(0.28, 0.06, 2.5);
      fr.translate(0, 0, 1.2);
      fr.rotateX(0.55 + (i % 3) * 0.08);
      fr.rotateY(a);
      fr.translate(0, 5.35, 0);
      this.paint(fr, i % 2 ? 0x218a3a : 0x17662c);
      parts.push(fr);
    }
    // merge manually so vertex colors survive (mergeGeometries keeps color if every geo has it)
    const pos: number[] = [], col: number[] = [], nor: number[] = [];
    for (const p of parts) {
      const pa = p.attributes.position.array as Float32Array;
      const ca = p.attributes.color.array as Float32Array;
      const na = p.attributes.normal.array as Float32Array;
      for (let i = 0; i < pa.length; i++) { pos.push(pa[i]); nor.push(na[i]); }
      for (let i = 0; i < ca.length; i++) col.push(ca[i]);
      p.dispose();
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new Float32BufferAttribute(nor, 3));
    g.setAttribute("color", new Float32BufferAttribute(col, 3));
    g.computeBoundingSphere();
    this.mats.frond.vertexColors = true;
    this.mats.frond.color.set(0xffffff);
    return g;
  }

  private paint(g: BufferGeometry, hex: number) {
    const c = new Color(hex);
    const n = g.attributes.position.count;
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { arr[i * 3] = c.r; arr[i * 3 + 1] = c.g; arr[i * 3 + 2] = c.b; }
    g.setAttribute("color", new Float32BufferAttribute(arr, 3));
  }
}
