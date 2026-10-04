<template>
  <div class="journal">
    <!-- the drawer front: a steel catalogue drawer with its label in a brass frame -->
    <header class="front">
      <div class="front__plate">
        <h1 class="front__label">The Journal</h1>
      </div>
      <span class="front__pull" aria-hidden="true"></span>
      <p class="front__lede">Books I've loved, things I'm learning, and the occasional letter to myself.</p>
      <!-- label holders on the drawer front: which entries to file in it -->
      <div class="shelves" role="group" aria-label="Show entries">
        <button
          v-for="s in SHELVES"
          :key="s.id"
          type="button"
          class="shelf"
          :aria-pressed="shelf === s.id"
          @click="pickShelf(s.id)"
        >
          <span class="shelf__label">{{ s.id }} <span class="shelf__n">{{ counts[s.id] }}</span></span>
        </button>
      </div>
    </header>

    <!-- the open drawer: one index card per entry, filed newest first,
         with a guide card at the start of each year -->
    <div ref="drawerEl" class="drawer">
      <!-- keyed by shelf, so switching refiles every card -->
      <ol :key="shelf" class="drawer__cards">
        <li
          v-for="(item, k) in items"
          :key="item.key"
          class="slot"
          :class="`slot--${item.type}`"
          :style="{ '--k': Math.min(k, 12) }"
        >
          <div v-if="item.type === 'guide'" class="guide" :style="{ '--tab': item.tab }">
            <h2 class="guide__tab">{{ item.year }}</h2>
          </div>

          <RouterLink v-else :to="`/blog/${item.post.slug}`" custom v-slot="{ href }">
            <a class="card" :href="href" @click="open($event, item.post)">
              <span class="card__by">{{ cardByline(item.post) }}</span>
              <h3 class="card__title">{{ cardTitle(item.post) }}</h3>
              <span class="card__stamp">{{ cardStamp(item.post) }}</span>
              <p v-if="item.post.frontmatter.excerpt" class="card__excerpt">{{ item.post.frontmatter.excerpt }}</p>
              <span class="card__meta">{{ item.post.readingTime }} min read</span>
            </a>
          </RouterLink>
        </li>
      </ol>
    </div>

    <!-- what's waiting: slips clipped to the drawer -->
    <section class="next" v-reveal>
      <h2 class="next__label">next up</h2>
      <ul class="next__slips">
        <li v-for="book in readingList" :key="book.title" class="slip">
          <span class="slip__title">{{ book.title }}</span>
          <span class="slip__author">{{ book.author }}</span>
        </li>
      </ul>
      <router-link class="next__shelf" to="/shelf">everything I've read, on the shelf →</router-link>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import posts, { cardByline, cardTitle, cardStamp } from '../data/posts.js';
import { readingList } from '../data/books.js';
import { openWithMorph, isPlainClick, prefetchWhenIdle } from '../composables/useMorph.js';
import { useSeo } from '../composables/useSeo.js';

useSeo({
  title: 'The Journal - Laijie Ji',
  description: 'Notes from a slow reader - book reviews and the occasional rabbit hole.',
  path: '/blog'
});

const route = useRoute();
const router = useRouter();

/* ---- Shelves: everything, the book reviews, or the rest ----------------- */
const SHELVES = [
  { id: 'all', has: () => true },
  { id: 'books', has: (post) => post.frontmatter.tags.includes('books') },
  { id: 'life', has: (post) => !post.frontmatter.tags.includes('books') }
];
const counts = Object.fromEntries(SHELVES.map((s) => [s.id, posts.filter(s.has).length]));
const shelfOf = (id) => SHELVES.find((s) => s.id === id) || SHELVES[0];

// Always 'all' while prerendering and hydrating; a ?shelf= link applies once
// mounted, so the static HTML and the first client render agree.
const shelf = ref('all');

function pickShelf(id) {
  shelf.value = id;
  router.replace({ query: id === 'all' ? {} : { shelf: id } });
}

/* ---- Filing: newest first, a guide card wherever the year changes -------- */
const TABS = ['4%', '28%', '52%', '76%'];

const items = computed(() => {
  const out = [];
  let year = null;
  posts.filter(shelfOf(shelf.value).has).forEach((post) => {
    const y = new Date(post.frontmatter.date).getFullYear();
    if (y !== year) {
      year = y;
      const n = out.filter((item) => item.type === 'guide').length;
      out.push({ type: 'guide', key: `guide-${y}`, year: y, tab: TABS[n % TABS.length] });
    }
    out.push({ type: 'card', key: post.slug, post });
  });
  return out;
});

