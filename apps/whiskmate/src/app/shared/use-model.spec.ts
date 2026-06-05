import { act, renderHook } from '@testing-library/react';
import { useModel } from './use-model';

afterEach(() => {
  jest.useRealTimers();
});

describe(useModel, () => {
  it('initializes the live value and debounce value', async () => {
    const { result } = await renderUseModel({ initialValue: 'initial' });
    expect(result.current.liveValue).toBe('initial');
    expect(result.current.debouncedValue).toBe('initial');
  });

  it('updates the live value only before debounce', async () => {
    const { result } = await renderUseModel({
      initialValue: 'initial',
      debounceDelay: 100,
    });
    act(() => result.current.setValue('changed'));

    expect(result.current.liveValue).toBe('changed');
    expect(result.current.debouncedValue).toBe('initial');
  });

  it('updates the debounced value after delay', async () => {
    jest.useFakeTimers();
    const { result } = await renderUseModel({
      initialValue: 'initial',
      debounceDelay: 100,
    });

    act(() => result.current.setValue('changed'));

    await act(() => jest.advanceTimersByTimeAsync(100));

    expect(result.current.liveValue).toBe('changed');
    expect(result.current.debouncedValue).toBe('changed');
  });

  it('resets values when the initial value changes', async () => {
    jest.useFakeTimers();
    const { rerender, result } = await renderUseModel({
      initialValue: 'initial',
      debounceDelay: 100,
    });

    act(() => result.current.setValue('changed'));
    await act(() => jest.advanceTimersByTimeAsync(50));

    rerender({ initialValue: 'reset' });

    expect(result.current.liveValue).toBe('reset');
    expect(result.current.debouncedValue).toBe('reset');
  });

  describe('onChange', () => {
    it('triggers onChange callback once after debounce delay', async () => {
      jest.useFakeTimers();

      const { onChangeSpy, result } = await renderUseModel({
        initialValue: 'initial',
        debounceDelay: 100,
      });
      act(() => result.current.setValue('changed'));
      await act(() => jest.advanceTimersByTimeAsync(50));
      act(() => result.current.setValue('changed again'));

      await act(() => jest.advanceTimersByTimeAsync(200));

      expect(onChangeSpy).toHaveBeenCalledTimes(1);
      expect(onChangeSpy).toHaveBeenCalledWith('changed again');
    });

    it('interrupts `onChange` callback if the initial value changes', async () => {
      jest.useFakeTimers();

      const { rerender, onChangeSpy, result } = await renderUseModel({
        initialValue: 'initial',
        debounceDelay: 100,
      });
      act(() => result.current.setValue('changed'));
      await act(() => jest.advanceTimersByTimeAsync(50));

      rerender({ initialValue: 'reset' });

      await act(() => jest.advanceTimersByTimeAsync(200));

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
  const onChangeSpy = jest.fn();

  const utils = renderHook(
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
