import { createRouter, createWebHistory } from 'vue-router';
import HomeView from './views/HomeView.vue';
import ProjectsView from './views/ProjectsView.vue';
import BlogIndexView from './views/BlogIndexView.vue';
import BlogPostView from './views/BlogPostView.vue';

const routes = [
  { path: '/', name: 'home', component: HomeView, meta: { title: 'Inicio' } },
  { path: '/projects', name: 'projects', component: ProjectsView, meta: { title: 'Proyectos' } },
  { path: '/blog', name: 'blog', component: BlogIndexView, meta: { title: 'Blog' } },
  { path: '/blog/:slug', name: 'blog-post', component: BlogPostView, props: true, meta: { title: 'Entrada de blog' } },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: {
      name: 'NotFoundFallback',
      template: `
        <section class="view-section">
          <div class="wrap">
            <h1 class="view-heading">Página no encontrada</h1>
            <p>Lo sentimos, no encontramos la ruta solicitada.</p>
            <router-link class="button" to="/">Volver a inicio</router-link>
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
