// Procedural sky dome, one draw for the whole day (replaces A's static HDR backdrop, whose
// sun was painted in at a fixed 48 deg): elevation-keyed gradient with a warm sun side and
// a blue / Belt-of-Venus anti-sun side, Mie glow, sun disc, fair-weather trade-wind cumulus,
// moon and stars. Clouds are a cloud-deck projection of one 256^2 tileable noise texture
// baked once at start (3 taps per sky pixel). Tone mapped like the rest of the frame
// (in-material on LOW, by A's OutputPass on MED/HIGH), so tiers match.
import {
  BackSide, Color, DataTexture, LinearFilter, LinearMipmapLinearFilter, Mesh, NoBlending, RepeatWrapping,
  RGBAFormat, ShaderMaterial, SphereGeometry, UnsignedByteType, Vector2, Vector3, Vector4,
} from "three";
import { uNight, uStars, uTime } from "./uniforms";

export type Sky = {
  mesh: Mesh;
  u: {
    uSun: { value: Vector3 }; uMoon: { value: Vector3 }; uSunXZ: { value: Vector2 }; uCam: { value: Vector3 };
    uZen: { value: Color }; uHorS: { value: Color }; uHorA: { value: Color }; uGlow: { value: Color }; uBelt: { value: Color };
    uDisc: { value: Color }; uCLit: { value: Color }; uCShade: { value: Color }; uFog: { value: Color };
    uWind: { value: Vector4 }; uCover: { value: number }; uCloudAmt: { value: number }; uMoonI: { value: number };
  };
};

/** Tileable value-noise fbm: R = cloud shapes (~5 puffs per tile), G = finer detail for erosion. */
function cloudNoise(size = 256): DataTexture {
  let seed = 0x2f6e2b1;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  const lattice = (p: number) => { const a = new Float32Array(p * p); for (let i = 0; i < a.length; i++) a[i] = rnd(); return a; };
  const fbm = (periods: number[]) => {
    const lats = periods.map(lattice), out = new Float32Array(size * size);
    let lo = 1e9, hi = -1e9;
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        let v = 0, amp = 0.5, tot = 0;
        for (let o = 0; o < periods.length; o++) {
          const p = periods[o], L = lats[o];
          const fx = (x / size) * p, fy = (y / size) * p;
          const ix = Math.floor(fx), iy = Math.floor(fy);
          let tx = fx - ix, ty = fy - iy;
          tx = tx * tx * (3 - 2 * tx); ty = ty * ty * (3 - 2 * ty);
          const x0 = ix % p, y0 = iy % p, x1 = (ix + 1) % p, y1 = (iy + 1) % p;
          const a = L[y0 * p + x0], b = L[y0 * p + x1], c = L[y1 * p + x0], d = L[y1 * p + x1];
          v += amp * ((a + (b - a) * tx) * (1 - ty) + (c + (d - c) * tx) * ty);
          tot += amp; amp *= 0.5;
        }
        v /= tot;
        out[y * size + x] = v;
        if (v < lo) lo = v; if (v > hi) hi = v;
      }
    for (let i = 0; i < out.length; i++) out[i] = (out[i] - lo) / (hi - lo);
    return out;
  };
  const r = fbm([5, 10, 20, 40, 80]), g = fbm([16, 32, 64, 128]);
  const data = new Uint8Array(size * size * 4);
  for (let i = 0; i < size * size; i++) { data[i * 4] = r[i] * 255; data[i * 4 + 1] = g[i] * 255; data[i * 4 + 2] = 0; data[i * 4 + 3] = 255; }
  const tex = new DataTexture(data, size, size, RGBAFormat, UnsignedByteType);
  tex.wrapS = tex.wrapT = RepeatWrapping;
  tex.magFilter = LinearFilter;
  tex.minFilter = LinearMipmapLinearFilter;
  tex.generateMipmaps = true;
  tex.needsUpdate = true;
  return tex;
}

