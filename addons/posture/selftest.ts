// Numeric self-test for the Fortnite posture layer. No browser, no GPU.
// Run: node --experimental-strip-types posture/selftest.ts
import fs from "node:fs";
import {
  AnimationClip, AnimationMixer, Bone, BufferGeometry, Group, LoopRepeat,
  MeshBasicMaterial, Object3D, QuaternionKeyframeTrack, Skeleton, SkinnedMesh,
  Vector3, VectorKeyframeTrack,
} from "three";
import { applyPosture, collectBones, createPostureState, smoothCameraY, type PostureBones } from "../src/posture/apply.ts";
import { blendPerSec, cycleScale, planGait } from "../src/posture/gait.ts";
import { TUNE } from "../src/posture/tune.ts";

type GLB = { json: any; bin: Buffer };

function loadGlb(path: string): GLB {
  const buf = fs.readFileSync(path);
  const jsonLen = buf.readUInt32LE(12);
  const json = JSON.parse(buf.subarray(20, 20 + jsonLen).toString("utf8"));
  const binOff = 20 + jsonLen;
  const binLen = buf.readUInt32LE(binOff);
  return { json, bin: buf.subarray(binOff + 8, binOff + 8 + binLen) };
}

function accessor(glb: GLB, index: number): number[] {
  const acc = glb.json.accessors[index];
  const view = glb.json.bufferViews[acc.bufferView];
  const start = (view.byteOffset ?? 0) + (acc.byteOffset ?? 0);
  const n = acc.type === "SCALAR" ? 1 : acc.type === "VEC3" ? 3 : 4;
  const stride = view.byteStride ?? n * 4;
  if (acc.componentType !== 5126) throw new Error(`accessor ${index} is not float`);
  const out: number[] = [];
  for (let i = 0; i < acc.count; i++) {
    for (let k = 0; k < n; k++) out.push(glb.bin.readFloatLE(start + i * stride + k * 4));
  }
  return out;
}

function buildRig() {
  const player = loadGlb(new URL("../../game/models/player_sam.glb", import.meta.url));
  const loco = loadGlb(new URL("../../game/models/locomotion.glb", import.meta.url));
  const nodes = player.json.nodes as { name?: string; translation?: number[]; rotation?: number[]; scale?: number[]; children?: number[] }[];
  const skin = player.json.skins[0];
  const jointSet = new Set<number>(skin.joints);
  const objects: Object3D[] = nodes.map((node, i) => {
    const o = jointSet.has(i) ? new Bone() : new Object3D();
    o.name = node.name ?? "";
    if (node.translation) o.position.fromArray(node.translation);
    if (node.rotation) o.quaternion.fromArray(node.rotation);
    if (node.scale) o.scale.fromArray(node.scale);
    return o;
  });
  nodes.forEach((node, i) => {
    for (const c of node.children ?? []) objects[i].add(objects[c]);
  });
  const rigIndex = nodes.findIndex((n) => (n.name ?? "").includes("anatomical body.rig"));
  const rig = objects[rigIndex];
  const mesh = new SkinnedMesh(new BufferGeometry(), new MeshBasicMaterial());
  mesh.name = rig.name;
  mesh.position.copy(rig.position);
  mesh.quaternion.copy(rig.quaternion);
  mesh.scale.copy(rig.scale);
  while (rig.children.length) mesh.add(rig.children[0]);
  rig.parent?.add(mesh);
  rig.parent?.remove(rig);
  const scene = objects[player.json.scenes[0].nodes[0]];
  scene.updateMatrixWorld(true);
  const joints = (skin.joints as number[]).map((i) => objects[i] as Bone);
  mesh.bind(new Skeleton(joints));
  // Same yaw the game applies after the skeleton is bound.
  scene.rotation.y = Math.PI;
  const holder = new Group();
  holder.name = "walker";
  holder.add(scene);
  holder.updateMatrixWorld(true);

  const clips = (loco.json.animations as { name: string; channels: any[]; samplers: any[] }[]).map((anim) => {
    const tracks = anim.channels.map((ch) => {
      const name = loco.json.nodes[ch.target.node].name as string;
      const samp = anim.samplers[ch.sampler];
      const times = accessor(loco, samp.input);
      const values = accessor(loco, samp.output);
      if (ch.target.path === "translation") return new VectorKeyframeTrack(`${name}.position`, times, values);
      return new QuaternionKeyframeTrack(`${name}.quaternion`, times, values);
    });
    return new AnimationClip(anim.name, undefined, tracks);
  });
  const mixer = new AnimationMixer(scene);
  const clip = (name: string) => {
    const found = clips.find((c) => c.name === name);
    if (!found) throw new Error(name);
    const action = mixer.clipAction(found);
    action.setLoop(LoopRepeat, Infinity);
    action.play();
    action.setEffectiveWeight(name === "Idle" ? 1 : 0);
    return action;
  };
  const idle = clip("Idle");
  const walk = clip("Walk");
  const run = clip("Run");
  const bones = collectBones(scene);
  if (!bones) throw new Error("bones missing");
  if (bones.foot[0].parent !== mesh) throw new Error(`foot parent is ${bones.foot[0].parent?.name}, expected the rig`);
  if (bones.foot[0].parent === bones.calf[0]) throw new Error("foot is parented to the calf; IK would use the wrong space");
  return { holder, mixer, idle, walk, run, bones };
}

