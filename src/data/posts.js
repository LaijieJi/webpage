const modules = import.meta.glob('../posts/*.md', {
  eager: true
});

// Raw source of each post, used to estimate reading time.
const rawModules = import.meta.glob('../posts/*.md', {
  eager: true,
  query: '?raw',
  import: 'default'
});

function readingMinutes(raw) {
  if (!raw) return 1;
  const text = raw
    .replace(/^---[\s\S]*?---/, '') // frontmatter
    .replace(/```[\s\S]*?```/g, ' ') // code fences
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> text
    .replace(/[#>*_`~]/g, ' ');
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

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
      readingTime: readingMinutes(rawModules[path]),
      frontmatter: {
        title: mod.title || slug,
        date: mod.date || '',
        tags: normalizeTags(mod.tags),
        excerpt: mod.excerpt || ''
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
