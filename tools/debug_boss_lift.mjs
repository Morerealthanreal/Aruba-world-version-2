import { chromium } from "@playwright/test";
import fs from "node:fs";

const m = JSON.parse(fs.readFileSync("game/data/sn_murals.json", "utf8")).murals.find((x) => x.id === "boss");
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.setDefaultTimeout(180000);
await page.goto("http://127.0.0.1:8777/?q=high&t=11&freeze=1");
await page.waitForFunction(() => window.game && window.game.ready, null, { timeout: 180000 });
await page.waitForFunction(() => window.__aw && window.__aw.sn && window.__aw.sn.mesh && window.__aw.sn.mesh.visible, null, { timeout: 60000 });
const [ox, oz] = m.normal;
const [cx, cz] = m.center;
await page.evaluate(({ x, z, h }) => window.game.teleport("car", x, z, h), {
  x: cx + ox * 22, z: cz + oz * 22, h: Math.atan2(ox, oz),
});
await page.waitForTimeout(3000);
const shots = await page.evaluate((m) => {
  const g = window.game;
  const [ox, oz] = m.normal;
  const [cx, cz] = m.center;
  const cam = g.camera;
  const dist = 12;
  const camX = cx + ox * dist;
  const camZ = cz + oz * dist;
  const gy = g.real.heightAt(camX, camZ);
  const wy = g.real.heightAt(cx, cz);
  const bottom = wy + Math.max(0.06, (m.bld_h - m.height) * 0.5);
  const eye = gy + 1.6;
  cam.position.set(camX, eye, camZ);
  cam.lookAt(cx, bottom + m.height * 0.5, cz);
  cam.updateMatrixWorld(true);
  const mesh = window.__aw.sn.mesh;
  const out = {};
  const snap = (key) => {
    g.renderer.render(g.scene, cam);
    out[key] = g.renderer.domElement.toDataURL("image/jpeg", 0.8);
  };
  mesh.material.depthTest = true;
  mesh.material.polygonOffsetFactor = -4;
  mesh.renderOrder = 2;
  for (const lift of [0, 2, 4]) {
    mesh.position.set(ox * lift, 0, oz * lift);
    mesh.updateMatrixWorld(true);
    snap("L" + lift);
  }
  mesh.material.depthTest = false;
  mesh.renderOrder = 20;
  mesh.position.set(0, 0, 0);
  mesh.updateMatrixWorld(true);
  snap("nodepth");
  mesh.material.depthTest = true;
  return out;
}, m);
for (const [k, url] of Object.entries(shots)) {
  fs.writeFileSync(`/tmp/sn-street/boss_${k}.jpg`, Buffer.from(url.split(",")[1], "base64"));
  console.log(k, "bytes", Buffer.from(url.split(",")[1], "base64").length);
}
await browser.close();
