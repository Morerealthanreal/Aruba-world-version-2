// Graphics diagnostics for the settings sheet. Collapsed until opened, and the
// WebGL queries run only then. Nothing here allocates textures, reads pixels,
// or enables extensions (the debug-renderer string is the one exception, and
// it does not change drawing). ?gfxdiag=0 leaves the section out.
import type { WebGLRenderer } from "three";
import type { AGame } from "./env";
import type { FpsGuard } from "./fpsGuard";

type LineKind = "head" | "text" | "yes" | "no";
type Line = { kind: LineKind; text: string };
type CapsInfo = { lines: Line[]; maxAniso: number | null };
type Quality = {
  name: string;
  id?: string;
  dpr: number;
  shadow: number;
  aniso?: number;
  texSize?: number;
  terrainQ?: number;
  vegShadows?: boolean;
  veg3d?: number;
  radius?: number;
  bldR?: number;
  roadR?: number;
  kitR?: number;
  detailR?: number;
};
type PressureRecord = { source: string; state: string };
type PressureObs = {
  observe: (source: string) => Promise<void>;
  disconnect: () => void;
};
type Post = {
  on?: boolean;
  ao?: { enabled?: boolean };
  composer?: { renderTarget1?: { samples?: number } };
};

const STYLE = `
#awgfx{margin-top:12px;border-top:1px solid #ffffff2e;padding-top:8px}
#awgfx summary{cursor:pointer;font-weight:700;font-size:13px;padding:4px 0}
#awgfxbody{margin:4px 0 0;user-select:text;-webkit-user-select:text}
#awgfx .head{margin-top:7px;font:700 10px/1.3 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;opacity:.7}
#awgfxbody .head:first-child{margin-top:0}
#awgfx .ln,#awgfx .ok,#awgfx .no{font:12px/1.35 ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;white-space:pre-wrap;overflow-wrap:break-word}
#awgfx .ok{color:#d9ffe6}
#awgfx .no{color:#ffb4a2}
#awgfx button{margin-top:6px}
body.touch #awgfx summary{min-height:44px;display:flex;align-items:center}
`;

export function mountGfxDiag(g: AGame, guard: FpsGuard, phoneProfile: boolean): void {
  const css = document.createElement("style");
  css.id = "aw-gfx-style";
  css.textContent = STYLE;
  document.head.appendChild(css);

  let tries = 0;
  let mounted = false;
  const attach = () => {
    if (mounted) return;
    const settings = document.getElementById("settings");
    if (!settings) {
      if (tries++ < 40) setTimeout(attach, 250);
      return;
    }
    mounted = true;
    build(settings, g, guard, phoneProfile);
  };
  attach();
}

