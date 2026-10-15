// Skip the per-frame matrix walk of static subtrees (off: ?mwfreeze=0).
// scene.updateMatrixWorld() visits every object every frame (~4.5k under A's world group: region
// content, hero GLBs with matrixAutoUpdate on, brand signs) although nearly all of it never moves.
// In three r186 matrixWorldAutoUpdate=false does not stop the recursion, so a subtree whose local
// transforms were the same in two snapshots OBS seconds apart gets an updateMatrixWorld that returns
// unless its own matrixWorldNeedsUpdate is set, its own local transform or its parent's world matrix
// changed (forced updates from auto-updating ancestors are otherwise skipped).
// It thaws:
//  - at once when anything is added inside it ("childadded" listener on every node),
//  - when the round-robin checker sees a changed position/quaternion/scale or a pending
//    matrixWorldNeedsUpdate (CHECK nodes per frame, so all frozen nodes are re-checked every few frames).
// Unfrozen subtrees are observed with a budget of OBSERVE nodes per frame.
// A subtree that moves or keeps growing during observation is split into its children (depth-limited;
// children added to it later are tracked too), so moving parts (peds, cars, animated props) keep
// updating normally while their static siblings freeze.
import type { Object3D } from "three";
import type { AGame } from "./env";

type N = Object3D & { __awFz?: Root };
type Root = { o: N; depth: number; nodes: N[]; snap: Float64Array; pm: Float64Array; t: number; frozen: boolean; dead: boolean; fthaw: boolean };
const OBS = 2, MAX_DEPTH = 4, CHECK = 600, OBSERVE = 400;

function snapshot(nodes: N[], out?: Float64Array): Float64Array {
  const s = out && out.length === nodes.length * 10 ? out : new Float64Array(nodes.length * 10);
  for (let i = 0, k = 0; i < nodes.length; i++, k += 10) {
    const o = nodes[i], p = o.position, q = o.quaternion, c = o.scale;
    s[k] = p.x; s[k + 1] = p.y; s[k + 2] = p.z; s[k + 3] = q.x; s[k + 4] = q.y; s[k + 5] = q.z; s[k + 6] = q.w;
    s[k + 7] = c.x; s[k + 8] = c.y; s[k + 9] = c.z;
  }
  return s;
}
function same(o: N, s: Float64Array, k: number) {
  const p = o.position, q = o.quaternion, c = o.scale;
  return s[k] === p.x && s[k + 1] === p.y && s[k + 2] === p.z && s[k + 3] === q.x && s[k + 4] === q.y && s[k + 5] === q.z &&
    s[k + 6] === q.w && s[k + 7] === c.x && s[k + 8] === c.y && s[k + 9] === c.z;
}
function sameM(e: ArrayLike<number>, m: Float64Array) {
  for (let i = 0; i < 16; i++) if (e[i] !== m[i]) return false;
  return true;
}
function collect(o: N, out: N[]) { out.push(o); const ch = o.children; for (let i = 0; i < ch.length; i++) collect(ch[i] as N, out); return out; }
function under(r: Root, top: Object3D) {
  let o: Object3D | null = r.o;
  for (let d = 0; d < r.depth && o; d++) o = o.parent;
  return o === top;
}
const proto = (o: Object3D) => Object.getPrototypeOf(o) as { updateMatrixWorld: (f?: boolean) => void };

function rootUpdate(this: N, force?: boolean) {
  const r = this.__awFz;
  if (r && r.frozen) {
    if (!this.matrixWorldNeedsUpdate) {
      if (!force) return;
      // groups with matrixAutoUpdate (A's defaults) force their whole subtree every frame
      const p = this.parent;
      if (p && sameM(p.matrixWorld.elements, r.pm) && same(this, r.snap, 0)) return;
    }
    thaw(r); r.fthaw = true;
  }
  proto(this).updateMatrixWorld.call(this, force);
}
function onChildAdded(e: { target: N }) {
  for (let o: N | null = e.target; o; o = o.parent as N | null) if (o.__awFz && o.__awFz.frozen) { thaw(o.__awFz); return; }
}
function thaw(r: Root) {
  if (!r.frozen) return;
  r.frozen = false; r.t = -1;
  proto(r.o).updateMatrixWorld.call(r.o, false);
}

