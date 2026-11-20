import { ArrowUpRight } from "lucide-react";

/**
 * Link that opens in a new tab.
 *
 * Carries the arrow icon the design uses to mark outbound links, and tells
 * screen reader users where the link goes - the icon alone cannot.
 */
export function ExternalLink({ href, className, size = 16, children }) {
  return (
    <a className={className} href={href} target="_blank" rel="noopener noreferrer">
      {children}
      <ArrowUpRight size={size} />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
