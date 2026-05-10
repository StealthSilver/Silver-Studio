"use client";

import type { FC } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import {
  BlurRevealBlock,
  BlurRevealWordsInline,
  BlurRevealWordsInView,
  HERO_REVEAL_STAGGER_MS,
  splitHeroWords,
} from "@/components/ui/hero-reveal";
import {
  poweredBySilverUiSection,
  processSection,
  servicesSection,
  workSection,
} from "@/data/site";
import { scheduleScrollTriggerRefresh } from "@/lib/schedule-scroll-trigger-refresh";
import { cn } from "@/lib/utils";

import {
  DeploymentAnimation,
  DesignAnimation,
  DevelopmentAnimation,
  DirectionAnimation,
  DiscoveryAnimation,
} from "./process-animations";

import "@/styles/process-section.css";

gsap.registerPlugin(ScrollTrigger);

/** Pinned stack stage — taller so later overlaps stay inside overflow-hidden clipping. */
const PROCESS_BLOCK_HEIGHT_CLASS = "h-[min(92vh,760px)] min-h-[min(92vh,760px)]";


const glassPanelClass =
  "flex aspect-square h-[min(24vh,210px)] w-[min(24vh,210px)] shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-muted/35 p-5 shadow-sm backdrop-blur-xl sm:h-[min(26vh,240px)] sm:w-[min(26vh,240px)] sm:p-7 dark:border-border/55 dark:bg-card/40 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.08),0_12px_40px_rgb(0_0_0_/_0.35)]";

const STEP_ANIMATIONS = {
  Discovery: DiscoveryAnimation,
  Direction: DirectionAnimation,
  Design: DesignAnimation,
  Development: DevelopmentAnimation,
  Deployment: DeploymentAnimation,
} as const satisfies Record<(typeof processSection.steps)[number]["title"], FC>;

/** Same full-bleed rule + heading scale as `Services` / `PoweredBySilverUi`. */
const FULL_BLEED_ROW =
  "relative w-screen max-w-[100vw] shrink-0 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]";

const PROCESS_HEADING_CLASS =
  "text-left text-2xl font-normal uppercase leading-[1.08] tracking-[0.06em] text-foreground sm:text-3xl md:text-4xl lg:text-[2.75rem]";

const PROCESS_HEADING_COPY = "PROCESS WE FOLLOW";

function ProcessTopRule() {
  return (
    <div className={FULL_BLEED_ROW}>
      <div className="border-t border-border/70 dark:border-border/50" aria-hidden />
    </div>
  );
}

function ProcessHeading({
  headingId,
  reduced,
}: {
  headingId: string;
  reduced: boolean;
}) {
  return (
    <div className="flex w-full justify-center px-4 pt-[4.25rem] pb-6 sm:px-6 sm:pt-20 sm:pb-8 lg:px-8 lg:pt-24">
      <div className="flex w-full max-w-7xl items-start justify-between gap-6">
        <div className="min-w-0 max-w-[min(100%,44rem)] pr-2">
          <h2 id={headingId} className={PROCESS_HEADING_CLASS}>
            <BlurRevealWordsInView
              text={PROCESS_HEADING_COPY}
              reduced={reduced}
            />
          </h2>
        </div>
      </div>
    </div>
  );
}

/** Step copy blur timing shares hero stagger; `headingEndMs` is when the section title finishes its word resolves. */
function ProcessCopyColumn({
  step,
  index,
  reduced,
  headingEndMs,
  descRef,
}: {
  step: (typeof processSection.steps)[number];
  index: number;
  reduced: boolean;
  headingEndMs: number;
  descRef?: (el: HTMLParagraphElement | null) => void;
}) {
  const staggerMs = HERO_REVEAL_STAGGER_MS;
  const num = String(index + 1).padStart(2, "0");
  const phase = step.title.toUpperCase();
  const stepGapMs = 13 * staggerMs;
  const baseMs = headingEndMs + 90 + index * stepGapMs;

  const numDelaySec = baseMs / 1000;
  const phaseStartMs = baseMs + staggerMs * 3;
  const phaseWordCount = splitHeroWords(phase).length;
  const descStartMs =
    phaseStartMs + phaseWordCount * staggerMs + staggerMs;

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col items-start justify-start md:max-w-[min(52%,560px)]">
      <span className="font-mono text-xs font-medium tracking-[0.35em] text-muted-foreground sm:text-sm">
        <BlurRevealBlock
          instant={reduced}
          delaySec={numDelaySec}
          y={4}
          blurPx={8}
          className="inline-block"
        >
          {num}
        </BlurRevealBlock>
      </span>
      <h3 className="mt-2 text-xl font-semibold tracking-[0.14em] sm:text-2xl">
        <BlurRevealWordsInline
          text={phase}
          reduced={reduced}
          startDelayMs={phaseStartMs}
        />
      </h3>
      <p
        ref={descRef}
        className="mt-4 w-full truncate text-sm text-muted-foreground sm:text-[15px]"
        title={step.description}
      >
        <BlurRevealWordsInline
          text={step.description}
          reduced={reduced}
          startDelayMs={descStartMs}
        />
      </p>
    </div>
  );
}

