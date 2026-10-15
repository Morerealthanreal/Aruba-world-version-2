// Low-poly, instanced crowds for the Palm Beach hotel strip and Oranjestad's
// Caya G.F. Betico Croes shopping street. Four draws replace A's many skinned
// pedestrian parts, and instance counts drop to zero outside the LOD radius.
// ?peds=0 (or ?life=0) restores A's original pedestrians.
import {
  BoxGeometry, Color, DynamicDrawUsage, Group, InstancedMesh, Matrix4,
  MeshLambertMaterial, Quaternion, SphereGeometry, Vector3, type Object3D,
} from "three";
import type { AGame } from "./env";

type Road = {
  id: number; n: string; w: number; p: number[][]; u: number;
};
type Ped = { g: Object3D };
type World = {
  regions: Map<unknown, { json?: { roads?: Road[] } }>;
  surfaceAt(x: number, z: number): number;
};
type Amb = { peds: Ped[]; w: World };
type Walker = {
  road: Road | null; length: number; s: number; dir: number; side: number;
  speed: number; phase: number; x: number; y: number; z: number; yaw: number;
  skin: number; top: number; bottom: number;
};

const TOPS = [0xe95b5b, 0x3d8fcb, 0xf1c84b, 0x4da968, 0xe983b3, 0xe78b45, 0x735db2];
const BOTTOMS = [0x263445, 0x554535, 0xd9d4c7, 0x334c69, 0x313338];
const SKINS = [0x6f3f2b, 0x92583b, 0xb97954, 0xd59a72, 0xedc29e];
const X_AXIS = new Vector3(1, 0, 0);

export class PedestrianCrowds {
  stats = { pooled: 0, visible: 0, draws: 0, triangles: 0, corridors: 0 };
  private amb: Amb | null = null;
  private walkers: Walker[] = [];
  private routes: Road[] = [];
  private group = new Group();
  private head: InstancedMesh;
  private torso: InstancedMesh;
  private legs: InstancedMesh;
  private arms: InstancedMesh;
  private meshes: InstancedMesh[];
  private root = new Matrix4();
  private local = new Matrix4();
  private world = new Matrix4();
  private pos = new Vector3();
  private scale = new Vector3();
  private quat = new Quaternion();
  private tint = new Color();
  private scanIn = 0;
  private lod2: number;

  constructor(private g: AGame) {
    const tier = g.real!.q.name;
    const cap = tier === "low" ? 12 : tier === "med" ? 24 : 36;
    const lod = tier === "low" ? 170 : 240;
    this.lod2 = lod * lod;

    this.group.name = "aw:pedestrians";
    const skin = new MeshLambertMaterial({ color: 0xffffff });
    const cloth = new MeshLambertMaterial({ color: 0xffffff });
    const pants = new MeshLambertMaterial({ color: 0xffffff });
    this.head = this.mesh(new SphereGeometry(1, 6, 4), skin, cap, "heads");
    this.torso = this.mesh(new BoxGeometry(1, 1, 1), cloth, cap, "torsos");
    this.legs = this.mesh(new BoxGeometry(1, 1, 1), pants, cap * 2, "legs");
    this.arms = this.mesh(new BoxGeometry(1, 1, 1), skin, cap * 2, "arms");
    this.meshes = [this.head, this.torso, this.legs, this.arms];
    this.group.add(this.head, this.torso, this.legs, this.arms);
    g.scene.add(this.group);

    for (let i = 0; i < cap; i++) {
      this.walkers.push({
        road: null, length: 0, s: 0, dir: i & 1 ? 1 : -1, side: i & 2 ? 1 : -1,
        speed: 1.05 + (i % 6) * 0.09, phase: (i * 2.399963) % (Math.PI * 2),
        x: 0, y: 0, z: 0, yaw: 0,
        skin: SKINS[(i * 3) % SKINS.length],
        top: TOPS[(i * 5) % TOPS.length],
        bottom: BOTTOMS[(i * 7) % BOTTOMS.length],
      });
    }
    this.stats.pooled = cap;
  }

  private mesh(geo: BoxGeometry | SphereGeometry, mat: MeshLambertMaterial, count: number, name: string) {
    const mesh = new InstancedMesh(geo, mat, count);
    mesh.name = `aw:pedestrians:${name}`;
    mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    mesh.frustumCulled = false; // explicit distance culling compacts the instance buffer
    mesh.castShadow = this.g.real!.q.name !== "low";
    mesh.count = 0;
    return mesh;
  }

  private roadLength(road: Road) {
    let length = 0;
    for (let i = 1; i < road.p.length; i++) {
      length += Math.hypot(road.p[i][0] - road.p[i - 1][0], road.p[i][1] - road.p[i - 1][1]);
    }
    return length;
  }

  private inCorridor(road: Road) {
    const main = road.n === "Caya G.F. Betico Croes";
    const palm = road.n === "J.E. Irausquin Boulevard";
    if (!main && !palm) return false;
    for (let i = 0; i < road.p.length; i++) {
      const x = road.p[i][0], z = road.p[i][1];
      if (main && x > -7550 && x < -6450 && Math.abs(z) < 350) return true;
      const dx = x + 8220, dz = z + 5750;
      if (palm && dx * dx + dz * dz < 1450 * 1450) return true;
    }
    return false;
  }

