// Retarget Quaternius CC0 locomotion onto the MakeHuman Sam/Maya rig.
// Bone local +Y points along the limb and local +Z is the twist hint on both
// skeletons, so each posed bone copies the source limb direction and roll.
//
// Source (CC0): https://quaternius.com/packs/universalanimationlibrary.html
// Godot glTF mirror: https://github.com/J-Ponzo/gltf-universal-animation-library
// Download lib.gltf and lib.bin, then:
//   UAL_GLTF=/path/to/lib.gltf node tools/retarget-locomotion.mjs
// Requires @gltf-transform/core and @gltf-transform/extensions.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NodeIO } from "@gltf-transform/core";
import { KHRONOS_EXTENSIONS } from "@gltf-transform/extensions";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = process.env.UAL_GLTF || "/tmp/ual/lib.gltf";
const DST = path.join(root, "game/models/player_sam.glb");
const OUT = path.join(root, "game/models/locomotion.glb");

const PAIRS = [
  ["pelvis", "DEF-hips", "DEF-spine.001"],
  ["spine_01", "DEF-spine.001", "DEF-spine.002"],
  ["spine_02", "DEF-spine.002", "DEF-spine.003"],
  ["spine_03", "DEF-spine.003", "DEF-neck"],
  ["neck_01", "DEF-neck", "DEF-head"],
  ["head", "DEF-head", null],
  ["clavicle_l", "DEF-shoulder.L", "DEF-upper_arm.L"],
  ["upperarm_l", "DEF-upper_arm.L", "DEF-forearm.L"],
  ["lowerarm_l", "DEF-forearm.L", "DEF-hand.L"],
  ["hand_l", "DEF-hand.L", "DEF-f_middle.01.L"],
  ["thigh_l", "DEF-thigh.L", "DEF-shin.L"],
  ["calf_l", "DEF-shin.L", "DEF-foot.L"],
  ["foot_l", "DEF-foot.L", "DEF-toe.L"],
  ["ball_l", "DEF-toe.L", null],
  ["clavicle_r", "DEF-shoulder.R", "DEF-upper_arm.R"],
  ["upperarm_r", "DEF-upper_arm.R", "DEF-forearm.R"],
  ["lowerarm_r", "DEF-forearm.R", "DEF-hand.R"],
  ["hand_r", "DEF-hand.R", "DEF-f_middle.01.R"],
  ["thigh_r", "DEF-thigh.R", "DEF-shin.R"],
  ["calf_r", "DEF-shin.R", "DEF-foot.R"],
  ["foot_r", "DEF-foot.R", "DEF-toe.R"],
  ["ball_r", "DEF-toe.R", null],
];

