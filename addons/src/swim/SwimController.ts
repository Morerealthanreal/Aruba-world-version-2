import * as THREE from 'three';
import type { SwimInput, TerrainHeightFn, Quality, SwimOptions, PlayerController } from './types';
import { Splash } from './Splash';
import { UnderwaterTint } from './Underwater';

interface BoneSet {
  hips: THREE.Bone | null;
  spine: THREE.Bone | null;
  neck: THREE.Bone | null;
  leftUpperArm: THREE.Bone | null;
  leftLowerArm: THREE.Bone | null;
  rightUpperArm: THREE.Bone | null;
  rightLowerArm: THREE.Bone | null;
  leftUpperLeg: THREE.Bone | null;
  leftLowerLeg: THREE.Bone | null;
  rightUpperLeg: THREE.Bone | null;
  rightLowerLeg: THREE.Bone | null;
}

/** Face-down body pitch while swimming, radians (slightly head-up). */
const SWIM_PITCH = -Math.PI / 2 + 0.12;

export class SwimController {
  readonly mesh: THREE.SkinnedMesh;
  readonly mixer: THREE.AnimationMixer;
  private readonly splash: Splash;
  private readonly options: Required<Omit<SwimOptions, 'ladders' | 'body' | 'rig' | 'fxParent'>> & { ladders: THREE.Vector3[] };
  /** The game's player controller, moved in world space (position only). */
  private readonly body: PlayerController;
  /** Full-screen tint while the camera is below the surface (created on first use). */
  private tint: UnderwaterTint | null = null;
  private readonly lastPos = new THREE.Vector3();
  /** Pitched face-down while swimming; null = pitch the hips bone. */
  private readonly rig: THREE.Object3D | null;
  private readonly bones: BoneSet;
  private readonly restRot: Map<THREE.Bone, THREE.Quaternion> = new Map();
  private readonly tmpPos = new THREE.Vector3();
  private readonly tmpDir = new THREE.Vector3();
  private readonly tmpQuat = new THREE.Quaternion();
  private readonly tmpParentQuat = new THREE.Quaternion();
  private readonly tmpAxis = new THREE.Vector3();
  private readonly lateral = new THREE.Vector3();
  private readonly tmpEuler = new THREE.Euler();
  private readonly up = new THREE.Vector3(0, 1, 0);

  private isInWater = false;
  private isSwimming = false;
  private wasInWater = false;
  private swimTime = 0;
  private bobPhase = 0;
  private facingYaw = 0;
  private climbCooldown = 0;
  private depth = 0;

  constructor(
    mesh: THREE.SkinnedMesh,
    mixer: THREE.AnimationMixer,
    options: SwimOptions = {},
  ) {
    this.mesh = mesh;
    this.mixer = mixer;
    this.options = {
      quality: options.quality ?? 'high',
      seaLevel: options.seaLevel ?? 0,
      footOffset: options.footOffset ?? 0.05,
      chestDepth: options.chestDepth ?? 1.15,
      ladders: options.ladders ?? [],
    };
    this.body = options.body ?? mesh;
    this.rig = options.rig ?? null;
    this.splash = new Splash(options.fxParent ?? mesh.parent ?? mesh, this.options.quality);
    this.bones = this.collectBones();
    this.cacheRestPoses();
  }

  setQuality(q: Quality): void {
    this.options.quality = q;
    this.splash.setQuality(q);
  }

  get swimming(): boolean { return this.isSwimming; }
  get wading(): boolean { return this.isInWater && !this.isSwimming; }
  get inWater(): boolean { return this.isInWater; }
  /** Water depth (sea level minus ground) at the body, from the last update. */
  get waterDepth(): number { return this.depth; }
  /** Facing used while swimming (radians, +Z forward convention). */
  get yaw(): number { return this.facingYaw; }

