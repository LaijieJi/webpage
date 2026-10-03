import { useHead } from '@unhead/vue';

export const SITE_URL = 'https://laijie.dev';
export const OG_IMAGE = `${SITE_URL}/og.jpg`;
export const OG_IMAGE_SIZE = { width: 1600, height: 1066 };
// Journal entries' share cards (scripts/og-cards.js renders them at this size).
export const OG_CARD_SIZE = { width: 1200, height: 630 };

// A page's public address. GitHub Pages serves each prerendered page from
// <route>/index.html and redirects the slashless URL there, so canonicals and
// structured data use the slashed form.
export function pageUrl(path) {
  return `${SITE_URL}${path.endsWith('/') ? path : `${path}/`}`;
}

// Per-route SEO tags. Site-wide constants (og:site_name, twitter:card) live in
// App.vue; everything here varies per page. `ld` takes schema.org objects and
// renders them as JSON-LD scripts. `image` is an absolute URL; `imageSize` is
// given only when known.
export function useSeo({
  title,
  description = '',
  path = '/',
  type = 'website',
  ogTitle = title,
  ogDescription = description,
  image = OG_IMAGE,
  imageSize = image === OG_IMAGE ? OG_IMAGE_SIZE : null,
  meta = [],
  ld = []
}) {
  const url = pageUrl(path);
  useHead({
    title,
    link: [{ rel: 'canonical', href: url }],
    meta: [
      { name: 'description', content: description },
      { property: 'og:type', content: type },
      { property: 'og:title', content: ogTitle },
      { property: 'og:description', content: ogDescription },
      { property: 'og:url', content: url },
      { property: 'og:image', content: image },
      ...(imageSize
        ? [
            { property: 'og:image:width', content: String(imageSize.width) },
            { property: 'og:image:height', content: String(imageSize.height) }
          ]
        : []),
      { name: 'twitter:title', content: ogTitle },
      { name: 'twitter:description', content: ogDescription },
      { name: 'twitter:image', content: image },
      ...meta
    ],
    script: ld.map((obj) => ({
      type: 'application/ld+json',
      innerHTML: JSON.stringify(obj).replace(/</g, '\\u003c')
    }))
  });
}
