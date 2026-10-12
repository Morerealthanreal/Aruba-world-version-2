// Ported from SuperGrok (B) src/game/look/sky.ts: gradient sky, stars, moon.
// In the merge it is an overlay dome that fades in over A's HDR sky at dusk and
// night (A's HDR stays untouched by day, so daytime looks exactly like A).
import { BackSide, Mesh, ShaderMaterial, SphereGeometry, Vector3 } from "three";
import { uNight, uStars } from "./uniforms";

export type Sky = { mesh: Mesh; sun: Vector3; zenith: Vector3; horizon: Vector3; opacity: { value: number } };

export function makeSky(): Sky {
  const sun = new Vector3(0.2, 0.9, 0.1);
  const zenith = new Vector3(0.28, 0.58, 0.95);
  const horizon = new Vector3(0.55, 0.88, 0.9);
  const opacity = { value: 0 };
  const material = new ShaderMaterial({
    uniforms: { uSun: { value: sun }, uZenith: { value: zenith }, uHorizon: { value: horizon }, uNight, uStars, uOpacity: opacity },
    side: BackSide,
    depthWrite: false,
    transparent: true,
    fog: false,
    toneMapped: false,
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vDir;
      uniform vec3 uSun, uZenith, uHorizon;
      uniform float uNight, uOpacity, uStars;
      void main() {
        vec3 dir = normalize(vDir);
        float h = clamp(dir.y, 0.0, 1.0);
        vec3 col = mix(uHorizon, uZenith, smoothstep(0.0, 0.55, h));
        vec3 s = normalize(uSun);
        float glow = pow(max(dot(dir, s), 0.0), 8.0) * (1.0 - uNight);
        float disc = pow(max(dot(dir, s), 0.0), 420.0) * (1.0 - uNight);
        col += vec3(1.0, 0.72, 0.4) * glow * 0.35;
        col += vec3(1.0, 0.9, 0.7) * disc;
        vec3 moonDir = normalize(vec3(-s.x, max(-s.y, 0.35), -s.z));
        float moon = smoothstep(0.9993, 0.99975, dot(dir, moonDir));
        float moonGlow = pow(max(dot(dir, moonDir), 0.0), 7.0);
        col += vec3(0.35, 0.42, 0.7) * moonGlow * uNight * 0.55;
        col += vec3(0.92, 0.95, 1.0) * moon * uNight * 1.4;
        vec3 cell = floor(dir * 260.0);
        float hsh = fract(sin(dot(cell, vec3(12.9, 78.2, 45.1))) * 43758.5);
        float star = step(0.992, hsh) * pow(fract(hsh * 17.0), 6.0);
        col += star * uStars * smoothstep(0.08, 0.35, h) * 1.6;
        // below the horizon: keep the horizon colour (sea haze), never black
        col = mix(uHorizon, col, smoothstep(-0.05, 0.02, dir.y));
        gl_FragColor = vec4(col, uOpacity);
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new Mesh(new SphereGeometry(1, 32, 16), material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1000;
  mesh.name = "aw:nightSky";
  mesh.matrixAutoUpdate = true;
  return { mesh, sun, zenith, horizon, opacity };
}
