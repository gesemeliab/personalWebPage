import { cx } from "@/lib/classNames";
import styles from "./SectionLabel.module.css";

/**
 * The numbered rule that opens every section.
 *
 * @param {"plain"|"onDark"|"contained"} [variant] - defined in SectionLabel.module.css.
 */
export function SectionLabel({ index, caption, variant, className }) {
  return (
    <div className={cx(styles.sectionLabel, "mono", variant && styles[variant], className)}>
      <span>{index}</span>
      <span>{caption}</span>
    </div>
  );
}
