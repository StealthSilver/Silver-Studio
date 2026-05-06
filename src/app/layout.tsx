import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

const siteName = "Silver Studios";
const title = {
  default: siteName,
  template: `%s · ${siteName}`,
};
const description =
  "The all-in-one place for UI craft, design ideas, and ready-made components—plus curated resources and tools to design and publish landing pages without scattering your workflow.";

const ogImage = {
  url: "/Logos/silverui-d.svg",
  width: 216,
  height: 216,
  alt: `${siteName} mark`,
};

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  title,
  description,
  keywords: [
    "Silver Studios",
    "UI design",
    "design system",
    "components",
    "landing pages",
    "web design resources",
    "interface design",
    "design ideas",
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  category: "design",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName,
    title: siteName,
    description,
    images: [ogImage],
  },
  twitter: {
    card: "summary",
    title: siteName,
    description,
    images: [ogImage.url],
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
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
