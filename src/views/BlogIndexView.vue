<template>
  <div class="journal">
    <!-- sticky cover -->
    <section class="cover">
      <p class="cover__vol">Vol. one</p>
      <h1 class="cover__title">The Journal</h1>
      <p class="cover__hand">pull up a chair —</p>
      <div class="cover__frame">
        <div class="cover__photo">
          <ResponsiveImg :src="lamyImg.src" :webp="lamyImg.webp" alt="My Lamy Safari resting on a notebook" fill cover eager />
        </div>
      </div>
      <p class="cover__cap">my Lamy Safari — where the words come from</p>
      <p class="cover__scroll">↓ scroll to open</p>
    </section>

    <!-- the journal sheet -->
    <div class="journal__wrap">
      <div class="journal__sheet">
        <span class="journal__margin" aria-hidden="true"></span>
        <span class="journal__river" aria-hidden="true">
          <svg width="12" height="100%" viewBox="0 0 12 1000" preserveAspectRatio="none">
            <path d="M6 0 C 9 120, 3 240, 6 360 C 9 480, 3 620, 6 740 C 8 860, 4 940, 6 1000" fill="none" stroke="var(--accent2)" stroke-width="1.4" stroke-linecap="round" opacity="0.45" />
          </svg>
        </span>
        <span class="journal__stamp" aria-hidden="true"></span>
        <span class="journal__scribble" aria-hidden="true">newest first ↓</span>

        <div class="journal__head">
          <p class="journal__kicker">The Journal</p>
        </div>
        <h2 class="journal__title">Notes from a slow reader.</h2>
        <p class="journal__lede">Books I've loved, things I'm learning, and the occasional letter to myself.</p>

        <router-link
          v-for="post in posts"
          :key="post.slug"
          class="entry"
          v-reveal
          :to="`/blog/${post.slug}`"
        >
          <div class="entry__date">{{ dateShort(post.frontmatter.date) }}</div>
          <div>
            <div class="entry__tags"><template v-if="post.frontmatter.tags?.length">{{ post.frontmatter.tags.join(' · ') }} · </template>{{ post.readingTime }} min</div>
            <h2 class="entry__title">{{ post.frontmatter.title }}</h2>
            <p v-if="post.frontmatter.excerpt" class="entry__excerpt">{{ post.frontmatter.excerpt }}</p>
          </div>
        </router-link>

        <div class="journal__foot"><span>~ one ~</span></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import posts from '../data/posts.js';
import { lamyImg } from '../data/media.js';
import ResponsiveImg from '../components/ResponsiveImg.vue';

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

function dateShort(value) {
  const d = value ? new Date(value) : new Date();
  return `${d.getDate()} ${MONTHS[d.getMonth()]}\n${d.getFullYear()}`;
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
  background: var(--shade);
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
}

.journal__sheet {
  position: relative;
  max-width: 860px;
  margin: 0 auto;
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: 0 36px 72px -52px rgba(42, 38, 32, 0.5);
  padding: 50px 56px 36px 96px;
  transform: rotate(-0.5deg);
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
  margin-top: 4px;
  text-align: center;
}

.journal__foot span {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--faint);
}

@media (max-width: 640px) {
  .journal__wrap { padding: 48px 18px 64px; }
  .journal__sheet { padding: 40px 24px 30px 56px; }
  .journal__margin { left: 18px; }
  .journal__river { left: 40px; }
  .journal__stamp { display: none; }
  .journal__scribble { display: none; }
  .entry { grid-template-columns: 64px 1fr; gap: 16px; }
}
</style>
