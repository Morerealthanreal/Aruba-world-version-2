// Player engines, crash impact, crash-response sirens, and the plane turbo.
// Every node is created once at unlock and reused. update() only writes numbers:
// no new nodes, buffers, objects, or arrays per frame. ?audio=0 disables it.
// AI traffic has no engine and no tyre voice. Police and ambulance sirens play
// only while those vehicles are responding to a crash. The ForenSys car stays silent.
// Licences: addons/CREDITS (original synthesis, CC0).
import type { AGame } from "./env";
import {
  CAR_DRIVE, MOTO_DRIVE, advanceDrive, cycleLength, referenceHz, renderEngineCycle,
  type DriveSpec, type DriveState, type EngineKind,
} from "./engineSynth";

const MASTER = 0.5;
const SIREN_RANGE = 180;

type Voice = {
  body: AudioBufferSourceNode; edge: AudioBufferSourceNode; sub: OscillatorNode;
  bodyGain: GainNode; edgeGain: GainNode; subGain: GainNode;
  noiseFilter: BiquadFilterNode; noiseGain: GainNode;
  filter: BiquadFilterNode; out: GainNode;
  rate: number; bg: number; eg: number; sg: number; ng: number; nf: number; ff: number; og: number; hz: number; level: number;
};
type Tone = { osc: OscillatorNode; gain: GainNode; hz: number; amp: number };
type NoiseTap = { filter: BiquadFilterNode; gain: GainNode; f: number; amp: number };
type Graph = {
  ctx: AudioContext; master: GainNode; noise: AudioBufferSourceNode;
  car: Voice; moto: Voice; clunk: GainNode;
  planeFilter: BiquadFilterNode; planeNoise: GainNode; planeTone: Tone; planeOut: GainNode;
  roar: NoiseTap; crackle: NoiseTap; sub: Tone; sub2: Tone;
  whooshFilter: BiquadFilterNode; whoosh: GainNode;
  police: Tone; police2: Tone; policePan: StereoPannerNode; policeOut: GainNode;
  amb: Tone; amb2: Tone; ambPan: StereoPannerNode; ambOut: GainNode;
  thump: OscillatorNode; thumpGain: GainNode; crunch: NoiseTap; metal: NoiseTap;
  skid: NoiseTap;
};
type Node = { position: { x: number; z: number }; parent: Node | null };
type Child = Node & { name: string };
type TrafficCar = { g: Node & { visible: boolean; children: Child[] }; sp: number; rd: unknown };
type CrashRoot = { parent: unknown; name: string; children: Child[] };
type Held = { gas?: boolean; brake?: boolean };
type Aw = {
  crash?: { stats: { active: boolean; phase: number; scenes: number; x: number; z: number; fs: boolean } };
};

export class WorldAudio {
  stats = {
    started: false, muted: false, mode: "car", trafficVoices: 0, nodes: 0,
    gear: 0, rpm: 0, throttle: 0, police: 0, ambulance: 0, impacts: 0, turbo: 0, level: 0,
  };
  private audio: Graph | null = null;
  private muted = false;
  private quick: HTMLButtonElement;
  private setting: HTMLButtonElement | null = null;
  private keyFwd = false;
  private keyBrk = false;
  private prevT = 0;
  private prevWall = 0;
  private arm = 0.4;
  private masterLin = 0;
  private carDrive: DriveState = { gear: 0, rpm: CAR_DRIVE.idle, shift: 0 };
  private motoDrive: DriveState = { gear: 0, rpm: MOTO_DRIVE.idle, shift: 0 };
  private carThr = 0;
  private motoThr = 0;
  private overrun = 0;
  private prevPhase = -1;
  private turboWas = false;
  private turboLin = 0;
  private policeLin = 0;
  private ambLin = 0;
  private crashRoot: CrashRoot | null = null;
  private heardMode = "";
  private policeD = -1;
  private policeX = 0;
  private policeZ = 0;
  private ambD = -1;
  private ambX = 0;
  private ambZ = 0;
  private speed = 0;
  private wx = 0;
  private wz = 0;

