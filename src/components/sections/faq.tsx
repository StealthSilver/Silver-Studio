"use client";

import { ChevronDown } from "lucide-react";
import { useCallback, useId, useMemo, useState } from "react";

import type { FaqItem } from "@/data/site";
import { faqSection } from "@/data/site";
import { cn } from "@/lib/utils";

/** Same full-bleed rule + heading scale as `Services` / `Process`. */
const FULL_BLEED_ROW =
  "relative w-screen max-w-[100vw] shrink-0 ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]";

const FAQ_HEADING_CLASS =
  "text-left text-2xl font-normal uppercase leading-[1.08] tracking-[0.06em] text-foreground sm:text-3xl md:text-4xl lg:text-[2.75rem]";

function FaqPreRuleSpacer() {
  return <div className="h-10 shrink-0 sm:h-14 lg:h-16" aria-hidden />;
}

function FaqTopRule() {
  return (
    <div className={FULL_BLEED_ROW}>
      <div className="border-t border-border/70 dark:border-border/50" aria-hidden />
    </div>
  );
}

function FaqHeading({ headingId }: { headingId: string }) {
  return (
    <div className="flex w-full justify-center px-4 pt-[4.25rem] pb-6 sm:px-6 sm:pt-20 sm:pb-8 lg:px-8 lg:pt-24">
      <div className="flex w-full max-w-7xl items-start justify-between gap-6">
        <div className="min-w-0 max-w-[min(100%,44rem)] pr-2">
          <h2 id={headingId} className={FAQ_HEADING_CLASS}>
            COMMON QUESTIONS
          </h2>
        </div>
      </div>
    </div>
  );
}

/** Same spacing as `ProcessHeadingToBlocksSpacer`. */
function FaqHeadingToAccordionSpacer() {
  return <div className="h-6 shrink-0 sm:h-8 lg:h-10" aria-hidden />;
}

const faqAccordionItemClass = (isOpen: boolean) =>
  cn(
    "rounded-2xl border border-border/80 bg-muted/35 shadow-sm backdrop-blur-xl transition-[border-color,box-shadow]",
    "dark:border-border/55 dark:bg-card/38",
    isOpen
      ? "border-border dark:border-border/80 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.08)]"
      : "dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.08),0_12px_40px_rgb(0_0_0_/_0.35)] hover:border-border dark:hover:border-border/65",
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
                  "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
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
                  <span className="min-w-0 text-sm font-semibold leading-snug text-foreground sm:text-[15px]">
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
                <div className="border-t border-border/60 px-4 pb-5 pt-3 text-sm leading-relaxed text-muted-foreground sm:px-5 sm:text-[15px] sm:leading-relaxed">
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
  const { id, items } = faqSection;
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="w-full scroll-mt-28 bg-background text-foreground sm:scroll-mt-32"
    >
      <FaqPreRuleSpacer />
      <FaqTopRule />
      <FaqHeading headingId={headingId} />
      <FaqHeadingToAccordionSpacer />
      <div className="mx-auto box-border w-full max-w-7xl px-5 pb-14 sm:px-8 sm:pb-16 lg:px-12 lg:pb-20">
        <FaqAccordion idPrefix={id} items={items} />
      </div>
    </section>
  );
}
