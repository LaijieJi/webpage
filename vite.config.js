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

// Reading time is computed here, at build time, so post bodies never need to be
// shipped to the browser just to be counted.
function readingTimes() {
  const VIRTUAL_ID = 'virtual:reading-times';
  const RESOLVED_ID = '\0' + VIRTUAL_ID;
  const POSTS_DIR = path.resolve('src/posts');

  function minutesFor(raw) {
    const text = raw
      .replace(/^---[\s\S]*?---/, '')        // frontmatter
      .replace(/```[\s\S]*?```/g, ' ')       // code fences
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
      .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> text
      .replace(/[#>*_`~]/g, ' ');
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.round(words / 200));
  }

  function table() {
    if (!fs.existsSync(POSTS_DIR)) return {};
    const out = {};
    for (const file of fs.readdirSync(POSTS_DIR)) {
      if (!file.endsWith('.md')) continue;
      const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8');
      out[file.replace(/\.md$/, '')] = minutesFor(raw);
    }
    return out;
  }

  return {
    name: 'lj-reading-times',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID;
    },
    load(id) {
      if (id === RESOLVED_ID) return `export default ${JSON.stringify(table())};`;
    },
    configureServer(server) {
      server.watcher.add(POSTS_DIR);
      server.watcher.on('all', (_event, file) => {
        if (!String(file).endsWith('.md')) return;
        const mod = server.moduleGraph.getModuleById(RESOLVED_ID);
        if (mod) server.moduleGraph.invalidateModule(mod);
        server.ws.send({ type: 'full-reload' });
      });
    }
  };
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
    readingTimes(),
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
