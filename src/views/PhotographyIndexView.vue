<template>
  <div class="gallery">
    <!-- sticky cover -->
    <section class="cover">
      <p class="cover__kicker">A field notebook of frames</p>
      <h1 class="cover__title">Mostly Outdoors</h1>
      <p class="cover__hand">all shot on foot, slowly</p>
      <div class="cover__rule"></div>
      <p class="cover__plates">Plates · 2025—2026</p>
      <p class="cover__scroll">↓ scroll to open</p>
    </section>

    <!-- plates -->
    <div class="gallery__wrap">
      <section class="plates">
        <router-link
          v-for="(entry, i) in entries"
          :key="entry.slug"
          class="plate"
          :to="`/photography/${entry.slug}`"
        >
          <div class="plate__frame" :style="frameStyle(i)">
            <div class="plate__photo">
              <img :src="mediaFor(entry.slug).image" :alt="entry.frontmatter.title" loading="lazy" />
            </div>
          </div>
          <div class="plate__cap">
            <span class="plate__name">Plate {{ String(i + 1).padStart(2, '0') }} · {{ entry.frontmatter.title }}</span>
            <span class="plate__place">{{ mediaFor(entry.slug).place }}</span>
          </div>
        </router-link>
      </section>

      <section class="gallery__foot">
        <p class="gallery__mark">~ end of plates ~</p>
        <a class="gallery__ig" href="https://www.instagram.com/laijie.jpg/" target="_blank" rel="noreferrer">more frames on Instagram →</a>
      </section>
    </div>
  </div>
</template>

<script setup>
import entries from '../data/photography.js';
import { mediaFor } from '../data/photoMedia.js';

const tilts = ['-1.1deg', '0.8deg', '-0.6deg', '1deg'];
function frameStyle(i) {
  return { '--tilt': tilts[i % tilts.length] };
}
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
  background: var(--shade);
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

.cover__rule {
  width: 54px;
  height: 1px;
  background: var(--line);
  margin: 0 auto 12px;
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
}

.plates {
  max-width: 940px;
  margin: 0 auto;
  padding: 48px 40px 24px;
  display: grid;
  gap: 78px;
}

.plate {
  display: block;
  color: var(--ink);
}

.plate__frame {
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 18px;
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

.gallery__foot {
  max-width: 940px;
  margin: 0 auto;
  padding: 18px 40px 80px;
  text-align: center;
  border-top: 1px solid var(--line);
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
  .gallery__foot { padding: 18px 18px 64px; }
}
</style>