type W = { idle: number; walk: number; run: number };

const flat = (y = 0) => (_x: number, _z: number) => ({ y, nx: 0, ny: 1, nz: 0 });

function simulate(
  rig: ReturnType<typeof buildRig>,
  bones: PostureBones,
  opts: { seconds: number; speed: number; weights: W; yawRate?: number; ground?: (x: number, z: number) => { y: number; nx: number; ny: number; nz: number }; action: "walk" | "run" | "idle" },
) {
  const state = createPostureState();
  const { holder, mixer, idle, walk, run } = rig;
  const action = opts.action === "run" ? run : opts.action === "walk" ? walk : idle;
  const plan = planGait(opts.speed, bones.leg, opts.weights);
  action.timeScale = opts.action === "idle" ? 1 : cycleScale(plan.cadence, action.getClip().duration || 1);
  idle.setEffectiveWeight(opts.weights.idle);
  walk.setEffectiveWeight(opts.weights.walk);
  run.setEffectiveWeight(opts.weights.run);
  const dt = 1 / 60;
  const fwd = new Vector3();
  const samples: ReturnType<typeof state.metrics> extends never ? never : any[] = [];
  const plants = [plant(), plant()];
  let yaw = 0;
  let moved = 0;
  for (let t = 0; t < opts.seconds; t += dt) {
    yaw += (opts.yawRate ?? 0) * dt;
    holder.rotation.y = yaw;
    holder.getWorldDirection(fwd);
    holder.position.addScaledVector(fwd, opts.speed * dt);
    moved += opts.speed * dt;
    mixer.update(dt);
    const phase = ((action.time % (action.getClip().duration || 1)) + (action.getClip().duration || 1)) % (action.getClip().duration || 1) / (action.getClip().duration || 1);
    const metrics = applyPosture(bones, state, {
      dt, speed: opts.speed, yaw, phase, weights: opts.weights, holder, forward: fwd,
      groundAt: opts.ground ?? flat(0),
    });
    if (t > 1.1) {
      samples.push({ ...metrics, t });
      for (let s = 0; s < 2; s++) {
        bones.foot[s].getWorldPosition(footPos[s]);
        const low = footPos[s].y < 0.2;
        const p = plants[s];
        if (low && opts.speed > 0.4) {
          p.age += dt;
          if (!p.marked && p.age > 0.14) {
            p.x = footPos[s].x; p.z = footPos[s].z; p.marked = true;
          } else if (p.marked) {
            p.drift = Math.max(p.drift, Math.hypot(footPos[s].x - p.x, footPos[s].z - p.z));
          }
        } else {
          p.age = 0; p.marked = false;
        }
      }
    }
  }
  return { samples, plants, moved, plan, drift: state.drift, plantFrames: state.plantFrames };
}

function plant() { return { age: 0, marked: false, x: 0, z: 0, drift: 0 }; }
const footPos = [new Vector3(), new Vector3()];

function avg(xs: number[]) { return xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length); }
function span(xs: number[]) { return Math.max(...xs) - Math.min(...xs); }

const fails: string[] = [];
const notes: string[] = [];
function check(name: string, ok: boolean, detail: string) {
  notes.push(`${ok ? "PASS" : "FAIL"}  ${name}  ${detail}`);
  if (!ok) fails.push(`${name}: ${detail}`);
}

const rig = buildRig();
const leg = rig.bones.leg;
notes.push(`leg length ${leg.toFixed(3)} m, foot parent "${rig.bones.foot[0].parent?.name}"`);

const walkSpeed = TUNE.walkCadence * TUNE.walkStride * leg;
const runSpeed = TUNE.runCadence * TUNE.runStride * leg;
const walkW: W = { idle: 0, walk: 1, run: 0 };
const runW: W = { idle: 0, walk: 0, run: 1 };
const idleW: W = { idle: 1, walk: 0, run: 0 };

