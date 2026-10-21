import { expect, test } from "@playwright/test";

test.describe("Minimap and Full-screen Map System", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      window.__noRender = true;
    });
  });

  test("minimap renders roads, beaches, and named places with player arrow and waypoint routing", async ({ page }) => {
    const errors = [];
    page.on("pageerror", (err) => errors.push(err.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    await page.goto("/?q=low", { waitUntil: "domcontentloaded" });
    await page.waitForFunction(() => window.game?.ready && window.__aw?.minimap && window.__aw?.nav, undefined, { timeout: 120_000 });

    // 1. Verify minimap canvas is active and mounted
    const canvas = page.locator("#minimap");
    await expect(canvas).toBeVisible();

    const minimapStats = await page.evaluate(() => {
      const mm = window.__aw.minimap;
      return {
        hasCanvas: !!document.getElementById("minimap"),
        size: mm?.stats?.size,
        labels: mm?.stats?.labels
      };
    });
    expect(minimapStats.hasCanvas).toBe(true);
    expect(minimapStats.size).toBeGreaterThanOrEqual(96);
    expect(minimapStats.labels).toBeLessThanOrEqual(3);

    // 2. Verify place data includes beaches, towns, and landmarks
    const placesInfo = await page.evaluate(() => {
      const nav = window.__aw.nav;
      const bm = nav.getBigMap();
      const places = bm ? bm.places() : [];
      const beaches = places.filter((p) => p.cat === "beach" || p.name.toLowerCase().includes("beach"));
      const towns = places.filter((p) => p.cat === "town");
      const attractions = places.filter((p) => p.cat === "attraction" || p.cat === "lighthouse");

      return {
        totalPlaces: places.length,
        beachesCount: beaches.length,
        townsCount: towns.length,
        attractionsCount: attractions.length,
        hasEagleBeach: !!places.find((p) => p.name === "Eagle Beach"),
        hasPalmBeach: !!places.find((p) => p.name === "Palm Beach"),
        hasBabyBeach: !!places.find((p) => p.name === "Baby Beach"),
        hasCaliforniaLighthouse: !!places.find((p) => p.name.includes("California Lighthouse")),
        hasOranjestad: !!places.find((p) => p.name.includes("Oranjestad"))
      };
    });

    expect(placesInfo.totalPlaces).toBeGreaterThan(2000);
    expect(placesInfo.beachesCount).toBeGreaterThanOrEqual(30);
    expect(placesInfo.hasEagleBeach).toBe(true);
    expect(placesInfo.hasPalmBeach).toBe(true);
    expect(placesInfo.hasBabyBeach).toBe(true);
    expect(placesInfo.hasCaliforniaLighthouse).toBe(true);
    expect(placesInfo.hasOranjestad).toBe(true);

    // 3. Test minimap click to set waypoint
    const minimapBox = await canvas.boundingBox();
    expect(minimapBox).not.toBeNull();

    // Click 25px offset from center of minimap
    await page.mouse.click(minimapBox.x + minimapBox.width / 2 + 25, minimapBox.y + minimapBox.height / 2 + 25);
    await page.waitForTimeout(300);

    const waypointState = await page.evaluate(() => {
      const nav = window.__aw.nav;
      return {
        hasDestination: !!nav.destination,
        destCoords: nav.destination ? { x: Math.round(nav.destination.x), z: Math.round(nav.destination.z) } : null,
        routeLength: nav.route.length,
        hudTurnVisible: document.getElementById("aw-nav-turn")?.style.display !== "none",
        hudTurnText: document.getElementById("aw-nav-turn")?.textContent || ""
      };
    });

    expect(waypointState.hasDestination).toBe(true);
    expect(waypointState.routeLength).toBeGreaterThan(1);
    expect(waypointState.hudTurnVisible).toBe(true);
    expect(waypointState.hudTurnText).toContain("m");

    // 4. Test clearing destination
    await page.evaluate(() => {
      window.__aw.nav.clearDestination();
    });

    const clearedState = await page.evaluate(() => {
      const nav = window.__aw.nav;
      return {
        hasDestination: !!nav.destination,
        routeLength: nav.route.length,
        hudTurnVisible: document.getElementById("aw-nav-turn")?.style.display !== "none"
      };
    });

    expect(clearedState.hasDestination).toBe(false);
    expect(clearedState.routeLength).toBe(0);
    expect(clearedState.hudTurnVisible).toBe(false);

    // 5. Test Full-screen Map open via openFullMap API
    await page.evaluate(() => {
      window.__aw.nav.openFullMap();
    });
    await page.waitForTimeout(200);

    const bigmapOpen = await page.evaluate(() => {
      const el = document.getElementById("bigmap");
      return el && !el.classList.contains("hidden");
    });
    expect(bigmapOpen).toBe(true);

    // 6. Test place search and selection on Full-screen Map
    const searchResult = await page.evaluate(() => {
      const bm = window.__aw.nav.getBigMap();
      const input = document.getElementById("bmsearch");
      if (input) {
        input.value = "Eagle Beach";
        input.dispatchEvent(new Event("input"));
      }
      const resultsEl = document.getElementById("bmres");
      const hits = Array.from(resultsEl?.querySelectorAll(".bmhit") || []).map((el) => el.textContent);
      return {
        hitsCount: hits.length,
        hitsText: hits.join(", ")
      };
    });

    expect(searchResult.hitsCount).toBeGreaterThan(0);
    expect(searchResult.hitsText).toContain("Eagle Beach");

    // Pick Eagle Beach
    const pickResult = await page.evaluate(async () => {
      const bm = window.__aw.nav.getBigMap();
      const eagleBeach = bm.places().find((p) => p.name === "Eagle Beach");
      bm.pick({ x: eagleBeach.x, z: eagleBeach.z, name: eagleBeach.name });
      await new Promise((res) => setTimeout(res, 200));

      const nav = window.__aw.nav;
      const bminfo = document.getElementById("bminfo")?.innerHTML || "";
      return {
        destName: nav.destination?.name,
        routePtsCount: nav.route.length,
        bminfo
      };
    });

    expect(pickResult.destName).toBe("Eagle Beach");
    expect(pickResult.routePtsCount).toBeGreaterThan(10);
    expect(pickResult.bminfo).toContain("Eagle Beach");
    expect(pickResult.bminfo).toContain("km");

    // 7. Test closing Full-screen Map with closeFullMap API / bmclose
    await page.evaluate(() => {
      window.__aw.nav.closeFullMap();
    });
    await page.waitForTimeout(200);

    const bigmapClosed = await page.evaluate(() => {
      const el = document.getElementById("bigmap");
      return el && el.classList.contains("hidden");
    });
    expect(bigmapClosed).toBe(true);

    // 8. Test toggle API
    await page.evaluate(() => {
      window.__aw.nav.toggleFullMap();
    });
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => !document.getElementById("bigmap").classList.contains("hidden"))).toBe(true);

    await page.evaluate(() => {
      window.__aw.nav.toggleFullMap();
    });
    await page.waitForTimeout(200);
    expect(await page.evaluate(() => document.getElementById("bigmap").classList.contains("hidden"))).toBe(true);

    expect(errors).toEqual([]);
  });
});
