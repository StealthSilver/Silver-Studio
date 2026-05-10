"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { WORK_STACK_RUNWAY_VH } from "@/lib/work-stack-constants";
import { useNarrowViewport } from "@/lib/use-narrow-viewport";

type WorkStackSlideProps = {
  itemSlug: string;
  index: number;
  total: number;
  children: ReactNode;
};

/* Long band on this slide’s runway = slow, readable “falls behind” while the next panel overlaps. */
const DROP_START = 0.2;
const DROP_END = 0.98;

/** Smaller under the next slide + stronger downward drift toward the bottom of the viewport. */
const SCALE_END = 0.58;
const DROP_Y_MAX_PX = 460;

/** Ease-in: >1 = starts slow; lower exponent = more visible motion mid-scroll. */
const DROP_EASE_EXPONENT = 1.18;

export function WorkStackSlide({
  itemSlug,
  index,
  total,
  children,
}: WorkStackSlideProps) {
  const ref = useRef<HTMLLIElement | null>(null);
  const reduceMotion = useReducedMotion();
  const narrowViewport = useNarrowViewport();
  const isLast = index === total - 1;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const dropRange = DROP_END - DROP_START;

  const y = useTransform(scrollYProgress, (p) => {
    if (narrowViewport || reduceMotion || isLast) return 0;
    const t = Math.min(1, Math.max(0, (p - DROP_START) / dropRange));
    const eased = Math.pow(t, DROP_EASE_EXPONENT);
    return eased * DROP_Y_MAX_PX;
  });

  const scale = useTransform(scrollYProgress, (p) => {
    if (narrowViewport || reduceMotion || isLast) return 1;
    const t = Math.min(1, Math.max(0, (p - DROP_START) / dropRange));
    const eased = Math.pow(t, DROP_EASE_EXPONENT);
    return 1 - eased * (1 - SCALE_END);
  });

  if (narrowViewport) {
    return (
      <li
        ref={ref}
        className="work-showcase work-showcase--simple text-foreground pb-0"
        style={{ height: "auto", zIndex: index + 1 }}
        data-work={itemSlug}
      >
        <div className="work-showcase__panel relative w-full overflow-hidden rounded-2xl shadow-sm md:rounded-3xl">
          <div className="relative min-h-0">{children}</div>
        </div>
      </li>
    );
  }

  return (
    <li
      ref={ref}
      className="work-showcase text-foreground"
      style={{
        height: `${WORK_STACK_RUNWAY_VH}vh`,
        zIndex: index + 1,
      }}
      data-work={itemSlug}
    >
      <div className="sticky top-0 h-screen min-h-screen w-full overflow-hidden">
        <motion.div
          className="work-showcase__panel relative h-full min-h-screen w-full origin-top overflow-hidden rounded-3xl will-change-transform"
          style={{ y, scale }}
        >
          {children}
        </motion.div>
      </div>
    </li>
  );
}
