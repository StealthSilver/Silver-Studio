"use client";

import Image from "next/image";
import {
  forwardRef,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { scheduleScrollTriggerRefresh } from "@/lib/schedule-scroll-trigger-refresh";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pin span — scroll distance while intro stays pinned (relative to the pinned
 * block height, 100dvh).
 */
const PIN_SCROLL_END = "+=520%";

/** One full vertical tile loop completes between these document scroll ratios (0–1). */
const GRID_PAGE_SCROLL_START = 0.03;
const GRID_PAGE_SCROLL_END = 0.22;

/** Extra smoothing for pinned headline / wash (not the grid — grid follows document scroll). */
const PIN_SCRUB = 1.45;

/** Debounce before ScrollTrigger.refresh after layout shifts (reduces mid-scroll “breaks”) */
const LAYOUT_REFRESH_DEBOUNCE_MS = 380;

/** Ignore tiny strip-height jitter so cycle length stays fixed while scrolling */
const CYCLE_HEIGHT_COMMIT_DELTA_PX = 4;

/** Project previews from `public/Projects` */
const WORK_SRCS = [
  "/Projects/alcaster.png",
  "/Projects/algorhythm.png",
  "/Projects/blog.png",
  "/Projects/connectingdots.png",
  "/Projects/gamezone.png",
  "/Projects/infinityx.png",
  "/Projects/meshspire.png",
  "/Projects/mindpalace.png",
  "/Projects/riffinity.png",
  "/Projects/sgrids.png",
  "/Projects/silver-ui.png",
  "/Projects/silver.png",
  "/Projects/sketchit.png",
  "/Projects/Sol-X.png",
  "/Projects/spardha.png",
] as const;

/**
 * One vertical band of tiles — each row cycles through all project thumbnails
 * several times so a single strip is already a dense repeat pattern.
 */
const WORK_GRID_REPEATS = 6;

const WORK_GRID_PASS: string[] = Array.from(
  { length: WORK_GRID_REPEATS },
  () => [...WORK_SRCS],
).flat();

/**
 * Identical strips stacked with gap-0 — must cover viewport + max translate so the
 * repeated pattern never runs out while wrapping (more copies = safer seam).
 */
const WORK_GRID_STRIP_COPIES = 14;

/** Tile frame — matches section card borders (light) vs glassy rim (dark). */
const WORK_GRID_TILE_FRAME =
  "relative overflow-hidden rounded-xl border border-border/80 shadow-[0_10px_28px_rgb(15_23_42_/_0.08)] ring-1 ring-border/55 " +
  "aspect-[16/10] min-h-[132px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px] xl:min-h-[220px] " +
  "dark:border-white/14 dark:shadow-[0_10px_32px_rgb(0_0_0_/_0.48)] dark:ring-black/45";

const WORK_GRID_IMAGE_CLASS =
  "object-cover opacity-[0.92] saturate-[0.95] dark:opacity-[0.9]";

/** Fractional position within one vertical period H (GSAP wrap handles float edge cases). */
function wrapCycleStable(delta: number, cycle: number): number {
  if (cycle <= 1e-6) return 0;
  return gsap.utils.wrap(0, cycle, delta);
}

const WorkGridStrip = forwardRef<
  HTMLDivElement,
  { stripIndex: number; onImageLoad?: () => void }
>(function WorkGridStrip({ stripIndex, onImageLoad }, ref) {
  const ariaHidden = stripIndex > 0;

  return (
    <div
      ref={ref}
      className={cn(
        "grid w-full shrink-0 grid-cols-2 md:grid-cols-3",
        "gap-5 sm:gap-7 md:gap-8 lg:gap-10 xl:gap-12",
      )}
      aria-hidden={ariaHidden || undefined}
    >
      {WORK_GRID_PASS.map((src, i) => (
        <div
          key={`${stripIndex}-${src}-${i}`}
          className={WORK_GRID_TILE_FRAME}
        >
          <Image
            src={src}
            alt=""
            fill
            priority={stripIndex === 0 && i < 6}
            className={WORK_GRID_IMAGE_CLASS}
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 31vw, 28vw"
            onLoad={onImageLoad}
          />
        </div>
      ))}
    </div>
  );
});

function useDebouncedLayoutRefresh(delayMs: number) {
  const t = useRef<ReturnType<typeof setTimeout> | null>(null);

  useLayoutEffect(
    () => () => {
      if (t.current) clearTimeout(t.current);
    },
    [],
  );

  return useCallback(() => {
    if (t.current) clearTimeout(t.current);
    t.current = setTimeout(() => {
      t.current = null;
      scheduleScrollTriggerRefresh();
    }, delayMs);
  }, [delayMs]);
}

type WorkScrollIntroProps = {
  heading: string;
};

export function WorkScrollIntro({ heading }: WorkScrollIntroProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const gridMotionRef = useRef<HTMLDivElement>(null);
  const firstStripRef = useRef<HTMLDivElement>(null);
  /** Stable tile-strip period (px); avoids reading layout every scroll frame */
  const cyclePxRef = useRef(0);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const bumpLayoutRefresh = useDebouncedLayoutRefresh(LAYOUT_REFRESH_DEBOUNCE_MS);

  const words = useMemo(
    () => heading.trim().split(/\s+/).filter(Boolean),
    [heading],
  );

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion || words.length === 0) return;

    const pinEl = pinRef.current;
    const trailEl = trailRef.current;
    const washEl = washRef.current;
    const gridLayer = gridMotionRef.current;

    if (!pinEl || !trailEl || !washEl || !gridLayer) {
      return;
    }

    const vw = () => window.innerWidth;
    const vh = () => window.innerHeight;

    const fallbackCycle = () => vh() * 0.55;

    const cyclePx = () => {
      const c = cyclePxRef.current;
      return c > 0 ? c : fallbackCycle();
    };

    /** Only RO / layout should change this — never per scroll frame (prevents jumps mid-scroll). */
    const commitCycleHeightFromDom = () => {
      const el = firstStripRef.current;
      if (!el) return;
      const h = Math.round(el.getBoundingClientRect().height * 100) / 100;
      if (h <= 0) return;
      if (cyclePxRef.current === 0) {
        cyclePxRef.current = h;
        return;
      }
      if (Math.abs(h - cyclePxRef.current) >= CYCLE_HEIGHT_COMMIT_DELTA_PX) {
        cyclePxRef.current = h;
      }
    };

    commitCycleHeightFromDom();

    /**
     * Document scroll progress 0–1 using scrollable distance (stable math vs ratio-only APIs).
     */
    const documentScrollRatio = () => {
      const doc = document.documentElement;
      const max = Math.max(0, doc.scrollHeight - window.innerHeight);
      if (max <= 0) return 0;
      return window.scrollY / max;
    };

    /** 0–1 page scroll: prefer ScrollTrigger.progress so it stays in sync with GSAP after refresh/pin */
    const pageScrollRatio = (st?: ScrollTrigger) =>
      st?.progress ?? documentScrollRatio();

    /** 0 before GRID_PAGE_SCROLL_START, 1 after GRID_PAGE_SCROLL_END; one full loop in between */
    const gridLoopProgressFromPage = (st?: ScrollTrigger) =>
      gsap.utils.clamp(
        0,
        1,
        (pageScrollRatio(st) - GRID_PAGE_SCROLL_START) /
          (GRID_PAGE_SCROLL_END - GRID_PAGE_SCROLL_START),
      );

    const setGridY = gsap.quickSetter(gridLayer, "y", "px");

    const applyGridFromDocumentScroll = (st?: ScrollTrigger) => {
      const H = cyclePx();
      const y0 = -H * 0.26;
      const t = gridLoopProgressFromPage(st);
      const unwrapped = t * H;
      const w = wrapCycleStable(unwrapped, H);
      setGridY(y0 + w);
    };

    const ctx = gsap.context(() => {
      gsap.set(trailEl, {
        x: () => vw() * 0.4,
        y: () => vh() * 0.36,
        opacity: 1,
      });

      gsap.set(washEl, { opacity: 1, yPercent: 4 });

      applyGridFromDocumentScroll(undefined);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          end: PIN_SCROLL_END,
          pin: true,
          scrub: PIN_SCRUB,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        washEl,
        { yPercent: 6 },
        { yPercent: 12, duration: 1, ease: "none" },
        0,
      );

      tl.to(
        trailEl,
        { x: 0, y: 0, duration: 0.5, ease: "none" },
        0,
      );
      tl.to(
        trailEl,
        {
          x: () => -vw() * 0.42,
          y: () => -vh() * 0.4,
          duration: 0.5,
          ease: "none",
        },
        0.5,
      );
    }, pinEl);

    /** Full-page scroll — use ST progress (same as 0→maxScroll) so pin spacers & refresh stay coherent */
    const gridScrollTrigger = ScrollTrigger.create({
      scroller: window,
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        applyGridFromDocumentScroll(self);
      },
      onRefresh: (self) => {
        applyGridFromDocumentScroll(self);
      },
    });

    const stripEl = firstStripRef.current;
    let ro: ResizeObserver | undefined;

    if (stripEl) {
      ro = new ResizeObserver(() => {
        const prev = cyclePxRef.current;
        commitCycleHeightFromDom();
        const next = cyclePxRef.current;
        if (Math.abs(next - prev) >= CYCLE_HEIGHT_COMMIT_DELTA_PX) {
          bumpLayoutRefresh();
        }
        applyGridFromDocumentScroll(undefined);
      });
      ro.observe(stripEl);
    }

    scheduleScrollTriggerRefresh();

    return () => {
      gridScrollTrigger.kill();
      ro?.disconnect();
      ctx.revert();
    };
  }, [prefersReducedMotion, words.length, bumpLayoutRefresh]);

  if (!heading.trim()) {
    return null;
  }

  if (prefersReducedMotion) {
    return (
      <div className="relative w-full bg-[var(--work-section-canvas)] py-16 text-foreground sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="flex max-w-5xl flex-row flex-wrap items-baseline gap-x-6 gap-y-2 text-balance text-3xl font-medium uppercase tracking-[0.18em] sm:gap-x-10 sm:text-4xl md:gap-x-14">
            {words.map((word, i) => (
              <span key={`${word}-${i}`} className="inline-block">
                {word}
              </span>
            ))}
          </p>
          <div className="mt-12 flex w-full flex-col gap-0">
            <WorkGridStrip stripIndex={0} />
            <WorkGridStrip stripIndex={1} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative w-screen max-w-[100vw] shrink-0 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]"
    >
      <div
        ref={pinRef}
        className="relative flex h-[100dvh] max-h-[100dvh] w-full shrink-0 flex-col overflow-hidden bg-[var(--work-section-canvas)] text-foreground"
      >
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
          <div className="mx-auto flex h-full w-full max-w-[min(100%,96rem)] items-start justify-center px-4 pt-[6vh] pb-[10vh] sm:px-6 sm:pt-[7vh] lg:px-10">
            <div
              ref={gridMotionRef}
              className="relative flex w-full flex-col gap-0 will-change-transform [transform:translateZ(0)] [contain:layout]"
            >
              {/*
               * Same strip repeated many times (gap-0) — transform wraps every H px so
               * strip N+1 always continues strip N with identical pixels at the seam.
               */}
              {Array.from({ length: WORK_GRID_STRIP_COPIES }, (_, stripIndex) => (
                <WorkGridStrip
                  key={stripIndex}
                  ref={stripIndex === 0 ? firstStripRef : undefined}
                  stripIndex={stripIndex}
                  onImageLoad={stripIndex === 0 ? bumpLayoutRefresh : undefined}
                />
              ))}
            </div>
          </div>
        </div>

        <div
          ref={washRef}
          className="pointer-events-none absolute inset-[-18%] z-[1] bg-[radial-gradient(ellipse_90%_75%_at_85%_88%,var(--hero-silver-2)_0%,transparent_55%),radial-gradient(ellipse_70%_60%_at_12%_18%,var(--hero-silver-1)_0%,transparent_52%)] opacity-45 dark:opacity-70"
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-br from-background/78 via-background/52 to-background/82 dark:from-background/80 dark:via-background/60 dark:to-background/85"
          aria-hidden
        />

        <div className="absolute inset-0 z-[3] flex items-center justify-center">
          <h2 className="sr-only">{heading}</h2>

          <div
            ref={trailRef}
            className="mx-auto flex w-full max-w-7xl flex-row flex-wrap items-baseline justify-center gap-x-6 gap-y-3 px-4 sm:px-6 sm:gap-x-10 md:gap-x-14 lg:gap-x-[4.5rem] lg:px-8"
          >
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className={cn(
                  "inline-block shrink-0 whitespace-nowrap font-medium uppercase tracking-[0.14em] text-foreground",
                  "leading-none [text-shadow:0_1px_2px_rgb(255_255_255_/_0.95),0_0_28px_rgb(248_250_252_/_0.85)]",
                  "dark:[text-shadow:0_2px_20px_rgb(0_0_0_/_0.65),0_0_40px_rgb(0_0_0_/_0.45)]",
                  "[font-size:clamp(1.75rem,min(5.5vw,7rem),7rem)]",
                  "will-change-transform",
                )}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
