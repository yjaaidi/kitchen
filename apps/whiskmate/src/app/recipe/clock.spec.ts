import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
describe('clock', () => {
  beforeEach(() => vi.useFakeTimers());

  afterEach(() => vi.useRealTimers());

  it('works', async () => {
    const now = Date.now();

    await vi.advanceTimersByTimeAsync(1_000);

    expect(Date.now() - now).toBe(1_000);
  });
});
