<template>
  <div class="post-page">
    <article class="post" :class="{ 'post--garage': post.frontmatter.variant === 'garage' }" v-if="post">
      <router-link class="post__back" to="/blog">← the journal</router-link>

      <!-- the catalogue card, pulled out of the drawer and laid on the page -->
      <header class="post__card" data-morph="journal-sheet">
        <div class="post__head">
          <p class="post__by">{{ cardByline(post) }}</p>
          <h1 class="post__title">{{ cardTitle(post) }}</h1>
          <time class="post__stamp" :datetime="isoDate">{{ cardStamp(post) }}</time>
        </div>
        <div class="post__lined">
          <p v-if="post.frontmatter.excerpt" class="post__excerpt">{{ post.frontmatter.excerpt }}</p>
          <p class="post__meta">
            <span v-if="genre">{{ genre }}</span>
            <span>{{ post.readingTime }} min read</span>
          </p>
        </div>
      </header>

      <div class="post__sheet">
        <component :is="post.component" class="post__body" />
      </div>

      <!-- the cards filed either side of this one -->
      <nav v-if="newer || older" class="post__filed" aria-label="Neighbouring entries">
        <RouterLink
          v-for="side in neighbours"
          :key="side.dir"
          :to="`/blog/${side.post.slug}`"
          custom
          v-slot="{ href }"
        >
          <a class="filed" :class="`filed--${side.dir}`" :href="href" @click="open($event, side.post)">
            <span class="filed__dir">{{ side.dir }}</span>
            <span class="filed__by">{{ cardByline(side.post) }}</span>
            <span class="filed__title">{{ cardTitle(side.post) }}</span>
          </a>
        </RouterLink>
      </nav>

      <router-link class="post__back post__back--end" to="/blog">Back to the journal</router-link>
    </article>

    <article class="post post--missing" v-else>
      <h1 class="post__title">We couldn't find that entry.</h1>
      <p class="post__excerpt">It may have been renamed. Every entry is in the journal.</p>
      <router-link class="post__back" to="/blog">← the journal</router-link>
    </article>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter, RouterLink } from 'vue-router';
import { getPostBySlug, getAdjacentPosts, cardByline, cardTitle, cardGenre, cardStamp } from '../data/posts.js';
import { openWithMorph, isPlainClick } from '../composables/useMorph.js';
import { useSeo, SITE_URL, OG_IMAGE } from '../composables/useSeo.js';

const route = useRoute();
const post = computed(() => getPostBySlug(route.params.slug));
const adjacent = computed(() => getAdjacentPosts(route.params.slug));
const newer = computed(() => adjacent.value.newer);
const older = computed(() => adjacent.value.older);
const neighbours = computed(() => [
  older.value && { dir: 'earlier', post: older.value },
  newer.value && { dir: 'later', post: newer.value }
].filter(Boolean));

const genre = computed(() => (post.value ? cardGenre(post.value) : ''));
const isoDate = computed(() => post.value && new Date(post.value.frontmatter.date).toISOString().slice(0, 10));

// A neighbour's card grows into its own page, as it does from the drawer.
const router = useRouter();
function open(event, target) {
  if (!isPlainClick(event)) return;
  event.preventDefault();
  openWithMorph(router, `/blog/${target.slug}`, event.currentTarget, 'journal-sheet');
}

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

</script>

<style scoped>
.post {
  max-width: 780px;
  margin: 0 auto;
  padding: 40px 40px 96px;
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

/* ---- The card ------------------------------------------------------------
   The same index card as in the journal's drawer, at full size: typed author,
   title, date stamp, red rule, and the excerpt on its blue lines. It lies on
   top of the page, slightly askew. */
.post__card {
  view-transition-name: journal-sheet; /* the drawer's card grows into this */
  position: relative;
  z-index: 1;
  margin: 22px 26px 0;
  padding: 26px 34px 0;
  background: var(--card-paper);
  border-radius: 5px;
  box-shadow: 0 0 0 1px var(--line), 0 22px 34px -24px rgba(30, 30, 25, 0.55);
  rotate: -0.6deg;
}

/* the hole the drawer rod ran through */
.post__card::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: 16px;
  width: 13px;
  height: 13px;
  margin-left: -6.5px;
  border-radius: 50%;
  background: var(--mat);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.25);
}

.post__head {
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 24px;
  padding-bottom: 16px;
  border-bottom: 1.5px solid var(--card-rule);
}

.post__by {
  grid-column: 1;
  margin: 0;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--muted);
}

.post__title {
  grid-column: 1;
  margin: 8px 0 0;
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: clamp(32px, 5vw, 48px);
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: var(--ink);
}

/* The librarian's stamp - pressed on just after the card lands. */
.post__stamp {
  grid-column: 2;
  grid-row: 1 / span 2;
  align-self: start;
  margin-top: 2px;
  padding: 4px 9px 3px;
  border: 1.5px solid currentColor;
  border-radius: 3px;
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 0.06em;
  white-space: nowrap;
  color: var(--accent2);
  opacity: 0.85;
  rotate: -4deg;
  animation: lj-stamp 560ms var(--ease-spring) 0.55s backwards;
}

/* Below the rule, the card is ruled in faint blue, one line per 30px. */
.post__lined {
  padding: 10px 0 54px;
  background: repeating-linear-gradient(to bottom, transparent 0 29px, var(--card-line) 29px 30px) 0 10px / 100% calc(100% - 64px) no-repeat;
}

.post__excerpt {
  margin: 0;
  max-width: 52ch;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 21px;
  line-height: 30px;
  color: var(--muted);
}

