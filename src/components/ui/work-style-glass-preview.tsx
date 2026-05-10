import type { ReactNode } from "react";
import Image from "next/image";

import {
  type WorkCard,
  type WorkImageDual,
  type WorkImageSingle,
} from "@/data/site";
import { cn } from "@/lib/utils";

/** Fraction of the image height visible in the frame (top half / shifted up). */
const IMAGE_VISIBLE_FRACTION = 0.5;

/** Outer glass uses `rounded-t-[1.35rem]` + `px-3 pt-3` (sm:`px-4 pt-4`); crop matches inset curve. */
const IMAGE_CLIP_ALIGNED_TOP =
  "rounded-t-[calc(1.35rem-12px)] sm:rounded-t-[calc(1.35rem-16px)]";

/** Optional: full card with `2rem` corners (bottom rounded). Work + Silver UI use top-only docking instead. */
const IMAGE_CLIP_ALIGNED_FULL =
  "rounded-t-[calc(2rem-12px)] sm:rounded-t-[calc(2rem-16px)] rounded-b-[calc(2rem-12px)] sm:rounded-b-[calc(2rem-16px)]";

const workGlassFrameClassNormal =
  "mx-auto w-full max-w-7xl rounded-t-[1.35rem] border-x border-t border-white/45 border-b-0 bg-white/18 px-3 pt-3 pb-0 shadow-[0_-4px_40px_rgb(24_24_27_/_0.08),inset_0_1px_0_rgb(255_255_255_/_0.55)] backdrop-blur-2xl dark:border-border/45 dark:bg-card/30 dark:shadow-[0_-6px_48px_rgb(0_0_0_/_0.35),inset_0_1px_0_rgb(255_255_255_/_0.06)] sm:px-4 sm:pt-4";

/** Same glass spec as normal, full perimeter border + bottom radius (standalone preview card). */
const workGlassFrameClassStandalone =
  "mx-auto w-full max-w-7xl rounded-[2rem] border border-white/45 bg-white/18 px-3 pt-3 pb-0 shadow-[0_-4px_40px_rgb(24_24_27_/_0.08),inset_0_1px_0_rgb(255_255_255_/_0.55)] backdrop-blur-2xl dark:border-border/45 dark:bg-card/30 dark:shadow-[0_-6px_48px_rgb(0_0_0_/_0.35),inset_0_1px_0_rgb(255_255_255_/_0.06)] sm:px-4 sm:pt-4";

/** Tighter inset / compact chrome for spotlight-style previews. */
const workGlassFrameClassSnug =
  "mx-auto w-full max-w-7xl rounded-t-[1.35rem] border-x border-t border-white/45 border-b-0 bg-white/18 px-2 pt-2 pb-0 shadow-[0_-4px_40px_rgb(24_24_27_/_0.08),inset_0_1px_0_rgb(255_255_255_/_0.55)] backdrop-blur-2xl dark:border-border/45 dark:bg-card/30 dark:shadow-[0_-6px_48px_rgb(0_0_0_/_0.35),inset_0_1px_0_rgb(255_255_255_/_0.06)] sm:px-3 sm:pt-3";

const workGlassFrameClassStandaloneSnug =
  "mx-auto w-full max-w-7xl rounded-[2rem] border border-white/45 bg-white/18 px-2 pt-2 pb-0 shadow-[0_-4px_40px_rgb(24_24_27_/_0.08),inset_0_1px_0_rgb(255_255_255_/_0.55)] backdrop-blur-2xl dark:border-border/45 dark:bg-card/30 dark:shadow-[0_-6px_48px_rgb(0_0_0_/_0.35),inset_0_1px_0_rgb(255_255_255_/_0.06)] sm:px-3 sm:pt-3";

/** Snug chrome uses 8px / 12px inset — parallel top radius to outer 1.35rem. */
const IMAGE_CLIP_ALIGNED_TOP_SNUG =
  "rounded-t-[calc(1.35rem-8px)] sm:rounded-t-[calc(1.35rem-12px)]";

const IMAGE_CLIP_ALIGNED_FULL_SNUG =
  "rounded-t-[calc(2rem-8px)] sm:rounded-t-[calc(2rem-12px)] rounded-b-[calc(2rem-8px)] sm:rounded-b-[calc(2rem-12px)]";

/** Placeholder aspect when there is no image. */
const PLACEHOLDER_FULL_WIDTH = 1600;
const PLACEHOLDER_FULL_HEIGHT = 1000;

