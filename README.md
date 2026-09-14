# Gesem Mejia Portfolio

An editable local version of Gesem Mejia's portfolio, reconstructed from the
published page and its assets. All website source and image assets live in this
Git repository: `/home/gesem/Documents/ChatGPT/PersonalWebSite`.

## Install Once

Install Node.js 24 LTS (including npm) from https://nodejs.org/en/download,
then open a new terminal. Verify Node and install the pinned package manager:

```bash
node --version
npm --version
npm install --global pnpm@11.19.0
pnpm --version
```

Node should report `v24.x` and pnpm should report `11.19.0`. If a command is
not found, ensure Node is installed and restart your terminal. If the global
install fails with a permissions error, use a user-owned Node installation
(the Node download page includes version-manager instructions).

Install this project's dependencies:

```bash
cd /home/gesem/Documents/ChatGPT/PersonalWebSite
pnpm install --frozen-lockfile
```

The lockfile fixes dependency versions. `pnpm-workspace.yaml` permits esbuild's
required installation script. Internet access is needed for the first install.
No API keys, database, or environment variables are required.

## Run Locally

Each time you want to work on the website:

```bash
cd /home/gesem/Documents/ChatGPT/PersonalWebSite
pnpm run dev
```

Open http://127.0.0.1:5173 in your browser. Keep the terminal running; edits
reload automatically. Press **Ctrl+C** in that terminal to stop the server.
If the port is occupied, Vite prints the next available URL; use that URL.

On this computer, the Codex-bundled runtime can also be used immediately
without installing Node separately. Run these commands in each new terminal
before the install or run commands above:

```bash
export PATH="/home/gesem/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:/home/gesem/.cache/codex-runtimes/codex-primary-runtime/dependencies/bin/fallback:$PATH"
node --version
pnpm --version
```

That fallback depends on Codex's runtime remaining installed. A separate Node
installation is the portable option.

## Build And Preview

```bash
pnpm run build
pnpm run preview
```

The build creates `dist/`. Preview is normally at http://127.0.0.1:4173;
use the URL printed in the terminal and press **Ctrl+C** to stop it.
These commands do not update the published website.

## Edit The Website

- `index.html`: page content and layout.
- `src/styles.css`: website styles, currently imported as minified CSS.
- `src/main.js`: menu and motion interactions.
- `public/images/robotics-hero.png`: hero artwork.
- `public/favicon.svg`: browser icon.
- `package.json`: scripts and dependency requirements.
- `pnpm-lock.yaml`: reproducible dependency versions.

The fonts load from Google Fonts, with local system font fallbacks when offline.
The editable page was reconstructed from the live website, not exported from
its original development repository.

## Git

This folder is a local Git repository owned by `gesem`. View changes and save
your work from the project folder:

```bash
git status
git diff
git add index.html src public README.md package.json pnpm-lock.yaml pnpm-workspace.yaml .gitignore
git commit -m "Update portfolio"
git log --oneline
```

Dependencies (`node_modules/`) and generated builds (`dist/`) are ignored.
Git history lives in `.git/` inside this folder. No remote repository is
configured; a local commit does not upload your code to GitHub or deploy it.
