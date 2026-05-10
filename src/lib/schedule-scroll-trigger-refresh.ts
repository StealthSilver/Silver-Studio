import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Runs ScrollTrigger.refresh after DOM commit and next frame — use when mounting
 * pinned ScrollTrigger sections or after sibling layout height changes (Work stack, images).
 */
export function scheduleScrollTriggerRefresh(): void {
  /** Double rAF: run after the browser’s layout pass (avoids double `refresh()` in one frame). */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      ScrollTrigger.refresh();
    });
  });
}
