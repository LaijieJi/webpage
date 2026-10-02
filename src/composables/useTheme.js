import { ref } from 'vue';

// Light or dark. index.html sets data-theme on <html> before the first paint:
// the visitor's saved choice if they made one, otherwise their system setting.
// Until they choose, the site keeps following the system.
const STORAGE_KEY = 'lj-theme';

export const theme = ref('light');

let started = false;

function saved() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

function show(next) {
  theme.value = next;
  if (next === 'dark') document.documentElement.dataset.theme = 'dark';
  else delete document.documentElement.dataset.theme;
}

// Client-only; safe to call from every component that needs the theme.
export function watchTheme() {
  if (started || typeof window === 'undefined') return;
  started = true;
  theme.value = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  system.addEventListener('change', (event) => {
    if (!saved()) show(event.matches ? 'dark' : 'light');
  });
}

export function setTheme(next) {
  show(next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch (e) {
    /* ignore */
  }
}
