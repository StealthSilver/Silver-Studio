"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type Uniforms = {
  [key: string]: {
    type: string;
    value: number[] | number[][] | number;
  };
};

function buildPreparedUniforms(
  uniformsDef: Uniforms,
  resolution: THREE.Vector2,
): Record<string, THREE.IUniform> {
  const preparedUniforms: Record<string, THREE.IUniform> = {};

  for (const uniformName of Object.keys(uniformsDef)) {
    const uniform = uniformsDef[uniformName];

    switch (uniform.type) {
      case "uniform1f":
        preparedUniforms[uniformName] = { value: uniform.value as number };
        break;
      case "uniform3f":
        preparedUniforms[uniformName] = {
          value: new THREE.Vector3().fromArray(uniform.value as number[]),
        };
        break;
      case "uniform1fv":
        preparedUniforms[uniformName] = {
          value: uniform.value as number[],
        };
        break;
      case "uniform3fv":
        preparedUniforms[uniformName] = {
          value: (uniform.value as number[][]).map((v) =>
            new THREE.Vector3().fromArray(v),
          ),
        };
        break;
      case "uniform2f":
        preparedUniforms[uniformName] = {
          value: new THREE.Vector2().fromArray(uniform.value as number[]),
        };
        break;
      default:
        console.error(`Invalid uniform type for '${uniformName}'.`);
        break;
    }
  }

  preparedUniforms.u_time = { value: 0 };
  preparedUniforms.u_resolution = { value: resolution.clone() };

  return preparedUniforms;
}

/** Vanilla WebGL renderer — avoids @react-three/fiber (which constructs deprecated THREE.Clock). */
function DotMatrixWebGLCanvas({
  source,
  uniforms: uniformsDef,
  maxFps = 60,
}: {
  source: string;
  uniforms: Uniforms;
  maxFps?: number;
}) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const pixelRatioMin = Math.min(
      typeof window !== "undefined" ? window.devicePixelRatio : 1,
      2,
    );

    const resolution = new THREE.Vector2();

    const material = new THREE.RawShaderMaterial({
      vertexShader: `
      precision mediump float;
      in vec3 position;
      uniform vec2 u_resolution;
      out vec2 fragCoord;
      void main(){
        gl_Position = vec4(position.x, position.y, 0.0, 1.0);
        fragCoord = (position.xy + vec2(1.0)) * 0.5 * u_resolution;
        fragCoord.y = u_resolution.y - fragCoord.y;
      }
      `,
      fragmentShader: source,
      uniforms: buildPreparedUniforms(uniformsDef, resolution),
      glslVersion: THREE.GLSL3,
      blending: THREE.CustomBlending,
      blendSrc: THREE.SrcAlphaFactor,
      blendDst: THREE.OneFactor,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;

    const scene = new THREE.Scene();
    scene.add(mesh);

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(pixelRatioMin);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    mount.appendChild(renderer.domElement);

    let rafId = 0;
    /** Wall-clock seconds from performance.now() — avoids THREE.Clock deprecation. */
    const tStart = typeof performance !== "undefined" ? performance.now() / 1000 : 0;

    const setSizeFromMount = () => {
      const w = mount!.clientWidth;
      const h = mount!.clientHeight;
      renderer.setSize(w, h);
      resolution.set(renderer.domElement.width, renderer.domElement.height);
      material.uniforms.u_resolution!.value!.copy(resolution);
    };

    setSizeFromMount();
    const ro = new ResizeObserver(setSizeFromMount);
    ro.observe(mount);

    let lastFrameTime = NaN;
    const minDt = 1 / maxFps;

    function renderLoop(nowMs: number) {
      rafId = requestAnimationFrame(renderLoop);

      const elapsed = nowMs / 1000 - tStart;

      /* Match R3F useFrame: skip uniform bumps until cadence clears (smooth time). */
      if (!Number.isNaN(lastFrameTime) && elapsed - lastFrameTime < minDt) {
        renderer.render(scene, camera);
        return;
      }
      lastFrameTime = elapsed;
      material.uniforms.u_time!.value = elapsed;

      renderer.render(scene, camera);
    }

    rafId = requestAnimationFrame(renderLoop);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [source, uniformsDef, maxFps]);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 h-full min-h-0 w-full overflow-hidden"
      aria-hidden
    />
  );
}

