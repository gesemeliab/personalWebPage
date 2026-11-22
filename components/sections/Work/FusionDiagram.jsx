"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cx } from "@/lib/classNames";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import ladder from "@/data/figures/fusionLadder.json";
import { PlaybackBar } from "./PlaybackBar";
import styles from "./Work.module.css";

const LEVELS = ["Clear", "Light", "Moderate", "Heavy"];
const CONDITIONS = [
  { id: "dark", label: "Darkness", keys: ["clean", "dark_1", "dark_2", "dark_3"] },
  { id: "turbid", label: "Turbidity", keys: ["clean", "ifm_1C", "ifm_3C", "ifm_5C"] },
];
const ALL_KEYS = [...new Set(CONDITIONS.flatMap(({ keys }) => keys))];
const STEP_MS = 2200;
const IMG = "/images/work/sonar/ladder";
const [CAM_W, CAM_H] = ladder.cameraSize;
const [SON_W, SON_H] = ladder.sonarSize;

/** A box given in percent of its image, as an absolutely positioned overlay. */
const boxStyle = ([x0, y0, x1, y1]) => ({
  left: `${x0}%`,
  top: `${y0}%`,
  width: `${x1 - x0}%`,
  height: `${y1 - y0}%`,
});

/** One plain sentence for what the visitor is looking at. */
function story(level, condition, { foundByCamera: cam, foundBySonarOnly: son, sonarLinked }, total) {
  const echo = sonarLinked.length;
  if (son && !cam) {
    return {
      tone: "recovered",
      text: "The camera has lost the objects. The sonar still detects one, so the model recovers it and shows where in the image it most likely is.",
    };
  }
  if (son) {
    return {
      tone: "recovered",
      text: `The camera still finds ${cam} of ${total}; the sonar recovers ${son} the camera missed.`,
    };
  }
  if (cam) {
    return {
      tone: "camera",
      text: level === 0
        ? `Clear water: the camera finds ${cam === total ? "both" : cam} objects${echo ? `, and the sonar detects ${echo === cam ? "them" : `${echo} of them`} too` : ""}.`
        : `The water is getting ${condition === "dark" ? "darker" : "murkier"}, but the camera still finds ${cam === total ? "both" : cam} objects.`,
    };
  }
  return { tone: "lost", text: "Neither sensor finds the objects in this frame." };
}

/**
 * One underwater test frame, seen by the camera and the forward-looking sonar,
 * with the fusion model's own detections at every degradation level.
 *
 * The story it tells: as the camera degrades its detections disappear, and the
 * sonar, which the degradation does not touch, recovers the object. A sonar
 * fan gives bearing and range but no height, so the recovered object is shown
 * in the camera image as a likelihood zone, not a box. Until the visitor
 * touches the controls, and only while on screen with motion allowed, it steps
 * through the darkness levels by itself.
 *
 * Only detections of the annotated objects are drawn (the evaluation's other
 * camera boxes are not part of this story). Data:
 * scripts/figures/fusion_ladder.py (test frame, seed 0, 1.0 FPPI).
 */
