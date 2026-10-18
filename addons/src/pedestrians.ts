// Realistic, skinned crowds for the Palm Beach hotel strip and Oranjestad's
// Caya G.F. Betico Croes shopping street. The route pool and motion below are
// unchanged; this module only replaces the visible representation.
// ?peds=0 (or ?life=0) restores A's original pedestrians.
import {
  AnimationMixer, Group, type AnimationAction, type Object3D, type SkinnedMesh,
} from "three";
import { createLoco, slewYaw, stepLoco, type Loco } from "./locomotion";
import { clone as skClone } from "three/examples/jsm/utils/SkeletonUtils.js";
import {
  acquireCharacterBones, adoptSceneBoneTextures, disposeForeignCharacter, FACE_CARD_TRIS,
  findCharacterFace, releaseCharacterLoader, setCharacterPortrait,
  updateCharacterPaint, type CharacterMetrics, type CharacterPaint,
} from "./characters";
import type { AGame } from "./env";
import { NPC_CAST } from "./npcCast";
import { NpcImpostors } from "./npcImpostors";
import { loadOilCrowd, oilClips, oilTriangles, type OilPerson } from "./oilPerson";

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
  height: number; breadth: number; d2: number; style: number; lod: 0 | 1 | 2;
  cast: number; hold: number; pauseAt: number;
};
type RigLevel = "near" | "mid";
type CharacterRig = {
  root: Group; inner: Object3D; mixer: AnimationMixer;
  loco: Loco | null;
  walk: AnimationAction | null; idle: AnimationAction | null; walker: Walker | null;
  facing: number;
  kind: number; cast: number; level: RigLevel; metrics: CharacterMetrics;
  paints: CharacterPaint[];
  faceMesh: SkinnedMesh | null; faceHead: Object3D | null;
};
type RenderStats = { visible: number; draws: number; triangles: number };

const NEAR2 = 22 * 22;
const VISIBLE2 = 60 * 60;
// Painted faces only for the closest people. The projection adds no triangles.
const FACE2 = 8 * 8;
const FACE_CAP = 3;

export class PedestrianCrowds {
  stats = {
    pooled: 0, visible: 0, detailed: 0, near: 0, mid: 0, far: 0,
    draws: 0, triangles: 0, corridors: 0,
  };
  private amb: Amb | null = null;
  private walkers: Walker[] = [];
  private routes: Road[] = [];
  private detailGroup = new Group();
  private nearRigs: CharacterRig[] = [];
  private midRigs: CharacterRig[] = [];
  private scanIn = 0;
  private nearCap: number;
  private midCap: number;
  private midAnimDt = 0;
  private nearStats: RenderStats = { visible: 0, draws: 0, triangles: 0 };
  private midStats: RenderStats = { visible: 0, draws: 0, triangles: 0 };
  private faceRank: CharacterRig[] = [];
  private impostors: NpcImpostors;
  private far2: number;
  private midHz: number;

  constructor(private g: AGame) {
    const tier = g.real!.q.name;
    const cap = tier === "low" ? 18 : tier === "med" ? 32 : 48;
    const lineup = new URLSearchParams(location.search).get("pedshot") === "1";
    this.nearCap = lineup ? 12 : tier === "low" ? 4 : 6;
    // Keep the worst-case crowd below 60k triangles after runtime merging:
    // LOW = 4 near + 10 mid, MED/HIGH = 6 near + 6 mid. The lineup uses 12 near.
    this.midCap = lineup ? 0 : tier === "low" ? 10 : 6;
    // Match the block crowd's visibility so the street does not go empty.
    // Past 60 m these are billboards, two triangles each.
    this.far2 = (tier === "low" ? 190 : 250) * (tier === "low" ? 190 : 250);
    this.midHz = tier === "low" ? 12 : 20;
    this.impostors = new NpcImpostors(NPC_CAST, cap, g.renderer);

    this.detailGroup.name = "aw:pedestrians:realistic";
    g.scene.add(this.detailGroup);
    g.scene.add(this.impostors.group);

    for (let i = 0; i < cap; i++) {
      const cast = NPC_CAST[i % NPC_CAST.length];
      this.walkers.push({
        road: null, length: 0, s: 0, dir: i & 1 ? 1 : -1, side: i & 2 ? 1 : -1,
        speed: 1.05 + (i % 6) * 0.09, phase: (i * 2.399963) % (Math.PI * 2),
        x: 0, y: 0, z: 0, yaw: 0,
        height: cast.height, breadth: cast.breadth,
        d2: Infinity, style: i, lod: 0,
        cast: cast.id, hold: 0, pauseAt: 0,
      });
    }
    this.stats.pooled = cap;
    this.loadRigs();
  }