  constructor(private g: AGame) {
    try { this.muted = localStorage.getItem("aw_muted") === "1"; } catch { /* private mode */ }
    this.stats.muted = this.muted;
    this.quick = document.createElement("button");
    this.quick.id = "awmutebtn";
    this.quick.type = "button";
    this.quick.setAttribute("aria-label", "Mute game audio");
    const st = document.createElement("style");
    st.textContent = "#awmutebtn{position:fixed;z-index:50;left:12px;top:calc(96px + env(safe-area-inset-top));" +
      "width:42px;height:42px;border:2px solid #ffffff73;border-radius:50%;background:#0009;color:#fff;" +
      "font:20px system-ui;display:grid;place-items:center;padding:0}";
    document.head.appendChild(st);
    this.quick.onclick = (event) => { event.stopPropagation(); this.toggle(); };
    document.body.appendChild(this.quick);
    this.syncButtons();
    this.mountSetting(0);
    this.mountCredit(0);
    // Capture, and keep listening until start() succeeds. A control that stops
    // the event, or a first gesture that throws, used to consume the only chance
    // and later taps never armed the engine.
    const arm = () => { if (!this.muted) this.start(); };
    addEventListener("pointerdown", arm, true);
    addEventListener("keydown", (e) => this.onKey(e, true));
    addEventListener("keyup", (e) => this.onKey(e, false));
    addEventListener("blur", () => { this.keyFwd = false; this.keyBrk = false; });
  }

  private onKey(e: KeyboardEvent, down: boolean) {
    if (e.target instanceof HTMLInputElement) return;
    const fwd = e.code === "KeyW" || e.code === "ArrowUp";
    const brk = e.code === "Space" || e.code === "KeyS" || e.code === "ArrowDown";
    if (fwd) this.keyFwd = down;
    if (brk) this.keyBrk = down;
    if (down && !this.muted) this.start();
  }

  private throttle(): number {
    const held = (this.g as AGame & { held?: Held }).held;
    const joy = (this.g as AGame & { joy?: { y?: number } }).joy;
    if (held?.brake || this.keyBrk) return 0;
    let thr = held?.gas || this.keyFwd ? 1 : 0;
    const y = joy?.y || 0;
    const joyThr = y < 0 ? (y < -1 ? 1 : -y) : 0;
    return joyThr > thr ? joyThr : thr;
  }

  private write(param: AudioParam, last: number, next: number, eps: number): number {
    if (Math.abs(last - next) < eps) return last;
    param.value = next;
    return next;
  }

  private approach(cur: number, target: number, dt: number, rate: number): number {
    if (dt <= 0) return cur;
    return cur + (target - cur) * (1 - Math.exp(-rate * dt));
  }

  private noiseBuffer(ctx: AudioContext): AudioBuffer {
    const length = Math.floor(ctx.sampleRate * 2);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let seed = 0x12345678;
    for (let i = 0; i < length; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
      data[i] = ((seed >>> 8) / 0x7fffff - 1) * 0.7;
    }
    return buffer;
  }

  private cycleBuffer(ctx: AudioContext, kind: EngineKind, bright: boolean, scratch: Float32Array): AudioBuffer {
    const n = cycleLength(ctx.sampleRate, kind);
    const buffer = ctx.createBuffer(1, n, ctx.sampleRate);
    renderEngineCycle(ctx.sampleRate, kind, bright, scratch.subarray(0, n));
    buffer.getChannelData(0).set(scratch.subarray(0, n));
    return buffer;
  }

  private loop(ctx: AudioContext, buffer: AudioBuffer): AudioBufferSourceNode {
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.start();
    return source;
  }

  private tone(ctx: AudioContext, type: OscillatorType, hz: number): Tone {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.value = hz;
    gain.gain.value = 0;
    osc.connect(gain);
    osc.start();
    return { osc, gain, hz, amp: 0 };
  }

  private tap(ctx: AudioContext, noise: AudioNode, type: BiquadFilterType, freq: number): NoiseTap {
    const filter = ctx.createBiquadFilter();
    const gain = ctx.createGain();
    filter.type = type;
    filter.frequency.value = freq;
    filter.Q.value = 0.7;
    gain.gain.value = 0;
    noise.connect(filter);
    filter.connect(gain);
    return { filter, gain, f: freq, amp: 0 };
  }

