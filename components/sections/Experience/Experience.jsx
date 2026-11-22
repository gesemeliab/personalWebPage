import { cx } from "@/lib/classNames";
import { SectionLabel } from "@/components/layout/SectionLabel/SectionLabel";
import { getContent } from "@/lib/content";
import { Toolbox } from "./Toolbox";
import styles from "./Experience.module.css";

/** Education on the left, career timeline on the right, toolbox underneath. */
export function Experience({ lang }) {
  const { education, timeline, skills, ui } = getContent(lang);
  const text = ui.experience;

  return (
    <section className={styles.experienceSection} id="experience">
      <SectionLabel index={text.label} caption={text.caption} />

      <div className={styles.careerGrid}>
        <div>
          <h2>
            {text.heading[0]}
            <br />
            {text.heading[1]}
          </h2>
          <p className={styles.careerIntro}>{text.intro}</p>

          <h3 className={cx(styles.educationTitle, "mono")}>{text.education}</h3>
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

      <Toolbox skills={skills} title={text.toolbox} />
    </section>
  );
}
