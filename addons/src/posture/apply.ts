// Procedural Fortnite idle / walk / run for the player rig only.
// The foot bones are parented to the skinned mesh (the rig root), not to the
// calf. IK solves the thigh and calf, then writes the ankle in the foot's
// real parent space. Reparenting the foot would invalidate the bind matrices.
import {
  Matrix4, Object3D, Quaternion, SkinnedMesh, Vector3,
} from "three";
import { TUNE, deg } from "./tune.ts";
import { bankAngle, lerp3, planGait, stanceU, type GaitW } from "./gait.ts";

export type PostureMetrics = {
  leanDeg: number;
  spineDeg: number;
  headDeg: number;
  bob: number;
  bankDeg: number;
  elbowDeg: number;
  kneeDeg: number;
  footErr: number;
  soleDeg: number;
  cadence: number;
  stride: number;
};

export type PostureState = {
  bindRoot: Quaternion | null;
  neutralY: number;
  neutralReady: boolean;
  prevYaw: number;
  prevSpeed: number;
  brake: number;
  time: number;
  locks: [Lock, Lock];
  /** World XZ of a sole that is fully planted, used to prove it does not skate. */
  anchor: [{ on: boolean; x: number; z: number }, { on: boolean; x: number; z: number }];
  drift: number;
  plantFrames: number;
  sole: [Vector3, Vector3] | null;
  toe: [Vector3, Vector3] | null;
  curlAxis: Vector3 | null;
  metrics: PostureMetrics;
};

type Lock = { on: boolean; spent: boolean; x: number; z: number; grip: number };

export type Ground = { y: number; nx: number; ny: number; nz: number };

export type PostureInput = {
  dt: number;
  speed: number;
  yaw: number;
  phase: number;
  weights: GaitW;
  holder: Object3D;
  forward: Vector3;
  groundAt: (x: number, z: number) => Ground;
};

const _q = new Quaternion();
const _pq = new Quaternion();
const _local = new Quaternion();
const _up = new Vector3(0, 1, 0);
const _v = new Vector3();
const _v2 = new Vector3();
const _v3 = new Vector3();
const _p = new Vector3();
const _s = new Vector3();
const _m = new Matrix4();
const _m2 = new Matrix4();
const _hip = new Vector3();
const _knee = new Vector3();
const _ankle = new Vector3();
const _clip = new Vector3();
const _target = new Vector3();
const _pole = new Vector3();
const _right = new Vector3();
const _fwd = new Vector3();
const _body = new Vector3();
const _spine = new Vector3();
const _down = new Vector3();
const _holder = new Vector3();
const _aim = new Vector3();

export function createPostureState(): PostureState {
  const blank = (): PostureMetrics => ({
    leanDeg: 0, spineDeg: 0, headDeg: 0, bob: 0, bankDeg: 0,
    elbowDeg: 0, kneeDeg: 0, footErr: 0, soleDeg: 0, cadence: 0, stride: 0,
  });
  return {
    bindRoot: null, neutralY: 0, neutralReady: false, prevYaw: 0, prevSpeed: 0,
    brake: 0, time: 0,
    locks: [
      { on: false, spent: false, x: 0, z: 0, grip: 0 },
      { on: false, spent: false, x: 0, z: 0, grip: 0 },
    ],
    anchor: [{ on: false, x: 0, z: 0 }, { on: false, x: 0, z: 0 }],
    drift: 0,
    plantFrames: 0,
    sole: null, toe: null, curlAxis: null, metrics: blank(),
  };
}

function findNamed(root: Object3D, name: string): Object3D | null {
  let found: Object3D | null = null;
  root.traverse((o) => { if (!found && o.name === name) found = o; });
  return found;
}

function findSkinned(root: Object3D): SkinnedMesh | null {
  let mesh: SkinnedMesh | null = null;
  root.traverse((o) => {
    if (!mesh && (o as SkinnedMesh).isSkinnedMesh) mesh = o as SkinnedMesh;
  });
  return mesh;
}

export type PostureBones = {
  mesh: SkinnedMesh;
  root: Object3D;
  pelvis: Object3D;
  spines: Object3D[];
  neck: Object3D;
  head: Object3D;
  thigh: Object3D[];
  calf: Object3D[];
  foot: Object3D[];
  upper: Object3D[];
  lower: Object3D[];
  hand: Object3D[];
  clav: Object3D[];
  fingers: Object3D[];
  leg: number;
};

