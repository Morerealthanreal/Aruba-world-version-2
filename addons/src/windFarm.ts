import * as THREE from "three";
import { mergeGeometries } from "three/examples/jsm/utils/BufferGeometryUtils.js";
import type { AGame } from "./env";
// Vader Piet wind farm, always visible. r186: 2 draw calls total (was 60): all towers+nacelles
// merged into one static mesh, all 10 rotors (hub + 3 blades) one InstancedMesh spun via matrices.
const VPZ = [4380, 4538, 4696, 4848, 4999, 5150, 5308, 5466, 5629, 5789];
const VPX = 8542, HUB = 80, BL = 44;
export class WindFarm {
  hAt: (x: number, z: number) => number;
  k = 0; ang: number[] = []; ys: number[] = [];
  static?: THREE.Mesh; rot: THREE.InstancedMesh;
  private m = new THREE.Matrix4(); private q = new THREE.Quaternion(); private e = new THREE.Euler(); private p = new THREE.Vector3(); private s = new THREE.Vector3(1, 1, 1);
  constructor(private g: AGame) {
    const A = g.real as unknown as { heightAt: (x: number, z: number) => number }; this.hAt = (x, z) => A.heightAt(x, z);
    const white = new THREE.MeshLambertMaterial({ color: 0xeef0f2 });
    const blade = new THREE.BoxGeometry(0.5, BL, 2.0); blade.translate(0, BL / 2 + 1, 0);
    const parts: THREE.BufferGeometry[] = [new THREE.SphereGeometry(1.5, 8, 6)];
    for (let b = 0; b < 3; b++) parts.push(blade.clone().rotateX(b * 2.0944));
    const rotorG = mergeGeometries(parts.map((x) => x.toNonIndexed()))!;
    this.rot = new THREE.InstancedMesh(rotorG, white, VPZ.length); this.rot.frustumCulled = false; this.rot.name = "aw:windfarm:rotors"; this.rot.castShadow = false;
    this.rebuild();
    g.scene.add(this.rot);
  }
  private rebuild() {
    const tw: THREE.BufferGeometry[] = [];
    VPZ.forEach((z, i) => {
      const y = this.hAt(VPX, z) - 0.5; this.ys[i] = Number.isFinite(y) ? y : this.ys[i] || 0;
      const tower = new THREE.CylinderGeometry(1.4, 2.1, HUB, 10, 1, true).toNonIndexed(); tower.translate(VPX, this.ys[i] + HUB / 2, z);
      const nac = new THREE.BoxGeometry(10, 3.6, 3.6).toNonIndexed(); nac.translate(VPX - 1.5, this.ys[i] + HUB + 0.3, z);
      tw.push(tower, nac); if (this.ang[i] === undefined) this.ang[i] = i * 0.7;
    });
    const geo = mergeGeometries(tw)!; geo.computeBoundingSphere();
    if (!this.static) { this.static = new THREE.Mesh(geo, this.rot.material as THREE.Material); this.static.name = "aw:windfarm"; this.g.scene.add(this.static); }
    else { this.static.geometry.dispose(); this.static.geometry = geo; }
  }
  update(dt: number) {
    if ((++this.k & 255) === 0) { let ch = false; for (let i = 0; i < VPZ.length; i++) { const y = this.hAt(VPX, VPZ[i]) - 0.5; if (Number.isFinite(y) && Math.abs(y - this.ys[i]) > 0.05) ch = true; } if (ch) this.rebuild(); }
    for (let i = 0; i < VPZ.length; i++) {
      this.ang[i] -= dt * 0.9; this.e.set(this.ang[i], 0, 0); this.q.setFromEuler(this.e);
      this.p.set(VPX + 4.2, this.ys[i] + HUB + 1.3, VPZ[i]); this.m.compose(this.p, this.q, this.s); this.rot.setMatrixAt(i, this.m);
    }
    this.rot.instanceMatrix.needsUpdate = true;
  }
}
