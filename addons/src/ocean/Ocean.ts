import * as THREE from 'three';
import type { OceanOptions, Quality, WaveHeightFn } from './types';

const DEPTH_RES = { low: 128, medium: 256, high: 512 };
const TILE_SIZE = 64;
const WAVE_COUNT = { low: 2, medium: 3, high: 4 };

interface Wave {
  dirX: number;
  dirZ: number;
  amp: number;
  freq: number;
  phase: number;
  speed: number;
}

export class Ocean {
  readonly group: THREE.Group;
  readonly waveHeight: WaveHeightFn;
  private readonly material: THREE.ShaderMaterial;
  private readonly depthTexture: THREE.DataTexture;
  private readonly options: Required<OceanOptions>;
  private readonly waves: Wave[];
  private time = 0;
  private readonly tmp = new THREE.Vector2();

  constructor(options: OceanOptions) {
    this.options = {
      quality: options.quality ?? 'high',
      seaLevel: options.seaLevel ?? 0,
      center: options.center ?? { x: 0, z: 0 },
      extent: options.extent ?? 2048,
      heightFn: options.heightFn,
    };

    this.waves = this.buildWaves();
    this.depthTexture = this.buildDepthTexture();
    this.material = this.buildMaterial();
    this.group = new THREE.Group();
    this.group.position.set(this.options.center.x, this.options.seaLevel, this.options.center.z);
    this.buildTiles();

    // CPU waveHeight — identical formula to the vertex shader
    this.waveHeight = (x: number, z: number, t: number): number => {
      let h = 0;
      for (let i = 0; i < this.waves.length; i++) {
        const w = this.waves[i];
        const k = w.freq;
        const phase = k * (w.dirX * x + w.dirZ * z) + w.phase + t * w.speed;
        h += w.amp * Math.sin(phase);
      }
      return this.options.seaLevel + h;
    };
  }

  setQuality(q: Quality): void {
    this.options.quality = q;
    // Depth and waves are fixed at construction for determinism; quality only affects tile density / foam width.
    this.material.uniforms.uFoamWidth.value = q === 'low' ? 1.2 : 1.5;
  }

  update(dt: number): void {
    this.time += dt;
    this.material.uniforms.uTime.value = this.time;
  }

  private buildWaves(): Wave[] {
    const n = WAVE_COUNT[this.options.quality];
    const waves: Wave[] = [];
    const seeds = [
      { dir: 0.3, amp: 0.22, freq: 0.08, phase: 0.0, speed: 0.9 },
      { dir: 1.7, amp: 0.14, freq: 0.15, phase: 1.2, speed: 1.3 },
      { dir: 2.4, amp: 0.08, freq: 0.28, phase: 2.1, speed: 1.8 },
      { dir: 0.9, amp: 0.05, freq: 0.42, phase: 0.7, speed: 2.2 },
    ];
    for (let i = 0; i < n; i++) {
      const s = seeds[i];
      waves.push({
        dirX: Math.cos(s.dir),
        dirZ: Math.sin(s.dir),
        amp: s.amp,
        freq: s.freq,
        phase: s.phase,
        speed: s.speed,
      });
    }
    return waves;
  }

  private buildDepthTexture(): THREE.DataTexture {
    const res = DEPTH_RES[this.options.quality];
    const data = new Uint8Array(res * res * 4);
    const ext = this.options.extent;
    const cx = this.options.center.x;
    const cz = this.options.center.z;
    const step = (ext * 2) / res;

    for (let j = 0; j < res; j++) {
      for (let i = 0; i < res; i++) {
        const x = cx - ext + i * step;
        const z = cz - ext + j * step;
        const terrainY = this.options.heightFn(x, z);
        const depth = Math.max(0, this.options.seaLevel - terrainY);
        // Pack depth in metres into R (0–255 → 0–25 m)
        const d = Math.min(255, Math.floor(depth * 10));
        const idx = (j * res + i) * 4;
        data[idx] = d;
        data[idx + 1] = 0;
        data[idx + 2] = 0;
        data[idx + 3] = 255;
      }
    }

    const tex = new THREE.DataTexture(data, res, res, THREE.RGBAFormat);
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.magFilter = THREE.LinearFilter;
    tex.minFilter = THREE.LinearFilter;
    tex.needsUpdate = true;
    return tex;
  }

