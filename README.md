# Gesem Mejia — research portfolio

A single-page portfolio for robotics and embodied-intelligence research, built
with Next.js and React in plain JavaScript. No TypeScript, no database, no
backend: the build produces a folder of static files that any web host serves.

**Research interests:** perception from sensors, self-supervised world models,
planning under uncertainty, and safe decision-making for embodied agents.

---

## Running it

### Prerequisites

[Node.js 24 LTS](https://nodejs.org/en/download). npm ships with it, so there
is nothing else to install globally.

```bash
node --version    # v24.x
npm --version     # 11.x or newer
```

If you use a version manager, the required version is in `.nvmrc`, so `nvm use`
in this folder selects it.

### Install

```bash
git clone <repository-url>
cd PersonalWebSite
npm ci
```

`npm ci` installs the exact versions in `package-lock.json`. Use `npm install`
only when deliberately adding or upgrading a package.

The first install needs internet access, and so does the first build after it —
Next.js downloads the three web fonts once and then caches them. No API keys,
environment variables or database are required.

### Develop

```bash
npm run dev
```

Open <http://127.0.0.1:3000>. Saving a file updates the browser. **Ctrl+C**
stops the server. If the port is busy, Next.js prints the URL it used instead.

### Build and preview

```bash
npm run build     # writes the static site to out/
npm run preview   # serves out/ at http://127.0.0.1:4173
```

### Check

```bash
npm run lint
```

### All commands

| Command | Does | Serves at |
| --- | --- | --- |
| `npm ci` | Installs locked dependencies | — |
| `npm run dev` | Development server with hot reload | <http://127.0.0.1:3000> |
| `npm run build` | Builds the static site into `out/` | — |
| `npm run preview` | Serves the built output | <http://127.0.0.1:4173> |
| `npm run lint` | Lints the source | — |

Both servers bind to `127.0.0.1`, so they are reachable only from your machine.

### If something goes wrong

| Symptom | Fix |
| --- | --- |
| `next: not found` / `Cannot find module` | Run `npm ci` again. |
| `npm warn install-scripts … unrs-resolver` | Harmless; the site builds and lints without that optional postinstall. |
| Port 3000 or 4173 in use | Stop the other process, or use the URL Next.js prints. |
| `npm run preview` shows an old version | Run `npm run build` first. |
| Fonts wrong on a first offline build | Build once with a connection; the fonts are then cached. |
| Anything else | Delete `node_modules` and `.next`, then `npm ci`. |

## Deploying

`npm run build` produces a self-contained static site in `out/`. No Node.js is
needed on the server. Upload that folder to any static host — Netlify,
Cloudflare Pages, Vercel, GitHub Pages or a plain web server.

`public/.nojekyll` is included so that GitHub Pages does not strip the
`_next/` directory, which would otherwise serve the site unstyled.

If you host it at a **project** URL such as `username.github.io/repository`
rather than at a domain root, set the sub-path in `next.config.mjs`, otherwise
every asset resolves to the wrong place:

```js
basePath: "/repository",
assetPrefix: "/repository",
```

## Editing the content

Most content is data, not markup:

| File | Holds |
| --- | --- |
| `data/site.js` | Name, location, email, links, navigation, and the phrases the hero types |
| `data/research.js` | The three research directions |
| `data/projects.js` | Selected-work cards, including the "Behind the project" text |
| `data/publications.js` | The publication list |
| `data/experience.js` | Education, career timeline and the toolbox list |

Adding a publication is one entry in `data/publications.js`. An entry without a
`href` renders the `DRAFT` badge instead of a link.

The rest:

- `app/page.js` — which sections appear, and in what order
- `app/layout.js` — page title, description, fonts
- `app/globals.css` — colours, fonts and site-wide styles
- `components/sections/` — one folder per section, each with its own styles
- `components/ui/`, `components/layout/` — reusable pieces
- `public/images/hero-trajectories.png` — hero artwork
- `public/images/portrait.jpg` — the about-section photograph
- `public/favicon.svg` — browser icon

[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) explains the folder layout, how the
styles are organised, and where to add a section or feature.
[docs/ART_DIRECTION.md](docs/ART_DIRECTION.md) records the visual direction and
where the imagery came from.

## Licence

The source code is MIT licensed — see [LICENSE](LICENSE).

The written content and the images are **not** covered by that licence and are
reserved. The hero artwork is AI-generated conceptual art, labelled on the page
as a concept study; it is not a photograph of real hardware and not evidence of
experimental results.
