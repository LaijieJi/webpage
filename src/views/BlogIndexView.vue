<template>
  <div class="journal">
    <!-- sticky cover -->
    <section class="cover">
      <p class="cover__vol">Vol. one</p>
      <h1 class="cover__title">The Journal</h1>
      <p class="cover__hand">pull up a chair -</p>
      <div class="cover__ornament" aria-hidden="true">
        <span class="cover__ornament-rule"></span>
        <span class="cover__ornament-dot"></span>
        <span class="cover__ornament-rule"></span>
      </div>
      <div class="cover__frame">
        <div class="cover__photo">
          <ResponsiveImg :src="lamyImg.src" :webp="lamyImg.webp" alt="My Lamy Safari resting on a notebook" fill cover eager />
        </div>
      </div>
      <p class="cover__cap">my Lamy Safari - where the words come from</p>
      <p class="cover__scroll">↓ scroll to open</p>
    </section>

    <!-- the journal sheet -->
    <div class="journal__wrap">
      <ShelfIndex />

      <div v-if="webglOk" class="journal__views">
        <button
          type="button"
          class="journal__view"
          :aria-pressed="view === 'shelf'"
          @pointerenter="prefetchShelf"
          @pointerdown="prefetchShelf"
          @focus="prefetchShelf"
          @click="setView(view === 'shelf' ? 'paper' : 'shelf')"
        >
          {{ view === 'shelf' ? 'back to the page' : 'see the shelf' }}
        </button>
      </div>

      <div v-if="showCovers" ref="coverSheet" class="journal__covers"></div>

      <div ref="stackEl" class="journal__stack" :data-stage="stage">
        <!-- ribbon bookmarks peeking out from between the stacked pages -->
        <nav v-if="paperOn && pageCount > 1" class="journal__tabs" aria-label="Journal pages">
          <button
            v-for="n in pageCount"
            :key="n"
            type="button"
            class="journal__tab"
            :class="{ 'journal__tab--active': n - 1 === page }"
            :aria-current="n - 1 === page ? 'page' : undefined"
            :aria-label="`Turn to page ${n}`"
            @click="goToPage(n - 1)"
          >
            <span class="journal__tab-ribbon">{{ toRoman(n) }}</span>
          </button>
        </nav>

        <transition v-if="paperOn" :name="turnName" @after-leave="unlockTurn">
          <div class="journal__leaf" :key="page">
            <div class="journal__sheet">
              <span class="journal__shade" aria-hidden="true"></span>
              <span class="journal__margin" aria-hidden="true"></span>
              <span class="journal__river" aria-hidden="true">
                <svg width="12" height="100%" viewBox="0 0 12 1000" preserveAspectRatio="none">
                  <path d="M6 0 C 9 120, 3 240, 6 360 C 9 480, 3 620, 6 740 C 8 860, 4 940, 6 1000" fill="none" stroke="var(--accent2)" stroke-width="1.4" stroke-linecap="round" opacity="0.45" />
                </svg>
              </span>
              <span class="journal__stamp" aria-hidden="true"></span>
              <span v-if="page === 0" class="journal__scribble" aria-hidden="true">newest first ↓</span>

              <div class="journal__body">
                <div class="journal__head">
                  <p class="journal__kicker">The Journal</p>
                  <p v-if="page > 0" class="journal__cont" aria-hidden="true">…continued</p>
                </div>
                <template v-if="page === 0">
                  <h2 class="journal__title">Notes from a slow reader.</h2>
                  <p class="journal__lede">Books I've loved, things I'm learning, and the occasional letter to myself.</p>
                </template>

                <router-link
                  v-for="post in pagedPosts"
                  :key="post.slug"
                  class="entry"
                  v-reveal
                  :to="`/blog/${post.slug}`"
                >
                  <div class="entry__date">{{ dateShort(post.frontmatter.date) }}</div>
                  <div>
                    <div class="entry__tags"><template v-for="tag in post.frontmatter.tags" :key="tag"><span :style="tagColor(tag) ? { color: tagColor(tag) } : null">{{ tag }}</span> · </template>{{ post.readingTime }} min</div>
                    <h2 class="entry__title">{{ post.frontmatter.title }}</h2>
                    <p v-if="post.frontmatter.excerpt" class="entry__excerpt">{{ post.frontmatter.excerpt }}</p>
                  </div>
                </router-link>

                <div class="journal__foot">
                  <button v-if="page > 0" type="button" class="journal__flip" @click="goToPage(page - 1)">← back a page</button>
                  <span v-else aria-hidden="true"></span>
                  <span class="journal__foot-mark">~ {{ pageWord }} ~</span>
                  <button v-if="page < pageCount - 1" type="button" class="journal__flip journal__flip--next" @click="goToPage(page + 1)">turn the page →</button>
                  <span v-else aria-hidden="true"></span>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Invisible ghosts of every page keep the notebook sized to its
             tallest page, so turning never makes the sheet twitch. -->
        <template v-if="paperOn && pageCount > 1">
          <div
            v-for="n in pageCount"
            :key="`ghost-${n}`"
            class="journal__leaf journal__leaf--ghost"
            aria-hidden="true"
          >
            <div class="journal__sheet">
              <div class="journal__body">
                <div class="journal__head">
                  <p class="journal__kicker">The Journal</p>
                  <p v-if="n > 1" class="journal__cont">…continued</p>
                </div>
                <template v-if="n === 1">
                  <p class="journal__title">Notes from a slow reader.</p>
                  <p class="journal__lede">Books I've loved, things I'm learning, and the occasional letter to myself.</p>
                </template>
                <div v-for="post in pageSlice(n - 1)" :key="post.slug" class="entry">
                  <div class="entry__date">{{ dateShort(post.frontmatter.date) }}</div>
                  <div>
                    <div class="entry__tags"><template v-for="tag in post.frontmatter.tags" :key="tag"><span :style="tagColor(tag) ? { color: tagColor(tag) } : null">{{ tag }}</span> · </template>{{ post.readingTime }} min</div>
                    <p class="entry__title">{{ post.frontmatter.title }}</p>
                    <p v-if="post.frontmatter.excerpt" class="entry__excerpt">{{ post.frontmatter.excerpt }}</p>
                  </div>
                </div>
                <div class="journal__foot">
                  <span class="journal__flip">← back a page</span>
                  <span class="journal__foot-mark">~ one ~</span>
                  <span class="journal__flip journal__flip--next">turn the page →</span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <div v-if="shelfOn" ref="shelfSlotEl" class="journal__shelf-slot">
          <JournalShelf :fade-in="stage === 'shelf'" @ready="onShelfReady" />
        </div>

        <span v-if="stage === 'paper'" class="visually-hidden" aria-live="polite">Page {{ page + 1 }} of {{ pageCount }}</span>
      </div>

      <section class="shelf" v-reveal>
        <p class="shelf__eyebrow">On the shelf</p>
        <p class="shelf__sub">The ones I'll be reading next.</p>
        <ul class="shelf__list">
          <li v-for="book in readingList" :key="book.title" class="shelf__item">
            <span class="shelf__title">{{ book.title }}</span>
            <span class="shelf__author">{{ book.author }}</span>
          </li>
        </ul>
        <p class="shelf__note">can't wait for these →</p>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick, defineAsyncComponent, h } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import posts from '../data/posts.js';
