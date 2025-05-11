// vite.config.js
import { defineConfig } from 'vite';
import { crx } from '@crxjs/vite-plugin';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import manifestData from './src/manifest.json';

// ESM-compatible __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  // publicDir: 'public', // Removed explicit public directory setting
  build: {
    outDir: 'dist',
    manifest: false, // Disable Vite's manifest generation
    rollupOptions: {
      input: {}, 
    },
  },
  plugins: [
    crx({ manifest: manifestData }),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
