// Beach crowds for Palm Beach and Noord, beside the island-wide ambient pedestrians.
// Six CC0 bodies, one shared oil-light shader, and a fixed pool so a phone
// never grows geometries while it walks. Ambient pedestrians keep walking towns and beaches.
// ?peds=0 (or ?life=0) leaves only those ambient pedestrians.
import {
  AnimationMixer, LoopRepeat, Object3D, Quaternion, Scene, Vector3,
  type AnimationAction, type SkinnedMesh,
} from "three";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { AGame } from "./env";
import { BEACH_OUTFITS, bakePerson, type BakedPerson } from "./npcBake";
import { attachBeachWear } from "./npcHats";
import { applyAdultProportions } from "./npcProportions";
import { setOilSun } from "./npcOil";

type Slot = {
  z0: number;
  z: number;
  inland: number;
  /** 0 walk, 1 stand, 2 sit. */
  mode: 0 | 1 | 2;
  phase: number;
  dir: number;
  yawJitter: number;
  /** Stay in the foreground knot instead of leaving the frame. */
  pinned: boolean;
  /** Shore x for a beach other than the Palm Beach coast. Null uses that coast. */
  anchorX: number | null;
  x: number;
  y: number;
  placed: boolean;
};

type SitBone = { bone: Object3D; rest: Quaternion };

type SitPose = {
  ul: SitBone; ur: SitBone; ll: SitBone; lr: SitBone; fl: SitBone; fr: SitBone;
  ankleL: number; ankleR: number;
  footRelL: Quaternion; footRelR: Quaternion;
};

type Rig = {
  root: Object3D;
  mixer: AnimationMixer;
  idle: AnimationAction;
  walk: AnimationAction;
  triangles: number;
  slot: number;
  mode: number;
  sit: SitPose | null;
  /** Standing women on even pool slots lift the left hand while they talk. */
  talk: boolean;
  upperL: Object3D | null;
  lowerL: Object3D | null;
  mouth: Object3D | null;
};

const sitY = new Vector3(0, 1, 0);
const sitDown = new Vector3(0, -1, 0);
const sitForward = new Vector3();
const sitLeft = new Vector3();
const sitTarget = new Vector3();
const sitFrom = new Vector3();
const sitTo = new Vector3();
const sitDelta = new Quaternion();
const sitParentQ = new Quaternion();
const sitWorldQ = new Quaternion();
const sitAnkle = new Vector3();
const sitFootY = new Vector3();

function sitBone(root: Object3D, name: string): SitBone | null {
  const bone = root.getObjectByName(name);
  if (!bone) return null;
  return { bone, rest: bone.quaternion.clone() };
}

/** Ankle sits on the lower-leg +Y axis. The foot bone itself is parented to Root. */
function ankleLength(knee: Object3D, foot: Object3D): number {
  knee.updateWorldMatrix(true, false);
  const local = knee.worldToLocal(foot.getWorldPosition(new Vector3()));
  return Math.max(0.2, local.y);
}

function footRelative(knee: Object3D, foot: Object3D): Quaternion {
  const parentQ = new Quaternion();
  const childQ = new Quaternion();
  knee.getWorldQuaternion(parentQ);
  foot.getWorldQuaternion(childQ);
  return parentQ.invert().multiply(childQ);
}

/** Point the bone's local +Y at a world direction, keeping the captured rest as the twist. */
function bendToward(bone: Object3D, rest: Quaternion, targetWorld: Vector3) {
  const parent = bone.parent;
  if (!parent) return;
  parent.updateWorldMatrix(true, false);
  sitParentQ.copy(parent.getWorldQuaternion(sitParentQ)).invert();
  sitTo.copy(targetWorld).applyQuaternion(sitParentQ);
  if (sitTo.lengthSq() < 1e-8) return;
  sitTo.normalize();
  sitFrom.copy(sitY).applyQuaternion(rest).normalize();
  const align = sitFrom.dot(sitTo);
  if (align > 0.9995) {
    bone.quaternion.copy(rest);
    return;
  }
  if (align < -0.9995) sitDelta.setFromAxisAngle(sitLeft.set(1, 0, 0), Math.PI);
  else sitDelta.setFromUnitVectors(sitFrom, sitTo);
  bone.quaternion.copy(rest).premultiply(sitDelta);
}

