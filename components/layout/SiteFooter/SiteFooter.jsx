import { ArrowRight } from "lucide-react";
import styles from "./SiteFooter.module.css";

/** Closing row of the contact section. */
export function SiteFooter({ year, note = "ALWAYS LEARNING.", name }) {
  return (
    <footer className={styles.footer}>
      <span>{`© ${year} ${name}`}</span>
      <span className="mono">{note}</span>
      <a href="#home">
        Back to top <ArrowRight size={15} />
      </a>
    </footer>
  );
}
