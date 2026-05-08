"use client";

import { animate, motion, useReducedMotion } from "motion/react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";
import {
  PageSplashRevealContext,
  type PageSplashPhase,
  SPLASH_LOGO_CSS_PX,
  splashInitialCutoutScale,
  splashViewportMinCutoutScale,
} from "@/components/page-splash-reveal";

/** Geometry from `/Logos/silverui-d.svg` — shared by mask + on-screen mark. */
const PATH_D_RIGHT = "M136.581 28.1782C136.581 25.099 139.914 23.1745 142.581 24.7141L194.331 54.592C196.998 56.1316 196.998 59.9806 194.331 61.5202L142.581 91.3981C139.914 92.9377 136.581 91.0132 136.581 87.934L136.581 28.1782Z";
const PATH_D_LEFT = "M79.3061 187.224C79.3061 190.303 75.9728 192.227 73.3061 190.688L21.5561 160.81C18.8894 159.27 18.8894 155.421 21.5561 153.882L73.3061 124.004C75.9728 122.464 79.3061 124.389 79.3061 127.468L79.3061 187.224Z";
const RECT_BAR = { x: 87.4957, y: 22.8352, w: 41, h: 170, rx: 4 } as const;

/** Mask paths use fill black to punch the hole. */
const LOGO_MASK_PATHS = (
  <>
    <path d={PATH_D_RIGHT} />
    <path d={PATH_D_LEFT} />
    <rect x={RECT_BAR.x} y={RECT_BAR.y} width={RECT_BAR.w} height={RECT_BAR.h} rx={RECT_BAR.rx} />
  </>
);

const TRACE_DURATION = 2.75;
/** Short dash orbits each closed edge (`pathLength={1}`). */
const TRACE_DASH = "0.1 0.9";

function LoaderLogoSvg({ traceOutline }: { traceOutline: boolean }) {
  return (
    <svg
      viewBox="0 0 216 216"
      className="block size-full select-none"
      aria-hidden
    >
      <g fill="white">
        <path d={PATH_D_RIGHT} />
        <path d={PATH_D_LEFT} />
        <rect
          x={RECT_BAR.x}
          y={RECT_BAR.y}
          width={RECT_BAR.w}
          height={RECT_BAR.h}
          rx={RECT_BAR.rx}
        />
      </g>
      {traceOutline && (
        <g
          fill="none"
          stroke="rgb(252 252 254)"
          strokeWidth={2.25}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="will-change-[stroke-dashoffset]"
        >
          <motion.path
            d={PATH_D_RIGHT}
            pathLength={1}
            vectorEffect="nonScalingStroke"
            style={{ strokeDasharray: TRACE_DASH }}
            animate={{ strokeDashoffset: [0, -1] }}
            transition={{
              duration: TRACE_DURATION,
              repeat: Infinity,
              ease: "linear",
              delay: 0,
            }}
          />
          <motion.path
            d={PATH_D_LEFT}
            pathLength={1}
            vectorEffect="nonScalingStroke"
            style={{ strokeDasharray: TRACE_DASH }}
            animate={{ strokeDashoffset: [0, -1] }}
            transition={{
              duration: TRACE_DURATION,
              repeat: Infinity,
              ease: "linear",
              delay: -TRACE_DURATION / 3,
            }}
          />
          <motion.rect
            x={RECT_BAR.x}
            y={RECT_BAR.y}
            width={RECT_BAR.w}
            height={RECT_BAR.h}
            rx={RECT_BAR.rx}
            pathLength={1}
            vectorEffect="nonScalingStroke"
            style={{ strokeDasharray: TRACE_DASH }}
            animate={{ strokeDashoffset: [0, -1] }}
            transition={{
              duration: TRACE_DURATION,
              repeat: Infinity,
              ease: "linear",
              delay: (-2 * TRACE_DURATION) / 3,
            }}
          />
        </g>
      )}
    </svg>
  );
}

const MIN_SPLASH_MS = 1100;
const PROGRESS_CAP_BEFORE_LOAD = 92;
/** E-folding time (ms) for smooth % toward cap while assets load. */
const PROGRESS_TAU_MS = 1300;

/** Longer exit so the mark keeps opening until the page is fully revealed. */
const EXIT_SYNC_MS = 2.38;
const EXIT_EASE_CUTOUT: [number, number, number, number] = [0.16, 0.92, 0.12, 1];
/** Slightly softer fade so framing dissolves while the silhouette expands. */
const EXIT_EASE_FADE: [number, number, number, number] = [0.2, 0.55, 0.35, 1];

function endCutoutScale(w: number, h: number) {
  const viewportCover = splashViewportMinCutoutScale(w, h);
  const halfDiagonal = Math.hypot(w / 2, h / 2);
  const diagonalPull = (halfDiagonal / 108) * 1.78;
  return Math.max(viewportCover, diagonalPull, 18);
}

function maskTransform(w: number, h: number, scale: number) {
  return `translate(${w / 2}, ${h / 2}) scale(${scale}) translate(-108, -108)`;
}

type PageInitialLoaderProps = {
  children: ReactNode;
};

