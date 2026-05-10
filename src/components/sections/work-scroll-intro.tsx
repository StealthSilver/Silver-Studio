"use client";

import Image from "next/image";
import {
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/** Pin span — scroll distance while intro is pinned */
const PIN_SCROLL_END = "+=260%";

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

/** Full grid: one extra row above — repeats the last row of tiles so the stack reads endless while scrolling */
const WORK_GRID_SRCS = [...WORK_SRCS.slice(-3), ...WORK_SRCS];

function scheduleScrollTriggerRefresh() {
  queueMicrotask(() => {
    ScrollTrigger.refresh();
  });
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}

const REFRESH_DEBOUNCE_MS = 140;

function useDebouncedScrollTriggerRefresh() {
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
    }, REFRESH_DEBOUNCE_MS);
  }, []);
}

type WorkScrollIntroProps = {
  heading: string;
};

export function WorkScrollIntro({ heading }: WorkScrollIntroProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  /** Whole grid layer — single transform target so scrub always runs */
  const gridMotionRef = useRef<HTMLDivElement>(null);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const bumpScrollTrigger = useDebouncedScrollTriggerRefresh();

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

    const ctx = gsap.context(() => {
      gsap.set(trailEl, {
        x: () => vw() * 0.4,
        y: () => vh() * 0.36,
        opacity: 1,
      });

      gsap.set(washEl, { opacity: 1, yPercent: 4 });

      /* Start shifted up; scrub scroll moves the grid downward (taller grid → slightly more travel) */
      gsap.set(gridLayer, {
        y: () => -vh() * 0.26,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          end: PIN_SCROLL_END,
          pin: true,
          scrub: 0.45,
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

      tl.fromTo(
        gridLayer,
        { y: () => -vh() * 0.26 },
        { y: () => vh() * 0.3, duration: 1, ease: "none" },
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

    scheduleScrollTriggerRefresh();

    return () => ctx.revert();
  }, [prefersReducedMotion, words.length]);

  if (!heading.trim()) {
    return null;
  }

  if (prefersReducedMotion) {
    return (
      <div className="dark relative w-full bg-background py-16 text-foreground sm:py-20">
        <div className="mx-auto max-w-7xl px-4">
          <p className="flex max-w-5xl flex-row flex-wrap items-baseline gap-x-6 gap-y-2 text-balance text-3xl font-medium uppercase tracking-[0.18em] sm:gap-x-10 sm:text-4xl md:gap-x-14">
            {words.map((word, i) => (
              <span key={`${word}-${i}`} className="inline-block">
                {word}
              </span>
            ))}
          </p>
          <div className="mt-12 grid w-full grid-cols-2 gap-6 md:grid-cols-3 md:gap-8 lg:gap-10">
            {WORK_GRID_SRCS.map((src, i) => (
              <div
                key={`${src}-${i}`}
                className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/14 shadow-[0_10px_32px_rgb(0_0_0_/_0.35)] ring-1 ring-black/40"
              >
                <Image
                  src={src}
                  alt=""
                  fill
                  className="object-cover opacity-95 saturate-[0.95]"
                  sizes="(max-width: 768px) 45vw, 28vw"
                />
              </div>
            ))}
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
        className="dark relative flex h-[100dvh] max-h-[100dvh] w-full shrink-0 flex-col overflow-hidden bg-background text-foreground"
      >
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
          <div className="mx-auto flex h-full w-full max-w-[min(100%,96rem)] justify-center px-4 pt-[6vh] pb-[10vh] sm:px-6 sm:pt-[7vh] lg:px-10">
            <div
              ref={gridMotionRef}
              className="relative w-full will-change-transform"
            >
              <div
                className={cn(
                  "grid w-full grid-cols-2 md:grid-cols-3",
                  /* Visible gutters — bigger tiles on large screens */
                  "gap-5 sm:gap-7 md:gap-8 lg:gap-10 xl:gap-12",
                )}
              >
                {WORK_GRID_SRCS.map((src, i) => (
                  <div
                    key={`${src}-${i}`}
                    className={cn(
                      "relative overflow-hidden rounded-xl border border-white/14 shadow-[0_10px_32px_rgb(0_0_0_/_0.48)] ring-1 ring-black/45",
                      "aspect-[16/10] min-h-[132px] sm:min-h-[160px] md:min-h-[180px] lg:min-h-[200px] xl:min-h-[220px]",
                    )}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      className="object-cover opacity-[0.9] saturate-[0.95]"
                      sizes="(max-width: 640px) 46vw, (max-width: 1024px) 31vw, 28vw"
                      onLoadingComplete={bumpScrollTrigger}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          ref={washRef}
          className="pointer-events-none absolute inset-[-18%] z-[1] bg-[radial-gradient(ellipse_90%_75%_at_85%_88%,var(--hero-silver-2)_0%,transparent_55%),radial-gradient(ellipse_70%_60%_at_12%_18%,var(--hero-silver-1)_0%,transparent_52%)] opacity-70"
          aria-hidden
        />

        <div
          className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-br from-background/80 via-background/60 to-background/85"
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
                  "leading-none [text-shadow:0_2px_20px_rgb(0_0_0_/_0.65),0_0_40px_rgb(0_0_0_/_0.45)]",
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
