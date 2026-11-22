/**
 * Spanish text for the data in data/*.js.
 *
 * Only translated fields live here, keyed by the same ids as the English
 * entries; lib/content.js merges them over the English data, so links,
 * numbers, figures and ordering are defined once, in the English files.
 *
 * Style: formal, impersonal Latin American technical Spanish. Established
 * acronyms stay as published (AUV, UGV, MPC, CBF, FLS, LfD, HITL, RGB, ROS 2),
 * as does "recall"; official job titles stay in English. Terminology used
 * throughout: sonar de visión frontal (FLS), acimut, puntos de ruta, guiado
 * (diffusion guidance), planificación, planta (semiconductor fab), hilera /
 * surco (field rows / furrow), vuelo estacionario, vista cenital.
 */
import ladder from "./figures/fusionLadder.json";
import waypoint from "./figures/waypointStats.json";

export const site = {
  title: "Gesem Mejia - Percepción robótica para la toma de decisiones",
  description:
    "Gesem Mejia, investigador doctoral en RIT: percepción robótica para la toma de decisiones, fusión multimodal de sensores (RGB, profundidad, sonar y audio) y planificación basada en percepción. Anteriormente en Intel Labs.",
  location: "Rochester, NY, EE. UU.",
  disciplines: "PERCEPCIÓN ROBÓTICA PARA LA TOMA DE DECISIONES",
};

export const availability = {
  short: "Disponible para estancias de investigación doctoral",
  long: "En busca de estancias de investigación (internships) durante el doctorado, en percepción robótica para navegación, planificación o modelos del mundo.",
};

export const navigation = {
  about: "Perfil",
  work: "Proyectos",
  publications: "Publicaciones",
  experience: "CV",
  directions: "Líneas de trabajo",
};

export const contactLink = { label: "Contacto" };

const interests = ["percepción y planificación robótica", "fusión de sensores", "modelos del mundo"];

export const heroTyping = {
  prompt: "> investigando ",
  phrases: interests.map((interest) => `${interest}.`),
  sentence: `Investigando ${interests.slice(0, -1).join(", ")} y ${interests.at(-1)}.`,
};

export const highlights = {
  years: { kicker: "EXPERIENCIA", unit: "años", label: "Integrando percepción en robots reales" },
  fabs: { kicker: "DESPLIEGUE", unit: "plantas", label: "Sistema multimodal en tiempo real, en operación a nivel mundial" },
  recall: {
    kicker: "INVESTIGACIÓN RECIENTE",
    label: "Recall en oscuridad intensa con fusión RGB–sonar",
    source: "En revisión · fusión RGB–sonar",
  },
  papers: { kicker: "PUBLICACIONES", unit: "artículos", label: "Revista, congresos IEEE y talleres" },
};

