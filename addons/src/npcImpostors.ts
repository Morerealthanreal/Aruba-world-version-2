// Far crowd, one draw. Twelve outfits and two walk frames share a single atlas.
// Per-instance uv origin picks the cell. The atlas is never cloned.
import {
  CanvasTexture, DoubleSide, Group, InstancedBufferAttribute, InstancedMesh,
  LinearFilter, Matrix4, MeshBasicMaterial, PlaneGeometry, Quaternion,
  SRGBColorSpace, Vector3, type WebGLRenderer,
} from "three";
import type { NpcCast } from "./npcCast";

const COLS = 12;
const ROWS = 2;
const CELL_W = 80;
const CELL_H = 168;

type Person = {
  cast: number; x: number; y: number; z: number;
  height: number; breadth: number; moving: boolean;
};

export class NpcImpostors {
  readonly group = new Group();
  visible = 0;
  draws = 0;
  triangles = 0;
  private mesh: InstancedMesh;
  private origins: InstancedBufferAttribute;
  private scratch: Person[] = [];
  private matrix = new Matrix4();
  private pos = new Vector3();
  private quat = new Quaternion();
  private scale = new Vector3();
  private yAxis = new Vector3(0, 1, 0);

  constructor(casts: readonly NpcCast[], cap: number, renderer?: WebGLRenderer) {
    this.group.name = "aw:pedestrians:impostors";
    const map = paintAtlas(casts);
    if (renderer) {
      try { renderer.initTexture(map); } catch { /* uploaded on first draw */ }
    }
    const geo = new PlaneGeometry(0.7, 1.62);
    geo.translate(0, 0.81, 0);
    this.origins = new InstancedBufferAttribute(new Float32Array(cap * 2), 2);
    geo.setAttribute("awOrigin", this.origins);
    const material = new MeshBasicMaterial({
      map,
      alphaTest: 0.35,
      side: DoubleSide,
      toneMapped: true,
    });
    material.onBeforeCompile = (shader) => {
      shader.vertexShader = shader.vertexShader
        .replace("#include <common>", "#include <common>\nattribute vec2 awOrigin;\nvarying vec2 vAwOrigin;")
        .replace("#include <uv_vertex>", "#include <uv_vertex>\nvAwOrigin = awOrigin;");
      shader.fragmentShader = shader.fragmentShader
        .replace("#include <common>", "#include <common>\nvarying vec2 vAwOrigin;")
        .replace(
          "#include <map_fragment>",
          `vec4 sampledDiffuseColor = texture2D(map, vAwOrigin + vMapUv * vec2(${(1 / COLS).toFixed(6)}, ${(1 / ROWS).toFixed(6)}));
diffuseColor *= sampledDiffuseColor;`,
        );
    };
    material.customProgramCacheKey = () => "aw-npc-impostor-v1";
    this.mesh = new InstancedMesh(geo, material, cap);
    this.mesh.name = "aw:pedestrians:far";
    this.mesh.frustumCulled = false;
    this.mesh.count = 0;
    this.mesh.castShadow = false;
    this.mesh.receiveShadow = false;
    this.group.add(this.mesh);
  }

  begin() {
    this.scratch.length = 0;
  }

  add(
    cast: number, x: number, y: number, z: number,
    _yaw: number, height: number, breadth: number, moving: boolean,
  ) {
    if (this.scratch.length >= this.origins.count) return;
    this.scratch.push({ cast, x, y, z, height, breadth, moving });
  }

