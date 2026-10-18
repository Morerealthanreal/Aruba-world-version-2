import * as THREE from 'three';
import type { HeliInput, TerrainHeightFn, Quality, HeliOptions, PlayerController } from './types';
import { RotorWash } from './RotorWash';

export const MASS = 1100;
export const MAX_LIFT = 14500;
export const GROUND_EFFECT_HEIGHT = 8;
const AUTOROTATION_LIFT = 0.35;
/** Height of the group origin above the ground when resting on the skids (skid bottoms sit at -REST_HEIGHT). */
export const REST_HEIGHT = 1.25;

export class Helicopter {
  readonly group: THREE.Group;
  readonly mainRotor: THREE.Object3D;
  readonly tailRotor: THREE.Object3D;
  private readonly wash: RotorWash;
  private readonly options: { quality: Quality; position: THREE.Vector3; fxParent: THREE.Object3D | null };
  private readonly velocity = new THREE.Vector3();
  private readonly angularVel = new THREE.Vector3();
  private readonly force = new THREE.Vector3();
  private readonly tmp = new THREE.Vector3();
  private readonly tmp2 = new THREE.Vector3();
  private readonly up = new THREE.Vector3(0, 1, 0);
  private readonly camOffset = new THREE.Vector3(0, 5.4, -16);
  private readonly camLook = new THREE.Vector3();

  private collective = 0;
  private cyclicPitch = 0;
  private cyclicRoll = 0;
  private yawInput = 0;
  private engineOn = true;
  private rotorRpm = 0.8;
  private occupied = false;
  private onGround = true;
  private time = 0;
  private heightAGL = 0;
  private controller: PlayerController | null = null;

  constructor(options: HeliOptions = {}) {
    this.options = {
      quality: options.quality ?? 'high',
      position: options.position ?? new THREE.Vector3(),
      fxParent: options.fxParent ?? null,
    };
    this.group = new THREE.Group();
    // yaw first, then pitch/roll about the body axes (default XYZ pitched about world X once the heli had turned)
    this.group.rotation.order = 'YXZ';
    this.group.position.copy(this.options.position);
    this.mainRotor = new THREE.Group();
    this.tailRotor = new THREE.Group();
    this.group.add(this.mainRotor, this.tailRotor);
    // rotor-wash particles are emitted in world space, so they must live outside the moving group
    this.wash = new RotorWash(this.options.fxParent, this.options.quality);
    this.buildGeometry();
  }

  setQuality(q: Quality): void {
    this.options.quality = q;
  }

  setController(c: PlayerController | null): void {
    this.controller = c;
  }

  get isOccupied(): boolean { return this.occupied; }
  get position(): THREE.Vector3 { return this.group.position; }
  get isOnGround(): boolean { return this.onGround; }
  get verticalSpeed(): number { return this.velocity.y; }
  get rotorSpeed(): number { return this.rotorRpm; }
  get heightAboveGround(): number { return this.heightAGL; }

  enter(): void { this.occupied = true; this.engineOn = true; }
  exit(): void {
    this.occupied = false;
    // nobody at the controls: drop the collective and centre the stick, spool the engine down
    this.collective = 0;
    this.cyclicPitch = 0;
    this.cyclicRoll = 0;
    this.yawInput = 0;
    this.engineOn = false;
  }

  updateChaseCamera(camera: THREE.Camera, dt: number): void {
    if (!this.occupied) return;
    this.camLook.copy(this.group.position);
    this.camLook.y += 1.2;
    this.tmp.copy(this.camOffset);
    this.tmp.applyAxisAngle(this.up, this.group.rotation.y);
    this.tmp.add(this.group.position);
    camera.position.lerp(this.tmp, Math.min(1, dt * 2.8));
    camera.lookAt(this.camLook);
  }

