import { onTestFinished, vi } from 'vitest';

export function setUpTimeMachine(): TimeMachine {
  vi.useFakeTimers();
  onTestFinished(() => {
    vi.useRealTimers();
  });

  return {
    play: () => vi.setTimerTickMode('interval'),
    pause: () => vi.setTimerTickMode('manual'),
    fastForward: () => vi.setTimerTickMode('nextTimerAsync'),
    seek: async (duration) => {
      await vi.advanceTimersByTimeAsync(duration);
    },
    flush: async () => {
      await vi.runAllTimersAsync();
    },
  };
}

interface TimeMachine {
  play: () => void;
  pause: () => void;
  fastForward: () => void;
  seek: (duration: number) => Promise<void>;
  flush: () => Promise<void>;
}
