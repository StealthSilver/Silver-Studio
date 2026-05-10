/**
 * Cal.com scheduling — used site-wide for “Book a call” CTAs.
 * `calLink` is the path after cal.com (profile or event), e.g. `you` or `you/30min`.
 */
export const booking = {
  url: "https://cal.com/silver-studio",
  calLink: "silver-studio",
} as const;

export function isBookingHref(href: string): boolean {
  const a = href.trim().replace(/\/$/, "");
  const b = booking.url.replace(/\/$/, "");
  return a === b;
}
