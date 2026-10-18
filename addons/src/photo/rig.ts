// Free-camera math for photo mode. No Three.js, no per-frame allocation.

export const FILTERS = ["none", "vivid", "mono", "warm", "cool"] as const;
export type PhotoFilter = (typeof FILTERS)[number];

const EXPOSURE_MIN = 0.25;
const EXPOSURE_MAX = 2.5;

/** Circle of confusion in metres. Zero on the focus plane, grows with aperture and defocus. */
export function circleOfConfusion(distance: number, focus: number, aperture: number): number {
  const f = Math.max(0.5, focus);
  return Math.max(0, aperture) * Math.abs(distance - f) / f;
}

export class PhotoRig {
  x = 0;
  y = 2;
  z = 0;
  /** Yaw 0 looks toward -Z, matching the game camera. Positive pitch looks up. */
  yaw = 0;
  pitch = 0;
  exposure = 1;
  focus = 12;
  aperture = 0.35;
  filter = 0;
  speed = 7;

  setExposure(v: number): void {
    this.exposure = Math.min(EXPOSURE_MAX, Math.max(EXPOSURE_MIN, v));
  }

  setFocus(metres: number): void {
    this.focus = Math.min(80, Math.max(1, metres));
  }

  cycleFilter(dir: number): PhotoFilter {
    const n = FILTERS.length;
    this.filter = ((this.filter + dir) % n + n) % n;
    return FILTERS[this.filter];
  }

  /** Move in camera space. forward/strafe/lift are -1..1, dyaw/dpitch are radians. */
  move(forward: number, strafe: number, lift: number, dyaw: number, dpitch: number, dt: number): void {
    this.yaw += dyaw;
    this.pitch = Math.min(1.2, Math.max(-1.2, this.pitch + dpitch));
    const cp = Math.cos(this.pitch);
    const sp = Math.sin(this.pitch);
    const sy = Math.sin(this.yaw);
    const cy = Math.cos(this.yaw);
    const fx = -sy * cp;
    const fy = sp;
    const fz = -cy * cp;
    const rx = cy;
    const rz = -sy;
    const s = this.speed * dt;
    this.x += (fx * forward + rx * strafe) * s;
    this.y += (fy * forward + lift) * s;
    this.z += (fz * forward + rz * strafe) * s;
  }
}
