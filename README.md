# Laijie Ji — Personal Site (Vue 3 + Vite)

## 1. Project Overview
Single-page application built with Vue 3, Vite, and Vue Router. It includes four routes (Home, Projects, Blog index, Blog post), a reusable component system, and a light/dark theme toggle that respects system preferences and persists selections. Styling relies on plain CSS variables for a lightweight bundle, and blog posts are authored in Markdown (compiled at build time via `unplugin-vue-markdown`).

## 2. Prerequisites
- Node.js ≥ 18
- npm (comes with Node.js) or pnpm/yarn if preferred

## 3. Getting Started
```bash
# clone
git clone https://github.com/LaijieJi/webpage.git
cd <repo-directory>

# install dependencies
npm install

# start local dev server
npm run dev
```
The dev server opens automatically (default: http://localhost:5173) with hot-module replacement.

## 4. Available Scripts
- `npm run dev` — start Vite dev server with hot reload.
- `npm run build` — build production assets into `dist/`.
- `npm run preview` — locally preview the production build.

## 5. Project Structure
```
.
├─ package.json
├─ vite.config.js
├─ index.html                # entry HTML with initial theme guard
├─ src/
│  ├─ main.js               # bootstraps Vue app, global layout
│  ├─ router.js             # vue-router configuration
│  ├─ assets/icons/         # inline SVG icons used across components
│  ├─ styles/main.css       # global variables, base styles, theming
│  ├─ data/                 # data helpers (projects.json, posts.js loader)
│  ├─ components/           # reusable UI pieces (header, footer, cards, toggle)
│  ├─ posts/                # blog posts written in Markdown + front matter
│  └─ views/                # route components (Home, Projects, Blog, Post detail)
```
Posts are authored in Markdown and aggregated via `src/data/posts.js` for the blog routes.

## 6. Configuration Notes
- Router uses `createWebHistory`. Deploying to static hosts (e.g., GitHub Pages) requires an SPA fallback (`404.html`) or switching to hash mode. Update `router.js` if necessary.
- For deployments under a sub-path (e.g., GitHub Pages repo site), set `base` in `vite.config.js` (e.g., `base: '/my-site/'`).

## 7. Content Management
### Projects (`src/data/projects.json`)
Each entry follows:
```json
{
  "title": "Project name",
  "tech": ["Stack"],
  "dates": "Timeline",
  "summary": "Short description",
  "links": [{ "label": "Repo", "href": "https://..." }]
}
```
Add, remove, or edit objects and they will render automatically.

### Blog posts (`src/posts/*.md` + `src/data/posts.js`)
- Create one Markdown file per post inside `src/posts/`. The filename becomes the slug (e.g., `first-reflections.md`).
- Start each file with a front matter block, then write Markdown content. Example:
  ```md
  ---
  title: First Reflections
  date: 2025-09-01
  tags: [reflections]
  excerpt: Some early thoughts on learning and building.
  ---

  ## Why I write
  Short reflective piece here...
  ```
- Supported front matter keys: `title`, `date`, `tags` (comma-separated list inside `[]`), and `excerpt`.
- `src/data/posts.js` aggregates the compiled modules produced by `unplugin-vue-markdown`, exposing each post's Vue component and front matter for the blog index/detail views.
- To add a new post, drop a `.md` file in `src/posts/`; no other wiring is required.

> Markdown is processed by Markdown-It via `unplugin-vue-markdown`; you can tweak rendering hooks in `vite.config.js` if you need custom syntax.

## 8. Theming
- Theme toggle sets `<html data-theme="light|dark">`. Default is the stored preference (`localStorage.lj-theme`) or system `prefers-color-scheme`.
- Modify color variables in `src/styles/main.css` under `:root` and `html[data-theme='dark']` to customize palettes.
- Toggle includes an aria-live announcement and persists choices across reloads.

## 9. Accessibility Notes
- Skip link allows keyboard users to jump to main content.
- Focus styles (`:focus-visible`) are visible across interactive controls.
- Navigation highlights the active route via `aria-current="page"`.
- Theme toggle exposes `aria-pressed` and status announcements.

## 10. Deployment Tips
- **Netlify / Vercel**: deploy with default settings; both support SPA fallbacks out-of-the-box.
- **GitHub Pages**:
  1. If deploying under `<user>.github.io/<repo>`, set `base` in `vite.config.js` to `'/<repo>/'`.
  2. Run `npm run build`.
  3. Publish the contents of `dist/` (e.g., using `gh-pages` branch) and add a `404.html` copy of `index.html` for history mode routing.

## 11. License
MIT License.

## 12. Credits
- Icons are handcrafted SVGs stored locally under `src/assets/icons/`.
- Built with Vue 3, Vite, Vue Router, and `unplugin-vue-markdown` for Markdown-driven posts.