export const projects = {
  "sonar-fusion": {
    category: "PERCEPCIÓN MULTIMODAL",
    title: "Fusión RGB–sonar ante la degradación de la cámara",
    abstract:
      "Bajo el agua, la cámara falla justo cuando un AUV más necesita ver. Este detector fusiona RGB y sonar de visión frontal (FLS), y pondera cada modalidad según la degradación de la imagen: prioriza el sonar en oscuridad o turbidez, y la cámara en agua clara. Los objetos que la cámara pierde se recuperan del sonar y se proyectan en la imagen como zonas probables, pues el sonar mide acimut y distancia, no elevación.",
    tags: ["RGB + FLS", "Fusión adaptativa", "Detección de objetos", "AUV"],
    keyStats: [
      { label: "de recall en oscuridad intensa (0.3% solo con cámara)" },
      { label: "de recall medio con imagen degradada" },
      { value: "Sin pérdida", label: "de desempeño en agua clara" },
    ],
    visualLabel: "01 / UN INSTANTE, DOS SENSORES · INTERACTIVO",
    visualNote: `Fotograma de prueba real · detecciones del propio modelo (semilla ${ladder.seed}) · en revisión`,
    context: "KAS Lab · RIT / 2026 · en revisión",
  },
  auv: {
    category: "AUTONOMÍA SEGURA",
    title: "Navegación segura de un AUV entre obstáculos móviles",
    abstract:
      "Un controlador predictivo (MPC) sigue puntos de ruta con el modelo de Fossen de 4 GDL de un BlueROV2, y un filtro de seguridad basado en CBF verifica cada comando y, si es necesario, lo sustituye por el comando seguro más cercano, con un margen según la aceleración máxima de cada obstáculo. Evaluado en ROS 2 / Gazebo; la animación reproduce el controlador en una simulación 2D en Python. Una extensión multiagente está en desarrollo.",
    tags: ["MPC + CBF", "ROS 2 / Gazebo", "Modelo de Fossen, 4 GDL", "BlueROV2"],
    keyStats: [
      { label: "recorridos en Gazebo completados" },
      { label: "colisiones o violaciones del margen de seguridad" },
      { label: `distancia mínima, frente a contacto a ${waypoint.contactDistance} m` },
    ],
    visualLabel: "02 / SIMULACIÓN · VISTA CENITAL",
    visualNote: "Simulación en Python · AUV con modelo de Fossen de 4 GDL a profundidad constante · velocidad 3×",
    context: "KAS Lab · RIT / 2026 · en curso · simulación",
  },
  diffusion: {
    category: "PLANIFICACIÓN GENERATIVA · EXPLORATORIO",
    title: "Planificación por difusión guiada por CBF",
    abstract:
      "Una U-Net 1D (DDPM) genera secuencias de control de 8 s para un AUV, integradas en una versión diferenciable del modelo de Fossen de 4 GDL. Entrenado solo con trayectorias de MPC sin obstáculos, el modelo se guía al muestrear con una CBF basada en la distancia de frenado y evita obstáculos nunca vistos, sin reentrenamiento. En un primer escenario, todas las muestras guiadas evitan el obstáculo; las estadísticas de colisión están pendientes.",
    tags: ["Difusión (DDPM)", "Guiado por CBF", "PyTorch", "Modelo de Fossen"],
    keyStats: [
      { label: "de horizonte por plan, en 80 pasos" },
      { label: "obstáculos en el entrenamiento; la CBF guía el muestreo" },
      { label: "error mediano en metas no vistas (condicionado a la meta)" },
    ],
    visualLabel: "03 / CÓMO FUNCIONA",
    visualNote: "Ilustración conceptual · no son datos experimentales",
    context: "KAS Lab · RIT / 2026 · exploratorio",
  },
  marie: {
    category: "APRENDIZAJE MULTIMODAL · EN OPERACIÓN",
    title: "MARIE: reconocimiento multimodal de actividades",
    abstract:
      "MARIE (Multimodal Activity Recognition in an Industrial Environment) es un sistema de apoyo al desempeño basado en IA que guía a los técnicos en procedimientos de varios pasos. Combina reconocimiento multimodal de acciones en tiempo real con aprendizaje por demostración, con el humano en el lazo, para mejorar con el uso. Arquitectura completa a cargo, con interfaces de explicabilidad y de voz multilingüe, y despliegue en tres plantas.",
    tags: ["Multimodal", "Reconocimiento de acciones", "LfD", "HITL"],
    keyStats: [
      { label: "plantas en operación en el mundo" },
      { label: "técnicos en estudios de usuario iterativos" },
      { label: "publicaciones derivadas del trabajo" },
    ],
    visualLabel: "04 / DE LA DEMOSTRACIÓN A LA ASISTENCIA",
    visualNote: "Ilustración conceptual · procedimiento genérico, sin datos de Intel",
    context: "Intel Labs / 2021–2026 · en operación",
    linkLabel: "Leer artículo",
  },
  rover: {
    category: "ROBÓTICA DE CAMPO",
    title: "Detección de fresas y mapeo 3D del cultivo",
    abstract:
      "Un vehículo terrestre autónomo (UGV) que mapea en 3D un cultivo de fresas en producción. El color en el espacio CIE-Lab genera propuestas de región, una MobileNetV2 a bordo de una Jetson AGX Xavier descarta falsos positivos, el canal R estima la madurez en tres niveles y la cámara estéreo ZED Mini localiza cada fruto en 3D. El mapa revela el estado del cultivo y zonas de maduración desigual asociadas a deficiencias nutricionales, plagas o fallas de riego.",
    tags: ["UGV", "CIE-Lab", "MobileNetV2", "Estéreo ZED Mini"],
    keyStats: [
      { label: "de 272 fresas de prueba bien detectadas y clasificadas" },
      { label: "maduras localizadas en campo, frente a 14 (método de 2022)" },
      { label: "a bordo, en una Jetson AGX Xavier" },
    ],
    visualLabel: "05 / DEL CAMPO AL MAPA",
    visualNote: "Ilustración conceptual · resultados del artículo publicado",
    context: "CIO / 2019–2021 · EAAI 2023",
    linkLabel: "Leer artículo de revista",
  },
  uav: {
    category: "ROBÓTICA AÉREA",
    title: "Seguimiento de personas a bordo de un cuadricóptero",
    abstract:
      "Un cuadricóptero autónomo para el seguimiento de personas, orientado a aplicaciones como la vigilancia. A bordo de una Jetson TX2, un clasificador en cascada de Haar detecta el torso y otro busca el rostro solo en esa región. La posición del rostro en la imagen define los comandos de alabeo y empuje, y el ancho del recuadro, el cabeceo hacia adelante; todo se envía por MAVLink al controlador de vuelo (ArduCopter). Validado en vuelos en exteriores.",
    tags: ["Cascadas de Haar", "Jetson TX2", "DroneKit / MAVLink", "ArduCopter"],
    keyStats: [
      { label: "detecciones falsas de torso y rostro en vuelo" },
      { value: "2 etapas", label: "de detección: primero el torso, luego el rostro" },
      { label: "entre la detección y la respuesta del vehículo" },
    ],
    visualLabel: "06 / DETECTAR → CENTRAR → SEGUIR",
    visualNote: "Ilustración conceptual · lógica de control del artículo publicado",
    linkLabel: "Leer artículo de congreso",
  },
};

