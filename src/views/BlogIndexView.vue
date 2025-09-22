<template>
  <section class="view-section">
    <div class="wrap">
      <header class="hero">
        <div>
          <h1 class="view-heading">Blog</h1>
          <p class="view-text">
            Notas rápidas sobre aprendizaje continuo, experiencias de equipo y viajes tecnológicos.
          </p>
        </div>
      </header>
      <PostList :posts="posts" />
    </div>
  </section>
</template>

<script setup>
import posts from '../data/posts.json';
import PostList from '../components/PostList.vue';
</script>
