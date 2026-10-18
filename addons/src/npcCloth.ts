// One shared weave atlas for every outfit. Rows are linen, stripes, checks,
// and a small floral. Materials point at this texture; they never clone it.
import {
  CanvasTexture, LinearFilter, SRGBColorSpace, type WebGLRenderer,
} from "three";

const ROWS = 12;
const W = 64;
const ROW_H = 32;

let atlas: CanvasTexture | null = null;

export function clothAtlas(renderer?: WebGLRenderer): CanvasTexture {
  if (!atlas) atlas = paintCloth();
  if (renderer) {
    try { renderer.initTexture(atlas); } catch { /* uploaded on first draw */ }
  }
  return atlas;
}

let foldNormal: CanvasTexture | null = null;

/** One shared fold normal for dress cloth. Created once, never cloned. */
export function clothFoldNormal(): CanvasTexture {
  if (foldNormal) return foldNormal;
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("fold normal");
  const image = ctx.createImageData(size, size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / (size - 1);
      const v = y / (size - 1);
      // Two broad vertical drapes, plus a softer cross-fold near the hem.
      const nx = Math.sin(u * Math.PI * 4) * 0.62 + Math.sin(u * Math.PI * 8 + 0.4) * 0.18;
      const ny = Math.sin(v * Math.PI * 2) * 0.22;
      const nz = Math.sqrt(Math.max(0.15, 1 - nx * nx - ny * ny));
      const i = (y * size + x) * 4;
      image.data[i] = Math.round((nx * 0.5 + 0.5) * 255);
      image.data[i + 1] = Math.round((ny * 0.5 + 0.5) * 255);
      image.data[i + 2] = Math.round((nz * 0.5 + 0.5) * 255);
      image.data[i + 3] = 255;
    }
  }
  ctx.putImageData(image, 0, 0);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  tex.flipY = false;
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  foldNormal = tex;
  return tex;
}

function paintCloth(): CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = ROW_H * ROWS;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("cloth atlas");
  for (let row = 0; row < ROWS; row++) paintRow(ctx, row);
  const tex = new CanvasTexture(canvas);
  tex.colorSpace = SRGBColorSpace;
  // flipY puts canvas y=0 at v=1. Row 0 is painted at the bottom so v=0.
  tex.flipY = true;
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

function paintRow(ctx: CanvasRenderingContext2D, row: number) {
  const y = (ROWS - 1 - row) * ROW_H;
  const pattern = row % 4;
  ctx.fillStyle = row % 2 ? "#efe6d6" : "#e4d8c4";
  ctx.fillRect(0, y, W, ROW_H);
  if (pattern === 0) {
    ctx.strokeStyle = "rgba(92, 68, 42, 0.45)";
    ctx.lineWidth = 1;
    const step = 4 + (row % 3);
    for (let i = -ROW_H; i < W + ROW_H; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, y);
      ctx.lineTo(i + ROW_H, y + ROW_H);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(i + ROW_H, y);
      ctx.lineTo(i, y + ROW_H);
      ctx.stroke();
    }
  } else if (pattern === 1) {
    ctx.fillStyle = "rgba(72, 48, 36, 0.38)";
    const gap = 4 + (row % 3);
    for (let x = 0; x < W; x += gap * 2) ctx.fillRect(x, y, Math.max(2, gap - 1), ROW_H);
  } else if (pattern === 2) {
    const n = 4 + (row % 2);
    const cw = W / n;
    const ch = ROW_H / n;
    ctx.fillStyle = "rgba(68, 48, 36, 0.32)";
    for (let j = 0; j < n; j++) {
      for (let i = 0; i < n; i++) {
        if (((i + j) & 1) === 0) continue;
        ctx.fillRect(i * cw, y + j * ch, cw, ch);
      }
    }
  } else {
    ctx.fillStyle = "rgba(140, 72, 78, 0.7)";
    const dots = 4 + (row % 3);
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < dots; i++) {
        ctx.beginPath();
        ctx.arc(6 + i * (W / dots), y + 5 + j * 7, 1.7, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}
