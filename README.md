# youngjae-cho.github.io

Personal site for Youngjae Cho — ML Research Engineer. Built with [Astro](https://astro.build).

## Develop

```bash
npm install      # once
npm run dev      # local dev server → http://localhost:4321
npm run build    # static build → ./dist
npm run preview  # preview the production build
```

## Two documents, two audiences

Deliberately split, so neither has to do the other's job:

| | What | Where |
|---|------|-------|
| **Résumé** | 1 page. The recruiter entry point. Print-friendly — "Print / Save as PDF" on the page produces the PDF. | `/resume` (`src/pages/resume.astro`) |
| **Research portfolio** | 12 pages. For the hiring manager who's already interested. | `public/youngjae-cho-research-portfolio.pdf` |

`/cv` redirects to `/resume` (see `astro.config.mjs`) so old links keep working.

## Editing content

All content lives in plain data files — no framework knowledge needed:

| What | File |
|------|------|
| Publications | `src/data/publications.ts` — add an object; `home: true` surfaces it on the homepage |
| Projects / case studies | `src/data/projects.ts` |
| Experience, education, skills, awards | `src/data/cv.ts` |
| Hero headline / links | `src/components/Hero.astro` |
| Stats strip | `src/components/Ledger.astro` |
| Footer / contact | `src/components/Footer.astro` |

Design tokens (colors, type, spacing) are all in `src/styles/global.css`.

### Rules that keep this honest

- **The résumé is generated from the same data files as the site.** Never hand-edit `/resume` content — edit `src/data/*.ts` and both update. This is what stops the site and the PDF from drifting.
- **Publication metadata is one fact in one place.** Each entry carries `venue` + `status` (`Published` | `Preprint` | `Workshop`). Don't invent a review status. When a paper is accepted, change `venue` and `status` together, and promote it in `src/components/Ledger.astro`.
- **Keep credit legible.** Case studies carry `ownershipHtml` — what was the team's vs. what was mine. Team awards say so.
- **Author lists** wrap Youngjae's name in `**markers**`; `*` marks equal contribution.

### Mirrors to update by hand

The LaTeX résumé at `~/resume/resume.tex` is a separate source. If you change experience or awards here, change it there too — or drop it in favour of `/resume`.

## Deploy (GitHub Pages)

This is configured as a **user site** (`https://youngjae-cho.github.io`, `base: '/'` in `astro.config.mjs`).

1. Create a repo named **`youngjae-cho.github.io`** and push this project to its root (`main` branch).
2. In the repo: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds and deploys on every push to `main`.

> Deploying to a *project* repo instead? Set `base: '/<repo-name>'` in `astro.config.mjs` and uncomment the `path:` input in the workflow if the project sits in a subfolder.