const qid = [0, 0, 0, 1];
const vadd = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const vsub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const vdot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const vlen = (a) => Math.hypot(a[0], a[1], a[2]);
const vscale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const vnorm = (a) => { const l = vlen(a) || 1; return vscale(a, 1 / l); };
const vcross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
function qmul(a, b) {
  const [ax, ay, az, aw] = a, [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz,
  ];
}
function qinv(q) { return [-q[0], -q[1], -q[2], q[3]]; }
function qrot(q, v) {
  const [x, y, z] = v, [qx, qy, qz, qw] = q;
  const ix = qw * x + qy * z - qz * y, iy = qw * y + qz * x - qx * z, iz = qw * z + qx * y - qy * x, iw = -qx * x - qy * y - qz * z;
  return [
    ix * qw + iw * -qx + iy * -qz - iz * -qy,
    iy * qw + iw * -qy + iz * -qx - ix * -qz,
    iz * qw + iw * -qz + ix * -qy - iy * -qx,
  ];
}
function qnorm(q) {
  const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1;
  return [q[0] / l, q[1] / l, q[2] / l, q[3] / l];
}
function quatFromBasis(x, y, z) {
  const m00 = x[0], m10 = x[1], m20 = x[2];
  const m01 = y[0], m11 = y[1], m21 = y[2];
  const m02 = z[0], m12 = z[1], m22 = z[2];
  const tr = m00 + m11 + m22;
  let qx, qy, qz, qw;
  if (tr > 0) {
    const s = Math.sqrt(tr + 1) * 2;
    qw = 0.25 * s; qx = (m21 - m12) / s; qy = (m02 - m20) / s; qz = (m10 - m01) / s;
  } else if (m00 > m11 && m00 > m22) {
    const s = Math.sqrt(1 + m00 - m11 - m22) * 2;
    qw = (m21 - m12) / s; qx = 0.25 * s; qy = (m01 + m10) / s; qz = (m02 + m20) / s;
  } else if (m11 > m22) {
    const s = Math.sqrt(1 + m11 - m00 - m22) * 2;
    qw = (m02 - m20) / s; qx = (m01 + m10) / s; qy = 0.25 * s; qz = (m12 + m21) / s;
  } else {
    const s = Math.sqrt(1 + m22 - m00 - m11) * 2;
    qw = (m10 - m01) / s; qx = (m02 + m20) / s; qy = (m12 + m21) / s; qz = 0.25 * s;
  }
  return qnorm([qx, qy, qz, qw]);
}
function quatFromYZ(yAxis, zHint) {
  const y = vnorm(yAxis);
  let x = vcross(y, zHint);
  if (vlen(x) < 1e-5) x = vcross(y, Math.abs(y[1]) < 0.9 ? [0, 1, 0] : [1, 0, 0]);
  x = vnorm(x);
  const z = vnorm(vcross(x, y));
  return quatFromBasis(x, y, z);
}

function readSrc(doc) {
  const nodes = doc.nodes;
  const parent = {};
  nodes.forEach((n, i) => (n.children || []).forEach((c) => { parent[c] = i; }));
  const byName = {};
  nodes.forEach((n, i) => { if (n.name) byName[n.name] = i; });
  const bin = fs.readFileSync(SRC.replace(/\.gltf$/, ".bin"));
  const acc = doc.accessors;
  const bv = doc.bufferViews;
  function array(accessorIndex) {
    const a = acc[accessorIndex];
    const view = bv[a.bufferView];
    const start = (view.byteOffset || 0) + (a.byteOffset || 0);
    const n = a.count * (a.type === "VEC4" ? 4 : a.type === "VEC3" ? 3 : a.type === "SCALAR" ? 1 : 0);
    return new Float32Array(bin.buffer, bin.byteOffset + start, n);
  }
  const anims = {};
  for (const anim of doc.animations) {
    const tracks = new Map();
    let duration = 0;
    for (let c = 0; c < anim.channels.length; c++) {
      const ch = anim.channels[c];
      const sampler = anim.samplers[ch.sampler];
      const input = array(sampler.input);
      const output = array(sampler.output);
      duration = Math.max(duration, input[input.length - 1]);
      const node = ch.target.node;
      if (!tracks.has(node)) tracks.set(node, {});
      tracks.get(node)[ch.target.path] = { t: input, v: output, size: ch.target.path === "rotation" ? 4 : 3, step: sampler.interpolation === "STEP" };
    }
    anims[anim.name] = { tracks, duration };
  }
  function sampleTrack(track, time) {
    const { t, v, size, step } = track;
    let i = 0;
    while (i < t.length - 1 && t[i + 1] < time) i++;
    const i1 = Math.min(i + 1, t.length - 1);
    if (step || t[i1] === t[i]) return v.subarray(i * size, i * size + size);
    const u = (time - t[i]) / (t[i1] - t[i]);
    const a = v.subarray(i * size, i * size + size);
    const b = v.subarray(i1 * size, i1 * size + size);
    if (size === 4) {
      let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
      const bb = d < 0 ? [-b[0], -b[1], -b[2], -b[3]] : b;
      if (d < 0) d = -d;
      if (d > 0.9995) return qnorm([a[0] + (bb[0] - a[0]) * u, a[1] + (bb[1] - a[1]) * u, a[2] + (bb[2] - a[2]) * u, a[3] + (bb[3] - a[3]) * u]);
      const th = Math.acos(Math.min(1, d)), s = Math.sin(th);
      const w1 = Math.sin((1 - u) * th) / s, w2 = Math.sin(u * th) / s;
      return [a[0] * w1 + bb[0] * w2, a[1] * w1 + bb[1] * w2, a[2] * w1 + bb[2] * w2, a[3] * w1 + bb[3] * w2];
    }
    return [a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u, a[2] + (b[2] - a[2]) * u];
  }
  function pose(animName, time) {
    const { tracks } = anims[animName];
    const local = nodes.map((n, i) => {
      const tr = tracks.get(i) || {};
      return {
        t: tr.translation ? sampleTrack(tr.translation, time) : (n.translation || [0, 0, 0]),
        r: tr.rotation ? sampleTrack(tr.rotation, time) : (n.rotation || qid),
      };
    });
    const world = new Array(nodes.length);
    function rec(i) {
      if (world[i]) return world[i];
      const p = parent[i];
      const L = local[i];
      if (p === undefined) { world[i] = { t: [...L.t], r: qnorm(L.r) }; return world[i]; }
      const pw = rec(p);
      const rt = qrot(pw.r, L.t);
      world[i] = { t: [pw.t[0] + rt[0], pw.t[1] + rt[1], pw.t[2] + rt[2]], r: qnorm(qmul(pw.r, L.r)) };
      return world[i];
    }
    for (let i = 0; i < nodes.length; i++) rec(i);
    return world;
  }
  return { byName, anims, pose };
}

