import { cx } from "@/lib/classNames";
import { SectionLabel } from "@/components/layout/SectionLabel/SectionLabel";
import { education, timeline } from "@/data/experience";
import { Toolbox } from "./Toolbox";
import styles from "./Experience.module.css";

/** Education on the left, career timeline on the right, toolbox underneath. */
export function Experience() {
  return (
    <section className={styles.experienceSection} id="experience">
      <SectionLabel index="05 / EXPERIENCE & EDUCATION" caption="THE PATH SO FAR" />

      <div className={styles.careerGrid}>
        <div>
          <h2>
            From building
            <br />
            to understanding.
          </h2>
          <p className={styles.careerIntro}>
            Nine years of putting perception on physical robots and into deployment, from
            quad-rotors to semiconductor fabs to AUVs.
          </p>

          <h3 className={cx(styles.educationTitle, "mono")}>EDUCATION</h3>
          {education.map(({ id, period, degree, institution, note }) => (
            <article className={styles.education} key={id}>
              <span className="mono">{period}</span>
              <h4>{degree}</h4>
              <p>{institution}</p>
              <small>{note}</small>
            </article>
          ))}
        </div>

        <div className={styles.timeline}>
          {timeline.map(({ id, period, organization, role, description }) => (
            <article className={styles.timelineItem} key={id}>
              <span className="mono">{period}</span>
              <h3>{organization}</h3>
              <h4>{role}</h4>
              <p>{description}</p>
            </article>
          ))}
        </div>
      </div>

      <Toolbox />
    </section>
  );
}
