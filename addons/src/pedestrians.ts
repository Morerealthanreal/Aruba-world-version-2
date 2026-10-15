// Low-poly, instanced crowds for the Palm Beach hotel strip and Oranjestad's
// Caya G.F. Betico Croes shopping street. Four draws replace A's many skinned
// pedestrian parts, and instance counts drop to zero outside the LOD radius.
// ?peds=0 (or ?life=0) restores A's original pedestrians.
import {
  AnimationMixer, BufferGeometry, Color, CylinderGeometry, DynamicDrawUsage,
  Float32BufferAttribute, Group, InstancedMesh, Matrix4, MeshLambertMaterial,
  Quaternion, SphereGeometry, Vector3, type AnimationAction, type Material,
  type Mesh, type Object3D,
} from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { clone as skClone } from "three/examples/jsm/utils/SkeletonUtils.js";
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
  skin: number; top: number; bottom: number; height: number; build: number;
  d2: number; selected: boolean;
};
type DetailedPed = {
  root: Group; inner: Object3D; mixer: AnimationMixer;
  walk: AnimationAction; idle: AnimationAction; walker: Walker | null; beach: boolean;
  draws: number; triangles: number; scale: number;
};
type DetailedSource = { gl: GLTF; beach: boolean; scale: number };

const TOPS = [0xe95b5b, 0x3d8fcb, 0xf1c84b, 0x4da968, 0xe983b3, 0xe78b45, 0x735db2];
const BOTTOMS = [0x263445, 0x554535, 0xd9d4c7, 0x334c69, 0x313338];
const SKINS = [0x6f3f2b, 0x92583b, 0xb97954, 0xd59a72, 0xedc29e];
const X_AXIS = new Vector3(1, 0, 0);

// Rounded, tapered primitives read as people at street distance without adding
// materials or draw calls. The dark vertex tint makes a built-in hair cap.
const HEAD = (() => {
  const geo = new SphereGeometry(1, 6, 4);
  const p = geo.attributes.position;
  const colors = new Float32Array(p.count * 3);
  for (let i = 0; i < p.count; i++) {
    const x = p.getX(i), y = p.getY(i), z = p.getZ(i);
    if (z > 0.72 && Math.abs(x) < 0.22 && y > -0.18 && y < 0.2) p.setZ(i, z + 0.1);
    const hair = y > 0.28 || (y > 0.05 && z < -0.35);
    colors[i * 3] = hair ? 0.2 : 1;
    colors[i * 3 + 1] = hair ? 0.14 : 1;
    colors[i * 3 + 2] = hair ? 0.1 : 1;
  }
  p.needsUpdate = true;
  geo.setAttribute("color", new Float32BufferAttribute(colors, 3));
  geo.computeVertexNormals();
  return geo;
})();
// Open four-sided tapers stay at eight triangles each. Joints cover the open
// ends, and the far LOD is cheaper than the old six boxes (76 vs 96 triangles).
const TORSO = new CylinderGeometry(0.5, 0.4, 1, 4, 1, true, Math.PI / 4);
const LEG = new CylinderGeometry(0.42, 0.5, 1, 4, 1, true, Math.PI / 4);
const ARM = new CylinderGeometry(0.38, 0.48, 1, 4, 1, true, Math.PI / 4);
const tris = (g: BufferGeometry) => (g.index ? g.index.count : g.attributes.position.count) / 3;
const HEAD_TRIS = tris(HEAD), TORSO_TRIS = tris(TORSO), LEG_TRIS = tris(LEG), ARM_TRIS = tris(ARM);
const DETAIL_MODELS = [
  { file: "ped_casual2_f.glb", beach: false, scale: 0.56 },
  { file: "ped_casual2_m.glb", beach: false, scale: 0.56 },
  { file: "ped_casual3_f.glb", beach: false, scale: 0.56 },
  { file: "ped_casual3_m.glb", beach: false, scale: 0.56 },
  { file: "ped_beach_f.glb", beach: true, scale: 0.98 },
];

export class PedestrianCrowds {
  stats = { pooled: 0, visible: 0, detailed: 0, draws: 0, triangles: 0, corridors: 0 };
  private amb: Amb | null = null;
  private walkers: Walker[] = [];
  private routes: Road[] = [];
  private group = new Group();
  private detailGroup = new Group();
  private details: DetailedPed[] = [];
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
  private near2: number;
  private detail2: number;
  private hideFallback2: number;
  private detailCap: number;
  private legN = 0;
  private armN = 0;
  private detailDraws = 0;
  private detailTriangles = 0;

