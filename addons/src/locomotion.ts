// Shared walk cycle for the on-foot player and the pedestrian rigs.
// Clips are Quaternius CC0 motions retargeted onto the MakeHuman skeleton
// (see game/models/locomotion.glb and CREDITS.md). Every visible person has
// their own mixer so they stay out of step; the clip data is loaded once.
import {
  AnimationMixer,
  LoopRepeat,
  Euler,
  Quaternion,
  MathUtils,
  Raycaster,
  Vector3,
  type AnimationAction,
  type AnimationClip,
  type Object3D,
  type WebGLRenderer,
  type Intersection,
} from "three";
import { characterLoader } from "./characters";
import type { AGame } from "./env";

export type LocoClips = {
  idle: AnimationClip;
  walk: AnimationClip;
  run: AnimationClip;
  /** Planted-foot speed of each cycle at timeScale 1, meters per second, scale 1. */
  walkMs: number;
  runMs: number;
};

export type Loco = {
  mixer: AnimationMixer;
  idle: AnimationAction;
  walk: AnimationAction;
  run: AnimationAction;
  walkMs: number;
  runMs: number;
  weights: { idle: number; walk: number; run: number };
};

type WalkerRig = Object3D & {
  animate?: (speed: number, dt: number) => void;
  userData: { awLoco?: string };
};

type Leg = {
  thigh: Object3D;
  calf: Object3D;
  foot: Object3D;
  thighLen: number;
  calfLen: number;
  side: number;
};

let loading: Promise<LocoClips> | null = null;

function clipSpeed(clip: AnimationClip, fallback: number): number {
  const speed = (clip.userData as { speed?: number }).speed;
  return typeof speed === "number" && speed > 0.2 ? speed : fallback;
}

/** One shared set of clips. Safe to call from the crowd, the scenario NPCs, and the player. */
export function loadLocomotion(renderer: WebGLRenderer): Promise<LocoClips> {
  loading ||= characterLoader(renderer).loadAsync("./models/locomotion.glb").then((gl) => {
    const clip = (name: string): AnimationClip => {
      const found = gl.animations.find((animation) => animation.name === name);
      if (!found) throw new Error(`locomotion clip ${name} missing`);
      return found;
    };
    const idle = clip("Idle");
    const walk = clip("Walk");
    const run = clip("Run");
    return {
      idle,
      walk,
      run,
      walkMs: clipSpeed(walk, 1.05),
      runMs: clipSpeed(run, 5.6),
    };
  });
  return loading;
}

export function createLoco(root: Object3D, clips: LocoClips, phase = 0): Loco {
  const mixer = new AnimationMixer(root);
  const idle = mixer.clipAction(clips.idle);
  const walk = mixer.clipAction(clips.walk);
  const run = mixer.clipAction(clips.run);
  const start = ((phase % 1) + 1) % 1;
  for (const action of [idle, walk, run]) {
    action.setLoop(LoopRepeat, Infinity);
    action.enabled = true;
    action.play();
    action.setEffectiveWeight(0);
  }
  idle.setEffectiveWeight(1);
  idle.time = start * clips.idle.duration;
  walk.time = start * clips.walk.duration;
  run.time = start * clips.run.duration;
  return {
    mixer,
    idle,
    walk,
    run,
    walkMs: clips.walkMs,
    runMs: clips.runMs,
    weights: { idle: 1, walk: 0, run: 0 },
  };
}

/**
 * Blend idle → walk → run and play the cycle at the speed the feet were
 * captured, so a planted foot stays planted. `speed` is world meters per
 * second. `bodyScale` is the rig's uniform scale.
 */