function build(settings: HTMLElement, g: AGame, guard: FpsGuard, phoneProfile: boolean): void {
  const details = document.createElement("details");
  details.id = "awgfx";
  const summary = document.createElement("summary");
  summary.textContent = "Graphics diagnostics";
  const body = document.createElement("div");
  body.id = "awgfxbody";
  const copyBtn = document.createElement("button");
  copyBtn.id = "awgfxcopy";
  copyBtn.type = "button";
  copyBtn.textContent = "Copy";
  details.append(summary, body, copyBtn);

  const place = () => {
    const time = document.getElementById("awtime");
    if (time && time.parentElement === settings) {
      time.after(details);
      return;
    }
    const reset = document.getElementById("streset");
    if (reset && reset.parentElement === settings) settings.insertBefore(details, reset);
    else settings.append(details);
  };
  place();
  // The time-of-day block is inserted just before Reset. If it lands after us, move under it.
  if (!document.getElementById("awtime")) {
    const timer = window.setInterval(() => {
      if (!document.getElementById("awtime")) return;
      window.clearInterval(timer);
      place();
    }, 250);
    window.setTimeout(() => window.clearInterval(timer), 8000);
  }

  let caps: CapsInfo | null = null;
  let thermal = "thermal not exposed";
  let text = "";
  let logged = false;
  let live = false;
  let stopPressure: (() => void) | null = null;

  const paint = () => {
    if (!caps) caps = loadCaps(g);
    const lines = [...caps.lines, ...profileLines(g, guard, phoneProfile, caps.maxAniso), ...displayLines(g, thermal)];
    body.replaceChildren();
    for (const line of lines) {
      const row = document.createElement("div");
      row.className = classFor(line.kind);
      row.textContent = line.text;
      body.append(row);
    }
    text = lines.map((line) => line.text).join("\n");
  };

  const onResize = () => { if (details.open) reveal(); };
  guard.onChange(() => { if (details.open) reveal(); });

  const startLive = () => {
    if (live) return;
    live = true;
    window.addEventListener("resize", onResize);
    stopPressure = watchPressure((line) => {
      thermal = line;
      if (details.open) paint();
    });
  };
  const stopLive = () => {
    if (!live) return;
    live = false;
    window.removeEventListener("resize", onResize);
    stopPressure?.();
    stopPressure = null;
  };

  // Paint from the summary click as well as toggle. A transformed settings
  // sheet can open the section without delivering toggle on the first tap.
  const reveal = () => {
    if (!details.open) return;
    try {
      paint();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "failed";
      body.textContent = "diagnostics failed: " + msg;
      text = body.textContent;
    }
    if (!logged && text) {
      console.info("[aw-gfx]\n" + text);
      logged = true;
    }
    startLive();
  };
  details.addEventListener("toggle", () => {
    if (!details.open) {
      stopLive();
      logged = false;
      return;
    }
    reveal();
  });
  summary.addEventListener("click", () => { queueMicrotask(reveal); });

  copyBtn.addEventListener("click", () => {
    const pending = writeClipboard(text);
    void pending.then((ok) => {
      copyBtn.textContent = ok ? "Copied" : "Copy failed";
      if (!ok) selectNode(body);
      window.setTimeout(() => { copyBtn.textContent = "Copy"; }, 1600);
    });
  });
}

function loadCaps(g: AGame): CapsInfo {
  try {
    return readCaps(g.renderer.getContext(), g.renderer);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "unavailable";
    return { lines: [{ kind: "text", text: `caps unavailable (${msg})` }], maxAniso: null };
  }
}

