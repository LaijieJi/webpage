// The 3D shelf takes its colours from the site's own custom properties rather
// than hardcoding them, so it follows PaletteToggle without knowing it exists.
const KEYS = ['--mat', '--paper', '--surface', '--shade', '--ink', '--faint', '--accent', '--accent2', '--garage'];

export function readPalette() {
  const cs = getComputedStyle(document.documentElement);
  const out = {};
  for (const key of KEYS) out[key.slice(2)] = cs.getPropertyValue(key).trim();
  return out;
}

// PaletteToggle.vue writes document.documentElement.dataset.palette and emits no
// event, so watch the attribute instead of reaching into that component.
export function onPaletteChange(cb) {
  const observer = new MutationObserver(() => cb(readPalette()));
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-palette']
  });
  return () => observer.disconnect();
}
