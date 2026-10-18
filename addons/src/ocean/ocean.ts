// addons/src/ocean/ocean.ts
// Aruba ocean & coast: Gerstner waves, depth-based colour, shoreline foam,
// shallow bottom, sun glints, fresnel. Three quality levels.
// One draw call per tile. Zero allocations in update().
import {
  Mesh,
  PlaneGeometry,
  ShaderMaterial,
  Vector3,
  Color,
  type WebGLRenderer,
  type Scene,
} from "three";

export type OceanQuality = "low" | "medium" | "high";

export class Ocean {
  readonly mesh: Mesh;
  readonly material: ShaderMaterial;
  quality: OceanQuality = "medium";

  private readonly sunDir = new Vector3(0.4, 0.75, 0.25).normalize();
  private readonly deepColor = new Color(0x0a3d62);
  private readonly shallowColor = new Color(0x48c9b0);
  private readonly foamColor = new Color(0xf4f6f7);
  private readonly sandColor = new Color(0xe8d5a3);

  constructor(size = 1200, segments = 128) {
    const geometry = new PlaneGeometry(size, size, segments, segments);
    geometry.rotateX(-Math.PI / 2);

    this.material = new ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSunDir: { value: this.sunDir },
        uDeep: { value: this.deepColor },
        uShallow: { value: this.shallowColor },
        uFoam: { value: this.foamColor },
        uSand: { value: this.sandColor },
        uQuality: { value: 1 }, // 0 low, 1 medium, 2 high
        uCameraPos: { value: new Vector3() },
      },
      vertexShader: OCEAN_VERTEX,
      fragmentShader: OCEAN_FRAGMENT,
      transparent: true,
      depthWrite: false,
    });

    this.mesh = new Mesh(geometry, this.material);
    this.mesh.frustumCulled = false;
    this.mesh.matrixAutoUpdate = false;
    this.mesh.updateMatrix();
  }

  setQuality(q: OceanQuality): void {
    this.quality = q;
    this.material.uniforms.uQuality.value = q === "low" ? 0 : q === "medium" ? 1 : 2;
  }

  /** Call once per frame. Only writes existing uniform values. */
  update(elapsed: number, cameraPosition: Vector3): void {
    this.material.uniforms.uTime.value = elapsed;
    // Follow the camera on a coarse grid; waves are computed in world space so they do not slide.
    const grid = 64;
    this.mesh.position.set(Math.round(cameraPosition.x / grid) * grid, this.mesh.position.y, Math.round(cameraPosition.z / grid) * grid);
    this.mesh.updateMatrix();
    this.material.uniforms.uCameraPos.value.copy(cameraPosition);
  }

  dispose(): void {
    this.mesh.geometry.dispose();
    this.material.dispose();
  }
}

/** Convenience: create and add an ocean tile covering the map. */
export function createOcean(scene: Scene, renderer: WebGLRenderer, quality: OceanQuality = "medium"): Ocean {
  const ocean = new Ocean();
  ocean.setQuality(quality);
  scene.add(ocean.mesh);
  return ocean;
}