export class StaticFreeze {
  stats = { frozen: 0, frozenNodes: 0, thaws: 0, splits: 0, roots: 0 };
  private roots: Root[] = []; private parents: Root[] = []; private tracked = new WeakSet<Object3D>(); private hooked = new WeakSet<Object3D>();
  private clock = 0; private scanT = 0; private ci = 0; private ck = 0; private oi = 0;
  constructor(private g: AGame) {}
  private top(): N | null { return ((this.g.real as unknown as { group?: N }) || {}).group || null; }
  private track(o: N, depth: number) {
    if (this.tracked.has(o)) return;
    this.tracked.add(o);
    this.roots.push({ o, depth, nodes: [], snap: new Float64Array(0), pm: new Float64Array(16), t: -1, frozen: false, dead: false, fthaw: false });
  }
  frame(dt: number) {
    const top = this.top();
    if (!top) return;
    this.clock += dt;
    if ((this.scanT -= dt) <= 0) {
      this.scanT = 1;
      for (const c of top.children) this.track(c as N, 1);
      let pw = 0;
      for (const p of this.parents) {
        if (!under(p, top)) { this.tracked.delete(p.o); continue; }
        this.parents[pw++] = p;
        for (const c of p.o.children) this.track(c as N, p.depth + 1);
      }
      this.parents.length = pw;
      let w = 0, fz = 0, fn = 0;
      for (const r of this.roots) {
        if (!under(r, top)) { thaw(r); r.dead = true; this.tracked.delete(r.o); }
        if (r.dead) continue;
        this.roots[w++] = r; if (r.frozen) { fz++; fn += r.nodes.length; }
      }
      this.roots.length = w; this.stats.roots = w; this.stats.frozen = fz; this.stats.frozenNodes = fn;
    }
    const n = this.roots.length;
    if (!n) return;
    // observe unfrozen roots, a few per frame
    for (let k = 0, ob = OBSERVE; k < n && ob > 0; k++) {
      const r = this.roots[this.oi = (this.oi + 1) % n];
      if (r.fthaw) { r.fthaw = false; this.stats.thaws++; }
      if (r.frozen || r.dead) continue;
      if (r.t >= 0 && this.clock - r.t < OBS) continue;
      const nodes = collect(r.o, []), prev = r.snap, pn = r.nodes;
      ob -= nodes.length;
      let moved = r.t < 0 || pn.length !== nodes.length;
      for (let i = 0; i < nodes.length && !moved; i++) if (nodes[i] !== pn[i] || !same(nodes[i], prev, i * 10)) moved = true;
      if (moved && r.t >= 0 && r.depth < MAX_DEPTH && r.o.children.length) {
        r.dead = true; this.stats.splits++; this.parents.push(r);
        for (const c of r.o.children) this.track(c as N, r.depth + 1);
        continue;
      }
      if (moved) { r.nodes = nodes; r.snap = snapshot(nodes, prev); r.t = this.clock; continue; }
      this.freeze(r);
    }
    // re-check frozen nodes round-robin
    let budget = CHECK;
    for (let guard = 0; budget > 0 && guard < n; guard++) {
      const r = this.roots[this.ci % n];
      if (!r.frozen) { this.ci++; this.ck = 0; continue; }
      const nodes = r.nodes, s = r.snap;
      let bad = false, i = this.ck;
      for (; i < nodes.length && budget > 0; i++, budget--) {
        const o = nodes[i];
        if ((i > 0 && o.matrixWorldNeedsUpdate) || !same(o, s, i * 10)) { bad = true; break; }
      }
      if (bad) { thaw(r); this.stats.thaws++; }
      if (bad || i >= nodes.length) { this.ci++; this.ck = 0; } else { this.ck = i; break; }
    }
  }
  private freeze(r: Root) {
    if (!r.o.parent) return;
    proto(r.o).updateMatrixWorld.call(r.o, false);
    const pe = r.o.parent.matrixWorld.elements;
    for (let i = 0; i < 16; i++) r.pm[i] = pe[i];
    for (const o of r.nodes) if (!this.hooked.has(o)) { this.hooked.add(o); o.addEventListener("childadded" as never, onChildAdded as never); }
    if (!Object.prototype.hasOwnProperty.call(r.o, "updateMatrixWorld")) (r.o as unknown as Record<string, unknown>).updateMatrixWorld = rootUpdate;
    r.o.__awFz = r;
    r.frozen = true;
  }
}