  finish(time: number, camX: number, camZ: number) {
    const n = this.scratch.length;
    for (let i = 0; i < n; i++) {
      const person = this.scratch[i];
      const frame = person.moving ? (((time * 1.7 + person.cast * 0.31) % 2) | 0) : 0;
      // flipY: frame 0 is the top of the canvas, so its v origin is 0.5.
      this.origins.setXY(i, person.cast / COLS, frame === 0 ? 0.5 : 0);
      const face = Math.atan2(camX - person.x, camZ - person.z);
      this.pos.set(person.x, person.y, person.z);
      this.quat.setFromAxisAngle(this.yAxis, face);
      this.scale.set(person.breadth, person.height, 1);
      this.matrix.compose(this.pos, this.quat, this.scale);
      this.mesh.setMatrixAt(i, this.matrix);
    }
    this.mesh.count = n;
    this.mesh.visible = n > 0;
    if (n) {
      this.mesh.instanceMatrix.needsUpdate = true;
      this.origins.needsUpdate = true;
    }
    this.visible = n;
    this.draws = n > 0 ? 1 : 0;
    this.triangles = n * 2;
  }
}

function paintAtlas(casts: readonly NpcCast[]): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = CELL_W * COLS;
  canvas.height = CELL_H * ROWS;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("impostor atlas");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < casts.length && i < COLS; i++) {
    paintPerson(ctx, i * CELL_W, 0, CELL_W, CELL_H, casts[i], 0);
    paintPerson(ctx, i * CELL_W, CELL_H, CELL_W, CELL_H, casts[i], 1);
  }
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.flipY = true;
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

function paintPerson(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number,
  cast: NpcCast, frame: number,
) {
  const skin = css(cast.palette.skin);
  const hair = css(cast.palette.hair);
  const cloth = css(cast.kind === 1 ? cast.palette.dress : cast.palette.top);
  const legs = css(cast.kind === 1 ? cast.palette.dress : cast.palette.bottom);
  const cx = x + w * 0.5;
  const step = frame ? 8 : -6;
  ctx.save();
  const body = (color: string, bx: number, by: number, bw: number, bh: number, radius: number) => {
    ctx.fillStyle = color;
    round(ctx, bx, by, bw, bh, radius);
    ctx.fill();
    ctx.fillStyle = "rgba(255,196,120,0.18)";
    round(ctx, bx, by, bw * 0.42, bh, radius);
    ctx.fill();
  };
  const foot = y + h - 6;
  if (cast.kind === 1) body(legs, cx - 22, foot - 70, 44, 78, 14);
  else {
    body(legs, cx - 16 + (frame ? -step : step) * 0.12, foot - 62, 12, 58, 5);
    body(legs, cx + 4 + (frame ? step : -step) * 0.12, foot - 62, 12, 58, 5);
  }
  body(skin, cx - 26, foot - 102, 9, 38, 4);
  body(skin, cx + 16, foot - 98, 9, 34, 4);
  body(cloth, cx - 20, foot - 116, 40, 54, 10);
  if (cast.kind !== 1) body(legs, cx - 18, foot - 68, 36, 12, 3);
  ctx.fillStyle = skin;
  ctx.beginPath();
  ctx.ellipse(cx, foot - 136, 13, 16, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = hair;
  if (cast.female) {
    round(ctx, cx - 16, foot - 140, 32, cast.id % 2 ? 46 : 30, 10);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx, foot - 148, 15, 13, 0, Math.PI, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.ellipse(cx, foot - 146, 14, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#2a211c";
  ctx.fillRect(cx - 6, foot - 138, 2, 2);
  ctx.fillRect(cx + 3, foot - 138, 2, 2);
  if (cast.hat === "straw") {
    ctx.fillStyle = "#e6c98a";
    round(ctx, cx - 22, foot - 156, 44, 5, 2);
    ctx.fill();
    round(ctx, cx - 10, foot - 168, 20, 14, 5);
    ctx.fill();
  } else if (cast.hat === "cap") {
    ctx.fillStyle = "#3d4a5c";
    round(ctx, cx - 13, foot - 164, 26, 10, 3);
    ctx.fill();
    round(ctx, cx - 2, foot - 156, 20, 4, 2);
    ctx.fill();
  }
  ctx.restore();
}

function round(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function css(hex: number) {
  return `#${hex.toString(16).padStart(6, "0")}`;
}
