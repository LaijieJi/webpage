const modules = import.meta.glob('../photography/*.md', {
  eager: true
});

const entries = Object.entries(modules)
  .map(([path, mod]) => {
    const slug = path.split('/').pop().replace(/\.md$/, '');
    return {
      slug,
      component: mod.default,
      frontmatter: {
        title: mod.title || slug,
        date: mod.date || '',
        excerpt: mod.excerpt || '',
        instagramPostId: mod.instagramPostId || null
      }
    };
  })
  .sort((a, b) => toTime(b.frontmatter.date) - toTime(a.frontmatter.date));

export default entries;

export function getPhotoEntryBySlug(slug) {
  return entries.find((entry) => entry.slug === slug);
}

function toTime(value) {
  const time = Date.parse(value || '');
  return Number.isNaN(time) ? 0 : time;
}
