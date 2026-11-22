/** Identity, contact details and the primary navigation. */

export const site = {
  name: "Gesem Mejia",
  fullName: "Gesem Eliab Gudino Mejia",
  title: "Gesem Mejia - Robot Perception for Decision-Making",
  description:
    "Gesem Mejia: Ph.D. researcher at RIT working on robot perception for decision-making: multimodal sensor fusion (RGB, depth, sonar, audio) and perception-driven planning. Previously Intel Labs.",
  location: "Rochester, NY",
  coordinates: "ROCHESTER, NY · 43.16° N",
  disciplines: "ROBOT PERCEPTION FOR DECISION-MAKING",
  email: "gg2673@rit.edu",
  // Pre-scaled by scripts/portrait.ps1 from the original photo: 1x, 2x and 3x of the frame.
  portrait: {
    src: "/images/portrait-345.jpg",
    srcSet: "/images/portrait-345.jpg 1x, /images/portrait-690.jpg 2x, /images/portrait-1035.jpg 3x",
  },
};

export const profiles = {
  scholar: "https://scholar.google.com/citations?hl=es&user=b63J0MYAAAAJ",
  linkedin: "https://www.linkedin.com/in/gesem-mejia-3b07b7127/",
};

/** The availability shown in the hero status chip and the contact section. */
export const availability = {
  short: "Open to Ph.D. research internships",
  long: "Seeking Ph.D. research internships in robot perception for navigation, planning, or world models.",
};

export const navigation = [
  { id: "about", label: "About" },
  { id: "work", label: "Selected work" },
  { id: "publications", label: "Publications" },
  { id: "experience", label: "CV" },
  { id: "directions", label: "Directions" },
];

export const contactLink = { label: "Let’s talk", href: "#contact" };

/**
 * The hero's typing line.
 *
 * `phrases` are typed one at a time, erased, and cycled after the `prompt`.
 * `sentence` is the whole line written out: it is what renders before
 * hydration and under prefers-reduced-motion, and what screen readers are
 * given instead of the animation.
 */
const interests = [
  "robot perception and planning",
  "sensor fusion",
  "world models",
];

export const heroTyping = {
  prompt: "> researching ",
  // Typed with the full stop, so each phrase reads as a finished sentence
  // before it is erased: "> researching world models._"
  phrases: interests.map((interest) => `${interest}.`),
  sentence: `Researching ${interests.slice(0, -1).join(", ")}, and ${interests.at(-1)}.`,
};

/**
 * The evidence strip under the hero. Every figure is taken from the CV;
 * `kicker` says what kind of evidence it is, and `source` names where it
 * comes from, so it can be checked.
 */
export const highlights = [
  {
    id: "years",
    kicker: "EXPERIENCE",
    value: "9",
    unit: "yrs",
    label: "Putting perception on physical robots",
    source: "UAV · UGV · AUV",
  },
  {
    id: "fabs",
    kicker: "DEPLOYMENT",
    value: "3",
    unit: "fabs",
    label: "Real-time multimodal system deployed worldwide",
    source: "MARIE · Intel Labs",
  },
  {
    id: "recall",
    kicker: "LATEST RESEARCH",
    value: "0.3→20.1",
    unit: "%",
    label: "Recall in heavy darkness with RGB–sonar fusion",
    source: "Under review · RGB–sonar fusion",
  },
  {
    id: "papers",
    kicker: "PUBLICATIONS",
    value: "6",
    unit: "papers",
    label: "Journal, IEEE conference and workshop work",
    source: "EAAI · CoDIT · NeurIPS WS · SIGIR WS",
  },
];
