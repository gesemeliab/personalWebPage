"use client";

import { useEffect, useState } from "react";

/**
 * Whether the visitor asked the system for reduced motion.
 *
 * Returns `null` until it has been measured in the browser. That third state
 * matters: the server cannot know the preference, so components render their
 * still frame until the first effect runs, which keeps hydration consistent.
 *
 * @returns {boolean|null}
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(null);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return reduced;
}
