<template>
  <header class="site-header">
    <div class="site-header__inner">
      <router-link class="site-brand" to="/">Laijie Ji</router-link>
      <nav class="site-nav" aria-label="Principal">
        <router-link
          v-for="item in links"
          :key="item.to"
          :to="item.to"
          class="site-nav__link"
          :style="{ '--nav-color': item.color }"
          :aria-current="isCurrent(item.to) ? 'page' : undefined"
        >
          {{ item.label }}
          <span v-if="isCurrent(item.to)" class="site-nav__squiggle" aria-hidden="true">
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

const route = useRoute();
const links = [
  { label: 'home', to: '/', color: 'var(--accent)' },
  { label: 'projects', to: '/projects', color: 'var(--accent)' },
  { label: 'blog', to: '/blog', color: 'var(--accent)' },
  { label: 'photography', to: '/photography', color: 'var(--accent2)' },
  { label: 'garage', to: '/car-maintenance', color: 'var(--garage)' }
];

const isCurrent = (path) => {
  if (path === '/') return route.path === '/';
  return route.path.startsWith(path);
};
</script>

<style scoped>
.site-header {
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
  font-family: var(--font-serif);
  font-size: 25px;
  color: var(--ink);
  letter-spacing: 0.01em;
  white-space: nowrap;
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

.site-nav__squiggle path {
  stroke-dasharray: 1;
  animation: lj-draw 0.45s ease both;
}

@media (max-width: 640px) {
  .site-header__inner {
    flex-wrap: wrap;
    gap: 14px;
    padding: 14px 22px;
  }
  .site-nav {
    width: 100%;
    gap: 18px;
    justify-content: space-between;
  }
}
</style>
