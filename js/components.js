const PATHS = {
  navbar: new URL('../components/navbar.html', import.meta.url),
  footer: new URL('../components/footer.html', import.meta.url),
  'project-card': new URL('../components/project-card.html', import.meta.url)
};
const cache = new Map();
async function load(name) {
  if (cache.has(name)) return cache.get(name);
  const url = PATHS[name];
  if (!url) return '';
  try {
    const res = await fetch(url, { credentials: 'same-origin' });
    if (!res.ok) throw new Error(res.statusText || res.status);
    const text = (await res.text()).trim();
    cache.set(name, text);
    return text;
  } catch (error) {
    console.error(`No se pudo cargar ${name}`, error);
    return '';
  }
}
export async function initComponents() {
  await Promise.all(Array.from(document.querySelectorAll('[data-component]'), async (slot) => {
    const html = await load(slot.dataset.component);
    if (html) slot.innerHTML = html;
  }));
}
export async function ensureTemplate(name) {
  if (name !== 'project-card') return null;
  const existing = document.getElementById('project-card');
  if (existing) return existing;
  const html = await load(name);
  if (!html) return null;
  const fragment = document.createRange().createContextualFragment(html);
  const template = fragment.querySelector('template');
  if (template) document.body.append(template);
  return template || null;
}
