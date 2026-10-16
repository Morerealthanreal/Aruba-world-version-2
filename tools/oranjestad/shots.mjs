// Headless downtown Oranjestad shots. Camera is posed after the region streams in.
// Usage: node shots.mjs before|after
import puppeteer from "/workspace/tools/perf/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
import { writeFile, mkdir } from "node:fs/promises";

const phase = process.argv[2] || "before";
const only = new Set((process.argv[3] || "").split(",").filter(Boolean));
const outDir = `/opt/cursor/artifacts/oranjestad-warm/${phase}`;
await mkdir(outDir, { recursive: true });

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME || "/usr/local/bin/google-chrome",
  headless: "new",
  protocolTimeout: 600000,
  args: [
    "--no-sandbox",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--ignore-gpu-blocklist",
    "--enable-webgl",
    "--disable-gpu-sandbox",
  ],
});
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
page.on("console", (m) => {
  if (m.type() === "error") console.log("CONSOLE", m.text().slice(0, 240));
});
await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 1 });
await page.goto("http://127.0.0.1:8777/?q=high&t=9.5&peds=0", {
  waitUntil: "load",
  timeout: 120000,
});
await page.waitForFunction(() => window.game && window.game.ready && window.game.real, {
  timeout: 240000,
  polling: 500,
});
console.log("ready");

// Stand the walker at each spot so that region and hero streaming covers it,
// then pose the camera once and render a single frame.
// eye y <= 20 is a lift above the ground; above 20 is an absolute height.
// look y is added to the ground height at the look point.
const shots = [
  {
    name: "mainstreet",
    stand: [-7080, 18],
    eye: [-7080, 2.2, 12],
    look: [-7280, 6.5, -8],
  },
  {
    name: "bus",
    stand: [-7660, -50],
    eye: [-7660, 2.4, -50],
    look: [-7725, 4.5, -28],
  },
  {
    name: "bus-port",
    stand: [-7755, 20],
    eye: [-7755, 2.2, 20],
    look: [-7708, 5.5, 8],
  },
  {
    name: "tram",
    stand: [-7306, -12],
    eye: [-7306, 1.8, -12],
    look: [-7235, 2.4, 4],
  },
  {
    name: "tram-port",
    stand: [-7620, -6],
    eye: [-7620, 1.8, -6],
    look: [-7622, 2.6, -34],
  },
  {
    name: "linear",
    stand: [-7485, 82],
    eye: [-7485, 1.7, 82],
    look: [-7430, 2.2, 122],
  },
  {
    name: "royal",
    stand: [-7618, -19],
    eye: [-7618, 2.0, -19],
    look: [-7602, 8.5, -42],
  },
  {
    name: "seaport",
    stand: [-7580, -90],
    eye: [-7580, 2.0, -90],
    look: [-7650, 4.2, -50],
  },
];

const FORCE = [
  "ora_gable0",
  "ora_gable1",
  "ora_gable2",
  "tramline",
  "arutram",
  "ora_tramstop",
  "ora_quay",
  "royalplaza",
  "ora_mallface",
  "ora_busstation",
  "ora_seaport",
  "ora_crowns",
];

async function shoot(shot) {
  await page.evaluate(({ x, z }) => {
    window.__noRender = false;
    window.game.teleport("walk", x, z, 0);
  }, { x: shot.stand[0], z: shot.stand[1] });
  await new Promise((r) => setTimeout(r, 14000));
  const dataUrl = await page.evaluate(({ eye, look, force }) => {
    const g = window.game;
    const cam = g.camera;
    const gy = g.real.heightAt(eye[0], eye[2]);
    const ly = g.real.heightAt(look[0], look[2]);
    const eyeY = eye[1] > 20 ? eye[1] : gy + eye[1];
    const lookY = look[1] > 20 ? look[1] : ly + look[1];
    const vis = {};
    g.scene.traverse((obj) => {
      const n = obj.name || "";
      for (const id of force) {
        if (n === `${id}_lod0` || n === `${id}_lod1`) vis[n] = obj.visible;
      }
    });
    const walker = g.player ? [g.player.position.x, g.player.position.z] : null;
    for (const id of force) {
      g.scene.traverse((obj) => {
        if (obj.name === `${id}_lod0`) obj.visible = true;
        if (obj.name === `${id}_lod1`) obj.visible = false;
      });
    }
    window.__noRender = true;
    cam.position.set(eye[0], eyeY, eye[2]);
    cam.lookAt(look[0], lookY, look[2]);
    cam.up.set(0, 1, 0);
    cam.updateMatrixWorld(true);
    g.scene.traverse((obj) => {
      if (obj.isSkinnedMesh) obj.visible = false;
    });
    g.renderer.render(g.scene, cam);
    return {
      png: g.renderer.domElement.toDataURL("image/png"),
      vis,
      walker,
      blocked: g.blocked ? g.blocked(eye[0], eye[2]) : null,
    };
  }, { ...shot, force: FORCE });
  console.log("vis", shot.name, JSON.stringify(dataUrl.vis), "walker", dataUrl.walker, "blocked", dataUrl.blocked);
  const buf = Buffer.from(dataUrl.png.slice(dataUrl.png.indexOf(",") + 1), "base64");
  const file = `${outDir}/${shot.name}.png`;
  await writeFile(file, buf);
  console.log("wrote", file, buf.length);
}

for (const shot of shots) {
  if (only.size && !only.has(shot.name)) continue;
  try {
    await shoot(shot);
  } catch (err) {
    console.log("FAIL", shot.name, err.message);
  }
}
await browser.close();
