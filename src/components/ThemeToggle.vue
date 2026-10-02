<template>
  <div class="theme">
    <span class="theme__label">night</span>
    <button
      type="button"
      class="theme__switch"
      :aria-pressed="theme === 'dark'"
      aria-label="Dark theme"
      @click="setTheme(theme === 'dark' ? 'light' : 'dark')"
    >
      <span class="theme__knob" aria-hidden="true"></span>
      <!-- day: a window with the light coming through -->
      <span class="theme__ic theme__ic--day" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <rect x="4" y="4" width="7" height="7" rx="1" />
          <rect x="13" y="4" width="7" height="7" rx="1" />
          <rect x="4" y="13" width="7" height="7" rx="1" />
          <rect x="13" y="13" width="7" height="7" rx="1" />
        </svg>
      </span>
      <!-- night: the moon -->
      <span class="theme__ic theme__ic--night" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 3.5 A 9 9 0 1 0 20.5 16 A 7 7 0 0 1 15.5 3.5 Z" />
        </svg>
      </span>
    </button>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { theme, setTheme, watchTheme } from '../composables/useTheme.js';

onMounted(watchTheme);
</script>

<style scoped>
.theme {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.theme__label {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--faint);
}

.theme__switch {
  position: relative;
  width: 56px;
  height: 28px;
  flex-shrink: 0;
  padding: 0;
  border-radius: 999px;
  background: var(--shade);
  border: 1px solid var(--line);
  cursor: pointer;
  transition: border-color var(--transition);
}

.theme__switch:hover,
.theme__switch:focus-visible {
  border-color: var(--accent);
}

.theme__knob {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--accent);
  transition: transform var(--transition);
  z-index: 1;
}

.theme__switch[aria-pressed='true'] .theme__knob {
  transform: translateX(28px);
}

.theme__ic {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--faint);
  z-index: 2;
  pointer-events: none;
}

.theme__ic svg {
  width: 13px;
  height: 13px;
  display: block;
}

.theme__ic--day {
  left: 2px;
}

.theme__ic--night {
  right: 2px;
}

.theme__switch[aria-pressed='false'] .theme__ic--day,
.theme__switch[aria-pressed='true'] .theme__ic--night {
  color: var(--paper);
}
</style>
