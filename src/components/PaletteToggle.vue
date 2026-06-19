<template>
  <div class="palette">
    <span class="palette__label">palette</span>
    <button
      type="button"
      class="palette__switch"
      :data-palette="palette"
      :aria-label="`Switch to ${palette === 'alpine' ? 'warm' : 'alpine'} palette`"
      @click="toggle"
    >
      <span class="palette__knob" aria-hidden="true"></span>
      <span class="palette__ic palette__ic--alpine" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M2 19 L9 7 L14 15 L17 11 L22 19 Z" fill="currentColor" />
        </svg>
      </span>
      <span class="palette__ic palette__ic--warm" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round">
          <circle cx="12" cy="12" r="3.6" fill="currentColor" stroke="none" />
          <line x1="12" y1="3" x2="12" y2="5.5" />
          <line x1="12" y1="18.5" x2="12" y2="21" />
          <line x1="3" y1="12" x2="5.5" y2="12" />
          <line x1="18.5" y1="12" x2="21" y2="12" />
          <line x1="6" y1="6" x2="7.7" y2="7.7" />
          <line x1="16.3" y1="16.3" x2="18" y2="18" />
          <line x1="18" y1="6" x2="16.3" y2="7.7" />
          <line x1="7.7" y1="16.3" x2="6" y2="18" />
        </svg>
      </span>
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const STORAGE_KEY = 'lj-palette';
const palette = ref('alpine');

function apply(next) {
  palette.value = next;
  const el = document.documentElement;
  if (next === 'warm') el.dataset.palette = 'warm';
  else delete el.dataset.palette;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch (e) {
    /* ignore */
  }
}

function toggle() {
  apply(palette.value === 'alpine' ? 'warm' : 'alpine');
}

onMounted(() => {
  palette.value = document.documentElement.dataset.palette === 'warm' ? 'warm' : 'alpine';
});
</script>

<style scoped>
.palette {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.palette__label {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--faint);
}

.palette__switch {
  position: relative;
  width: 56px;
  height: 28px;
  flex-shrink: 0;
  padding: 0;
  border-radius: 999px;
  background: var(--shade);
  border: 1px solid var(--line);
  transition: border-color var(--transition);
}

.palette__switch:hover,
.palette__switch:focus-visible {
  border-color: var(--accent);
}

.palette__knob {
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

.palette__switch[data-palette='warm'] .palette__knob {
  transform: translateX(28px);
}

.palette__ic {
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

.palette__ic svg {
  width: 14px;
  height: 14px;
  display: block;
}

.palette__ic--alpine {
  left: 2px;
}

.palette__ic--warm {
  right: 2px;
}

.palette__switch:not([data-palette='warm']) .palette__ic--alpine {
  color: var(--paper);
}

.palette__switch[data-palette='warm'] .palette__ic--warm {
  color: var(--paper);
}
</style>
