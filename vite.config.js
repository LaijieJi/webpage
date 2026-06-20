import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import Markdown from 'unplugin-vue-markdown/vite';

const SITE_URL = 'https://laijie.dev';
const OG_IMAGE = `${SITE_URL}/og.jpg`;

const slugsIn = (dir) =>
  fs.existsSync(dir)
    ? fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => f.replace(/\.md$/, ''))
    : [];

// Minimal frontmatter reader (title / excerpt only).
function readFrontmatter(file) {
  const fm = {};
  if (!fs.existsSync(file)) return fm;
  const m = fs.readFileSync(file, 'utf8').match(/^---\n([\s\S]*?)\n---/);
  if (m) {
    for (const line of m[1].split('\n')) {
      const i = line.indexOf(':');
      if (i > 0) fm[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, '');
    }
  }
  return fm;
}

function allRoutes() {
  const post = (s) => {
    const fm = readFrontmatter(path.resolve('src/posts', `${s}.md`));
    return { path: `/blog/${s}`, title: fm.title || s, desc: fm.excerpt || '' };
  };
  const photo = (s) => {
    const fm = readFrontmatter(path.resolve('src/photography', `${s}.md`));
    return { path: `/photography/${s}`, title: fm.title || s, desc: fm.excerpt || '' };
  };
  return [
    { path: '/', title: '', desc: '' },
    { path: '/projects', title: 'Projects', desc: "Selected things I've built — mostly to learn something, or to scratch an itch." },
    { path: '/blog', title: 'The Journal', desc: 'Notes from a slow reader — book reviews and the occasional rabbit hole.' },
    { path: '/photography', title: 'Photography', desc: 'Mostly Outdoors — frames from slow walks and travels.' },
    { path: '/car-maintenance', title: 'The Garage', desc: 'A 2015 Mazda MX-5 in Soul Red, and its service logbook.' },
    ...slugsIn(path.resolve('src/posts')).map(post),
    ...slugsIn(path.resolve('src/photography')).map(photo)
  ];
}

// Emits sitemap.xml at build time from the static routes + post/photo slugs.
function sitemap() {
  return {
    name: 'lj-sitemap',
    apply: 'build',
    generateBundle() {
      const body = allRoutes()
        .map((r) => `  <url><loc>${SITE_URL}${r.path}</loc></url>`)
        .join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
      });
    }
  };
}

// Writes a per-route index.html with route-specific title / description / OG /
// canonical, so link scrapers (which don't run JS) get a card per page.
function prerenderOG() {
  const esc = (s) =>
    String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const setMeta = (html, attr, name, value) =>
    html.replace(new RegExp(`(<meta ${attr}="${name}" content=")[^"]*(")`), `$1${esc(value)}$2`);

  function inject(html, route) {
    const fullTitle = `${route.title} — Laijie Ji`;
    const url = `${SITE_URL}${route.path}`;
    html = html.replace(/<title>[^<]*<\/title>/, `<title>${esc(fullTitle)}</title>`);
    html = html.replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`);
    html = setMeta(html, 'name', 'description', route.desc);
    html = setMeta(html, 'property', 'og:title', fullTitle);
    html = setMeta(html, 'property', 'og:description', route.desc);
    html = setMeta(html, 'property', 'og:url', url);
    html = setMeta(html, 'name', 'twitter:title', fullTitle);
    html = setMeta(html, 'name', 'twitter:description', route.desc);
    return html;
  }

  return {
    name: 'lj-prerender-og',
    apply: 'build',
    closeBundle() {
      const outDir = path.resolve('dist');
      const indexPath = path.join(outDir, 'index.html');
      if (!fs.existsSync(indexPath)) return;
      const template = fs.readFileSync(indexPath, 'utf8');
      for (const route of allRoutes()) {
        if (route.path === '/') continue; // index.html already carries the home defaults
        const dir = path.join(outDir, route.path);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), inject(template, route));
      }
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
    sitemap(),
    prerenderOG()
  ],
  server: {
    port: 5173,
    open: true
  }
});
