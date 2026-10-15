// Time-of-day model. One day is a full turn of t in 0..1 (0 midnight, 0.5 noon).
// Sun: real solar geometry for Aruba (12.5 deg N) at the equinox, solar noon 12:30, so it
// rises due east at 06:30, culminates 77.5 deg high in the south and sets due west at 18:30.
// Tropical twilight is short (the sun drops almost vertically): civil dusk ends ~18:54,
// nautical ~19:18. Every colour below is keyed by sun elevation in degrees and written into
// one preallocated sample (no per-frame allocation).
import { Color } from "three";

const DEG = Math.PI / 180;
const LAT = 12.5 * DEG;
const DECL = 0;
const NOON = 12.5 / 24;

export type DaySample = {
  t: number;
  /** sin of the sun elevation */
  elev: number;
  elevDeg: number;
  /** direction to the sun, local east / north / up */
  east: number;
  north: number;
  up: number;
  /** 0 night .. 1 day; drives city lights, headlights, traffic (via uNight = 1 - day) */
  day: number;
  night: number;
  /** stars wait for nautical twilight */
  stars: number;
  /** direct sun light 0..1 (extinction + horizon fade) */
  sunK: number;
  /** moon light 0..1, only once the sun light is gone */
  moonK: number;
  /** sky / IBL brightness 0 night .. 1 day */
  skyK: number;
  /** golden + blue hour bell 0..1 */
  dusk: number;
  zenith: Color;
  horSun: Color;
  horAnti: Color;
  glow: Color;
  belt: Color;
  cloudLit: Color;
  cloudShade: Color;
  /** sun disc radiance (already scaled) */
  disc: Color;
  /** key light colour while the sun is up */
  light: Color;
  fog: Color;
};

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

// Palettes: rows of [sun elevation deg, r, g, b] (linear, pre tone mapping), ascending.
type Ramp = number[][];
const ZENITH: Ramp = [
  [-18, 0.006, 0.011, 0.034], [-12, 0.008, 0.016, 0.05], [-8, 0.013, 0.028, 0.085], [-5, 0.022, 0.05, 0.14],
  [-2, 0.04, 0.085, 0.22], [0, 0.055, 0.12, 0.29], [3, 0.065, 0.15, 0.37], [7, 0.07, 0.165, 0.43],
  [15, 0.075, 0.18, 0.46], [30, 0.074, 0.18, 0.48], [90, 0.07, 0.175, 0.49],
];
const HOR_SUN: Ramp = [
  [-18, 0.03, 0.042, 0.085], [-12, 0.045, 0.05, 0.095], [-8, 0.14, 0.085, 0.1], [-5, 0.42, 0.19, 0.1],
  [-2, 0.78, 0.34, 0.12], [0, 0.95, 0.46, 0.18], [3, 0.98, 0.6, 0.32], [7, 0.82, 0.66, 0.5],
  [15, 0.6, 0.64, 0.7], [30, 0.5, 0.58, 0.7], [90, 0.46, 0.55, 0.69],
];
const HOR_ANTI: Ramp = [
  [-18, 0.03, 0.042, 0.085], [-12, 0.04, 0.05, 0.1], [-8, 0.06, 0.075, 0.15], [-5, 0.11, 0.12, 0.21],
  [-2, 0.2, 0.18, 0.27], [0, 0.29, 0.27, 0.34], [3, 0.35, 0.37, 0.46], [7, 0.37, 0.43, 0.54],
  [15, 0.4, 0.49, 0.63], [30, 0.4, 0.5, 0.65], [90, 0.42, 0.52, 0.67],
];
const GLOW: Ramp = [
  [-12, 0, 0, 0], [-8, 0.08, 0.035, 0.02], [-5, 0.25, 0.1, 0.035], [-2, 0.42, 0.18, 0.05], [0, 0.55, 0.26, 0.07],
  [3, 0.55, 0.32, 0.12], [7, 0.45, 0.33, 0.18], [15, 0.34, 0.3, 0.24], [30, 0.28, 0.27, 0.24], [90, 0.26, 0.26, 0.24],
];
// Belt of Venus: pink band above the anti-solar horizon at dusk/dawn
const BELT: Ramp = [
  [-10, 0, 0, 0], [-6, 0.05, 0.03, 0.05], [-3, 0.13, 0.065, 0.09], [0, 0.11, 0.055, 0.07], [4, 0.03, 0.015, 0.015], [8, 0, 0, 0],
];
const CLOUD_LIT: Ramp = [
  [-18, 0.03, 0.036, 0.06], [-12, 0.04, 0.045, 0.075], [-8, 0.1, 0.075, 0.11], [-5, 0.38, 0.2, 0.21],
  [-2, 0.82, 0.38, 0.24], [0, 1.0, 0.52, 0.3], [3, 1.02, 0.7, 0.46], [7, 1.0, 0.84, 0.68],
  [15, 1.0, 0.97, 0.92], [30, 1.0, 1.0, 0.99], [90, 1.0, 1.0, 1.0],
];
const CLOUD_SHADE: Ramp = [
  [-18, 0.012, 0.018, 0.042], [-12, 0.016, 0.024, 0.055], [-8, 0.03, 0.036, 0.075], [-5, 0.06, 0.055, 0.1],
  [-2, 0.11, 0.085, 0.13], [0, 0.18, 0.14, 0.19], [3, 0.27, 0.23, 0.28], [7, 0.36, 0.35, 0.41],
  [15, 0.42, 0.46, 0.55], [30, 0.46, 0.5, 0.6], [90, 0.48, 0.52, 0.62],
];
const DISC: Ramp = [
  [-1.2, 0, 0, 0], [0, 2.4, 0.7, 0.2], [3, 5, 2.4, 0.9], [8, 8, 5.6, 3.4], [20, 12, 11, 9.2], [90, 14, 13.4, 12.4],
];
// key light; above 40 deg this is A's own sun colour (1, .9, .74)
const LIGHT: Ramp = [
  [-2, 1, 0.36, 0.14], [0, 1, 0.45, 0.2], [3, 1, 0.58, 0.32], [8, 1, 0.72, 0.48], [15, 1, 0.81, 0.6], [25, 1, 0.86, 0.68], [40, 1, 0.9, 0.74],
];