  update(dt: number, input: HeliInput, terrainHeight: TerrainHeightFn): void {
    if (dt <= 0) return;
    this.time += dt;
    const fxp = this.options.fxParent ?? this.group.parent;
    if (fxp && this.wash.points.parent !== fxp) fxp.add(this.wash.points);

    if (this.occupied) {
      this.collective = THREE.MathUtils.lerp(this.collective, input.collective, Math.min(1, dt * 3));
      this.cyclicPitch = THREE.MathUtils.lerp(this.cyclicPitch, input.cyclicPitch, Math.min(1, dt * 5));
      this.cyclicRoll = THREE.MathUtils.lerp(this.cyclicRoll, input.cyclicRoll, Math.min(1, dt * 5));
      this.yawInput = THREE.MathUtils.lerp(this.yawInput, input.yaw, Math.min(1, dt * 4));
      this.engineOn = input.engine;
    }

    // Rotor RPM
    const targetRpm = this.engineOn ? 1 : Math.max(0.15, this.rotorRpm - dt * 0.08);
    this.rotorRpm += (targetRpm - this.rotorRpm) * Math.min(1, dt * 1.5);
    this.mainRotor.rotation.y += this.rotorRpm * 28 * dt;
    this.tailRotor.rotation.x += this.rotorRpm * 42 * dt;

    const groundY = terrainHeight(this.group.position.x, this.group.position.z);
    const heightAGL = this.group.position.y - groundY;
    this.heightAGL = heightAGL;
    this.onGround = heightAGL < REST_HEIGHT + 0.1 && this.velocity.y <= 0.2;

    this.force.set(0, 0, 0);

    // Collective lift
    let lift = this.collective * MAX_LIFT * this.rotorRpm;
    // Ground effect
    if (heightAGL < GROUND_EFFECT_HEIGHT && heightAGL > 0.5) {
      lift *= 1 + (1 - heightAGL / GROUND_EFFECT_HEIGHT) * 0.45;
    }
    // Autorotation
    if (!this.engineOn && this.velocity.y < -2) {
      lift += Math.abs(this.velocity.y) * MASS * AUTOROTATION_LIFT * this.rotorRpm;
    }
    this.force.y += lift;

    // Gravity
    this.force.y -= MASS * 9.81;

    // Cyclic → tilt → horizontal force
    const pitchTilt = this.cyclicPitch * 0.35 * this.rotorRpm;
    const rollTilt = this.cyclicRoll * 0.35 * this.rotorRpm;
    // nose is +Z, so the pilot's right is -X: +roll pushes toward -X, -pitch (stick forward) toward +Z
    this.tmp.set(-rollTilt, 0, -pitchTilt).applyQuaternion(this.group.quaternion);
    this.force.addScaledVector(this.tmp, lift * 0.85);

    // Drag
    this.velocity.multiplyScalar(1 - 0.35 * dt);

    // Integrate
    this.velocity.addScaledVector(this.force, dt / MASS);
    this.group.position.addScaledVector(this.velocity, dt);

    // Attitude
    // stick forward (pitch -1) dips the nose (+rotation.x), +roll banks right (+rotation.z), +yaw turns right (-rotation.y)
    this.angularVel.x += -this.cyclicPitch * 1.2 * dt;
    this.angularVel.z += this.cyclicRoll * 1.2 * dt;
    this.angularVel.y += -this.yawInput * 1.4 * this.rotorRpm * dt;
    this.angularVel.multiplyScalar(1 - 2.2 * dt);

    this.group.rotation.x += this.angularVel.x * dt;
    this.group.rotation.z += this.angularVel.z * dt;
    this.group.rotation.y += this.angularVel.y * dt;
    this.group.rotation.x = THREE.MathUtils.clamp(this.group.rotation.x, -0.4, 0.4);
    this.group.rotation.z = THREE.MathUtils.clamp(this.group.rotation.z, -0.4, 0.4);

    // Landing anywhere flat
    if (this.onGround) {
      this.group.position.y = groundY + REST_HEIGHT;
      if (this.velocity.y < 0) this.velocity.y = 0;
      this.velocity.x *= 1 - 3 * dt;
      this.velocity.z *= 1 - 3 * dt;
      this.group.rotation.x = THREE.MathUtils.lerp(this.group.rotation.x, 0, Math.min(1, dt * 3));
      this.group.rotation.z = THREE.MathUtils.lerp(this.group.rotation.z, 0, Math.min(1, dt * 3));
    }

    // Rotor wash
    if (this.rotorRpm > 0.3 && heightAGL < 12) {
      this.tmp.copy(this.group.position);
      this.tmp.y = groundY + 0.1;
      this.wash.emit(this.tmp, this.rotorRpm * (1 - heightAGL / 12));
    }
    this.wash.update(dt);

    // Sync player controller when occupied
    if (this.occupied && this.controller) {
      this.controller.position.copy(this.group.position);
      this.controller.position.y += 0.6;
    }
  }

