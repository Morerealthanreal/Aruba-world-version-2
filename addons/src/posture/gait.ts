// Pure gait numbers shared by the player layer and the numeric self-test.
import { TUNE } from "./tune.ts";

export type GaitW = { idle: number; walk: number; run: number };

export function lerp3(w: GaitW, idle: number, walk: number, run: number) {
  return idle * w.idle + walk * w.walk + run * w.run;
}

/** Nominal step rate and stride for the blended gait, then fit them to ground speed. */
export function planGait(speed: number, leg: number, w: GaitW) {
  const moving = w.walk + w.run;
  const cadence0 = moving > 0.05 ? (TUNE.walkCadence * w.walk + TUNE.runCadence * w.run) / moving : 0;
  const stride0 = moving > 0.05
    ? leg * (TUNE.walkStride * w.walk + TUNE.runStride * w.run) / moving
    : leg * TUNE.walkStride;
  let cadence = cadence0;
  let stride = stride0;
  if (speed > TUNE.idleCut && cadence > 0.2) {
    stride = speed / cadence;
    const cap = leg * (1.2 * w.run + 0.95 * w.walk + 0.85 * w.idle);
    if (stride > cap) {
      stride = cap;
      cadence = speed / stride;
    }
  }
  return { cadence, stride, nominalCadence: cadence0, nominalStride: stride0 };
}

/** Clip timeScale so a two-step cycle hits `cadence` steps per second. */
export function cycleScale(cadence: number, duration: number) {
  if (cadence < 0.05 || duration < 0.05) return 1;
  return (cadence * duration) / 2;
}

/** 90% of the blend completes in accelBlend while speeding up, stopBlend while stopping. */
export function blendPerSec(speed: number, prev: number) {
  if (speed > prev + 0.04) return -Math.log(0.1) / TUNE.accelBlend;
  if (speed < TUNE.idleCut) return -Math.log(0.1) / TUNE.stopBlend;
  return 8;
}

export function bankAngle(yawRate: number, speed: number) {
  const amount = Math.max(TUNE.bankMin, Math.min(TUNE.bankMax, TUNE.bankMin + (TUNE.bankMax - TUNE.bankMin) * Math.min(1, speed / 3)));
  const u = Math.max(-1, Math.min(1, yawRate / TUNE.bankYawRate));
  return u * amount;
}

/** Phase in [0,1) is inside a stance window that may wrap past 0. */
export function stanceU(phase: number, start: number, duty: number) {
  const p = ((phase % 1) + 1) % 1;
  const end = start + duty;
  let u = -1;
  if (end <= 1) {
    if (p >= start && p < end) u = (p - start) / duty;
  } else if (p >= start) u = (p - start) / duty;
  else if (p < end - 1) u = (p + 1 - start) / duty;
  return u;
}
