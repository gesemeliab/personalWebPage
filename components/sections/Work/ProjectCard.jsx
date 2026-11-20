import { Plus } from "lucide-react";
import { cx } from "@/lib/classNames";
import { ExternalLink } from "@/components/ui/ExternalLink/ExternalLink";
import { FlowDiagram } from "./FlowDiagram";
import { FusionDiagram } from "./FusionDiagram";
import { NavigationDiagram } from "./NavigationDiagram";
import styles from "./Work.module.css";

/** The diagram a project asks for through its `visual` field. */
function ProjectVisual({ project }) {
  const { visual, visualLabel, visualNote, flow, fusion, results, theme } = project;

  if (visual === "fusion") {
    return <FusionDiagram label={visualLabel} fusion={fusion} results={results} note={visualNote} />;
  }

  if (visual === "navigation") {
    return (
      <div className={cx(styles.projectVisual, styles.navigationVisual)}>
        <span className={cx(styles.visualLabel, "mono")}>{visualLabel}</span>
        <NavigationDiagram />
        <span className={styles.visualNote}>{visualNote}</span>
      </div>
    );
  }

  return <FlowDiagram label={visualLabel} flow={flow} theme={theme} />;
}

/**
 * One project: a diagram, the write-up, and an expander holding the context,
 * what was actually built, and what the evidence for it is. A `featured`
 * project spans the grid with the diagram beside the text.
 */
export function ProjectCard({ project, mirrored = false }) {
  const {
    featured,
    category,
    number,
    title,
    summary,
    tags,
    context,
    shortTitle,
    detail,
    evidence,
    link,
    linkLabel,
  } = project;

  return (
    <article className={cx(styles.project, featured && styles.featured, mirrored && styles.mirrored)}>
      <ProjectVisual project={project} />

      <div className={styles.projectBody}>
        <div className={cx(styles.projectMeta, "mono")}>
          <span>{category}</span>
          <span>{`/${number}`}</span>
        </div>
        <h3>{title}</h3>
        <p>{summary}</p>
        <ul className={styles.tags}>
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        <details>
          <summary>
            Behind the project <Plus size={17} />
          </summary>
          <div className={styles.projectDetail}>
            <span className="mono">{context}</span>
            <h4>{shortTitle}</h4>
            <p>{detail}</p>
            <p>{evidence}</p>
            {link ? <ExternalLink href={link}>{linkLabel}</ExternalLink> : null}
          </div>
        </details>
      </div>
    </article>
  );
}
