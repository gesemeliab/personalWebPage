import { ArrowUpRight } from "lucide-react";
import { cx } from "@/lib/classNames";
import { SectionHeading } from "@/components/layout/SectionHeading/SectionHeading";
import { SectionLabel } from "@/components/layout/SectionLabel/SectionLabel";
import { ExternalLink } from "@/components/ui/ExternalLink/ExternalLink";
import { publicationNote, publications, selfNames } from "@/data/publications";
import { profiles } from "@/data/site";
import styles from "./Publications.module.css";

// Longest name first, so "G. G. Mejia" is matched whole rather than as "G. Mejia".
const escape = (name) => name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const selfPattern = new RegExp(
  `(${[...selfNames].sort((a, b) => b.length - a.length).map(escape).join("|")})`,
);

/** An author list with my own name set in bold. */
function Authors({ authors }) {
  return authors
    .split(selfPattern)
    .map((part, index) => (selfNames.includes(part) ? <strong key={index}>{part}</strong> : part));
}

/** Publication list, newest first. */
export function Publications() {
  return (
    <section className={styles.publicationsSection} id="publications">
      <SectionLabel index="03 / PUBLICATIONS" caption="SHARING THE WORK" />

      <SectionHeading
        variant="tight"
        title="Written & published."
        action={<ExternalLink href={profiles.scholar}>Google Scholar</ExternalLink>}
      />

      <p className={styles.publicationNote}>{publicationNote}</p>

      {publications.map(({ id, year, title, authors, venue, href, status = "DRAFT" }) => (
        <article className={styles.publication} key={id}>
          <span className={cx(styles.pubYear, "mono")}>{year}</span>
          <div>
            <h3>
              {href ? (
                <a href={href} target="_blank" rel="noopener noreferrer">
                  {title}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              ) : (
                title
              )}
            </h3>
            <p className={styles.pubAuthors}>
              <Authors authors={authors} />
            </p>
            <p className={styles.pubVenue}>{venue}</p>
          </div>
          {href ? (
            <a
              className={styles.pubLink}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Read ${title} (opens in a new tab)`}
            >
              <ArrowUpRight size={22} />
            </a>
          ) : (
            <span className={cx(styles.draft, "mono")}>{status}</span>
          )}
        </article>
      ))}
    </section>
  );
}