function readCaps(gl: WebGLRenderingContext, renderer: WebGLRenderer): CapsInfo {
  const gl2 = gl instanceof WebGL2RenderingContext ? gl : null;
  const exts = new Set(gl.getSupportedExtensions() ?? []);
  const caps = renderer.capabilities;
  const gpu = gpuName(gl);
  const engine = renderer.domElement.dataset.engine;
  const lines: Line[] = [{ kind: "head", text: "Device" }];
  lines.push({ kind: "text", text: engine ? `${gl2 ? "WebGL2" : "WebGL1"} · ${engine}` : (gl2 ? "WebGL2" : "WebGL1") });
  if (gpu.vendor && gpu.vendor !== gpu.device) lines.push({ kind: "text", text: gpu.vendor });
  lines.push({ kind: "text", text: gpu.device || "GPU name not exposed" });
  if (!gpu.unmasked) lines.push({ kind: "text", text: "device id not exposed" });
  lines.push({ kind: "text", text: str(gl.getParameter(gl.VERSION)) });
  lines.push({ kind: "text", text: str(gl.getParameter(gl.SHADING_LANGUAGE_VERSION)) });
  const attr = gl.getContextAttributes();
  if (attr) {
    lines.push({ kind: "text", text: `ctx aa ${onOff(attr.antialias)} · depth ${onOff(attr.depth)} · ${attr.powerPreference || "default"}` });
  }

  lines.push({ kind: "head", text: "Features" });
  const webgpu = "gpu" in navigator;
  lines.push(...flagLines("feat", [
    ["instancing", gl2 !== null || exts.has("ANGLE_instanced_arrays")],
    ["tex arrays", (gl2 ? limit(gl2, "MAX_ARRAY_TEXTURE_LAYERS") : 0) > 0],
    ["3D tex", (gl2 ? limit(gl2, "MAX_3D_TEXTURE_SIZE") : 0) > 0],
    ["MRT", gl2 ? limit(gl2, "MAX_DRAW_BUFFERS") > 1 : exts.has("WEBGL_draw_buffers")],
    ["indirect", false],
    ["multi-draw", exts.has("WEBGL_multi_draw") || exts.has("WEBGL_multi_draw_instanced")],
    ["occlusion", exts.has("EXT_occlusion_query_boolean")],
    ["blit", gl2 !== null && typeof gl2.blitFramebuffer === "function"],
    ["readback", typeof gl.readPixels === "function"],
    ["compute", false],
  ]));
  if (webgpu) lines.push({ kind: "text", text: "WebGPU API present, unused" });

  lines.push({ kind: "head", text: "Limits" });
  const fb = gl2 ? limit(gl2, "MAX_COLOR_ATTACHMENTS") || limit(gl2, "MAX_DRAW_BUFFERS") : 0;
  const combined = limit(gl, "MAX_COMBINED_TEXTURE_IMAGE_UNITS");
  const rb = limit(gl, "MAX_RENDERBUFFER_SIZE");
  const d3 = gl2 ? limit(gl2, "MAX_3D_TEXTURE_SIZE") : null;
  const layers = gl2 ? limit(gl2, "MAX_ARRAY_TEXTURE_LAYERS") : null;
  const uboN = gl2 ? limit(gl2, "MAX_UNIFORM_BUFFER_BINDINGS") : null;
  const uboB = gl2 ? limit(gl2, "MAX_UNIFORM_BLOCK_SIZE") : null;
  const maxAniso = caps.getMaxAnisotropy();
  lines.push({ kind: "text", text: `tex ${caps.maxTextureSize} · cube ${caps.maxCubemapSize} · 3D ${d3 ?? "n/a"} · layers ${layers ?? "n/a"}` });
  lines.push({ kind: "text", text: `rb ${rb ?? "n/a"} · view ${viewport(gl)} · fb ${fb || "n/a"} · msaa max ${caps.maxSamples}` });
  lines.push({ kind: "text", text: `streams ${caps.maxAttributes} · vert u ${caps.maxVertexUniforms} · frag u ${caps.maxFragmentUniforms} · vary ${caps.maxVaryings}` });
  lines.push({ kind: "text", text: `units ${caps.maxTextures}/${caps.maxVertexTextures}/${combined ?? "n/a"} · ubo ${uboN ?? "n/a"}×${kilo(uboB)} · draws not exposed` });
  lines.push({ kind: "text", text: `aniso max ${maxAniso}` });

  lines.push({ kind: "head", text: "Formats" });
  lines.push(...flagLines("tex", [
    ["ASTC", exts.has("WEBGL_compressed_texture_astc")],
    ["ETC2", exts.has("WEBGL_compressed_texture_etc")],
    ["ETC1", exts.has("WEBGL_compressed_texture_etc1")],
    ["BC", exts.has("WEBGL_compressed_texture_s3tc") || exts.has("WEBGL_compressed_texture_s3tc_srgb")],
    ["BPTC", exts.has("EXT_texture_compression_bptc")],
    ["RGTC", exts.has("EXT_texture_compression_rgtc")],
  ]));
  const halfRt = exts.has("EXT_color_buffer_float") || exts.has("EXT_color_buffer_half_float");
  const floatRt = exts.has("EXT_color_buffer_float");
  const floatLinear = exts.has("OES_texture_float_linear");
  // WebGL2 requires linear filtering of half-float. Full float linear stays an extension.
  const halfLinear = gl2 !== null || exts.has("OES_texture_half_float_linear");
  lines.push(...flagLines("rt", [
    ["half", halfRt],
    ["float", floatRt],
    ["half linear", halfLinear],
    ["float linear", floatLinear],
  ]));
  if (gl2) {
    gl.getError();
    lines.push(...flagLines("depth", [
      ["d16", true],
      ["d24s8", true],
      ["d24", formatOk(gl2, gl2.DEPTH_COMPONENT24)],
      ["d32f", formatOk(gl2, gl2.DEPTH_COMPONENT32F)],
      ["d32fs8", formatOk(gl2, gl2.DEPTH32F_STENCIL8)],
    ]));
    lines.push({ kind: "text", text: `msaa rgba ${sampleList(gl2, gl2.RGBA8)} · depth ${sampleList(gl2, gl2.DEPTH24_STENCIL8)}` });
    gl.getError();
  } else {
    lines.push(...flagLines("depth", [["tex", exts.has("WEBGL_depth_texture")]]));
  }

  return { lines, maxAniso };
}

