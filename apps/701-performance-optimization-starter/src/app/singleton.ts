const OVERRIDE_SYMBOL = Symbol('override');
const RESET_SYMBOL = Symbol('reset');

export function createSingleton<T>(factory: () => T): Singleton<T> {
  let value: T | undefined;
  return {
    get: () => (value ??= factory()),
    [OVERRIDE_SYMBOL]: (instance: T) => {
      value = instance;
    },
    [RESET_SYMBOL]: () => {
      value = undefined;
    },
  };
}

export interface Singleton<T> {
  get(): T;
  [OVERRIDE_SYMBOL](instance: T): void;
  [RESET_SYMBOL](): void;
}

export const singletonTesting = {
  override<T>(singleton: Singleton<T>, instance: T) {
    singleton[OVERRIDE_SYMBOL](instance);
  },
  reset<T>(singleton: Singleton<T>) {
    singleton[RESET_SYMBOL]();
  },
};
