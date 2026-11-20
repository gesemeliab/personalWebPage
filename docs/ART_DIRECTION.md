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

It is **AI-generated conceptual art**. The page labels it `CONCEPT STUDY` for
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

The flow and navigation diagrams in the selected-work cards are conceptual
method sketches, not measured plots or equipment photographs. The one exception
is the bar chart on the RGB–sonar fusion card, which plots the recall figures
reported in the (under review) manuscript and prints every value; the card is
captioned accordingly.

Publication status and research claims come from the author's CV; work that is
simulated is described as simulated, and work under review is labelled as such.
The same holds for the figures in the hero's evidence strip (`highlights` in
`data/site.js`), each of which names its source.
