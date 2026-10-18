// Instanced reef fish. One mesh, one material, matrices written from the pooled school.
import { BoxGeometry, Color, InstancedBufferAttribute, InstancedMesh, Matrix4, MeshStandardMaterial, Object3D } from "three";
import type { School } from "./boids";

const PALETTE = [0x1a6fbf, 0xf0a020, 0xe23b3b, 0xf2e15a, 0x3db8a0];

export function fishCount(quality: string): number {
  if (quality === "low") return 12;
  if (quality === "high") return 48;
  return 28;
}

export class ReefFish {
  readonly mesh: InstancedMesh;
  private readonly dummy = new Object3D();
  private readonly color = new Color();
  private readonly school: School;

  constructor(school: School) {
    this.school = school;
    const geo = new BoxGeometry(0.62, 0.16, 0.22);
    const mat = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.55, metalness: 0.05 });
    this.mesh = new InstancedMesh(geo, mat, school.n);
    this.mesh.instanceColor = new InstancedBufferAttribute(new Float32Array(school.n * 3), 3);
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;
    this.mesh.frustumCulled = false;
    for (let i = 0; i < school.n; i++) {
      this.color.setHex(PALETTE[i % PALETTE.length]);
      this.mesh.setColorAt(i, this.color);
    }
    const m = new Matrix4();
    for (let i = 0; i < school.n; i++) this.mesh.setMatrixAt(i, m);
  }

  update(): void {
    const s = this.school;
    const d = this.dummy;
    for (let i = 0; i < s.n; i++) {
      d.position.set(s.x[i], s.y[i], s.z[i]);
      const sp = Math.hypot(s.vx[i], s.vy[i], s.vz[i]);
      if (sp > 0.05) d.lookAt(s.x[i] + s.vx[i], s.y[i] + s.vy[i], s.z[i] + s.vz[i]);
      d.updateMatrix();
      this.mesh.setMatrixAt(i, d.matrix);
    }
    this.mesh.instanceMatrix.needsUpdate = true;
    if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true;
  }
}
