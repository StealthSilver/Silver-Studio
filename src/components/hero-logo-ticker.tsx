import Image from "next/image";

import { BrilliantLogo } from "@/components/logos/brilliant-logo";
import { EighthLightLogo } from "@/components/logos/eighth-light-logo";
import { MeshspireLogo } from "@/components/logos/meshspire-logo";
import { cn } from "@/lib/utils";

type HeroLogoTickerProps = {
  className?: string;
};

/** Vector wordmarks: zinc-950 on light, zinc-50 on dark. */
const wordmarkTone = "text-zinc-950 dark:text-zinc-50";

/** Raster/logo strip: monochrome, dark glyphs in light UI and inverted white in dark UI. */
const rasterMonoDarkOnLight =
  "grayscale [filter:grayscale(1)_brightness(0)_saturate(0)] transition-[filter] dark:[filter:grayscale(1)_brightness(0)_invert(1)_saturate(0)]";

const tickerItemClass =
  "flex min-h-[2.25rem] items-center justify-center px-3";

/**
 * Static logo strip at the bottom of the hero (ticker layout, no motion).
 */
export function HeroLogoTicker({ className }: HeroLogoTickerProps) {
  return (
    <div className={cn("mt-20 w-full sm:mt-24 lg:mt-28", className)}>
      <p
        id="hero-logo-ticker-label"
        className="mb-8 px-4 text-center text-sm font-medium leading-snug tracking-wide text-zinc-500 dark:text-zinc-400 sm:mb-9 sm:text-base"
      >
        Trusted by leading teams worldwide
      </p>
      <ul
        className="m-0 flex list-none flex-wrap items-center justify-center gap-x-14 gap-y-10 px-2 sm:gap-x-20 sm:gap-y-12"
        aria-labelledby="hero-logo-ticker-label"
      >
        <li className={tickerItemClass}>
          <Image
            src="/Logos/sgrids.svg"
            alt="sGrids"
            width={176}
            height={41}
            className={cn(
              "h-8 w-auto max-h-9 max-w-[min(100%,11rem)] object-contain object-left sm:h-9 sm:max-w-[12rem]",
              rasterMonoDarkOnLight,
            )}
            sizes="(max-width:640px) 40vw, 12rem"
          />
        </li>
        <li className={tickerItemClass}>
          <BrilliantLogo
            aria-label="Brilliant"
            className={cn(
              "h-6 w-auto max-w-[min(100%,7.125rem)] sm:h-[1.625rem]",
              wordmarkTone,
            )}
          />
        </li>
        <li className={tickerItemClass}>
          <MeshspireLogo aria-label="Meshspire" />
        </li>
        <li className={tickerItemClass}>
          <Image
            src="/Logos/serentia.png"
            alt="Serentica"
            width={215}
            height={37}
            className={cn(
              "h-[1.375rem] w-auto max-h-9 object-contain sm:h-6",
              rasterMonoDarkOnLight,
            )}
          />
        </li>
        <li className={tickerItemClass}>
          <EighthLightLogo
            aria-label="8th Light"
            className={cn(
              "h-6 w-auto max-w-[min(100%,8.75rem)] sm:h-[1.625rem]",
              wordmarkTone,
            )}
          />
        </li>
      </ul>
    </div>
  );
}
