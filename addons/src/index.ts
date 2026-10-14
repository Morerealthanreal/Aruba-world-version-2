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
import { Sun } from "./sun";
import { JobPump } from "./jobPump";
import { FarCity } from "./farCity";
import { ContextGuard } from "./contextGuard";
import { FrameGraph } from "./frameGraph";
import { Kids } from "./kids";
import { SplitJobs } from "./splitJobs";
import { HiPerf } from "./hiPerf";
import { HiLook } from "./hiLook";
import { Emergency } from "./emergency";
import { Crash } from "./crash";
import { GvMoto } from "./gvMoto";
import { Turbo } from "./turbo";
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
  const jobs = params.get("jobs") !== "0" ? new JobPump(g, (perf ? perf.mobile : touch) ? 5 : 8) : null;
  const ctxg = new ContextGuard(g, perf ? perf.mobile : touch);
  const far = params.get("far") !== "0" ? new FarCity(g, (g.real as unknown as { q: { name: string } }).q.name !== "low") : null;
  const split = params.get("split") !== "0" ? new SplitJobs((perf ? perf.mobile : touch) ? 3 : 4) : null;
  const hip = params.get("hiperf") !== "0" ? new HiPerf(g) : null;
  const hil = params.get("hilook") === "1" ? new HiLook(g) : null;
  const kids = params.get("kids") !== "0" ? new Kids(g, perf ? perf.mobile : touch) : null;
  const graph = params.get("debug") === "1" ? new FrameGraph(g) : null;
  const clock = new Clock();
  const useDN = params.get("daynight") !== "0";
  const dn = useDN ? new DayNight(g) : null;
  const sun = useDN && params.get("sun") !== "0" ? new Sun(g) : null;
  const lights = useDN ? new NightLights(g) : null;
  const lamps = useDN ? new LampGlow(g) : null;
  const traffic = useDN ? new TrafficLights(g) : null;
  const emerg = params.get("emerg") !== "0" ? new Emergency(g) : null;
  const crash = params.get("crash") !== "0" ? new Crash(g, emerg) : null;
  const gv = params.get("gv") !== "0" ? new GvMoto(g) : null;
  const turbo = params.get("turbo") !== "0" ? new Turbo(g) : null;
  const guard = new FpsGuard(g);
  const tickUI = mountUI(clock, guard);
  window.__aw = { clock, dn, lights, lamps, traffic, guard, perf, look, flora, sun, jobs, far, ctxg, kids, split, hip, hil, emerg, crash, gv, turbo, version: "0.9.1" };

  let last = performance.now();
  const loop = (now: number) => {
    const dt = Math.max(0, Math.min(2, (now - last) / 1000)); // rAF timestamps can predate performance.now() at setup
    last = now;
    uTime.value += dt;
    clock.step(Math.min(dt, 0.1));
    if (dn) dn.apply(clock.t);
    if (sun && dn) sun.update(dn.sample.elev, dn.sample.day);
    if (lights) lights.update(dt);
    if (lamps) lamps.update(dt);
    if (traffic) traffic.update(dt);
    if (emerg) emerg.update(Math.min(dt, 0.1));
    if (crash) crash.update(Math.min(dt, 0.1));
    if (gv) gv.update(Math.min(dt, 0.1));
    if (turbo) turbo.update(Math.min(dt, 0.1));
    if (perf) perf.update(dt);
    if (look) look.update(uNight.value);
    if (jobs) jobs.frame();
    if (hip) hip.frame();
    if (far) far.update(dt);
    if (kids) kids.update(Math.min(dt, 0.1));
    if (graph) graph.frame(dt * 1000);
    guard.frame(dt);
    tickUI();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  console.info("[aw-addons] day/night + night lights + fps guard active", g.real?.q?.name);
}
main().catch((e) => console.error("[aw-addons] failed", e));
