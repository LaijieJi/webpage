# webpage

My personal site.

## Stack

- **Vue 3** - UI, using the Composition API and SFCs.
- **Vite** - dev server and build tool. Fast HMR, no webpack pain.
- **Vue Router** - client-side routing (history mode) for the me page, Projects, the Journal, Photographs, and their post pages.
- **vite-ssg** - every route is prerendered to static HTML at build time.
- **unplugin-vue-markdown** - blog posts live as `.md` files in `src/posts/` with front matter, compiled to Vue components at build time.
- **Plain CSS** - no Tailwind, no framework. CSS variables drive two palettes (`data-palette`) and a light/dark theme (`data-theme`) on `<html>`. The theme follows the system until the footer switch is used; both choices persist in `localStorage`.

## Run

```bash
npm install
npm run dev      # local dev
npm run build    # production build to dist/
npm run preview  # preview the build
```

The light on the landing page's desk follows the real sun and moon over Valencia. In dev, preview another moment with `?t=19:30` (another time today) or `?at=2026-10-26T21:00Z` (any date, e.g. a full moon).
