import { playwright } from '@vitest/browser-playwright';
import { mergeConfig } from 'vite';
import { defineConfig } from 'vitest/config';
import viteConfigFn from './vite.config.mjs';

const testsPatterns = ['**/*.spec.ts'];
const browserTestsPatterns = ['**/*.browser.spec.ts'];
export default defineConfig((...args) => {
  return mergeConfig(
    viteConfigFn(...args),
    defineConfig({
      test: {
        name: 'whiskmate',
        watch: false,
        setupFiles: ['src/test-setup.ts'],
        reporters: ['default'],
        coverage: {
          reportsDirectory: '../../coverage/apps/whiskmate',
          provider: 'v8' as const,
        },
        pool: 'threads',
        isolate: false,
        testTimeout: process.env['CI'] ? 3_000 : 1_000,
        projects: [
          {
            extends: true,
            test: {
              name: 'emulated',
              environment: 'jsdom',
              include: testsPatterns,
              exclude: browserTestsPatterns,
            },
          },
          {
            extends: true,
            test: {
              name: 'browser',
              include: browserTestsPatterns,
              browser: {
                enabled: true,
                provider: playwright(),
                instances: [{ browser: 'chromium' }],
              },
            },
          },
        ],
      },
    }),
  );
});
