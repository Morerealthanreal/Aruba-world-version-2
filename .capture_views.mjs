import { chromium } from "@playwright/test";
import fs from "fs";

const file = process.argv[2] || "/.tmp/sport.glb";
const tag = process.argv[3] || "src";
const views = (process.argv[4] || "side,front,rear,three,rear3").split(",");
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
fs.mkdirSync("/tmp/shots", { recursive: true });
for (const view of views) {
  const url = `http://127.0.0.1:8766/.preview_bike.html?file=${encodeURIComponent(file)}&view=${view}`;
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
  const info = await page.evaluate(() => window.__info);
  console.log(view, JSON.stringify(info));
  await page.screenshot({ path: `/tmp/shots/${tag}-${view}.png` });
}
await browser.close();