export function FusionDiagram({ label, note }) {
  const [condition, setCondition] = useState("dark");
  const [level, setLevel] = useState(0);
  const [touched, setTouched] = useState(false);
  const [ref, inView] = useInView();
  const reduced = usePrefersReducedMotion();
  const autoplay = !touched && inView && reduced === false;

  useEffect(() => {
    if (!autoplay) return undefined;
    // Hold longest on the heavy level, where the point is made.
    const timer = setTimeout(() => setLevel((current) => (current + 1) % LEVELS.length),
      level === LEVELS.length - 1 ? STEP_MS * 1.8 : STEP_MS);
    return () => clearTimeout(timer);
  }, [autoplay, level]);

  const choose = (nextCondition, nextLevel) => {
    setTouched(true);
    setCondition(nextCondition);
    setLevel(nextLevel);
  };

  const { label: conditionName, keys } = CONDITIONS.find(({ id }) => id === condition);
  const key = keys[level];
  const shown = ladder.levels[key];
  const cameraBoxes = shown.camera.filter((_, i) => !shown.cameraIsFp[i]);
  const state = level === 0 ? "clear water" : `${LEVELS[level].toLowerCase()} ${conditionName.toLowerCase()}`;
  const total = ladder.linkedObjects;
  const found = shown.foundByCamera + shown.foundBySonarOnly;
  const { tone, text } = story(level, condition, shown, total);

  return (
    <div className={cx(styles.projectVisual, styles.fusionVisual)} ref={ref}>
      <span className={cx(styles.visualLabel, "mono")}>{label}</span>
      <span className={cx(styles.wipBadge, styles.dataBadge, "mono")}>REAL TEST FRAME</span>

      <div className={styles.visualBody}>
        <div className={styles.sensorStage}>
          <figure className={styles.cameraPane}>
            <div className={styles.cameraFrame}>
              {ALL_KEYS.map((k) => (
                <Image
                  key={k}
                  className={cx(styles.cameraImage, k === key && styles.shown)}
                  src={`${IMG}/${k}.webp`}
                  alt={k === key ? `Underwater camera frame, ${state}, with the model's detections` : ""}
                  aria-hidden={k === key ? undefined : true}
                  width={CAM_W}
                  height={CAM_H}
                  sizes="(max-width: 1000px) 60vw, 420px"
                />
              ))}
              {ALL_KEYS.filter((k) => ladder.levels[k].zonePeak).map((k) => (
                <Image
                  key={`${k}-zone`}
                  className={cx(styles.cameraImage, k === key && styles.shown)}
                  src={`${IMG}/${k}-zone.webp`}
                  alt=""
                  aria-hidden="true"
                  width={CAM_W}
                  height={CAM_H}
                  sizes="(max-width: 1000px) 60vw, 420px"
                />
              ))}
              {cameraBoxes.map((box, i) => (
                <span key={`${key}-c${i}`} className={cx(styles.detBox, styles.detCam)} style={boxStyle(box)} aria-hidden="true">
                  <em className="mono">CAMERA</em>
                </span>
              ))}
              {shown.zonePeak ? (
                <span
                  className={cx(styles.zoneTag, "mono")}
                  style={{ left: `${shown.zonePeak[0]}%`, top: `${shown.zonePeak[1]}%` }}
                  aria-hidden="true"
                >
                  FROM SONAR
                </span>
              ) : null}
            </div>
            <figcaption className="mono">
              <span>CAMERA</span>
              <span className={styles.paneState}>{state.toUpperCase()}</span>
            </figcaption>
          </figure>

          <figure className={styles.sonarPane}>
            <div className={styles.sonarFrame}>
              <Image
                className={styles.sonarImage}
                src={`${IMG}/sonar.webp`}
                alt="Forward-looking sonar fan at the same instant, with the model's sonar detections"
                width={SON_W}
                height={SON_H}
                sizes="(max-width: 1000px) 40vw, 300px"
              />
              {shown.sonarLinked.map((box, i) => (
                <span key={`${key}-sl${i}`} className={cx(styles.detBox, styles.detMatch)} style={boxStyle(box)} aria-hidden="true">
                  <em className="mono">ALSO SEEN BY CAMERA</em>
                </span>
              ))}
              {shown.sonarOnly.map((box, i) => (
                <span key={`${key}-so${i}`} className={cx(styles.detBox, styles.detSonar)} style={boxStyle(box)} aria-hidden="true">
                  <em className="mono">RECOVERED</em>
                </span>
              ))}
            </div>
            <figcaption className="mono">
              <span>FL SONAR</span>
              <span className={styles.paneState}>UNAFFECTED</span>
            </figcaption>
          </figure>
        </div>

        <div className={styles.fusionStory} aria-live={touched ? "polite" : "off"}>
          <dl className="mono">
            <div>
              <dt>OBJECTS FOUND</dt>
              <dd className={found ? styles.good : undefined}>{`${found} / ${total}`}</dd>
            </div>
            <div>
              <dt>BY CAMERA</dt>
              <dd>{shown.foundByCamera}</dd>
            </div>
            <div>
              <dt>RECOVERED BY SONAR</dt>
              <dd className={shown.foundBySonarOnly ? styles.sonar : undefined}>{shown.foundBySonarOnly}</dd>
            </div>
          </dl>
          <p className={cx(styles.storyText, styles[tone])}>{text}</p>
        </div>

        <div className={styles.sensorControls}>
          <div className={styles.segmented} role="group" aria-label="Degradation type">
            {CONDITIONS.map(({ id, label: name }) => (
              <button
                key={id}
                type="button"
                className="mono"
                aria-pressed={condition === id}
                onClick={() => choose(id, level === 0 ? LEVELS.length - 1 : level)}
              >
                {name}
              </button>
            ))}
          </div>
          <div className={styles.segmented} role="group" aria-label="Degradation level">
            {LEVELS.map((name, lv) => (
              <button
                key={name}
                type="button"
                className="mono"
                aria-pressed={level === lv}
                onClick={() => choose(condition, lv)}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        <ul className={cx(styles.detLegend, "mono")} aria-hidden="true">
          <li><i className={styles.lgCam} />Detected by the camera</li>
          <li><i className={styles.lgSonar} />Recovered by sonar when the camera misses it</li>
          <li><i className={styles.lgZone} />Where the sonar says it likely is (sonar has no height, so it’s a zone, not a box)</li>
        </ul>
      </div>

      <PlaybackBar note={note} />
    </div>
  );
}