/** Move the root-parented foot onto the posed ankle and keep its rest angle to the shin. */
function plantFoot(knee: Object3D, foot: SitBone, ankle: number, relative: Quaternion) {
  const parent = foot.bone.parent;
  if (!parent) return;
  sitAnkle.set(0, ankle, 0);
  knee.updateWorldMatrix(true, false);
  knee.localToWorld(sitAnkle);
  parent.updateWorldMatrix(true, false);
  parent.worldToLocal(sitAnkle);
  foot.bone.position.copy(sitAnkle);
  knee.getWorldQuaternion(sitWorldQ).multiply(relative);
  sitParentQ.copy(parent.getWorldQuaternion(sitParentQ)).invert();
  foot.bone.quaternion.copy(sitParentQ.multiply(sitWorldQ));
  foot.bone.updateMatrix();
}

function poseSit(rig: Rig) {
  const sit = rig.sit;
  if (!sit) return;
  rig.root.updateMatrixWorld(true);
  const e = rig.root.matrixWorld.elements;
  sitForward.set(e[8], 0, e[10]);
  if (sitForward.lengthSq() < 1e-6) sitForward.set(0, 0, 1);
  sitForward.normalize();
  sitLeft.set(e[0], 0, e[2]);
  if (sitLeft.lengthSq() < 1e-6) sitLeft.set(1, 0, 0);
  sitLeft.normalize();
  // Knees up, shins down. Left and right are aimed separately because the
  // two rest frames are not mirrors.
  sitTarget.copy(sitForward).multiplyScalar(0.86).addScaledVector(sitLeft, 0.16).addScaledVector(sitDown, -0.45);
  bendToward(sit.ul.bone, sit.ul.rest, sitTarget);
  sitTarget.copy(sitForward).multiplyScalar(0.86).addScaledVector(sitLeft, -0.16).addScaledVector(sitDown, -0.45);
  bendToward(sit.ur.bone, sit.ur.rest, sitTarget);
  rig.root.updateMatrixWorld(true);
  sitTarget.copy(sitDown).multiplyScalar(0.95).addScaledVector(sitForward, 0.22);
  bendToward(sit.ll.bone, sit.ll.rest, sitTarget);
  bendToward(sit.lr.bone, sit.lr.rest, sitTarget);
  rig.root.updateMatrixWorld(true);
  plantFoot(sit.ll.bone, sit.fl, sit.ankleL, sit.footRelL);
  plantFoot(sit.lr.bone, sit.fr, sit.ankleR, sit.footRelR);
}

function poseTalk(rig: Rig, time: number, standing: boolean) {
  if (rig.mouth) rig.mouth.visible = standing;
  const upper = rig.upperL;
  const lower = rig.lowerL;
  if (!standing || !upper || !lower) return;
  const wave = Math.sin(time * 2.6) * 0.07;
  // The mixer just wrote the clip. Elbow out, hand at the lower chest.
  upper.rotation.set(-1.8, -0.8, -1.2 + wave);
  lower.rotation.set(-2, 0, 0);
}

// West edge of the land, sampled from the island outline. Inland is +X (east).
const COAST: ReadonlyArray<readonly [number, number]> = [
  [-6200, -8218],
  [-6000, -8246],
  [-5800, -8310],
  [-5600, -8404],
  [-5400, -8490],
  [-5300, -8549],
  [-5100, -8680],
  [-5000, -8821],
  [-4800, -8950],
];

function coastX(z: number): number {
  const first = COAST[0];
  const last = COAST[COAST.length - 1];
  if (z <= first[0]) return first[1];
  if (z >= last[0]) return last[1];
  for (let i = 1; i < COAST.length; i++) {
    const a = COAST[i - 1];
    const b = COAST[i];
    if (z <= b[0]) {
      const t = (z - a[0]) / (b[0] - a[0]);
      return a[1] + (b[1] - a[1]) * t;
    }
  }
  return last[1];
}

