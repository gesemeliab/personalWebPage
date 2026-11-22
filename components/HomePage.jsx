import { SiteHeader } from "@/components/layout/SiteHeader/SiteHeader";
import { SkipLink } from "@/components/ui/SkipLink/SkipLink";
import { Hero } from "@/components/sections/Hero/Hero";
import { About } from "@/components/sections/About/About";
import { Research } from "@/components/sections/Research/Research";
import { Work } from "@/components/sections/Work/Work";
import { Publications } from "@/components/sections/Publications/Publications";
import { Experience } from "@/components/sections/Experience/Experience";
import { Contact } from "@/components/sections/Contact/Contact";
import { getContent } from "@/lib/content";

/**
 * The portfolio is a single page, rendered once per language; each section is
 * its own component and reads its text for `lang`.
 */
export function HomePage({ lang }) {
  const { ui } = getContent(lang);
  return (
    <>
      <SkipLink>{ui.skip}</SkipLink>
      <SiteHeader lang={lang} />
      <main id="main">
        <Hero lang={lang} />
        <About lang={lang} />
        <Work lang={lang} />
        <Publications lang={lang} />
        <Experience lang={lang} />
        <Research lang={lang} />
        <Contact lang={lang} />
      </main>
    </>
  );
}