function targetRig(doc) {
  const by = new Map(doc.getRoot().listNodes().map((n) => [n.getName(), n]));
  const world = new Map();
  function wr(n) {
    if (world.has(n)) return world.get(n);
    const p = n.getParentNode();
    const t = n.getTranslation(), r = n.getRotation();
    if (!p) { const o = { t: [...t], r: qnorm(r) }; world.set(n, o); return o; }
    const pw = wr(p);
    const rt = qrot(pw.r, t);
    const o = { t: vadd(pw.t, rt), r: qnorm(qmul(pw.r, r)) };
    world.set(n, o);
    return o;
  }
  const bind = {};
  for (const [name] of PAIRS) bind[name] = wr(by.get(name));
  const root = wr(by.get("Root"));
  // Calf-to-ankle offset in the calf's bind-local frame. Feet are not children of the calves.
  const ankle = {};
  for (const side of ["l", "r"]) {
    const calf = bind["calf_" + side], foot = bind["foot_" + side];
    ankle[side] = qrot(qinv(calf.r), vsub(foot.t, calf.t));
  }
  return { bind, root, ankle };
}

function retargetClip(src, rig, animName, fps) {
  const duration = src.anims[animName].duration;
  const frames = Math.max(2, Math.round(duration * fps));
  const times = [];
  const hips = [];
  const posed = [];
  for (let i = 0; i < frames; i++) {
    const time = Math.min(duration, (i / (frames - 1)) * duration);
    times.push(i === frames - 1 ? duration : time);
    const world = src.pose(animName, times[i]);
    const at = (name) => world[src.byName[name]];
    hips.push(at("DEF-hips").t);
    const locals = {};
    const worldQs = { Root: rig.root.r };
    for (const [dst, bone, child] of PAIRS) {
      const sw = at(bone);
      const dir = child ? vnorm(vsub(at(child).t, sw.t)) : qrot(sw.r, [0, 1, 0]);
      const twist = qrot(sw.r, [0, 0, 1]);
      const worldQ = quatFromYZ(dir, twist);
      worldQs[dst] = worldQ;
      const parentName = {
        pelvis: "Root", spine_01: "pelvis", spine_02: "spine_01", spine_03: "spine_02",
        neck_01: "spine_03", head: "neck_01",
        clavicle_l: "spine_03", upperarm_l: "clavicle_l", lowerarm_l: "upperarm_l", hand_l: "lowerarm_l",
        clavicle_r: "spine_03", upperarm_r: "clavicle_r", lowerarm_r: "upperarm_r", hand_r: "lowerarm_r",
        thigh_l: "pelvis", calf_l: "thigh_l", thigh_r: "pelvis", calf_r: "thigh_r",
      }[dst];
      const parentQ = parentName ? worldQs[parentName] : null;
      locals[dst] = parentQ ? qnorm(qmul(qinv(parentQ), worldQ)) : worldQ;
    }
    // Feet live on the armature, so their local rotation is the world rotation.
    locals.foot_l = quatFromYZ(
      vnorm(vsub(at("DEF-toe.L").t, at("DEF-foot.L").t)),
      qrot(at("DEF-foot.L").r, [0, 0, 1]),
    );
    locals.foot_r = quatFromYZ(
      vnorm(vsub(at("DEF-toe.R").t, at("DEF-foot.R").t)),
      qrot(at("DEF-foot.R").r, [0, 0, 1]),
    );
    // Toes are children of the feet, and the feet sit on the armature (identity).
    locals.ball_l = qnorm(qmul(qinv(locals.foot_l), quatFromYZ(qrot(at("DEF-toe.L").r, [0, 1, 0]), qrot(at("DEF-toe.L").r, [0, 0, 1]))));
    locals.ball_r = qnorm(qmul(qinv(locals.foot_r), quatFromYZ(qrot(at("DEF-toe.R").r, [0, 1, 0]), qrot(at("DEF-toe.R").r, [0, 0, 1]))));
    posed.push({ locals, worldQs, footPos: {} });
  }
  // Remove net hip travel and keep bob, sway, and the step's back-and-forth.
  const vx = (hips[hips.length - 1][0] - hips[0][0]) / duration;
  const vz = (hips[hips.length - 1][2] - hips[0][2]) / duration;
  const stride = Math.hypot(hips[hips.length - 1][0] - hips[0][0], hips[hips.length - 1][2] - hips[0][2]);
  const hipWorld = posed.map((_, i) => {
    const hip = hips[i];
    const parked = [hip[0] - vx * times[i], hip[1], hip[2] - vz * times[i]];
    const delta = vsub(parked, [hips[0][0], hips[0][1], hips[0][2]]);
    return vadd(rig.bind.pelvis.t, delta);
  });
  // The thigh joint follows the posed pelvis. Feet are parented to the armature,
  // so their translation has to be the end of that chain or the ankles float.
  for (let i = 0; i < posed.length; i++) {
    const frame = posed[i];
    const pelvisT = hipWorld[i];
    const pelvisR = frame.worldQs.pelvis;
    for (const side of ["l", "r"]) {
      const thighLocal = qrot(qinv(rig.bind.pelvis.r), vsub(rig.bind["thigh_" + side].t, rig.bind.pelvis.t));
      const thighOrigin = vadd(pelvisT, qrot(pelvisR, thighLocal));
      const kneeLocal = qrot(qinv(rig.bind["thigh_" + side].r), vsub(rig.bind["calf_" + side].t, rig.bind["thigh_" + side].t));
      const kneeWorld = vadd(thighOrigin, qrot(frame.worldQs["thigh_" + side], kneeLocal));
      frame.footPos[side] = vadd(kneeWorld, qrot(frame.worldQs["calf_" + side], rig.ankle[side]));
    }
  }
  let minToe = Infinity;
  const toeOf = (side, frame) => {
    const foot = frame.footPos[side];
    const local = qrot(qinv(rig.bind["foot_" + side].r), vsub(rig.bind["ball_" + side].t, rig.bind["foot_" + side].t));
    return vadd(foot, qrot(frame.locals["foot_" + side], local));
  };
  for (const frame of posed) {
    frame.toePos = { l: toeOf("l", frame), r: toeOf("r", frame) };
    minToe = Math.min(minToe, frame.toePos.l[1], frame.toePos.r[1]);
  }
  // The retarget keeps the source crouch, then sits the lowest toe on y = 0.
  const lift = -minToe;
  if (lift) {
    for (let i = 0; i < posed.length; i++) {
      hipWorld[i] = vadd(hipWorld[i], [0, lift, 0]);
      posed[i].footPos.l = vadd(posed[i].footPos.l, [0, lift, 0]);
      posed[i].footPos.r = vadd(posed[i].footPos.r, [0, lift, 0]);
    }
  }
  const hipLocal = hipWorld.map((world) => qrot(qinv(rig.root.r), world));
  return { times, posed, hipLocal, duration, stride, speed: stride / duration, lift };
}

