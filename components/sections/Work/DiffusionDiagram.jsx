"use client";

import { useEffect, useState } from "react";
import { cx } from "@/lib/classNames";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";
import { PlaybackBar } from "./PlaybackBar";
import styles from "./Work.module.css";

/*
  A concept illustration, not data: how CBF-guided diffusion planning works.

  Trajectory samples start as noise and are denoised step by step; at every
  step the barrier function's gradient nudges them away from an obstacle the
  model never saw in training, so by the last step they are smooth and clear
  of it. The geometry is synthetic and deterministic (seeded noise), so the
  server render and the client agree.
*/

const K = 40; // denoising steps shown
const TICK_MS = 85;
const HOLD_END_MS = 2600;
const HOLD_START_MS = 700;

const S = [22, 128];
const G = [298, 46];
const C = [158, 86];
const R_OBS = 19;
const R_SAFE = 31;
const N_PTS = 48;
const OFFSETS = [-36, -19, -6, 4, 18, 34];

// Seeded PRNG + Box-Muller, so every render draws the same noise.
function mulberry32(seed) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(7);
const gauss = () => Math.sqrt(-2 * Math.log(rand() + 1e-9)) * Math.cos(2 * Math.PI * rand());
const smooth = (xs, w = 2) => xs.map((_, i) => {
  let sum = 0;
  let n = 0;
  for (let j = Math.max(0, i - w); j <= Math.min(xs.length - 1, i + w); j += 1) { sum += xs[j]; n += 1; }
  return sum / n;
});

const dir = [G[0] - S[0], G[1] - S[1]];
const len = Math.hypot(...dir);
const nrm = [-dir[1] / len, dir[0] / len];
const taper = (s) => Math.sin(Math.PI * s); // endpoints are fixed: start and goal

const SAMPLES = OFFSETS.map((a, j) => {
  const base = Array.from({ length: N_PTS }, (_, i) => {
    const s = i / (N_PTS - 1);
    const off = a * taper(s) + 5 * Math.sin(2 * Math.PI * s + j) * taper(s);
    return [S[0] + dir[0] * s + nrm[0] * off, S[1] + dir[1] * s + nrm[1] * off];
  });
  // Guidance: alternately push points out of the safety radius and smooth the
  // path (endpoints fixed), until the whole path clears it.
  let px = base.map((p) => p[0]);
  let py = base.map((p) => p[1]);
  const side = Math.sign(a + 0.5) || 1; // samples on the line pick a side
  for (let r = 0; r < 60; r += 1) {
    for (let i = 1; i < N_PTS - 1; i += 1) {
      let vx = px[i] - C[0];
      let vy = py[i] - C[1];
      let d = Math.hypot(vx, vy);
      if (d < 1e-6) { vx = nrm[0] * side; vy = nrm[1] * side; d = 1; }
      if (d < R_SAFE + 2) { px[i] = C[0] + (vx / d) * (R_SAFE + 2); py[i] = C[1] + (vy / d) * (R_SAFE + 2); }
    }
    const sx = smooth(px, 1);
    const sy = smooth(py, 1);
    px = px.map((v, i) => (i === 0 || i === N_PTS - 1 ? v : sx[i]));
    py = py.map((v, i) => (i === 0 || i === N_PTS - 1 ? v : sy[i]));
  }
  const dx = px.map((v, i) => v - base[i][0]);
  const dy = py.map((v, i) => v - base[i][1]);
  const nx = smooth(smooth(base.map(() => gauss()), 1), 1);
  const ny = smooth(smooth(base.map(() => gauss()), 1), 1);
  const hit = base.some(([x, y]) => Math.hypot(x - C[0], y - C[1]) < R_OBS + 4);
  return { base, dx, dy, nx, ny, hit };
});

