<template>
  <div class="gallery">
    <!-- sticky cover -->
    <section class="cover">
      <p class="cover__kicker">A field notebook of frames</p>
      <h1 class="cover__title">Mostly Outdoors</h1>
      <p class="cover__hand">all shot on foot, slowly</p>
      <div class="cover__ornament" aria-hidden="true">
        <span class="cover__ornament-rule"></span>
        <span class="cover__ornament-dot"></span>
        <span class="cover__ornament-rule"></span>
      </div>
      <p class="cover__plates">Plates · 2025—2026</p>
      <p class="cover__scroll">↓ scroll to open</p>
    </section>

    <!-- plates -->
    <div class="gallery__wrap">
      <div class="plates-stack">
        <transition :name="riffleName" @after-leave="unlockTurn">
          <section class="plates" :key="page">
            <router-link
              v-for="(entry, i) in pagedEntries"
              :key="entry.slug"
              class="plate"
              v-reveal
              :to="`/photography/${entry.slug}`"
            >
              <div class="plate__frame" :style="frameStyle(pageStart + i)">
                <div class="plate__photo">
                  <ResponsiveImg
                    :src="mediaFor(entry.slug).image"
                    :webp="mediaFor(entry.slug).webp"
                    :ratio="mediaFor(entry.slug).ratio"
                    :alt="entry.frontmatter.title"
                    sizes="(max-width: 980px) 92vw, 900px"
                  />
                </div>
                <span class="plate__corners" aria-hidden="true"></span>
              </div>
              <div class="plate__cap">
                <span class="plate__name">Plate {{ pad(pageStart + i + 1) }} · {{ entry.frontmatter.title }}</span>
                <span class="plate__place">{{ mediaFor(entry.slug).place }}</span>
              </div>
            </router-link>
          </section>
        </transition>

        <!-- Invisible ghosts of every sheet keep the print box sized to its
             tallest print, so a riffle never moves the strip or the foot.
             Photo boxes are aspect-ratio placeholders — no images loaded. -->
        <template v-if="pageCount > 1">
          <section
            v-for="n in pageCount"
            :key="`ghost-${n}`"
            class="plates plates--ghost"
            aria-hidden="true"
          >
            <div v-for="(entry, i) in pageSliceFor(n - 1)" :key="entry.slug" class="plate">
              <div class="plate__frame">
                <div class="plate__photo" :style="{ aspectRatio: mediaFor(entry.slug).ratio }"></div>
              </div>
              <div class="plate__cap">
                <span class="plate__name">Plate {{ pad((n - 1) * PAGE_SIZE + i + 1) }} · {{ entry.frontmatter.title }}</span>
                <span class="plate__place">{{ mediaFor(entry.slug).place }}</span>
              </div>
            </div>
          </section>
        </template>
      </div>

      <!-- a strip of film as the plate selector; the open plate is circled
           like a pick marked on a contact sheet -->
      <nav v-if="pageCount > 1" class="filmstrip" aria-label="Plates">
        <button
          v-for="n in pageCount"
          :key="n"
          type="button"
          class="filmstrip__frame"
          :class="{ 'filmstrip__frame--active': n - 1 === page }"
          :aria-current="n - 1 === page ? 'page' : undefined"
          :aria-label="`Go to plate ${n}`"
          @click="goToPage(n - 1)"
        >
          <span class="filmstrip__cell">
            <svg
              v-if="n - 1 === page"
              class="filmstrip__mark"
              viewBox="0 0 50 40"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                d="M25 4 C 37 3, 47 9, 46.5 20 C 46 30.5, 36 37, 24 36.4 C 12.5 35.8, 3.6 29.6, 4 19.6 C 4.4 10.2, 13.4 4.6, 27.5 5.2"
                fill="none"
                stroke="currentColor"
                stroke-width="2.6"
                stroke-linecap="round"
                pathLength="1"
              />
            </svg>
            {{ pad(n) }}
          </span>
        </button>
      </nav>

      <span class="visually-hidden" aria-live="polite">Plate {{ page + 1 }} of {{ pageCount }}</span>

      <section class="gallery__foot">
        <div v-if="pageCount > 1" class="gallery__nav">
          <button v-if="page > 0" type="button" class="gallery__navlink" @click="goToPage(page - 1)">← previous plate</button>
          <span v-else aria-hidden="true"></span>
          <p class="gallery__mark">{{ page === pageCount - 1 ? '~ end of plates ~' : `~ plate ${pad(page + 1)} of ${pad(pageCount)} ~` }}</p>
          <button v-if="page < pageCount - 1" type="button" class="gallery__navlink gallery__navlink--next" @click="goToPage(page + 1)">next plate →</button>
          <span v-else aria-hidden="true"></span>
        </div>
        <p v-else class="gallery__mark">~ end of plates ~</p>
        <a class="gallery__ig" href="https://www.instagram.com/laijie.jpg/" target="_blank" rel="noreferrer">more frames on Instagram →</a>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import entries from '../data/photography.js';
