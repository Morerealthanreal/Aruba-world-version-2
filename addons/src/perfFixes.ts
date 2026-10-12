// Perf fixes for A's engine, applied from outside (window.game) plus three tiny
// inert hooks in the bundle copy (window.__awPost, window.__awMMDiv). See PERF.md.
// Off with ?perf=0. Force the phone profile on desktop with ?perfmobile=1 (or off with =0).
//
//  1. Car glass: A's player car (car.glb) uses KHR_materials_transmission on 5 window
//     meshes. Any visible transmissive material makes three.js re-render every opaque
//     object into a transmission target each frame (+~700 draw calls on LOW at spawn,
//     ~2x triangles). Swap it for plain alpha glass.
//  2. Static matrices: ~40k objects in A's tiles (one InstancedMesh per building kit /
//     parked-car lot) get updateMatrix() + multiplyMatrices every frame. Region,
//     monument, brand and hero groups never move, so their updateMatrixWorld only
//     re-runs when their child list changes.
//  3. Merge monuments / brand signs (hundreds of tiny Box meshes each, 400-700 draws
//     at spawn) into one mesh per material per landmark.
//  4. Building kit (AC units, window frames...) stops casting shadows: ~1M triangles
//     of the HIGH shadow pass for almost no visible shadow.
//  5. Phone profile (touch devices) on HIGH: pixel ratio 2 -> 1.5, GTAO off, shadow
//     map 4096 -> 2048, stream radius 2000 -> 1400 m and shorter detail ranges.
//     On MED: pixel ratio 1.5 -> 1.35 (B's MED).
//  6. Hero models: hidden beyond a tier distance (A shows them to 2 km on every tier).
//  7. Minimap 2D canvas redrawn every 3rd frame instead of every frame.
import { BufferGeometry, Matrix4, Mesh, type Material, type Object3D } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { TileInstances } from "./tileInst";
import { params } from "./env";

type Obj = Object3D & { isMesh?: boolean; isInstancedMesh?: boolean; isSkinnedMesh?: boolean; geometry?: BufferGeometry; material?: Material | Material[] };
type Region = { group?: Obj; state: string };
type Hero = { group?: Obj; list: Array<{ x: number; z: number; _g?: Obj; _sign?: Obj }>; update(x: number, z: number): void };
type Real = {
  q: Record<string, unknown> & { name: string; shadow: number };
  regions: Map<string, Region & { rx: number; rz: number }>;
  M: { X0: number; Z0: number; RS: number };
  disposeRegion(r: unknown): void;
  update: (...a: unknown[]) => void;
  mon?: { group: Obj };
  brands?: { group: Obj };
  hero?: Hero;
  sky: { sun: { shadow: { mapSize: { x: number; set(a: number, b: number): void }; map: { dispose(): void } | null; camera: { updateProjectionMatrix(): void } } } };
};
type Post = { ao?: { enabled: boolean }; composer?: unknown };

declare global {
  interface Window { __awPost?: Post; __awMMDiv?: number }
}

export type PerfStats = { instFolded: number; instBuckets: number; carMeshes: string; peds: string; glassFixed: number; frozen: number; merged: number; mergedFrom: number; kitNoShadow: number; heroHidden: number; mobile: boolean; changes: string[] };

export class PerfFixes {
  g: AGame;
  real: Real;
  mobile: boolean;
  stats: PerfStats;
  private carSeen = new WeakSet<Object3D>();
  private t = 0;
  private heroCap: number;
  inst: TileInstances | null = null;

  constructor(g: AGame) {
    this.g = g;
    this.real = g.real as unknown as Real;
    const pm = params.get("perfmobile");
    const touch = matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
    this.mobile = pm === "1" ? true : pm === "0" ? false : touch;
    this.stats = { instFolded: 0, instBuckets: 0, carMeshes: "", peds: "", glassFixed: 0, frozen: 0, merged: 0, mergedFrom: 0, kitNoShadow: 0, heroHidden: 0, mobile: this.mobile, changes: [] };
    const tier = this.real.q.name;
    this.heroCap = tier === "low" ? 700 : tier === "med" ? 1000 : this.mobile ? 1400 : (this.real.q as unknown as { id?: string }).id === "desktop" ? 5000 : 2000;
    window.__awMMDiv = 3;
    this.tierProfile();
    if (params.get("inst") !== "0") this.inst = new TileInstances(this.real.q);
    this.hookUpdate();
    this.hookHero();
    this.fixGlass();
  }