import { readingList } from '../data/books.js';
import { lamyImg } from '../data/media.js';
import ResponsiveImg from '../components/ResponsiveImg.vue';
import ShelfIndex from '../components/ShelfIndex.vue';
import { bookcase } from '../components/shelf/book.js';
import { useSeo } from '../composables/useSeo.js';

// three.js lives in this chunk and nowhere else. An async component does not
// resolve during SSR either, so the prerendered HTML is always the paper view.
// Both placeholders are render functions: the site ships Vue's runtime-only
// build, which silently renders nothing for a `template` string.
const loadShelf = () => import('../components/JournalShelf.vue');
const JournalShelf = defineAsyncComponent({
  loader: loadShelf,
  loadingComponent: {
    render: () => h('p', { class: 'journal__shelf-note' }, 'taking the books down…')
  },
  errorComponent: {
    render: () => h('p', { class: 'journal__shelf-note' }, [
      'The shelf did not load. ',
      h(RouterLink, { to: '/blog' }, () => 'Back to the page.')
    ])
  },
  delay: 200,
  timeout: 12000
});

useSeo({
  title: 'The Journal - Laijie Ji',
  description: 'Notes from a slow reader - book reviews and the occasional rabbit hole.',
  path: '/blog'
});

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function dateShort(value) {
  const d = value ? new Date(value) : new Date();
  return `${d.getDate()} ${MONTHS[d.getMonth()]}\n${d.getFullYear()}`;
}

