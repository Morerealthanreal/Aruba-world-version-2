// Pooled, instanced ambient traffic. A still owns road selection and lane placement;
// this layer adds yielding/car-following/player avoidance, a denser quality-scaled
// pool, and renders regular cars in batches instead of seven draws per car.
// ?traffic=0 (or ?life=0) leaves A's original traffic untouched.
// Lanes and roundabouts (task 5, off with ?lanes=0): A picks a random direction for every
// car, so half the cars on one-way streets and roundabouts drove the wrong way (Aruba
// drives on the right; OSM one-way / roundabout polylines run in the legal direction and
// every roundabout ring in the data winds counter-clockwise). One-way roads now always
// run forward. At the end of its road a car continues onto a connected road (legal
// direction only) instead of vanishing, so cars enter, circulate and leave roundabouts.
// The entry yield waits for a gap in ring traffic (and the player) instead of a fixed pause.
import {
  Color, DynamicDrawUsage, InstancedMesh, Matrix4, Mesh, PlaneGeometry,
  type BufferGeometry, type Material, type Object3D,
} from "three";
import type { AGame } from "./env";
import { decalMaterial } from "./glow";
import { uNight } from "./uniforms";

type StdMat = Material & {
  color?: Color;
  emissive?: Color;
  emissiveIntensity?: number;
  clone(): StdMat;
};
type Road = {
  c: number; w: number; n: string; ow: number; rb: number; u: number;
  id: number; p: number[][]; l0: number;
};
type Car = {
  g: Object3D; v: number; rd: Road | null; L: number; dir: number;
  s: number; sp: number; snap?: number;
};
type CarKit = Array<Record<string, BufferGeometry>>;
type Amb = {
  cars: Car[];
  nCar: number;
  group: Object3D;
  mats: Record<string, StdMat>;
  kit: { car: CarKit[] };
  carMesh(v: number, color: Color): Object3D;
  pick(x: number, z: number, test: (road: Road) => boolean, radius: number): Road[];
};
type CarState = {
  car: Car;
  base: Object3D[];
  color: Color;
  batchIndex: number;
  rd: Road | null;
  cruise: number;
  yieldPhase: number;
  yieldTime: number;
  yieldsAtEnd: boolean;
};
type PartBatch = { mesh: InstancedMesh; mat: StdMat; name: string };
type ModelBatch = { cars: CarState[]; parts: PartBatch[] };

const PAINT = [
  0xf4f1e8, 0x20252b, 0xb8bcc1, 0x8f1821, 0x174a78, 0xd7d8d2,
  0x4c5a45, 0xb46b32, 0x6b647d, 0xe3c549, 0x734535, 0x3e777b,
];
const WHITE = new Color(0xfff1d6);
const RED = new Color(0xff2010);
const IS_ROUNDABOUT = (r: Road) => !!r.rb;
// same filter A uses for car spawns: drivable class, not unpaved
const CAR_ROAD = (r: Road) => r.c >= 1 && !r.u;

export class TrafficSystem {
  stats = {
    pooled: 0, visible: 0, yielding: 0, avoiding: 0,
    batches: 0, beamDraws: 0, quality: "",
    wrongWayFixed: 0, chained: 0, rbEntered: 0, rbExited: 0, rbWaits: 0,
  };
  private amb: Amb | null = null;
  private states: CarState[] = [];
  private batches: ModelBatch[] = [];
  private stateByCar = new WeakMap<Car, CarState>();
  private matrix = new Matrix4();
  private zero = new Matrix4().makeScale(0, 0, 0);
  private paint = new Color();
  private beamI = { value: 0 };
  private beamMat = decalMaterial(0xfff0d0, this.beamI, true);
  private beams: InstancedMesh | null = null;

  private noChain = new WeakSet<Car>();
  private lanes = new URLSearchParams(location.search).get("lanes") !== "0";

  constructor(private g: AGame) {}

  /** A one-way road (incl. every roundabout ring) only runs along its polyline. */
  private legalize(car: Car) {
    if (car.rd && car.rd.ow && car.dir < 0) { car.dir = 1; this.stats.wrongWayFixed++; }
  }

