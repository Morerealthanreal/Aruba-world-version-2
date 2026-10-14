// Emergency vehicle + NPC models for Aruba (refs: landmarks/refs/emergency/*).
// Built from a handful of boxes per vehicle; liveries are canvas textures (cached, shared).
// Nose is local +Z, origin at ground centre (same convention as A's traffic cars).
import { CircleGeometry, TorusGeometry, BoxGeometry, CanvasTexture, CylinderGeometry, Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, SphereGeometry, SRGBColorSpace, type Material, type Object3D } from "three";

export type EvKind = "everest" | "isuzu" | "ambY" | "ambP" | "forensys";
const texCache = new Map<string, CanvasTexture>();
const matCache = new Map<string, Material>();
const BOX = new BoxGeometry(1, 1, 1);
const WHEEL = new CylinderGeometry(0.38, 0.38, 0.26, 12).rotateZ(Math.PI / 2);
const ARCH_D = new CircleGeometry(0.5, 10, 0, Math.PI);
const ARCH_T = new TorusGeometry(0.5, 0.07, 4, 10, Math.PI);
const RIM = new CylinderGeometry(0.22, 0.22, 0.28, 8).rotateZ(Math.PI / 2);

function std(key: string, color: string, rough = 0.5, metal = 0.1): Material {
  let m = matCache.get(key); if (!m) { m = new MeshStandardMaterial({ color, roughness: rough, metalness: metal }); matCache.set(key, m); } return m;
}
function texMat(key: string, draw: (c: CanvasRenderingContext2D, w: number, h: number) => void, w = 512, h = 128, rough = 0.45): Material {
  let m = matCache.get(key); if (m) return m;
  let t = texCache.get(key);
  if (!t) { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; const c = cv.getContext("2d")!; draw(c, w, h); t = new CanvasTexture(cv); t.colorSpace = SRGBColorSpace; t.anisotropy = 4; texCache.set(key, t); }
  m = new MeshStandardMaterial({ map: t, roughness: rough, metalness: 0.08 }); matCache.set(key, m); return m;
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
    c.fillStyle = "#f6f7f8"; c.fillRect(0, 0, w, h);
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
function plateTex(key: string, bg: string, s: string, fg: string, px = 40) {
  return texMat(key, (c, w, h) => { c.fillStyle = bg; c.fillRect(0, 0, w, h); txt(c, s, w / 2, h / 2, px, fg, "bold", "center"); }, 256, 128);
}
const glass = () => std("glass", "#1c242c", 0.15, 0.4);
function box(g: Group, mat: Material | Material[], sx: number, sy: number, sz: number, x: number, y: number, z: number, name = "") {
  const m = new Mesh(BOX, mat); m.scale.set(sx, sy, sz); m.position.set(x, y + sy / 2, z); m.name = name; m.castShadow = true; g.add(m); return m;
}
function wheels(g: Group, w: number, zf: number, zr: number) {
  const tm = std("tyre", "#151515", 0.9, 0), rm = std("rim", "#b9bec4", 0.3, 0.7);
  for (const z of [zf, zr]) for (const s of [-1, 1]) { const t = new Mesh(WHEEL, tm); t.position.set(s * (w / 2 - 0.1), 0.38, z); g.add(t); const r = new Mesh(RIM, rm); r.position.copy(t.position); g.add(r); }
}
function arches(g: Group, w: number, zs: number[], col = "#2a2b2e") {
  const hole = std("archHole", "#0b0b0c", 0.95, 0), flare = std("archFl" + col, col, 0.7, 0.05);
  for (const z of zs) for (const s of [-1, 1]) {
    const d = new Mesh(ARCH_D, hole); d.rotation.y = s * Math.PI / 2; d.position.set(s * (w / 2 + 0.006), 0.4, z); g.add(d);
    const t = new Mesh(ARCH_T, flare); t.rotation.y = s * Math.PI / 2; t.position.set(s * (w / 2 + 0.01), 0.4, z); g.add(t);
  }
}
function tilt(m: Mesh, rx: number) { m.rotation.x = rx; return m; }
export type EvModel = { g: Group; bar: Mesh[]; colors: [number, number] };
function lightBar(g: Group, y: number, z: number, w: number): Mesh[] {
  return [-1, 1].map((s) => { const m = new Mesh(BOX, new MeshBasicMaterial({ color: 0x202024, toneMapped: false })); m.scale.set(w * 0.42, 0.13, 0.28); m.position.set(s * w * 0.22, y + 0.065, z); m.name = "aw:ebar"; g.add(m); return m; });
}
export function buildEv(kind: EvKind, num = 45): EvModel {
  const g = new Group(); g.name = "aw:ev:" + kind;
  if (kind === "everest" || kind === "isuzu" || kind === "forensys") {
    const L = 4.9, W = 1.86, isu = kind === "isuzu", fs = kind === "forensys";
    const white = std("evwhite", "#f4f5f7", 0.4, 0.1);
    const sideR = fs ? texMat("fsR", forenSide(true)) : texMat(`pR${num}`, policeSide(num, true));
    const sideL = fs ? texMat("fsL", forenSide(false)) : texMat(`pL${num}`, policeSide(num, false));
    const hood = fs ? white : plateTex("hoodPolis", "#f4f5f7", "POLIS", "#1747b8", 64);
    const rear = fs ? white : plateTex(`rear${num}`, "#f4f5f7", `\u260E100   ${num}`, "#1747b8", 34);
    const grille = std(isu ? "grilleC" : "grilleB", isu ? "#9da3aa" : "#202326", 0.4, isu ? 0.6 : 0.2);
    // lower body: [+x,-x,+y,-y,+z,-z]
    box(g, [sideR, sideL, white, white, white, rear], W, 0.78, L, 0, 0.4, 0, "body");
    box(g, grille, W * 0.62, 0.3, 0.04, 0, 0.78, L / 2 + 0.005);
    tilt(box(g, [white, white, hood, white, white, white], W * 0.96, 0.14, 1.35, 0, 1.12, 1.72), 0.07);
    // rounded nose: half-cylinder along x across the front edge
    { const n = new Mesh(new CylinderGeometry(0.2, 0.2, W * 0.96, 10, 1, false, 0, Math.PI).rotateZ(Math.PI / 2), white); n.position.set(0, 1.0, L / 2 - 0.12); g.add(n); }
    // raked windshield + bumpers, mirrors, roof rails, side skirt
    tilt(box(g, glass(), W * 0.9, 0.05, 0.9, 0, 1.38, 1.18), 0.95);
    const plast = std("evPlast", "#2a2b2e", 0.7, 0.05);
    box(g, plast, W * 1.0, 0.24, 0.18, 0, 0.36, L / 2 + 0.02); box(g, plast, W * 1.0, 0.24, 0.18, 0, 0.36, -L / 2 - 0.02);
    box(g, plast, W * 1.01, 0.12, L * 0.42, 0, 0.4, -0.02);
    for (const s of [-1, 1]) { box(g, white, 0.18, 0.13, 0.08, s * (W / 2 + 0.08), 1.32, 0.9); if (!isu || true) box(g, plast, 0.05, 0.06, 2.6, s * W * 0.4, isu ? 1.85 : 1.89, -0.6); }
    const cabH = isu ? 0.62 : 0.66;
    box(g, [glass(), glass(), white, white, glass(), glass()], W * 0.94, cabH, 3.25, 0, 1.18, -0.55);
    box(g, white, W * 0.95, 0.05, 3.3, 0, 1.18 + cabH, -0.55);
    for (const z of [0.95, -0.15, -1.25, -2.1]) box(g, white, W * 0.955, cabH, z === 0.95 ? 0.12 : 0.16, 0, 1.18, z);
    // headlights / tail lights
    const hl = std("hl", "#e9eef2", 0.2, 0.3), tl = std("tl", "#c01818", 0.3, 0.1);
    for (const s of [-1, 1]) { box(g, hl, 0.38, 0.14, 0.04, s * 0.68, 0.98, L / 2 + 0.01); box(g, tl, 0.12, 0.3, 0.06, s * 0.88, 0.86, -L / 2 - 0.01); }
    wheels(g, W, 1.45, -1.5); arches(g, W, [1.45, -1.5], isu ? "#d9dbde" : "#2a2b2e");
    let bar: Mesh[] = [];
    if (!fs) bar = lightBar(g, 1.18 + cabH + 0.05, 0.4, W * 0.9);
    else bar = lightBar(g, 1.18 + cabH + 0.05, 0.4, W * 0.55);
    return { g, bar, colors: fs ? [0xffa000, 0xffa000] : [0xff1008, 0x1a40ff] };
  }
  // Ford E-series box ambulance
  const pink = kind === "ambP", W = 2.3, body = pink ? "#f29ac4" : "#e8ef1c";
  const paint = std("amb" + kind, body, 0.45, 0.1);
  const sR = texMat("abR" + kind, ambSide(pink, true), 512, 192), sL = texMat("abL" + kind, ambSide(pink, false), 512, 192);
  const cR = texMat("acR" + kind, cabSide(pink, true), 256, 192), cL = texMat("acL" + kind, cabSide(pink, false), 256, 192);
  const back = plateTex("aback" + kind, body, pink ? "InSan  911" : "AMBULANCE", pink ? "#ffffff" : "#1f3a9c", 30);
  box(g, [sR, sL, paint, paint, paint, back], W, 2.35, 4.0, 0, 0.62, -1.15, "box");
  box(g, [cR, cL, paint, paint, paint, paint], W * 0.92, 1.0, 1.6, 0, 0.55, 1.65);
  box(g, [glass(), glass(), paint, paint, glass(), paint], W * 0.9, 0.62, 1.1, 0, 1.55, 1.45);
  tilt(box(g, [paint, paint, paint, paint, std("grilleB", "#202326"), paint], W * 0.86, 0.66, 0.95, 0, 0.5, 2.85), 0.12);
  { const n = new Mesh(new CylinderGeometry(0.18, 0.18, W * 0.86, 10, 1, false, 0, Math.PI).rotateZ(Math.PI / 2), paint); n.position.set(0, 0.98, 3.12); g.add(n); }
  tilt(box(g, glass(), W * 0.86, 0.05, 0.75, 0, 1.25, 2.12), 0.9);
  const chrome = std("chrome", "#c9ccd0", 0.25, 0.8), dk = std("evPlast", "#2a2b2e", 0.7, 0.05);
  box(g, chrome, W * 0.95, 0.22, 0.16, 0, 0.36, 3.36); box(g, dk, W * 0.95, 0.2, 0.3, 0, 0.32, -3.2);
  box(g, paint, W * 1.03, 0.1, 4.08, 0, 2.97, -1.15); // roof lip
  for (const s of [-1, 1]) box(g, dk, 0.16, 0.24, 0.07, s * (W / 2 + 0.06), 1.45, 1.9);
  const hl = std("hl", "#e9eef2", 0.2, 0.3);
  for (const s of [-1, 1]) box(g, hl, 0.34, 0.16, 0.04, s * 0.72, 0.95, 3.31);
  wheels(g, W, 2.4, -2.0); arches(g, W, [2.4], "#2a2b2e"); arches(g, W, [-2.0], body);
  // corner marker lights on the box (red/white) + cab bar
  const bar = lightBar(g, 2.97, 0.95, W * 0.8);
  for (const s of [-1, 1]) { const m = new Mesh(BOX, new MeshBasicMaterial({ color: 0x501010, toneMapped: false })); m.scale.set(0.22, 0.14, 0.05); m.position.set(s * 0.8, 2.75, 0.86); m.name = "aw:ebar"; g.add(m); bar.push(m); }
  return { g, bar, colors: [0xff1008, 0xffffff] };
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
