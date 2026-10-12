// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://forgelineoptimizations.nl',
  output: 'static',
  trailingSlash: 'ignore',
  build: { format: 'directory' }, // /privacy → privacy/index.html, werkt op GitHub Pages
  i18n: {
    defaultLocale: 'nl',
    locales: ['nl', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  vite: { plugins: [tailwindcss()] },
});