  private scanRoutes() {
    const amb = this.amb!;
    this.routes = [];
    const seen = new Set<string>();
    for (const region of amb.w.regions.values()) {
      const roads = region.json?.roads;
      if (!roads) continue;
      for (const road of roads) {
        const key = `${road.n}:${road.id}`;
        if (road.u || road.p.length < 2 || seen.has(key) || !this.inCorridor(road)) continue;
        seen.add(key);
        this.routes.push(road);
      }
    }
    this.stats.corridors = this.routes.length;
    if (!this.routes.length) return;
    for (let i = 0; i < this.walkers.length; i++) {
      const w = this.walkers[i];
      if (w.road && this.routes.includes(w.road)) continue;
      const road = this.routes[i % this.routes.length];
      w.road = road;
      w.length = this.roadLength(road);
      w.s = w.length * (((i * 0.61803398875) % 1) * 0.9 + 0.05);
      w.side = (i & 1 ? 1 : -1) * (road.w * 0.5 + 1.45);
    }
  }

  private sample(w: Walker): boolean {
    const road = w.road;
    if (!road) return false;
    let along = 0;
    for (let i = 1; i < road.p.length; i++) {
      const ax = road.p[i - 1][0], az = road.p[i - 1][1];
      const dx = road.p[i][0] - ax, dz = road.p[i][1] - az;
      const length = Math.hypot(dx, dz) || 1;
      if (along + length >= w.s || i === road.p.length - 1) {
        const t = Math.max(0, Math.min(1, (w.s - along) / length));
        const ux = dx / length, uz = dz / length;
        w.x = ax + dx * t - uz * w.side;
        w.z = az + dz * t + ux * w.side;
        w.y = this.amb!.w.surfaceAt(w.x, w.z) + 0.02;
        w.yaw = w.dir > 0 ? Math.atan2(ux, uz) : Math.atan2(-ux, -uz);
        return true;
      }
      along += length;
    }
    return false;
  }

  private put(mesh: InstancedMesh, index: number, x: number, y: number, z: number,
    rx: number, sx: number, sy: number, sz: number) {
    this.pos.set(x, y, z);
    this.quat.setFromAxisAngle(X_AXIS, rx);
    this.scale.set(sx, sy, sz);
    this.local.compose(this.pos, this.quat, this.scale);
    this.world.multiplyMatrices(this.root, this.local);
    mesh.setMatrixAt(index, this.world);
  }

  private drawWalker(w: Walker, index: number, time: number) {
    const gait = Math.sin(time * 7.2 + w.phase);
    const bob = Math.abs(gait) * 0.025;
    this.root.makeRotationY(w.yaw);
    this.root.setPosition(w.x, w.y + bob, w.z);
    this.put(this.head, index, 0, 1.77, 0, 0, 0.18, 0.2, 0.18);
    this.put(this.torso, index, 0, 1.29, 0, 0, 0.34, 0.52, 0.22);
    this.put(this.legs, index * 2, -0.14, 0.64, gait * 0.08, gait * 0.45, 0.11, 0.62, 0.13);
    this.put(this.legs, index * 2 + 1, 0.14, 0.64, -gait * 0.08, -gait * 0.45, 0.11, 0.62, 0.13);
    this.put(this.arms, index * 2, -0.43, 1.26, 0, -gait * 0.5, 0.08, 0.48, 0.09);
    this.put(this.arms, index * 2 + 1, 0.43, 1.26, 0, gait * 0.5, 0.08, 0.48, 0.09);
    this.head.setColorAt(index, this.tint.setHex(w.skin));
    this.torso.setColorAt(index, this.tint.setHex(w.top));
    this.legs.setColorAt(index * 2, this.tint.setHex(w.bottom));
    this.legs.setColorAt(index * 2 + 1, this.tint);
    this.arms.setColorAt(index * 2, this.tint.setHex(w.skin));
    this.arms.setColorAt(index * 2 + 1, this.tint);
  }

  update(dt: number, time: number) {
    if (!this.amb) {
      const amb = (this.g.real as unknown as { amb?: Amb }).amb;
      if (!amb) return;
      this.amb = amb;
      this.scanRoutes();
    }

    // Base pedestrians can finish loading asynchronously; retire them into no pool.
    while (this.amb.peds.length) {
      const ped = this.amb.peds.pop()!;
      ped.g.visible = false;
      ped.g.parent?.remove(ped.g);
    }
    if ((this.scanIn -= dt) <= 0) {
      this.scanIn = 2;
      this.scanRoutes();
    }

    const cam = this.g.camera.position;
    let visible = 0;
    for (const w of this.walkers) {
      if (!w.road || w.length <= 0) continue;
      w.s += w.dir * w.speed * dt;
      if (w.s >= w.length) { w.s = w.length; w.dir = -1; }
      else if (w.s <= 0) { w.s = 0; w.dir = 1; }
      if (!this.sample(w)) continue;
      const dx = w.x - cam.x, dz = w.z - cam.z;
      if (dx * dx + dz * dz > this.lod2) continue;
      this.drawWalker(w, visible++, time);
    }

    this.head.count = visible;
    this.torso.count = visible;
    this.legs.count = visible * 2;
    this.arms.count = visible * 2;
    for (const mesh of this.meshes) {
      if (mesh.count) {
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      }
      mesh.visible = mesh.count > 0;
    }
    this.stats.visible = visible;
    this.stats.draws = visible ? 4 : 0;
    // 36 head + 12 torso + two 12-triangle legs + two 12-triangle arms.
    this.stats.triangles = visible * 96;
  }
}
