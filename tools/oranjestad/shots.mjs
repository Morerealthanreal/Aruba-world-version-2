// Headless Oranjestad civic shots. Camera is posed after the region streams in.
// Usage: node shots.mjs before|after [name,name]
import puppeteer from "/workspace/tools/perf/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
import { writeFile, mkdir } from "node:fs/promises";

const phase = process.argv[2] || "before";
const only = new Set((process.argv[3] || "").split(",").filter(Boolean));
const outDir = `/opt/cursor/artifacts/oranjestad-civic/${phase}`;
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
    name: "cruise",
    stand: [-7810, 70],
    eye: [-7810, 2.4, 70],
    look: [-7888, 6.5, 58],
  },
  {
    name: "marina",
    stand: [-7392, 168],
    eye: [-7392, 2.4, 168],
    look: [-7495, 2.0, 148],
  },
  {
    name: "ferry",
    stand: [-7384, 174],
    eye: [-7384, 2.6, 174],
    look: [-7438, 3.2, 162],
  },
  {
    name: "parliament",
    stand: [-7165, 218],
    eye: [-7165, 2.2, 218],
    look: [-7216, 6.2, 242],
  },
  {
    name: "cityhall",
    stand: [-7136, 128],
    eye: [-7136, 2.0, 128],
    look: [-7162, 5.2, 146],
  },
  {
    name: "portico",
    stand: [-7189, 220],
    eye: [-7189, 2.6, 220],
    look: [-7203, 5.2, 228],
  },
  {
    name: "govern",
    stand: [-7161, 206],
    eye: [-7161, 2.4, 206],
    look: [-7204, 8.0, 240],
  },
  {
    name: "plaza",
    stand: [-7304, 36],
    eye: [-7304, 2.2, 36],
    look: [-7328, 5.2, 10],
  },
  {
    name: "museum",
    stand: [-7383, -144],
    eye: [-7383, 2.2, -144],
    look: [-7418, 5.4, -130],
  },
];

const FORCE = [
  "cruise",
  "ora_marina",
  "ora_ferry",
  "gova77053638",
  "governor",
  "cityhall",
  "archmuseum",
  "penha",
  "bluehorse_fountain",
  "ora_penharow",
  "ora_plaza",
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
    };
  }, { ...shot, force: FORCE });
  console.log("vis", shot.name, JSON.stringify(dataUrl.vis), "blocked", dataUrl.blocked);
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
