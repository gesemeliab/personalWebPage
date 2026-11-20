"use client";

import Image from "next/image";
import { cx } from "@/lib/classNames";
import { useHeroParallax } from "@/hooks/useHeroParallax";
import styles from "./Hero.module.css";

const ALT =
  "Conceptual visualisation of robot planning: a committed trajectory and alternative "
  + "candidate paths threading between clusters of occupied voxels";

/** Hero artwork; tilts towards the pointer unless motion is paused. */
export function HeroArt() {
  const { frameRef, artRef, onPointerMove, onPointerLeave } = useHeroParallax();

  return (
    <div
      className={styles.heroArt}
      aria-label={ALT}
      ref={frameRef}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <div className={cx(styles.artCoordinates, "mono")}>
        <span>FIG. 001</span>
        <span>PERCEPTION → PLANNING</span>
      </div>
      <Image
        className={styles.robotArt}
        ref={artRef}
        src="/images/hero-trajectories.png"
        alt={ALT}
        width={1672}
        height={941}
        priority
        fetchPriority="high"
      />
      <div className={cx(styles.artFooter, "mono")}>
        <span>PERCEIVE / PREDICT / ACT</span>
        <span>CONCEPT STUDY</span>
      </div>
    </div>
  );
}
