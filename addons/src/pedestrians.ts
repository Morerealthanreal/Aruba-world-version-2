// Beach crowds for Palm Beach, Noord, Eagle Beach, Oranjestad, Malmok, and Baby Beach, beside the
// island-wide ambient pedestrians.
// Six CC0 bodies, one shared oil-light shader, and a fixed pool so a phone
// never grows geometries while it walks. Ambient pedestrians keep walking towns and beaches.
// ?peds=0 (or ?life=0) leaves only those ambient pedestrians.
import {
  AnimationMixer, BufferGeometry, LoopRepeat, Object3D, Quaternion, Scene, Vector3,
  type AnimationAction, type SkinnedMesh,
} from "three";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { AGame } from "./env";
import { BEACH_OUTFITS, bakePerson, holdGeometry, type BakedPerson } from "./npcBake";
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
  /** Sand height used until the Noord heightfield streams in. */
  fallbackY: number | null;
  /** Standing on fallbackY, still waiting for a real ground sample. */
  provisional: boolean;
};

type SitBone = { bone: Object3D; rest: Quaternion };

type SitPose = {
  ul: SitBone; ur: SitBone; ll: SitBone; lr: SitBone; fl: SitBone; fr: SitBone;
  ankleL: number; ankleR: number;
  footRelL: Quaternion; footRelR: Quaternion;
};

type Rig = {
  root: Object3D;
  /** Body and accessory meshes. The root stays visible so a hidden rig is still one shared geometry. */
  parts: Object3D[];
  mixer: AnimationMixer;
  idle: AnimationAction;
  walk: AnimationAction;
  triangles: number;
  slot: number;
  mode: number;
  /** Shown on a nearby slot. Kids follow this, not the root, which stays in the scene. */
  shown: boolean;
  sit: SitPose | null;
  /** Standing women on even pool slots lift the left hand while they talk. */
  talk: boolean;
  upperL: Object3D | null;
  lowerL: Object3D | null;
  mouth: Object3D | null;
};

function displayParts(root: Object3D): Object3D[] {
  const parts: Object3D[] = [];
  root.traverse((object) => {
    const mesh = object as SkinnedMesh;
    if (mesh.geometry) holdGeometry(mesh.geometry as BufferGeometry);
    if ((mesh.isMesh || mesh.isSkinnedMesh) && mesh.visible) parts.push(object);
  });
  return parts;
}