  /** Near the end of its road, hand the car to a connected road (legal direction only). */
  private chain(car: Car, state: CarState): boolean {
    const rd = car.rd!, p = rd.p, end = car.dir > 0 ? p[p.length - 1] : p[0];
    const left = car.dir > 0 ? car.L - car.s : car.s;
    if (left > 2 || this.noChain.has(car)) return false;
    const opts: Array<{ r: Road; dir: number; at0: boolean }> = [];
    for (const r of this.amb!.pick(end[0], end[1], CAR_ROAD, 14)) {
      if (r === rd || r.p.length < 2) continue;
      const a = r.p[0], b = r.p[r.p.length - 1];
      if (Math.hypot(a[0] - end[0], a[1] - end[1]) < 4) opts.push({ r, dir: 1, at0: true });
      else if (!r.ow && Math.hypot(b[0] - end[0], b[1] - end[1]) < 4) opts.push({ r, dir: -1, at0: false });
    }
    if (!opts.length) { this.noChain.add(car); return false; } // dead end: let A respawn it
    // on a ring: keep circulating ~60 % of the time, otherwise take an exit; elsewhere prefer
    // not to turn onto a ring segment that only leads back
    const ring = opts.filter((o) => o.r.rb), off = opts.filter((o) => !o.r.rb);
    const pickFrom = (list: typeof opts) => list[(state.batchIndex * 7 + Math.floor(car.s * 13)) % list.length];
    let o: (typeof opts)[number];
    if (rd.rb) o = ring.length && (!off.length || ((state.batchIndex + this.stats.chained) % 5) < 3) ? pickFrom(ring) : pickFrom(off);
    else o = pickFrom(opts);
    if (rd.rb && !o.r.rb) this.stats.rbExited++;
    if (!rd.rb && o.r.rb) this.stats.rbEntered++;
    const L = (this.amb as unknown as { len(r: Road): number }).len(o.r);
    car.rd = o.r; car.L = L; car.dir = o.dir; car.s = o.at0 ? 0.3 : L - 0.3;
    this.stats.chained++;
    return true;
  }

  /** Ring traffic (or the player) within reach of a roundabout entry point. */
  private ringBusy(x: number, z: number, self: Car): boolean {
    const cars = this.amb!.cars;
    for (let j = 0; j < cars.length; j++) {
      const o = cars[j];
      if (o === self || !o.rd || !o.rd.rb || !o.g.visible) continue;
      const dx = o.g.position.x - x, dz = o.g.position.z - z;
      if (dx * dx + dz * dz < 16 * 16) return true;
    }
    const S = this.g.S, me = S.mode === "walk" ? S.walk : S.car;
    return S.mode !== "plane" && Math.hypot(me.x - x, me.z - z) < 14;
  }

  private start(): boolean {
    const amb = (this.g.real as unknown as { amb?: Amb }).amb;
    if (!amb?.kit?.car?.[0]) return false;
    this.amb = amb;
    const tier = this.g.real!.q.name;
    const target = tier === "low" ? 5 : tier === "med" ? 10 : 15;
    const variants = tier === "low" ? [0, 1, 2] : tier === "med" ? [0, 1, 2, 4] : [0, 1, 2, 3, 4];
    this.stats.quality = tier;

    // A owns route simulation; extra cars enter the same long-lived pool.
    while (amb.cars.length < target) {
      const i = amb.cars.length;
      const v = variants[i % variants.length];
      const color = this.paint.setHex(PAINT[(i * 5 + 3) % PAINT.length]);
      const root = amb.carMesh(v, color);
      root.visible = false;
      amb.group.add(root);
      amb.cars.push({ g: root, v, rd: null, L: 0, dir: 1, s: 0, sp: 0 });
    }
    amb.nCar = target;

    for (let v = 0; v < 5; v++) this.batches.push({ cars: [], parts: [] });
    for (let i = 0; i < amb.cars.length; i++) {
      const car = amb.cars[i];
      const v = Math.max(0, Math.min(4, car.v | 0));
      const paintGeo = amb.kit.car[0][v].paint;
      let color = new Color(PAINT[i % PAINT.length]);
      for (const ch of car.g.children) {
        const m = ch as Mesh;
        const mat = m.material as StdMat;
        if (m.isMesh && m.geometry === paintGeo && mat.color) {
          color = mat.color.clone();
          break;
        }
      }
      const state: CarState = {
        car, base: car.g.children.slice(), color,
        batchIndex: this.batches[v].cars.length, rd: null,
        cruise: 11, yieldPhase: 0, yieldTime: 0, yieldsAtEnd: false,
      };
      this.batches[v].cars.push(state);
      this.states.push(state);
      this.stateByCar.set(car, state);
      for (const ch of state.base) ch.visible = false;
    }

    for (let v = 0; v < 5; v++) this.makeBatch(v, amb.kit.car[0][v]);
    const beamGeo = new PlaneGeometry(4.4, 16)
      .rotateX(-Math.PI / 2).rotateY(Math.PI).translate(0, 0.11, 10);
    this.beams = new InstancedMesh(beamGeo, this.beamMat, target);
    this.beams.name = "aw:traffic:beams";
    this.beams.frustumCulled = false;
    this.beams.instanceMatrix.setUsage(DynamicDrawUsage);
    this.beams.count = 0;
    amb.group.add(this.beams);
    this.stats.pooled = this.states.length;
    return true;
  }

