"use client";

import { HeroEntry } from "@/components/ui/hero-entry";
import { SplashHeroReveal } from "@/components/page-splash-reveal";
import { hero } from "@/data/site";

/** Always bypass staggered prose reveal so splash → idle never retriggers headline motion (no “second” entrance). */
const SPLASH_REVEAL_BYPASS = true;

export function Hero() {
  return (
    <SplashHeroReveal>
      <HeroEntry {...hero} splashRevealBypass={SPLASH_REVEAL_BYPASS} />
    </SplashHeroReveal>
  );
}
