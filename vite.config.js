import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Markdown from 'unplugin-vue-markdown/vite';

const repo = process.env.GITHUB_REPOSITORY?.split('/')[1];

export default defineConfig({
  base: '/webpage/',
  plugins: [
    vue({
      include: [/\.vue$/, /\.md$/]
    }),
    Markdown({
      markdownItOptions: {
        html: true,
        linkify: true,
        typographer: true
      },
      frontmatter: true,
      excerpt: true
    })
  ],
  server: {
    port: 5173,
    open: true
  }
});
