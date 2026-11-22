/**
 * Publications, newest first.
 *
 * An entry without a `href` renders its `status` badge (default "DRAFT")
 * instead of a link. Any of the names in `selfNames` is set in bold wherever it
 * appears in an author list.
 */

export const publicationNote = "Published under G. Mejia, G. G. Mejia, and G. Gudino.";

export const selfNames = ["G. G. Mejia", "G. Mejia", "G. Gudino"];

export const publications = [
  {
    id: "p6",
    year: "2026",
    title: "Sound Advice: Vision-Language-Conditioned RGB-Sonar Fusion under Camera Degradation",
    authors: "G. Mejia, A. Acharya, K. Abaid, M. Chaickowsky, and M. J. Khojasteh",
    venue: "Conference submission",
    status: "UNDER REVIEW",
  },
  {
    id: "p1",
    year: "2024",
    title:
      "QA-toolbox: Conversational question-answering for process task guidance in manufacturing",
    authors:
      "R. Manuvinakurike, E. Watkins, C. Savur, A. Rhodes, S. Biswas, G. G. Mejia, R. Beckwith, S. Sahay, G. Raffa, and L. Nachman",
    venue: "NeurIPS SFLLM Workshop",
    href: "https://doi.org/10.48550/arXiv.2412.02638",
  },
  {
    id: "p2",
    year: "2023",
    title: "Strawberry localization in a ridge planting with an autonomous rover",
    authors: "G. Mejia, A. M. Montes de Oca, and G. Flores",
    venue: "Engineering Applications of Artificial Intelligence · 119, 105810",
    href: "https://doi.org/10.1016/j.engappai.2022.105810",
  },
  {
    id: "p3",
    year: "2023",
    title:
      "An explainable AI user interface for facilitating collaboration between domain experts and AI researchers",
    authors:
      "M. Shi, C. Savur, E. Watkins, R. Manuvinakurike, G. Gudino, R. Beckwith, and G. Raffa",
    venue: "XAI · Late Breaking Work, Demos, Doctoral Consortium",
    href: "https://ceur-ws.org/Vol-3554/paper20.pdf",
  },
  {
    id: "p4",
    year: "2022",
    title:
      "Object recognition and tracking using Haar-like features cascade classifiers: Application to a quad-rotor UAV",
    authors: "L. Arreola, G. Gudino, and G. Flores",
    venue: "IEEE CoDIT · 45–50",
    href: "https://doi.org/10.1109/CoDIT55151.2022.9803981",
  },
  {
    id: "p5",
    year: "2022",
    title:
      "Human in the loop approaches in multi-modal conversational task guidance system development",
    authors:
      "R. Manuvinakurike, S. Biswas, G. Raffa, R. Beckwith, A. Rhodes, M. Shi, G. Mejia, et al.",
    venue: "SCAI Workshop at SIGIR",
    href: "https://doi.org/10.48550/arXiv.2211.01824",
  },
];