export function makeSky(): Sky {
  const u = {
    uSun: { value: new Vector3(0, 1, 0) }, uMoon: { value: new Vector3(0, 1, 0) }, uSunXZ: { value: new Vector2(1, 0) },
    uCam: { value: new Vector3() },
    uZen: { value: new Color() }, uHorS: { value: new Color() }, uHorA: { value: new Color() }, uGlow: { value: new Color() },
    uBelt: { value: new Color() }, uDisc: { value: new Color() }, uCLit: { value: new Color() }, uCShade: { value: new Color() },
    uFog: { value: new Color() }, uWind: { value: new Vector4() }, uCover: { value: 0.58 }, uCloudAmt: { value: 1 }, uMoonI: { value: 0 },
  };
  const material = new ShaderMaterial({
    uniforms: { ...u, uNight, uStars, uTime, uNoise: { value: cloudNoise() } },
    side: BackSide,
    depthWrite: false,
    // stays in the transparent list (after opaques, so early-z skips covered pixels) but writes straight through
    transparent: true,
    blending: NoBlending,
    fog: false,
    vertexShader: /* glsl */ `
      varying vec3 vDir;
      void main() {
        vDir = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }`,
    fragmentShader: /* glsl */ `
      varying vec3 vDir;
      uniform vec3 uSun, uMoon, uCam, uZen, uHorS, uHorA, uGlow, uBelt, uDisc, uCLit, uCShade, uFog;
      uniform vec2 uSunXZ;
      uniform vec4 uWind;
      uniform float uNight, uStars, uTime, uCover, uCloudAmt, uMoonI;
      uniform sampler2D uNoise;
      const float SUN_R = 6.0e-5;   // 1 - cos(0.63 deg)
      const float MOON_R = 4.6e-5;
      const float CLOUD_H = 1400.0;
      void main() {
        vec3 dir = normalize(vDir);
        float y = dir.y, h = max(y, 0.0);
        vec2 dxz = dir.xz / max(length(dir.xz), 1e-4);
        float az = dot(dxz, uSunXZ) * 0.5 + 0.5;
        float mu = dot(dir, uSun), m = max(mu, 0.0);
        float m2 = m * m, m4 = m2 * m2, m8 = m4 * m4, m32 = m8 * m8 * m8 * m8;

        // gradient: horizon band thins upward; sun-side horizon warm at dusk, anti-sun side cool
        vec3 hor = mix(uHorA, uHorS, az * az);
        float g = 1.0 - h;
        vec3 col = mix(uZen, hor, g * g * (0.45 + 0.55 * g));
        float anti = (1.0 - az) * (1.0 - az);
        col += uBelt * anti * smoothstep(0.0, 0.05, h) * (1.0 - smoothstep(0.07, 0.3, h));
        col += uGlow * (m2 * 0.1 + m8 * 0.4 + m32 * 0.85);

        // night: moon (soft maria from the noise) and stars
        float md = 1.0 - dot(dir, uMoon);
        float moon = 1.0 - smoothstep(MOON_R * 0.7, MOON_R, md);
        float maria = texture2D(uNoise, (dir.xz - uMoon.xz) * 95.0).g;
        col += vec3(0.85, 0.88, 0.95) * moon * (0.75 + 0.35 * maria) * uMoonI * 1.6;
        float mg = max(1.0 - md, 0.0), mg2 = mg * mg, mg8 = mg2 * mg2; mg8 *= mg8;
        col += vec3(0.05, 0.07, 0.13) * (mg8 * mg8 * 0.6 + mg2 * mg2 * 0.12) * uMoonI;
        vec3 cell = floor(dir * 300.0);
        float hsh = fract(sin(dot(cell, vec3(12.9, 78.2, 45.1))) * 43758.5);
        float star = step(0.9925, hsh) * pow(fract(hsh * 17.0), 5.0);
        star *= 0.7 + 0.3 * sin(uTime * (1.5 + fract(hsh * 31.0) * 3.0) + hsh * 80.0);
        col += vec3(0.85, 0.9, 1.0) * star * uStars * smoothstep(0.04, 0.3, h) * 1.4;

        // sun disc with limb darkening, clipped by the sea horizon
        float d = 1.0 - mu;
        float disc = (1.0 - smoothstep(SUN_R * 0.8, SUN_R, d)) * (1.0 - 0.4 * clamp(d / SUN_R, 0.0, 1.0));
        vec3 sun = uDisc * disc * smoothstep(-0.006, 0.004, y);

        // clouds: deck at CLOUD_H drifting with the trade wind. The +0.15 bends the deck down like the
        // earth's curvature (distant cumulus stay puffy instead of streaking). The detail layer is
        // rotated and non-integer scaled so the 6 km tile does not repeat; no branch so LOD stays defined.
        float dist = (CLOUD_H - min(uCam.y, CLOUD_H - 50.0)) / (max(y, 0.0) + 0.15);
        vec2 w = uCam.xz + dir.xz * dist;
        vec2 p = w * (1.0 / 6000.0) + uWind.xy;
        vec2 q = mat2(0.8, -0.6, 0.6, 0.8) * w * (1.0 / 2300.0) + uWind.zw;
        float n2 = texture2D(uNoise, q).g;
        float ero = (1.0 - n2) * 0.26;
        float n = texture2D(uNoise, p).r - ero;
        float ns = texture2D(uNoise, p + uSunXZ * 0.02).r - ero;
        float dens = smoothstep(uCover, uCover + 0.16, n);
        float lit = clamp(0.5 + (n - ns) * 8.0, 0.0, 1.0);
        lit *= (1.0 - 0.55 * smoothstep(uCover + 0.06, uCover + 0.3, n)) * (0.78 + 0.32 * n2);   // shaded bases, cauliflower tops
        lit = mix(lit, 1.0, m8 * 0.6);
        vec3 cc = mix(uCShade, uCLit, lit);
        cc += uGlow * (m8 * 1.1 + m32 * 1.5) * (1.0 - 0.5 * dens);   // silver lining toward the sun
        cc = mix(cc, hor, (1.0 - smoothstep(0.03, 0.32, y)) * 0.6);   // aerial perspective
        dens *= smoothstep(0.0, 0.09, y) * uCloudAmt * step(uCam.y, CLOUD_H - 60.0);

        col = mix(col + sun, cc, dens);
        col = mix(uFog, col, smoothstep(-0.03, 0.004, y));
        gl_FragColor = vec4(col, 1.0);
        #include <tonemapping_fragment>
        #include <colorspace_fragment>
      }`,
  });
  const mesh = new Mesh(new SphereGeometry(1, 32, 16), material);
  mesh.frustumCulled = false;
  mesh.renderOrder = -1000;
  mesh.name = "aw:sky";
  mesh.matrixAutoUpdate = true;
  return { mesh, u };
}
