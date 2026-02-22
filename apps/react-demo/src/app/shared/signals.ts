import { useSignalEffect } from '@preact/signals-react';
import { useCallback, useState } from 'react';

export function useComputedValue<T>(fn: () => T): T {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  fn = useCallback(fn, []);
  const [value, setValue] = useState(fn());
  useSignalEffect(() => setValue(fn()));
  return value;
}
