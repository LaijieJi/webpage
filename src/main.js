import { ViteSSG } from 'vite-ssg';
import { routes, scrollBehavior } from './router.js';
import App from './App.vue';
import './styles/main.css';

// v-reveal: fade/rise an element in once it scrolls into view.
const revealDirective = {
  // No server-rendered attributes; the effect is purely client-side.
  getSSRProps: () => ({}),
  mounted(el) {
    const prefersReducedMotion =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion || typeof IntersectionObserver === 'undefined') {
      return; // leave the element in its natural, fully-visible state
    }
    el.classList.add('reveal');
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal--in');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    el._revealObserver = io;
  },
  unmounted(el) {
    if (el._revealObserver) el._revealObserver.disconnect();
  }
};

export const createApp = ViteSSG(App, { routes, scrollBehavior }, ({ app }) => {
  app.directive('reveal', revealDirective);
});