  private voice(ctx: AudioContext, noise: AudioNode, kind: EngineKind, scratch: Float32Array, shaper: WaveShaperNode): Voice {
    const body = this.loop(ctx, this.cycleBuffer(ctx, kind, false, scratch));
    const edge = this.loop(ctx, this.cycleBuffer(ctx, kind, true, scratch));
    const sub = ctx.createOscillator();
    sub.type = "sine";
    sub.frequency.value = 40;
    sub.start();
    const bodyGain = ctx.createGain();
    const edgeGain = ctx.createGain();
    const subGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    const out = ctx.createGain();
    bodyGain.gain.value = 0.7;
    edgeGain.gain.value = 0;
    subGain.gain.value = 0;
    out.gain.value = 0;
    filter.type = "lowpass";
    filter.frequency.value = 500;
    filter.Q.value = 0.45;
    body.connect(bodyGain).connect(filter);
    edge.connect(edgeGain).connect(filter);
    filter.connect(shaper).connect(out);
    sub.connect(subGain).connect(out);
    const exhaust = this.tap(ctx, noise, "bandpass", 240);
    exhaust.gain.connect(out);
    const rate = referenceHz(kind) > 0 ? 1 : 1;
      body.playbackRate.value = rate;
    edge.playbackRate.value = rate;
    return {
      body, edge, sub, bodyGain, edgeGain, subGain, noiseFilter: exhaust.filter, noiseGain: exhaust.gain,
      filter, out, rate, bg: 0.7, eg: 0, sg: 0, ng: 0, nf: 240, ff: 500, og: 0, hz: 40, level: 0,
    };
  }

  private shape(ctx: AudioContext): WaveShaperNode {
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(256);
    const drive = 1.25;
    const norm = Math.tanh(drive);
    for (let i = 0; i < 256; i++) {
      const x = (i / 255) * 2 - 1;
      curve[i] = Math.tanh(x * drive) / norm;
    }
    shaper.curve = curve;
    shaper.oversample = "none";
    return shaper;
  }

  private start() {
    if (this.audio) {
      void this.audio.ctx.resume();
      return;
    }
    try {
      const ctx = new AudioContext();
      const master = ctx.createGain();
      const compressor = ctx.createDynamicsCompressor();
      compressor.threshold.value = -16;
      compressor.knee.value = 18;
      compressor.ratio.value = 3.5;
      compressor.attack.value = 0.012;
      compressor.release.value = 0.28;
      master.gain.value = 0;
      master.connect(compressor).connect(ctx.destination);

      const noise = this.loop(ctx, this.noiseBuffer(ctx));
      const scratch = new Float32Array(cycleLength(ctx.sampleRate, "car"));
      const car = this.voice(ctx, noise, "car", scratch, this.shape(ctx));
      const moto = this.voice(ctx, noise, "moto", scratch, this.shape(ctx));
      car.out.connect(master);
      moto.out.connect(master);

      const clunkFilter = ctx.createBiquadFilter();
      clunkFilter.type = "lowpass";
      clunkFilter.frequency.value = 160;
      const clunk = ctx.createGain();
      clunk.gain.value = 0;
      noise.connect(clunkFilter).connect(clunk).connect(master);

      const planeFilter = ctx.createBiquadFilter();
      planeFilter.type = "lowpass";
      planeFilter.frequency.value = 640;
      planeFilter.Q.value = 0.5;
      const planeNoise = ctx.createGain();
      planeNoise.gain.value = 0;
      const planeOut = ctx.createGain();
      planeOut.gain.value = 0;
      const planeTone = this.tone(ctx, "sine", 78);
      noise.connect(planeFilter).connect(planeNoise).connect(planeOut);
      planeTone.gain.connect(planeOut);
      planeOut.connect(master);

      const roar = this.tap(ctx, noise, "lowpass", 180);
      roar.filter.Q.value = 0.4;
      roar.gain.connect(master);
      const crackle = this.tap(ctx, noise, "bandpass", 1100);
      crackle.filter.Q.value = 0.8;
      crackle.gain.connect(master);
      const sub = this.tone(ctx, "sine", 38);
      const sub2 = this.tone(ctx, "sine", 55);
      sub.gain.connect(master);
      sub2.gain.connect(master);
      const whooshFilter = ctx.createBiquadFilter();
      whooshFilter.type = "bandpass";
      whooshFilter.frequency.value = 300;
      whooshFilter.Q.value = 0.65;
      const whoosh = ctx.createGain();
      whoosh.gain.value = 0;
      noise.connect(whooshFilter).connect(whoosh).connect(master);

      const policePan = ctx.createStereoPanner();
      const policeOut = ctx.createGain();
      policeOut.gain.value = 0;
      const policeFilter = ctx.createBiquadFilter();
      policeFilter.type = "lowpass";
      policeFilter.frequency.value = 1700;
      policeFilter.Q.value = 0.5;
      const police = this.tone(ctx, "sine", 700);
      const police2 = this.tone(ctx, "sine", 1050);
      police.gain.connect(policeFilter);
      police2.gain.connect(policeFilter);
      policeFilter.connect(policePan).connect(policeOut).connect(master);

      const ambPan = ctx.createStereoPanner();
      const ambOut = ctx.createGain();
      ambOut.gain.value = 0;
      const ambFilter = ctx.createBiquadFilter();
      ambFilter.type = "lowpass";
      ambFilter.frequency.value = 1600;
      ambFilter.Q.value = 0.5;
      const amb = this.tone(ctx, "sine", 680);
      const amb2 = this.tone(ctx, "sine", 940);
      amb.gain.connect(ambFilter);
      amb2.gain.connect(ambFilter);
      ambFilter.connect(ambPan).connect(ambOut).connect(master);

      const thump = ctx.createOscillator();
      thump.type = "sine";
      thump.frequency.value = 80;
      const thumpGain = ctx.createGain();
      thumpGain.gain.value = 0;
      thump.connect(thumpGain).connect(master);
      thump.start();
      const crunch = this.tap(ctx, noise, "lowpass", 420);
      crunch.filter.Q.value = 0.4;
      crunch.gain.connect(master);
      const metal = this.tap(ctx, noise, "bandpass", 1500);
      metal.filter.Q.value = 0.6;
      metal.gain.connect(master);

      const skid = this.tap(ctx, noise, "bandpass", 1600);
      skid.gain.connect(master);
      // r285: removed the always-on 'waves' (lowpass noise + LFO, never below 0.012) and 'city' (1 kHz bandpass noise) beds: constant hiss/feedback.

      this.audio = {
        ctx, master, noise, car, moto, clunk,
        planeFilter, planeNoise, planeTone, planeOut,
        roar, crackle, sub, sub2, whooshFilter, whoosh,
        police, police2, policePan, policeOut,
        amb, amb2, ambPan, ambOut,
        thump, thumpGain, crunch, metal, skid,
      };
      this.stats.started = true;
      this.stats.nodes = 48;
      this.stats.trafficVoices = 0;
      void ctx.resume();
    } catch (error) {
      console.warn("[aw-audio] WebAudio unavailable", error);
    }
  }

