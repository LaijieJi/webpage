import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import ProjectsView from './views/ProjectsView.vue';
import BlogIndexView from './views/BlogIndexView.vue';
import BlogPostView from './views/BlogPostView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: 'Home' } },
  { path: '/projects', name: 'projects', component: ProjectsView, meta: { title: 'Projects' } },
  { path: '/blog', name: 'blog', component: BlogIndexView, meta: { title: 'Blog' } },
  { path: '/blog/:slug', name: 'blog-post', component: BlogPostView, props: true, meta: { title: 'Blog Entry' } },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: {
      name: 'NotFoundFallback',
      template: `
        <section class="view-section">
          <div class="wrap">
            <h1 class="view-heading">Page not found</h1>
            <p>I am sorry, I could not find the requested route</p>
            <router-link class="button" to="/">Return to init</router-link>
          </div>
        </section>
      `
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0, left: 0, behavior: 'smooth' };
  }
});

router.afterEach((to) => {
  if (to?.meta?.title) {
    document.title = `Laijie Ji — ${to.meta.title}`;
  } else {
    document.title = 'Laijie Ji — Computer Science student & software developer';
  }
});

export default router;
