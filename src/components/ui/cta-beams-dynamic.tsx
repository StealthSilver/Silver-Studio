"use client";

import dynamic from "next/dynamic";

/** WebGL canvas must not SSR; wrapper lives in a Client Component per Next.js App Router rules. */
export const CtaBeamsLazy = dynamic(
  () => import("./cta-beams").then((m) => ({ default: m.CtaBeams })),
  {
    ssr: false,
    loading: () => (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-background"
      />
    ),
  },
);
