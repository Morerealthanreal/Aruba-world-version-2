// Numeric self-test for the boat's wave sampling. No browser.
// Run: node --experimental-strip-types boat/selftest.ts
import { Boat } from "../src/boat/Boat.ts";
import { oceanWave } from "../src/boat/waves.ts";

const DT = 1 / 60;
let failed = 0;
function check(name: string, ok: boolean, detail: string) {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}  ${detail}`);
  if (!ok) failed++;
}

{
  const stale = { getWaveHeight: () => 40 };
  const y = oceanWave(stale)(0, 0, 0);
  check("getWaveHeight is not sampled", Math.abs(y) < 0.2, `height ${y.toFixed(3)}`);
}

{
  const ocean = {
    waveHeight: (x: number, z: number, t: number) => 0.05 + Math.sin(x * 0.08 + t * 0.9) * 0.22,
    getWaveHeight: () => 40,
  };
  const at = oceanWave(ocean)(10, -4, 1.7);
  const expect = ocean.waveHeight(10, -4, 1.7);
  check("waveHeight(x, z, t) is the sample", Math.abs(at - expect) < 1e-9 && Math.abs(at) < 1, `${at.toFixed(4)} vs ${expect.toFixed(4)}`);
}

{
  const boat = new Boat({ quality: "low", seaLevel: 0 });
  boat.place(0, 0, 0, 0);
  const wave = (x: number, z: number, t: number) => 0.3 + 0.22 * Math.sin(t * 1.3 + x * 0.01);
  const deep = () => -8;
  const idle = { throttle: 0, steer: 0, interact: false };
  const ys: number[] = [];
  const ws: number[] = [];
  for (let t = 0; t < 8; t += DT) {
    boat.update(DT, idle, wave, deep);
    if (t > 3) {
      ys.push(boat.position.y);
      ws.push(wave(boat.position.x, boat.position.z, t));
    }
  }
  const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const yMean = mean(ys);
  const wMean = mean(ws);
  const ySpan = Math.max(...ys) - Math.min(...ys);
  const wSpan = Math.max(...ws) - Math.min(...ws);
  check("hull rides the wave, not the flat sea", Math.abs(yMean - (wMean - 0.12)) < 0.08, `hull ${yMean.toFixed(3)} m, wave ${wMean.toFixed(3)} m`);
  check("hull rises and falls with the wave", ySpan > 0.15 && ySpan < wSpan + 0.15, `hull span ${ySpan.toFixed(3)} m, wave span ${wSpan.toFixed(3)} m`);
}

if (failed) {
  console.log(`\n${failed} FAILED`);
  process.exit(1);
}
console.log("\nALL PASS");
