"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/classNames";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PlaybackBar } from "./PlaybackBar";
import styles from "./Work.module.css";

/*
  A concept illustration of the person-following quadrotor (CoDIT 2022), not
  flight data. The control logic is the paper's:

  - Two-step Haar detection: upper body first, then a face searched for only
    inside it. An upper body with no face is rejected.
  - The face centroid's zone in the 640×480 frame sets roll and thrust: a dead
    band of ±30 px around the centre, slow outside it, fast beyond x < 145 /
    y < 105 (and their mirror images).
  - The width of the detection box decides whether to pitch forward.
  - With no detection the quadrotor hovers. Frames are processed at ~4 FPS.

  The person's walk and the vehicle response are a small deterministic
  simulation, computed once at module load, so server and client agree.
*/

const DT = 0.05;
const TICK_MS = 60;
const HOLD_MS = 3500;
const T = 28;
const FRAME_S = 0.25; // ~4 FPS onboard
const F = 420; // focal length, px, for a 640×480 frame
const FACE_H = 1.6;
const BODY_W = 0.55;
const TARGET_DIST = 4;
const TARGET_W = (F * BODY_W) / TARGET_DIST;
const ROLL = { fast: 1.0, slow: 0.35 };
const THRUST = { fast: 0.5, slow: 0.2 };
const PITCH = 0.6;
const DECOY = { x: -1.3, y: 15, from: 0.6, to: 2.6 };
const TREES = [-14, -8, -2.5, 4, 9, 15, 21].map((x, i) => ({ x, y: 38 + (i % 3) * 4, h: 5 + (i % 2) * 1.5 }));

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (u) => u * u * (3 - 2 * u);
const lerpSeg = (t, t0, t1, a, b) => a + (b - a) * smooth(clamp((t - t0) / (t1 - t0), 0, 1));

/** Where the person stands at time t (world metres: x right, y forward). */
function person(t) {
  if (t < 11) return { x: lerpSeg(t, 2.8, 5.2, -7, -3.7), y: 8, walking: t > 2.8 && t < 5.2 };
  return { x: lerpSeg(t, 11, 18, -3.7, 1.6), y: lerpSeg(t, 11, 18, 8, 11.5), walking: t > 11 && t < 18 };
}

/** The paper's zone rule for one axis: dead band, slow, fast. */
function zone(e, fastBeyond) {
  const a = Math.abs(e);
  if (a < 30) return 0;
  return Math.sign(e) * (a > fastBeyond ? 2 : 1);
}

function project(d, wx, wy, wz) {
  const dist = wy - d.y;
  return { u: 320 + (F * (wx - d.x)) / dist, v: 240 - (F * (wz - d.z)) / dist, s: F / dist, dist };
}

/** One camera frame: what the detector reports and the command it yields. */
function perceive(d, p, t) {
  const face = project(d, p.x, p.y, FACE_H);
  const visible = face.u > 40 && face.u < 600 && face.v > 30 && face.v < 450;
  if (!visible) {
    const decoy = t >= DECOY.from && t < DECOY.to;
    return { detected: false, decoy, cmd: { vx: 0, vy: 0, vz: 0 }, roll: 0, thrust: 0, pitch: 0 };
  }
  const ex = face.u - 320;
  const ey = face.v - 240;
  const roll = zone(ex, 175);
  const thrust = zone(ey, 135);
  const width = BODY_W * face.s;
  const pitch = width < TARGET_W * 0.92 ? 1 : 0;
  return {
    detected: true,
    decoy: false,
    u: face.u,
    v: face.v,
    width,
    roll,
    thrust,
    pitch,
    cmd: {
      vx: pitch * PITCH,
      vy: Math.sign(roll) * (Math.abs(roll) === 2 ? ROLL.fast : roll ? ROLL.slow : 0),
      vz: Math.sign(thrust) * (Math.abs(thrust) === 2 ? THRUST.fast : thrust ? THRUST.slow : 0),
    },
  };
}

