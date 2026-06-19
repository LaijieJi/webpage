<template>
  <div class="story-wrap">
    <article class="story" v-if="entry">
      <router-link class="story__back" to="/photography">← all plates</router-link>

      <div class="story__frame">
        <div class="story__photo">
          <ResponsiveImg
            :src="media.image"
            :webp="media.webp"
            :alt="entry.frontmatter.title"
            sizes="(max-width: 1040px) 92vw, 960px"
            eager
          />
        </div>
      </div>
      <div class="story__cap">
        <span class="story__plate">Plate · {{ media.place || entry.frontmatter.title }}</span>
        <span class="story__date">{{ dateLong(entry.frontmatter.date) }}</span>
      </div>

      <div class="story__body-col">
        <h1 class="story__title">{{ entry.frontmatter.title }}</h1>
        <p v-if="entry.frontmatter.excerpt" class="story__excerpt">{{ entry.frontmatter.excerpt }}</p>
        <component :is="entry.component" class="story__body" />

        <a
          v-if="igHref"
          class="story__ig"
          :href="igHref"
          target="_blank"
          rel="noreferrer"
        >
          <span class="story__ig-text">
            <span class="story__ig-label">See it on Instagram</span>
            <span class="story__ig-handle">@laijie.jpg</span>
          </span>
          <span class="story__ig-cta">view post →</span>
        </a>

        <div class="story__foot"><span>~ plate ~</span></div>
      </div>
    </article>

    <article class="story story--missing" v-else>
      <router-link class="story__back" to="/photography">← all plates</router-link>
      <h1 class="story__title">That plate isn't here.</h1>
      <p class="story__excerpt">Browse the rest of the gallery instead.</p>
    </article>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getPhotoEntryBySlug } from '../data/photography.js';
import ResponsiveImg from '../components/ResponsiveImg.vue';
import { mediaFor } from '../data/photoMedia.js';

const route = useRoute();
const entry = computed(() => getPhotoEntryBySlug(route.params.slug));
const media = computed(() => mediaFor(route.params.slug));

onMounted(() => {
  if (entry.value) document.title = `${entry.value.frontmatter.title} — Laijie Ji`;
});
const igHref = computed(() => {
  const id = entry.value?.frontmatter?.instagramPostId;
  return id ? `https://www.instagram.com/p/${id}/` : null;
});

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
function dateLong(value) {
  const d = value ? new Date(value) : new Date();
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
</script>

<style scoped>
.story-wrap {
  background: var(--gallery);
  border-top: 1px solid var(--line);
}

.story {
  max-width: 1000px;
  margin: 0 auto;
  padding: 40px 40px 84px;
}

.story__back {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
}

.story__back:hover,
.story__back:focus-visible {
  color: var(--accent2);
}

.story__frame {
  margin-top: 22px;
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 20px;
  box-shadow: 0 34px 64px -50px rgba(42, 38, 32, 0.55);
  transform: rotate(-0.7deg);
}

.story__photo {
  overflow: hidden;
}

.story__photo img {
  width: 100%;
  display: block;
}

.story__cap {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: 14px;
  padding: 0 2px;
  gap: 16px;
}

.story__plate {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--accent2);
}

.story__date {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
  white-space: nowrap;
}

.story__body-col {
  max-width: 60ch;
  margin: 46px auto 0;
}

.story__title {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(28px, 3.8vw, 44px);
  line-height: 1.1;
  margin: 0 0 10px;
}

.story__excerpt {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 19px;
  line-height: 1.5;
  color: var(--muted);
  margin: 0 0 28px;
}

.story__body {
  display: block;
  font-family: var(--font-serif);
  font-size: 18px;
  line-height: 1.68;
  color: var(--ink);
}

.story__body :deep(p) {
  margin: 0 0 18px;
}

.story__body :deep(h2),
.story__body :deep(h3) {
  font-family: var(--font-serif);
  font-weight: 500;
  margin: 30px 0 12px;
  color: var(--ink);
}

.story__body :deep(h2) { font-size: 23px; }
.story__body :deep(h3) { font-size: 19px; }

.story__body :deep(img) {
  margin: 24px 0;
  border: 1px solid var(--line);
}

.story__body :deep(ul),
.story__body :deep(ol) {
  margin: 0 0 18px;
  padding-left: 1.4em;
}

.story__body :deep(a) {
  color: var(--accent2);
  border-bottom: 1px solid var(--line);
}

.story__ig {
  margin-top: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 1px solid var(--line);
  padding: 18px 20px;
}

.story__ig:hover,
.story__ig:focus-visible {
  border-color: var(--accent2);
}

.story__ig-text {
  display: grid;
  gap: 3px;
}

.story__ig-label {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--muted);
}

.story__ig-handle {
  font-family: var(--font-serif);
  font-size: 19px;
  color: var(--ink);
}

.story__ig-cta {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--accent2);
  white-space: nowrap;
}

.story__foot {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid var(--line);
  text-align: center;
}

.story__foot span {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--faint);
}

.story--missing .story__title {
  margin-top: 22px;
}

@media (max-width: 640px) {
  .story { padding: 30px 18px 64px; }
}
</style>