  // ---------- 5. phone profile ----------
  private tierProfile() {
    const q = this.real.q, R = this.g.renderer, ch = this.stats.changes;
    if (!this.mobile) return;
    if (q.name === "high") {
      const pr = Math.min(window.devicePixelRatio || 1, 1.5);
      if (R.getPixelRatio() > pr + 1e-3) { R.setPixelRatio(pr); window.dispatchEvent(new Event("resize")); ch.push("pixelRatio 2->" + pr); }
      const sh = this.real.sky.sun.shadow;
      if (sh.mapSize.x > 2048) { sh.mapSize.set(2048, 2048); sh.map?.dispose(); sh.map = null; ch.push("shadow 4096->2048"); }
      // live-read stream/detail ranges (A reads these every update)
      Object.assign(q, { radius: 1400, bldR: 1400, roadR: 900, kitR: 100, parkR: 250, contactR: 300, detailR: 500 });
      ch.push("radius 2000->1400, bldR 1400, roadR 900, kitR 100, parkR 250, detailR 500");
      this.trimPending = true;
    } else if (q.name === "med") {
      const pr = Math.min(window.devicePixelRatio || 1, 1.35);
      if (R.getPixelRatio() > pr + 1e-3) { R.setPixelRatio(pr); window.dispatchEvent(new Event("resize")); ch.push("pixelRatio 1.5->" + pr); }
    }
  }

  /** GTAO lives inside A's composer, which A creates lazily on the first frame. */
  private postDone = false;
  private fixPost() {
    if (this.postDone) return;
    const p = window.__awPost;
    if (!p) return;
    this.postDone = true;
    if (this.mobile && p.ao) { p.ao.enabled = false; this.stats.changes.push("GTAO off"); }
    // phones on HIGH: 4x MSAA on a half-float target -> 2x (edges still smooth at 1.5 DPR, half the resolve bandwidth)
    const comp = (p as unknown as { composer?: { renderTarget1?: { samples: number; dispose(): void }; renderTarget2?: { samples: number; dispose(): void } } }).composer;
    if (this.mobile && comp) for (const rt of [comp.renderTarget1, comp.renderTarget2]) if (rt && rt.samples > 2) { rt.samples = 2; rt.dispose(); this.stats.changes.push("MSAA 4->2"); }
  }

  // ---------- 1. car glass ----------
  private fixGlass() {
    if ((this.real.q as unknown as { id?: string }).id === "desktop" && !this.mobile) return; // desktop keeps A's transmissive glass
    const roots: Object3D[] = [];
    const car = this.g.car;
    if (car) roots.push(car);
    for (const o of this.g.scene.children) if (o.name !== "realistic") roots.push(o);
    for (const r of roots) {
      if (this.carSeen.has(r)) continue;
      this.carSeen.add(r);
      r.traverse((o) => {
        const m = (o as Obj).material as (Material & { transmission?: number; opacity: number; roughness?: number }) | undefined;
        if (!m || Array.isArray(m) || !(m.transmission && m.transmission > 0)) return;
        m.transmission = 0;
        m.transparent = true;
        // tinted like A's transmissive glass looked (dark, glossy), not milky
        (m as unknown as { color?: { set(c: number): void } }).color?.set(0x0c1117);
        m.opacity = 0.72;
        m.depthWrite = false;
        if (m.roughness !== undefined) m.roughness = Math.min(m.roughness, 0.08);
        m.needsUpdate = true;
        this.stats.glassFixed++;
      });
    }
  }

  // ---------- 2. static matrices ----------
  private freeze(o: Obj, onChange?: (o: Obj, from: number) => void) {
    const u = o.userData as { awFrozen?: boolean; awN?: number };
    if (u.awFrozen) return;
    u.awFrozen = true;
    u.awN = -1;
    const base = Object.getPrototypeOf(o).updateMatrixWorld as (f?: boolean) => void;
    o.updateMatrixWorld = function (this: Obj, force?: boolean) {
      const ud = this.userData as { awN: number };
      if (force || this.matrixWorldNeedsUpdate || ud.awN !== this.children.length) {
        if (ud.awN !== this.children.length && onChange) onChange(this, ud.awN > this.children.length ? 0 : Math.max(0, ud.awN));
        ud.awN = this.children.length;
        base.call(this, true);
      }
    };
    this.stats.frozen++;
  }

  // ---------- 4. kit shadows (per region, on every child-list change) ----------
  private regionChanged = (grp: Obj, from: number) => {
    // only the newly appended children (A's tile jobs push into the region group)
    for (let i = from; i < grp.children.length; i++)
      grp.children[i].traverse((o) => {
        if (o.name === "bld:kit" && o.castShadow) { o.castShadow = false; this.stats.kitNoShadow++; }
      });
  };

