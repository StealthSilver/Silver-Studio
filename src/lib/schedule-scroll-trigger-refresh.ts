import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Runs ScrollTrigger.refresh after DOM commit and next frame — use when mounting
 * pinned ScrollTrigger sections or after sibling layout height changes (Work stack, images).
 */
export function scheduleScrollTriggerRefresh(): void {
  queueMicrotask(() => {
    ScrollTrigger.refresh();
  });
  requestAnimationFrame(() => {
    ScrollTrigger.refresh();
  });
}
