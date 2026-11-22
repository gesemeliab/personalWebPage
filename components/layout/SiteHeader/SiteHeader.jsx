import { Navigation } from "@/components/layout/Navigation/Navigation";
import { getContent, homePath } from "@/lib/content";
import styles from "./SiteHeader.module.css";

/** Sticky masthead: wordmark on the left, navigation and language on the right. */
export function SiteHeader({ lang }) {
  const { site, navigation, contactLink, ui } = getContent(lang);
  const otherLang = lang === "es" ? "en" : "es";
  return (
    <header className={styles.siteHeader}>
      <a className={styles.wordmark} href="#home" aria-label={ui.homeLabel(site.name)}>
        <span className={styles.logoBracket}>[</span> gm
        <span className={styles.logoDot}>.</span>
        <span className={styles.logoBracket}>]</span>
      </a>
      <Navigation
        items={navigation}
        contact={contactLink}
        text={ui.nav}
        otherLang={otherLang}
        otherHref={homePath(otherLang)}
      />
    </header>
  );
}
