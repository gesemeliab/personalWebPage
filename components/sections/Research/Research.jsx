import { SectionHeading } from "@/components/layout/SectionHeading/SectionHeading";
import { SectionLabel } from "@/components/layout/SectionLabel/SectionLabel";
import { researchDirections } from "@/data/research";
import styles from "./Research.module.css";

/** The three research directions. */
export function Research() {
  return (
    <section className={styles.researchSection} id="research">
      <SectionLabel index="02 / RESEARCH" caption="QUESTIONS I’M EXPLORING" />

      <SectionHeading
        title={
          <>
            What does a robot need
            <br />
            to see in order to act?
          </>
        }
        description={
          <>
            Three connected directions, one goal:
            <br />
            perception that decisions can rely on.
          </>
        }
      />

      <div className={styles.researchGrid}>
        {researchDirections.map(({ id, number, title, description, tags }) => (
          <article className={styles.researchItem} key={id}>
            <span className={`${styles.researchNumber} mono`}>{number}</span>
            <h3>{title}</h3>
            <p>{description}</p>
            <span className={`${styles.researchTags} mono`}>{tags}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
