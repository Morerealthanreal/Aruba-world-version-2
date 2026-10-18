import * as THREE from 'three';
import type { Quality } from './types';

const MAX = 24;

export class RotorWash {
  readonly points: THREE.Points;
  private readonly positions: Float32Array;
  private readonly velocities: Float32Array;
  private readonly ages: Float32Array;
  private readonly lifetimes: Float32Array;
  private active = 0;
  private maxActive: number;

  constructor(parent: THREE.Object3D | null, quality: Quality) {
    this.maxActive = quality === 'low' ? 8 : quality === 'medium' ? 16 : MAX;
    this.positions = new Float32Array(MAX * 3);
    this.velocities = new Float32Array(MAX * 3);
    this.ages = new Float32Array(MAX);
    this.lifetimes = new Float32Array(MAX);

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geom.setDrawRange(0, 0);
    const mat = new THREE.PointsMaterial({
      color: 0xdddddd,
      size: 0.35,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      sizeAttenuation: true,
    });
    this.points = new THREE.Points(geom, mat);
    this.points.frustumCulled = false;
    if (parent) parent.add(this.points);
  }

  emit(origin: THREE.Vector3, strength: number): void {
    if (strength < 0.15) return;
    const n = Math.min(4, this.maxActive);
    let spawned = 0;
    for (let i = 0; i < this.maxActive && spawned < n; i++) {
      if (this.ages[i] <= 0) {
        const b = i * 3;
        const ang = Math.random() * Math.PI * 2;
        const r = 1.2 + Math.random() * 1.8;
        this.positions[b] = origin.x + Math.cos(ang) * r;
        this.positions[b + 1] = origin.y - 0.2;
        this.positions[b + 2] = origin.z + Math.sin(ang) * r;
        this.velocities[b] = Math.cos(ang) * 2.5 * strength;
        this.velocities[b + 1] = -1.5 - Math.random() * 2 * strength;
        this.velocities[b + 2] = Math.sin(ang) * 2.5 * strength;
        this.lifetimes[i] = 0.6 + Math.random() * 0.4;
        this.ages[i] = 0.001;
        spawned++;
      }
    }
    this.active = Math.max(this.active, spawned);
    this.points.geometry.setDrawRange(0, this.maxActive);
  }

  update(dt: number): void {
    if (this.active === 0) return;
    const attr = this.points.geometry.getAttribute('position') as THREE.BufferAttribute;
    let still = 0;
    for (let i = 0; i < this.maxActive; i++) {
      if (this.ages[i] <= 0) continue;
      this.ages[i] += dt;
      if (this.ages[i] >= this.lifetimes[i]) {
        this.ages[i] = 0;
        continue;
      }
      still++;
      const b = i * 3;
      this.positions[b] += this.velocities[b] * dt;
      this.positions[b + 1] += this.velocities[b + 1] * dt;
      this.positions[b + 2] += this.velocities[b + 2] * dt;
    }
    this.active = still;
    attr.needsUpdate = true;
    if (still === 0) this.points.geometry.setDrawRange(0, 0);
  }

  dispose(): void {
    this.points.geometry.dispose();
    (this.points.material as THREE.Material).dispose();
  }
}
