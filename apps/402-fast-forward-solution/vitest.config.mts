import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vitest/config';
import type { ProjectConfig } from 'vitest/node';
import viteConfig from './vite.config.mjs';

const browserTests = ['./**/*.browser.spec.ts', './**/*.browser.spec.tsx'];
const emulatedTests = [
  './**/!(*.(browser|wide)).spec.ts',
  './**/!(*.(browser|wide)).spec.tsx',
];
const wideTests = ['./**/*.wide.spec.ts', './**/*.wide.spec.tsx'];

const emulatedSharedConfig: ProjectConfig = {
  environment: 'jsdom',
  setupFiles: ['@testing-library/jest-dom/vitest'],
};

const TIMEOUT = process.env.CI ? 400 : 100;

export default defineConfig({
  ...viteConfig,
  test: {
    watch: false,
    /* We should not need this in browser mode as we are using vitest/browser,
     * but we are keeping it to allow React Testing Library tests to run in browser mode. */
    setupFiles: ['./test-setup-testing-library.ts'],
    testTimeout: TIMEOUT,
    expect: { poll: { interval: 0 } },
    projects: [
      {
        extends: true,
        test: {
          name: 'browser',
          include: browserTests,
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({ actionTimeout: TIMEOUT }),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        extends: true,
        test: {
          name: 'emulated',
          include: emulatedTests,
          ...emulatedSharedConfig,
        },
      },
      {
        extends: true,
        test: {
          name: 'wide',
          include: wideTests,
          retry: 3,
          testTimeout: 1_000,
          ...emulatedSharedConfig,
        },
      },
    ],
  },
});