import { mediaFor } from '../data/photoMedia.js';
import ResponsiveImg from '../components/ResponsiveImg.vue';

const tilts = ['-1.1deg', '0.8deg', '-0.6deg', '1deg'];
function frameStyle(i) {
  return { '--tilt': tilts[i % tilts.length] };
}

const pad = (n) => String(n).padStart(2, '0');

/* ---- Pagination: riffle through the box of prints, one per sheet -------- */
const PAGE_SIZE = 1;
const pageCount = Math.max(1, Math.ceil(entries.length / PAGE_SIZE));

const route = useRoute();
const router = useRouter();

// Restore the open plate from ?plate= so refresh/back return to the same one.
const fromQuery = Math.floor(Number(route.query.plate));
const page = ref(
  Number.isFinite(fromQuery) ? Math.min(Math.max(fromQuery - 1, 0), pageCount - 1) : 0
);

const pageStart = computed(() => page.value * PAGE_SIZE);

function pageSliceFor(i) {
  return entries.slice(i * PAGE_SIZE, (i + 1) * PAGE_SIZE);
}

const pagedEntries = computed(() => pageSliceFor(page.value));

const riffleName = ref('riffle-fwd');
const turning = ref(false);
let unlockTimer = 0;

function goToPage(next) {
  if (turning.value || next === page.value || next < 0 || next > pageCount - 1) return;
  riffleName.value = next > page.value ? 'riffle-fwd' : 'riffle-back';
  turning.value = true;
  page.value = next;

  const query = { ...route.query };
  if (next > 0) query.plate = String(next + 1);
  else delete query.plate;
  router.replace({ query });

  clearTimeout(unlockTimer);
  unlockTimer = setTimeout(unlockTurn, 900); // safety net if animation events never fire
  preloadAdjacent(next);
}

function unlockTurn() {
  clearTimeout(unlockTimer);
  turning.value = false;
}

// Warm the neighbours' images so a riffle lands on a ready print.
function preloadAdjacent(i) {
  [i - 1, i + 1].forEach((p) => {
    if (p < 0 || p > pageCount - 1) return;
    entries.slice(p * PAGE_SIZE, (p + 1) * PAGE_SIZE).forEach((entry) => {
      const media = mediaFor(entry.slug);
      const img = new Image();
      img.sizes = '(max-width: 980px) 92vw, 900px';
      if (media.webp) img.srcset = media.webp;
      else img.src = media.image;
    });
  });
}

onMounted(() => preloadAdjacent(page.value));
</script>

<style scoped>
.gallery {
  position: relative;
  background: var(--gallery);
  border-top: 1px solid var(--line);
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
  background: url('../assets/media/ridges.svg') bottom center / 100% 42% no-repeat,
    var(--shade);
}

.cover::before {
  content: '';
  position: absolute;
  inset: 22px;
  border: 1px solid var(--line);
  pointer-events: none;
}

.cover__kicker {
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
  font-size: clamp(38px, 6.4vw, 78px);
  line-height: 1;
  margin: 0;
}

.cover__hand {
  font-family: var(--font-hand);
  font-size: 25px;
  color: var(--accent2);
  transform: rotate(-2deg);
  margin: 20px 0 32px;
  white-space: nowrap;
}

