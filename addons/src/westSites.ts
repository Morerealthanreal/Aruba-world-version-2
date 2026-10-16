// Casibari boulders, the stair and the cobble paths, Andicuri and Daimari
// beaches, and the Boca Prins dune patches. Positions are OSM. Ground photos
// set the colours and the massing. Nothing here is a photo texture.
//
// Phone soak: one sand mesh, one stair mesh, one instanced prop mesh, all
// allocated and uploaded at startup. ?west=0 turns it off.
// Sint Anna Kerk and De Olde Molen already have heroes, so they are not rebuilt.
// The Casibari entrance hero is left in place. Dune mounds stay inside the
// sand polygon, clear of the Boca Prins restaurant and of Arikok's interior.
import {
  BufferAttribute, BufferGeometry, Color, Group, InstancedMesh, Matrix4, Mesh,
  MeshLambertMaterial, Quaternion, SphereGeometry, Vector3,
} from "three";
import type { AGame } from "./env";

type Ring = number[][];
type Doc = {
  anchors: Ring;
  sand: number[][];
  props: number[][];
  stairs: { x: number; z: number; yaw: number; steps: number; rise: number; run: number; w: number };
  clear: Ring[];
};
type World = {
  heightAt(x: number, z: number): number;
  regions: Map<string, { H?: Float32Array }>;
  M: { X0: number; Z0: number; RS: number };
  vegDirty?: boolean;
};
type Job = { key: string; ids: number[]; at: number };

const SHOW = 1200;
const CELL = 8;
const SAND_Q = 480;
const STATIC_Q = 360;
const PROP_N = 36;
const CONCRETE = 0x6a6762;
const RAIL = 0x161412;

function rgb(hex: number): [number, number, number] {
  return [(hex >> 16) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255];
}

export class WestSites {
  private world: World;
  private hAt: (x: number, z: number) => number;
  private group = new Group();
  private data: Doc | null = null;
  private mask = new Set<string>();
  private sandMat: MeshLambertMaterial;
  private solidMat: MeshLambertMaterial;
  private sand: Mesh;
  private solid: Mesh;
  private props: InstancedMesh;
  private sPos: Float32Array;
  private sNor: Float32Array;
  private sCol: Float32Array;
  private sIdx: Uint32Array;
  private sV = 3;
  private sI = 3;
  private sUpV = 0;
  private sUpI = 0;
  private bPos: Float32Array;
  private bNor: Float32Array;
  private bCol: Float32Array;
  private bIdx: Uint32Array;
  private bV = 3;
  private bI = 3;
  private jobs: Job[] = [];
  private sandDone = false;
  private stairsOn = false;
  private on: Uint8Array;
  private placed = 0;
  private m = new Matrix4();
  private q = new Quaternion();
  private v = new Vector3();
  private up = new Vector3(0, 1, 0);
  private scale = new Vector3();
  private tint = new Color();