  update(dt: number, input: SwimInput, terrainHeightFn: TerrainHeightFn): void {
    if (dt <= 0) return;
    this.climbCooldown = Math.max(0, this.climbCooldown - dt);

    const pos = this.body.position;
    const terrainH = terrainHeightFn(pos.x, pos.z);
    const feetY = pos.y + this.options.footOffset;
    // Depth of the water column here (sea level to ground), not below the feet: once the swimmer floats
    // up to the surface the feet are only ~0.1 m under, which would flip swim -> wade -> swim every frame.
    const waterDepth = Math.max(0, this.options.seaLevel - terrainH);
    this.depth = waterDepth;
    const wasIn = this.wasInWater;
    this.isInWater = waterDepth > 0.08 && feetY < this.options.seaLevel + 0.2;
    this.wasInWater = this.isInWater;

    // Entry splash
    if (this.isInWater && !wasIn) {
      this.tmpPos.copy(pos);
      this.tmpPos.y = this.options.seaLevel;
      this.splash.burst(this.tmpPos, this.options.seaLevel - feetY > 0.6 || waterDepth > 1 ? 1.2 : 0.7);
    }

    const nearShore = terrainH > this.options.seaLevel - 0.35 && waterDepth < 0.9;
    const nearLadder = this.checkLadder();

    if (this.isSwimming && (nearShore || nearLadder) && (input.jump || input.forward > 0.3) && this.climbCooldown <= 0) {
      this.exitWater(terrainH, nearLadder);
      this.splash.update(dt);
      return;
    }

    if (!this.isInWater) {
      if (this.isSwimming) this.restoreRestPoses();
      this.isSwimming = false;
      this.splash.update(dt);
      return;
    }

    // Wading
    if (waterDepth < this.options.chestDepth) {
      if (this.isSwimming) this.restoreRestPoses();
      this.isSwimming = false;
      // Speed reduction is expected to be applied by caller via wading flag / returned multiplier.
      // We still keep upright and let the mixer run.
      this.splash.update(dt);
      return;
    }

    // Full swim
    if (!this.isSwimming) this.lastPos.copy(pos);
    if (!this.isSwimming && input.lookYaw !== undefined) this.facingYaw = input.lookYaw;
    this.isSwimming = true;
    this.swimTime += dt;
    this.bobPhase += dt * (input.sprint ? 2.4 : 1.6);

    // Facing
    if (input.lookYaw !== undefined) {
      this.facingYaw = input.lookYaw;
    } else if (Math.abs(input.forward) + Math.abs(input.strafe) > 0.05) {
      this.facingYaw = Math.atan2(input.strafe, input.forward);
    }

    // Horizontal body
    this.applySwimPose(input.sprint, dt);

    // Buoyancy + bob
    const targetY = this.options.seaLevel - 0.15 + Math.sin(this.bobPhase) * (input.sprint ? 0.06 : 0.1);
    const k = 6;
    pos.y += (targetY - pos.y) * Math.min(1, k * dt);

    // Movement
    const speed = input.sprint ? 3.2 : 1.55;
    const move = this.tmpDir.set(
      Math.sin(this.facingYaw) * input.forward + Math.cos(this.facingYaw) * input.strafe,
      0,
      Math.cos(this.facingYaw) * input.forward - Math.sin(this.facingYaw) * input.strafe,
    );
    if (move.lengthSq() > 0.0001) {
      move.normalize().multiplyScalar(speed * dt);
      pos.add(move);
    }

    // Drag toward surface if somehow deeper
    if (pos.y < targetY - 0.4) {
      pos.y += 1.8 * dt;
    }

    // Report the swim velocity to the controller, if the game reads one
    const vel = this.body.velocity;
    if (vel) vel.subVectors(pos, this.lastPos).divideScalar(dt);
    this.lastPos.copy(pos);

    this.splash.update(dt);
  }

  /**
   * Call after the game has placed the camera. Shows an underwater tint (stronger with depth) while the
   * camera is below the surface. adjustNear lowers the near plane at the waterline so the surface does not
   * clip; pass false when the game sets the near plane itself every frame.
   */
  updateCamera(camera: THREE.Camera, adjustNear = true): void {
    const camY = camera.position.y;
    const under = camY < this.options.seaLevel - 0.05;
    if (under && !this.tint) this.tint = new UnderwaterTint();
    if (this.tint) this.tint.setUnderwater(under, Math.max(0, this.options.seaLevel - camY));
    if (adjustNear && camera instanceof THREE.PerspectiveCamera) {
      const near = Math.abs(camY - this.options.seaLevel) < 0.6 ? 0.05 : 0.1;
      if (camera.near !== near) {
        camera.near = near;
        camera.updateProjectionMatrix();
      }
    }
  }