// Special tag colours; every other tag inherits the muted default.
const TAG_COLORS = { cars: 'var(--garage)' };
function tagColor(tag) {
  return TAG_COLORS[tag] || null;
}

/* ---- Pagination: the journal turns like a bound notebook ---------------- */
const PAGE_SIZE = 4;
const pageCount = Math.max(1, Math.ceil(posts.length / PAGE_SIZE));

const route = useRoute();
const router = useRouter();

// Restore the open page from ?page= so refresh/back return to the same leaf.
const fromQuery = Math.floor(Number(route.query.page));
const page = ref(
  Number.isFinite(fromQuery) ? Math.min(Math.max(fromQuery - 1, 0), pageCount - 1) : 0
);

function pageSlice(i) {
  return posts.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE);
}

const pagedPosts = computed(() => pageSlice(page.value));

const PAGE_WORDS = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const pageWord = computed(() => PAGE_WORDS[page.value] || toRoman(page.value + 1));

const ROMAN = [[10, 'x'], [9, 'ix'], [5, 'v'], [4, 'iv'], [1, 'i']];
function toRoman(n) {
  let out = '';
  for (const [value, glyph] of ROMAN) {
    while (n >= value) {
      out += glyph;
      n -= value;
    }
  }
  return out;
}

// Probed synchronously in setup, so the first client render already knows:
// vite-ssg mounts fresh rather than hydrating, so there is no server markup to
// mismatch. On the server it is simply false - the prerender is paper.
let shelfSupport = null;
function canRunShelf() {
  if (typeof document === 'undefined') return false;
  if (shelfSupport === null) {
    try {
      const gl = document.createElement('canvas').getContext('webgl2')
        || document.createElement('canvas').getContext('webgl');
      shelfSupport = !!gl;
      // Hand the probe's context straight back rather than wait for GC.
      if (gl) gl.getExtension('WEBGL_lose_context')?.loseContext();
    } catch (e) {
      shelfSupport = false;
    }
  }
  return shelfSupport;
}

/* ---- View: the paper journal, or the 3D shelf ---------------------------- */
// A query param, not a route: /blog stays the only canonical, prerendered URL.
// The shelf only exists where it can run: a shared ?view=shelf link opened with
// no WebGL lands on the paper journal instead of an empty box.
const webglOk = ref(canRunShelf());
// useRoute() is the router's current route, and it changes the moment a link
// is followed - while this view is still on screen fading out. Without this, a
// view leaving /blog?view=shelf for a review would read "no ?view" and swap back
// to paper mid-fade. Only this view's own path gets a say.
const ownPath = route.path;
let heldView = 'paper';
const view = computed(() => {
  if (route.path !== ownPath) return heldView;
  heldView = route.query.view === 'shelf' && webglOk.value ? 'shelf' : 'paper';
  return heldView;
});

/* ---- Swapping views -------------------------------------------------------
   `view` is what was asked for; `stage` is what is showing. The paper stays up
   until the shelf has drawn its first frame, then the two cross-fade in the same
   grid cell while the notebook's height eases to the new one - no empty moment,
   no jump. */
const SWAP_MS = 450;
const SWAP_EASE = 'cubic-bezier(0.45, 0.05, 0.25, 1)';
// If the shelf has not drawn by then (slow network, a failure), fade across
// anyway: the slot will be saying so.
const REVEAL_WITHIN_MS = 1500;

const stage = ref('paper');
const paperOn = ref(true); // the prerender is paper, so the client starts there too
const shelfOn = ref(view.value === 'shelf');
const shelfSlotEl = ref(null);
let shelfReady = false;
let onReady = null;

