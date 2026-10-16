// Walk-in interiors. Famous places stop being solid labelled boxes: when the
// player is near, a code-built interior is shown and a doorway is cut into the
// hero wall. Footprint collision stays solid everywhere except that doorway
// and the walkable floor (counters and tables still block).
// Off with ?interiors=0. Far away nothing is built and the door shader is off.
import { Group, Vector2, type Material, type Mesh, type Object3D } from "three";
import type { AGame } from "./env";
import { chainPatch } from "./nightLights";
import { buildPastechi, PASTECHI_OBS, PASTECHI_POLY, PASTECHI_X, PASTECHI_Z, pastechiLocal } from "./interiors/pastechi";
import { isOpen, worldFrame, type Box, type Frame } from "./interiors/volume";

type Shader = { uniforms: Record<string, { value: unknown }>; vertexShader: string; fragmentShader: string };

type Place = {
  id: string;
  x: number;
  z: number;
  rot: number;
  local: Frame;
  world: Frame;
  doorHalf: number;
  doorTop: number;
  wall: number;
  obs: Box[];
  show: number;
  hide: number;
  build: (g: Group, local: Frame) => void;
  group: Group | null;
  floorY: number;
  doorOn: { value: number };
  uU: { value: Vector2 };
  uN: { value: Vector2 };
  uM: { value: Vector2 };
  uY: { value: number };
  patched: boolean;
};

function placePastechi(): Place {
  const world = worldFrame(pastechiLocal, PASTECHI_X, PASTECHI_Z, 0);
  world.poly = PASTECHI_POLY;
  const doorAt = world.doorAt ?? 0;
  return {
    id: "pastechihouse",
    x: PASTECHI_X,
    z: PASTECHI_Z,
    rot: 0,
    local: pastechiLocal,
    world,
    doorHalf: 2.35,
    doorTop: 2.32,
    wall: 0.34,
    obs: PASTECHI_OBS,
    show: 72,
    hide: 96,
    build: buildPastechi,
    group: null,
    floorY: 0,
    doorOn: { value: 0 },
    uU: { value: new Vector2(world.ux, world.uz) },
    uN: { value: new Vector2(world.nx, world.nz) },
    uM: { value: new Vector2(world.mx + world.ux * doorAt, world.mz + world.uz * doorAt) },
    uY: { value: 0 },
    patched: false,
  };
}

const DOOR_FRAG = `
  if (awDoorOn > 0.5) {
    float awAlong = dot(vAwW.xz - awDoorM, awDoorU);
    float awSide = dot(vAwW.xz - awDoorM, awDoorN);
    if (abs(awSide) < 0.55 && abs(awAlong) < awDoorHalf && vAwW.y > awDoorY - 0.15 && vAwW.y < awDoorY + awDoorTop) discard;
  }`;

export class Interiors {
  places: Place[];
  constructor(private g: AGame) {
    this.places = [placePastechi()];
    const w = window as unknown as { __awDoor?: (x: number, z: number) => boolean };
    w.__awDoor = (x, z) => this.open(x, z);
  }

  /** True when footprint collision should let the pedestrian through. */
  open(x: number, z: number): boolean {
    const ps = this.places;
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      if (isOpen(p.world, p.obs, x, z, p.doorHalf, p.wall)) return true;
    }
    return false;
  }

  stats() {
    return this.places.map((p) => ({
      id: p.id,
      built: !!p.group,
      visible: !!p.group?.visible,
      patched: p.patched,
      door: p.doorOn.value,
      y: +p.floorY.toFixed(2),
    }));
  }

  update() {
    const S = this.g.S as { mode: string; walk: { x: number; z: number }; car: { x: number; z: number }; plane: { x: number; z: number } };
    const e = S.mode === "walk" ? S.walk : S.mode === "plane" ? S.plane : S.car;
    const ps = this.places;
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      const dist = Math.hypot(e.x - p.x, e.z - p.z);
      if (!p.group) {
        if (dist < p.show + 20) this.ensure(p);
      } else {
        const on = p.group.visible ? dist < p.hide : dist < p.show;
        if (p.group.visible !== on) p.group.visible = on;
        const door = on ? 1 : 0;
        if (p.doorOn.value !== door) p.doorOn.value = door;
        if (!p.patched && dist < p.show + 40) this.patchHero(p);
      }
    }
  }

  private ensure(p: Place) {
    const h = (this.g.real as unknown as { heightAt?: (x: number, z: number) => number }).heightAt?.(p.x, p.z);
    if (!Number.isFinite(h)) return;
    const g = new Group();
    g.name = "aw:interior:" + p.id;
    g.position.set(p.x, h as number, p.z);
    g.rotation.y = p.rot;
    p.build(g, p.local);
    g.traverse((o) => {
      const m = o as Mesh;
      if (m.isMesh) { m.castShadow = false; m.receiveShadow = false; m.matrixAutoUpdate = false; m.updateMatrix(); }
    });
    g.updateMatrixWorld(true);
    this.g.scene.add(g);
    p.group = g;
    p.floorY = h as number;
    p.uY.value = h as number;
    p.group.visible = true;
    p.doorOn.value = 1;
    this.patchHero(p);
  }

  private patchHero(p: Place) {
    const hero = (this.g.real as unknown as { hero?: { list?: Array<{ k?: string; id?: string; _g?: Object3D }> } }).hero;
    const entry = hero?.list?.find((n) => n.k === p.id || n.id === p.id);
    if (!entry?._g) return;
    const doorOn = p.doorOn, uU = p.uU, uN = p.uN, uM = p.uM, uY = p.uY;
    const half = { value: p.doorHalf }, top = { value: p.doorTop };
    entry._g.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh || !mesh.material) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of mats) this.patchMat(mat, doorOn, uU, uN, uM, uY, half, top);
    });
    p.patched = true;
  }

  private patchMat(
    mat: Material,
    doorOn: { value: number },
    uU: { value: Vector2 },
    uN: { value: Vector2 },
    uM: { value: Vector2 },
    uY: { value: number },
    half: { value: number },
    top: { value: number },
  ) {
    const name = mat.name || "";
    if (name !== "ground" && name !== "lwall") return;
    chainPatch(mat, "door-" + name, (s: Shader) => {
      if (!s.vertexShader.includes("#include <begin_vertex>")) return;
      if (!s.fragmentShader.includes("#include <clipping_planes_fragment>")) return;
      s.uniforms.awDoorOn = doorOn;
      s.uniforms.awDoorU = uU;
      s.uniforms.awDoorN = uN;
      s.uniforms.awDoorM = uM;
      s.uniforms.awDoorY = uY;
      s.uniforms.awDoorHalf = half;
      s.uniforms.awDoorTop = top;
      s.vertexShader = s.vertexShader
        .replace("#include <common>", "#include <common>\nvarying vec3 vAwW;")
        .replace("#include <begin_vertex>", "#include <begin_vertex>\n  vAwW = (modelMatrix * vec4(transformed, 1.0)).xyz;");
      s.fragmentShader = s.fragmentShader
        .replace("#include <common>", `#include <common>
uniform float awDoorOn;
uniform vec2 awDoorU;
uniform vec2 awDoorN;
uniform vec2 awDoorM;
uniform float awDoorY;
uniform float awDoorHalf;
uniform float awDoorTop;
varying vec3 vAwW;`)
        .replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>\n" + DOOR_FRAG);
    });
  }
}
