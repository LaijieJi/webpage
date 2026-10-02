// v-reveal: settle in once scrolled into view; things that arrive together are
// staggered in reading order. Client-only, and does nothing under reduced
// motion, so the prerendered page and reduced-motion visitors see everything
// at rest.

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const ssr = { getSSRProps: () => ({}) };

const MAX_STAGGER = 6;
let revealObserver = null;

function onReveal(entries) {
  const arriving = entries
    .filter((entry) => entry.isIntersecting)
    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top
      || a.boundingClientRect.left - b.boundingClientRect.left);
  arriving.forEach((entry, i) => {
    const el = entry.target;
    el.style.setProperty('--i', Math.min(i, MAX_STAGGER));
    el.classList.add('reveal--in');
    revealObserver.unobserve(el);
  });
}

const reveal = {
  ...ssr,
  mounted(el) {
    if (prefersReducedMotion() || typeof IntersectionObserver === 'undefined') return;
    revealObserver ||= new IntersectionObserver(onReveal, {
      threshold: 0.12,
      rootMargin: '0px 0px -8% 0px'
    });
    el.classList.add('reveal');
    revealObserver.observe(el);
  },
  unmounted(el) {
    revealObserver?.unobserve(el);
  }
};

export function installMotion(app) {
  app.directive('reveal', reveal);
}
