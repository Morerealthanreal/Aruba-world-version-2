import { expect, test } from "@playwright/test";

// Phone HUD layout: at 360-412 px wide, in both orientations, with and without
// notch / gesture-bar safe areas, no visible HUD element may overlap another or
// leave the safe area, every touch control must be at least 44 CSS px, and the
// minimap must stay large, sharp and lightly labelled.

const PORTRAIT = [
  [360, 640],
  [360, 780],
  [384, 832], // Galaxy S24+ at its default resolution
  [412, 915],
];
const LANDSCAPE = PORTRAIT.map(([w, h]) => [h, w]);

const NO_INSETS = { top: 0, right: 0, bottom: 0, left: 0 };
const INSETS = {
  portrait: [NO_INSETS, { top: 32, right: 0, bottom: 24, left: 0 }],
  landscape: [
    NO_INSETS,
    { top: 0, right: 0, bottom: 21, left: 44 },
    { top: 0, right: 44, bottom: 21, left: 0 },
  ],
};

const MODES = ["walk", "car", "moto", "plane"];
const MIN_TAP = 44;
const MIN_MINIMAP = 96;

test.use({ hasTouch: true, isMobile: true, viewport: { width: 360, height: 640 } });

function layoutCases() {
  const cases = [];
  for (const [width, height] of PORTRAIT)
    for (const insets of INSETS.portrait) cases.push({ width, height, insets });
  for (const [width, height] of LANDSCAPE)
    for (const insets of INSETS.landscape) cases.push({ width, height, insets });
  return cases;
}

function describeCase({ width, height, insets }) {
  const notch = Object.entries(insets)
    .filter(([, v]) => v)
    .map(([k, v]) => `${k} ${v}`)
    .join(", ");
  return `${width}x${height}${notch ? ` (safe area ${notch})` : ""}`;
}

/** Runs in the page: measures every visible HUD element and returns rule violations. */
function auditHud({ insets, minTap, minMinimap }) {
  const ITEMS = [
    ["#hud", false],
    ["#modes button", true],
    ["#realbar button", true],
    ["#osmtoggle", true],
    ["#minimapwrap", true],
    ["#awmutebtn", true],
    [".aw-cam", true],
    ["#actions .grp.on button", true],
    ["#steerbtns button", true],
    ["#joybase", false],
    ["#attrib", false],
    ["#toast.on", false],
  ];
  const shown = (el) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const cs = getComputedStyle(e);
      if (cs.display === "none" || cs.visibility === "hidden") return false;
    }
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const name = (el, sel) => {
    const tag = el.dataset.act || el.dataset.mode || el.title || el.textContent.trim().slice(0, 12);
    return tag ? `${sel} "${tag}"` : sel;
  };
  const items = [];
  for (const [sel, tap] of ITEMS)
    for (const el of document.querySelectorAll(sel))
      if (shown(el)) items.push({ name: name(el, sel), tap, r: el.getBoundingClientRect() });

  const W = innerWidth, H = innerHeight, eps = 0.5;
  const problems = [];
  for (const { name: n, tap, r } of items) {
    if (r.left < insets.left - eps || r.top < insets.top - eps || r.right > W - insets.right + eps || r.bottom > H - insets.bottom + eps)
      problems.push(`${n} leaves the safe area: ${Math.round(r.left)},${Math.round(r.top)} -> ${Math.round(r.right)},${Math.round(r.bottom)}`);
    if (tap && (r.width < minTap - eps || r.height < minTap - eps))
      problems.push(`${n} is too small to tap: ${Math.round(r.width)}x${Math.round(r.height)}`);
  }
  for (let i = 0; i < items.length; i++)
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i].r, b = items[j].r;
      const ox = Math.min(a.right, b.right) - Math.max(a.left, b.left);
      const oy = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
      if (ox > eps && oy > eps) problems.push(`${items[i].name} overlaps ${items[j].name} by ${Math.round(ox)}x${Math.round(oy)} px`);
    }

  const wrap = document.getElementById("minimapwrap").getBoundingClientRect();
  const canvas = document.getElementById("minimap");
  if (wrap.width < minMinimap) problems.push(`minimap is only ${Math.round(wrap.width)} px wide`);
  const shownPx = canvas.getBoundingClientRect().width;
  if (canvas.width < Math.min(300, Math.round(shownPx * devicePixelRatio)) - 1)
    problems.push(`minimap backing store ${canvas.width} px is blurrier than its ${Math.round(shownPx)} CSS px box`);
  const mm = window.__aw.minimap;
  if (!mm) problems.push("GV minimap is not active");
  else if (mm.stats.labels > 3) problems.push(`minimap shows ${mm.stats.labels} labels`);
  return { problems, count: items.length };
}

test("phone HUD has no overlaps at narrow sizes", async ({ page, context }) => {
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.stack || e.message));

  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.game?.ready && window.__aw, undefined, { timeout: 120_000 });
  await expect(page.locator("#loading")).toBeHidden();
  await expect(page.locator("body")).toHaveClass(/\btouch\b/);
  // a long toast (as on plane spawn) must also fit between the HUD zones
  await page.evaluate(() => {
    const g = window.game, t = g.fromLL(12.5186, -70.0358), r = g.nearestRoad(t.x, t.z);
    g.teleport("car", r.x, r.z, r.h);
    const toast = document.getElementById("toast");
    toast.textContent = "Runway 29, Queen Beatrix · hold THR+ to take off · DIVE brakes";
    toast.classList.add("on");
    window.__awHudTest = setInterval(() => toast.classList.add("on"), 200);
  });

  const cdp = await context.newCDPSession(page);
  const failures = [];
  for (const c of layoutCases()) {
    await cdp.send("Emulation.setSafeAreaInsetsOverride", { insets: c.insets });
    await page.setViewportSize({ width: c.width, height: c.height });
    for (const mode of MODES) {
      await page.evaluate((m) => window.game.setMode(m), mode);
      // the add-on loop toggles the camera button and redraws the minimap on the next frames
      await page.evaluate(() => new Promise((res) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(res, 120)))));
      const { problems, count } = await page.evaluate(auditHud, { insets: c.insets, minTap: MIN_TAP, minMinimap: MIN_MINIMAP });
      expect(count, `no HUD elements found at ${describeCase(c)} ${mode}`).toBeGreaterThan(8);
      for (const p of problems) failures.push(`${describeCase(c)} ${mode}: ${p}`);
    }
  }
  await cdp.send("Emulation.setSafeAreaInsetsOverride", { insets: NO_INSETS });
  expect(failures, failures.join("\n")).toEqual([]);
  expect(errors, errors.join("\n")).toEqual([]);
});
