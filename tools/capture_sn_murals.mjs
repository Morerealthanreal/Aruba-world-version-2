// Street-level shots of the San Nicolas murals. Not part of the game.
import { chromium } from "@playwright/test";
import fs from "node:fs";

const only = new Set(process.argv.slice(2));
const murals = JSON.parse(fs.readFileSync("game/data/sn_murals.json", "utf8")).murals
  .filter((m) => only.size === 0 || only.has(m.id));
const outDir = "/tmp/sn-street";
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch({
  args: [
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
    "--disable-gpu-sandbox",
  ],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
page.setDefaultTimeout(180000);
await page.goto("http://127.0.0.1:8777/?q=high&t=11&freeze=1");
await page.waitForFunction(() => window.game && window.game.ready, null, { timeout: 180000 });
await page.waitForFunction(() => window.__aw && window.__aw.sn && window.__aw.sn.mesh, null, { timeout: 60000 });

const info = await page.evaluate(() => {
  const c = window.game.camera;
  return {
    parent: c.parent && (c.parent.type || c.parent.name || "yes"),
    fov: c.fov,
    sn: !!window.__aw.sn.mesh,
  };
});
console.log("camera", JSON.stringify(info));

async function go(x, z, h) {
  await page.evaluate(({ x, z, h }) => window.game.teleport("car", x, z, h), { x, z, h });
}

// Warm the district once, then visit each wall so the kit streams in.
await go(6510, 9360, 0);
await page.waitForTimeout(6000);

for (const m of murals) {
  const [ox, oz] = m.normal;
  const [cx, cz] = m.center;
  const hdg = Math.atan2(ox, oz);
  // Car sits behind the camera so it is not in the frame.
  await go(cx + ox * 18, cz + oz * 18, hdg);
  await page.waitForFunction(
    ({ x, z }) => {
      const y = window.game.real && window.game.real.heightAt(x, z);
      return typeof y === "number" && window.__aw.sn.mesh && window.__aw.sn.mesh.visible;
    },
    { x: cx, z: cz },
    { timeout: 90000 },
  );
  await page.waitForTimeout(2200);

  const shifts = m.id === "mujer_azul" ? [0]
    : m.id === "boss" || m.id === "nothing_to_declare" ? [-4, -2, 0, 2, 4]
    : [0];
  for (const shift of shifts) {
    const dx = m.p1[0] - m.p0[0];
    const dz = m.p1[1] - m.p0[1];
    const len = Math.hypot(dx, dz) || 1;
    const shot = await page.evaluate(({ m, shift, dx, dz, len }) => {
      const g = window.game;
      const [ox, oz] = m.normal;
      const [cx, cz] = m.center;
      const tx = dx / len;
      const tz = dz / len;
      const dist = m.id === "mujer_azul" ? 5.2 : 10;
      const camX = cx + ox * dist + tx * shift;
      const camZ = cz + oz * dist + tz * shift;
      const lookShift = m.id === "mujer_azul" ? 0 : shift;
      const gy = g.real.heightAt(camX, camZ);
      const wy = g.real.heightAt(cx, cz);
      if (typeof gy !== "number" || typeof wy !== "number") return { err: "no height" };
      const bottom = wy + Math.max(0.06, (m.bld_h - m.height) * 0.5);
      const lookY = bottom + m.height * 0.46;
      const eye = gy + 1.6;
      const cam = g.camera;
      const target = { x: cx + tx * lookShift, y: lookY, z: cz + tz * lookShift };
      if (cam.parent && cam.parent !== g.scene) {
        cam.parent.updateMatrixWorld(true);
        const local = cam.position.clone().set(camX, eye, camZ);
        cam.parent.worldToLocal(local);
        cam.position.copy(local);
      } else {
        cam.position.set(camX, eye, camZ);
      }
      cam.lookAt(target.x, target.y, target.z);
      cam.updateMatrixWorld(true);
      if (window.__awPost && window.__awPost.render) window.__awPost.render();
      else g.renderer.render(g.scene, cam);
      const url = g.renderer.domElement.toDataURL("image/jpeg", 0.82);
      // Centre patch, to see whether a flat coloured panel is sitting in the way.
      const gl = g.renderer.getContext();
      const w = gl.drawingBufferWidth;
      const h = gl.drawingBufferHeight;
      const pix = new Uint8Array(4 * 40 * 40);
      gl.readPixels(((w / 2) | 0) - 20, ((h / 2) | 0) - 20, 40, 40, gl.RGBA, gl.UNSIGNED_BYTE, pix);
      let r = 0, gc = 0, b = 0, n = 0;
      for (let i = 0; i < pix.length; i += 16) {
        r += pix[i]; gc += pix[i + 1]; b += pix[i + 2]; n++;
      }
      return {
        url,
        eye, lookY, camX, camZ,
        rgb: [Math.round(r / n), Math.round(gc / n), Math.round(b / n)],
      };
    }, { m, shift, dx, dz, len });
    if (shot.err) {
      console.log(m.id, shift, shot.err);
      continue;
    }
    const name = shift === 0 ? m.id : `${m.id}_${shift}`;
    const buf = Buffer.from(shot.url.split(",")[1], "base64");
    fs.writeFileSync(`${outDir}/${name}.jpg`, buf);
    console.log(m.id, "shift", shift, "rgb", shot.rgb.join(","), "eye", shot.eye.toFixed(1), "bytes", buf.length);
  }
}

await browser.close();
console.log("done");
