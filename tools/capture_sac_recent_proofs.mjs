/**
 * Capture in-game mural frames for SAC recent batch (after ?snsacrecent=1).
 * Usage: node tools/capture_sac_recent_proofs.mjs
 */
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "docs/mural-proofs/sac-recent");

const MURALS = [
  { id: "sarah_quitta", x: 6443.8, z: 9403.98, h: 1.2 },
  { id: "belted_kingfisher", x: 10087.4, z: 11020.53, h: 4.5 },
];

async function waitGame(page) {
  await page.goto("http://127.0.0.1:8777/?q=low&snsacrecent=1&snmurals=0&snfair=0&snlater=0&snfamous=0", {
    waitUntil: "domcontentloaded",
  });
  await page.waitForFunction(() => window.game?.real?.q?.name, { timeout: 120_000 });
  await page.waitForTimeout(4000);
}

async function shotMural(page, m) {
  await page.evaluate(
    ({ x, z, h }) => {
      const g = window.game;
      g.teleport("car", x - 6 * Math.sin(h), z - 6 * Math.cos(h), h);
      g.S.mode = "car";
    },
    m,
  );
  await page.waitForTimeout(2500);
  const file = path.join(OUT, `${m.id}-ingame.png`);
  await page.screenshot({ path: file, fullPage: false });
  return file;
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  try {
    await waitGame(page);
    for (const m of MURALS) {
      const f = await shotMural(page, m);
      console.log("wrote", f);
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
