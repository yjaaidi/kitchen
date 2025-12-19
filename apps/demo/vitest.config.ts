import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config';

export default defineConfig({
  ...viteConfig,
  test: {
    name: 'whiskmate',
    watch: false,
    environment: 'jsdom',
    include: ['{src,tests}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    reporters: ['default'],
    coverage: {
      reportsDirectory: './test-output/vitest/coverage',
      provider: 'v8' as const,
    },
    browser: {
      enabled: true,
      provider: playwright({
        actionTimeout: 1_000,
      }),
      instances: [
        {
          browser: 'chromium',
        },
      ],
      viewport: {
        width: 1280,
        height: 720,
      },
    },
  },
});
