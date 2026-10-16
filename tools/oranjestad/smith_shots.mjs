// L.G. Smith waterfront hotels, Paardenbaai cranes, roundabout sculptures.
// Usage: node smith_shots.mjs before|after [name,name]
import puppeteer from "/workspace/tools/perf/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
import { writeFile, mkdir } from "node:fs/promises";

const phase = process.argv[2] || "before";
const only = new Set((process.argv[3] || "").split(",").filter(Boolean));
const outDir = `/opt/cursor/artifacts/oranjestad-smith/${phase}`;
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
  if (m.type() === "error") console.log("CONSOLE", m.text().slice(0, 220));
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
    name: "renaissance",
    stand: [-7480, 70],
    eye: [-7480, 2.4, 70],
    look: [-7348, 8, 98],
  },
  {
    name: "ocean",
    stand: [-7350, 470],
    eye: [-7350, 2.4, 470],
    look: [-7225, 10, 479],
  },
  {
    name: "voco",
    stand: [-6380, 1120],
    eye: [-6380, 2.3, 1120],
    look: [-6306, 6, 1139],
  },
  {
    name: "obelisk",
    stand: [-7312, 84],
    eye: [-7312, 1.7, 84],
    look: [-7282, 7, 84],
  },
  {
    name: "waves",
    stand: [-8438, -698],
    eye: [-8438, 2.1, -698],
    look: [-8455, 4.4, -720],
  },
  {
    name: "ribbon",
    stand: [-8270, -840],
    eye: [-8270, 2.2, -840],
    look: [-8303, 3.6, -870],
  },
  {
    name: "cranes",
    stand: [-8296, -392],
    eye: [-8296, 2.2, -392],
    look: [-8340, 12, -350],
  },
];

const FORCE = [
  "m_renaissancearubaresortca",
  "renmall",
  "renocean",
  "voco",
  "voco_arch",
  "rb_obelisk",
  "rb_waves",
  "rb_ribbon",
  "rb_sunplaza",
  "ora_portauth",
  "portsauthority",
  "ora_smithhotels",
  "ora_cranes",
  "ora_rounds",
];

async function shoot(shot) {
  await page.evaluate(({ x, z }) => {
    window.__noRender = false;
    window.game.teleport("walk", x, z, 0);
  }, { x: shot.stand[0], z: shot.stand[1] });
  await new Promise((r) => setTimeout(r, 11000));
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
      eyeY,
      lookY,
    };
  }, { ...shot, force: FORCE });
  console.log("vis", shot.name, JSON.stringify(dataUrl.vis), "eye", dataUrl.eyeY.toFixed(1), "look", dataUrl.lookY.toFixed(1));
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
