/**
 * Selected work.
 *
 * Content mirrors content/profile.json from the original source. `visual` picks
 * the diagram a card renders: "navigation" draws the path SVG, "flow" draws the
 * observation-to-output chain, and a flow card's `theme` selects the palette
 * variant defined in Work.module.css. Everything from `context` down is what the
 * "Behind the project" expander shows.
 */

export const projects = [
  {
    id: "auv",
    number: "01",
    category: "SAFE AUTONOMY",
    title: "Safe navigation, below the surface.",
    summary:
      "Combining predictive control and safety constraints to navigate underwater, even when the model is uncertain.",
    tags: ["MPC + CBF", "ROS 2", "Fossen dynamics"],
    visual: "navigation",
    visualLabel: "01 / SAFETY-CONSTRAINED NAVIGATION",
    visualNote: "Conceptual path · not experimental data",
    // Shown by the expander
    context: "KAS Lab · RIT / 2026–present",
    shortTitle: "Multi-agent AUV navigation",
    detail:
      "An MPC guidance layer with a control barrier function safety filter on a 4-DoF Fossen model. The work studies multi-agent hovering AUV navigation under model uncertainty.",
    evidence:
      "Simulation validation reported in my CV: 3,000 decentralized transit legs and 300 adversarial pursuit trials in ROS 2 / Gazebo. Manuscript in preparation; these are not physical deployment results.",
  },
  {
    id: "marie",
    number: "02",
    category: "MULTIMODAL LEARNING",
    title: "Learning from the people who know.",
    summary:
      "From expert demonstrations to real-time guidance for semiconductor technicians. Multimodal AI, designed around people.",
    tags: ["Learning from demonstration", "RGB-D + Audio", "Human-in-the-loop"],
    visual: "flow",
    visualLabel: "02 / HUMAN-IN-THE-LOOP LEARNING",
    flow: {
      input: "EXPERT DEMONSTRATION",
      nodes: ["RGB-D", "Audio", "Process spec"],
      output: "Multimodal action model",
      foot: "TECHNICIAN GUIDANCE",
    },
    // Shown by the expander
    context: "Intel Labs / 2021–2026",
    shortTitle: "MARIE at Intel Labs",
    detail:
      "I architected the learning-from-demonstration system, synchronized depth-camera and directional-microphone streams, and built multilingual voice and explainability interfaces. Human-in-the-loop labeling grounded action models in written process specifications.",
    evidence:
      "Deployed across three fabs worldwide. Iterative studies with more than 100 technicians informed design decisions and the associated research.",
    link: "https://doi.org/10.48550/arXiv.2211.01824",
    linkLabel: "Read related paper",
  },
  {
    id: "rover",
    number: "03",
    category: "ROBOT PERCEPTION",
    title: "Seeing what’s ready to grow.",
    summary:
      "Onboard perception for strawberry localization and ripeness estimation under real compute constraints.",
    tags: ["NVIDIA Jetson", "MobileNetV2", "Stereo vision"],
    visual: "flow",
    theme: "rover",
    visualLabel: "03 / ONBOARD PERCEPTION",
    flow: {
      input: "STEREO OBSERVATIONS",
      nodes: ["Vision", "Color", "Geometry"],
      output: "Localization + ripeness",
      foot: "NVIDIA JETSON / ONBOARD",
    },
    // Shown by the expander
    context: "Robotics & Perception Lab · CIO / 2019–2021",
    shortTitle: "Autonomous strawberry rover",
    detail:
      "I built a stereo-camera rover running a fine-tuned MobileNetV2 on NVIDIA Jetson and benchmarked vision-only against hybrid vision-color detection for strawberry localization and ripeness estimation.",
    evidence:
      "Published in Engineering Applications of Artificial Intelligence, volume 119, article 105810 (2023).",
    link: "https://doi.org/10.1016/j.engappai.2022.105810",
    linkLabel: "Read journal paper",
  },
  {
    id: "uav",
    number: "04",
    category: "AERIAL ROBOTICS",
    title: "Perception that takes flight.",
    summary:
      "Real-time visual detection and person-following control, tested on physical quad-rotor platforms.",
    tags: ["Computer vision", "Tracking", "Flight testing"],
    visual: "flow",
    theme: "uav",
    visualLabel: "04 / PERCEPTION → CONTROL",
    flow: {
      input: "CAMERA OBSERVATIONS",
      nodes: ["Detect", "Track", "Follow"],
      output: "Visual feedback control",
      foot: "PHYSICAL QUAD-ROTOR TESTS",
    },
    // Shown by the expander
    context: "Undergraduate research · CIO / 2017–2019",
    shortTitle: "UAV detection & person tracking",
    detail:
      "I developed and flight-tested real-time face detection and person-following control on quad-rotor UAVs. The related publication examines object recognition and tracking with Haar-like feature cascade classifiers.",
    evidence:
      "Presented at the 8th International Conference on Control, Decision and Information Technologies (CoDIT), 2022.",
    link: "https://doi.org/10.1109/CoDIT55151.2022.9803981",
    linkLabel: "Read conference paper",
  },
];
