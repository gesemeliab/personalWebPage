import { Pause, Play, RotateCcw } from "lucide-react";
import { ui } from "@/data/ui";
import styles from "./Work.module.css";

/**
 * The bottom bar shared by every project visual: restart and play/pause on
 * the left (animated visuals only), the provenance note on the right.
 *
 * @param {object} props
 * @param {string} props.note - where the figure comes from.
 * @param {boolean} [props.paused]
 * @param {boolean} [props.disabled] - true while motion is not allowed.
 * @param {() => void} [props.onToggle] - omit for a visual with no playback.
 * @param {() => void} [props.onRestart]
 * @param {"en"|"es"} [props.lang]
 */
export function PlaybackBar({ note, paused = false, disabled = false, onToggle, onRestart, lang = "en" }) {
  const text = ui[lang].playback;
  return (
    <div className={styles.animBar}>
      {onToggle ? (
        <div className={styles.animControls}>
          <button type="button" className={styles.replayToggle} onClick={onRestart}
            aria-label={text.restart} disabled={disabled}>
            <RotateCcw size={14} />
          </button>
          <button type="button" className={styles.replayToggle} onClick={onToggle}
            aria-label={paused ? text.play : text.pause} disabled={disabled}>
            {paused || disabled ? <Play size={14} /> : <Pause size={14} />}
          </button>
        </div>
      ) : null}
      <span className={styles.visualNote}>{note}</span>
    </div>
  );
}