export function collectBones(model: Object3D): PostureBones | null {
  const mesh = findSkinned(model);
  const root = findNamed(model, "Root");
  const pelvis = findNamed(model, "pelvis");
  const neck = findNamed(model, "neck_01");
  const head = findNamed(model, "head");
  const spines = ["spine_01", "spine_02", "spine_03"].map((n) => findNamed(model, n));
  const pair = (a: string, b: string) => [findNamed(model, a), findNamed(model, b)];
  const thigh = pair("thigh_l", "thigh_r");
  const calf = pair("calf_l", "calf_r");
  const foot = pair("foot_l", "foot_r");
  const upper = pair("upperarm_l", "upperarm_r");
  const lower = pair("lowerarm_l", "lowerarm_r");
  const hand = pair("hand_l", "hand_r");
  const clav = pair("clavicle_l", "clavicle_r");
  const need = [mesh, root, pelvis, neck, head, ...spines, ...thigh, ...calf, ...foot, ...upper, ...lower];
  if (need.some((b) => !b)) return null;
  const fingers: Object3D[] = [];
  model.traverse((o) => {
    if (/^(index|middle|ring|pinky|thumb)_\d+_/.test(o.name)) fingers.push(o);
  });
  model.updateMatrixWorld(true);
  const l1 = (thigh[0] as Object3D).getWorldPosition(_v).distanceTo((calf[0] as Object3D).getWorldPosition(_v2));
  const sc = worldScale(calf[0] as Object3D);
  return {
    mesh: mesh as SkinnedMesh,
    root: root as Object3D,
    pelvis: pelvis as Object3D,
    neck: neck as Object3D,
    head: head as Object3D,
    spines: spines as Object3D[],
    thigh: thigh as Object3D[],
    calf: calf as Object3D[],
    foot: foot as Object3D[],
    upper: upper as Object3D[],
    lower: lower as Object3D[],
    hand: hand as Object3D[],
    clav: clav as Object3D[],
    fingers,
    leg: l1 + TUNE.calfLen * sc,
  };
}

function worldScale(bone: Object3D) {
  bone.getWorldScale(_s);
  return Math.max(0.2, (_s.x + _s.y + _s.z) / 3);
}

function rotateWorld(bone: Object3D, axis: Vector3, angle: number) {
  if (!bone.parent || Math.abs(angle) < 1e-5) return;
  _q.setFromAxisAngle(axis, angle);
  bone.parent.getWorldQuaternion(_pq);
  _local.copy(_pq).invert().multiply(_q).multiply(_pq);
  bone.quaternion.premultiply(_local);
}

function signedAngle(a: Vector3, b: Vector3, axis: Vector3) {
  _v3.crossVectors(a, b);
  return Math.atan2(_v3.dot(axis), Math.max(-1, Math.min(1, a.dot(b))));
}

/** Point the bone's local +Y (the child axis) along `dir` in world space. */
function pointBone(bone: Object3D, dir: Vector3) {
  bone.updateWorldMatrix(true, false);
  bone.getWorldQuaternion(_pq);
  _v.set(0, 1, 0).applyQuaternion(_pq).normalize();
  _v2.copy(dir).normalize();
  if (_v.dot(_v2) > 0.9995) return;
  _q.setFromUnitVectors(_v, _v2);
  const parent = bone.parent;
  if (!parent) {
    bone.quaternion.premultiply(_q);
    return;
  }
  parent.getWorldQuaternion(_pq);
  _local.copy(_pq).invert().multiply(_q).multiply(_pq);
  bone.quaternion.premultiply(_local);
}

function bindQuat(mesh: SkinnedMesh, bone: Object3D, out: Quaternion) {
  const i = mesh.skeleton.bones.indexOf(bone as never);
  if (i < 0) return out.identity();
  _m.copy(mesh.skeleton.boneInverses[i]).invert();
  _m.decompose(_p, out, _s);
  return out;
}

function captureFootAxes(bones: PostureBones, state: PostureState) {
  // Bind matrices are in the glTF pose, before the game yaws the mesh.
  // In that pose the character faces +Z and up is +Y.
  const sole: Vector3[] = [];
  const toe: Vector3[] = [];
  for (let i = 0; i < 2; i++) {
    bindQuat(bones.mesh, bones.foot[i], _q);
    _pq.copy(_q).invert();
    sole.push(new Vector3(0, 1, 0).applyQuaternion(_pq).normalize());
    toe.push(new Vector3(0, 0, 1).applyQuaternion(_pq).normalize());
  }
  state.sole = sole as [Vector3, Vector3];
  state.toe = toe as [Vector3, Vector3];
  state.curlAxis = probeCurl(bones.fingers);
}

