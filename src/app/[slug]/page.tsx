import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/sections/footer";
import { Navbar } from "@/components/sections/navbar";
import { getWorkBySlug, workSection } from "@/data/site";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return workSection.items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const item = getWorkBySlug(slug);
  if (!item) {
    return {};
  }
  return {
    title: item.title,
    description: item.description,
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  if (!getWorkBySlug(slug)) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-[50vh] w-full max-w-7xl flex-1 flex-col bg-background px-4 pb-8 pt-6 text-foreground sm:px-6 sm:pt-8 lg:px-8" />
      <Footer />
    </>
  );
}
