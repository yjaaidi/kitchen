import { Observable, Unsubscribable } from 'rxjs';
import { type MockedFunction } from 'vitest';

export function observe<T>(observable: Subscribable<T>) {
  const next = createSpy<[T], void>();
  let isComplete = false;
  let isErrorRead = false;
  let err: unknown = undefined;

  const subscriber = {
    next,
    error(_err: unknown) {
      err = _err;
    },
    complete() {
      isComplete = true;
    },
  };

  /* Making our observer compatible with Angular's `OutputEmitterRef`,
   * which is tricky because `subscribe` has the same name but different signature. */
  const isObservable = 'pipe' in observable;
  const subscription = isObservable
    ? observable.subscribe(subscriber)
    : observable.subscribe(next);

  return {
    next,
    clear() {
      next.mockClear();
      err = undefined;
      isComplete = false;
    },
    get error() {
      isErrorRead = true;
      return err;
    },
    get isComplete() {
      return isComplete;
    },
    [Symbol.dispose]() {
      subscription.unsubscribe();
      if (!isErrorRead && err) {
        throw err;
      }
    },
  };
}

type Subscribable<T> =
  | Observable<T>
  | { subscribe(fn: (v: T) => void): Unsubscribable };

function createSpy<PARAMS extends unknown[], RETURN>(): MockedFunction<
  (...args: PARAMS) => RETURN
> {
  const global = globalThis as any;
  return global.vi ? global.vi.fn() : jest.fn();
}
