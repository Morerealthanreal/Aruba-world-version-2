import * as THREE from 'three';
import type { Quality } from './types';

const MAX_PARTICLES = 48;

export class Splash {
  readonly points: THREE.Points;
  private readonly positions: Float32Array;
  private readonly velocities: Float32Array;
  private readonly lifetimes: Float32Array;
  private readonly ages: Float32Array;
  private active = 0;
  private quality: Quality = 'high';
  private readonly maxActive: number;
  private readonly tmp = new THREE.Vector3();

  constructor(parent: THREE.Object3D, quality: Quality = 'high') {
    this.quality = quality;
    this.maxActive = quality === 'low' ? 16 : quality === 'medium' ? 32 : MAX_PARTICLES;

    this.positions = new Float32Array(MAX_PARTICLES * 3);
    this.velocities = new Float32Array(MAX_PARTICLES * 3);
    this.lifetimes = new Float32Array(MAX_PARTICLES);
    this.ages = new Float32Array(MAX_PARTICLES);

    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    geom.setDrawRange(0, 0);

    const mat = new THREE.PointsMaterial({
      color: 0x9fd4ff,
      size: quality === 'low' ? 0.18 : 0.28,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });

    this.points = new THREE.Points(geom, mat);
    this.points.frustumCulled = false;
    this.points.renderOrder = 1;
    parent.add(this.points);
  }

  setQuality(q: Quality): void {
    this.quality = q;
    (this.points.material as THREE.PointsMaterial).size = q === 'low' ? 0.18 : 0.28;
  }

  burst(origin: THREE.Vector3, intensity = 1): void {
    const n = Math.min(this.maxActive, Math.floor(12 + intensity * 20));
    let spawned = 0;
    for (let i = 0; i < MAX_PARTICLES && spawned < n; i++) {
      if (this.ages[i] <= 0) {
        const base = i * 3;
        this.positions[base] = origin.x + (Math.random() - 0.5) * 0.4;
        this.positions[base + 1] = origin.y + Math.random() * 0.3;
        this.positions[base + 2] = origin.z + (Math.random() - 0.5) * 0.4;

        const ang = Math.random() * Math.PI * 2;
        const spd = 1.2 + Math.random() * 2.4 * intensity;
        this.velocities[base] = Math.cos(ang) * spd * 0.6;
        this.velocities[base + 1] = 1.8 + Math.random() * 2.2 * intensity;
        this.velocities[base + 2] = Math.sin(ang) * spd * 0.6;

        this.lifetimes[i] = 0.45 + Math.random() * 0.4;
        this.ages[i] = 0.001;
        spawned++;
      }
    }
    this.active = Math.max(this.active, spawned);
    this.points.geometry.setDrawRange(0, MAX_PARTICLES);
  }

  update(dt: number): void {
    if (this.active === 0) return;
    const posAttr = this.points.geometry.getAttribute('position') as THREE.BufferAttribute;
    let stillActive = 0;
    const g = -9.8 * 0.6;

    for (let i = 0; i < MAX_PARTICLES; i++) {
      if (this.ages[i] <= 0) continue;
      this.ages[i] += dt;
      const t = this.ages[i] / this.lifetimes[i];
      if (t >= 1) {
        this.ages[i] = 0;
        continue;
      }
      stillActive++;
      const base = i * 3;
      this.velocities[base + 1] += g * dt;
      this.positions[base] += this.velocities[base] * dt;
      this.positions[base + 1] += this.velocities[base + 1] * dt;
      this.positions[base + 2] += this.velocities[base + 2] * dt;

      // simple fade via scale trick not available; opacity is global so we just kill early on low
      if (this.quality === 'low' && t > 0.7) this.ages[i] = this.lifetimes[i];
    }
    this.active = stillActive;
    posAttr.needsUpdate = true;
    if (stillActive === 0) {
      this.points.geometry.setDrawRange(0, 0);
    }
  }

  dispose(): void {
    this.points.geometry.dispose();
    (this.points.material as THREE.Material).dispose();
  }
}
