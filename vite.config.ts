import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [
        autoprefixer,
      ],
    },
  },
  root: path.join(__dirname, 'src/frontend'),
  build: {
    outDir: path.join(__dirname, 'dist'),
    emptyOutDir: true
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://trade-api-production.up.railway.app',
        changeOrigin: true,
        secure: true,
        //rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}); 