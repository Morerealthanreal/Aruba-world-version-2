// Families: ~40% of nearby walkers have 1-2 children at their side.
// Ambient pedestrians and beach-crowd walkers share one pool, and it follows
// the camera, so Noord, Eagle, Malmok, and Oranjestad get families too.
// Children are the same rigged ped models re-proportioned
// (not just shrunk): ~0.62 overall, head x1.3, legs/arms ~0.9, torso 0.95, re-applied
// after every animation update; brighter kids' clothes, tops and trousers kept.
// Gait: Walk_Brisk at a faster cadence to keep the adult's pace (Jog if needed).
// Pool is small (<= 2 per adult ped, capped per tier), no shadows on phones. Off with ?kids=0.
import { AnimationMixer, BufferGeometry, Color, Group, Scene, Vector3, type AnimationAction, type Object3D, type SkinnedMesh, type Texture } from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as skClone } from "three/examples/jsm/utils/SkeletonUtils.js";
import type { AGame } from "./env";
import { holdGeometry } from "./npcBake";

type Ped = { g: Object3D & { position: Vector3; rotation: { y: number } }; rd: unknown; sp?: number; pedFlip?: number; __fam?: number; __rd?: unknown };
type Kid = { root: Group; inner: Object3D; parts: Object3D[]; mixer: AnimationMixer; walk: AnimationAction; jog: AnimationAction; bones: Array<[Object3D, number]>; follow: number; slot: number; applied?: boolean };
type CrowdRig = { mode: number; shown?: boolean; root: Object3D & { position: Vector3; rotation: { y: number }; visible: boolean } };

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
type Follow = { key: number; want: number; pos: Vector3; ry: number; sp: number };

const NEAR2 = 140 * 140;

/** Stable ~40% of walkers, one or two children. The same adult keeps the same count. */
function familySize(key: number): 0 | 1 | 2 {
  const n = Math.abs((key * 1103515245 + 12345) | 0) % 100;
  if (n >= 40) return 0;
  return n < 20 ? 1 : 2;
}

const BONES: Record<string, number> = { head: 1.3, thigh_l: 0.9, thigh_r: 0.9, upperarm_l: 0.9, upperarm_r: 0.9, spine_01: 0.95 };
const KID_TOPS = [0xff5a5f, 0x3fa7ff, 0xffd23f, 0x5ed16a, 0xff8fd1, 0xff9b3d, 0x9b6bff];

export class Kids {
  stats = { kids: 0, families: 0, visible: 0 };
  private gl: GLTF[] = [];
  private pool: Kid[] = [];
  private group = new Group();
  private cap: number;
  private shadows: boolean;
  private v = new Vector3();
  private ready: Promise<void>;
  private primeLeft = 4;
  private primeWait = 0;
  constructor(private g: AGame, mobile: boolean) {
    const tier = (g.real as unknown as { q: { name: string } }).q.name;
    this.cap = tier === "low" ? 3 : tier === "med" ? 8 : 14;
    this.shadows = !mobile;
    this.group.name = "aw:kids";
    (g.scene as unknown as { add(o: Object3D): void }).add(this.group as unknown as Object3D);
    this.ready = this.boot();
  }

  whenReady(): Promise<void> {
    return this.ready;
  }

  private async boot() {
    try {
      const L = new GLTFLoader();
      const a = await Promise.all(["ped_maya", "ped_sam"].map((n) => L.loadAsync(`./models/${n}.glb`)));
      this.gl = a;
      // Build the whole capped pool now so the soak does not allocate kids mid-drive.
      for (let i = 0; i < this.cap; i++) {
        const m = this.make(i);
        if (m) this.pool.push(m);
      }
      this.prime();
      console.info("[aw-kids] models", a.map((g) => g.animations.map((c) => c.name).join("|")));
    } catch (e) {
      console.warn("[aw-kids]", e);
    }
  }

