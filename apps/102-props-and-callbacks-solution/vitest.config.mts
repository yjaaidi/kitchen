import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import viteConfig from './vite.config.mjs';
import { ProjectConfig } from 'vitest/node';

const browserTests = ['./**/*.browser.spec.ts', './**/*.browser.spec.tsx'];
const emulatedTests = [
  './**/!(*.(browser|wide)).spec.ts',
  './**/!(*.(browser|wide)).spec.tsx',
];
const wideTests = ['./**/*.wide.spec.ts', './**/*.wide.spec.tsx'];

const emulatedSharedConfig: ProjectConfig = {
  environment: 'jsdom',
  setupFiles: [
    '@testing-library/jest-dom/vitest',
    './test-setup-tlr-cleanup.ts',
  ],
};

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
          ...emulatedSharedConfig,
        },
      },
      {
        extends: true,
        test: {
          name: 'wide',
          include: wideTests,
          retry: 3,
          ...emulatedSharedConfig,
        },
      },
    ],
  },
});
