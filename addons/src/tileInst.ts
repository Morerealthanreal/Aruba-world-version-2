// Tile instance consolidation (perf round 2).
// A builds one InstancedMesh per building kit set / parked-car lot / prop group: on HIGH
// ~23k kit + ~37k parked + ~3k props InstancedMesh objects (465k kit instances), each
// visited by updateMatrixWorld, the renderer's scene walk and A's 0.5 s cull pass, and
// each visible one is its own draw call (~350 parked draws on HIGH).
// Here, once a region is built, all of those are folded into ONE InstancedMesh per
// (kind, geometry, material) per region ("aw:inst:*", names A's cull pass ignores), and the
// per-lot distance rules A applied (kitR, parkHi/parkR, detailR/2) are applied per
// instance instead: the visible instances are compacted into the front of the buffer,
// one region per frame (round robin), only when the player moved > 4 m.
import { InstancedBufferAttribute, InstancedMesh, Matrix4, type BufferGeometry, type Material, type Object3D } from "three";

type IM = Object3D & { isInstancedMesh: true; count: number; geometry: BufferGeometry; material: Material; instanceMatrix: { array: Float32Array }; instanceColor: { array: Float32Array } | null };
type Q = Record<string, unknown>;
type Bucket = { kind: string; im: InstancedMesh; mats: Float32Array; cols: Float32Array | null; cx: Float32Array; cz: Float32Array; n: number; box: [number, number, number, number] };
type Reg = { state: string; group?: Object3D; __awInst?: Bucket[] };

const KINDS = new Set(["bld:kit", "parked", "parkedHi", "props"]);

export class TileInstances {
  folded = 0; // original InstancedMesh objects removed
  buckets = 0;
  private lastX = 1e9; private lastZ = 1e9;
  private dirty = new Set<Reg>();
  constructor(private q: Q) {}

  /** Fold one built region. Returns true if something was folded. */
  fold(r: Reg): boolean {
    if (r.__awInst || r.state !== "built" || !r.group) return false;
    const groups = new Map<string, IM[]>();
    r.group.updateMatrixWorld(true);
    r.group.traverse((o) => {
      const m = o as IM;
      if (!m.isInstancedMesh || !KINDS.has(m.name) || Array.isArray(m.material) || m.count === 0) return;
      const key = m.name + "|" + m.geometry.uuid + "|" + m.material.uuid + "|" + m.castShadow + "|" + m.receiveShadow + "|" + (m.instanceColor ? 1 : 0);
      let l = groups.get(key);
      if (!l) groups.set(key, (l = []));
      l.push(m);
    });
    const out: Bucket[] = [];
    const mw = new Matrix4(), mi = new Matrix4();
    for (const list of groups.values()) {
      if (list.length < 2) continue;
      let n = 0;
      for (const m of list) n += m.count;
      const mats = new Float32Array(n * 16), cx = new Float32Array(n), cz = new Float32Array(n);
      const cols = list[0].instanceColor ? new Float32Array(n * 3) : null;
      let k = 0;
      for (const m of list) {
        for (let i = 0; i < m.count; i++, k++) {
          mi.fromArray(m.instanceMatrix.array, i * 16);
          mw.multiplyMatrices(m.matrixWorld, mi);
          mw.toArray(mats, k * 16);
          cx[k] = mats[k * 16 + 12]; cz[k] = mats[k * 16 + 14];
          if (cols && m.instanceColor) for (let c = 0; c < 3; c++) cols[k * 3 + c] = m.instanceColor.array[i * 3 + c];
        }
      }
      const f = list[0];
      const im = new InstancedMesh(f.geometry, f.material, n);
      im.name = "aw:inst:" + f.name;
      im.castShadow = f.castShadow; im.receiveShadow = f.receiveShadow;
      im.frustumCulled = false; // instances are distance-culled below; the set is small and near the player
      im.matrixAutoUpdate = false;
      im.count = 0;
      im.visible = false;
      if (cols) im.instanceColor = new InstancedBufferAttribute(new Float32Array(n * 3), 3);
      r.group.add(im as unknown as Object3D);
      for (const m of list) { m.parent?.remove(m); this.folded++; }
      let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
      for (let i = 0; i < n; i++) { x0 = Math.min(x0, cx[i]); x1 = Math.max(x1, cx[i]); z0 = Math.min(z0, cz[i]); z1 = Math.max(z1, cz[i]); }
      out.push({ kind: f.name, im, mats, cols, cx, cz, n, box: [x0, z0, x1, z1] });
      this.buckets++;
    }
    r.__awInst = out;
    this.dirty.add(r);
    return out.length > 0;
  }

