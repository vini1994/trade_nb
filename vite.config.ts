import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';
import autoprefixer from 'autoprefixer';

export default defineConfig(({ mode }) => ({
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
        target: mode === 'production' 
          ? 'https://trade-api-production.up.railway.app'
          : 'http://localhost:3000',
        changeOrigin: true,
        secure: mode === 'production',
        //rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})); 