// r192: instance pools shared across regions (?ipool=0 to disable).
// tileInst.ts (A's kit / parked cars / props) and flora.ts kept one InstancedMesh per region per
// (geometry, material): every visible region added its own draw call for the same mesh. A Pool
// draws every region's in-range instances of one (geometry, material) in a single InstancedMesh.
// The per-instance distance rules and the move thresholds are unchanged; only where the visible
// instances are packed changes. Rows are copied with plain loops (no per-instance subarray views).
import { InstancedBufferAttribute, InstancedMesh, type BufferGeometry, type Material, type Object3D } from "three";

export type Src = { mats: Float32Array; cols?: Float32Array | null; cx: Float32Array; cz: Float32Array; n: number; box: [number, number, number, number] };
type Opts = { name: string; castShadow: boolean; receiveShadow: boolean; colored: boolean };

export class Pool {
  im: InstancedMesh | null = null;
  private cap = 0;
  private srcs = new Set<Src>();
  constructor(private geo: BufferGeometry, private mat: Material, private o: Opts, private parent: Object3D) {}
  get size() { return this.srcs.size; }
  add(s: Src) { this.srcs.add(s); let n = 0; for (const x of this.srcs) n += x.n; if (n > this.cap) this.grow(n); }
  remove(s: Src) { this.srcs.delete(s); }
  private grow(n: number) {
    let cap = 256; while (cap < n) cap *= 2;
    const old = this.im, im = new InstancedMesh(this.geo, this.mat, cap);
    im.name = this.o.name; im.castShadow = this.o.castShadow; im.receiveShadow = this.o.receiveShadow;
    im.frustumCulled = false; im.matrixAutoUpdate = false; im.count = 0; im.visible = false;
    if (this.o.colored) im.instanceColor = new InstancedBufferAttribute(new Float32Array(cap * 3), 3);
    if (old) { im.count = old.count; im.visible = old.visible; (im.instanceMatrix.array as Float32Array).set((old.instanceMatrix.array as Float32Array).subarray(0, old.count * 16)); if (old.instanceColor && im.instanceColor) (im.instanceColor.array as Float32Array).set((old.instanceColor.array as Float32Array).subarray(0, old.count * 3)); old.removeFromParent(); old.dispose(); }
    this.parent.add(im as unknown as Object3D);
    this.im = im; this.cap = cap;
  }
  /** pack the instances with lo <= distance < hi (lo < 0: no inner bound) of every source */
  fill(x: number, z: number, lo: number, hi: number) {
    const im = this.im; if (!im) return 0;
    const lo2 = lo < 0 ? -1 : lo * lo, hi2 = hi * hi;
    const dst = im.instanceMatrix.array as Float32Array, dc = im.instanceColor ? (im.instanceColor.array as Float32Array) : null;
    let c = 0;
    for (const b of this.srcs) {
      const bx = Math.max(b.box[0] - x, 0, x - b.box[2]), bz = Math.max(b.box[1] - z, 0, z - b.box[3]);
      if (bx * bx + bz * bz >= hi2) continue;
      const M = b.mats, C = b.cols;
      for (let i = 0; i < b.n; i++) {
        const dx = b.cx[i] - x, dz = b.cz[i] - z, d = dx * dx + dz * dz;
        if (d >= hi2 || d < lo2) continue;
        const s = i * 16, t = c * 16;
        for (let k = 0; k < 16; k++) dst[t + k] = M[s + k];
        if (dc && C) { dc[c * 3] = C[i * 3]; dc[c * 3 + 1] = C[i * 3 + 1]; dc[c * 3 + 2] = C[i * 3 + 2]; }
        c++;
      }
    }
    im.count = c; im.visible = c > 0;
    if (c > 0) {
      im.instanceMatrix.clearUpdateRanges(); im.instanceMatrix.addUpdateRange(0, c * 16); im.instanceMatrix.needsUpdate = true;
      if (im.instanceColor) { im.instanceColor.clearUpdateRanges(); im.instanceColor.addUpdateRange(0, c * 3); im.instanceColor.needsUpdate = true; }
    }
    return c;
  }
  dispose() { if (this.im) { this.im.removeFromParent(); this.im.dispose(); this.im = null; } this.cap = 0; }
}
