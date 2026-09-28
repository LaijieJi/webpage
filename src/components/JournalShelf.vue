<template>
  <div
    class="journal-shelf"
    :class="{ 'journal-shelf--fade-in': fadeIn }"
    :style="{ aspectRatio: `16 / ${10 * shelfScale}`, '--shelf-scale': shelfScale }"
  >
    <!-- Presentation only. ShelfIndex carries the real, focusable interface. -->
    <canvas
      v-show="!failed"
      ref="canvasEl"
      class="journal-shelf__canvas"
      :class="{ 'journal-shelf__canvas--drawn': drawn }"
      aria-hidden="true"
    ></canvas>

    <!-- No WebGL, a lost context, fonts that never arrived: say so rather than
         present a void. The entries are all still in ShelfIndex. -->
    <p v-if="failed" class="journal-shelf__fail">
      The shelf could not be drawn here. <router-link to="/blog">Back to the page.</router-link>
    </p>

    <!-- The words are HTML, never canvas: selectable, crawlable, zoomable. -->
    <transition name="journal-shelf-card">
      <aside v-if="openPost" class="journal-shelf__card" :style="cardStyle">
        <p class="journal-shelf__kicker">
          {{ openPost.frontmatter.bookAuthor || 'from the journal' }}
        </p>
        <h3 class="journal-shelf__title">
          {{ openPost.frontmatter.book || openPost.frontmatter.title }}
        </h3>
        <p v-if="openPost.frontmatter.excerpt" class="journal-shelf__excerpt">
          {{ openPost.frontmatter.excerpt }}
        </p>
        <router-link v-slot="{ href }" :to="`/blog/${openPost.slug}`" custom>
          <a class="journal-shelf__read" :href="href" @click="read($event, openPost.slug)">read this →</a>
        </router-link>
        <button type="button" class="journal-shelf__close" @click="closeBook">put it back</button>
      </aside>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import allPosts from '../data/posts.js';
import { createScene } from './shelf/scene.js';
import { ensureFonts } from './shelf/covers.js';
import { readPalette, onPaletteChange } from './shelf/palette.js';
import { bookcase } from './shelf/book.js';

// `ready` tells the journal the shelf can be shown: drawn, or failed with a
// message worth showing. Either way there is something to fade across to.
const emit = defineEmits(['ready']);
// Normally the journal is still hiding the shelf when it first draws, and fades
// the whole slot across itself - a second fade on the canvas would multiply with
// that one and leave a dim moment. Only when the slot is already showing (a slow
// load that outlasted the wait) does the canvas fade in on its own.
defineProps({ fadeIn: { type: Boolean, default: false } });
const router = useRouter();
const route = useRoute();

// Dev only: ?books=40 fills the case with repeats, to see how it will look with
// more entries than exist yet.
const demoCount = import.meta.env.DEV ? Number(route.query.books) || 0 : 0;
const posts = demoCount > 0
  ? Array.from({ length: demoCount }, (_, i) => {
      const post = allPosts[i % allPosts.length];
      return i < allPosts.length ? post : { ...post, slug: `${post.slug}~${i}` };
    })
  : allPosts;

// A taller case means a taller canvas; the camera steps back to match, so the
// books stay the same size on screen.
const shelfScale = bookcase(posts.length).scale;

const canvasEl = ref(null);
const openPost = ref(null);
const failed = ref(false);
const drawn = ref(false);
const cardStyle = ref(null);
const isNarrow = ref(false);
let leaning = false;
let api = null;
let stopPalette = null;
let observer = null;
let stopPick = null;
let narrow = null;
let unmounted = false;

// Under 900px the card stacks below the canvas; above it, it sits over the right
// of the canvas and the open book moves left to stay clear of it.
const NARROW = '(max-width: 900px)';

function fail() {
  failed.value = true;
  openPost.value = null;
  if (api) api.stop();
  emit('ready');
}

// "read this": lean in over the open book, then let the review take over. A
// modified click (new tab, new window) keeps the browser's own behaviour.
function read(event, slug) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  if (!api || leaning || api.busy()) return;
  leaning = true;
  openPost.value = null; // the card steps aside as the reader leans in
  api
    .leanIn()
    .catch(() => {})
    // leanIn in history state tells scrollBehavior to wait for the fade.
    .then(() => router.push({ path: `/blog/${slug}`, state: { leanIn: true } }))
    .finally(() => {
      leaning = false;
    });
}

function onContextLost(event) {
  event.preventDefault();
  fail();
}

function onNarrowChange() {
  isNarrow.value = narrow.matches;
  if (api) api.setLayout({ cardBeside: !narrow.matches });
  if (api && openPost.value) placeCard(api.openIndex());
}

// With one shelf the card keeps the place it has always had. On a taller case
// the open book is held at its own shelf's height, so the card goes beside it
// (below it on a narrow screen) rather than at the foot of a canvas that may be
// a screen away.
function placeCard(index) {
  if (!api || api.shelves === 1 || index < 0) {
    cardStyle.value = null;
    return;
  }
  const r = api.readingRect(index);
  cardStyle.value = isNarrow.value
    ? { position: 'absolute', top: `${r.bottom + 12}px`, left: '0', right: '0', bottom: 'auto', width: 'auto', marginTop: '0' }
    : { top: `${r.top + 0.36 * (r.bottom - r.top)}px`, bottom: 'auto' };
}

