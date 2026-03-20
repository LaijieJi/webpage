<template>
  <section class="post-list">
    <router-link
      v-for="entry in orderedEntries"
      :key="entry.slug"
      class="post-card post-card--link"
      :to="`/photography/${entry.slug}`"
    >
      <h2 class="post-card__title">{{ entry.frontmatter.title }}</h2>
      <PostMeta :date="entry.frontmatter.date" />
      <p class="post-card__excerpt">{{ entry.frontmatter.excerpt }}</p>
      <span class="post-card__hint" aria-hidden="true">View story →</span>
    </router-link>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import PostMeta from './PostMeta.vue';

const props = defineProps({
  entries: {
    type: Array,
    default: () => []
  }
});

const orderedEntries = computed(() =>
  [...props.entries].sort(
    (a, b) => new Date(b.frontmatter?.date || 0) - new Date(a.frontmatter?.date || 0)
  )
);
</script>

<style scoped>
.post-card--link {
  text-decoration: none;
  color: inherit;
  display: grid;
  gap: var(--space-md);
}

.post-card--link:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 4px;
}

.post-card__hint {
  font-size: 0.85rem;
  color: var(--accent-strong);
}
</style>
