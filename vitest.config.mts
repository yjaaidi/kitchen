import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config.mjs';

export default defineConfig({
  ...viteConfig,
  test: {
    watch: false,
    globals: true,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './coverage/whiskmate',
      provider: 'v8' as const,
    },
  },
});
