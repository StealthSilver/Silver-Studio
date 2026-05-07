/**
 * Site copy, navigation, and media metadata. Edit this file to update the UI.
 */

export const site = {
  name: "Silver Studios",
  homeHref: "/",
  /** Screen-reader label for the logo / home link */
  homeSrLabel: "Silver Studios home",
  logo: {
    lightSrc: "/Logos/silverui-l.svg",
    darkSrc: "/Logos/silverui-d.svg",
    width: 32,
    height: 32,
  },
} as const;

export const hero = {
  sectionAriaLabel: "Introduction",
  headline: "Built to stand out.",
  description:
    "We create modern websites and landing pages for startups that care about design, performance, and perception.",
  primaryCta: { href: "/#contact", label: "BOOK A CALL" },
  secondaryCta: { href: "/#work", label: "SEE WORK" },
} as const;

export const navbar = {
  links: [
    { href: "/#work", label: "Work" },
    { href: "/#services", label: "Services" },
    { href: "/#process", label: "Process" },
    { href: "/#about", label: "About" },
    { href: "/#pricing", label: "Pricing" },
  ],
  cta: { href: "/#talk-now", label: "BOOK A CALL" },
} as const;

export const footer = {
  /** Shown as: © {year} {copyrightOrg}. {copyrightSuffix} */
  copyrightOrg: site.name,
  copyrightSuffix: "All rights reserved.",
} as const;

/** Logo strip below the hero — order matches render order */
export type HeroTickerItem =
  | {
      type: "dualImage";
      href: string;
      ariaLabel: string;
      light: {
        src: string;
        width: number;
        height: number;
        sizes?: string;
        className: string;
      };
      dark: {
        src: string;
        width: number;
        height: number;
        sizes?: string;
        className: string;
        /** e.g. decorative duplicate for dark mode */
        ariaHidden?: boolean;
      };
    }
  | {
      type: "singleImage";
      href: string;
      ariaLabel: string;
      src: string;
      width: number;
      height: number;
      className: string;
    }
  | {
      type: "brilliant";
      href: string;
      ariaLabel: string;
      logoClassName: string;
    }
  | {
      type: "eighthLight";
      href: string;
      ariaLabel: string;
      logoClassName: string;
    }
  | {
      type: "meshspire";
      href: string;
      ariaLabel: string;
      logoClassName: string;
    };

/** Work preview — PNG shots in `/public/works/`; use `objectFit: "contain"` for logos if needed. */
export type WorkImageSingle = {
  type: "single";
  src: string;
  width: number;
  height: number;
  alt: string;
  objectFit?: "cover" | "contain";
};

export type WorkImageDual = {
  type: "dual";
  ariaLabel: string;
  light: { src: string; width: number; height: number };
  dark: { src: string; width: number; height: number };
};

export type WorkCard = {
  title: string;
  /** URL path segment, e.g. `/brilliant` */
  slug: string;
  description: string;
  /** Live site — work preview image links here (new tab). Omit if there is no public URL yet. */
  siteUrl?: string;
  image?: WorkImageSingle | WorkImageDual;
};

export const workSection = {
  id: "work" as const,
  sectionAriaLabel: "Selected work",
  heading: "",
  items: [
    {
      title: "Brilliant.org",
      slug: "brilliant",
      description:
        "Interactive STEM learning experience—product storytelling, responsiveness, and a calm interface that scales across audiences.",
      siteUrl: "https://brilliant.org/",
      image: {
        type: "single",
        src: "/works/brilliant.png",
        width: 1586,
        height: 809,
        alt: "Brilliant.org website preview",
      },
    },
    {
      title: "Sgrids.com",
      slug: "sgrids",
      description:
        "Corporate positioning and structured layouts for enterprise energy—with light and dark brand treatments that carry across breakpoints.",
      siteUrl: "https://www.sgrids.com/",
      image: {
        type: "single",
        src: "/works/sgrids.png",
        width: 3390,
        height: 1948,
        alt: "Sgrids.com website preview",
      },
    },
    {
      title: "8th Light",
      slug: "8th-light",
      description:
        "Craft-led software consultancy site—emphasis on typography, restraint, and a narrative layout that reinforces expertise.",
      siteUrl: "https://8thlight.com/",
      image: {
        type: "single",
        src: "/works/8thlight.png",
        width: 1581,
        height: 810,
        alt: "8th Light website preview",
      },
    },
    {
      title: "Harit",
      slug: "harit",
      description:
        "Landing and UX systems that translate a technical product story into approachable, credible marketing—built for clarity and conversion.",
      siteUrl: "https://verdan-main.vercel.app/",
      image: {
        type: "single",
        src: "/works/harit.png",
        width: 3388,
        height: 1960,
        alt: "Harit website preview",
      },
    },
    {
      title: "Sol-X",
      slug: "sol-x",
      description:
        "SaaS go-to-market web presence—focused messaging hierarchy, funnel-friendly sections, and a flexible component set for iterative launches.",
      siteUrl: "https://sol-x-eta.vercel.app/",
      image: {
        type: "single",
        src: "/works/sol-x.png",
        width: 1580,
        height: 807,
        alt: "Sol-X website preview",
      },
    },
    {
      title: "Meshspire",
      slug: "meshspire",
      description:
        "Product-front site with iterative UI delivery—balancing proof, pricing paths, and a lightweight stack for fast stakeholder feedback.",
      siteUrl: "https://dev.dg4uqajhampr9.amplifyapp.com/",
      image: {
        type: "single",
        src: "/works/meshspire.png",
        width: 3380,
        height: 1954,
        alt: "Meshspire website preview",
      },
    },
  ] satisfies readonly WorkCard[],
};

