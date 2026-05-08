"use client";

import { animate, motion, useReducedMotion } from "motion/react";
import {
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

/** Same paths as `/Logos/silverui-d.svg` — mask paths use fill black to punch the hole. */
const LOGO_MASK_PATHS = (
  <>
    <path d="M136.581 28.1782C136.581 25.099 139.914 23.1745 142.581 24.7141L194.331 54.592C196.998 56.1316 196.998 59.9806 194.331 61.5202L142.581 91.3981C139.914 92.9377 136.581 91.0132 136.581 87.934L136.581 28.1782Z" />
    <path d="M79.3061 187.224C79.3061 190.303 75.9728 192.227 73.3061 190.688L21.5561 160.81C18.8894 159.27 18.8894 155.421 21.5561 153.882L73.3061 124.004C75.9728 122.464 79.3061 124.389 79.3061 127.468L79.3061 187.224Z" />
    <rect x="87.4957" y="22.8352" width="41" height="170" rx="4" />
  </>
);

const LOGO_VIEW = 216;
/** Tailwind `w-28` — mask opening matches on-screen logo for a seamless reveal. */
const LOGO_CSS_PX = 112;

const MIN_SPLASH_MS = 1100;
const PROGRESS_CAP_BEFORE_LOAD = 92;
/** E-folding time (ms) for smooth % toward cap while assets load. */
const PROGRESS_TAU_MS = 1300;

/** Shared timeline so zoom + dissolve read as one “open the cutout” moment. */
const EXIT_SYNC_MS = 1.66;
const EXIT_EASE_CUTOUT: [number, number, number, number] = [0.18, 0.9, 0.14, 1];
/** Slightly softer fade so framing dissolves while the silhouette expands. */
const EXIT_EASE_FADE: [number, number, number, number] = [0.2, 0.55, 0.35, 1];

function endCutoutScale(w: number, h: number) {
  const halfDiagonal = Math.hypot(w / 2, h / 2);
  return Math.max((halfDiagonal / 108) * 1.45, 14);
}

function maskTransform(w: number, h: number, scale: number) {
  return `translate(${w / 2}, ${h / 2}) scale(${scale}) translate(-108, -108)`;
}

type Phase = "loading" | "exiting" | "done";

type PageInitialLoaderProps = {
  children: ReactNode;
};

export function PageInitialLoader({ children }: PageInitialLoaderProps) {
  const rawId = useId().replace(/:/g, "");
  const maskId = `silver-splash-mask-${rawId}`;
  const reduceMotion = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("loading");
  const [viewport, setViewport] = useState({ w: 1920, h: 1080 });
  const [progress, setProgress] = useState(0);
  const [logoOverlayOpacity, setLogoOverlayOpacity] = useState(1);
  const [logoScaleMul, setLogoScaleMul] = useState(1);

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
    const initialCutout = LOGO_CSS_PX / LOGO_VIEW;
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
        duration: 0.62,
        delay: 0.38,
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
            <motion.div
              aria-hidden={phase !== "loading"}
              className={cn(
                "relative shrink-0 will-change-[filter]",
                phase === "exiting" && "pointer-events-none"
              )}
              style={{
                width: LOGO_CSS_PX,
                height: LOGO_CSS_PX,
              }}
              animate={{
                filter:
                  phase === "loading" && !reduceMotion
                    ? [
                        "drop-shadow(0 0 10px rgb(255 255 255 / 0.25))",
                        "drop-shadow(0 0 22px rgb(255 255 255 / 0.58))",
                        "drop-shadow(0 0 10px rgb(255 255 255 / 0.25))",
                      ]
                    : "drop-shadow(0 0 12px rgb(255 255 255 / 0.35))",
              }}
              transition={{
                duration: phase === "loading" && !reduceMotion ? 2.1 : 0.2,
                repeat: phase === "loading" && !reduceMotion ? Infinity : 0,
                ease: "easeInOut",
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
                {/* eslint-disable-next-line @next/next/no-img-element -- SVG mark; avoids next/image SVG restrictions */}
                <img
                  src="/Logos/silverui-d.svg"
                  alt=""
                  width={LOGO_VIEW}
                  height={LOGO_VIEW}
                  draggable={false}
                  fetchPriority="high"
                  className="block h-full w-full object-contain select-none"
                />
              </div>
            </motion.div>

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
  );
}
