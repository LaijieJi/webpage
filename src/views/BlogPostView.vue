<template>
  <section class="view-section">
    <div class="wrap" v-if="post">
      <article class="post">
        <header>
          <h1 class="view-heading">{{ post.title }}</h1>
          <PostMeta :date="post.date" :tags="post.tags" />
        </header>
        <div class="post-content" v-html="post.html"></div>
        <router-link class="button button--ghost" to="/blog">← Volver al blog</router-link>
      </article>
    </div>
    <div class="wrap" v-else>
      <article class="post">
        <h1 class="view-heading">Entrada no encontrada</h1>
        <p class="view-text">No pudimos encontrar este artículo. Quizás te interese revisar otras notas.</p>
        <router-link class="button" to="/blog">Ir al blog</router-link>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import posts from '../data/posts.json';
import PostMeta from '../components/PostMeta.vue';

const route = useRoute();

const post = computed(() => posts.find((entry) => entry.slug === route.params.slug));
</script>
