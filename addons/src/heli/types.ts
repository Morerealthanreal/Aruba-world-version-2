import * as THREE from 'three';

export interface HeliInput {
  /** 0..1 collective (vertical thrust) */
  collective: number;
  /** -1..1 cyclic pitch (nose up/down) */
  cyclicPitch: number;
  /** -1..1 cyclic roll */
  cyclicRoll: number;
  /** -1..1 tail rotor yaw */
  yaw: number;
  /** Engine on/off */
  engine: boolean;
}

export interface TerrainHeightFn {
  (x: number, z: number): number;
}

export type Quality = 'low' | 'medium' | 'high';

export interface HeliOptions {
  quality?: Quality;
  position?: THREE.Vector3;
  /** World-space parent for the rotor-wash particles (normally the scene). Defaults to the group's parent. */
  fxParent?: THREE.Object3D | null;
}

export interface PlayerController {
  position: THREE.Vector3;
}