.cover__ornament {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: 0 0 14px;
}

.cover__ornament-rule {
  width: 46px;
  height: 1px;
  background: var(--line);
}

.cover__ornament-dot {
  width: 7px;
  height: 7px;
  background: var(--accent2);
  transform: rotate(45deg);
}

.cover__plates {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--faint);
  margin: 0;
}

.cover__scroll {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--faint);
  margin: 44px 0 0;
}

/* ---- Plates ------------------------------------------------------------- */
.gallery__wrap {
  position: relative;
  z-index: 1;
  background: var(--gallery);
  box-shadow: 0 -24px 50px -28px rgba(42, 38, 32, 0.4);
  /* Contain the print sliding off-frame. Lives here — NOT on .gallery —
     because an overflow ancestor breaks the sticky cover in Safari. */
  overflow-x: clip;
}

/* The box of prints: sheets stack in one grid cell so a riffle overlaps
   the outgoing and incoming print. */
.plates-stack {
  position: relative;
  max-width: 940px;
  margin: 0 auto;
  display: grid;
}

.plates {
  grid-area: 1 / 1;
  align-self: start;
  width: 100%;
  padding: 48px 40px 24px;
  display: grid;
  gap: 78px;
}

/* Size-only ghosts: they occupy the same grid cell so the box is always as
   tall as the tallest print, but never paint or catch the pointer. */
.plates--ghost {
  visibility: hidden;
  pointer-events: none;
  z-index: -1;
}

/* ---- Riffle ------------------------------------------------------------
   Forward: the top print lifts, slides off-frame and is set aside.
   Back: the print set aside slides back onto the pile. */
.riffle-fwd-leave-active {
  z-index: 3;
  animation: lj-riffle-out 620ms cubic-bezier(0.45, 0.05, 0.5, 1) both;
  will-change: transform;
  pointer-events: none;
}

.riffle-fwd-enter-active {
  z-index: 1;
  animation: lj-riffle-rise 620ms cubic-bezier(0.25, 0.5, 0.3, 1) both;
  pointer-events: none;
}

.riffle-back-enter-active {
  z-index: 3;
  animation: lj-riffle-out 620ms cubic-bezier(0.3, 0.4, 0.25, 1) reverse both;
  will-change: transform;
  pointer-events: none;
}

.riffle-back-leave-active {
  z-index: 1;
  animation: lj-riffle-rise 620ms ease reverse both;
  pointer-events: none;
}

@keyframes lj-riffle-out {
  0% {
    transform: translate(0, 0) rotate(0deg);
    opacity: 1;
  }
  28% {
    transform: translate(-9%, -14px) rotate(-2.5deg);
  }
  78% {
    opacity: 1;
  }
  100% {
    transform: translate(-130%, 8px) rotate(-6deg);
    opacity: 0;
  }
}

@keyframes lj-riffle-rise {
  from {
    transform: scale(0.964) translateY(14px);
    filter: brightness(0.94);
  }
  to {
    transform: none;
    filter: brightness(1);
  }
}

.plate {
  display: block;
  color: var(--ink);
}

.plate__frame {
  position: relative;
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 18px 18px 26px;
  box-shadow: 0 34px 64px -50px rgba(42, 38, 32, 0.55);
  transform: rotate(var(--tilt, -1deg));
  transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1), box-shadow 0.5s ease;
}

.plate:hover .plate__frame,
.plate:focus-visible .plate__frame {
  transform: rotate(0deg) scale(1.015);
  box-shadow: 0 42px 72px -46px rgba(42, 38, 32, 0.6);
}

.plate__photo {
  overflow: hidden;
  box-shadow: 0 0 0 1px rgba(42, 38, 32, 0.16);
}

