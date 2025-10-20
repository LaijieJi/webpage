<template>
  <section class="view-section">
    <div class="wrap" v-if="post">
      <article class="post">
        <header>
          <h1 class="view-heading">{{ post.frontmatter.title }}</h1>
          <PostMeta :date="post.frontmatter.date" :tags="post.frontmatter.tags" />
        </header>
        <component :is="post.component" class="post-content" />
        <router-link class="button button--ghost" to="/blog">← Return to content.</router-link>
      </article>
    </div>
    <div class="wrap" v-else>
      <article class="post">
        <h1 class="view-heading">We couldn't not find the requested item. </h1>
        <p class="view-text">No pudimos encontrar este artículo. Quizás te interese revisar otras notas.
          We couldn not find the article, maybe it is interesting for you to review different notes.
        </p>
        <router-link class="button" to="/blog">Ir al blog</router-link>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import posts, { getPostBySlug } from '../data/posts.js';
import PostMeta from '../components/PostMeta.vue';

const route = useRoute();

const post = computed(() => getPostBySlug(route.params.slug));
</script>
