<template>
  <div>
    <button
      class="theme-toggle"
      type="button"
      :aria-pressed="isDark ? 'true' : 'false'"
      @click="toggleTheme"
    >
      <span class="visually-hidden">Cambiar tema</span>
      <span class="theme-toggle__icons" aria-hidden="true" v-html="icon"></span>
    </button>
    <span class="visually-hidden" aria-live="polite">{{ announcement }}</span>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import sunIcon from '../assets/icons/sun.svg?raw';
import moonIcon from '../assets/icons/moon.svg?raw';

const STORAGE_KEY = 'lj-theme';
const isDark = ref(false);
const announcement = ref('');
let mediaQuery;

function apply(theme, persist = true, announce = true) {
  const next = theme === 'dark' ? 'dark' : 'light';
  document.documentElement.dataset.theme = next;
  isDark.value = next === 'dark';
  if (persist) {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch (error) {
      // ignore storage errors
    }
  }
  if (announce) {
    announcement.value = `Tema configurado en ${next === 'dark' ? 'oscuro' : 'claro'}.`;
  }
}

function toggleTheme() {
  apply(isDark.value ? 'light' : 'dark');
}

onMounted(() => {
  let stored = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    stored = null;
  }
  if (stored) {
    apply(stored, false, false);
  } else if (window.matchMedia) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    apply(mediaQuery.matches ? 'dark' : 'light', false, false);
  }

  if (!mediaQuery && window.matchMedia) {
    mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  }

  if (mediaQuery) {
    const handler = (event) => {
      const storedPreference = (() => {
        try {
          return localStorage.getItem(STORAGE_KEY);
        } catch (error) {
          return null;
        }
      })();
      if (storedPreference) return;
      apply(event.matches ? 'dark' : 'light', false);
    };
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handler);
    } else if (typeof mediaQuery.addListener === 'function') {
      mediaQuery.addListener(handler);
    }
    onBeforeUnmount(() => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', handler);
      } else if (typeof mediaQuery.removeListener === 'function') {
        mediaQuery.removeListener(handler);
      }
    });
  }
});

const icon = computed(() => (isDark.value ? sunIcon : moonIcon));
</script>

<style scoped>
.theme-toggle__icons svg {
  display: block;
}
</style>
