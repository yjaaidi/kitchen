import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import viteConfig from './vite.config.mjs';

const browserTests = ['./**/*.browser.spec.ts', './**/*.browser.spec.tsx'];
const emulatedTests = [
  './**/!(*.browser).spec.ts',
  './**/!(*.browser).spec.tsx',
];
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
            headless: true,
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
          environment: 'jsdom',
          setupFiles: [
            '@testing-library/jest-dom/vitest',
            './test-setup-tlr-cleanup.ts',
          ],
        },
      },
    ],
  },
});
