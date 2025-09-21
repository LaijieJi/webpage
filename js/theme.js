const STORAGE_KEY = 'lj-theme';
const DARK = 'dark';
const LIGHT = 'light';

function getSystemTheme() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? DARK : LIGHT;
}

function persistTheme(theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch (error) {
    console.warn('No se pudo guardar la preferencia de tema.', error);
  }
}

function readStoredTheme() {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch (error) {
    return null;
  }
}

function updateStatus(statusEl, theme) {
  if (!statusEl) return;
  statusEl.textContent = `Tema configurado en ${theme === DARK ? 'oscuro' : 'claro'}.`;
}

export function applyTheme(theme, { announce = false } = {}) {
  const root = document.documentElement;
  const toggle = document.querySelector('[data-theme-toggle]');
  const status = document.querySelector('[data-theme-status]');

  const nextTheme = theme === DARK ? DARK : LIGHT;
  root.dataset.theme = nextTheme;

  if (toggle) {
    toggle.setAttribute('aria-pressed', nextTheme === DARK ? 'true' : 'false');
  }

  if (announce) {
    updateStatus(status, nextTheme);
  }
}

export function initThemeToggle() {
  const toggle = document.querySelector('[data-theme-toggle]');
  if (!toggle) return;

  const status = document.querySelector('[data-theme-status]');
  const stored = readStoredTheme();
  const initial = stored || document.documentElement.dataset.theme || getSystemTheme();
  applyTheme(initial);

  const handleClick = () => {
    const current = document.documentElement.dataset.theme === DARK ? DARK : LIGHT;
    const next = current === DARK ? LIGHT : DARK;
    applyTheme(next, { announce: true });
    persistTheme(next);
  };

  toggle.addEventListener('click', handleClick);

  if (window.matchMedia) {
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event) => {
      const storedPreference = readStoredTheme();
      if (storedPreference) return;
      const systemTheme = event.matches ? DARK : LIGHT;
      applyTheme(systemTheme, { announce: true });
    };
    if (typeof query.addEventListener === 'function') {
      query.addEventListener('change', listener);
    } else if (typeof query.addListener === 'function') {
      query.addListener(listener);
    }
  }

  // Ensure status text is set once on load for screen readers.
  if (!status?.textContent) {
    updateStatus(status, initial);
  }
}
