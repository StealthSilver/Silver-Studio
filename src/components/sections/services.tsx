"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { servicesSection } from "@/data/site";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const TILES = [
  { num: "01", label: "LANDING PAGES" },
  { num: "02", label: "DESIGN SYSTEMS" },
  { num: "03", label: "FRONTEND DEVELOPMENT" },
  { num: "04", label: "BRANDING" },
] as const;

/** Timeline: wash layer fades in; tiles begin mid-ramp */
const DARK_PHASE_END = 0.36;
const TILE_PHASE_START = 0.2;
const TILE_SEGMENT = 0.115;

/** Scroll distance while pinned — higher = slower scrub through the same timeline */
const PIN_SCROLL_END = "+=220%";

/**
 * First segment of the pinned timeline: user scrolls with the rule + heading fixed,
 * before tile / wash animation begins.
 */
const INTRO_SCROLL_HOLD = 0.16;

/** Extra timeline after last tile lands so all four stay on screen before unpin */
const HOLD_AFTER_LAST_TILE = 0.42;

const lastTileAnimEnd =
  TILE_PHASE_START + TILES.length * TILE_SEGMENT;

/** Vertical cascade only; horizontal spacing uses `--tile-step` (80% of tile width ≈ 20% overlap). */
const TILE_TOP = [
  "top-[8%] lg:top-[9%]",
  "top-[calc(8%+2.25rem)] lg:top-[calc(9%+3.2rem)]",
  "top-[calc(8%+4.5rem)] lg:top-[calc(9%+6.4rem)]",
  "top-[calc(8%+6.75rem)] lg:top-[calc(9%+9.6rem)]",
] as const;

/** Tile stack: ~20% horizontal overlap on lg (`step = 0.8 * width`); tighter tiles & stride on small screens so four tiles fit. */
const TILE_STACK_VARS =
  "[contain:inline-size] [--tile-w:min(34vw,9rem)] [--tile-step:calc(var(--tile-w)*0.45)] sm:[--tile-w:min(42vw,11rem)] sm:[--tile-step:calc(var(--tile-w)*0.55)] lg:[--tile-w:min(32vw,min(19rem,300px))] lg:[--tile-step:calc(var(--tile-w)*0.8)]";

const GLASS_TILE_BASE =
  "cursor-default rounded-[6px] backdrop-blur-[28px] backdrop-saturate-[0.65] transition-[border-color,box-shadow,filter] duration-200 ease-out " +
  "bg-gradient-to-br from-card/92 via-card/70 to-secondary/85 " +
  "shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.95),0_18px_40px_rgb(15_23_42_/_0.06),0_2px_8px_rgb(15_23_42_/_0.04)] " +
  "dark:from-card/92 dark:via-muted/82 dark:to-background/94 " +
  "dark:shadow-[inset_0_1px_0_0_rgb(255_255_255_/_0.12),0_24px_48px_rgb(0_0_0_/_0.35)]";

const TILE_BORDER_REST =
  "border-[3px] border-border/80 dark:border-border/85";

const TILE_BORDER_HOVER =
  "border-[3px] border-border shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.92),0_26px_52px_rgb(15_23_42_/_0.08)] brightness-[1.02] " +
  "dark:border-ring/65 dark:shadow-[inset_0_0_0_1px_rgb(255_255_255_/_0.14),0_28px_56px_rgb(0_0_0_/_0.55)] dark:brightness-[1.04]";

/** Light: no section fill (page background shows). Dark: near-black wash. */
const SERVICES_BACKDROP = "bg-transparent dark:bg-background";

/** Pinned section backdrop: scrubs in with ScrollTrigger */
const SECTION_WASH =
  "pointer-events-none absolute inset-0 z-[1] rounded-none " + SERVICES_BACKDROP;

const HOVER_Z = 90;

/** Break out of `main` max-width so rules span the viewport (same pattern as work-scroll-intro). */
const FULL_BLEED_ROW =
  "relative w-screen max-w-[100vw] shrink-0 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]";

const SERVICES_HEADING_CLASS =
  "text-left text-2xl font-normal uppercase leading-[1.08] tracking-[0.06em] text-foreground sm:text-3xl md:text-4xl lg:text-[2.75rem]";

function ServicesTopRule() {
  return (
    <div className={FULL_BLEED_ROW}>
      <div className="border-t border-border/70 dark:border-border/50" aria-hidden />
    </div>
  );
}

function ServicesBottomRule() {
  return (
    <div className={FULL_BLEED_ROW}>
      <div className="border-b border-border/70 dark:border-border/50" aria-hidden />
    </div>
  );
}

function ServicesHeading({ headingId }: { headingId: string }) {
  return (
    <div className="flex w-full justify-center px-4 pt-[4.25rem] pb-6 sm:px-6 sm:pt-20 sm:pb-8 lg:px-8 lg:pt-24">
      <div className="flex w-full max-w-7xl items-start justify-between gap-6">
        <div className="min-w-0 max-w-[min(100%,44rem)] pr-2">
          <h2 id={headingId} className={SERVICES_HEADING_CLASS}>
            SERVICES WE PROVIDE
          </h2>
        </div>
      </div>
    </div>
  );
}

/** Spacing after Work — scrolls away before the rule pins at the top of the viewport. */
function ServicesPrePinSpacer() {
  return (
    <div
      className="h-10 shrink-0 sm:h-14 lg:h-16"
      aria-hidden
    />
  );
}

