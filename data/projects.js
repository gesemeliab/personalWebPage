/**
 * Selected work.
 *
 * `visual` picks the diagram a card renders:
 *   "fusion"     - sensor inputs plus a bar chart of `results` (reported numbers)
 *   "navigation" - the conceptual path SVG
 *   "flow"       - the observation-to-output chain; `theme` selects a palette
 *                  variant defined in Work.module.css
 * `featured` cards span the full grid width with the visual beside the text.
 * Everything from `context` down is what the "Behind the project" expander shows.
 */

export const projects = [
  {
    id: "sonar-fusion",
    number: "01",
    featured: true,
    category: "MULTIMODAL PERCEPTION",
    title: "Seeing when the camera can’t.",
    summary:
      "An RGB–forward-looking-sonar fusion detector for AUVs that adapts how much it relies on each sensor to the visibility conditions, so the robot keeps seeing in darkness and turbidity, with no loss in clear water.",
    tags: ["RGB + FL sonar", "Adaptive fusion", "Object detection", "AUV"],
    visual: "fusion",
    visualLabel: "01 / VISIBILITY-ADAPTIVE FUSION",
    fusion: {
      inputs: [
        { id: "rgb", label: "RGB", note: "degrades" },
        { id: "sonar", label: "FL SONAR", note: "robust" },
      ],
      gate: "Visibility-conditioned weighting",
      output: "Detections",
    },
    results: {
      title: "RECALL · HEAVY DARKNESS",
      rows: [
        { label: "RGB only", value: 0.3 },
        { label: "RGB + sonar", value: 20.1, highlight: true },
      ],
      footnote: "53.6% mean recall on degraded imagery",
    },
    visualNote: "Reported results · manuscript under review",
    // Shown by the expander
    context: "KAS Lab · RIT / 2026–present",
    shortTitle: "Sound Advice: RGB–sonar fusion under camera degradation",
    detail:
      "Cameras fail underwater in exactly the conditions where an AUV most needs to see. I built a fusion detector that conditions the contribution of each modality on how degraded the visual input is, leaning on forward-looking sonar as the camera fails and on RGB when the water is clear.",
    evidence:
      "Sonar fusion raises recall in heavy darkness from 0.3% to 20.1% and reaches 53.6% mean recall on degraded imagery, with no loss in clear water. Under review at IEEE/CVF CVPR 2027.",
  },
  {
    id: "auv",
    number: "02",
    category: "SAFE AUTONOMY",
    title: "Safe navigation, below the surface.",
    summary:
      "Predictive control with a safety filter, so multiple AUVs navigate safely even when the dynamics model is wrong.",
    tags: ["MPC + CBF", "ROS 2 / Gazebo", "Fossen dynamics"],
    visual: "navigation",
    visualLabel: "02 / SAFETY-CONSTRAINED NAVIGATION",
    visualNote: "Conceptual path · not experimental data",
    // Shown by the expander
    context: "KAS Lab · RIT / 2026–present · ongoing",
    shortTitle: "Multi-agent AUV navigation under model uncertainty",
    detail:
      "An MPC guidance layer with a control-barrier-function safety filter on the 4-DoF Fossen model, studying decentralized multi-agent AUV navigation under model uncertainty.",
    evidence:
      "Validated in ROS 2 / Gazebo simulation over 3,000 decentralized transit legs and 300 adversarial pursuit trials. Ongoing work; these are simulation results, not physical deployment.",
  },
  {
    id: "kidspace",
    number: "03",
    category: "3D PERCEPTION",
    title: "Objects, in six degrees of freedom.",
    summary:
      "Real-time RGB-D tracking of physical play props in an interactive learning space, from raw depth to 6-DoF pose.",
    tags: ["C++ / ROS", "Point clouds", "6-DoF pose", "Kinect2"],
    visual: "flow",
    theme: "depth",
    visualLabel: "03 / DEPTH → POSE",
    flow: {
      input: "KINECT2 DEPTH · POINT CLOUD",
      nodes: ["Segment", "Fit primitives", "Estimate pose"],
      output: "Tracked 6-DoF prop poses",
      foot: "REAL-TIME · C++ ROS NODES",
    },
    // Shown by the expander
    context: "Intel Labs / Kidspace",
    shortTitle: "RGB-D prop tracking for Kidspace",
    detail:
      "I wrote C++ ROS nodes for point-cloud segmentation, geometric primitive fitting and 6-DoF pose estimation from Kinect2 depth data, tracking the physical props children play with in an interactive learning environment.",
    evidence:
      "Ran in real time inside Intel Labs’ Kidspace interactive learning environment.",
  },
  {
    id: "marie",
    number: "04",
    featured: true,
    category: "MULTIMODAL LEARNING · DEPLOYED",
    title: "Learning from the people who know.",
    summary:
      "MARIE recognizes technician actions from RGB-D and audio in real time, learned from expert demonstrations, and guides novices through multi-step semiconductor procedures. Deployed across three fabs worldwide.",
    tags: ["Action recognition", "RGB-D + audio", "Learning from demonstration", "Human-in-the-loop"],
    visual: "flow",
    visualLabel: "04 / FROM DEMONSTRATION TO GUIDANCE",
    flow: {
      input: "EXPERT DEMONSTRATIONS",
      nodes: ["RGB-D", "Directional audio", "Process spec"],
      output: "Real-time action model",
      foot: "DEPLOYED · 3 FABS · 100+ TECHNICIANS",
    },
    // Shown by the expander
    context: "Intel Labs / Oct 2021 – Apr 2026",
    shortTitle: "MARIE: Multimodal Action Recognition in Industrial Environments",
    detail:
      "I architected the system end to end: a real-time perception stack synchronizing depth-camera and directional-microphone streams, parallelized to meet inference deadlines; a learning-from-demonstration pipeline with human-in-the-loop labeling grounded in a written process specification; an explainability interface that showed technicians what the model inferred; and a multilingual voice interface (VAD, distributed Whisper ASR, keyword spotting, TTS).",
    evidence:
      "Deployed across three fabs worldwide. I led the cross-site rollout, running iterative user studies with more than 100 technicians that fed design decisions and three publications.",
    link: "https://doi.org/10.48550/arXiv.2211.01824",
    linkLabel: "Read related paper",
  },
  {
    id: "rover",
    number: "05",
    category: "FIELD ROBOTICS",
    title: "Seeing what’s ready to grow.",
    summary:
      "Onboard perception for strawberry localization and ripeness estimation under real compute constraints.",
    tags: ["NVIDIA Jetson", "MobileNetV2", "Stereo vision"],
    visual: "flow",
    theme: "rover",
    visualLabel: "05 / ONBOARD PERCEPTION",
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
    number: "06",
    category: "AERIAL ROBOTICS",
    title: "Perception that takes flight.",
    summary:
      "Real-time visual detection and person-following control, flight-tested on physical quad-rotors.",
    tags: ["Detection", "Tracking", "Flight testing"],
    visual: "flow",
    theme: "uav",
    visualLabel: "06 / PERCEPTION → CONTROL",
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
