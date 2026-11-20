"use client";

import { useEffect, useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { cx } from "@/lib/classNames";
import { useActiveSection } from "@/hooks/useActiveSection";
import { contactLink, navigation } from "@/data/site";
import styles from "./Navigation.module.css";

const SECTION_IDS = navigation.map(({ id }) => id);

/**
 * Primary navigation and the toggle that opens it on small screens.
 *
 * Renders both elements as siblings of the wordmark, so the header keeps its
 * wordmark / toggle / nav order. The link for the section currently in view is
 * marked active, following a link closes the menu, and so does Escape.
 */
export function Navigation() {
  const [open, setOpen] = useState(false);
  const active = useActiveSection(SECTION_IDS);
  const close = () => setOpen(false);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <>
      <button
        className={styles.menuToggle}
        type="button"
        aria-label={open ? "Close navigation" : "Open navigation"}
        aria-expanded={open}
        aria-controls="main-nav"
        onClick={() => setOpen((current) => !current)}
      >
        {open ? <X /> : <Menu />}
      </button>

      <nav className={cx(styles.nav, open && styles.isOpen)} id="main-nav" aria-label="Main navigation">
        {navigation.map(({ id, label }) => (
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
        <a className={styles.navContact} href={contactLink.href} onClick={close}>
          {contactLink.label} <ArrowUpRight size={16} />
        </a>
      </nav>
    </>
  );
}
