// Noord and Alto Vista cunucu yards, plus ATVs, UTVs, and tour jeeps on
// north-coast dirt roads. Santa Anna and the Alto Vista chapel stay as they are.
// Houses themselves are hero meshes. This file is the yard dirt, a few cactus
// posts outside the wall, and the moving fleet. No photo textures.
// Phone: two static instanced meshes and three vehicle meshes. ?yard=0 turns it off.
import {
  BoxGeometry, BufferAttribute, BufferGeometry, Color, InstancedMesh,
  Matrix4, MeshLambertMaterial, Quaternion, Vector3,
} from "three";
import type { AGame } from "./env";

type Pt = [number, number];
type House = { id: string; x: number; z: number; yaw: number; scale: number; style: string };
type Route = { name: string; pts: Pt[]; len: number; cum: number[] };
type Rider = { route: string; kind: "atv" | "utv" | "jeep"; at: number; speed: number; color: number };
type YardData = { houses: House[]; routes: { name: string; pts: Pt[] }[]; fleet: Rider[] };
type World = {
  heightAt(x: number, z: number): number;
  regions: Map<string, { H?: Float32Array }>;
  M: { X0: number; Z0: number; RS: number };
};
type Live = { kind: string; route: string; x: number; z: number; y: number; yaw: number };

const CELL = 8;
const POSTS: Pt[] = [[-8.1, -5.4], [-8.1, 5.4], [2.2, 5.6], [2.2, -5.6], [6.4, 5.2], [6.4, -5.2]];
const POST_S = [0.9, 1.15, 0.85, 1.05, 0.95, 1.1];

function rgb(hex: number): [number, number, number] {
  return [(hex >> 16) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255];
}

function paint(geo: BufferGeometry, hex: number) {
  const n = geo.getAttribute("position").count;
  const col = new Float32Array(n * 3);
  const [r, g, b] = rgb(hex);
  for (let i = 0; i < n; i++) {
    col[i * 3] = r;
    col[i * 3 + 1] = g;
    col[i * 3 + 2] = b;
  }
  geo.setAttribute("color", new BufferAttribute(col, 3));
  return geo;
}

function box(sx: number, sy: number, sz: number, x: number, y: number, z: number, hex: number) {
  return paint(new BoxGeometry(sx, sy, sz).translate(x, y, z), hex);
}

function join(geos: BufferGeometry[]) {
  const parts = geos.map((g) => (g.index ? g.toNonIndexed() : g));
  let nv = 0;
  for (const g of parts) nv += g.getAttribute("position").count;
  const pos = new Float32Array(nv * 3);
  const nor = new Float32Array(nv * 3);
  const col = new Float32Array(nv * 3);
  let v = 0;
  for (const g of parts) {
    const p = g.getAttribute("position").array as Float32Array;
    const n = g.getAttribute("normal").array as Float32Array;
    const c = g.getAttribute("color").array as Float32Array;
    pos.set(p, v * 3);
    nor.set(n, v * 3);
    col.set(c, v * 3);
    v += p.length / 3;
  }
  const geo = new BufferGeometry();
  geo.setAttribute("position", new BufferAttribute(pos, 3));
  geo.setAttribute("normal", new BufferAttribute(nor, 3));
  geo.setAttribute("color", new BufferAttribute(col, 3));
  return geo;
}

function atvGeo() {
  const tire = 0x1a1a1a;
  const body = 0xffffff;
  const dark = 0x2b2b2b;
  const wheels = [[0.46, 0.32], [0.46, -0.32], [-0.42, 0.32], [-0.42, -0.32]];
  return join([
    ...wheels.map(([x, z]) => box(0.34, 0.34, 0.14, x, 0.17, z, tire)),
    box(1.05, 0.08, 0.46, 0.02, 0.38, 0, body),
    box(0.42, 0.16, 0.3, 0.46, 0.42, 0, body),
    box(0.32, 0.18, 0.28, 0.16, 0.5, 0, body),
    box(0.36, 0.1, 0.3, -0.16, 0.5, 0, dark),
    box(0.05, 0.28, 0.4, 0.62, 0.58, 0, dark),
  ]);
}

