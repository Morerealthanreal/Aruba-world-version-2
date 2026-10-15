// PORT=8777 node guard_step.mjs <label> "<query>" - the presented frame after an fps-guard resolution step.
// The step runs in a rAF callback after A's render (same order as the add-ons loop), then A's rendering is
// stopped (window.__noRender) so the screenshot shows exactly what the browser presented for that frame.
import fs from "fs";
import { boot, sleep } from "./boot.mjs";
fs.mkdirSync("./res/shots", { recursive: true });
const [label, query = "q=med"] = process.argv.slice(2);
const { browser, page } = await boot(query + "&fpsguard=0", { w: 1000, h: 620, dpr: 1, mobile: false });
await sleep(20000);
await page.screenshot({ path: `./res/shots/${label}_before.png` });
const lvl = await page.evaluate(() => new Promise((res) => requestAnimationFrame(() => {
  const g = window.__aw.guard; g.setLevel(g.level + 1); window.__noRender = true; res([g.level, game.renderer.getPixelRatio()]);
})));
await sleep(3000);
await page.screenshot({ path: `./res/shots/${label}_after.png` });
const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
console.log(label, "guard level/pr", JSON.stringify(lvl), "- page background", bg, "visible where nothing was presented");
await browser.close();
