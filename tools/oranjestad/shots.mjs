// Headless downtown Oranjestad shots. Camera is posed after the region streams in.
// Usage: node shots.mjs before|after
import puppeteer from "/workspace/tools/perf/node_modules/puppeteer-core/lib/puppeteer/puppeteer-core.js";
import { writeFile, mkdir } from "node:fs/promises";

const phase = process.argv[2] || "before";
const only = new Set((process.argv[3] || "").split(",").filter(Boolean));
const outDir = `/opt/cursor/artifacts/oranjestad/${phase}`;
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
    look: [-7280, 4.2, -8],
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
    stand: [-7188, 210],
    eye: [-7185, 2.2, 205],
    look: [-7132, 10, 258],
  },
  {
    name: "wilhelmina",
    stand: [-7084, 456],
    eye: [-7084, 2.4, 456],
    look: [-7116, 2.2, 453],
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
  {
    name: "promenade",
    stand: [-7466, 83],
    eye: [-7472, 2.0, 90],
    look: [-7515, 2.2, 145],
  },
  {
    name: "marina",
    stand: [-7420, 120],
    eye: [-7440, 2.1, 135],
    look: [-7510, 1.4, 155],
  },
  {
    name: "ren-mall",
    stand: [-7492, 62],
    eye: [-7500, 2.0, 40],
    look: [-7400, 7, 78],
  },
  {
    name: "royal-plaza-street",
    stand: [-7488, 28],
    eye: [-7480, 2.0, 36],
    look: [-7568, 7, -36],
  },
  {
    name: "marketplace",
    stand: [-7190, 300],
    eye: [-7205, 2.1, 285],
    look: [-7295, 6, 358],
  },
  {
    name: "seaport",
    stand: [-7645, -45],
    eye: [-7652, 2.0, -38],
    look: [-7585, 5, 18],
  },
  {
    name: "havenstraat",
    stand: [-7440, -22],
    eye: [-7458, 2.0, -32],
    look: [-7355, 4, 18],
  },
  {
    name: "schelpstraat",
    stand: [-7465, -98],
    eye: [-7480, 2.0, -108],
    look: [-7375, 4, -58],
  },
  {
    name: "wilhelminastraat",
    stand: [-7188, 108],
    eye: [-7205, 2.0, 98],
    look: [-7105, 4, 138],
  },
  {
    name: "klipstraat",
    stand: [-7240, 30],
    eye: [-7248, 2.0, 24],
    look: [-7160, 4, 64],
  },
  {
    name: "tram-main",
    stand: [-7055, 16],
    eye: [-7040, 2.0, 10],
    look: [-7165, 3.2, -4],
  },
  {
    name: "surfside",
    stand: [-6368, 1405],
    eye: [-6360, 2.2, 1392],
    look: [-6475, 1.6, 1420],
  },
  {
    name: "coast-road",
    stand: [-6440, 1048],
    eye: [-6455, 2.2, 1025],
    look: [-6365, 3.2, 1135],
  },
];

async function shoot(shot) {
  await page.evaluate(({ x, z }) => {
    window.__noRender = false;
    // Stand on the shot itself so hero LOD follows the camera, not a distant road.
    window.game.teleport("walk", x, z, 0);
  }, { x: shot.stand[0], z: shot.stand[1] });
  await new Promise((r) => setTimeout(r, 9000));
  const dataUrl = await page.evaluate(({ eye, look, lift }) => {
    window.__noRender = true;
    const g = window.game;
    const cam = g.camera;
    const gy = g.real.heightAt(eye[0], eye[2]);
    const ly = g.real.heightAt(look[0], look[2]);
    const up = lift || 1.7;
    cam.position.set(eye[0], gy + (eye[1] > 20 ? eye[1] : up), eye[2]);
    cam.lookAt(look[0], ly + (look[1] > 20 ? look[1] : Math.max(look[1], 3)), look[2]);
    cam.up.set(0, 1, 0);
    cam.updateMatrixWorld(true);
    g.renderer.render(g.scene, cam);
    return g.renderer.domElement.toDataURL("image/png");
  }, shot);
  const buf = Buffer.from(dataUrl.slice(dataUrl.indexOf(",") + 1), "base64");
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
