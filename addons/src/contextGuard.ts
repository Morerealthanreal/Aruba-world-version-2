// WebGL context-loss recovery + render-target budget (desktop crash on HIGH).
// - On webglcontextlost: preventDefault (allows restore), show a small notice, then reload.
//   A second loss in the same session at the same tier steps the saved tier down one
//   notch (desktop -> high -> med) so a GPU that cannot hold HIGH stops crash-looping.
// - Pixel budget: A renders HIGH at full DPR (2 on Retina) into 4x MSAA half-float targets,
//   plus GTAO, bloom mips and the transmission target, all at drawing-buffer size. On a
//   16" Retina that is ~6 MP per target. Cap the drawing buffer at 4.5 MP on HIGH and
//   8 MP on Desktop Quality (phones already capped in perfFixes).
import type { AGame } from "./env";

const DOWN: Record<string, string> = { desktop: "high", high: "med", med: "low" };

export class ContextGuard {
  stats = { lost: 0, prCap: 0 };
  constructor(private g: AGame, mobile: boolean) {
    const c = g.renderer.domElement;
    c.addEventListener("webglcontextlost", (e) => this.lost(e), false);
    c.addEventListener("webglcontextrestored", () => location.reload(), false);
    if (!mobile) { this.cap(); addEventListener("resize", () => this.cap()); }
  }
  private tier(): string { const q = (this.g.real as unknown as { q: { name: string; id?: string } }).q; return q.id || q.name; }
  private cap() {
    const t = this.tier();
    if (t !== "high" && t !== "desktop") return;
    const R = this.g.renderer, budget = t === "desktop" ? 8e6 : 2.4e6;
    const css = innerWidth * innerHeight, want = Math.min(devicePixelRatio || 1, t === "desktop" ? 3 : 2);
    const pr = Math.max(1, Math.min(want, Math.sqrt(budget / Math.max(1, css))));
    (window as unknown as { __awPRCap?: number }).__awPRCap = pr;
    // only ever lower: the fps guard scales below the cap and dispatches resize too (no tug of war)
    if (R.getPixelRatio() > pr + 0.01) { R.setPixelRatio(pr); this.stats.prCap = +pr.toFixed(2); dispatchEvent(new Event("resize")); }
  }
  private lost(e: Event) {
    e.preventDefault();
    this.stats.lost++;
    const t = this.tier(), key = "aw_ctxlost_" + t;
    let n = 0;
    try { n = +(sessionStorage.getItem(key) || 0) + 1; sessionStorage.setItem(key, String(n)); } catch { /* private mode */ }
    if (n >= 2 && DOWN[t]) { try { localStorage.setItem("aw_q", DOWN[t]); } catch { /* ignore */ } }
    const d = document.createElement("div");
    d.textContent = n >= 2 && DOWN[t] ? `Graphics reset - switching to ${DOWN[t].toUpperCase()}…` : "Graphics reset - reloading…";
    d.style.cssText = "position:fixed;left:50%;top:40%;transform:translate(-50%,-50%);z-index:99999;background:#000c;color:#fff;padding:14px 18px;border-radius:12px;font:600 15px system-ui";
    document.body.appendChild(d);
    setTimeout(() => {
      const u = new URL(location.href);
      if (n >= 2 && DOWN[t]) u.searchParams.delete("q");
      location.href = u.toString();
    }, 2500);
  }
}
