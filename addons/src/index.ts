// Aruba World merge add-ons: B's (SuperGrok) day/night cycle, night lighting
// and an auto FPS guard, running on top of A's live build without editing its
// minified bundle. Loaded by one <script type="module"> line in game/index.html.
// Kill switch: ?addons=0 (pure A). Partial: ?daynight=0, ?fpsguard=0, ?fly=0 (A's flight model), ?turbo=0,
// ?hud=0 (A's phone HUD layout), ?minimap=0 (A's minimap).
import { whenGameReady, params, type AGame } from "./env";
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
import { AudioSystem } from "./audio/index";
import { Vector3 } from "three";
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
import { SnFairMurals } from "./snFairMurals";
import { loadMuralAtlas, muralAtlasKey } from "./muralAtlas";
import { WindFarm } from "./windFarm";
import { TierraGolf } from "./golf";
import { SnMurals } from "./snMurals";
import { SnLaterMurals } from "./snLaterMurals";
import { SnFamousMurals } from "./snFamousMurals";
import { SnSacRecentMurals } from "./snSacRecentMurals";
import { TierraResort } from "./tdsResort";
import { CamCycle } from "./camCycle";
import { Radio } from "./radio";
import { Sea } from "./sea";
import { mountHud } from "./hud";
import { MiniMap } from "./minimap";
import { NorthInland } from "./northInland";
import { Interiors } from "./interiors";
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
  // ?audio=sg swaps A's world audio for the SuperGrok synth engine (experimental).
  const audio = params.get("audio") !== "0" && params.get("audio") !== "sg" ? new WorldAudio(g) : null;
  const sgaudio = params.get("audio") === "sg" ? makeSgAudio(g) : null;
  const radio = params.get("radio") !== "0" && params.get("audio") !== "0" ? new Radio(g) : null;
  const emerg = params.get("emerg") !== "0" ? new Emergency(g) : null;
  const crash = params.get("crash") !== "0" ? new Crash(g, emerg) : null;
  const gv = motoEnabled ? new GvMoto(g) : null;
  const fly = params.get("fly") !== "0" ? new Fly(g) : null;
  const turbo = params.get("turbo") !== "0" ? new Turbo(g) : null;
  const wind = params.get("wind") !== "0" ? new WindFarm(g) : null;
  const golf = params.get("golf") !== "0" ? new TierraGolf(g) : null;
  const resort = golf && params.get("resort") !== "0" ? new TierraResort(g) : null;
  const muralPreload: string[] = [];
  if (params.get("snmurals") !== "0") muralPreload.push("textures/sn_mural_atlas.jpg");
  if (params.get("snfair") !== "0") muralPreload.push("textures/sn_fair_atlas.jpg");
  if (params.get("snlater") !== "0") muralPreload.push("textures/sn_later_atlas.jpg");
  if (params.get("snfamous") !== "0") muralPreload.push("textures/sn_famous_atlas.jpg");
  // SAC recent murals (#115) are placeholder art; off by default until rebuilt from real photos (?snsacrecent=1 to preview).
  if (params.get("snsacrecent") === "1") muralPreload.push("textures/sn_sac_recent_atlas.jpg");
  await Promise.all(muralPreload.map((p) => loadMuralAtlas(muralAtlasKey(p), g.renderer)));
  const sn = params.get("snmurals") !== "0" ? new SnMurals(g) : null;
  const snfair = params.get("snfair") !== "0" ? new SnFairMurals(g) : null;
  const snlater = params.get("snlater") !== "0" ? new SnLaterMurals(g) : null;
  const snfamous = params.get("snfamous") !== "0" ? new SnFamousMurals(g) : null;
  const snsacrecent = params.get("snsacrecent") === "1" ? new SnSacRecentMurals(g) : null;
  const camc = params.get("camcycle") !== "0" ? new CamCycle() : null;
  const minimap = params.get("minimap") !== "0" ? new MiniMap(g) : null;
  const nin = params.get("nin") !== "0" ? new NorthInland(g) : null;
  const interiors = params.get("interiors") !== "0" ? new Interiors(g) : null;
  { // credits: street-level photo references used to match storefronts (CC BY-SA 4.0 requires attribution)
    const addCredit = () => { const ul = document.querySelector("#credits ul"); if (!ul) return false; if (!ul.querySelector(".aw-msb")) { const li2 = document.createElement("li"); li2.className = "aw-msb"; li2.innerHTML = 'Extra Noord building footprints: <a href="https://github.com/microsoft/GlobalMLBuildingFootprints" target="_blank" rel="noopener">Microsoft Global ML Building Footprints</a> (ODbL)'; ul.appendChild(li2); } if (!ul.querySelector(".aw-mly")) { const li = document.createElement("li"); li.className = "aw-mly"; li.innerHTML = 'Storefront/facade references: street-level photos from <a href="https://www.mapillary.com" target="_blank" rel="noopener">Mapillary</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>'; ul.appendChild(li); } if (!ul.querySelector(".aw-loco")) { const li3 = document.createElement("li"); li3.className = "aw-loco"; li3.innerHTML = 'On-foot walk and run: <a href="https://quaternius.com/packs/universalanimationlibrary.html" target="_blank" rel="noopener">Quaternius Universal Animation Library</a> (CC0)'; ul.appendChild(li3); } if (!ul.querySelector(".aw-tds")) { const li4 = document.createElement("li"); li4.className = "aw-tds"; li4.innerHTML = 'Tierra del Sol gate: <a href="https://commons.wikimedia.org/wiki/File:GCV_Aruba_way_to_arribe_to_the_villas_-_panoramio.jpg" target="_blank" rel="noopener">Kallistoaua</a>, <a href="https://creativecommons.org/licenses/by/3.0/" target="_blank" rel="noopener">CC BY 3.0</a>'; ul.appendChild(li4); } if (!ul.querySelector(".aw-nin")) { const liN = document.createElement("li"); liN.className = "aw-nin"; liN.innerHTML = 'Casibari wall, kunuku fences, Hooiberg from the north: <a href="https://commons.wikimedia.org/wiki/File:Casibari_-_1.jpg" target="_blank" rel="noopener">DanielleJWiki</a>, <a href="https://commons.wikimedia.org/wiki/File:Traditional_Yatu_Cactus_Ritterocereus_Griseus_Fences_Santa_Cruz_Aruba.jpg" target="_blank" rel="noopener">EgorovaSvetlana</a>, <a href="https://commons.wikimedia.org/wiki/File:Cunucu_Traditional_Countryside_Small_Plantation_House_with_Traditional_Yatu_Cactus_Ritterocereus_Griseus_Fences_Santa_Cruz_Aruba.jpg" target="_blank" rel="noopener">EgorovaSvetlana</a>, <a href="https://commons.wikimedia.org/wiki/File:Hooiberg_Haystack_Mountain_View_from_Hudishibana_Hill_California_Lighthouse_Northwestern_Aruba.jpg" target="_blank" rel="noopener">EgorovaSvetlana</a>, <a href="https://creativecommons.org/licenses/by-sa/4.0/" target="_blank" rel="noopener">CC BY-SA 4.0</a>; <a href="https://commons.wikimedia.org/wiki/File:Aruba_kunuku.jpg" target="_blank" rel="noopener">We El</a> (public domain)'; ul.appendChild(liN); } return true; };
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
  window.__aw = { clock, dn, lights, lamps, traffic, peds, audio, sgaudio, guard, perf, look, flora, jobs, far, ctxg, kids, split, hip, hil, emerg, crash, gv, fly, turbo, wind, golf, resort, sn, snfair, snlater, snfamous, snsacrecent, bmerge, mperf, ovm, tmerge, sea, minimap, bbatch, mwf, nin, interiors, version: "0.19.0" };

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
    if (sgaudio) sgaudio.tick(Math.min(dt, 0.1));
    if (radio) radio.update();
    if (emerg) emerg.update(Math.min(dt, 0.1));
    if (crash) crash.update(Math.min(dt, 0.1));
    if (gv) gv.update(Math.min(dt, 0.1));
    if (fly) fly.update(Math.min(dt, 0.1));
    if (turbo) turbo.update(Math.min(dt, 0.1));
    if (wind) wind.update(Math.min(dt, 0.1));
    if (nin) nin.frame();
    if (interiors) interiors.update();
    if (golf) golf.frame();
    if (sn) sn.update();
    if (snfair) snfair.update();
    if (snlater) snlater.update();
    if (snfamous) snfamous.update();
    if (snsacrecent) snsacrecent.update();
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

// FIX 5: SuperGrok AudioSystem behind ?audio=sg. Zones use real Aruba world coordinates; zone and
// footstep buffers are synthesised here (no audio files ship with the game).
function makeSgAudio(g: AGame) {
  const sys = new AudioSystem(g.camera, { quality: "medium", zones: [
    { x: -9700, z: -3100, radius: 500, sound: "beach_eagle", volume: 0.45, loop: true },   // Eagle Beach
    { x: -10065, z: -2330, radius: 300, sound: "beach_manchebo", volume: 0.4, loop: true },   // Manchebo (own key: zones sharing a key overwrite each other)
    { x: -7159, z: 142, radius: 400, sound: "town", volume: 0.25, loop: true },      // Oranjestad centre
  ] });
  const ctx = sys.listener.context, sr = ctx.sampleRate;
  const noise = (sec: number, shape: (t: number) => number) => { const n = Math.floor(sec * sr), b = ctx.createBuffer(1, n, sr), d = b.getChannelData(0); let lp = 0; for (let i = 0; i < n; i++) { lp += (Math.random() * 2 - 1 - lp) * 0.08; d[i] = lp * shape(i / sr); } return b; };
  const surf = noise(6, (t) => 1.6 * (0.55 + 0.45 * Math.sin(t * Math.PI / 3) ** 2));
  sys.setZoneBuffer("beach_eagle", surf); sys.setZoneBuffer("beach_manchebo", surf);
  sys.setZoneBuffer("town", noise(4, () => 0.6));
  const step = noise(0.09, (t) => 2.5 * Math.exp(-t * 45));
  for (const s of ["sand", "asphalt", "concrete", "dirt", "grass", "wood"] as const) sys.setFootstepBuffer(s, step);
  const resume = () => { if (ctx.state === "suspended") ctx.resume(); };
  addEventListener("pointerdown", resume); addEventListener("keydown", resume);
  const pos = new Vector3(), last = new Vector3(); let dist = 0, first = true;
  const eng = { rpm: 0, load: 0, on: true };
  const stats = { mode: "", dist: 0 };
  return { sys, stats, tick(dt: number) {
    const S = g.S as unknown as { mode: string } & Record<string, { x: number; y: number; z: number; s?: number; thr?: number }>;
    const w = (g as unknown as { walker?: { position: Vector3 } }).walker;
    const walk = S.mode === "walk" && !!w;
    const v = S[S.mode];
    if (walk) pos.copy(w!.position); else if (v) pos.set(v.x, v.y, v.z);
    if (first) { last.copy(pos); first = false; }
    const d = Math.hypot(pos.x - last.x, pos.z - last.z); last.copy(pos);
    if (walk && d < 5) dist += d;
    let e: typeof eng | null = null;
    if (!walk && v && typeof v.s === "number") { eng.rpm = Math.min(1, 0.15 + Math.abs(v.s) / 45); eng.load = Math.max(0, Math.min(1, v.thr ?? 0.5)); e = eng; }
    const real = g.real as unknown as { heightAt: (x: number, z: number) => number } | null;
    const surf = real && real.heightAt(pos.x, pos.z) < 2.5 ? "sand" : "asphalt";
    sys.update(dt, e, pos, surf, walk && d > 0.001, dist * 0.6);
    stats.mode = S.mode; stats.dist = dist;
  } };
}
