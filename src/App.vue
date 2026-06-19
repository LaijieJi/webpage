<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">Saltar al contenido principal</a>
    <AppHeader />
    <main id="main-content" class="app-main" tabindex="-1">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
</script>
