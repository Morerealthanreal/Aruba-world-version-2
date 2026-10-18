import type { Quality, SaveState, VehicleMode } from "./types.ts";
import { SCHEMA_VERSION } from "./types.ts";

const MODES: readonly VehicleMode[] = ["walk", "boat", "heli", "car", "moto", "plane"];
const QUALITY: readonly Quality[] = ["low", "medium", "high"];

function num(v: unknown): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/** JSON for localStorage. Returns null when the blob is not this schema. */
export function decodeSave(raw: string): SaveState | null {
  let parsed: unknown;
  try { parsed = JSON.parse(raw); } catch { return null; }
  if (!parsed || typeof parsed !== "object") return null;
  const p = parsed as Partial<SaveState> & { position?: { x?: unknown; y?: unknown; z?: unknown } };
  if (p.version !== SCHEMA_VERSION || !p.position) return null;
  const x = num(p.position.x), y = num(p.position.y), z = num(p.position.z);
  const timeOfDay = num(p.timeOfDay);
  if (x === null || y === null || z === null || timeOfDay === null) return null;
  if (typeof p.vehicle !== "string" || !MODES.includes(p.vehicle as VehicleMode)) return null;
  const quality = QUALITY.includes(p.quality as Quality) ? p.quality as Quality : "high";
  const volume = num(p.volume);
  return {
    version: SCHEMA_VERSION,
    position: { x, y, z },
    vehicle: p.vehicle as VehicleMode,
    timeOfDay,
    quality,
    volume: volume === null ? 0.8 : Math.min(1, Math.max(0, volume)),
    invertY: !!p.invertY,
  };
}

export function encodeSave(state: SaveState): string {
  return JSON.stringify(state);
}
