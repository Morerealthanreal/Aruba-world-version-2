import * as THREE from 'three';
import type { BoatInput, WaveHeightFn, TerrainHeightFn, Quality, BoatOptions } from './types';
import { Wake } from './Wake.ts';

// Waterline samples for a 35 ft sportfisher (beam ~3.2 m, bow at +Z). Equilibrium is still DRAFT.
const SAMPLE_LOCAL = [
  new THREE.Vector3(-1.4, 0, 3.6),
  new THREE.Vector3(1.4, 0, 3.6),
  new THREE.Vector3(-1.4, 0, -3.4),
  new THREE.Vector3(1.4, 0, -3.4),
  new THREE.Vector3(0, 0, 4.8),
  new THREE.Vector3(0, 0, -4.2),
  new THREE.Vector3(-0.8, 0, 0.4),
  new THREE.Vector3(0.8, 0, 0.4),
];

/** Hull draft (sample points below the local wave height at rest), metres; less when planing. */
const DRAFT = 0.12;
const DRAFT_PLANING = 0.07;
const GRAVITY = 9.8;
/** Forward thrust as an acceleration (m/s^2) at full throttle: planes past 4.5 m/s and tops out near
 *  15 m/s (THRUST / planing drag), reached in ~8 s (SuperGrok FIX 7). */
const THRUST = 5.25;
/** Hard top speed, m/s. */
const TOP_SPEED = 15;
/** The Enter/Exit prompt shows within this distance of the hull, metres (FIX 7). */
const ENTER_RADIUS = 5;
/** Seconds between wake quads. */
const WAKE_EVERY = 0.12;

export class Boat {
  readonly group: THREE.Group;
  readonly promptActive = { value: false, text: '' };
  private readonly wake: Wake;
  private readonly options: Required<Omit<BoatOptions, 'fxParent'>>;
  private readonly samples: THREE.Vector3[];
  private readonly tmp = new THREE.Vector3();
  private readonly tmp2 = new THREE.Vector3();
  private readonly force = new THREE.Vector3();
  private readonly torque = new THREE.Vector3();
  /** Chase camera: offset behind/above the hull (hull faces +Z), its own smoothed position, look target. */
  private readonly camOffset = new THREE.Vector3(0, 5.2, -16);
  private readonly camPos = new THREE.Vector3();
  private readonly camLook = new THREE.Vector3();
  private readonly camTmp = new THREE.Vector3();
  private camSnap = true;

  private velocity = new THREE.Vector3();
  private angularVel = new THREE.Vector3();
  private throttle = 0;
  private steer = 0;
  private occupied = false;
  private time = 0;
  private wakeTimer = 0;
  private nearBeach = false;
  private playerPos: THREE.Vector3 | null = null;

  constructor(options: BoatOptions = {}) {
    this.options = {
      quality: options.quality ?? 'high',
      seaLevel: options.seaLevel ?? 0,
      position: options.position ?? new THREE.Vector3(0, 0, 0),
    };

    this.group = new THREE.Group();
    // yaw about world Y, then pitch/roll about the hull's own axes
    this.group.rotation.order = 'YXZ';
    this.group.position.copy(this.options.position);
    this.buildGeometry();

    // wake quads live in world space (parenting them to the moving hull would drag them along)
    this.wake = new Wake(options.fxParent ?? this.group, this.options.quality);
    this.samples = this.options.quality === 'low' ? SAMPLE_LOCAL.slice(0, 4) : SAMPLE_LOCAL;
  }

  setQuality(q: Quality): void {
    this.options.quality = q;
    this.wake.setQuality(q);
  }

  setPlayerPosition(pos: THREE.Vector3 | null): void {
    this.playerPos = pos;
  }

  get isOccupied(): boolean { return this.occupied; }
  get position(): THREE.Vector3 { return this.group.position; }
  get yaw(): number { return this.group.rotation.y; }
  /** Horizontal speed, m/s. */
  get speed(): number { return Math.hypot(this.velocity.x, this.velocity.z); }

  enter(): void {
    this.occupied = true;
    this.promptActive.value = false;
    this.camSnap = true;
  }

