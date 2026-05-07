import Link from "next/link";

import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col bg-background px-4 pb-8 pt-0 text-foreground sm:px-6 lg:px-8">
        <section
          className="hero flex w-full shrink-0 flex-col justify-center"
          aria-label="Introduction"
        >
          <div className="mx-auto flex w-full max-w-6xl flex-col items-start px-2 text-left">
            <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl sm:leading-[1.1] lg:text-6xl dark:text-zinc-50">
              Built to stand out.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg dark:text-zinc-400">
              We create modern websites and landing pages for startups that care
              about design, performance, and perception.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/#contact"
                className="talk-now-btn inline-flex h-11 items-center justify-center rounded-[4px] px-6 text-sm font-semibold tracking-wide"
              >
                BOOK A CALL
              </Link>
              <Link
                href="/#work"
                className="inline-flex h-11 items-center justify-center rounded-[4px] border border-zinc-300 bg-background px-6 text-sm font-semibold tracking-wide text-zinc-900 shadow-sm transition-colors hover:border-zinc-400 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:border-zinc-600 dark:hover:bg-zinc-900"
              >
                SEE WORK
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
