"use client";

import { useReducedMotion } from "motion/react";

import {
  BlurRevealBlockInView,
  BlurRevealWordsInView,
  HERO_REVEAL_STAGGER_MS,
  splitHeroWords,
} from "@/components/ui/hero-reveal";
import {
  LetterWaveLink,
  OUTLINE_CTA_HERO_SHADOW_CLASSNAME,
} from "@/components/ui/letter-wave-link";
import { WorkBottomPreview } from "@/components/ui/work-style-glass-preview";
import { WorkStackSlide } from "@/components/sections/work-stack-slide";
import type { WorkCard } from "@/data/site";
import { useNarrowViewport } from "@/lib/use-narrow-viewport";

const INDEX_LABEL_CLASS =
  "font-thin tabular-nums tracking-tight text-foreground text-5xl leading-none max-md:text-4xl sm:text-6xl md:text-7xl lg:text-8xl";

function formatWorkIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

export function WorkItemRow({
  item,
  index,
  total,
}: {
  item: WorkCard;
  index: number;
  total: number;
}) {
  const narrowViewport = useNarrowViewport();
  const reduceMotion = useReducedMotion();
  const reduce = reduceMotion === true;
  const titleId = `work-item-title-${item.slug}`;
  const indexLabel = formatWorkIndex(index);

  const titleWords = splitHeroWords(item.title).length;
  const staggerMs = HERO_REVEAL_STAGGER_MS;
  const indexDelayMs = titleWords * staggerMs + staggerMs;
  const descStartMs =
    indexDelayMs + staggerMs * 4 + splitHeroWords(indexLabel).length * staggerMs;
  const ctaDelaySec =
    (descStartMs +
      splitHeroWords(item.description).length * staggerMs +
      staggerMs * 2) /
    1000;

  return (
    <WorkStackSlide itemSlug={item.slug} index={index} total={total}>
      <div className="work-showcase__bg" aria-hidden />

      <div
        className={
          narrowViewport
            ? "relative z-[2] w-full"
            : "relative z-[2] min-h-screen w-full"
        }
      >
        <span className="sr-only">
          Project {index + 1} of {total}
        </span>

        <article
          className={
            narrowViewport
              ? "relative flex w-full flex-col gap-5 px-4 pb-0 pt-8 text-left max-md:gap-4"
              : "relative min-h-screen w-full"
          }
          aria-labelledby={titleId}
        >
          {narrowViewport ? (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3
                    id={titleId}
                    className="text-left text-2xl font-normal uppercase leading-[1.08] tracking-tight text-foreground sm:text-3xl"
                  >
                    <BlurRevealWordsInView
                      text={item.title}
                      reduced={reduce}
                      viewport={{ once: true, amount: 0.2 }}
                    />
                  </h3>
                </div>
                <div className="shrink-0" aria-hidden>
                  <BlurRevealBlockInView
                    reduced={reduce}
                    delaySec={indexDelayMs / 1000}
                    viewport={{ once: true, amount: 0.2 }}
                    className={INDEX_LABEL_CLASS}
                    y={6}
                    blurPx={10}
                  >
                    {indexLabel}
                  </BlurRevealBlockInView>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                <BlurRevealWordsInView
                  text={item.description}
                  reduced={reduce}
                  startDelayMs={descStartMs}
                  viewport={{ once: true, amount: 0.2 }}
                />
              </p>

              <div className="flex justify-start">
                <BlurRevealBlockInView
                  reduced={reduce}
                  delaySec={ctaDelaySec}
                  y={8}
                  blurPx={10}
                  className="inline-flex"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  <LetterWaveLink
                    href={`/${item.slug}`}
                    className={OUTLINE_CTA_HERO_SHADOW_CLASSNAME}
                    label="READ MORE"
                    ariaLabel={`Read more about ${item.title}`}
                  />
                </BlurRevealBlockInView>
              </div>

              <div className="mt-2 w-full max-md:mt-3 max-md:mb-0">
                <WorkBottomPreview item={item} />
              </div>
            </>
          ) : (
            <>
              <div className="absolute inset-x-0 top-[15%] z-30 flex justify-center px-4 max-md:px-3 sm:px-6 lg:px-8">
                <div className="flex w-full max-w-7xl items-start justify-between gap-4 max-md:gap-3 sm:gap-6">
                  <div className="min-w-0 max-w-[min(100%,44rem)] pr-2">
                    <h3
                      id={titleId}
                      className="text-left text-3xl font-normal uppercase leading-[1.05] tracking-tight text-foreground max-md:text-2xl max-md:leading-[1.08] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                    >
                      <BlurRevealWordsInView
                        text={item.title}
                        reduced={reduce}
                        viewport={{ once: true, amount: 0.35 }}
                      />
                    </h3>
                  </div>
                  <div className="shrink-0" aria-hidden>
                    <BlurRevealBlockInView
                      reduced={reduce}
                      delaySec={indexDelayMs / 1000}
                      viewport={{ once: true, amount: 0.35 }}
                      className={INDEX_LABEL_CLASS}
                      y={6}
                      blurPx={10}
                    >
                      {indexLabel}
                    </BlurRevealBlockInView>
                  </div>
                </div>
              </div>

              <div className="absolute left-1/2 top-1/2 z-20 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 px-5 max-md:px-4 text-center sm:max-w-2xl sm:px-8">
                <p className="max-w-xl text-base leading-relaxed text-muted-foreground max-md:text-sm max-md:leading-relaxed sm:text-lg">
                  <BlurRevealWordsInView
                    text={item.description}
                    reduced={reduce}
                    startDelayMs={descStartMs}
                    viewport={{ once: true, amount: 0.38 }}
                  />
                </p>
                <div className="mt-8 flex justify-center max-md:mt-6 sm:mt-10">
                  <BlurRevealBlockInView
                    reduced={reduce}
                    delaySec={ctaDelaySec}
                    y={8}
                    blurPx={10}
                    className="inline-flex"
                    viewport={{ once: true, amount: 0.3 }}
                  >
                    <LetterWaveLink
                      href={`/${item.slug}`}
                      className={OUTLINE_CTA_HERO_SHADOW_CLASSNAME}
                      label="READ MORE"
                      ariaLabel={`Read more about ${item.title}`}
                    />
                  </BlurRevealBlockInView>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 z-[15] flex justify-center px-4 max-md:px-3 sm:px-6">
                <WorkBottomPreview item={item} />
              </div>
            </>
          )}
        </article>
      </div>
    </WorkStackSlide>
  );
}