function hemisphere(prev, q) {
  if (!prev) return q;
  const d = prev[0] * q[0] + prev[1] * q[1] + prev[2] * q[2] + prev[3] * q[3];
  return d < 0 ? [-q[0], -q[1], -q[2], -q[3]] : q;
}

function packGlb(clips) {
  const names = PAIRS.map((p) => p[0]);
  const json = {
    asset: { version: "2.0", generator: "aruba-locomotion-retarget" },
    scene: 0,
    scenes: [{ nodes: names.map((_, i) => i) }],
    nodes: names.map((name) => ({ name })),
    animations: [],
    accessors: [],
    bufferViews: [],
    buffers: [{ byteLength: 0 }],
  };
  const bins = [];
  let offset = 0;
  function pushArray(values) {
    const buf = Buffer.from(new Float32Array(values).buffer);
    const pad = (4 - (buf.length % 4)) % 4;
    const view = Buffer.concat([buf, Buffer.alloc(pad)]);
    const viewIndex = json.bufferViews.length;
    json.bufferViews.push({ buffer: 0, byteOffset: offset, byteLength: buf.length });
    offset += view.length;
    bins.push(view);
    return viewIndex;
  }
  function accessor(view, count, type, min, max) {
    const index = json.accessors.length;
    json.accessors.push({ bufferView: view, componentType: 5126, count, type, min, max });
    return index;
  }
  const nodeIndex = Object.fromEntries(names.map((n, i) => [n, i]));
  for (const clip of clips) {
    const channels = [];
    const samplers = [];
    const timeView = pushArray(clip.times);
    const timeAcc = accessor(timeView, clip.times.length, "SCALAR", [clip.times[0]], [clip.times[clip.times.length - 1]]);
    const rotBones = names.filter((n) => n !== "pelvis" || true);
    for (const bone of rotBones) {
      const values = [];
      let prev = null;
      for (const frame of clip.posed) {
        const q = hemisphere(prev, frame.locals[bone]);
        prev = q;
        values.push(q[0], q[1], q[2], q[3]);
      }
      const view = pushArray(values);
      const acc = accessor(view, clip.times.length, "VEC4");
      const s = samplers.length;
      samplers.push({ input: timeAcc, output: acc, interpolation: "LINEAR" });
      channels.push({ sampler: s, target: { node: nodeIndex[bone], path: "rotation" } });
    }
    const posBones = [
      ["pelvis", (frame, i) => clip.hipLocal[i]],
      ["foot_l", (frame) => frame.footPos.l],
      ["foot_r", (frame) => frame.footPos.r],
    ];
    for (const [bone, pick] of posBones) {
      const values = [];
      clip.posed.forEach((frame, i) => { const p = pick(frame, i); values.push(p[0], p[1], p[2]); });
      const view = pushArray(values);
      const acc = accessor(view, clip.times.length, "VEC3");
      const s = samplers.length;
      samplers.push({ input: timeAcc, output: acc, interpolation: "LINEAR" });
      channels.push({ sampler: s, target: { node: nodeIndex[bone], path: "translation" } });
    }
    json.animations.push({
      name: clip.name,
      channels,
      samplers,
      extras: { speed: Math.round(clip.speed * 1000) / 1000 },
    });
  }
  json.buffers[0].byteLength = offset;
  const jsonBuf = Buffer.from(JSON.stringify(json));
  const jsonPad = Buffer.alloc((4 - (jsonBuf.length % 4)) % 4, 0x20);
  const jsonChunk = Buffer.concat([jsonBuf, jsonPad]);
  const bin = Buffer.concat(bins);
  const total = 12 + 8 + jsonChunk.length + 8 + bin.length;
  const header = Buffer.alloc(12);
  header.writeUInt32LE(0x46546c67, 0);
  header.writeUInt32LE(2, 4);
  header.writeUInt32LE(total, 8);
  const jh = Buffer.alloc(8);
  jh.writeUInt32LE(jsonChunk.length, 0);
  jh.writeUInt32LE(0x4e4f534a, 4);
  const bh = Buffer.alloc(8);
  bh.writeUInt32LE(bin.length, 0);
  bh.writeUInt32LE(0x004e4942, 4);
  fs.writeFileSync(OUT, Buffer.concat([header, jh, jsonChunk, bh, bin]));
}

