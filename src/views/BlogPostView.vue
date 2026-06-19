<template>
  <div class="post-page">
    <article class="post" v-if="post">
    <router-link class="post__back" to="/blog">← the journal</router-link>
    <div class="post__card">
      <div class="post__grid">
        <div class="post__aside">
          <div class="post__date">{{ dateLong(post.frontmatter.date) }}</div>
          <div v-if="post.frontmatter.tags?.length" class="post__tags">{{ post.frontmatter.tags.join(' · ') }}</div>
          <div class="post__read">{{ post.readingTime }} min read</div>
          <p class="post__hand">a good one —</p>
        </div>
        <div class="post__main">
          <h1 class="post__title">{{ post.frontmatter.title }}</h1>
          <p v-if="post.frontmatter.excerpt" class="post__excerpt">{{ post.frontmatter.excerpt }}</p>
          <component :is="post.component" class="post__body" />
          <div class="post__foot">
            <router-link class="post__more" to="/blog">← back to all entries</router-link>
            <span class="post__mark">~ i ~</span>
          </div>
          <nav v-if="newer || older" class="post__nav">
            <router-link v-if="older" class="post__nav-link" :to="`/blog/${older.slug}`">
              <span class="post__nav-dir">← earlier</span>
              <span class="post__nav-title">{{ older.frontmatter.title }}</span>
            </router-link>
            <span v-else aria-hidden="true"></span>
            <router-link v-if="newer" class="post__nav-link post__nav-link--next" :to="`/blog/${newer.slug}`">
              <span class="post__nav-dir">later →</span>
              <span class="post__nav-title">{{ newer.frontmatter.title }}</span>
            </router-link>
          </nav>
        </div>
      </div>
    </div>
  </article>

  <article class="post post--missing" v-else>
    <h1 class="post__title">We couldn't find that entry.</h1>
    <p class="post__excerpt">Maybe browse the other notes instead.</p>
    <router-link class="post__more" to="/blog">← back to the journal</router-link>
  </article>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getPostBySlug, getAdjacentPosts } from '../data/posts.js';

const route = useRoute();
const post = computed(() => getPostBySlug(route.params.slug));
const adjacent = computed(() => getAdjacentPosts(route.params.slug));
const newer = computed(() => adjacent.value.newer);
const older = computed(() => adjacent.value.older);

onMounted(() => {
  if (post.value) document.title = `${post.value.frontmatter.title} — Laijie Ji`;
});

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
function dateLong(value) {
  const d = value ? new Date(value) : new Date();
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}
</script>

<style scoped>
.post {
  max-width: 880px;
  margin: 0 auto;
  padding: 40px 40px 84px;
}

.post__back {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--muted);
}

.post__back:hover,
.post__back:focus-visible {
  color: var(--accent);
}

.post__card {
  position: relative;
  margin-top: 20px;
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: 0 36px 72px -52px rgba(42, 38, 32, 0.5);
  transform: rotate(0.4deg);
}

.post__grid {
  display: grid;
  grid-template-columns: 140px 1fr;
}

.post__aside {
  border-right: 1px solid var(--accent2);
  padding: 52px 22px;
  text-align: right;
}

.post__date {
  font-family: var(--font-mono);
  font-size: 12px;
  color: var(--accent2);
  line-height: 1.6;
}

.post__tags {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--muted);
  margin-top: 14px;
}

.post__read {
  font-family: var(--font-mono);
  font-size: 11px;
  color: var(--faint);
  margin-top: 8px;
}

.post__hand {
  font-family: var(--font-hand);
  font-size: 22px;
  color: var(--accent);
  transform: rotate(-4deg);
  margin: 24px 0 0;
}

.post__main {
  padding: 52px 56px 36px 48px;
  max-width: 64ch;
}

.post__title {
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(30px, 4vw, 46px);
  line-height: 1.1;
  margin: 0 0 10px;
}

.post__excerpt {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 20px;
  color: var(--muted);
  margin: 0 0 30px;
}

/* Long-form markdown body */
.post__body {
  display: block;
  font-family: var(--font-serif);
  font-size: 18.5px;
  line-height: 1.68;
  color: var(--ink);
}

.post__body :deep(p) {
  margin: 20px 0 0;
}

.post__body :deep(p:first-of-type) {
  margin-top: 0;
}

.post__body :deep(p:first-of-type)::first-letter {
  float: left;
  font-family: var(--font-serif);
  font-size: 76px;
  line-height: 0.72;
  padding: 7px 12px 0 0;
  color: var(--accent);
}

.post__body :deep(h2),
.post__body :deep(h3) {
  font-family: var(--font-serif);
  font-weight: 500;
  line-height: 1.2;
  margin: 34px 0 0;
  color: var(--ink);
}

.post__body :deep(h2) { font-size: 24px; }
.post__body :deep(h3) { font-size: 20px; }

.post__body :deep(em) { font-style: italic; }
.post__body :deep(strong) { font-weight: 600; }

.post__body :deep(a) {
  color: var(--accent);
  border-bottom: 1px solid var(--line);
}

.post__body :deep(a:hover) {
  border-color: var(--accent);
}

.post__body :deep(img) {
  margin: 24px 0 0;
  border: 1px solid var(--line);
}

.post__body :deep(ul),
.post__body :deep(ol) {
  margin: 18px 0 0;
  padding-left: 1.4em;
}

.post__body :deep(li) {
  margin-top: 6px;
}

.post__body :deep(blockquote) {
  margin: 24px 0 0;
  padding-left: 18px;
  border-left: 2px solid var(--accent2);
  color: var(--muted);
  font-style: italic;
}

.post__foot {
  margin: 40px 0 0;
  padding-top: 22px;
  border-top: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.post__more {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--accent);
  border-bottom: 1px solid var(--accent);
  padding-bottom: 2px;
}

.post__more:hover,
.post__more:focus-visible {
  color: var(--accent2);
  border-color: var(--accent2);
}

.post__mark {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.2em;
  color: var(--faint);
}

.post__nav {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
  margin-top: 22px;
}

.post__nav-link {
  display: grid;
  gap: 4px;
  padding: 14px 16px;
  border: 1px solid var(--line);
  border-radius: 3px;
  color: var(--ink);
  transition: border-color var(--transition);
}

.post__nav-link:hover,
.post__nav-link:focus-visible {
  border-color: var(--accent);
}

.post__nav-link--next {
  text-align: right;
}

.post__nav-dir {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent2);
}

.post__nav-title {
  font-family: var(--font-serif);
  font-size: 15px;
  line-height: 1.2;
  color: var(--ink);
}

.post--missing {
  max-width: 60ch;
}

.post--missing .post__more {
  display: inline-block;
  margin-top: 16px;
}

@media (max-width: 680px) {
  .post { padding: 30px 18px 64px; }
  .post__grid { grid-template-columns: 1fr; }
  .post__aside {
    border-right: none;
    border-bottom: 1px solid var(--accent2);
    text-align: left;
    padding: 28px 26px;
    display: flex;
    align-items: baseline;
    gap: 16px;
    flex-wrap: wrap;
  }
  .post__hand { margin: 0; }
  .post__main { padding: 32px 26px; }
  .post__nav { grid-template-columns: 1fr; }
  .post__nav-link--next { text-align: left; }
}
</style>
