// Tierra del Sol, the Robert Trent Jones II course beside the California Lighthouse.
// Layout is OSM (relation 14139348). Northern fairways are ribbons offset from the
// mapped cart paths. Ground photos set the turf, the white bunkers, the dry 15th,
// and the cream-and-clay clubhouse. Nothing here is an aerial texture.
//
// Phone soak: every static surface is one mesh per material, allocated once at
// load and filled in place as terrain regions stream. Cacti, rocks, palms, flags,
// carts and golfers are instanced. No geometry is created or disposed per frame.
// ?golf=0 turns it off.
import {
  BoxGeometry, BufferAttribute, BufferGeometry, Color, CylinderGeometry, DoubleSide,
  DynamicDrawUsage, Float32BufferAttribute, Group, InstancedMesh, Matrix4,
  Mesh, MeshLambertMaterial, Quaternion, SphereGeometry, Vector3,
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
type Job = { key: string; ids: number[]; at: number };
type Sheet = {
  mesh: Mesh;
  corn: Float32Array;
  nq: number;
  jobs: Job[];
  water: boolean;
  polys: Poly[] | null;
  waterY: Map<number, number>;
  polyOf: Uint16Array | null;
  pos: Float32Array;
  nor: Float32Array;
  idx: Uint32Array;
  vUsed: number;
  iUsed: number;
  upV: number;
  upI: number;
  dirty: boolean;
  done: boolean;
};
type Route = { x: Float32Array; z: Float32Array; cum: Float32Array; len: number };
type Spot = { x: number; z: number; sc: number; yaw: number; kind: "cactus" | "rock" | "palm"; lean: number };

const SHOW = 3200;
const CELL = 8;
const COL = {
  fairway: 0x3f8c38, green: 0x86c652, tee: 0x2f8a38, bunker: 0xf4f0e4,
  path: 0xb7b3a8, water: 0x1e7384, deck: 0xe4d5bf, wall: 0xf3efe4,
  roof: 0xb8432c, glass: 0x243646, cloth: 0xf7f4ee,
};
const SHIRTS = [0xf7f7f4, 0xd24b4b, 0x2f6fbe, 0xf2d15a, 0xf7f7f4];
const SHORTS = [0x1c2740, 0x3a342c, 0x1c2740, 0x243044, 0x2a3144];
const SKINS = [0xd59a72, 0xb97954, 0xedc29e, 0x8d5340, 0xc4845c];

function stripe(mat: MeshLambertMaterial, freq: number, key: string, dark: number) {
  mat.onBeforeCompile = (shader) => {
    shader.vertexShader = "varying vec3 vTdsW;\n" + shader.vertexShader.replace(
      "#include <project_vertex>",
      "#include <project_vertex>\n\tvTdsW = (modelMatrix * vec4(transformed, 1.0)).xyz;",
    );
    shader.fragmentShader = "varying vec3 vTdsW;\n" + shader.fragmentShader.replace(
      "#include <color_fragment>",
      `#include <color_fragment>
      float s = fract(vTdsW.x * ${freq.toFixed(4)} + vTdsW.z * ${(freq * 0.37).toFixed(4)});
      diffuseColor.rgb *= s < 0.5 ? ${dark.toFixed(3)} : 1.0;`,
    );
  };
  mat.customProgramCacheKey = () => key;
}

function groundMat(color: number, key?: string, freq?: number, dark?: number) {
  const m = new MeshLambertMaterial({ color });
  m.polygonOffset = true;
  m.polygonOffsetFactor = -2;
  m.polygonOffsetUnits = -4;
  if (key && freq && dark) stripe(m, freq, key, dark);
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
  upper.pop(); lower.pop();
  return lower.concat(upper);
}

function rgb(hex: number): [number, number, number] {
  return [(hex >> 16) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255];
}

export class TierraGolf {
  private world: World;
  private hAt: (x: number, z: number) => number;
  private group = new Group();
  private data: GolfData | null = null;
  private low: boolean;
  private sheets: Sheet[] = [];
  private mask = new Set<string>();
  private mats: Record<string, MeshLambertMaterial>;
  private poles: InstancedMesh;
  private flags: InstancedMesh;
  private palms: InstancedMesh;
  private cacti: InstancedMesh;
  private rocks: InstancedMesh;
  private cartBody: InstancedMesh;
  private cartRoof: InstancedMesh;
  private cartWheel: InstancedMesh;
  private gHead: InstancedMesh;
  private gTorso: InstancedMesh;
  private gLegs: InstancedMesh;
  private gArms: InstancedMesh;
  private gClub: InstancedMesh;
  private spots: Spot[] = [];
  private spotN = 0;
  private flagAt: number[][] = [];
  private flagN = 0;
  private routes: Route[] = [];
  private carts: { route: number; dist: number; speed: number }[] = [];
  private golfers: { walk: boolean; route: number; dist: number; speed: number; x: number; z: number; yaw: number; phase: number }[] = [];
  private clubMesh: Mesh | null = null;
  private clubPos: Float32Array | null = null;
  private clubCol: Float32Array | null = null;
  private clubIdx: Uint32Array | null = null;
  private clubX = 0;
  private clubZ = 0;
  private clubDone = false;
  private propKey = "";
  private actorsOn = false;
  private warm = 0;
  private t = 0;
  private last = 0;
  private m = new Matrix4();
  private q = new Quaternion();
  private leanQ = new Quaternion();
  private v = new Vector3();
  private up = new Vector3(0, 1, 0);
  private axisX = new Vector3(1, 0, 0);
  private west = new Vector3(0, 0, 1);
  private scale = new Vector3();

  constructor(private g: AGame) {
    const w = g.real as unknown as World;
    this.world = w;
    this.hAt = (x, z) => w.heightAt(x, z);
    this.low = g.real?.q.name === "low";
    this.group.name = "aw:tds";
    g.scene.add(this.group);
    this.mats = {
      fairway: groundMat(COL.fairway, "tds-fair", 0.09, 0.86),
      green: groundMat(COL.green, "tds-green", 0.22, 0.9),
      tee: groundMat(COL.tee),
      bunker: groundMat(COL.bunker),
      path: groundMat(COL.path),
      water: groundMat(COL.water),
      club: new MeshLambertMaterial({ color: 0xffffff, vertexColors: true, side: DoubleSide }),
      palm: new MeshLambertMaterial({ color: 0xffffff, vertexColors: true }),
      cactus: new MeshLambertMaterial({ color: 0xffffff, vertexColors: true }),
      rock: new MeshLambertMaterial({ color: 0xffffff, vertexColors: true }),
      pole: new MeshLambertMaterial({ color: 0xe8e6e0 }),
      flag: new MeshLambertMaterial({ color: 0xffffff }),
      cart: new MeshLambertMaterial({ color: 0xf4f1ea }),
      roof: new MeshLambertMaterial({ color: 0x2a2724 }),
      tire: new MeshLambertMaterial({ color: 0x1a1a1a }),
      skin: new MeshLambertMaterial({ color: 0xffffff }),
      shirt: new MeshLambertMaterial({ color: 0xffffff }),
      shorts: new MeshLambertMaterial({ color: 0xffffff }),
      clubShaft: new MeshLambertMaterial({ color: 0x222222 }),
    };
    this.mats.path.side = DoubleSide;
    const dyn = (mesh: InstancedMesh) => { mesh.instanceMatrix.setUsage(DynamicDrawUsage); return mesh; };
    this.poles = this.blank(this.poleGeo(), this.mats.pole, 24);
    this.flags = this.blank(this.flagGeo(), this.mats.flag, 24);
    this.palms = this.blank(this.palmGeo(), this.mats.palm, 40);
    this.cacti = this.blank(this.cactusGeo(), this.mats.cactus, 48);
    this.rocks = this.blank(this.rockGeo(), this.mats.rock, 32);
    this.cartBody = dyn(this.blank(this.cartBodyGeo(), this.mats.cart, 4));
    this.cartRoof = dyn(this.blank(this.cartRoofGeo(), this.mats.roof, 4));
    this.cartWheel = dyn(this.blank(this.wheelGeo(), this.mats.tire, 16));
    this.gHead = dyn(this.blank(new SphereGeometry(0.16, 6, 5).translate(0, 1.62, 0), this.mats.skin, 5));
    this.gTorso = dyn(this.blank(new BoxGeometry(0.4, 0.46, 0.22).translate(0, 1.22, 0), this.mats.shirt, 5));
    this.gLegs = dyn(this.blank(new BoxGeometry(0.14, 0.5, 0.16), this.mats.shorts, 10));
    this.gArms = dyn(this.blank(new BoxGeometry(0.09, 0.4, 0.09), this.mats.skin, 10));
    this.gClub = dyn(this.blank(this.clubGeo(), this.mats.clubShaft, 5));
    this.installVeg();
    void this.load();
  }

  pending() {
    if (!this.data) return 1;
    let n = 0;
    for (const sh of this.sheets) for (const job of sh.jobs) {
      if (job.at < job.ids.length && this.hasKey(job.key)) n++;
    }
    if (!this.clubDone && this.hasH(this.clubX, this.clubZ)) n++;
    return n;
  }

  frame() {
    const now = performance.now();
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0;
    this.last = now;
    this.t += dt;
    if (!this.data) return;
    this.pump();
    this.fillClub();
    this.placeStatic();
    const cam = this.g.camera.position;
    const ax = this.data.anchor[0], az = this.data.anchor[1];
    const show = (cam.x - ax) ** 2 + (cam.z - az) ** 2 < SHOW * SHOW;
    if (this.warm > 0) {
      this.warm--;
      this.group.visible = true;
      this.group.traverse((o) => { o.frustumCulled = false; });
      if (this.warm === 0) {
        this.group.traverse((o) => {
          const m = o as Mesh;
          if (m.isMesh) m.frustumCulled = !(m as InstancedMesh).isInstancedMesh;
        });
      }
    } else if (this.group.visible !== show) {
      this.group.visible = show;
    }
    if (!show) {
      if (this.actorsOn) this.hideActors();
      return;
    }
    this.animate(dt, cam.x, cam.y, cam.z);
    const key = (cam.x * 0.02 | 0) + "," + (cam.z * 0.02 | 0) + "," + (cam.y > 480 ? 1 : 0);
    if (key !== this.propKey) { this.propKey = key; this.cullProps(cam.x, cam.y, cam.z); }
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
    const d = this.data;
    const fairL = this.low ? 0.38 : 0.16;
    const greenL = this.low ? 0.5 : 0.28;
    const teeL = this.low ? 0.44 : 0.22;
    const stepF = this.low ? 16 : 4;
    const stepG = this.low ? 12 : 4;
    const stepB = this.low ? 8 : 3;
    this.addSheet("fairway", this.mats.fairway, d.fairways, stepF, () => fairL, false);
    this.addSheet("green", this.mats.green, d.greens, stepG, () => greenL, false);
    this.addSheet("tee", this.mats.tee, d.tees, this.low ? 14 : 4, () => teeL, false);
    this.addSheet("bunker", this.mats.bunker, d.bunkers, stepB, (p, x, z) => this.bowl(p, x, z), false);
    this.addSheet("water", this.mats.water, d.water, this.low ? 12 : 6, () => 0, true);
    this.addPaths();
    this.prepClub();
    this.scatter();
    this.buildRoutes();
    this.fillMask();
    this.hideClubFootprints();
    this.world.vegDirty = true;
    this.warm = 4;
  }

  private addSheet(name: string, mat: MeshLambertMaterial, polys: Poly[], step: number, liftOf: (p: Poly, x: number, z: number) => number, water: boolean) {
    const built = this.raster(polys, step, liftOf, water);
    if (!built.nq) return;
    this.sheets.push(this.sheet(name, mat, built.corn, built.nq, built.jobs, water, water ? polys : null, built.polyOf));
  }

  private raster(polys: Poly[], step: number, liftOf: (p: Poly, x: number, z: number) => number, water: boolean) {
    const corners: number[] = [];
    const keys: string[] = [];
    const polysI: number[] = [];
    for (let pi = 0; pi < polys.length; pi++) {
      const p = polys[pi];
      const b = bbox(p.o);
      const xa = Math.floor(b.x0 / step) * step, xb = Math.ceil(b.x1 / step) * step;
      const za = Math.floor(b.z0 / step) * step, zb = Math.ceil(b.z1 / step) * step;
      for (let x = xa; x < xb; x += step) for (let z = za; z < zb; z += step) {
        if (!inside(p, x + step * 0.5, z + step * 0.5)) continue;
        const pts: [number, number][] = [[x, z], [x, z + step], [x + step, z], [x + step, z + step]];
        for (const [px, pz] of pts) corners.push(px, pz, water ? 0 : liftOf(p, px, pz));
        keys.push(this.regKey(x + step * 0.5, z + step * 0.5));
        polysI.push(pi);
      }
    }
    return { corn: Float32Array.from(corners), nq: keys.length, jobs: this.jobsOf(keys), polyOf: water ? Uint16Array.from(polysI) : null };
  }

  private addPaths() {
    const d = this.data!;
    const corners: number[] = [];
    const keys: string[] = [];
    const half = 1.35, lift = this.low ? 0.42 : 0.34, sample = this.low ? 6 : 4;
    for (const path of d.paths) {
      const pts: number[][] = [];
      for (let i = 1; i < path.length; i++) {
        const ax = path[i - 1][0], az = path[i - 1][1], bx = path[i][0], bz = path[i][1];
        const L = Math.hypot(bx - ax, bz - az);
        const n = Math.max(1, Math.ceil(L / sample));
        for (let k = 0; k < n; k++) pts.push([ax + (bx - ax) * k / n, az + (bz - az) * k / n]);
      }
      if (path.length) pts.push(path[path.length - 1]);
      for (let i = 1; i < pts.length; i++) {
        const p = pts[i - 1], q = pts[i];
        const dx = q[0] - p[0], dz = q[1] - p[1];
        const L = Math.hypot(dx, dz) || 1;
        const nx = -dz / L * half, nz = dx / L * half;
        const quad: [number, number][] = [[p[0] - nx, p[1] - nz], [q[0] - nx, q[1] - nz], [p[0] + nx, p[1] + nz], [q[0] + nx, q[1] + nz]];
        for (const [x, z] of quad) corners.push(x, z, lift);
        keys.push(this.regKey((p[0] + q[0]) * 0.5, (p[1] + q[1]) * 0.5));
      }
    }
    const nq = keys.length;
    if (!nq) return;
    this.sheets.push(this.sheet("path", this.mats.path, Float32Array.from(corners), nq, this.jobsOf(keys), false, null, null));
  }

  private jobsOf(keys: string[]): Job[] {
    const map = new Map<string, number[]>();
    for (let i = 0; i < keys.length; i++) {
      const k = keys[i];
      let a = map.get(k);
      if (!a) map.set(k, a = []);
      a.push(i);
    }
    const jobs: Job[] = [];
    for (const [key, ids] of map) jobs.push({ key, ids, at: 0 });
    return jobs;
  }

  private sheet(name: string, mat: MeshLambertMaterial, corn: Float32Array, nq: number, jobs: Job[], water: boolean, polys: Poly[] | null, polyOf: Uint16Array | null): Sheet {
    const ax = this.data!.anchor[0], az = this.data!.anchor[1];
    const vMax = 3 + nq * 4, iMax = 3 + nq * 6;
    const pos = new Float32Array(vMax * 3), nor = new Float32Array(vMax * 3), idx = new Uint32Array(iMax);
    for (let i = 0; i < vMax; i++) { pos[i * 3] = ax; pos[i * 3 + 1] = -40; pos[i * 3 + 2] = az; nor[i * 3 + 1] = 1; }
    idx[0] = 0; idx[1] = 1; idx[2] = 2;
    pos[3] = ax + 0.4; pos[6] = ax;
    pos[8] = az + 0.4;
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    geo.setAttribute("normal", new BufferAttribute(nor, 3));
    geo.setIndex(new BufferAttribute(idx, 1));
    geo.setDrawRange(0, 3);
    geo.computeBoundingSphere();
    const mesh = new Mesh(geo, mat);
    mesh.name = "aw:tds:" + name;
    mesh.receiveShadow = true;
    mesh.castShadow = false;
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = false;
    this.group.add(mesh);
    return {
      mesh, corn, nq, jobs, water, polys, waterY: new Map(), polyOf, pos, nor, idx,
      vUsed: 3, iUsed: 3, upV: 0, upI: 0, dirty: false, done: jobs.length === 0,
    };
  }

  private pump() {
    let budget = this.low ? 900 : 450;
    for (const sh of this.sheets) {
      if (sh.done) continue;
      let open = false;
      for (const job of sh.jobs) {
        if (job.at >= job.ids.length) continue;
        if (!this.hasKey(job.key)) { open = true; continue; }
        while (job.at < job.ids.length && budget > 0) {
          this.emit(sh, job.ids[job.at++]);
          budget--;
        }
        if (job.at < job.ids.length) open = true;
        if (budget <= 0) break;
      }
      if (!open) sh.done = true;
      if (sh.dirty) this.upload(sh);
      if (budget <= 0) return;
    }
  }

  private emit(sh: Sheet, qi: number) {
    const b = qi * 12;
    const base = sh.vUsed;
    const yWater = sh.water ? this.waterLevel(sh, sh.polyOf![qi]) : 0;
    for (let k = 0; k < 4; k++) {
      const x = sh.corn[b + k * 3], z = sh.corn[b + k * 3 + 1], lift = sh.corn[b + k * 3 + 2];
      const h = sh.water ? yWater : this.hAt(x, z) + lift;
      const o = (base + k) * 3;
      sh.pos[o] = x; sh.pos[o + 1] = Number.isFinite(h) ? h : 0; sh.pos[o + 2] = z;
      if (sh.water) { sh.nor[o] = 0; sh.nor[o + 1] = 1; sh.nor[o + 2] = 0; }
      else {
        const s = 4, dx = this.hAt(x + s, z) - this.hAt(x - s, z), dz = this.hAt(x, z + s) - this.hAt(x, z - s);
        const q = Math.hypot(dx, 8, dz) || 1;
        sh.nor[o] = -dx / q; sh.nor[o + 1] = 8 / q; sh.nor[o + 2] = -dz / q;
      }
    }
    const ii = sh.iUsed;
    sh.idx[ii] = base; sh.idx[ii + 1] = base + 1; sh.idx[ii + 2] = base + 2;
    sh.idx[ii + 3] = base + 2; sh.idx[ii + 4] = base + 1; sh.idx[ii + 5] = base + 3;
    sh.vUsed += 4;
    sh.iUsed += 6;
    sh.dirty = true;
  }

  private waterLevel(sh: Sheet, pi: number) {
    const hit = sh.waterY.get(pi);
    if (hit !== undefined) return hit;
    const p = sh.polys![pi];
    const b = bbox(p.o);
    const hs: number[] = [];
    for (let x = b.x0; x <= b.x1; x += 8) for (let z = b.z0; z <= b.z1; z += 8) {
      const h = this.hAt(x, z);
      if (Number.isFinite(h)) hs.push(h);
    }
    hs.sort((a, c) => a - c);
    const y = (hs[Math.floor(hs.length * 0.25)] ?? 0) + 0.1;
    sh.waterY.set(pi, y);
    return y;
  }

  private upload(sh: Sheet) {
    const g = sh.mesh.geometry;
    const pos = g.getAttribute("position") as BufferAttribute;
    const nor = g.getAttribute("normal") as BufferAttribute;
    const idx = g.getIndex()!;
    pos.clearUpdateRanges(); nor.clearUpdateRanges(); idx.clearUpdateRanges();
    pos.addUpdateRange(sh.upV * 3, (sh.vUsed - sh.upV) * 3);
    nor.addUpdateRange(sh.upV * 3, (sh.vUsed - sh.upV) * 3);
    idx.addUpdateRange(sh.upI, sh.iUsed - sh.upI);
    pos.needsUpdate = true; nor.needsUpdate = true; idx.needsUpdate = true;
    g.setDrawRange(0, sh.iUsed);
    g.computeBoundingSphere();
    sh.upV = sh.vUsed; sh.upI = sh.iUsed; sh.dirty = false;
    if (this.warm === 0) sh.mesh.frustumCulled = true;
  }

  private bowl(p: Poly, x: number, z: number) {
    const c = centroid(p.o);
    let rad = 4;
    for (const q of p.o) rad = Math.max(rad, Math.hypot(q[0] - c[0], q[1] - c[1]));
    const t = Math.min(1, Math.hypot(x - c[0], z - c[1]) / rad);
    const mid = this.low ? 0.3 : 0.22, rim = this.low ? 0.52 : 0.42;
    return mid + t * t * (rim - mid);
  }

  private prepClub() {
    const d = this.data!;
    if (!d.club.length) { this.clubDone = true; return; }
    const c = centroid(d.club[0]);
    this.clubX = c[0]; this.clubZ = c[1];
    const vMax = 6000, iMax = 18000;
    const pos = new Float32Array(vMax * 3), col = new Float32Array(vMax * 3), idx = new Uint32Array(iMax);
    const ax = d.anchor[0], az = d.anchor[1];
    for (let i = 0; i < 3; i++) { pos[i * 3] = ax + (i === 1 ? 0.4 : 0); pos[i * 3 + 1] = -40; pos[i * 3 + 2] = az + (i === 2 ? 0.4 : 0); col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = 1; }
    idx[0] = 0; idx[1] = 1; idx[2] = 2;
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    geo.setAttribute("color", new BufferAttribute(col, 3));
    geo.setIndex(new BufferAttribute(idx, 1));
    geo.setDrawRange(0, 3);
    geo.computeBoundingSphere();
    const mesh = new Mesh(geo, this.mats.club);
    mesh.name = "aw:tds:club";
    mesh.castShadow = !this.low;
    mesh.receiveShadow = true;
    mesh.matrixAutoUpdate = false;
    mesh.frustumCulled = false;
    this.group.add(mesh);
    this.clubMesh = mesh; this.clubPos = pos; this.clubCol = col; this.clubIdx = idx;
  }

  private fillClub() {
    if (this.clubDone || !this.clubMesh || !this.hasH(this.clubX, this.clubZ)) return;
    const sink = { pos: [] as number[], col: [] as number[], idx: [] as number[] };
    const d = this.data!;
    for (const ring of d.club) this.extrude(sink, ring, ring === d.club[0] ? 5.4 : 3.6);
    this.tower(sink, d.club[0]);
    if (d.pool.length > 3) this.pool(sink, d.pool);
    const n = sink.pos.length / 3;
    if (n + 3 > this.clubPos!.length / 3) { this.clubDone = true; return; }
    for (let i = 0; i < sink.pos.length; i++) this.clubPos![9 + i] = sink.pos[i];
    for (let i = 0; i < sink.col.length; i++) this.clubCol![9 + i] = sink.col[i];
    for (let i = 0; i < sink.idx.length; i++) this.clubIdx![3 + i] = sink.idx[i] + 3;
    const g = this.clubMesh.geometry;
    const pos = g.getAttribute("position") as BufferAttribute;
    const col = g.getAttribute("color") as BufferAttribute;
    const idx = g.getIndex()!;
    pos.needsUpdate = true; col.needsUpdate = true; idx.needsUpdate = true;
    g.setDrawRange(0, 3 + sink.idx.length);
    g.computeVertexNormals();
    g.computeBoundingSphere();
    this.clubDone = true;
  }

  private v3(s: { pos: number[]; col: number[] }, x: number, y: number, z: number, hex: number) {
    s.pos.push(x, y, z);
    const [r, g, b] = rgb(hex);
    s.col.push(r, g, b);
    return s.pos.length / 3 - 1;
  }

  private extrude(s: { pos: number[]; col: number[]; idx: number[] }, ringIn: Ring, wallH: number) {
    const ring = openRing(ringIn);
    if (ring.length < 3) return;
    const ys = ring.map(([x, z]) => this.hAt(x, z)).filter((y) => Number.isFinite(y));
    if (!ys.length) return;
    const base = Math.min(...ys) - 0.25;
    const eave = Math.max(...ys) + wallH;
    const c = centroid(ring);
    const crown = eave + (wallH > 4 ? 2.1 : 1.1);
    const ccw = signedArea(ring) > 0;
    for (let i = 0; i < ring.length; i++) {
      const a = ring[i], b = ring[(i + 1) % ring.length];
      const i0 = this.v3(s, a[0], base, a[1], COL.wall), i1 = this.v3(s, b[0], base, b[1], COL.wall);
      const i2 = this.v3(s, b[0], eave, b[1], COL.wall), i3 = this.v3(s, a[0], eave, a[1], COL.wall);
      s.idx.push(i0, i1, i2, i0, i2, i3);
      const len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (len < 3.2) continue;
      const dx = (b[0] - a[0]) / len, dz = (b[1] - a[1]) / len;
      const nx = ccw ? dz : -dz, nz = ccw ? -dx : dx;
      const f0 = this.v3(s, a[0] + nx * 0.22, eave - 0.55, a[1] + nz * 0.22, COL.roof);
      const f1 = this.v3(s, b[0] + nx * 0.22, eave - 0.55, b[1] + nz * 0.22, COL.roof);
      const f2 = this.v3(s, b[0] + nx * 0.22, eave + 0.08, b[1] + nz * 0.22, COL.roof);
      const f3 = this.v3(s, a[0] + nx * 0.22, eave + 0.08, a[1] + nz * 0.22, COL.roof);
      s.idx.push(f0, f1, f2, f0, f2, f3);
      const nWin = Math.max(1, Math.floor(len / 4.6));
      const ww = Math.min(1.35, len / (nWin + 0.6) * 0.42);
      for (let k = 0; k < nWin; k++) {
        const t = (k + 0.5) / nWin;
        const mx = a[0] + (b[0] - a[0]) * t, mz = a[1] + (b[1] - a[1]) * t;
        const wy = eave - 2.35, wh = wallH > 4 ? 1.45 : 1.15;
        const q = [
          this.v3(s, mx - dx * ww + nx * 0.16, wy, mz - dz * ww + nz * 0.16, COL.glass),
          this.v3(s, mx + dx * ww + nx * 0.16, wy, mz + dz * ww + nz * 0.16, COL.glass),
          this.v3(s, mx + dx * ww + nx * 0.16, wy + wh, mz + dz * ww + nz * 0.16, COL.glass),
          this.v3(s, mx - dx * ww + nx * 0.16, wy + wh, mz - dz * ww + nz * 0.16, COL.glass),
        ];
        s.idx.push(q[0], q[1], q[2], q[0], q[2], q[3]);
      }
    }
    const hull = hullOf(ring);
    const peak = this.v3(s, c[0], crown, c[1], COL.roof);
    const rim: number[] = [];
    for (const p of hull) {
      const dx = p[0] - c[0], dz = p[1] - c[1], L = Math.hypot(dx, dz) || 1;
      rim.push(this.v3(s, p[0] + dx / L * 0.8, eave + 0.06, p[1] + dz / L * 0.8, COL.roof));
    }
    for (let i = 0; i < rim.length; i++) s.idx.push(peak, rim[i], rim[(i + 1) % rim.length]);
  }

  private tower(s: { pos: number[]; col: number[]; idx: number[] }, ringIn: Ring) {
    const ring = openRing(ringIn);
    if (ring.length < 3) return;
    const c = centroid(ring);
    let p = ring[0];
    for (const q of ring) if (q[0] < p[0]) p = q;
    const x = p[0] * 0.35 + c[0] * 0.65, z = p[1] * 0.35 + c[1] * 0.65;
    const ground = this.hAt(x, z);
    if (!Number.isFinite(ground)) return;
    const base = ground - 0.2, top = ground + 11.2, S = 6.4, h = S / 2;
    const y0 = base, y1 = top;
    const corners: [number, number][] = [[x - h, z - h], [x + h, z - h], [x + h, z + h], [x - h, z + h]];
    for (let i = 0; i < 4; i++) {
      const a = corners[i], b = corners[(i + 1) % 4];
      const i0 = this.v3(s, a[0], y0, a[1], COL.wall), i1 = this.v3(s, b[0], y0, b[1], COL.wall);
      const i2 = this.v3(s, b[0], y1, b[1], COL.wall), i3 = this.v3(s, a[0], y1, a[1], COL.wall);
      s.idx.push(i0, i1, i2, i0, i2, i3);
    }
    const peak = this.v3(s, x, y1 + 2.6, z, COL.roof);
    const o = h + 0.45;
    const rim = [[x - o, z - o], [x + o, z - o], [x + o, z + o], [x - o, z + o]].map(([px, pz]) => this.v3(s, px, y1, pz, COL.roof));
    for (let i = 0; i < 4; i++) s.idx.push(peak, rim[i], rim[(i + 1) % 4]);
    const slits: [number, number, number, number][] = [[x - h - 0.05, z, 0, 1], [x, z - h - 0.05, 1, 0]];
    for (const [ox, oz, ax, az] of slits) {
      const hw = 0.55, a = y1 - 3.4, b = y1 - 0.9;
      const q = [
        this.v3(s, ox - ax * hw, a, oz - az * hw, COL.glass),
        this.v3(s, ox + ax * hw, a, oz + az * hw, COL.glass),
        this.v3(s, ox + ax * hw, b, oz + az * hw, COL.glass),
        this.v3(s, ox - ax * hw, b, oz - az * hw, COL.glass),
      ];
      s.idx.push(q[0], q[1], q[2], q[0], q[2], q[3]);
    }
  }

  private pool(s: { pos: number[]; col: number[]; idx: number[] }, ringIn: Ring) {
    const ring = openRing(ringIn);
    const ys = ring.map(([x, z]) => this.hAt(x, z)).filter((y) => Number.isFinite(y));
    if (!ys.length) return;
    const waterY = Math.min(...ys) + 0.14, deckY = Math.min(...ys) + 0.22;
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
    const fan = (ring: Ring, y: number, hex: number) => {
      const c = centroid(ring);
      const ci = this.v3(s, c[0], y, c[1], hex);
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i], b = ring[(i + 1) % ring.length];
        s.idx.push(ci, this.v3(s, a[0], y, a[1], hex), this.v3(s, b[0], y, b[1], hex));
      }
    };
    fan(outer, deckY, COL.deck);
    fan(ring, waterY, COL.water);
    const step = Math.max(1, Math.floor(n / 4));
    for (let i = 0, placed = 0; i < n && placed < 4; i += step, placed++) {
      const x = ring[i][0] * 0.35 + outer[i][0] * 0.65;
      const z = ring[i][1] * 0.35 + outer[i][1] * 0.65;
      const y = deckY + 0.2;
      const hw = 0.35, hd = 0.9, hh = 0.09;
      const a = this.v3(s, x - hw, y, z - hd, COL.cloth), b = this.v3(s, x + hw, y, z - hd, COL.cloth);
      const c = this.v3(s, x + hw, y + hh, z + hd, COL.cloth), d = this.v3(s, x - hw, y + hh, z + hd, COL.cloth);
      s.idx.push(a, b, c, a, c, d);
    }
  }

  private scatter() {
    const d = this.data!;
    const push = (x: number, z: number, kind: Spot["kind"], sc: number, yaw: number, lean = 0) => {
      if (kind !== "palm" && this.onTurf(x, z)) return;
      this.spots.push({ x, z, sc, yaw, kind, lean });
      const k = (Math.floor(x / CELL)) + "," + (Math.floor(z / CELL));
      this.mask.add(k);
    };
    for (const p of d.palms) {
      const sc = 1.9 + Math.abs(Math.sin(p[0] * 0.17 + p[1])) * 0.7;
      push(p[0], p[1], "palm", sc, p[0] * 0.3, -0.2);
    }
    if (d.club.length) {
      const c = centroid(d.club[0]);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2 + 0.35;
        const rad = 36 + (i % 3) * 5;
        const x = c[0] + Math.cos(a) * rad, z = c[1] + Math.sin(a) * rad * 0.82;
        if (d.club.some((r) => pip(r, x, z))) continue;
        if (d.pool.length > 3 && pip(d.pool, x, z)) continue;
        push(x, z, "palm", 2.05 + (i % 4) * 0.15, x * 0.2, -0.18 - (i % 4) * 0.04);
      }
    }
    let cactus = 0, rock = 0;
    for (const p of d.fairways) {
      const ring = openRing(p.o);
      const c = centroid(p.o);
      for (let i = 0; i < ring.length && cactus < 42; i += 4) {
        const a = ring[i];
        let dx = a[0] - c[0], dz = a[1] - c[1];
        const L = Math.hypot(dx, dz) || 1;
        dx /= L; dz /= L;
        const dist = 16 + ((i * 13) % 18);
        const x = a[0] + dx * dist, z = a[1] + dz * dist;
        const rockHere = (i % 12) === 0 && rock < 28;
        if (rockHere) { push(x, z, "rock", 0.7 + (i % 5) * 0.18, i * 0.4); rock++; }
        else { push(x, z, "cactus", 0.85 + (i % 4) * 0.22, i * 0.7); cactus++; }
      }
    }
  }

  private onTurf(x: number, z: number) {
    const d = this.data!;
    for (const p of d.fairways) if (inside(p, x, z)) return true;
    for (const p of d.greens) if (inside(p, x, z)) return true;
    for (const p of d.tees) if (inside(p, x, z)) return true;
    for (const p of d.bunkers) if (inside(p, x, z)) return true;
    for (const p of d.water) if (inside(p, x, z)) return true;
    return false;
  }

  private buildRoutes() {
    const d = this.data!;
    const built: Route[] = [];
    for (const path of d.paths) {
      if (path.length < 2) continue;
      const x: number[] = [path[0][0]], z: number[] = [path[0][1]], cum: number[] = [0];
      let len = 0;
      for (let i = 1; i < path.length; i++) {
        len += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1]);
        x.push(path[i][0]); z.push(path[i][1]); cum.push(len);
      }
      if (len > 80) built.push({ x: Float32Array.from(x), z: Float32Array.from(z), cum: Float32Array.from(cum), len });
    }
    built.sort((a, b) => b.len - a.len);
    this.routes = built.slice(0, 4);
    this.carts = this.routes.map((r, i) => ({ route: i, dist: (i + 0.5) / this.routes.length * r.len, speed: 4.2 + i * 0.35 }));
    const stand = d.tees.slice(0, 3).map((t) => centroid(t.o));
    this.golfers = stand.map((p, i) => ({ walk: false, route: 0, dist: 0, speed: 0, x: p[0], z: p[1], yaw: 0.6 * i, phase: i }));
    for (let i = 0; i < Math.min(2, this.routes.length); i++) {
      this.golfers.push({ walk: true, route: i, dist: this.routes[i].len * (0.2 + i * 0.3), speed: 1.25, x: 0, z: 0, yaw: 0, phase: i + 1.7 });
    }
  }

  private placeStatic() {
    const d = this.data!;
    while (this.flagN < d.flags.length) {
      const p = d.flags[this.flagN];
      if (!this.hasH(p[0], p[1])) break;
      const y = this.hAt(p[0], p[1]) + 0.28;
      this.setInst(this.poles, this.flagN, p[0], y, p[1], 0, 1);
      this.setInst(this.flags, this.flagN, p[0], y, p[1], 0, 1);
      this.flags.setColorAt(this.flagN, new Color([0xd22b2b, 0xf2d23a, 0x2a6fdb, 0xf7f7f7, 0xe07a2f][this.flagN % 5]));
      this.flagAt.push([p[0], p[1]]);
      this.flagN++;
    }
    if (this.flagN) {
      this.poles.count = this.flagN; this.flags.count = this.flagN;
      this.poles.instanceMatrix.needsUpdate = true; this.flags.instanceMatrix.needsUpdate = true;
      if (this.flags.instanceColor) this.flags.instanceColor.needsUpdate = true;
    }
    let progressed = false;
    while (this.spotN < this.spots.length) {
      const s = this.spots[this.spotN];
      if (!this.hasH(s.x, s.z)) break;
      const slot = this.kindSlot(this.spotN);
      const y = this.hAt(s.x, s.z);
      if (s.kind === "palm" && slot < 40) this.setInst(this.palms, slot, s.x, y, s.z, s.yaw, s.sc, s.lean);
      else if (s.kind === "cactus" && slot < 48) this.setInst(this.cacti, slot, s.x, y, s.z, s.yaw, s.sc);
      else if (s.kind === "rock" && slot < 32) this.setInst(this.rocks, slot, s.x, y, s.z, s.yaw, s.sc);
      this.spotN++;
      progressed = true;
    }
    if (!progressed) return;
    let pc = 0, cc = 0, rc = 0;
    for (let i = 0; i < this.spotN; i++) {
      const s = this.spots[i];
      if (s.kind === "palm") pc++;
      else if (s.kind === "cactus") cc++;
      else rc++;
    }
    this.palms.count = pc; this.cacti.count = cc; this.rocks.count = rc;
    this.palms.instanceMatrix.needsUpdate = true;
    this.cacti.instanceMatrix.needsUpdate = true;
    this.rocks.instanceMatrix.needsUpdate = true;
    if (this.cacti.instanceColor) this.cacti.instanceColor.needsUpdate = true;
    if (this.rocks.instanceColor) this.rocks.instanceColor.needsUpdate = true;
  }

  private cullProps(cx: number, cy: number, cz: number) {
    const lim = 700 * 700;
    for (let i = 0; i < this.flagN; i++) {
      const p = this.flagAt[i];
      const s = (cx - p[0]) ** 2 + (cz - p[1]) ** 2 < lim && cy < 420 ? 1 : 0;
      this.setInst(this.poles, i, p[0], this.hAt(p[0], p[1]) + 0.28, p[1], 0, s);
      this.setInst(this.flags, i, p[0], this.hAt(p[0], p[1]) + 0.28, p[1], 0, s);
    }
    if (this.flagN) { this.poles.instanceMatrix.needsUpdate = true; this.flags.instanceMatrix.needsUpdate = true; }
    let pi = 0, ci = 0, ri = 0;
    for (let i = 0; i < this.spotN; i++) {
      const s = this.spots[i];
      const vis = (cx - s.x) ** 2 + (cz - s.z) ** 2 < (s.kind === "palm" ? 800 : 650) ** 2 && cy < 480 ? s.sc : 0;
      const mesh = s.kind === "palm" ? this.palms : s.kind === "cactus" ? this.cacti : this.rocks;
      const slot = s.kind === "palm" ? pi++ : s.kind === "cactus" ? ci++ : ri++;
      this.setInst(mesh, slot, s.x, this.hAt(s.x, s.z), s.z, s.yaw, vis, s.lean);
    }
    if (pi) this.palms.instanceMatrix.needsUpdate = true;
    if (ci) this.cacti.instanceMatrix.needsUpdate = true;
    if (ri) this.rocks.instanceMatrix.needsUpdate = true;
  }

  private hideActors() {
    this.actorsOn = false;
    for (const m of [this.cartBody, this.cartRoof, this.cartWheel, this.gHead, this.gTorso, this.gLegs, this.gArms, this.gClub]) m.count = 0;
  }

  private animate(dt: number, cx: number, cy: number, cz: number) {
    const near = (x: number, z: number) => (cx - x) ** 2 + (cz - z) ** 2 < 750 * 750 && cy < 420;
    let carts = 0;
    for (const cart of this.carts) {
      const route = this.routes[cart.route];
      if (!route) continue;
      cart.dist = (cart.dist + cart.speed * dt) % route.len;
      const p = this.sample(route, cart.dist);
      if (!this.hasH(p.x, p.z) || !near(p.x, p.z)) continue;
      const y = this.hAt(p.x, p.z);
      this.setInst(this.cartBody, carts, p.x, y, p.z, p.yaw, 1);
      this.setInst(this.cartRoof, carts, p.x, y, p.z, p.yaw, 1);
      const offs: [number, number, number][] = [[0.74, 0.32, 0.78], [-0.74, 0.32, 0.78], [0.74, 0.32, -0.78], [-0.74, 0.32, -0.78]];
      this.q.setFromAxisAngle(this.up, p.yaw);
      for (let w = 0; w < 4; w++) {
        this.v.set(offs[w][0], offs[w][1], offs[w][2]).applyQuaternion(this.q);
        this.setInst(this.cartWheel, carts * 4 + w, p.x + this.v.x, y + this.v.y, p.z + this.v.z, p.yaw, 1);
      }
      carts++;
    }
    this.cartBody.count = carts; this.cartRoof.count = carts; this.cartWheel.count = carts * 4;
    this.cartBody.instanceMatrix.needsUpdate = true;
    this.cartRoof.instanceMatrix.needsUpdate = true;
    this.cartWheel.instanceMatrix.needsUpdate = true;

    let n = 0;
    for (const gfer of this.golfers) {
      let x = gfer.x, z = gfer.z, yaw = gfer.yaw;
      if (gfer.walk) {
        const route = this.routes[gfer.route];
        gfer.dist = (gfer.dist + gfer.speed * dt) % route.len;
        const p = this.sample(route, gfer.dist);
        const side = 1.8;
        x = p.x + Math.cos(p.yaw) * side;
        z = p.z - Math.sin(p.yaw) * side;
        yaw = p.yaw;
      }
      if (!this.hasH(x, z) || !near(x, z)) continue;
      const bob = gfer.walk ? Math.sin(this.t * 7 + gfer.phase) * 0.04 : Math.sin(this.t * 1.5 + gfer.phase) * 0.015;
      const y = this.hAt(x, z) + bob;
      const swing = Math.sin(this.t * (gfer.walk ? 7 : 1.2) + gfer.phase) * (gfer.walk ? 0.45 : 0.12);
      this.setInst(this.gHead, n, x, y, z, yaw, 1);
      this.setInst(this.gTorso, n, x, y, z, yaw, 1);
      this.setInst(this.gClub, n, x, y, z, yaw, 1);
      this.gHead.setColorAt(n, new Color(SKINS[n % SKINS.length]));
      this.gTorso.setColorAt(n, new Color(SHIRTS[n % SHIRTS.length]));
      this.poseLimb(this.gLegs, n * 2, x, y + 0.72, z, yaw, -0.12, swing);
      this.poseLimb(this.gLegs, n * 2 + 1, x, y + 0.72, z, yaw, 0.12, -swing);
      this.poseLimb(this.gArms, n * 2, x, y + 1.28, z, yaw, -0.24, -swing * 0.85);
      this.poseLimb(this.gArms, n * 2 + 1, x, y + 1.28, z, yaw, 0.24, swing * 0.85);
      this.gLegs.setColorAt(n * 2, new Color(SHORTS[n % SHORTS.length]));
      this.gLegs.setColorAt(n * 2 + 1, new Color(SHORTS[n % SHORTS.length]));
      this.gArms.setColorAt(n * 2, new Color(SKINS[n % SKINS.length]));
      this.gArms.setColorAt(n * 2 + 1, new Color(SKINS[n % SKINS.length]));
      n++;
    }
    this.gHead.count = n; this.gTorso.count = n; this.gClub.count = n;
    this.gLegs.count = n * 2; this.gArms.count = n * 2;
    for (const m of [this.gHead, this.gTorso, this.gLegs, this.gArms, this.gClub]) {
      m.instanceMatrix.needsUpdate = true;
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    }
    this.actorsOn = true;
  }

  private poseLimb(mesh: InstancedMesh, i: number, x: number, y: number, z: number, yaw: number, side: number, swing: number) {
    this.q.setFromAxisAngle(this.up, yaw);
    this.leanQ.setFromAxisAngle(this.axisX, swing);
    this.q.multiply(this.leanQ);
    this.scale.set(1, 1, 1);
    this.m.compose(this.v.set(x + Math.cos(yaw) * side, y, z - Math.sin(yaw) * side), this.q, this.scale);
    mesh.setMatrixAt(i, this.m);
  }

  private kindSlot(index: number) {
    const kind = this.spots[index].kind;
    let n = 0;
    for (let i = 0; i < index; i++) if (this.spots[i].kind === kind) n++;
    return n;
  }

  private sample(route: Route, dist: number) {
    const d = ((dist % route.len) + route.len) % route.len;
    let i = 1;
    while (i < route.cum.length - 1 && route.cum[i] < d) i++;
    const a = route.cum[i - 1], b = route.cum[i];
    const t = b > a ? (d - a) / (b - a) : 0;
    const x = route.x[i - 1] + (route.x[i] - route.x[i - 1]) * t;
    const z = route.z[i - 1] + (route.z[i] - route.z[i - 1]) * t;
    const yaw = Math.atan2(route.x[i] - route.x[i - 1], route.z[i] - route.z[i - 1]);
    return { x, z, yaw };
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

  private hideClubFootprints() {
    const hero = this.world.hero;
    if (!hero || !this.data) return;
    for (const ring of this.data.club) {
      hero.polys.push(ring);
      hero.pts.push(centroid(ring));
    }
  }

  private hasH(x: number, z: number) {
    return this.hasKey(this.regKey(x, z));
  }

  private hasKey(key: string) {
    const r = this.world.regions.get(key);
    return !!(r && r.H);
  }

  private regKey(x: number, z: number) {
    const M = this.world.M;
    return Math.floor((x - M.X0) / M.RS) + "," + Math.floor((z - M.Z0) / M.RS);
  }

  private setInst(mesh: InstancedMesh, i: number, x: number, y: number, z: number, yaw: number, s: number, lean = 0) {
    this.v.set(x, y, z);
    this.q.setFromAxisAngle(this.up, yaw);
    if (lean) {
      this.leanQ.setFromAxisAngle(this.west, -lean);
      this.q.premultiply(this.leanQ);
    }
    this.scale.set(s, s, s);
    this.m.compose(this.v, this.q, this.scale);
    mesh.setMatrixAt(i, this.m);
  }

  private blank(geo: BufferGeometry, mat: MeshLambertMaterial, n: number) {
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
    const pos = [0, 2.5, 0, -1.15, 2.18, 0, -0.95, 2.58, 0.03, 0, 2.5, 0, -0.95, 2.58, -0.03, -1.15, 2.18, 0];
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    g.computeVertexNormals();
    return g;
  }

  private palmGeo() {
    const parts: BufferGeometry[] = [];
    const trunk = new CylinderGeometry(0.16, 0.28, 5.4, 5);
    trunk.translate(0, 2.7, 0);
    this.paint(trunk, 0x6b4a2c);
    parts.push(trunk);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const fr = new BoxGeometry(0.22, 0.05, 2.3);
      fr.translate(0, 0, 1.05);
      fr.rotateX(0.7);
      fr.rotateY(a);
      fr.translate(0, 5.2, 0);
      this.paint(fr, i % 2 ? 0x218a3a : 0x17662c);
      parts.push(fr);
    }
    return this.mergeParts(parts);
  }

  private cactusGeo() {
    const parts: BufferGeometry[] = [];
    const trunk = new CylinderGeometry(0.18, 0.22, 2.3, 5);
    trunk.translate(0, 1.15, 0);
    this.paint(trunk, 0x2c7a34);
    parts.push(trunk);
    for (const side of [-1, 1]) {
      const arm = new CylinderGeometry(0.1, 0.12, 0.7, 4);
      arm.translate(0, 0.35, 0);
      arm.rotateZ(side * 1.15);
      arm.translate(side * 0.42, 1.35, 0);
      this.paint(arm, 0x348a3c);
      parts.push(arm);
    }
    return this.mergeParts(parts);
  }

  private rockGeo() {
    const g = new BoxGeometry(1.1, 0.55, 0.85);
    g.translate(0, 0.22, 0);
    const p = g.attributes.position;
    for (let i = 0; i < p.count; i++) {
      const y = p.getY(i);
      p.setX(i, p.getX(i) * (0.75 + y));
      p.setZ(i, p.getZ(i) * (0.7 + y * 0.8));
    }
    this.paint(g, 0xb3a494);
    g.computeVertexNormals();
    return g;
  }

  private cartBodyGeo() {
    const body = new BoxGeometry(1.2, 0.38, 2.2);
    body.translate(0, 0.58, 0);
    const seat = new BoxGeometry(1.05, 0.42, 0.55);
    seat.translate(0, 0.88, -0.55);
    return this.mergePos([body, seat]);
  }

  private cartRoofGeo() {
    const roof = new BoxGeometry(1.32, 0.07, 1.9);
    roof.translate(0, 1.32, -0.02);
    const posts: BufferGeometry[] = [roof];
    for (const [x, z] of [[0.52, 0.7], [-0.52, 0.7], [0.52, -0.72], [-0.52, -0.72]] as [number, number][]) {
      const p = new BoxGeometry(0.06, 0.62, 0.06);
      p.translate(x, 0.98, z);
      posts.push(p);
    }
    return this.mergePos(posts);
  }

  private wheelGeo() {
    const g = new CylinderGeometry(0.32, 0.32, 0.18, 8);
    g.rotateZ(Math.PI / 2);
    return g;
  }

  private clubGeo() {
    const g = new BoxGeometry(0.035, 0.85, 0.035);
    g.translate(0, 0.42, 0);
    g.rotateX(0.9);
    g.translate(0.28, 0.95, 0.12);
    return g;
  }

  private mergePos(parts: BufferGeometry[]) {
    const pos: number[] = [], nor: number[] = [];
    for (const p of parts) {
      const pa = p.attributes.position.array as Float32Array;
      const na = p.attributes.normal.array as Float32Array;
      for (let i = 0; i < pa.length; i++) { pos.push(pa[i]); nor.push(na[i]); }
      p.dispose();
    }
    const g = new BufferGeometry();
    g.setAttribute("position", new Float32BufferAttribute(pos, 3));
    g.setAttribute("normal", new Float32BufferAttribute(nor, 3));
    return g;
  }

  private mergeParts(parts: BufferGeometry[]) {
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
