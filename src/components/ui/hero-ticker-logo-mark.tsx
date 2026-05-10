import Image from "next/image";

import { BrilliantLogo } from "@/components/ui/logos/brilliant-logo";
import { EighthLightLogo } from "@/components/ui/logos/eighth-light-logo";
import { MeshspireLogo } from "@/components/ui/logos/meshspire-logo";
import type { HeroTickerItem } from "@/data/site";
import { cn } from "@/lib/utils";

export type HeroTickerLogoMarkProps = {
  item: HeroTickerItem;
  /** Hero strip sizing vs. larger centered mark on testimonial tiles */
  presentation?: "ticker" | "card";
  /**
   * When `presentation="card"`, whether the tile is light or dark themed.
   * Omit for ticker; for cards, testimonials renders both via `dark:hidden` / `dark:flex`.
   */
  cardTone?: "light" | "dark";
};

const cardMarkSizing =
  "h-9 w-auto max-h-10 max-w-[min(100%,13rem)] object-contain object-center sm:h-10 sm:max-w-[14rem]";

/**
 * Renders the same logo treatment as the hero “Trusted by” strip.
 * Testimonial `card` uses larger marks; dark cards use light-colored logos, light cards match hero contrast.
 */
export function HeroTickerLogoMark({
  item,
  presentation = "ticker",
  cardTone = "dark",
}: HeroTickerLogoMarkProps) {
  const card = presentation === "card";
  const lightTile = card && cardTone === "light";

  switch (item.type) {
    case "dualImage":
      return card ? (
        <span className="inline-flex items-center justify-center">
          <Image
            src={lightTile ? item.light.src : item.dark.src}
            alt=""
            width={lightTile ? item.light.width : item.dark.width}
            height={lightTile ? item.light.height : item.dark.height}
            className={cn(
              "block",
              cardMarkSizing,
              lightTile
                ? "drop-shadow-[0_1px_14px_rgb(15_23_42/_0.1)]"
                : "drop-shadow-[0_2px_24px_rgb(0_0_0/_0.55)]",
            )}
            sizes={
              lightTile
                ? item.light.sizes
                : item.dark.sizes ?? "(max-width:768px) 50vw, 14rem"
            }
          />
        </span>
      ) : (
        <span className="inline-flex items-center justify-center max-md:justify-start md:justify-center">
          <Image
            src={item.light.src}
            alt=""
            width={item.light.width}
            height={item.light.height}
            className={item.light.className}
            sizes={item.light.sizes}
          />
          <Image
            src={item.dark.src}
            alt=""
            width={item.dark.width}
            height={item.dark.height}
            className={item.dark.className}
            sizes={item.dark.sizes}
            aria-hidden={item.dark.ariaHidden}
          />
        </span>
      );
    case "singleImage":
      return (
        <Image
          src={item.src}
          alt=""
          width={item.width}
          height={item.height}
          className={cn(
            item.className,
            card &&
              "h-8 max-h-10 sm:h-9",
            card &&
              (lightTile
                ? "drop-shadow-[0_1px_12px_rgb(15_23_42/_0.08)]"
                : "drop-shadow-[0_2px_24px_rgb(0_0_0/_0.45)]"),
          )}
        />
      );
    case "brilliant":
      return (
        <BrilliantLogo
          className={cn(
            item.logoClassName,
            card && "h-8 w-auto max-w-[min(100%,10rem)] sm:h-9 sm:max-w-[11rem]",
            card && !lightTile && "text-white/95",
          )}
        />
      );
    case "eighthLight":
      return (
        <EighthLightLogo
          className={cn(
            item.logoClassName,
            card &&
              "h-8 w-auto max-w-[min(100%,11rem)] sm:h-9 sm:max-w-[min(100%,12rem)]",
            card && !lightTile && "text-white/95",
          )}
        />
      );
    case "meshspire":
      return (
        <MeshspireLogo
          className={cn(
            item.logoClassName,
            card && "h-9 max-w-[min(100%,13rem)] sm:h-10 sm:max-w-[14rem]",
            card && !lightTile && "text-white/95",
          )}
        />
      );
    default: {
      const _exhaustive: never = item;
      return _exhaustive;
    }
  }
}
