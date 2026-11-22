import { SectionHeading } from "@/components/layout/SectionHeading/SectionHeading";
import { SectionLabel } from "@/components/layout/SectionLabel/SectionLabel";
import { projects } from "@/data/projects";
import { ProjectCard } from "./ProjectCard";
import styles from "./Work.module.css";

/**
 * Selected work on a tinted panel. Featured projects span the grid; every
 * second one is mirrored so the page alternates diagram-left / diagram-right.
 */
const featuredIds = projects.filter(({ featured }) => featured).map(({ id }) => id);

export function Work() {
  return (
    <section className={styles.workSection} id="work">
      <SectionLabel index="02 / SELECTED WORK" caption="RESEARCH IN PRACTICE" variant="contained" />

      <SectionHeading
        variant="contained"
        title={
          <>
            From sensors
            <br />
            to decisions.
          </>
        }
        description={
          <>
            Robot perception underwater, on the ground,
            <br />
            in the air, and in the fab.
          </>
        }
      />

      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            mirrored={featuredIds.indexOf(project.id) % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}
