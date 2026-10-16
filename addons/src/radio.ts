// r278 Car radio (r284: 5 new songs, all modes, key aw_radio2) (Gangstar Vegas style): while in the car or on the moto a small widget shows the
// station; swipe it (touch drag), tap its arrows, or press , / . to cycle Off, Track 1, Track 2, Track 3.
// Loops at moderate volume under the engine, hides on foot/plane, choice saved in localStorage 'aw_radio'.
// Respects the world-audio mute ('aw_muted'). Files: game/audio/intro/intro{1,2,3}.mp3 (unchanged). Kill: ?radio=0
import type { AGame } from "./env";
const ST = ["off", "1", "2", "3", "4", "5"] as const;
const NAME: Record<string, string> = { off: "RADIO OFF", "1": "Track 1", "2": "Track 2", "3": "Track 3", "4": "Track 4", "5": "Track 5" };
const SRC = (k: string) => `./audio/music/track${k}.mp3`;
const VOL = 0.32;
export class Radio {
  private el: HTMLDivElement; private nm: HTMLDivElement;
  private a: HTMLAudioElement | null = null; private st: string = "1"; private shown = false; private want = false;
  constructor(private g: AGame) {
    try { localStorage.removeItem("aw_radio"); const v = localStorage.getItem("aw_radio2"); if (v && (ST as readonly string[]).includes(v)) this.st = v; } catch { /* */ }
    const css = document.createElement("style");
    css.textContent = `#awRadio{position:fixed;left:50%;top:calc(env(safe-area-inset-top) + 96px);transform:translate(-50%);z-index:30;display:none;align-items:center;gap:6px;
      background:#0b1220cc;border:2px solid #ffffff40;border-radius:14px;padding:4px 6px;color:#fff;font:700 13px system-ui,sans-serif;user-select:none;touch-action:none;box-shadow:0 4px 14px #0006}
      #awRadio.on{display:flex}body.touch #awRadio{top:auto;bottom:calc(env(safe-area-inset-bottom) + 172px)}body.touch #awRadio[data-mode=plane]{bottom:auto;top:calc(env(safe-area-inset-top) + var(--aw-radio-top,132px));left:12px;transform:none}#awRadio button{background:#ffffff1a;border:0;color:#fff;border-radius:9px;width:30px;height:30px;font-size:15px;font-weight:900}
      #awRadio .nm{min-width:110px;text-align:center;line-height:1.1}#awRadio .nm small{display:block;font-size:9px;letter-spacing:.18em;opacity:.65}
      #awRadio .nm b{display:block;font-size:14px;color:#ffd23f}#awRadio.off .nm b{color:#aab}`;
    document.head.appendChild(css);
    this.el = document.createElement("div"); this.el.id = "awRadio";
    const l = document.createElement("button"); l.textContent = "◀"; l.setAttribute("aria-label", "Previous station");
    const r = document.createElement("button"); r.textContent = "▶"; r.setAttribute("aria-label", "Next station");
    this.nm = document.createElement("div"); this.nm.className = "nm";
    this.el.append(l, this.nm, r); document.body.appendChild(this.el);
    const stop = (e: Event) => e.stopPropagation();
    for (const ev of ["pointerdown", "touchstart", "mousedown"]) this.el.addEventListener(ev, stop);
    l.addEventListener("click", (e) => { e.stopPropagation(); this.step(-1); });
    r.addEventListener("click", (e) => { e.stopPropagation(); this.step(1); });
    let x0 = -1; this.el.addEventListener("pointerdown", (e) => { if (e.target === this.el || this.nm.contains(e.target as Node)) { x0 = e.clientX; this.el.setPointerCapture(e.pointerId); } });
    this.el.addEventListener("pointerup", (e) => { if (x0 < 0) return; const dx = e.clientX - x0; x0 = -1; if (Math.abs(dx) > 25) this.step(dx < 0 ? 1 : -1); });
    this.el.addEventListener("pointercancel", () => { x0 = -1; });
    addEventListener("keydown", (e) => { if (!this.shown || (e.target as HTMLElement)?.tagName === "INPUT") return; if (e.key === ",") this.step(-1); else if (e.key === ".") this.step(1); });
    const retry = () => { if (this.want && this.a && this.a.paused) this.a.play().catch(() => {}); };
    addEventListener("pointerdown", retry, true); addEventListener("keydown", retry, true);
    this.paint();
  }
  private muted() { try { return localStorage.getItem("aw_muted") === "1"; } catch { return false; } }
  private step(d: number) { const i = ST.indexOf(this.st as typeof ST[number]); this.st = ST[(i + d + ST.length) % ST.length];
    try { localStorage.setItem("aw_radio2", this.st); } catch { /* */ } this.paint(); this.sync(true); }
  private paint() { this.nm.innerHTML = `<small>RADIO</small><b>${NAME[this.st]}</b>`; this.el.classList.toggle("off", this.st === "off"); }
  private sync(changed = false) {
    this.want = this.shown && this.st !== "off" && !this.muted();
    if (!this.want) { if (this.a && !this.a.paused) this.a.pause(); return; }
    const src = SRC(this.st);
    if (!this.a) { this.a = new Audio(); this.a.loop = true; this.a.preload = "auto"; this.a.volume = VOL; (window as unknown as { __awRadio: HTMLAudioElement }).__awRadio = this.a; }
    if (changed || !this.a.src.endsWith(src.slice(1))) { this.a.src = src; }
    const intro = (window as unknown as { __awIntro?: HTMLAudioElement }).__awIntro; if (intro && !intro.paused) intro.pause(); // cut the loading-screen intro (no overlap)
    if (this.a.paused) this.a.play().catch(() => { /* waits for next gesture */ });
  }
  private t = 0;
  update() {
    const show = true; /* r284: all modes (walk, car, moto, plane); station continues across mode switches */
    const md = this.g.S.mode; if (this.el.dataset.mode !== md) { this.el.dataset.mode = md; if (md === "plane") { const pn = document.getElementById("hud"); if (pn) { const r = pn.getBoundingClientRect(); if (r.bottom > 0) this.el.style.setProperty("--aw-radio-top", Math.round(r.bottom + 8) + "px"); } } }
    if (show !== this.shown) { this.shown = show; this.el.classList.toggle("on", show); this.sync(); }
    else if ((this.t = (this.t + 1) % 30) === 0) this.sync();
  }
}
