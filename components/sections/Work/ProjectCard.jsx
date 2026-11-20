import { Plus } from "lucide-react";
import { cx } from "@/lib/classNames";
import { ExternalLink } from "@/components/ui/ExternalLink/ExternalLink";
import { FlowDiagram } from "./FlowDiagram";
import { NavigationDiagram } from "./NavigationDiagram";
import styles from "./Work.module.css";

/**
 * One project: a diagram above, the write-up below, and an expander holding
 * the context, what was actually built, and what the evidence for it is.
 */
export function ProjectCard({ project }) {
  const {
    visual,
    visualLabel,
    visualNote,
    flow,
    theme,
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
    <article className={styles.project}>
      {visual === "navigation" ? (
        <div className={cx(styles.projectVisual, styles.navigationVisual)}>
          <span className={cx(styles.visualLabel, "mono")}>{visualLabel}</span>
          <NavigationDiagram />
          <span className={styles.visualNote}>{visualNote}</span>
        </div>
      ) : (
        <FlowDiagram label={visualLabel} flow={flow} theme={theme} />
      )}

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
