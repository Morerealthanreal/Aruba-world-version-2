// Aruba World audio engine.
// WebAudio, pooled sources, fully synthesized engines / footsteps / ambients.
// No external audio files. Resume on first user gesture.
// Zero allocations in the hot update path.
import type { Object3D, Vector3 } from "three";

export type Surface = "sand" | "asphalt" | "wood" | "tile" | "default";
export type VehicleKind = "car" | "moto" | "plane";

type PooledVoice = {
  osc: OscillatorNode;
  gain: GainNode;
  filter: BiquadFilterNode;
  noise?: AudioBufferSourceNode;
  noiseGain?: GainNode;
  panner?: PannerNode;
  busy: boolean;
};

export class AudioEngine {
  readonly ctx: AudioContext;
  readonly master: GainNode;
  readonly music: GainNode;
  readonly sfx: GainNode;
  muted = false;

  private voices: PooledVoice[] = [];
  private noiseBuffer: AudioBuffer;
  private ambients: { gain: GainNode; source: AudioBufferSourceNode; filter: BiquadFilterNode }[] = [];
  private ambientTargets = [0, 0, 0]; // beach, town, hooiberg
  private started = false;
  private gestureBound = false;

  // Engine state (player vehicles)
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private engineFilter: BiquadFilterNode | null = null;
  private engineNoise: AudioBufferSourceNode | null = null;
  private engineNoiseGain: GainNode | null = null;
  private currentKind: VehicleKind | null = null;

  constructor() {
    const AC = window.AudioContext || (window as any).webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.music = this.ctx.createGain();
    this.sfx = this.ctx.createGain();
    this.master.connect(this.ctx.destination);
    this.music.connect(this.master);
    this.sfx.connect(this.master);
    this.master.gain.value = 0.8;
    this.music.gain.value = 0.5;
    this.sfx.gain.value = 0.7;

    // White-noise buffer (once)
    const len = this.ctx.sampleRate * 2;
    this.noiseBuffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = this.noiseBuffer.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;

    // Pool of 16 voices
    for (let i = 0; i < 16; i++) this.voices.push(this.createVoice());

    // Three ambient beds
    this.ambients.push(this.createAmbient(180, 0.4)); // beach waves (low)
    this.ambients.push(this.createAmbient(400, 0.25)); // town
    this.ambients.push(this.createAmbient(800, 0.3)); // wind
  }

