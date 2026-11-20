import styles from "./SkipLink.module.css";

/** Keyboard shortcut past the header, revealed only when focused. */
export function SkipLink({ href = "#main", children = "Skip to content" }) {
  return (
    <a className={styles.skipLink} href={href}>
      {children}
    </a>
  );
}