  // Upload the two ped GLBs once, when they arrive, so the soak's later cycles
  // do not see a new batch of textures. Draw only the kids, not the island.
  private prime() {
    const renderer = this.g.renderer as unknown as { initTexture?: (t: Texture) => void; render: (s: unknown, c: unknown) => void };
    const seen = new Set<Texture>();
    const keys = ["map", "normalMap", "roughnessMap", "metalnessMap", "aoMap", "emissiveMap"];
    for (const gl of this.gl) {
      gl.scene.traverse((o) => {
        const mesh = o as unknown as { material?: { [k: string]: unknown } | Array<{ [k: string]: unknown }> };
        const mats = !mesh.material ? [] : Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        for (const mat of mats) {
          for (const key of keys) {
            const tex = mat[key] as Texture | undefined;
            if (!tex || !tex.isTexture || seen.has(tex)) continue;
            seen.add(tex);
            try { renderer.initTexture?.(tex); } catch { /* the kid draw uploads */ }
          }
        }
      });
    }
    const home = this.group.parent;
    const tmp = new Scene();
    tmp.add(this.group);
    for (const k of this.pool) showParts(k.parts, true);
    try { renderer.render(tmp, this.g.camera); } catch { /* the game loop draws them */ }
    for (const k of this.pool) showParts(k.parts, k.follow >= 0);
    if (home) home.add(this.group);
  }

  private make(i: number): Kid | null {
    if (!this.gl.length) return null;
    const src = this.gl[i % this.gl.length];
    const inner = skClone(src.scene);
    inner.rotation.y = Math.PI; // same convention as A's ped wrapper
    const root = new Group(); root.add(inner); root.scale.setScalar(0.6 + (i % 3) * 0.04);
    const top = new Color(KID_TOPS[i % KID_TOPS.length]);
    const bones: Array<[Object3D, number]> = [];
    inner.traverse((o) => {
      const m = o as unknown as { isMesh?: boolean; isSkinnedMesh?: boolean; material?: { clone(): unknown; name?: string; color?: Color }; castShadow: boolean; frustumCulled: boolean; visible: boolean; name: string };
      if (m.isMesh || m.isSkinnedMesh) {
        m.castShadow = this.shadows; m.frustumCulled = false;
        if (/accessory|held/i.test(m.name)) m.visible = false;
        if (m.material) { const mt = m.material.clone() as { name?: string; color?: Color }; if (/top/i.test(mt.name || "") && mt.color) mt.color.copy(top); (o as unknown as { material: unknown }).material = mt; }
      }
      if (BONES[o.name]) bones.push([o, BONES[o.name]]);
    });
    const mixer = new AnimationMixer(inner);
    const clip = (n: string) => src.animations.find((a) => a.name === n) || src.animations[0];
    const walk = mixer.clipAction(clip("Walk_Brisk")), jog = mixer.clipAction(clip("Jog"));
    walk.play(); jog.play(); jog.setEffectiveWeight(0);
    walk.time = Math.random() * walk.getClip().duration;
    // One clone per pool slot. The root stays visible so the shared GLB
    // geometries are uploaded with the rest of the scene, not on a later lap.
    const parts = displayParts(root);
    showParts(parts, false);
    root.visible = true;
    this.group.add(root);
    this.stats.kids++;
    return { root, inner, parts, mixer, walk, jog, bones, follow: -1, slot: 0 };
  }