  // ---------- 3. merge static landmark meshes ----------
  private merge(root: Obj, skip?: (o: Object3D) => boolean) {
    const ud = root.userData as { awMergedN?: number };
    let n = 0;
    root.traverse(() => n++);
    if (ud.awMergedN === n) return;
    root.updateMatrixWorld(true);
    const inv = new Matrix4().copy(root.matrixWorld).invert();
    // a "part" is one (mesh, material) pair; multi-material meshes (A's box signs use
    // [face, face, side, side, side, side]) are split per geometry group
    type Part = { m: Obj; mat: Material; start: number; count: number };
    const buckets = new Map<string, Part[]>();
    const used = new Set<Obj>();
    root.traverse((o) => {
      const m = o as Obj;
      if (!m.isMesh || m.isInstancedMesh || m.isSkinnedMesh || !m.geometry || !m.material) return;
      if (!m.visible || m.name.startsWith("aw:") || (m as unknown as { morphTargetInfluences?: unknown }).morphTargetInfluences) return;
      if (m.matrixWorld.determinant() < 0) return;
      let p = m.parent, vis = true;
      while (p && p !== root) { vis = vis && p.visible && !(skip && skip(p)); p = p.parent; }
      if (!vis || (skip && skip(m))) return;
      const g = m.geometry;
      const attrs = Object.keys(g.attributes).sort().join(",");
      const parts: Part[] = [];
      if (Array.isArray(m.material)) {
        if (!g.index || !g.groups.length) return;
        for (const gr of g.groups) {
          const mat = m.material[gr.materialIndex ?? 0];
          if (mat) parts.push({ m, mat, start: gr.start, count: gr.count });
        }
      } else parts.push({ m, mat: m.material, start: 0, count: Infinity });
      for (const part of parts) {
        const key = [part.mat.uuid, attrs, g.index ? 1 : 0, m.castShadow, m.receiveShadow, m.renderOrder].join("|");
        let b = buckets.get(key);
        if (!b) buckets.set(key, (b = []));
        b.push(part);
      }
    });
    // only merge meshes whose every part lands in a bucket that actually merges (>= 2 parts)
    const rel = new Matrix4();
    const canMerge = new Map<Obj, boolean>();
    for (const list of buckets.values()) for (const pt of list) canMerge.set(pt.m, (canMerge.get(pt.m) ?? true) && list.length >= 2);
    for (const list of buckets.values()) {
      const ok = list.filter((pt) => canMerge.get(pt.m));
      if (ok.length < 2) continue;
      const geos: BufferGeometry[] = [];
      for (const pt of ok) {
        const src = pt.m.geometry!;
        const gg = src.clone();
        gg.morphAttributes = {};
        gg.clearGroups();
        if (src.index && pt.count !== Infinity) gg.setIndex(Array.from(src.index.array.slice(pt.start, pt.start + pt.count)));
        rel.multiplyMatrices(inv, pt.m.matrixWorld);
        gg.applyMatrix4(rel);
        geos.push(gg);
      }
      const merged = mergeGeometries(geos, false);
      geos.forEach((x) => x.dispose());
      if (!merged) { ok.forEach((pt) => canMerge.set(pt.m, false)); continue; }
      merged.computeBoundingSphere();
      const first = ok[0].m;
      const mm = new Mesh(merged, ok[0].mat);
      mm.name = "aw:merged";
      mm.castShadow = first.castShadow;
      mm.receiveShadow = first.receiveShadow;
      mm.renderOrder = first.renderOrder;
      mm.matrixAutoUpdate = false;
      root.add(mm as unknown as Object3D);
      for (const pt of ok) used.add(pt.m);
      this.stats.merged++;
      this.stats.mergedFrom += ok.length;
    }
    for (const m of used) if (canMerge.get(m)) {
      // a merged mesh can still parent unmerged nodes (car: BodyUnderside holds the 4 wheel pivots).
      // Keep such a node in the tree as an empty transform, otherwise its children vanish with it.
      if (m.children.length) { const old = m.geometry!; m.geometry = new BufferGeometry(); old.dispose(); m.castShadow = false; }
      else { m.parent?.remove(m); m.geometry!.dispose(); }
    }
    n = 0;
    root.traverse(() => n++);
    ud.awMergedN = n;
    root.updateMatrixWorld(true);
  }

  private mergeAll() {
    const groups = [this.real.mon?.group, this.real.brands?.group];
    for (const grp of groups) {
      if (!grp) continue;
      for (const c of grp.children) this.merge(c as Obj);
    }
  }

