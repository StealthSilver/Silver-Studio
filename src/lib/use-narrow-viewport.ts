"use client";

import { useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/** Matches Tailwind `md` (768px). Below this we use natural scroll (no pin / long runways). */
export const NARROW_VIEWPORT_MAX_PX = 767;

const QUERY = `(max-width: ${NARROW_VIEWPORT_MAX_PX}px)`;

/**
 * Narrow layout must NOT flip on the first client render (`useSyncExternalStore` snapshots
 * can disagree with SSR), or hydration tears down DOM that never matched.
 *
 * GSAP ScrollTrigger `pin` re-parents DOM. If we toggle to narrow while pins are active,
 * React can run `commitDeletion` before layouts clean up → `removeChild` NotFoundError.
 * So whenever we enter narrow, kill triggers first (`revert: true`), then React may swap trees.
 */
function killAllScrollTriggers() {
  if (typeof window === "undefined") return;
  try {
    ScrollTrigger.getAll().forEach((t) => t.kill(true));
  } catch {
    /* ignore teardown races */
  }
}

/** True when viewport is narrow enough to prefer normal scroll over ScrollTrigger pin/stack. */
export function useNarrowViewport(): boolean {
  const [narrow, setNarrow] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia(QUERY);

    const sync = () => {
      const next = mq.matches;
      if (next) {
        killAllScrollTriggers();
      }
      setNarrow(next);
    };

    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return narrow;
}
