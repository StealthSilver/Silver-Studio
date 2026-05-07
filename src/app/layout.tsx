import type { Metadata } from "next";
import { Geist_Mono, IBM_Plex_Sans, Inter } from "next/font/google";

import { Providers } from "@/components/providers";

import "./globals.css";

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
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${ibmPlexSans.variable} ${geistMono.variable} flex min-h-full flex-col bg-background text-foreground antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
