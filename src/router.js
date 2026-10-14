import HomeView from './views/HomeView.vue';
import { morphing } from './composables/useMorph.js';
import { loadPostBody } from './data/posts.js';
import { loadPhotoBody } from './data/photography.js';

// Every other view loads on demand. HomeView stays eager: it is the entry route,
// so splitting it would only add a round trip before the first paint.
const ProjectsView = () => import('./views/ProjectsView.vue');
const BlogIndexView = () => import('./views/BlogIndexView.vue');
const BlogPostView = () => import('./views/BlogPostView.vue');
const ShelfView = () => import('./views/ShelfView.vue');
const PhotographyIndexView = () => import('./views/PhotographyIndexView.vue');
const PhotographyPostView = () => import('./views/PhotographyPostView.vue');
const NotFoundView = () => import('./views/NotFoundView.vue');

export const routes = [
  { path: '/', name: 'home', component: HomeView },
  { path: '/projects', name: 'projects', component: ProjectsView },
  { path: '/blog', name: 'blog', component: BlogIndexView },
  // An entry's page waits for its text (meta.load, see loadEntry below).
  { path: '/blog/:slug', name: 'blog-post', component: BlogPostView, props: true, meta: { load: loadPostBody } },
  { path: '/shelf', name: 'shelf', component: ShelfView },
  { path: '/photography', name: 'photography', component: PhotographyIndexView },
  { path: '/photography/:slug', name: 'photography-post', component: PhotographyPostView, props: true, meta: { load: loadPhotoBody } },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView
  }
];

// Before any navigation lands - including from one entry to the next, which
// stays on the same route - fetch the entry's text, so the page never shows
// without it. A failed fetch doesn't block the way: the page tries again.
// Resolves to nothing either way - a guard that returns an object redirects.
export function loadEntry(to) {
  if (to.meta.load) return to.meta.load(to.params.slug).then(() => {}, () => {});
}

export function scrollBehavior(to, from) {
  // Same page, only the query or #hash changed - stay put (in-page links scroll
  // themselves).
  if (to.path === from.path) return false;
  // A morph puts the new page at the top itself, inside the transition.
  if (morphing.value) return false;
  return { top: 0, left: 0, behavior: 'smooth' };
}
