"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import {
  useMemo,
  type MouseEvent as ReactMouseEvent,
} from "react";

import { HeroLogoTicker } from "@/components/ui/hero-logo-ticker";
import {
  BlurRevealWordsInline,
  HERO_REVEAL_DURATION_S,
  HERO_REVEAL_STAGGER_MS,
  splitHeroWords,
} from "@/components/ui/hero-reveal";
import { HERO_TILE_COUNT, HeroTiles } from "@/components/ui/hero-tiles";
import {
  HERO_PRIMARY_CTA_WRAP_CLASSNAME,
  LetterWaveLink,
  OUTLINE_CTA_HERO_SHADOW_CLASSNAME,
} from "@/components/ui/letter-wave-link";
import { heroLogoTicker } from "@/data/site";
import { useHeroRevealHeld } from "@/context/hero-reveal-held-context";
import {
  scrollToDocumentPercent,
  setPendingNavScrollPercent,
} from "@/lib/scroll-document-percent";

type HeroEntryProps = {
  sectionAriaLabel: string;
  headline: string;
  description: string;
  primaryCta: { href: string; label: string };
  secondaryCta: { href: string; label: string; scrollPercent: number };
  splashRevealBypass?: boolean;
};

export function HeroEntry({
  sectionAriaLabel,
  headline,
  description,
  primaryCta,
  secondaryCta,
  splashRevealBypass = false,
}: HeroEntryProps) {
  const pathname = usePathname();
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const revealHeld = useHeroRevealHeld();
  const instant = !!reduceMotion || splashRevealBypass;
  const freezeMotion = revealHeld && !instant;

  const scrollBehavior: ScrollBehavior =
    reduceMotion === true ? "auto" : "smooth";

  const handleSecondaryCtaClick = (e: ReactMouseEvent<HTMLAnchorElement>) => {
    const pct = secondaryCta.scrollPercent;
    if (pathname === "/") {
      e.preventDefault();
      scrollToDocumentPercent(pct, scrollBehavior);
      return;
    }
    e.preventDefault();
    setPendingNavScrollPercent(pct);
    router.push("/");
  };

  const headlineWords = useMemo(() => splitHeroWords(headline), [headline]);
  const descWords = useMemo(() => splitHeroWords(description), [description]);
  const tickerHeadingWordCount = useMemo(
    () => splitHeroWords(heroLogoTicker.heading).length,
    [],
  );

  let step = headlineWords.length + descWords.length;
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
          <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl sm:leading-[1.1] lg:text-6xl">
            <BlurRevealWordsInline text={headline} reduced={instant} />
          </h1>
          <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            <BlurRevealWordsInline
              text={description}
              reduced={instant}
              startDelayMs={headlineWords.length * staggerMs}
            />
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <motion.span
              className={HERO_PRIMARY_CTA_WRAP_CLASSNAME}
              initial={
                instant ? false : { opacity: 0, filter: "blur(10px)", y: 8 }
              }
              animate={
                freezeMotion
                  ? { opacity: 0, filter: "blur(10px)", y: 8 }
                  : { opacity: 1, filter: "blur(0px)", y: 0 }
              }
              transition={{
                duration: instant || freezeMotion ? 0 : duration,
                delay: instant || freezeMotion ? 0 : (primaryCtaStep * staggerMs) / 1000,
                ease: "easeInOut",
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
              initial={
                instant ? false : { opacity: 0, filter: "blur(10px)", y: 8 }
              }
              animate={
                freezeMotion
                  ? { opacity: 0, filter: "blur(10px)", y: 8 }
                  : { opacity: 1, filter: "blur(0px)", y: 0 }
              }
              transition={{
                duration: instant || freezeMotion ? 0 : duration,
                delay: instant || freezeMotion ? 0 : (secondaryCtaStep * staggerMs) / 1000,
                ease: "easeInOut",
              }}
            >
              <LetterWaveLink
                href={secondaryCta.href}
                className={OUTLINE_CTA_HERO_SHADOW_CLASSNAME}
                label={secondaryCta.label}
                onClick={handleSecondaryCtaClick}
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
