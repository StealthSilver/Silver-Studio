/**
 * Site copy, navigation, and media metadata. Edit this file to update the UI.
 */

import { booking } from "@/lib/booking";

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
    "We create modern websites and landing pages for startups and established brands that care about design, performance, and perception.",
  primaryCta: { href: booking.url, label: "BOOK A CALL" },
  secondaryCta: { href: "/#work", label: "SEE WORK", scrollPercent: 11 },
} as const;

export const navbar = {
  links: [
    { href: "/#work", label: "Work", scrollPercent: 11 },
    { href: "/#services", label: "Services", scrollPercent: 64 },
    { href: "/#silver-ui", label: "Silver UI", scrollPercent: 70 },
    { href: "/#process", label: "Process", scrollPercent: 90 },
    { href: "/#faq", label: "FAQ", scrollPercent: 94 },
  ],
  cta: { href: booking.url, label: "BOOK A CALL" },
} as const;

export const footer = {
  /** Shown as: © {year} {copyrightOrg}. {copyrightSuffix} */
  copyrightOrg: site.name,
  copyrightSuffix: "All rights reserved.",
  contactEmail: "saraswatrajat12@gmail.com",
  social: [
    {
      network: "x" as const,
      href: "https://x.com/silver_srs",
      ariaLabel: "Silver Studios on X",
    },
    {
      network: "discord" as const,
      href: "https://discord.com/users/rajat_28969",
      ariaLabel: "Message Silver Studios on Discord",
    },
  ],
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
  /**
   * When set, drives preview frame aspect ratio only (`width` / (`frameHeight` × visible fraction)).
   * Use when the PNG is taller than other slides so the glass box matches; image still uses `height`.
   */
  frameHeight?: number;
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
  heading: "What we have built",
  items: [
    {
      title: "Brilliant.org",
      slug: "brilliant",
      description:
        "Brilliant is trying to make math and science something you come back to, not bounce off of. We helped shape that story on the web with a clear narrative, layouts that hold up on real devices, and a quiet interface so the lesson stays up front.",
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
        "Sgrids needed room to breathe as an enterprise brand in energy. We built structured layouts that feel confident in the light suite and deliberate in dark mode, carried consistently from the largest monitors down to handheld screens.",
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
        "8th Light leads with craftsmanship in software. We treated the site like a quiet studio tour through generous typography, restraint in the ornament, and a narrative flow that reinforces expertise instead of drowning it.",
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
        "Harit wraps a dense product narrative in marketing that strangers can skim and still trust. Repeatable UX patterns hold the layout together and the wording stays grounded in what actually ships, so clarity and conversion feel earned rather than forced.",
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
        "Sol-X marks an early web pass for bringing a SaaS story to market. Messaging stacks in priority order, sections follow how someone actually researches a tool, and the components bend when the pitch changes sprint to sprint.",
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
        "Meshspire needed a credible shop window while product details kept shifting. Proof, pricing, and calls to action sit in sensible order against a lightweight structure, so stakeholder feedback landed quickly without rewriting the whole story.",
      siteUrl: "https://dev.dg4uqajhampr9.amplifyapp.com/",
      image: {
        type: "single",
        src: "/works/meshspire.png",
        width: 3380,
        height: 1954,
        frameHeight: 1724,
        alt: "Meshspire website preview",
      },
    },
  ] satisfies readonly WorkCard[],
};

export function getWorkBySlug(slug: string): WorkCard | undefined {
  return workSection.items.find((item) => item.slug === slug);
}

export const servicesSection = {
  id: "services" as const,
  sectionAriaLabel: "Services",
} as const;

export const processSection = {
  id: "process" as const,
  sectionAriaLabel: "Our process",
  steps: [
    {
      title: "Discovery",
      description:
        "We clarify goals, audience, constraints, and what success means together.",
    },
    {
      title: "Direction",
      description:
        "We shape positioning, milestones, and the story your product needs to tell.",
    },
    {
      title: "Design",
      description:
        "Translate strategy into layouts, type, motion, and UI you can stress-test.",
    },
    {
      title: "Development",
      description:
        "Build performant, accessible interfaces with clean architecture that scales.",
    },
    {
      title: "Deployment",
      description:
        "Launch with performance and SEO basics covered; handoff for calm releases.",
    },
  ],
} as const;

