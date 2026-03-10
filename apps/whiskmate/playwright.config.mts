import {
  defineConfig,
  devices,
  withTestronautAngular,
} from '@testronaut/angular';
import { nxE2EPreset } from '@nx/playwright/preset';

const __filename = import.meta.filename;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig(
  nxE2EPreset(__filename, {}),
  withTestronautAngular({
    configPath: __filename,
    testServer: {
      command: 'nx serve whiskmate --configuration testronaut --port {port}',
    },
  }),
  {
    timeout: process.env['CI'] ? 10_000 : 3_000,
    use: {
      trace: 'on-first-retry',
    },
    projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  },
);
