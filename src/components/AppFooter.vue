<template>
  <footer class="site-footer">
    <div class="site-footer__inner">
      <p>© {{ year }} Laijie Ji. Built with Vue, Vite, and a pinch of JS.</p>
      <ul class="site-footer__links">
        <li>
          <a href="https://github.com/LaijieJi" target="_blank" rel="noreferrer" aria-label="GitHub" v-html="githubIcon"></a>
        </li>
        <li>
          <a href="https://linkedin.com/in/laijie-ji" target="_blank" rel="noreferrer" aria-label="LinkedIn" v-html="linkedinIcon"></a>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue';
import githubIcon from '../assets/icons/github.svg?raw';
import linkedinIcon from '../assets/icons/linkedin.svg?raw';

const year = computed(() => new Date().getFullYear());
</script>