// Fetch the shelf on intent - hover, focus, press - so it is there by the click,
// without charging anyone who never reaches for the button.
function prefetchShelf() {
  loadShelf().catch(() => {});
}

function onShelfReady() {
  shelfReady = true;
  if (onReady) onReady();
}

function shelfSettled() {
  if (shelfReady) return Promise.resolve();
  return new Promise((resolve) => {
    onReady = resolve;
    setTimeout(resolve, REVEAL_WITHIN_MS);
  });
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const still = () => typeof window !== 'undefined'
  && window.matchMedia
  && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function tweenHeight(el, from, to) {
  el.classList.add('journal__stack--resizing');
  if (still() || Math.abs(from - to) < 1) return Promise.resolve();
  el.style.height = `${from}px`;
  void el.offsetHeight; // commit the start height before transitioning
  el.style.transition = `height ${SWAP_MS}ms ${SWAP_EASE}`;
  el.style.height = `${to}px`;
  return wait(SWAP_MS);
}

function releaseHeight(el) {
  el.style.transition = '';
  el.style.height = '';
  el.classList.remove('journal__stack--resizing');
}

async function toShelf() {
  shelfOn.value = true;
  await shelfSettled();
  if (view.value !== 'shelf') return;
  await nextTick();
  const el = stackEl.value;
  const from = el.getBoundingClientRect().height;
  // The shelf's own height - or, if it is still only a loading line, the 16:10
  // it is about to be, so the notebook does not close up and then jump open.
  const shelf = shelfSlotEl.value && shelfSlotEl.value.firstElementChild;
  const width = el.getBoundingClientRect().width;
  const to = Math.max(shelf ? shelf.getBoundingClientRect().height : 0, (width * 10 * bookcase(posts.length).scale) / 16);
  stage.value = 'shelf'; // paper fades out, shelf fades in...
  await tweenHeight(el, from, to); // ...while the notebook closes up to the shelf
  paperOn.value = false;
  await nextTick();
  releaseHeight(el);
}

async function toPaper() {
  const el = stackEl.value;
  const from = el.getBoundingClientRect().height;
  el.style.height = `${from}px`; // hold the height while the paper mounts
  paperOn.value = true;
  await nextTick();
  el.style.height = 'auto';
  const to = el.getBoundingClientRect().height;
  stage.value = 'paper'; // the page fades in as it unrolls to its full height
  await tweenHeight(el, from, to);
  shelfOn.value = false;
  shelfReady = false;
  releaseHeight(el);
}

// One swap at a time; a change of mind mid-swap is picked up when it lands.
let swapping = null;
function syncView() {
  if (swapping) return swapping;
  swapping = (async () => {
    while (stage.value !== view.value) {
      if (view.value === 'shelf') await toShelf();
      else await toPaper();
    }
    if (stage.value === 'paper' && shelfOn.value && view.value === 'paper') {
      shelfOn.value = false;
      shelfReady = false;
    }
  })().finally(() => {
    swapping = null;
    if (stage.value !== view.value) syncView();
  });
  return swapping;
}

watch(view, syncView);
onMounted(syncView);

function setView(next) {
  if (next === view.value) return;
  const query = { ...route.query };   // spread keeps ?page= intact
  if (next === 'shelf') query.view = 'shelf';
  else delete query.view;
  router.replace({ query });
}


/* ---- Dev-only contact sheet: ?covers=1 paints all fifteen generated covers
   in a grid so they can be eyeballed once. Gated on DEV so it cannot ship. --- */
const showCovers = computed(() => import.meta.env.DEV && route.query.covers === '1');
const coverSheet = ref(null);

watch(showCovers, async (on) => {
  if (!on) return;
  const [{ ensureFonts, drawFront }, { readPalette }] = await Promise.all([
    import('../components/shelf/covers.js'),
    import('../components/shelf/palette.js')
  ]);
  await ensureFonts();
  const palette = readPalette();
  const host = coverSheet.value;
  if (!host) return;
  host.innerHTML = '';
  for (const post of posts) {
    const src = drawFront(post, palette, { width: 256, height: 384 });
    const out = document.createElement('canvas');
    out.width = 256;
    out.height = 384;
    out.getContext('2d').drawImage(src, 0, 0);
    out.style.cssText = 'width:128px;height:192px;margin:6px;border:1px solid #0002';
    host.appendChild(out);
  }
}, { immediate: true });

const turnName = ref('turn-fwd');
const turning = ref(false);
const stackEl = ref(null);
let unlockTimer = 0;

function goToPage(next) {
  if (turning.value || next === page.value || next < 0 || next > pageCount - 1) return;
  turnName.value = next > page.value ? 'turn-fwd' : 'turn-back';
  turning.value = true;
  page.value = next;

  const query = { ...route.query };
  if (next > 0) query.page = String(next + 1);
  else delete query.page;
  router.replace({ query });

  // If the reader is deep into the sheet, bring the fresh page's top back into view.
  const el = stackEl.value;
  if (el && el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: 'start' });

  clearTimeout(unlockTimer);
  unlockTimer = setTimeout(unlockTurn, 900); // safety net if animation events never fire
}