function WorkBottomGlassInner({
  naturalWidth,
  naturalHeight,
  visibleHeightFraction = IMAGE_VISIBLE_FRACTION,
  snugChrome,
  fullRoundedChrome,
  children,
}: {
  naturalWidth: number;
  naturalHeight: number;
  visibleHeightFraction?: number;
  /** Thinner rim / padding so the raster reads larger in the same width. */
  snugChrome?: boolean;
  /** Optional full `2rem` card (all sides rounded). Work + Silver UI use top-only docking (`false`). */
  fullRoundedChrome?: boolean;
  children: ReactNode;
}) {
  const visibleHeight = naturalHeight * visibleHeightFraction;
  const frameClass = fullRoundedChrome
    ? snugChrome
      ? workGlassFrameClassStandaloneSnug
      : workGlassFrameClassStandalone
    : snugChrome
      ? workGlassFrameClassSnug
      : workGlassFrameClassNormal;
  const clipClass = fullRoundedChrome
    ? snugChrome
      ? IMAGE_CLIP_ALIGNED_FULL_SNUG
      : IMAGE_CLIP_ALIGNED_FULL
    : snugChrome
      ? IMAGE_CLIP_ALIGNED_TOP_SNUG
      : IMAGE_CLIP_ALIGNED_TOP;
  return (
    <div className={frameClass}>
      <div
        className={cn(
          "relative w-full overflow-hidden border-0 shadow-none outline-none ring-0",
          !fullRoundedChrome && "rounded-b-none",
          clipClass,
        )}
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
  visibleHeightFraction,
  snugChrome,
  fullRoundedChrome,
  frameLinkClassName,
}: {
  children: ReactNode;
  naturalWidth: number;
  naturalHeight: number;
  externalHref?: string;
  externalAriaLabel?: string;
  visibleHeightFraction?: number;
  snugChrome?: boolean;
  fullRoundedChrome?: boolean;
  /** Merged onto the outer `<a>` / wrapper (break out width, hover, etc.) */
  frameLinkClassName?: string;
}) {
  const inner = (
    <WorkBottomGlassInner
      naturalWidth={naturalWidth}
      naturalHeight={naturalHeight}
      visibleHeightFraction={visibleHeightFraction}
      snugChrome={snugChrome}
      fullRoundedChrome={fullRoundedChrome}
    >
      {children}
    </WorkBottomGlassInner>
  );

  const linkMotion =
    "mx-auto block w-full max-w-7xl transition-opacity hover:opacity-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

  if (externalHref) {
    return (
      <a
        href={externalHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={externalAriaLabel}
        className={cn(linkMotion, frameLinkClassName)}
      >
        {inner}
      </a>
    );
  }

  if (frameLinkClassName) {
    return <div className={cn("w-full", frameLinkClassName)}>{inner}</div>;
  }

  return inner;
}

export function WorkBottomPlaceholder() {
  return (
    <WorkBottomFrame
      naturalWidth={PLACEHOLDER_FULL_WIDTH}
      naturalHeight={PLACEHOLDER_FULL_HEIGHT}
      fullRoundedChrome
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
  visibleHeightFraction,
  snugChrome,
  fullRoundedChrome = false,
  frameLinkClassName,
  imageSizes,
}: {
  image: WorkImageSingle;
  externalHref?: string;
  externalAriaLabel?: string;
  /** Slightly taller crop for spotlight previews (`0..1`, default matches work stack). */
  visibleHeightFraction?: number;
  snugChrome?: boolean;
  /** When true, all corners use the standalone `2rem` frame (not used on work / Silver UI). */
  fullRoundedChrome?: boolean;
  frameLinkClassName?: string;
  /** Passed to `<Image sizes="…"/>` — larger widths decode sharper when the preview is scaled up. */
  imageSizes?: string;
}) {
  const frameHeight = image.frameHeight ?? image.height;
  const imageClipRounding = fullRoundedChrome
    ? snugChrome
      ? "rounded-[calc(2rem-8px)] sm:rounded-[calc(2rem-12px)]"
      : "rounded-[calc(2rem-12px)] sm:rounded-[calc(2rem-16px)]"
    : "";

  return (
    <WorkBottomFrame
      naturalWidth={image.width}
      naturalHeight={frameHeight}
      externalHref={externalHref}
      externalAriaLabel={externalAriaLabel}
      visibleHeightFraction={visibleHeightFraction}
      snugChrome={snugChrome}
      fullRoundedChrome={fullRoundedChrome}
      frameLinkClassName={frameLinkClassName}
    >
      <WorkImageFullWidthTopCrop
        src={image.src}
        width={image.width}
        height={image.height}
        alt={image.alt}
        className={cn(
          "object-contain object-[center_top]",
          imageClipRounding,
        )}
        sizes={
          imageSizes ??
          "(max-width: 1280px) 100vw, 80rem"
        }
      />
    </WorkBottomFrame>
  );
}

function WorkBottomDual({
  image,
  externalHref,
  externalAriaLabel,
  fullRoundedChrome = false,
}: {
  image: WorkImageDual;
  externalHref?: string;
  externalAriaLabel?: string;
  fullRoundedChrome?: boolean;
}) {
  const w = image.light.width;
  const h = image.light.height;
  const imageClipRounding = fullRoundedChrome
    ? "rounded-[calc(2rem-12px)] sm:rounded-[calc(2rem-16px)]"
    : "";

  return (
    <WorkBottomFrame
      naturalWidth={w}
      naturalHeight={h}
      externalHref={externalHref}
      externalAriaLabel={externalAriaLabel}
      fullRoundedChrome={fullRoundedChrome}
    >
      <WorkImageFullWidthTopCrop
        src={image.light.src}
        width={image.light.width}
        height={image.light.height}
        alt={image.ariaLabel}
        className={cn(
          "object-contain object-[center_top] opacity-95 dark:hidden",
          imageClipRounding,
        )}
        sizes="(max-width: 1280px) 100vw, 80rem"
      />
      <WorkImageFullWidthTopCrop
        src={image.dark.src}
        width={image.dark.width}
        height={image.dark.height}
        alt=""
        className={cn(
          "hidden object-contain object-[center_top] opacity-95 dark:block",
          imageClipRounding,
        )}
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
        fullRoundedChrome
      />
    );
  }
  return (
    <WorkBottomSingle
      image={image}
      externalHref={siteUrl}
      externalAriaLabel={previewLabel}
      fullRoundedChrome
    />
  );
}
