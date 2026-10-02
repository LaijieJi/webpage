import { ref, nextTick } from 'vue';

// Opening something - a catalogue card, a frame on the contact sheet - grows
// that element into the page it opens, using the View Transitions API. The
// target page marks the element to grow into with data-morph="<name>" and the
// same view-transition-name in its CSS.
//
// While a morph runs, App.vue drops its own page transition and the router
// skips its smooth scroll: the browser animates between two snapshots, so the
// new page has to be in place, at the top, in one step.
export const morphing = ref(false);

function canMorph() {
  return typeof document !== 'undefined'
    && typeof document.startViewTransition === 'function'
    && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Let modified clicks (new tab, new window) behave like any other link.
export function isPlainClick(event) {
  return !(event.defaultPrevented || event.button !== 0
    || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey);
}

// The browser stops rendering - and so stops running animation frames - until
// the update callback below resolves, so nothing in it may wait on a frame.
const tick = () => new Promise((resolve) => setTimeout(resolve, 10));

async function rendered(name) {
  for (let i = 0; i < 50; i++) {
    if (document.querySelector(`[data-morph="${name}"]`)) return;
    await tick();
  }
}

// Transition props for App.vue's page transition during a morph: no CSS, and
// the old page is let go on a microtask - not a frame, which would never come.
// (Letting it go synchronously trips Vue's out-in mode mid-patch.)
export const morphTransition = {
  css: false,
  onLeave: (el, done) => queueMicrotask(done)
};

// Fetch the code of the page a link opens. Routes load on demand, and once a
// morph has started the browser shows nothing new until the page is in - so
// the download has to happen before, not during.
export function prefetchRoute(router, to) {
  const loads = router.resolve(to).matched.map((record) => {
    const component = record.components && record.components.default;
    return typeof component === 'function' ? component() : null;
  });
  return Promise.all(loads).catch(() => {});
}

// Index pages call this once they are idle, so the first click is instant.
export function prefetchWhenIdle(router, to) {
  if (typeof window === 'undefined') return;
  const idle = window.requestIdleCallback || ((fn) => window.setTimeout(fn, 1200));
  idle(() => prefetchRoute(router, to));
}

export async function openWithMorph(router, to, el, name) {
  if (!canMorph()) return router.push(to);
  // One at a time: a second click would start a new transition, and the first
  // one finishing would then switch the page fade back on mid-morph.
  if (morphing.value) return;
  morphing.value = true;
  await prefetchRoute(router, to);
  // Names must be unique in a snapshot: anything on this page already wearing
  // the name (the open post's own card, when opening its neighbour) gives it up.
  document.querySelectorAll(`[data-morph="${name}"]`).forEach((holder) => {
    holder.style.viewTransitionName = 'none';
  });
  el.style.viewTransitionName = name;
  const transition = document.startViewTransition(async () => {
    el.style.viewTransitionName = '';
    await router.push(to);
    await nextTick();
    await rendered(name);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  });
  transition.finished.finally(() => {
    morphing.value = false;
  });
  return transition.updateCallbackDone;
}