  /** Hide the underwater tint (e.g. when the player leaves the water or walk mode). */
  clearCamera(): void {
    if (this.tint) this.tint.setUnderwater(false, 0);
  }

  /** Caller can query this while wading to scale ground speed. */
  getWadingSpeedMultiplier(waterDepth: number): number {
    if (waterDepth <= 0.15) return 1;
    const t = Math.min(1, (waterDepth - 0.15) / (this.options.chestDepth - 0.15));
    return 1 - t * 0.65;
  }

  private collectBones(): BoneSet {
    const find = (keys: string[]): THREE.Bone | null => {
      let found: THREE.Bone | null = null;
      this.mesh.skeleton.bones.forEach((b) => {
        const n = b.name.toLowerCase();
        if (keys.some((k) => n.includes(k))) found = b;
      });
      return found;
    };
    // Also matches the game's MakeHuman/UE-style rig (pelvis, upperarm_l, lowerarm_l, thigh_l, calf_l).
    // Lower-arm keys exclude the twist helper "lowerarm_prox_*" by matching the exact suffix below.
    const exact = (names: string[]): THREE.Bone | null => {
      const bones = this.mesh.skeleton.bones;
      for (let i = 0; i < bones.length; i++) if (names.includes(bones[i].name.toLowerCase())) return bones[i];
      return null;
    };
    return {
      hips: exact(['pelvis', 'hips']) ?? find(['hips', 'pelvis', 'root']),
      spine: find(['spine', 'chest', 'upperchest']),
      neck: exact(['neck_01', 'neck']),
      leftUpperArm: exact(['upperarm_l']) ?? find(['leftarm', 'leftupperarm', 'l_arm', 'leftshoulder']),
      leftLowerArm: exact(['lowerarm_l']) ?? find(['leftforearm', 'leftlowerarm', 'l_forearm']),
      rightUpperArm: exact(['upperarm_r']) ?? find(['rightarm', 'rightupperarm', 'r_arm', 'rightshoulder']),
      rightLowerArm: exact(['lowerarm_r']) ?? find(['rightforearm', 'rightlowerarm', 'r_forearm']),
      leftUpperLeg: exact(['thigh_l']) ?? find(['leftupleg', 'leftthigh', 'l_thigh', 'leftleg']),
      leftLowerLeg: exact(['calf_l']) ?? find(['leftleg', 'leftcalf', 'l_calf', 'leftshin']),
      rightUpperLeg: exact(['thigh_r']) ?? find(['rightupleg', 'rightthigh', 'r_thigh', 'rightleg']),
      rightLowerLeg: exact(['calf_r']) ?? find(['rightleg', 'rightcalf', 'r_calf', 'rightshin']),
    };
  }

  private cacheRestPoses(): void {
    this.mesh.skeleton.bones.forEach((b) => {
      this.restRot.set(b, b.quaternion.clone());
    });
  }

  private restoreRestPoses(): void {
    if (this.rig) {
      // Mixer-driven rig: the mixer rewrites the bones next frame, only the body pitch needs undoing.
      this.rig.rotation.x = 0;
      return;
    }
    this.restRot.forEach((q, b) => b.quaternion.copy(q));
  }

