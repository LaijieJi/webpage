<template>
  <section class="post-list">
    <article v-for="post in orderedPosts" :key="post.slug" class="post-card">
      <h2 class="post-card__title">
        <router-link :to="`/blog/${post.slug}`">{{ post.title }}</router-link>
      </h2>
      <PostMeta :date="post.date" :tags="post.tags" />
      <p class="post-card__excerpt">{{ post.excerpt }}</p>
    </article>
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
  [...props.posts].sort((a, b) => new Date(b.date) - new Date(a.date))
);
</script>
