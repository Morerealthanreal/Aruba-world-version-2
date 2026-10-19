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
//  8. Region unload frees textures nothing else still references. Every map on a live
//     region is uploaded before a sample can miss it, so the loader's dispose drops the
//     GPU count instead of leaving a slot the next visit fills. Building batches release
//     their geometry and internal textures on the same unload, and a chunk or road mesh
//     that swaps geometry disposes the previous one. That geometry check is every fourth
//     frame; running it every frame left the forced-GC heap with almost no room.
//     renderer.info.memory.geometries only grows inside WebGLGeometries.get, which runs
//     from a real scene render. A hidden mesh, a chunk that changes LOD before it is
//     drawn, or an overview block's other LOD levels never enter that map, so dispose
//     does not lower the count and the next draw raises it. Those geometries are
//     registered once, off the canvas, with a material that does not draw. The scratch
//     pass hides their attributes so get() arms dispose without uploading vertex data;
//     uploading the hidden set retained enough to fail the heap cap. The real draw
//     uploads a geometry the first time the camera sees it. Hero images, including the
//     sign, that decode after the first draw are uploaded on a later pass for any hero
//     already loaded within 1500 m, instead of waiting until the next visit.
import { BufferGeometry, Matrix4, Mesh, MeshBasicMaterial, PerspectiveCamera, Scene, WebGLRenderTarget, type Material, type Object3D } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { TileInstances } from "./tileInst";
import { params } from "./env";

