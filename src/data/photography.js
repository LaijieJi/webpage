import { defineAsyncComponent } from 'vue';
import { photography as meta } from 'virtual:entry-meta';

// As with the journal (src/data/posts.js): frontmatter built in, each story's
// text fetched when it is opened.
const bodies = import.meta.glob('../photography/*.md');

const loaded = {};
export function loadPhotoBody(slug) {
  const load = bodies[`../photography/${slug}.md`];
  if (!load) return Promise.resolve();
  // a failed fetch is forgotten, so opening the entry again tries again
  return (loaded[slug] ||= load().then((mod) => mod.default, (error) => {
    delete loaded[slug];
    throw error;
  }));
}

const entries = Object.entries(meta)
  .map(([slug, mod]) => ({
    slug,
    component: defineAsyncComponent(() => loadPhotoBody(slug)),
    frontmatter: {
      title: mod.title || slug,
      date: mod.date || '',
      excerpt: mod.excerpt || '',
      instagramPostId: mod.instagramPostId || null
    }
  }))
  .sort((a, b) => toTime(b.frontmatter.date) - toTime(a.frontmatter.date));

export default entries;

export function getPhotoEntryBySlug(slug) {
  return entries.find((entry) => entry.slug === slug);
}

function toTime(value) {
  const time = Date.parse(value || '');
  return Number.isNaN(time) ? 0 : time;
}
