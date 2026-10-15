// Emergency vehicle + NPC models for Aruba (refs: landmarks/refs/emergency/*).
// Vehicles come from models/ev.glb (addons/cars, `npm run cars`): lofted bodies in the traffic kit's style,
// one mesh per material (~11 draws at L0, ~10 at L1 beyond 45 m) plus the flashing bar lenses.
// Liveries are canvas textures (cached, shared) on UV-mapped body decals.
// Nose is local +Z, origin at ground centre (same convention as A's traffic cars).
import { BoxGeometry, BufferGeometry, CanvasTexture, Group, LOD, Mesh, MeshBasicMaterial, MeshStandardMaterial, SphereGeometry, SRGBColorSpace, Vector3, type Material, type Object3D } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export type EvKind = "everest" | "isuzu" | "ambY" | "ambP" | "forensys";
const texCache = new Map<string, CanvasTexture>();
const matCache = new Map<string, Material>();
const BOX = new BoxGeometry(1, 1, 1);

function std(key: string, color: string, rough = 0.5, metal = 0.1): MeshStandardMaterial {
  let m = matCache.get(key) as MeshStandardMaterial | undefined; if (!m) { m = new MeshStandardMaterial({ color, roughness: rough, metalness: metal }); matCache.set(key, m); } return m;
}
/** canvas-textured material; UVs come from ev.glb (glTF convention, so no flip) */
function texMat(key: string, draw: (c: CanvasRenderingContext2D, w: number, h: number) => void, w = 512, h = 128, rough = 0.42, metal = 0.1): Material {
  let m = matCache.get(key); if (m) return m;
  let t = texCache.get(key);
  if (!t) { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; const c = cv.getContext("2d")!; draw(c, w, h); t = new CanvasTexture(cv); t.colorSpace = SRGBColorSpace; t.flipY = false; t.anisotropy = 4; texCache.set(key, t); }
  m = new MeshStandardMaterial({ map: t, roughness: rough, metalness: metal }); matCache.set(key, m); return m;
}
function txt(c: CanvasRenderingContext2D, s: string, x: number, y: number, px: number, col: string, font = "bold", align: CanvasTextAlign = "left", fam = "Arial, Helvetica, sans-serif") {
  c.font = `${font} ${px}px ${fam}`; c.fillStyle = col; c.textAlign = align; c.textBaseline = "middle"; c.fillText(s, x, y);
}
function crest(c: CanvasRenderingContext2D, x: number, y: number, s: number) {
  c.save(); c.translate(x, y); c.scale(s, s);
  c.beginPath(); c.moveTo(-18, -30); c.lineTo(18, -30); c.lineTo(18, 8); c.quadraticCurveTo(0, 32, -18, 8); c.closePath();
  c.fillStyle = "#1d4fb3"; c.fill(); c.lineWidth = 3; c.strokeStyle = "#0d2a66"; c.stroke();
  c.fillStyle = "#e9eef6"; c.fillRect(-11, -22, 22, 22);
  c.fillStyle = "#2e8b3a"; c.beginPath(); c.ellipse(-14, 10, 6, 13, 0.5, 0, 6.3); c.ellipse(14, 10, 6, 13, -0.5, 0, 6.3); c.fill();
  c.fillStyle = "#9aa3ad"; c.fillRect(-2, -26, 4, 40); c.fillStyle = "#1d4fb3"; c.fillRect(-14, 22, 28, 6);
  c.restore();
}
// side livery, police. frontLeft: true for the +X face (front of car appears on the image left)
function policeSide(num: number, frontLeft: boolean) {
  return (c: CanvasRenderingContext2D, w: number, h: number) => {
    c.fillStyle = "#f4f5f7"; c.fillRect(0, 0, w, h);
    const X = (f: number) => (frontLeft ? f : 1 - f) * w; // f: 0 = front, 1 = rear
    c.fillStyle = "#1747b8"; c.fillRect(0, h * 0.30, w, h * 0.17);
    c.fillStyle = "#f2c81e"; c.fillRect(0, h * 0.50, w, h * 0.035); c.fillRect(0, h * 0.555, w, h * 0.02);
    crest(c, X(0.36), h * 0.42, 1.05);
    txt(c, "POLIS", X(0.62), h * 0.385, 38, "#ffffff", "bold", "center");
    txt(c, "Servicio, Integridad, Seguridad.", X(0.47), h * 0.70, 19, "#c8202a", "bold", "center");
    txt(c, String(num), X(0.13), h * 0.18, 30, "#111", "bold", "center");
    txt(c, "\u260E100", X(0.80), h * 0.18, 24, "#1747b8", "bold", "center");
    txt(c, String(num), X(0.93), h * 0.42, 34, "#111", "bold", "center");
    // rear chevrons
    c.strokeStyle = "#1747b8"; c.lineWidth = 7; for (let k = 0; k < 2; k++) { c.beginPath(); c.moveTo(X(0.84 + k * 0.035), h * 0.47); c.lineTo(X(0.87 + k * 0.035), h * 0.30); c.stroke(); }
  };
}
function forenSide(frontLeft: boolean) {
  return (c: CanvasRenderingContext2D, w: number, h: number) => {
    c.fillStyle = "#f4f5f7"; c.fillRect(0, 0, w, h);
    const X = (f: number) => (frontLeft ? f : 1 - f) * w;
    c.fillStyle = "#1f3b73"; c.fillRect(0, h * 0.60, w, h * 0.05);
    txt(c, "ForenSys", X(0.45), h * 0.36, 44, "#1f3b73", "bold", "center");
    txt(c, "ARUBA \u00B7 Accident Registration", X(0.45), h * 0.52, 16, "#1f3b73", "bold", "center");
  };
}
function ambSide(pink: boolean, frontLeft: boolean) {
  return (c: CanvasRenderingContext2D, w: number, h: number) => {
    const X = (f: number) => (frontLeft ? f : 1 - f) * w;
    c.fillStyle = pink ? "#f29ac4" : "#e8ef1c"; c.fillRect(0, 0, w, h);
    if (!pink) {
      c.fillStyle = "#1f3a9c"; c.fillRect(0, h * 0.50, w, h * 0.09);
      c.fillStyle = "#e8ef1c"; c.fillRect(X(0.42) - w * 0.36, h * 0.50, w * 0.72, h * 0.09);
      txt(c, "AMBULANCE", X(0.42), h * 0.545, 30, "#1f3a9c", "bold", "center");
      c.fillStyle = "#1f3a9c"; c.beginPath(); const xa = X(0.06), xb = X(0.0); c.moveTo(xa, h * 0.5); c.lineTo(xb, h * 0.5); c.lineTo(xb, h * 0.59); c.fill();
    } else {
      c.strokeStyle = "#ffffff"; c.lineWidth = 16; c.beginPath(); c.moveTo(X(0.05), h * 0.62); c.bezierCurveTo(X(0.35), h * 0.85, X(0.55), h * 0.15, X(0.95), h * 0.45); c.stroke();
      c.strokeStyle = "#8f6fb8"; c.lineWidth = 5; c.beginPath(); c.moveTo(X(0.05), h * 0.66); c.bezierCurveTo(X(0.35), h * 0.9, X(0.55), h * 0.2, X(0.95), h * 0.5); c.stroke();
      c.fillStyle = "#ffffff"; c.fillRect(X(0.42) - 46, h * 0.22, 92, 30);
      txt(c, "InSan", X(0.42), h * 0.22 + 15, 24, "#2b6cc4", "bold", "center");
    }
  };
}
function cabSide(pink: boolean, frontLeft: boolean) {
  return (c: CanvasRenderingContext2D, w: number, h: number) => {
    const X = (f: number) => (frontLeft ? f : 1 - f) * w;
    c.fillStyle = pink ? "#f29ac4" : "#e8ef1c"; c.fillRect(0, 0, w, h);
    if (!pink) { c.fillStyle = "#1f3a9c"; c.fillRect(0, h * 0.30, w, h * 0.12); }
    else { c.fillStyle = "#ffffff"; c.fillRect(0, h * 0.30, w, h * 0.05); }
    txt(c, "911", X(0.55), h * 0.62, 44, pink ? "#ffffff" : "#c8202a", "bold", "center");
    if (!pink) txt(c, "PA SALBA BO BIDA", X(0.55), h * 0.80, 13, "#c8202a", "bold", "center");
  };
}
function textTex(key: string, bg: string, s: string, fg: string, px: number, w: number, h: number) {
  return texMat(key, (c) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); txt(c, s, w / 2, h / 2, px, fg, "bold", "center"); }, w, h);
}
function plateMat(num: number) {
  return texMat("evPlate" + num, (c, w, h) => {
    c.fillStyle = "#f4f2ea"; c.fillRect(0, 0, w, h); c.strokeStyle = "#1d3f8a"; c.lineWidth = 4; c.strokeRect(3, 3, w - 6, h - 6);
    txt(c, "ARUBA", w / 2, 13, 12, "#1d3f8a", "bold", "center"); txt(c, `A-${10000 + num * 37}`, w / 2, 40, 34, "#1d3f8a", "bold", "center");
  }, 256, 64, 0.4, 0);
}

