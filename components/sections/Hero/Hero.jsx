import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { cx } from "@/lib/classNames";
import { availability, highlights, site } from "@/data/site";
import { HeroArt } from "./HeroArt";
import { TypingLine } from "./TypingLine";
import styles from "./Hero.module.css";

/** Opening section: name, research one-liner, the artwork and the evidence strip. */
export function Hero() {
  return (
    <section className={styles.hero} id="home">
      <div className={cx(styles.heroTop, "mono")}>
        <span>{site.disciplines}</span>
        <span>{site.coordinates}</span>
      </div>

      <div className={styles.heroGrid}>
        <div className={styles.heroCopy}>
          <a className={cx(styles.status, "mono")} href="#contact">
            <span className={styles.statusDot} aria-hidden="true" />
            {availability.short}
          </a>
          <p className={styles.eyebrow}>Hello, I’m</p>
          <h1>
            Gesem
            <br />
            Mejia<span>.</span>
          </h1>
          <TypingLine />
          <p className={styles.heroDescription}>
            I build robot perception for decision-making: turning RGB, depth, sonar and audio
            into representations robots can plan and act on.
          </p>
          <p className={styles.affiliation}>
            Ph.D. student at <strong>RIT</strong> · KAS Lab
            <span>Previously 4.5 years at Intel Labs</span>
          </p>
          <Button href="#work">
            Explore my work <ArrowDown size={18} />
          </Button>
        </div>

        <HeroArt />
      </div>

      <dl className={styles.highlights}>
        {highlights.map(({ id, value, unit, label, source }) => (
          <div className={styles.highlight} key={id}>
            <dt>
              <span className={styles.highlightValue}>{value}</span>
              <span className={cx(styles.highlightUnit, "mono")}>{unit}</span>
            </dt>
            <dd>
              {label}
              <span className="mono">{source}</span>
            </dd>
          </div>
        ))}
      </dl>

      <div className={styles.heroBottom}>
        <span className={cx("mono", styles.heroFootnote)}>FROM SENSORS TO DECISIONS</span>
        <a className={cx(styles.scrollLink, "mono")} href="#about">
          SCROLL TO EXPLORE <ArrowDown size={14} />
        </a>
      </div>
    </section>
  );
}
