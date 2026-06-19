<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">Saltar al contenido principal</a>
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
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';

const route = useRoute();
</script>
