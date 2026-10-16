// Realistic, skinned crowds for the Palm Beach hotel strip and Oranjestad's
// Caya G.F. Betico Croes shopping street. The route pool and motion below are
// unchanged; this module only replaces the visible representation.
// ?peds=0 (or ?life=0) restores A's original pedestrians.
import {
  AnimationMixer, Group, type AnimationAction, type Object3D, type SkinnedMesh,
} from "three";
import type { GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as skClone } from "three/examples/jsm/utils/SkeletonUtils.js";
import {
  CHARACTER_PALETTES, FACE_CARD_TRIS, findCharacterFace, loadCharacterSource, loadFacePortraits,
  setCharacterPortrait, styleCharacter,
  updateCharacterPaint, type CharacterMetrics, type CharacterPaint,
} from "./characters";
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
  height: number; d2: number; style: number; lod: 0 | 1 | 2;
};
type RigLevel = "near" | "mid";
type CharacterSource = {
  gl: GLTF; kind: number; level: RigLevel; metrics: CharacterMetrics;
};
type CharacterRig = {
  root: Group; inner: Object3D; mixer: AnimationMixer;
  walk: AnimationAction; idle: AnimationAction; walker: Walker | null;
  kind: number; level: RigLevel; metrics: CharacterMetrics;
  paints: CharacterPaint[];
  faceMesh: SkinnedMesh | null; faceHead: Object3D | null;
};
type RenderStats = { visible: number; draws: number; triangles: number };

const MODEL_SPECS: ReadonlyArray<{ file: string; kind: number; level: RigLevel }> = [
  { file: "ped_maya_near.glb", kind: 0, level: "near" },
  { file: "ped_maya_dress_near.glb", kind: 1, level: "near" },
  { file: "ped_sam_near.glb", kind: 2, level: "near" },
  { file: "ped_maya_mid.glb", kind: 0, level: "mid" },
  { file: "ped_maya_dress_mid.glb", kind: 1, level: "mid" },
  { file: "ped_sam_mid.glb", kind: 2, level: "mid" },
];
const NEAR2 = 22 * 22;
const VISIBLE2 = 60 * 60;
// Painted faces only for the closest people. The projection adds no triangles.
const FACE2 = 8 * 8;
const FACE_CAP = 3;

