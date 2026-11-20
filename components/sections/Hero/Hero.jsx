import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { cx } from "@/lib/classNames";
import { site } from "@/data/site";
import { HeroArt } from "./HeroArt";
import { TypingLine } from "./TypingLine";
import styles from "./Hero.module.css";

/** Opening section: name, research one-liner and the hero artwork. */
export function Hero() {
  return (
    <section className={styles.hero} id="home">
      <div className={cx(styles.heroTop, "mono")}>
        <span>{site.disciplines}</span>
        <span>{site.coordinates}</span>
      </div>

      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>Hello, I’m</p>
          <h1>
            Gesem
            <br />
            Mejia<span>.</span>
          </h1>
          <TypingLine />
          <p className={styles.heroDescription}>
            Building intelligence that can
            <br />
            understand, adapt, and act in the real world.
          </p>
          <p className={styles.affiliation}>
            Ph.D. student at <strong>RIT</strong>
            <span>Previously at Intel Labs</span>
          </p>
          <Button href="#work">
            Explore my work <ArrowDown size={18} />
          </Button>
        </div>

        <HeroArt />
      </div>

      <div className={styles.heroBottom}>
        <span className={cx("mono", styles.heroFootnote)}>
          FROM PREDICTIVE MODELS TO PHYSICAL ROBOTS
        </span>
        <a className={cx(styles.scrollLink, "mono")} href="#about">
          SCROLL TO EXPLORE <ArrowDown size={14} />
        </a>
      </div>
    </section>
  );
}
