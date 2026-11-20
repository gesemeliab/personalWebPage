/**
 * Conceptual safety-constrained navigation path.
 *
 * Hand-drawn illustration, not plotted data - the caption on the card says so.
 */
export function NavigationDiagram() {
  return (
    <svg viewBox="0 0 520 225" role="img" aria-label="Conceptual navigation diagram: a safe path curves around an obstacle between start and goal. Not measured results.">
      <defs>
        <pattern id="grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="#25494b" strokeWidth=".6" />
        </pattern>
      </defs>
      <rect width="520" height="225" fill="url(#grid)" />
      <circle cx="275" cy="120" r="66" fill="none" stroke="#709493" strokeDasharray="5 6" />
      <circle cx="275" cy="120" r="35" fill="#486869" />
      <path
        d="M45 171 C145 182 132 25 247 27 S345 175 465 59"
        fill="none"
        stroke="#c4f36b"
        strokeWidth="3"
      />
      <circle cx="45" cy="171" r="5" fill="#c4f36b" />
      <circle cx="465" cy="59" r="7" fill="none" stroke="#c4f36b" strokeWidth="2" />
      <text x="29" y="199">START</text>
      <text x="437" y="40">GOAL</text>
      <text x="226" y="218">SAFETY BOUNDARY</text>
    </svg>
  );
}
