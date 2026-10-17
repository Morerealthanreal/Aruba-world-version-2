import { chromium } from "@playwright/test";
import fs from "node:fs";

const m = JSON.parse(fs.readFileSync("game/data/sn_murals.json", "utf8")).murals
  .find((x) => x.id === "boss");
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.setDefaultTimeout(180000);
await page.goto("http://127.0.0.1:8777/?q=high&t=11&freeze=1");
await page.waitForFunction(() => window.game && window.game.ready, null, { timeout: 180000 });
await page.waitForFunction(() => window.__aw && window.__aw.sn && window.__aw.sn.mesh, null, { timeout: 60000 });
const [ox, oz] = m.normal;
const [cx, cz] = m.center;
const hdg = Math.atan2(ox, oz);
await page.evaluate(({ x, z, h }) => window.game.teleport("car", x, z, h), {
  x: cx + ox * 18, z: cz + oz * 18, h: hdg,
});
await page.waitForTimeout(2500);
const shot = await page.evaluate((m) => {
  const g = window.game;
  const [ox, oz] = m.normal;
  const [cx, cz] = m.center;
  const dist = 10;
  const camX = cx + ox * dist;
  const camZ = cz + oz * dist;
  const gy = g.real.heightAt(camX, camZ);
  const wy = g.real.heightAt(cx, cz);
  const bottom = wy + Math.max(0.06, (m.bld_h - m.height) * 0.5);
  const lookY = bottom + m.height * 0.46;
  const eye = gy + 1.6;
  const cam = g.camera;
  const before = { x: cam.position.x, y: cam.position.y, z: cam.position.z, parent: cam.parent && cam.parent.type };
  cam.position.set(camX, eye, camZ);
  const auto = cam.matrixAutoUpdate;
  cam.matrixAutoUpdate = true;
  cam.lookAt(cx, lookY, cz);
  cam.updateMatrix();
  cam.updateMatrixWorld(true);
  const dirV = cam.position.clone();
  cam.getWorldDirection(dirV);
  const dir = { x: dirV.x, y: dirV.y, z: dirV.z };
  const mid = {
    x: cam.position.x, y: cam.position.y, z: cam.position.z,
    auto, dir,
    m: cam.matrix.elements.slice(0, 12),
  };
  const project = (x, y, z) => {
    const v = cam.position.clone();
    v.set(x, y, z);
    v.project(cam);
    return { x: +v.x.toFixed(3), y: +v.y.toFixed(3), z: +v.z.toFixed(3) };
  };
  const ndc = [
    project(m.p0[0], bottom, m.p0[1]),
    project(m.p1[0], bottom, m.p1[1]),
    project(m.p1[0], bottom + m.height, m.p1[1]),
    project(m.p0[0], bottom + m.height, m.p0[1]),
  ];
  g.renderer.render(g.scene, cam);
  const urlDirect = g.renderer.domElement.toDataURL("image/jpeg", 0.8);
  const mesh = window.__aw.sn.mesh;
  const hidden = [];
  g.scene.traverse((o) => {
    if (o.isMesh && o !== mesh) {
      hidden.push(o);
      o.visible = false;
    }
  });
  g.renderer.render(g.scene, cam);
  const urlOnly = g.renderer.domElement.toDataURL("image/jpeg", 0.75);
  for (const o of hidden) o.visible = true;
  mesh.position.x += m.normal[0] * 1.2;
  mesh.position.z += m.normal[1] * 1.2;
  mesh.updateMatrixWorld(true);
  g.renderer.render(g.scene, cam);
  const urlLift = g.renderer.domElement.toDataURL("image/jpeg", 0.75);
  mesh.position.set(0, 0, 0);
  const occluders = [];
  g.scene.traverse((o) => {
    if (!o.isMesh || o === mesh || !o.geometry) return;
    if (!o.geometry.boundingSphere) o.geometry.computeBoundingSphere();
    const s = o.geometry.boundingSphere;
    if (!s) return;
    const c = s.center.clone();
    o.localToWorld(c);
    const dx = c.x - cam.position.x;
    const dy = c.y - cam.position.y;
    const dz = c.z - cam.position.z;
    const dist = Math.hypot(dx, dy, dz);
    const gap = dist - s.radius;
    if (gap < 6 && dist < 40) {
      occluders.push({ n: o.name || o.type, gap: +gap.toFixed(2), r: +s.radius.toFixed(1), vis: o.visible });
    }
  });
  occluders.sort((a, b) => a.gap - b.gap);
  let urlPost = null;
  let after = null;
  if (window.__awPost && window.__awPost.render) {
    window.__awPost.render();
    after = { x: cam.position.x, y: cam.position.y, z: cam.position.z };
    urlPost = g.renderer.domElement.toDataURL("image/jpeg", 0.8);
  }
  return {
    before, mid, after, eye, lookY, camX, camZ, wy, ndc,
    near: cam.near, fov: cam.fov, occluders: occluders.slice(0, 12),
    mesh: !!(window.__aw.sn && window.__aw.sn.mesh && window.__aw.sn.mesh.visible),
    urlDirect, urlOnly, urlLift, urlPost, hasPost: !!window.__awPost,
  };
}, m);
fs.writeFileSync("/tmp/sn-street/boss_direct.jpg", Buffer.from(shot.urlDirect.split(",")[1], "base64"));
fs.writeFileSync("/tmp/sn-street/boss_only.jpg", Buffer.from(shot.urlOnly.split(",")[1], "base64"));
fs.writeFileSync("/tmp/sn-street/boss_lift.jpg", Buffer.from(shot.urlLift.split(",")[1], "base64"));
if (shot.urlPost) fs.writeFileSync("/tmp/sn-street/boss_post.jpg", Buffer.from(shot.urlPost.split(",")[1], "base64"));
delete shot.urlDirect;
delete shot.urlOnly;
delete shot.urlLift;
delete shot.urlPost;
console.log(JSON.stringify(shot, null, 2));
await browser.close();
