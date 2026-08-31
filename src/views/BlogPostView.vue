<template>
  <div class="post-page">
    <article class="post" :class="{ 'post--garage': post.frontmatter.variant === 'garage' }" v-if="post">
    <router-link class="post__back" to="/blog">← the journal</router-link>
    <div class="post__card">
      <div class="post__grid">
        <div class="post__aside">
          <div class="post__date">{{ dateLong(post.frontmatter.date) }}</div>
          <div v-if="post.frontmatter.tags?.length" class="post__tags">{{ post.frontmatter.tags.join(' · ') }}</div>
          <div class="post__read">{{ post.readingTime }} min read</div>
          <p class="post__hand">a good one -</p>
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
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { getPostBySlug, getAdjacentPosts } from '../data/posts.js';
import { useSeo, SITE_URL, OG_IMAGE } from '../composables/useSeo.js';

const route = useRoute();
const post = computed(() => getPostBySlug(route.params.slug));
const adjacent = computed(() => getAdjacentPosts(route.params.slug));
const newer = computed(() => adjacent.value.newer);
const older = computed(() => adjacent.value.older);

// The view is keyed by route.path in App.vue, so setup re-runs per slug.
if (post.value) {
  const fm = post.value.frontmatter;
  const path = `/blog/${route.params.slug}`;
  const url = `${SITE_URL}${path}`;
  // YAML parses unquoted dates into Date objects; normalize to yyyy-mm-dd.
  const published = fm.date ? new Date(fm.date).toISOString().slice(0, 10) : undefined;
  const laijie = { '@type': 'Person', name: 'Laijie Ji', url: `${SITE_URL}/` };

  const ld = fm.book
    ? {
        '@context': 'https://schema.org',
        '@type': 'Review',
        name: fm.title,
        itemReviewed: {
          '@type': 'Book',
          name: fm.book,
          author: fm.bookAuthor.split(',').map((name) => ({ '@type': 'Person', name: name.trim() }))
        },
        reviewBody: fm.excerpt,
        datePublished: published,
        url,
        mainEntityOfPage: url,
        image: OG_IMAGE,
        author: laijie,
        publisher: laijie
      }
    : {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: fm.title,
        description: fm.excerpt,
        datePublished: published,
        url,
        mainEntityOfPage: url,
        image: OG_IMAGE,
        author: laijie,
        publisher: laijie
      };

  useSeo({
    // "<Book> review" front-loads what people actually search for.
    title: fm.book ? `${fm.book} review - Laijie Ji` : `${fm.title} - Laijie Ji`,
    description: fm.excerpt,
    path,
    type: 'article',
    ld: [ld]
  });
}

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
  --tilt: 0.4deg;
  position: relative;
  margin-top: 20px;
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: 0 36px 72px -52px rgba(42, 38, 32, 0.5);
  transform: rotate(var(--tilt));
}

.post__grid {
  display: grid;
  grid-template-columns: 140px 1fr;
  /* Keep the paper's tilt, but print the words level so the article reads
     straight. Cancels .post__card's rotation exactly (shared centre). */
  transform: rotate(calc(-1 * var(--tilt)));
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

/* Blockquote paragraphs are also "first of type" among their own siblings -
   keep the drop cap off the pull-quotes. */
.post__body :deep(blockquote p)::first-letter {
  float: none;
  font-size: inherit;
  line-height: inherit;
  padding: 0;
  color: inherit;
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

/* Pull-quote: a `> line` in a review is lifted out as an editorial quote. */
.post__body :deep(blockquote) {
  margin: 36px 0;
  padding: 2px 0 2px 24px;
  border-left: 3px solid var(--accent2);
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 25px;
  line-height: 1.34;
  color: var(--accent);
}

.post__body :deep(blockquote p) {
  margin: 0;
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

/* ---- Garage variant - the car entry wears Soul Red + a plate masthead ---- */
.post--garage {
  --accent: var(--garage);
  --accent2: #7d1417;
}

.post__body :deep(.plate) {
  margin: 0 0 38px;
  padding: 0 0 28px;
  border-bottom: 1px solid var(--line);
}

.post__body :deep(.plate__eyebrow) {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--garage);
  margin-bottom: 18px;
}

.post__body :deep(.plate__odo) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-weight: 500;
}

.post__body :deep(.plate__digit) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 46px;
  background: var(--ink);
  color: var(--paper);
  border-radius: 3px;
  font-size: 27px;
  box-shadow: inset 0 -3px 0 rgba(0, 0, 0, 0.28);
}

.post__body :deep(.plate__sep) {
  color: var(--muted);
  font-size: 27px;
  padding: 0 1px;
}

.post__body :deep(.plate__unit) {
  margin-left: 9px;
  font-size: 13px;
  letter-spacing: 0.18em;
  color: var(--muted);
}

.post__body :deep(.plate__specs) {
  font-family: var(--font-mono);
  font-size: 12.5px;
  letter-spacing: 0.03em;
  line-height: 1.7;
  color: var(--muted);
  margin-top: 18px;
}

.post__body :deep(.plate__swatch) {
  display: inline-block;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  background: var(--garage);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.15);
  vertical-align: middle;
  margin: 0 5px 2px 0;
}

@media (max-width: 420px) {
  .post__body :deep(.plate__digit) { width: 26px; height: 38px; font-size: 22px; }
  .post__body :deep(.plate__sep) { font-size: 22px; }
}
</style>
