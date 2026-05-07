import {
  HERO_REVEAL_DURATION_S,
  HERO_REVEAL_STAGGER_MS,
  splitHeroWords,
} from "@/components/ui/hero-reveal";
import { HERO_TILE_COUNT } from "@/components/ui/hero-tiles";
import { hero, heroLogoTicker } from "@/data/site";

/**
 * Time from mount until the last hero logo fade-in finishes (home page hero).
 * Mirrors step order in `HeroEntry`.
 */
export function getHomeHeroRevealCompleteDelayMs(): number {
  const headlineWords = splitHeroWords(hero.headline).length;
  const descWords = splitHeroWords(hero.description).length;
  const tickerHeadingWords = splitHeroWords(heroLogoTicker.heading).length;
  const logoCount = heroLogoTicker.items.length;

  let step = 0;
  step += headlineWords;
  step += descWords;
  step += 2;
  step += HERO_TILE_COUNT;
  step += tickerHeadingWords;
  const lastLogoStep = step + logoCount - 1;
  const delaySec = (lastLogoStep * HERO_REVEAL_STAGGER_MS) / 1000;
  return Math.ceil((delaySec + HERO_REVEAL_DURATION_S) * 1000);
}

/** Navbar fade-in duration after hero intro completes (non–reduced-motion). */
export const NAVBAR_AFTER_HERO_FADE_IN_S = 1.35;
