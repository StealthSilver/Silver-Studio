"use client";

import { ChevronDown } from "lucide-react";
import { useCallback, useId, useMemo, useState } from "react";

import type { FaqItem } from "@/data/site";
import { faqSection } from "@/data/site";

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
    <div className="space-y-3 sm:space-y-4">
      {items.map((item, idx) => {
        const slug = `${base}-${reactId}-${idx}`;
        const panelId = `${slug}-panel`;
        const triggerId = `${slug}-trigger`;
        const isOpen = openIndex === idx;

        return (
          <div
            key={item.question}
            className={[
              "rounded-2xl border border-zinc-200/90 bg-white/40 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.65)] backdrop-blur-md transition-[border-color,box-shadow] dark:border-white/12 dark:bg-zinc-950/35 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)]",
              isOpen
                ? "border-zinc-300/95 dark:border-white/18"
                : "hover:border-zinc-300/95 dark:hover:border-white/14",
            ].join(" ")}
          >
            <h3>
              <button
                type="button"
                id={triggerId}
                className={[
                  "flex w-full cursor-pointer items-center justify-between gap-4 rounded-2xl px-4 py-4 text-left outline-none transition-colors sm:px-5 sm:py-5",
                  "focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-zinc-950",
                ].join(" ")}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => onToggle(idx)}
              >
                <span className="text-sm font-semibold leading-snug text-zinc-900 sm:text-[15px] dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]">
                  {item.question}
                </span>
                <ChevronDown
                  className={[
                    "size-5 shrink-0 text-zinc-500 transition-transform duration-200 motion-reduce:transition-none dark:text-zinc-400",
                    isOpen ? "rotate-180" : "",
                  ].join(" ")}
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
              className={[
                "grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              ].join(" ")}
            >
              <div className="min-h-0">
                <div className="border-t border-zinc-200/70 px-4 pb-5 pt-3 text-sm leading-relaxed text-zinc-600 sm:px-5 sm:text-[15px] sm:leading-relaxed dark:border-white/10 dark:text-zinc-400">
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

        <div className="mx-auto mt-12 max-w-3xl sm:mt-14">
          <FaqAccordion idPrefix={id} items={items} />
        </div>
      </div>
    </section>
  );
}
