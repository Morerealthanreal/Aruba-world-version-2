// In-game proof frames for night_watcher mural (#135 rectified atlas).
// usage: node tools/night_watcher_proof_shot.mjs [outDir]
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const outDir = process.argv[2] || "/opt/cursor/artifacts/night_watcher_pr135";
await mkdir(outDir, { recursive: true });

const MURAL = {
  cx: 6369.8,
  cz: 9310.35,
  nx: -0.1334,
  nz: 0.9911,
  bld_h: 6.9,
  height: 6.85,
};

const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
const url =
  "http://127.0.0.1:8777/?q=high&t=11&freeze=1&addons=1&snmurals=1&snfair=0&snlater=0&snfamous=0&snsacrecent=0&peds=0&traffic=0";
await page.goto(url, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.game && window.game.ready, null, { timeout: 180000 });
await page.waitForSelector("#loading", { state: "hidden", timeout: 180000 });

await page.waitForFunction(
  () => {
    const g = window.game;
    const m = g.scene && g.scene.getObjectByName("aw:sn-murals");
    return m && m.visible && m.geometry && m.geometry.attributes.position;
  },
  null,
  { timeout: 180000 },
);
await page.waitForTimeout(2500);

async function shot(name, distM) {
  const payload = await page.evaluate(
    ({ MURAL, distM }) => {
      const g = window.game;
      const cx = MURAL.cx + MURAL.nx * distM;
      const cz = MURAL.cz + MURAL.nz * distM;
      const ground = g.real.heightAt(cx, cz) || 0;
      const yBot = ground + Math.max(0.06, (MURAL.bld_h - MURAL.height) * 0.5);
      const lookY = yBot + MURAL.height * 0.5;
      const eyeY = ground + 1.65;
      g.S.paused = true;
      g.camera.position.set(cx, eyeY, cz);
      g.camera.lookAt(MURAL.cx, lookY, MURAL.cz);
      g.renderer.render(g.scene, g.camera);
      const ver = window.__aw && window.__aw.version;
      const mural = g.scene.getObjectByName("aw:sn-murals");
      return {
        png: g.renderer.domElement.toDataURL("image/png"),
        distM,
        version: ver,
        muralVisible: mural && mural.visible,
        cam: { x: cx, z: cz, eyeY, lookY },
      };
    },
    { MURAL, distM },
  );
  const png = Buffer.from(payload.png.slice(payload.png.indexOf(",") + 1), "base64");
  await writeFile(`${outDir}/ingame_${name}.png`, png);
  const { png: _drop, ...meta } = payload;
  console.log("wrote", name, distM + "m", png.length, JSON.stringify(meta));
  if (!payload.muralVisible || png.length < 5000) throw new Error("bad shot " + name);
}

await shot("10m", 10);
await shot("25m", 25);
await browser.close();
console.log("done", outDir);
