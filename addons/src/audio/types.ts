export type Surface = 'sand' | 'asphalt' | 'dirt' | 'grass' | 'wood' | 'concrete' | 'water';

export interface AmbientZone {
  /** World XZ center (island is far from origin) */
  x: number;
  z: number;
  radius: number;
  /** Buffer or URL key already loaded by the game */
  sound: string;
  volume: number;
  loop: boolean;
}

export interface AudioOptions {
  quality?: 'low' | 'medium' | 'high';
  zones?: AmbientZone[];
}

export interface EngineState {
  rpm: number;      // 0..1
  load: number;     // 0..1
  on: boolean;
}
