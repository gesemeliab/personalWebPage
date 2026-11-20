import { Navigation } from "@/components/layout/Navigation/Navigation";
import { site } from "@/data/site";
import styles from "./SiteHeader.module.css";

/** Sticky masthead: wordmark on the left, navigation on the right. */
export function SiteHeader() {
  return (
    <header className={styles.siteHeader}>
      <a className={styles.wordmark} href="#home" aria-label={`${site.name}, home`}>
        <span className={styles.logoBracket}>[</span> gm
        <span className={styles.logoDot}>.</span>
        <span className={styles.logoBracket}>]</span>
      </a>
      <Navigation />
    </header>
  );
}
