// Lightweight procedural audio: player engines, pooled traffic engines, tyre
// scrub, and location-weighted beach/city ambience. It creates no media files
// or per-frame nodes. ?audio=0 disables the system completely.
import type { AGame } from "./env";

type Engine = {
  a: OscillatorNode; b: OscillatorNode; gain: GainNode; filter: BiquadFilterNode;
};
type TrafficVoice = { osc: OscillatorNode; gain: GainNode; pan: StereoPannerNode };
type Ambient = { source: AudioBufferSourceNode; gain: GainNode };
type AudioState = {
  ctx: AudioContext;
  master: GainNode;
  car: Engine;
  moto: Engine;
  plane: Engine;
  traffic: TrafficVoice[];
  skid: Ambient;
  waves: Ambient;
  city: Ambient;
};
type TrafficCar = { g: { position: { x: number; z: number } }; sp: number; rd: unknown };

export class WorldAudio {
  stats = { started: false, muted: false, mode: "car", trafficVoices: 0 };
  private audio: AudioState | null = null;
  private muted = false;
  private quick: HTMLButtonElement;
  private setting: HTMLButtonElement | null = null;

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
    addEventListener("pointerdown", () => { if (!this.muted) this.start(); }, { once: true });
  }

  private makeEngine(ctx: AudioContext, type: OscillatorType, ratio: number, cutoff: number): Engine {
    const a = ctx.createOscillator(), b = ctx.createOscillator();
    const gain = ctx.createGain(), filter = ctx.createBiquadFilter();
    a.type = type;
    b.type = type === "sawtooth" ? "triangle" : "square";
    b.detune.value = type === "sawtooth" ? 7 : -5;
    gain.gain.value = 0;
    filter.type = "lowpass";
    filter.frequency.value = cutoff;
    a.connect(filter);
    b.connect(filter);
    filter.connect(gain);
    a.start();
    b.start();
    a.frequency.value = 60;
    b.frequency.value = 60 * ratio;
    return { a, b, gain, filter };
  }

  private noise(ctx: AudioContext, seconds: number, filterType: BiquadFilterType,
    frequency: number): Ambient {
    const length = Math.floor(ctx.sampleRate * seconds);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let seed = 0x12345678;
    for (let i = 0; i < length; i++) {
      seed = (Math.imul(seed, 1664525) + 1013904223) | 0;
      data[i] = ((seed >>> 8) / 0x7fffff - 1) * 0.75;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.value = frequency;
    const gain = ctx.createGain();
    gain.gain.value = 0;
    source.connect(filter).connect(gain);
    source.start();
    return { source, gain };
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
      master.gain.value = this.muted ? 0 : 0.68;
      master.connect(compressor).connect(ctx.destination);
      const car = this.makeEngine(ctx, "sawtooth", 2.02, 620);
      const moto = this.makeEngine(ctx, "square", 1.51, 1500);
      const plane = this.makeEngine(ctx, "sawtooth", 1.01, 440);
      car.gain.connect(master);
      moto.gain.connect(master);
      plane.gain.connect(master);

      const count = this.g.real!.q.name === "low" ? 5 : this.g.real!.q.name === "med" ? 10 : 15;
      const traffic: TrafficVoice[] = [];
      for (let i = 0; i < count; i++) {
        const osc = ctx.createOscillator(), gain = ctx.createGain(), pan = ctx.createStereoPanner();
        osc.type = "sawtooth";
        osc.frequency.value = 65;
        gain.gain.value = 0;
        osc.connect(gain).connect(pan).connect(master);
        osc.start();
        traffic.push({ osc, gain, pan });
      }

      const skid = this.noise(ctx, 0.7, "bandpass", 1750);
      const waves = this.noise(ctx, 2.3, "lowpass", 720);
      const city = this.noise(ctx, 1.7, "bandpass", 1050);
      skid.gain.connect(master);
      waves.gain.connect(master);
      city.gain.connect(master);
      const waveLfo = ctx.createOscillator(), waveDepth = ctx.createGain();
      waveLfo.frequency.value = 0.12;
      waveDepth.gain.value = 0.009;
      waveLfo.connect(waveDepth).connect(waves.gain.gain);
      waveLfo.start();

      this.audio = { ctx, master, car, moto, plane, traffic, skid, waves, city };
      this.stats.started = true;
      this.stats.trafficVoices = count;
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
    if (this.audio) {
      const { ctx, master } = this.audio;
      master.gain.setTargetAtTime(this.muted ? 0 : 0.68, ctx.currentTime, 0.035);
    }
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

  private engine(engine: Engine, frequency: number, gain: number, now: number) {
    engine.a.frequency.setTargetAtTime(frequency, now, 0.045);
    engine.b.frequency.setTargetAtTime(frequency * 2.01, now, 0.045);
    engine.gain.gain.setTargetAtTime(gain, now, 0.055);
  }

  update() {
    const audio = this.audio;
    if (!audio) return;
    const { ctx } = audio;
    const now = ctx.currentTime;
    const state = this.g.S as unknown as {
      mode: "walk" | "car" | "moto" | "plane";
      car: { x: number; z: number; s?: number; drift?: number };
      walk: { x: number; z: number };
      plane: { x: number; z: number; s?: number; thr?: number };
    };
    const mode = state.mode;
    this.stats.mode = mode;
    const carSpeed = Math.abs(state.car.s || 0);
    const planeSpeed = Math.abs(state.plane.s || 0);
    this.engine(audio.car, 52 + carSpeed * 4.8, mode === "car" ? 0.055 + Math.min(0.055, carSpeed * 0.003) : 0, now);
    this.engine(audio.moto, 92 + carSpeed * 10.5, mode === "moto" ? 0.045 + Math.min(0.065, carSpeed * 0.0035) : 0, now);
    this.engine(audio.plane, 42 + planeSpeed * 0.72, mode === "plane" ? 0.07 + (state.plane.thr || 0) * 0.065 : 0, now);
    const skid = mode === "car" ? Math.min(0.11, Math.abs(state.car.drift || 0) * 0.13) : 0;
    audio.skid.gain.gain.setTargetAtTime(skid, now, 0.025);

    const active = mode === "walk" ? state.walk : mode === "plane" ? state.plane : state.car;
    const amb = (this.g.real as unknown as { amb?: { cars: TrafficCar[] } }).amb;
    for (let i = 0; i < audio.traffic.length; i++) {
      const voice = audio.traffic[i], car = amb?.cars[i];
      let gain = 0;
      if (car?.rd) {
        const dx = car.g.position.x - active.x, dz = car.g.position.z - active.z;
        const distance = Math.hypot(dx, dz);
        if (distance < 100) gain = 0.022 * (1 - distance / 100) ** 2;
        voice.pan.pan.setTargetAtTime(Math.max(-0.8, Math.min(0.8, dx / 55)), now, 0.08);
        voice.osc.frequency.setTargetAtTime(48 + Math.abs(car.sp) * 3.5, now, 0.07);
      }
      voice.gain.gain.setTargetAtTime(gain, now, 0.08);
    }

    const palm = Math.hypot(active.x + 8220, active.z + 5750);
    const downtown = Math.hypot(active.x + 7150, active.z);
    const beachMix = Math.max(0, 1 - palm / 1900);
    const cityMix = Math.max(Math.max(0, 1 - downtown / 1900), beachMix * 0.45);
    audio.waves.gain.gain.setTargetAtTime(0.012 + beachMix * 0.026, now, 0.8);
    audio.city.gain.gain.setTargetAtTime(cityMix * 0.018, now, 0.8);
    audio.master.gain.setTargetAtTime(this.muted || document.hidden ? 0 : 0.68, now, 0.05);
  }
}
