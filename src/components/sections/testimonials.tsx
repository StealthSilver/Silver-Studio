"use client";

import { useState } from "react";
import { ArrowRight, Quote } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";

import { testimonialsSection } from "@/data/site";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const { id, sectionAriaLabel, heading, intro, items } = testimonialsSection;
  const [activeIndex, setActiveIndex] = useState(0);
  const slideCount = items.length;
  const prefersReducedMotion = useReducedMotion();
  const activeItem = items[activeIndex];

  const goToPreviousSlide = () => {
    setActiveIndex((index) => (index - 1 < 0 ? slideCount - 1 : index - 1));
  };

  const goToNextSlide = () => {
    setActiveIndex((index) => (index + 1 === slideCount ? 0 : index + 1));
  };

  return (
    <section
      id={id}
      aria-label={sectionAriaLabel}
      className="w-full scroll-mt-28 border-t border-zinc-200/70 pt-16 dark:border-zinc-800/80 sm:scroll-mt-32 sm:pt-20"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 sm:gap-10">
        <div className="flex w-full flex-wrap items-start justify-between gap-6 sm:gap-8">
          <div className="max-w-2xl">
            <h2 className="text-left text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]">
              {heading}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600 sm:text-[15px] dark:text-zinc-400">
              {intro}
            </p>
          </div>
          {slideCount > 1 && (
            <div
              className="ml-auto flex items-center gap-2 sm:gap-3"
              role="group"
              aria-label="Testimonials carousel navigation"
            >
              <button
                type="button"
                className={cn(
                  "grid size-10 place-items-center rounded-full border border-zinc-200/80 bg-white/80 text-zinc-900 transition-colors hover:border-zinc-300 hover:bg-white dark:border-white/15 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:border-white/30 dark:hover:bg-zinc-900/80",
                  "[&_svg]:size-4",
                )}
                title="Show previous testimonial"
                onClick={goToPreviousSlide}
              >
                <ArrowRight className="rotate-180" aria-hidden />
              </button>
              <button
                type="button"
                className={cn(
                  "grid size-10 place-items-center rounded-full border border-zinc-200/80 bg-white/80 text-zinc-900 transition-colors hover:border-zinc-300 hover:bg-white dark:border-white/15 dark:bg-zinc-900/60 dark:text-zinc-100 dark:hover:border-white/30 dark:hover:bg-zinc-900/80",
                  "[&_svg]:size-4",
                )}
                title="Show next testimonial"
                onClick={goToNextSlide}
              >
                <ArrowRight aria-hidden />
              </button>
            </div>
          )}
        </div>

        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:gap-8">
          <div className="relative min-h-[320px] rounded-2xl border border-zinc-200/90 bg-white/45 p-6 shadow-[0_1px_0_rgb(255_255_255_/_0.65)_inset] backdrop-blur-md dark:border-white/12 dark:bg-zinc-950/35 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)] sm:p-8">
            <AnimatePresence mode="wait" initial={false}>
              <motion.blockquote
                key={`${activeItem.name}-${activeItem.role}`}
                initial={prefersReducedMotion ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, y: -10 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-full flex-col"
              >
                <Quote
                  className="size-9 text-zinc-300 dark:text-zinc-600"
                  strokeWidth={1.25}
                  aria-hidden
                />
                <p className="mt-5 flex-1 text-lg leading-relaxed text-zinc-800 sm:text-xl dark:text-zinc-200">
                  "{activeItem.quote}"
                </p>
                <footer className="mt-8 border-t border-zinc-200/80 pt-5 dark:border-white/10">
                  <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-900 dark:text-zinc-50">
                    {activeItem.name}
                  </p>
                  <p className="mt-1 text-xs font-mono uppercase tracking-[0.12em] text-zinc-500 dark:text-zinc-400">
                    {activeItem.role}
                  </p>
                </footer>
              </motion.blockquote>
            </AnimatePresence>
          </div>

          <div className="relative min-h-[320px] overflow-hidden rounded-2xl border border-zinc-200/90 shadow-[0_1px_0_rgb(255_255_255_/_0.65)_inset] dark:border-white/12 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`visual-${activeIndex}`}
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={prefersReducedMotion ? {} : { opacity: 0, scale: 0.98 }}
                transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0"
                aria-hidden
              >
                <div className="absolute inset-0 bg-[radial-gradient(85%_75%_at_20%_15%,#dbeafe_0%,transparent_52%),radial-gradient(70%_85%_at_80%_25%,#c4b5fd_0%,transparent_58%),radial-gradient(85%_90%_at_50%_100%,#99f6e4_0%,transparent_60%),linear-gradient(140deg,#ffffff_0%,#ecfeff_38%,#eef2ff_100%)] dark:bg-[radial-gradient(85%_75%_at_20%_15%,#1d4ed8_0%,transparent_55%),radial-gradient(70%_85%_at_80%_25%,#6d28d9_0%,transparent_60%),radial-gradient(85%_90%_at_50%_100%,#0f766e_0%,transparent_62%),linear-gradient(140deg,#09090b_0%,#111827_45%,#1f2937_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.45),rgba(255,255,255,0.1))] dark:bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.14),rgba(255,255,255,0.03))]" />
              </motion.div>
            </AnimatePresence>
            <div className="relative z-10 flex h-full min-h-[320px] flex-col justify-end p-6 sm:p-8">
              <p className="text-xs font-mono uppercase tracking-[0.14em] text-zinc-700/80 dark:text-zinc-200/75">
                Testimonial {activeIndex + 1} / {slideCount}
              </p>
              <p className="mt-3 max-w-[22ch] text-xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)] sm:text-2xl">
                What clients say when the work lands right.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
