import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import viteConfig from './vite.config.mjs';

export default defineConfig({
  ...viteConfig,
  test: {
    watch: false,
    include: ['src/**/*.spec.ts', 'src/**/*.spec.tsx'],
    browser: {
      enabled: true,
      provider: playwright(),
      instances: [{ browser: 'chromium' }],
    },
  },
});
