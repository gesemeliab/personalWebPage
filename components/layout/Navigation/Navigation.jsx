"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cx } from "@/lib/classNames";
import { useActiveSection } from "@/hooks/useActiveSection";
import styles from "./Navigation.module.css";

/**
 * Primary navigation, the language switch, and the toggle that opens the
 * navigation on small screens.
 *
 * The link for the section currently in view is marked active; following a
 * link closes the menu, and so does Escape. The language switch keeps the
 * section the reader is on: it carries the current #hash to the other page.
 *
 * @param {object} props
 * @param {{id: string, label: string}[]} props.items
 * @param {{label: string, href: string}} props.contact
 * @param {{label: string, open: string, close: string, switchLang: string, switchLangLabel: string}} props.text
 * @param {string} props.otherLang - the other language's code, e.g. "es".
 * @param {string} props.otherHref - the other language's page, e.g. "/es/".
 */
export function Navigation({ items, contact, text, otherLang, otherHref }) {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(items.map(({ id }) => id));
  const close = () => setOpen(false);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Point the link at the same section on the other page just before the
  // browser follows it.
  const switchLanguage = (event) => {
    event.currentTarget.href = `${otherHref}${window.location.hash}`;
  };

  return (
    <div className={styles.navArea}>
      <nav className={cx(styles.nav, open && styles.isOpen)} id="main-nav" aria-label={text.label}>
        {items.map(({ id, label }) => (
          <a
            key={id}
            className={active === id ? styles.active : undefined}
            aria-current={active === id ? "location" : undefined}
            href={`#${id}`}
            onClick={close}
          >
            {label}
          </a>
        ))}
        <a className={styles.navContact} href={contact.href} onClick={close}>
          {contact.label} <ArrowUpRight size={16} />
        </a>
      </nav>

      <a
        className={cx(styles.langSwitch, "mono")}
        href={otherHref}
        hrefLang={otherLang}
        lang={otherLang}
        aria-label={text.switchLangLabel}
        onClick={switchLanguage}
      >
        {text.switchLang}
      </a>

      <button
        className={styles.menuToggle}
        type="button"
        aria-label={open ? text.close : text.open}
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X /> : <Menu />}
      </button>
    </div>
  );
}
