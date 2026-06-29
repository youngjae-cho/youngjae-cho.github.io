# youngjae-cho.github.io

Personal site for Youngjae Cho — ML Research Engineer. Built with [Astro](https://astro.build).

## Develop

```bash
npm install      # once
npm run dev      # local dev server → http://localhost:4321
npm run build    # static build → ./dist
npm run preview  # preview the production build
```

## Editing content

All content lives in plain data files — no framework knowledge needed:

| What | File |
|------|------|
| Publications | `src/data/publications.ts` — add an object; `home: true` surfaces it on the homepage |
| Projects / case studies | `src/data/projects.ts` |
| CV (experience, education, skills) | `src/data/cv.ts` |
| Hero headline / links | `src/components/Hero.astro` |
| Stats strip | `src/components/Ledger.astro` |
| Footer / contact | `src/components/Footer.astro` |

Design tokens (colors, type, spacing) are all in `src/styles/global.css`.

### Things to fill in

- **Profile / CV PDF** — replace `public/youngjae-cho-cv.pdf` (currently a placeholder copy of the portfolio deck).
- **Google Scholar** — set the real URL in `src/components/Hero.astro` and `src/components/Footer.astro` (currently `#`).

## Deploy (GitHub Pages)

This is configured as a **user site** (`https://youngjae-cho.github.io`, `base: '/'` in `astro.config.mjs`).

1. Create a repo named **`youngjae-cho.github.io`** and push this project to its root (`main` branch).
2. In the repo: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and deploys on every push to `main`.

> Deploying to a *project* repo instead? Set `base: '/<repo-name>'` in `astro.config.mjs` and uncomment the `path:` input in the workflow if the project sits in a subfolder.
