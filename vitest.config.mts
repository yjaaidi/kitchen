import { defineConfig } from 'vitest/config';
import viteConfig from './vite.config.mjs';
import { playwright } from '@vitest/browser-playwright';

const testsPattern = 'src/**/*.spec.ts';
const browserTestsPattern = 'src/**/*.browser.spec.ts';
const wideTestsPattern = 'src/**/*.wide.spec.ts';

export default defineConfig({
  ...viteConfig,
  test: {
    watch: false,
    globals: true,
    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
    testTimeout: 1_000,
    projects: [
      {
        extends: true,
        test: {
          name: 'emulated',
          environment: 'jsdom',
          include: [testsPattern],
          exclude: [browserTestsPattern, wideTestsPattern],
        },
      },
      {
        extends: true,
        test: {
          name: 'wide',
          environment: 'jsdom',
          include: [wideTestsPattern],
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: [browserTestsPattern],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
    coverage: {
      reportsDirectory: './coverage/whiskmate',
      provider: 'v8' as const,
    },
  },
});