  constructor(private g: AGame) {
    const tier = g.real!.q.name;
    const cap = tier === "low" ? 18 : tier === "med" ? 32 : 48;
    const lod = tier === "low" ? 190 : 250;
    const near = tier === "low" ? 32 : tier === "med" ? 48 : 64;
    const detail = tier === "low" ? 24 : tier === "med" ? 32 : 40;
    const hideFallback = tier === "low" ? 12 : tier === "med" ? 15 : 18;
    this.detailCap = tier === "low" ? 1 : tier === "med" ? 2 : 3;
    this.lod2 = lod * lod;
    this.near2 = near * near;
    this.detail2 = detail * detail;
    this.hideFallback2 = hideFallback * hideFallback;

    this.group.name = "aw:pedestrians";
    this.detailGroup.name = "aw:pedestrians:detailed";
    const face = new MeshLambertMaterial({ color: 0xffffff, vertexColors: true });
    const skin = new MeshLambertMaterial({ color: 0xffffff });
    const cloth = new MeshLambertMaterial({ color: 0xffffff });
    const pants = new MeshLambertMaterial({ color: 0xffffff });
    this.head = this.mesh(HEAD, face, cap, "heads");
    this.torso = this.mesh(TORSO, cloth, cap, "torsos");
    this.legs = this.mesh(LEG, pants, cap * 4, "legs");
    this.arms = this.mesh(ARM, skin, cap * 4, "arms");
    this.meshes = [this.head, this.torso, this.legs, this.arms];
    this.group.add(this.head, this.torso, this.legs, this.arms);
    g.scene.add(this.group, this.detailGroup);

    for (let i = 0; i < cap; i++) {
      this.walkers.push({
        road: null, length: 0, s: 0, dir: i & 1 ? 1 : -1, side: i & 2 ? 1 : -1,
        speed: 1.05 + (i % 6) * 0.09, phase: (i * 2.399963) % (Math.PI * 2),
        x: 0, y: 0, z: 0, yaw: 0,
        skin: SKINS[(i * 3) % SKINS.length],
        top: TOPS[(i * 5) % TOPS.length],
        bottom: BOTTOMS[(i * 7) % BOTTOMS.length],
        height: 0.92 + (i % 7) * 0.025,
        build: 0.9 + (i % 5) * 0.05,
        d2: Infinity, selected: false,
      });
    }
    this.stats.pooled = cap;
    this.loadDetailed();
  }

  private mesh(geo: BufferGeometry, mat: MeshLambertMaterial, count: number, name: string) {
    const mesh = new InstancedMesh(geo, mat, count);
    mesh.name = `aw:pedestrians:${name}`;
    mesh.instanceMatrix.setUsage(DynamicDrawUsage);
    mesh.frustumCulled = false; // explicit distance culling compacts the instance buffer
    mesh.castShadow = this.g.real!.q.name !== "low";
    mesh.count = 0;
    return mesh;
  }

  private loadDetailed() {
    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    Promise.all(DETAIL_MODELS.map(async (model): Promise<DetailedSource> => ({
      gl: await loader.loadAsync(`./models/${model.file}`),
      beach: model.beach,
      scale: model.scale,
    }))).then((sources) => {
      for (const source of sources) this.details.push(this.makeDetailed(source));
      console.info("[aw-peds] detailed rigs ready", this.details.length);
    }).catch((e) => console.warn("[aw-peds] detailed rigs", e));
  }

