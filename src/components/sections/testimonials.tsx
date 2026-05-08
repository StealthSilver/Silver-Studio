import { Quote } from "lucide-react";

import { testimonialsSection } from "@/data/site";

export function Testimonials() {
  const { id, sectionAriaLabel, heading, intro, items } = testimonialsSection;

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

        <ul className="mt-12 grid list-none grid-cols-1 gap-4 p-0 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {items.map((item) => (
            <li key={`${item.quote.slice(0, 24)}-${item.role}`} className="min-w-0">
              <blockquote
                className={[
                  "flex h-full flex-col rounded-2xl border border-zinc-200/90 bg-white/45 px-5 py-6 shadow-[0_1px_0_rgb(255_255_255_/_0.65)_inset] backdrop-blur-md sm:px-6 sm:py-7",
                  "dark:border-white/12 dark:bg-zinc-950/35 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)]",
                ].join(" ")}
              >
                <Quote
                  className="size-8 text-zinc-300 dark:text-zinc-600"
                  strokeWidth={1.25}
                  aria-hidden
                />
                <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-700 sm:text-[15px] dark:text-zinc-300">
                  “{item.quote}”
                </p>
                <footer className="mt-6 border-t border-zinc-200/80 pt-4 dark:border-white/10">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {item.name}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{item.role}</p>
                </footer>
              </blockquote>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