export function getWorkBySlug(slug: string): WorkCard | undefined {
  return workSection.items.find((item) => item.slug === slug);
}

export const processSection = {
  id: "process" as const,
  sectionAriaLabel: "Our process",
  heading: "Our Modus Operandi",
  steps: [
    {
      letter: "A",
      title: "Discovery",
      description:
        'We align on goals, audience, constraints, and what "done" looks like—gathering context so later choices stay grounded in outcomes, not assumptions.',
    },
    {
      letter: "B",
      title: "Direction",
      description:
        "We shape positioning, narrative, and structure—defining the journey, key messaging, and milestones so design and build share one clear north star.",
    },
    {
      letter: "C",
      title: "Design",
      description:
        "We translate strategy into layouts, type, motion, and UI patterns—iterating with you until the experience feels intentional, legible, and on-brand.",
    },
    {
      letter: "D",
      title: "Development",
      description:
        "We implement performant, accessible front ends with tidy architecture—hooked up to your content and tooling so the site is stable as it scales.",
    },
    {
      letter: "E",
      title: "Deployment",
      description:
        "We launch carefully—checks for speed, SEO basics, and analytics—then hand off what's needed so your team can own releases with confidence.",
    },
  ],
} as const;

export const heroLogoTicker = {
  heading: "Trusted by leading teams worldwide",
  labelId: "hero-logo-ticker-label",
  items: [
    {
      type: "dualImage",
      href: "https://www.sgrids.com/",
      ariaLabel: "Smart Grids",
      light: {
        src: "/Logos/sgrids.svg",
        width: 176,
        height: 41,
        sizes: "(max-width:640px) 40vw, 12rem",
        className:
          "h-7 w-auto max-h-8 max-w-[min(100%,10rem)] object-contain object-left sm:h-8 sm:max-w-[11rem] dark:hidden",
      },
      dark: {
        src: "/Logos/sgrids-dark.svg",
        width: 176,
        height: 41,
        sizes: "(max-width:640px) 40vw, 12rem",
        className:
          "hidden h-7 w-auto max-h-8 max-w-[min(100%,10rem)] object-contain object-left sm:h-8 sm:max-w-[11rem] dark:block",
        ariaHidden: true,
      },
    },
    {
      type: "brilliant",
      href: "https://brilliant.org/home/",
      ariaLabel: "Brilliant",
      logoClassName:
        "h-5 w-auto max-w-[min(100%,6.5rem)] sm:h-5 sm:max-w-[min(100%,7rem)] text-zinc-900 dark:text-zinc-100",
    },
    {
      type: "singleImage",
      href: "https://www.serenticaglobal.com/",
      ariaLabel: "Serentica",
      src: "/Logos/serentia.png",
      width: 215,
      height: 37,
      className: "h-[1.125rem] w-auto max-h-8 object-contain sm:h-5",
    },
    {
      type: "eighthLight",
      href: "https://8thlight.com/",
      ariaLabel: "8th Light",
      logoClassName:
        "h-5 w-auto max-w-[min(100%,8rem)] sm:h-5 sm:max-w-[min(100%,8.5rem)] text-zinc-900 dark:text-zinc-100",
    },
    {
      type: "meshspire",
      href: "https://dev.dg4uqajhampr9.amplifyapp.com/",
      ariaLabel: "Meshspire",
      logoClassName: "h-7 max-w-[min(100%,10rem)] sm:h-8 sm:max-w-[11rem]",
    },
  ] as const satisfies readonly HeroTickerItem[],
} as const;
