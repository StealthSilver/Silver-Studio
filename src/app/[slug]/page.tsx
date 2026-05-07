import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Footer } from "@/components/sections/footer";
import { Navbar } from "@/components/sections/navbar";
import { ProjectDetail } from "@/components/sections/project-detail";
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
  const item = getWorkBySlug(slug);
  if (!item) {
    notFound();
  }

  return (
    <>
      <Navbar />
      <ProjectDetail item={item} />
      <Footer />
    </>
  );
}
