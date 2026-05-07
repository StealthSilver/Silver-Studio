import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

import { BrilliantLogo } from "@/components/ui/logos/brilliant-logo";
import { EighthLightLogo } from "@/components/ui/logos/eighth-light-logo";
import { MeshspireLogo } from "@/components/ui/logos/meshspire-logo";
import { cn } from "@/lib/utils";

type HeroLogoTickerProps = {
  className?: string;
};

/** Vector wordmarks without muted grey — reads clearly on hero backgrounds. */
const wordmarkTone = "text-zinc-900 dark:text-zinc-100";

const tickerItemClass =
  "flex min-h-[2rem] items-center justify-center px-4";

const linkClass =
  "inline-flex items-center justify-center rounded-sm outline-offset-4 transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-zinc-400 dark:focus-visible:outline-zinc-500";

function TickerExternalLink({
  href,
  ariaLabel,
  className,
  children,
}: {
  href: string;
  ariaLabel: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      prefetch={false}
      aria-label={`${ariaLabel} (opens in new tab)`}
      className={cn(linkClass, className)}
    >
      {children}
    </Link>
  );
}

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
          <TickerExternalLink
            href="https://www.sgrids.com/"
            ariaLabel="Smart Grids"
          >
            <span className="inline-flex items-center justify-center">
              <Image
                src="/Logos/sgrids.svg"
                alt=""
                width={176}
                height={41}
                className="h-7 w-auto max-h-8 max-w-[min(100%,10rem)] object-contain object-left sm:h-8 sm:max-w-[11rem] dark:hidden"
                sizes="(max-width:640px) 40vw, 12rem"
              />
              <Image
                src="/Logos/sgrids-dark.svg"
                alt=""
                width={176}
                height={41}
                className="hidden h-7 w-auto max-h-8 max-w-[min(100%,10rem)] object-contain object-left sm:h-8 sm:max-w-[11rem] dark:block"
                sizes="(max-width:640px) 40vw, 12rem"
                aria-hidden
              />
            </span>
          </TickerExternalLink>
        </li>
        <li className={tickerItemClass}>
          <TickerExternalLink
            href="https://brilliant.org/home/"
            ariaLabel="Brilliant"
          >
            <BrilliantLogo
              className={cn(
                "h-5 w-auto max-w-[min(100%,6.5rem)] sm:h-5 sm:max-w-[min(100%,7rem)]",
                wordmarkTone,
              )}
            />
          </TickerExternalLink>
        </li>

        <li className={tickerItemClass}>
          <TickerExternalLink
            href="https://www.serenticaglobal.com/"
            ariaLabel="Serentica"
          >
            <Image
              src="/Logos/serentia.png"
              alt=""
              width={215}
              height={37}
              className="h-[1.125rem] w-auto max-h-8 object-contain sm:h-5"
            />
          </TickerExternalLink>
        </li>
        <li className={tickerItemClass}>
          <TickerExternalLink href="https://8thlight.com/" ariaLabel="8th Light">
            <EighthLightLogo
              className={cn(
                "h-5 w-auto max-w-[min(100%,8rem)] sm:h-5 sm:max-w-[min(100%,8.5rem)]",
                wordmarkTone,
              )}
            />
          </TickerExternalLink>
        </li>
        <li className={tickerItemClass}>
          <TickerExternalLink
            href="https://dev.dg4uqajhampr9.amplifyapp.com/"
            ariaLabel="Meshspire"
          >
            <MeshspireLogo className="h-7 max-w-[min(100%,10rem)] sm:h-8 sm:max-w-[11rem]" />
          </TickerExternalLink>
        </li>
      </ul>
    </div>
  );
}
