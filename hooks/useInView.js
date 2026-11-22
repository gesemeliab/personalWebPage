"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Whether an element is on screen, so animations can pause when it is not.
 *
 * @param {IntersectionObserverInit} [options]
 * @returns {[import("react").RefObject<Element>, boolean]}
 */
export function useInView(options = { threshold: 0.25 }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return undefined;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), options);
    observer.observe(node);
    return () => observer.disconnect();
    // The options object is configuration, read once on mount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return [ref, inView];
}
