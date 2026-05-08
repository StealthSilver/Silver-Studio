import type { ReactNode } from "react";
import Image from "next/image";

import {
  type WorkCard,
  type WorkImageDual,
  type WorkImageSingle,
  workSection,
} from "@/data/site";
import {
  LetterWaveLink,
  OUTLINE_CTA_BUTTON_CLASSNAME,
} from "@/components/ui/letter-wave-link";
import { WorkStackSlide } from "@/components/sections/work-stack-slide";
import { cn } from "@/lib/utils";

/** Fraction of the image height visible in the frame (top half / shifted up). */
const IMAGE_VISIBLE_FRACTION = 0.5;

/** Placeholder aspect when there is no image. */
const PLACEHOLDER_FULL_WIDTH = 1600;
const PLACEHOLDER_FULL_HEIGHT = 1000;

function workSlugToClass(slug: string): string {
  return slug.replace(/[^a-z0-9-]/gi, "-");
}

function formatWorkIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
}

const workGlassFrameClass =
  "mx-auto w-full max-w-7xl rounded-t-[1.35rem] border-x border-t border-white/45 border-b-0 bg-white/18 px-3 pt-3 pb-0 shadow-[0_-4px_40px_rgb(24_24_27_/_0.08),inset_0_1px_0_rgb(255_255_255_/_0.55)] backdrop-blur-2xl dark:border-white/14 dark:bg-zinc-950/28 dark:shadow-[0_-6px_48px_rgb(0_0_0_/_0.35),inset_0_1px_0_rgb(255_255_255_/_0.08)] sm:px-4 sm:pt-4";

