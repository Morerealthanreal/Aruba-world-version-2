// Aruba World merge add-ons: B's (SuperGrok) day/night cycle, night lighting
// and an auto FPS guard, running on top of A's live build without editing its
// minified bundle. Loaded by one <script type="module"> line in game/index.html.
// Kill switch: ?addons=0 (pure A). Partial: ?daynight=0, ?fpsguard=0.
import { whenGameReady, params } from "./env";
import { Clock } from "./clock";
import { DayNight } from "./daynight";
import { NightLights } from "./nightLights";
import { FpsGuard } from "./fpsGuard";
import { LampGlow } from "./lampGlow";
import { TrafficLights } from "./traffic";
import { mountUI } from "./ui";
import { PerfFixes } from "./perfFixes";
import { Look } from "./look";
import { Flora } from "./flora";
import { uNight } from "./uniforms";
import { uTime } from "./uniforms";

async function main() {
  if (params.get("addons") === "0") return;
  const g = await whenGameReady();
  // perf fixes first: the FPS guard reads the (possibly capped) pixel ratio as its base
  const perf = params.get("perf") !== "0" ? new PerfFixes(g) : null;
  const look = params.get("look") !== "0" ? new Look(g) : null;
  const touch = matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  const flora = params.get("flora") !== "0" ? new Flora(g, perf ? perf.mobile : touch) : null;
  const clock = new Clock();
  const useDN = params.get("daynight") !== "0";
  const dn = useDN ? new DayNight(g) : null;
  const lights = useDN ? new NightLights(g) : null;
  const lamps = useDN ? new LampGlow(g) : null;
  const traffic = useDN ? new TrafficLights(g) : null;
  const guard = new FpsGuard(g);
  const tickUI = mountUI(clock, guard);
  window.__aw = { clock, dn, lights, lamps, traffic, guard, perf, look, flora, version: "0.4.0" };

  let last = performance.now();
  const loop = (now: number) => {
    const dt = Math.max(0, Math.min(2, (now - last) / 1000)); // rAF timestamps can predate performance.now() at setup
    last = now;
    uTime.value += dt;
    clock.step(Math.min(dt, 0.1));
    if (dn) dn.apply(clock.t);
    if (lights) lights.update(dt);
    if (lamps) lamps.update(dt);
    if (traffic) traffic.update(dt);
    if (perf) perf.update(dt);
    if (look) look.update(uNight.value);
    guard.frame(dt);
    tickUI();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  console.info("[aw-addons] day/night + night lights + fps guard active", g.real?.q?.name);
}
main().catch((e) => console.error("[aw-addons] failed", e));
