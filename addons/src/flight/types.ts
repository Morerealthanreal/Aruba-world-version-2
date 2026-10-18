import * as THREE from 'three';

export interface FlightInput {
  /** -1..1 throttle */
  throttle: number;
  /** -1..1 elevator (positive = nose up rate) */
  elevator: number;
  /** -1..1 aileron (positive = right bank) */
  aileron: number;
  /** -1..1 rudder */
  rudder: number;
  /** Toggle gear */
  gear: boolean;
}

export interface TerrainHeightFn {
  (x: number, z: number): number;
}

export type Quality = 'low' | 'medium' | 'high';

export interface FlightOptions {
  quality?: Quality;
  seaLevel?: number;
  position?: THREE.Vector3;
}
