"use client";

import { useEffect, useState } from "react";

/**
 * Tracks which section is currently in view, so the nav can highlight it.
 *
 * The margins bias the observer towards the section occupying the upper part
 * of the viewport, which is what reads as "the section you are looking at".
 *
 * @param {string[]} ids - element ids to watch, in document order.
 * @returns {string} the id of the active section, or "" before the first hit.
 */
export function useActiveSection(ids) {
  const [active, setActive] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-15% 0px -60% 0px" },
    );

    ids.forEach((id) => {
      const node = document.getElementById(id);
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [ids]);

  return active;
}