  constructor(private g: AGame) {
    const w = g.real as unknown as World;
    this.world = w;
    this.hAt = (x, z) => w.heightAt(x, z);
    this.group.name = "aw:west";
    g.scene.add(this.group);
    this.sandMat = new MeshLambertMaterial({ color: 0xffffff, vertexColors: true });
    this.sandMat.polygonOffset = true;
    this.sandMat.polygonOffsetFactor = -2;
    this.sandMat.polygonOffsetUnits = -4;
    this.solidMat = new MeshLambertMaterial({ color: 0xffffff, vertexColors: true });
    this.sand = this.sheet("sand", this.sandMat, SAND_Q);
    this.solid = this.sheet("solid", this.solidMat, STATIC_Q);
    this.sPos = this.sand.geometry.getAttribute("position").array as Float32Array;
    this.sNor = this.sand.geometry.getAttribute("normal").array as Float32Array;
    this.sCol = this.sand.geometry.getAttribute("color").array as Float32Array;
    this.sIdx = this.sand.geometry.getIndex()!.array as Uint32Array;
    this.bPos = this.solid.geometry.getAttribute("position").array as Float32Array;
    this.bNor = this.solid.geometry.getAttribute("normal").array as Float32Array;
    this.bCol = this.solid.geometry.getAttribute("color").array as Float32Array;
    this.bIdx = this.solid.geometry.getIndex()!.array as Uint32Array;
    const geo = new SphereGeometry(0.5, 7, 5).translate(0, 0.5, 0);
    this.props = new InstancedMesh(geo, new MeshLambertMaterial({ color: 0xffffff }), PROP_N);
    this.props.name = "aw:west:props";
    this.props.count = PROP_N;
    this.props.frustumCulled = false;
    this.props.castShadow = false;
    this.props.receiveShadow = true;
    this.group.add(this.props);
    this.on = new Uint8Array(PROP_N);
    this.tint.setHex(0xffffff);
    for (let i = 0; i < PROP_N; i++) {
      this.setInst(i, 0, -80, 0, 0, 1, 1, 1);
      this.props.setColorAt(i, this.tint);
    }
    this.props.instanceMatrix.needsUpdate = true;
    if (this.props.instanceColor) this.props.instanceColor.needsUpdate = true;
    this.installVeg();
    this.bakeGpu();
    void this.load();
  }

  pending() {
    if (!this.data) return 1;
    let n = 0;
    if (!this.sandDone) for (const job of this.jobs) if (job.at < job.ids.length && this.hasKey(job.key)) n++;
    const s = this.data.stairs;
    if (!this.stairsOn && this.hasH(s.x, s.z)) n++;
    for (let i = 0; i < this.data.props.length; i++) {
      const p = this.data.props[i];
      if (!this.on[i] && this.hasH(p[0], p[1])) { n++; break; }
    }
    return n;
  }

  stats() {
    return {
      sand: Math.max(0, (this.sI - 3) / 6),
      props: this.placed,
      stairs: this.stairsOn,
      pending: this.pending(),
    };
  }

  frame() {
    if (!this.data) return;
    this.pump();
    this.buildStairs();
    this.place();
    const cam = this.g.camera.position;
    let show = false;
    for (const a of this.data.anchors) {
      const dx = cam.x - a[0], dz = cam.z - a[1];
      if (dx * dx + dz * dz < SHOW * SHOW) { show = true; break; }
    }
    if (this.group.visible !== show) this.group.visible = show;
  }

  private installVeg() {
    const w = window as unknown as { __awVegHit?: (x: number, z: number, n?: string) => boolean };
    const prev = w.__awVegHit;
    const mask = this.mask;
    w.__awVegHit = (x, z, n) => {
      if (mask.has((Math.floor(x / CELL)) + "," + (Math.floor(z / CELL)))) return true;
      return prev ? prev(x, z, n) : false;
    };
  }

  private async load() {
    try {
      const res = await fetch("./data/real/west_sites.json", { cache: "force-cache" });
      if (!res.ok) return;
      this.data = await res.json() as Doc;
    } catch {
      return;
    }
    const buckets = new Map<string, number[]>();
    this.data.sand.forEach((q, i) => {
      const cx = (q[0] + q[2] + q[4] + q[6]) * 0.25;
      const cz = (q[1] + q[3] + q[5] + q[7]) * 0.25;
      const key = this.regKey(cx, cz);
      const ids = buckets.get(key);
      if (ids) ids.push(i);
      else buckets.set(key, [i]);
    });
    for (const [key, ids] of buckets) this.jobs.push({ key, ids, at: 0 });
    this.sandDone = this.jobs.length === 0;
    this.fillMask();
    this.world.vegDirty = true;
    this.bakeGpu();
  }

  private fillMask() {
    const d = this.data!;
    const mark = (x: number, z: number) => this.mask.add((Math.floor(x / CELL)) + "," + (Math.floor(z / CELL)));
    for (const ring of d.clear) {
      let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
      for (const p of ring) {
        x0 = Math.min(x0, p[0]); x1 = Math.max(x1, p[0]);
        z0 = Math.min(z0, p[1]); z1 = Math.max(z1, p[1]);
      }
      for (let x = x0; x <= x1; x += CELL) for (let z = z0; z <= z1; z += CELL) {
        if (this.inside(ring, x, z)) mark(x, z);
      }
    }
  }

