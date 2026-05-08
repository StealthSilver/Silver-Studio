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
  "flex h-[62px] w-[62px] shrink-0 items-center justify-center rounded-2xl border border-zinc-200/90 bg-zinc-50/90 text-zinc-700 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.7)] dark:border-white/12 dark:bg-zinc-900/50 dark:text-zinc-200 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)]";

const iconStroke = 1.65;

const cardSurfaceClass =
  "relative flex h-full flex-col rounded-2xl border border-zinc-200/90 bg-white/45 px-5 py-6 shadow-[0_1px_0_rgb(255_255_255_/_0.65)_inset] backdrop-blur-md transition-[border-color,box-shadow,background-color] duration-200 sm:px-6 sm:py-7 dark:border-white/12 dark:bg-zinc-950/35 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)] hover:border-zinc-300/95 hover:shadow-[0_8px_30px_rgb(24_24_27_/_0.06)] dark:hover:border-white/18 dark:hover:shadow-[0_12px_40px_rgb(0_0_0_/_0.35)]";

export function WhySilverStudios() {
  const { id, sectionAriaLabel, heading, intro, items } = whySection;

  return (
    <section
      id={id}
      aria-label={sectionAriaLabel}
      className="w-full scroll-mt-28 border-t border-zinc-200/70 pt-16 dark:border-zinc-800/80 sm:scroll-mt-32 sm:pt-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="max-w-2xl">
          <h2 className="text-left text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]">
            {heading}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-[15px] dark:text-zinc-400">
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
                      <h3 className="text-lg font-semibold tracking-tight text-zinc-900 sm:text-xl dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-[15px] dark:text-zinc-400">
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