function buildSlots(): Slot[] {
  const slots: Slot[] = [];
  const push = (
    z: number, inland: number, mode: 0 | 1 | 2, phase: number, pinned: boolean, anchorX: number | null,
  ) => {
    slots.push({
      z0: z, z, inland, mode, phase, pinned, anchorX,
      dir: slots.length & 1 ? 1 : -1,
      yawJitter: ((slots.length * 17) % 9) * 0.14 - 0.56,
      x: 0, y: 0, placed: false,
    });
  };
  // Dense group on the sand at the Palm Beach photo spot, so a standing
  // camera there sees people large in the frame, not a roadside lineup.
  // A knot about 12 m across on the sand, so a camera 8 m away fills the frame.
  const hero: Array<[number, number, 0 | 1 | 2]> = [
    [-5348, 12, 2],
    [-5346, 18, 2],
    [-5345, 14, 0],
    [-5343, 20, 1],
    [-5342, 16, 0],
    [-5340, 11, 0],
    [-5339, 19, 2],
    [-5337, 15, 0],
    [-5336, 13, 1],
    [-5344, 17, 0],
  ];
  hero.forEach(([z, inland, mode], i) => push(z, inland, mode, (i * 0.37) % 1, true, null));
  for (let i = 0; i < 24; i++) {
    const z = -6000 + i * 42;
    if (z > -5400 && z < -5200) continue;
    const inland = 20 + (i % 5) * 16;
    push(z, inland, (i % 2) as 0 | 1, (i * 0.21) % 1, false, null);
  }
  // Noord beach, just north of the Palm strip. Same clothes and the same pool.
  const noord: Array<[number, number, 0 | 1 | 2]> = [
    [-6868, 8, 2],
    [-6862, 16, 1],
    [-6856, 12, 0],
    [-6850, 20, 2],
    [-6844, 10, 1],
    [-6838, 18, 0],
    [-6832, 14, 2],
    [-6826, 22, 0],
  ];
  noord.forEach(([z, inland, mode], i) => push(z, inland, mode, (i * 0.41) % 1, true, -8136));
  return slots;
}

export class PedestrianCrowds {
  stats = {
    pooled: 0, visible: 0, draws: 0, triangles: 0, corridors: 0,
    walking: 0, standing: 0, sitting: 0, ready: 0,
  };
  private rigs: Rig[] = [];
  private slots: Slot[] = [];
  private radius2: number;
  private baked: BakedPerson[] = [];

  constructor(private g: AGame) {
    const tier = g.real!.q.name;
    const cap = tier === "low" ? 6 : tier === "med" ? 9 : 12;
    const radius = tier === "low" ? 46 : tier === "med" ? 64 : 80;
    this.radius2 = radius * radius;
    this.slots = buildSlots();
    this.stats.corridors = this.slots.length;
    this.stats.pooled = cap;
    void this.load(cap);
  }

