"use client";

import type { FC } from "react";
import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { processSection } from "@/data/site";
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

/** Vertical scroll distance per overlap — slightly above 1× so scrub reaches full progress for the last block. */
const SCROLL_PER_OVERLAP_VH = 1.02;

/**
 * Incoming step’s top border sits flush under the previous step’s description
 * (tiny offset avoids 1 px seams from subpixel/layout rounding).
 */
const DESC_TO_LINE_GAP_PX = 1;

/** Stop y must stay below H so each layer translates up from rest (y === H is fully below clip). */
const STOP_Y_CEILING_MARGIN_PX = 6;

export function Process() {
  const { id, sectionAriaLabel, steps } = processSection;
  const pinRef = useRef<HTMLDivElement>(null);
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
    const cards = steps.map((_, i) => cardRefs.current[i]);
    const missingCard = cards.some((c) => !c);

    const descElsOk = steps.every((_, i) => !!descRefs.current[i]);
    if (!pinEl || missingCard || !descElsOk) return;

    const layers = cards as HTMLDivElement[];

    const overlapCount = steps.length - 1;

    const layerHeightPx = (): number =>
      layers[0]?.offsetHeight ?? pinEl.offsetHeight;

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
        void pinEl.offsetHeight;
        const desc = descRefs.current[i - 1];
        if (!desc) {
          ys[i] = H;
          continue;
        }
        const pinTop = pinEl.getBoundingClientRect().top;
        const descBottom = desc.getBoundingClientRect().bottom;
        const raw = descBottom - pinTop + DESC_TO_LINE_GAP_PX;
        const maxY = Math.max(0, H - STOP_Y_CEILING_MARGIN_PX);
        ys[i] = Math.min(raw, maxY);
      }
      return ys;
    };

    const applyProgress = (p: number, stopYs: number[], H: number) => {
      gsap.set(layers[0], { y: 0, yPercent: 0 });
      for (let i = 1; i < layers.length; i++) {
        const start = (i - 1) / overlapCount;
        const end = i / overlapCount;
        let y: number;
        if (p <= start) y = H;
        else if (p >= end) y = stopYs[i] ?? H;
        else {
          const t = (p - start) / (end - start);
          const target = stopYs[i] ?? H;
          y = H + (target - H) * t;
        }
        gsap.set(layers[i], { y, yPercent: 0 });
      }
    };

    const ctx = gsap.context(() => {
      let stopYs = measureStopYs();

      const st = ScrollTrigger.create({
        trigger: pinEl,
        start: "top top",
        end: () => `+=${overlapCount * window.innerHeight * SCROLL_PER_OVERLAP_VH}`,
        pin: true,
        scrub: 1,
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

    let cancelled = false;
    const fontsDone = document.fonts?.ready?.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });
    fontsDone?.catch(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      fontsDone?.catch(() => {});
      ctx.revert();
    };
  }, [prefersReducedMotion, steps.length]);

  return (
    <section
      id={id}
      aria-label={sectionAriaLabel}
      className="w-full scroll-mt-28 border-t border-border/60 bg-background text-foreground"
    >
      {prefersReducedMotion ? (
        <ul className="m-0 flex list-none flex-col p-0">
          {steps.map((step, index) => (
            <ProcessStepRow key={step.title} step={step} index={index} />
          ))}
        </ul>
      ) : (
        <div
          ref={pinRef}
          className={cn(
            "relative isolate w-full overflow-hidden border-border/50",
            PROCESS_BLOCK_HEIGHT_CLASS,
          )}
        >
          {steps.map((step, index) => {
            const num = String(index + 1).padStart(2, "0");
            const Animation = STEP_ANIMATIONS[step.title];
            const phase = step.title.toUpperCase();

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
                  <div className="flex min-h-0 min-w-0 flex-1 flex-col items-start justify-start md:max-w-[min(52%,560px)]">
                    <span className="font-mono text-xs font-medium tracking-[0.35em] text-muted-foreground sm:text-sm">
                      {num}
                    </span>
                    <h2 className="mt-2 text-xl font-semibold tracking-[0.14em] sm:text-2xl [font-family:var(--font-ibm-plex-sans)]">
                      {phase}
                    </h2>
                    <p
                      ref={(el) => {
                        descRefs.current[index] = el;
                      }}
                      className="mt-4 w-full truncate text-sm text-muted-foreground sm:text-[15px]"
                      title={step.description}
                    >
                      {step.description}
                    </p>
                  </div>
                  <div className={glassPanelClass}>
                    <Animation />
                  </div>
                </article>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

function ProcessStepRow({
  step,
  index,
}: {
  step: (typeof processSection.steps)[number];
  index: number;
}) {
  const num = String(index + 1).padStart(2, "0");
  const Animation = STEP_ANIMATIONS[step.title];
  const phase = step.title.toUpperCase();

  return (
    <li className="m-0 border-t border-border/55 p-0 first:border-t-0">
      <article
        className={cn(
          "box-border flex min-h-0 flex-col gap-6 overflow-hidden px-5 py-6 sm:px-8 md:flex-row md:items-start md:justify-between md:gap-8 lg:px-12 xl:mx-auto xl:max-w-7xl",
          PROCESS_BLOCK_HEIGHT_CLASS,
        )}
      >
        <div className="flex min-h-0 min-w-0 flex-1 flex-col items-start justify-start md:max-w-[min(52%,560px)]">
          <span className="font-mono text-xs font-medium tracking-[0.35em] text-muted-foreground sm:text-sm">
            {num}
          </span>
          <h2 className="mt-2 text-xl font-semibold tracking-[0.14em] sm:text-2xl [font-family:var(--font-ibm-plex-sans)]">
            {phase}
          </h2>
          <p
            className="mt-4 w-full truncate text-sm text-muted-foreground sm:text-[15px]"
            title={step.description}
          >
            {step.description}
          </p>
        </div>
        <div className={glassPanelClass}>
          <Animation />
        </div>
      </article>
    </li>
  );
}
