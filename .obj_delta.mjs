import { chromium } from "@playwright/test";
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"] });
const page = await browser.newPage({ viewport: { width: 412, height: 915 }, deviceScaleFactor: 1 });
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
await page.goto("http://127.0.0.1:8777/?q=low&emerg=force&crash=force&crashx=10", { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.game?.ready && window.__aw, undefined, { timeout: 120000 });
await page.locator("#loading").waitFor({ state: "hidden" });
const result = await page.evaluate(() => {
  const count = () => { let n = 0; window.game.scene.traverse(() => n++); return n; };
  const before = count();
  const game = window.game;
  const saved = [];
  const lods = [];
  let blank = null;
  game.scene.traverse((object) => {
    if (object.isLOD) lods.push(object);
    if (!object.geometry || !(object.isMesh || object.isPoints || object.isLine)) return;
    if (!blank && object.material && !Array.isArray(object.material) && object.material.clone) {
      blank = object.material.clone();
      for (const key of ["map", "normalMap", "roughnessMap", "metalnessMap", "emissiveMap", "aoMap", "alphaMap", "bumpMap", "lightMap", "envMap", "specularMap"]) blank[key] = null;
    }
    saved.push({ object, visible: object.visible, frustumCulled: object.frustumCulled, material: object.material, onBeforeRender: object.onBeforeRender });
  });
  const nop = () => {};
  const sceneBefore = game.scene.onBeforeRender;
  const sceneAfter = game.scene.onAfterRender;
  try {
    game.scene.onBeforeRender = nop;
    game.scene.onAfterRender = nop;
    for (const lod of lods) { lod.userData.awUpdate = lod.update; lod.update = nop; }
    for (const item of saved) {
      item.object.visible = true; item.object.frustumCulled = false; item.object.onBeforeRender = nop;
      if (blank) item.object.material = blank;
    }
    game.renderer.render(game.scene, game.camera);
  } finally {
    game.scene.onBeforeRender = sceneBefore;
    game.scene.onAfterRender = sceneAfter;
    for (const item of saved) {
      item.object.visible = item.visible; item.object.frustumCulled = item.frustumCulled;
      item.object.material = item.material; item.object.onBeforeRender = item.onBeforeRender;
    }
    for (const lod of lods) lod.update = lod.userData.awUpdate;
  }
  const after = count();
  return { before, after, geo: game.renderer.info.memory.geometries, tex: game.renderer.info.memory.textures };
});
console.log(JSON.stringify(result));
await browser.close();