/** The whole run, precomputed: drone state, person, and the latest frame. */
const RUN = (() => {
  const out = [];
  const d = { x: 0, y: 0, z: 3.2 };
  const vel = { vx: 0, vy: 0, vz: 0 };
  let frame = null;
  let firstLock = null;
  const trail = [];
  for (let i = 0; i <= Math.round(T / DT); i += 1) {
    const t = i * DT;
    const p = person(t);
    if (frame === null || i % Math.round(FRAME_S / DT) === 0) {
      frame = perceive(d, p, t);
      if (frame.detected && firstLock === null) firstLock = t;
    }
    const k = Math.min(1, DT / 0.3);
    vel.vx += (frame.cmd.vx - vel.vx) * k;
    vel.vy += (frame.cmd.vy - vel.vy) * k;
    vel.vz += (frame.cmd.vz - vel.vz) * k;
    d.y += vel.vx * DT;
    d.x += vel.vy * DT;
    d.z = Math.max(0.8, d.z - vel.vz * DT);
    if (i % 4 === 0) trail.push({ d: { ...d }, p: { x: p.x, y: p.y } });
    out.push({ t, d: { ...d }, p, frame, faceOn: frame.detected && firstLock !== null && t - firstLock >= FRAME_S, trailLen: trail.length });
  }
  return { states: out, trail };
})();

const ARROWS = {
  roll: ["← fast", "← slow", "hold", "slow →", "fast →"],
  thrust: ["↑ fast", "↑ slow", "hold", "↓ slow", "↓ fast"],
};

/** One person, drawn in the camera frame. */
function Person({ face, walking, t }) {
  const { u, v, s } = face;
  const swing = walking ? Math.sin(t * 9) * 0.12 * s : 0;
  const feet = v + FACE_H * s;
  const hip = v + 0.78 * s;
  return (
    <g className={styles.uvPerson}>
      <path d={`M${u - 0.1 * s} ${hip} L${u - 0.1 * s + swing} ${feet} M${u + 0.1 * s} ${hip} L${u + 0.1 * s - swing} ${feet}`}
        strokeWidth={0.12 * s} className={styles.uvLegs} />
      <path d={`M${u - 0.27 * s} ${v + 0.2 * s} Q${u} ${v + 0.14 * s} ${u + 0.27 * s} ${v + 0.2 * s} L${u + 0.2 * s} ${hip} L${u - 0.2 * s} ${hip} Z`} />
      <circle cx={u} cy={v} r={0.11 * s} className={styles.uvHead} />
    </g>
  );
}

