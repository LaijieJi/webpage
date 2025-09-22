<template>
  <div class="app-shell">
    <a class="skip-link" href="#main-content">Saltar al contenido principal</a>
    <AppHeader />
    <main id="main-content" class="app-main" tabindex="-1">
      <RouterView />
    </main>
    <AppFooter />
    <button
      v-if="showTop"
      class="to-top"
      type="button"
      @click="scrollToTop"
    >
      ↑
      <span class="visually-hidden">Volver arriba</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';

const showTop = ref(false);

const onScroll = () => {
  showTop.value = window.scrollY > 400;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<style scoped>
.to-top {
  position: fixed;
  right: var(--space-xl);
  bottom: var(--space-xl);
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  box-shadow: var(--shadow);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  transition: transform var(--transition), box-shadow var(--transition);
}

.to-top:hover,
.to-top:focus-visible {
  transform: translateY(-2px);
  box-shadow: 0 18px 36px -26px rgba(15, 23, 42, 0.6);
}
</style>