function unlockTurn() {
  clearTimeout(unlockTimer);
  turning.value = false;
}
</script>

<style scoped>
.journal {
  position: relative;
}

/* ---- Sticky cover ------------------------------------------------------- */
.cover {
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 40px;
  background:
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 33px,
      rgba(60, 58, 50, 0.06) 33px,
      rgba(60, 58, 50, 0.06) 34px
    ),
    var(--shade);
}

.cover::before {
  content: '';
  position: absolute;
  inset: 22px;
  border: 1px solid var(--line);
  pointer-events: none;
}

.cover__vol {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--muted);
  margin: 0 0 22px;
}

.cover__title {
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(40px, 7.5vw, 88px);
  line-height: 1;
  letter-spacing: -0.02em;
  margin: 0;
  white-space: nowrap;
}

.cover__hand {
  font-family: var(--font-hand);
  font-size: clamp(24px, 3vw, 32px);
  color: var(--accent);
  transform: rotate(-2.5deg);
  margin: 26px 0 0;
  white-space: nowrap;
}

.cover__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: 26px 0 2px;
}

.cover__ornament-rule {
  width: 46px;
  height: 1px;
  background: var(--line);
}

.cover__ornament-dot {
  width: 7px;
  height: 7px;
  background: var(--accent);
  transform: rotate(45deg);
}

.cover__frame {
  margin-top: 42px;
  background: #fffdf7;
  padding: 9px;
  box-shadow: 0 20px 36px -20px rgba(42, 38, 32, 0.5);
  transform: rotate(-2.5deg);
}

.cover__photo {
  overflow: hidden;
  width: min(300px, 72vw);
  height: 200px;
}

.cover__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cover__cap {
  font-family: var(--font-hand);
  font-size: 20px;
  color: var(--muted);
  transform: rotate(-1.5deg);
  margin: 20px 0 0;
}

.cover__scroll {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--faint);
  margin: 46px 0 0;
}

/* ---- Journal sheet ------------------------------------------------------ */
.journal__wrap {
  position: relative;
  z-index: 1;
  background: var(--paper);
  padding: 72px 40px 84px;
  box-shadow: 0 -24px 50px -28px rgba(42, 38, 32, 0.45);
  /* Keep turning pages from causing sideways scroll. Lives here - NOT on
     .journal - because an overflow ancestor breaks the sticky cover in Safari. */
  overflow-x: clip;
}

/* The stack holds the current leaf, the incoming/outgoing leaf mid-turn,
   and the ribbon bookmarks. Perspective makes the turn read as paper. */
.journal__stack {
  position: relative;
  max-width: 860px;
  margin: 0 auto;
  display: grid;
  perspective: 2200px;
  scroll-margin-top: 28px;
}

.journal__leaf {
  grid-area: 1 / 1;
  position: relative;
  z-index: 1; /* above the ribbon tabs tucked behind the sheet */
  min-width: 0;
  transform-origin: left center; /* pages pivot on the spine */
  backface-visibility: hidden;
}

/* Size-only ghosts: they occupy the same grid cell so the row is always as
   tall as the tallest page, but never paint or catch the pointer. */
