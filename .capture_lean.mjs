import { chromium } from "@playwright/test";
import fs from "fs";
const browser = await chromium.launch({
  args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--disable-gpu-sandbox"],
});
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });
const views = ["side", "three"];
const leans = [["L", "0.72"], ["R", "-0.72"]];
for (const [tag, lean] of leans) {
  for (const view of views) {
    const url = `http://127.0.0.1:8766/.preview_bike.html?file=${encodeURIComponent("/.tmp/moto-rider-preview.glb")}&view=${view}&lean=${lean}`;
    await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 60000 });
    const path = `/tmp/shots/lean${tag}-${view}.png`;
    await page.screenshot({ path });
    console.log("wrote", path);
  }
}
await browser.close();
