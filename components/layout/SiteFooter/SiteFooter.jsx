import { ArrowRight } from "lucide-react";
import styles from "./SiteFooter.module.css";

/** Closing row of the contact section. */
export function SiteFooter({ year, note, name, backToTop }) {
  return (
    <footer className={styles.footer}>
      <span>{`© ${year} ${name}`}</span>
      <span className="mono">{note}</span>
      <a href="#home">
        {backToTop} <ArrowRight size={15} />
      </a>
    </footer>
  );
}
