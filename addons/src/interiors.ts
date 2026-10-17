// Walk-in interiors. Famous places stop being solid labelled boxes: when the
// player is near, a code-built interior is shown and a doorway is cut into the
// hero wall. Footprint collision stays solid everywhere except that doorway
// and the walkable floor (counters and tables still block).
// Off with ?interiors=0. Far away nothing is built and the door shader is off.
import { Group, Raycaster, Vector2, Vector3, Vector4, type Material, type Mesh, type Object3D } from "three";
import type { AGame } from "./env";
import { chainPatch } from "./nightLights";
import { buildPastechi, PASTECHI_OBS, PASTECHI_POLY, PASTECHI_X, PASTECHI_Z, pastechiLocal } from "./interiors/pastechi";
import { buildMcdonalds, MCD_DOOR_HALF, MCD_DOOR_TOP, MCD_OBS, MCD_POLY, MCD_X, MCD_Z, mcdLocal } from "./interiors/mcdonalds";
import { buildStarbucks, SBX_DOOR_HALF, SBX_DOOR_TOP, SBX_OBS, SBX_POLY, SBX_X, SBX_Z, sbxLocal } from "./interiors/starbucks";
import { buildPlaza, PB_DOOR_HALF, PB_DOOR_TOP, PB_OBS, PB_POLY, PB_X, PB_Z, pbLocal } from "./interiors/plaza";
import { buildHardrock, HR_DOOR_HALF, HR_DOOR_TOP, HR_OBS, HR_POLY, HR_X, HR_Z, hrLocal } from "./interiors/hardrock";
import { buildRadisson, RD_DOOR_HALF, RD_DOOR_TOP, RD_OBS, RD_POLY, RD_X, RD_Z, rdLocal } from "./interiors/radisson";
import { buildHilton, HT_DOOR_HALF, HT_DOOR_TOP, HT_OBS, HT_POLY, HT_X, HT_Z, htLocal } from "./interiors/hilton";
import { buildHyatt, HY_DOOR_HALF, HY_DOOR_TOP, HY_OBS, HY_POLY, HY_X, HY_Z, hyLocal } from "./interiors/hyatt";
import { buildMarriott, MR_DOOR_HALF, MR_DOOR_TOP, MR_OBS, MR_POLY, MR_X, MR_Z, mrLocal } from "./interiors/marriott";
import { buildSenorfrogs, SF_DOOR_HALF, SF_DOOR_TOP, SF_OBS, SF_POLY, SF_X, SF_Z, sfLocal } from "./interiors/senorfrogs";
import { buildMoomba, MB_DOOR_HALF, MB_DOOR_TOP, MB_OBS, MB_POLY, MB_X, MB_Z, mbLocal } from "./interiors/moomba";
import { buildGiannis, GN_DOOR_HALF, GN_DOOR_TOP, GN_OBS, GN_POLY, GN_X, GN_Z, gnLocal } from "./interiors/giannis";
import { buildRenmall, RN_DOOR_HALF, RN_DOOR_TOP, RN_OBS, RN_POLY, RN_X, RN_Z, rnLocal } from "./interiors/renmall";
import { buildRoyalplaza, RP_DOOR_HALF, RP_DOOR_TOP, RP_OBS, RP_POLY, RP_X, RP_Z, rpLocal } from "./interiors/royalplaza";
import { buildSuperfood, SU_DOOR_HALF, SU_DOOR_TOP, SU_OBS, SU_POLY, SU_X, SU_Z, suLocal } from "./interiors/superfood";
import { ROOM_BACK, ROOM_FRONT, ROOM_SIDE, inRoom, isOpen, worldFrame, type Box, type Frame } from "./interiors/volume";

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
  /** A procedural monument shell shares this wall. Cut the same doorway through it. */
  shell?: boolean;
  shellDone?: boolean;
  shellQuiet?: number;
  shellTries?: number;
  shellTick?: number;
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
    floorAt: { x: -8187.45, z: -5306.65 },
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