function ServicesSectionIntro({ headingId }: { headingId: string }) {
  return (
    <>
      <ServicesTopRule />
      <ServicesHeading headingId={headingId} />
    </>
  );
}

export function Services() {
  const { id } = servicesSection;
  const pinRef = useRef<HTMLDivElement>(null);
  const darkRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLElement | null)[]>([]);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [hoveredTile, setHoveredTile] = useState<number | null>(null);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setPrefersReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useLayoutEffect(() => {
    if (prefersReducedMotion) return;

    const pinEl = pinRef.current;
    const darkEl = darkRef.current;
    const tiles = tileRefs.current.filter(Boolean) as HTMLElement[];
    if (!pinEl || !darkEl || tiles.length !== TILES.length) return;

    const ctx = gsap.context(() => {
      const t0 = INTRO_SCROLL_HOLD;

      gsap.set(darkEl, { opacity: 0 });
      tiles.forEach((el) => {
        gsap.set(el, { opacity: 0, y: 56 });
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinEl,
          start: "top top",
          end: PIN_SCROLL_END,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.fromTo(
        darkEl,
        { opacity: 0 },
        { opacity: 0, duration: t0, ease: "none" },
        0,
      );

      tl.fromTo(
        darkEl,
        { opacity: 0 },
        { opacity: 1, duration: DARK_PHASE_END, ease: "none" },
        t0,
      );

      TILES.forEach((_, i) => {
        tl.fromTo(
          tiles[i],
          { opacity: 0, y: 56 },
          {
            opacity: 1,
            y: 0,
            duration: TILE_SEGMENT,
            ease: "none",
          },
          t0 + TILE_PHASE_START + i * TILE_SEGMENT,
        );
      });

      tl.to(
        darkEl,
        { opacity: 1, duration: HOLD_AFTER_LAST_TILE, ease: "none" },
        t0 + lastTileAnimEnd,
      );
    }, pinEl);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  const tilesMarkup = TILES.map((tile, index) => {
    const isHover = hoveredTile === index;
    const stackZ = 10 + index;
    const z = isHover ? HOVER_Z : stackZ;

    return (
      <article
        key={tile.num}
        ref={(el) => {
          tileRefs.current[index] = el;
        }}
        className={cn(
          "flex flex-col justify-end",
          prefersReducedMotion
            ? "relative left-auto top-auto mx-auto mb-6 aspect-[3/4] w-full max-w-[min(100%,17rem)] opacity-100 last:mb-0 sm:mb-8 sm:max-w-[18rem]"
            : ["absolute aspect-[3/4] w-[var(--tile-w)] max-w-none", TILE_TOP[index]].join(
                " ",
              ),
          GLASS_TILE_BASE,
          isHover ? TILE_BORDER_HOVER : TILE_BORDER_REST,
        )}
        style={
          prefersReducedMotion
            ? {
                zIndex: z,
              }
            : {
                left: `calc(min(1.25rem, 5%) + ${index} * var(--tile-step))`,
                zIndex: z,
              }
        }
        onMouseEnter={() => setHoveredTile(index)}
        onMouseLeave={() => setHoveredTile(null)}
      >
        <CardSpotlight
          className={
            prefersReducedMotion
              ? "flex h-full w-full flex-col justify-end"
              : "absolute inset-0 flex min-h-0 flex-col justify-end"
          }
          disableRevealCanvas
        >
          <div className="flex flex-col gap-1 px-5 pb-5 pt-6 sm:gap-1.5 sm:px-7 sm:pb-6 sm:pt-8">
            <p
              className={cn(
                "font-normal leading-none tracking-tight text-foreground",
                "text-[clamp(2.75rem,10vw,4.5rem)]",
              )}
            >
              {tile.num}
            </p>
            <p className="max-w-[95%] text-[11px] font-normal uppercase leading-snug tracking-[0.14em] text-muted-foreground sm:text-xs">
              {tile.label}
            </p>
          </div>
        </CardSpotlight>
      </article>
    );
  });

  const headingId = `${id}-heading`;

  if (prefersReducedMotion) {
    return (
      <section
        id={id}
        aria-labelledby={headingId}
        className="mx-auto w-full max-w-7xl scroll-mt-28 sm:scroll-mt-32"
      >
        <ServicesPrePinSpacer />
        <ServicesSectionIntro headingId={headingId} />
        <div
          className={cn(
            "relative flex min-h-[100vh] w-full flex-col items-center justify-center px-4 pb-16 pt-0 sm:px-6 lg:px-8",
            SERVICES_BACKDROP,
          )}
        >
          <div className="relative flex w-full max-w-3xl flex-col">{tilesMarkup}</div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="mx-auto w-full max-w-7xl scroll-mt-28 sm:scroll-mt-32"
    >
      <ServicesPrePinSpacer />
      <div
        ref={pinRef}
        className="relative flex w-full max-w-7xl flex-col"
      >
        <ServicesTopRule />
        <ServicesHeading headingId={headingId} />
        <div className="relative flex min-h-[100vh] w-full flex-col px-4 sm:px-6 lg:px-8">
          <div ref={darkRef} className={SECTION_WASH} aria-hidden />
          <div className="relative z-[2] flex h-full min-h-0 w-full flex-1 py-2">
            <div
              className={cn(
                "relative isolate mx-auto h-full min-h-0 w-full max-w-7xl",
                TILE_STACK_VARS,
              )}
            >
              {tilesMarkup}
            </div>
          </div>
        </div>
        <ServicesBottomRule />
      </div>
    </section>
  );
}
