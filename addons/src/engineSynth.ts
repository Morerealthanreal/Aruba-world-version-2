// Pure drivetrain + one-shot waveform render for the player engines.
// No audio nodes and no per-frame allocation: callers own the state and buffers.
// Waveforms are original (no third-party samples). See addons/CREDITS.

export type EngineKind = "car" | "moto";

export type DriveSpec = {
  up: readonly number[];
  down: readonly number[];
  idle: number;
  red: number;
  /** Extra rpm at a standstill with the throttle open — the launch "vroom". */
  launch: number;
};

export const CAR_DRIVE: DriveSpec = {
  up: [10, 18, 27, 37, 48],
  down: [0, 7, 14, 22, 31],
  idle: 820,
  red: 6400,
  launch: 2000,
};

/** Sportbike ratios: short gears, a high idle and a V4-style redline. */
export const MOTO_DRIVE: DriveSpec = {
  up: [11, 20, 30, 39, 48, 55],
  down: [0, 8, 16, 25, 34, 43],
  idle: 1400,
  red: 12400,
  launch: 3400,
};

export type DriveState = { gear: number; rpm: number; shift: number };

/** Crank revolutions per second baked into one loop of the rendered cycle. */
export function referenceHz(kind: EngineKind): number {
  return kind === "car" ? 32 : 50;
}

export function cycleLength(sampleRate: number, kind: EngineKind): number {
  return Math.max(8, Math.floor((sampleRate * 2) / referenceHz(kind)));
}

export function advanceDrive(
  d: DriveState,
  speed: number,
  throttle: number,
  dt: number,
  spec: DriveSpec,
  now: number,
): number {
  const abs = speed < 0 ? -speed : speed;
  let gear = d.gear;
  let shifted = 0;
  const top = spec.up.length - 1;
  if (gear < top && abs > spec.up[gear]) {
    gear += 1;
    shifted = 1;
  } else if (gear > 0 && abs < spec.down[gear]) {
    gear -= 1;
    shifted = -1;
  }
  d.gear = gear;

  const lo = spec.down[gear];
  const hi = spec.up[gear];
  const span = hi - lo || 1;
  let u = (abs - lo) / span;
  if (u < 0) u = 0;
  else if (u > 1) u = 1;

  let target = spec.idle + u * (spec.red - spec.idle);
  target += throttle * (1 - u * 0.65) * (spec.red - spec.idle) * 0.2;
  if (abs < 0.8) {
    const hunt = Math.sin(now * 3.1) * 12 + Math.sin(now * 5.4) * 7;
    target = spec.idle + throttle * spec.launch + (throttle < 0.12 ? hunt : 0);
  }
  if (u > 0.96 && throttle > 0.75) target -= Math.abs(Math.sin(now * 46)) * (spec.red * 0.018);
  if (target > spec.red) target = spec.red;
  if (target < spec.idle * 0.92) target = spec.idle * 0.92;

  if (shifted === 1) d.rpm *= 0.68;
  else if (shifted === -1) d.rpm = Math.min(spec.red, d.rpm * 1.18 + 180);
  d.shift = shifted !== 0 ? 0.16 : d.shift > dt ? d.shift - dt : 0;

  const rate = d.shift > 0 ? 15 : throttle > 0.4 ? 8.5 : 3.4;
  const k = dt > 0 ? 1 - Math.exp(-rate * dt) : 0;
  d.rpm += (target - d.rpm) * k;
  return shifted;
}

function wrap(p: number): number {
  p %= 1;
  return p < 0 ? p + 1 : p;
}

/** Asymmetric exhaust pop: fast attack, exponential tail. `d` is wrapped phase distance. */
function pulse(p: number, center: number, width: number): number {
  let d = wrap(p - center);
  if (d > 0.5) d = 1 - d;
  const attack = width * 0.2;
  if (d < attack) return attack > 0 ? d / attack : 1;
  return Math.exp(-(d - attack) / width);
}

function carSample(p: number, bright: boolean): number {
  const w = bright ? 0.032 : 0.068;
  const e1 = pulse(p, 0.0, w);
  const e2 = pulse(p, 0.5, w * 1.08);
  const ph = p * Math.PI * 2;
  const air = bright ? 1 : 0;
  const body =
    Math.sin(ph) * 0.2 +
    Math.sin(ph * 2) * 0.3 +
    Math.sin(ph * 3) * (0.05 + air * 0.12) +
    Math.sin(ph * 4) * (0.045 + air * 0.1) +
    Math.sin(ph * 5) * air * 0.06 +
    Math.sin(ph * 6) * air * 0.04;
  return Math.tanh(((e1 + e2 * 0.9) * (bright ? 0.82 : 0.68) + body) * 1.12);
}

/** 90° V4: a close twin-pulse, a gap, then a softer pair. That is the Ducati-style bark. */
function motoSample(p: number, bright: boolean): number {
  const w = bright ? 0.02 : 0.038;
  const a = pulse(p, 0.02, w);
  const b = pulse(p, 0.16, w * 0.92);
  const c = pulse(p, 0.56, w * 1.15) * 0.7;
  const d = pulse(p, 0.71, w) * 0.58;
  const ph = p * Math.PI * 2;
  const air = bright ? 1 : 0;
  const body =
    Math.sin(ph) * 0.14 +
    Math.sin(ph * 2) * 0.2 +
    Math.sin(ph * 3 + 0.45) * (0.06 + air * 0.12) +
    Math.sin(ph * 4.5) * (0.025 + air * 0.08) +
    Math.sin(ph * 6) * air * 0.05 +
    Math.sin(ph * 8) * air * 0.028;
  return Math.tanh(((a + b + c + d) * (bright ? 0.78 : 0.64) + body) * 1.2);
}

export function renderEngineCycle(sampleRate: number, kind: EngineKind, bright: boolean, out: Float32Array): void {
  const n = out.length;
  const cutoff = bright ? (kind === "car" ? 2500 : 3000) : kind === "car" ? 820 : 980;
  const a = 1 - Math.exp((-2 * Math.PI * cutoff) / sampleRate);
  let y0 = 0, y1 = 0, y2 = 0, y3 = 0;
  let peak = 0;
  // Two passes so the lowpass settles before the recorded loop. A periodic input then
  // starts and ends on the same filter state, and the loop does not click.
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < n; i++) {
      const p = ((i / n) * 2) % 1;
      const x = kind === "car" ? carSample(p, bright) : motoSample(p, bright);
      y0 += (x - y0) * a;
      y1 += (y0 - y1) * a;
      y2 += (y1 - y2) * a;
      y3 += (y2 - y3) * a;
      if (pass === 1) {
        out[i] = y3;
        const ax = y3 < 0 ? -y3 : y3;
        if (ax > peak) peak = ax;
      }
    }
  }
  const scale = peak > 1e-5 ? 0.56 / peak : 0;
  for (let i = 0; i < n; i++) out[i] *= scale;
}
