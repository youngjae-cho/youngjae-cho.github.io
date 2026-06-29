// @ts-check
import { defineConfig } from 'astro/config';

// User GitHub Pages site (https://youngjae-cho.github.io) deploys at root.
// If you instead deploy to a project repo, set `base: '/<repo-name>'`.
export default defineConfig({
  site: 'https://youngjae-cho.github.io',
  base: '/',
});
