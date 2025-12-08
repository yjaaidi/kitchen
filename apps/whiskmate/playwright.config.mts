import {
  defineConfig,
  devices,
  withTestronautAngular,
} from '@testronaut/angular';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig(
  withTestronautAngular({
    configPath: __filename,
    testServer: {
      command:
        'pnpm exec nx serve whiskmate --configuration testronaut --port {port}',
    },
  }),
  {
    timeout: process.env['CI'] ? 10_000 : 3_000,
    use: {
      trace: 'on-first-retry',
    },
  },
  {
    /* Configure projects for major browsers */
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  },
);
