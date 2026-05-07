"use client";

import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/theme-provider";

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
