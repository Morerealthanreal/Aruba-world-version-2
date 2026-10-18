// Pooled reef-fish school. Positions and velocities live in typed arrays that
// are allocated once. stepSchool does not allocate.

export type School = {
  n: number;
  x: Float32Array;
  y: Float32Array;
  z: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  vz: Float32Array;
  ax: number;
  ay: number;
  az: number;
  radius: number;
};

export function createSchool(n: number, ax: number, ay: number, az: number, radius = 14): School {
  const s: School = {
    n, ax, ay, az, radius,
    x: new Float32Array(n), y: new Float32Array(n), z: new Float32Array(n),
    vx: new Float32Array(n), vy: new Float32Array(n), vz: new Float32Array(n),
  };
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    s.x[i] = ax + Math.cos(a) * radius * 0.4;
    s.y[i] = ay + ((i % 5) - 2) * 0.4;
    s.z[i] = az + Math.sin(a) * radius * 0.4;
    s.vx[i] = Math.cos(a + 1) * 0.8;
    s.vy[i] = 0;
    s.vz[i] = Math.sin(a + 1) * 0.8;
  }
  return s;
}

export function stepSchool(s: School, dt: number): void {
  const n = s.n;
  if (n === 0 || dt <= 0) return;
  const sep = 1.3;
  const maxSp = 2.4;
  for (let i = 0; i < n; i++) {
    let cx = 0, cy = 0, cz = 0, ax = 0, ay = 0, az = 0, sx = 0, sy = 0, sz = 0, neighbors = 0;
    const ix = s.x[i], iy = s.y[i], iz = s.z[i];
    for (let j = 0; j < n; j++) {
      if (i === j) continue;
      const dx = s.x[j] - ix, dy = s.y[j] - iy, dz = s.z[j] - iz;
      const d2 = dx * dx + dy * dy + dz * dz;
      if (d2 > 16 || d2 < 1e-6) continue;
      neighbors++;
      cx += s.x[j]; cy += s.y[j]; cz += s.z[j];
      ax += s.vx[j]; ay += s.vy[j]; az += s.vz[j];
      if (d2 < sep * sep) {
        sx -= dx / d2;
        sy -= dy / d2;
        sz -= dz / d2;
      }
    }
    let fx = sx * 1.4;
    let fy = sy * 1.4;
    let fz = sz * 1.4;
    if (neighbors > 0) {
      fx += (cx / neighbors - ix) * 0.35 + (ax / neighbors - s.vx[i]) * 0.25;
      fy += (cy / neighbors - iy) * 0.35 + (ay / neighbors - s.vy[i]) * 0.25;
      fz += (cz / neighbors - iz) * 0.35 + (az / neighbors - s.vz[i]) * 0.25;
    }
    // Keep the school on the reef and under the surface (anchor.y is negative).
    fx += (s.ax - ix) * 0.15;
    fy += (s.ay - iy) * 0.2;
    fz += (s.az - iz) * 0.15;
    s.vx[i] = Math.max(-maxSp, Math.min(maxSp, s.vx[i] + fx * dt));
    s.vy[i] = Math.max(-maxSp, Math.min(maxSp, s.vy[i] + fy * dt));
    s.vz[i] = Math.max(-maxSp, Math.min(maxSp, s.vz[i] + fz * dt));
    s.x[i] = ix + s.vx[i] * dt;
    s.y[i] = iy + s.vy[i] * dt;
    s.z[i] = iz + s.vz[i] * dt;
    const ox = s.x[i] - s.ax, oy = s.y[i] - s.ay, oz = s.z[i] - s.az;
    const od = Math.hypot(ox, oy, oz);
    if (od > s.radius) {
      const k = s.radius / od;
      s.x[i] = s.ax + ox * k;
      s.y[i] = s.ay + oy * k;
      s.z[i] = s.az + oz * k;
    }
    if (s.y[i] > -0.6) s.y[i] = -0.6;
  }
}
