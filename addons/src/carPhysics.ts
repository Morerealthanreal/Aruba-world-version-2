// Car physics overhaul: 4-wheel independent suspension, dynamic weight transfer,
// surface-dependent tire grip (asphalt, sand, dirt), handbrake drifts with body slip,
// and speed-sensitive chase camera with drift lookahead.
// Kill switch: ?carphysics=0 (restores stock handling).
import * as THREE from "three";
import type { AGame } from "./env";

export type SurfaceType = "asphalt" | "sand" | "dirt";

export type SurfaceGrip = {
  surface: SurfaceType;
  mu: number;         // Friction coefficient: asphalt: 1.0, dirt: 0.75, sand: 0.55
  accelMult: number;  // Engine traction factor: asphalt: 1.0, dirt: 0.85, sand: 0.62
  brakeDecel: number; // Max braking deceleration: asphalt: 28, dirt: 20, sand: 14
  rollRes: number;    // Rolling resistance: asphalt: 0.12, dirt: 0.18, sand: 0.32
  coastDrag: number;  // Coast drag: asphalt: 7.5, dirt: 8.5, sand: 12.0
};

export type CarState = {
  x: number;
  y: number;
  z: number;
  h: number;
  s: number;
  ls?: number;
  pitch: number;
  roll?: number;
  st: number;
  drift?: number;
  steerVis?: number;
  snap?: boolean;
};

export type WheelMount = {
  o: THREE.Object3D;
  q0: THREE.Quaternion;
  axle: THREE.Vector3;
  up: THREE.Vector3;
  front: boolean;
  spin: number;
};

export type CarObj = THREE.Object3D & {
  wheels?: WheelMount[];
};

type RealWorld = {
  roadHeightAt?: (x: number, z: number) => number | null;
  surfaceAt?: (x: number, z: number) => number;
  heightAt?: (x: number, z: number) => number;
};

