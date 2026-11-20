import { cx } from "@/lib/classNames";
import styles from "./Work.module.css";

/**
 * Two sensors -> visibility-conditioned weighting -> detections, beside a bar
 * chart of the reported results.
 *
 * Unlike the other card diagrams, the bars are data: they plot the numbers in
 * `results`, scaled to the largest value, and every bar prints its value.
 */
export function FusionDiagram({ label, fusion, results, note }) {
  const max = Math.max(...results.rows.map(({ value }) => value));

  return (
    <div className={cx(styles.projectVisual, styles.fusionVisual)}>
      <span className={cx(styles.visualLabel, "mono")}>{label}</span>

      <div className={styles.fusionBody}>
        <div className={styles.fusionPipeline} aria-hidden="true">
          <div className={styles.fusionInputs}>
            {fusion.inputs.map(({ id, label: inputLabel, note: inputNote }) => (
              <span key={id} className={cx(styles.fusionInput, styles[id])}>
                <strong className="mono">{inputLabel}</strong>
                <small className="mono">{inputNote}</small>
              </span>
            ))}
          </div>
          <span className={styles.fusionConnector} />
          <span className={cx(styles.fusionGate, "mono")}>{fusion.gate}</span>
          <span className={styles.fusionConnector} />
          <strong className={cx(styles.fusionOutput, "mono")}>{fusion.output}</strong>
        </div>

        <figure className={styles.fusionResults}>
          <figcaption className="mono">{results.title}</figcaption>
          <dl>
            {results.rows.map(({ label: rowLabel, value, highlight }) => (
              <div key={rowLabel} className={cx(styles.resultRow, highlight && styles.highlight)}>
                <dt className="mono">{rowLabel}</dt>
                <dd>
                  <span className={styles.resultTrack} aria-hidden="true">
                    <span
                      className={styles.resultBar}
                      style={{ width: `${(value / max) * 100}%` }}
                    />
                  </span>
                  <span className={cx(styles.resultValue, "mono")}>{`${value}%`}</span>
                </dd>
              </div>
            ))}
          </dl>
          <p className={cx(styles.resultFootnote, "mono")}>{results.footnote}</p>
        </figure>
      </div>

      <span className={styles.visualNote}>{note}</span>
    </div>
  );
}
