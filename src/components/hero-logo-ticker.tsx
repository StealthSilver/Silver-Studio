import Image from "next/image";

import { BrilliantLogo } from "@/components/logos/brilliant-logo";
import { EighthLightLogo } from "@/components/logos/eighth-light-logo";
import { MeshspireLogo } from "@/components/logos/meshspire-logo";
import { cn } from "@/lib/utils";

type HeroLogoTickerProps = {
  className?: string;
};

/** Vector wordmarks: muted grey on light, zinc-50 on dark. */
const wordmarkTone = "text-zinc-500 dark:text-zinc-50";

/** Raster strip: grey muted glyphs on light, inverted on dark. */
const rasterMonoDarkOnLight =
  "opacity-65 grayscale transition-[filter,opacity] [filter:grayscale(1)_brightness(0)_saturate(0)] dark:opacity-100 dark:[filter:grayscale(1)_brightness(0)_invert(1)_saturate(0)]";

const tickerItemClass =
  "flex min-h-[2rem] items-center justify-center px-4";

/**
 * Static logo strip at the bottom of the hero (ticker layout, no motion).
 */
export function HeroLogoTicker({ className }: HeroLogoTickerProps) {
  return (
    <div className={cn("mt-36 w-full sm:mt-36 lg:mt-44", className)}>
      <p
        id="hero-logo-ticker-label"
        className="mb-8 px-4 text-center text-sm font-medium leading-snug tracking-wide text-zinc-500 dark:text-zinc-400 sm:mb-9 sm:text-base"
      >
        Trusted by leading teams worldwide
      </p>
      <ul
        className="m-0 flex list-none flex-wrap items-center justify-center gap-x-16 gap-y-12 px-2 sm:gap-x-24 sm:gap-y-14"
        aria-labelledby="hero-logo-ticker-label"
      >
        <li className={tickerItemClass}>
          <Image
            src="/Logos/sgrids.svg"
            alt="sGrids"
            width={176}
            height={41}
            className={cn(
              "h-7 w-auto max-h-8 max-w-[min(100%,10rem)] object-contain object-left sm:h-8 sm:max-w-[11rem]",
              rasterMonoDarkOnLight,
            )}
            sizes="(max-width:640px) 40vw, 12rem"
          />
        </li>
        <li className={tickerItemClass}>
          <BrilliantLogo
            aria-label="Brilliant"
            className={cn(
              "h-5 w-auto max-w-[min(100%,6.5rem)] sm:h-5 sm:max-w-[min(100%,7rem)]",
              wordmarkTone,
            )}
          />
        </li>
        <li className={tickerItemClass}>
          <MeshspireLogo
            aria-label="Meshspire"
            className="h-7 max-w-[min(100%,10rem)] sm:h-8 sm:max-w-[11rem] text-zinc-500 dark:text-zinc-50"
          />
        </li>
        <li className={tickerItemClass}>
          <Image
            src="/Logos/serentia.png"
            alt="Serentica"
            width={215}
            height={37}
            className={cn(
              "h-[1.125rem] w-auto max-h-8 object-contain sm:h-5",
              rasterMonoDarkOnLight,
            )}
          />
        </li>
        <li className={tickerItemClass}>
          <EighthLightLogo
            aria-label="8th Light"
            className={cn(
              "h-5 w-auto max-w-[min(100%,8rem)] sm:h-5 sm:max-w-[min(100%,8.5rem)]",
              wordmarkTone,
            )}
          />
        </li>
      </ul>
    </div>
  );
}
