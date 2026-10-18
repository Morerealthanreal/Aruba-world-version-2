import * as THREE from 'three';
import type { AmbientZone, AudioOptions, EngineState, Surface } from './types';

const HARMONICS = [1, 2, 3, 4.5, 6];

export class AudioSystem {
  readonly listener: THREE.AudioListener;
  private readonly ctx: AudioContext;
  private readonly master: GainNode;
  private readonly engineGain: GainNode;
  private readonly noiseGain: GainNode;
  private readonly noiseFilter: BiquadFilterNode;
  private readonly oscillators: OscillatorNode[] = [];
  private readonly oscGains: GainNode[] = [];
  private readonly zones: AmbientZone[];
  private readonly zoneSources = new Map<string, { source: AudioBufferSourceNode; gain: GainNode }>();
  private readonly footstepBuffers = new Map<Surface, AudioBuffer>();
  private quality: 'low' | 'medium' | 'high';
  private camera: THREE.Camera | null = null;
  private lastFoot = 0;
  private walkPhase = 0;

  constructor(camera: THREE.Camera, options: AudioOptions = {}) {
    this.quality = options.quality ?? 'high';
    this.zones = options.zones ?? [];
    this.camera = camera;

    this.listener = new THREE.AudioListener();
    camera.add(this.listener);

    this.ctx = this.listener.context;
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.7;
    this.master.connect(this.ctx.destination);

    // Engine: harmonics + filtered noise
    this.engineGain = this.ctx.createGain();
    this.engineGain.gain.value = 0;
    this.engineGain.connect(this.master);

    const count = this.quality === 'low' ? 3 : HARMONICS.length;
    for (let i = 0; i < count; i++) {
      const osc = this.ctx.createOscillator();
      osc.type = i === 0 ? 'sawtooth' : 'square';
      osc.frequency.value = 40;
      const g = this.ctx.createGain();
      g.gain.value = 0.15 / (i + 1);
      osc.connect(g);
      g.connect(this.engineGain);
      osc.start();
      this.oscillators.push(osc);
      this.oscGains.push(g);
    }

    // Filtered noise for exhaust / intake
    const noiseLen = 2 * this.ctx.sampleRate;
    const noiseBuf = this.ctx.createBuffer(1, noiseLen, this.ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) data[i] = Math.random() * 2 - 1;
    const noiseSrc = this.ctx.createBufferSource();
    noiseSrc.buffer = noiseBuf;
    noiseSrc.loop = true;
    this.noiseFilter = this.ctx.createBiquadFilter();
    this.noiseFilter.type = 'bandpass';
    this.noiseFilter.frequency.value = 180;
    this.noiseFilter.Q.value = 0.7;
    this.noiseGain = this.ctx.createGain();
    this.noiseGain.gain.value = 0;
    noiseSrc.connect(this.noiseFilter);
    this.noiseFilter.connect(this.noiseGain);
    this.noiseGain.connect(this.engineGain);
    noiseSrc.start();

    this.buildAmbientZones();
  }

  setQuality(q: 'low' | 'medium' | 'high'): void {
    this.quality = q;
  }

  setCamera(cam: THREE.Camera): void {
    if (this.camera) this.camera.remove(this.listener);
    this.camera = cam;
    cam.add(this.listener);
  }

  /** Call every frame. Listener follows the camera automatically. */
  update(dt: number, engine: EngineState | null, playerPos: THREE.Vector3, surface: Surface, isWalking: boolean, walkCycle: number): void {
    if (this.ctx.state === 'suspended') this.ctx.resume();

    // Engine
    if (engine && engine.on) {
      const base = 35 + engine.rpm * 95;
      for (let i = 0; i < this.oscillators.length; i++) {
        const h = HARMONICS[i] ?? (i + 1);
        this.oscillators[i].frequency.setTargetAtTime(base * h, this.ctx.currentTime, 0.05);
        const loadBoost = 1 + engine.load * 0.6;
        this.oscGains[i].gain.setTargetAtTime((0.12 / (i + 1)) * loadBoost * engine.rpm, this.ctx.currentTime, 0.08);
      }
      this.noiseFilter.frequency.setTargetAtTime(120 + engine.rpm * 420 + engine.load * 180, this.ctx.currentTime, 0.06);
      this.noiseGain.gain.setTargetAtTime(0.18 * engine.rpm * (0.6 + engine.load), this.ctx.currentTime, 0.08);
      this.engineGain.gain.setTargetAtTime(0.55, this.ctx.currentTime, 0.1);
    } else {
      this.engineGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
    }

    // Ambient zones (real Aruba positions supplied by caller)
    this.updateZones(playerPos);

    // Footsteps tied to walk cycle
    if (isWalking && surface !== 'water') {
      this.walkPhase = walkCycle;
      const stepInterval = 0.42;
      if (this.walkPhase - this.lastFoot > stepInterval || this.walkPhase < this.lastFoot) {
        this.playFootstep(surface, playerPos);
        this.lastFoot = this.walkPhase;
      }
    }
  }

  setMasterVolume(v: number): void {
    this.master.gain.setTargetAtTime(THREE.MathUtils.clamp(v, 0, 1), this.ctx.currentTime, 0.05);
  }

  private buildAmbientZones(): void {
    // Zones are started on demand; buffers must be preloaded by the game and passed via setZoneBuffer.
  }

  /** Game calls this after loading an ambient buffer. */
  setZoneBuffer(key: string, buffer: AudioBuffer): void {
    const zone = this.zones.find((z) => z.sound === key);
    if (!zone) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = zone.loop;
    const g = this.ctx.createGain();
    g.gain.value = 0;
    src.connect(g);
    g.connect(this.master);
    src.start();
    this.zoneSources.set(key, { source: src, gain: g });
  }

  /** Game supplies footstep buffers per surface. */
  setFootstepBuffer(surface: Surface, buffer: AudioBuffer): void {
    this.footstepBuffers.set(surface, buffer);
  }

  private updateZones(playerPos: THREE.Vector3): void {
    for (const zone of this.zones) {
      const entry = this.zoneSources.get(zone.sound);
      if (!entry) continue;
      const dx = playerPos.x - zone.x;
      const dz = playerPos.z - zone.z;
      const dist = Math.hypot(dx, dz);
      const t = 1 - THREE.MathUtils.clamp(dist / zone.radius, 0, 1);
      const vol = t * t * zone.volume;
      entry.gain.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.2);
    }
  }

  private playFootstep(surface: Surface, pos: THREE.Vector3): void {
    const buf = this.footstepBuffers.get(surface);
    if (!buf) return;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const g = this.ctx.createGain();
    g.gain.value = 0.35;
    const panner = this.ctx.createPanner();
    panner.panningModel = 'HRTF';
    panner.positionX.value = pos.x;
    panner.positionY.value = pos.y;
    panner.positionZ.value = pos.z;
    src.connect(g);
    g.connect(panner);
    panner.connect(this.master);
    src.start();
    src.onended = () => {
      src.disconnect();
      g.disconnect();
      panner.disconnect();
    };
  }

  dispose(): void {
    this.oscillators.forEach((o) => o.stop());
    this.zoneSources.forEach((e) => e.source.stop());
    if (this.camera) this.camera.remove(this.listener);
  }
}