export const publicationNote = "Publicaciones firmadas como G. Mejia, G. G. Mejia y G. Gudino.";

export const publications = {
  p6: { venue: "Manuscrito enviado a congreso", status: "EN REVISIÓN" },
};

export const education = {
  "rit-phd": {
    period: "MAYO 2026 — ACTUAL",
    degree: "Doctorado · Ingeniería Eléctrica y de Computación",
    note: "Financiamiento completo como asistente de investigación de posgrado",
  },
  "cio-msc": {
    degree: "Maestría · Mecatrónica",
    note: "Especialización en planificación de trayectorias para robótica",
  },
  "utl-beng": {
    degree: "Ingeniería · Mecatrónica",
    note: "Formación complementaria en Óptica",
  },
};

export const timeline = {
  "kas-lab": {
    period: "2026 — ACTUAL",
    role: "Graduate Research Assistant · Asesor: Prof. Mohammad Javad Khojasteh",
    description:
      "Percepción robusta ante la degradación de sensores en AUVs: un detector que fusiona RGB y sonar de visión frontal para que el robot siga detectando objetos cuando la cámara falla. En curso: MPC con un filtro de seguridad basado en funciones de barrera de control para navegar entre obstáculos móviles.",
  },
  "intel-labs": {
    period: "OCT 2021 — ABR 2026",
    description:
      "Arquitectura de MARIE, un sistema multimodal de reconocimiento de acciones en tiempo real que aprende de demostraciones de expertos, desplegado en tres plantas. Percepción con nubes de puntos en C++/ROS y estimación de pose de 6 GDL para Kidspace.",
  },
  "cio-msc-research": {
    organization: "Laboratorio de Percepción y Robótica · CIO",
    role: "Investigador de maestría",
    description:
      "Aprendizaje por refuerzo profundo para la evasión de obstáculos en manipulación pick-and-place de 6 GDL y para la navegación de UAVs en entornos desconocidos; un rover con cámara estéreo sobre NVIDIA Jetson para detectar fresas y estimar su madurez.",
  },
  "cio-undergraduate": {
    organization: "Laboratorio de Percepción y Robótica · CIO",
    role: "Asistente de investigación (licenciatura)",
    description:
      "Detección de rostros en tiempo real y control para el seguimiento de personas, validados en vuelo con un cuadricóptero real.",
  },
};

export const skills = {
  perception: {
    group: "Percepción",
    items: [
      "Fusión multimodal de sensores (RGB, profundidad, sonar y audio)",
      "Detección y seguimiento de objetos",
      "Procesamiento de nubes de puntos",
      "Estimación de pose de 6 GDL",
      "Visión estéreo / RGB-D",
      "OpenCV",
    ],
  },
  learning: {
    group: "Aprendizaje, planificación y control",
    items: [
      "PyTorch",
      "TensorFlow",
      "CUDA",
      "Aprendizaje autosupervisado",
      "Aprendizaje por refuerzo profundo",
      "MPC",
      "Funciones de barrera de control",
      "Planificación de trayectorias",
    ],
  },
  robotics: { group: "Robótica y simulación" },
  hardware: {
    group: "Sensores y hardware",
    items: ["NVIDIA Jetson", "Cámaras estéreo y de profundidad", "Sonar de visión frontal", "LiDAR"],
  },
  languages: { group: "Lenguajes y herramientas" },
};

export const researchDirections = {
  "multimodal-perception": {
    title: "Percepción multimodal",
    done:
      "Fusión RGB–sonar que mantiene la detección de objetos de un AUV en oscuridad y turbidez; reconocimiento multimodal de acciones en operación en tres plantas; percepción estéreo en un UGV de campo.",
    next:
      "Percepción capaz de estimar la confiabilidad de cada sensor (RGB, profundidad, sonar y audio) y de transmitir esa incertidumbre al planificador.",
  },
  "safe-planning": {
    title: "Planificación y navegación seguras",
    done:
      "MPC con filtros de seguridad basados en funciones de barrera de control para navegar entre obstáculos móviles; planificación por difusión guiada por CBF, en fase exploratoria.",
    next:
      "Navegación multiagente descentralizada y planificadores que operen directamente sobre escenas percibidas con incertidumbre.",
  },
  "world-models": {
    title: "Modelos del mundo para planificación",
    done: "Aún sin trabajo publicado; el planificador por difusión es el antecedente más cercano.",
    next:
      "Representaciones latentes predictivas del entorno, sustentadas en percepción multimodal, sobre las que un planificador pueda actuar.",
  },
};
