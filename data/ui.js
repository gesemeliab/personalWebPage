/**
 * Interface text: section headings, buttons, labels and accessible names.
 * One entry per language; every language must define every key.
 * Strings inside the project animations live with each animation.
 */

export const ui = {
  en: {
    skip: "Skip to content",
    homeLabel: (name) => `${name}, home`,
    newTab: "(opens in a new tab)",
    nav: {
      label: "Main navigation",
      open: "Open navigation",
      close: "Close navigation",
      switchLang: "ES",
      switchLangLabel: "Leer en español",
    },
    hero: {
      hello: "Hello, I’m",
      description:
        "Robot perception for decision-making: turning RGB, depth, sonar and audio into representations robots can plan and act on.",
      phd: "Ph.D. student at",
      previously: "Previously 4.5 years at Intel Labs",
      explore: "Explore the work",
      footnote: "FROM SENSORS TO DECISIONS",
      scroll: "SCROLL TO EXPLORE",
      artFig: "FIG. 001",
      artTriad: "PERCEIVE / PREDICT / ACT",
      artConcept: "CONCEPTUAL ILLUSTRATION",
      artAlt:
        "Conceptual visualisation of robot planning: a committed trajectory and alternative candidate paths threading between clusters of occupied voxels",
    },
    about: {
      label: "01 / ABOUT",
      caption: "A LITTLE CONTEXT",
      heading: ["Curious by nature.", "Hands-on by design."],
      lead:
        "Robot perception for decision-making: turning multimodal sensor data into representations of the world that robots can act on for navigation and planning.",
      body: [
        "Ph.D. student in Electrical and Computer Engineering at Rochester Institute of Technology and Graduate Research Assistant in KAS Lab, advised by Prof. Mohammad Javad Khojasteh. Current research focuses on perception that withstands sensor degradation on underwater robots, fusing camera and sonar so that an AUV keeps perceiving its surroundings as visibility drops. Broader interests include world models (JEPA), diffusion models for planning, and MPC driven by learned perception.",
        "Nine years of experience deploying perception on physical robots: quad-rotors, field rovers and AUVs. Previously, four and a half years at Intel Labs, architecting a real-time multimodal perception system taken from research prototype to deployment in three semiconductor fabs worldwide.",
      ],
      email: "Email",
    },
    work: {
      label: "02 / SELECTED WORK",
      caption: "RESEARCH IN PRACTICE",
      heading: ["From sensors", "to decisions."],
      description: ["Robot perception underwater, on the ground,", "in the air, and in the fab."],
    },
    publications: {
      label: "03 / PUBLICATIONS",
      caption: "SHARING THE WORK",
      heading: "Written & published.",
      read: (title) => `Read ${title}`,
    },
    experience: {
      label: "04 / EXPERIENCE & EDUCATION",
      caption: "THE PATH SO FAR",
      heading: ["From building", "to understanding."],
      intro:
        "Nine years of putting perception on physical robots and into deployment, from a quadrotor to semiconductor fabs to AUVs.",
      education: "EDUCATION",
      toolbox: "IN MY TOOLBOX",
    },
    directions: {
      label: "05 / DIRECTIONS",
      caption: "DONE SO FAR, AND NEXT",
      heading: "Where the work is headed.",
      description: "Each direction starts from the work above.",
      area: "AREA",
      done: "SO FAR",
      next: "NEXT",
    },
    contact: {
      label: "06 / GET IN TOUCH",
      caption: "LET’S BUILD SOMETHING MEANINGFUL",
      kicker: "Have a question, an idea, or a research opportunity?",
      heading: "Let’s connect",
      footerNote: "ALWAYS LEARNING.",
      backToTop: "Back to top",
    },
    playback: { restart: "Restart animation", play: "Play animation", pause: "Pause animation" },
  },

  es: {
    skip: "Ir al contenido",
    homeLabel: (name) => `${name}, inicio`,
    newTab: "(se abre en una pestaña nueva)",
    nav: {
      label: "Navegación principal",
      open: "Abrir el menú",
      close: "Cerrar el menú",
      switchLang: "EN",
      switchLangLabel: "Read in English",
    },
    hero: {
      hello: "Hola, soy",
      description:
        "Percepción robótica para la toma de decisiones: convertir datos RGB, de profundidad, sonar y audio en representaciones que permitan a los robots planificar y actuar.",
      phd: "Estudiante de doctorado en",
      previously: "Anteriormente, 4.5 años en Intel Labs",
      explore: "Ver los proyectos",
      footnote: "DE LOS SENSORES A LAS DECISIONES",
      scroll: "SEGUIR LEYENDO",
      artFig: "FIG. 001",
      artTriad: "PERCIBIR / PREDECIR / ACTUAR",
      artConcept: "ILUSTRACIÓN CONCEPTUAL",
      artAlt:
        "Visualización conceptual de la planificación robótica: una trayectoria elegida y varias trayectorias candidatas que pasan entre grupos de vóxeles ocupados",
    },
    about: {
      label: "01 / PERFIL",
      caption: "UN POCO DE CONTEXTO",
      heading: ["Curiosidad por naturaleza.", "Rigor en la práctica."],
      lead:
        "Percepción robótica para la toma de decisiones: convertir datos multimodales de sensores en representaciones del entorno que los robots puedan usar para navegar y planificar.",
      body: [
        "Estudiante de doctorado en Ingeniería Eléctrica y de Computación en el Rochester Institute of Technology y asistente de investigación de posgrado en el KAS Lab, bajo la dirección del Prof. Mohammad Javad Khojasteh. La investigación actual se centra en una percepción robusta ante la degradación de los sensores en robots submarinos: la fusión de cámara y sonar permite que un AUV siga percibiendo su entorno cuando la visibilidad disminuye. Otros intereses incluyen los modelos del mundo (JEPA), los modelos de difusión para planificación y el MPC basado en percepción aprendida.",
        "Nueve años de experiencia integrando percepción en robots reales: cuadricópteros, rovers de campo y AUVs. Anteriormente, cuatro años y medio en Intel Labs a cargo de la arquitectura de un sistema de percepción multimodal en tiempo real, llevado de prototipo de investigación a operación en tres plantas de fabricación de semiconductores en el mundo.",
      ],
      email: "Correo",
    },
    work: {
      label: "02 / PROYECTOS DESTACADOS",
      caption: "INVESTIGACIÓN APLICADA",
      heading: ["De los sensores", "a las decisiones."],
      description: ["Percepción robótica bajo el agua, en tierra,", "en el aire y en la planta."],
    },
    publications: {
      label: "03 / PUBLICACIONES",
      caption: "DIFUSIÓN DEL TRABAJO",
      heading: "Investigación publicada.",
      read: (title) => `Leer «${title}»`,
    },
    experience: {
      label: "04 / EXPERIENCIA Y FORMACIÓN",
      caption: "TRAYECTORIA",
      heading: ["De construir", "a comprender."],
      intro:
        "Nueve años integrando percepción en robots reales y llevándola a operación: de un cuadricóptero a plantas de semiconductores y AUVs.",
      education: "FORMACIÓN",
      toolbox: "HERRAMIENTAS",
    },
    directions: {
      label: "05 / LÍNEAS DE TRABAJO",
      caption: "LO REALIZADO Y LO QUE SIGUE",
      heading: "Hacia dónde avanza el trabajo.",
      description: "Cada línea se apoya en los proyectos anteriores.",
      area: "ÁREA",
      done: "LO REALIZADO",
      next: "LO QUE SIGUE",
    },
    contact: {
      label: "06 / CONTACTO",
      caption: "CONSTRUYAMOS ALGO QUE IMPORTE",
      kicker: "¿Una pregunta, una idea o una oportunidad de investigación?",
      heading: "Hablemos",
      footerNote: "SIEMPRE APRENDIENDO.",
      backToTop: "Volver arriba",
    },
    playback: { restart: "Reiniciar animación", play: "Reproducir animación", pause: "Pausar animación" },
  },
};
