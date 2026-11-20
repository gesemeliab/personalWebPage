# Architecture

How this project is laid out and where new code belongs. For installing and
running the site, see the [README](../README.md).

## Overview

A single-page portfolio built with [Next.js](https://nextjs.org/) (App Router)
and React, written in JavaScript. There is no backend and no database: the page
is content, not an application, so `next build` exports it as plain static
files that any web host can serve.

Most of the page is server-rendered at build time. Only three things are
interactive, and only those ship JavaScript to the browser: the mobile menu,
the hero typing line, and the hero parallax.

## Directory layout

```
.
├── app/                    Next.js App Router entry
│   ├── layout.js           <html> shell, metadata, fonts, providers
│   ├── page.js             composes the page from section components
│   └── globals.css         the global style layer
├── components/
│   ├── layout/             page scaffolding used across sections
│   ├── sections/           one folder per page section
│   └── ui/                 small reusable pieces
├── data/                   page content as plain JS modules
├── hooks/                  reusable behaviour
├── lib/                    small helpers
├── styles/                 styles shared by more than one component
├── public/                 served from / and copied to the build untouched
├── next.config.mjs         static export configuration
└── jsconfig.json           the "@/" path alias
```

Every component lives in its own folder with its stylesheet beside it:

```
components/sections/Hero/
├── Hero.jsx            server component: markup and content
├── HeroArt.jsx         client component: the parallax artwork
└── Hero.module.css     styles for both
```

Imports use the `@/` alias (`@/components/ui/Button/Button`) rather than
relative `../../..` chains. It is configured in `jsconfig.json`.

## Content

Text that repeats in a list — projects, publications, research directions,
education, timeline entries, navigation — lives in `data/` as plain exported
objects, not in JSX. `data/` is the source of truth for the site's content. Editing the site's content usually means editing a file in
`data/`, and the components iterate over whatever is there. Prose that appears
exactly once (the hero headline, the about paragraphs) stays in its component,
where it reads as part of the markup.

Adding a fourth project means appending one object to `data/projects.js`.

## Styles

Three layers, in cascade order:

1. **`app/globals.css`** — the reset, design tokens, bare element typography
   and a couple of utility classes (`.mono`, `.sr-only`). Everything here is
   deliberately unscoped. It is imported
   once from `app/layout.js`, so it is always emitted first and can be
   overridden by any component.
2. **`styles/section.module.css`** — the section shell shared by several
   sections. A section that needs a different rhythm composes it:

   ```css
   .workSection {
     composes: section from "@/styles/section.module.css";
     padding-top: 70px;
   }
   ```

   `composes` also guarantees the shared rules are emitted *before* the
   overriding ones, so the cascade does not depend on import order.
3. **`*.module.css`** — everything else. Class names are scoped by the
   bundler, so `.hero` in one module cannot collide with `.hero` in another.

### Variants instead of cross-module overrides

A component's modifiers live in that component's own stylesheet, compounded
with the base class, and are selected with a `variant` prop:

```css
.sectionLabel { border-top: 1px solid var(--line); }
.sectionLabel.plain { border: 0; }
```

```jsx
<SectionLabel index="01 / ABOUT" caption="A LITTLE CONTEXT" variant="plain" />
```

This is deliberate. A module cannot reach into another module's generated class
names, and two single-class rules in different files would be decided by
whichever stylesheet the bundler happened to emit last. Compounding the variant
with its base class settles it on specificity instead, which nothing can
reorder.

Current variants: `SectionLabel` (`plain`, `onDark`, `contained`),
`SectionHeading` (`tight`, `contained`), `LinkList` (`aside`), `Button`
(`lime`), the flow diagram palettes (`rover`, `uav`, `depth`), and the project
card layouts (`featured`, `mirrored`).

### Tokens

Colours and fonts come from custom properties on `:root` in `app/globals.css`
(`--ink`, `--lime`, `--muted`, `--line`, `--mono`, `--display`). Use a token
rather than repeating a literal.

Fonts are loaded with `next/font/google` in `app/layout.js`, which self-hosts
them at build time — no render-blocking request to Google and no layout shift.
Each family publishes a `--font-*` variable that the tokens read.

### Breakpoints

There is no shared breakpoint file. Each component carries its own media
queries at the bottom of its stylesheet, so everything affecting one component
is in one place. The breakpoints in use are `min-width: 1600px`,
`max-width: 1000px`, `max-width: 760px`, plus `prefers-reduced-motion` and
`print`.

## Interactivity

Server components are the default. A file gets `"use client"` only when it
needs state, an effect or a DOM event:

| Client component      | Why                                     |
| --------------------- | --------------------------------------- |
| `Navigation`          | menu state, and the scroll-spy highlight |
| `TypingLine`          | types and erases the hero research line |
| `HeroArt`             | pointer events driving the parallax     |

Icons come from `lucide-react`, as in the original project: outbound links
carry an arrow, the menu toggle swaps between a burger and a cross, and the
project expander's plus rotates into a cross when it opens.

There is no in-page control for turning motion off. The only thing that
suppresses it is the visitor's own `prefers-reduced-motion` setting, which each
animated component honours in its own stylesheet.

`useHeroParallax` writes the pointer position to the `--rx` / `--ry` custom
properties and lets CSS do the animating — which is also what neutralises it
under `prefers-reduced-motion`, through a rule on `.robotArt`.

`TypingLine` follows the same rule. It renders the whole sentence — not the
animation — before hydration and under `prefers-reduced-motion`, so the line
always says something with or without JavaScript. The animated spans are `aria-hidden`; assistive technology is given
the full sentence through `.sr-only` instead, because announcing a line
character by character is unusable. The phrases it cycles live in
`heroTyping` in `data/site.js`.

## Build

`npm run build` static-exports the site to `out/`. No Node server is needed to
host it — any static host works. `next.config.mjs` sets `output: "export"`,
which also means image optimisation is off (there is no server to optimise on),
so `next/image` is used only for its width/height and lazy-loading behaviour.

## Conventions

- Two-space indentation, LF endings, final newline (`.editorconfig`).
- Node 24 (`.nvmrc`, `engines`); npm, with `package-lock.json` committed.
- Components are named exports; one component per file; the file is named for
  the component.
- Imports are ordered: React, then `@/` modules, then relative, then the
  stylesheet last.
- `npm run lint` runs ESLint with `eslint-config-next`.
