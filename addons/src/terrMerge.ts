// r187: far region terrain. Each streamed region has its terrain in chunks (terrain4/8/16 by distance,
// re-meshed by A when the LOD changes). When every chunk of a region is on the far step (16) and none is
// re-meshing, the region's chunks draw as ONE merged mesh (same material); the merge is redone only when a
// chunk geometry changes, and near regions (any chunk at 4/8) are untouched. Off with ?tmerge=0.
import { Mesh, type BufferGeometry, type Material, type Object3D } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
type Ch = { mesh?: Mesh; step: number; pending?: boolean };
type Reg = { chunks?: Ch[]; group?: Object3D; mat?: Material; __awTM?: { key: string; mesh: Mesh } };
export class TerrMerge {
  stats = { merged: 0, chunks: 0 }; private n = 0; private live = new Set<Reg>();
  constructor(private real: { regions: Map<string, Reg>; update: (...a: unknown[]) => unknown }) {
    const orig = real.update.bind(real);
    real.update = (...a: unknown[]) => { const r = orig(...a); this.apply(); return r; };
  }
  private apply() {
    const doMerge = (++this.n & 7) === 0; let merged = 0, chunks = 0, budget = 1;
    for (const R of this.real.regions.values()) {
      const cs = R.chunks, st = R.__awTM;
      let far = !!cs && cs.length > 1 && !!R.group;
      if (far) for (const c of cs!) if (!c.mesh || c.step !== 16 || c.pending) { far = false; break; }
      if (!far) { if (st) { st.mesh.removeFromParent(); st.mesh.geometry.dispose(); R.__awTM = undefined; if (cs) for (const c of cs) if (c.mesh) c.mesh.visible = true; } continue; }
      let key = ""; for (const c of cs!) key += c.mesh!.geometry.id + ",";
      if ((!st || st.key !== key)) {
        if (!doMerge || budget <= 0) { if (st) { for (const c of cs!) c.mesh!.visible = true; st.mesh.visible = false; } continue; }
        budget--;
        const g = mergeGeometries(cs!.map((c) => c.mesh!.geometry as BufferGeometry));
        if (!g) continue;
        g.computeBoundingSphere();
        if (st) { st.mesh.geometry.dispose(); st.mesh.geometry = g; st.key = key; }
        else { const m = new Mesh(g, cs![0].mesh!.material); m.name = "terrain16:m"; m.receiveShadow = true; m.matrixAutoUpdate = false; R.group!.add(m); R.__awTM = { key, mesh: m }; this.live.add(R); }
      }
      R.__awTM!.mesh.visible = true; for (const c of cs!) c.mesh!.visible = false; merged++; chunks += cs!.length;
    }
    if (doMerge) for (const R of this.live) { const st = R.__awTM; let alive = false; for (const v of this.real.regions.values()) if (v === R) { alive = true; break; }
      if (!alive || !st) { if (st) { st.mesh.removeFromParent(); st.mesh.geometry.dispose(); R.__awTM = undefined; } this.live.delete(R); } } // region unloaded: free the merged copy
    this.stats.merged = merged; this.stats.chunks = chunks;
  }
}
