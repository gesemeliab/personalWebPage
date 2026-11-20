import { cx } from "@/lib/classNames";
import styles from "./Work.module.css";

/**
 * Observations -> intermediate signals -> model output.
 *
 * @param {"rover"|"uav"} [theme] - palette variant defined in Work.module.css.
 */
export function FlowDiagram({ label, flow, theme }) {
  return (
    <div className={cx(styles.projectVisual, styles.flowVisual, theme && styles[theme])}>
      <span className={cx(styles.visualLabel, "mono")}>{label}</span>
      <span className={cx(styles.flowInput, "mono")}>{flow.input}</span>
      <div className={styles.flowNodes}>
        {flow.nodes.map((node) => (
          <span key={node}>{node}</span>
        ))}
      </div>
      <div className={styles.flowConnector} aria-hidden="true" />
      <strong className={styles.flowOutput}>{flow.output}</strong>
      <span className={cx(styles.flowFoot, "mono")}>{flow.foot}</span>
    </div>
  );
}