  update(dt: number) {
    if (!this.gl.length) return; // wait for the kid models before assigning families
    if (this.primeLeft > 0 && this.pool.length) {
      this.primeWait += dt;
      if (this.primeWait > 8) {
        this.primeWait = 0;
        this.primeLeft--;
        this.prime();
      }
    }
    const amb = (this.g.real as unknown as { amb?: { peds: Ped[] } }).amb;
    const cam = (this.g.camera as unknown as { position: Vector3 }).position;
    const surf = (this.g.real as unknown as { surfaceAt(x: number, z: number): number });
    const near = (x: number, z: number) => {
      const dx = x - cam.x;
      const dz = z - cam.z;
      return dx * dx + dz * dz <= NEAR2;
    };
    const wanted: Follow[] = [];
    if (amb) {
      // A's ped placement faced them backwards. The bundle hook adds PI.
      for (let i = 0; i < amb.peds.length; i++) {
        const p = amb.peds[i];
        p.pedFlip = 1;
        const pos = p.g.position;
        if (!p.rd || !p.g.visible || !near(pos.x, pos.z)) continue;
        const want = familySize(i + 1);
        if (!want) continue;
        wanted.push({ key: i + 1, want, pos, ry: p.g.rotation.y, sp: p.sp || 1.3 });
      }
    }
    // Beach-crowd walkers at Palm Beach, Noord, Eagle, and Oranjestad. The
    // same pool follows whoever is near the camera, so Malmok's ambient
    // walkers are not left without children.
    const crowd = (window as unknown as { __aw?: { peds?: { rigs?: CrowdRig[] } } }).__aw?.peds;
    const rigs = crowd?.rigs;
    if (rigs) {
      for (let i = 0; i < rigs.length; i++) {
        const rig = rigs[i];
        if (rig.mode !== 0 || !rig.shown) continue;
        const pos = rig.root.position;
        if (!near(pos.x, pos.z)) continue;
        const want = familySize(500 + i);
        if (!want) continue;
        wanted.push({ key: 500 + i, want, pos, ry: rig.root.rotation.y, sp: 1.05 });
      }
    }
    const byKey = new Map<number, Follow>();
    for (const adult of wanted) byKey.set(adult.key, adult);
    for (const k of this.pool) {
      const adult = byKey.get(k.follow);
      if (!adult || k.slot >= adult.want) {
        k.follow = -1;
        showParts(k.parts, false);
      }
    }
    for (const adult of wanted) {
      let have = 0;
      for (const k of this.pool) if (k.follow === adult.key) have++;
      for (let s = have; s < adult.want; s++) {
        const k = this.pool.find((q) => q.follow < 0);
        if (!k) break;
        k.follow = adult.key;
        k.slot = s;
      }
    }
    let vis = 0, fam = 0;
    const seen = new Set<number>();
    for (const k of this.pool) {
      const adult = byKey.get(k.follow);
      if (!adult) { showParts(k.parts, false); continue; }
      if (!seen.has(adult.key)) { seen.add(adult.key); fam++; }
      const ry = adult.ry;
      const fx = -Math.sin(ry);
      const fz = -Math.cos(ry);
      const side = k.slot === 1 ? -1 : 1;
      const lat = 0.75 * side;
      const back = 0.15;
      const x = adult.pos.x + fz * lat - fx * back;
      const z = adult.pos.z - fx * lat - fz * back;
      const ground = surf.surfaceAt(x, z);
      const y = ground > 0.2 ? ground + 0.02 : adult.pos.y;
      k.root.position.set(x, y, z);
      k.root.rotation.y = ry;
      showParts(k.parts, true);
      vis++;
      const sp = adult.sp;
      const size = k.root.scale.x;
      const ts = sp / (1.8 * size);
      const jogW = ts > 1.45 ? 1 : 0;
      k.walk.setEffectiveWeight(1 - jogW);
      k.jog.setEffectiveWeight(jogW);
      k.walk.timeScale = Math.min(1.6, ts);
      k.jog.timeScale = Math.min(1.3, sp / (3.2 * size));
      if (k.applied) for (const [b, s] of k.bones) b.scale.divideScalar(s);
      k.mixer.update(dt);
      k.applied = true;
      for (const [b, s] of k.bones) b.scale.multiplyScalar(s);
    }
    this.stats.visible = vis;
    this.stats.families = fam;
  }
}
