import HomeView from './views/HomeView.vue';
import { morphing } from './composables/useMorph.js';

// Every other view loads on demand. HomeView stays eager: it is the entry route,
// so splitting it would only add a round trip before the first paint.
const ProjectsView = () => import('./views/ProjectsView.vue');
const BlogIndexView = () => import('./views/BlogIndexView.vue');
const BlogPostView = () => import('./views/BlogPostView.vue');
const PhotographyIndexView = () => import('./views/PhotographyIndexView.vue');
const PhotographyPostView = () => import('./views/PhotographyPostView.vue');
const NotFoundView = () => import('./views/NotFoundView.vue');

export const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/projects', name: 'projects', component: ProjectsView },
  { path: '/blog', name: 'blog', component: BlogIndexView },
  { path: '/blog/:slug', name: 'blog-post', component: BlogPostView, props: true },
  { path: '/photography', name: 'photography', component: PhotographyIndexView },
  { path: '/photography/:slug', name: 'photography-post', component: PhotographyPostView, props: true },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView
  }
];

export function scrollBehavior(to, from) {
  // Same page, only the query or #hash changed - stay put (in-page links scroll
  // themselves).
  if (to.path === from.path) return false;
  // A morph puts the new page at the top itself, inside the transition.
  if (morphing.value) return false;
  return { top: 0, left: 0, behavior: 'smooth' };
}
