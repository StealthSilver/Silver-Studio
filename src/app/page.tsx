import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Footer } from "@/components/sections/footer";
import { Hero } from "@/components/sections/hero";
import { Navbar } from "@/components/sections/navbar";
import { PoweredBySilverUi } from "@/components/sections/powered-by-silver-ui";
import { Pricing } from "@/components/sections/pricing";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { Testimonials } from "@/components/sections/testimonials";
import { WhySilverStudios } from "@/components/sections/why-silver-studios";
import { Work } from "@/components/sections/work";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="mx-auto flex min-h-0 w-full max-w-7xl flex-1 flex-col overflow-x-visible overflow-y-visible bg-background px-4 pb-8 pt-6 text-foreground sm:px-6 sm:pt-8 lg:px-8">
        <div className="shrink-0">
          <Hero />
        </div>
        <Work />
        <Services />
        {/* <WhySilverStudios />
        <PoweredBySilverUi />
        <Process />
        <Testimonials />
        <Pricing />
        <Faq />
        <FinalCta /> */}
      </main>
      <Footer />
    </>
  );
}
