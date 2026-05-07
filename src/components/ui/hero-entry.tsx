"use client";

import { motion, useReducedMotion } from "motion/react";
import { useMemo } from "react";

import { HeroLogoTicker } from "@/components/ui/hero-logo-ticker";
import {
  FadeRevealSpan,
  HERO_REVEAL_DURATION_S,
  HERO_REVEAL_STAGGER_MS,
  splitHeroWords,
} from "@/components/ui/hero-reveal";
import { HERO_TILE_COUNT, HeroTiles } from "@/components/ui/hero-tiles";
import { LetterWaveLink } from "@/components/ui/letter-wave-link";
import { heroLogoTicker } from "@/data/site";

type HeroEntryProps = {
  sectionAriaLabel: string;
  headline: string;
  description: string;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string };
};

export function HeroEntry({
  sectionAriaLabel,
  headline,
  description,
  primaryCta,
  secondaryCta,
}: HeroEntryProps) {
  const reduceMotion = useReducedMotion();
  const instant = !!reduceMotion;

  const headlineWords = useMemo(() => splitHeroWords(headline), [headline]);
  const descWords = useMemo(() => splitHeroWords(description), [description]);
  const tickerHeadingWordCount = useMemo(
    () => splitHeroWords(heroLogoTicker.heading).length,
    [],
  );

  let step = 0;
  const headlineStart = step;
  step += headlineWords.length;
  const descStart = step;
  step += descWords.length;
  const primaryCtaStep = step++;
  const secondaryCtaStep = step++;
  const tilesRevealBase = step;
  step += HERO_TILE_COUNT;
  const tickerHeadingStart = step;
  step += tickerHeadingWordCount;
  const logoStart = step;

  const staggerMs = HERO_REVEAL_STAGGER_MS;
  const duration = HERO_REVEAL_DURATION_S;

  return (
    <section
      className="hero flex w-full shrink-0 flex-col justify-center"
      aria-label={sectionAriaLabel}
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-2 text-left lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-12 lg:gap-x-10">
        <div className="flex min-w-0 flex-col items-start gap-8 sm:gap-10">
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl sm:leading-[1.1] lg:text-6xl dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]">
            {headlineWords.map((word, i) => (
              <FadeRevealSpan
                key={`hero-headline-${i}`}
                stepIndex={headlineStart + i}
                staggerMs={staggerMs}
                duration={duration}
                instant={instant}
              >
                {word}
                {i < headlineWords.length - 1 ? "\u00A0" : ""}
              </FadeRevealSpan>
            ))}
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400">
            {descWords.map((word, i) => (
              <FadeRevealSpan
                key={`hero-desc-${i}`}
                stepIndex={descStart + i}
                staggerMs={staggerMs}
                duration={duration}
                instant={instant}
              >
                {word}
                {i < descWords.length - 1 ? "\u00A0" : ""}
              </FadeRevealSpan>
            ))}
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <motion.span
              className="inline-block"
              initial={instant ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: instant ? 0 : duration,
                delay: instant ? 0 : (primaryCtaStep * staggerMs) / 1000,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <LetterWaveLink
                href={primaryCta.href}
                className="talk-now-btn inline-flex h-11 items-center justify-center rounded-[4px] px-6 text-sm font-semibold tracking-wide"
                label={primaryCta.label}
              />
            </motion.span>
            <motion.span
              className="inline-block"
              initial={instant ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: instant ? 0 : duration,
                delay: instant ? 0 : (secondaryCtaStep * staggerMs) / 1000,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <LetterWaveLink
                href={secondaryCta.href}
                className="inline-flex h-11 items-center justify-center rounded-[4px] border border-zinc-300 bg-background px-6 text-sm font-semibold tracking-wide text-zinc-900 shadow-sm transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
                label={secondaryCta.label}
              />
            </motion.span>
          </div>
        </div>
        <div className="flex w-full min-w-0 justify-center lg:w-auto lg:justify-end lg:pr-2">
          <HeroTiles
            className="max-w-full"
            reveal={{
              baseStep: tilesRevealBase,
              staggerMs,
              duration,
              instant,
            }}
          />
        </div>
      </div>
      <HeroLogoTicker
        reveal={{
          headingWordStart: tickerHeadingStart,
          logoStart,
          staggerMs,
          duration,
          instant,
        }}
      />
    </section>
  );
}
