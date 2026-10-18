// Light-plane point mass. Off unless ?flight=sg. Nose is local +Z, wings local +X.
// Lift, drag and thrust are integrated in world space. Pitch and roll are body
// rates, so a yaw does not send the elevator onto the wrong axis.
import * as THREE from "three";
import type { FlightInput, TerrainHeightFn, FlightOptions } from "./types";

const MASS = 850;
const GRAVITY = 9.81;
const MAX_THRUST = 3400;
const WING_AREA = 14.5;
const RHO = 1.225;
const CL0 = 0.22;
const CL_ALPHA = 5.0;
const CL_MAX = 1.35;
const ALPHA_STALL = (15 * Math.PI) / 180;
const CD0 = 0.032;
const CD_INDUCED = 0.055;
const GEAR_DRAG = 0.014;
const ROTATE_MS = 30;
const ROLL_MU = 0.022;
const BRAKE_MU = 0.1;

const _nose = new THREE.Vector3();
const _up = new THREE.Vector3();
const _right = new THREE.Vector3();
const _vel = new THREE.Vector3();
const _lift = new THREE.Vector3();
const _force = new THREE.Vector3();
const _axis = new THREE.Vector3();
const _dq = new THREE.Quaternion();
const _qPitch = new THREE.Quaternion();
const _qRoll = new THREE.Quaternion();
const _qYaw = new THREE.Quaternion();
const _level = new THREE.Quaternion();
const _X = new THREE.Vector3(1, 0, 0);
const _Y = new THREE.Vector3(0, 1, 0);
const _Z = new THREE.Vector3(0, 0, 1);

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const wrap = (a: number) => Math.atan2(Math.sin(a), Math.cos(a));

export class Plane {
  readonly group: THREE.Group;
  readonly gearGroup: THREE.Group;
  private readonly velocity = new THREE.Vector3();
  private throttle = 0;
  private elevator = 0;
  private aileron = 0;
  private rudder = 0;
  private gearDown = true;
  private onGround = true;
  private airspeed = 0;
  private pRate = 0;
  private rRate = 0;
  private yRate = 0;
  private groundY = 0;

  constructor(options: FlightOptions = {}) {
    this.group = new THREE.Group();
    if (options.position) this.group.position.copy(options.position);
    this.group.position.y = Math.max(this.group.position.y, 1.15);
    this.gearGroup = buildGameGear();
    this.gearGroup.visible = true;
  }

  get position(): THREE.Vector3 { return this.group.position; }
  get isOnGround(): boolean { return this.onGround; }
  get speed(): number { return this.airspeed; }
  get gearVisible(): boolean { return this.gearGroup.visible; }

  /** Nose elevation above the horizon, radians. Positive is nose up. */
  get pitch(): number {
    this.basis();
    return Math.asin(clamp(_nose.y, -1, 1));
  }

  /** Right wing down, radians. */
  get bank(): number {
    this.basis();
    return Math.atan2(-_right.y, _up.y);
  }

  /** Game heading: the nose points along (-sin h, -cos h). */
  get heading(): number {
    this.basis();
    return Math.atan2(-_nose.x, -_nose.z);
  }

  /** Airborne start, wings level, nose along +Z. */
  prime(speed: number, altitude: number): void {
    this.group.position.set(0, altitude, 0);
    this.group.quaternion.identity();
    this.velocity.set(0, 0, Math.max(0, speed));
    this.onGround = false;
    this.airspeed = this.velocity.length();
    this.pRate = this.rRate = this.yRate = 0;
  }

  /** Match the game's plane state. `heading` is the game heading. */
  adopt(x: number, y: number, z: number, heading: number, speed: number, airborne = false): void {
    this.group.position.set(x, y, z);
    this.group.quaternion.setFromAxisAngle(_Y, heading + Math.PI);
    this.basis();
    this.velocity.copy(_nose).multiplyScalar(speed);
    this.airspeed = Math.abs(speed);
    this.onGround = !airborne;
    this.groundY = airborne ? 0 : Math.max(0, y - 1.15);
    this.pRate = this.rRate = this.yRate = 0;
  }

