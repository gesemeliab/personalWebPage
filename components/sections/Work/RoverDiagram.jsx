"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/classNames";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PlaybackBar } from "./PlaybackBar";
import styles from "./Work.module.css";

/*
  A concept illustration of the strawberry rover, not data. It reads as one
  story:

  1. The rover drives beside a ridge. At the first strawberry it stops, and the
     panel on the right walks that one detection through the pipeline, one
     stage at a time: Lab a* channel, threshold, contour and box, CNN check,
     red-channel ripeness, stereo 3D position.
  2. The rover drives on, and the same pipeline runs on every strawberry it
     passes, without stopping.
  3. Below, a top-down map of the row is built as fruit is located. When the
     row is done the map zooms out to the whole field, coloured by ripeness,
     and the stretch that is ripening unevenly is flagged.

  Synthetic, deterministic geometry: server and client renders agree.
*/

const TICK_MS = 60;
const HOLD_MS = 4000;
const DRIVE = 18; // seconds of driving, end to end
const STEP_S = 1.6; // seconds per pipeline stage while stopped
const STAGES = [
  { id: "a", name: "Lab a* channel" },
  { id: "mask", name: "Threshold" },
  { id: "box", name: "Contour + box" },
  { id: "cnn", name: "CNN check" },
  { id: "ripe", name: "R-channel ripeness" },
  { id: "xyz", name: "Stereo → 3D" },
];
const STOP = STAGES.length * STEP_S;
const ZOOM = 2.6;
const FILL = 1.6;
const LEVELS = ["L1 · unripe", "L2 · turning", "L3 · ripe"];
const FRUIT_FILL = ["#c9dc8a", "#f2a54a", "#e5484d"];

function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let r = Math.imul(a ^ (a >>> 15), 1 | a);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ease = (u) => (u < 0.5 ? 4 * u ** 3 : 1 - (-2 * u + 2) ** 3 / 2);

// A stretch of the field ripens unevenly: mostly unripe fruit.
const ZONE = { from: 170, to: 240 };
const levelAt = (v, inZone) => (inZone ? (v < 0.85 ? 0 : 1) : v < 0.1 ? 0 : v < 0.35 ? 1 : 2);

// Field view (viewBox 0 0 320 128): flat furrow, ridge, plants, fruit.
const GROUND = 112;
const X0 = -30;
const X1 = 350;
const CAM = 4;
const PLANTS = Array.from({ length: 11 }, (_, i) => 22 + i * 28);
const seenAt = (x) => ((x - CAM - X0) / (X1 - X0)) * DRIVE;
const rand = mulberry32(9);
const FRUIT = PLANTS.flatMap((px, i) => {
  const n = 1 + Math.floor(rand() * 2.2);
  return Array.from({ length: n }, (_, k) => {
    const x = px - 9 + rand() * 18;
    const level = levelAt(rand(), x > ZONE.from && x < ZONE.to);
    return { id: `f${i}-${k}`, x, y: 58 + rand() * 20, level, t: seenAt(x) };
  });
});
const BY_TIME = [...FRUIT].sort((a, b) => a.t - b.t);
const FIRST = BY_TIME[0];
FIRST.level = 2; // the walkthrough follows a ripe one
const D_FIRST = FIRST.t;

// Timeline: drive to the first fruit, stop to explain it, drive on, zoom out.
const T_DRIVEN = DRIVE + STOP;
const T = T_DRIVEN + ZOOM + FILL;
const driveTime = (t) => Math.min(DRIVE, t < D_FIRST ? t : t < D_FIRST + STOP ? D_FIRST : t - STOP);
const roverX = (t) => X0 + (driveTime(t) / DRIVE) * (X1 - X0);
const mappedAt = (f) => (f === FIRST ? D_FIRST + (STAGES.length - 1) * STEP_S : f.t + STOP + 0.25);

// Field map, top-down (viewBox 0 0 320 92), in field units: x along the row,
// rows stacked PITCH apart. The rover drives the middle row.
const ROWS = 5;
const CUR = 2;
const PITCH = 20;
const HALF = 5.5;
const RX0 = 4;
const RX1 = 316;
const S_IN = 2.4;
const S_OUT = 0.96;
const SY = 78;
const CY = CUR * PITCH;
const lateral = (f) => ((f.y - 68) / 10) * 3.6;
const rand2 = mulberry32(21);
const OTHER = [0, 1, 3, 4].flatMap((j, order) => {
  const out = [];
  const edge = Math.abs(j - CUR) === 1 ? 8 : 999;
  for (let x = 8 + rand2() * 10; x < 312; x += 10 + rand2() * 13) {
    const inZone = x > ZONE.from + edge * 0.5 && x < ZONE.to - edge * 0.5;
    out.push({ id: `r${j}-${out.length}`, x, j, order, lat: (rand2() - 0.5) * 7.4, level: levelAt(rand2(), inZone) });
  }
  return out;
});
const FIELD_ZONE = { x0: ZONE.from - 6, x1: ZONE.to + 8, y0: (CUR - 1) * PITCH - 8, y1: (CUR + 1) * PITCH + 8 };
const TOTAL = FRUIT.length + OTHER.length;
const rowReveal = (order, t) => clamp((t - (T_DRIVEN + ZOOM * 0.35 + order * 0.45)) / 0.5, 0, 1);

