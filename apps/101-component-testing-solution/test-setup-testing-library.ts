import { cleanup } from '@testing-library/react';
import { afterEach, beforeEach } from 'vitest';

registerReactTestingLibraryCleanup();

/**
 * If in headed mode, clean up React Testing Library before each test,
 * so that the exercised code/components stays interactive after the test
 */
async function registerReactTestingLibraryCleanup() {
  const module = await maybeImportVitestBrowser();
  const isHeaded = module?.server.config.browser.headless ?? false;

  const hook = isHeaded ? afterEach : beforeEach;
  hook(cleanup);

  async function maybeImportVitestBrowser() {
    try {
      return await import('vitest/browser');
    } catch {
      return null;
    }
  }
}
