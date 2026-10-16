// Andicuri and Daimari parking aprons, Bushiribana's widened dirt road, and the
// limestone along its seaward edge. The north-shore surf itself is the sea shader.
// Photos set the shapes. Nothing here is a photo texture.
// Phone: two instanced meshes. ?nsh=0 turns it off.
import {
  BoxGeometry, BufferAttribute, BufferGeometry, Color, DoubleSide, Group, InstancedMesh, Matrix4, MeshLambertMaterial, Quaternion, Vector3,
} from "three";
import type { AGame } from "./env";

type Pt = [number, number];
type Row = number[];
type ShoreData = { anchors: Pt[]; pads: Row[]; rocks: Row[] };
type World = {
  heightAt(x: number, z: number): number;
  regions: Map<string, { H?: Float32Array }>;
  M: { X0: number; Z0: number; RS: number };
};

const SHOW = 1600;
const CELL = 8;
const PAD_N = 48;
const ROCK_N = 160;
const PAD_COL = [0xd2c4a8, 0xc4b496, 0xddd0b4, 0xb5a484];
const ROCK_COL = [0x6e675f, 0x847b70, 0x554e48, 0x91877c];

function join(geos: BufferGeometry[]) {
  const parts = geos.map((g) => (g.index ? g.toNonIndexed() : g));
  let n = 0;
  for (const p of parts) n += p.getAttribute("position").count;
  const pos = new Float32Array(n * 3);
  let o = 0;
  for (const p of parts) {
    const a = p.getAttribute("position").array as Float32Array;
    pos.set(a, o);
    o += a.length;
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.computeVertexNormals();
  return g;
}

export class NorthShore {
  private world: World;
  private hAt: (x: number, z: number) => number;
  private group = new Group();
  private data: ShoreData | null = null;
  private mask = new Set<string>();
  private pads: InstancedMesh;
  private rocks: InstancedMesh;
  private padOn: Uint8Array;
  private rockOn: Uint8Array;
  private padN = 0;
  private rockN = 0;
  private m = new Matrix4();
  private q = new Quaternion();
  private vec = new Vector3();
  private up = new Vector3(0, 1, 0);
  private scale = new Vector3();
  private tint = new Color();

  constructor(private g: AGame) {
    const w = g.real as unknown as World;
    this.world = w;
    this.hAt = (x, z) => w.heightAt(x, z);
    this.group.name = "aw:nsh";
    g.scene.add(this.group);
    this.pads = this.blank(this.padGeo(), PAD_N, "pads");
    this.rocks = this.blank(this.rockGeo(), ROCK_N, "rocks");
    this.padOn = new Uint8Array(PAD_N);
    this.rockOn = new Uint8Array(ROCK_N);
    this.paint(this.pads, PAD_N, PAD_COL[0]);
    this.paint(this.rocks, ROCK_N, ROCK_COL[0]);
    const padMat = this.pads.material as MeshLambertMaterial;
    padMat.side = DoubleSide;
    padMat.polygonOffset = true;
    padMat.polygonOffsetFactor = -3;
    padMat.polygonOffsetUnits = -10;
    this.pads.renderOrder = 2;
    this.bury(this.pads, PAD_N);
    this.bury(this.rocks, ROCK_N);
    this.installVeg();
    void this.load();
  }

  stats() {
    const d = this.data;
    let open = 0;
    if (d) {
      for (let i = 0; i < d.pads.length && i < this.padOn.length; i++) if (!this.padOn[i]) open++;
      for (let i = 0; i < d.rocks.length && i < this.rockOn.length; i++) if (!this.rockOn[i]) open++;
    }
    return { pads: this.padN, rocks: this.rockN, pending: d ? open : 1 };
  }

  frame() {
    const d = this.data;
    if (!d) return;
    const cam = (this.g.camera as unknown as { position: { x: number; z: number } }).position;
    let near = false;
    for (const a of d.anchors) if (Math.hypot(cam.x - a[0], cam.z - a[1]) < SHOW) { near = true; break; }
    this.group.visible = near;
    if (!near) return;
    this.padN = this.place(this.pads, d.pads, this.padOn, this.padN, PAD_COL, (r, y) => [r[0], y + 0.12, r[1], r[2] ?? 0, r[3] ?? 8, 1, r[4] ?? 6], 0.4, 40);
    this.rockN = this.place(this.rocks, d.rocks, this.rockOn, this.rockN, ROCK_COL, (r, y) => {
      const s = r[3] ?? 1;
      return [r[0], y, r[1], r[2] ?? 0, s, s, s];
    }, 0.25, 16);
  }

  private async load() {
    try {
      const res = await fetch("./data/real/north_shore.json", { cache: "force-cache" });
      if (!res.ok) return;
      this.data = await res.json() as ShoreData;
    } catch {
      return;
    }
    this.fillMask();
  }

  private place(mesh: InstancedMesh, rows: Row[], on: Uint8Array, placed: number, colors: number[], put: (row: Row, y: number) => number[], minY: number, maxY: number) {
    let n = 0;
    let moved = false;
    let hi = mesh.count;
    for (let i = 0; i < rows.length && i < on.length; i++) {
      if (on[i]) continue;
      const r = rows[i];
      if (!this.hasH(r[0], r[1])) continue;
      const y = this.hAt(r[0], r[1]);
      if (!Number.isFinite(y) || y < minY || y > maxY) { on[i] = 1; continue; }
      const p = put(r, y);
      this.setInst(mesh, i, p[0], p[1], p[2], p[3], p[4], p[5], p[6]);
      this.tint.setHex(colors[i % colors.length]);
      mesh.setColorAt(i, this.tint);
      on[i] = 1;
      placed++;
      moved = true;
      if (i + 1 > hi) hi = i + 1;
      if (++n >= 28) break;
    }
    if (moved) {
      mesh.count = hi;
      mesh.instanceMatrix.needsUpdate = true;
      if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    }
    return placed;
  }

  private fillMask() {
    const d = this.data!;
    const blob = (cx: number, cz: number, r: number) => {
      for (let x = cx - r; x <= cx + r; x += CELL) {
        for (let z = cz - r; z <= cz + r; z += CELL) this.mask.add((Math.floor(x / CELL)) + "," + (Math.floor(z / CELL)));
      }
    };
    for (const row of d.pads) blob(row[0], row[1], 10);
    for (const row of d.rocks) blob(row[0], row[1], 3);
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

  private hasH(x: number, z: number) {
    const M = this.world.M;
    const key = Math.floor((x - M.X0) / M.RS) + "," + Math.floor((z - M.Z0) / M.RS);
    const r = this.world.regions.get(key);
    return !!(r && r.H);
  }

  private blank(geo: BufferGeometry, n: number, name: string) {
    const mat = new MeshLambertMaterial({ color: 0xffffff });
    const mesh = new InstancedMesh(geo, mat, n);
    mesh.count = 0;
    mesh.frustumCulled = false;
    mesh.castShadow = false;
    mesh.receiveShadow = true;
    mesh.name = "aw:nsh:" + name;
    this.group.add(mesh);
    return mesh;
  }

  private paint(mesh: InstancedMesh, n: number, hex: number) {
    this.tint.setHex(hex);
    for (let i = 0; i < n; i++) mesh.setColorAt(i, this.tint);
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }

  private bury(mesh: InstancedMesh, n: number) {
    for (let i = 0; i < n; i++) this.setInst(mesh, i, 0, -80, 0, 0, 1, 1, 1);
    mesh.instanceMatrix.needsUpdate = true;
  }

  private setInst(mesh: InstancedMesh, i: number, x: number, y: number, z: number, yaw: number, sx: number, sy: number, sz: number) {
    this.q.setFromAxisAngle(this.up, yaw);
    this.vec.set(x, y, z);
    this.scale.set(sx, sy, sz);
    this.m.compose(this.vec, this.q, this.scale);
    mesh.setMatrixAt(i, this.m);
  }

  private padGeo() {
    return new BoxGeometry(1, 0.1, 1).translate(0, 0.05, 0);
  }

  private rockGeo() {
    const stones = [
      [-0.32, 0.28, 0.02, 0.62, 0.48, 0.5],
      [0.34, 0.22, -0.06, 0.5, 0.4, 0.44],
      [0.04, 0.46, 0.16, 0.4, 0.36, 0.36],
      [-0.08, 0.16, -0.3, 0.46, 0.3, 0.4],
    ];
    return join(stones.map(([x, y, z, sx, sy, sz]) => new BoxGeometry(sx, sy, sz).translate(x, y, z)));
  }
}