function showParts(parts: Object3D[], on: boolean) {
  for (const part of parts) part.visible = on;
}

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
      fallbackY: null,
      provisional: false,
    });
  };
  // Deck rims and doors. Read from the hotel heroes; this file does not move them.
  // A few metres east of each pool centroid so they stand on the deck, not in the water.
  const hotels: Array<[number, number, number?]> = [
    [-8410, -5339], // Hilton pool deck
    [-8208, -5328], // Hilton entrance, inland of the tower
    [-8468, -5192], // Riu Palace pool deck
    [-8436, -5174], // Riu Palace entrance
    [-8305, -5579], // Barceló pool deck
    [-8196, -5583], // Barceló entrance
    [-8268, -5699], // Hyatt pool deck
    [-8192, -5723], // Hyatt entrance
    [-7805, -6180], // Radisson pool deck
    [-7815, -6156], // Radisson entrance
    [-8146, -6209], // Holiday Inn pool deck
    [-8110, -6229], // Holiday Inn entrance
    [-7998, -6567], // Marriott pool deck (Noord end of the strip)
    [-8100, -6711, 2.3], // Marriott entrance, sand west of the tower
    [-7920, -6441], // Marriott Surf Club
  ];
  hotels.forEach(([x, z, fallbackY], i) => {
    slots.push({
      z0: z, z, inland: 0, mode: 1, phase: (i * 0.29) % 1, pinned: true,
      dir: 1,
      yawJitter: ((slots.length * 17) % 9) * 0.14 - 0.56,
      x, y: fallbackY ?? 0, placed: false,
      anchorX: x,
      fallbackY: fallbackY ?? null,
      provisional: false,
    });
  });
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
  // Eagle Beach, south of Palm. The shore is the west edge around this z.
  const eagle: Array<[number, number, 0 | 1 | 2]> = [
    [-3112, 64, 1],
    [-3104, 52, 2],
    [-3096, 58, 0],
    [-3088, 70, 1],
    [-3080, 48, 2],
    [-3072, 62, 0],
    [-3064, 54, 1],
    [-3056, 68, 0],
  ];
  eagle.forEach(([z, inland, mode], i) => push(z, inland, mode, (i * 0.29) % 1, true, -9720));
  // Oranjestad waterfront. Inland walks off the harbor onto the walk.
  const ora: Array<[number, number, 0 | 1 | 2]> = [
    [168, 52, 0],
    [176, 48, 1],
    [184, 56, 2],
    [192, 44, 0],
    [200, 52, 1],
    [160, 60, 2],
    [208, 40, 0],
    [152, 48, 1],
  ];
  ora.forEach(([z, inland, mode], i) => push(z, inland, mode, (i * 0.33) % 1, true, -7360));
  // Malmok sand notch. OSM beach way 255368366; each person stands 4–8 m
  // east of that waterline, on the cove sand (DEM about 0.8–1.0 m), short of the stair.
  const malmok: Array<[number, number, number, 0 | 1 | 2]> = [
    [-8831, -8928, 4, 1],
    [-8829, -8927, 6, 2],
    [-8828, -8926, 4, 0],
    [-8827, -8923, 8, 1],
    [-8832, -8930, 6, 0],
    [-8828, -8925, 8, 2],
  ];
  malmok.forEach(([x, z, inland, mode], i) => push(z, inland, mode, (i * 0.27) % 1, true, x));
  // Baby Beach sand beside the palapas. The shore runs east-west, so each
  // person has their own x. East is inland, toward Big Mama; plant() steps
  // that way if a sample is still in the lagoon.
  const baby: Array<[number, number, number, 0 | 1 | 2]> = [
    [9606, 11676, 4, 1],
    [9661, 11680, 4, 2],
    [9716, 11674, 4, 0],
    [9766, 11682, 4, 1],
    [9686, 11678, 6, 0],
    [9736, 11670, 6, 2],
  ];
  baby.forEach(([x, z, inland, mode], i) => push(z, inland, mode, (i * 0.31) % 1, true, x));
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
  /** Slots outside this stay frozen. The pool is not rebuilt as the car drives. */
  private awake2: number;
  private baked: BakedPerson[] = [];
  /** Draw the shared pool again after the first region unload, a few times only. */
  private primeLeft = 4;
  private primeWait = 0;

  constructor(private g: AGame) {
    const tier = g.real!.q.name;
    // Low and med draw every colorway: older adults, the linen shirt, and the
    // sea-green hoodie. The pool is primed up front, so those geometries are
    // not new on a later lap.
    const cap = tier === "low" || tier === "med" ? BEACH_OUTFITS.length : 12;
    const radius = tier === "low" ? 46 : tier === "med" ? 64 : 80;
    this.radius2 = radius * radius;
    this.awake2 = (radius + 180) * (radius + 180);
    this.slots = buildSlots();
    this.stats.corridors = this.slots.length;
    this.stats.pooled = cap;
    void this.load(cap);
  }

  private async loadBuffer(url: string, tries = 3) {
    let last: unknown;
    for (let attempt = 0; attempt < tries; attempt++) {
      const ctrl = new AbortController();
      const timer = window.setTimeout(() => ctrl.abort(), 15000);
      try {
        const res = await fetch(url, { signal: ctrl.signal });
        if (!res.ok) throw new Error(`${url} ${res.status}`);
        const buf = await res.arrayBuffer();
        window.clearTimeout(timer);
        return buf;
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
      // One download per GLB. Colorways parse a copy so an older adult and a
      // linen shirt can share the casual man without a second fetch.
      const files = [...new Set(BEACH_OUTFITS.map((outfit) => outfit.file))];
      files.sort((a, b) => Number(a.includes("w-casual")) - Number(b.includes("w-casual")));
      const buffers = new Map<string, ArrayBuffer>();
      const missed: string[] = [];
      for (const file of files) {
        try {
          console.log("[aw-peds] fetch", file);
          buffers.set(file, await this.loadBuffer(`./models/${file}`, 3));
        } catch (error) {
          console.warn("[aw-peds] retry later", file, error);
          missed.push(file);
        }
      }
      for (const file of missed) {
        try {
          buffers.set(file, await this.loadBuffer(`./models/${file}`, 2));
        } catch (error) {
          console.warn("[aw-peds] skip", file, error);
        }
      }
      const people: BakedPerson[] = [];
      for (const outfit of BEACH_OUTFITS) {
        const buf = buffers.get(outfit.file);
        if (!buf) continue;
        try {
          const gl = await new GLTFLoader().parseAsync(buf.slice(0), "");
          const person = bakePerson(gl, outfit);
          people.push(person);
          console.log("[aw-peds] baked", outfit.file, outfit.hair.toString(16), person.triangles);
        } catch (error) {
          console.warn("[aw-peds] skip colorway", outfit.file, error);
        }
      }
      this.baked = people;
      if (!this.baked.length) throw new Error("no beach outfits");
      for (let i = 0; i < cap; i++) {
        const source = this.baked[i % this.baked.length];
        const root = cloneSkinned(source.proto);
        root.name = "aw:beach-crowd";
        root.userData.tank = source.tank;
        // The root stays in the render tree. Hiding it made the phone soak skip
        // the shared body until a later lap walked into Eagle or Oranjestad.
        root.visible = true;
        applyAdultProportions(root, i, source.older);
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
        const parts = displayParts(root);
        showParts(parts, false);
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
          root, parts, mixer, idle, walk,
          triangles: source.triangles,
          slot: -1,
          mode: -1,
          shown: false,
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
  // The rigs stay on the game scene afterwards. Shared body and accessory
  // geometries are created here, never per visit.
  private prime() {
    const renderer = this.g.renderer as unknown as { render: (s: unknown, c: unknown) => void };
    const tmp = new Scene();
    for (const rig of this.rigs) {
      this.g.scene.remove(rig.root);
      showParts(rig.parts, true);
      tmp.add(rig.root);
    }
    try { renderer.render(tmp, this.g.camera); } catch { /* the game loop draws them */ }
    for (const rig of this.rigs) {
      showParts(rig.parts, rig.shown);
      tmp.remove(rig.root);
      this.g.scene.add(rig.root);
    }
  }

  private slotNear(slot: Slot, camX: number, camZ: number): boolean {
    const x = slot.placed ? slot.x : (slot.anchorX ?? coastX(slot.z)) + slot.inland;
    const dx = x - camX;
    const dz = slot.z - camZ;
    return dx * dx + dz * dz <= this.awake2;
  }

  private height(x: number, z: number): number | null {
    const real = this.g.real as unknown as { heightAt?: (x: number, z: number) => number } | null;
    const y = real?.heightAt?.(x, z);
    return typeof y === "number" && Number.isFinite(y) ? y : null;
  }

  private plant(slot: Slot) {
    if (slot.anchorX != null && slot.inland === 0) {
      // A pool centroid can sample the hotel roof. Step toward the water,
      // then inland, until the ground is a deck or the sand by the door.
      const fit = (x: number) => {
        const y = this.height(x, slot.z);
        return y != null && y >= 0.3 && y <= 3.2 ? y : null;
      };
      let x = slot.anchorX;
      let y = fit(x);
      for (let n = 0; y == null && n < 28; n++) y = fit(x -= 4);
      if (y == null) {
        x = slot.anchorX;
        for (let n = 0; y == null && n < 16; n++) y = fit(x += 4);
      }
      if (y == null) {
        // Noord is not streamed yet. Stand on the measured sand instead of y 0.
        if (slot.fallbackY == null) return;
        slot.x = slot.anchorX;
        slot.y = slot.fallbackY;
        slot.placed = true;
        slot.provisional = true;
        return;
      }
      slot.x = x;
      slot.y = y;
      slot.placed = true;
      slot.provisional = false;
      return;
    }
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
    if ((y < 0.25 || y > 4.2) && slot.anchorX != null) {
      let found = false;
      for (let step = 1; step <= 8 && !found; step++) {
        for (const sign of [1, -1]) {
          const trial = shore + inland + sign * step * 8;
          const hy = this.height(trial, slot.z);
          if (hy != null && hy >= 0.4 && hy <= 4.2) {
            x = trial;
            y = hy;
            found = true;
            break;
          }
        }
      }
      if (!found) return;
    } else if (y < 0.25 || y > 4.2) return;
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

    if (this.primeLeft > 0) {
      this.primeWait += dt;
      if (this.primeWait > 8) {
        this.primeWait = 0;
        this.primeLeft--;
        this.prime();
      }
    }

    const cam = this.g.camera.position;
    for (const slot of this.slots) {
      if (!this.slotNear(slot, cam.x, cam.z)) continue;
      if (slot.mode === 0) {
        const before = slot.z;
        if (slot.pinned) slot.z = slot.z0 + Math.sin((slot.phase + _time * 0.35) * Math.PI) * 2.4;
        else {
          slot.z += slot.dir * 1.05 * dt;
          if (slot.z > -4900) slot.dir = -1;
          else if (slot.z < -6150) slot.dir = 1;
        }
        // A walker only needs a new ground sample after a real step.
        // Slots the car is nowhere near stay where they were planted.
        if (!slot.placed || Math.abs(slot.z - before) > 8) slot.placed = false;
      }
      if (!slot.placed || slot.provisional) this.plant(slot);
    }

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
        rig.shown = false;
        showParts(rig.parts, false);
        rig.slot = -1;
        continue;
      }
      used.add(index);
      const slot = this.slots[index];
      rig.shown = true;
      showParts(rig.parts, true);
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