.journal__leaf--ghost {
  visibility: hidden;
  pointer-events: none;
  z-index: -1;
}

.journal__sheet {
  position: relative;
  width: 100%;
  height: 100%;
  /* A notebook page has a fixed size - short pages keep it, leaving blank
     ruled lines at the bottom. */
  min-height: 660px;
  background:
    repeating-linear-gradient(
      to bottom,
      transparent 0,
      transparent 31px,
      rgba(60, 58, 50, 0.09) 31px,
      rgba(60, 58, 50, 0.09) 32px
    ),
    var(--surface);
  border: 1px solid var(--line);
  /* Stacked page-edges peeking out, so it reads as a bound journal. */
  box-shadow:
    8px 10px 0 -1px var(--surface),
    8px 10px 0 0 var(--line),
    16px 20px 0 -1px var(--surface),
    16px 20px 0 0 var(--line),
    24px 30px 0 -1px var(--surface),
    24px 30px 0 0 var(--line),
    0 46px 76px -46px rgba(42, 38, 32, 0.5);
  padding: 50px 56px 36px 96px;
  --tilt: -0.5deg;
  transform: rotate(var(--tilt));
  display: flex;
  flex-direction: column;
}

/* The sheet (and its printed margin, river, stamp & scribble) keep the tilt;
   the written content is levelled back so entries read straight. */
