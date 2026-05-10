"use client";

import Image from "next/image";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/** Pin span — tuned for two-phase headline (into center, then out to top-left) */
const PIN_SCROLL_END = "+=220%";

const WORK_SRCS = [
  "/works/brilliant.png",
  "/works/sgrids.png",
  "/works/8thlight.png",
  "/works/harit.png",
  "/works/sol-x.png",
  "/works/meshspire.png",
] as const;

/** Larger thumbnails, fewer rows = more vertical gap; straight (no tilt) */
const PHOTO_W = 164;
const PHOTO_H = 102;
const COLLAGE_EDGE = "0";
/** Fewer images per column so spacing reads cleaner */
const PER_SIDE = 7;

type CollageItem = {
  side: "left" | "right";
  top: string;
  inset: string;
  w: number;
  h: number;
  src: (typeof WORK_SRCS)[number];
};

function buildVerticalSideCollage(): readonly CollageItem[] {
  const span = 88 / Math.max(1, PER_SIDE - 1);
  const baseTop = 4;

  const left: CollageItem[] = Array.from({ length: PER_SIDE }, (_, i) => ({
    side: "left" as const,
    top: `${baseTop + i * span}%`,
    inset: COLLAGE_EDGE,
    w: PHOTO_W,
    h: PHOTO_H,
    src: WORK_SRCS[i % WORK_SRCS.length],
  }));

  const right: CollageItem[] = Array.from({ length: PER_SIDE }, (_, i) => ({
    side: "right" as const,
    top: `${baseTop + i * span}%`,
    inset: COLLAGE_EDGE,
    w: PHOTO_W,
    h: PHOTO_H,
    src: WORK_SRCS[(i + 2) % WORK_SRCS.length],
  }));

  return [...left, ...right];
}

const COLLAGE_ITEMS = buildVerticalSideCollage();

type WorkScrollIntroProps = {
  heading: string;
};

export function WorkScrollIntro({ heading }: WorkScrollIntroProps) {
  const pinRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const washRef = useRef<HTMLDivElement>(null);
  const photoRefs = useRef<(HTMLDivElement | null)[]>([]);

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
    const photos = COLLAGE_ITEMS.map((_, i) => photoRefs.current[i]).filter(
      Boolean,
    ) as HTMLElement[];

    if (
      !pinEl ||
      !trailEl ||
      !washEl ||
      photos.length !== COLLAGE_ITEMS.length
    ) {
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

      photos.forEach((el, i) => {
        const row = i < PER_SIDE ? i : i - PER_SIDE;
        gsap.set(el, {
          x: 0,
          rotation: 0,
          y: () => -vh() * 0.2 - row * 32,
        });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          end: PIN_SCROLL_END,
          pin: true,
          scrub: 0.42,
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

      photos.forEach((el, i) => {
        const row = i < PER_SIDE ? i : i - PER_SIDE;
        tl.fromTo(
          el,
          {
            y: () => -vh() * 0.18 - row * 36,
          },
          {
            y: () => vh() * 0.34 + row * 38,
            duration: 1,
            ease: "none",
          },
          0,
        );
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
    }, pinEl);

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
          <div className="mx-auto flex h-full w-full max-w-7xl justify-center px-4 sm:px-6 lg:px-8">
            <div className="relative h-full w-full min-h-0">
              {COLLAGE_ITEMS.map((item, i) => (
                <div
                  key={`${item.src}-${i}`}
                  ref={(el) => {
                    photoRefs.current[i] = el;
                  }}
                  className="absolute will-change-transform shadow-[0_10px_32px_rgb(0_0_0_/_0.48)]"
                  style={{
                    top: item.top,
                    left: item.side === "left" ? item.inset : undefined,
                    right: item.side === "right" ? item.inset : undefined,
                    width: item.w,
                    height: item.h,
                  }}
                >
                  <div className="relative h-full w-full overflow-hidden rounded-[8px] border border-white/14 ring-1 ring-black/45">
                    <Image
                      src={item.src}
                      alt=""
                      width={item.w}
                      height={item.h}
                      className="h-full w-full object-cover opacity-[0.9] saturate-[0.95]"
                      sizes="(max-width: 768px) 36vw, 180px"
                    />
                  </div>
                </div>
              ))}
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
