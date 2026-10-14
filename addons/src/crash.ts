// Crash scenes: every ~60 s, 20% chance (when none is active) two of A's traffic cars collide head-on on
// a road near the player and stay put. A police unit (Everest/Isuzu, KPA livery, bar + siren) arrives,
// then a ForenSys accident-registration car; its staff member walks to the two drivers with a tablet and
// they talk with gestures. Scene clears after ~4 min or when the player is >700 m away.
// Cost: ~4 vehicles (<= 12 meshes each, shared box geometry), 3 low-poly people, emissive bars only.
// ?crash=0 disables, ?crash=force triggers within seconds (tests). ?evshow=x,z lines up all models at x,z.
import { Group, type Object3D } from "three";
import type { AGame } from "./env";
import { params } from "./env";
import { animNpc, buildEv, buildNpc, flashBar, type EvModel, type Npc } from "./evModels";
import type { Emergency } from "./emergency";

type Rd = { p: number[][]; w: number; ow?: boolean; c: number };
type Car = { g: Object3D; v: number; rd: Rd | null; s: number; dir: number; sp: number; L: number };
type Amb = { cars: Car[]; group: Object3D; w: { surfaceAt(x: number, z: number): number } };
type Pt = { x: number; z: number; yaw: number };
type Mover = { m: EvModel; s: number; target: number; lat: number; sp: number; arrived: boolean };

export class Crash {
  private amb(): Amb | null { return (this.g.real as unknown as { amb?: Amb }).amb || null; }
  private force = params.get("crash") === "force";
  private next = this.force ? 4 : 60;
  private time = 0;
  private sc: null | {
    rd: Rd; dirA: number; lat: number; sA: number; sB: number; impact: number;
    A: Car; B: Car; phase: number; age: number; tCrash: number;
    root: Group; police?: Mover; fs?: Mover; drivers: Npc[]; staff?: Npc; staffPos?: { x: number; z: number }; talk: number;
  } = null;
  stats = { scenes: 0, active: false, phase: 0, x: 0, z: 0, police: false, fs: false, talk: 0 };

  constructor(private g: AGame, private emerg: Emergency | null) {
    const show = params.get("evshow");
    if (show) { const tryShow = () => { if (this.amb()) this.showroom(show); else setTimeout(tryShow, 1000); }; setTimeout(tryShow, 3000); }
  }

  private pt(rd: Rd, s: number, lat: number, dir: number): Pt {
    const p = rd.p; let a = 0;
    for (let i = 1; i < p.length; i++) {
      const dx = p[i][0] - p[i - 1][0], dz = p[i][1] - p[i - 1][1], c = Math.hypot(dx, dz) || 1;
      if (a + c >= s || i === p.length - 1) { const l = Math.max(0, Math.min(1, (s - a) / c)), u = dx / c, d = dz / c;
        return { x: p[i - 1][0] + dx * l - d * lat, z: p[i - 1][1] + dz * l + u * lat, yaw: dir > 0 ? Math.atan2(u, d) : Math.atan2(-u, -d) }; }
      a += c;
    }
    return { x: p[0][0], z: p[0][1], yaw: 0 };
  }
  private len(rd: Rd) { let t = 0; for (let i = 1; i < rd.p.length; i++) t += Math.hypot(rd.p[i][0] - rd.p[i - 1][0], rd.p[i][1] - rd.p[i - 1][1]); return t; }
  private put(o: Object3D, q: Pt, yawAdd = 0) { const A = this.amb()!; o.position.set(q.x, A.w.surfaceAt(q.x, q.z) + 0.02, q.z); o.rotation.set(0, q.yaw + yawAdd, 0); }

