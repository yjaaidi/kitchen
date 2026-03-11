import { onTestFinished, vi } from 'vitest';

export function setUpTimeMachine(): TimeMachine {
  vi.useFakeTimers();
  onTestFinished(() => {
    vi.useRealTimers();
  });

  return {
    play: () => vi.setTimerTickMode('nextTimerAsync'),
    flush: async () => {
      await vi.runAllTimersAsync();
    },
    pause: () => vi.setTimerTickMode('manual'),
    seek: async (duration) => {
      await vi.advanceTimersByTimeAsync(duration);
    },
  };
}

interface TimeMachine {
  play: () => void;
  flush: () => Promise<void>;
  pause: () => void;
  seek: (duration: number) => Promise<void>;
}
