// Families: ~40% of A's ambient pedestrians walk with 1-2 children (rarely 3) at their side.
// Children are the same rigged ped models re-proportioned (not just shrunk): ~0.62 overall,
// head x1.3, legs/arms ~0.9, torso 0.95, re-applied after every animation update; brighter
// kids' clothes. Gait: Walk_Brisk at a faster cadence to keep the adult's pace (Jog if needed).
// Pool is small (<= 2 per adult ped, capped), no shadows on phones. Off with ?kids=0.
import { AnimationMixer, Color, Group, Vector3, type AnimationAction, type Object3D } from "three";
import { GLTFLoader, type GLTF } from "three/examples/jsm/loaders/GLTFLoader.js";
import { clone as skClone } from "three/examples/jsm/utils/SkeletonUtils.js";
import type { AGame } from "./env";

type Ped = { g: Object3D & { position: Vector3; rotation: { y: number } }; rd: unknown; sp?: number; pedFlip?: number; __fam?: number; __rd?: unknown };
type Kid = { root: Group; inner: Object3D; mixer: AnimationMixer; walk: AnimationAction; jog: AnimationAction; bones: Array<[Object3D, number]>; ped: Ped | null; slot: number; applied?: boolean };

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
  constructor(private g: AGame, mobile: boolean) {
    const tier = (g.real as unknown as { q: { name: string } }).q.name;
    this.cap = tier === "low" ? 3 : tier === "med" ? 8 : 14;
    this.shadows = !mobile;
    this.group.name = "aw:kids";
    (g.scene as unknown as { add(o: Object3D): void }).add(this.group as unknown as Object3D);
    const L = new GLTFLoader();
    Promise.all(["ped_maya", "ped_sam"].map((n) => L.loadAsync(`./models/${n}.glb`))).then((a) => { this.gl = a; console.info("[aw-kids] models", a.map((g) => g.animations.map((c) => c.name).join("|"))); }).catch((e) => console.warn("[aw-kids]", e));
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
    root.visible = false;
    this.group.add(root);
    this.stats.kids++;
    return { root, inner, mixer, walk, jog, bones, ped: null, slot: 0 };
  }

  update(dt: number) {
    const amb = (this.g.real as unknown as { amb?: { peds: Ped[] } }).amb;
    if (!amb || !this.gl.length) return; // wait for the kid models before assigning families
    const cam = (this.g.camera as unknown as { position: Vector3 }).position;
    const surf = (this.g.real as unknown as { surfaceAt(x: number, z: number): number });
    // (re)assign families when a ped starts a new route
    for (const p of amb.peds) {
      p.pedFlip = 1; // A's ped placement faced them backwards (car heading convention); bundle hook adds PI
      if (p.rd !== p.__rd) {
        p.__rd = p.rd;
        for (const k of this.pool) if (k.ped === p) { k.ped = null; k.root.visible = false; }
        p.__fam = 0;
        if (p.rd && Math.random() < 0.4) {
          const r = Math.random(); p.__fam = r < 0.06 ? 3 : r < 0.5 ? 2 : 1;
          for (let s = 0; s < p.__fam; s++) {
            let k = this.pool.find((q) => !q.ped);
            if (!k && this.pool.length < this.cap) { const m = this.make(this.pool.length); if (m) { this.pool.push(m); k = m; } }
            if (!k) break;
            k.ped = p; k.slot = s;
          }
        }
      }
    }
    let vis = 0, fam = 0;
    const seen = new Set<Ped>();
    for (const k of this.pool) {
      const p = k.ped;
      if (!p || !p.rd || !p.g.visible) { k.root.visible = false; continue; }
      const pp = p.g.position;
      if (cam.distanceToSquared(pp) > 140 * 140) { k.root.visible = false; continue; }
      if (!seen.has(p)) { seen.add(p); fam++; }
      const ry = p.g.rotation.y, fx = -Math.sin(ry), fz = -Math.cos(ry); // walking direction
      const side = k.slot === 1 ? -1 : 1, lat = k.slot === 2 ? 0 : 0.75 * side, back = k.slot === 2 ? 0.9 : 0.15;
      const x = pp.x + fz * lat - fx * back, z = pp.z - fx * lat - fz * back;
      k.root.position.set(x, surf.surfaceAt(x, z) + 0.02, z);
      k.root.rotation.y = ry;
      k.root.visible = true; vis++;
      // match the adult's pace: clip speed scales with body size
      const sp = p.sp || 1.3, size = k.root.scale.x, ts = sp / (1.8 * size);
      const jogW = ts > 1.45 ? 1 : 0;
      k.walk.setEffectiveWeight(1 - jogW); k.jog.setEffectiveWeight(jogW);
      k.walk.timeScale = Math.min(1.6, ts); k.jog.timeScale = Math.min(1.3, sp / (3.2 * size));
      if (k.applied) for (const [b, s] of k.bones) b.scale.divideScalar(s); // undo last frame (if the clip has no scale track)
      k.mixer.update(dt);
      k.applied = true;
      for (const [b, s] of k.bones) b.scale.multiplyScalar(s); // child proportions on top of the clip pose
    }
    this.stats.visible = vis; this.stats.families = fam;
  }
}
