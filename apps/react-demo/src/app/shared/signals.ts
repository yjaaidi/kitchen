import {
  Signal,
  untracked,
  useComputed,
  useSignalEffect,
} from '@preact/signals-react';
import { useState } from 'react';

export function useSignalValue<T>(signal: Signal<T>): T {
  const [value, setValue] = useState(untracked(() => signal.value));
  useSignalEffect(() => {
    setValue(signal.value);
  });
  return value;
}

export function useComputedValue<T>(fn: () => T): T {
  return useSignalValue(useComputed(fn));
}