  /**
   * Swim stroke as rotations about the swimmer's left-right axis, layered on whatever pose the bones
   * already hold this frame (call after the mixer). Rotating about a world axis converted into each
   * bone's parent space works for any rig's bone rest orientation, so it never accumulates while a
   * mixer resets the bones every frame.
   */
  private applySwimPose(sprint: boolean, dt: number): void {
    void dt;
    if (this.rig) {
      this.rig.rotation.order = 'YXZ';
      this.rig.rotation.x = SWIM_PITCH;
      this.rig.updateMatrixWorld(true);
      // body right axis (rig faces -Z locally, so +X is its right)
      this.lateral.set(1, 0, 0).applyQuaternion(this.rig.getWorldQuaternion(this.tmpQuat));
    } else {
      const hips = this.bones.hips;
      if (hips) {
        // Pitch body horizontal, yaw to facing
        this.tmpEuler.set(SWIM_PITCH, this.facingYaw, 0, 'YXZ');
        hips.quaternion.setFromEuler(this.tmpEuler);
      }
      this.mesh.updateMatrixWorld(true);
      this.lateral.set(1, 0, 0).applyQuaternion(this.mesh.getWorldQuaternion(this.tmpQuat));
    }

    const phase = this.swimTime * (sprint ? 5.2 : 2.8);
    const amp = this.options.quality === 'low' ? 0.85 : 1;

    // Arms: freestyle when sprinting, breaststroke otherwise. Positive = swing toward the chest side.
    if (sprint) {
      // freestyle: recover over the back to overhead, pull under the chest back to the hip
      this.setArmStroke(this.bones.leftUpperArm, this.bones.leftLowerArm, phase, amp);
      this.setArmStroke(this.bones.rightUpperArm, this.bones.rightLowerArm, phase + Math.PI, amp);
      this.rotateAbout(this.bones.neck, 0.15);
    } else {
      const p = Math.sin(phase);
      this.setBreaststroke(this.bones.leftUpperArm, this.bones.leftLowerArm, p, amp);
      this.setBreaststroke(this.bones.rightUpperArm, this.bones.rightLowerArm, p, amp);
      this.rotateAbout(this.bones.neck, 0.45); // head up out of the water
    }

    // Legs: flutter kick
    const kick = Math.sin(phase * (sprint ? 1.6 : 1.1));
    this.setLeg(this.bones.leftUpperLeg, this.bones.leftLowerLeg, kick, sprint);
    this.setLeg(this.bones.rightUpperLeg, this.bones.rightLowerLeg, -kick, sprint);
  }

  /** Rotate a bone about the swimmer's lateral axis by `angle` (radians), in its parent's space. */
  private rotateAbout(bone: THREE.Bone | null, angle: number): void {
    if (!bone || !bone.parent) return;
    bone.parent.getWorldQuaternion(this.tmpParentQuat);
    this.tmpAxis.copy(this.lateral).applyQuaternion(this.tmpParentQuat.invert()).normalize();
    this.tmpQuat.setFromAxisAngle(this.tmpAxis, angle);
    bone.quaternion.premultiply(this.tmpQuat);
    bone.updateMatrixWorld(false);
  }

  private setArmStroke(upper: THREE.Bone | null, lower: THREE.Bone | null, phase: number, amp: number): void {
    if (!upper) return;
    const a = phase % (Math.PI * 2);
    // full circle backwards: hip -> over the back -> overhead -> under the chest -> hip
    this.rotateAbout(upper, -a * amp);
    // elbow bends during the recovery (first half), straighter on the pull
    this.rotateAbout(lower, 0.25 + Math.max(0, Math.sin(a)) * 0.9 * amp);
  }

  private setBreaststroke(upper: THREE.Bone | null, lower: THREE.Bone | null, p: number, amp: number): void {
    if (!upper) return;
    // arms reach overhead (~2.7 rad) and sweep back to under the shoulders (~1.5 rad)
    this.rotateAbout(upper, 2.7 - (0.5 + 0.5 * p) * 1.2 * amp);
    this.rotateAbout(lower, 0.2 + Math.max(0, p) * 1.0);
  }

  private setLeg(upper: THREE.Bone | null, lower: THREE.Bone | null, kick: number, sprint: boolean): void {
    if (!upper) return;
    const k = sprint ? 0.55 : 0.35;
    this.rotateAbout(upper, 0.1 + kick * k);
    // knee flexion swings the shin backwards
    this.rotateAbout(lower, -(0.25 + Math.max(0, -kick) * 0.6));
  }

  private checkLadder(): boolean {
    if (this.options.ladders.length === 0) return false;
    const p = this.body.position;
    for (let i = 0; i < this.options.ladders.length; i++) {
      const l = this.options.ladders[i];
      const dx = p.x - l.x;
      const dz = p.z - l.z;
      if (dx * dx + dz * dz < 1.2 && Math.abs(p.y - l.y) < 2.5) return true;
    }
    return false;
  }

  private exitWater(terrainH: number, fromLadder: boolean): void {
    this.isSwimming = false;
    this.isInWater = false;
    this.restoreRestPoses();
    const pos = this.body.position;
    pos.y = Math.max(terrainH + 0.05, this.options.seaLevel + 0.05);
    if (fromLadder) pos.y += 0.4;
    this.climbCooldown = 0.6;
    // Mixer resumes automatically on next non-swim frame
  }

  dispose(): void {
    this.splash.dispose();
    if (this.tint) this.tint.dispose();
  }
}
