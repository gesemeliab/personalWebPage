import { ArrowUpRight, Mail } from "lucide-react";
import { SectionLabel } from "@/components/layout/SectionLabel/SectionLabel";
import { SiteFooter } from "@/components/layout/SiteFooter/SiteFooter";
import { LinkList } from "@/components/ui/LinkList/LinkList";
import { getContent } from "@/lib/content";
import styles from "./Contact.module.css";

/** Closing section: email, availability note and the site footer. */
export function Contact({ lang }) {
  const { site, profiles, availability, ui } = getContent(lang);
  const text = ui.contact;
  const links = [
    { label: "LinkedIn", href: profiles.linkedin, external: true },
    { label: "Scholar", href: profiles.scholar, external: true },
  ];

  return (
    <section className={styles.contactSection} id="contact">
      <SectionLabel index={text.label} caption={text.caption} variant="onDark" />

      <div className={styles.contactGrid}>
        <div>
          <p className={styles.contactKicker}>{text.kicker}</p>
          <h2>
            {text.heading}<span>.</span>
          </h2>
          <a className={styles.contactEmail} href={`mailto:${site.email}`}>
            {site.email}
            <ArrowUpRight />
          </a>
        </div>

        <div className={styles.contactAside}>
          <Mail size={25} />
          <p>{availability.long}</p>
          <LinkList links={links} variant="aside" lang={lang} />
        </div>
      </div>

      <SiteFooter
        year={new Date().getFullYear()}
        name={site.name}
        note={text.footerNote}
        backToTop={text.backToTop}
      />
    </section>
  );
}
