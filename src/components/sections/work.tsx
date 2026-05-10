import { workSection } from "@/data/site";
import { WorkScrollIntro } from "@/components/sections/work-scroll-intro";
import { WorkItemRow } from "@/components/sections/work-item-row";

export function Work() {
  const { id, sectionAriaLabel, heading, items } = workSection;
  const total = items.length;

  const showHeading = heading.trim().length > 0;

  return (
    <section
      id={id}
      aria-label={sectionAriaLabel}
      className="relative ml-[calc(50%-50vw)] mr-[calc(50%-50vw)] w-screen max-w-[100vw] shrink-0 bg-[var(--work-section-canvas)] overflow-x-visible overflow-y-visible scroll-mt-28 pb-0 pt-0 sm:scroll-mt-32"
    >
      {showHeading ? <WorkScrollIntro heading={heading} /> : null}

      <ul
        className="relative m-0 list-none overflow-x-visible overflow-y-visible p-0 max-md:flex max-md:flex-col max-md:gap-4 max-md:px-3 max-md:pb-12"
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
