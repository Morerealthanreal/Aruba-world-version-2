// Numeric checks for photo mode. No browser.
// Run: node --experimental-strip-types addons/photo/selftest.ts
import { PhotoRig, circleOfConfusion, FILTERS } from "../src/photo/rig.ts";

let failed = 0;
const check = (name: string, ok: boolean, info: string) => {
  console.log(`${ok ? "ok  " : "FAIL"} ${name}: ${info}`);
  if (!ok) failed++;
};

{
  const r = new PhotoRig();
  r.x = 0; r.y = 2; r.z = 0; r.yaw = 0; r.pitch = 0;
  r.move(1, 0, 0, 0, 0, 1);
  check("forward yaw 0 moves toward -Z", r.z < -5 && Math.abs(r.x) < 1e-6, `x=${r.x.toFixed(2)} z=${r.z.toFixed(2)}`);
}
{
  const r = new PhotoRig();
  r.move(0, 1, 0, 0, 0, 1);
  check("strafe right moves +X", r.x > 5, `x=${r.x.toFixed(2)}`);
}
{
  const r = new PhotoRig();
  r.move(1, 0, 0, 0, 0.4, 0); // pitch up, no time so no translation
  r.move(1, 0, 0, 0, 0, 1);
  check("pitch up gains height", r.y > 2, `y=${r.y.toFixed(2)}`);
}
{
  const r = new PhotoRig();
  r.setExposure(9);
  check("exposure clamps high", r.exposure === 2.5, `${r.exposure}`);
  r.setExposure(0);
  check("exposure clamps low", r.exposure === 0.25, `${r.exposure}`);
  r.setFocus(0.1);
  check("focus stays at least 1 m", r.focus === 1, `${r.focus}`);
}
{
  const r = new PhotoRig();
  const names = [];
  for (let i = 0; i < FILTERS.length + 1; i++) names.push(r.cycleFilter(1));
  check("filters cycle and wrap", names[0] === "vivid" && names[FILTERS.length] === "vivid", names.join(","));
}
{
  const focus = 12;
  const aperture = 0.4;
  const onPlane = circleOfConfusion(focus, focus, aperture);
  const far = circleOfConfusion(focus * 2, focus, aperture);
  const near = circleOfConfusion(focus * 0.5, focus, aperture);
  check("no blur on the focus plane", onPlane === 0, `${onPlane}`);
  check("defocus grows off the plane", far > near && near > onPlane, `far=${far.toFixed(3)} near=${near.toFixed(3)}`);
  check("zero aperture is sharp everywhere", circleOfConfusion(40, focus, 0) === 0, "");
}

console.log(failed ? `${failed} check(s) failed` : "all photo checks passed");
if (failed) process.exit(1);
