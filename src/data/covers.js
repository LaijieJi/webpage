// Book covers, one per review, filed under the review's slug without its
// "book-" prefix (src/assets/covers/<name>.webp). From Open Library.
const files = import.meta.glob('../assets/covers/*.webp', { eager: true, import: 'default' });

export function coverFor(slug) {
  return (slug && files[`../assets/covers/${slug.replace(/^book-/, '')}.webp`]) || '';
}
