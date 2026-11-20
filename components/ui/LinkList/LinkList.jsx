import { ArrowUpRight } from "lucide-react";
import { cx } from "@/lib/classNames";
import { ExternalLink } from "@/components/ui/ExternalLink/ExternalLink";
import styles from "./LinkList.module.css";

/**
 * Row of underlined links.
 *
 * @param {{label: string, href: string, external?: boolean}[]} links
 * @param {"aside"} [variant] - spacing variant defined in LinkList.module.css.
 */
export function LinkList({ links, variant, className }) {
  return (
    <div className={cx(styles.linkList, variant && styles[variant], className)}>
      {links.map(({ label, href, external }) =>
        external ? (
          <ExternalLink key={href} href={href}>
            {label}
          </ExternalLink>
        ) : (
          <a key={href} href={href}>
            {label}
            <ArrowUpRight size={16} />
          </a>
        ),
      )}
    </div>
  );
}