function profileLines(g: AGame, guard: FpsGuard, phoneProfile: boolean, maxAniso: number | null): Line[] {
  const q = qualityOf(g);
  const snap = guard.snapshot();
  const pr = g.renderer.getPixelRatio();
  const device = window.devicePixelRatio || 1;
  const cap = (window as unknown as { __awPRCap?: number }).__awPRCap;
  const shadowNow = g.real?.sky?.sun?.shadow?.mapSize?.x;
  const nowFps = snap.fps > 1 ? ` · now ${Math.round(snap.fps)}` : "";
  const capTxt = typeof cap === "number" && Number.isFinite(cap) && cap < 100 ? ` · cap ${cap.toFixed(2)}` : "";
  const shadow = shadowNow && q.shadow && shadowNow !== q.shadow ? `shadow ${shadowNow} (profile ${q.shadow})` : `shadow ${shadowNow ?? q.shadow ?? "?"}`;
  const aniso = maxAniso === null ? String(q.aniso ?? "?") : `${q.aniso ?? "?"} (max ${maxAniso})`;
  return [
    { kind: "head", text: "Profile" },
    { kind: "text", text: `profile ${q.id || q.name} · phone profile ${onOff(phoneProfile)}` },
    { kind: "text", text: `shaders ${g.renderer.capabilities.precision} · mesh lod ${q.name === "low" ? "low" : "high"}` },
    { kind: "text", text: `fps cap ${snap.target} · dyn ${Math.round(snap.scale * 100)}% · lv ${snap.level}/${snap.maxLevel} · guard ${onOff(snap.enabled)}${nowFps}` },
    { kind: "text", text: `dpr ${q.dpr} → ${pr.toFixed(2)} · device ${device.toFixed(2)}${capTxt}` },
    { kind: "text", text: shadow },
    { kind: "text", text: `aniso ${aniso} · tex ${q.texSize ?? "?"} · terrain ${q.terrainQ ?? "?"} · veg shadow ${onOff(q.vegShadows)} · veg3d ${q.veg3d ?? "?"}` },
    { kind: "text", text: `range ${q.radius ?? "?"} · bld ${q.bldR ?? "?"} · road ${q.roadR ?? "?"} · kit ${q.kitR ?? "?"} · detail ${q.detailR ?? "?"}` },
    { kind: "text", text: postLine() },
  ];
}

function displayLines(g: AGame, thermal: string): Line[] {
  const canvas = g.renderer.domElement;
  const hz = (screen as Screen & { refreshRate?: number }).refreshRate;
  const hzTxt = typeof hz === "number" && hz > 0 ? `${hz} Hz` : "Hz not exposed";
  const cores = navigator.hardwareConcurrency;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const deviceBits = [
    cores ? `cores ${cores}` : "",
    typeof mem === "number" ? `mem ${mem} GB` : "",
  ].filter(Boolean);
  return [
    { kind: "head", text: "Display" },
    { kind: "text", text: `${canvas.clientWidth}×${canvas.clientHeight} css · buffer ${canvas.width}×${canvas.height}` },
    { kind: "text", text: `screen ${screen.width}×${screen.height} · ${screen.colorDepth}-bit · ${hzTxt}` },
    { kind: "text", text: deviceBits.length ? deviceBits.join(" · ") : "cores not exposed" },
    { kind: "text", text: thermal },
  ];
}

function postLine(): string {
  const post = (window as unknown as { __awPost?: Post }).__awPost;
  const postOn = Boolean(post?.on) && window.__noPost !== true;
  const gtao = post?.ao ? onOff(Boolean(post.ao.enabled)) : "n/a";
  const samples = post?.composer?.renderTarget1?.samples;
  const msaa = typeof samples === "number" ? String(samples) : "n/a";
  return `post ${onOff(postOn)} · GTAO ${gtao} · msaa ${msaa}`;
}

function qualityOf(g: AGame): Quality {
  const q = g.real?.q;
  if (!q) return { name: "unknown", dpr: 0, shadow: 0 };
  return q as Quality;
}

function flagLines(label: string, flags: ReadonlyArray<readonly [string, boolean]>): Line[] {
  const yes: string[] = [];
  const no: string[] = [];
  for (const [name, on] of flags) (on ? yes : no).push(name);
  const lines: Line[] = [];
  if (yes.length) lines.push({ kind: "yes", text: `${label} yes  ${yes.join(" · ")}` });
  if (no.length) lines.push({ kind: "no", text: `${label} NO   ${no.join(" · ")}` });
  return lines;
}

