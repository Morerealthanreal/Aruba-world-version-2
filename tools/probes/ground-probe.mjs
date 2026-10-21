import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";

// Diagnostic only. From the repo root, with playwright installed:
//   node tools/probes/ground-probe.mjs
// Serves game/ on 8796 and prints one JSON line of per-hero base deltas.
const root = fileURLToPath(new URL("../..", import.meta.url));
const port = 8796;
const server = spawn("python3", ["-m", "http.server", String(port), "--bind", "127.0.0.1", "--directory", "game"], {
  cwd: root,
  stdio: "ignore",
});
const browser = await chromium.launch({
  channel: "chrome",
  args: ["--no-sandbox", "--disable-dev-shm-usage", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.setDefaultTimeout(120000);
const spots = [
  { name: "paseo", x: -8021.62, z: -6014.94 },
  { name: "strip", x: -8295.39, z: -5327.6 },
  { name: "ritz", x: -8038.11, z: -6962.31 },
];
const SKIP = /body|head|hair|eye|brow|arm|leg|hand|foot|torso|skirt|shirt|npc|ped|casual|sam|face|teeth|palm_frond|foliage|tree|bush|car|wheel|moto/i;

try {
  await page.goto(`http://127.0.0.1:${port}/?q=high&addons=1`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.game?.ready && window.game.real?.heightAt);
  const summary = [];
  for (const spot of spots) {
    await page.evaluate(({ x, z }) => {
      const game = window.game;
      const y = game.real.heightAt(x, z) || 2;
      game.teleport("walk", x, z, 0);
      window.__freeCam = [x + 40, y + 28, z + 70, x, y + 6, z];
    }, spot);
    await page.waitForFunction(({ x, z }) => {
      const list = window.game?.real?.hero?.list || [];
      return list.some((n) => n._g && Math.hypot(n.x - x, n.z - z) < 80);
    }, spot, { timeout: 25000 }).catch(() => {});
    await page.waitForTimeout(1500);
    const row = await page.evaluate(({ name, x, z }) => {
      const game = window.game;
      const ground = (px, pz) => game.real.heightAt(px, pz);
      game.teleport("walk", x, z, 0);
      const y = ground(x, z) || 2;
      window.__freeCam = [x + 40, y + 28, z + 70, x, y + 6, z];
      const shown = (o) => { for (let p = o; p; p = p.parent) if (p.visible === false) return false; return true; };
      const apply = (m, px, py, pz) => {
        const e = m.elements;
        return {
          x: e[0] * px + e[4] * py + e[8] * pz + e[12],
          y: e[1] * px + e[5] * py + e[9] * pz + e[13],
          z: e[2] * px + e[6] * py + e[10] * pz + e[14],
        };
      };
      game.scene.updateMatrixWorld(true);
      const heroes = [];
      for (const n of game.real.hero?.list || []) {
        if (!n._g || Math.hypot(n.x - x, n.z - z) > 450) continue;
        const cells = new Map();
        let parts = 0;
        n._g.traverse((o) => {
          if (!o.isMesh || !o.geometry || !shown(o)) return;
          parts++;
          const pos = o.geometry.attributes?.position;
          if (!pos) return;
          const stride = Math.max(1, Math.floor(pos.count / 180));
          for (let i = 0; i < pos.count; i += stride) {
            const v = apply(o.matrixWorld, pos.getX(i), pos.getY(i), pos.getZ(i));
            const key = (Math.round(v.x / 12) * 12) + "," + (Math.round(v.z / 12) * 12);
            let c = cells.get(key);
            if (!c) cells.set(key, c = { min: Infinity, max: -Infinity, n: 0 });
            c.n++;
            if (v.y < c.min) c.min = v.y;
            if (v.y > c.max) c.max = v.y;
          }
        });
        const dys = [];
        for (const [key, c] of cells) {
          const span = c.max - c.min;
          if (span < 1.2 || span > 90 || c.n < 3) continue;
          const [sx, sz] = key.split(",").map(Number);
          dys.push(c.min - ground(sx, sz));
        }
        dys.sort((a, b) => a - b);
        const med = dys.length ? dys[Math.floor(dys.length / 2)] : null;
        const worst = dys.length ? dys[0] : null;
        const sunk = dys.filter((d) => d < -0.45).length;
        const high = dys.filter((d) => d > 1.2).length;
        heroes.push({
          id: n.k || n.id,
          parts,
          cells: dys.length,
          med: med == null ? null : Math.round(med * 10) / 10,
          worst: worst == null ? null : Math.round(worst * 10) / 10,
          sunk, high,
          hi: n._hi ? (n._hi.visible ? 1 : 0) : -1,
          lo: n._lo ? (n._lo.visible ? 1 : 0) : -1,
        });
      }
      const bad = heroes.filter((h) => h.sunk > 0 || h.high > 0 || h.hi < 0 || (h.hi === 1 && h.lo === 1));
      bad.sort((a, b) => (a.worst ?? 0) - (b.worst ?? 0));
      return {
        name,
        gy: Math.round(ground(x, z) * 10) / 10,
        n: heroes.length,
        badN: bad.length,
        both: heroes.filter((h) => h.hi === 1 && h.lo === 1).length,
        missingLod: heroes.filter((h) => h.hi < 0 || h.lo < 0).length,
        bad: bad.slice(0, 25),
      };
    }, spot);
    summary.push(row);
  }
  console.log(JSON.stringify(summary));
} finally {
  await browser.close();
  server.kill();
}
