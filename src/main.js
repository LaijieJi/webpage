import { ViteSSG } from 'vite-ssg';
import { routes, scrollBehavior } from './router.js';
import App from './App.vue';
import './styles/main.css';
import { installMotion } from './directives/motion.js';

export const createApp = ViteSSG(App, { routes, scrollBehavior }, ({ app }) => {
  installMotion(app);
});
