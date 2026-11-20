import { Fragment } from "react";
import { toolbox } from "@/data/experience";
import styles from "./Toolbox.module.css";

/** Slash-separated list of tools that closes the experience section. */
export function Toolbox() {
  return (
    <div className={styles.toolbox}>
      <span className="mono">IN MY TOOLBOX</span>
      <p>
        {toolbox.map((tool, index) => (
          <Fragment key={tool}>
            {index > 0 ? <> <i>/</i> </> : null}
            {tool}
          </Fragment>
        ))}
      </p>
    </div>
  );
}
