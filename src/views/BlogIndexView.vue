<template>
  <section class="view-section">
    <div class="wrap">
      <header class="hero">
        <div>
          <h1 class="view-heading">Blog</h1>
          <p class="view-text">
            Notes from when I feel like it.
          </p>
          <br/>
        </div>
      </header>
      <PostList :posts="posts" />
    </div>
  </section>
</template>

<script setup>
import posts from '../data/posts.js';
import PostList from '../components/PostList.vue';
</script>