export function stepLoco(loco: Loco, speed: number, dt: number, bodyScale = 1): void {
  const scaled = Math.max(0, speed) / Math.max(0.5, bodyScale);
  const { walkMs, runMs } = loco;
  let idle = 0;
  let walk = 0;
  let run = 0;
  if (scaled < 0.18) idle = 1;
  else if (scaled < walkMs) {
    const u = (scaled - 0.18) / (walkMs - 0.18);
    idle = 1 - u;
    walk = u;
  } else if (scaled < runMs) {
    const u = (scaled - walkMs) / Math.max(0.001, runMs - walkMs);
    walk = 1 - u;
    run = u;
  } else run = 1;

  const k = 1 - Math.exp(-Math.max(0, dt) * 8);
  const w = loco.weights;
  w.idle += (idle - w.idle) * k;
  w.walk += (walk - w.walk) * k;
  w.run += (run - w.run) * k;
  const sum = w.idle + w.walk + w.run || 1;
  w.idle /= sum;
  w.walk /= sum;
  w.run /= sum;

  const walkDur = loco.walk.getClip().duration || 1;
  const runDur = loco.run.getClip().duration || 1;
  if (w.walk > 0.2 && w.run > 0.2) {
    if (w.run >= w.walk) loco.walk.time = (loco.run.time / runDur) * walkDur;
    else loco.run.time = (loco.walk.time / walkDur) * runDur;
  }

  const rate = (natural: number, weight: number): number =>
    weight > 0.02 ? Math.max(0.55, Math.min(2.2, scaled / natural)) : 1;
  loco.idle.setEffectiveWeight(w.idle);
  loco.walk.setEffectiveWeight(w.walk);
  loco.run.setEffectiveWeight(w.run);
  loco.idle.timeScale = 1;
  loco.walk.timeScale = rate(walkMs, w.walk);
  loco.run.timeScale = rate(runMs, w.run);
  if (dt > 0) loco.mixer.update(dt);
}

/** Turn toward a heading without snapping. Radians. */
export function slewYaw(current: number, target: number, speed: number, dt: number): number {
  let delta = target - current;
  delta = Math.atan2(Math.sin(delta), Math.cos(delta));
  const max = (2.2 + Math.max(0, speed) * 1.4) * Math.max(0, dt);
  if (Math.abs(delta) <= max) return target;
  return current + Math.sign(delta) * max;
}

// Preallocated temporaries for two-bone IK (never allocated inside the hot path)
const ikThighPos = new Vector3();
const ikCalfPos = new Vector3();
const ikFootPos = new Vector3();
const ikTarget = new Vector3();
const ikPole = new Vector3();
const ikToTarget = new Vector3();
const ikToPole = new Vector3();
const ikAxis = new Vector3();
const ikQuat = new Quaternion();
const ikTempQuat = new Quaternion();
const ikEuler = new Euler(0, 0, 0, "XYZ");
const ikDown = new Vector3(0, -1, 0);
const ikDir = new Vector3();

/**
 * Analytic two-bone IK. Solves thigh and calf so the foot reaches `target`
 * with the knee bent toward `pole`. All vectors/quaternions are reused.
 * Lengths are measured once at bind time. Operates in world space then
 * converts the resulting orientations back to local bone quaternions.
 */
function twoBoneIK(leg: Leg, target: Vector3, pole: Vector3): void {
  leg.thigh.getWorldPosition(ikThighPos);
  leg.calf.getWorldPosition(ikCalfPos);
  leg.foot.getWorldPosition(ikFootPos);

  const thighLen = leg.thighLen;
  const calfLen = leg.calfLen;
  const maxReach = thighLen + calfLen - 0.001;
  const minReach = Math.abs(thighLen - calfLen) + 0.001;

  ikToTarget.copy(target).sub(ikThighPos);
  let dist = ikToTarget.length();
  if (dist < 0.0001) return;
  dist = MathUtils.clamp(dist, minReach, maxReach);
  ikToTarget.normalize().multiplyScalar(dist);

  // Law of cosines for knee angle
  const cosKnee = (thighLen * thighLen + calfLen * calfLen - dist * dist) / (2 * thighLen * calfLen);
  const kneeAngle = Math.acos(MathUtils.clamp(cosKnee, -1, 1));

  // Desired calf direction after knee bend
  ikToPole.copy(pole).sub(ikThighPos).normalize();
  ikAxis.crossVectors(ikToTarget, ikToPole).normalize();
  if (ikAxis.lengthSq() < 0.0001) ikAxis.set(0, 0, 1);

  // Thigh orientation: point toward target, then roll so knee faces pole
  ikQuat.setFromUnitVectors(ikDown, ikDir.copy(ikToTarget).normalize());
  // (setFromUnitVectors allocates internally on some builds; we accept it once
  // per solve because the alternative is a full matrix construction. The
  // remaining work reuses the module-level quats.)
  const kneeOffset = Math.PI - kneeAngle;
  ikTempQuat.setFromAxisAngle(ikAxis, kneeOffset * 0.5);
  ikQuat.multiply(ikTempQuat);

  // Convert world orientation to local for thigh
  const parent = leg.thigh.parent;
  if (parent) {
    parent.getWorldQuaternion(ikTempQuat);
    ikTempQuat.invert();
    leg.thigh.quaternion.copy(ikTempQuat).multiply(ikQuat);
  } else {
    leg.thigh.quaternion.copy(ikQuat);
  }

  // Calf local rotation is a pure bend around its local X
  ikEuler.set(kneeOffset, 0, 0);
  leg.calf.quaternion.setFromEuler(ikEuler);
}

