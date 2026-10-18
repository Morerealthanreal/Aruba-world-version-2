// In-game proof on the real Korps Politie wall (San Nicolas), not an isolated test card.
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
  "http://127.0.0.1:8777/?q=high&t=11&freeze=1&addons=1&snmurals=1&snfair=0&snlater=0&snfamous=0&snsacrecent=0&peds=0&traffic=0&far=1";
await page.goto(url, { waitUntil: "domcontentloaded" });
await page.waitForFunction(() => window.game && window.game.ready, null, { timeout: 180000 });
await page.waitForSelector("#loading", { state: "hidden", timeout: 180000 });

async function settleAtSite() {
  await page.evaluate((MURAL) => {
    const g = window.game;
    const px = MURAL.cx + MURAL.nx * 14;
    const pz = MURAL.cz + MURAL.nz * 14;
    const yaw = Math.atan2(-MURAL.nx, -MURAL.nz);
    g.teleport("walk", px, pz, yaw);
    g.S.lookPitch = -0.06;
    g.S.lookYaw = 0;
    g.S.snapCam = 6;
    g.S.walk.snap = true;
    g.S.paused = false;
  }, MURAL);

  await page.waitForFunction(
    (MURAL) => {
      const g = window.game;
      const M = g.real && g.real.M;
      if (!M) return false;
      const rx = Math.floor((MURAL.cx - M.X0) / M.RS);
      const rz = Math.floor((MURAL.cz - M.Z0) / M.RS);
      let regionBuilt = false;
      for (const r of g.real.regions.values()) {
        if (r.rx === rx && r.rz === rz && r.state === "built") regionBuilt = true;
      }
      if (!regionBuilt) return false;
      let bldMeshes = 0;
      g.real.group.traverse((o) => {
        if (o.isMesh && o.visible) bldMeshes++;
      });
      const mural = g.scene.getObjectByName("aw:sn-murals");
      return bldMeshes > 80 && mural && mural.visible;
    },
    MURAL,
    { timeout: 180000 },
  );
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    const sn = window.__aw && window.__aw.sn;
    if (sn && typeof sn.tryGround === "function") sn.tryGround();
  });
  await page.waitForTimeout(2500);
}

await settleAtSite();

await page.waitForFunction(
  () => {
    const g = window.game;
    const m = g.scene && g.scene.getObjectByName("aw:sn-murals");
    const w = g.scene && g.scene.getObjectByName("aw:sn-mural-walls");
    const posCount = (geo) => geo && geo.attributes.position && geo.attributes.position.count;
    const muralOk = m && m.visible && posCount(m.geometry) > 8;
    const wallOk = !w || (w.visible && posCount(w.geometry) >= 4);
    return muralOk && wallOk;
  },
  null,
  { timeout: 180000 },
);

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
      const mural = g.scene.getObjectByName("aw:sn-murals");
      let bldMeshes = 0;
      g.real.group.traverse((o) => {
        if (o.isMesh && o.visible) bldMeshes++;
      });
      const M = g.real.M;
      const rx = Math.floor((MURAL.cx - M.X0) / M.RS);
      const rz = Math.floor((MURAL.cz - M.Z0) / M.RS);
      return {
        png: g.renderer.domElement.toDataURL("image/png"),
        distM,
        version: window.__aw && window.__aw.version,
        muralVisible: mural && mural.visible,
        bldMeshes,
        region: { rx, rz },
        cam: { x: cx, z: cz, eyeY, lookY, ground },
      };
    },
    { MURAL, distM },
  );
  const png = Buffer.from(payload.png.slice(payload.png.indexOf(",") + 1), "base64");
  await writeFile(`${outDir}/ingame_${name}.png`, png);
  const { png: _drop, ...meta } = payload;
  console.log("wrote", name, distM + "m", png.length, JSON.stringify(meta));
  if (!payload.muralVisible || png.length < 5000) throw new Error("bad shot " + name);
  if (payload.bldMeshes < 40) throw new Error("no building context at " + name);
}

await shot("10m", 10);
await shot("25m", 25);
await browser.close();
console.log("done", outDir);