  private buildMaterial(): THREE.ShaderMaterial {
    const waveUniforms: Record<string, { value: number }> = {};
    this.waves.forEach((w, i) => {
      waveUniforms[`uWaveDirX${i}`] = { value: w.dirX };
      waveUniforms[`uWaveDirZ${i}`] = { value: w.dirZ };
      waveUniforms[`uWaveAmp${i}`] = { value: w.amp };
      waveUniforms[`uWaveFreq${i}`] = { value: w.freq };
      waveUniforms[`uWavePhase${i}`] = { value: w.phase };
      waveUniforms[`uWaveSpeed${i}`] = { value: w.speed };
    });

    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uSeaLevel: { value: this.options.seaLevel },
        uCenter: { value: new THREE.Vector2(this.options.center.x, this.options.center.z) },
        uExtent: { value: this.options.extent },
        uDepthMap: { value: this.depthTexture },
        uFoamWidth: { value: 1.5 },
        uShallow: { value: new THREE.Color(0x3ee0c8) }, // vivid Aruba turquoise
        uDeep: { value: new THREE.Color(0x0a6b8a) },
        uFoam: { value: new THREE.Color(0xf4fbff) },
        ...waveUniforms,
      },
      vertexShader: `
        uniform float uTime;
        uniform float uSeaLevel;
        ${this.waves.map((_, i) => `
          uniform float uWaveDirX${i};
          uniform float uWaveDirZ${i};
          uniform float uWaveAmp${i};
          uniform float uWaveFreq${i};
          uniform float uWavePhase${i};
          uniform float uWaveSpeed${i};
        `).join('')}
        varying vec3 vWorldPos;
        varying float vWaveH;

        void main() {
          vec4 world = modelMatrix * vec4(position, 1.0);
          float h = 0.0;
          ${this.waves.map((_, i) => `
            {
              float k = uWaveFreq${i};
              float phase = k * (uWaveDirX${i} * world.x + uWaveDirZ${i} * world.z) + uWavePhase${i} + uTime * uWaveSpeed${i};
              h += uWaveAmp${i} * sin(phase);
            }
          `).join('')}
          world.y = uSeaLevel + h;
          vWorldPos = world.xyz;
          vWaveH = h;
          gl_Position = projectionMatrix * viewMatrix * world;
        }
      `,
      fragmentShader: `
        uniform sampler2D uDepthMap;
        uniform vec2 uCenter;
        uniform float uExtent;
        uniform float uFoamWidth;
        uniform vec3 uShallow;
        uniform vec3 uDeep;
        uniform vec3 uFoam;
        varying vec3 vWorldPos;
        varying float vWaveH;

        void main() {
          // World-space continuous UVs — no tile seams
          vec2 uv = (vWorldPos.xz - uCenter) / (uExtent * 2.0) + 0.5;
          float depthSample = texture2D(uDepthMap, uv).r * 25.0; // unpack 0–255 → 0–25 m
          float depth = max(0.0, depthSample);

          // Shoreline foam only within ~1.5 m
          float foam = smoothstep(uFoamWidth, 0.0, depth);
          foam *= 0.65 + 0.35 * sin(vWorldPos.x * 0.4 + vWorldPos.z * 0.3);

          vec3 col = mix(uDeep, uShallow, exp(-depth * 0.18));
          col = mix(col, uFoam, foam);
          // Subtle wave highlight
          col += vec3(0.08) * smoothstep(0.05, 0.25, vWaveH);

          gl_FragColor = vec4(col, 0.92);
        }
      `,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
  }

  private buildTiles(): void {
    const ext = this.options.extent;
    const tiles = this.options.quality === 'low' ? 4 : this.options.quality === 'medium' ? 6 : 8;
    const tileWorld = (ext * 2) / tiles;
    const segs = this.options.quality === 'low' ? 16 : 32;

    for (let j = 0; j < tiles; j++) {
      for (let i = 0; i < tiles; i++) {
        const geo = new THREE.PlaneGeometry(tileWorld, tileWorld, segs, segs);
        geo.rotateX(-Math.PI / 2);
        const mesh = new THREE.Mesh(geo, this.material);
        mesh.position.set(
          -ext + tileWorld * (i + 0.5),
          0,
          -ext + tileWorld * (j + 0.5),
        );
        mesh.frustumCulled = true;
        this.group.add(mesh);
      }
    }
  }

  dispose(): void {
    this.depthTexture.dispose();
    this.material.dispose();
    this.group.traverse((o) => {
      if ((o as THREE.Mesh).isMesh) (o as THREE.Mesh).geometry.dispose();
    });
  }
}