/** Breathing room between the section title and the pinned steps. */
function ProcessHeadingToBlocksSpacer() {
  return (
    <div className="h-6 shrink-0 sm:h-8 lg:h-10" aria-hidden />
  );
}

/** Vertical scroll distance per overlap — slightly above 1× so scrub reaches full progress for the last block. */
const SCROLL_PER_OVERLAP_VH = 1.02;

/**
 * Extra scroll (in viewport heights) while pinned at the rule + heading before the
 * stack animation begins — mirrors `INTRO_SCROLL_HOLD` in `services.tsx`.
 */
const INTRO_SCROLL_VH = 0.65;

/**
 * Incoming step’s top border sits flush under the previous step’s description
 * (tiny offset avoids 1 px seams from subpixel/layout rounding).
 */
const DESC_TO_LINE_GAP_PX = 1;

/** Stop y must stay below H so each layer translates up from rest (y === H is fully below clip). */
const STOP_Y_CEILING_MARGIN_PX = 6;

export function Process() {
  const { id, steps } = processSection;
  const headingId = `${id}-heading`;
  const pinRef = useRef<HTMLDivElement>(null);
  /** Layers are `translateY`’d relative to this box — measurements must use its top, not `pinRef`. */
  const stackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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
    const stackEl = stackRef.current;
    const cards = steps.map((_, i) => cardRefs.current[i]);
    const missingCard = cards.some((c) => !c);

    const descElsOk = steps.every((_, i) => !!descRefs.current[i]);
    if (!pinEl || !stackEl || missingCard || !descElsOk) return;

    const layers = cards as HTMLDivElement[];

    const overlapCount = steps.length - 1;

    const layerHeightPx = (): number =>
      layers[0]?.offsetHeight ?? pinEl.offsetHeight;

    const scrollEndPx = (): number =>
      window.innerHeight *
      (INTRO_SCROLL_VH + overlapCount * SCROLL_PER_OVERLAP_VH);

    const introProgressCap =
      INTRO_SCROLL_VH /
      (INTRO_SCROLL_VH + overlapCount * SCROLL_PER_OVERLAP_VH);

    const stackProgress = (p: number): number =>
      p <= introProgressCap
        ? 0
        : (p - introProgressCap) / (1 - introProgressCap);

    /**
     * For each incoming layer k (index 1..n-1), y so this layer’s top edge
     * (and its visible top rule) sits at bottom(prev description) + gap — in pin space.
     */
    const measureStopYs = (): number[] => {
      const H = layerHeightPx();
      const ys = new Array(layers.length).fill(0) as number[];
      for (let i = 1; i < layers.length; i++) {
        gsap.set(layers[0], { y: 0, yPercent: 0 });
        for (let k = 1; k < layers.length; k++) {
          if (k < i) gsap.set(layers[k], { y: ys[k], yPercent: 0 });
          else gsap.set(layers[k], { y: H, yPercent: 0 });
        }
        void stackEl.offsetHeight;
        const desc = descRefs.current[i - 1];
        if (!desc) {
          ys[i] = H;
          continue;
        }
        const stackTop = stackEl.getBoundingClientRect().top;
        const descBottom = desc.getBoundingClientRect().bottom;
        const raw = descBottom - stackTop + DESC_TO_LINE_GAP_PX;
        const maxY = Math.max(0, H - STOP_Y_CEILING_MARGIN_PX);
        ys[i] = Math.min(raw, maxY);
      }
      return ys;
    };

    const applyProgress = (p: number, stopYs: number[], H: number) => {
      const animP = stackProgress(p);
      gsap.set(layers[0], { y: 0, yPercent: 0 });
      for (let i = 1; i < layers.length; i++) {
        const start = (i - 1) / overlapCount;
        const end = i / overlapCount;
        let y: number;
        if (animP <= start) y = H;
        else if (animP >= end) y = stopYs[i] ?? H;
        else {
          const t = (animP - start) / (end - start);
          const target = stopYs[i] ?? H;
          y = H + (target - H) * t;
        }
        gsap.set(layers[i], { y, yPercent: 0 });
      }
    };

    let cancelled = false;

    /** Avoid `Timeout`/`number` clashes from Node timer typings vs DOM. */
    let resizeScheduleId: number | undefined;
    const vv = typeof window !== "undefined" ? window.visualViewport : null;

    const refresh = () => {
      if (cancelled) return;
      ScrollTrigger.refresh();
    };

    const debouncedRefresh = () => {
      if (resizeScheduleId !== undefined) window.clearTimeout(resizeScheduleId);
      resizeScheduleId = window.setTimeout(refresh, 120);
    };

    const upstreamSectionIds = [
      workSection.id,
      servicesSection.id,
      poweredBySilverUiSection.id,
    ] as const;

    const ctx = gsap.context(() => {
      let stopYs = measureStopYs();

      const st = ScrollTrigger.create({
        trigger: pinEl,
        start: "top top",
        end: () => `+=${scrollEndPx()}`,
        pin: true,
        /** Match Services: smoothed scrub fights pin at section entry. */
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onRefresh: (self) => {
          stopYs = measureStopYs();
          applyProgress(self.progress, stopYs, layerHeightPx());
        },
        onUpdate: (self) => {
          applyProgress(self.progress, stopYs, layerHeightPx());
        },
      });

      gsap.set(layers[0], { y: 0, yPercent: 0 });
      for (let k = 1; k < layers.length; k++) {
        gsap.set(layers[k], { y: layerHeightPx(), yPercent: 0 });
      }
      applyProgress(st.progress, stopYs, layerHeightPx());
    }, pinEl);

    scheduleScrollTriggerRefresh();

    const layoutObservers: ResizeObserver[] = [];
    if (typeof ResizeObserver !== "undefined") {
      for (const sid of upstreamSectionIds) {
        const root = document.getElementById(sid);
        if (!root) continue;
        const ro = new ResizeObserver(debouncedRefresh);
        ro.observe(root);
        layoutObservers.push(ro);
      }
    }

    window.addEventListener("resize", debouncedRefresh);
    vv?.addEventListener("resize", debouncedRefresh);
    window.addEventListener("orientationchange", debouncedRefresh);

    const fontsDone = document.fonts?.ready?.then(() => {
      if (!cancelled) debouncedRefresh();
    });
    fontsDone?.catch(() => {
      if (!cancelled) debouncedRefresh();
    });

    return () => {
      cancelled = true;
      if (resizeScheduleId !== undefined) window.clearTimeout(resizeScheduleId);
      layoutObservers.forEach((ro) => ro.disconnect());
      window.removeEventListener("resize", debouncedRefresh);
      vv?.removeEventListener("resize", debouncedRefresh);
      window.removeEventListener("orientationchange", debouncedRefresh);
      fontsDone?.catch(() => {});
      ctx.revert();
    };
  }, [prefersReducedMotion, steps.length]);

  const staggerMs = HERO_REVEAL_STAGGER_MS;
  const processHeadingEndMs =
    splitHeroWords(PROCESS_HEADING_COPY).length * staggerMs;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="w-full scroll-mt-28 bg-background text-foreground sm:scroll-mt-32"
    >
      {prefersReducedMotion ? (
        <>
          <ProcessTopRule />
          <ProcessHeading headingId={headingId} reduced />
          <ProcessHeadingToBlocksSpacer />
          <ul className="m-0 flex list-none flex-col p-0">
            {steps.map((step, index) => (
              <ProcessStepRow
                key={step.title}
                step={step}
                index={index}
                headingEndMs={processHeadingEndMs}
                reduced
              />
            ))}
          </ul>
        </>
      ) : (
        <div ref={pinRef} className="relative flex w-full flex-col">
          <ProcessTopRule />
          <ProcessHeading
            headingId={headingId}
            reduced={prefersReducedMotion}
          />
          <ProcessHeadingToBlocksSpacer />
          <div
            ref={stackRef}
            className={cn(
              "relative isolate w-full overflow-hidden border-border/50",
              PROCESS_BLOCK_HEIGHT_CLASS,
            )}
          >
            {steps.map((step, index) => {
              const Animation = STEP_ANIMATIONS[step.title];

              return (
                <div
                  key={step.title}
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={cn(
                    "absolute inset-x-0 top-0 box-border will-change-transform",
                    PROCESS_BLOCK_HEIGHT_CLASS,
                  )}
                  style={{ zIndex: index + 1 }}
                >
                  <article
                    className={cn(
                      "box-border flex min-h-0 h-full flex-col gap-6 overflow-hidden border-t px-5 py-6 sm:px-8 md:flex-row md:items-start md:justify-between md:gap-8 lg:px-12 xl:mx-auto xl:max-w-7xl",
                      index === 0
                        ? "border-transparent bg-background"
                        : "border-border/55 bg-background",
                    )}
                  >
                    <ProcessCopyColumn
                      step={step}
                      index={index}
                      reduced={prefersReducedMotion}
                      headingEndMs={processHeadingEndMs}
                      descRef={(el) => {
                        descRefs.current[index] = el;
                      }}
                    />
                    <div className={glassPanelClass}>
                      <Animation />
                    </div>
                  </article>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}

function ProcessStepRow({
  step,
  index,
  headingEndMs,
  reduced,
}: {
  step: (typeof processSection.steps)[number];
  index: number;
  headingEndMs: number;
  reduced: boolean;
}) {
  const Animation = STEP_ANIMATIONS[step.title];

  return (
    <li className="m-0 border-t border-border/55 p-0 first:border-t-0">
      <article
        className={cn(
          "box-border flex min-h-0 flex-col gap-6 overflow-hidden px-5 py-6 sm:px-8 md:flex-row md:items-start md:justify-between md:gap-8 lg:px-12 xl:mx-auto xl:max-w-7xl",
          PROCESS_BLOCK_HEIGHT_CLASS,
        )}
      >
        <ProcessCopyColumn
          step={step}
          index={index}
          reduced={reduced}
          headingEndMs={headingEndMs}
        />
        <div className={glassPanelClass}>
          <Animation />
        </div>
      </article>
    </li>
  );
}
