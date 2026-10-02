// Scroll- and pointer-driven motion for the whole site.
//
//   v-reveal              settle in once scrolled into view; things that arrive
//                         together are staggered in reading order
//   v-parallax="0.08"     drift against the scroll (positive recedes, negative
//                         comes forward); writes the `translate` property
//   v-tilt="6"            lean toward the pointer, up to N degrees; writes
//                         --tilt-x / --tilt-y for the element's own transform
//   v-scroll-progress     writes --progress (0 -> 1) as the element is read
//
// Every directive is client-only and does nothing under reduced motion, so the
// prerendered page and reduced-motion visitors see everything at rest.

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const finePointer = () =>
  window.matchMedia && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const ssr = { getSSRProps: () => ({}) };

/* ---- v-reveal ------------------------------------------------------------ */
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

/* ---- One scroll loop for everything that tracks the scroll ---------------- */
const tracked = new Map(); // el -> update(el)
let frame = 0;

function runFrame() {
  frame = 0;
  tracked.forEach((update, el) => update(el));
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(runFrame);
}

function track(el, update) {
  if (!tracked.size) {
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
  }
  tracked.set(el, update);
  schedule();
}

function untrack(el) {
  tracked.delete(el);
  if (!tracked.size) {
    window.removeEventListener('scroll', schedule);
    window.removeEventListener('resize', schedule);
  }
}

/* ---- v-parallax ---------------------------------------------------------- */
const MAX_DRIFT = 40;

function updateParallax(el) {
  const rect = el.getBoundingClientRect();
  const applied = el._parallaxY || 0;
  // Measure where the element would be without the drift already applied.
  const centre = rect.top - applied + rect.height / 2;
  if (centre < -rect.height || centre > window.innerHeight + rect.height) return;
  const offset = centre - window.innerHeight / 2;
  const y = clamp(-offset * el._parallaxFactor, -MAX_DRIFT, MAX_DRIFT);
  el._parallaxY = y;
  el.style.translate = `0 ${y.toFixed(1)}px`;
}

const parallax = {
  ...ssr,
  mounted(el, { value }) {
    if (prefersReducedMotion()) return;
    el._parallaxFactor = Number(value) || 0.08;
    track(el, updateParallax);
  },
  updated(el, { value }) {
    if (el._parallaxFactor !== undefined) el._parallaxFactor = Number(value) || 0.08;
  },
  unmounted: untrack
};

/* ---- v-scroll-progress --------------------------------------------------- */
// 0 when the element's top reaches 70% down the viewport, 1 when its bottom does.
function updateProgress(el) {
  const rect = el.getBoundingClientRect();
  const line = window.innerHeight * 0.7;
  const progress = clamp((line - rect.top) / Math.max(rect.height, 1), 0, 1);
  el.style.setProperty('--progress', progress.toFixed(4));
}

const scrollProgress = {
  ...ssr,
  mounted(el) {
    if (prefersReducedMotion()) return;
    track(el, updateProgress);
  },
  unmounted: untrack
};

/* ---- v-tilt -------------------------------------------------------------- */
const tilt = {
  ...ssr,
  mounted(el, { value }) {
    if (prefersReducedMotion() || !finePointer()) return;
    const max = Number(value) || 6;
    const move = (event) => {
      const rect = el.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      el.style.setProperty('--tilt-x', `${(-y * 2 * max).toFixed(2)}deg`);
      el.style.setProperty('--tilt-y', `${(x * 2 * max).toFixed(2)}deg`);
    };
    const enter = () => el.classList.add('is-tilting');
    const leave = () => {
      el.classList.remove('is-tilting');
      el.style.setProperty('--tilt-x', '0deg');
      el.style.setProperty('--tilt-y', '0deg');
    };
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    el._tiltOff = () => {
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
    };
  },
  unmounted(el) {
    el._tiltOff?.();
  }
};

export function installMotion(app) {
  app.directive('reveal', reveal);
  app.directive('parallax', parallax);
  app.directive('tilt', tilt);
  app.directive('scroll-progress', scrollProgress);
}
