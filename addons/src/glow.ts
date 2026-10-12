// Cheap glow primitives that need no real lights (so they cost the same on LOW):
// one additive Points shader (screen-facing glow dots, min pixel size so far lamps
// still read) and one additive ground-decal shader (fake light pools / beams).
import { AdditiveBlending, CanvasTexture, LinearFilter, ShaderMaterial, Color } from "three";
import { uNight } from "./uniforms";

/** Pixels per metre at 1 m distance (viewport height / 2 / tan(fov / 2)); kept current by LampGlow. */
export const uPxScale = { value: 500 };

/** Glow dots. Attributes: position, color (rgb), size (metres). */
export function glowPointsMaterial(intensity: { value: number }, minPx = 1.6) {
  return new ShaderMaterial({
    uniforms: { uI: intensity, uNight, uScale: uPxScale, uMinPx: { value: minPx } },
    vertexShader: /* glsl */ `
      attribute float size; attribute vec3 color; varying vec3 vC; varying float vFar;
      uniform float uScale, uMinPx;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        float px = size * uScale / max(0.1, -mv.z);
        vFar = smoothstep(uMinPx * 4.0, uMinPx, px);           // tiny = far: keep a dot, dim the halo
        gl_PointSize = clamp(px, uMinPx, 140.0);
        vC = color;
        gl_Position = projectionMatrix * mv;
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vC; varying float vFar; uniform float uI;
      void main() {
        vec2 q = gl_PointCoord * 2.0 - 1.0; float r2 = dot(q, q);
        if (r2 > 1.0) discard;
        float core = exp(-r2 * 18.0), halo = exp(-r2 * 3.5) * 0.35 * (1.0 - vFar);
        float a = (core + halo) * uI;
        gl_FragColor = vec4(vC * a, 1.0);
      }`,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    fog: false,
    toneMapped: false,
  });
}

/** Soft radial (or forward beam) decal on the ground. uv in 0..1. */
export function decalMaterial(color: number, intensity: { value: number }, beam = false) {
  return new ShaderMaterial({
    uniforms: { uI: intensity, uC: { value: new Color(color) } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        vec4 p = vec4(position, 1.0);
        #ifdef USE_INSTANCING
          p = instanceMatrix * p;
        #endif
        gl_Position = projectionMatrix * modelViewMatrix * p;
      }`,
    fragmentShader: beam
      ? /* glsl */ `
      varying vec2 vUv; uniform float uI; uniform vec3 uC;
      void main() {
        // v: 0 at the bumper .. 1 far end; u across. Two merged lobes fading with distance.
        float x = (vUv.x - 0.5) * 2.0, d = vUv.y;
        float w = 0.35 + d * 0.65;
        float lobe = exp(-pow(x / w, 2.0) * 2.2);
        float a = lobe * smoothstep(0.0, 0.12, d) * pow(1.0 - d, 1.6) * uI;
        gl_FragColor = vec4(uC * a, 1.0);
      }`
      : /* glsl */ `
      varying vec2 vUv; uniform float uI; uniform vec3 uC;
      void main() {
        float r2 = dot(vUv * 2.0 - 1.0, vUv * 2.0 - 1.0);
        float a = exp(-r2 * 3.2) * (1.0 - smoothstep(0.7, 1.0, r2)) * uI;
        gl_FragColor = vec4(uC * a, 1.0);
      }`,
    transparent: true,
    depthWrite: false,
    blending: AdditiveBlending,
    polygonOffset: true,
    polygonOffsetFactor: -4,
    polygonOffsetUnits: -4,
    fog: false,
    toneMapped: false,
  });
}

export function radialTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.25, "rgba(255,255,255,0.5)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  const t = new CanvasTexture(c);
  t.minFilter = LinearFilter; // B: no mipmaps on canvas textures
  t.generateMipmaps = false;
  return t;
}
