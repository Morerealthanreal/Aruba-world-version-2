// Walk-in interiors. Famous places stop being solid labelled boxes: when the
// player is near, a code-built interior is shown and a doorway is cut into the
// hero wall. Footprint collision stays solid everywhere except that doorway
// and the walkable floor (counters and tables still block).
// Off with ?interiors=0. Far away nothing is built and the door shader is off.
import { Group, Vector2, type Material, type Mesh, type Object3D } from "three";
import type { AGame } from "./env";
import { chainPatch } from "./nightLights";
import { buildPastechi, PASTECHI_OBS, PASTECHI_POLY, PASTECHI_X, PASTECHI_Z, pastechiLocal } from "./interiors/pastechi";
import { buildMcdonalds, MCD_DOOR_HALF, MCD_DOOR_TOP, MCD_OBS, MCD_POLY, MCD_X, MCD_Z, mcdLocal } from "./interiors/mcdonalds";
import { buildStarbucks, SBX_DOOR_HALF, SBX_DOOR_TOP, SBX_OBS, SBX_POLY, SBX_X, SBX_Z, sbxLocal } from "./interiors/starbucks";
import { buildPlaza, PB_DOOR_HALF, PB_DOOR_TOP, PB_OBS, PB_POLY, PB_X, PB_Z, pbLocal } from "./interiors/plaza";
import { buildHardrock, HR_DOOR_HALF, HR_DOOR_TOP, HR_OBS, HR_POLY, HR_X, HR_Z, hrLocal } from "./interiors/hardrock";
import { buildRadisson, RD_DOOR_HALF, RD_DOOR_TOP, RD_OBS, RD_POLY, RD_X, RD_Z, rdLocal } from "./interiors/radisson";
import { buildHyatt, HY_DOOR_HALF, HY_DOOR_TOP, HY_OBS, HY_POLY, HY_X, HY_Z, hyLocal } from "./interiors/hyatt";
import { buildHilton, HT_DOOR_HALF, HT_DOOR_TOP, HT_OBS, HT_POLY, HT_X, HT_Z, htLocal } from "./interiors/hilton";
import { buildMarriott, MR_DOOR_HALF, MR_DOOR_TOP, MR_OBS, MR_POLY, MR_X, MR_Z, mrLocal } from "./interiors/marriott";
import { buildSenorfrogs, SF_DOOR_HALF, SF_DOOR_TOP, SF_OBS, SF_POLY, SF_X, SF_Z, sfLocal } from "./interiors/senorfrogs";
import { buildMoomba, MB_DOOR_HALF, MB_DOOR_TOP, MB_OBS, MB_POLY, MB_X, MB_Z, mbLocal } from "./interiors/moomba";
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
  /** How far through the wall, in metres, the opening cuts. */
  doorSide: number;
  wall: number;
  obs: Box[];
  /** Hero materials the doorway is cut through. */
  cut: string[];
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
  /** Terrain sample for the floor. Defaults to the hero centroid. */
  floorAt?: { x: number; z: number };
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
    doorSide: 0.55,
    wall: 0.34,
    obs: PASTECHI_OBS,
    cut: ["ground", "lwall"],
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

