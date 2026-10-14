// Vader Piet wind farm: 10 Vestas V90 (80 m hub, 90 m rotor). Island-wide landmark, so it lives
// outside the hero/detail culling: always in the scene, ~110 tris per turbine, rotors turn slowly.
import * as THREE from "three";
import type { AGame } from "./env";
const VPZ = [4380, 4538, 4696, 4848, 4999, 5150, 5308, 5466, 5629, 5789];
const VPX = 8542, HUB = 80, BL = 44;
export class WindFarm {
  rotors: THREE.Object3D[] = [];
  towers: THREE.Object3D[] = [];
  hAt!: (x: number, z: number) => number;
  k = 0;
  constructor(g: AGame) {
    const A = g.real as unknown as { heightAt: (x: number, z: number) => number }; this.hAt = (x, z) => A.heightAt(x, z);
    const white = new THREE.MeshLambertMaterial({ color: 0xeef0f2 });
    const tower = new THREE.CylinderGeometry(1.4, 2.1, HUB, 10, 1, true); tower.translate(0, HUB / 2, 0);
    const nac = new THREE.BoxGeometry(10, 3.6, 3.6); nac.translate(-1.5, HUB + 0.3, 0);
    const blade = new THREE.BoxGeometry(0.5, BL, 2.0); blade.translate(0, BL / 2 + 1, 0);
    const hub = new THREE.SphereGeometry(1.5, 8, 6);
    const root = new THREE.Group(); root.name = "aw:windfarm";
    VPZ.forEach((z, i) => {
      const gy = A.heightAt(VPX, z) - 0.5;
      const t = new THREE.Group(); t.position.set(VPX, gy, z);
      t.add(new THREE.Mesh(tower, white), new THREE.Mesh(nac, white));
      const r = new THREE.Group(); r.position.set(4.2, HUB + 1.3, 0); r.rotation.x = i * 0.7;
      r.add(new THREE.Mesh(hub, white));
      for (let b = 0; b < 3; b++) { const m = new THREE.Mesh(blade, white); m.rotation.x = b * 2.0944; r.add(m); }
      t.add(r); this.rotors.push(r); this.towers.push(t); root.add(t);
    });
    root.traverse((o) => { (o as THREE.Mesh).castShadow = false; });
    g.scene.add(root);
  }
  update(dt: number) {
    if ((++this.k & 63) === 0) for (const t of this.towers) { const y = this.hAt(t.position.x, t.position.z) - 0.5; if (Number.isFinite(y)) t.position.y = y; } for (const r of this.rotors) r.rotation.x -= dt * 0.9; }
}
