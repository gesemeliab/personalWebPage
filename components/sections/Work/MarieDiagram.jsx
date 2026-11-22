"use client";

import { useEffect, useState } from "react";
import { Check, Mail, User } from "lucide-react";
import { cx } from "@/lib/classNames";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PlaybackBar } from "./PlaybackBar";
import styles from "./Work.module.css";

/*
  A concept illustration of how MARIE worked at the bench, not data.

  The station: a RealSense camera over the workspace, microphones, a speaker
  and a monitor. The technician picks a mode:
    - "Assist me": MARIE recognizes each step from the camera and ticks the
      process spec. When a step seems skipped it asks; the technician either
      goes back and does it, or confirms it was done, which becomes a label
      MARIE retrains on.
    - "Help MARIE learn": wake word, then "step done" by voice; MARIE
      timestamps each step, and the timestamps become training labels.
  Every session is recorded and feeds a weekly report to the team.

  The procedure is generic on purpose: no real process, tool or site appears.
*/

const STEPS = [
  "Open the chamber",
  "Remove the module",
  "Inspect under the microscope",
  "Fit the new module",
  "Close and verify",
];
const SKIPPED = 2;
const SCENE_T = 11;
const TICK_MS = 100;
const HOLD_MS = 1800;

const SCENES = [
  { id: "teach", mode: "teach", label: "Teach MARIE", title: "Teaching mode · by voice" },
  { id: "forgot", mode: "assist", label: "Skipped step", title: "Assist mode · a step was skipped" },
  { id: "missed", mode: "assist", label: "MARIE missed", title: "Assist mode · MARIE missed a step" },
];

/** Everything on screen, as a pure function of the scene and the time in it. */
function sceneState(id, t) {
  const steps = STEPS.map(() => ({ status: "todo" }));
  const lines = [];
  let seen = null;
  let speaking = null; // "tech" | "marie"
  let footer = null;
  const done = (i, at, extra = {}) => { if (t >= at) steps[i] = { status: "done", ...extra }; };

  if (id === "teach") {
    const times = ["00:41", "02:13", "04:52", "06:30", "07:58"];
    if (t >= 0.4) { lines.push({ who: "tech", text: "“Hey MARIE, I’ll teach you.”", tag: "wake word" }); }
    if (t >= 1.2) { lines.push({ who: "marie", text: "Recording. Tell me when each step is done." }); }
    STEPS.forEach((_, i) => {
      const at = 2.4 + i * 1.6;
      if (t >= at - 0.5 && t < at) speaking = "tech";
      if (t >= at) {
        steps[i] = { status: "logged", note: times[i] };
        lines.push({ who: "tech", text: "“Step done.”", tag: "speech to text" });
        if (t >= at + 0.5) lines.push({ who: "marie", text: `Logged step ${i + 1} at ${times[i]}.`, tag: "→ label" });
      }
    });
    const next = steps.findIndex((s) => s.status === "todo");
    if (next >= 0 && t >= 1.2) steps[next] = { status: "now" };
    if (t >= 0.4 && t < 1.2) speaking = "tech";
    if (t >= 1.2 && t < 2) speaking = "marie";
    seen = "recording the demonstration";
    if (t >= 9.6) footer = "Timestamps become labels: MARIE retrains on the new demonstration";
    return { steps, lines: lines.slice(-2), seen, speaking, footer, rec: true };
  }

  // Assist: steps 1-2 recognized, then the technician moves on to step 4.
  done(0, 1.2);
  done(1, 2.6);
  seen = t < 1.2 ? STEPS[0] : t < 2.6 ? STEPS[1] : STEPS[3];
  if (t >= 4.0) steps[SKIPPED] = { status: "flag" };
  if (t >= 4.2) {
    lines.push({ who: "marie", text: `I think “${STEPS[SKIPPED].toLowerCase()}” was skipped, or I missed it. Can you confirm?` });
    if (t < 5.6) speaking = "marie";
  }
  if (id === "forgot") {
    if (t >= 6) { lines.push({ who: "tech", text: "“Right, doing it now.”" }); if (t < 6.8) speaking = "tech"; }
    if (t >= 6.4) seen = STEPS[SKIPPED];
    done(SKIPPED, 7.4);
    if (t >= 7.4) seen = STEPS[3];
    done(3, 8.6);
    if (t >= 8.6) seen = STEPS[4];
  } else {
    if (t >= 6) { lines.push({ who: "tech", text: "“I already did it.”" }); if (t < 6.8) speaking = "tech"; }
    if (t >= 6.6) {
      steps[SKIPPED] = { status: "done", confirmed: true };
      lines.push({ who: "marie", text: "Thanks. I’ll learn from that one.", tag: "+1 correction for retraining" });
      if (t < 7.4) speaking = "marie";
    }
    done(3, 7.8);
    if (t >= 7.8) seen = STEPS[4];
  }
  done(4, 9.8);
  if (t >= 9.8) {
    seen = "procedure complete";
    footer = "Session recorded: weekly usage summary and process report emailed to the team";
  }
  steps.forEach((s, i) => { if (s.status === "todo" && STEPS[i] === seen) steps[i] = { status: "now" }; });
  return { steps, lines: lines.slice(-2), seen, speaking, footer, rec: false };
}

