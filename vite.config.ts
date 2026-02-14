import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Importante: Esto soluciona los errores 404 en GitHub Pages
  base: '/Febrero_catorce/', 
  
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  
  plugins: [react()],
  
  resolve: {
    alias: {
      // Esto permite usar @ para referirse a la raíz del proyecto
      '@': path.resolve(__dirname, '.'),
    }
  }
});