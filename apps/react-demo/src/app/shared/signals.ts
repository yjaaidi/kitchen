import type { ReadonlySignal } from '@preact/signals-core';
import { useSignalEffect } from '@preact/signals-react';
import { useCallback, useState } from 'react';

/**
 * Subscribe to a signal and return its value. Re-renders when the signal changes.
 */
export function useSignalValue<T>(sig: ReadonlySignal<T>): T {
  const [value, setValue] = useState(sig.value);
  useSignalEffect(() => {
    setValue(sig.value);
  });
  return value;
}

export function useComputedValue<T>(fn: () => T): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  fn = useCallback(fn, []);
  const [value, setValue] = useState(fn());
  useSignalEffect(() => {
    setValue(fn());
  });
  return value;
}
