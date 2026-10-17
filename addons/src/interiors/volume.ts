// Doorway volumes for on-foot collision. Pure math, no Three.js.
// A point is "open" when the player may stand there even though the building
// footprint polygon would otherwise block them: the doorway and the room,
// minus counters and tables.

export type Frame = {
  mx: number;
  mz: number;
  ux: number;
  uz: number;
  nx: number;
  nz: number;
  halfW: number;
  depth: number;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  /** Door centre, metres along the front from the frame origin. */
  doorAt?: number;
  /** How far the open mouth reaches outside (negative) and inside the front. */
  mouthOut?: number;
  mouthIn?: number;
  /** World-space footprint. The room stays inside it; the mouth may cross the front edge. */
  poly?: [number, number][];
};

export type Box = { a0: number; a1: number; d0: number; d1: number };

export function frameFromEdge(foot: [number, number][], i0: number, i1: number): Frame {
  const a = foot[i0], b = foot[i1];
  const dx = b[0] - a[0], dz = b[1] - a[1];
  const len = Math.hypot(dx, dz) || 1;
  const ux = dx / len, uz = dz / len;
  let nx = -uz, nz = ux;
  const mx = (a[0] + b[0]) * 0.5, mz = (a[1] + b[1]) * 0.5;
  let cx = 0, cz = 0;
  for (const p of foot) { cx += p[0]; cz += p[1]; }
  cx /= foot.length; cz /= foot.length;
  if ((cx - mx) * nx + (cz - mz) * nz < 0) { nx = -nx; nz = -nz; }
  let depth = 0;
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const p of foot) {
    depth = Math.max(depth, (p[0] - mx) * nx + (p[1] - mz) * nz);
    minX = Math.min(minX, p[0]); maxX = Math.max(maxX, p[0]);
    minZ = Math.min(minZ, p[1]); maxZ = Math.max(maxZ, p[1]);
  }
  // door mouth sticks out past the front wall
  minX -= 1.6; maxX += 1.6; minZ -= 1.6; maxZ += 1.6;
  return { mx, mz, ux, uz, nx, nz, halfW: len * 0.5, depth, minX, maxX, minZ, maxZ };
}

/** Rotate a hero-local frame into world XZ. rot is the hero's rotation.y. */
export function worldFrame(local: Frame, ox: number, oz: number, rot: number): Frame {
  const c = Math.cos(rot), s = Math.sin(rot);
  const rx = (x: number, z: number) => ox + c * x + s * z;
  const rz = (x: number, z: number) => oz - s * x + c * z;
  const corners: [number, number][] = [
    [local.mx + local.ux * local.halfW, local.mz + local.uz * local.halfW],
    [local.mx - local.ux * local.halfW, local.mz - local.uz * local.halfW],
    [local.mx + local.nx * local.depth, local.mz + local.nz * local.depth],
    [local.mx + local.nx * local.depth + local.ux * local.halfW, local.mz + local.nz * local.depth + local.uz * local.halfW],
    [local.mx + local.nx * local.depth - local.ux * local.halfW, local.mz + local.nz * local.depth - local.uz * local.halfW],
    [local.mx - local.nx * 1.4, local.mz - local.nz * 1.4],
  ];
  let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const p of corners) {
    const x = rx(p[0], p[1]), z = rz(p[0], p[1]);
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minZ = Math.min(minZ, z); maxZ = Math.max(maxZ, z);
  }
  return {
    mx: rx(local.mx, local.mz),
    mz: rz(local.mx, local.mz),
    ux: c * local.ux + s * local.uz,
    uz: -s * local.ux + c * local.uz,
    nx: c * local.nx + s * local.nz,
    nz: -s * local.nx + c * local.nz,
    halfW: local.halfW,
    depth: local.depth,
    minX: minX - 0.5, maxX: maxX + 0.5, minZ: minZ - 0.5, maxZ: maxZ + 0.5,
    doorAt: local.doorAt,
    mouthOut: local.mouthOut,
    mouthIn: local.mouthIn,
  };
}

/** Inset of the cleared floor from the room edges, in metres. The shader uses the same front inset. */
export const ROOM_FRONT = 0.1;
export const ROOM_SIDE = 0.2;
export const ROOM_BACK = 0.15;

/**
 * True when (x,z) is on the interior floor, inside the footprint.
 * The doorway sidewalk stays outside this so the street keeps its terrain.
 */
export function inRoom(f: Frame, x: number, z: number): boolean {
  if (x < f.minX || x > f.maxX || z < f.minZ || z > f.maxZ) return false;
  const dx = x - f.mx, dz = z - f.mz;
  const along = dx * f.ux + dz * f.uz;
  const inward = dx * f.nx + dz * f.nz;
  if (Math.abs(along) >= f.halfW - ROOM_SIDE) return false;
  if (inward <= ROOM_FRONT || inward >= f.depth - ROOM_BACK) return false;
  if (f.poly && !inPoly(f.poly, x, z)) return false;
  return true;
}

function inPoly(poly: [number, number][], x: number, z: number): boolean {
  let c = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const xi = poly[i][0], zi = poly[i][1];
    const xj = poly[j][0], zj = poly[j][1];
    const dz = zj - zi;
    if ((zi > z) === (zj > z) || dz === 0) continue;
    if (x < ((xj - xi) * (z - zi)) / dz + xi) c = !c;
  }
  return c;
}

/**
 * True when (x,z) is inside the walkable shop (door mouth or room) and not
 * inside a solid obstacle. wall is the thickness that stays blocked.
 */
export function isOpen(f: Frame, obs: Box[], x: number, z: number, doorHalf: number, wall: number): boolean {
  if (x < f.minX || x > f.maxX || z < f.minZ || z > f.maxZ) return false;
  const dx = x - f.mx, dz = z - f.mz;
  const along = dx * f.ux + dz * f.uz;
  const inward = dx * f.nx + dz * f.nz;
  const doorAt = f.doorAt ?? 0;
  const mouthOut = f.mouthOut ?? -1.25;
  const mouthIn = f.mouthIn ?? 1.8;
  // Mouth is only the sidewalk crossing. The room is the footprint, so a
  // neighbour that shares a wall stays solid.
  const mouth = Math.abs(along - doorAt) < doorHalf - 0.06 && inward > mouthOut && inward < mouthIn;
  const room = Math.abs(along) < f.halfW - wall && inward > wall && inward < f.depth - wall
    && (!f.poly || inPoly(f.poly, x, z));
  if (!mouth && !room) return false;
  for (let i = 0; i < obs.length; i++) {
    const o = obs[i];
    if (along > o.a0 && along < o.a1 && inward > o.d0 && inward < o.d1) return false;
  }
  return true;
}
