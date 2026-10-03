// Share images for journal entries: each post's catalogue card, rendered at
// build time to a 1200x630 PNG (og/blog/<slug>.png). Satori lays the card out
// from plain element objects, resvg rasterises it. Colours are the alpine
// palette's light values from src/styles/main.css.
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { OG_CARD_SIZE } from '../src/composables/useSeo.js';

const FONTS_DIR = path.resolve('brand/fonts');
const MARK_URI = `data:image/svg+xml;base64,${fs.readFileSync(path.resolve('brand/laijie-mark.svg')).toString('base64')}`;

const C = {
  mat: '#e3e4db',
  card: '#fbfaf3',
  ink: '#232a27',
  muted: '#636963',
  faint: '#7e847d',
  accent: '#4c6b4a',
  accent2: '#3f6e84',
  rule: 'rgba(164, 22, 26, 0.55)',
  line: 'rgba(63, 110, 132, 0.18)'
};

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

// Just enough YAML for our frontmatter: `key: value` lines and `[a, b]` lists.
export function readFrontmatter(raw) {
  const block = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const out = {};
  if (!block) return out;
  for (const line of block[1].split(/\r?\n/)) {
    const m = line.match(/^(\w+):\s*(.*)$/);
    if (!m) continue;
    let value = m[2].trim().replace(/^(['"])(.*)\1$/, '$2');
    if (/^\[.*\]$/.test(value)) value = value.slice(1, -1).split(',').map((s) => s.trim()).filter(Boolean);
    out[m[1]] = value;
  }
  return out;
}

// Mirrors cardByline / cardTitle / cardGenre / cardStamp in src/data/posts.js.
export function cardFields(fm) {
  const tags = Array.isArray(fm.tags) ? fm.tags : [];
  const d = new Date(fm.date);
  return {
    byline: fm.bookAuthor || tags[0] || '',
    title: fm.book || (fm.title || '').replace(/^Book Review - /, ''),
    genre: tags
      .filter((tag, i) => tag !== 'books' && (fm.bookAuthor || i > 0))
      .map((tag) => tag.replace(/-/g, ' '))
      .join(', '),
    stamp: Number.isNaN(d.getTime()) ? '' : `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`,
    excerpt: (fm.excerpt || '').replace(/'/g, '\u2019') // the site's typographer curls these too
  };
}

// Element objects as satori reads them. Satori counts any children array as
// several nodes, which only flex boxes may hold, so lone children go in bare.
function h(type, style, ...children) {
  const kids = children.flat().filter((c) => c !== '' && c != null && c !== false);
  return { type, props: { style, children: kids.length > 1 ? kids : kids[0] } };
}

export function card({ byline, title, genre, stamp, excerpt }) {
  const titleSize = title.length > 26 ? 60 : 74;

  return h('div', { display: 'flex', width: '100%', height: '100%', background: C.mat, alignItems: 'center', justifyContent: 'center' },
    h('div', {
      display: 'flex',
      flexDirection: 'column',
      width: 1060,
      height: 500,
      padding: '44px 56px 0',
      background: C.card,
      borderRadius: 8,
      boxShadow: '0 0 0 1.5px rgba(35, 42, 39, 0.14), 0 30px 46px -26px rgba(30, 30, 25, 0.55)',
      transform: 'rotate(-0.6deg)'
    },
      // typed author, title, and the date stamp
      h('div', { display: 'flex', justifyContent: 'space-between', paddingBottom: 24, borderBottom: `3px solid ${C.rule}` },
        h('div', { display: 'flex', flexDirection: 'column', flex: 1, paddingRight: 32 },
          h('div', { fontFamily: 'Spline Sans Mono', fontSize: 24, color: C.muted }, byline),
          h('div', { fontFamily: 'Newsreader', fontWeight: 500, fontSize: titleSize, lineHeight: 1.05, letterSpacing: '-0.01em', color: C.ink, marginTop: 12, display: 'block', lineClamp: 2 }, title)
        ),
        stamp && h('div', {
          display: 'flex',
          alignSelf: 'flex-start',
          padding: '7px 14px 5px',
          border: `2.5px solid ${C.accent2}`,
          borderRadius: 4,
          fontFamily: 'Spline Sans Mono',
          fontSize: 21,
          letterSpacing: '0.06em',
          color: C.accent2,
          opacity: 0.85,
          transform: 'rotate(-4deg)'
        }, stamp)
      ),
      // the excerpt on the card's blue lines, ruled as far down as there is room
      h('div', { display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', overflow: 'hidden', paddingTop: 12 },
        ...[1, 2, 3, 4, 5, 6].map((i) => h('div', { position: 'absolute', left: 0, right: 0, top: 12 + 48 * i - 1, height: 1.5, background: C.line })),
        h('div', { display: 'block', fontFamily: 'Newsreader', fontStyle: 'italic', fontSize: 32, lineHeight: '48px', color: C.muted, lineClamp: 3, maxWidth: 880 }, excerpt)
      ),
      h('div', { display: 'flex', height: 84, alignItems: 'center', justifyContent: 'space-between' },
        h('div', { fontFamily: 'Spline Sans Mono', fontSize: 20, color: C.faint }, genre || ' '),
        h('div', { display: 'flex', alignItems: 'center' },
          { type: 'img', props: { src: MARK_URI, width: 19, height: 44 } },
          h('div', { fontFamily: 'Spline Sans Mono', fontSize: 20, color: C.faint, marginLeft: 12 }, 'laijie.dev')
        )
      )
    )
  );
}

let fonts;
function loadFonts() {
  fonts ??= [
    { name: 'Newsreader', weight: 500, style: 'normal', data: fs.readFileSync(path.join(FONTS_DIR, 'Newsreader-Medium.ttf')) },
    { name: 'Newsreader', weight: 400, style: 'italic', data: fs.readFileSync(path.join(FONTS_DIR, 'Newsreader-Italic.ttf')) },
    { name: 'Spline Sans Mono', weight: 400, style: 'normal', data: fs.readFileSync(path.join(FONTS_DIR, 'SplineSansMono-Regular.ttf')) }
  ];
  return fonts;
}

export async function renderPostCard(fm) {
  const svg = await satori(card(cardFields(fm)), { ...OG_CARD_SIZE, fonts: loadFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: OG_CARD_SIZE.width } }).render().asPng();
}
