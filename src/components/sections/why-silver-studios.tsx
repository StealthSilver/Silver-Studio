import { Focus, Handshake, Layers, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { WhyIconId } from "@/data/site";
import { whySection } from "@/data/site";

const WHY_ICONS: Record<WhyIconId, LucideIcon> = {
  precision: Focus,
  velocity: Zap,
  signal: Layers,
  partnership: Handshake,
};

const iconTileClass =
  "flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-2xl border border-border/90 bg-secondary/95 text-foreground/85 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.72)] dark:border-border/55 dark:bg-muted/55 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)]";

const iconStroke = 1.65;

const cardSurfaceClass =
  "relative flex h-full flex-col rounded-2xl border border-border/90 bg-card/48 px-5 py-6 shadow-[0_1px_0_rgb(255_255_255_/_0.65)_inset] backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-200 sm:px-6 sm:py-7 dark:border-border/55 dark:bg-card/42 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)] hover:border-border hover:shadow-[0_8px_30px_rgb(15_23_42_/_0.05)] dark:hover:border-border/75 dark:hover:shadow-[0_12px_40px_rgb(0_0_0_/_0.35)]";

export function WhySilverStudios() {
  const { id, sectionAriaLabel, heading, intro, items } = whySection;

  return (
    <section
      id={id}
      aria-label={sectionAriaLabel}
      className="w-full scroll-mt-28 border-t border-border/70 pt-16 sm:scroll-mt-32 sm:pt-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-left text-3xl font-semibold tracking-tight text-foreground sm:text-4xl [font-family:var(--font-ibm-plex-sans)]">
            {heading}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
            {intro}
          </p>
        </div>

        <ul className="mt-12 grid list-none grid-cols-1 gap-4 p-0 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:gap-6">
          {items.map((item) => {
            const Icon = WHY_ICONS[item.icon];
            return (
              <li key={item.title} className="min-w-0">
                <article className={cardSurfaceClass}>
                  <div className="flex gap-4">
                    <div className={iconTileClass} aria-hidden>
                      <Icon className="h-10 w-10" strokeWidth={iconStroke} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl [font-family:var(--font-ibm-plex-sans)]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
