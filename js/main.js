import { initComponents, ensureTemplate } from './components.js';
import { initThemeToggle } from './theme.js';

const pageId = document.documentElement.dataset.page || 'home';

function setActiveNav() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;
  const links = nav.querySelectorAll('[data-route]');
  const path = window.location.pathname.toLowerCase();
  let route = 'home';
  if (path.includes('/projects')) {
    route = 'projects';
  } else if (path.includes('/blog')) {
    route = 'blog';
  }

  links.forEach((link) => {
    const isActive = link.dataset.route === route;
    link.classList.toggle('is-active', isActive);
    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
}

function initNavToggle() {
  const nav = document.querySelector('.site-nav');
  if (!nav) return;
  const toggle = nav.querySelector('[data-nav-toggle]');
  const menu = nav.querySelector('[data-nav-menu]');
  if (!toggle || !menu) return;

  nav.dataset.open = nav.dataset.open || 'false';
  const closeMenu = () => {
    nav.dataset.open = 'false';
    toggle.setAttribute('aria-expanded', 'false');
  };

  toggle.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    const next = !expanded;
    toggle.setAttribute('aria-expanded', next ? 'true' : 'false');
    nav.dataset.open = next ? 'true' : 'false';
  });

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
    }
  });
}

function updateCurrentYear() {
  const holder = document.querySelector('[data-current-year]');
  if (holder) {
    holder.textContent = new Date().getFullYear();
  }
}

async function renderProjects() {
  const host = document.querySelector('[data-project-list]');
  const dataElement = document.getElementById('projects-data');
  if (!host || !dataElement) return;

  let projects = [];
  try {
    projects = JSON.parse(dataElement.textContent.trim());
  } catch (error) {
    console.error('El formato de proyectos no es válido', error);
    return;
  }

  const template = await ensureTemplate('project-card');
  if (!template) return;

  const fragment = document.createDocumentFragment();
  projects.forEach((project) => {
    const { title, period, description, stack = [], links = [] } = project;
    const node = template.content.cloneNode(true);
    const titleEl = node.querySelector('[data-field="title"]');
    const periodEl = node.querySelector('[data-field="period"]');
    const descEl = node.querySelector('[data-field="description"]');
    const stackEl = node.querySelector('[data-field="stack"]');
    const actionsEl = node.querySelector('[data-field="actions"]');

    if (titleEl) titleEl.textContent = title;
    if (periodEl) periodEl.textContent = period;
    if (descEl) descEl.textContent = description;

    if (stackEl) {
      stackEl.innerHTML = '';
      if (Array.isArray(stack) && stack.length) {
        stackEl.style.display = '';
        stack.forEach((tag) => {
          const li = document.createElement('li');
          li.textContent = tag;
          stackEl.append(li);
        });
      } else {
        stackEl.style.display = 'none';
      }
    }

    if (actionsEl) {
      actionsEl.innerHTML = '';
      if (Array.isArray(links) && links.length) {
        links.forEach((link) => {
          const anchor = document.createElement('a');
          anchor.href = link.href;
          anchor.target = link.external ? '_blank' : '_self';
          if (link.external) {
            anchor.rel = 'noreferrer noopener';
          }
          anchor.textContent = link.label;
          actionsEl.append(anchor);
        });
        actionsEl.style.display = '';
      } else {
        actionsEl.style.display = 'none';
      }
    }

    fragment.append(node);
  });

  host.innerHTML = '';
  host.append(fragment);
}

function renderBlogList() {
  const host = document.querySelector('[data-blog-list]');
  const dataElement = document.getElementById('posts-data');
  if (!host || !dataElement) return;

  let posts = [];
  try {
    posts = JSON.parse(dataElement.textContent.trim());
  } catch (error) {
    console.error('El formato de posts no es válido', error);
    return;
  }

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const formatter = new Intl.DateTimeFormat('es-ES', { dateStyle: 'medium' });
  const fragment = document.createDocumentFragment();

  posts.forEach((post) => {
    const article = document.createElement('article');
    article.className = 'post-card';

    const title = document.createElement('h2');
    title.className = 'post-card__title';

    const link = document.createElement('a');
    link.href = post.href;
    link.textContent = post.title;
    link.className = 'post-card__link';
    title.append(link);

    const meta = document.createElement('p');
    meta.className = 'post-card__meta';
    const time = document.createElement('time');
    time.dateTime = post.date;
    time.textContent = formatter.format(new Date(post.date));
    meta.append(time);

    const excerpt = document.createElement('p');
    excerpt.className = 'post-card__excerpt';
    excerpt.textContent = post.excerpt;

    article.append(title, meta, excerpt);

    if (Array.isArray(post.tags) && post.tags.length) {
      const tags = document.createElement('ul');
      tags.className = 'card-tags';
      post.tags.forEach((tag) => {
        const li = document.createElement('li');
        li.textContent = tag;
        tags.append(li);
      });
      article.append(tags);
    }

    fragment.append(article);
  });

  host.innerHTML = '';
  host.append(fragment);
}

function initPageFeatures() {
  if (pageId === 'projects') {
    renderProjects().catch((error) => console.error('No se pudieron renderizar los proyectos.', error));
  }

  if (pageId === 'blog') {
    renderBlogList();
  }
}

async function bootstrap() {
  await initComponents();
  initThemeToggle();
  initNavToggle();
  setActiveNav();
  updateCurrentYear();
  initPageFeatures();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