const walked = simulate(rig, rig.bones, { seconds: 3.2, speed: walkSpeed, weights: walkW, action: "walk" });
const ran = simulate(rig, rig.bones, { seconds: 3.2, speed: runSpeed, weights: runW, action: "run" });
const idled = simulate(rig, rig.bones, { seconds: 3.4, speed: 0, weights: idleW, action: "idle" });
const banked = simulate(rig, rig.bones, { seconds: 2.2, speed: runSpeed, weights: runW, action: "run", yawRate: TUNE.bankYawRate });
const slope = Math.tan(15 * Math.PI / 180);
const sloped = simulate(rig, rig.bones, {
  seconds: 2.4, speed: walkSpeed, weights: walkW, action: "walk",
  ground: (x) => {
    const y = x * slope;
    const nx = -slope, ny = 1, nz = 0;
    const len = Math.hypot(nx, ny, nz);
    return { y, nx: nx / len, ny: ny / len, nz: nz / len };
  },
});

const walkLean = avg(walked.samples.map((s) => s.leanDeg));
const runLean = avg(ran.samples.map((s) => s.leanDeg));
const idleLean = avg(idled.samples.map((s) => Math.abs(s.leanDeg)));
const runSpine = avg(ran.samples.map((s) => s.spineDeg));
const runHead = avg(ran.samples.map((s) => s.headDeg));
const walkElbow = avg(walked.samples.map((s) => s.elbowDeg));
const runElbow = avg(ran.samples.map((s) => s.elbowDeg));
const runKnee = Math.max(...ran.samples.map((s) => s.kneeDeg));
const walkFoot = walked.drift;
const runFoot = ran.drift;
const walkErr = Math.max(...walked.samples.map((s) => s.footErr));
const runErr = Math.max(...ran.samples.map((s) => s.footErr));
const slopeSole = Math.max(...sloped.samples.map((s) => s.soleDeg));
const idleSway = span(idled.samples.map((s) => s.bankDeg));
const bankAbs = avg(banked.samples.map((s) => Math.abs(s.bankDeg)));

check("walk lean 0-2 deg", walkLean >= 0 && walkLean <= 2.4, `${walkLean.toFixed(2)} deg`);
check("run lean 10-12 deg from the ankles", runLean >= 9.5 && runLean <= 12.5, `${runLean.toFixed(2)} deg`);
check("idle upright", idleLean < 2, `${idleLean.toFixed(2)} deg`);
check("run spine stays straight", runSpine < 6, `${runSpine.toFixed(2)} deg off the body axis`);
check("run head does not crane", runHead < 8, `${runHead.toFixed(2)} deg off the spine`);
check("walk elbow soft", walkElbow > 12 && walkElbow < 35, `${walkElbow.toFixed(1)} deg`);
check("run elbow about 90 deg", runElbow > 75 && runElbow < 105, `${runElbow.toFixed(1)} deg`);
check("run knee lift reaches about 45 deg", runKnee > 38 && runKnee < 70, `peak ${runKnee.toFixed(1)} deg`);
check("walk cadence nominal", Math.abs(walked.plan.cadence - TUNE.walkCadence) < 0.05, `${walked.plan.cadence.toFixed(2)} steps/s at ${walkSpeed.toFixed(2)} m/s`);
check("run cadence nominal", Math.abs(ran.plan.cadence - TUNE.runCadence) < 0.05, `${ran.plan.cadence.toFixed(2)} steps/s at ${runSpeed.toFixed(2)} m/s`);
check("walk stride 0.8 leg", Math.abs(walked.plan.stride - TUNE.walkStride * leg) < 0.02, `${walked.plan.stride.toFixed(3)} m`);
check("run stride 1.1 leg", Math.abs(ran.plan.stride - TUNE.runStride * leg) < 0.02, `${ran.plan.stride.toFixed(3)} m`);
check("walk planted foot does not slide", walked.plantFrames > 8 && walkFoot < 0.025, `${(walkFoot * 100).toFixed(1)} cm over ${walked.plantFrames} frames`);
check("run planted foot does not slide", ran.plantFrames > 8 && runFoot < 0.025, `${(runFoot * 100).toFixed(1)} cm over ${ran.plantFrames} frames`);
check("foot IK hits the ankle in rig space", walkErr < 0.015 && runErr < 0.015, `walk err ${(walkErr * 100).toFixed(2)} cm, run err ${(runErr * 100).toFixed(2)} cm`);
check("slope sole matches the ground", slopeSole < 8 && slopeSole >= 0, `${slopeSole.toFixed(1)} deg off the normal`);
check("idle weight shift", idleSway > 1.2, `${idleSway.toFixed(2)} deg of side-to-side`);
check("bank 5-10 deg at full turn rate", bankAbs >= 4.5 && bankAbs <= 12, `${bankAbs.toFixed(2)} deg`);