/** The crop around one detection, as each stage of the pipeline sees it. */
function Inspector({ fruit, stage, summary = false }) {
  const id = summary ? "summary" : STAGES[stage].id;
  const berry = "M60 40 Q80 30 100 40 Q98 66 80 80 Q62 66 60 40Z";
  const peak = [0.28, 0.55, 0.82][fruit.level];

  if (id === "a") {
    return (
      <svg viewBox="0 0 160 96" className={styles.rvCrop} aria-hidden="true">
        <defs>
          <radialGradient id="rvA">
            <stop offset="0%" stopColor="#f2f2f2" stopOpacity={0.35 + 0.3 * fruit.level} />
            <stop offset="100%" stopColor="#f2f2f2" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="160" height="96" fill="#3a3a3a" />
        <ellipse cx="35" cy="22" rx="30" ry="16" fill="#1e1e1e" />
        <ellipse cx="125" cy="20" rx="32" ry="17" fill="#222" />
        <ellipse cx="80" cy="58" rx="34" ry="30" fill="url(#rvA)" />
      </svg>
    );
  }
  if (id === "mask") {
    return (
      <svg viewBox="0 0 160 96" className={styles.rvCrop} aria-hidden="true">
        <rect width="160" height="96" fill="#050505" />
        <path d={berry} fill="#f5f5f5" />
        <circle cx="132" cy="70" r="2" fill="#f5f5f5" />
        <circle cx="24" cy="78" r="1.5" fill="#f5f5f5" />
      </svg>
    );
  }
  if (id === "ripe") {
    return (
      <svg viewBox="0 0 160 96" className={styles.rvCrop} aria-hidden="true">
        <rect width="160" height="96" fill="#0b1f21" />
        {Array.from({ length: 32 }, (_, i) => {
          const u = i / 31;
          const v = Math.exp(-((u - peak) ** 2) / 0.012);
          return <rect key={i} x={10 + i * 4.4} y={80 - v * 62} width="3.6" height={v * 62} fill={`hsl(${90 - u * 90} 70% 55%)`} />;
        })}
        {[0.43, 0.68].map((u) => <line key={u} x1={10 + u * 140} x2={10 + u * 140} y1="12" y2="82" className={styles.rvThresh} />)}
        {["L1", "L2", "L3"].map((name, i) => (
          <text key={name} x={10 + [0.2, 0.555, 0.84][i] * 140} y="10" textAnchor="middle"
            className={cx(styles.rvCropText, i === fruit.level && styles.on)}>{name}</text>
        ))}
        <line x1="10" x2="150" y1="82" y2="82" stroke="#3d6266" />
        <text x="10" y="92" className={styles.rvCropText}>R-channel intensity →</text>
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 160 96" className={styles.rvCrop} aria-hidden="true">
      <rect width="160" height="96" fill="#5a4535" />
      <ellipse cx="35" cy="22" rx="30" ry="16" fill="#3f7a45" />
      <ellipse cx="125" cy="20" rx="32" ry="17" fill="#4d8e4f" />
      <ellipse cx="80" cy="12" rx="26" ry="12" fill="#3f7a45" />
      <line x1="80" y1="14" x2="80" y2="34" stroke="#4d8e4f" strokeWidth="2" />
      <path d={berry} fill={FRUIT_FILL[fruit.level]} />
      <rect x="54" y="28" width="52" height="58" rx="2" className={styles.rvCropBox} />
      {id === "cnn" ? <text x="54" y="24" className={styles.rvCropTag}>strawberry ✓</text> : null}
      {id === "summary" ? (
        <>
          <text x="54" y="24" className={styles.rvCropTag}>strawberry ✓</text>
          <text x="112" y="74" className={styles.rvCropTag}>{LEVELS[fruit.level]}</text>
        </>
      ) : null}
      {id === "xyz" || id === "summary" ? (
        <>
          <circle cx="80" cy="56" r="3" fill="#0b1f21" stroke="#c4f36b" strokeWidth="1.5" />
          <text x="112" y="58" className={styles.rvCropTag}>(x, y, z)</text>
        </>
      ) : null}
    </svg>
  );
}

function stageCaption(id, fruit) {
  switch (id) {
    case "a": return "Strawberries stand out in the a* channel of CIE-Lab.";
    case "mask": return "A threshold turns it into a binary mask: the region proposals.";
    case "box": return "Image operations clean the mask into a contour and a box.";
    case "cnn": return "A small MobileNetV2, sized for the Jetson, rejects false positives.";
    case "ripe": return `The red-channel histogram sets the ripeness level: ${LEVELS[fruit.level]}.`;
    default: return "Stereo depth places the fruit in 3D, and it joins the map below.";
  }
}

/** What the right-hand panel shows at time t. */
function panelState(t) {
  const d = driveTime(t);
  if (t < D_FIRST) return { mode: "wait" };
  if (t < D_FIRST + STOP) {
    return { mode: "explain", fruit: FIRST, stage: Math.min(STAGES.length - 1, Math.floor((t - D_FIRST) / STEP_S)) };
  }
  if (t < T_DRIVEN) {
    const seen = BY_TIME.filter((f) => f.t <= d);
    return { mode: "repeat", fruit: seen.at(-1), n: seen.length };
  }
  return { mode: "field" };
}

export function RoverDiagram({ label, note }) {
  const [t, setT] = useState(T);
  const [paused, setPaused] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.25 });
  const reduced = usePrefersReducedMotion();
  const playing = inView && reduced === false && !paused;

  useEffect(() => {
    if (!playing) return undefined;
    const timer = setTimeout(
      () => setT((c) => (c >= T ? 0 : Math.min(T, c + TICK_MS / 1000))),
      t >= T ? HOLD_MS : TICK_MS,
    );
    return () => clearTimeout(timer);
  }, [playing, t]);

  const d = driveTime(t);
  const rx = roverX(t);
  const camX = rx + CAM;
  const panel = panelState(t);
  const stopped = panel.mode === "explain";
  const done = t >= T - 0.2;

  // Map camera: close on the rover while it drives, then out to the field.
  const z = ease(clamp((t - T_DRIVEN) / ZOOM, 0, 1));
  const s = S_IN ** (1 - z) * S_OUT ** z;
  const cxIn = clamp(rx, RX0 + 160 / S_IN, RX1 - 160 / S_IN);
  const mx = cxIn + (160 - cxIn) * z;
  const P = (fx, fy) => [160 + (fx - mx) * s, SY + (fy - CY) * s];
  const r = 4 + (2.1 - 4) * z;

  const mapped = FRUIT.filter((f) => mappedAt(f) <= t);
  const shown = OTHER.filter((f) => rowReveal(f.order, t) >= 0.5);
  const counts = [0, 1, 2].map((l) => mapped.filter((f) => f.level === l).length + shown.filter((f) => f.level === l).length);

  const rowRect = (j) => {
    const [x0, y0] = P(RX0, j * PITCH - HALF);
    const [x1, y1] = P(RX1, j * PITCH + HALF);
    return { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
  };
  const cur = rowRect(CUR);
  const scanTo = P(clamp(rx + CAM, RX0, RX1), 0)[0];
  const [, pathY] = P(0, CY + PITCH / 2);
  const [roverMapX] = P(clamp(rx, RX0, RX1), 0);
  const [zx0, zy0] = P(FIELD_ZONE.x0, FIELD_ZONE.y0);
  const [zx1, zy1] = P(FIELD_ZONE.x1, FIELD_ZONE.y1);

  let header;
  let caption;
  if (panel.mode === "wait") {
    header = "WAITING FOR A DETECTION";
    caption = "Driving the row until a strawberry enters the camera’s view.";
  } else if (panel.mode === "explain") {
    header = "DETECTION #1 · STEP BY STEP";
    caption = stageCaption(STAGES[panel.stage].id, panel.fruit);
  } else if (panel.mode === "repeat") {
    header = "THE SAME PIPELINE · EVERY STRAWBERRY";
    caption = `Run on the fly on the rover’s Jetson AGX Xavier, without stopping: ${panel.n} of ${FRUIT.length} in this row.`;
  } else {
    header = "FIELD MAPPED";
    caption = "One pass per row. Every strawberry is placed on the map with its ripeness level.";
  }

  return (
    <div className={cx(styles.projectVisual, styles.roverVisual)} ref={ref}>
      <span className={cx(styles.visualLabel, "mono")}>{label}</span>
      <span className={cx(styles.wipBadge, "mono")}>CONCEPT ILLUSTRATION</span>

      <div className={styles.visualBody}>
        <div className={styles.rvTop}>
          <div className={styles.rvCol}>
            <figure className={cx(styles.rvPanel, styles.rvField)}>
              <figcaption className="mono">
                {stopped ? "IN THE FIELD · STOPPED AT A DETECTION" : "IN THE FIELD · ZED MINI ON THE ROVER"}
              </figcaption>
              <svg viewBox="0 0 320 128" className={styles.rvSvg} role="img"
                aria-label="A small rover with a stereo camera on a mast drives along the furrow beside a strawberry ridge, boxing each strawberry its camera sees.">
                <rect x="0" y="86" width="320" height="42" className={styles.rvFurrow} />
                <path d="M0 92 L0 58 Q10 50 24 50 L296 50 Q310 50 320 58 L320 92 Z" className={styles.rvRidge} />
                <path d="M0 58 Q10 50 24 50 L296 50 Q310 50 320 58" className={styles.rvMulch} />
                {PLANTS.map((px) => (
                  <g key={px} className={styles.rvPlant}>
                    <ellipse cx={px - 7} cy="46" rx="9" ry="6" />
                    <ellipse cx={px + 6} cy="44" rx="10" ry="7" />
                    <ellipse cx={px} cy="38" rx="8" ry="6" />
                  </g>
                ))}
                {FRUIT.map((f) => (
                  <g key={f.id}>
                    <line x1={f.x} y1="50" x2={f.x} y2={f.y - 3} className={styles.rvStem} />
                    <path d={`M${f.x - 3.4} ${f.y - 2.5} Q${f.x} ${f.y - 4.5} ${f.x + 3.4} ${f.y - 2.5} Q${f.x + 3} ${f.y + 3} ${f.x} ${f.y + 5} Q${f.x - 3} ${f.y + 3} ${f.x - 3.4} ${f.y - 2.5}Z`}
                      fill={FRUIT_FILL[f.level]} />
                  </g>
                ))}
                <rect x={camX - 17} y="32" width="34" height="58" rx="2" className={styles.rvFov} />
                {FRUIT.filter((f) => f.t <= d && d - f.t < 2.2 && !(stopped && f === FIRST)).map((f) => (
                  <rect key={`b${f.id}`} x={f.x - 6} y={f.y - 7} width="12" height="14" rx="1" className={styles.rvBox}
                    style={{ opacity: Math.max(0.25, 1 - (d - f.t) / 2.2) }} />
                ))}
                {stopped ? (
                  <>
                    <rect x={FIRST.x - 8} y={FIRST.y - 9} width="16" height="18" rx="1.5" className={styles.rvFocus} />
                    <text x={FIRST.x + 11} y={FIRST.y - 4} className={styles.rvFocusTag}>#1</text>
                  </>
                ) : null}
                <rect x="0" y={GROUND} width="320" height={128 - GROUND} className={styles.rvGround} />
                <g transform={`translate(${rx} ${GROUND})`}>
                  <rect x="-20" y="-15" width="40" height="10" rx="2" className={styles.rvBody} />
                  <rect x="-8" y="-19" width="14" height="4" rx="1" className={styles.rvJetson} />
                  <line x1={CAM} y1="-15" x2={CAM} y2="-52" className={styles.rvMast} />
                  <rect x={CAM - 7} y="-57" width="14" height="5" rx="1.5" className={styles.rvCam} />
                  <circle cx={CAM - 3.5} cy="-54.5" r="1.2" className={styles.rvLens} />
                  <circle cx={CAM + 3.5} cy="-54.5" r="1.2" className={styles.rvLens} />
                  {[-15, 15].map((wx) => <circle key={wx} cx={wx} cy="-3" r="5.5" className={styles.rvWheel} />)}
                </g>
              </svg>
            </figure>

            <figure className={cx(styles.rvPanel, styles.rvMap)}>
              <figcaption className="mono">
                {z < 0.5 ? "BUILDING THE MAP · THIS ROW, TOP-DOWN" : `FIELD MAP · ${ROWS} ROWS · RIPENESS BY POSITION`}
              </figcaption>
              <svg viewBox="0 0 320 140" className={styles.rvSvg} role="img"
                aria-label="A top-down map built as the rover drives: each located strawberry appears at its position, coloured by ripeness. The view then zooms out to the whole field, where a stretch ripening unevenly is flagged.">
                {Array.from({ length: ROWS }, (_, j) => (
                  <rect key={j} {...rowRect(j)} rx={1.5}
                    className={styles.rvMapRidge} style={j === CUR ? undefined : { opacity: 0.25 + 0.75 * z }} />
                ))}
                <rect x={cur.x} y={cur.y} width={Math.max(0, scanTo - cur.x)} height={cur.height}
                  className={styles.rvMapScan} style={{ opacity: 1 - z }} />
                <line x1={P(RX0, 0)[0]} x2={roverMapX} y1={pathY} y2={pathY} className={styles.rvPath} style={{ opacity: 1 - 0.6 * z }} />
                {OTHER.map((f) => {
                  const a = rowReveal(f.order, t);
                  if (a <= 0) return null;
                  const [x, y] = P(f.x, f.j * PITCH + f.lat);
                  return <circle key={f.id} cx={x} cy={y} r={r} fill={FRUIT_FILL[f.level]} style={{ opacity: a }} />;
                })}
                {mapped.map((f) => {
                  const [x, y] = P(f.x, CY + lateral(f));
                  return (
                    <circle key={`m${f.id}`} cx={x} cy={y} r={r} fill={FRUIT_FILL[f.level]}
                      className={styles.rvMapped} />
                  );
                })}
                {t < T_DRIVEN ? (
                  <path d={`M${roverMapX - 5} ${pathY + 9} L${roverMapX + 5} ${pathY + 9} L${roverMapX} ${pathY + 2} Z`} className={styles.rvMapRover} />
                ) : null}
                <g className={cx(styles.rvZone, done && styles.on)}>
                  <rect x={zx0} y={zy0} width={zx1 - zx0} height={zy1 - zy0} rx="3" />
                  <line x1={(zx0 + zx1) / 2} x2={(zx0 + zx1) / 2} y1="19" y2={zy0} />
                  <text x={(zx0 + zx1) / 2} y="14" textAnchor="middle">
                    <tspan className={styles.rvZoneText}>UNEVEN RIPENING</tspan>
                    <tspan className={styles.rvZoneSub}> · check irrigation, nutrients</tspan>
                  </text>
                </g>
              </svg>
            </figure>
          </div>

          <div className={styles.rvCol}>
            <figure className={cx(styles.rvPanel, styles.rvInspect)}>
              <figcaption className="mono">{header}</figcaption>
              {panel.mode === "explain" ? (
                <Inspector fruit={panel.fruit} stage={panel.stage} />
              ) : panel.mode === "repeat" ? (
                <Inspector key={panel.fruit.id} fruit={panel.fruit} summary />
              ) : panel.mode === "wait" ? (
                <svg viewBox="0 0 160 96" className={styles.rvCrop} aria-hidden="true">
                  <rect width="160" height="96" fill="#0b1f21" />
                  <text x="80" y="51" textAnchor="middle" className={styles.rvCropText}>NO DETECTION YET</text>
                </svg>
              ) : (
                <svg viewBox="0 0 160 96" className={styles.rvCrop} aria-hidden="true">
                  <rect width="160" height="96" fill="#0b1f21" />
                  <text x="14" y="20" className={styles.rvCropText}>{`${TOTAL} STRAWBERRIES · ${ROWS} ROWS`}</text>
                  {[2, 1, 0].map((l, i) => (
                    <g key={l}>
                      <rect x="14" y={32 + i * 20} width={(counts[l] / TOTAL) * 104} height="10" rx="1.5" fill={FRUIT_FILL[l]} />
                      <text x={20 + (counts[l] / TOTAL) * 104} y={40 + i * 20} className={styles.rvCropText}>
                        {`${LEVELS[l]} · ${Math.round((counts[l] / TOTAL) * 100)}%`}
                      </text>
                    </g>
                  ))}
                </svg>
              )}
              <ol className={cx(styles.rvSteps, "mono")}>
                {STAGES.map((s, i) => {
                  const isDone = panel.mode === "explain" ? i < panel.stage : panel.mode !== "wait";
                  const isOn = panel.mode === "explain" && i === panel.stage;
                  return <li key={s.id} className={cx(isDone && styles.done, isOn && styles.on)}>{s.name}</li>;
                })}
              </ol>
              <p className={styles.rvCaption}>{caption}</p>
            </figure>

            <div className={styles.rvFoot}>
              <ul className={cx(styles.rvLegend, "mono")} aria-live="off">
                {LEVELS.map((name, l) => (
                  <li key={name}><i style={{ background: FRUIT_FILL[l] }} />{`${name} · ${counts[l]}`}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <PlaybackBar
        note={note}
        paused={paused}
        disabled={reduced !== false}
        onToggle={() => setPaused((p) => !p)}
        onRestart={() => {
          setT(0);
          setPaused(false);
        }}
      />
    </div>
  );
}