function fingerTip(bone: Object3D, out: Vector3) {
  let tip = bone;
  while (tip.children.length) {
    tip = tip.children.find((c) => /index|middle|ring|pinky|thumb/.test(c.name)) ?? tip.children[0];
  }
  return tip.getWorldPosition(out);
}

function probeCurl(fingers: Object3D[]) {
  const finger = fingers.find((f) => f.name.startsWith("index_01_"));
  if (!finger) return null;
  const saved = finger.quaternion.clone();
  const before = fingerTip(finger, new Vector3());
  const origin = finger.getWorldPosition(new Vector3());
  const rest = before.distanceTo(origin);
  let best = 0;
  let axis: Vector3 | null = null;
  for (const ax of [new Vector3(1, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)]) {
    for (const sign of [1, -1]) {
      finger.quaternion.copy(saved);
      finger.rotateOnAxis(ax, sign * 0.7);
      finger.updateMatrixWorld(true);
      const closer = rest - fingerTip(finger, _p).distanceTo(finger.getWorldPosition(_v));
      if (closer > best) {
        best = closer;
        axis = ax.clone().multiplyScalar(sign);
      }
    }
  }
  finger.quaternion.copy(saved);
  finger.updateMatrixWorld(true);
  return best > 0.004 && axis ? axis.normalize() : null;
}

function orientFoot(
  bone: Object3D, soleLocal: Vector3, toeLocal: Vector3,
  normal: Vector3, forward: Vector3, pitch: number,
) {
  const n = _v.copy(normal).normalize();
  const toeW = _v2.copy(forward);
  toeW.y = 0;
  if (toeW.lengthSq() < 1e-6) toeW.set(0, 0, -1);
  toeW.normalize();
  const side = _pole.crossVectors(toeW, n).normalize();
  if (side.lengthSq() < 1e-6) return;
  if (Math.abs(pitch) > 1e-4) {
    n.applyAxisAngle(side, pitch);
    toeW.applyAxisAngle(side, pitch);
  }
  toeW.projectOnPlane(n);
  if (toeW.lengthSq() < 1e-6) return;
  toeW.normalize();
  const fromC = _hip.crossVectors(soleLocal, toeLocal).normalize();
  const fromB = _knee.crossVectors(fromC, soleLocal).normalize();
  const toC = _ankle.crossVectors(n, toeW).normalize();
  const toB = _clip.crossVectors(toC, n).normalize();
  _m.makeBasis(soleLocal, fromB, fromC).invert();
  _m2.makeBasis(n, toB, toC).multiply(_m);
  _q.setFromRotationMatrix(_m2);
  if (!bone.parent) return;
  bone.parent.getWorldQuaternion(_pq);
  bone.quaternion.copy(_pq.invert().multiply(_q));
}

function solveLeg(
  thigh: Object3D, calf: Object3D, ankle: Vector3,
  forward: Vector3, right: Vector3, outward: number, l1: number, l2: number,
) {
  thigh.getWorldPosition(_hip);
  const dist0 = _hip.distanceTo(ankle);
  const dist = Math.max(Math.abs(l1 - l2) + 1e-3, Math.min(l1 + l2 - 1e-3, dist0));
  _v.copy(ankle).sub(_hip);
  if (_v.lengthSq() < 1e-8) _v.set(0, -1, 0);
  else _v.normalize();
  if (Math.abs(dist - dist0) > 1e-4) ankle.copy(_hip).addScaledVector(_v, dist);
  _pole.copy(forward).addScaledVector(_up, 0.4).addScaledVector(right, outward);
  _v2.copy(_v).multiplyScalar(_pole.dot(_v));
  _pole.sub(_v2);
  if (_pole.lengthSq() < 1e-6) _pole.copy(right);
  _pole.normalize();
  const along = (l1 * l1 - l2 * l2 + dist * dist) / (2 * dist);
  const height = Math.sqrt(Math.max(0, l1 * l1 - along * along));
  _knee.copy(_hip).addScaledVector(_v, along).addScaledVector(_pole, height);
  pointBone(thigh, _v2.copy(_knee).sub(_hip));
  thigh.updateMatrixWorld(true);
  calf.getWorldPosition(_hip);
  pointBone(calf, _v2.copy(ankle).sub(_knee));
}

