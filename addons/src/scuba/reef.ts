// Two shore reefs, placed on the game's coast where people actually snorkel.
// Boca Catalina: shallow rock and seagrass, green turtles. Mangel Halto: the
// south-coast coral patches just off the beach. Built only when ?scuba=1.
import { BoxGeometry, DoubleSide, Group, Mesh, MeshStandardMaterial, PlaneGeometry } from "three";

export type ReefSite = {
  name: string;
  x: number;
  z: number;
  y: number;
  turtle: boolean;
};

/** Boca Catalina shelf (OSM node, just west of the stair) and Mangel Halto, offshore of the beach POI. */
export const REEFS: ReefSite[] = [
  { name: "Boca Catalina", x: -8992, z: -9532, y: -1.55, turtle: true },
  { name: "Mangel Halto", x: 48, z: 6236, y: -1.45, turtle: false },
];

export function nearestReef(x: number, z: number): ReefSite {
  let best = REEFS[0];
  let bestD = Infinity;
  for (const r of REEFS) {
    const d = (r.x - x) * (r.x - x) + (r.z - z) * (r.z - z);
    if (d < bestD) { best = r; bestD = d; }
  }
  return best;
}

export function reefDistance(site: ReefSite, x: number, z: number): number {
  return Math.hypot(site.x - x, site.z - z);
}

function coralPatch(site: ReefSite): Group {
  const sand = new MeshStandardMaterial({ color: 0xd7c4a2, roughness: 0.9 });
  const brain = new MeshStandardMaterial({ color: 0xe4c99a, roughness: 0.82 });
  const fanMat = new MeshStandardMaterial({ color: 0x7d4b86, roughness: 0.7, side: DoubleSide });
  const g = new Group();
  g.name = `aw-reef-${site.name}`;
  g.position.set(site.x, site.y + 0.35, site.z);
  const heads: [number, number, number, number][] = [[-3.2, 0.2, -1.4, 0.9], [2.4, 0, 2.1, 0.7], [0.6, 0.1, -3.5, 1.05], [-1.2, 0, 3.2, 0.55]];
  for (const [x, y, z, s] of heads) {
    const head = new Mesh(new BoxGeometry(s, s * 0.55, s * 0.85), brain);
    head.position.set(x, y, z);
    g.add(head);
  }
  for (const [x, z, ry] of [[4.2, -0.4, 0.4], [-4.5, 1.6, -0.6]] as const) {
    const fan = new Mesh(new PlaneGeometry(0.9, 1.15), fanMat);
    fan.position.set(x, 0.45, z);
    fan.rotation.y = ry;
    g.add(fan);
  }
  const bed = new Mesh(new BoxGeometry(14, 0.08, 12), sand);
  bed.position.y = -0.45;
  g.add(bed);
  g.visible = false;
  return g;
}

/** Green sea turtle. Swims a slow circle over Boca Catalina's grass. */
export function buildTurtle(): Group {
  const shellMat = new MeshStandardMaterial({ color: 0x3e7a45, roughness: 0.62 });
  const skin = new MeshStandardMaterial({ color: 0xc6d2a4, roughness: 0.55 });
  const g = new Group();
  g.name = "aw-turtle";
  const shell = new Mesh(new BoxGeometry(0.7, 0.22, 0.95), shellMat);
  shell.position.y = 0.12;
  g.add(shell);
  const body = new Mesh(new BoxGeometry(0.5, 0.16, 0.8), skin);
  g.add(body);
  const head = new Mesh(new BoxGeometry(0.18, 0.14, 0.22), skin);
  head.position.set(0, 0.02, -0.52);
  g.add(head);
  for (const [x, z] of [[0.38, -0.15], [-0.38, -0.15], [0.32, 0.28], [-0.32, 0.28]] as const) {
    const flipper = new Mesh(new BoxGeometry(0.28, 0.04, 0.16), skin);
    flipper.position.set(x, 0, z);
    g.add(flipper);
  }
  g.visible = false;
  return g;
}

export function buildReefs(): Group[] {
  return REEFS.map(coralPatch);
}

export function placeTurtle(turtle: Group, t: number): void {
  const boca = REEFS[0];
  const a = t * 0.18;
  turtle.position.set(boca.x + Math.cos(a) * 6, boca.y + 0.35, boca.z + Math.sin(a) * 4.5);
  turtle.rotation.y = -a + Math.PI / 2;
}
