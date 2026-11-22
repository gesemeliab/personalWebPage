"use client";

import Image from "next/image";
import { cx } from "@/lib/classNames";
import { useHeroParallax } from "@/hooks/useHeroParallax";
import styles from "./Hero.module.css";

/** Hero artwork; tilts towards the pointer unless motion is paused. */
export function HeroArt({ fig, triad, concept, alt }) {
  const { frameRef, artRef, onPointerMove, onPointerLeave } = useHeroParallax();

  return (
    <div
      className={styles.heroArt}
      aria-label={alt}
      ref={frameRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className={cx(styles.artCoordinates, "mono")}>
        <span>{fig}</span>
      </div>
      <Image
        className={styles.robotArt}
        ref={artRef}
        src="/images/hero-trajectories.png"
        alt={alt}
        width={1672}
        height={941}
        priority
        fetchPriority="high"
      />
      <div className={cx(styles.artFooter, "mono")}>
        <span>{triad}</span>
        <span>{concept}</span>
      </div>
    </div>
  );
}