function utvGeo() {
  const tire = 0x1a1a1a;
  const body = 0xffffff;
  const cage = 0x242424;
  const seat = 0x333333;
  const wheels = [[0.82, 0.62], [0.82, -0.62], [-0.82, 0.62], [-0.82, -0.62]];
  const posts = [[0.72, 0.5], [0.72, -0.5], [-0.72, 0.5], [-0.72, -0.5]];
  return join([
    ...wheels.map(([x, z]) => box(0.4, 0.4, 0.18, x, 0.2, z, tire)),
    box(1.85, 0.28, 1.15, 0, 0.46, 0, body),
    box(1.6, 0.32, 0.08, 0, 0.68, 0.54, body),
    box(1.6, 0.32, 0.08, 0, 0.68, -0.54, body),
    ...posts.map(([x, z]) => box(0.06, 0.78, 0.06, x, 1.05, z, cage)),
    box(1.55, 0.05, 1.08, 0, 1.46, 0, cage),
    box(0.38, 0.28, 0.36, -0.15, 0.72, 0.22, seat),
    box(0.38, 0.28, 0.36, -0.15, 0.72, -0.22, seat),
  ]);
}

function jeepGeo() {
  const tire = 0x1a1a1a;
  const body = 0xffffff;
  const glass = 0x9eb0be;
  const seat = 0x3a342c;
  const bar = 0x2a2a2a;
  const wheels = [[1.05, 0.72], [1.05, -0.72], [-1.05, 0.72], [-1.05, -0.72]];
  return join([
    ...wheels.map(([x, z]) => box(0.52, 0.52, 0.2, x, 0.26, z, tire)),
    box(2.35, 0.42, 1.35, -0.05, 0.66, 0, body),
    box(0.78, 0.2, 1.2, 1.15, 0.78, 0, body),
    box(0.06, 0.52, 1.18, 0.68, 1.12, 0, glass),
    box(0.42, 0.28, 0.48, -0.15, 0.95, 0.28, seat),
    box(0.42, 0.28, 0.48, -0.15, 0.95, -0.28, seat),
    box(0.42, 0.22, 1.1, -0.85, 0.92, 0, seat),
    box(0.06, 0.7, 0.06, -0.95, 1.25, 0.52, bar),
    box(0.06, 0.7, 0.06, -0.95, 1.25, -0.52, bar),
    box(0.06, 0.06, 1.1, -0.95, 1.58, 0, bar),
  ]);
}

function cactusGeo() {
  return join([
    box(0.22, 1.25, 0.22, 0, 0.62, 0, 0x3e5c34),
    box(0.16, 0.48, 0.16, 0.26, 0.82, 0, 0x4a6a3c),
    box(0.14, 0.36, 0.14, -0.2, 0.7, 0.04, 0x34502c),
  ]);
}

export class NorthYard {
  private world: World;
  private hAt: (x: number, z: number) => number;
  private data: YardData | null = null;
  private routes = new Map<string, Route>();
  private riders: Rider[] = [];
  private placed = false;
  private last = performance.now();
  private live: Live[] = [];
  private pads: InstancedMesh;
  private cactus: InstancedMesh;
  private rides: Record<"atv" | "utv" | "jeep", InstancedMesh>;
  private m = new Matrix4();
  private q = new Quaternion();
  private vec = new Vector3();
  private up = new Vector3(0, 1, 0);
  private scale = new Vector3();
  private tint = new Color();

  constructor(private g: AGame) {
    const w = g.real as unknown as World;
    this.world = w;
    this.hAt = (x, z) => w.heightAt(x, z);
    const dirt = new MeshLambertMaterial({ color: 0x8d6b45 });
    dirt.polygonOffset = true;
    dirt.polygonOffsetFactor = -3;
    dirt.polygonOffsetUnits = -12;
    this.pads = this.mesh(new BoxGeometry(1, 1, 1), dirt, 8, "pads");
    this.cactus = this.mesh(cactusGeo(), new MeshLambertMaterial({ vertexColors: true }), 48, "cactus");
    const body = new MeshLambertMaterial({ color: 0xffffff, vertexColors: true });
    this.rides = {
      atv: this.mesh(atvGeo(), body, 3, "atv"),
      utv: this.mesh(utvGeo(), body, 3, "utv"),
      jeep: this.mesh(jeepGeo(), body, 2, "jeep"),
    };
    void this.load();
  }

  fleet() {
    return this.live;
  }

  frame() {
    const now = performance.now();
    const dt = Math.min(0.05, Math.max(0, (now - this.last) / 1000));
    this.last = now;
    if (!this.data) return;
    if (!this.placed) this.buildYards();
    this.roll(dt);
  }