// ---- ev.glb: per variant, geometry per LOD and material, bar / marker anchors ----
type EvGeo = { lods: Map<string, BufferGeometry>[]; bar: { p: Vector3; w: number }; mk?: Vector3 };
let evGeo: EvGeo[] | null = null;
let evLoad: Promise<void> | null = null;
export function loadEv(): Promise<void> {
  return (evLoad ||= new GLTFLoader().loadAsync("./models/ev.glb").then((gl) => {
    const vars: EvGeo[] = [];
    gl.scene.traverse((o) => {
      const t = /^ev(\d)_(?:L(\d)_([a-z]+)|(bar|mk))$/.exec(o.name); if (!t) return;
      const v = (vars[+t[1]] ||= { lods: [new Map(), new Map()], bar: { p: new Vector3(), w: 1 } });
      if (t[3] && (o as Mesh).isMesh) v.lods[+t[2]].set(t[3], (o as Mesh).geometry);
      else if (t[4] === "bar") v.bar = { p: o.position.clone(), w: o.scale.x };
      else if (t[4] === "mk") v.mk = o.position.clone();
    });
    evGeo = vars;
  }).catch((e) => { console.warn("[aw-ev] models/ev.glb", e); }));
}
export const evReady = () => !!evGeo;
const VARIANT: Record<EvKind, number> = { everest: 0, forensys: 0, isuzu: 1, ambY: 2, ambP: 2 };
const L1_DIST = 45;

