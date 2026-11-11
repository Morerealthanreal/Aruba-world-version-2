import { expect, test } from "@playwright/test";

// Phone-sized settings sheet (Galaxy S24+ CSS viewport). The diagnostics block
// stays collapsed, and opening it must not touch the active quality profile.
test.use({
  viewport: { width: 384, height: 832 },
  hasTouch: true,
  isMobile: true,
  permissions: ["clipboard-read", "clipboard-write"],
});

test("settings graphics diagnostics describe the device", async ({ page }, testInfo) => {
  const quality = testInfo.project.name;
  const errors = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.stack || error.message));

  await page.goto(`/?q=${quality}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.game?.ready && window.__aw && document.getElementById("awgfx"), undefined, { timeout: 120_000 });
  await expect(page.locator("#loading")).toBeHidden();
  await expect(page.locator("#settings")).toHaveClass(/\bhidden\b/);
  await expect(page.locator("#awgfx")).toBeHidden();

  await page.locator("#realbar button.q").click();
  await expect(page.locator("#settings")).toBeVisible();
  await expect(page.locator("#awgfx summary")).toHaveText("Graphics diagnostics");
  expect(await page.locator("#awgfx").evaluate((el) => el.open)).toBe(false);

  const before = await page.evaluate(() => ({
    name: window.game.real.q.name,
    dpr: window.game.real.q.dpr,
    shadow: window.game.real.q.shadow,
    tex: window.game.renderer.capabilities.maxTextureSize,
  }));

  await page.locator("#awgfx summary").evaluate((el) => el.scrollIntoView({ block: "center" }));
  await page.locator("#awgfx summary").click();
  await expect(page.locator("#awgfxbody")).toContainText("WebGL2", { timeout: 20_000 });
  const text = await page.locator("#awgfxbody").innerText();
  expect(text).toContain("WebGL2");
  expect(text).toMatch(/feat yes[^\n]*instancing/);
  expect(text).toMatch(/feat NO[^\n]*compute/);
  expect(text).toMatch(/feat NO[^\n]*indirect/);
  expect(text).toContain("ASTC");
  expect(text).toContain("ETC2");
  expect(text).toContain("BC");
  expect(text).toContain("draws not exposed");
  expect(text).toContain(`profile ${quality}`);
  expect(text).toContain("phone profile on");
  expect(text).toMatch(/fps cap \d+/);
  expect(text).toMatch(/dyn \d+%/);
  expect(text).toMatch(/shaders (highp|mediump|lowp)/);
  expect(text).toContain(quality === "low" ? "mesh lod low" : "mesh lod high");
  expect(text).toMatch(/thermal|cpu pressure/);
  expect(text).toMatch(/css · buffer/);

  const after = await page.evaluate(() => ({
    name: window.game.real.q.name,
    dpr: window.game.real.q.dpr,
    shadow: window.game.real.q.shadow,
    tex: window.game.renderer.capabilities.maxTextureSize,
  }));
  expect(after).toEqual(before);

  await page.locator("#awgfxcopy").click();
  await expect(page.locator("#awgfxcopy")).toHaveText("Copied");
  const clip = await page.evaluate(() => navigator.clipboard.readText());
  expect(clip).toContain("WebGL2");
  expect(clip).toContain(`profile ${quality}`);

  // The FPS readout rewrites every frame, so the sheet never sits still for a hit test.
  await page.locator("#stclose").click({ force: true });
  await expect(page.locator("#settings")).toHaveClass(/\bhidden\b/);
  await expect(page.locator("#awgfx")).toBeHidden();
  expect(errors, errors.join("\n")).toEqual([]);
});