function applyBob(pelvis: Object3D, state: PostureState, phase: number, amp: number, dt: number) {
  pelvis.getWorldPosition(_p);
  if (!state.neutralReady) {
    state.neutralY = _p.y;
    state.neutralReady = true;
  }
  const k = 1 - Math.exp(-Math.max(0, dt) / 1.6);
  state.neutralY += (_p.y - state.neutralY) * k;
  // `amp` is peak-to-peak travel, so the cosine uses half of it.
  const desired = state.neutralY + Math.cos(phase * Math.PI * 4) * amp * 0.5;
  const dy = desired - _p.y;
  if (!pelvis.parent || Math.abs(dy) < 1e-5) return;
  _p.y = desired;
  pelvis.parent.worldToLocal(_p);
  pelvis.position.copy(_p);
}

export function applyPosture(bones: PostureBones, state: PostureState, input: PostureInput) {
  const w = input.weights;
  const dt = input.dt;
  const phase = ((input.phase % 1) + 1) % 1;
  state.time += Math.max(0, dt);
  _fwd.copy(input.forward);
  _fwd.y = 0;
  if (_fwd.lengthSq() < 1e-6) _fwd.set(0, 0, -1);
  _fwd.normalize();
  // Character right. A negative rotation about this axis leans the chest forward.
  _right.crossVectors(_fwd, _up);
  if (_right.lengthSq() < 1e-6) _right.set(1, 0, 0);
  else _right.normalize();

  if (!state.bindRoot) state.bindRoot = bones.root.quaternion.clone();
  bones.root.quaternion.copy(state.bindRoot);
  bones.root.updateMatrixWorld(true);
  if (!state.sole) captureFootAxes(bones, state);

  const moving = Math.max(0, Math.min(1, w.walk + w.run));
  const runShare = moving > 0.001 ? Math.min(1, w.run / moving) : 0;

  bones.root.getWorldPosition(_v);
  bones.pelvis.getWorldPosition(_v2);
  _body.copy(_v2).sub(_v);
  if (_body.lengthSq() < 1e-6) _body.copy(_up);
  else _body.normalize();
  const leanNow = Math.atan2(_body.dot(_fwd), _body.dot(_up));
  const decel = dt > 1e-4 ? Math.max(0, state.prevSpeed - input.speed) / dt : 0;
  state.brake = Math.min(TUNE.stopOvershoot, state.brake * Math.exp(-Math.max(0, dt) / 0.07) + decel * 0.015);
  const overshoot = input.speed < 0.45 ? state.brake : 0;
  const lean = lerp3(w, TUNE.idleLean, TUNE.walkLean, TUNE.runLean) + overshoot;
  rotateWorld(bones.root, _right, leanNow - lean);

  const yawDelta = Math.atan2(Math.sin(input.yaw - state.prevYaw), Math.cos(input.yaw - state.prevYaw));
  const yawRate = dt > 1e-4 ? yawDelta / dt : 0;
  const idleSway = TUNE.idleSway * w.idle * Math.sin((Math.PI * 2 * state.time) / TUNE.idleSwayPeriod);
  const bank = bankAngle(yawRate, input.speed) * Math.min(1, moving + 0.25) + idleSway;
  rotateWorld(bones.root, _fwd, bank);
  bones.root.updateMatrixWorld(true);

  const amp = lerp3(w, TUNE.idleBob, TUNE.walkBob, TUNE.runBob);
  applyBob(bones.pelvis, state, phase, amp, dt);
  bones.pelvis.updateMatrixWorld(true);

  // Straighten after the lean and the bob, so the spine follows the ankles.
  bones.root.getWorldPosition(_v);
  bones.pelvis.getWorldPosition(_v2);
  _body.copy(_v2).sub(_v).normalize();
  bones.head.getWorldPosition(_p);
  _spine.copy(_p).sub(_v2).normalize();
  const hunch = signedAngle(_body, _spine, _right);
  const chest = lerp3(w, TUNE.idleChest, TUNE.walkChest, TUNE.runChest);
  rotateWorld(bones.spines[0], _right, -(hunch - chest));
  bones.spines[0].updateMatrixWorld(true);

  bones.pelvis.getWorldPosition(_v2);
  bones.head.getWorldPosition(_p);
  _spine.copy(_p).sub(_v2).normalize();
  bones.neck.getWorldPosition(_v);
  const neckDir = _down.copy(_p).sub(_v);
  if (neckDir.lengthSq() > 1e-8) {
    neckDir.normalize();
    const crane = signedAngle(_spine, neckDir, _right);
    rotateWorld(bones.neck, _right, -crane * 0.65);
    rotateWorld(bones.head, _right, -crane * 0.35);
  }

  const counter = (TUNE.walkCounter * (1 - runShare) + TUNE.runCounter * runShare) * Math.sin(phase * Math.PI * 2) * moving;
  rotateWorld(bones.pelvis, _up, counter * 0.5);
  rotateWorld(bones.spines[2], _up, -counter);
  const sway = TUNE.walkSway * w.walk + TUNE.runSway * w.run;
  rotateWorld(bones.pelvis, _fwd, sway);
  if (w.idle > 0.45) {
    rotateWorld(bones.spines[1], _right, Math.sin(state.time * TUNE.breathHz * Math.PI * 2) * TUNE.breathAmp * w.idle);
    if (bones.clav[0]) rotateWorld(bones.clav[0], _fwd, deg(6) * w.idle);
    if (bones.clav[1]) rotateWorld(bones.clav[1], _fwd, -deg(6) * w.idle);
  }
  bones.pelvis.updateMatrixWorld(true);

  bones.root.getWorldPosition(_v);
  bones.pelvis.getWorldPosition(_v2);
  _down.copy(_v).sub(_v2).normalize();
  const swingAmp = TUNE.walkSwing * (1 - runShare) + TUNE.runSwing * runShare;
  const elbow = TUNE.idleElbow * w.idle + TUNE.walkElbow * w.walk + TUNE.runElbow * w.run;
  for (let side = 0; side < 2; side++) {
    const s = Math.sin(phase * Math.PI * 2 + side * Math.PI);
    const upperDir = _down.clone().applyAxisAngle(_right, -s * swingAmp * Math.max(moving, w.idle > 0.8 ? 0 : moving));
    if (moving < 0.15) upperDir.copy(_down);
    if (w.idle > 0.5) upperDir.applyAxisAngle(_fwd, (side === 0 ? -1 : 1) * deg(10) * w.idle).normalize();
    const perp = _v3.crossVectors(_right, upperDir).normalize();
    if (perp.dot(_fwd) < 0) perp.negate();
    const fore = upperDir.clone().multiplyScalar(Math.cos(elbow)).addScaledVector(perp, Math.sin(elbow)).normalize();
    pointBone(bones.upper[side], upperDir);
    pointBone(bones.lower[side], fore);
  }
  if (state.curlAxis && w.run > 0.45) {
    _q.setFromAxisAngle(state.curlAxis, 0.5 * w.run);
    for (const f of bones.fingers) f.quaternion.multiply(_q);
  }

  const duty = TUNE.walkDuty * (1 - runShare) + TUNE.runDuty * runShare;
  const rail = TUNE.walkRail * (1 - runShare) + TUNE.runRail * runShare;
  const scale = worldScale(bones.calf[0]);
  const l1 = bones.thigh[0].getWorldPosition(_v).distanceTo(bones.calf[0].getWorldPosition(_v2));
  const l2 = TUNE.calfLen * scale;
  const plan = planGait(input.speed, l1 + l2, w);
  input.holder.getWorldPosition(_holder);
  let footErr = 0;
  let soleDeg = 0;
  let kneeDeg = 0;

  for (let side = 0; side < 2; side++) {
    const foot = bones.foot[side];
    const u = stanceU(phase, side === 0 ? 0 : 0.5, duty);
    const inStance = u >= 0 && moving > 0.4;
    foot.updateMatrixWorld(true);
    foot.getWorldPosition(_clip);
    const lock = state.locks[side];
    if (inStance && !lock.on && !lock.spent) {
      // The clip's in-place stance slides the foot past full extension. Plant
      // on the rail, half a stance-length ahead of the hip, and never past
      // what this leg can reach once the hips bounce up.
      bones.thigh[side].getWorldPosition(_hip);
      const gHip = input.groundAt(_hip.x, _hip.z);
      const vertical = Math.max(0, _hip.y - (gHip.y + TUNE.ankle * scale));
      const sign = _v.copy(_clip).sub(_holder).dot(_right) >= 0 ? 1 : -1;
      const hipLat = _v2.copy(_hip).sub(_holder).dot(_right);
      const lat = Math.abs(sign * rail - hipLat);
      // Stay inside the leg on this frame, and leave room for the hip to rise
      // on the next bounce, so a fast stride toe-offs instead of dragging.
      const live = (l1 + l2) * 0.94;
      const vertNow = Math.min(live - 0.02, vertical);
      const maxNow = Math.sqrt(Math.max(0.0025, live * live - vertNow * vertNow));
      const aheadRoom = Math.sqrt(Math.max(0.0025, maxNow * maxNow - Math.min(lat, maxNow * 0.85) ** 2));
      const reachCap = (l1 + l2) * 0.9;
      const vertBudget = Math.min(Math.max(0, reachCap - 0.02), vertical + amp * 0.5 + 0.01);
      const maxHoriz = Math.sqrt(Math.max(0.0025, reachCap * reachCap - vertBudget * vertBudget));
      const aheadBudget = Math.sqrt(Math.max(0.0025, (maxHoriz * 0.9) ** 2 - Math.min(lat, maxHoriz * 0.85) ** 2));
      const travel = Math.max(0.04, plan.stride * 2 * duty);
      const ahead = Math.min(travel * 0.5, aheadRoom * 0.96, aheadBudget);
      _target.copy(_hip).addScaledVector(_fwd, ahead).addScaledVector(_right, sign * rail - hipLat);
      lock.x = _target.x;
      lock.z = _target.z;
      lock.on = true;
      lock.grip = 1;
    }
    if (lock.on) {
      bones.thigh[side].getWorldPosition(_hip);
      const g = input.groundAt(lock.x, lock.z);
      const reach = Math.hypot(_hip.x - lock.x, _hip.y - (g.y + TUNE.ankle * scale), _hip.z - lock.z);
      // Toe off instead of dragging the sole once the stride is longer than the leg.
      if (reach > (l1 + l2) * 0.98) {
        lock.on = false;
        lock.spent = true;
        state.anchor[side].on = false;
      }
    }
    if (!inStance) {
      lock.on = false;
      lock.spent = false;
      state.anchor[side].on = false;
    }
    // The run clip kicks the heel up by the chest. During the swing, aim the
    // thigh itself: 45° from the torso at mid-swing, then hang the calf.
    let posed = false;
    if (!lock.on && runShare > 0.55 && moving > 0.4) {
      const lift = Math.max(0, Math.sin(phase * Math.PI * 2 + side * Math.PI));
      bones.root.getWorldPosition(_v);
      bones.pelvis.getWorldPosition(_v2);
      const down = _pole.copy(_v).sub(_v2).normalize();
      const thighDir = down.applyAxisAngle(_right, -TUNE.runKnee * lift);
      pointBone(bones.thigh[side], thighDir);
      bones.thigh[side].updateMatrixWorld(true);
      const calfDir = _v3.copy(thighDir).applyAxisAngle(_right, 0.9 + 0.5 * lift);
      pointBone(bones.calf[side], calfDir);
      bones.calf[side].updateMatrixWorld(true);
      bones.calf[side].getWorldPosition(_ankle);
      _ankle.addScaledVector(calfDir, l2);
      if (foot.parent) {
        _p.copy(_ankle);
        foot.parent.worldToLocal(_p);
        foot.position.copy(_p);
      }
      posed = true;
    }
    const gripTarget = lock.on ? 1 : 0;
    lock.grip += (gripTarget - lock.grip) * (1 - Math.exp(-Math.max(0, dt) / 0.035));
    if (!posed && lock.grip > 0.03) {
      const gx = lock.on ? lock.x : _clip.x;
      const gz = lock.on ? lock.z : _clip.z;
      const g = input.groundAt(gx, gz);
      const gn = _v.set(g.nx, g.ny, g.nz);
      if (gn.lengthSq() < 1e-8) gn.set(0, 1, 0);
      gn.normalize();
      if (lock.on) {
        _target.set(lock.x, g.y, lock.z).addScaledVector(gn, TUNE.ankle * scale);
        _ankle.copy(_clip).lerp(_target, Math.min(1, lock.grip));
      } else {
        _ankle.copy(_clip);
      }
      _aim.copy(_ankle);
      solveLeg(bones.thigh[side], bones.calf[side], _aim, _fwd, _right, side === 0 ? -0.22 : 0.22, l1, l2);
      if (foot.parent) {
        _p.copy(_aim);
        foot.parent.worldToLocal(_p);
        foot.position.copy(_p);
        const heel = runShare > 0.55 ? TUNE.runFore : TUNE.walkHeel + (TUNE.walkToe - TUNE.walkHeel) * Math.max(0, u);
        if (state.sole && state.toe) orientFoot(foot, state.sole[side], state.toe[side], gn, _fwd, heel * Math.min(1, lock.grip));
        foot.updateMatrixWorld(true);
        foot.getWorldPosition(_p);
        footErr = Math.max(footErr, _p.distanceTo(_aim));
        if (lock.on && lock.grip > 0.95) {
          const mark = state.anchor[side];
          state.plantFrames++;
          if (!mark.on) { mark.x = _p.x; mark.z = _p.z; mark.on = true; }
          else state.drift = Math.max(state.drift, Math.hypot(_p.x - mark.x, _p.z - mark.z));
        }
        if (state.sole) {
          foot.getWorldQuaternion(_q);
          _v2.copy(state.sole[side]).applyQuaternion(_q).normalize();
          const align = Math.acos(Math.max(-1, Math.min(1, _v2.dot(gn)))) * 180 / Math.PI;
          soleDeg = Math.max(soleDeg, align);
        }
      }
    }
    const thighDir = bones.calf[side].getWorldPosition(_v).sub(bones.thigh[side].getWorldPosition(_v2));
    if (thighDir.lengthSq() > 1e-6) {
      // Positive when the knee lifts forward of the torso, which is the swing.
      const lift = -signedAngle(_down, thighDir.normalize(), _right) * 180 / Math.PI;
      kneeDeg = Math.max(kneeDeg, lift);
    }
  }

  const upperDir = bones.lower[0].getWorldPosition(_v).sub(bones.upper[0].getWorldPosition(_v2)).normalize();
  const foreDir = (bones.hand[0] ? bones.hand[0].getWorldPosition(_p) : bones.lower[0].getWorldPosition(_p).add(upperDir))
    .sub(bones.lower[0].getWorldPosition(_v3)).normalize();
  const elbowDeg = Math.acos(Math.max(-1, Math.min(1, upperDir.dot(foreDir)))) * 180 / Math.PI;

  bones.root.getWorldPosition(_v);
  bones.pelvis.getWorldPosition(_v2);
  _body.copy(_v2).sub(_v).normalize();
  const leanDeg = Math.atan2(_body.dot(_fwd), _body.dot(_up)) * 180 / Math.PI;
  bones.head.getWorldPosition(_p);
  _spine.copy(_p).sub(_v2).normalize();
  // One more pitch pass so shoulder yaw and hip sway do not leave a hunch.
  const hunchLeft = signedAngle(_body, _spine, _right);
  const chestLeft = lerp3(w, TUNE.idleChest, TUNE.walkChest, TUNE.runChest);
  rotateWorld(bones.spines[0], _right, -(hunchLeft - chestLeft) * 0.85);
  bones.spines[0].updateMatrixWorld(true);
  bones.root.getWorldPosition(_v);
  bones.pelvis.getWorldPosition(_v2);
  _body.copy(_v2).sub(_v).normalize();
  bones.head.getWorldPosition(_p);
  _spine.copy(_p).sub(_v2).normalize();
  const spineDeg = Math.abs(signedAngle(_body, _spine, _right)) * 180 / Math.PI;
  bones.neck.getWorldPosition(_v3);
  const headDir = _p.clone().sub(_v3).normalize();
  const headDeg = Math.abs(signedAngle(_spine, headDir, _right)) * 180 / Math.PI;
  const bankDeg = Math.asin(Math.max(-1, Math.min(1, _body.dot(_right)))) * 180 / Math.PI;

  state.prevYaw = input.yaw;
  state.prevSpeed = input.speed;
  state.metrics = {
    leanDeg, spineDeg, headDeg, bob: amp, bankDeg, elbowDeg, kneeDeg,
    footErr, soleDeg, cadence: plan.cadence, stride: plan.stride,
  };
  return state.metrics;
}

/** Remove the high-frequency part of a follow target's vertical motion. */
export function smoothCameraY(camY: number, rootY: number, smoothRoot: number, dt: number) {
  const k = 1 - Math.exp(-Math.max(0, dt) / TUNE.cameraTau);
  const next = smoothRoot + (rootY - smoothRoot) * k;
  return { camY: camY + (next - rootY), smoothRoot: next };
}
