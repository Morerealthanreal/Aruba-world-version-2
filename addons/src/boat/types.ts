import * as THREE from 'three';

export interface BoatInput {
  /** -1..1, positive = forward throttle */
  throttle: number;
  /** -1..1, positive = right rudder */
  steer: number;
  /** True while enter/exit key or touch is held */
  interact: boolean;
}

export interface WaveHeightFn {
  (x: number, z: number, t: number): number;
}

export interface TerrainHeightFn {
  (x: number, z: number): number;
}

export type Quality = 'low' | 'medium' | 'high';

export interface BoatOptions {
  quality?: Quality;
  seaLevel?: number;
  /** World position to spawn the boat */
  position?: THREE.Vector3;
  /** Parent for the world-space wake quads (default: the scene the boat group is added to is unknown
   *  at construction, so pass the scene here; falls back to the boat group). */
  fxParent?: THREE.Object3D;
}
