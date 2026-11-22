"use client";

import { useEffect, useState } from "react";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import styles from "./Hero.module.css";

const ERASE_MS = 42; // per character, while erasing
const TYPE_MS = 75; // per character, while typing
const HOLD_MS = 2300; // pause on a complete phrase, and before the first erase
const GAP_MS = 300; // pause on an empty line before the next phrase

/**
 * The line itself.
 *
 * Screen readers are given the whole sentence rather than the animation, since
 * announcing a line character by character would be unusable.
 */
function Line({ text, prompt, sentence }) {
  return (
    <div className={styles.terminal}>
      <span aria-hidden="true">
        {prompt}
        <span className={styles.typed}>{text}</span>
        <span className={styles.caret}>_</span>
      </span>
      <span className="sr-only">{sentence}</span>
    </div>
  );
}

/** Types each phrase, erases it, and moves to the next, forever. */
function AnimatedLine({ prompt, phrases, sentence }) {
  const [text, setText] = useState(phrases[0]);

  useEffect(() => {
    let index = 0;
    let length = phrases[0].length;
    let erasing = true;
    let timer;

    const tick = () => {
      if (erasing) {
        length -= 1;
        setText(phrases[index].slice(0, length));
        if (length === 0) {
          erasing = false;
          index = (index + 1) % phrases.length;
        }
        timer = setTimeout(tick, erasing ? ERASE_MS : GAP_MS);
      } else {
        length += 1;
        setText(phrases[index].slice(0, length));
        if (length === phrases[index].length) {
          erasing = true;
          timer = setTimeout(tick, HOLD_MS);
        } else {
          timer = setTimeout(tick, TYPE_MS);
        }
      }
    };

    timer = setTimeout(tick, HOLD_MS);
    return () => clearTimeout(timer);
  }, [phrases]);

  return <Line text={text} prompt={prompt} sentence={sentence} />;
}

/**
 * The hero's research line.
 *
 * Shows the first phrase complete until the browser has confirmed motion is
 * welcome - which is also what the server renders, so the line always reads as
 * a finished sentence with or without JavaScript. Swapping between the two
 * remounts the animation rather than resetting it from an effect.
 */
export function TypingLine({ prompt, phrases, sentence }) {
  const reduced = usePrefersReducedMotion();
  return reduced === false ? (
    <AnimatedLine prompt={prompt} phrases={phrases} sentence={sentence} />
  ) : (
    <Line text={phrases[0]} prompt={prompt} sentence={sentence} />
  );
}
