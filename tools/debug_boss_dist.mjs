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
await page.waitForFunction(() => window.__aw?.sn?.mesh?.visible, null, { timeout: 60000 });
const [ox, oz] = m.normal;
const [cx, cz] = m.center;
await page.evaluate(({ x, z, h }) => window.game.teleport("car", x, z, h), {
  x: cx + ox * 50, z: cz + oz * 50, h: Math.atan2(ox, oz),
});
await page.waitForTimeout(2500);
const shots = await page.evaluate((m) => {
  const g = window.game;
  const cam = g.camera;
  const [ox, oz] = m.normal;
  const [cx, cz] = m.center;
  const wy = g.real.heightAt(cx, cz);
  const bottom = wy + Math.max(0.06, (m.bld_h - m.height) * 0.5);
  const lookY = bottom + m.height * 0.45;
  const out = {};
  const places = [
    ["d8", 8, 1], ["d16", 16, 1], ["d24", 24, 1], ["d32", 32, 1],
    ["back16", 16, -1],
  ];
  for (const [key, dist, sign] of places) {
    const camX = cx + ox * dist * sign;
    const camZ = cz + oz * dist * sign;
    const gy = g.real.heightAt(camX, camZ);
    const eye = (typeof gy === "number" ? gy : wy) + 1.6;
    cam.position.set(camX, eye, camZ);
    cam.lookAt(cx, lookY, cz);
    cam.updateMatrixWorld(true);
    g.renderer.render(g.scene, cam);
    out[key] = g.renderer.domElement.toDataURL("image/jpeg", 0.8);
  }
  return out;
}, m);
for (const [k, url] of Object.entries(shots)) {
  const buf = Buffer.from(url.split(",")[1], "base64");
  fs.writeFileSync(`/tmp/sn-street/boss_${k}.jpg`, buf);
  console.log(k, buf.length);
}
await browser.close();
