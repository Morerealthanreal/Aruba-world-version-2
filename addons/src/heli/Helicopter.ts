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
  private readonly camOffset = new THREE.Vector3(0, 4.5, -12);
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
    // Layout: origin is REST_HEIGHT above the ground when parked, so the skids touch the ground there.
    // Main rotor radius 3.3 m on a short mast, clear of the tail fin and the tail rotor.
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xe8e8e8, roughness: 0.4, metalness: 0.2 });
    const darkMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5 });
    const accent = new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.45 });
    const HUB_Y = 0.85;

    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.1, 2.2), bodyMat);
    cabin.position.set(0, -0.15, 0.2);
    this.group.add(cabin);

    const tailBoom = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.25, 3.2), bodyMat);
    tailBoom.position.set(0, -0.05, -2.2);
    this.group.add(tailBoom);

    const tailFin = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.7, 0.5), accent);
    tailFin.position.set(0, 0.3, -3.6);
    this.group.add(tailFin);

    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.45, 6), darkMat);
    mast.position.set(0, 0.62, 0);
    this.group.add(mast);

    // Main rotor (spins about Y)
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.15, 8), darkMat);
    hub.position.y = HUB_Y;
    this.mainRotor.add(hub);
    for (let i = 0; i < 2; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 3.3), darkMat);
      blade.position.set(0, HUB_Y, i === 0 ? 1.65 : -1.65);
      this.mainRotor.add(blade);
    }
    this.mainRotor.position.y = 0;

    // Tail rotor (disc in the YZ plane, spins about X)
    const tHub = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.08, 6), darkMat);
    tHub.rotation.z = Math.PI / 2;
    this.tailRotor.add(tHub);
    for (let i = 0; i < 2; i++) {
      const b = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.5, 0.06), darkMat);
      b.position.y = i === 0 ? 0.25 : -0.25;
      this.tailRotor.add(b);
    }
    this.tailRotor.position.set(0.2, 0.25, -3.55);

    // Skids: bottoms at -REST_HEIGHT, struts up to the cabin floor
    const skidMat = new THREE.MeshStandardMaterial({ color: 0x222222, metalness: 0.3 });
    for (const side of [-0.7, 0.7]) {
      const skid = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 2.4), skidMat);
      skid.position.set(side, -REST_HEIGHT + 0.04, 0);
      this.group.add(skid);
      const strutF = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 5), skidMat);
      strutF.position.set(side, -0.94, 0.6);
      this.group.add(strutF);
      const strutR = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 5), skidMat);
      strutR.position.set(side, -0.94, -0.6);
      this.group.add(strutR);
    }

    const shadows = this.options.quality !== 'low'; // keep Low cheap: no shadow-pass draws for the heli
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
