import type { ReactNode } from "react";
import Image from "next/image";

import {
  type WorkCard,
  type WorkImageDual,
  type WorkImageSingle,
} from "@/data/site";

/** Fraction of the image height visible in the frame (top half / shifted up). */
const IMAGE_VISIBLE_FRACTION = 0.5;

/** Placeholder aspect when there is no image. */
const PLACEHOLDER_FULL_WIDTH = 1600;
const PLACEHOLDER_FULL_HEIGHT = 1000;

const workGlassFrameClass =
  "mx-auto w-full max-w-7xl rounded-t-[1.35rem] border-x border-t border-white/45 border-b-0 bg-white/18 px-3 pt-3 pb-0 shadow-[0_-4px_40px_rgb(24_24_27_/_0.08),inset_0_1px_0_rgb(255_255_255_/_0.55)] backdrop-blur-2xl dark:border-border/45 dark:bg-card/30 dark:shadow-[0_-6px_48px_rgb(0_0_0_/_0.35),inset_0_1px_0_rgb(255_255_255_/_0.06)] sm:px-4 sm:pt-4";

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
        className="mx-auto block w-full max-w-7xl transition-opacity hover:opacity-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {inner}
      </a>
    );
  }

  return inner;
}

export function WorkBottomPlaceholder() {
  return (
    <WorkBottomFrame
      naturalWidth={PLACEHOLDER_FULL_WIDTH}
      naturalHeight={PLACEHOLDER_FULL_HEIGHT}
    >
      <div className="absolute inset-0 bg-zinc-200/80 dark:bg-muted/92">
        <div
          className="absolute inset-0 bg-[radial-gradient(120%_100%_at_50%_100%,var(--hero-silver-2)_0%,transparent_55%),linear-gradient(to_top,var(--hero-silver-1)_0%,transparent_58%)]"
          aria-hidden
        />
        <div className="relative z-[1] flex h-full w-full items-center justify-center">
          <div className="h-16 w-[50%] max-w-[10rem] rounded-lg border border-border/70 bg-background/55 backdrop-blur-sm dark:border-border/65 dark:bg-card/50" />
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

export function WorkBottomSingle({
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

export function WorkBottomPreview({ item }: { item: WorkCard }) {
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
