// The shelf: every book finished, reviewed or not, filed by the year it was
// read. Reviews come from the journal; the rest from `finished` in books.js.
import posts, { cardTitle } from './posts.js';
import { finished } from './books.js';

const keyOf = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const reviewed = posts
  .filter((post) => post.frontmatter.book)
  .map((post) => ({
    title: cardTitle(post),
    author: post.frontmatter.bookAuthor,
    year: new Date(post.frontmatter.date).getFullYear(),
    time: Date.parse(post.frontmatter.date) || 0,
    rating: post.frontmatter.rating || 0,
    slug: post.slug
  }));

const byKey = new Map(reviewed.map((book) => [keyOf(book.title), book]));
// A listed book that also has a review keeps the review's link and rating,
// with the listed year (and rating, if one is given) on top.
finished.forEach((book, i) => {
  const key = keyOf(book.title);
  const review = byKey.get(key);
  byKey.set(key, {
    ...review,
    title: book.title,
    author: book.author || review?.author || '',
    year: book.year,
    // unreviewed books have no date: keep them in the order they're listed
    time: review && review.year === book.year ? review.time : -i,
    rating: book.rating || review?.rating || 0,
    slug: review?.slug
  });
});

const books = [...byKey.values()].sort((a, b) => b.year - a.year || b.time - a.time);

// [{ year, books }], newest year first.
export const shelf = books.reduce((years, book) => {
  const last = years[years.length - 1];
  if (last && last.year === book.year) last.books.push(book);
  else years.push({ year: book.year, books: [book] });
  return years;
}, []);

export const shelfCount = books.length;
