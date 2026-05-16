import { reactRouter } from '@react-router/dev/vite';
import { join, sep } from 'node:path';
import { defineConfig } from 'vite';

const projectName = __dirname.split(sep).pop() ?? 'whiskmate';

export default defineConfig({
  root: import.meta.dirname,
  cacheDir: join('../../node_modules/.vite/apps', projectName),
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  plugins: [!process.env.VITEST && reactRouter()],
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