/** The onboard camera frame, 640×480, with the zone grid and detections. */
function CameraView({ st }) {
  const { d, p, frame } = st;
  const face = project(d, p.x, p.y, FACE_H);
  const horizon = 240;
  const decoy = project(d, DECOY.x, DECOY.y, 0.7);
  const cell = (e, a, b, c, g) => (e < a ? [0, a] : e < b ? [a, b] : e < c ? [b, c] : e < g ? [c, g] : [g, null]);

  let hl = null;
  if (frame.detected && st.faceOn) {
    const [x0, x1] = cell(frame.u, 145, 290, 350, 495);
    const [y0, y1] = cell(frame.v, 105, 210, 270, 375);
    const fast = Math.abs(frame.roll) === 2 || Math.abs(frame.thrust) === 2;
    const centred = frame.roll === 0 && frame.thrust === 0;
    hl = { x: x0, y: y0, w: (x1 ?? 640) - x0, h: (y1 ?? 480) - y0, cls: centred ? styles.uvCellOk : fast ? styles.uvCellFast : styles.uvCellSlow };
  }

  return (
    <svg viewBox="0 0 640 480" className={styles.rvSvg} role="img"
      aria-label="The drone's camera view: a person is found as an upper body, then a face inside it; the zone of the face centre in the frame sets the flight command.">
      <rect width="640" height={horizon} className={styles.uvSky} />
      <rect y={horizon} width="640" height={480 - horizon} className={styles.uvGrass} />
      {TREES.map((tr) => {
        const b = project(d, tr.x, tr.y, 0);
        const top = project(d, tr.x, tr.y, tr.h);
        return (
          <g key={tr.x} className={styles.uvTree}>
            <rect x={b.u - 0.15 * b.s} y={(b.v + top.v) / 2} width={0.3 * b.s} height={(b.v - top.v) / 2} />
            <ellipse cx={b.u} cy={top.v + (b.v - top.v) * 0.3} rx={1.6 * b.s} ry={(b.v - top.v) * 0.36} />
          </g>
        );
      })}
      <ellipse cx={decoy.u} cy={decoy.v} rx={0.9 * decoy.s} ry={0.7 * decoy.s} className={styles.uvBush} />
      {p.y - d.y > 0.5 ? <Person face={face} walking={p.walking} t={st.t} /> : null}

      <g className={styles.uvGrid}>
        {[145, 290, 350, 495].map((x) => <line key={`x${x}`} x1={x} x2={x} y1="0" y2="480" />)}
        {[105, 210, 270, 375].map((y) => <line key={`y${y}`} x1="0" x2="640" y1={y} y2={y} />)}
      </g>
      {hl ? <rect x={hl.x} y={hl.y} width={hl.w} height={hl.h} className={hl.cls} /> : null}
      <path d="M308 240 H332 M320 228 V252" className={styles.uvCross} />

      {frame.decoy ? (
        <g>
          <rect x={decoy.u - 0.95 * decoy.s} y={decoy.v - 0.75 * decoy.s} width={1.9 * decoy.s} height={1.5 * decoy.s} className={styles.uvDecoy} />
          <text x={decoy.u} y={decoy.v + 0.75 * decoy.s + 26} textAnchor="middle" className={styles.uvTagWarn}>UPPER BODY? NO FACE → REJECTED</text>
        </g>
      ) : null}
      {frame.detected ? (
        <g>
          <rect x={frame.u - 0.34 * face.s} y={frame.v - 0.22 * face.s} width={0.68 * face.s} height={0.95 * face.s} className={styles.uvBody} />
          <text x={frame.u - 0.34 * face.s} y={frame.v - 0.22 * face.s - 8} className={styles.uvTagBody}>UPPER BODY</text>
          {st.faceOn ? (
            <>
              <rect x={frame.u - 0.15 * face.s} y={frame.v - 0.15 * face.s} width={0.3 * face.s} height={0.3 * face.s} className={styles.uvFace} />
              <line x1="320" y1="240" x2={frame.u} y2={frame.v} className={styles.uvError} />
              <circle cx={frame.u} cy={frame.v} r="5" className={styles.uvCentroid} />
            </>
          ) : null}
        </g>
      ) : null}
      <text x="16" y="30" className={styles.uvHud}>{frame.detected ? (st.faceOn ? "LOCKED · FACE" : "UPPER BODY · SEARCHING FACE") : "SEARCHING · HOVER"}</text>
      <text x="624" y="466" textAnchor="end" className={styles.uvHud}>640 × 480</text>
    </svg>
  );
}

