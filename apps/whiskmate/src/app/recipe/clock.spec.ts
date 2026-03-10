describe('clock', () => {
  beforeEach(() => jest.useFakeTimers());

  afterEach(() => jest.useRealTimers());

  it('works', async () => {
    const now = Date.now();

    await jest.advanceTimersByTimeAsync(1_000);

    expect(Date.now() - now).toBe(1_000);
  });
});
