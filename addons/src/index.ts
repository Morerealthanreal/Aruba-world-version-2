// Aruba World merge add-ons: B's (SuperGrok) day/night cycle, night lighting
// and an auto FPS guard, running on top of A's live build without editing its
// minified bundle. Loaded by one <script type="module"> line in game/index.html.
// Kill switch: ?addons=0 (pure A). Partial: ?daynight=0, ?fpsguard=0, ?fly=0 (A's flight model), ?turbo=0,
// ?hud=0 (A's phone HUD layout), ?minimap=0 (A's minimap).
import { whenGameReady, params } from "./env";
import { Clock } from "./clock";
import { DayNight } from "./daynight";
import { NightLights } from "./nightLights";
import { FpsGuard } from "./fpsGuard";
import { Preload } from "./preload";
import { MobilePerf } from "./mobilePerf";
import { BldMerge } from "./bldMerge";
import { OvMerge } from "./ovMerge";
import { TerrMerge } from "./terrMerge";
import { LampGlow } from "./lampGlow";
import { TrafficSystem } from "./trafficLife";
import { PedestrianCrowds } from "./pedestrians";
import { WorldAudio } from "./audio";
import { mountUI } from "./ui";
import { PerfFixes } from "./perfFixes";
import { Look } from "./look";
import { Flora } from "./flora";
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
import { Fly } from "./fly";
import { WindFarm } from "./windFarm";
import { CamCycle } from "./camCycle";
import { Sea } from "./sea";
import { mountHud } from "./hud";
import { MiniMap } from "./minimap";
import { uNight } from "./uniforms";
import { uTime } from "./uniforms";

// Set synchronously so the minified-bundle hooks can preserve stock handling when
// either the whole add-on suite or just the motorcycle pass is disabled.
const motoEnabled = params.get("addons") !== "0" && params.get("gvmoto") !== "0" && params.get("gv") !== "0";
(window as unknown as { __awMotoEnabled: boolean }).__awMotoEnabled = motoEnabled;