/** Top-down view: the quadrotor, its camera's field of view, the person. */
function ExternalView({ st }) {
  const K = 7;
  const X = (wy) => 16 + (wy + 1) * K;
  const Y = (wx) => 52 + wx * K;
  const spread = 320 / F; // tan of the half field of view
  const { d, p } = st;
  const reach = 44;
  const trail = RUN.trail.slice(0, st.trailLen);
  const dist = Math.hypot(p.x - d.x, p.y - d.y);
  return (
    <svg viewBox="0 0 320 100" className={styles.rvSvg} role="img"
      aria-label="Top-down view: the quadrotor follows the person, keeping them in its camera's field of view at a set distance.">
      <path d={`M${X(d.y)} ${Y(d.x)} L${X(d.y + reach)} ${Y(d.x - reach * spread)} L${X(d.y + reach)} ${Y(d.x + reach * spread)} Z`}
        className={styles.uvFov} />
      <polyline points={trail.map((s) => `${X(s.d.y)},${Y(s.d.x)}`).join(" ")} className={styles.uvTrailDrone} />
      <polyline points={trail.map((s) => `${X(s.p.y)},${Y(s.p.x)}`).join(" ")} className={styles.uvTrailPerson} />
      {st.frame.detected ? (
        <>
          <line x1={X(d.y)} y1={Y(d.x)} x2={X(p.y)} y2={Y(p.x)} className={styles.uvLink} />
          <text x={(X(d.y) + X(p.y)) / 2} y={(Y(d.x) + Y(p.x)) / 2 - 6} textAnchor="middle" className={styles.uvMapText}>{`${dist.toFixed(1)} m`}</text>
        </>
      ) : null}
      <circle cx={X(p.y)} cy={Y(p.x)} r="3.6" className={styles.uvMapPerson} />
      <g transform={`translate(${X(d.y)} ${Y(d.x)})`} className={styles.uvQuad}>
        <path d="M-5 -5 L5 5 M-5 5 L5 -5" />
        {[[-5, -5], [5, -5], [-5, 5], [5, 5]].map(([a, b]) => <circle key={`${a}${b}`} cx={a} cy={b} r="2.6" />)}
      </g>
      <text x="312" y="93" textAnchor="end" className={styles.uvMapText}>{`ALTITUDE ${d.z.toFixed(1)} m`}</text>
    </svg>
  );
}

export function UavDiagram({ label, note }) {
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

  const st = RUN.states[Math.min(RUN.states.length - 1, Math.round(t / DT))];
  const f = st.frame;
  const locked = f.detected && st.faceOn;
  const call = `send_ned_velocity(${f.cmd.vx.toFixed(2)}, ${f.cmd.vy.toFixed(2)}, ${f.cmd.vz.toFixed(2)})`;

  return (
    <div className={cx(styles.projectVisual, styles.uavVisual)} ref={ref}>
      <span className={cx(styles.visualLabel, "mono")}>{label}</span>
      <span className={cx(styles.wipBadge, "mono")}>CONCEPT ILLUSTRATION</span>

      <div className={styles.visualBody}>
        <div className={styles.uvTop}>
          <div className={styles.rvCol}>
            <figure className={cx(styles.rvPanel, styles.uvCam)}>
              <figcaption className="mono">ONBOARD CAMERA · JETSON TX2</figcaption>
              <CameraView st={st} />
            </figure>

            <figure className={cx(styles.rvPanel, styles.uvExt)}>
              <figcaption className="mono">EXTERNAL VIEW · TOP-DOWN</figcaption>
              <ExternalView st={st} />
            </figure>
          </div>

          <div className={styles.rvCol}>
            <figure className={cx(styles.rvPanel, styles.uvCommand)}>
              <figcaption className="mono">FLIGHT COMMAND · MAVLINK</figcaption>
              <dl className={cx(styles.uvReadout, "mono")}>
                <div><dt>Roll</dt><dd className={locked && f.roll ? styles.on : undefined}>{locked ? ARROWS.roll[f.roll + 2] : "hold"}</dd></div>
                <div><dt>Thrust</dt><dd className={locked && f.thrust ? styles.on : undefined}>{locked ? ARROWS.thrust[f.thrust + 2] : "hold"}</dd></div>
                <div>
                  <dt>Pitch</dt>
                  <dd className={locked && f.pitch ? styles.on : undefined}>
                    {locked ? (f.pitch ? "forward" : "hold") : "hold"}
                    {locked ? <small>{`box ${Math.round(f.width)} / ${Math.round(TARGET_W)} px`}</small> : null}
                  </dd>
                </div>
              </dl>
              <code className={styles.uvCall}>{call}</code>
            </figure>

            <div className={styles.rvFoot}>
              <ul className={cx(styles.rvLegend, "mono")}>
                <li><i className={styles.lgBody} />Upper body</li>
                <li><i className={styles.lgFace} />Face</li>
                <li><i className={styles.lgSlow} />Slow zone</li>
                <li><i className={styles.lgFast} />Fast zone</li>
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
