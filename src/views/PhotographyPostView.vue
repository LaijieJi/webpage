<template>
  <section class="view-section">
    <div class="wrap" v-if="entry">
      <article class="post">
        <header>
          <h1 class="view-heading">{{ entry.frontmatter.title }}</h1>
          <PostMeta :date="entry.frontmatter.date" />
        </header>
        <InstagramEmbed
          v-if="entry.frontmatter.instagramPostId"
          :postId="entry.frontmatter.instagramPostId"
          :caption="entry.frontmatter.title"
        />
        <component :is="entry.component" class="post-content" />
        <router-link class="button button--ghost" to="/photography">← Back to photography</router-link>
      </article>
    </div>
    <div class="wrap" v-else>
      <article class="post">
        <h1 class="view-heading">Entry not found</h1>
        <p class="view-text">We couldn't find this photography entry.</p>
        <router-link class="button" to="/photography">Back to photography</router-link>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { getPhotoEntryBySlug } from '../data/photography.js';
import PostMeta from '../components/PostMeta.vue';
import InstagramEmbed from '../components/InstagramEmbed.vue';

const route = useRoute();
const entry = computed(() => getPhotoEntryBySlug(route.params.slug));
</script>
