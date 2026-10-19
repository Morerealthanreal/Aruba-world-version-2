// Beach crowd for Palm Beach, added beside the island-wide ambient pedestrians.
// Six CC0 bodies, one shared oil-light shader, and a fixed pool so a phone
// never grows geometries while it walks. The crowd stands on the sand west of
// J.E. Irausquin. Ambient pedestrians keep walking towns and beaches.
// ?peds=0 (or ?life=0) leaves only those ambient pedestrians.
import {
  AnimationMixer, LoopRepeat, Object3D, Scene,
  type AnimationAction, type SkinnedMesh,
} from "three";
import { clone as cloneSkinned } from "three/examples/jsm/utils/SkeletonUtils.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import type { AGame } from "./env";
import { BEACH_OUTFITS, bakePerson, type BakedPerson } from "./npcBake";
import { attachBeachWear } from "./npcHats";
import { setOilSun } from "./npcOil";
import { applyAdultProportions } from "./npcProportions";

type Slot = {
  z0: number;
  z: number;
  inland: number;
  /** 0 walk, 1 stand. Sitting is a later pass. */
  mode: 0 | 1;
  phase: number;
  dir: number;
  yawJitter: number;
  /** Stay in the Palm Beach foreground instead of leaving the frame. */
  pinned: boolean;
  x: number;
  y: number;
  placed: boolean;
};

type Rig = {
  root: Object3D;
  mixer: AnimationMixer;
  idle: AnimationAction;
  walk: AnimationAction;
  triangles: number;
  slot: number;
  mode: number;
};

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
  const push = (z: number, inland: number, mode: 0 | 1, phase: number, pinned: boolean) => {
    slots.push({
      z0: z, z, inland, mode, phase, pinned,
      dir: slots.length & 1 ? 1 : -1,
      yawJitter: ((slots.length * 17) % 9) * 0.14 - 0.56,
      x: 0, y: 0, placed: false,
    });
  };
  // Dense group on the sand at the Palm Beach photo spot, so a standing
  // camera there sees people large in the frame, not a roadside lineup.
  // A knot about 12 m across on the sand, so a camera 8 m away fills the frame.
  const hero: Array<[number, number, 0 | 1]> = [
    [-5348, 12, 1],
    [-5346, 18, 1],
    [-5345, 14, 0],
    [-5343, 20, 1],
    [-5342, 16, 0],
    [-5340, 11, 0],
    [-5339, 19, 1],
    [-5337, 15, 0],
    [-5336, 13, 1],
    [-5344, 17, 0],
  ];
  hero.forEach(([z, inland, mode], i) => push(z, inland, mode, (i * 0.37) % 1, true));
  for (let i = 0; i < 24; i++) {
    const z = -6000 + i * 42;
    if (z > -5400 && z < -5200) continue;
    const inland = 20 + (i % 5) * 16;
    push(z, inland, (i % 2) as 0 | 1, (i * 0.21) % 1, false);
  }
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

  private async loadGlb(url: string) {
    let last: unknown;
    for (let attempt = 0; attempt < 3; attempt++) {
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
      for (const outfit of BEACH_OUTFITS) {
        const url = `./models/${outfit.file}`;
        try {
          console.log("[aw-peds] fetch", outfit.file);
          const gl = await this.loadGlb(url);
          this.baked.push(bakePerson(gl, outfit));
          console.log("[aw-peds] baked", outfit.file, this.baked[this.baked.length - 1].triangles);
        } catch (error) {
          console.warn("[aw-peds] skip", outfit.file, error);
        }
      }
      if (!this.baked.length) throw new Error("no beach outfits");
      for (let i = 0; i < cap; i++) {
        const source = this.baked[i % this.baked.length];
        const root = cloneSkinned(source.proto);
        root.name = "aw:beach-crowd";
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
        this.g.scene.add(root);
        this.rigs.push({
          root, mixer, idle, walk,
          triangles: source.triangles,
          slot: -1,
          mode: -1,
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
    let x = coastX(slot.z) + inland;
    let y = this.height(x, slot.z);
    if (y == null) return;
    for (let n = 0; n < 8 && y < 0.35; n++) {
      inland += 10;
      x = coastX(slot.z) + inland;
      y = this.height(x, slot.z) ?? y;
    }
    if (y < 0.25 || y > 4.2) return;
    slot.inland = inland;
    slot.x = x;
    slot.y = y;
    slot.placed = true;
  }

  private yaw(slot: Slot): number {
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
      visible++;
      triangles += rig.triangles;
      if (slot.mode === 0) walking++;
      else standing++;
    }
    this.stats.visible = visible;
    this.stats.draws = visible;
    this.stats.triangles = triangles;
    this.stats.walking = walking;
    this.stats.standing = standing;
    this.stats.sitting = 0;
  }
}