/* ---- Opening a card: it is pulled out and becomes the entry's sheet ----- */
function open(event, post) {
  if (!isPlainClick(event)) return;
  event.preventDefault();
  openWithMorph(router, `/blog/${post.slug}`, event.currentTarget, 'journal-sheet');
}

/* ---- Riffle: scrolling flicks the cards over a little, like a thumb
   running along their tops. The tilt follows scroll speed and eases back. */
const drawerEl = ref(null);
const MAX_RIFFLE = 7; // degrees
let lastY = 0;
let lastT = 0;
let target = 0;
let tilt = 0;
let raf = 0;

function step() {
  target *= 0.86; // the push fades...
  tilt += (target - tilt) * 0.2; // ...and the cards follow it with some weight
  drawerEl.value?.style.setProperty('--riffle', `${tilt.toFixed(2)}deg`);
  raf = Math.abs(tilt) > 0.02 || Math.abs(target) > 0.02 ? requestAnimationFrame(step) : 0;
}

function onScroll() {
  const now = performance.now();
  const dt = Math.max(now - lastT, 8);
  const velocity = (window.scrollY - lastY) / dt; // px per ms
  lastY = window.scrollY;
  lastT = now;
  target = Math.max(-MAX_RIFFLE, Math.min(MAX_RIFFLE, velocity * 4));
  if (!raf) raf = requestAnimationFrame(step);
}

onMounted(() => {
  shelf.value = shelfOf(route.query.shelf).id;
  if (posts.length) prefetchWhenIdle(router, `/blog/${posts[0].slug}`);
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  lastY = window.scrollY;
  lastT = performance.now();
  window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
  cancelAnimationFrame(raf);
});
</script>

<style scoped>
.journal {
  --steel: color-mix(in srgb, var(--ink) 10%, var(--shade));
  --steel-deep: color-mix(in srgb, var(--ink) 24%, var(--shade));
  --pressboard: color-mix(in srgb, var(--accent) 26%, var(--surface));
  --steel-sheen: rgba(255, 255, 255, 0.28);

  /* The stack: every card is --card-h tall and shows --strip of itself above
     the one filed in front of it. */
  --card-h: 206px;
  --strip: 74px;
  --guide-strip: 26px;
  --tab-h: 30px;

  max-width: 820px;
  margin: 0 auto;
  padding: 56px 40px 96px;
}

/* At night the steel is mixed from black, not from the (now light) ink: the
   front a dark gunmetal, the inside of the drawer darker still. */
