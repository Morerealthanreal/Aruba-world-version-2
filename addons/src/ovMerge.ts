// r187: far overview terrain (A's ovBlocks, ~260 meshes of 32x32 cells, one shared material) drawn as
// 4x4 super-blocks. A still decides per block, every update, visibility (hidden inside the streamed
// "hole") and LOD (lods[0|1|2] by distance). After A's update: if every block of a super-block is
// visible and on the same LOD, the super-block's merged geometry for that LOD is drawn instead of its
// blocks; otherwise the blocks draw as A set them. Distance LOD is preserved exactly. Off with ?ovmerge=0.
import { Mesh, type BufferGeometry } from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
type Blk = Mesh & { userData: { lods: BufferGeometry[]; rect: number[] } };
type SB = { kids: Blk[]; mesh: Mesh; key: string; cache: Map<string, BufferGeometry | null> };
export class OvMerge {
  stats = { sb: 0, drawn: 0, blocks: 0 };
  private sbs: SB[] = [];
  constructor(real: { ovBlocks?: Blk[]; group: { add(o: unknown): void }; update: (...a: unknown[]) => unknown }) {
    const B = real.ovBlocks; if (!B || !B.length) return;
    const w = B[0].userData.rect[2] - B[0].userData.rect[0] || 1, h = B[0].userData.rect[3] - B[0].userData.rect[1] || 1;
    const x0 = Math.min(...B.map((b) => b.userData.rect[0])), z0 = Math.min(...B.map((b) => b.userData.rect[1]));
    const m = new Map<string, Blk[]>();
    for (const b of B) { const k = Math.floor((b.userData.rect[0] - x0 + 1) / (w * 4)) + "," + Math.floor((b.userData.rect[1] - z0 + 1) / (h * 4)); (m.get(k) || m.set(k, []).get(k)!).push(b); }
    for (const kids of m.values()) {
      if (kids.length < 2) continue;
      const mesh = new Mesh(kids[0].geometry, kids[0].material); mesh.name = "ovTerrain:sb"; mesh.receiveShadow = false; mesh.matrixAutoUpdate = false; mesh.visible = false;
      real.group.add(mesh); this.sbs.push({ kids, mesh, key: "", cache: new Map() });
    }
    this.stats.sb = this.sbs.length; this.stats.blocks = B.length;
    const orig = real.update.bind(real);
    real.update = (...a: unknown[]) => { const r = orig(...a); this.apply(); return r; };
  }
  // One live merge per super-block. Keeping older LOD copies left them in
  // renderer.info after they left the scene, so the phone soak's geometry
  // budget drifted whenever a new key showed up after warmup.
  private apply() {
    let drawn = 0;
    for (const s of this.sbs) {
      let key = "", vis = 0;
      for (const k of s.kids) { if (k.visible) { key += k.userData.lods.indexOf(k.geometry); vis++; } else key += "h"; }
      if (vis < 2) { s.mesh.visible = false; continue; }
      let g = s.cache.get(key);
      if (g === undefined) {
        g = mergeGeometries(s.kids.filter((k) => k.visible).map((k) => k.geometry as BufferGeometry)) || null;
        if (g) g.computeBoundingSphere();
        if (g) {
          // Assign before dispose so the mesh never points at a freed geometry.
          s.mesh.geometry = g;
          for (const [k0, g0] of s.cache) {
            s.cache.delete(k0);
            if (g0 && g0 !== g) g0.dispose();
          }
        }
        s.cache.set(key, g);
      } else { s.cache.delete(key); s.cache.set(key, g); }
      if (!g) { s.mesh.visible = false; continue; }
      s.mesh.geometry = g; s.mesh.visible = true; for (const k of s.kids) k.visible = false; drawn++;
    }
    this.stats.drawn = drawn;
  }
}