/** Replace the on-foot player's sine overlay with the shared mocap cycle. */
export function attachPlayerLocomotion(g: AGame): void {
  const game = g as AGame & { walker?: WalkerRig };
  const arm = (walker: WalkerRig): boolean => {
    if (walker.userData.awLoco) return walker.userData.awLoco === "on" || walker.userData.awLoco === "pending";
    let boned = false;
    walker.traverse((object) => {
      if (object.name === "thigh_l") boned = true;
    });
    if (!boned || typeof walker.animate !== "function") return false;
    walker.userData.awLoco = "pending";
    void loadLocomotion(g.renderer).then((clips) => {
      const root = walker.children[0] ?? walker;
      const loco = createLoco(root, clips, 0);

      // [name, idle pitch, walk pitch, run pitch, roll]
      const POSTURE: [string, number, number, number, number][] = [
        ["spine_01", -0.04, -0.04, -0.16, 0],
        ["spine_02", -0.09, -0.12, -0.24, 0],
        ["spine_03", -0.126, -0.142, -0.323, 0],
        ["neck_01", -0.037, -0.053, 0.05, 0],
        ["head", 0.034, 0.061, 0.21, 0],
        ["clavicle_l", 0, 0, 0, 0.08],
        ["clavicle_r", 0, 0, 0, -0.08],
      ];
      type Corrected = { bone: Object3D; idle: Quaternion; walk: Quaternion; run: Quaternion };
      const corrected: Corrected[] = [];
      const tempQuat = new Quaternion();
      const tempGait = new Quaternion();
      const tracks = [clips.idle, clips.walk, clips.run];
      const euler = new Euler(0, 0, 0, "YXZ");
      root.traverse((object) => {
        if (!(object as any).isBone) return;
        const entry = POSTURE.find((e) => e[0] === object.name);
        if (!entry) return;
        const driven = tracks.some((c: any) => c.tracks.some((t: any) => t.name === object.name + ".quaternion"));
        if (!driven) return;
        corrected.push({
          bone: object,
          idle: new Quaternion().setFromEuler(euler.set(entry[1], 0, entry[4], "YXZ")),
          walk: new Quaternion().setFromEuler(euler.set(entry[2], 0, entry[4], "YXZ")),
          run: new Quaternion().setFromEuler(euler.set(entry[3], 0, entry[4], "YXZ")),
        });
      });
      const leanQuat = new Quaternion();
      const leanEuler = new Euler(0, 0, 0, "YXZ");

      // Preallocated once — never new'd inside animate
      const raycaster = new Raycaster();
      const down = new Vector3(0, -1, 0);
      const footOrigin = new Vector3();
      const targetPos = new Vector3();
      const pole = new Vector3();
      const intersects: Intersection[] = [];
      const legs: Leg[] = [];
      let hips: Object3D | null = null;
      const groundMeshes: Object3D[] = [];

      root.traverse((object) => {
        if (!(object as any).isBone) return;
        const n = object.name.toLowerCase();
        if (n === "thigh_l" || n === "thigh_r") {
          const side = n.includes("_l") || n.includes("left") ? -1 : 1;
          const calf = object.children.find((c) => c.name.toLowerCase().includes("calf"));
          const foot = calf?.children.find((c) => c.name.toLowerCase().includes("foot"));
          if (calf && foot) {
            const thighLen = object.position.distanceTo(calf.position) || 0.4;
            const calfLen = calf.position.distanceTo(foot.position) || 0.4;
            legs.push({ thigh: object, calf, foot, thighLen, calfLen, side });
          }
        }
        if (n.includes("hip") || n === "pelvis" || n === "hips") hips = object;
      });

      // Cache ground/terrain/stair meshes once
      const scene = (g as any).scene || root.parent;
      if (scene) {
        scene.traverse((obj: Object3D) => {
          const name = (obj.name || "").toLowerCase();
          if (
            obj.type === "Mesh" &&
            (name.includes("terrain") ||
              name.includes("ground") ||
              name.includes("stair") ||
              name.includes("hooiberg") ||
              name.includes("floor"))
          ) {
            groundMeshes.push(obj);
          }
        });
      }

      console.info("[aw-loco] legs:", legs.length, "ground meshes:", groundMeshes.length);
      let smoothWeight = 0;
      let prevYaw = root.rotation.y;
      let turnLean = 0;

      walker.animate = (speed: number, dt: number): void => {
        stepLoco(loco, speed, dt, Math.abs(walker.scale.x) || 1);
        const scaled = Math.max(0, speed) / Math.max(0.5, Math.abs(walker.scale.x) || 1);
        const w = loco.weights;
        const natural = w.walk * loco.walkMs + w.run * loco.runMs || 1;
        const rate = Math.max(0.5, Math.min(2.4, scaled / natural));
        if (w.walk > 0.02) loco.walk.timeScale = rate;
        if (w.run > 0.02) loco.run.timeScale = rate;

        const target = w.walk + w.run;
        const k = 1 - Math.exp(-Math.max(0, dt) * 6);
        smoothWeight += (target - smoothWeight) * k;

        const curYaw = root.rotation.y;
        const yawDelta = MathUtils.euclideanModulo(curYaw - prevYaw + Math.PI, Math.PI * 2) - Math.PI;
        const turnRate = dt > 0 ? yawDelta / dt : 0;
        prevYaw = curYaw;
        const leanTarget = MathUtils.clamp(turnRate * 0.12, -0.07, 0.07);
        turnLean += (leanTarget - turnLean) * (1 - Math.exp(-dt * 10));
        if (Math.abs(turnLean) > 0.001) {
          leanEuler.set(0, 0, turnLean, "YXZ");
          leanQuat.setFromEuler(leanEuler);
          for (let i = 0; i < corrected.length; i++) {
            const c = corrected[i];
            if (c.bone.name.toLowerCase().includes("spine")) {
              c.bone.quaternion.multiply(leanQuat);
            }
          }
        }

        {
          const moving = Math.max(0, Math.min(1, w.walk + w.run));
          const runShare = moving > 0.001 ? Math.min(1, w.run / moving) : 0;
          for (let i = 0; i < corrected.length; i++) {
            const c = corrected[i];
            tempGait.copy(c.walk).slerp(c.run, runShare);
            tempQuat.copy(c.idle).slerp(tempGait, moving);
            c.bone.quaternion.multiply(tempQuat);
          }
        }

        // Foot IK — raycast only against the cached ground list, reused intersects array
        if (hips && legs.length && groundMeshes.length) {
          let maxLift = 0;
          for (let f = 0; f < legs.length; f++) {
            const leg = legs[f];
            leg.foot.getWorldPosition(footOrigin);
            footOrigin.y += 0.6;
            raycaster.set(footOrigin, down);
            raycaster.far = 1.6;
            intersects.length = 0;
            raycaster.intersectObjects(groundMeshes, false, intersects);
            if (intersects.length > 0) {
              const hit = intersects[0];
              const groundY = hit.point.y;
              const footY = footOrigin.y - 0.6;
              const lift = Math.max(0, groundY - footY + 0.02);
              if (lift > maxLift) maxLift = lift;

              targetPos.copy(hit.point);
              targetPos.y += 0.015;
              pole.set(0, 0.2, leg.side * 0.4);
              pole.applyQuaternion(root.quaternion);
              twoBoneIK(leg, targetPos, pole);
            }
          }
          if (maxLift > 0.001) {
            hips.position.y += maxLift;
          }
        }
      };
      walker.userData.awLoco = "on";
    }).catch((error) => {
      console.warn("[aw-loco] player", error);
      delete walker.userData.awLoco;
    });
    return true;
  };
  const tick = (): boolean => {
    const walker = game.walker;
    return !!walker && arm(walker);
  };
  if (tick()) return;
  let tries = 0;
  const timer = setInterval(() => {
    if (tick() || ++tries > 40) clearInterval(timer);
  }, 250);
}