  /**
   * Chase camera: smoothly follows behind and above the hull while occupied. Keeps its own smoothed
   * position, so it works even when the game re-places the camera every frame. Returns false (and leaves
   * the camera alone) when the boat is empty.
   */
  updateChaseCamera(camera: THREE.Camera, dt: number): boolean {
    if (!this.occupied) return false;
    const p = this.group.position, yaw = this.group.rotation.y;
    const s = Math.sin(yaw), c = Math.cos(yaw);
    const o = this.camOffset;
    // offset rotated by the heading only (pitch/roll would make the camera seasick)
    this.camTmp.set(p.x + o.x * c + o.z * s, p.y + o.y, p.z - o.x * s + o.z * c);
    if (this.camSnap) {
      this.camPos.copy(this.camTmp);
      this.camSnap = false;
    } else {
      this.camPos.lerp(this.camTmp, Math.min(1, dt * 3.5));
    }
    this.camLook.set(p.x, p.y + 0.8, p.z);
    camera.position.copy(this.camPos);
    camera.lookAt(this.camLook);
    return true;
  }

  exit(): void {
    this.occupied = false;
    this.throttle = 0;
    this.steer = 0;
  }

  /** Move the (unoccupied) boat, e.g. to moor it near the player. */
  place(x: number, z: number, yaw: number, y = this.options.seaLevel): void {
    this.group.position.set(x, y, z);
    this.group.rotation.set(0, yaw, 0);
    this.velocity.set(0, 0, 0);
    this.angularVel.set(0, 0, 0);
  }

