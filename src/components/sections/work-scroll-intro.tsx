"use client";

import Image from "next/image";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/**
 * Pin span — scroll distance while intro stays pinned (relative to the pinned
 * block height, 100dvh).
 */
const PIN_SCROLL_END = "+=435%";

const PIN_SCRUB = 1.2;

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

/** Tile frame — matches section card borders (light) vs glassy rim (dark). */
const WORK_GRID_TILE_FRAME =
  "relative overflow-hidden rounded-2xl border border-border/80 shadow-[0_10px_28px_rgb(15_23_42_/_0.08)] ring-1 ring-border/55 " +
  "aspect-[16/10] min-h-[132px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px] xl:min-h-[220px] " +
  "dark:border-white/14 dark:shadow-[0_10px_32px_rgb(0_0_0_/_0.48)] dark:ring-black/45";

const WORK_GRID_IMAGE_CLASS =
  "object-cover opacity-[0.92] saturate-[0.95] dark:opacity-[0.9]";

const ROW_GAP =
  "gap-5 sm:gap-7 md:gap-8 lg:gap-10 xl:gap-12" as const;

function chunkIntoRows<T>(items: readonly T[], perRow: number): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < items.length; i += perRow) {
    rows.push(items.slice(i, i + perRow) as T[]);
  }
  return rows;
}

const WORK_GRID_ROWS = chunkIntoRows(WORK_GRID_PASS, 3);

/** How many identical row cycles are stacked (≥3 avoids gaps during long translateY). */
const GRID_VERTICAL_STACK = 5;

/**
 * Fraction of full stack span traveled while pinned — lower = much slower drift for the same scroll.
 */
const GRID_SCROLL_DISTANCE_RATIO = 0.16;

/** One vertical tiling unit of `WORK_GRID_ROWS` (same pattern repeated underneath). */
function WorkGridStrip({
  stripIndex,
  duplicateIndex,
}: {
  stripIndex: number;
  duplicateIndex?: number;
}) {
  const dup = duplicateIndex ?? 0;
  const ariaHidden = stripIndex > 0 || dup > 0;

  return (
    <div
      className={cn(
        "work-grid-cycle flex w-full shrink-0 flex-col",
        ROW_GAP,
      )}
      aria-hidden={ariaHidden || undefined}
    >
      {WORK_GRID_ROWS.map((row, rowIndex) => (
        <div
          key={`${stripIndex}-d${dup}-row-${rowIndex}`}
          className={cn("flex w-full min-w-0", ROW_GAP)}
        >
          {row.map((src, colIndex) => {
            const flatIndex = rowIndex * 3 + colIndex;
            return (
              <div
                key={`${stripIndex}-d${dup}-r${rowIndex}-c${colIndex}-${src}`}
                className={cn(
                  WORK_GRID_TILE_FRAME,
                  "min-w-0 flex-1 basis-0",
                )}
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  priority={stripIndex === 0 && dup === 0 && flatIndex < 6}
                  className={WORK_GRID_IMAGE_CLASS}
                  sizes="(max-width: 640px) 31vw, 28vw"
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

type WorkScrollIntroProps = {
  heading: string;
};

export function WorkScrollIntro({ heading }: WorkScrollIntroProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const gridMoverRef = useRef<HTMLDivElement>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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
    const gridMoverEl = gridMoverRef.current;

    if (!pinEl || !trailEl || !washEl || !gridMoverEl) {
      return;
    }

    const vw = () => window.innerWidth;
    const vh = () => window.innerHeight;

    const ctx = gsap.context(() => {
      gsap.set(trailEl, {
        x: () => vw() * 0.4,
        y: () => vh() * 0.36,
        opacity: 1,
      });

      gsap.set(washEl, { opacity: 1, yPercent: 4 });

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

      /**
       * Vertical stride between two stacked cycles (one pattern repeat, incl. flex gap).
       * Scrub y from negative → 0 so the clip always shows tiles above the first row
       * (positive y → empty band at top). Identical cycles make the motion read as infinite.
       */
      const cycleStridePx = (): number => {
        const cycles = pinEl.querySelectorAll(".work-grid-cycle");
        if (cycles.length < 2) {
          const one = cycles[0] as HTMLElement | undefined;
          return one?.offsetHeight ?? 0;
        }
        const a = cycles[0] as HTMLElement;
        const b = cycles[1] as HTMLElement;
        return b.offsetTop - a.offsetTop;
      };

      const gridScrollSpan = (): number => {
        const stride = cycleStridePx();
        const full = stride > 0 ? stride * (GRID_VERTICAL_STACK - 1) : 0;
        return full * GRID_SCROLL_DISTANCE_RATIO;
      };

      gsap.set(gridMoverEl, {
        y: () => -gridScrollSpan(),
      });

      tl.fromTo(
        gridMoverEl,
        { y: () => -gridScrollSpan() },
        { y: 0, duration: 1, ease: "none" },
        0,
      );
    }, pinEl);

    return () => {
      ctx.revert();
    };
  }, [prefersReducedMotion, words.length]);

  if (!heading.trim()) {
    return null;
  }

  if (prefersReducedMotion) {
    return (
      <div className="relative ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] w-screen max-w-[100vw] shrink-0 bg-[var(--work-section-canvas)] py-16 text-foreground sm:py-20">
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
            <WorkGridStrip stripIndex={0} duplicateIndex={1} />
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
            <div className="relative flex w-full min-h-0 flex-col overflow-hidden [contain:layout]">
              <div
                ref={gridMoverRef}
                className={cn("flex w-full flex-col", ROW_GAP, "[contain:layout]")}
              >
                {Array.from({ length: GRID_VERTICAL_STACK }, (_, dup) => (
                  <WorkGridStrip
                    key={`grid-stack-${dup}`}
                    stripIndex={0}
                    duplicateIndex={dup}
                  />
                ))}
              </div>
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