  private inside(ring: Ring, x: number, z: number) {
    let c = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const yi = ring[i][1], yj = ring[j][1];
      if ((yi > z) !== (yj > z) && x < ((ring[j][0] - ring[i][0]) * (z - yi)) / (yj - yi) + ring[i][0]) c = !c;
    }
    return c;
  }

  private pump() {
    if (this.sandDone) return;
    let budget = 80;
    let dirty = false;
    for (const job of this.jobs) {
      if (job.at >= job.ids.length || !this.hasKey(job.key)) continue;
      while (job.at < job.ids.length && budget > 0) {
        this.emitQuad(this.data!.sand[job.ids[job.at]]);
        job.at++;
        budget--;
        dirty = true;
      }
    }
    if (dirty) this.uploadSand();
    this.sandDone = this.jobs.every((job) => job.at >= job.ids.length);
  }

  private emitQuad(q: number[]) {
    if (this.sV + 4 >= this.sPos.length / 3 || this.sI + 6 >= this.sIdx.length) return;
    const lift = q[9];
    const y = (x: number, z: number) => {
      const h = this.hAt(x, z);
      return Number.isFinite(h) ? h + lift : lift;
    };
    const pts: [number, number, number][] = [
      [q[0], y(q[0], q[1]), q[1]],
      [q[6], y(q[6], q[7]), q[7]],
      [q[4], y(q[4], q[5]), q[5]],
      [q[2], y(q[2], q[3]), q[3]],
    ];
    const [r, g, b] = rgb(q[8]);
    const ids = pts.map((p) => this.svert(p[0], p[1], p[2], r, g, b));
    this.sIdx[this.sI++] = ids[0]; this.sIdx[this.sI++] = ids[1]; this.sIdx[this.sI++] = ids[2];
    this.sIdx[this.sI++] = ids[0]; this.sIdx[this.sI++] = ids[2]; this.sIdx[this.sI++] = ids[3];
  }

  private svert(x: number, y: number, z: number, r: number, g: number, b: number) {
    const i = this.sV++;
    const o = i * 3;
    this.sPos[o] = x; this.sPos[o + 1] = y; this.sPos[o + 2] = z;
    this.sNor[o] = 0; this.sNor[o + 1] = 1; this.sNor[o + 2] = 0;
    this.sCol[o] = r; this.sCol[o + 1] = g; this.sCol[o + 2] = b;
    return i;
  }

  private uploadSand() {
    const g = this.sand.geometry;
    const pos = g.getAttribute("position") as BufferAttribute;
    const nor = g.getAttribute("normal") as BufferAttribute;
    const col = g.getAttribute("color") as BufferAttribute;
    const idx = g.getIndex()!;
    pos.clearUpdateRanges(); nor.clearUpdateRanges(); col.clearUpdateRanges(); idx.clearUpdateRanges();
    pos.addUpdateRange(this.sUpV * 3, (this.sV - this.sUpV) * 3);
    nor.addUpdateRange(this.sUpV * 3, (this.sV - this.sUpV) * 3);
    col.addUpdateRange(this.sUpV * 3, (this.sV - this.sUpV) * 3);
    idx.addUpdateRange(this.sUpI, this.sI - this.sUpI);
    pos.needsUpdate = true; nor.needsUpdate = true; col.needsUpdate = true; idx.needsUpdate = true;
    g.setDrawRange(0, this.sI);
    g.computeBoundingSphere();
    this.sUpV = this.sV; this.sUpI = this.sI;
  }

  private buildStairs() {
    if (this.stairsOn || !this.data) return;
    const s = this.data.stairs;
    if (!this.hasH(s.x, s.z)) return;
    const y0 = this.hAt(s.x, s.z);
    if (!Number.isFinite(y0)) return;
    const dx = Math.sin(s.yaw), dz = -Math.cos(s.yaw);
    const reach = s.run * (s.steps - 1);
    const yFar = this.hAt(s.x + dx * reach, s.z + dz * reach);
    const rise = s.rise + Math.max(0, (Number.isFinite(yFar) ? yFar : y0) - y0) / s.steps;
    const boxYaw = Math.PI + s.yaw;
    for (let i = 0; i < s.steps; i++) {
      const along = (i + 0.5) * s.run;
      this.box(
        s.x + dx * along, y0 + i * rise + rise * 0.5, s.z + dz * along,
        s.w, rise, s.run * 0.96, boxYaw, CONCRETE,
      );
      const railY = y0 + (i + 1) * rise + 0.85;
      for (const sgn of [-1, 1]) {
        const ox = -Math.cos(s.yaw) * (s.w * 0.5 + 0.04) * sgn;
        const oz = -Math.sin(s.yaw) * (s.w * 0.5 + 0.04) * sgn;
        this.box(s.x + dx * along + ox, railY, s.z + dz * along + oz, 0.05, 0.05, s.run, boxYaw, RAIL);
      }
    }
    const postH = rise + 0.85;
    for (let i = 0; i < s.steps; i += 3) {
      const along = i * s.run;
      const py = y0 + i * rise + postH * 0.5;
      for (const sgn of [-1, 1]) {
        const ox = -Math.cos(s.yaw) * (s.w * 0.5 + 0.04) * sgn;
        const oz = -Math.sin(s.yaw) * (s.w * 0.5 + 0.04) * sgn;
        this.box(s.x + dx * along + ox, py, s.z + dz * along + oz, 0.07, postH, 0.07, boxYaw, RAIL);
      }
    }
    this.uploadSolid();
    this.stairsOn = true;
  }

  private box(cx: number, cy: number, cz: number, sx: number, sy: number, sz: number, yaw: number, hex: number) {
    if (this.bV + 24 >= this.bPos.length / 3 || this.bI + 36 >= this.bIdx.length) return;
    const c = Math.cos(yaw), s = Math.sin(yaw);
    const hx = sx / 2, hy = sy / 2, hz = sz / 2;
    const p = (x: number, y: number, z: number): [number, number, number] => [cx + x * c - z * s, cy + y, cz + x * s + z * c];
    const corners: [number, number, number][] = [
      p(-hx, -hy, -hz), p(hx, -hy, -hz), p(hx, -hy, hz), p(-hx, -hy, hz),
      p(-hx, hy, -hz), p(hx, hy, -hz), p(hx, hy, hz), p(-hx, hy, hz),
    ];
    const [r, g, b] = rgb(hex);
    const faces: [number, number, number, number, number, number, number][] = [
      [0, 1, 2, 3, 0, -1, 0], [4, 7, 6, 5, 0, 1, 0], [0, 4, 5, 1, 0, 0, -1],
      [1, 5, 6, 2, 1, 0, 0], [2, 6, 7, 3, 0, 0, 1], [3, 7, 4, 0, -1, 0, 0],
    ];
    for (const f of faces) {
      const nx = f[4] * c - f[6] * s, nz = f[4] * s + f[6] * c;
      const ids = [0, 1, 2, 3].map((k) => {
        const i = this.bV++;
        const o = i * 3;
        const pt = corners[f[k]];
        this.bPos[o] = pt[0]; this.bPos[o + 1] = pt[1]; this.bPos[o + 2] = pt[2];
        this.bNor[o] = nx; this.bNor[o + 1] = f[5]; this.bNor[o + 2] = nz;
        this.bCol[o] = r; this.bCol[o + 1] = g; this.bCol[o + 2] = b;
        return i;
      });
      this.bIdx[this.bI++] = ids[0]; this.bIdx[this.bI++] = ids[1]; this.bIdx[this.bI++] = ids[2];
      this.bIdx[this.bI++] = ids[0]; this.bIdx[this.bI++] = ids[2]; this.bIdx[this.bI++] = ids[3];
    }
  }

  private uploadSolid() {
    const g = this.solid.geometry;
    const pos = g.getAttribute("position") as BufferAttribute;
    const nor = g.getAttribute("normal") as BufferAttribute;
    const col = g.getAttribute("color") as BufferAttribute;
    const idx = g.getIndex()!;
    pos.clearUpdateRanges(); nor.clearUpdateRanges(); col.clearUpdateRanges(); idx.clearUpdateRanges();
    pos.addUpdateRange(0, this.bV * 3);
    nor.addUpdateRange(0, this.bV * 3);
    col.addUpdateRange(0, this.bV * 3);
    idx.addUpdateRange(0, this.bI);
    pos.needsUpdate = true; nor.needsUpdate = true; col.needsUpdate = true; idx.needsUpdate = true;
    g.setDrawRange(0, this.bI);
    g.computeBoundingSphere();
  }

  private place() {
    const d = this.data!;
    let n = 0;
    let moved = false;
    for (let i = 0; i < d.props.length && i < PROP_N; i++) {
      if (this.on[i]) continue;
      const p = d.props[i];
      if (!this.hasH(p[0], p[1])) continue;
      const y = this.hAt(p[0], p[1]);
      if (!Number.isFinite(y)) continue;
      // Wide mounds are ellipsoids. Sink them so the dome meets the sand instead of touching at a point.
      const sink = p[3] > 12 ? p[4] * 0.48 : 0;
      this.setInst(i, p[0], y - sink, p[1], p[2], p[3], p[4], p[5]);
      this.tint.setHex(p[6]);
      this.props.setColorAt(i, this.tint);
      this.on[i] = 1;
      this.placed++;
      moved = true;
      if (++n >= 8) break;
    }
    if (moved) {
      this.props.instanceMatrix.needsUpdate = true;
      if (this.props.instanceColor) this.props.instanceColor.needsUpdate = true;
    }
  }

  private setInst(i: number, x: number, y: number, z: number, yaw: number, sx: number, sy: number, sz: number) {
    this.v.set(x, y, z);
    this.q.setFromAxisAngle(this.up, yaw);
    this.scale.set(sx, sy, sz);
    this.m.compose(this.v, this.q, this.scale);
    this.props.setMatrixAt(i, this.m);
  }

  private sheet(name: string, mat: MeshLambertMaterial, quads: number) {
    const vMax = 3 + quads * 4, iMax = 3 + quads * 6;
    const pos = new Float32Array(vMax * 3), nor = new Float32Array(vMax * 3), col = new Float32Array(vMax * 3), idx = new Uint32Array(iMax);
    for (let i = 0; i < vMax; i++) { pos[i * 3 + 1] = -40; nor[i * 3 + 1] = 1; col[i * 3] = 1; col[i * 3 + 1] = 1; col[i * 3 + 2] = 1; }
    idx[0] = 0; idx[1] = 1; idx[2] = 2;
    pos[3] = 0.4; pos[8] = 0.4;
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    geo.setAttribute("normal", new BufferAttribute(nor, 3));
    geo.setAttribute("color", new BufferAttribute(col, 3));
    geo.setIndex(new BufferAttribute(idx, 1));
    geo.setDrawRange(0, 3);
    geo.computeBoundingSphere();
    const mesh = new Mesh(geo, mat);
    mesh.name = "aw:west:" + name;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    mesh.matrixAutoUpdate = false;
    this.group.add(mesh);
    return mesh;
  }

  private bakeGpu() {
    this.group.visible = true;
    this.props.frustumCulled = false;
    this.sand.frustumCulled = false;
    this.solid.frustumCulled = false;
    try { this.g.renderer.render(this.group, this.g.camera); } catch { /* still playable if the one-shot draw fails */ }
    this.group.visible = false;
  }

  private hasH(x: number, z: number) { return this.hasKey(this.regKey(x, z)); }

  private hasKey(key: string) {
    const r = this.world.regions.get(key);
    return !!(r && r.H);
  }

  private regKey(x: number, z: number) {
    const M = this.world.M;
    return Math.floor((x - M.X0) / M.RS) + "," + Math.floor((z - M.Z0) / M.RS);
  }
}