  // ---------- 6. hero distance cap ----------
  private hookHero() {
    const h = this.real.hero;
    if (!h) return;
    const orig = h.update.bind(h);
    const cap = this.heroCap;
    h.update = (x: number, z: number) => {
      orig(x, z);
      let hidden = 0;
      for (const n of h.list) {
        if (!n._g || !n._g.visible) continue;
        if (Math.hypot(n.x - x, n.z - z) > cap) { n._g.visible = false; if (n._sign) n._sign.visible = false; hidden++; }
      }
      this.stats.heroHidden = hidden;
    };
  }

  /** A streamed HIGH's 2 km radius during boot (before the add-ons ran); drop the
   *  regions the phone profile no longer wants, with A's own disposeRegion. A keeps a
   *  700 m hysteresis, so without this they would stay resident for the whole session. */
  private trimPending = false;
  private trim(x: number, z: number) {
    this.trimPending = false;
    const A = this.real, M = A.M, R = (A.q.radius as number) + 300;
    let n = 0;
    for (const r of [...A.regions.values()]) {
      if (r.state === "loading") continue;
      const cx = M.X0 + (r.rx + 0.5) * M.RS, cz = M.Z0 + (r.rz + 0.5) * M.RS;
      if (Math.hypot(cx - x, cz - z) - M.RS * 0.71 > R) { A.disposeRegion(r); n++; }
    }
    if (n) this.stats.changes.push("dropped " + n + " far regions");
  }

  /** Runs right after A's per-frame world update, before A renders. */
  private hookUpdate() {
    const A = this.real;
    const orig = A.update.bind(A);
    A.update = (...a: unknown[]) => {
      orig(...a);
      if (this.trimPending) this.trim(a[0] as number, a[2] as number);
      for (const r of A.regions.values()) if (r.group) this.freeze(r.group, this.regionChanged);
      if (this.inst) {
        this.inst.update(A.regions as never, a[0] as number, a[2] as number);
        this.stats.instFolded = this.inst.folded; this.stats.instBuckets = this.inst.buckets;
      }
      this.fixPost();
    };
    for (const grp of [A.mon?.group, A.brands?.group, A.hero?.group]) if (grp) this.freeze(grp);
  }

  /** Called from the add-on loop (after A's frame). */
  /** Player car: ~110 meshes / 218 draws. Merge everything but the 4 wheel subtrees (A spins/steers those). */
  private carDone = new WeakSet<Object3D>();
  private fixCar() {
    const car = this.g.car as Obj | null;
    if (!car || this.carDone.has(car)) return;
    this.carDone.add(car);
    let before = 0, after = 0;
    car.traverse((o) => { if ((o as Obj).isMesh) before++; });
    car.updateMatrixWorld(true);
    // merge in the car's local frame: its root moves every frame
    const save = car.matrixWorld.clone();
    car.matrixWorld.identity();
    car.children.forEach((c) => c.updateMatrixWorld(true));
    this.merge(car, (o) => /^Wheel(Front|Rear)(L|R)$/.test(o.name));
    // each wheel pivot is merged on its own (in its local frame), so it still spins and steers as one piece
    const wheels = (car as unknown as { wheels?: Array<{ o: Obj }> }).wheels || [];
    for (const w of wheels) this.merge(w.o);
    car.matrixWorld.copy(save);
    car.updateMatrixWorld(true);
    car.traverse((o) => { if ((o as Obj).isMesh) after++; });
    this.stats.carMeshes = before + " -> " + after;
  }

  /** Phones: fewer skinned pedestrians (13 parts each, + their shadow pass). */
  private pedsDone = false;
  private fixPeds() {
    if (this.pedsDone || !this.mobile) return;
    const amb = (this.real as unknown as { amb?: { peds: Array<{ g: Obj }> } }).amb;
    if (!amb) return;
    this.pedsDone = true;
    const tier = this.real.q.name, cap = tier === "high" ? 5 : tier === "med" ? 4 : 2;
    const n0 = amb.peds.length;
    for (const p of amb.peds.splice(cap)) { p.g.visible = false; p.g.parent?.remove(p.g); }
    for (const p of amb.peds) p.g.traverse((o) => { o.castShadow = false; });
    this.stats.peds = n0 + " -> " + amb.peds.length + " (no shadows)";
  }

  update(dt: number) {
    this.t -= dt;
    if (this.t > 0) return;
    this.t = 1;
    this.fixGlass();
    this.fixCar();
    this.fixPeds();
    this.mergeAll();
  }
}
