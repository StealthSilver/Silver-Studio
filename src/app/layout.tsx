import type { Metadata, Viewport } from "next";
import { Geist_Mono, IBM_Plex_Sans, Inter, Geist } from "next/font/google";

import { Providers } from "@/components/providers";

import "./globals.css";
import "@/styles/work-showcase.css";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

/**
 * Runs synchronously in <head> before body/CSS paint — avoids light-theme flash.
 * Logic must stay aligned with `applyTheme` in theme-provider.tsx.
 */
const themeInitScript = `!function(){try{var t=localStorage.getItem("theme")||"system",d=document.documentElement,r="dark"===t||"system"===t&&window.matchMedia("(prefers-color-scheme: dark)").matches;d.classList.toggle("dark",r),d.style.colorScheme=r?"dark":"light"}catch(e){}}();`;

/** Origin only (no path). Override locally with NEXT_PUBLIC_SITE_URL if needed. */
const siteOrigin = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://silverstudios.dev"
).replace(/\/$/, "");

const siteName = "Silver Studios";

const titleDefault =
  "Silver Studios — Modern Startup Design & Development Studio";
const description =
  "Silver Studios designs and develops premium landing pages, SaaS websites, and modern digital experiences for startups that want to stand out.";

const keywords = [
  "startup design agency",
  "SaaS website design",
  "landing page design",
  "Next.js agency",
  "startup branding",
  "modern web design",
  "frontend development agency",
] as const;

/** Shorter copy for Open Graph / Twitter cards. */
const socialTitle = "Silver Studios — Modern Startup Design Studio";
const socialDescription =
  "Premium landing pages and startup websites designed for SaaS founders and modern brands.";

const ogImagePath = "/Logos/silverui-d.svg" as const;
const ogImage = {
  url: ogImagePath,
  width: 1200,
  height: 630,
  alt: siteName,
};

const title = {
  default: titleDefault,
  template: `%s · ${siteName}`,
};

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmPlexSans = IBM_Plex_Sans({
  variable: "--font-ibm-plex-sans",
  subsets: ["latin"],
  weight: ["100", "400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/** Same visual scale in Chromium on Windows/macOS — pairs with scrollbar-gutter + text-size-adjust in globals.css. */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(`${siteOrigin}/`),
  applicationName: siteName,
  title,
  description,
  keywords: [...keywords],
  authors: [{ name: siteName, url: siteOrigin }],
  creator: siteName,
  publisher: siteName,
  category: "design",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteOrigin,
    siteName,
    title: socialTitle,
    description: socialDescription,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: socialTitle,
    description: socialDescription,
    images: [ogImagePath],
  },
  icons: {
    icon: "/Logos/silverui-d.svg",
    apple: "/Logos/silverui-d.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <head>
        <script
          id="theme-init"
          // eslint-disable-next-line react/no-danger -- blocking theme bootstrap (same pattern as next-themes)
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body
        className={`${inter.variable} ${ibmPlexSans.variable} ${geistMono.variable} flex min-h-full flex-col bg-background text-foreground antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