function closeBook() {
  if (!api || api.busy()) return;
  openPost.value = null; // the card goes as soon as the book starts back
  api.close().catch(fail);
}

onMounted(async () => {
  try {
    await ensureFonts(); // never draw to canvas before the faces land
    if (unmounted || !canvasEl.value) return;

    canvasEl.value.addEventListener('webglcontextlost', onContextLost);
    api = createScene(canvasEl.value, { posts, palette: readPalette() });

    narrow = window.matchMedia(NARROW);
    isNarrow.value = narrow.matches;
    narrow.addEventListener('change', onNarrowChange);
    api.setLayout({ cardBeside: !narrow.matches });

    // Observe the canvas, not its parent: under 900px the parent also holds the
    // stacked card, and sizing the renderer to canvas+card would stretch the scene.
    observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (api) api.resize(width, height);
    });
    observer.observe(canvasEl.value);
    api.resize(canvasEl.value.clientWidth, canvasEl.value.clientHeight);

    stopPalette = onPaletteChange((next) => api && api.setPalette(next));

    stopPick = api.onPick((index) => {
      if (api.busy()) return;
      if (api.openIndex() === index) return closeBook();
      // Never show one book's card over another: clear it now, and name the next
      // book as it starts to come off the shelf.
      openPost.value = null;
      const settled = api.openIndex() >= 0 ? api.close() : Promise.resolve();
      settled
        .then(() => {
          placeCard(index);
          openPost.value = posts[index];
          return api.open(index);
        })
        .catch(fail);
    });

    if (import.meta.env.DEV) window.__journalShelf = api.debug;
    const firstDraw = api.drawn();
    api.start();
    await firstDraw;
    drawn.value = true;
    emit('ready');
  } catch (error) {
    // No WebGL context, fonts that never arrive, a canvas that cannot be drawn:
    // say so and offer the page, rather than leave an empty box.
    console.warn('[journal shelf]', error);
    fail();
  }
});

// Vue unmounts a component the moment its route starts to leave, but keeps the
// DOM up for the page fade. Disposing then would blank the canvas mid-fade - the
// reader would lean in and see white. So stop drawing now, keep the last frame on
// screen, and release the context once the canvas has actually left the page.
function disposeWhenDetached(el, dispose) {
  const started = performance.now();
  (function check() {
    if (!el || !el.isConnected || performance.now() - started > 3000) dispose();
    else setTimeout(check, 50);
  })();
}

onBeforeUnmount(() => {
  unmounted = true;
  const el = canvasEl.value;
  if (el) el.removeEventListener('webglcontextlost', onContextLost);
  if (narrow) narrow.removeEventListener('change', onNarrowChange);
  if (observer) observer.disconnect();
  if (stopPalette) stopPalette();
  if (stopPick) stopPick();
  if (api) {
    const leaving = api;
    leaving.stop();
    disposeWhenDetached(el, () => leaving.dispose());
  }
  leaning = false;
  api = null;
  if (import.meta.env.DEV) delete window.__journalShelf;
});
</script>

<style scoped>
.journal-shelf {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 10;
}

.journal-shelf__canvas {
  display: block;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.journal-shelf--fade-in .journal-shelf__canvas {
  transition: opacity 400ms ease;
}

.journal-shelf__canvas--drawn {
  opacity: 1;
}

.journal-shelf-card-enter-active,
.journal-shelf-card-leave-active {
  transition: opacity 260ms ease, transform 260ms ease;
}

.journal-shelf-card-enter-from,
.journal-shelf-card-leave-to {
  opacity: 0;
  transform: translateY(6px);
}

/* A card on its way out must not take a click meant for the next book. */
.journal-shelf-card-leave-active {
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .journal-shelf--fade-in .journal-shelf__canvas,
  .journal-shelf-card-enter-active,
  .journal-shelf-card-leave-active {
    transition: none;
  }
}

.journal-shelf__fail {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
  text-align: center;
  padding: 60px 0;
}

.journal-shelf__card {
  position: absolute;
  right: 0;
  bottom: 8%;
  width: min(300px, 44%);
  padding: 20px 22px 18px;
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: 0 18px 34px -26px rgba(42, 38, 32, 0.55);
}

.journal-shelf__kicker {
  margin: 0 0 6px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--faint);
}

.journal-shelf__title {
  margin: 0 0 10px;
  font-family: var(--font-serif);
  font-size: 20px;
  font-weight: 600;
  line-height: 1.25;
  color: var(--ink);
}

.journal-shelf__excerpt {
  margin: 0 0 14px;
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--muted);
}

.journal-shelf__read,
.journal-shelf__close {
  display: inline-block;
  padding: 0;
  background: none;
  border: 0;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  cursor: pointer;
}

.journal-shelf__read {
  color: var(--accent);
  margin-right: 14px;
}

.journal-shelf__close {
  color: var(--faint);
}

.journal-shelf__close:hover,
.journal-shelf__read:hover {
  color: var(--ink);
}

/* Under 900px the card stacks below the canvas instead of covering it. */
@media (max-width: 900px) {
  .journal-shelf {
    aspect-ratio: auto;
  }

  .journal-shelf__canvas {
    height: calc(62vw * var(--shelf-scale, 1));
  }

  .journal-shelf__card {
    position: static;
    width: auto;
    margin-top: 16px;
  }
}
</style>
