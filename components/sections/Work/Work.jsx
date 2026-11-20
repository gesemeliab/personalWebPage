import { SectionHeading } from "@/components/layout/SectionHeading/SectionHeading";
import { SectionLabel } from "@/components/layout/SectionLabel/SectionLabel";
import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import styles from "./Work.module.css";

/** Selected work: four project cards on a tinted panel. */
export function Work() {
  return (
    <section className={styles.workSection} id="work">
      <SectionLabel index="03 / SELECTED WORK" caption="RESEARCH IN PRACTICE" variant="contained" />

      <SectionHeading
        variant="contained"
        title={
          <>
            Ideas meet
            <br />
            the real world.
          </>
        }
        description={
          <>
            A selection of research and engineering
            <br />
            across robots, sensors, and people.
          </>
        }
      />

      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
