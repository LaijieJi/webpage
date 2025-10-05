<template>
  <section class="post-list">
    <router-link
      v-for="post in orderedPosts"
      :key="post.slug"
      class="post-card post-card--link"
      :to="`/blog/${post.slug}`"
    >
      <h2 class="post-card__title">{{ post.frontmatter.title }}</h2>
      <PostMeta :date="post.frontmatter.date" :tags="post.frontmatter.tags" />
      <p class="post-card__excerpt">{{ post.frontmatter.excerpt }}</p>
      <span class="post-card__hint" aria-hidden="true">Leer más →</span>
    </router-link>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import PostMeta from './PostMeta.vue';

const props = defineProps({
  posts: {
    type: Array,
    default: () => []
  }
});

const orderedPosts = computed(() =>
  [...props.posts].sort(
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
