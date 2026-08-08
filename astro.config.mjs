// @ts-check
import { defineConfig } from 'astro/config';

// User GitHub Pages site (https://youngjae-cho.github.io) deploys at root.
// If you instead deploy to a project repo, set `base: '/<repo-name>'`.
export default defineConfig({
  site: 'https://youngjae-cho.github.io',
  base: '/',
  redirects: {
    // /cv used to be the catch-all. It's now split: /resume (1 page) and the
    // research portfolio PDF (12 pages). Keep old links working.
    '/cv': '/resume',
    // /projects held both tracks at once, which the console panel promised as
    // two destinations. Product keeps three of the five cases, so old links
    // land there.
    '/projects': '/product',
  },
});
