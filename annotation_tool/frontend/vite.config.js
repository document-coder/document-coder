import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig(({ command }) => ({
  build: {
    outDir: '../.static/frontend',
    assetsDir: '',
    cacheDir: "node_modules/.vite",
    emptyOutDir: false,
    sourcemap: true,
    rollupOptions: {
      input: './src/index.jsx',
      output: {
        entryFileNames: 'main.js',
        assetFileNames: '[name][extname]',
        // Switching to IIFE will break SCSS compilation but allows for some quality-of-life features during React develpment.
        // If you switch to IIFE during development, be sure to switch back to ESM before committing your changes.
        format: 'es' // Ensures compatibility with ESM
        // format: 'iife', name: 'appBundle'  
      }
    },
    minify: false
  },
  commonjsOptions: {
    transformMixedEsModules: true // Ensures CJS/ESM interop
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler' // or "modern"
      }
    }
  },
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src')
    }
  },
  optimizeDeps: { },
  esbuild: {
    target: 'esnext',
    jsx: 'automatic',
  },
}));