/* Mounting corners, like a photo tipped into an album page. */
.plate__corners {
  position: absolute;
  inset: 18px;
  bottom: 26px;
  pointer-events: none;
  background-image:
    linear-gradient(135deg, rgba(38, 31, 22, 0.72) 0 47%, transparent 48%),
    linear-gradient(225deg, rgba(38, 31, 22, 0.72) 0 47%, transparent 48%),
    linear-gradient(45deg, rgba(38, 31, 22, 0.72) 0 47%, transparent 48%),
    linear-gradient(315deg, rgba(38, 31, 22, 0.72) 0 47%, transparent 48%);
  background-position: top left, top right, bottom left, bottom right;
  background-size: 30px 30px;
  background-repeat: no-repeat;
}

.plate__photo img {
  width: 100%;
  display: block;
}

.plate__cap {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 14px;
  padding: 0 2px;
  gap: 16px;
}

.plate__name {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent2);
}

.plate__place {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
  white-space: nowrap;
}

/* ---- Film strip ----------------------------------------------------------
   Plate selector drawn as a strip of 35mm film lying on the table — dark
   base, sprocket holes, orange edge numbers. Fixed colours on purpose:
   film looks like film in either palette. */
.filmstrip {
  position: relative;
  width: fit-content;
  max-width: calc(100% - 36px);
  margin: 6px auto 0;
  padding: 13px 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  background: #221f19;
  box-shadow: 0 14px 28px -18px rgba(30, 26, 20, 0.7);
  transform: rotate(-0.6deg);
}

.filmstrip::before,
.filmstrip::after {
  content: '';
  position: absolute;
  left: 9px;
  right: 9px;
  height: 5px;
  background-image: repeating-linear-gradient(
    to right,
    var(--gallery) 0 8px,
    transparent 8px 18px
  );
  opacity: 0.9;
  pointer-events: none;
}

.filmstrip::before { top: 4px; }
.filmstrip::after { bottom: 4px; }

.filmstrip__frame {
  position: relative;
  width: 44px;
  height: 30px;
  padding: 0;
}

.filmstrip__cell {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #2e2a21;
  box-shadow: inset 0 0 0 1px #453f2f;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.08em;
  color: #d08b3c; /* film edge-marking orange */
  transition: background var(--transition), color var(--transition);
}

.filmstrip__frame:hover .filmstrip__cell,
.filmstrip__frame:focus-visible .filmstrip__cell {
  background: #3a352a;
  color: #eeb464;
}

.filmstrip__frame--active .filmstrip__cell {
  color: #f0c27d;
}

/* Grease-pencil circle around the chosen frame, drawn on when it lands. */
.filmstrip__mark {
  position: absolute;
  left: -3px;
  top: -5px;
  width: calc(100% + 6px);
  height: calc(100% + 10px);
  color: #e2502c;
  overflow: visible;
  pointer-events: none;
}

.filmstrip__mark path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: lj-draw 420ms ease-out 60ms forwards;
}

/* ---- Foot ---------------------------------------------------------------- */
.gallery__foot {
  max-width: 940px;
  margin: 0 auto;
  padding: 18px 40px 80px;
  text-align: center;
  border-top: 1px solid var(--line);
  margin-top: 42px;
}

.gallery__nav {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: baseline;
  gap: 14px;
  margin: 22px 0 18px;
}

.gallery__nav .gallery__mark {
  margin: 0;
}

.gallery__navlink {
  justify-self: start;
  padding: 0 0 2px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--muted);
  border-bottom: 1px solid transparent;
  transition: color var(--transition), border-color var(--transition);
}

.gallery__navlink:hover,
.gallery__navlink:focus-visible {
  color: var(--accent2);
  border-color: var(--accent2);
}

.gallery__navlink--next {
  justify-self: end;
}

.gallery__mark {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--faint);
  margin: 22px 0 18px;
}

.gallery__ig {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--ink);
  border-bottom: 1px solid var(--accent2);
  padding-bottom: 3px;
}

@media (max-width: 640px) {
  .plates { padding: 40px 18px 24px; gap: 56px; }
  .gallery__foot { padding: 18px 18px 64px; margin-top: 34px; }
  .gallery__nav {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: baseline;
  }
  .gallery__nav .gallery__mark {
    order: 3;
    width: 100%;
    margin-top: 10px;
  }
  .gallery__navlink--next { order: 2; }
}
</style>