function ramp(r: Ramp, e: number, out: Color): Color {
  if (e <= r[0][0]) return out.setRGB(r[0][1], r[0][2], r[0][3]);
  for (let i = 1; i < r.length; i++) {
    const b = r[i];
    if (e <= b[0]) {
      const a = r[i - 1], k = (e - a[0]) / (b[0] - a[0]);
      return out.setRGB(a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, a[3] + (b[3] - a[3]) * k);
    }
  }
  const z = r[r.length - 1];
  return out.setRGB(z[1], z[2], z[3]);
}

export function makeSample(): DaySample {
  return {
    t: 0, elev: 0, elevDeg: 0, east: 0, north: 0, up: 1, day: 1, night: 0, stars: 0, sunK: 1, moonK: 0, skyK: 1, dusk: 0,
    zenith: new Color(), horSun: new Color(), horAnti: new Color(), glow: new Color(), belt: new Color(),
    cloudLit: new Color(), cloudShade: new Color(), disc: new Color(), light: new Color(), fog: new Color(),
  };
}

export function sampleDay(t: number, s: DaySample = makeSample()): DaySample {
  const w = ((t % 1) + 1) % 1;
  const H = (w - NOON) * Math.PI * 2; // hour angle
  const cd = Math.cos(DECL), sd = Math.sin(DECL), cl = Math.cos(LAT), sl = Math.sin(LAT);
  s.east = -cd * Math.sin(H);
  s.north = cl * sd - sl * cd * Math.cos(H);
  s.up = sl * sd + cl * cd * Math.cos(H);
  s.elev = s.up;
  const e = (s.elevDeg = Math.asin(Math.max(-1, Math.min(1, s.up))) / DEG);
  s.t = w;

  s.day = smooth(-9, 4, e);
  s.night = 1 - s.day;
  s.stars = 1 - smooth(-14, -6, e);
  // Kasten-Young air mass -> beam transmittance (normalised to 1 overhead), faded out at the horizon
  const am = 1 / (Math.max(0, Math.sin(Math.max(e, 0) * DEG)) + 0.50572 * Math.pow(Math.max(e, 0) + 6.07995, -1.6364));
  s.sunK = Math.exp(-0.11 * (am - 1)) * smooth(-1.5, 4, e);
  s.moonK = 1 - smooth(-12, -3, e);
  s.skyK = smooth(-10, 12, e);
  s.dusk = smooth(-10, -1, e) * (1 - smooth(4, 16, e));

  ramp(ZENITH, e, s.zenith);
  ramp(HOR_SUN, e, s.horSun);
  ramp(HOR_ANTI, e, s.horAnti);
  ramp(GLOW, e, s.glow);
  ramp(BELT, e, s.belt);
  ramp(CLOUD_LIT, e, s.cloudLit);
  ramp(CLOUD_SHADE, e, s.cloudShade);
  ramp(DISC, e, s.disc);
  ramp(LIGHT, e, s.light);
  // one fog colour for every bearing: lean to the cooler anti-sun side, which fills most of the view
  s.fog.copy(s.horAnti).lerp(s.horSun, 0.3);
  return s;
}
