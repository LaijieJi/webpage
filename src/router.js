import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import ProjectsView from './views/ProjectsView.vue';
import BlogIndexView from './views/BlogIndexView.vue';
import BlogPostView from './views/BlogPostView.vue';
import PhotographyIndexView from './views/PhotographyIndexView.vue';
import PhotographyPostView from './views/PhotographyPostView.vue';
import CarMaintenanceView from './views/CarMaintenanceView.vue';
import NotFoundView from './views/NotFoundView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: 'Home' } },
  { path: '/projects', name: 'projects', component: ProjectsView, meta: { title: 'Projects' } },
  { path: '/blog', name: 'blog', component: BlogIndexView, meta: { title: 'Blog' } },
  { path: '/blog/:slug', name: 'blog-post', component: BlogPostView, props: true, meta: { title: 'Blog Entry' } },
  { path: '/photography', name: 'photography', component: PhotographyIndexView, meta: { title: 'Photography' } },
  { path: '/photography/:slug', name: 'photography-post', component: PhotographyPostView, props: true, meta: { title: 'Photography' } },
  { path: '/car-maintenance', name: 'car-maintenance', component: CarMaintenanceView, meta: { title: 'Car Maintenance' } },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFoundView,
    meta: { title: 'Page not found' }
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0, behavior: 'smooth' };
  }
});

router.afterEach((to) => {
  if (to?.meta?.title) {
    document.title = `Laijie Ji — ${to.meta.title}`;
  } else {
    document.title = 'Laijie Ji — Full-Stack Developer';
  }
});

export default router;
