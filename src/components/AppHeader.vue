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
          :aria-current="isCurrent(item.to) ? 'page' : undefined"
        >
          {{ item.label }}
        </router-link>
      </nav>
      <ThemeToggle />
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import ThemeToggle from './ThemeToggle.vue';

const route = useRoute();
const links = [
  { label: 'Home', to: '/' },
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' }
];

const isCurrent = (path) => {
  if (path === '/') {
    return route.path === '/';
  }
  return route.path.startsWith(path);
};
</script>

<style scoped>
.site-nav__link {
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius);
  color: var(--muted);
  font-weight: 500;
  position: relative;
}

.site-nav__link[aria-current='page'] {
  color: var(--text);
}

.site-nav__link[aria-current='page']::after {
  content: '';
  position: absolute;
  inset-inline: var(--space-xs);
  height: 2px;
  border-radius: 999px;
  bottom: -0.35rem;
  background: var(--accent);
}
</style>
