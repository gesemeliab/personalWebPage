import { SectionHeading } from "@/components/layout/SectionHeading/SectionHeading";
import { SectionLabel } from "@/components/layout/SectionLabel/SectionLabel";
import { getContent } from "@/lib/content";
import { ProjectCard } from "./ProjectCard";
import styles from "./Work.module.css";

/**
 * Selected work on a tinted panel. Featured projects span the grid; every
 * second one is mirrored so the page alternates diagram-left / diagram-right.
 */
export function Work({ lang }) {
  const { projects, ui } = getContent(lang);
  const text = ui.work;
  const featuredIds = projects.filter(({ featured }) => featured).map(({ id }) => id);

  return (
    <section className={styles.workSection} id="work">
      <SectionLabel index={text.label} caption={text.caption} variant="contained" />

      <SectionHeading
        variant="contained"
        title={
          <>
            {text.heading[0]}
            <br />
            {text.heading[1]}
          </>
        }
        description={
          <>
            {text.description[0]}
            <br />
            {text.description[1]}
          </>
        }
      />

      <div className={styles.projectGrid}>
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            lang={lang}
            mirrored={featuredIds.indexOf(project.id) % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
}
