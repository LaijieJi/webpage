<template>
  <div class="photos">
    <header class="photos__head">
      <h1 class="photos__title">Photographs</h1>
      <p class="photos__sub">One frame from each trip.</p>
    </header>

    <!-- a contact sheet: every trip's frame printed on one strip of film, in the
         order they were taken. On desktop the cursor is a loupe. -->
    <div ref="sheetEl" class="sheet" :class="{ 'sheet--loupe': loupeReady }">
      <ol class="strip">
        <li
          v-for="(entry, i) in frames"
          :key="entry.slug"
          class="cell"
          :style="{ '--ratio': ratioOf(entry), '--n': i }"
        >
          <span class="cell__edge" aria-hidden="true">
            <span>▸{{ i + 1 }}</span>
            <span>{{ edgeDate(entry.frontmatter.date) }}</span>
          </span>
          <RouterLink :to="`/photography/${entry.slug}`" custom v-slot="{ href }">
            <a
              class="frame"
              :href="href"
              :aria-label="entry.frontmatter.title"
              @click="open($event, entry)"
              @pointerenter="pick(entry, $event)"
              @pointermove="moveLoupe($event, entry)"
              @pointerleave="hideLoupe"
              @focus="pick(entry)"
            >
              <ResponsiveImg
                :src="mediaFor(entry.slug).image"
                :webp="mediaFor(entry.slug).webp"
                :ratio="mediaFor(entry.slug).ratio"
                alt=""
                sizes="(max-width: 640px) 92vw, 320px"
                eager
              />
            </a>
          </RouterLink>
          <!-- the grease-pencil circle marking the pick -->
          <svg
            class="cell__pick"
            :class="{ 'cell__pick--on': picked === entry.slug }"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M52 4 C 80 3, 97 18, 96.5 48 C 96 80, 78 97, 49 96.5 C 20 96, 3.5 79, 4 50 C 4.4 22, 21 5, 57 6.5"
              fill="none"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              pathLength="1"
            />
          </svg>
          <p class="cell__cap">
            <span class="cell__title">{{ entry.frontmatter.title }}</span>
            <span class="cell__where">{{ placeOf(entry) }}, {{ dateLong(entry.frontmatter.date) }}</span>
          </p>
        </li>
      </ol>

      <span
        class="loupe"
        :class="{ 'loupe--on': loupe.on }"
        :style="loupe.style"
        aria-hidden="true"
      ></span>
    </div>

    <!-- what the pick is: follows hover and keyboard focus -->
    <transition name="caption" mode="out-in">
      <div :key="shown.slug" class="caption">
        <h2 class="caption__title">
          <RouterLink :to="`/photography/${shown.slug}`">{{ shown.frontmatter.title }}</RouterLink>
        </h2>
        <p class="caption__where">{{ placeOf(shown) }}, {{ dateLong(shown.frontmatter.date) }}</p>
        <p v-if="shown.frontmatter.excerpt" class="caption__excerpt">{{ shown.frontmatter.excerpt }}</p>
      </div>
    </transition>

    <a class="photos__ig" href="https://www.instagram.com/laijie.jpg/" target="_blank" rel="noreferrer">More photos on Instagram</a>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRouter, RouterLink } from 'vue-router';
import entries from '../data/photography.js';
import { mediaFor } from '../data/photoMedia.js';
import ResponsiveImg from '../components/ResponsiveImg.vue';
import { openWithMorph, isPlainClick } from '../composables/useMorph.js';
import { useSeo } from '../composables/useSeo.js';

useSeo({
  title: 'Photography - Laijie Ji',
  description: 'Photographs - one frame from each trip.',
  path: '/photography'
});

const router = useRouter();

// Printed in the order they were taken, like frames on a roll.
const frames = [...entries].reverse();
const newest = entries[0];

function ratioOf(entry) {
  const [w, h] = (mediaFor(entry.slug).ratio || '3 / 2').split('/').map(Number);
  return (w / h).toFixed(3);
}

// Place labels carry a short year ("Trieste · ’26"); the caption gives the full date.
function placeOf(entry) {
  return (mediaFor(entry.slug).place || entry.frontmatter.title).split(' · ')[0];
}

