import * as THREE from 'three';

export interface SwimInput {
  /** -1..1, positive = forward in facing direction */
  forward: number;
  /** -1..1, positive = right */
  strafe: number;
  sprint: boolean;
  /** Used to trigger climb-out or surface dive */
  jump: boolean;
  /** Optional look yaw (radians). If omitted, facing is derived from movement. */
  lookYaw?: number;
}

export interface TerrainHeightFn {
  (x: number, z: number): number;
}

export type Quality = 'low' | 'medium' | 'high';

/** The game's own player controller. The game copies the mesh from it every frame, so swimming moves this. */
export interface PlayerController {
  /** Game-owned world position. */
  position: THREE.Vector3;
  /** Optional velocity the game may read (m/s). */
  velocity?: THREE.Vector3;
}

export interface SwimOptions {
  quality?: Quality;
  seaLevel?: number;
  /** Offset from mesh origin to approximate foot height when standing. */
  footOffset?: number;
  /** Depth at which chest is submerged → switch to full swim. */
  chestDepth?: number;
  /** Optional list of ladder world positions (for climb-out). */
  ladders?: THREE.Vector3[];
  /** The game's player controller: the swimmer's world position is read from and written to it
   *  (default: the mesh). An Object3D proxy works too. */
  body?: PlayerController;
  /** Object pitched face-down while swimming (default: the hips bone). */
  rig?: THREE.Object3D;
  /** Parent for the world-space splash particles (default: mesh.parent). */
  fxParent?: THREE.Object3D;
}
