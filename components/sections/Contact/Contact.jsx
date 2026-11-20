import { ArrowUpRight, Mail } from "lucide-react";
import { SectionLabel } from "@/components/layout/SectionLabel/SectionLabel";
import { SiteFooter } from "@/components/layout/SiteFooter/SiteFooter";
import { LinkList } from "@/components/ui/LinkList/LinkList";
import { profiles, site } from "@/data/site";
import styles from "./Contact.module.css";

const links = [
  { label: "LinkedIn", href: profiles.linkedin, external: true },
  { label: "Scholar", href: profiles.scholar, external: true },
];

/** Closing section: email, availability note and the site footer. */
export function Contact() {
  return (
    <section className={styles.contactSection} id="contact">
      <SectionLabel
        index="06 / GET IN TOUCH"
        caption="LET’S BUILD SOMETHING MEANINGFUL"
        variant="onDark"
      />

      <div className={styles.contactGrid}>
        <div>
          <p className={styles.contactKicker}>
            Have a question, an idea, or a research opportunity?
          </p>
          <h2>
            Let’s connect<span>.</span>
          </h2>
          <a className={styles.contactEmail} href={`mailto:${site.email}`}>
            {site.email}
            <ArrowUpRight />
          </a>
        </div>

        <div className={styles.contactAside}>
          <Mail size={25} />
          <p>
            I’m interested in Ph.D. research internships in robot learning, world models, and
            autonomous vehicles.
          </p>
          <LinkList links={links} variant="aside" />
        </div>
      </div>

      <SiteFooter year={new Date().getFullYear()} name={site.name} />
    </section>
  );
}
