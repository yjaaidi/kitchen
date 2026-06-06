import { describe, expect, it, onTestFinished, vi } from 'vitest';
import { renderHook } from 'vitest-browser-react';
import { useModel } from './use-model';

describe(useModel, () => {
  it('initializes the live value and debounce value', async () => {
    const { result } = await renderUseModel({ initialValue: 'initial' });
    expect.soft(result.current.liveValue).toBe('initial');
    expect.soft(result.current.debouncedValue).toBe('initial');
  });

  it('updates the live value only before debounce', async () => {
    const { act, result } = await renderUseModel({
      initialValue: 'initial',
      debounceDelay: 100,
    });
    await act(() => result.current.setValue('changed'));

    expect.soft(result.current.liveValue).toBe('changed');
    expect.soft(result.current.debouncedValue).toBe('initial');
  });

  it('updates the debounced value after delay', async () => {
    setUpFakeTimers();
    const { act, result } = await renderUseModel({
      initialValue: 'initial',
      debounceDelay: 100,
    });

    await act(() => result.current.setValue('changed'));

    await act(() => vi.advanceTimersByTimeAsync(100));

    expect.soft(result.current.liveValue).toBe('changed');
    expect.soft(result.current.debouncedValue).toBe('changed');
  });

  it('resets values when the initial value changes', async () => {
    setUpFakeTimers();
    const { act, rerender, result } = await renderUseModel({
      initialValue: 'initial',
      debounceDelay: 100,
    });

    await act(() => result.current.setValue('changed'));
    await act(() => vi.advanceTimersByTimeAsync(50));

    await rerender({ initialValue: 'reset' });

    expect.soft(result.current.liveValue).toBe('reset');
    expect.soft(result.current.debouncedValue).toBe('reset');
  });

  describe('onChange', () => {
    it('triggers onChange callback once after debounce delay', async () => {
      setUpFakeTimers();

      const { act, onChangeSpy, result } = await renderUseModel({
        initialValue: 'initial',
        debounceDelay: 100,
      });
      await act(() => result.current.setValue('changed'));
      await act(() => vi.advanceTimersByTimeAsync(50));
      await act(() => result.current.setValue('changed again'));

      await vi.advanceTimersByTimeAsync(200);

      expect(onChangeSpy).toHaveBeenCalledExactlyOnceWith('changed again');
    });

    it('interrupts `onChange` callback if the initial value changes', async () => {
      setUpFakeTimers();

      const { act, rerender, onChangeSpy, result } = await renderUseModel({
        initialValue: 'initial',
        debounceDelay: 100,
      });
      await act(() => result.current.setValue('changed'));
      await act(() => vi.advanceTimersByTimeAsync(50));

      await rerender({ initialValue: 'reset' });

      await vi.advanceTimersByTimeAsync(200);

      expect(onChangeSpy).not.toHaveBeenCalled();
    });
  });
});

async function renderUseModel({
  initialValue,
  debounceDelay,
}: {
  initialValue: string;
  debounceDelay?: number;
}) {
  const onChangeSpy = vi.fn();

  const utils = await renderHook(
    (
      props: { initialValue: string; debounceDelay?: number } = {
        initialValue,
        debounceDelay,
      },
    ) => useModel({ ...props, onChange: onChangeSpy }),
  );

  return {
    ...utils,
    onChangeSpy,
  };
}

function setUpFakeTimers() {
  vi.useFakeTimers();
  onTestFinished(() => {
    vi.useRealTimers();
  });
}