  private async load() {
    try {
      const res = await fetch("./data/real/noord_yards.json", { cache: "force-cache" });
      if (!res.ok) return;
      const data = await res.json() as YardData;
      this.data = data;
      for (const route of data.routes) {
        const cum = [0];
        for (let i = 1; i < route.pts.length; i++) {
          const a = route.pts[i - 1];
          const b = route.pts[i];
          cum.push(cum[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1]));
        }
        this.routes.set(route.name, { name: route.name, pts: route.pts, len: cum[cum.length - 1] || 1, cum });
      }
      this.riders = data.fleet.map((r) => ({ ...r }));
      this.maskVeg();
    } catch {
      return;
    }
  }

  private maskVeg() {
    const mask = new Set<string>();
    for (const h of this.data!.houses) {
      const r = 8 * h.scale + 4;
      for (let x = h.x - r; x <= h.x + r; x += CELL) {
        for (let z = h.z - r; z <= h.z + r; z += CELL) {
          if ((x - h.x) ** 2 + (z - h.z) ** 2 <= r * r) mask.add((Math.floor(x / CELL)) + "," + (Math.floor(z / CELL)));
        }
      }
    }
    const w = window as unknown as { __awVegHit?: (x: number, z: number, n?: string) => boolean };
    const prev = w.__awVegHit;
    w.__awVegHit = (x, z, n) => {
      if (mask.has((Math.floor(x / CELL)) + "," + (Math.floor(z / CELL)))) return true;
      return prev ? prev(x, z, n) : false;
    };
  }

  private buildYards() {
    const houses = this.data!.houses;
    if (!houses.every((h) => this.hasH(h.x, h.z))) return;
    houses.forEach((h, i) => {
      const y = this.hAt(h.x, h.z);
      this.set(this.pads, i, h.x, y + 0.035, h.z, h.yaw, 12.2 * h.scale, 0.05, 7.4 * h.scale);
      const c = Math.cos(h.yaw);
      const s = Math.sin(h.yaw);
      POSTS.forEach((p, k) => {
        const lx = p[0] * h.scale;
        const lz = p[1] * h.scale;
        const x = h.x + lx * c + lz * s;
        const z = h.z - lx * s + lz * c;
        const py = this.hasH(x, z) ? this.hAt(x, z) : y;
        this.set(this.cactus, i * POSTS.length + k, x, py, z, h.yaw, POST_S[k], POST_S[k], POST_S[k]);
      });
    });
    this.pads.count = houses.length;
    this.cactus.count = houses.length * POSTS.length;
    this.pads.instanceMatrix.needsUpdate = true;
    this.cactus.instanceMatrix.needsUpdate = true;
    this.placed = true;
  }

  private roll(dt: number) {
    const counts = { atv: 0, utv: 0, jeep: 0 };
    const live: Live[] = [];
    for (const rider of this.riders) {
      const route = this.routes.get(rider.route);
      if (!route) continue;
      rider.at = (rider.at + rider.speed * dt) % route.len;
      const pose = this.pose(route, rider.at);
      const mesh = this.rides[rider.kind];
      const slot = counts[rider.kind]++;
      const y = this.hasH(pose.x, pose.z) ? this.hAt(pose.x, pose.z) + 0.08 : -80;
      this.set(mesh, slot, pose.x, y, pose.z, pose.yaw, 1, 1, 1);
      this.tint.setHex(rider.color);
      mesh.setColorAt(slot, this.tint);
      live.push({ kind: rider.kind, route: rider.route, x: pose.x, z: pose.z, y, yaw: pose.yaw });
    }
    for (const kind of ["atv", "utv", "jeep"] as const) {
      const mesh = this.rides[kind];
      mesh.count = counts[kind];
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
    this.live = live;
  }

  private pose(route: Route, dist: number) {
    let d = dist % route.len;
    if (d < 0) d += route.len;
    let i = 1;
    while (i < route.cum.length - 1 && route.cum[i] < d) i++;
    const a = route.pts[i - 1];
    const b = route.pts[i];
    const seg = (route.cum[i] - route.cum[i - 1]) || 1;
    const t = (d - route.cum[i - 1]) / seg;
    const x = a[0] + (b[0] - a[0]) * t;
    const z = a[1] + (b[1] - a[1]) * t;
    return { x, z, yaw: Math.atan2(-(b[1] - a[1]), b[0] - a[0]) };
  }

  private hasH(x: number, z: number) {
    const M = this.world.M;
    const key = Math.floor((x - M.X0) / M.RS) + "," + Math.floor((z - M.Z0) / M.RS);
    const region = this.world.regions.get(key);
    return !!(region && region.H);
  }

  private mesh(geo: BufferGeometry, mat: MeshLambertMaterial, n: number, name: string) {
    const mesh = new InstancedMesh(geo, mat, n);
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.name = "aw:nyd:" + name;
    this.g.scene.add(mesh);
    return mesh;
  }

  private set(mesh: InstancedMesh, i: number, x: number, y: number, z: number, yaw: number, sx: number, sy: number, sz: number) {
    this.q.setFromAxisAngle(this.up, yaw);
    this.vec.set(x, y, z);
    this.scale.set(sx, sy, sz);
    this.m.compose(this.vec, this.q, this.scale);
    mesh.setMatrixAt(i, this.m);
  }
}
