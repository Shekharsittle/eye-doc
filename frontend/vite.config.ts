import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
      define: {
        'process.env.API_KEY' : JSON.stringify('api-key-this-is-not-used-can-be-ignored!'),
        'process.env.GOOGLE_CLOUD_PROJECT': JSON.stringify(env.GOOGLE_CLOUD_PROJECT || ''),
        'process.env.GOOGLE_CLOUD_LOCATION': JSON.stringify(env.GOOGLE_CLOUD_LOCATION || 'us-central1'),
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
