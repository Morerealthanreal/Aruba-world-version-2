import puppeteer from "puppeteer-core";
export async function boot(query = "q=low", { w = 412, h = 915, dpr = 2.625, mobile = true, args = [] } = {}) {
  const browser = await puppeteer.launch({
    executablePath: process.env.CHROME || "/usr/local/bin/google-chrome",
    headless: "new",
    protocolTimeout: 600000,
    args: ["--no-sandbox", "--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--ignore-gpu-blocklist", "--enable-webgl", "--enable-precise-memory-info", "--js-flags=--expose-gc", "--disable-background-timer-throttling", "--disable-renderer-backgrounding", "--disable-backgrounding-occluded-windows", ...args],
  });
  const page = await browser.newPage();
  page.on("pageerror", (e) => console.log("PAGEERROR", e.message));
  page.on("console", (m) => { const t = m.text(); if (m.type() === "error" || /aw-|warn/i.test(t)) console.log("CONSOLE", m.type(), t.slice(0, 300)); });
  await page.setViewport({ width: w, height: h, deviceScaleFactor: dpr, isMobile: mobile, hasTouch: mobile });
  if (mobile) await page.setUserAgent("Mozilla/5.0 (Linux; Android 14; SM-S926B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/154.0.0.0 Mobile Safari/537.36");
  await page.goto("http://127.0.0.1:" + (process.env.PORT || 8777) + "/?" + query, { waitUntil: "load", timeout: 120000 });
  await page.waitForFunction(() => window.game && window.game.ready && window.game.real, { timeout: 300000, polling: 500 });
  return { browser, page };
}
export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
