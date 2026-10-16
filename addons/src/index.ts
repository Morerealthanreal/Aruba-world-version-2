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
import { StaticFreeze } from "./staticFreeze";
import { BldMerge } from "./bldMerge";
import { BldBatch } from "./bldBatch";
import { OvMerge } from "./ovMerge";
import { TerrMerge } from "./terrMerge";
import { LampGlow } from "./lampGlow";
import { TrafficSystem } from "./trafficLife";
import { PedestrianCrowds } from "./pedestrians";
import { attachPlayerLocomotion } from "./locomotion";
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
import { TierraGolf } from "./golf";
import { SnMurals } from "./snMurals";
import { TierraResort } from "./tdsResort";
import { CamCycle } from "./camCycle";
import { Radio } from "./radio";
import { Sea } from "./sea";
import { NorthShore } from "./northShore";
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
  const nsh = params.get("nsh") !== "0" ? new NorthShore(g) : null;
  const touch = matchMedia("(pointer: coarse)").matches || "ontouchstart" in window;
  const flora = params.get("flora") !== "0" ? new Flora(g, perf ? perf.mobile : touch, params.get("ipool") !== "0") : null;
  const jobs = params.get("jobs") !== "0" ? new JobPump(g, (perf ? perf.mobile : touch) ? 5 : 8) : null;
  const ctxg = new ContextGuard(g, perf ? perf.mobile : touch);
  const far = params.get("far") !== "0" ? new FarCity(g, (g.real as unknown as { q: { name: string } }).q.name !== "low", params.get("farbatch") !== "0") : null;
  const split = params.get("split") !== "0" ? new SplitJobs((perf ? perf.mobile : touch) ? 3 : 4) : null;
  const hip = params.get("hiperf") !== "0" ? new HiPerf(g) : null;
  const hil = params.get("hilook") === "1" ? new HiLook(g) : null;
  const useLife = params.get("life") !== "0";
  const peds = useLife && params.get("peds") !== "0" ? new PedestrianCrowds(g) : null;
  if (params.get("loco") !== "0") attachPlayerLocomotion(g); // r287: player mocap walk/run (from PR #13, player only)
  const kids = !peds && params.get("kids") !== "0" ? new Kids(g, perf ? perf.mobile : touch) : null;
  const graph = params.get("debug") === "1" ? new FrameGraph(g) : null;
  const clock = new Clock();
  const useDN = params.get("daynight") !== "0";
  const dn = useDN ? new DayNight(g, params.get("sun") !== "0") : null;
  const lights = useDN ? new NightLights(g) : null;
  const lamps = useDN ? new LampGlow(g) : null;
  const traffic = useLife && params.get("traffic") !== "0" ? new TrafficSystem(g) : null;
  const audio = params.get("audio") !== "0" ? new WorldAudio(g) : null;
  const radio = params.get("radio") !== "0" && params.get("audio") !== "0" ? new Radio(g) : null;
  const emerg = params.get("emerg") !== "0" ? new Emergency(g) : null;
  const crash = params.get("crash") !== "0" ? new Crash(g, emerg) : null;
  const gv = motoEnabled ? new GvMoto(g) : null;
  const fly = params.get("fly") !== "0" ? new Fly(g) : null;
  const turbo = params.get("turbo") !== "0" ? new Turbo(g) : null;
  const wind = params.get("wind") !== "0" ? new WindFarm(g) : null;
  const golf = params.get("golf") !== "0" ? new TierraGolf(g) : null;
  const resort = golf && params.get("resort") !== "0" ? new TierraResort(g) : null;
  const sn = params.get("snmurals") !== "0" ? new SnMurals(g) : null;
  const camc = params.get("camcycle") !== "0" ? new CamCycle() : null;
  const minimap = params.get("minimap") !== "0" ? new MiniMap(g) : null;
  { // credits: street-level photo references used to match storefronts (CC BY-SA 4.0 requires attribution)
    const addCredit = () => { const ul = document.querySelector("#credits ul"); if (!ul) return false; if (!ul.querySelector(".aw-msb")) { const li2 = document.createElement("li"); li2.className = "aw-msb"; li2.innerHTML = 'Extra Noord building footprints: <a href="https://github.com/microsoft/GlobalMLBuildingFootprints" target="_blank" rel="noopener">Microsoft Global ML Building Footprints</a> (ODbL)'; ul.appendChild(li2); } if (!ul.querySelector(".aw-mly")) { const li = document.createElement("li"); li.className = "aw-mly"; li.innerHTML = 'Storefront/facade references: street-level photos from <a href="https://www.mapillary.com" target="_blank" rel="noopener">Mapillary</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>'; ul.appendChild(li); } if (!ul.querySelector(".aw-loco")) { const li3 = document.createElement("li"); li3.className = "aw-loco"; li3.innerHTML = 'On-foot walk and run: <a href="https://quaternius.com/packs/universalanimationlibrary.html" target="_blank" rel="noopener">Quaternius Universal Animation Library</a> (CC0)'; ul.appendChild(li3); } if (!ul.querySelector(".aw-tds")) { const li4 = document.createElement("li"); li4.className = "aw-tds"; li4.innerHTML = 'Tierra del Sol gate: <a href="https://commons.wikimedia.org/wiki/File:GCV_Aruba_way_to_arribe_to_the_villas_-_panoramio.jpg" target="_blank" rel="noopener">Kallistoaua</a>, <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener">CC BY 3.0</a>'; ul.appendChild(li4); } if (!ul.querySelector(".aw-nsh")) { const li5 = document.createElement("li"); li5.className = "aw-nsh"; li5.innerHTML = 'North-shore roads and surf: <a href="https://commons.wikimedia.org/wiki/File:Costa_noord_di_Aruba_(Bushiribana)_04.jpg" target="_blank" rel="noopener">Rarends297</a> (CC0), <a href="https://commons.wikimedia.org/wiki/File:Crashing_waves_at_natural_bridge_Aruba_(2906624374).jpg" target="_blank" rel="noopener">Serge Melki</a> (<a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener">CC BY 2.0</a>), <a href="https://commons.wikimedia.org/wiki/File:Wild_Rugged_rocky_Cliff_Shores_with_Crashing_Waves_Andicuri_Bay_Partially_Emerged_Holocene_Coral_Reef_Windward_Northeastern_Coast_Santa_Cruz_Aruba.jpg" target="_blank" rel="noopener">EgorovaSvetlana</a> (<a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>), <a href="https://commons.wikimedia.org/wiki/File:ARIKOK_NATIONAL_PARK_-_DAIMARI_BAY_-_panoramio.jpg" target="_blank" rel="noopener">James Martins</a> (<a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener">CC BY 3.0</a>)'; ul.appendChild(li5); } return true; };
    if (!addCredit()) { let n = 0; const t = setInterval(() => { if (addCredit() || ++n > 30) clearInterval(t); }, 1000); }
  }
  const guard = new FpsGuard(g);
  if (params.get("progcache") === "0") (window as unknown as { __awProg: number }).__awProg = 0;
  // texture pre-upload is on unless ?preup=0; it only queues textures of meshes the warm-up actually sees
  const mperf = params.get("mperf") !== "0" ? new MobilePerf(g, perf ? perf.mobile : touch, params.get("warmup") !== "full", params.get("preup") !== "0") : null;
  if (turbo && mperf) turbo.primeShaders(mperf);
  const ovm = params.get("ovmerge") !== "0" && g.real ? new OvMerge(g.real as never) : null;
  const tmerge = params.get("tmerge") !== "0" && g.real ? new TerrMerge(g.real as never) : null;
  const bbatch = params.get("bbatch") !== "0" && params.get("bmerge") !== "0" ? new BldBatch(g, (perf ? perf.mobile : touch) ? 2 : 3, +(params.get("bbshell") || Infinity)) : null;
  const bmerge = !bbatch && params.get("bmerge") !== "0" ? new BldMerge(g) : null;
  const pre = params.get("preload") !== "0" ? new Preload(g) : null;
  const mwf = params.get("mwfreeze") !== "0" ? new StaticFreeze(g) : null;
  const tickUI = mountUI(clock, guard);
  window.__aw = { clock, dn, lights, lamps, traffic, peds, audio, guard, perf, look, flora, jobs, far, ctxg, kids, split, hip, hil, emerg, crash, gv, fly, turbo, wind, golf, resort, sn, bmerge, mperf, ovm, tmerge, sea, nsh, minimap, bbatch, mwf, version: "0.12.0" };

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
    if (radio) radio.update();
    if (emerg) emerg.update(Math.min(dt, 0.1));
    if (crash) crash.update(Math.min(dt, 0.1));
    if (gv) gv.update(Math.min(dt, 0.1));
    if (fly) fly.update(Math.min(dt, 0.1));
    if (turbo) turbo.update(Math.min(dt, 0.1));
    if (wind) wind.update(Math.min(dt, 0.1));
    if (golf) golf.frame();
    if (nsh) nsh.frame();
    if (sn) sn.update();
    if (resort) resort.frame();
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
    if (bbatch) bbatch.frame();
    if (mwf) mwf.frame(Math.min(dt, 0.1));
    tickUI();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
  console.info("[aw-addons] day/night + night lights + fps guard active", g.real?.q?.name);
}
main().catch((e) => console.error("[aw-addons] failed", e));