  update(dt: number, input: FlightInput, terrainHeight: TerrainHeightFn): void {
    if (!(dt > 0) || !Number.isFinite(dt)) return;
    if (input.gear) this.gearDown = !this.gearDown;
    this.gearGroup.visible = this.gearDown;
    const steps = Math.max(1, Math.min(8, Math.ceil(dt / 0.02)));
    const h = dt / steps;
    for (let i = 0; i < steps; i++) this.step(h, input, terrainHeight);
  }

  private basis(): void {
    _nose.set(0, 0, 1).applyQuaternion(this.group.quaternion);
    _up.set(0, 1, 0).applyQuaternion(this.group.quaternion);
    _right.set(1, 0, 0).applyQuaternion(this.group.quaternion);
  }

  private step(dt: number, input: FlightInput, terrainHeight: TerrainHeightFn): void {
    const k = (rate: number) => Math.min(1, dt * rate);
    this.throttle = THREE.MathUtils.lerp(this.throttle, clamp(input.throttle, 0, 1), k(2.5));
    this.elevator = THREE.MathUtils.lerp(this.elevator, clamp(input.elevator, -1, 1), k(6));
    this.aileron = THREE.MathUtils.lerp(this.aileron, clamp(input.aileron, -1, 1), k(8));
    this.rudder = THREE.MathUtils.lerp(this.rudder, clamp(input.rudder, -1, 1), k(5));

    this.basis();
    this.airspeed = this.velocity.length();
    let aoaNow = 0;
    if (this.airspeed > 0.8) {
      const vFwd = this.velocity.dot(_nose);
      const vUp = this.velocity.dot(_up);
      aoaNow = Math.atan2(-vUp, Math.max(2, vFwd));
    }
    const rotate = !this.onGround || this.airspeed >= ROTATE_MS;
    // Elevator trims angle of attack. Full aft stick seeks a climb, not a continuous loop.
    const aoaTarget = 0.03 + this.elevator * 0.18;
    const pitchCmd = rotate ? clamp((aoaTarget - aoaNow) * 2.4, -0.6, 0.6) : 0;
    const rollCmd = this.onGround ? 0 : Math.abs(this.aileron) < 0.04 ? -this.bank * 1.4 : this.aileron * 1.15;
    this.pRate += (pitchCmd - this.pRate) * k(5);
    this.rRate += (rollCmd - this.rRate) * k(6);

    let yawCmd = this.rudder * 0.45;
    if (!this.onGround && this.airspeed > 12) {
      const noseH = Math.atan2(_nose.x, _nose.z);
      const velH = Math.atan2(this.velocity.x, this.velocity.z);
      yawCmd += wrap(velH - noseH) * 1.6;
    }
    this.yRate += (yawCmd - this.yRate) * k(3);

    _qPitch.setFromAxisAngle(_X, -this.pRate * dt);
    _qRoll.setFromAxisAngle(_Z, -this.rRate * dt);
    _dq.identity().multiply(_qPitch).multiply(_qRoll);
    this.group.quaternion.multiply(_dq);
    _qYaw.setFromAxisAngle(_Y, this.yRate * dt);
    this.group.quaternion.premultiply(_qYaw);
    if (this.onGround && !rotate) {
      this.basis();
      const yaw = Math.atan2(_nose.x, _nose.z);
      _level.setFromAxisAngle(_Y, yaw);
      this.group.quaternion.slerp(_level, k(8));
      this.pRate = 0;
      this.rRate *= 0.5;
    }
    this.group.quaternion.normalize();
    this.basis();

    _force.set(0, -MASS * GRAVITY, 0);
    _force.addScaledVector(_nose, this.throttle * MAX_THRUST);
    let netUp = -MASS * GRAVITY;

    if (this.airspeed > 0.8) {
      _vel.copy(this.velocity).multiplyScalar(1 / this.airspeed);
      const vFwd = this.velocity.dot(_nose);
      const vUp = this.velocity.dot(_up);
      const aoa = Math.atan2(-vUp, Math.max(2, vFwd));
      let cl = CL0 + CL_ALPHA * aoa;
      if (Math.abs(aoa) > ALPHA_STALL) {
        const peak = CL0 + CL_ALPHA * ALPHA_STALL;
        const fade = clamp(1 - (Math.abs(aoa) - ALPHA_STALL) * 1.4, 0.4, 1);
        cl = Math.sign(aoa || 1) * peak * fade;
      }
      cl = clamp(cl, -0.8, CL_MAX);
      const q = 0.5 * RHO * this.airspeed * this.airspeed;
      const cd = CD0 + (this.gearDown ? GEAR_DRAG : 0) + cl * cl * CD_INDUCED;
      _lift.copy(_up).addScaledVector(_vel, -_up.dot(_vel));
      if (_lift.lengthSq() < 1e-8) _lift.copy(_up);
      else _lift.normalize();
      _force.addScaledVector(_lift, cl * q * WING_AREA);
      _force.addScaledVector(this.velocity, -(cd * q * WING_AREA) / this.airspeed);
    }
    netUp = _force.y;

    this.velocity.addScaledVector(_force, dt / MASS);
    this.group.position.addScaledVector(this.velocity, dt);

    let groundY = terrainHeight(this.group.position.x, this.group.position.z);
    if (!Number.isFinite(groundY)) groundY = this.groundY;
    // A missed terrain sample comes back near 0 and would drop the wheels off the runway.
    if (this.onGround && this.groundY > 0 && groundY < this.groundY - 8) groundY = this.groundY;
    this.groundY = groundY;
    const clearance = this.gearDown ? 1.15 : 0.48;
    const contact = groundY + clearance;
    const flying = this.airspeed >= ROTATE_MS && netUp > 400 && this.pitch > 0.05;
    if (this.onGround && !flying) {
      this.group.position.y = contact;
      this.velocity.y = 0;
      const hspeed = Math.hypot(this.velocity.x, this.velocity.z);
      if (hspeed > 0.04) {
        const mu = this.throttle < 0.12 ? BRAKE_MU : ROLL_MU;
        const decel = Math.min(hspeed, mu * GRAVITY * dt);
        const scale = (hspeed - decel) / hspeed;
        this.velocity.x *= scale;
        this.velocity.z *= scale;
      }
      this.basis();
      _axis.set(_nose.x, 0, _nose.z);
      if (_axis.lengthSq() > 1e-8 && hspeed > 1) {
        _axis.normalize();
        const along = this.velocity.x * _axis.x + this.velocity.z * _axis.z;
        this.velocity.x = _axis.x * along;
        this.velocity.z = _axis.z * along;
      }
    } else if (!this.onGround && this.group.position.y <= contact && this.velocity.y <= 0) {
      this.group.position.y = contact;
      this.velocity.y = 0;
      this.onGround = true;
    } else if (flying || this.group.position.y > contact + 0.05) {
      this.onGround = false;
    }
    this.airspeed = this.velocity.length();
    if (!Number.isFinite(this.airspeed)) {
      this.velocity.set(0, 0, 0);
      this.airspeed = 0;
    }
  }
}