  update(dt: number, input: BoatInput, waveHeight: WaveHeightFn, terrainHeight: TerrainHeightFn): void {
    if (dt <= 0) return;
    dt = Math.min(dt, 0.05); // keep the buoyancy spring stable through frame hitches
    this.time += dt;

    // Enter/exit prompt near beaches
    this.updatePrompt(terrainHeight, input);

    const throttleIn = this.occupied ? input.throttle : 0;
    const steerIn = this.occupied ? input.steer : 0;
    this.throttle = THREE.MathUtils.lerp(this.throttle, throttleIn, Math.min(1, dt * 3));
    this.steer = THREE.MathUtils.lerp(this.steer, steerIn, Math.min(1, dt * 4));

    const speed = this.speed;
    const planing = speed > 4.5;

    // Buoyancy from sample points: each submerged point pushes up in proportion to its depth, tuned so
    // the hull settles at DRAFT; gravity pulls the other way. Pitch/roll torques level the hull.
    this.group.updateMatrix(); // matrix is otherwise only refreshed at render time
    this.force.set(0, -GRAVITY, 0);
    this.torque.set(0, 0, 0);
    const n = this.samples.length;
    const k = GRAVITY / (n * (planing ? DRAFT_PLANING : DRAFT));
    let submerged = 0;

    for (let i = 0; i < n; i++) {
      this.tmp.copy(this.samples[i]);
      this.tmp.applyMatrix4(this.group.matrix);
      const wh = waveHeight(this.tmp.x, this.tmp.z, this.time);
      const depth = Math.min(wh - this.tmp.y, 0.6);
      if (depth > 0) {
        const lift = depth * k;
        this.force.y += lift;
        // Torque for pitch/roll: a deeper bow lifts the bow (rotation.x < 0), a deeper
        // starboard (+x) side rolls it up (rotation.z > 0)
        const local = this.samples[i];
        this.torque.x -= local.z * lift * 0.9;
        this.torque.z += local.x * lift * 2.2;
        submerged++;
      }
    }

    // Planing: the bow rides up a little
    if (planing) this.torque.x -= Math.min(1, (speed - 4.5) / 4) * 2.5;

    // Engine thrust along the hull heading (flat, so pitch does not push the boat into the sky)
    const yaw = this.group.rotation.y;
    const fx = Math.sin(yaw), fz = Math.cos(yaw);
    if (submerged > 0) {
      const thrust = this.throttle * THRUST * (this.throttle < 0 ? 0.5 : 1);
      this.force.x += fx * thrust;
      this.force.z += fz * thrust;
    }

    // Rudder: needs water flowing past it; positive steer turns right (clockwise seen from above)
    const flow = THREE.MathUtils.clamp(speed / 3, 0.2, 1);
    const rudder = this.steer * (1.2 + speed * 0.12) * flow * (this.velocity.x * fx + this.velocity.z * fz < -0.2 ? -1 : 1);
    this.angularVel.y -= rudder * dt * 0.6;

    // Drag: along the hull it drops when planing; sideways the keel resists strongly
    const along = this.velocity.x * fx + this.velocity.z * fz;
    const sideX = this.velocity.x - fx * along, sideZ = this.velocity.z - fz * along;
    const drag = planing ? 0.35 : 0.85;
    this.velocity.x -= (fx * along * drag + sideX * 2.5) * dt;
    this.velocity.z -= (fz * along * drag + sideZ * 2.5) * dt;
    if (submerged > 0) this.velocity.y *= 1 - Math.min(1, 3.5 * dt);
    this.angularVel.y *= 1 - Math.min(1, 1.8 * dt);
    this.angularVel.x *= 1 - Math.min(1, 4 * dt);
    this.angularVel.z *= 1 - Math.min(1, 4 * dt);

    // Integrate
    this.velocity.addScaledVector(this.force, dt);
    const hs = Math.hypot(this.velocity.x, this.velocity.z);
    if (hs > TOP_SPEED) {
      this.velocity.x *= TOP_SPEED / hs;
      this.velocity.z *= TOP_SPEED / hs;
    }
    this.tmp2.copy(this.group.position);
    this.group.position.addScaledVector(this.velocity, dt);

    // Keep off the beach: refuse water shallower than the hull
    const ground = terrainHeight(this.group.position.x, this.group.position.z);
    if (ground > this.options.seaLevel - 0.35) {
      this.group.position.x = this.tmp2.x;
      this.group.position.z = this.tmp2.z;
      this.velocity.x *= -0.2;
      this.velocity.z *= -0.2;
    }

    this.angularVel.x += this.torque.x * dt;
    this.angularVel.z += this.torque.z * dt;
    this.group.rotation.x += this.angularVel.x * dt;
    this.group.rotation.z += this.angularVel.z * dt;
    this.group.rotation.y += this.angularVel.y * dt;

    // Clamp pitch/roll
    this.group.rotation.x = THREE.MathUtils.clamp(this.group.rotation.x, -0.35, 0.25);
    this.group.rotation.z = THREE.MathUtils.clamp(this.group.rotation.z, -0.3, 0.3);

    // Soft surface constraint
    const avgWave = waveHeight(this.group.position.x, this.group.position.z, this.time);
    if (this.group.position.y < avgWave - 0.4) {
      this.group.position.y = THREE.MathUtils.lerp(this.group.position.y, avgWave - 0.1, Math.min(1, dt * 2));
    }

    // Wake (throttled so the quad ring makes a trail a few seconds long)
    this.wakeTimer -= dt;
    if ((speed > 1.5 && this.options.quality !== 'low' || speed > 2.5) && this.wakeTimer <= 0) {
      this.wakeTimer = WAKE_EVERY;
      this.tmp2.copy(this.group.position);
      this.tmp2.y = avgWave + 0.03; // on the water, not at the hull origin
      this.wake.emit(this.tmp2, yaw, speed);
    }
    this.wake.update(dt);
  }

  private updatePrompt(terrainHeight: TerrainHeightFn, input: BoatInput): void {
    const th = terrainHeight(this.group.position.x, this.group.position.z);
    this.nearBeach = Math.abs(th - this.options.seaLevel) < 0.8 && this.group.position.y < this.options.seaLevel + 1.2;

    let close = false;
    if (this.playerPos) {
      const dx = this.group.position.x - this.playerPos.x, dz = this.group.position.z - this.playerPos.z;
      close = dx * dx + dz * dz < ENTER_RADIUS * ENTER_RADIUS;
    }

    const canInteract = this.nearBeach && close;
    if (canInteract) {
      this.promptActive.value = true;
      this.promptActive.text = this.occupied ? 'Exit boat' : 'Enter boat';
      if (input.interact) {
        if (this.occupied) this.exit();
        else this.enter();
      }
    } else {
      this.promptActive.value = false;
      this.promptActive.text = '';
    }
  }

