export type Quality = 'low' | 'medium' | 'high';

export interface OceanOptions {
  quality?: Quality;
  seaLevel?: number;
  /** World-space center of the ocean volume (island is far from origin). */
  center?: { x: number; z: number };
  /** Half-extent of the ocean in metres. */
  extent?: number;
  /** Provided once; sampled into the depth texture at construction. */
  heightFn: (x: number, z: number) => number;
}

export interface WaveHeightFn {
  (x: number, z: number, t: number): number;
}
