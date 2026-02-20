import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(() => {
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(process.env.API_KEY || ''),
        'process.env.GOOGLE_CLOUD_PROJECT': JSON.stringify(process.env.GOOGLE_CLOUD_PROJECT || ''),
        'process.env.GOOGLE_CLOUD_LOCATION': JSON.stringify(process.env.GOOGLE_CLOUD_LOCATION || 'us-central1'),
      },
      server: {
        proxy: {
          //Target your Node.js backend
          '/api-proxy': 'http://localhost:5000',
          
        },
      },
      plugins: react(),
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
