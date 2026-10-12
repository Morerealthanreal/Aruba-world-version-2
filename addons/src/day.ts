// Ported from SuperGrok (B) src/game/look/day.ts.
// One day is a full turn of t in 0..1. 0 is midnight, 0.5 is noon.
// Turquoise noon, copper sunset, deep lagoon night (B's palette).

export type DaySample = {
  t: number;
  elev: number;
  day: number; // 0 night .. 1 full day
  night: number;
  sunset: number; // 0 noon .. 1 deep sunset
  zenith: [number, number, number];
  horizon: [number, number, number];
  clock: string;
};

const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const smooth = (e0: number, e1: number, x: number) => {
  const t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0)));
  return t * t * (3 - 2 * t);
};

export function clockText(t: number): string {
  const w = ((t % 1) + 1) % 1;
  const h = Math.floor(w * 24) % 24;
  const m = Math.floor((w * 24 * 60) % 60);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function sampleDay(t: number): DaySample {
  const w = ((t % 1) + 1) % 1;
  // Aruba: sunrise ~06:30, solar noon ~12:30, sunset ~18:30 (B used 06/12/18).
  const elev = Math.sin((w - 0.25 - 0.5 / 24) * Math.PI * 2);
  const day = smooth(-0.08, 0.22, elev);
  const sunset = (1 - Math.min(1, Math.abs(elev) / 0.18)) * (1 - day * 0.15);

  const zD: [number, number, number] = [0.16, 0.45, 0.92];
  const zN: [number, number, number] = [0.05, 0.09, 0.2];
  const hD: [number, number, number] = [0.72, 0.88, 0.95];
  const hS: [number, number, number] = [0.98, 0.46, 0.22];
  const hN: [number, number, number] = [0.2, 0.27, 0.44];
  const zenith: [number, number, number] = [mix(zN[0], zD[0], day), mix(zN[1], zD[1], day), mix(zN[2], zD[2], day)];
  const horizon: [number, number, number] = [
    mix(mix(hN[0], hD[0], day), hS[0], sunset * 0.85),
    mix(mix(hN[1], hD[1], day), hS[1], sunset * 0.85),
    mix(mix(hN[2], hD[2], day), hS[2], sunset * 0.55),
  ];
  return { t: w, elev, day, night: 1 - day, sunset, zenith, horizon, clock: clockText(w) };
}