export function PageInitialLoader({ children }: PageInitialLoaderProps) {
  const rawId = useId().replace(/:/g, "");
  const maskId = `silver-splash-mask-${rawId}`;
  const reduceMotion = useReducedMotion();

  const [phase, setPhase] = useState<PageSplashPhase>("loading");
  const [viewport, setViewport] = useState({ w: 1920, h: 1080 });
  const [progress, setProgress] = useState(0);
  const [logoOverlayOpacity, setLogoOverlayOpacity] = useState(1);
  const [logoScaleMul, setLogoScaleMul] = useState(1);
  const [exitZoomLinear, setExitZoomLinear] = useState<number | null>(null);
  const [exitCutoutScale, setExitCutoutScale] = useState<number | null>(null);

  const loadDoneRef = useRef(false);
  const minElapsedRef = useRef(false);
  const exitStartedRef = useRef(false);
  const progressRef = useRef(0);
  const exitControlsRef = useRef<{ stop: () => void }[]>([]);
  const maskGRef = useRef<SVGGElement>(null);
  const maskRectRef = useRef<SVGRectElement>(null);

  useLayoutEffect(() => {
    const read = () =>
      setViewport({ w: window.innerWidth, h: window.innerHeight });
    read();
    window.addEventListener("resize", read);
    return () => window.removeEventListener("resize", read);
  }, []);

  useEffect(() => {
    progressRef.current = progress;
  }, [progress]);

  useLayoutEffect(() => {
    if (phase === "loading" || phase === "done") {
      setExitZoomLinear(null);
      setExitCutoutScale(null);
    } else if (phase === "exiting") {
      const ic = splashInitialCutoutScale();
      setExitZoomLinear(0);
      setExitCutoutScale(ic);
    }
  }, [phase]);

  const splashRevealValue = useMemo(
    () => ({
      phase,
      exitZoomLinear,
      exitCutoutScale,
    }),
    [phase, exitCutoutScale, exitZoomLinear],
  );

  const killExitAnimations = useCallback(() => {
    exitControlsRef.current.forEach((c) => c.stop());
    exitControlsRef.current = [];
  }, []);

  const tryFinishLoading = useCallback(() => {
    if (!loadDoneRef.current || !minElapsedRef.current || exitStartedRef.current) {
      return;
    }

    exitStartedRef.current = true;

    if (reduceMotion) {
      setLogoOverlayOpacity(0);
      setLogoScaleMul(1);
      setProgress(100);
      setPhase("done");
      return;
    }

    setPhase("exiting");
  }, [reduceMotion]);

  useEffect(() => {
    return () => killExitAnimations();
  }, [killExitAnimations]);

  /** Imperative SVG mask updates every frame → no React re-render jank during zoom. */
  useLayoutEffect(() => {
    if (phase !== "exiting") {
      return;
    }

    const vw = viewport.w;
    const vh = viewport.h;
    const gEl = maskGRef.current;
    const rectEl = maskRectRef.current;
    const initialCutout = splashInitialCutoutScale();
    const endScale = endCutoutScale(vw, vh);
    const p0 = progressRef.current;
    let cancelled = false;

    killExitAnimations();
    gEl?.setAttribute("transform", maskTransform(vw, vh, initialCutout));
    rectEl?.setAttribute("fill-opacity", "1");

    const ctrls: { stop: () => void }[] = [];
    let cutoutEnded = false;
    let fadeEnded = false;

    function tryRevealDone() {
      if (!cancelled && cutoutEnded && fadeEnded) {
        setExitZoomLinear(null);
        setExitCutoutScale(null);
        setPhase("done");
      }
    }

    ctrls.push(
      animate(p0, 100, {
        duration: 0.42,
        ease: [0.33, 1, 0.68, 1],
        onUpdate: (v) => {
          if (!cancelled) setProgress(Number(v.toFixed(4)));
        },
      })
    );

    ctrls.push(
      animate(initialCutout, endScale, {
        duration: EXIT_SYNC_MS,
        ease: EXIT_EASE_CUTOUT,
        onUpdate: (v) => {
          const s = Number(v.toPrecision(14));
          gEl?.setAttribute("transform", maskTransform(vw, vh, s));
          const span = endScale - initialCutout;
          const linear =
            span > 0
              ? Math.min(1, Math.max(0, (s - initialCutout) / span))
              : 1;
          if (!cancelled) {
            setExitZoomLinear(linear);
            setExitCutoutScale(s);
          }
        },
        onComplete: () => {
          cutoutEnded = true;
          tryRevealDone();
        },
      })
    );

    ctrls.push(
      animate(1, 0, {
        duration: EXIT_SYNC_MS,
        delay: 0,
        ease: EXIT_EASE_FADE,
        onUpdate: (o) => {
          rectEl?.setAttribute("fill-opacity", String(Number(o.toPrecision(4))));
        },
        onComplete: () => {
          fadeEnded = true;
          tryRevealDone();
        },
      })
    );

    ctrls.push(
      animate(1, endScale / initialCutout, {
        duration: EXIT_SYNC_MS,
        ease: EXIT_EASE_CUTOUT,
        onUpdate: (v) => {
          if (!cancelled) setLogoScaleMul(Number(v.toPrecision(8)));
        },
      })
    );

    ctrls.push(
      animate(1, 0, {
        duration: 0.82,
        delay: 0.52,
        ease: [0.4, 0, 0.2, 1],
        onUpdate: (v) => {
          if (!cancelled) setLogoOverlayOpacity(Number(v.toPrecision(4)));
        },
      })
    );

    exitControlsRef.current = ctrls;

    return () => {
      cancelled = true;
      killExitAnimations();
    };
  }, [phase, viewport.w, viewport.h, killExitAnimations]);

  /** Reset mask DOM while loading so first paint stays a solid black field. */
  useLayoutEffect(() => {
    if (phase !== "loading") return;
    const { w, h } = viewport;
    maskGRef.current?.setAttribute("transform", maskTransform(w, h, 0));
    maskRectRef.current?.setAttribute("fill-opacity", "1");
  }, [phase, viewport.w, viewport.h]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      minElapsedRef.current = true;
      tryFinishLoading();
    }, MIN_SPLASH_MS);

    const onLoad = () => {
      loadDoneRef.current = true;
      tryFinishLoading();
    };

    if (document.readyState === "complete") {
      queueMicrotask(onLoad);
    } else {
      window.addEventListener("load", onLoad);
    }

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("load", onLoad);
    };
  }, [tryFinishLoading]);

  /** Monotone % tied to elapsed time — bar width matches aria value (no CSS width transition). */
  useEffect(() => {
    if (phase !== "loading") return;
    const start = performance.now();
    let raf = 0;

    function tick(now: number) {
      const elapsed = now - start;
      const target =
        PROGRESS_CAP_BEFORE_LOAD *
        (1 - Math.exp(-elapsed / PROGRESS_TAU_MS));
      setProgress((prev) => Math.max(prev, Math.min(PROGRESS_CAP_BEFORE_LOAD, target)));
      raf = window.requestAnimationFrame(tick);
    }

    raf = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(raf);
  }, [phase]);

  useEffect(() => {
    if (phase !== "done") return;
    document.documentElement.removeAttribute("data-splash-loading");
    document.body.style.overflow = "";
    return undefined;
  }, [phase]);

  useEffect(() => {
    document.documentElement.setAttribute("data-splash-loading", "");
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.removeAttribute("data-splash-loading");
      document.body.style.overflow = "";
    };
  }, []);

  const showOverlay = phase !== "done";
  const contentVisible = phase === "exiting" || phase === "done";

  return (
    <PageSplashRevealContext.Provider value={splashRevealValue}>
      <>
      <div
        className={cn(
          "relative min-h-0 flex-1",
          !contentVisible && "invisible"
        )}
        aria-hidden={!contentVisible}
      >
        {children}
      </div>

      {showOverlay && (
        <div
          className="fixed inset-0 z-[2147483000] pointer-events-auto"
          aria-busy
          aria-live="polite"
          aria-label="Loading Silver Studios"
        >
          <svg
            className="absolute inset-0 block h-full w-full"
            width={viewport.w}
            height={viewport.h}
            aria-hidden
          >
            <defs>
              <mask
                id={maskId}
                maskUnits="userSpaceOnUse"
                x={0}
                y={0}
                width={viewport.w}
                height={viewport.h}
              >
                <rect width={viewport.w} height={viewport.h} fill="white" />
                <g ref={maskGRef} fill="black">
                  {LOGO_MASK_PATHS}
                </g>
              </mask>
            </defs>
            <rect
              ref={maskRectRef}
              width={viewport.w}
              height={viewport.h}
              fill="#000000"
              mask={`url(#${maskId})`}
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 pb-[18vh]">
            <div
              aria-hidden={phase !== "loading"}
              className={cn(
                "relative shrink-0",
                phase === "exiting" && "pointer-events-none"
              )}
              style={{
                width: SPLASH_LOGO_CSS_PX,
                height: SPLASH_LOGO_CSS_PX,
              }}
            >
              <div
                className="h-full w-full will-change-[transform,opacity]"
                style={{
                  opacity: logoOverlayOpacity,
                  transform: `scale(${logoScaleMul})`,
                  transformOrigin: "center center",
                }}
              >
                <LoaderLogoSvg
                  traceOutline={phase === "loading" && !reduceMotion}
                />
              </div>
            </div>

            {phase === "loading" && (
              <div className="mt-10 flex w-[min(18rem,calc(100vw-3rem))] flex-col items-center">
                <div
                  className="h-1 w-full overflow-hidden rounded-full bg-white/15"
                  role="progressbar"
                  aria-valuenow={Math.round(progress)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  {/* No transition — width stays locked to the same value as % text */}
                  <div
                    className="h-full rounded-full bg-white"
                    style={{
                      width: `${Math.min(100, Math.max(0, progress))}%`,
                    }}
                  />
                </div>
                <p className="mt-3 font-mono text-sm tabular-nums text-white/70">
                  {Math.round(Math.min(100, Math.max(0, progress)))}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      </>
    </PageSplashRevealContext.Provider>
  );
}
