import readingTimes from 'virtual:reading-times';

const modules = import.meta.glob('../posts/*.md', {
  eager: true
});

function normalizeTags(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) {
    return value
      .replace(/^\[|\]$/g, '')
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return [];
}

const posts = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '');
    return {
      slug,
      component: mod.default,
      readingTime: readingTimes[slug] || 1,
      frontmatter: {
        title: mod.title || slug,
        date: mod.date || '',
        tags: normalizeTags(mod.tags),
        excerpt: mod.excerpt || '',
        variant: mod.variant || '',
        book: mod.book || '',
        bookAuthor: mod.bookAuthor || ''
      }
    };
  })
  .sort((a, b) => toTime(b.frontmatter.date) - toTime(a.frontmatter.date));

export default posts;

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug);
}

// Newer = more recent (the list is sorted newest-first); older = further back.
export function getAdjacentPosts(slug) {
  const i = posts.findIndex((post) => post.slug === slug);
  if (i === -1) return { newer: null, older: null };
  return {
    newer: i > 0 ? posts[i - 1] : null,
    older: i < posts.length - 1 ? posts[i + 1] : null
  };
}

function toTime(value) {
  const time = Date.parse(value || '');
  return Number.isNaN(time) ? 0 : time;
}
