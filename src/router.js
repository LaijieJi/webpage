import HomeView from './views/HomeView.vue';

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

// App.vue calls this from its page transition's after-leave: the old view has
// finished fading and is gone.
let onPageLeft = [];
export function pageHasLeft() {
  onPageLeft.forEach((resolve) => resolve());
  onPageLeft = [];
}
function whenPageHasLeft() {
  return new Promise((resolve) => {
    onPageLeft.push(resolve);
    setTimeout(resolve, 1000); // never hold the scroll hostage
  });
}

export function scrollBehavior(to, from) {
  // Same page, only the query changed (e.g. journal pagination) - stay put.
  if (to.path === from.path) return false;
  // Leaving the shelf by leaning into a book: the old view is zoomed in on a
  // page, so it must not scroll away while it fades. Jump once it is gone.
  if (typeof window !== 'undefined' && window.history.state?.leanIn) {
    return whenPageHasLeft().then(() => ({ top: 0, left: 0 }));
  }
  return { top: 0, left: 0, behavior: 'smooth' };
}
