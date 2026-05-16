import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BehaviorSubject, debounceTime, Observable, skip } from 'rxjs';

export interface UseModelProps<T> {
  initialValue: T;
  debounceDelay?: number;
  onChange?: (next: T) => void;
}

/**
 * Creates a model that is updated
 */
export function useModel<T>({
  initialValue,
  debounceDelay,
  onChange,
}: UseModelProps<T>) {
  const [liveValue, setLiveValue] = useLocalState(initialValue);
  const [debouncedValue, setDebouncedValue] = useLocalState(initialValue);
  const live$ = useMemo(
    () => new BehaviorSubject(initialValue),
    [initialValue],
  );

  const debounced$ = useMemo(() => {
    const source$ = live$.pipe(skip(1));
    return debounceDelay != null
      ? source$.pipe(debounceTime(debounceDelay))
      : source$;
  }, [live$, debounceDelay]);

  useObservable(
    live$,
    useCallback((value) => setLiveValue(value), [setLiveValue]),
  );

  useObservable(
    debounced$,
    useCallback(
      (value) => {
        setDebouncedValue(value);
        onChange?.(value);
      },
      [onChange, setDebouncedValue],
    ),
  );

  return {
    liveValue,
    debouncedValue,
    setValue: (next: T) => live$.next(next),
  };
}

/**
 * Creates a state that is reset whenever the initial value changes.
 */
function useLocalState<T>(initialValue: T): [T, (next: T) => void] {
  const isDirtyRef = useRef(false);
  const prevInitialValueRef = useRef(initialValue);
  const [dirtyValue, setDirtyValue] = useState(initialValue);

  if (prevInitialValueRef.current !== initialValue) {
    isDirtyRef.current = false;
    prevInitialValueRef.current = initialValue;
  }

  return [
    isDirtyRef.current ? dirtyValue : initialValue,
    useCallback(
      (next: T) => {
        isDirtyRef.current = true;
        setDirtyValue(next);
      },
      [setDirtyValue],
    ),
  ];
}

function useObservable<T>(source$: Observable<T>, next: (value: T) => void) {
  useEffect(() => {
    const sub = source$.subscribe(next);
    return () => sub.unsubscribe();
  }, [source$, next]);
}