function evMats(kind: EvKind, num: number): Record<string, Material> {
  const amb = kind === "ambY" || kind === "ambP", pink = kind === "ambP", fs = kind === "forensys";
  const body = amb ? (pink ? "#f29ac4" : "#e8ef1c") : "#f4f5f7";
  const paint = std("evPaint" + body, body, 0.42, 0.1);
  const m: Record<string, Material> = {
    paint, glass: std("evGlass", "#121a21", 0.08, 0.6), dark: std("evDark", "#1c1d20", 0.8, 0.05),
    chrome: std("evChrome", "#d6d9dc", 0.18, 0.95), light: std("evLight", "#eef2f5", 0.15, 0.3), tail: std("evTail", "#a3151a", 0.3, 0.1),
    plate: plateMat(num),
  };
  if (amb) {
    m.livr = texMat("abR" + kind, ambSide(pink, true), 512, 264); m.livl = texMat("abL" + kind, ambSide(pink, false), 512, 264);
    m.cabr = texMat("acR" + kind, cabSide(pink, true), 256, 192); m.cabl = texMat("acL" + kind, cabSide(pink, false), 256, 192);
    m.rear = textTex("aback" + kind, body, pink ? "InSan  911" : "AMBULANCE", pink ? "#ffffff" : "#1f3a9c", 40, 512, 122);
  } else if (fs) {
    m.livr = texMat("fsR", forenSide(true), 768, 128); m.livl = texMat("fsL", forenSide(false), 768, 128);
    m.hood = m.rear = paint;
  } else {
    m.livr = texMat(`pR${num}`, policeSide(num, true), 768, 128); m.livl = texMat(`pL${num}`, policeSide(num, false), 768, 128);
    m.hood = textTex("hoodPolis", "#f4f5f7", "POLIS", "#1747b8", 64, 256, 128);
    m.rear = textTex(`rear${num}`, "#f4f5f7", `\u260E100   ${num}`, "#1747b8", 44, 512, 76);
  }
  return m;
}
/** EV head/tail lights glow at night (k: 0 day .. 1 night); shared by every EV */
export function evNight(k: number) {
  const l = std("evLight", "#eef2f5", 0.15, 0.3), t = std("evTail", "#a3151a", 0.3, 0.1);
  l.emissive.setRGB(1, 0.95, 0.85).multiplyScalar(k); l.emissiveIntensity = 1 + 4 * k;
  t.emissive.setRGB(1, 0.12, 0.06).multiplyScalar(k); t.emissiveIntensity = 1 + 2 * k;
}