function gpuName(gl: WebGLRenderingContext): { vendor: string; device: string; unmasked: boolean } {
  const ext = gl.getExtension("WEBGL_debug_renderer_info") as { UNMASKED_VENDOR_WEBGL: number; UNMASKED_RENDERER_WEBGL: number } | null;
  if (!ext) {
    return { vendor: str(gl.getParameter(gl.VENDOR)), device: str(gl.getParameter(gl.RENDERER)), unmasked: false };
  }
  return {
    vendor: str(gl.getParameter(ext.UNMASKED_VENDOR_WEBGL)),
    device: str(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)),
    unmasked: true,
  };
}

function limit(gl: WebGLRenderingContext | WebGL2RenderingContext, key: string): number {
  const pname = (gl as unknown as Record<string, unknown>)[key];
  if (typeof pname !== "number") return 0;
  try {
    const value = gl.getParameter(pname);
    return typeof value === "number" && Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

function viewport(gl: WebGLRenderingContext): string {
  const dims = gl.getParameter(gl.MAX_VIEWPORT_DIMS) as ArrayLike<number> | null;
  if (!dims || dims.length < 2) return "n/a";
  return dims[0] === dims[1] ? String(dims[0]) : `${dims[0]}×${dims[1]}`;
}

function formatOk(gl: WebGL2RenderingContext, format: number): boolean {
  try {
    gl.getInternalformatParameter(gl.RENDERBUFFER, format, gl.SAMPLES);
  } catch {
    gl.getError();
    return false;
  }
  return gl.getError() === gl.NO_ERROR;
}

function sampleList(gl: WebGL2RenderingContext, format: number): string {
  try {
    const raw = gl.getInternalformatParameter(gl.RENDERBUFFER, format, gl.SAMPLES) as ArrayLike<number> | null;
    if (gl.getError() !== gl.NO_ERROR || !raw) return "n/a";
    const vals = Array.from(raw).filter((n) => n > 0).sort((a, b) => a - b);
    return vals.length ? vals.join(",") : "none";
  } catch {
    gl.getError();
    return "n/a";
  }
}

function watchPressure(onLine: (line: string) => void): () => void {
  const Ctor = (window as unknown as {
    PressureObserver?: new (cb: (records: PressureRecord[]) => void) => PressureObs;
  }).PressureObserver;
  if (!Ctor) return () => {};
  let closed = false;
  let reported = false;
  let obs: PressureObs;
  try {
    obs = new Ctor((records) => {
      if (closed) return;
      const last = records[records.length - 1];
      if (!last) return;
      reported = true;
      onLine(/therm/i.test(last.source) ? `thermal ${last.state}` : `thermal n/a · ${last.source} pressure ${last.state}`);
    });
  } catch {
    return () => {};
  }
  void obs.observe("cpu").then(() => {
    if (closed) obs.disconnect();
    else if (!reported) onLine("thermal n/a · cpu pressure checking");
  }, () => {
    if (!closed) onLine("thermal not exposed");
  });
  return () => {
    closed = true;
    try { obs.disconnect(); } catch { /* already disconnected */ }
  };
}

function writeClipboard(text: string): Promise<boolean> {
  const clip = navigator.clipboard;
  if (!clip?.writeText) return Promise.resolve(legacyCopy(text));
  return clip.writeText(text).then(() => true, () => legacyCopy(text));
}

function legacyCopy(text: string): boolean {
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.left = "-9999px";
    document.body.append(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  } catch {
    return false;
  }
}

function selectNode(node: HTMLElement): void {
  const range = document.createRange();
  range.selectNodeContents(node);
  const sel = getSelection();
  if (!sel) return;
  sel.removeAllRanges();
  sel.addRange(range);
}

function classFor(kind: LineKind): string {
  switch (kind) {
    case "head":
      return "head";
    case "text":
      return "ln";
    case "yes":
      return "ok";
    case "no":
      return "no";
    default: {
      const exhaustive: never = kind;
      return exhaustive;
    }
  }
}

function onOff(on: boolean | undefined): string {
  if (on === undefined) return "?";
  return on ? "on" : "off";
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function kilo(n: number | null): string {
  if (n === null || n <= 0) return "n/a";
  if (n % 1024 === 0) return `${n / 1024}K`;
  return String(n);
}
