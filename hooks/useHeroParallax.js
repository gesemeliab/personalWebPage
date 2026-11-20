"use client";

import { useCallback, useRef } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/**
 * Tilts an element towards the pointer as it moves across its frame.
 *
 * The tilt is published as the `--rx` / `--ry` custom properties that the hero
 * stylesheet reads, so the animation itself stays in CSS. Skipped for touch
 * pointers, where there is no hover to follow, and when the visitor asked for
 * reduced motion.
 *
 * @returns refs for the frame and the artwork, plus the pointer handlers.
 */
export function useHeroParallax() {
  const frameRef = useRef(null);
  const artRef = useRef(null);
  const reduced = usePrefersReducedMotion();

  const setTilt = useCallback((rx, ry) => {
    const art = artRef.current;
    if (!art) return;
    art.style.setProperty("--rx", `${rx}deg`);
    art.style.setProperty("--ry", `${ry}deg`);
  }, []);

  const onPointerMove = useCallback(
    (event) => {
      const frame = frameRef.current;
      if (reduced || event.pointerType === "touch" || !frame) return;
      const rect = frame.getBoundingClientRect();
      setTilt(
        (event.clientY - rect.top - rect.height / 2) / 80,
        (event.clientX - rect.left - rect.width / 2) / 55,
      );
    },
    [reduced, setTilt],
  );

  const onPointerLeave = useCallback(() => setTilt(0, 0), [setTilt]);

  return { frameRef, artRef, onPointerMove, onPointerLeave };
}
