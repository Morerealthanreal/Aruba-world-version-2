// ?debug=1 frame-time overlay: last 240 frame times as bars (green < 17 ms, yellow < 33, red),
// 16.7/33.3 ms guide lines, p50/p95/p99/max over the last ~5 s, pixel ratio and draw calls.
import type { AGame } from "./env";

export class FrameGraph {
  private c = document.createElement("canvas");
  private x: CanvasRenderingContext2D;
  private buf = new Float32Array(300);
  private i = 0; private n = 0; private t = 0;
  private txt = "";
  constructor(private g: AGame) {
    this.c.width = 300; this.c.height = 96;
    this.c.style.cssText = "position:fixed;left:8px;bottom:8px;z-index:9999;pointer-events:none;background:#000a;border-radius:6px;width:300px;height:96px";
    document.body.appendChild(this.c);
    this.x = this.c.getContext("2d")!;
  }
  frame(dtMs: number) {
    this.buf[this.i] = dtMs; this.i = (this.i + 1) % this.buf.length; this.n = Math.min(this.n + 1, this.buf.length);
    this.t += dtMs;
    if (this.t > 500) {
      this.t = 0;
      const a = Array.from(this.buf.subarray(0, this.n)).sort((p, q) => p - q), pc = (p: number) => a[Math.min(a.length - 1, Math.floor(p * a.length))];
      const R = this.g.renderer as unknown as { getPixelRatio(): number; info: { render: { calls: number } } };
      this.txt = `p50 ${pc(0.5).toFixed(1)}  p95 ${pc(0.95).toFixed(1)}  p99 ${pc(0.99).toFixed(1)}  max ${a[a.length - 1].toFixed(0)} ms · pr ${R.getPixelRatio().toFixed(2)}`;
    }
    const x = this.x, W = 300, H = 96, s = 70 / 50; // 50 ms full scale
    x.clearRect(0, 0, W, H);
    for (let k = 0; k < this.n; k++) {
      const v = this.buf[(this.i - this.n + k + this.buf.length) % this.buf.length];
      x.fillStyle = v < 17.5 ? "#3c3" : v < 34 ? "#ec3" : "#e33";
      const h = Math.min(70, v * s); x.fillRect(k, H - h, 1, h);
    }
    x.fillStyle = "#fff8"; x.fillRect(0, H - 16.7 * s, W, 1); x.fillRect(0, H - 33.3 * s, W, 1);
    x.fillStyle = "#fff"; x.font = "11px monospace"; x.fillText(this.txt, 4, 12);
  }
}