  private toggle() {
    this.muted = !this.muted;
    this.stats.muted = this.muted;
    try { localStorage.setItem("aw_muted", this.muted ? "1" : "0"); } catch { /* ignore */ }
    if (!this.muted) this.start();
    this.syncButtons();
  }

  private syncButtons() {
    this.quick.textContent = this.muted ? "🔇" : "🔊";
    this.quick.title = this.muted ? "Unmute audio" : "Mute audio";
    if (this.setting) this.setting.textContent = this.muted ? "Sound: OFF" : "Sound: ON";
  }

  private mountSetting(tries: number) {
    const box = document.getElementById("awtime");
    if (!box) {
      if (tries < 60) setTimeout(() => this.mountSetting(tries + 1), 500);
      return;
    }
    const label = document.createElement("div");
    label.className = "lbl";
    label.textContent = "World audio";
    const row = document.createElement("div");
    row.className = "row";
    const button = document.createElement("button");
    button.type = "button";
    button.onclick = () => this.toggle();
    row.appendChild(button);
    box.append(label, row);
    this.setting = button;
    this.syncButtons();
  }

  private mountCredit(tries: number) {
    const ul = document.querySelector("#credits ul");
    if (!ul) {
      if (tries < 40) setTimeout(() => this.mountCredit(tries + 1), 500);
      return;
    }
    if (ul.querySelector(".aw-audio")) return;
    const li = document.createElement("li");
    li.className = "aw-audio";
    li.innerHTML = 'Engines, sirens, crash impact and turbo: original procedural synthesis (<a href="https://creativecommons.org/publicdomain/zero/1.0/" target="_blank" rel="noopener">CC0 1.0</a>, no third-party samples)';
    ul.appendChild(li);
  }

  private clunkAt(now: number) {
    const audio = this.audio;
    if (!audio) return;
    const gain = audio.clunk.gain;
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(0.0001, now);
    gain.exponentialRampToValueAtTime(0.04, now + 0.01);
    gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
  }