export class PedestrianCrowds {
  stats = {
    pooled: 0, visible: 0, detailed: 0, near: 0, mid: 0,
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

  constructor(private g: AGame) {
    const tier = g.real!.q.name;
    const cap = tier === "low" ? 18 : tier === "med" ? 32 : 48;
    this.nearCap = tier === "low" ? 4 : 6;
    // Keep the worst-case crowd below 60k triangles after runtime merging:
    // LOW = 4 near + 10 mid, MED/HIGH = 6 near + 6 mid.
    this.midCap = tier === "low" ? 10 : 6;

    this.detailGroup.name = "aw:pedestrians:realistic";
    g.scene.add(this.detailGroup);

    for (let i = 0; i < cap; i++) {
      this.walkers.push({
        road: null, length: 0, s: 0, dir: i & 1 ? 1 : -1, side: i & 2 ? 1 : -1,
        speed: 1.05 + (i % 6) * 0.09, phase: (i * 2.399963) % (Math.PI * 2),
        x: 0, y: 0, z: 0, yaw: 0,
        height: 0.92 + (i % 7) * 0.025,
        d2: Infinity, style: i, lod: 0,
      });
    }
    this.stats.pooled = cap;
    this.loadRigs();
  }

  private loadRigs() {
    void loadFacePortraits();
    Promise.all(MODEL_SPECS.map(async (spec): Promise<CharacterSource> => {
      const source = await loadCharacterSource(this.g.renderer, spec.file);
      return {
        gl: source.gl, kind: spec.kind, level: spec.level, metrics: source.metrics,
      };
    })).then((sources) => {
      for (let i = 0; i < this.nearCap; i++) {
        const kind = i % 3;
        this.nearRigs.push(this.makeRig(sources.find((source) =>
          source.level === "near" && source.kind === kind)!, i));
      }
      for (let i = 0; i < this.midCap; i++) {
        const kind = (i + 1) % 3;
        this.midRigs.push(this.makeRig(sources.find((source) =>
          source.level === "mid" && source.kind === kind)!, i + this.nearCap));
      }
      console.info("[aw-peds] realistic rig LODs ready", this.nearRigs.length, this.midRigs.length);
    }).catch((error) => console.warn("[aw-peds] realistic rig LODs", error));
  }

  private makeRig(source: CharacterSource, slot: number): CharacterRig {
    const inner = skClone(source.gl.scene);
    inner.rotation.y = Math.PI;
    const phase = slot * 1.61803398875;
    const selected = CHARACTER_PALETTES[(slot * 2 + source.kind) % CHARACTER_PALETTES.length];
    const palette = source.kind === 1 ? { ...selected, top: selected.dress } : selected;
    const paints = styleCharacter(inner, palette, phase, source.kind, source.level === "near");
    const face = findCharacterFace(inner);
    const root = new Group();
    root.name = `aw:pedestrians:${source.level}:${source.kind}`;
    root.add(inner);
    root.visible = false;

    const mixer = new AnimationMixer(inner);
    const clip = (name: string) =>
      source.gl.animations.find((animation) => animation.name === name) || source.gl.animations[0];
    const walk = mixer.clipAction(clip("Walk_Relaxed"));
    const idle = mixer.clipAction(clip("Idle_Standing"));
    walk.play();
    idle.play();
    walk.setEffectiveWeight(1);
    idle.setEffectiveWeight(0);
    walk.time = (phase % 1) * walk.getClip().duration;
    this.detailGroup.add(root);
    return {
      root, inner, mixer, walk, idle, walker: null, kind: source.kind,
      level: source.level, metrics: source.metrics, paints,
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
        walker.y = this.amb!.w.surfaceAt(walker.x, walker.z) + 0.02;
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

  private preferredKind(walker: Walker) {
    // Deterministic variety: one third are elegant long-haired dress variants.
    // Palm Beach naturally receives the same full mix without changing routes.
    return walker.style % 3;
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
      const preferred = this.preferredKind(walker);
      let chosen: CharacterRig | null = null;
      for (const rig of pool) {
        if (!rig.walker && rig.kind === preferred) {
          chosen = rig;
          break;
        }
      }
      if (!chosen) {
        for (const rig of pool) {
          if (!rig.walker) {
            chosen = rig;
            break;
          }
        }
      }
      if (chosen) chosen.walker = walker;
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
      rig.root.rotation.y = walker.yaw;
      rig.root.scale.setScalar(walker.height);
      rig.root.visible = true;
      rig.walk.timeScale = 0.85 + walker.speed * 0.18;
      if (dt > 0) rig.mixer.update(dt);
      const sky = (this.g.real as unknown as { sky?: { sunDir?: { x: number; y: number; z: number } } }).sky;
      updateCharacterPaint(rig.paints, time, sky?.sunDir);
      result.visible++;
      result.draws += rig.metrics.draws;
      result.triangles += rig.metrics.triangles;
    }
  }

  private updateDetailed(dt: number, time: number) {
    for (const walker of this.walkers) walker.lod = 0;
    if (!this.nearRigs.length || !this.midRigs.length) {
      this.stats.visible = this.stats.detailed = this.stats.near = this.stats.mid = 0;
      this.stats.draws = this.stats.triangles = 0;
      return;
    }

    this.selectNearest(1, this.nearCap, NEAR2);
    this.selectNearest(2, this.midCap, VISIBLE2);
    this.assignPool(this.nearRigs, 1);
    this.assignPool(this.midRigs, 2);

    this.midAnimDt += dt;
    let midStep = 0;
    if (this.midAnimDt >= 1 / 30) {
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
    }
    if ((this.scanIn -= dt) <= 0) {
      this.scanIn = 2;
      this.scanRoutes();
    }

    const camera = this.g.camera.position;
    for (const walker of this.walkers) {
      walker.d2 = Infinity;
      if (!walker.road || walker.length <= 0) continue;
      walker.s += walker.dir * walker.speed * dt;
      if (walker.s >= walker.length) {
        walker.s = walker.length;
        walker.dir = -1;
      } else if (walker.s <= 0) {
        walker.s = 0;
        walker.dir = 1;
      }
      if (!this.sample(walker)) continue;
      const dx = walker.x - camera.x, dz = walker.z - camera.z;
      const d2 = dx * dx + dz * dz;
      if (d2 <= VISIBLE2) walker.d2 = d2;
    }
    this.updateDetailed(dt, time);
  }
}
