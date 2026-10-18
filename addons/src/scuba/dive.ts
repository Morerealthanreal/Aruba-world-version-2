// Buoyancy and air for a scuba diver. Mutates the state in place. No allocation.

export const SEA_LEVEL = 0;
export const AIR_SECONDS = 90;
export const SWIM_SPEED = 2.2;

export type DiveState = {
  y: number;
  vy: number;
  air: number;
  diving: boolean;
};

export function createDive(y = -3): DiveState {
  return { y, vy: 0, air: AIR_SECONDS, diving: true };
}

/** up/down are 0 or 1. Positive up climbs toward the surface. */
export function stepDive(s: DiveState, dt: number, up: number, down: number, surface = SEA_LEVEL): void {
  if (!s.diving || dt <= 0) return;
  const depth = surface - s.y;
  if (depth > 0.4) s.air = Math.max(0, s.air - dt);
  // With air, buoyancy holds about a metre under the surface. Empty lungs sink.
  const target = s.air > 0 ? surface - 1.1 : surface - 12;
  const thrust = (up - down) * SWIM_SPEED;
  const accel = (target - s.y) * 0.85 + thrust - s.vy * 1.6;
  s.vy = Math.max(-2.5, Math.min(2.5, s.vy + accel * dt));
  s.y += s.vy * dt;
  if (s.y >= surface - 0.2 && down <= 0) {
    s.y = surface - 0.05;
    s.vy = Math.min(0, s.vy);
    s.air = Math.min(AIR_SECONDS, s.air + dt * 6);
  }
}