/** rounded light-bar lens, unit size */
const LENS = (() => {
  const g = new SphereGeometry(0.5, 12, 6), p = g.attributes.position, f = (v: number) => Math.sign(v) * (Math.abs(2 * v) ** 0.3) / 2;
  for (let i = 0; i < p.count; i++) p.setXYZ(i, f(p.getX(i)), f(p.getY(i)), f(p.getZ(i)));
  return g;
})();
const lens = (g: Group, col: number, x: number, y: number, z: number, sx: number, sy: number, sz: number) => {
  const m = new Mesh(LENS, new MeshBasicMaterial({ color: col, toneMapped: false })); m.scale.set(sx, sy, sz); m.position.set(x, y, z); m.name = "aw:ebar"; g.add(m); return m;
};

export type EvModel = { g: Group; bar: Mesh[]; colors: [number, number] };
export function buildEv(kind: EvKind, num = 45): EvModel {
  const g = new Group(); g.name = "aw:ev:" + kind;
  const amb = kind === "ambY" || kind === "ambP", fs = kind === "forensys";
  const model: EvModel = { g, bar: [], colors: fs ? [0xffa000, 0xffa000] : amb ? [0xff1008, 0xffffff] : [0xff1008, 0x1a40ff] };
  const fill = () => {
    const E = evGeo && evGeo[VARIANT[kind]]; if (!E) return;
    const mats = evMats(kind, num), lod = new LOD(); lod.name = "aw:evlod";
    E.lods.forEach((parts, l) => {
      const lg = new Group();
      for (const [k, geo] of parts) { const mat = mats[k]; if (!mat) continue; const m = new Mesh(geo, mat); m.castShadow = l === 0; m.matrixAutoUpdate = false; lg.add(m); }
      lod.addLevel(lg, l ? L1_DIST : 0);
    });
    g.add(lod);
    // bar lenses: [left, right] then the ambulance's box markers [left, right] (flashBar pairs by index parity)
    const { p, w } = E.bar;
    for (const s of [-1, 1]) model.bar.push(lens(g, 0x202024, s * w * 0.25, p.y + 0.05, p.z, w * 0.48, 0.1, 0.26));
    if (amb && E.mk) for (const s of [-1, 1]) model.bar.push(lens(g, 0x501010, s * E.mk.x, E.mk.y, E.mk.z, 0.22, 0.14, 0.05));
  };
  if (evGeo) fill(); else void loadEv().then(fill);
  return model;
}
// --- simple low-poly person: legs, torso, head, two arm pivots ---
export type Npc = { g: Group; armL: Group; armR: Group; legL: Mesh; legR: Mesh; t: number };
const HEAD = new SphereGeometry(0.12, 10, 8);
export function buildNpc(shirt: string, pants: string, tablet = false): Npc {
  const g = new Group(); g.name = "aw:npc";
  const sk = std("skin" + ((Math.random() * 3) | 0), ["#8a5a3a", "#b07a52", "#d2a07a"][(Math.random() * 3) | 0], 0.7, 0);
  const sh = std("shirt" + shirt, shirt, 0.8, 0), pa = std("pants" + pants, pants, 0.8, 0);
  const legL = new Mesh(BOX, pa); legL.scale.set(0.14, 0.82, 0.16); legL.position.set(-0.09, 0.41, 0); legL.geometry = BOX;
  const legR = legL.clone(); legR.position.x = 0.09; g.add(legL, legR);
  const torso = new Mesh(BOX, sh); torso.scale.set(0.4, 0.6, 0.22); torso.position.set(0, 1.12, 0); g.add(torso);
  const head = new Mesh(HEAD, sk); head.position.set(0, 1.56, 0); g.add(head);
  const arm = (s: number) => { const p = new Group(); p.position.set(s * 0.25, 1.38, 0); const a = new Mesh(BOX, sh); a.scale.set(0.1, 0.62, 0.11); a.position.y = -0.31; p.add(a); g.add(p); return p; };
  const armL = arm(-1), armR = arm(1);
  if (tablet) { const tb = new Mesh(BOX, std("tablet", "#202326", 0.3, 0.2)); tb.scale.set(0.24, 0.32, 0.02); tb.position.set(0, -0.6, 0.12); armR.add(tb); const sc = new Mesh(BOX, new MeshBasicMaterial({ color: 0x8fc6ff, toneMapped: false })); sc.scale.set(0.2, 0.27, 0.005); sc.position.set(0, -0.6, 0.135); armR.add(sc); armR.rotation.x = -0.9; }
  return { g, armL, armR, legL, legR, t: Math.random() * 10 };
}
export function animNpc(n: Npc, dt: number, mode: "walk" | "talk" | "idle", tablet = false) {
  n.t += dt;
  if (mode === "walk") { const a = Math.sin(n.t * 7) * 0.5; n.legL.rotation.x = a; n.legR.rotation.x = -a; n.armL.rotation.x = -a * 0.8; if (!tablet) n.armR.rotation.x = a * 0.8; }
  else { n.legL.rotation.x = n.legR.rotation.x = 0;
    if (mode === "talk") { const k = Math.sin(n.t * 2.3), k2 = Math.sin(n.t * 3.1 + 1); n.armL.rotation.x = -0.6 - 0.5 * Math.max(0, k); n.armL.rotation.z = -0.25 * k2; if (!tablet) { n.armR.rotation.x = -0.4 - 0.6 * Math.max(0, k2); n.armR.rotation.z = 0.3 * k; } }
    else { n.armL.rotation.x = 0; if (!tablet) n.armR.rotation.x = 0; } }
  if (tablet) n.armR.rotation.x = mode === "talk" ? -0.9 - 0.4 * Math.max(0, Math.sin(n.t * 0.7)) : -0.9;
}
export function flashBar(m: EvModel, time: number, ph: number, on: boolean) {
  const f = ((time + ph) * 2.5) % 1, k = Math.floor(f * 8);
  m.bar.forEach((b, i) => { const mat = b.material as MeshBasicMaterial; const left = i % 2 === 0; const lit = on && (left ? k < 4 && (k & 1) === 0 : k >= 4 && (k & 1) === 0);
    mat.color.setHex(lit ? (left ? m.colors[0] : m.colors[1]) : 0x202024); if (lit) mat.color.multiplyScalar(3); });
}
export function disposeTree(o: Object3D) { o.traverse((c) => { const m = c as Mesh; if (m.isMesh && (m.material as Material) && (m.material as MeshBasicMaterial).isMeshBasicMaterial) (m.material as Material).dispose(); }); }