  private boom(now: number, distance: number) {
    const audio = this.audio;
    if (!audio) return;
    const near = distance > 420 ? 0 : 1 - distance / 420;
    const loud = near * near;
    if (loud < 0.05) return;
    const freq = audio.thump.frequency;
    const thump = audio.thumpGain.gain;
    freq.cancelScheduledValues(now);
    freq.setValueAtTime(130, now);
    freq.exponentialRampToValueAtTime(34, now + 0.34);
    thump.cancelScheduledValues(now);
    thump.setValueAtTime(0.0001, now);
    thump.exponentialRampToValueAtTime(0.15 * loud, now + 0.016);
    thump.exponentialRampToValueAtTime(0.0001, now + 0.48);
    const crunch = audio.crunch.gain.gain;
    crunch.cancelScheduledValues(now);
    crunch.setValueAtTime(0.0001, now);
    crunch.exponentialRampToValueAtTime(0.08 * loud, now + 0.012);
    crunch.exponentialRampToValueAtTime(0.0001, now + 0.4);
    const metal = audio.metal.gain.gain;
    metal.cancelScheduledValues(now);
    metal.setValueAtTime(0.0001, now);
    metal.exponentialRampToValueAtTime(0.03 * loud, now + 0.008);
    metal.exponentialRampToValueAtTime(0.0001, now + 0.13);
    this.stats.impacts += 1;
  }

  private whoosh(now: number) {
    const audio = this.audio;
    if (!audio) return;
    const freq = audio.whooshFilter.frequency;
    const gain = audio.whoosh.gain;
    freq.cancelScheduledValues(now);
    freq.setValueAtTime(150, now);
    freq.exponentialRampToValueAtTime(1700, now + 0.38);
    freq.exponentialRampToValueAtTime(380, now + 0.85);
    gain.cancelScheduledValues(now);
    gain.setValueAtTime(0.0001, now);
    gain.exponentialRampToValueAtTime(0.05, now + 0.07);
    gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
  }

  private silence(v: Voice, dt: number) {
    v.level = this.approach(v.level, 0, dt, 10);
    v.og = this.write(v.out.gain, v.og, v.level, 0.003);
    v.eg = this.write(v.edgeGain.gain, v.eg, this.approach(v.eg, 0, dt, 8), 0.005);
    v.ng = this.write(v.noiseGain.gain, v.ng, this.approach(v.ng, 0, dt, 8), 0.003);
  }

  private snap(d: DriveState, spec: DriveSpec, now: number) {
    for (let i = 0; i < 8; i++) advanceDrive(d, this.speed, 0, 0.08, spec, now);
    d.shift = 0;
  }

  private engine(kind: EngineKind, v: Voice, d: DriveState, spec: DriveSpec, thr: number, now: number, dt: number) {
    const shifted = advanceDrive(d, this.speed, thr, dt, spec, now);
    if (this.arm <= 0 && shifted === 1) this.clunkAt(now);
    let rate = (d.rpm / 60) / referenceHz(kind);
    if (d.rpm < spec.idle * 1.25 && thr < 0.15) rate *= 1 + 0.012 * Math.sin(now * 2.6) + 0.007 * Math.sin(now * 5.2);
    if (rate < 0.1) rate = 0.1;
    else if (rate > 6) rate = 6;
    if (Math.abs(v.rate - rate) >= 0.004) {
      v.body.playbackRate.value = rate;
      v.edge.playbackRate.value = rate;
      v.rate = rate;
    }
    const rpmN = (d.rpm - spec.idle) / (spec.red - spec.idle);
    const n = rpmN < 0 ? 0 : rpmN > 1 ? 1 : rpmN;
    const cap = kind === "moto" ? 2300 : 1850;
    let cutoff = (kind === "moto" ? 480 : 400) + n * (kind === "moto" ? 1100 : 800) + thr * (kind === "moto" ? 700 : 550);
    if (cutoff > cap) cutoff = cap;
    v.ff = this.write(v.filter.frequency, v.ff, cutoff, 8);
    const hz = d.rpm / 30;
    v.hz = this.write(v.sub.frequency, v.hz, hz < 28 ? 28 : hz, 0.6);
    v.bg = this.write(v.bodyGain.gain, v.bg, 0.62, 0.01);
    v.eg = this.write(v.edgeGain.gain, v.eg, thr * 0.42 + n * thr * 0.16, 0.008);
    v.sg = this.write(v.subGain.gain, v.sg, 0.05 + n * 0.04 + thr * 0.02, 0.004);
    let air = 0.008 + thr * 0.02 + n * 0.006;
    if (kind === "moto" && this.overrun > 0) {
      const pop = Math.sin(now * 53) * Math.sin(now * 19);
      air += (pop > 0 ? pop * pop * pop * pop : 0) * 0.03 * (this.overrun > 0.25 ? 1 : this.overrun * 4);
    }
    v.ng = this.write(v.noiseGain.gain, v.ng, air, 0.002);
    v.nf = this.write(v.noiseFilter.frequency, v.nf, 160 + n * 640 + thr * 380, 12);
    let level = 0.15 + thr * 0.07 + n * 0.035;
    if (d.shift > 0.1) level *= 0.74;
    const capGain = kind === "moto" ? 0.24 : 0.26;
    if (level > capGain) level = capGain;
    v.level = this.approach(v.level, level, dt, 9);
    v.og = this.write(v.out.gain, v.og, v.level, 0.003);
    return v.level;
  }

