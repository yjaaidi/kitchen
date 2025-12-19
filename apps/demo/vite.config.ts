import { defineConfig } from 'vite';

export default defineConfig({
  root: import.meta.dirname,
  server: {
    port: 4200,
    host: 'localhost',
  },
  preview: {
    port: 4300,
    host: 'localhost',
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  esbuild: {
    /* Default target is esnext.
     * We have to downgrade to es2024 to transform native decorators
     * in case we want to give it a try, even though we will be using
     * Typescript decorators instead. */
    target: 'es2024',
  },
});
