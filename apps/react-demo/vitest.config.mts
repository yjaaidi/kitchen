import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config.mjs';

export default defineConfig({
  ...viteConfig,
  test: {
    watch: false,
    include: ['src/**/*.spec.ts', 'src/**/*.spec.tsx'],
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
  },
});
