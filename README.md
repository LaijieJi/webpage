# Laijie Ji — Personal Site (Vue 3 + Vite)

## 1. Project Overview
Single-page application built with Vue 3, Vite, and Vue Router. It includes four routes (Home, Projects, Blog index, Blog post), a reusable component system, and a light/dark theme toggle that respects system preferences and persists selections. Styling relies on plain CSS variables for a lightweight bundle.

## 2. Prerequisites
- Node.js ≥ 18
- npm (comes with Node.js) or pnpm/yarn if preferred

## 3. Getting Started
```bash
# clone
git clone <repo-url>
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
│  ├─ data/                 # JSON data sources (projects, blog posts)
│  ├─ components/           # reusable UI pieces (header, footer, cards, toggle)
│  └─ views/                # route components (Home, Projects, Blog, Post detail)
```
Components consume JSON via standard imports, so updating content does not require code changes.

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

### Blog posts (`src/data/posts.json`)
Schema:
```json
{
  "slug": "unique-slug",
  "title": "Post title",
  "date": "YYYY-MM-DD",
  "tags": ["tag"],
  "excerpt": "Short teaser",
  "html": "<h2>...</h2><p>...</p>"
}
```
Posts render with `v-html`, so keep content trusted. If exposing to user-generated content, sanitize on write.

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
- Built with Vue 3, Vite, and Vue Router.
