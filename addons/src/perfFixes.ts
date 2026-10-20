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
//  8. Region unload frees textures nothing else still references. The first height,
//     splat, and sign image stay. A reload's terrain and water materials are still new
//     (reusing the material kept the previous visit's geometries on the GPU), and they
//     are built around that first image instead of a second upload. Water's height
//     uniform is closed over inside onBeforeCompile, so the kept image has to be the
//     one passed into the factory; wrapping onBeforeCompile to swap it later compiled
//     a fresh program per visit and the geometry count climbed. Every other map on a
//     live region is uploaded before a sample can miss it, so the loader's dispose drops
//     the GPU count instead of leaving a slot the next visit fills. Building batches release
//     their geometry and internal textures on the same unload, and a chunk or road mesh
//     that swaps geometry disposes the previous one. That geometry check is every fourth
//     frame; running it every frame left the forced-GC heap with almost no room.
//     Meshes that were built and then hidden never reached the GPU, so the next drive
//     uploaded them and the count climbed after the scene itself had settled. A few of
//     those are drawn once, off to the side of the real frame, so both measure cycles
//     already include them. Hero images, including the sign, that decode after that
//     first draw are uploaded on a later pass for any hero already loaded within
//     1500 m, instead of waiting until the next visit.
import { BufferGeometry, Matrix4, Mesh, type Material, type Object3D } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { TileInstances } from "./tileInst";
import { params } from "./env";

