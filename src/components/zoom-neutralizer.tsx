"use client";

import { useEffect } from "react";

/** Browser zoom clamp for compensation math (requested ~50–150%). */
const ZOOM_EXTENT_MIN = 0.5;
const ZOOM_EXTENT_MAX = 1.5;

function clampZoomExtent(scale: number): number {
  return Math.min(ZOOM_EXTENT_MAX, Math.max(ZOOM_EXTENT_MIN, scale));
}

/**
 * Undo visual page zoom from Ctrl/Cmd +/-/0 on desktop-ish pointers by setting inverse
 * `zoom` on the root element. Keeps perceived layout/CSS pixel dimensions steady in
 * Chromium/WebKit/Safari; coarse pointers are skipped so mobile pinch-zoom still works.
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
        const desktopLike = window.matchMedia(
          "(hover: hover) and (pointer: fine)",
        ).matches;
        if (!desktopLike) {
          root.style.removeProperty("zoom");
          return;
        }

        const s = clampZoomExtent(vv.scale);
        if (Math.abs(s - 1) < 0.001) root.style.removeProperty("zoom");
        else root.style.zoom = `${1 / s}`;
      });
    };

    apply();
    vv.addEventListener("resize", apply);
    vv.addEventListener("scroll", apply);
    window.addEventListener("resize", apply);

    return () => {
      cancelAnimationFrame(raf);
      vv.removeEventListener("resize", apply);
      vv.removeEventListener("scroll", apply);
      window.removeEventListener("resize", apply);
      root.style.removeProperty("zoom");
    };
  }, []);

  return null;
}