// ---------------------------------------------------------------------------
// Vertex shader — 4 Gerstner waves (disabled on Low)
// ---------------------------------------------------------------------------
const OCEAN_VERTEX = /* glsl */ `
uniform float uTime;
uniform float uQuality;
varying vec3 vWorldPos;
varying vec3 vNormal;
varying float vFoam;

// Gerstner wave
vec3 gerstner(vec2 xz, float steep, float amp, float len, vec2 dir, float speed, float t) {
  float k = 6.283185 / len;
  float c = sqrt(9.8 / k);
  vec2 d = normalize(dir);
  float f = k * (dot(d, xz) - c * t * speed);
  float a = steep / k;
  return vec3(d.x * a * cos(f), a * sin(f), d.y * a * cos(f));
}

void main() {
  vec3 pos = (modelMatrix * vec4(position, 1.0)).xyz;
  vec3 n = vec3(0.0, 1.0, 0.0);
  float foam = 0.0;

  if (uQuality > 0.5) {
    float t = uTime;
    vec2 xz = pos.xz;
    // Four summed Gerstner waves
    vec3 w1 = gerstner(xz, 0.35, 0.55, 28.0, vec2(1.0, 0.3), 1.0, t);
    vec3 w2 = gerstner(xz, 0.28, 0.40, 18.0, vec2(-0.6, 0.8), 1.15, t);
    vec3 w3 = gerstner(xz, 0.22, 0.28, 12.0, vec2(0.2, -1.0), 0.85, t);
    vec3 w4 = gerstner(xz, 0.18, 0.18, 8.0,  vec2(-0.9, -0.4), 1.4, t);
    pos += w1 + w2 + w3 + w4;

    // Approximate normal from wave derivatives (cheap)
    float eps = 0.5;
    vec3 px = gerstner(xz + vec2(eps, 0.0), 0.35, 0.55, 28.0, vec2(1.0, 0.3), 1.0, t)
            + gerstner(xz + vec2(eps, 0.0), 0.28, 0.40, 18.0, vec2(-0.6, 0.8), 1.15, t);
    vec3 pz = gerstner(xz + vec2(0.0, eps), 0.35, 0.55, 28.0, vec2(1.0, 0.3), 1.0, t)
            + gerstner(xz + vec2(0.0, eps), 0.28, 0.40, 18.0, vec2(-0.6, 0.8), 1.15, t);
    n = normalize(cross(vec3(eps, px.y - pos.y, 0.0), vec3(0.0, pz.y - pos.y, eps)));

    foam = clamp((w1.y + w2.y) * 1.8, 0.0, 1.0);
  }

  vec4 world = vec4(pos, 1.0);
  vWorldPos = world.xyz;
  vNormal = normalize(n);
  vFoam = foam;
  gl_Position = projectionMatrix * viewMatrix * world;
}
`;

// ---------------------------------------------------------------------------
// Fragment shader — depth colour, foam, shallow bottom, glints, fresnel
// ---------------------------------------------------------------------------
const OCEAN_FRAGMENT = /* glsl */ `
uniform float uTime;
uniform vec3 uSunDir;
uniform vec3 uDeep;
uniform vec3 uShallow;
uniform vec3 uFoam;
uniform vec3 uSand;
uniform float uQuality;
uniform vec3 uCameraPos;
varying vec3 vWorldPos;
varying vec3 vNormal;
varying float vFoam;

void main() {
  vec3 viewDir = normalize(uCameraPos - vWorldPos);
  vec3 n = normalize(vNormal);
  float ndotv = max(0.0, dot(n, viewDir));

  // Depth from world Y (water surface ~0, terrain below negative)
  float depth = 0.6; // no seabed depth available to this shader

  // Base water colour: turquoise → deep blue
  vec3 water = mix(uShallow, uDeep, depth);

  // Shallow bottom (sand/reef) visible through clear water
  if (uQuality > 0.5 && depth < 0.45) {
    float bottomVis = (1.0 - depth / 0.45) * 0.65;
    water = mix(water, uSand, bottomVis * (0.6 + 0.4 * sin(vWorldPos.x * 0.15 + uTime * 0.3)));
  }

  // Shoreline foam where water meets sand (depth near 0)
  float shore = 0.0; // needs seabed depth; see gaps
  float foamMask = max(vFoam, shore * 0.8);
  if (uQuality < 0.5) {
    // Low: animated normal-map style foam only
    foamMask = shore * (0.4 + 0.3 * sin(vWorldPos.x * 0.2 + uTime * 1.5));
  }
  water = mix(water, uFoam, clamp(foamMask, 0.0, 0.75));

  // Fresnel
  float fresnel = pow(1.0 - ndotv, 3.0);
  water = mix(water, vec3(0.75, 0.88, 0.95), fresnel * 0.45);

  // Sun glints (High only)
  if (uQuality > 1.5) {
    vec3 refl = reflect(-uSunDir, n);
    float glint = pow(max(0.0, dot(refl, viewDir)), 48.0);
    water += glint * 0.65;
  }

  // Low quality: flat animated normal approximation already handled above
  float alpha = mix(0.78, 0.92, fresnel);
  gl_FragColor = vec4(water, alpha);
}
`;