async function main() {
  if (params.get("addons") === "0") return;
  if (params.get("hud") !== "0") mountHud();
  const g = await whenGameReady();
  // perf fixes first: the FPS guard reads the (possibly capped) pixel ratio as its base
  const perf = params.get("perf") !== "0" ? new PerfFixes(g) : null;
  const look = params.get("look") !== "0" ? new Look(g) : null;
  const sea = params.get("sea") !== "0" ? new Sea(g) : null;
  const touch = matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  const flora = params.get("flora") !== "0" ? new Flora(g, perf ? perf.mobile : touch) : null;
  const jobs = params.get("jobs") !== "0" ? new JobPump(g, (perf ? perf.mobile : touch) ? 5 : 8) : null;
  const ctxg = new ContextGuard(g, perf ? perf.mobile : touch);
  const far = params.get("far") !== "0" ? new FarCity(g, (g.real as unknown as { q: { name: string } }).q.name !== "low") : null;
  const split = params.get("split") !== "0" ? new SplitJobs((perf ? perf.mobile : touch) ? 3 : 4) : null;
  const hip = params.get("hiperf") !== "0" ? new HiPerf(g) : null;
  const hil = params.get("hilook") === "1" ? new HiLook(g) : null;
  const useLife = params.get("life") !== "0";
  const peds = useLife && params.get("peds") !== "0" ? new PedestrianCrowds(g) : null;
  const kids = !peds && params.get("kids") !== "0" ? new Kids(g, perf ? perf.mobile : touch) : null;
  const graph = params.get("debug") === "1" ? new FrameGraph(g) : null;
  const clock = new Clock();
  const useDN = params.get("daynight") !== "0";
  const dn = useDN ? new DayNight(g, params.get("sun") !== "0") : null;
  const lights = useDN ? new NightLights(g) : null;
  const lamps = useDN ? new LampGlow(g) : null;
  const traffic = useLife && params.get("traffic") !== "0" ? new TrafficSystem(g) : null;
  const audio = params.get("audio") !== "0" ? new WorldAudio(g) : null;
  const emerg = params.get("emerg") !== "0" ? new Emergency(g) : null;
  const crash = params.get("crash") !== "0" ? new Crash(g, emerg) : null;
  const gv = motoEnabled ? new GvMoto(g) : null;
  const fly = params.get("fly") !== "0" ? new Fly(g) : null;
  const turbo = params.get("turbo") !== "0" ? new Turbo(g) : null;
  const wind = params.get("wind") !== "0" ? new WindFarm(g) : null;
  const camc = params.get("camcycle") !== "0" ? new CamCycle() : null;
  const minimap = params.get("minimap") !== "0" ? new MiniMap(g) : null;
  { // credits: street-level photo references used to match storefronts (CC BY-SA 4.0 requires attribution)
    const addCredit = () => { const ul = document.querySelector("#credits ul"); if (!ul) return false; if (!ul.querySelector(".aw-msb")) { const li2 = document.createElement("li"); li2.className = "aw-msb"; li2.innerHTML = 'Extra Noord building footprints: <a href="https://github.com/microsoft/GlobalMLBuildingFootprints" target="_blank" rel="noopener">Microsoft Global ML Building Footprints</a> (ODbL)'; ul.appendChild(li2); } if (!ul.querySelector(".aw-mly")) { const li = document.createElement("li"); li.className = "aw-mly"; li.innerHTML = 'Storefront/facade references: street-level photos from <a href="https://www.mapillary.com" target="_blank" rel="noopener">Mapillary</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>'; ul.appendChild(li); } return true; };
    if (!addCredit()) { let n = 0; const t = setInterval(() => { if (addCredit() || ++n > 30) clearInterval(t); }, 1000); }
  }
  const guard = new FpsGuard(g);
  const mperf = params.get("mperf") !== "0" ? new MobilePerf(g, perf ? perf.mobile : touch) : null;
  const ovm = params.get("ovmerge") !== "0" && g.real ? new OvMerge(g.real as never) : null;
  const tmerge = params.get("tmerge") !== "0" && g.real ? new TerrMerge(g.real as never) : null;
  const bmerge = params.get("bmerge") !== "0" ? new BldMerge(g) : null;
  const pre = params.get("preload") !== "0" ? new Preload(g) : null;
  const tickUI = mountUI(clock, guard);
  window.__aw = { clock, dn, lights, lamps, traffic, peds, audio, guard, perf, look, flora, jobs, far, ctxg, kids, split, hip, hil, emerg, crash, gv, fly, turbo, bmerge, mperf, ovm, tmerge, sea, minimap, version: "0.12.0" };

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
    if (peds) peds.update(Math.min(dt, 0.1), uTime.value);
    if (audio) audio.update();
    if (emerg) emerg.update(Math.min(dt, 0.1));
    if (crash) crash.update(Math.min(dt, 0.1));
    if (gv) gv.update(Math.min(dt, 0.1));
    if (fly) fly.update(Math.min(dt, 0.1));
    if (turbo) turbo.update(Math.min(dt, 0.1));
    if (wind) wind.update(Math.min(dt, 0.1));
    if (camc) camc.frame((g.S as unknown as { mode: string }).mode, Math.min(dt, 0.1));
    if (perf) perf.update(dt);
    if (look) look.update(uNight.value);
    if (jobs) jobs.frame();
    if (hip) hip.frame();
    if (far) far.update(dt);
    if (kids) kids.update(Math.min(dt, 0.1));
    if (graph) graph.frame(dt * 1000);
    guard.frame(dt);
    if (pre) pre.frame(dt);
    if (mperf) mperf.frame(dt);
    if (bmerge) bmerge.frame();
    tickUI();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  console.info("[aw-addons] day/night + night lights + fps guard active", g.real?.q?.name);
}
main().catch((e) => console.error("[aw-addons] failed", e));