  private makeDetailed(source: DetailedSource): DetailedPed {
    const inner = skClone(source.gl.scene);
    inner.rotation.y = Math.PI;
    const root = new Group();
    root.name = source.beach ? "aw:pedestrians:beach-rig" : "aw:pedestrians:casual-rig";
    root.add(inner);
    root.visible = false;
    let draws = 0, triangles = 0;
    inner.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh) return;
      mesh.castShadow = false;
      mesh.receiveShadow = true;
      mesh.frustumCulled = false;
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      // glTF-Transform palettes every clothing/skin colour into one tiny texture.
      // GLTFLoader preserves the old primitive groups even though they now share
      // one material; collapsing those groups makes each skinned mesh one draw.
      if (materials.length > 1 && materials.every((m) => m === materials[0])) {
        const count = mesh.geometry.index?.count || mesh.geometry.attributes.position.count;
        mesh.geometry.clearGroups();
        mesh.geometry.addGroup(0, count, 0);
        mesh.material = materials[0] as Material;
      }
      draws++;
      triangles += tris(mesh.geometry);
    });
    const mixer = new AnimationMixer(inner);
    const clip = (name: string) => source.gl.animations.find((a) => a.name === name) || source.gl.animations[0];
    const walk = mixer.clipAction(clip("Walk"));
    const idle = mixer.clipAction(clip("Idle"));
    walk.play();
    idle.play();
    idle.setEffectiveWeight(0);
    walk.time = this.details.length * 0.37 * walk.getClip().duration;
    this.detailGroup.add(root);
    return { root, inner, mixer, walk, idle, walker: null, beach: source.beach, draws, triangles, scale: source.scale };
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

  private putLeg(w: Walker, x: number, y: number, z: number, angle: number, length: number, width: number) {
    const i = this.legN++;
    this.put(this.legs, i, x, y - Math.cos(angle) * length * 0.5,
      z - Math.sin(angle) * length * 0.5, angle, width, length, width * 1.08);
    this.legs.setColorAt(i, this.tint.setHex(w.bottom));
  }

  private putArm(w: Walker, x: number, y: number, z: number, angle: number, length: number, width: number) {
    const i = this.armN++;
    this.put(this.arms, i, x, y - Math.cos(angle) * length * 0.5,
      z - Math.sin(angle) * length * 0.5, angle, width, length, width);
    this.arms.setColorAt(i, this.tint.setHex(w.skin));
  }

  private drawWalker(w: Walker, index: number, time: number, near: boolean) {
    const gait = Math.sin(time * (5.9 + w.speed) + w.phase);
    const h = w.height, build = w.build;
    const bob = (1 - Math.abs(gait)) * 0.022 * h;
    this.root.makeRotationY(w.yaw);
    this.root.setPosition(w.x, w.y + bob, w.z);
    this.put(this.head, index, 0, 1.67 * h, 0.012, gait * 0.018, 0.17 * build, 0.2, 0.16 * build);
    this.put(this.torso, index, 0, 1.27 * h, 0, -gait * 0.025, 0.42 * build, 0.56 * h, 0.46);
    this.head.setColorAt(index, this.tint.setHex(w.skin));
    this.torso.setColorAt(index, this.tint.setHex(w.top));

    const hipY = 0.99 * h, legX = 0.115 * build;
    if (near) {
      const thigh = 0.44 * h, shin = 0.47 * h;
      const leftA = gait * 0.58, rightA = -leftA;
      const leftKnee = 0.08 + Math.max(0, -gait) * 0.5;
      const rightKnee = 0.08 + Math.max(0, gait) * 0.5;
      this.putLeg(w, -legX, hipY, 0, leftA, thigh, 0.105 * build);
      this.putLeg(w, -legX, hipY - Math.cos(leftA) * thigh, -Math.sin(leftA) * thigh,
        leftA - leftKnee, shin, 0.095 * build);
      this.putLeg(w, legX, hipY, 0, rightA, thigh, 0.105 * build);
      this.putLeg(w, legX, hipY - Math.cos(rightA) * thigh, -Math.sin(rightA) * thigh,
        rightA - rightKnee, shin, 0.095 * build);

      const shoulderY = 1.49 * h, armX = 0.27 * build, upper = 0.34 * h, fore = 0.32 * h;
      const leftA2 = -gait * 0.48, rightA2 = -leftA2;
      const leftElbow = leftA2 - 0.14 - Math.max(0, gait) * 0.18;
      const rightElbow = rightA2 - 0.14 - Math.max(0, -gait) * 0.18;
      this.putArm(w, -armX, shoulderY, 0, leftA2, upper, 0.073 * build);
      this.putArm(w, -armX, shoulderY - Math.cos(leftA2) * upper, -Math.sin(leftA2) * upper,
        leftElbow, fore, 0.065 * build);
      this.putArm(w, armX, shoulderY, 0, rightA2, upper, 0.073 * build);
      this.putArm(w, armX, shoulderY - Math.cos(rightA2) * upper, -Math.sin(rightA2) * upper,
        rightElbow, fore, 0.065 * build);
    } else {
      this.putLeg(w, -legX, hipY, 0, gait * 0.35, 0.89 * h, 0.1 * build);
      this.putLeg(w, legX, hipY, 0, -gait * 0.35, 0.89 * h, 0.1 * build);
      this.putArm(w, -0.27 * build, 1.49 * h, 0, -gait * 0.34, 0.64 * h, 0.069 * build);
      this.putArm(w, 0.27 * build, 1.49 * h, 0, gait * 0.34, 0.64 * h, 0.069 * build);
    }
  }

  private updateDetailed(dt: number) {
    for (const w of this.walkers) w.selected = false;
    if (!this.details.length) {
      this.stats.detailed = 0;
      this.detailDraws = 0;
      this.detailTriangles = 0;
      return;
    }

    // Fixed-size nearest selection: no sort arrays or frame allocations.
    for (let slot = 0; slot < this.detailCap; slot++) {
      let best: Walker | null = null, bestD2 = this.detail2;
      for (const w of this.walkers) {
        if (!w.selected && w.d2 < bestD2) { best = w; bestD2 = w.d2; }
      }
      if (!best) break;
      best.selected = true;
    }

    // Keep a rig attached to the same walker while it remains in the nearest set.
    for (const d of this.details) {
      if (d.walker?.selected) continue;
      d.walker = null;
      d.root.visible = false;
    }
    for (const w of this.walkers) {
      if (!w.selected) continue;
      let assigned = false;
      for (const d of this.details) if (d.walker === w) { assigned = true; break; }
      if (assigned) continue;
      const beach = w.road?.n === "J.E. Irausquin Boulevard";
      let chosen: DetailedPed | null = null;
      for (const d of this.details) {
        if (!d.walker && d.beach === beach) { chosen = d; break; }
      }
      if (!chosen) for (const d of this.details) if (!d.walker) { chosen = d; break; }
      if (chosen) chosen.walker = w;
      else w.selected = false;
    }

    let visible = 0, draws = 0, triangles = 0;
    for (const d of this.details) {
      const w = d.walker;
      if (!w) continue;
      d.root.position.set(w.x, w.y, w.z);
      d.root.rotation.y = w.yaw;
      d.root.scale.setScalar(d.scale * w.height);
      d.root.visible = true;
      d.walk.timeScale = 0.85 + w.speed * 0.18;
      d.walk.setEffectiveWeight(1);
      d.idle.setEffectiveWeight(0);
      d.mixer.update(dt);
      visible++;
      draws += d.draws;
      triangles += d.triangles;
    }
    this.stats.detailed = visible;
    this.detailDraws = draws;
    this.detailTriangles = triangles;
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
    for (const w of this.walkers) {
      w.d2 = Infinity;
      if (!w.road || w.length <= 0) continue;
      w.s += w.dir * w.speed * dt;
      if (w.s >= w.length) { w.s = w.length; w.dir = -1; }
      else if (w.s <= 0) { w.s = 0; w.dir = 1; }
      if (!this.sample(w)) continue;
      const dx = w.x - cam.x, dz = w.z - cam.z;
      const d2 = dx * dx + dz * dz;
      if (d2 > this.lod2) continue;
      w.d2 = d2;
    }

    this.updateDetailed(dt);
    let visible = 0;
    this.legN = 0;
    this.armN = 0;
    for (const w of this.walkers) {
      if (w.d2 === Infinity || w.selected || w.d2 < this.hideFallback2) continue;
      this.drawWalker(w, visible++, time, w.d2 < this.near2);
    }

    this.head.count = visible;
    this.torso.count = visible;
    this.legs.count = this.legN;
    this.arms.count = this.armN;
    for (const mesh of this.meshes) {
      if (mesh.count) {
        mesh.instanceMatrix.needsUpdate = true;
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      }
      mesh.visible = mesh.count > 0;
    }
    this.stats.visible = visible + this.stats.detailed;
    this.stats.draws = (this.head.count ? 1 : 0) + (this.torso.count ? 1 : 0)
      + (this.legs.count ? 1 : 0) + (this.arms.count ? 1 : 0) + this.detailDraws;
    this.stats.triangles = this.head.count * HEAD_TRIS + this.torso.count * TORSO_TRIS
      + this.legs.count * LEG_TRIS + this.arms.count * ARM_TRIS + this.detailTriangles;
  }
}
