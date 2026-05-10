import { HomeLoadExperience } from "@/components/home-load-experience";
import { Faq } from "@/components/sections/faq";
import { FinalCta } from "@/components/sections/final-cta";
import { Hero } from "@/components/sections/hero";
import { Navbar } from "@/components/sections/navbar";
import { PoweredBySilverUi } from "@/components/sections/powered-by-silver-ui";
import { Process } from "@/components/sections/process";
import { Services } from "@/components/sections/services";
import { Testimonials } from "@/components/sections/testimonials";
import { Work } from "@/components/sections/work";

export default function Home() {
  return (
    <HomeLoadExperience
      navbar={<Navbar />}
      slots={{
        hero: <Hero />,
        sections: (
          <>
            <Work />
            <Services />

            <PoweredBySilverUi />
            <Process />
            <Faq />
            <Testimonials />
            <FinalCta />
          </>
        ),
      }}
    />
  );
}
