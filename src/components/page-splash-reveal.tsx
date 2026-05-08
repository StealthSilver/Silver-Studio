"use client";

import {
  createContext,
  type CSSProperties,
  type ReactNode,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/lib/utils";

/** Match loader white mark + mask geometry (`silverui-d.svg` viewBox). */
export const SPLASH_LOGO_VIEWBOX = 216;
/** On-screen splash logo size (`w-28`) aligned with SVG mask gate. */
export const SPLASH_LOGO_CSS_PX = 112;
export const SPLASH_LOGO_MARK_MASK_URL = "/Logos/silverui-d.svg";

export function splashInitialCutoutScale(): number {
  return SPLASH_LOGO_CSS_PX / SPLASH_LOGO_VIEWBOX;
}

/**
 * Smallest SVG mask scale `s` so a viewport-centered silhouette square (~viewBox × s px)
 * fully covers viewport width/height edges (approx. full bleed + margin).
 */
export function splashViewportMinCutoutScale(viewportW: number, viewportH: number) {
  const half = Math.hypot(viewportW / 2, viewportH / 2);
  return ((2 * half) * 1.12) / SPLASH_LOGO_VIEWBOX;
}

export type PageSplashPhase = "loading" | "exiting" | "done";

export type PageSplashRevealValue = {
  phase: PageSplashPhase;
  /** Normalized zoom along cutout scale: 0 = start-sized hole, 1 = full bleed; null when idle. */
  exitZoomLinear: number | null;
  /** SVG mask group scale `s` (same as loader cutout); null when idle. */
  exitCutoutScale: number | null;
};

export const PageSplashRevealContext = createContext<PageSplashRevealValue>({
  phase: "done",
  exitZoomLinear: null,
  exitCutoutScale: null,
});

export function usePageSplashReveal() {
  return useContext(PageSplashRevealContext);
}

const HERO_GATE = 0.7;

/** Fades from “empty hole” (0→70%) → “faded hero” (≥70%) → full clarity by 100%. */
export function splashHeroRevealLayers(exitZoom: number | null) {
  if (exitZoom == null) return { heroStrength: 1, blackout: 0 };

  if (exitZoom < HERO_GATE) return { heroStrength: 0, blackout: 1 };

  const u = Math.min(1, Math.max(0, (exitZoom - HERO_GATE) / (1 - HERO_GATE)));
  const ease = u * u * (3 - 2 * u);
  const heroStrength = 0.36 + 0.64 * ease;
  const blackout = 0.58 * (1 - ease);

  return { heroStrength, blackout };
}

function splashHeroLogoMaskStyles(args: {
  phase: PageSplashPhase;
  exitCutoutScale: number | null;
  /** Top-left of hero root in viewport coords. */
  snap: { left: number; top: number } | null;
  viewport: { w: number; h: number };
}): CSSProperties | undefined {
  const { phase, exitCutoutScale: s, snap, viewport: vp } = args;
  if (phase !== "exiting" || s == null || snap == null) return undefined;

  const maskSizePx = s * SPLASH_LOGO_VIEWBOX;

  const x = vp.w / 2 - snap.left - maskSizePx / 2;
  const y = vp.h / 2 - snap.top - maskSizePx / 2;

  return {
    WebkitMaskImage: `url(${SPLASH_LOGO_MARK_MASK_URL})`,
    maskImage: `url(${SPLASH_LOGO_MARK_MASK_URL})`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: `${maskSizePx}px ${maskSizePx}px`,
    maskSize: `${maskSizePx}px ${maskSizePx}px`,
    WebkitMaskPosition: `${x}px ${y}px`,
    maskPosition: `${x}px ${y}px`,
  };
}

/** Clips hero to the same logo silhouette as the loader and pins it to the viewport centre. */
export function SplashHeroReveal({ children }: { children: ReactNode }) {
  const { phase, exitZoomLinear, exitCutoutScale } = usePageSplashReveal();
  const rootRef = useRef<HTMLDivElement>(null);
  const [snap, setSnap] = useState<{ left: number; top: number } | null>(
    null,
  );
  const [viewport, setViewport] = useState({ w: 1920, h: 1080 });

  useEffect(() => {
    function readViewport() {
      setViewport({
        w: window.innerWidth,
        h: window.innerHeight,
      });
    }
    readViewport();
    window.addEventListener("resize", readViewport);
    return () => window.removeEventListener("resize", readViewport);
  }, []);

  useLayoutEffect(() => {
    if (phase !== "exiting") {
      setSnap(null);
      return;
    }
    const el = rootRef.current;
    if (!el) return;

    function snapshot() {
      const r = rootRef.current?.getBoundingClientRect();
      if (!r) return;
      setSnap((prev) =>
        prev && prev.left === r.left && prev.top === r.top
          ? prev
          : { left: r.left, top: r.top },
      );
    }

    snapshot();
    window.addEventListener("resize", snapshot);
    window.addEventListener("scroll", snapshot, true);
    const ro = new ResizeObserver(snapshot);
    ro.observe(el);

    return () => {
      window.removeEventListener("resize", snapshot);
      window.removeEventListener("scroll", snapshot, true);
      ro.disconnect();
    };
  }, [phase]);

  const { heroStrength, blackout } = useMemo(
    () => splashHeroRevealLayers(exitZoomLinear),
    [exitZoomLinear],
  );

  const maskStyle = useMemo(
    () =>
      splashHeroLogoMaskStyles({
        phase,
        exitCutoutScale,
        snap,
        viewport,
      }),
    [phase, exitCutoutScale, snap, viewport],
  );

  const veilOn = phase === "exiting" && blackout > 0.004;

  return (
    <div
      ref={rootRef}
      className={cn("relative isolate", maskStyle && "motion-safe:[contain:paint]")}
      style={maskStyle}
    >
      <div style={{ opacity: heroStrength }} className="min-w-0">
        {children}
      </div>
      {veilOn && (
        <div
          className="pointer-events-none absolute inset-0 bg-black"
          aria-hidden
          style={{ opacity: blackout }}
        />
      )}
    </div>
  );
}
