import Link from "next/link";

import type { WorkCard } from "@/data/site";

const secondaryBtnClass =
  "inline-flex h-11 items-center justify-center rounded-[4px] border border-border bg-background px-6 text-sm font-semibold uppercase tracking-wide text-foreground shadow-sm transition-colors hover:border-border hover:bg-accent";

export function ProjectDetail({ item }: { item: WorkCard }) {
  const visitLabel = item.siteUrl
    ? `Visit ${item.title} (opens in new tab)`
    : undefined;

  return (
    <main className="mx-auto flex min-h-[50vh] w-full max-w-7xl flex-1 flex-col bg-background px-4 pb-12 pt-6 text-foreground sm:px-6 sm:pt-8 lg:px-8">
      <article className="mx-auto w-full max-w-3xl">
        <p className="text-[0.6rem] font-medium uppercase tracking-[0.2em] text-muted-foreground">
          Selected work
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {item.title}
        </h1>
        <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          {item.description}
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
          <Link
            href="/#work"
            className={secondaryBtnClass}
            aria-label="Back to work section on home"
          >
            ← Back to work
          </Link>
          {item.siteUrl ? (
            <a
              href={item.siteUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={visitLabel}
              className={secondaryBtnClass}
            >
              Visit live site
            </a>
          ) : null}
        </div>
      </article>
    </main>
  );
}
