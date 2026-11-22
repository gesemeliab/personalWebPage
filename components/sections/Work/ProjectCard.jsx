import { cx } from "@/lib/classNames";
import { ExternalLink } from "@/components/ui/ExternalLink/ExternalLink";
import { DiffusionDiagram } from "./DiffusionDiagram";
import { FlowDiagram } from "./FlowDiagram";
import { FusionDiagram } from "./FusionDiagram";
import { MarieDiagram } from "./MarieDiagram";
import { RoverDiagram } from "./RoverDiagram";
import { TrialReplay } from "./TrialReplay";
import { UavDiagram } from "./UavDiagram";
import styles from "./Work.module.css";

/** The diagram a project asks for through its `visual` field. */
function ProjectVisual({ project }) {
  const { visual, visualLabel, visualNote, flow, theme } = project;

  switch (visual) {
    case "fusion":
      return <FusionDiagram label={visualLabel} note={visualNote} />;
    case "replay":
      return <TrialReplay label={visualLabel} note={visualNote} />;
    case "diffusion":
      return <DiffusionDiagram label={visualLabel} note={visualNote} />;
    case "marie":
      return <MarieDiagram label={visualLabel} note={visualNote} />;
    case "rover":
      return <RoverDiagram label={visualLabel} note={visualNote} />;
    case "uav":
      return <UavDiagram label={visualLabel} note={visualNote} />;
    default:
      return <FlowDiagram label={visualLabel} flow={flow} theme={theme} />;
  }
}

/**
 * One project: a diagram beside a single abstract, its key numbers, and a
 * closing line with the context and the paper. A `featured` project spans the
 * grid with the diagram beside the text.
 */
export function ProjectCard({ project, mirrored = false }) {
  const { featured, category, number, title, abstract, tags, keyStats, context, link, linkLabel } = project;

  return (
    <article className={cx(styles.project, featured && styles.featured, mirrored && styles.mirrored)}>
      <ProjectVisual project={project} />

      <div className={styles.projectBody}>
        <div className={cx(styles.projectMeta, "mono")}>
          <span>{category}</span>
          <span>{`/${number}`}</span>
        </div>
        <h3>{title}</h3>
        <p>{abstract}</p>
        <ul className={styles.tags}>
          {tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>

        {keyStats ? (
          <dl className={styles.keyStats}>
            {keyStats.map(({ value, label }) => (
              <div key={label}>
                <dt>{value}</dt>
                <dd>{label}</dd>
              </div>
            ))}
          </dl>
        ) : null}

        <div className={styles.projectFoot}>
          <span className="mono">{context}</span>
          {link ? <ExternalLink href={link}>{linkLabel}</ExternalLink> : null}
        </div>
      </div>
    </article>
  );
}