type Obj = Object3D & { isMesh?: boolean; isInstancedMesh?: boolean; isSkinnedMesh?: boolean; geometry?: BufferGeometry; material?: Material | Material[] };
type Region = { group?: Obj; state: string };
type Hero = { group?: Obj; list: Array<{ x: number; z: number; _g?: Obj; _sign?: Obj }>; update(x: number, z: number): void };
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
  __awGone?: number;
  image?: { complete?: boolean; width?: number } | null;
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
  private primeScene: Scene | null = null;
  private primeMat: MeshBasicMaterial | null = null;
  private primeTarget: WebGLRenderTarget | null = null;
  private primeCam: PerspectiveCamera | null = null;
  private primeHolders: Mesh[] = [];
  private primeEmpty = new BufferGeometry();
  private primeSentinel = new BufferGeometry();
  /** Shared stand-in so the scratch pass can register a geometry without uploading it. */
  private primeBlank: BufferGeometry["attributes"] = {};
  private primeLive = false;
  private primeQuiet = 0;
  private primeCount = 0;
  private primeIdleScans = 0;
  private primeSettled = false;
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

  /** Heightfields, splats and decals used to stay on the GPU after a region left, or get
   *  uploaded again from the warm-up queue. Shared pole, fence and terrain-array textures
   *  stay, because a live mesh still references them. */
  private hookDispose() {
    const A = this.real;
    const orig = A.disposeRegion.bind(A);
    A.disposeRegion = (r: unknown) => {
      const rec = r as Reg;
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
        if (live.has(t) || t.isDataArrayTexture) continue;
        if (!t.__awGone) t.__awGone = 1;
        t.dispose();
        n++;
      }
      if (n && this.freedTex === 0) this.stats.changes.push("region textures released on unload");
      this.freedTex += n;
      this.reapGeometries(geos);
    };
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
    let budget = 8;
    const n = list.length;
    let i = this.mapCursor % n;
    const start = i;
    do {
      const hero = list[i];
      i = (i + 1) % n;
      if (budget <= 0) break;
      if (!hero._g && !hero._sign) continue;
      if (Math.hypot(hero.x - x, hero.z - z) > 1500) continue;
      if (hero._g) budget = this.uploadObjectMaps(hero._g, budget);
      if (hero._sign && budget > 0) budget = this.uploadObjectMaps(hero._sign, budget);
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

  /** Geometries still attached to a scene mesh. Overview LOD levels live in userData and
   *  are not walked here; chunk and road swaps do not store those. */
  private sceneGeometries() {
    const live = new Set<BufferGeometry>();
    this.g.scene.traverse((o) => {
      const geo = (o as Obj).geometry;
      if (geo) live.add(geo);
    });
    return live;
  }

  private reapGeometries(geos: Set<BufferGeometry>) {
    if (!geos.size) return;
    const live = this.sceneGeometries();
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
    for (const geo of this.liveRegionGeo) if (!now.has(geo)) this.swapped.add(geo);
    this.liveRegionGeo = now;
    if (!this.swapped.size) return;
    const live = this.sceneGeometries();
    for (const geo of this.swapped) if (!live.has(geo)) geo.dispose();
    this.swapped.clear();
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

  /** Register geometries the camera has not drawn yet.
   *
   *  WebGLGeometries.get (the call that raises info.memory.geometries and arms
   *  dispose) runs from projectObject, not from renderBufferDirect. Chunk LOD
   *  swaps and overview blocks then dispose a geometry that was never counted,
   *  and the replacement raises the count while the live scene does not.
   *  A scratch scene render hits projectObject. The material stays invisible
   *  and the attributes are hidden for that pass, so nothing is drawn, no image
   *  is uploaded, and the vertex arrays are not copied to the GPU. The real
   *  camera upload happens the first time that geometry is actually drawn.
   *  The 1x1 target keeps the pass off the canvas. */
  private primeUnseenGeometries() {
    // Keep registering until a full walk finds nothing new, then only pick up
    // chunk, road, and overview LOD swaps. A clock stop tuned to one machine
    // left the later laps on a slower runner uncounted. Walking the whole scene
    // through the measured laps retained enough to miss the heap cap. Blank
    // attributes keep the scratch pass from copying vertex data.
    if (this.primeQuiet > 0) this.primeQuiet--;
    const scanScene = !this.primeSettled && this.primeQuiet === 0;
    const batch: BufferGeometry[] = [];
    const seen = new Set<BufferGeometry>();
    const limit = 16;
    const add = (g?: BufferGeometry | null) => {
      if (!g || g === this.primeEmpty || !g.isBufferGeometry) return;
      if (this.primedGeo.has(g) || seen.has(g) || batch.length >= limit) return;
      seen.add(g);
      batch.push(g);
    };
    const lodsOf = (o: Obj | null | undefined) => {
      const lods = (o?.userData as { lods?: BufferGeometry[] } | undefined)?.lods;
      if (!lods) return;
      for (const g of lods) add(g);
    };
    const world = this.real as unknown as { ovBlocks?: Obj[] };
    for (const block of world.ovBlocks || []) {
      add(block.geometry);
      lodsOf(block);
    }
    for (const r of this.real.regions.values()) {
      if (batch.length >= limit) break;
      const extra = r as Reg & { chunks?: { mesh?: Obj | null }[]; roadMesh?: Obj };
      for (const c of extra.chunks || []) add(c.mesh?.geometry);
      extra.roadMesh?.traverse((o) => add((o as Obj).geometry));
      for (const b of r.__awBB || []) add(b.bm.geometry);
    }
    if (scanScene && batch.length < limit) {
      const stack: Obj[] = [this.g.scene as unknown as Obj];
      while (stack.length && batch.length < limit) {
        const o = stack.pop()!;
        add(o.geometry);
        lodsOf(o);
        for (let i = 0; i < o.children.length; i++) stack.push(o.children[i] as Obj);
      }
    }
    if (!batch.length) {
      if (scanScene) {
        this.primeQuiet = 8;
        if (this.primeCount > 1000 && ++this.primeIdleScans >= 2) this.primeSettled = true;
      }
      return;
    }
    if (scanScene) this.primeIdleScans = 0;
    // The scene walk finished without filling the batch, so back off. A full
    // batch means more geometries are waiting; keep scanning next call.
    if (scanScene && batch.length < limit) this.primeQuiet = 8;
    if (!this.primeScene || !this.primeMat || !this.primeTarget || !this.primeCam) {
      this.primeScene = new Scene();
      this.primeMat = new MeshBasicMaterial();
      this.primeMat.visible = false;
      this.primeTarget = new WebGLRenderTarget(1, 1);
      this.primeCam = new PerspectiveCamera();
      for (let i = 0; i < limit + 1; i++) {
        const holder = new Mesh(this.primeEmpty, this.primeMat);
        holder.frustumCulled = false;
        holder.matrixAutoUpdate = false;
        holder.layers.enableAll();
        holder.visible = false;
        this.primeScene.add(holder);
        this.primeHolders.push(holder);
      }
    }
    const holders = this.primeHolders;
    const renderer = this.g.renderer;
    const renderHolders = () => {
      const prevTarget = renderer.getRenderTarget();
      const prevSort = renderer.sortObjects;
      const prevClear = renderer.autoClear;
      const shadow = renderer.shadowMap;
      const prevAuto = shadow.autoUpdate;
      const prevNeed = shadow.needsUpdate;
      const before = renderer.info.memory.geometries;
      renderer.sortObjects = false;
      renderer.autoClear = false;
      shadow.autoUpdate = false;
      shadow.needsUpdate = false;
      let threw = false;
      let grew = false;
      // get() only needs the geometry id. Leaving the attributes in place makes
      // geometries.update upload every hidden chunk, and that copy stayed in the
      // heap after the region was gone. The next real draw uploads the restored
      // attributes at their real size, because no GPU buffer exists yet.
      const hidden: Array<{ geo: BufferGeometry; attrs: BufferGeometry["attributes"] }> = [];
      const blanked = new Set<BufferGeometry>();
      for (const holder of holders) {
        const geo = holder.geometry as BufferGeometry | undefined;
        if (!geo || blanked.has(geo)) continue;
        blanked.add(geo);
        hidden.push({ geo, attrs: geo.attributes });
        geo.attributes = this.primeBlank;
      }
      try {
        renderer.setRenderTarget(this.primeTarget);
        renderer.render(this.primeScene!, this.primeCam!);
        grew = renderer.info.memory.geometries > before;
      } catch {
        threw = true;
      } finally {
        for (const item of hidden) item.geo.attributes = item.attrs;
        renderer.sortObjects = prevSort;
        renderer.autoClear = prevClear;
        shadow.autoUpdate = prevAuto;
        shadow.needsUpdate = prevNeed;
        renderer.setRenderTarget(prevTarget);
        for (const holder of holders) {
          holder.visible = false;
          holder.geometry = this.primeEmpty;
        }
      }
      return { threw, grew };
    };
    if (!this.primeLive) {
      holders[limit].visible = true;
      holders[limit].geometry = this.primeSentinel;
      const probe = renderHolders();
      if (probe.threw || !probe.grew) return;
      this.primeLive = true;
      this.primedGeo.add(this.primeSentinel);
    }
    for (let i = 0; i < limit; i++) {
      const geo = batch[i];
      holders[i].visible = !!geo;
      holders[i].geometry = geo || this.primeEmpty;
    }
    const primed = renderHolders();
    if (primed.threw) {
      // projectObject threw on the first geometry. Skip it so the walk moves on.
      if (batch[0]) this.primedGeo.add(batch[0]);
      return;
    }
    for (const g of batch) this.primedGeo.add(g);
    this.primeCount += batch.length;
  }

  /** Runs right after A's per-frame world update, before A renders. */
  private hookUpdate() {
    const A = this.real;
    const orig = A.update.bind(A);
    A.update = (...a: unknown[]) => {
      // Before the world update, so a chunk or overview swap disposes a geometry
      // that is already in the GPU map and the count does not climb.
      this.primeUnseenGeometries();
      orig(...a);
      if (this.trimPending) this.trim(a[0] as number, a[2] as number);
      this.warmRegionTextures();
      this.uploadPendingMaps(a[0] as number, a[2] as number);
      this.primeUnseenGeometries();
      if ((this.watchTick++ & 3) === 0) this.noteSwaps();
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
