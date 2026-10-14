import { defineConfig } from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import vue from '@vitejs/plugin-vue';
import Markdown from 'unplugin-vue-markdown/vite';
import { renderPostCard, readFrontmatter } from './scripts/og-cards.js';

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
    '/shelf',
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

// GitHub Pages serves each prerendered page from <route>/index.html and
// redirects the slashless URL there, so the slashed one is the real address.
const withSlash = (p) => (p.endsWith('/') ? p : `${p}/`);

// When an entry was last touched, for the sitemap: its frontmatter date.
function lastModified(routePath) {
  const m = routePath.match(/^\/(blog|photography)\/(.+)$/);
  if (!m) return null;
  const dir = m[1] === 'blog' ? 'src/posts' : 'src/photography';
  const { date } = readFrontmatter(fs.readFileSync(path.resolve(dir, `${m[2]}.md`), 'utf8'));
  const time = Date.parse(date || '');
  return Number.isNaN(time) ? null : new Date(time).toISOString().slice(0, 10);
}

// vite-ssg runs the plugins twice, for the client build and the server one;
// files only need emitting into the client's dist/.
function clientBuildOnly(plugin) {
  let ssr = false;
  return {
    ...plugin,
    apply: 'build',
    configResolved(config) {
      ssr = Boolean(config.build.ssr);
    },
    generateBundle(...args) {
      if (!ssr) return plugin.generateBundle.apply(this, args);
    }
  };
}

// Emits sitemap.xml at build time from the static routes + post/photo slugs.
function sitemap() {
  return clientBuildOnly({
    name: 'lj-sitemap',
    generateBundle() {
      const body = allRoutePaths()
        .map((p) => {
          const lastmod = lastModified(p);
          return `  <url><loc>${SITE_URL}${withSlash(p)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`;
        })
        .join('\n');
      this.emitFile({
        type: 'asset',
        fileName: 'sitemap.xml',
        source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`
      });
    }
  });
}

// Each journal entry's share image: its catalogue card, as og/blog/<slug>.png
// (see scripts/og-cards.js; BlogPostView points og:image at it).
function ogCards() {
  return clientBuildOnly({
    name: 'lj-og-cards',
    async generateBundle() {
      const dir = path.resolve('src/posts');
      for (const slug of slugsIn(dir)) {
        const fm = readFrontmatter(fs.readFileSync(path.join(dir, `${slug}.md`), 'utf8'));
        this.emitFile({ type: 'asset', fileName: `og/blog/${slug}.png`, source: await renderPostCard(fm) });
      }
    }
  });
}

// The site as plain text for language models (https://llmstxt.org): llms.txt
// is the index - who this is and a link to every entry - and llms-full.txt the
// entries themselves, whole. Book reviews are the journal entries with a `book:`.
function llmsTxt() {
  const entries = (dir, base) =>
    slugsIn(path.resolve(dir))
      .map((slug) => {
        const raw = fs.readFileSync(path.resolve(dir, `${slug}.md`), 'utf8');
        return { ...readFrontmatter(raw), url: `${SITE_URL}${base}/${slug}/`, body: plainBody(raw) };
      })
      .sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0));

  // The markdown as written, minus frontmatter and the odd bit of HTML (the
  // Miata's number plate) - its text stays, the tags go.
  function plainBody(raw) {
    return raw
      .replace(/^---[\s\S]*?---\s*/, '')
      .replace(/<[^>]+>/g, '')
      .replace(/^[ \t]+/gm, '')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  const link = (e) => `- [${e.title}](${e.url})${e.excerpt ? `: ${e.excerpt}` : ''}`;
  const stamp = (e) => [e.date, e.bookAuthor && `${e.book} by ${e.bookAuthor}`, e.rating && `rated ${e.rating}/5`].filter(Boolean).join(' · ');

  return clientBuildOnly({
    name: 'lj-llms-txt',
    generateBundle() {
      const journal = entries('src/posts', '/blog');
      const reviews = journal.filter((e) => e.book);
      const essays = journal.filter((e) => !e.book);
      const photos = entries('src/photography', '/photography');

      const intro = [
        '# Laijie Ji',
        '',
        "> Software developer in Valencia, working through a master's in AI at the UPV. This site is his journal (book reviews and the occasional essay), his photographs, and a few projects.",
        ''
      ];
      const index = [
        ...intro,
        '## Pages',
        '',
        `- [Me](${SITE_URL}/): who he is, what he works on`,
        `- [Projects](${SITE_URL}/projects/): things he has built`,
        `- [The shelf](${SITE_URL}/shelf/): every book he has finished, by year, with ratings`,
        '',
        '## Journal',
        '',
        ...essays.map(link),
        '',
        '## Book reviews',
        '',
        ...reviews.map(link),
        '',
        '## Photography',
        '',
        ...photos.map(link),
        '',
        '## Optional',
        '',
        `- [Everything above, in full](${SITE_URL}/llms-full.txt)`,
        ''
      ];
      const full = [
        ...intro,
        ...[...journal, ...photos].map((e) => `---\n\n# ${e.title}\n\n${e.url}\n${stamp(e)}\n\n${e.body}\n`)
      ];

      this.emitFile({ type: 'asset', fileName: 'llms.txt', source: index.join('\n') });
      this.emitFile({ type: 'asset', fileName: 'llms-full.txt', source: full.join('\n') });
    }
  });
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
    sitemap(),
    ogCards(),
    llmsTxt()
  ],
  ssgOptions: {
    dirStyle: 'nested',
    // /404 falls through to the catch-all route, so it prerenders the
    // not-found page; onFinished moves it to where GitHub Pages looks for it.
    includedRoutes: () => [...allRoutePaths(), '/404'],
    onFinished() {
      fs.renameSync(path.resolve('dist/404/index.html'), path.resolve('dist/404.html'));
      fs.rmdirSync(path.resolve('dist/404'));
    }
  },
  server: {
    port: 5173,
    open: true
  }
});
