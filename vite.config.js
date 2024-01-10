import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src', // Adjust the path accordingly
    },
  },
  base: '/Neckbook/', // This corresponds to publicPath in Vue CLI
})
