import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all requests starting with /oceanview-backend
      '/oceanview-backend': {
        target: 'http://localhost:8080', //backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