export const CanvasRevealEffect = ({
  animationSpeed = 0.4,
  opacities = [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1],
  colors = [[0, 255, 255]],
  containerClassName,
  dotSize,
  showGradient = true,
}: {
  /**
   * 0.1 - slower
   * 1.0 - faster
   */
  animationSpeed?: number;
  opacities?: number[];
  colors?: number[][];
  containerClassName?: string;
  dotSize?: number;
  showGradient?: boolean;
}) => {
  return (
    <div className={cn("relative h-full w-full bg-transparent", containerClassName)}>
      <div className="h-full min-h-0 w-full">
        <DotMatrix
          colors={colors ?? [[0, 255, 255]]}
          dotSize={dotSize ?? 3}
          opacities={
            opacities ?? [0.3, 0.3, 0.3, 0.5, 0.5, 0.5, 0.8, 0.8, 0.8, 1]
          }
          shader={`
              float animation_speed_factor = ${animationSpeed.toFixed(1)};
              float intro_offset = distance(u_resolution / 2.0 / u_total_size, st2) * 0.01 + (random(st2) * 0.15);
              opacity *= step(intro_offset, u_time * animation_speed_factor);
              opacity *= clamp((1.0 - step(intro_offset + 0.1, u_time * animation_speed_factor)) * 1.25, 1.0, 1.25);
            `}
          center={["x", "y"]}
        />
      </div>
      {showGradient && (
        <div className="absolute inset-0 bg-gradient-to-t from-background to-[84%] dark:from-[#070b0d]" />
      )}
    </div>
  );
};

interface DotMatrixProps {
  colors?: number[][];
  opacities?: number[];
  totalSize?: number;
  dotSize?: number;
  shader?: string;
  center?: ("x" | "y")[];
}

const DotMatrix: React.FC<DotMatrixProps> = ({
  colors = [[0, 0, 0]],
  opacities = [0.04, 0.04, 0.04, 0.04, 0.04, 0.08, 0.08, 0.08, 0.08, 0.14],
  totalSize = 4,
  dotSize = 2,
  shader = "",
  center = ["x", "y"],
}) => {
  const uniforms = useMemo(() => {
    let colorsArray = [
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
      colors[0],
    ];
    if (colors.length === 2) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[1],
      ];
    } else if (colors.length === 3) {
      colorsArray = [
        colors[0],
        colors[0],
        colors[1],
        colors[1],
        colors[2],
        colors[2],
      ];
    }

    return {
      u_colors: {
        value: colorsArray.map((color) => [
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
        ]),
        type: "uniform3fv",
      },
      u_opacities: {
        value: opacities,
        type: "uniform1fv",
      },
      u_total_size: {
        value: totalSize,
        type: "uniform1f",
      },
      u_dot_size: {
        value: dotSize,
        type: "uniform1f",
      },
    };
  }, [colors, opacities, totalSize, dotSize]);

  const fragmentSource = useMemo(
    () => `
        precision mediump float;
        in vec2 fragCoord;

        uniform float u_time;
        uniform float u_opacities[10];
        uniform vec3 u_colors[6];
        uniform float u_total_size;
        uniform float u_dot_size;
        uniform vec2 u_resolution;
        out vec4 fragColor;
        float PHI = 1.61803398874989484820459;
        float random(vec2 xy) {
            return fract(tan(distance(xy * PHI, xy) * 0.5) * xy.x);
        }
        float map(float value, float min1, float max1, float min2, float max2) {
            return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
        }
        void main() {
            vec2 st = fragCoord.xy;
            ${
              center.includes("x")
                ? "st.x -= abs(floor((mod(u_resolution.x, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }
            ${
              center.includes("y")
                ? "st.y -= abs(floor((mod(u_resolution.y, u_total_size) - u_dot_size) * 0.5));"
                : ""
            }
      float opacity = step(0.0, st.x);
      opacity *= step(0.0, st.y);

      vec2 st2 = vec2(int(st.x / u_total_size), int(st.y / u_total_size));

      float frequency = 5.0;
      float show_offset = random(st2);
      float rand = random(st2 * floor((u_time / frequency) + show_offset + frequency) + 1.0);
      opacity *= u_opacities[int(rand * 10.0)];
      opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.x / u_total_size));
      opacity *= 1.0 - step(u_dot_size / u_total_size, fract(st.y / u_total_size));

      vec3 color = u_colors[int(show_offset * 6.0)];

      ${shader}

      fragColor = vec4(color, opacity);
      fragColor.rgb *= fragColor.a;
        }`,
    /* center from parent can be inline `["x","y"]`; key avoids churn when array identity differs. */
    [shader, center.join()],
  );

  return (
    <DotMatrixWebGLCanvas
      source={fragmentSource}
      uniforms={uniforms}
      maxFps={60}
    />
  );
};