const pad = (n) => String(n).padStart(2, '0');
function edgeDate(value) {
  const d = new Date(value);
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${String(d.getFullYear()).slice(2)}`;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
function dateLong(value) {
  const d = new Date(value);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/* ---- The pick: circled in grease pencil, described in the caption ------- */
const picked = ref(null);
const shown = computed(() => entries.find((entry) => entry.slug === picked.value) || newest);
let firstPick = 0;

function pick(entry) {
  clearTimeout(firstPick);
  picked.value = entry.slug;
}

/* ---- Loupe: magnifies the print under the cursor ------------------------ */
const ZOOM = 3;
const RADIUS = 88;
const sheetEl = ref(null);
const loupeReady = ref(false);
const loupe = reactive({ on: false, style: {} });

function moveLoupe(event, entry) {
  if (!loupeReady.value) return;
  const frame = event.currentTarget.getBoundingClientRect();
  const sheet = sheetEl.value.getBoundingClientRect();
  const x = event.clientX - frame.left;
  const y = event.clientY - frame.top;
  loupe.on = true;
  loupe.style = {
    left: `${event.clientX - sheet.left - RADIUS}px`,
    top: `${event.clientY - sheet.top - RADIUS}px`,
    backgroundImage: `url("${mediaFor(entry.slug).image}")`,
    backgroundSize: `${frame.width * ZOOM}px ${frame.height * ZOOM}px`,
    backgroundPosition: `${RADIUS - x * ZOOM}px ${RADIUS - y * ZOOM}px`
  };
}

function hideLoupe() {
  loupe.on = false;
}

/* ---- Opening a frame: it lifts off the sheet and becomes the story's photo */
function open(event, entry) {
  if (!isPlainClick(event)) return;
  event.preventDefault();
  hideLoupe();
  openWithMorph(router, `/photography/${entry.slug}`, event.currentTarget, 'photo-hero');
}

onMounted(() => {
  loupeReady.value = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (loupeReady.value) {
    // The loupe shows the full-size prints; fetch them before the first hover.
    frames.forEach((entry) => {
      const img = new Image();
      img.src = mediaFor(entry.slug).image;
    });
  }
  // Once the frames have developed, the newest one gets circled.
  const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  firstPick = setTimeout(() => {
    if (!picked.value) picked.value = newest.slug;
  }, still ? 0 : 400 + frames.length * 240 + 700);
});

onBeforeUnmount(() => clearTimeout(firstPick));
</script>

<style scoped>
.photos {
  --film: #1d1e1b;
  --film-hole: #3b3c37;
  --film-print: #d8cfb6;
  --sheet-paper: #fbfaf3;
  --grease: #d7262b;

  max-width: 1100px;
  margin: 0 auto;
  padding: 64px 40px 96px;
}

/* ---- Heading ------------------------------------------------------------ */
.photos__head {
  max-width: 880px;
  margin: 0 auto 40px;
}

.photos__title {
  margin: 0;
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(40px, 6.4vw, 72px);
  line-height: 1;
  letter-spacing: -0.02em;
  animation: lj-settle 800ms var(--ease-settle) backwards;
}

.photos__sub {
  margin: 14px 0 0;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 20px;
  color: var(--muted);
  animation: lj-settle 800ms var(--ease-settle) 90ms backwards;
}

/* ---- The contact sheet -------------------------------------------------- */
.sheet {
  position: relative;
  padding: 34px 32px 30px;
  background: var(--sheet-paper);
  box-shadow: 0 30px 50px -40px rgba(30, 30, 25, 0.6), 0 0 0 1px var(--line);
  rotate: -0.35deg;
  animation: lj-settle 900ms var(--ease-settle) 120ms backwards;
  --reveal-rot: 1.5deg;
}

.strip {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
}

/* Each cell is a piece of film: frame in the middle, sprocket holes and edge
   printing in the rebates above and below. Cells grow in proportion to their
   frame's ratio, so every frame in a row comes out the same height. */
.cell {
  position: relative;
  flex: var(--ratio) 1 calc(var(--ratio) * 150px);
  padding: 30px 7px 26px;
  background:
    repeating-linear-gradient(to right, transparent 0 5px, var(--film-hole) 5px 14px, transparent 14px 20px) 0 5px / 100% 9px no-repeat,
    repeating-linear-gradient(to right, transparent 0 5px, var(--film-hole) 5px 14px, transparent 14px 20px) 0 calc(100% - 5px) / 100% 9px no-repeat,
    var(--film);
}

.cell__edge {
  position: absolute;
  top: 15px;
  left: 10px;
  right: 10px;
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 9.5px;
  line-height: 12px;
  letter-spacing: 0.08em;
  color: var(--film-print);
  opacity: 0.8;
}

.frame {
  display: block;
  position: relative;
  background: var(--sheet-paper); /* unexposed paper, until the print develops */
}

.frame:focus-visible {
  outline: 2px solid var(--grease);
  outline-offset: 3px;
}

.sheet--loupe .frame {
  cursor: none;
}

/* Prints come up one after another, the way they appear in the tray. */
.frame :deep(img) {
  animation: lj-develop 1200ms ease-out calc(400ms + var(--n) * 240ms) backwards;
}

@keyframes lj-develop {
  from {
    opacity: 0;
    filter: brightness(1.9) contrast(0.25) blur(1.5px);
  }
  30% {
    opacity: 0.6;
  }
}

.cell__pick {
  position: absolute;
  top: 14px;
  left: -6px;
  width: calc(100% + 12px);
  height: calc(100% - 24px);
  color: var(--grease);
  pointer-events: none;
  overflow: visible;
}

.cell__pick path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  opacity: 0;
  transition: stroke-dashoffset 560ms cubic-bezier(0.6, 0.1, 0.3, 1), opacity 200ms ease;
}

.cell__pick--on path {
  stroke-dashoffset: 0;
  opacity: 0.9;
}

/* Only shown where there is no loupe and no shared caption: small screens. */
.cell__cap {
  display: none;
}

/* ---- Loupe -------------------------------------------------------------- */
.loupe {
  position: absolute;
  z-index: 3;
  width: 176px;
  height: 176px;
  border-radius: 50%;
  background-color: var(--sheet-paper);
  background-repeat: no-repeat;
  box-shadow:
    inset 0 0 0 4px #2a2b27,
    inset 0 0 0 6px rgba(255, 255, 255, 0.35),
    inset 0 0 18px rgba(0, 0, 0, 0.35),
    0 18px 30px -12px rgba(20, 20, 18, 0.55);
  pointer-events: none;
  opacity: 0;
  scale: 0.6;
  transition: opacity 180ms ease, scale 420ms var(--ease-spring);
}

/* a glint on the glass */
.loupe::after {
  content: '';
  position: absolute;
  inset: 6px;
  border-radius: 50%;
  background: radial-gradient(circle at 32% 26%, rgba(255, 255, 255, 0.32), transparent 38%);
}

.loupe--on {
  opacity: 1;
  scale: 1;
}

/* ---- Caption ------------------------------------------------------------ */
.caption {
  max-width: 640px;
  margin: 40px auto 0;
  text-align: center;
}

.caption__title {
  margin: 0;
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(26px, 3.4vw, 34px);
  line-height: 1.15;
}

.caption__title a {
  color: var(--ink);
  transition: color var(--transition);
}

.caption__title a:hover,
.caption__title a:focus-visible {
  color: var(--accent2);
}

.caption__where {
  margin: 10px 0 0;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--muted);
}

.caption__excerpt {
  margin: 14px 0 0;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 19px;
  line-height: 1.5;
  color: var(--muted);
}

.caption-enter-active {
  transition: opacity 320ms ease-out, translate 520ms var(--ease-settle);
}

.caption-leave-active {
  transition: opacity 140ms ease-in, translate 140ms ease-in;
}

.caption-enter-from {
  opacity: 0;
  translate: 0 8px;
}

.caption-leave-to {
  opacity: 0;
  translate: 0 -4px;
}

.photos__ig {
  display: table;
  margin: 44px auto 0;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--ink);
  border-bottom: 1px solid var(--accent2);
  padding-bottom: 2px;
}

.photos__ig:hover,
.photos__ig:focus-visible {
  color: var(--accent2);
}

/* ---- Small screens: the strip is cut into single frames, stacked -------- */
@media (max-width: 640px) {
  .photos {
    padding: 40px 16px 72px;
  }
  .sheet {
    padding: 18px 14px 6px;
    rotate: none;
  }
  .strip {
    flex-direction: column;
  }
  .cell__cap {
    display: grid;
    gap: 3px;
    margin: 12px 3px 0;
  }
  .cell {
    flex: none;
    margin-bottom: 14px;
    padding-bottom: 16px;
    background:
      repeating-linear-gradient(to right, transparent 0 5px, var(--film-hole) 5px 14px, transparent 14px 20px) 0 5px / 100% 9px no-repeat,
      var(--film);
  }
  .cell__title {
    font-family: var(--font-serif);
    font-size: 20px;
    color: var(--film-print);
  }
  .cell__where {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--film-print);
    opacity: 0.7;
  }
  .cell__pick,
  .caption {
    display: none;
  }
}
</style>
