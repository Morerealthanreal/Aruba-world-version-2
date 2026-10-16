// Headless downtown Oranjestad shots. Camera is posed after the region streams in.
// Usage: node shots.mjs before|after
import puppeteer from "/workspace/tools/perf/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
import { writeFile, mkdir } from "node:fs/promises";

const phase = process.argv[2] || "before";
const only = new Set((process.argv[3] || "").split(",").filter(Boolean));
const outDir = `/opt/cursor/artifacts/oranjestad-skyline/${phase}`;
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
await page.goto("http://127.0.0.1:8777/?q=high&t=9.5", {
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
const shots = [
  {
    name: "mainstreet",
    stand: [-7080, 18],
    eye: [-7080, 2.1, 12],
    look: [-7280, 5.5, -8],
  },
  {
    name: "church",
    stand: [-7267, 80],
    eye: [-7267, 1.7, 80],
    look: [-7240, 7.5, 68],
  },
  {
    name: "church-quarter",
    stand: [-7255, 68],
    eye: [-7255, 1.7, 68],
    look: [-7236, 10, 78],
  },
  {
    name: "gables",
    stand: [-7148, 6],
    eye: [-7148, 1.7, 6],
    look: [-7220, 8.2, 24],
  },
  {
    name: "mainstreet-east",
    stand: [-6880, 40],
    eye: [-6880, 2.2, 32],
    look: [-7080, 4.5, 10],
  },
  {
    name: "lg-smith",
    stand: [-7480, 40],
    eye: [-7460, 2.4, 90],
    look: [-7580, 6, -20],
  },
  {
    name: "royal-plaza",
    stand: [-7520, 30],
    eye: [-7470, 2.2, 55],
    look: [-7565, 8, -30],
  },
  {
    name: "fort-zoutman",
    stand: [-7136, 222],
    eye: [-7136, 3.8, 216],
    look: [-7141, 8.2, 238],
  },
  {
    name: "wilhelmina",
    stand: [-7092, 453],
    eye: [-7092, 2.6, 453],
    look: [-7106.2, 5.6, 453],
  },
  {
    name: "cruise-terminal",
    stand: [-7820, 90],
    eye: [-7795, 2.8, 115],
    look: [-7888, 6, 58],
  },
  {
    name: "renaissance",
    stand: [-7240, 280],
    eye: [-7220, 2.4, 250],
    look: [-7305, 5, 350],
  },
  {
    name: "harbour-overview",
    stand: [-7300, 80],
    eye: [-7550, 78, 280],
    look: [-7350, 4, 40],
  },
];

async function shoot(shot) {
  await page.evaluate(({ x, z }) => {
    window.__noRender = false;
    // Stand on the shot itself so hero LOD follows the camera, not a distant road.
    window.game.teleport("walk", x, z, 0);
  }, { x: shot.stand[0], z: shot.stand[1] });
  await new Promise((r) => setTimeout(r, 14000));
  const dataUrl = await page.evaluate(({ eye, look, lift }) => {
    window.__noRender = true;
    const g = window.game;
    const cam = g.camera;
    const gy = g.real.heightAt(eye[0], eye[2]);
    const ly = g.real.heightAt(look[0], look[2]);
    const up = eye[1] > 20 ? eye[1] : (eye[1] || lift || 1.7);
    cam.position.set(eye[0], eye[1] > 20 ? eye[1] : gy + up, eye[2]);
    cam.lookAt(look[0], look[1] > 20 ? look[1] : ly + Math.max(look[1], 3), look[2]);
    cam.up.set(0, 1, 0);
    cam.updateMatrixWorld(true);
    g.scene.traverse((obj) => {
      if (obj.isSkinnedMesh) obj.visible = false;
    });
    const vis = {};
    let walker = null;
    g.scene.traverse((obj) => {
      if (!walker && obj.isSkinnedMesh) {
        obj.updateWorldMatrix(true, false);
        const e = obj.matrixWorld.elements;
        walker = [Math.round(e[12]), Math.round(e[14])];
      }
      if (!obj.name) return;
      if (/^(protestant_old|ora_gable0|fortzoutman|wilhelmina_statue)_lod0$/.test(obj.name)) {
        vis[obj.name] = obj.visible;
        obj.visible = true;
      }
      if (/^(protestant_old|ora_gable0|fortzoutman|wilhelmina_statue)_lod1$/.test(obj.name)) obj.visible = false;
    });
    vis.walker = walker;
    g.renderer.render(g.scene, cam);
    return { url: g.renderer.domElement.toDataURL("image/png"), vis };
  }, shot);
  console.log(shot.name, "lod", JSON.stringify(dataUrl.vis));
  const buf = Buffer.from(dataUrl.url.slice(dataUrl.url.indexOf(",") + 1), "base64");
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
