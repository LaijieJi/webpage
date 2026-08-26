import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import Markdown from 'unplugin-vue-markdown/vite';

const SITE_URL = 'https://laijie.dev';

const slugsIn = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
    : [];

// Every prerenderable route. Feeds both the sitemap and vite-ssg's route list;
// per-route meta/OG/JSON-LD now live in the app itself (src/composables/useSeo.js).
function allRoutePaths() {
  return [
    '/',
    '/projects',
    '/blog',
    '/photography',
    ...slugsIn(path.resolve('src/posts')).map((s) => `/blog/${s}`),
    ...slugsIn(path.resolve('src/photography')).map((s) => `/photography/${s}`)
  ];
}

// Emits sitemap.xml at build time from the static routes + post/photo slugs.
function sitemap() {
  return {
    name: 'lj-sitemap',
    apply: 'build',
    generateBundle() {
      const body = allRoutePaths()
        .map((p) => `  <url><loc>${SITE_URL}${p}</loc></url>`)
        .join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
      });
    }
  };
}

export default defineConfig({
  base: '/',
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    Markdown({
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true
      },
      // NOTE: `excerpt: true` would overwrite the frontmatter `excerpt:` field
      // with the body-extracted excerpt (empty — no <!-- more --> markers).
      frontmatter: true
    }),
    sitemap()
  ],
  ssgOptions: {
    dirStyle: 'nested',
    includedRoutes: () => allRoutePaths()
  },
  server: {
    port: 5173,
    open: true
  }
});
