"use client";

import { useEffect } from "react";

/** Browser zoom clamp for compensation math (requested ~50–150%). */
const ZOOM_EXTENT_MIN = 0.5;
const ZOOM_EXTENT_MAX = 1.5;

const DESKTOP_LIKE_MQ = "(hover: hover) and (pointer: fine)";

function clampZoomExtent(scale: number): number {
  return Math.min(ZOOM_EXTENT_MAX, Math.max(ZOOM_EXTENT_MIN, scale));
}

function isDesktopLikePointer(): boolean {
  return window.matchMedia(DESKTOP_LIKE_MQ).matches;
}

/** Ctrl/Cmd + +/-/0 (and numpad) — block so the tab scale does not change from shortcuts. */
function isKeyboardBrowserZoom(e: KeyboardEvent): boolean {
  if (!e.ctrlKey && !e.metaKey) return false;
  if (e.altKey) return false;

  switch (e.code) {
    case "Equal":
    case "Minus":
    case "Digit0":
    case "NumpadAdd":
    case "NumpadSubtract":
    case "Numpad0":
      return true;
    default:
      return false;
  }
}

/**
 * 1) Block Ctrl/Cmd +/-/0 and Ctrl+wheel zoom on fine-pointer desktops so shortcuts do not
 *    change the browser’s page scale.
 * 2) For any remaining zoom in ~50–150% (e.g. menu / prior session), apply inverse `zoom`
 *    on `<html>` so layout matches 100% CSS pixels. Coarse pointers skip both so mobile
 *    pinch-zoom still works.
 *
 * Important: avoids a scaled wrapper so `position: fixed` stays viewport-relative.
 */
export function ZoomNeutralizer() {
  useEffect(() => {
    const root = document.documentElement;
    const vv = window.visualViewport;
    if (!vv) return;

    let raf = 0;

    const apply = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!isDesktopLikePointer()) {
          root.style.removeProperty("zoom");
          return;
        }

        const s = clampZoomExtent(vv.scale);
        if (Math.abs(s - 1) < 0.001) root.style.removeProperty("zoom");
        else root.style.zoom = `${1 / s}`;
      });
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (!isDesktopLikePointer()) return;
      if (!isKeyboardBrowserZoom(e)) return;
      e.preventDefault();
      e.stopPropagation();
    };

    /** Chrome/macOS: pinch and Ctrl+scroll use wheel+ctrlKey to change page scale. */
    const onWheel = (e: WheelEvent) => {
      if (!isDesktopLikePointer()) return;
      if (!e.ctrlKey) return;
      e.preventDefault();
    };

    apply();
    vv.addEventListener("resize", apply);
    vv.addEventListener("scroll", apply);
    window.addEventListener("resize", apply);
    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("wheel", onWheel, { capture: true, passive: false });

    return () => {
      cancelAnimationFrame(raf);
      vv.removeEventListener("resize", apply);
      vv.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("wheel", onWheel, { capture: true });
      root.style.removeProperty("zoom");
    };
  }, []);

  return null;
}
