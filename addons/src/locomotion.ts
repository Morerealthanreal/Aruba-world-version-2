// Shared walk cycle for the on-foot player and the pedestrian rigs.
// Clips are Quaternius CC0 motions retargeted onto the MakeHuman skeleton
// (see game/models/locomotion.glb and CREDITS.md). Every visible person has
// their own mixer so they stay out of step; the clip data is loaded once.
import {
  AnimationMixer, LoopRepeat, Euler, Quaternion,
  type AnimationAction, type AnimationClip, type Object3D, type WebGLRenderer,
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

let loading: Promise<LocoClips> | null = null;
const uprightQuat = new Quaternion();
const uprightEuler = new Euler(-0.12, 0, 0, "YXZ"); // slight backward pitch to counteract forward lean
uprightQuat.setFromEuler(uprightEuler);

function clipSpeed(clip: AnimationClip, fallback: number) {
  const speed = (clip.userData as { speed?: number }).speed;
  return typeof speed === "number" && speed > 0.2 ? speed : fallback;
}

/** One shared set of clips. Safe to call from the crowd, the scenario NPCs, and the player. */
export function loadLocomotion(renderer: WebGLRenderer): Promise<LocoClips> {
  loading ||= characterLoader(renderer).loadAsync("./models/locomotion.glb").then((gl) => {
    const clip = (name: string) => {
      const found = gl.animations.find((animation) => animation.name === name);
      if (!found) throw new Error(`locomotion clip ${name} missing`);
      return found;
    };
    const idle = clip("Idle");
    const walk = clip("Walk");
    const run = clip("Run");
    return {
      idle, walk, run,
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
    mixer, idle, walk, run,
    walkMs: clips.walkMs, runMs: clips.runMs,
    weights: { idle: 1, walk: 0, run: 0 },
  };
}

/**
 * Blend idle → walk → run and play the cycle at the speed the feet were
 * captured, so a planted foot stays planted. `speed` is world meters per
 * second. `bodyScale` is the rig's uniform scale.
 */
export function stepLoco(loco: Loco, speed: number, dt: number, bodyScale = 1) {
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
  // Keep the overlapping gaits on the same foot so the blend does not skate.
  if (w.walk > 0.2 && w.run > 0.2) {
    if (w.run >= w.walk) loco.walk.time = (loco.run.time / runDur) * walkDur;
    else loco.run.time = (loco.walk.time / walkDur) * runDur;
  }

  const rate = (natural: number, weight: number) => (
    weight > 0.02 ? Math.max(0.7, Math.min(1.75, scaled / natural)) : 1
  );
  loco.idle.setEffectiveWeight(w.idle);
  loco.walk.setEffectiveWeight(w.walk);
  loco.run.setEffectiveWeight(w.run);
  loco.idle.timeScale = 1;
  loco.walk.timeScale = rate(walkMs, w.walk);
  loco.run.timeScale = rate(runMs, w.run);
  if (dt > 0) loco.mixer.update(dt);
}

/** Turn toward a heading without snapping. Radians. */
export function slewYaw(current: number, target: number, speed: number, dt: number) {
  let delta = target - current;
  delta = Math.atan2(Math.sin(delta), Math.cos(delta));
  const max = (2.2 + Math.max(0, speed) * 1.4) * Math.max(0, dt);
  if (Math.abs(delta) <= max) return target;
  return current + Math.sign(delta) * max;
}

/** Replace the on-foot player's sine overlay with the shared mocap cycle. */
export function attachPlayerLocomotion(g: AGame) {
  const game = g as AGame & { walker?: WalkerRig };
  const arm = (walker: WalkerRig) => {
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
      const baseQuat = root.quaternion.clone();
      let smoothWeight = 0;
      walker.animate = (speed: number, dt: number) => {
        stepLoco(loco, speed, dt, Math.abs(walker.scale.x) || 1);
        // Smooth the upright correction so it blends in/out instead of snapping.
        const target = loco.weights.walk + loco.weights.run;
        const k = 1 - Math.exp(-Math.max(0, dt) * 6);
        smoothWeight += (target - smoothWeight) * k;
        const correction = new Quaternion().copy(uprightQuat).slerp(new Quaternion(), 1 - smoothWeight);
        root.quaternion.copy(baseQuat).multiply(correction);
      };
      walker.userData.awLoco = "on";
    }).catch((error) => {
      console.warn("[aw-loco] player", error);
      delete walker.userData.awLoco;
    });
    return true;
  };
  const tick = () => {
    const walker = game.walker;
    return !!walker && arm(walker);
  };
  if (tick()) return;
  let tries = 0;
  const timer = setInterval(() => {
    if (tick() || ++tries > 40) clearInterval(timer);
  }, 250);
}
