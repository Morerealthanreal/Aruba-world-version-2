// Thin, typed-loosely handle on the live game (version A).
// A exposes `window.game` once boot finishes. Everything the add-ons touch goes
// through here, so when A's original source arrives this file is the only place
// that needs to change (swap the window lookups for real imports).
import type { Scene, WebGLRenderer, PerspectiveCamera, Object3D, Material, Vector3 } from "three";

export type GameState = {
  mode: "walk" | "car" | "moto" | "plane";
  car: { x: number; z: number; y: number; h: number; speed?: number };
  walk: { x: number; z: number; y: number };
  plane: { x: number; z: number; y: number; h: number };
};

export type ASky = {
  sun: import("three").DirectionalLight;
  bounce: import("three").HemisphereLight;
  fog: import("three").FogExp2;
  sunDir: Vector3;
  theta: number;
  horizon: import("three").Color;
};

export type AGame = {
  ready: boolean;
  scene: Scene;
  renderer: WebGLRenderer;
  camera: PerspectiveCamera;
  S: GameState;
  car: Object3D | null;
  DATA?: import("./minimap").MapData;
  nearestRoad?: (x: number, z: number) => { x: number; z: number; h: number; y?: number };
  real: {
    q: { name: "low" | "med" | "high"; dpr: number; shadow: number };
    sky: ASky;
    buildings: { wall: Material; kmat?: Record<string, Material> };
    veg: { mLamp: Material; group: Object3D };
    brands?: { list: Array<{ x: number; z: number; name: string; sign: string; cat: string; pylon?: [number, number]; [k: string]: unknown }> };
  } | null;
};

declare global {
  interface Window {
    game?: AGame;
    __fps?: number;
    __noPost?: boolean;
    __aw?: Record<string, unknown>;
  }
}

export function whenGameReady(): Promise<AGame> {
  return new Promise((resolve) => {
    const tick = () => {
      const g = window.game;
      if (g && g.ready && g.real && g.real.sky && g.real.sky.sun) resolve(g);
      else setTimeout(tick, 250);
    };
    tick();
  });
}

export const params = new URLSearchParams(location.search);