/**
 * The station, drawn from the technician's side: an overhead rig with depth
 * cameras angled at the workspace, microphones and a speaker bar; the bench
 * with its compute units, a monitor and the tools; the technician in front.
 */
function Bench({ seen, speaking, rec, assist }) {
  const watching = assist && seen;
  return (
    <svg className={styles.benchSvg} viewBox="0 0 260 176" role="img"
      aria-label="A workbench with an overhead rig of depth cameras, microphones and a speaker aimed at the workspace, a monitor and compute units on the bench, and the technician standing in front.">
      {/* room: back wall frame and floor grid */}
      <path d="M20 8 L240 8 M20 8 L20 118 M240 8 L240 118" className={styles.bRoom} />
      <polygon points="0,176 260,176 236,128 24,128" className={styles.bFloor} />
      {[0.25, 0.5, 0.75].map((f) => (
        <line key={f} x1={24 + f * 212} y1="128" x2={f * 260} y2="176" className={styles.bGrid} />
      ))}
      <line x1="12" y1="150" x2="248" y2="150" className={styles.bGrid} />

      {/* camera fields of view onto the bench */}
      <polygon points="82,40 92,38 150,112 52,112" className={cx(styles.bFov, watching && styles.on)} />
      <polygon points="168,38 178,40 208,112 110,112" className={cx(styles.bFov, watching && styles.on)} />

      {/* overhead rig */}
      <line x1="60" y1="22" x2="200" y2="22" className={styles.bRig} />
      <rect x="78" y="26" width="9" height="18" rx="4" transform="rotate(-28 82 35)" className={styles.bCam} />
      <rect x="173" y="26" width="9" height="18" rx="4" transform="rotate(28 177 35)" className={styles.bCam} />
      <rect x="117" y="30" width="26" height="10" rx="1.5" className={cx(styles.bSpeaker, speaking === "marie" && styles.on)} />
      {speaking === "marie" ? <path d="M124 46 q6 4 12 0 M120 51 q10 6 20 0" className={styles.bWave} /> : null}
      {[100, 160].map((x) => (
        <rect key={x} x={x - 6} y="47" width="12" height="5" rx="2.5" transform={`rotate(${x < 130 ? -12 : 12} ${x} 49)`}
          className={cx(styles.bMic, speaking === "tech" && styles.on)} />
      ))}
      <text x="30" y="18" className={styles.bLabel}>DEPTH CAMERAS</text>
      <text x="230" y="18" textAnchor="end" className={styles.bLabel}>MICS · SPEAKER</text>

      {/* bench */}
      <polygon points="30,112 230,112 238,122 22,122" className={styles.bBenchTop} />
      <rect x="22" y="122" width="216" height="5" className={styles.bBench} />
      {/* compute units */}
      <rect x="30" y="98" width="30" height="14" rx="1.5" className={styles.bBox} />
      <rect x="62" y="102" width="24" height="10" rx="1.5" className={styles.bBox} />
      {/* monitor */}
      <rect x="186" y="76" width="40" height="27" rx="2" className={styles.bMonitor} />
      <rect x="189" y="79" width="34" height="21" rx="1" className={styles.bScreen} />
      {[0, 1, 2].map((i) => <rect key={i} x="192" y={83 + i * 5.5} width={i === 1 ? 18 : 26} height="2.4" rx="1" className={styles.bScreenLine} />)}
      {rec ? <circle cx="219" cy="83" r="2" className={styles.bRec} /> : null}
      <line x1="206" y1="103" x2="206" y2="112" className={styles.bRig} />
      {/* tools: microscope and the module being worked on */}
      <g className={styles.bTool}>
        <rect x="100" y="104" width="16" height="8" rx="1.5" />
        <rect x="106" y="86" width="5" height="20" rx="1.5" transform="rotate(-14 108 96)" />
        <circle cx="104" cy="86" r="3" />
      </g>
      <rect x="132" y="102" width="26" height="10" rx="1.5" className={styles.bModule} />

      {/* technician, facing the bench */}
      <g className={styles.bPerson}>
        <circle cx="150" cy="118" r="8" />
        <path d="M134 176 L136 140 Q138 128 150 127 Q162 128 164 140 L166 176 Z" />
      </g>
      <text x="172" y="168" className={styles.bLabel}>TECHNICIAN</text>

      <text x="130" y="64" textAnchor="middle" className={cx(styles.bSeen, (watching || rec) && styles.on)}>
        {seen ? `${rec ? "● " : "SEEN: "}${seen.toUpperCase()}` : ""}
      </text>
    </svg>
  );
}

