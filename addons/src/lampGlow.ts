// Street-lamp glow on every tier (LOW included) without real lights:
//  - every lamp in the loaded regions (A's veg.lists.l, ~4k island-wide) gets a
//    warm glow dot at its bulb: ONE Points draw call, so the town twinkles from afar;
//  - the nearest lamps get a soft additive light pool on the ground (one instanced draw).
// The bulbs themselves are made emissive in nightLights.ts.
import { BufferAttribute, BufferGeometry, InstancedMesh, Matrix4, PlaneGeometry, Points, Quaternion, Vector3 } from "three";
import type { AGame } from "./env";
import { decalMaterial, glowPointsMaterial, uPxScale } from "./glow";
import { uNight } from "./uniforms";

type LampRow = [number, number, number, number, number]; // x, groundY, z, scale, yaw
const BULB_X = -2.4, BULB_Y = 8.87; // bulb in the lamp model's local space (props.glb slamp)

export class LampGlow {
  g: AGame;
  points: Points;
  pools: InstancedMesh;
  private dotI = { value: 0 };
  private poolI = { value: 0 };
  private lists: unknown[] = [];
  private bulbs = new Float32Array(0);
  private nBulbs = 0;
  private t = 0;
  private nPools: number;

  constructor(g: AGame) {
    this.g = g;
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(new Float32Array(3), 3));
    this.points = new Points(geo, glowPointsMaterial(this.dotI));
    this.points.frustumCulled = false;
    this.points.name = "aw:lampGlow";
    this.points.renderOrder = 5;
    const tier = g.real?.q?.name ?? "med";
    this.nPools = tier === "low" ? 14 : tier === "med" ? 24 : 32;
    const plane = new PlaneGeometry(1, 1).rotateX(-Math.PI / 2);
    this.pools = new InstancedMesh(plane, decalMaterial(0xffb866, this.poolI), this.nPools);
    this.pools.frustumCulled = false;
    this.pools.count = 0;
    this.pools.name = "aw:lampPools";
    g.scene.add(this.points, this.pools);
  }

  private rebuild() {
    const veg = this.g.real!.veg as unknown as { lists?: { l?: LampRow[][] } };
    const l = veg.lists?.l;
    if (!l) return;
    if (l.length === this.lists.length && l.every((a, i) => a === this.lists[i])) return;
    this.lists = l.slice();
    let n = 0;
    for (const arr of l) n += arr.length;
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), size = new Float32Array(n);
    let i = 0;
    for (const arr of l)
      for (const [x, y, z, s, yaw] of arr) {
        const c = Math.cos(yaw), sn = Math.sin(yaw);
        pos[i * 3] = x + BULB_X * c * s;
        pos[i * 3 + 1] = y + BULB_Y * s - 0.12;
        pos[i * 3 + 2] = z - BULB_X * sn * s;
        col[i * 3] = 1; col[i * 3 + 1] = 0.74; col[i * 3 + 2] = 0.42;
        size[i] = 1.9;
        i++;
      }
    const geo = new BufferGeometry();
    geo.setAttribute("position", new BufferAttribute(pos, 3));
    geo.setAttribute("color", new BufferAttribute(col, 3));
    geo.setAttribute("size", new BufferAttribute(size, 1));
    this.points.geometry.dispose();
    this.points.geometry = geo;
    this.bulbs = pos;
    this.nBulbs = n;
  }

  update(dt: number) {
    const night = uNight.value;
    const k = Math.max(0, Math.min(1, (night - 0.3) / 0.45));
    this.dotI.value = 1.6 * k;
    this.poolI.value = 0.55 * k;
    this.points.visible = this.pools.visible = k > 0.001;
    this.t -= dt;
    if (this.t > 0) return;
    this.t = 0.5;
    this.rebuild();
    const cam = this.g.camera;
    uPxScale.value = (this.g.renderer.domElement.height / 2) / Math.tan(((cam.fov * Math.PI) / 180) / 2);
    if (!this.points.visible) return;
    // nearest lamps -> ground pools
    const cx = cam.position.x, cz = cam.position.z;
    const near: Array<[number, number]> = [];
    const b = this.bulbs;
    for (let i = 0; i < this.nBulbs; i++) {
      const dx = b[i * 3] - cx, dz = b[i * 3 + 2] - cz;
      const d = dx * dx + dz * dz;
      if (d < 160 * 160) near.push([d, i]);
    }
    near.sort((a, c) => a[0] - c[0]);
    const m = new Matrix4(), q = new Quaternion(), sc = new Vector3(15, 1, 15), p = new Vector3();
    const n = Math.min(this.nPools, near.length);
    for (let j = 0; j < n; j++) {
      const i = near[j][1];
      const x = b[i * 3], z = b[i * 3 + 2];
      const gy = this.g.real && (this.g.real as unknown as { heightAt?: (x: number, z: number) => number }).heightAt;
      const y = gy ? gy(x, z) : b[i * 3 + 1] - BULB_Y;
      p.set(x, y + 0.3, z);
      m.compose(p, q, sc);
      this.pools.setMatrixAt(j, m);
    }
    this.pools.count = n;
    this.pools.instanceMatrix.needsUpdate = true;
  }
}
