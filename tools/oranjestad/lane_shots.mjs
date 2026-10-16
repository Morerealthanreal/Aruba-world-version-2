// Side-street and harbor-from-the-water shots.
// Usage: node lane_shots.mjs before|after [name,name]
import puppeteer from "/workspace/tools/perf/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
import { writeFile, mkdir } from "node:fs/promises";

const phase = process.argv[2] || "before";
const only = new Set((process.argv[3] || "").split(",").filter(Boolean));
const outDir = `/opt/cursor/artifacts/oranjestad-lanes/${phase}`;
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

// eye y <= 20 is a lift above the ground. look y <= 20 is added to the ground.
const shots = [
  {
    name: "schelp",
    stand: [-7525, -131],
    eye: [-7525, 2.2, -131],
    look: [-7528, 4.6, -118],
  },
  {
    name: "klip",
    stand: [-7228, 38],
    eye: [-7228, 2.2, 38],
    look: [-7226, 4.8, 26],
  },
  {
    name: "haven",
    stand: [-7478, -50],
    eye: [-7478, 2.2, -50],
    look: [-7486, 4.4, -38],
  },
  {
    name: "harbor",
    stand: [-7688, -58],
    eye: [-7688, 2.4, -58],
    look: [-7588, 8.2, -41],
  },
  {
    name: "west",
    stand: [-7608, -58],
    eye: [-7608, 2.2, -58],
    look: [-7620, 4.6, -68],
  },
];

const FORCE = [
  "ora_schelp",
  "ora_klip",
  "ora_haven",
  "ora_wilhelm",
  "ora_west",
  "ora_steen",
  "ora_oranje",
  "ora_harbor",
  "ora_crowns",
  "ora_mallface",
  "ora_quay",
  "royalplaza",
  "renmall",
];

async function shoot(shot) {
  await page.evaluate(({ x, z }) => {
    window.__noRender = false;
    window.game.teleport("walk", x, z, 0);
  }, { x: shot.stand[0], z: shot.stand[1] });
  await new Promise((r) => setTimeout(r, 12000));
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
      blocked: g.blocked ? g.blocked(eye[0], eye[2]) : null,
      eyeY,
      lookY,
    };
  }, { ...shot, force: FORCE });
  console.log(
    "vis",
    shot.name,
    JSON.stringify(dataUrl.vis),
    "blocked",
    dataUrl.blocked,
    "eye",
    dataUrl.eyeY.toFixed(1),
    "look",
    dataUrl.lookY.toFixed(1),
  );
  const buf = Buffer.from(dataUrl.png.slice(dataUrl.png.indexOf(",") + 1), "base64");
  const file = `${outDir}/${shot.name}.png`;
  await writeFile(file, buf);
  console.log("wrote", file, buf.length);
}

for (const shot of shots) {
  if (only.size && !only.has(shot.name)) continue;
  await shoot(shot);
}
await browser.close();