const SKID_COUNT = 320;
const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export class CarPhysics {
  private g: AGame;
  private baseY: number[] = [];
  private suspDisp = [0, 0, 0, 0];
  private lastCarObj: CarObj | null = null;

  // Reusable math objects to guarantee zero allocation in the hot loop
  private m4 = new THREE.Matrix4();
  private v0 = new THREE.Vector3();
  private v1 = new THREE.Vector3();
  private v2 = new THREE.Vector3();

  // Skid marks
  private skids: THREE.InstancedMesh;
  private skidIdx = 0;
  private lastSkidPos = new THREE.Vector3();
  private skidDist = 0;

  // Camera state
  private camDist = 7.2;
  private driftLookOffset = 0;

  constructor(g: AGame) {
    this.g = g;

    // Instanced skid marks for drifting
    const skidGeo = new THREE.PlaneGeometry(0.32, 0.9).rotateX(-Math.PI / 2);
    const skidMat = new THREE.MeshBasicMaterial({
      color: 0x11161d,
      transparent: true,
      opacity: 0.48,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -2,
    });
    this.skids = new THREE.InstancedMesh(skidGeo, skidMat, SKID_COUNT);
    this.skids.name = "aw:car-skids";
    this.skids.count = 0;
    this.skids.frustumCulled = false;
    this.skids.renderOrder = 1;
    this.skids.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    g.scene.add(this.skids);

    // Register hooks on window.__awCar
    const host = window as unknown as { __awCar?: unknown };
    host.__awCar = {
      grip: (car: CarState, real: RealWorld) => this.getGrip(car.x, car.z, car.y, real),
      accel: (car: CarState, real: RealWorld) => this.accel(car, real),
      brake: (car: CarState, real: RealWorld, t: number, c: boolean) => this.brake(car, real, t, c),
      rollRes: (car: CarState, real: RealWorld, s: number, c: boolean, t: number) => this.rollRes(car, real, s, c, t),
      coastDrag: (car: CarState, real: RealWorld) => this.coastDrag(car, real),
      driftTarget: (car: CarState, c: boolean, t: number, real: RealWorld) => this.driftTarget(car, c, t, real),
      turnMult: (car: CarState) => this.turnMult(car),
      bodySlip: (car: CarState) => this.bodySlip(car),
      suspension: (car: CarState, obj: CarObj, wHeights: number[], ax: number, alat: number, dt: number) =>
        this.updateSuspension(car, obj, wHeights, ax, alat, dt),
      cam: (target: THREE.Vector3, lookAt: THREE.Vector3, car: CarState, dt: number, isMoto: boolean) =>
        this.updateCamera(target, lookAt, car, dt, isMoto),
      getSurfaceInfo: (x: number, z: number, y: number) => this.getGrip(x, z, y, this.g.real as RealWorld),
    };
  }

  /** Determine surface material and grip properties based on road database and elevation */
  getGrip(x: number, z: number, y: number, real?: RealWorld): SurfaceGrip {
    const rw = real || (this.g.real as RealWorld);
    const roadH = rw && rw.roadHeightAt ? rw.roadHeightAt(x, z) : null;

    if (roadH !== null) {
      // Asphalt road / highway
      return {
        surface: "asphalt",
        mu: 1.0,
        accelMult: 1.0,
        brakeDecel: 30.0,
        rollRes: 0.25,
        coastDrag: 7.5,
      };
    }

    // Off-road: beach sand vs inland dirt
    // Low elevation near sea level is beach/coastal sand
    if (y < 3.2) {
      return {
        surface: "sand",
        mu: 0.55,
        accelMult: 0.62,
        brakeDecel: 14.0,
        rollRes: 0.32,
        coastDrag: 12.0,
      };
    }

    // Inland higher ground is dirt / kunuku
    return {
      surface: "dirt",
      mu: 0.75,
      accelMult: 0.85,
      brakeDecel: 20.0,
      rollRes: 0.18,
      coastDrag: 8.5,
    };
  }

  /** Surface-dependent engine acceleration */
  accel(car: CarState, real: RealWorld): number {
    const grip = this.getGrip(car.x, car.z, car.y, real);
    return grip.accelMult;
  }

  /** Surface-dependent braking deceleration */
  brake(car: CarState, real: RealWorld, t: number, c: boolean): number {
    const grip = this.getGrip(car.x, car.z, car.y, real);
    const speed = Math.abs(car.s);
    const turning = Math.abs(t) > 0.3;

    // During a hard drift, rear brakes lock while car slides, reducing forward decel to sustain drift
    if (c && turning && speed > 9) {
      return grip.brakeDecel * 0.28;
    }
    return grip.brakeDecel;
  }

  /** Rolling resistance based on surface (sand sinks and drags, asphalt rolls freely) */
  rollRes(car: CarState, real: RealWorld, s: number, c: boolean, t: number): number {
    const grip = this.getGrip(car.x, car.z, car.y, real);
    const speed = Math.abs(car.s);
    const turning = Math.abs(t) > 0.3;

    if (c && turning && speed > 9) {
      return 0.08; // sliding slip resistance
    }
    if (c) return 0.2;
    if (s > 0) return grip.rollRes;
    return grip.rollRes * 0.9;
  }

  /** Coast drag when off the throttle */
  coastDrag(car: CarState, real: RealWorld): number {
    const grip = this.getGrip(car.x, car.z, car.y, real);
    return grip.coastDrag;
  }

  /** Calculate target drift factor [0, 1] based on handbrake, steering, speed, and surface */
  driftTarget(car: CarState, c: boolean, t: number, real: RealWorld): number {
    const speed = Math.abs(car.s);
    const steer = Math.abs(car.st || t);

    // Handbrake drift initiation: brake or space key held with steering at speed
    if (c && steer > 0.2 && speed > 6) {
      return 1.0;
    }

    return 0.0;
  }

  /** Yaw authority boost during drift to simulate oversteer and counter-steer control */
  turnMult(car: CarState): number {
    const d = car.drift || 0;
    return d * 0.65;
  }

  /** Chassis body slip angle (beta) causing car nose to point into corner while sliding */
  bodySlip(car: CarState): number {
    const d = car.drift || 0;
    const steer = car.st || 0;
    const dir = Math.sign(car.s || 1);
    // Beta slip angle in radians, up to ~0.35 rad (20 degrees)
    return d * steer * 0.38 * dir;
  }

  /** 4-wheel independent suspension compression & weight transfer dynamics */
  updateSuspension(car: CarState, obj: CarObj, wHeights: number[], ax: number, alat: number, dt: number): void {
    if (!obj || !obj.wheels || obj.wheels.length < 4) return;

    // Cache initial base Y position of wheel meshes once
    if (this.lastCarObj !== obj) {
      this.lastCarObj = obj;
      this.baseY = obj.wheels.map((w) => w.o.position.y);
    }

    // Longitudinal weight transfer:
    // Accelerating squats the rear and lifts the front; braking dives the nose and lifts the rear
    const pitchOffset = clamp(-ax * 0.005, -0.04, 0.04);

    // Lateral weight transfer:
    // Cornering rolls the chassis outwards, compressing outside suspension
    const rollOffset = clamp(alat * 0.0035, -0.04, 0.04);

    // Chassis pitch and roll compliance
    car.pitch = clamp(car.pitch + pitchOffset * Math.min(1, dt * 6), -0.22, 0.22);
    car.roll = clamp((car.roll || 0) + rollOffset * Math.min(1, dt * 6), -0.15, 0.15);

    // 4 wheel contact patches: [W0: FL, W1: FR, W2: RL, W3: RR]
    // Compute suspension travel for each wheel independently
    const halfL = 1.45;
    const halfW = 0.82;
    const mounts = [
      { x: -halfW, z: halfL },  // FL
      { x: halfW, z: halfL },   // FR
      { x: -halfW, z: -halfL }, // RL
      { x: halfW, z: -halfL },  // RR
    ];

    const kSpring = 24.0;
    for (let i = 0; i < 4; i++) {
      const wh = wHeights[i];
      if (!Number.isFinite(wh)) continue;

      const m = mounts[i];
      // Mount height in world space given chassis pitch and roll
      const mountY = car.y + car.pitch * m.z - (car.roll || 0) * m.x;
      // Target wheel compression relative to rest
      const restClearance = 0.38;
      const targetDisp = clamp(wh - (mountY - restClearance), -0.10, 0.10);

      // Spring-damper integration
      this.suspDisp[i] += (targetDisp - this.suspDisp[i]) * Math.min(1, dt * kSpring);

      // Offset the wheel mesh along local Y
      const wObj = obj.wheels[i];
      if (wObj && wObj.o) {
        wObj.o.position.y = (this.baseY[i] || 0.38) + this.suspDisp[i];
      }
    }

    // Spawn skid marks from rear wheels during drift
    if ((car.drift || 0) > 0.25 && Math.abs(car.s) > 7) {
      this.addSkidMarks(car, obj);
    }
  }

  /** Spawn tire skid marks behind rear wheels */
  private addSkidMarks(car: CarState, obj: CarObj): void {
    const rearL = obj.wheels?.[2];
    const rearR = obj.wheels?.[3];
    if (!rearL || !rearR) return;

    this.v0.setFromMatrixPosition(rearL.o.matrixWorld);
    this.v1.setFromMatrixPosition(rearR.o.matrixWorld);

    // Check distance moved since last skid stamp
    this.skidDist += this.v0.distanceTo(this.lastSkidPos);
    this.lastSkidPos.copy(this.v0);
    if (this.skidDist < 0.6) return;
    this.skidDist = 0;

    const rot = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), car.h);
    const scale = new THREE.Vector3(1, 1, 1);

    // Left skid
    this.v0.y += 0.03;
    this.m4.compose(this.v0, rot, scale);
    this.skids.setMatrixAt(this.skidIdx % SKID_COUNT, this.m4);
    this.skidIdx++;

    // Right skid
    this.v1.y += 0.03;
    this.m4.compose(this.v1, rot, scale);
    this.skids.setMatrixAt(this.skidIdx % SKID_COUNT, this.m4);
    this.skidIdx++;

    this.skids.count = Math.min(this.skidIdx, SKID_COUNT);
    this.skids.instanceMatrix.needsUpdate = true;
  }

  /** Speed-sensitive chase camera with dynamic distance, height, and drift lookahead */
  updateCamera(target: THREE.Vector3, lookAt: THREE.Vector3, car: CarState, dt: number, isMoto: boolean): void {
    // If in motorcycle mode, let GvMoto handle it
    if (isMoto) {
      const motoCam = (window as unknown as { __awMotoCam?: (t: THREE.Vector3, c: CarState, d: number, m: boolean) => void }).__awMotoCam;
      if (motoCam) motoCam(target, car, dt, true);
      return;
    }

    const speed = Math.abs(car.s || 0);

    // Speed-sensitive chase distance:
    // Low speed: close and tight (7.2 m)
    // Top speed (45 m/s): pulls back for panoramic view (11.0 m)
    const targetDist = 7.2 + clamp(speed / 48, 0, 1) * 3.8;
    this.camDist += (targetDist - this.camDist) * Math.min(1, dt * 3.5);

    // Speed-sensitive camera height adjustment (+0.5 m at high speed)
    const speedHeight = clamp(speed / 45, 0, 1) * 0.55;

    // Drift lookahead: pan the camera look-at target into the drift trajectory
    const drift = car.drift || 0;
    const steer = car.st || 0;
    const targetDriftLook = drift * steer * 2.8 * Math.sign(car.s || 1);
    this.driftLookOffset += (targetDriftLook - this.driftLookOffset) * Math.min(1, dt * 4);

    // Apply lookahead offset to the target being looked at (lookAt = Rv)
    const sn = Math.sin(car.h);
    const cs = Math.cos(car.h);
    lookAt.x += cs * this.driftLookOffset;
    lookAt.z -= sn * this.driftLookOffset;

    // Apply speed height and distance offset to camera position (target = zv)
    target.y += speedHeight;

    // Pull camera back along heading vector to achieve dynamic speed-sensitive distance
    const distDelta = this.camDist - 7.2;
    target.x += sn * distDelta * 0.65;
    target.z += cs * distDelta * 0.65;
  }

  /** Per-frame update called by the main loop */
  update(_dt: number): void {
    // Keep skid marks visible when in use
  }
}
