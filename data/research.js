/**
 * The directions section, placed after the CV: for each area, what the work
 * above has already done and what comes next. `done` must stay traceable to a
 * project card or publication; `next` is stated as intent, not as a result.
 */

export const researchDirections = [
  {
    id: "multimodal-perception",
    number: "01",
    title: "Multimodal perception",
    done:
      "RGB–sonar fusion that keeps an AUV detecting objects in darkness and turbidity; multimodal action recognition deployed in three fabs; stereo perception on a field UGV.",
    next:
      "Perception that estimates how far to trust each sensor, across RGB, depth, sonar and audio, and passes that confidence on to the planner.",
  },
  {
    id: "safe-planning",
    number: "02",
    title: "Safe planning and navigation",
    done:
      "MPC with control-barrier-function safety filters for AUV navigation among moving obstacles; CBF-guided diffusion planning, at an exploratory stage.",
    next:
      "Decentralized multi-agent navigation, and planners that act directly on perceived, uncertain scenes.",
  },
  {
    id: "world-models",
    number: "03",
    title: "World models for planning",
    done: "No published work yet; the diffusion planner is the nearest groundwork.",
    next:
      "Predictive latent representations of the world, grounded in multimodal perception, that a planner can act on.",
  },
];
