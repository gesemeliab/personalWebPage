import { MapPin } from "lucide-react";
import { SectionLabel } from "@/components/layout/SectionLabel/SectionLabel";
import { LinkList } from "@/components/ui/LinkList/LinkList";
import { cx } from "@/lib/classNames";
import { getContent } from "@/lib/content";
import sectionStyles from "@/styles/section.module.css";
import styles from "./About.module.css";

/** Profile card and the personal introduction. */
export function About({ lang }) {
  const { site, profiles, ui } = getContent(lang);
  const text = ui.about;
  const links = [
    { label: "Google Scholar", href: profiles.scholar, external: true },
    { label: "LinkedIn", href: profiles.linkedin, external: true },
    { label: text.email, href: `mailto:${site.email}` },
  ];

  return (
    <section className={sectionStyles.section} id="about">
      <SectionLabel index={text.label} caption={text.caption} variant="plain" />

      <div className={styles.aboutGrid}>
        <div className={styles.profileCard}>
          <div className={styles.portraitFrame}>
            {/* A plain <img>: the static export serves no image optimiser, so the
                density variants are pre-scaled files (scripts/portrait.ps1). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={site.portrait.src} srcSet={site.portrait.srcSet} alt={site.name} width={345} height={325} decoding="async" />
            <span className={cx(styles.profileCross, "mono")} aria-hidden="true">
              +
            </span>
          </div>
          <div className={styles.profileCaption}>
            <strong>{site.fullName}</strong>
            <span>
              <MapPin size={13} />
              {site.location}
            </span>
          </div>
        </div>

        <div className={styles.aboutCopy}>
          <h2>
            {text.heading[0]}
            <br />
            {text.heading[1]}
          </h2>
          <p className={styles.largeCopy}>{text.lead}</p>
          {text.body.map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
          <LinkList links={links} lang={lang} />
        </div>
      </div>
    </section>
  );
}
