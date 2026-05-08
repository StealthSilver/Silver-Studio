import type { FC } from "react";

import { processSection } from "@/data/site";

import {
  DeploymentAnimation,
  DesignAnimation,
  DevelopmentAnimation,
  DirectionAnimation,
  DiscoveryAnimation,
} from "./process-animations";

import "@/styles/process-section.css";

const glassPanelClass =
  "flex aspect-square h-[min(28vh,260px)] w-[min(28vh,260px)] shrink-0 items-center justify-center rounded-2xl border border-border/80 bg-muted/35 p-6 shadow-sm backdrop-blur-xl dark:border-white/[0.12] dark:bg-white/[0.06] dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.1),0_12px_40px_rgb(0_0_0_/_0.35)]";

const STEP_ANIMATIONS = {
  Discovery: DiscoveryAnimation,
  Direction: DirectionAnimation,
  Design: DesignAnimation,
  Development: DevelopmentAnimation,
  Deployment: DeploymentAnimation,
} as const satisfies Record<(typeof processSection.steps)[number]["title"], FC>;

export function Process() {
  const { id, sectionAriaLabel, steps } = processSection;

  return (
    <section
      id={id}
      aria-label={sectionAriaLabel}
      className="w-full scroll-mt-28 border-t border-zinc-950/[0.06] bg-background text-foreground dark:border-white/15"
    >
      <ul className="m-0 flex list-none flex-col p-0">
        {steps.map((step, index) => {
          const num = String(index + 1).padStart(2, "0");
          const Animation = STEP_ANIMATIONS[step.title];
          const phase = step.title.toUpperCase();

          return (
            <li key={step.title} className="m-0 border-t border-zinc-950/[0.055] p-0 first:border-t-0 dark:border-white/[0.12]">
              <article className="flex min-h-[50vh] flex-col gap-8 px-5 py-8 sm:px-8 md:flex-row md:items-start md:justify-between md:gap-10 lg:px-12 xl:mx-auto xl:max-w-7xl">
                <div className="flex min-w-0 flex-1 flex-col items-start justify-start md:max-w-[min(52%,560px)]">
                  <span className="font-mono text-xs font-medium tracking-[0.35em] text-muted-foreground sm:text-sm">
                    {num}
                  </span>
                  <h2 className="mt-2 text-xl font-semibold tracking-[0.14em] sm:text-2xl [font-family:var(--font-ibm-plex-sans)]">
                    {phase}
                  </h2>
                  <p
                    className="mt-4 w-full truncate text-sm text-muted-foreground sm:text-[15px]"
                    title={step.description}
                  >
                    {step.description}
                  </p>
                </div>

                <div className={glassPanelClass}>
                  <Animation />
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
