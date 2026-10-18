// Shared walk cycle for the on-foot player and the pedestrian rigs.
// Clips are Quaternius CC0 motions retargeted onto the MakeHuman skeleton
// (see game/models/locomotion.glb and CREDITS.md). Every visible person has
// their own mixer so they stay out of step; the clip data is loaded once.
import {
  AnimationMixer, LoopRepeat, Euler, Quaternion, Vector3,
  type AnimationAction, type AnimationClip, type Object3D, type WebGLRenderer,
} from "three";
import { characterLoader } from "./characters";
import { params, type AGame } from "./env";
import { applyPosture, collectBones, createPostureState, smoothCameraY } from "./posture/apply";
import { blendPerSec, cycleScale, planGait } from "./posture/gait";
import { TUNE } from "./posture/tune";

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
export function stepLoco(
  loco: Loco,
  speed: number,
  dt: number,
  bodyScale = 1,
  blendPerSec = 8,
  bands?: { idleCut: number; walkAt: number; runAt: number },
) {
  const scaled = Math.max(0, speed) / Math.max(0.5, bodyScale);
  const idleCut = bands?.idleCut ?? 0.18;
  const walkAt = bands?.walkAt ?? loco.walkMs;
  const runAt = bands?.runAt ?? loco.runMs;
  let idle = 0;
  let walk = 0;
  let run = 0;
  if (scaled < idleCut) idle = 1;
  else if (scaled < walkAt) {
    const u = (scaled - idleCut) / (walkAt - idleCut);
    idle = 1 - u;
    walk = u;
  } else if (scaled < runAt) {
    const u = (scaled - walkAt) / Math.max(0.001, runAt - walkAt);
    walk = 1 - u;
    run = u;
  } else run = 1;

  const k = 1 - Math.exp(-Math.max(0, dt) * blendPerSec);
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
  loco.walk.timeScale = rate(loco.walkMs, w.walk);
  loco.run.timeScale = rate(loco.runMs, w.run);
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

      // Bone-level corrections for a natural upright posture: chest gently up,
      // shoulders relaxed back, neck/head level. Applied after every mixer update
      // at full weight (idle included). Idle, walk and run each have their own set
      // (the run clip leans much further forward), blended by gait weight, so the residual lean stays under ~3 deg.
      // Values are local X pitch in radians (negative = back, measured in world
      // space against the clips) and local Z roll for the clavicles. Only bones the
      // clips drive every frame are touched, so the multiply never accumulates.
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
      console.info("[aw-loco] upright bones:", corrected.map((c) => c.bone.name).join(","));

      const fortnite = params.get("fnposture") === "1";
      const bones = fortnite ? collectBones(root) : null;
      const posture = bones ? createPostureState() : null;
      const fwd = new Vector3();
      const yawQuat = new Quaternion();
      const yawEuler = new Euler();
      const bands = { idleCut: TUNE.idleCut, walkAt: TUNE.walkAt, runAt: TUNE.runAt };
      if (fortnite && !bones) console.info("[aw-loco] fortnite posture missing bones, using the stock corrections");

      walker.animate = (speed: number, dt: number) => {
        if (bones && posture) {
          stepLoco(
            loco, speed, dt, Math.abs(walker.scale.x) || 1,
            blendPerSec(speed, posture.prevSpeed),
            bands,
          );
          const plan = planGait(Math.max(0, speed), bones.leg, loco.weights);
          loco.walk.timeScale = cycleScale(plan.cadence, loco.walk.getClip().duration || 1);
          loco.run.timeScale = cycleScale(plan.cadence, loco.run.getClip().duration || 1);
          const clip = loco.weights.run >= loco.weights.walk ? loco.run : loco.walk;
          const dur = clip.getClip().duration || 1;
          walker.getWorldDirection(fwd);
          yawEuler.setFromQuaternion(walker.getWorldQuaternion(yawQuat), "YXZ");
          const yaw = yawEuler.y;
          const real = g.real as { surfaceAt?: (x: number, z: number) => number; heightAt?: (x: number, z: number) => number } | null;
          applyPosture(bones, posture, {
            dt, speed, yaw, phase: clip.time / dur, weights: loco.weights, holder: walker, forward: fwd,
            groundAt: (x, z) => groundUnder(real, walker.position.y, x, z),
          });
          walker.userData.fnMetrics = posture.metrics;
          return;
        }
        stepLoco(loco, speed, dt, Math.abs(walker.scale.x) || 1);
        const w = loco.weights;
        const moving = Math.max(0, Math.min(1, w.walk + w.run));
        const runShare = moving > 0.001 ? Math.min(1, w.run / moving) : 0;
        for (let i = 0; i < corrected.length; i++) {
          const { bone, idle, walk, run } = corrected[i];
          tempGait.copy(walk).slerp(run, runShare);
          tempQuat.copy(idle).slerp(tempGait, moving);
          bone.quaternion.multiply(tempQuat);
        }
      };
      if (bones && posture) mountSteadyCamera(g, walker);
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

function groundUnder(
  real: { surfaceAt?: (x: number, z: number) => number; heightAt?: (x: number, z: number) => number } | null,
  fallbackY: number,
  x: number,
  z: number,
) {
  const sample = (px: number, pz: number) => real?.surfaceAt?.(px, pz) ?? real?.heightAt?.(px, pz) ?? fallbackY;
  const y = sample(x, z);
  const e = 0.45;
  const nx = (y - sample(x + e, z)) / e;
  const nz = (y - sample(x, z + e)) / e;
  const len = Math.hypot(nx, 1, nz) || 1;
  return { y, nx: nx / len, ny: 1 / len, nz: nz / len };
}

/** Third-person follow keeps the player's offset but drops the step bob. */
function mountSteadyCamera(g: AGame, walker: Object3D) {
  const cam = g.camera;
  let smooth = walker.position.y;
  let last = performance.now();
  const loop = (now: number) => {
    if (walker.userData.awLoco !== "on") return;
    const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
    last = now;
    const rootY = walker.position.y;
    const next = smoothCameraY(cam.position.y, rootY, smooth, dt);
    cam.position.y = next.camY;
    smooth = next.smoothRoot;
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}