/**
 * Divi Divi Air island hopper in the game's plane space (nose -Z, wheel bottoms at y = -2).
 * The type that actually uses Queen Beatrix for the Aruba–Curaçao hop is a DHC-6 Twin Otter
 * (fixed gear, high wing, twin props). PJ-DVH wears the flamingo tail; the fuselage stays white
 * with a red cheatline. Proportions are the real airframe, shortened only enough to sit on the
 * game's ground contact (wheels at local y = -2).
 */
export function buildIslandHopper(): THREE.Group {
  const g = new THREE.Group();
  g.name = "sg-otter";
  const white = new THREE.MeshStandardMaterial({ color: 0xf4f6f8, roughness: 0.45, metalness: 0.08 });
  const red = new THREE.MeshStandardMaterial({ color: 0xc0392b, roughness: 0.5 });
  const pink = new THREE.MeshStandardMaterial({ color: 0xf27aa2, roughness: 0.48 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x1c3d52, roughness: 0.12, metalness: 0.3 });
  const dark = new THREE.MeshStandardMaterial({ color: 0x1b1b1d, roughness: 0.85 });
  const metal = new THREE.MeshStandardMaterial({ color: 0xb8bcc4, metalness: 0.55, roughness: 0.4 });
  const add = (mesh: THREE.Mesh, parent: THREE.Object3D = g) => { parent.add(mesh); return mesh; };

  const body = add(new THREE.Mesh(new THREE.BoxGeometry(1.55, 1.7, 8.4), white));
  body.position.set(0, -0.2, -0.2);
  const nose = add(new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.15, 1.5), white));
  nose.position.set(0, -0.35, -4.9);
  const stripe = add(new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.12, 8.6), red));
  stripe.position.set(0, 0.15, -0.3);
  const windows = add(new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.42, 4.2), glass));
  windows.position.set(0, 0.35, -1.1);
  const wing = add(new THREE.Mesh(new THREE.BoxGeometry(19.2, 0.16, 1.85), white));
  wing.position.set(0, 0.72, -0.5);
  const wingRed = add(new THREE.Mesh(new THREE.BoxGeometry(19.2, 0.04, 0.16), red));
  wingRed.position.set(0, 0.66, -1.2);

  for (const side of [-1, 1]) {
    const nacelle = add(new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.55, 1.7), white));
    nacelle.position.set(side * 3.15, 0.15, -0.7);
    const prop = new THREE.Group();
    prop.name = "sg-prop";
    prop.position.set(side * 3.15, 0.15, -1.6);
    const disc = add(new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.08, 0.06), dark), prop);
    const disc2 = add(new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.7, 0.06), dark), prop);
    disc.position.z = 0;
    disc2.position.z = 0;
    g.add(prop);
  }

  const fin = add(new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.1, 1.3), pink));
  fin.position.set(0, 1.15, 4.3);
  const stab = add(new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.1, 0.85), pink));
  stab.position.set(0, 0.55, 4.55);

  const strut = new THREE.CylinderGeometry(0.06, 0.06, 1, 6).translate(0, -0.5, 0);
  const tyre = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 10).rotateZ(Math.PI / 2);
  for (const [x, z, top] of [[0, -4.2, -0.7], [-1.35, 0.6, -0.55], [1.35, 0.6, -0.55]] as const) {
    const leg = new THREE.Group();
    leg.position.set(x, top, z);
    const len = top + 2;
    const st = add(new THREE.Mesh(strut, metal), leg);
    st.scale.y = len;
    const w = add(new THREE.Mesh(tyre, dark), leg);
    w.position.y = -len;
    g.add(leg);
  }
  return g;
}

/** Gear in the game's plane space: nose is local -Z, wheel bottoms at y = -2. */
export function buildGameGear(): THREE.Group {
  const grp = new THREE.Group();
  grp.name = "sg-gear";
  const strutM = new THREE.MeshStandardMaterial({ color: 0xb8bcc4, metalness: 0.55, roughness: 0.4 });
  const tyreM = new THREE.MeshStandardMaterial({ color: 0x1b1b1d, roughness: 0.9 });
  const strut = new THREE.CylinderGeometry(0.07, 0.07, 1, 6).translate(0, -0.5, 0);
  const tyre = new THREE.CylinderGeometry(0.26, 0.26, 0.22, 12).rotateZ(Math.PI / 2);
  for (const [x, z, top] of [[0, -3.3, -0.45], [-1.15, 0.4, -0.55], [1.15, 0.4, -0.55]] as const) {
    const leg = new THREE.Group();
    leg.position.set(x, top, z);
    const len = top + 1.74;
    const st = new THREE.Mesh(strut, strutM);
    st.scale.y = len;
    leg.add(st);
    const w = new THREE.Mesh(tyre, tyreM);
    w.position.y = -len;
    leg.add(w);
    grp.add(leg);
  }
  return grp;
}
