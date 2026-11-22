import { SectionHeading } from "@/components/layout/SectionHeading/SectionHeading";
import { SectionLabel } from "@/components/layout/SectionLabel/SectionLabel";
import { getContent } from "@/lib/content";
import styles from "./Research.module.css";

/** Where the work is headed: for each area, what is done and what is next. */
export function Research({ lang }) {
  const { researchDirections, ui } = getContent(lang);
  const text = ui.directions;

  return (
    <section className={styles.researchSection} id="directions">
      <SectionLabel index={text.label} caption={text.caption} />

      <SectionHeading
        title={text.heading}
        description={text.description}
      />

      <div className={styles.directions}>
        <div className={`${styles.directionsHead} mono`} aria-hidden="true">
          <span>{text.area}</span>
          <span>{text.done}</span>
          <span>{text.next}</span>
        </div>
        {researchDirections.map(({ id, number, title, done, next }) => (
          <article className={styles.direction} key={id}>
            <h3>
              <span className="mono">{number}</span>
              {title}
            </h3>
            <div>
              <span className={`${styles.directionTag} mono`}>{text.done}</span>
              <p>{done}</p>
            </div>
            <div>
              <span className={`${styles.directionTag} mono`}>{text.next}</span>
              <p className={styles.next}>{next}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
