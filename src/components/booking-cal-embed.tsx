"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

import { useTheme } from "@/components/theme-provider";
import { booking } from "@/lib/booking";
import { cn } from "@/lib/utils";

const Cal = dynamic(
  () => import("@calcom/embed-react").then((m) => m.default),
  {
    ssr: false,
    loading: () => <BookingCalSkeleton />,
  },
);

function BookingCalSkeleton() {
  return (
    <div
      className={cn(
        "flex min-h-[min(78vh,780px)] w-full items-center justify-center sm:min-h-[min(72vh,720px)]",
        "bg-background",
      )}
    >
      <p className="text-sm text-muted-foreground">Loading calendar…</p>
    </div>
  );
}

/**
 * Cal.com embed namespace. `getCalApi({ namespace })` and `<Cal namespace>` must match
 * so the `cal('ui', …)` instruction targets the same iframe.
 */
const CAL_NAMESPACE = "silver-studio";

/**
 * Site palette → Cal.com booker tokens. Mirrors `globals.css` so the booker reads as a
 * native section of the page in both themes (no halo, no off-white card on dark, etc.).
 *
 * Cal.com `cssVarsPerTheme` keys are written without the `--` prefix.
 * Reference: https://github.com/calcom/cal.com/blob/main/packages/config/theme/tokens.css
 */
const CAL_LIGHT_VARS = {
  // Surfaces
  "cal-bg-muted": "#f5f9fc", // page canvas (matches site --background)
  "cal-bg": "#ffffff", // booker card (matches site --card)
  "cal-bg-subtle": "#eef2f5", // matches site --secondary / --muted
  "cal-bg-emphasis": "#dce3ea", // hover/selected, matches site --border tone
  "cal-bg-inverted": "#0f172a", // matches site --foreground

  // Primary surfaces (used for buttons / pills inside the booker)
  "cal-bg-primary": "#0f172a",
  "cal-bg-primary-emphasis": "#1e293b",
  "cal-bg-primary-muted": "#eef2f5",

  // Borders
  "cal-border": "#dce3ea", // site --border
  "cal-border-subtle": "#e2e8f0",
  "cal-border-muted": "#eef2f5",
  "cal-border-emphasis": "#94a3b8", // site --ring
  "cal-border-booker": "#dce3ea",

  // Text
  "cal-text-emphasis": "#0f172a", // site --foreground
  "cal-text": "#0f172a",
  "cal-text-subtle": "#475569", // slate-600
  "cal-text-muted": "#64748b", // site --muted-foreground
  "cal-text-inverted": "#ffffff",

  // Brand (CTA chips / selected slot)
  "cal-brand": "#0f172a",
  "cal-brand-emphasis": "#1e293b",
  "cal-brand-text": "#ffffff",
} as const;

const CAL_DARK_VARS = {
  // Surfaces
  "cal-bg-muted": "#0b1215", // matches site .dark --background
  "cal-bg": "#151f24", // matches site .dark --card / --popover
  "cal-bg-subtle": "#11191d", // matches site .dark --secondary / --muted
  "cal-bg-emphasis": "#1b262d", // matches site .dark --accent
  "cal-bg-inverted": "#f5f9fc",

  // Primary (light pill on dark)
  "cal-bg-primary": "#fafafa",
  "cal-bg-primary-emphasis": "#e4e4e7",
  "cal-bg-primary-muted": "#1b262d",

  // Borders
  "cal-border": "#253038", // site .dark --border
  "cal-border-subtle": "#1b262d",
  "cal-border-muted": "#11191d",
  "cal-border-emphasis": "#475569",
  "cal-border-booker": "#253038",

  // Text
  "cal-text-emphasis": "#fafafa",
  "cal-text": "#e5e7eb",
  "cal-text-subtle": "#94a3b8",
  "cal-text-muted": "#64748b",
  "cal-text-inverted": "#0b1215",

  // Brand
  "cal-brand": "#fafafa",
  "cal-brand-emphasis": "#ffffff",
  "cal-brand-text": "#0b1215",
} as const;

/**
 * Inline Cal.com booker styled to track site light/dark tokens 1:1.
 *
 * Implementation notes:
 * - Theme swaps via `cal('ui', { theme, cssVarsPerTheme })`. We don't remount the iframe
 *   on theme change so the visit/session inside Cal stays intact and there's no flash.
 * - Surrounding shell is transparent so the booker's `cal-bg-muted` (= site background)
 *   carries through; the modal card already provides the rounded border + shadow.
 */
export function BookingCalEmbed({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { getCalApi } = await import("@calcom/embed-react");
      const cal = await getCalApi({ namespace: CAL_NAMESPACE });
      if (cancelled) return;
      cal("ui", {
        theme,
        hideEventTypeDetails: false,
        layout: "month_view",
        cssVarsPerTheme: {
          light: { ...CAL_LIGHT_VARS },
          dark: { ...CAL_DARK_VARS },
        },
        styles: {
          branding: {
            brandColor: theme === "dark" ? "#fafafa" : "#0f172a",
          },
        },
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [theme]);

  return (
    <div
      className={cn(
        "booking-cal-shell min-h-0 flex-1 overflow-auto bg-background",
        className,
      )}
    >
      <Cal
        namespace={CAL_NAMESPACE}
        calLink={booking.calLink}
        style={{ width: "100%", minHeight: "min(78vh, 780px)" }}
        className="[&_iframe]:min-h-[min(78vh,780px)] sm:[&_iframe]:min-h-[min(72vh,720px)]"
        config={{ layout: "month_view", theme }}
      />
    </div>
  );
}