.journal__body {
  transform: rotate(calc(-1 * var(--tilt)));
  /* Fill the fixed page so the foot can sit on its bottom edge. */
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* Paper shading painted over a leaf while it lifts or lands. */
.journal__shade {
  position: absolute;
  inset: -1px;
  z-index: 6;
  pointer-events: none;
  opacity: 0;
  background: linear-gradient(to right, rgba(30, 32, 28, 0) 25%, rgba(30, 32, 28, 0.5));
}

/* ---- Page turn ----------------------------------------------------------
   Forward: the current leaf lifts at its free edge and swings over the
   spine, revealing the next page beneath. Back: a turned leaf swings back
   in from the left and settles on the pile. */
.turn-fwd-leave-active {
  z-index: 3;
  animation: lj-turn-out 700ms cubic-bezier(0.42, 0.05, 0.4, 1) both;
  will-change: transform;
}

.turn-fwd-enter-active {
  z-index: 1;
  animation: lj-hold 700ms linear both;
}

.turn-back-enter-active {
  z-index: 3;
  animation: lj-turn-in 700ms cubic-bezier(0.22, 0.61, 0.3, 1) both;
  will-change: transform;
}

.turn-back-leave-active {
  z-index: 1;
  animation: lj-hold 700ms linear both;
}

/* A leaf in flight carries one soft cast shadow; the constant pile of page
   edges is painted by the leaf beneath it. */
.turn-fwd-leave-active .journal__sheet,
.turn-back-enter-active .journal__sheet {
  box-shadow: 0 34px 54px -26px rgba(22, 24, 20, 0.45);
}

/* Underside shading: darkens as a leaf lifts, lifts off the page beneath. */
.turn-fwd-leave-active .journal__shade {
  animation: lj-underside 700ms ease-in both;
}

.turn-fwd-enter-active .journal__shade {
  animation: lj-uncover 700ms ease both;
}

.turn-back-enter-active .journal__shade {
  animation: lj-underside 700ms ease-out reverse both;
}

.turn-back-leave-active .journal__shade {
  animation: lj-uncover 700ms ease reverse both;
}

@keyframes lj-turn-out {
  from { transform: rotateY(0deg); }
  to { transform: rotateY(-97deg); }
}

@keyframes lj-turn-in {
  from { transform: rotateY(-97deg); }
  to { transform: rotateY(0deg); }
}

/* No-op hold so the resting leaf stays mounted for the full turn. */
@keyframes lj-hold {
  from { opacity: 1; }
  to { opacity: 1; }
}

@keyframes lj-underside {
  from { opacity: 0; }
  to { opacity: 0.6; }
}

@keyframes lj-uncover {
  from { opacity: 0.32; }
  to { opacity: 0; }
}

/* ---- Ribbon bookmarks ---------------------------------------------------
   Page markers hanging out of the bottom of the journal, roots tucked up
   behind the sheet and its pile of page edges; the open page's ribbon is
   pulled out a little further. */
.journal__covers {
  max-width: 860px;
  margin: 0 auto 24px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

/* The swap: paper and shelf share one grid cell and cross-fade on `stage`. */
.journal__stack > .journal__leaf:not(.journal__leaf--ghost),
.journal__tabs,
.journal__shelf-slot {
  transition: opacity 450ms ease;
}

.journal__stack[data-stage='shelf'] > .journal__leaf,
.journal__stack[data-stage='shelf'] .journal__tabs,
.journal__stack[data-stage='paper'] .journal__shelf-slot {
  opacity: 0;
  pointer-events: none;
}

/* While the height eases, clip the taller view and tuck the hanging bookmarks
   away; they fade back in once the notebook has settled. */
.journal__stack--resizing {
  overflow: clip;
}

.journal__stack--resizing .journal__tabs {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .journal__stack > .journal__leaf:not(.journal__leaf--ghost),
  .journal__tabs,
  .journal__shelf-slot {
    transition: none;
  }
}

.journal__views {
  max-width: 860px;
  margin: 0 auto 18px;
  display: flex;
  justify-content: flex-end;
}

.journal__view {
  padding: 4px 2px;
  background: none;
  border: 0;
  border-bottom: 1px solid transparent;
  font-family: var(--font-mono);
  font-size: 12.5px;
  letter-spacing: 0.08em;
  color: var(--muted);
  cursor: pointer;
  transition: color var(--transition), border-color var(--transition);
}

.journal__view:hover,
.journal__view:focus-visible {
  color: var(--ink);
  border-bottom-color: var(--line);
}

/* Same grid cell the leaves use, so the shelf sits where the page would. */
.journal__shelf-slot {
  grid-area: 1 / 1;
  min-width: 0;
}

.journal__shelf-note {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
  text-align: center;
  padding: 60px 0;
}

.journal__tabs {
  position: absolute;
  top: 100%;
  right: 36px;
  margin-top: -34px; /* underlap hides the ribbon roots behind the pile */
  z-index: 0;
  display: flex;
  gap: 12px;
}

.journal__tab {
  width: 34px;
  height: 100px;
  padding: 0;
  filter: drop-shadow(0 3px 3px rgba(25, 26, 22, 0.22));
  transition: transform var(--transition);
}

.journal__tab:hover,
.journal__tab:focus-visible {
  transform: translateY(5px); /* a little tug */
}

.journal__tab--active,
.journal__tab--active:hover,
.journal__tab--active:focus-visible {
  transform: translateY(11px);
}

.journal__tab-ribbon {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
  padding-bottom: 15px;
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% calc(100% - 10px), 0 100%);
  background: var(--shade);
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.06em;
  color: var(--muted);
  transition: background var(--transition), color var(--transition);
}

.journal__tab:hover .journal__tab-ribbon,
.journal__tab:focus-visible .journal__tab-ribbon {
  color: var(--accent);
}

.journal__tab--active .journal__tab-ribbon {
  background: var(--accent2);
  color: var(--surface);
}

.journal__margin {
  position: absolute;
  left: 30px;
  top: 34px;
  bottom: 34px;
  border-left: 2px dotted var(--line);
}

.journal__river {
  position: absolute;
  left: 66px;
  top: 8px;
  bottom: 8px;
  width: 12px;
}

.journal__river svg {
  display: block;
  overflow: visible;
}

.journal__stamp {
  position: absolute;
  top: 26px;
  right: 44px;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 7px solid rgba(120, 82, 40, 0.07);
  transform: rotate(-8deg);
  pointer-events: none;
  transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.4s ease;
}

.journal__sheet:hover .journal__stamp {
  transform: rotate(-3deg) scale(1.08);
  border-color: rgba(120, 82, 40, 0.16);
}

.journal__scribble {
  position: absolute;
  top: 130px;
  right: 40px;
  font-family: var(--font-hand);
  font-size: 21px;
  color: var(--accent2);
  transform: rotate(-5deg);
  pointer-events: none;
}

.journal__head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid var(--line);
  padding-bottom: 16px;
}