  private responders(px: number, pz: number, active: boolean, phase: number, cx: number, cz: number) {
    this.policeD = -1;
    this.ambD = -1;
    if (active && phase >= 1) {
      const amb = (this.g.real as unknown as { amb?: { cars: TrafficCar[]; group?: { children: CrashRoot[] } } } | null)?.amb;
      const kids = amb?.group?.children;
      if (kids) {
        let root = this.crashRoot;
        if (!root || root.parent == null) {
          root = null;
          for (let i = 0; i < kids.length; i++) if (kids[i].name === "aw:crash") root = kids[i];
          this.crashRoot = root;
        }
        if (root) {
          const ck = root.children;
          for (let i = 0; i < ck.length; i++) {
            const n = ck[i].name;
            if (n === "aw:ev:everest" || n === "aw:ev:isuzu") {
              this.place(ck[i]);
              this.policeX = this.wx;
              this.policeZ = this.wz;
              this.policeD = Math.hypot(this.policeX - px, this.policeZ - pz);
              break;
            }
          }
        }
        if (this.policeD < 0) {
          const ext = (window as unknown as { __aw?: { emerg?: { ext: { d: number } | null } } }).__aw?.emerg?.ext;
          if (ext) { this.policeD = ext.d; this.policeX = px; this.policeZ = pz; }
        }
        const cars = amb?.cars;
        if (cars) {
          let best = 1e9;
          const sceneNear = Math.hypot(cx - px, cz - pz) < 420;
          for (let i = 0; i < cars.length; i++) {
            const car = cars[i];
            if (!car.g.visible) continue;
            const ch = car.g.children;
            let isAmb = false;
            for (let j = 0; j < ch.length; j++) {
              const n = ch[j].name;
              if (n === "aw:ev:ambY" || n === "aw:ev:ambP") { isAmb = true; break; }
            }
            if (!isAmb) continue;
            this.place(car.g);
            const x = this.wx, z = this.wz;
            const dScene = Math.hypot(x - cx, z - cz);
            const dPlayer = Math.hypot(x - px, z - pz);
            if (dScene > 260 && !(sceneNear && dPlayer < 130)) continue;
            if (dPlayer < best) { best = dPlayer; this.ambX = x; this.ambZ = z; this.ambD = dPlayer; }
          }
        }
      }
    } else this.crashRoot = null;
  }

  private place(o: Node) {
    let x = 0, z = 0;
    let p: Node | null = o;
    while (p) { x += p.position.x; z += p.position.z; p = p.parent; }
    this.wx = x;
    this.wz = z;
  }

  private atten(d: number): number {
    if (d < 0 || d > SIREN_RANGE) return 0;
    const n = 1 - d / SIREN_RANGE;
    return n * n * 0.04;
  }

