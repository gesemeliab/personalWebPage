import { cx } from "@/lib/classNames";
import styles from "./Button.module.css";

/**
 * Link styled as a button.
 *
 * @param {"lime"} [variant] - colour variant defined in Button.module.css.
 */
export function Button({ href, variant = "lime", className, children }) {
  return (
    <a className={cx(styles.button, styles[variant], className)} href={href}>
      {children}
    </a>
  );
}