.post__meta {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin: 12px 0 0;
  font-family: var(--font-mono);
  font-size: 12px;
  line-height: 30px;
  color: var(--faint);
}

/* ---- The page the card lies on ------------------------------------------ */
.post__sheet {
  margin-top: -26px;
  padding: 78px 72px 60px;
  background: var(--surface);
  border: 1px solid var(--line);
  box-shadow: 0 36px 72px -52px rgba(42, 38, 32, 0.5);
}

/* Long-form markdown body: plain and quiet, nothing behind the words. */
.post__body {
  display: block;
  max-width: 64ch;
  font-family: var(--font-serif);
  font-size: 18.5px;
  line-height: 1.7;
  color: var(--ink);
}

.post__body :deep(p) {
  margin: 20px 0 0;
}

.post__body > :deep(p:first-of-type) {
  margin-top: 0;
}

.post__body :deep(h2 + p) {
  margin-top: 12px;
}

/* Only the body's own first paragraph - never one inside a pull-quote. */
.post__body > :deep(p:first-of-type)::first-letter {
  float: left;
  font-family: var(--font-serif);
  font-size: 76px;
  line-height: 0.72;
  padding: 7px 12px 0 0;
  color: var(--accent);
}

/* Each section opens under a short length of the card's red rule. */
.post__body :deep(h2),
.post__body :deep(h3) {
  font-family: var(--font-serif);
  font-weight: 500;
  line-height: 1.2;
  margin: 48px 0 0;
  color: var(--ink);
}

.post__body :deep(h2)::before {
  content: '';
  display: block;
  width: 32px;
  height: 1.5px;
  margin-bottom: 16px;
  background: var(--card-rule);
}

.post__body :deep(h2:first-child) {
  margin-top: 0;
}

.post__body :deep(h2) { font-size: 25px; }
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

/* Pull-quote: the line worth keeping, typed on a slip and clipped to the page. */
.post__body :deep(blockquote) {
  position: relative;
  margin: 46px -26px;
  padding: 28px 32px 24px;
  background: var(--card-paper);
  box-shadow: 0 0 0 1px var(--line), 0 16px 26px -20px rgba(30, 30, 25, 0.55);
  rotate: -0.8deg;
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 24px;
  line-height: 1.4;
  color: var(--ink);
}

/* the paper clip */
.post__body :deep(blockquote)::before {
  content: '';
  position: absolute;
  top: -11px;
  left: 30px;
  width: 12px;
  height: 30px;
  border: 2px solid color-mix(in srgb, var(--ink) 45%, transparent);
  border-radius: 6px;
}

.post__body :deep(blockquote p) {
  margin: 0;
}

/* The slip settles onto the page as it scrolls in - where the browser can tie
   an animation to scrolling; elsewhere it is simply there. */
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .post__body :deep(blockquote) {
      --reveal-rot: 2.5deg;
      animation: lj-settle linear backwards;
      animation-timeline: view();
      animation-range: entry 10% entry 90%;
    }
  }
}

/* ---- The neighbours: the cards filed either side ------------------------- */
.post__filed {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 22px;
  margin: 44px 26px 0;
}

.filed {
  display: grid;
  align-content: start;
  gap: 4px;
  padding: 14px 20px 18px;
  background:
    linear-gradient(var(--card-rule), var(--card-rule)) 0 100% / 100% 1.5px no-repeat,
    var(--card-paper);
  border-radius: 4px;
  box-shadow: 0 0 0 1px var(--line), 0 14px 22px -18px rgba(30, 30, 25, 0.5);
  color: var(--ink);
  rotate: -0.8deg;
  transition: rotate 600ms var(--ease-spring), translate 600ms var(--ease-spring), box-shadow 300ms ease;
}

.filed--later {
  grid-column: 2;
  rotate: 0.7deg;
  text-align: right;
}

.filed:hover,
.filed:focus-visible {
  rotate: 0deg;
  translate: 0 -5px;
  box-shadow: 0 0 0 1px var(--line), 0 20px 26px -18px rgba(30, 30, 25, 0.55);
}

.filed__dir {
  font-family: var(--font-hand);
  font-size: 20px;
  line-height: 1;
  color: var(--accent2);
}

.filed__by {
  margin-top: 6px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  color: var(--muted);
}

.filed__title {
  font-family: var(--font-serif);
  font-size: 20px;
  line-height: 1.2;
  transition: color var(--transition);
}

.filed:hover .filed__title,
.filed:focus-visible .filed__title {
  color: var(--accent);
}

.post__back--end {
  display: table;
  margin: 40px auto 0;
}

.post--missing {
  max-width: 60ch;
}

.post--missing .post__title {
  margin-top: 0;
}

.post--missing .post__excerpt {
  margin: 14px 0 24px;
}

@media (max-width: 680px) {
  .post { padding: 28px 16px 64px; }
  .post__card {
    margin: 18px 6px 0;
    padding: 20px 20px 0;
  }
  .post__head { column-gap: 12px; }
  .post__stamp { font-size: 10.5px; padding: 3px 6px 2px; }
  .post__excerpt { font-size: 19px; }
  .post__sheet { padding: 58px 22px 44px; }
  .post__body :deep(blockquote) {
    margin: 40px -6px;
    padding: 24px 22px 20px;
    font-size: 21px;
  }
  .post__filed {
    grid-template-columns: 1fr;
    margin: 36px 6px 0;
  }
  .filed--later {
    grid-column: 1;
  }
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