const pathAt = ({ base, dx, dy, nx, ny }, k) => {
  const sigma = 30 * (k / K) ** 1.3;
  const gamma = (1 - k / K) ** 0.8;
  return base.map(([x, y], i) => {
    const tp = taper(i / (N_PTS - 1)) ** 0.5;
    const px = x + gamma * dx[i] + sigma * nx[i] * tp;
    const py = y + gamma * dy[i] + sigma * ny[i] * tp;
    return `${i ? "L" : "M"}${px.toFixed(1)} ${py.toFixed(1)}`;
  }).join("");
};
const ghost = (pts) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`).join("");
const ARROWS = [-160, -120, -60, -20, 20, 60, 120, 160].map((deg) => {
  const t = (deg * Math.PI) / 180;
  const [c, s] = [Math.cos(t), Math.sin(t)];
  return `M${(C[0] + c * (R_OBS + 3)).toFixed(1)} ${(C[1] + s * (R_OBS + 3)).toFixed(1)}L${(C[0] + c * (R_SAFE + 4)).toFixed(1)} ${(C[1] + s * (R_SAFE + 4)).toFixed(1)}`;
});

const STAGES = [
  { id: "noise", text: { en: "Noise", es: "Ruido" }, sub: { en: "random controls", es: "controles aleatorios" } },
  { id: "denoise", text: { en: "Denoise", es: "Eliminación de ruido" }, sub: { en: "1D U-Net (DDPM)", es: "U-Net 1D (DDPM)" } },
  { id: "guide", text: { en: "CBF guidance", es: "Guiado CBF" }, sub: { en: "∇h at every step", es: "∇h en cada paso" } },
  { id: "out", text: { en: "Controls → Fossen", es: "Controles → Fossen" }, sub: { en: "8 s plan", es: "plan de 8 s" } },
];

/** Every other string the animation shows, per language. */
const TEXT = {
  en: {
    badge: "CONCEPT ILLUSTRATION",
    step: "DENOISING STEP k =",
    obstacle: "OBSTACLE UNSEEN IN TRAINING",
    start: "START",
    goal: "GOAL",
    pipeline: "Pipeline",
    legend: ["Guided sample", "Where it would go unguided"],
    aria:
      "Concept illustration: noisy trajectory samples between a start and a goal are denoised step by step, while a control barrier function's gradient pushes them away from an obstacle unseen in training, ending as smooth plans that go around it.",
  },
  es: {
    badge: "ILUSTRACIÓN CONCEPTUAL",
    step: "PASO DE ELIMINACIÓN DE RUIDO k =",
    obstacle: "OBSTÁCULO AUSENTE EN EL ENTRENAMIENTO",
    start: "INICIO",
    goal: "META",
    pipeline: "Flujo de procesamiento",
    legend: ["Muestra guiada", "Trayectoria sin guiado"],
    aria:
      "Ilustración conceptual: muestras ruidosas de trayectoria entre un inicio y una meta se depuran paso a paso, mientras el gradiente de una función de barrera de control las aleja de un obstáculo ausente en el entrenamiento, hasta obtener planes suaves que lo rodean.",
  },
};

export function DiffusionDiagram({ label, note, lang = "en" }) {
  const tx = TEXT[lang];
  const [k, setK] = useState(0);
  const [paused, setPaused] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.25 });
  const reduced = usePrefersReducedMotion();
  const playing = inView && reduced === false && !paused;

  useEffect(() => {
    if (!playing) return undefined;
    const delay = k === 0 ? HOLD_END_MS : k === K ? HOLD_START_MS : TICK_MS;
    const timer = setTimeout(() => setK((current) => (current === 0 ? K : current - 1)), delay);
    return () => clearTimeout(timer);
  }, [playing, k]);

  const stage = k === K ? "noise" : k === 0 ? "out" : "denoise";
  const guideOn = k > 0 && k < K;
  const settled = k === 0;
  const late = 1 - k / K;

  return (
    <div className={cx(styles.projectVisual, styles.diffusionVisual)} ref={ref}>
      <span className={cx(styles.visualLabel, "mono")}>{label}</span>
      <span className={cx(styles.wipBadge, "mono")}>{tx.badge}</span>

      <div className={styles.visualBody}>
        <div className={cx(styles.dfReadout, "mono")} aria-hidden="true">
          <span>{`${tx.step} ${String(k).padStart(2, "0")} / ${K}`}</span>
          <span className={styles.dfTrack}><span style={{ width: `${late * 100}%` }} /></span>
        </div>

        <svg
          className={styles.dfSvg}
          viewBox="0 0 320 170"
          role="img"
          aria-label={tx.aria}
        >
          <defs>
            <radialGradient id="dfObsGlow">
              <stop offset="0%" stopColor="#e08a5b" stopOpacity=".45" />
              <stop offset="100%" stopColor="#e08a5b" stopOpacity="0" />
            </radialGradient>
          </defs>

          <circle cx={C[0]} cy={C[1]} r={R_SAFE + 10} fill="url(#dfObsGlow)" />
          <circle cx={C[0]} cy={C[1]} r={R_SAFE} className={styles.dfSafe} />
          <g className={cx(styles.dfArrows, guideOn && styles.on)}>
            {ARROWS.map((d) => <path key={d} d={d} />)}
          </g>
          <circle cx={C[0]} cy={C[1]} r={R_OBS} className={styles.dfObstacle} />
          <text x={C[0]} y={C[1] + 3} textAnchor="middle" className={styles.dfObsText}>h(x) &lt; 0</text>
          <path d={`M${C[0]} ${C[1] + R_OBS + 2}L${C[0]} 154`} className={styles.dfLeader} />
          <text x={C[0]} y={164} textAnchor="middle" className={styles.svgLabel}>{tx.obstacle}</text>

          {SAMPLES.filter(({ hit }) => hit).map(({ base }, j) => (
            <path key={`ghost-${j}`} d={ghost(base)} className={styles.dfGhost} style={{ opacity: settled ? 0.9 : late * 0.35 }} />
          ))}

          {SAMPLES.map((sample, j) => (
            <path key={j} d={pathAt(sample, k)} className={cx(styles.dfSample, settled && styles.settled)} />
          ))}

          <circle cx={S[0]} cy={S[1]} r="4" className={styles.dfStart} />
          <text x={S[0] - 2} y={S[1] + 16} className={styles.svgLabel}>{tx.start}</text>
          <path d={`M${G[0] - 5} ${G[1] - 5}L${G[0] + 5} ${G[1] + 5}M${G[0] + 5} ${G[1] - 5}L${G[0] - 5} ${G[1] + 5}`} className={styles.dfGoal} />
          <text x={G[0] + 2} y={G[1] - 10} textAnchor="end" className={styles.svgLabel}>{tx.goal}</text>
        </svg>

        <ol className={cx(styles.dfStages, "mono")} aria-label={tx.pipeline}>
          {STAGES.map(({ id, text, sub }) => (
            <li
              key={id}
              className={cx((id === stage || (id === "guide" && guideOn)) && styles.on)}
            >
              <strong>{text[lang]}</strong>
              <span>{sub[lang]}</span>
            </li>
          ))}
        </ol>

        <div className={styles.dfFoot}>
          <ul className={cx(styles.dfLegend, "mono")} aria-hidden="true">
            <li><i />{tx.legend[0]}</li>
            <li><i className={styles.lgUnguided} />{tx.legend[1]}</li>
          </ul>
        </div>
      </div>

      <PlaybackBar
        note={note}
        lang={lang}
        paused={paused}
        disabled={reduced !== false}
        onToggle={() => setPaused((p) => !p)}
        onRestart={() => {
          setK(K);
          setPaused(false);
        }}
      />
    </div>
  );
}
