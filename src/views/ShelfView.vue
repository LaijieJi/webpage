<template>
  <div class="shelf">
    <header class="shelf__head">
      <p class="eyebrow">The shelf</p>
      <h1 class="shelf__title">Everything I've read.</h1>
      <p class="shelf__lede">
        Every book I've finished, newest first, with the rating I gave it. Where I wrote about one, the title
        takes you to the review.
      </p>
    </header>

    <!-- the register: one ruled page, a year to a section, as a library logs
         what comes in -->
    <div class="register">
      <p class="register__cols" aria-hidden="true">
        <span>title</span><span>author</span><span>rated</span>
      </p>
      <section v-for="(entry, i) in shelf" :key="entry.year" class="year" v-reveal :style="{ '--i': Math.min(i, 3) }">
        <h2 class="year__label">
          {{ entry.year }}
          <span class="year__n">{{ entry.books.length }} {{ entry.books.length === 1 ? 'book' : 'books' }}</span>
        </h2>
        <ol class="year__books">
          <li v-for="book in entry.books" :key="book.title" class="book">
            <span class="book__title">
              <router-link v-if="book.slug" :to="`/blog/${book.slug}`">{{ book.title }}</router-link>
              <template v-else>{{ book.title }}</template>
            </span>
            <span class="book__author">{{ book.author }}</span>
            <span v-if="book.rating" class="book__rating" :aria-label="`rated ${book.rating} out of 5`">{{ book.rating }}</span>
            <span v-else class="book__rating book__rating--none" aria-hidden="true">-</span>
          </li>
        </ol>
      </section>
    </div>

    <section v-if="readingList.length" class="pile" v-reveal>
      <h2 class="pile__label">on the pile</h2>
      <p class="pile__books">
        <template v-for="(book, i) in readingList" :key="book.title">
          <em>{{ book.title }}</em>, {{ book.author }}<template v-if="i < readingList.length - 1"> · </template>
        </template>
      </p>
    </section>
  </div>
</template>

<script setup>
import { shelf, shelfCount } from '../data/shelf.js';
import { readingList } from '../data/books.js';
import { useSeo } from '../composables/useSeo.js';

useSeo({
  title: 'The Shelf - Laijie Ji',
  description: `Every book I've finished (${shelfCount} so far), by year and with a rating, linked to the review where I wrote one.`,
  path: '/shelf'
});
</script>

<style scoped>
.shelf {
  max-width: 820px;
  margin: 0 auto;
  padding: 64px 40px 96px;
}

.shelf__title {
  font-family: var(--font-serif);
  font-weight: 400;
  font-size: clamp(32px, 4.6vw, 52px);
  line-height: 1.06;
  margin: 14px 0 0;
}

/* The heading is set down line by line as the page opens. */
.shelf__head > * {
  --reveal-rot: -1deg;
  animation: lj-settle var(--dur-settle) var(--ease-settle) calc(var(--n, 0) * 90ms + 60ms) backwards;
}

.shelf__title { --n: 1; }
.shelf__lede { --n: 2; }

.shelf__lede {
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 19px;
  color: var(--muted);
  margin: 16px 0 0;
  max-width: 52ch;
}

/* ---- The register: a ruled page, red double rule under the column heads -- */
.register {
  --row: 44px;
  --cols: minmax(0, 1.4fr) minmax(0, 1fr) 52px;

  margin-top: 44px;
  padding: 22px 34px 30px;
  background: var(--card-paper);
  border-radius: 5px;
  box-shadow: 0 0 0 1px var(--line), 0 26px 40px -30px rgb(var(--shadow) / 0.55);
}

.register__cols {
  display: grid;
  grid-template-columns: var(--cols);
  gap: 18px;
  margin: 0;
  padding-bottom: 10px;
  border-bottom: 4px double var(--card-rule);
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.08em;
  color: var(--faint);
}

.register__cols span:last-child {
  text-align: right;
}

.year__label {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin: 26px 0 0;
  padding-bottom: 8px;
  font-family: var(--font-serif);
  font-weight: 500;
  font-size: 24px;
  color: var(--ink);
}

.year__n {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 11.5px;
  color: var(--faint);
}

.year__books {
  list-style: none;
  margin: 0;
  padding: 0;
  border-top: 1px solid var(--card-line);
}

.book {
  display: grid;
  grid-template-columns: var(--cols);
  gap: 18px;
  align-items: baseline;
  min-height: var(--row);
  padding: 11px 0 9px;
  border-bottom: 1px solid var(--card-line);
}

.book__title {
  font-family: var(--font-serif);
  font-size: 19px;
  line-height: 1.3;
  color: var(--ink);
}

.book__title a {
  color: inherit;
  border-bottom: 1px solid var(--line);
  transition: color var(--transition), border-color var(--transition);
}

.book__title a:hover,
.book__title a:focus-visible {
  color: var(--accent);
  border-color: var(--accent);
}

.book__author {
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--muted);
}

/* the rating, written in the margin in the librarian's blue */
.book__rating {
  font-family: var(--font-mono);
  font-size: 13px;
  text-align: right;
  color: var(--accent2);
}

.book__rating--none {
  color: var(--faint);
}

/* ---- On the pile -------------------------------------------------------- */
.pile {
  margin-top: 46px;
}

.pile__label {
  margin: 0 0 8px;
  font-family: var(--font-hand);
  font-weight: 400;
  font-size: 28px;
  color: var(--accent2);
  rotate: -2deg;
  width: fit-content;
}

.pile__books {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 18px;
  line-height: 1.6;
  color: var(--muted);
}

.pile__books em {
  color: var(--ink);
}

/* Phones: the author drops under the title; the rating stays in the margin. */
@media (max-width: 640px) {
  .shelf {
    padding: 44px 16px 64px;
  }

  .register {
    --cols: minmax(0, 1fr) 40px;
    padding: 18px 18px 24px;
  }

  .register__cols span:nth-child(2) {
    display: none;
  }

  .book {
    grid-template-columns: var(--cols);
    row-gap: 2px;
  }

  .book__author {
    grid-row: 2;
  }

  .book__rating {
    grid-column: 2;
    grid-row: 1;
  }
}
</style>