export type WhyIconId =
  | "precision"
  | "velocity"
  | "signal"
  | "partnership";

export type WhyItem = {
  title: string;
  description: string;
  icon: WhyIconId;
};

export const whySection = {
  id: "why" as const,
  sectionAriaLabel: "Why Silver Studios",
  heading: "Why Silver Studios",
  intro:
    "A small studio mindset with senior execution—fewer layers, clearer communication, and work that earns attention without shouting.",
  items: [
    {
      title: "Taste meets technical depth",
      icon: "precision",
      description:
        "We obsess over typography, rhythm, motion, and performance—not as garnish, but as the interface people actually feel when they trust a brand.",
    },
    {
      title: "Speed without reckless shortcuts",
      icon: "velocity",
      description:
        "Modern stacks and tight feedback loops ship outcomes faster—paired with pragmatic scope so timelines stay honest and launches stay calm.",
    },
    {
      title: "Messaging that survives contact with reality",
      icon: "signal",
      description:
        "Layouts and copy are wired to clarify what you sell, who it's for, and why it wins—built to convert stakeholders, not just win a slideshow.",
    },
    {
      title: "Partnership, not vendor theater",
      icon: "partnership",
      description:
        "You get direct collaboration with makers who own outcomes—async updates when it helps, real conversation when decisions matter.",
    },
  ] satisfies readonly WhyItem[],
} as const;

export const poweredBySilverUiSection = {
  id: "silver-ui" as const,
  intro:
    "Silver UI is our in-house library for luminous, restrained interfaces—production-ready primitives, tokens, and patterns you can ship with confidence.",
  externalHref: "https://silver-ui.vercel.app/" as const,
  ctaLabel: "EXPLORE SILVER UI" as const,
  ctaAriaLabel:
    "Explore Silver UI — opens the component library site in a new tab" as const,
  /** Bottom preview — same glass frame treatment as work section (`WorkBottomSingle`). */
  previewImage: {
    type: "single" as const,
    src: "/silverui.png",
    width: 3380,
    height: 1926,
    alt: "Silver UI component library documentation preview",
  },
} as const;

export type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
};

export const testimonialsSection = {
  id: "testimonials" as const,
  items: [
    {
      quote:
        "The site finally matches how thoughtful our product actually is—clarity went up overnight and sales calls got easier.",
      name: "Head of Growth",
      role: "Seed-stage SaaS",
    },
    {
      quote:
        "Rare blend: strong visual direction with engineering that holds up once marketing wants to iterate every week.",
      name: "Founding Designer",
      role: "B2B marketplace",
    },
    {
      quote:
        "We stopped apologizing for our homepage—the narrative, structure, and polish feel deliberate top to bottom.",
      name: "CEO",
      role: "Climate infrastructure",
    },
    {
      quote:
        "Execution felt senior from day one. We made fast decisions, shipped without drama, and conversions moved in the right direction.",
      name: "Product Marketing Lead",
      role: "Developer tools startup",
    },
    {
      quote:
        "They brought order to a messy story. The new site is easier to scan, easier to trust, and finally sounds like us.",
      name: "Co-founder",
      role: "AI workflow platform",
    },
  ] satisfies readonly TestimonialItem[],
} as const;

export type PricingTier = {
  name: string;
  description: string;
  priceHint: string;
  features: readonly string[];
  highlighted?: boolean;
  cta: { label: string; href: string };
};

