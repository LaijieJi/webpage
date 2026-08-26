import { useHead } from '@unhead/vue';

export const SITE_URL = 'https://laijie.dev';
export const OG_IMAGE = `${SITE_URL}/og.jpg`;

// Per-route SEO tags. Site-wide constants (og:site_name, og:image, twitter:card)
// live in App.vue; everything here varies per page. `ld` takes schema.org
// objects and renders them as JSON-LD scripts.
export function useSeo({ title, description = '', path = '/', type = 'website', ogTitle = title, ogDescription = description, ld = [] }) {
  const url = `${SITE_URL}${path}`;
  useHead({
    title,
    link: [{ rel: 'canonical', href: url }],
    meta: [
      { name: 'description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:title', content: ogTitle },
      { property: 'og:description', content: ogDescription },
      { property: 'og:url', content: url },
      { name: 'twitter:title', content: ogTitle },
      { name: 'twitter:description', content: ogDescription }
    ],
    script: ld.map((obj) => ({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(obj).replace(/</g, '\\u003c')
    }))
  });
}