function WorkBottomGlassInner({
  naturalWidth,
  naturalHeight,
  children,
}: {
  naturalWidth: number;
  naturalHeight: number;
  children: ReactNode;
}) {
  const visibleHeight = naturalHeight * IMAGE_VISIBLE_FRACTION;
  return (
    <div className={workGlassFrameClass}>
      <div
        className="relative w-full overflow-hidden rounded-t-2xl rounded-b-none sm:rounded-t-3xl"
        style={{
          aspectRatio: `${naturalWidth} / ${visibleHeight}`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function WorkBottomFrame({
  children,
  naturalWidth,
  naturalHeight,
  externalHref,
  externalAriaLabel,
}: {
  children: ReactNode;
  naturalWidth: number;
  naturalHeight: number;
  externalHref?: string;
  externalAriaLabel?: string;
}) {
  const inner = (
    <WorkBottomGlassInner naturalWidth={naturalWidth} naturalHeight={naturalHeight}>
      {children}
    </WorkBottomGlassInner>
  );

  if (externalHref) {
    return (
      <a
        href={externalHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={externalAriaLabel}
        className="mx-auto block w-full max-w-7xl transition-opacity hover:opacity-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-zinc-950"
      >
        {inner}
      </a>
    );
  }

  return inner;
}

function WorkBottomPlaceholder() {
  return (
    <WorkBottomFrame
      naturalWidth={PLACEHOLDER_FULL_WIDTH}
      naturalHeight={PLACEHOLDER_FULL_HEIGHT}
    >
      <div className="absolute inset-0 bg-zinc-200/80 dark:bg-zinc-800/80">
        <div
          className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_100%,var(--hero-silver-2)_0%,transparent_55%),linear-gradient(to_top,var(--hero-silver-1)_0%,transparent_58%)]"
          aria-hidden
        />
        <div className="relative z-[1] flex h-full w-full items-center justify-center">
          <div className="h-16 w-[50%] max-w-[10rem] rounded-lg border border-zinc-300/60 bg-background/50 backdrop-blur-sm dark:border-zinc-600/60 dark:bg-zinc-950/40" />
        </div>
      </div>
    </WorkBottomFrame>
  );
}

/** Full image width in frame; top `IMAGE_VISIBLE_FRACTION` of image height visible (aligned to top). */
function WorkImageFullWidthTopCrop({
  src,
  width,
  height,
  alt,
  className,
  sizes,
  ariaHidden,
}: {
  src: string;
  width: number;
  height: number;
  alt: string;
  className?: string;
  sizes: string;
  ariaHidden?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={[
        "absolute left-0 top-0 h-auto w-full max-w-full select-none",
        className ?? "",
      ].join(" ")}
      sizes={sizes}
      {...(ariaHidden ? { "aria-hidden": true as const } : {})}
    />
  );
}

function WorkBottomSingle({
  image,
  externalHref,
  externalAriaLabel,
}: {
  image: WorkImageSingle;
  externalHref?: string;
  externalAriaLabel?: string;
}) {
  const frameHeight = image.frameHeight ?? image.height;
  return (
    <WorkBottomFrame
      naturalWidth={image.width}
      naturalHeight={frameHeight}
      externalHref={externalHref}
      externalAriaLabel={externalAriaLabel}
    >
      <WorkImageFullWidthTopCrop
        src={image.src}
        width={image.width}
        height={image.height}
        alt={image.alt}
        className="object-contain object-[center_top]"
        sizes="(max-width: 1280px) 100vw, 80rem"
      />
    </WorkBottomFrame>
  );
}

function WorkBottomDual({
  image,
  externalHref,
  externalAriaLabel,
}: {
  image: WorkImageDual;
  externalHref?: string;
  externalAriaLabel?: string;
}) {
  const w = image.light.width;
  const h = image.light.height;
  return (
    <WorkBottomFrame
      naturalWidth={w}
      naturalHeight={h}
      externalHref={externalHref}
      externalAriaLabel={externalAriaLabel}
    >
      <WorkImageFullWidthTopCrop
        src={image.light.src}
        width={image.light.width}
        height={image.light.height}
        alt={image.ariaLabel}
        className="object-contain object-[center_top] opacity-95 dark:hidden"
        sizes="(max-width: 1280px) 100vw, 80rem"
      />
      <WorkImageFullWidthTopCrop
        src={image.dark.src}
        width={image.dark.width}
        height={image.dark.height}
        alt=""
        className="hidden object-contain object-[center_top] opacity-95 dark:block"
        sizes="(max-width: 1280px) 100vw, 80rem"
        ariaHidden
      />
    </WorkBottomFrame>
  );
}

function WorkBottomPreview({ item }: { item: WorkCard }) {
  const { image, siteUrl } = item;
  const previewLabel = siteUrl
    ? `Visit ${item.title} website (opens in new tab)`
    : undefined;
  if (!image) {
    return <WorkBottomPlaceholder />;
  }
  if (image.type === "dual") {
    return (
      <WorkBottomDual
        image={image}
        externalHref={siteUrl}
        externalAriaLabel={previewLabel}
      />
    );
  }
  return (
    <WorkBottomSingle
      image={image}
      externalHref={siteUrl}
      externalAriaLabel={previewLabel}
    />
  );
}

function WorkItemRow({
  item,
  index,
  total,
}: {
  item: WorkCard;
  index: number;
  total: number;
}) {
  const mod = workSlugToClass(item.slug);
  const titleId = `work-item-title-${item.slug}`;
  const indexLabel = formatWorkIndex(index);

  return (
    <WorkStackSlide
      mod={mod}
      itemSlug={item.slug}
      index={index}
      total={total}
    >
      <div className="work-showcase__bg" aria-hidden />

      <div className="relative z-[2] min-h-screen w-full">
        <span className="sr-only">
          Project {index + 1} of {total}
        </span>

        <article
          className="relative min-h-screen w-full"
          aria-labelledby={titleId}
        >
            {/* Title left + index right, aligned to max-w-7xl */}
            <div className="absolute inset-x-0 top-[15%] z-30 flex justify-center px-4 sm:px-6 lg:px-8">
              <div className="flex w-full max-w-7xl items-start justify-between gap-6">
                <div className="min-w-0 max-w-[min(100%,44rem)] pr-2">
                  <h3
                    id={titleId}
                    className="text-left text-3xl font-normal uppercase leading-[1.05] tracking-tight text-zinc-900 sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]"
                  >
                    {item.title}
                  </h3>
                </div>
                <div className="shrink-0" aria-hidden>
                  <span className="font-thin tabular-nums tracking-tight text-zinc-900 [font-family:var(--font-ibm-plex-sans)] text-5xl leading-none dark:text-zinc-50 sm:text-6xl md:text-7xl lg:text-8xl">
                    {indexLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Center: description + Read more */}
            <div className="absolute left-1/2 top-1/2 z-20 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 px-5 text-center sm:max-w-2xl sm:px-8">
              <p className="text-base leading-relaxed text-zinc-700 sm:text-[17px] dark:text-zinc-300">
                {item.description}
              </p>
              <div className="mt-8 flex justify-center sm:mt-10">
                <LetterWaveLink
                  href={`/${item.slug}`}
                  className={OUTLINE_CTA_BUTTON_CLASSNAME}
                  label="READ MORE"
                  ariaLabel={`Read more about ${item.title}`}
                />
              </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 z-[15] flex justify-center px-4 sm:px-6">
              <WorkBottomPreview item={item} />
            </div>
          </article>
        </div>
    </WorkStackSlide>
  );
}

export function Work() {
  const { id, sectionAriaLabel, heading, items } = workSection;
  const total = items.length;

  const showHeading = heading.trim().length > 0;

  return (
    <section
      id={id}
      aria-label={sectionAriaLabel}
      className="w-full shrink-0 overflow-x-visible overflow-y-visible scroll-mt-28 pb-6 pt-0 sm:scroll-mt-32 sm:pb-10"
    >
      {showHeading ? (
        <div className="mx-auto w-full max-w-7xl">
          <h2 className="max-w-2xl text-left text-3xl font-semibold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50 [font-family:var(--font-ibm-plex-sans)]">
            {heading}
          </h2>
        </div>
      ) : null}

      <ul
        className={cn(
          "relative m-0 list-none overflow-x-visible overflow-y-visible p-0",
          showHeading ? "mt-24 sm:mt-32 lg:mt-40" : "mt-0",
        )}
      >
        {items.map((item, index) => (
          <WorkItemRow
            key={item.slug}
            item={item}
            index={index}
            total={total}
          />
        ))}
      </ul>
    </section>
  );
}