.journal__kicker {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0;
}

.journal__cont {
  font-family: var(--font-hand);
  font-size: 20px;
  color: var(--muted);
  transform: rotate(-2deg);
  margin: 0;
}

.journal__title {
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(30px, 4.4vw, 46px);
  line-height: 1.08;
  margin: 24px 0 0;
}

.journal__lede {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 18px;
  color: var(--muted);
  margin: 14px 0 6px;
  max-width: 48ch;
}

.entry {
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 22px;
  text-align: left;
  border-top: 1px solid var(--line);
  padding: 26px 0 24px;
  color: var(--ink);
  transition: opacity var(--transition);
}

/* On continued pages the head rule already separates; avoid a doubled line. */
.journal__head + .entry {
  border-top: none;
}

.entry:hover,
.entry:focus-visible {
  opacity: 0.72;
}

.entry__date {
  font-family: var(--font-hand);
  font-size: 22px;
  color: var(--accent2);
  line-height: 1.15;
  white-space: pre-line;
}

.entry__tags {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 8px;
}

.entry__title {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: 26px;
  line-height: 1.15;
  margin: 0 0 8px;
  color: var(--ink);
}

.entry__excerpt {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 18px;
  line-height: 1.5;
  color: var(--muted);
  margin: 0;
}

.journal__foot {
  border-top: 1px solid var(--line);
  padding-top: 22px;
  /* Pin to the bottom of the page; short pages keep blank ruled lines above. */
  margin-top: auto;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: baseline;
  gap: 12px;
}

.journal__foot-mark {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--faint);
  text-align: center;
}

/* Handwritten page-turn links, like notes at the foot of the page. */
.journal__flip {
  justify-self: start;
  padding: 0;
  font-family: var(--font-hand);
  font-size: 21px;
  line-height: 1.2;
  color: var(--accent);
  transform: rotate(-1.2deg);
  transition: color var(--transition), transform var(--transition);
}

.journal__flip--next {
  justify-self: end;
  transform: rotate(1.2deg);
}

.journal__flip:hover,
.journal__flip:focus-visible {
  color: var(--accent2);
  transform: rotate(-1.2deg) translateX(-3px);
}

.journal__flip--next:hover,
.journal__flip--next:focus-visible {
  color: var(--accent2);
  transform: rotate(1.2deg) translateX(3px);
}

/* On the shelf - reading list below the journal. */
.shelf {
  max-width: 860px;
  margin: 84px auto 0; /* room for the bookmarks hanging off the journal */
}

.shelf__eyebrow {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--accent);
  margin: 0;
}

.shelf__sub {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 18px;
  color: var(--muted);
  margin: 8px 0 0;
}

.shelf__list {
  list-style: none;
  margin: 22px 0 0;
  padding: 0;
}

.shelf__item {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 16px;
  flex-wrap: wrap;
  border-top: 1px solid var(--line);
  padding: 16px 0;
}

.shelf__title {
  font-family: var(--font-serif);
  font-size: 21px;
  color: var(--ink);
}

.shelf__author {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
  white-space: nowrap;
}

.shelf__note {
  font-family: var(--font-hand);
  font-size: 22px;
  color: var(--accent2);
  transform: rotate(-2deg);
  margin: 20px 0 0;
  text-align: right;
}

@media (max-width: 640px) {
  .journal__wrap { padding: 48px 18px 92px; } /* room for the hanging bookmarks */
  .journal__sheet { padding: 40px 24px 30px 56px; min-height: 0; }
  .journal__margin { left: 18px; }
  .journal__river { left: 40px; }
  .journal__stamp { display: none; }
  .journal__scribble { display: none; }
  .journal__tabs { right: 22px; gap: 10px; }
  .entry { grid-template-columns: 64px 1fr; gap: 16px; }
  .journal__foot {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: baseline;
  }
  .journal__foot-mark {
    order: 3;
    width: 100%;
    margin-top: 10px;
  }
  .journal__flip { font-size: 19px; }
  .journal__flip--next { order: 2; }
}
</style>
