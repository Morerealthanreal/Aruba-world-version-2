// Instanced reef fish from the species snorkelers actually see at Boca Catalina
// and Mangel Halto: blue tang, sergeant major, stoplight parrotfish, French angelfish.
// One mesh per species, matrices written from the pooled school. No textures.
import {
  BoxGeometry, BufferAttribute, BufferGeometry, Color, Group, InstancedMesh,
  Matrix4, MeshStandardMaterial, Object3D,
} from "three";
import type { School } from "./boids";

export function fishCount(quality: string): number {
  if (quality === "low") return 12;
  if (quality === "high") return 48;
  return 28;
}

type Part = { mesh: InstancedMesh; count: number; base: number };

function painted(geo: BufferGeometry, hex: number): BufferGeometry {
  const g = geo.toNonIndexed();
  const n = g.getAttribute("position").count;
  const c = new Float32Array(n * 3);
  const col = new Color(hex);
  for (let i = 0; i < n; i++) {
    c[i * 3] = col.r;
    c[i * 3 + 1] = col.g;
    c[i * 3 + 2] = col.b;
  }
  g.setAttribute("color", new BufferAttribute(c, 3));
  return g;
}

function merge(parts: BufferGeometry[]): BufferGeometry {
  let count = 0;
  for (const p of parts) count += p.getAttribute("position").count;
  const pos = new Float32Array(count * 3);
  const nrm = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  let o = 0;
  for (const p of parts) {
    const pp = p.getAttribute("position");
    const nn = p.getAttribute("normal");
    const cc = p.getAttribute("color");
    pos.set(pp.array as Float32Array, o * 3);
    nrm.set(nn.array as Float32Array, o * 3);
    col.set(cc.array as Float32Array, o * 3);
    o += pp.count;
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new BufferAttribute(pos, 3));
  g.setAttribute("normal", new BufferAttribute(nrm, 3));
  g.setAttribute("color", new BufferAttribute(col, 3));
  return g;
}

/** Nose is local -Z so Object3D.lookAt faces the fish along its swim. */
function fishShape(
  body: [number, number, number],
  bodyHex: number,
  tail: [number, number, number],
  tailHex: number,
  extra: BufferGeometry[] = [],
): BufferGeometry {
  const [bw, bh, bl] = body;
  const [tw, th, tl] = tail;
  const bodyGeo = painted(new BoxGeometry(bw, bh, bl).translate(0, 0, -bl * 0.12), bodyHex);
  const tailGeo = painted(new BoxGeometry(tw, th, tl).translate(0, 0, bl * 0.42), tailHex);
  return merge([bodyGeo, tailGeo, ...extra]);
}

function bar(z: number): BufferGeometry {
  return painted(new BoxGeometry(0.02, 0.15, 0.075).translate(0, 0, z), 0x1a1a1a);
}

const TANG = () => fishShape([0.07, 0.2, 0.24], 0x2457d6, [0.02, 0.16, 0.07], 0xf0d24a);
const SERGEANT = () => fishShape(
  [0.07, 0.15, 0.18], 0xf2d15a,
  [0.02, 0.1, 0.06], 0xf2d15a,
  [bar(-0.04), bar(0.01), bar(0.06)],
);
const PARROT = () => fishShape([0.13, 0.16, 0.32], 0x1f9a5a, [0.03, 0.12, 0.08], 0x157a48, [
  painted(new BoxGeometry(0.08, 0.07, 0.06).translate(0, -0.01, -0.2), 0xf3ead4),
]);
const ANGEL = () => fishShape([0.05, 0.28, 0.22], 0x161616, [0.02, 0.2, 0.06], 0xf2e04a);

const MAT = () => new MeshStandardMaterial({ vertexColors: true, roughness: 0.48, metalness: 0.04 });

export class ReefFish {
  readonly mesh: Group;
  private readonly dummy = new Object3D();
  private readonly parts: Part[];
  private readonly school: School;

  constructor(school: School) {
    this.school = school;
    const n = school.n;
    const counts = [Math.round(n * 0.42), Math.round(n * 0.25), Math.round(n * 0.18)];
    const last = n - counts.reduce((a, b) => a + b, 0);
    counts.push(Math.max(0, last));
    const geos = [TANG(), SERGEANT(), PARROT(), ANGEL()];
    this.mesh = new Group();
    this.mesh.name = "aw-reef-fish";
    this.parts = [];
    let base = 0;
    for (let s = 0; s < counts.length; s++) {
      const count = counts[s];
      if (count <= 0) continue;
      const mesh = new InstancedMesh(geos[s], MAT(), count);
      mesh.castShadow = false;
      mesh.receiveShadow = false;
      mesh.frustumCulled = false;
      const m = new Matrix4();
      for (let i = 0; i < count; i++) mesh.setMatrixAt(i, m);
      this.mesh.add(mesh);
      this.parts.push({ mesh, count, base });
      base += count;
    }
  }

  update(): void {
    const s = this.school;
    const d = this.dummy;
    for (const part of this.parts) {
      for (let k = 0; k < part.count; k++) {
        const i = part.base + k;
        d.position.set(s.x[i], s.y[i], s.z[i]);
        d.rotation.set(0, 0, 0);
        const sp = Math.hypot(s.vx[i], s.vy[i], s.vz[i]);
        if (sp > 0.05) d.lookAt(s.x[i] + s.vx[i], s.y[i] + s.vy[i], s.z[i] + s.vz[i]);
        d.scale.setScalar(s.n > 24 ? 1 : 0.85);
        d.updateMatrix();
        part.mesh.setMatrixAt(k, d.matrix);
      }
      part.mesh.instanceMatrix.needsUpdate = true;
    }
  }
}
