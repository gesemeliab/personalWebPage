/**
 * Everything the page shows, in one language.
 *
 * English is the base: data/*.js. Spanish (data/es.js) holds only translated
 * fields, keyed by id, and is merged over the English entries here, so links,
 * numbers, figures and ordering stay defined once.
 */
import * as es from "@/data/es";
import { education, skills, timeline } from "@/data/experience";
import { projects } from "@/data/projects";
import { publicationNote, publications, selfNames } from "@/data/publications";
import { researchDirections } from "@/data/research";
import {
  availability,
  contactLink,
  heroTyping,
  highlights,
  navigation,
  profiles,
  site,
} from "@/data/site";
import { ui } from "@/data/ui";

export const LOCALES = ["en", "es"];
export const DEFAULT_LOCALE = "en";
export const SITE_URL = "https://www.gesem-mejia.com";

/** The page's path in a language: English at the root, Spanish under /es/. */
export const homePath = (lang) => (lang === DEFAULT_LOCALE ? "/" : `/${lang}/`);

/** Merge translated fields over a list of entries, matched by `id`. */
const byId = (list, overrides) => list.map((item) => ({ ...item, ...overrides[item.id] }));

/** Merge a translated project, including its key numbers matched by position. */
const project = (item, override = {}) => ({
  ...item,
  ...override,
  keyStats: item.keyStats?.map((stat, i) => ({ ...stat, ...override.keyStats?.[i] })),
});

const english = {
  lang: "en",
  site,
  profiles,
  availability,
  navigation,
  contactLink,
  heroTyping,
  highlights,
  projects,
  publications,
  publicationNote,
  selfNames,
  education,
  timeline,
  skills,
  researchDirections,
  ui: ui.en,
};

const spanish = {
  ...english,
  lang: "es",
  site: { ...site, ...es.site },
  availability: { ...availability, ...es.availability },
  navigation: navigation.map((item) => ({ ...item, label: es.navigation[item.id] ?? item.label })),
  contactLink: { ...contactLink, ...es.contactLink },
  heroTyping: es.heroTyping,
  highlights: byId(highlights, es.highlights),
  projects: projects.map((item) => project(item, es.projects[item.id])),
  publications: byId(publications, es.publications),
  publicationNote: es.publicationNote,
  education: byId(education, es.education),
  timeline: byId(timeline, es.timeline),
  skills: byId(skills, es.skills),
  researchDirections: byId(researchDirections, es.researchDirections),
  ui: ui.es,
};

const CONTENT = { en: english, es: spanish };

/** All page content for `lang` ("en" or "es"). */
export function getContent(lang = DEFAULT_LOCALE) {
  return CONTENT[lang] ?? english;
}