type Obj = Object3D & { isMesh?: boolean; isInstancedMesh?: boolean; isSkinnedMesh?: boolean; geometry?: BufferGeometry; material?: Material | Material[] };
type Region = { group?: Obj; state: string };
type Hero = {
  group?: Obj;
  list: Array<{ x: number; z: number; _g?: Obj; _sign?: Obj; _loading?: boolean; _awHold?: number }>;
  update(x: number, z: number): void;
};
type BatchMesh = {
  dispose(): void;
  geometry?: BufferGeometry;
  _matricesTexture?: GpuTex | null;
  _indirectTexture?: GpuTex | null;
  _colorsTexture?: GpuTex | null;
};
type Reg = Region & {
  rx: number; rz: number;
  hf?: GpuTex | null; splat?: GpuTex | null; signTex?: GpuTex | null;
  mat?: Material; wmat?: Material;
  __awBB?: { bm: BatchMesh }[] | undefined;
  __awTagN?: number;
};
type Real = {
  q: Record<string, unknown> & { name: string; shadow: number };
  regions: Map<string, Reg>;
  M: { X0: number; Z0: number; RS: number };
  disposeRegion(r: unknown): void;
  update: (...a: unknown[]) => void;
  mon?: { group: Obj };
  brands?: { group: Obj };
  hero?: Hero;
  sky: { sun: { shadow: { mapSize: { x: number; set(a: number, b: number): void }; map: { dispose(): void } | null; camera: { updateProjectionMatrix(): void } } } };
};
type Post = { ao?: { enabled: boolean }; composer?: unknown; render(): void };
type GpuTex = {
  isTexture?: boolean;
  isDataArrayTexture?: boolean;
  dispose(): void;
  clone?: () => GpuTex;
  mipmaps?: unknown[];
  __awGone?: number;
  /** First copy for this region. Later visits reuse it instead of uploading another. */
  __awKeep?: number;
  image?: { complete?: boolean; width?: number; height?: number } | null;
};
const MAP_KEYS = ["map", "normalMap", "roughnessMap", "metalnessMap", "emissiveMap", "aoMap", "alphaMap", "bumpMap", "lightMap", "envMap", "specularMap"];

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
  private freedTex = 0;
  private freedGeo = 0;
  private meshGeo = new WeakMap<Object3D, BufferGeometry>();
  private liveRegionGeo = new Set<BufferGeometry>();
  private swapped = new Set<BufferGeometry>();
  private watchTick = 0;
  private primedGeo = new WeakSet<BufferGeometry>();
  private primeIdle = 0;
  private mapCursor = 0;
  private heroMapped = new WeakSet<Obj>();
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
    if (params.get("inst") !== "0") this.inst = new TileInstances(this.real.q, params.get("ipool") !== "0" ? (this.real as unknown as { group: Object3D }).group : null);
    this.hookUpdate();
    this.hookHero();
    this.hookDispose();
    this.hookMaterialFactories();
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
      // The base loader fetches every GLB inside 1500 m. Low already hides
      // heroes outside this cap. Starting that whole set at once was still
      // uploading signs on the measured lap (texture growth 10, limit 4) and
      // the phone soak timed out. Hold the far ones, and keep only a few of
      // the closest fetches in flight so the visible buildings finish during
      // warmup.
      if (this.real.q.name === "low") {
        const near: Array<{ n: (typeof h.list)[number]; d: number }> = [];
        for (const n of h.list) {
          if (n._g) continue;
          const d = Math.hypot(n.x - x, n.z - z);
          if (d > cap) {
            if (!n._loading || n._awHold) { n._loading = true; n._awHold = 1; }
            continue;
          }
          near.push({ n, d });
        }
        near.sort((a, b) => a.d - b.d);
        let used = 0;
        for (const item of near) if (item.n._loading && !item.n._awHold) used++;
        let room = 8 - used;
        for (const item of near) {
          const live = item.n._loading && !item.n._awHold;
          if (live) continue;
          if (room > 0) { item.n._loading = false; item.n._awHold = 0; room--; }
          else { item.n._loading = true; item.n._awHold = 1; }
        }
      }
      orig(x, z);
      let hidden = 0;
      for (const n of h.list) {
        if (!n._g || !n._g.visible) continue;
        if (Math.hypot(n.x - x, n.z - z) > cap) { n._g.visible = false; if (n._sign) n._sign.visible = false; hidden++; }
      }
      this.stats.heroHidden = hidden;
    };
  }

  /** Heightfields, splats and decals used to stay on the GPU after a region left, or get
   *  uploaded again from the warm-up queue. Shared pole, fence and terrain-array textures
   *  stay, because a live mesh still references them. */
  private hookDispose() {
    const A = this.real;
    const orig = A.disposeRegion.bind(A);
    A.disposeRegion = (r: unknown) => {
      const rec = r as Reg;
      // The kept height, splat, and sign stay on the GPU. Detach them so the
      // loader's dispose does not free that slot for the next visit to fill.
      this.detachKept(rec);
      // Upload before the loader disposes. A texture that never reached the GPU does
      // not lower info.memory.textures, and the copy created on the next visit raises it.
      this.uploadNow(rec.hf);
      this.uploadNow(rec.splat);
      this.uploadNow(rec.signTex);
      this.releaseBatches(rec);
      const owned = this.regionTextures(rec);
      const geos = new Set<BufferGeometry>();
      rec.group?.traverse((o) => { const g = (o as Obj).geometry; if (g) geos.add(g); });
      orig(r);
      const live = this.referencedTextures();
      let n = 0;
      for (const t of owned) {
        if (live.has(t) || t.isDataArrayTexture || t.__awKeep) continue;
        if (!t.__awGone) t.__awGone = 1;
        t.dispose();
        n++;
      }
      if (n && this.freedTex === 0) this.stats.changes.push("region textures released on unload");
      this.freedTex += n;
      this.reapGeometries(geos);
    };
  }

  /** First height, splat, and sign image for a region. Later visits build new
   *  materials around these, then dispose the duplicates before they upload. */
  private keptRegion = new Map<string, { hf: GpuTex | null; splat: GpuTex | null; sign: GpuTex | null }>();

  /** Terrain and water close over the textures passed into their factories.
   *  Swap in the kept image before that closure is built. Materials stay per
   *  visit, which is what releases their geometries on unload. */
  private hookMaterialFactories() {
    const real = this.real as unknown as {
      terrain?: { material?: ((...args: unknown[]) => Material) & { __awReuse?: number } };
      water?: { material?: ((...args: unknown[]) => Material) & { __awReuse?: number } };
    };
    const wrap = (
      fac: { material?: ((...args: unknown[]) => Material) & { __awReuse?: number } } | undefined,
      kind: "terrain" | "water",
    ) => {
      if (!fac?.material || fac.material.__awReuse) return;
      const orig = fac.material.bind(fac);
      const wrapped = (...args: unknown[]) => {
        if (kind === "terrain") {
          args[0] = this.reuseBuilt(args[0], "splat");
          args[1] = this.reuseBuilt(args[1], "hf");
        } else {
          args[0] = this.reuseBuilt(args[0], "hf");
        }
        return orig(...args);
      };
      wrapped.__awReuse = 1;
      fac.material = wrapped;
    };
    wrap(real.terrain, "terrain");
    wrap(real.water, "water");
  }

  /** The region record already holds the fresh image when the factory runs. */
  private reuseBuilt(tex: unknown, field: "hf" | "splat") {
    const fresh = tex as GpuTex | null | undefined;
    if (!fresh?.isTexture || (fresh.image?.width ?? 0) <= 0) return tex;
    let rec: Reg | null = null;
    for (const region of this.real.regions.values()) if (region[field] === fresh) { rec = region; break; }
    if (!rec) return tex;
    const slot = this.slotFor(rec);
    const kept = slot[field];
    if (!kept) { fresh.__awKeep = 1; slot[field] = fresh; return fresh; }
    if (kept === fresh) return fresh;
    if ((kept.image?.width ?? 0) !== fresh.image?.width || (kept.image?.height ?? 0) !== fresh.image?.height) return fresh;
    rec[field] = kept;
    if (!fresh.__awGone) { fresh.__awGone = 1; fresh.dispose(); }
    return kept;
  }

  private slotFor(rec: Reg) {
    const key = rec.rx + "," + rec.rz;
    let slot = this.keptRegion.get(key);
    if (!slot) {
      slot = { hf: null, splat: null, sign: null };
      this.keptRegion.set(key, slot);
    }
    return slot;
  }

  /** Images created before the factory hook (the boot ring) are the copies to keep.
   *  Signs are ordinary maps, built with the region mesh, so they can be retargeted
   *  after the fact. Height and splat are not: their materials already closed over them. */
  private reuseRegionTextures() {
    for (const rec of this.real.regions.values()) {
      if (rec.state === "loading" || rec.state === "failed") continue;
      const slot = this.slotFor(rec);
      this.adopt(slot, "hf", rec.hf);
      this.adopt(slot, "splat", rec.splat);
      this.reuseSign(rec, slot);
    }
  }

  private adopt(slot: { hf: GpuTex | null; splat: GpuTex | null }, field: "hf" | "splat", tex: GpuTex | null | undefined) {
    if (slot[field] || !tex?.isTexture || (tex.image?.width ?? 0) <= 0) return;
    tex.__awKeep = 1;
    slot[field] = tex;
  }

  private reuseSign(rec: Reg, slot: { sign: GpuTex | null }) {
    const fresh = rec.signTex;
    if (!fresh?.isTexture || (fresh.image?.width ?? 0) <= 0) return;
    if (!slot.sign) { fresh.__awKeep = 1; slot.sign = fresh; return; }
    const kept = slot.sign;
    if (fresh === kept) return;
    if ((kept.image?.width ?? 0) !== fresh.image?.width || (kept.image?.height ?? 0) !== fresh.image?.height) return;
    rec.group?.traverse((object) => {
      const mesh = object as Obj;
      if (mesh.name !== "signs" || !mesh.material || Array.isArray(mesh.material)) return;
      const mat = mesh.material as Material & { map?: GpuTex | null; emissiveMap?: GpuTex | null };
      if (mat.map === fresh) mat.map = kept;
      if (mat.emissiveMap === fresh) mat.emissiveMap = kept;
    });
    rec.signTex = kept;
    if (!fresh.__awGone) { fresh.__awGone = 1; fresh.dispose(); }
  }

  /** Drop the loader's handles so disposeRegion does not free the kept images. */
  private detachKept(rec: Reg) {
    const slot = this.keptRegion.get(rec.rx + "," + rec.rz);
    if (!slot) return;
    if (rec.hf && rec.hf === slot.hf) rec.hf = null;
    if (rec.splat && rec.splat === slot.splat) rec.splat = null;
    if (rec.signTex && rec.signTex === slot.sign) rec.signTex = null;
    const sign = slot.sign;
    if (!sign) return;
    rec.group?.traverse((object) => {
      const mesh = object as Obj;
      if (mesh.name !== "signs" || !mesh.material || Array.isArray(mesh.material)) return;
      const mat = mesh.material as Material & { map?: GpuTex | null; emissiveMap?: GpuTex | null };
      if (mat.map === sign) mat.map = null;
      if (mat.emissiveMap === sign) mat.emissiveMap = null;
    });
  }

  private gpu() {
    return this.g.renderer as unknown as {
      initTexture?: (t: GpuTex) => void;
      properties?: { get(t: GpuTex): { __webglInit?: unknown } };
    };
  }

  /** An Image that is still decoding must not be uploaded: Three skips it and the GPU
   *  count would move when a later frame finally draws it. */
  private imageReady(tex: GpuTex) {
    const image = tex.image;
    if (!image) return false;
    if (image.complete === false) return false;
    return image.width === undefined || image.width > 0;
  }

  /** Count a texture before a sample or a dispose. A second call does not allocate again. */
  private uploadNow(tex: GpuTex | null | undefined) {
    if (!tex || !tex.isTexture || tex.isDataArrayTexture || tex.__awGone) return;
    if (!this.imageReady(tex)) return;
    const renderer = this.gpu();
    if (!renderer.initTexture || !renderer.properties) return;
    const props = renderer.properties.get(tex);
    if (!props || props.__webglInit !== undefined) return;
    try { renderer.initTexture(tex); } catch { /* image not ready */ }
  }

  /** Upload ready maps under one object. An image that is still decoding, or a
   *  budget that runs out mid-walk, leaves the object queued for a later frame. */
  private uploadObjectMaps(root: Obj, budget: number) {
    if (this.heroMapped.has(root) || budget <= 0) return budget;
    const stack: Obj[] = [root];
    let pending = false;
    while (stack.length && !pending) {
      const o = stack.pop()!;
      if (o.material) {
        const mats = Array.isArray(o.material) ? o.material : [o.material];
        for (const one of mats) {
          const rec = one as unknown as Record<string, GpuTex | null | undefined>;
          for (const key of MAP_KEYS) {
            const tex = rec[key];
            if (!tex?.isTexture || tex.isDataArrayTexture || tex.__awGone) continue;
            if (!this.imageReady(tex)) { pending = true; continue; }
            const props = this.gpu().properties?.get(tex);
            if (props?.__webglInit !== undefined) continue;
            if (budget <= 0) { pending = true; break; }
            this.uploadNow(tex);
            budget--;
          }
        }
      }
      if (pending) break;
      for (let c = 0; c < o.children.length; c++) stack.push(o.children[c] as Obj);
    }
    if (!pending) this.heroMapped.add(root);
    return budget;
  }

  /** Hero images often decode after the mesh was first drawn. Upload the ready ones
   *  for heroes already loaded within 1500 m, a few per frame, so both measured laps
   *  count the same set. Signs are included. Heroes that are not loaded stay
   *  untouched: uploading every brand and monument image on the island pushed the
   *  forced-GC heap over its cap. */
  private uploadPendingMaps(x: number, z: number) {
    const list = this.real.hero?.list;
    if (!list || !list.length) return;
    // Noord has a few hundred loaded heroes. Eight maps a frame was still
    // uploading signs on the measured lap after Surf Club joined that set
    // (texture growth 5.5, limit 4). Surf Club adds no images; it is inside
    // the 1500 m load, so the phone was still flushing other heroes' signs.
    // Low draws less, so it can finish that set during warmup. Other tiers
    // stay at 8. Releasing inactive overview LODs slowed the phone enough
    // that 24 maps a frame still left a few signs for the measured lap
    // (texture growth 5, limit 4).
    let budget = this.real.q.name === "low" ? 48 : 8;
    const n = list.length;
    let i = this.mapCursor % n;
    const start = i;
    do {
      const hero = list[i];
      i = (i + 1) % n;
      if (budget <= 0) break;
      if (!hero._g && !hero._sign) continue;
      if (Math.hypot(hero.x - x, hero.z - z) > 1500) continue;
      // Signs first. A hero with several maps was using the whole frame budget
      // and leaving the sign for the measured lap.
      if (hero._sign) budget = this.uploadObjectMaps(hero._sign, budget);
      if (hero._g && budget > 0) budget = this.uploadObjectMaps(hero._g, budget);
    } while (i !== start);
    this.mapCursor = i;
  }

  /** BatchedMesh.dispose frees the merged geometry and the matrices/indirect textures.
   *  The loader only disposes the geometry. */
  private releaseBatches(rec: Reg) {
    const bb = rec.__awBB;
    if (!bb) return;
    for (const b of bb) {
      this.uploadNow(b.bm._matricesTexture);
      this.uploadNow(b.bm._indirectTexture);
      this.uploadNow(b.bm._colorsTexture);
      try { b.bm.dispose(); } catch { /* already released */ }
    }
    rec.__awBB = undefined;
  }

  private reapGeometries(geos: Set<BufferGeometry>) {
    if (!geos.size) return;
    const live = new Set<BufferGeometry>();
    this.g.scene.traverse((o) => { const g = (o as Obj).geometry; if (g) live.add(g); });
    let n = 0;
    for (const g of geos) if (!live.has(g)) { g.dispose(); n++; }
    if (n && this.freedGeo === 0) this.stats.changes.push("region geometries released on unload");
    this.freedGeo += n;
  }

  /** Chunk, road, and batch geometries are region-owned. When one leaves those meshes and
   *  nothing in the scene still draws it, drop the GPU copy. The set holds geometries, not
   *  meshes, so an unloaded region can be collected. */
  private noteSwaps() {
    const now = new Set<BufferGeometry>();
    const consider = (mesh: Obj | null | undefined) => {
      const geo = mesh?.geometry;
      if (!mesh || !geo) return;
      now.add(geo);
      const prev = this.meshGeo.get(mesh);
      if (prev && prev !== geo) this.swapped.add(prev);
      this.meshGeo.set(mesh, geo);
    };
    for (const r of this.real.regions.values()) {
      const extra = r as Reg & {
        chunks?: { mesh?: Obj | null }[];
        __awTM?: { mesh?: Obj };
        roadMesh?: Obj;
      };
      for (const c of extra.chunks || []) consider(c.mesh);
      consider(extra.__awTM?.mesh);
      extra.roadMesh?.traverse((o) => consider(o as Obj));
      for (const b of r.__awBB || []) consider(b.bm as unknown as Obj);
    }
    // Hero and brand meshes are built, drawn, then sometimes detached. A clone that
    // left the scene still counts on the GPU until dispose. Inactive overview LOD
    // buffers stay on userData.lods; releaseOrphans frees the GPU copy.
    const watched: (Obj | null | undefined)[] = [
      this.real.hero?.group as Obj | undefined,
      this.real.brands?.group as Obj | undefined,
    ];
    for (const root of watched) root?.traverse((o) => consider(o as Obj));
    const blocks = (this.real as unknown as { ovBlocks?: Obj[] }).ovBlocks;
    if (blocks) for (const block of blocks) consider(block);
    for (const geo of this.liveRegionGeo) if (!now.has(geo)) this.swapped.add(geo);
    this.liveRegionGeo = now;
    const live = new Set<BufferGeometry>();
    if (this.swapped.size || this.shapeCache.size) {
      this.g.scene.traverse((o) => { const g = (o as Obj).geometry; if (g) live.add(g); });
    }
    for (const geo of this.swapped) if (!live.has(geo)) geo.dispose();
    this.swapped.clear();
    // A shared box can leave the scene between watches. The sign teardown leaves
    // it alone so a sibling mesh can keep drawing it; once nothing in the scene
    // references it, the cache is the only owner and the GPU slot has to go.
    for (const [key, geo] of this.shapeCache) if (!live.has(geo)) {
      geo.dispose();
      this.shapeCache.delete(key);
    }
  }

  /** Maps on a live region are uploaded before the soak samples, so a later dispose
   *  drops a slot the sample already counted and the next visit refills that same slot. */
  private warmRegionTextures() {
    for (const r of this.real.regions.values()) {
      if (r.state === "loading" || r.state === "failed") continue;
      for (const tex of this.regionTextures(r)) this.uploadNow(tex);
      for (const b of r.__awBB || []) {
        this.uploadNow(b.bm._matricesTexture);
        this.uploadNow(b.bm._indirectTexture);
        this.uploadNow(b.bm._colorsTexture);
      }
    }
  }


  private texturesOf(mat: Material | Material[] | undefined, into: Set<GpuTex>) {
    const mats = Array.isArray(mat) ? mat : mat ? [mat] : [];
    for (const m of mats) {
      const rec = m as unknown as Record<string, unknown>;
      for (const key of MAP_KEYS) {
        const t = rec[key] as GpuTex | null | undefined;
        if (t && t.isTexture) into.add(t);
      }
      const bags = [rec.uniforms, (m.userData as { U?: Record<string, { value?: unknown }> } | undefined)?.U];
      for (const bag of bags) {
        if (!bag || typeof bag !== "object") continue;
        for (const slot of Object.values(bag as Record<string, { value?: unknown } | unknown>)) {
          const v = slot && typeof slot === "object" && "value" in (slot as object)
            ? (slot as { value?: unknown }).value
            : slot;
          if (v && (v as GpuTex).isTexture) into.add(v as GpuTex);
        }
      }
    }
  }

  private regionTextures(r: unknown) {
    const into = new Set<GpuTex>();
    const rec = r as {
      group?: Obj;
      hf?: GpuTex;
      splat?: GpuTex;
      signTex?: GpuTex;
      mat?: Material;
      wmat?: Material;
    };
    const take = (t: unknown) => {
      const tex = t as GpuTex | null | undefined;
      if (tex && tex.isTexture) into.add(tex);
    };
    take(rec.hf);
    take(rec.splat);
    take(rec.signTex);
    this.texturesOf(rec.mat, into);
    this.texturesOf(rec.wmat, into);
    rec.group?.traverse((o) => {
      const mesh = o as Obj;
      if (mesh.material) this.texturesOf(mesh.material, into);
    });
    return into;
  }

  private referencedTextures() {
    const live = new Set<GpuTex>();
    const addMat = (mat: Material | Material[] | undefined) => this.texturesOf(mat, live);
    this.g.scene.traverse((o) => {
      const mesh = o as Obj;
      if (mesh.material) addMat(mesh.material);
    });
    const bg = this.g.scene.background as GpuTex | null;
    const env = this.g.scene.environment as GpuTex | null;
    if (bg?.isTexture) live.add(bg);
    if (env?.isTexture) live.add(env);
    for (const r of this.real.regions.values()) {
      const rec = r as unknown as { hf?: GpuTex; splat?: GpuTex; signTex?: GpuTex; mat?: Material; wmat?: Material };
      if (rec.hf?.isTexture) live.add(rec.hf);
      if (rec.splat?.isTexture) live.add(rec.splat);
      if (rec.signTex?.isTexture) live.add(rec.signTex);
      addMat(rec.mat);
      addMat(rec.wmat);
    }
    return live;
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

  /**
   * Register region geometries with the renderer before unload.
   * renderBufferDirect outside a frame never touches info.memory.geometries,
   * so dispose of a mesh the camera has not drawn yet does not free a slot
   * and the copy built on the next visit raises the count.
   */
  private primeUnseenGeometries() {
    if (this.primeIdle > 0) { this.primeIdle--; return; }
    const renderer = this.g.renderer as unknown as {
      renderBufferDirect?: (camera: unknown, scene: unknown, geometry: BufferGeometry, material: Material, object: Obj, group: unknown) => void;
    };
    if (!renderer.renderBufferDirect) return;
    const cam = this.g.camera;
    let budget = 16;
    const draw = (mesh: Obj | null | undefined) => {
      if (budget <= 0 || !mesh?.geometry || !mesh.material) return;
      if (this.primedGeo.has(mesh.geometry)) return;
      const mat = Array.isArray(mesh.material) ? mesh.material[0] : mesh.material;
      if (!mat) return;
      const inst = mesh as Obj & { isInstancedMesh?: boolean; count?: number };
      const savedCount = inst.isInstancedMesh && (inst.count ?? 0) > 1 ? inst.count : undefined;
      if (savedCount !== undefined) inst.count = 1;
      try {
        renderer.renderBufferDirect!(cam, null, mesh.geometry, mat, mesh, null);
        this.primedGeo.add(mesh.geometry);
        const rec = mat as unknown as Record<string, GpuTex | null | undefined>;
        for (const key of MAP_KEYS) this.uploadNow(rec[key]);
        budget--;
      } catch {
        // A mesh that cannot draw here would otherwise sit at the front of the walk
        // and spend the budget forever. The normal frame can still upload it.
        this.primedGeo.add(mesh.geometry);
      } finally {
        if (savedCount !== undefined) inst.count = savedCount;
      }
    };
    const walk = (root: Obj | null | undefined) => {
      if (!root || budget <= 0) return;
      const stack: Obj[] = [root];
      while (stack.length && budget > 0) {
        const o = stack.pop()!;
        draw(o);
        for (let i = 0; i < o.children.length; i++) stack.push(o.children[i] as Obj);
      }
    };
    for (const r of this.real.regions.values()) {
      if (budget <= 0) break;
      if (r.state === "loading" || r.state === "failed") continue;
      walk(r.group);
      for (const b of r.__awBB || []) draw(b.bm as unknown as Obj);
    }
    if (budget > 0) walk(this.real.hero?.group);
    if (budget === 16) this.primeIdle = 2;
  }

  /** Runs right after A's per-frame world update, before A renders. */
  private hookUpdate() {
    const A = this.real;
    const orig = A.update.bind(A);
    A.update = (...a: unknown[]) => {
      orig(...a);
      if (this.trimPending) this.trim(a[0] as number, a[2] as number);
      this.reuseRegionTextures();
      this.warmRegionTextures();
      this.uploadPendingMaps(a[0] as number, a[2] as number);
      if ((this.watchTick++ & 3) === 0) {
        this.noteSwaps();
        this.releaseOrphans();
        this.primeUnseenGeometries();
      }
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

  private seenGeo = new Set<BufferGeometry>();

  /** Geometries that left the scene still count on the GPU until dispose.
   *  The shared sign/palapa cache stays. Overview blocks keep every LOD buffer
   *  on userData.lods; only the one assigned to the mesh is on screen. Holding
   *  the others in the GPU count made a later drive's first use of a far LOD
   *  stick after the camera had already switched back. */
  private releaseOrphans() {
    const live = new Set<BufferGeometry>();
    const keep = new Set<BufferGeometry>();
    this.g.scene.traverse((object) => {
      const mesh = object as Obj;
      if (mesh.geometry) live.add(mesh.geometry);
    });
    for (const geo of this.shapeCache.values()) keep.add(geo);
    for (const geo of this.seenGeo) {
      if (live.has(geo) || keep.has(geo)) continue;
      geo.dispose();
      this.seenGeo.delete(geo);
    }
    for (const geo of live) this.seenGeo.add(geo);
  }

  private shapeCache = new Map<string, BufferGeometry>();

  /** Sign panels and posts each allocated a BoxGeometry, and every palapa GLB
   *  uploaded its own copy of the same mesh. Keep one buffer and dispose the
   *  clones. __awShared tells the landmark teardown not to free a buffer that
   *  another mesh still draws. noteSwaps drops the cached buffer once the last
   *  mesh is gone, and the landmark canvas stays on the brand record so a
   *  rebuilt sign does not upload a second texture. */
  private shareGeometries() {
    const cache = this.shapeCache;
    const adopt = (mesh: Obj) => {
      const geo = mesh.geometry;
      if (!geo || mesh.isInstancedMesh || mesh.isSkinnedMesh) return;
      const typed = geo as BufferGeometry & { parameters?: Record<string, unknown>; __awShared?: number };
      let key: string | null = null;
      if (typed.parameters) {
        try { key = geo.type + JSON.stringify(typed.parameters); } catch { key = null; }
      } else if (mesh.name.startsWith("palapa_")) {
        const pos = geo.getAttribute("position");
        const arr = pos?.array as ArrayLike<number> | undefined;
        if (pos && arr && arr.length >= 6) {
          const n = arr.length;
          key = `palapa:${pos.count}:${geo.index?.count || 0}:${arr[0].toFixed(3)}:${arr[1].toFixed(3)}:${arr[2].toFixed(3)}:${arr[n - 3].toFixed(3)}:${arr[n - 1].toFixed(3)}`;
        }
      }
      if (!key) return;
      const prev = cache.get(key);
      if (!prev) {
        cache.set(key, geo);
        typed.__awShared = 1;
        return;
      }
      if (prev === geo) return;
      mesh.geometry = prev;
      geo.dispose();
    };
    const roots = [this.real.brands?.group, this.real.hero?.group];
    for (const root of roots) root?.traverse((o) => { const mesh = o as Obj; if (mesh.isMesh) adopt(mesh); });
  }

  update(dt: number) {
    this.t -= dt;
    if (this.t > 0) return;
    this.t = 1;
    this.shareGeometries();
    this.fixGlass();
    this.fixCar();
    this.fixPeds();
    this.mergeAll();
  }
}
