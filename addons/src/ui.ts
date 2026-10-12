// Minimal UI that lives inside A's existing HUD (no new layout):
//  - a clock chip in A's top bar (#realbar), tap = next preset time
//  - a "Time of day" + "Auto FPS" block inside A's Settings sheet (#settings)
import type { Clock } from "./clock";
import type { FpsGuard } from "./fpsGuard";
import { clockText } from "./day";

const PRESETS: Array<[string, number]> = [["Sunrise", 6.75], ["Noon", 12.5], ["Sunset", 18.25], ["Night", 21.5]];

export function mountUI(clock: Clock, guard: FpsGuard) {
  const css = document.createElement("style");
  css.textContent = `
  /* A's live build ships no CSS for its Settings sheet (it renders unstyled behind the canvas); style it like #credits */
  #settings{z-index:40;color:#fff;position:fixed;left:50%;top:calc(100px + env(safe-area-inset-top));transform:translate(-50%);
    width:min(92vw,360px);max-height:calc(100vh - 130px);overflow:auto;padding:14px 16px;border-radius:16px;background:#000000c4;
    font:14px/1.45 system-ui,sans-serif;box-shadow:0 8px 30px #0006}
  #settings.hidden{display:none}
  #settings h3{margin:0 0 8px}
  #settings .lbl{opacity:.75;font-size:12px;margin:8px 0 4px;text-transform:uppercase;letter-spacing:.04em}
  #settings .tabs{display:flex;gap:6px}
  #settings button{color:#fff;background:#ffffff1f;border:2px solid #ffffff59;border-radius:12px;min-height:34px;padding:0 10px;font-weight:700;font-size:13px}
  #settings .tabs button{flex:1}
  #settings .tabs button.on{background:#ffd27a;color:#222;border-color:#ffd27a}
  #settings .hint{opacity:.7;font-size:12px;margin:6px 0}
  #settings #streset,#settings #stclose{margin:10px 6px 0 0}
  #awclock{font-variant-numeric:tabular-nums}
  #awtime{margin-top:10px}
  #awtime .tabs button.on{outline:2px solid #ffd27a}
  #awtime .row{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0}
  #awtime .row button{flex:1 1 auto}
  #awfps{font-size:12px;opacity:.8;margin-top:4px}`;
  document.head.appendChild(css);

  let chip: HTMLButtonElement | null = null;
  let tries = 0;
  const attach = () => {
    const bar = document.getElementById("realbar");
    const settings = document.getElementById("settings");
    if (!bar || !settings) { if (tries++ < 40) setTimeout(attach, 250); return; }
    chip = document.createElement("button");
    chip.id = "awclock";
    chip.title = "Time of day (tap: next preset)";
    chip.addEventListener("click", () => {
      const h = clock.t * 24;
      const next = PRESETS.find(([, ph]) => ph > h + 0.05) ?? PRESETS[0];
      clock.setHour(next[1]);
    });
    bar.insertBefore(chip, bar.children[1] ?? null);

    const box = document.createElement("div");
    box.id = "awtime";
    box.innerHTML = `<div class="lbl">Time of day</div>
      <div class="row">${PRESETS.map(([n, h]) => `<button data-h="${h}">${n}</button>`).join("")}</div>
      <div class="row"><button id="awfreeze"></button></div>
      <div class="lbl">Auto FPS guard</div>
      <div class="row"><button id="awguard"></button></div><div id="awfps"></div>`;
    const anchor = document.getElementById("streset");
    settings.insertBefore(box, anchor);
    box.querySelectorAll<HTMLButtonElement>("[data-h]").forEach((b) => b.addEventListener("click", () => clock.setHour(+b.dataset.h!)));
    const fr = box.querySelector<HTMLButtonElement>("#awfreeze")!;
    const gb = box.querySelector<HTMLButtonElement>("#awguard")!;
    fr.addEventListener("click", () => clock.setFrozen(!clock.frozen));
    gb.addEventListener("click", () => guard.setEnabled(!guard.enabled));
    const sync = () => {
      fr.textContent = clock.frozen ? "▶ Resume clock" : "⏸ Freeze clock";
      gb.textContent = guard.enabled ? "On (tap to turn off)" : "Off (tap to turn on)";
    };
    clock.onChange(sync);
    guard.onChange(sync);
    sync();
  };
  attach();

  let last = "";
  return () => {
    if (!chip) return;
    const txt = (clock.t > 0.27 && clock.t < 0.775 ? "☀ " : "🌙 ") + clockText(clock.t);
    if (txt !== last) { chip.textContent = txt; last = txt; }
    const f = document.getElementById("awfps");
    if (f) f.textContent = guard.describe();
  };
}