  private buildGeometry(): void {
    // 35 ft sportfisher of the kind docked at Renaissance Marina (Bertram / Luhrs / Hatteras
    // charters on L.G. Smith Blvd: white topsides, dark bottom paint, flybridge, outriggers,
    // cockpit fighting chair). Nose is +Z. The waterline sits on local y = 0.
    const white = new THREE.MeshStandardMaterial({ color: 0xf4f6f8, roughness: 0.42, metalness: 0.08 });
    const navy = new THREE.MeshStandardMaterial({ color: 0x142c44, roughness: 0.55, metalness: 0.12 });
    const glass = new THREE.MeshStandardMaterial({ color: 0x163044, roughness: 0.15, metalness: 0.35 });
    const teak = new THREE.MeshStandardMaterial({ color: 0x8d6240, roughness: 0.78 });
    const metal = new THREE.MeshStandardMaterial({ color: 0xc5ccd1, roughness: 0.35, metalness: 0.6 });
    const cushion = new THREE.MeshStandardMaterial({ color: 0x1f4f86, roughness: 0.7 });
    const add = (mesh: THREE.Mesh) => { this.group.add(mesh); return mesh; };

    const bottom = add(new THREE.Mesh(new THREE.BoxGeometry(3.05, 0.42, 7.4), navy));
    bottom.position.set(0, -0.08, 0.15);
    const topsides = add(new THREE.Mesh(new THREE.BoxGeometry(3.25, 0.72, 7.6), white));
    topsides.position.set(0, 0.42, 0.05);
    const bow = add(new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.7, 2.3), white));
    bow.position.set(0, 0.55, 4.35);
    bow.rotation.x = -0.22;
    const bowFoot = add(new THREE.Mesh(new THREE.BoxGeometry(1.35, 0.32, 1.6), navy));
    bowFoot.position.set(0, 0.12, 4.15);
    const foredeck = add(new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.08, 2.4), white));
    foredeck.position.set(0, 0.82, 2.7);
    const cockpit = add(new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.08, 3.3), teak));
    cockpit.position.set(0, 0.55, -1.7);

    const cabin = add(new THREE.Mesh(new THREE.BoxGeometry(2.55, 1.15, 3.1), white));
    cabin.position.set(0, 1.35, 1.15);
    const windshield = add(new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.55, 0.08), glass));
    windshield.position.set(0, 1.85, 2.68);
    windshield.rotation.x = -0.35;
    const sideGlass = add(new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.42, 2.2), glass));
    sideGlass.position.set(1.26, 1.55, 1.2);
    const sideGlassL = sideGlass.clone();
    sideGlassL.position.x = -1.26;
    this.group.add(sideGlassL);

    const bridge = add(new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.12, 1.7), white));
    bridge.position.set(0, 2.0, 1.05);
    const helm = add(new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.45, 0.28), glass));
    helm.position.set(0.55, 2.28, 1.55);
    const seat = add(new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.1, 0.42), cushion));
    seat.position.set(-0.45, 2.12, 0.85);
    const hardtop = add(new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.06, 2.0), white));
    hardtop.position.set(0, 3.15, 0.95);
    for (const x of [-1.15, 1.15]) {
      const post = add(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.15, 6), metal));
      post.position.set(x, 2.55, 1.7);
    }

    // Outriggers: long poles aft from the flybridge, the silhouette of a marina sportfisher.
    for (const side of [-1, 1]) {
      const pole = add(new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.02, 4.6, 5), metal));
      pole.position.set(side * 1.5, 2.7, -0.6);
      pole.rotation.z = side * 0.35;
      pole.rotation.x = 0.85;
    }
    const tower = add(new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.08, 0.7), metal));
    tower.position.set(0, 3.45, 0.7);

    const chair = add(new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.08, 0.5), cushion));
    chair.position.set(0, 0.85, -1.5);
    const chairBack = add(new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.45, 0.08), cushion));
    chairBack.position.set(0, 1.1, -1.74);
    const transom = add(new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.7, 0.12), white));
    transom.position.set(0, 0.7, -3.85);

    this.group.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }

  dispose(): void {
    this.wake.dispose();
    this.group.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) {
        (o as THREE.Mesh).geometry.dispose();
        const m = (o as THREE.Mesh).material;
        if (Array.isArray(m)) m.forEach((mat) => mat.dispose());
        else m.dispose();
      }
    });
  }
}
