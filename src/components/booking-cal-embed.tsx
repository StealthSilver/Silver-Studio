"use client";

import dynamic from "next/dynamic";
import { useTheme } from "@/components/theme-provider";
import { booking } from "@/lib/booking";
import { cn } from "@/lib/utils";

const Cal = dynamic(() => import("@calcom/embed-react").then((m) => m.default), {
  ssr: false,
  loading: () => <BookingCalSkeleton />,
});

function BookingCalSkeleton() {
  return (
    <div
      className={cn(
        "flex min-h-[min(78vh,780px)] w-full items-center justify-center sm:min-h-[min(72vh,720px)]",
        "bg-muted/20",
      )}
    >
      <p className="text-sm text-muted-foreground">Loading calendar…</p>
    </div>
  );
}

/** Inline Cal.com booker styled to track site light/dark + brand accents. */
export function BookingCalEmbed({ className }: { className?: string }) {
  const { resolvedTheme } = useTheme();
  const theme = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <div
      className={cn(
        "booking-cal-shell min-h-0 flex-1 overflow-auto bg-muted/30",
        className,
      )}
    >
      <Cal
        key={theme}
        calLink={booking.calLink}
        style={{ width: "100%", minHeight: "min(78vh, 780px)" }}
        className="[&_iframe]:min-h-[min(78vh,780px)] sm:[&_iframe]:min-h-[min(72vh,720px)]"
        config={{
          layout: "month_view",
          theme,
          branding: {
            brandColor:
              theme === "dark"
                ? "rgb(242 242 247)"
                : "rgb(15 23 42)",
          },
        }}
      />
    </div>
  );
}
