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
            Robot perception for decision-making: turning multimodal sensor data into
            representations of the world that robots can act on for navigation and planning.
          </p>
          <p>
            Ph.D. student in Electrical and Computer Engineering at Rochester Institute of
            Technology and Graduate Research Assistant in KAS Lab, advised by Prof. Mohammad Javad
            Khojasteh. Current research focuses on perception that withstands sensor degradation on
            underwater robots, fusing camera and sonar so that an AUV keeps perceiving its
            surroundings as visibility drops. Broader interests include world models (JEPA),
            diffusion models for planning, and MPC driven by learned perception.
          </p>
          <p>
            Nine years of experience deploying perception on physical robots: quad-rotors, field
            rovers and AUVs. Previously, four and a half years at Intel Labs, architecting a
            real-time multimodal perception system taken from research prototype to deployment in
            three semiconductor fabs worldwide.
          </p>
          <LinkList links={links} />
        </div>
      </div>
    </section>
  );
}