  private start(): boolean {
    const A = this.amb(); if (!A || A.cars.length < 3) return false;
    const cam = this.g.camera.position;
    const cand = A.cars.filter((c) => c.rd && c.v !== 4 && c.g.visible && !c.g.children.some((ch) => ch.name.startsWith("aw:ev")) && c.L > 100 && !c.rd.ow && c.rd.w >= 6)
      .map((c) => ({ c, d: Math.hypot(c.g.position.x - cam.x, c.g.position.z - cam.z) })).filter((o) => o.d > 50 && o.d < 260).sort((a, b) => a.d - b.d);
    for (const { c } of cand) {
      const sB = c.s + c.dir * 50; if (sB < 15 || sB > c.L - 15) continue;
      const back = c.dir > 0 ? c.s : c.L - c.s; if (back < 40) continue;
      const B = A.cars.filter((o) => o !== c && o.v !== 4 && !o.g.children.some((ch) => ch.name.startsWith("aw:ev")))
        .sort((a, b) => Math.hypot(b.g.position.x - cam.x, b.g.position.z - cam.z) - Math.hypot(a.g.position.x - cam.x, a.g.position.z - cam.z))[0];
      if (!B) return false;
      for (const car of [c, B]) A.cars.splice(A.cars.indexOf(car), 1);
      const lat = c.dir * Math.min(2.2, c.rd!.w / 4);
      B.rd = c.rd; B.g.visible = true;
      const root = new Group(); root.name = "aw:crash"; A.group.add(root);
      this.sc = { rd: c.rd!, dirA: c.dir, lat, sA: c.s, sB, impact: 0, A: c, B, phase: 0, age: 0, tCrash: 0, root, drivers: [], talk: 0 };
      this.stats.scenes++; this.stats.active = true;
      return true;
    }
    return false;
  }

  private clear() {
    const sc = this.sc!, A = this.amb();
    sc.root.parent?.remove(sc.root);
    for (const car of [sc.A, sc.B]) { car.rd = null; car.g.visible = false; car.g.rotation.set(0, car.g.rotation.y, 0); if (A) A.cars.push(car); }
    if (this.emerg) this.emerg.ext = null;
    this.sc = null; this.stats.active = false; this.stats.phase = 0;
  }

  private mover(kind: "everest" | "isuzu" | "forensys", s: number, target: number, lat: number): Mover {
    const m = buildEv(kind, [45, 50, 67][(Math.random() * 3) | 0]); this.sc!.root.add(m.g);
    return { m, s, target, lat, sp: kind === "forensys" ? 11 : 15, arrived: false };
  }
  private drive(mv: Mover, dt: number) {
    const sc = this.sc!; const dir = sc.dirA;
    if (!mv.arrived) { const left = (mv.target - mv.s) * dir; const v = Math.min(mv.sp, Math.max(1.2, left * 0.8)); mv.s += dir * v * dt; if (left < 0.3) mv.arrived = true; }
    const latNow = mv.arrived ? mv.lat : sc.lat + (mv.lat - sc.lat) * Math.max(0, 1 - Math.abs(mv.target - mv.s) / 25);
    this.put(mv.m.g, this.pt(sc.rd, mv.s, latNow, dir));
  }