export const pricingSection = {
  id: "pricing" as const,
  sectionAriaLabel: "Pricing",
  heading: "Engagement shapes",
  intro:
    "Every build is scoped to outcomes—tell us timelines, stacks, and must-win moments; we tailor a sprint plan that fits.",
  tiers: [
    {
      name: "Launch Sprint",
      description: "Landing, narrative refresh, or campaign page when you need to ship cleanly and fast.",
      priceHint: "From $12k • 2–3 weeks",
      features: [
        "Single-purpose experience with distilled messaging",
        "Responsive layouts + interaction polish",
        "Analytics + SEO basics wired for launch",
      ],
      cta: { label: "Book a discovery call", href: booking.url },
    },
    {
      name: "Product Web",
      description: "Marketing site + repeatable sections for launches, hires, pricing, and product storytelling.",
      priceHint: "From $35k • 4–8 weeks",
      features: [
        "Multi-section narrative with reusable blocks",
        "Design system hooks for marketing velocity",
        "Performance + accessibility QA before handoff",
      ],
      highlighted: true,
      cta: { label: "Discuss scope", href: booking.url },
    },
    {
      name: "Embedded Studio",
      description: "Dedicated front-end bandwidth for iterating funnels, product UI, or design-system rollout.",
      priceHint: "Monthly retainer",
      features: [
        "Prioritized backlog with weekly shipping rhythm",
        "Shared Slack + async Loom reviews",
        "Fractional design + engineering leadership",
      ],
      cta: { label: "Talk retainers", href: booking.url },
    },
  ] satisfies readonly PricingTier[],
} as const;

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqSection = {
  id: "faq" as const,
  items: [
    {
      question: "How do engagements usually start?",
      answer:
        "We begin with a short discovery sync—goals, audience, constraints, and timeline. You'll get a concise proposal outlining scope, milestones, and pricing before anyone commits deeply.",
    },
    {
      question: "Can you plug into our existing team and tools?",
      answer:
        "Yes. We're comfortable pairing with designers, marketers, or internal engineers across Figma, GitHub, Notion, Slack, Linear, your CMS—whatever keeps decisions moving.",
    },
    {
      question: "What stacks do you build on?",
      answer:
        "We lean heavily on Next.js/React, TypeScript, and Tailwind for production front ends, but we'll match sane constraints if your product already dictates a preferred stack.",
    },
    {
      question: "How do revisions work?",
      answer:
        "Direction is iterative by design—we schedule structured review windows so feedback stays decisive, approvals stay documented, and the schedule stays honest.",
    },
    {
      question: "Who owns the code and assets?",
      answer:
        "You do. Deliverables ship in your repositories and accounts with sensible documentation so your team can extend or migrate without guessing.",
    },
  ] satisfies readonly FaqItem[],
} as const;

export const finalCtaSection = {
  id: "contact" as const,
  heading: "Ready when you are",
  primaryCta: { href: booking.url, label: hero.primaryCta.label },
  secondaryCta: hero.secondaryCta,
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
          "w-auto object-contain object-left max-md:h-5 max-md:max-h-6 max-md:max-w-[min(100%,7.25rem)] md:h-8 md:max-h-8 md:max-w-[11rem] dark:hidden",
      },
      dark: {
        src: "/Logos/sgrids-dark.svg",
        width: 176,
        height: 41,
        sizes: "(max-width:640px) 40vw, 12rem",
        className:
          "hidden w-auto object-contain object-left max-md:h-5 max-md:max-h-6 max-md:max-w-[min(100%,7.25rem)] md:h-8 md:max-h-8 md:max-w-[11rem] dark:block",
        ariaHidden: true,
      },
    },
    {
      type: "brilliant",
      href: "https://brilliant.org/home/",
      ariaLabel: "Brilliant",
      logoClassName:
        "w-auto max-md:h-[0.9375rem] max-md:max-w-[min(100%,5.25rem)] md:h-5 md:max-w-[min(100%,7rem)] text-foreground",
    },
    {
      type: "singleImage",
      href: "https://www.serenticaglobal.com/",
      ariaLabel: "Serentica",
      src: "/Logos/serentia.png",
      width: 215,
      height: 37,
      className:
        "w-auto max-h-8 object-contain max-md:h-[0.8125rem] md:h-5",
    },
    {
      type: "eighthLight",
      href: "https://8thlight.com/",
      ariaLabel: "8th Light",
      logoClassName:
        "w-auto max-md:h-4 max-md:max-w-[min(100%,6.25rem)] md:h-5 md:max-w-[min(100%,8.5rem)] text-foreground",
    },
    {
      type: "meshspire",
      href: "https://dev.dg4uqajhampr9.amplifyapp.com/",
      ariaLabel: "Meshspire",
      logoClassName:
        "w-auto max-md:h-[1.25rem] max-md:max-w-[min(100%,8rem)] md:h-8 md:max-w-[11rem]",
    },
  ] as const satisfies readonly HeroTickerItem[],
} as const;
