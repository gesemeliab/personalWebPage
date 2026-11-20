import { cx } from "@/lib/classNames";
import styles from "./SectionHeading.module.css";

/**
 * Section title with an optional supporting line or trailing link.
 *
 * `description` and `action` are styled as direct children, so they are
 * rendered here rather than passed through as arbitrary content.
 *
 * @param {"tight"|"contained"} [variant] - defined in SectionHeading.module.css.
 */
export function SectionHeading({ title, description, action, variant, className }) {
  return (
    <div className={cx(styles.sectionHeading, variant && styles[variant], className)}>
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
      {action}
    </div>
  );
}
