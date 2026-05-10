"use client";

import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

/**
 * Subtle WebGL2 glass overlay for the Final CTA section.
 *
 * Idle: an almost-transparent silver film with a soft horizontal sheen so the
 * glass is hinted at rather than announced. On pointerdown a small chrome bead
 * is "thrown" toward the click point. When the bead lands the glass develops
 * Voronoi-cell cracks and radial spider lines from the impact, the inner cells
 * fade away as if shards have fallen, and the whole crack pattern eases out.
 *
 * Implementation notes:
 * - One shader does everything: glass tint, sheen, cracks, flash, and the
 *   in-flight bead. Per-impact and per-ball state lives in two small uniform
 *   arrays, so the GPU does the heavy lifting and React never re-renders.
 * - The canvas itself is `pointer-events: none`. Clicks are observed via a
 *   `pointerdown` listener on the closest <section>, which lets the underlying
 *   CTA button keep working — clicks on `<a>` / `<button>` are skipped so the
 *   button never triggers a shatter.
 * - The render loop only runs while balls or impacts are active, plus one
 *   frame after resize / theme change, so idle cost is effectively zero.
 * - Honors `prefers-reduced-motion` by not initializing WebGL at all.
 */

const MAX_IMPACTS = 6;
const MAX_BALLS = 4;
const FLIGHT_DURATION_S = 0.42;
const IMPACT_LIFETIME_S = 3.4;

type Ball = {
  targetX: number;
  targetY: number;
  startX: number;
  startY: number;
  start: number;
  intensity: number;
  cellSize: number;
  spider: number;
};

type Impact = {
  x: number;
  y: number;
  start: number;
  intensity: number;
  cellSize: number;
  spider: number;
};

const VERTEX_SRC = /* glsl */ `#version 300 es
in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAGMENT_SRC = /* glsl */ `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 fragColor;

uniform vec2  u_resolution;
uniform float u_time;
uniform float u_isDark;

#define MAX_IMPACTS 6
#define MAX_BALLS   4

uniform int  u_impactCount;
uniform vec4 u_impactA[MAX_IMPACTS]; // x, y, start, intensity
uniform vec2 u_impactB[MAX_IMPACTS]; // cellSize, spiderCount

uniform int  u_ballCount;
uniform vec4 u_ballA[MAX_BALLS]; // targetX, targetY, startX, startY
uniform vec2 u_ballB[MAX_BALLS]; // start, intensity

vec2 hash22(vec2 p) {
  p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
  return fract(sin(p) * 43758.5453);
}

// Voronoi: returns (d1, d2, cellId). d2 - d1 gives a clean cell-edge mask.
vec3 voronoi(vec2 x) {
  vec2 ip = floor(x);
  vec2 f  = fract(x);
  float md1 = 8.0;
  float md2 = 8.0;
  float id  = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash22(ip + g);
      vec2 r = g + o - f;
      float d = dot(r, r);
      if (d < md1) {
        md2 = md1;
        md1 = d;
        id  = hash22(ip + g + 13.37).x;
      } else if (d < md2) {
        md2 = d;
      }
    }
  }
  return vec3(sqrt(md1), sqrt(md2), id);
}

