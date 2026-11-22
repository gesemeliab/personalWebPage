import styles from "./Toolbox.module.css";

/** Skills grouped by area, closing the experience section. */
export function Toolbox({ skills, title }) {
  return (
    <div className={styles.toolbox}>
      <h3 className="mono">{title}</h3>
      <dl className={styles.skillGrid}>
        {skills.map(({ id, group, items }) => (
          <div className={styles.skillGroup} key={id}>
            <dt>{group}</dt>
            <dd>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
