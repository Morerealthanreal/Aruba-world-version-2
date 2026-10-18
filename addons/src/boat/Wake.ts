import * as THREE from 'three';
import type { Quality } from './types';

const MAX_QUADS = 32;

interface Quad {
  mesh: THREE.Mesh;
  age: number;
  lifetime: number;
  active: boolean;
}

export class Wake {
  private readonly quads: Quad[] = [];
  private readonly parent: THREE.Object3D;
  private quality: Quality;
  private maxActive: number;
  private next = 0;
  private readonly tmp = new THREE.Vector3();

  constructor(parent: THREE.Object3D, quality: Quality = 'high') {
    this.parent = parent;
    this.quality = quality;
    this.maxActive = quality === 'low' ? 12 : quality === 'medium' ? 20 : MAX_QUADS;

    const geom = new THREE.PlaneGeometry(1.6, 3.2);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xc8e6ff,
      transparent: true,
      opacity: 0.45,
      depthWrite: false,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });

    for (let i = 0; i < MAX_QUADS; i++) {
      const mesh = new THREE.Mesh(geom, mat.clone());
      mesh.visible = false;
      // yaw about world Y after laying the quad flat (default XYZ order would tilt it out of the water)
      mesh.rotation.order = 'YXZ';
      mesh.rotation.x = -Math.PI / 2;
      mesh.renderOrder = 1;
      parent.add(mesh);
      this.quads.push({ mesh, age: 0, lifetime: 2.2, active: false });
    }
  }

  setQuality(q: Quality): void {
    this.quality = q;
    this.maxActive = q === 'low' ? 12 : q === 'medium' ? 20 : MAX_QUADS;
  }

  emit(origin: THREE.Vector3, yaw: number, speed: number): void {
    if (speed < 1.2) return;
    const q = this.quads[this.next];
    this.next = (this.next + 1) % this.maxActive;

    const back = this.tmp.set(-Math.sin(yaw), 0, -Math.cos(yaw)).multiplyScalar(1.8);
    q.mesh.position.copy(origin).add(back);
    q.mesh.position.y = origin.y + 0.02;
    q.mesh.rotation.y = yaw;
    q.mesh.scale.set(0.6 + speed * 0.15, 1, 1);
    (q.mesh.material as THREE.MeshBasicMaterial).opacity = 0.5;
    q.mesh.visible = true;
    q.age = 0;
    q.lifetime = 1.6 + Math.min(1.2, speed * 0.15);
    q.active = true;
  }

  update(dt: number): void {
    for (let i = 0; i < this.quads.length; i++) {
      const q = this.quads[i];
      if (!q.active) continue;
      q.age += dt;
      const t = q.age / q.lifetime;
      if (t >= 1) {
        q.active = false;
        q.mesh.visible = false;
        continue;
      }
      const mat = q.mesh.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.5 * (1 - t);
      q.mesh.scale.x *= 1 + dt * 0.35;
      q.mesh.scale.z *= 1 + dt * 0.2;
    }
  }

  dispose(): void {
    if (this.quads.length) this.quads[0].mesh.geometry.dispose(); // shared
    for (const q of this.quads) {
      (q.mesh.material as THREE.Material).dispose();
      q.mesh.removeFromParent();
    }
  }
}