void main() {
  vec2 uv = v_uv;
  // Aspect-correct space so circular shapes stay circular.
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  vec2  p = vec2(uv.x * aspect, uv.y);

  // ===== Base glass film (very subtle, cool silver) =====
  // Cooler-than-page palette so a low alpha still reads against the near-white
  // light theme and the deep dark theme.
  vec3 silverLight = vec3(0.62, 0.68, 0.78);
  vec3 silverDark  = vec3(0.82, 0.88, 0.96);
  vec3 baseColor   = mix(silverLight, silverDark, u_isDark);

  // Soft horizontal sheen that drifts slightly on the y axis — feels like a
  // pane catching light.
  float bandPos = uv.y - 0.55;
  float band    = exp(-bandPos * bandPos * 7.0) * 0.5;

  // High-frequency frosted grain.
  vec2 nuv = uv * u_resolution.xy * 0.55;
  float grain = (fract(sin(dot(nuv, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.012;

  float baseAlpha = 0.055 + band * 0.025 + grain;
  baseAlpha = clamp(baseAlpha, 0.0, 1.0);

  // ===== Crack accumulation across all live impacts =====
  float crackMask  = 0.0;
  float flashGlow  = 0.0;
  float innerFade  = 0.0;

  for (int i = 0; i < MAX_IMPACTS; i++) {
    if (i >= u_impactCount) break;
    vec4 ia = u_impactA[i];
    vec2 ib = u_impactB[i];
    vec2  ipos      = vec2(ia.x * aspect, ia.y);
    float start     = ia.z;
    float age       = u_time - start;
    if (age < 0.0) continue;
    float intensity = ia.w;
    float cellSize  = ib.x;
    float spider    = ib.y;

    vec2  d    = p - ipos;
    float dist = length(d);

    // Lifetime envelope (0..1) and a smooth tail-off.
    float lifeT    = clamp(age / 3.4, 0.0, 1.0);
    float lifeFade = 1.0 - smoothstep(0.62, 1.0, lifeT);

    // Crack front expands smoothly then settles (ease-out).
    float expandT  = 1.0 - exp(-age / 0.32);
    float maxR     = 0.5 * intensity;
    float radius   = maxR * expandT;

    // Voronoi cells centered on the impact.
    vec3 v = voronoi((p - ipos) * cellSize + 5.0);

    // Cell-edge cracks (smooth AA on the d2 - d1 boundary).
    float edge = 1.0 - smoothstep(0.0, 0.028, v.y - v.x);

    // Spider radial cracks — sin pattern jittered by the cell hash for a
    // non-uniform crack count.
    float ang        = atan(d.y, d.x);
    float spiderRays = abs(cos(ang * spider + v.z * 6.2831));
    float spiderMask = smoothstep(0.94, 1.0, spiderRays);

    // Constrain the cracks to the current expansion radius with a soft fall-off.
    float radialMask = smoothstep(radius, radius * 0.55, dist);
    radialMask *= 1.0 - smoothstep(maxR * 1.05, maxR, dist);

    float cracks = max(edge, spiderMask * 0.9) * radialMask * lifeFade;
    crackMask = max(crackMask, cracks);

    // Brief flash near the impact center on contact.
    float flash = exp(-age * 4.5) * exp(-dist * 8.5) * intensity * 1.15;
    flashGlow = max(flashGlow, flash);

    // Inner cells "fall away" — fade alpha to zero in a small inner ring,
    // delayed slightly so the cracks register first.
    float fallT     = smoothstep(0.45, 2.2, age) * lifeFade;
    float innerR    = radius * 0.55;
    float innerMask = 1.0 - smoothstep(innerR * 0.45, innerR, dist);
    innerFade = max(innerFade, fallT * innerMask * 0.9);
  }

  // ===== Bead in flight =====
  vec3  ballColor = vec3(0.0);
  float ballMask  = 0.0;

  for (int i = 0; i < MAX_BALLS; i++) {
    if (i >= u_ballCount) break;
    vec4 ba = u_ballA[i];
    vec2 bb = u_ballB[i];
    float age = u_time - bb.x;
    float ft  = age / 0.42;
    if (ft < 0.0 || ft > 1.0) continue;

    // Ease-in: feels like a thrown object accelerating into the glass.
    float te = ft * ft;

    vec2 startPos = vec2(ba.z * aspect, ba.w);
    vec2 endPos   = vec2(ba.x * aspect, ba.y);
    vec2 ballPos  = mix(startPos, endPos, te);

    // Bead grows slightly as it nears the glass (perspective approach).
    float r = mix(0.012, 0.022, te) * bb.y;

    vec2  d  = p - ballPos;
    float dd = dot(d, d);
    float r2 = r * r;
    if (dd < r2) {
      float h        = sqrt(r2 - dd) / r;
      vec3  normal   = vec3(d / r, h);
      vec3  lightDir = normalize(vec3(0.45, -0.55, 0.75));
      float diff     = max(dot(normal, lightDir), 0.0);
      vec3  reflDir  = reflect(-lightDir, normal);
      float spec     = pow(max(reflDir.z, 0.0), 28.0);
      vec3  cBase    = mix(vec3(0.86, 0.89, 0.94), vec3(0.66, 0.70, 0.78), u_isDark);
      vec3  col      = cBase * (0.32 + diff * 0.7) + vec3(spec) * 0.85;

      // AA on the silhouette so the bead never aliases.
      float aa = 1.0 - smoothstep(r * 0.92, r, sqrt(dd));
      if (aa > ballMask) {
        ballColor = col;
        ballMask  = aa;
      }
    }
  }

  // ===== Composite =====
  vec3 finalColor = baseColor + vec3(band * 0.05);

  // Warm flash on light theme, cool on dark — keeps it sympathetic to the page.
  vec3 flashCol = mix(vec3(1.0, 0.985, 0.95), vec3(0.92, 0.95, 1.0), u_isDark);
  finalColor = mix(finalColor, flashCol, flashGlow);

  // Bright crack lines.
  vec3 crackCol = mix(vec3(1.0), vec3(0.95, 0.97, 1.0), u_isDark);
  finalColor = mix(finalColor, crackCol, crackMask);

  float finalAlpha = baseAlpha + crackMask * 0.62 + flashGlow * 0.36;
  // Cells that have "fallen" leave a clean hole.
  finalAlpha *= 1.0 - innerFade;
  finalAlpha = clamp(finalAlpha, 0.0, 1.0);

  // Bead sits on top of the glass.
  finalColor = mix(finalColor, ballColor, ballMask);
  finalAlpha = mix(finalAlpha, 1.0, ballMask);

  // Premultiplied output (matches BLEND(ONE, ONE_MINUS_SRC_ALPHA)).
  fragColor = vec4(finalColor * finalAlpha, finalAlpha);
}`;

function compileShader(
  gl: WebGL2RenderingContext,
  type: number,
  src: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, src);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    if (typeof console !== "undefined") {
      // eslint-disable-next-line no-console
      console.warn("[CtaGlassShatter] shader compile failed:", gl.getShaderInfoLog(shader));
    }
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function CtaGlassShatter({ className }: { className?: string }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ballsRef = useRef<Ball[]>([]);
  const impactsRef = useRef<Impact[]>([]);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    if (!wrapper || !canvas) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true,
      depth: false,
      stencil: false,
      powerPreference: "low-power",
    });
    if (!gl) return;

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SRC);
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SRC);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      if (typeof console !== "undefined") {
        // eslint-disable-next-line no-console
        console.warn("[CtaGlassShatter] program link failed:", gl.getProgramInfoLog(program));
      }
      return;
    }

    // Fullscreen quad.
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(program, "a_pos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uTime = gl.getUniformLocation(program, "u_time");
    const uIsDark = gl.getUniformLocation(program, "u_isDark");
    const uImpactCount = gl.getUniformLocation(program, "u_impactCount");
    const uImpactA = gl.getUniformLocation(program, "u_impactA");
    const uImpactB = gl.getUniformLocation(program, "u_impactB");
    const uBallCount = gl.getUniformLocation(program, "u_ballCount");
    const uBallA = gl.getUniformLocation(program, "u_ballA");
    const uBallB = gl.getUniformLocation(program, "u_ballB");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const impactA = new Float32Array(MAX_IMPACTS * 4);
    const impactB = new Float32Array(MAX_IMPACTS * 2);
    const ballA = new Float32Array(MAX_BALLS * 4);
    const ballB = new Float32Array(MAX_BALLS * 2);

    const startedAt = performance.now();
    let isVisible = true;
    let raf = 0;

    const isDark = () =>
      document.documentElement.classList.contains("dark") ? 1 : 0;

    const render = () => {
      const t = (performance.now() - startedAt) / 1000;

      // Promote balls that have completed their flight to impacts.
      const balls = ballsRef.current;
      for (let i = balls.length - 1; i >= 0; i--) {
        const b = balls[i];
        if (t - b.start >= FLIGHT_DURATION_S) {
          impactsRef.current.push({
            x: b.targetX,
            y: b.targetY,
            start: t,
            intensity: b.intensity,
            cellSize: b.cellSize,
            spider: b.spider,
          });
          balls.splice(i, 1);
        }
      }

      // Cull stale impacts.
      const impacts = impactsRef.current;
      while (impacts.length > 0 && t - impacts[0].start > IMPACT_LIFETIME_S) {
        impacts.shift();
      }
      while (impacts.length > MAX_IMPACTS) impacts.shift();

      impactA.fill(0);
      impactB.fill(0);
      for (let i = 0; i < impacts.length; i++) {
        const im = impacts[i];
        impactA[i * 4 + 0] = im.x;
        // Flip Y: CSS coords are y-down, GL clip-space v_uv is y-up.
        impactA[i * 4 + 1] = 1 - im.y;
        impactA[i * 4 + 2] = im.start;
        impactA[i * 4 + 3] = im.intensity;
        impactB[i * 2 + 0] = im.cellSize;
        impactB[i * 2 + 1] = im.spider;
      }

      ballA.fill(0);
      ballB.fill(0);
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        ballA[i * 4 + 0] = b.targetX;
        ballA[i * 4 + 1] = 1 - b.targetY;
        ballA[i * 4 + 2] = b.startX;
        ballA[i * 4 + 3] = 1 - b.startY;
        ballB[i * 2 + 0] = b.start;
        ballB[i * 2 + 1] = b.intensity;
      }

      gl.useProgram(program);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uIsDark, isDark());
      gl.uniform1i(uImpactCount, impacts.length);
      gl.uniform4fv(uImpactA, impactA);
      gl.uniform2fv(uImpactB, impactB);
      gl.uniform1i(uBallCount, balls.length);
      gl.uniform4fv(uBallA, ballA);
      gl.uniform2fv(uBallB, ballB);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      // Keep ticking only while the effect is actively animating, to keep idle
      // GPU/CPU at zero.
      if (
        isVisible &&
        (ballsRef.current.length > 0 || impactsRef.current.length > 0)
      ) {
        raf = requestAnimationFrame(render);
      } else {
        raf = 0;
      }
    };

    const ensureRunning = () => {
      if (raf === 0 && isVisible) {
        raf = requestAnimationFrame(render);
      }
    };

    // Sizing.
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = wrapper.getBoundingClientRect();
      const w = Math.max(1, Math.floor(rect.width));
      const h = Math.max(1, Math.floor(rect.height));
      const bw = Math.floor(w * dpr);
      const bh = Math.floor(h * dpr);
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw;
        canvas.height = bh;
        gl.viewport(0, 0, bw, bh);
      }
      // Render at least one frame so the idle glass film is visible.
      render();
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(wrapper);

    // Pause when the section is off-screen.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isVisible = entry.isIntersecting;
        }
        if (isVisible) ensureRunning();
      },
      { rootMargin: "120px" },
    );
    io.observe(wrapper);

    // Re-render once when the theme changes (the html.dark class flip).
    const themeObserver = new MutationObserver(() => {
      ensureRunning();
      // Force at least one render even if nothing is animating.
      render();
    });
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    // Click handling: listen on the closest <section> so the canvas can stay
    // pointer-events: none and never block the underlying CTA button.
    const section = wrapper.closest("section");
    const onPointerDown = (e: PointerEvent) => {
      // Left mouse only (touch events report button === 0 too).
      if (e.button !== 0 && e.pointerType === "mouse") return;

      const target = e.target as Element | null;
      // Skip clicks on actionable elements so the CTA stays uninterrupted.
      if (
        target &&
        target.closest(
          'a, button, [role="button"], input, textarea, select, label',
        )
      ) {
        return;
      }

      const rect = wrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      if (x < 0 || x > 1 || y < 0 || y > 1) return;

      const aspect = rect.width / Math.max(rect.height, 1);
      const ang = Math.random() * Math.PI * 2;
      const off = 0.06 + Math.random() * 0.04;
      // Origin is offset from the target so the bead visibly travels in.
      const sx = x + (Math.cos(ang) * off) / aspect;
      const sy = y + Math.sin(ang) * off;

      const now = (performance.now() - startedAt) / 1000;
      ballsRef.current.push({
        targetX: x,
        targetY: y,
        startX: sx,
        startY: sy,
        start: now,
        intensity: 0.85 + Math.random() * 0.25,
        cellSize: 12 + Math.random() * 8,
        spider: 4 + Math.floor(Math.random() * 4),
      });
      while (ballsRef.current.length > MAX_BALLS) ballsRef.current.shift();

      ensureRunning();
    };
    section?.addEventListener("pointerdown", onPointerDown);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      themeObserver.disconnect();
      section?.removeEventListener("pointerdown", onPointerDown);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 select-none",
        className,
      )}
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{ pointerEvents: "none" }}
      />
    </div>
  );
}