// Bob: pelvis world Y over a settled window.
function bobOf(which: "walk" | "run") {
  const built = buildRig();
  const speed = which === "walk" ? walkSpeed : runSpeed;
  const weights = which === "walk" ? walkW : runW;
  const state = createPostureState();
  const action = which === "walk" ? built.walk : built.run;
  action.setEffectiveWeight(1);
  (which === "walk" ? built.idle : built.walk).setEffectiveWeight(0);
  built.idle.setEffectiveWeight(which === "walk" ? 0 : 0);
  const plan = planGait(speed, built.bones.leg, weights);
  action.timeScale = cycleScale(plan.cadence, action.getClip().duration || 1);
  const dt = 1 / 60;
  const fwd = new Vector3();
  const ys: number[] = [];
  const hip = new Vector3();
  for (let t = 0; t < 3; t += dt) {
    built.holder.getWorldDirection(fwd);
    built.holder.position.addScaledVector(fwd, speed * dt);
    built.mixer.update(dt);
    const dur = action.getClip().duration || 1;
    applyPosture(built.bones, state, {
      dt, speed, yaw: 0, phase: (action.time % dur) / dur, weights, holder: built.holder, forward: fwd, groundAt: flat(0),
    });
    if (t > 2.1) {
      built.bones.pelvis.getWorldPosition(hip);
      ys.push(hip.y);
    }
  }
  return span(ys);
}
const walkBob = bobOf("walk");
const runBob = bobOf("run");
check("walk bob about 3 cm", walkBob > 0.02 && walkBob < 0.045, `${(walkBob * 100).toFixed(1)} cm`);
check("run bob about 6-8 cm", runBob > 0.05 && runBob < 0.095, `${(runBob * 100).toFixed(1)} cm`);

// Blend: 90% of the way to a run in 0.15 s, 90% of the way to idle in 0.2 s.
function settle(rate: number, seconds: number, from: number, to: number) {
  let v = from;
  const dt = 1 / 120;
  for (let t = 0; t < seconds; t += dt) v += (to - v) * (1 - Math.exp(-dt * rate));
  return v;
}
const accel = settle(blendPerSec(runSpeed, walkSpeed), TUNE.accelBlend, 0, 1);
const stop = settle(blendPerSec(0, runSpeed), TUNE.stopBlend, 1, 0);
check("run blend reaches 90% in 0.15 s", accel >= 0.89, `${(accel * 100).toFixed(1)}%`);
check("stop blend reaches 90% idle in 0.2 s", stop <= 0.11, `run weight left ${(stop * 100).toFixed(1)}%`);

// Camera: a 7 cm, 3.2 Hz bob on the root must not reach the follow camera.
{
  let smooth = 1;
  let cam = 2.5;
  const ys: number[] = [];
  const dt = 1 / 60;
  for (let t = 0; t < 3; t += dt) {
    const root = 1 + 0.07 * Math.sin(t * Math.PI * 2 * 3.2);
    cam = root + 1.6; // the game re-places the camera every frame
    const next = smoothCameraY(cam, root, smooth, dt);
    cam = next.camY;
    smooth = next.smoothRoot;
    if (t > 1) ys.push(cam);
  }
  const camBob = span(ys);
  check("camera ignores vertical bob", camBob < 0.02, `camera bob ${(camBob * 100).toFixed(2)} cm from a 7 cm root bob`);
}

// Fast sprint still plants. Game run clip is authored near 5.6 m/s.
const fast = simulate(rig, rig.bones, { seconds: 2.6, speed: 5.6, weights: runW, action: "run" });
check("sprint plant holds at 5.6 m/s", fast.plantFrames > 8 && fast.drift < 0.03, `${(fast.drift * 100).toFixed(1)} cm over ${fast.plantFrames} frames, cadence ${fast.plan.cadence.toFixed(2)} steps/s`);

console.log(notes.join("\n"));
console.log(`\nleg=${leg.toFixed(3)} walkSpeed=${walkSpeed.toFixed(2)} runSpeed=${runSpeed.toFixed(2)}`);
if (fails.length) {
  console.error(`\n${fails.length} failed`);
  process.exit(1);
}
console.log("\nALL PASS");
