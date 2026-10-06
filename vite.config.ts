import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const DEFAULT_SITE_URL = 'https://smexstore.com';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const siteUrl = (env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');

  return {
    plugins: [
      react(),
      {
        // Replaces __SITE_URL__ in index.html so canonical and social URLs follow the configured origin.
        name: 'smexstore-site-url',
        transformIndexHtml: (html: string) => html.replace(/__SITE_URL__/g, siteUrl),
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 3000,
      open: false,
    },
    esbuild: {
      // Strip debug behavior from production bundles.
      drop: mode === 'production' ? ['console', 'debugger'] : [],
    },
    build: {
      sourcemap: false,
      target: 'es2020',
      chunkSizeWarningLimit: 300,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (!id.includes('node_modules')) return undefined;
            if (/react-router|@remix-run/.test(id)) return 'router';
            if (/node_modules\/(react|react-dom|scheduler)\//.test(id)) return 'react-vendor';
            return undefined;
          },
        },
      },
    },
  };
});
