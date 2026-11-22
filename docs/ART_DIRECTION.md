# Visual direction

A robotics lab notebook: deep pine-black hero, acid-lime accents, open
editorial sections, Space Grotesk headings, DM Sans body text, IBM Plex Mono
technical labels. Every family has a system fallback.

The accent colour carries meaning rather than decoration — lime marks the
things the page wants you to act on, and in the hero artwork it marks what the
model predicts.

## Imagery

### `public/images/hero-trajectories.png`

A conceptual visualisation of planning: one committed trajectory and a fan of
alternative candidate paths threading between clusters of occupied voxels. It
stands for the research itself — perception of a world, prediction of futures,
and the selection of one — rather than for any single robot platform, which is
deliberate: the methods are not tied to one embodiment.

It is **AI-generated conceptual art**. The page labels it `CONCEPTUAL ILLUSTRATION` for
that reason. It is not a photograph of hardware and not a plot of experimental
results, and it carries no figures that could be mistaken for data.

Two constraints govern any replacement:

- The subject must be light against a background at or below `#101817`. The
  image is composited with `mix-blend-mode: lighten`, so pixels darker than the
  page disappear — that is what lets the artwork sit flush instead of reading
  as a pasted rectangle.
- Keep content inside the centre ~90%. The hero scales the image to 116% width
  and bleeds it 8% to the left, so anything at the extreme edges is lost.

Landscape, and the intrinsic dimensions in `components/sections/Hero/HeroArt.jsx`
must match the file, or the page shifts as it loads.

### `public/images/portrait.jpg`

A photograph of the author, used in the about section.

The source is a tall 9:16 headshot and the frame is near-square, so
`About.module.css` biases the crop upward with `object-position: center 16%`.
A centred crop cuts off the top of the head.

## Project visuals

Two kinds of visual, kept visibly distinct:

- **Instrument panels** (dark teal, the hero's palette). The sensor-fusion
  viewer shows a real test frame with the model's own detections at every
  degradation level, and the AUV card replays a planar simulation run of the
  real controller. Both are built by `scripts/figures/` (see its README for
  provenance and the rules they follow). The diffusion, MARIE, rover and UAV
  cards share the palette but are concept animations, and say so on the panel
  ("CONCEPT" badge, "not experimental data" / "not Intel data"); MARIE's steps
  are generic so no real procedure or site appears. The UAV animation runs the
  control rule from the CoDIT 2022 paper (zone thresholds, box-width pitch rule,
  hover without detection) on a synthetic walk; it is not flight data. Lime
  marks the method's output or the safety filter acting; orange marks
  obstacles, sonar-recovered objects and fast-correction zones; dashed grey is
  the unguided baseline.
- **Flow diagrams** (pale tints): the `FlowDiagram` fallback for a project
  without a dedicated visual. No project uses one at present.

### One anatomy for every panel

All six featured cards share one structure, so the section reads as a set:

- **Header:** the panel label on the left, one badge on the right. A solid
  badge marks real data (`REAL TEST FRAME`, `SIMULATION RUN`); a dashed one
  marks a concept animation (`CONCEPT ILLUSTRATION`).
- **Body** (`.visualBody`): takes the free height and centres its content —
  readout line, drawing, legend.
- **Bottom bar** (`PlaybackBar`): restart and play/pause on the left for every
  animation, the provenance note on the right. The sonar viewer has its own
  controls, so its bar carries only the note.
- **Height:** on desktop every featured card is at least 600 px tall, so the
  cards differ by a few pixels at most; on phones each sizes to its content.
- **Text side:** one abstract (about 60–75 words, formal and impersonal),
  four tags, three key numbers, and a closing line with context, venue and
  paper link. No expander: everything a reader needs is on the card.

Publication status and research claims come from the author's CV; work that is
simulated is described as simulated, and work under review is labelled as such.
The same holds for the figures in the hero's evidence strip (`highlights` in
`data/site.js`), each of which names its source.