:root[data-theme='dark'] .journal {
  --steel: color-mix(in srgb, #000 22%, var(--shade));
  --steel-deep: color-mix(in srgb, #000 55%, var(--shade));
  --pressboard: color-mix(in srgb, var(--accent) 22%, var(--shade));
  --steel-sheen: rgba(255, 255, 255, 0.06);
}

/* ---- Drawer front ------------------------------------------------------- */
.front {
  position: relative;
  display: grid;
  justify-items: center;
  gap: 18px;
  padding: 34px 32px 30px;
  background:
    linear-gradient(to bottom, var(--steel-sheen), transparent 40%),
    var(--steel);
  border-radius: 8px 8px 2px 2px;
  box-shadow:
    inset 0 0 0 1px rgba(0, 0, 0, 0.06),
    inset 0 -3px 0 rgba(0, 0, 0, 0.08),
    0 24px 30px -26px rgb(var(--shadow) / 0.5);
  animation: lj-settle 800ms var(--ease-settle) backwards;
  --reveal-rot: 0deg;
}

.front__plate {
  padding: 7px;
  border-radius: 3px;
  background: linear-gradient(160deg, #cdb27a, var(--brass) 45%, #7d643a);
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.front__label {
  margin: 0;
  padding: 10px 34px 12px;
  background: var(--card-paper);
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.18);
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(30px, 5vw, 46px);
  line-height: 1;
  letter-spacing: -0.01em;
  color: var(--ink);
}

.front__pull {
  width: 92px;
  height: 22px;
  border-radius: 0 0 46px 46px;
  border: 5px solid var(--brass);
  border-top: none;
  box-shadow: 0 4px 4px -2px rgba(0, 0, 0, 0.25);
}

.front__lede {
  margin: 4px 0 0;
  max-width: 44ch;
  text-align: center;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 18px;
  line-height: 1.5;
  color: var(--muted);
}

/* ---- Shelves: little brass label holders on the front -------------------- */
.shelves {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px 16px;
  margin-top: 6px;
}

.shelf {
  padding: 3px;
  border: 0;
  border-radius: 2px;
  background: linear-gradient(160deg, #cdb27a, var(--brass) 45%, #7d643a);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  cursor: pointer;
  translate: 0 0;
  transition: translate var(--dur-quick) var(--ease-spring), box-shadow var(--dur-quick) ease;
}

.shelf__label {
  display: block;
  padding: 4px 12px 3px;
  background: var(--card-paper);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.16);
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  transition: color var(--transition);
}

.shelf__n {
  color: var(--faint);
  font-size: 10.5px;
}

.shelf:hover .shelf__label,
.shelf:focus-visible .shelf__label {
  color: var(--ink);
}

/* the chosen one is pressed in, its label inked */
.shelf[aria-pressed='true'] {
  translate: 0 1px;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.35);
}

.shelf[aria-pressed='true'] .shelf__label {
  color: var(--accent);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.16), inset 0 -2px 0 var(--accent);
}

/* ---- The drawer --------------------------------------------------------- */
.drawer {
  position: relative;
  padding: calc(var(--tab-h) + 26px) 26px 30px;
  background: var(--steel-deep);
  border-radius: 2px 2px 8px 8px;
  box-shadow:
    inset 0 0 0 10px var(--steel),
    inset 0 22px 26px -18px rgba(0, 0, 0, 0.45);
}

.drawer__cards {
  list-style: none;
  margin: 0;
  padding: 0;
}

.slot {
  position: relative;
  /* pulled up into the drawer as the page opens, front to back */
  animation: lj-file 700ms var(--ease-settle) calc(250ms + var(--k) * 45ms) backwards;
}

@keyframes lj-file {
  from {
    opacity: 0;
    translate: 0 46px;
  }
  50% {
    opacity: 1;
  }
}

.slot + .slot {
  margin-top: calc(var(--strip) - var(--card-h));
}

.slot--guide + .slot {
  margin-top: calc(var(--guide-strip) - var(--card-h));
}

.slot + .slot--guide {
  margin-top: calc(var(--strip) + var(--tab-h) - var(--card-h));
}

/* ---- Guide cards: one per year, with a tab standing up ------------------ */
.guide {
  position: relative;
  height: var(--card-h);
  background: var(--pressboard);
  border-radius: 4px;
  box-shadow: 0 -8px 16px -12px rgb(var(--shadow) / 0.4);
}

.guide__tab {
  position: absolute;
  bottom: 100%;
  left: var(--tab);
  height: var(--tab-h);
  margin: 0;
  padding: 5px 20px 0;
  background: var(--pressboard);
  border-radius: 7px 7px 0 0;
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: 18px;
  line-height: 1.2;
  color: var(--ink);
}

/* ---- Index cards -------------------------------------------------------- */
.card {
  position: relative;
  display: block;
  height: var(--card-h);
  padding: 14px 22px 0;
  color: var(--ink);
  border-radius: 4px;
  background:
    /* the hole the drawer rod runs through */
    radial-gradient(circle at 50% calc(100% - 20px), var(--steel-deep) 6px, transparent 6.5px),
    /* red header rule, then faint blue lines */
    linear-gradient(var(--card-rule), var(--card-rule)) 0 70px / 100% 1.5px no-repeat,
    repeating-linear-gradient(to bottom, transparent 0 23px, var(--card-line) 23px 24px) 0 74px / 100% 96px no-repeat,
    var(--card-paper);
  box-shadow: 0 -8px 16px -12px rgb(var(--shadow) / 0.4);
  transform-origin: 50% 100%;
  transform: perspective(1000px) rotateX(var(--riffle, 0deg));
  translate: 0 0;
  transition: translate 650ms var(--ease-spring), box-shadow 350ms ease;
}

/* Lifted out of the drawer by its top edge: it rises over the cards behind,
   far enough to read the whole card. The one in front dips out of the way. */
.card:focus-visible {
  translate: 0 calc(var(--strip) + 8px - var(--card-h));
  box-shadow: 0 -10px 22px -10px rgb(var(--shadow) / 0.45), 0 18px 24px -18px rgb(var(--shadow) / 0.5);
  outline-offset: -4px;
}

.slot--card:has(.card:focus-visible) + .slot .card {
  translate: 0 8px;
}

.card:focus-visible .card__excerpt {
  opacity: 1;
  transition-delay: 120ms;
}

/* Only where there is a real pointer: on touch screens a tap leaves :hover
   behind, and the card would still be lifted on the way back. */
@media (hover: hover) {
  .slot--card:hover .card {
    translate: 0 calc(var(--strip) + 8px - var(--card-h));
    box-shadow: 0 -10px 22px -10px rgb(var(--shadow) / 0.45), 0 18px 24px -18px rgb(var(--shadow) / 0.5);
  }

  .slot--card:hover + .slot .card {
    translate: 0 8px;
  }

  .slot--card:hover .card__excerpt {
    opacity: 1;
    transition-delay: 120ms;
  }
}

.card__by,
.card__title {
  max-width: calc(100% - 130px);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.card__by {
  display: block;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 16px;
  color: var(--muted);
}

.card__title {
  margin: 6px 0 0;
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: 23px;
  line-height: 30px;
  transition: color var(--transition);
}

.card:hover .card__title,
.card:focus-visible .card__title {
  color: var(--accent);
}

/* A library date stamp, inked slightly crooked. */
.card__stamp {
  position: absolute;
  top: 18px;
  right: 18px;
  padding: 3px 7px 2px;
  border: 1.5px solid currentColor;
  border-radius: 3px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.06em;
  color: var(--accent2);
  opacity: 0.82;
  rotate: -3deg;
}

.slot--card:nth-child(even) .card__stamp {
  rotate: 2deg;
}

/* Written on the lines below the rule: only readable once the card is lifted. */
.card__excerpt {
  margin: 0;
  padding-top: 9px;
  opacity: 0;
  transition: opacity 300ms ease;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 17px;
  line-height: 24px;
  color: var(--muted);
  max-width: 58ch;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card__meta {
  position: absolute;
  left: 22px;
  bottom: 13px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--faint);
}

/* ---- Next up ------------------------------------------------------------ */
.next__shelf {
  display: table;
  margin-top: 30px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--ink);
  border-bottom: 1px solid var(--line);
  padding-bottom: 2px;
}

.next__shelf:hover,
.next__shelf:focus-visible {
  color: var(--accent);
  border-color: var(--accent);
}

.next {
  margin-top: 46px;
}

.next__label {
  margin: 0 0 14px;
  font-family: var(--font-hand);
  font-weight: 400;
  font-size: 28px;
  color: var(--accent2);
  rotate: -2deg;
}

.next__slips {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 22px 20px;
}

.slip {
  position: relative;
  display: grid;
  gap: 4px;
  min-width: 200px;
  padding: 18px 18px 14px;
  background: var(--card-paper);
  box-shadow: 0 12px 20px -16px rgb(var(--shadow) / 0.55);
  rotate: -1.4deg;
  transition: rotate 600ms var(--ease-spring), translate 600ms var(--ease-spring);
}

.slip:nth-child(even) {
  rotate: 1.2deg;
}

/* the paper clip */
.slip::before {
  content: '';
  position: absolute;
  top: -9px;
  left: 22px;
  width: 11px;
  height: 26px;
  border: 2px solid color-mix(in srgb, var(--ink) 45%, transparent);
  border-radius: 6px;
}

.slip:hover {
  rotate: 0deg;
  translate: 0 -3px;
}

.slip__title {
  font-family: var(--font-serif);
  font-size: 19px;
  color: var(--ink);
}

.slip__author {
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--muted);
}

@media (max-width: 640px) {
  .journal {
    --card-h: 200px;
    --strip: 72px;
    padding: 36px 16px 72px;
  }
  .front {
    padding: 26px 18px 24px;
  }
  .front__label {
    padding: 9px 22px 10px;
  }
  .drawer {
    padding-left: 12px;
    padding-right: 12px;
    box-shadow:
      inset 0 0 0 6px var(--steel),
      inset 0 22px 26px -18px rgba(0, 0, 0, 0.45);
  }
  .card {
    padding: 13px 16px 0;
  }
  .card__by,
  .card__title {
    max-width: calc(100% - 112px);
  }
  .card__title {
    font-size: 20px;
  }
  .card__stamp {
    top: 14px;
    right: 12px;
    font-size: 10px;
  }
  .card__meta {
    left: 16px;
  }
  .guide__tab {
    font-size: 16px;
    padding: 6px 14px 0;
  }
}
</style>
