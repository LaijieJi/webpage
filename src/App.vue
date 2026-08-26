<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">Skip to main content</a>
    <AppHeader />
    <main id="main-content" class="app-main" tabindex="-1">
      <RouterView v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </RouterView>
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { RouterView, useRoute } from 'vue-router';
import { useHead } from '@unhead/vue';
import { OG_IMAGE } from './composables/useSeo.js';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';

const route = useRoute();

// Site-wide defaults; each view layers its own tags on top via useSeo().
useHead({
  title: 'Laijie Ji - Full-Stack Developer',
  meta: [
    { property: 'og:site_name', content: 'Laijie Ji' },
    { property: 'og:image', content: OG_IMAGE },
    { property: 'og:image:width', content: '1600' },
    { property: 'og:image:height', content: '1066' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:image', content: OG_IMAGE }
  ]
});
</script>