const srcDoc = JSON.parse(fs.readFileSync(SRC, "utf8"));
const src = readSrc(srcDoc);
const io = new NodeIO().registerExtensions(KHRONOS_EXTENSIONS);
const rig = targetRig(await io.read(DST));
const wanted = [
  ["Idle", "Idle_Loop"],
  ["Walk", "Walk_Loop"],
  ["Run", "Jog_Fwd_Loop"],
];
const clips = wanted.map(([name, srcName]) => {
  const clip = retargetClip(src, rig, srcName, 30);
  clip.name = name;
  let minFoot = 1e9, bothUp = 0, samples = 0, minKnee = 1e9, maxKnee = -1e9, minHip = 1e9, maxHip = -1e9;
  for (const frame of clip.posed) {
    const fl = frame.footPos.l[1], fr = frame.footPos.r[1];
    minFoot = Math.min(minFoot, fl, fr);
  }
  for (const frame of clip.posed) {
    samples++;
    const fl = frame.footPos.l[1], fr = frame.footPos.r[1];
    if (fl > minFoot + 0.03 && fr > minFoot + 0.03) bothUp++;
  }
  const plantSpeed = (side) => {
    const other = side === "l" ? "r" : "l";
    const ys = clip.posed.map((f) => f.toePos[side][1]);
    const floor = Math.min(...ys);
    const speeds = [];
    for (let i = 1; i < ys.length; i++) {
      const y = ys[i];
      const yo = clip.posed[i].toePos[other][1];
      if (y > floor + 0.035 || y > yo + 0.01) continue;
      const dz = clip.posed[i].toePos[side][2] - clip.posed[i - 1].toePos[side][2];
      const dt = clip.times[i] - clip.times[i - 1];
      const sp = dt > 0 ? -dz / dt : 0;
      if (sp > 0.3 && sp < 12) speeds.push(sp);
    }
    if (!speeds.length) return 0;
    speeds.sort((a, b) => a - b);
    return speeds[Math.floor(speeds.length / 2)];
  };
  const walkMs = (plantSpeed("l") + plantSpeed("r")) / 2;
  clip.speed = walkMs || clip.speed;
  console.log(name, "dur", clip.duration.toFixed(3), "hipStride", clip.stride.toFixed(3), "plant m/s", walkMs.toFixed(2), "flightFrames", bothUp + "/" + samples, "keys", clip.times.length);
  if (name !== "Idle") {
    for (let i = 0; i < clip.posed.length; i += Math.ceil(clip.posed.length / 8)) {
      const f = clip.posed[i];
      console.log("  t", clip.times[i].toFixed(2), "L", f.footPos.l.map((v) => v.toFixed(2)).join(","), "R", f.footPos.r.map((v) => v.toFixed(2)).join(","));
    }
  }
  void minKnee; void maxKnee; void minHip; void maxHip;
  return clip;
});
packGlb(clips);
console.log("wrote", OUT, fs.statSync(OUT).size);