  private createVoice(): PooledVoice {
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfx);
    osc.start();
    gain.gain.value = 0;
    return { osc, gain, filter, busy: false };
  }

  private createAmbient(freq: number, q: number) {
    const source = this.ctx.createBufferSource();
    source.buffer = this.noiseBuffer;
    source.loop = true;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = freq;
    filter.Q.value = q;
    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    source.connect(filter);
    filter.connect(gain);
    gain.connect(this.music);
    source.start();
    return { gain, source, filter };
  }

  /** Call once after first user gesture. */
  resume(): void {
    if (this.ctx.state === "suspended") void this.ctx.resume();
    this.started = true;
  }

  bindGestureResume(dom: Document | HTMLElement = document): void {
    if (this.gestureBound) return;
    this.gestureBound = true;
    const go = () => {
      this.resume();
      dom.removeEventListener("pointerdown", go);
      dom.removeEventListener("keydown", go);
    };
    dom.addEventListener("pointerdown", go);
    dom.addEventListener("keydown", go);
  }

  setMaster(v: number): void { this.master.gain.value = Math.max(0, Math.min(1, v)); }
  setMusic(v: number): void { this.music.gain.value = Math.max(0, Math.min(1, v)); }
  setSfx(v: number): void { this.sfx.gain.value = Math.max(0, Math.min(1, v)); }
  setMuted(m: boolean): void {
    this.muted = m;
    this.master.gain.value = m ? 0 : 0.8;
  }

  /** Synthesized engine. Call every frame for the player vehicle. */
  updateEngine(kind: VehicleKind, rpm: number, load: number, dt: number): void {
    if (!this.started || this.muted) return;
    if (this.currentKind !== kind) {
      this.stopEngine();
      this.startEngine(kind);
      this.currentKind = kind;
    }
    if (!this.engineOsc || !this.engineGain || !this.engineFilter) return;

    const base = kind === "plane" ? 80 : kind === "moto" ? 60 : 40;
    const freq = base + rpm * (kind === "plane" ? 0.8 : 1.4);
    this.engineOsc.frequency.setTargetAtTime(freq, this.ctx.currentTime, 0.05);
    this.engineFilter.frequency.setTargetAtTime(400 + load * 1800, this.ctx.currentTime, 0.08);
    const vol = 0.15 + load * 0.25 + Math.min(rpm / 6000, 0.3);
    this.engineGain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.05);
    if (this.engineNoiseGain) {
      this.engineNoiseGain.gain.setTargetAtTime(0.05 + load * 0.1, this.ctx.currentTime, 0.1);
    }
  }

  private startEngine(kind: VehicleKind): void {
    const osc = this.ctx.createOscillator();
    osc.type = kind === "plane" ? "sawtooth" : "square";
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    const gain = this.ctx.createGain();
    gain.gain.value = 0;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.sfx);
    osc.start();

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    noise.loop = true;
    const ng = this.ctx.createGain();
    ng.gain.value = 0;
    noise.connect(ng);
    ng.connect(this.sfx);
    noise.start();

    this.engineOsc = osc;
    this.engineFilter = filter;
    this.engineGain = gain;
    this.engineNoise = noise;
    this.engineNoiseGain = ng;
  }

  private stopEngine(): void {
    if (this.engineOsc) {
      try { this.engineOsc.stop(); } catch { /* already stopped */ }
      this.engineOsc.disconnect();
    }
    if (this.engineNoise) {
      try { this.engineNoise.stop(); } catch { /* */ }
      this.engineNoise.disconnect();
    }
    this.engineOsc = null;
    this.engineGain = null;
    this.engineFilter = null;
    this.engineNoise = null;
    this.engineNoiseGain = null;
    this.currentKind = null;
  }

  /** One-shot footstep. Surface changes filter/noise character. */
  footstep(surface: Surface, volume = 0.4): void {
    if (!this.started || this.muted) return;
    const voice = this.voices.find(v => !v.busy);
    if (!voice) return;
    voice.busy = true;

    const now = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.noiseBuffer;
    const ng = this.ctx.createGain();
    const filter = voice.filter;
    filter.type = "bandpass";
    switch (surface) {
      case "sand": filter.frequency.value = 300; filter.Q.value = 0.7; break;
      case "asphalt": filter.frequency.value = 800; filter.Q.value = 1.2; break;
      case "wood": filter.frequency.value = 500; filter.Q.value = 2; break;
      case "tile": filter.frequency.value = 1200; filter.Q.value = 3; break;
      default: filter.frequency.value = 600; filter.Q.value = 1;
    }
    ng.gain.setValueAtTime(volume, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    noise.connect(filter);
    filter.connect(ng);
    ng.connect(this.sfx);
    noise.start(now);
    noise.stop(now + 0.15);
    noise.onended = () => {
      noise.disconnect();
      ng.disconnect();
      voice.busy = false;
    };
  }

  /** Update ambient crossfade from player position (world units). */
  updateAmbient(px: number, pz: number, py: number): void {
    if (!this.started) return;
    // Simple area tests (tune to Aruba map)
    const beach = Math.max(0, 1 - Math.hypot(px - 200, pz - 100) / 400);
    const town = Math.max(0, 1 - Math.hypot(px, pz) / 250);
    const hooiberg = Math.max(0, 1 - Math.hypot(px - 50, pz - 300) / 180) * Math.min(1, py / 40);
    this.ambientTargets[0] = beach * 0.35;
    this.ambientTargets[1] = town * 0.25;
    this.ambientTargets[2] = hooiberg * 0.4;
    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      this.ambients[i].gain.gain.setTargetAtTime(this.ambientTargets[i], now, 0.4);
    }
  }

  /** 3D positional one-shot or looping for other vehicles. Returns release fn. */
  playPositional(kind: VehicleKind, position: Vector3, rpm: number): () => void {
    if (!this.started || this.muted) return () => {};
    const panner = this.ctx.createPanner();
    panner.panningModel = "HRTF";
    panner.distanceModel = "inverse";
    panner.refDistance = 8;
    panner.maxDistance = 120;
    panner.setPosition(position.x, position.y, position.z);

    const osc = this.ctx.createOscillator();
    osc.type = kind === "plane" ? "sawtooth" : "square";
    osc.frequency.value = 50 + rpm * 1.2;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 600 + rpm * 0.4;
    const gain = this.ctx.createGain();
    gain.gain.value = 0.2;
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(panner);
    panner.connect(this.sfx);
    osc.start();

    return () => {
      try { osc.stop(); } catch { /* */ }
      osc.disconnect();
      filter.disconnect();
      gain.disconnect();
      panner.disconnect();
    };
  }

  dispose(): void {
    this.stopEngine();
    for (const a of this.ambients) {
      try { a.source.stop(); } catch { /* */ }
    }
    void this.ctx.close();
  }
}
