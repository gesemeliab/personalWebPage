import Image from "next/image";
import { MapPin } from "lucide-react";
import { SectionLabel } from "@/components/layout/SectionLabel/SectionLabel";
import { LinkList } from "@/components/ui/LinkList/LinkList";
import { cx } from "@/lib/classNames";
import { profiles, site } from "@/data/site";
import sectionStyles from "@/styles/section.module.css";
import styles from "./About.module.css";

const links = [
  { label: "Google Scholar", href: profiles.scholar, external: true },
  { label: "LinkedIn", href: profiles.linkedin, external: true },
  { label: "Email", href: `mailto:${site.email}` },
];

/** Profile card and the personal introduction. */
export function About() {
  return (
    <section className={sectionStyles.section} id="about">
      <SectionLabel index="01 / ABOUT" caption="A LITTLE CONTEXT" variant="plain" />

      <div className={styles.aboutGrid}>
        <div className={styles.profileCard}>
          <div className={styles.portraitFrame}>
            <Image src={site.portrait} alt={site.name} fill sizes="345px" />
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
            Curious by nature.
            <br />
            Hands-on by design.
          </h2>
          <p className={styles.largeCopy}>
            I work at the intersection of robot learning, perception, and control — turning ideas
            into systems that interact with the physical world.
          </p>
          <p>
            I’m a Ph.D. student in Electrical and Computer Engineering at Rochester Institute of
            Technology and a Graduate Research Assistant in KAS Lab. My research focuses on safe
            decision-making for embodied agents, self-supervised world models, and
            uncertainty-aware control.
          </p>
          <p>
            Before RIT, I spent nearly five years at Intel Labs building multimodal learning
            systems. My path has taken me from aerial robots and agricultural rovers to industrial
            AI and underwater autonomy.
          </p>
          <LinkList links={links} />
        </div>
      </div>
    </section>
  );
}