  private buildGeometry(): void {
    // Robinson R44 Raven II, the type Aruba Heli Tours flew from the Seaport Marina Heliport:
    // white cabin, blue cove, two-blade 10.06 m rotor, skid gear, tail rotor on the left.
    // Origin is REST_HEIGHT above the ground when parked, so the skid bottoms touch there.
    const white = new THREE.MeshStandardMaterial({ color: 0xf7f7f5, roughness: 0.38, metalness: 0.12 });
    const blue = new THREE.MeshStandardMaterial({ color: 0x1a6fbf, roughness: 0.45, metalness: 0.08 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x2c6f86, roughness: 0.12, metalness: 0.25 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x2a2e32, roughness: 0.5, metalness: 0.2 });
    const HUB_Y = 1.95;
    const add = (mesh: THREE.Mesh, parent: THREE.Object3D = this.group) => { parent.add(mesh); return mesh; };

    const belly = add(new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.42, 2.5), blue));
    belly.position.set(0, -0.55, 0.35);
    const cabin = add(new THREE.Mesh(new THREE.BoxGeometry(1.48, 1.05, 2.15), white));
    cabin.position.set(0, 0.05, 0.15);
    const nose = add(new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.72, 0.85), glass));
    nose.position.set(0, 0.02, 1.45);
    nose.rotation.x = -0.18;
    const door = add(new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.62, 0.85), glass));
    door.position.set(0.74, 0.12, 0.25);
    const doorL = door.clone();
    doorL.position.x = -0.74;
    this.group.add(doorL);

    const boom = add(new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 4.3, 8), white));
    boom.rotation.x = Math.PI / 2;
    boom.position.set(0, 0.05, -2.7);
    const fin = add(new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.85, 0.55), white));
    fin.position.set(0, 0.45, -4.85);
    const stab = add(new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.05, 0.28), white));
    stab.position.set(0, 0.15, -4.55);
    const stripe = add(new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 3.6), blue));
    stripe.position.set(0.12, 0.02, -2.5);

    const mast = add(new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.15, 8), dark));
    mast.position.set(0, 1.25, 0.2);

    this.mainRotor.position.set(0, 0, 0.2);
    const hub = add(new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.14, 8), dark), this.mainRotor);
    hub.position.set(0, HUB_Y, 0);
    // 5.03 m blades, symmetric about the mast so they spin on the mast axis.
    for (const z of [2.515, -2.515]) {
      const blade = add(new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.035, 5.03), dark), this.mainRotor);
      blade.position.set(0, HUB_Y, z);
    }

    const tHub = add(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.08, 6), dark), this.tailRotor);
    tHub.rotation.z = Math.PI / 2;
    for (const y of [0.36, -0.36]) {
      const b = add(new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.72, 0.08), dark), this.tailRotor);
      b.position.y = y;
    }
    // R44 tail rotor is on the left. +X is the pilot's left in this frame.
    this.tailRotor.position.set(0.22, 0.42, -5.15);

    const skidMat = new THREE.MeshStandardMaterial({ color: 0x242424, metalness: 0.35, roughness: 0.45 });
    for (const side of [-1.05, 1.05]) {
      const skid = add(new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 3.15), skidMat));
      skid.position.set(side, -REST_HEIGHT + 0.035, 0.15);
      for (const z of [0.7, -0.55]) {
        const strut = add(new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.72, 5), skidMat));
        strut.position.set(side, -0.88, z);
      }
    }

    const shadows = this.options.quality !== 'low';
    this.group.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = shadows;
        o.receiveShadow = shadows;
      }
    });
  }

  dispose(): void {
    this.wash.points.removeFromParent();
    this.wash.dispose();
    this.group.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        (o as THREE.Mesh).geometry.dispose();
        const m = (o as THREE.Mesh).material;
        if (Array.isArray(m)) m.forEach((mat) => mat.dispose());
        else m.dispose();
      }
    });
  }
}
