import { SectionHeading } from "@/components/layout/SectionHeading/SectionHeading";
import { SectionLabel } from "@/components/layout/SectionLabel/SectionLabel";
import { researchDirections } from "@/data/research";
import styles from "./Research.module.css";

/** Where the work is headed: for each area, what is done and what is next. */
export function Research() {
  return (
    <section className={styles.researchSection} id="directions">
      <SectionLabel index="05 / DIRECTIONS" caption="DONE SO FAR, AND NEXT" />

      <SectionHeading
        title="Where the work is headed."
        description="Each direction starts from the work above."
      />

      <div className={styles.directions}>
        <div className={`${styles.directionsHead} mono`} aria-hidden="true">
          <span>AREA</span>
          <span>SO FAR</span>
          <span>NEXT</span>
        </div>
        {researchDirections.map(({ id, number, title, done, next }) => (
          <article className={styles.direction} key={id}>
            <h3>
              <span className="mono">{number}</span>
              {title}
            </h3>
            <div>
              <span className={`${styles.directionTag} mono`}>SO FAR</span>
              <p>{done}</p>
            </div>
            <div>
              <span className={`${styles.directionTag} mono`}>NEXT</span>
              <p className={styles.next}>{next}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
