import {
  type WorkCard,
  workSection,
} from "@/data/site";
import {
  LetterWaveLink,
  OUTLINE_CTA_HERO_SHADOW_CLASSNAME,
} from "@/components/ui/letter-wave-link";
import { WorkBottomPreview } from "@/components/ui/work-style-glass-preview";
import { WorkScrollIntro } from "@/components/sections/work-scroll-intro";
import { WorkStackSlide } from "@/components/sections/work-stack-slide";

function formatWorkIndex(index: number): string {
  return String(index + 1).padStart(2, "0");
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
  const titleId = `work-item-title-${item.slug}`;
  const indexLabel = formatWorkIndex(index);

  return (
    <WorkStackSlide
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
                    className="text-left text-3xl font-normal uppercase leading-[1.05] tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl"
                  >
                    {item.title}
                  </h3>
                </div>
                <div className="shrink-0" aria-hidden>
                  <span className="font-thin tabular-nums tracking-tight text-foreground text-5xl leading-none sm:text-6xl md:text-7xl lg:text-8xl">
                    {indexLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Center: description + Read more */}
            <div className="absolute left-1/2 top-1/2 z-20 w-full max-w-xl -translate-x-1/2 -translate-y-1/2 px-5 text-center sm:max-w-2xl sm:px-8">
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                {item.description}
              </p>
              <div className="mt-8 flex justify-center sm:mt-10">
                <LetterWaveLink
                  href={`/${item.slug}`}
                  className={OUTLINE_CTA_HERO_SHADOW_CLASSNAME}
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
      className="bg-[var(--work-section-canvas)] w-full shrink-0 overflow-x-visible overflow-y-visible scroll-mt-28 pb-6 pt-0 sm:scroll-mt-32 sm:pb-10"
    >
      {showHeading ? <WorkScrollIntro heading={heading} /> : null}

      <ul
        className="relative m-0 list-none overflow-x-visible overflow-y-visible p-0"
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
