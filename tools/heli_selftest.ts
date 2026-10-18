// Numeric checks for the SuperGrok helicopter (TASK 11). No browser, no WebGL.
// Run: NODE_PATH=addons/node_modules npx --prefix addons esbuild tools/heli_selftest.ts --bundle --platform=node --format=esm --log-level=warning | node --input-type=module
import { Group, Vector3 } from "three";
import { Helicopter, REST_HEIGHT } from "../addons/src/heli";
import type { HeliInput } from "../addons/src/heli";

let failed = 0;
const check = (name: string, ok: boolean, info: string) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${info}`);
  if (!ok) failed++;
};
const flat = () => 2; // flat ground at y = 2
const inp = (o: Partial<HeliInput> = {}): HeliInput => ({ collective: 0, cyclicPitch: 0, cyclicRoll: 0, yaw: 0, engine: true, ...o });
const make = (quality: "low" | "medium" | "high" = "low") => {
  const scene = new Group();
  const h = new Helicopter({ quality, position: new Vector3(0, 2 + REST_HEIGHT, 0), fxParent: scene });
  scene.add(h.group);
  h.enter();
  return { h, scene };
};
const run = (h: Helicopter, seconds: number, i: HeliInput) => { for (let t = 0; t < seconds; t += 1 / 60) h.update(1 / 60, i, flat); };

{ // parked: stays on its skids
  const { h } = make();
  run(h, 3, inp());
  check("parked stays down", Math.abs(h.position.y - (2 + REST_HEIGHT)) < 1e-6 && h.isOnGround, `y=${h.position.y.toFixed(3)}`);
}
{ // collective 0.75 lifts off
  const { h } = make();
  run(h, 4, inp({ collective: 0.75 }));
  const agl = h.position.y - 2 - REST_HEIGHT;
  check("collective 0.75 lifts off", agl > 1 && !h.isOnGround, `gained ${agl.toFixed(2)} m in 4 s, vy=${h.verticalSpeed.toFixed(2)}`);
}
{ // full collective climbs well above ground effect
  const { h } = make();
  run(h, 8, inp({ collective: 1 }));
  const agl = h.position.y - 2;
  check("collective 1.0 climbs", agl > 25, `AGL ${agl.toFixed(1)} m after 8 s`);
}
{ // stick forward flies toward +Z (nose), nose dips; right roll goes -X (pilot's right); E yaw turns right
  const { h } = make();
  run(h, 3, inp({ collective: 1 }));
  const p0 = h.position.clone();
  run(h, 3, inp({ collective: 0.8, cyclicPitch: -1 }));
  check("W flies forward (+Z)", h.position.z - p0.z > 3, `dz=${(h.position.z - p0.z).toFixed(1)} m, pitch=${h.group.rotation.x.toFixed(2)}`);
  check("W dips the nose", h.group.rotation.x > 0.1, `rotation.x=${h.group.rotation.x.toFixed(2)}`);
  const p1 = h.position.clone();
  run(h, 3, inp({ collective: 0.8, cyclicRoll: 1 }));
  check("D slides right (-X)", h.position.x - p1.x < -3, `dx=${(h.position.x - p1.x).toFixed(1)} m, bank=${h.group.rotation.z.toFixed(2)}`);
  const y0 = h.group.rotation.y;
  run(h, 2, inp({ collective: 0.8, yaw: 1 }));
  check("E yaws right (heading decreases)", h.group.rotation.y < y0 - 0.2, `dYaw=${(h.group.rotation.y - y0).toFixed(2)} rad`);
}
{ // engine cut: comes down and lands softly, settles on its skids
  const { h } = make();
  run(h, 5, inp({ collective: 1 }));
  let minVy = 0;
  for (let t = 0; t < 30 && !h.isOnGround; t += 1 / 60) { h.update(1 / 60, inp({ collective: 0.6, engine: false }), flat); minVy = Math.min(minVy, h.verticalSpeed); }
  run(h, 1, inp({ engine: false }));
  check("autorotation lands", h.isOnGround && Math.abs(h.position.y - 2 - REST_HEIGHT) < 1e-6, `touchdown, worst sink ${minVy.toFixed(1)} m/s`);
}
{ // exit drops the controls: an empty heli does not keep flying
  const { h } = make();
  run(h, 5, inp({ collective: 1 }));
  h.exit();
  run(h, 20, inp({ collective: 1 }));
  check("empty heli settles", h.isOnGround, `y=${h.position.y.toFixed(2)}`);
}
{ // rotor wash lives in world space, capped by quality
  const { h, scene } = make("low");
  run(h, 1, inp({ collective: 0.6 }));
  const pts = scene.children.find((c) => (c as { isPoints?: boolean }).isPoints);
  const range = (pts as unknown as { geometry: { drawRange: { count: number } } } | undefined)?.geometry.drawRange.count ?? -1;
  check("rotor wash in world space, Low cap 8", !!pts && range <= 8, `parent=${pts ? "scene" : "missing"}, drawRange=${range}`);
}
console.log(failed ? `${failed} check(s) failed` : "all heli checks passed");
if (failed) process.exit(1);
