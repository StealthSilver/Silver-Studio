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
    "We create modern websites and landing pages for startups and established brands that care about design, performance, and perception.",
  primaryCta: { href: "/#contact", label: "BOOK A CALL" },
  secondaryCta: { href: "/#work", label: "SEE WORK" },
} as const;

export const navbar = {
  links: [
    { href: "/#work", label: "Work" },
    { href: "/#services", label: "Services" },
    { href: "/#process", label: "Process" },
    { href: "/#faq", label: "FAQ" },
    { href: "/#silver-ui", label: "Silver UI" },
  ],
  cta: { href: "/#contact", label: "BOOK A CALL" },
} as const;

export const footer = {
  /** Shown as: © {year} {copyrightOrg}. {copyrightSuffix} */
  copyrightOrg: site.name,
  copyrightSuffix: "All rights reserved.",
  description:
    "Design-forward web studio for startups, growth-stage companies, and product teams. We craft high-conversion marketing sites with clean execution and fast iteration.",
  contactEmail: "hello@silverstudios.dev",
  location: "Remote • Worldwide",
  availability: "Booking projects for Q3 2026",
  primaryCta: { href: "/#contact", label: "Book a call" },
  secondaryCta: { href: "/#work", label: "See work" },
  legalLinks: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
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
        'We align on goals, audience, constraints, and what "done" looks like—gathering context so later choices stay grounded in outcomes, not assumptions.',
    },
    {
      title: "Direction",
      description:
        "We shape positioning, narrative, and structure—defining the journey, key messaging, and milestones so design and build share one clear north star.",
    },
    {
      title: "Design",
      description:
        "We translate strategy into layouts, type, motion, and UI patterns—iterating with you until the experience feels intentional, legible, and on-brand.",
    },
    {
      title: "Development",
      description:
        "We implement performant, accessible front ends with tidy architecture—hooked up to your content and tooling so the site is stable as it scales.",
    },
    {
      title: "Deployment",
      description:
        "We launch carefully—checks for speed, SEO basics, and analytics—then hand off what's needed so your team can own releases with confidence.",
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
  sectionAriaLabel: "Powered by Silver UI",
  eyebrow: "Design system backbone",
  heading: "Powered by Silver UI",
  intro:
    "Silver UI is our in-house component language—tokens, patterns, and production-ready primitives tuned for luminous, restrained interfaces.",
  /** Short labels for the footer row (same rhythm as the final CTA section). */
  footerTags: [
    "TOKENS & PATTERNS",
    "ACCESSIBLE BY DEFAULT",
    "COMPOSABLE PRIMITIVES",
  ] as const,
  /** Product site — opened in a new browser tab */
  externalHref: "https://silver-ui.vercel.app/" as const,
  externalCtaLabel: "Explore Silver UI" as const,
  externalCtaAriaLabel:
    "Explore Silver UI on silver-ui.vercel.app (opens in a new tab)" as const,
} as const;

export type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
};

export const testimonialsSection = {
  id: "testimonials" as const,
  sectionAriaLabel: "Client testimonials",
  heading: "What teams notice first",
  intro:
    "Anonymous until we publish named case studies—but the recurring themes sound like this.",
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
      cta: { label: "Book a discovery call", href: "/#contact" },
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
      cta: { label: "Discuss scope", href: "/#contact" },
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
      cta: { label: "Talk retainers", href: "/#contact" },
    },
  ] satisfies readonly PricingTier[],
} as const;

export type FaqItem = {
  question: string;
  answer: string;
};

export const faqSection = {
  id: "faq" as const,
  sectionAriaLabel: "Frequently asked questions",
  heading: "FAQ",
  intro: "Straight answers to the questions teams ask before kicking off.",
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
  sectionAriaLabel: "Get in touch",
  heading: "Ready when you are",
  description:
    "Share what you're launching, who's it for, and what success looks like—we'll propose a pragmatic path inside a couple of days.",
  primaryCta: { href: "/#contact", label: hero.primaryCta.label },
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
        "h-5 w-auto max-w-[min(100%,6.5rem)] sm:h-5 sm:max-w-[min(100%,7rem)] text-foreground",
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
        "h-5 w-auto max-w-[min(100%,8rem)] sm:h-5 sm:max-w-[min(100%,8.5rem)] text-foreground",
    },
    {
      type: "meshspire",
      href: "https://dev.dg4uqajhampr9.amplifyapp.com/",
      ariaLabel: "Meshspire",
      logoClassName: "h-7 max-w-[min(100%,10rem)] sm:h-8 sm:max-w-[11rem]",
    },
  ] as const satisfies readonly HeroTickerItem[],
} as const;
