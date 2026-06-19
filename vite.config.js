import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import Markdown from 'unplugin-vue-markdown/vite';

const SITE_URL = 'https://laijie.dev';

// Emits sitemap.xml at build time from the static routes + post/photo slugs.
function sitemap() {
  const slugsIn = (dir) =>
    fs.existsSync(dir)
      ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
      : [];
  return {
    name: 'lj-sitemap',
    apply: 'build',
    generateBundle() {
      const posts = slugsIn(path.resolve('src/posts'));
      const photos = slugsIn(path.resolve('src/photography'));
      const routes = [
        '/',
        '/projects',
        '/blog',
        '/photography',
        '/car-maintenance',
        ...posts.map((s) => `/blog/${s}`),
        ...photos.map((s) => `/photography/${s}`)
      ];
      const body = routes.map((r) => `  <url><loc>${SITE_URL}${r}</loc></url>`).join('\n');
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
      frontmatter: true,
      excerpt: true
    }),
    sitemap()
  ],
  server: {
    port: 5173,
    open: true
  }
});
