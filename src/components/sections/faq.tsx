"use client";

import { ChevronDown } from "lucide-react";
import { useCallback, useId, useMemo, useState } from "react";

import type { FaqItem } from "@/data/site";
import { faqSection } from "@/data/site";
import { cn } from "@/lib/utils";

const faqAccordionItemClass = (isOpen: boolean) =>
  cn(
    "rounded-2xl border border-border/80 bg-muted/35 shadow-sm backdrop-blur-xl transition-[border-color,box-shadow]",
    "dark:border-white/[0.12] dark:bg-white/[0.06] dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.1),0_12px_40px_rgb(0_0_0_/_0.35)]",
    isOpen
      ? "border-zinc-400/80 shadow-md dark:border-white/20"
      : "hover:border-zinc-300/90 dark:hover:border-white/18",
  );

function FaqAccordion({ idPrefix, items }: { idPrefix: string; items: readonly FaqItem[] }) {
  const reactId = useId();
  const base = useMemo(
    () => idPrefix.replace(/[^a-z0-9-]/gi, "-") || "faq",
    [idPrefix],
  );
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const onToggle = useCallback((idx: number) => {
    setOpenIndex((cur) => (cur === idx ? null : idx));
  }, []);

  return (
    <div className="space-y-3 sm:space-y-3.5">
      {items.map((item, idx) => {
        const slug = `${base}-${reactId}-${idx}`;
        const panelId = `${slug}-panel`;
        const triggerId = `${slug}-trigger`;
        const isOpen = openIndex === idx;
        const itemNum = String(idx + 1).padStart(2, "0");

        return (
          <div key={item.question} className={faqAccordionItemClass(isOpen)}>
            <h3>
              <button
                type="button"
                id={triggerId}
                className={cn(
                  "flex w-full cursor-pointer items-start justify-between gap-4 rounded-2xl px-4 py-4 text-left outline-none transition-colors sm:px-5 sm:py-5",
                  "focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-zinc-950",
                )}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => onToggle(idx)}
              >
                <span className="flex min-w-0 flex-1 flex-col items-start gap-1.5 sm:flex-row sm:items-baseline sm:gap-4">
                  <span
                    className="shrink-0 font-mono text-[11px] font-medium tabular-nums tracking-[0.35em] text-muted-foreground sm:text-xs"
                    aria-hidden
                  >
                    {itemNum}
                  </span>
                  <span className="min-w-0 text-sm font-semibold leading-snug text-foreground sm:text-[15px] [font-family:var(--font-ibm-plex-sans)]">
                    {item.question}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "mt-0.5 size-5 shrink-0 text-muted-foreground transition-transform duration-200 motion-reduce:transition-none",
                    isOpen ? "rotate-180" : "",
                  )}
                  aria-hidden
                  strokeWidth={2}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              aria-hidden={!isOpen}
              className={cn(
                "grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="min-h-0">
                <div className="border-t border-zinc-950/[0.06] px-4 pb-5 pt-3 text-sm leading-relaxed text-muted-foreground sm:px-5 sm:text-[15px] sm:leading-relaxed dark:border-white/[0.12]">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function Faq() {
  const { id, sectionAriaLabel, heading, intro, items } = faqSection;
  const phaseLabel = heading.toUpperCase();

  return (
    <section
      id={id}
      aria-label={sectionAriaLabel}
      className="w-full scroll-mt-28 border-t border-zinc-950/[0.06] bg-background text-foreground dark:border-white/15"
    >
      <div className="mx-auto box-border flex w-full max-w-7xl flex-col gap-10 px-5 py-14 sm:gap-12 sm:px-8 sm:py-16 md:gap-14 lg:flex-row lg:items-start lg:justify-between lg:gap-12 lg:px-12 lg:py-20 xl:gap-16">
        <header className="flex max-w-xl shrink-0 flex-col lg:sticky lg:top-28 lg:max-w-[min(52%,560px)]">
          <span className="font-mono text-xs font-medium tracking-[0.35em] text-muted-foreground sm:text-sm">
            COMMON QUESTIONS
          </span>
          <h2 className="mt-2 text-xl font-semibold tracking-[0.14em] sm:text-2xl [font-family:var(--font-ibm-plex-sans)]">
            {phaseLabel}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400">
            {intro}
          </p>
        </header>

        <div className="min-w-0 flex-1 lg:max-w-[min(100%,640px)] lg:pt-1 xl:max-w-none">
          <FaqAccordion idPrefix={id} items={items} />
        </div>
      </div>
    </section>
  );
}