  update(dt: number) {
    this.time += dt;
    const sc = this.sc;
    if (!sc) {
      if ((this.next -= dt) <= 0) { this.next = this.force ? 6 : 60; const mode = (this.g.S && this.g.S.mode) || "walk"; if (mode !== "plane" && (this.force || Math.random() < 0.2)) this.start(); }
      return;
    }
    sc.age += dt; this.stats.phase = sc.phase; this.stats.police = !!sc.police?.arrived; this.stats.fs = !!sc.fs?.arrived; this.stats.talk = Math.round(sc.talk);
    const cam = this.g.camera.position, mid = this.pt(sc.rd, (sc.sA + sc.sB) / 2, sc.lat, sc.dirA);
    if (sc.age > 260 || Math.hypot(mid.x - cam.x, mid.z - cam.z) > 700) { this.clear(); return; }
    this.stats.x = mid.x; this.stats.z = mid.z;
    const dir = sc.dirA;
    if (sc.phase === 0) { // approach + head-on impact
      const v = 9 * dt; sc.sA += dir * v; sc.sB -= dir * v;
      const gap = (sc.sB - sc.sA) * dir, k = Math.max(0, Math.min(1, 1 - (gap - 5) / 40));
      this.put(sc.A.g, this.pt(sc.rd, sc.sA, sc.lat, dir));
      this.put(sc.B.g, this.pt(sc.rd, sc.sB, -sc.lat + (2 * sc.lat) * k, -dir));
      if (gap <= 4.6) { sc.phase = 1; sc.tCrash = sc.age;
        this.put(sc.A.g, this.pt(sc.rd, sc.sA, sc.lat, dir), 0.28); this.put(sc.B.g, this.pt(sc.rd, sc.sB, sc.lat * 0.75, -dir), -0.5);
        sc.A.g.rotation.z = 0.02; }
      return;
    }
    const since = sc.age - sc.tCrash;
    if (since > 3 && sc.drivers.length === 0) { // drivers step out to the shoulder
      for (const [i, s] of [sc.sA - dir * 1.5, sc.sB + dir * 1.5].entries()) {
        const n = buildNpc(["#2f6fb5", "#c8452f", "#3f8a4a", "#e8c547"][(Math.random() * 4) | 0], ["#2a2d33", "#5a4a3a", "#3b4f6b"][(Math.random() * 3) | 0]);
        const q = this.pt(sc.rd, s, sc.lat + Math.sign(sc.lat || 1) * 2.4, dir); this.put(n.g, q, i ? Math.PI * 0.5 : -Math.PI * 0.5); sc.root.add(n.g); sc.drivers.push(n);
      }
    }
    for (const n of sc.drivers) animNpc(n, dt, "talk");
    if (since > 8 && !sc.police) sc.police = this.mover(Math.random() < 0.6 ? "everest" : "isuzu", dir > 0 ? 0 : sc.rd.p.length && this.len(sc.rd), sc.sA - dir * Math.min(13, (dir > 0 ? sc.sA : this.len(sc.rd) - sc.sA) - 2), sc.lat + Math.sign(sc.lat || 1) * 0.9);
    if (sc.police) { this.drive(sc.police, dt); flashBar(sc.police.m, this.time, 0, true);
      if (this.emerg) { const p = sc.police.m.g.position; this.emerg.ext = { d: Math.hypot(p.x - cam.x, p.z - cam.z), ph: 0 }; } }
    if (sc.police?.arrived && !sc.fs) sc.fs = this.mover("forensys", dir > 0 ? 0 : this.len(sc.rd), sc.sA - dir * Math.min(24, (dir > 0 ? sc.sA : this.len(sc.rd) - sc.sA) - 1), sc.lat + Math.sign(sc.lat || 1) * 0.9);
    if (sc.fs) { this.drive(sc.fs, dt); flashBar(sc.fs.m, this.time, 1.3, !sc.fs.arrived); }
    if (sc.fs?.arrived && !sc.staff) {
      sc.staff = buildNpc("#1f3b73", "#2a2d33", true); const q = this.pt(sc.rd, sc.sA - dir * 22, sc.lat + Math.sign(sc.lat || 1) * 2.4, dir);
      this.put(sc.staff.g, q); sc.root.add(sc.staff.g); sc.staffPos = { x: q.x, z: q.z };
    }
    if (sc.staff && sc.staffPos) {
      const goal = this.pt(sc.rd, (sc.sA + sc.sB) / 2, sc.lat + Math.sign(sc.lat || 1) * 3.4, dir);
      const dx = goal.x - sc.staffPos.x, dz = goal.z - sc.staffPos.z, d = Math.hypot(dx, dz);
      if (d > 0.4) { const st = Math.min(d, 1.3 * dt); sc.staffPos.x += dx / d * st; sc.staffPos.z += dz / d * st; this.put(sc.staff.g, { x: sc.staffPos.x, z: sc.staffPos.z, yaw: Math.atan2(dx, dz) }); animNpc(sc.staff, dt, "walk", true); }
      else { sc.talk += dt; animNpc(sc.staff, dt, "talk", true);
        // face the drivers; drivers face the staff
        const s = sc.staff.g.position; sc.staff.g.rotation.y = Math.atan2(mid.x - s.x, mid.z - s.z);
        for (const n of sc.drivers) n.g.rotation.y = Math.atan2(s.x - n.g.position.x, s.z - n.g.position.z); }
    }
  }

  private showroom(spec: string) {
    const A = this.amb(); const [x, z] = spec.split(",").map(Number); if (!A || !isFinite(x)) return;
    const root = new Group(); root.name = "aw:evshow"; A.group.add(root);
    (["everest", "isuzu", "ambY", "ambP", "forensys"] as const).forEach((k, i) => {
      const m = buildEv(k, 45); const px = x + (i - 2) * 11; m.g.position.set(px, A.w.surfaceAt(px, z) + 0.02, z); m.g.rotation.y = Math.PI / 2; root.add(m.g);
      setInterval(() => flashBar(m, performance.now() / 1000, i, true), 50);
    });
    const n = buildNpc("#1f3b73", "#2a2d33", true); n.g.position.set(x + 28, A.w.surfaceAt(x + 28, z + 4), z + 4); root.add(n.g);
    const d = buildNpc("#c8452f", "#3b4f6b"); d.g.position.set(x + 29, A.w.surfaceAt(x + 29, z + 4), z + 4); d.g.rotation.y = -Math.PI / 2; root.add(d.g);
    setInterval(() => { animNpc(n, 0.05, "talk", true); animNpc(d, 0.05, "talk"); }, 50);
  }
}
