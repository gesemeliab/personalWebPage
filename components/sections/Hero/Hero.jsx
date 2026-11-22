import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/Button/Button";
import { cx } from "@/lib/classNames";
import { getContent } from "@/lib/content";
import { HeroArt } from "./HeroArt";
import { TypingLine } from "./TypingLine";
import styles from "./Hero.module.css";

/** Opening section: name, research one-liner, the artwork and the evidence strip. */
export function Hero({ lang }) {
  const { site, availability, highlights, heroTyping, ui } = getContent(lang);
  const text = ui.hero;
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
          <p className={styles.eyebrow}>{text.hello}</p>
          <h1>
            Gesem
            <br />
            Mejia<span>.</span>
          </h1>
          <TypingLine {...heroTyping} />
          <p className={styles.heroDescription}>{text.description}</p>
          <p className={styles.affiliation}>
            {text.phd} <strong>RIT</strong> · KAS Lab
            <span>{text.previously}</span>
          </p>
          <Button href="#work">
            {text.explore} <ArrowDown size={18} />
          </Button>
        </div>

        <HeroArt fig={text.artFig} triad={text.artTriad} concept={text.artConcept} alt={text.artAlt} />
      </div>

      <dl className={styles.highlights}>
        {highlights.map(({ id, kicker, value, unit, label, source }) => (
          <div className={styles.highlight} key={id}>
            <span className={cx(styles.highlightKicker, "mono")}>{kicker}</span>
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
        <span className={cx("mono", styles.heroFootnote)}>{text.footnote}</span>
        <a className={cx(styles.scrollLink, "mono")} href="#about">
          {text.scroll} <ArrowDown size={14} />
        </a>
      </div>
    </section>
  );
}
