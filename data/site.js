/** Identity, contact details and the primary navigation. */

export const site = {
  name: "Gesem Mejia",
  fullName: "Gesem Eliab Gudino Mejia",
  title: "Gesem Mejia - Robotics & Embodied Intelligence",
  description:
    "Gesem Mejia's robotics, robot learning, safe autonomy, and embodied intelligence portfolio.",
  location: "Rochester, NY",
  coordinates: "ROCHESTER, NY · 43.16° N",
  disciplines: "ROBOTICS / LEARNING / CONTROL",
  email: "gg2673@rit.edu",
  portrait: "/images/portrait.jpg",
};

export const profiles = {
  scholar: "https://scholar.google.com/citations?hl=es&user=b63J0MYAAAAJ",
  linkedin: "https://www.linkedin.com/in/gesem-mejia-3b07b7127/",
};

export const navigation = [
  { id: "about", label: "About" },
  { id: "research", label: "Research" },
  { id: "work", label: "Selected work" },
  { id: "publications", label: "Publications" },
  { id: "experience", label: "CV" },
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
const interests = ["robot learning", "safe autonomy", "world models"];

export const heroTyping = {
  prompt: "> researching ",
  // Typed with the full stop, so each phrase reads as a finished sentence
  // before it is erased: "> researching world models._"
  phrases: interests.map((interest) => `${interest}.`),
  sentence: `Researching ${interests.slice(0, -1).join(", ")}, and ${interests.at(-1)}.`,
};
