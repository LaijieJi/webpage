# webpage

My personal site.

## Stack

- **Vue 3** - UI, using the Composition API and SFCs.
- **Vite** - dev server and build tool. Fast HMR, no webpack pain.
- **Vue Router** - client-side routing (history mode) for Home, Projects, Blog, and post pages.
- **unplugin-vue-markdown** - blog posts live as `.md` files in `src/posts/` with front matter, compiled to Vue components at build time.
- **Plain CSS** - no Tailwind, no framework. CSS variables drive the light/dark theme, toggled via `data-theme` on `<html>` and persisted in `localStorage`.

## Run

```bash
npm install
npm run dev      # local dev
npm run build    # production build to dist/
npm run preview  # preview the build
```
