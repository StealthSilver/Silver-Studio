"use client";

import { ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Show once the user has scrolled a short distance from the top. */
const SHOW_AFTER_SCROLL_Y = 72;

export function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const update = () => setVisible(window.scrollY > SHOW_AFTER_SCROLL_Y);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      aria-label="Scroll to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed bottom-6 right-4 z-40 rounded-[6px] shadow-md transition-opacity duration-200 sm:right-6",
        visible ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={() => {
        const reduceMotion = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        ).matches;
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: reduceMotion ? "auto" : "smooth",
        });
      }}
    >
      <ChevronUp className="size-4" aria-hidden />
    </Button>
  );
}
