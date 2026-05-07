import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  type WorkCard,
  type WorkImageDual,
  type WorkImageSingle,
  workSection,
} from "@/data/site";

/** Same as hero secondary CTA (SEE WORK) */
const heroSecondaryBtnClass =
  "inline-flex h-11 items-center justify-center rounded-[4px] border border-zinc-300 bg-background px-6 text-sm font-semibold uppercase tracking-wide text-zinc-900 shadow-sm transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:border-zinc-600 dark:hover:bg-zinc-900";

function WorkPreviewFrame({
  children,
  externalHref,
  externalAriaLabel,
}: {
  children: ReactNode;
  externalHref?: string;
  externalAriaLabel?: string;
}) {
  const frame = (
    <div
      className={[
        "relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-[4px] border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900",
        externalHref
          ? "transition-opacity hover:opacity-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-zinc-950"
          : "",
      ].join(" ")}
    >
      {children}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-zinc-300/70 to-transparent dark:via-zinc-600/60"
        aria-hidden
      />
    </div>
  );

  const shellClass =
    "w-full max-w-xl shrink-0 lg:max-w-none lg:flex-1 xl:max-w-[min(100%,560px)]";

  if (externalHref) {
    return (
      <a
        href={externalHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={externalAriaLabel}
        className={`block ${shellClass}`}
      >
        {frame}
      </a>
    );
  }

  return <div className={shellClass}>{frame}</div>;
}

function WorkPreviewPlaceholder() {
  return (
    <>
      <div
        className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_100%,var(--hero-silver-2)_0%,transparent_55%),linear-gradient(to_top,var(--hero-silver-1)_0%,transparent_58%)]"
        aria-hidden
      />
      <div className="relative z-[1] h-24 w-[62%] max-w-[16rem] rounded-[3px] border border-zinc-300/60 bg-background/65 shadow-sm backdrop-blur-[2px] dark:border-zinc-600/60 dark:bg-zinc-950/50" />
    </>
  );
}

function WorkPreviewImage({
  image,
  externalHref,
  externalAriaLabel,
}: {
  image: WorkImageSingle;
  externalHref?: string;
  externalAriaLabel?: string;
}) {
  const fit = image.objectFit ?? "cover";
  return (
    <WorkPreviewFrame externalHref={externalHref} externalAriaLabel={externalAriaLabel}>
      <Image
        src={image.src}
        alt={image.alt}
        width={image.width}
        height={image.height}
        className={
          fit === "contain"
            ? "relative z-[1] h-auto max-h-[38%] w-auto max-w-[72%] object-contain px-6 sm:max-h-[42%]"
            : "relative z-[1] h-full w-full object-cover"
        }
        sizes="(max-width:1024px) 100vw, 45vw"
      />
    </WorkPreviewFrame>
  );
}

function WorkPreviewDual({
  image,
  externalHref,
  externalAriaLabel,
}: {
  image: WorkImageDual;
  externalHref?: string;
  externalAriaLabel?: string;
}) {
  return (
    <WorkPreviewFrame externalHref={externalHref} externalAriaLabel={externalAriaLabel}>
      <>
        <Image
          src={image.light.src}
          alt={image.ariaLabel}
          width={image.light.width}
          height={image.light.height}
          className="relative z-[1] h-auto max-h-[38%] w-auto max-w-[72%] object-contain px-6 opacity-95 dark:hidden sm:max-h-[42%]"
        />
        <Image
          src={image.dark.src}
          alt=""
          width={image.dark.width}
          height={image.dark.height}
          className="relative z-[1] hidden h-auto max-h-[38%] w-auto max-w-[72%] object-contain px-6 opacity-95 dark:block sm:max-h-[42%]"
          aria-hidden
        />
      </>
    </WorkPreviewFrame>
  );
}

function WorkPreview({ item }: { item: WorkCard }) {
  const { image, siteUrl } = item;
  const previewLabel = siteUrl
    ? `Visit ${item.title} website (opens in new tab)`
    : undefined;
  if (!image) {
    return (
      <WorkPreviewFrame>
        <WorkPreviewPlaceholder />
      </WorkPreviewFrame>
    );
  }
  if (image.type === "dual") {
    return (
      <WorkPreviewDual
        image={image}
        externalHref={siteUrl}
        externalAriaLabel={previewLabel}
      />
    );
  }
  return (
    <WorkPreviewImage
      image={image}
      externalHref={siteUrl}
      externalAriaLabel={previewLabel}
    />
  );
}

export function Work() {
  const { id, sectionAriaLabel, heading, items } = workSection;

  return (
    <section
      id={id}
      aria-label={sectionAriaLabel}
      className="w-full scroll-mt-28 pt-16 sm:scroll-mt-32 sm:pt-20"
    >
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="max-w-2xl text-left text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]">
          {heading}
        </h2>

        <ul className="mt-16 list-none space-y-20 sm:mt-24 sm:space-y-28">
          {items.map((item, index) => (
            <li key={item.slug}>
              <article>
                <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:gap-12 xl:gap-16">
                  <div className="flex min-w-0 flex-shrink-0 flex-col gap-7 sm:gap-8 lg:gap-10 lg:flex-[0.92] lg:justify-center xl:max-w-lg">
                    <h3 className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]">
                      <span className="shrink-0 text-[0.55rem] font-medium tabular-nums leading-none tracking-normal text-zinc-600 sm:text-[0.6rem] dark:text-zinc-400">
                        [{index + 1}]
                      </span>
                      <span className="min-w-0 uppercase">{item.title}</span>
                    </h3>
                    <p className="text-sm leading-relaxed text-zinc-600 sm:text-[15px] dark:text-zinc-400">
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-[3px] border border-zinc-200 bg-zinc-50 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900/80 dark:text-zinc-400"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="pt-2 sm:pt-4">
                      <Link
                        href={`/${item.slug}`}
                        aria-label={`Read more about ${item.title}`}
                        className={heroSecondaryBtnClass}
                      >
                        Read more
                      </Link>
                    </div>
                  </div>

                  <div className="min-w-0 lg:flex lg:min-h-0 lg:flex-1 lg:justify-end">
                    <WorkPreview item={item} />
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
