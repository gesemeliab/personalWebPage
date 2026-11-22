"use client";

import { useEffect, useMemo, useState } from "react";
import { cx } from "@/lib/classNames";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import trial from "@/data/figures/planarTrial.json";
import { PlaybackBar } from "./PlaybackBar";
import styles from "./Work.module.css";

const SPEED = 3; // replay at 3x real time
const PAD = 1.2; // metres of margin around the data

const frames = trial.robot.length;
const all = [trial.robot, ...trial.obstacles, trial.waypoints].flat();

// A top-down view has no preferred "north", so the scene is rotated to lie as
// flat (landscape) as possible: the card stays short instead of growing with a
// tall route. Rotation preserves every distance, so nothing about the run changes.
const rotate = (theta) => ([x, y]) => [x * Math.cos(theta) - y * Math.sin(theta), x * Math.sin(theta) + y * Math.cos(theta)];
const extent = (pts) => {
  const xs = pts.map((p) => p[0]);
  const ys = pts.map((p) => p[1]);
  return [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
};
const THETA = Array.from({ length: 36 }, (_, i) => (i * Math.PI) / 36).reduce((best, theta) => {
  const [x0, x1, y0, y1] = extent(all.map(rotate(theta)));
  const ratio = (y1 - y0) / (x1 - x0);
  return ratio < best.ratio ? { theta, ratio } : best;
}, { theta: 0, ratio: Infinity }).theta;
const rot = rotate(THETA);
const [minX0, maxX0, minY0, maxY0] = extent(all.map(rot));
const minX = minX0 - PAD;
const maxX = maxX0 + PAD;
const minY = minY0 - PAD;
const maxY = maxY0 + PAD;
const W = maxX - minX;
const H = maxY - minY;
// World y points up; SVG y points down.
const sx = (x) => x - minX;
const sy = (y) => maxY - y;
const R = trial.robot.map(rot);
const OBS = trial.obstacles.map((track) => track.map(rot));
const WPS = trial.waypoints.map(rot);
const pathOf = (points) => points.map(([x, y], i) => `${i ? "L" : "M"}${sx(x).toFixed(2)} ${sy(y).toFixed(2)}`).join("");
const route = pathOf([R[0], ...WPS]);

/** The robot's path split into runs where the CBF safety filter was on or off. */
function segments(upTo) {
  const runs = [];
  for (let i = 1; i <= upTo; i += 1) {
    const active = trial.qpActive[i] === 1;
    const last = runs.at(-1);
    if (last && last.active === active) last.points.push(R[i]);
    else runs.push({ active, points: [R[i - 1], R[i]] });
  }
  return runs;
}

// Margin sparkline: h(t), the smallest CBF value over all obstacles at each step.
const SPARK_W = 100;
const SPARK_H = 16;
const hMax = Math.max(...trial.minH);
const sparkX = (i) => (i / (frames - 1)) * SPARK_W;
const sparkY = (h) => SPARK_H - (h / hMax) * (SPARK_H - 1.5);
const sparkPath = trial.minH.map((h, i) => `${i ? "L" : "M"}${sparkX(i).toFixed(2)} ${sparkY(h).toFixed(2)}`).join("");
const activeBands = (() => {
  const bands = [];
  trial.qpActive.forEach((on, i) => {
    if (!on) return;
    const last = bands.at(-1);
    if (last && last.end === i - 1) last.end = i;
    else bands.push({ start: i, end: i });
  });
  return bands;
})();

/**
 * Top-down replay of one planar simulation run: the AUV visiting waypoints
 * among obstacles that bounce across its route, with the CBF safety filter
 * switching on as they close in.
 *
 * The scene is planar on purpose (scripts/figures/planar_trial.py): robot,
 * waypoints and obstacle motion all at one depth, so what the top-down view
 * shows is the whole geometry and an overlap on screen would be a real contact.
 */
export function TrialReplay({ label, note }) {
  const [frame, setFrame] = useState(frames - 1);
  const [paused, setPaused] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.2 });
  const reduced = usePrefersReducedMotion();
  const playing = inView && reduced === false && !paused;

  useEffect(() => {
    if (!playing) return undefined;
    const stepMs = (trial.dt * 1000) / SPEED;
    const timer = setInterval(() => setFrame((current) => (current + 1) % frames), stepMs);
    return () => clearInterval(timer);
  }, [playing]);

  const runs = useMemo(() => segments(frame), [frame]);
  const robot = R[frame];
  const active = trial.qpActive[frame] === 1;
  const t = (frame * trial.dt).toFixed(1);

  return (
    <div className={cx(styles.projectVisual, styles.replayVisual)} ref={ref}>
      <span className={cx(styles.visualLabel, "mono")}>{label}</span>
      <span className={cx(styles.wipBadge, styles.dataBadge, "mono")}>SIMULATION RUN</span>

      <div className={styles.visualBody}>
        <div className={cx(styles.replayHud, "mono")} aria-live="off">
          <span>{`t = ${t} s`}</span>
          <span>{`nearest ${trial.nearest[frame].toFixed(2)} m · contact at ${trial.safetyDistance} m`}</span>
          <span className={cx(styles.replayMode, active && styles.on)}>{active ? "CBF FILTER ACTIVE" : "NOMINAL MPC"}</span>
        </div>

        <svg
          className={styles.replaySvg}
          viewBox={`0 0 ${W.toFixed(2)} ${H.toFixed(2)}`}
          role="img"
          aria-label={`Top-down replay of a planar simulation run: the AUV visits ${trial.waypoints.length} waypoints among ${trial.obstacles.length} moving obstacles. Closest approach ${trial.summary.closestApproach} m, against contact at ${trial.safetyDistance} m.`}
        >
          <defs>
            <pattern id="replayGrid" width="1" height="1" patternUnits="userSpaceOnUse">
              <path d="M 1 0 L 0 0 0 1" fill="none" stroke="#21474a" strokeWidth=".025" />
            </pattern>
          </defs>
          <rect width={W} height={H} fill="url(#replayGrid)" />

          {OBS.map((track, i) => (
            <path key={`trail-${i}`} d={pathOf(track.slice(Math.max(0, frame - 25), frame + 1))} className={styles.obstacleTrail} />
          ))}

          <path d={route} className={styles.robotPlan} />
          {WPS.map(([x, y], i) => (
            <g key={`wp-${i}`} className={styles.waypoint}>
              <path d={`M${sx(x) - 0.22} ${sy(y)}L${sx(x) + 0.22} ${sy(y)}M${sx(x)} ${sy(y) - 0.22}L${sx(x)} ${sy(y) + 0.22}`} />
              <text x={sx(x) + 0.35} y={sy(y) - 0.3}>{i + 1}</text>
            </g>
          ))}
          {runs.map(({ active: on, points }, i) => (
            <path key={i} d={pathOf(points)} className={cx(styles.robotTrail, on && styles.on)} />
          ))}

          {OBS.map((track, i) => {
            const [x, y] = track[frame];
            return <circle key={`obs-${i}`} cx={sx(x)} cy={sy(y)} r={trial.obstacleRadius} className={styles.obstacle} />;
          })}

          <circle cx={sx(robot[0])} cy={sy(robot[1])} r={trial.robotRadius} className={styles.robot} />
          <circle cx={sx(R[0][0])} cy={sy(R[0][1])} r=".18" className={styles.startDot} />
        </svg>

        <div className={styles.replayFoot}>
          <div className={styles.spark}>
            <span className="mono">CBF MARGIN h(t) · MIN {trial.summary.minMargin} &gt; 0</span>
            <svg viewBox={`0 0 ${SPARK_W} ${SPARK_H}`} preserveAspectRatio="none" aria-hidden="true">
              {activeBands.map(({ start, end }) => (
                <rect key={start} x={sparkX(start)} width={Math.max(sparkX(end) - sparkX(start), 0.3)} y="0" height={SPARK_H} className={styles.sparkBand} />
              ))}
              <path d={sparkPath} className={styles.sparkLine} vectorEffect="non-scaling-stroke" />
              <line x1={sparkX(frame)} x2={sparkX(frame)} y1="0" y2={SPARK_H} className={styles.sparkHead} vectorEffect="non-scaling-stroke" />
            </svg>
          </div>
        </div>

        <ul className={cx(styles.replayLegend, "mono")} aria-hidden="true">
          <li><i className={styles.lgRobot} />AUV</li>
          <li><i className={styles.lgActive} />Filter active</li>
          <li><i className={styles.lgObstacle} />Moving obstacle (point mass)</li>
          <li><i className={styles.lgWaypoint}>+</i>Waypoint</li>
        </ul>
      </div>

      <PlaybackBar
        note={note}
        paused={paused}
        disabled={reduced !== false}
        onToggle={() => setPaused((p) => !p)}
        onRestart={() => {
          setFrame(0);
          setPaused(false);
        }}
      />
    </div>
  );
}
