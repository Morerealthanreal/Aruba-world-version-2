// Game clock. B advanced dayT every frame (one day = 110 s) and did not save it.
// Here: configurable day length, freeze, presets, and the clock is saved.
//   ?t=21.5      start at 21:30          ?daylen=24  minutes per game day (default 24)
//   ?freeze=1    stop the clock
import { params } from "./env";

const KEY = "aw_clock";
type Saved = { t: number; frozen: boolean; len: number };

function load(): Saved {
  let s: Saved = { t: 10 / 24, frozen: false, len: 24 };
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "null");
    if (raw && isFinite(raw.t)) s = { t: raw.t, frozen: !!raw.frozen, len: isFinite(raw.len) && raw.len > 0 ? raw.len : 24 };
  } catch { /* private mode */ }
  const qt = params.get("t");
  if (qt !== null && isFinite(+qt)) s.t = (((+qt % 24) + 24) % 24) / 24;
  const ql = params.get("daylen");
  if (ql !== null && +ql > 0) s.len = +ql;
  if (params.get("freeze") === "1") s.frozen = true;
  return s;
}

export class Clock {
  t: number;
  frozen: boolean;
  /** Real minutes per game day. */
  len: number;
  private lastSave = 0;
  private listeners: Array<() => void> = [];
  constructor() {
    const s = load();
    this.t = s.t;
    this.frozen = s.frozen;
    this.len = s.len;
  }
  step(dt: number) {
    if (!this.frozen) this.t = (this.t + dt / (this.len * 60)) % 1;
    const now = performance.now();
    if (now - this.lastSave > 5000) this.save();
  }
  setHour(h: number) {
    this.t = (((h % 24) + 24) % 24) / 24;
    this.save();
    this.listeners.forEach((f) => f());
  }
  setFrozen(f: boolean) {
    this.frozen = f;
    this.save();
    this.listeners.forEach((f) => f());
  }
  onChange(f: () => void) {
    this.listeners.push(f);
  }
  save() {
    this.lastSave = performance.now();
    try {
      localStorage.setItem(KEY, JSON.stringify({ t: +this.t.toFixed(5), frozen: this.frozen, len: this.len }));
    } catch { /* ignore */ }
  }
}
