<template>
  <header class="site-header">
    <div class="site-header__inner">
      <router-link class="site-brand" to="/" aria-label="Laijie Ji"><BrandMark /></router-link>
      <nav class="site-nav" aria-label="Primary">
        <router-link
          v-for="item in links"
          :key="item.to"
          :to="item.to"
          class="site-nav__link"
          :style="{ '--nav-color': item.color }"
          :aria-current="isCurrent(item.to) ? 'page' : undefined"
        >
          {{ item.label }}
          <span class="site-nav__squiggle" aria-hidden="true">
            <svg width="100%" height="7" viewBox="0 0 60 7" preserveAspectRatio="none">
              <path
                d="M1 4 Q 8 1 15 4 T 29 4 T 43 4 T 59 4"
                fill="none"
                stroke="currentColor"
                stroke-width="1.8"
                stroke-linecap="round"
                pathLength="1"
              />
            </svg>
          </span>
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { useRoute } from 'vue-router';
import BrandMark from './BrandMark.vue';

const route = useRoute();
const links = [
  { label: 'me', to: '/', color: 'var(--accent)' },
  { label: 'projects', to: '/projects', color: 'var(--accent)' },
  { label: 'blog', to: '/blog', color: 'var(--accent)' },
  { label: 'photography', to: '/photography', color: 'var(--accent2)' }
];

const isCurrent = (path) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};
</script>

<style scoped>
.site-header {
  view-transition-name: site-header; /* holds still while a page morphs */
  position: sticky;
  top: 0;
  z-index: 50;
  background: var(--veil);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--line);
}

.site-header__inner {
  max-width: 1040px;
  margin: 0 auto;
  padding: 16px 40px;
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 24px;
}

.site-brand {
  display: block;
  flex: none;
  height: 46px;
  margin: -9px 0 -11px; /* the mark is taller than the nav line; let it hang into the padding */
  color: var(--ink);
  align-self: center;
}

/* The dot hops when the mark is pointed at. */
.site-brand :deep(.brand-mark__dot) {
  transition: translate 500ms var(--ease-spring);
}

.site-brand:hover :deep(.brand-mark__dot),
.site-brand:focus-visible :deep(.brand-mark__dot) {
  translate: 0 -10px; /* user units of the mark: about 4px on screen */
}

.site-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 28px;
  font-family: var(--font-mono);
  font-size: 13px;
}

.site-nav__link {
  position: relative;
  padding: 4px 0;
  color: var(--ink);
}

.site-nav__link:hover,
.site-nav__link:focus-visible,
.site-nav__link[aria-current='page'] {
  color: var(--nav-color, var(--accent));
}

.site-nav__squiggle {
  position: absolute;
  left: -2px;
  right: -2px;
  bottom: -8px;
  height: 7px;
  color: var(--nav-color, var(--accent));
}

.site-nav__squiggle svg {
  display: block;
}

/* Every link has a squiggle. Hovering sketches it in faintly and it is
   rubbed out again on leave; the current page's is drawn in full. */
.site-nav__squiggle path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  opacity: 0; /* the round cap would otherwise leave a dot behind */
  transition: stroke-dashoffset 380ms var(--ease-out), opacity 380ms ease;
}

.site-nav__link:hover .site-nav__squiggle path,
.site-nav__link:focus-visible .site-nav__squiggle path {
  stroke-dashoffset: 0;
  opacity: 0.45;
}

.site-nav__link[aria-current='page'] .site-nav__squiggle path {
  stroke-dashoffset: 0;
  opacity: 1;
  animation: lj-draw 0.55s cubic-bezier(0.6, 0.1, 0.3, 1) 0.15s both;
}

/* Small screens: the mark is narrow enough to share a row with the links. */
@media (max-width: 640px) {
  .site-header__inner {
    gap: 16px;
    padding: 14px 18px;
  }
  .site-brand {
    height: 40px;
    margin: -8px 0 -9px;
  }
  .site-nav {
    gap: 16px;
    justify-content: flex-end;
  }
}
</style>