  private async loadGlb(url: string, tries = 3) {
    let last: unknown;
    for (let attempt = 0; attempt < tries; attempt++) {
      const ctrl = new AbortController();
      const timer = window.setTimeout(() => ctrl.abort(), 15000);
      try {
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`${url} ${res.status}`);
        const buf = await res.arrayBuffer();
        window.clearTimeout(timer);
        return await new GLTFLoader().parseAsync(buf, "");
      } catch (error) {
        window.clearTimeout(timer);
        last = error;
      }
    }
    throw last instanceof Error ? last : new Error(String(last));
  }

  private async load(cap: number) {
    try {
      this.baked = [];
      console.log("[aw-peds] loading beach outfits");
      const missed: typeof BEACH_OUTFITS[number][] = [];
      const baked = new Map<string, BakedPerson>();
      const bake = async (outfit: typeof BEACH_OUTFITS[number], tries: number) => {
        const url = `./models/${outfit.file}`;
        console.log("[aw-peds] fetch", outfit.file);
        const gl = await this.loadGlb(url, tries);
        const person = bakePerson(gl, outfit);
        baked.set(outfit.file, person);
        console.log("[aw-peds] baked", outfit.file, person.triangles);
      };
      // The casual woman is fetched last. She loses the boot race if she goes first.
      const loadOrder = [...BEACH_OUTFITS].sort((a, b) => Number(a.tank === true) - Number(b.tank === true));
      for (const outfit of loadOrder) {
        try {
          await bake(outfit, 3);
        } catch (error) {
          console.warn("[aw-peds] retry later", outfit.file, error);
          missed.push(outfit);
        }
      }
      // The first file often loses the boot race against the single-threaded
      // asset server. Try again once the rest of the page has finished.
      for (const outfit of missed) {
        try {
          await bake(outfit, 2);
        } catch (error) {
          console.warn("[aw-peds] skip", outfit.file, error);
        }
      }
      this.baked = BEACH_OUTFITS.map((outfit) => baked.get(outfit.file)).filter((person): person is BakedPerson => !!person);
      if (!this.baked.length) throw new Error("no beach outfits");
      for (let i = 0; i < cap; i++) {
        const source = this.baked[i % this.baked.length];
        const root = cloneSkinned(source.proto);
        root.name = "aw:beach-crowd";
        root.userData.tank = source.tank;
        root.visible = false;
        applyAdultProportions(root, i);
        let mesh: SkinnedMesh | null = null;
        root.traverse((object) => {
          const skinned = object as SkinnedMesh;
          if (skinned.isSkinnedMesh) mesh = skinned;
        });
        if (!mesh) continue;
        const mixer = new AnimationMixer(root);
        const idle = mixer.clipAction(source.idle);
        const walk = mixer.clipAction(source.walk);
        for (const action of [idle, walk]) {
          action.setLoop(LoopRepeat, Infinity);
          action.play();
          action.setEffectiveWeight(0);
        }
        idle.setEffectiveWeight(1);
        idle.time = (i * 0.37) % source.idle.duration;
        walk.time = (i * 0.37) % source.walk.duration;
        attachBeachWear(root, i, source.skin, source.hair, source.female);
        const ul = sitBone(root, "UpperLegL");
        const ur = sitBone(root, "UpperLegR");
        const ll = sitBone(root, "LowerLegL");
        const lr = sitBone(root, "LowerLegR");
        const fl = sitBone(root, "FootL");
        const fr = sitBone(root, "FootR");
        root.updateMatrixWorld(true);
        const sit = ul && ur && ll && lr && fl && fr ? {
          ul, ur, ll, lr, fl, fr,
          ankleL: ankleLength(ll.bone, fl.bone),
          ankleR: ankleLength(lr.bone, fr.bone),
          footRelL: footRelative(ll.bone, fl.bone),
          footRelR: footRelative(lr.bone, fr.bone),
        } : null;
        this.g.scene.add(root);
        this.rigs.push({
          root, mixer, idle, walk,
          triangles: source.triangles,
          slot: -1,
          mode: -1,
          sit,
          talk: source.female && i % 2 === 0,
          upperL: root.getObjectByName("UpperArmL") ?? null,
          lowerL: root.getObjectByName("LowerArmL") ?? null,
          mouth: root.getObjectByName("aw:mouth") ?? null,
        });
      }
      this.prime();
      this.stats.ready = 1;
      console.log("[aw-peds] beach crowd ready", this.rigs.length);
    } catch (error) {
      console.warn("[aw-peds] beach crowd", error);
    }
  }

  // Draw the pool once, off the island, so the soak does not count those
  // geometries the first time the car comes within sight of the sand.
  private prime() {
    const renderer = this.g.renderer as unknown as { render: (s: unknown, c: unknown) => void };
    const tmp = new Scene();
    for (const rig of this.rigs) {
      this.g.scene.remove(rig.root);
      rig.root.visible = true;
      tmp.add(rig.root);
    }
    try { renderer.render(tmp, this.g.camera); } catch { /* the game loop draws them */ }
    for (const rig of this.rigs) {
      rig.root.visible = false;
      tmp.remove(rig.root);
      this.g.scene.add(rig.root);
    }
  }

  private height(x: number, z: number): number | null {
    const real = this.g.real as unknown as { heightAt?: (x: number, z: number) => number } | null;
    const y = real?.heightAt?.(x, z);
    return typeof y === "number" && Number.isFinite(y) ? y : null;
  }

  private plant(slot: Slot) {
    let inland = slot.inland;
    const shore = slot.anchorX == null ? coastX(slot.z) : slot.anchorX;
    let x = shore + inland;
    let y = this.height(x, slot.z);
    if (y == null) return;
    for (let n = 0; n < 8 && y < 0.35; n++) {
      inland += 10;
      x = shore + inland;
      y = this.height(x, slot.z) ?? y;
    }
    if (y < 0.25 || y > 4.2) return;
    slot.inland = inland;
    slot.x = x;
    slot.y = y;
    slot.placed = true;
  }

  private yaw(slot: Slot): number {
    if (slot.anchorX != null) {
      if (slot.mode === 0) return (slot.dir > 0 ? 0 : Math.PI) + slot.yawJitter * 0.25;
      return Math.PI / 2 + slot.yawJitter;
    }
    const along = Math.atan2(coastX(slot.z + 3) - coastX(slot.z - 3), 6);
    if (slot.mode === 0) return (slot.dir > 0 ? along : along + Math.PI) + slot.yawJitter * 0.25;
    // Model forward is +Z. Water is west (−X), so yaw +π/2 looks out to sea.
    return Math.PI / 2 + slot.yawJitter;
  }

  update(dt: number, _time: number) {
    const sky = this.g.real?.sky?.sunDir;
    if (sky) setOilSun(sky.x, sky.y, sky.z);
    if (!this.rigs.length) return;

    for (const slot of this.slots) {
      if (slot.mode === 0) {
        if (slot.pinned) slot.z = slot.z0 + Math.sin((slot.phase + _time * 0.35) * Math.PI) * 2.4;
        else {
          slot.z += slot.dir * 1.05 * dt;
          if (slot.z > -4900) slot.dir = -1;
          else if (slot.z < -6150) slot.dir = 1;
        }
        slot.placed = false;
      }
      if (!slot.placed) this.plant(slot);
    }

    const cam = this.g.camera.position;
    const near: number[] = [];
    for (let i = 0; i < this.slots.length; i++) {
      const slot = this.slots[i];
      if (!slot.placed) continue;
      const dx = slot.x - cam.x;
      const dz = slot.z - cam.z;
      const d2 = dx * dx + dz * dz;
      if (d2 > this.radius2) continue;
      near.push(i);
    }
    near.sort((a, b) => {
      const sa = this.slots[a];
      const sb = this.slots[b];
      const da = (sa.x - cam.x) ** 2 + (sa.z - cam.z) ** 2;
      const db = (sb.x - cam.x) ** 2 + (sb.z - cam.z) ** 2;
      return da - db;
    });

    const used = new Set<number>();
    let visible = 0;
    let triangles = 0;
    let walking = 0;
    let standing = 0;
    let sitting = 0;
    for (let r = 0; r < this.rigs.length; r++) {
      const rig = this.rigs[r];
      const index = near[r];
      if (index == null || used.has(index)) {
        rig.root.visible = false;
        rig.slot = -1;
        continue;
      }
      used.add(index);
      const slot = this.slots[index];
      rig.root.visible = true;
      rig.root.position.set(slot.x, slot.y, slot.z);
      rig.root.rotation.y = this.yaw(slot);
      if (rig.slot !== index || rig.mode !== slot.mode) {
        rig.slot = index;
        rig.mode = slot.mode;
        const moving = slot.mode === 0;
        rig.walk.setEffectiveWeight(moving ? 1 : 0);
        rig.idle.setEffectiveWeight(moving ? 0 : 1);
        if (moving) rig.walk.time = slot.phase * rig.walk.getClip().duration;
        else rig.idle.time = slot.phase * rig.idle.getClip().duration;
      }
      rig.mixer.update(dt);
      if (slot.mode === 2 && rig.sit) {
        poseSit(rig);
        rig.root.updateMatrixWorld(true);
        const leftFoot = rig.sit.fl.bone.getWorldPosition(sitAnkle).y;
        const rightFoot = rig.sit.fr.bone.getWorldPosition(sitFootY).y;
        rig.root.position.y += slot.y + 0.06 - Math.min(leftFoot, rightFoot);
      }
      if (rig.talk) poseTalk(rig, _time, slot.mode === 1);
      visible++;
      triangles += rig.triangles;
      if (slot.mode === 0) walking++;
      else if (slot.mode === 2) sitting++;
      else standing++;
    }
    this.stats.visible = visible;
    this.stats.draws = visible;
    this.stats.triangles = triangles;
    this.stats.walking = walking;
    this.stats.standing = standing;
    this.stats.sitting = sitting;
  }
}