function placeGiannis(): Place {
  const world = worldFrame(gnLocal, GN_X, GN_Z, 0);
  world.poly = GN_POLY;
  const doorAt = world.doorAt ?? 0;
  return {
    id: "giannis",
    x: GN_X,
    z: GN_Z,
    rot: 0,
    local: gnLocal,
    world,
    doorHalf: GN_DOOR_HALF,
    doorTop: GN_DOOR_TOP,
    doorSide: 0.55,
    wall: 0.34,
    obs: GN_OBS,
    cut: [],
    show: 80,
    hide: 110,
    floorAt: { x: -8171.2, z: -5383.1 },
    build: buildGiannis,
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

function placeRenmall(): Place {
  const world = worldFrame(rnLocal, RN_X, RN_Z, 0);
  world.poly = RN_POLY;
  const doorAt = world.doorAt ?? 0;
  return {
    id: "renmall",
    x: RN_X,
    z: RN_Z,
    rot: 0,
    local: rnLocal,
    world,
    doorHalf: RN_DOOR_HALF,
    doorTop: RN_DOOR_TOP,
    doorSide: 0.55,
    wall: 0.34,
    obs: RN_OBS,
    cut: ["glass", "mullion", "ground"],
    show: 120,
    hide: 155,
    floorAt: { x: -7384.3, z: 22.35 },
    build: buildRenmall,
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

function placeRoyalplaza(): Place {
  const world = worldFrame(rpLocal, RP_X, RP_Z, 0);
  world.poly = RP_POLY;
  const doorAt = world.doorAt ?? 0;
  return {
    id: "royalplaza",
    x: RP_X,
    z: RP_Z,
    rot: 0,
    local: rpLocal,
    world,
    doorHalf: RP_DOOR_HALF,
    doorTop: RP_DOOR_TOP,
    // The monument shell's piers stand about 2.4 m inside the pink wall.
    doorSide: 2.8,
    wall: 0.34,
    obs: RP_OBS,
    cut: ["ground"],
    show: 100,
    hide: 130,
    floorAt: { x: -7545.39, z: -63.2 },
    shell: true,
    build: buildRoyalplaza,
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

function placeSuperfood(): Place {
  const world = worldFrame(suLocal, SU_X, SU_Z, 0);
  world.poly = SU_POLY;
  const doorAt = world.doorAt ?? 0;
  return {
    id: "superfood",
    x: SU_X,
    z: SU_Z,
    rot: 0,
    local: suLocal,
    world,
    doorHalf: SU_DOOR_HALF,
    doorTop: SU_DOOR_TOP,
    doorSide: 0.55,
    wall: 0.34,
    obs: SU_OBS,
    cut: ["glass", "mullion", "ground"],
    show: 120,
    hide: 155,
    floorAt: { x: -8801.75, z: -3545.95 },
    build: buildSuperfood,
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

/** Local Y of each interior floor. Matches the floor quad in that place's builder. */
function floorLift(id: string): number {
  switch (id) {
    case "radisson": return 1.42;
    case "senorfrogs": return 0.52;
    case "giannis": return 0.12;
    case "hilton":
    case "hyatt":
    case "marriott": return 0.08;
    case "moomba":
    case "renmall": return 0.06;
    case "royalplaza": return 0.05;
    case "superfood": return 0.06;
    default: return 0.04;
  }
}

// Terrain under a visible room is discarded. Four slots cover the rooms a player
// can stand near at once; constant indices stay valid on WebGL1.
const ROOM_FRAG = `
  if (awRoomOn > 0.5 && vWP.x > awRoomBox.x && vWP.x < awRoomBox.z && vWP.z > awRoomBox.y && vWP.z < awRoomBox.w) {
    vec2 awD; float awAlong; float awIn;
    awD = vWP.xz - awRoomA[0].xy; awAlong = dot(awD, awRoomB[0].xy); awIn = dot(awD, awRoomB[0].zw);
    if (awRoomA[0].z >= 0.0 && abs(awAlong) < awRoomA[0].z && awIn > ${ROOM_FRONT.toFixed(2)} && awIn < awRoomA[0].w && vWP.y > awRoomY[0].x && vWP.y < awRoomY[0].y) discard;
    awD = vWP.xz - awRoomA[1].xy; awAlong = dot(awD, awRoomB[1].xy); awIn = dot(awD, awRoomB[1].zw);
    if (awRoomA[1].z >= 0.0 && abs(awAlong) < awRoomA[1].z && awIn > ${ROOM_FRONT.toFixed(2)} && awIn < awRoomA[1].w && vWP.y > awRoomY[1].x && vWP.y < awRoomY[1].y) discard;
    awD = vWP.xz - awRoomA[2].xy; awAlong = dot(awD, awRoomB[2].xy); awIn = dot(awD, awRoomB[2].zw);
    if (awRoomA[2].z >= 0.0 && abs(awAlong) < awRoomA[2].z && awIn > ${ROOM_FRONT.toFixed(2)} && awIn < awRoomA[2].w && vWP.y > awRoomY[2].x && vWP.y < awRoomY[2].y) discard;
    awD = vWP.xz - awRoomA[3].xy; awAlong = dot(awD, awRoomB[3].xy); awIn = dot(awD, awRoomB[3].zw);
    if (awRoomA[3].z >= 0.0 && abs(awAlong) < awRoomA[3].z && awIn > ${ROOM_FRONT.toFixed(2)} && awIn < awRoomA[3].w && vWP.y > awRoomY[3].x && vWP.y < awRoomY[3].y) discard;
  }`;

const DOOR_FRAG = `
  if (awDoorOn > 0.5) {
    float awAlong = dot(vAwW.xz - awDoorM, awDoorU);
    float awSide = dot(vAwW.xz - awDoorM, awDoorN);
    if (abs(awSide) < awDoorSide && abs(awAlong) < awDoorHalf && vAwW.y > awDoorY - 0.15 && vAwW.y < awDoorY + awDoorTop) discard;
  }`;

type RealH = {
  heightAt: (x: number, z: number) => number;
  terrain?: { material: (...a: unknown[]) => Material };
  ovMat?: Material;
  regions?: Map<string, { mat?: Material }>;
};

export class Interiors {
  places: Place[];
  /** Terrain materials that discard the sand under a visible room. */
  cleared = 0;
  /** Hero materials sometimes ignore the first needsUpdate after they have already compiled. */
  private rebake = new Map<Material, number>();
  private origH: (x: number, z: number) => number = () => 0;
  private roomOn = { value: 0 };
  private roomBox = new Vector4(1, 1, -1, -1);
  private roomA = [0, 1, 2, 3].map(() => new Vector4(0, 0, -1, 0));
  private roomB = [0, 1, 2, 3].map(() => new Vector4());
  private roomY = [0, 1, 2, 3].map(() => new Vector2());
  private slotIx = [0, 0, 0, 0];
  private slotD = [0, 0, 0, 0];
  private shellRay = new Raycaster();
  private shellFrom = new Vector3();
  private shellDir = new Vector3();
  constructor(private g: AGame) {
    this.places = [placePastechi(), placeMcdonalds(), placeStarbucks(), placePlaza(), placeHardrock(), placeRadisson(), placeHilton(), placeHyatt(), placeMarriott(), placeSenorfrogs(), placeMoomba(), placeGiannis(), placeRenmall(), placeRoyalplaza(), placeSuperfood()];
    const w = window as unknown as { __awDoor?: (x: number, z: number) => boolean };
    w.__awDoor = (x, z) => this.open(x, z);
    this.wrapHeight();
    this.patchTerrain();
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
        if (p.shell && !p.shellDone && dist < p.show + 40) this.patchShell(p);
        // Terrain can still be the fallback height when the room is first built.
        this.settleFloor(p);
      }
    }
    this.syncRooms();
  }

  /**
   * Walk height inside a room is the floor, so a dune in the heightmap cannot
   * lift the player through the tiles. Samples outside the room are unchanged.
   */
  private wrapHeight() {
    const real = this.g.real as unknown as RealH;
    if (!real || typeof real.heightAt !== "function") return;
    const orig = real.heightAt.bind(real);
    this.origH = orig;
    real.heightAt = (x: number, z: number) => {
      const y = this.floorYAt(x, z);
      return y == null ? orig(x, z) : y;
    };
  }

  /** World Y of the floor at this point, or null when it is not inside a room. */
  private floorYAt(x: number, z: number): number | null {
    const ps = this.places;
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      const f = p.world;
      if (x < f.minX || x > f.maxX || z < f.minZ || z > f.maxZ) continue;
      if (!inRoom(f, x, z)) continue;
      const base = p.group ? p.group.position.y : this.origH(p.floorAt?.x ?? p.x, p.floorAt?.z ?? p.z);
      if (!Number.isFinite(base)) continue;
      return base + floorLift(p.id);
    }
    return null;
  }

  /** Hide terrain fragments that would poke through a visible interior floor. */
  private syncRooms() {
    const S = this.g.S as { mode: string; walk: { x: number; z: number }; car: { x: number; z: number }; plane: { x: number; z: number } };
    const e = S.mode === "walk" ? S.walk : S.mode === "plane" ? S.plane : S.car;
    const ix = this.slotIx, dd = this.slotD;
    let n = 0;
    const ps = this.places;
    for (let i = 0; i < ps.length; i++) {
      const p = ps[i];
      if (!p.group || !p.group.visible) continue;
      const dist = (e.x - p.x) * (e.x - p.x) + (e.z - p.z) * (e.z - p.z);
      if (n < 4) { ix[n] = i; dd[n] = dist; n++; }
      else {
        let w = 0;
        for (let k = 1; k < 4; k++) if (dd[k] > dd[w]) w = k;
        if (dist < dd[w]) { ix[w] = i; dd[w] = dist; }
      }
    }
    let minX = 1, minZ = 1, maxX = -1, maxZ = -1;
    for (let s = 0; s < 4; s++) {
      if (s >= n) { this.roomA[s].z = -1; continue; }
      const p = ps[ix[s]];
      const f = p.world;
      const fy = p.group!.position.y + floorLift(p.id);
      this.roomA[s].set(f.mx, f.mz, f.halfW - ROOM_SIDE, f.depth - ROOM_BACK);
      this.roomB[s].set(f.ux, f.uz, f.nx, f.nz);
      this.roomY[s].set(fy - 8, fy + 5);
      if (s === 0 || f.minX < minX) minX = f.minX;
      if (s === 0 || f.minZ < minZ) minZ = f.minZ;
      if (s === 0 || f.maxX > maxX) maxX = f.maxX;
      if (s === 0 || f.maxZ > maxZ) maxZ = f.maxZ;
    }
    if (n > 0) this.roomBox.set(minX, minZ, maxX, maxZ);
    this.roomOn.value = n > 0 ? 1 : 0;
  }

  private patchTerrain() {
    const real = this.g.real as unknown as RealH;
    const terr = (m: Material | undefined) => {
      if (!m || (m.userData && m.userData["aw:floor-v1"])) return;
      this.patchTerrainMat(m);
    };
    const fac = real?.terrain;
    if (fac && typeof fac.material === "function") {
      const orig = fac.material.bind(fac);
      fac.material = (...a: unknown[]) => { const m = orig(...a); terr(m); return m; };
    }
    terr(real?.ovMat);
    if (real?.regions) for (const r of real.regions.values()) terr(r.mat);
  }

  private patchTerrainMat(mat: Material) {
    const on = this.roomOn, box = this.roomBox, A = this.roomA, B = this.roomB, Y = this.roomY;
    chainPatch(mat, "floor-v1", (s: Shader) => {
      if (!s.fragmentShader.includes("varying vec3 vWP;") || !s.fragmentShader.includes("void main() {")) return;
      s.uniforms.awRoomOn = on;
      s.uniforms.awRoomBox = { value: box };
      s.uniforms.awRoomA = { value: A };
      s.uniforms.awRoomB = { value: B };
      s.uniforms.awRoomY = { value: Y };
      s.fragmentShader = s.fragmentShader
        .replace("varying vec3 vWP;", `varying vec3 vWP;
uniform float awRoomOn;
uniform vec4 awRoomBox;
uniform vec4 awRoomA[4];
uniform vec4 awRoomB[4];
uniform vec2 awRoomY[4];`)
        .replace("void main() {", "void main() {" + ROOM_FRAG);
      this.cleared++;
    });
  }

  /** Drop the room onto the hero once heightAt has the real ground. */
  private settleFloor(p: Place) {
    if (!p.group) return;
    const ax = p.floorAt?.x ?? p.x;
    const az = p.floorAt?.z ?? p.z;
    const h = this.origH(ax, az);
    if (!Number.isFinite(h) || Math.abs(h - p.floorY) < 0.35) return;
    p.group.position.y = h as number;
    p.group.updateMatrixWorld(true);
    p.floorY = h as number;
    p.uY.value = h as number;
  }

  private ensure(p: Place) {
    const ax = p.floorAt?.x ?? p.x;
    const az = p.floorAt?.z ?? p.z;
    const h = this.origH(ax, az);
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
    let found = 0;
    entry._g.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh || !mesh.material) return;
      const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
      for (const mat of mats) if (this.patchMat(mat, p.cut, doorOn, uU, uN, uM, uY, half, top, side)) found++;
    });
    if (found > 0) p.patched = true;
  }

  /**
   * The Royal Plaza hero bay is already open. A procedural monument draws a
   * second pink shell on the same footprint, and that shell is what the street
   * sees. Rays through the doorway pick the materials to cut.
   */
  private patchShell(p: Place) {
    p.shellTick = (p.shellTick ?? 0) + 1;
    if ((p.shellTick ?? 0) % 15 !== 0) return;
    const mon = (this.g.real as unknown as { mon?: { group?: Object3D } }).mon?.group;
    if (!mon) return;
    mon.updateMatrixWorld(true);
    p.shellTries = (p.shellTries ?? 0) + 1;
    if ((p.shellTries ?? 0) > 40) { p.shellDone = true; return; }
    const U = p.uU.value, N = p.uN.value, M = p.uM.value;
    this.shellDir.set(N.x, 0, N.y);
    const y0 = p.uY.value;
    const near: Mesh[] = [];
    mon.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh || !mesh.geometry) return;
      const geo = mesh.geometry;
      if (!geo.boundingSphere) geo.computeBoundingSphere();
      const bs = geo.boundingSphere;
      if (!bs) return;
      const e = mesh.matrixWorld.elements;
      const cx = e[0] * bs.center.x + e[4] * bs.center.y + e[8] * bs.center.z + e[12];
      const cz = e[2] * bs.center.x + e[6] * bs.center.y + e[10] * bs.center.z + e[14];
      if (Math.hypot(cx - M.x, cz - M.y) - bs.radius > 4) return;
      near.push(mesh);
    });
    const doorOn = p.doorOn, uU = p.uU, uN = p.uN, uM = p.uM, uY = p.uY;
    const half = { value: p.doorHalf }, top = { value: p.doorTop }, side = { value: p.doorSide };
    let added = 0, seen = 0;
    for (let ia = -2; ia <= 2; ia++) {
      const along = ia * p.doorHalf * 0.46;
      for (let k = 0; k < 4; k++) {
        const iy = 0.4 + k * Math.max(0.4, (p.doorTop - 0.7) / 3);
        this.shellFrom.set(M.x + U.x * along - N.x * 1.4, y0 + iy, M.y + U.y * along - N.y * 1.4);
        this.shellRay.set(this.shellFrom, this.shellDir);
        this.shellRay.far = 1.4 + p.doorSide + 0.5;
        const hits = near.length ? this.shellRay.intersectObjects(near, false) : [];
        for (let h = 0; h < hits.length; h++) {
          const hit = hits[h];
          const alongH = (hit.point.x - M.x) * U.x + (hit.point.z - M.y) * U.y;
          const sideH = (hit.point.x - M.x) * N.x + (hit.point.z - M.y) * N.y;
          if (Math.abs(alongH) > p.doorHalf + 0.08) continue;
          if (sideH < -1.15 || sideH > p.doorSide + 0.08) continue;
          if (hit.point.y < y0 - 0.2 || hit.point.y > y0 + p.doorTop + 0.05) continue;
          const mesh = hit.object as Mesh;
          if (!mesh.isMesh || !mesh.material) continue;
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          for (let m = 0; m < mats.length; m++) {
            if (this.patchMat(mats[m], [], doorOn, uU, uN, uM, uY, half, top, side, "door-shell-" + p.id)) added++;
          }
          seen++;
        }
      }
    }
    if (seen > 0 && added === 0) p.shellQuiet = (p.shellQuiet ?? 0) + 1;
    else p.shellQuiet = 0;
    if ((p.shellQuiet ?? 0) >= 4) p.shellDone = true;
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
    key?: string,
  ) {
    const name = mat.name || "";
    const id = key || ("door-" + name);
    if (!key && cut.indexOf(name) < 0) return false;
    if (mat.userData["aw:" + id]) return false;
    this.rebake.set(mat, 4);
    mat.needsUpdate = true;
    chainPatch(mat, id, (s: Shader) => {
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
    return true;
  }
}
