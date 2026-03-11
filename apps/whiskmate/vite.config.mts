/// <reference types="vitest/config" />

import { playwright } from '@vitest/browser-playwright';
import { defineConfig } from 'vite';
import angular from '@analogjs/vite-plugin-angular';
import { nxViteTsPaths } from '@nx/vite/plugins/nx-tsconfig-paths.plugin';

const emulatedTestsPattern = 'src/**/!(*.browser).spec.ts';
const browserTestsPattern = 'src/**/*.browser.spec.ts';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [angular(), nxViteTsPaths()],

  test: {
    globals: true,
    watch: false,
    testTimeout: 1_500,
    expect: {
      poll: {
        interval: 10,
      },
    },

    projects: [
      {
        extends: true,
        test: {
          name: 'emulated',
          environment: 'jsdom',
          include: [emulatedTestsPattern],
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

    setupFiles: ['src/test-setup.ts'],
    reporters: ['default'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