  private range(kind: string): [number, number] {
    const q = this.q;
    const contact = (q.contactR as number) || 220, hi = (q.parkHi as number) || 35;
    if (kind === "bld:kit") return [-1, (q.kitR as number) || 0];
    if (kind === "parked") return [hi, (q.parkR as number) || contact];
    if (kind === "parkedHi") return [-1, hi];
    return [-1, ((q.detailR as number) || 150) * 0.5];
  }

  private cull(r: Reg, x: number, z: number) {
    for (const b of r.__awInst || []) {
      const [lo, hi] = this.range(b.kind);
      const lo2 = lo < 0 ? -1 : lo * lo, hi2 = (hi + 3) * (hi + 3);
      const bx = Math.max(b.box[0] - x, 0, x - b.box[2]), bz = Math.max(b.box[1] - z, 0, z - b.box[3]);
      if (bx * bx + bz * bz >= hi2) { if (b.im.count) { b.im.count = 0; b.im.visible = false; } continue; }
      const dst = b.im.instanceMatrix.array as Float32Array;
      const dc = b.im.instanceColor ? (b.im.instanceColor.array as Float32Array) : null;
      let c = 0;
      for (let i = 0; i < b.n; i++) {
        const dx = b.cx[i] - x, dz = b.cz[i] - z, d = dx * dx + dz * dz;
        if (d >= hi2 || d < lo2) continue;
        dst.set(b.mats.subarray(i * 16, i * 16 + 16), c * 16);
        if (dc && b.cols) { dc[c * 3] = b.cols[i * 3]; dc[c * 3 + 1] = b.cols[i * 3 + 1]; dc[c * 3 + 2] = b.cols[i * 3 + 2]; }
        c++;
      }
      {
        b.im.count = c;
        b.im.visible = c > 0;
        if (c > 0) {
          b.im.instanceMatrix.clearUpdateRanges(); b.im.instanceMatrix.addUpdateRange(0, c * 16); b.im.instanceMatrix.needsUpdate = true;
          if (b.im.instanceColor) { b.im.instanceColor.clearUpdateRanges(); b.im.instanceColor.addUpdateRange(0, c * 3); b.im.instanceColor.needsUpdate = true; }
        }
      }
    }
  }

  private live = new Set<Reg>();
  /** Per frame, after A's update. x/z = A's streaming focus (player). */
  update(regions: Map<string, Reg>, x: number, z: number) {
    for (const r of regions.values()) if (!r.__awInst && r.state === "built") { if (this.fold(r) || r.__awInst) this.live.add(r); break; } // at most one fold per frame
    // regions A disposed: free our instance buffers
    if (this.live.size > regions.size) {
      const cur = new Set(regions.values());
      for (const r of this.live) if (!cur.has(r)) { for (const b of r.__awInst || []) b.im.dispose(); this.live.delete(r); this.dirty.delete(r); }
    }
    const moved = (x - this.lastX) ** 2 + (z - this.lastZ) ** 2 > 16;
    if (moved) { this.lastX = x; this.lastZ = z; for (const r of this.live) this.dirty.add(r); }
    // far buckets are rejected by their bounding box, so all dirty regions fit in one frame
    for (const r of this.dirty) this.cull(r, this.lastX, this.lastZ);
    this.dirty.clear();
  }
}
