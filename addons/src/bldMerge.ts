// r186: merge each built region's static building meshes per material (draw calls ~4x fewer).
// A builds buildings per quarter-region job, one mesh per material each (bld:wall/roof/tiles/trim/...),
// geometry already in world space under identity groups. Once a region reaches state "built", its
// bld:* meshes (not bld:kit, not instanced) with the same material + attribute layout are merged into
// one mesh keeping the same name, so A's distance-cull rules (bldR, detailR, ...) still apply, at
// region granularity. One region per call, at most every 6th frame. Off with ?bmerge=0.
import { Mesh, type BufferGeometry, type Material, type Object3D } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
import { tintKorpsPolitieShell } from "./bldFacadeTint";
type Reg = { state: string; group?: Object3D; __awBM?: boolean };
type M = Mesh & { isInstancedMesh?: boolean };
export class BldMerge {
  stats = { regions: 0, before: 0, after: 0, ms: 0 };
  private n = 0; private todo: { root: Object3D; list: M[] }[] = [];
  constructor(private g: AGame) {}
  frame() {
    if (++this.n % 3) return;
    // one material bucket per tick (spread a region's merge over several frames: no hitch while driving)
    const job = this.todo.shift(); if (job) { const t0 = performance.now(); this.mergeList(job.root, job.list); this.stats.ms = Math.max(this.stats.ms, performance.now() - t0); return; }
    const A = this.g.real as unknown as { regions: Map<string, Reg>; queue: { R: Reg }[] };
    for (const R of A.regions.values()) {
      if (R.__awBM || R.state !== "built" || !R.group) continue;
      if (A.queue.some((j) => j.R === R)) continue;
      R.__awBM = true; this.collect(R.group); return;
    }
  }
  private collect(root: Object3D) {
    const buckets = new Map<string, M[]>();
    root.traverse((o) => {
      const m = o as M;
      if (!m.isMesh || m.isInstancedMesh || !m.name.startsWith("bld:") || m.name === "bld:kit" || Array.isArray(m.material)) return;
      let p: Object3D | null = m, ok = true; while (p && p !== root) { if (!p.matrix.equals(IDENT)) ok = false; p = p.parent; } if (!ok) return;
      const geo = m.geometry as BufferGeometry;
      if (Object.keys(geo.morphAttributes).length || geo.groups.length) return;
      const k = m.name + "|" + (m.material as Material).uuid + "|" + Object.keys(geo.attributes).sort().join(",") + "|" + (geo.index ? 1 : 0) + "|" + (m.castShadow ? 1 : 0) + (m.receiveShadow ? 1 : 0) + "|" + m.renderOrder;
      (buckets.get(k) || buckets.set(k, []).get(k)!).push(m);
    });
    for (const list of buckets.values()) { this.stats.before += list.length; if (list.length < 2) this.stats.after++; else this.todo.push({ root, list }); }
    this.stats.regions++;
  }
  private mergeList(root: Object3D, list: M[]) {
    if (!list[0].parent) return; // region was unloaded meanwhile
    for (const m of list) tintKorpsPolitieShell(m.geometry as BufferGeometry, m.name);
    const merged = mergeGeometries(list.map((m) => m.geometry as BufferGeometry));
    if (!merged) { this.stats.after += list.length; return; }
    merged.computeBoundingSphere(); merged.computeBoundingBox();
    const f = list[0], nm = new Mesh(merged, f.material);
    nm.name = f.name; nm.castShadow = f.castShadow; nm.receiveShadow = f.receiveShadow; nm.renderOrder = f.renderOrder; nm.frustumCulled = f.frustumCulled;
    for (const m of list) { m.removeFromParent(); (m.geometry as BufferGeometry).dispose(); }
    root.add(nm); this.stats.after++;
  }
}
import { Matrix4 } from "three";
const IDENT = new Matrix4();
