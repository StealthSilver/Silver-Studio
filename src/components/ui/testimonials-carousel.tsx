"use client";

import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Quote } from "lucide-react";
import { useId } from "react";

export interface TestimonialSlideData {
  quote: string;
  name: string;
  role: string;
}

const layoutEase = [0.25, 0.1, 0.25, 1] as const;
const contentEase = [0.22, 1, 0.36, 1] as const;

interface SlideProps {
  slide: TestimonialSlideData;
  index: number;
  current: number;
  isActive: boolean;
  isNextPreview: boolean;
  widthPct: number;
  onSlideClick: (index: number) => void;
  prefersReducedMotion: boolean | null;
}

const Slide = ({
  slide,
  index,
  current,
  isActive,
  isNextPreview,
  widthPct,
  onSlideClick,
  prefersReducedMotion,
}: SlideProps) => {
  const reduce = Boolean(prefersReducedMotion);
  const layoutDuration = reduce ? 0 : 0.62;
  const contentDuration = reduce ? 0 : 0.46;
  const isHistory = index < current;

  return (
    <motion.li
      layout
      transition={{
        layout: {
          duration: layoutDuration,
          ease: layoutEase,
        },
      }}
      className="relative h-[360px] min-w-0 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-zinc-200/90 bg-white/45 px-5 py-6 shadow-[0_1px_0_rgb(255_255_255_/_0.65)_inset] backdrop-blur-md dark:border-white/12 dark:bg-zinc-950/35 dark:shadow-[inset_0_1px_0_rgb(255_255_255_/_0.06)] sm:h-[400px] sm:px-6 sm:py-7"
      style={{
        width: `${widthPct}%`,
        zIndex: isActive ? 2 : isNextPreview ? 1 : 0,
      }}
      onClick={() => onSlideClick(index)}
      role="group"
      aria-roledescription="slide"
      aria-current={isActive ? "true" : undefined}
      aria-label={`${index + 1}: ${slide.name}${isActive ? " (active)" : ""}`}
    >
      <motion.div
        className="flex h-full flex-col"
        animate={{
          opacity: isActive ? 1 : isNextPreview ? 0.78 : isHistory ? 0.54 : 0.42,
          scale: isActive ? 1 : 0.97,
        }}
        transition={{
          duration: contentDuration,
          ease: contentEase,
        }}
      >
        <Quote
          className="size-8 shrink-0 text-zinc-300 dark:text-zinc-600"
          strokeWidth={1.25}
          aria-hidden
        />
        <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-700 sm:text-[15px] dark:text-zinc-300">
          "{slide.quote}"
        </p>
        <footer className="mt-6 border-t border-zinc-200/80 pt-4 dark:border-white/10">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
            {slide.name}
          </p>
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{slide.role}</p>
        </footer>
      </motion.div>
    </motion.li>
  );
};

export interface TestimonialsCarouselProps {
  slides: TestimonialSlideData[];
  currentIndex: number;
  onCurrentIndexChange: (index: number) => void;
}

const ACTIVE_PCT = 72;
const INACTIVE_TOTAL_PCT = 100 - ACTIVE_PCT;

export function TestimonialsCarousel({
  slides,
  currentIndex: current,
  onCurrentIndexChange: setCurrent,
}: TestimonialsCarouselProps) {
  const id = useId();
  const prefersReducedMotion = useReducedMotion();
  const n = slides.length;
  const reduce = Boolean(prefersReducedMotion);

  const handleSlideClick = (index: number) => {
    if (index !== current) {
      setCurrent(index);
    }
  };

  const inactiveCount = n > 1 ? n - 1 : 0;
  const squishedEachPct =
    inactiveCount > 0 ? INACTIVE_TOTAL_PCT / inactiveCount : 0;

  const activeRole = slides[current]?.role ?? "";

  return (
    <div className="flex w-full flex-col" aria-labelledby={`testimonials-carousel-heading-${id}`}>
      <h3 id={`testimonials-carousel-heading-${id}`} className="sr-only">
        Testimonials carousel
      </h3>

      <div className="w-full overflow-hidden">
        <LayoutGroup id={`testimonials-carousel-${id}`}>
          <ul className="flex w-full max-w-full flex-row gap-2 sm:gap-3">
            {slides.map((slide, index) => {
              const isActive = index === current;
              const widthPct =
                n <= 1 ? 100 : isActive ? ACTIVE_PCT : squishedEachPct;
              const isNextPreview =
                n > 1 && !isActive && index === (current + 1) % n;

              return (
                <Slide
                  key={`${slide.name}-${slide.role}`}
                  slide={slide}
                  index={index}
                  current={current}
                  isActive={isActive}
                  isNextPreview={isNextPreview}
                  widthPct={widthPct}
                  onSlideClick={handleSlideClick}
                  prefersReducedMotion={prefersReducedMotion}
                />
              );
            })}
          </ul>
        </LayoutGroup>
      </div>

      <motion.p
        key={current}
        aria-live="polite"
        className="mt-6 w-full max-w-[min(100%,55vw)] text-left font-mono text-xs uppercase leading-snug tracking-[0.14em] text-zinc-600 sm:mt-8 sm:text-sm md:mt-10 dark:text-zinc-400"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: reduce ? 0 : 0.28, ease: contentEase }}
      >
        {activeRole}
      </motion.p>
    </div>
  );
}
