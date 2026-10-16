import { chromium } from "@playwright/test";
import fs from "fs";

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
page.on("pageerror", (err) => console.log("pageerror", err.message));
await page.goto("http://127.0.0.1:8780/?t=12.5&freeze=1&q=high", {
  waitUntil: "domcontentloaded",
  timeout: 120000,
});
await page.waitForFunction(() => window.game?.ready && window.__aw, null, { timeout: 180000 });
const placed = await page.evaluate(() => {
  const g = window.game;
  const t = g.fromLL(12.5186, -70.0358);
  const r = g.nearestRoad(t.x, t.z);
  g.teleport("car", r.x, r.z, r.h);
  g.setMode("moto");
  g.S.car.s = 0;
  window.__aw.clock.setHour(12.5);
  window.__aw.clock.setFrozen(true);
  return { x: r.x, z: r.z, h: r.h };
});
console.log("placed", placed);
await page.waitForFunction(() => {
  let found = false;
  window.game.scene.traverse((o) => { if (o.name === "sport_bike") found = true; });
  return found;
}, null, { timeout: 60000 });
await page.waitForTimeout(8000);

const views = {
  // In the placed bike, local +Z frames the nose and local -Z frames the tail.
  three: { pos: [1.25, 0.88, 1.7], look: [0, 0.62, 0.15], fov: 30 },
  side: { pos: [3.1, 0.95, 0.02], look: [0, 0.72, -0.05], fov: 26 },
  ride: { pos: [0.8, 1.15, -1.75], look: [0, 0.72, -0.15], fov: 32 },
  // Same placement as the in-game chase camera: 4.25 m back, pitch 0.2, look at y=1.5, then the moto hook drops the camera 0.5 m.
  chase: { pos: [0, 1.84, -4.16], look: [0, 1.5, 0], fov: 42 },
};

fs.mkdirSync("/tmp/shots", { recursive: true });
for (const [name, view] of Object.entries(views)) {
  const dataUrl = await page.evaluate((view) => {
    const game = window.game;
    let bike = null;
    game.scene.traverse((o) => {
      if (o.name === "sport_bike" || o.name === "sport_rider") {
        o.visible = true;
        if (o.name === "sport_bike") bike = o;
      }
      if (o.name === "sport_bike_far" || o.name === "sport_rider_far" || /_far$/.test(o.name)) o.visible = false;
    });
    if (!bike) return "";
    bike.updateWorldMatrix(true, true);
    const e = bike.matrixWorld.elements;
    const apply = (x, y, z) => [
      e[0] * x + e[4] * y + e[8] * z + e[12],
      e[1] * x + e[5] * y + e[9] * z + e[13],
      e[2] * x + e[6] * y + e[10] * z + e[14],
    ];
    const cam = game.camera.clone();
    cam.fov = view.fov;
    cam.near = 0.08;
    cam.far = Math.max(game.camera.far, 8000);
    cam.layers.mask = game.camera.layers.mask;
    const p = apply(view.pos[0], view.pos[1], view.pos[2]);
    const l = apply(view.look[0], view.look[1], view.look[2]);
    cam.position.set(p[0], p[1], p[2]);
    cam.lookAt(l[0], l[1], l[2]);
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();
    const renderer = game.renderer;
    renderer.setRenderTarget(null);
    renderer.setScissorTest(false);
    renderer.render(game.scene, cam);
    return renderer.domElement.toDataURL("image/png");
  }, view);
  if (!dataUrl.startsWith("data:image")) throw new Error("capture failed " + name);
  const png = Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64");
  const path = `/tmp/shots/street-${name}.png`;
  fs.writeFileSync(path, png);
  console.log(name, png.length);
}
await browser.close();
