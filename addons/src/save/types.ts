export type VehicleMode = 'walk' | 'boat' | 'heli' | 'car' | 'moto' | 'plane';
export type Quality = 'low' | 'medium' | 'high';

export interface SaveState {
  version: number;
  position: { x: number; y: number; z: number };
  vehicle: VehicleMode;
  timeOfDay: number; // 0..1 or hours
  quality: Quality;
  volume: number;    // 0..1
  invertY: boolean;
}

export interface SaveHooks {
  getState: () => Omit<SaveState, 'version'>;
  applyState: (state: SaveState) => void;
  setPaused: (paused: boolean) => void;
  resetPosition: () => void;
  onQualityChange?: (q: Quality) => void;
  onVolumeChange?: (v: number) => void;
  onInvertYChange?: (invert: boolean) => void;
  /** Live quality when no save exists yet. */
  initialQuality?: Quality;
}

export const SCHEMA_VERSION = 1;
export const STORAGE_KEY = 'aruba-world-save-v1';