export function MarieDiagram({ label, note }) {
  const [scene, setScene] = useState(0);
  const [t, setT] = useState(SCENE_T);
  const [paused, setPaused] = useState(false);
  const [touched, setTouched] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.25 });
  const reduced = usePrefersReducedMotion();
  const playing = inView && reduced === false && !paused;

  useEffect(() => {
    if (!playing) return undefined;
    const end = t >= SCENE_T;
    const timer = setTimeout(() => {
      if (!end) { setT((c) => Math.min(SCENE_T, c + TICK_MS / 1000)); return; }
      if (!touched) setScene((s) => (s + 1) % SCENES.length);
      setT(0);
    }, end ? HOLD_MS : TICK_MS);
    return () => clearTimeout(timer);
  }, [playing, t, touched]);

  const pick = (i) => { setTouched(true); setScene(i); setT(0); };

  const { id, mode, title } = SCENES[scene];
  const state = sceneState(id, t);
  const assist = mode === "assist";

  return (
    <div className={cx(styles.projectVisual, styles.marieVisual)} ref={ref}>
      <span className={cx(styles.visualLabel, "mono")}>{label}</span>
      <span className={cx(styles.wipBadge, "mono")}>CONCEPT ILLUSTRATION</span>

      <div className={styles.visualBody}>
        <div className={styles.marieModes}>
          <div className={styles.segmented} role="group" aria-label="Scenario">
            {SCENES.map((s, i) => (
              <button key={s.id} type="button" className="mono" aria-pressed={scene === i} onClick={() => pick(i)}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.marieStage}>
          <Bench seen={state.seen} speaking={state.speaking} rec={state.rec} assist={assist} />

          <div className={styles.marieSpec}>
            <span className={cx(styles.marieSpecTitle, "mono")}>
              {assist ? "PROCESS SPEC · CHECKED BY MARIE" : "PROCESS SPEC · TIMESTAMPED BY VOICE"}
            </span>
            <ol>
              {STEPS.map((name, i) => {
                const s = state.steps[i];
                return (
                  <li key={name} className={styles[s.status]}>
                    <i aria-hidden="true">
                      {s.status === "done" ? (s.confirmed ? <User size={10} strokeWidth={3} /> : <Check size={11} strokeWidth={3} />)
                        : s.status === "flag" ? "?" : s.status === "logged" ? <Check size={11} strokeWidth={3} /> : i + 1}
                    </i>
                    <span>{name}</span>
                    {s.note ? <em className="mono">{s.note}</em> : null}
                    {s.confirmed ? <em className="mono">confirmed</em> : null}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>

        <div className={styles.marieDialog} aria-live={touched ? "polite" : "off"}>
          <span className={cx(styles.marieSpecTitle, "mono")}>{title.toUpperCase()}</span>
          {state.lines.length ? state.lines.map(({ who, text, tag }, i) => (
            <p key={i} className={styles[who]}>
              <b className="mono">{who === "marie" ? "MARIE" : "TECH"}</b>
              <span>{text}</span>
              {tag ? <em className="mono">{tag}</em> : null}
            </p>
          )) : <p className={styles.idle}><span>{assist ? "Watching the bench…" : "Waiting for the wake word…"}</span></p>}
        </div>

        <div className={styles.dfFoot}>
          <span className={cx(styles.marieCaption, "mono", state.footer && styles.on)}>
            {state.footer ? <><Mail size={12} aria-hidden="true" /> {state.footer}</> : "Voice: wake word → speech to text → keyword spotting · replies by speech"}
          </span>
        </div>
      </div>

      <PlaybackBar
        note={note}
        paused={paused}
        disabled={reduced !== false}
        onToggle={() => setPaused((p) => !p)}
        onRestart={() => {
          setScene(0);
          setT(0);
          setTouched(false);
          setPaused(false);
        }}
      />
    </div>
  );
}
