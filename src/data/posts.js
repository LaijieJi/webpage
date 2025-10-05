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
    const frontmatter = mod.frontmatter || {};
    return {
      slug,
      component: mod.default,
      frontmatter: {
        title: frontmatter.title || slug,
        date: frontmatter.date || '',
        tags: normalizeTags(frontmatter.tags),
        excerpt: frontmatter.excerpt || mod.excerpt || ''
      }
    };
  })
  .sort((a, b) => toTime(b.frontmatter.date) - toTime(a.frontmatter.date));

export default posts;

export function getPostBySlug(slug) {
  return posts.find((post) => post.slug === slug);
}

function toTime(value) {
  const time = Date.parse(value || '');
  return Number.isNaN(time) ? 0 : time;
}
