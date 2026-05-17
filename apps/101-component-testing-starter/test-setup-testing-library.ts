import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

const g = globalThis as unknown as { jest: typeof vi };

/* Prevents freeze when using RTL's user-event with fake timers.
 * See https://github.com/testing-library/react-testing-library/blob/be9d81d91314c9f0bafaa363f70b409b4b31989c/src/pure.js#L16
 * Note that you do not need this when using Vitest's `userEvent` or `page` API. */
g.jest = vi;

afterEach(() => {
  cleanup();
});
