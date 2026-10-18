import type { WaveHeightFn } from "./types";

/** Small swell used only when the ocean add-on is not loaded. */
export const fallbackSwell: WaveHeightFn = (x, z, t) =>
  0.06 * Math.sin(x * 0.21 + t * 1.3) + 0.04 * Math.sin(z * 0.17 - t * 1.1) + 0.03 * Math.sin((x + z) * 0.4 + t * 2.1);

type OceanSource = {
  waveHeight?: WaveHeightFn;
};

/**
 * Sample the SuperGrok ocean. The visible waves are `waveHeight(x, z, t)`.
 * `getWaveHeight` is an older sampler and is not called.
 */
export function oceanWave(ocean: OceanSource | null | undefined, fallback: WaveHeightFn = fallbackSwell): WaveHeightFn {
  const sample = ocean?.waveHeight;
  if (typeof sample !== "function") return fallback;
  return (x, z, t) => sample(x, z, t);
}