  private makeBatch(v: number, kit: Record<string, BufferGeometry>) {
    const amb = this.amb!;
    const batch = this.batches[v];
    const count = batch.cars.length;
    if (!count) return;
    for (const name of Object.keys(kit)) {
      const src = amb.mats[name];
      if (!src) continue;
      const mat = src.clone();
      if (name === "paint" && mat.color) mat.color.setHex(0xffffff);
      const mesh = new InstancedMesh(kit[name], mat, count);
      mesh.name = `aw:traffic:${v}:${name}`;
      mesh.frustumCulled = false;
      mesh.castShadow = this.g.real!.q.name !== "low" && name === "paint";
      mesh.instanceMatrix.setUsage(DynamicDrawUsage);
      if (name === "paint") {
        for (let i = 0; i < count; i++) mesh.setColorAt(i, batch.cars[i].color);
        if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
      }
      batch.parts.push({ mesh, mat, name });
      amb.group.add(mesh);
      this.stats.batches++;
    }
  }

  private routeChanged(state: CarState) {
    const car = state.car;
    state.rd = car.rd;
    state.cruise = car.v === 4 ? 9 : 11 + ((state.batchIndex * 7 + car.v * 3) % 4);
    state.yieldPhase = 0;
    state.yieldTime = 0;
    state.yieldsAtEnd = false;
    if (!car.rd || car.rd.rb) return;
    const p = car.rd.p;
    const end = car.dir > 0 ? p[p.length - 1] : p[0];
    state.yieldsAtEnd = this.amb!.pick(end[0], end[1], IS_ROUNDABOUT, 18).length > 0;
  }

