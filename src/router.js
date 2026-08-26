import HomeView from './views/HomeView.vue';
import ProjectsView from './views/ProjectsView.vue';
import BlogIndexView from './views/BlogIndexView.vue';
import BlogPostView from './views/BlogPostView.vue';
import PhotographyIndexView from './views/PhotographyIndexView.vue';
import PhotographyPostView from './views/PhotographyPostView.vue';
import NotFoundView from './views/NotFoundView.vue';

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
  // Same page, only the query changed (e.g. journal pagination) — stay put.
  if (to.path === from.path) return false;
  return { top: 0, left: 0, behavior: 'smooth' };
}