  update() {
    const audio = this.audio;
    if (!audio) return;
    const now = audio.ctx.currentTime;
    const wall = performance.now() * 0.001;
    const audioDt = this.prevT > 0 ? now - this.prevT : 0;
    const wallDt = this.prevWall > 0 ? wall - this.prevWall : 0.016;
    this.prevT = now;
    this.prevWall = wall;
    // Headless Chromium often advances AudioContext.currentTime much slower than
    // the frame clock. The drivetrain follows whichever clock actually moved,
    // capped so a resume hitch cannot jump the gearbox.
    let dt = audioDt > wallDt ? audioDt : wallDt;
    if (!(dt > 0)) dt = 0.016;
    if (dt > 0.05) dt = 0.05;
    if (dt < 0) return;
    if (this.arm > 0) this.arm = this.arm > dt ? this.arm - dt : 0;

    const state = this.g.S as unknown as {
      mode: "walk" | "car" | "moto" | "plane";
      car: { x: number; z: number; s?: number; drift?: number };
      walk: { x: number; z: number };
      plane: { x: number; z: number; s?: number; thr?: number };
    };
    const mode = state.mode;
    this.stats.mode = mode;
    this.speed = Math.abs(state.car.s || 0);
    const raw = mode === "car" || mode === "moto" ? this.throttle() : 0;
    const rising = raw > (mode === "moto" ? this.motoThr : this.carThr);
    if (mode === "moto") this.motoThr = this.approach(this.motoThr, raw, dt, rising ? 14 : 5);
    else if (mode === "car") this.carThr = this.approach(this.carThr, raw, dt, rising ? 12 : 4.5);
    if (mode === "moto" && this.motoThr < 0.08 && this.motoDrive.rpm > 5600) this.overrun = 0.38;
    else this.overrun = this.overrun > dt ? this.overrun - dt : 0;

    if (mode !== this.heardMode) {
      this.heardMode = mode;
      if (mode === "car") this.snap(this.carDrive, CAR_DRIVE, now);
      else if (mode === "moto") this.snap(this.motoDrive, MOTO_DRIVE, now);
    }
    const carLevel = mode === "car"
      ? this.engine("car", audio.car, this.carDrive, CAR_DRIVE, this.carThr, now, dt)
      : (this.silence(audio.car, dt), 0);
    const motoLevel = mode === "moto"
      ? this.engine("moto", audio.moto, this.motoDrive, MOTO_DRIVE, this.motoThr, now, dt)
      : (this.silence(audio.moto, dt), 0);
    const drive = mode === "moto" ? this.motoDrive : this.carDrive;
    const thr = mode === "moto" ? this.motoThr : this.carThr;
    this.stats.gear = mode === "car" || mode === "moto" ? drive.gear + 1 : 0;
    this.stats.rpm = mode === "car" || mode === "moto" ? drive.rpm : 0;
    this.stats.throttle = mode === "car" || mode === "moto" ? thr : 0;
    this.stats.level = mode === "moto" ? motoLevel : mode === "car" ? carLevel : 0;

    const held = (this.g as AGame & { held?: Held }).held;
    const braking = !!(held?.brake || this.keyBrk);
    const drift = Math.abs(state.car.drift || 0);
    const scrub = mode === "moto" ? drift : mode === "car" && braking ? Math.min(1, this.speed / 20) : 0;
    const skid = scrub * (mode === "moto" ? 0.035 : 0.025);
    audio.skid.amp = this.write(audio.skid.gain.gain, audio.skid.amp, skid, 0.002);

    const planeSpeed = Math.abs(state.plane.s || 0);
    const planeThr = state.plane.thr || 0;
    const flying = mode === "plane";
    const w = window as unknown as { __awTurbo?: boolean; __awTurboLvl?: number };
    const turboOn = !!(w.__awTurbo && flying);
    const wantLvl = flying ? (w.__awTurboLvl || (turboOn ? 1 : 0)) : 0;
    this.turboLin = this.approach(this.turboLin, wantLvl, dt, turboOn ? 6 : 3);
    if (this.turboLin < 0.004 && !turboOn) this.turboLin = 0;
    if (turboOn && !this.turboWas) this.whoosh(now);
    this.turboWas = turboOn;
    this.stats.turbo = this.turboLin;
    const duck = 1 - this.turboLin * 0.72;
    const planeLevel = flying ? (0.045 + planeThr * 0.03) * (duck < 0.28 ? 0.28 : duck) : 0;
    audio.planeOut.gain.value = planeLevel;
    audio.planeNoise.gain.value = flying ? 0.55 : 0;
    audio.planeFilter.frequency.value = 520 + planeThr * 700;
    audio.planeTone.hz = this.write(audio.planeTone.osc.frequency, audio.planeTone.hz, 72 + planeThr * 46 + planeSpeed * 0.15, 0.5);
    audio.planeTone.amp = this.write(audio.planeTone.gain.gain, audio.planeTone.amp, flying ? 0.22 : 0, 0.01);

    const lvl = this.turboLin;
    audio.roar.amp = this.write(audio.roar.gain.gain, audio.roar.amp, lvl * 0.055, 0.002);
    audio.roar.f = this.write(audio.roar.filter.frequency, audio.roar.f, 150 + lvl * 160, 4);
    audio.sub.hz = this.write(audio.sub.osc.frequency, audio.sub.hz, 32 + lvl * 18, 0.3);
    audio.sub2.hz = this.write(audio.sub2.osc.frequency, audio.sub2.hz, 47 + lvl * 12, 0.3);
    audio.sub.amp = this.write(audio.sub.gain.gain, audio.sub.amp, lvl * 0.034, 0.002);
    audio.sub2.amp = this.write(audio.sub2.gain.gain, audio.sub2.amp, lvl * 0.016, 0.001);
    const burst = Math.sin(now * 37) * Math.sin(now * 17.5);
    const crack = burst > 0 ? burst * burst : 0;
    audio.crackle.amp = this.write(audio.crackle.gain.gain, audio.crackle.amp, lvl * (0.006 + crack * 0.016), 0.001);

    const aw = (window as unknown as { __aw?: Aw }).__aw;
    const crash = aw?.crash?.stats;
    const phase = crash?.phase ?? 0;
    const cam = this.g.camera.position;
    // prevPhase stays -1 until the context is running, and a ?crash=force
    // approach can finish in a few scaled frames before the first click.
    // Count that impact once if the listener is already in range.
    if (phase >= 1 && (this.prevPhase === 0 || (this.prevPhase < 0 && crash?.active))) {
      const dx = (crash?.x || cam.x) - cam.x;
      const dz = (crash?.z || cam.z) - cam.z;
      this.boom(now, Math.hypot(dx, dz));
    }
    this.prevPhase = phase;
    this.responders(cam.x, cam.z, !!crash?.active, phase, crash?.x || 0, crash?.z || 0);
    const both = this.policeD >= 0 && this.ambD >= 0 ? 0.82 : 1;
    this.policeLin = this.approach(this.policeLin, this.atten(this.policeD) * both, dt, 5);
    this.ambLin = this.approach(this.ambLin, this.atten(this.ambD) * both, dt, 5);
    audio.policeOut.gain.value = this.policeLin;
    audio.ambOut.gain.value = this.ambLin;
    this.stats.police = this.policeLin;
    this.stats.ambulance = this.ambLin;
    if (this.policeLin > 0.004 && this.policeD >= 0) {
      const sweep = 0.5 + 0.5 * Math.sin(now * 1.55);
      const f = 560 + 640 * sweep * sweep * (3 - 2 * sweep);
      audio.police.hz = this.write(audio.police.osc.frequency, audio.police.hz, f, 1);
      audio.police2.hz = this.write(audio.police2.osc.frequency, audio.police2.hz, f * 1.5, 1);
      audio.police.amp = this.write(audio.police.gain.gain, audio.police.amp, 0.72, 0.02);
      audio.police2.amp = this.write(audio.police2.gain.gain, audio.police2.amp, 0.22, 0.02);
      const pan = (this.policeX - cam.x) / 70;
      audio.policePan.pan.value = pan < -0.75 ? -0.75 : pan > 0.75 ? 0.75 : pan;
    }
    if (this.ambLin > 0.004 && this.ambD >= 0) {
      const hi = 0.5 + 0.5 * Math.sin(now * 7.4);
      audio.amb.hz = this.write(audio.amb.osc.frequency, audio.amb.hz, 660, 1);
      audio.amb2.hz = this.write(audio.amb2.osc.frequency, audio.amb2.hz, 960, 1);
      audio.amb.amp = this.write(audio.amb.gain.gain, audio.amb.amp, 0.3 + 0.7 * (1 - hi), 0.02);
      audio.amb2.amp = this.write(audio.amb2.gain.gain, audio.amb2.amp, 0.3 + 0.7 * hi, 0.02);
      const pan = (this.ambX - cam.x) / 70;
      audio.ambPan.pan.value = pan < -0.75 ? -0.75 : pan > 0.75 ? 0.75 : pan;
    }


    const want = this.muted || document.hidden ? 0 : MASTER;
    this.masterLin = this.approach(this.masterLin, want, dt > 0 ? dt : 0.016, 8);
    if (Math.abs(audio.master.gain.value - this.masterLin) > 0.002) audio.master.gain.value = this.masterLin;
  }
}