  private loadRigs() {
    loadOilCrowd(this.g.renderer).then((people) => {
      const byId = new Map<number, OilPerson>(people.map((person) => [person.id, person]));
      for (let i = 0; i < this.nearCap; i++) {
        const cast = NPC_CAST[i % NPC_CAST.length];
        const person = byId.get(cast.id);
        if (person) this.nearRigs.push(this.makeRig(person, "near"));
      }
      for (let i = 0; i < this.midCap; i++) {
        const cast = NPC_CAST[(i + this.nearCap) % NPC_CAST.length];
        const person = byId.get(cast.id);
        if (person) this.midRigs.push(this.makeRig(person, "mid"));
      }
      releaseCharacterLoader();
      adoptSceneBoneTextures(this.g.scene);
      console.info("[aw-peds] oil crowd ready", this.nearRigs.length, this.midRigs.length);
    }).catch((error) => console.warn("[aw-peds] oil crowd", error instanceof Error ? error.stack || error.message : error));
  }

  private makeRig(person: OilPerson, level: RigLevel): CharacterRig {
    const cast = NPC_CAST[person.id % NPC_CAST.length];
    const inner = skClone(person.gl.scene);
    // These meshes face +Z. A half turn brings the face onto the street heading.
    inner.rotation.y = Math.PI;
    acquireCharacterBones(inner, this.g.renderer);
    const phase = cast.id * 1.61803398875;
    const face = findCharacterFace(inner);
    const root = new Group();
    root.name = `aw:pedestrians:${level}:${cast.name}`;
    root.add(inner);
    root.visible = false;
    const loco = createLoco(inner, oilClips(person.gl), phase);
    this.detailGroup.add(root);
    return {
      root, inner, mixer: loco.mixer, loco, walk: null, idle: null, walker: null, facing: 0,
      kind: cast.kind, cast: cast.id, level,
      metrics: { draws: 6, triangles: oilTriangles(inner) },
      paints: [],
      faceMesh: face.mesh, faceHead: face.head,
    };
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
      const walker = this.walkers[i];
      if (walker.road && this.routes.includes(walker.road)) continue;
      const road = this.routes[i % this.routes.length];
      walker.road = road;
      walker.length = this.roadLength(road);
      walker.s = walker.length * (((i * 0.61803398875) % 1) * 0.9 + 0.05);
      walker.side = (i & 1 ? 1 : -1) * (road.w * 0.5 + 1.45);
      const span = 12 + (walker.cast % 5) * 3;
      walker.pauseAt = walker.dir > 0
        ? Math.min(walker.length - 0.5, walker.s + span)
        : Math.max(0.5, walker.s - span);
    }
  }

  private sample(walker: Walker): boolean {
    const road = walker.road;
    if (!road) return false;
    let along = 0;
    for (let i = 1; i < road.p.length; i++) {
      const ax = road.p[i - 1][0], az = road.p[i - 1][1];
      const dx = road.p[i][0] - ax, dz = road.p[i][1] - az;
      const length = Math.hypot(dx, dz) || 1;
      if (along + length >= walker.s || i === road.p.length - 1) {
        const t = Math.max(0, Math.min(1, (walker.s - along) / length));
        const ux = dx / length, uz = dz / length;
        walker.x = ax + dx * t - uz * walker.side;
        walker.z = az + dz * t + ux * walker.side;
        // Sole cluster sits ~1.5 cm above the toe plant. This puts that sole on the pavement.
        walker.y = this.amb!.w.surfaceAt(walker.x, walker.z) - 0.016;
        walker.yaw = walker.dir > 0 ? Math.atan2(ux, uz) : Math.atan2(-ux, -uz);
        return true;
      }
      along += length;
    }
    return false;
  }

  private selectNearest(lod: 1 | 2, count: number, maxD2: number) {
    for (let slot = 0; slot < count; slot++) {
      let best: Walker | null = null;
      let bestD2 = maxD2;
      for (const walker of this.walkers) {
        if (walker.lod === 0 && walker.d2 < bestD2) {
          best = walker;
          bestD2 = walker.d2;
        }
      }
      if (!best) break;
      best.lod = lod;
    }
  }

  private claim(pool: CharacterRig[], walker: Walker) {
    const kind = NPC_CAST[walker.cast].kind;
    for (const rig of pool) if (!rig.walker && rig.cast === walker.cast) return rig;
    for (const rig of pool) if (!rig.walker && rig.kind === kind) return rig;
    for (const rig of pool) if (!rig.walker) return rig;
    return null;
  }

  private assignPool(pool: CharacterRig[], lod: 1 | 2) {
    for (const rig of pool) {
      if (rig.walker?.lod === lod) continue;
      rig.walker = null;
      rig.root.visible = false;
    }
    for (const walker of this.walkers) {
      if (walker.lod !== lod) continue;
      let assigned = false;
      for (const rig of pool) {
        if (rig.walker === walker) {
          assigned = true;
          break;
        }
      }
      if (assigned) continue;
      const chosen = this.claim(pool, walker);
      if (chosen) {
        chosen.walker = walker;
        chosen.facing = walker.yaw;
      }
    }
  }

  private animatePool(pool: CharacterRig[], dt: number, time: number, result: RenderStats) {
    result.visible = 0;
    result.draws = 0;
    result.triangles = 0;
    for (const rig of pool) {
      const walker = rig.walker;
      if (!walker) continue;
      rig.root.position.set(walker.x, walker.y, walker.z);
      rig.facing = slewYaw(rig.facing, walker.yaw, walker.speed, dt);
      rig.root.rotation.y = rig.facing;
      rig.root.scale.set(walker.height * walker.breadth, walker.height, walker.height * walker.breadth);
      rig.root.visible = true;
      const speed = walker.hold > 0 ? 0 : walker.speed;
      if (rig.loco) {
        if (dt > 0) {
          stepLoco(rig.loco, speed, dt, walker.height);
        }
      } else if (rig.walk && dt > 0) {
        rig.walk.timeScale = 0.85 + walker.speed * 0.18;
        rig.mixer.update(dt);
      }
      const sky = (this.g.real as unknown as { sky?: { sunDir?: { x: number; y: number; z: number } } }).sky;
      updateCharacterPaint(rig.paints, time, sky?.sunDir);
      result.visible++;
      result.draws += rig.metrics.draws;
      result.triangles += rig.metrics.triangles;
    }
  }

  private updateDetailed(dt: number, time: number) {
    for (const walker of this.walkers) walker.lod = 0;
    if (!this.nearRigs.length && !this.midRigs.length) {
      this.stats.visible = this.stats.detailed = this.stats.near = this.stats.mid = 0;
      this.stats.draws = this.stats.triangles = 0;
      return;
    }

    this.selectNearest(1, this.nearRigs.length, NEAR2);
    if (this.midRigs.length) this.selectNearest(2, this.midRigs.length, VISIBLE2);
    this.assignPool(this.nearRigs, 1);
    if (this.midRigs.length) this.assignPool(this.midRigs, 2);

    this.midAnimDt += dt;
    let midStep = 0;
    if (this.midAnimDt >= 1 / this.midHz) {
      midStep = this.midAnimDt;
      this.midAnimDt = 0;
    }
    this.animatePool(this.nearRigs, dt, time, this.nearStats);
    this.animatePool(this.midRigs, midStep, time, this.midStats);
    this.applyFaceLod();
    this.stats.near = this.nearStats.visible;
    this.stats.mid = this.midStats.visible;
    this.stats.visible = this.stats.detailed = this.nearStats.visible + this.midStats.visible;
    this.stats.draws = this.nearStats.draws + this.midStats.draws;
    this.stats.triangles = this.nearStats.triangles + this.midStats.triangles;
  }

  /** Turn the painted face on for a placed rig, after its bones have moved. */
  focusPortrait(rig: CharacterRig, enabled = true) {
    setCharacterPortrait(rig.paints, enabled, rig.faceMesh, rig.faceHead);
  }

  private applyFaceLod() {
    const rank = this.faceRank;
    rank.length = 0;
    for (const rig of this.nearRigs) {
      const walker = rig.walker;
      if (walker && rig.root.visible && walker.d2 <= FACE2) rank.push(rig);
    }
    rank.sort((a, b) => a.walker!.d2 - b.walker!.d2);
    for (const rig of this.nearRigs) {
      let on = false;
      for (let i = 0; i < FACE_CAP && i < rank.length; i++) if (rank[i] === rig) on = true;
      setCharacterPortrait(rig.paints, on, rig.faceMesh, rig.faceHead);
      if (on) {
        this.nearStats.draws += 1;
        this.nearStats.triangles += FACE_CARD_TRIS;
      }
    }
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
      disposeForeignCharacter(ped.g);
    }
    if ((this.scanIn -= dt) <= 0) {
      this.scanIn = 2;
      this.scanRoutes();
    }

    const camera = this.g.camera.position;
    const pin = this.studioPin();
    if (pin) this.placeStudio(pin);
    else {
      for (const walker of this.walkers) {
        walker.d2 = Infinity;
        if (!walker.road || walker.length <= 0) continue;
        if (walker.hold > 0) walker.hold -= dt;
        else {
          walker.s += walker.dir * walker.speed * dt;
          const span = 12 + (walker.cast % 5) * 3;
          if (walker.dir > 0 && walker.s >= walker.pauseAt) {
            walker.hold = 2.2 + (walker.cast % 4) * 0.55;
            walker.pauseAt = walker.s + span;
          } else if (walker.dir < 0 && walker.s <= walker.pauseAt) {
            walker.hold = 2.2 + (walker.cast % 4) * 0.55;
            walker.pauseAt = walker.s - span;
          }
        }
        if (walker.s >= walker.length) {
          walker.s = walker.length;
          walker.dir = -1;
          walker.pauseAt = Math.max(0.5, walker.s - (12 + (walker.cast % 5) * 3));
        } else if (walker.s <= 0) {
          walker.s = 0;
          walker.dir = 1;
          walker.pauseAt = Math.min(walker.length - 0.5, 12 + (walker.cast % 5) * 3);
        }
        if (!this.sample(walker)) continue;
        const dx = walker.x - camera.x, dz = walker.z - camera.z;
        const d2 = dx * dx + dz * dz;
        if (d2 <= this.far2) walker.d2 = d2;
      }
    }
    this.updateDetailed(dt, time);
    this.updateFar(time, camera.x, camera.z);
  }

  /** Capture hook. `{ x, z, yaw, walk? }` pins twelve people for stills. */
  private studioPin() {
    const pin = (globalThis as unknown as {
      __awStudio?: { x: number; z: number; yaw?: number; walk?: boolean };
    }).__awStudio;
    if (!pin || !Number.isFinite(pin.x) || !Number.isFinite(pin.z)) return null;
    return pin;
  }

  private placeStudio(pin: { x: number; z: number; yaw?: number; walk?: boolean }) {
    const yaw = pin.yaw ?? 0;
    for (let i = 0; i < this.walkers.length; i++) {
      const walker = this.walkers[i];
      if (i >= 12 || !this.amb) {
        walker.d2 = Infinity;
        continue;
      }
      const cast = NPC_CAST[i];
      walker.cast = cast.id;
      walker.height = cast.height;
      walker.breadth = cast.breadth;
      walker.hold = pin.walk ? 0 : 1000;
      walker.x = pin.x + (i - 5.5) * 1.25;
      walker.z = pin.z;
      walker.y = this.amb.w.surfaceAt(walker.x, walker.z) - 0.016;
      walker.yaw = yaw;
      walker.d2 = 9;
    }
  }

  private updateFar(time: number, camX: number, camZ: number) {
    this.impostors.begin();
    const shown = new Set<Walker>();
    for (const rig of this.nearRigs) if (rig.root.visible && rig.walker) shown.add(rig.walker);
    for (const rig of this.midRigs) if (rig.root.visible && rig.walker) shown.add(rig.walker);
    for (const walker of this.walkers) {
      if (!(walker.d2 <= this.far2)) continue;
      if (shown.has(walker)) continue;
      this.impostors.add(
        walker.cast, walker.x, walker.y, walker.z, walker.yaw,
        walker.height, walker.breadth, walker.hold <= 0,
      );
    }
    this.impostors.finish(time, camX, camZ);
    this.stats.far = this.impostors.visible;
    this.stats.visible = this.stats.detailed + this.impostors.visible;
    this.stats.draws += this.impostors.draws;
    this.stats.triangles += this.impostors.triangles;
  }

  /** Sidewalk positions for crowd stills. */
  crowdPoints() {
    const points: { x: number; y: number; z: number; cast: number; d2: number }[] = [];
    for (const walker of this.walkers) {
      if (walker.x === 0 && walker.z === 0) continue;
      points.push({ x: walker.x, y: walker.y, z: walker.z, cast: walker.cast, d2: walker.d2 });
    }
    return points;
  }
}
