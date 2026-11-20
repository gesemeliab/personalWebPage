import { SiteHeader } from "@/components/layout/SiteHeader/SiteHeader";
import { SkipLink } from "@/components/ui/SkipLink/SkipLink";
import { Hero } from "@/components/sections/Hero/Hero";
import { About } from "@/components/sections/About/About";
import { Research } from "@/components/sections/Research/Research";
import { Work } from "@/components/sections/Work/Work";
import { Publications } from "@/components/sections/Publications/Publications";
import { Experience } from "@/components/sections/Experience/Experience";
import { Contact } from "@/components/sections/Contact/Contact";

/** The portfolio is a single page; each section is its own component. */
export default function HomePage() {
  return (
    <>
      <SkipLink />
      <SiteHeader />
      <main id="main">
        <Hero />
        <About />
        <Research />
        <Work />
        <Publications />
        <Experience />
        <Contact />
      </main>
    </>
  );
}