function placeMcdonalds(): Place {
  const world = worldFrame(mcdLocal, MCD_X, MCD_Z, 0);
  world.poly = MCD_POLY;
  const doorAt = world.doorAt ?? 0;
  return {
    id: "mcd1",
    x: MCD_X,
    z: MCD_Z,
    rot: 0,
    local: mcdLocal,
    world,
    doorHalf: MCD_DOOR_HALF,
    doorTop: MCD_DOOR_TOP,
    doorSide: 0.55,
    wall: 0.34,
    obs: MCD_OBS,
    cut: ["ground", "lwall"],
    show: 90,
    hide: 120,
    build: buildMcdonalds,
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

function placeStarbucks(): Place {
  const world = worldFrame(sbxLocal, SBX_X, SBX_Z, 0);
  world.poly = SBX_POLY;
  const doorAt = world.doorAt ?? 0;
  return {
    id: "starbucks2",
    x: SBX_X,
    z: SBX_Z,
    rot: 0,
    local: sbxLocal,
    world,
    doorHalf: SBX_DOOR_HALF,
    doorTop: SBX_DOOR_TOP,
    doorSide: 0.55,
    wall: 0.34,
    obs: SBX_OBS,
    cut: ["ground", "lwall"],
    show: 90,
    hide: 120,
    build: buildStarbucks,
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

function placePlaza(): Place {
  const world = worldFrame(pbLocal, PB_X, PB_Z, 0);
  world.poly = PB_POLY;
  const doorAt = world.doorAt ?? 0;
  return {
    id: "pbplaza",
    x: PB_X,
    z: PB_Z,
    rot: 0,
    local: pbLocal,
    world,
    doorHalf: PB_DOOR_HALF,
    doorTop: PB_DOOR_TOP,
    doorSide: 1.25,
    wall: 0.4,
    obs: PB_OBS,
    cut: ["glass", "rot", "ground", "lwall"],
    show: 110,
    hide: 140,
    build: buildPlaza,
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

function placeHardrock(): Place {
  const world = worldFrame(hrLocal, HR_X, HR_Z, 0);
  world.poly = HR_POLY;
  const doorAt = world.doorAt ?? 0;
  return {
    id: "hardrock_pb",
    x: HR_X,
    z: HR_Z,
    rot: 0,
    local: hrLocal,
    world,
    doorHalf: HR_DOOR_HALF,
    doorTop: HR_DOOR_TOP,
    doorSide: 0.55,
    wall: 0.34,
    obs: HR_OBS,
    cut: ["ground", "lwall"],
    show: 80,
    hide: 110,
    build: buildHardrock,
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

function placeRadisson(): Place {
  const world = worldFrame(rdLocal, RD_X, RD_Z, 0);
  world.poly = RD_POLY;
  const doorAt = world.doorAt ?? 0;
  return {
    id: "radisson",
    x: RD_X,
    z: RD_Z,
    rot: 0,
    local: rdLocal,
    world,
    doorHalf: RD_DOOR_HALF,
    doorTop: RD_DOOR_TOP,
    doorSide: 0.55,
    wall: 0.34,
    obs: RD_OBS,
    cut: ["ground", "lwall"],
    show: 100,
    hide: 130,
    build: buildRadisson,
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

function placeHyatt(): Place {
  const world = worldFrame(hyLocal, HY_X, HY_Z, 0);
  world.poly = HY_POLY;
  const doorAt = world.doorAt ?? 0;
  return {
    id: "hyatt",
    x: HY_X,
    z: HY_Z,
    rot: 0,
    local: hyLocal,
    world,
    doorHalf: HY_DOOR_HALF,
    doorTop: HY_DOOR_TOP,
    doorSide: 0.55,
    wall: 0.34,
    obs: HY_OBS,
    cut: ["ground", "lwall"],
    show: 110,
    hide: 140,
    build: buildHyatt,
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

function placeHilton(): Place {
  const world = worldFrame(htLocal, HT_X, HT_Z, 0);
  world.poly = HT_POLY;
  const doorAt = world.doorAt ?? 0;
  return {
    id: "hilton",
    x: HT_X,
    z: HT_Z,
    rot: 0,
    local: htLocal,
    world,
    doorHalf: HT_DOOR_HALF,
    doorTop: HT_DOOR_TOP,
    doorSide: 0.55,
    wall: 0.34,
    obs: HT_OBS,
    cut: ["ground", "lwall"],
    show: 120,
    hide: 155,
    build: buildHilton,
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

function placeMarriott(): Place {
  const world = worldFrame(mrLocal, MR_X, MR_Z, 0);
  world.poly = MR_POLY;
  const doorAt = world.doorAt ?? 0;
  return {
    id: "marriott",
    x: MR_X,
    z: MR_Z,
    rot: 0,
    local: mrLocal,
    world,
    doorHalf: MR_DOOR_HALF,
    doorTop: MR_DOOR_TOP,
    doorSide: 0.55,
    wall: 0.34,
    obs: MR_OBS,
    cut: [],
    show: 150,
    hide: 185,
    floorAt: { x: -8051.89, z: -6773.95 },
    build: buildMarriott,
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

function placeSenorfrogs(): Place {
  const world = worldFrame(sfLocal, SF_X, SF_Z, 0);
  world.poly = SF_POLY;
  const doorAt = world.doorAt ?? 0;
  return {
    id: "senorfrogs",
    x: SF_X,
    z: SF_Z,
    rot: 0,
    local: sfLocal,
    world,
    doorHalf: SF_DOOR_HALF,
    doorTop: SF_DOOR_TOP,
    doorSide: 0.55,
    wall: 0.34,
    obs: SF_OBS,
    cut: ["ground", "lwall"],
    show: 60,
    hide: 85,
    build: buildSenorfrogs,
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

function placeMoomba(): Place {
  const world = worldFrame(mbLocal, MB_X, MB_Z, 0);
  world.poly = MB_POLY;
  const doorAt = world.doorAt ?? 0;
  return {
    id: "moomba",
    x: MB_X,
    z: MB_Z,
    rot: 0,
    local: mbLocal,
    world,
    doorHalf: MB_DOOR_HALF,
    doorTop: MB_DOOR_TOP,
    doorSide: 0.55,
    wall: 0.34,
    obs: MB_OBS,
    cut: ["ground", "lwall"],
    show: 70,
    hide: 95,
    floorAt: { x: -8112.88, z: -6328.23 },
    build: buildMoomba,
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
    if (abs(awSide) < awDoorSide && abs(awAlong) < awDoorHalf && vAwW.y > awDoorY - 0.15 && vAwW.y < awDoorY + awDoorTop) discard;
  }`;

export class Interiors {
  places: Place[];
  /** Hero materials sometimes ignore the first needsUpdate after they have already compiled. */
  private rebake = new Map<Material, number>();
  constructor(private g: AGame) {
    this.places = [placePastechi(), placeMcdonalds(), placeStarbucks(), placePlaza(), placeHardrock(), placeRadisson(), placeHyatt(), placeHilton(), placeMarriott(), placeSenorfrogs(), placeMoomba()];
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
    if (this.rebake.size) {
      for (const [mat, n] of this.rebake) {
        mat.needsUpdate = true;
        if (n <= 1) this.rebake.delete(mat);
        else this.rebake.set(mat, n - 1);
      }
    }
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
        // Terrain can still be the fallback height when the room is first built.
        this.settleFloor(p);
      }
    }
  }

  /** Drop the room onto the hero once heightAt has the real ground. */
  private settleFloor(p: Place) {
    if (!p.group) return;
    const ax = p.floorAt?.x ?? p.x;
    const az = p.floorAt?.z ?? p.z;
    const h = (this.g.real as unknown as { heightAt?: (x: number, z: number) => number }).heightAt?.(ax, az);
    if (!Number.isFinite(h) || Math.abs((h as number) - p.floorY) < 0.35) return;
    p.group.position.y = h as number;
    p.group.updateMatrixWorld(true);
    p.floorY = h as number;
    p.uY.value = h as number;
  }

  private ensure(p: Place) {
    const ax = p.floorAt?.x ?? p.x;
    const az = p.floorAt?.z ?? p.z;
    const h = (this.g.real as unknown as { heightAt?: (x: number, z: number) => number }).heightAt?.(ax, az);
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
    const half = { value: p.doorHalf }, top = { value: p.doorTop }, side = { value: p.doorSide };
    entry._g.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh || !mesh.material) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of mats) this.patchMat(mat, p.cut, doorOn, uU, uN, uM, uY, half, top, side);
    });
    p.patched = true;
  }

  private patchMat(
    mat: Material,
    cut: string[],
    doorOn: { value: number },
    uU: { value: Vector2 },
    uN: { value: Vector2 },
    uM: { value: Vector2 },
    uY: { value: number },
    half: { value: number },
    top: { value: number },
    side: { value: number },
  ) {
    const name = mat.name || "";
    if (cut.indexOf(name) < 0) return;
    this.rebake.set(mat, 4);
    mat.needsUpdate = true;
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
      s.uniforms.awDoorSide = side;
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
uniform float awDoorSide;
varying vec3 vAwW;`)
        .replace("#include <clipping_planes_fragment>", "#include <clipping_planes_fragment>\n" + DOOR_FRAG);
    });
  }
}
