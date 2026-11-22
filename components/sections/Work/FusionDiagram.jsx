"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cx } from "@/lib/classNames";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import ladder from "@/data/figures/fusionLadder.json";
import { PlaybackBar } from "./PlaybackBar";
import styles from "./Work.module.css";

const LEVEL_COUNT = 4;
const CONDITIONS = [
  { id: "dark", keys: ["clean", "dark_1", "dark_2", "dark_3"] },
  { id: "turbid", keys: ["clean", "ifm_1C", "ifm_3C", "ifm_5C"] },
];

/** Every string the viewer shows, per language. */
const TEXT = {
  en: {
    levels: ["Clear", "Light", "Moderate", "Heavy"],
    conditions: { dark: "Darkness", turbid: "Turbidity" },
    state: (level, condition) => `${level} ${condition}`.toLowerCase(),
    clearWater: "clear water",
    badge: "REAL TEST FRAME",
    camera: "CAMERA",
    fromSonar: "{tx.fromSonar}",
    alsoCamera: "ALSO SEEN BY CAMERA",
    recovered: "RECOVERED",
    sonar: "FL SONAR",
    unaffected: "UNAFFECTED",
    found: "OBJECTS FOUND",
    byCamera: "BY CAMERA",
    bySonar: "RECOVERED BY SONAR",
    typeLabel: "Degradation type",
    levelLabel: "Degradation level",
    cameraAlt: (state) => `Underwater camera frame, ${state}, with the model's detections`,
    sonarAlt: "Forward-looking sonar fan at the same instant, with the model's sonar detections",
    legend: [
      "Detected by the camera",
      "Recovered by sonar when the camera misses it",
      "Where the sonar says it likely is (sonar has no height, so it’s a zone, not a box)",
    ],
    story: {
      lostRecovered:
        "The camera has lost the objects. The sonar still detects one, so the model recovers it and shows where in the image it most likely is.",
      partial: (cam, total, son) => `The camera still finds ${cam} of ${total}; the sonar recovers ${son} the camera missed.`,
      clear: (count, echo, all) =>
        `Clear water: the camera finds ${count} objects${echo ? `, and the sonar detects ${all ? "them" : `${echo} of them`} too` : ""}.`,
      degraded: (condition, count) =>
        `The water is getting ${condition === "dark" ? "darker" : "murkier"}, but the camera still finds ${count} objects.`,
      both: "both",
      lost: "Neither sensor finds the objects in this frame.",
    },
  },
  es: {
    levels: ["Ninguna", "Leve", "Moderada", "Intensa"],
    conditions: { dark: "Oscuridad", turbid: "Turbidez" },
    state: (level, condition) => `${condition} ${level}`.toLowerCase(),
    clearWater: "agua clara",
    badge: "FOTOGRAMA DE PRUEBA REAL",
    camera: "CÁMARA",
    fromSonar: "DEL SONAR",
    alsoCamera: "TAMBIÉN EN LA CÁMARA",
    recovered: "RECUPERADO",
    sonar: "SONAR FLS",
    unaffected: "NO AFECTADO",
    found: "OBJETOS DETECTADOS",
    byCamera: "POR LA CÁMARA",
    bySonar: "RECUPERADOS POR EL SONAR",
    typeLabel: "Tipo de degradación",
    levelLabel: "Nivel de degradación",
    cameraAlt: (state) => `Fotograma de la cámara submarina, ${state}, con las detecciones del modelo`,
    sonarAlt: "Abanico del sonar de visión frontal en el mismo instante, con las detecciones del modelo",
    legend: [
      "Detectado por la cámara",
      "Recuperado por el sonar cuando la cámara no lo detecta",
      "Ubicación probable según el sonar (el sonar no mide elevación, por eso se indica una zona y no un recuadro)",
    ],
    story: {
      lostRecovered:
        "La cámara ya no detecta los objetos. El sonar todavía detecta uno, de modo que el modelo lo recupera y señala dónde es más probable que esté en la imagen.",
      partial: (cam, total, son) => `La cámara aún detecta ${cam} de ${total}; el sonar recupera ${son} que la cámara no detectó.`,
      clear: (count, echo, all) =>
        `Agua clara: la cámara detecta ${count} objetos${echo ? `, y el sonar ${all ? "también los detecta" : `también detecta ${echo}`}` : ""}.`,
      degraded: (condition, count) =>
        `El agua se vuelve más ${condition === "dark" ? "oscura" : "turbia"}, pero la cámara aún detecta ${count} objetos.`,
      both: "ambos",
      lost: "Ningún sensor detecta los objetos en este fotograma.",
    },
  },
};
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
function story(level, condition, { foundByCamera: cam, foundBySonarOnly: son, sonarLinked }, total, text) {
  const echo = sonarLinked.length;
  const count = cam === total ? text.both : cam;
  if (son && !cam) return { tone: "recovered", text: text.lostRecovered };
  if (son) return { tone: "recovered", text: text.partial(cam, total, son) };
  if (cam) {
    return {
      tone: "camera",
      text: level === 0 ? text.clear(count, echo, echo === cam) : text.degraded(condition, count),
    };
  }
  return { tone: "lost", text: text.lost };
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
export function FusionDiagram({ label, note, lang = "en" }) {
  const tx = TEXT[lang];
  const [condition, setCondition] = useState("dark");
  const [level, setLevel] = useState(0);
  const [touched, setTouched] = useState(false);
  const [ref, inView] = useInView();
  const reduced = usePrefersReducedMotion();
  const autoplay = !touched && inView && reduced === false;

  useEffect(() => {
    if (!autoplay) return undefined;
    // Hold longest on the heavy level, where the point is made.
    const timer = setTimeout(() => setLevel((current) => (current + 1) % LEVEL_COUNT),
      level === LEVEL_COUNT - 1 ? STEP_MS * 1.8 : STEP_MS);
    return () => clearTimeout(timer);
  }, [autoplay, level]);

  const choose = (nextCondition, nextLevel) => {
    setTouched(true);
    setCondition(nextCondition);
    setLevel(nextLevel);
  };

  const { keys } = CONDITIONS.find(({ id }) => id === condition);
  const key = keys[level];
  const shown = ladder.levels[key];
  const cameraBoxes = shown.camera.filter((_, i) => !shown.cameraIsFp[i]);
  const state = level === 0 ? tx.clearWater : tx.state(tx.levels[level], tx.conditions[condition]);
  const total = ladder.linkedObjects;
  const found = shown.foundByCamera + shown.foundBySonarOnly;
  const { tone, text } = story(level, condition, shown, total, tx.story);

  return (
    <div className={cx(styles.projectVisual, styles.fusionVisual)} ref={ref}>
      <span className={cx(styles.visualLabel, "mono")}>{label}</span>
      <span className={cx(styles.wipBadge, styles.dataBadge, "mono")}>{tx.badge}</span>

      <div className={styles.visualBody}>
        <div className={styles.sensorStage}>
          <figure className={styles.cameraPane}>
            <div className={styles.cameraFrame}>
              {ALL_KEYS.map((k) => (
                <Image
                  key={k}
                  className={cx(styles.cameraImage, k === key && styles.shown)}
                  src={`${IMG}/${k}.webp`}
                  alt={k === key ? tx.cameraAlt(state) : ""}
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
                  <em className="mono">{tx.camera}</em>
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
              <span>{tx.camera}</span>
              <span className={styles.paneState}>{state.toUpperCase()}</span>
            </figcaption>
          </figure>

          <figure className={styles.sonarPane}>
            <div className={styles.sonarFrame}>
              <Image
                className={styles.sonarImage}
                src={`${IMG}/sonar.webp`}
                alt={tx.sonarAlt}
                width={SON_W}
                height={SON_H}
                sizes="(max-width: 1000px) 40vw, 300px"
              />
              {shown.sonarLinked.map((box, i) => (
                <span key={`${key}-sl${i}`} className={cx(styles.detBox, styles.detMatch)} style={boxStyle(box)} aria-hidden="true">
                  <em className="mono">{tx.alsoCamera}</em>
                </span>
              ))}
              {shown.sonarOnly.map((box, i) => (
                <span key={`${key}-so${i}`} className={cx(styles.detBox, styles.detSonar)} style={boxStyle(box)} aria-hidden="true">
                  <em className="mono">{tx.recovered}</em>
                </span>
              ))}
            </div>
            <figcaption className="mono">
              <span>{tx.sonar}</span>
              <span className={styles.paneState}>{tx.unaffected}</span>
            </figcaption>
          </figure>
        </div>

        <div className={styles.fusionStory} aria-live={touched ? "polite" : "off"}>
          <dl className="mono">
            <div>
              <dt>{tx.found}</dt>
              <dd className={found ? styles.good : undefined}>{`${found} / ${total}`}</dd>
            </div>
            <div>
              <dt>{tx.byCamera}</dt>
              <dd>{shown.foundByCamera}</dd>
            </div>
            <div>
              <dt>{tx.bySonar}</dt>
              <dd className={shown.foundBySonarOnly ? styles.sonar : undefined}>{shown.foundBySonarOnly}</dd>
            </div>
          </dl>
          <p className={cx(styles.storyText, styles[tone])}>{text}</p>
        </div>

        <div className={styles.sensorControls}>
          <div className={styles.segmented} role="group" aria-label={tx.typeLabel}>
            {CONDITIONS.map(({ id }) => (
              <button
                key={id}
                type="button"
                className="mono"
                aria-pressed={condition === id}
                onClick={() => choose(id, level === 0 ? LEVEL_COUNT - 1 : level)}
              >
              {tx.conditions[id]}
            </button>
          ))}
        </div>
        <div className={styles.segmented} role="group" aria-label={tx.levelLabel}>
          {tx.levels.map((name, lv) => (
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
          <li><i className={styles.lgCam} />{tx.legend[0]}</li>
          <li><i className={styles.lgSonar} />{tx.legend[1]}</li>
          <li><i className={styles.lgZone} />{tx.legend[2]}</li>
        </ul>
      </div>

      <PlaybackBar note={note} lang={lang} />
    </div>
  );
}
