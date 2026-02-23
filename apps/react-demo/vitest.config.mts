import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import viteConfig from './vite.config.mjs';

const browserTests = ['src/**/*.browser.spec.ts', 'src/**/*.browser.spec.tsx'];
const emulatedTests = ['src/**/*.spec.ts', 'src/**/*.spec.tsx'];
export default defineConfig({
  ...viteConfig,
  test: {
    watch: false,
    testTimeout: 1_000,
    projects: [
      {
        extends: true,
        test: {
          name: 'browser',
          include: browserTests,
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'emulated',
          include: emulatedTests,
          exclude: browserTests,
          environment: 'jsdom',
          setupFiles: ['src/test-setup-tlr-cleanup.ts'],
        },
      },
    ],
  },
});
