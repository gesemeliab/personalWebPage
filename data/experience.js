/** Education, career timeline and the skills listed under the experience section. */

export const education = [
  {
    id: "rit-phd",
    period: "MAY 2026 — PRESENT",
    degree: "Ph.D. · Electrical & Computer Engineering",
    institution: "Rochester Institute of Technology",
    note: "Fully funded graduate research assistantship",
  },
  {
    id: "cio-msc",
    period: "2019 — 2021",
    degree: "M.Sc. · Mechatronics",
    institution: "Centro de Investigaciones en Óptica",
    note: "Specialization in path planning for robotics",
  },
  {
    id: "utl-beng",
    period: "2015 — 2019",
    degree: "B.Eng. · Mechatronics",
    institution: "Universidad Tecnológica de León",
    note: "Minor in Optics",
  },
];

export const timeline = [
  {
    id: "kas-lab",
    period: "2026 — PRESENT",
    organization: "KAS Lab · Rochester Institute of Technology",
    role: "Graduate Research Assistant · Advisor: Prof. Mohammad Javad Khojasteh",
    description:
      "Perception under sensor degradation for AUVs: an RGB–forward-looking-sonar fusion detector that keeps the robot seeing when the camera fails. Ongoing: MPC with a control-barrier-function safety filter for AUV navigation among moving obstacles.",
  },
  {
    id: "intel-labs",
    period: "OCT 2021 — APR 2026",
    organization: "Intel Labs · Intelligent Systems Research Lab",
    role: "Software Research Engineer / Scientist",
    description:
      "Architected MARIE, a real-time multimodal action-recognition system learned from expert demonstrations and deployed across three fabs. Built C++ ROS point-cloud perception and 6-DoF pose estimation for Kidspace.",
  },
  {
    id: "cio-msc-research",
    period: "2019 — 2021",
    organization: "Robotics & Perception Lab · CIO",
    role: "M.Sc. Researcher",
    description:
      "Deep RL for obstacle avoidance in 6-DoF pick-and-place and UAV navigation in unknown environments; a stereo-camera rover on NVIDIA Jetson for strawberry detection and ripeness estimation.",
  },
  {
    id: "cio-undergraduate",
    period: "2017 — 2019",
    organization: "Robotics & Perception Lab · CIO",
    role: "Undergraduate Research Assistant",
    description:
      "Real-time face detection and person-following control, flight-tested on a physical quad-rotor UAV.",
  },
];

/** Grouped exactly as on the CV, so the page and the PDF agree. */
export const skills = [
  {
    id: "perception",
    group: "Perception",
    items: [
      "Multimodal sensor fusion (RGB, depth, sonar, audio)",
      "Object detection & tracking",
      "Point-cloud processing",
      "6-DoF pose estimation",
      "Stereo / RGB-D",
      "OpenCV",
    ],
  },
  {
    id: "learning",
    group: "Learning, planning & control",
    items: [
      "PyTorch",
      "TensorFlow",
      "CUDA",
      "Self-supervised learning",
      "Deep RL",
      "MPC",
      "Control barrier functions",
      "Path planning",
    ],
  },
  {
    id: "robotics",
    group: "Robotics & simulation",
    items: ["ROS / ROS 2", "Gazebo", "MuJoCo", "PyBullet", "RViz", "Simulink"],
  },
  {
    id: "hardware",
    group: "Sensors & hardware",
    items: ["NVIDIA Jetson", "Stereo & depth cameras", "Forward-looking sonar", "LiDAR"],
  },
  {
    id: "languages",
    group: "Languages & tools",
    items: ["Python", "C/C++", "JavaScript", "Docker", "Kubernetes", "CI/CD", "FastAPI", "Qt"],
  },
];