  private applyAI(dt: number) {
    const amb = this.amb!;
    const mode = this.g.S.mode;
    const active = mode === "walk" ? this.g.S.walk : this.g.S.car;
    const avoidPlayer = mode !== "plane";
    let yielding = 0, avoiding = 0;
    for (let i = 0; i < amb.cars.length; i++) {
      const car = amb.cars[i];
      const state = this.stateByCar.get(car);
      if (!state) continue;
      if (this.lanes && car.rd) {
        if (car.rd !== state.rd) { this.noChain.delete(car); this.legalize(car); }
        else if (this.chain(car, state)) this.legalize(car);
      }
      if (car.rd !== state.rd) this.routeChanged(state);
      if (!car.rd) continue;

      let target = state.cruise;
      if (car.rd.rb) target = Math.min(target, 6.5);
      if (state.yieldsAtEnd && state.yieldPhase < 2) {
        const left = car.dir > 0 ? car.L - car.s : car.s;
        if (left < 22) target = Math.min(target, Math.max(0, (left - 4.5) * 0.75));
        if (left < 6 && state.yieldPhase === 0) {
          state.yieldPhase = 1;
          state.yieldTime = 0.7 + ((state.batchIndex * 13 + car.v * 5) % 8) * 0.1;
        }
        if (state.yieldPhase === 1) {
          target = 0;
          if (this.lanes) {
            // give way to ring traffic: go once the ring is clear (min pause yieldTime, max 6 s)
            const p = car.rd.p, end = car.dir > 0 ? p[p.length - 1] : p[0];
            state.yieldTime -= dt;
            if (car.sp < 0.7 && state.yieldTime <= 0 && (!this.ringBusy(end[0], end[1], car) || state.yieldTime < -6)) state.yieldPhase = 2;
            else if (state.yieldTime <= 0) this.stats.rbWaits++;
          } else if (car.sp < 0.7 && (state.yieldTime -= dt) <= 0) state.yieldPhase = 2;
        }
        yielding++;
      }

      if (avoidPlayer) {
        const dx = car.g.position.x - active.x;
        const dz = car.g.position.z - active.z;
        const d2 = dx * dx + dz * dz;
        if (d2 < 18 * 18) {
          target = Math.min(target, Math.max(0, (Math.sqrt(d2) - 5) * 0.8));
          avoiding++;
        }
      }

      // Tiny pools make an allocation-free O(n²) same-lane following check cheaper
      // than maintaining a spatial index.
      for (let j = 0; j < amb.cars.length; j++) {
        if (i === j) continue;
        const other = amb.cars[j];
        if (other.rd !== car.rd || other.dir !== car.dir) continue;
        const gap = car.dir * (other.s - car.s);
        if (gap > 0 && gap < 20) target = Math.min(target, Math.max(0, (gap - 5) * 0.85));
      }
      const delta = target - car.sp;
      car.sp += Math.max(-8 * dt, Math.min(2.4 * dt, delta));
      if (car.sp < 0.001) car.sp = 0.001; // A treats exact zero as uninitialised.
    }
    this.stats.yielding = yielding;
    this.stats.avoiding = avoiding;
  }

  private isSpecial(state: CarState): 0 | 1 | 2 {
    let bars = false;
    for (const ch of state.car.g.children) {
      if (ch.name.startsWith("aw:ev")) return 2;
      if ((ch.name === "aw:ebar" || ch.name === "aw:estripe") && ch.visible) bars = true;
    }
    return bars ? 1 : 0;
  }

  private renderInstances() {
    let visible = 0, beamCount = 0;
    const night = Math.max(0, Math.min(1, (uNight.value - 0.3) / 0.4));
    this.beamI.value = 0.42 * night;
    for (const batch of this.batches) {
      for (const state of batch.cars) {
        const car = state.car;
        const special = this.isSpecial(state);
        // Model-based police/ambulance children render themselves. Fire livery uses
        // A's original meshes. Ordinary cars use the instanced proxy.
        for (const ch of state.base) ch.visible = special === 1 && car.g.visible;
        const show = !!car.rd && car.g.visible && special === 0;
        if (show) {
          this.matrix.compose(car.g.position, car.g.quaternion, car.g.scale);
          visible++;
        } else this.matrix.copy(this.zero);
        for (const part of batch.parts) part.mesh.setMatrixAt(state.batchIndex, this.matrix);
        if (show && night > 0.001 && this.beams) {
          this.beams.setMatrixAt(beamCount++, this.matrix);
        }
      }
      for (const part of batch.parts) {
        part.mesh.instanceMatrix.needsUpdate = true;
        if (part.name === "light" && part.mat.emissive) {
          part.mat.emissive.copy(WHITE);
          part.mat.emissiveIntensity = 1 + night * 5;
        } else if (part.name === "tail" && part.mat.emissive) {
          part.mat.emissive.copy(RED);
          part.mat.emissiveIntensity = 1 + night * 3;
        }
      }
    }
    if (this.beams) {
      this.beams.count = beamCount;
      this.beams.visible = beamCount > 0;
      if (beamCount) this.beams.instanceMatrix.needsUpdate = true;
    }
    this.stats.visible = visible;
    this.stats.beamDraws = beamCount ? 1 : 0;
  }

  update(dt: number) {
    if (!this.amb && !this.start()) return;
    const step = Math.min(0.1, dt);
    this.applyAI(step);
    this.renderInstances();
  }
}
