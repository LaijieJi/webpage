<template>
  <!-- The shelf's canvas is aria-hidden presentation, so this list is the shelf's
       real interface. It renders unconditionally: it has to exist in the
       prerendered HTML and before the three.js chunk arrives. -->
  <nav class="journal-shelf-index" aria-label="Every entry in the journal">
    <ul>
      <li v-for="post in posts" :key="post.slug">
        <router-link :to="`/blog/${post.slug}`">
          {{ post.frontmatter.book || post.frontmatter.title }}
          <span v-if="post.frontmatter.bookAuthor">— {{ post.frontmatter.bookAuthor }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script setup>
import posts from '../data/posts.js';
</script>
