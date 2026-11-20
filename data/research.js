/** The research directions listed in the research section. */

export const researchDirections = [
  {
    id: "multimodal-perception",
    number: "01 —",
    title: "Perception that degrades gracefully",
    description:
      "Fusing RGB, depth, sonar and audio so a robot keeps seeing when one sensor fails, by learning how much to trust each modality under the conditions it is in.",
    tags: "SENSOR FUSION / DETECTION / RGB-D / SONAR",
  },
  {
    id: "world-models",
    number: "02 —",
    title: "World models for planning",
    description:
      "Learning predictive latent representations of the world that a planner can act on, rather than reconstructing every pixel.",
    tags: "JEPA / DIFFUSION FOR PLANNING / SELF-SUPERVISION",
  },
  {
    id: "perception-driven-control",
    number: "03 —",
    title: "Perception-driven safe control",
    description:
      "Closing the loop from learned perception to action, with predictive control and safety filters that hold up under model uncertainty.",
    tags: "MPC / CONTROL BARRIER FUNCTIONS / NAVIGATION",
  },
];
